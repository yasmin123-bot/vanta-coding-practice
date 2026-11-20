"""Local-only browser acceptance for Beginner levels and progression; no auth or cloud writes."""
import json
import os
import traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_origin import is_same_origin, safe_origin_for_log, sanitize_diagnostic_text, validate_local_base_url

BASE = validate_local_base_url(os.environ.get('BASE_URL', 'http://127.0.0.1:5175'))
OUT = Path(os.environ.get('EVIDENCE_DIR', '/tmp/mabda-beginner-levels-acceptance'))
OUT.mkdir(parents=True, exist_ok=True)
MANIFEST = json.loads(Path('public/manus-routes.json').read_text())['routes']
PATHS = [
    ('html-fundamentals', 'HTML'),
    ('css-fundamentals', 'CSS'),
    ('javascript-fundamentals', 'JavaScript'),
]
checks = []
page_errors = []
local_http_errors = []


def check(name, passed, detail=None):
    checks.append({'name': name, 'passed': bool(passed), 'detail': detail})
    if not passed:
        raise AssertionError(f'{name}: {detail}')


def set_locale(page, locale):
    page.goto(BASE + '/levels', wait_until='domcontentloaded')
    page.evaluate('(locale) => localStorage.setItem("vanta-locale", locale)', locale)
    page.reload(wait_until='domcontentloaded')
    page.locator('.learning-levels-grid').wait_for(state='visible')


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
        page.on('pageerror', lambda error: page_errors.append(sanitize_diagnostic_text(error)))
        page.on('response', lambda response: local_http_errors.append({'origin': safe_origin_for_log(response.url), 'status': response.status}) if is_same_origin(response.url, BASE) and response.status >= 400 else None)
        # All non-local requests (including Supabase) are blocked for this guest-only run.
        page.route('**/*', lambda route: route.continue_() if is_same_origin(route.request.url, BASE) else route.abort())

        for locale in ('ar', 'en'):
            for width in (320, 390, 768, 1440):
                page.set_viewport_size({'width': width, 'height': 900})
                set_locale(page, locale)
                subjects = page.locator('.learning-levels-subject')
                check(f'{locale}/{width}: three subject cards', subjects.count() == 3, subjects.count())
                check(f'{locale}/{width}: page direction and no horizontal overflow', page.locator('html').get_attribute('dir') == ('rtl' if locale == 'ar' else 'ltr') and page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), page.evaluate('({dir:document.documentElement.dir, width:document.documentElement.scrollWidth, viewport:innerWidth})'))
                check(f'{locale}/{width}: each subject exposes only one available tier and two locked tiers', all(subject.locator('.learning-levels-tier.is-available').count() == 1 and subject.locator('.learning-levels-tier.is-locked').count() == 2 for subject in [subjects.nth(i) for i in range(subjects.count())]), None)
                check(f'{locale}/{width}: all subject artwork loaded', all(subjects.nth(i).locator('img').evaluate('(img) => img.complete && img.naturalWidth > 0') for i in range(subjects.count())), None)

            # Verify every course has exactly 50 lesson rows and preserved existing links.
            for path_id, label in PATHS:
                course = f'/levels/{path_id}/beginner'
                page.goto(BASE + course, wait_until='domcontentloaded')
                page.locator('.beginner-lesson-list').wait_for(state='visible')
                check(f'{locale}: {label} beginner contains 50 lesson rows', page.locator('.beginner-lesson-row').count() == 50, page.locator('.beginner-lesson-row').count())
                check(f'{locale}: {label} course clearly states temporary session progress', 'session' in page.locator('.learning-levels-session-note').inner_text().lower() or 'جلسة' in page.locator('.learning-levels-session-note').inner_text(), page.locator('.learning-levels-session-note').inner_text())
                check(f'{locale}: next lesson starts locked', 'locked' in page.locator('.beginner-lesson-row').nth(1).inner_text().lower() or 'مقفل' in page.locator('.beginner-lesson-row').nth(1).inner_text(), page.locator('.beginner-lesson-row').nth(1).inner_text())
                first_route = next(r['path'] for r in MANIFEST if r['path'].startswith(f'{course}/lesson/') and r.get('title', '').endswith('lesson 01'))
                page.goto(BASE + first_route, wait_until='domcontentloaded')
                lesson_intro = page.locator('.beginner-lesson-intro, .learning-lesson-intro')
                lesson_intro.wait_for(state='visible')
                check(f'{locale}: {label} first lesson renders in the selected language and direction', bool(lesson_intro.locator('h1').inner_text().strip()) and page.locator('html').get_attribute('dir') == ('rtl' if locale == 'ar' else 'ltr') and page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), lesson_intro.inner_text()[:160])

            # The optional placement test must stop at the first missed band and offer an explicit save.
            page.goto(BASE + '/levels/html-fundamentals/placement', wait_until='domcontentloaded')
            question = page.locator('.beginner-placement-question')
            question.wait_for(state='visible')
            first_question = page.locator('.learning-choice')
            wrong_choice_found = False
            for choice_index in range(first_question.count()):
                first_question.nth(choice_index).click()
                wrong_choice_found = 'is-incorrect' in first_question.nth(choice_index).get_attribute('class')
                if wrong_choice_found:
                    break
                page.reload(wait_until='domcontentloaded')
                question.wait_for(state='visible')
                first_question = page.locator('.learning-choice')
            check(f'{locale}: placement offers a wrong-answer diagnostic path', wrong_choice_found, None)
            page.locator('.beginner-placement-question [role="status"] button').click()
            second_question = page.locator('.learning-choice')
            second_question.first.click()
            page.locator('.beginner-placement-question [role="status"] button').click()
            page.locator('.beginner-placement-result').wait_for(state='visible')
            result_text = page.locator('.beginner-placement-result').inner_text()
            check(f'{locale}: placement does not skip an unmastered first band', ('lesson 1' in result_text.lower() or 'الدرس ١' in result_text or 'الدرس 1' in result_text) and 'اجتزت 0' not in result_text, result_text)
            page.get_by_role('button', name=('استخدم نقطة البداية المقترحة' if locale == 'ar' else 'Use recommended starting point')).click()
            check(f'{locale}: placement recommendation is explicitly saved only for the tab session', page.get_by_role('status').count() > 0 and page.evaluate('sessionStorage.getItem("mabda-beginner-session-progress-v1") !== null'), None)

        # An explicit beginner-first choice must override a previously stored placement recommendation.
        page.evaluate('''() => {
          const key = "mabda-beginner-session-progress-v1";
          const state = JSON.parse(sessionStorage.getItem(key) || "{}");
          state.placementStartIndex = { ...(state.placementStartIndex || {}), "html-fundamentals": 38 };
          sessionStorage.setItem(key, JSON.stringify(state));
        }''')
        page.goto(BASE + '/levels/html-fundamentals/beginner?start=first', wait_until='domcontentloaded')
        page.locator('.beginner-lesson-list').wait_for(state='visible')
        page.locator('.beginner-lesson-row').first.wait_for(state='visible')
        check('explicit beginner-first choice overrides a prior placement recommendation', 'Available now' in page.locator('.beginner-lesson-row').first.inner_text() and page.evaluate('JSON.parse(sessionStorage.getItem("mabda-beginner-session-progress-v1") || "{}").placementStartIndex?.["html-fundamentals"] === 0'), page.locator('.beginner-lesson-row').first.inner_text())

        # Test an end-to-end lesson quiz using the HTML lesson's actual four options.
        set_locale(page, 'ar')
        page.goto(BASE + '/levels/html-fundamentals/beginner/lesson/html-b-001-markup-anatomy', wait_until='domcontentloaded')
        page.locator('.beginner-lesson-intro').wait_for(state='visible')
        check('lesson has explanation and examples', page.locator('.beginner-learning-step').count() == 1 and page.locator('.beginner-example').count() >= 1, None)
        next_step = page.locator('.beginner-lesson-controls .button-primary')
        while next_step.is_enabled():
            next_step.click()
        exercise = page.locator('.beginner-exercise-confirm input')
        if not exercise.is_checked():
            exercise.check()
        page.get_by_role('button', name='ابدأ سؤال الدرس').click()
        choices = page.locator('.beginner-quiz .learning-choice')
        passed = False
        for choice_index in range(choices.count()):
            choices.nth(choice_index).click()
            if 'is-correct' in choices.nth(choice_index).get_attribute('class'):
                passed = True
                break
            page.get_by_role('button', name='أعد المحاولة').click()
        check('lesson quiz renders after start and supports retry until correct', passed, page.locator('.beginner-quiz').inner_text())
        page.get_by_role('button', name='اجتزت الدرس وافتح التالي').click()
        check('lesson pass is recorded in session only', page.evaluate('JSON.parse(sessionStorage.getItem("mabda-beginner-session-progress-v1") || "{}").completedLessonIds?.["html-fundamentals"]?.includes("html-b-001-markup-anatomy") === true'), None)
        page.goto(BASE + '/levels/html-fundamentals/beginner/lesson/html-b-002-attributes-and-quotes', wait_until='domcontentloaded')
        page.locator('.beginner-lesson-intro').wait_for(state='visible')
        check('passing a lesson unlocks only its direct successor', page.locator('.beginner-lesson-locked').count() == 0, safe_origin_for_log(page.url))

        # Final assessment and project must remain gated before their prerequisites.
        page.goto(BASE + '/assessment/html-fundamentals?level=beginner', wait_until='domcontentloaded')
        page.locator('.beginner-lesson-locked').wait_for(state='visible')
        check('final assessment does not open before all lessons are complete', page.locator('.beginner-lesson-locked').count() == 1, page.locator('main').inner_text()[:300])
        page.goto(BASE + '/levels/html-fundamentals/beginner/project', wait_until='domcontentloaded')
        page.locator('.beginner-lesson-locked').wait_for(state='visible')
        check('capstone does not open before final assessment passes', page.locator('.beginner-lesson-locked').count() == 1, page.locator('main').inner_text()[:300])

        check('no uncaught browser errors', not page_errors, page_errors)
        check('no failed local asset or route responses', not local_http_errors, local_http_errors)
        page.screenshot(path=str(OUT / 'beginner-levels-final.png'), full_page=True)
        browser.close()
except Exception as error:
    checks.append({'name': 'harness completed without exception', 'passed': False, 'detail': sanitize_diagnostic_text(error)})
    page_errors.append(sanitize_diagnostic_text(traceback.format_exc()))

result = {
    'base_url': BASE,
    'scope': 'local preview only; all non-local requests aborted; guest-only; no authentication or cloud writes',
    'checks': checks,
    'passed': sum(1 for item in checks if item['passed']),
    'failed': sum(1 for item in checks if not item['passed']),
    'page_errors': page_errors,
    'local_http_errors': local_http_errors,
    'evidence_directory': str(OUT),
}
(OUT / 'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2))
print(json.dumps({key: value for key, value in result.items() if key != 'checks'}, ensure_ascii=False, indent=2))
for item in checks:
    if not item['passed']:
        print(json.dumps(item, ensure_ascii=False))
if result['failed']:
    raise SystemExit(1)
