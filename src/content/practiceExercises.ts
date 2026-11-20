import { FOUNDATION_LESSON_IDS, type FoundationLessonId, type HtmlLessonId } from './learningSystem';
import { FOUNDATION_LESSONS_BY_ID } from './foundationLessons';
import type { HtmlDocumentRule, HtmlElementRule, HtmlLabelControlRule, HtmlListRule, PracticeValidationRule } from './practiceTypes';

export type PracticeValidatorId = 'intro' | 'headings' | 'links' | 'images' | 'first-page';
export type PracticeExerciseDefinition = {
  language: 'html' | 'css' | 'javascript';
  validator?: PracticeValidatorId;
  starterHtml: string;
  starterCss: string;
  starterJs: string;
  validationRules?: readonly PracticeValidationRule[];
  instructions?: { ar: string; en: string };
};

const optionalCss = '/* Optional: style your HTML after the structure is in place. */\n';
const optionalJs = '// Optional: JavaScript is not required for this HTML exercise.\n';
const emptyHtmlStarter = '';

const elementRule = (id: string, tag: string, label_ar: string, label_en: string, options: Omit<HtmlElementRule, 'id' | 'type' | 'tag' | 'note_ar' | 'note_en' | 'label_ar' | 'label_en'> = {}): HtmlElementRule => ({
  id, type: 'html-element', tag, label_ar, label_en, note_ar: label_ar, note_en: label_en,
  concept_ar: 'عناصر HTML وسماتها', concept_en: 'HTML elements and attributes', ...options,
});
const documentRule = (id: string, check: HtmlDocumentRule['check'], expected: string | undefined, label_ar: string, label_en: string): HtmlDocumentRule => ({
  id, type: 'html-document', check, expected, label_ar, label_en, note_ar: label_ar, note_en: label_en,
  concept_ar: 'بنية وثيقة HTML', concept_en: 'HTML document structure',
});
const listRule = (id: string, tag: HtmlListRule['tag'], minimumItems: number, label_ar: string, label_en: string): HtmlListRule => ({
  id, type: 'html-list', tag, minimumItems, label_ar, label_en, note_ar: label_ar, note_en: label_en,
  concept_ar: 'القوائم الدلالية', concept_en: 'Semantic lists',
});
const labelControlRule = (id: string, options: Omit<HtmlLabelControlRule, 'id' | 'type' | 'note_ar' | 'note_en' | 'label_ar' | 'label_en'>, label_ar: string, label_en: string): HtmlLabelControlRule => ({
  id, type: 'html-label-control', label_ar, label_en, note_ar: label_ar, note_en: label_en,
  concept_ar: 'ربط التسميات بالحقول', concept_en: 'Associating labels with controls', ...options,
});

