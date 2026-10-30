"""Route-guard and logout acceptance using a synthetic local session only.

All Supabase Auth/PostgREST requests are intercepted by Playwright. This test never
submits credentials and never writes to the hosted project.
"""
import json
import os
import re
import time
import traceback
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE_URL', 'http://127.0.0.1:5175').rstrip('/')
OUT = Path(os.environ.get('EVIDENCE_DIR', '/tmp/mabda-auth-logout-acceptance'))
OUT.mkdir(parents=True, exist_ok=True)
RESULT = {
    'base_url': BASE,
    'auth_mode': 'synthetic browser-only session; Supabase endpoints intercepted; no credentials or cloud writes',
    'checks': [],
    'errors': [],
}


def check(name, condition, detail=None):
    RESULT['checks'].append({'name': name, 'passed': bool(condition), 'detail': detail})
    if not condition:
        raise AssertionError(f'{name}: {detail}')


def read_public_supabase_url():
    if os.environ.get('VITE_SUPABASE_URL'):
        return os.environ['VITE_SUPABASE_URL'].strip().strip('"\'')
    for filename in ['.env.local', '.env']:
        file = Path(filename)
        if not file.exists():
            continue
        for line in file.read_text().splitlines():
            match = re.match(r'^\s*VITE_SUPABASE_URL\s*=\s*(.+?)\s*$', line)
            if match:
                return match.group(1).strip().strip('"\'')
    raise RuntimeError('VITE_SUPABASE_URL is unavailable to the local auth acceptance test.')


SUPABASE_URL = read_public_supabase_url().rstrip('/')
PROJECT_REF = urlparse(SUPABASE_URL).hostname.split('.')[0]
AUTH_STORAGE_KEY = f'sb-{PROJECT_REF}-auth-token'


def fake_session():
    user_id = '00000000-0000-4000-8000-000000000077'
    return {
        'access_token': 'local-test-access-token',
        'refresh_token': 'local-test-refresh-token',
        'token_type': 'bearer',
        'expires_in': 3600,
        'expires_at': int(time.time()) + 3600,
        'user': {
            'id': user_id,
            'aud': 'authenticated',
            'role': 'authenticated',
            'email': 'local-test@example.invalid',
            'email_confirmed_at': '2026-01-01T00:00:00Z',
            'created_at': '2026-01-01T00:00:00Z',
            'user_metadata': {'full_name': 'Local Test Learner'},
            'app_metadata': {'provider': 'email', 'providers': ['email']},
        },
    }


def mock_supabase(route):
    request = route.request
    url = request.url
    if '/auth/v1/logout' in url:
        route.fulfill(status=204, body='')
        return
    if '/auth/v1/' in url:
        route.fulfill(status=200, content_type='application/json', body='{}')
        return
    if '/rest/v1/profiles' in url and request.method == 'POST':
        route.fulfill(
            status=201,
            content_type='application/json',
            body=json.dumps({
                'user_id': fake_session()['user']['id'],
                'display_name': 'Local Test Learner',
                'created_at': '2026-01-01T00:00:00Z',
                'updated_at': '2026-01-01T00:00:00Z',
            }),
        )
        return
    if '/rest/v1/' in url:
        route.fulfill(status=200, content_type='application/json', body='[]', headers={'content-range': '0-0/0'})
        return
    route.fulfill(status=200, body='{}')


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])

        # Refreshing a protected URL with no session must wait for Auth and then leave it.
        guard_context = browser.new_context(viewport={'width': 390, 'height': 844})
        guard_page = guard_context.new_page()
        guard_page.set_default_timeout(12000)
        guard_page.add_init_script('localStorage.removeItem(' + json.dumps(AUTH_STORAGE_KEY) + '); localStorage.removeItem("mabda-has-seen-intro"); sessionStorage.removeItem("mabda-has-seen-intro");')
        guard_page.on('pageerror', lambda error: RESULT['errors'].append(str(error)))
        guard_page.goto(BASE + '/dashboard', wait_until='domcontentloaded')
        guard_page.wait_for_url(re.compile(r'/login(?:\?.*)?$'))
        guard_page.locator('[data-testid="welcome-intro"]').wait_for()
        check('unauthenticated refresh leaves protected dashboard', guard_page.url.startswith(BASE + '/login'))
        check('guard opens Intro after redirect when not previously completed', guard_page.locator('[data-testid="welcome-intro"]').is_visible())
        check('protected dashboard content is not exposed', guard_page.locator('.mabda-home-welcome').count() == 0)
        guard_context.close()

        # A synthetic persisted session exercises the actual provider and signOut method,
        # while all network calls remain local stubs and cannot touch Supabase.
        context = browser.new_context(viewport={'width': 390, 'height': 844}, locale='en-US')
        page = context.new_page()
        page.set_default_timeout(12000)
        session = json.dumps(fake_session())
        key = json.dumps(AUTH_STORAGE_KEY)
        page.add_init_script(f'''(() => {{
          if (sessionStorage.getItem("mabda-auth-test-seeded") === "true") return;
          localStorage.setItem({key}, {json.dumps(session)});
          localStorage.setItem("mabda-has-seen-intro", "true");
          sessionStorage.setItem("mabda-auth-test-seeded", "true");
        }})()''')
        page.route(SUPABASE_URL + '/**', mock_supabase)
        page.on('pageerror', lambda error: RESULT['errors'].append(str(error)))
        page.on('console', lambda message: RESULT['errors'].append(message.text) if message.type == 'error' else None)
        page.goto(BASE + '/dashboard', wait_until='domcontentloaded')
        page.locator('.mabda-home-welcome').wait_for()
        check('synthetic authenticated session opens protected dashboard', page.locator('.mabda-home-welcome').is_visible())
        check('intro previously marked as complete', page.evaluate('localStorage.getItem("mabda-has-seen-intro") === "true"'))

        navigations = []
        page.on('framenavigated', lambda frame: navigations.append(frame.url) if frame == page.main_frame else None)
        page.locator('.mabda-app-menu-trigger').click()
        page.locator('.mabda-app-drawer').wait_for(state='visible')
        page.locator('button.student-nav-logout').click()
        page.wait_for_url(BASE + '/')
        page.locator('.mabda-home-hero h1').wait_for()
        check('logout returns to public landing, not Login', page.url == BASE + '/')
        check('landing page is shown after logout', page.locator('.mabda-home-hero h1').is_visible())
        check('intro completion is cleared after logout', page.evaluate('localStorage.getItem("mabda-has-seen-intro") === null && sessionStorage.getItem("mabda-has-seen-intro") === null'))
        check('no Login route flash during logout navigation', all(urlparse(url).path != '/login' for url in navigations))
        check('logged-out page does not expose authenticated welcome', page.locator('.mabda-home-welcome').count() == 0)
        page.screenshot(path=str(OUT / 'logged-out-landing.png'), full_page=True)

        page.locator('.mabda-app-menu-trigger').click()
        page.locator('.mabda-app-drawer').wait_for(state='visible')
        page.locator('a[href="/login"]').first.click()
        page.locator('[data-testid="welcome-intro"]').wait_for()
        check('sign-in opened after logout starts from Intro', page.locator('[data-testid="welcome-intro"]').is_visible())
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
        'auth_mode': RESULT['auth_mode'],
        'evidence': str(OUT),
    }, ensure_ascii=False, indent=2))
if RESULT.get('failure') or RESULT['errors']:
    raise SystemExit(1)
