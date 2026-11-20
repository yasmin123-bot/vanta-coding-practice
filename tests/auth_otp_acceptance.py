"""Browser acceptance for the email OTP UI with a local-only mocked Supabase Auth API.

Run a Vite server with VITE_SUPABASE_URL=https://mabda-auth.invalid and a dummy
sb_publishable_ key, then set BASE_URL to that local server. All non-local requests
are aborted and the .invalid Auth origin is fulfilled by this test; no real email,
Supabase project, or user account is contacted.
"""
import base64
import json
import os
import time
import traceback
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
from browser_origin import is_same_origin, sanitize_diagnostic_text, validate_local_base_url, validate_test_mock_url

BASE = validate_local_base_url(os.environ.get('BASE_URL', 'http://127.0.0.1:5174'))
MOCK_ORIGIN = validate_test_mock_url(os.environ.get('MOCK_SUPABASE_URL', 'https://mabda-auth.invalid'))
checks = []
page_errors = []
auth_calls = []


def check(name, passed, detail=None):
    checks.append({'name': name, 'passed': bool(passed), 'detail': detail})
    if not passed:
        raise AssertionError(f'{name}: {detail}')


def user_for(email, user_id='otp-test-user'):
    now = int(time.time())
    return {
        'id': user_id,
        'aud': 'authenticated',
        'role': 'authenticated',
        'email': email,
        'email_confirmed_at': '2026-11-19T18:00:00.000Z',
        'phone': '',
        'confirmed_at': '2026-11-19T18:00:00.000Z',
        'last_sign_in_at': '2026-11-19T18:00:00.000Z',
        'app_metadata': {'provider': 'email', 'providers': ['email']},
        'user_metadata': {'full_name': 'OTP Browser Test'},
        'identities': [],
        'created_at': '2026-11-19T18:00:00.000Z',
        'updated_at': '2026-11-19T18:00:00.000Z',
        'factors': [],
        'now': now,
    }


def jwt_payload(user_id):
    data = json.dumps({'sub': user_id, 'aud': 'authenticated', 'role': 'authenticated', 'exp': int(time.time()) + 3600}).encode()
    return base64.urlsafe_b64encode(data).decode().rstrip('=')


def session_payload(user):
    access_token = f'e30.{jwt_payload(user["id"])}.local-test-signature'
    expires_at = int(time.time()) + 3600
    return {
        'access_token': access_token,
        'token_type': 'bearer',
        'expires_in': 3600,
        'expires_at': expires_at,
        'refresh_token': 'local-test-refresh-token',
        'user': user,
    }


def json_response(route, status, value):
    route.fulfill(
        status=status,
        content_type='application/json',
        headers={
            'access-control-allow-origin': '*',
            'access-control-allow-headers': 'apikey,authorization,content-type,x-client-info',
            'access-control-allow-methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
        },
        body=json.dumps(value),
    )


def handle_request(route):
    request = route.request
    url = urlparse(request.url)
    if is_same_origin(request.url, BASE):
        route.continue_()
        return
    if not is_same_origin(request.url, MOCK_ORIGIN):
        route.abort()
        return
    if request.method == 'OPTIONS':
        route.fulfill(status=204, headers={
            'access-control-allow-origin': '*',
            'access-control-allow-headers': 'apikey,authorization,content-type,x-client-info',
            'access-control-allow-methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
        })
        return

    body = request.post_data_json if request.post_data else {}
    auth_calls.append({'method': request.method, 'path': url.path, 'body': body})
    email = body.get('email', 'otp-test@example.invalid')

    if url.path.endswith('/auth/v1/signup'):
        json_response(route, 200, {'user': user_for(email), 'session': None})
    elif url.path.endswith('/auth/v1/recover'):
        json_response(route, 200, {})
    elif url.path.endswith('/auth/v1/resend'):
        json_response(route, 200, {'message_id': 'local-mock-message'})
    elif url.path.endswith('/auth/v1/verify'):
        token = body.get('token') or body.get('token_hash')
        if token == '000000':
            json_response(route, 403, {'code': 'otp_expired', 'message': 'Email OTP expired'})
        elif token != ('123456' if body.get('type') == 'email' else '654321'):
            json_response(route, 403, {'code': 'invalid_otp', 'message': 'Invalid email OTP'})
        else:
            user = user_for(email, f'otp-{body.get("type", "verified")}')
            json_response(route, 200, session_payload(user))
    elif url.path.endswith('/auth/v1/user') and request.method in ('PATCH', 'PUT'):
        user = user_for(email, 'otp-recovery-user')
        user['user_metadata']['password_updated_by_mock'] = True
        json_response(route, 200, user)
    elif url.path.endswith('/auth/v1/user'):
        json_response(route, 200, user_for(email))
    elif url.path.endswith('/rest/v1/profiles'):
        json_response(route, 200, [{
            'user_id': 'otp-test-user',
            'display_name': 'OTP Browser Test',
            'avatar_path': None,
            'created_at': '2026-11-19T18:00:00.000Z',
            'updated_at': '2026-11-19T18:00:00.000Z',
        }])
    elif url.path.startswith('/rest/v1/'):
        json_response(route, 200, [])
    elif url.path.endswith('/auth/v1/token'):
        user = user_for(email)
        json_response(route, 200, session_payload(user))
    else:
        json_response(route, 200, {})