const htmlPracticeExercises: Record<HtmlLessonId, PracticeExerciseDefinition> = {
  'html-introduction': { language: 'html', validator: 'intro', starterHtml: emptyHtmlStarter, starterCss: optionalCss, starterJs: optionalJs },
  'html-headings-paragraphs': { language: 'html', validator: 'headings', starterHtml: emptyHtmlStarter, starterCss: optionalCss, starterJs: optionalJs },
  'html-links-navigation': { language: 'html', validator: 'links', starterHtml: emptyHtmlStarter, starterCss: optionalCss, starterJs: optionalJs },
  'html-images-attributes': { language: 'html', validator: 'images', starterHtml: emptyHtmlStarter, starterCss: optionalCss, starterJs: optionalJs },
  'html-first-page': {
    language: 'html', starterHtml: emptyHtmlStarter, starterCss: optionalCss, starterJs: optionalJs,
    instructions: {
      ar: '١. ابدأ بإعلان DOCTYPE صريح. ٢. أنشئ عنصر `html` يحتوي `head` ثم `body`. ٣. أضف عنوانًا غير فارغ داخل `head`.',
      en: '1. Start with an explicit DOCTYPE. 2. Create an `html` element containing `head` followed by `body`. 3. Add a non-empty title inside `head`.',
    },
    validationRules: [
      documentRule('first-page-doctype', 'doctype', undefined, 'ابدأ الوثيقة بإعلان DOCTYPE صريح.', 'Start the document with an explicit DOCTYPE.'),
      documentRule('first-page-html-root', 'html-root', undefined, 'أنشئ عنصر html صريحًا يحتوي head ثم body.', 'Create an explicit html root containing head followed by body.'),
      documentRule('first-page-title', 'title', undefined, 'أضف عنوانًا غير فارغ داخل head.', 'Add a non-empty title inside head.'),
    ],
  },
  'html-document-metadata': {
    language: 'html', starterHtml: '<!doctype html>\n<html lang="en" dir="ltr">\n  <head>\n    <!-- Add document metadata here. -->\n  </head>\n  <body>\n    <main></main>\n  </body>\n</html>', starterCss: optionalCss, starterJs: optionalJs,
    instructions: {
      ar: '١. داخل `<head>` أضف `<meta charset="utf-8">`. ٢. أضف meta باسم viewport ومحتوى غير فارغ كما في الشرح. ٣. أضف عنوانًا غير فارغ داخل `<title>`. ٤. أضف meta باسم description وقيمة content من 8 أحرف على الأقل.',
      en: '1. Inside `<head>`, add `<meta charset="utf-8">`. 2. Add a viewport meta element with non-empty content as shown in the lesson. 3. Add a non-empty `<title>`. 4. Add a description meta element with a content value of at least 8 characters.',
    },
    validationRules: [
      documentRule('metadata-charset', 'charset', 'utf-8', 'أضف تعريف ترميز UTF-8 داخل meta باسم charset في head.', 'Add a UTF-8 charset declaration in a meta element inside head.'),
      documentRule('metadata-viewport', 'viewport', undefined, 'أضف meta باسم viewport وبسمة content غير فارغة.', 'Add a viewport meta element with a non-empty content attribute.'),
      documentRule('metadata-title', 'title', undefined, 'أضف نصًا غير فارغ داخل عنصر title في head.', 'Add non-empty text inside the title element in head.'),
      elementRule('metadata-description', 'meta', 'أضف meta باسم description وقيمة content من 8 أحرف على الأقل داخل head.', 'Add a description meta element with a content value of at least 8 characters inside head.', { minimumAttributeLengths: { content: 8 }, attributeValues: { name: 'description' }, ancestorTag: 'head' }),
    ],
  },
  'html-semantic-structure': {
    language: 'html', starterHtml: '<!-- Add semantic page regions below. -->', starterCss: optionalCss, starterJs: optionalJs,
    instructions: {
      ar: '١. أنشئ عنصر `header`. ٢. ضع عنوان h1 غير فارغ داخله. ٣. أنشئ `nav` وضع فيه رابطًا بوجهة غير فارغة. ٤. أنشئ `main` وضع داخله قسمين section على الأقل. ٥. أضف `footer` يحتوي نصًا ختاميًا غير فارغ.',
      en: '1. Create a `header`. 2. Put a non-empty h1 inside it. 3. Create a `nav` and put a link with a non-empty destination inside it. 4. Create a `main` containing at least two sections. 5. Add a `footer` with non-empty closing text.',
    },
    validationRules: [
      elementRule('semantic-header', 'header', 'استخدم عنصر header واحدًا على الأقل.', 'Use at least one header element.'),
      elementRule('semantic-primary-heading', 'h1', 'ضع عنوانًا رئيسيًا غير فارغ داخل header.', 'Put a non-empty main heading inside header.', { parentTag: 'header', minimumTextLength: 1 }),
      elementRule('semantic-nav-link', 'a', 'أضف رابطًا بوجهة غير فارغة داخل nav.', 'Add a link with a non-empty destination inside nav.', { parentTag: 'nav', minimumAttributeLengths: { href: 2 } }),
      elementRule('semantic-main-regions', 'section', 'أنشئ قسمين على الأقل داخل main.', 'Create at least two sections inside main.', { parentTag: 'main', minimumCount: 2 }),
      elementRule('semantic-footer', 'footer', 'استخدم عنصر footer بمحتوى ختامي غير فارغ.', 'Use a footer element with non-empty closing content.', { minimumTextLength: 1 }),
    ],
  },
  'html-lists-tables': {
    language: 'html', starterHtml: '<main>\n  <h1>Workshop supplies</h1>\n  <!-- Create a list and comparison table here. -->\n</main>', starterCss: optionalCss, starterJs: optionalJs,
    instructions: {
      ar: '١. أضف قائمة غير مرتبة `ul` تحتوي ثلاثة عناصر `li` مباشرة على الأقل. ٢. أنشئ جدول مقارنة واحدًا يحتوي على خليتي `th` وخليتي `td` على الأقل في صفوفه. ٣. لا تستخدم المسافات لمحاكاة الأعمدة.',
      en: '1. Add an unordered `ul` with at least three direct `li` items. 2. Create one comparison table with at least two `th` and two `td` cells in its rows. 3. Do not use spaces to imitate columns.',
    },
    validationRules: [
      { ...listRule('supply-list-items', 'ul', 3, 'أنشئ قائمة ul تضم ثلاثة عناصر li مباشرة على الأقل.', 'Create a ul with at least three direct li items.'), directChildren: true },
      elementRule('comparison-table', 'table', 'أنشئ عنصر table لبيانات المقارنة.', 'Create a table element for the comparison.'),
      elementRule('comparison-headings', 'th', 'أضف خليتي رأس th داخل جدول المقارنة نفسه.', 'Add two th header cells inside the same comparison table.', { minimumCount: 2, parentTag: 'table', sameContainerAs: { containerTag: 'table', requiredChildren: [{ tag: 'th', count: 2 }, { tag: 'td', count: 2 }] } }),
      elementRule('comparison-data', 'td', 'أضف خليتي بيانات td داخل جدول المقارنة نفسه.', 'Add two td data cells inside the same comparison table.', { minimumCount: 2, parentTag: 'table', sameContainerAs: { containerTag: 'table', requiredChildren: [{ tag: 'th', count: 2 }, { tag: 'td', count: 2 }] } }),
    ],
  },
  'html-accessible-forms': {
    language: 'html', starterHtml: '<main>\n  <h1>Contact the workshop</h1>\n  <form>\n    <!-- Add fields and associated labels here. -->\n  </form>\n</main>', starterCss: optionalCss, starterJs: optionalJs,
    instructions: {
      ar: '١. ضع الحقول داخل عنصر form. ٢. داخل fieldset في النموذج، أضف حقلين input على الأقل واربط label بكل حقل باستخدام for وid متطابقين. ٣. أضف وصفًا غير فارغ داخل legend لذلك fieldset. ٤. أضف زر submit واضح الاسم داخل النموذج.',
      en: '1. Put the controls inside a form. 2. Inside a fieldset in that form, add at least two inputs and associate a label with each using matching `for` and `id` values. 3. Add a non-empty legend description to that fieldset. 4. Add a clearly named submit button inside the form.',
    },
    validationRules: [
      elementRule('contact-form', 'form', 'ضع حقول التواصل داخل عنصر form.', 'Place the contact controls inside a form.'),
      labelControlRule('contact-label-pairs', { minimumPairs: 2, formScoped: true, fieldsetScoped: true }, 'اربط label بحقلين داخل fieldset في النموذج عبر for وid متطابقين.', 'Associate labels with two controls inside a fieldset in the form using matching for and id values.'),
      elementRule('contact-fieldset', 'fieldset', 'اجمع الحقول داخل fieldset داخل form.', 'Group the controls inside a fieldset within the form.', { parentTag: 'form' }),
      elementRule('contact-legend', 'legend', 'أضف وصفًا غير فارغ داخل legend للـfieldset.', 'Add a non-empty description inside the fieldset legend.', { parentTag: 'fieldset', ancestorTag: 'form', minimumTextLength: 1 }),
      elementRule('contact-submit', 'button', 'أضف زرًا من نوع submit ونصًا واضحًا داخل form.', 'Add a submit button with clear text inside the form.', { parentTag: 'form', minimumTextLength: 1, attributeValues: { type: 'submit' } }),
    ],
  },
  'html-form-validation': {
    language: 'html', starterHtml: '<form>\n  <!-- Add a required email field and helper text. -->\n</form>', starterCss: optionalCss, starterJs: optionalJs,
    instructions: {
      ar: '١. داخل form أضف input من النوع email واجعله required. ٢. اربط به label عبر id وfor متطابقين. ٣. أضف داخل form عنصر small بنص مساعدة غير فارغ. ٤. أضف زر submit داخل form.',
      en: '1. Inside a form, add a required email input. 2. Associate a label with matching id and for values. 3. Add non-empty helper text inside a small element within the form. 4. Add a submit button inside the form.',
    },
    validationRules: [
      elementRule('email-required-control', 'input', 'أضف input من النوع email مع required داخل form.', 'Add a required email input inside a form.', { parentTag: 'form', attributeValues: { type: 'email' }, requiredAttributes: ['required'] }),
      labelControlRule('email-label-pair', { inputType: 'email', requireRequired: true, formScoped: true }, 'اربط label بحقل البريد المطلوب داخل form.', 'Associate a label with the required email control inside the form.'),
      elementRule('email-helper-text', 'small', 'أضف نص مساعدة غير فارغ داخل small في form.', 'Add non-empty helper text inside a small element in the form.', { parentTag: 'form', minimumTextLength: 1 }),
      elementRule('email-submit-button', 'button', 'أضف زر submit داخل النموذج.', 'Add a submit button inside the form.', { parentTag: 'form', attributeValues: { type: 'submit' } }),
    ],
  },
  'html-media': {
    language: 'html', starterHtml: '<main>\n  <h1>Field recording</h1>\n  <figure><!-- Add an image and a suitable caption. --></figure>\n  <!-- Add the remaining media elements here. -->\n</main>', starterCss: optionalCss, starterJs: optionalJs,
    instructions: {
      ar: '١. أضف صورة داخل figure مع src ونص alt وصفي لا يقل عن أربع حروف. ٢. أضف figcaption غير فارغ داخل figure. ٣. أضف video مع سمة controls. لا يُطلب iframe في هذا التمرين.',
      en: '1. Add an image inside figure with a src and descriptive alt text of at least four characters. 2. Add a non-empty figcaption inside figure. 3. Add a video with the controls attribute. An iframe is not required in this exercise.',
    },
    validationRules: [
      elementRule('media-image-alternative', 'img', 'أضف صورة داخل figure بمصدر ونص بديل مفيد.', 'Add an image inside figure with a source and useful alternative text.', { parentTag: 'figure', requiredAttributes: ['src', 'alt'], minimumAttributeLengths: { src: 2, alt: 4 } }),
      elementRule('media-caption', 'figcaption', 'أضف figcaption غير فارغ داخل figure.', 'Add a non-empty figcaption inside figure.', { parentTag: 'figure', minimumTextLength: 1 }),
      elementRule('media-video-controls', 'video', 'أضف video مع سمة controls.', 'Add a video element with controls.', { requiredAttributes: ['controls'] }),
    ],
  },
  'html-multi-section-page': {
    language: 'html', starterHtml: '<header><!-- Page header --></header>\n<main><!-- Create the page sections here --></main>\n<footer><!-- Closing information --></footer>', starterCss: optionalCss, starterJs: optionalJs,
    instructions: {
      ar: '١. أضف h1 واحدًا غير فارغ داخل الصفحة. ٢. أنشئ ثلاثة عناصر section على الأقل داخل main. ٣. أضف h2 غير فارغ داخل كل واحد من الأقسام الثلاثة. ٤. أضف nav يضم رابطين داخليين على الأقل بوجهتين تبدأان بـ #. ٥. أكمل منطقة footer بمعلومة ختامية.',
      en: '1. Add one non-empty h1 to the page. 2. Create at least three section elements inside main. 3. Add a non-empty h2 inside each of the three sections. 4. Add a nav with at least two in-page links whose destinations begin with #. 5. Complete the footer with closing information.',
    },
    validationRules: [
      elementRule('page-main-heading', 'h1', 'أضف عنوان h1 رئيسيًا غير فارغ.', 'Add a non-empty main h1 heading.', { minimumTextLength: 1 }),
      elementRule('page-sections', 'section', 'أنشئ ثلاثة أقسام section على الأقل داخل main.', 'Create at least three section elements inside main.', { parentTag: 'main', minimumCount: 3 }),
      elementRule('page-section-subheadings', 'h2', 'أضف عنوان h2 غير فارغ داخل كل قسم من الأقسام الثلاثة في main.', 'Add a non-empty h2 inside each of the three sections in main.', { parentTag: 'section', ancestorTag: 'main', minimumCount: 3, minimumTextLength: 1, minimumPerParent: { parentTag: 'section', count: 1 } }),
      elementRule('page-internal-navigation', 'a', 'أضف رابطين داخليين على الأقل بوجهة تبدأ بـ # داخل nav.', 'Add at least two in-page links with destinations starting with # inside nav.', { parentTag: 'nav', minimumCount: 2, attributePrefixes: { href: '#' } }),
      elementRule('page-footer', 'footer', 'أضف منطقة footer بمحتوى ختامي غير فارغ.', 'Add a footer region with non-empty closing content.', { minimumTextLength: 1 }),
    ],
  },
};

const foundationPracticeExercises = Object.fromEntries(
  Object.entries(FOUNDATION_LESSONS_BY_ID).map(([id, lesson]) => [id, {
    language: lesson.path_id === 'css-fundamentals' ? 'css' : 'javascript',
    starterHtml: lesson.starter_html,
    starterCss: lesson.starter_css,
    starterJs: lesson.starter_js,
    validationRules: lesson.validation_rules,
    instructions: { ar: lesson.practice_ar, en: lesson.practice_en },
  }]),
) as Partial<Record<FoundationLessonId, PracticeExerciseDefinition>>;

export const practiceExercises: Record<FoundationLessonId, PracticeExerciseDefinition> = {
  ...htmlPracticeExercises,
  ...Object.fromEntries(FOUNDATION_LESSON_IDS.filter((id) => id in foundationPracticeExercises).map((id) => [id, foundationPracticeExercises[id]])),
} as Record<FoundationLessonId, PracticeExerciseDefinition>;
