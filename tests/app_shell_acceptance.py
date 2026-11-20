"""App-shell/Home browser acceptance; no real authentication submit or cloud write."""
import json
import os
import re
import traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_origin import safe_origin_for_log, sanitize_diagnostic_text, validate_local_base_url

BASE = validate_local_base_url(os.environ.get('BASE_URL', 'http://127.0.0.1:5175'))
OUT = Path(os.environ.get('EVIDENCE_DIR', '/tmp/mabda-app-shell-acceptance'))
OUT.mkdir(parents=True, exist_ok=True)
checks = []
errors = []
result = {}


def check(label, passed, detail=None):
    checks.append({'name': label, 'passed': bool(passed), 'detail': detail})
    if not passed:
        raise AssertionError(f'{label}: {detail}')


def rgb(value):
    parts = re.findall(r'\d+(?:\.\d+)?', value)
    if len(parts) < 3:
        raise ValueError(f'Unsupported CSS color: {value}')
    return [float(part) / 255 for part in parts[:3]]


def luminance(color):
    channels = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in rgb(color)]
    return sum(weight * channel for weight, channel in zip((0.2126, 0.7152, 0.0722), channels))


def contrast(first, second):
    a, b = sorted((luminance(first), luminance(second)), reverse=True)
    return (a + 0.05) / (b + 0.05)


def measure(page, fg, bg):
    return page.evaluate("""([fgSelector, bgSelector]) => ({
      fg: getComputedStyle(document.querySelector(fgSelector)).color,
      bg: getComputedStyle(document.querySelector(bgSelector)).backgroundColor
    })""", [fg, bg])


def open_menu(page):
    page.locator('.mabda-app-menu-trigger').click()
    drawer = page.locator('.mabda-app-drawer')
    drawer.wait_for(state='visible')
    return drawer


def screenshot(page, name):
    page.evaluate('document.fonts.ready')
    page.screenshot(path=str(OUT / f'{name}.png'), full_page=True)


