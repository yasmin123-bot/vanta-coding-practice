import { CSS_PATH_ID, HTML_PATH_ID, JAVASCRIPT_PATH_ID, type FoundationPathId } from './learningSystem';

export type BeginnerCapstone = {
  titleAr: string;
  titleEn: string;
  briefAr: string;
  briefEn: string;
  objectivesAr: string[];
  objectivesEn: string[];
  deliverablesAr: string[];
  deliverablesEn: string[];
  stepsAr: string[];
  stepsEn: string[];
  rubricAr: string[];
  rubricEn: string[];
};

export const BEGINNER_CAPSTONES: Record<FoundationPathId, BeginnerCapstone> = {
  [HTML_PATH_ID]: {
    titleAr: 'دليل مجتمع الحي',
    titleEn: 'Neighbourhood Community Guide',
    briefAr: 'أنشئ صفحة HTML متعددة الأقسام تساعد الزائر على اكتشاف أنشطة ومرافق مجتمعه المحلي. ركّز على بنية صحيحة ودلالية ومحتوى يمكن الوصول إليه.',
    briefEn: 'Build a multi-section HTML page that helps visitors discover local community activities and facilities. Focus on valid, semantic structure and accessible content.',
    objectivesAr: ['تطبيق عناصر HTML الدلالية والعناوين والقوائم والروابط.','إنشاء نموذج بعناوين حقول مرتبطة ووسائط ذات أوصاف مناسبة.','مراجعة بنية الصفحة والروابط وإمكانية الوصول قبل التسليم.'],
    objectivesEn: ['Apply semantic HTML, headings, lists, and links.','Create a form with associated labels and media with appropriate descriptions.','Review page structure, links, and accessibility before submission.'],
    deliverablesAr: ['ملف HTML واحد يبدأ ببنية مستند سليمة.','رأس صفحة يحتوي عنوانًا ووصفًا مناسبين.','رأس مرئي، وتنقل رئيسي، ومحتوى رئيسي يضم ثلاثة أقسام على الأقل.','قائمة نشاطين أو أكثر ورابطان داخليان صالحان.','صورة مع نص بديل، ونموذج تواصل بعناوين حقول واضحة دون إرسال بيانات حقيقية.'],
    deliverablesEn: ['One HTML file with a valid document structure.','A page title and suitable description.','A visible header, primary navigation, and main content with at least three sections.','At least two activities in a list and two valid internal links.','An image with alternative text and a contact form with labeled fields; no real data submission.'],
    stepsAr: ['ارسم قائمة الأقسام والتنقل قبل كتابة الوسوم.','ابدأ بالبنية العامة ثم أضف العناوين والمحتوى.','تحقق من ترتيب العناوين والروابط والقوائم.','راجع الأسماء والـlabels والنص البديل للنموذج والصورة.','اختبر الصفحة في العرض، وأصلح أي عنصر تفاعلي بلا اسم واضح.'],
    stepsEn: ['Outline the sections and navigation before writing tags.','Create the page structure, then add headings and content.','Check heading hierarchy, links, and lists.','Review labels and alternative text for the form and image.','Inspect the rendered page and fix any interactive element without a clear accessible name.'],
    rubricAr: ['استخدام <!doctype html> وhtml وhead وbody دون تداخل غير صالح.','استخدام header وnav وmain وsection وfooter بحسب معنى المحتوى.','وجود عنوان رئيسي واحد وتسلسل عناوين منطقي.','كل رابط واسم حقل يصف وجهته أو وظيفته.','الصورة لها نص بديل مناسب، والحقول مرتبطة بعناوينها.','كل المتطلبات موجودة ويمكن مراجعتها في الملف.'],
    rubricEn: ['Use <!doctype html>, html, head, and body without invalid nesting.','Use header, nav, main, section, and footer according to their meaning.','Include one primary heading and a logical heading hierarchy.','Every link and field name describes its destination or purpose.','The image has useful alternative text and fields are associated with labels.','All requirements are present and reviewable in the file.'],
  },
  [CSS_PATH_ID]: {
    titleAr: 'هوية صفحة مجتمع الحي',
    titleEn: 'Community Guide Visual System',
    briefAr: 'صمّم طبقة CSS متجاوبة لصفحة دليل مجتمعي موجودة. المطلوب نظام بصري متماسك، لا مجرد تلوين عناصر منفردة.',
    briefEn: 'Create a responsive CSS layer for an existing community-guide page. Build a coherent visual system rather than styling isolated elements.',
    objectivesAr: ['تنظيم الألوان والخطوط والمسافات في نظام متناسق.','استخدام Flexbox أو Grid لإنشاء تخطيط قابل للتكيف.','التحقق من التباين والتركيز والاستجابة للموبايل.'],
    objectivesEn: ['Organize colors, typography, and spacing into a coherent system.','Use Flexbox or Grid for an adaptable layout.','Check contrast, focus, and mobile responsiveness.'],
    deliverablesAr: ['ملف CSS مستقل مع قواعد عامة واضحة.','ألوان نص وخلفية ذات تباين مقروء.','نظام مسافات وخطوط وعناوين متسق.','تخطيط مرن يتكيف بين الهاتف وسطح المكتب.','حالات focus واضحة للتنقل بلوحة المفاتيح.'],
    deliverablesEn: ['A separate CSS file with clear base rules.','Readable text and background color contrast.','Consistent spacing, typography, and heading styles.','A fluid layout that adapts from phone to desktop.','Visible focus states for keyboard navigation.'],
    stepsAr: ['افحص HTML وحدد العناصر التي ستحتاج تنسيقًا.','ابدأ بقواعد الألوان والخط والمسافات كقيم موحدة.','أنشئ حاوية رئيسية ثم وزّع الأقسام باستخدام Flexbox أو Grid.','أضف نقطة تغيير واحدة على الأقل لتخطيط الهاتف.','اختبر التركيز ولوحة المفاتيح وتقليل الحركة إذا أضفت انتقالات.'],
    stepsEn: ['Inspect the HTML and identify the elements that need styling.','Start with shared color, type, and spacing values.','Create a main container and lay out sections with Flexbox or Grid.','Add at least one breakpoint for the phone layout.','Test focus and keyboard use; respect reduced motion if you add transitions.'],
    rubricAr: ['استخدام selectors مرتبطة بعناصر HTML الفعلية.','وجود تباين مقروء للنصوص والروابط.','تناسق أحجام الخطوط والمسافات بين الأقسام.','تخطيط لا يسبب تمريرًا أفقيًا عند عرض 320px.','كل عنصر تفاعلي يظهر له focus واضح.','قواعد الوسائط تغيّر التخطيط فعليًا، لا الألوان فقط.'],
    rubricEn: ['Use selectors that match the actual HTML elements.','Maintain readable contrast for text and links.','Use consistent type sizes and section spacing.','Avoid horizontal overflow at a 320px viewport.','Every interactive control has a visible focus state.','Media queries visibly adapt layout, not just color.'],
  },
  [JAVASCRIPT_PATH_ID]: {
    titleAr: 'لوحة مهام مجتمع الحي',
    titleEn: 'Community Tasks Board',
    briefAr: 'ابنِ تفاعلًا صغيرًا لإدارة مهام فعالية مجتمعية: إدخال مهمة، التحقق منها، عرضها، وتغيير حالتها بأمان.',
    briefEn: 'Build a small interaction for a community event task board: add a task, validate it, render it, and safely change its status.',
    objectivesAr: ['ربط عناصر DOM بمستمعات الأحداث المناسبة.','التحقق من المدخلات وعرض رسائل حالة مفيدة.','إنشاء عناصر آمنة باستخدام مدخلات المستخدم واختبار حالات الحافة.'],
    objectivesEn: ['Connect DOM controls to appropriate event listeners.','Validate input and display useful status messages.','Render user input safely and test edge cases.'],
    deliverablesAr: ['نموذج مهمة مع تحقق من الحقل الفارغ.','إضافة عنصر إلى قائمة ظاهرة دون إعادة تحميل الصفحة.','زر لتغيير حالة المهمة أو حذفها.','رسالة حالة واضحة للمستخدم.','تعامل آمن مع إدخال المستخدم واختبار حالتي النجاح والخطأ.'],
    deliverablesEn: ['A task form that rejects an empty field.','Add an item to a visible list without reloading the page.','A control to change task status or remove it.','A clear status message for the user.','Handle user input safely and test both success and error cases.'],
    stepsAr: ['حدد عناصر DOM التي تحتاجها واربطها بأسماء واضحة.','استمع إلى submit للنموذج وامنع إعادة التحميل.','تحقق من القيمة بعد إزالة المسافات الفارغة.','أنشئ العناصر باستخدام textContent لا بدمج HTML من مدخل المستخدم.','أضف event handler للحالة واختبر تكرار الإدخال والقيم الفارغة.'],
    stepsEn: ['Identify the DOM elements and give them clear names.','Listen for form submission and prevent a page reload.','Validate the trimmed input.','Create elements with textContent rather than injecting user input as HTML.','Add a status-change handler and test repeated and empty entries.'],
    rubricAr: ['استخدام مستمع حدث مناسب للنموذج أو الأزرار.','رفض الإدخال الفارغ برسالة مفهومة.','إظهار المهمة في DOM بعد الإدخال الصحيح.','عرض نص المستخدم عبر textContent أو واجهة آمنة مكافئة.','إمكانية تغيير الحالة أو إزالة المهمة دون أخطاء في Console.','اختبار مسار نجاح ومسارين على الأقل للفشل أو الحد الطرفي.'],
    rubricEn: ['Use an appropriate event listener for the form or controls.','Reject empty input with a useful message.','Render the task in the DOM after valid submission.','Display user text through textContent or an equivalent safe API.','Change status or remove a task without console errors.','Test one success path and at least two failure or edge paths.'],
  },
};
