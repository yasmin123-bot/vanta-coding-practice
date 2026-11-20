import type { FoundationLesson } from './foundationLessons';

type LessonContent = Omit<FoundationLesson, 'id' | 'sequence'>;
type QuizQuestion = LessonContent['quiz'][number];
type ChoiceTuple = [string, string, string, string];

function question(
  id: string,
  prompt_ar: string,
  prompt_en: string,
  choices_ar: ChoiceTuple,
  choices_en: ChoiceTuple,
  correctIndex: number,
  correct_ar: string,
  correct_en: string,
  incorrect_ar: string,
  incorrect_en: string,
  review_ar: string,
  review_en: string,
): QuizQuestion {
  const ids = ['a', 'b', 'c', 'd'];
  const choices = ids.map((choiceId, index) => ({
    id: choiceId,
    text_ar: choices_ar[index],
    text_en: choices_en[index],
    is_correct: index === correctIndex,
  })) as QuizQuestion['choices'];
  return {
    id, prompt_ar, prompt_en, choices,
    correct_choice_id: ids[correctIndex],
    correct_ar, correct_en, incorrect_ar, incorrect_en, review_ar, review_en,
  };
}

function quiz(
  a: QuizQuestion,
  b: QuizQuestion,
  c: QuizQuestion,
): LessonContent['quiz'] {
  return [a, b, c];
}