def set_locale(page, locale):
    page.goto(BASE + '/login', wait_until='domcontentloaded')
    page.evaluate('locale => localStorage.setItem("vanta-locale", locale)', locale)
    page.goto(BASE + ('/signup' if locale == 'ar' else '/login'), wait_until='domcontentloaded')
    page.locator('[data-testid="welcome-intro"], [data-testid="auth-page"]').first.wait_for(state='visible')
    intro_next = page.locator('.mabda-intro-next')
    if intro_next.count():
        intro_next.click()
    page.locator('[data-testid="auth-page"]').wait_for(state='visible')


def advance_resend_clock(page):
    page.evaluate('''() => {
      const originalNow = Date.now.bind(Date);
      Date.now = () => originalNow() + 61000;
    }''')
    page.wait_for_function('''() => {
      const button = [...document.querySelectorAll('.student-auth-otp-actions button')][0];
      return button && !button.disabled;
    }''', timeout=5000)


def run_signup(browser):
    context = browser.new_context(viewport={'width': 390, 'height': 844})
    page = context.new_page()
    page.on('pageerror', lambda error: page_errors.append(sanitize_diagnostic_text(getattr(error, 'stack', None) or str(error))))
    page.route('**/*', handle_request)
    set_locale(page, 'ar')
    page.set_viewport_size({'width': 390, 'height': 844})
    check('signup/ar: RTL mobile form loads without horizontal overflow', page.locator('[data-testid="auth-page"]').is_visible() and page.evaluate('document.documentElement.dir === "rtl" && document.documentElement.scrollWidth <= innerWidth + 1'))
    page.locator('#auth-full-name').fill('اختبار المتصفح')
    page.locator('#auth-email').fill('otp-test@example.invalid')
    page.locator('#auth-password').fill('Strong-Password-123!')
    page.locator('#auth-confirm-password').fill('Strong-Password-123!')
    page.locator('form.mabda-auth-form').first.locator('button[type="submit"]').click()
    page.locator('#auth-email-otp').wait_for(state='visible')
    check('signup: creates a pending OTP step instead of entering the app', page.locator('#auth-password').count() == 0 and page.locator('#auth-email-otp').is_visible())
    signup_call = next(call for call in auth_calls if call['path'].endswith('/auth/v1/signup'))
    check('signup: calls Supabase signup with the entered email and password', signup_call['body'].get('email') == 'otp-test@example.invalid' and signup_call['body'].get('password') == 'Strong-Password-123!')
    check('signup: verify action starts within the resend cooldown', page.locator('.student-auth-otp-actions button').first.is_disabled())

    for index in range(5):
        code = '000000' if index == 0 else '111111'
        page.locator('#auth-email-otp').fill(code)
        page.locator('form.mabda-auth-otp-form button[type="submit"]').click()
        if index == 0:
            page.get_by_role('alert').filter(has_text='انتهت صلاحية الرمز').wait_for()
        elif index == 4:
            page.get_by_role('alert').filter(has_text='بلغت حد المحاولات').wait_for()
        else:
            page.get_by_role('alert').filter(has_text='الرمز غير صحيح').wait_for()
    check('signup: expired, invalid and attempt-limit states are explicit', page.locator('form.mabda-auth-otp-form button[type="submit"]').is_disabled())
    advance_resend_clock(page)
    page.locator('.student-auth-otp-actions button').first.click()
    page.get_by_role('status').filter(has_text='أُرسل طلب رمز جديد').wait_for()
    check('signup: resend calls the typed Supabase signup-resend endpoint', any(call['path'].endswith('/auth/v1/resend') and call['body'].get('type') == 'signup' for call in auth_calls))

    page.locator('#auth-email-otp').fill('١٢٣٤٥٦')
    page.locator('form.mabda-auth-otp-form button[type="submit"]').click()
    page.wait_for_url('**/dashboard', wait_until='domcontentloaded', timeout=12000)
    verify_calls = [call for call in auth_calls if call['path'].endswith('/auth/v1/verify')]
    check('signup: Arabic numerals are normalized and verified as email OTP', verify_calls[-1]['body'].get('token') == '123456' and verify_calls[-1]['body'].get('type') == 'email')
    check('signup: enters the app only after successful email OTP verification', page.url.endswith('/dashboard') and page_errors == [])
    context.close()


