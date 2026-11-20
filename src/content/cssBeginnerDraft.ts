export type CSSBeginnerDraftEntry = {
  id: string;
  sequence: number;
  existingLessonId?: string;
  titleAr: string;
  titleEn: string;
  objectiveAr: string;
  objectiveEn: string;
  commonMistakesAr: string[];
  commonMistakesEn: string[];
  newContent?: {
    steps: Array<{
      titleAr: string;
      titleEn: string;
      bodyAr: string;
      bodyEn: string;
      examples: Array<{ code: string; explanationAr: string; explanationEn: string }>;
    }>;
    exerciseAr: string;
    exerciseEn: string;
    quiz: {
      promptAr: string;
      promptEn: string;
      choices: Array<{ id: string; ar: string; en: string }>;
      correctChoiceId: string;
      correctFeedbackAr: string;
      correctFeedbackEn: string;
      incorrectFeedbackAr: string;
      incorrectFeedbackEn: string;
      reviewAr: string;
      reviewEn: string;
    };
  };
};

type DraftStep = NonNullable<CSSBeginnerDraftEntry['newContent']>['steps'][number];
type DraftQuiz = NonNullable<CSSBeginnerDraftEntry['newContent']>['quiz'];

function added(
  id: string,
  sequence: number,
  titleAr: string,
  titleEn: string,
  objectiveAr: string,
  objectiveEn: string,
  commonMistakesAr: string[],
  commonMistakesEn: string[],
  steps: DraftStep[],
  exerciseAr: string,
  exerciseEn: string,
  quiz: DraftQuiz,
): CSSBeginnerDraftEntry {
  return { id, sequence, titleAr, titleEn, objectiveAr, objectiveEn, commonMistakesAr, commonMistakesEn, newContent: { steps, exerciseAr, exerciseEn, quiz } };
}

function quiz(
  promptAr: string,
  promptEn: string,
  choices: DraftQuiz['choices'],
  correctChoiceId: string,
  correctFeedbackAr: string,
  correctFeedbackEn: string,
  incorrectFeedbackAr: string,
  incorrectFeedbackEn: string,
  reviewAr: string,
  reviewEn: string,
): DraftQuiz {
  return { promptAr, promptEn, choices, correctChoiceId, correctFeedbackAr, correctFeedbackEn, incorrectFeedbackAr, incorrectFeedbackEn, reviewAr, reviewEn };
}

