import type { FoundationLessonId, FoundationStageId, LearningPathId } from '../content/learningSystem';
import type { Locale } from './messages';

type CodeLineCopy = { code: string; note: string };
type LearningStepCopy = {
  title: string;
  body: string;
  code?: CodeLineCopy[];
  note?: string;
};
type LearningChoice = { id: string; label: string; kind: 'text' | 'code' };
type LearningQuestion = {
  id: string;
  prompt: string;
  choices: LearningChoice[];
  correctChoiceId: string;
  correctFeedback: string;
  incorrectFeedback: string;
  reviewTopic: string;
};
export type LearningLessonCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  objectiveLabel: string;
  objectiveText: string;
  steps: LearningStepCopy[];
  questions: LearningQuestion[];
  outcomeLabel: string;
  outcomeText: string;
};
export type PathLessonSummary = { id: FoundationLessonId; title: string; summary: string; stageId?: FoundationStageId };
export type LearningPathStageCopy = {
  id: FoundationStageId;
  title: string;
  purpose: string;
  prerequisites: string;
  skills: string[];
};
type LearningPathCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  summary: string;
  forWhomLabel: string;
  forWhom: string;
  outcomesLabel: string;
  outcomes: string[];
  conceptsLabel: string;
  concepts: string[];
  sequenceLabel: string;
  lessonSummaries?: PathLessonSummary[];
  stages?: LearningPathStageCopy[];
  outline: string[];
  availableNote: string;
  plannedNote: string;
};

export type LearningSystemCopy = {
  catalog: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    description: string;
  };
  paths: Record<LearningPathId, LearningPathCopy>;
  ui: {
    allPaths: string;
    home: string;
    backToPath: string;
    available: string;
    planned: string;
    future: string;
    openPath: string;
    viewOutline: string;
    notAvailableYet: string;
    pathProgress: string;
    pathLevelLabel: string;
    beginnerLevel: string;
    foundationalLevel: string;
    pathNotStarted: string;
    pathGettingStarted: string;
    pathInProgress: string;
    pathCompleted: string;
    courseLevelLabel: string;
    lessonCountLabel: string;
    plannedLessonsUnavailable: string;
    sequenceEyebrow: string;
    stagePurposeLabel: string;
    stagePrerequisitesLabel: string;
    stageSkillsLabel: string;
    finalAssessmentTitle: string;
    finalAssessmentBody: string;
    finalAssessmentAction: string;
    assessmentNotSaved: string;
    projectsTitle: string;
    projectsBody: string;
    projectsAction: string;
    projectsPageTitle: string;
    projectsPageIntro: string;
    projectPrerequisitesLabel: string;
    projectMilestonesLabel: string;
    projectRequirementsLabel: string;
    projectChecklistLabel: string;
    projectExpectedResultLabel: string;
    projectOptionalImprovementsLabel: string;
    projectStarterFilesLabel: string;
    projectCopyCode: string;
    projectCodeCopied: string;
    projectCopyFailed: string;
    projectNoSavedProgress: string;
    assessmentStart: string;
    assessmentFinish: string;
    assessmentScoreNote: string;
    assessmentBackToPath: string;
    assessmentRetry: string;
    assessmentChoosePath: string;
    completedStatus: string;
    nextStatus: string;
    availableStatus: string;
    continueLearning: string;
    startPath: string;
    reviewPreviousLesson: string;
    browseLessons: string;
    openLesson: string;
    stepLabel: string;
    learnLabel: string;
    practiceLabel: string;
    stepProgress: string;
    lessonProgressNote: string;
    codeExampleLabel: string;
    codeReadOnly: string;
    previousStep: string;
    nextStep: string;
    startQuiz: string;
    quizTitle: string;
    quizIntro: string;
    questionProgress: string;
    quizProgressNote: string;
    correctTitle: string;
    incorrectTitle: string;
    tryAgain: string;
    nextQuestion: string;
    seeResult: string;
    resultTitle: string;
    scoreLabel: string;
    perfectResult: string;
    goodResult: string;
    keepPracticingResult: string;
    resultNote: string;
    reviewTitle: string;
    noMissedQuestions: string;
    outcomeLabel: string;
    retryQuiz: string;
    previousLesson: string;
    nextLesson: string;
    finalLesson: string;
    returnToPath: string;
    notFoundTitle: string;
    notFoundBody: string;
    backHome: string;
  };
};

