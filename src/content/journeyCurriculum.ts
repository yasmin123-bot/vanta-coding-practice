import type { FoundationPathId } from './learningSystem';
import type { PracticeValidationRule } from './practiceTypes';
import intermediateHtmlJson from './journeyLessons/intermediate-html.json';
import intermediateCssJson from './journeyLessons/intermediate-css.json';
import intermediateJavaScriptJson from './journeyLessons/intermediate-javascript.json';
import professionalHtmlJson from './journeyLessons/professional-html.json';
import professionalCssJson from './journeyLessons/professional-css.json';
import professionalJavaScriptJson from './journeyLessons/professional-javascript.json';

export type JourneyLevel = 'intermediate' | 'professional';
export type JourneyLocaleText = { ar: string; en: string };
export type JourneySection = JourneyLocaleText & { title: JourneyLocaleText; code?: string };
export type JourneyExample = { code: string; explanation: JourneyLocaleText };
export type JourneyCourseUnit = {
  id: string;
  title: JourneyLocaleText;
  outcome: JourneyLocaleText;
  bridge: JourneyLocaleText;
  lessonIds: string[];
};
export type JourneyQuestion = {
  id: string;
  prompt: JourneyLocaleText;
  choices: [{ id: string; text: JourneyLocaleText }, { id: string; text: JourneyLocaleText }, { id: string; text: JourneyLocaleText }, { id: string; text: JourneyLocaleText }];
  correctChoiceId: string;
  feedback: JourneyLocaleText;
};
export type JourneyLessonBase = {
  id: string;
  pathId: FoundationPathId;
  level: JourneyLevel;
  sequence: number;
  title: JourneyLocaleText;
  objective: JourneyLocaleText;
  sections: [JourneySection, JourneySection, ...JourneySection[]];
  practice: JourneyLocaleText;
  hint: JourneyLocaleText;
  manualReview?: boolean;
  starterCode: string;
  validationRules: PracticeValidationRule[];
};
export type JourneyLesson = JourneyLessonBase & {
  unitId: string;
  summary: JourneyLocaleText;
  example: JourneyExample;
  hints: [JourneyLocaleText, JourneyLocaleText, ...JourneyLocaleText[]];
  commonMistakes: JourneyLocaleText[];
  knowledgeCheck: JourneyQuestion;
};
export type JourneyCourse = {
  pathId: FoundationPathId;
  level: JourneyLevel;
  title: JourneyLocaleText;
  summary: JourneyLocaleText;
  units: JourneyCourseUnit[];
  lessons: JourneyLesson[];
  assessment: JourneyQuestion[];
  passingScore: number;
};

const text = (ar: string, en: string): JourneyLocaleText => ({ ar, en });
const section = (titleAr: string, titleEn: string, ar: string, en: string, code?: string): JourneySection => ({
  title: text(titleAr, titleEn), ar, en, ...(code ? { code } : {}),
});
const htmlRule = (id: string, tag: string, labelAr: string, labelEn: string, extra: Record<string, unknown> = {}): PracticeValidationRule => ({
  id, type: 'html-element', tag, label_ar: labelAr, label_en: labelEn, note_ar: labelAr, note_en: labelEn,
  concept_ar: 'HTML الدلالية وإمكانية الوصول', concept_en: 'Semantic HTML and accessibility', ...extra,
} as PracticeValidationRule);
const htmlDocRule = (id: string, check: 'doctype' | 'html-root' | 'charset' | 'viewport' | 'title' | 'lang' | 'direction', expected: string | undefined, ar: string, en: string): PracticeValidationRule => ({
  id, type: 'html-document', check, expected, label_ar: ar, label_en: en, note_ar: ar, note_en: en,
  concept_ar: 'وثائق HTML قوية', concept_en: 'Resilient HTML documents',
});
const cssRule = (id: string, target: string, property: string, value: string, ar: string, en: string): PracticeValidationRule => ({
  id, type: 'css-declaration', target, property, value, label_ar: ar, label_en: en, note_ar: ar, note_en: en,
  concept_ar: 'التنسيق المتجاوب والقابل للصيانة', concept_en: 'Responsive, maintainable styling',
});
const cssMediaRule = (id: string, target: string, ar: string, en: string): PracticeValidationRule => ({
  id, type: 'css-media', target, label_ar: ar, label_en: en, note_ar: ar, note_en: en,
  concept_ar: 'التصميم المتجاوب', concept_en: 'Responsive design',
});
const jsFunctionRule = (id: string, target: string, ar: string, en: string): PracticeValidationRule => ({
  id, type: 'js-function', target, label_ar: ar, label_en: en, note_ar: ar, note_en: en,
  concept_ar: 'وظائف JavaScript قابلة لإعادة الاستخدام', concept_en: 'Reusable JavaScript functions',
});
const jsCallRule = (id: string, target: string, ar: string, en: string): PracticeValidationRule => ({
  id, type: 'js-call', target, label_ar: ar, label_en: en, note_ar: ar, note_en: en,
  concept_ar: 'سلوك JavaScript', concept_en: 'JavaScript behavior',
});
const jsIfRule = (id: string, ar: string, en: string): PracticeValidationRule => ({
  id, type: 'js-if', target: 'IfStatement', label_ar: ar, label_en: en, note_ar: ar, note_en: en,
  concept_ar: 'التعامل مع الحالات والأخطاء', concept_en: 'State and error handling',
});

function lesson(
  id: string, pathId: FoundationPathId, level: JourneyLevel, sequence: number,
  title: JourneyLocaleText, objective: JourneyLocaleText, sections: JourneyLesson['sections'],
  practice: JourneyLocaleText, hint: JourneyLocaleText, starterCode: string, validationRules: PracticeValidationRule[],
): JourneyLessonBase {
  return { id, pathId, level, sequence, title, objective, sections, practice, hint, starterCode, validationRules };
}
function question(id: string, promptAr: string, promptEn: string, options: [[string, string], [string, string], [string, string], [string, string]], correctChoiceId: string, feedbackAr: string, feedbackEn: string): JourneyQuestion {
  return {
    id, prompt: text(promptAr, promptEn),
    choices: options.map(([ar, en], index) => ({ id: String.fromCharCode(97 + index), text: text(ar, en) })) as JourneyQuestion['choices'],
    correctChoiceId, feedback: text(feedbackAr, feedbackEn),
  };
}

