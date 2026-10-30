"""Profile avatar UI acceptance with a synthetic local session and intercepted Supabase requests.

This exercises the real React screen and storage service contract without using credentials
or writing to the hosted Supabase project.
"""
import base64
import json
import os
import re
import struct
import time
import traceback
import zlib
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE_URL', 'http://127.0.0.1:5175').rstrip('/')
OUT = Path(os.environ.get('EVIDENCE_DIR', '/tmp/mabda-profile-avatar-acceptance'))
OUT.mkdir(parents=True, exist_ok=True)
RESULT = {
    'base_url': BASE,
    'test_mode': 'synthetic session; Supabase endpoints intercepted; no credentials or hosted writes',
    'checks': [],
    'errors': [],
    'api': {'uploads': 0, 'profile_updates': 0, 'signed_urls': 0, 'list_calls': 0, 'object_removals': 0},
}


def check(name, condition, detail=None):
    RESULT['checks'].append({'name': name, 'passed': bool(condition), 'detail': detail})
    if not condition:
        raise AssertionError(f'{name}: {detail}')


def read_supabase_url():
    if os.environ.get('VITE_SUPABASE_URL'):
        return os.environ['VITE_SUPABASE_URL'].strip().strip('"\'').rstrip('/')
    for filename in ['.env.local', '.env']:
        path = Path(filename)
        if not path.exists():
            continue
        for line in path.read_text().splitlines():
            match = re.match(r'^\s*VITE_SUPABASE_URL\s*=\s*(.+?)\s*$', line)
            if match:
                return match.group(1).strip().strip('"\'').rstrip('/')
    raise RuntimeError('VITE_SUPABASE_URL is unavailable to the local acceptance test.')


SUPABASE_URL = read_supabase_url()
PROJECT_REF = urlparse(SUPABASE_URL).hostname.split('.')[0]
AUTH_STORAGE_KEY = f'sb-{PROJECT_REF}-auth-token'
USER_ID = '00000000-0000-4000-8000-000000000077'
AVATAR_PATH = f'{USER_ID}/avatar.png'
PROFILE = {
    'user_id': USER_ID,
    'display_name': 'Local Test Learner',
    'avatar_path': None,
    'created_at': '2026-01-01T00:00:00Z',
    'updated_at': '2026-01-01T00:00:00Z',
}


def fake_session():
    return {
        'access_token': 'local-test-access-token',
        'refresh_token': 'local-test-refresh-token',
        'token_type': 'bearer',
        'expires_in': 3600,
        'expires_at': int(time.time()) + 3600,
        'user': {
            'id': USER_ID,
            'aud': 'authenticated',
            'role': 'authenticated',
            'email': 'local-test@example.invalid',
            'email_confirmed_at': '2026-01-01T00:00:00Z',
            'created_at': '2026-01-01T00:00:00Z',
            'user_metadata': {'full_name': 'Local Test Learner'},
            'app_metadata': {'provider': 'email', 'providers': ['email']},
        },
    }


def png_fixture():
    def chunk(kind, payload):
        return struct.pack('!I', len(payload)) + kind + payload + struct.pack('!I', zlib.crc32(kind + payload) & 0xffffffff)
    raw = b'\x00\xe4\xa6\x4a\xff'
    return (
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', struct.pack('!2I5B', 1, 1, 8, 6, 0, 0, 0))
        + chunk(b'IDAT', zlib.compress(raw))
        + chunk(b'IEND', b'')
    )


PNG = png_fixture()


def fulfill(route, status=200, body=None, content_type='application/json', headers=None):
    payload = body if isinstance(body, (bytes, bytearray)) else json.dumps(body if body is not None else {}).encode()
    response_headers = {'content-type': content_type, **(headers or {})}
    route.fulfill(status=status, body=payload, headers=response_headers)