export const learningSystemMessages: Record<Locale, LearningSystemCopy> = {
  ar: {
    catalog: {
      metaTitle: 'مسارات التعلّم — Mabda',
      metaDescription: 'استكشف مسارات Mabda المتاحة للمبتدئين في HTML وCSS وJavaScript.',
      eyebrow: 'مسارات Mabda',
      title: 'طريق واضح، خطوة بعد خطوة.',
      description: 'تعلّم أساسيات الويب عبر مسارات HTML وCSS وJavaScript المتاحة، مع ممارسة قصيرة داخل كل درس.',
    },
    paths: {
      'html-fundamentals': {
        metaTitle: 'مسار أساسيات HTML — Mabda',
        metaDescription: 'اثنا عشر درسًا متدرجًا لتعلّم بنية HTML الدلالية والمحتوى والنماذج والصفحات العملية.',
        eyebrow: 'المسار 01 · متاح الآن',
        title: 'أساسيات HTML',
        summary: 'انتقل من الوسوم الأولى إلى وثيقة دلالية، ومحتوى منظم، ونماذج قابلة للاستخدام، وصفحة متعددة الأقسام.',
        forWhomLabel: 'لمن هذا المسار؟',
        forWhom: 'للمبتدئ تمامًا؛ لا تحتاج إلى خبرة سابقة أو إعداد أدوات.',
        outcomesLabel: 'بعد المسار ستستطيع',
        outcomes: [
          'قراءة عناصر HTML وفهم دورها.',
          'تنظيم النص بالعناوين والفقرات.',
          'إنشاء روابط وصور بسمات واضحة ونص بديل مفيد.',
          'بناء وثيقة منظمة بعناصر دلالية وبيانات وصفية صحيحة.',
          'تنظيم القوائم والجداول وإنشاء نماذج أوضح وأسهل وصولًا.',
          'تطبيق أساسيات التحقق وإضافة صور ووسائط مناسبة.',
        ],
        conceptsLabel: 'المفاهيم',
        concepts: ['العناصر والوسوم', 'بنية الوثيقة وmetadata', 'العناصر الدلالية', 'القوائم والجداول', 'النماذج وإمكانية الوصول', 'الصور والوسائط'],
        sequenceLabel: 'تسلسل الدروس',
        stages: [
          { id: 'html-markup-foundations', title: 'أساسيات الترميز والتنقّل', purpose: 'تعلّم العناصر النصية والروابط وكيف تصف HTML محتوى الصفحة.', prerequisites: 'لا توجد متطلبات سابقة.', skills: ['قراءة الوسوم والعناصر', 'بناء تسلسل للعناوين', 'إنشاء روابط واضحة'] },
          { id: 'html-document-structure', title: 'الوثيقة والبنية الدلالية', purpose: 'اجمع المحتوى في وثيقة كاملة وأضف بياناتها ومناطقها الدلالية.', prerequisites: 'إكمال أساسيات العناصر والروابط.', skills: ['كتابة head وmetadata', 'اختيار header وnav وmain وfooter', 'استخدام alt للصور'] },
          { id: 'html-information-and-forms', title: 'تنظيم المعلومات والنماذج', purpose: 'اختر بنية مناسبة للقوائم والجداول، واجمع مدخلات المستخدم بوضوح.', prerequisites: 'فهم العناصر والسمات وبنية الوثيقة.', skills: ['تمثيل القوائم والبيانات الجدولية', 'ربط label بحقل إدخال', 'استخدام تحقق المتصفح الأساسي'] },
          { id: 'html-applied-pages', title: 'صفحات تطبيقية ووسائط', purpose: 'طبّق العناصر السابقة في صفحة متعددة الأقسام وتعرّف إلى تضمين الوسائط.', prerequisites: 'معرفة العناوين والعناصر الدلالية والروابط والصور.', skills: ['اختيار وسوم media المناسبة', 'تنظيم صفحة متعددة الأقسام', 'مراجعة المحتوى وإمكانية الوصول'] },
        ],
        lessonSummaries: [
          { id: 'html-introduction', title: 'مقدمة إلى HTML', summary: 'الوسوم والعناصر وقراءة مثال أول.' },
          { id: 'html-headings-paragraphs', title: 'العناوين والفقرات', summary: 'تنظيم المحتوى وبناء تسلسل مفهوم للعناوين.' },
          { id: 'html-links-navigation', title: 'الروابط والتنقّل', summary: 'إنشاء رابط وفهم الوجهة التي تحددها href.' },
          { id: 'html-images-attributes', title: 'الصور والسمات', summary: 'استخدام src وكتابة نص بديل دقيق في alt.' },
          { id: 'html-first-page', title: 'ابنِ أول صفحة HTML', summary: 'جمع المفاهيم داخل وثيقة HTML كاملة ومقروءة.' },
        ],
        outline: [],
        availableNote: 'تتضمن الدروس محررًا ومعاينة متصفح معزولة وتمرينًا مستقلًا. يمكن للمتعلم المسجّل حفظ المسودات؛ تشغيل المعاينة أو فحص المهمة لا يُكمل الدرس أو الاختبار.',
        plannedNote: '',
      },
      'css-fundamentals': {
        metaTitle: 'مسار أساسيات CSS — Mabda',
        metaDescription: 'تسعة عشر درسًا متدرجًا للمحددات والتخطيط المتجاوب والتنسيق العملي وتصحيح التخطيطات.',
        eyebrow: 'المسار 02 · متاح الآن',
        title: 'أساسيات CSS',
        summary: 'ابدأ بالقواعد والوراثة ونموذج الصندوق، ثم ابنِ تخطيطات متجاوبة وأضف حالات التفاعل والحركة وحلولًا قابلة لإعادة الاستخدام.',
        forWhomLabel: 'لمن هذا المسار؟',
        forWhom: 'للمبتدئ الذي يعرف أساسيات HTML ويريد تحسين مظهر صفحات الويب.',
        outcomesLabel: 'بعد المسار ستستطيع',
        outcomes: ['اختيار العناصر وفهم التنافس بين القواعد والوراثة.', 'التحكم بالأبعاد والمسافات والظهور والتموضع.', 'إنشاء تخطيطات Flexbox وGrid متجاوبة.', 'إعادة استخدام القيم وتحسين المقروئية والحركة وتصحيح أخطاء التخطيط.'],
        conceptsLabel: 'المفاهيم',
        concepts: ['المحددات والوراثة', 'الوحدات والصندوق والتموضع', 'Flexbox وGrid', 'Media queries', 'العناصر الزائفة والمتغيرات', 'الخطوط والحركة وتصحيح التخطيط'],
        sequenceLabel: 'تسلسل الدروس',
        stages: [
          { id: 'css-cascade-and-rules', title: 'القواعد والتدرّج والوراثة', purpose: 'افهم كيف تختار العناصر وكيف تتنافس القواعد وما الذي قد يُورّث.', prerequisites: 'معرفة أساسية بعناصر HTML وكتابة قاعدة CSS.', skills: ['كتابة محددات دقيقة', 'تمييز الخاصية والقيمة', 'شرح أولوية المحددات والوراثة'] },
          { id: 'css-box-and-position', title: 'الصندوق والظهور والتموضع', purpose: 'تحكم بالأبعاد والمسافات ومشاركة العنصر في التخطيط وموضعه.', prerequisites: 'القدرة على اختيار عنصر بمحدد CSS.', skills: ['استخدام px و% وrem', 'التمييز بين display وvisibility', 'تحديد موضع عنصر وطبقته'] },
          { id: 'css-layout-systems', title: 'أنظمة التخطيط والاستجابة', purpose: 'رتّب العناصر في صفوف وأعمدة وأنشئ تخطيطات تتأقلم مع الشاشة.', prerequisites: 'فهم نموذج الصندوق والمسافات الأساسية.', skills: ['بناء Flexbox وGrid', 'اختيار نقاط توقف معقولة', 'اختبار تخطيط الصفحة على مقاسات مختلفة'] },
          { id: 'css-visual-systems', title: 'التفاصيل البصرية والتفاعل', purpose: 'أعد استخدام القيم وحسّن الخطوط والحالات والحركة دون إخفاء المحتوى المهم.', prerequisites: 'معرفة المحددات والخصائص والتخطيط الأساسي.', skills: ['استخدام pseudo selectors', 'تعريف CSS custom properties', 'إضافة انتقالات تراعي تقليل الحركة'] },
          { id: 'css-debug-and-build', title: 'تصحيح الأخطاء وبناء صفحة', purpose: 'استخدم الفحص المنظم والمعاينة لتحسين تخطيط كامل متجاوب.', prerequisites: 'إكمال أساسيات القواعد والتخطيط والحالات البصرية.', skills: ['تمييز خطأ الخاصية عن خطأ التخطيط', 'اختبار نقاط التوقف', 'مراجعة overflow والتباين'] },
        ],
        outline: [],
        availableNote: 'تضم الدروس محرر CSS ومعاينة معزولة وفحوصًا بنيوية لمتطلبات التمرين. بعض خصائص العرض تحتاج مراجعة بصرية؛ المدقق لا يحسب كل تأثيرات cascade أو يضمن جودة التصميم.',
        plannedNote: '',
      },
      'javascript-fundamentals': {
        metaTitle: 'مسار أساسيات JavaScript — Mabda',
        metaDescription: 'ثلاثة وعشرون درسًا متدرجًا لقيم JavaScript والبيانات والـDOM والنماذج والبرمجة غير المتزامنة.',
        eyebrow: 'المسار 03 · متاح الآن',
        title: 'أساسيات JavaScript',
        summary: 'ابدأ بالقيم والشروط والتكرار، ثم نظّم البيانات والدوال وتفاعل مع الصفحة، قبل التعامل مع التخزين والأخطاء والطلبات غير المتزامنة.',
        forWhomLabel: 'لمن هذا المسار؟',
        forWhom: 'للمبتدئ الذي تعرّف على بنية HTML وتنسيق CSS ويريد إضافة سلوك وتفاعل للصفحة.',
        outcomesLabel: 'بعد المسار ستستطيع',
        outcomes: ['استخدام المتغيرات والأنواع والمعاملات والتكرار.', 'كتابة دوال وإدارة النطاق والعمل على المصفوفات والكائنات.', 'تحديث DOM والتعامل مع النماذج والأحداث.', 'قراءة JSON والتخزين والأخطاء وواجهات Promise وFetch وmodules.'],
        conceptsLabel: 'المفاهيم',
        concepts: ['القيم والمقارنة الصارمة والحلقات', 'الدوال والنطاق والبيانات', 'طرق المصفوفة والنصوص والأرقام', 'DOM والأحداث والنماذج', 'JSON والتخزين ومعالجة الأخطاء', 'async وFetch وتنظيم modules'],
        sequenceLabel: 'تسلسل الدروس',
        stages: [
          { id: 'js-language-foundations', title: 'أساسيات اللغة والتحكم', purpose: 'تعلّم القيم والتعبيرات واتخاذ القرار والتكرار قبل بناء سلوك أكبر.', prerequisites: 'لا توجد خبرة سابقة في JavaScript مطلوبة.', skills: ['تعريف متغيرات وقراءة الأنواع', 'المقارنة والتحويل بحذر', 'كتابة شرط وحلقة بسيطة'] },
          { id: 'js-data-and-functions', title: 'البيانات والدوال', purpose: 'اجمع التعليمات في دوال واستخدم هياكل البيانات والطرق الشائعة.', prerequisites: 'فهم المتغيرات والشروط والحلقات الأساسية.', skills: ['فهم النطاق والقيم المعادة', 'قراءة كائن ومصفوفة', 'اختيار طرق النصوص والأرقام والمصفوفات'] },
          { id: 'js-browser-interaction', title: 'التفاعل مع المتصفح', purpose: 'حدد عناصر الصفحة واستجب للنقر وإرسال النماذج بطريقة أساسية.', prerequisites: 'فهم الدوال والمصفوفات ووجود عناصر HTML في الصفحة.', skills: ['إنشاء وتحديث عقد DOM', 'معالجة الأحداث', 'التحقق من مدخلات نموذج'] },
          { id: 'js-data-and-reliability', title: 'البيانات والموثوقية', purpose: 'حوّل البيانات إلى JSON، وافهم تخزين المتصفح وتعامل مع الأخطاء المتوقعة.', prerequisites: 'المعرفة بالكائنات والدوال والتفاعل مع الصفحة.', skills: ['استخدام JSON.parse/stringify', 'قراءة حدود localStorage', 'استخدام try/catch للأخطاء المناسبة'] },
          { id: 'js-async-and-organization', title: 'العمليات غير المتزامنة والتنظيم', purpose: 'افهم الوعود والانتظار وجلب البيانات، ونظّم الشيفرة إلى وحدات مفهومة.', prerequisites: 'إتقان الدوال والكائنات والتعامل مع الأخطاء.', skills: ['قراءة Promise وasync/await', 'فحص استجابة Fetch', 'تمييز import/export وتنظيم الملف'] },
        ],
        outline: [],
        availableNote: 'تضم الدروس محرر JavaScript ومعاينة معزولة وفحوصًا بنيوية. لا يثبت المدقق صحة كل السلوك؛ وميزات الشبكة والتخزين الدائم والوحدات لا تُشغّل كخدمات خارجية في مساحة الممارسة.',
        plannedNote: '',
      },
      'programming-fundamentals': {
        metaTitle: 'مبادئ البرمجة — اتجاه مستقبلي | Mabda',
        metaDescription: 'اتجاه مستقبلي في Mabda لتعلّم التفكير والمفاهيم المشتركة بين لغات البرمجة.',
        eyebrow: 'اتجاه مستقبلي',
        title: 'مبادئ البرمجة',
        summary: 'مسار مقترح لتعلّم المفاهيم المشتركة بين اللغات قبل التعمق في تقنية بعينها.',
        forWhomLabel: 'لمن هذا الاتجاه؟',
        forWhom: 'للمبتدئين الذين يريدون فهم منطق البرمجة قبل بناء مشاريع أكبر.',
        outcomesLabel: 'محاور مستقبلية',
        outcomes: ['تحويل فكرة إلى خطوات.', 'فهم المدخلات والمخرجات.', 'استخدام التكرار والاختيارات.', 'قراءة الأخطاء وتحسين الحل.'],
        conceptsLabel: 'موضوعات مقترحة',
        concepts: ['التفكير الخوارزمي', 'القيم والمتغيرات', 'التحكم في التدفق', 'الدوال', 'تصحيح الأخطاء'],
        sequenceLabel: 'محاور مستقبلية',
        outline: ['تقسيم المشكلة إلى خطوات صغيرة', 'تمثيل البيانات والقيم', 'ترتيب التعليمات والشروط', 'التكرار والدوال', 'قراءة الأخطاء والتحسين'],
        availableNote: '',
        plannedNote: 'اتجاه منتج مستقبلي؛ لا يوجد مسار أو درس قابل للفتح في هذه النسخة.',
      },
      'problem-solving': {
        metaTitle: 'حل المشكلات — اتجاه مستقبلي | Mabda',
        metaDescription: 'اتجاه مستقبلي في Mabda لتنمية مهارات التفكير وحل المشكلات.',
        eyebrow: 'اتجاه مستقبلي',
        title: 'حل المشكلات',
        summary: 'اتجاه مقترح لممارسة التفكير المنهجي: افهم المطلوب، جرّب فكرة، ثم راجع النتيجة.',
        forWhomLabel: 'لمن هذا الاتجاه؟',
        forWhom: 'للمتعلمين الذين يريدون تقوية التفكير المنطقي وتطبيق ما تعلموه في مواقف جديدة.',
        outcomesLabel: 'محاور مستقبلية',
        outcomes: ['تحديد المشكلة بدقة.', 'تقسيمها إلى حالات أبسط.', 'اختبار الحل على أمثلة.', 'تحسين الخطوات بعد المراجعة.'],
        conceptsLabel: 'موضوعات مقترحة',
        concepts: ['فهم المسألة', 'تقسيمها', 'كتابة خطوات الحل', 'اختبار الحالات', 'المراجعة والتحسين'],
        sequenceLabel: 'محاور مستقبلية',
        outline: ['استخراج المطلوب والمعطيات', 'تقسيم المشكلة إلى أجزاء', 'صياغة خطوات حل بسيطة', 'اختبار الحل بحالات متنوعة', 'مراجعة الفكرة وتحسينها'],
        availableNote: '',
        plannedNote: 'اتجاه منتج مستقبلي؛ التحديات والمسابقات وحفظ النتائج ليست مفعّلة.',
      },
    },
    ui: {
      allPaths: 'كل المسارات',
      home: 'الصفحة الرئيسية',
      backToPath: 'العودة إلى المسار',
      available: 'متاح الآن',
      planned: 'مخطط',
      future: 'اتجاه مستقبلي',
      openPath: 'افتح المسار',
      viewOutline: 'عرض التصوّر',
      notAvailableYet: 'لا توجد دروس متاحة في هذا المسار بعد.',
      pathProgress: 'تقدّم المسار',
      pathLevelLabel: 'المستوى',
      beginnerLevel: 'مبتدئ',
      foundationalLevel: 'أساسيات',
      pathNotStarted: 'لم يبدأ بعد',
      pathGettingStarted: 'بدأ التعلّم',
      pathInProgress: 'قيد التعلّم',
      pathCompleted: 'مكتمل',
      courseLevelLabel: 'مستوى المنهج',
      lessonCountLabel: '{count} دروس متاحة',
      plannedLessonsUnavailable: 'الدروس غير متاحة بعد؛ هذا المسار ما زال مخططًا.',
      sequenceEyebrow: 'تسلسل التعلّم',
      stagePurposeLabel: 'هدف المرحلة',
      stagePrerequisitesLabel: 'قبل البدء',
      stageSkillsLabel: 'المهارات التي ستتدرّب عليها',
      finalAssessmentTitle: 'تقييم ختامي للمسار',
      finalAssessmentBody: 'أسئلة مراجعة تقيس فهم المحاور الأساسية. يمكنك المحاولة والتعلّم من التوضيح؛ النتيجة مؤقتة.',
      finalAssessmentAction: 'ابدأ التقييم الختامي',
      assessmentNotSaved: 'هذا تقييم ذاتي قصير؛ إجاباته ونتيجته لا تُحفظ في الحساب ولا تمثل شهادة.',
      projectsTitle: 'مشاريع تطبيقية',
      projectsBody: 'حوّل ما تعلمته إلى أعمال صغيرة متدرجة. ملفات البداية إرشادية، والعمل يبقى في متصفحك فقط.',
      projectsAction: 'استكشف المشاريع',
      projectsPageTitle: 'مشاريع تقودك من الدرس إلى التطبيق',
      projectsPageIntro: 'ثلاثة مشاريع موجهة عبر HTML وCSS وJavaScript. ابدأ من الهيكل، نفّذ كل مرحلة، ثم راجع القائمة بنفسك.',
      projectPrerequisitesLabel: 'المتطلبات السابقة',
      projectMilestonesLabel: 'مراحل التنفيذ',
      projectRequirementsLabel: 'المتطلبات القابلة للمراجعة',
      projectChecklistLabel: 'قائمة مراجعة ذاتية',
      projectExpectedResultLabel: 'النتيجة المتوقعة',
      projectOptionalImprovementsLabel: 'تحسينات اختيارية',
      projectStarterFilesLabel: 'ملفات بداية للتجربة المحلية',
      projectCopyCode: 'انسخ كود البداية',
      projectCodeCopied: 'تم نسخ الكود',
      projectCopyFailed: 'تعذر النسخ؛ حدّد الكود وانسخه يدويًا.',
      projectNoSavedProgress: 'المشاريع للتطبيق المحلي فقط في هذه المرحلة؛ لا يوجد حفظ تلقائي أو تتبع إنجاز للمشاريع.',
      assessmentStart: 'ابدأ الاختبار',
      assessmentFinish: 'اعرض النتيجة',
      assessmentScoreNote: 'تحسب النتيجة من الإجابات الصحيحة في المحاولة الأولى. لا تُحفظ الإجابات أو النتيجة.',
      assessmentBackToPath: 'العودة إلى المسار',
      assessmentRetry: 'أعد التقييم',
      assessmentChoosePath: 'اختر مسارًا',
      completedStatus: 'مكتمل',
      nextStatus: 'الخطوة التالية',
      availableStatus: 'درس متاح',
      continueLearning: 'تابع من الدرس التالي',
      startPath: 'ابدأ المسار',
      reviewPreviousLesson: 'مراجعة آخر درس',
      browseLessons: 'استعراض الدروس والمحتوى',
      openLesson: 'افتح الدرس',
      stepLabel: 'الخطوة',
      learnLabel: 'افهم الفكرة',
      practiceLabel: 'تحقّق من فهمك',
      stepProgress: 'الخطوة {current} من {total}',
      lessonProgressNote: 'خطوات قصيرة تساعدك على الفهم، ثم تطبيق عملي داخل مساحة التدريب.',
      codeExampleLabel: 'مثال برمجي للقراءة',
      codeReadOnly: 'للقراءة فقط',
      previousStep: 'السابق',
      nextStep: 'التالي',
      startQuiz: 'ابدأ الأسئلة',
      quizTitle: 'أسئلة تطبيقية قصيرة',
      quizIntro: 'اختر أفضل إجابة من أربعة اختيارات في كل مرة. عند الخطأ، اقرأ التوضيح ثم حاول مجددًا.',
      questionProgress: 'السؤال {current} من {total}',
      quizProgressNote: 'النتيجة من المحاولة الأولى؛ والإجابات لا تُحفظ.',
      correctTitle: 'إجابة صحيحة',
      incorrectTitle: 'ليست هذه الإجابة، لنجرب مرة أخرى',
      tryAgain: 'حاول مجددًا',
      nextQuestion: 'السؤال التالي',
      seeResult: 'اعرض النتيجة',
      resultTitle: 'أكملت الدرس',
      scoreLabel: 'إجابة صحيحة من المحاولة الأولى',
      perfectResult: 'أحسنت. فهمك لهذه الأفكار واضح، ويمكنك الانتقال لما بعدها.',
      goodResult: 'عمل جيد. راجع النقاط المحددة إذا احتجت، ثم واصل التعلّم.',
      keepPracticingResult: 'الخطأ جزء من التعلّم. راجع النقاط المحددة وجرب الاختبار مرة أخرى.',
      resultNote: 'تعكس النتيجة إجابات المحاولة الأولى فقط؛ ولا تُحفظ اختياراتك في الأسئلة.',
      reviewTitle: 'نقاط تستحق المراجعة',
      noMissedQuestions: 'أجبت عن كل الأسئلة بشكل صحيح من المحاولة الأولى.',
      outcomeLabel: 'ما أصبحت قادرًا عليه',
      retryQuiz: 'أعد الاختبار',
      previousLesson: 'الدرس السابق',
      nextLesson: 'الدرس التالي',
      finalLesson: 'أنهيت المسار',
      returnToPath: 'العودة إلى صفحة المسار',
      notFoundTitle: 'هذه الصفحة غير موجودة',
      notFoundBody: 'الرابط لا يطابق صفحة أو درسًا متاحًا. ارجع إلى المسارات واختر ما تريد تعلّمه.',
      backHome: 'العودة إلى Mabda',
    },
  },
  en: {
    catalog: {
      metaTitle: 'Learning Paths — Mabda',
      metaDescription: 'Explore Mabda beginner learning paths in HTML, CSS, and JavaScript.',
      eyebrow: 'Mabda LEARNING PATHS',
      title: 'A clear route, one step at a time.',
      description: 'Explore active beginner paths in HTML, CSS, and JavaScript, with practical exercises inside each lesson.',
    },
    paths: {
      'html-fundamentals': {
        metaTitle: 'HTML Fundamentals Path — Mabda',
        metaDescription: 'Twelve progressive lessons in semantic HTML, document structure, organized content, forms, and practical pages.',
        eyebrow: 'PATH 01 · AVAILABLE NOW',
        title: 'HTML Fundamentals',
        summary: 'Move from your first tags to a semantic document, organized content, usable forms, and a multi-section page.',
        forWhomLabel: 'Who this path is for',
        forWhom: 'Absolute beginners; no prior coding experience or tool setup is required.',
        outcomesLabel: 'By the end, you can',
        outcomes: [
          'Read HTML elements and understand their purpose.',
          'Organize text with headings and paragraphs.',
          'Create links and images with clear attributes and useful alternative text.',
          'Build an organized document with semantic elements and useful metadata.',
          'Structure lists and tables and create clearer, more accessible forms.',
          'Use basic browser validation and include suitable images and media.',
        ],
        conceptsLabel: 'Concepts',
        concepts: ['Elements and tags', 'Document structure and metadata', 'Semantic elements', 'Lists and tables', 'Accessible forms', 'Images and media'],
        sequenceLabel: 'Lesson sequence',
        stages: [
          { id: 'html-markup-foundations', title: 'Markup and navigation foundations', purpose: 'Learn text elements, links, and how HTML describes page content.', prerequisites: 'No prior requirements.', skills: ['Read tags and elements', 'Build a heading outline', 'Create descriptive links'] },
          { id: 'html-document-structure', title: 'Document and semantic structure', purpose: 'Bring content into a complete document and describe its metadata and regions.', prerequisites: 'Complete the basics of elements and links.', skills: ['Write head metadata', 'Choose header, nav, main, and footer', 'Provide image alt text'] },
          { id: 'html-information-and-forms', title: 'Organizing information and forms', purpose: 'Choose structures for lists and tables, then collect user input clearly.', prerequisites: 'Understand elements, attributes, and document structure.', skills: ['Represent lists and tabular data', 'Connect labels to inputs', 'Use basic browser validation'] },
          { id: 'html-applied-pages', title: 'Applied pages and media', purpose: 'Apply earlier elements in a multi-section page and learn to include media.', prerequisites: 'Know headings, semantic elements, links, and images.', skills: ['Choose suitable media elements', 'Organize a multi-section page', 'Review content and accessibility'] },
        ],
        lessonSummaries: [
          { id: 'html-introduction', title: 'Introduction to HTML', summary: 'Tags, elements, and your first example.' },
          { id: 'html-headings-paragraphs', title: 'Headings and Paragraphs', summary: 'Organize content with a clear heading outline.' },
          { id: 'html-links-navigation', title: 'Links and Navigation', summary: 'Create links and understand the destination in href.' },
          { id: 'html-images-attributes', title: 'Images and Attributes', summary: 'Use src and write meaningful alternative text in alt.' },
          { id: 'html-first-page', title: 'Build Your First HTML Page', summary: 'Bring the ideas together in a complete, readable document.' },
        ],
        outline: [],
        availableNote: 'Lessons include an editor, isolated browser preview, and a separate exercise check. Signed-in learners can save drafts; running or checking code does not complete a lesson or quiz.',
        plannedNote: '',
      },
      'css-fundamentals': {
        metaTitle: 'CSS Fundamentals Path — Mabda',
        metaDescription: 'Nineteen progressive lessons in selectors, responsive layout, practical styling, and layout debugging.',
        eyebrow: 'PATH 02 · AVAILABLE NOW',
        title: 'CSS Fundamentals',
        summary: 'Start with rules, inheritance, and the box model; then build responsive layouts and add interaction, motion, and reusable values.',
        forWhomLabel: 'Who this path is for',
        forWhom: 'Beginners who know basic HTML and want to improve the appearance of web pages.',
        outcomesLabel: 'By the end, you can',
        outcomes: ['Select elements and understand rule competition and inheritance.', 'Control dimensions, spacing, visibility, and positioning.', 'Build responsive Flexbox and Grid layouts.', 'Reuse values, improve readability and motion, and debug layouts.'],
        conceptsLabel: 'Concepts',
        concepts: ['Selectors and inheritance', 'Units, boxes, and positioning', 'Flexbox and Grid', 'Media queries', 'Pseudo-selectors and variables', 'Fonts, motion, and layout debugging'],
        sequenceLabel: 'Lesson sequence',
        stages: [
          { id: 'css-cascade-and-rules', title: 'Rules, cascade, and inheritance', purpose: 'Understand how selectors choose elements, how rules compete, and what can be inherited.', prerequisites: 'Basic HTML elements and a simple CSS rule.', skills: ['Write clear selectors', 'Distinguish properties and values', 'Explain selector priority and inheritance'] },
          { id: 'css-box-and-position', title: 'Boxes, visibility, and positioning', purpose: 'Control dimensions, spacing, layout participation, and element position.', prerequisites: 'Be able to select an element with CSS.', skills: ['Use px, %, and rem', 'Compare display and visibility', 'Position an element and its layer'] },
          { id: 'css-layout-systems', title: 'Layout systems and responsiveness', purpose: 'Arrange items in rows and columns and adapt layouts to different screens.', prerequisites: 'Understand the box model and basic spacing.', skills: ['Build Flexbox and Grid layouts', 'Choose sensible breakpoints', 'Test a page at multiple viewport sizes'] },
          { id: 'css-visual-systems', title: 'Visual details and interaction', purpose: 'Reuse values and refine typography, states, and motion without hiding essential content.', prerequisites: 'Know selectors, declarations, and basic layout.', skills: ['Use pseudo-selectors', 'Define CSS custom properties', 'Add transitions that respect reduced motion'] },
          { id: 'css-debug-and-build', title: 'Debug and build a page', purpose: 'Use a repeatable inspection process and preview to improve a complete responsive layout.', prerequisites: 'Complete the basics of rules, layout, and visual states.', skills: ['Separate property errors from layout problems', 'Test breakpoints', 'Review overflow and contrast'] },
        ],
        outline: [],
        availableNote: 'Lessons include a CSS editor, isolated preview, and structural exercise checks. Some visual properties require manual review; the checker does not calculate every cascade effect or guarantee design quality.',
        plannedNote: '',
      },
      'javascript-fundamentals': {
        metaTitle: 'JavaScript Fundamentals Path — Mabda',
        metaDescription: 'Twenty-three progressive lessons in JavaScript values, data, the DOM, forms, and asynchronous programming.',
        eyebrow: 'PATH 03 · AVAILABLE NOW',
        title: 'JavaScript Fundamentals',
        summary: 'Begin with values, decisions, and loops; then organize data and functions, interact with pages, and explore storage, errors, and asynchronous requests.',
        forWhomLabel: 'Who this path is for',
        forWhom: 'Beginners familiar with HTML structure and CSS styling who want to add behavior and interaction.',
        outcomesLabel: 'By the end, you can',
        outcomes: ['Use variables, types, operators, and loops.', 'Write functions and work with scope, arrays, and objects.', 'Update the DOM and handle forms and events.', 'Read JSON and learn storage, errors, Promises, Fetch, and modules.'],
        conceptsLabel: 'Concepts',
        concepts: ['Values, strict comparison, and loops', 'Functions, scope, and data', 'Array, string, and number methods', 'DOM, events, and forms', 'JSON, storage, and error handling', 'Async, Fetch, and modules'],
        sequenceLabel: 'Lesson sequence',
        stages: [
          { id: 'js-language-foundations', title: 'Language and control-flow foundations', purpose: 'Learn values, expressions, decisions, and loops before building larger behavior.', prerequisites: 'No prior JavaScript experience is required.', skills: ['Declare variables and read basic types', 'Compare and convert values carefully', 'Write a simple condition and loop'] },
          { id: 'js-data-and-functions', title: 'Data and functions', purpose: 'Group instructions into functions and use common data structures and methods.', prerequisites: 'Understand variables, conditions, and basic loops.', skills: ['Understand scope and return values', 'Read arrays and objects', 'Choose common string, number, and array methods'] },
          { id: 'js-browser-interaction', title: 'Browser interaction', purpose: 'Select page elements and respond to clicks and form submissions.', prerequisites: 'Know functions and arrays, and have HTML elements in the page.', skills: ['Create and update DOM nodes', 'Handle events', 'Validate form input'] },
          { id: 'js-data-and-reliability', title: 'Data and reliability', purpose: 'Convert data to JSON, understand browser storage, and handle expected errors.', prerequisites: 'Know objects, functions, and page interaction.', skills: ['Use JSON.parse/stringify', 'Understand localStorage limits', 'Use try/catch for suitable errors'] },
          { id: 'js-async-and-organization', title: 'Asynchronous work and organization', purpose: 'Understand Promises, awaiting, data requests, and organizing code into modules.', prerequisites: 'Be comfortable with functions, objects, and error handling.', skills: ['Read Promise and async/await code', 'Check a Fetch response', 'Recognize import/export and file organization'] },
        ],
        outline: [],
        availableNote: 'Lessons include a JavaScript editor, isolated preview, and structural checks. The checker does not prove every runtime behavior; network, persistent storage, and module features are not run as external services in the practice sandbox.',
        plannedNote: '',
      },
      'programming-fundamentals': {
        metaTitle: 'Programming Fundamentals — Future Direction | Mabda',
        metaDescription: 'A future Mabda direction for learning concepts shared across programming languages.',
        eyebrow: 'FUTURE DIRECTION',
        title: 'Programming Fundamentals',
        summary: 'A proposed path for learning ideas shared across programming languages before specializing in a technology.',
        forWhomLabel: 'Who this direction is for',
        forWhom: 'Beginners who want to understand programming logic before building larger projects.',
        outcomesLabel: 'Future themes',
        outcomes: ['Turn an idea into steps.', 'Understand inputs and outputs.', 'Use repetition and choices.', 'Read errors and improve a solution.'],
        conceptsLabel: 'Suggested topics',
        concepts: ['Algorithmic thinking', 'Values and variables', 'Control flow', 'Functions', 'Debugging'],
        sequenceLabel: 'Future themes',
        outline: ['Break a problem into small steps', 'Represent data and values', 'Order instructions and conditions', 'Loops and functions', 'Read errors and improve'],
        availableNote: '',
        plannedNote: 'This is a future product direction; no learning path or lesson is available in this release.',
      },
      'problem-solving': {
        metaTitle: 'Problem Solving — Future Direction | Mabda',
        metaDescription: 'A future Mabda direction for building structured thinking and problem-solving skills.',
        eyebrow: 'FUTURE DIRECTION',
        title: 'Problem Solving',
        summary: 'A proposed direction for practicing structured thinking: understand the task, try an idea, and review the result.',
        forWhomLabel: 'Who this direction is for',
        forWhom: 'Learners who want to strengthen logical thinking and apply what they know in new situations.',
        outcomesLabel: 'Future themes',
        outcomes: ['Define a problem clearly.', 'Break it into simpler cases.', 'Test a solution with examples.', 'Improve steps after review.'],
        conceptsLabel: 'Suggested topics',
        concepts: ['Understand the problem', 'Break it down', 'Write solution steps', 'Test cases', 'Review and improve'],
        sequenceLabel: 'Future themes',
        outline: ['Identify the goal and given information', 'Break the task into smaller parts', 'Write simple solution steps', 'Test the idea with varied cases', 'Review and improve the approach'],
        availableNote: '',
        plannedNote: 'This is a future product direction; challenges, competitions, and saved results are not active.',
      },
    },
    ui: {
      allPaths: 'All learning paths',
      home: 'Home',
      backToPath: 'Back to path',
      available: 'Available now',
      planned: 'Planned',
      future: 'Future direction',
      openPath: 'Open path',
      viewOutline: 'View outline',
      notAvailableYet: 'No lessons are available in this path yet.',
      pathProgress: 'Path progress',
      pathLevelLabel: 'Level',
      beginnerLevel: 'Beginner',
      foundationalLevel: 'Foundations',
      pathNotStarted: 'Not started',
      pathGettingStarted: 'Getting started',
      pathInProgress: 'In progress',
      pathCompleted: 'Completed',
      courseLevelLabel: 'Course level',
      lessonCountLabel: '{count} lessons available',
      plannedLessonsUnavailable: 'Lessons are not available yet; this path is still planned.',
      sequenceEyebrow: 'LEARNING SEQUENCE',
      stagePurposeLabel: 'Stage focus',
      stagePrerequisitesLabel: 'Before you start',
      stageSkillsLabel: 'Skills you will practice',
      finalAssessmentTitle: 'Path review',
      finalAssessmentBody: 'Review questions check your understanding of the main topics. Learn from the feedback; the result is temporary.',
      finalAssessmentAction: 'Start the path review',
      assessmentNotSaved: 'This is a short self-check. Answers and results are not saved to your account and are not a certificate.',
      projectsTitle: 'Guided projects',
      projectsBody: 'Turn what you learned into small, progressive builds. Starter files are for guidance; your work stays in this browser.',
      projectsAction: 'Explore projects',
      projectsPageTitle: 'Move from lessons to applied work',
      projectsPageIntro: 'Three guided projects across HTML, CSS, and JavaScript. Start with the structure, work through each stage, and review your checklist.',
      projectPrerequisitesLabel: 'Prerequisites',
      projectMilestonesLabel: 'Build stages',
      projectRequirementsLabel: 'Reviewable requirements',
      projectChecklistLabel: 'Self-review checklist',
      projectExpectedResultLabel: 'Expected result',
      projectOptionalImprovementsLabel: 'Optional improvements',
      projectStarterFilesLabel: 'Starter files for local practice',
      projectCopyCode: 'Copy starter code',
      projectCodeCopied: 'Code copied',
      projectCopyFailed: 'Could not copy; select the code and copy it manually.',
      projectNoSavedProgress: 'Projects are local practice only in this phase; there is no automatic save or project-completion tracking.',
      assessmentStart: 'Start review',
      assessmentFinish: 'See result',
      assessmentScoreNote: 'The score counts first-attempt correct answers. Answers and results are not saved.',
      assessmentBackToPath: 'Back to the path',
      assessmentRetry: 'Retry the review',
      assessmentChoosePath: 'Choose a path',
      completedStatus: 'Completed',
      nextStatus: 'Up next',
      availableStatus: 'Available lesson',
      continueLearning: 'Continue to the next lesson',
      startPath: 'Start the path',
      reviewPreviousLesson: 'Review previous lesson',
      browseLessons: 'Browse lessons and course details',
      openLesson: 'Open lesson',
      stepLabel: 'STEP',
      learnLabel: 'UNDERSTAND',
      practiceLabel: 'CHECK YOUR UNDERSTANDING',
      stepProgress: 'Step {current} of {total}',
      lessonProgressNote: 'Short steps build understanding before you practice in the code studio.',
      codeExampleLabel: 'Read-only code example',
      codeReadOnly: 'READ ONLY',
      previousStep: 'Previous',
      nextStep: 'Next',
      startQuiz: 'Start practice',
      quizTitle: 'Short practice questions',
      quizIntro: 'Choose the best answer from four options, one question at a time. If you miss one, read the explanation and try again.',
      questionProgress: 'Question {current} of {total}',
      quizProgressNote: 'The score is based on first attempts; answers are not saved.',
      correctTitle: 'That is correct',
      incorrectTitle: 'Not quite—let’s try again',
      tryAgain: 'Try again',
      nextQuestion: 'Next question',
      seeResult: 'See your result',
      resultTitle: 'Lesson complete',
      scoreLabel: 'Correct on the first try',
      perfectResult: 'Well done. You have a clear grasp of these ideas and can move on.',
      goodResult: 'Good work. Review any marked ideas if needed, then keep learning.',
      keepPracticingResult: 'Mistakes are part of learning. Review the marked ideas and try the quiz again.',
      resultNote: 'Your score reflects first attempts only; answer choices are not stored.',
      reviewTitle: 'Ideas to review',
      noMissedQuestions: 'You answered every question correctly on the first try.',
      outcomeLabel: 'WHAT YOU CAN NOW DO',
      retryQuiz: 'Retry the quiz',
      previousLesson: 'Previous lesson',
      nextLesson: 'Next lesson',
      finalLesson: 'You completed the path',
      returnToPath: 'Return to path overview',
      notFoundTitle: 'This page is not here',
      notFoundBody: 'The address does not match an available page or lesson. Return to the paths and choose what to learn next.',
      backHome: 'Back to Mabda',
    },
  },
};