const htmlIntermediate: JourneyLessonBase[] = [
  lesson('html-i-semantics', 'html-fundamentals', 'intermediate', 1,
    text('هندسة مناطق الصفحة الدلالية', 'Semantic page regions'),
    text('صمّم هيكلًا يوضح وظيفة كل منطقة ويجعل التنقل بقارئ الشاشة منطقيًا.', 'Design a page structure that communicates each region’s purpose and supports logical screen-reader navigation.'),
    [
      section('من أسماء العناصر إلى خريطة الصفحة', 'From element names to a page map', 'استخدم header لهوية الصفحة، وnav للتنقل، وmain للمحتوى الفريد، وaside للمعلومة الجانبية، وfooter للتذييل. قد تحتوي الصفحة على أكثر من header أو footer داخل مقالة، لكن لكل صفحة main أساسي واحد.', 'Use header for site identity, nav for navigation, main for unique content, aside for complementary information, and footer for closing details. An article may have its own header or footer, while a page should have one primary main region.', '<header>…</header>\n<nav aria-label="Primary">…</nav>\n<main id="content">\n  <article>…</article>\n</main>\n<footer>…</footer>'),
      section('اختر HTML قبل ARIA', 'Choose HTML before ARIA', 'العنصر الأصلي يوفّر الاسم والسلوك المتوقعين تلقائيًا. لا تحوّل div إلى زر بإضافة role إذا كان button يحقق المطلوب؛ لأن العنصر الأصلي يدعم لوحة المفاتيح والتركيز والتفعيل بصورة أفضل.', 'Native elements provide expected semantics and behavior automatically. Do not turn a div into a button with a role when a real button fits: native buttons already support keyboard activation and focus behavior.', '<button type="button">Save draft</button>'),
    ],
    text('أنشئ وثيقة بها header وnav وmain ومقالة معنونة وfooter، مع تسمية واضحة لمنطقة التنقل.', 'Build a document with header, nav, main, a titled article, and footer; give the navigation region a clear accessible name.'),
    text('ابدأ بالمناطق الأصلية. أضف aria-label فقط إلى nav عندما لا يكفي السياق لتمييزها.', 'Start with native landmarks. Add an aria-label to nav only when context does not distinguish it.'),
    '<header>\n  <!-- Add the site identity. -->\n</header>\n<nav><!-- Add named navigation. --></nav>\n<main><!-- Add the unique page content. --></main>\n<footer></footer>',
    [htmlRule('html-i-landmarks','main','أضف منطقة main واحدة للمحتوى الفريد.','Add one main region for unique page content.'),htmlRule('html-i-navigation','nav','أضف منطقة nav للتنقل.','Add a nav region for navigation.'),htmlRule('html-i-article','article','نظّم المحتوى المستقل داخل article.','Place standalone content in an article element.'),htmlRule('html-i-page-footer','footer','أضف footer لمعلومات ختام الصفحة.','Add a footer for page-level closing information.')]),
  lesson('html-i-forms', 'html-fundamentals', 'intermediate', 2,
    text('نماذج دقيقة ورسائل خطأ مرتبطة', 'Precise forms and associated errors'),
    text('اجمع بين تحقق HTML الأصلي وتسميات واضحة ورسائل أخطاء يمكن للتقنيات المساعدة العثور عليها.', 'Combine native HTML constraints, clear labels, and error messages that assistive technology can discover.'),
    [
      section('دع المتصفح يتحقق من القواعد البسيطة', 'Let the browser check simple constraints', 'استخدم type وrequired وminlength وmaxlength وmin وmax عندما تنطبق. هذه القيود تحسّن الإدخال وتمنح المستخدم إشارات فورية، لكنها لا تستبدل التحقق في خادم الإنتاج عند حفظ بيانات حقيقية.', 'Use type, required, minlength, maxlength, min, and max where appropriate. These constraints improve entry and offer immediate feedback, but never replace server validation when real data is saved.', '<input id="email" name="email" type="email" required autocomplete="email">'),
      section('اربط المساعدة بالحقل', 'Associate help with the control', 'لا تعتمد على اللون وحده لعرض الخطأ. ضع نصًا يشرح المشكلة، وأشر إلى معرفه باستخدام aria-describedby. عند ظهور خطأ بعد الإرسال، حدّث aria-invalid وأبق رسالة الخطأ في تدفق الصفحة.', 'Do not rely on color alone for errors. Show explanatory text, reference it with aria-describedby, and update aria-invalid after submission while keeping the error in the page flow.', '<p id="email-help">Use a valid address.</p>\n<input aria-describedby="email-help">'),
    ],
    text('أنشئ نموذج تسجيل بثلاثة حقول، labels مرتبطة، وقيود أصلية ورسالة مساعدة مرتبطة ببريد المستخدم.', 'Create a sign-up form with three fields, associated labels, native constraints, and helper text linked to the email field.'),
    text('تحقق من تطابق for مع id؛ لا تستخدم placeholder بديلًا عن label.', 'Check that each for matches an id; a placeholder is not a label.'),
    '<form>\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required aria-describedby="email-help">\n  <small id="email-help">Use a valid address.</small>\n  <button type="submit">Continue</button>\n</form>',
    [htmlRule('html-i-form','form','ضع الحقول داخل form.','Place the controls inside a form.'),htmlRule('html-i-email','input','أضف حقل بريد مطلوبًا.','Add a required email input.',{parentTag:'form',attributeValues:{type:'email'},requiredAttributes:['required']}),{id:'html-i-labels',type:'html-label-control',inputType:'email',requireRequired:true,minimumPairs:1,formScoped:true,label_ar:'اربط label بحقل البريد باستخدام for وid متطابقين.',label_en:'Associate the email label using matching for and id values.',note_ar:'اربط label بحقل البريد باستخدام for وid متطابقين.',note_en:'Associate the email label using matching for and id values.',concept_ar:'النماذج المتاحة',concept_en:'Accessible forms'},htmlRule('html-i-help','small','أضف نص مساعدة غير فارغ.','Add non-empty helper text.',{parentTag:'form',minimumTextLength:1})]),
  lesson('html-i-tables', 'html-fundamentals', 'intermediate', 3,
    text('جداول بيانات قابلة للفهم', 'Tables that communicate data'),
    text('ميّز الجداول البيانية عن التخطيط، واربط رؤوس الصفوف والأعمدة بخلايا البيانات.', 'Distinguish data tables from layout and associate row or column headers with data cells.'),
    [
      section('أضف سياقًا قبل الخلايا', 'Add context before the cells', 'يشرح caption موضوع الجدول، ويعلن thead وtbody عن مجموعات الصفوف. استخدم th للخلايا الرأسية، وscope="col" أو scope="row" لتوضيح محور العلاقة.', 'A caption explains the table’s subject; thead and tbody group rows. Use th for headers and scope="col" or scope="row" to communicate each relationship.', '<table>\n  <caption>Quarterly output</caption>\n  <thead><tr><th scope="col">Team</th></tr></thead>\n</table>'),
      section('اختر الجدول عند وجود علاقة شبكية', 'Use a table for a real grid relationship', 'استخدم جدولًا عندما تكون البيانات ذات صفوف وأعمدة متقاطعة، مثل مقارنة خطة بخصائصها. لا تستخدمه لصنع شبكة مرئية فقط؛ فـCSS Grid وFlexbox مناسبان لتخطيط واجهة المستخدم.', 'Use a table when information has meaningful intersecting rows and columns, such as comparing plans with features. Do not use tables just for visual layout; CSS Grid and Flexbox are made for interface layout.', '<th scope="row">Storage</th><td>Included</td>'),
    ],
    text('أضف جدول مقارنة بخمس خصائص، caption، رؤوس أعمدة واضحة، ورؤوس صفوف تستخدم scope.', 'Build a comparison table with five features, a caption, clear column headings, and row headings that use scope.'),
    text('اكتب العنوان والوصف ثم تحقق أن كل خلية يمكن تفسيرها مع رأسها.', 'Write the caption and headers first, then check that each cell can be interpreted with its header.'),
    '<table>\n  <caption>Plan comparison</caption>\n  <thead><tr><th scope="col">Plan</th><th scope="col">Storage</th></tr></thead>\n  <tbody><!-- Add comparison rows. --></tbody>\n</table>',
    [htmlRule('html-i-table','table','أنشئ جدولًا للبيانات المقارنة.','Create a table for comparison data.'),htmlRule('html-i-caption','caption','أضف caption يشرح الجدول.','Add a caption that explains the table.',{parentTag:'table',minimumTextLength:1}),htmlRule('html-i-headers','th','أضف رؤوسًا داخل الجدول.','Add table headers.',{parentTag:'table',minimumCount:2,minimumTextLength:1}),htmlRule('html-i-scope','th','أضف scope إلى رؤوس الجدول.','Add scope to table headers.',{parentTag:'table',requiredAttributes:['scope']})]),
  lesson('html-i-media', 'html-fundamentals', 'intermediate', 4,
    text('صور ووسائط مرنة الأداء', 'Responsive, efficient media'),
    text('اختر الصورة المناسبة للحجم والسياق، واستخدم التحميل المؤجل للوسائط غير الظاهرة أولًا.', 'Choose appropriate image sources and use deferred loading for media that is not initially visible.'),
    [
      section('المحتوى البديل قرار تصميم', 'Alternative text is a content decision', 'اكتب alt ليعبّر عن وظيفة الصورة في سياق الصفحة؛ استخدم نصًا فارغًا للصورة الزخرفية كي لا تكرر معلومة لا يحتاجها قارئ الشاشة. لا تجعل اسم الملف وصفًا بديلًا.', 'Write alt text for the image’s role in the page context; use empty alt text for decoration to avoid unnecessary announcements. A filename is not an adequate alternative.', '<img src="team.webp" alt="The design team reviewing a prototype">'),
      section('حمّل المناسب وفي الوقت المناسب', 'Load the right media at the right time', 'يتيح picture اختيار مصدر بناءً على التنسيق أو العرض. استخدم srcset وsizes عندما تتوفر أحجام مختلفة. للصور أسفل الطية، loading="lazy" يخفّف العمل الأولي؛ ولا تؤخر صورة LCP الرئيسية دون قياس.', 'picture can select sources by format or viewport. Use srcset and sizes for multiple resolutions. loading="lazy" defers below-the-fold images, but do not lazily delay the measured main LCP image.', '<img src="story-640.webp" srcset="story-640.webp 640w, story-1280.webp 1280w" sizes="(max-width: 700px) 100vw, 700px" alt="…" loading="lazy">'),
    ],
    text('ابنِ بطاقة مقالة بها صورة وصفية مع srcset/sizes، عنوان وصفي، ورابط لمحتوى المقال.', 'Build an article card with a descriptive image using srcset/sizes, a meaningful title, and a link to the article.'),
    text('الصورة الأولى التي يراها المستخدم قد تحتاج إلى أولوية؛ راجع السياق قبل إضافة lazy.', 'The first visible image may need priority; inspect the context before adding lazy loading.'),
    '<figure>\n  <img src="story-640.webp" srcset="story-640.webp 640w, story-1280.webp 1280w" sizes="(max-width: 700px) 100vw, 700px" alt="A team reviewing a prototype" loading="lazy">\n  <figcaption>Design notes from the review.</figcaption>\n</figure>',
    [htmlRule('html-i-picture','img','أضف صورة لها وصف بديل مفيد.','Add an image with useful alternative text.',{requiredAttributes:['src','alt'],minimumAttributeLengths:{src:2,alt:4}}),htmlRule('html-i-responsive','img','أضف مجموعة مصادر responsive عبر srcset.','Provide responsive sources with srcset.',{requiredAttributes:['srcset','sizes']}),htmlRule('html-i-caption','figcaption','اكتب تعليقًا داخل figure.','Add a caption inside figure.',{ancestorTag:'figure',minimumTextLength:1})]),
  lesson('html-i-multipage', 'html-fundamentals', 'intermediate', 5,
    text('تنظيم موقع صغير متعدد الصفحات', 'Organize a small multi-page site'),
    text('وحّد التنقل والبيانات الوصفية مع الحفاظ على بنية واضحة لكل صفحة.', 'Share navigation and metadata patterns while preserving a clear structure on each page.'),
    [
      section('اربط المستندات بروابط حقيقية', 'Connect documents with real links', 'يجب أن يعمل href عند فتحه، وأن تعبّر تسمية الرابط عن وجهته. استخدم روابط داخلية للأقسام عندما تساعد الوصول إلى المحتوى، وأضف رابط تجاوز للكتل المكررة.', 'A href should resolve, and the link text should communicate its destination. Use in-page links when they help reach content, and provide a skip link for repeated navigation.', '<a class="skip-link" href="#main">Skip to content</a>'),
      section('كرر النمط لا النسخ العشوائي', 'Repeat a pattern, not scattered duplication', 'اكتب قالبًا واضحًا لرأس الصفحة وتنقلها وتذييلها، ثم غيّر العنوان والوصف ومحتوى main لكل صفحة. تحقق من lang وdir وtitle حتى لا يرث المستخدم سياقًا مضللًا.', 'Use a consistent header, navigation, and footer pattern, but give each document a relevant title, description, and main content. Check lang, dir, and title so users are not left with misleading context.', '<html lang="en" dir="ltr">\n<head><meta charset="utf-8"><title>Field notes</title></head>'),
    ],
    text('صمّم هيكل صفحتين لمجلة: روابط تنقل داخلية ذات نص واضح، عنوان ووصف فريدان، ورابط تجاوز.', 'Plan two magazine pages with descriptive navigation links, unique title/description metadata, and a skip link.'),
    text('قارن destination مع النص المقروء بصوت قارئ الشاشة، ولا تجعل كلمة «المزيد» وحدها اسم الرابط.', 'Compare each destination with its screen-reader text; do not use “more” as the only link name.'),
    '<!doctype html>\n<html lang="en" dir="ltr">\n<head><meta charset="utf-8"><title>Field notes</title></head>\n<body><a class="skip-link" href="#main">Skip to content</a><header></header><nav></nav><main id="main"></main><footer></footer></body>\n</html>',
    [htmlDocRule('html-i-doctype','doctype',undefined,'ابدأ الوثيقة بإعلان doctype.','Start with a doctype.'),htmlDocRule('html-i-lang','lang','en','حدّد لغة الوثيقة.','Set the document language.'),htmlDocRule('html-i-title','title',undefined,'أضف عنوانًا فريدًا للصفحة.','Add a page-specific title.'),htmlRule('html-i-skip','a','أضف رابط تجاوز إلى المحتوى الرئيسي.','Add a skip link to the main content.',{attributePrefixes:{href:'#'},textIncludes:'Skip'})]),
];

