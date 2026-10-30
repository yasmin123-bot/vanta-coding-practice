"""Optional targeted UI regression. Requires an existing preview, Playwright, Chromium.
No authentication, cloud writes, or test users. BASE_URL / EVIDENCE_DIR configurable.
"""
import json
import os
import traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE_URL', 'http://127.0.0.1:5175').rstrip('/')
OUT = Path(os.environ.get('EVIDENCE_DIR', '/tmp/mabda-theme-practice'))
OUT.mkdir(parents=True, exist_ok=True)
checks = []
errors = []
result = {}


def check(name, passed, detail=None):
    checks.append({'name': name, 'passed': bool(passed), 'detail': detail})
    if not passed:
        raise AssertionError(f'{name}: {detail}')


def reach_practice(page):
    for _ in range(20):
        if page.locator('[data-testid="practice-studio"]').count():
            page.locator('.cm-content').wait_for()
            return
        page.locator('.lesson-flow-controls .button-primary').click()
    raise AssertionError('Practice not reachable')


def toggle_shell_theme(page):
    page.locator('.mabda-app-menu-trigger').click()
    page.locator('.mabda-app-drawer .theme-toggle').wait_for()
    page.locator('.mabda-app-drawer .theme-toggle').click()
    page.keyboard.press('Escape')


def check_task(page, html):
    page.locator('.cm-content').fill(html)
    page.locator('.practice-checklist-heading .button').click()
    page.locator('.practice-checklist-items li').first.wait_for()
    return page.locator('.practice-checklist-items')


try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1440, 'height': 900})
        page.on('pageerror', lambda error: errors.append(str(error)))
        for theme in ['light', 'dark']:
            for locale in ['ar', 'en']:
                page.goto(BASE)
                page.evaluate('([t,l]) => {localStorage.setItem("mabda-theme",t);localStorage.setItem("vanta-locale",l)}', [theme, locale])
                page.goto(BASE + '/lesson/start')
                reach_practice(page)
                prefix = f'{theme}/{locale}'
                items = check_task(page, 'Hello world')
                check(prefix + ': plain text leaves all three independent requirements missing', items.locator('li.is-passed').count() == 0 and items.locator('li.is-missing').count() == 3, items.inner_text())
                before = page.locator('.practice-checklist-summary').inner_text()
                page.locator('.practice-workspace-actions-primary .button-primary').click()
                page.locator('.practice-preview-state.is-updated').wait_for()
                frame = page.frame_locator('.practice-preview-canvas iframe')
                check(prefix + ': browser still renders plain text', frame.locator('body').inner_text().strip() == 'Hello world')
                check(prefix + ': Run did not pass requirements', before == page.locator('.practice-checklist-summary').inner_text() and items.locator('li.is-passed').count() == 0)
                toggle_shell_theme(page)
                check(prefix + ': theme switch preserves editor and task feedback', page.locator('.cm-content').inner_text().strip() == 'Hello world' and before == page.locator('.practice-checklist-summary').inner_text())
                toggle_shell_theme(page)
                items = check_task(page, '<h1>Hello, Developer!</h1>')
                check(prefix + ': h1 alone still needs the paragraph and order requirements', items.locator('li.is-passed').count() == 1 and items.locator('li:not(.is-passed)').count() == 2, items.inner_text())
                items = check_task(page, '<p>Welcome to Mabda.</p>')
                check(prefix + ': p alone does not complete task', items.locator('li.is-passed').count() < 2, items.inner_text())
                page.locator('.cm-content').fill('<h1>Hello, Developer!</p>')
                page.locator('.practice-diagnostic-item').first.wait_for()
                check(prefix + ': malformed tag has editor lint marker', page.locator('.cm-lintRange-error').count() > 0)
                valid = '<h1>Hello, Developer!</h1><p>Welcome to Mabda.</p>'
                items = check_task(page, '<textarea>' + valid + '</textarea>')
                check(prefix + ': literal tag-looking text is not a solution', items.locator('li.is-passed').count() == 0)
                items = check_task(page, '<template>' + valid + '</template>')
                check(prefix + ': inert template is not a solution', items.locator('li.is-passed').count() == 0)
                items = check_task(page, valid)
                check(prefix + ': all three independent requirements pass', items.locator('li.is-passed').count() == 3)
                page.locator('.practice-workspace-actions-primary .button-primary').click()
                page.locator('.practice-preview-state.is-updated').wait_for()
                check(prefix + ': preview uses current correct HTML', frame.locator('h1').inner_text() == 'Hello, Developer!' and frame.locator('p').inner_text() == 'Welcome to Mabda.')
                page.locator('.practice-studio-navigation .button-primary').click()
                options = page.locator('.lesson-choice')
                options.first.click()
                feedback = page.locator('.lesson-quiz-feedback').inner_text()
                order = options.all_text_contents()
                toggle_shell_theme(page)
                check(prefix + ': quiz answer and feedback survive theme switch', options.all_text_contents() == order and page.locator('.lesson-quiz-feedback').inner_text() == feedback)
                page.screenshot(path=str(OUT / f'quiz-toggle-{theme}-{locale}.png'), full_page=True)
                print('PASS', prefix, flush=True)
        check('No unexpected page errors', not errors, errors)
        browser.close()
except Exception:
    result['failure'] = traceback.format_exc()
finally:
    result.update(checks=checks, errors=errors, passed=sum(x['passed'] for x in checks), total=len(checks))
    (OUT / 'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps({k: v for k, v in result.items() if k != 'checks'}, ensure_ascii=False, indent=2))
if result.get('failure'):
    raise SystemExit(1)
