import type { FoundationLesson, FoundationQuizQuestion, FoundationStep, FoundationCodeExplanation } from './foundationLessons';
import type { PracticeValidationRule } from './practiceTypes';

type ChoiceCopy = readonly [string, string];
type QuizSpec = readonly [
  string, string, string, string, number,
  readonly [ChoiceCopy, ChoiceCopy, ChoiceCopy, ChoiceCopy],
];

const step = (title_ar: string, title_en: string, body_ar: string, body_en: string): FoundationStep => ({ title_ar, title_en, body_ar, body_en });
const explanation = (code: string, why_ar: string, why_en: string): FoundationCodeExplanation => ({ code, why_ar, why_en });

function question(id: string, spec: QuizSpec): FoundationQuizQuestion {
  const [prompt_en, prompt_ar, review_ar, review_en, answerIndex, copies] = spec;
  const choices = copies.map(([text_ar, text_en], index) => ({ id: String.fromCharCode(97 + index), text_ar, text_en, is_correct: index === answerIndex })) as FoundationQuizQuestion['choices'];
  const correct = copies[answerIndex];
  return {
    id, prompt_ar, prompt_en, review_ar, review_en, choices,
    correct_choice_id: String.fromCharCode(97 + answerIndex),
    correct_ar: `صحيح: ${correct[0]}.`,
    correct_en: `Correct: ${correct[1]}.`,
    incorrect_ar: `ليست هذه الإجابة. ${review_ar}`,
    incorrect_en: `Not quite. ${review_en}`,
  };
}

const base = (id: string, ar: string, en: string) => ({
  id, label_ar: ar, label_en: en, note_ar: ar, note_en: en, concept_ar: ar, concept_en: en,
});
const selector = (id: string, target: string, ar: string, en: string): PracticeValidationRule => ({ ...base(id, ar, en), type: 'css-selector', target });
const declaration = (id: string, target: string, property: string, value: string, ar: string, en: string, scope?: 'outside-media' | 'inside-media', valueMatch?: 'semantic-color'): PracticeValidationRule => ({ ...base(id, ar, en), type: 'css-declaration', target, property, value, ...(scope ? { scope } : {}), ...(valueMatch ? { valueMatch } : {}) });
const forbidDeclaration = (id: string, target: string, property: string, ar: string, en: string): PracticeValidationRule => ({ ...base(id, ar, en), type: 'css-forbid-declaration', target, property });
const mediaRule = (id: string, target: string, ar: string, en: string): PracticeValidationRule => ({ ...base(id, ar, en), type: 'css-media', target });
const declarationInMedia = (id: string, target: string, property: string, value: string, media: string, ar: string, en: string): PracticeValidationRule => ({ ...base(id, ar, en), type: 'css-declaration-in-media', target, property, value, media });

const quiz = (...specs: [string, QuizSpec][]): [FoundationQuizQuestion, FoundationQuizQuestion, FoundationQuizQuestion] => specs.map(([id, spec]) => question(id, spec)) as [FoundationQuizQuestion, FoundationQuizQuestion, FoundationQuizQuestion];