def mock_supabase(route):
    request = route.request
    path = urlparse(request.url).path
    method = request.method.upper()

    if path.endswith('/auth/v1/logout'):
        route.fulfill(status=204, body='')
        return
    if '/auth/v1/' in path:
        fulfill(route, body={})
        return

    if path.endswith('/rest/v1/profiles'):
        if method == 'GET':
            fulfill(route, body=PROFILE, headers={'content-range': '0-0/1'})
            return
        if method == 'PATCH':
            body = request.post_data_json or {}
            PROFILE.update(body)
            RESULT['api']['profile_updates'] += 1
            fulfill(route, body=PROFILE, headers={'content-range': '0-0/1'})
            return
        if method == 'POST':
            fulfill(route, status=201, body=PROFILE)
            return

    if '/rest/v1/path_progress' in path or '/rest/v1/lesson_progress' in path:
        fulfill(route, body=[], headers={'content-range': '0-0/0'})
        return

    if '/storage/v1/object/list/profile-avatars' in path:
        RESULT['api']['list_calls'] += 1
        fulfill(route, body=[])
        return

    if '/storage/v1/object/sign/profile-avatars/' in path and method == 'POST':
        RESULT['api']['signed_urls'] += 1
        signed_path = path.split('/storage/v1', 1)[1]
        fulfill(route, body={'signedURL': signed_path + '?token=local-test'})
        return
    if '/storage/v1/object/sign/profile-avatars/' in path and method == 'GET':
        route.fulfill(status=200, body=PNG, headers={'content-type': 'image/png', 'cache-control': 'no-store'})
        return

    if '/storage/v1/object/profile-avatars/' in path and method in {'POST', 'PUT'}:
        RESULT['api']['uploads'] += 1
        fulfill(route, status=200, body={'Key': f'profile-avatars/{AVATAR_PATH}'})
        return
    if '/storage/v1/object/profile-avatars' in path and method == 'DELETE':
        RESULT['api']['object_removals'] += 1
        fulfill(route, body={'message': 'removed'})
        return

    if '/rest/v1/' in path:
        fulfill(route, body=[], headers={'content-range': '0-0/0'})
        return
    fulfill(route, body={})