const cssIntermediate: JourneyLessonBase[] = [
  lesson('css-i-cascade', 'css-fundamentals', 'intermediate', 1,
    text('ترويض التتالي والخصوصية', 'Control the cascade and specificity'),
    text('توقع النتيجة النهائية من المصدر والطبقات والخصوصية والوراثة بدل زيادة !important.', 'Predict the final style from source order, layers, specificity, and inheritance instead of reaching for !important.'),
    [section('الطبقات تسبق تفاصيل المحدد', 'Layers organize precedence', 'تُحسم أولوية الطبقات قبل مقارنة الخصوصية داخل الطبقة. ضع reset ثم base ثم components ثم utilities، واستخدم :where() عندما تريد محددًا بلا تكلفة خصوصية.', 'Layer precedence is considered before comparing specificity within a layer. Order reset, base, components, and utilities; use :where() when you want a selector with no specificity cost.', '@layer reset, base, components, utilities;\n@layer components { .card h2 { margin: 0; } }\n@layer utilities { .card h2 { margin: 1rem; } }'),section('حل السبب لا الأعراض', 'Fix the cause, not the symptom', 'عند تعارض قاعدة، تتبع العنصر ثم اعرف القواعد المطابقة ومصدر كل خاصية. أزل التكرار أو غيّر نطاق المكوّن قبل رفع خصوصيته؛ المبالغة تجعل التعديل التالي أصعب.', 'When rules conflict, inspect the element and determine which declarations match and where they come from. Remove duplication or narrow component scope before increasing specificity.', '@layer components { .card h2 { margin: 0; } }\n@layer utilities { .card h2 { margin: 1rem; } }')],
    text('أنشئ طبقات للمكوّنات والمرافق، واجعل تنسيق عنوان البطاقة قابلًا للتجاوز دون !important.', 'Create component and utility layers, then make the card heading style overridable without !important.'),
    text('اكتب قائمة ترتيب الطبقات أولًا ثم ضع قاعدة المكوّن داخل طبقتها.', 'Write the layer order first, then place the component rule in its layer.'),
    '/* TODO: declare the layer order */\n@layer components { .card h2 { /* TODO: set the base margin */ } }\n@layer utilities { .card h2 { /* TODO: override the same property */ } }',
    [
      { id: 'css-i-layer-order', type: 'css-layer-order', layers: ['components', 'utilities'], label_ar: 'أعلن ترتيب طبقتي المكوّن والمرافق.', label_en: 'Declare the component and utility layer order.', note_ar: 'يفحص ترتيب @layer ساكنًا ولا يحاكي التتالي في المتصفح.', note_en: 'Statically checks @layer order; it does not simulate browser cascade.' },
      { id: 'css-i-layer-component', type: 'css-declaration', target: '.card h2', property: 'margin', value: '0', layer: 'components', label_ar: 'ضع هامش الأساس داخل طبقة components.', label_en: 'Put the base margin in the components layer.', note_ar: 'يتحقق من التصريح وسياق الطبقة.', note_en: 'Checks the declaration and its layer context.' },
      { id: 'css-i-layer-utility', type: 'css-declaration', target: '.card h2', property: 'margin', value: '1rem', layer: 'utilities', label_ar: 'أضف تجاوزًا للخاصية نفسها في utilities.', label_en: 'Add an override for the same property in utilities.', note_ar: 'يجب أن تتنافس القاعدتان على العنصر والخاصية نفسيهما.', note_en: 'Both rules must compete for the same element and property.' },
    ]),
  lesson('css-i-layout', 'css-fundamentals', 'intermediate', 2,
    text('اختيار Flexbox أو Grid', 'Choose between Flexbox and Grid'),
    text('اختر نظام التخطيط بحسب علاقة المحتوى في محور واحد أو شبكة ثنائية المحور.', 'Choose a layout system according to whether the content forms a one-dimensional flow or a two-dimensional grid.'),
    [section('Flexbox للتدفق في اتجاه', 'Flexbox for one-dimensional flow', 'استخدم Flexbox عندما تحتاج توزيع عناصر صف أو عمود واحدًا مع محاذاة مرنة. flex-wrap يسمح للعناصر بالانتقال للسطر التالي بدل ضغطها خارج المساحة.', 'Use Flexbox to align and distribute items in a single row or column. flex-wrap lets items move to another line instead of overflowing.', '.toolbar { display: flex; flex-wrap: wrap; gap: 1rem; }'),section('Grid للشبكات والعلاقات', 'Grid for two-dimensional relationships', 'يعرّف Grid الصفوف والأعمدة معًا. minmax(0, 1fr) يمنع المحتوى الطويل من فرض عرض أكبر، وrepeat(auto-fit, minmax()) يصنع شبكة تتكيف مع المساحة.', 'Grid defines rows and columns together. minmax(0, 1fr) protects against long content forcing overflow; repeat(auto-fit, minmax()) builds a grid that adapts to available room.', '.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr)); gap: 1rem; }')],
    text('ابنِ شبكة بطاقات من ثلاثة أعمدة كحد أقصى تتمدد إلى عمود واحد عند ضيق المساحة.', 'Build a card grid that uses up to three columns and shrinks to one column when space is tight.'),
    text('اختبر نصًا طويلًا داخل إحدى البطاقات؛ استخدم min-width: 0 عند الحاجة.', 'Test long text inside a card; use min-width: 0 where required.'),
    '.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: 1rem;\n}',
    [cssRule('css-i-grid',' .cards','display','grid','استخدم Grid لعناصر البطاقات.','Use Grid for the card collection.')]),
  lesson('css-i-fluid', 'css-fundamentals', 'intermediate', 3,
    text('قياسات مرنة وحاويات قراءة', 'Fluid sizing and readable containers'),
    text('استخدم قياسات مرتبطة بالسياق لتقليل القفزات بين أحجام الشاشة.', 'Use context-aware sizes to reduce abrupt changes between viewport sizes.'),
    [section('اختر الوحدة بحسب العلاقة', 'Choose units for the relationship', 'rem مناسبة للمقاييس التي يجب أن تحترم تكبير الخط، و% مرتبطة بالحاوية، وvw/vh مرتبطة بالنافذة. استخدم clamp لقيمة دنيا وقيمة مفضلة وقيمة قصوى.', 'rem suits values that should respect text scaling, % relates to a containing block, and vw/vh relate to the viewport. Use clamp for a minimum, preferred value, and maximum.', 'h1 { font-size: clamp(2rem, 4vw, 4rem); }'),section('حافظ على طول السطر', 'Keep line length readable', 'العرض الكبير جدًا يجعل قراءة الفقرات مرهقة. حدّد max-width بالنحو ch للقراءة الطويلة، مع ترك الصفحة نفسها مرنة لتستجيب لتكبير الخط.', 'Very wide text lines make long reading tiring. Limit prose with a max-width in ch while keeping the page flexible under text zoom.', '.article-copy { max-width: 68ch; }')],
    text('صمّم عمود قراءة بعرض أقصى مقاس بالـch وعنوان حجمه fluid دون كسر التكبير.', 'Style a reading column with a ch-based maximum and a fluid heading that still respects zoom.'),
    text('تأكد أن حد clamp لا يفرض خطًا صغيرًا على شاشة الهاتف.', 'Ensure the clamp minimum does not force tiny text on a phone.'),
    '.article-copy { max-width: 68ch; }\nh1 { font-size: clamp(2rem, 4vw, 4rem); }',
    [cssRule('css-i-fluid','h1','font-size','clamp(2rem, 4vw, 4rem)','استخدم clamp لتدرّج حجم العنوان.','Use clamp for fluid heading size.')]),
  lesson('css-i-states', 'css-fundamentals', 'intermediate', 4,
    text('حالات تفاعلية وحركة مسؤولة', 'Interactive states and considerate motion'),
    text('صمّم حالات hover وfocus وactive ولا تجعل الحركة إلزامية لفهم الحالة.', 'Design hover, focus, and active states without making motion necessary to understand the state.'),
    [section('التركيز مرئي دائمًا', 'Focus must remain visible', 'يستخدم مستخدم لوحة المفاتيح مؤشر focus لمعرفة موضعه. لا تحذفه؛ أنشئ outline واضحًا مع مساحة، واختبر التباين على الخلفيات الفعلية.', 'Keyboard users rely on focus to know where they are. Do not remove it; provide a clear outline with offset and test contrast on actual backgrounds.', 'button:focus-visible { outline: 3px solid currentColor; outline-offset: 3px; }'),section('احترم reduced motion', 'Respect reduced motion', 'تضيف الحركة انتقالًا بين حالتين، لكنها لا ينبغي أن تومض أو تخفي محتوى. ضع الحركة في prefers-reduced-motion: no-preference أو أزلها عندما يطلب المستخدم تقليلها.', 'Motion can bridge states, but should not flash or hide content. Opt into animation under prefers-reduced-motion: no-preference, or reduce it when requested.', '@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto; } }')],
    text('أضف مؤشر focus-visible واضحًا وحركة انتقالية قصيرة مع مسار reduced-motion.', 'Add a clear focus-visible indicator and short transition with a reduced-motion path.'),
    text('اختبر Tab ثم فعّل إعداد تقليل الحركة في نظام التشغيل.', 'Test with Tab, then enable reduced motion in the operating system.'),
    'button:focus-visible { outline: 3px solid #f0ad68; outline-offset: 3px; }\n@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms; transition-duration: 0.01ms; } }',
    [cssRule('css-i-focus','button:focus-visible','outline-style','solid','أظهر تركيز لوحة المفاتيح.','Show keyboard focus.'),cssMediaRule('css-i-motion','prefers-reduced-motion','احترم إعداد تقليل الحركة.','Respect reduced-motion preferences.')]),
  lesson('css-i-tokens', 'css-fundamentals', 'intermediate', 5,
    text('سمات وألوان وتنسيق يدعم RTL', 'Tokens and RTL-aware styling'),
    text('استخدم custom properties والخصائص المنطقية لبناء واجهة قابلة للتغيير والاتجاه.', 'Use custom properties and logical properties for interfaces that can change theme and direction.'),
    [section('المتغيرات عقد تصميم', 'Tokens are design contracts', 'عرّف قيم الألوان والمساحات مرة ثم استخدمها في المكوّنات. تمنحك variables نقطة واحدة لتعديل السمة وتقلل الانحراف البصري بين أجزاء الموقع.', 'Define color and spacing values once and consume them in components. Variables provide one place to adjust a theme and reduce visual drift.', ':root { --space-3: 1rem; --surface: #18202a; }\n.card { padding: var(--space-3); background: var(--surface); }'),section('فضّل start/end على left/right', 'Prefer start/end over left/right', 'margin-inline-start وpadding-inline وborder-inline تتبع اتجاه النص تلقائيًا؛ لهذا تعمل في RTL وLTR دون نسخ مجموعتين من القواعد. لا تحوّل واجهة الكود نفسها إلى RTL.', 'margin-inline-start, padding-inline, and border-inline follow text direction automatically, so the same rules work in RTL and LTR. Keep code panes explicitly left-to-right.', '.card { padding-inline: 1rem; border-inline-start: 2px solid var(--accent); }')],
    text('أنشئ ثلاث custom properties ثم طبّق padding-inline وborder-inline-start على بطاقة.', 'Create three custom properties, then use padding-inline and border-inline-start on a card.'),
    text('غيّر dir إلى rtl وشاهد هل يشير الحد إلى بداية النص لا بداية الشاشة.', 'Switch dir to rtl and check that the border follows text start, not the screen edge.'),
    ':root { --space: 1rem; --surface: #18202a; --accent: #f0ad68; }\n.card { padding-inline: var(--space); border-inline-start: 2px solid var(--accent); background: var(--surface); }',
    [cssRule('css-i-logical',' .card','padding-inline','1rem','استخدم padding-inline للتوافق مع الاتجاهين.','Use padding-inline for both text directions.')]),
];

const jsIntermediate: JourneyLessonBase[] = [
  lesson('js-i-transform', 'javascript-fundamentals', 'intermediate', 1,
    text('تحويل البيانات دون إفساد الأصل', 'Transform data without corrupting the source'),
    text('ركّب map وfilter وreduce بوضوح، واكتب تحويلات قابلة للتوقع.', 'Compose map, filter, and reduce clearly, and write predictable transformations.'),
    [section('اختيار الدالة يوضح المقصود', 'The method communicates intent', 'ينشئ map قائمة محوّلة، وfilter يحتفظ بالعناصر المطابقة، وfind يعيد أول تطابق، وsome/every يجيبان عن سؤال منطقي. اختر أبسط أداة تعبّر عن النتيجة المطلوبة.', 'map creates a transformed list, filter keeps matching items, find returns the first match, and some/every answer a logical question. Choose the smallest tool that expresses the desired result.', 'const activeNames = people.filter(person => person.active).map(person => person.name);'),section('لا تغيّر المصدر بلا داعٍ', 'Avoid mutating shared source data', 'تعديلات النسخة المنسوخة تجعل التدفق أسهل للاختبار. spread وmap مناسبان لتحديث عنصر دون تعديل الكائن الأصلي الذي قد تستخدمه أجزاء أخرى.', 'Updating a copied value makes data flow easier to test. Spread and map can update one item without changing the original object another part may still use.', 'const next = items.map(item => item.id === id ? { ...item, done: true } : item);')],
    text('اكتب دالة تعيد عناوين المهام غير المكتملة في فئة محددة، دون تعديل المصفوفة الأصلية.', 'Write a function that returns titles of incomplete tasks in one category without mutating the source array.'),
    text('استخدم filter لتحديد العناصر ثم map لإنتاج العناوين.', 'Use filter to select items, then map to produce titles.'),
    'const tasks = [];\nfunction getOpenTaskTitles(items, category) {\n  return items.filter(task => !task.done && task.category === category).map(task => task.title);\n}',
    [jsFunctionRule('js-i-filter','getOpenTaskTitles','اكتب دالة تحويل قابلة لإعادة الاستخدام.','Write a reusable transformation function.'),jsCallRule('js-i-map','map','حوّل النتائج باستخدام map.','Transform selected results with map.')]),
  lesson('js-i-dom', 'javascript-fundamentals', 'intermediate', 2,
    text('التعامل مع DOM ونماذج متعددة الحالات', 'Work with the DOM and multi-state forms'),
    text('استخدم تفويض الأحداث ودوال عرض صغيرة لحماية التفاعل من التكرار.', 'Use event delegation and small rendering functions to keep interaction logic manageable.'),
    [section('اربط حدثًا واحدًا بقائمة متغيرة', 'Delegate events from a changing list', 'عندما تُضاف الأزرار ديناميكيًا، اربط click بالحاوية واستخدم closest للبحث عن العنصر المقصود. تحقق أن الهدف ما زال داخل الحاوية قبل العمل به.', 'When buttons are added dynamically, listen on their container and use closest to find the intended control. Confirm the target remains within the container.', 'list.addEventListener("click", event => {\n  const button = event.target.closest("button[data-action]");\n  if (!button || !list.contains(button)) return;\n});'),section('حدّث الدلالة مع الواجهة', 'Update semantics with the view', 'عند تغيير حالة مرئية، حدّث النص الواضح وaria-pressed أو aria-expanded عند انطباقها. الإعلان عبر aria-live يجب أن يكون مختصرًا؛ لا تعِد قراءة الصفحة كاملة.', 'When visible state changes, update clear text and aria-pressed or aria-expanded where appropriate. Announcements through aria-live should be concise rather than repeating the whole page.', 'status.textContent = "Task saved";')],
    text('نفّذ حدثًا مفوضًا يغيّر مهمة محددة، ثم حدّث رسالة status قصيرة.', 'Implement a delegated event for one task and update a concise status message.'),
    text('ابدأ من event.target ثم صعّد إلى الزر بواسطة closest؛ لا تفترض أن الهدف هو الزر.', 'Start at event.target and find its button with closest; the target may be a nested icon.'),
    'const list = document.querySelector("#task-list");\nconst status = document.querySelector("#status");\nlist.addEventListener("click", event => {\n  const button = event.target.closest("button[data-action]");\n  if (!button || !list.contains(button)) return;\n  status.textContent = "Task updated";\n});',
    [jsFunctionRule('js-i-render','renderTasks','افصل عرض DOM في دالة واضحة.','Separate DOM rendering into a clear function.'),jsIfRule('js-i-guard','تحقق من الهدف قبل تطبيق الإجراء.','Guard the delegated event target before acting.')]),
  lesson('js-i-storage', 'javascript-fundamentals', 'intermediate', 3,
    text('حفظ واستعادة بيانات محلية', 'Persist and restore local data'),
    text('حوّل JSON مع التحقق من الشكل وتعامل مع فشل التخزين بدل افتراض نجاحه.', 'Serialize JSON with shape checks and handle storage failures rather than assuming success.'),
    [section('التخزين نصي وقابل للتلف', 'Storage is text and can be corrupted', 'JSON.parse قد يفشل إذا تغيرت القيمة يدويًا أو قُطعت. تحقق من Array.isArray ومن الحقول التي تعتمد عليها قبل إعادة البيانات إلى حالة التطبيق.', 'JSON.parse can fail after manual edits or interrupted writes. Check Array.isArray and required fields before restoring data into application state.', 'try {\n  const saved = JSON.parse(localStorage.getItem("mabda.tasks") ?? "[]");\n  const tasks = Array.isArray(saved) ? saved : [];\n} catch (error) {\n  // Recover to an empty, usable state.\n}'),section('احفظ أقل ما يلزم', 'Persist only what is needed', 'لا تخزن أسرارًا أو بيانات شخصية حساسة في localStorage. المفتاح ذو نسخة يسهل تغييره عند تحديث المخطط، وحالة واجهة العرض يجب أن تظل قابلة للاستعادة بعد تعذر التخزين.', 'Do not store secrets or sensitive personal information in localStorage. Versioned keys make schema changes easier; the interface should remain usable if storage is unavailable.', 'localStorage.setItem("mabda.tasks.v1", JSON.stringify(tasks));')],
    text('أضف دالتي loadTasks وsaveTasks مع معالجة parse وفشل الكتابة دون تعطيل التطبيق.', 'Add loadTasks and saveTasks with parse and write-failure handling that does not break the app.'),
    text('تعامل مع التخزين كميزة قد تفشل؛ لا تمسح البيانات بصمت عند حدوث خطأ.', 'Treat storage as a feature that may fail; do not silently erase data on an error.'),
    'function loadTasks() {\n  try {\n    const value = JSON.parse(localStorage.getItem("mabda.tasks.v1") ?? "[]");\n    return Array.isArray(value) ? value : [];\n  } catch (error) {\n    return [];\n  }\n}\nfunction saveTasks(tasks) {\n  try { localStorage.setItem("mabda.tasks.v1", JSON.stringify(tasks)); return true; }\n  catch (error) { return false; }\n}',
    [jsFunctionRule('js-i-load','loadTasks','أنشئ دالة استعادة مستقلة.','Create a dedicated restoration function.'),jsCallRule('js-i-set','localStorage.setItem','احفظ JSON في مفتاح ذي نسخة.','Persist JSON under a versioned key.'),jsIfRule('js-i-recovery','تعامل مع بيانات غير صالحة بمسار آمن.','Handle invalid data with a safe recovery branch.')]),
  lesson('js-i-async', 'javascript-fundamentals', 'intermediate', 4,
    text('طلبات Fetch وحالات التحميل', 'Fetch requests and loading states'),
    text('مثّل التحميل والنجاح والفشل بوضوح، ولا تعتبر استجابة HTTP غير الناجحة نجاحًا.', 'Represent loading, success, and failure explicitly, and do not treat unsuccessful HTTP responses as success.'),
    [section('Fetch لا يرفض لكل أخطاء HTTP', 'Fetch does not reject every HTTP error', 'يرفض fetch غالبًا عند فشل الشبكة لا عند 404. افحص response.ok قبل قراءة البيانات، ثم تحقق من نوع المحتوى وشكل JSON قبل عرضه.', 'fetch usually rejects on network failure, not on 404. Check response.ok before reading data, then validate the content type and JSON shape before rendering.', 'const response = await fetch(url, { signal });\nif (!response.ok) throw new Error(`Request failed: ${response.status}`);\nconst data = await response.json();'),section('نظّف أثر الطلب السابق', 'Clean up stale requests', 'عند مغادرة الصفحة أو تغيير الفلتر بسرعة، قد تصل الاستجابة القديمة أخيرًا. AbortController يلغي العمل، ومعرف الطلب يسمح بتجاهل نتيجة انتهى سياقها.', 'When a page is left or a filter changes quickly, an older response may finish last. AbortController cancels work, and request identity can discard obsolete results.', 'const controller = new AbortController();\nawait fetch(url, { signal: controller.signal });\n// controller.abort() when the view is no longer current.')],
    text('اكتب دالة async تجلب قائمة، تفحص response.ok، وتعرض حالات loading/error/empty منفصلة.', 'Write an async function that fetches a list, checks response.ok, and distinguishes loading, error, and empty states.'),
    text('ابدأ بإظهار loading؛ استخدم finally لإعادة الواجهة إلى حالة غير معلّقة.', 'Show loading first; use finally to leave the pending state.'),
    'async function loadItems(url, signal) {\n  const response = await fetch(url, { signal });\n  if (!response.ok) throw new Error(`HTTP ${response.status}`);\n  return response.json();\n}',
    [jsFunctionRule('js-i-fetch-function','loadItems','اجمع الطلب غير المتزامن في دالة.','Encapsulate the asynchronous request in a function.'),jsCallRule('js-i-fetch','fetch','استخدم Fetch للحصول على بيانات.','Use Fetch to request data.'),jsIfRule('js-i-http','افحص استجابة HTTP قبل تحليل البيانات.','Check the HTTP response before parsing data.')]),
  lesson('js-i-modules', 'javascript-fundamentals', 'intermediate', 5,
    text('تقسيم التطبيق واختباره', 'Split and test a small application'),
    text('افصل نموذج البيانات عن العرض، ومرّر الاعتمادات صراحة لتسهيل الاختبارات.', 'Separate the data model from rendering and pass dependencies explicitly to make tests easier.'),
    [section('كل وحدة لها مسؤولية واحدة', 'Give each module one responsibility', 'يمكن لوحدة التخزين أن تتحقق من البيانات وتحفظها، بينما تقوم وحدة العرض بإنشاء DOM، وتربط وحدة التطبيق الأحداث بينهما. تجنب دورات الاستيراد والاعتماد على متغيرات عالمية.', 'A storage module can validate and save data, a view module can create DOM, and the application module can connect events. Avoid circular imports and hidden globals.', 'export function normalizeTask(value) {\n  return { id: String(value.id), title: String(value.title).trim() };\n}'),section('اختبر السيناريو قبل التفاصيل', 'Test the scenario before implementation details', 'اكتب اختبارًا لإضافة عنصر صالح، ورفض نص فارغ، واستعادة JSON تالف. اجعل الاختبار حتميًا وامسح الحالة بين الحالات كي لا يعتمد على تشغيل سابق.', 'Test adding a valid item, rejecting blank text, and restoring corrupt JSON. Keep tests deterministic and reset state between cases so they do not depend on earlier runs.', 'import { describe, it, expect } from "vitest";')],
    text('اقترح ثلاثة ملفات: model.js وview.js وapp.js، واكتب دالة تطبيع صغيرة مع حالتي اختبار.', 'Plan model.js, view.js, and app.js, then write one small normalization function with two test cases.'),
    text('اختبر المدخل الفارغ والحالة الصحيحة؛ لا تختبر التنفيذ الداخلي فقط.', 'Test both a valid value and an empty input; focus on behavior, not only internals.'),
    'export function normalizeTitle(value) {\n  return typeof value === "string" ? value.trim() : "";\n}\n// Add tests for valid, blank, and non-string input.',
    [jsFunctionRule('js-i-normalize','normalizeTitle','اكتب دالة تطبيع صغيرة وواضحة.','Write a small, explicit normalization function.'),jsIfRule('js-i-input-check','تعامل مع مدخل غير صالح قبل استخدامه.','Handle invalid input before using it.')]),
];

