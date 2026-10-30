"""Intro/Auth browser acceptance. No real sign-up, login or Supabase writes are submitted.
Run against the existing Vite preview with BASE_URL, CHROMIUM_PATH and EVIDENCE_DIR optional.
"""
import json
import os
import traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE_URL', 'http://127.0.0.1:5175').rstrip('/')
OUT = Path(os.environ.get('EVIDENCE_DIR', '/tmp/mabda-auth-intro-acceptance'))
OUT.mkdir(parents=True, exist_ok=True)
RESULT = {'base_url': BASE, 'checks': [], 'errors': [], 'screenshots': [], 'auth_submission': 'NOT SUBMITTED: requires a real student account; no cloud writes made'}


def check(name, condition, detail=None):
    RESULT['checks'].append({'name': name, 'passed': bool(condition), 'detail': detail})
    if not condition:
        raise AssertionError(f'{name}: {detail}')


def ratio(page, selector, color_property='color'):
    return page.locator(selector).first.evaluate('''(el, property) => {
      const parse = (value) => {
        const match = value.match(/rgba?\\(([^)]+)\\)/);
        if (!match) return null;
        const parts = match[1].split(',').map((part) => parseFloat(part.trim()));
        return { rgb: parts.slice(0, 3), alpha: parts.length > 3 ? parts[3] : 1 };
      };
      let node = el;
      let background = null;
      while (node && !background) {
        const candidate = parse(getComputedStyle(node).backgroundColor);
        if (candidate && candidate.alpha > 0.98) background = candidate.rgb;
        node = node.parentElement;
      }
      const foreground = parse(getComputedStyle(el, property === 'placeholder' ? '::placeholder' : null).color);
      if (!foreground || !background) return null;
      const linear = (n) => { n /= 255; return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4; };
      const luminance = (rgb) => rgb.map(linear).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
      const l1 = luminance(foreground.rgb), l2 = luminance(background);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }''', color_property)


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])
        for locale in ['ar', 'en']:
            for theme in ['light', 'dark']:
                for width in [320, 390, 768, 1440]:
                    context = browser.new_context(viewport={'width': width, 'height': 844 if width < 600 else 900}, reduced_motion='reduce')
                    page = context.new_page()
                    page.set_default_timeout(12000)
                    page.add_init_script(f'''(() => {{ localStorage.setItem('vanta-locale', {json.dumps(locale)}); localStorage.setItem('mabda-theme', {json.dumps(theme)}); localStorage.removeItem('mabda-has-seen-intro'); }})()''')
                    page.on('pageerror', lambda e: RESULT['errors'].append({'kind': 'page', 'message': str(e)}))
                    page.on('console', lambda m: RESULT['errors'].append({'kind': 'console', 'message': m.text}) if m.type == 'error' else None)
                    page.goto(BASE + '/login', wait_until='domcontentloaded')
                    intro = page.locator('[data-testid="welcome-intro"]')
                    intro.wait_for()
                    check(f'{locale}/{theme}/{width}: intro precedes Auth', intro.is_visible())
                    check(f'{locale}/{theme}/{width}: correct document direction', page.locator('html').get_attribute('dir') == ('rtl' if locale == 'ar' else 'ltr'))
                    check(f'{locale}/{theme}/{width}: requested theme applied', page.locator('html').get_attribute('data-theme') == theme)
                    check(f'{locale}/{theme}/{width}: no horizontal overflow on intro', page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'))
                    expected_mark = 'mark-dark-reference.png' if theme == 'dark' else 'mark-crop.png'
                    check(f'{locale}/{theme}/{width}: approved mark is loaded and theme-aware', page.locator('[data-testid="welcome-intro"] img.mabda-logo').evaluate('(img, expected) => img.complete && img.naturalWidth > 0 && img.src.includes(expected)', expected_mark))
                    check(f'{locale}/{theme}/{width}: reduced motion is respected', page.locator('.mabda-intro-identity').evaluate('(el) => getComputedStyle(el).animationName === "none"'))
                    check(f'{locale}/{theme}/{width}: brand name contrast', (ratio(page, '.mabda-intro-identity .mabda-auth-brand-name') or 0) >= 4.5)
                    check(f'{locale}/{theme}/{width}: tagline contrast', (ratio(page, '.mabda-intro-tagline') or 0) >= 3)
                    check(f'{locale}/{theme}/{width}: secondary message contrast', (ratio(page, '.mabda-intro-secondary') or 0) >= 4.5)
                    check(f'{locale}/{theme}/{width}: by VANTA contrast', (ratio(page, '.mabda-auth-endorsement') or 0) >= 4.5)
                    check(f'{locale}/{theme}/{width}: primary CTA contrast', (ratio(page, '.mabda-intro-next span:first-child') or 0) >= 4.5)
                    next_button = page.locator('.mabda-intro-next')
                    check(f'{locale}/{theme}/{width}: Next is keyboard focusable', next_button.evaluate('(el) => el.tabIndex === 0'))
                    if width in [390, 1440]:
                        shot = OUT / f'intro-{locale}-{theme}-{width}.png'
                        page.screenshot(path=str(shot), full_page=True)
                        RESULT['screenshots'].append(str(shot))
                    next_button.click()
                    page.locator('[data-testid="auth-page"]').wait_for()
                    check(f'{locale}/{theme}/{width}: Next opens the requested Login route', page.url.endswith('/login'))
                    check(f'{locale}/{theme}/{width}: completion stored', page.evaluate('localStorage.getItem("mabda-has-seen-intro") === "true"'))
                    page.reload(wait_until='domcontentloaded')
                    page.locator('[data-testid="auth-page"]').wait_for()
                    check(f'{locale}/{theme}/{width}: Intro stays dismissed after refresh', page.locator('[data-testid="welcome-intro"]').count() == 0)
                    check(f'{locale}/{theme}/{width}: no horizontal overflow on Login', page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'))
                    check(f'{locale}/{theme}/{width}: Login only asks for email and password', page.locator('form input').evaluate_all('(els) => JSON.stringify(els.map((el) => el.name))') == '["email","password"]')
                    for selector, threshold, label in [
                        ('.mabda-auth-brand-name', 4.5, 'brand'),
                        ('.mabda-auth-endorsement', 4.5, 'by VANTA'),
                        ('.mabda-auth-panel-head h1', 3, 'heading'),
                        ('.mabda-auth-panel-head p', 4.5, 'body'),
                        ('.mabda-auth-field > label', 4.5, 'label'),
                        ('input[name="email"]', 4.5, 'placeholder'),
                        ('.mabda-auth-links a', 4.5, 'link'),
                        ('.student-auth-submit .student-submit-copy', 4.5, 'button'),
                    ]:
                        check(f'{locale}/{theme}/{width}: {label} contrast', (ratio(page, selector) or 0) >= threshold)
                    if width in [390, 1440]:
                        shot = OUT / f'login-{locale}-{theme}-{width}.png'
                        page.screenshot(path=str(shot), full_page=True)
                        RESULT['screenshots'].append(str(shot))

                    # Ensure the per-field visibility buttons are operable and distinct.
                    page.locator('input[name="password"]').fill('LocalOnlyExample')
                    password_toggle = page.locator('.student-password-toggle').first
                    password_toggle.click()
                    check(f'{locale}/{theme}/{width}: password visibility control', page.locator('input[name="password"]').get_attribute('type') == 'text' and password_toggle.get_attribute('aria-pressed') == 'true')
                    password_toggle.click()
                    check(f'{locale}/{theme}/{width}: password can be hidden again', page.locator('input[name="password"]').get_attribute('type') == 'password')
                    page.locator('.language-toggle').click()
                    check(f'{locale}/{theme}/{width}: language switch updates direction', page.locator('html').get_attribute('dir') == ('ltr' if locale == 'ar' else 'rtl'))
                    page.locator('.language-toggle').click()

                    # Switch to Sign Up with history navigation (not a document reload).
                    time_origin = page.evaluate('performance.timeOrigin')
                    page.get_by_role('link', name=('أنشئ حسابًا' if locale == 'ar' else 'Create one')).click()
                    page.locator('[data-testid="auth-page"]').wait_for()
                    check(f'{locale}/{theme}/{width}: switch to Sign Up without reload', page.evaluate('performance.timeOrigin') == time_origin and page.evaluate('location.pathname') == '/signup')
                    check(f'{locale}/{theme}/{width}: Sign Up fields are complete and ordered', page.locator('form input').evaluate_all('(els) => JSON.stringify(els.map((el) => el.name))') == '["display-name","email","password","confirm-password"]')
                    check(f'{locale}/{theme}/{width}: confirm password has its own visibility control', page.locator('input[name="confirm-password"]').count() == 1 and page.locator('.student-password-toggle').count() == 2)
                    confirm_toggle = page.locator('.student-password-toggle').nth(1)
                    confirm_toggle.click()
                    check(f'{locale}/{theme}/{width}: confirm visibility toggle is independent', page.locator('input[name="confirm-password"]').get_attribute('type') == 'text' and page.locator('input[name="password"]').get_attribute('type') == 'password' and confirm_toggle.get_attribute('aria-pressed') == 'true')
                    confirm_toggle.click()
                    check(f'{locale}/{theme}/{width}: confirmation can be hidden again', page.locator('input[name="confirm-password"]').get_attribute('type') == 'password')
                    page.locator('input[name="display-name"]').fill('A')
                    page.locator('input[name="email"]').fill('learner@example.test')
                    page.locator('input[name="password"]').fill('LocalOnlyPass123')
                    page.locator('input[name="confirm-password"]').fill('LocalOnlyPass123')
                    page.locator('.student-auth-submit').click()
                    check(f'{locale}/{theme}/{width}: short full name validation', page.locator('.student-form-error').is_visible())
                    check(f'{locale}/{theme}/{width}: validation feedback contrast', (ratio(page, '.student-form-error') or 0) >= 4.5)
                    page.locator('input[name="display-name"]').fill('Local Test Learner')
                    page.locator('input[name="confirm-password"]').fill('DifferentLocalPass123')
                    page.locator('.student-auth-submit').click()
                    check(f'{locale}/{theme}/{width}: confirmation mismatch validation', page.locator('.student-form-error').is_visible())
                    check(f'{locale}/{theme}/{width}: no API submission on local validation errors', page.locator('form').get_attribute('aria-busy') == 'false')

                    # Sign-up -> Sign-in stays within the SPA and Sign-in has no full-name field.
                    time_origin = page.evaluate('performance.timeOrigin')
                    page.get_by_role('link', name=('تسجيل الدخول' if locale == 'ar' else 'Sign in')).click()
                    page.locator('[data-testid="auth-page"]').wait_for()
                    check(f'{locale}/{theme}/{width}: switch back to Sign In without reload', page.evaluate('performance.timeOrigin') == time_origin and page.evaluate('location.pathname') == '/login')
                    check(f'{locale}/{theme}/{width}: Sign In excludes full name and confirmation', page.locator('input[name="display-name"], input[name="confirm-password"]').count() == 0 and page.locator('form input').count() == 2)

                    # Forgot-password flow remains reachable and callback/recovery URLs bypass onboarding.
                    page.get_by_role('link', name=('نسيت كلمة المرور؟' if locale == 'ar' else 'Forgot password?')).click()
                    check(f'{locale}/{theme}/{width}: forgot-password route remains reachable', page.evaluate('location.pathname') == '/forgot-password' and page.locator('input[type="email"]').count() == 1)
                    page.evaluate('localStorage.removeItem("mabda-has-seen-intro");sessionStorage.removeItem("mabda-has-seen-intro")')
                    page.goto(BASE + '/reset-password', wait_until='domcontentloaded')
                    check(f'{locale}/{theme}/{width}: reset callback bypasses Intro', page.locator('[data-testid="welcome-intro"]').count() == 0 and page.locator('[data-testid="auth-page"]').count() == 1)
                    page.goto(BASE + '/auth/callback', wait_until='domcontentloaded')
                    check(f'{locale}/{theme}/{width}: Auth callback bypasses Intro', page.locator('[data-testid="welcome-intro"]').count() == 0 and page.locator('[data-testid="auth-page"]').count() == 1)
                    page.goto(BASE + '/signup?next=%2Fdashboard', wait_until='domcontentloaded')
                    check(f'{locale}/{theme}/{width}: direct protected return route opens Intro first', page.locator('[data-testid="welcome-intro"]').count() == 1)
                    page.locator('.mabda-intro-next').click()
                    check(f'{locale}/{theme}/{width}: intro preserves the requested return route', page.url.endswith('/signup?next=%2Fdashboard'))
                    page.get_by_role('link', name=('تسجيل الدخول' if locale == 'ar' else 'Sign in')).click()
                    check(f'{locale}/{theme}/{width}: Auth switch preserves next', page.url.endswith('/login?next=%2Fdashboard'))
                    if width in [390, 1440]:
                        shot = OUT / f'signup-{locale}-{theme}-{width}.png'
                        page.evaluate('localStorage.removeItem("mabda-has-seen-intro");sessionStorage.removeItem("mabda-has-seen-intro")')
                        page.goto(BASE + '/signup')
                        page.locator('[data-testid="welcome-intro"]').wait_for()
                        page.locator('.mabda-intro-next').click()
                        page.screenshot(path=str(shot), full_page=True)
                        RESULT['screenshots'].append(str(shot))
                    context.close()
        browser.close()


try:
    run()
except Exception:
    RESULT['failure'] = traceback.format_exc()
finally:
    (OUT / 'results.json').write_text(json.dumps(RESULT, ensure_ascii=False, indent=2))
    print(json.dumps({'passed': sum(item['passed'] for item in RESULT['checks']), 'total': len(RESULT['checks']), 'errors': RESULT['errors'], 'failure': RESULT.get('failure'), 'auth_submission': RESULT['auth_submission'], 'evidence': str(OUT)}, ensure_ascii=False, indent=2))
if RESULT.get('failure'):
    raise SystemExit(1)