def add_synthetic_session(page, locale='en', theme='light'):
    serialized_session = json.dumps(fake_session())
    key = json.dumps(AUTH_STORAGE_KEY)
    page.add_init_script(f'''(() => {{
      localStorage.setItem({key}, {json.dumps(serialized_session)});
      localStorage.setItem('vanta-locale', {json.dumps(locale)});
      localStorage.setItem('mabda-theme', {json.dumps(theme)});
      localStorage.setItem('mabda-has-seen-intro', 'true');
    }})()''')


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])

        matrix = [
            ('ar', 'light', 390, 844),
            ('en', 'dark', 1440, 960),
            ('ar', 'dark', 768, 1024),
            ('en', 'light', 390, 844),
        ]
        for locale, theme, width, height in matrix:
            context = browser.new_context(viewport={'width': width, 'height': height}, locale='ar' if locale == 'ar' else 'en-US')
            page = context.new_page()
            page.set_default_timeout(15000)
            add_synthetic_session(page, locale, theme)
            page.route(SUPABASE_URL + '/**', mock_supabase)
            page.on('pageerror', lambda error: RESULT['errors'].append(str(error)))
            page.on('console', lambda message: RESULT['errors'].append(message.text) if message.type == 'error' else None)
            page.goto(BASE + '/profile', wait_until='domcontentloaded')
            page.get_by_role('heading', name='ملفك الشخصي' if locale == 'ar' else 'Your profile').wait_for()
            page.wait_for_function("document.documentElement.dataset.theme === " + json.dumps(theme))
            check(f'{locale}-{theme}-{width}: profile route loads', page.url.endswith('/profile'))
            check(f'{locale}-{theme}-{width}: document direction', page.locator('html').get_attribute('dir') == ('rtl' if locale == 'ar' else 'ltr'))
            check(f'{locale}-{theme}-{width}: theme applied', page.locator('html').get_attribute('data-theme') == theme)
            check(f'{locale}-{theme}-{width}: profile avatar and upload control visible', page.locator('.student-profile-panel .mabda-student-avatar').is_visible() and page.locator('input[type="file"][accept*="image/png"]').count() == 1)
            check(f'{locale}-{theme}-{width}: header avatar link exists', page.locator('.mabda-app-avatar-link .mabda-student-avatar--header').count() == 1)
            check(f'{locale}-{theme}-{width}: no horizontal overflow', page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'))
            if locale == 'ar' and width == 390:
                page.screenshot(path=str(OUT / 'profile-avatar-ar-mobile.png'), full_page=True)
            if locale == 'en' and theme == 'dark':
                page.screenshot(path=str(OUT / 'profile-avatar-en-dark-desktop.png'), full_page=True)
            context.close()

        # Real UI/service path with a local synthetic account and fully intercepted network.
        PROFILE['avatar_path'] = f'{USER_ID}/avatar.jpg'
        context = browser.new_context(viewport={'width': 390, 'height': 844}, locale='ar')
        page = context.new_page()
        page.set_default_timeout(15000)
        add_synthetic_session(page, 'ar', 'dark')
        page.route(SUPABASE_URL + '/**', mock_supabase)
        page.on('pageerror', lambda error: RESULT['errors'].append(str(error)))
        page.on('console', lambda message: RESULT['errors'].append(message.text) if message.type == 'error' else None)
        page.goto(BASE + '/profile', wait_until='domcontentloaded')
        page.get_by_role('heading', name='ملفك الشخصي').wait_for()
        input_file = page.locator('input[type="file"]')
        input_file.set_input_files({'name': 'notes.txt', 'mimeType': 'text/plain', 'buffer': b'not an image'})
        page.get_by_text('نوع الملف غير مدعوم. اختر صورة JPG أو PNG أو WebP.').wait_for()
        check('unsupported file type is rejected in Arabic UI', RESULT['api']['uploads'] == 0)
        input_file.set_input_files({'name': 'large.png', 'mimeType': 'image/png', 'buffer': PNG + bytes(5 * 1024 * 1024 + 1 - len(PNG))})
        page.get_by_text('حجم الصورة يتجاوز الحد الأقصى، وهو 5 ميجابايت.').wait_for()
        check('file above 5 MiB is rejected in Arabic UI', RESULT['api']['uploads'] == 0)
        input_file.set_input_files({'name': 'fake.png', 'mimeType': 'image/png', 'buffer': b'not a real image'})
        page.get_by_role('button', name='حفظ الصورة').click()
        page.get_by_text('تعذر التحقق من محتوى الصورة. اختر ملف صورة صالحًا.').wait_for()
        check('invalid image signature is rejected before upload', RESULT['api']['uploads'] == 0)
        page.locator('input[type="file"]').set_input_files({'name': 'avatar.png', 'mimeType': 'image/png', 'buffer': PNG})
        page.locator('.student-profile-avatar-selection').wait_for(state='visible')
        check('local preview appears before upload', page.locator('.student-profile-panel .mabda-student-avatar img').is_visible())
        page.get_by_role('button', name='حفظ الصورة').click()
        page.get_by_text('تم حفظ الصورة الشخصية.').wait_for()
        check('upload updates real service path and confirms success', RESULT['api']['uploads'] == 1 and RESULT['api']['profile_updates'] == 1)
        check('old-object listing runs after successful save', RESULT['api']['list_calls'] >= 1)
        check('previous avatar object is removed after successful replacement', RESULT['api']['object_removals'] == 1)
        page.screenshot(path=str(OUT / 'profile-avatar-saved-ar-dark-mobile.png'), full_page=True)

        # Reload to verify that the UI re-reads the persisted path and requests a fresh signed URL.
        page.reload(wait_until='domcontentloaded')
        page.get_by_role('heading', name='ملفك الشخصي').wait_for()
        page.wait_for_function("document.querySelector('.student-profile-panel .mabda-student-avatar img')?.complete === true")
        check('reload restores photo from persisted profile path via signed URL', PROFILE['avatar_path'] == AVATAR_PATH and RESULT['api']['signed_urls'] >= 1)
        check('no horizontal overflow after avatar save/reload', page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth'))
        context.close()
        browser.close()


try:
    run()
except Exception:
    RESULT['failure'] = traceback.format_exc()
finally:
    (OUT / 'results.json').write_text(json.dumps(RESULT, ensure_ascii=False, indent=2))
    print(json.dumps({
        'passed': sum(item['passed'] for item in RESULT['checks']),
        'total': len(RESULT['checks']),
        'errors': RESULT['errors'],
        'failure': RESULT.get('failure'),
        'api': RESULT['api'],
        'test_mode': RESULT['test_mode'],
        'evidence': str(OUT),
    }, ensure_ascii=False, indent=2))
if RESULT.get('failure') or RESULT['errors']:
    raise SystemExit(1)
