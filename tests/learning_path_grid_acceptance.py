"""Browser acceptance for the five-card learning-path catalog; no auth or cloud writes."""
import json
import os
import re
import traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_origin import is_same_origin, safe_origin_for_log, sanitize_diagnostic_text, validate_local_base_url

BASE = validate_local_base_url(os.environ.get('BASE_URL', 'http://127.0.0.1:5175'))
OUT = Path(os.environ.get('EVIDENCE_DIR', '/tmp/mabda-learning-path-grid-acceptance'))
OUT.mkdir(parents=True, exist_ok=True)
checks = []
page_errors = []
local_http_errors = []

EXPECTED = {
    '/paths/html-fundamentals': ('HTML', 12, 'available'),
    '/paths/css-fundamentals': ('CSS', 19, 'available'),
    '/paths/javascript-fundamentals': ('JavaScript', 23, 'available'),
    '/paths/programming-fundamentals': (None, None, 'future'),
    '/paths/problem-solving': (None, None, 'future'),
}
ARTWORK = {
    '/paths/html-fundamentals': '/assets/mabda-path-cards/html.jpg',
    '/paths/css-fundamentals': '/assets/mabda-path-cards/css.png',
    '/paths/javascript-fundamentals': '/assets/mabda-path-cards/javascript.png',
    '/paths/programming-fundamentals': '/assets/mabda-path-cards/programming-principles.png',
    '/paths/problem-solving': '/assets/mabda-path-cards/problem-solving.png',
}
VIEWPORTS = [(320, 800), (390, 844), (768, 1024), (1024, 800), (1440, 900)]


def check(name, passed, detail=None):
    checks.append({'name': name, 'passed': bool(passed), 'detail': detail})
    if not passed:
        raise AssertionError(f'{name}: {detail}')


