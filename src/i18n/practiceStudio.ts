import type { HtmlLessonId } from '../content/learningSystem';
import type { PracticeSeverity } from '../content/practiceTypes';
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
    format: string;
    requirement: string;
    errorLabel: string;
    warningLabel: string;
    hintLabel: string;
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
    cssPropertySuggestion: (suggestion: string | null) => string;
    cssInvalidValue: (property: string, value: string) => string;
    cssMissingValue: (property: string) => string;
    cssValueSuggestion: (suggestion: string | null) => string;
    cssMissingSemicolon: string;
    cssSemicolonSuggestion: string;
    cssMissingColon: string;
    cssMissingColonSuggestion: string;
    cssUnmatchedBrace: string;
    cssBraceSuggestion: string;
    cssMalformedSelector: string;
    cssSelectorSuggestion: string;
    cssMalformedDeclaration: string;
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
  requirementProgress: (completed: number, total: number) => string;
  successTitle: string;
  successBody: string;
  someChecksPending: string;
  partialProgress: (completed: number, total: number, remaining: number, nextLabel: string) => string;
  validationFeedback: {
    passed: (label: string) => string;
    missing: (label: string) => string;
    syntax: (label: string) => string;
    wrongStructure: (label: string) => string;
    wrongSelector: (label: string) => string;
    wrongProperty: (label: string) => string;
    unknownProperty: (property: string, suggestion: string | null) => string;
    wrongValue: (label: string) => string;
    missingSemicolon: (label: string) => string;
    wrongBehavior: (label: string) => string;
  };
  severityLabels: Record<PracticeSeverity, string>;
  sandboxNote: string;
  returnToLesson: string;
  continueToQuiz: string;
  editorHelp: string;
  previewFrameTitle: string;
  exercises: Record<HtmlLessonId, {
    task: string;
    expected: string;
    checks: Partial<Record<PracticeCheckId, { label: string; passed: string; missing: string; failed?: string; concept?: string }>>;
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
    noSavedDraft: 'لا توجد مسودة محفوظة بعد؛ يبدأ المحرر بكود بداية غير محلول لهذا التمرين.',
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
      format: 'تنسيق CSS',
      requirement: 'متطلب التمرين',
      errorLabel: 'خطأ',
      warningLabel: 'تنبيه',
      hintLabel: 'اقتراح',
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
      cssPropertySuggestion: (suggestion) => suggestion ? `هل تقصد “${suggestion}”؟` : 'تحقق من تهجئة اسم الخاصية، أو أضف -- في بدايتها إذا كانت خاصية مخصصة.',
      cssInvalidValue: (property, value) => `القيمة “${value}” غير معروفة أو غير صالحة للخاصية “${property}”.`,
      cssMissingValue: (property) => `الخاصية “${property}” تحتاج إلى قيمة بعد النقطتين.`,
      cssValueSuggestion: (suggestion) => suggestion ? `هل تقصد القيمة “${suggestion}”؟` : 'تحقق من تهجئة الخاصية ومن أن القيمة مناسبة لها، ثم أعد تشغيل المعاينة.',
      cssMissingSemicolon: 'تنقص الفاصلة المنقوطة في نهاية التصريح المطلوب.',
      cssSemicolonSuggestion: 'أضف ; بعد القيمة قبل إغلاق القاعدة. لم نعدّل الكود تلقائيًا.',
      cssMissingColon: 'يبدو أن النقطتين : مفقودتان بين خاصية CSS وقيمتها.',
      cssMissingColonSuggestion: 'اكتب اسم الخاصية ثم : ثم قيمتها.',
      cssUnmatchedBrace: 'يوجد قوس معقوف { أو } غير مطابق في قاعدة CSS.',
      cssBraceSuggestion: 'وازن أقواس القاعدة، وتأكد أن كل { لها } مقابلة.',
      cssMalformedSelector: 'تعذّر قراءة محدد CSS قبل القوس الافتتاحي.',
      cssSelectorSuggestion: 'راجع اسم العنصر أو النقطة قبل اسم الفئة، ثم تحقق من الأقواس والفواصل.',
      cssMalformedDeclaration: 'تعذّر قراءة تصريح CSS داخل هذه القاعدة.',
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
    requirementProgress: (completed, total) => `تم التحقق من ${completed} من ${total} متطلبات`,
    successTitle: 'أحسنت، اكتمل التمرين',
    successBody: 'اجتزت كل متطلبات الكود. الخطوة التالية هي اختبار الدرس؛ لا يُسجَّل إكمال الدرس حتى تنهيه.',
    someChecksPending: 'راجع المتطلبات غير المكتملة في اللغة الحالية ثم افحص المهمة مجددًا.',
    partialProgress: (completed, total, remaining, nextLabel) => `ممتاز، تحقق ${completed} من ${total} متطلبات. ما زال ${remaining}؛ راجع: «${nextLabel}».`,
    validationFeedback: {
      passed: (label) => `استوفيت هذا المتطلب: «${label}».`,
      missing: (label) => `لم يظهر هذا المتطلب بعد؛ راجع المطلوب: «${label}».`,
      syntax: (label) => `تعذّرت قراءة الجزء المرتبط بـ«${label}». أصلح الصياغة في الموضع المحدد ثم أعد الفحص.`,
      wrongStructure: (label) => `المحتوى موجود، لكنه داخل عنصر أو بنية مختلفة. راجع موضع «${label}».`,
      wrongSelector: (label) => `التنسيق موجود لكنه يستهدف محددًا مختلفًا. راجع العنصر المقصود في «${label}».`,
      wrongProperty: (label) => `وجدنا تصريحًا قريبًا، لكن اسم الخاصية لا يطابق المطلوب في «${label}».`,
      unknownProperty: (property, suggestion) => `خاصية CSS “${property}” غير معروفة.${suggestion ? ` هل تقصد “${suggestion}”؟` : ' راجع تهجئة اسم الخاصية.'}`,
      wrongValue: (label) => `الخاصية أو البنية موجودة، لكن قيمتها لا تحقق المطلوب في «${label}». راجع وصف المهمة.`,
      missingSemicolon: (label) => `أضف الفاصلة المنقوطة (;) إلى نهاية التصريح الخاص بـ«${label}»؛ هذا التمرين يشترطها رغم أن CSS يسمح بحذفها من آخر تصريح في القاعدة.`,
      wrongBehavior: (label) => `البنية موجودة، لكن قيمتها أو سلوكها لا يحقق «${label}». راجع المفهوم ثم حاول مجددًا.`,
    },
    severityLabels: { error: 'خطأ', warning: 'تنبيه', hint: 'اقتراح' },
    sandboxNote: 'المعاينة تعمل داخل iframe معزول عن تطبيق Mabda. الاتصالات والموارد الخارجية محظورة قدر الإمكان؛ هذا عزل متصفح تعليمي وليس ضمانًا أمنيًا مطلقًا.',
    returnToLesson: 'العودة إلى الشرح',
    continueToQuiz: 'متابعة إلى الاختبار',
    editorHelp: 'استخدم Tab للتنقل بين HTML وCSS وJavaScript. المحررات دائمًا من اليسار إلى اليمين.',
    previewFrameTitle: 'معاينة شيفرة هذا التمرين داخل إطار معزول',
    exercises: {
      'html-introduction': {
        task: 'اكتب عنوانًا رئيسيًا وفقرة ترحيب في عنصرَي HTML مناسبين، بهذا الترتيب.',
        expected: 'اقرأ العنوان والفقرة كعنصرين HTML، وشغّل المعاينة بمعزل عن فحص المهمة.',
        checks: {
          heading: { label: 'عنوان رئيسي h1', passed: 'يوجد عنصر h1 يتضمن Hello وDeveloper.', missing: 'أضف عنصر <h1> يحتوي كلمتي Hello وDeveloper.' },
          paragraph: { label: 'فقرة p', passed: 'يوجد عنصر p يتضمن Welcome وMabda.', missing: 'أضف عنصر <p> يحتوي كلمتي Welcome وMabda.' },
          'paragraph-order': { label: 'ترتيب العنوان والفقرة', passed: 'تأتي الفقرة بعد عنوان h1.', missing: 'ضع عنصر <p> بعد عنصر <h1> في المصدر.' },
        },
      },
      'html-headings-paragraphs': {
        task: 'أضف عنوان h1 غير فارغ، ثم عنوان h2 غير فارغ بعده، ثم فقرة p غير فارغة بعد العناوين.',
        expected: 'يُفحص وجود النص داخل العناصر وترتيب h1 ثم h2 ثم p، لا جودة المعنى.',
        checks: {
          heading: { label: 'عنوان h1 رئيسي غير فارغ', passed: 'يوجد عنصر h1 يحتوي نصًا.', missing: 'أضف عنصر <h1> يحتوي نصًا؛ كتابة النص خارج الوسم لا تكفي.' },
          subheading: { label: 'عنوان h2 لقسم فرعي', passed: 'يوجد عنوان فرعي.', missing: 'أضف عنصر <h2> غير فارغ بعد <h1> وبالترتيب المطلوب.' },
          paragraph: { label: 'فقرة p تحتوي شرحًا', passed: 'يوجد نص داخل فقرة.', missing: 'أضف عنصر <p> بجملة قصيرة بعد العناوين؛ النص العادي وحده لا يحقق المتطلب.' },
        },
      },
      'html-links-navigation': {
        task: 'أنشئ عنصر رابط a، وأضف له وجهة ونصًا غير عام.',
        expected: 'تُعرض ثلاثة شروط: وجود رابط، ووجهة href قابلة للاستخدام، ونص من 3 أحرف على الأقل غير عام. يجب أن يجتمع href والنص على الرابط نفسه.',
        checks: {
          'link-element': { label: 'وجود عنصر a', passed: 'يوجد عنصر رابط a.', missing: 'أضف عنصر <a>.' },
          'link-href': { label: 'وجهة href قابلة للاستخدام', passed: 'يوجد href غير فارغ وليس # أو javascript: داخل رابط.', missing: 'أضف إلى عنصر <a> قيمة href غير فارغة وليست # أو javascript:.' },
          'link-text': { label: 'نص رابط قابل للقراءة', passed: 'الرابط ذو الوجهة القابلة للاستخدام يحتوي نصًا من 3 أحرف على الأقل وليس عبارة عامة معروفة.', missing: 'أضف إلى الرابط ذي href صالح نصًا من 3 أحرف على الأقل، وتجنب عبارات مثل «اضغط هنا» أو «رابط».' },
        },
      },
      'html-images-attributes': {
        task: 'أضف عنصر صورة بمصدر صالح ونص بديل وصفي وفق معيار الطول والكلمات العامة.',
        expected: 'يُفحص src أولًا، ثم يجب أن يملك عنصر الصورة نفسه alt من 4 أحرف على الأقل، غير عام وغير مكرر.',
        checks: {
          'image-src': { label: 'قيمة src قابلة للاستخدام', passed: 'يوجد img مع src غير فارغ وليس # أو javascript:.', missing: 'أضف إلى عنصر <img> قيمة src غير فارغة وليست # أو javascript:.' },
          'image-alt': { label: 'قيمة alt قابلة للاستخدام', passed: 'صورة ذات src صالح تحتوي alt من 4 أحرف على الأقل، غير عام وغير مكرر.', missing: 'في عنصر <img> ذي src صالح، أضف وصف alt بطول 4 أحرف على الأقل، وتجنب image أو placeholder أو تكرار حرف واحد.' },
        },
      },
      'html-first-page': {
        task: 'أكمل هيكل الوثيقة: DOCTYPE، ثم head يتضمن title، ثم body لمحتوى الصفحة.',
        expected: 'تمييز معلومات الصفحة داخل head عن المحتوى الظاهر داخل body.',
        checks: {
          doctype: { label: 'DOCTYPE صريح في بداية الوثيقة', passed: 'يبدأ الملف بإعلان HTML5 صريح.', missing: 'ابدأ المصدر بـ <!doctype html>؛ عناصر HTML التي يضيفها المتصفح تلقائيًا لا تُحسب.' },
          head: { label: 'عنصر head صريح ومغلق', passed: 'يوجد قسم head كامل في المصدر.', missing: 'أضف <head> واغلقه بـ </head> بعد DOCTYPE.' },
          title: { label: 'عنوان title غير فارغ داخل head', passed: 'للوثيقة عنوان صريح في head.', missing: 'أضف <title> يحتوي نصًا داخل <head>؛ لا يكفي وضعه خارج البنية.' },
          body: { label: 'عنصر body صريح ومغلق بعد head', passed: 'يوجد قسم body للمحتوى بعد head.', missing: 'أضف <body> واغلقه بـ </body> بعد <head>.' },
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
    noSavedDraft: 'No saved draft yet; the editor starts with this exercise’s unsolved starter.',
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
      format: 'CSS formatting',
      requirement: 'Exercise requirement',
      errorLabel: 'Error',
      warningLabel: 'Warning',
      hintLabel: 'Hint',
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
      cssPropertySuggestion: (suggestion) => suggestion ? `Did you mean “${suggestion}”?` : 'Check the property spelling, or start it with -- if it is a custom property.',
      cssInvalidValue: (property, value) => `“${value}” is not recognized or is invalid for “${property}”.`,
      cssMissingValue: (property) => `The “${property}” property needs a value after the colon.`,
      cssValueSuggestion: (suggestion) => suggestion ? `Did you mean “${suggestion}”?` : 'Check the property spelling and whether the value is valid for it, then run the preview again.',
      cssMissingSemicolon: 'This required CSS declaration is missing its ending semicolon.',
      cssSemicolonSuggestion: 'Add ; after the value and before the closing brace. Your code was not changed automatically.',
      cssMissingColon: 'A colon : appears to be missing between this CSS property and its value.',
      cssMissingColonSuggestion: 'Write the property name, then :, then its value.',
      cssUnmatchedBrace: 'A CSS rule has an unmatched opening { or closing } brace.',
      cssBraceSuggestion: 'Balance the rule braces so each { has a matching }.',
      cssMalformedSelector: 'The CSS selector before this opening brace could not be read.',
      cssSelectorSuggestion: 'Check the element name or the dot before a class name, then review brackets and commas.',
      cssMalformedDeclaration: 'A CSS declaration inside this rule could not be read.',
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
    requirementProgress: (completed, total) => `${completed} of ${total} requirements verified`,
    successTitle: 'Well done — exercise complete',
    successBody: 'All code requirements passed. Continue to the lesson quiz; completing the exercise alone does not mark the lesson complete.',
    someChecksPending: 'Review the incomplete requirements in the active language, then check the task again.',
    partialProgress: (completed, total, remaining, nextLabel) => `Nice work—${completed} of ${total} requirements are met. ${remaining} left to work on: “${nextLabel}”.`,
    validationFeedback: {
      passed: (label) => `This requirement is met: “${label}”.`,
      missing: (label) => `This requirement is not present yet. Review the task: “${label}”.`,
      syntax: (label) => `The code for “${label}” could not be read. Fix the syntax at the marked location, then check again.`,
      wrongStructure: (label) => `The content is present, but inside a different element or structure. Review where “${label}” belongs.`,
      wrongSelector: (label) => `The styling exists, but targets a different selector. Review the target in “${label}”.`,
      wrongProperty: (label) => `A related declaration was found, but its property name does not match “${label}”.`,
      unknownProperty: (property, suggestion) => `“${property}” is not a known CSS property.${suggestion ? ` Did you mean “${suggestion}”?` : ' Check the property spelling.'}`,
      wrongValue: (label) => `The property or structure exists, but its value does not meet “${label}”. Re-read the task description.`,
      missingSemicolon: (label) => `Add a semicolon (;) to the end of “${label}”. This exercise requires it, although CSS permits omitting it from the final declaration in a rule.`,
      wrongBehavior: (label) => `The structure is present, but its value or behavior does not meet “${label}”. Review the concept and try again.`,
    },
    severityLabels: { error: 'Error', warning: 'Warning', hint: 'Hint' },
    sandboxNote: 'The preview runs in an iframe sandbox isolated from Mabda. Network access and external resources are restricted where possible; this is educational browser isolation, not an absolute security guarantee.',
    returnToLesson: 'Back to lesson',
    continueToQuiz: 'Continue to quiz',
    editorHelp: 'Use Tab to move between HTML, CSS, and JavaScript. Editors always read left to right.',
    previewFrameTitle: 'Preview of this exercise inside an isolated frame',
    exercises: {
      'html-introduction': {
        task: 'Write a main heading and a welcome paragraph using suitable HTML elements, in that order.',
        expected: 'Read a heading and paragraph as two HTML elements, and keep running separate from checking the task.',
        checks: {
          heading: { label: 'A main h1 heading', passed: 'An h1 containing Hello and Developer is present.', missing: 'Add an <h1> containing both Hello and Developer.' },
          paragraph: { label: 'A p paragraph', passed: 'A p containing Welcome and Mabda is present.', missing: 'Add a <p> containing both Welcome and Mabda.' },
          'paragraph-order': { label: 'Heading then paragraph order', passed: 'The paragraph follows the h1.', missing: 'Place the <p> element after the <h1> in the source.' },
        },
      },
      'html-headings-paragraphs': {
        task: 'Add a non-empty h1, then a non-empty h2 after it, then a non-empty p after the headings.',
        expected: 'The check measures text inside the elements and the h1 → h2 → p order, not the meaning of the text.',
        checks: {
          heading: { label: 'A non-empty main h1', passed: 'An h1 element contains text.', missing: 'Add an <h1> containing text; text outside the tag is not enough.' },
          subheading: { label: 'A subheading in h2', passed: 'A subheading is present.', missing: 'Add a non-empty <h2> after the <h1> in the required order.' },
          paragraph: { label: 'A p paragraph with an explanation', passed: 'Text is present inside a paragraph.', missing: 'Add a <p> with a short sentence after the headings; plain text alone is not enough.' },
        },
      },
      'html-links-navigation': {
        task: 'Create an a link element, add a usable destination, and include non-generic link text.',
        expected: 'Three checks are shown: an anchor, a usable href, and non-generic text of at least 3 characters. The href and text must belong to the same anchor.',
        checks: {
          'link-element': { label: 'An a element exists', passed: 'An anchor element is present.', missing: 'Add an <a> element.' },
          'link-href': { label: 'A usable href destination', passed: 'An anchor has a non-empty href other than # or javascript:.', missing: 'Give an <a> a non-empty href that is not # or javascript:.' },
          'link-text': { label: 'Readable link text', passed: 'Anchor text has at least 3 characters and is not a recognized generic phrase.', missing: 'Add at least 3 characters of text inside an <a>; avoid phrases such as “click here” or “link”.' },
        },
      },
      'html-images-attributes': {
        task: 'Add an image with a usable source and alternative text that meets the measurable length and generic-value checks.',
        expected: 'The source is checked first; the same image must then have alt text of at least 4 characters that is not generic or repeated.',
        checks: {
          'image-src': { label: 'A usable src value', passed: 'An img has a non-empty src other than # or javascript:.', missing: 'Give an <img> a non-empty src that is not # or javascript:.' },
          'image-alt': { label: 'A usable alt value', passed: 'alt has at least 4 characters and is not generic or repeated.', missing: 'Give the <img> an alt description with at least 4 characters; avoid image, placeholder, or a repeated single character.' },
        },
      },
      'html-first-page': {
        task: 'Complete the document structure: a DOCTYPE, then a head containing a title, then a body for the page content.',
        expected: 'Distinguish page metadata inside head from visible content inside body.',
        checks: {
          doctype: { label: 'An explicit DOCTYPE at the start of the document', passed: 'The file starts with an explicit HTML5 doctype.', missing: 'Begin the source with <!doctype html>; browser-inserted HTML elements do not count.' },
          head: { label: 'An explicit closed head element', passed: 'A complete head section is present in the source.', missing: 'Add <head> and close it with </head> after the DOCTYPE.' },
          title: { label: 'A non-empty title inside head', passed: 'The document has an explicit title in its head.', missing: 'Add <title> with text inside <head>; placing it outside the structure is not enough.' },
          body: { label: 'An explicit body after head', passed: 'A body section is present after head for page content.', missing: 'Add <body> and close it with </body> after <head>.' },
        },
      },
    },
  },
};