const htmlProfessional: JourneyLessonBase[] = [
  lesson('html-p-landmarks', 'html-fundamentals', 'professional', 1,
    text('دلالات متقدمة وعقود المكونات', 'Advanced semantics and component contracts'),
    text('أنشئ نمطًا ثابتًا للمناطق والمكوّنات مع أسماء سهلة الفهم والتنقل.', 'Create a consistent contract for regions and components with understandable names and navigation.'),
    [section('المناطق تخلق خريطة تنقل', 'Landmarks create a navigation map', 'تجنّب تكرار main، وسمّ مناطق nav المتعددة بأسماء مختلفة. استخدم article عندما يكون المحتوى مكتمل المعنى مستقلًا، وsection عندما تجمع موضوعًا بعنونته. افحص ترتيب العناوين كهيكل لا كأحجام شكلية.', 'Avoid duplicate main landmarks and distinguish multiple navigation regions with unique names. Use article for independently meaningful content and section for a titled thematic group. Treat heading order as structure, not visual sizing.', '<nav aria-label="Course sections">…</nav>'),section('عقد المكون يجب أن يظل أصليًا', 'Component contracts should remain native', 'المكوّن القابل لإعادة الاستخدام يحتاج أسماء حقول متوقعة وحالة فارغة وأخطاء قابلة للإعلان. فضّل button وdetails وdialog الأصلي بدل إعادة بناء سلوك لوحة المفاتيح يدويًا.', 'Reusable components need predictable field names, empty states, and announceable errors. Prefer native button, details, and dialog behavior over rebuilding keyboard behavior by hand.', '<button type="button" aria-expanded="false" aria-controls="filters">Filters</button>')],
    text('راجع هيكل صفحة إعدادات بها منطقتا nav، أقسام مترابطة، وحالة قابلة للطي باستخدام عناصر أصلية.', 'Audit a settings page with two navigation regions, related sections, and a disclosure built from native elements.'),
    text('اسأل: هل يستطيع قارئ الشاشة تسمية كل landmark والتنقل إليه بلا تخمين؟', 'Ask whether a screen reader can name and navigate each landmark without guessing.'),
    '<!doctype html>\n<html lang="en"><body><header></header><nav aria-label="Primary">…</nav><main><section aria-labelledby="preferences-title"><h1 id="preferences-title">Preferences</h1></section></main><footer></footer></body></html>',
    [htmlRule('html-p-main','main','استخدم landmark أساسيًا واضحًا.','Provide a clear primary landmark.'),htmlRule('html-p-nav-name','nav','سمّ منطقة التنقل.','Give the navigation region an accessible name.',{requiredAttributes:['aria-label']}),htmlRule('html-p-section','section','اربط القسم بعنوان واضح.','Associate the section with a clear heading.',{requiredAttributes:['aria-labelledby']}),htmlRule('html-p-details','details','فضّل عنصر details الأصلي للإفصاح.','Prefer native details for disclosure.')]),
  lesson('html-p-errors', 'html-fundamentals', 'professional', 2,
    text('استراتيجية أخطاء النماذج', 'Form error strategy'),
    text('أنشئ رسائل قابلة للتحديد والارتباط دون الاعتماد على اللون أو التركيز القسري.', 'Create errors that can be identified and associated without relying on color or forced focus.'),
    [section('اجمع ملخصًا ثم اربط الحقول', 'Summarize, then link each control', 'بعد الإرسال غير الصالح، اعرض قائمة مختصرة بالأخطاء مع روابط إلى الحقول، واضبط aria-invalid وaria-describedby على الموضع المتأثر. لا تغيّر القيمة المدخلة أو تخفِ رسائل الخطأ بعد أول تصحيح.', 'After invalid submission, show a concise summary with links to fields, and set aria-invalid and aria-describedby on affected controls. Do not erase entered values or hide errors at the first correction.', '<div role="alert" aria-labelledby="error-title">\n  <h2 id="error-title">Check these fields</h2>\n</div>'),section('التحقق لا يساوي التفويض', 'Validation is not authorization', 'قيود المتصفح مفيدة للوضوح لكنها قابلة للتجاوز. تحقّق من البيانات في الطرف الذي يملكها قبل إجراء ذي أثر، وأظهر رسالة لا تكشف تفاصيل داخلية أو أسرارًا.', 'Browser constraints improve usability but can be bypassed. Validate at the trusted owner before consequential actions, and never show internal details or secrets in user-facing errors.', '<input required aria-invalid="true" aria-describedby="email-error">')],
    text('أنشئ نموذج دفع تجريبيًا غير متصل مع ربط label ورسالة خطأ وملخص معلن.', 'Create an offline sample checkout form with associated labels, an error summary, and an announced field error.'),
    text('لا تجعل role=alert يعلن كل حرف أثناء الكتابة؛ أعلنه بعد محاولة الإرسال.', 'Do not make an alert announce every keystroke; announce it after submission.'),
    '<form><div id="errors" role="alert" aria-labelledby="error-title"><h2 id="error-title">Check your details</h2><a href="#email">Email is required</a></div><label for="email">Email</label><input id="email" required aria-invalid="true" aria-describedby="email-error"><p id="email-error">Enter a valid email.</p><button type="submit">Continue</button></form>',
    [htmlRule('html-p-error-summary','div','أضف ملخص خطأ معلنًا.','Provide an announced error summary.',{requiredAttributes:['role'],attributeValues:{role:'alert'}}),htmlRule('html-p-invalid','input','أشر إلى الحقل غير الصالح.','Mark the invalid control.',{requiredAttributes:['aria-invalid','aria-describedby']}),htmlRule('html-p-error-text','p','اربط رسالة الخطأ بمعرف الحقل.','Provide text associated with the invalid control.',{requiredAttributes:['id'],minimumTextLength:2}),htmlRule('html-p-form-label','label','أبق تسمية ظاهرة للحقل.','Keep a visible label for the control.',{requiredAttributes:['for']})]),
  lesson('html-p-enhancement', 'html-fundamentals', 'professional', 3,
    text('التحسين التدريجي والاعتماد على الأصل', 'Progressive enhancement and native behavior'),
    text('اجعل المحتوى والوظائف الأساسية متاحة قبل تحميل JavaScript.', 'Keep core content and actions usable before JavaScript loads.'),
    [section('ابدأ بالمحتوى الحقيقي', 'Start with real content', 'يجب ألا يكون أول محتوى مفيد مرهونًا بتنفيذ سكربت. اعرض حالة أولية مفهومة، واربط أزرار التحميل أو إعادة المحاولة بتنفيذ معلوم، واعزل الفشل في الميزة التي تحتاج JavaScript.', 'Do not make the first useful content depend on a script. Render an understandable initial state, connect loading and retry controls to clear actions, and contain failures to the feature that needs JavaScript.', '<noscript>This interactive preview needs JavaScript; the article remains available above.</noscript>'),section('روابط حقيقية وحالات واضحة', 'Use real links and clear states', 'الرابط يذهب إلى وجهة، والزر ينفذ إجراءً. عند فتح نافذة أو تغيير لوحة، أعلن الحالة الجديدة وضع التركيز في موضع مناسب مع طريقة عودة واضحة.', 'A link navigates; a button performs an action. When opening a dialog or changing a panel, announce the state and move focus appropriately with an explicit way back.', '<a href="/help">Read the help guide</a>')],
    text('حوّل عنصرين مبهمين إلى link أو button صحيحين، وأضف حالة لا تعتمد على JavaScript.', 'Replace two ambiguous controls with correct links or buttons, and provide one no-JavaScript state.'),
    text('عطّل JavaScript من أدوات المطور واختبر المسار الأساسي.', 'Disable JavaScript in developer tools and test the core path.'),
    '<main><h1>Resource guide</h1><p>Key information is available without scripts.</p><a href="/help">Read help</a><button type="button">Open filters</button><noscript>Filtering is unavailable without JavaScript.</noscript></main>',
    [htmlRule('html-p-native-link','a','استخدم رابطًا لوجهة تنقل حقيقية.','Use an anchor for navigation.',{requiredAttributes:['href'],minimumAttributeLengths:{href:2},minimumTextLength:2}),htmlRule('html-p-native-button','button','استخدم زرًا للإجراء داخل الصفحة.','Use a button for an in-page action.',{attributeValues:{type:'button'},minimumTextLength:2}),htmlRule('html-p-noscript','noscript','وضّح ما يتعطل دون JavaScript.','Explain what is unavailable without JavaScript.',{minimumTextLength:4})]),
  lesson('html-p-performance', 'html-fundamentals', 'professional', 4,
    text('أداء الوثيقة وبياناتها الوصفية', 'Document performance and metadata'),
    text('حافظ على عرض محتوى سريع ومفهوم، دون تحميل أولي زائد أو وصف مضلل.', 'Keep content fast and understandable without unnecessary initial downloads or misleading metadata.'),
    [section('اختَر موارد الصفحة بدقة', 'Choose page resources deliberately', 'حدّد أبعاد الصورة لتقليل القفزات، واستخدم أحجامًا مناسبة، ولا تحمّل صورة أسفل الصفحة مبكرًا. لا تضع preload على موارد لا تظهر في العرض الأول، وتحقق من أثر الخطوط على النص.', 'Set image dimensions to reduce layout shifts, choose appropriate sizes, and defer below-the-fold media. Do not preload resources that are not needed initially; check how fonts affect text rendering.', '<img src="map-640.webp" width="640" height="360" loading="lazy" alt="…">'),section('البيانات الوصفية عقد مشاركة', 'Metadata is a sharing contract', 'اجعل title ووصف الصفحة محددين ودقيقين. canonical وOpen Graph ليسا بديلًا عن محتوى مفيد، ويجب ألا يصفا صفحة أو لغة مختلفة عن المعروضة.', 'Keep the title and description specific and accurate. Canonical and Open Graph metadata do not replace useful content and must describe the page and locale being shown.', '<meta name="description" content="Field notes about accessible service design">')],
    text('افحص صفحة مقالة وسجّل أثر صورها وعنوانها ووصفها ومصادر الخطوط على العرض الأول.', 'Audit an article page’s images, title, description, and font resources for their impact on initial rendering.'),
    text('ابدأ بالأصول الأكبر والمرئية، واستخدم قياسات الأداء بدل التخمين.', 'Start with the largest visible assets and measure performance rather than guessing.'),
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Field notes</title><meta name="description" content="Field notes about accessible service design"></head><body><img src="map-640.webp" width="640" height="360" alt="Map of the route" loading="lazy"></body>',
    [htmlDocRule('html-p-title','title',undefined,'أضف عنوانًا يصف المحتوى.','Provide a descriptive title.'),htmlDocRule('html-p-viewport','viewport',undefined,'أضف إعداد viewport مناسبًا.','Set a suitable viewport.'),htmlRule('html-p-sized-image','img','ثبّت مساحة الصورة بعرض وارتفاع.','Reserve image space with width and height.',{requiredAttributes:['width','height','alt']}),htmlRule('html-p-description','meta','أضف وصفًا دقيقًا لا مكررًا.','Add an accurate, non-duplicative description.',{attributeValues:{name:'description'},minimumAttributeLengths:{content:20}})]),
  lesson('html-p-audit', 'html-fundamentals', 'professional', 5,
    text('مراجعة الجودة والامتثال', 'Quality and conformance review'),
    text('راجع صفحة للإتاحة والفهرسة وقابلية الصيانة مع فصل الملاحظات عن الحلول.', 'Audit accessibility, indexing, and maintainability while separating observations from fixes.'),
    [section('أجرِ مراجعة قابلة للتكرار', 'Make the audit repeatable', 'سجّل مسار لوحة المفاتيح والعناوين واسماء الروابط والنماذج، ثم اختبر قارئ شاشة واحدًا على الأقل عند الضرورة. أدوات الفحص الآلي تلتقط أنواعًا من المشكلات ولا تثبت إتاحة التجربة كاملة.', 'Record keyboard order, headings, link names, and forms; test with at least one screen reader when appropriate. Automated audits find classes of issues but cannot certify the entire experience.', 'Checklist: keyboard → headings → labels → status messages → zoom.'),section('وثّق القرار لا النتيجة فقط', 'Document the decision, not only the score', 'وثّق معيار القبول والأثر المعروف والخطر المتبقي ومسؤولية المتابعة. افصل النصوص التي تظهر للمستخدم عن الملاحظات الداخلية، ولا تخزن أسرارًا أو سجلات شخصية في HTML.', 'Document acceptance criteria, known impact, remaining risk, and ownership. Separate user-facing copy from internal notes, and never store secrets or personal records in HTML.', '<main><h1>Review findings</h1><ol><li>Observed issue</li><li>Impact and planned fix</li></ol></main>')],
    text('أنشئ صفحة نتائج مراجعة بها عناوين مرتبة وقائمة نقاط قابلة للتتبع ومصدر مسؤول.', 'Create an audit findings page with ordered headings, trackable findings, and an accountable owner.'),
    text('اختبر لوحة المفاتيح وتكبير 200٪ قبل اعتماد النتيجة الآلية.', 'Test keyboard access and 200% zoom before accepting automated results.'),
    '<main><h1>Accessibility review</h1><section aria-labelledby="findings"><h2 id="findings">Findings</h2><ol><li>Observed issue and impact</li><li>Fix owner and target date</li></ol></section></main>',
    [htmlRule('html-p-audit-main','main','اجعل نتائج المراجعة داخل main.','Put audit findings inside main.'),htmlRule('html-p-audit-order','ol','رتّب النتائج حسب الأولوية.','Order findings by priority.',{minimumCount:1}),htmlRule('html-p-audit-owner','li','وثّق أثرًا أو مسؤول متابعة لكل نقطة.','Document impact or follow-up for each item.',{minimumTextLength:15})]),
];

