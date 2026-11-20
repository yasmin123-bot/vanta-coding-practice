export type JAVASCRIPTBeginnerDraftEntry = {
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

type NewQuiz = JAVASCRIPTBeginnerDraftEntry['newContent'] extends infer N
  ? N extends { quiz: infer Q } ? Q : never : never;
type LessonStep = NonNullable<JAVASCRIPTBeginnerDraftEntry['newContent']>['steps'][number];

function existing(
  id: string, sequence: number, titleAr: string, titleEn: string,
  objectiveAr: string, objectiveEn: string,
  commonMistakesAr: string[], commonMistakesEn: string[],
): JAVASCRIPTBeginnerDraftEntry {
  return { id, sequence, existingLessonId: id, titleAr, titleEn, objectiveAr, objectiveEn, commonMistakesAr, commonMistakesEn };
}

function added(
  sequence: number, slug: string, titleAr: string, titleEn: string,
  objectiveAr: string, objectiveEn: string,
  commonMistakesAr: string[], commonMistakesEn: string[],
  steps: LessonStep[], exerciseAr: string, exerciseEn: string, quiz: NewQuiz,
): JAVASCRIPTBeginnerDraftEntry {
  const id = `javascript-b-${String(sequence).padStart(3, '0')}-${slug}`;
  return { id, sequence, titleAr, titleEn, objectiveAr, objectiveEn, commonMistakesAr, commonMistakesEn,
    newContent: { steps, exerciseAr, exerciseEn, quiz } };
}

const q = (
  promptAr: string, promptEn: string,
  options: [string, string, string, string], optionsEn: [string, string, string, string], correctIndex: number,
  correctFeedbackAr: string, correctFeedbackEn: string,
  incorrectFeedbackAr: string, incorrectFeedbackEn: string,
  reviewAr: string, reviewEn: string,
): NewQuiz => ({
  promptAr, promptEn,
  choices: options.map((ar, index) => ({ id: ['a', 'b', 'c', 'd'][index], ar, en: optionsEn[index] })),
  correctChoiceId: ['a', 'b', 'c', 'd'][correctIndex],
  correctFeedbackAr, correctFeedbackEn, incorrectFeedbackAr, incorrectFeedbackEn, reviewAr, reviewEn,
});

export const JAVASCRIPT_BEGINNER_DRAFT: JAVASCRIPTBeginnerDraftEntry[] = [
  existing('js-what-is-javascript', 1, 'ما هي JavaScript؟', 'What Is JavaScript?',
    'افهم كيف تضيف JavaScript سلوكًا إلى الصفحة، وغيّر نص عنصر موجود باستخدام JavaScript.',
    'Understand how JavaScript adds behavior to a page, and change the text of an existing element with JavaScript.',
    ['لا تخلط بين دور JavaScript ودور HTML في البنية أو CSS في المظهر.', 'تأكد من أن المحدد يطابق العنصر الموجود، ولا تستبدل متغير العنصر بدل تحديث textContent.'],
    ['Do not confuse JavaScript behavior with HTML structure or CSS appearance.', 'Make sure the selector matches an existing element, and update textContent rather than replacing the element variable.']),
  added(2, 'console-debugging', 'استخدام وحدة التحكم للتجربة', 'Using the Console to Experiment',
    'استخدم أدوات المطوّر وconsole.log لفحص القيم، واختبر سطرًا صغيرًا قبل تعديل البرنامج كله.',
    'Use developer tools and console.log to inspect values, testing one small line before changing an entire program.',
    ['لا تعتبر ظهور الرسالة في وحدة التحكم دليلًا على أن واجهة الصفحة تغيّرت.', 'تجنب تسجيل كلمات المرور أو البيانات الشخصية في وحدة التحكم.'],
    ['Do not treat a console message as proof that the page interface changed.', 'Avoid logging passwords or personal data to the console.'],
    [
      { titleAr: 'افتح مساحة التجربة', titleEn: 'Open a place to experiment', bodyAr: 'تتضمن أدوات المطوّر في المتصفح وحدة تحكم JavaScript. افتحها من قائمة المطوّر، واكتب تعبيرًا قصيرًا ثم نفّذه؛ ستظهر النتيجة أو رسالة الخطأ هناك. تختلف اختصارات فتحها بين الأنظمة والمتصفحات.', bodyEn: 'A browser’s developer tools include a JavaScript console. Open it from the developer menu, enter a short expression, and run it; the result or an error appears there. Keyboard shortcuts differ by operating system and browser.', examples: [
        { code: 'console.log(3 * 4);', explanationAr: 'يعرض العدد 12 في وحدة التحكم، ولا يضيف نصًا إلى الصفحة.', explanationEn: 'Displays 12 in the console; it does not add text to the page.' },
        { code: 'const greeting = "Hello";\nconsole.log(greeting);', explanationAr: 'يفحص قيمة متغير بعد تعريفه، وهي طريقة مفيدة لتتبع تدفق بسيط.', explanationEn: 'Inspects a variable after it is declared, which is useful for tracing a simple flow.' },
      ]},
      { titleAr: 'استكشف الخطأ خطوةً خطوة', titleEn: 'Investigate errors one step at a time', bodyAr: 'اقرأ أول خطأ ظاهر، وحدد اسم الملف والسطر إن وُجدا، ثم جرّب أصغر تعديل ممكن. افحص قيمة واحدة في كل مرة، واحذف رسائل التشخيص المؤقتة قبل النشر إذا لم تعد مفيدة.', bodyEn: 'Read the first visible error and note its file and line when available, then try the smallest possible change. Inspect one value at a time, and remove temporary diagnostic messages before publishing if they are no longer useful.', examples: [
        { code: 'const count = 2;\nconsole.log("count:", count);', explanationAr: 'تضيف تسمية قصيرة إلى القيمة حتى يسهل تمييزها بين رسائل أخرى.', explanationEn: 'Adds a short label to the value so it is easier to distinguish among other messages.' },
        { code: 'console.log("before");\nconst result = 10 / 2;\nconsole.log("after:", result);', explanationAr: 'تساعدك الرسالتان على معرفة أي جزء من المسار وصل إليه التنفيذ.', explanationEn: 'The two messages help reveal which part of the flow execution reached.' },
      ]},
    ],
    'اكتب ثلاثة أسطر تعرض تسمية وقيمة درجة تجريبية، ثم غيّر الدرجة ولاحظ النتيجة. لا تسجل أي بيانات حقيقية أو حساسة، واشرح في تعليق لنفسك ما الذي تعلّمته من المخرجات.',
    'Write three lines that display a label and a sample score, then change the score and observe the result. Do not log real or sensitive data; note what the output taught you.',
    q('ما الاستخدام الأنسب لـ console.log أثناء التعلم؟', 'What is the most appropriate use of console.log while learning?', ['فحص قيمة أو مسار مؤقتًا', 'إضافة عنصر مرئي إلى الصفحة', 'حفظ كلمة مرور للمستخدم', 'إصلاح كل خطأ تلقائيًا'], ['Temporarily inspect a value or code path', 'Add a visible element to the page', 'Save a user password', 'Automatically fix every error'], 0,
      'صحيح: تساعدك وحدة التحكم على رؤية قيمة أو تتبع تنفيذ الشيفرة.', 'Correct: the console helps you inspect a value or trace code execution.',
      'ليست وحدة التحكم واجهة الصفحة ولا مخزنًا آمنًا للأسرار؛ أعد التفكير في دور أداة التشخيص.', 'The console is neither the page interface nor a safe secret store; reconsider the role of a debugging tool.',
      'استخدم التسجيل المؤقت للتشخيص، لا لعرض واجهة للمستخدم أو تخزين أسراره.', 'Use temporary logging for diagnosis, not for user-facing UI or storing secrets.')),
  added(3, 'comments-and-readable-code', 'التعليقات ووضوح الشيفرة', 'Comments and Readable Code',
    'اكتب تعليقات موجزة تشرح السبب، ونسّق الشيفرة بأسماء ومسافات تساعد قارئًا آخر على فهمها.',
    'Write concise comments that explain why, and format code with names and spacing that help another reader understand it.',
    ['لا تكرر في التعليق ما يقوله السطر بوضوح؛ اشرح الغرض أو القيد.', 'التعليق لا يعطّل الشيفرة إذا وُضع في موضع خاطئ؛ استخدم صياغة التعليقات الصحيحة.'],
    ['Do not repeat in a comment what the line already says; explain intent or a constraint.', 'A comment does not disable code if placed incorrectly; use the correct comment syntax.'],
    [
      { titleAr: 'اكتب تعليقًا يضيف سياقًا', titleEn: 'Write a comment that adds context', bodyAr: 'يُتجاهل التعليق أثناء تنفيذ JavaScript. استخدم `//` لملاحظة قصيرة في سطر، أو `/* ... */` لملاحظة تمتد على عدة أسطر. الأفضل أن يشرح التعليق لماذا اخترت الحل أو ما الافتراض الذي يعتمد عليه.', bodyEn: 'JavaScript ignores comments during execution. Use `//` for a short line note or `/* ... */` for a note spanning lines. A useful comment explains why you chose an approach or what assumption it relies on.', examples: [
        { code: '// Keep the notice visible until the user dismisses it.\nconst showNotice = true;', explanationAr: 'يشرح التعليق سبب إبقاء الإشعار ظاهرًا بدل إعادة وصف قيمة المتغير.', explanationEn: 'The comment explains why the notice stays visible rather than restating the variable value.' },
        { code: '/* Sample data only; replace it with a trusted source later. */\nconst sampleNames = ["Ava", "Noor"];', explanationAr: 'يوضح تعليق الكتلة أن البيانات تجريبية وأن لها قيدًا واضحًا.', explanationEn: 'The block comment explains that the data is a sample and states its limitation.' },
      ]},
      { titleAr: 'نسّق لتسهيل المراجعة', titleEn: 'Format for easier review', bodyAr: 'قسّم المهام إلى أسطر، واستخدم مسافات بادئة داخل الكتل، واختر أسماء تصف المعنى. التنسيق المنتظم يقلل فرص إغفال قوس أو قراءة شرط على نحو خاطئ؛ لا يحتاج ذلك إلى مكتبة أو أداة بناء.', bodyEn: 'Put separate tasks on separate lines, indent inside blocks, and choose names that describe meaning. Consistent formatting reduces the chance of missing a brace or misreading a condition; no library or build tool is needed.', examples: [
        { code: 'const subtotal = 12;\nconst tax = 2;\nconst total = subtotal + tax;', explanationAr: 'تعرض الأسطر الثلاثة خطوات الحساب بترتيب يسهل مراجعته.', explanationEn: 'The three lines show calculation steps in an order that is easy to review.' },
        { code: 'if (isReady) {\n  console.log("Ready");\n}', explanationAr: 'تكشف المسافة البادئة بوضوح أن الطباعة تتبع كتلة الشرط.', explanationEn: 'Indentation makes it clear that the log belongs to the conditional block.' },
      ]},
    ],
    'أعد تنسيق مقطع قصير من اختيارك بحيث يكون لكل خطوة سطر واضح، وأضف تعليقًا واحدًا يشرح سببًا أو افتراضًا لا يظهر من أسماء المتغيرات وحدها.',
    'Reformat a short snippet of your choice so each step has a clear line, and add one comment explaining a reason or assumption not evident from variable names alone.',
    q('أي تعليق يضيف عادةً فائدة أكبر؟', 'Which comment usually adds more value?', ['تعليق يشرح سبب قرار غير واضح', 'تعليق يكرر كل اسم في السطر', 'تعليق يخفي رسالة خطأ مهمة', 'تعليق يضع كلمة مرور في الشيفرة'], ['A comment explaining a non-obvious decision', 'A comment repeating every name in the line', 'A comment hiding an important error message', 'A comment putting a password in code'], 0,
      'صحيح: التعليق المفيد يضيف سياقًا لا تكشفه الشيفرة وحدها.', 'Correct: a useful comment adds context the code does not reveal by itself.',
      'التعليق المكرر يشيخ سريعًا، وإخفاء الأخطاء أو كتابة الأسرار ليس توثيقًا مناسبًا.', 'A redundant comment goes stale quickly, and hiding errors or writing secrets is not appropriate documentation.',
      'اجعل التعليق موجزًا ومتمحورًا حول السبب أو القيد.', 'Keep a comment concise and focused on intent or a constraint.')),
  existing('js-variables', 4, 'المتغيرات', 'Variables',
    'أنشئ أسماءً واضحة للمتغيرات، واختر const للقيمة التي لا تعيد إسنادها وlet للقيمة التي قد تغيّرها.',
    'Create clear variable names, choosing const for a value you will not reassign and let for one you may change.',
    ['استخدام const مع محاولة إعادة إسناد الاسم يسبب خطأ.', 'اختر اسمًا يصف القيمة بدل أسماء مبهمة مثل x في الشيفرة التي ستراجعها لاحقًا.'],
    ['Reassigning a const binding causes an error.', 'Choose a name that describes the value instead of a vague name like x in code you will revisit.']),
  existing('js-data-types', 5, 'القيم وأنواع البيانات', 'Values and Data Types',
    'ميّز بين النص والعدد والقيمة المنطقية في JavaScript، خصوصًا عندما يبدو النص والعدد متشابهين.',
    'Tell strings, numbers, and Boolean values apart in JavaScript, especially when text and a number look alike.',
    ['القيمة "7" نص بسبب الاقتباس، أما 7 فعدد.', 'اكتب true وfalse كقيمتين منطقيتين بلا اقتباس إذا كنت تقصد النوع المنطقي.'],
    ['"7" is a string because of the quotes, while 7 is a number.', 'Write true and false without quotes when you mean Boolean values.']),
  existing('js-operators', 6, 'المعاملات والحساب والمقارنة', 'Operators, Arithmetic, and Comparison',
    'استخدم معاملات حسابية بسيطة ومقارنة رقمية، واقرأ القيمة المنطقية الناتجة عن المقارنة.',
    'Use simple arithmetic and numeric comparison operators, and read the Boolean result of a comparison.',
    ['لا تخلط بين = للإسناد وعمليات المقارنة مثل === أو >=.', 'انتبه إلى أولوية العمليات؛ استخدم الأقواس عندما تجعل المقصود أوضح.'],
    ['Do not confuse = for assignment with comparison operators such as === or >=.', 'Watch operator precedence; use parentheses when they make intent clearer.']),
  existing('js-conditionals', 7, 'اتخاذ القرار بالشروط', 'Making Decisions with Conditions',
    'استخدم شرطًا منطقيًا مع if وelse لاختيار أحد مسارين.',
    'Use a boolean condition with if and else to choose between two branches.',
    ['يعمل مسار if عندما يكون الشرط true، لا لمجرد وجود قيمة في المتغير.', 'تحقق من اتجاه المقارنة والحد قبل توقع الفرع الذي سيعمل.'],
    ['The if branch runs when its condition is true, not merely because a variable exists.', 'Check the comparison direction and boundary before predicting the branch.']),
  added(8, 'switch-cases', 'اختيار حالة من عدة خيارات بـ switch', 'Choosing Among Cases with switch',
    'استخدم switch عندما تقارن قيمة واحدة بعدة حالات محددة، واكتب break لتجنب الانتقال غير المقصود بين الحالات.',
    'Use switch when comparing one value with several named cases, and use break to avoid accidental fall-through.',
    ['نسيان break قد يجعل التنفيذ يستمر في الحالة التالية.', 'قيمة default اختيارية لكنها نافعة لبيان التصرف عند عدم تطابق الحالات.'],
    ['Forgetting break can let execution continue into the next case.', 'The default case is optional but useful for handling unmatched values.'],
    [
      { titleAr: 'طابق قيمة واحدة مع حالات', titleEn: 'Match one value to cases', bodyAr: 'يفحص `switch` تعبيرًا واحدًا ويقارن نتيجته بكل `case`. يناسب قائمة صغيرة من القيم المنفصلة مثل رمز لغة أو حالة طلب؛ أما المقارنات ذات النطاق مثل «أكبر من» فغالبًا أوضح باستخدام if/else.', bodyEn: '`switch` evaluates one expression and compares it with each `case`. It suits a short list of distinct values such as a language code or order state; range comparisons like “greater than” are often clearer with if/else.', examples: [
        { code: 'const role = "editor";\nswitch (role) {\n  case "editor":\n    console.log("Can edit");\n    break;\n  case "reader":\n    console.log("Can read");\n    break;\n}', explanationAr: 'تطابق إحدى القيم المحددة، ثم يوقف break تنفيذ بقية الحالات.', explanationEn: 'One listed value matches, and break stops execution from continuing into later cases.' },
        { code: 'const language = "ar";\nswitch (language) {\n  case "ar": console.log("Arabic"); break;\n  case "en": console.log("English"); break;\n  default: console.log("Other");\n}', explanationAr: 'تتعامل default مع أي قيمة لا تطابق الحالتين المسميتين.', explanationEn: 'default handles any value that does not match either named case.' },
      ]},
      { titleAr: 'امنع الانتقال غير المقصود', titleEn: 'Prevent accidental fall-through', bodyAr: 'بعد تنفيذ case، يصل التنفيذ إلى التعليمات التالية ما لم توقفه، غالبًا بـ `break`. يمكن ترك break عمدًا في أنماط متقدمة، لكن في البداية أضفه لكل حالة مستقلة. لا تجعل default تخفي قيمة غير متوقعة في تطبيق مهم؛ اعرض استجابة مفهومة.', bodyEn: 'After a case runs, execution continues into following statements unless stopped, usually with `break`. Advanced patterns may intentionally omit it, but beginners should add it for independent cases. Do not let default hide an unexpected value in an important app; show an understandable response.', examples: [
        { code: 'const day = "Mon";\nswitch (day) {\n  case "Mon": console.log("Start"); break;\n  default: console.log("Check day");\n}', explanationAr: 'تمنع break أن تُنفّذ رسالة default بعد تطابق Mon.', explanationEn: 'break prevents the default message from running after Mon matches.' },
        { code: 'const mode = "quiet";\nswitch (mode) {\n  case "quiet": console.log("Muted"); break;\n  case "normal": console.log("Sound on"); break;\n  default: console.log("Unknown mode");\n}', explanationAr: 'تقدم الحالات المعروفة استجابة محددة، وتوضح الحالة الافتراضية أن القيمة غير معروفة.', explanationEn: 'Known cases get specific responses, while the default clearly identifies an unknown value.' },
      ]},
    ],
    'اكتب switch لقيمة اسمها paymentState لها حالتان "paid" و"pending" ورسالة افتراضية، مع break لكل حالة مستقلة. اختبر القيم الثلاث في وحدة التحكم.',
    'Write a switch for paymentState with "paid" and "pending" cases plus a default message, using break for each independent case. Test all three values in the console.',
    q('ما الدور المعتاد لـ break داخل case مستقلة؟', 'What is the usual role of break in an independent case?', ['إيقاف الانتقال إلى الحالات التالية', 'إعادة بدء الصفحة', 'تحويل النص إلى رقم', 'استدعاء case تلقائيًا'], ['Stop execution from falling through to later cases', 'Reload the page', 'Convert text to a number', 'Automatically call another case'], 0,
      'صحيح: break تنهي مسار الحالة الحالي في switch.', 'Correct: break ends the current case path in switch.',
      'break لا تعيد الصفحة ولا تحول القيم؛ راجع كيف ينتقل التنفيذ بعد case.', 'break does not reload the page or convert values; review what happens after a case.',
      'أضف break بين الحالات المستقلة لتفادي تنفيذ رسائل غير مقصودة.', 'Add break between independent cases to avoid unintended messages.')),
  existing('js-loops', 9, 'الحلقات والتكرار', 'Loops and Repetition',
    'استخدم حلقة for لتكرار عمل على عناصر أو أعداد ضمن مدى معلوم، وافهم بداية العداد وشرط التوقف وتحديثه.',
    'Use a for loop to repeat work over a known range, and understand its starting value, stopping condition, and update.',
    ['نسيان تحديث العداد قد ينشئ حلقة لا تنتهي.', 'الشرط index < limit لا يشمل قيمة limit نفسها.'],
    ['Forgetting to update the counter can create an endless loop.', 'The condition index < limit does not include limit itself.']),
  added(10, 'while-loops', 'التكرار ما دام الشرط صحيحًا', 'Repeating While a Condition Is True',
    'استخدم while عندما يعتمد عدد التكرارات على شرط يتغير أثناء التنفيذ، وصمّم تحديثًا يضمن إمكان التوقف.',
    'Use while when the number of repetitions depends on a condition that changes during execution, and design an update that allows it to stop.',
    ['إذا لم تتغير قيمة الشرط داخل الحلقة فقد تستمر بلا نهاية.', 'تحقق من حالة البداية؛ فقد يكون الشرط false فلا تنفذ الحلقة مطلقًا.'],
    ['If the condition never changes inside the loop, it may run forever.', 'Check the starting state; a false condition means the body may never run.'],
    [
      { titleAr: 'متى نستخدم while؟', titleEn: 'When should you use while?', bodyAr: 'تفحص حلقة `while` الشرط قبل كل دورة. استخدمها عندما لا تعرف عدد الدورات مسبقًا لكن تعرف شرط الاستمرار، مثل محاكاة عدّ تنازلي أو معالجة محاولات محدودة. إذا كان المدى معلومًا، تكون `for` غالبًا أسهل قراءة.', bodyEn: 'A `while` loop checks its condition before every iteration. Use it when you do not know the iteration count in advance but do know the continuation condition, such as a countdown or bounded attempts. If the range is known, `for` is often easier to read.', examples: [
        { code: 'let remaining = 3;\nwhile (remaining > 0) {\n  console.log(remaining);\n  remaining -= 1;\n}', explanationAr: 'تبدأ الحلقة بثلاث محاولات، وتقل القيمة في كل مرة حتى يصبح الشرط false.', explanationEn: 'The loop starts with three attempts and decreases the value until the condition becomes false.' },
        { code: 'let step = 0;\nwhile (step < 2) {\n  console.log("step", step);\n  step += 1;\n}', explanationAr: 'يُحدّث step داخل الجسم، فيتقدم البرنامج نحو شرط التوقف.', explanationEn: 'step is updated inside the body, moving the program toward its stopping condition.' },
      ]},
      { titleAr: 'برهن أن الحلقة ستتقدم', titleEn: 'Make sure the loop progresses', bodyAr: 'قبل التشغيل، حدّد: ما الذي يجعل الشرط صحيحًا أولًا؟ وأي سطر يغيّره؟ وما الحد الذي يوقفه؟ اختبر على قيمة صغيرة. لا تستخدم حلقة لا نهائية في الصفحة؛ فهي قد تجمّد التبويب.', bodyEn: 'Before running, identify what makes the condition true initially, which line changes it, and what limit ends it. Test with a small value. Do not run an endless loop on a page; it can freeze the tab.', examples: [
        { code: 'let page = 1;\nwhile (page <= 3) {\n  console.log(page);\n  page += 1;\n}', explanationAr: 'تظل الصفحة ضمن حد صغير ومعروف، وتزيد قيمة page لتصل إلى التوقف.', explanationEn: 'The page number stays within a small known limit, and page increases toward termination.' },
        { code: 'let tries = 0;\nwhile (tries < 2) {\n  console.log("Try", tries + 1);\n  tries++;\n}', explanationAr: 'تظهر محاولتان فقط لأن tries يتقدم في كل دورة.', explanationEn: 'Only two attempts appear because tries advances on each iteration.' },
      ]},
    ],
    'اكتب while تطبع الأعداد من 3 إلى 1 ثم تتوقف. حدّد سطر التحديث قبل التشغيل، واختبر الحلقة في وحدة التحكم بقيمة صغيرة.',
    'Write a while loop that logs 3 down to 1 and then stops. Identify the update line before running it, and test the loop in the console with a small value.',
    q('ما الشرط الضروري كي تتوقف while في النهاية؟', 'What is necessary for a while loop to eventually stop?', ['أن تتغير الحالة بحيث يصبح شرطها false', 'أن تحتوي على console.log فقط', 'أن تبدأ دائمًا بالعدد 10', 'أن تستخدم DOM'], ['Its state changes so its condition becomes false', 'It contains only console.log', 'It always starts at 10', 'It uses the DOM'], 0,
      'صحيح: يجب أن يصل التنفيذ إلى حالة لا يتحقق فيها الشرط.', 'Correct: execution must reach a state where the condition is false.',
      'اطبع رسالة لا يغير الشرط؛ ابحث عن تحديث يحرك الحالة نحو النهاية.', 'Logging a message does not change the condition; look for an update that moves toward the end.',
      'افحص الشرط وسطر تحديث الحالة قبل تشغيل أي حلقة.', 'Check the condition and state update before running any loop.')),
  added(11, 'break-continue', 'التحكم في مسار الحلقة', 'Controlling a Loop with break and continue',
    'استخدم break لإنهاء حلقة عند تحقق هدف، وcontinue لتجاوز الدورة الحالية فقط.',
    'Use break to end a loop when a goal is reached, and continue to skip only the current iteration.',
    ['continue لا تنهي الحلقة، بل تنتقل إلى الدورة التالية.', 'تأكد أن continue داخل الحلقة وأن التحديث لا يُتجاوز في حلقة while.'],
    ['continue does not end the loop; it moves to the next iteration.', 'Ensure continue is inside a loop and that a while-loop update is not accidentally skipped.'],
    [
      { titleAr: 'أوقف الحلقة عند العثور على المطلوب', titleEn: 'Stop after finding what you need', bodyAr: '`break` تخرج من أقرب حلقة أو switch تحيط بها. استخدمها عندما لا فائدة من مواصلة البحث، مثل العثور على عنصر مطابق في قائمة. أضف رسالة أو نتيجة واضحة بعد الحلقة إذا احتاج القارئ إلى معرفة ما حدث.', bodyEn: '`break` exits the nearest surrounding loop or switch. Use it when continuing has no value, such as after finding a matching item in a list. Add a clear message or result after the loop if the reader needs to know what happened.', examples: [
        { code: 'const codes = ["A", "B", "C"];\nfor (const code of codes) {\n  if (code === "B") {\n    console.log("Found B");\n    break;\n  }\n}', explanationAr: 'بعد تطابق B، تنتهي الحلقة بدل فحص العناصر اللاحقة.', explanationEn: 'After B matches, the loop ends instead of checking later items.' },
        { code: 'let number = 1;\nwhile (number <= 4) {\n  if (number === 3) break;\n  console.log(number);\n  number++;\n}', explanationAr: 'تنتهي while مبكرًا عند 3، بعد طباعة 1 و2.', explanationEn: 'The while loop ends early at 3, after logging 1 and 2.' },
      ]},
      { titleAr: 'تجاوز حالة واحدة', titleEn: 'Skip one case', bodyAr: '`continue` تتخطى بقية جسم الدورة الحالية وتنتقل إلى التالية. في حلقة `while`، ضع تحديث العداد قبل مسار قد يصل إلى continue أو صممه بحذر؛ وإلا قد تعيد فحص الحالة نفسها بلا نهاية.', bodyEn: '`continue` skips the rest of the current iteration and moves to the next one. In a `while` loop, put the counter update before a path that can reach continue or design it carefully; otherwise the same state may repeat forever.', examples: [
        { code: 'for (let n = 1; n <= 4; n++) {\n  if (n === 2) continue;\n  console.log(n);\n}', explanationAr: 'تتخطى طباعة 2، لكن حلقة for تستمر حتى بقية الأعداد.', explanationEn: 'It skips logging 2, but the for loop continues through the remaining numbers.' },
        { code: 'for (const name of ["Ari", "", "Maya"]) {\n  if (name === "") continue;\n  console.log(name);\n}', explanationAr: 'تتجاهل القيمة الفارغة وتتعامل مع الأسماء غير الفارغة.', explanationEn: 'It skips the empty value and handles the non-empty names.' },
      ]},
    ],
    'أنشئ حلقة تمر على [1, 2, 3, 4, 5]، وتتجاوز 3 باستخدام continue، ثم تنهي الحلقة عند 5 باستخدام break. اشرح ما الذي طُبع.',
    'Create a loop over [1, 2, 3, 4, 5], skip 3 with continue, then end at 5 with break. Explain what was logged.',
    q('ما الفرق بين break وcontinue داخل الحلقة؟', 'What is the difference between break and continue inside a loop?', ['break تنهي الحلقة وcontinue تتخطى الدورة الحالية', 'كلاهما ينهي البرنامج كله', 'continue تنهي الحلقة وbreak تتخطى دورة واحدة', 'كلاهما يزيد العداد تلقائيًا'], ['break ends the loop; continue skips the current iteration', 'Both end the entire program', 'continue ends the loop; break skips one iteration', 'Both automatically increment the counter'], 0,
      'صحيح: break تخرج، وcontinue تنتقل إلى التكرار التالي.', 'Correct: break exits, while continue moves to the next iteration.',
      'لاحظ أن continue لا تعني الخروج من الحلقة؛ أما break فلا تستأنف دورة أخرى.', 'Notice that continue does not exit the loop, while break does not start another iteration.',
      'اختر break للإنهاء وcontinue لتجاوز حالة واحدة.', 'Choose break to stop and continue to skip one case.')),
  existing('js-type-conversion', 12, 'تحويل الأنواع والمقارنة الصارمة', 'Type Conversion and Strict Comparison',
    'حوّل النص الرقمي إلى عدد صراحةً، وميّز بين المساواة الصارمة التي تقارن النوع والقيمة وبين التحويل الضمني.',
    'Explicitly convert numeric text to a number, and distinguish strict equality—which compares type and value—from implicit coercion.',
    ['لا تفترض أن النص الرقمي عدد قبل تحويله صراحةً.', 'استخدم === عندما تريد مقارنة النوع والقيمة من دون تحويل ضمني.'],
    ['Do not assume numeric text is a number before explicitly converting it.', 'Use === when you want to compare type and value without implicit coercion.']),
  added(13, 'template-literals', 'بناء النصوص باستخدام القوالب النصية', 'Building Strings with Template Literals',
    'استخدم القالب النصي لإدراج قيم داخل جملة مقروءة، وميّزه عن النص العادي وعملية الجمع.',
    'Use a template literal to insert values into a readable sentence, distinguishing it from ordinary strings and concatenation.',
    ['تحتاج القوالب النصية إلى العلامة `، لا إلى علامات الاقتباس العادية.', 'اكتب التعبير داخل ${...}؛ من دون الأقواس سيظهر كنص حرفي.'],
    ['Template literals use backticks, not ordinary quote marks.', 'Put the expression inside ${...}; without the braces it appears as literal text.'],
    [
      { titleAr: 'أدرج قيمة في النص', titleEn: 'Insert a value into text', bodyAr: 'يبدأ القالب النصي وينتهي بعلامة backtick: `` ` ``. اكتب `${expression}` داخله كي تُقيّم JavaScript التعبير وتضع نتيجته في موضعه. يناسب ذلك رسائل العرض التي تجمع كلمات وقيمًا.', bodyEn: 'A template literal begins and ends with a backtick: `` ` ``. Write `${expression}` inside it so JavaScript evaluates the expression and puts its result in place. This suits display messages combining words and values.', examples: [
        { code: 'const name = "Noor";\nconst message = `Hello, ${name}!`;\nconsole.log(message);', explanationAr: 'تتحول قيمة name إلى جزء من الرسالة المعروضة.', explanationEn: 'The value of name becomes part of the displayed message.' },
        { code: 'const price = 8;\nconst total = `Total: ${price} dollars`;', explanationAr: 'يمكن إدراج تعبير عددي داخل النص من دون تحويل يدوي منفصل.', explanationEn: 'A numeric expression can be inserted into text without a separate manual conversion.' },
      ]},
      { titleAr: 'يمكن إدراج تعبير أو سطر جديد', titleEn: 'Insert an expression or a new line', bodyAr: 'يقبل موضع `${...}` تعبيرًا صالحًا، لا اسم متغير فقط. كما تسمح علامات backtick بنص متعدد الأسطر. لا تضع بيانات غير موثوقة في قالب ثم ترسل الناتج إلى innerHTML؛ استخدم textContent لعرض نص عادي بأمان.', bodyEn: 'The `${...}` position accepts a valid expression, not only a variable name. Backticks also allow multi-line text. Do not place untrusted data in a template and send the result to innerHTML; use textContent to safely display plain text.', examples: [
        { code: 'const quantity = 3;\nconst line = `Items: ${quantity * 2}`;', explanationAr: 'يُحسب التعبير داخل ${...} أولًا، ثم تدرج نتيجته في النص.', explanationEn: 'The expression inside ${...} is evaluated first, then its result is inserted into the string.' },
        { code: 'const note = `First line\nSecond line`;\nconsole.log(note);', explanationAr: 'يتضمن النص سطرين فعليين لأن القالب النصي يمتد على أكثر من سطر.', explanationEn: 'The string contains two actual lines because a template literal can span lines.' },
      ]},
    ],
    'أنشئ رسالة تأكيد تتضمن اسمًا افتراضيًا وعدد عناصر. استخدم backticks وموضعين من ${...}، ثم اعرضها باستخدام console.log.',
    'Create a confirmation message containing a sample name and item count. Use backticks and two ${...} positions, then display it with console.log.',
    q('ما العلامة المطلوبة لبدء قالب نصي؟', 'Which delimiter starts a template literal?', ['Backtick `', 'علامة اقتباس مفردة فقط', 'قوس معقوف {', 'علامة #'], ['A backtick `', 'Only a single quote', 'A curly brace {', 'A hash #'], 0,
      'صحيح: يحيط backtick بالقالب الذي يسمح بتضمين التعبيرات.', 'Correct: backticks surround the template that can embed expressions.',
      'القوس المعقوف وحده لا ينشئ قالبًا؛ ابحث عن العلامة التي تحيط بالنص كله.', 'A curly brace alone does not create a template; look for the delimiter surrounding the whole string.',
      'بعد backtick استخدم ${...} عند إدراج قيمة محسوبة.', 'After the backtick, use ${...} to insert a computed value.')),
  existing('js-functions', 14, 'الدوال', 'Functions',
    'تعرّف كيف تعرّف دالة، وتمرّر إليها القيم، وتعيد منها نتيجة.',
    'Learn to declare a function, pass values to it, and return a result.',
    ['تعريف الدالة وحده لا يشغّلها؛ يلزم استدعاؤها.', 'استخدم return لإعادة النتيجة، ولا تخلط ذلك بمجرد console.log.'],
    ['Defining a function does not run it; it must be called.', 'Use return to give back a result; do not confuse it with merely calling console.log.']),
  added(15, 'callbacks', 'تمرير دالة كـ callback', 'Passing a Function as a Callback',
    'افهم أن callback دالة تُمرر إلى دالة أخرى كي تستدعيها في وقت أو سياق محدد.',
    'Understand that a callback is a function passed to another function to be called at a particular time or in a particular context.',
    ['تمرير runTask يختلف عن استدعاء runTask() فورًا.', 'استخدم دالة سهمية واضحة وتجنب callback متداخلة بلا حاجة.'],
    ['Passing runTask differs from calling runTask() immediately.', 'Use a clear arrow function and avoid unnecessary callback nesting.'],
    [
      { titleAr: 'الدالة قد تكون قيمةً تُمرر', titleEn: 'A function can be a value you pass', bodyAr: 'الدالة التي تُعطى لدالة أخرى لتُستدعى لاحقًا تسمى callback. تستطيع تمرير اسم الدالة من دون أقواس؛ إضافة الأقواس تنفذها الآن وتمرير نتيجتها بدلًا منها. تظهر callbacks في أحداث المتصفح وطرائق المصفوفات والعمليات غير المتزامنة.', bodyEn: 'A function given to another function to be called later is called a callback. You can pass the function name without parentheses; adding parentheses runs it now and passes its result instead. Callbacks appear in browser events, array methods, and asynchronous operations.', examples: [
        { code: 'function greet() {\n  console.log("Hello");\n}\nfunction runTask(task) {\n  task();\n}\nrunTask(greet);', explanationAr: 'تمرر greet بوصفها دالة، ثم تستدعيها runTask.', explanationEn: 'greet is passed as a function, then runTask calls it.' },
        { code: 'function repeatOnce(callback) {\n  callback();\n}\nrepeatOnce(() => console.log("Done"));', explanationAr: 'تنشئ الدالة السهمية callback صغيرة في موضع تمريرها.', explanationEn: 'An arrow function creates a small callback at the point where it is passed.' },
      ]},
      { titleAr: 'اعرف من يستدعي callback ومتى', titleEn: 'Know who calls the callback and when', bodyAr: 'لا يكفي النظر إلى callback وحدها؛ اقرأ الدالة التي تستقبلها لمعرفة متى تستدعيها وما الوسيط الذي تمرره. اكتب callback صغيرة ذات مسؤولية واحدة، وسمّها إذا تكرر استخدامها. لا تخلط بين callback المتزامنة ونتيجة Promise؛ قد يكون توقيت الاستدعاء مختلفًا.', bodyEn: 'Do not read a callback in isolation; inspect the receiving function to learn when it calls it and which argument it passes. Keep callbacks small and single-purpose, and name them if reused. Do not confuse a synchronous callback with a Promise result; timing may differ.', examples: [
        { code: '[2, 4, 6].forEach((value) => console.log(value));', explanationAr: 'تستدعي forEach الـ callback لكل قيمة في المصفوفة، لكن لا تنشئ مصفوفة نتيجة جديدة.', explanationEn: 'forEach invokes the callback for each array value, but does not create a result array.' },
        { code: 'function withLabel(value, formatter) {\n  console.log(formatter(value));\n}\nwithLabel("ready", (text) => text.toUpperCase());', explanationAr: 'تستقبل formatter قيمة وتعيد نصًا منسقًا، ثم تستخدم الدالة المستقبلة النتيجة.', explanationEn: 'formatter receives a value and returns formatted text, which the receiving function then uses.' },
      ]},
    ],
    'اكتب دالة باسم runTwice تستقبل callback وتستدعيها مرتين، ثم مرر إليها callback تطبع رسالة قصيرة. تأكد أن الاستدعاء يحدث داخل الدالة.',
    'Write a function named runTwice that accepts a callback and invokes it twice, then pass a callback that logs a short message. Ensure invocation happens inside the function.',
    q('ما الذي يميز callback؟', 'What characterizes a callback?', ['دالة تُمرّر إلى موضع آخر كي تُستدعى هناك', 'قيمة لا يمكن استدعاؤها', 'عنصر HTML', 'تعليق لا ينفذ'], ['A function passed elsewhere to be called there', 'A value that cannot be called', 'An HTML element', 'A comment that does not execute'], 0,
      'صحيح: callback هي دالة تم تمريرها لتُستدعى بواسطة المستقبِل.', 'Correct: a callback is a function passed to be invoked by its receiver.',
      'فكر في القيمة التي يستقبلها المستدعي ثم ينفذها بدل تنفيذها عند التمرير.', 'Think of a function value that the receiver later invokes, rather than one run during passing.',
      'الأقواس تغيّر الفرق بين تمرير الدالة واستدعائها فورًا.', 'Parentheses change the difference between passing a function and calling it immediately.')),
  existing('js-arrays', 16, 'القوائم باستخدام Arrays', 'Lists with Arrays',
    'أنشئ array واقرأ عنصرًا باستخدام index يبدأ من صفر أو باستخدام length.',
    'Create an array and read an item using a zero-based index or length.',
    ['الفهرس الأول هو 0 وليس 1.', 'length هو عدد العناصر؛ آخر فهرس عادةً length - 1.'],
    ['The first index is 0, not 1.', 'length is the item count; the last index is usually length - 1.']),
  added(17, 'destructuring', 'استخراج قيم باستخدام التفكيك', 'Extracting Values with Destructuring',
    'استخرج قيمًا من مصفوفة أو خصائص من كائن بإسناد موجز، مع المحافظة على ترتيب عناصر المصفوفة وأسماء خصائص الكائن.',
    'Extract array values or object properties with concise assignment while respecting array order and object property names.',
    ['في المصفوفة يعتمد التفكيك على ترتيب المواقع.', 'في الكائن يجب أن يطابق الاسم الخاصية، إلا إذا استخدمت صيغة إعادة التسمية.'],
    ['Array destructuring depends on positional order.', 'Object destructuring matches property names unless you use renaming syntax.'],
    [
      { titleAr: 'فكك مصفوفة حسب الترتيب', titleEn: 'Destructure an array by position', bodyAr: 'يأخذ التفكيك من المصفوفة القيم بحسب ترتيبها، ويضعها في أسماء متغيرات جديدة. إذا حذفت موضعًا، استخدم فاصلة للحفاظ على الموضع التالي. هذه طريقة لقراءة القيم وليست طريقة جديدة لإنشاء المصفوفة.', bodyEn: 'Array destructuring takes values by position and assigns them to new variable names. If you skip a position, use a comma to preserve the next position. This is a way to read values, not a new way to create the array.', examples: [
        { code: 'const colors = ["teal", "gold"];\nconst [firstColor, secondColor] = colors;\nconsole.log(firstColor);', explanationAr: 'تأخذ firstColor العنصر الأول وsecondColor العنصر الثاني.', explanationEn: 'firstColor receives the first item and secondColor receives the second.' },
        { code: 'const point = [5, 9];\nconst [x, y] = point;\nconsole.log(x + y);', explanationAr: 'يحوّل موضعي النقطة إلى اسمين واضحين يسهل استخدامهما.', explanationEn: 'It gives the two point positions clear names that are easy to use.' },
      ]},
      { titleAr: 'فكك كائنًا بحسب اسم الخاصية', titleEn: 'Destructure an object by property name', bodyAr: 'في الكائن، تطابق أسماء المتغيرات أسماء الخصائص. يمكنك إعادة تسمية المتغير محليًا بصيغة `name: displayName`. إن لم توجد الخاصية فستكون القيمة undefined؛ لا تفترض أن البيانات الخارجية تحتوي دائمًا على الحقل.', bodyEn: 'For objects, variable names match property names. You can rename a local variable with `name: displayName`. If a property is missing, its value is undefined; do not assume external data always has the field.', examples: [
        { code: 'const user = { name: "Lina", city: "Amman" };\nconst { name, city } = user;\nconsole.log(name, city);', explanationAr: 'يستخرج المتغيران الخاصيتين المسميتين من الكائن.', explanationEn: 'The two variables extract the named properties from the object.' },
        { code: 'const settings = { theme: "dark" };\nconst { theme: selectedTheme } = settings;\nconsole.log(selectedTheme);', explanationAr: 'تُقرأ الخاصية theme لكن يُعطى متغير محلي اسم selectedTheme.', explanationEn: 'The theme property is read, but the local variable is named selectedTheme.' },
      ]},
    ],
    'أنشئ مصفوفة من إحداثيين وكائنًا لبطاقة به title وdone. استخدم تفكيك المصفوفة والكائن لقراءة القيم، ثم اعرضها بأسماء مفهومة.',
    'Create a two-coordinate array and a card object with title and done. Use array and object destructuring to read the values, then display them using clear names.',
    q('كيف يحدد تفكيك الكائن القيمة التي تُقرأ؟', 'How does object destructuring determine which value to read?', ['باسم الخاصية', 'بموقع العنصر فقط دائمًا', 'بعشوائية', 'باسم الملف'], ['By the property name', 'Always by item position only', 'Randomly', 'By the file name'], 0,
      'صحيح: يطابق تفكيك الكائن اسم الخاصية ما لم تستخدم إعادة التسمية.', 'Correct: object destructuring matches the property name unless renaming is used.',
      'ترتيب المواضع يخص تفكيك المصفوفة؛ خصائص الكائن لها أسماء.', 'Positional order applies to array destructuring; object properties have names.',
      'قارن بين الأقواس المربعة للمصفوفة والمعقوفة للكائن.', 'Compare square brackets for arrays with braces for objects.')),
  added(18, 'spread-rest', 'نسخ القيم وجمع المدخلات بـ spread وrest', 'Copying and Collecting Values with Spread and Rest',
    'استخدم spread لنسخ عناصر مصفوفة أو خصائص كائن إلى بنية جديدة، وrest لجمع معاملات دالة في مصفوفة.',
    'Use spread to copy array items or object properties into a new structure, and rest to collect function arguments into an array.',
    ['spread ينسخ على نحو سطحي؛ الكائنات المتداخلة قد تظل مشتركة.', 'rest يستخدم ... في تعريف المعاملات، بينما spread يوسّع قيمة موجودة.'],
    ['Spread makes a shallow copy; nested objects may still be shared.', 'Rest uses ... in a parameter definition, while spread expands an existing value.'],
    [
      { titleAr: 'وسّع المصفوفة أو الكائن', titleEn: 'Spread an array or object', bodyAr: 'تكتب ثلاث نقاط قبل المصفوفة أو الكائن لتوسيع عناصره أو خصائصه داخل بنية جديدة. النسخ هنا سطحي: تنسخ القيم في المستوى الأول، لكنها لا تنسخ كل كائن متداخل بعمق. استخدمه بدل تعديل المصدر حين تريد نسخة مستقلة من المستوى الأول.', bodyEn: 'Write three dots before an array or object to expand its items or properties into a new structure. This is a shallow copy: first-level values are copied, but nested objects are not deeply cloned. Use it instead of changing the source when you need an independent first-level copy.', examples: [
        { code: 'const first = ["a", "b"];\nconst combined = [...first, "c"];\nconsole.log(combined);', explanationAr: 'تنسخ العناصر إلى مصفوفة جديدة وتضيف c من دون تغيير first.', explanationEn: 'It copies the items into a new array and adds c without changing first.' },
        { code: 'const base = { color: "blue", size: "M" };\nconst updated = { ...base, size: "L" };', explanationAr: 'تنسخ الخصائص ثم تستبدل size بالقيمة اللاحقة.', explanationEn: 'It copies the properties and then replaces size with the later value.' },
      ]},
      { titleAr: 'اجمع المعاملات باستخدام rest', titleEn: 'Collect parameters with rest', bodyAr: 'في تعريف الدالة، يضع rest القيم المتبقية داخل مصفوفة. يجب أن يكون معامل rest أخير معامل في قائمة المعاملات. استخدم اسمًا يوضح المجموعة التي تجمعها.', bodyEn: 'In a function definition, rest puts the remaining values into an array. A rest parameter must be the last parameter in the parameter list. Choose a name that explains the collected group.', examples: [
        { code: 'function sumAll(...numbers) {\n  return numbers.reduce((sum, number) => sum + number, 0);\n}\nconsole.log(sumAll(2, 3, 4));', explanationAr: 'يجمع rest كل الوسيطات في مصفوفة numbers، ثم تحسب reduce مجموعها.', explanationEn: 'rest collects all arguments into a numbers array, then reduce calculates their sum.' },
        { code: 'function greetTeam(leader, ...members) {\n  console.log(leader, members.length);\n}\ngreetTeam("Ari", "Mina", "Omar");', explanationAr: 'يستقبل leader أول وسيط، ويجمع rest بقية الأسماء في مصفوفة.', explanationEn: 'leader receives the first argument, and rest collects the remaining names into an array.' },
      ]},
    ],
    'أنشئ نسخة من مصفوفة ألوان باستخدام spread وأضف لونًا إليها من دون تغيير الأصل، ثم اكتب دالة تستقبل اسمًا أولًا وبقية أسماء باستخدام rest.',
    'Make a copy of a color array with spread and add a color without changing the original, then write a function that accepts a first name and the remaining names with rest.',
    q('أي عبارة صحيحة عن النسخ باستخدام spread؟', 'Which statement about copying with spread is true?', ['ينسخ المستوى الأول فقط، وقد تبقى المراجع المتداخلة مشتركة', 'ينسخ كل شيء بعمق في جميع الحالات', 'يحوّل القيم إلى نصوص', 'يمنع استعمال المصفوفة الأصلية'], ['It copies only the first level; nested references may remain shared', 'It deeply copies everything in every case', 'It converts values to strings', 'It prevents using the original array'], 0,
      'صحيح: spread ينشئ نسخة سطحية وليس استنساخًا عميقًا.', 'Correct: spread makes a shallow copy, not a deep clone.',
      'لا تعتمد على spread وحده لنسخ بنية متداخلة كاملة؛ تعرّف إلى حدود النسخ.', 'Do not rely on spread alone to clone an entire nested structure; understand its limits.',
      'احذر مشاركة الكائنات الداخلية عند تحديث بيانات متداخلة.', 'Watch for shared nested objects when updating nested data.')),
  existing('js-functions-scope', 19, 'الدوال والنطاق وreturn', 'Functions, Scope, and return',
    'عرّف دالة ذات معامل، أعد نتيجة باستخدام return، وافهم الفرق بين المعامل المحلي والمتغير خارج الدالة.',
    'Define a function with a parameter, return a result, and understand the difference between a local parameter and a variable outside the function.',
    ['المعامل والمتغير المحلي لا يصبحان متاحين تلقائيًا خارج الدالة.', 'نسيان return يعني أن استدعاء الدالة لا يعيد نتيجة الحساب.'],
    ['A parameter or local variable does not automatically become available outside the function.', 'Forgetting return means the function call does not return the calculated result.']),
  existing('js-objects', 20, 'الكائنات والخصائص', 'Objects and Properties',
    'أنشئ كائنًا يربط أسماء الخصائص بقيم، ثم استخدم الوصول النقطي لتحديث خاصية نصية.',
    'Create an object that maps property names to values, then use dot notation to update a string property.',
    ['أسماء الخصائص حساسة لحالة الأحرف؛ name يختلف عن Name.', 'استخدم اسم خاصية موجودًا أو اشرح بوضوح إذا كنت تضيف خاصية جديدة.'],
    ['Property names are case-sensitive; name differs from Name.', 'Use an existing property name, or be clear when adding a new property.']),
  added(21, 'set-and-map-collections', 'مجموعتا Set وMap', 'The Set and Map Collections',
    'استخدم Set للاحتفاظ بقيم فريدة، وMap لربط مفاتيح بقيم مع المحافظة على مفاتيح لا تقتصر على النصوص.',
    'Use Set to keep unique values and Map to associate keys with values, including keys that are not limited to strings.',
    ['تُهمل Set التكرار، لذلك لا تستخدمها عندما يلزم حفظ كل تكرار.', 'في Map استخدم set وget بدل الوصول النقطي إلى المفتاح.'],
    ['Set ignores duplicate values, so do not use it when every duplicate must be retained.', 'In Map, use set and get instead of dot notation for keys.'],
    [
      { titleAr: 'احتفظ بالقيم الفريدة مع Set', titleEn: 'Keep unique values with Set', bodyAr: 'تخزن `Set` مجموعة من القيم الفريدة؛ إضافة قيمة موجودة لا تنشئ نسخة ثانية. افحص وجود قيمة بـ `has`، وأضفها بـ `add`. هذا مفيد لإزالة التكرارات أو تتبع عناصر شوهدت، لكنه لا يحفظ عدد مرات التكرار.', bodyEn: '`Set` stores unique values; adding a value that is already present does not create a second copy. Check with `has` and add with `add`. This helps remove duplicates or track seen items, but it does not preserve duplicate counts.', examples: [
        { code: 'const tags = new Set(["news", "art", "news"]);\nconsole.log(tags.size);', explanationAr: 'يحتوي Set على قيمتين فريدتين رغم تكرر news في المصدر.', explanationEn: 'The Set has two unique values even though news was repeated in the input.' },
        { code: 'const visited = new Set();\nvisited.add("home");\nconsole.log(visited.has("home"));', explanationAr: 'تضيف قيمة ثم تفحص إن كانت المجموعة تحتويها.', explanationEn: 'It adds a value and checks whether the set contains it.' },
      ]},
      { titleAr: 'اربط مفتاحًا بقيمة مع Map', titleEn: 'Associate a key with a value using Map', bodyAr: '`Map` تحفظ أزواج المفتاح والقيمة. استخدم `set(key, value)` للكتابة و`get(key)` للقراءة؛ لا تستخدم `map.name` للوصول إلى مفتاح اسمه name. يمكن أن يكون المفتاح قيمة غير نصية، وتُقرأ العناصر بترتيب الإضافة.', bodyEn: '`Map` stores key/value pairs. Use `set(key, value)` to write and `get(key)` to read; do not use `map.name` to access a key named name. A key can be a non-string value, and entries are iterated in insertion order.', examples: [
        { code: 'const scores = new Map();\nscores.set("Mina", 9);\nconsole.log(scores.get("Mina"));', explanationAr: 'تربط الاسم بالدرجة ثم تسترجع الدرجة باستخدام المفتاح نفسه.', explanationEn: 'It associates a name with a score and retrieves the score using the same key.' },
        { code: 'const key = { id: 1 };\nconst lookup = new Map();\nlookup.set(key, "found");\nconsole.log(lookup.get(key));', explanationAr: 'يمكن أن يكون مفتاح Map كائنًا، ويجب استعمال مرجع الكائن نفسه لاسترجاع القيمة.', explanationEn: 'A Map key can be an object; retrieving the value requires the same object reference.' },
      ]},
    ],
    'استخدم Set لتكوين قائمة فريدة من ["red", "blue", "red"]، ثم Map لربط اسمين بدرجتين واسترجاع إحداهما.',
    'Use Set to make a unique collection from ["red", "blue", "red"], then use Map to associate two names with scores and retrieve one score.',
    q('متى تكون Set مناسبة؟', 'When is Set a good fit?', ['عندما نحتاج مجموعة قيم فريدة', 'عندما نريد حفظ كل نسخة مكررة وعدّها تلقائيًا', 'عندما نحتاج عنصر DOM', 'عندما نرسل طلب شبكة'], ['When we need a collection of unique values', 'When we need to keep and automatically count every duplicate', 'When we need a DOM element', 'When we send a network request'], 0,
      'صحيح: Set تمنع تكرار القيمة نفسها داخل المجموعة.', 'Correct: Set prevents the same value from appearing twice in the collection.',
      'إذا كانت التكرارات ذات معنى، فاختر مصفوفة أو بنية تحفظ عددها.', 'If duplicates matter, choose an array or a structure that preserves their counts.',
      'اختر البنية بحسب ما إذا كانت الفريدة أو التكرارات مهمة.', 'Choose the structure based on whether uniqueness or duplicates matter.')),
  added(22, 'optional-chaining-nullish', 'الوصول الآمن والقيمة الافتراضية', 'Safe Access and Fallback Values',
    'استخدم optional chaining للوصول إلى خاصية قد لا توجد، و?? لتقديم قيمة افتراضية عند null أو undefined.',
    'Use optional chaining to access a property that may be missing, and ?? to provide a fallback for null or undefined.',
    ['?. لا يمنع كل الأخطاء؛ استخدمه عند احتمال غياب هذا الجزء من المسار.', '|| يستبدل كل قيمة falsy مثل 0 و""؛ أما ?? فيستبدل null وundefined فقط.'],
    ['?. does not prevent every error; use it when that part of the path may be absent.', '|| replaces all falsy values such as 0 and ""; ?? replaces only null and undefined.'],
    [
      { titleAr: 'اقرأ خاصية قد تكون غائبة', titleEn: 'Read a property that may be absent', bodyAr: 'يوقف `?.` محاولة الوصول إذا كانت القيمة قبله `null` أو `undefined` ويعيد `undefined` بدل رمي خطأ في هذا المسار. استخدمه عندما تكون البيانات اختيارية فعلًا، لا لإخفاء خطأ برمجي متوقع. لا يحول القيمة إلى فحص موثوق لكل محتويات البيانات.', bodyEn: '`?.` stops access when the value before it is `null` or `undefined` and returns `undefined` instead of throwing for that access path. Use it when data is genuinely optional, not to hide a programming error. It is not a complete validation of the data.', examples: [
        { code: 'const user = { profile: { city: "Irbid" } };\nconsole.log(user.profile?.city);', explanationAr: 'يقرأ المدينة، ويظل التعبير صالحًا إذا غاب profile.', explanationEn: 'It reads the city and remains safe if profile is absent.' },
        { code: 'const account = {};\nconsole.log(account.owner?.name);', explanationAr: 'يعيد undefined بدل محاولة قراءة name من قيمة غائبة.', explanationEn: 'It returns undefined instead of trying to read name from a missing value.' },
      ]},
      { titleAr: 'اختر قيمة افتراضية مناسبة', titleEn: 'Choose an appropriate fallback', bodyAr: 'يعيد `value ?? fallback` القيمة الاحتياطية فقط عندما تكون القيمة الأصلية null أو undefined. لذلك يحافظ على 0 والنص الفارغ إن كانا قيمتين مقصودتين. اختر افتراضيًا يوضح حالة الغياب ولا يزوّر معلومة مهمة.', bodyEn: '`value ?? fallback` uses the fallback only when the original is null or undefined. It preserves 0 and an empty string when they are intentional values. Choose a default that makes absence clear rather than inventing important information.', examples: [
        { code: 'const nickname = null;\nconst label = nickname ?? "Guest";\nconsole.log(label);', explanationAr: 'يستخدم Guest لأن nickname تساوي null.', explanationEn: 'It uses Guest because nickname is null.' },
        { code: 'const savedCount = 0;\nconst count = savedCount ?? 5;\nconsole.log(count);', explanationAr: 'تبقى القيمة صفرًا؛ فـ ?? لا تعتبر الصفر غيابًا.', explanationEn: 'The value remains zero; ?? does not treat zero as missing.' },
      ]},
    ],
    'اكتب تعبيرًا يقرأ title من كائن قد يغيب فيه details، واستخدم ?? لعرض "Untitled" إذا كانت القيمة مفقودة. تحقق أن القيمة الفارغة المتعمدة لا تستبدل.',
    'Write an expression that reads title from an object whose details may be absent, and use ?? to show "Untitled" when the value is missing. Check that an intentional empty value is not replaced.',
    q('ما الذي يجعل ?? تستخدم القيمة الاحتياطية؟', 'When does ?? use its fallback value?', ['عندما تكون القيمة null أو undefined', 'عندما تكون القيمة 0 فقط', 'عندما تكون القيمة false فقط', 'في كل قيمة نصية'], ['When the value is null or undefined', 'Only when the value is 0', 'Only when the value is false', 'For every string value'], 0,
      'صحيح: ?? تحافظ على القيم falsy الأخرى وتستبدل الغياب فقط.', 'Correct: ?? preserves other falsy values and replaces only nullish absence.',
      'الصفر وfalse قد يكونان قيمتين مقصودتين؛ راجع الفرق بين ?? و||.', 'Zero and false may be intentional values; review the difference between ?? and ||.',
      'استخدم ?? عندما تعني القيمة الاحتياطية «لا قيمة موجودة».', 'Use ?? when the fallback should mean “no value is present.”')),
  existing('js-array-methods', 23, 'طرائق المصفوفات: map وfilter', 'Array Methods: map and filter',
    'استخدم filter لاختيار العناصر المطابقة لشرط، وmap لإنتاج مصفوفة جديدة من تحويل العناصر.',
    'Use filter to select items that match a condition, and map to create a new array by transforming items.',
    ['filter للاختيار وmap للتحويل؛ لا تتوقع منهما النتيجة نفسها.', 'تأكد من أن callback تعيد شرطًا أو قيمة محولة بدل الاكتفاء بالطباعة.'],
    ['filter selects and map transforms; do not expect them to produce the same kind of result.', 'Make sure the callback returns a condition or transformed value rather than only logging.']),
  added(24, 'array-find', 'العثور على عنصر باستخدام find', 'Finding an Item with find',
    'استخدم find لإرجاع أول عنصر يطابق شرطًا، وافحص احتمال أن تكون النتيجة undefined.',
    'Use find to return the first item that matches a condition, and check whether the result may be undefined.',
    ['find تعيد أول تطابق فقط، لا مصفوفة كل النتائج.', 'إذا لم يوجد تطابق فالناتج undefined؛ افحصه قبل استخدام خصائصه.'],
    ['find returns only the first match, not an array of all matches.', 'If there is no match, the result is undefined; check it before using its properties.'],
    [
      { titleAr: 'أعد أول تطابق', titleEn: 'Return the first match', bodyAr: '`find` تمر على العناصر وتعيد أول عنصر تجعل callback شرطه صحيحًا. إذا لم يوجد تطابق، تعيد `undefined`. استخدمها عندما تحتاج عنصرًا واحدًا مثل سجل برقم معروف؛ استخدم filter إذا كنت تريد جميع المطابقات.', bodyEn: '`find` checks items and returns the first one for which the callback condition is true. If nothing matches, it returns `undefined`. Use it when you need one item, such as a record with a known ID; use filter when you need all matches.', examples: [
        { code: 'const scores = [42, 68, 91];\nconst firstHigh = scores.find((score) => score >= 60);\nconsole.log(firstHigh);', explanationAr: 'تعيد أول درجة تحقق الشرط، وهي 68، ولا تضم 91 إلى مصفوفة نتيجة.', explanationEn: 'It returns the first score satisfying the condition, 68, and does not collect 91 into a result array.' },
        { code: 'const tasks = [{ id: 1, done: false }, { id: 2, done: true }];\nconst finished = tasks.find((task) => task.done);', explanationAr: 'تعيد أول مهمة منجزة، وهي كائن واحد.', explanationEn: 'It returns the first completed task, which is a single object.' },
      ]},
      { titleAr: 'تعامل مع عدم وجود تطابق', titleEn: 'Handle the no-match case', bodyAr: 'لا تستخدم النتيجة كما لو كانت موجودة دائمًا. اختبرها بشرط قبل قراءة خاصية، أو استخدم قيمة احتياطية واضحة حسب حاجة الواجهة. في تطبيق حقيقي قد تكون «غير موجود» حالة طبيعية ينبغي إظهارها للمستخدم.', bodyEn: 'Do not use the result as if it always exists. Check it before reading a property, or use a clear fallback that suits the interface. In a real app, “not found” may be a normal state worth showing to the user.', examples: [
        { code: 'const names = ["Ari", "Mina"];\nconst match = names.find((name) => name === "Noor");\nif (match === undefined) console.log("No match");', explanationAr: 'يتعامل الشرط مع نتيجة عدم العثور قبل محاولة استخدامها.', explanationEn: 'The condition handles the no-match result before trying to use it.' },
        { code: 'const products = [{ id: "p1", name: "Pen" }];\nconst product = products.find((item) => item.id === "p2");\nconst label = product?.name ?? "Product unavailable";', explanationAr: 'يجمع optional chaining و?? لتقديم رسالة واضحة عند غياب المنتج.', explanationEn: 'Optional chaining and ?? provide a clear message when the product is absent.' },
      ]},
    ],
    'ابحث عن أول مهمة غير مكتملة في قائمة كائنات، ثم اعرض عنوانها إن وُجدت أو رسالة مناسبة إذا لم يوجد تطابق.',
    'Find the first incomplete task in a list of objects, then display its title if found or an appropriate message if there is no match.',
    q('ما الذي تعيده find عند عدم العثور على عنصر؟', 'What does find return when it finds no item?', ['undefined', 'مصفوفة فارغة دائمًا', 'false دائمًا', 'العنصر الأخير'], ['undefined', 'Always an empty array', 'Always false', 'The last item'], 0,
      'صحيح: find تعيد undefined عند غياب التطابق.', 'Correct: find returns undefined when there is no match.',
      'المصفوفة الفارغة هي نمط شائع لنتيجة filter، لا find.', 'An empty array is a common filter result, not the find result.',
      'تحقق من النتيجة قبل قراءة خصائص العنصر الذي بحثت عنه.', 'Check the result before reading properties of the item you searched for.')),
  added(25, 'array-some-every-reduce', 'فحص العناصر وتجميعها: some وevery وreduce', 'Testing and Combining Items: some, every, and reduce',
    'اختر some أو every للإجابة عن سؤال منطقي حول عناصر المصفوفة، واستخدم reduce لبناء قيمة مجمعة.',
    'Choose some or every to answer a yes/no question about array items, and use reduce to build an accumulated value.',
    ['some تعني وجود عنصر واحد على الأقل، أما every فتتطلب نجاح جميع العناصر.', 'امنح reduce قيمة بداية مناسبة لتجنب نتيجة غير متوقعة في المصفوفة الفارغة.'],
    ['some means at least one item matches, while every requires all items to match.', 'Give reduce an appropriate initial value to avoid an unexpected empty-array result.'],
    [
      { titleAr: 'أجب عن سؤال منطقي', titleEn: 'Answer a yes-or-no question', bodyAr: '`some` تعيد true إذا حقق عنصر واحد على الأقل الشرط، و`every` تعيد true إذا حققته جميع العناصر. كلتاهما تعيدان قيمة منطقية، ولا تنشئان مصفوفة. اختَر الاسم الذي يطابق السؤال الذي تريد الإجابة عنه.', bodyEn: '`some` returns true if at least one item meets the condition, while `every` returns true if all items meet it. Both return a Boolean and do not create an array. Choose the method that matches the question you need answered.', examples: [
        { code: 'const ages = [12, 17, 21];\nconst hasAdult = ages.some((age) => age >= 18);', explanationAr: 'تكون النتيجة true لأن 21 تحقق الشرط، حتى لو لم تحققه القيم الأخرى.', explanationEn: 'The result is true because 21 meets the condition even though the other values do not.' },
        { code: 'const checks = [true, true, false];\nconst allPassed = checks.every((value) => value === true);', explanationAr: 'تكون النتيجة false لأن كل العناصر يجب أن تكون true كي تنجح every.', explanationEn: 'The result is false because every item must be true for every to succeed.' },
      ]},
      { titleAr: 'اجمع نتيجة تدريجيًا مع reduce', titleEn: 'Build an accumulated result with reduce', bodyAr: '`reduce` تمر على العناصر وتحدّث قيمة تراكمية، مثل مجموع أو كائن فهرسة. اكتب دالة callback واضحة وحدد قيمة بداية مناسبة. لأن reduce أكثر كثافة من حلقة بسيطة، فضّل الحلقة إذا صار المنطق صعب القراءة.', bodyEn: '`reduce` visits items and updates an accumulated value, such as a sum or lookup object. Write a clear callback and provide an appropriate initial value. Because reduce is denser than a simple loop, prefer a loop if the logic becomes hard to read.', examples: [
        { code: 'const costs = [3, 5, 2];\nconst total = costs.reduce((sum, cost) => sum + cost, 0);', explanationAr: 'تبدأ قيمة الجمع من صفر، ثم تضيف كل تكلفة.', explanationEn: 'The sum starts at zero and then adds each cost.' },
        { code: 'const words = ["a", "b", "c"];\nconst joined = words.reduce((text, word) => text + word, "");', explanationAr: 'تجمع الكلمات في نص يبدأ بقيمة ابتدائية فارغة.', explanationEn: 'It combines words into a string that starts with an empty initial value.' },
      ]},
    ],
    'أنشئ مصفوفة درجات، واستخدم some لمعرفة هل توجد درجة نجاح، every لمعرفة هل كلها أعداد موجبة، وreduce لحساب مجموعها مع قيمة بداية.',
    'Create a score array, use some to check whether any score passes, every to check whether all are positive numbers, and reduce to calculate their sum with an initial value.',
    q('متى تعيد some قيمة true؟', 'When does some return true?', ['عندما ينجح عنصر واحد على الأقل في الشرط', 'عندما تفشل كل العناصر', 'عندما تكون المصفوفة نصًا', 'فقط إذا نجحت جميع العناصر'], ['When at least one item satisfies the condition', 'When all items fail', 'When the array is a string', 'Only if every item satisfies it'], 0,
      'صحيح: يكفي أن يحقق عنصر واحد الشرط.', 'Correct: one matching item is enough.',
      'نجاح جميع العناصر هو معنى every، لا some.', 'All items matching is the meaning of every, not some.',
      'تذكّر: some = واحد على الأقل؛ every = الجميع.', 'Remember: some = at least one; every = all.')),
  added(26, 'stable-sorting', 'ترتيب البيانات باستخدام sort', 'Sorting Data with sort',
    'رتّب نسخة من مصفوفة نصوص أو أعداد بوسيط مقارنة واضح، وتجنب تغيير المصفوفة الأصلية من دون قصد.',
    'Sort a copy of an array of strings or numbers with an explicit comparison, avoiding accidental changes to the original array.',
    ['sort تعدّل المصفوفة التي تستدعيها؛ انسخها أولًا إذا احتجت الأصل.', 'الفرز الافتراضي يقارن النصوص؛ اكتب دالة مقارنة للأعداد.'],
    ['sort mutates the array it is called on; copy it first if you need the original.', 'Default sorting compares strings; provide a comparator for numbers.'],
    [
      { titleAr: 'رتّب نصوصًا بوضوح', titleEn: 'Sort strings clearly', bodyAr: '`sort` تعدّل المصفوفة نفسها وتعيد مرجعها. لترتيب نصوص أبجديًا حسب الإعداد المحلي، يمكن استخدام مقارنة نصية مناسبة؛ لا تفترض أن الترتيب البسيط مناسب لكل لغة أو غرض. لا تفرز بيانات العرض بطريقة تغيّر ترتيب المصدر دون حاجة.', bodyEn: '`sort` mutates the array itself and returns that array reference. For locale-sensitive text ordering, an appropriate string comparison can be used; do not assume simple ordering suits every language or purpose. Avoid changing source order when the interface does not require it.', examples: [
        { code: 'const names = ["Maya", "Ari", "Noor"];\nconst sortedNames = [...names].sort((a, b) => a.localeCompare(b));', explanationAr: 'تفرز نسخة من الأسماء باستخدام مقارنة نصية، مع بقاء names كما هي.', explanationEn: 'It sorts a copy of the names with a text comparison while leaving names unchanged.' },
        { code: 'const labels = ["c", "a", "b"];\nlabels.sort();\nconsole.log(labels);', explanationAr: 'هذا الفرز النصي الافتراضي مناسب لهذه الرموز القصيرة، وهو يعدّل labels نفسها.', explanationEn: 'Default text sorting suits these short labels, and it mutates labels itself.' },
      ]},
      { titleAr: 'اكتب مقارنة رقمية', titleEn: 'Write a numeric comparison', bodyAr: 'من دون دالة مقارنة، قد يُرتب sort الأعداد على أساس نصي، فيظهر 100 قبل 20. للمقارنة العددية تصفّر الدالة الفرق: موجب أو سالب بحسب الترتيب المطلوب. استخدم نسخة عند الحاجة إلى المحافظة على المصدر.', bodyEn: 'Without a comparator, sort may order numbers as text, putting 100 before 20. For numeric ordering, the comparator returns the difference, positive or negative according to the desired order. Use a copy when the source must stay unchanged.', examples: [
        { code: 'const values = [100, 20, 3];\nconst ascending = [...values].sort((a, b) => a - b);', explanationAr: 'ترتب المقارنة العددية القيم تصاعديًا، وتترك values الأصلية دون تغيير.', explanationEn: 'The numeric comparator sorts values ascending while leaving the original values unchanged.' },
        { code: 'const values = [4, 9, 1];\nconst descending = [...values].sort((a, b) => b - a);', explanationAr: 'عكس ترتيب الفرق يجعل النتيجة تنازلية.', explanationEn: 'Reversing the subtraction order makes the result descending.' },
      ]},
    ],
    'رتّب نسخة من مصفوفة [42, 7, 100, 18] تصاعديًا، ثم اعرض المصفوفة الأصلية والمرتبة للتأكد أن الأصل لم يتغير.',
    'Sort a copy of [42, 7, 100, 18] in ascending order, then display the original and sorted arrays to confirm the source did not change.',
    q('لماذا نمرر (a, b) => a - b إلى sort عند ترتيب أعداد تصاعديًا؟', 'Why pass (a, b) => a - b to sort for ascending numbers?', ['لتحديد مقارنة عددية بدل الترتيب النصي الافتراضي', 'لتحويل كل عنصر إلى عنصر DOM', 'لإزالة القيم المكررة', 'لمنع sort من ترتيب العناصر'], ['To specify numeric comparison instead of default text ordering', 'To convert every item to a DOM element', 'To remove duplicate values', 'To prevent sort from sorting items'], 0,
      'صحيح: تعيد المقارنة نتيجة ترتيب عددي تصاعدي.', 'Correct: the comparator defines ascending numeric order.',
      'الفرز الافتراضي لا يضمن الترتيب العددي؛ حدد المقارنة المناسبة.', 'Default sorting does not guarantee numeric order; specify an appropriate comparison.',
      'انسخ المصفوفة قبل الفرز إن كان ترتيب المصدر مهمًا.', 'Copy the array before sorting if the original order matters.')),
  added(27, 'non-mutating-updates', 'تحديث البيانات دون تغيير الأصل', 'Updating Data Without Mutating the Original',
    'أنشئ تحديثات واضحة للمصفوفات والكائنات باستخدام عمليات النسخ بدل تعديل المصدر المشترك مباشرةً.',
    'Create clear array and object updates with copying operations instead of directly mutating shared source data.',
    ['const لا يمنع تعديل محتوى كائن أو مصفوفة، لكنه يمنع إعادة إسناد الرابط.', 'النسخ السطحي لا يفصل الكائنات المتداخلة.'],
    ['const does not prevent changing an array or object’s contents; it prevents reassigning the binding.', 'A shallow copy does not separate nested objects.'],
    [
      { titleAr: 'تميّز بين الاسم والمحتوى', titleEn: 'Distinguish a binding from its contents', bodyAr: 'يمكن أن يبقى اسم مصفوفة معلن بـ const ثابتًا بينما تتغير عناصرها؛ const يثبت الإسناد لا يجمد المحتوى. حين تشارك مرجعًا مع جزء آخر من البرنامج قد يربك التغيير المباشر هذا الجزء. اعتمد أسلوبًا متسقًا: أنشئ نسخة جديدة عند وصف تحديث.', bodyEn: 'A const array binding can stay fixed while its items change; const fixes the binding, not the contents. When another part of a program shares the reference, direct mutation can surprise it. Use a consistent approach: create a new copy to describe an update.', examples: [
        { code: 'const original = ["a", "b"];\nconst withC = [...original, "c"];', explanationAr: 'تبقى original كما هي، فيما تصف withC الحالة الجديدة.', explanationEn: 'original stays as it is, while withC describes the new state.' },
        { code: 'const user = { name: "Ari", active: false };\nconst activeUser = { ...user, active: true };', explanationAr: 'تُنشأ قيمة كائن جديدة مع إبقاء الخصائص الأخرى كما كانت.', explanationEn: 'A new object value is created while the other properties remain as they were.' },
      ]},
      { titleAr: 'احذر النسخ السطحي', titleEn: 'Be careful with shallow copies', bodyAr: 'ينسخ spread خصائص المستوى الأول فقط. إذا احتوى الكائن على كائن داخلي، فقد يشير النسخ والمصدر إلى الكائن الداخلي نفسه. حدّث أيضًا المستوى الداخلي بنسخة جديدة إذا أردت تجنب تغيير المصدر؛ لا تستخدم استنساخًا عميقًا قبل معرفة احتياجات البيانات.', bodyEn: 'Spread copies only first-level properties. If an object contains a nested object, the copy and source may point to the same nested object. Copy the nested level as well if you need to avoid changing the source; do not choose a deep-cloning approach without understanding the data needs.', examples: [
        { code: 'const settings = { view: { compact: false } };\nconst nextSettings = { ...settings, view: { ...settings.view, compact: true } };', explanationAr: 'تُنسخ البنية الخارجية والداخلية التي يجري تحديثها، فلا تتغير قيمة المصدر.', explanationEn: 'Both the outer structure and the nested object being updated are copied, so the source value is unchanged.' },
        { code: 'const items = ["pen", "book"];\nconst withoutPen = items.filter((item) => item !== "pen");', explanationAr: 'ينشئ filter مصفوفة جديدة للعناصر المحتفظ بها بدل حذفها من المصدر.', explanationEn: 'filter creates a new array of retained items instead of deleting from the source.' },
      ]},
    ],
    'لديك كائن user مع خاصية profile متداخلة. أنشئ نسخة محدثة تغيّر profile.city ومصفوفة جديدة تضيف عنصرًا واحدًا، ثم تحقق من بقاء القيم الأصلية.',
    'Given a user object with a nested profile property, make an updated copy that changes profile.city and a new array that adds one item, then verify the originals remain unchanged.',
    q('هل const يمنع تغيير خاصية داخل كائن؟', 'Does const prevent changing a property inside an object?', ['لا؛ يمنع إعادة إسناد الاسم ولا يجمد المحتوى', 'نعم؛ يجعل الكائن غير قابل للتغيير بالكامل', 'نعم، لكنه يسمح بتغيير المصفوفات فقط', 'يعني أن كل الخصائص نصوص'], ['No; it prevents reassignment of the name but does not freeze the contents', 'Yes; it makes the object completely immutable', 'Yes, but allows arrays to change only', 'It means every property is a string'], 0,
      'صحيح: const يثبت الرابط؛ لا يجعل محتوى الكائن غير قابل للتغيير.', 'Correct: const fixes the binding; it does not make an object’s contents immutable.',
      'لمنع تغيير المصدر، أنشئ نسخة مناسبة ولا تفترض أن const تكفي.', 'To avoid changing the source, create an appropriate copy rather than relying on const alone.',
      'التحديث بالنسخ مفيد عندما تتشارك أجزاء البرنامج البيانات.', 'Copy-based updates help when parts of a program share data.')),
  existing('js-string-number-methods', 28, 'طرائق النصوص والأعداد', 'String and Number Methods',
    'استخدم طرائق نصية شائعة مثل trim، وتعرّف على فحص عددي مثل Number.isInteger.',
    'Use common string methods such as trim, and recognize a numeric check such as Number.isInteger.',
    ['تذكر الأقواس عند استدعاء الطريقة، وخزّن القيمة الجديدة التي تعيدها trim.', 'Number.isInteger يفحص العدد ولا يحول نصًا رقميًا إلى عدد.'],
    ['Remember parentheses when calling a method, and store the new value returned by trim.', 'Number.isInteger checks a number; it does not convert numeric text into a number.']),
  added(29, 'dates-and-time', 'التعامل مع التاريخ والوقت', 'Working with Dates and Time',
    'أنشئ قيم Date، واقرأ أجزاء تاريخ، وقارن قيم الوقت مع الانتباه إلى المناطق الزمنية وتنسيق العرض.',
    'Create Date values, read date parts, and compare times while accounting for time zones and display formatting.',
    ['أشهر JavaScript تبدأ من 0 عند استخدام مُنشئ متعدد الوسائط.', 'التاريخ المحلي وUTC قد يعرضان يومًا مختلفًا قرب منتصف الليل.'],
    ['JavaScript months start at 0 when using the multi-argument constructor.', 'Local time and UTC can show different calendar days near midnight.'],
    [
      { titleAr: 'أنشئ واقرأ Date', titleEn: 'Create and read a Date', bodyAr: 'يمثل كائن `Date` لحظة زمنية. `new Date()` ينشئ اللحظة الحالية، ويمكن استخدام طرائق مثل `getFullYear()` و`getMonth()` و`getDate()` لقراءة مكونات الوقت المحلي. في المُنشئ ذي الأرقام، يبدأ الشهر من صفر؛ لذا يناير هو 0.', bodyEn: 'A `Date` object represents a point in time. `new Date()` creates the current moment, and methods such as `getFullYear()`, `getMonth()`, and `getDate()` read local-time parts. In the numeric constructor, months start at zero, so January is 0.', examples: [
        { code: 'const now = new Date();\nconsole.log(now.getFullYear());', explanationAr: 'ينشئ لحظة حالية ثم يقرأ سنة التقويم المحلي.', explanationEn: 'It creates the current moment and reads the local calendar year.' },
        { code: 'const launch = new Date(2025, 0, 15);\nconsole.log(launch.getMonth());', explanationAr: 'الموضع 0 يعني يناير في المُنشئ العددي، لا الشهر الأول بترقيم 1.', explanationEn: 'Position 0 means January in the numeric constructor, not month one numbered 1.' },
      ]},
      { titleAr: 'قارن اللحظات واعرضها بوضوح', titleEn: 'Compare moments and display them clearly', bodyAr: 'يمكن مقارنة كائنات Date أو قيم `getTime()` بالأعداد، لكن تنسيق العرض المحلي يعتمد على إعدادات الجهاز. عند تبادل التواريخ مع خدمة أو مستخدمين في مناطق مختلفة، حدّد هل البيانات تمثل UTC أم وقتًا محليًا، ولا تفترض أن النص المعروض يكشف المنطقة الزمنية.', bodyEn: 'Date objects or their `getTime()` numbers can be compared, but local display formatting depends on device settings. When exchanging dates with a service or users in different regions, specify whether data represents UTC or local time; do not assume displayed text reveals its time zone.', examples: [
        { code: 'const start = new Date("2025-01-01T00:00:00Z");\nconst later = new Date("2025-01-02T00:00:00Z");\nconsole.log(later > start);', explanationAr: 'تقارن العلامة اللحظتين زمنيا؛ وجود Z يعني أن وقت النص UTC.', explanationEn: 'The comparison checks the moments in time; Z indicates the text is in UTC.' },
        { code: 'const meeting = new Date();\nconsole.log(meeting.toLocaleDateString());', explanationAr: 'تعرض التاريخ حسب إعدادات اللغة والمنطقة في بيئة المتصفح.', explanationEn: 'Displays the date according to locale settings in the browser environment.' },
      ]},
    ],
    'أنشئ تاريخًا ثابتًا، واقرأ سنته وشهره مع الانتباه إلى ترقيم الأشهر، ثم قارن لحظتين UTC واشرح لماذا قد يختلف عرض الوقت محليًا.',
    'Create a fixed date, read its year and month while accounting for month numbering, then compare two UTC moments and explain why local display may differ.',
    q('ما رقم يناير في مُنشئ Date الذي يستقبل سنة وشهرًا ويومًا؟', 'What month number represents January in the Date constructor that takes year, month, and day?', ['0', '1', '12', '-1'], ['0', '1', '12', '-1'], 0,
      'صحيح: ترقيم الأشهر في ذلك المُنشئ يبدأ من صفر.', 'Correct: month numbering in that constructor starts at zero.',
      'تذكر أن الترقيم هنا يختلف عن أسماء الأشهر المعتادة للبشر.', 'Remember that numbering here differs from the usual human month numbering.',
      'اختبر تاريخًا معروفًا واستخدم طرائق التنسيق بدل بناء النص يدويًا.', 'Test a known date and use formatting methods instead of assembling text by hand.')),
  added(30, 'regular-expressions', 'بحث نصي بسيط بالتعابير النمطية', 'Simple Text Search with Regular Expressions',
    'استخدم تعبيرًا نمطيًا بسيطًا مع test للبحث عن نمط نصي، من دون اعتباره تحققًا شاملًا من البيانات.',
    'Use a simple regular expression with test to look for a text pattern without treating it as complete data validation.',
    ['التعبير النمطي البسيط لا يثبت صلاحية بريد أو رقم لكل الحالات.', 'انتبه إلى الأحرف الخاصة مثل النقطة؛ فهي قد تعني أي حرف.'],
    ['A simple regular expression does not prove an email or number is valid in every case.', 'Pay attention to special characters such as a dot, which may mean any character.'],
    [
      { titleAr: 'ابحث عن نمط قصير', titleEn: 'Look for a short pattern', bodyAr: 'التعبير النمطي يصف نمطًا نصيًا. أنشئه بين شرطتين مائلتين، ثم استخدم `test(text)` لنتيجة منطقية. ابدأ بنمط واضح مثل وجود أرقام؛ لا تكتب نمطًا معقدًا قبل تحديد المطلوب وأمثلة القبول والرفض.', bodyEn: 'A regular expression describes a text pattern. Write it between slashes, then use `test(text)` for a Boolean result. Start with a clear pattern such as the presence of digits; do not write a complex pattern before defining the requirement and accepted/rejected examples.', examples: [
        { code: 'const hasDigit = /\\d/.test("Room 4");\nconsole.log(hasDigit);', explanationAr: 'تبحث \\d عن رقم واحد على الأقل، لذلك تكون النتيجة true.', explanationEn: '\\d looks for at least one digit, so the result is true.' },
        { code: 'const startsWithA = /^A/.test("Ari");\nconsole.log(startsWithA);', explanationAr: 'يشير ^ إلى بداية النص، فيفحص الحرف الأول.', explanationEn: '^ marks the start of the text, so the first character is checked.' },
      ]},
      { titleAr: 'اجعل حدود التحقق واضحة', titleEn: 'Make validation limits clear', bodyAr: 'قد يُطابق التعبير النمطي جزءًا من النص لا النص كله. استخدم `^` و`$` إذا كان المطلوب مطابقة النص كاملًا، واختبر حالات فارغة وحدودًا متوقعة. لا تعتمد على تعبير من درس تمهيدي للتحقق الأمني أو لقبول بيانات حقيقية من دون مراجعة.', bodyEn: 'A regular expression may match only part of a string, not the whole string. Use `^` and `$` when the entire text must match, and test empty and boundary cases. Do not rely on a beginner regex for security validation or accepting real data without review.', examples: [
        { code: 'const isTwoDigits = /^\\d{2}$/.test("42");', explanationAr: 'تطلب البداية والنهاية ورقمين بالضبط؛ فلا يكفي العثور على رقم داخل نص أطول.', explanationEn: 'Anchors and the quantifier require exactly two digits, rather than finding a digit in longer text.' },
        { code: 'const hasNoSpaces = /^\\S+$/.test("blue");', explanationAr: 'تبحث عن نص كامل مكوّن من محرف واحد أو أكثر لا يكون مسافة بيضاء.', explanationEn: 'It checks that the whole string contains one or more non-whitespace characters.' },
      ]},
    ],
    'اكتب فحصًا بسيطًا يقبل سلسلة من رقمين بالضبط، واختبر "07" و"7" و"a7" و"123". اذكر أن هذا مثال تعليمي لا بديل عن تحقق موثوق.',
    'Write a simple check that accepts exactly two digits, and test "07", "7", "a7", and "123". State that this is a learning example, not a substitute for robust validation.',
    q('ماذا يعني ^ في بداية تعبير نمطي؟', 'What does ^ mean at the start of a regular expression?', ['بداية النص', 'نهاية النص', 'أي رقم', 'مسافة مطلوبة'], ['The start of the text', 'The end of the text', 'Any digit', 'A required space'], 0,
      'صحيح: ^ يثبت المطابقة عند بداية النص.', 'Correct: ^ anchors a match at the beginning of the text.',
      'علامة نهاية النص هي $؛ راجع موضع كل علامة.', 'The end-of-text anchor is $; review where each marker appears.',
      'استخدم مرساة البداية والنهاية عندما يجب أن يطابق النمط النص كله.', 'Use start and end anchors when the entire string must match.')),
  existing('js-dom-basics', 31, 'اختيار عناصر DOM وتحديث نصها بأمان', 'Selecting DOM Elements and Safely Updating Text',
    'استخدم document.querySelector لاختيار عنصر موجود، ثم حدّث نصه بأمان باستخدام textContent.',
    'Use document.querySelector to select an existing element, then safely update its text with textContent.',
    ['قد يعيد querySelector القيمة null إذا لم يوجد تطابق؛ افحص النتيجة.', 'استخدم textContent للنص العادي ولا تعامل محتوى المستخدم كـ HTML.'],
    ['querySelector may return null if there is no match; check the result.', 'Use textContent for plain text and do not treat user content as HTML.']),
  added(32, 'dom-traversal', 'التنقل بين عناصر DOM', 'Moving Between DOM Elements',
    'استخدم علاقات الأبناء والآباء والأشقاء لاكتشاف عناصر مرتبطة بعنصر معروف بدل البحث العام في الصفحة.',
    'Use parent, child, and sibling relationships to find elements related to a known element instead of searching the whole page.',
    ['children مجموعة HTMLCollection حيّة لا مصفوفة عادية.', 'لا تفترض أن العنصر التالي هو عنصر HTML؛ قد يكون عقدة نصية.'],
    ['children is a live HTMLCollection, not a normal array.', 'Do not assume the next sibling is an HTML element; it may be a text node.'],
    [
      { titleAr: 'انتقل من عنصر معروف إلى أبنائه', titleEn: 'Move from a known element to its children', bodyAr: 'بعد اختيار حاوية، يمكنك قراءة `children` للحصول على أبنائها من عناصر HTML أو استخدام `firstElementChild` للوصول إلى أول عنصر ابن. افحص وجود الحاوية والابن قبل التعامل معه. فضّل محددًا واضحًا عندما يكون البحث النسبي غير ضروري.', bodyEn: 'After selecting a container, read `children` to access its HTML element children or use `firstElementChild` for the first child element. Check that the container and child exist before using them. Prefer a clear selector when relative traversal is unnecessary.', examples: [
        { code: 'const list = document.querySelector("#items");\nif (list) {\n  console.log(list.children.length);\n}', explanationAr: 'يفحص عدد أبناء العنصر من نوع HTML بعد التأكد من وجود الحاوية.', explanationEn: 'It checks the number of HTML element children after confirming the container exists.' },
        { code: 'const card = document.querySelector(".card");\nconst heading = card?.firstElementChild;\nif (heading) console.log(heading.textContent);', explanationAr: 'يصل إلى أول عنصر ابن ويتحقق من وجوده قبل قراءة النص.', explanationEn: 'It reaches the first element child and checks it exists before reading its text.' },
      ]},
      { titleAr: 'ميّز عقد العناصر من العقد النصية', titleEn: 'Distinguish element nodes from text nodes', bodyAr: '`nextSibling` و`previousSibling` قد يعيدان عقدة مسافة بيضاء بين الوسوم. إذا كان هدفك عنصر HTML التالي، استخدم `nextElementSibling` أو `previousElementSibling`. لا تعتمد على ترتيب عرضي يتغير عندما يعدّل HTML؛ اجعل العلاقة الدلالية واضحة.', bodyEn: '`nextSibling` and `previousSibling` may return whitespace text nodes between tags. If you need the next HTML element, use `nextElementSibling` or `previousElementSibling`. Do not rely on accidental order that changes when HTML is edited; keep the semantic relationship clear.', examples: [
        { code: 'const firstItem = document.querySelector(".item");\nconst nextItem = firstItem?.nextElementSibling;\nconsole.log(nextItem?.textContent);', explanationAr: 'يتخطى إلى شقيق العنصر التالي بدل عقدة المسافة النصية.', explanationEn: 'It moves to the next element sibling instead of a whitespace text node.' },
        { code: 'const panel = document.querySelector("#panel");\nconst parent = panel?.parentElement;\nconsole.log(parent?.tagName);', explanationAr: 'يقرأ عنصر الأب إذا كان panel موجودًا وله أب.', explanationEn: 'It reads the parent element if panel exists and has a parent.' },
      ]},
    ],
    'اكتب مقطعًا يختار قائمة موجودة، ويتحقق من وجود أول عنصر ابن، ثم يقرأ نصه. اختبر الحاوية وهي فارغة أيضًا.',
    'Write a snippet that selects an existing list, checks whether it has a first element child, then reads its text. Also test an empty container.',
    q('ما الخاصية المناسبة للوصول إلى أول ابن من نوع عنصر HTML؟', 'Which property is appropriate for the first child that is an HTML element?', ['firstElementChild', 'firstSiblingText', 'children["first"]', 'querySelectorAll("parent")'], ['firstElementChild', 'firstSiblingText', 'children["first"]', 'querySelectorAll("parent")'], 0,
      'صحيح: firstElementChild يتجاهل عقد النص والمسافات ويعيد أول عنصر ابن.', 'Correct: firstElementChild skips text and whitespace nodes and returns the first child element.',
      'استخدم خاصية العناصر عندما تريد عنصر HTML لا أي عقدة DOM.', 'Use an element-specific property when you need an HTML element rather than any DOM node.',
      'تحقق من null قبل الوصول إلى خصائص الابن.', 'Check for null before accessing child properties.')),
  existing('js-events', 33, 'الأحداث ومستمعو الأحداث', 'Events and Event Listeners',
    'اربط مستمعًا بحدث عبر addEventListener، ومرر callback تعمل عند وقوعه.',
    'Connect a listener to an event with addEventListener, passing a callback that runs when it occurs.',
    ['مرر اسم الحدث مثل click من دون بادئة on.', 'لا تستدعِ callback أثناء تسجيل المستمع؛ مرر دالة لتعمل لاحقًا.'],
    ['Pass an event name such as click without the on prefix.', 'Do not invoke the callback while registering the listener; pass a function to run later.']),
  added(34, 'event-delegation', 'تفويض الأحداث إلى حاوية', 'Delegating Events to a Container',
    'عالج أحداث عناصر متعددة من مستمع واحد على حاوية مشتركة، واستخدم target أو closest لتحديد العنصر المقصود.',
    'Handle events from many items with one listener on a shared container, using target or closest to identify the intended element.',
    ['قد يكون event.target عنصرًا داخليًا داخل الزر؛ استخدم closest عند الحاجة.', 'تأكد من أن العنصر المكتشف ينتمي إلى الحاوية قبل التصرف.'],
    ['event.target may be a nested element inside the button; use closest when needed.', 'Ensure the discovered element belongs to the container before acting.'],
    [
      { titleAr: 'استمع على الحاوية المشتركة', titleEn: 'Listen on the shared container', bodyAr: 'في تفويض الأحداث، تسجل مستمعًا على حاوية ثابتة بدل إنشاء مستمع لكل زر متكرر. تنتقل أحداث كثيرة من الهدف إلى آبائه (bubbling)، فيمكن للحاوية استقبالها. يفيد هذا عند إضافة عناصر جديدة لاحقًا، لكنه لا يناسب كل أنواع الأحداث.', bodyEn: 'With event delegation, you register a listener on a stable container instead of one for every repeated button. Many events bubble from the target to its ancestors, allowing the container to receive them. This helps when items are added later, but it does not suit every event type.', examples: [
        { code: 'const list = document.querySelector("#tasks");\nlist?.addEventListener("click", (event) => {\n  console.log(event.target);\n});', explanationAr: 'يستقبل المستمع على القائمة أحداث النقر الصاعدة من أبنائها.', explanationEn: 'The listener on the list receives bubbling click events from its children.' },
        { code: 'const menu = document.querySelector("#menu");\nmenu?.addEventListener("click", (event) => {\n  const button = event.target.closest("button[data-action]");\n  if (button && menu.contains(button)) console.log(button.dataset.action);\n});', explanationAr: 'يبحث عن أقرب زر ذي إجراء ويتأكد أنه داخل القائمة نفسها.', explanationEn: 'It finds the closest action button and confirms that it belongs to the menu.' },
      ]},
      { titleAr: 'استهدف العنصر الصحيح بأمان', titleEn: 'Target the intended element safely', bodyAr: 'قد يكون `event.target` أي عنصر داخلي ضغطه المستخدم، مثل رمز داخل زر. استخدم `closest` للعثور على الزر الأقرب، وافحص النتيجة قبل قراءة خصائصها. إذا احتجت إلى إيقاف انتقال الحدث لسبب واجهة واضح، افعل ذلك بحذر ولا تعطل سلوك عناصر التحكم المتوقع.', bodyEn: '`event.target` may be any nested element the user clicked, such as an icon inside a button. Use `closest` to find the nearest button and check the result before reading properties. If you need to stop propagation for a clear interface reason, do so carefully and do not disrupt expected control behavior.', examples: [
        { code: 'const actions = document.querySelector("#actions");\nactions?.addEventListener("click", (event) => {\n  const action = event.target.closest("[data-action]");\n  if (action) console.log(action.dataset.action);\n});', explanationAr: 'تعالج أي عنصر داخل العنصر ذي data-action على أنه جزء من الإجراء نفسه.', explanationEn: 'It treats clicks on descendants of a data-action element as part of that action.' },
        { code: 'const list = document.querySelector("#tasks");\nlist?.addEventListener("click", (event) => {\n  const removeButton = event.target.closest("button.remove");\n  if (removeButton && list.contains(removeButton)) removeButton.disabled = true;\n});', explanationAr: 'يمنع التعامل مع زر لا يتبع القائمة، ثم يعطل الزر المقصود بعد التحقق.', explanationEn: 'It avoids handling a button outside the list, then disables the intended button after checking.' },
      ]},
    ],
    'أضف مستمع click واحدًا إلى قائمة مهام، وابحث عبر closest عن أقرب زر يحمل data-action. اختبر النقر على نص الزر وعنصر داخلي فيه.',
    'Add one click listener to a task list and use closest to find the nearest button with data-action. Test clicking the button text and an element nested inside it.',
    q('ما فائدة تفويض الأحداث؟', 'What is a benefit of event delegation?', ['معالجة أحداث عناصر كثيرة من مستمع على حاوية مشتركة', 'منع كل الأحداث من الوصول إلى الصفحة', 'استبدال HTML بالكامل', 'إضافة مستمع خاص لكل عنصر تلقائيًا'], ['Handle events from many items with a listener on a shared container', 'Prevent all events from reaching the page', 'Replace all HTML', 'Automatically add a separate listener to every item'], 0,
      'صحيح: تستقبل الحاوية الأحداث الصاعدة من أبنائها وتحدد الهدف المناسب.', 'Correct: the container receives bubbling events from children and identifies the right target.',
      'تفويض الأحداث يقلل التسجيلات المتكررة، لكنه لا يلغي الحاجة لفحص الهدف.', 'Delegation reduces repeated registrations, but you still need to check the target.',
      'تأكد من أن العنصر الذي وجدته يتبع الحاوية التي تستمع إليها.', 'Make sure the element you found belongs to the container that is listening.')),
  existing('js-dom-manipulation', 35, 'إنشاء عناصر DOM وتعديلها', 'Creating and Manipulating DOM Elements',
    'اختر عنصرًا موجودًا، أنشئ عنصرًا جديدًا باستخدام document.createElement، ثم أضفه إلى الصفحة.',
    'Select an existing element, create a new element with document.createElement, then append it to the page.',
    ['إنشاء العقدة لا يضيفها إلى الصفحة حتى تُلحق بحاوية.', 'أضف العقدة نفسها التي أنشأتها وتحقق من وجود الحاوية.'],
    ['Creating a node does not add it to the page until you append it to a container.', 'Append the same node you created and check that the container exists.']),
  added(36, 'safe-dom-rendering', 'عرض البيانات كنص آمن', 'Displaying Data as Safe Text',
    'اعرض المدخلات والبيانات الخارجية باستخدام textContent، وافهم مخاطر تفسير النص غير الموثوق على أنه HTML.',
    'Display input and external data with textContent, and understand the risks of interpreting untrusted text as HTML.',
    ['لا تستخدم innerHTML لتركيب نص قد يكون مصدره مستخدمًا أو شبكة.', 'الترميز أو التنقية يحتاجان سياسة مناسبة؛ الأفضل للنص العادي هو textContent.'],
    ['Do not use innerHTML to insert text that may come from a user or network.', 'Encoding or sanitizing requires an appropriate policy; for plain text, textContent is safer.'],
    [
      { titleAr: 'اعرض النص كنص لا كتعليمات HTML', titleEn: 'Display text as text, not as HTML instructions', bodyAr: '`textContent` يضع الأحرف داخل عنصر كنص عادي، فلا يفسر وسوم HTML الموجودة في مدخل المستخدم. تجنب إدراج بيانات غير موثوقة باستخدام `innerHTML` لأن المتصفح قد يعاملها كترميز وينفذ محتوى ضارًا. هذا احتياط أساسي حتى في أمثلة التعلم.', bodyEn: '`textContent` places characters in an element as plain text, so HTML-looking input is not interpreted as markup. Avoid inserting untrusted data with `innerHTML` because the browser may treat it as markup and execute harmful content. This is a basic precaution even in learning examples.', examples: [
        { code: 'const output = document.querySelector("#output");\nconst userText = "<img src=x onerror=alert(1)>";\nif (output) output.textContent = userText;', explanationAr: 'يظهر المدخل كسلسلة حرفية بدل إنشاء عنصر صورة أو تنفيذ معالج.', explanationEn: 'The input appears as literal text instead of creating an image element or running a handler.' },
        { code: 'const item = document.createElement("li");\nitem.textContent = "Read the guide";\ndocument.querySelector("#list")?.appendChild(item);', explanationAr: 'يبني عنصرًا ثم يضع عنوانًا عاديًا آمنًا فيه قبل الإلحاق.', explanationEn: 'It creates an element, inserts a plain safe label, then appends it.' },
      ]},
      { titleAr: 'أضف سلوكًا دون تنفيذ محتوى المستخدم', titleEn: 'Add behavior without executing user content', bodyAr: 'إذا احتجت إلى تنسيق نص، أنشئ عناصر DOM موثوقة بـ `createElement` وأدرج النص بـ `textContent` بدل دمج النص في سلسلة HTML. لا تجعل رسالة واجهة تكشف تفاصيل تقنية حساسة. وإذا تطلب المشروع HTML غنيًا من مصدر غير موثوق، فهذه حالة تحتاج مكتبة تنقية موثوقة ومراجعة أمنية، وليست هدف هذا الدرس.', bodyEn: 'If you need formatted text, create trusted DOM elements with `createElement` and insert text with `textContent` instead of concatenating it into an HTML string. Do not expose sensitive technical details in a user-facing message. If a project needs rich HTML from an untrusted source, it requires a trusted sanitization library and security review, beyond this lesson.', examples: [
        { code: 'const strong = document.createElement("strong");\nstrong.textContent = "Important";\ndocument.querySelector("#notice")?.appendChild(strong);', explanationAr: 'يُنشأ عنصر التنسيق من الشيفرة الموثوقة ويُدرج النص بطريقة آمنة.', explanationEn: 'The formatting element is created from trusted code and the text is inserted safely.' },
        { code: 'const message = document.querySelector("#status");\nif (message) message.textContent = "Your changes were saved.";', explanationAr: 'تعرض رسالة حالة مفهومة دون إدراج HTML غير موثوق.', explanationEn: 'It displays an understandable status message without inserting untrusted HTML.' },
      ]},
    ],
    'أنشئ فقرة عرض، واجعل نصها مساويًا لمدخل تجريبي يحتوي أحرفًا مثل < و>. تحقق أن المتصفح يعرض الأحرف ولا ينشئ عنصرًا منها، واكتب سبب تفضيل textContent.',
    'Create a display paragraph and set its text to sample input containing characters such as < and >. Confirm the browser displays the characters rather than creating an element, and explain why textContent is preferred.',
    q('ما الخيار الأكثر أمانًا لعرض نص عادي مصدره المستخدم؟', 'What is the safer choice for displaying plain user-provided text?', ['textContent', 'innerHTML مع دمج النص مباشرة', 'eval', 'وضع النص في تعليق JavaScript'], ['textContent', 'innerHTML with direct string concatenation', 'eval', 'Putting the text in a JavaScript comment'], 0,
      'صحيح: textContent يعرض قيمة النص من دون تفسيرها كترميز HTML.', 'Correct: textContent displays the value without interpreting it as HTML markup.',
      'تفسير إدخال غير موثوق كـ HTML قد ينفذ محتوى ضارًا؛ تجنب ذلك.', 'Interpreting untrusted input as HTML can run harmful content; avoid it.',
      'أنشئ العناصر بنفسك وأدرج محتوى المستخدم كنص عادي.', 'Create elements yourself and insert user content as plain text.')),
  existing('js-form-interactions', 37, 'النماذج والأحداث والتحقق', 'Forms, Events, and Validation',
    'اربط مستمع submit بنموذج واعرض رسالة نصية آمنة من داخل callback.',
    'Attach a submit listener to a form and display a safe text message from its callback.',
    ['اربط مستمع submit بالنموذج لا بزر الإرسال فقط.', 'استخدم trim لكشف الحقل الفارغ واكتب رسالة واضحة للمستخدم.'],
    ['Attach the submit listener to the form, not only to its submit button.', 'Use trim to detect an empty field and provide a clear message to the user.']),
  added(38, 'accessible-interaction-state', 'حالات تفاعل واضحة وسهلة الوصول', 'Clear and Accessible Interaction States',
    'اجعل نتيجة الإجراء مفهومة بلوحة المفاتيح وقارئات الشاشة، مع حالة نصية واضحة وعدم الاعتماد على اللون وحده.',
    'Make an action’s outcome understandable to keyboard and screen-reader users, with clear text and without relying on color alone.',
    ['لا تستخدم اللون وحده لبيان الخطأ أو النجاح.', 'لا تغيّر التركيز تلقائيًا إلى عنصر غير متوقع؛ اجعل التسلسل مفهومًا.'],
    ['Do not use color alone to communicate an error or success.', 'Do not move focus unexpectedly; keep the interaction order understandable.'],
    [
      { titleAr: 'أعلن الحالة برسالة نصية', titleEn: 'Communicate state with text', bodyAr: 'بعد إجراء مثل حفظ أو إرسال، قد لا يلاحظ المستخدم التغيير البصري وحده. وفر رسالة قصيرة في موضع ثابت، واكتب في HTML عنصرًا مناسبًا مثل `role="status"` للتحديثات غير العاجلة. استخدم `role="alert"` للأخطاء العاجلة فقط وباعتدال؛ لا تكرر إعلان الرسالة بلا داعٍ.', bodyEn: 'After an action such as saving or submitting, a user may not notice a visual change alone. Provide a short message in a stable location, and use an appropriate HTML element such as `role="status"` for non-urgent updates. Reserve `role="alert"` for urgent errors and use it sparingly; do not announce the same message repeatedly.', examples: [
        { code: '<p id="save-status" role="status"></p>\n<script>\n  const status = document.querySelector("#save-status");\n  if (status) status.textContent = "Changes saved.";\n</script>', explanationAr: 'توفر role=status منطقة لإعلان تحديث غير عاجل، وتوضع الرسالة كنص آمن.', explanationEn: 'role=status provides a region for announcing a non-urgent update, and the message is inserted as safe text.' },
        { code: '<p id="error-message" role="alert">Check the highlighted field.</p>', explanationAr: 'يعرض نصًا يشرح المشكلة بدل الاعتماد على لون الحقل وحده.', explanationEn: 'It provides text explaining the problem instead of relying only on a field color.' },
      ]},
      { titleAr: 'حافظ على لوحة المفاتيح والتركيز', titleEn: 'Preserve keyboard access and focus', bodyAr: 'يجب أن يكون كل إجراء تفاعلي قابلًا للاستخدام بلوحة المفاتيح؛ استخدم أزرار HTML الأصلية بدل عناصر غير تفاعلية عليها click فقط. بعد التحقق من النموذج، اجعل رسالة الخطأ مرتبطة بالحقل عند الحاجة، ولا تنقل التركيز بطريقة تفاجئ المستخدم. اختبر Tab وEnter وSpace يدويًا.', bodyEn: 'Every interactive action should be usable with a keyboard; use native HTML buttons rather than non-interactive elements with click alone. After form validation, associate an error message with its field when appropriate, and do not move focus in a way that surprises users. Test Tab, Enter, and Space manually.', examples: [
        { code: '<button type="button" id="toggle-help">Show help</button>\n<p id="help" hidden>Enter a short title.</p>', explanationAr: 'زر HTML أصلي قابل للتشغيل بلوحة المفاتيح، ويعبر hidden عن حالة المحتوى.', explanationEn: 'A native HTML button is keyboard-operable, and hidden communicates the content state.' },
        { code: 'const help = document.querySelector("#help");\nconst button = document.querySelector("#toggle-help");\nbutton?.addEventListener("click", () => {\n  if (help) help.hidden = !help.hidden;\n});', explanationAr: 'يقلب إظهار التعليمات؛ يجب أيضًا اختبار الحالة المرئية والقراءة المساعدة في الصفحة.', explanationEn: 'It toggles the help; the visible state and assistive reading should also be tested in the page.' },
      ]},
    ],
    'صمم زر إظهار مساعدة ورسالة حالة عند النقر. استخدم عنصر button أصليًا ونصًا يشرح الحالة، واختبر التفاعل بلوحة المفاتيح؛ لا تعتمد على اللون وحده.',
    'Design a help-toggle button and a status message on click. Use a native button and text that explains the state, then test with a keyboard; do not rely on color alone.',
    q('ما أفضل طريقة لإبلاغ المستخدم بنجاح عملية حفظ؟', 'What is a good way to tell a user that saving succeeded?', ['رسالة نصية واضحة يمكن للتقنيات المساعدة اكتشافها', 'تغيير اللون وحده', 'صوت بلا بديل نصي', 'إخفاء الزر دون تفسير'], ['A clear text message that assistive technologies can detect', 'A color change alone', 'A sound with no text alternative', 'Hiding the button without explanation'], 0,
      'صحيح: الرسالة النصية والحالة المناسبة تجعل التحديث أوضح لمستخدمين أكثر.', 'Correct: text and an appropriate status make the update clearer to more users.',
      'التغيير المرئي وحده أو الصوت وحده قد لا يصل إلى كل المستخدمين.', 'A visual-only or audio-only change may not reach every user.',
      'اجمع بين معنى نصي واضح وسلوك لوحة مفاتيح متوقع.', 'Combine clear text meaning with predictable keyboard behavior.')),
  existing('js-json', 39, 'JSON: تحويل البيانات', 'JSON: Converting Data',
    'حوّل كائن JavaScript إلى نص JSON باستخدام stringify، وأعد تحليل نص JSON صالح باستخدام parse.',
    'Convert a JavaScript object to JSON text with stringify, and parse valid JSON text with parse.',
    ['stringify ينتج نصًا، بينما parse يقرأ نص JSON ويعيد قيمة.', 'قد يفشل parse إذا كان النص غير صالح؛ عالج ذلك عند الحاجة.'],
    ['stringify produces text, while parse reads JSON text and returns a value.', 'parse can fail if the text is invalid; handle that when needed.']),
  added(40, 'url-search-params', 'قراءة معاملات عنوان URL', 'Reading URL Query Parameters',
    'استخدم URL وURLSearchParams لقراءة قيم الاستعلام وترميزها بدل تركيب أجزاء العنوان يدويًا.',
    'Use URL and URLSearchParams to read and encode query values instead of manually assembling URL fragments.',
    ['قد تكون المعلمة غائبة أو فارغة؛ افحص القيمة قبل اعتمادها.', 'لا تضع أسرارًا في عنوان URL لأنه قد يظهر في السجل أو السجلات الوسيطة.'],
    ['A parameter may be missing or empty; check the value before relying on it.', 'Do not put secrets in a URL because it may appear in history or intermediary logs.'],
    [
      { titleAr: 'اقرأ قيمة من عنوان الصفحة', titleEn: 'Read a value from the page URL', bodyAr: 'تحتوي query string على بيانات مثل `?page=2`. استخدم كائن URL لتحليل العنوان و`searchParams.get` لقراءة قيمة؛ وقد يعيد null عند غياب المفتاح. لا تفترض صحة القيمة لمجرد وجودها في العنوان.', bodyEn: 'A query string contains data such as `?page=2`. Use URL to parse an address and `searchParams.get` to read a value; it may return null when the key is missing. Do not assume a value is valid just because it is in the URL.', examples: [
        { code: 'const url = new URL("https://example.com/?page=2");\nconst page = url.searchParams.get("page");\nconsole.log(page);', explanationAr: 'تُقرأ قيمة page كنص، لذا يلزم تحويلها والتحقق منها قبل الحساب.', explanationEn: 'The page value is read as text, so convert and validate it before arithmetic.' },
        { code: 'const url = new URL("https://example.com/?q=blue");\nconst query = url.searchParams.get("q") ?? "";', explanationAr: 'تستخدم قيمة افتراضية عند غياب المفتاح، مع إبقاء معنى النص الوارد واضحًا.', explanationEn: 'It uses a fallback when the key is missing while keeping the meaning of the supplied text clear.' },
      ]},
      { titleAr: 'أنشئ معاملات بطريقة مرمّزة', titleEn: 'Build encoded parameters', bodyAr: 'استخدم `searchParams.set` لتعيين المعامل، ثم حقل `url.href` للحصول على العنوان النهائي. تتولى الواجهة ترميز المسافات والمحارف الخاصة. لا تضع كلمات مرور أو رموز وصول في query string؛ فالعناوين قد تحفظ في السجل أو تُرسل في سجلات الخادم.', bodyEn: 'Use `searchParams.set` to set a parameter, then `url.href` to obtain the final address. The API handles encoding spaces and special characters. Do not put passwords or access tokens in a query string; URLs may be saved in history or server logs.', examples: [
        { code: 'const url = new URL("https://example.com/search");\nurl.searchParams.set("q", "blue sky");\nconsole.log(url.href);', explanationAr: 'تُرمّز القيمة عند إعداد العنوان بدل وصل النص الخام يدويًا.', explanationEn: 'The value is encoded when building the address rather than concatenated as raw text.' },
        { code: 'const url = new URL("https://example.com/items");\nurl.searchParams.set("page", "3");\nurl.searchParams.set("sort", "newest");', explanationAr: 'تضيف معاملات مستقلة بطريقة مقروءة وقابلة للترميز.', explanationEn: 'It adds independent parameters in a readable, encoded way.' },
      ]},
    ],
    'حلل عنوانًا تجريبيًا فيه q وpage، وتحقق من وجود page قبل تحويله إلى عدد. أنشئ بعدها عنوان بحث جديدًا بعبارة تحتوي مسافة، ولا تضع أي سر في العنوان.',
    'Parse a sample URL containing q and page, checking page exists before converting it to a number. Then build a new search URL with a phrase containing a space; do not put any secret in the URL.',
    q('ما نوع القيمة التي يعيدها searchParams.get عادةً عند وجود المفتاح؟', 'What type of value does searchParams.get usually return when the key exists?', ['نص', 'عدد مضمون', 'عنصر DOM', 'Promise'], ['A string', 'A guaranteed number', 'A DOM element', 'A Promise'], 0,
      'صحيح: معاملات URL تُقرأ كنصوص، وقد تحتاج تحويلًا وفحصًا.', 'Correct: URL parameters are read as strings and may need conversion and validation.',
      'وجود أحرف رقمية في النص لا يجعله عددًا تلقائيًا.', 'Digits in a string do not make it a number automatically.',
      'افحص القيمة وغيابها ثم حوّلها صراحةً عند الحاجة.', 'Check the value and its absence, then convert explicitly when needed.')),
  existing('js-local-storage', 41, 'التخزين المحلي في المتصفح', 'Browser Local Storage',
    'استخدم localStorage.setItem وgetItem لحفظ واسترجاع قيم نصية في المتصفح، وتعرّف إلى أن القيم المخزنة نصوص.',
    'Use localStorage.setItem and getItem to save and retrieve string values in the browser, and recognize that stored values are strings.',
    ['القيمة المسترجعة نص أو null، وليست كائنًا تلقائيًا.', 'لا تحفظ بيانات حساسة في localStorage؛ فالبرامج التي تعمل على الصفحة قد تصل إليها.'],
    ['A retrieved value is a string or null, not automatically an object.', 'Do not store sensitive data in localStorage; scripts running on the page may access it.']),
  added(42, 'storage-privacy-limits', 'خصوصية التخزين وحدوده', 'Storage Privacy and Limitations',
    'اختر بيانات غير حساسة للتخزين المحلي، ووفّر حذفًا واضحًا وتعاملًا مع فشل التخزين أو تغير الجهاز والمتصفح.',
    'Choose non-sensitive data for local storage, provide a clear way to remove it, and account for storage failures or changes in browser/device.',
    ['وجود البيانات في localStorage لا يعني أنها سرية أو مشفرة.', 'قد لا يتوفر التخزين أو قد يرمي خطأ؛ لا تجعل التطبيق يعتمد عليه وحده.'],
    ['Data in localStorage is not necessarily secret or encrypted.', 'Storage may be unavailable or throw; do not make the app depend on it alone.'],
    [
      { titleAr: 'عامل التخزين المحلي كبيانات مكشوفة للشيفرة', titleEn: 'Treat local storage as accessible to page code', bodyAr: 'يخزن localStorage بيانات مرتبطة بأصل الموقع وتستطيع شيفرة الصفحة قراءتها. لا تخزن كلمات مرور أو رموز جلسة أو معلومات صحية/مالية حساسة فيه. استخدمه لتفضيل غير حساس مثل مظهر العرض، وامنح المستخدم وسيلة واضحة لإزالة هذا التفضيل.', bodyEn: 'localStorage stores data associated with a site origin that page scripts can read. Do not store passwords, session tokens, or sensitive health/financial information there. Use it for a non-sensitive preference such as display mode, and give users a clear way to remove that preference.', examples: [
        { code: 'localStorage.setItem("displayMode", "compact");\nconst mode = localStorage.getItem("displayMode");', explanationAr: 'المظهر تفضيل بسيط غير حساس مناسب للتخزين النصي المحلي.', explanationEn: 'Display mode is a simple, non-sensitive preference suited to local string storage.' },
        { code: 'localStorage.removeItem("displayMode");', explanationAr: 'يمكن للمستخدم مسح التفضيل عند إعادة ضبط الإعدادات.', explanationEn: 'The preference can be removed when the user resets settings.' },
      ]},
      { titleAr: 'توقع الغياب والفشل', titleEn: 'Expect missing data and failure', bodyAr: 'قد يغيب المفتاح، أو يمسح المستخدم بيانات الموقع، أو يمنع المتصفح التخزين. تعامل مع `getItem` الذي يعيد null، ولا تجعل غياب تفضيل غير أساسي يمنع استخدام الصفحة. عند قراءة بيانات مركبة، أضف معالجة خطأ مناسبة وحافظ على خيار افتراضي مفهوم.', bodyEn: 'A key may be absent, the user may clear site data, or the browser may block storage. Handle `getItem` returning null, and do not let a missing non-essential preference prevent page use. When reading structured data, add appropriate error handling and keep a sensible default.', examples: [
        { code: 'const savedMode = localStorage.getItem("displayMode");\nconst mode = savedMode ?? "comfortable";', explanationAr: 'تستخدم الصفحة وضعًا افتراضيًا مفهومًا عند عدم وجود تفضيل محفوظ.', explanationEn: 'The page uses an understandable default when no preference is saved.' },
        { code: 'try {\n  localStorage.setItem("displayMode", "compact");\n} catch (error) {\n  console.log("Preference could not be saved.");\n}', explanationAr: 'تعالج حالة تعذر التخزين برسالة غير حساسة بدل انهيار المسار.', explanationEn: 'It handles unavailable storage with a non-sensitive message instead of breaking the flow.' },
      ]},
    ],
    'أضف تفضيل عرض غير حساس مع قيمة افتراضية وزر لمسحه. اشرح للمستخدم ما الذي يُحفظ، ولا تحفظ كلمة مرور أو رمزًا سريًا.',
    'Add a non-sensitive display preference with a default and a control to clear it. Explain what is saved, and do not save a password or secret token.',
    q('أي معلومة ينبغي عدم حفظها في localStorage؟', 'Which information should not be stored in localStorage?', ['كلمة مرور أو رمز وصول حساس', 'تفضيل عرض غير حساس', 'اختيار حجم الخط', 'تفضيل لغة غير حساس'], ['A password or sensitive access token', 'A non-sensitive display preference', 'A font-size choice', 'A non-sensitive language preference'], 0,
      'صحيح: التخزين المحلي ليس خزنة أسرار، وقد تصل إليه شيفرة الصفحة.', 'Correct: local storage is not a secret vault, and page scripts may access it.',
      'افصل التفضيلات غير الحساسة عن بيانات الاعتماد والأسرار.', 'Separate non-sensitive preferences from credentials and secrets.',
      'اشرح للمستخدم ما تحفظه وقدّم طريقة واضحة لحذفه.', 'Explain what you save and provide a clear way to remove it.')),
  existing('js-error-handling', 43, 'التعامل مع الأخطاء: try وcatch', 'Error Handling: try and catch',
    'استخدم try لتجربة عملية قد تفشل وcatch لمعالجة الاستثناء بدل توقف المسار دون تفسير.',
    'Use try to attempt an operation that may fail and catch to handle the exception instead of leaving the path unexplained.',
    ['لا تترك catch فارغًا إذا كان المستخدم يحتاج استجابة.', 'لا تعرض تفاصيل داخلية حساسة؛ قدم رسالة مناسبة وسجل ما يلزم للتشخيص.'],
    ['Do not leave catch empty when the user needs a response.', 'Do not expose sensitive internals; provide an appropriate message and log only what is needed for diagnosis.']),
  added(44, 'throw-and-error-messages', 'إطلاق أخطاء برسائل مفهومة', 'Throwing Errors with Useful Messages',
    'استخدم throw لإيقاف عملية غير صالحة برسالة Error واضحة، وتعامل مع الخطأ عند مستوى يستطيع تقديم استجابة مناسبة.',
    'Use throw to stop an invalid operation with a clear Error message, and handle it at a level that can provide an appropriate response.',
    ['throw لا يلتقط الخطأ بنفسه؛ يلزم try/catch في موضع مناسب.', 'لا تستخدم رسائل الخطأ لتسريب بيانات خاصة أو تفاصيل داخلية للمستخدم.'],
    ['throw does not catch an error itself; a suitable try/catch is needed.', 'Do not use error messages to expose private data or internal details to users.'],
    [
      { titleAr: 'عبّر عن مدخل غير صالح', titleEn: 'Signal an invalid input', bodyAr: 'قد تكتشف الدالة أن شرطًا أساسيًا غير متحقق، مثل عدد سالب في عملية تقبل غير السالب فقط. استخدم `throw new Error("...")` لإيقاف المسار وإعطاء المبرمج سببًا مفهومًا. لا تستخدم الاستثناءات بدل الشروط العادية المتوقعة مثل «لا نتائج» إذا كان ذلك جزءًا طبيعيًا من الاستخدام.', bodyEn: 'A function may discover that a required condition is not met, such as a negative number in an operation that accepts only non-negative values. Use `throw new Error("...")` to stop the flow and give the programmer an understandable reason. Do not use exceptions instead of ordinary expected conditions such as “no results” when that is normal usage.', examples: [
        { code: 'function setVolume(value) {\n  if (value < 0 || value > 100) {\n    throw new Error("Volume must be between 0 and 100.");\n  }\n  return value;\n}', explanationAr: 'يرفض المدخل خارج المجال برسالة واضحة قبل إرجاع القيمة.', explanationEn: 'It rejects an out-of-range input with a clear message before returning the value.' },
        { code: 'function requireTitle(title) {\n  if (!title.trim()) throw new Error("A title is required.");\n  return title.trim();\n}', explanationAr: 'يمنع اعتماد عنوان فارغ أو مكوّن من مسافات.', explanationEn: 'It prevents accepting a title that is empty or only whitespace.' },
      ]},
      { titleAr: 'التقط الخطأ حيث يمكن التعامل معه', titleEn: 'Catch the error where it can be handled', bodyAr: 'ينتقل الخطأ إلى أعلى سلسلة الاستدعاء حتى يلتقطه try/catch أو ينتهي كخطأ غير معالج. التقطه عند حد مناسب، مثل تفاعل المستخدم، واعرض رسالة بسيطة لا تكشف تفاصيل حساسة. أثناء التطوير، احتفظ بمعلومات تشخيصية مفيدة في أدوات المطور وفق سياسة المشروع.', bodyEn: 'An error travels up the call stack until a try/catch handles it or it becomes unhandled. Catch it at a suitable boundary, such as a user interaction, and show a simple message that does not expose sensitive details. During development, keep useful diagnostics in developer tools according to the project policy.', examples: [
        { code: 'try {\n  console.log(setVolume(120));\n} catch (error) {\n  console.log("Please choose a volume from 0 to 100.");\n}', explanationAr: 'يصل الاستثناء إلى catch، التي تعرض توجيهًا مفيدًا بدل إيقاف المسار بصمت.', explanationEn: 'The exception reaches catch, which provides helpful guidance instead of silently breaking the flow.' },
        { code: 'try {\n  requireTitle("   ");\n} catch (error) {\n  console.log("Add a title before continuing.");\n}', explanationAr: 'يفصل المثال رسالة المستخدم عن التفاصيل التقنية للخطأ.', explanationEn: 'The example separates the user-facing message from technical error details.' },
      ]},
    ],
    'اكتب دالة تقبل نسبة من 0 إلى 100 وتطلق Error برسالة واضحة عند الخروج عن المجال. استدعها داخل try/catch واعرض للمستخدم رسالة آمنة.',
    'Write a function that accepts a percentage from 0 to 100 and throws an Error with a clear message outside that range. Call it inside try/catch and show the user a safe message.',
    q('ما الذي تفعله throw new Error(...)؟', 'What does throw new Error(...) do?', ['تطلق استثناءً برسالة يمكن التقاطها', 'تلتقط كل الأخطاء تلقائيًا', 'تعيد true دائمًا', 'تضيف فقرة إلى DOM'], ['Throws an exception with a message that can be caught', 'Automatically catches every error', 'Always returns true', 'Adds a paragraph to the DOM'], 0,
      'صحيح: throw تطلق الخطأ؛ ويعالج try/catch هذا الاستثناء عند إحاطته.', 'Correct: throw raises the error; try/catch handles it when the operation is wrapped.',
      'الإطلاق والالتقاط وظيفتان منفصلتان؛ أضف catch عند مستوى المعالجة المناسب.', 'Throwing and catching are separate; add catch at an appropriate handling boundary.',
      'استخدم رسالة واضحة للمطور واستجابة مناسبة للمستخدم.', 'Use a clear message for developers and an appropriate response for users.')),
  existing('js-promises-async', 45, 'Promises وasync/await', 'Promises and async/await',
    'تعرّف إلى Promise كتمثيل لنتيجة مستقبلية، واستخدم then أو صياغة async/await لفهم تدفق العمل غير المتزامن.',
    'Recognize a Promise as a future result, and use then or async/await syntax to understand asynchronous flow.',
    ['لا تتعامل مع Promise كما لو كانت القيمة النهائية قبل await أو then.', 'عالج حالات الرفض باستخدام catch أو try/catch في دالة async.'],
    ['Do not treat a Promise as the final value before await or then.', 'Handle rejection with catch or try/catch in an async function.']),
  added(46, 'timers-and-cleanup', 'المؤقتات وتنظيفها', 'Timers and Cleaning Them Up',
    'استخدم setTimeout لتأجيل عمل مرة واحدة، واحفظ المعرّف لإلغائه عند عدم الحاجة.',
    'Use setTimeout to delay a one-time action, and keep its identifier so it can be canceled when no longer needed.',
    ['الوقت بالميلي ثانية؛ 1000 تساوي ثانية تقريبًا.', 'clearTimeout يلغي مؤقتًا لم يبدأ بعد، ولا يعكس عملًا نُفذ بالفعل.'],
    ['The delay is in milliseconds; 1000 is about one second.', 'clearTimeout cancels a timer that has not fired; it does not undo work already done.'],
    [
      { titleAr: 'أجّل عملًا مرة واحدة', titleEn: 'Delay one action', bodyAr: '`setTimeout(callback, delay)` يطلب من المتصفح تشغيل callback بعد تأخير بالميلي ثانية على الأقل؛ لا يضمن التوقيت الدقيق إذا كان المتصفح مشغولًا. استخدمه لرسالة مؤقتة أو عمل غير متكرر، لا لمحاكاة ساعة دقيقة.', bodyEn: '`setTimeout(callback, delay)` asks the browser to run a callback after at least a delay in milliseconds; it does not guarantee exact timing if the browser is busy. Use it for a temporary message or one-time work, not as a precise clock.', examples: [
        { code: 'setTimeout(() => {\n  console.log("A moment later");\n}, 500);', explanationAr: 'تُجدول الرسالة بعد نحو نصف ثانية، وقد يتأخر التنفيذ عند انشغال المتصفح.', explanationEn: 'It schedules the message after about half a second, though a busy browser may run it later.' },
        { code: 'const timerId = setTimeout(() => {\n  console.log("Reminder");\n}, 1000);', explanationAr: 'يحفظ المعرّف الذي يمكن استخدامه لاحقًا لإلغاء المؤقت.', explanationEn: 'It saves the identifier that can be used later to cancel the timer.' },
      ]},
      { titleAr: 'ألغِ العمل الذي لم يعد مطلوبًا', titleEn: 'Cancel work that is no longer needed', bodyAr: 'مرّر معرّف المؤقت إلى `clearTimeout` إذا تغيرت الحالة قبل تنفيذه أو أُزيل العنصر المرتبط به. هذا يمنع تحديث واجهة غير موجودة أو رسالة قديمة. لا تخلط بين `setTimeout` و`setInterval`؛ الأخير يكرر العمل ويحتاج إيقافًا مناسبًا.', bodyEn: 'Pass the timer identifier to `clearTimeout` if state changes before it runs or the related element is removed. This prevents updating a missing interface or showing an outdated message. Do not confuse `setTimeout` with `setInterval`; the latter repeats work and needs appropriate cleanup.', examples: [
        { code: 'const timerId = setTimeout(() => console.log("Done"), 2000);\nclearTimeout(timerId);', explanationAr: 'يلغي المؤقت قبل تشغيل callback، إذا وصل clearTimeout أولًا.', explanationEn: 'It cancels the timer before the callback runs, if clearTimeout is called first.' }
      ]},
    ],
    'أنشئ مؤقتًا يعرض رسالة بعد تأخير قصير، ثم ألغِه قبل انتهاء المهلة. اشرح لماذا لا يعيد clearTimeout عملًا سبق أن نُفذ.',
    'Create a timer that displays a message after a short delay, then cancel it before the delay ends. Explain why clearTimeout does not undo work that already ran.',
    q('ما الذي يفعله clearTimeout(timerId) إذا استُدعي قبل انتهاء المهلة؟', 'What does clearTimeout(timerId) do when called before the delay expires?', ['يلغي callback المجدولة', 'يعيد callback المنفذة', 'يكرر المؤقت بلا توقف', 'يوقف JavaScript كلها'], ['Cancels the scheduled callback', 'Reverses a callback that already ran', 'Repeats the timer forever', 'Stops all JavaScript'], 0,
      'صحيح: يمكن إلغاء العمل المجدول ما دام لم يبدأ.', 'Correct: scheduled work can be canceled as long as it has not started.',
      'الإلغاء لا يعكس أثر عمل اكتمل؛ راجع الفرق بين الجدولة والتنفيذ.', 'Cancellation does not reverse completed work; review the difference between scheduling and execution.',
      'احتفظ بمعرّف المؤقت كي تستطيع إلغاءه عند تغير الحاجة.', 'Keep the timer identifier so you can cancel it when it is no longer needed.')),
  existing('js-fetch', 47, 'جلب البيانات باستخدام Fetch', 'Fetching Data with Fetch',
    'احفظ نتيجة fetch في متغير response، ثم اقرأ جسمها عبر response.json().',
    'Store the fetch result in a response variable, then read its body with response.json().',
    ['fetch عملية غير متزامنة؛ انتظر نتيجتها قبل قراءة الاستجابة.', 'استجابة HTTP مثل 404 لا ترفض Promise دائمًا؛ افحص response.ok.'],
    ['fetch is asynchronous; wait for its result before reading the response.', 'An HTTP response such as 404 does not always reject the Promise; check response.ok.']),
  added(48, 'fetch-status-checks', 'التحقق من استجابة Fetch', 'Checking a Fetch Response',
    'افحص response.ok قبل تحليل جسم الاستجابة، وقدم مسارًا واضحًا لحالة HTTP غير الناجحة.',
    'Check response.ok before parsing the response body, and provide a clear path for unsuccessful HTTP statuses.',
    ['نجاح الشبكة لا يعني أن رمز HTTP ناجح؛ افحص ok أو status.', 'قد لا يكون جسم الخطأ JSON؛ لا تحلله دون فحص أو معالجة مناسبة.'],
    ['A completed network request does not mean the HTTP status succeeded; check ok or status.', 'An error body may not be JSON; do not parse it without checking or handling appropriately.'],
    [
      { titleAr: 'افصل بين اكتمال الطلب ونجاح الحالة', titleEn: 'Separate request completion from HTTP success', bodyAr: 'قد تُحل Promise الخاصة بـ fetch بنجاح لأن المتصفح استلم استجابة، حتى لو كان رمز الحالة 404 أو 500. افحص `response.ok`، وهي true لنطاق حالات النجاح، قبل التعامل مع البيانات كما لو كانت سليمة. هذا يختلف عن رفض الشبكة أو مشكلة الاتصال التي قد تُرفض فيها Promise.', bodyEn: 'A fetch Promise may fulfill because the browser received a response even when its status is 404 or 500. Check `response.ok`, which is true for successful status codes, before treating the data as valid. This differs from a network rejection or connection problem, which may reject the Promise.', examples: [
        { code: 'async function loadProfile() {\n  const response = await fetch("https://example.com/profile");\n  if (!response.ok) throw new Error("Request failed");\n  return response.json();\n}', explanationAr: 'يتحقق من الحالة قبل قراءة JSON؛ وللتطبيق الفعلي استخدم عنوان خدمة موثوقًا مناسبًا.', explanationEn: 'It checks the status before reading JSON; a real app should use an appropriate trusted service URL.' },
        { code: 'async function readStatus() {\n  const response = await fetch("https://example.com/status");\n  console.log(response.status, response.ok);\n}', explanationAr: 'يعرض رمز HTTP وقيمة ok للمساعدة على فهم نتيجة الطلب.', explanationEn: 'It displays the HTTP status and ok value to help inspect the request result.' },
      ]},
      { titleAr: 'تعامل مع الجسم والخصوصية بحذر', titleEn: 'Handle the body and privacy carefully', bodyAr: 'حلل الجسم بصيغة JSON فقط إذا كانت الخدمة ترسله فعلًا وبالتنسيق المتوقع، وأحط العملية بمعالجة أخطاء مناسبة. لا تعرض تفاصيل تقنية حساسة للمستخدم، ولا ترسل معلومات خاصة إلى عنوان لم تتحقق من موثوقيته. قد تمنع سياسة CORS في المتصفح قراءة استجابة من أصل آخر؛ لا تحاول تجاوزها من جهة العميل.', bodyEn: 'Parse the body as JSON only if the service actually sends it in the expected format, and use appropriate error handling. Do not show sensitive technical details to users or send private information to an address you have not verified as trusted. Browser CORS policy may prevent reading a cross-origin response; do not try to bypass it from the client.', examples: [
        { code: 'async function loadItems() {\n  try {\n    const response = await fetch("https://example.com/items");\n    if (!response.ok) return [];\n    return await response.json();\n  } catch (error) {\n    return [];\n  }\n}', explanationAr: 'يعيد قيمة بديلة عند فشل الطلب أو الحالة؛ في تطبيق حقيقي أظهر أيضًا للمستخدم حالة خطأ مفهومة.', explanationEn: 'It returns a fallback for request or status failure; a real app should also show the user an understandable error state.' },
        { code: 'async function showCount() {\n  const response = await fetch("https://example.com/count");\n  if (!response.ok) {\n    console.log("Could not load the count.");\n    return;\n  }\n  const data = await response.json();\n  console.log(data.count);\n}', explanationAr: 'يتوقف عن قراءة الجسم عند حالة غير ناجحة ولا يخلطها باستجابة سليمة.', explanationEn: 'It stops before reading the body on an unsuccessful status and does not confuse it with a valid response.' },
      ]},
    ],
    'اكتب دالة async تجلب عنوان خدمة تجريبيًا، وتفحص response.ok قبل response.json، وتعالج فشل الشبكة برسالة غير حساسة. لا ترسل بيانات شخصية.',
    'Write an async function that fetches a sample service URL, checks response.ok before response.json, and handles network failure with a non-sensitive message. Do not send personal data.',
    q('هل تعني استجابة fetch المستلمة أن رمز HTTP ناجح دائمًا؟', 'Does receiving a fetch response always mean the HTTP status succeeded?', ['لا؛ افحص response.ok أو status', 'نعم، كل الاستجابات تعني 200', 'لا؛ fetch لا يعيد استجابة أبدًا', 'نعم، إذا كان الجسم JSON'], ['No; check response.ok or status', 'Yes, every response means 200', 'No; fetch never returns a response', 'Yes, if the body is JSON'], 0,
      'صحيح: قد تستلم استجابة 404 أو 500؛ افحص الحالة صراحةً.', 'Correct: a 404 or 500 response may still be received; check the status explicitly.',
      'اكتمال الاتصال شيء ورمز HTTP الناجح شيء آخر.', 'Completing the connection is different from receiving a successful HTTP status.',
      'افحص الحالة قبل الاعتماد على جسم الاستجابة.', 'Check the status before relying on the response body.')),
  existing('js-modules-organization', 49, 'الوحدات وتنظيم الشيفرة', 'Modules and Code Organization',
    'نظّم الشيفرة في وحدات صغيرة، وميّز بين named export وnamed import عند مشاركة دوال بين الملفات.',
    'Organize code into small modules, and distinguish named exports from named imports when sharing functions across files.',
    ['يجب أن يطابق اسم named import الاسم المصدّر ما لم تستخدم إعادة تسمية صريحة.', 'تحتاج وحدات المتصفح إلى إعداد تحميل مناسب مثل type="module" في HTML.'],
    ['A named import must match the exported name unless explicitly renamed.', 'Browser modules need appropriate loading setup, such as type="module" in HTML.']),
  added(50, 'beginner-browser-project', 'مشروع تطبيقي: قائمة مهام صغيرة', 'Applied Project: A Small Task List',
    'خطط لتطبيق متصفح صغير يربط نموذجًا وأحداث DOM والتحقق وعرضًا آمنًا وحالات مفهومة، مع تقسيم العمل إلى خطوات قابلة للاختبار.',
    'Plan a small browser app that connects a form, DOM events, validation, safe rendering, and understandable states, dividing work into testable steps.',
    ['لا تبدأ بكتابة كل شيء دفعة واحدة؛ اختبر وظيفة واحدة في كل مرة.', 'لا تعرض مدخل المستخدم كـ HTML ولا تعتمد على التخزين لحفظ بيانات حساسة.'],
    ['Do not write everything at once; test one behavior at a time.', 'Do not render user input as HTML or rely on storage for sensitive data.'],
    [
      { titleAr: 'خطط للبيانات والسلوك', titleEn: 'Plan the data and behavior', bodyAr: 'ابدأ بصفحة HTML فيها نموذج بعنوان وزر إرسال وقائمة فارغة ومنطقة رسالة ذات تسمية واضحة. حدد ما يجعل المهمة صالحة، وما الرسالة عند الإدخال الفارغ، وما الذي يحدث عند الإضافة. قسّم العمل إلى اختيار العناصر، استقبال submit، التحقق، ثم تحديث القائمة.', bodyEn: 'Start with an HTML page containing a title form, submit button, empty list, and a clearly labeled message region. Define what makes a task valid, what to say for empty input, and what happens when it is added. Split the work into selecting elements, handling submit, validating, then updating the list.', examples: [
        { code: 'const tasks = [];\nfunction addTask(title) {\n  const cleanTitle = title.trim();\n  if (!cleanTitle) return false;\n  tasks.push({ title: cleanTitle, done: false });\n  return true;\n}', explanationAr: 'تفصل الدالة التحقق من عنوان المهمة وتسجيل بياناتها عن تفاصيل العرض.', explanationEn: 'The function separates title validation and task data from display details.' },
        { code: 'const task = { title: "Read a chapter", done: false };\nconsole.log(task.title, task.done);', explanationAr: 'يمثل الكائن بيانات مهمة واحدة بحقول ذات أسماء واضحة.', explanationEn: 'The object represents one task with clearly named fields.' },
      ]},
      { titleAr: 'نفّذ بأمان واختبر الحالات', titleEn: 'Implement safely and test states', bodyAr: 'أنشئ عناصر القائمة باستخدام createElement وضع عنوان المهمة في textContent. اربط الإرسال بالنموذج، وامنع إعادة التحميل عند الحاجة، وقدّم رسالة نصية مفهومة. اختبر عنوانًا فارغًا، ومسافات فقط، وعنوانًا عاديًا، ثم أعد تحميل الصفحة. إذا أضفت localStorage، فلا تخزن بيانات حساسة وتعامل مع غياب القيمة أو فشل التخزين.', bodyEn: 'Create list elements with createElement and put the task title in textContent. Handle form submission, prevent a reload when appropriate, and provide an understandable text message. Test an empty title, whitespace only, and an ordinary title, then reload the page. If you add localStorage, do not store sensitive data and handle missing values or storage failure.', examples: [
        { code: 'const item = document.createElement("li");\nitem.textContent = "Read a chapter";\ndocument.querySelector("#tasks")?.appendChild(item);', explanationAr: 'يعرض المهمة كنص عادي ويضيف العنصر إلى الحاوية عند وجودها.', explanationEn: 'It displays the task as plain text and appends the item when the container exists.' },
        { code: 'const title = "  Plan the week  ";\nconst cleanTitle = title.trim();\nconsole.log(cleanTitle.length > 0);', explanationAr: 'يتحقق من عنوان بعد إزالة المسافات المحيطة قبل إضافته.', explanationEn: 'It checks a title after trimming surrounding whitespace before adding it.' },
      ]},
    ],
    'أنشئ صفحة مصغرة لقائمة مهام بعنوان، وزر إضافة، وقائمة، ورسالة حالة. نفذ التحقق وعرض النص بأمان، واكتب قائمة اختبار تشمل إدخالًا فارغًا، وإدخالًا عاديًا، ونقر لوحة المفاتيح، وفشل التخزين الاختياري.',
    'Build a tiny task-list page with a title field, add button, list, and status message. Validate and render text safely, and write a test checklist covering empty input, ordinary input, keyboard use, and optional storage failure.',
    q('ما الترتيب الأنسب لمعالجة إرسال مهمة جديدة؟', 'What is a sensible order for handling a new task submission?', ['التحقق من الإدخال ثم إنشاء عنصر آمن وتقديم حالة واضحة', 'دمج المدخل مباشرةً داخل innerHTML ثم تجاهل الأخطاء', 'حفظ كلمة المرور ثم تحديث اللون فقط', 'إخفاء النموذج قبل معرفة هل العنوان فارغ'], ['Validate input, create a safe element, and provide a clear status', 'Concatenate input directly into innerHTML and ignore errors', 'Save a password and only update a color', 'Hide the form before checking whether the title is empty'], 0,
      'صحيح: التحقق أولًا، ثم عرض آمن، ورسالة حالة مفهومة للمستخدم.', 'Correct: validate first, then render safely and provide an understandable user status.',
      'لا تثق بمدخل المستخدم ولا تجعل اللون وحده يشرح النتيجة؛ اتبع خطوات قابلة للاختبار.', 'Do not trust user input or rely on color alone to explain the outcome; use testable steps.',
      'قسّم التطبيق إلى إدخال، تحقق، تحديث DOM، ورسالة حالة، ثم اختبر الحالات الحدية.', 'Divide the app into input, validation, DOM update, and status message, then test edge cases.')),
];

export type JavaScriptPlacementQuestion = {
  id: string;
  promptAr: string;
  promptEn: string;
  choices: Array<{ id: string; labelAr: string; labelEn: string }>;
  correctChoiceId: string;
  feedbackAr: string;
  feedbackEn: string;
  competency: string;
};

export type JavaScriptPlacementBand = {
  id: string;
  titleAr: string;
  titleEn: string;
  questions: [JavaScriptPlacementQuestion, JavaScriptPlacementQuestion];
};

// Score sequentially: a later 2/2 band must not skip an earlier band below 2/2.
export const placementBands: JavaScriptPlacementBand[] = [
  {
    id: 'js-placement-language-basics', titleAr: 'أساسيات اللغة', titleEn: 'Language Basics',
    questions: [
      { id: 'js-place-basics-value-type', promptAr: 'ما نوع القيمة "8" في JavaScript؟', promptEn: 'What type is the value "8" in JavaScript?',
        choices: [{ id: 'a', labelAr: 'نص', labelEn: 'String' }, { id: 'b', labelAr: 'عدد', labelEn: 'Number' }, { id: 'c', labelAr: 'قيمة منطقية', labelEn: 'Boolean' }, { id: 'd', labelAr: 'دالة', labelEn: 'Function' }],
        correctChoiceId: 'a', feedbackAr: 'علامتا الاقتباس تجعلان 8 نصًا؛ العدد 8 بلا اقتباس.', feedbackEn: 'The quotation marks make 8 a string; the number 8 has no quotes.', competency: 'value-types' },
      { id: 'js-place-basics-loop', promptAr: 'إذا بدأت i من 0 واستمر الشرط i < 3 مع زيادة i واحدًا، فما القيم التي تمر بها الحلقة؟', promptEn: 'If i starts at 0, the condition is i < 3, and i increases by one, which values does the loop visit?',
        choices: [{ id: 'a', labelAr: '0 و1 و2', labelEn: '0, 1, and 2' }, { id: 'b', labelAr: '1 و2 و3', labelEn: '1, 2, and 3' }, { id: 'c', labelAr: '0 و1 و2 و3', labelEn: '0, 1, 2, and 3' }, { id: 'd', labelAr: '0 فقط', labelEn: 'Only 0' }],
        correctChoiceId: 'a', feedbackAr: 'يتوقف الشرط قبل إدراج 3؛ القيم هي 0 و1 و2.', feedbackEn: 'The condition stops before including 3; the values are 0, 1, and 2.', competency: 'bounded-loops' },
    ],
  },
  {
    id: 'js-placement-data-functions', titleAr: 'البيانات والدوال', titleEn: 'Data and Functions',
    questions: [
      { id: 'js-place-data-map-filter', promptAr: 'أي طريقة تعيد مصفوفة جديدة بتحويل كل عنصر؟', promptEn: 'Which method returns a new array by transforming each item?',
        choices: [{ id: 'a', labelAr: 'map', labelEn: 'map' }, { id: 'b', labelAr: 'filter', labelEn: 'filter' }, { id: 'c', labelAr: 'find', labelEn: 'find' }, { id: 'd', labelAr: 'some', labelEn: 'some' }],
        correctChoiceId: 'a', feedbackAr: 'تنتج map قيمة مقابلة لكل عنصر؛ filter تختار عناصر، وfind تعيد أول تطابق.', feedbackEn: 'map produces a corresponding value for each item; filter selects items and find returns the first match.', competency: 'array-transformation' },
      { id: 'js-place-data-return', promptAr: 'ماذا يحدث للقيمة بعد return داخل دالة؟', promptEn: 'What happens to the value after return inside a function?',
        choices: [{ id: 'a', labelAr: 'تعود إلى موضع استدعاء الدالة', labelEn: 'It goes back to the function call site' }, { id: 'b', labelAr: 'تُطبع دائمًا في الصفحة', labelEn: 'It is always printed on the page' }, { id: 'c', labelAr: 'تُحفظ تلقائيًا في localStorage', labelEn: 'It is automatically saved to localStorage' }, { id: 'd', labelAr: 'تصبح خاصية في DOM', labelEn: 'It becomes a DOM property' }],
        correctChoiceId: 'a', feedbackAr: 'تعيد return النتيجة إلى المستدعي؛ العرض أو التخزين يحتاجان خطوة مستقلة.', feedbackEn: 'return gives the result back to the caller; displaying or storing it takes a separate step.', competency: 'function-results' },
    ],
  },
  {
    id: 'js-placement-browser-data', titleAr: 'تفاعل المتصفح والبيانات', titleEn: 'Browser Interaction and Data',
    questions: [
      { id: 'js-place-browser-safe-text', promptAr: 'ما الخاصية الأنسب لعرض نص كتبه المستخدم من دون تفسيره كـ HTML؟', promptEn: 'Which property is best for displaying user-entered text without interpreting it as HTML?',
        choices: [{ id: 'a', labelAr: 'textContent', labelEn: 'textContent' }, { id: 'b', labelAr: 'innerHTML مع دمج النص الخام', labelEn: 'innerHTML with raw string concatenation' }, { id: 'c', labelAr: 'eval', labelEn: 'eval' }, { id: 'd', labelAr: 'className', labelEn: 'className' }],
        correctChoiceId: 'a', feedbackAr: 'يعرض textContent القيمة كنص؛ إدخال غير موثوق في innerHTML قد يفسر كترميز.', feedbackEn: 'textContent displays the value as text; untrusted input in innerHTML may be interpreted as markup.', competency: 'safe-dom-rendering' },
      { id: 'js-place-browser-json', promptAr: 'ما الذي يعيده JSON.parse عند تمرير نص JSON صالح؟', promptEn: 'What does JSON.parse return when given valid JSON text?',
        choices: [{ id: 'a', labelAr: 'قيمة JavaScript مثل كائن أو مصفوفة', labelEn: 'A JavaScript value such as an object or array' }, { id: 'b', labelAr: 'عنصر HTML', labelEn: 'An HTML element' }, { id: 'c', labelAr: 'نص JSON نفسه دائمًا', labelEn: 'Always the JSON text itself' }, { id: 'd', labelAr: 'Promise مرفوضة دائمًا', labelEn: 'An always-rejected Promise' }],
        correctChoiceId: 'a', feedbackAr: 'يحلل parse النص ويعيد قيمة JavaScript؛ أما stringify فينتج نصًا.', feedbackEn: 'parse reads the text and returns a JavaScript value; stringify produces text.', competency: 'json-data-conversion' },
    ],
  },
  {
    id: 'js-placement-async-modules', titleAr: 'العمل غير المتزامن والتنظيم', titleEn: 'Async Work and Organization',
    questions: [
      { id: 'js-place-async-promise', promptAr: 'ماذا تعني قيمة Promise قبل انتظارها أو التعامل معها؟', promptEn: 'What does a Promise represent before it is awaited or handled?',
        choices: [{ id: 'a', labelAr: 'نتيجة قد تتوفر لاحقًا', labelEn: 'A result that may become available later' }, { id: 'b', labelAr: 'عنصر DOM مكتمل دائمًا', labelEn: 'An always-complete DOM element' }, { id: 'c', labelAr: 'عدد صحيح', labelEn: 'An integer' }, { id: 'd', labelAr: 'قاعدة CSS', labelEn: 'A CSS rule' }],
        correctChoiceId: 'a', feedbackAr: 'تمثل Promise نتيجة مستقبلية قد تكتمل أو ترفض؛ تعامل مع النتيجة وفق المسار المناسب.', feedbackEn: 'A Promise represents a future result that may fulfill or reject; handle the result through the appropriate path.', competency: 'promise-fundamentals' },
      { id: 'js-place-async-fetch-status', promptAr: 'بعد اكتمال fetch واستلام response، ما الخطوة المناسبة قبل افتراض نجاح HTTP؟', promptEn: 'After fetch completes and returns a response, what should you do before assuming HTTP succeeded?',
        choices: [{ id: 'a', labelAr: 'افحص response.ok أو response.status', labelEn: 'Check response.ok or response.status' }, { id: 'b', labelAr: 'افترض دائمًا أن الحالة 200', labelEn: 'Always assume the status is 200' }, { id: 'c', labelAr: 'حوّل response إلى عنصر HTML', labelEn: 'Convert response into an HTML element' }, { id: 'd', labelAr: 'تجاهل الجسم والحالة كليًا', labelEn: 'Ignore both the body and status entirely' }],
        correctChoiceId: 'a', feedbackAr: 'قد يكتمل الطلب مع رمز مثل 404؛ افحص الحالة قبل تحليل الجسم.', feedbackEn: 'A request may complete with a status such as 404; check the status before parsing the body.', competency: 'fetch-response-handling' },
    ],
  },
];
