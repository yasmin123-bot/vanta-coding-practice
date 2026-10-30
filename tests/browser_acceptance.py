"""Optional browser regression. Requires Python Playwright and Chromium.
Run against an existing build server; never creates users or mutates Supabase data.
BASE_URL and EVIDENCE_DIR may be set by the caller. Node >=22.15 exports fixtures.
"""
import json
import os
import re
import subprocess
import traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get('BASE_URL', 'http://127.0.0.1:5175').rstrip('/')
OUT = Path(os.environ.get('EVIDENCE_DIR', '/tmp/mabda-browser-acceptance'))
OUT.mkdir(parents=True, exist_ok=True)
THEME = os.environ.get('THEME', 'light')
assert THEME in ['light', 'dark']
FIXTURES = json.loads(subprocess.check_output(['node', str(ROOT / 'tests/browser-fixtures.cjs')], cwd=ROOT, text=True))
RESULT = {'base_url': BASE, 'checks': [], 'errors': [], 'screenshots': [], 'authenticated_e2e': 'NOT TESTED: no confirmed student session supplied'}

def check(name, ok, detail=None):
    RESULT['checks'].append({'name': name, 'passed': bool(ok), 'detail': detail})
    if not ok:
        raise AssertionError(f'{name}: {detail}')

def screenshot(page, name, full=True):
    page.evaluate('document.fonts.ready')
    page.evaluate('Promise.all(document.getAnimations().filter(a => Number.isFinite(a.effect.getTiming().iterations)).map(a => a.finished.catch(() => {})))')
    path = OUT / (name + '.png')
    page.screenshot(path=str(path), full_page=full)
    RESULT['screenshots'].append(str(path))

def reach_practice(page):
    for _ in range(20):
        studio = page.locator('[data-testid="practice-studio"]')
        if studio.count() and studio.is_visible():
            page.locator('.cm-content').wait_for(state='visible')
            return
        page.locator('.lesson-flow-controls .button-primary, .learning-lesson-controls .button-primary').first.click()
    raise AssertionError('Practice not reachable')

def compact(text):
    return re.sub(r'\s+', '', text).replace('`', '')