const cssProfessional: JourneyLessonBase[] = [
  lesson('css-p-cascade', 'css-fundamentals', 'professional', 1,
    text('أنظمة cascade قابلة للتوسع', 'Scalable cascade systems'),
    text('صمّم طبقات ومحدّدات تقلل المفاجآت عند تركيب المكونات والأنماط.', 'Design layers and selectors that reduce surprises as components and styles are composed.'),
    [section('حدّد ترتيب الطبقات بوضوح', 'Declare layer order explicitly', 'ترتيب @layer يضع سياسة أولوية عامة؛ في التصريحات العادية تتقدم القواعد غير المصنفة على القواعد المصنفة، بينما ينعكس ترتيب أولوية الطبقات لتصريحات !important. وثّق أين توضع الإضافات ولا تخلط utilities مع أساس المكوّن.', 'The @layer order establishes a broad precedence policy: for normal declarations, unlayered rules outrank layered rules; important declarations reverse layer precedence. Document where additions belong and keep utilities separate from component foundations.', '@layer reset, tokens, base, components, utilities, overrides;\n@layer base { :where(.dialog) { color: #24364a; } }\n@layer components { .dialog { display: grid; color: #a33; } }'),section('خفّف الخصوصية عند نقطة التوسع', 'Lower specificity at extension points', ':where() مفيد في قواعد الأساس كي تكون سهلة التخصيص، و:is() يرث أعلى خصوصية ضمن بدائله. استخدم @scope أو نطاق حاوية عندما يمنع التسريب بين أجزاء التطبيق.', ':where() keeps foundation rules easy to override; :is() inherits the highest specificity of its alternatives. Use @scope or a bounded container when it prevents cross-component leakage.', '@layer base { :where(h1, h2, h3) { line-height: 1.15; } }')],
    text('عرّف نظام طبقات للتطبيق واكتب قاعدة أساس منخفضة الخصوصية ومكوّنًا محدود النطاق.', 'Define application layers and add a low-specificity base rule plus a scoped component style.'),
    text('تحقق من ترتيب الطبقات قبل محاولة إضافة محدد أطول أو !important.', 'Inspect layer order before lengthening a selector or adding !important.'),
    '/* TODO: declare ordered layers */\n@layer base { :where(h1, h2, h3) { /* TODO: low-specificity base */ } }\n@layer components { .dialog { /* TODO: component style */ } }',
    [
      { id: 'css-p-layer-order', type: 'css-layer-order', layers: ['base', 'components'], label_ar: 'أعلن ترتيب طبقة الأساس والمكوّن.', label_en: 'Declare the base and component layer order.', note_ar: 'فحص ترتيب ساكن؛ اختبر computed styles يدويًا.', note_en: 'Static order check; verify computed styles manually.' },
      { id: 'css-p-layer-base', type: 'css-declaration', target: ':where(h1, h2, h3)', property: 'line-height', value: '1.15', layer: 'base', label_ar: 'أضف قاعدة الأساس منخفضة الخصوصية.', label_en: 'Add the low-specificity base declaration.', note_ar: 'يفحص المحدد والتصريح وطبقة base.', note_en: 'Checks selector, declaration, and base layer.' },
      { id: 'css-p-layer', type: 'css-declaration', target: '.dialog', property: 'display', value: 'grid', layer: 'components', label_ar: 'ضع تنسيق المكوّن داخل طبقة components.', label_en: 'Place the component style in the components layer.', note_ar: 'وجود display:grid وحده لا يكفي إذا كان خارج طبقة المكوّن.', note_en: 'display:grid alone is insufficient when it is outside the component layer.' },
    ]),
  lesson('css-p-layout', 'css-fundamentals', 'professional', 2,
    text('Container queries وتخطيطات كثيفة', 'Container queries and dense layouts'),
    text('اجعل المكوّن يتكيف مع المساحة المتاحة له بدل الاعتماد الكامل على عرض النافذة.', 'Let components respond to their available container rather than relying only on viewport width.'),
    [section('استعلم عن الحاوية', 'Query the container', 'استخدم container-type وحدًا منطقيًا قبل @container. هذا يسمح بتبديل ترتيب مكوّن بطاقة عندما يضيق موضعها داخل لوحة، حتى لو بقيت النافذة عريضة. يجب أن يكون العنصر شبكة أصلًا كي يؤثر grid-template-columns في تخطيطه.', 'Set container-type and a sensible inline size before @container. A card can then rearrange inside a narrow sidebar even when the overall viewport remains wide. The card must already be a grid for grid-template-columns to affect its layout.', '.card-region { container-type: inline-size; }\n.card { display: grid; grid-template-columns: minmax(0, 1fr) auto; }\n@container (max-width: 32rem) { .card { grid-template-columns: 1fr; } }'),section('Subgrid يشارك المسارات', 'Subgrid shares tracks', 'يستخدم العنصر الابن مسارات شبكة الأب نفسها بعد تعريفها؛ لا ينشئ subgrid شبكة مستقلة ولا يعمل بلا سياق grid مناسب.', 'A child can reuse its parent grid tracks after the parent defines them; subgrid does not create an independent grid and needs a suitable grid context.', '.card-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }\n.card { grid-column: span 2; display: grid; grid-template-columns: subgrid; }')],
    text('صمّم بطاقة تتغير داخل حاوية جانبية ضيقة، ثم اختبرها ضمن مساحة مضمّنة لا نافذة كاملة.', 'Design a card that adapts in a narrow sidebar container, then test it embedded rather than only at full-window width.'),
    text('استخدم أدوات المطور لتغيير عرض الحاوية مع تثبيت عرض النافذة.', 'Use developer tools to resize the container while keeping the viewport fixed.'),
    '.card-region { /* TODO: establish an inline-size query container */ }\n.card { display: grid; grid-template-columns: minmax(0, 1fr) auto; }\n@container (max-width: 32rem) { .card { /* TODO: switch to one column */ } }',
    [
      { id: 'css-p-container-type', type: 'css-declaration', target: '.card-region', property: 'container-type', value: 'inline-size', label_ar: 'عرّف الحاوية للاستعلام عن عرضها.', label_en: 'Define the container whose inline size will be queried.', note_ar: 'فحص ساكن للتصريح على الحاوية.', note_en: 'Static check for the container declaration.' },
      { id: 'css-p-card-grid', type: 'css-declaration', target: '.card', property: 'display', value: 'grid', label_ar: 'أنشئ شبكة البطاقة قبل تغيير أعمدتها.', label_en: 'Establish the card grid before changing its columns.', note_ar: 'يفحص وجود display:grid ولا يثبت تخطيطًا مرئيًا في المتصفح.', note_en: 'Checks for display:grid; it does not prove rendered layout in a browser.' },
      { id: 'css-p-container', type: 'css-declaration', target: '.card', property: 'grid-template-columns', value: '1fr', valueAlternatives: ['minmax(0, 1fr)'], container: '(max-width: 32rem)', label_ar: 'غيّر تخطيط البطاقة داخل استعلام الحاوية المحدد.', label_en: 'Change the card layout inside the specified container query.', note_ar: 'هذا فحص ساكن لسياق @container والتصريح، وليس محاكاة لعرض الحاوية وقت التشغيل.', note_en: 'This statically checks the @container context and declaration; it does not simulate runtime container sizing.' },
    ]),
  lesson('css-p-theme', 'css-fundamentals', 'professional', 3,
    text('معمارية design tokens والسمات', 'Design-token and theme architecture'),
    text('فصل المعنى عن القيمة يسمح بسمات متناسقة دون تكرار ألوان عشوائية.', 'Separating meaning from value enables coherent themes without scattered literal colors.'),
    [section('استخدم طبقتين من الرموز', 'Use two token layers', 'اربط الرموز الدلالية مثل surface-raised وtext-muted بقيم الألوان الأساسية. المكونات تستهلك الرمز الدلالي فقط؛ وتبديل السمة يغيّر التعريفات لا كل مكوّن.', 'Map semantic tokens such as surface-raised and text-muted to palette values. Components consume semantic tokens; themes change definitions rather than every component.', ':root { --palette-slate-900: #101820; --surface-raised: var(--palette-slate-900); }'),section('اختبر السمة مع المحتوى الحقيقي', 'Test themes with real content', 'تحقق من التباين وحالات التركيز والحدود والرسائل في كل سمة. لا يكفي تبديل الخلفية؛ يجب أن تظل عناصر الحالة ومخططات التركيز مفهومة.', 'Check contrast, focus states, borders, and messages in every theme. Changing only the background is insufficient; state indicators and focus outlines must remain understandable.', '[data-theme="light"] { --surface-raised: #fff; --text-primary: #15202b; }')],
    text('أنشئ رموزًا أساسية ودلالية، ثم اربط مكوّنًا واحدًا لا يعتمد مباشرة على لون سداسي.', 'Create palette and semantic tokens, then style a component without embedding literal hex values.'),
    text('ابحث عن تكرار قيم اللون والمساحة؛ التجميع الدلالي أنفع من تسمية الرمز بلونه فقط.', 'Search for repeated color and spacing literals; semantic names age better than color-only names.'),
    ':root { --palette-ink: #16202a; --surface-raised: var(--palette-ink); --text-primary: #fff; }\n.card { background: var(--surface-raised); color: var(--text-primary); }',
    [cssRule('css-p-token',' .card','background','var(--surface-raised)','استهلك رمزًا دلاليًا من المكوّن.','Consume a semantic token in the component.')]),
  lesson('css-p-accessibility', 'css-fundamentals', 'professional', 4,
    text('تباين وتركيز وإعدادات النظام', 'Contrast, focus, and user preferences'),
    text('تعامل مع أوضاع الألوان والحركة والوضوح العالي كجزء من عقد الواجهة.', 'Treat color schemes, motion, and high-contrast modes as part of the interface contract.'),
    [section('لا تجعل اللون هو الإشارة الوحيدة', 'Never make color the only signal', 'أضف نصًا أو شكلًا أو أيقونة إلى لون الخطأ أو النجاح. اختبر النص الصغير والحدود والحالة المركزة في السمات الفعلية ومع نمط forced-colors عند الحاجة.', 'Pair error and success colors with text, shape, or iconography. Test small text, borders, and focused state in real themes and forced-colors when applicable.', '@media (forced-colors: active) { .status { border: 1px solid CanvasText; } }'),section('الحركة تفضيل وليست شرطًا', 'Motion is a preference, not a requirement', 'قلل الحركة المستمرة وانتقالات المساحات الكبيرة. استخدم prefers-reduced-motion لتجاوز الحركة، واحذر من إيقافها بطريقة تمنع المستخدم من معرفة تغيّر الحالة.', 'Avoid continuous motion and large spatial transitions. Use prefers-reduced-motion to reduce it without hiding state changes from users.', '@media (prefers-reduced-motion: reduce) { .panel { scroll-behavior: auto; } }')],
    text('أضف مؤشرات focus-visible وforced-colors وأزل حركة واجهة غير ضرورية عند تفضيل تقليل الحركة.', 'Add focus-visible and forced-colors treatments, and remove unnecessary motion when reduced motion is preferred.'),
    text('افحص التركيز والتباين عند وضع forced-colors؛ لا تعتمد على shadow وحده.', 'Inspect focus and contrast in forced-colors; do not rely on box-shadow alone.'),
    '@media (forced-colors: active) { .status { border: 1px solid CanvasText; } }\n@media (prefers-reduced-motion: reduce) { .panel { scroll-behavior: auto; } }\nbutton:focus-visible { outline: 3px solid currentColor; }',
    [cssRule('css-p-focus','button:focus-visible','outline-style','solid','أظهر مؤشر تركيز لا يعتمد على الظل.','Provide a focus indicator that is not shadow-only.'),cssMediaRule('css-p-motion','prefers-reduced-motion','أضف مسار تقليل للحركة.','Provide a reduced-motion path.')]),
  lesson('css-p-performance', 'css-fundamentals', 'professional', 5,
    text('أداء CSS والتشخيص المنهجي', 'CSS performance and systematic debugging'),
    text('قلل الأنماط غير المستخدمة وسجّل دليلًا على أن التغيير حسن العرض.', 'Reduce unused styling and collect evidence that a change improves rendering.'),
    [section('ابدأ بالقياس', 'Start with measurement', 'راقب إعادة التخطيط والرسم وإدراج الأنماط قبل تغيير الشيفرة. خصائص التغيير الهندسي أو الحركة قد تكون أعلى كلفة من اللون والتحويل؛ لكن مقدار الأثر يعتمد على السياق والجهاز.', 'Inspect layout, paint, and style recalculation before changing code. Geometric and animated layout changes may cost more than color or transform, but impact depends on context and device.', '/* Prefer a measured transform for a small decorative transition. */'),section('حسّن دون إخفاء المحتوى', 'Optimize without hiding content', 'content-visibility:auto قد يؤخر رسم جزء بعيد، لكنه لا يغني عن اختبار التمرير والطباعة وتحديد النص. اجمع قياسًا على جهاز بطيء مع فحص متانة التخطيط وتكبير النص.', 'content-visibility:auto can defer rendering distant regions, but does not replace testing scroll, print, and text selection. Pair a slow-device measurement with layout resilience and text zoom checks.', '.long-section { content-visibility: auto; contain-intrinsic-size: auto 40rem; }')],
    text('وثّق مشكلة عرض واحدة وخطوات إعادة إنتاجها ثم تعديلًا محدودًا وقياسًا بعده.', 'Document one rendering issue, reproduction steps, a focused change, and a measurement after it.'),
    text('اختبر قبل وبعد على ملف محتوى كبير وجهاز بطيء، وتأكد من أن التخمين لم يتحول إلى قاعدة.', 'Compare before and after with long content on a slower device; do not turn an untested guess into a rule.'),
    '.long-section { content-visibility: auto; contain-intrinsic-size: auto 40rem; }\n@media print { .toolbar { display: none; } }',
    [cssRule('css-p-content-visibility','.long-section','content-visibility','auto','أجّل رسم المحتوى الطويل عند ملاءمة القياس.','Defer long-section rendering when measurement supports it.')]),
];

