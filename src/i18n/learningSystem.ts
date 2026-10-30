import type { AdditionalHtmlLessonId, FoundationLessonId, LearningPathId } from '../content/learningSystem';
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
export type PathLessonSummary = { id: FoundationLessonId; title: string; summary: string };
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
  lessons: Record<AdditionalHtmlLessonId, LearningLessonCopy>;
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
    pathInProgress: string;
    pathCompleted: string;
    lessonCountLabel: string;
    plannedLessonsUnavailable: string;
    sequenceEyebrow: string;
    completedStatus: string;
    nextStatus: string;
    availableStatus: string;
    continueLearning: string;
    startPath: string;
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
        metaDescription: 'خمسة دروس مترابطة لتعلّم HTML من البداية، مع تطبيق قصير في كل درس.',
        eyebrow: 'المسار 01 · متاح الآن',
        title: 'أساسيات HTML',
        summary: 'تعلّم كيف تصف HTML بنية الصفحة، ثم استخدم العناوين والفقرات والروابط والصور لتجميع أول صفحة بسيطة.',
        forWhomLabel: 'لمن هذا المسار؟',
        forWhom: 'للمبتدئ تمامًا؛ لا تحتاج إلى خبرة سابقة أو إعداد أدوات.',
        outcomesLabel: 'بعد المسار ستستطيع',
        outcomes: [
          'قراءة عناصر HTML وفهم دورها.',
          'تنظيم النص بالعناوين والفقرات.',
          'إنشاء روابط وصور بسمات واضحة ونص بديل مفيد.',
          'تمييز أجزاء وثيقة HTML كاملة.',
        ],
        conceptsLabel: 'المفاهيم',
        concepts: ['العناصر والوسوم', 'العناوين والفقرات', 'الروابط و href', 'الصور و alt', 'بنية الوثيقة'],
        sequenceLabel: 'تسلسل الدروس',
        lessonSummaries: [
          { id: 'html-introduction', title: 'مقدمة إلى HTML', summary: 'الوسوم والعناصر وقراءة مثال أول.' },
          { id: 'html-headings-paragraphs', title: 'العناوين والفقرات', summary: 'تنظيم المحتوى وبناء تسلسل مفهوم للعناوين.' },
          { id: 'html-links-navigation', title: 'الروابط والتنقّل', summary: 'إنشاء رابط وفهم الوجهة التي تحددها href.' },
          { id: 'html-images-attributes', title: 'الصور والسمات', summary: 'استخدام src وكتابة نص بديل دقيق في alt.' },
          { id: 'html-first-page', title: 'ابنِ أول صفحة HTML', summary: 'جمع المفاهيم داخل وثيقة HTML كاملة ومقروءة.' },
        ],
        outline: [],
        availableNote: 'تتضمن الدروس الخمسة محررًا ومعاينة متصفح معزولة. يمكن للمتعلم المسجّل حفظ المسودات؛ وفحص المهمة لا يُكمل الدرس أو الاختبار.',
        plannedNote: '',
      },
      'css-fundamentals': {
        metaTitle: 'مسار أساسيات CSS — Mabda',
        metaDescription: 'ثمانية دروس عملية للمبتدئين لتنسيق عناصر HTML باستخدام CSS.',
        eyebrow: 'المسار 02 · متاح الآن',
        title: 'أساسيات CSS',
        summary: 'تعلّم ربط CSS بصفحة HTML، واختيار العناصر، ثم التحكم بالألوان والخطوط والمسافات والتخطيط المتجاوب.',
        forWhomLabel: 'لمن هذا المسار؟',
        forWhom: 'للمبتدئ الذي يعرف أساسيات HTML ويريد تحسين مظهر صفحات الويب.',
        outcomesLabel: 'بعد المسار ستستطيع',
        outcomes: ['اختيار عناصر HTML بمحددات واضحة.', 'تطبيق الألوان والخطوط والمسافات.', 'شرح نموذج الصندوق وترتيب العناصر.', 'إنشاء قواعد تستجيب لحجم الشاشة.'],
        conceptsLabel: 'المفاهيم',
        concepts: ['ربط CSS وكتابة المحددات', 'الألوان والخلفيات', 'الطباعة ومقروئية النص', 'نموذج الصندوق والتخطيط', 'Flexbox والتجاوب'],
        sequenceLabel: 'تسلسل الدروس',
        outline: [],
        availableNote: 'تضم الدروس الثمانية محررًا ومعاينة معزولة وتمرينًا يتحقق من متطلبات CSS المحددة. تشغيل المعاينة منفصل عن تحقق التمرين والاختبار.',
        plannedNote: '',
      },
      'javascript-fundamentals': {
        metaTitle: 'مسار أساسيات JavaScript — Mabda',
        metaDescription: 'تسعة دروس عملية للمبتدئين حول قيم JavaScript وشروطها ودوالها وتفاعلها مع الصفحة.',
        eyebrow: 'المسار 03 · متاح الآن',
        title: 'أساسيات JavaScript',
        summary: 'ابدأ بكتابة قيم ومتغيرات، ثم تعلّم اتخاذ القرار والدوال والمصفوفات والتعامل مع عناصر الصفحة والأحداث.',
        forWhomLabel: 'لمن هذا المسار؟',
        forWhom: 'للمبتدئ الذي تعرّف على بنية HTML وتنسيق CSS ويريد إضافة سلوك وتفاعل للصفحة.',
        outcomesLabel: 'بعد المسار ستستطيع',
        outcomes: ['تعريف المتغيرات واستخدام أنواع البيانات الأساسية.', 'كتابة شروط تقارن القيم.', 'إنشاء دوال ومصفوفات صغيرة.', 'قراءة عناصر الصفحة والاستجابة للأحداث.'],
        conceptsLabel: 'المفاهيم',
        concepts: ['المتغيرات وأنواع البيانات', 'المعاملات والشروط', 'الدوال والمصفوفات', 'اختيار عناصر الصفحة', 'الأحداث والتفاعل'],
        sequenceLabel: 'تسلسل الدروس',
        outline: [],
        availableNote: 'تضم الدروس التسعة محرر JavaScript ومعاينة معزولة وتمرينًا يتحقق من بنية الكود المطلوبة. التشغيل لا يكمل الدرس أو الاختبار تلقائيًا.',
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
    lessons: {
      'html-headings-paragraphs': {
        metaTitle: 'العناوين والفقرات في HTML — Mabda',
        metaDescription: 'تعلّم تنظيم صفحة HTML بالعناوين والفقرات في درس قصير وتفاعلي.',
        eyebrow: 'أساسيات HTML · الدرس 02',
        title: 'رتّب أفكارك بالعناوين والفقرات',
        intro: 'العنوان يوضح موضوع الصفحة أو جزءًا منها، والفقرة تحمل الشرح. معًا يصنعان محتوى أسهل في القراءة.',
        objectiveLabel: 'هدف الدرس',
        objectiveText: 'استخدم h1 إلى h6 لترتيب مستويات العناوين، واستخدم p للنص العادي، دون اختيار العنوان لمجرد حجمه.',
        steps: [
          {
            title: 'العناوين تصنع هيكلًا',
            body: 'تبدأ مستويات العناوين بـ <h1> للعنوان الأهم، ثم <h2> للعناوين الفرعية، وصولًا إلى <h6>. اختر المستوى حسب علاقة الفكرة بما قبلها.',
            note: 'عادةً يكون للصفحة عنوان رئيسي واحد واضح، ثم عناوين فرعية حسب المحتوى.',
          },
          {
            title: 'المستوى أهم من الشكل',
            body: 'لا تستخدم <h1> إلى <h6> لمجرد تكبير الخط. المستوى يعبّر عن ترتيب الفكرة؛ أما شكل الخط فيمكن تنسيقه لاحقًا بـ CSS.',
            code: [
              { code: '<h1>My Garden</h1>', note: 'موضوع الصفحة الرئيسي' },
              { code: '<h2>Spring Flowers</h2>', note: 'قسم فرعي داخل الصفحة' },
              { code: '<p>Flowers begin to bloom.</p>', note: 'جملة تشرح القسم' },
            ],
          },
          {
            title: 'الفقرات للنص العادي',
            body: 'استخدم <p> لجملة أو مجموعة جمل تشرح فكرة. رتّب العناوين من الأهم إلى الأقل، ثم ضع الفقرة تحت العنوان الذي تشرحه.',
            code: [
              { code: '<h1>My Garden</h1>', note: 'عنوان الصفحة' },
              { code: '<h2>Spring Flowers</h2>', note: 'عنوان قسم' },
              { code: '<p>Flowers begin to bloom.</p>', note: 'فقرة القسم' },
            ],
          },
        ],
        questions: [
          {
            id: 'main-heading', prompt: 'أي وسم يناسب العنوان الرئيسي للصفحة؟',
            choices: [
              { id: 'h1', label: '<h1>', kind: 'code' },
              { id: 'p', label: '<p>', kind: 'code' },
              { id: 'h2', label: '<h2>', kind: 'code' },
              { id: 'h6', label: '<h6>', kind: 'code' },
            ],
            correctChoiceId: 'h1', correctFeedback: 'صحيح. <h1> يعبّر عن العنوان الرئيسي والأهم في الصفحة.',
            incorrectFeedback: '<h1> للعنوان الرئيسي؛ <h2> و<h6> لمستويات عناوين أخرى، و<p> لفقرة نصية.', reviewTopic: 'دور h1',
          },
          {
            id: 'hierarchy', prompt: 'متى نختار <h2> بدل <h1>؟',
            choices: [
              { id: 'subheading', label: 'عندما يكون عنوانًا فرعيًا تحت الموضوع الرئيسي مباشرة', kind: 'text' },
              { id: 'bigger', label: 'كلما أردنا خطًا أكبر', kind: 'text' },
              { id: 'bold', label: 'كلما أردنا جعل النص عريضًا', kind: 'text' },
              { id: 'paragraph', label: 'عندما نكتب نص فقرة عاديًا', kind: 'text' },
            ],
            correctChoiceId: 'subheading', correctFeedback: 'بالضبط. مستوى العنوان يوضح علاقته ببقية الأفكار، وليس حجمه البصري فقط.',
            incorrectFeedback: 'اختر <h2> لعنوان فرعي يتبع الموضوع الرئيسي؛ حجم الخط أو جعله عريضًا تنسيق بصري، و<p> للفقرة.', reviewTopic: 'تدرج العناوين',
          },
          {
            id: 'paragraph', prompt: 'أي عنصر يُستخدم دلاليًا لفقرة نصية؟',
            choices: [
              { id: 'paragraph', label: '<p>A short explanation.</p>', kind: 'code' },
              { id: 'heading', label: '<h2>A short explanation.</h2>', kind: 'code' },
              { id: 'div', label: '<div>A short explanation.</div>', kind: 'code' },
              { id: 'anchor', label: '<a>A short explanation.</a>', kind: 'code' },
            ],
            correctChoiceId: 'paragraph', correctFeedback: 'صحيح. <p> يحيط بالنص العادي في فقرة.',
            incorrectFeedback: '<p> هو العنصر الدلالي للفقرة؛ <h2> عنوان فرعي، و<div> حاوية عامة، و<a> ينشئ رابطًا.', reviewTopic: 'وسم الفقرة p',
          },
        ],
        outcomeLabel: 'بعد هذا الدرس',
        outcomeText: 'ستستطيع بناء عنوان رئيسي وعناوين فرعية وفقرات بترتيب يساعد القارئ على فهم الصفحة.',
      },
      'html-links-navigation': {
        metaTitle: 'الروابط والتنقّل في HTML — Mabda',
        metaDescription: 'تعلّم عنصر الرابط a والوجهة href من خلال أمثلة وتمرين قصير.',
        eyebrow: 'أساسيات HTML · الدرس 03',
        title: 'اربط بين الصفحات',
        intro: 'الرابط ينقل القارئ إلى صفحة أو موضع آخر. نص الرابط يوضح ما سيحدث، ووجهته تخبر المتصفح أين يذهب.',
        objectiveLabel: 'هدف الدرس',
        objectiveText: 'اقرأ عنصر a، وميّز نص الرابط عن السمة href التي تحمل الوجهة.',
        steps: [
          {
            title: 'عنصر a يصنع رابطًا',
            body: 'نكتب نص الرابط بين وسمَي <a> و </a>. اجعل النص مفهومًا حتى يعرف القارئ إلى أين سيقوده الرابط.',
            code: [{ code: '<a href="/about">About Mabda</a>', note: 'نص ظاهر يمكن للقارئ فتحه' }],
          },
          {
            title: 'href تحدد الوجهة',
            body: 'السمة href تكتب داخل وسم الفتح، وقيمتها هي المسار أو العنوان المقصود. السمة تصف العنصر، أما نص الرابط فيبقى بين الوسمين.',
            code: [
              { code: '<a href="/about">', note: 'وسم فتح مع وجهة داخل href' },
              { code: '  About Mabda', note: 'النص الذي يراه القارئ' },
              { code: '</a>', note: 'وسم الإغلاق' },
            ],
          },
          {
            title: 'جرّب قراءة الرابط',
            body: 'قبل فتح أي رابط، اقرأ كلماته لتتوقع الوجهة. هنا تقود href إلى قسم contact، بينما يصف النص ما سيجده الزائر.',
            code: [{ code: '<a href="#contact">Contact us</a>', note: 'رابط إلى جزء داخل الصفحة' }],
            note: 'هذا مثال للقراءة فقط ولا ينفذ تنقّلًا من داخل الدرس.',
          },
        ],
        questions: [
          {
            id: 'anchor', prompt: 'أي وسم يحيط بنص الرابط؟',
            choices: [
              { id: 'anchor', label: '<a>', kind: 'code' },
              { id: 'image', label: '<img>', kind: 'code' },
              { id: 'paragraph', label: '<p>', kind: 'code' },
              { id: 'heading', label: '<h1>', kind: 'code' },
            ],
            correctChoiceId: 'anchor', correctFeedback: 'صحيح. عنصر <a> يربط نصًا بوجهة.',
            incorrectFeedback: '<a> يحيط بنص الرابط ويربطه بوجهة؛ <img> للصورة، و<p> للفقرة، و<h1> للعنوان.', reviewTopic: 'عنصر الرابط a',
          },
          {
            id: 'href', prompt: 'ما وظيفة href في <a href="/about">؟',
            choices: [
              { id: 'destination', label: 'تحدد وجهة الرابط', kind: 'text' },
              { id: 'label', label: 'تحدد لون نص الرابط', kind: 'text' },
              { id: 'new-tab', label: 'تحدد ما إذا كان الرابط يفتح في تبويب جديد', kind: 'text' },
              { id: 'visible-words', label: 'تكتب كلمات الرابط الظاهرة', kind: 'text' },
            ],
            correctChoiceId: 'destination', correctFeedback: 'بالضبط. قيمة href هي المكان الذي يقود إليه الرابط.',
            incorrectFeedback: 'href تحمل مسار الوجهة. لا تختار لون النص أو كلماته؛ وسمة target تتحكم بمكان فتح الرابط.', reviewTopic: 'السمة href',
          },
          {
            id: 'link-text', prompt: 'أين نكتب الكلمات التي يضغطها القارئ؟',
            choices: [
              { id: 'between', label: 'بين <a> و </a>', kind: 'code' },
              { id: 'in-href', label: 'داخل قيمة href', kind: 'text' },
              { id: 'in-target', label: 'داخل قيمة target', kind: 'text' },
              { id: 'after-close', label: 'بعد وسم الإغلاق </a>', kind: 'code' },
            ],
            correctChoiceId: 'between', correctFeedback: 'صحيح. النص الظاهر يقع بين وسمَي الفتح والإغلاق.',
            incorrectFeedback: 'الكلمات القابلة للضغط توضع بين <a> و</a>. أما href وtarget فسمتان، وما يأتي بعد </a> خارج الرابط.', reviewTopic: 'نص الرابط ومكانه',
          },
        ],
        outcomeLabel: 'بعد هذا الدرس',
        outcomeText: 'ستستطيع قراءة عنصر a، وفهم href، وكتابة رابط يصف وجهته بوضوح.',
      },
      'html-images-attributes': {
        metaTitle: 'الصور والسمات في HTML — Mabda',
        metaDescription: 'تعلّم src وalt وسمات الصور في HTML، مع تركيز على النص البديل المفيد.',
        eyebrow: 'أساسيات HTML · الدرس 04',
        title: 'أضف صورة تصف معناها',
        intro: 'عنصر الصورة يضيف صورة إلى الصفحة. سماته تخبر المتصفح عن ملف الصورة، وتساعد كل قارئ على فهمها.',
        objectiveLabel: 'هدف الدرس',
        objectiveText: 'افهم معنى السمة، واستخدم src لمصدر الصورة وalt لوصفها بكلمات مفيدة.',
        steps: [
          {
            title: 'السمة تضيف معلومة',
            body: 'تأتي السمة داخل وسم الفتح على شكل اسم وقيمة بين علامتَي اقتباس. في الصورة، تحدد src مكان الملف الذي نريد عرضه.',
            code: [{ code: '<img src="/images/rose.jpg">', note: 'src تحمل مسار ملف الصورة' }],
          },
          {
            title: 'alt يصف الصورة',
            body: 'اكتب في alt وصفًا موجزًا يلتقط معلومة الصورة المهمة. قارئات الشاشة تستخدمه، ويظهر بديلًا إذا تعذر عرض الصورة.',
            code: [{ code: '<img src="/images/rose.jpg" alt="A red rose in a glass vase">', note: 'مثال تعليمي؛ لا يوجد ملف صورة مرفق' }],
            note: 'اكتب ما يحتاج القارئ معرفته، لا عبارة عامة مثل «صورة» فقط.',
          },
          {
            title: 'عنصر img لا يحتاج وسم إغلاق',
            body: 'عنصر <img> من العناصر التي لا تحيط بمحتوى بين وسمَي فتح وإغلاق. ضع src وalt في الوسم نفسه.',
            code: [{ code: '<img src="/images/rose.jpg" alt="A red rose">', note: 'عنصر صورة بسمتين واضحتين' }],
          },
        ],
        questions: [
          {
            id: 'source', prompt: 'أي سمة تحدد ملف الصورة؟',
            choices: [
              { id: 'src', label: 'src', kind: 'code' },
              { id: 'alt', label: 'alt', kind: 'code' },
              { id: 'href', label: 'href', kind: 'code' },
              { id: 'title', label: 'title', kind: 'code' },
            ],
            correctChoiceId: 'src', correctFeedback: 'صحيح. src تشير إلى مصدر ملف الصورة.',
            incorrectFeedback: 'src تشير إلى ملف الصورة. alt لوصفها نصيًا، وhref لوجهة رابط، وtitle لمعلومة إضافية.', reviewTopic: 'السمة src',
          },
          {
            id: 'alternative', prompt: 'ما أفضل وصف في alt لصورة حقيبة زرقاء على كرسي؟',
            choices: [
              { id: 'meaningful', label: 'A blue bag resting on a chair', kind: 'text' },
              { id: 'generic', label: 'Image', kind: 'text' },
              { id: 'incomplete', label: 'A chair', kind: 'text' },
              { id: 'wrong-detail', label: 'A red bag resting on a chair', kind: 'text' },
            ],
            correctChoiceId: 'meaningful', correctFeedback: 'أحسنت. الوصف يذكر المعلومة التي يحتاجها القارئ.',
            incorrectFeedback: 'الوصف الدقيق يذكر الحقيبة الزرقاء ومكانها؛ «Image» عامة، و«A chair» ناقصة، واللون الأحمر غير صحيح.', reviewTopic: 'النص البديل المفيد',
          },
          {
            id: 'img-close', prompt: 'هل يحتاج عنصر <img> إلى وسم إغلاق مثل </img>؟',
            choices: [
              { id: 'no-close', label: 'لا، نضع سماته في العنصر نفسه', kind: 'text' },
              { id: 'close', label: 'نعم، نضيف الوسم </img>', kind: 'text' },
              { id: 'image-close', label: 'نعم، نضيف الوسم </image>', kind: 'text' },
              { id: 'wrap-content', label: 'نعم، نضع الوصف بين وسمَي <img>', kind: 'text' },
            ],
            correctChoiceId: 'no-close', correctFeedback: 'صحيح. <img> عنصر فارغ؛ لا يحتوي نصًا بين وسمَي فتح وإغلاق.',
            incorrectFeedback: '<img> عنصر فارغ لا يحيط بمحتوى، لذلك لا يحتاج </img>. نضع سمات مثل src وalt عليه مباشرة.', reviewTopic: 'العناصر الفارغة',
          },
        ],
        outcomeLabel: 'بعد هذا الدرس',
        outcomeText: 'ستستطيع كتابة عنصر صورة بسمتَي src وalt، واختيار نص بديل يشرح معناها.',
      },
      'html-first-page': {
        metaTitle: 'ابنِ أول صفحة HTML — Mabda',
        metaDescription: 'اجمع مفاهيم HTML في وثيقة كاملة، ثم راجع فهمك في اختبار ختامي.',
        eyebrow: 'أساسيات HTML · الدرس 05',
        title: 'ابنِ أول صفحة HTML',
        intro: 'حان وقت جمع العناصر التي تعلمتها داخل وثيقة كاملة: تعريف نوع الملف، معلومات الصفحة، ثم المحتوى الظاهر.',
        objectiveLabel: 'هدف الدرس',
        objectiveText: 'اقرأ هيكل وثيقة HTML، وحدد دور DOCTYPE وhtml وhead وtitle وbody، ثم راجع المفاهيم الأساسية.',
        steps: [
          {
            title: 'ابدأ بنوع الوثيقة والعنصر الجذر',
            body: 'يخبر <!DOCTYPE html> المتصفح أن الوثيقة تستخدم HTML الحديثة. يحتوي <html> بقية الصفحة، ويمكن أن تصف lang لغة المحتوى.',
            code: [
              { code: '<!DOCTYPE html>', note: 'تعريف نوع الوثيقة' },
              { code: '<html lang="en">', note: 'بداية الصفحة وتحديد اللغة' },
            ],
          },
          {
            title: 'head للمعلومات وbody للمحتوى',
            body: 'يحتوي <head> معلومات الصفحة، مثل <title> الذي يظهر في تبويب المتصفح. أما <body> فيضم المحتوى الذي يظهر داخل الصفحة.',
            code: [
              { code: '<head><title>My Page</title></head>', note: 'معلومات الصفحة وعنوان التبويب' },
              { code: '<body>Visible page content</body>', note: 'المحتوى الذي يراه الزائر' },
            ],
          },
          {
            title: 'اقرأ الوثيقة كاملة',
            body: 'لاحظ كيف تجمع الوثيقة تعريف الصفحة ومعلوماتها ومحتواها. المثال للشرح، ثم جرّب تركيب وثيقتك في مساحة الممارسة ومعاينة المتصفح المعزولة.',
            code: [
              { code: '<!DOCTYPE html>', note: 'إعلان نوع الوثيقة' },
              { code: '<html lang="en">', note: 'العنصر الجذر ولغة المستند' },
              { code: '<head>', note: 'بداية معلومات الصفحة' },
              { code: '  <meta charset="UTF-8">', note: 'ترميز النص' },
              { code: '  <title>My First Page</title>', note: 'عنوان التبويب' },
              { code: '</head>', note: 'نهاية معلومات الصفحة' },
              { code: '<body>', note: 'بداية المحتوى الظاهر' },
              { code: '  <h1>Hello, Developer!</h1>', note: 'عنوان رئيسي' },
              { code: '  <p>My first page is taking shape.</p>', note: 'فقرة قصيرة' },
              { code: '</body>', note: 'نهاية المحتوى الظاهر' },
              { code: '</html>', note: 'نهاية الوثيقة' },
            ],
          },
        ],
        questions: [
          {
            id: 'doctype', prompt: 'ماذا يخبر <!DOCTYPE html> المتصفح؟',
            choices: [
              { id: 'html-standard', label: 'أن الوثيقة تستخدم HTML الحديثة', kind: 'text' },
              { id: 'page-title', label: 'ما عنوان تبويب الصفحة', kind: 'text' },
              { id: 'language', label: 'لغة محتوى الصفحة', kind: 'text' },
              { id: 'root', label: 'العنصر الجذر للوثيقة', kind: 'text' },
            ],
            correctChoiceId: 'html-standard', correctFeedback: 'صحيح. هذا الإعلان يحدد نوع الوثيقة، ولا يكتب عنوان التبويب.',
            incorrectFeedback: 'DOCTYPE يعلن أن الوثيقة تستخدم HTML الحديثة؛ <title> لعنوان التبويب، وlang للغة، و<html> هو العنصر الجذر.', reviewTopic: 'إعلان DOCTYPE',
          },
          {
            id: 'head', prompt: 'أين نضع <title> في الوثيقة؟',
            choices: [
              { id: 'inside-head', label: 'داخل <head>', kind: 'code' },
              { id: 'inside-body', label: 'داخل <body>', kind: 'code' },
              { id: 'after-doctype', label: 'مباشرة بعد <!DOCTYPE html>', kind: 'code' },
              { id: 'inside-title', label: 'داخل نص <title>', kind: 'text' },
            ],
            correctChoiceId: 'inside-head', correctFeedback: 'بالضبط. <title> معلومة عن الصفحة توضع داخل <head>.',
            incorrectFeedback: '<title> عنصر معلومات يوضع داخل <head>. أما <body> فللمحتوى الظاهر، وDOCTYPE إعلان منفصل قبل العنصر الجذر.', reviewTopic: 'head و title',
          },
          {
            id: 'body', prompt: 'أي جزء يحتوي عنوانًا وفقرة يراهما زائر الصفحة؟',
            choices: [
              { id: 'body', label: '<body>', kind: 'code' },
              { id: 'head', label: '<head>', kind: 'code' },
              { id: 'title', label: '<title>', kind: 'code' },
              { id: 'meta', label: '<meta>', kind: 'code' },
            ],
            correctChoiceId: 'body', correctFeedback: 'صحيح. <body> يحتوي المحتوى الذي يظهر داخل الصفحة.',
            incorrectFeedback: '<body> يحتوي العناوين والفقرات المرئية؛ <head> و<title> و<meta> لمعلومات الصفحة.', reviewTopic: 'محتوى body',
          },
          {
            id: 'paragraph-review', prompt: 'أي عنصر ينشئ فقرة؟',
            choices: [
              { id: 'p', label: '<p>', kind: 'code' },
              { id: 'h1', label: '<h1>', kind: 'code' },
              { id: 'a', label: '<a>', kind: 'code' },
              { id: 'img', label: '<img>', kind: 'code' },
            ],
            correctChoiceId: 'p', correctFeedback: 'صحيح. <p> هو عنصر الفقرة.',
            incorrectFeedback: '<p> يعرّف فقرة؛ <h1> للعنوان الرئيسي، و<a> للرابط، و<img> للصورة.', reviewTopic: 'العناوين والفقرات',
          },
          {
            id: 'link-review', prompt: 'في <a href="/about">About</a>، ما الذي تحدده href؟',
            choices: [
              { id: 'destination', label: 'وجهة الرابط', kind: 'text' },
              { id: 'visible-text', label: 'النص الظاهر About', kind: 'text' },
              { id: 'color', label: 'لون نص الرابط', kind: 'text' },
              { id: 'element', label: 'نوع عنصر HTML المستخدم', kind: 'text' },
            ],
            correctChoiceId: 'destination', correctFeedback: 'أحسنت. href تحمل الوجهة؛ والنص الظاهر يكتب بين وسمَي a.',
            incorrectFeedback: 'href تحدد وجهة الرابط؛ About هو النص الظاهر، و<a> يحدد نوع العنصر، وCSS يتحكم في اللون.', reviewTopic: 'الروابط و href',
          },
        ],
        outcomeLabel: 'بعد هذا الدرس',
        outcomeText: 'ستستطيع قراءة وثيقة HTML بسيطة، وفهم دور head وtitle وbody، وجمع العناوين والفقرات والروابط والصور في هيكل واحد.',
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
      pathInProgress: 'قيد التعلّم',
      pathCompleted: 'مكتمل',
      lessonCountLabel: '{count} دروس متاحة',
      plannedLessonsUnavailable: 'الدروس غير متاحة بعد؛ هذا المسار ما زال مخططًا.',
      sequenceEyebrow: 'تسلسل التعلّم',
      completedStatus: 'مكتمل',
      nextStatus: 'الخطوة التالية',
      availableStatus: 'درس متاح',
      continueLearning: 'تابع من الدرس التالي',
      startPath: 'ابدأ المسار',
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
        metaDescription: 'Five connected beginner lessons covering HTML from the first tag to a complete page.',
        eyebrow: 'PATH 01 · AVAILABLE NOW',
        title: 'HTML Fundamentals',
        summary: 'Learn how HTML describes page structure, then use headings, paragraphs, links, and images to assemble a small first page.',
        forWhomLabel: 'Who this path is for',
        forWhom: 'Absolute beginners; no prior coding experience or tool setup is required.',
        outcomesLabel: 'By the end, you can',
        outcomes: [
          'Read HTML elements and understand their purpose.',
          'Organize text with headings and paragraphs.',
          'Create links and images with clear attributes and useful alternative text.',
          'Recognize the parts of a complete HTML document.',
        ],
        conceptsLabel: 'Concepts',
        concepts: ['Tags and elements', 'Headings and paragraphs', 'Links and href', 'Images and alt', 'Document structure'],
        sequenceLabel: 'Lesson sequence',
        lessonSummaries: [
          { id: 'html-introduction', title: 'Introduction to HTML', summary: 'Tags, elements, and your first example.' },
          { id: 'html-headings-paragraphs', title: 'Headings and Paragraphs', summary: 'Organize content with a clear heading outline.' },
          { id: 'html-links-navigation', title: 'Links and Navigation', summary: 'Create links and understand the destination in href.' },
          { id: 'html-images-attributes', title: 'Images and Attributes', summary: 'Use src and write meaningful alternative text in alt.' },
          { id: 'html-first-page', title: 'Build Your First HTML Page', summary: 'Bring the ideas together in a complete, readable document.' },
        ],
        outline: [],
        availableNote: 'All five lessons include a code editor and isolated browser preview. Signed-in learners can save practice drafts; checking a task does not complete a lesson or quiz.',
        plannedNote: '',
      },
      'css-fundamentals': {
        metaTitle: 'CSS Fundamentals Path — Mabda',
        metaDescription: 'Eight practical beginner lessons for styling HTML elements with CSS.',
        eyebrow: 'PATH 02 · AVAILABLE NOW',
        title: 'CSS Fundamentals',
        summary: 'Connect CSS to HTML, select elements, then style color, typography, spacing, layout, and responsive pages.',
        forWhomLabel: 'Who this path is for',
        forWhom: 'Beginners who know basic HTML and want to improve the appearance of web pages.',
        outcomesLabel: 'By the end, you can',
        outcomes: ['Select HTML elements with clear selectors.', 'Apply color, typography, and spacing.', 'Explain the box model and basic layout.', 'Write rules that adapt to screen size.'],
        conceptsLabel: 'Concepts',
        concepts: ['Connecting CSS and selectors', 'Colors and backgrounds', 'Readable typography', 'Box model and layout', 'Flexbox and responsive rules'],
        sequenceLabel: 'Lesson sequence',
        outline: [],
        availableNote: 'All eight lessons include a CSS editor, isolated preview, and an exercise-specific code check. Running the preview remains separate from exercise and quiz completion.',
        plannedNote: '',
      },
      'javascript-fundamentals': {
        metaTitle: 'JavaScript Fundamentals Path — Mabda',
        metaDescription: 'Nine practical beginner lessons on JavaScript values, conditions, functions, and page interaction.',
        eyebrow: 'PATH 03 · AVAILABLE NOW',
        title: 'JavaScript Fundamentals',
        summary: 'Start with values and variables, then learn decisions, functions, arrays, page elements, and events.',
        forWhomLabel: 'Who this path is for',
        forWhom: 'Beginners familiar with HTML structure and CSS styling who want to add behavior and interaction.',
        outcomesLabel: 'By the end, you can',
        outcomes: ['Declare variables and use basic data types.', 'Write conditions that compare values.', 'Create small functions and arrays.', 'Select page elements and respond to events.'],
        conceptsLabel: 'Concepts',
        concepts: ['Variables and data types', 'Operators and conditions', 'Functions and arrays', 'Selecting page elements', 'Events and interaction'],
        sequenceLabel: 'Lesson sequence',
        outline: [],
        availableNote: 'All nine lessons include a JavaScript editor, isolated preview, and an exercise-specific structural code check. Running code does not complete a lesson or quiz automatically.',
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
    lessons: {
      'html-headings-paragraphs': {
        metaTitle: 'Headings and Paragraphs in HTML — Mabda',
        metaDescription: 'Learn to organize an HTML page with headings and paragraphs in a short interactive lesson.',
        eyebrow: 'HTML FUNDAMENTALS · LESSON 02',
        title: 'Organize ideas with headings and paragraphs',
        intro: 'A heading names a page or section; a paragraph carries its explanation. Together, they make content easier to follow.',
        objectiveLabel: 'LEARNING OBJECTIVE',
        objectiveText: 'Use h1 through h6 for heading levels and p for ordinary text—without choosing a heading just for its size.',
        steps: [
          {
            title: 'Headings create an outline',
            body: 'Heading levels start with <h1> for the most important title, then <h2> for a subsection, down to <h6>. Choose a level based on how the idea relates to the content around it.',
            note: 'A page usually has one clear main topic, followed by section headings as needed.',
          },
          {
            title: 'The level matters more than the look',
            body: 'Do not choose <h1> through <h6> just to make text larger. The level describes the idea’s place in the outline; CSS can style how it looks later.',
            code: [
              { code: '<h1>My Garden</h1>', note: 'The page’s main topic' },
              { code: '<h2>Spring Flowers</h2>', note: 'A section beneath it' },
              { code: '<p>Flowers begin to bloom.</p>', note: 'A sentence explaining the section' },
            ],
          },
          {
            title: 'Paragraphs hold ordinary text',
            body: 'Use <p> for a sentence or group of sentences explaining an idea. Put the paragraph beneath the heading it belongs to.',
            code: [
              { code: '<h1>My Garden</h1>', note: 'Main heading' },
              { code: '<h2>Spring Flowers</h2>', note: 'Section heading' },
              { code: '<p>Flowers begin to bloom.</p>', note: 'The section paragraph' },
            ],
          },
        ],
        questions: [
          {
            id: 'main-heading', prompt: 'Which tag is suitable for a page’s main heading?',
            choices: [
              { id: 'h1', label: '<h1>', kind: 'code' },
              { id: 'p', label: '<p>', kind: 'code' },
              { id: 'h2', label: '<h2>', kind: 'code' },
              { id: 'h6', label: '<h6>', kind: 'code' },
            ],
            correctChoiceId: 'h1', correctFeedback: 'Correct. <h1> represents the page’s main and most important heading.',
            incorrectFeedback: '<h1> is for the main heading; <h2> and <h6> are other heading levels, while <p> is a paragraph.', reviewTopic: 'The role of h1',
          },
          {
            id: 'hierarchy', prompt: 'When should you choose <h2> instead of <h1>?',
            choices: [
              { id: 'subheading', label: 'When it is a subsection directly under the main topic', kind: 'text' },
              { id: 'bigger', label: 'Whenever you want larger text', kind: 'text' },
              { id: 'bold', label: 'Whenever you want bold text', kind: 'text' },
              { id: 'paragraph', label: 'When writing ordinary paragraph text', kind: 'text' },
            ],
            correctChoiceId: 'subheading', correctFeedback: 'Exactly. Heading levels show how ideas relate, not only how they look.',
            incorrectFeedback: 'Choose <h2> for a subsection under the main topic. Font size or bold styling is visual formatting; <p> is for a paragraph.', reviewTopic: 'Heading hierarchy',
          },
          {
            id: 'paragraph', prompt: 'Which element is meant for a paragraph of text?',
            choices: [
              { id: 'paragraph', label: '<p>A short explanation.</p>', kind: 'code' },
              { id: 'heading', label: '<h2>A short explanation.</h2>', kind: 'code' },
              { id: 'div', label: '<div>A short explanation.</div>', kind: 'code' },
              { id: 'anchor', label: '<a>A short explanation.</a>', kind: 'code' },
            ],
            correctChoiceId: 'paragraph', correctFeedback: 'Correct. <p> wraps ordinary text in a paragraph.',
            incorrectFeedback: '<p> is the semantic paragraph element; <h2> is a subsection heading, <div> is a generic container, and <a> creates a link.', reviewTopic: 'The p paragraph element',
          },
        ],
        outcomeLabel: 'AFTER THIS LESSON',
        outcomeText: 'You can create a main heading, subsections, and paragraphs in an order that helps readers understand a page.',
      },
      'html-links-navigation': {
        metaTitle: 'Links and Navigation in HTML — Mabda',
        metaDescription: 'Learn the a element and href destination with examples and a short practice check.',
        eyebrow: 'HTML FUNDAMENTALS · LESSON 03',
        title: 'Connect pages with links',
        intro: 'A link takes a reader to another page or place. Its text explains what to expect, and its destination tells the browser where to go.',
        objectiveLabel: 'LEARNING OBJECTIVE',
        objectiveText: 'Read an a element and distinguish its visible link text from the href attribute that holds the destination.',
        steps: [
          {
            title: 'The a element creates a link',
            body: 'Write the link text between <a> and </a>. Make the words meaningful so readers can understand where the link leads.',
            code: [{ code: '<a href="/about">About Mabda</a>', note: 'Visible text a reader can open' }],
          },
          {
            title: 'href holds the destination',
            body: 'The href attribute goes in the opening tag, and its value is the path or address to visit. The attribute describes the link; the readable text stays between the tags.',
            code: [
              { code: '<a href="/about">', note: 'Opening tag with a destination in href' },
              { code: '  About Mabda', note: 'Text the reader sees' },
              { code: '</a>', note: 'Closing tag' },
            ],
          },
          {
            title: 'Read the link before following it',
            body: 'Use the words to predict what you will find. Here, href points to the contact section while the link text describes the destination.',
            code: [{ code: '<a href="#contact">Contact us</a>', note: 'A link to a section on the same page' }],
            note: 'This is a read-only example; it does not navigate from inside the lesson.',
          },
        ],
        questions: [
          {
            id: 'anchor', prompt: 'Which tag wraps the link text?',
            choices: [
              { id: 'anchor', label: '<a>', kind: 'code' },
              { id: 'image', label: '<img>', kind: 'code' },
              { id: 'paragraph', label: '<p>', kind: 'code' },
              { id: 'heading', label: '<h1>', kind: 'code' },
            ],
            correctChoiceId: 'anchor', correctFeedback: 'Correct. An <a> element connects text to a destination.',
            incorrectFeedback: '<a> wraps the link text and connects it to a destination; <img> is an image, <p> a paragraph, and <h1> a heading.', reviewTopic: 'The a link element',
          },
          {
            id: 'href', prompt: 'What does href do in <a href="/about">?',
            choices: [
              { id: 'destination', label: 'It sets the link destination', kind: 'text' },
              { id: 'label', label: 'It sets the link text color', kind: 'text' },
              { id: 'new-tab', label: 'It decides whether the link opens a new tab', kind: 'text' },
              { id: 'visible-words', label: 'It supplies the visible link words', kind: 'text' },
            ],
            correctChoiceId: 'destination', correctFeedback: 'Exactly. The href value is the place the link leads to.',
            incorrectFeedback: 'href holds the destination path. It does not set color or visible words; the target attribute controls where a link opens.', reviewTopic: 'The href attribute',
          },
          {
            id: 'link-text', prompt: 'Where do you write the words a reader clicks?',
            choices: [
              { id: 'between', label: 'Between <a> and </a>', kind: 'code' },
              { id: 'in-href', label: 'Inside the href value', kind: 'text' },
              { id: 'in-target', label: 'Inside the target value', kind: 'text' },
              { id: 'after-close', label: 'After the closing tag </a>', kind: 'code' },
            ],
            correctChoiceId: 'between', correctFeedback: 'Correct. Visible link text sits between the opening and closing tags.',
            incorrectFeedback: 'Clickable words go between <a> and </a>. href and target are attributes, and text after </a> is outside the link.', reviewTopic: 'The visible text of a link',
          },
        ],
        outcomeLabel: 'AFTER THIS LESSON',
        outcomeText: 'You can read an a element, understand href, and write a link whose text clearly describes its destination.',
      },
      'html-images-attributes': {
        metaTitle: 'Images and Attributes in HTML — Mabda',
        metaDescription: 'Learn src, alt, and HTML image attributes, with a focus on useful alternative text.',
        eyebrow: 'HTML FUNDAMENTALS · LESSON 04',
        title: 'Add an image and describe it',
        intro: 'An image element adds a picture to a page. Its attributes tell the browser which file to show and help every reader understand it.',
        objectiveLabel: 'LEARNING OBJECTIVE',
        objectiveText: 'Understand an attribute and use src for the image source and alt for a meaningful text description.',
        steps: [
          {
            title: 'An attribute adds information',
            body: 'An attribute appears inside an opening tag as a name and a quoted value. For an image, src points to the file we want to show.',
            code: [{ code: '<img src="/images/rose.jpg">', note: 'src contains the image file path' }],
          },
          {
            title: 'alt describes the image',
            body: 'Write a short description in alt that captures the useful meaning of the image. Screen readers can use it, and it can appear if the image cannot load.',
            code: [{ code: '<img src="/images/rose.jpg" alt="A red rose in a glass vase">', note: 'Teaching example; no image file is included' }],
            note: 'Describe what a reader needs to know, rather than using a generic phrase like “image.”',
          },
          {
            title: 'img does not need a closing tag',
            body: 'The <img> element is a void element: it does not wrap content between opening and closing tags. Put src and alt on the element itself.',
            code: [{ code: '<img src="/images/rose.jpg" alt="A red rose">', note: 'One image element with two clear attributes' }],
          },
        ],
        questions: [
          {
            id: 'source', prompt: 'Which attribute points to the image file?',
            choices: [
              { id: 'src', label: 'src', kind: 'code' },
              { id: 'alt', label: 'alt', kind: 'code' },
              { id: 'href', label: 'href', kind: 'code' },
              { id: 'title', label: 'title', kind: 'code' },
            ],
            correctChoiceId: 'src', correctFeedback: 'Correct. src points to the image file source.',
            incorrectFeedback: 'src points to the image file. alt describes it, href gives a link destination, and title adds information.', reviewTopic: 'The src attribute',
          },
          {
            id: 'alternative', prompt: 'Which is the more useful alt text for a picture of a blue bag on a chair?',
            choices: [
              { id: 'meaningful', label: 'A blue bag resting on a chair', kind: 'text' },
              { id: 'generic', label: 'Image', kind: 'text' },
              { id: 'incomplete', label: 'A chair', kind: 'text' },
              { id: 'wrong-detail', label: 'A red bag resting on a chair', kind: 'text' },
            ],
            correctChoiceId: 'meaningful', correctFeedback: 'Good choice. This description shares the useful information in the picture.',
            incorrectFeedback: 'A useful description says the bag is blue and on a chair. “Image” is vague, “a chair” is incomplete, and red is the wrong color.', reviewTopic: 'Meaningful alternative text',
          },
          {
            id: 'img-close', prompt: 'Does <img> need a closing tag such as </img>?',
            choices: [
              { id: 'no-close', label: 'No; its attributes go on the element itself', kind: 'text' },
              { id: 'close', label: 'Yes; add a </img> tag', kind: 'text' },
              { id: 'image-close', label: 'Yes; add a </image> tag', kind: 'text' },
              { id: 'wrap-content', label: 'Yes; put the description between two <img> tags', kind: 'text' },
            ],
            correctChoiceId: 'no-close', correctFeedback: 'Correct. <img> is a void element and does not wrap text between two tags.',
            incorrectFeedback: '<img> is a void element: it does not wrap content, so it needs no </img>. Put attributes such as src and alt directly on it.', reviewTopic: 'Void elements',
          },
        ],
        outcomeLabel: 'AFTER THIS LESSON',
        outcomeText: 'You can write an image element with src and alt, and choose alternative text that communicates its meaning.',
      },
      'html-first-page': {
        metaTitle: 'Build Your First HTML Page — Mabda',
        metaDescription: 'Bring HTML concepts together in a complete document, then review them with a final quiz.',
        eyebrow: 'HTML FUNDAMENTALS · LESSON 05',
        title: 'Build your first HTML page',
        intro: 'Now bring the elements together in one document: identify the file type, describe the page, then add visible content.',
        objectiveLabel: 'LEARNING OBJECTIVE',
        objectiveText: 'Read a complete HTML document, identify the roles of DOCTYPE, html, head, title, and body, then review the core ideas.',
        steps: [
          {
            title: 'Start with the document type and root element',
            body: '<!DOCTYPE html> tells the browser that the document uses modern HTML. <html> wraps the page, and lang can describe the content language.',
            code: [
              { code: '<!DOCTYPE html>', note: 'Declares the document type' },
              { code: '<html lang="en">', note: 'Starts the page and identifies its language' },
            ],
          },
          {
            title: 'head holds page information; body holds content',
            body: '<head> holds page information such as <title>, which appears in the browser tab. <body> contains the content shown inside the page.',
            code: [
              { code: '<head><title>My Page</title></head>', note: 'Page information and the tab title' },
              { code: '<body>Visible page content</body>', note: 'Content the visitor sees' },
            ],
          },
          {
            title: 'Read the whole document',
            body: 'Notice how the document type, page information, and visible content fit together. This example explains the structure; then try building your own in the practice editor and isolated browser preview.',
            code: [
              { code: '<!DOCTYPE html>', note: 'Document type declaration' },
              { code: '<html lang="en">', note: 'Root element and document language' },
              { code: '<head>', note: 'Page information begins' },
              { code: '  <meta charset="UTF-8">', note: 'Text encoding' },
              { code: '  <title>My First Page</title>', note: 'Browser tab title' },
              { code: '</head>', note: 'Page information ends' },
              { code: '<body>', note: 'Visible content begins' },
              { code: '  <h1>Hello, Developer!</h1>', note: 'Main heading' },
              { code: '  <p>My first page is taking shape.</p>', note: 'Short paragraph' },
              { code: '</body>', note: 'Visible content ends' },
              { code: '</html>', note: 'Document ends' },
            ],
          },
        ],
        questions: [
          {
            id: 'doctype', prompt: 'What does <!DOCTYPE html> tell the browser?',
            choices: [
              { id: 'html-standard', label: 'The document uses modern HTML', kind: 'text' },
              { id: 'page-title', label: 'The page tab title', kind: 'text' },
              { id: 'language', label: 'The language of the page content', kind: 'text' },
              { id: 'root', label: 'The root element of the document', kind: 'text' },
            ],
            correctChoiceId: 'html-standard', correctFeedback: 'Correct. It declares the document type; it does not set the tab title.',
            incorrectFeedback: 'DOCTYPE declares modern HTML; <title> sets the tab title, lang describes the language, and <html> is the root element.', reviewTopic: 'The DOCTYPE declaration',
          },
          {
            id: 'head', prompt: 'Where does <title> belong?',
            choices: [
              { id: 'inside-head', label: 'Inside <head>', kind: 'code' },
              { id: 'inside-body', label: 'Inside <body>', kind: 'code' },
              { id: 'after-doctype', label: 'Directly after <!DOCTYPE html>', kind: 'code' },
              { id: 'inside-title', label: 'Inside the text of <title>', kind: 'text' },
            ],
            correctChoiceId: 'inside-head', correctFeedback: 'Exactly. <title> is page information and belongs inside <head>.',
            incorrectFeedback: '<title> is a page-information element inside <head>. <body> holds visible content, and DOCTYPE is a separate declaration before the root element.', reviewTopic: 'head and title',
          },
          {
            id: 'body', prompt: 'Which part holds a heading and paragraph that visitors see?',
            choices: [
              { id: 'body', label: '<body>', kind: 'code' },
              { id: 'head', label: '<head>', kind: 'code' },
              { id: 'title', label: '<title>', kind: 'code' },
              { id: 'meta', label: '<meta>', kind: 'code' },
            ],
            correctChoiceId: 'body', correctFeedback: 'Correct. <body> contains the content shown inside the page.',
            incorrectFeedback: '<body> holds visible headings and paragraphs; <head>, <title>, and <meta> describe page information.', reviewTopic: 'Content in body',
          },
          {
            id: 'paragraph-review', prompt: 'Which element creates a paragraph?',
            choices: [
              { id: 'p', label: '<p>', kind: 'code' },
              { id: 'h1', label: '<h1>', kind: 'code' },
              { id: 'a', label: '<a>', kind: 'code' },
              { id: 'img', label: '<img>', kind: 'code' },
            ],
            correctChoiceId: 'p', correctFeedback: 'Correct. <p> is the paragraph element.',
            incorrectFeedback: '<p> marks a paragraph; <h1> is a main heading, <a> creates a link, and <img> adds an image.', reviewTopic: 'Headings and paragraphs',
          },
          {
            id: 'link-review', prompt: 'In <a href="/about">About</a>, what does href identify?',
            choices: [
              { id: 'destination', label: 'The link destination', kind: 'text' },
              { id: 'visible-text', label: 'The visible text “About”', kind: 'text' },
              { id: 'color', label: 'The link text color', kind: 'text' },
              { id: 'element', label: 'The type of HTML element used', kind: 'text' },
            ],
            correctChoiceId: 'destination', correctFeedback: 'Well done. href contains the destination; the visible words sit between the a tags.',
            incorrectFeedback: 'href identifies the destination. About is the visible text, <a> names the element, and CSS controls its color.', reviewTopic: 'Links and href',
          },
        ],
        outcomeLabel: 'AFTER THIS LESSON',
        outcomeText: 'You can read a simple HTML document, explain head, title, and body, and bring headings, paragraphs, links, and images into one structure.',
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
      pathInProgress: 'In progress',
      pathCompleted: 'Completed',
      lessonCountLabel: '{count} lessons available',
      plannedLessonsUnavailable: 'Lessons are not available yet; this path is still planned.',
      sequenceEyebrow: 'LEARNING SEQUENCE',
      completedStatus: 'Completed',
      nextStatus: 'Up next',
      availableStatus: 'Available lesson',
      continueLearning: 'Continue to the next lesson',
      startPath: 'Start the path',
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