export const CSS_BEGINNER_DRAFT: CSSBeginnerDraftEntry[] = [
  {
    id: 'css-what-is-css', existingLessonId: 'css-what-is-css', sequence: 1,
    titleAr: 'ما هي CSS؟', titleEn: 'What Is CSS?',
    objectiveAr: 'افهم كيف تفصل CSS مظهر الصفحة عن بنية HTML، وتعرّف المحدد والتصريح والخاصية والقيمة.',
    objectiveEn: 'Understand how CSS separates a page’s appearance from HTML structure, and identify a selector, declaration, property, and value.',
    commonMistakesAr: ['اعتبار CSS بديلًا عن HTML بدلًا من استخدامها لتنسيق بنيته ومحتواه.', 'الخلط بين المحدد والخاصية والقيمة؛ فالمحدد يختار العنصر والخاصية والقيمة تصفان التغيير.'],
    commonMistakesEn: ['Treating CSS as a replacement for HTML instead of using it to style HTML structure and content.', 'Confusing the selector, property, and value: the selector chooses elements, while the property and value describe the change.'],
  },
  added('css-b-001-external-stylesheet', 2, 'ربط ملف CSS خارجي', 'Linking an External CSS File',
    'اربط صفحة HTML بملف CSS خارجي باستخدام عنصر link داخل head، وتحقق من تطابق مسار الملف واسمه.',
    'Connect an HTML page to an external CSS file with a link element in the head, and verify the file path and name.',
    ['وضع عنصر link داخل body بدل head.', 'كتابة اسم ملف CSS أو مساره بتهجئة لا تطابق الملف الحقيقي.'],
    ['Putting the link element in body instead of head.', 'Typing a CSS filename or path that does not exactly match the real file.'],
    [
      { titleAr: 'أضف رابط ورقة الأنماط', titleEn: 'Add the stylesheet link', bodyAr: 'تضع HTML المحتوى، ويُحمَّل التنسيق من ملف مستقل عند إضافة عنصر link داخل head. استخدم rel="stylesheet" لتحديد نوع العلاقة وhref لمسار الملف. في مشروع بسيط، يكون الملفان في المجلد نفسه؛ أما في المجلدات المتداخلة فيجب أن يعكس المسار موضع الملف فعلًا.', bodyEn: 'HTML holds the content, and a separate file supplies the styles when a link element is placed inside head. Use rel="stylesheet" to identify the relationship and href for the file path. In a simple project, both files may share a folder; nested folders require a path that matches the file’s real location.', examples: [
        { code: '<head>\n  <link rel="stylesheet" href="styles.css">\n</head>', explanationAr: 'يربط هذا المقطع ملف styles.css الموجود بجانب ملف HTML.', explanationEn: 'This connects the styles.css file located beside the HTML file.' },
        { code: '<head>\n  <link rel="stylesheet" href="css/site.css">\n</head>', explanationAr: 'يشير المسار النسبي إلى ملف site.css داخل مجلد css.', explanationEn: 'The relative path points to site.css inside the css folder.' },
      ] },
      { titleAr: 'تأكّد من أن المتصفح يحمّل الملف', titleEn: 'Check that the browser loads the file', bodyAr: 'ابدأ بتغيير واضح ومؤقت في ملف CSS، مثل لون عنوان، ثم حدّث الصفحة. إذا لم يظهر التغيير، افحص موضع الملف واسمَه وحالة الأحرف والمسار في href، وتأكد من عدم وجود خطأ في اسم الخاصية أو أقواس القاعدة. لا حاجة إلى أداة بناء أو إطار عمل لهذه الخطوة.', bodyEn: 'Make a clear temporary change in the CSS file, such as a heading color, and refresh the page. If it does not appear, check the file location, spelling, letter case, and href path, then check for a property or brace typo. No build tool or framework is needed for this step.', examples: [
        { code: 'h1 {\n  color: teal;\n}', explanationAr: 'قاعدة اختبار بسيطة تساعد على معرفة ما إذا كان الملف المرتبط يصل إلى الصفحة.', explanationEn: 'A simple test rule helps confirm that the linked file reaches the page.' },
        { code: '/* styles.css */\np {\n  line-height: 1.5;\n}', explanationAr: 'التعليق يوضح اسم الملف للقارئ، والقاعدة صالحة لتنسيق الفقرات.', explanationEn: 'The comment labels the file for a reader, and the rule is valid paragraph styling.' },
      ] },
    ],
    'أنشئ في HTML عنصر link داخل head يربط styles.css في المجلد نفسه. ثم اكتب في CSS قاعدة h1 تجعل اللون teal، وتحقق من ظهورها بعد تحديث الصفحة.',
    'In the HTML, add a link element inside head for styles.css in the same folder. Then write a CSS rule that makes h1 teal and check that it appears after refreshing.',
    quiz('أين يوضع عنصر link الخاص بملف CSS عادةً؟', 'Where is the link element for a CSS file usually placed?', [
      { id: 'a', ar: 'داخل head في مستند HTML', en: 'Inside head in the HTML document' }, { id: 'b', ar: 'داخل كل فقرة يراد تنسيقها', en: 'Inside every paragraph to be styled' }, { id: 'c', ar: 'في نهاية ملف CSS', en: 'At the end of the CSS file' }, { id: 'd', ar: 'داخل تعليق HTML', en: 'Inside an HTML comment' },
    ], 'a', 'صحيح؛ يعرّف head موارد الصفحة، ومنها ورقة الأنماط المرتبطة.', 'Correct. The head identifies page resources, including the linked stylesheet.', 'راجع وظيفة head: يوضع رابط ورقة الأنماط فيه، ويشير href إلى مكان الملف.', 'Review the role of head: the stylesheet link goes there, and href points to the file.', 'ضع الرابط في head وتحقق من المسار النسبي في href.', 'Place the link in head and verify the relative path in href.'),
  ),
  {
    id: 'css-selectors', existingLessonId: 'css-selectors', sequence: 3,
    titleAr: 'محددات العناصر والفئات والمعرّفات', titleEn: 'Element, Class, and ID Selectors',
    objectiveAr: 'اختر محدد CSS المناسب: اسم العنصر أو class بنقطة أو id بعلامة #، وطابقه مع HTML.',
    objectiveEn: 'Choose the right CSS selector—an element name, a class with a dot, or an id with #—and match it to the HTML.',
    commonMistakesAr: ['نسيان النقطة قبل اسم class أو استخدام # بدلها.', 'إضافة أقواس HTML مثل <p> إلى محدد CSS.'],
    commonMistakesEn: ['Forgetting the dot before a class name or using # instead.', 'Adding HTML brackets such as <p> to a CSS selector.'],
  },
  added('css-b-002-group-selectors', 4, 'تجميع المحددات', 'Grouping Selectors',
    'نسّق عناصر مختلفة بالقواعد نفسها عبر فصل المحددات بفواصل، مع إبقاء المحددات المستقلة واضحة.',
    'Style different elements with the same declarations by separating selectors with commas while keeping each selector clear.',
    ['استخدام مسافة بدل الفاصلة، فيتغير معنى المحدد إلى عنصر متداخل.', 'نسيان الفاصلة بين المحددات فيؤخذ الجزء التالي على أنه جزء من المحدد نفسه.'],
    ['Using a space instead of a comma, which changes the selector to mean a nested element.', 'Missing the comma between selectors, causing the text to be read as one selector.'],
    [
      { titleAr: 'أعد استخدام قاعدة واحدة', titleEn: 'Reuse one rule', bodyAr: 'عندما تحتاج عناوين h2 والفقرات إلى لون النص نفسه، يمكنك كتابة المحددين في قائمة واحدة. تفصل الفاصلة بين المحددات المستقلة؛ وتُطبَّق التصريحات نفسها على كل مجموعة عناصر تطابق أحدها. هذا يقلل التكرار ويسهّل تحديث النمط لاحقًا.', bodyEn: 'When h2 headings and paragraphs need the same text color, put both selectors in one list. A comma separates independent selectors; the same declarations apply to elements matching either one. This reduces repetition and makes later updates easier.', examples: [
        { code: 'h2, p {\n  color: #263238;\n}', explanationAr: 'الفاصلة تجعل القاعدة تنطبق على h2 وعلى p كلٍّ على حدة.', explanationEn: 'The comma makes the rule apply to h2 and p independently.' },
        { code: '.notice, .warning {\n  padding: 1rem;\n}', explanationAr: 'يمكن جمع فئتين تشتركان في مساحة داخلية، مع بقاء الفئتين منفصلتين في HTML.', explanationEn: 'Two classes can share padding while remaining separate classes in HTML.' },
      ] },
      { titleAr: 'ميّز الفاصلة عن المسافة', titleEn: 'Distinguish a comma from a space', bodyAr: 'الفاصلة تعني «هذا المحدد أو ذاك»، أما المسافة فتعني البحث عن عنصر داخل عنصر آخر. لذلك لا تستبدل الفاصلة بمسافة لمجرد تقصير الكتابة؛ فالمعنى وسلوك القاعدة سيتغيران.', bodyEn: 'A comma means “this selector or that one,” while a space means an element inside another element. Do not replace a comma with a space merely to shorten the code; the meaning and result will change.', examples: [
        { code: 'h2, p {\n  margin-bottom: 0.75rem;\n}', explanationAr: 'هذا يختار جميع عناصر h2 وجميع عناصر p.', explanationEn: 'This selects all h2 elements and all p elements.' },
        { code: '.card p {\n  margin-bottom: 0.75rem;\n}', explanationAr: 'هنا المسافة تعني فقرات p الموجودة داخل عناصر card فقط.', explanationEn: 'Here the space means only p elements inside card elements.' },
      ] },
    ],
    'اكتب قاعدة واحدة تجعل h2 وh3 بلون #174a5b. ثم اكتب قاعدة أخرى تمنح الفئتين .tip و.caution حشوة داخلية 0.75rem باستخدام محدد مجمّع.',
    'Write one rule that makes h2 and h3 #174a5b. Then write another rule that gives .tip and .caution 0.75rem of padding using a grouped selector.',
    quiz('ما معنى الفاصلة في المحدد h2, p؟', 'What does the comma mean in the selector h2, p?', [
      { id: 'a', ar: 'اختيار h2 الموجودة داخل p فقط', en: 'Select only h2 elements inside p' }, { id: 'b', ar: 'اختيار عناصر h2 وعناصر p كلٍّ على حدة', en: 'Select h2 elements and p elements independently' }, { id: 'c', ar: 'اختيار العنصر ذي المعرّف p', en: 'Select the element with ID p' }, { id: 'd', ar: 'إنهاء قاعدة CSS', en: 'End the CSS rule' },
    ], 'b', 'صحيح؛ الفاصلة تجمع محددات مستقلة لتشارك التصريحات.', 'Correct. The comma groups independent selectors so they share declarations.', 'المسافة تعني التداخل، أما الفاصلة فتفصل محددات مستقلة.', 'A space means nesting; a comma separates independent selectors.', 'استخدم الفاصلة عندما تريد أن تطبق القاعدة نفسها على أكثر من نوع عنصر أو فئة.', 'Use a comma when you want the same rule to apply to more than one element type or class.'),
  ),
  added('css-b-003-combinators-attributes', 5, 'العناصر المتداخلة ومحددات السمات', 'Nested Elements and Attribute Selectors',
    'استهدف عنصرًا داخل سياق محدد أو عنصرًا يحمل سمة معينة، من دون إضافة فئات غير ضرورية إلى HTML.',
    'Target an element within a specific context or one with a particular attribute without adding unnecessary classes to HTML.',
    ['الخلط بين المسافة، التي تستهدف أي سليل، وعلامة > التي تستهدف الابن المباشر فقط.', 'نسيان وضع قيمة السمة بين علامتي اقتباس داخل المحدد.'],
    ['Confusing a space, which targets any descendant, with >, which targets only a direct child.', 'Forgetting quotation marks around the attribute value in the selector.'],
    [
      { titleAr: 'اقرأ علاقة العناصر', titleEn: 'Read the element relationship', bodyAr: 'يتيح محدد السليل اختيار عنصر داخل عنصر آخر على أي عمق. إذا احتجت الابن المباشر فقط، فاستخدم > بين المحددين. ابدأ بأبسط محدد يعبّر عن المقصود حتى لا تتأثر عناصر غير ذات صلة عند إعادة استخدام HTML.', bodyEn: 'A descendant selector targets an element anywhere inside another element. Use > between selectors when only the direct child should match. Prefer the simplest selector that expresses the intent so unrelated elements are not affected when HTML is reused.', examples: [
        { code: '.article p {\n  color: #333;\n}', explanationAr: 'يختار كل فقرة داخل عنصر يحمل article، سواء أكانت ابنة مباشرة أم أعمق.', explanationEn: 'Selects every paragraph inside an article element, whether direct or more deeply nested.' },
        { code: '.menu > li {\n  padding-block: 0.5rem;\n}', explanationAr: 'يستهدف عناصر li الأبناء المباشرين للقائمة ذات الفئة menu.', explanationEn: 'Targets li elements that are direct children of the menu element.' },
      ] },
      { titleAr: 'استخدم السمة عندما تصف HTML الحالة', titleEn: 'Use an attribute when HTML describes the state', bodyAr: 'يمكن للمحدد بين أقواس مربعة فحص وجود سمة HTML أو قيمة محددة لها. مثال مفيد هو اختيار رابط يفتح في تبويب جديد، مع استخدام اسم السمة وقيمتها كما كُتبا في HTML. لا تستخدم محددًا أعقد من الحاجة؛ فالفئة المسماة بوضوح قد تكون أسهل للصيانة.', bodyEn: 'A selector in square brackets can check whether an HTML attribute exists or has a particular value. One useful example is selecting a link that opens in a new tab, using the attribute name and value as written in HTML. Avoid unnecessary complexity; a clearly named class may be easier to maintain.', examples: [
        { code: 'a[target="_blank"] {\n  text-decoration: underline;\n}', explanationAr: 'يختار الروابط التي تحمل target="_blank" تحديدًا.', explanationEn: 'Selects links whose target attribute is exactly _blank.' },
        { code: 'input[required] {\n  border: 2px solid #245b45;\n}', explanationAr: 'يختار عناصر input التي تحمل سمة required، أي إن السمة موجودة.', explanationEn: 'Selects input elements that have the required attribute.' },
      ] },
    ],
    'باستخدام HTML فيه .article تضم فقرتين، نسّق فقراتها باللون #333. ثم اختر عناصر li المباشرة للقائمة .menu، واكتب محددًا يضيف إليها حشوة رأسية.',
    'Given HTML with .article containing paragraphs, style its paragraphs #333. Then target direct li children of .menu and add vertical padding.',
    quiz('أي محدد يختار أبناء .menu المباشرين فقط؟', 'Which selector targets only direct children of .menu?', [
      { id: 'a', ar: '.menu li', en: '.menu li' }, { id: 'b', ar: '.menu > li', en: '.menu > li' }, { id: 'c', ar: 'menu.li', en: 'menu.li' }, { id: 'd', ar: '.menu, li', en: '.menu, li' },
    ], 'b', 'صحيح؛ علامة > تعني علاقة الابن المباشر.', 'Correct. The > combinator means a direct-child relationship.', 'المسافة وحدها تختار السليل على أي عمق، ولا تضمن أنه ابن مباشر.', 'A space alone selects descendants at any depth; it does not require a direct child.', 'اختر المسافة للسليل العام و> للابن المباشر.', 'Use a space for any descendant and > for a direct child.'),
  ),
  added('css-b-004-reusable-classes', 6, 'بناء أنماط قابلة لإعادة الاستخدام', 'Reusable Class Patterns',
    'اجمع الفئات الصغيرة ذات الأسماء الواضحة لتطبيق مظهر مشترك وتغيير واحد محدود على عناصر متعددة.',
    'Combine small, clearly named classes to apply a shared appearance and one limited variation to multiple elements.',
    ['إنشاء فئة جديدة لكل عنصر بدل مشاركة الأنماط المتكررة.', 'استخدام أسماء تصف اللون المؤقت مثل .red بدل الدور المقصود مثل .notice.'],
    ['Creating a new class for every element instead of sharing repeated styles.', 'Using temporary appearance names like .red instead of a role such as .notice.'],
    [
      { titleAr: 'سمِّ الفئات بحسب الدور', titleEn: 'Name classes by role', bodyAr: 'يمكن للعنصر حمل أكثر من فئة، وتُكتب القيم مفصولة بمسافات في سمة class. استخدم اسمًا يصف وظيفة النمط أو مكوّنه، مثل .card أو .notice؛ فالاسم الواضح يبقى مفهومًا حتى إذا تغير اللون أو التصميم.', bodyEn: 'An element can have more than one class, with class values separated by spaces. Choose a name for the style’s role or component, such as .card or .notice; a meaningful name remains useful even if the color or design changes.', examples: [
        { code: '<article class="card notice">\n  <h2>Service update</h2>\n</article>', explanationAr: 'يحمل العنصر فئة card وفئة notice في الوقت نفسه.', explanationEn: 'The element has both the card and notice classes.' },
        { code: '.card {\n  padding: 1rem;\n  border: 1px solid #ccd5d8;\n}', explanationAr: 'تصف القاعدة مظهر البطاقة العام الذي يمكن مشاركته.', explanationEn: 'The rule describes a shared base card appearance.' },
      ] },
      { titleAr: 'أضف فرقًا مقصودًا', titleEn: 'Add an intentional variation', bodyAr: 'اجعل الفئة الأساسية مسؤولة عن الخصائص المشتركة، وأضف فئة أخرى للتغيير المحدود. تجنب تكرار القاعدة كاملة لكل لون أو حالة. تذكّر أن الأنماط المتنافسة ما زالت تخضع لقواعد cascade التي درستها، لذا اجعل النطاق واضحًا.', bodyEn: 'Let the base class own shared properties and add another class for a limited variation. Avoid copying the entire rule for every color or state. Competing styles still follow the cascade rules you have learned, so keep the scope clear.', examples: [
        { code: '.notice {\n  background-color: #eef6ff;\n}', explanationAr: 'تضيف فئة notice خلفية مناسبة للإشعار من دون تكرار قاعدة البطاقة.', explanationEn: 'The notice class adds a suitable background without repeating the card rule.' },
        { code: '.notice--warning {\n  border-color: #9b4b16;\n}', explanationAr: 'تضيف الفئة ذات الاسم الوصفي علامة مرئية لحالة التحذير.', explanationEn: 'The descriptive modifier adds a visible cue for a warning state.' },
      ] },
    ],
    'أنشئ فئة .card تمنح الحاوية حشوة وحدًا رفيعًا، ثم فئة .card--highlight تغيّر لون الحد. استخدم الفئتين معًا على عنصر HTML واحد.',
    'Create a .card class that gives a container padding and a thin border, then a .card--highlight class that changes the border color. Use both classes on one HTML element.',
    quiz('كيف تكتب عنصرًا يحمل فئتين في HTML؟', 'How do you write an element with two classes in HTML?', [
      { id: 'a', ar: 'class="card highlight"', en: 'class="card highlight"' }, { id: 'b', ar: 'class="card, highlight"', en: 'class="card, highlight"' }, { id: 'c', ar: 'class=".card .highlight"', en: 'class=".card .highlight"' }, { id: 'd', ar: 'class="card#highlight"', en: 'class="card#highlight"' },
    ], 'a', 'صحيح؛ تفصل المسافات بين قيم الفئات في HTML، ولا تضاف النقطة داخل السمة.', 'Correct. Spaces separate class values in HTML; the selector dot is not written in the attribute.', 'اكتب قيم الفئات مفصولة بمسافة في HTML، واستخدم النقطة فقط في محدد CSS.', 'Write class values separated by spaces in HTML; use the dot only in CSS selectors.', 'افصل أسماء الفئات بمسافات، واحتفظ بدلالة كل اسم واضحة.', 'Separate class names with spaces and give each a clear role.'),
  ),
  added('css-b-005-css-comments-organization', 7, 'تعليقات CSS وترتيب القواعد', 'CSS Comments and Rule Organization',
    'استخدم التعليقات لتوضيح قرارات التصميم ورتّب القواعد في مجموعات يسهل العثور عليها وصيانتها.',
    'Use comments to explain design decisions and organize rules into groups that are easy to find and maintain.',
    ['كتابة تعليق CSS بصيغة //، وهي ليست صيغة تعليقات CSS.', 'ترك تعليقات قديمة تصف سلوكًا لم يعد الكود يطبقه.'],
    ['Writing a CSS comment with //, which is not CSS comment syntax.', 'Leaving outdated comments that describe behavior the code no longer has.'],
    [
      { titleAr: 'اكتب تعليقًا صحيحًا ومفيدًا', titleEn: 'Write a valid, useful comment', bodyAr: 'يبدأ تعليق CSS بـ /* وينتهي بـ */، ويمكن أن يمتد على عدة أسطر. اشرح سببًا قد لا يكون واضحًا من الكود، مثل ضرورة إبقاء تباين معين، بدل إعادة وصف تصريح بديهي. لا تضع قاعدة تحتاج إلى التنفيذ داخل تعليق.', bodyEn: 'A CSS comment starts with /* and ends with */ and can span multiple lines. Explain a reason that may not be obvious from the code, such as preserving a contrast choice, rather than restating an obvious declaration. A rule inside a comment does not run.', examples: [
        { code: '/* Keep body text comfortably readable. */\nbody {\n  line-height: 1.6;\n}', explanationAr: 'التعليق صالح، والتصريح بعده يظل فعالًا.', explanationEn: 'The comment is valid, and the declaration after it remains active.' },
        { code: '/* Navigation styles */\n.site-nav a {\n  text-decoration: none;\n}', explanationAr: 'يوضح عنوان القسم نوع القواعد التالية.', explanationEn: 'The section label describes the rules that follow.' },
      ] },
      { titleAr: 'رتّب بحسب أجزاء الصفحة', titleEn: 'Organize by page area', bodyAr: 'اجمع القواعد المتقاربة، مثل إعدادات الصفحة العامة ثم الرأس والبطاقات والنماذج. اترك سطرًا فارغًا بين المجموعات واختر تنسيقًا ثابتًا للأقواس والمسافات. التنظيم يحسن القراءة ولا يغيّر معنى CSS؛ أما التعليقات الخاطئة فقد تربك من يقرأ الملف.', bodyEn: 'Group related rules, such as general page settings followed by the header, cards, and forms. Leave a blank line between groups and use consistent braces and spacing. Organization improves readability without changing CSS meaning; inaccurate comments can mislead readers.', examples: [
        { code: '/* Page foundation */\nbody {\n  margin: 0;\n}\n\n/* Content cards */\n.card {\n  padding: 1rem;\n}', explanationAr: 'تجمع العناوين القواعد بحسب وظيفتها، ولا تؤثر التعليقات في التصيير.', explanationEn: 'The labels group rules by purpose; comments do not affect rendering.' },
        { code: '/* Links */\na {\n  color: #174a5b;\n}\n\n/* Buttons */\nbutton {\n  cursor: pointer;\n}', explanationAr: 'تسهّل الأقسام القصيرة الرجوع إلى تنسيقات الروابط والأزرار.', explanationEn: 'Short sections make link and button styles easier to find.' },
      ] },
    ],
    'قسّم ملف CSS إلى قسمين على الأقل باستخدام تعليقات صحيحة: إعدادات الصفحة العامة، والبطاقات. أضف قاعدة واحدة تحت كل عنوان تعليق.',
    'Split a CSS file into at least two sections with valid comments: general page settings and cards. Add one rule beneath each comment heading.',
    quiz('ما صيغة التعليق الصحيحة في CSS؟', 'What is the correct CSS comment syntax?', [
      { id: 'a', ar: '// تعليق', en: '// comment' }, { id: 'b', ar: '<!-- تعليق -->', en: '<!-- comment -->' }, { id: 'c', ar: '/* تعليق */', en: '/* comment */' }, { id: 'd', ar: '# تعليق', en: '# comment' },
    ], 'c', 'صحيح؛ تستخدم CSS الفتحة /* والإغلاق */ للتعليق.', 'Correct. CSS uses /* to open a comment and */ to close it.', 'الرمز // ليس تعليقًا في CSS، ووسوم التعليقات HTML لا تُستخدم هنا.', '// is not a CSS comment, and HTML comment tags are not used here.', 'اكتب تعليق CSS بين /* و*/.', 'Write a CSS comment between /* and */.'),
  ),
  added('css-b-006-linear-gradients', 9, 'تدرّجات لونية للخلفية', 'Color Gradients for Backgrounds',
    'أنشئ خلفية متدرجة بسيطة باستخدام linear-gradient، واختر ألوانًا واتجاهًا لا يحجبان المحتوى.',
    'Create a simple gradient background with linear-gradient and choose colors and a direction that do not obscure content.',
    ['كتابة التدرج في background-color؛ فالتدرج صورة خلفية لا قيمة لون مفردة.', 'استخدام نص فوق تدرج ضعيف التباين من دون فحص القراءة.'],
    ['Writing a gradient as background-color; a gradient is a background image, not a single color value.', 'Putting text over a low-contrast gradient without checking readability.'],
    [
      { titleAr: 'أنشئ انتقالًا بين لونين', titleEn: 'Create a transition between two colors', bodyAr: 'تعيد الدالة linear-gradient قيمة صورة خلفية تنتقل بين لونين أو أكثر. يمكن إضافة اتجاه مثل to right، ثم الألوان. استخدمها عادةً على background أو background-image، وابدأ بتدرج بسيط يسهل مراجعته.', bodyEn: 'The linear-gradient function creates a background image that transitions between two or more colors. Add a direction such as to right, followed by the colors. Use it with background or background-image, and start with a simple gradient that is easy to review.', examples: [
        { code: '.banner {\n  background: linear-gradient(to right, #174a5b, #4c8c78);\n}', explanationAr: 'يتدرج اللون من اليسار إلى اليمين في اتجاه الكتابة اللاتيني الشائع لهذا المثال.', explanationEn: 'The gradient runs from left to right in this example.' },
        { code: '.panel {\n  background-image: linear-gradient(#f4f8fb, #dce8f0);\n}', explanationAr: 'عند حذف الاتجاه الصريح، يستخدم التدرج اتجاهًا افتراضيًا من الأعلى إلى الأسفل.', explanationEn: 'When no direction is specified, the gradient uses its default top-to-bottom direction.' },
      ] },
      { titleAr: 'حافظ على وضوح المحتوى', titleEn: 'Keep content legible', bodyAr: 'التدرج يملأ مساحة الخلفية، لكنه لا يضمن تباين النص تلقائيًا. اختبر النص عند الطرفين وفي الوسط، واختر لونًا ثابتًا واضحًا أو أضف سطحًا معتمًا خلفه إذا لزم. لا تستخدم التدرج بدل صورة أو نص ذي معنى.', bodyEn: 'A gradient fills the background, but it does not guarantee text contrast. Check text at both ends and in the middle; choose a clear text color or place an opaque surface behind it if needed. Do not use a gradient as a substitute for meaningful images or text.', examples: [
        { code: '.banner {\n  color: white;\n  background: linear-gradient(120deg, #17324d, #315f52);\n}', explanationAr: 'الألوان الداكنة المتقاربة نسبيًا تساعد على إبقاء النص الأبيض مقروءًا، لكن يجب التحقق من التباين الفعلي.', explanationEn: 'The relatively dark colors can help white text remain legible, but actual contrast should still be checked.' },
        { code: '.banner__content {\n  max-width: 40rem;\n  padding: 1rem;\n}', explanationAr: 'تحد الحاوية من عرض النص وتمنحه مساحة حوله فوق الخلفية.', explanationEn: 'The container limits text width and adds breathing room over the background.' },
      ] },
    ],
    'أنشئ .hero بخلفية متدرجة تبدأ بـ #17324d وتنتهي بـ #315f52، واجعل لون النص أبيض. أضف مساحة داخلية كافية واختبر وضوح النص عبر مساحة العنصر.',
    'Create .hero with a gradient from #17324d to #315f52 and white text. Add enough padding and check text legibility across the element.',
    quiz('أي خاصية مناسبة لتدرج linear-gradient؟', 'Which property is suitable for a linear-gradient?', [
      { id: 'a', ar: 'background-image', en: 'background-image' }, { id: 'b', ar: 'font-weight', en: 'font-weight' }, { id: 'c', ar: 'border-style', en: 'border-style' }, { id: 'd', ar: 'display', en: 'display' },
    ], 'a', 'صحيح؛ التدرج صورة خلفية، لذا يمكن إسناده إلى background-image أو background.', 'Correct. A gradient is a background image, so it can be assigned to background-image or background.', 'التدرج لا يغيّر الخط أو الحدود؛ استخدم خاصية خلفية مناسبة له.', 'A gradient does not change the font or borders; use a background property for it.', 'التدرجات قيمة لصورة الخلفية، وليست لونًا منفردًا في background-color.', 'Gradients are background-image values, not single colors for background-color.'),
  ),
  added('css-b-007-opacity-alpha', 10, 'الشفافية من دون إضعاف النص', 'Transparency Without Fading Text',
    'ميّز بين شفافية العنصر كله وقناة alpha في اللون، واختر طريقة تحافظ على تباين النص.',
    'Distinguish whole-element opacity from a color alpha channel and choose an approach that preserves text contrast.',
    ['تطبيق opacity على بطاقة كاملة ثم توقع بقاء نصها معتمًا.', 'استخدام خلفية شفافة خلف نص مهم من دون التأكد من الخلفية التي ستظهر خلالها.'],
    ['Applying opacity to an entire card and expecting its text to remain opaque.', 'Using a transparent background behind important text without checking what shows through.'],
    [
      { titleAr: 'شفافية العنصر تؤثر في أبنائه', titleEn: 'Element opacity affects its descendants', bodyAr: 'تضبط opacity مقدار شفافية العنصر وكل ما يرسمه داخله، بما في ذلك النص والأزرار. لذلك قد يقل وضوح المحتوى كله. لا تستخدمها لتخفيف لون الخلفية وحده عندما يحتوي العنصر على نص أساسي.', bodyEn: 'The opacity property controls how transparent an element and everything painted inside it become, including text and buttons. The entire content can lose clarity. Do not use it to fade only a background when the element contains important text.', examples: [
        { code: '.muted-card {\n  opacity: 0.6;\n}', explanationAr: 'تؤثر القيمة في البطاقة ومحتوياتها جميعًا، وقد تخفض وضوح النص.', explanationEn: 'The value affects the card and all its contents, which may reduce text clarity.' },
        { code: '.disabled-preview {\n  opacity: 0.5;\n}', explanationAr: 'قد تلائم الشفافية معاينة غير تفاعلية، لكن لا تعتمد عليها وحدها لتوضيح حالة عنصر قابل للاستخدام.', explanationEn: 'Opacity may suit a non-interactive preview, but do not rely on it alone to communicate the state of an operable control.' },
      ] },
      { titleAr: 'اجعل الخلفية شفافة وحدها', titleEn: 'Make only the background translucent', bodyAr: 'تتيح صيغة rgba تحديد شفافية اللون نفسه. بهذا تبقى كتابة العنصر معتمة، مع ظهور شيء من الخلفية من وراء اللون. تحقق من النتيجة فوق كل خلفية محتملة، وفضّل سطحًا معتمًا إذا صار النص أقل قراءة.', bodyEn: 'The rgba color syntax can set transparency on the color itself. This lets the element’s text remain opaque while some background shows through the color. Check the result against every possible background, and prefer an opaque surface if readability suffers.', examples: [
        { code: '.overlay {\n  background-color: rgba(20, 35, 50, 0.85);\n  color: white;\n}', explanationAr: 'قناة alpha في لون الخلفية تجعل الخلفية شبه شفافة، بينما يبقى النص نفسه معتمًا.', explanationEn: 'The background color’s alpha channel makes the background translucent while the text itself stays opaque.' },
        { code: '.solid-card {\n  background-color: #ffffff;\n  color: #17212b;\n}', explanationAr: 'الخلفية المعتمة خيار أكثر ثباتًا عندما تكون الخلفية خلف البطاقة غير معروفة.', explanationEn: 'An opaque background is more predictable when the surface behind the card is unknown.' },
      ] },
    ],
    'أنشئ بطاقة ذات نص داكن وخلفية فاتحة معتمة. ثم أنشئ طبقة ثانية بخلفية rgba شبه شفافة ونص أبيض، ولا تستخدم opacity على الحاوية التي تضم النص.',
    'Create a card with dark text on an opaque light background. Then create a second overlay with a translucent rgba background and white text; do not apply opacity to the text-containing container.',
    quiz('كيف تجعل الخلفية شبه شفافة مع إبقاء النص معتمًا؟', 'How can you make a background translucent while keeping text opaque?', [
      { id: 'a', ar: 'استخدم opacity على العنصر الحاوي كله', en: 'Use opacity on the whole container' }, { id: 'b', ar: 'استخدم لون خلفية بصيغة rgba', en: 'Use an rgba background color' }, { id: 'c', ar: 'استخدم font-weight: 0', en: 'Use font-weight: 0' }, { id: 'd', ar: 'استخدم visibility: hidden', en: 'Use visibility: hidden' },
    ], 'b', 'صحيح؛ شفافية لون الخلفية لا تجعل النص نفسه شفافًا.', 'Correct. Transparency on the background color does not make the text itself transparent.', 'تؤثر opacity في العنصر ومحتوياته معًا؛ استعمل قناة alpha في لون الخلفية.', 'Opacity affects the element and its contents together; use alpha in the background color.', 'لتقليل شفافية الخلفية وحدها، اختر لونًا شفافًا بدل opacity على الحاوية.', 'To reduce only background opacity, use a translucent color instead of opacity on the container.'),
  ),
  {
    id: 'css-colors-backgrounds', existingLessonId: 'css-colors-backgrounds', sequence: 8,
    titleAr: 'ألوان النص والخلفيات والتباين', titleEn: 'Text Colors, Backgrounds, and Contrast',
    objectiveAr: 'استخدم color وbackground-color لإظهار نص واضح فوق خلفية متباينة.',
    objectiveEn: 'Use color and background-color to show readable text on a contrasting background.',
    commonMistakesAr: ['استخدام اللون نفسه تقريبًا للنص والخلفية، فيصبح النص صعب القراءة.', 'الخلط بين color للنص وbackground-color للخلفية.'],
    commonMistakesEn: ['Choosing nearly the same color for text and background, making text hard to read.', 'Confusing color for text with background-color for the background.'],
  },
  {
    id: 'css-typography', existingLessonId: 'css-typography', sequence: 11,
    titleAr: 'خصائص الطباعة الأساسية', titleEn: 'Typography Essentials',
    objectiveAr: 'استخدم font-family وfont-size وfont-weight وline-height لجعل النص واضحًا ومريحًا للقراءة.',
    objectiveEn: 'Use font-family, font-size, font-weight, and line-height to make text clear and comfortable to read.',
    commonMistakesAr: ['استخدام خط واحد من دون بديل عام في قائمة font-family.', 'اختيار حجم أو تباعد أسطر ضيق يرهق القراءة.'],
    commonMistakesEn: ['Using a single font without a generic fallback in font-family.', 'Choosing a small size or cramped line spacing that makes reading tiring.'],
  },
  added('css-b-008-readable-measure', 12, 'عرض مريح لقراءة الفقرات', 'Comfortable Paragraph Measure',
    'حدّد عرضًا أقصى لكتلة النص واستخدم المحاذاة المناسبة كي لا تمتد أسطر القراءة عبر الشاشة كلها.',
    'Set a maximum width for text blocks and use suitable alignment so reading lines do not stretch across the entire screen.',
    ['إضافة فراغات متعددة داخل النص لمحاولة ضبط عرض السطر يدويًا.', 'جعل الفقرة بعرض الصفحة الكامل على شاشة عريضة.'],
    ['Adding repeated spaces inside text to try to control line length manually.', 'Letting a paragraph span the full page width on a wide screen.'],
    [
      { titleAr: 'اضبط عرض كتلة النص', titleEn: 'Limit the text block width', bodyAr: 'تؤثر max-width في اتساع كتلة النص، ولا تغيّر محتواه. كلما طال السطر أكثر من اللازم صار تتبعه أصعب؛ استخدم قيمة مناسبة بوحدة نسبية مثل ch (تقريبًا عرض عدد من المحارف) أو rem. دع الكتلة تنكمش على الشاشة الضيقة بدل فرض عرض ثابت.', bodyEn: 'The max-width property limits the text block without changing its content. Extremely long lines can be harder to track; use a suitable relative value such as ch (roughly the width of a number of characters) or rem. Let the block shrink on a narrow screen rather than forcing a fixed width.', examples: [
        { code: '.article-copy {\n  max-width: 68ch;\n}', explanationAr: 'تضع حدًا تقريبيًا لعرض السطر اعتمادًا على حجم المحارف.', explanationEn: 'Sets an approximate line-width limit based on character measure.' },
        { code: '.intro {\n  max-width: 42rem;\n}', explanationAr: 'حد العرض يمنع الفقرة التمهيدية من التمدد المفرط على الشاشات الكبيرة.', explanationEn: 'The width cap prevents an introductory paragraph from stretching too far on large screens.' },
      ] },
      { titleAr: 'اختر محاذاة تساعد القراءة', titleEn: 'Choose alignment that supports reading', bodyAr: 'اترك نص الفقرات بمحاذاة طبيعية في معظم الصفحات؛ تتكيف المحاذاة الطبيعية مع اتجاه اللغة. قد يصلح توسيط عنوان أو مقدمة قصيرة، لكنه يصعّب تتبع الفقرات الطويلة. استخدم CSS لتنسيق العرض والمحاذاة بدل إدخال مسافات يدوية في النص.', bodyEn: 'Keep paragraphs naturally aligned on most pages; natural alignment follows the language direction. Centering a heading or short introduction can work, but it can make long paragraphs harder to track. Use CSS to style width and alignment instead of inserting manual spaces in text.', examples: [
        { code: '.article-copy {\n  text-align: start;\n}', explanationAr: 'تعني start بداية اتجاه الكتابة، وهي ملائمة للنص العربي واللغات الأخرى.', explanationEn: 'The start keyword follows the writing direction, which works for Arabic and other languages.' },
        { code: '.page-title {\n  text-align: center;\n}', explanationAr: 'يمكن توسيط العنوان القصير من دون توسيط فقرات المقال الطويلة.', explanationEn: 'A short page title may be centered without centering long article paragraphs.' },
      ] },
    ],
    'اكتب قاعدة .reading تضبط max-width على 68ch وتستخدم text-align: start. أضف قاعدة مستقلة لتوسيط عنوان قصير فقط، ثم تحقق من القراءة على عرض شاشة كبير وصغير.',
    'Write a .reading rule with max-width: 68ch and text-align: start. Add a separate rule that centers only a short heading, then check readability at wide and narrow screen sizes.',
    quiz('ما فائدة max-width لفقرة مقال على شاشة واسعة؟', 'What is the benefit of max-width on an article paragraph on a wide screen?', [
      { id: 'a', ar: 'منع كتلة النص من الاتساع المفرط', en: 'Preventing the text block from becoming excessively wide' }, { id: 'b', ar: 'إخفاء الفقرة عند تصغير النافذة', en: 'Hiding the paragraph when the window narrows' }, { id: 'c', ar: 'تغيير معنى النص', en: 'Changing the meaning of the text' }, { id: 'd', ar: 'إضافة مسافات إلى محتوى الفقرة', en: 'Adding spaces to the paragraph content' },
    ], 'a', 'صحيح؛ يحدد max-width سقفًا للعرض مع السماح للكتلة بأن تكون أضيق.', 'Correct. max-width sets an upper limit while allowing the block to be narrower.', 'لا يغيّر max-width محتوى النص؛ إنه يقيّد أقصى عرض لكتلته.', 'max-width does not change the text content; it limits the block’s maximum width.', 'استخدم حد العرض لتحسين راحة قراءة الفقرات الطويلة.', 'Use a width limit to improve the reading comfort of long paragraphs.'),
  ),
  added('css-b-009-link-states', 13, 'حالات الروابط الواضحة', 'Clear Link States',
    'نسّق الروابط مع إبقائها قابلة للتعرّف والتنقل، ولا تعتمد على اللون وحده لتمييز الرابط.',
    'Style links so they remain recognizable and navigable, without relying on color alone to identify them.',
    ['إزالة التسطير من جميع الروابط من دون توفير علامة مرئية بديلة.', 'نسيان أن visited وhover حالتان مختلفتان للرابط.'],
    ['Removing underlines from every link without providing another visual cue.', 'Forgetting that visited and hover are different link states.'],
    [
      { titleAr: 'حافظ على دلالة الرابط', titleEn: 'Keep links recognizable', bodyAr: 'الرابط عنصر تنقل، لا مجرد نص مزخرف. يوضح التسطير عادةً أن النص قابل للنقر، ويفيد الزوار الذين لا يميزون الألوان بسهولة. إذا غيرت شكل التسطير، وفر إشارة أخرى واضحة مثل حد سفلي أو وزن خط مناسب مع تباين جيد.', bodyEn: 'A link is navigation, not merely decorated text. Underlining usually signals that text is clickable and helps people who do not easily distinguish colors. If you change the underline, provide another clear cue such as a bottom border or suitable weight with good contrast.', examples: [
        { code: 'a {\n  color: #075985;\n  text-decoration: underline;\n}', explanationAr: 'يبقى الرابط مسطرًا، ويضيف اللون تمييزًا إضافيًا لا وحيدًا.', explanationEn: 'The link remains underlined, with color as an additional rather than sole cue.' },
        { code: 'nav a {\n  text-decoration-thickness: 0.12em;\n}', explanationAr: 'تزيد سماكة التسطير مع الإبقاء على العلامة المألوفة للرابط.', explanationEn: 'The underline becomes more visible while preserving the familiar link cue.' },
      ] },
      { titleAr: 'نسّق الحالات من دون إخفائها', titleEn: 'Style states without hiding them', bodyAr: 'يمكن لمحدد :visited تنسيق الروابط التي زارها المستخدم، و:hover تنسيق الرابط تحت المؤشر. لا تجعل التغيير الوحيد لونًا متقاربًا مع النص العادي، وتذكر أن التنقل بلوحة المفاتيح له حالة focus تُعالَج في درس الوصول. اختر فرقًا مرئيًا ولا تضف مؤشرًا مضللًا.', bodyEn: 'The :visited selector can style links the user has visited, and :hover styles a link under the pointer. Do not make the only change a color close to ordinary text; keyboard focus has its own state, covered in the accessibility lesson. Choose a visible distinction and avoid a misleading pointer.', examples: [
        { code: 'a:visited {\n  color: #6b3f78;\n}', explanationAr: 'يفرق لون الزيارة بين الحالة السابقة والحالة الافتراضية مع بقاء النص رابطًا.', explanationEn: 'The visited color distinguishes the prior state while the text remains a link.' },
        { code: 'a:hover {\n  text-decoration-thickness: 0.2em;\n}', explanationAr: 'يبرز الرابط عند مرور المؤشر من دون إزالة التسطير.', explanationEn: 'The link is emphasized on pointer hover without removing its underline.' },
      ] },
    ],
    'نسّق روابط الصفحة بلون داكن متباين وتسطير ظاهر. أضف فرقًا لسلوك :hover و:visited، وتأكد من أن الرابط يظل معروفًا من دون الاعتماد على لونه وحده.',
    'Style page links with a contrasting dark color and visible underline. Add a distinction for :hover and :visited, and ensure links remain recognizable without relying on color alone.',
    quiz('ما أفضل ممارسة عند تغيير شكل روابط النص؟', 'What is a good practice when changing the appearance of text links?', [
      { id: 'a', ar: 'إزالة كل العلامات المرئية وترك اللون وحده', en: 'Remove all visual cues and rely only on color' }, { id: 'b', ar: 'إبقاء التسطير أو توفير إشارة واضحة أخرى', en: 'Keep the underline or provide another clear cue' }, { id: 'c', ar: 'جعل الروابط غير قابلة للتركيز', en: 'Make links unfocusable' }, { id: 'd', ar: 'تغيير النص إلى صورة', en: 'Turn the text into an image' },
    ], 'b', 'صحيح؛ يحتاج الزائر إلى علامة واضحة تدل على قابلية النص للتنقل.', 'Correct. Visitors need a clear cue that the text is navigable.', 'لا تجعل لون الرابط العلامة الوحيدة؛ حافظ على التسطير أو أضف تمييزًا مرئيًا آخر.', 'Do not make color the only link cue; keep the underline or add another visible distinction.', 'الرابط الواضح يدعم اكتشافه والتنقل إليه بمختلف طرق الاستخدام.', 'A clear link supports discovery and navigation across different ways of using the page.'),
  ),
  {
    id: 'css-specificity-inheritance', existingLessonId: 'css-specificity-inheritance', sequence: 14,
    titleAr: 'أولوية المحددات والوراثة', titleEn: 'Selector Priority and Inheritance',
    objectiveAr: 'قارن تصريحات لون متنافسة على الفقرة، وأضف خاصية قابلة للوراثة إلى الأب مع ترك الفقرة بلا تصريح مباشر لها.',
    objectiveEn: 'Compare competing color declarations on a paragraph, and add an inheritable property to its parent while leaving the paragraph without a direct declaration for it.',
    commonMistakesAr: ['افتراض أن كل خصائص CSS تنتقل بالوراثة إلى الأبناء.', 'إضافة تصريح مباشر للفقرة ثم توقع أن ترث القيمة من الأب.'],
    commonMistakesEn: ['Assuming every CSS property is inherited by children.', 'Adding a direct declaration to the paragraph and still expecting it to inherit the parent’s value.'],
  },
  added('css-b-010-source-order-cascade', 15, 'ترتيب القواعد المتساوية', 'Source Order for Equally Specific Rules',
    'افهم أثر ترتيب المصدر عندما تستهدف قواعد متساوية القوة العنصر نفسه وتضبط الخاصية نفسها.',
    'Understand the effect of source order when equally specific rules target the same element and property.',
    ['توقع أن القاعدة المكتوبة أولًا تفوز دائمًا.', 'إضافة تكرارات متعارضة من دون فحص بقية عوامل cascade.'],
    ['Expecting the first-written rule to always win.', 'Adding conflicting duplicates without checking the other cascade factors.'],
    [
      { titleAr: 'استخدم ترتيب المصدر عند التعادل', titleEn: 'Use source order to break a tie', bodyAr: 'إذا استهدفت قاعدتان العنصر نفسه، وكانتا متساويتين في الأهمية وspecificity والطبقة والعوامل الأخرى، تفوز القيمة التي تأتي لاحقًا في المصدر. ينطبق ذلك فقط عند التعادل؛ فلا تتجاوز قاعدة عامة قاعدة أقوى لمجرد أنها كُتبت بعدها.', bodyEn: 'If two rules target the same element and tie in importance, specificity, layer, and other cascade factors, the later declaration in source order wins. This applies only to a tie; a general rule does not beat a stronger one simply because it appears later.', examples: [
        { code: '.message {\n  color: #555;\n}\n.message {\n  color: #174a5b;\n}', explanationAr: 'للقاعدتين المحدد نفسه، لذا تكون القيمة الثانية هي المطبقة في هذا المثال.', explanationEn: 'Both rules use the same selector, so the second color applies in this example.' },
        { code: 'p { color: #555; }\np { color: #174a5b; }', explanationAr: 'يتعادل محددا العنصر، فتفوز القاعدة الثانية ما لم يوجد عامل cascade آخر يغيّر النتيجة.', explanationEn: 'The element selectors tie, so the second rule wins unless another cascade factor changes the result.' },
      ] },
      { titleAr: 'شخّص التعارض قبل إضافة قاعدة جديدة', titleEn: 'Diagnose before adding another rule', bodyAr: 'عند ظهور مظهر غير متوقع، حدّد العنصر والخاصية المتأثرة، ثم ابحث عن كل التصريحات التي تستهدفهما. قارن specificity والأهمية وموضع القواعد بدل تكديس محددات أو إضافة !important. تكرار القواعد قد يجعل الملف أصعب في الفهم.', bodyEn: 'When an appearance is unexpected, identify the element and property, then find every declaration that targets them. Compare specificity, importance, and rule order instead of stacking selectors or adding !important. Repeated rules can make the stylesheet harder to understand.', examples: [
        { code: '.notice { color: #444; }\n.notice { color: #174a5b; }', explanationAr: 'مقارنة القاعدتين تكشف أن المحدد والخاصية متماثلان وأن الترتيب هو الفرق.', explanationEn: 'Comparing the rules shows the selector and property are the same, so order is the difference.' },
        { code: '.notice { color: #444; }\n#status { color: #174a5b; }', explanationAr: 'هنا ليس التعادل قائمًا: يجب مراعاة اختلاف قوة المحدد، لا ترتيب المصدر وحده.', explanationEn: 'This is not a tie: the selector-strength difference matters, not source order alone.' },
      ] },
    ],
    'اكتب قاعدتين متساويتين للمحدد .status تحددان color بقيمتين مختلفتين. لاحظ أن القاعدة الأخيرة تفوز، ثم بدّل الترتيب واكتب ملاحظة قصيرة عن النتيجة.',
    'Write two equally specific .status rules with different color values. Observe that the later rule wins, then reverse their order and note the result.',
    quiz('متى تحسم قاعدة مكتوبة لاحقًا النتيجة عادةً؟', 'When does a later-written rule usually determine the result?', [
      { id: 'a', ar: 'عندما تتعادل القواعد في عوامل cascade الأخرى ذات الصلة', en: 'When the rules tie on the other relevant cascade factors' }, { id: 'b', ar: 'في جميع الحالات مهما كان المحدد', en: 'In every case regardless of selector' }, { id: 'c', ar: 'عندما تكون القاعدة داخل تعليق', en: 'When the rule is inside a comment' }, { id: 'd', ar: 'إذا كانت الخاصية غير صالحة', en: 'If the property is invalid' },
    ], 'a', 'صحيح؛ ترتيب المصدر يحسم التعادل، ولا يلغي العوامل الأخرى.', 'Correct. Source order breaks a tie; it does not erase the other factors.', 'القاعدة الأخيرة لا تفوز دائمًا؛ افحص specificity والأهمية وغيرها قبل الحكم.', 'The last rule does not always win; check specificity, importance, and other factors first.', 'رتّب فحصك: الخاصية والهدف، ثم عوامل cascade، ثم ترتيب المصدر عند التعادل.', 'Check the property and target, then cascade factors, then source order when tied.'),
  ),
  {
    id: 'css-box-model', existingLessonId: 'css-box-model', sequence: 16,
    titleAr: 'نموذج الصندوق والمسافات', titleEn: 'The Box Model and Spacing',
    objectiveAr: 'ميّز أجزاء نموذج الصندوق واستخدم padding وborder وmargin وbox-sizing لتنسيق مساحة العنصر.',
    objectiveEn: 'Identify the parts of the box model and use padding, border, margin, and box-sizing to style an element’s space.',
    commonMistakesAr: ['الخلط بين padding داخل الحد وmargin خارجه.', 'نسيان أن الأبعاد قد تشمل الحشوة والحدود أو تستثنيهما وفق box-sizing.'],
    commonMistakesEn: ['Confusing padding inside the border with margin outside it.', 'Forgetting that dimensions may include or exclude padding and borders depending on box-sizing.'],
  },
  added('css-b-011-border-box-sizing', 17, 'توقع الأبعاد باستخدام border-box', 'Predictable Sizing with border-box',
    'اجعل حساب العرض والارتفاع يشمل الحشوة والحدود باستخدام box-sizing: border-box لتقليل مفاجآت التخطيط.',
    'Make width and height calculations include padding and borders with box-sizing: border-box to reduce layout surprises.',
    ['استخدام border-box على عنصر واحد فقط مع توقع أن يشمل كل الصفحة.', 'اعتبار العرض حدًا أدنى عندما تعجز كلمة طويلة عن الالتفاف.'],
    ['Applying border-box to one element while expecting it to cover the whole page.', 'Treating width as a minimum when a long unbreakable word cannot wrap.'],
    [
      { titleAr: 'افهم طريقة احتساب العرض', titleEn: 'Understand how width is calculated', bodyAr: 'مع content-box الافتراضي، يمثل width مساحة المحتوى، وتضاف الحشوة والحدود خارجها. أما border-box فيجعل العرض المحدد يشمل المحتوى والحشوة والحد معًا. لذلك يسهل حساب بطاقات وأعمدة بعرض معلوم، خصوصًا عند جمعها في تخطيط.', bodyEn: 'With the default content-box model, width measures the content and padding and borders are added outside it. With border-box, the declared width includes content, padding, and border. This makes cards and columns with known widths easier to calculate, especially when combined in a layout.', examples: [
        { code: '.card {\n  box-sizing: border-box;\n  width: 20rem;\n  padding: 1rem;\n  border: 2px solid #667;\n}', explanationAr: 'يبقى العرض الكلي قريبًا من 20rem لأن الحشوة والحد داخل القياس.', explanationEn: 'The total width stays about 20rem because padding and border are included.' },
        { code: '.column {\n  box-sizing: border-box;\n  width: 50%;\n  padding: 1rem;\n}', explanationAr: 'لا تضيف الحشوة إلى نصف العرض المعلن في نموذج border-box.', explanationEn: 'The padding is not added outside the declared half-width in the border-box model.' },
      ] },
      { titleAr: 'طبّق الاختيار على الصفحة كلها', titleEn: 'Apply the choice consistently', bodyAr: 'من الشائع اعتماد border-box لكل العناصر الزخرفية باستخدام محدد عام. إذا استخدمت النجمة، أضف كذلك box-sizing: inherit إلى العناصر الزائفة كي تتبع القاعدة. هذا نمط شائع وليس شرطًا؛ افهم نطاقه ولا تتوقع أن يعالج وحده كل مشكلات العرض الضيق.', bodyEn: 'A common pattern is to use border-box for all elements with a universal selector. If you use the universal selector, also give pseudo-elements box-sizing: inherit so they follow the rule. This is a common pattern, not a requirement; understand its scope and do not expect it to solve every narrow-width problem.', examples: [
        { code: '* {\n  box-sizing: border-box;\n}', explanationAr: 'تعيّن القاعدة نموذج القياس لكل عنصر في الصفحة.', explanationEn: 'The rule sets the sizing model for every element on the page.' },
        { code: '*, *::before, *::after {\n  box-sizing: border-box;\n}', explanationAr: 'تشمل القاعدة العناصر وعناصرها الزائفة التي تنشئها CSS.', explanationEn: 'The rule includes elements and their CSS-generated pseudo-elements.' },
      ] },
    ],
    'اكتب قاعدة تجعل box-sizing: border-box لكل العناصر والعناصر الزائفة. أنشئ بعدها بطاقة بعرض 20rem وحشوة 1rem وحدّ 2px، وتأكد من أن العرض الكلي لا يتجاوز القيمة المحددة.',
    'Write a rule that sets box-sizing: border-box for all elements and pseudo-elements. Then create a card with a 20rem width, 1rem padding, and a 2px border, and check that its total width stays within the declared value.',
    quiz('ماذا يشمل width: 20rem عند استخدام box-sizing: border-box؟', 'What does width: 20rem include when box-sizing is border-box?', [
      { id: 'a', ar: 'المحتوى والحشوة والحد', en: 'Content, padding, and border' }, { id: 'b', ar: 'المحتوى فقط دائمًا', en: 'Only content, always' }, { id: 'c', ar: 'الهامش الخارجي فقط', en: 'Only the outer margin' }, { id: 'd', ar: 'ارتفاع العنصر', en: 'The element’s height' },
    ], 'a', 'صحيح؛ border-box يضم المحتوى والحشوة والحد ضمن العرض المعلن.', 'Correct. border-box includes content, padding, and border in the declared width.', 'في نموذج border-box، لا تضاف الحشوة والحد خارج العرض المعلن.', 'With border-box, padding and border are not added outside the declared width.', 'استخدم border-box عندما تريد أن يتضمن القياس الحشوة والحدود.', 'Use border-box when you want the measurement to include padding and borders.'),
  ),
  added('css-b-012-centering-with-margin-auto', 18, 'توسيط كتلة ذات عرض محدود', 'Centering a Width-Limited Block',
    'وسّط كتلة بعرض أقصى عبر هامشين تلقائيين، مع ترك العرض مرنًا للشاشات الأضيق.',
    'Center a block with a maximum width using automatic side margins while letting it adapt to narrower screens.',
    ['توقع أن margin-inline: auto يوسّط عنصرًا يمتد بعرض الحاوية كلها.', 'إضافة عرض ثابت كبير لا يتسع لنافذة الهاتف.'],
    ['Expecting margin-inline: auto to center an element that already fills the container.', 'Using a large fixed width that does not fit a phone viewport.'],
    [
      { titleAr: 'اجمع حد العرض والهامش التلقائي', titleEn: 'Combine a width limit and automatic margins', bodyAr: 'كتلة تمتد بعرض الحاوية لا تملك فراغًا جانبيًا لتوسيطه. ضع لها max-width أصغر من المساحة المتاحة، ثم اضبط الهوامش الجانبية إلى auto لتوزيع الفراغ بالتساوي. تبقى max-width حدًا أعلى لا عرضًا مفروضًا على الشاشة الصغيرة.', bodyEn: 'A block that already fills its container has no side space to distribute. Give it a max-width smaller than the available space, then set the side margins to auto to share the remaining space evenly. max-width is an upper limit, not a forced width on a small screen.', examples: [
        { code: '.page-shell {\n  max-width: 72rem;\n  margin-inline: auto;\n}', explanationAr: 'تتوسط الحاوية عندما تكون أعرض من المحتوى، وتظل ضمن عرضها المتاح.', explanationEn: 'The shell is centered when the container is wider and remains within the available width.' },
        { code: '.article {\n  width: min(100%, 68ch);\n  margin-inline: auto;\n}', explanationAr: 'تجمع الدالة min حدًا أقصى وعرضًا نسبيًا فلا يتجاوز المقال الحاوية.', explanationEn: 'The min function combines a cap with a relative width so the article does not exceed its container.' },
      ] },
      { titleAr: 'استخدم الخصائص المنطقية', titleEn: 'Use logical properties', bodyAr: 'تعني margin-inline جانبي العنصر في اتجاه الكتابة، فتناسب تخطيطات اليمين إلى اليسار واليسار إلى اليمين. في هذا الدرس استخدمها لتوسيط كتلة، مع تجنب وضع عرض ثابت واسع قد يسبب تمريرًا أفقيًا.', bodyEn: 'margin-inline means the element’s inline sides, so it suits both right-to-left and left-to-right writing. Use it here to center a block, and avoid a wide fixed width that may cause horizontal scrolling.', examples: [
        { code: '.content {\n  max-width: 60rem;\n  margin-inline: auto;\n}', explanationAr: 'تُوزّع الهوامش الجانبية المتبقية بالتساوي.', explanationEn: 'The remaining side margins are distributed equally.' },
        { code: '.content {\n  width: calc(100% - 2rem);\n  max-width: 60rem;\n  margin-inline: auto;\n}', explanationAr: 'يترك عرض السطر هامشًا من المساحة على الشاشات الصغيرة ويقف عند حد أقصى على الكبيرة.', explanationEn: 'The width leaves some room on small screens and stops growing at a cap on large ones.' },
      ] },
    ],
    'أنشئ .page-shell بعرض أقصى 72rem، واجعله لا يتجاوز عرض الحاوية، ثم وسّطه باستخدام margin-inline: auto. اختبره على نافذة ضيقة وأخرى واسعة.',
    'Create a .page-shell with a 72rem maximum width, keep it within its container, and center it with margin-inline: auto. Test it in both narrow and wide windows.',
    quiz('ما الذي يجعل margin-inline: auto مفيدًا لتوسيط كتلة؟', 'What makes margin-inline: auto useful for centering a block?', [
      { id: 'a', ar: 'يوزع المساحة الجانبية المتبقية بالتساوي', en: 'It distributes the remaining side space equally' }, { id: 'b', ar: 'يحوّل العنصر إلى شبكة', en: 'It turns the element into a grid' }, { id: 'c', ar: 'يخفي الهوامش دائمًا', en: 'It always hides margins' }, { id: 'd', ar: 'يحدد لون النص', en: 'It sets the text color' },
    ], 'a', 'صحيح؛ مع عرض محدود تتوزع المساحة الجانبية المتبقية على الجانبين.', 'Correct. With a width limit, the remaining side space is shared by both sides.', 'يحتاج التوسيط إلى مساحة متبقية؛ حدّد عرضًا أقصى للكتلة أولًا.', 'Centering needs remaining space; first give the block a maximum width.', 'اجمع max-width مع هامشين تلقائيين لتوسيط كتلة مرنة.', 'Combine max-width with automatic side margins to center a flexible block.'),
  ),
  {
    id: 'css-display-layout', existingLessonId: 'css-display-layout', sequence: 19,
    titleAr: 'أنماط العرض الأساسية', titleEn: 'Basic Display Modes',
    objectiveAr: 'استخدم display لاختيار ظهور العنصر وترتيبه كسطر مستقل أو ضمن السطر أو مخفيًا.',
    objectiveEn: 'Use display to choose whether an element takes its own line, stays within a line, or is hidden.',
    commonMistakesAr: ['الخلط بين inline وblock عند توقع أن يقبل العنصر أبعادًا كاملة.', 'استخدام display: none لإخفاء معلومة يحتاجها بعض الزوار.'],
    commonMistakesEn: ['Confusing inline and block when expecting the element to accept full dimensions.', 'Using display: none to hide information some visitors need.'],
  },
  added('css-b-013-overflow', 20, 'إدارة المحتوى الذي يتجاوز الحاوية', 'Managing Overflowing Content',
    'اختر سلوك overflow الملائم للنصوص أو المناطق القابلة للتمرير بدل قص المحتوى بصمت.',
    'Choose suitable overflow behavior for text or scrollable regions instead of silently clipping content.',
    ['استخدام overflow: hidden لإخفاء نص قد يحتاجه الزائر.', 'ضبط ارتفاع ثابت صغير لصندوق يحتوي محتوى متغير الطول.'],
    ['Using overflow: hidden to conceal text a visitor may need.', 'Setting a small fixed height on a box whose content length varies.'],
    [
      { titleAr: 'اعرف مصدر التجاوز', titleEn: 'Find the source of overflow', bodyAr: 'يحدث التجاوز عندما يتجاوز المحتوى مساحة العنصر. قد يكون السبب كلمة طويلة بلا فواصل أو عرضًا ثابتًا أو صورة أكبر من الحاوية. عالج السبب أولًا؛ القص قد يخفي معلومة أو يجعلها غير قابلة للوصول.', bodyEn: 'Overflow happens when content exceeds an element’s space. A long unbreakable word, fixed width, or oversized image may be responsible. Address the cause first; clipping can hide information or make it inaccessible.', examples: [
        { code: '.article {\n  overflow-wrap: anywhere;\n}', explanationAr: 'يسمح للكلمات أو السلاسل الطويلة بالالتفاف عند الضرورة.', explanationEn: 'Allows long words or strings to wrap when needed.' },
        { code: 'img {\n  max-width: 100%;\n  height: auto;\n}', explanationAr: 'يمنع الصورة من تجاوز عرض الحاوية مع الحفاظ على نسبتها الطبيعية.', explanationEn: 'Prevents an image from exceeding its container while preserving its natural ratio.' },
      ] },
      { titleAr: 'اختر التمرير عند وجود منطقة مستقلة', titleEn: 'Choose scrolling for a deliberate region', bodyAr: 'قد يناسب overflow: auto مساحة محدودة تحتوي محتوى طويلًا، مثل سجل نصي؛ يظهر التمرير عند الحاجة. لا تحصر المحتوى الأساسي في صندوق قصير بلا سبب، ولا تجعل التمرير الأفقي الوسيلة الوحيدة لقراءة نص عادي. افحص التخطيط على شاشة ضيقة.', bodyEn: 'overflow: auto may suit a bounded region with long content, such as a text log; scrolling appears when needed. Do not confine primary content to a short box without reason, and do not make horizontal scrolling the only way to read ordinary text. Check the layout on a narrow screen.', examples: [
        { code: '.log {\n  max-height: 16rem;\n  overflow: auto;\n}', explanationAr: 'تحدد المنطقة ارتفاعًا أقصى وتسمح بالتمرير عند زيادة محتواها.', explanationEn: 'The region has a maximum height and can scroll when its content is longer.' },
        { code: '.code-sample {\n  overflow-x: auto;\n  white-space: pre;\n}', explanationAr: 'يمكن أن يناسب مثال الشيفرة تمرير أفقي محدودًا، مع إبقاء النص متاحًا للقراءة.', explanationEn: 'A code sample may use limited horizontal scrolling while keeping its text available.' },
      ] },
    ],
    'أنشئ فقرة بنص طويل داخل حاوية ضيقة وتأكد من التفاف الكلمات باستخدام overflow-wrap. ثم صمّم .log بارتفاع أقصى 16rem وتمرير عند الحاجة، من دون قص النص بصمت.',
    'Put long text in a narrow container and allow words to wrap with overflow-wrap. Then give .log a 16rem maximum height and scrolling when needed, without silently clipping text.',
    quiz('ما التصرف الأنسب عند تجاوز كلمة طويلة مساحة فقرة؟', 'What is a suitable response when a long word exceeds a paragraph’s space?', [
      { id: 'a', ar: 'السماح بالتفافها عند الحاجة باستخدام overflow-wrap', en: 'Allow it to wrap as needed with overflow-wrap' }, { id: 'b', ar: 'حذف الفقرة من HTML', en: 'Delete the paragraph from HTML' }, { id: 'c', ar: 'إخفاء كل المحتوى باستخدام visibility: hidden', en: 'Hide all content with visibility: hidden' }, { id: 'd', ar: 'فرض ارتفاع 1px على الحاوية', en: 'Force the container to be 1px tall' },
    ], 'a', 'صحيح؛ الالتفاف يعالج السلاسل الطويلة من دون إخفاء المحتوى.', 'Correct. Wrapping addresses long strings without hiding the content.', 'لا تقص المعلومات ولا تخفها؛ ابدأ بمعالجة سبب التجاوز.', 'Do not clip or hide information; start by addressing the cause of overflow.', 'حافظ على الوصول إلى النص عند اختيار سلوك التجاوز.', 'Keep text accessible when choosing overflow behavior.'),
  ),
  {
    id: 'css-sizing-units', existingLessonId: 'css-sizing-units', sequence: 21,
    titleAr: 'الأبعاد ووحدات القياس', titleEn: 'Dimensions and CSS Units',
    objectiveAr: 'استخدم px و% وrem لضبط العرض وحجم الخط، وافهم ما الذي تقيسه كل وحدة في المثال.',
    objectiveEn: 'Use px, %, and rem to set width and text size, and understand what each unit measures in the example.',
    commonMistakesAr: ['اعتبار النسبة المئوية نسبة إلى الشاشة دائمًا بدل الحاوية المعنية.', 'نسيان الوحدة عند كتابة قيمة طول مثل width: 20px.'],
    commonMistakesEn: ['Treating a percentage as always relative to the viewport rather than its containing block.', 'Omitting the unit when writing a length such as width: 20px.'],
  },
  added('css-b-014-min-max-sizing', 22, 'حدود مرنة للأبعاد', 'Flexible Size Constraints',
    'استخدم min-width وmax-width وmin-height لضبط نطاق العنصر مع السماح لمحتواه وأبعاده بالتكيف.',
    'Use min-width, max-width, and min-height to constrain an element while allowing its content and dimensions to adapt.',
    ['تطبيق width ثابت كبير على شاشة صغيرة بدل استخدام حد أقصى مرن.', 'فرض ارتفاع يقطع المحتوى بدل السماح بتمدد العنصر.'],
    ['Applying a large fixed width on a small screen instead of a flexible maximum.', 'Forcing a height that clips content instead of allowing the element to grow.'],
    [
      { titleAr: 'فرّق بين الحجم والحد', titleEn: 'Distinguish a size from a limit', bodyAr: 'يحدد width عرضًا مطلوبًا، بينما يضع max-width سقفًا له. غالبًا يكون العرض النسبي مع حد أقصى أكثر مرونة من قيمة ثابتة؛ فلا تتجاوز الحاوية، وتبقى القراءة مريحة على الشاشة الكبيرة. أما min-width فيحدد أقل عرض مسموح، لذا استخدمه بحذر على الشاشات الصغيرة.', bodyEn: 'width sets a requested width, while max-width sets a ceiling. A relative width with a maximum is often more flexible than a fixed value: it stays within the container and remains comfortable on large screens. min-width sets a lower bound, so use it carefully on small screens.', examples: [
        { code: '.content {\n  width: 100%;\n  max-width: 70rem;\n}', explanationAr: 'تملأ الحاوية حتى تصل إلى الحد الأعلى، ثم لا تتمدد أكثر.', explanationEn: 'It fills the container until reaching the upper limit, then stops growing.' },
        { code: '.search {\n  min-width: 12rem;\n  max-width: 100%;\n}', explanationAr: 'يضبط حدًا أدنى مفيدًا مع حماية العنصر من تجاوز الحاوية.', explanationEn: 'Sets a useful lower limit while preventing the element from exceeding its container.' },
      ] },
      { titleAr: 'دع الارتفاع يتبع المحتوى', titleEn: 'Let height follow the content', bodyAr: 'النصوص قد تطول أو تلتف باختلاف اللغة وحجم الشاشة وتكبير المستخدم. لذلك تجنب ارتفاعًا ثابتًا صغيرًا للحاويات التي تحتوي نصًا؛ استخدم padding وmin-height عند الحاجة إلى حد أدنى، ودع الارتفاع التلقائي يستوعب المحتوى.', bodyEn: 'Text can grow or wrap differently with language, screen size, and user zoom. Avoid a small fixed height on text containers; use padding and min-height when a minimum is useful, and let automatic height accommodate the content.', examples: [
        { code: '.notice {\n  min-height: 4rem;\n  padding: 1rem;\n}', explanationAr: 'يضمن حدًا أدنى للمساحة، لكنه يسمح للعنصر بالازدياد مع المحتوى.', explanationEn: 'Provides a minimum space while allowing the element to grow with its content.' },
        { code: '.profile-card {\n  max-width: 28rem;\n  padding: 1.25rem;\n}', explanationAr: 'يقيّد عرض البطاقة من دون فرض ارتفاع قد يقص وصفًا طويلًا.', explanationEn: 'Limits card width without imposing a height that might clip a long description.' },
      ] },
    ],
    'نسّق .content بعرض 100% وحد أقصى 70rem، واجعل .notice ذات min-height: 4rem وحشوة مناسبة. أضف فقرة طويلة إلى notice وتأكد من تمددها بدل قصها.',
    'Style .content with width: 100% and max-width: 70rem, and give .notice min-height: 4rem with suitable padding. Add a long paragraph to notice and confirm that it grows instead of clipping it.',
    quiz('ما الذي تفعله max-width: 70rem؟', 'What does max-width: 70rem do?', [
      { id: 'a', ar: 'تضع سقفًا للعرض مع السماح بعرض أصغر', en: 'Sets an upper width limit while allowing a smaller width' }, { id: 'b', ar: 'تفرض عرضًا لا يقل عن 70rem', en: 'Forces a width of at least 70rem' }, { id: 'c', ar: 'تحدد ارتفاع العنصر', en: 'Sets the element’s height' }, { id: 'd', ar: 'تمنع التفاف النص', en: 'Prevents text wrapping' },
    ], 'a', 'صحيح؛ max-width حد أقصى، ويمكن أن يصغر العنصر عنه.', 'Correct. max-width is an upper limit, and the element may be narrower.', 'الحد الأدنى تكتبه min-width؛ أما max-width فهو السقف.', 'A lower bound is min-width; max-width is the ceiling.', 'اجمع عرضًا مرنًا مع حد أقصى عند تصميم حاوية تتكيف مع الشاشة.', 'Combine a flexible width with a maximum limit for an adaptable container.'),
  ),
  {
    id: 'css-display-visibility', existingLessonId: 'css-display-visibility', sequence: 23,
    titleAr: 'الفرق بين العرض والإخفاء', titleEn: 'Display and Visibility',
    objectiveAr: 'قارن بين display وvisibility عند إخفاء عنصر، وتعلّم متى يبقى مكانه محفوظًا.',
    objectiveEn: 'Compare display and visibility when hiding an element, and learn when its space remains reserved.',
    commonMistakesAr: ['توقع أن visibility: hidden تزيل المساحة من التخطيط.', 'استخدام display: none لإخفاء محتوى مهم من دون بديل.'],
    commonMistakesEn: ['Expecting visibility: hidden to remove the element’s layout space.', 'Using display: none to hide important content without an alternative.'],
  },
  {
    id: 'css-positioning', existingLessonId: 'css-positioning', sequence: 24,
    titleAr: 'التموضع وترتيب الطبقات', titleEn: 'Positioning and Stacking',
    objectiveAr: 'استخدم التموضع النسبي والمطلق، وافهم كيف يساعد z-index في ترتيب العناصر المتداخلة.',
    objectiveEn: 'Use relative and absolute positioning, and understand how z-index helps order overlapping elements.',
    commonMistakesAr: ['نسيان جعل الأب مرجعًا مموضعًا قبل وضع عنصر مطلق داخله.', 'الاعتقاد أن z-index يصلح كل تداخل مهما اختلف سياق التكديس.'],
    commonMistakesEn: ['Forgetting to make the parent a positioned reference before placing an absolute child inside it.', 'Assuming z-index fixes every overlap regardless of stacking context.'],
  },
  {
    id: 'css-flexbox', existingLessonId: 'css-flexbox', sequence: 26,
    titleAr: 'تنسيق العناصر باستخدام Flexbox', titleEn: 'Arranging Items with Flexbox',
    objectiveAr: 'استخدم Flexbox لترتيب العناصر في صف أو عمود، وضبط محاذاتها والمسافة بينها.',
    objectiveEn: 'Use Flexbox to arrange items in a row or column and control their alignment and spacing.',
    commonMistakesAr: ['تطبيق خصائص Flexbox على الابن بدل الحاوية المرنة.', 'الخلط بين محاذاة المحور الرئيسي ومحور التوزيع العرضي.'],
    commonMistakesEn: ['Applying Flexbox properties to a child instead of the flex container.', 'Confusing alignment on the main axis with alignment on the cross axis.'],
  },
  added('css-b-015-flex-navigation-alignment', 27, 'محاذاة عناصر التنقل بـ Flexbox', 'Aligning Navigation with Flexbox',
    'رتّب روابط تنقل متجاورة بـ Flexbox، واستخدم gap والمحاذاة المنطقية لمساحة متوازنة.',
    'Arrange neighboring navigation links with Flexbox and use gap and logical alignment for balanced spacing.',
    ['وضع display: flex على الرابط الواحد بدل الحاوية التي تضم الروابط.', 'استخدام مسافات يدوية بين الروابط بدل gap.'],
    ['Putting display: flex on an individual link instead of the container that holds the links.', 'Using manual spaces between links instead of gap.'],
    [
      { titleAr: 'اجعل القائمة حاوية مرنة', titleEn: 'Make the list a flex container', bodyAr: 'يطبّق display: flex على العنصر الأبناء المباشرين ليصبحوا عناصر مرنة. في قائمة تنقل دلالية، ضع الروابط داخل قائمة ثم اجعل القائمة أو غلافها هو الحاوية المرنة. لا تغيّر بنية HTML لمجرد التنسيق إذا كانت البنية الحالية واضحة.', bodyEn: 'Setting display: flex on a parent makes its direct children flex items. In semantic navigation, put links in a list and make the list or its wrapper the flex container. Do not change clear HTML structure solely for styling.', examples: [
        { code: '.nav-list {\n  display: flex;\n  gap: 1rem;\n}', explanationAr: 'ترتب عناصر القائمة في صف وتفصلها gap من دون مسافات نصية يدوية.', explanationEn: 'Arranges list items in a row and separates them with gap rather than manual text spaces.' },
        { code: '.nav-list {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n}', explanationAr: 'تحاذي العناصر عرضيًا وتبدأ الترتيب عند بداية المحور بحسب اتجاه الكتابة.', explanationEn: 'Aligns items on the cross axis and starts the row at the inline start for the writing direction.' },
      ] },
      { titleAr: 'وزّع المساحة بوضوح', titleEn: 'Distribute space deliberately', bodyAr: 'تتحكم gap بالمسافة بين العناصر، وalign-items بمحاذاتها على المحور العرضي. لا تضبط justify-content: space-between إلا إذا كان توزيع الأطراف بهذه الصورة هو المقصود، فقد يخلق فراغًا كبيرًا عند اختلاف العرض. افحص القائمة على عرض شاشة ضيق.', bodyEn: 'gap controls spacing between items, and align-items aligns them on the cross axis. Use justify-content: space-between only when that edge-to-edge distribution is intended; it can create large gaps when widths vary. Check the navigation at a narrow screen width.', examples: [
        { code: '.nav-list {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n}', explanationAr: 'تجعل الفجوة ثابتة بين الروابط وتضمن محاذاتها رأسيًا.', explanationEn: 'Creates a consistent gap between links and aligns them vertically.' },
        { code: '.nav-list {\n  display: flex;\n  justify-content: space-between;\n  gap: 1rem;\n}', explanationAr: 'يوزع المساحة المتاحة بين العناصر؛ لا تستخدمه إذا كان الفراغ الواسع يضر القراءة.', explanationEn: 'Distributes available space among items; avoid it if wide gaps harm readability.' },
      ] },
    ],
    'أنشئ قائمة روابط .nav-list واجعلها حاوية flex. أضف gap: 1rem وalign-items: center، وتأكد من بقاء الروابط قابلة للقراءة والنقر عند ضيق المساحة.',
    'Create a .nav-list of links and make it a flex container. Add gap: 1rem and align-items: center, then check that links remain readable and operable when space is tight.',
    quiz('على أي عنصر تضع display: flex لترتيب الروابط الشقيقة؟', 'Which element gets display: flex to arrange sibling links?', [
      { id: 'a', ar: 'على الحاوية الأب التي تضمها', en: 'On their parent container' }, { id: 'b', ar: 'على كل رابط منفردًا فقط', en: 'Only on each individual link' }, { id: 'c', ar: 'على body دائمًا', en: 'Always on body' }, { id: 'd', ar: 'على ملف HTML نفسه', en: 'On the HTML file itself' },
    ], 'a', 'صحيح؛ Flexbox يرتب الأبناء المباشرين للحاوية التي عليها display: flex.', 'Correct. Flexbox arranges the direct children of the container with display: flex.', 'ابدأ بالحاوية التي تضم العناصر المتجاورة، لا بكل عنصر ابن.', 'Start with the container holding the neighboring items, not each child.', 'خصائص الحاوية المرنة تضبط توزيع أبنائها المباشرين.', 'Flex container properties arrange its direct children.'),
  ),
  added('css-b-016-flex-wrap', 28, 'التفاف عناصر Flexbox', 'Wrapping Flex Items',
    'اسمح للعناصر المرنة بالانتقال إلى صف جديد عند ضيق المساحة بدل ضغطها أو خلق تمرير غير مقصود.',
    'Allow flex items to move to a new row when space is tight instead of shrinking them excessively or causing unintended scrolling.',
    ['توقع أن Flexbox يلتف تلقائيًا من دون ضبط flex-wrap.', 'استخدام nowrap لقائمة طويلة من البطاقات على شاشة ضيقة.'],
    ['Expecting Flexbox to wrap automatically without setting flex-wrap.', 'Using nowrap for a long row of cards on a narrow screen.'],
    [
      { titleAr: 'فعّل الالتفاف', titleEn: 'Enable wrapping', bodyAr: 'السلوك الافتراضي لـ Flexbox هو محاولة إبقاء العناصر في صف واحد. يتيح flex-wrap: wrap نقل العناصر إلى صف إضافي عندما لا تكفي المساحة، ما يحافظ على عرض مقروء بدل ضغط العناصر أو تجاوزها للحاوية.', bodyEn: 'Flexbox’s default behavior is to try to keep items on one line. flex-wrap: wrap lets items move to another row when there is not enough room, preserving readable widths instead of squeezing items or overflowing the container.', examples: [
        { code: '.tag-list {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n}', explanationAr: 'تلتف العلامات إلى صفوف جديدة، مع فجوة منتظمة بينها.', explanationEn: 'Tags wrap onto new rows with consistent spacing.' },
        { code: '.cards {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n}', explanationAr: 'تسمح الحاوية للبطاقات بالانتقال إلى صف لاحق عند الحاجة.', explanationEn: 'The container lets cards move to another row when needed.' },
      ] },
      { titleAr: 'لا تعتمد على عدد صفوف ثابت', titleEn: 'Do not rely on a fixed row count', bodyAr: 'يتغير عدد العناصر في كل صف بحسب مساحة الحاوية وحجم المحتوى. اختبر أحجام نافذة مختلفة ونصوصًا أطول، ولا تضبط ارتفاعًا ثابتًا يقص الصفوف الجديدة. يمكن أن يساعد حد أدنى منطقي للعرض في جعل الالتفاف أكثر توقعًا.', bodyEn: 'The number of items per row changes with the container and content size. Test different viewport widths and longer text, and avoid a fixed height that clips new rows. A sensible minimum item width can make wrapping more predictable.', examples: [
        { code: '.tag {\n  min-width: 7rem;\n  padding: 0.5rem;\n}', explanationAr: 'يساعد الحد الأدنى على منع العناصر من الانكماش إلى عرض غير عملي.', explanationEn: 'The minimum helps prevent items from shrinking to an impractical width.' },
        { code: '.card-row {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 1rem;\n}', explanationAr: 'لا تفرض ارتفاعًا على الحاوية؛ دع الصفوف الإضافية تزيد ارتفاعها الطبيعي.', explanationEn: 'Do not force a height on the container; let additional rows increase its natural height.' },
      ] },
    ],
    'أنشئ مجموعة علامات .tag-list مرنة تلتف إلى صفوف متعددة مع فجوة 0.5rem. اختبر وجود عدد كبير من العلامات على شاشة هاتف، وتأكد من عدم وجود تمرير أفقي غير مقصود.',
    'Create a .tag-list flex container that wraps onto multiple rows with a 0.5rem gap. Test many tags on a phone-sized screen and confirm that no unintended horizontal scrolling appears.',
    quiz('ما التصريح الذي يسمح لعناصر Flexbox بالانتقال إلى صف آخر؟', 'Which declaration allows Flexbox items to move to another row?', [
      { id: 'a', ar: 'flex-wrap: wrap', en: 'flex-wrap: wrap' }, { id: 'b', ar: 'flex-wrap: none', en: 'flex-wrap: none' }, { id: 'c', ar: 'display: inline', en: 'display: inline' }, { id: 'd', ar: 'overflow: hidden', en: 'overflow: hidden' },
    ], 'a', 'صحيح؛ wrap يسمح للعناصر بالتفافها عندما تضيق المساحة.', 'Correct. wrap allows items to wrap when space becomes limited.', 'لا يعالج إخفاء التجاوز مشكلة تخطيط العناصر؛ استخدم flex-wrap: wrap.', 'Hiding overflow does not fix the item layout; use flex-wrap: wrap.', 'عند احتمال ضيق المساحة، اختبر الالتفاف على شاشات مختلفة.', 'When space may become tight, test wrapping at different screen sizes.'),
  ),
  {
    id: 'css-responsive', existingLessonId: 'css-responsive', sequence: 29,
    titleAr: 'التصميم المتجاوب والبدء بالهاتف', titleEn: 'Responsive Design and Mobile First',
    objectiveAr: 'اكتب CSS يبدأ بتخطيط مناسب للهاتف، ثم غيّره باستخدام media query عند اتساع الشاشة.',
    objectiveEn: 'Write CSS that starts with a phone-friendly layout, then changes it with a media query on wider screens.',
    commonMistakesAr: ['كتابة قواعد سطح المكتب أولًا من دون خطة واضحة للتصميم الأصغر.', 'وضع الأقواس أو شرط العرض في media query بصيغة غير صحيحة.'],
    commonMistakesEn: ['Writing desktop rules first without a clear plan for smaller designs.', 'Writing the braces or width condition of a media query incorrectly.'],
  },
  added('css-b-017-image-cropping', 31, 'ملاءمة الصور داخل الإطارات', 'Fitting Images into Frames',
    'حافظ على نسب الصور أو املأ إطارًا محددًا باستخدام object-fit، مع فهم أثر القص على الصورة.',
    'Preserve image proportions or fill a fixed frame with object-fit while understanding how cropping affects the image.',
    ['تمديد الصورة بعرض وارتفاع ثابتين من دون object-fit، فتتشوه نسبتها.', 'قص جزء مهم من الصورة وعدم فحص نقطة التركيز أو النص البديل.'],
    ['Setting fixed image width and height without object-fit, which can distort its proportions.', 'Cropping an important part of an image without checking its focal point or alternative text.'],
    [
      { titleAr: 'حافظ على النسبة داخل المحتوى', titleEn: 'Preserve the ratio in content images', bodyAr: 'تستجيب الصورة المرنة لعرض الحاوية عبر max-width: 100%، ويمنع height: auto تمددها عموديًا بنسبة مختلفة. هذا مناسب لمعظم الصور ذات المحتوى الكامل. حافظ أيضًا على نص بديل مفيد في HTML عندما تحمل الصورة معنى.', bodyEn: 'A responsive image follows its container width with max-width: 100%, and height: auto prevents distortion. This suits most content images that should remain fully visible. Also keep useful alternative text in HTML when the image conveys meaning.', examples: [
        { code: '.article img {\n  max-width: 100%;\n  height: auto;\n}', explanationAr: 'تتناسب الصورة مع الحاوية وتحافظ على نسب أبعادها الأصلية.', explanationEn: 'The image fits its container while preserving its original aspect ratio.' },
        { code: '.avatar {\n  width: 4rem;\n  height: 4rem;\n  border-radius: 50%;\n  object-fit: cover;\n}', explanationAr: 'تملأ الصورة الدائرية الإطار ويُقص الزائد بدل تشويه الصورة.', explanationEn: 'The circular image fills its frame and crops the excess instead of distorting it.' },
      ] },
      { titleAr: 'استخدم القص بوعي', titleEn: 'Use cropping deliberately', bodyAr: 'تُستخدم object-fit: cover لملء إطار ثابت مع اقتطاع جزء قد يخرج عن الإطار. افحص وجه الصورة أو العنصر المهم بعد القص، ويمكن تغيير موضع التركيز بـ object-position. أما contain فيظهر الصورة كاملة وقد يترك مساحة فارغة داخل الإطار.', bodyEn: 'object-fit: cover fills a fixed frame by cropping parts that do not fit. Check a face or important subject after cropping; object-position can adjust the focus. contain keeps the whole image visible but may leave empty space inside the frame.', examples: [
        { code: '.thumbnail {\n  width: 16rem;\n  aspect-ratio: 4 / 3;\n  object-fit: cover;\n}', explanationAr: 'إطار بنسبة 4:3 يعرض قصًا يملأ المساحة؛ تحقق من بقاء الموضوع المهم ظاهرًا.', explanationEn: 'A 4:3 frame uses a filling crop; check that the important subject remains visible.' },
        { code: '.diagram {\n  width: 100%;\n  height: 12rem;\n  object-fit: contain;\n}', explanationAr: 'يظهر الرسم كاملًا داخل الإطار مع إمكان وجود فراغ حوله.', explanationEn: 'The complete diagram remains visible inside the frame, with possible empty space around it.' },
      ] },
    ],
    'اجعل صور المقال max-width: 100% وheight: auto. أنشئ صورة مصغرة بإطار 4:3 وobject-fit: cover، ثم افحص القص وتأكد من أن النص البديل موجود للصورة ذات المعنى.',
    'Set article images to max-width: 100% and height: auto. Create a 4:3 thumbnail frame with object-fit: cover, inspect the crop, and ensure meaningful images have alternative text.',
    quiz('ما أثر object-fit: cover داخل إطار ثابت؟', 'What does object-fit: cover do in a fixed frame?', [
      { id: 'a', ar: 'يملأ الإطار مع احتمال قص جزء من الصورة', en: 'Fills the frame and may crop part of the image' }, { id: 'b', ar: 'يضمن إظهار الصورة كاملة مع فراغات دائمًا', en: 'Always shows the whole image with gaps' }, { id: 'c', ar: 'يغيّر النص البديل للصورة', en: 'Changes the image alternative text' }, { id: 'd', ar: 'يحوّل الصورة إلى خلفية CSS', en: 'Turns the image into a CSS background' },
    ], 'a', 'صحيح؛ cover يملأ الإطار وقد يقص الأجزاء التي لا تتسع له.', 'Correct. cover fills the frame and may crop parts that do not fit.', 'contain هو الخيار الذي يظهر الصورة كاملة، وقد يترك فراغًا.', 'contain keeps the whole image visible and may leave empty space.', 'اختر cover للملء والقص، وcontain لعرض الصورة كاملة داخل الإطار.', 'Choose cover to fill and crop, and contain to show the whole image in the frame.'),
  ),
  {
    id: 'css-grid', existingLessonId: 'css-grid', sequence: 32,
    titleAr: 'تخطيط الشبكة بـ Grid', titleEn: 'Grid Layout',
    objectiveAr: 'أنشئ شبكة من عمودين باستخدام display: grid وgrid-template-columns وgap.',
    objectiveEn: 'Create a two-column grid with display: grid, grid-template-columns, and gap.',
    commonMistakesAr: ['وضع خصائص الأعمدة على عنصر ليس حاوية Grid.', 'نسيان gap والاعتماد على هوامش متضاربة لكل بطاقة.'],
    commonMistakesEn: ['Putting column properties on an element that is not a Grid container.', 'Forgetting gap and relying on conflicting margins on every card.'],
  },
  added('css-b-018-auto-fit-grid', 33, 'شبكة تتكيف مع عرض الحاوية', 'A Grid That Adapts to Its Container',
    'اجمع repeat وauto-fit وminmax لإنشاء أعمدة بطاقات تتكيف مع المساحة المتاحة من دون تثبيت عددها.',
    'Combine repeat, auto-fit, and minmax to create card columns that adapt to available space without fixing their count.',
    ['افتراض أن auto-fit يعني عدد أعمدة ثابتًا على كل الأجهزة.', 'اختيار حد أدنى للبطاقة أعرض من المساحة المتاحة، ما يسبب تجاوزًا.'],
    ['Assuming auto-fit means a fixed number of columns on every device.', 'Choosing a card minimum wider than the available space, causing overflow.'],
    [
      { titleAr: 'دع الشبكة تحسب عدد الأعمدة', titleEn: 'Let Grid calculate the column count', bodyAr: 'تكرر repeat المسار، ويتيح auto-fit وضع أكبر عدد ممكن من الأعمدة في المساحة. تحدد minmax حدًا أدنى وحدًا أقصى مرنًا لكل عمود. يتغير عدد الأعمدة تلقائيًا بتغير عرض الحاوية بدل كتابة نقطة توقف لكل عدد.', bodyEn: 'repeat creates repeated tracks, while auto-fit lets Grid fit as many columns as possible into the space. minmax gives each column a flexible lower and upper bound. The column count changes with container width instead of requiring a breakpoint for each count.', examples: [
        { code: '.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));\n  gap: 1rem;\n}', explanationAr: 'يستوعب المساحة أكبر عدد ممكن من الأعمدة التي لا يقل عرضها عن 14rem تقريبًا.', explanationEn: 'The available space fits as many columns as possible, each with a minimum around 14rem.' },
        { code: '.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));\n}', explanationAr: 'تُعيد الشبكة ترتيب الأعمدة تلقائيًا عندما تتسع الحاوية أو تضيق.', explanationEn: 'The grid rearranges its columns as the container grows or shrinks.' },
      ] },
      { titleAr: 'اختر حدًا يناسب المحتوى', titleEn: 'Choose a minimum that suits the content', bodyAr: 'يحدد الحد الأدنى ما إذا كانت البطاقات ستبقى مقروءة، لكنه يجب أن يناسب أضيق حاوية متوقعة. يمكن استعمال min(100%, 14rem) كحد مرن في المسارات لتفادي تجاوز الحاوية الضيقة. اختبر عناوين طويلة وتكبير النص، لا المظهر عند عرض واحد فقط.', bodyEn: 'The minimum determines whether cards remain readable, but it must fit the narrowest expected container. A flexible minimum such as min(100%, 14rem) in the track can avoid overflow in a very narrow container. Test long headings and text zoom, not just one viewport.', examples: [
        { code: '.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));\n  gap: 1rem;\n}', explanationAr: 'تسمح قيمة min للمسار بالانكماش ضمن الحاويات الأصغر من 14rem.', explanationEn: 'The min value lets a track shrink inside containers narrower than 14rem.' },
        { code: '.card {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}', explanationAr: 'يساعد ذلك محتوى البطاقة على البقاء داخل العمود بدل فرض عرض أكبر عليه.', explanationEn: 'This helps card content stay within its column rather than forcing it wider.' },
      ] },
    ],
    'أنشئ .card-grid بأعمدة repeat(auto-fit, minmax(14rem, 1fr)) وفجوة 1rem. استخدم أربع بطاقات، وغيّر عرض النافذة لتلاحظ عدد الأعمدة من دون كتابة media query لكل حالة.',
    'Create .card-grid with repeat(auto-fit, minmax(14rem, 1fr)) columns and a 1rem gap. Use four cards and change the window width to observe the column count without writing a media query for each case.',
    quiz('ما دور minmax في شبكة البطاقات؟', 'What is the role of minmax in the card grid?', [
      { id: 'a', ar: 'تحديد مجال للعرض الأدنى والأقصى لمسار الشبكة', en: 'Set a lower and upper size range for a grid track' }, { id: 'b', ar: 'تغيير لون البطاقة', en: 'Change the card color' }, { id: 'c', ar: 'إخفاء الأعمدة عند تضييق النافذة', en: 'Hide columns when the window narrows' }, { id: 'd', ar: 'إضافة مسافة داخلية للنص', en: 'Add text padding' },
    ], 'a', 'صحيح؛ تحدد minmax حدًا أدنى وحدًا أقصى لمسار الشبكة.', 'Correct. minmax sets a lower and upper bound for a grid track.', 'لا تنشئ minmax لونًا أو إخفاء؛ إنها تضبط حجم مسار الشبكة.', 'minmax does not create color or hiding; it sets a grid track’s size range.', 'استخدم auto-fit مع minmax عندما تريد أعمدة تتكيف تلقائيًا مع المساحة.', 'Use auto-fit with minmax when you want columns to adapt automatically to space.'),
  ),
  {
    id: 'css-responsive-page', existingLessonId: 'css-responsive-page', sequence: 34,
    titleAr: 'صفحة متجاوبة متعددة الأقسام', titleEn: 'A Responsive Multi-section Page',
    objectiveAr: 'نسّق صفحة تضم رأسًا ومحتوى وشريطًا جانبيًا، ثم غيّر توزيع الأعمدة والمسافات للشاشات الأضيق باستخدام استعلام وسائط.',
    objectiveEn: 'Style a page with a header, main content, and sidebar, then change its columns and spacing for narrower screens with a media query.',
    commonMistakesAr: ['فرض أعمدة جانبية على شاشة لا تتسع لها.', 'تكرار تخطيطات متضاربة داخل استعلامات وسائط من دون اختبار الصفحة كاملة.'],
    commonMistakesEn: ['Forcing side-by-side columns on a screen too narrow to fit them.', 'Repeating conflicting layouts in media queries without testing the whole page.'],
  },
  added('css-b-019-logical-properties', 35, 'خصائص تخطيط تدعم اتجاه الكتابة', 'Writing-direction-aware Layout Properties',
    'استخدم الخصائص المنطقية للمسافات والمحاذاة كي يعمل التنسيق في العربية واللغات ذات الاتجاه المختلف.',
    'Use logical spacing and alignment properties so the design works in Arabic and languages with different writing directions.',
    ['استبدال كل الخصائص الفيزيائية عشوائيًا من دون فهم محور الكتابة.', 'افتراض أن inline-start يعني اليسار دائمًا.'],
    ['Replacing physical properties randomly without understanding the writing axis.', 'Assuming inline-start always means left.'],
    [
      { titleAr: 'فكّر في البداية والنهاية', titleEn: 'Think in start and end', bodyAr: 'تشير الخصائص الفيزيائية مثل margin-left إلى جهة ثابتة. أما margin-inline-start فتشير إلى بداية السطر وفق اتجاه الكتابة؛ وقد تكون يمينًا في العربية ويسارًا في الإنجليزية. هذه الخصائص تساعد عند تبديل اللغة من دون قلب كل تصريح يدويًا.', bodyEn: 'Physical properties such as margin-left refer to a fixed side. margin-inline-start refers to the beginning of the line according to writing direction; that can be right in Arabic and left in English. These properties help when language changes without manually reversing every declaration.', examples: [
        { code: '.notice {\n  margin-inline-start: 1rem;\n}', explanationAr: 'يبدأ الهامش من بداية السطر بحسب اتجاه المحتوى.', explanationEn: 'The margin begins at the inline start according to the content direction.' },
        { code: '.card {\n  padding-block: 1rem;\n  padding-inline: 1.25rem;\n}', explanationAr: 'يضبط padding-block الجانبين الرأسيين وpadding-inline جانبي السطر.', explanationEn: 'padding-block sets the two block sides, while padding-inline sets the inline sides.' },
      ] },
      { titleAr: 'وحّد المحاذاة مع تدفق النص', titleEn: 'Align with the text flow', bodyAr: 'تتبع text-align: start بداية النص في اتجاهه، وتمنحك margin-inline وpadding-inline صياغة متناظرة. يساعد ذلك في الواجهة العربية واللغات ذات اتجاه اليسار إلى اليمين. اختبر اللغة والاتجاه اللذين يستخدمهما HTML؛ لا تعكس الصفحة يدويًا بمجرد نقل النص.', bodyEn: 'text-align: start follows the beginning of text in its direction, and margin-inline and padding-inline provide symmetric phrasing. This helps Arabic interfaces and left-to-right languages. Test the language and direction set by HTML; do not manually flip the page just because the text changes.', examples: [
        { code: '.article {\n  text-align: start;\n  margin-inline: auto;\n}', explanationAr: 'تتبع المحاذاة اتجاه النص، بينما يتوسط الهامش الحاوية.', explanationEn: 'Text alignment follows the writing direction while the margins center the container.' },
        { code: '.icon-label {\n  padding-inline-start: 0.5rem;\n}', explanationAr: 'تضاف المسافة عند بداية السطر سواء أكانت البداية يمينًا أم يسارًا.', explanationEn: 'Spacing is added at the line start, whether that is on the right or left.' },
      ] },
    ],
    'استبدل margin-left في مكوّن وصفي بـ margin-inline-start، واستبدل الحشوات الجانبية بـ padding-inline. اختبر العرض باتجاهي RTL وLTR وتحقق من أن المسافات تقع في بداية السطر.',
    'Replace margin-left in a label component with margin-inline-start, and replace side padding with padding-inline. Test both RTL and LTR and confirm spacing follows the inline start.',
    quiz('في واجهة عربية، إلى أي جهة تشير inline-start عادةً؟', 'In an Arabic interface, which side does inline-start usually refer to?', [
      { id: 'a', ar: 'بداية السطر وفق اتجاه الكتابة، وغالبًا اليمين', en: 'The start of the line in the writing direction, usually the right' }, { id: 'b', ar: 'اليسار دائمًا', en: 'Always the left' }, { id: 'c', ar: 'أسفل العنصر', en: 'The bottom of the element' }, { id: 'd', ar: 'مركز الشاشة', en: 'The center of the screen' },
    ], 'a', 'صحيح؛ الخاصية منطقية وتتبع اتجاه السطر، لا جهة ثابتة.', 'Correct. The logical property follows line direction rather than a fixed side.', 'لا يعني inline-start اليسار دائمًا؛ راجع اتجاه الكتابة.', 'inline-start does not always mean left; check the writing direction.', 'تساعد الخصائص المنطقية على مشاركة القواعد بين RTL وLTR.', 'Logical properties help styles work across RTL and LTR.'),
  ),
  {
    id: 'css-pseudo-selectors', existingLessonId: 'css-pseudo-selectors', sequence: 36,
    titleAr: 'حالات العناصر والعناصر الزائفة', titleEn: 'Pseudo-classes and Pseudo-elements',
    objectiveAr: 'استخدم :hover لاختيار حالة تفاعل، و::before لإضافة محتوى زخرفي مرتبط بالعنصر.',
    objectiveEn: 'Use :hover to target an interaction state and ::before to add decorative content associated with an element.',
    commonMistakesAr: ['اعتبار :hover عنصر HTML جديدًا بدل حالة للعنصر.', 'وضع معلومات أساسية في ::before بدل HTML.'],
    commonMistakesEn: ['Treating :hover as a new HTML element instead of an element state.', 'Putting essential information in ::before instead of HTML.'],
  },
  added('css-b-020-keyboard-focus', 37, 'إظهار التركيز لمستخدمي لوحة المفاتيح', 'Visible Focus for Keyboard Users',
    'حافظ على مؤشر تركيز واضح للعناصر التفاعلية، واستخدم :focus-visible لتنسيقه من دون إزالته.',
    'Keep a clear focus indicator on interactive elements and style it with :focus-visible without removing it.',
    ['إزالة outline من دون بديل مرئي.', 'الاعتماد على hover وحده، مع أن لوحة المفاتيح لا تستخدم مؤشر الفأرة.'],
    ['Removing outline without a visible replacement.', 'Relying only on hover even though a keyboard does not use a pointer.'],
    [
      { titleAr: 'افهم التركيز', titleEn: 'Understand focus', bodyAr: 'يستخدم زائر لوحة المفاتيح Tab للتنقل بين الروابط والأزرار وعناصر التحكم. يوضح مؤشر focus أي عنصر يستقبل الإدخال الآن. إذا أزلت outline بلا بديل، قد يفقد الزائر موضعه؛ أبق المؤشر واضحًا وذا تباين كافٍ.', bodyEn: 'A keyboard user presses Tab to move among links, buttons, and controls. The focus indicator shows which element receives input now. If outline is removed without a replacement, the visitor may lose their place; keep the indicator clear and sufficiently contrasted.', examples: [
        { code: 'a:focus-visible, button:focus-visible {\n  outline: 3px solid #b45309;\n  outline-offset: 3px;\n}', explanationAr: 'يظهر حد التركيز عند تنقل لوحة المفاتيح، مع مسافة تفصله بصريًا عن العنصر.', explanationEn: 'A focus ring appears during keyboard navigation, with spacing that separates it from the element.' },
        { code: 'input:focus-visible {\n  outline: 3px solid #174a5b;\n}', explanationAr: 'يحصل حقل الإدخال على مؤشر تركيز واضح عند الحاجة.', explanationEn: 'The input receives a clear focus indicator when needed.' },
      ] },
      { titleAr: 'اختبر التنقل دون فأرة', titleEn: 'Test without a mouse', bodyAr: 'اضغط Tab وShift+Tab على الصفحة وتأكد من وضوح العنصر المحدد وتسلسل التنقل المنطقي. لا تكتفِ بتغيير لون العنصر أو الاعتماد على :hover؛ فهذه الحالة لا تمثل تركيز لوحة المفاتيح. تحقق من أن نمط التركيز لا يُقص داخل حاوية ذات overflow.', bodyEn: 'Press Tab and Shift+Tab through the page and check that the focused element is visible and the order is logical. Do not rely on color change or :hover; that state does not represent keyboard focus. Check that the focus style is not clipped inside an overflow container.', examples: [
        { code: 'button:focus-visible {\n  outline: 3px solid #b45309;\n  outline-offset: 2px;\n}', explanationAr: 'يظل التركيز ظاهرًا ولا يُستبدل بتغيير هامشي في لون الزر.', explanationEn: 'Focus remains visible instead of being replaced by a subtle button-color change.' },
        { code: 'a:focus-visible {\n  text-decoration-thickness: 0.2em;\n}', explanationAr: 'يمكن تعزيز علامة الرابط عند التركيز مع الإبقاء على مؤشر التركيز العام واضحًا.', explanationEn: 'The link cue can be strengthened on focus while keeping the general focus indicator clear.' },
      ] },
    ],
    'أضف مؤشر focus-visible واضحًا للروابط والأزرار وحقول الإدخال باستخدام outline متباين. تنقل عبر الصفحة باستخدام Tab فقط، وتأكد من رؤية كل عنصر نشط ومن عدم الاعتماد على hover.',
    'Add a clear focus-visible indicator to links, buttons, and inputs with a contrasting outline. Navigate using only Tab and confirm every active item is visible without relying on hover.',
    quiz('لماذا لا ينبغي إزالة outline من الأزرار بلا بديل؟', 'Why should you not remove a button outline without a replacement?', [
      { id: 'a', ar: 'لأن مستخدم لوحة المفاتيح يحتاج معرفة العنصر الذي عليه التركيز', en: 'Because keyboard users need to know which element is focused' }, { id: 'b', ar: 'لأنه يغيّر محتوى HTML', en: 'Because it changes HTML content' }, { id: 'c', ar: 'لأن CSS لا تسمح بتغيير الأزرار', en: 'Because CSS cannot style buttons' }, { id: 'd', ar: 'لأن hover يعمل بلوحة المفاتيح دائمًا', en: 'Because hover always works with a keyboard' },
    ], 'a', 'صحيح؛ مؤشر واضح يساعد مستخدم لوحة المفاتيح على تتبع موضعه.', 'Correct. A clear indicator helps a keyboard user track their place.', 'حافظ على مؤشر التركيز أو استبدله بأسلوب مرئي مكافئ.', 'Keep the focus indicator or replace it with an equally visible style.', 'اختبر واجهة التفاعل باستخدام Tab، لا باستخدام الفأرة وحدها.', 'Test interactive interfaces with Tab, not only with a mouse.'),
  ),
  added('css-b-021-form-control-styling', 38, 'تنسيق حقول النماذج بأمان', 'Styling Form Controls Safely',
    'نسّق حقول الإدخال والأزرار مع الحفاظ على دلالتها وتسمياتها ومؤشرات التركيز ووضوح الحالات.',
    'Style inputs and buttons while preserving semantics, labels, focus indicators, and clear states.',
    ['إزالة حدود الحقل ومؤشر تركيزه معًا.', 'تغيير المظهر بحيث لا يعود الفرق بين الحقل الفعال وغير الفعال واضحًا.'],
    ['Removing both the input border and focus indicator.', 'Changing appearance until the difference between enabled and disabled fields is unclear.'],
    [
      { titleAr: 'ابدأ بمحددات واضحة', titleEn: 'Start with clear selectors', bodyAr: 'نسّق عناصر النموذج بحسب نوعها أو فئتها، ولا تحوّل العنصر الدلالي إلى نوع آخر لأجل المظهر. تُبقي قواعد متناسقة للخط والحشوة والحدود النماذج مفهومة، بينما يجب أن يبقى النص المصاحب للحقل في HTML.', bodyEn: 'Style form elements by their type or class, and do not change semantic elements into another kind for appearance. Consistent font, padding, and border rules make forms easier to understand; the text label should remain in HTML.', examples: [
        { code: 'input, select, textarea {\n  font: inherit;\n  padding: 0.6rem;\n  border: 1px solid #69757c;\n}', explanationAr: 'ترث عناصر النموذج الخط وتكتسب مساحة وحدًا واضحين.', explanationEn: 'Form controls inherit the font and receive clear spacing and borders.' },
        { code: 'button {\n  font: inherit;\n  padding: 0.65rem 1rem;\n  cursor: pointer;\n}', explanationAr: 'يحافظ الزر على الخط الموروث ويوضح قدرته على التفاعل بمؤشر مناسب.', explanationEn: 'The button inherits the font and uses an appropriate pointer cue.' },
      ] },
      { titleAr: 'حافظ على التركيز والحالات', titleEn: 'Preserve focus and states', bodyAr: 'لا تجعل الحقول متطابقة بصريًا مع الخلفية، ولا تزل مؤشر التركيز. نسّق disabled بحيث يبقى مفهومًا مع تباين مناسب، لكن لا تعتمد على اللون وحده إذا كان للحالة أثر مهم. اختبر الحقل بلوحة المفاتيح وفي المتصفح، فبعض عناصر التحكم لها مظهر أصلي مفيد.', bodyEn: 'Do not make fields visually indistinguishable from their background, and do not remove focus indicators. Style disabled controls so their state remains understandable, but do not rely on color alone when the state matters. Test controls with a keyboard and browser because native appearances can be useful.', examples: [
        { code: 'input:focus-visible {\n  outline: 3px solid #174a5b;\n  outline-offset: 2px;\n}', explanationAr: 'يبرز تركيز الحقل من دون الاعتماد على تغيير لون حد خفيف فقط.', explanationEn: 'The input focus stands out instead of relying only on a slight border-color change.' },
        { code: 'button:disabled {\n  cursor: not-allowed;\n}', explanationAr: 'يضيف إشارة للمؤشر، مع ضرورة بقاء الحالة واضحة بطرق أخرى أيضًا.', explanationEn: 'Adds a pointer cue, while the state should remain clear through other means too.' },
      ] },
    ],
    'نسّق input وselect وtextarea بخط موروث وحشوة وحد ظاهر. أضف حالة focus-visible للحقول، ثم اختبر حقلًا معطلًا وتنقلًا بلوحة المفاتيح. أبق labels والمحتوى الدلالي في HTML.',
    'Style input, select, and textarea with an inherited font, padding, and visible border. Add a focus-visible state, then test a disabled field and keyboard navigation. Keep labels and semantic content in HTML.',
    quiz('ما الذي يجب الحفاظ عليه عند تنسيق حقل إدخال؟', 'What should be preserved when styling an input?', [
      { id: 'a', ar: 'مؤشر تركيز واضح وتسميات الحقل', en: 'A visible focus indicator and field labels' }, { id: 'b', ar: 'إزالة الحدود والتركيز', en: 'Removing borders and focus' }, { id: 'c', ar: 'تحويل النص إلى صورة', en: 'Turning text into an image' }, { id: 'd', ar: 'إخفاء حالة التعطيل', en: 'Hiding the disabled state' },
    ], 'a', 'صحيح؛ سهولة التعرف على الحقل والتركيز عليه جزء من الاستخدام الآمن.', 'Correct. Being able to identify and focus a control is part of safe usability.', 'لا تجعل تنسيق النموذج يحذف الإشارات التي تساعد الزائر على فهم الحقول والتنقل بينها.', 'Do not let form styling remove cues that help visitors understand and navigate controls.', 'احتفظ بالتسميات الدلالية ومؤشر التركيز عند تطبيق الأنماط.', 'Keep semantic labels and focus indicators when applying styles.'),
  ),
  {
    id: 'css-custom-properties', existingLessonId: 'css-custom-properties', sequence: 39,
    titleAr: 'خصائص CSS المخصّصة', titleEn: 'CSS Custom Properties',
    objectiveAr: 'عرّف قيمًا قابلة لإعادة الاستخدام بصيغة --name، ثم استدعها باستخدام var() في أكثر من عنصر.',
    objectiveEn: 'Define reusable values with the --name syntax, then use them with var() on more than one element.',
    commonMistakesAr: ['نسيان بادئة الشرطتين في اسم الخاصية المخصّصة.', 'استخدام var() مع اسم متغير غير معرّف في النطاق المناسب.'],
    commonMistakesEn: ['Forgetting the two-hyphen prefix in a custom property name.', 'Using var() with a variable that is not defined in the relevant scope.'],
  },
  added('css-b-022-color-scheme', 40, 'احترام تفضيل نظام الألوان', 'Respecting the Preferred Color Scheme',
    'استجب لتفضيل النظام الفاتح أو الداكن عبر prefers-color-scheme، مع الحفاظ على تباين النص وحالة الواجهة.',
    'Respond to a light or dark system preference with prefers-color-scheme while preserving text contrast and interface states.',
    ['عكس الخلفية من دون تعديل ألوان النص والحدود.', 'افتراض أن تفضيل الوضع الداكن يجيز تباينًا ضعيفًا أو نصًا مخفيًا.'],
    ['Changing the background without adjusting text and border colors.', 'Assuming dark-mode preference allows weak contrast or hidden text.'],
    [
      { titleAr: 'استجب لتفضيل المستخدم', titleEn: 'Respond to the user preference', bodyAr: 'يمكن لاستعلام prefers-color-scheme اختيار قيم مختلفة حين يفضّل نظام المستخدم الوضع الداكن. ابدأ بقيم واضحة للوضع الافتراضي، ثم عدّل الألوان داخل الاستعلام. الاختبار يتطلب تغيير تفضيل النظام أو محاكاته في أدوات المتصفح؛ لا تفترض أن كل زائر يستخدم الوضع نفسه.', bodyEn: 'The prefers-color-scheme media query can choose different values when the user’s system prefers dark mode. Start with clear default values, then adjust colors inside the query. Testing requires changing the system preference or emulating it in browser tools; do not assume every visitor uses the same mode.', examples: [
        { code: ':root {\n  --page-bg: #ffffff;\n  --page-text: #17212b;\n}\n@media (prefers-color-scheme: dark) {\n  :root {\n    --page-bg: #17212b;\n    --page-text: #f5f7f8;\n  }\n}', explanationAr: 'تغيّر القيم الأساسية وفق تفضيل النظام، ويمكن لبقية القواعد استخدام المتغيرات.', explanationEn: 'The base values change with system preference, and other rules can use the variables.' },
        { code: 'body {\n  color: var(--page-text);\n  background-color: var(--page-bg);\n}', explanationAr: 'تستخدم الصفحة القيم التي يحددها نطاق root.', explanationEn: 'The page uses the values defined on root.' },
      ] },
      { titleAr: 'تحقق من التباين والحالات', titleEn: 'Check contrast and states', bodyAr: 'تغيير الخلفية وحده قد يجعل النص أو الروابط أو الحدود غير مرئية. راجع النص العادي وعناصر التركيز والتنبيهات في كل وضع، واحرص على وجود مؤشر واضح لا يعتمد على اللون وحده. يظل تفضيل المستخدم معيارًا للتصميم؛ لا تجبره على وضع يخالف إعداد جهازه.', bodyEn: 'Changing only the background can make text, links, or borders invisible. Review body text, focus states, and notices in each mode, and keep clear cues that do not rely only on color. The user’s preference is a design signal; do not force a mode that conflicts with their device setting.', examples: [
        { code: '@media (prefers-color-scheme: dark) {\n  a {\n    color: #9ed9ff;\n  }\n}', explanationAr: 'يُختار لون رابط مناسب للوضع الداكن، لكن ينبغي اختبار تباينه فعليًا.', explanationEn: 'A suitable dark-mode link color is selected, but its contrast should still be tested.' },
        { code: '@media (prefers-color-scheme: dark) {\n  .card {\n    border-color: #52606a;\n  }\n}', explanationAr: 'يُعدّل الحد ليظل مرئيًا على سطح البطاقة الداكن.', explanationEn: 'The border is adjusted so it remains visible against the dark card surface.' },
      ] },
    ],
    'عرّف متغيرين في :root لخلفية الصفحة ولون النص، ثم غيّرهما داخل prefers-color-scheme: dark. استخدم var() في body، واختبر التباين والروابط ومؤشر التركيز في الوضعين.',
    'Define two variables on :root for the page background and text color, then change them inside prefers-color-scheme: dark. Use var() on body and test contrast, links, and focus in both modes.',
    quiz('ما الذي يحدده prefers-color-scheme؟', 'What does prefers-color-scheme detect?', [
      { id: 'a', ar: 'تفضيل نظام المستخدم لنمط فاتح أو داكن', en: 'The user’s system preference for light or dark appearance' }, { id: 'b', ar: 'حجم صورة الصفحة', en: 'The page image size' }, { id: 'c', ar: 'اسم ملف CSS', en: 'The CSS filename' }, { id: 'd', ar: 'عدد عناصر HTML', en: 'The number of HTML elements' },
    ], 'a', 'صحيح؛ يتيح الاستعلام تنسيقًا يستجيب لتفضيل نظام الألوان.', 'Correct. The query allows styles to respond to the preferred color scheme.', 'هذا استعلام وسائط عن تفضيل العرض، وليس عن محتوى الصفحة أو حجم الصورة.', 'This media query concerns display preference, not page content or image size.', 'تحقق من النص والروابط والحدود والتركيز في الوضعين، ولا تفترض تفضيلًا واحدًا.', 'Check text, links, borders, and focus in both modes; do not assume one preference.'),
  ),
  {
    id: 'css-web-fonts-surfaces', existingLessonId: 'css-web-fonts-surfaces', sequence: 41,
    titleAr: 'الخطوط والأسطح والظلال', titleEn: 'Web Fonts, Surfaces, and Shadows',
    objectiveAr: 'أنشئ قائمة خطوط احتياطية مفهومة، وتعرّف فكرة @font-face، واستخدم ظلالًا خفيفة لتمييز السطح.',
    objectiveEn: 'Create a clear font fallback list, understand the idea behind @font-face, and use subtle shadows to distinguish a surface.',
    commonMistakesAr: ['الاعتماد على خط واحد قد لا يكون متاحًا على جهاز الزائر.', 'استخدام ظل قوي يضعف التباين أو يجعل الواجهة مزدحمة.'],
    commonMistakesEn: ['Relying on a single font that may not be available on a visitor’s device.', 'Using a strong shadow that weakens contrast or makes the interface feel crowded.'],
  },
  added('css-b-023-css-shorthand', 25, 'اختصارات المسافات والحدود', 'Spacing and Border Shorthands',
    'اقرأ واكتب الاختصارات الشائعة لـ margin وpadding وborder مع فهم ترتيب قيمها.',
    'Read and write common margin, padding, and border shorthands while understanding their value order.',
    ['الخلط بين ترتيب قيم الجهات الأربع.', 'اختصار قيم مختلفة مبكرًا بما يجعل القاعدة صعبة القراءة.'],
    ['Confusing the order of four-side values.', 'Compressing different values too early and making the rule hard to read.'],
    [
      { titleAr: 'افهم ترتيب القيم', titleEn: 'Understand the value order', bodyAr: 'في اختصار الجهات الأربع، تتبع القيم ترتيب أعلى ثم يمين ثم أسفل ثم يسار. إذا كتبت قيمتين، فالأولى للأعلى والأسفل والثانية لليمين واليسار. تساعدك هذه القواعد على تقليل التكرار، لكن اكتب التصريحات بأسطر منفصلة حين يكون ذلك أوضح للمتعلم أو للفريق.', bodyEn: 'In a four-side shorthand, values follow top, right, bottom, left order. With two values, the first applies to top and bottom, and the second to left and right. Shorthands reduce repetition, but separate declarations are clearer when that helps the learner or team.', examples: [
        { code: '.box {\n  margin: 1rem 2rem;\n}', explanationAr: 'الهامش الرأسي 1rem والأفقي 2rem.', explanationEn: 'The vertical margins are 1rem and the horizontal margins are 2rem.' },
        { code: '.panel {\n  padding: 1rem 1.5rem 2rem;\n}', explanationAr: 'مع ثلاث قيم، تكون الأولى للأعلى، والثانية لليمين واليسار، والثالثة للأسفل.', explanationEn: 'With three values, the first is top, the second is left and right, and the third is bottom.' },
      ] },
      { titleAr: 'اجعل الحدود مقروءة', titleEn: 'Keep border shorthand readable', bodyAr: 'يجمع اختصار border عرض الحد ونمطه ولونه، وغالبًا يكتب بهذا الترتيب لتسهيل القراءة. إذا احتجت تغيير جهة واحدة أو خاصية واحدة لاحقًا، فاستخدم تصريحًا منفصلًا مثل border-color بدل إعادة كتابة بقية القيم. راجع كل جزء للتأكد من صحة النمط.', bodyEn: 'The border shorthand combines width, style, and color, commonly written in that order for readability. If you later need to change one side or one property, use a separate declaration such as border-color instead of rewriting everything. Check that each part is valid.', examples: [
        { code: '.card {\n  border: 1px solid #b9c4ca;\n}', explanationAr: 'يجمع التصريح عرض الحد ونمطه ولونه في قاعدة واحدة.', explanationEn: 'The declaration combines border width, style, and color in one rule.' },
        { code: '.card {\n  border: 1px solid #b9c4ca;\n  border-radius: 0.5rem;\n}', explanationAr: 'تضيف القاعدة نصف قطر للزوايا في تصريح مستقل عن اختصار الحد.', explanationEn: 'The rule adds corner rounding in a declaration separate from the border shorthand.' },
      ] },
    ],
    'اكتب قاعدة .panel بحشوة 1rem رأسيًا و1.5rem أفقيًا، وهامش علوي وسفلي 0.5rem وهامش أفقي تلقائي، وحد 1px متصل بلون #b9c4ca. اشرح ترتيب القيم في تعليق قصير.',
    'Write a .panel rule with 1rem vertical and 1.5rem horizontal padding, 0.5rem top and bottom margins with automatic side margins, and a 1px solid #b9c4ca border. Explain the value order in a short comment.',
    quiz('ما ترتيب قيم margin عند كتابة أربع قيم؟', 'What is the order of margin values when four are written?', [
      { id: 'a', ar: 'أعلى، يمين، أسفل، يسار', en: 'Top, right, bottom, left' }, { id: 'b', ar: 'يسار، أعلى، يمين، أسفل', en: 'Left, top, right, bottom' }, { id: 'c', ar: 'أعلى، أسفل، يمين، يسار', en: 'Top, bottom, right, left' }, { id: 'd', ar: 'كل الجهات بالقيمة نفسها دائمًا', en: 'Always the same value on every side' },
    ], 'a', 'صحيح؛ ترتيب الجهات الأربع هو أعلى ثم يمين ثم أسفل ثم يسار.', 'Correct. The four-side order is top, right, bottom, then left.', 'تذكر الاختصار clockwise: يبدأ من الأعلى ثم يدور باتجاه اليمين.', 'Remember the shorthand clockwise: start at the top, then move right.', 'افهم قيم الاختصار قبل ضغط التصريحات حتى لا تختلط جهات المسافات.', 'Understand shorthand values before compressing declarations so side spacing is not confused.'),
  ),
  added('css-b-024-responsive-background-images', 30, 'خلفيات زخرفية مرنة', 'Flexible Decorative Backgrounds',
    'استخدم صورة خلفية CSS للزخرفة فقط، مع لون بديل وموضع وحجم مناسبين ومن دون وضع محتوى أساسي داخل الصورة.',
    'Use a CSS background image for decoration only, with a fallback color and suitable position and sizing, without placing essential content in the image.',
    ['استخدام صورة خلفية لمعلومة لا تظهر في بديل نصي.', 'نسيان لون الخلفية البديل أو تمديد صورة خلفية بطريقة تشوهها.'],
    ['Using a background image for information that has no text alternative.', 'Forgetting a fallback background color or stretching a background image out of shape.'],
    [
      { titleAr: 'ميّز الخلفية عن صورة المحتوى', titleEn: 'Distinguish a background from content imagery', bodyAr: 'تناسب background-image الزخارف أو المشاهد التي لا تضيف معلومة لازمة لفهم الصفحة. أما الصورة التي تحمل معنى فينبغي عادةً أن تكون عنصر img مع بديل نصي مناسب في HTML. وفّر background-color احتياطيًا، ولا تعتمد على الصورة لتوصيل تعليمات أو حالة مهمة.', bodyEn: 'background-image suits decoration or scenery that is not necessary to understand the page. An image that conveys meaning should usually be an img element with appropriate alternative text in HTML. Provide a background-color fallback, and do not rely on an image to communicate important instructions or state.', examples: [
        { code: '.hero {\n  background-color: #17324d;\n  background-image: url("garden.jpg");\n}', explanationAr: 'إذا لم تُحمّل الصورة، يبقى لون الخلفية موجودًا خلف المحتوى.', explanationEn: 'If the image does not load, the background color remains behind the content.' },
        { code: '<img src="map.png" alt="Map showing the visitor entrance">', explanationAr: 'الصورة ذات المعنى عنصر HTML، لذلك يمكن تزويدها بنص بديل.', explanationEn: 'A meaningful image is an HTML element, so it can have alternative text.' },
      ] },
      { titleAr: 'اجعل القص والتموضع مقصودين', titleEn: 'Make cropping and positioning intentional', bodyAr: 'تتحكم background-size: cover في ملء مساحة العنصر، وقد تقص أطراف الصورة. استخدم background-position لتوجيه موضع الصورة، واختبرها على أحجام مختلفة. إذا كانت الصورة مهمة لفهم المحتوى، فلا تجعل قص الخلفية الطريق الوحيد للوصول إلى معناها.', bodyEn: 'background-size: cover fills the element and may crop image edges. Use background-position to guide placement, and test at different sizes. If the image matters to understanding the content, do not make a cropped background the only way to access its meaning.', examples: [
        { code: '.hero {\n  background-size: cover;\n  background-position: center;\n}', explanationAr: 'تملأ الصورة مساحة البطل وتُحاذى من الوسط؛ قد يُقص جزء منها بحسب الأبعاد.', explanationEn: 'The image fills the hero and is centered; part may be cropped depending on dimensions.' },
        { code: '.hero {\n  background-repeat: no-repeat;\n  background-position: center top;\n}', explanationAr: 'تمنع تكرار الصورة وتحدد نقطة تموضعها أعلى الوسط.', explanationEn: 'Prevents repetition and places the image at the top center.' },
      ] },
    ],
    'نسّق .hero بصورة خلفية زخرفية مع لون بديل ثابت وbackground-size: cover وموضع مناسب. أضف نصًا أساسيًا في HTML لا داخل الصورة، واختبر المظهر عندما لا تُحمّل الصورة.',
    'Style .hero with a decorative background image, a solid fallback color, background-size: cover, and a suitable position. Put essential text in HTML, not the image, and test the appearance when the image fails to load.',
    quiz('متى تكون صورة CSS الخلفية خيارًا مناسبًا؟', 'When is a CSS background image an appropriate choice?', [
      { id: 'a', ar: 'للزخرفة التي لا تحمل معلومة أساسية وحدها', en: 'For decoration that does not carry essential information by itself' }, { id: 'b', ar: 'لكل نص مهم يجب على الزائر قراءته', en: 'For all important text visitors must read' }, { id: 'c', ar: 'بديلًا دائمًا عن عنصر img', en: 'Always as a replacement for an img element' }, { id: 'd', ar: 'لإخفاء رابط التنقل', en: 'To hide a navigation link' },
    ], 'a', 'صحيح؛ الخلفية الزخرفية لا ينبغي أن تحمل وحدها معنى أساسيًا.', 'Correct. A decorative background should not carry essential meaning on its own.', 'ضع الصور ذات المعنى ضمن المحتوى مع بديل نصي مناسب، بدل إخفاء معناها في الخلفية.', 'Put meaningful images in the content with suitable alternative text rather than hiding meaning in a background.', 'افصل الزينة عن المحتوى المعلوماتي عند اختيار طريقة إدراج الصورة.', 'Separate decoration from informational content when choosing how to include an image.'),
  ),
  added('css-b-025-fluid-type-clamp', 42, 'حجم خط مرن ضمن حدود', 'Fluid Type Within Limits',
    'استخدم clamp() لتغيير الحجم بسلاسة بين حد أدنى وحد أقصى، مع الحفاظ على قابلية قراءة النص وتكبيره.',
    'Use clamp() to scale size smoothly between minimum and maximum limits while preserving readable and zoomable text.',
    ['عكس ترتيب الحد الأدنى والقيمة المفضلة والحد الأقصى في clamp().', 'استخدام قيمة تعتمد على عرض النافذة بلا حدين، فتنتج كتابة صغيرة جدًا أو كبيرة جدًا.'],
    ['Reversing the minimum, preferred, and maximum order in clamp().', 'Using a viewport-based size without bounds, producing text that is too small or too large.'],
    [
      { titleAr: 'اقرأ بنية clamp', titleEn: 'Read the clamp structure', bodyAr: 'تأخذ clamp ثلاثة مقادير: الحد الأدنى، والقيمة المفضلة، والحد الأقصى بهذا الترتيب. قد تستخدم القيمة الوسطى وحدات مرتبطة بعرض النافذة، بينما تحمي القيمتان الطرفيتان النص من الصغر أو الكبر المفرط. ابدأ بنطاق صغير واختبره على الهاتف والشاشة الكبيرة.', bodyEn: 'clamp takes three values: minimum, preferred, and maximum, in that order. The middle value may use viewport-relative units, while the bounds prevent text from becoming excessively small or large. Start with a modest range and test on phone and wide screens.', examples: [
        { code: '.page-title {\n  font-size: clamp(1.75rem, 4vw, 3rem);\n}', explanationAr: 'يتغير العنوان مع عرض النافذة، لكنه لا يقل عن 1.75rem ولا يزيد عن 3rem.', explanationEn: 'The heading changes with viewport width but stays between 1.75rem and 3rem.' },
        { code: '.section-title {\n  font-size: clamp(1.4rem, 3vw, 2.2rem);\n}', explanationAr: 'يضع مجالًا أصغر مناسبًا لعناوين الأقسام.', explanationEn: 'Sets a smaller size range suitable for section headings.' },
      ] },
      { titleAr: 'اختبر تكبير النص والمساحة', titleEn: 'Test text zoom and available space', bodyAr: 'الحجم المرن لا يعفيك من اختبار التكبير أو النصوص الطويلة. استخدم rem للحدين لمراعاة حجم الخط الأساسي، وابتعد عن تقليص النص الأساسي لتوفير المساحة. تحقق من عدم تداخل العناوين عند تكبير الصفحة ومن بقاء معلوماتها ظاهرة.', bodyEn: 'Fluid sizing does not remove the need to test zoom and long text. Use rem for bounds to respect the root text size, and do not shrink body text just to save space. Check that headings do not overlap when the page is zoomed and that all information remains visible.', examples: [
        { code: '.hero-title {\n  font-size: clamp(2rem, 5vw, 4rem);\n  line-height: 1.1;\n}', explanationAr: 'يضبط الحجم ضمن مجال، لكن يلزم فحص ارتفاع السطر مع محتوى العنوان الحقيقي.', explanationEn: 'The size is bounded, but line height still needs checking with the actual heading text.' },
        { code: '.body-copy {\n  font-size: 1rem;\n}', explanationAr: 'يبقى حجم نص المتن نسبيًا وقابلًا لتفضيلات المستخدم بدل فرض قياس صغير.', explanationEn: 'Body text remains relative and responsive to user preferences rather than being forced to a tiny size.' },
      ] },
    ],
    'استخدم clamp() لعنوان يبدأ عند 1.75rem ولا يتجاوز 3rem مع قيمة وسطية مرتبطة بعرض النافذة. اختبر العنوان مع تكبير الصفحة ونص أطول، وتأكد من عدم القص أو التداخل.',
    'Use clamp() for a heading with a minimum of 1.75rem, maximum of 3rem, and a middle value related to viewport width. Test with page zoom and a longer heading; check for clipping and overlap.',
    quiz('ما ترتيب القيم في clamp(min, preferred, max)؟', 'What is the value order in clamp(min, preferred, max)?', [
      { id: 'a', ar: 'الأدنى، المفضلة، الأعلى', en: 'Minimum, preferred, maximum' }, { id: 'b', ar: 'الأعلى، الأدنى، المفضلة', en: 'Maximum, minimum, preferred' }, { id: 'c', ar: 'المفضلة، الأعلى، الأدنى', en: 'Preferred, maximum, minimum' }, { id: 'd', ar: 'ثلاث قيم لونية', en: 'Three color values' },
    ], 'a', 'صحيح؛ تحدد clamp حدًا أدنى ثم قيمة مرشحة ثم حدًا أقصى.', 'Correct. clamp takes a minimum, then a preferred value, then a maximum.', 'تذكر البنية min ثم preferred ثم max لضمان بقاء الحجم داخل النطاق.', 'Remember min, then preferred, then max so the size stays within bounds.', 'استخدم الحدين لحماية قابلية القراءة على أحجام الشاشات المختلفة.', 'Use bounds to protect readability across screen sizes.'),
  ),
  {
    id: 'css-motion', existingLessonId: 'css-motion', sequence: 43,
    titleAr: 'الانتقالات والحركة المراعية للتفضيلات', titleEn: 'Transitions and Reduced Motion',
    objectiveAr: 'أنشئ انتقالًا قصيرًا لتغير لوني، ثم أوقفه لمن يطلب تقليل الحركة عبر استعلام وسائط مناسب.',
    objectiveEn: 'Create a short transition for a color change, then disable it for people who request reduced motion with a suitable media query.',
    commonMistakesAr: ['استخدام حركة طويلة أو مستمرة بلا حاجة.', 'تجاهل تفضيل المستخدم لتقليل الحركة.'],
    commonMistakesEn: ['Using long or continuous motion without need.', 'Ignoring the user preference for reduced motion.'],
  },
  {
    id: 'css-layout-debugging', existingLessonId: 'css-layout-debugging', sequence: 45,
    titleAr: 'تصحيح أخطاء تنسيق الصفحة', titleEn: 'Debugging CSS Layout',
    objectiveAr: 'اكتشف خطأ إملائيًا في اسم خاصية CSS، وتحقق من قائمة الخصائص والقيم بدل قبول تصريح مجهول.',
    objectiveEn: 'Find a typo in a CSS property name and check property names and values instead of accepting an unknown declaration.',
    commonMistakesAr: ['تجاهل اختلاف حرف واحد في اسم الخاصية.', 'افتراض أن كل تصريح مكتوب يظهر أثره حتى لو كانت القيمة غير صالحة.'],
    commonMistakesEn: ['Overlooking a one-letter typo in a property name.', 'Assuming every declaration takes effect even when its value is invalid.'],
  },
  added('css-b-026-data-table-styling', 44, 'تنسيق الجداول مع الحفاظ على قراءتها', 'Styling Tables Without Losing Readability',
    'نسّق حدود الجدول وتباعد خلاياه وصفوفه مع الحفاظ على البيانات الدلالية ورأس الجدول الواضح.',
    'Style table borders, cell spacing, and rows while preserving semantic data and a clear table header.',
    ['تحويل الجدول إلى صفوف بصرية تفقد ترتيب البيانات على الشاشات الصغيرة.', 'إخفاء رؤوس الأعمدة أو جعل ألوان الصفوف متقاربة جدًا.'],
    ['Turning a table into visual rows that lose data order on small screens.', 'Hiding column headers or using row colors that are too similar.'],
    [
      { titleAr: 'ابدأ ببنية HTML واضحة', titleEn: 'Start with clear HTML structure', bodyAr: 'لا تنشئ جدولًا باستخدام CSS إذا كانت البيانات غير جدولية؛ احتفظ بعناصر table وcaption وthead وtbody وth وtd المناسبة في HTML. يغيّر CSS المظهر فقط ولا يضيف دلالة مفقودة. اجعل عنوان الجدول ورؤوسه مفهومة قبل إضافة الزخارف.', bodyEn: 'Do not create a table with CSS if the information is not tabular; keep suitable table, caption, thead, tbody, th, and td elements in HTML. CSS changes appearance but does not add missing semantics. Make the table title and headers understandable before decoration.', examples: [
        { code: '<table>\n  <caption>Workshop schedule</caption>\n  <thead><tr><th scope="col">Time</th><th scope="col">Session</th></tr></thead>\n  <tbody><tr><td>09:00</td><td>Welcome</td></tr></tbody>\n</table>', explanationAr: 'يوفر HTML عنوانًا ورؤوس أعمدة وخلايا بيانات ذات دلالة.', explanationEn: 'The HTML provides a caption, column headers, and meaningful data cells.' },
        { code: 'table {\n  border-collapse: collapse;\n  width: 100%;\n}', explanationAr: 'تدمج الحدود المتجاورة وتسمح للجدول باستخدام عرض الحاوية.', explanationEn: 'Merges adjacent borders and lets the table use its container width.' },
      ] },
      { titleAr: 'اجعل الصفوف قابلة للمسح البصري', titleEn: 'Make rows easy to scan', bodyAr: 'أضف حدودًا وفجوات داخلية واضحة للخلايا، وحافظ على تباين النص. يمكن لتظليل خفيف متناوب أن يساعد في تتبع الصف، لكن لا تعتمد على اللون وحده لتفسير معنى البيانات. إذا كانت الأعمدة كثيرة، لا تحذف الرؤوس ولا تخلط ترتيب الأعمدة عشوائيًا على الهاتف.', bodyEn: 'Add clear cell borders and padding, and preserve text contrast. Subtle alternating row shading can help track a row, but do not rely on color alone to explain data meaning. If there are many columns, do not remove headers or randomly reorder columns on a phone.', examples: [
        { code: 'th, td {\n  padding: 0.75rem;\n  border: 1px solid #b9c4ca;\n  text-align: start;\n}', explanationAr: 'تعطي الحشوة والحدود كل خلية مساحة وتفصلها بوضوح مع محاذاة تراعي اتجاه الكتابة.', explanationEn: 'Padding and borders give each cell space and separation, with writing-direction-aware alignment.' },
        { code: 'tbody tr:nth-child(even) {\n  background-color: #f2f6f8;\n}', explanationAr: 'يضيف تظليلًا متناوبًا، مع بقاء النص ومحتواه مفهومين من دون الاعتماد عليه.', explanationEn: 'Adds alternating shading while keeping text and meaning understandable without relying on color.' },
      ] },
    ],
    'نسّق جدول بيانات دلاليًا بعرض 100% وحدود مدمجة. أضف حشوة للخلايا وحدودًا متباينة ومحاذاة start، ثم تحقق من بقاء caption ورؤوس الأعمدة واضحة.',
    'Style a semantic data table with 100% width and collapsed borders. Add cell padding, contrasting borders, and start alignment, then confirm the caption and column headers remain clear.',
    quiz('ما الذي يضيفه CSS إلى جدول دلالي؟', 'What does CSS add to a semantic table?', [
      { id: 'a', ar: 'تنسيقًا بصريًا، لا معنى بنية الجدول المفقودة', en: 'Visual styling, not missing table semantics' }, { id: 'b', ar: 'رؤوس بيانات تلقائية دائمًا', en: 'Automatic data headers in every case' }, { id: 'c', ar: 'محتوى بيانات جديدًا', en: 'New data content' }, { id: 'd', ar: 'بديلًا عن عناصر HTML الدلالية', en: 'A replacement for semantic HTML elements' },
    ], 'a', 'صحيح؛ تُنسّق CSS الجدول لكنها لا تستبدل بنية HTML الدلالية.', 'Correct. CSS styles the table but does not replace semantic HTML structure.', 'أبق عناصر الجدول ورؤوسه الدلالية في HTML ثم أضف CSS للمظهر.', 'Keep semantic table elements and headers in HTML, then add CSS for appearance.', 'لا تجعل الألوان بديلًا عن الرؤوس والتسميات التي تشرح البيانات.', 'Do not use color as a substitute for headers and labels that explain data.'),
  ),
  added('css-b-027-devtools-inspection', 46, 'فحص CSS في أدوات المتصفح', 'Inspecting CSS in Browser Tools',
    'استخدم أدوات المطور لفحص العنصر والتصريحات المحسوبة مؤقتًا وتحديد سبب اختلاف النتيجة عن المتوقع.',
    'Use browser developer tools to inspect an element and computed declarations temporarily and find why the result differs from expectations.',
    ['تعديل CSS عشوائيًا قبل تحديد العنصر أو الخاصية المتأثرة.', 'اعتبار تغيير لوحة الأنماط في أدوات المتصفح تعديلًا دائمًا للملف.'],
    ['Changing CSS randomly before identifying the element or property involved.', 'Treating edits in the browser tools as permanent file changes.'],
    [
      { titleAr: 'افحص العنصر والقاعدة', titleEn: 'Inspect the element and rule', bodyAr: 'افتح أدوات المطور المدمجة في المتصفح واختر العنصر المتأثر. راجع لوحة الأنماط لمعرفة القواعد المطابقة وما إذا كانت بعض التصريحات مشطوبة أو غير صالحة. افحص كذلك لوحة الخصائص المحسوبة لتعرف القيمة التي انتهى بها المتصفح بعد cascade.', bodyEn: 'Open the browser’s built-in developer tools and select the affected element. Review the styles panel to see matching rules and whether declarations are crossed out or invalid. Also check computed styles to see the value the browser ended up using after the cascade.', examples: [
        { code: '.card {\n  width: 20rem;\n  padding: 1rem;\n}', explanationAr: 'عند فحص البطاقة، قارن الأبعاد المحسوبة بما تتوقعه من نموذج الصندوق.', explanationEn: 'When inspecting the card, compare computed dimensions with what you expect from the box model.' },
        { code: '.card {\n  colro: teal;\n}', explanationAr: 'قد تظهر الخاصية ذات التهجئة الخاطئة على أنها غير معروفة أو غير فعالة في الأدوات.', explanationEn: 'The misspelled property may appear unknown or ineffective in the tools.' },
      ] },
      { titleAr: 'جرّب مؤقتًا ثم عدّل الملف', titleEn: 'Experiment temporarily, then edit the file', bodyAr: 'يمكنك تبديل تصريح أو إضافة قيمة مؤقتة في لوحة الأدوات لملاحظة أثرها فورًا. هذه التغييرات غالبًا لا تُحفظ في ملف المشروع؛ بعد التحقق انسخ الحل الصحيح إلى ورقة الأنماط الفعلية واحفظها، ثم حدّث الصفحة للتأكد. غيّر تصريحًا واحدًا في كل مرة لتعرف سبب النتيجة.', bodyEn: 'You can toggle a declaration or add a temporary value in the tools panel to observe its effect immediately. Those edits usually are not saved to the project file; once verified, put the correct fix in the actual stylesheet, save it, and refresh. Change one declaration at a time so you know what caused the result.', examples: [
        { code: '/* Check spelling: color, not colro */\n.notice {\n  color: teal;\n}', explanationAr: 'يصلح الاسم في الملف الحقيقي بعد التحقق من السلوك في الأدوات.', explanationEn: 'Fix the property name in the real file after verifying behavior in the tools.' },
        { code: '@media (max-width: 40rem) {\n  .sidebar {\n    display: none;\n  }\n}', explanationAr: 'عند الفحص، تحقق من شرط الوسائط والقواعد المتطابقة بدل افتراض أن كل إخفاء مقصود.', explanationEn: 'When inspecting, check the media condition and matching rules rather than assuming every hide is intentional.' },
      ] },
    ],
    'افتح صفحة بسيطة في أدوات المطور، وافحص عنصرًا لا يظهر كما توقعت. سجّل الخاصية والقيمة المحسوبة والقاعدة التي أثرت فيها، ثم أصلح الملف الفعلي واختبر بعد التحديث.',
    'Open a simple page in developer tools and inspect an element that does not look as expected. Record the computed property, value, and contributing rule, then fix the actual file and test after refreshing.',
    quiz('هل تُحفظ التعديلات التي تكتبها مؤقتًا في لوحة الأنماط تلقائيًا في ملفك؟', 'Are temporary edits in the styles panel automatically saved to your file?', [
      { id: 'a', ar: 'لا عادةً؛ انقل التغيير الصحيح إلى الملف واحفظه', en: 'Usually no; move the verified change into the file and save it' }, { id: 'b', ar: 'نعم، في كل المتصفحات', en: 'Yes, in every browser' }, { id: 'c', ar: 'تُحفظ في HTML فقط', en: 'They are saved only in HTML' }, { id: 'd', ar: 'لا يمكن تعديل CSS في الأدوات', en: 'CSS cannot be edited in the tools' },
    ], 'a', 'صحيح؛ تعديلات الأدوات مفيدة للتجربة، لكن احفظ الحل في ملف CSS الفعلي.', 'Correct. Tool edits are useful for experiments, but save the fix in the actual CSS file.', 'عامل التغييرات في لوحة الأدوات كتجارب مؤقتة ما لم تستخدم ميزة حفظ خاصة.', 'Treat edits in the tools panel as temporary unless you use a specific save feature.', 'افحص، جرّب، ثم انقل التصحيح إلى ورقة الأنماط واحفظه.', 'Inspect, experiment, then move the fix into the stylesheet and save it.'),
  ),
  added('css-b-028-print-styles', 47, 'أنماط مناسبة للطباعة', 'Print-Friendly Styles',
    'استخدم media print لتبسيط الصفحة المطبوعة وإظهار الروابط والمحتوى الأساسي من دون إخفاء معلومات مهمة.',
    'Use media print to simplify a printed page and reveal links and essential content without hiding important information.',
    ['إخفاء المحتوى الأساسي كله عند الطباعة.', 'الإبقاء على خلفية داكنة تستهلك الحبر وتضعف وضوح النص المطبوع.'],
    ['Hiding all essential content in print.', 'Keeping a dark background that uses ink and reduces printed text clarity.'],
    [
      { titleAr: 'أنشئ قواعد للطباعة', titleEn: 'Create print-specific rules', bodyAr: 'تستهدف media print تنسيقات الطباعة، ويمكن استخدامها لإزالة الزخارف وتقليل الهوامش وتغيير لون النص إلى الأسود. اترك المحتوى الرئيسي ظاهرًا، ولا تفترض أن الطابعة ستعيد إنتاج الألوان والخلفيات كما في الشاشة.', bodyEn: 'The media print query targets print styles and can remove decoration, reduce margins, and change text to black. Keep the main content visible, and do not assume a printer will reproduce screen colors and backgrounds exactly.', examples: [
        { code: '@media print {\n  body {\n    color: #000;\n    background: #fff;\n  }\n}', explanationAr: 'يختار لونًا واضحًا وخلفية بيضاء للطباعة.', explanationEn: 'Chooses clear text and a white background for printing.' },
        { code: '@media print {\n  .site-nav, .promo-banner {\n    display: none;\n  }\n}', explanationAr: 'يمكن إخفاء الزخارف أو عناصر التكرار غير اللازمة على الورق، لا المحتوى المطلوب.', explanationEn: 'Decorative or repetitive elements may be hidden on paper, but not required content.' },
      ] },
      { titleAr: 'تحقق من المعاينة قبل الطباعة', titleEn: 'Check print preview before printing', bodyAr: 'افتح معاينة الطباعة في المتصفح للتحقق من فواصل الصفحات وظهور المعلومات. إذا كان رابط مهم مطبوعًا على هيئة عنوان فقط، يمكنك إظهار وجهته بحذر بعده؛ تجنب ذلك للروابط الطويلة أو غير الموثوقة. لا تجعل اللون وحده يحمل معنى لا يظهر عند الطباعة بالأبيض والأسود.', bodyEn: 'Open the browser print preview to check page breaks and information visibility. If an important link prints only as a label, its destination can be revealed carefully after it; avoid doing so for long or untrusted URLs. Do not use color alone to convey meaning that disappears in black-and-white printing.', examples: [
        { code: '@media print {\n  a {\n    color: #000;\n    text-decoration: underline;\n  }\n}', explanationAr: 'تحافظ هذه القاعدة على قابلية تمييز الروابط عند فقدان الألوان.', explanationEn: 'This rule keeps links distinguishable when colors are absent.' },
        { code: '@media print {\n  .content {\n    max-width: none;\n  }\n}', explanationAr: 'تسمح للمحتوى باستخدام عرض الورقة بدل حد تصميم الشاشة.', explanationEn: 'Lets content use the paper width instead of a screen-layout cap.' },
      ] },
    ],
    'أضف media print تجعل النص أسود والخلفية بيضاء، وتخفي عنصرًا زخرفيًا غير ضروري فقط. افتح معاينة الطباعة وتحقق من ظهور العناوين والمحتوى والروابط الأساسية.',
    'Add a media print rule that makes text black and the background white, and hides only a nonessential decorative element. Open print preview and check that headings, content, and essential links remain visible.',
    quiz('أي محتوى يمكن إخفاؤه عادةً في نسخة الطباعة؟', 'What can usually be hidden in a printed version?', [
      { id: 'a', ar: 'زخرفة غير لازمة مع إبقاء المحتوى المهم', en: 'Nonessential decoration while keeping important content' }, { id: 'b', ar: 'كل العناوين والنصوص', en: 'All headings and text' }, { id: 'c', ar: 'التسمية الوحيدة لرابط مهم', en: 'The only label for an important link' }, { id: 'd', ar: 'كل المعلومات التي يحتاجها القارئ', en: 'All information a reader needs' },
    ], 'a', 'صحيح؛ يمكن تبسيط الزينة، لكن يجب أن يبقى المحتوى المطلوب للطباعة.', 'Correct. Decoration can be simplified, but content needed on paper should remain.', 'لا تخفِ المعلومات الأساسية في الطباعة؛ عاين الصفحة قبل اعتماد القواعد.', 'Do not hide essential information in print; preview the page before relying on the rules.', 'استخدم الطباعة لإخراج نسخة أبسط لا نسخة ناقصة من المحتوى.', 'Use print styles to make a simpler version, not an incomplete one.'),
  ),
  added('css-b-029-list-markers', 48, 'تنسيق القوائم مع الحفاظ على إشاراتها', 'Styling Lists While Keeping Their Cues',
    'حسّن المسافات وأنماط علامات القوائم من دون إزالة الإشارات التي تساعد على فهم العناصر المرتبة أو المجمعة.',
    'Improve spacing and list-marker styles without removing cues that help readers understand ordered or grouped items.',
    ['إزالة علامات القوائم من قوائم المحتوى الطويلة ثم ترك العناصر بلا فواصل واضحة.', 'استخدام list-style غير مناسب لنوع المعلومات المرتبة.'],
    ['Removing markers from long content lists and leaving items without clear separation.', 'Using a list-style that does not suit ordered information.'],
    [
      { titleAr: 'حافظ على معنى الترتيب', titleEn: 'Preserve the meaning of order', bodyAr: 'تحمل القائمة المرتبة ترتيبًا، وتحمل غير المرتبة مجموعة عناصر؛ لا تغيّر هذا المعنى لمجرد شكل العلامة. يمكن تعديل المسافة داخل القائمة وموقع العلامة، مع إبقاء تمييز كافٍ بين العناصر. إذا كان الترتيب ضروريًا، فاحتفظ بدلالة ol في HTML.', bodyEn: 'An ordered list communicates sequence, while an unordered list communicates a group; do not change that meaning just for marker appearance. You can adjust list spacing and marker position while keeping items distinct. If order matters, keep the ol semantics in HTML.', examples: [
        { code: '.steps {\n  padding-inline-start: 1.5rem;\n  line-height: 1.7;\n}', explanationAr: 'تحافظ الحشوة المنطقية على مساحة العلامة وفق اتجاه الكتابة وتحسن فصل السطور.', explanationEn: 'Logical padding preserves marker space for the writing direction and improves line spacing.' },
        { code: '.features {\n  list-style-type: square;\n}', explanationAr: 'تغير نوع علامة القائمة غير المرتبة من دون حذف العلامة.', explanationEn: 'Changes the marker type for an unordered list without removing it.' },
      ] },
      { titleAr: 'ميّز بين علامة المحتوى والزينة', titleEn: 'Distinguish content markers from decoration', bodyAr: 'قد يناسب list-style: none قائمة تنقل حُوّلت عناصرها إلى أزرار أو روابط واضحة، لكنه قد يضعف قائمة طويلة من النصوص إذا اختفت علامات التعداد كلها. افحص تباعد العناصر وتسلسلها بلوحة المفاتيح، ولا تضف رموزًا مهمة عبر CSS وحدها.', bodyEn: 'list-style: none may suit a navigation list whose items are presented as clear links, but it can weaken a long text list if all bullets disappear. Check item separation and keyboard order, and do not add important symbols through CSS alone.', examples: [
        { code: '.nav-list {\n  list-style: none;\n  padding: 0;\n  display: flex;\n  gap: 1rem;\n}', explanationAr: 'يمكن حذف العلامة في قائمة روابط عندما تظل الروابط والمسافات واضحة.', explanationEn: 'Markers can be removed for a link list when links and spacing remain clear.' },
        { code: '.reading-list li {\n  margin-block: 0.5rem;\n}', explanationAr: 'يحافظ التباعد بين عناصر قائمة القراءة على وضوح حدودها.', explanationEn: 'Spacing between reading-list items keeps their boundaries clear.' },
      ] },
    ],
    'نسّق قائمة ol للخطوات بحيث تبقى مرقمة، وحسّن مسافتها الرأسية. نسّق قائمة روابط تنقل بلا علامات تعداد مع إبقاء الروابط متمايزة ومسافاتها واضحة.',
    'Style an ol of steps so it remains numbered and has improved vertical spacing. Style a navigation link list without bullets while keeping links distinct and spacing clear.',
    quiz('ما الذي ينبغي الحفاظ عليه عند تنسيق قائمة مرتبة؟', 'What should be preserved when styling an ordered list?', [
      { id: 'a', ar: 'دلالة الترتيب وعلامة واضحة تميز العناصر', en: 'The ordered meaning and a clear cue distinguishing items' }, { id: 'b', ar: 'إخفاء كل علامات العناصر دائمًا', en: 'Always hiding every item marker' }, { id: 'c', ar: 'تحويل العناصر إلى صورة', en: 'Turning items into an image' }, { id: 'd', ar: 'استبدال محتوى القائمة بلون', en: 'Replacing list content with a color' },
    ], 'a', 'صحيح؛ تساعد الدلالة والعلامات القارئ على فهم تسلسل الخطوات.', 'Correct. Semantics and markers help readers understand the step sequence.', 'لا تجعل التنسيق يمحو إشارة الترتيب أو يضعف تمييز العناصر.', 'Do not let styling erase the sequence cue or make items hard to distinguish.', 'اجعل الشكل يدعم نوع القائمة بدل أن يناقض معناها.', 'Let styling support the kind of list instead of contradicting its meaning.'),
  ),
  added('css-b-030-checked-controls', 49, 'حالة الاختيار في عناصر التحكم', 'Checked States on Controls',
    'نسّق حالة checked في مربعات الاختيار والأزرار الراديوية مع الحفاظ على وضوح العلامة والحالة للمستخدم.',
    'Style the checked state of checkboxes and radio buttons while keeping the state and indicator clear to users.',
    ['إخفاء علامة الاختيار الأصلية من دون توفير بديل مرئي.', 'الاعتماد على لون الخلفية وحده لإظهار حالة الاختيار.'],
    ['Hiding the native checked indicator without providing a visible replacement.', 'Relying only on background color to show the checked state.'],
    [
      { titleAr: 'استهدف حالة checked', titleEn: 'Target the checked state', bodyAr: 'يختار المحدد :checked مربعات الاختيار أو الأزرار الراديوية المختارة. يمكن استخدامه لتغيير علامة أو تسليط ضوء على تسمية مرتبطة عبر بنية HTML مناسبة. لا تخفِ عنصر التحكم الأصلي إلا إذا وفرت بديلًا واضحًا وقابلًا للتركيز، وهو أمر يتطلب عناية إضافية.', bodyEn: 'The :checked pseudo-class selects checked checkboxes or radio buttons. It can change a cue or highlight an associated label through suitable HTML structure. Do not hide the native control unless you provide a clear, focusable alternative, which requires extra care.', examples: [
        { code: 'input[type="checkbox"]:checked {\n  accent-color: #174a5b;\n}', explanationAr: 'تغير accent-color لون علامة الاختيار الأصلية في المتصفحات الداعمة.', explanationEn: 'accent-color changes the native check indicator color in supporting browsers.' },
        { code: 'input[type="radio"]:checked {\n  accent-color: #174a5b;\n}', explanationAr: 'تطبق اللون نفسه على خيار الراديو المحدد مع بقاء مظهر التحكم المعروف.', explanationEn: 'Applies the same accent to the selected radio while preserving the familiar control.' },
      ] },
      { titleAr: 'اربط الحالة بإشارة غير لونية', titleEn: 'Pair the state with a non-color cue', bodyAr: 'اختبر أن حالة الاختيار واضحة عند استخدام لوحة المفاتيح وفي تباين مرتفع. لا تعتمد على لون خافت وحده لشرح الاختيار؛ حافظ على علامة عنصر التحكم الأصلية أو أضف حدًا أو نصًا مرئيًا ملائمًا. يجب أن تأتي التسمية والتجميع المنطقي من HTML.', bodyEn: 'Check that the selected state remains clear with a keyboard and in high contrast. Do not rely on a subtle color alone to communicate selection; keep the native indicator or add a suitable border or visible text. The label and logical grouping belong in HTML.', examples: [
        { code: 'input:checked + label {\n  font-weight: 700;\n}', explanationAr: 'عندما يأتي label مباشرة بعد input في HTML، يبرز النص عند اختيار العنصر.', explanationEn: 'When the label follows the input in HTML, the text is emphasized when the control is checked.' },
        { code: 'input:focus-visible {\n  outline: 3px solid #b45309;\n}', explanationAr: 'يبقى التركيز واضحًا حتى مع وجود تمييز منفصل لحالة الاختيار.', explanationEn: 'Focus remains clear alongside the separate checked-state cue.' },
      ] },
    ],
    'نسّق checkbox وradio المختارين باستخدام :checked وaccent-color. أضف تمييزًا نصيًا للتسمية المرتبطة إن كانت بنية HTML تسمح، ثم اختبر الاختيار والتركيز بلوحة المفاتيح.',
    'Style checked checkboxes and radios with :checked and accent-color. Add a text cue to an associated label if the HTML structure allows it, then test selection and keyboard focus.',
    quiz('ما الذي يختاره محدد :checked؟', 'What does the :checked selector target?', [
      { id: 'a', ar: 'مربع اختيار أو زر راديو محدد', en: 'A checked checkbox or radio button' }, { id: 'b', ar: 'كل الروابط التي زارها المستخدم', en: 'Every link the user has visited' }, { id: 'c', ar: 'العنصر الذي يقع تحت مؤشر الفأرة', en: 'The element under the pointer' }, { id: 'd', ar: 'كل عناصر العنوان h1', en: 'Every h1 heading' },
    ], 'a', 'صحيح؛ :checked يطابق حالة الاختيار في عناصر التحكم المناسبة.', 'Correct. :checked matches the selected state of applicable controls.', 'الحالة مرتبطة بمربع اختيار أو خيار راديو، وليست بحالة المؤشر.', 'The state belongs to a checkbox or radio option, not the pointer.', 'اجمع بين :checked وإشارة ظاهرة لا تعتمد على اللون وحده.', 'Pair :checked with a visible cue that does not rely on color alone.'),
  ),
  added('css-b-031-final-page-integration', 50, 'تطبيق ختامي: صفحة متجاوبة قابلة للقراءة', 'Final Practice: A Readable Responsive Page',
    'ادمج المحددات والألوان والطباعة والصناديق والتخطيط والتجاوب والوصول والتصحيح في صفحة صغيرة كاملة.',
    'Combine selectors, colors, typography, boxes, layout, responsiveness, accessibility, and debugging in one small complete page.',
    ['إضافة أنماط كثيرة من دون التأكد من كل تغيير في معاينة الصفحة.', 'إخفاء المحتوى أو مؤشرات التركيز لتحسين المظهر على حساب الاستخدام.'],
    ['Adding many styles without checking each change in the page preview.', 'Hiding content or focus indicators to improve appearance at the expense of usability.'],
    [
      { titleAr: 'خطط من البنية إلى الأنماط', titleEn: 'Plan from structure to styles', bodyAr: 'ابدأ بصفحة HTML ذات عنوان ومقدمة وبطاقات معلومات وروابط واضحة. اختر فئات تعبر عن الدور، ثم خطط للألوان والتباين والعرض المريح والمسافات. اجعل البنية مفهومة قبل الزينة، ولا تضع نصًا أو معلومة مهمة داخل صورة خلفية.', bodyEn: 'Start with an HTML page containing a heading, introduction, information cards, and clear links. Choose role-based classes, then plan color, contrast, comfortable width, and spacing. Make the structure understandable before decoration, and do not put important text or information in a background image.', examples: [
        { code: '.page-shell {\n  width: min(100% - 2rem, 72rem);\n  margin-inline: auto;\n}', explanationAr: 'ينشئ غلافًا مرنًا بحد أقصى ويترك هامشًا جانبيًا.', explanationEn: 'Creates a flexible shell with a maximum width and side breathing room.' },
        { code: '.card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));\n  gap: 1rem;\n}', explanationAr: 'يتيح للبطاقات إعادة توزيع أعمدتها بحسب المساحة المتاحة.', explanationEn: 'Lets cards reflow their columns according to available space.' },
      ] },
      { titleAr: 'تحقق من الوصول والسلوك', titleEn: 'Check accessibility and behavior', bodyAr: 'اختبر الصفحة بعرض ضيق وواسع، وبالتنقل عبر Tab، وتحقق من أن النص مقروء والصور لا تتجاوز حاوياتها. افحص حالات الروابط والتركيز وتفضيل الحركة، وتأكد من بقاء المحتوى المهم متاحًا. إذا ظهر خطأ، افحص العنصر والخاصية والقيمة في أدوات المتصفح ثم أصلح الملف المصدر.', bodyEn: 'Test the page at narrow and wide widths and navigate with Tab; check that text is readable and images stay within their containers. Inspect link and focus states and motion preferences, and ensure important content remains available. If something is wrong, inspect the element, property, and value in browser tools, then fix the source file.', examples: [
        { code: 'a:focus-visible {\n  outline: 3px solid #b45309;\n  outline-offset: 3px;\n}', explanationAr: 'يضمن تمييزًا ظاهرًا للرابط عند التنقل بلوحة المفاتيح.', explanationEn: 'Provides a visible distinction for a link during keyboard navigation.' },
        { code: 'img {\n  max-width: 100%;\n  height: auto;\n}', explanationAr: 'يحافظ على تناسب الصور داخل التصميم الضيق والواسع.', explanationEn: 'Keeps images proportional within narrow and wide layouts.' },
      ] },
    ],
    'أنشئ صفحة تعريف قصيرة تضم عنوانًا ووصفًا وثلاث بطاقات وروابط. استخدم غلافًا محدود العرض، شبكة تتكيف مع الحاوية، تباينًا واضحًا، صورًا مرنة، ومؤشر تركيز مرئيًا. اختبرها على شاشة ضيقة وواسعة وباستخدام لوحة المفاتيح، ثم اكتب قائمة بمشكلة واحدة اكتشفتها وكيف أصلحتها.',
    'Create a short information page with a heading, description, three cards, and links. Use a width-limited shell, an adaptive grid, clear contrast, responsive images, and a visible focus indicator. Test it on narrow and wide screens and with a keyboard, then note one issue you found and how you fixed it.',
    quiz('ما أفضل خطوة أخيرة قبل اعتبار صفحة CSS جاهزة؟', 'What is a good final step before considering a CSS page ready?', [
      { id: 'a', ar: 'اختبارها على أحجام مختلفة وباستخدام لوحة المفاتيح وفحص المحتوى', en: 'Test different screen sizes, keyboard use, and content' }, { id: 'b', ar: 'إزالة كل الحدود ومؤشرات التركيز', en: 'Remove all borders and focus indicators' }, { id: 'c', ar: 'اختبارها على شاشة واحدة بالفأرة فقط', en: 'Test one screen size with a mouse only' }, { id: 'd', ar: 'إخفاء كل ما يتجاوز الحاوية', en: 'Hide everything that overflows the container' },
    ], 'a', 'صحيح؛ الاختبار عبر أحجام وطرق استخدام مختلفة يكشف مشكلات لا تظهر في معاينة واحدة.', 'Correct. Testing across sizes and input methods reveals issues that one preview cannot show.', 'المظهر في حجم واحد لا يكفي؛ اختبر التكيف والتركيز وإتاحة المعلومات.', 'One viewport is not enough; test adaptation, focus, and information access.', 'اجعل التحقق متعدد الأجهزة ولوحة المفاتيح جزءًا من بناء الواجهة.', 'Make responsive and keyboard checks part of building the interface.'),
  ),
];

