// Read-only fixture exporter for the optional Python browser harness (Node >=22.15).
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL, fileURLToPath } = require('node:url');
const { registerHooks, stripTypeScriptTypes } = require('node:module');
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL?.endsWith('.ts') && specifier.startsWith('.') && !path.extname(specifier)) specifier += '.ts';
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.endsWith('.ts')) {
      return { format: 'module', source: stripTypeScriptTypes(fs.readFileSync(fileURLToPath(url), 'utf8')), shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
(async () => {
  const root = path.resolve(__dirname, '..');
  const { messages } = await import(pathToFileURL(path.join(root, 'src/i18n/messages.ts')));
  const { FOUNDATION_LESSON_IDS, getLessonHref, getPathForLesson, getLearningPathHref } = await import(pathToFileURL(path.join(root, 'src/content/learningSystem.ts')));
  const { getLearningLessonCopy } = await import(pathToFileURL(path.join(root, 'src/i18n/foundationLessonCopy.ts')));
  const locales = Object.fromEntries(['ar', 'en'].map((locale) => [locale,
    FOUNDATION_LESSON_IDS.map((id) => ({
      id,
      route: getLessonHref(id),
      pathRoute: getLearningPathHref(getPathForLesson(id)),
      questions: id === 'html-introduction'
        ? messages[locale].lesson.questions
        : getLearningLessonCopy(locale, id).questions,
    })),
  ]));
  process.stdout.write(JSON.stringify(locales));
})().catch((error) => { console.error(error); process.exitCode = 1; });