export const EXPANDED_JAVASCRIPT_LESSONS: Record<string, LessonContent> = {
  'js-loops': {
    path_id: 'javascript-fundamentals',
    title_ar: 'الحلقات والتكرار',
    title_en: 'Loops and Repetition',
    objective_ar: 'استخدم حلقة for لتكرار عمل على عناصر أو أعداد ضمن مدى معلوم، وافهم بداية العداد وشرط التوقف وتحديثه.',
    objective_en: 'Use a for loop to repeat work over a known range, and understand its starting value, stopping condition, and update.',
    outcome_ar: 'أستطيع قراءة حلقة for محدودة وكتابة نمط عدّ يبدأ من الصفر ويتوقف قبل الحد الأعلى.',
    outcome_en: 'I can read a bounded for loop and write a counting pattern that starts at zero and stops before its upper bound.',
    steps: [
      { title_ar: 'الفكرة: كرر بتعليمات واضحة', title_en: 'Concept: repeat with clear steps', body_ar: 'تجمع الحلقة تعليمات تتكرر. في حلقة `for` نحدد قيمة البداية، ثم شرط استمرار، ثم تحديث العداد بعد كل دورة.', body_en: 'A loop groups instructions to repeat. In a for loop, set a starting value, a continuation condition, and an update after each iteration.' },
      { title_ar: 'اقرأ المثال', title_en: 'Read the example', body_ar: 'يبدأ `index` من 0، وتستمر الحلقة ما دام أصغر من 3، ثم يزيد واحدًا. لذلك تمر القيم 0 و1 و2؛ الحد 3 غير مشمول.', body_en: '`index` starts at 0, the loop continues while it is below 3, and then increments by one. It visits 0, 1, and 2; the bound 3 is excluded.' },
      { title_ar: 'خطأ شائع وانتقال', title_en: 'Common mistake and next step', body_ar: 'نسيان تحديث العداد قد ينشئ حلقة لا تنتهي، واستخدام `<= 3` يضيف دورة أخرى. المدقق هنا يفحص بنية المدى ووجود الاستدعاء فقط، ولا يثبت عدد مرات التنفيذ أو سلوك البرنامج.', body_en: 'Forgetting to update the counter can create an endless loop, while `<= 3` adds another iteration. This checker inspects the range structure and presence of a call only; it does not prove execution count or program behavior.' },
    ],
    example_code: 'for (let index = 0; index < 3; index++) {\n  console.log(index);\n}',
    code_explanation: [
      { code: 'let index = 0', why_ar: 'ينشئ عدادًا يبدأ من الصفر؛ تتغير قيمته في كل دورة.', why_en: 'Creates a counter starting at zero; its value changes on each iteration.' },
      { code: 'index < 3', why_ar: 'شرط الاستمرار: تتوقف الحلقة عندما يصبح العداد 3.', why_en: 'The continuation condition: the loop stops when the counter reaches 3.' },
      { code: 'index++', why_ar: 'يزيد العداد بمقدار واحد كي تتقدم الحلقة نحو التوقف.', why_en: 'Increments the counter by one so the loop progresses toward stopping.' },
    ],
    practice_ar: '١. اكتب حلقة `for` بعداد `index` يبدأ من 0، وشرط استمرار `index < 3`، وتحديث `index++`. ٢. داخل جسم الحلقة، استدعِ `console.log` لعرض قيمة العداد.',
    practice_en: '1. Write a `for` loop with an `index` counter that starts at 0, uses the `index < 3` continuation condition, and increments with `index++`. 2. Inside the loop body, call `console.log` to display the counter value.',
    starter_html: '<p>افتح محرر JavaScript واكتب الحلقة هنا.</p>', starter_css: '', starter_js: '',
    validation_rules: [
      { id: 'loop-index-range', type: 'js-range-expression', variable: 'index', lowerBound: 0, upperBound: 3, operator: '<', requireIncrement: true, label_ar: 'مدى العداد وتحديثه', label_en: 'Counter range and update', note_ar: 'ابدأ index من 0 واستخدم الشرط index < 3 ثم حدّثه بـ index++.', note_en: 'Start index at 0, use index < 3, then update it with index++.', concept_ar: 'تحتاج الحلقة إلى بداية وشرط توقف وتحديث يقرّب العداد من التوقف.', concept_en: 'A loop needs a start, a stopping condition, and an update that moves the counter toward stopping.' },
      { id: 'loop-console-call', type: 'js-call', target: 'console.log', withinLoopVariable: 'index', minimumArguments: 1, argumentVariable: 'index', label_ar: 'عرض العداد داخل الحلقة', label_en: 'Log the counter inside the loop', note_ar: 'داخل حلقة index، استدعِ console.log(index).', note_en: 'Inside the index loop, call console.log(index).', concept_ar: 'يمكن أن يتكرر الاستدعاء مع كل دورة؛ المدقق لا يشغّل الحلقة.', concept_en: 'The call can repeat on each iteration; the checker does not run the loop.' },
    ],
    quiz: quiz(
      question('loop-parts', 'ما وظيفة جزء التحديث مثل `index++` في حلقة for؟', 'What does an update such as `index++` do in a for loop?', ['يغيّر العداد بين الدورات', 'يعرّف شرط HTML', 'ينهي البرنامج دائمًا', 'ينشئ مصفوفة'], ['Changes the counter between iterations', 'Defines an HTML condition', 'Always ends the program', 'Creates an array'], 0, 'صحيح: تحديث العداد يساعد الحلقة على التقدم.', 'Correct: updating the counter helps the loop progress.', 'راجع أجزاء الحلقة: البداية والشرط والتحديث أدوار مختلفة.', 'Review the loop parts: initialization, condition, and update have different roles.', 'التحديث يغيّر قيمة العداد بعد كل دورة.', 'The update changes the counter after each iteration.'),
      question('loop-bound', 'كم مرة ينفّذ الجسم إذا بدأ العداد من 0 والشرط `index < 3` وزاد بمقدار 1؟', 'How many times does the body run when the counter starts at 0, the condition is `index < 3`, and it increments by 1?', ['مرتين', 'ثلاث مرات', 'أربع مرات', 'لا ينفذ أبدًا'], ['Twice', 'Three times', 'Four times', 'Never'], 1, 'صحيح: القيم هي 0 و1 و2.', 'Correct: the values are 0, 1, and 2.', 'الحد 3 غير مشمول في شرط أصغر من.', 'The bound 3 is excluded by the less-than condition.', 'تتوقف الحلقة عندما يصل العداد إلى 3.', 'The loop stops when the counter reaches 3.'),
      question('loop-risk', 'ما الخطر الشائع إذا لم يتغير العداد مع بقاء الشرط صحيحًا؟', 'What is a common risk if the counter does not change while the condition stays true?', ['تكرار لا ينتهي', 'تحويل تلقائي إلى نص', 'حذف عنصر HTML', 'تصدير وحدة'], ['An endless repetition', 'Automatic conversion to a string', 'Deleting an HTML element', 'Exporting a module'], 0, 'صحيح: إذا بقي الشرط صحيحًا فقد لا تنتهي الحلقة.', 'Correct: if the condition remains true, the loop may never end.', 'تحقق من أن كل دورة تقرّب العداد من شرط التوقف.', 'Check that each iteration moves the counter toward the stopping condition.', 'اجمع بين شرط توقف وتحديث مناسب.', 'Pair a stopping condition with an appropriate update.'),
    ),
  },

  'js-type-conversion': {
    path_id: 'javascript-fundamentals', title_ar: 'تحويل الأنواع والمقارنة الصارمة', title_en: 'Type Conversion and Strict Comparison',
    objective_ar: 'حوّل النص الرقمي إلى عدد صراحةً، وميّز بين المساواة الصارمة التي تقارن النوع والقيمة وبين التحويل الضمني.',
    objective_en: 'Explicitly convert numeric text to a number, and distinguish strict equality—which compares type and value—from implicit coercion.',
    outcome_ar: 'أستطيع استخدام Number لتحويل نص رقمي، وشرح لماذا تمنع `===` خلط النوع بالقيمة.', outcome_en: 'I can use Number to convert numeric text and explain how `===` avoids mixing type with value.',
    steps: [
      { title_ar: 'المفهوم: القيمة لها نوع', title_en: 'Concept: values have types', body_ar: 'النص `"12"` ليس العدد `12`. التحويل الصريح مثل `Number("12")` يجعل قصدك واضحًا قبل الحساب أو المقارنة.', body_en: 'The string `"12"` is not the number `12`. Explicit conversion such as `Number("12")` makes your intent clear before calculation or comparison.' },
      { title_ar: 'افهم المقارنة الصارمة', title_en: 'Understand strict comparison', body_ar: '`===` يتحقق من تساوي النوع والقيمة معًا؛ لذلك `12 === "12"` نتيجتها false. تجنّب الاعتماد على تحويل ضمني غير ظاهر.', body_en: '`===` checks both type and value, so `12 === "12"` is false. Avoid relying on invisible implicit conversion.' },
      { title_ar: 'خطأ شائع وحدود الفحص', title_en: 'Common mistake and checker limits', body_ar: 'قد يجمع `"12" + 1` النصين بدل جمع عددين. التمرين يتحقق بنيويًا من استدعاء التحويل وتعريف قيمة عددية؛ لا توجد قاعدة هنا تثبت استخدام `===` أو نتيجة المقارنة.', body_en: '`"12" + 1` may concatenate text instead of adding numbers. This exercise structurally checks a conversion call and a numeric declaration; no rule here proves use of `===` or a comparison result.' },
    ],
    example_code: 'const rawScore = "12";\nconst score = Number(rawScore);\nconst sameValue = score === 12;',
    code_explanation: [
      { code: 'Number(rawScore)', why_ar: 'يحوّل النص الرقمي إلى قيمة عددية قبل استخدامها.', why_en: 'Converts numeric text to a number before using it.' },
      { code: 'score === 12', why_ar: 'المعامل الصارم يتطلب تطابق النوع والقيمة، ولا يحوّل النص تلقائيًا.', why_en: 'The strict operator requires matching type and value; it does not coerce the string automatically.' },
    ],
    practice_ar: '١. عرّف `score` باستخدام `const` واجعل قيمته `Number("12")`؛ يتحقق المدقق من استدعاء التحويل ومن التعريف العددي. ٢. اكتب المقارنة `score === 12` واقرأ نتيجتها بنفسك؛ لا تتحقق القواعد من المقارنة الصارمة.',
    practice_en: '1. Declare `score` with `const` and initialize it with `Number("12")`; the checker verifies the conversion call and numeric declaration. 2. Write the comparison `score === 12` and inspect its result yourself; the rules do not validate strict comparison.',
    starter_html: '<p>جرّب تحويل النص الرقمي إلى قيمة.</p>', starter_css: '', starter_js: '',
    validation_rules: [
      { id: 'convert-score-call', type: 'js-call', target: 'Number', argument: '12', argumentIndex: 0, label_ar: 'استدعاء Number', label_en: 'Number conversion call', note_ar: 'استخدم Number مع النص الحرفي "12" لتحويله صراحةً.', note_en: 'Use Number with the string literal "12" to convert it explicitly.', concept_ar: 'التحويل الصريح يوضح نوع القيمة المقصود.', concept_en: 'Explicit conversion makes the intended value type clear.' },
      { id: 'score-number-declaration', type: 'js-declaration', target: 'score', property: 'const', expectedType: 'number', initializerCall: 'Number', initializerCallArgument: '12', label_ar: 'تعريف العدد المحوّل', label_en: 'Converted number declaration', note_ar: 'عرّف score باستخدام const واجعل قيمته ناتجة عن Number("12").', note_en: 'Declare score with const and initialize it with Number("12").', concept_ar: 'يفحص المدقق بنية التحويل داخل تعريف score، ولا يشغّل JavaScript.', concept_en: 'The checker verifies the conversion structure inside score’s declaration; it does not execute JavaScript.' },
    ],
    quiz: quiz(
      question('conversion-result', 'ما نوع القيمة الناتجة عادةً من `Number("12")`؟', 'What type of value does `Number("12")` normally produce?', ['عدد', 'نص', 'عنصر HTML', 'دالة'], ['A number', 'A string', 'An HTML element', 'A function'], 0, 'صحيح: Number يحاول تحويل النص إلى عدد.', 'Correct: Number attempts to convert the string to a number.', 'النتيجة من Number قيمة عددية وليست النص الأصلي.', 'Number produces a numeric value, not the original string.', 'استخدم التحويل الصريح قبل الحساب.', 'Use explicit conversion before arithmetic.'),
      question('strict-equality', 'ماذا تكون نتيجة `12 === "12"`؟', 'What is the result of `12 === "12"`?', ['true لأن الرموز متشابهة', 'false لاختلاف النوع', '12', 'خطأ نحوي'], ['true because the symbols look alike', 'false because the types differ', '12', 'A syntax error'], 1, 'صحيح: المساواة الصارمة تتطلب النوع والقيمة.', 'Correct: strict equality requires matching type and value.', 'لاحظ أن أحد الطرفين عدد والآخر نص.', 'Notice that one side is a number and the other is a string.', '`===` لا يجري التحويل الضمني الذي تجريه `==` أحيانًا.', '`===` does not perform the implicit conversion that `==` sometimes does.'),
      question('plus-types', 'ما المشكلة المحتملة في `"12" + 1`؟', 'What is a possible issue with `"12" + 1`?', ['قد يحدث دمج نصي بدل جمع عددي', 'يصبح الناتج عنصرًا', 'يحوّل كل القيم إلى true', 'ينشئ حلقة'], ['It may concatenate text instead of adding numbers', 'The result becomes an element', 'It converts every value to true', 'It creates a loop'], 0, 'صحيح: وجود نص قد يجعل + ينفذ الدمج.', 'Correct: a string may make + perform concatenation.', 'حوّل القيمة إلى عدد قبل الجمع إذا كان هذا هو المطلوب.', 'Convert the value to a number before addition if that is what you intend.', 'افحص النوع قبل إجراء العمليات.', 'Check types before performing operations.'),
    ),
  },

  'js-functions-scope': {
    path_id: 'javascript-fundamentals', title_ar: 'الدوال والنطاق وreturn', title_en: 'Functions, Scope, and return',
    objective_ar: 'عرّف دالة ذات معامل، أعد نتيجة باستخدام return، وافهم الفرق بين المعامل المحلي والمتغير خارج الدالة.',
    objective_en: 'Define a function with a parameter, return a result, and understand the difference between a local parameter and a variable outside the function.',
    outcome_ar: 'أستطيع كتابة دالة تعيد قيمة واستدعاءها، وشرح أن المعامل متاح داخل نطاق الدالة.', outcome_en: 'I can write and call a function that returns a value, and explain that its parameter is available within the function scope.',
    steps: [
      { title_ar: 'المفهوم: الدالة ونطاقها', title_en: 'Concept: functions and scope', body_ar: 'تجمع الدالة عملًا قابلًا لإعادة الاستخدام. المعامل اسم محلي لقيمة تدخل الدالة، والمتغير المحلي لا يصبح تلقائيًا متاحًا خارج جسمها.', body_en: 'A function groups reusable work. A parameter is a local name for an input, and a local variable does not automatically become available outside the function body.' },
      { title_ar: 'مثال على return', title_en: 'An example of return', body_ar: 'تستقبل `doubleNumber` العدد في `number` ثم تعيد `number * 2`. `return` ترسل النتيجة إلى موضع الاستدعاء؛ أما `console.log` وحده فلا يعيدها.', body_en: '`doubleNumber` receives a number in `number` and returns `number * 2`. `return` sends the result back to the call site; `console.log` alone does not return it.' },
      { title_ar: 'خطأ شائع وحدّ التحقق', title_en: 'Common mistake and checker limit', body_ar: 'نسيان return يجعل نتيجة الاستدعاء undefined. يفحص التمرين شكل الدالة وعملية حسابية واستدعاءً؛ ولا يثبت نطاق كل متغير في كل حالة.', body_en: 'Forgetting return makes the call result undefined. This exercise checks the function shape, an arithmetic operation, and a call; it does not prove every variable’s scope behavior.' },
    ],
    example_code: 'function doubleNumber(number) {\n  const doubled = number * 2;\n  return doubled;\n}\nconst result = doubleNumber(4);',
    code_explanation: [
      { code: 'function doubleNumber(number)', why_ar: 'يعرّف دالة اسمها doubleNumber ومعاملًا محليًا اسمه number.', why_en: 'Defines a function named doubleNumber with a local parameter named number.' },
      { code: 'return doubled;', why_ar: 'يرسل القيمة المحسوبة إلى المستدعي.', why_en: 'Sends the calculated value back to the caller.' },
      { code: 'doubleNumber(4)', why_ar: 'يستدعي الدالة ويمرر 4 وسيطًا للمعامل number.', why_en: 'Calls the function and passes 4 as the argument for number.' },
    ],
    practice_ar: '١. عرّف `doubleNumber` كدالة لها معامل اسمه `number`. ٢. أعد من جسمها `number * 2` باستخدام `return`. ٣. استدعِ الدالة مع الوسيط العددي 4. لا يثبت المدقق نطاق كل متغير في كل حالة؛ راجع الشرح.',
    practice_en: '1. Define `doubleNumber` as a function with a parameter named `number`. 2. Return `number * 2` from its body. 3. Call the function with the numeric argument 4. The checker does not prove every variable-scope behavior; review the explanation.',
    starter_html: '<p>اكتب تعريف الدالة واستدعاءها في محرر JavaScript.</p>', starter_css: '', starter_js: '',
    validation_rules: [
      { id: 'double-number-function', type: 'js-function', target: 'doubleNumber', parameter: 'number', label_ar: 'تعريف الدالة', label_en: 'Function declaration', note_ar: 'عرّف الدالة doubleNumber بمعامل اسمه number.', note_en: 'Define the doubleNumber function with a parameter named number.', concept_ar: 'المعامل اسم للمدخل داخل نطاق الدالة.', concept_en: 'A parameter names an input within the function scope.' },
      { id: 'double-number-behavior', type: 'js-function-behavior', functionName: 'doubleNumber', parameter: 'number', operator: '*', operand: 2, label_ar: 'حساب نتيجة الدالة', label_en: 'Function calculation', note_ar: 'أعد داخل doubleNumber ناتج ضرب number في 2 باستخدام return.', note_en: 'Return the result of multiplying number by 2 inside doubleNumber.', concept_ar: 'return يعيد نتيجة من الدالة.', concept_en: 'return sends a result out of a function.' },
      { id: 'double-number-call', type: 'js-call', target: 'doubleNumber', argument: 4, argumentIndex: 0, label_ar: 'استدعاء الدالة', label_en: 'Function call', note_ar: 'استدعِ doubleNumber مع الوسيط العددي 4.', note_en: 'Call doubleNumber with the numeric argument 4.', concept_ar: 'الوسيط قيمة تمرر عند الاستدعاء.', concept_en: 'An argument is a value passed when calling a function.' },
    ],
    quiz: quiz(
      question('function-parameter', 'ما دور `number` في `function doubleNumber(number)`؟', 'What is the role of `number` in `function doubleNumber(number)`?', ['معامل يستقبل مدخلًا', 'قيمة HTML', 'اسم ملف', 'نوع حدث'], ['A parameter that receives an input', 'An HTML value', 'A file name', 'An event type'], 0, 'صحيح: number معامل محلي يستقبل قيمة الاستدعاء.', 'Correct: number is a local parameter that receives the call value.', 'المعامل داخل الأقواس يعرّف مدخلًا للدالة.', 'A parameter inside the parentheses defines a function input.', 'الوسيط الفعلي يمرر عند استدعاء الدالة.', 'The actual argument is passed when the function is called.'),
      question('return-purpose', 'ماذا تفعل `return` داخل الدالة؟', 'What does `return` do inside a function?', ['تعيد قيمة إلى المستدعي', 'تنسّق الصفحة', 'تضيف عنصرًا تلقائيًا', 'تستورد ملفًا'], ['Returns a value to the caller', 'Styles the page', 'Automatically adds an element', 'Imports a file'], 0, 'صحيح: return ترسل النتيجة إلى موضع الاستدعاء.', 'Correct: return sends a result back to the call site.', 'عرض قيمة في console ليس هو نفسه إعادتها.', 'Displaying a value in the console is not the same as returning it.', 'اكتب return قبل التعبير الذي يمثل الناتج.', 'Write return before the expression that represents the result.'),
      question('scope-parameter', 'أين يكون معامل الدالة متاحًا عادةً؟', 'Where is a function parameter usually available?', ['داخل نطاق الدالة التي تستقبله', 'في كل ملف تلقائيًا', 'في HTML فقط', 'داخل CSS'], ['Within the scope of the function that receives it', 'Automatically throughout every file', 'Only in HTML', 'Inside CSS'], 0, 'صحيح: المعامل اسم محلي داخل نطاق الدالة.', 'Correct: the parameter is a local name in the function scope.', 'لا تفترض أن الاسم المحلي متاح خارج الدالة.', 'Do not assume a local name is available outside the function.', 'النطاق يحدد مواضع إتاحة الأسماء.', 'Scope determines where names are available.'),
    ),
  },

  'js-objects': {
    path_id: 'javascript-fundamentals', title_ar: 'الكائنات والخصائص', title_en: 'Objects and Properties',
    objective_ar: 'أنشئ كائنًا يربط أسماء الخصائص بقيم، ثم استخدم الوصول النقطي لتحديث خاصية نصية.',
    objective_en: 'Create an object that maps property names to values, then use dot notation to update a string property.',
    outcome_ar: 'أستطيع إنشاء كائن بسيط وقراءة خاصية منه وتحديث خاصية باسمها.', outcome_en: 'I can create a simple object, read a property, and update a named property.',
    steps: [
      { title_ar: 'المفهوم: بيانات مترابطة', title_en: 'Concept: related data', body_ar: 'الكائن يجمع قيمًا تحت أسماء خصائص، مثل `name` و`role`. يساعد ذلك على تمثيل شيء واحد ببيانات مترابطة.', body_en: 'An object groups values under property names such as `name` and `role`. This represents one thing with related data.' },
      { title_ar: 'مثال وقراءة الخاصية', title_en: 'Example and property access', body_ar: 'في `profile.name` نبدأ بالكائن ثم نكتب نقطة واسم الخاصية. يمكن قراءة القيمة أو إسناد قيمة جديدة إليها.', body_en: 'In `profile.name`, start with the object, then a dot and the property name. You can read its value or assign a new one.' },
      { title_ar: 'خطأ شائع وحدود الفحص', title_en: 'Common mistake and checker limits', body_ar: 'اسم الخاصية نص حساس لحالة الأحرف، و`profile.Name` يختلف عن `profile.name`. الفحص هنا يلتقط إسناد خصائص نصية محددة، ولا يثبت شكل الكائن كاملًا أو سلوكه.', body_en: 'Property names are case-sensitive, so `profile.Name` differs from `profile.name`. This check detects specific string-property assignments; it does not prove the complete object shape or behavior.' },
    ],
    example_code: 'const profile = { name: "Lina", role: "Learner" };\nprofile.name = "Omar";\nconsole.log(profile.role);',
    code_explanation: [
      { code: '{ name: "Lina", role: "Learner" }', why_ar: 'ينشئ كائنًا بخصائص نصية؛ النقطتان تفصلان اسم الخاصية عن قيمتها.', why_en: 'Creates an object with string properties; the colon separates a property name from its value.' },
      { code: 'profile.name = "Omar"', why_ar: 'يحدّث قيمة خاصية name في الكائن profile.', why_en: 'Updates the value of the name property on profile.' },
      { code: 'profile.role', why_ar: 'يقرأ قيمة خاصية role باستخدام الوصول النقطي.', why_en: 'Reads the role property using dot notation.' },
    ],
    practice_ar: '١. أنشئ كائنًا باسم `profile` باستخدام `const`. ٢. أسند النص `"Mina"` إلى `profile.name`. ٣. أسند النص `"Learner"` إلى `profile.role`. يتحقق المدقق من تعريف الكائن والإسنادين، ولا يفحص بقية حقوله.',
    practice_en: '1. Create a `profile` object with `const`. 2. Assign the string `"Mina"` to `profile.name`. 3. Assign the string `"Learner"` to `profile.role`. The checker verifies the object declaration and both assignments, not its other fields.',
    starter_html: '<p>أنشئ كائن profile ثم حدّث خصائصه.</p>', starter_css: '', starter_js: '',
    validation_rules: [
      { id: 'profile-object-declaration', type: 'js-declaration', target: 'profile', property: 'const', expectedType: 'object', label_ar: 'إنشاء كائن profile', label_en: 'Create the profile object', note_ar: 'عرّف profile باستخدام const وأسند إليه كائنًا.', note_en: 'Declare profile with const and initialize it with an object.', concept_ar: 'يجمع الكائن بيانات مترابطة تحت أسماء خصائص.', concept_en: 'An object groups related data under property names.' },
      { id: 'profile-name-assignment', type: 'js-property-assignment', target: 'profile.name', value: 'Mina', label_ar: 'خاصية الاسم', label_en: 'Name property', note_ar: 'أسند النص "Mina" إلى profile.name.', note_en: 'Assign the string "Mina" to profile.name.', concept_ar: 'الوصول النقطي يحدد خاصية كائن.', concept_en: 'Dot notation identifies an object property.' },
      { id: 'profile-role-assignment', type: 'js-property-assignment', target: 'profile.role', value: 'Learner', label_ar: 'خاصية الدور', label_en: 'Role property', note_ar: 'أسند النص "Learner" إلى profile.role.', note_en: 'Assign the string "Learner" to profile.role.', concept_ar: 'يمكن تحديث خصائص الكائن بإسناد قيمة إليها.', concept_en: 'Object properties can be updated by assigning a value.' },
    ],
    quiz: quiz(
      question('object-purpose', 'ما الذي يجمعه الكائن عادةً؟', 'What does an object commonly group?', ['قيمًا تحت أسماء خصائص', 'قواعد CSS فقط', 'طلبات شبكة فقط', 'عناصر مصفوفة بلا أسماء'], ['Values under named properties', 'CSS rules only', 'Network requests only', 'Array items without names'], 0, 'صحيح: الكائن يربط أسماء الخصائص بقيمها.', 'Correct: an object connects property names with their values.', 'تخيّل سجلًا له حقول مثل name وrole.', 'Think of a record with fields such as name and role.', 'الخاصية اسم والقيمة هي البيانات المرتبطة به.', 'A property is a name, and its value is the associated data.'),
      question('object-dot', 'كيف نقرأ خاصية `name` من الكائن `profile`؟', 'How do you read the `name` property from `profile`?', ['profile.name', 'profile->name', 'name.profile()', '#profile name'], ['profile.name', 'profile->name', 'name.profile()', '#profile name'], 0, 'صحيح: النقطة تصل الكائن باسم الخاصية.', 'Correct: a dot connects the object to its property name.', 'اكتب اسم الكائن ثم نقطة ثم الخاصية.', 'Write the object name, a dot, and then the property.', 'الوصول النقطي صيغة شائعة لقراءة الخاصية.', 'Dot notation is a common way to read a property.'),
      question('object-case', 'هل `profile.Name` هي الخاصية نفسها `profile.name`؟', 'Is `profile.Name` the same property as `profile.name`?', ['نعم، حالة الأحرف لا تهم', 'لا، أسماء الخصائص حساسة لحالة الأحرف', 'نعم إذا كانت القيمة نصًا', 'لا، لأن النقطة ممنوعة'], ['Yes, capitalization does not matter', 'No, property names are case-sensitive', 'Yes, if the value is a string', 'No, because dots are forbidden'], 1, 'صحيح: Name وname اسمان مختلفان.', 'Correct: Name and name are different names.', 'طابق الأحرف تمامًا مع اسم الخاصية.', 'Match the capitalization exactly with the property name.', 'انتبه إلى حالة الأحرف عند الوصول إلى الخصائص.', 'Pay attention to capitalization when accessing properties.'),
    ),
  },

  'js-array-methods': {
    path_id: 'javascript-fundamentals', title_ar: 'طرائق المصفوفات: map وfilter', title_en: 'Array Methods: map and filter',
    objective_ar: 'استخدم filter لاختيار العناصر المطابقة لشرط، وmap لإنتاج مصفوفة جديدة من تحويل العناصر.',
    objective_en: 'Use filter to select items that match a condition, and map to create a new array by transforming items.',
    outcome_ar: 'أستطيع شرح الفرق بين اختيار بعض العناصر وتحويل كل عنصر في المصفوفة.', outcome_en: 'I can explain the difference between selecting some items and transforming every array item.',
    steps: [
      { title_ar: 'المفهوم: اختَر أو حوّل', title_en: 'Concept: select or transform', body_ar: '`filter` يعيد العناصر التي ينجح معها الشرط. `map` يشغّل تحويلًا لكل عنصر ويجمع النتائج في مصفوفة جديدة.', body_en: '`filter` returns items for which a condition is true. `map` applies a transformation to every item and collects the results in a new array.' },
      { title_ar: 'اقرأ المثال', title_en: 'Read the example', body_ar: 'نختار الدرجات التي لا تقل عن 70 باستخدام filter، ثم نحوّل الدرجات الناجحة إلى نصوص عرض باستخدام map.', body_en: 'We select scores of at least 70 with filter, then transform passing scores into display strings with map.' },
      { title_ar: 'خطأ شائع وانتقال', title_en: 'Common mistake and next step', body_ar: 'استخدم filter عندما تريد الاحتفاظ بالعناصر، وmap عندما تريد قيمة مقابلة لكل عنصر. التحقق البنيوي يرصد استدعاء الطريقتين ووجود callback، ولا يقيّم منطق callback أو ناتج المصفوفة.', body_en: 'Use filter to keep items and map to produce a corresponding value for each item. Structural validation detects both method calls and callbacks, but does not evaluate callback logic or the resulting array.' },
    ],
    example_code: 'const scores = [62, 78, 91];\nconst passing = scores.filter((score) => score >= 70);\nconst labels = passing.map((score) => `Score: ${score}`);',
    code_explanation: [
      { code: 'scores.filter((score) => score >= 70)', why_ar: 'يعيد العناصر التي يحقق معها score الشرط.', why_en: 'Returns the items for which score satisfies the condition.' },
      { code: 'passing.map((score) => `Score: ${score}`)', why_ar: 'ينشئ قيمة عرض لكل عنصر ناجح.', why_en: 'Creates a display value for each passing item.' },
    ],
    practice_ar: '١. عرّف `passing` باستخدام `const` واجعل قيمته ناتج `scores.filter` مع callback. ٢. عرّف `labels` باستخدام `const` واجعل قيمته ناتج `passing.map` مع callback. يفحص المدقق الإسناد والـcallback، لا منطق التحويل أو النتيجة.',
    practice_en: '1. Declare `passing` with `const` and initialize it with `scores.filter` using a callback. 2. Declare `labels` with `const` and initialize it with `passing.map` using a callback. The checker verifies the assignments and callbacks, not callback logic or output.',
    starter_html: '<p>استخدم filter للاختيار وmap للتحويل.</p>', starter_css: '', starter_js: 'const scores = [62, 78, 91];',
    validation_rules: [
      { id: 'scores-filter-call', type: 'js-method-assignment', target: 'passing', source: 'scores', method: 'filter', requireCallback: true, label_ar: 'إسناد نتيجة filter', label_en: 'Assign the filter result', note_ar: 'عرّف passing باستخدام const وأسند إليه scores.filter(callback).', note_en: 'Declare passing with const and assign scores.filter(callback).', concept_ar: 'يحفظ الإسناد المصفوفة الجديدة التي تعيدها filter.', concept_en: 'The assignment stores the new array returned by filter.' },
      { id: 'passing-map-call', type: 'js-method-assignment', target: 'labels', source: 'passing', method: 'map', requireCallback: true, label_ar: 'إسناد نتيجة map', label_en: 'Assign the map result', note_ar: 'عرّف labels باستخدام const وأسند إليه passing.map(callback).', note_en: 'Declare labels with const and assign passing.map(callback).', concept_ar: 'يحفظ الإسناد المصفوفة الجديدة التي تعيدها map.', concept_en: 'The assignment stores the new array returned by map.' },
    ],
    quiz: quiz(
      question('filter-role', 'ماذا تعيد filter عادةً؟', 'What does filter typically return?', ['العناصر التي تحقق الشرط', 'عدد العناصر فقط', 'نص HTML', 'دالة جديدة دائمًا'], ['Items that satisfy the condition', 'Only the item count', 'HTML text', 'Always a new function'], 0, 'صحيح: filter تختار العناصر التي ينجح معها callback.', 'Correct: filter selects items for which the callback succeeds.', 'تذكّر معنى الاختيار والاحتفاظ بالعناصر.', 'Remember the idea of selecting and keeping items.', 'استعمل filter عندما تريد مجموعة فرعية من العناصر.', 'Use filter when you want a subset of the items.'),
      question('map-role', 'ماذا تفعل map بالعناصر؟', 'What does map do to items?', ['تحوّل كل عنصر إلى قيمة مقابلة', 'تحذف كل العناصر', 'توقف الصفحة', 'تختار أول عنصر فقط دائمًا'], ['Transforms each item into a corresponding value', 'Deletes all items', 'Stops the page', 'Always selects only the first item'], 0, 'صحيح: map تنتج نتيجة لكل عنصر.', 'Correct: map produces a result for each item.', 'فكر في تحويل عنصر واحد ثم تكراره على المصفوفة.', 'Think of transforming one item, then repeating that for the array.', 'map مناسبة لبناء مصفوفة جديدة محوّلة.', 'map is useful for building a transformed array.'),
      question('map-filter-difference', 'أي عبارة تصف الفرق بين الطريقتين؟', 'Which statement describes the difference between the methods?', ['filter يختار، وmap يحوّل', 'كلاهما يضيف عنصرًا إلى الصفحة', 'map يتحقق من النماذج فقط', 'filter يستورد الوحدات'], ['filter selects; map transforms', 'Both add an element to the page', 'map validates forms only', 'filter imports modules'], 0, 'صحيح: الاختيار مقابل التحويل هو الفرق الأساسي.', 'Correct: selection versus transformation is the key distinction.', 'اسأل: هل أريد الاحتفاظ ببعض العناصر أم إنتاج قيم جديدة؟', 'Ask: do I want to keep some items or produce new values?', 'اختر الطريقة بناءً على شكل الناتج الذي تحتاجه.', 'Choose the method based on the output you need.'),
    ),
  },

  'js-string-number-methods': {
    path_id: 'javascript-fundamentals', title_ar: 'طرائق النصوص والأعداد', title_en: 'String and Number Methods',
    objective_ar: 'استخدم طرائق نصية شائعة مثل trim، وتعرّف على فحص عددي مثل Number.isInteger.',
    objective_en: 'Use common string methods such as trim, and recognize a numeric check such as Number.isInteger.',
    outcome_ar: 'أستطيع إزالة المسافات المحيطة بنص وفحص ما إذا كانت قيمة عددًا صحيحًا.', outcome_en: 'I can remove surrounding whitespace from text and check whether a value is an integer.',
    steps: [
      { title_ar: 'المفهوم: الطرائق حسب النوع', title_en: 'Concept: methods by type', body_ar: 'النصوص والأعداد لها طرائق تساعد على معالجة قيمها. `trim()` تزيل المسافات من طرفي النص، و`Number.isInteger()` يفحص قيمة عددية.', body_en: 'Strings and numbers have methods that help work with their values. `trim()` removes whitespace from both ends of text, and `Number.isInteger()` checks a numeric value.' },
      { title_ar: 'مثال مشروح', title_en: 'Walk through the example', body_ar: 'نحفظ نتيجة trim في نص جديد ثم نفحص هل العدد الصحيح مناسب. استدعاء الطريقة لا يعني بالضرورة تعديل النص الأصلي؛ trim يعيد نصًا جديدًا.', body_en: 'We store the result of trim in a new string and then check whether the integer is suitable. Calling the method does not necessarily mutate the original string; trim returns a new string.' },
      { title_ar: 'خطأ شائع وانتقال', title_en: 'Common mistake and next step', body_ar: 'تذكّر الأقواس عند استدعاء الطريقة. القاعدتان تتحققان من وجود استدعاءي trim وNumber.isInteger، ولا تتحققان من القيمة أو صحة استخدامها.', body_en: 'Remember parentheses when calling a method. The two rules check for trim and Number.isInteger calls, not their values or whether they are used correctly.' },
    ],
    example_code: 'const rawName = "  Lina  ";\nconst cleanName = rawName.trim();\nconst isWhole = Number.isInteger(8);',
    code_explanation: [
      { code: 'rawName.trim()', why_ar: 'يعيد نسخة نصية بعد إزالة المسافات من الطرفين.', why_en: 'Returns a string with whitespace removed from both ends.' },
      { code: 'Number.isInteger(8)', why_ar: 'يعيد قيمة منطقية تبيّن هل القيمة عدد صحيح.', why_en: 'Returns a boolean indicating whether the value is an integer.' },
    ],
    practice_ar: '١. عرّف `cleanName` باستخدام `const` واجعل قيمته نتيجة `rawName.trim()`. ٢. استدعِ `Number.isInteger` مع وسيط عددي. يتحقق المدقق من إسناد نتيجة trim ونوع وسيط الفحص.',
    practice_en: '1. Declare `cleanName` with `const` and initialize it with the result of `rawName.trim()`. 2. Call `Number.isInteger` with a numeric argument. The checker validates the trim-result assignment and the checker argument type.',
    starter_html: '<p>جرّب طريقة نصية وفحصًا عدديًا.</p>', starter_css: '', starter_js: 'const rawName = "  Lina  ";',
    validation_rules: [
      { id: 'trim-result-assignment', type: 'js-method-assignment', target: 'cleanName', source: 'rawName', method: 'trim', label_ar: 'حفظ نتيجة trim', label_en: 'Store the trim result', note_ar: 'احفظ نتيجة rawName.trim() في متغير const اسمه cleanName.', note_en: 'Store the result of rawName.trim() in a const named cleanName.', concept_ar: 'trim تعيد نصًا جديدًا يجب إسناده إذا أردت استخدام النتيجة.', concept_en: 'trim returns a new string that should be assigned if you need the result.' },
      { id: 'integer-check-call', type: 'js-call', target: 'Number.isInteger', argumentType: 'number', argumentIndex: 0, minimumArguments: 1, label_ar: 'فحص قيمة عددية', label_en: 'Check a numeric value', note_ar: 'استدعِ Number.isInteger مع وسيط عددي.', note_en: 'Call Number.isInteger with a numeric argument.', concept_ar: 'الطريقة تفحص هل القيمة عدد صحيح.', concept_en: 'The method checks whether a value is an integer.' },
    ],
    quiz: quiz(
      question('trim-purpose', 'ماذا تفعل `trim()` بالنص؟', 'What does `trim()` do to a string?', ['تزيل المسافات من الطرفين', 'تحوّله إلى عدد دائمًا', 'تقسمه إلى ملفات', 'تحذف كل الحروف'], ['Removes whitespace from both ends', 'Always converts it to a number', 'Splits it into files', 'Deletes every character'], 0, 'صحيح: trim تزيل المسافات المحيطة.', 'Correct: trim removes surrounding whitespace.', 'المحتوى الداخلي لا يُحذف بمجرد trim.', 'The content in the middle is not removed by trim.', 'خزّن القيمة المعادة إذا أردت استخدامها لاحقًا.', 'Store the returned value if you want to use it later.'),
      question('trim-immutable', 'هل trim تعدّل النص الأصلي مباشرةً؟', 'Does trim directly mutate the original string?', ['نعم دائمًا', 'لا، تعيد نصًا جديدًا', 'تحذف المتغير', 'تحوّل النص إلى HTML'], ['Yes, always', 'No, it returns a new string', 'It deletes the variable', 'It converts the string to HTML'], 1, 'صحيح: النصوص غير قابلة للتغيير؛ trim تعيد قيمة نصية.', 'Correct: strings are immutable; trim returns a string value.', 'أسند النتيجة إذا أردت الاحتفاظ بالنسخة المنقّحة.', 'Assign the result if you want to keep the cleaned version.', 'الطريقة تعيد نصًا جديدًا بدل تعديل النص نفسه.', 'The method returns a new string instead of modifying the string itself.'),
      question('integer-method', 'ماذا يفحص `Number.isInteger(8)`؟', 'What does `Number.isInteger(8)` check?', ['هل القيمة عدد صحيح', 'هل النص طويل', 'هل العنصر موجود', 'هل الطلب نجح'], ['Whether the value is an integer', 'Whether the string is long', 'Whether an element exists', 'Whether a request succeeded'], 0, 'صحيح: هذه الطريقة تفحص العدد الصحيح.', 'Correct: this method checks for an integer.', 'اسم الطريقة يوضح أنها لفحص الأعداد الصحيحة.', 'The method name indicates an integer check.', 'تعرّف على الطرائق من النوع الذي تعمل عليه.', 'Recognize methods by the type they operate on.'),
    ),
  },

  'js-dom-manipulation': {
    path_id: 'javascript-fundamentals', title_ar: 'إنشاء عناصر DOM وتعديلها', title_en: 'Creating and Manipulating DOM Elements',
    objective_ar: 'اختر عنصرًا موجودًا، أنشئ عنصرًا جديدًا باستخدام document.createElement، ثم أضفه إلى الصفحة.',
    objective_en: 'Select an existing element, create a new element with document.createElement, and append it to the page.',
    outcome_ar: 'أستطيع تحديد حاوية موجودة وإنشاء عنصر وإضافة عقدة إليها.', outcome_en: 'I can select an existing container, create an element, and append a node to it.',
    steps: [
      { title_ar: 'المفهوم: DOM شجرة عناصر', title_en: 'Concept: the DOM is a tree', body_ar: 'يمثل DOM عناصر HTML كعقد مترابطة. يمكن لـ JavaScript البحث عن حاوية وإنشاء عقدة ثم إلحاقها بها.', body_en: 'The DOM represents HTML elements as connected nodes. JavaScript can find a container, create a node, and append it.' },
      { title_ar: 'مثال: أنشئ ثم أضف', title_en: 'Example: create, then append', body_ar: '`querySelector` يختار القائمة الموجودة. `createElement("li")` ينشئ عقدة عنصر، ثم `appendChild` يضيفها إلى القائمة.', body_en: '`querySelector` selects the existing list. `createElement("li")` creates an element node, and `appendChild` adds it to the list.' },
      { title_ar: 'خطأ شائع وحدود الفحص', title_en: 'Common mistake and checker limits', body_ar: 'إنشاء العنصر لا يضيفه وحده إلى الصفحة؛ اربطه بمتغير ثم ألحق المتغير نفسه بالحاوية. يتحقق المدقق من الربط بين العنصر المُنشأ والإلحاق، لكنه لا يشغّل DOM أو يثبت الظهور البصري وقت التشغيل.', body_en: 'Creating an element does not add it to the page; bind it to a variable, then append that same variable to the container. The checker verifies the structural link between creation and append, but does not run the DOM or prove visual appearance at runtime.' },
    ],
    example_code: 'const list = document.querySelector("#item-list");\nconst item = document.createElement("li");\nitem.textContent = "A new item";\nlist.appendChild(item);',
    code_explanation: [
      { code: 'document.querySelector("#item-list")', why_ar: 'يعثر على القائمة الموجودة في HTML باستخدام id.', why_en: 'Finds the existing list in the HTML by its id.' },
      { code: 'document.createElement("li")', why_ar: 'ينشئ عقدة li جديدة في الذاكرة.', why_en: 'Creates a new li node in memory.' },
      { code: 'list.appendChild(item)', why_ar: 'يلحق العقدة بالحاوية لتصبح جزءًا من DOM.', why_en: 'Appends the node to the container so it becomes part of the DOM.' },
    ],
    practice_ar: '١. اربط `list` بالقائمة الموجودة عبر `document.querySelector("#item-list")`. ٢. أنشئ `const item = document.createElement("li")`. ٣. استدعِ `list.appendChild(item)` لإضافة العنصر نفسه.',
    practice_en: '1. Bind `list` to the existing list with `document.querySelector("#item-list")`. 2. Create `const item = document.createElement("li")`. 3. Call `list.appendChild(item)` to append that same item.',
    starter_html: '<ul id="item-list"><li>Existing item</li></ul>', starter_css: '', starter_js: '',
    validation_rules: [
      { id: 'item-list-binding', type: 'js-selector-binding', variable: 'list', selector: '#item-list', expectedTag: 'ul', label_ar: 'اختيار القائمة', label_en: 'Select the list', note_ar: 'اربط المتغير list بعنصر ul الذي يحمل id="item-list" باستخدام querySelector.', note_en: 'Bind list to the ul with id="item-list" using querySelector.', concept_ar: 'اختيار عنصر موجود يحدد موضع الإضافة.', concept_en: 'Selecting an existing element identifies where to append.' },
      { id: 'create-list-item', type: 'js-method-assignment', target: 'item', source: 'document', method: 'createElement', argument: 'li', argumentIndex: 0, label_ar: 'إنشاء العنصر وحفظه', label_en: 'Create and store the element', note_ar: 'عرّف item باستخدام const وأسند إليه document.createElement("li").', note_en: 'Declare item with const and initialize it with document.createElement("li").', concept_ar: 'حفظ العقدة في متغير يسمح بإلحاق العقدة نفسها.', concept_en: 'Storing the node lets you append that same element.' },
      { id: 'append-list-item', type: 'js-call', target: 'list.appendChild', argumentVariable: 'item', argumentIndex: 0, minimumArguments: 1, label_ar: 'إلحاق العنصر نفسه', label_en: 'Append the same element', note_ar: 'استدعِ list.appendChild(item).', note_en: 'Call list.appendChild(item).', concept_ar: 'appendChild يضيف العقدة المحددة إلى عنصر أب.', concept_en: 'appendChild adds the specified node to a parent element.' },
    ],
    quiz: quiz(
      question('dom-create', 'ما وظيفة `document.createElement("li")`؟', 'What does `document.createElement("li")` do?', ['ينشئ عقدة li', 'يختار كل عناصر الصفحة', 'يرسل طلب شبكة', 'يحفظ قيمة دائمة'], ['Creates an li node', 'Selects every page element', 'Sends a network request', 'Stores a persistent value'], 0, 'صحيح: الاستدعاء ينشئ عقدة عنصر جديدة.', 'Correct: the call creates a new element node.', 'إنشاء العقدة لا يعني أنها أضيفت إلى الصفحة بعد.', 'Creating a node does not mean it has been added to the page yet.', 'تحتاج إلى إلحاق العقدة بحاوية.', 'You still need to append the node to a container.'),
      question('dom-append', 'ما دور `appendChild`؟', 'What is the role of `appendChild`?', ['إضافة عقدة إلى عنصر أب', 'تحويل رقم إلى نص', 'إزالة مسافات', 'تحويل JSON إلى object دائمًا'], ['Adds a node to a parent element', 'Converts a number to text', 'Removes whitespace', 'Always converts JSON to an object'], 0, 'صحيح: يضيف العقدة إلى شجرة DOM تحت الأب.', 'Correct: it adds a node under the parent in the DOM tree.', 'اختر الحاوية المناسبة قبل الإلحاق.', 'Choose the right container before appending.', 'الإنشاء والإلحاق خطوتان منفصلتان.', 'Creation and appending are separate steps.'),
      question('dom-selector', 'ما الذي يطابق المحدد `#item-list`؟', 'What does the selector `#item-list` match?', ['عنصر id الخاص به item-list', 'كل العناصر li', 'الفئة item-list', 'ملف JavaScript'], ['An element whose id is item-list', 'All li elements', 'The item-list class', 'A JavaScript file'], 0, 'صحيح: # في المحدد تشير إلى id.', 'Correct: # in the selector indicates an id.', 'طابق # مع قيمة id في HTML.', 'Match # with the id value in the HTML.', 'تأكد من أن العنصر موجود في HTML قبل اختياره.', 'Ensure the element exists in the HTML before selecting it.'),
    ),
  },

  'js-form-interactions': {
    path_id: 'javascript-fundamentals', title_ar: 'النماذج والأحداث والتحقق', title_en: 'Forms, Events, and Validation',
    objective_ar: 'اربط مستمع submit بنموذج واعرض رسالة نصية آمنة من داخل callback.',
    objective_en: 'Attach a submit listener to a form and display a safe text message from its callback.',
    outcome_ar: 'أستطيع اختيار نموذج ورسالة، وربط callback بحدث submit لإظهار feedback نصي.', outcome_en: 'I can select a form and message element, then connect a callback to submit for text feedback.',
    steps: [
      { title_ar: 'المفهوم: حدث submit', title_en: 'Concept: the submit event', body_ar: 'ينطلق submit عند إرسال النموذج. يسجّل `addEventListener` callback يعمل عند الحدث، ويمكن استدعاء `event.preventDefault()` لتجنب إعادة تحميل الصفحة أثناء التحقق.', body_en: 'The submit event fires when a form is submitted. `addEventListener` registers a callback, and `event.preventDefault()` can prevent a page reload while validating.' },
      { title_ar: 'مثال على التحقق', title_en: 'Example validation flow', body_ar: 'نقرأ الحقل ثم نفحص النص بعد trim. إذا كان فارغًا، نعرض رسالة ونوقف المسار؛ وإلا نتابع. يجب أن تصف الرسالة الخطأ بوضوح.', body_en: 'Read the field, then inspect its trimmed text. If it is empty, show a message and stop that path; otherwise continue. The message should clearly describe the issue.' },
      { title_ar: 'خطأ شائع وحدود الفحص', title_en: 'Common mistake and checker limits', body_ar: 'لا تستخدم زر الإرسال وحده بديلًا عن التحقق. القواعد تتحقق من اختيار النموذج واستدعاء مستمع submit ووجود إسناد نصي داخل callback، لكنها لا تثبت أن التحقق صحيح أو أن preventDefault نُفّذ.', body_en: 'Do not treat the submit button as a substitute for validation. The rules check form selection, a submit-listener call, and a text assignment in a callback; they do not prove correct validation or that preventDefault runs.' },
    ],
    example_code: 'const form = document.querySelector("#signup-form");\nconst nameInput = document.querySelector("#name");\nconst message = document.querySelector("#message");\nform.addEventListener("submit", (event) => {\n  event.preventDefault();\n  if (!nameInput.value.trim()) {\n    message.textContent = "Please enter a name.";\n    return;\n  }\n  message.textContent = "Form is ready.";\n});',
    code_explanation: [
      { code: 'form.addEventListener("submit", ...)', why_ar: 'يسجل callback يعمل عند إرسال النموذج.', why_en: 'Registers a callback that runs when the form is submitted.' },
      { code: 'event.preventDefault()', why_ar: 'يمنع سلوك المتصفح الافتراضي أثناء معالجة النموذج.', why_en: 'Prevents the browser’s default behavior while handling the form.' },
      { code: 'if (!nameInput.value.trim())', why_ar: 'يتحقق من أن الحقل لا يحتوي نصًا بعد إزالة المسافات.', why_en: 'Checks that the field contains text after surrounding whitespace is removed.' },
      { code: 'message.textContent = "Please enter a name."', why_ar: 'يعرض رسالة نصية آمنة للمستخدم.', why_en: 'Shows a safe text message to the user.' },
    ],
    practice_ar: '١. اربط `form` بالنموذج `#signup-form`. ٢. اربط `message` بالفقرة `#message`. ٣. أضف إلى `form` مستمع `submit` ومرّر callback. ٤. داخل callback، أسند النص "Please enter a name." إلى `message.textContent`. لا يفحص هذا التمرين منطق التحقق من الحقل أو استدعاء preventDefault.',
    practice_en: '1. Bind `form` to the `#signup-form` form. 2. Bind `message` to the `#message` paragraph. 3. Add a `submit` listener to `form` and pass a callback. 4. Inside the callback, assign "Please enter a name." to `message.textContent`. This exercise does not check field-validation logic or a call to preventDefault.',
    starter_html: '<form id="signup-form"><label for="name">Name</label><input id="name" name="name"><button type="submit">Send</button></form><p id="message"></p>', starter_css: '', starter_js: '',
    validation_rules: [
      { id: 'signup-form-binding', type: 'js-selector-binding', variable: 'form', selector: '#signup-form', expectedTag: 'form', label_ar: 'اختيار النموذج', label_en: 'Select the form', note_ar: 'اربط form بالنموذج ذي id signup-form الموجود في HTML.', note_en: 'Bind form to the form with id signup-form in the HTML.', concept_ar: 'يلزم اختيار النموذج لمعالجة حدث إرساله.', concept_en: 'Select the form to handle its submit event.' },
      { id: 'signup-message-binding', type: 'js-selector-binding', variable: 'message', selector: '#message', expectedTag: 'p', label_ar: 'اختيار عنصر الرسالة', label_en: 'Select the message element', note_ar: 'اربط message بالفقرة ذات id="message" الموجودة في HTML.', note_en: 'Bind message to the paragraph with id="message" in the HTML.', concept_ar: 'يجب اختيار عنصر موجود قبل تحديث نصه.', concept_en: 'Select an existing element before updating its text.' },
      { id: 'submit-listener', type: 'js-call', target: 'form.addEventListener', argument: 'submit', argumentIndex: 0, requireCallback: true, label_ar: 'مستمع submit مع callback', label_en: 'submit listener with callback', note_ar: 'سجّل على form مستمع submit ومرّر callback.', note_en: 'Register a submit listener on form and pass a callback.', concept_ar: 'المستمع ينفذ callback عند وقوع الحدث.', concept_en: 'A listener runs a callback when an event occurs.' },
      { id: 'form-message-assignment', type: 'js-property-assignment', target: 'message.textContent', value: 'Please enter a name.', withinCallback: true, label_ar: 'رسالة التحقق', label_en: 'Validation message', note_ar: 'داخل callback، أسند النص "Please enter a name." إلى message.textContent.', note_en: 'Inside the callback, assign "Please enter a name." to message.textContent.', concept_ar: 'تعرض textContent رسالة نصية بدل تفسيرها كـ HTML.', concept_en: 'textContent displays a text message instead of interpreting it as HTML.' },
    ],
    quiz: quiz(
      question('form-event', 'ما الحدث المناسب لمعالجة إرسال النموذج؟', 'Which event is appropriate for handling form submission?', ['submit', 'hover', 'resize', 'storage'], ['submit', 'hover', 'resize', 'storage'], 0, 'صحيح: submit يمثل إرسال النموذج.', 'Correct: submit represents form submission.', 'اربط المستمع بالنموذج نفسه.', 'Attach the listener to the form itself.', 'يعالج المستمع الحدث وقت وقوعه.', 'A listener handles the event when it occurs.'),
      question('prevent-default', 'لماذا قد يستدعي callback `event.preventDefault()`؟', 'Why might a callback call `event.preventDefault()`?', ['لمنع السلوك الافتراضي مثل إعادة تحميل الصفحة', 'لإنشاء CSS', 'لتحويل النص إلى عدد', 'لتصدير ملف'], ['To prevent default behavior such as a page reload', 'To create CSS', 'To convert text to a number', 'To export a file'], 0, 'صحيح: يمنع الإجراء الافتراضي كي تتم المعالجة المخصصة.', 'Correct: it prevents the default action so custom handling can run.', 'هذا لا يغني عن التحقق من بيانات الحقل.', 'This does not replace validating the field data.', 'تحقق ثم قرر هل تتابع أم تعرض رسالة.', 'Validate, then decide whether to continue or show a message.'),
      question('form-trim', 'لماذا نستخدم `trim()` قبل فحص حقل نصي؟', 'Why use `trim()` before checking a text field?', ['لكشف الإدخال الذي يتكون من مسافات فقط', 'لإضافة مسافات', 'لإرسال طلب شبكة', 'لإنشاء عنصر'], ['To detect input made only of whitespace', 'To add whitespace', 'To send a network request', 'To create an element'], 0, 'صحيح: بعد trim يمكن اكتشاف النص الفارغ أو المسافات وحدها.', 'Correct: after trim, empty or whitespace-only input can be detected.', 'لا تعتبر سلسلة المسافات اسمًا صالحًا.', 'Do not treat a whitespace-only string as a valid name.', 'تحقق من القيمة قبل اعتمادها.', 'Validate the value before accepting it.'),
    ),
  },

  'js-json': {
    path_id: 'javascript-fundamentals', title_ar: 'JSON: تحويل البيانات', title_en: 'JSON: Converting Data',
    objective_ar: 'حوّل كائن JavaScript إلى نص JSON باستخدام stringify، وأعد تحليل نص JSON صالح باستخدام parse.',
    objective_en: 'Convert a JavaScript object to JSON text with stringify, and parse valid JSON text with parse.',
    outcome_ar: 'أستطيع التمييز بين كائن JavaScript ونص JSON والتحويل بينهما.', outcome_en: 'I can distinguish a JavaScript object from JSON text and convert between them.',
    steps: [
      { title_ar: 'المفهوم: JSON صيغة نصية', title_en: 'Concept: JSON is a text format', body_ar: 'JSON صيغة نصية لتبادل البيانات. الكائن في الذاكرة قيمة JavaScript؛ أما JSON فهو تمثيل نصي مضبوط للقيم.', body_en: 'JSON is a text format for exchanging data. An in-memory object is a JavaScript value; JSON is a constrained text representation of values.' },
      { title_ar: 'اقرأ التحويلين', title_en: 'Read both conversions', body_ar: '`JSON.stringify` يحول الكائن إلى نص. `JSON.parse` يحول نص JSON صالحًا إلى قيمة JavaScript.', body_en: '`JSON.stringify` converts an object to text. `JSON.parse` converts valid JSON text into a JavaScript value.' },
      { title_ar: 'خطأ شائع وانتقال', title_en: 'Common mistake and next step', body_ar: 'لا تمرر كائنًا مباشرةً إلى parse ولا نصًا عاديًا غير JSON. القواعد تتحقق من وجود الاستدعاءين فقط، ولا تثبت أن النص صالح أو أن التحويل نجح.', body_en: 'Do not pass an object directly to parse or ordinary non-JSON text. The rules check only that both calls exist; they do not prove the text is valid or parsing succeeds.' },
    ],
    example_code: 'const user = { name: "Lina", active: true };\nconst jsonText = JSON.stringify(user);\nconst restoredUser = JSON.parse(jsonText);',
    code_explanation: [
      { code: 'JSON.stringify(user)', why_ar: 'ينتج نص JSON يمثل بيانات الكائن.', why_en: 'Produces JSON text representing the object’s data.' },
      { code: 'JSON.parse(jsonText)', why_ar: 'يقرأ نص JSON ويعيد قيمة JavaScript.', why_en: 'Reads JSON text and returns a JavaScript value.' },
    ],
    practice_ar: '١. أضف استدعاء `JSON.stringify` لتحويل قيمة إلى نص JSON. ٢. أضف استدعاء `JSON.parse` لتحليل النص. المطابقة بنيوية، ولا تثبت صلاحية النص أو نجاح التحليل عند التشغيل.',
    practice_en: '1. Add a `JSON.stringify` call to convert a value to JSON text. 2. Add a `JSON.parse` call to parse the text. Matching is structural and does not prove that the text is valid or parsing succeeds at runtime.',
    starter_html: '<p>حوّل البيانات إلى JSON ثم حلل النص.</p>', starter_css: '', starter_js: '',
    validation_rules: [
      { id: 'json-stringify-call', type: 'js-call', target: 'JSON.stringify', minimumArguments: 1, label_ar: 'تحويل قيمة إلى نص JSON', label_en: 'Convert a value to JSON text', note_ar: 'استدعِ JSON.stringify مع وسيط واحد على الأقل.', note_en: 'Call JSON.stringify with at least one argument.', concept_ar: 'stringify ينتج تمثيلًا نصيًا.', concept_en: 'stringify produces a text representation.' },
      { id: 'json-parse-call', type: 'js-call', target: 'JSON.parse', argumentType: 'string', argumentIndex: 0, label_ar: 'تحليل نص JSON', label_en: 'Parse JSON text', note_ar: 'مرّر إلى JSON.parse نصًا في الوسيط الأول.', note_en: 'Pass a string as the first argument to JSON.parse.', concept_ar: 'parse يعيد قيمة من التمثيل النصي.', concept_en: 'parse returns a value from the text representation.' },
    ],
    quiz: quiz(
      question('json-stringify', 'أي طريقة تحوّل قيمة JavaScript إلى نص JSON؟', 'Which method converts a JavaScript value to JSON text?', ['JSON.stringify', 'JSON.parse', 'JSON.read', 'JSON.toHTML'], ['JSON.stringify', 'JSON.parse', 'JSON.read', 'JSON.toHTML'], 0, 'صحيح: stringify ينتج النص.', 'Correct: stringify produces the text.', 'تذكر أن التحويل يبدأ من قيمة JavaScript إلى نص.', 'Remember that this conversion starts from a JavaScript value to text.', 'استخدم stringify عند إعداد نص JSON.', 'Use stringify when creating JSON text.'),
      question('json-parse', 'ما الذي تتوقعه `JSON.parse` كمدخل؟', 'What does `JSON.parse` expect as input?', ['نص JSON صالح', 'عنصر DOM', 'قاعدة CSS', 'دالة بلا وسيط'], ['Valid JSON text', 'A DOM element', 'A CSS rule', 'A function with no argument'], 0, 'صحيح: parse يقرأ نص JSON.', 'Correct: parse reads JSON text.', 'النص غير الصالح قد يؤدي إلى استثناء.', 'Invalid text may cause an exception.', 'تحقق من المصدر أو عالج أخطاء التحليل.', 'Validate the source or handle parsing errors.'),
      question('json-distinction', 'أي عبارة صحيحة عن JSON؟', 'Which statement about JSON is correct?', ['JSON صيغة نصية لتمثيل البيانات', 'JSON هو عنصر HTML', 'JSON لغة تنسيق CSS', 'JSON يخزن البيانات دائمًا على القرص'], ['JSON is a text format for representing data', 'JSON is an HTML element', 'JSON is a CSS styling language', 'JSON always stores data on disk'], 0, 'صحيح: JSON صيغة نصية وليست تخزينًا دائمًا بحد ذاتها.', 'Correct: JSON is a text format, not persistent storage by itself.', 'التمثيل لا يعني التخزين الدائم.', 'Representation does not imply persistent storage.', 'قد تستخدم JSON مع واجهات أو ملفات أو تخزين، لكنه ليس مخزنًا بذاته.', 'JSON may be used with APIs, files, or storage, but is not itself a storage system.'),
    ),
  },

  'js-local-storage': {
    path_id: 'javascript-fundamentals', title_ar: 'التخزين المحلي في المتصفح', title_en: 'Browser Local Storage',
    objective_ar: 'استخدم localStorage.setItem وgetItem لحفظ واسترجاع قيم نصية في المتصفح، وتعرّف إلى أن القيم المخزنة نصوص.',
    objective_en: 'Use localStorage.setItem and getItem to save and retrieve string values in the browser, and recognize that stored values are strings.',
    outcome_ar: 'أستطيع حفظ قيمة نصية بمفتاح واسترجاعها، مع فهم أن ذلك يعتمد على بيئة المتصفح.', outcome_en: 'I can save and retrieve a string using a key, understanding that this depends on the browser environment.',
    steps: [
      { title_ar: 'المفهوم: مفتاح وقيمة', title_en: 'Concept: key and value', body_ar: 'يوفر localStorage تخزينًا نصيًا مرتبطًا بأصل الموقع. استخدم مفتاحًا واضحًا لاسترجاع القيمة نفسها لاحقًا.', body_en: 'localStorage provides string storage associated with a site origin. Use a clear key to retrieve the same value later.' },
      { title_ar: 'حفظ واسترجاع', title_en: 'Save and retrieve', body_ar: '`setItem("theme", "dark")` يحفظ قيمة نصية. و`getItem("theme")` يعيدها أو يعيد null إذا لم يوجد المفتاح.', body_en: '`setItem("theme", "dark")` saves a string value. `getItem("theme")` retrieves it or returns null if the key is absent.' },
      { title_ar: 'تنبيه مهم', title_en: 'Important note', body_ar: 'تخزين كائن يتطلب عادةً تحويله إلى JSON أولًا. أمثلة هذا الدرس لا تحتاج preview؛ التحقق البنيوي لا يثبت اتصال المتصفح أو استمرار التخزين بين الجلسات.', body_en: 'Storing an object usually requires converting it to JSON first. The examples in this lesson do not require preview; structural validation does not prove browser access or persistence across sessions.' },
    ],
    example_code: 'localStorage.setItem("theme", "dark");\nconst savedTheme = localStorage.getItem("theme");',
    code_explanation: [
      { code: 'localStorage.setItem("theme", "dark")', why_ar: 'يحفظ النص dark تحت المفتاح theme.', why_en: 'Stores the string dark under the theme key.' },
      { code: 'localStorage.getItem("theme")', why_ar: 'يطلب القيمة المخزنة تحت المفتاح نفسه.', why_en: 'Requests the value stored under the same key.' },
    ],
    practice_ar: '١. استدعِ `localStorage.setItem` بالمفتاح `"theme"` وقيمة نصية. ٢. استدعِ `localStorage.getItem` بالمفتاح `"theme"`. لا يلزم preview؛ القواعد تفحص الاستدعاءات ومفتاحها فقط، ولا تثبت استمرار التخزين أو بيئة المتصفح.',
    practice_en: '1. Call `localStorage.setItem` with the key `"theme"` and a string value. 2. Call `localStorage.getItem` with the key `"theme"`. No preview is required; the rules check the calls and key only, not persistence or the browser environment.',
    starter_html: '<p>احفظ قيمة نصية بمفتاح ثم استرجعها.</p>', starter_css: '', starter_js: '',
    validation_rules: [
      { id: 'storage-set-theme', type: 'js-call', target: 'localStorage.setItem', argument: 'theme', argumentIndex: 0, minimumArguments: 2, argumentTypes: { 1: 'string' }, label_ar: 'حفظ قيمة نصية تحت theme', label_en: 'Save a string under theme', note_ar: 'استدعِ localStorage.setItem بالمفتاح "theme" وقيمة نصية في الوسيط الثاني.', note_en: 'Call localStorage.setItem with the key "theme" and a string as the second argument.', concept_ar: 'setItem يحفظ قيمة نصية مرتبطة بمفتاح.', concept_en: 'setItem saves a string value under a key.' },
      { id: 'storage-get-theme', type: 'js-call', target: 'localStorage.getItem', argument: 'theme', argumentIndex: 0, label_ar: 'استرجاع قيمة theme', label_en: 'Retrieve theme value', note_ar: 'استدعِ localStorage.getItem بالمفتاح "theme".', note_en: 'Call localStorage.getItem with the key "theme".', concept_ar: 'getItem يقرأ القيمة المخزنة تحت المفتاح.', concept_en: 'getItem reads the value stored under the key.' },
    ],
    quiz: quiz(
      question('storage-set', 'أي طريقة تحفظ قيمة في localStorage؟', 'Which method saves a value in localStorage?', ['setItem', 'getItem', 'querySelector', 'appendChild'], ['setItem', 'getItem', 'querySelector', 'appendChild'], 0, 'صحيح: setItem تحفظ قيمة تحت مفتاح.', 'Correct: setItem saves a value under a key.', 'getItem للقراءة لا للحفظ.', 'getItem is for reading, not saving.', 'عادةً مرر المفتاح ثم القيمة.', 'Typically pass the key, then the value.'),
      question('storage-get', 'ماذا قد يعيد getItem إذا لم يوجد المفتاح؟', 'What may getItem return if the key is absent?', ['null', 'عنصر HTML', 'دالة', 'CSS'], ['null', 'An HTML element', 'A function', 'CSS'], 0, 'صحيح: getItem يعيد null عند غياب المفتاح.', 'Correct: getItem returns null when the key is missing.', 'تحقق من القيمة قبل استخدامها.', 'Check the value before using it.', 'القيمة المسترجعة نصية أو null.', 'The retrieved value is a string or null.'),
      question('storage-type', 'ما نوع القيم التي يخزنها localStorage مباشرةً؟', 'What type of values does localStorage store directly?', ['نصوص', 'كائنات JavaScript كما هي', 'عناصر DOM', 'دوال قابلة للتنفيذ'], ['Strings', 'JavaScript objects as-is', 'DOM elements', 'Executable functions'], 0, 'صحيح: يخزن localStorage القيم كنصوص.', 'Correct: localStorage stores values as strings.', 'حوّل البيانات المركبة إلى JSON عند الحاجة.', 'Convert structured data to JSON when needed.', 'التخزين النصي لا يحفظ الدوال أو عقد DOM.', 'String storage does not preserve functions or DOM nodes.'),
    ),
  },

  'js-error-handling': {
    path_id: 'javascript-fundamentals', title_ar: 'التعامل مع الأخطاء: try وcatch', title_en: 'Error Handling: try and catch',
    objective_ar: 'استخدم try لتجربة عملية قد تفشل وcatch لمعالجة الاستثناء بدل توقف المسار دون تفسير.',
    objective_en: 'Use try to attempt an operation that may fail and catch to handle the exception instead of leaving the path unexplained.',
    outcome_ar: 'أستطيع شرح موضع الكود المعرض للفشل وكيفية التقاط الاستثناء وتقديم استجابة مناسبة.', outcome_en: 'I can explain where code may fail, how to catch the exception, and how to provide an appropriate response.',
    steps: [
      { title_ar: 'المفهوم: توقع الفشل', title_en: 'Concept: expect failure', body_ar: 'قد تفشل عمليات مثل تحليل JSON إذا كان النص غير صالح. يحيط try بالكود المحتمل فشله، ويستقبل catch الاستثناء.', body_en: 'Operations such as JSON parsing may fail when text is invalid. try wraps code that may fail, and catch receives the exception.' },
      { title_ar: 'اقرأ المثال', title_en: 'Read the example', body_ar: 'تجري محاولة التحليل داخل try. إذا حدث استثناء، ينتقل التنفيذ إلى catch حيث يمكن تسجيل الخطأ أو إظهار رسالة مفهومة.', body_en: 'Parsing is attempted inside try. If an exception occurs, execution moves to catch, where the error can be logged or explained to the user.' },
      { title_ar: 'خطأ شائع وحدود التحقق', title_en: 'Common mistake and checker limits', body_ar: 'لا تترك catch فارغًا إذا كان المستخدم يحتاج إلى معرفة المشكلة. لا توجد قاعدة بنيوية هنا تتحقق من try/catch؛ لذلك يطلب التمرين الجزء القابل للتحقق فقط وهو استدعاء JSON.parse، ولا يزعم التحقق من التقاط الخطأ.', body_en: 'Do not leave catch empty when the user needs to know what went wrong. No structural rule here validates try/catch, so the exercise asks only for the checkable part—the JSON.parse call—and does not claim to validate exception handling.' },
    ],
    example_code: 'const rawText = "{\\"ready\\": true}";\ntry {\n  const data = JSON.parse(rawText);\n  console.log(data.ready);\n} catch (error) {\n  console.log("Could not read the data.");\n}',
    code_explanation: [
      { code: 'try { ... }', why_ar: 'يحيط بالعملية التي قد ترمي استثناءً.', why_en: 'Wraps an operation that may throw an exception.' },
      { code: 'catch (error) { ... }', why_ar: 'يستقبل الاستثناء ويتيح معالجة مناسبة.', why_en: 'Receives the exception and allows an appropriate response.' },
      { code: 'JSON.parse(rawText)', why_ar: 'قد يرمي استثناء إذا كان النص ليس JSON صالحًا؛ هذه هي العملية التي نحيطها بالحماية.', why_en: 'May throw if the text is not valid JSON; this is the operation we protect.' },
    ],
    practice_ar: '١. اكتب `JSON.parse(rawText)`. يتحقق المدقق من استخدام rawText وسيطًا للتحليل فقط؛ وتعرّف في الشرح إلى سبب إحاطة العملية المحتمل فشلها بـ try/catch.',
    practice_en: '1. Write `JSON.parse(rawText)`. The checker verifies only that rawText is used as the parse argument; review the lesson to learn why a potentially failing operation should be wrapped in try/catch.',
    starter_html: '<p>تعامل مع احتمال فشل تحليل JSON.</p>', starter_css: '', starter_js: 'const rawText = "{\\"ready\\": true}";',
    validation_rules: [
      { id: 'safe-json-parse-call', type: 'js-call', target: 'JSON.parse', argumentVariable: 'rawText', argumentIndex: 0, minimumArguments: 1, label_ar: 'تحليل rawText', label_en: 'Parse rawText', note_ar: 'اكتب JSON.parse(rawText)؛ تذكّر إحاطته بـ try/catch بنفسك.', note_en: 'Write JSON.parse(rawText); remember to wrap it in try/catch yourself.', concept_ar: 'تحليل النص قد يفشل إذا لم يكن JSON صالحًا.', concept_en: 'Parsing may fail if the text is not valid JSON.' },
    ],
    quiz: quiz(
      question('try-purpose', 'ما الغرض من كتلة try؟', 'What is the purpose of a try block?', ['تجربة كود قد يرمي استثناءً', 'تنسيق عناصر الصفحة', 'حفظ قيمة دائمة', 'تعريف محدد CSS'], ['To attempt code that may throw an exception', 'To style page elements', 'To persist a value', 'To define a CSS selector'], 0, 'صحيح: نضع العملية المعرضة للفشل داخل try.', 'Correct: the operation that may fail goes in try.', 'فكر في عملية مثل تحليل JSON.', 'Think of an operation such as parsing JSON.', 'catch تعالج الاستثناء إذا وقع.', 'catch handles the exception if one occurs.'),
      question('catch-role', 'متى تعمل كتلة catch؟', 'When does a catch block run?', ['عند وقوع استثناء في الكتلة المرتبطة', 'بعد كل تعليمة دائمًا', 'فقط عند النقر', 'عند تحميل CSS'], ['When an exception occurs in the associated block', 'After every statement, always', 'Only on a click', 'When CSS loads'], 0, 'صحيح: catch تستقبل الاستثناء الناتج عن المحاولة.', 'Correct: catch receives the exception from the attempted operation.', 'استخدمها لمعالجة الفشل أو توضيحه.', 'Use it to handle or explain the failure.', 'لا تجعل الأخطاء المحتملة غير مرئية للمستخدم عند الحاجة.', 'Do not hide possible failures from users when they need to know.'),
      question('parse-risk', 'لماذا قد نحيط JSON.parse بكتلة try/catch؟', 'Why might we wrap JSON.parse in try/catch?', ['قد يرمي استثناء عند نص غير صالح', 'لأنه يضيف CSS', 'لأنه يرسل بريدًا', 'لأنه ينشئ حلقة'], ['It may throw on invalid text', 'Because it adds CSS', 'Because it sends email', 'Because it creates a loop'], 0, 'صحيح: النص غير الصالح قد يفشل تحليله.', 'Correct: invalid text may fail to parse.', 'التقاط الاستثناء يتيح مسار معالجة واضحًا.', 'Catching the exception allows a clear recovery path.', 'تحقق من المدخل وعالج الاستثناءات المتوقعة.', 'Validate input and handle expected exceptions.'),
    ),
  },

  'js-promises-async': {
    path_id: 'javascript-fundamentals', title_ar: 'Promises وasync/await', title_en: 'Promises and async/await',
    objective_ar: 'تعرّف إلى Promise كتمثيل لنتيجة مستقبلية، واستخدم then أو صياغة async/await لفهم تدفق العمل غير المتزامن.',
    objective_en: 'Recognize a Promise as a future result, and use then or async/await syntax to understand asynchronous flow.',
    outcome_ar: 'أستطيع وصف حالات Promise وقراءة نمط انتظار نتيجة قبل متابعة العمل.', outcome_en: 'I can describe Promise states and read a pattern that waits for a result before continuing.',
    steps: [
      { title_ar: 'المفهوم: نتيجة لاحقة', title_en: 'Concept: a result later', body_ar: 'يمثل `Promise` عملية قد تكتمل أو ترفض لاحقًا. يمكن متابعة النجاح والفشل عبر `then` و`catch`، أو كتابة دالة `async` تستخدم `await`.', body_en: 'A Promise represents an operation that may fulfill or reject later. Follow success and failure with then and catch, or write an async function that uses await.' },
      { title_ar: 'مثال: سلسلتان لقراءة التدفق', title_en: 'Example: two ways to read the flow', body_ar: 'يعرض المثال `Promise.resolve` مع `then`، ثم دالة `async` تنتظر `Promise` نفسها باستخدام `await`. في التطبيق الحقيقي، قد يكون مصدر `Promise` طلب شبكة أو مؤقتًا.', body_en: 'The example shows Promise.resolve with then, followed by an async function that waits for the same Promise with await. In a real app, the Promise might come from a network request or timer.' },
      { title_ar: 'خطأ شائع وحدود التحقق', title_en: 'Common mistake and checker limits', body_ar: 'قيمة `Promise` ليست بالضرورة النتيجة النهائية؛ تعامل مع الرفض أيضًا. لا توجد قاعدة تحقق مباشرة لـ`async/await`، لذلك يطلب التمرين نمط `Promise` و`then` القابلين للرصد، ولا يدّعي التحقق من الانتظار أو نتيجة التنفيذ.', body_en: 'A Promise value is not necessarily the final result; handle rejection too. There is no rule that directly validates async/await, so the exercise asks for the detectable Promise and then pattern and does not claim to validate awaiting or runtime results.' },
    ],
    example_code: 'const task = Promise.resolve("Ready");\ntask.then((value) => console.log(value));\nasync function readTask() {\n  const value = await task;\n  return value;\n}',
    code_explanation: [
      { code: 'Promise.resolve("Ready")', why_ar: 'ينشئ Promise مكتملًا بالقيمة النصية Ready.', why_en: 'Creates a Promise fulfilled with the string Ready.' },
      { code: 'task.then((value) => ...)', why_ar: 'يسجل callback يعمل عندما تتوفر القيمة.', why_en: 'Registers a callback that runs when the value is available.' },
      { code: 'await task', why_ar: 'ينتظر النتيجة داخل دالة async ثم يتيح متابعة التنفيذ بها.', why_en: 'Waits for the result inside an async function and then allows execution to continue with it.' },
    ],
    practice_ar: '١. عرّف `task` باستخدام `const` واجعله ناتج `Promise.resolve("Ready")`. ٢. استدعِ `task.then` ومرّر callback. يعرض المثال صياغة async/await؛ لا يتحقق هذا التمرين من await أو معالجة الرفض.',
    practice_en: '1. Declare `task` with `const` and assign `Promise.resolve("Ready")` to it. 2. Call `task.then` and pass a callback. The example also shows async/await; this exercise does not validate await or rejection handling.',
    starter_html: '<p>اقرأ تدفق Promise ثم قارنه بـ async/await.</p>', starter_css: '', starter_js: '',
    validation_rules: [
      { id: 'resolved-promise', type: 'js-method-assignment', target: 'task', source: 'Promise', method: 'resolve', argument: 'Ready', argumentIndex: 0, label_ar: 'حفظ Promise', label_en: 'Store the Promise', note_ar: 'عرّف task باستخدام const وأسند إليه Promise.resolve("Ready").', note_en: 'Declare task with const and assign Promise.resolve("Ready") to it.', concept_ar: 'يحفظ المتغير promise التي ستُتابع لاحقًا.', concept_en: 'The variable stores the Promise that will be handled next.' },
      { id: 'promise-then', type: 'js-call', target: 'task.then', requireCallback: true, label_ar: 'متابعة Promise', label_en: 'Continue a Promise', note_ar: 'استدعِ task.then مع callback للتعامل مع القيمة.', note_en: 'Call task.then with a callback to handle the value.', concept_ar: 'then يحدد ما يحدث عند اكتمال Promise.', concept_en: 'then specifies what happens when a Promise fulfills.' },
    ],
    quiz: quiz(
      question('promise-meaning', 'ماذا تمثل Promise؟', 'What does a Promise represent?', ['نتيجة عملية قد تتاح لاحقًا', 'عنصر HTML', 'قاعدة CSS', 'قيمة لا تتغير أبدًا'], ['A result that may become available later', 'An HTML element', 'A CSS rule', 'A value that never changes'], 0, 'صحيح: Promise تمثل نتيجة مستقبلية لعملية غير متزامنة.', 'Correct: a Promise represents a future result of an asynchronous operation.', 'القيمة النهائية قد لا تكون متاحة فورًا.', 'The final value may not be available immediately.', 'خطط لمساري النجاح والرفض.', 'Plan for both fulfillment and rejection.'),
      question('async-await', 'أين نستخدم await عادةً؟', 'Where is await typically used?', ['داخل دالة async', 'داخل محدد CSS', 'في سمة HTML', 'داخل اسم ملف فقط'], ['Inside an async function', 'Inside a CSS selector', 'In an HTML attribute', 'Only in a file name'], 0, 'صحيح: await تستخدم عادة داخل دالة async.', 'Correct: await is typically used inside an async function.', 'تنتظر Promise قبل متابعة السطر التالي.', 'It waits for a Promise before continuing to the next line.', 'قد تحتاج إلى try/catch لمعالجة الرفض.', 'You may need try/catch to handle rejection.'),
      question('promise-then', 'ما دور callback الممرر إلى then؟', 'What is the role of the callback passed to then?', ['التعامل مع القيمة عند نجاح Promise', 'إنشاء CSS', 'حذف التخزين المحلي', 'تغيير نوع الملف'], ['Handle the value when the Promise fulfills', 'Create CSS', 'Delete local storage', 'Change the file type'], 0, 'صحيح: then يربط عملًا بنتيجة النجاح.', 'Correct: then attaches work to the fulfilled result.', 'تعامل مع الرفض أيضًا عند الحاجة.', 'Handle rejection too when appropriate.', 'النتيجة تمر إلى callback عند توفرها.', 'The result is passed to the callback when available.'),
    ),
  },

  'js-fetch': {
    path_id: 'javascript-fundamentals', title_ar: 'جلب البيانات باستخدام Fetch', title_en: 'Fetching Data with Fetch',
    objective_ar: 'احفظ نتيجة fetch في متغير response، ثم اقرأ جسمها عبر response.json().',
    objective_en: 'Store the fetch result in a response variable, then read its body with response.json().',
    outcome_ar: 'أستطيع ترتيب خطوات الطلب والتحقق من الاستجابة وتحويل جسمها إلى JSON.', outcome_en: 'I can order the request, response check, and JSON-body parsing steps.',
    steps: [
      { title_ar: 'المفهوم: الطلب والاستجابة', title_en: 'Concept: request and response', body_ar: '`fetch(url)` يبدأ طلبًا ويعيد Promise لاستجابة. لا يعني وصول response أن الخادم أعاد حالة نجاح؛ افحص `response.ok` صراحةً.', body_en: '`fetch(url)` starts a request and returns a Promise for a response. Receiving a response does not mean the server returned a success status; check `response.ok` explicitly.' },
      { title_ar: 'اقرأ التسلسل', title_en: 'Read the sequence', body_ar: 'بعد fetch، افحص الاستجابة، ثم استدعِ `response.json()` لقراءة جسم JSON. هذه الطريقة غير متزامنة أيضًا وتعيد Promise.', body_en: 'After fetch, check the response, then call `response.json()` to read a JSON body. This method is asynchronous too and returns a Promise.' },
      { title_ar: 'تنبيه وحدود الفحص', title_en: 'Caution and checker limits', body_ar: 'تعامل مع رفض الشبكة أو استجابة غير ناجحة. لا يلزم preview للأمثلة؛ القواعد تتحقق بنيويًا من وجود fetch وقراءة JSON فقط، ولا تثبت اتصال الشبكة أو فحص response.ok أو صحة البيانات.', body_en: 'Handle network rejection and unsuccessful responses. The examples do not require preview; rules structurally check only for fetch and JSON reading, not network connectivity, response.ok checks, or data correctness.' },
    ],
    example_code: 'async function loadItems() {\n  const response = await fetch("https://example.com/items");\n  if (!response.ok) {\n    throw new Error("Request failed");\n  }\n  const items = await response.json();\n  return items;\n}',
    code_explanation: [
      { code: 'await fetch("https://example.com/items")', why_ar: 'ينتظر استجابة الطلب؛ fetch نفسه يعيد Promise.', why_en: 'Waits for the request response; fetch itself returns a Promise.' },
      { code: 'if (!response.ok)', why_ar: 'يفحص نجاح حالة HTTP لأن fetch لا يرفض تلقائيًا لكل حالات الخطأ HTTP.', why_en: 'Checks for an HTTP success status because fetch does not automatically reject for every HTTP error status.' },
      { code: 'await response.json()', why_ar: 'يقرأ جسم الاستجابة ويحوله من JSON إلى قيمة JavaScript.', why_en: 'Reads the response body and converts JSON into a JavaScript value.' },
    ],
    practice_ar: '١. عرّف `response` باستخدام `const` واجعل قيمته نتيجة `fetch` مع عنوان نصي. ٢. عرّف `items` باستخدام `const` واجعل قيمته نتيجة `response.json()`. يشرح الدرس `response.ok` ومعالجة الأخطاء، لكن المدقق لا يفحصهما ولا ينفذ اتصالًا شبكيًا.',
    practice_en: '1. Declare `response` with `const` and initialize it with a `fetch` call using a string URL. 2. Declare `items` with `const` and initialize it with `response.json()`. The lesson explains `response.ok` and error handling, but the checker does not validate them or make a network request.',
    starter_html: '<p>اكتب نمط Fetch في محرر JavaScript؛ لن ينفذ الفحص طلبًا شبكيًا.</p>', starter_css: '', starter_js: '',
    validation_rules: [
      { id: 'fetch-request', type: 'js-method-assignment', target: 'response', callTarget: 'fetch', argumentType: 'string', argumentIndex: 0, minimumArguments: 1, label_ar: 'حفظ استجابة Fetch', label_en: 'Store the fetch response', note_ar: 'عرّف response باستخدام const وأسند إليه نتيجة fetch بعنوان نصي.', note_en: 'Declare response with const and assign it the result of fetch with a string URL.', concept_ar: 'يحفظ المتغير الاستجابة التي ستُقرأ لاحقًا.', concept_en: 'The variable stores the response that will be read next.' },
      { id: 'response-json-call', type: 'js-method-assignment', target: 'items', source: 'response', method: 'json', label_ar: 'حفظ بيانات JSON', label_en: 'Store the JSON data', note_ar: 'عرّف items باستخدام const وأسند إليه response.json().', note_en: 'Declare items with const and assign response.json() to it.', concept_ar: 'يحفظ الإسناد نتيجة قراءة جسم الاستجابة.', concept_en: 'The assignment stores the response-body parsing result.' },
    ],
    quiz: quiz(
      question('fetch-response', 'هل تعني عودة response من fetch أن حالة HTTP ناجحة؟', 'Does receiving a response from fetch mean the HTTP status succeeded?', ['نعم دائمًا', 'لا، افحص response.ok', 'تعني أن JSON صحيح', 'تعني أن الاتصال آمن حتمًا'], ['Yes, always', 'No, check response.ok', 'It means the JSON is valid', 'It guarantees a secure connection'], 1, 'صحيح: افحص response.ok لمعرفة نجاح حالة HTTP.', 'Correct: check response.ok to determine HTTP status success.', 'استجابة HTTP قد تحمل حالة خطأ دون رفض Promise.', 'An HTTP response may carry an error status without rejecting the Promise.', 'افحص الحالة قبل استخدام البيانات.', 'Check the status before using the data.'),
      question('fetch-json', 'ما وظيفة `response.json()`؟', 'What does `response.json()` do?', ['يقرأ جسم الاستجابة بوصفه JSON', 'يرسل ملفًا CSS', 'يحفظ قيمة محليًا', 'يختار عنصرًا'], ['Reads the response body as JSON', 'Sends a CSS file', 'Stores a local value', 'Selects an element'], 0, 'صحيح: يحلل جسم الاستجابة كـ JSON.', 'Correct: it parses the response body as JSON.', 'قراءة الجسم قد ترفض أيضًا، لذا عالج الأخطاء.', 'Body reading may also reject, so handle errors.', 'تعامل مع القيمة المعادة كعملية غير متزامنة.', 'Treat the returned value as asynchronous.'),
      question('fetch-network-error', 'ما الذي ينبغي أخذه في الحسبان عند طلب شبكة؟', 'What should be considered when making a network request?', ['قد يفشل الاتصال أو تكون الاستجابة غير ناجحة', 'لا تحدث أخطاء أبدًا', 'fetch يخزن البيانات تلقائيًا', 'كل استجابة صورة'], ['The connection may fail or the response may be unsuccessful', 'Errors never happen', 'fetch stores data automatically', 'Every response is an image'], 0, 'صحيح: تعامل مع فشل الشبكة وحالات HTTP غير الناجحة.', 'Correct: handle network failure and unsuccessful HTTP statuses.', 'استخدم فحص الحالة ومسار معالجة للأخطاء.', 'Use a status check and an error-handling path.', 'تحقق من الاستجابة قبل اعتماد البيانات.', 'Check the response before trusting the data.'),
    ),
  },

  'js-modules-organization': {
    path_id: 'javascript-fundamentals', title_ar: 'الوحدات وتنظيم الشيفرة', title_en: 'Modules and Code Organization',
    objective_ar: 'نظّم الشيفرة في وحدات صغيرة، وميّز بين named export وnamed import عند مشاركة دوال بين الملفات.',
    objective_en: 'Organize code into small modules, and distinguish named exports from named imports when sharing functions across files.',
    outcome_ar: 'أستطيع شرح دور export وimport وتقسيم مسؤوليات البرنامج إلى ملفات واضحة.', outcome_en: 'I can explain export and import and split program responsibilities into clear files.',
    steps: [
      { title_ar: 'المفهوم: كل ملف مسؤولية', title_en: 'Concept: a responsibility per file', body_ar: 'تساعد الوحدات على تجميع شيفرة مرتبطة وتقليل ازدحام الملف الواحد. يمكن لملف أن يصدّر أسماء محددة ويستوردها ملف آخر.', body_en: 'Modules group related code and reduce clutter in a single file. One file can export named values for another file to import.' },
      { title_ar: 'التصدير والاستيراد بالأسماء المسماة', title_en: 'Named export/import', body_ar: '`export function formatLabel(...)` يصدّر اسمًا محددًا. ويستورد الملف الآخر الاسم نفسه بأقواس معقوفة: `import { formatLabel } from "./labels.js"`.', body_en: '`export function formatLabel(...)` exports a specific name. Another file imports the same name in curly braces: `import { formatLabel } from "./labels.js"`.' },
      { title_ar: 'خطأ شائع وحدود المحرر', title_en: 'Common mistake and editor limits', body_ar: 'يجب أن يطابق اسم الاستيراد اسم التصدير وحالة أحرفه. لا يلزم preview؛ لا توجد قاعدة تحقق export/import، لذا يطلب التمرين دالة واستدعاءً يمكن فحصهما بنيويًا، ولا يثبت تشغيل الوحدات في المحرر الحالي.', body_en: 'The imported name must match the exported name, including capitalization. No preview is required; there is no export/import rule, so the exercise asks for a function and call that can be checked structurally and does not prove module execution in the current editor.' },
    ],
    example_code: '// labels.js\nexport function formatLabel(text) {\n  return text.trim();\n}\n\n// app.js\nimport { formatLabel } from "./labels.js";\nconsole.log(formatLabel("  Ready  "));',
    code_explanation: [
      { code: 'export function formatLabel(text)', why_ar: 'يصدر دالة مسماة لتصبح قابلة للاستيراد من ملف آخر.', why_en: 'Exports a named function so another file can import it.' },
      { code: 'import { formatLabel } from "./labels.js"', why_ar: 'يستورد الاسم المصدّر نفسه من ملف labels.js.', why_en: 'Imports the same exported name from labels.js.' },
      { code: 'console.log(formatLabel("Ready"))', why_ar: 'يستدعي الدالة بعد إتاحتها في الملف المستورد.', why_en: 'Calls the function after it is available in the importing file.' },
    ],
    practice_ar: '١. عرّف دالة باسم `formatLabel` ومعامل اسمه `text`. ٢. أعد `text.trim()` من داخل الدالة. ٣. استدعِ `formatLabel` بالنص `"  Ready  "`. يعرض المثال named export/import للتعلّم؛ لا يلزم كتابة صيغة الوحدات في هذا المحرر.',
    practice_en: '1. Define a function named `formatLabel` with a parameter named `text`. 2. Return `text.trim()` from inside the function. 3. Call `formatLabel` with the string `"  Ready  "`. The example demonstrates named export/import; module syntax is not required in this editor.',
    starter_html: '<p>قسّم الدوال إلى ملفات منظمة، وراجع المثال المرفق.</p>', starter_css: '', starter_js: '',
    validation_rules: [
      { id: 'format-label-function', type: 'js-function', target: 'formatLabel', parameter: 'text', label_ar: 'تعريف الدالة المسماة', label_en: 'Named function declaration', note_ar: 'عرّف الدالة formatLabel بمعامل اسمه text.', note_en: 'Define the formatLabel function with a parameter named text.', concept_ar: 'الدالة الصغيرة ذات الاسم الواضح يسهل تنظيمها ومشاركتها.', concept_en: 'A small, clearly named function is easier to organize and share.' },
      { id: 'format-label-return-trim', type: 'js-function-return', functionName: 'formatLabel', parameter: 'text', method: 'trim', label_ar: 'إرجاع النص بعد trim', label_en: 'Return the trimmed text', note_ar: 'أعد text.trim() من داخل formatLabel.', note_en: 'Return text.trim() from formatLabel.', concept_ar: 'إزالة المسافات هنا جزء من نتيجة الدالة.', concept_en: 'Removing whitespace is part of this function’s result.' },
      { id: 'format-label-call', type: 'js-call', target: 'formatLabel', argument: '  Ready  ', argumentIndex: 0, label_ar: 'استدعاء الدالة', label_en: 'Call the function', note_ar: 'استدعِ formatLabel مع النص "  Ready  ".', note_en: 'Call formatLabel with the string "  Ready  ".', concept_ar: 'بعد تعريف الدالة يمكن استدعاؤها من موضع استخدامها.', concept_en: 'After defining a function, call it where it is used.' },
    ],
    quiz: quiz(
      question('module-export', 'ما دور named export؟', 'What is the role of a named export?', ['إتاحة اسم محدد لملفات أخرى', 'حفظ قيمة في localStorage', 'إرسال طلب fetch', 'تغيير لون CSS'], ['Make a specific name available to other files', 'Store a value in localStorage', 'Send a fetch request', 'Change a CSS color'], 0, 'صحيح: named export يتيح قيمة باسمها.', 'Correct: a named export exposes a value by name.', 'يجب أن يستورد الملف الآخر الاسم المطابق.', 'The other file must import the matching name.', 'يساعد التصدير والاستيراد على تقسيم الشيفرة.', 'Exports and imports help split code into modules.'),
      question('module-import', 'كيف يكتب named import عادةً؟', 'How is a named import typically written?', ['import { formatLabel } from "./labels.js"', 'استورد formatLabel() من HTML', 'حمّل formatLabel من CSS', 'صدّر localStorage كقيمة افتراضية'], ['import { formatLabel } from "./labels.js"', 'import formatLabel() from HTML', 'load formatLabel CSS', 'export default localStorage'], 0, 'صحيح: توضع الأسماء المسماة بين أقواس معقوفة.', 'Correct: named imports are written inside curly braces.', 'طابق الاسم والمسار مع الوحدة المصدّرة.', 'Match the name and path to the exporting module.', 'الاسم المستورد يجب أن يطابق الاسم المصدّر.', 'The imported name must match the exported name.'),
      question('module-organization', 'ما فائدة تقسيم البرنامج إلى وحدات؟', 'What is a benefit of splitting a program into modules?', ['تنظيم المسؤوليات وإعادة استخدام الشيفرة', 'منع كل الأخطاء تلقائيًا', 'تحويل JavaScript إلى CSS', 'إلغاء الحاجة إلى الاختبار'], ['Organize responsibilities and reuse code', 'Automatically prevent all errors', 'Turn JavaScript into CSS', 'Remove the need for testing'], 0, 'صحيح: الوحدات تنظّم الشيفرة وتتيح مشاركة الأسماء.', 'Correct: modules organize code and allow names to be shared.', 'التقسيم لا يلغي التحقق والاختبار.', 'Modularity does not remove the need for validation and testing.', 'اختر حدود ملفات تعكس مسؤوليات واضحة.', 'Choose file boundaries that reflect clear responsibilities.'),
    ),
  },
};
