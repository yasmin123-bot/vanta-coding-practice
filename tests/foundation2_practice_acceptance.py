"""Targeted Foundation 2 Practice Studio acceptance; guest-only, no cloud writes."""
import json
import os
import traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE_URL', 'http://127.0.0.1:5175').rstrip('/')
OUT = Path(os.environ.get('EVIDENCE_DIR', '/tmp/mabda-foundation2-practice'))
OUT.mkdir(parents=True, exist_ok=True)
checks = []
page_errors = []
console_errors = []
expected_iframe_syntax_error = [False]
observed_expected_iframe_errors = []
result = {}


def check(name, passed, detail=None):
    checks.append({'name': name, 'passed': bool(passed), 'detail': detail})
    if not passed:
        raise AssertionError(f'{name}: {detail}')


def enter_practice(page, route):
    page.goto(BASE + route, wait_until='networkidle')
    for _ in range(24):
        if page.locator('[data-testid="practice-studio"]').count() and page.locator('[data-testid="practice-studio"]').is_visible():
            page.locator('.cm-content').wait_for()
            return
        next_button = page.locator('.learning-lesson-button.button-primary, .lesson-flow-controls .button-primary').first
        if not next_button.count():
            break
        next_button.click()
    raise AssertionError(f'Practice not reachable at {route}')


def check_code(page, code):
    mobile_switch = page.locator('.practice-mobile-view-switch')
    if mobile_switch.is_visible():
        mobile_switch.locator('button').first.click()
    editor = page.locator('.practice-editor-panel .cm-content')
    editor.fill(code)
    check_button = page.locator('.practice-checklist-heading .button')
    check_button.focus()
    page.keyboard.press('Enter')
    page.locator('.practice-checklist-items li').first.wait_for()
    return page.locator('.practice-checklist-items')


def switch_to_code_on_mobile(page, width):
    if width <= 780:
        page.locator('.practice-mobile-view-switch button').first.click()
        page.locator('.practice-editor-panel').wait_for(state='visible')


def switch_to_preview_on_mobile(page, width):
    if width <= 780:
        page.locator('.practice-mobile-view-switch button').nth(1).click()
        page.locator('.practice-preview-panel').wait_for(state='visible')


def record_page_error(error):
    message = str(error)
    if expected_iframe_syntax_error[0] and ('Unexpected token' in message or 'missingFunction is not defined' in message):
        observed_expected_iframe_errors.append(message)
    else:
        page_errors.append(message)