export const EXPANDED_CSS_LESSONS = {
  'css-specificity-inheritance': {
    path_id: 'css-fundamentals',
    title_ar: 'أولوية المحددات والوراثة',
    title_en: 'Selector Priority and Inheritance',
    objective_ar: 'قارن تصريحات لون متنافسة على الفقرة، وأضف خاصية قابلة للوراثة إلى الأب مع ترك الفقرة بلا تصريح مباشر لها.',
    objective_en: 'Compare competing color declarations on a paragraph, and add an inheritable property to its parent while leaving the paragraph without a direct declaration for it.',
    outcome_ar: 'أستطيع استخدام المحددات المتداخلة لرصد حالات التنافس، وتحديد خاصية تنتقل من الأب عندما لا يحددها الابن.',
    outcome_en: 'I can use nested selectors to inspect competing rules and identify a property inherited from a parent when the child has no direct declaration.',
    steps: [
      step('من يستهدفه المحدد؟', 'What does a selector target?', 'المحدد يختار عناصر بعينها: `p` يختار الفقرات، و`.profile` يختار العناصر التي تحمل هذه الفئة. كل تصريح داخل القاعدة يطبّق على العناصر المختارة.', 'A selector chooses particular elements: `p` selects paragraphs, and `.profile` selects elements with that class. Declarations in its rule apply to the matched elements.'),
      step('قارن محددات تستهدف الفقرة', 'Compare selectors that target the paragraph', 'عندما تتنافس قواعد على لون الفقرة نفسها، قارن محدد العنصر ثم الفئة ثم المعرّف مع بقاء الخصائص الأخرى متساوية. شغّل المعاينة لملاحظة نتيجة cascade الفعلية؛ أداة التحقق هنا تفحص وجود التصريحات لا تحسب النتيجة المعروضة.', 'When rules compete for the same paragraph color, compare the element, class, and ID selectors while other factors stay equal. Run the preview to observe the actual cascade; the checker here verifies declarations but does not calculate the displayed result.'),
      step('لاحظ الوراثة', 'Observe inheritance', 'تنتقل بعض الخصائص مثل `font-family` من الأب إلى الابن. أضفها إلى `.profile` واترك الفقرة بلا تصريح font-family مباشر لتستقبلها بالوراثة.', 'Some properties such as `font-family` pass from parent to child. Add it to `.profile` and leave the paragraph without a direct font-family declaration so it inherits the value.'),
    ] as [FoundationStep, FoundationStep, FoundationStep],
    example_code: 'p { color: gray; }\n.profile p { color: teal; }\n#profile p { color: purple; }\n.profile { font-family: sans-serif; }',
    code_explanation: [
      explanation('p { color: gray; }', 'قاعدة عامة تضبط لون الفقرات.', 'A general rule sets paragraph color.'),
      explanation('.profile p { color: teal; }', 'تستهدف الفقرة داخل عنصر يحمل الفئة profile.', 'Targets a paragraph inside an element with the profile class.'),
      explanation('#profile p { color: purple; }', 'يستهدف الفقرة داخل المعرّف profile؛ شغّل المعاينة لملاحظة نتيجة التنافس.', 'Targets the paragraph inside the profile ID; run the preview to observe the competing result.'),
    ],
    practice_ar: '١. أضف `color: gray` إلى `p`. ٢. أضف `color: teal` إلى `.profile p`. ٣. أضف `color: purple` إلى `#profile p`. ٤. أضف `font-family: sans-serif` إلى `.profile`. ٥. لا تضف `font-family` إلى `p`. ٦. لا تضف `font-family` إلى `.profile p`. ٧. لا تضف `font-family` إلى `#profile p`؛ اترك الفقرة ترث الخط. شغّل المعاينة لملاحظة cascade؛ validator لا يحسب النتيجة المعروضة.',
    practice_en: '1. Add `color: gray` to `p`. 2. Add `color: teal` to `.profile p`. 3. Add `color: purple` to `#profile p`. 4. Add `font-family: sans-serif` to `.profile`. 5. Do not set `font-family` on `p`. 6. Do not set `font-family` on `.profile p`. 7. Do not set `font-family` on `#profile p`; let the paragraph inherit the font. Run the preview to observe the cascade; the validator does not calculate the displayed result.',
    starter_html: '<section class="profile" id="profile">\n  <h2>Profile</h2>\n  <p>A short introduction.</p>\n</section>',
    starter_css: '', starter_js: '',
    quiz: quiz(
      ['specificity-q1', ['Which selector is generally strongest among these three when competing for the same property on the same element?', 'أيّ هذه المحددات أقوى عادةً عند تنافسها على الخاصية نفسها للعنصر نفسه؟', 'قارن بين محدد العنصر والفئة والمعرّف، مع بقاء بقية العوامل ثابتة.', 'Compare the element, class, and ID selectors while holding other factors constant.', 2, [['`p`', '`p`'], ['`.profile`', '`.profile`'], ['`#profile`', '`#profile`'], ['لها الأولوية نفسها دائمًا', 'They always have equal priority']]]],
      ['specificity-q2', ['What does inheritance mean for a child element?', 'ماذا تعني الوراثة بالنسبة إلى العنصر الابن؟', 'قد تنتقل بعض القيم من الأب إلى الابن ما لم يحدد الابن تنسيقًا مباشرًا.', 'Some values can pass from the parent to the child unless the child has a direct style.', 1, [['كل خصائص CSS تنتقل دائمًا إلى كل ابن', 'Every CSS property always passes to every child'], ['قد تنتقل بعض الخصائص، مثل لون النص، من الأب إلى الابن', 'Some properties, such as text color, may pass from parent to child'], ['ينسخ العنصر الابن وسم HTML الخاص بالأب', 'The child copies the parent’s HTML tag'], ['يصبح محدد الأب هو محدد الابن', 'The parent selector becomes the child selector']]]],
      ['specificity-q3', ['What does the practice for this lesson ask you to verify?', 'ما الذي يطلب منك تمرين هذا الدرس التحقق منه؟', 'التحقق يقتصر على وجود المحددات والتصريح المحدد، لا على حساب المظهر النهائي.', 'Validation is limited to the requested selectors and declaration, not the final computed appearance.', 0, [['المحددات والتصريحات، لا نتيجة cascade محسوبة تلقائيًا', 'Selectors and declarations, not an automatically computed cascade'], ['اللون النهائي المعروض بعد تطبيق قواعد المتصفح كلها', 'The exact color displayed after all browser rules'], ['ما إذا كانت وسوم HTML ترث أسماءها', 'Whether HTML tags inherit their names'], ['عدد البكسلات في كل خاصية موروثة', 'The number of pixels in every inherited property']]]],
    ),
    validation_rules: [
      declaration('profile-element-color', 'p', 'color', 'gray', 'أضف لون gray إلى محدد الفقرة `p`.', 'Set the `p` selector color to gray.', undefined, 'semantic-color'),
      declaration('profile-class-descendant-color', '.profile p', 'color', 'teal', 'أضف لون teal إلى الفقرة داخل `.profile`.', 'Set the color to teal on a paragraph inside `.profile`.', undefined, 'semantic-color'),
      declaration('profile-id-descendant-color', '#profile p', 'color', 'purple', 'أضف لون purple إلى الفقرة داخل `#profile`.', 'Set the color to purple on a paragraph inside `#profile`.', undefined, 'semantic-color'),
      declaration('profile-inherited-font', '.profile', 'font-family', 'sans-serif', 'أضف `font-family: sans-serif` إلى `.profile`.', 'Add `font-family: sans-serif` to `.profile`.'),
      forbidDeclaration('profile-no-direct-font', 'p', 'font-family', 'لا تضف `font-family` مباشرةً إلى الفقرة؛ اتركها ترثه من `.profile`.', 'Do not set `font-family` directly on `p`; leave it to inherit from `.profile`.'),
      forbidDeclaration('profile-no-class-direct-font', '.profile p', 'font-family', 'لا تضف `font-family` إلى المحدد `.profile p`.', 'Do not set `font-family` on `.profile p`.'),
      forbidDeclaration('profile-no-id-direct-font', '#profile p', 'font-family', 'لا تضف `font-family` إلى المحدد `#profile p`.', 'Do not set `font-family` on `#profile p`.'),
    ],
  },
  'css-sizing-units': {
    path_id: 'css-fundamentals', title_ar: 'الأبعاد ووحدات القياس', title_en: 'Dimensions and CSS Units',
    objective_ar: 'استخدم px و% وrem لضبط العرض وحجم الخط، وافهم ما الذي تقيسه كل وحدة في المثال.',
    objective_en: 'Use px, %, and rem to set width and text size, and understand what each unit measures in the example.',
    outcome_ar: 'أستطيع تحديد عرض ثابت وآخر نسبي وحجم خط بوحدة rem.',
    outcome_en: 'I can set a fixed width, a relative width, and a font size in rem.',
    steps: [
      step('حجم ثابت بـ px', 'A fixed size with px', 'تعبّر `px` عن عدد ثابت من وحدات البكسل في CSS. مثلًا، `width: 320px` يحدد عرضًا قدره 320px للعنصر، وقد يحتاج تخطيط الهاتف إلى قيمة أصغر.', '`px` expresses a fixed CSS pixel amount. For example, `width: 320px` sets an element’s width to 320px, which may be too wide for some phones.'),
      step('نسبة من الحاوية', 'A percentage of the container', 'القيمة `50%` في `width` تعني نصف عرض الحاوية التي يُحسب العرض نسبةً إليها، لا نصف الشاشة دائمًا. لذلك يمكن للعنصر أن يتسع أو يضيق مع الحاوية.', 'A `50%` value for `width` means half the width of the containing block it is measured against, not always half the screen. The element can therefore grow or shrink with its container.'),
      step('حجم خط بـ rem', 'Text size with rem', 'تعتمد `rem` على حجم الخط الأساسي للصفحة. إذا كان الحجم الأساسي 16px، فإن `1.5rem` يساوي 24px. راجع المثال ثم اربط كل قيمة بالخاصية التي تضبطها.', '`rem` is based on the page’s root font size. If the root size is 16px, `1.5rem` equals 24px. Review the example and match each value to its property.'),
    ] as [FoundationStep, FoundationStep, FoundationStep],
    example_code: '.measure { width: 320px; }\n.measure__inner { width: 50%; }\n.measure__title { font-size: 1.5rem; }',
    code_explanation: [
      explanation('width: 320px;', 'يحدد عرض الحاوية بوحدة px.', 'Sets the container width in px.'),
      explanation('width: 50%;', 'يجعل العنصر الداخلي بعرض نصف الحاوية التي يقاس بالنسبة إليها.', 'Makes the inner element half as wide as the container it is measured against.'),
      explanation('font-size: 1.5rem;', 'يضبط حجم العنوان نسبةً إلى حجم الخط الأساسي للصفحة.', 'Sets the heading size relative to the page’s root font size.'),
    ],
    practice_ar: '١. على `.measure`، اضبط `width` على `320px`. ٢. على `.measure__inner`، اضبط `width` على `50%`. ٣. على `.measure__title`، اضبط `font-size` على `1.5rem`.',
    practice_en: '1. On `.measure`, set `width` to `320px`. 2. On `.measure__inner`, set `width` to `50%`. 3. On `.measure__title`, set `font-size` to `1.5rem`.',
    starter_html: '<section class="measure">\n  <h2 class="measure__title">A measured panel</h2>\n  <div class="measure__inner">Half-width area</div>\n</section>',
    starter_css: '', starter_js: '',
    quiz: quiz(
      ['units-q1', ['Which unit expresses the fixed width in `width: 320px`?', 'ما الوحدة التي تعبّر عن العرض الثابت في `width: 320px`؟', '`px` هنا قيمة طول بالبكسل، وليست نسبة من الحاوية.', '`px` here is a pixel length, not a percentage of the container.', 0, [['`px`', '`px`'], ['`%`', '`%`'], ['`rem`', '`rem`'], ['`auto`', '`auto`']]]],
      ['units-q2', ['A child is `width: 50%`. What is that percentage usually relative to?', 'إذا كان عرض عنصر ابن `50%`، فإلى ماذا تُحسب النسبة عادةً؟', 'عرض النسبة يرتبط بالحاوية التي يُقاس العنصر بالنسبة إليها.', 'The percentage width is tied to the containing block it is measured against.', 1, [['نصف مساحة العرض دائمًا مهما كانت الحاوية', 'Always half the viewport, whatever its parent'], ['نصف عرض الحاوية التي تحتويه', 'Half the width of its containing block'], ['نصف حجم الخط الأساسي للجذر', 'Half the root font size'], ['50 بكسلًا ثابتًا', 'A fixed 50 pixels']]]],
      ['units-q3', ['If the root font size is 16px, what is `1.5rem`?', 'إذا كان حجم الخط الأساسي 16px، فكم تساوي `1.5rem`؟', 'تساوي `1.5rem` مرة ونصف من 16px، أي 24px.', '`1.5rem` is one and a half times 16px, which is 24px.', 2, [['16px', '16px'], ['20px', '20px'], ['24px', '24px'], ['32px', '32px']]]],
    ),
    validation_rules: [
      declaration('measure-fixed-width', '.measure', 'width', '320px', 'على `.measure` اضبط العرض على `320px`.', 'On `.measure`, set the width to `320px`.'),
      declaration('measure-relative-width', '.measure__inner', 'width', '50%', 'على `.measure__inner` اضبط العرض على `50%`.', 'On `.measure__inner`, set the width to `50%`.'),
      declaration('measure-rem-font', '.measure__title', 'font-size', '1.5rem', 'على `.measure__title` اضبط حجم الخط على `1.5rem`.', 'On `.measure__title`, set the font size to `1.5rem`.'),
    ],
  },
  'css-display-visibility': {
    path_id: 'css-fundamentals', title_ar: 'العرض والإخفاء', title_en: 'Display and Visibility',
    objective_ar: 'قارن بين `display` و`visibility` عند إخفاء عنصر، وتعلّم متى يبقى مكانه محفوظًا.',
    objective_en: 'Compare `display` and `visibility` when hiding an element, and learn when its space remains reserved.',
    outcome_ar: 'أستطيع تفسير الفرق بين إزالة العنصر من التخطيط وإخفائه مع إبقاء مكانه.',
    outcome_en: 'I can explain the difference between removing an element from layout and hiding it while keeping its space.',
    steps: [
      step('العرض يغيّر المشاركة في التخطيط', 'Display changes layout participation', '`display` يحدد طريقة ظهور العنصر ضمن التخطيط. عندما تكون قيمته `none` لا يُعرض العنصر ولا يُحجز له مكان، كما لو لم يكن موجودًا في ترتيب الصفحة.', '`display` controls how an element participates in layout. With `none`, the element is not rendered and takes up no space, as if absent from the page flow.'),
      step('الرؤية تخفي المحتوى', 'Visibility hides the content', 'القيمة `visibility: hidden` تخفي العنصر عن العين، لكن مكانه يبقى محجوزًا. قد تبدو هناك فجوة، لأن بقية العناصر لا تنتقل لملء ذلك المكان.', '`visibility: hidden` hides the element from view but preserves its space. A gap may remain because other elements do not move into that space.'),
      step('اختر السلوك المقصود', 'Choose the intended behavior', 'في المثال، `display: none` يزيل صندوق المثال من التخطيط، بينما `visibility: hidden` يترك مكانه. استخدم كل خاصية حسب الأثر المطلوب، لا لمجرد أن كليهما يخفي المحتوى.', 'In the example, `display: none` removes the sample box from layout, while `visibility: hidden` leaves its space. Choose the property for its intended effect, not merely because both hide content.'),
    ] as [FoundationStep, FoundationStep, FoundationStep],
    example_code: '.display-card { display: inline-block; }\n.visibility-card { visibility: hidden; }\n.removed-card { display: none; }',
    code_explanation: [
      explanation('display: inline-block;', 'يعرض البطاقة ضمن السطر مع إمكان ضبط أبعادها.', 'Displays the card inline while allowing its dimensions to be set.'),
      explanation('visibility: hidden;', 'يخفي البطاقة بصريًا ويترك المساحة التي كانت تشغلها.', 'Hides the card visually while leaving its former space.'),
      explanation('display: none;', 'لا يعرض البطاقة ولا يترك لها مساحة في التخطيط.', 'Does not render the card or leave space for it in layout.'),
    ],
    practice_ar: '١. على `.display-card`، اضبط `display` على `inline-block`. ٢. على `.visibility-card`، اضبط `visibility` على `hidden`. ٣. على `.removed-card`، اضبط `display` على `none`.',
    practice_en: '1. On `.display-card`, set `display` to `inline-block`. 2. On `.visibility-card`, set `visibility` to `hidden`. 3. On `.removed-card`, set `display` to `none`.',
    starter_html: '<div class="display-card">Inline card</div>\n<div class="visibility-card">Hidden, space kept</div>\n<div class="removed-card">Hidden, no space</div>\n<p>Compare the surrounding layout.</p>',
    starter_css: '', starter_js: '',
    quiz: quiz(
      ['display-q1', ['What happens to layout space when an element has `display: none`?', 'ماذا يحدث لمساحة العنصر عندما تكون قيمته `display: none`؟', 'العنصر لا يُعرض ولا يترك مساحة في التخطيط.', 'The element is not rendered and leaves no space in layout.', 1, [['يصبح شفافًا لكنه يحتفظ بمساحته', 'It becomes transparent but keeps its space'], ['يُزال من العرض ولا يشغل مساحة', 'It is removed from rendering and takes no space'], ['ينتقل خلف العنصر التالي', 'It moves behind the next element'], ['يختفي نصه لكن يكبر صندوقه', 'Its text is hidden but its box grows']]]],
      ['display-q2', ['What does `visibility: hidden` do to the element’s former space?', 'ماذا يحدث للمساحة التي كان يشغلها العنصر مع `visibility: hidden`؟', 'تبقى المساحة محجوزة رغم اختفاء العنصر عن النظر.', 'The space remains reserved even though the element is hidden from view.', 0, [['يبقى مكانه محفوظًا في التخطيط', 'It remains in the layout'], ['ينهار دائمًا', 'It is always collapsed'], ['يتحول إلى حشو في العنصر الأب', 'It turns into padding on the parent'], ['يصبح هامشًا للعنصر التالي', 'It becomes a margin on the next element']]]],
      ['display-q3', ['Which property value removes an element from layout?', 'أي قيمة خاصية تزيل العنصر من التخطيط؟', 'القيمة `none` مع `display` تزيل العنصر ومساحته من التخطيط.', 'The value `none` on `display` removes the element and its space from layout.', 2, [['`visibility: hidden`', '`visibility: hidden`'], ['`display: inline-block`', '`display: inline-block`'], ['`display: none`', '`display: none`'], ['`visibility: visible`', '`visibility: visible`']]]],
    ),
    validation_rules: [
      declaration('display-card-mode', '.display-card', 'display', 'inline-block', 'على `.display-card` اضبط `display` على `inline-block`.', 'On `.display-card`, set `display` to `inline-block`.'),
      declaration('visibility-card-hidden', '.visibility-card', 'visibility', 'hidden', 'على `.visibility-card` اضبط `visibility` على `hidden`.', 'On `.visibility-card`, set `visibility` to `hidden`.'),
      declaration('removed-card-display', '.removed-card', 'display', 'none', 'على `.removed-card` اضبط `display` على `none`.', 'On `.removed-card`, set `display` to `none`.'),
    ],
  },
  'css-positioning': {
    path_id: 'css-fundamentals', title_ar: 'التموضع وترتيب الطبقات', title_en: 'Positioning and Stacking',
    objective_ar: 'استخدم التموضع النسبي والمطلق، وافهم كيف يساعد `z-index` في ترتيب العناصر المتداخلة.',
    objective_en: 'Use relative and absolute positioning, and understand how `z-index` helps order overlapping elements.',
    outcome_ar: 'أستطيع إنشاء شارة موضوعة داخل بطاقة والتحكم في ظهورها فوق المحتوى.',
    outcome_en: 'I can place a badge inside a card and control whether it appears above the content.',
    steps: [
      step('أنشئ مرجعًا بـ relative', 'Create a reference with relative', 'العنصر ذو `position: relative` يبقى في موضعه المعتاد ما لم تضف له إزاحة، لكنه يصبح مرجعًا للعناصر المطلقة الموجودة داخله.', 'An element with `position: relative` stays in its normal place unless offsets are added, and becomes a reference for absolutely positioned descendants.'),
      step('ضع عنصرًا بـ absolute', 'Place an element with absolute', 'تُخرج `position: absolute` العنصر من التدفق المعتاد. إذا كان داخل أب مموضع، تُحسب إزاحاته مثل `top` و`right` من ذلك الأب، لا من الصفحة كلها.', '`position: absolute` removes the element from normal flow. If it is inside a positioned parent, offsets such as `top` and `right` are measured from that parent rather than the whole page.'),
      step('رتّب التداخل بـ z-index', 'Order overlap with z-index', 'عندما تتداخل العناصر، تساعد قيمة `z-index` على تحديد أيها يظهر فوق الآخر في سياق الترتيب المناسب. القيمة الأعلى تظهر أمام الأقل ضمن السياق نفسه.', 'When elements overlap, `z-index` helps determine which one appears on top in the relevant stacking context. A higher value appears in front of a lower one within the same context.'),
    ] as [FoundationStep, FoundationStep, FoundationStep],
    example_code: '.stage { position: relative; }\n.badge { position: absolute; top: 8px; right: 8px; z-index: 2; }',
    code_explanation: [
      explanation('position: relative;', 'يجعل البطاقة مرجعًا لإزاحات الشارة داخلها.', 'Makes the card a reference for offsets of the badge inside it.'),
      explanation('position: absolute;', 'يضع الشارة خارج التدفق المعتاد لتُحدد إزاحتها بالنسبة إلى البطاقة.', 'Places the badge outside normal flow so its offsets can be set relative to the card.'),
      explanation('z-index: 2;', 'يرفع أولوية الشارة في ترتيب الطبقات عند تداخلها مع محتوى آخر.', 'Raises the badge in the stacking order when it overlaps other content.'),
    ],
    practice_ar: '١. على `.stage`، اضبط `position` على `relative`. ٢. على `.badge`، اضبط `position` على `absolute`. ٣. على `.badge`، اضبط `z-index` على `2`.',
    practice_en: '1. On `.stage`, set `position` to `relative`. 2. On `.badge`, set `position` to `absolute`. 3. On `.badge`, set `z-index` to `2`.',
    starter_html: '<article class="stage">\n  <span class="badge">Featured</span>\n  <h2>Card title</h2>\n  <p>The badge sits inside this card.</p>\n</article>',
    starter_css: '', starter_js: '',
    quiz: quiz(
      ['position-q1', ['Why set the card to `position: relative`?', 'لماذا نضبط البطاقة على `position: relative`؟', 'تصبح البطاقة مرجع الإزاحة للعنصر المطلق الموجود داخلها.', 'The card becomes the offset reference for an absolutely positioned element inside it.', 1, [['يخفي جميع العناصر الأبناء', 'It hides all of its children'], ['يمكن أن يكون مرجع التموضع لابنه ذي التموضع المطلق', 'It can act as the positioning reference for its absolute child'], ['يجعل كل الأبناء ثابتين بالنسبة إلى الشاشة', 'It makes every child fixed to the screen'], ['يضبط z-index لكل ابن تلقائيًا', 'It automatically sets every child’s z-index']]]],
      ['position-q2', ['What is a common effect of `position: absolute`?', 'ما الأثر الشائع لـ `position: absolute`؟', 'العنصر المطلق لا يأخذ مكانًا في التدفق المعتاد للصفحة.', 'An absolutely positioned element does not occupy space in normal page flow.', 0, [['يخرج من التدفق المعتاد', 'It is removed from normal flow'], ['يتحول إلى عقدة نصية مضمّنة', 'It becomes an inline text node'], ['يرث عرض العنصر الأب في كل الحالات', 'It inherits its parent’s width in every case'], ['لا يعود قادرًا على التداخل مع عناصر أخرى', 'It can no longer overlap other elements']]]],
      ['position-q3', ['Within the same stacking context, which `z-index` generally places an element in front?', 'ضمن سياق الترتيب نفسه، أي `z-index` يضع العنصر أمام غيره عادةً؟', 'القيمة الأعلى تتقدم على القيمة الأقل ضمن السياق نفسه.', 'The higher value goes in front of the lower one within the same context.', 3, [['`z-index: 0` always', '`z-index: 0` always'], ['القيمة الأصغر', 'The smaller value'], ['القيمة المكتوبة أولًا', 'The value written first'], ['القيمة الأعلى', 'The higher value']]]],
    ),
    validation_rules: [
      declaration('stage-position-relative', '.stage', 'position', 'relative', 'على `.stage` اضبط `position` على `relative`.', 'On `.stage`, set `position` to `relative`.'),
      declaration('badge-position-absolute', '.badge', 'position', 'absolute', 'على `.badge` اضبط `position` على `absolute`.', 'On `.badge`, set `position` to `absolute`.'),
      declaration('badge-layer-order', '.badge', 'z-index', '2', 'على `.badge` اضبط `z-index` على `2`.', 'On `.badge`, set `z-index` to `2`.'),
    ],
  },
  'css-grid': {
    path_id: 'css-fundamentals', title_ar: 'تخطيط الشبكة بـ Grid', title_en: 'Grid Layout',
    objective_ar: 'أنشئ شبكة من عمودين باستخدام `display: grid` و`grid-template-columns` و`gap`.',
    objective_en: 'Create a two-column grid with `display: grid`, `grid-template-columns`, and `gap`.',
    outcome_ar: 'أستطيع تحويل حاوية إلى شبكة، وتحديد أعمدتها والمسافة بين خلاياها.',
    outcome_en: 'I can turn a container into a grid and set its columns and the spacing between items.',
    steps: [
      step('فعّل الشبكة', 'Turn on grid', 'عندما تضبط `display: grid` على الحاوية، تصبح العناصر المباشرة داخلها عناصر شبكة، ويمكن ترتيبها في صفوف وأعمدة.', 'When you set `display: grid` on a container, its direct children become grid items that can be arranged in rows and columns.'),
      step('حدّد الأعمدة', 'Define columns', 'القيمة `repeat(2, 1fr)` تعني عمودين متساويين. `fr` وحدة توزّع الجزء المتاح من مساحة الشبكة؛ هنا يأخذ كل عمود جزءًا متساويًا.', 'The value `repeat(2, 1fr)` means two equal columns. `fr` distributes available grid space; here each column receives an equal share.'),
      step('أضف فراغًا', 'Add spacing', 'تضبط `gap` المسافة بين صفوف الشبكة وأعمدتها. لا حاجة لإضافة هامش إلى كل بطاقة لمجرد فصل البطاقات المتجاورة.', '`gap` sets the space between grid rows and columns. You do not need to add a margin to every card just to separate neighboring cards.'),
    ] as [FoundationStep, FoundationStep, FoundationStep],
    example_code: '.gallery {\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 16px;\n}',
    code_explanation: [
      explanation('display: grid;', 'يحوّل الحاوية إلى شبكة ترتب أبناءها المباشرين.', 'Turns the container into a grid that arranges its direct children.'),
      explanation('grid-template-columns: repeat(2, 1fr);', 'ينشئ عمودين يتقاسمان المساحة المتاحة بالتساوي.', 'Creates two columns that share the available space equally.'),
      explanation('gap: 16px;', 'يترك مسافة 16px بين عناصر الشبكة.', 'Leaves 16px of space between grid items.'),
    ],
    practice_ar: '١. على `.gallery`، اضبط `display` على `grid`. ٢. على `.gallery`، اضبط `grid-template-columns` على `repeat(2, 1fr)`. ٣. على `.gallery`، اضبط `gap` على `16px`.',
    practice_en: '1. On `.gallery`, set `display` to `grid`. 2. On `.gallery`, set `grid-template-columns` to `repeat(2, 1fr)`. 3. On `.gallery`, set `gap` to `16px`.',
    starter_html: '<section class="gallery">\n  <article class="tile">North</article>\n  <article class="tile">South</article>\n  <article class="tile">East</article>\n  <article class="tile">West</article>\n</section>',
    starter_css: '', starter_js: '',
    quiz: quiz(
      ['grid-q1', ['Which declaration makes `.gallery` a grid container?', 'أي تصريح يحوّل `.gallery` إلى حاوية شبكة؟', '`display: grid` هو التصريح الذي يفعّل تخطيط الشبكة للحاوية.', '`display: grid` enables grid layout on the container.', 2, [['`position: grid`', '`position: grid`'], ['`grid-template: display`', '`grid-template: display`'], ['`display: grid`', '`display: grid`'], ['`gap: grid`', '`gap: grid`']]]],
      ['grid-q2', ['What does `repeat(2, 1fr)` create for columns?', 'ماذا تنشئ `repeat(2, 1fr)` للأعمدة؟', 'تنشئ عمودين يتقاسمان المساحة بالتساوي.', 'It creates two columns that share space equally.', 1, [['عمودان ثابتان بعرض 1px', 'Two fixed 1px columns'], ['عمودان متساويان', 'Two equal columns'], ['عمود واحد ذو حدين', 'One column with two borders'], ['صفان بلا أعمدة', 'Two rows and no columns']]]],
      ['grid-q3', ['What does `gap: 16px` control in this grid?', 'ما الذي تتحكم به `gap: 16px` في هذه الشبكة؟', '`gap` تحدد الفراغ بين عناصر الشبكة.', '`gap` sets the spacing between grid items.', 0, [['المسافة بين صفوف الشبكة وأعمدتها', 'The space between grid rows and columns'], ['عرض كل عنصر في الشبكة', 'The width of every grid item'], ['حجم النص في كل بطاقة', 'The text size in each card'], ['الهامش الخارجي للصفحة فقط', 'The outer page margin only']]]],
    ),
    validation_rules: [
      declaration('gallery-display-grid', '.gallery', 'display', 'grid', 'على `.gallery` اضبط `display` على `grid`.', 'On `.gallery`, set `display` to `grid`.'),
      declaration('gallery-two-columns', '.gallery', 'grid-template-columns', 'repeat(2, 1fr)', 'على `.gallery` اضبط عمودين متساويين: `repeat(2, 1fr)`.', 'On `.gallery`, set two equal columns with `repeat(2, 1fr)`.'),
      declaration('gallery-gap', '.gallery', 'gap', '16px', 'على `.gallery` اضبط المسافة على `16px`.', 'On `.gallery`, set the gap to `16px`.'),
    ],
  },
  'css-pseudo-selectors': {
    path_id: 'css-fundamentals', title_ar: 'الحالات والعناصر الزائفة', title_en: 'Pseudo-classes and Pseudo-elements',
    objective_ar: 'استخدم `:hover` لاختيار حالة تفاعل، و`::before` لإضافة محتوى زخرفي مرتبط بالعنصر.',
    objective_en: 'Use `:hover` to target an interaction state and `::before` to add decorative content associated with an element.',
    outcome_ar: 'أستطيع كتابة محدد لحالة المؤشر ومحدد لعنصر زائف مع تصريحاتهما.',
    outcome_en: 'I can write a selector for a hover state and one for a pseudo-element, with their declarations.',
    steps: [
      step('حالة تفاعل بـ :hover', 'An interaction state with :hover', 'الجزء `:hover` يختار العنصر أثناء وجود مؤشر الفأرة فوقه. هو حالة للعنصر نفسه؛ لذلك لا تضف عنصر HTML جديدًا عند كتابة المحدد.', 'The `:hover` part selects an element while the pointer is over it. It is a state of the element itself, so it does not add a new HTML element.'),
      step('محتوى مرتبط بـ ::before', 'Associated content with ::before', 'يختار `::before` موضعًا تولّده CSS قبل المحتوى العادي للعنصر. يمكن استخدام `content` لنص قصير أو رمز؛ أما المحتوى المهم فينبغي أن يكون في HTML.', '`::before` selects a position generated by CSS before an element’s normal content. `content` can add a short label or symbol; important content should be in HTML.'),
      step('لاحظ النقطتين', 'Notice the colons', 'تستخدم حالة مثل `:hover` نقطتين، بينما نكتب العنصر الزائف مثل `::before` بنقطتين لتمييزه. راجع المحددين في المثال والتزم بتهجئتهما.', 'A state such as `:hover` uses one colon, while a pseudo-element such as `::before` is written with two. Review both selectors in the example and spell them exactly.'),
    ] as [FoundationStep, FoundationStep, FoundationStep],
    example_code: '.action:hover { background-color: #dbeafe; }\n.note::before { content: "Note: "; }',
    code_explanation: [
      explanation('.action:hover', 'يختار عنصر action عندما يكون مؤشر الفأرة فوقه.', 'Selects the action element while the pointer is over it.'),
      explanation('background-color: #dbeafe;', 'يغيّر خلفية العنصر في حالة التحويم.', 'Changes the element’s background in the hover state.'),
      explanation('.note::before { content: "Note: "; }', 'ينشئ نصًا قصيرًا قبل محتوى `.note` العادي.', 'Generates a short text string before the normal content of `.note`.'),
    ],
    practice_ar: '١. أضف المحدد `.action:hover`. ٢. على `.action:hover`، اضبط `background-color` على `#dbeafe`. ٣. أضف `.note::before` مع `content: "Note: "` لتوليد نص قصير قبل المحتوى.',
    practice_en: '1. Add the `.action:hover` selector. 2. On `.action:hover`, set `background-color` to `#dbeafe`. 3. Add `.note::before` with `content: "Note: "` to generate a short label before the content.',
    starter_html: '<button class="action" type="button">Point here</button>\n<p class="note">Keep essential information in the HTML.</p>',
    starter_css: '', starter_js: '',
    quiz: quiz(
      ['pseudo-q1', ['What does `.action:hover` select?', 'ما الذي يختاره `.action:hover`؟', 'يختار العنصر ذي الفئة action أثناء وجود المؤشر فوقه.', 'It selects the action element while the pointer is over it.', 1, [['كل عنصر action طوال الوقت', 'Every action element permanently'], ['عنصر action أثناء مرور المؤشر فوقه', 'An action element while the pointer is over it'], ['أول عنصر ابن داخل كل عنصر action', 'The first child of every action element'], ['عنصر HTML جديد اسمه hover فقط', 'Only a new HTML element named hover']]]],
      ['pseudo-q2', ['What does `::before` represent?', 'إلى ماذا يشير `::before`؟', 'يختار موضعًا لمحتوى تولّده CSS قبل المحتوى العادي للعنصر.', 'It selects a position for CSS-generated content before the element’s normal content.', 0, [['موضع لمحتوى مولّد قبل محتوى العنصر المعتاد', 'A generated-content position before the element’s normal content'], ['وسم HTML جديد يجب كتابته داخل الصفحة', 'A new HTML tag that must be typed into the page'], ['حالة hover على العنصر الأب', 'A hover state on the parent'], ['أول تصريح CSS في الملف', 'The first CSS declaration in a file']]]],
      ['pseudo-q3', ['Which selector is written with the pseudo-element colon form?', 'أي محدد يُكتب بصيغة النقطتين للعنصر الزائف؟', 'يكتب العنصر الزائف `::before` بنقطتين.', 'The pseudo-element `::before` is written with two colons.', 3, [['`.note:before:hover` only', '`.note:before:hover` only'], ['`.note::hover`', '`.note::hover`'], ['`.before.note`', '`.before.note`'], ['`.note::before`', '`.note::before`']]]],
    ),
    validation_rules: [
      selector('action-hover-selector', '.action:hover', 'أضف محدد حالة التحويم `.action:hover`.', 'Add the `.action:hover` hover-state selector.'),
      declaration('action-hover-background', '.action:hover', 'background-color', '#dbeafe', 'على `.action:hover` اضبط الخلفية على `#dbeafe`.', 'On `.action:hover`, set the background to `#dbeafe`.'),
      declaration('note-before-content', '.note::before', 'content', '"Note: "', 'في `.note::before`، أضف `content: "Note: "`.', 'In `.note::before`, add `content: "Note: "`. '),
    ],
  },
  'css-custom-properties': {
    path_id: 'css-fundamentals', title_ar: 'خصائص CSS المخصّصة', title_en: 'CSS Custom Properties',
    objective_ar: 'عرّف قيمًا قابلة لإعادة الاستخدام بصيغة `--name`، ثم استدعها باستخدام `var()` في أكثر من عنصر.',
    objective_en: 'Define reusable values with the `--name` syntax, then use them with `var()` on more than one element.',
    outcome_ar: 'أستطيع تعريف لون مخصص وإعادة استخدامه في لون النص والخلفية.',
    outcome_en: 'I can define a custom color and reuse it for text and background colors.',
    steps: [
      step('عرّف قيمة باسم واضح', 'Define a clearly named value', 'تبدأ الخاصية المخصصة بشرطتين، مثل `--accent`. يمكن تعريفها على `:root` لتكون متاحة في أنحاء الصفحة عبر الوراثة.', 'A custom property starts with two hyphens, such as `--accent`. Defining it on `:root` makes it available across the page through inheritance.'),
      step('استدعها باستخدام var()', 'Use it with var()', 'اكتب `var(--accent)` في موضع قيمة CSS لاستعمال اللون المعرّف بدل تكرار رمزه. إذا لم تكن الخاصية متاحة، يمكن إضافة قيمة احتياطية داخل `var()` مثل `var(--accent, teal)`.', 'Write `var(--accent)` where a CSS value is expected to reuse the defined color instead of repeating its code. If the property is unavailable, `var()` can include a fallback such as `var(--accent, teal)`.'),
      step('اجعل التعديل مركزيًا', 'Keep changes in one place', 'في المثال، تغيّر تعريف `--accent` مرة واحدة ثم تستخدمه البطاقات والعنوان. هذا يسهل توحيد الألوان وتحديثها لاحقًا.', 'In the example, change `--accent` once and reuse it for the card and heading. This makes colors consistent and easier to update later.'),
    ] as [FoundationStep, FoundationStep, FoundationStep],
    example_code: ':root { --accent: #2457c5; }\n.banner { color: var(--accent); }\n.banner__tag { background-color: var(--accent); }',
    code_explanation: [
      explanation('--accent: #2457c5;', 'يعرّف لونًا مخصصًا اسمه `--accent` على الجذر.', 'Defines a custom color named `--accent` on the root.'),
      explanation('color: var(--accent);', 'يقرأ القيمة المعرّفة ويستخدمها كلون للنص.', 'Reads the defined value and uses it as the text color.'),
      explanation('background-color: var(--accent);', 'يعيد استخدام اللون نفسه لخلفية الشارة.', 'Reuses the same color for the tag background.'),
    ],
    practice_ar: '١. على `:root`، عرّف `--accent` بالقيمة `#2457c5`. ٢. على `.banner`، اجعل `color` يساوي `var(--accent)`. ٣. على `.banner__tag`، اجعل `background-color` يساوي `var(--accent)`.',
    practice_en: '1. On `:root`, define `--accent` as `#2457c5`. 2. On `.banner`, set `color` to `var(--accent)`. 3. On `.banner__tag`, set `background-color` to `var(--accent)`.',
    starter_html: '<section class="banner">\n  <h2>One shared color</h2>\n  <span class="banner__tag">Featured</span>\n</section>',
    starter_css: '', starter_js: '',
    quiz: quiz(
      ['custom-props-q1', ['How does a CSS custom property name begin?', 'بماذا يبدأ اسم الخاصية المخصصة في CSS؟', 'يبدأ الاسم بشرطتين، مثل `--accent`.', 'The name begins with two hyphens, such as `--accent`.', 2, [['A dollar sign, as in `$accent`', 'A dollar sign, as in `$accent`'], ['A hash, as in `#accent`', 'A hash, as in `#accent`'], ['Two hyphens, as in `--accent`', 'Two hyphens, as in `--accent`'], ['An at sign, as in `@accent`', 'An at sign, as in `@accent`']]]],
      ['custom-props-q2', ['Which function reads a custom property in a declaration?', 'أي دالة تقرأ الخاصية المخصصة داخل التصريح؟', '`var()` تستدعي قيمة الخاصية المخصصة.', '`var()` retrieves the custom property’s value.', 0, [['`var(--accent)`', '`var(--accent)`'], ['`use(--accent)`', '`use(--accent)`'], ['`value(--accent)`', '`value(--accent)`'], ['`get(--accent)`', '`get(--accent)`']]]],
      ['custom-props-q3', ['Why define `--accent` on `:root` in this example?', 'لماذا نعرّف `--accent` على `:root` في هذا المثال؟', 'لتكون القيمة مشتركة ومتاحة للعناصر التابعة في أنحاء الصفحة.', 'So the value is shared and available to descendants across the page.', 1, [['لإيقاف الوراثة', 'To turn off inheritance'], ['لإتاحة القيمة على نطاق واسع عبر الوراثة', 'To make the value available broadly through inheritance'], ['لتحويل القيمة إلى HTML', 'To convert the value into HTML'], ['لقصرها على العنوان الأول فقط', 'To restrict it to the first heading only']]]],
    ),
    validation_rules: [
      declaration('root-accent-variable', ':root', '--accent', '#2457c5', 'على `:root` عرّف `--accent` بالقيمة `#2457c5`.', 'On `:root`, define `--accent` as `#2457c5`.'),
      declaration('banner-accent-text', '.banner', 'color', 'var(--accent)', 'على `.banner` استخدم `var(--accent)` للون النص.', 'On `.banner`, use `var(--accent)` for the text color.'),
      declaration('tag-accent-background', '.banner__tag', 'background-color', 'var(--accent)', 'على `.banner__tag` استخدم `var(--accent)` للخلفية.', 'On `.banner__tag`, use `var(--accent)` for the background.'),
    ],
  },
  'css-web-fonts-surfaces': {
    path_id: 'css-fundamentals', title_ar: 'الخطوط والأسطح والظلال', title_en: 'Web Fonts, Surfaces, and Shadows',
    objective_ar: 'أنشئ قائمة خطوط احتياطية مفهومة، وتعرّف فكرة `@font-face`، واستخدم ظلالًا خفيفة لتمييز السطح.',
    objective_en: 'Create a clear font fallback list, understand the idea behind `@font-face`, and use subtle shadows to distinguish a surface.',
    outcome_ar: 'أستطيع اختيار خط مع بديل عام وإضافة ظل بسيط للبطاقة.',
    outcome_en: 'I can choose a font with a generic fallback and add a subtle shadow to a card.',
    steps: [
      step('اكتب بدائل الخط', 'Provide font fallbacks', 'تُكتب أسماء الخطوط بالترتيب في `font-family`. يجرب المتصفح أول اسم متاح، ثم ينتقل إلى البديل التالي؛ أنهِ القائمة بعائلة عامة مثل `sans-serif` أو `serif`.', 'Font names are listed in order in `font-family`. The browser tries the first available font, then the next; finish with a generic family such as `sans-serif` or `serif`.'),
      step('ما وظيفة @font-face؟', 'What does @font-face do?', 'تسمح قاعدة `@font-face` بتسجيل خط من ملف يحدد مصدره بواسطة `src` واسم العائلة الذي ستستعمله القواعد. يلزم ملف خط ومسار صالحان؛ هذا الدرس يشرح الفكرة ولا يطلب كتابة مسار ملف غير موجود.', 'An `@font-face` rule registers a font file by specifying its source with `src` and the family name other rules will use. A valid font file and path are needed; this lesson explains the idea without requiring a nonexistent file path.'),
      step('أضف عمقًا هادئًا', 'Add subtle depth', '`box-shadow` تضيف ظلًا حول صندوق البطاقة. اجعل الإزاحة والانتشار واللون معتدلة حتى يبقى النص واضحًا ولا يبدو السطح مرتفعًا أكثر من اللازم.', '`box-shadow` adds a shadow around the card box. Keep its offset, blur, and color restrained so text remains clear and the surface does not look excessively raised.'),
    ] as [FoundationStep, FoundationStep, FoundationStep],
    example_code: '.reading-card {\n  font-family: Georgia, "Times New Roman", serif;\n  box-shadow: 0 4px 14px rgba(20, 30, 50, 0.12);\n}\n/* @font-face can register a real font file for a named family. */',
    code_explanation: [
      explanation('font-family: Georgia, "Times New Roman", serif;', 'يجرب المتصفح Georgia، ثم Times New Roman، ثم خط serif متاحًا.', 'The browser tries Georgia, then Times New Roman, then an available serif font.'),
      explanation('box-shadow: 0 4px 14px rgba(20, 30, 50, 0.12);', 'يضيف ظلًا خفيفًا أسفل البطاقة وحولها.', 'Adds a subtle shadow below and around the card.'),
      explanation('@font-face', 'تُعرّف عائلة خط مرتبطة بملف خط حقيقي ومصدره؛ لا يكفي ذكر اسم الخط وحده لتحميل ملف.', 'Registers a font family tied to a real font file and its source; naming a font alone does not load a file.'),
    ],
    practice_ar: '١. على `.reading-card`، اضبط `font-family` على `Georgia, "Times New Roman", serif`. ٢. على `.reading-card`، اضبط `box-shadow` على `0 4px 14px rgba(20, 30, 50, 0.12)`.',
    practice_en: '1. On `.reading-card`, set `font-family` to `Georgia, "Times New Roman", serif`. 2. On `.reading-card`, set `box-shadow` to `0 4px 14px rgba(20, 30, 50, 0.12)`.',
    starter_html: '<article class="reading-card">\n  <h2>A quiet surface</h2>\n  <p>A readable font stack works even when the preferred font is unavailable.</p>\n</article>',
    starter_css: '', starter_js: '',
    quiz: quiz(
      ['fonts-q1', ['Why end a font stack with a generic family such as `serif`?', 'لماذا ننهي قائمة الخطوط بعائلة عامة مثل `serif`؟', 'لضمان وجود بديل عام إذا لم تتوفر الأسماء السابقة.', 'To provide a generic fallback if the earlier fonts are unavailable.', 3, [['لإجبار المتصفح على تنزيل كل الخطوط', 'To force the browser to download every font'], ['لجعل النص عريضًا', 'To make the text bold'], ['لتعطيل أسماء الخطوط الأخرى', 'To disable the other font names'], ['لتوفير خط بديل عام', 'To provide a generic fallback']]]],
      ['fonts-q2', ['What does `@font-face` let a stylesheet do?', 'ما الذي تتيحه `@font-face` لورقة الأنماط؟', 'تسجيل خط بربطه بملف ومصدر صالحين لاستخدام اسمه في القواعد.', 'Register a font by connecting its name to a valid font file and source.', 1, [['لتحديد عرض كل ملف خط', 'Set the width of every font file'], ['لتسجيل خط مسمى وربطه بملف خط', 'Register a named font linked to a font file'], ['لإضافة ظل إلى النص تلقائيًا', 'Add a shadow to text automatically'], ['لاختيار خط serif العام في المتصفح باستخدام URL', 'Choose the browser’s generic serif font by URL']]]],
      ['fonts-q3', ['Which property adds a shadow around a card’s box?', 'أي خاصية تضيف ظلًا حول صندوق البطاقة؟', '`box-shadow` تنسق ظل الصندوق؛ أما `text-shadow` فتخص النص.', '`box-shadow` styles a box shadow; `text-shadow` is for text.', 0, [['`box-shadow`', '`box-shadow`'], ['`font-shadow`', '`font-shadow`'], ['`surface-shadow`', '`surface-shadow`'], ['`text-outline`', '`text-outline`']]]],
    ),
    validation_rules: [
      declaration('reading-card-font-stack', '.reading-card', 'font-family', 'Georgia, "Times New Roman", serif', 'على `.reading-card` استخدم قائمة Georgia ثم Times New Roman ثم serif.', 'On `.reading-card`, use the Georgia, Times New Roman, serif fallback stack.'),
      declaration('reading-card-shadow', '.reading-card', 'box-shadow', '0 4px 14px rgba(20, 30, 50, 0.12)', 'على `.reading-card` أضف قيمة الظل المحددة.', 'On `.reading-card`, add the specified shadow value.'),
    ],
  },
  'css-motion': {
    path_id: 'css-fundamentals', title_ar: 'الانتقالات والحركة المراعية للتفضيلات', title_en: 'Transitions and Reduced Motion',
    objective_ar: 'أنشئ انتقالًا قصيرًا لتغير لوني، ثم أوقفه لمن يطلب تقليل الحركة عبر استعلام وسائط مناسب.',
    objective_en: 'Create a short transition for a color change, then disable it for people who request reduced motion with a suitable media query.',
    outcome_ar: 'أستطيع إضافة انتقال لزر واحترام تفضيل تقليل الحركة، ثم أطبق ذلك في صفحة متجاوبة وأراجع أخطاء التنسيق.',
    outcome_en: 'I can add a transition to a button and respect reduced-motion preferences, then apply it in a responsive page and inspect styling errors.',
    steps: [
      step('انتقال قصير', 'A short transition', 'تحدد `transition` الخاصية التي يتغير مظهرها ومدة التغير وطريقته. مثل `background-color 200ms ease` لتدرج لون الخلفية خلال 200 ملي ثانية بدل القفز الفوري.', '`transition` names the property whose appearance changes, its duration, and timing. For example, `background-color 200ms ease` eases a background color over 200 milliseconds instead of changing instantly.'),
      step('استمع لتفضيل الحركة', 'Respect motion preferences', 'يكشف الاستعلام `@media (prefers-reduced-motion: reduce)` أن الزائر يفضّل تقليل الحركة. ضع داخله تنسيقًا بديلًا، مثل `transition: none`، كي لا تفرض الحركة على من طلب تقليلها.', 'The `@media (prefers-reduced-motion: reduce)` query detects a visitor preference for less motion. Put an alternative style inside it, such as `transition: none`, so the animation is not imposed on someone who requested less motion.'),
      step('اجعل التغيير مفهومًا', 'Keep the change understandable', 'الانتقال تحسين بصري وليس شرطًا لفهم الحالة. احتفظ بتغير واضح عند التحويم، لكن أزل مدة الحركة عند تحقق تفضيل تقليل الحركة.', 'A transition is a visual enhancement, not a requirement for understanding a state. Keep a clear hover change, but remove the motion duration when reduced motion is requested.'),
    ] as [FoundationStep, FoundationStep, FoundationStep],
    example_code: '.motion-button { transition: background-color 200ms ease; }\n@media (prefers-reduced-motion: reduce) {\n  .motion-button { transition: none; }\n}',
    code_explanation: [
      explanation('transition: background-color 200ms ease;', 'يمهّل تغير لون الخلفية مدة قصيرة.', 'Smooths a background-color change over a short duration.'),
      explanation('@media (prefers-reduced-motion: reduce)', 'يطبق القاعدة عند طلب المستخدم تقليل الحركة.', 'Applies the rule when the user requests reduced motion.'),
      explanation('transition: none;', 'يلغي الانتقال في حالة تفضيل تقليل الحركة.', 'Removes the transition for the reduced-motion preference.'),
    ],
    practice_ar: '١. على `.motion-button` خارج استعلام الوسائط، اضبط `transition` على `background-color 200ms ease`. ٢. أضف استعلام `@media (prefers-reduced-motion: reduce)`. ٣. داخله، اضبط `transition` للزر على `none`.',
    practice_en: '1. On `.motion-button` outside a media query, set `transition` to `background-color 200ms ease`. 2. Add the `@media (prefers-reduced-motion: reduce)` query. 3. Inside it, set the button’s `transition` to `none`.',
    starter_html: '<button class="motion-button" type="button">Hover to see a color change</button>',
    starter_css: '', starter_js: '',
    quiz: quiz(
      ['motion-q1', ['What does `transition: background-color 200ms ease` describe?', 'ما الذي يصفه `transition: background-color 200ms ease`؟', 'يحدد تدرج تغير لون الخلفية خلال 200 ملي ثانية.', 'It describes an eased background-color change over 200 milliseconds.', 1, [['صورة خلفية أبعادها 200px', 'A 200px background image'], ['تغيير background-color خلال 200 millisecond', 'A background-color change over 200 milliseconds'], ['تأخير دائم قبل تحميل كل صفحة', 'A permanent delay before every page load'], ['طلب لإخفاء الزر', 'A request to hide the button']]]],
      ['motion-q2', ['Which media query detects a request for reduced motion?', 'أي استعلام وسائط يكشف طلب تقليل الحركة؟', '`prefers-reduced-motion: reduce` هو الاستعلام المخصص لهذا التفضيل.', '`prefers-reduced-motion: reduce` detects this preference.', 0, [['`@media (prefers-reduced-motion: reduce)`', '`@media (prefers-reduced-motion: reduce)`'], ['`@media (motion: always)`', '`@media (motion: always)`'], ['`@media (transition: none)`', '`@media (transition: none)`'], ['`@media (reduce: background)`', '`@media (reduce: background)`']]]],
      ['motion-q3', ['What is a suitable transition value inside the reduced-motion query?', 'ما قيمة الانتقال المناسبة داخل استعلام تقليل الحركة؟', 'يمكن ضبط `transition: none` لإيقاف الانتقال.', 'Set `transition: none` to turn off the transition.', 2, [['`transition: louder`', '`transition: louder`'], ['`display: reduced`', '`display: reduced`'], ['`transition: none`', '`transition: none`'], ['`motion: 200ms`', '`motion: 200ms`']]]],
    ),
    validation_rules: [
      declaration('motion-button-transition', '.motion-button', 'transition', 'background-color 200ms ease', 'خارج استعلام الوسائط، اضبط انتقال الزر على `background-color 200ms ease`.', 'Outside a media query, set the button transition to `background-color 200ms ease`.', 'outside-media'),
      mediaRule('reduced-motion-query', '@media (prefers-reduced-motion: reduce)', 'أضف استعلام تقليل الحركة المحدد.', 'Add the specified reduced-motion media query.'),
      declarationInMedia('motion-button-reduced-transition', '.motion-button', 'transition', 'none', '(prefers-reduced-motion: reduce)', 'داخل استعلام تقليل الحركة، اضبط انتقال الزر على `none`.', 'Inside the reduced-motion query, set the button transition to `none`.'),
    ],
  },
  'css-layout-debugging': {
    path_id: 'css-fundamentals', title_ar: 'تصحيح أخطاء تنسيق الصفحة', title_en: 'Debugging CSS Layout',
    objective_ar: 'اكتشف خطأ إملائيًا في اسم خاصية CSS، وتحقق من قائمة الخصائص والقيم بدل قبول تصريح مجهول.',
    objective_en: 'Find a typo in a CSS property name and check property names and values instead of accepting an unknown declaration.',
    outcome_ar: 'أستطيع تصحيح `colr` إلى `color` وفحص المحدد والتصريح عند عدم ظهور التنسيق المتوقع.',
    outcome_en: 'I can correct `colr` to `color` and inspect a selector and declaration when styling does not appear as expected.',
    steps: [
      step('ابدأ باسم الخاصية', 'Start with the property name', 'في المثال كُتبت `colr` بدل `color`. المتصفح لا يتعرف على الاسم الخاطئ كخاصية CSS معروفة، لذلك لا يطبّق اللون المطلوب. اختلاف حرف واحد قد يغيّر النتيجة.', 'The example says `colr` instead of `color`. The browser does not recognize the misspelled name as a known CSS property, so it will not apply the intended color. A one-letter difference can change the result.'),
      step('افحص أجزاء القاعدة', 'Inspect the parts of the rule', 'تحقق من أن المحدد يطابق عنصر HTML، وأن الخاصية مكتوبة كما هي، وأن القيمة مناسبة لها. في هذا المثال استبدل اسم الخاصية الخاطئ بـ `color` وأبقِ القيمة `crimson`.', 'Check that the selector matches an HTML element, the property is spelled correctly, and the value suits it. In this example, replace the misspelled property with `color` and keep the value `crimson`.'),
      step('استخدم رسالة التحقق', 'Use the validation feedback', 'قد تشير أداة الفحص إلى خاصية غير معروفة أو إلى تصريح مفقود. أصلح اسم الخاصية أولًا، ثم راجع القاعدة مرة أخرى بدل إضافة تصريح مشابه في موضع عشوائي.', 'A checker may flag an unknown or missing property. Correct the property name first, then review the rule instead of adding a similar declaration in a random place.'),
    ] as [FoundationStep, FoundationStep, FoundationStep],
    example_code: '.debug-card {\n  colr: crimson; /* typo: use color */\n}',
    code_explanation: [
      explanation('colr: crimson;', 'هذا خطأ متعمد: `colr` ليست اسم الخاصية المقصود. استخدم `color` ليُطبّق لون النص.', 'This is an intentional typo: `colr` is not the intended property name. Use `color` to set the text color.'),
      explanation('.debug-card', 'يختار البطاقة التي سنصلح تصريحها.', 'Selects the card whose declaration we will fix.'),
      explanation('color: crimson;', 'التصريح المصحح يضبط لون نص البطاقة على crimson.', 'The corrected declaration sets the card text color to crimson.'),
    ],
    practice_ar: '١. على `.debug-card`، صحّح اسم الخاصية إلى `color` واجعل قيمتها `crimson`. لا تكتب `colr`؛ يجب أن يصبح التصريح الصحيح `color: crimson`.',
    practice_en: '1. On `.debug-card`, correct the property name to `color` and set its value to `crimson`. Do not write `colr`; the correct declaration is `color: crimson`.',
    starter_html: '<article class="debug-card">\n  <h2>Check the declaration</h2>\n  <p>Correct the misspelled CSS property shown in the example.</p>\n</article>',
    starter_css: '.debug-card {\n  colr: crimson;\n}', starter_js: '',
    quiz: quiz(
      ['debug-q1', ['What is wrong with `colr: crimson;`?', 'ما الخطأ في `colr: crimson;`؟', '`colr` خطأ إملائي؛ اسم الخاصية الصحيح هو `color`.', '`colr` is misspelled; the correct property name is `color`.', 3, [['المحدد يفتقد إلى معرّف ID', 'The selector is missing an ID'], ['القيمة يجب أن تكون رقمًا', 'The value needs to be a number'], ['الفاصلة المنقوطة ممنوعة دائمًا', 'The semicolon is always forbidden'], ['اسم الخاصية مكتوب بتهجئة خاطئة', 'The property name is misspelled']]]],
      ['debug-q2', ['Which declaration correctly sets the text color to crimson?', 'أي تصريح يضبط لون النص على crimson بصورة صحيحة؟', '`color` هي الخاصية الصحيحة لتحديد لون النص.', '`color` is the correct property for setting text color.', 1, [['`colour: crimson;`', '`colour: crimson;`'], ['`color: crimson;`', '`color: crimson;`'], ['`crimson: color;`', '`crimson: color;`'], ['`background: text crimson;`', '`background: text crimson;`']]]],
      ['debug-q3', ['What should you check first when a CSS declaration has no visible effect?', 'ما أول ما ينبغي فحصه عندما لا يظهر أثر تصريح CSS؟', 'ابدأ بالتحقق من تطابق المحدد وتهجئة الخاصية وصحة القيمة.', 'Start by checking selector matching, property spelling, and whether the value is valid.', 0, [['ما إذا كان المحدد يطابق العنصر والخاصية والقيمة صالحتين', 'Whether the selector matches and the property and value are valid'], ['ما إذا كان ينبغي إضافة هوامش عشوائية', 'Whether to add random margins'], ['ما إذا كانت HTML تحتاج إلى حدث JavaScript', 'Whether the HTML needs a JavaScript event'], ['ما إذا كان ينبغي إعادة تسمية المتصفح', 'Whether to rename the browser']]]],
    ),
    validation_rules: [
      declaration('debug-card-color-corrected', '.debug-card', 'color', 'crimson', 'صحّح التصريح على `.debug-card` إلى `color: crimson`؛ لا تستخدم `colr`.', 'Correct the declaration on `.debug-card` to `color: crimson`; do not use `colr`.'),
    ],
  },
  'css-responsive-page': {
    path_id: 'css-fundamentals', title_ar: 'صفحة متجاوبة متعددة الأقسام', title_en: 'A Responsive Multi-section Page',
    objective_ar: 'نسّق صفحة تضم رأسًا ومحتوى وشريطًا جانبيًا، ثم غيّر توزيع الأعمدة والمسافات للشاشات الأضيق باستخدام استعلام وسائط.',
    objective_en: 'Style a page with a header, main content, and sidebar, then change its columns and spacing for narrower screens with a media query.',
    outcome_ar: 'أستطيع إعداد تخطيط بعمودين للشاشات الواسعة وتحويله إلى عمود واحد للشاشة الأضيق.',
    outcome_en: 'I can create a two-column layout for wide screens and switch it to one column on a narrower screen.',
    steps: [
      step('قسّم الصفحة إلى مناطق', 'Divide the page into regions', 'استخدم حاوية `.page-layout` حول أقسام المحتوى. على الشاشة الواسعة، يمكن توزيعها في عمود للمحتوى وآخر للشريط الجانبي باستخدام Grid.', 'Use a `.page-layout` container around the content sections. On a wide screen, Grid can arrange them in a content column and a sidebar column.'),
      step('حدّد نقطة التغيير', 'Set a change point', 'يضع استعلام الوسائط القواعد التي تطبق فقط عندما يطابق عرض الشاشة الشرط. في المثال، عند `max-width: 640px` نستخدم عمودًا واحدًا بدل عمودين.', 'A media query holds rules that apply only when the screen width matches its condition. In the example, at `max-width: 640px`, use one column instead of two.'),
      step('اضبط المسافة أيضًا', 'Adjust spacing too', 'قد لا يلائم الفراغ الواسع شاشة الهاتف؛ خفّض `gap` داخل الاستعلام. تخطيط الصفحة المتجاوب يغيّر العرض والمسافات معًا ليبقى المحتوى سهل القراءة.', 'A wide gap may not suit a phone, so reduce `gap` inside the query. A responsive page adjusts both columns and spacing to keep content readable.'),
    ] as [FoundationStep, FoundationStep, FoundationStep],
    example_code: '.page-layout {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n  gap: 24px;\n}\n@media (max-width: 640px) {\n  .page-layout {\n    grid-template-columns: 1fr;\n    gap: 12px;\n  }\n}',
    code_explanation: [
      explanation('grid-template-columns: 2fr 1fr;', 'يعطي المحتوى عمودًا أوسع من عمود الشريط الجانبي على الشاشة الواسعة.', 'Gives the main content a wider column than the sidebar on a wide screen.'),
      explanation('@media (max-width: 640px)', 'يفعّل القواعد التالية عندما لا يزيد عرض الشاشة على 640px.', 'Enables the following rules when the screen is no wider than 640px.'),
      explanation('grid-template-columns: 1fr;', 'يعيد ترتيب الأقسام في عمود واحد على الشاشة الأضيق.', 'Rearranges the sections into one column on the narrower screen.'),
    ],
    practice_ar: '١. على `.page-layout` خارج الاستعلام، اضبط `grid-template-columns` على `2fr 1fr`. ٢. أضف استعلام `@media (max-width: 640px)`. ٣. داخل الاستعلام، اضبط `grid-template-columns` على `1fr` للهدف `.page-layout`.',
    practice_en: '1. Outside the query, set `grid-template-columns` on `.page-layout` to `2fr 1fr`. 2. Add the `@media (max-width: 640px)` query. 3. Inside the query, set `grid-template-columns` on `.page-layout` to `1fr`.',
    starter_html: '<header class="page-header"><h1>Field Notes</h1></header>\n<div class="page-layout">\n  <main class="page-main"><h2>Main story</h2><p>Primary page content goes here.</p></main>\n  <aside class="page-sidebar"><h2>More</h2><p>Related links and notes.</p></aside>\n</div>\n<footer class="page-footer">End of page</footer>',
    starter_css: '', starter_js: '',
    quiz: quiz(
      ['responsive-q1', ['What does `2fr 1fr` suggest for the two grid columns?', 'ماذا تعني `2fr 1fr` لعمودي الشبكة؟', 'توزّع المساحة بنسبة وحدتين للعمود الأول ووحدة للثاني.', 'It allocates space in a two-to-one ratio between the first and second columns.', 2, [['يكون عرض العمودين دائمًا 2px و1px', 'The columns are always 2px and 1px wide'], ['يجب أن يكون عرض العمودين متساويًا تمامًا', 'Both columns must be exactly the same width'], ['يحصل العمود الأول على ضعف حصة العمود الثاني', 'The first column gets twice the share of the second'], ['يُخفى العمود الثاني', 'The second column is hidden']]]],
      ['responsive-q2', ['When does `@media (max-width: 640px)` apply?', 'متى يطبق `@media (max-width: 640px)`؟', 'يطبق عندما يكون عرض الشاشة 640px أو أقل.', 'It applies when the screen is 640px wide or narrower.', 0, [['عندما يكون العرض 640px أو أقل', 'At widths of 640px or less'], ['فقط عندما يزيد العرض على 640px', 'Only above 640px'], ['فقط عندما تحتوي الصفحة على 640 قسمًا', 'Only when the page has 640 sections'], ['عند كل عرض من دون شرط', 'At every width, without a condition']]]],
      ['responsive-q3', ['What does `grid-template-columns: 1fr` do inside the narrow-screen query?', 'ماذا يفعل `grid-template-columns: 1fr` داخل استعلام الشاشة الأضيق؟', 'يخصص مسار عمود واحد، فتترتب المناطق في عمود واحد.', 'It creates one column track, arranging the regions in a single column.', 1, [['ينشئ صفًا واحدًا ويخفي كل المحتوى', 'It creates one row and hides all content'], ['يحوّل التخطيط إلى عمود واحد', 'It switches the layout to a single column'], ['يجعل الشريط الجانبي ضعف عرضه', 'It makes the sidebar twice as wide'], ['يضبط حجم خط الصفحة على 1px', 'It sets the page font size to 1px']]]],
    ),
    validation_rules: [
      declaration('page-layout-wide-columns', '.page-layout', 'grid-template-columns', '2fr 1fr', 'خارج استعلام الوسائط، استخدم عمودين بنسبة `2fr 1fr`.', 'Outside the media query, use two columns in a `2fr 1fr` ratio.', 'outside-media'),
      mediaRule('page-layout-narrow-query', '@media (max-width: 640px)', 'أضف استعلام العرض الأقصى 640px.', 'Add the 640px maximum-width media query.'),
      declarationInMedia('page-layout-narrow-column', '.page-layout', 'grid-template-columns', '1fr', '(max-width: 640px)', 'داخل استعلام 640px، اجعل `.page-layout` عمودًا واحدًا.', 'Inside the 640px query, make `.page-layout` a single column.'),
    ],
  },
} satisfies Record<string, Omit<FoundationLesson, 'id' | 'sequence'>>;