try:
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),
            headless=True,
            args=['--no-sandbox'],
        )
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()
        page.set_default_timeout(12000)
        page.on('pageerror', lambda error: errors.append({'kind': 'page', 'message': sanitize_diagnostic_text(error)}))
        page.on('console', lambda message: errors.append({'kind': 'console', 'message': sanitize_diagnostic_text(message.text)}) if message.type == 'error' else None)

        for locale, tagline in [('ar', 'كل بداية لها مبدأ.'), ('en', 'Every beginning needs a foundation.')]:
            for theme in ['light', 'dark']:
                for width in [320, 390, 768, 1024, 1440]:
                    height = 900 if width > 600 else 844
                    page.set_viewport_size({'width': width, 'height': height})
                    page.goto(BASE, wait_until='domcontentloaded')
                    page.evaluate("""([language, colorTheme]) => {
                      localStorage.setItem('vanta-locale', language);
                      localStorage.setItem('mabda-theme', colorTheme);
                      localStorage.setItem('mabda-has-seen-intro', 'true');
                      sessionStorage.setItem('mabda-has-seen-intro', 'true');
                    }""", [locale, theme])
                    page.reload(wait_until='domcontentloaded')
                    page.locator('.mabda-home-hero h1').wait_for(state='visible')
                    prefix = f'{theme}/{locale}/{width}'

                    check(prefix + ': language direction', page.locator('html').get_attribute('dir') == ('rtl' if locale == 'ar' else 'ltr'))
                    check(prefix + ': theme persists', page.locator('html').get_attribute('data-theme') == theme)
                    check(prefix + ': Home slogan', re.sub(r'\s+', ' ', page.locator('.mabda-home-hero h1').inner_text()).strip() == tagline)
                    check(prefix + ': guest storage notice', page.locator('.mabda-home-guest-note').is_visible())
                    check(prefix + ': one primary action opens the path catalog', page.locator('.mabda-home-hero-actions .button-primary').get_attribute('href') == '/paths' and page.locator('.mabda-home-hero-actions .button').count() == 1)
                    check(prefix + ': three concise language paths', page.locator('.mabda-home-path-row').count() == 3)
                    check(prefix + ': each Home path has one icon and a separate readable title', all(page.locator('.mabda-home-path-row').nth(index).locator('.mabda-home-path-icon img').count() == 1 and page.locator('.mabda-home-path-row').nth(index).locator('.mabda-home-path-heading .programming-language-label').count() == 0 for index in range(page.locator('.mabda-home-path-row').count())))
                    check(prefix + ': CSS and JavaScript path destinations remain available', page.locator('.mabda-home-path-row[href="/paths/css-fundamentals"]').count() == 1 and page.locator('.mabda-home-path-row[href="/paths/javascript-fundamentals"]').count() == 1)
                    check(prefix + ': no featured HTML lesson or redundant dashboard blocks', page.locator('.mabda-home-resume, .mabda-home-stats, .mabda-home-loop, .mabda-home-feature-panel').count() == 0)
                    check(prefix + ': no horizontal overflow', page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'))
                    mobile = width <= 760
                    check(prefix + ': mobile navigation visibility', page.locator('.mabda-mobile-nav').is_visible() == mobile)
                    check(prefix + ': no repeated marketing slogan section', page.locator('#vision').count() == 0)

                    ratios = measure(page, '.mabda-home-guest-note', '.mabda-home-hero')
                    ratio = contrast(ratios['fg'], ratios['bg'])
                    check(prefix + ': guest-note contrast >= 4.5:1', ratio >= 4.5, {'ratio': round(ratio, 2), **ratios})
                    ratios = measure(page, '.mabda-home-hero .button-primary', '.mabda-home-hero .button-primary')
                    ratio = contrast(ratios['fg'], ratios['bg'])
                    check(prefix + ': primary CTA contrast >= 4.5:1', ratio >= 4.5, {'ratio': round(ratio, 2), **ratios})

                    drawer = open_menu(page)
                    check(prefix + ': accessible menu dialog', drawer.get_attribute('role') == 'dialog' and drawer.get_attribute('aria-modal') == 'true')
                    drawer_opacity = float(drawer.evaluate('(el) => getComputedStyle(el).opacity'))
                    check(prefix + ': drawer surface remains opaque during entry', drawer_opacity >= 0.99, drawer_opacity)
                    check(prefix + ': drawer has 3 language paths', drawer.locator('.mabda-app-drawer-paths li').count() == 3)
                    check(prefix + ': quiz destination is an existing HTML path', drawer.locator('.mabda-app-quiz-link').get_attribute('href') == '/paths/html-fundamentals')
                    check(prefix + ': drawer settings controls exist', drawer.locator('.mabda-app-language-choice').count() == 1 and drawer.locator('.theme-toggle').count() == 1)
                    check(prefix + ': challenge is the only disabled future destination', drawer.locator('.mabda-app-future-link[aria-disabled="true"]').count() == 1)
                    check(prefix + ': guided projects use an active destination', drawer.locator('.mabda-app-guided-project-link[href="/projects"]').count() == 1)
                    check(prefix + ': drawer header is not a card-shaped logo image', drawer.locator('.mabda-app-drawer-kicker').is_visible())
                    check(prefix + ': focus starts in drawer', page.evaluate("document.activeElement === document.querySelector('.mabda-app-icon-button')"))
                    focusables = drawer.locator('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
                    focus_count = focusables.count()
                    check(prefix + ': drawer offers keyboard destinations', focus_count >= 8, focus_count)
                    first = focusables.nth(0)
                    last = focusables.nth(focus_count - 1)
                    last.focus()
                    page.keyboard.press('Tab')
                    check(prefix + ': Tab wraps from last to first', page.evaluate('(el) => document.activeElement === el', first.element_handle()))
                    page.keyboard.press('Shift+Tab')
                    check(prefix + ': Shift+Tab wraps from first to last', page.evaluate('(el) => document.activeElement === el', last.element_handle()))
                    page.keyboard.press('Escape')
                    check(prefix + ': Escape closes menu and restores trigger focus', page.locator('.mabda-app-drawer').count() == 0 and page.evaluate("document.activeElement === document.querySelector('.mabda-app-menu-trigger')"))
                    if width in [390, 1440]:
                        screenshot(page, f'home-{theme}-{locale}-{width}')

                    if width == 320:
                        if theme == 'light':
                            page.locator('.mabda-mobile-nav-item').last.click()
                            drawer = page.locator('.mabda-app-drawer')
                            drawer.wait_for(state='visible')
                            bounds = drawer.bounding_box()
                            outside_x = width - 4 if locale == 'ar' else 4
                            page.mouse.click(outside_x, height // 2)
                            check(prefix + ': outside click closes drawer', page.locator('.mabda-app-drawer').count() == 0)

                page.set_viewport_size({'width': 390, 'height': 844})
                page.goto(BASE, wait_until='domcontentloaded')
                page.evaluate("""([language, colorTheme]) => {
                  localStorage.setItem('vanta-locale', language);
                  localStorage.setItem('mabda-theme', colorTheme);
                  localStorage.setItem('mabda-has-seen-intro', 'true');
                  sessionStorage.setItem('mabda-has-seen-intro', 'true');
                }""", [locale, theme])
                page.reload(wait_until='domcontentloaded')
                page.goto(BASE + '/lesson/start?view=practice')
                page.locator('[data-testid="practice-studio"]').wait_for(state='visible')
                page.locator('.cm-content').wait_for(state='visible')
                check(f'{theme}/{locale}: Home opens existing Practice Studio', '/lesson/start?view=practice' in page.url and page.locator('.lesson-flow-controls').count() == 0)
                check(f'{theme}/{locale}: editor remains LTR', page.locator('.cm-content').evaluate('(el) => getComputedStyle(el).direction') == 'ltr')
                if theme == 'light':
                    screenshot(page, f'practice-{locale}-390')

        # Preferences are actual controls and remain independent from protected account state.
        page.set_viewport_size({'width': 390, 'height': 844})
        page.goto(BASE, wait_until='domcontentloaded')
        page.evaluate("""() => {
          localStorage.setItem('vanta-locale', 'ar');
          localStorage.setItem('mabda-theme', 'light');
          localStorage.setItem('mabda-has-seen-intro', 'true');
        }""")
        page.reload(wait_until='domcontentloaded')
        page.locator('.mabda-app-menu-trigger').click()
        drawer = page.locator('.mabda-app-drawer')
        drawer.wait_for(state='visible')
        page.locator('.mabda-app-language-choice').click()
        page.wait_for_function("document.documentElement.lang === 'en' && document.documentElement.dir === 'ltr'")
        page.locator('.mabda-app-drawer .theme-toggle').click()
        page.wait_for_function("document.documentElement.dataset.theme === 'dark'")
        check('Language/theme preferences work while Drawer stays open', drawer.is_visible() and page.locator('.mabda-app-menu-trigger').get_attribute('aria-expanded') == 'true')
        page.keyboard.press('Escape')
        page.reload(wait_until='domcontentloaded')
        check('Language and theme preferences persist after refresh', page.locator('html').get_attribute('lang') == 'en' and page.locator('html').get_attribute('data-theme') == 'dark')

        course_paths = [
            ('/paths/html-fundamentals', 'HTML', 12),
            ('/paths/css-fundamentals', 'CSS', 19),
            ('/paths/javascript-fundamentals', 'JavaScript', 23),
        ]
        for locale in ['ar', 'en']:
            page.evaluate("([language]) => localStorage.setItem('vanta-locale', language)", [locale])
            page.goto(BASE + '/paths', wait_until='domcontentloaded')
            page.locator('.learning-path-catalog').wait_for()
            catalog_cards = page.locator('.learning-path-catalog-link')
            expected_path_hrefs = {
                '/paths/html-fundamentals',
                '/paths/css-fundamentals',
                '/paths/javascript-fundamentals',
                '/paths/programming-fundamentals',
                '/paths/problem-solving',
            }
            actual_path_hrefs = {catalog_cards.nth(index).get_attribute('href') for index in range(catalog_cards.count())}
            check(f'{locale}: catalog keeps all five existing path destinations', catalog_cards.count() == 5 and actual_path_hrefs == expected_path_hrefs)
            check(f'{locale}: catalog keeps three available and two future paths', page.locator('.learning-path-catalog-row.path-status-available').count() == 3 and page.locator('.learning-path-catalog-row.path-status-future').count() == 2)
            check(f'{locale}: every card contains exactly one icon and no duplicate language-mark label', all(catalog_cards.nth(index).locator('.learning-path-card-icon img, .learning-path-card-icon svg').count() == 1 and catalog_cards.nth(index).locator('.learning-path-language-mark').count() == 0 for index in range(catalog_cards.count())))
            for path, course_name, lesson_count in course_paths:
                page.goto(BASE + path, wait_until='domcontentloaded')
                page.locator('.learning-course-overview h1').wait_for()
                check(f'{locale}/{course_name}: short course title', page.locator('.learning-course-overview h1').inner_text().strip() == course_name)
                meta_text = page.locator('.learning-course-meta').inner_text()
                check(f'{locale}/{course_name}: beginner curriculum level is explicit', ('Course level' in meta_text and 'Beginner' in meta_text) if locale == 'en' else ('مستوى المنهج' in meta_text and 'مبتدئ' in meta_text))
                details = page.locator('.learning-course-outline')
                first_lesson_route = details.locator('.learning-path-lesson-link').first.get_attribute('href')
                check(f'{locale}/{course_name}: first lesson action uses the actual route', page.locator('.learning-course-overview .button-primary').get_attribute('href') == first_lesson_route)
                check(f'{locale}/{course_name}: lesson details start collapsed', details.count() == 1 and details.evaluate('(el) => !el.open') and not details.locator('.learning-path-lesson-link').first.is_visible())
                details.locator('summary').click()
                check(f'{locale}/{course_name}: all lessons remain available after expanding details', details.locator('.learning-path-lesson').count() == lesson_count and details.locator('.learning-path-lesson-link').first.is_visible())
                check(f'{locale}/{course_name}: guest view does not invent progress or review history', page.locator('.learning-course-progress').count() == 0 and page.locator('.learning-course-actions .button-quiet').count() == 0)

        # Auth-protected routes still redirect logged-out visitors; no fake session is used.
        for protected in ['/dashboard', '/profile']:
            page.goto(BASE + protected, wait_until='domcontentloaded')
            page.wait_for_function("location.pathname === '/login' && new URLSearchParams(location.search).has('next')")
            page.locator('[data-testid="auth-page"]').wait_for()
            protected_details = {
                'origin': safe_origin_for_log(page.url),
                'auth_visible': page.locator('[data-testid="auth-page"]').is_visible(),
                'intro_visible': page.locator('[data-testid="welcome-intro"]').is_visible(),
                'theme': page.locator('html').get_attribute('data-theme'),
            }
            check(f'{protected}: existing auth guard preserved', protected_details['auth_visible'] and protected_details['theme'] == 'dark', protected_details)
            check(f'{protected}: return path preserved', page.evaluate('new URLSearchParams(location.search).get("next")') == protected)

        check('No browser JavaScript/console errors', not errors, errors)
        browser.close()
except Exception:
    result['failure'] = sanitize_diagnostic_text(traceback.format_exc())
finally:
    result.update(checks=checks, errors=errors, passed=sum(item['passed'] for item in checks), total=len(checks))
    (OUT / 'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps({key: value for key, value in result.items() if key != 'checks'}, ensure_ascii=False, indent=2))
if result.get('failure'):
    raise SystemExit(1)