const jsProfessional: JourneyLessonBase[] = [
  lesson('js-p-modules', 'javascript-fundamentals', 'professional', 1,
    text('حدود الوحدات والاعتماد الصريح', 'Module boundaries and explicit dependencies'),
    text('اجعل واجهات الوحدات صغيرة وقلل الاعتماد الخفي بين الحالة والعرض.', 'Keep module interfaces small and reduce hidden coupling between state and view.'),
    [section('تصدير الواجهة لا تفاصيل التنفيذ', 'Export the interface, not every detail', 'اختر exports مسماة عندما يحتاج المستهلك أكثر من عقد، واستخدم export default عندما توجد مسؤولية واحدة واضحة. تجنب وحدة تعتمد على عنصر DOM عالمي يصعب استبداله في الاختبار.', 'Use named exports when consumers need several contracts and a default export for one clear responsibility. Avoid modules that capture a global DOM node that is hard to replace in tests.', 'export function createTaskStore(storage) {\n  return { load() { /* … */ }, save(items) { /* … */ } };\n}'),section('اكشف الاعتماد عند الإنشاء', 'Expose dependencies at construction', 'تمرير storage أو fetch يسهّل الاختبار ويجعل أثر الوحدة معلومًا. لا تضف طبقة تجريد لمجرد وجود وحدات؛ اجعل الواجهة تخدم نقطة تبديل أو اختبار حقيقية.', 'Passing storage or fetch makes dependencies testable and visible. Do not add abstraction merely because modules exist; make the interface serve a real seam.', 'export function createLoader(fetcher) { return async url => fetcher(url); }')],
    text('قسّم مسؤوليات العرض والتخزين وبيانات API، ومرّر اعتمادًا واحدًا كوسيط بدل استخدام global مباشرة.', 'Separate view, storage, and API data responsibilities; pass one dependency instead of using a global directly.'),
    text('ارسم أسهم الاعتماد أولًا وتجنب استيرادًا دائريًا.', 'Draw the dependency arrows first and avoid circular imports.'),
    'export function createTaskStore(storage) {\n  return {\n    load() { return storage.getItem("tasks"); },\n    save(value) { storage.setItem("tasks", value); }\n  };\n}',
    [jsFunctionRule('js-p-store','createTaskStore','أنشئ حدود وحدة قابلة للاختبار.','Create a testable module boundary.'),jsCallRule('js-p-storage','storage.getItem','مرّر التخزين بدل إخفاء الاعتماد.','Pass storage instead of hiding the dependency.')]),
  lesson('js-p-async', 'javascript-fundamentals', 'professional', 2,
    text('تنسيق async وأخطاء محددة', 'Async orchestration and typed failure paths'),
    text('حدّد ملكية الطلب والإلغاء وإعادة المحاولة ومعنى كل خطأ.', 'Define request ownership, cancellation, retry policy, and the meaning of each failure.'),
    [section('لا تعِد كل شيء تلقائيًا', 'Do not retry everything blindly', 'ميّز خطأ الاتصال عن 4xx القابل للحل وخطأ 5xx المؤقت. أعد المحاولة فقط عندما تكون العملية آمنة أو تملك مفتاح idempotency، وأضف حدًا وزمنًا تصاعديًا.', 'Distinguish connection failures from actionable 4xx and transient 5xx errors. Retry only when safe or protected by idempotency, and add a bound and backoff.', 'if (response.status === 429) { /* respect Retry-After and a bounded policy */ }'),section('ألغِ الطلبات القديمة', 'Cancel obsolete work', 'اربط AbortController بعمر الواجهة أو بمعرف الطلب الحالي. لا تعرض رسالة فشل لإلغاء متوقع أثناء مغادرة الصفحة، وحرّر المستمعين والمؤقتات عند الانتهاء.', 'Bind AbortController to the view lifecycle or current request identity. Do not show expected navigation cancellation as an error; clean up listeners and timers.', 'const controller = new AbortController();\ntry { await fetch(url, { signal: controller.signal }); }\ncatch (error) { if (error.name !== "AbortError") throw error; }')],
    text('اكتب تدفقًا async يفحص response.ok ويعالج AbortError منفصلًا عن فشل الخادم.', 'Write an async flow that checks response.ok and handles AbortError separately from server failure.'),
    text('ضع حالة التحميل في finally وتأكد أن طلبًا قديمًا لا يستبدل نتيجة أحدث.', 'Reset pending state in finally and ensure an older request cannot replace a newer result.'),
    'async function loadData(url, signal) {\n  try {\n    const response = await fetch(url, { signal });\n    if (!response.ok) throw new Error(`HTTP ${response.status}`);\n    return await response.json();\n  } catch (error) {\n    if (error.name === "AbortError") return null;\n    throw error;\n  }\n}',
    [jsFunctionRule('js-p-async-function','loadData','استخدم دالة async ذات نتيجة واضحة.','Use an async function with a clear result.'),jsCallRule('js-p-fetch','fetch','مرّر AbortSignal إلى الطلب.','Pass an AbortSignal to the request.'),jsIfRule('js-p-abort','ميّز الإلغاء المتوقع عن الخطأ الحقيقي.','Distinguish expected cancellation from a real failure.')]),
  lesson('js-p-resilience', 'javascript-fundamentals', 'professional', 3,
    text('تطبيع البيانات واستعادة الحالة', 'Normalize data and recover state'),
    text('تحقق من البيانات على الحدود، واكتب مسار استعادة يمكن اختباره.', 'Validate data at boundaries and make recovery behavior testable.'),
    [section('الثقة تنتهي عند الحد', 'Trust ends at the boundary', 'بيانات localStorage وAPI وform هي قيم غير موثوقة. تحقق من النوع والمجال والحد الأقصى للحجم قبل إدخالها للحالة، واستخدم نصوص DOM بدل innerHTML مع المحتوى المدخل.', 'localStorage, API, and form data are untrusted. Check type, range, and size before adding them to state; use DOM text APIs rather than innerHTML for user input.', 'if (!Array.isArray(value)) return { records: [], rejected: [{ raw: value, reason: "expected-array" }] };'),section('التعافي يجب أن يحافظ على الخدمة', 'Recovery should preserve service', 'إذا فشل تحليل نسخة مخزنة، احتفظ بالنسخة الخام أو وفّر تنزيلًا للتشخيص قبل استبدالها. اعرض حالة يمكن للطالب إصلاحها، ولا تمسح البيانات بصمت عند ترقية مخطط.', 'If stored data fails parsing, retain the raw value or offer a diagnostic export before replacing it. Show a recoverable state, and do not silently erase data during schema upgrades.', 'try { return JSON.parse(raw); } catch (error) { return { ok: false, raw, reason: "invalid-json" }; }')],
    text('صمّم normalizeTasks لتتحقق من أن كل سجل له id وtitle نصيان غير فارغين، وتعيد records وrejected كي لا تضيع أسباب الرفض.', 'Design normalizeTasks to require non-empty string id and title fields and return both records and rejected entries so rejection reasons are not lost.'),
    text('عامل عناصر القائمة على أنها بيانات لا تعليمات؛ لا تكتفِ بفلترة صامتة ولا تُرجع مصفوفة فارغة عند شكل إدخال غير متوقع.', 'Treat entries as data, not instructions; do not silently filter or return an empty list for an unexpected input shape.'),
    'function normalizeTasks(value) {\n  // TODO: return { records, rejected }; preserve each rejected raw item and its reason.\n}',
    [{ id: 'js-p-normalize', type: 'js-function-contract', functionName: 'normalizeTasks', requiredCalls: ['Array.isArray', 'value.forEach'], requiredMembers: ['item.id', 'item.title', 'item.id.trim', 'item.title.trim'], requiredStrings: ['expected-array', 'invalid-record'], requiredReturnObjectKeys: ['records', 'rejected'], requiredObjectProperties: [{ key: 'raw', valueVariable: 'item' }, { key: 'reason', value: 'expected-array' }, { key: 'reason', value: 'invalid-record' }], label_ar: 'تحقق من شكل السجلات وأعد المقبول والمرفوض مع السبب والقيمة الخام.', label_en: 'Validate record shape and return accepted/rejected records with reasons and raw values.', note_ar: 'الفحص الساكن يطلب حقولًا وعقد النتيجة؛ لا ينفذ الشيفرة ولا يثبت مخرجات كل إدخال.', note_en: 'Static checking requires fields and a result contract; it does not execute code or prove each output.' }]),
  lesson('js-p-performance', 'javascript-fundamentals', 'professional', 4,
    text('قياس الأداء وسلاسة الواجهة', 'Measure performance and interaction cost'),
    text('ابدأ بقياس موضع العمل المكلف ثم خفّضه دون تخزين حالة مشتقة بلا حاجة.', 'Measure the expensive work first, then reduce it without caching derived state unnecessarily.'),
    [section('حدد عنق الزجاجة', 'Find the bottleneck', 'قارن عدد عقد DOM وتكلفة البحث وإعادة العرض عند حجم واقعي. استخدام map لا يضمن السرعة؛ تعقيد الخوارزمية وطول العمل المتزامن قد يكونان أهم.', 'Compare DOM nodes, lookup cost, and rendering at realistic scale. Using map does not guarantee speed; algorithmic complexity and long synchronous work may matter more.', 'const indexById = new Map(items.map(item => [item.id, item]));'),section('جزّئ العمل والتغييرات', 'Chunk work and changes', 'اجمع تحديثات DOM بدل تغيير كل عقدة أثناء كل دورة. استخدم DocumentFragment أو تحديثًا محدودًا، وألغِ الاشتراك عند إخفاء المكوّن. اختبر مع لوحة المفاتيح أثناء تحسين العرض.', 'Batch DOM changes rather than mutating every node each iteration. Use a fragment or targeted update and unsubscribe when a component is removed. Keep keyboard interaction in the performance test.', 'const fragment = document.createDocumentFragment();\nfragment.append(node);\nlist.replaceChildren(fragment);')],
    text('اكتب خطة قياس قبل تحسين قائمة طويلة، ثم استخدم Map لربط معرفات العناصر بمعلوماتها.', 'Write a measurement plan before optimizing a long list, then use Map to access records by id.'),
    text('قارن البيانات على الهاتف أو CPU بطيء وسجّل النتيجة قبل/بعد.', 'Compare on a phone or throttled CPU and record before/after results.'),
    'const byId = new Map(items.map(item => [item.id, item]));\nfunction findTask(id) { return byId.get(id); }',
    [jsFunctionRule('js-p-find','findTask','عزل عملية الوصول يسهل قياسها.','Isolate the lookup so it can be measured.'),jsCallRule('js-p-map','Map','استخدم بنية مناسبة للوصول بالمفتاح.','Choose a keyed structure for repeated lookups.')]),
  lesson('js-p-tests', 'javascript-fundamentals', 'professional', 5,
    text('اختبارات متعددة الطبقات وقرار الإصدار', 'Layered tests and release decisions'),
    text('غطّ الدوال وحالات المستخدم ثم افصل الاختبار الآلي عن المراجعة اليدوية.', 'Cover helpers and user flows, then separate automated tests from manual review.'),
    [section('اكتب اختبارًا يثبت سلوكًا', 'Test observable behavior', 'اختبر الحدود المهمة: قائمة فارغة، نص غير صالح، فشل التخزين، فشل الشبكة، وإلغاء طلب. اجعل كل اختبار مستقلًا عن ترتيب التنفيذ، ولا تتصل بخدمة حقيقية في الاختبارات الوحدوية.', 'Cover important boundaries: empty lists, invalid text, unavailable storage, network failure, and cancellation. Keep tests order-independent and do not call real services in unit tests.', 'it("rejects an empty title", () => { expect(normalizeTitle("  ")).toBe(""); });'),section('ادمج الدليل مع مراجعة الوصول', 'Combine evidence with accessibility review', 'اختبارات DOM لا تثبت جودة قارئ الشاشة وحدها. أضف فحصًا يدويًا لمسار لوحة المفاتيح، والتباين، وتكبير النص، والاتجاهين، ثم وثّق ما جرى اختباره وما لم يجر.', 'DOM tests do not prove screen-reader quality on their own. Add a manual review of keyboard path, contrast, zoom, and both directions, then document what was and was not tested.', '# Validation notes\n- Unit tests: …\n- Manual keyboard review: …')],
    text('اكتب اختبارين لسلوك التطبيع واختبارًا لمحاكاة تخزين يفشل، ثم دوّن خطوات تشغيلها.', 'Write two normalization tests and one simulated storage-failure test, then document how to run them.'),
    text('تحقق من الحالة السلبية ومن تنظيف البيانات بين الاختبارات.', 'Cover negative behavior and reset test data between cases.'),
    'import { describe, it, expect } from "vitest";\ndescribe("normalizeTitle", () => {\n  it("trims useful input", () => expect(normalizeTitle(" task ")).toBe("task"));\n  it("rejects blank input", () => expect(normalizeTitle("  ")).toBe(""));\n});',
    [jsFunctionRule('js-p-test-helper','normalizeTitle','اختبر وحدة صغيرة قابلة للتوقع.','Test a small predictable unit.'),jsCallRule('js-p-test-runner','expect','أضف توقعًا صريحًا للنتيجة.','Add an explicit assertion for the result.')]),
];