try:
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'), headless=True, args=['--no-sandbox'])
        for width, height in [(1440, 900), (390, 844)]:
            for locale in ['ar', 'en']:
                page = browser.new_page(viewport={'width': width, 'height': height})
                page.on('pageerror', record_page_error)
                page.on('console', lambda message: console_errors.append(message.text) if message.type == 'error' and not message.location.get('url', '').startswith('about:srcdoc') else None)
                page.goto(BASE)
                page.evaluate('([l]) => {localStorage.setItem("mabda-theme","light");localStorage.setItem("vanta-locale",l)}', [locale])

                enter_practice(page, '/lesson/css/colors-backgrounds')
                prefix = f'{width}px/{locale}/css'
                direction = page.locator('html').get_attribute('dir')
                editor_direction = page.locator('.practice-codemirror').evaluate('(el) => getComputedStyle(el).direction')
                check(prefix + ': localized page direction and LTR code', direction == ('rtl' if locale == 'ar' else 'ltr') and editor_direction == 'ltr', {'html': direction, 'editor': editor_direction})
                overflow = page.evaluate('document.documentElement.scrollWidth > window.innerWidth')
                check(prefix + ': no horizontal overflow', not overflow, page.evaluate('({width:innerWidth,scroll:document.documentElement.scrollWidth})'))

                partial = check_code(page, '.card {\n  background-color: #1f2937;\n}')
                check(prefix + ': one CSS requirement passes while another remains missing', partial.locator('li.is-passed').count() == 1 and partial.locator('li.is-missing').count() == 1, partial.inner_text())
                check(prefix + ': partial progress names the remaining requirement', '1 of 2' in page.locator('.practice-checklist-summary').inner_text() or '1 من 2' in page.locator('.practice-checklist-summary').inner_text(), page.locator('.practice-checklist-summary').inner_text())

                typo = check_code(page, '.card {\n  backgroun-color: #1f2937;\n}')
                switch_to_code_on_mobile(page, width)
                page.locator('.practice-diagnostic-item').first.wait_for()
                diagnostic_text = page.locator('.practice-diagnostics-list').inner_text()
                check(prefix + ': unknown CSS property is an error with suggestion and editor marker', 'background-color' in diagnostic_text and page.locator('.cm-lintRange-error').count() > 0, diagnostic_text)
                check(prefix + ': failed requirement includes line and column', '2' in typo.locator('li').first.inner_text() and ('العمود' in typo.locator('li').first.inner_text() or 'column' in typo.locator('li').first.inner_text()), typo.inner_text())
                first_diagnostic = page.locator('.practice-diagnostic-item').first
                first_diagnostic.focus()
                page.keyboard.press('Enter')
                editor_focused = page.evaluate('document.activeElement?.classList.contains("cm-content")')
                check(prefix + ': keyboard activation jumps from diagnostic to editor location', editor_focused, page.locator('.practice-editor-panel .cm-content').get_attribute('aria-label'))

                # CSS is valid even without a final semicolon in general, but this exercise explicitly requires one.
                incomplete_terminator = check_code(page, '.card {\n  color: white;\n  background-color: #1f2937\n}')
                requirements_after_terminator = incomplete_terminator.inner_text()
                summary_after_terminator = page.locator('.practice-checklist-summary').inner_text()
                switch_to_code_on_mobile(page, width)
                page.locator('.practice-diagnostics-list').wait_for()
                check(prefix + ': exercise-required semicolon is an inline hint', 'semicolon' in page.locator('.practice-diagnostics-list').inner_text().lower() or 'الفاصلة المنقوطة' in page.locator('.practice-diagnostics-list').inner_text(), requirements_after_terminator)
                page.locator('.practice-workspace-actions-primary .button-primary').click()
                page.locator('.practice-preview-state.is-updated, .practice-preview-state.is-withIssues').wait_for()
                semicolon_preview_color = page.frame_locator('.practice-preview-canvas iframe').locator('.card').evaluate('(el) => getComputedStyle(el).backgroundColor')
                check(prefix + ': browser renders CSS without final semicolon but exercise remains incomplete', semicolon_preview_color == 'rgb(31, 41, 55)' and page.locator('.practice-checklist-summary').inner_text() == summary_after_terminator and page.locator('.practice-checklist-summary.is-passed').count() == 0, {'color': semicolon_preview_color, 'summary': page.locator('.practice-checklist-summary').inner_text()})

                complete_css = check_code(page, '.card {\n  color: white;\n  background-color: #1f2937;\n}')
                check(prefix + ': complete CSS solution passes every requirement and shows success', complete_css.locator('li.is-passed').count() == complete_css.locator('li').count() and page.locator('.practice-checklist-summary.is-passed').count() == 1, complete_css.inner_text())

                check_code(page, '.card {\n  color: white;\n  background-color: rgb(255, 0, 0);\n}')
                summary_before_run = page.locator('.practice-checklist-summary').inner_text()
                page.locator('.practice-workspace-actions-primary .button-primary').click()
                page.locator('.practice-preview-state.is-updated, .practice-preview-state.is-withIssues').wait_for()
                frame = page.frame_locator('.practice-preview-canvas iframe')
                actual_color = frame.locator('.card').evaluate('(el) => getComputedStyle(el).backgroundColor')
                check(prefix + ': Run updates actual preview CSS', actual_color == 'rgb(255, 0, 0)', actual_color)
                check(prefix + ': Run does not alter requirement result', page.locator('.practice-checklist-summary').inner_text() == summary_before_run, page.locator('.practice-checklist-summary').inner_text())
                switch_to_code_on_mobile(page, width)
                page.locator('.practice-editor-panel .cm-content').fill('.card {\n  color: white;\n  background-color: rgb(0, 0, 255);\n}')
                switch_to_preview_on_mobile(page, width)
                page.locator('.practice-preview-state.is-stale').wait_for()
                page.locator('.practice-workspace-actions-primary .button-primary').click()
                page.locator('.practice-preview-state.is-updated, .practice-preview-state.is-withIssues').wait_for()
                fresh_color = page.frame_locator('.practice-preview-canvas iframe').locator('.card').evaluate('(el) => getComputedStyle(el).backgroundColor')
                check(prefix + ': rerun refreshes the preview after code edits', fresh_color == 'rgb(0, 0, 255)', fresh_color)
                if locale == 'ar':
                    page.screenshot(path=str(OUT / f'css-practice-{width}-ar.png'), full_page=True)

                enter_practice(page, '/lesson/javascript/what-is-javascript')
                prefix = f'{width}px/{locale}/js'
                # HTML remains a separate tab; the required JavaScript editor is selected on entry.
                js_correct = 'const message = document.querySelector("#message");\nmessage.textContent = "A new message";'
                js_results = check_code(page, js_correct)
                check(prefix + ': valid JavaScript meets all structural requirements', js_results.locator('li.is-passed').count() == js_results.locator('li').count(), js_results.inner_text())
                js_summary = page.locator('.practice-checklist-summary').inner_text()
                page.locator('.practice-workspace-actions-primary .button-primary').click()
                page.locator('.practice-preview-state.is-updated, .practice-preview-state.is-withIssues').wait_for()
                js_frame = page.frame_locator('.practice-preview-canvas iframe')
                check(prefix + ': valid JavaScript changes actual rendered content', js_frame.locator('#message').inner_text() == 'A new message', js_frame.locator('#message').inner_text())
                check(prefix + ': running JavaScript does not change task validation', page.locator('.practice-checklist-summary').inner_text() == js_summary)

                switch_to_code_on_mobile(page, width)
                js_wrong = 'const message = document.querySelector("#notice");\nmessage.textContent = "A new message";'
                wrong_results = check_code(page, js_wrong)
                check(prefix + ': a wrong selector fails only unmet requirements', wrong_results.locator('li.is-passed').count() >= 1 and wrong_results.locator('li:not(.is-passed)').count() >= 1, wrong_results.inner_text())
                check(prefix + ': wrong JavaScript requirement points to its source', wrong_results.locator('.practice-checklist-location').count() >= 1, wrong_results.inner_text())

                runtime_code = 'const message = document.querySelector("#message");\nmissingFunction();'
                runtime_results = check_code(page, runtime_code)
                runtime_summary = page.locator('.practice-checklist-summary').inner_text()
                expected_iframe_syntax_error[0] = True
                page.locator('.practice-workspace-actions-primary .button-primary').click()
                page.locator('.practice-preview-state.is-failed').wait_for()
                expected_iframe_syntax_error[0] = False
                runtime_feedback = page.locator('.practice-runtime-error')
                runtime_feedback.wait_for()
                runtime_location = runtime_feedback.locator('code[dir="auto"]').inner_text()
                check(prefix + ': runtime JavaScript error is distinct from syntax and has a source location', runtime_feedback.count() == 1 and ('missingFunction' in runtime_feedback.inner_text() or 'ReferenceError' in runtime_feedback.inner_text()) and ('2' in runtime_location), {'feedback': runtime_feedback.inner_text(), 'location': runtime_location})
                check(prefix + ': runtime failure does not change incomplete exercise validation', page.locator('.practice-checklist-summary').inner_text() == runtime_summary and runtime_results.locator('li.is-passed').count() < runtime_results.locator('li').count(), runtime_results.inner_text())

                switch_to_code_on_mobile(page, width)
                page.locator('.practice-editor-panel .cm-content').fill('const message = ;')
                page.locator('.practice-diagnostic-item').first.wait_for()
                syntax_diagnostics = page.locator('.practice-diagnostics-list').inner_text()
                check(prefix + ': JavaScript syntax error is marked in editor', page.locator('.cm-lintRange-error').count() > 0 and len(syntax_diagnostics) > 0, syntax_diagnostics)
                preview_before_failure = page.locator('.practice-preview-canvas iframe').count()
                expected_iframe_syntax_error[0] = True
                page.locator('.practice-workspace-actions-primary .button-primary').click()
                page.locator('.practice-preview-state.is-failed').wait_for()
                expected_iframe_syntax_error[0] = False
                check(prefix + ': failed run is explicit and does not leave a successful stale state', page.locator('.practice-preview-state.is-failed').count() == 1 and page.locator('.practice-preview-status.is-error').count() == 1, {'framesBefore': preview_before_failure, 'state': page.locator('.practice-preview-state').inner_text()})
                if locale == 'ar':
                    page.screenshot(path=str(OUT / f'js-practice-{width}-ar.png'), full_page=True)

                page.close()
        reduced_page = browser.new_page(viewport={'width': 390, 'height': 844})
        reduced_page.emulate_media(reduced_motion='reduce')
        enter_practice(reduced_page, '/lesson/css/colors-backgrounds')
        motion = reduced_page.evaluate('''() => {
          const element = document.querySelector('.practice-workspace-actions-primary .button-primary');
          const style = getComputedStyle(element);
          return {matches: matchMedia('(prefers-reduced-motion: reduce)').matches, transition: parseFloat(style.transitionDuration), animation: parseFloat(style.animationDuration)};
        }''')
        check('Reduced motion disables Practice Studio transitions and animations', motion['matches'] and motion['transition'] <= 0.001 and motion['animation'] <= 0.001, motion)
        reduced_page.close()
        check('No uncaught page errors', not page_errors, page_errors)
        check('No browser console errors', not console_errors, console_errors)
        browser.close()
except Exception:
    result['failure'] = traceback.format_exc()
finally:
    result.update(checks=checks, pageErrors=page_errors, expectedIframeSyntaxErrors=observed_expected_iframe_errors, consoleErrors=console_errors, passed=sum(item['passed'] for item in checks), total=len(checks))
    (OUT / 'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps({key: value for key, value in result.items() if key != 'checks'}, ensure_ascii=False, indent=2))
if result.get('failure'):
    raise SystemExit(1)