def run():
    routes = ['/', '/paths', '/paths/html-fundamentals', '/paths/css-fundamentals', '/paths/javascript-fundamentals', '/login', '/signup', '/forgot-password', '/reset-password', '/auth/callback', '/dashboard', '/profile', '/missing-route']
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()
        page.set_default_timeout(15000)
        page.on('pageerror', lambda e: RESULT['errors'].append({'kind': 'page', 'message': str(e)}))
        page.on('console', lambda m: RESULT['errors'].append({'kind': 'console', 'message': m.text}) if m.type == 'error' else None)
        page.on('requestfailed', lambda r: RESULT['errors'].append({'kind': 'request', 'url': r.url.split('?')[0], 'failure': r.failure}))
        for locale in ['ar', 'en']:
            page.goto(BASE)
            page.evaluate('([locale, theme]) => {localStorage.setItem("vanta-locale", locale);localStorage.setItem("mabda-theme", theme);localStorage.removeItem("mabda-has-seen-intro")}', [locale, THEME])
            for width in [320, 390, 768, 1440]:
                page.set_viewport_size({'width': width, 'height': 900 if width > 600 else 844})
                page.evaluate('localStorage.removeItem("mabda-has-seen-intro");sessionStorage.removeItem("mabda-has-seen-intro")')
                for route in routes:
                    page.goto(BASE + route, wait_until='domcontentloaded')
                    page.locator('h1').first.wait_for()
                    check(f'{locale}/{width}{route}: rendered and directed', page.locator('html').get_attribute('dir') == ('rtl' if locale == 'ar' else 'ltr'))
                    check(f'{locale}/{width}{route}: no horizontal scroll', page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'))
                    logos = page.locator('img.mabda-logo')
                    if logos.count():
                        check(f'{locale}/{width}{route}: approved raster logo loads', logos.first.evaluate('(img) => img.complete && img.naturalWidth > 0 && img.src.includes("/brand/mabda/")'))
                if width in [390, 1440]:
                    page.goto(BASE)
                    # Trigger the real IntersectionObservers before full-page evidence.
                    height = page.evaluate('document.documentElement.scrollHeight')
                    for y in range(0, height, 450):
                        page.evaluate('(y) => window.scrollTo(0,y)', y)
                        page.wait_for_timeout(60)
                    page.evaluate('window.scrollTo(0,0)')
                    page.wait_for_timeout(500)
                    screenshot(page, f'home-{locale}-{width}')
                    page.goto(BASE + '/login')
                    screenshot(page, f'intro-{locale}-{width}')
                    page.locator('.mabda-intro-next').click()
                    page.locator('[data-testid="auth-page"]').wait_for()
                    screenshot(page, f'login-{locale}-{width}')
            # Native validation and password visibility; no network submit.
            page.goto(BASE + '/login')
            if page.locator('[data-testid="welcome-intro"]').count():
                page.locator('.mabda-intro-next').click()
            page.locator('[data-testid="auth-page"]').wait_for()
            page.locator('input[name="email"]').fill('not-an-email')
            check(f'{locale}: native email validation', not page.locator('input[name="email"]').evaluate('(input) => input.checkValidity()'))
            toggle = page.locator('.student-password-toggle')
            page.locator('input[name="password"]').fill('LocalOnlyExample')
            toggle.click()
            check(f'{locale}: password show', page.locator('input[name="password"]').get_attribute('type') == 'text')
            toggle.click()
            check(f'{locale}: password hide', page.locator('input[name="password"]').get_attribute('type') == 'password')
            page.keyboard.press('Tab')
            focus = page.evaluate('({outline:getComputedStyle(document.activeElement).outlineStyle, width:parseFloat(getComputedStyle(document.activeElement).outlineWidth)})')
            check(f'{locale}: keyboard focus visible', focus['outline'] != 'none' and focus['width'] >= 2, focus)
            for lesson in FIXTURES[locale]:
                page.set_viewport_size({'width': 390, 'height': 844})
                page.goto(BASE + lesson['route'])
                reach_practice(page)
                check(f'{locale}/{lesson["id"]}: code stays LTR', page.locator('.cm-content').evaluate('(el) => getComputedStyle(el).direction') == 'ltr')
                box = page.locator('.cm-content')
                sample = '<h1>Unstored local draft</h1>'
                box.fill(sample)
                before_locale = page.locator('html').get_attribute('lang')
                page.locator('.mabda-app-menu-trigger').click()
                page.locator('.mabda-app-language-choice').click()
                page.wait_for_function('(before) => document.documentElement.lang !== before', arg=before_locale)
                page.keyboard.press('Escape')
                check(f'{locale}/{lesson["id"]}: language switch preserves local edits', compact(box.inner_text()) == compact(sample))
                before_locale = page.locator('html').get_attribute('lang')
                page.locator('.mabda-app-menu-trigger').click()
                page.locator('.mabda-app-language-choice').click()
                page.wait_for_function('(before) => document.documentElement.lang !== before', arg=before_locale)
                page.keyboard.press('Escape')
                page.locator('.practice-studio-navigation .button-primary').click()
                for index, question in enumerate(lesson['questions']):
                    options = page.locator('.lesson-choice, .learning-choice')
                    options.first.wait_for()
                    check(f'{locale}/{lesson["id"]}/{index}: four unrevealed answers', options.count() == 4 and page.locator('.lesson-choice.is-answer, .learning-choice.is-answer, .lesson-choice.is-correct, .learning-choice.is-correct').count() == 0)
                    before = options.all_text_contents()
                    correct = next(choice['label'] for choice in question['choices'] if choice['id'] == question['correctChoiceId'])
                    correct_index = next(i for i, label in enumerate(before) if compact(label) == compact(correct))
                    if index == 0:
                        options.nth((correct_index + 1) % 4).click()
                        check(f'{locale}/{lesson["id"]}: wrong feedback', page.locator('.lesson-quiz-feedback.is-incorrect, .learning-quiz-feedback.is-incorrect').is_visible())
                        page.locator('.lesson-question-actions .button-quiet, .learning-question-actions .button-quiet').click()
                        check(f'{locale}/{lesson["id"]}: retry keeps answer order', options.all_text_contents() == before)
                    options.nth(correct_index).click()
                    check(f'{locale}/{lesson["id"]}/{index}: correct feedback', page.locator('.lesson-quiz-feedback.is-correct, .learning-quiz-feedback.is-correct').is_visible())
                    page.locator('.lesson-question-actions .button-primary, .learning-question-actions .button-primary').click()
                score = page.locator('.lesson-result-score, .learning-result-score')
                score.wait_for()
                check(f'{locale}/{lesson["id"]}: score fraction keeps LTR order', score.evaluate('(el) => getComputedStyle(el).direction') == 'ltr')
                check(f'{locale}/{lesson["id"]}: first-attempt score', compact(score.inner_text()) == f'{len(lesson["questions"]) - 1}/{len(lesson["questions"])}', score.inner_text())
                check(f'{locale}/{lesson["id"]}: result navigation returns to its path', page.locator('.learning-result-navigation a').evaluate_all('(links, path) => links.some((link) => link.getAttribute("href") === path)', lesson['pathRoute']))
                if lesson['id'] == 'html-introduction':
                    screenshot(page, f'quiz-result-{locale}-390')
                page.locator('.learning-result-actions .button-quiet').click()
                check(f'{locale}/{lesson["id"]}: restart quiz resets answer', page.locator('.lesson-choice, .learning-choice').count() == 4 and page.locator('.lesson-quiz-feedback, .learning-quiz-feedback').count() == 0)
        page.emulate_media(reduced_motion='reduce')
        page.goto(BASE)
        check('Reduced motion keeps Home brand and heading visible', page.locator('.mabda-app-brand').is_visible() and page.locator('.mabda-home-hero h1').is_visible())
        check('Reduced motion disables smooth scrolling', page.evaluate('getComputedStyle(document.documentElement).scrollBehavior') == 'auto')
        manifest = page.request.get(BASE + '/manus-routes.json')
        manifest_routes = {route.get('path') for route in manifest.json().get('routes', [])} if manifest.ok else set()
        expected_lesson_routes = {lesson['route'] for lessons in FIXTURES.values() for lesson in lessons}
        check('Manifest is actual JSON with all active lesson routes, not SPA fallback', manifest.ok and expected_lesson_routes.issubset(manifest_routes), {'expected_lessons': len(expected_lesson_routes), 'manifest_count': len(manifest_routes)})
        check('No new actionable runtime or load errors', not RESULT['errors'], RESULT['errors'])
        browser.close()

try:
    run()
except Exception:
    RESULT['failure'] = traceback.format_exc()
finally:
    (OUT / 'results.json').write_text(json.dumps(RESULT, ensure_ascii=False, indent=2))
    print(json.dumps({'passed': sum(x['passed'] for x in RESULT['checks']), 'total': len(RESULT['checks']), 'failure': RESULT.get('failure'), 'errors': RESULT['errors'], 'evidence': str(OUT)}, ensure_ascii=False, indent=2))
if RESULT.get('failure'):
    raise SystemExit(1)