const assessments: Record<JourneyLevel, Record<FoundationPathId, JourneyQuestion[]>> = {
  intermediate: {
    'html-fundamentals': [
      question('html-i-q1','ما العنصر المناسب لمحتوى مستقل يمكن فهمه خارج موضعه؟','Which element suits self-contained content that can stand apart from its location?',[['article','article'],['span','span'],['b','b'],['br','br']],'a','article مناسب للمحتوى المستقل.','article is appropriate for independently meaningful content.'),
      question('html-i-q2','ما الاستخدام الأنسب لـ scope في الجدول؟','What is the best use of scope in a table?',[['توضيح علاقة الرأس بالصف أو العمود','Clarify whether a header applies to a row or column'],['إخفاء الجدول','Hide the table'],['تغيير لون الخلية','Change a cell color'],['استبدال caption','Replace the caption']],'a','scope يحدد الاتجاه الدلالي للرأس.','scope communicates the header relationship.'),
      question('html-i-q3','هل placeholder بديل مناسب لـ label؟','Is a placeholder an adequate replacement for a label?',[['لا، قد يختفي ولا يحدد الحقل باستمرار','No; it may disappear and does not consistently name the control'],['نعم دائمًا','Yes, always'],['فقط على الهاتف','Only on phones'],['نعم عند إضافة لون','Yes when a color is added']],'a','احتفظ بتسمية مرتبطة بالحقل.','Keep a label associated with the control.'),
      question('html-i-q4','أي استراتيجية تساعد على تقليل كلفة الصور أسفل الطية؟','Which strategy helps reduce the cost of below-the-fold images?',[['loading="lazy" مع نص بديل مناسب','loading="lazy" with suitable alternative text'],['حذف alt','Remove alt'],['استخدام صورة ضخمة واحدة','Use one oversized image'],['إخفاء width وheight','Omit width and height']],'a','التأخير مناسب عادةً للصور البعيدة، مع حفظ أبعادها ووصفها.','Deferral is often suitable below the fold; keep dimensions and text alternatives.'),
      question('html-i-q5','ما فائدة رابط تجاوز المحتوى؟','What does a skip link provide?',[['يسمح بتجاوز التنقل المتكرر مباشرة إلى المحتوى','It lets users bypass repeated navigation and reach content'],['يمنع الروابط الخارجية','It blocks external links'],['يرتب الجداول','It sorts tables'],['يحمّل CSS','It loads CSS']],'a','رابط التجاوز يقلل التنقل المتكرر بلوحة المفاتيح.','A skip link reduces repeated keyboard navigation.'),
    ],
    'css-fundamentals': [
      question('css-i-q1','متى يكون Flexbox الاختيار الطبيعي؟','When is Flexbox a natural choice?',[['توزيع عناصر على محور أساسي واحد','Distributing items along one main axis'],['تحديد كل الخلايا في شبكة ثنائية الأبعاد','Defining a two-dimensional grid'],['كتابة محتوى HTML','Writing HTML content'],['التحقق من نموذج','Validating a form']],'a','Flexbox مناسب لتدفق صف أو عمود واحد.','Flexbox fits one-dimensional row or column flow.'),
      question('css-i-q2','لماذا تستخدم minmax(0, 1fr) أحيانًا؟','Why might you use minmax(0, 1fr)?',[['لتجنب فرض المحتوى الطويل عرضًا أدنى كبيرًا','To prevent long content from imposing a large minimum width'],['لتكبير كل الخطوط','To enlarge every font'],['لتشغيل JavaScript','To run JavaScript'],['لتثبيت عنصر في الشاشة','To pin an element to the viewport']],'a','الحد الصفري يسمح للمسار بالانكماش.','The zero minimum lets the track shrink.'),
      question('css-i-q3','أي وحدة تحترم عادة تكبير حجم النص الأساسي؟','Which unit typically respects changes to the root text size?',[['rem','rem'],['px فقط','px only'],['vw فقط','vw only'],['deg','deg']],'a','rem مرتبطة بحجم الخط الجذري.','rem is tied to the root font size.'),
      question('css-i-q4','ما المؤشر الذي لا ينبغي حذفه لمستخدم لوحة المفاتيح؟','Which indicator should not be removed for keyboard users?',[['focus-visible','focus-visible'],['hover','hover'],['transition','transition'],['shadow','shadow']],'a','يجب أن يبقى مؤشر التركيز واضحًا.','The focus indicator should remain visible.'),
      question('css-i-q5','ما المطلوب عند احترام تقليل الحركة؟','What should reduced-motion support do?',[['يقلل الحركة غير الضرورية مع بقاء الحالة مفهومة','Reduce unnecessary motion while keeping state understandable'],['يحذف المحتوى','Remove content'],['يعطل التباين','Disable contrast'],['يمنع التكبير','Prevent zoom']],'a','التقليل لا يعني إخفاء تغيّر الحالة.','Reduction should not hide state changes.'),
    ],
    'javascript-fundamentals': [
      question('js-i-q1','أي تركيب يختار العناصر ثم ينتج قائمة جديدة من قيمها؟','Which composition selects records then produces a new list of their values?',[['filter ثم map','filter then map'],['push ثم pop','push then pop'],['parse ثم stringify دائمًا','always parse then stringify'],['setTimeout ثم alert','setTimeout then alert']],'a','filter للاختيار وmap للتحويل.','filter selects and map transforms.'),
      question('js-i-q2','لماذا نستخدم event delegation؟','Why use event delegation?',[['للتعامل مع عناصر ديناميكية عبر مستمع على حاويتها','To handle dynamic children through a listener on their container'],['لإلغاء لوحة المفاتيح','To disable the keyboard'],['لمنع التحقق','To prevent validation'],['لإخفاء DOM','To hide the DOM']],'a','تفويض الأحداث يدعم عناصر أُنشئت لاحقًا.','Delegation supports elements created later.'),
      question('js-i-q3','ما الخطر في JSON.parse على قيمة مخزنة؟','What is a risk of JSON.parse on stored data?',[['قد يرمي استثناء إذا كانت القيمة تالفة','It may throw if the value is corrupt'],['يحوّلها إلى HTML آمن','It turns it into safe HTML'],['يرسلها إلى الخادم','It sends it to a server'],['يمسح التخزين تلقائيًا','It clears storage automatically']],'a','تحليل JSON يحتاج مسار استعادة.','JSON parsing needs a recovery path.'),
      question('js-i-q4','هل ترفض fetch تلقائيًا عند استجابة 404؟','Does fetch automatically reject on a 404 response?',[['عادة لا؛ افحص response.ok','Usually not; check response.ok'],['نعم دائمًا','Yes, always'],['فقط إذا استعملت map','Only when using map'],['لا يمكن أن يفشل','It cannot fail']],'a','أخطاء HTTP تتطلب فحصًا صريحًا.','HTTP errors require an explicit check.'),
      question('js-i-q5','ما الذي يجعل دالة أسهل للاختبار؟','What makes a function easier to test?',[['إدخال اعتمادها بدل الاعتماد على global خفي','Injecting its dependency instead of using a hidden global'],['الاعتماد على وقت النظام دائمًا','Always relying on system time'],['تعديل متغير عام','Mutating a global'],['إرسال طلب حقيقي لكل اختبار','Making a real request in every test']],'a','تمرير الاعتماد يجعل الاستبدال في الاختبار ممكنًا.','Passing a dependency makes it replaceable in tests.'),
    ],
  },
  professional: {
    'html-fundamentals': [
      question('html-p-q1','متى تستخدم aria بدل عنصر HTML أصلي؟','When should ARIA be used instead of native HTML?',[['عندما لا يوجد عنصر أصلي مناسب وبعد تحديد السلوك المطلوب','When no suitable native element exists and the required behavior is defined'],['دائمًا بدل button','Always instead of button'],['لإضافة ألوان','To add colors'],['لمنع التنقل','To prevent navigation']],'a','الأصل هو العنصر الدلالي الأصلي؛ ARIA لا ينشئ السلوك تلقائيًا.','Prefer native semantics; ARIA does not create behavior automatically.'),
      question('html-p-q2','ما الذي يجب أن يتضمنه مسار الخطأ المتاح؟','What should an accessible error path include?',[['رسالة نصية مرتبطة بالحقل وحالة يمكن اكتشافها','Text associated with the field and a discoverable state'],['لون أحمر فقط','Red color only'],['مسح القيمة','Clearing the value'],['إخفاء الرسالة بعد التركيز','Hiding the message on focus']],'a','اربط الرسالة بالحقل ولا تعتمد على اللون وحده.','Associate the message with the field; do not rely on color alone.'),
      question('html-p-q3','ما الهدف من progressive enhancement؟','What is the goal of progressive enhancement?',[['إبقاء المحتوى الأساسي مفيدًا قبل أو عند فشل JavaScript','Keeping core content useful before or when JavaScript fails'],['إزالة HTML','Removing HTML'],['إخفاء الصفحة عن محركات البحث','Hiding the page from search engines'],['فرض تحميل كل الصور','Forcing every image to load']],'a','المحتوى الأساسي لا ينبغي أن يعتمد على تنفيذ سكربت.','Core content should not depend on a script.'),
      question('html-p-q4','لماذا نحدد width وheight للصورة؟','Why specify image width and height?',[['لحجز مساحة وتقليل قفز التخطيط','To reserve space and reduce layout shifts'],['لتعطيل النص البديل','To disable alt text'],['لرفع دقة الهاتف','To increase phone resolution'],['لإنشاء metadata','To create metadata']],'a','الأبعاد تساعد المتصفح على حجز المساحة قبل التحميل.','Dimensions help the browser reserve space before loading.'),
      question('html-p-q5','هل تدقيق آلي ناجح يثبت الإتاحة الكاملة؟','Does a passing automated audit prove full accessibility?',[['لا، يلزم اختبار يدوي وسياقي أيضًا','No; manual and contextual testing is still needed'],['نعم دائمًا','Yes, always'],['إذا نجح على سطح المكتب فقط','If it passes on desktop only'],['إذا لم توجد صور','If there are no images']],'a','الآلي يلتقط فئات أخطاء ولا يثبت التجربة كاملة.','Automation finds classes of issues but cannot certify the whole experience.'),
    ],
    'css-fundamentals': [
      question('css-p-q1','ما فائدة ترتيب @layer صراحة؟','Why declare @layer order explicitly?',[['وضع سياسة أولوية عامة للقواعد','Establish a broad precedence policy for rules'],['تحويل CSS إلى JavaScript','Convert CSS to JavaScript'],['تحميل صورة','Load an image'],['تعطيل الوراثة','Disable inheritance']],'a','ترتيب الطبقات يجعل الأولوية قابلة للفهم.','Layer order makes precedence easier to reason about.'),
      question('css-p-q2','ماذا يسمح @container للمكوّن؟','What does @container allow a component to do?',[['التكيف مع عرض الحاوية لا النافذة فقط','Adapt to its container rather than only the viewport'],['تحميل بيانات','Load data'],['حفظ التقدم','Save progress'],['التحقق من HTML','Validate HTML']],'a','الاستعلام عن الحاوية يفيد المكونات المضمنة.','Container queries help embedded components adapt.'),
      question('css-p-q3','ما الطبقة التي ينبغي أن تستهلكها المكونات عادة؟','Which token layer should components typically consume?',[['الرموز الدلالية','Semantic tokens'],['قيم غير موثقة مكررة','Repeated undocumented literals'],['أسماء الصور','Image names'],['متغيرات JavaScript فقط','JavaScript variables only']],'a','الرمز الدلالي يفصل المعنى عن قيمة اللون.','Semantic tokens separate meaning from a literal value.'),
      question('css-p-q4','ما البديل الأكثر متانة لمؤشر focus قائم على shadow وحده؟','What is a more robust focus indicator than shadow alone?',[['outline واضح مع اختبار forced-colors','A visible outline checked in forced-colors'],['إزالة التركيز','Removing focus'],['لون hover فقط','A hover color only'],['تحريك الصفحة','Moving the page']],'a','قد تختفي الظلال في forced-colors؛ اختبر مؤشرًا صريحًا.','Shadows may disappear in forced-colors; test an explicit indicator.'),
      question('css-p-q5','كيف نقرر استخدام content-visibility؟','How should content-visibility be adopted?',[['بعد قياس الأثر واختبار التمرير والطباعة','After measuring impact and testing scroll and print'],['دون اختبار','Without testing'],['على كل عنصر','On every element'],['لتغيير الاتجاه','To change direction']],'a','تحسين الأداء يحتاج دليلًا واختبارًا للتجربة.','Performance optimization needs evidence and experience checks.'),
    ],
    'javascript-fundamentals': [
      question('js-p-q1','ما ميزة تمرير اعتماد storage إلى الوحدة؟','What is an advantage of passing storage into a module?',[['يسهل اختبارها واستبدال الاعتماد','It makes the module easier to test and substitute'],['يجعل البيانات موثوقة تلقائيًا','It makes the data trusted automatically'],['يلغي الحاجة لحدود','It removes the need for boundaries'],['يمنع الاستثناءات','It prevents exceptions']],'a','الاعتماد الصريح يسهل توفير fake في الاختبارات.','Explicit dependencies are easier to replace in tests.'),
      question('js-p-q2','متى تكون إعادة طلب الشبكة آمنة؟','When is retrying a network request safe?',[['عند تحديد سياسة وحدود، وبعملية آمنة أو idempotent','With a bounded policy and a safe or idempotent operation'],['دائمًا لكل خطأ','Always for every error'],['للعمليات التي تكرر الدفع','For repeated payment operations'],['دون انتظار','Without waiting']],'a','إعادة المحاولة يجب أن تراعي أثر تكرار العملية.','Retries must account for repeated side effects.'),
      question('js-p-q3','كيف نتعامل مع JSON محلي غير صالح؟','How should invalid local JSON be handled?',[['بمسار استعادة معلوم دون مسح صامت','With an explicit recovery path instead of silent clearing'],['بتنفيذه كـHTML','By executing it as HTML'],['بالثقة به','By trusting it'],['بإرساله تلقائيًا','By sending it automatically']],'a','الاستعادة تحافظ على البيانات وتوضح الحالة.','Recovery preserves data and communicates state.'),
      question('js-p-q4','ما الخطوة الأولى في تحسين أداء قائمة كبيرة؟','What is the first step in optimizing a large list?',[['قياس العمل الفعلي في سياق ممثل','Measure real work in a representative context'],['إضافة memo في كل مكان','Add memo everywhere'],['حذف كل الأحداث','Remove all events'],['تخزين DOM مشتق دائمًا','Always persist derived DOM']],'a','ابدأ بالقياس لتحديد عنق الزجاجة.','Measure first to identify the bottleneck.'),
      question('js-p-q5','ما الذي لا تثبته اختبارات الوحدات وحدها؟','What do unit tests alone not prove?',[['جودة تجربة قارئ الشاشة الكاملة','The quality of the complete screen-reader experience'],['سلوك دالة صغيرة','The behavior of a small function'],['حالة إدخال فارغ','An empty-input case'],['نتيجة التحويل','A transformation result']],'a','اجمع الاختبارات مع مراجعة وصول يدوية وسياقية.','Combine tests with manual, contextual accessibility review.'),
    ],
  },
};

