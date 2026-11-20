export type GuidedProjectLocale = 'ar' | 'en';
export type StarterFileLanguage = 'html' | 'css' | 'javascript';
export type GuidedProjectId =
  | 'semantic-profile-page'
  | 'responsive-landing-page'
  | 'interactive-task-list';

export interface GuidedProjectStage {
  title: string;
  instructions: string[];
  completionCriteria: string[];
}

export interface GuidedProjectStarterFile {
  name: string;
  language: StarterFileLanguage;
  code: string;
}

export interface GuidedProject {
  id: GuidedProjectId;
  title: string;
  objective: string;
  description: string;
  prerequisites: string[];
  stages: [GuidedProjectStage, GuidedProjectStage, GuidedProjectStage, GuidedProjectStage];
  requirements: string[];
  checklist: string[];
  expectedResult: string;
  optionalImprovements: string[];
  starterFiles: GuidedProjectStarterFile[];
}

export const GUIDED_PROJECTS: Record<GuidedProjectLocale, GuidedProject[]> = {
  ar: [
    {
      id: 'semantic-profile-page',
      title: 'صفحة ملف شخصي دلالية',
      objective: 'أنشئ صفحة ملف شخصي باستخدام HTML دلالي فقط، مع محتوى واضح وتسلسل عناوين منطقي.',
      description: 'حوّل معلومات مختارة أو خيالية إلى صفحة شخصية منظمة. ركّز على معنى العناصر وترتيب القراءة؛ لا تستخدم CSS أو JavaScript في هذا المشروع.',
      prerequisites: ['أساسيات HTML والعناصر والسمات والعناوين والفقرات.', 'معرفة أولية بالروابط والقوائم والعناصر الدلالية.'],
      stages: [
        {
          title: '١. افهم هيكل المستند',
          instructions: ['افتح ملف البداية وحدد أقسام المستند ومناطق الصفحة.', 'راجع عناصر الرأس والمحتوى الرئيسي والتذييل، ثم قرر ما يناسب كل منطقة.'],
          completionCriteria: ['يحتوي الملف على هيكل HTML أساسي صالح وبيانات وصفية للترميز والعرض.', 'يمكنك شرح دور كل منطقة دلالية قبل إضافة محتواها.'],
        },
        {
          title: '٢. اكتب المقدمة',
          instructions: ['أضف داخل رأس الصفحة عنوانًا رئيسيًا واحدًا وفقرة تعريف موجزة.', 'استخدم اسمًا ومعلومات حقيقية توافق على مشاركتها أو تفاصيل خيالية.'],
          completionCriteria: ['تحتوي منطقة الرأس على عنوان رئيسي ومقدمة مكتملة بدل نص التعليمات المؤقت.', 'يصف العنوان موضوع الصفحة بوضوح.'],
        },
        {
          title: '٣. نظّم أقسام الملف',
          instructions: ['أنشئ قسمين معنويين على الأقل، مثل نبذة واهتمامات أو خبرات وأهداف.', 'استخدم عناوين فرعية متدرجة وقائمة HTML عندما تعرض مجموعة عناصر.'],
          completionCriteria: ['لكل قسم عنوان يعبّر عن محتواه.', 'تُستخدم قائمة دلالية لعرض مجموعة من عنصرين أو أكثر، ولا تُختار العناصر لمظهرها فقط.'],
        },
        {
          title: '٤. أضف التواصل وراجع الصفحة',
          instructions: ['أضف رابط تواصل وصفيًا بوجهة صالحة، ثم أضف ملاحظة مناسبة في التذييل.', 'راجع ترتيب العناوين واللغة واتجاه الكتابة والنصوص البديلة المؤقتة.'],
          completionCriteria: ['يعمل رابط التواصل ونصه مفهوم عند قراءته منفردًا.', 'يمكن فهم المحتوى وترتيبه عند فتح الصفحة دون تنسيق بصري.'],
        },
      ],
      requirements: [
        'يتضمن الملف تصريح نوع المستند وعناصر html وhead وbody وبيانات ترميز الأحرف والعرض.',
        'يحتوي المستند على مناطق header وmain وfooter، ويتضمن main قسمين معنويين على الأقل.',
        'يتضمن تسلسلًا منطقيًا للعناوين وعنوانًا رئيسيًا واحدًا على الأقل.',
        'يعرض مجموعة من المعلومات باستخدام قائمة HTML مناسبة، ويتضمن رابطًا وصفيًا بوجهة صالحة.',
        'لا يعتمد المشروع على CSS أو JavaScript لإنشاء المحتوى أو بنيته.',
      ],
      checklist: [
        '☐ يفتح ملف HTML وتظهر الأحرف العربية على نحو صحيح.',
        '☐ لكل منطقة دلالية محتوى يناسب غرضها، ولا تبقى تعليقات أو نصوص إرشادية مكان المحتوى النهائي.',
        '☐ ترتيب العناوين والقائمة والرابط واضح عند قراءة الصفحة دون تنسيق.',
        '☐ لا يتطلب المشروع معلومات شخصية حقيقية أو نشرها على الإنترنت.',
      ],
      expectedResult: 'صفحة ملف شخصي قابلة للقراءة في المتصفح، ذات هيكل دلالي واضح من المقدمة إلى الأقسام والتذييل، في ملف HTML واحد.',
      optionalImprovements: ['أضف قسمًا للمشاريع المختارة مع وصف موجز وروابط مناسبة.', 'أضف روابط داخلية تنقل إلى أقسام محددة في الصفحة.', 'راجع الصفحة باستخدام قارئ شاشة أو أدوات المطور.'],
      starterFiles: [
        {
          name: 'index.html',
          language: 'html',
          code: `<!doctype html>\n<html lang="ar" dir="rtl">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>ملفي الشخصي</title>\n  </head>\n  <body>\n    <header>\n      <!-- أضف عنوان الصفحة ومقدمة قصيرة هنا. -->\n    </header>\n    <main>\n      <!-- أنشئ أقسامًا معنوية للملف الشخصي هنا. -->\n    </main>\n    <footer>\n      <!-- أضف ملاحظة ختامية مناسبة هنا. -->\n    </footer>\n  </body>\n</html>\n`,
        },
      ],
    },
    {
      id: 'responsive-landing-page',
      title: 'صفحة هبوط متجاوبة',
      objective: 'أنشئ صفحة تعريفية ثابتة تجمع HTML الدلالي وCSS، وتتكيف مع الهاتف والشاشات الأكبر.',
      description: 'اختر موضوعًا بسيطًا مثل نادٍ للقراءة أو ورشة محلية. نظّم المعلومات والتنقل والبطاقات، ثم طوّر التنسيق تدريجيًا. هذا مشروع محلي للتدريب ولا يحتاج إلى خدمات خارجية.',
      prerequisites: ['أساسيات HTML والعناصر الدلالية والروابط الداخلية.', 'أساسيات CSS: المحددات ونموذج الصندوق والألوان والمسافات.', 'معرفة أولية بتخطيطات Flexbox أو Grid واستعلامات الوسائط.'],
      stages: [
        {
          title: '١. خطّط للمحتوى',
          instructions: ['اختر موضوع الصفحة واكتب هدفًا واضحًا ومقدمة موجزة.', 'رتّب المحتوى: تنقل، مقدمة، معلومات أو بطاقات، ثم تذييل.'],
          completionCriteria: ['لصفحة الهبوط غرض محدد وتسلسل أقسام مكتوب قبل بدء التنسيق.', 'نصوص الروابط والعناوين تصف الوجهات والمحتوى المقصود.'],
        },
        {
          title: '٢. أنشئ الهيكل الدلالي',
          instructions: ['أكمل عناصر الرأس والتنقل والمحتوى الرئيسي والأقسام والتذييل في ملف HTML.', 'أنشئ مجموعة من ثلاث بطاقات معلومات على الأقل، وأضف روابط تنقل داخلية إلى أقسام موجودة.'],
          completionCriteria: ['تصل كل وصلة تنقل داخلية إلى معرّف قسم موجود.', 'تحتوي كل بطاقة على عنوان ومعلومة موجزة، ويمكن فهم الصفحة دون CSS.'],
        },
        {
          title: '٣. أضف التنسيق البصري',
          instructions: ['استخدم ملف CSS لضبط عرض المحتوى والمسافات والخطوط والألوان.', 'اجعل المقدمة والبطاقات قابلة للتمييز، مع الحفاظ على نص مقروء وتباين مناسب.'],
          completionCriteria: ['يمكن تمييز العنوان الرئيسي والتنقل والبطاقات بوضوح.', 'لا يُستخدم اللون وحده لإيصال معنى أو لتحديد الروابط التفاعلية.'],
        },
        {
          title: '٤. اجعل الصفحة متجاوبة واختبرها',
          instructions: ['ابدأ بتخطيط مرن للعرض الضيق، ثم حسّن التخطيط عند عروض أكبر.', 'اختبر الصفحة بعرض ضيق ومتوسط وواسع، وأصلح التداخل أو التمرير الأفقي غير المقصود.'],
          completionCriteria: ['يتغير تخطيط البطاقات بوضوح عند نقطتي توقف CSS على الأقل.', 'لا يُقص المحتوى وتظل الروابط والعناصر قابلة للاستخدام على شاشة ضيقة.'],
        },
      ],
      requirements: [
        'يتضمن HTML تنقلًا بروابط داخلية وأقسامًا تحمل المعرّفات المطابقة.',
        'توجد مقدمة واضحة وثلاث بطاقات معلومات على الأقل وتذييل.',
        'تُستخدم عناصر دلالية وتسلسلات عناوين منطقية.',
        'يتضمن CSS نقطتي توقف على الأقل لتكييف التخطيط مع أحجام العرض المختلفة.',
        'يبقى النص مقروءًا، وتتكيف البطاقات والتنقل دون قص أو تمرير أفقي غير مقصود.',
      ],
      checklist: [
        '☐ تعمل روابط التنقل الداخلية وتصل إلى الأقسام المقصودة.',
        '☐ لكل بطاقة عنوان ووصف، ويظهر المحتوى بتسلسل بصري واضح.',
        '☐ يمكن قراءة النص وتمييز الروابط دون الاعتماد على اللون وحده.',
        '☐ اختُبرت الصفحة على عرض ضيق وآخر واسع، وأعيد ترتيب المحتوى دون تداخل.',
        '☐ يشير رابط CSS إلى اسم الملف الصحيح، وتطابق معرّفات الروابط الأقسام.',
      ],
      expectedResult: 'صفحة هبوط ثابتة ذات معلومات واضحة وتنقل وبطاقات، وتتكيف من الهاتف إلى الشاشات الأكبر باستخدام HTML وCSS فقط.',
      optionalImprovements: ['أضف حالة تركيز مرئية للروابط باستخدام محدد التركيز المناسب.', 'أنشئ تخطيط البطاقات باستخدام شبكة CSS مرنة.', 'أضف قواعد بسيطة لتحسين مظهر الصفحة عند الطباعة.'],
      starterFiles: [
        {
          name: 'index.html',
          language: 'html',
          code: `<!doctype html>\n<html lang="ar" dir="rtl">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>صفحة تعريفية</title>\n    <link rel="stylesheet" href="styles.css">\n  </head>\n  <body>\n    <header class="site-header">\n      <a class="site-name" href="#home">اسم الصفحة</a>\n      <nav aria-label="التنقل الرئيسي">\n        <ul>\n          <li><a href="#about">نبذة</a></li>\n          <li><a href="#details">التفاصيل</a></li>\n          <li><a href="#contact">التواصل</a></li>\n        </ul>\n      </nav>\n    </header>\n    <main id="home">\n      <section class="intro" aria-labelledby="intro-title">\n        <h1 id="intro-title">عنوان الصفحة</h1>\n        <p><!-- اكتب مقدمة موجزة عن الموضوع. --></p>\n      </section>\n      <section id="about" aria-labelledby="about-title">\n        <h2 id="about-title">نبذة</h2>\n        <p><!-- أضف معلومات أساسية عن الموضوع. --></p>\n      </section>\n      <section id="details" aria-labelledby="details-title">\n        <h2 id="details-title">تفاصيل</h2>\n        <div class="card-grid">\n          <!-- أضف ثلاث بطاقات معلومات داخل هذه المجموعة. -->\n        </div>\n      </section>\n      <section id="contact" aria-labelledby="contact-title">\n        <h2 id="contact-title">التواصل</h2>\n        <p><!-- أضف طريقة تواصل أو معلومة ختامية مناسبة. --></p>\n      </section>\n    </main>\n    <footer class="site-footer"><!-- أضف ملاحظة ختامية. --></footer>\n  </body>\n</html>\n`,
        },
        {
          name: 'styles.css',
          language: 'css',
          code: `:root {\n  --page-bg: #f4f6f8;\n  --surface: #ffffff;\n  --text: #18212f;\n  --accent: #285a7a;\n  --border: #d5dce5;\n}\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  background: var(--page-bg);\n  color: var(--text);\n  font-family: system-ui, sans-serif;\n  line-height: 1.65;\n}\n\na {\n  color: var(--accent);\n}\n\n/* أضف قواعد التخطيط والمسافات والبطاقات ونقطتي التوقف هنا. */\n`,
        },
      ],
    },
    {
      id: 'interactive-task-list',
      title: 'قائمة مهام تفاعلية',
      objective: 'أنشئ قائمة مهام محلية باستخدام HTML وCSS وJavaScript لإضافة المهام والتحقق منها وإكمالها أو حذفها.',
      description: 'ابدأ بنموذج وحالة فارغة، ثم أضف تفاعلات قائمة المهام تدريجيًا. تبقى البيانات في ذاكرة الصفحة الحالية فقط؛ لا يوجد خادم خلفي أو مصادقة أو حفظ سحابي أو ادعاء بحفظ دائم.',
      prerequisites: ['أساسيات HTML والنماذج والحقول والأزرار.', 'أساسيات CSS للتنسيق والحالات المرئية.', 'أساسيات JavaScript: المتغيرات والدوال والمصفوفات والأحداث وعناصر DOM.'],
      stages: [
        {
          title: '١. جهّز الواجهة ومسار التفاعل',
          instructions: ['افتح ملفات البداية وتأكد من ارتباط HTML بملفي CSS وJavaScript.', 'حدد عناصر النموذج ورسالة الحالة ومنطقة المهام، وارسم خطوات الإضافة والإكمال والحذف.'],
          completionCriteria: ['تظهر عناصر الواجهة الأساسية عند فتح الصفحة.', 'تستخدم العناصر تسميات ومعرّفات واضحة تتطابق مع المحددات المستخدمة في JavaScript.'],
        },
        {
          title: '٢. نفّذ الإضافة والتحقق',
          instructions: ['أضف معالج إرسال يمنع إعادة تحميل الصفحة ويزيل المسافات الزائدة من الاسم.', 'ارفض الاسم الفارغ برسالة مفهومة، وأنشئ للمدخل الصحيح كائن مهمة بحالة ابتدائية.'],
          completionCriteria: ['لا تُضاف قيمة فارغة أو مكوّنة من مسافات فقط.', 'تؤدي قيمة صالحة إلى إنشاء مهمة واحدة وإظهارها، ثم يصبح الحقل جاهزًا لإدخال جديد.'],
        },
        {
          title: '٣. اعرض القائمة بأمان',
          instructions: ['أنشئ دالة عرض تحدّث القائمة وحالة عدم وجود مهام بعد كل تغيير.', 'أنشئ عناصر DOM واستخدم نصًا عاديًا لاسم المهمة؛ لا تفسر مدخلات المستخدم على أنها HTML.'],
          completionCriteria: ['تظهر حالة فارغة عند عدم وجود مهام وتختفي عند وجودها.', 'يظهر اسم المهمة كما أدخله المستخدم كنص عادي، بما في ذلك النص الذي يشبه وسوم HTML.'],
        },
        {
          title: '٤. أضف الإكمال والحذف واختبر',
          instructions: ['أضف لكل مهمة زرًا لتغيير حالة الإكمال وزرًا لحذفها.', 'اختبر إضافة عدة مهام ولوحة المفاتيح وحذف آخر مهمة، وراجع وضوح التسميات والأزرار.'],
          completionCriteria: ['يغيّر زر الإكمال المهمة المستهدفة وحدها، ويعيد تشغيله فتحها.', 'يحذف زر الحذف المهمة المستهدفة فقط، وتتحدث حالة القائمة بعد الحذف.', 'لا توحي الواجهة بوجود مزامنة أو حفظ دائم أو خدمات خلفية.'],
        },
      ],
      requirements: [
        'تحتوي الواجهة على نموذج وحقل اسم مهمة ذي تسمية وزر إرسال ورسالة حالة.',
        'يرفض التطبيق الاسم الفارغ أو المكوّن من مسافات فقط ويعرض رسالة تحقق.',
        'تُضاف المهام الصالحة وتُعرض حالة فارغة عند عدم وجود مهام.',
        'يمكن إكمال المهمة وإعادة فتحها وحذفها مع تحديث الواجهة.',
        'يُعرض نص المستخدم باستخدام واجهات DOM الآمنة أو textContent ولا يُدرج باستخدام innerHTML.',
        'تعمل الوظائف الأساسية بلوحة المفاتيح، وتقتصر البيانات على جلسة الصفحة الحالية دون خادم أو مصادقة أو حفظ سحابي.',
      ],
      checklist: [
        '☐ تظهر حالة فارغة عند فتح الصفحة وبعد حذف كل المهام.',
        '☐ يمنع الاسم الفارغ وتظهر رسالة واضحة، ويظل النموذج صالحًا للإدخال التالي.',
        '☐ تظهر المهمة الصحيحة بعد الإضافة دون تفسير نصها بوصفه HTML.',
        '☐ يبدل زرا الإكمال والحذف حالة المهمة المقصودة فقط ويحدّثان القائمة.',
        '☐ يمكن إرسال النموذج بلوحة المفاتيح، ولكل حقل تسمية ولكل زر اسم مفهوم.',
        '☐ لا تدّعي الواجهة حفظ المهام بعد إغلاق الصفحة أو مزامنتها عبر السحابة.',
      ],
      expectedResult: 'تطبيق مهام صغير يعمل محليًا في المتصفح ويدعم الإضافة بعد التحقق والعرض الآمن والإكمال والحذف، دون أي خدمة خلفية أو حفظ دائم.',
      optionalImprovements: ['أضف عدّادًا للمهام غير المكتملة يتغير مع التحديثات.', 'أضف مرشحات لعرض كل المهام أو المكتملة أو غير المكتملة.', 'أضف أولوية اختيارية مع تسمية وعرض واضحين.', 'أضف خيار التراجع عن آخر حذف دون تخزين خارجي.'],
      starterFiles: [
        {
          name: 'index.html',
          language: 'html',
          code: `<!doctype html>\n<html lang="ar" dir="rtl">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>قائمة المهام</title>\n    <link rel="stylesheet" href="styles.css">\n    <script src="app.js" defer></script>\n  </head>\n  <body>\n    <main class="task-app">\n      <header>\n        <h1>قائمة المهام</h1>\n        <p>أضف مهمة ثم حدّث حالتها أو احذفها.</p>\n      </header>\n      <form id="task-form" novalidate>\n        <label for="task-name">اسم المهمة</label>\n        <div class="form-row">\n          <input id="task-name" name="taskName" type="text" autocomplete="off" aria-describedby="form-message">\n          <button type="submit">إضافة مهمة</button>\n        </div>\n        <p id="form-message" role="status" aria-live="polite"></p>\n      </form>\n      <section aria-labelledby="tasks-heading">\n        <h2 id="tasks-heading">مهامي</h2>\n        <p id="empty-state">لا توجد مهام بعد.</p>\n        <ul id="task-list"></ul>\n      </section>\n    </main>\n  </body>\n</html>\n`,
        },
        {
          name: 'styles.css',
          language: 'css',
          code: `:root {\n  --page-bg: #f3f5f7;\n  --surface: #ffffff;\n  --text: #18212f;\n  --accent: #285a7a;\n  --border: #d5dce5;\n}\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  padding: 1.5rem 1rem;\n  background: var(--page-bg);\n  color: var(--text);\n  font-family: system-ui, sans-serif;\n  line-height: 1.6;\n}\n\nbutton,\ninput {\n  font: inherit;\n}\n\n.task-app {\n  width: min(100%, 42rem);\n  margin-inline: auto;\n  padding: 1.5rem;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 1rem;\n}\n\n/* أضف تنسيق النموذج وعناصر المهام وحالات التركيز هنا. */\n`,
        },
        {
          name: 'app.js',
          language: 'javascript',
          code: `const taskForm = document.querySelector('#task-form');\nconst taskNameInput = document.querySelector('#task-name');\nconst taskList = document.querySelector('#task-list');\nconst emptyState = document.querySelector('#empty-state');\nconst formMessage = document.querySelector('#form-message');\n\nconst tasks = [];\n\nfunction renderTasks() {\n  // ابنِ عناصر القائمة باستخدام واجهات DOM وحدّث الحالة الفارغة.\n}\n\ntaskForm.addEventListener('submit', (event) => {\n  event.preventDefault();\n  const name = taskNameInput.value.trim();\n\n  if (!name) {\n    formMessage.textContent = 'اكتب اسم المهمة أولًا.';\n    taskNameInput.focus();\n    return;\n  }\n\n  // أنشئ المهمة وأضفها إلى المصفوفة، ثم امسح الحقل وأعد العرض.\n});\n\n// أضف معالجات الإكمال والحذف داخل عناصر القائمة التي تنشئها.\n`,
        },
      ],
    },
  ],
  en: [
    {
      id: 'semantic-profile-page',
      title: 'Semantic Profile Page',
      objective: 'Create a profile page using semantic HTML only, with clear content and a logical heading order.',
      description: 'Turn selected or fictional information into an organized profile page. Focus on element meaning and reading order; do not use CSS or JavaScript in this project.',
      prerequisites: ['HTML fundamentals: elements, attributes, headings, and paragraphs.', 'Basic familiarity with links, lists, and semantic elements.'],
      stages: [
        {
          title: '1. Understand the document structure',
          instructions: ['Open the starter file and identify the document structure and page regions.', 'Review the header, main content, and footer, then decide what belongs in each region.'],
          completionCriteria: ['The file has a valid basic HTML structure and character-encoding and viewport metadata.', 'You can explain the purpose of each semantic region before adding content.'],
        },
        {
          title: '2. Write the introduction',
          instructions: ['Add one main heading and a brief introduction inside the page header.', 'Use a name and information you are comfortable sharing, or fictional details.'],
          completionCriteria: ['The header contains a main heading and a complete introduction instead of instructional placeholder text.', 'The heading clearly describes the page topic.'],
        },
        {
          title: '3. Organize the profile sections',
          instructions: ['Create at least two meaningful sections, such as About and Interests or Experience and Goals.', 'Use properly nested subheadings and an HTML list when presenting a group of items.'],
          completionCriteria: ['Each section has a heading that describes its content.', 'A semantic list presents a group of two or more items; elements are chosen for meaning, not appearance.'],
        },
        {
          title: '4. Add contact information and review',
          instructions: ['Add a descriptive contact link with a valid destination, then add a suitable footer note.', 'Review heading order, document language, text direction, and any remaining instructional placeholders.'],
          completionCriteria: ['The contact link works and its text makes sense when read on its own.', 'The content and reading order are understandable when the page is opened without visual styling.'],
        },
      ],
      requirements: [
        'The file includes a doctype declaration and html, head, and body elements, plus character-encoding and viewport metadata.',
        'The document contains header, main, and footer regions, with at least two meaningful sections inside main.',
        'The page has a logical heading sequence and at least one main heading.',
        'A suitable HTML list presents a group of information, and a descriptive link has a valid destination.',
        'The project does not rely on CSS or JavaScript to create its content or structure.',
      ],
      checklist: [
        '☐ The HTML file opens and its text displays correctly.',
        '☐ Every semantic region contains suitable content, with no instructional comments or prompts left in place of finished content.',
        '☐ Heading order, the list, and the link are clear when the page is read without styling.',
        '☐ The project does not require real personal information or publishing it online.',
      ],
      expectedResult: 'A browser-readable profile page with a clear semantic structure from introduction to sections and footer, contained in one HTML file.',
      optionalImprovements: ['Add a Selected Projects section with brief descriptions and suitable links.', 'Add in-page links that take readers to specific sections.', 'Review the page with a screen reader or browser developer tools.'],
      starterFiles: [
        {
          name: 'index.html',
          language: 'html',
          code: `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>My Profile</title>\n  </head>\n  <body>\n    <header>\n      <!-- Add the page heading and a short introduction here. -->\n    </header>\n    <main>\n      <!-- Create meaningful profile sections here. -->\n    </main>\n    <footer>\n      <!-- Add a suitable closing note here. -->\n    </footer>\n  </body>\n</html>\n`,
        },
      ],
    },
    {
      id: 'responsive-landing-page',
      title: 'Responsive Landing Page',
      objective: 'Create a static introduction page with semantic HTML and CSS that adapts to phones and larger screens.',
      description: 'Choose a simple topic, such as a reading club or local workshop. Organize its information, navigation, and cards, then build the styling gradually. This is a local practice project and needs no external services.',
      prerequisites: ['HTML fundamentals, semantic elements, and in-page links.', 'CSS fundamentals: selectors, the box model, colors, and spacing.', 'Basic familiarity with Flexbox or Grid layouts and media queries.'],
      stages: [
        {
          title: '1. Plan the content',
          instructions: ['Choose a page topic and write a clear purpose and concise introduction.', 'Plan the content order: navigation, introduction, information or cards, then footer.'],
          completionCriteria: ['The landing page has a defined purpose and a section order before styling begins.', 'Link and heading text describes its intended destination or content.'],
        },
        {
          title: '2. Build the semantic structure',
          instructions: ['Complete the header, navigation, main content, sections, and footer in the HTML file.', 'Create a group of at least three information cards and add in-page navigation links to existing sections.'],
          completionCriteria: ['Every in-page navigation link points to an existing section ID.', 'Each card has a heading and a brief detail, and the page makes sense without CSS.'],
        },
        {
          title: '3. Add visual styling',
          instructions: ['Use the CSS file to set content width, spacing, typography, and colors.', 'Make the introduction and cards easy to distinguish while keeping text readable with suitable contrast.'],
          completionCriteria: ['The main heading, navigation, and cards are visually distinguishable.', 'Color is not the only way to communicate meaning or identify interactive links.'],
        },
        {
          title: '4. Make the page responsive and test it',
          instructions: ['Start with a flexible narrow-screen layout, then improve it at wider viewport sizes.', 'Test narrow, medium, and wide viewports, fixing overlap or unintended horizontal scrolling.'],
          completionCriteria: ['The card layout changes clearly at two or more CSS breakpoints.', 'Content is not clipped, and links and controls remain usable on a narrow screen.'],
        },
      ],
      requirements: [
        'The HTML includes in-page navigation links and sections with matching IDs.',
        'The page has a clear introduction, at least three information cards, and a footer.',
        'Semantic elements and logical heading sequences are used.',
        'The CSS includes at least two breakpoints to adapt the layout to different viewport widths.',
        'Text remains readable, and cards and navigation adapt without clipping or unintended horizontal scrolling.',
      ],
      checklist: [
        '☐ In-page navigation links work and reach their intended sections.',
        '☐ Every card has a heading and description, and the content has a clear visual order.',
        '☐ Text is readable and links can be identified without relying on color alone.',
        '☐ The page has been checked at narrow and wide widths, with content reflowing without overlap.',
        '☐ The stylesheet link uses the correct file name, and link IDs match section IDs.',
      ],
      expectedResult: 'A static landing page with clear information, navigation, and cards that adapts from phones to larger screens using HTML and CSS only.',
      optionalImprovements: ['Add a visible focus state for links using an appropriate focus selector.', 'Build the card layout with a flexible CSS grid.', 'Add simple rules to improve the page when printed.'],
      starterFiles: [
        {
          name: 'index.html',
          language: 'html',
          code: `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>Information Page</title>\n    <link rel="stylesheet" href="styles.css">\n  </head>\n  <body>\n    <header class="site-header">\n      <a class="site-name" href="#home">Page name</a>\n      <nav aria-label="Main navigation">\n        <ul>\n          <li><a href="#about">About</a></li>\n          <li><a href="#details">Details</a></li>\n          <li><a href="#contact">Contact</a></li>\n        </ul>\n      </nav>\n    </header>\n    <main id="home">\n      <section class="intro" aria-labelledby="intro-title">\n        <h1 id="intro-title">Page heading</h1>\n        <p><!-- Write a concise introduction to the topic. --></p>\n      </section>\n      <section id="about" aria-labelledby="about-title">\n        <h2 id="about-title">About</h2>\n        <p><!-- Add essential information about the topic. --></p>\n      </section>\n      <section id="details" aria-labelledby="details-title">\n        <h2 id="details-title">Details</h2>\n        <div class="card-grid">\n          <!-- Add three information cards inside this group. -->\n        </div>\n      </section>\n      <section id="contact" aria-labelledby="contact-title">\n        <h2 id="contact-title">Contact</h2>\n        <p><!-- Add a suitable contact method or closing detail. --></p>\n      </section>\n    </main>\n    <footer class="site-footer"><!-- Add a closing note. --></footer>\n  </body>\n</html>\n`,
        },
        {
          name: 'styles.css',
          language: 'css',
          code: `:root {\n  --page-bg: #f4f6f8;\n  --surface: #ffffff;\n  --text: #18212f;\n  --accent: #285a7a;\n  --border: #d5dce5;\n}\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  background: var(--page-bg);\n  color: var(--text);\n  font-family: system-ui, sans-serif;\n  line-height: 1.65;\n}\n\na {\n  color: var(--accent);\n}\n\n/* Add layout, spacing, card, and breakpoint rules here. */\n`,
        },
      ],
    },
    {
      id: 'interactive-task-list',
      title: 'Interactive Task List',
      objective: 'Build a local task list with HTML, CSS, and JavaScript for adding, validating, completing, and deleting tasks.',
      description: 'Start with a form and empty state, then add task-list interactions gradually. Data stays in the current page memory only; there is no backend, authentication, cloud saving, or claim of permanent storage.',
      prerequisites: ['HTML fundamentals: forms, inputs, and buttons.', 'CSS fundamentals for styling and visible states.', 'JavaScript fundamentals: variables, functions, arrays, events, and DOM elements.'],
      stages: [
        {
          title: '1. Prepare the interface and interaction flow',
          instructions: ['Open the starter files and confirm that the HTML links to the CSS and JavaScript files.', 'Identify the form, status message, and task area, then map the add, complete, and delete steps.'],
          completionCriteria: ['The core interface elements appear when the page opens.', 'Elements use clear labels and IDs that match the selectors used in JavaScript.'],
        },
        {
          title: '2. Implement adding and validation',
          instructions: ['Add a submit handler that prevents a page reload and trims whitespace from the name.', 'Reject an empty name with a clear message; create a task object with an initial state for valid input.'],
          completionCriteria: ['An empty or whitespace-only value is not added.', 'A valid value creates and displays one task, and the input is ready for another entry.'],
        },
        {
          title: '3. Render the list safely',
          instructions: ['Create a rendering function that updates the list and the no-tasks state after each change.', 'Create DOM elements and display task names as plain text; do not interpret user input as HTML.'],
          completionCriteria: ['An empty state appears when there are no tasks and disappears when tasks exist.', 'A task name is displayed as plain text, including text that resembles HTML tags.'],
        },
        {
          title: '4. Add completion and deletion, then test',
          instructions: ['Give each task a button to toggle completion and a button to delete it.', 'Test multiple additions, keyboard use, and deleting the final task; review labels and button clarity.'],
          completionCriteria: ['The completion button changes only its intended task and can reopen it.', 'The delete button removes only its intended task, and the list state updates after deletion.', 'The interface does not imply synchronization, permanent storage, or backend services.'],
        },
      ],
      requirements: [
        'The interface contains a form, a labeled task-name input, a submit button, and a status message.',
        'The app rejects empty or whitespace-only names and displays a validation message.',
        'Valid tasks are added and an empty state is shown when there are no tasks.',
        'A task can be completed, reopened, and deleted, with the interface updating after each action.',
        'User text is displayed with safe DOM APIs or textContent and is not inserted with innerHTML.',
        'Core functions work with a keyboard, and data is limited to the current page session with no backend, authentication, or cloud saving.',
      ],
      checklist: [
        '☐ An empty state appears when the page opens and after all tasks are deleted.',
        '☐ An empty name is rejected with a clear message, and the form remains ready for another entry.',
        '☐ The correct task appears after adding, without interpreting its text as HTML.',
        '☐ The completion and delete buttons affect only the intended task and refresh the list.',
        '☐ The form can be submitted with a keyboard, every input has a label, and every button has a clear name.',
        '☐ The interface does not claim to save tasks after closing the page or synchronize them to the cloud.',
      ],
      expectedResult: 'A small task app that runs locally in the browser and supports validated entry, safe rendering, completion, and deletion without a backend or permanent storage.',
      optionalImprovements: ['Add a count of incomplete tasks that changes after updates.', 'Add filters for all, completed, and incomplete tasks.', 'Add an optional priority with a clear label and display.', 'Add an undo option for the most recent deletion without external storage.'],
      starterFiles: [
        {
          name: 'index.html',
          language: 'html',
          code: `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>Task List</title>\n    <link rel="stylesheet" href="styles.css">\n    <script src="app.js" defer></script>\n  </head>\n  <body>\n    <main class="task-app">\n      <header>\n        <h1>Task List</h1>\n        <p>Add a task, then update its status or delete it.</p>\n      </header>\n      <form id="task-form" novalidate>\n        <label for="task-name">Task name</label>\n        <div class="form-row">\n          <input id="task-name" name="taskName" type="text" autocomplete="off" aria-describedby="form-message">\n          <button type="submit">Add task</button>\n        </div>\n        <p id="form-message" role="status" aria-live="polite"></p>\n      </form>\n      <section aria-labelledby="tasks-heading">\n        <h2 id="tasks-heading">My tasks</h2>\n        <p id="empty-state">There are no tasks yet.</p>\n        <ul id="task-list"></ul>\n      </section>\n    </main>\n  </body>\n</html>\n`,
        },
        {
          name: 'styles.css',
          language: 'css',
          code: `:root {\n  --page-bg: #f3f5f7;\n  --surface: #ffffff;\n  --text: #18212f;\n  --accent: #285a7a;\n  --border: #d5dce5;\n}\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  padding: 1.5rem 1rem;\n  background: var(--page-bg);\n  color: var(--text);\n  font-family: system-ui, sans-serif;\n  line-height: 1.6;\n}\n\nbutton,\ninput {\n  font: inherit;\n}\n\n.task-app {\n  width: min(100%, 42rem);\n  margin-inline: auto;\n  padding: 1.5rem;\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: 1rem;\n}\n\n/* Add form, task-item, and focus-state styling here. */\n`,
        },
        {
          name: 'app.js',
          language: 'javascript',
          code: `const taskForm = document.querySelector('#task-form');\nconst taskNameInput = document.querySelector('#task-name');\nconst taskList = document.querySelector('#task-list');\nconst emptyState = document.querySelector('#empty-state');\nconst formMessage = document.querySelector('#form-message');\n\nconst tasks = [];\n\nfunction renderTasks() {\n  // Build list items with DOM APIs and update the empty state.\n}\n\ntaskForm.addEventListener('submit', (event) => {\n  event.preventDefault();\n  const name = taskNameInput.value.trim();\n\n  if (!name) {\n    formMessage.textContent = 'Enter a task name first.';\n    taskNameInput.focus();\n    return;\n  }\n\n  // Create and add the task, clear the input, and render the updated list.\n});\n\n// Add completion and delete handlers to the list items you create.\n`,
        },
      ],
    },
  ],
};