// Sort at runtime so the exported manifest is always ordered by its 1..50 sequence.
CSS_BEGINNER_DRAFT.sort((left, right) => left.sequence - right.sequence);

export type CSSPlacementQuestion = {
  id: string;
  promptAr: string;
  promptEn: string;
  choices: Array<{ id: string; labelAr: string; labelEn: string }>;
  correctChoiceId: string;
  feedbackAr: string;
  feedbackEn: string;
  competency: string;
};

export type CSSPlacementBand = {
  id: string;
  titleAr: string;
  titleEn: string;
  questions: [CSSPlacementQuestion, CSSPlacementQuestion];
};

// Placement advances only through contiguous bands where the learner earns 2/2;
// a later perfect band never skips an earlier band that was not mastered.
export const placementBands: CSSPlacementBand[] = [
  {
    id: 'css-placement-foundations', titleAr: 'أساسيات CSS', titleEn: 'CSS Foundations',
    questions: [
      {
        id: 'css-place-foundations-rule', promptAr: 'في القاعدة `h1 { color: navy; }`، ما المحدد؟', promptEn: 'In `h1 { color: navy; }`, what is the selector?',
        choices: [
          { id: 'a', labelAr: '`h1`', labelEn: '`h1`' }, { id: 'b', labelAr: '`color`', labelEn: '`color`' }, { id: 'c', labelAr: '`navy`', labelEn: '`navy`' }, { id: 'd', labelAr: '`{ }`', labelEn: '`{ }`' },
        ], correctChoiceId: 'a', feedbackAr: 'المحدد هو h1؛ فهو يختار العناصر التي ستتأثر بالقاعدة.', feedbackEn: 'The selector is h1; it chooses the elements affected by the rule.', competency: 'التعرف إلى أجزاء قاعدة CSS',
      },
      {
        id: 'css-place-foundations-link', promptAr: 'أي تصريح يغيّر لون النص داخل البطاقة؟', promptEn: 'Which declaration changes the text color inside a card?',
        choices: [
          { id: 'a', labelAr: '`background-color: white;`', labelEn: '`background-color: white;`' }, { id: 'b', labelAr: '`color: teal;`', labelEn: '`color: teal;`' }, { id: 'c', labelAr: '`padding: 1rem;`', labelEn: '`padding: 1rem;`' }, { id: 'd', labelAr: '`display: grid;`', labelEn: '`display: grid;`' },
        ], correctChoiceId: 'b', feedbackAr: 'تضبط color لون النص، بينما background-color تضبط لون الخلفية.', feedbackEn: 'color sets text color, while background-color sets the background.', competency: 'فهم خصائص CSS الأساسية',
      },
    ],
  },
  {
    id: 'css-placement-targeting', titleAr: 'اختيار العناصر وتنسيقها', titleEn: 'Targeting and Styling Elements',
    questions: [
      {
        id: 'css-place-target-class', promptAr: 'إذا كان HTML هو `<p class="notice">`، فأي محدد يختار الفئة؟', promptEn: 'Given `<p class="notice">`, which selector targets the class?',
        choices: [
          { id: 'a', labelAr: '`#notice`', labelEn: '`#notice`' }, { id: 'b', labelAr: '`notice`', labelEn: '`notice`' }, { id: 'c', labelAr: '`.notice`', labelEn: '`.notice`' }, { id: 'd', labelAr: '`<notice>`', labelEn: '`<notice>`' },
        ], correctChoiceId: 'c', feedbackAr: 'تستخدم الفئة النقطة في محدد CSS: .notice.', feedbackEn: 'A class uses a dot in a CSS selector: .notice.', competency: 'مطابقة محددات CSS مع HTML',
      },
      {
        id: 'css-place-target-contrast', promptAr: 'أي اختيار يساعد على قراءة نص فوق خلفية داكنة؟', promptEn: 'Which choice helps text remain readable on a dark background?',
        choices: [
          { id: 'a', labelAr: 'نص داكن وخلفية داكنة', labelEn: 'Dark text and a dark background' }, { id: 'b', labelAr: 'نص فاتح متباين وخلفية داكنة', labelEn: 'Contrasting light text and a dark background' }, { id: 'c', labelAr: 'إزالة لون النص', labelEn: 'Remove the text color' }, { id: 'd', labelAr: 'استخدام opacity على الصفحة كلها', labelEn: 'Use opacity on the whole page' },
        ], correctChoiceId: 'b', feedbackAr: 'التباين الواضح بين النص والخلفية يدعم القراءة، ولا ينبغي أن يعتمد المعنى على اللون وحده.', feedbackEn: 'Clear text-background contrast supports reading, and meaning should not depend on color alone.', competency: 'اختيار ألوان مقروءة',
      },
    ],
  },
  {
    id: 'css-placement-box-layout', titleAr: 'الصناديق والتخطيط', titleEn: 'Boxes and Layout',
    questions: [
      {
        id: 'css-place-box-padding', promptAr: 'أين تقع padding في نموذج الصندوق؟', promptEn: 'Where is padding in the box model?',
        choices: [
          { id: 'a', labelAr: 'بين المحتوى والحد', labelEn: 'Between the content and border' }, { id: 'b', labelAr: 'خارج الهامش', labelEn: 'Outside the margin' }, { id: 'c', labelAr: 'قبل عنصر HTML في المصدر', labelEn: 'Before the HTML element in source' }, { id: 'd', labelAr: 'داخل النص فقط', labelEn: 'Inside text only' },
        ], correctChoiceId: 'a', feedbackAr: 'تقع الحشوة بين المحتوى والحد؛ أما margin فتكون خارج الحد.', feedbackEn: 'Padding sits between content and border; margin is outside the border.', competency: 'فهم نموذج الصندوق',
      },
      {
        id: 'css-place-box-flex', promptAr: 'لترتيب أبناء الحاوية في صف باستخدام Flexbox، أين تضع `display: flex`؟', promptEn: 'To arrange a container’s children in a row with Flexbox, where do you set `display: flex`?',
        choices: [
          { id: 'a', labelAr: 'على كل نص داخل الأبناء', labelEn: 'On every text node in the children' }, { id: 'b', labelAr: 'على الحاوية الأب', labelEn: 'On the parent container' }, { id: 'c', labelAr: 'على عنصر غير مرتبط بالصفحة', labelEn: 'On an unrelated page element' }, { id: 'd', labelAr: 'داخل تعليق CSS', labelEn: 'Inside a CSS comment' },
        ], correctChoiceId: 'b', feedbackAr: 'تتحكم الحاوية المرنة في ترتيب أبنائها المباشرين.', feedbackEn: 'The flex container controls the arrangement of its direct children.', competency: 'تحديد حاوية التخطيط',
      },
    ],
  },
  {
    id: 'css-placement-responsive-debugging', titleAr: 'التجاوب وتصحيح التصميم', titleEn: 'Responsive Design and Debugging',
    questions: [
      {
        id: 'css-place-responsive', promptAr: 'ما التصرف الأفضل عندما تصبح بطاقات الصف أضيق من محتواها على الهاتف؟', promptEn: 'What is a good response when cards become narrower than their content on a phone?',
        choices: [
          { id: 'a', labelAr: 'اختبار تخطيط مرن يسمح بالتفاف البطاقات أو تغيير الأعمدة', labelEn: 'Test a flexible layout that wraps cards or changes columns' }, { id: 'b', labelAr: 'إخفاء النص كله', labelEn: 'Hide all text' }, { id: 'c', labelAr: 'فرض عرض ثابت أكبر من الشاشة', labelEn: 'Force a fixed width larger than the screen' }, { id: 'd', labelAr: 'إزالة الحاوية من HTML', labelEn: 'Remove the container from HTML' },
        ], correctChoiceId: 'a', feedbackAr: 'يعالج التخطيط المرن ضيق المساحة مع الحفاظ على إتاحة المحتوى.', feedbackEn: 'A flexible layout handles limited space while keeping content available.', competency: 'اختيار حل لتخطيط متجاوب',
      },
      {
        id: 'css-place-debugging', promptAr: 'خاصية CSS لا يظهر أثرها. ما أول فحص عملي؟', promptEn: 'A CSS property has no visible effect. What is a practical first check?',
        choices: [
          { id: 'a', labelAr: 'حذف جميع قواعد الصفحة', labelEn: 'Delete every page rule' }, { id: 'b', labelAr: 'فحص العنصر والاسم والقيمة والقواعد المطابقة في أدوات المتصفح', labelEn: 'Inspect the element, spelling, value, and matching rules in browser tools' }, { id: 'c', labelAr: 'إضافة !important إلى كل تصريح', labelEn: 'Add !important to every declaration' }, { id: 'd', labelAr: 'إخفاء العنصر', labelEn: 'Hide the element' },
        ], correctChoiceId: 'b', feedbackAr: 'ابدأ بفحص العنصر والتصريح والقواعد المطابقة، ثم اختبر تعديلًا محددًا بدل تكديس الحلول.', feedbackEn: 'Start by inspecting the element, declaration, and matching rules, then test a targeted fix instead of piling on overrides.', competency: 'تشخيص أخطاء CSS بطريقة منهجية',
      },
    ],
  },
];