const titles: Record<JourneyLevel, Record<FoundationPathId, JourneyLocaleText>> = {
  intermediate: {
    'html-fundamentals': text('HTML متوسط', 'Intermediate HTML'),
    'css-fundamentals': text('CSS متوسط', 'Intermediate CSS'),
    'javascript-fundamentals': text('JavaScript متوسط', 'Intermediate JavaScript'),
  },
  professional: {
    'html-fundamentals': text('HTML محترف', 'Professional HTML'),
    'css-fundamentals': text('CSS محترف', 'Professional CSS'),
    'javascript-fundamentals': text('JavaScript محترف', 'Professional JavaScript'),
  },
};
const summaries: Record<JourneyLevel, Record<FoundationPathId, JourneyLocaleText>> = {
  intermediate: {
    'html-fundamentals': text('دلالات متقدمة، نماذج صحيحة، وسائط مرنة وبناء موقع صغير قابل للاستخدام.', 'Advanced semantics, robust forms, responsive media, and a small usable site.'),
    'css-fundamentals': text('التتالي والتخطيط المرن والسمات وإتاحة الحركة والاتجاهين.', 'Cascade, adaptive layout, tokens, motion accessibility, and bidirectional styling.'),
    'javascript-fundamentals': text('تحويل البيانات وتفاعل DOM والتخزين وطلبات Fetch وتنظيم وحدات قابلة للاختبار.', 'Data transformations, DOM interaction, storage, Fetch, and testable module boundaries.'),
  },
  professional: {
    'html-fundamentals': text('عقود دلالية وإتاحة متقدمة وأداء وثائقي ومراجعة جودة قابلة للتكرار.', 'Semantic contracts, advanced accessibility, document performance, and repeatable quality review.'),
    'css-fundamentals': text('معمارية cascade وcontainer queries والسمات والتباين والتشخيص المبني على القياس.', 'Cascade architecture, container queries, themes, contrast, and measurement-led diagnosis.'),
    'javascript-fundamentals': text('هندسة الوحدات وasync resilient ومعالجة البيانات وقياس الأداء واختبارات متعددة الطبقات.', 'Module architecture, resilient async work, data validation, performance measurement, and layered testing.'),
  },
};

type JourneyLessonMetadata = Pick<JourneyLesson, 'unitId' | 'summary' | 'example' | 'hints' | 'commonMistakes' | 'knowledgeCheck'> & { sequence: number };
type GeneratedJourneyContent = {
  units: JourneyCourseUnit[];
  existingLessonMetadata: Record<string, JourneyLessonMetadata>;
  newLessons: JourneyLesson[];
};

const generatedJourneyContent = {
  intermediate: {
    'html-fundamentals': intermediateHtmlJson as unknown as GeneratedJourneyContent,
    'css-fundamentals': intermediateCssJson as unknown as GeneratedJourneyContent,
    'javascript-fundamentals': intermediateJavaScriptJson as unknown as GeneratedJourneyContent,
  },
  professional: {
    'html-fundamentals': professionalHtmlJson as unknown as GeneratedJourneyContent,
    'css-fundamentals': professionalCssJson as unknown as GeneratedJourneyContent,
    'javascript-fundamentals': professionalJavaScriptJson as unknown as GeneratedJourneyContent,
  },
} satisfies Record<JourneyLevel, Record<FoundationPathId, GeneratedJourneyContent>>;

function assembleJourneyLessons(baseLessons: JourneyLessonBase[], generated: GeneratedJourneyContent): JourneyLesson[] {
  const metadata = generated.existingLessonMetadata;
  const existingIds = new Set(baseLessons.map((item) => item.id));
  if (existingIds.size !== baseLessons.length || existingIds.size !== Object.keys(metadata).length) {
    throw new Error('Journey curriculum metadata must match the existing lesson IDs exactly.');
  }
  const existingLessons = baseLessons.map((item) => {
    const extra = metadata[item.id];
    if (!extra) throw new Error(`Missing curriculum metadata for preserved lesson ${item.id}.`);
    return { ...item, ...extra };
  });
  return [...existingLessons, ...generated.newLessons].sort((a, b) => a.sequence - b.sequence);
}

function buildJourneyCourse(level: JourneyLevel, pathId: FoundationPathId, baseLessons: JourneyLessonBase[]): JourneyCourse {
  const generated = generatedJourneyContent[level][pathId];
  return {
    pathId,
    level,
    title: titles[level][pathId],
    summary: summaries[level][pathId],
    units: generated.units,
    lessons: assembleJourneyLessons(baseLessons, generated),
    assessment: assessments[level][pathId],
    passingScore: 4,
  };
}

export const JOURNEY_COURSES: Record<JourneyLevel, Record<FoundationPathId, JourneyCourse>> = {
  intermediate: {
    'html-fundamentals': buildJourneyCourse('intermediate', 'html-fundamentals', htmlIntermediate),
    'css-fundamentals': buildJourneyCourse('intermediate', 'css-fundamentals', cssIntermediate),
    'javascript-fundamentals': buildJourneyCourse('intermediate', 'javascript-fundamentals', jsIntermediate),
  },
  professional: {
    'html-fundamentals': buildJourneyCourse('professional', 'html-fundamentals', htmlProfessional),
    'css-fundamentals': buildJourneyCourse('professional', 'css-fundamentals', cssProfessional),
    'javascript-fundamentals': buildJourneyCourse('professional', 'javascript-fundamentals', jsProfessional),
  },
};

export function getJourneyCourse(level: JourneyLevel, pathId: FoundationPathId): JourneyCourse {
  return JOURNEY_COURSES[level][pathId];
}
export function getJourneyLesson(level: JourneyLevel, pathId: FoundationPathId, lessonId: string): JourneyLesson | undefined {
  return getJourneyCourse(level, pathId).lessons.find((lessonItem) => lessonItem.id === lessonId);
}