def ascii_digits(value):
    table = str.maketrans('٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹', '01234567890123456789')
    return value.translate(table)


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
        # Keep this run local-only: no requests can reach Supabase or any other origin.
        page.route('**/*', lambda route: route.continue_() if is_same_origin(route.request.url, BASE) else route.abort())

        for locale in ['ar', 'en']:
            for width, height in VIEWPORTS:
                page.set_viewport_size({'width': width, 'height': height})
                page.goto(BASE + '/paths', wait_until='domcontentloaded')
                page.evaluate('language => localStorage.setItem("vanta-locale", language)', locale)
                page.reload(wait_until='domcontentloaded')
                page.locator('.learning-path-catalog-link').first.wait_for(state='visible')
                page.evaluate('document.fonts.ready')

                cards = page.locator('.learning-path-catalog-link')
                hrefs = [cards.nth(index).get_attribute('href') for index in range(cards.count())]
                check(f'{locale}/{width}: exactly five existing destinations', cards.count() == 5 and set(hrefs) == set(EXPECTED), hrefs)
                check(f'{locale}/{width}: document has no horizontal overflow', page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), page.evaluate('({doc:document.documentElement.scrollWidth, viewport:innerWidth})'))

                layout = page.evaluate('''() => {
                  const catalog = document.querySelector('.learning-path-catalog');
                  const cards = [...document.querySelectorAll('.learning-path-catalog-link')];
                  const box = (el) => { const r = el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}; };
                  const rects = cards.map((card) => ({
                    card: box(card),
                    iconCount: card.querySelectorAll('.learning-path-card-icon img, .learning-path-card-icon svg').length,
                    languageMarkCount: card.querySelectorAll('.learning-path-language-mark').length,
                    progressCount: card.querySelectorAll('[role="progressbar"]').length,
                    content: box(card.querySelector('.learning-path-catalog-copy')),
                    top: box(card.querySelector('.learning-path-card-top')),
                    footer: box(card.querySelector('.learning-path-card-footer')),
                    titleOverflow: card.querySelector('.learning-path-catalog-copy strong').scrollWidth > card.querySelector('.learning-path-catalog-copy strong').clientWidth + 1,
                    descriptionOverflow: card.querySelector('.learning-path-catalog-copy > span').scrollWidth > card.querySelector('.learning-path-catalog-copy > span').clientWidth + 1,
                    innerOverflow: card.scrollWidth > card.clientWidth + 1,
                  }));
                  return {
                    dir: document.documentElement.dir,
                    viewport: innerWidth,
                    documentWidth: document.documentElement.scrollWidth,
                    catalog: box(catalog),
                    columns: getComputedStyle(catalog).gridTemplateColumns.split(' ').length,
                    cards: rects,
                    routeCount: cards.length,
                  };
                }''')
                expected_columns = 1 if width <= 600 else (2 if width <= 960 else 3)
                check(f'{locale}/{width}: direction and responsive column count', layout['dir'] == ('rtl' if locale == 'ar' else 'ltr') and layout['columns'] == expected_columns, {'dir': layout['dir'], 'columns': layout['columns'], 'expected': expected_columns})
                check(f'{locale}/{width}: catalog uses the available content width', layout['catalog']['width'] >= page.locator('.learning-system-main').bounding_box()['width'] - 1, {'catalog': layout['catalog']['width'], 'main': page.locator('.learning-system-main').bounding_box()['width']})
                check(f'{locale}/{width}: each card has one icon and no invented guest progress', all(card['iconCount'] == 1 and card['languageMarkCount'] == 0 and card['progressCount'] == 0 for card in layout['cards']), [{'icons': c['iconCount'], 'marks': c['languageMarkCount'], 'progress': c['progressCount']} for c in layout['cards']])
                check(f'{locale}/{width}: card content does not overlap or overflow', all(c['top']['bottom'] <= c['content']['y'] + 2 and c['content']['bottom'] <= c['footer']['y'] + 2 and not c['titleOverflow'] and not c['descriptionOverflow'] and not c['innerOverflow'] for c in layout['cards']), layout['cards'])
                check(f'{locale}/{width}: cards remain readable with the full-ratio artwork', all(c['card']['width'] >= 270 and 0.68 <= c['card']['width'] / c['card']['height'] <= 1.35 for c in layout['cards']), [{'w': round(c['card']['width']), 'h': round(c['card']['height'])} for c in layout['cards']])

                # Counts come from the existing active curricula; future paths must not invent a count.
                for href, (_, count, status) in EXPECTED.items():
                    card = page.locator(f'.learning-path-catalog-link[href="{href}"]')
                    text = card.locator('.learning-path-card-lesson-count').inner_text()
                    if count is not None:
                        check(f'{locale}/{width}: {href} displays its actual {count}-lesson count', str(count) in ascii_digits(text), text)
                    else:
                        check(f'{locale}/{width}: {href} does not invent a lesson count', '0' not in ascii_digits(text) and card.locator('[class*="lesson-count"]').count() == 1, text)
                    check(f'{locale}/{width}: {href} retains its existing availability state', card.evaluate('(el, expected) => el.closest("li").classList.contains(`path-status-${expected}`)', status), card.get_attribute('class'))

                    image = card.locator('.learning-path-card-visual img')
                    check(f'{locale}/{width}: {href} uses its exact supplied artwork', image.get_attribute('src') == ARTWORK[href], image.get_attribute('src'))
                    image.scroll_into_view_if_needed()
                    page.wait_for_function('(img) => img.complete && img.naturalWidth > 0', arg=image.element_handle())
                    image_meta = image.evaluate('''img => ({
                      width: img.naturalWidth,
                      height: img.naturalHeight,
                      fit: getComputedStyle(img).objectFit,
                      frameRatio: img.parentElement.getBoundingClientRect().width / img.parentElement.getBoundingClientRect().height,
                    })''')
                    check(f'{locale}/{width}: {href} artwork loads uncropped and preserves source ratio', image_meta['width'] > 0 and image_meta['height'] > 0 and image_meta['fit'] == 'contain' and abs(image_meta['frameRatio'] - 1.5) < 0.03, image_meta)

                page.screenshot(path=str(OUT / f'paths-{locale}-{width}.png'), full_page=True)

                # The levels chooser reuses the same HTML/CSS/JavaScript source images.
                levels_url = BASE + '/levels'
                page.goto(levels_url, wait_until='domcontentloaded')
                page.evaluate('language => localStorage.setItem("vanta-locale", language)', locale)
                page.reload(wait_until='domcontentloaded')
                page.locator('.learning-levels-subject-art').first.wait_for(state='visible')
                level_images = page.locator('.learning-levels-subject-art img')
                check(f'{locale}/{width}: levels chooser retains three existing subject cards', level_images.count() == 3, level_images.count())
                for index, path_id in enumerate(['html-fundamentals', 'css-fundamentals', 'javascript-fundamentals']):
                    image = level_images.nth(index)
                    expected_src = ARTWORK[f'/paths/{path_id}']
                    check(f'{locale}/{width}: levels/{path_id} reuses the learning-path artwork', image.get_attribute('src') == expected_src, image.get_attribute('src'))
                    image.scroll_into_view_if_needed()
                    page.wait_for_function('(img) => img.complete && img.naturalWidth > 0', arg=image.element_handle())
                    check(f'{locale}/{width}: levels/{path_id} artwork loads with contain fit', image.evaluate('(img) => img.naturalWidth > 0 && getComputedStyle(img).objectFit === "contain"'), image.evaluate('(img) => ({width:img.naturalWidth,height:img.naturalHeight,fit:getComputedStyle(img).objectFit})'))
                check(f'{locale}/{width}: levels chooser has no horizontal overflow', page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), page.evaluate('({doc:document.documentElement.scrollWidth, viewport:innerWidth})'))
                page.screenshot(path=str(OUT / f'levels-{locale}-{width}.png'), full_page=True)

                # Placement uses the same subject artwork as the learning-path cards.
                for path_id in ['html-fundamentals', 'css-fundamentals', 'javascript-fundamentals']:
                    placement_url = f'{BASE}/levels/{path_id}/placement'
                    page.goto(placement_url, wait_until='domcontentloaded')
                    page.evaluate('language => localStorage.setItem("vanta-locale", language)', locale)
                    page.reload(wait_until='domcontentloaded')
                    placement_image = page.locator('.beginner-placement-artwork img')
                    placement_image.wait_for(state='visible')
                    expected_src = ARTWORK[f'/paths/{path_id}']
                    check(f'{locale}/{width}: placement/{path_id} reuses learning-path artwork', placement_image.get_attribute('src') == expected_src, placement_image.get_attribute('src'))
                    page.wait_for_function('(img) => img.complete && img.naturalWidth > 0', arg=placement_image.element_handle())
                    image_meta = placement_image.evaluate('''img => ({
                      width: img.naturalWidth,
                      height: img.naturalHeight,
                      fit: getComputedStyle(img).objectFit,
                      frameRatio: img.parentElement.getBoundingClientRect().width / img.parentElement.getBoundingClientRect().height,
                    })''')
                    check(f'{locale}/{width}: placement/{path_id} artwork is loaded and uncropped', image_meta['width'] > 0 and image_meta['height'] > 0 and image_meta['fit'] == 'contain' and abs(image_meta['frameRatio'] - 1.5) < 0.03, image_meta)
                    check(f'{locale}/{width}: placement/{path_id} has no horizontal overflow', page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), page.evaluate('({doc:document.documentElement.scrollWidth, viewport:innerWidth})'))

            # Exercise every existing card destination at one desktop-sized viewport per locale.
            page.set_viewport_size({'width': 1280, 'height': 800})
            page.goto(BASE + '/paths', wait_until='domcontentloaded')
            page.evaluate('language => localStorage.setItem("vanta-locale", language)', locale)
            page.reload(wait_until='domcontentloaded')
            for href in EXPECTED:
                page.locator(f'.learning-path-catalog-link[href="{href}"]').click()
                page.wait_for_url('**' + href)
                page.locator('.learning-course-overview').wait_for(state='visible')
                check(f'{locale}: card opens its existing destination {href}', page.locator('.learning-course-overview').is_visible() and page.locator('.learning-not-found').count() == 0, safe_origin_for_log(page.url))
                if EXPECTED[href][2] == 'future':
                    meta_text = page.locator('.learning-course-overview .learning-course-meta').inner_text()
                    check(f'{locale}: future destination reuses its existing outline without lesson-count claims', page.locator('.learning-outline-list li').count() == 5 and re.search(r'\d', ascii_digits(meta_text)) is None, page.locator('.learning-course-overview').inner_text()[:240])
                page.goto(BASE + '/paths', wait_until='domcontentloaded')
                page.evaluate('language => localStorage.setItem("vanta-locale", language)', locale)
                page.reload(wait_until='domcontentloaded')

        check('no uncaught browser errors', not page_errors, page_errors)
        check('no failed local asset or route responses', not local_http_errors, local_http_errors)
        browser.close()
except Exception as error:
    checks.append({'name': 'harness completed without exception', 'passed': False, 'detail': sanitize_diagnostic_text(error)})
    page_errors.append(sanitize_diagnostic_text(traceback.format_exc()))

result = {
    'base_url': BASE,
    'scope': 'local preview only; all non-local requests aborted; no authentication or writes',
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