def run_recovery(browser):
    context = browser.new_context(viewport={'width': 1280, 'height': 800})
    page = context.new_page()
    page.on('pageerror', lambda error: page_errors.append(sanitize_diagnostic_text(getattr(error, 'stack', None) or str(error))))
    page.route('**/*', handle_request)
    set_locale(page, 'en')
    page.set_viewport_size({'width': 1280, 'height': 800})
    page.goto(BASE + '/forgot-password', wait_until='domcontentloaded')
    page.locator('[data-testid="auth-page"]').wait_for(state='visible')
    check('recovery/en: LTR desktop form loads without horizontal overflow', page.locator('[data-testid="auth-page"]').is_visible() and page.evaluate('document.documentElement.dir === "ltr" && document.documentElement.scrollWidth <= innerWidth + 1'))
    page.locator('#auth-email').fill('otp-test@example.invalid')
    page.locator('form.mabda-auth-form').first.locator('button[type="submit"]').click()
    page.locator('#auth-email-otp').wait_for(state='visible')
    check('recovery: does not show a new-password form before verifying a code', page.locator('#auth-password').count() == 0)

    page.locator('#auth-email-otp').fill('111111')
    page.locator('form.mabda-auth-otp-form button[type="submit"]').click()
    page.get_by_role('alert').filter(has_text='That code is incorrect').wait_for()
    page.locator('#auth-email-otp').fill('000000')
    page.locator('form.mabda-auth-otp-form button[type="submit"]').click()
    page.get_by_role('alert').filter(has_text='That code has expired').wait_for()
    check('recovery: invalid and expired OTP errors are distinct', page.locator('#auth-password').count() == 0)
    advance_resend_clock(page)
    page.locator('.student-auth-otp-actions button').first.click()
    page.get_by_role('status').filter(has_text='A new code request was sent').wait_for()
    check('recovery: resend requests a new recovery email through Supabase Auth', sum(call['path'].endswith('/auth/v1/recover') for call in auth_calls) >= 2)

    page.locator('#auth-email-otp').fill('654321')
    page.locator('form.mabda-auth-otp-form button[type="submit"]').click()
    page.locator('#auth-confirm-password').wait_for(state='visible')
    check('recovery: shows new password only after server-verified recovery OTP', page.locator('#auth-password').is_visible() and page.locator('#auth-confirm-password').is_visible())
    page.locator('#auth-password').fill('New-Strong-Password-456!')
    page.locator('#auth-confirm-password').fill('New-Strong-Password-456!')
    page.locator('form.mabda-auth-form').first.locator('button[type="submit"]').click()
    page.locator('.student-form-success').filter(has_text='Your password has been updated').wait_for()
    update_call = next(call for call in auth_calls if call['method'] in ('PATCH', 'PUT') and call['path'].endswith('/auth/v1/user'))
    check('recovery: updates the password through the authenticated Supabase user endpoint', update_call['body'].get('password') == 'New-Strong-Password-456!')
    check('recovery: confirms success and offers return to sign in', page.locator('.student-callback-state a[href^="/login"]').is_visible() and page_errors == [])
    context.close()


try:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])
        run_signup(browser)
        run_recovery(browser)
        browser.close()
except Exception as error:
    checks.append({'name': 'acceptance harness completed without exception', 'passed': False, 'detail': sanitize_diagnostic_text(error)})
    page_errors.append(sanitize_diagnostic_text(traceback.format_exc()))

result = {
    'base_url': BASE,
    'mock_auth_origin': MOCK_ORIGIN,
    'scope': 'local Playwright only; mock email/Supabase responses; non-local unmocked requests aborted; no real email or account activity',
    'passed': sum(item['passed'] for item in checks),
    'failed': sum(not item['passed'] for item in checks),
    'checks': checks,
    'page_errors': page_errors,
    'auth_request_count': len(auth_calls),
}
print(json.dumps(result, ensure_ascii=False, indent=2))
if result['failed']:
    raise SystemExit(1)
