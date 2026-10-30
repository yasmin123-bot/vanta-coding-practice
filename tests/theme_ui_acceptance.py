"""Optional light/dark UI matrix: existing preview only, no cloud writes.
BASE_URL and EVIDENCE_DIR configurable; requires Playwright and Chromium.
"""
import json, os, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('BASE_URL', 'http://127.0.0.1:5175').rstrip('/')
OUT=Path(os.environ.get('EVIDENCE_DIR', '/tmp/mabda-theme-ui')); OUT.mkdir(parents=True, exist_ok=True)
checks=[]; errors=[]; result={}
def check(label,condition,detail=None):
 checks.append({'name':label,'passed':bool(condition),'detail':detail})
 if not condition: raise AssertionError(label+': '+str(detail))
def practice(page):
 for _ in range(20):
  if page.locator('[data-testid="practice-studio"]').count():
   page.locator('.cm-content').wait_for();return
  page.locator('.lesson-flow-controls .button-primary, .learning-lesson-controls .button-primary').first.click()
 raise AssertionError('Practice unreachable')
def toggle_shell_theme(page):
 page.locator('.mabda-app-menu-trigger').click();page.locator('.theme-toggle').wait_for()
 page.locator('.theme-toggle').click();page.keyboard.press('Escape')
def photo(page,name,full=False):
 page.evaluate('document.fonts.ready');page.evaluate('Promise.all(document.getAnimations().filter(a=>Number.isFinite(a.effect.getTiming().iterations)).map(a=>a.finished.catch(()=>{})))')
 page.screenshot(path=str(OUT/(name+'.png')),full_page=full)
try:
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH', '/usr/bin/chromium'),headless=True,args=['--no-sandbox']);ctx=b.new_context();page=ctx.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(BASE);page.evaluate('localStorage.removeItem("mabda-theme")');page.emulate_media(color_scheme='dark');page.reload()
  check('Default remains light even on dark OS',page.locator('html').get_attribute('data-theme')=='light')
  for theme in ['light','dark']:
   for locale in ['ar','en']:
    for width in [320,390,768,1440]:
     page.set_viewport_size({'width':width,'height':900 if width>600 else 844});page.goto(BASE);page.evaluate('([t,l])=>{localStorage.setItem("mabda-theme",t);localStorage.setItem("vanta-locale",l)}',[theme,locale]);page.reload()
     for route in ['/','/paths','/paths/html-fundamentals','/paths/css-fundamentals','/paths/javascript-fundamentals','/lesson/start','/login','/signup','/forgot-password','/reset-password','/missing-route']:
      page.goto(BASE+route,wait_until='networkidle');page.locator('h1').first.wait_for()
      prefix=f'{theme}/{locale}/{width}{route}'
      check(prefix+' theme',page.locator('html').get_attribute('data-theme')==theme)
      check(prefix+' direction',page.locator('html').get_attribute('dir')==('rtl' if locale=='ar' else 'ltr'))
      check(prefix+' overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
      menu=page.locator('.mabda-app-menu-trigger')
      if menu.count():
       check(prefix+' app menu accessible',bool(menu.get_attribute('aria-label')) and menu.get_attribute('aria-expanded')=='false')
       menu.click();page.locator('.mabda-app-drawer').wait_for()
       toggle=page.locator('.mabda-app-drawer .theme-toggle')
       check(prefix+' drawer theme toggle accessible',toggle.count()==1 and bool(toggle.get_attribute('aria-label')))
       page.keyboard.press('Escape')
      else:
       toggle=page.locator('.theme-toggle')
       check(prefix+' auth theme toggle accessible',toggle.count()==1 and bool(toggle.get_attribute('aria-label')))
      check(prefix+' all visible logos loaded',page.locator('img.mabda-logo').evaluate_all('(els)=>els.every(e=>e.complete&&e.naturalWidth>0)'))
      check(prefix+' header background transparent',page.locator('.mabda-app-brand, .brand-link, .student-auth-header-brand, .mabda-auth-brand, .mabda-intro-identity').first.evaluate('(e)=>getComputedStyle(e).backgroundColor')=='rgba(0, 0, 0, 0)')
      if route in ['/','/login'] and width in [320,1440]:photo(page,f'{theme}-{locale}-{width}-'+('home' if route=='/' else 'login'))
     print(f'PASS {theme} {locale} {width}',flush=True)
    page.goto(BASE+'/lesson/start');practice(page);box=page.locator('.cm-content');box.fill('<h1>Theme-switch draft</h1>')
    toggle_shell_theme(page);check(f'{theme}/{locale} switching keeps code',box.inner_text().strip()=='<h1>Theme-switch draft</h1>');check(f'{theme}/{locale} editor LTR',box.evaluate('(e)=>getComputedStyle(e).direction')=='ltr')
    toggle_shell_theme(page);photo(page,f'{theme}-{locale}-practice-desktop',True)
    page.set_viewport_size({'width':390,'height':844});photo(page,f'{theme}-{locale}-practice-mobile',True)
  page.goto(BASE+'/login');toggle=page.locator('.theme-toggle');toggle.focus();before=page.locator('html').get_attribute('data-theme');page.keyboard.press('Enter');after=page.locator('html').get_attribute('data-theme');check('Keyboard toggle changes mode',before!=after);page.reload();check('Manual choice survives refresh and dark OS',page.locator('html').get_attribute('data-theme')==after)
  page.emulate_media(reduced_motion='reduce');page.goto(BASE);check('Reduced motion preserves Home identity',page.locator('.mabda-app-brand').is_visible() and page.locator('.mabda-home-hero h1').is_visible())
  page.locator('.mabda-app-menu-trigger').click();page.locator('.mabda-app-drawer .theme-toggle').focus();check('Theme focus ring',page.locator('.mabda-app-drawer .theme-toggle').evaluate('(e)=>parseFloat(getComputedStyle(e).outlineWidth)>=2'))
  check('No unexpected page errors',not errors,errors);b.close()
except Exception: result['failure']=traceback.format_exc()
finally:
 result.update(checks=checks,errors=errors,passed=sum(x['passed'] for x in checks),total=len(checks));(OUT/'theme-acceptance.json').write_text(json.dumps(result,ensure_ascii=False,indent=2));print(json.dumps({k:v for k,v in result.items() if k!='checks'},ensure_ascii=False))
if result.get('failure'):raise SystemExit(1)
