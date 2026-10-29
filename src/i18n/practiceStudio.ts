import type { HtmlLessonId } from '../content/learningSystem';
import type { PracticeCheckId } from '../utils/practiceValidation';

export type PracticeStudioLocale = {
  stepName: string;
  openPractice: string;
  title: string;
  intro: string;
  taskLabel: string;
  expectedLabel: string;
  editorLabel: string;
  previewLabel: string;
  htmlTab: string;
  cssTab: string;
  jsTab: string;
  run: string;
  running: string;
  reset: string;
  save: string;
  saving: string;
  saved: string;
  saveFailed: string;
  retrySave: string;
  restoreSaved: string;
  resetNotice: string;
  restoredDraftNotice: string;
  changedNotice: string;
  guestNotice: string;
  login: string;
  cloudUnavailable: string;
  loading: string;
  loadFailed: string;
  retryLoad: string;
  noSavedDraft: string;
  previewEmpty: string;
  previewUpdated: string;
  previewStale: string;
  previewErrorTitle: string;
  previewFailed: string;
  previewWithIssues: (count: number) => string;
  previewLabels: { empty: string; running: string; updated: string; stale: string; failed: string; withIssues: string };
  diagnostics: {
    title: string;
    analyzing: string;
    noIssues: string;
    count: (count: number) => string;
    showMore: (count: number) => string;
    location: (line: number, column: number) => string;
    locationUnknown: string;
    syntax: string;
    structure: string;
    value: string;
    property: string;
    runtime: string;
    htmlMissingClose: (tag: string) => string;
    htmlMissingBeforeClose: (tag: string, closing: string) => string;
    htmlUnexpectedClose: (tag: string) => string;
    htmlVoidClosing: (tag: string) => string;
    htmlMalformedTag: string;
    htmlUnclosedComment: string;
    htmlCloseSuggestion: (tag: string) => string;
    htmlUnexpectedSuggestion: (tag: string) => string;
    htmlVoidSuggestion: (tag: string) => string;
    htmlTagSuggestion: string;
    htmlCommentSuggestion: string;
    cssSyntax: string;
    cssSyntaxSuggestion: string;
    cssUnknownProperty: (property: string) => string;
    cssPropertySuggestion: string;
    cssInvalidValue: (property: string, value: string) => string;
    cssMissingValue: (property: string) => string;
    cssValueSuggestion: string;
    jsSyntax: string;
    jsExpectedValue: string;
    jsExpectedExpression: string;
    jsSyntaxSuggestion: string;
    runtimeMessage: (message: string) => string;
    runtimeSuggestion: string;
  };
  checkTask: string;
  checksTitle: string;
  checkPassed: string;
  checkPending: string;
  allChecksPassed: string;
  someChecksPending: string;
  sandboxNote: string;
  returnToLesson: string;
  continueToQuiz: string;
  editorHelp: string;
  previewFrameTitle: string;
  exercises: Record<HtmlLessonId, {
    task: string;
    expected: string;
    checks: Partial<Record<PracticeCheckId, { label: string; passed: string; missing: string }>>;
  }>;
};

export const practiceStudioMessages: Record<'ar' | 'en', PracticeStudioLocale> = {
  ar: {
    stepName: 'التطبيق',
    openPractice: 'افتح مساحة الممارسة',
    title: 'مساحة الممارسة',
    intro: 'اكتب الكود، شغّل المعاينة، ثم افحص متطلبات المهمة. تشغيل الكود وحده لا يعني إكمال التمرين.',
    taskLabel: 'المهمة',
    expectedLabel: 'ما الذي ستتعلمه',
    editorLabel: 'محرر الكود',
    previewLabel: 'المعاينة',
    htmlTab: 'HTML',
    cssTab: 'CSS اختياري',
    jsTab: 'JavaScript اختياري',
    run: 'شغّل المعاينة',
    running: 'جارٍ تحديث المعاينة…',
    reset: 'إعادة كود البداية',
    save: 'حفظ المسودة',
    saving: 'جارٍ الحفظ…',
    saved: 'حُفظت المسودة في حسابك.',
    saveFailed: 'تعذّر حفظ المسودة. بقي عملك الحالي في المحرر؛ حاول مجددًا.',
    retrySave: 'أعد محاولة الحفظ',
    restoreSaved: 'استعادة آخر مسودة محفوظة',
    resetNotice: 'أُعيد كود المحرر إلى البداية. المسودة السحابية لم تتغير؛ احفظ فقط إذا أردت استبدالها.',
    restoredDraftNotice: 'تمت استعادة مسودتك المحفوظة. كود البداية الجديد لا يستبدلها؛ أعد كود البداية للبدء من جديد، ثم احفظ فقط إذا أردت استبدال المسودة المحفوظة.',
    changedNotice: 'لديك تغييرات غير محفوظة في هذا المحرر.',
    guestNotice: 'تستطيع التجربة كزائر، لكن عملك ليس محفوظًا سحابيًا وسيزول عند مغادرة هذه الصفحة أو إعادة تحميلها.',
    login: 'سجّل الدخول للحفظ',
    cloudUnavailable: 'الحفظ السحابي غير متاح حاليًا؛ يمكنك متابعة التمرين كزائر.',
    loading: 'جارٍ تحميل مسودتك…',
    loadFailed: 'تعذّر تحميل المسودة. أعد المحاولة قبل تعديلها حتى لا تستبدل نسخة محفوظة دون قصد.',
    retryLoad: 'إعادة تحميل المسودة',
    noSavedDraft: 'لا توجد مسودة محفوظة بعد؛ يبدأ محرر HTML بكود بداية غير محلول لهذا التمرين.',
    previewEmpty: 'شغّل المعاينة لترى نتيجة HTML وCSS وJavaScript.',
    previewUpdated: 'تم تحديث المعاينة. افحص قائمة المهمة على حدة.',
    previewStale: 'تغيّر الكود بعد آخر تشغيل؛ شغّل المعاينة لتحديثها.',
    previewErrorTitle: 'خطأ أثناء تشغيل JavaScript',
    previewFailed: 'فشل تشغيل JavaScript. المعاينة الحالية تخص هذه المحاولة لكنها قد تكون غير مكتملة؛ راجع التشخيص أدناه.',
    previewWithIssues: (count) => `تم تشغيل النسخة الحالية، لكن رُصدت ${count} مشكلة في الكود؛ قد تكون النتيجة جزئية. راجع التشخيصات.`,
    previewLabels: { empty: '○ —', running: '◌ جارٍ التشغيل', updated: '● مُحدّثة', stale: '● تغيّرت', failed: '● فشل التشغيل', withIssues: '● مع ملاحظات' },
    diagnostics: {
      title: 'تشخيص الكود',
      analyzing: 'جارٍ فحص الصياغة…',
      noIssues: 'لم تُرصد مشكلة صياغة في هذا الملف. افحص متطلبات التمرين بشكل منفصل؛ هذا الفحص لا يغطي كل الأخطاء.',
      count: (count) => `رُصدت ${count} مشكلة. اضغط على أي تشخيص للانتقال إلى موضعه في المحرر.`,
      showMore: (count) => `عرض ${count} تشخيصات أخرى`,
      location: (line, column) => `السطر ${line}، العمود ${column}`,
      locationUnknown: 'الموقع غير متاح',
      syntax: 'صياغة',
      structure: 'بنية HTML',
      value: 'قيمة CSS',
      property: 'خاصية CSS',
      runtime: 'وقت التشغيل',
      htmlMissingClose: (tag) => `الوسم <${tag}> لم يُغلق.`,
      htmlMissingBeforeClose: (tag, closing) => `أغلق <${tag}> قبل الوسم </${closing}>.`,
      htmlUnexpectedClose: (tag) => `لا يوجد وسم <${tag}> مفتوح ليُغلق هنا.`,
      htmlVoidClosing: (tag) => `الوسم <${tag}> من العناصر التي لا تحتاج إلى وسم إغلاق.`,
      htmlMalformedTag: 'يبدو أن وسم HTML غير مكتمل أو مكتوب بطريقة غير صحيحة.',
      htmlUnclosedComment: 'تعليق HTML لم يُغلق.',
      htmlCloseSuggestion: (tag) => `أضف </${tag}> في نهاية المحتوى داخل هذا العنصر.`,
      htmlUnexpectedSuggestion: (tag) => `تحقق من اسم الوسم أو أضف وسم <${tag}> الافتتاحي المقابل.`,
      htmlVoidSuggestion: (tag) => `احذف </${tag}>؛ يكفي وسم <${tag}> الافتتاحي.`,
      htmlTagSuggestion: 'تأكد من كتابة اسم الوسم ثم إغلاقه بعلامة >، ومن إغلاق علامات الاقتباس حول السمات.',
      htmlCommentSuggestion: 'أغلق التعليق باستخدام -->.',
      cssSyntax: 'تعذّر تحليل هذا الجزء من CSS.',
      cssSyntaxSuggestion: 'راجع النقطتين : والأقواس { } وترتيب الخاصية والقيمة.',
      cssUnknownProperty: (property) => `الخاصية “${property}” غير معروفة في CSS.`,
      cssPropertySuggestion: 'تحقق من تهجئة اسم الخاصية، أو أضف -- في بدايتها إذا كانت خاصية مخصصة.',
      cssInvalidValue: (property, value) => `القيمة “${value}” غير معروفة أو غير صالحة للخاصية “${property}”.`,
      cssMissingValue: (property) => `الخاصية “${property}” تحتاج إلى قيمة بعد النقطتين.`,
      cssValueSuggestion: 'تحقق من تهجئة الخاصية ومن أن القيمة مناسبة لها، ثم أعد تشغيل المعاينة.',
      jsSyntax: 'تعذّر تحليل هذا الجزء من JavaScript.',
      jsExpectedValue: 'توجد علامة = من دون قيمة بعدها.',
      jsExpectedExpression: 'يبدو أن التعبير أو القيمة داخل الأقواس غير مكتمل.',
      jsSyntaxSuggestion: 'راجع الأقواس وعلامات الاقتباس والفواصل والتعبير قرب هذا الموضع.',
      runtimeMessage: (message) => `حدث خطأ أثناء تشغيل JavaScript: ${message}`,
      runtimeSuggestion: 'راجع اسم المتغير أو نوع القيمة وطريقة استدعاء الدالة. لم نغيّر كودك تلقائيًا.',
    },
    checkTask: 'افحص متطلبات المهمة',
    checksTitle: 'قائمة التحقق',
    checkPassed: 'مكتمل',
    checkPending: 'يحتاج مراجعة',
    allChecksPassed: 'اكتملت متطلبات هذا التمرين. لم يتغير إكمال الدرس أو نتيجة الاختبار.',
    someChecksPending: 'راجع العناصر غير المكتملة وعدّل HTML ثم افحص المهمة مجددًا.',
    sandboxNote: 'المعاينة تعمل داخل iframe معزول عن تطبيق VANTA. الاتصالات والموارد الخارجية محظورة قدر الإمكان؛ هذا عزل متصفح تعليمي وليس ضمانًا أمنيًا مطلقًا.',
    returnToLesson: 'العودة إلى الشرح',
    continueToQuiz: 'متابعة إلى الاختبار',
    editorHelp: 'استخدم Tab للتنقل بين HTML وCSS وJavaScript. المحررات دائمًا من اليسار إلى اليمين.',
    previewFrameTitle: 'معاينة شيفرة هذا التمرين داخل إطار معزول',
    exercises: {
      'html-introduction': {
        task: 'أنشئ عنوانًا رئيسيًا بالنص “Hello, Developer!” وفقرة بالنص “Welcome to VANTA.”. ابدأ من الوسمين <h1> و<p>.',
        expected: 'قراءة وسمَي العنوان والفقرة كعنصرين HTML، ومعرفة أن التشغيل منفصل عن فحص المهمة.',
        checks: {
          heading: { label: 'عنوان h1 يحتوي “Hello” و“Developer”', passed: 'عُثر على العنوان الرئيسي المطلوب.', missing: 'أضف عنصر h1 واجعل نصه يتضمن Hello وDeveloper.' },
          paragraph: { label: 'فقرة p ترحّب بمتعلم VANTA', passed: 'عُثر على فقرة الترحيب.', missing: 'أضف عنصر p يحتوي Welcome وVANTA.' },
        },
      },
      'html-headings-paragraphs': {
        task: 'نظّم موضوعًا من اختيارك بعنوان رئيسي، عنوان فرعي، وفقرة تشرح الفكرة.',
        expected: 'اختيار h1 للمحور الرئيسي وh2 لقسم تحته، مع وضع الشرح داخل p.',
        checks: {
          heading: { label: 'عنوان h1 رئيسي غير فارغ', passed: 'يوجد عنوان رئيسي واضح.', missing: 'أضف h1 بنص يعبّر عن الصفحة.' },
          subheading: { label: 'عنوان h2 لقسم فرعي', passed: 'يوجد عنوان فرعي.', missing: 'أضف h2 غير فارغ أسفل العنوان الرئيسي.' },
          paragraph: { label: 'فقرة p تحتوي شرحًا', passed: 'يوجد نص داخل فقرة.', missing: 'أضف p واكتب فيها جملة قصيرة.' },
        },
      },
      'html-links-navigation': {
        task: 'أنشئ رابطًا إلى وجهة مناسبة، واكتب نصًا يوضح للزائر ما الذي سيفتحه.',
        expected: 'استخدام عنصر a مع href غير فارغ ونص رابط مفهوم بدل “اضغط هنا”.',
        checks: {
          'link-href': { label: 'رابط a له href صالح وغير فارغ', passed: 'للعنصر وجهة محددة.', missing: 'أضف href إلى عنصر a، وتجنب # وjavascript:.' },
          'link-text': { label: 'نص الرابط واضح ومقروء', passed: 'نص الرابط يصف وجهته.', missing: 'اكتب داخل a عبارة توضح الوجهة، وتجنب “اضغط هنا” والعبارات العامة.' },
        },
      },
      'html-images-attributes': {
        task: 'أضف صورة بمصدر src ونص بديل alt يصف ما تعرضه الصورة.',
        expected: 'فهم أن src يحدد ملف الصورة وأن alt يصفها لمن لا يراها.',
        checks: {
          'image-src': { label: 'عنصر img له src', passed: 'للعنصر مصدر صورة.', missing: 'أضف src غير فارغ إلى عنصر img.' },
          'image-alt': { label: 'عنصر img له alt وصفي', passed: 'يوجد نص بديل يمكن فهمه.', missing: 'اكتب في alt وصفًا قصيرًا، لا كلمة عامة أو نصًا تجريبيًا مثل “image” أو “xxxx”.' },
        },
      },
      'html-first-page': {
        task: 'أكمل هيكل الوثيقة: DOCTYPE، ثم head يتضمن title، ثم body لمحتوى الصفحة.',
        expected: 'تمييز معلومات الصفحة داخل head عن المحتوى الظاهر داخل body.',
        checks: {
          doctype: { label: 'DOCTYPE في بداية الوثيقة', passed: 'يبدأ الملف بإعلان HTML5.', missing: 'ابدأ الملف بـ <!doctype html>.' },
          head: { label: 'عنصر head مغلق', passed: 'يوجد قسم head كامل.', missing: 'أضف <head> واغلقه بـ </head>.' },
          title: { label: 'عنوان title غير فارغ داخل head', passed: 'للوثيقة عنوان في head.', missing: 'أضف title يحتوي نصًا داخل head.' },
          body: { label: 'عنصر body مغلق', passed: 'يوجد قسم body للمحتوى.', missing: 'أضف <body> واغلقه بـ </body>.' },
        },
      },
    },
  },
  en: {
    stepName: 'PRACTICE',
    openPractice: 'Open Practice Studio',
    title: 'Practice Studio',
    intro: 'Write code, run the preview, then check the task requirements. Running code alone does not complete the exercise.',
    taskLabel: 'TASK',
    expectedLabel: 'WHAT YOU WILL LEARN',
    editorLabel: 'Code editor',
    previewLabel: 'Preview',
    htmlTab: 'HTML',
    cssTab: 'Optional CSS',
    jsTab: 'Optional JavaScript',
    run: 'Run preview',
    running: 'Updating preview…',
    reset: 'Reset editor to starter',
    save: 'Save draft',
    saving: 'Saving…',
    saved: 'Draft saved to your account.',
    saveFailed: 'Could not save the draft. Your current editor work is still here; please retry.',
    retrySave: 'Retry save',
    restoreSaved: 'Restore last saved draft',
    resetNotice: 'The editor is back to its starter code. Your cloud draft is unchanged; save only if you want to replace it.',
    restoredDraftNotice: 'Your saved draft has been restored. The new starter does not replace it; reset to start fresh, then save only if you intend to replace your saved draft.',
    changedNotice: 'You have unsaved changes in this editor.',
    guestNotice: 'You can practice as a guest, but your work is not saved to the cloud and will be lost when you leave or reload this page.',
    login: 'Sign in to save',
    cloudUnavailable: 'Cloud saving is unavailable right now; you can continue as a guest.',
    loading: 'Loading your draft…',
    loadFailed: 'Could not load your draft. Retry before editing so an existing saved version is not overwritten by accident.',
    retryLoad: 'Retry loading draft',
    noSavedDraft: 'No saved draft yet; the HTML editor starts with this exercise’s unsolved starter.',
    previewEmpty: 'Run the preview to see your HTML, CSS, and JavaScript result.',
    previewUpdated: 'Preview updated. Check the task requirements separately.',
    previewStale: 'The code changed after the last run; run the preview again to refresh it.',
    previewErrorTitle: 'JavaScript runtime error',
    previewFailed: 'JavaScript did not finish running. The visible result belongs to this run but may be incomplete; review the diagnostics below.',
    previewWithIssues: (count) => `The current code ran, but ${count} issue${count === 1 ? '' : 's'} were detected; the result may be partial. Review the diagnostics.`,
    previewLabels: { empty: '○ —', running: '◌ RUNNING', updated: '● UPDATED', stale: '● EDITED', failed: '● RUN FAILED', withIssues: '● WITH ISSUES' },
    diagnostics: {
      title: 'Code diagnostics',
      analyzing: 'Checking syntax…',
      noIssues: 'No syntax issue was detected in this file. Check the exercise requirements separately; this is not a complete error checker.',
      count: (count) => `${count} issue${count === 1 ? '' : 's'} detected. Select a diagnostic to jump to its editor position.`,
      showMore: (count) => `Show ${count} more diagnostics`,
      location: (line, column) => `Line ${line}, column ${column}`,
      locationUnknown: 'Location unavailable',
      syntax: 'Syntax',
      structure: 'HTML structure',
      value: 'CSS value',
      property: 'CSS property',
      runtime: 'Runtime',
      htmlMissingClose: (tag) => `The <${tag}> tag is not closed.`,
      htmlMissingBeforeClose: (tag, closing) => `Close <${tag}> before </${closing}>.`,
      htmlUnexpectedClose: (tag) => `There is no open <${tag}> tag to close here.`,
      htmlVoidClosing: (tag) => `<${tag}> is a void element and does not need a closing tag.`,
      htmlMalformedTag: 'This HTML tag looks incomplete or malformed.',
      htmlUnclosedComment: 'This HTML comment is not closed.',
      htmlCloseSuggestion: (tag) => `Add </${tag}> after the content inside this element.`,
      htmlUnexpectedSuggestion: (tag) => `Check the tag name or add its matching opening <${tag}> tag.`,
      htmlVoidSuggestion: (tag) => `Remove </${tag}>; the opening <${tag}> is enough.`,
      htmlTagSuggestion: 'Write the tag name, close it with >, and close any quoted attributes.',
      htmlCommentSuggestion: 'Close the comment with -->.',
      cssSyntax: 'This part of the CSS could not be parsed.',
      cssSyntaxSuggestion: 'Check the colon, braces { }, and the order of the property and value.',
      cssUnknownProperty: (property) => `“${property}” is not a recognized CSS property.`,
      cssPropertySuggestion: 'Check the property spelling, or start it with -- if it is a custom property.',
      cssInvalidValue: (property, value) => `“${value}” is not recognized or is invalid for “${property}”.`,
      cssMissingValue: (property) => `The “${property}” property needs a value after the colon.`,
      cssValueSuggestion: 'Check the property spelling and whether the value is valid for it, then run the preview again.',
      jsSyntax: 'This part of the JavaScript could not be parsed.',
      jsExpectedValue: 'An = sign is not followed by a value.',
      jsExpectedExpression: 'The expression or value inside these parentheses looks incomplete.',
      jsSyntaxSuggestion: 'Check brackets, quotes, commas, and the expression near this position.',
      runtimeMessage: (message) => `JavaScript stopped with a runtime error: ${message}`,
      runtimeSuggestion: 'Check the variable name, value type, or function call. Your code was not changed automatically.',
    },
    checkTask: 'Check task requirements',
    checksTitle: 'Task checklist',
    checkPassed: 'Complete',
    checkPending: 'Needs work',
    allChecksPassed: 'This exercise’s requirements are met. Lesson completion and quiz results are unchanged.',
    someChecksPending: 'Review the incomplete items, update your HTML, and check the task again.',
    sandboxNote: 'The preview runs in an iframe sandbox isolated from VANTA. Network access and external resources are restricted where possible; this is educational browser isolation, not an absolute security guarantee.',
    returnToLesson: 'Back to lesson',
    continueToQuiz: 'Continue to quiz',
    editorHelp: 'Use Tab to move between HTML, CSS, and JavaScript. Editors always read left to right.',
    previewFrameTitle: 'Preview of this exercise inside an isolated frame',
    exercises: {
      'html-introduction': {
        task: 'Create a main heading that says “Hello, Developer!” and a paragraph that says “Welcome to VANTA.” Start with <h1> and <p>.',
        expected: 'Read a heading and paragraph as two HTML elements, and keep running separate from checking the task.',
        checks: {
          heading: { label: 'An h1 containing “Hello” and “Developer”', passed: 'The required main heading was found.', missing: 'Add an h1 whose text includes Hello and Developer.' },
          paragraph: { label: 'A p welcoming the learner to VANTA', passed: 'The welcome paragraph was found.', missing: 'Add a p containing Welcome and VANTA.' },
        },
      },
      'html-headings-paragraphs': {
        task: 'Organize a topic of your choice with a main heading, a subheading, and a paragraph explaining the idea.',
        expected: 'Use h1 for the main topic, h2 for a section beneath it, and p for the explanation.',
        checks: {
          heading: { label: 'A non-empty main h1', passed: 'A clear main heading is present.', missing: 'Add an h1 with text that describes the page.' },
          subheading: { label: 'A subheading in h2', passed: 'A subheading is present.', missing: 'Add a non-empty h2 beneath the main heading.' },
          paragraph: { label: 'A p paragraph with an explanation', passed: 'Text is present inside a paragraph.', missing: 'Add a p with a short sentence.' },
        },
      },
      'html-links-navigation': {
        task: 'Create a link to a useful destination and write link text that tells visitors what it opens.',
        expected: 'Use an a element with a non-empty href and descriptive text rather than “click here”.',
        checks: {
          'link-href': { label: 'An a element with a valid, non-empty href', passed: 'The link has a destination.', missing: 'Add an href to an a element; avoid # and javascript:.' },
          'link-text': { label: 'Clear, readable link text', passed: 'The link text describes its destination.', missing: 'Write text that describes the destination; avoid generic labels such as “click here”.' },
        },
      },
      'html-images-attributes': {
        task: 'Add an image with a src and alternative text in alt that describes what the image shows.',
        expected: 'Understand that src identifies the image resource while alt describes it to people who cannot see it.',
        checks: {
          'image-src': { label: 'An img element with src', passed: 'The image has a source.', missing: 'Add a non-empty src to an img element.' },
          'image-alt': { label: 'A descriptive alt value', passed: 'A useful alternative description is present.', missing: 'Write a short description in alt, not a generic word or placeholder such as “image” or “xxxx”.' },
        },
      },
      'html-first-page': {
        task: 'Complete the document structure: a DOCTYPE, then a head containing a title, then a body for the page content.',
        expected: 'Distinguish page metadata inside head from visible content inside body.',
        checks: {
          doctype: { label: 'DOCTYPE at the start of the document', passed: 'The file starts with the HTML5 doctype.', missing: 'Begin the file with <!doctype html>.' },
          head: { label: 'A closed head element', passed: 'A complete head section is present.', missing: 'Add <head> and close it with </head>.' },
          title: { label: 'A non-empty title inside head', passed: 'The document has a title in its head.', missing: 'Add a non-empty title element inside head.' },
          body: { label: 'A closed body element', passed: 'A body section is present for page content.', missing: 'Add <body> and close it with </body>.' },
        },
      },
    },
  },
};
