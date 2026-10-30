import type { CssLessonId, JavaScriptLessonId } from './learningSystem';
import type { PracticeValidationRule } from './practiceTypes';

export type FoundationLessonContentId = CssLessonId | JavaScriptLessonId;

export interface FoundationLocalizedText {
  ar: string;
  en: string;
}

export interface FoundationStep {
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
}

export interface FoundationQuizChoice {
  id: string;
  text_ar: string;
  text_en: string;
  is_correct: boolean;
}

export interface FoundationQuizQuestion {
  id: string;
  prompt_ar: string;
  prompt_en: string;
  choices: [FoundationQuizChoice, FoundationQuizChoice, FoundationQuizChoice, FoundationQuizChoice];
  correct_choice_id: string;
  correct_ar: string;
  correct_en: string;
  incorrect_ar: string;
  incorrect_en: string;
  review_ar: string;
  review_en: string;
}

export interface FoundationCodeExplanation {
  code: string;
  why_ar: string;
  why_en: string;
}

export type FoundationValidationRule = PracticeValidationRule;

export interface FoundationLesson {
  id: FoundationLessonContentId;
  path_id: 'css-fundamentals' | 'javascript-fundamentals';
  sequence: number;
  title_ar: string;
  title_en: string;
  objective_ar: string;
  objective_en: string;
  outcome_ar: string;
  outcome_en: string;
  steps: [FoundationStep, FoundationStep, FoundationStep, ...FoundationStep[]];
  example_code: string;
  code_explanation: FoundationCodeExplanation[];
  practice_ar: string;
  practice_en: string;
  starter_html: string;
  starter_css: string;
  starter_js: string;
  quiz: [FoundationQuizQuestion, FoundationQuizQuestion, FoundationQuizQuestion];
  validation_rules: FoundationValidationRule[];
}

export const FOUNDATION_LESSONS_BY_ID: Record<FoundationLessonContentId, FoundationLesson> = {
  "css-what-is-css": {
    "code_explanation": [
      {
        "code": "h1",
        "why_ar": "هذا المحدد يختار عناوين `h1` التي ستتأثر بالقاعدة.",
        "why_en": "This selector chooses the `h1` headings affected by the rule."
      },
      {
        "code": "color: navy;",
        "why_ar": "هذا تصريح: `color` هي الخاصية التي نغيّرها، و`navy` هي القيمة التي تحدد اللون.",
        "why_en": "This is a declaration: `color` is the property being changed, and `navy` is the value that sets the color."
      },
      {
        "code": "{ }",
        "why_ar": "الأقواس المعقوفة تحيط بتصريحات القاعدة، فتربطها بالمحدد `h1`.",
        "why_en": "The braces surround the rule’s declarations and connect them to the `h1` selector."
      }
    ],
    "example_code": "h1 {\n  color: navy;\n}",
    "id": "css-what-is-css",
    "objective_ar": "افهم كيف تفصل CSS مظهر الصفحة عن بنية HTML، وتعرّف المحدد والتصريح والخاصية والقيمة.",
    "objective_en": "Understand how CSS separates a page’s appearance from HTML structure, and identify a selector, declaration, property, and value.",
    "outcome_ar": "أستطيع التمييز بين دور HTML ودور CSS، وتحديد أجزاء قاعدة CSS بسيطة.",
    "outcome_en": "I can distinguish HTML’s role from CSS’s and identify the parts of a simple CSS rule.",
    "path_id": "css-fundamentals",
    "practice_ar": "١. اكتب محدد `h1`. ٢. أضف إليه الخاصية `color` بالقيمة `teal` داخل قاعدة CSS.",
    "practice_en": "1. Write the `h1` selector. 2. Add the `color` property with the value `teal` inside its CSS rule.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "تحديد مظهر محتوى الصفحة، مثل لونه",
            "text_en": "Set the appearance of page content, such as its color"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "تحديد بنية المحتوى ومعناه بدل HTML",
            "text_en": "Define content structure and meaning instead of HTML"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "تخزين الصور داخل الصفحة",
            "text_en": "Store images inside the page"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "اختيار النص الذي يكتبه الزائر",
            "text_en": "Choose the text a visitor types"
          }
        ],
        "correct_ar": "صحيح: CSS تنسّق مظهر المحتوى، بينما تصف HTML بنيته.",
        "correct_choice_id": "a",
        "correct_en": "Correct: CSS styles the content’s appearance, while HTML describes its structure.",
        "id": "css-purpose",
        "incorrect_ar": "ليست CSS بديلًا عن بنية HTML ولا مخزنًا للصور أو نصوص الزوار. فكّر في تغيير المظهر، مثل اللون، ثم حاول مجددًا.",
        "incorrect_en": "CSS does not replace HTML structure or store images or visitor text. Think about changing appearance, such as color, and try again.",
        "prompt_ar": "ما الدور الأساسي لـ CSS؟",
        "prompt_en": "What is the main role of CSS?",
        "review_ar": "CSS للمظهر؛ HTML للبنية والمحتوى.",
        "review_en": "CSS is for appearance; HTML is for structure and content."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "`h1`",
            "text_en": "`h1`"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "`color`",
            "text_en": "`color`"
          },
          {
            "id": "c",
            "is_correct": true,
            "text_ar": "`navy`",
            "text_en": "`navy`"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "الأقواس المعقوفة `{ }`",
            "text_en": "The braces `{ }`"
          }
        ],
        "correct_ar": "صحيح: `navy` هي القيمة التي تعيّنها الخاصية `color`.",
        "correct_choice_id": "c",
        "correct_en": "Correct: `navy` is the value assigned to the `color` property.",
        "id": "css-rule-reading",
        "incorrect_ar": "`h1` هو المحدد و`color` هي الخاصية. القيمة التي تأتي بعد النقطتين هي `navy`. حاول مجددًا.",
        "incorrect_en": "`h1` is the selector and `color` is the property. The value after the colon is `navy`. Try again.",
        "prompt_ar": "في القاعدة `h1 { color: navy; }`، ما القيمة (value)؟",
        "prompt_en": "In `h1 { color: navy; }`, what is the value?",
        "review_ar": "في `property: value;` تأتي القيمة بعد النقطتين.",
        "review_en": "In `property: value;`, the value comes after the colon."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "`h1 { color: teal; }`",
            "text_en": "`h1 { color: teal; }`"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "`color { h1: teal; }`",
            "text_en": "`color { h1: teal; }`"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "`h1 { teal: color; }`",
            "text_en": "`h1 { teal: color; }`"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "`teal { color: h1; }`",
            "text_en": "`teal { color: h1; }`"
          }
        ],
        "correct_ar": "صحيح: `h1` يحدد العناوين، والتصريح `color: teal;` يضع اللون المطلوب.",
        "correct_choice_id": "a",
        "correct_en": "Correct: `h1` selects the headings, and the `color: teal;` declaration sets the requested color.",
        "id": "css-correct-rule",
        "incorrect_ar": "في CSS يأتي المحدد أولًا، ثم الخاصية والقيمة بصيغة `property: value;`. الخيارات الأخرى تخلط هذه الأجزاء. حاول مجددًا.",
        "incorrect_en": "In CSS, the selector comes first, followed by a property and value in `property: value;` form. The other options mix up these parts. Try again.",
        "prompt_ar": "أي خيار يكتب قاعدة تغيّر لون عناوين `h1` إلى `teal`؟",
        "prompt_en": "Which option writes a rule that changes `h1` headings to `teal`?",
        "review_ar": "اقرأ القاعدة بهذا الترتيب: محدد، ثم أقواس، ثم خاصية وقيمة.",
        "review_en": "Read the rule in this order: selector, braces, then property and value."
      }
    ],
    "sequence": 1,
    "starter_css": "",
    "starter_html": "<h1>My Garden</h1>",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "تصف HTML ما يظهر في الصفحة وبنيته. وتغيّر CSS مظهره، مثل اللون.",
        "body_en": "HTML describes page content and structure. CSS changes its appearance, such as its color.",
        "title_ar": "تعرّف CSS",
        "title_en": "Meet CSS"
      },
      {
        "body_ar": "في المثال، `h1` هو المحدد (selector)، و`color: navy;` هو التصريح (declaration). الخاصية (property) هي `color`، والقيمة (value) هي `navy`.",
        "body_en": "In the example, `h1` is the selector, and `color: navy;` is the declaration. The property is `color`; the value is `navy`.",
        "title_ar": "اقرأ القاعدة",
        "title_en": "Read the rule"
      },
      {
        "body_ar": "اكتب قاعدة CSS تجعل عنوان `h1` بلون `teal`. ابدأ بتحديد العنصر، ثم أضف الخاصية والقيمة.",
        "body_en": "Write a CSS rule that makes the `h1` heading `teal`. Select the element, then add the property and value.",
        "title_ar": "جرّب وطبّق",
        "title_en": "Try and apply"
      }
    ],
    "title_ar": "ما هي CSS؟",
    "title_en": "What is CSS?",
    "validation_rules": [
      {
        "id": "main-heading-selector",
        "type": "css-selector",
        "target": "h1",
        "label_ar": "محدد عنوان h1",
        "label_en": "The h1 selector",
        "note_ar": "أضف قاعدة CSS محددها هو `h1`.",
        "note_en": "Add a CSS rule whose selector is `h1`.",
        "concept_ar": "المحدد يختار عناصر HTML التي ستتأثر بالتنسيق.",
        "concept_en": "A selector chooses which HTML elements receive the styling."
      },
      {
        "id": "main-heading-color",
        "type": "css-declaration",
        "target": "h1",
        "property": "color",
        "value": "teal",
        "valueMatch": "semantic-color",
        "label_ar": "لون عنوان h1",
        "label_en": "The h1 text color",
        "note_ar": "داخل قاعدة `h1`، اضبط الخاصية `color` إلى `teal` أو صيغة لونية مكافئة.",
        "note_en": "Inside the `h1` rule, set `color` to `teal` or an equivalent color representation.",
        "concept_ar": "الخاصية تحدد نوع التنسيق، والقيمة تحدد اللون المختار.",
        "concept_en": "The property names the style being changed; the value specifies the chosen color."
      }
    ]
  },
  "css-selectors": {
    "code_explanation": [
      {
        "code": "h1 { color: navy; }",
        "why_ar": "`h1` اسم عنصر HTML، لذلك يختار عناوين h1 ويجعل لونها كحليًا.",
        "why_en": "`h1` is an HTML element name, so it selects h1 headings and makes their text navy."
      },
      {
        "code": ".card { background-color: lightyellow; }",
        "why_ar": "النقطة تعني أن `card` اسم class؛ يختار كل عنصر يحمل `class=\"card\"` ويغيّر خلفيته.",
        "why_en": "The dot means `card` is a class name; this selects each element with `class=\"card\"` and changes its background."
      },
      {
        "code": "#notice { font-weight: bold; }",
        "why_ar": "علامة `#` تعني أن `notice` هو id؛ يختار العنصر الذي يحمل `id=\"notice\"` ويجعل خطه عريضًا.",
        "why_en": "The `#` means `notice` is an id; this selects the element with `id=\"notice\"` and makes its text bold."
      }
    ],
    "example_code": "h1 { color: navy; }\n.card { background-color: lightyellow; }\n#notice { font-weight: bold; }",
    "id": "css-selectors",
    "objective_ar": "اختر محدد CSS المناسب: اسم العنصر أو class بنقطة أو id بعلامة #، وطابقه مع HTML.",
    "objective_en": "Choose the right CSS selector—an element name, a class with a dot, or an id with #—and match it to the HTML.",
    "outcome_ar": "أصبحت تميّز محدد العنصر وclass وid، وتطابق كلًّا منها مع HTML.",
    "outcome_en": "You can now tell element, class, and id selectors apart and match each one to HTML.",
    "path_id": "css-fundamentals",
    "practice_ar": "١. استخدم محدد الفئة `.card` الموجود في HTML. ٢. اضبط خاصية `color` على `blue`.",
    "practice_en": "1. Use the `.card` class selector present in the HTML. 2. Set the `color` property to `blue`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "`h1`",
            "text_en": "`h1`"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "`.h1`",
            "text_en": "`.h1`"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "`#h1`",
            "text_en": "`#h1`"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "`<h1>`",
            "text_en": "`<h1>`"
          }
        ],
        "correct_ar": "صحيح: اسم العنصر وحده، `h1`، هو محدد العنصر.",
        "correct_choice_id": "a",
        "correct_en": "Correct: the element selector is just its name, `h1`.",
        "id": "selector-element",
        "incorrect_ar": "ليست هذه الإجابة. جرّب مرة أخرى: العنصر لا يحتاج نقطة أو `#`، ولا نكتب أقواس HTML في محدد CSS.",
        "incorrect_en": "Not quite. Try again: an element selector needs no dot or `#`, and HTML brackets are not part of a CSS selector.",
        "prompt_ar": "أي محدد يختار عناصر العنوان `h1`؟",
        "prompt_en": "Which selector targets `h1` heading elements?",
        "review_ar": "تذكّر: محدد العنصر هو اسم الوسم مباشرة، مثل `h1`.",
        "review_en": "Remember: an element selector is the tag name directly, such as `h1`."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "`#card`",
            "text_en": "`#card`"
          },
          {
            "id": "b",
            "is_correct": true,
            "text_ar": "`.card`",
            "text_en": "`.card`"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "`card`",
            "text_en": "`card`"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "`.p`",
            "text_en": "`.p`"
          }
        ],
        "correct_ar": "صحيح: `card` قيمة class، لذا نضيف نقطة ونكتب `.card`.",
        "correct_choice_id": "b",
        "correct_en": "Correct: `card` is the class value, so add a dot to write `.card`.",
        "id": "selector-class-read",
        "incorrect_ar": "ليست هذه الإجابة. جرّب مرة أخرى: class تستخدم النقطة ثم قيمة class نفسها؛ لا تستخدم `#` أو اسم الوسم.",
        "incorrect_en": "Not quite. Try again: a class selector uses a dot followed by the class value; do not use `#` or the tag name.",
        "prompt_ar": "في HTML: `<p class=\"card\">Hello</p>`. أي محدد يطابق هذا العنصر بسبب class؟",
        "prompt_en": "Given `<p class=\"card\">Hello</p>`, which selector matches this element by its class?",
        "review_ar": "طابق اسم class في HTML، وأضف نقطة قبله: `class=\"card\"` تصبح `.card`.",
        "review_en": "Match the class name in the HTML and put a dot before it: `class=\"card\"` becomes `.card`."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "`#notice { color: blue; }`",
            "text_en": "`#notice { color: blue; }`"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "`.notice { color: blue; }`",
            "text_en": "`.notice { color: blue; }`"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "`notice { color: blue; }`",
            "text_en": "`notice { color: blue; }`"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "`#p { color: blue; }`",
            "text_en": "`#p { color: blue; }`"
          }
        ],
        "correct_ar": "صحيح: `notice` هو id، لذا نستخدم `#notice` بدل `.notice` التي تعني class.",
        "correct_choice_id": "a",
        "correct_en": "Correct: `notice` is an id, so use `#notice` instead of `.notice`, which means a class.",
        "id": "selector-id-error",
        "incorrect_ar": "ليست هذه الإجابة. جرّب مرة أخرى: افحص هل الاسم في HTML داخل `id` أم `class`، ثم اختر `#` أو النقطة.",
        "incorrect_en": "Not quite. Try again: check whether the name is in HTML's `id` or `class`, then choose `#` or a dot.",
        "prompt_ar": "العنصر هو `<p id=\"notice\">Hi</p>`. أي سطر يصحح الخطأ في المحدد المكتوب ` .notice { color: blue; }`؟",
        "prompt_en": "The element is `<p id=\"notice\">Hi</p>`. Which line fixes the selector error in ` .notice { color: blue; }`?",
        "review_ar": "`id=\"notice\"` يقابله المحدد `#notice`. النقطة مخصصة لـ class.",
        "review_en": "`id=\"notice\"` matches the `#notice` selector. A dot is for a class."
      }
    ],
    "sequence": 2,
    "starter_css": "",
    "starter_html": "<h1>My Page</h1>\n<p class=\"card\">A card</p>\n<p id=\"notice\">A note</p>",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "المحدد يخبر CSS أي جزء من HTML نريد تنسيقه. نكتب اسم العنصر مباشرة، مثل `h1`.",
        "body_en": "A selector tells CSS which part of the HTML to style. Write an element name directly, like `h1`.",
        "title_ar": "تعلّم",
        "title_en": "Learning"
      },
      {
        "body_ar": "لـ `class` نضع نقطة قبل الاسم، مثل `.card`. ولـ `id` نضع `#`، مثل `#notice`. طابق الاسم مع `class` أو `id` في HTML.",
        "body_en": "For a `class`, put a dot before its name, like `.card`. For an `id`, use `#`, like `#notice`. Match the name to the HTML `class` or `id`.",
        "title_ar": "افهم",
        "title_en": "Understand"
      },
      {
        "body_ar": "اقرأ المثال: `h1` يختار العنصر، و`.card` يختار class، و`#notice` يختار id. انتبه إلى العلامة قبل اسم class أو id.",
        "body_en": "Read the example: `h1` selects the element, `.card` selects a class, and `#notice` selects an id. Notice the mark before a class or id name.",
        "title_ar": "تدرّب",
        "title_en": "Practice"
      }
    ],
    "title_ar": "اختيار عناصر الصفحة",
    "title_en": "Selecting Page Elements",
    "validation_rules": [
      {
        "id": "card-class-selector",
        "type": "css-selector",
        "target": ".card",
        "label_ar": "محدد الفئة .card",
        "label_en": "The .card class selector",
        "note_ar": "أضف قاعدة CSS بمحدد الفئة `.card`.",
        "note_en": "Add a CSS rule using the `.card` class selector.",
        "concept_ar": "النقطة قبل الاسم تعني أن المحدد يستهدف class في HTML.",
        "concept_en": "The dot before the name means the selector targets an HTML class."
      },
      {
        "id": "card-text-blue",
        "type": "css-declaration",
        "target": ".card",
        "property": "color",
        "value": "blue",
        "valueMatch": "semantic-color",
        "label_ar": "لون نص البطاقة",
        "label_en": "The card text color",
        "note_ar": "داخل قاعدة `.card`، اضبط `color` إلى الأزرق أو صيغة لونية مكافئة.",
        "note_en": "Inside the `.card` rule, set `color` to blue or an equivalent color representation.",
        "concept_ar": "خاصية color تغيّر لون النص داخل العنصر المحدد.",
        "concept_en": "The color property changes the text color of the selected element."
      }
    ]
  },
  "css-colors-backgrounds": {
    "code_explanation": [
      {
        "code": ".card {",
        "why_ar": "يختار كل عنصر يحمل الصنف card ليتلقى التنسيقات أدناه.",
        "why_en": "Selects each element with the card class for the styles below."
      },
      {
        "code": "  color: white;",
        "why_ar": "يجعل النص أبيض؛ color هي خاصية لون النص.",
        "why_en": "Makes the text white; color is the text-color property."
      },
      {
        "code": "  background-color: #1f2937;",
        "why_ar": "يجعل الخلفية داكنة؛ الصيغة السداسية تحدد لونًا، والفرق عن الأبيض يساعد على القراءة.",
        "why_en": "Makes the background dark; the hex value specifies a color, and its contrast with white helps readability."
      },
      {
        "code": "}",
        "why_ar": "ينهي مجموعة التنسيقات الخاصة بـ .card.",
        "why_en": "Ends the style block for .card."
      }
    ],
    "example_code": ".card {\n  color: white;\n  background-color: #1f2937;\n}",
    "id": "css-colors-backgrounds",
    "objective_ar": "استخدم color وbackground-color لإظهار نص واضح فوق خلفية متباينة.",
    "objective_en": "Use color and background-color to show readable text on a contrasting background.",
    "outcome_ar": "أستطيع تلوين النص والخلفية واختيار تباين يجعل النص مقروءًا.",
    "outcome_en": "I can color text and backgrounds and choose contrast that keeps text readable.",
    "path_id": "css-fundamentals",
    "practice_ar": "١. على `.card`، اجعل `background-color` مساويًا للون `#1f2937`. ٢. اجعل `color` أبيض. اكتب الفاصلة المنقوطة في نهاية كل تصريح كما يطلب هذا التمرين.",
    "practice_en": "1. On `.card`, set `background-color` to `#1f2937`. 2. Set `color` to white. End each declaration with a semicolon as this exercise explicitly requires.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "لون النص",
            "text_en": "The text color"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "لون خلفية العنصر",
            "text_en": "The element’s background color"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "حجم النص",
            "text_en": "The text size"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "محتوى النص",
            "text_en": "The text content"
          }
        ],
        "correct_ar": "صحيح: color تحدد لون النص نفسه.",
        "correct_choice_id": "a",
        "correct_en": "Correct: color sets the text’s own color.",
        "id": "q1",
        "incorrect_ar": "ليست لون الخلفية؛ تلك تحددها background-color. color تغيّر لون النص.",
        "incorrect_en": "It is not the background color; background-color sets that. color changes the text color.",
        "prompt_ar": "ما الذي تغيّره الخاصية color؟",
        "prompt_en": "What does the color property change?",
        "review_ar": "تذكّر: color للنص، وbackground-color لخلفية العنصر.",
        "review_en": "Remember: color is for text, and background-color is for an element’s background."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "أبيض",
            "text_en": "White"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "#1f2937",
            "text_en": "#1f2937"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "أسود",
            "text_en": "Black"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "لم يُحدّد لون النص",
            "text_en": "No text color is set"
          }
        ],
        "correct_ar": "صحيح: القيمة white تتبع color، لذلك يكون النص أبيض.",
        "correct_choice_id": "a",
        "correct_en": "Correct: white follows color, so the text is white.",
        "id": "q2",
        "incorrect_ar": "اقرأ اسم الخاصية قبل كل قيمة: white تتبع color، أما #1f2937 فتتبع background-color.",
        "incorrect_en": "Check the property before each value: white follows color, while #1f2937 follows background-color.",
        "prompt_ar": "ما لون النص في هذه القاعدة؟\n.card { color: white; background-color: #1f2937; }",
        "prompt_en": "What is the text color in this rule?\n.card { color: white; background-color: #1f2937; }",
        "review_ar": "في CSS، تكتب الخاصية ثم نقطتين ثم قيمتها.",
        "review_en": "In CSS, write a property, then a colon, then its value."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": ".card { color: white; background-color: #1f2937; }",
            "text_en": ".card { color: white; background-color: #1f2937; }"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": ".card { color: #1f2937; background-color: white; }",
            "text_en": ".card { color: #1f2937; background-color: white; }"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": ".card { color: white; background-color: white; }",
            "text_en": ".card { color: white; background-color: white; }"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": ".card { color: #1f2937; background-color: #1f2937; }",
            "text_en": ".card { color: #1f2937; background-color: #1f2937; }"
          }
        ],
        "correct_ar": "صحيح: النص أبيض والخلفية داكنة، فيظهر التباين بوضوح.",
        "correct_choice_id": "a",
        "correct_en": "Correct: the text is white and the background is dark, creating clear contrast.",
        "id": "q3",
        "incorrect_ar": "قارن قيمة color بلون النص وقيمة background-color بالخلفية؛ اللونان المتشابهان يصعّبان القراءة.",
        "incorrect_en": "Match color to the text and background-color to the background; similar colors make text harder to read.",
        "prompt_ar": "أي قاعدة تعطي نصًا أبيض على خلفية داكنة؟",
        "prompt_en": "Which rule gives white text on a dark background?",
        "review_ar": "اختر لونين متباينين كي يبقى النص مقروءًا على خلفيته.",
        "review_en": "Choose contrasting colors so the text stays readable on its background."
      }
    ],
    "sequence": 3,
    "starter_css": "",
    "starter_html": "<div class=\"card\">\n  <h1>Welcome</h1>\n  <p>Colors can make text easier to read.</p>\n</div>",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "تغيّر الخاصية color لون النص. يمكن كتابة اللون باسمه مثل white أو بصيغة سداسية مثل #1f2937.",
        "body_en": "The color property changes text color. A color can use a name like white or a hex value like #1f2937.",
        "title_ar": "تعلّم: لون النص",
        "title_en": "Learn: Text color"
      },
      {
        "body_ar": "تغيّر background-color لون خلفية العنصر. اختر لونين متباينين، مثل نص أبيض وخلفية داكنة، ليسهل قراءة النص.",
        "body_en": "The background-color property changes an element’s background. Choose contrasting colors, such as white text on a dark background, to keep text readable.",
        "title_ar": "افهم: لون الخلفية والتباين",
        "title_en": "Understand: Background and contrast"
      },
      {
        "body_ar": "اقرأ المثال، ثم جرّب اختيار لون النص والخلفية لبطاقة صغيرة. اسأل نفسك: هل يظهر النص بوضوح؟",
        "body_en": "Read the example, then choose text and background colors for a small card. Ask yourself: can you read the text clearly?",
        "title_ar": "تدرّب ثم طبّق",
        "title_en": "Practice, then apply"
      }
    ],
    "title_ar": "الألوان والخلفيات",
    "title_en": "Colors and Backgrounds",
    "validation_rules": [
      {
            "id": "card-background",
            "label_ar": "خلفية البطاقة",
            "label_en": "Card background",
            "concept_ar": "خاصية الخلفية وقيمتها",
            "concept_en": "Background property and value",
            "note_ar": "على `.card`، اجعل `background-color` مساويًا للون `#1f2937`، مع إنهاء التصريح بفاصلة منقوطة.",
            "note_en": "On `.card`, set `background-color` to the color `#1f2937` and end the declaration with a semicolon.",
            "property": "background-color",
            "target": ".card",
            "type": "css-declaration",
            "value": "#1f2937",
            "requireSemicolon": true,
            "valueMatch": "semantic-color"
      },
      {
            "id": "card-text-color",
            "label_ar": "لون نص البطاقة",
            "label_en": "Card text color",
            "concept_ar": "خاصية لون النص وقيمتها",
            "concept_en": "Text color property and value",
            "note_ar": "على `.card`، اجعل `color` أبيض، مع إنهاء التصريح بفاصلة منقوطة.",
            "note_en": "On `.card`, set `color` to white and end the declaration with a semicolon.",
            "property": "color",
            "target": ".card",
            "type": "css-declaration",
            "value": "white",
            "requireSemicolon": true,
            "valueMatch": "semantic-color"
      }
    ]
  },
  "css-typography": {
    "code_explanation": [
      {
        "code": ".article {",
        "why_ar": "يختار كل عنصر يحمل الفئة article لتطبيق التنسيق عليه.",
        "why_en": "Selects each element with the article class so the styles apply to it."
      },
      {
        "code": "font-family: Arial, sans-serif;",
        "why_ar": "يختار شكل الحروف، مع خط بديل عام إذا لم يتوفر Arial.",
        "why_en": "Chooses the typeface, with a generic fallback if Arial is unavailable."
      },
      {
        "code": "font-size: 18px;",
        "why_ar": "يجعل حجم الحروف 18 بكسلًا ليسهل قراءتها.",
        "why_en": "Sets the letters to 18 pixels so they are easy to read."
      },
      {
        "code": "font-weight: 400;",
        "why_ar": "يحدد سماكة عادية للحروف بدل جعلها عريضة.",
        "why_en": "Sets a regular letter weight instead of making the text bold."
      },
      {
        "code": "line-height: 1.6;",
        "why_ar": "يضيف مساحة مريحة بين أسطر النص.",
        "why_en": "Adds comfortable space between lines of text."
      },
      {
        "code": "}",
        "why_ar": "ينهي مجموعة التنسيقات الخاصة بـ article.",
        "why_en": "Closes the style block for article."
      }
    ],
    "example_code": ".article {\n  font-family: Arial, sans-serif;\n  font-size: 18px;\n  font-weight: 400;\n  line-height: 1.6;\n}",
    "id": "css-typography",
    "objective_ar": "استخدم font-family وfont-size وfont-weight وline-height لجعل النص واضحًا ومريحًا للقراءة.",
    "objective_en": "Use font-family, font-size, font-weight, and line-height to make text clear and comfortable to read.",
    "outcome_ar": "أستطيع اختيار خط وحجم وسماكة مناسبة، وضبط المسافة بين الأسطر لتحسين قراءة فقرة.",
    "outcome_en": "I can choose a typeface, size, and weight, then adjust line spacing to make a paragraph easier to read.",
    "path_id": "css-fundamentals",
    "practice_ar": "على المحدد `.reading`، اكتب كل تصريح كجزء مستقل: ١. `font-family: Arial, sans-serif`. ٢. `font-size: 18px`. ٣. `font-weight: 400`. ٤. `line-height: 1.6`.",
    "practice_en": "On the `.reading` selector, write each declaration as a separate requirement: 1. `font-family: Arial, sans-serif`. 2. `font-size: 18px`. 3. `font-weight: 400`. 4. `line-height: 1.6`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "font-size",
            "text_en": "font-size"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "font-family",
            "text_en": "font-family"
          },
          {
            "id": "c",
            "is_correct": true,
            "text_ar": "line-height",
            "text_en": "line-height"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "font-weight",
            "text_en": "font-weight"
          }
        ],
        "correct_ar": "صحيح: line-height تضبط المسافة بين الأسطر.",
        "correct_choice_id": "c",
        "correct_en": "Correct: line-height controls the space between lines.",
        "id": "typography-q1",
        "incorrect_ar": "ليست font-size أو font-family أو font-weight؛ هذه تضبط الحجم أو شكل الحروف أو سماكتها. جرّب مرة أخرى.",
        "incorrect_en": "It is not font-size, font-family, or font-weight; those set size, typeface, or weight. Try again.",
        "prompt_ar": "أي خاصية تضبط المسافة بين أسطر الفقرة؟",
        "prompt_en": "Which property controls the space between paragraph lines?",
        "review_ar": "تذكّر: line-height للمسافة بين الأسطر، وfont-size لحجم الحروف.",
        "review_en": "Remember: line-height is for line spacing, while font-size sets letter size."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "حجم الحروف إلى 18 بكسلًا",
            "text_en": "The letter size to 18 pixels"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "المسافة بين الأسطر إلى 18 بكسلًا",
            "text_en": "The line spacing to 18 pixels"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "نوع الخط إلى 18 بكسلًا",
            "text_en": "The typeface to 18 pixels"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "سماكة الحروف إلى 18 بكسلًا",
            "text_en": "The letter weight to 18 pixels"
          }
        ],
        "correct_ar": "صحيح: font-size تحدد حجم الحروف، وهنا قيمته 18px.",
        "correct_choice_id": "a",
        "correct_en": "Correct: font-size sets letter size, and its value here is 18px.",
        "id": "typography-q2",
        "incorrect_ar": "18px هنا لا تضبط المسافة أو نوع الخط أو سماكته؛ font-size تضبط حجم الحروف. حاول مجددًا.",
        "incorrect_en": "18px here does not set spacing, typeface, or weight; font-size sets letter size. Try again.",
        "prompt_ar": "اقرأ القاعدة: ما الذي تحدده font-size: 18px؟",
        "prompt_en": "Read the rule: what does font-size: 18px set?",
        "review_ar": "اقرأ اسم الخاصية أولًا: font-size تعني حجم الخط.",
        "review_en": "Read the property name first: font-size means the size of the text."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "p { font-weight: 18px; font-family: 1.6; }",
            "text_en": "p { font-weight: 18px; font-family: 1.6; }"
          },
          {
            "id": "b",
            "is_correct": true,
            "text_ar": "p { font-size: 18px; line-height: 1.6; }",
            "text_en": "p { font-size: 18px; line-height: 1.6; }"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "p { font-family: 18px; font-size: 1.6; }",
            "text_en": "p { font-family: 18px; font-size: 1.6; }"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "p { line-height: 18px; font-weight: 1.6; }",
            "text_en": "p { line-height: 18px; font-weight: 1.6; }"
          }
        ],
        "correct_ar": "صحيح: font-size تكبّر النص، وline-height تضبط المسافة بين أسطره.",
        "correct_choice_id": "b",
        "correct_en": "Correct: font-size enlarges the text, and line-height sets its line spacing.",
        "id": "typography-q3",
        "incorrect_ar": "في الخيارات الأخرى وُضعت قيم الحجم والمسافة مع خصائص لا تناسبها. اختر font-size للحجم وline-height للمسافة، ثم جرّب مرة أخرى.",
        "incorrect_en": "The other choices put size and spacing values on properties that do not fit them. Use font-size for size and line-height for spacing, then try again.",
        "prompt_ar": "أي قاعدة تجعل النص أكبر وتترك مساحة مريحة بين الأسطر؟",
        "prompt_en": "Which rule makes text larger and leaves comfortable space between lines?",
        "review_ar": "اربط الخاصية بوظيفتها: font-size للحجم، وline-height للمسافة بين الأسطر.",
        "review_en": "Match each property to its job: font-size for size and line-height for line spacing."
      }
    ],
    "sequence": 4,
    "starter_css": "",
    "starter_html": "<p class=\"reading\">Readable text is easier to follow.</p>",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "font-family يختار شكل الحروف؛ font-size يحدد حجمها. ابدأ بخط بسيط وحجم واضح.",
        "body_en": "font-family chooses the typeface; font-size sets its size. Start with a simple font and a clear size.",
        "title_ar": "تعرّف",
        "title_en": "Meet the properties"
      },
      {
        "body_ar": "font-weight يحدد سماكة الحروف، وline-height يحدد المسافة بين أسطر النص. المسافة المناسبة تسهّل القراءة.",
        "body_en": "font-weight sets how bold the letters look, and line-height sets the space between lines. Comfortable spacing helps reading.",
        "title_ar": "افهم",
        "title_en": "Make it readable"
      },
      {
        "body_ar": "لاحظ كيف تمنح القيم في المثال النص حجمًا واضحًا ومساحة مريحة بين الأسطر.",
        "body_en": "Notice how the example values give text a clear size and comfortable space between lines.",
        "title_ar": "جرّب",
        "title_en": "Try it"
      },
      {
        "body_ar": "نسّق الفقرة في التمرين بالخصائص الأربع. غيّرها واحدةً تلو الأخرى ثم اقرأ النتيجة.",
        "body_en": "Style the practice paragraph with all four properties. Change them one at a time, then read the result.",
        "title_ar": "طبّق",
        "title_en": "Use it"
      }
    ],
    "title_ar": "تنسيق النصوص",
    "title_en": "Text Styling",
    "validation_rules": [
      {
            "id": "reading-font-family",
            "note_ar": "على `.reading`، اضبط `font-family` على `Arial, sans-serif`.",
            "note_en": "On `.reading`, set `font-family` to `Arial, sans-serif`.",
            "property": "font-family",
            "target": ".reading",
            "type": "css-declaration",
            "value": "Arial, sans-serif"
      },
      {
            "id": "reading-font-size",
            "note_ar": "على `.reading`، اضبط `font-size` على `18px`.",
            "note_en": "On `.reading`, set `font-size` to `18px`.",
            "property": "font-size",
            "target": ".reading",
            "type": "css-declaration",
            "value": "18px"
      },
      {
            "id": "reading-font-weight",
            "note_ar": "على `.reading`، اضبط `font-weight` على `400`.",
            "note_en": "On `.reading`, set `font-weight` to `400`.",
            "property": "font-weight",
            "target": ".reading",
            "type": "css-declaration",
            "value": "400"
      },
      {
            "id": "reading-line-height",
            "note_ar": "على `.reading`، اضبط `line-height` على `1.6`.",
            "note_en": "On `.reading`, set `line-height` to `1.6`.",
            "property": "line-height",
            "target": ".reading",
            "type": "css-declaration",
            "value": "1.6"
      }
    ]
  },
  "css-box-model": {
    "code_explanation": [
      {
        "code": ".card {",
        "why_ar": "يختار كل عنصر يحمل الصنف card، وتبدأ الأقواس مجموعة قواعده.",
        "why_en": "Selects each element with the card class; the brace starts its set of rules."
      },
      {
        "code": "box-sizing: border-box;",
        "why_ar": "يجعل الحشو والإطار داخل العرض المحدد للعنصر.",
        "why_en": "Keeps padding and border inside the element’s set width."
      },
      {
        "code": "padding: 12px;",
        "why_ar": "يضيف مساحة بين المحتوى والإطار.",
        "why_en": "Adds space between the content and the border."
      },
      {
        "code": "border: 2px solid navy;",
        "why_ar": "يرسم إطارًا أزرق داكنًا بسماكة 2px حول المحتوى والحشو.",
        "why_en": "Draws a 2px solid navy edge around the content and padding."
      },
      {
        "code": "margin: 16px;",
        "why_ar": "يضيف مساحة خارج الإطار تفصل البطاقة عما حولها.",
        "why_en": "Adds space outside the border to separate the card from nearby elements."
      }
    ],
    "example_code": ".card {\n  box-sizing: border-box;\n  padding: 12px;\n  border: 2px solid navy;\n  margin: 16px;\n}",
    "id": "css-box-model",
    "objective_ar": "ميّز أجزاء نموذج الصندوق واستخدم padding وborder وmargin وbox-sizing لتنسيق مساحة العنصر.",
    "objective_en": "Identify the parts of the box model and use padding, border, margin, and box-sizing to style an element’s space.",
    "outcome_ar": "أستطيع شرح طبقات نموذج الصندوق وكتابة قواعد CSS تضبط المسافة الداخلية والخارجية للعنصر.",
    "outcome_en": "I can explain the box model layers and write CSS rules to control an element’s inner and outer spacing.",
    "path_id": "css-fundamentals",
    "practice_ar": "على `.card`، أضف كل تصريح على حدة: ١. `padding: 12px`. ٢. `border: 2px solid navy`. ٣. `margin: 16px`. ٤. `box-sizing: border-box`.",
    "practice_en": "On `.card`, add each declaration separately: 1. `padding: 12px`. 2. `border: 2px solid navy`. 3. `margin: 16px`. 4. `box-sizing: border-box`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "المحتوى ثم padding ثم border ثم margin",
            "text_en": "Content, then padding, then border, then margin"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "المحتوى ثم margin ثم border ثم padding",
            "text_en": "Content, then margin, then border, then padding"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "border ثم المحتوى ثم padding ثم margin",
            "text_en": "Border, then content, then padding, then margin"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "المحتوى ثم border ثم margin ثم padding",
            "text_en": "Content, then border, then margin, then padding"
          }
        ],
        "correct_ar": "صحيح: يبدأ الترتيب بالمحتوى، ثم الحشو داخل الإطار، ثم الإطار، وأخيرًا المسافة الخارجية.",
        "correct_choice_id": "a",
        "correct_en": "Correct: the order starts with content, then inner padding, then the border, and finally outside margin.",
        "id": "box-layers",
        "incorrect_ar": "ليس تمامًا. تذكّر أن padding داخل الإطار، أما margin فخارجه؛ حاول مرة أخرى.",
        "incorrect_en": "Not quite. Remember that padding is inside the border, while margin is outside it; try again.",
        "prompt_ar": "أي ترتيب يصف الطبقات من الداخل إلى الخارج؟",
        "prompt_en": "Which order describes the layers from inside to outside?",
        "review_ar": "راجع ترتيب طبقات نموذج الصندوق من الداخل إلى الخارج.",
        "review_en": "Review the box model layers from inside to outside."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "بين المحتوى والإطار",
            "text_en": "Between the content and the border"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "خارج الإطار فقط",
            "text_en": "Only outside the border"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "تستبدل المحتوى بإطار",
            "text_en": "It replaces the content with a border"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "تحدد لون النص",
            "text_en": "It sets the text color"
          }
        ],
        "correct_ar": "صحيح: padding مساحة داخلية تفصل المحتوى عن الإطار.",
        "correct_choice_id": "a",
        "correct_en": "Correct: padding is inner space between the content and the border.",
        "id": "padding-reading",
        "incorrect_ar": "هذا ليس دور padding. إنها مساحة داخل الإطار حول المحتوى؛ حاول مجددًا.",
        "incorrect_en": "That is not what padding does. It is space inside the border around the content; try again.",
        "prompt_ar": "في `padding: 12px`، أين تظهر المسافة؟",
        "prompt_en": "In `padding: 12px`, where does the space appear?",
        "review_ar": "راجع الفرق بين padding الداخلي وmargin الخارجي.",
        "review_en": "Review the difference between inner padding and outer margin."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "`padding: 16px;`",
            "text_en": "`padding: 16px;`"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "`border: 16px solid navy;`",
            "text_en": "`border: 16px solid navy;`"
          },
          {
            "id": "c",
            "is_correct": true,
            "text_ar": "`margin: 16px;`",
            "text_en": "`margin: 16px;`"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "`box-sizing: 16px;`",
            "text_en": "`box-sizing: 16px;`"
          }
        ],
        "correct_ar": "صحيح: margin يضيف مساحة خارج الإطار ويفصل العنصر عما حوله.",
        "correct_choice_id": "c",
        "correct_en": "Correct: margin adds space outside the border and separates the element from its surroundings.",
        "id": "outside-space",
        "incorrect_ar": "ليست هذه القاعدة للمسافة خارج الإطار. padding داخلي، وborder إطار، وbox-sizing يحدد طريقة حساب الأبعاد؛ حاول مرة أخرى.",
        "incorrect_en": "That declaration does not add space outside the border. Padding is inner space, border is the edge, and box-sizing controls dimension calculation; try again.",
        "prompt_ar": "أي قاعدة تضيف مسافة خارج إطار `.card`؟",
        "prompt_en": "Which declaration adds space outside `.card`’s border?",
        "review_ar": "راجع وظيفة margin مقارنةً بـ padding وborder وbox-sizing.",
        "review_en": "Review how margin differs from padding, border, and box-sizing."
      }
    ],
    "sequence": 5,
    "starter_css": "",
    "starter_html": "<div class=\"card\">A simple card</div>",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "تخيّل العنصر كصندوق: المحتوى (content) في الوسط، وتحيط به طبقات تساعدك على ضبط المساحة.",
        "body_en": "Think of an element as a box: its content sits in the middle, surrounded by layers that help control space.",
        "title_ar": "التعلّم: كل عنصر صندوق",
        "title_en": "Learning: Every element is a box"
      },
      {
        "body_ar": "من الداخل إلى الخارج: padding مساحة داخلية حول المحتوى، ثم border إطار، ثم margin مساحة خارج الإطار. يضمّن box-sizing: border-box الحشو والإطار ضمن العرض المحدد.",
        "body_en": "From inside to outside: padding is space around the content, border is the edge, and margin is space outside the edge. box-sizing: border-box includes padding and border within the set width.",
        "title_ar": "افهم الطبقات",
        "title_en": "Understand the layers"
      },
      {
        "body_ar": "في المثال، تضيف القواعد حشوًا وإطارًا ومسافة خارجية للبطاقة، وتستخدم border-box لحساب أبعادها بطريقة أسهل.",
        "body_en": "In the example, the rules add padding, an edge, and outside space to the card, while border-box makes its dimensions easier to reason about.",
        "title_ar": "طبّق على بطاقة",
        "title_en": "Apply: Style a card"
      }
    ],
    "title_ar": "نموذج الصندوق",
    "title_en": "The Box Model",
    "validation_rules": [
      {
            "id": "card-padding",
            "note_ar": "على `.card`، اضبط `padding` على `12px`.",
            "note_en": "On `.card`, set `padding` to `12px`.",
            "property": "padding",
            "target": ".card",
            "type": "css-declaration",
            "value": "12px"
      },
      {
            "id": "card-border",
            "note_ar": "على `.card`، أضف `border: 2px solid navy` (2px، solid، ولون navy).",
            "note_en": "On `.card`, add `border: 2px solid navy` (2px, solid, and navy).",
            "property": "border",
            "target": ".card",
            "type": "css-declaration",
            "value": "2px solid navy",
            "valueMatch": "semantic-color"
      },
      {
            "id": "card-margin",
            "note_ar": "على `.card`، اضبط `margin` على `16px`.",
            "note_en": "On `.card`, set `margin` to `16px`.",
            "property": "margin",
            "target": ".card",
            "type": "css-declaration",
            "value": "16px"
      },
      {
            "id": "card-box-sizing",
            "note_ar": "على `.card`، اضبط `box-sizing` على `border-box`.",
            "note_en": "On `.card`, set `box-sizing` to `border-box`.",
            "property": "box-sizing",
            "target": ".card",
            "type": "css-declaration",
            "value": "border-box"
      }
    ]
  },
  "css-display-layout": {
    "code_explanation": [
      {
        "code": "h1 { display: block; }",
        "why_ar": "تجعل العنوان عنصر block، فيبدأ سطرًا مستقلًا.",
        "why_en": "This makes the heading a block element, so it starts on its own line."
      },
      {
        "code": ".badge { display: inline; }",
        "why_ar": "تجعل العنصر ذي المحدد .badge يبقى ضمن السطر بجوار المحتوى.",
        "why_en": "This makes the element selected by .badge stay inline beside nearby content."
      },
      {
        "code": ".hidden { display: none; }",
        "why_ar": "تخفي العنصر المحدد بـ .hidden وتزيل المساحة التي كان يشغلها.",
        "why_en": "This hides the element selected by .hidden and removes the space it occupied."
      }
    ],
    "example_code": "h1 { display: block; }\n.badge { display: inline; }\n.hidden { display: none; }",
    "id": "css-display-layout",
    "objective_ar": "استخدم display لاختيار ظهور العنصر وترتيبه كسطر مستقل أو ضمن السطر أو مخفيًا.",
    "objective_en": "Use display to choose whether an element takes its own line, stays within a line, or is hidden.",
    "outcome_ar": "النتيجة: تستطيع اختيار block للسطر المستقل، وinline للبقاء ضمن السطر، وnone للإخفاء دون مساحة.",
    "outcome_en": "Apply / Outcome: You can choose block for a separate line, inline to stay within a line, and none to hide an element without space.",
    "path_id": "css-fundamentals",
    "practice_ar": "اكتب قاعدة مستقلة لكل محدد: ١. `.title` مع `display: block`. ٢. `.badge` مع `display: inline`. ٣. `.hidden` مع `display: none`.",
    "practice_en": "Write a separate rule for each selector: 1. `.title` with `display: block`. 2. `.badge` with `display: inline`. 3. `.hidden` with `display: none`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "hidden-removed",
            "is_correct": true,
            "text_ar": "يختفي ولا يترك مساحة في الصفحة.",
            "text_en": "It is hidden and leaves no space in the page."
          },
          {
            "id": "hidden-keeps-space",
            "is_correct": false,
            "text_ar": "يختفي لكنه يحتفظ بمساحته.",
            "text_en": "It is hidden but keeps its space."
          },
          {
            "id": "inline-appears",
            "is_correct": false,
            "text_ar": "يبقى ظاهرًا ضمن السطر.",
            "text_en": "It stays visible inline."
          },
          {
            "id": "block-appears",
            "is_correct": false,
            "text_ar": "يبقى ظاهرًا على سطر مستقل.",
            "text_en": "It stays visible on its own line."
          }
        ],
        "correct_ar": "صحيح: display: none يخفي العنصر ويزيل المساحة التي كان يشغلها.",
        "correct_choice_id": "hidden-removed",
        "correct_en": "Correct: display: none hides the element and removes the space it occupied.",
        "id": "display-none",
        "incorrect_ar": "ليست هذه النتيجة. جرّب مرة أخرى: none يخفي العنصر ولا يُبقي مساحته.",
        "incorrect_en": "That is not the result. Try again: none hides the element and does not keep its space.",
        "prompt_ar": "ماذا يحدث للعنصر عند ضبط display: none؟",
        "prompt_en": "What happens to an element when display: none is set?",
        "review_ar": "تذكّر: none يعني مخفيًا ومن دون مساحة.",
        "review_en": "Remember: none means hidden with no space."
      },
      {
        "choices": [
          {
            "id": "same-line",
            "is_correct": true,
            "text_ar": "العنصر المطابق لـ .badge يبقى ضمن السطر.",
            "text_en": "The element matching .badge stays within the line."
          },
          {
            "id": "new-line",
            "is_correct": false,
            "text_ar": "العنصر المطابق لـ .badge يبدأ سطرًا جديدًا.",
            "text_en": "The element matching .badge starts a new line."
          },
          {
            "id": "hidden-space",
            "is_correct": false,
            "text_ar": "العنصر يختفي ويحتفظ بمساحته.",
            "text_en": "The element is hidden and keeps its space."
          },
          {
            "id": "all-hidden",
            "is_correct": false,
            "text_ar": "كل عناصر الصفحة تختفي.",
            "text_en": "All elements on the page are hidden."
          }
        ],
        "correct_ar": "صحيح: display: inline يُبقي العنصر ضمن السطر مع المحتوى المجاور.",
        "correct_choice_id": "same-line",
        "correct_en": "Correct: display: inline keeps the element within the line beside nearby content.",
        "id": "block-inline-reading",
        "incorrect_ar": "راجع القيمة: inline تعني ضمن السطر، أما بدء سطر مستقل فيكون مع block. حاول مجددًا.",
        "incorrect_en": "Check the value: inline means within the line; block starts its own line. Try again.",
        "prompt_ar": "في هذا المثال، أي وصف صحيح؟ .badge { display: inline; }",
        "prompt_en": "Which description is correct for this rule? .badge { display: inline; }",
        "review_ar": "تذكّر: inline يبقى مع المحتوى في السطر نفسه.",
        "review_en": "Remember: inline stays with content on the same line."
      },
      {
        "choices": [
          {
            "id": "block-rule",
            "is_correct": true,
            "text_ar": "h1 { display: block; }",
            "text_en": "h1 { display: block; }"
          },
          {
            "id": "inline-rule",
            "is_correct": false,
            "text_ar": "h1 { display: inline; }",
            "text_en": "h1 { display: inline; }"
          },
          {
            "id": "none-rule",
            "is_correct": false,
            "text_ar": "h1 { display: none; }",
            "text_en": "h1 { display: none; }"
          },
          {
            "id": "color-rule",
            "is_correct": false,
            "text_ar": "h1 { color: block; }",
            "text_en": "h1 { color: block; }"
          }
        ],
        "correct_ar": "صحيح: display: block يجعل العنوان عنصرًا يبدأ سطرًا جديدًا.",
        "correct_choice_id": "block-rule",
        "correct_en": "Correct: display: block makes the heading an element that starts a new line.",
        "id": "choose-block-rule",
        "incorrect_ar": "هذه القاعدة لا تحقق المطلوب: inline يبقى ضمن السطر، وnone يخفي العنصر، وblock قيمة display. أعد المحاولة.",
        "incorrect_en": "That rule does not meet the goal: inline stays within the line, none hides the element, and block is a display value. Try again.",
        "prompt_ar": "أي قاعدة تجعل العنوان يبدأ سطرًا مستقلًا؟",
        "prompt_en": "Which rule makes the heading start on its own line?",
        "review_ar": "تذكّر: استخدم display: block لبدء سطر مستقل.",
        "review_en": "Remember: use display: block to start a separate line."
      }
    ],
    "sequence": 6,
    "starter_css": "",
    "starter_html": "<h1 class=\"title\">عنوان الصفحة</h1>\n<p>نص وبجواره <span class=\"badge\">شارة</span></p>\n<p class=\"hidden\">هذا النص سيُخفى</p>",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "تتحكم الخاصية display في طريقة ظهور العنصر ومكانه في تدفق الصفحة. سنستخدم ثلاث قيم: block وinline وnone.",
        "body_en": "The display property controls how an element appears and fits into the page. We will use three values: block, inline, and none.",
        "title_ar": "تعلّم معنى display",
        "title_en": "What display does"
      },
      {
        "body_ar": "عنصر block يبدأ سطرًا جديدًا ويشغل العرض المتاح عادةً. أما inline فيبقى ضمن السطر مع المحتوى المجاور.",
        "body_en": "A block element starts a new line and usually takes the available width. An inline element stays on the same line as nearby content.",
        "title_ar": "قارن block وinline",
        "title_en": "Compare block and inline"
      },
      {
        "body_ar": "القيمة none تخفي العنصر، ولا تترك له مساحة في الصفحة. لاحظ الفرق بين إخفاء العنصر وإبقائه ظاهرًا.",
        "body_en": "The none value hides the element and leaves no space for it in the page. Notice the difference between hiding an element and keeping it visible.",
        "title_ar": "افهم none",
        "title_en": "Understand none"
      }
    ],
    "title_ar": "العرض وترتيب العناصر",
    "title_en": "Display and Element Layout",
    "validation_rules": [
      {
            "id": "title-display-block",
            "note_ar": "اضبط `display: block` على `.title`.",
            "note_en": "Set `display: block` on `.title`.",
            "property": "display",
            "target": ".title",
            "type": "css-declaration",
            "value": "block"
      },
      {
            "id": "badge-display-inline",
            "note_ar": "اضبط `display: inline` على `.badge`.",
            "note_en": "Set `display: inline` on `.badge`.",
            "property": "display",
            "target": ".badge",
            "type": "css-declaration",
            "value": "inline"
      },
      {
            "id": "hidden-display-none",
            "note_ar": "اضبط `display: none` على `.hidden`.",
            "note_en": "Set `display: none` on `.hidden`.",
            "property": "display",
            "target": ".hidden",
            "type": "css-declaration",
            "value": "none"
      }
    ]
  },
  "css-flexbox": {
    "code_explanation": [
      {
        "code": ".cards { display: flex;",
        "why_ar": "يختار `.cards` ويحوّلها إلى حاوية Flex؛ هذا يفعّل ترتيب عناصرها الأبناء.",
        "why_en": "Selects `.cards` and turns it into a Flex container, enabling its child items to be arranged."
      },
      {
        "code": "  flex-direction: row;",
        "why_ar": "يجعل العناصر في صف أفقي.",
        "why_en": "Places the items in a horizontal row."
      },
      {
        "code": "  justify-content: center;",
        "why_ar": "يضع العناصر في وسط الصف أفقيًا.",
        "why_en": "Centers the items horizontally along the row."
      },
      {
        "code": "  align-items: center;",
        "why_ar": "يحاذي العناصر عموديًا في وسط الحاوية.",
        "why_en": "Aligns the items vertically in the center of the container."
      },
      {
        "code": "  gap: 12px; }",
        "why_ar": "يضيف مسافة 12px بين العناصر، ثم يغلق قاعدة CSS.",
        "why_en": "Adds 12px of space between items, then closes the CSS rule."
      }
    ],
    "example_code": ".cards { display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  gap: 12px; }",
    "id": "css-flexbox",
    "objective_ar": "استخدم Flexbox لترتيب العناصر في صف أو عمود، وضبط محاذاتها والمسافة بينها.",
    "objective_en": "Use Flexbox to arrange items in a row or column and control their alignment and spacing.",
    "outcome_ar": "بعد الدرس، ستتمكن من ترتيب مجموعة عناصر بـ Flexbox وضبط اتجاهها ومحاذاتها والمسافة بينها.",
    "outcome_en": "After this lesson, you can arrange a group of items with Flexbox and control its direction, alignment, and spacing.",
    "path_id": "css-fundamentals",
    "practice_ar": "على `.cards`، أضف كل تصريح منفصلًا: ١. `display: flex`. ٢. `flex-direction: row`. ٣. `align-items: center`. ٤. `gap: 12px`.",
    "practice_en": "On `.cards`, add each declaration separately: 1. `display: flex`. 2. `flex-direction: row`. 3. `align-items: center`. 4. `gap: 12px`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "يرتّب أبناءها المباشرين كعناصر Flex، في صف افتراضيًا.",
            "text_en": "Arranges its direct children as Flex items, in a row by default."
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "يحوّل كل نص داخلها إلى عنوان.",
            "text_en": "Turns all text inside it into a heading."
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "يضيف مسافة ثابتة بين جميع عناصر الصفحة.",
            "text_en": "Adds fixed spacing between all elements on the page."
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "يجعل الحاوية تختفي من الصفحة.",
            "text_en": "Hides the container from the page."
          }
        ],
        "correct_ar": "صحيح: الحاوية تصبح Flex، ويُرتّب Flex أبناءها المباشرين كعناصر، في صف افتراضيًا.",
        "correct_choice_id": "a",
        "correct_en": "Correct: the container becomes a Flex container, arranging its direct children as items in a row by default.",
        "id": "flex-quiz-1",
        "incorrect_ar": "ليس هذا دور `display: flex`: فهو لا يخفي العنصر ولا ينسّق كل الصفحة؛ بل يرتّب أبناء الحاوية. جرّب مرة أخرى.",
        "incorrect_en": "That is not what `display: flex` does: it does not hide the element or style the whole page; it arranges the container’s children. Try again.",
        "prompt_ar": "ماذا يفعل `display: flex` بالحاوية؟",
        "prompt_en": "What does `display: flex` do to a container?",
        "review_ar": "تذكّر: `display: flex` يفعّل ترتيب Flex داخل العنصر المحدد.",
        "review_en": "Remember: `display: flex` enables Flex layout inside the selected element."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "`justify-content: center`",
            "text_en": "`justify-content: center`"
          },
          {
            "id": "b",
            "is_correct": true,
            "text_ar": "`align-items: center`",
            "text_en": "`align-items: center`"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "`flex-direction: center`",
            "text_en": "`flex-direction: center`"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "`gap: center`",
            "text_en": "`gap: center`"
          }
        ],
        "correct_ar": "صحيح: في الصف، `align-items` يتحكم بالمحاذاة العمودية؛ أما `justify-content` فيتحكم بالاتجاه الأفقي.",
        "correct_choice_id": "b",
        "correct_en": "Correct: in a row, `align-items` controls vertical alignment; `justify-content` controls the horizontal direction.",
        "id": "flex-quiz-2",
        "incorrect_ar": "في الصف، المحور الأفقي هو اتجاه `justify-content`، والمحاذاة العمودية تكون عبر `align-items`. أعد المحاولة.",
        "incorrect_en": "In a row, `justify-content` works horizontally, while vertical alignment uses `align-items`. Try again.",
        "prompt_ar": "في صف أفقي، أي خاصية تحاذي العناصر عموديًا في الوسط؟",
        "prompt_en": "In a horizontal row, which property centers items vertically?",
        "review_ar": "مع `flex-direction: row`: استخدم `justify-content` أفقيًا و`align-items` عموديًا.",
        "review_en": "With `flex-direction: row`: use `justify-content` horizontally and `align-items` vertically."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "`.cards { display: block; gap: 12px; }`",
            "text_en": "`.cards { display: block; gap: 12px; }`"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "`.cards { display: flex; flex-direction: column; gap: 12px; }`",
            "text_en": "`.cards { display: flex; flex-direction: column; gap: 12px; }`"
          },
          {
            "id": "c",
            "is_correct": true,
            "text_ar": "`.cards { display: flex; flex-direction: row; gap: 12px; }`",
            "text_en": "`.cards { display: flex; flex-direction: row; gap: 12px; }`"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "`.cards { flex-direction: row; margin: 12px; }`",
            "text_en": "`.cards { flex-direction: row; margin: 12px; }`"
          }
        ],
        "correct_ar": "صحيح: `display: flex` يفعّل Flex، و`flex-direction: row` يختار الصف، و`gap` يضيف المسافة بين العناصر.",
        "correct_choice_id": "c",
        "correct_en": "Correct: `display: flex` enables Flex, `flex-direction: row` chooses a row, and `gap` adds space between items.",
        "id": "flex-quiz-3",
        "incorrect_ar": "ابحث عن القاعدة التي تجمع تفعيل Flex، واختيار `row`، واستخدام `gap` للمسافة بين العناصر. حاول مرة أخرى.",
        "incorrect_en": "Look for the rule that enables Flex, chooses `row`, and uses `gap` for spacing between items. Try again.",
        "prompt_ar": "أي قاعدة تعرض عناصر `.cards` في صف وتضيف `12px` بينها؟",
        "prompt_en": "Which rule displays `.cards` items in a row with `12px` between them?",
        "review_ar": "`gap` يفصل بين عناصر Flex؛ أما `margin` فيضيف هامشًا حول العنصر.",
        "review_en": "`gap` spaces Flex items apart; `margin` adds space around an element."
      }
    ],
    "sequence": 7,
    "starter_css": "",
    "starter_html": "<div class=\"cards\">\n  <div>First card</div>\n  <div>Second card</div>\n</div>",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "`display: flex` يجعل العنصر حاوية Flex، ويرتّب أبناءه المباشرين في صف افتراضيًا. استخدمه عندما تريد تنظيم مجموعة عناصر بسهولة.",
        "body_en": "`display: flex` makes an element a Flex container and arranges its direct children in a row by default. Use it to organize a group of items easily.",
        "title_ar": "ابدأ بـ Flexbox",
        "title_en": "Start with Flexbox"
      },
      {
        "body_ar": "`flex-direction` يختار صفًا (`row`) أو عمودًا (`column`). في الصف، `justify-content` يوزّع العناصر أفقيًا، و`align-items` يحاذيها عموديًا.",
        "body_en": "`flex-direction` chooses a row (`row`) or a column (`column`). In a row, `justify-content` positions items horizontally, while `align-items` aligns them vertically.",
        "title_ar": "الاتجاه والمحاذاة",
        "title_en": "Direction and alignment"
      },
      {
        "body_ar": "`gap` يضيف مسافة بين العناصر من دون إضافة هوامش لكل عنصر. جرّب ضبط الاتجاه والمحاذاة والمسافة على الحاوية نفسها.",
        "body_en": "`gap` adds space between items without adding margins to each one. Try setting direction, alignment, and spacing on the container itself.",
        "title_ar": "أضف مسافة",
        "title_en": "Add spacing"
      }
    ],
    "title_ar": "أساسيات Flexbox",
    "title_en": "Flexbox Basics",
    "validation_rules": [
      {
            "id": "cards-display-flex",
            "note_ar": "على `.cards`، اضبط `display` على `flex`.",
            "note_en": "On `.cards`, set `display` to `flex`.",
            "property": "display",
            "target": ".cards",
            "type": "css-declaration",
            "value": "flex"
      },
      {
            "id": "cards-direction-row",
            "note_ar": "على `.cards`، اضبط `flex-direction` على `row`.",
            "note_en": "On `.cards`, set `flex-direction` to `row`.",
            "property": "flex-direction",
            "target": ".cards",
            "type": "css-declaration",
            "value": "row"
      },
      {
            "id": "cards-align-center",
            "note_ar": "على `.cards`، اضبط `align-items` على `center`.",
            "note_en": "On `.cards`, set `align-items` to `center`.",
            "property": "align-items",
            "target": ".cards",
            "type": "css-declaration",
            "value": "center"
      },
      {
            "id": "cards-gap-12",
            "note_ar": "على `.cards`، اضبط `gap` على `12px`.",
            "note_en": "On `.cards`, set `gap` to `12px`.",
            "property": "gap",
            "target": ".cards",
            "type": "css-declaration",
            "value": "12px"
      }
    ]
  },
  "css-responsive": {
    "code_explanation": [
      {
        "code": ".card {",
        "why_ar": "يختار العنصر الذي يحمل class باسم card، وتبدأ القوس بكتابة قواعده.",
        "why_en": "Selects the element with the class card; the brace begins its rules."
      },
      {
        "code": "  width: 100%;",
        "why_ar": "يجعل البطاقة بعرض المساحة المتاحة، وهو أساس مناسب للشاشة الصغيرة.",
        "why_en": "Makes the card use the available width, a useful starting point for a small screen."
      },
      {
        "code": "  padding: 16px;",
        "why_ar": "يضيف مساحة داخل البطاقة كي لا يلتصق النص بحافتها.",
        "why_en": "Adds inner space so the text does not touch the card's edge."
      },
      {
        "code": "}",
        "why_ar": "ينهي مجموعة القواعد الأساسية، التي تعمل قبل أي تغيير مشروط.",
        "why_en": "Ends the base rules, which apply before any conditional change."
      },
      {
        "code": "@media (min-width: 600px) {",
        "why_ar": "يبدأ قواعد إضافية عندما يكون عرض الشاشة 600px أو أكثر.",
        "why_en": "Starts extra rules when the screen is 600px wide or wider."
      },
      {
        "code": "  .card { width: 60%; }",
        "why_ar": "على الشاشة الأوسع، يجعل البطاقة تشغل 60% من المساحة بدل العرض الكامل.",
        "why_en": "On the wider screen, makes the card use 60% of the space instead of the full width."
      }
    ],
    "example_code": ".card {\n  width: 100%;\n  padding: 16px;\n}\n@media (min-width: 600px) {\n  .card { width: 60%; }\n}",
    "id": "css-responsive",
    "objective_ar": "اكتب CSS يبدأ بتخطيط مناسب للهاتف، ثم غيّره باستخدام media query عند اتساع الشاشة.",
    "objective_en": "Write CSS that starts with a phone-friendly layout, then changes it with a media query on wider screens.",
    "outcome_ar": "ستستطيع بدء تنسيق مناسب للهاتف، وقراءة شرط min-width أو max-width، وإضافة تغيير للشاشات الأوسع.",
    "outcome_en": "You can start with phone-friendly styles, read a min-width or max-width condition, and add a change for wider screens.",
    "path_id": "css-fundamentals",
    "practice_ar": "١. اجعل عرض `.card` الأساسي `100%`. ٢. أضف `padding: 16px` أساسيًا. ٣. داخل `@media (min-width: 600px)` اجعل عرض `.card` `60%`.",
    "practice_en": "1. Set the base width of `.card` to `100%`. 2. Add base `padding: 16px`. 3. Inside `@media (min-width: 600px)`, set `.card` width to `60%`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "نكتب قواعد الهاتف أولًا، ثم نضيف قواعد للشاشات الأوسع عند الحاجة.",
            "text_en": "Write phone rules first, then add rules for wider screens when needed."
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "نكتب قواعد الشاشة الأوسع فقط، ونفترض أن الهاتف سيطابقها.",
            "text_en": "Write rules only for the widest screen and assume phones will match them."
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "نستخدم max-width في كل قاعدة، حتى إن لم نحتج شرطًا.",
            "text_en": "Use max-width in every rule, even when no condition is needed."
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "نغيّر حجم الشاشة بواسطة CSS بدل تنسيق الصفحة.",
            "text_en": "Change the screen size with CSS instead of styling the page."
          }
        ],
        "correct_ar": "صحيح: ابدأ بقواعد صغيرة الشاشة، ثم أضف تغييرات للشاشات الأوسع عند الحاجة.",
        "correct_choice_id": "a",
        "correct_en": "Correct: start with small-screen rules, then add changes for wider screens when needed.",
        "id": "mobile-first",
        "incorrect_ar": "ليست الإجابة الصحيحة. فكّر في القاعدة الأساسية التي تعمل على الهاتف أولًا، ثم التغييرات الإضافية. جرّب مرة أخرى.",
        "incorrect_en": "Not quite. Think of the base rules that work on a phone first, followed by extra changes. Try again.",
        "prompt_ar": "أي خيار يصف أسلوب mobile-first؟",
        "prompt_en": "Which option describes mobile-first?",
        "review_ar": "mobile-first يعني أن القواعد الأساسية للشاشة الصغيرة تأتي أولًا؛ ويمكن إضافة media query للشاشات الأكبر.",
        "review_en": "Mobile-first means the small-screen base rules come first; a media query can add changes for larger screens."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "تعمل القواعد عندما يكون العرض أقل من 600px فقط.",
            "text_en": "The rules apply only when the width is less than 600px."
          },
          {
            "id": "b",
            "is_correct": true,
            "text_ar": "تعمل القواعد عندما يكون العرض 600px أو أكثر.",
            "text_en": "The rules apply when the width is 600px or more."
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "تعمل القواعد فقط عند عرض 600px بالضبط.",
            "text_en": "The rules apply only at exactly 600px wide."
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "تعمل القواعد بغض النظر عن عرض الشاشة.",
            "text_en": "The rules apply regardless of screen width."
          }
        ],
        "correct_ar": "صحيح: min-width: 600px يشمل 600px وكل عرض أكبر.",
        "correct_choice_id": "b",
        "correct_en": "Correct: min-width: 600px includes 600px and every wider width.",
        "id": "min-width-meaning",
        "incorrect_ar": "ليست الإجابة الصحيحة. min-width تعني الحد الأدنى للعرض، لا الحد الأعلى ولا قيمة واحدة فقط. جرّب مرة أخرى.",
        "incorrect_en": "Not quite. min-width means a lower limit, not an upper limit or one exact width. Try again.",
        "prompt_ar": "ماذا يعني الشرط @media (min-width: 600px)؟",
        "prompt_en": "What does the condition @media (min-width: 600px) mean?",
        "review_ar": "شرط min-width: 600px يتحقق عند 600px وما فوق. أما max-width فيحدد حدًا أعلى.",
        "review_en": "The min-width: 600px condition is true at 600px and above. max-width sets an upper limit."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "لا يمكن أن يحتوي شرط min-width على قيمة رقمية.",
            "text_en": "A min-width condition cannot contain a number."
          },
          {
            "id": "b",
            "is_correct": true,
            "text_ar": "قواعد الأساس التي تحدد مظهر البطاقة على الشاشة الصغيرة.",
            "text_en": "Base rules that define the card's appearance on a small screen."
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "يجب حذف .card من القاعدة.",
            "text_en": "The .card selector must be removed from the rule."
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "الشرط يغيّر عرض الجهاز بدل عرض البطاقة.",
            "text_en": "The condition changes the device width instead of the card width."
          }
        ],
        "correct_ar": "صحيح: قاعدة داخل min-width تضيف تغييرًا للشاشات الأوسع، لكنها لا تحدد وحدها قواعد البطاقة الأساسية للهاتف.",
        "correct_choice_id": "b",
        "correct_en": "Correct: a min-width rule adds a change for wider screens, but it does not by itself define the card's base rules for a phone.",
        "id": "missing-base-rule",
        "incorrect_ar": "ليست الإجابة الصحيحة. الشرط يختار متى تعمل القواعد؛ ابحث عمّا يجب أن يحدد شكل البطاقة قبل تحقق الشرط. جرّب مرة أخرى.",
        "incorrect_en": "Not quite. The condition chooses when rules apply; look for what should define the card before that condition is true. Try again.",
        "prompt_ar": "في هذا المثال، ما النقص إذا أردنا تخطيطًا mobile-first؟\n@media (min-width: 600px) { .card { width: 60%; } }",
        "prompt_en": "In this example, what is missing if we want a mobile-first layout?\n@media (min-width: 600px) { .card { width: 60%; } }",
        "review_ar": "في mobile-first، أضف قواعد البطاقة الأساسية خارج media query للشاشة الصغيرة، ثم استخدم min-width للتغيير على الشاشات الأوسع.",
        "review_en": "For mobile-first, put the card's base rules outside the media query for small screens, then use min-width for wider-screen changes."
      }
    ],
    "sequence": 8,
    "starter_css": "",
    "starter_html": "<article class=\"card\">\n  <h1>My garden</h1>\n  <p>A small, calm space to read.</p>\n</article>",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "اكتب القواعد الأساسية للشاشة الصغيرة أولًا. هذا هو أسلوب mobile-first: ابدأ بتصميم بسيط ومقروء، ثم أضف التغييرات للشاشات الأكبر.",
        "body_en": "Write the basic rules for a small screen first. This is mobile-first: begin with a simple, readable layout, then add changes for larger screens.",
        "title_ar": "تعلّم: ابدأ بالهاتف",
        "title_en": "Learning: Start with mobile"
      },
      {
        "body_ar": "تضيف @media قواعد عند تحقق شرط. مثلًا، min-width: 600px تعني أن الشاشة عرضها 600px أو أكثر؛ وmax-width: 600px تعني 600px أو أقل.",
        "body_en": "@media adds rules when a condition is true. For example, min-width: 600px means the screen is 600px wide or wider; max-width: 600px means 600px or narrower.",
        "title_ar": "افهم: حدّد نقطة التغيير",
        "title_en": "Understand: Choose a breakpoint"
      },
      {
        "body_ar": "في المثال، عرض البطاقة يبدأ بعرض المساحة كلها. عند 600px أو أكثر، يتغير إلى 60%؛ وهكذا يبقى الأساس مناسبًا للهاتف.",
        "body_en": "In the example, the card starts by using the full available width. At 600px or wider, it changes to 60%, while the base layout stays phone-friendly.",
        "title_ar": "تدرّب: اقرأ التغيير",
        "title_en": "Practice: Read the change"
      }
    ],
    "title_ar": "تصميم يستجيب للشاشات",
    "title_en": "Design for Different Screens",
    "validation_rules": [
      {
            "id": "card-mobile-width",
            "note_ar": "في القاعدة الأساسية خارج media query، اضبط عرض `.card` على `100%`.",
            "note_en": "In the base rule outside a media query, set `.card` width to `100%`.",
            "property": "width",
            "target": ".card",
            "type": "css-declaration",
            "value": "100%"
      },
      {
            "id": "card-mobile-padding",
            "type": "css-declaration",
            "target": ".card",
            "property": "padding",
            "value": "16px",
            "note_ar": "في القاعدة الأساسية خارج media query، أضف `padding: 16px` إلى `.card`.",
            "note_en": "In the base rule outside a media query, add `padding: 16px` to `.card`."
      },
      {
            "id": "card-breakpoint",
            "type": "css-declaration-in-media",
            "target": ".card",
            "property": "width",
            "value": "60%",
            "media": "(min-width: 600px)",
            "note_ar": "داخل `@media (min-width: 600px)`، اضبط عرض `.card` على `60%`.",
            "note_en": "Inside `@media (min-width: 600px)`, set `.card` width to `60%`."
      }
    ]
  },
  "js-what-is-javascript": {
    "code_explanation": [
      {
        "code": "const message = document.querySelector(\"#message\");",
        "why_ar": "تبحث `document.querySelector` عن العنصر الذي يطابق `#message`، وتحفظه `const message` كي نستخدمه في التعليمة التالية.",
        "why_en": "`document.querySelector` finds the element that matches `#message`, and `const message` stores it so we can use it in the next instruction."
      },
      {
        "code": "message.textContent = \"Hello, JavaScript!\";",
        "why_ar": "تغيّر هذه التعليمة النص داخل العنصر الموجود إلى `Hello, JavaScript!`؛ لذلك يظهر التغيير في الصفحة.",
        "why_en": "This instruction changes the text inside the existing element to `Hello, JavaScript!`, so the change appears on the page."
      }
    ],
    "example_code": "const message = document.querySelector(\"#message\");\nmessage.textContent = \"Hello, JavaScript!\";",
    "id": "js-what-is-javascript",
    "objective_ar": "افهم كيف تضيف JavaScript سلوكًا إلى الصفحة، وغيّر نص عنصر موجود باستخدام JavaScript.",
    "objective_en": "Understand how JavaScript adds behavior to a page, and change the text of an existing element with JavaScript.",
    "outcome_ar": "ستفهم أن JavaScript تضيف سلوكًا، وستتمكن من اختيار عنصر موجود وتغيير نصه.",
    "outcome_en": "You will understand that JavaScript adds behavior and be able to select an existing element and change its text.",
    "path_id": "javascript-fundamentals",
    "practice_ar": "١. عرّف `message` باستخدام `const`. ٢. باستخدام `document.querySelector`، اختر العنصر `#message` الموجود في HTML. ٣. بعد التعريف، أسند إلى `message.textContent` نصًا حرفيًا جديدًا غير فارغ.",
    "practice_en": "1. Declare `message` with `const`. 2. Use `document.querySelector` to select the existing `#message` element in the HTML. 3. After the declaration, assign a new, non-empty string literal to `message.textContent`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "إضافة سلوك، مثل تغيير رسالة في الصفحة.",
            "text_en": "Adding behavior, such as changing a message on the page."
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "وصف بنية الصفحة بعناصر HTML.",
            "text_en": "Describing page structure with HTML elements."
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "تنسيق لون النص فقط.",
            "text_en": "Styling text color only."
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "إنشاء صورة للصفحة.",
            "text_en": "Creating an image for the page."
          }
        ],
        "correct_ar": "صحيح: JavaScript تضيف سلوكًا، وهنا تغيّر نص عنصر موجود.",
        "correct_choice_id": "a",
        "correct_en": "Correct: JavaScript adds behavior, and here it changes the text of an existing element.",
        "id": "q1",
        "incorrect_ar": "ليست JavaScript هي HTML التي تصف البنية، ولا CSS التي تنسّق المظهر. الإجابة الصحيحة: JavaScript تضيف السلوك.",
        "incorrect_en": "JavaScript is not HTML, which describes structure, or CSS, which styles appearance. The correct answer is that JavaScript adds behavior.",
        "prompt_ar": "ما الدور الذي توضّحه JavaScript في هذا الدرس؟",
        "prompt_en": "What role does JavaScript demonstrate in this lesson?",
        "review_ar": "تذكّر: HTML للبنية، وCSS للمظهر، وJavaScript للسلوك.",
        "review_en": "Remember: HTML is for structure, CSS for appearance, and JavaScript for behavior."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "نص العنصر الذي تشير إليه `message` يصبح `Hi!`.",
            "text_en": "The text of the element referenced by `message` becomes `Hi!`."
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "يُحذف العنصر من الصفحة.",
            "text_en": "The element is removed from the page."
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "يتغير معرّف العنصر إلى `Hi!`.",
            "text_en": "The element's id changes to `Hi!`."
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "يتغير لون خلفية الصفحة إلى `Hi!`.",
            "text_en": "The page background color changes to `Hi!`."
          }
        ],
        "correct_ar": "صحيح: `textContent` هو النص داخل العنصر، وإسناد قيمة جديدة يغيّر ذلك النص.",
        "correct_choice_id": "a",
        "correct_en": "Correct: `textContent` is the text inside the element, and assigning a new value changes that text.",
        "id": "q2",
        "incorrect_ar": "هذه التعليمة لا تحذف العنصر ولا تغيّر معرّفه أو تنسيقه. الإجابة الصحيحة: يتغير النص داخله إلى `Hi!`.",
        "incorrect_en": "This instruction does not remove the element or change its id or styling. The correct answer is that its text becomes `Hi!`.",
        "prompt_ar": "بعد تنفيذ `message.textContent = \"Hi!\";`، ما الذي يتغير؟",
        "prompt_en": "After `message.textContent = \"Hi!\";` runs, what changes?",
        "review_ar": "ابحث عن `textContent` لتعرف أن التعليمة تغيّر نص العنصر.",
        "review_en": "Look for `textContent` to see that the instruction changes the element's text."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "`const message = document.querySelector(\"#message\");` ثم `message.textContent = \"Done!\";`",
            "text_en": "`const message = document.querySelector(\"#message\");` then `message.textContent = \"Done!\";`"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "`const message = document.querySelector(\"message\");` ثم `message.textContent = \"Done!\";`",
            "text_en": "`const message = document.querySelector(\"message\");` then `message.textContent = \"Done!\";`"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "`const message = document.querySelector(\"#message\");` ثم `message = \"Done!\";`",
            "text_en": "`const message = document.querySelector(\"#message\");` then `message = \"Done!\";`"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "`const message = document.querySelector(\"#other\");` ثم `message.textContent = \"Done!\";`",
            "text_en": "`const message = document.querySelector(\"#other\");` then `message.textContent = \"Done!\";`"
          }
        ],
        "correct_ar": "صحيح: `#message` يختار العنصر ذي المعرّف `message`، و`textContent` يغيّر نصه.",
        "correct_choice_id": "a",
        "correct_en": "Correct: `#message` selects the element with the `message` id, and `textContent` changes its text.",
        "id": "q3",
        "incorrect_ar": "انتبه: `#` ضرورية لاختيار معرّف، ويجب تغيير `message.textContent` لا استبدال المتغير كله. الإجابة الصحيحة هي الخيار الذي يستخدم `#message` ثم `textContent`.",
        "incorrect_en": "Notice: `#` is needed to select an id, and you must change `message.textContent`, not replace the whole variable. The correct choice uses `#message` and then `textContent`.",
        "prompt_ar": "أي خيار يختار الفقرة ذات المعرّف `message` ثم يغيّر نصها؟",
        "prompt_en": "Which choice selects the paragraph with the `message` id and then changes its text?",
        "review_ar": "للمعرّف استخدم `#message`، ولتغيير النص استخدم `message.textContent`.",
        "review_en": "For the id, use `#message`; to change the text, use `message.textContent`."
      }
    ],
    "sequence": 1,
    "starter_css": "",
    "starter_html": "<p id=\"message\">This message is ready to change.</p>",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "تصف HTML محتوى الصفحة، وتنسّق CSS مظهره. أمّا JavaScript فتضيف سلوكًا: يمكنها مثلًا تغيير رسالة موجودة على الصفحة.",
        "body_en": "HTML describes page content, and CSS styles its appearance. JavaScript adds behavior—for example, it can change a message already on the page.",
        "title_ar": "JavaScript تضيف سلوكًا",
        "title_en": "JavaScript adds behavior"
      },
      {
        "body_ar": "في المثال، تبحث التعليمة الأولى عن العنصر الذي يحمل المعرّف `message`. ثم تغيّر التعليمة الثانية النص داخله. لا تنشئ JavaScript عنصرًا جديدًا هنا؛ بل تغيّر عنصرًا موجودًا.",
        "body_en": "In the example, the first instruction finds the element with the `message` id. The second changes its text. JavaScript does not create a new element here; it changes one that already exists.",
        "title_ar": "اقرأ التعليمات",
        "title_en": "Read the instructions"
      },
      {
        "body_ar": "اقرأ المثال وتوقّع: ما النص الذي سيظهر في الفقرة بعد تنفيذ التعليمتين؟ لاحظ أن `#message` يشير إلى المعرّف `message`.",
        "body_en": "Read the example and predict: what text will appear in the paragraph after both instructions run? Notice that `#message` refers to the `message` id.",
        "title_ar": "توقّع التغيير",
        "title_en": "Predict the change"
      }
    ],
    "title_ar": "ما هي JavaScript؟",
    "title_en": "What Is JavaScript?",
    "validation_rules": [
      {
            "id": "js-message-const",
            "note_ar": "عرّف متغيرًا اسمه `message` باستخدام `const`.",
            "note_en": "Declare a variable named `message` with `const`.",
            "property": "const",
            "target": "message",
            "type": "js-declaration"
      },
      {
            "id": "js-query-selector",
            "note_ar": "استخدم `document.querySelector(\"#message\")` لإسناد عنصر HTML الموجود إلى `message`.",
            "note_en": "Use `document.querySelector(\"#message\")` to bind the existing HTML element to `message`.",
            "type": "js-selector-binding",
            "variable": "message",
            "selector": "#message"
      },
      {
            "id": "js-text-content",
            "note_ar": "بعد تعريف `message`، أسند إليه نصًا حرفيًا غير فارغ عبر `message.textContent`.",
            "note_en": "After declaring `message`, assign a non-empty string literal through `message.textContent`.",
            "target": "message.textContent",
            "type": "js-assignment",
            "expectedType": "string",
            "mustBeNonEmpty": true,
            "mustFollowVariable": "message",
            "mustFollowKind": "const"
      }
    ]
  },
  "js-variables": {
    "code_explanation": [
      {
        "code": "const learnerName = \"Mina\";",
        "why_ar": "يخزّن الاسم learnerName النص Mina. استخدمنا const لأننا لن نعيد إسناد قيمة أخرى إليه.",
        "why_en": "Stores the text Mina under the name learnerName. We use const because we will not reassign it."
      },
      {
        "code": "let points = 0;",
        "why_ar": "ينشئ points بقيمة البداية 0. استخدمنا let لأننا سنغيّر القيمة لاحقًا.",
        "why_en": "Creates points with a starting value of 0. We use let because we will change its value later."
      },
      {
        "code": "points = 3;",
        "why_ar": "يعيد إسناد قيمة جديدة إلى points؛ يبقى الاسم نفسه وتصبح قيمته 3.",
        "why_en": "Reassigns a new value to points; the name stays the same and its value becomes 3."
      }
    ],
    "example_code": "const learnerName = \"Mina\";\nlet points = 0;\npoints = 3;",
    "id": "js-variables",
    "objective_ar": "أنشئ أسماءً واضحة للمتغيرات، واختر const للقيمة التي لا تعيد إسنادها وlet للقيمة التي قد تغيّرها.",
    "objective_en": "Create clear variable names, choosing const for a value you will not reassign and let for one you may change.",
    "outcome_ar": "تستطيع تسمية القيم، واختيار const أو let، وإعادة إسناد قيمة عند الحاجة.",
    "outcome_en": "You can name stored values, choose const or let, and reassign a value when needed.",
    "path_id": "javascript-fundamentals",
    "practice_ar": "١. عرّف `courseName` باستخدام `const` واجعل قيمته النص `JavaScript`. ٢. عرّف `lessonCount` باستخدام `let` واجعل قيمته العدد `1`. ٣. بعد التعريف، أعد إسناد عدد مختلف عن `1` إلى `lessonCount`.",
    "practice_en": "1. Declare `courseName` with `const` and the string `JavaScript`. 2. Declare `lessonCount` with `let` and the number `1`. 3. After the declaration, reassign `lessonCount` to a number other than `1`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "const",
            "text_en": "const"
          },
          {
            "id": "b",
            "is_correct": true,
            "text_ar": "let",
            "text_en": "let"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "=",
            "text_en": "="
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "اسم المتغير",
            "text_en": "the variable name"
          }
        ],
        "correct_ar": "صحيح: let يسمح بإسناد قيمة جديدة إلى الاسم لاحقًا.",
        "correct_choice_id": "b",
        "correct_en": "Correct: let allows a new value to be assigned to the name later.",
        "id": "const-or-let",
        "incorrect_ar": "ليست هذه الإجابة. const لا يناسب إعادة الإسناد، و= علامة الإسناد لا كلمة تعريف. حاول مرة أخرى.",
        "incorrect_en": "Not quite. const is not for reassignment, and = is an assignment sign, not a declaration keyword. Try again.",
        "prompt_ar": "أي كلمة تختار لمتغير قد تحتاج إلى تغيير قيمته لاحقًا؟",
        "prompt_en": "Which keyword should you choose for a variable whose value may need to change later?",
        "review_ar": "تذكّر: اختر let عندما تريد إمكان تغيير القيمة المخزّنة.",
        "review_en": "Remember: choose let when you want the stored value to be changeable."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "0",
            "text_en": "0"
          },
          {
            "id": "b",
            "is_correct": true,
            "text_ar": "3",
            "text_en": "3"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "points",
            "text_en": "points"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "لا توجد قيمة",
            "text_en": "No value"
          }
        ],
        "correct_ar": "صحيح: السطر الثاني أعاد إسناد 3 إلى points، فاستبدل قيمة البداية.",
        "correct_choice_id": "b",
        "correct_en": "Correct: the second line reassigned 3 to points, replacing the starting value.",
        "id": "read-reassignment",
        "incorrect_ar": "ليست هذه الإجابة. راقب سطر إعادة الإسناد: القيمة الأحدث هي 3. حاول مرة أخرى.",
        "incorrect_en": "Not quite. Look at the reassignment line: the latest value is 3. Try again.",
        "prompt_ar": "بعد تنفيذ السطرين، ما القيمة المخزّنة في points؟\nlet points = 0;\npoints = 3;",
        "prompt_en": "After these two lines, what value is stored in points?\nlet points = 0;\npoints = 3;",
        "review_ar": "إعادة الإسناد تغيّر القيمة المرتبطة بالاسم؛ لا تنشئ اسمًا جديدًا.",
        "review_en": "Reassignment changes the value associated with a name; it does not create a new name."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "const courseName = \"JS\"; let lessonCount = 1; lessonCount = 2;",
            "text_en": "const courseName = \"JS\"; let lessonCount = 1; lessonCount = 2;"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "let courseName = \"JS\"; const lessonCount = 1; lessonCount = 2;",
            "text_en": "let courseName = \"JS\"; const lessonCount = 1; lessonCount = 2;"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "const courseName = \"JS\"; const lessonCount = 1; lessonCount = 2;",
            "text_en": "const courseName = \"JS\"; const lessonCount = 1; lessonCount = 2;"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "let courseName = \"JS\"; let lessonCount = 1;",
            "text_en": "let courseName = \"JS\"; let lessonCount = 1;"
          }
        ],
        "correct_ar": "صحيح: const يعبّر عن courseName غير المعاد إسناده، وlet يسمح بتغيير lessonCount.",
        "correct_choice_id": "a",
        "correct_en": "Correct: const fits courseName, which is not reassigned, and let allows lessonCount to change.",
        "id": "choose-valid-code",
        "incorrect_ar": "ليست هذه الإجابة. ابحث عن مقطع لا يعيد إسناد const، ويستخدم let للاسم الذي ستتغير قيمته. حاول مرة أخرى.",
        "incorrect_en": "Not quite. Look for a snippet that does not reassign a const and uses let for the name whose value will change. Try again.",
        "prompt_ar": "أي مقطع يستخدم const وlet بما يناسب السلوك المطلوب؟ نريد إبقاء courseName كما هو، وتغيير lessonCount لاحقًا.",
        "prompt_en": "Which snippet uses const and let for the intended behavior? Keep courseName unchanged, and change lessonCount later.",
        "review_ar": "تطابق الكلمة مع طريقة استخدام القيمة يجعل الشيفرة أوضح ويمنع إعادة إسناد غير مناسبة.",
        "review_en": "Matching the keyword to how a value is used keeps code clear and prevents inappropriate reassignment."
      }
    ],
    "sequence": 2,
    "starter_css": "",
    "starter_html": "",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "المتغير اسم نستخدمه للإشارة إلى قيمة مخزّنة. نكتب const أو let، ثم اسمًا واضحًا، ثم = والقيمة.",
        "body_en": "A variable is a name we use for a stored value. Write const or let, then a clear name, then = and the value.",
        "title_ar": "تخزين قيمة",
        "title_en": "Store a value"
      },
      {
        "body_ar": "استخدم const إذا لن تعيد إسناد قيمة مختلفة إلى الاسم. استخدم let إذا أردت إسناد قيمة جديدة إليه لاحقًا. اكتب الأسماء بوضوح، مثل points أو learnerName.",
        "body_en": "Use const if you will not assign a different value to the name. Use let if you may assign a new value later. Choose clear names, such as points or learnerName.",
        "title_ar": "اختر الكلمة المناسبة",
        "title_en": "Choose the right keyword"
      },
      {
        "body_ar": "في المثال، يبدأ points بقيمة 0 ثم يأخذ قيمة جديدة. الاسم ثابت المعنى، لكن القيمة المخزّنة فيه تتغير لأننا استخدمنا let.",
        "body_en": "In the example, points starts at 0 and then gets a new value. The name stays the same, but its stored value changes because we used let.",
        "title_ar": "اقرأ التغيير",
        "title_en": "Read the change"
      }
    ],
    "title_ar": "المتغيرات",
    "title_en": "Variables",
    "validation_rules": [
      {
            "id": "course-name-declaration",
            "note_ar": "عرّف `courseName` بـ`const` واجعل قيمته نص `JavaScript`.",
            "note_en": "Declare `courseName` with `const` and set it to the string `JavaScript`.",
            "property": "const",
            "target": "courseName",
            "type": "js-declaration",
            "expectedType": "string",
            "expectedValue": "JavaScript"
      },
      {
            "id": "lesson-count-declaration",
            "note_ar": "عرّف `lessonCount` بـ`let` واجعل قيمته العدد `1`.",
            "note_en": "Declare `lessonCount` with `let` and set it to the number `1`.",
            "property": "let",
            "target": "lessonCount",
            "type": "js-declaration",
            "expectedType": "number",
            "expectedValue": 1
      },
      {
            "id": "lesson-count-reassignment",
            "note_ar": "بعد تعريفه، أسند إلى `lessonCount` عددًا غير `1`.",
            "note_en": "After its declaration, assign a number other than `1` to `lessonCount`.",
            "target": "lessonCount",
            "type": "js-assignment",
            "expectedType": "number",
            "mustDifferFrom": 1,
            "mustFollowVariable": "lessonCount",
            "mustFollowKind": "let"
      }
    ]
  },
  "js-data-types": {
    "code_explanation": [
      {
        "code": "const score = 7;",
        "why_ar": "اسم score مرتبط بالقيمة 7، وهي عدد بلا علامات اقتباس.",
        "why_en": "The name score is linked to 7, a number without quotation marks."
      },
      {
        "code": "const scoreText = \"7\";",
        "why_ar": "علامتا الاقتباس تجعلان 7 نصًا، لا عددًا.",
        "why_en": "The quotation marks make 7 text, not a number."
      },
      {
        "code": "const isReady = true;",
        "why_ar": "القيمة true منطقية؛ فهي تمثل نعم أو صحيحًا، وليست نصًا.",
        "why_en": "The value true is Boolean; it represents yes or true, not text."
      }
    ],
    "example_code": "const score = 7;\nconst scoreText = \"7\";\nconst isReady = true;",
    "id": "js-data-types",
    "objective_ar": "ميّز بين النص والعدد والقيمة المنطقية في JavaScript، خصوصًا عندما يبدو النص والعدد متشابهين.",
    "objective_en": "Tell strings, numbers, and Boolean values apart in JavaScript, especially when text and a number look alike.",
    "outcome_ar": "أستطيع التمييز بين العدد والنص والقيمة المنطقية، وأعرف أن \"7\" نص بينما 7 عدد.",
    "outcome_en": "I can distinguish numbers, strings, and Boolean values, and know that \"7\" is text while 7 is a number.",
    "path_id": "javascript-fundamentals",
    "practice_ar": "١. عرّف `score` باستخدام `const` واجعل قيمته العدد `7` بلا اقتباس. ٢. عرّف `scoreText` باستخدام `const` واجعل قيمته النص `\"7\"` بين اقتباسين.",
    "practice_en": "1. Declare `score` with `const` and the number `7` without quotes. 2. Declare `scoreText` with `const` and the string `\"7\"` in quotes.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "7",
            "text_en": "7"
          },
          {
            "id": "b",
            "is_correct": true,
            "text_ar": "\"7\"",
            "text_en": "\"7\""
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "true",
            "text_en": "true"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "false",
            "text_en": "false"
          }
        ],
        "correct_ar": "صحيح: \"7\" نص لأن علامتي الاقتباس تحيطان به.",
        "correct_choice_id": "b",
        "correct_en": "Correct: \"7\" is text because it is surrounded by quotation marks.",
        "id": "quiz-string-number",
        "incorrect_ar": "ليست هذه الإجابة. ابحث عن القيمة المحاطة بعلامتي اقتباس؛ 7 بلا اقتباس عدد، وtrue وfalse قيمتان منطقيتان.",
        "incorrect_en": "Not quite. Look for the value surrounded by quotation marks; 7 without quotes is a number, and true and false are Boolean values.",
        "prompt_ar": "أيّ قيمة مما يلي نص وليست عددًا؟",
        "prompt_en": "Which value below is text, not a number?",
        "review_ar": "تذكّر: الاقتباس يميّز النص، بينما الرقم المكتوب بلا اقتباس عدد.",
        "review_en": "Remember: quotation marks identify text, while a number written without quotes is a number."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "نص",
            "text_en": "String"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "عدد",
            "text_en": "Number"
          },
          {
            "id": "c",
            "is_correct": true,
            "text_ar": "قيمة منطقية",
            "text_en": "Boolean"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "علامة اقتباس",
            "text_en": "Quotation mark"
          }
        ],
        "correct_ar": "صحيح: true قيمة منطقية، مثل false، ولا تحتاج إلى اقتباس.",
        "correct_choice_id": "c",
        "correct_en": "Correct: true is a Boolean value, like false, and it does not need quotation marks.",
        "id": "quiz-boolean",
        "incorrect_ar": "ليست هذه الإجابة. true ليست نصًا أو عددًا؛ إنها قيمة منطقية.",
        "incorrect_en": "Not quite. true is neither text nor a number; it is a Boolean value.",
        "prompt_ar": "في السطر const isReady = true; ما نوع القيمة true؟",
        "prompt_en": "In the line const isReady = true;, what type of value is true?",
        "review_ar": "راجع المثال: true وfalse قيمتان منطقيتان.",
        "review_en": "Review the example: true and false are Boolean values."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "كلتاهما عددان",
            "text_en": "Both are numbers"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "كلتاهما نصّان",
            "text_en": "Both are strings"
          },
          {
            "id": "c",
            "is_correct": true,
            "text_ar": "4 عدد و\"4\" نص",
            "text_en": "4 is a number and \"4\" is text"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "4 قيمة منطقية و\"4\" عدد",
            "text_en": "4 is Boolean and \"4\" is a number"
          }
        ],
        "correct_ar": "صحيح: 4 بلا اقتباس عدد، و\"4\" بين اقتباسين نص.",
        "correct_choice_id": "c",
        "correct_en": "Correct: 4 without quotes is a number, and \"4\" in quotes is text.",
        "id": "quiz-compare",
        "incorrect_ar": "ليست هذه الإجابة. قارن علامات الاقتباس: هي التي تجعل 4 نصًا في المثال الثاني.",
        "incorrect_en": "Not quite. Compare the quotation marks: they make 4 text in the second example.",
        "prompt_ar": "ما الوصف الصحيح لهاتين القيمتين: 4 و\"4\"؟",
        "prompt_en": "Which description is correct for these two values: 4 and \"4\"?",
        "review_ar": "رغم تشابه الرمز، تختلف القيمة بحسب وجود علامات الاقتباس.",
        "review_en": "Even though the symbols look alike, the value type differs based on whether quotation marks are present."
      }
    ],
    "sequence": 3,
    "starter_css": "",
    "starter_html": "",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "القيمة هي معلومة يقرأها JavaScript. يمكن أن تكون رقمًا مثل 7، أو نصًا مثل \"Hello\"، أو قيمة منطقية مثل true. في المثال، تعطي const اسمًا لكل قيمة.",
        "body_en": "A value is information JavaScript reads. It can be a number like 7, text like \"Hello\", or a Boolean value like true. In the example, const gives each value a name.",
        "title_ar": "تعلّم: القيمة بيانات",
        "title_en": "Learning: A value is data"
      },
      {
        "body_ar": "7 عدد، أما \"7\" فنص لأن حوله علامتي اقتباس. قد يبدوان متشابهين، لكن نوع القيمة مختلف.",
        "body_en": "7 is a number, while \"7\" is text because it has quotation marks. They may look alike, but their value types are different.",
        "title_ar": "افهم: الاقتباس يصنع فرقًا",
        "title_en": "Understand: Quotes make a difference"
      },
      {
        "body_ar": "في المثال، score يحمل عددًا، وscoreText يحمل نصًا، وisReady يحمل قيمة منطقية. true وfalse قيمتان منطقيتان، ولا نضع حولهما اقتباسًا.",
        "body_en": "In the example, score holds a number, scoreText holds text, and isReady holds a Boolean value. true and false are Boolean values, and we do not put quotation marks around them.",
        "title_ar": "تدرّب: تعرّف إلى الأنواع الثلاثة",
        "title_en": "Practice: Spot the three types"
      }
    ],
    "title_ar": "القيم وأنواع البيانات",
    "title_en": "Values and Data Types",
    "validation_rules": [
      {
            "id": "score-is-const",
            "note_ar": "عرّف `score` بـ`const` واجعل قيمته العدد `7` غير المحاط باقتباس.",
            "note_en": "Declare `score` with `const` and give it the unquoted number `7`.",
            "property": "const",
            "target": "score",
            "type": "js-declaration",
            "expectedType": "number",
            "expectedValue": 7
      },
      {
            "id": "score-text-is-const",
            "note_ar": "عرّف `scoreText` بـ`const` واجعل قيمته النص `\"7\"` بين اقتباسين.",
            "note_en": "Declare `scoreText` with `const` and give it the quoted string `\"7\"`.",
            "property": "const",
            "target": "scoreText",
            "type": "js-declaration",
            "expectedType": "string",
            "expectedValue": "7"
      }
    ]
  },
  "js-operators": {
    "code_explanation": [
      {
        "code": "const total = 4 + 3;",
        "why_ar": "يجمع `+` العددين، فتكون قيمة `total` هي `7`.",
        "why_en": "The `+` operator adds the numbers, so `total` is `7`."
      },
      {
        "code": "const isEnough = total >= 6;",
        "why_ar": "يقارن `>=` القيمة `7` بالعدد `6`، لذا تكون النتيجة `true`.",
        "why_en": "The `>=` operator compares `7` with `6`, so the result is `true`."
      },
      {
        "code": "const canJoin = isEnough && total < 10;",
        "why_ar": "المقارنة `total < 10` نتيجتها `true`، و`&&` يجمعها مع `isEnough`؛ لذلك `canJoin` تساوي `true`.",
        "why_en": "The comparison `total < 10` is `true`; `&&` combines it with `isEnough`, so `canJoin` is `true`."
      }
    ],
    "example_code": "const total = 4 + 3;\nconst isEnough = total >= 6;\nconst canJoin = isEnough && total < 10;",
    "id": "js-operators",
    "objective_ar": "استخدم العمليات الحسابية والمقارنات وعمليات المنطق لبناء تعبير، وتوقّع نتيجته.",
    "objective_en": "Use arithmetic, comparison, and logical operators to build an expression and predict its result.",
    "outcome_ar": "أستطيع حساب تعبير بسيط وشرح كيف تنتج المقارنة والمنطق قيمة `true` أو `false`.",
    "outcome_en": "I can evaluate a simple expression and explain how comparisons and logic produce `true` or `false`.",
    "path_id": "javascript-fundamentals",
    "practice_ar": "١. اكتب مقارنة `points >= 5`. ٢. اكتب مقارنة `points < 10`. ٣. اجمع المقارنتين نفسيهما في تعبير واحد باستخدام `&&`.",
    "practice_en": "1. Write the comparison `points >= 5`. 2. Write the comparison `points < 10`. 3. Combine those same two comparisons in one expression using `&&`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "11",
            "text_en": "11"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "74",
            "text_en": "74"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "3",
            "text_en": "3"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "`true`",
            "text_en": "`true`"
          }
        ],
        "correct_ar": "الإجابة الصحيحة هي `11`: يجمع `+` العددين.",
        "correct_choice_id": "a",
        "correct_en": "The correct answer is `11`: `+` adds the two numbers.",
        "id": "quiz-arithmetic",
        "incorrect_ar": "ليست هذه الإجابة؛ جرّب مرة أخرى. هنا `+` عملية جمع، وليس دمجًا للنصوص.",
        "incorrect_en": "Not quite; try again. Here `+` performs addition, not text joining.",
        "prompt_ar": "ما قيمة التعبير `7 + 4`؟",
        "prompt_en": "What is the value of `7 + 4`?",
        "review_ar": "`7 + 4` يساوي `11`.",
        "review_en": "`7 + 4` equals `11`."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "`true`",
            "text_en": "`true`"
          },
          {
            "id": "b",
            "is_correct": true,
            "text_ar": "`false`",
            "text_en": "`false`"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "18",
            "text_en": "18"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "8",
            "text_en": "8"
          }
        ],
        "correct_ar": "صحيح: `8` ليس أكبر من `10` ولا يساويه، لذا النتيجة `false`.",
        "correct_choice_id": "b",
        "correct_en": "Correct: `8` is neither greater than nor equal to `10`, so the result is `false`.",
        "id": "quiz-comparison",
        "incorrect_ar": "ليست هذه الإجابة؛ حاول مجددًا. `>=` تقارن العددين ولا تجمعهما.",
        "incorrect_en": "Not quite; try again. `>=` compares the numbers; it does not add them.",
        "prompt_ar": "ما نتيجة التعبير `8 >= 10`؟",
        "prompt_en": "What is the result of `8 >= 10`?",
        "review_ar": "`>=` تعني «أكبر من أو يساوي». والنتيجة هنا `false`.",
        "review_en": "`>=` means “greater than or equal to.” Here, the result is `false`."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "`age >= 13 && age < 18`",
            "text_en": "`age >= 13 && age < 18`"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "`age >= 13 || age < 18`",
            "text_en": "`age >= 13 || age < 18`"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "`age + 13 && age - 18`",
            "text_en": "`age + 13 && age - 18`"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "`age < 13 && age >= 18`",
            "text_en": "`age < 13 && age >= 18`"
          }
        ],
        "correct_ar": "صحيح: كل مقارنة تفحص حدًا، و`&&` تتطلب تحقق الحدين معًا.",
        "correct_choice_id": "a",
        "correct_en": "Correct: each comparison checks one bound, and `&&` requires both bounds to be true.",
        "id": "quiz-logical",
        "incorrect_ar": "ليست هذه الإجابة؛ جرّب مرة أخرى. نحتاج المقارنتين معًا، لا إحداهما فقط، وبالاتجاهين الصحيحين.",
        "incorrect_en": "Not quite; try again. We need both comparisons, not just one, with the correct bounds.",
        "prompt_ar": "أي تعبير يتحقق من أن `age` على الأقل `13` وأقل من `18`؟",
        "prompt_en": "Which expression checks that `age` is at least `13` and less than `18`?",
        "review_ar": "استخدم `>= 13` لفحص الحد الأدنى و`< 18` لفحص الحد الأعلى، ثم اربطهما بـ `&&`.",
        "review_en": "Use `>= 13` for the lower bound and `< 18` for the upper bound, then join them with `&&`."
      }
    ],
    "sequence": 4,
    "starter_css": "",
    "starter_html": "",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "العملية الحسابية مثل `+` تحسب قيمة جديدة. مثال: `4 + 3` نتيجته `7`.",
        "body_en": "An arithmetic operator such as `+` calculates a new value. For example, `4 + 3` gives `7`.",
        "title_ar": "تعلّم",
        "title_en": "Learning"
      },
      {
        "body_ar": "المقارنة مثل `>=` تعطي `true` أو `false`. والعملية المنطقية `&&` تكون صحيحة عندما يكون الطرفان صحيحين.",
        "body_en": "A comparison such as `>=` gives `true` or `false`. The logical operator `&&` is true when both sides are true.",
        "title_ar": "افهم النتيجة",
        "title_en": "Understand the result"
      },
      {
        "body_ar": "اقرأ التعبير من اليسار إلى اليمين، واحسب القيم أولًا. ثم استخدم النتيجة المنطقية في تطبيقك.",
        "body_en": "Read the expression from left to right and calculate its values first. Then use the logical result in your own practice.",
        "title_ar": "تدرب",
        "title_en": "Practice"
      }
    ],
    "title_ar": "العمليات والتعبيرات",
    "title_en": "Operators and Expressions",
    "validation_rules": [
      {
            "id": "points-lower-bound",
            "type": "js-comparison",
            "note_ar": "اكتب مقارنة مستقلة: `points >= 5`.",
            "note_en": "Write the standalone comparison `points >= 5`.",
            "variable": "points",
            "operator": ">=",
            "value": 5
      },
      {
            "id": "points-upper-bound",
            "type": "js-comparison",
            "note_ar": "اكتب مقارنة مستقلة: `points < 10`.",
            "note_en": "Write the standalone comparison `points < 10`.",
            "variable": "points",
            "operator": "<",
            "value": 10
      },
      {
            "id": "points-combine",
            "type": "js-comparison",
            "note_ar": "اربط المقارنتين `points >= 5` و`points < 10` بتعبير واحد باستخدام `&&`.",
            "note_en": "Combine `points >= 5` and `points < 10` into one expression using `&&`.",
            "variable": "points",
            "operator": ">=",
            "value": 5,
            "combineWith": {
                  "logic": "&&",
                  "variable": "points",
                  "operator": "<",
                  "value": 10
            }
      }
    ]
  },
  "js-conditionals": {
    "code_explanation": [
      {
        "code": "const score = 75;",
        "why_ar": "يحفظ الدرجة في متغير اسمه score لنستخدمها في الشرط.",
        "why_en": "Stores the score in a variable named score so the condition can use it."
      },
      {
        "code": "if (score >= 60) {",
        "why_ar": "يفحص هل الدرجة 60 أو أكثر؛ المقارنة تعطي true أو false.",
        "why_en": "Checks whether the score is at least 60; the comparison gives true or false."
      },
      {
        "code": "  console.log(\"Pass\");",
        "why_ar": "هذه رسالة المسار الذي يعمل عندما يكون الشرط true. وconsole.log تعرض الرسالة.",
        "why_en": "This is the message for the branch that runs when the condition is true. console.log displays it."
      },
      {
        "code": "} else {",
        "why_ar": "يبدأ المسار البديل، ويعمل عندما يكون الشرط false.",
        "why_en": "Begins the alternative branch, which runs when the condition is false."
      },
      {
        "code": "  console.log(\"Try again\");",
        "why_ar": "تعرض رسالة المسار البديل إذا كانت الدرجة أقل من 60.",
        "why_en": "Displays the alternative message if the score is below 60."
      },
      {
        "code": "}",
        "why_ar": "يغلق كتلة else؛ الأقواس تحدد التعليمات التابعة للمسار.",
        "why_en": "Closes the else block; the braces mark the instructions in that branch."
      }
    ],
    "example_code": "const score = 75;\nif (score >= 60) {\n  console.log(\"Pass\");\n} else {\n  console.log(\"Try again\");\n}",
    "id": "js-conditionals",
    "objective_ar": "استخدم شرطًا منطقيًا مع if وelse لاختيار أحد مسارين.",
    "objective_en": "Use a boolean condition with if and else to choose between two branches.",
    "outcome_ar": "أستطيع قراءة شرط boolean وتحديد أي مسار من if/else سينفّذ.",
    "outcome_en": "I can read a boolean condition and tell which if/else branch will run.",
    "path_id": "javascript-fundamentals",
    "practice_ar": "١. عرّف `const temperature = 28`. ٢. اكتب شرط `if` يفحص `temperature < 25`. ٣. داخل فرع `if` اطبع `\"Cool\"`. ٤. داخل فرع `else` اطبع `\"Warm\"`.",
    "practice_en": "1. Declare `const temperature = 28`. 2. Write an `if` condition that checks `temperature < 25`. 3. In the `if` branch, log `\"Cool\"`. 4. In the `else` branch, log `\"Warm\"`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "عندما تكون نتيجة الشرط true",
            "text_en": "When the condition is true"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "عندما تكون نتيجة الشرط false",
            "text_en": "When the condition is false"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "في كل مرة، مع else أيضًا",
            "text_en": "Every time, along with else"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "فقط إذا كان الشرط نصًا",
            "text_en": "Only when the condition is text"
          }
        ],
        "correct_ar": "صحيح: يعمل مسار if عندما تكون نتيجة الشرط true.",
        "correct_choice_id": "a",
        "correct_en": "Correct: the if branch runs when the condition is true.",
        "id": "q1",
        "incorrect_ar": "ليست كل المسارات تعمل معًا؛ تحقّق أولًا هل الشرط true أم false، ثم أعد المحاولة.",
        "incorrect_en": "The branches do not all run together; first check whether the condition is true or false, then try again.",
        "prompt_ar": "متى تُنفّذ تعليمات if؟",
        "prompt_en": "When do the if instructions run?",
        "review_ar": "if تختار مسارها عند true؛ ويعمل else عند false.",
        "review_en": "if selects its branch for true; else runs for false."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "Pass",
            "text_en": "Pass"
          },
          {
            "id": "b",
            "is_correct": true,
            "text_ar": "حاول مجددًا",
            "text_en": "Try again"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "الرسالتان معًا / Both messages",
            "text_en": "Both messages"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "لا شيء / Nothing",
            "text_en": "Nothing"
          }
        ],
        "correct_ar": "صحيح: 55 >= 60 نتيجته false، لذا يعمل مسار else ويعرض Try again.",
        "correct_choice_id": "b",
        "correct_en": "Correct: 55 >= 60 is false, so the else branch runs and displays Try again.",
        "id": "q2",
        "incorrect_ar": "احسب نتيجة المقارنة: 55 ليست 60 أو أكثر. لذلك لا يعمل مسار if؛ أعد المحاولة.",
        "incorrect_en": "Evaluate the comparison: 55 is not at least 60. So the if branch does not run; try again.",
        "prompt_ar": "ما الرسالة التي يعرضها هذا الكود؟\nconst score = 55;\nif (score >= 60) { console.log(\"Pass\"); } else { console.log(\"Try again\"); }",
        "prompt_en": "Which message does this code display?\nconst score = 55;\nif (score >= 60) { console.log(\"Pass\"); } else { console.log(\"Try again\"); }",
        "review_ar": "يختار البرنامج مسارًا واحدًا: if عند true، وelse عند false.",
        "review_en": "The program chooses one branch: if for true and else for false."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "if (score >= 60) { console.log(\"Pass\"); } else { console.log(\"Try again\"); }",
            "text_en": "if (score >= 60) { console.log(\"Pass\"); } else { console.log(\"Try again\"); }"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "if (score < 60) { console.log(\"Pass\"); } else { console.log(\"Try again\"); }",
            "text_en": "if (score < 60) { console.log(\"Pass\"); } else { console.log(\"Try again\"); }"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "if (score >= 60) { console.log(\"Pass\"); }",
            "text_en": "if (score >= 60) { console.log(\"Pass\"); }"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "if (score) { console.log(\"Try again\"); } else { console.log(\"Pass\"); }",
            "text_en": "if (score) { console.log(\"Try again\"); } else { console.log(\"Pass\"); }"
          }
        ],
        "correct_ar": "صحيح: المقارنة >= 60 تختبر الحد المطلوب، وelse يوفّر الرسالة للحالة الأخرى.",
        "correct_choice_id": "a",
        "correct_en": "Correct: the >= 60 comparison checks the required threshold, and else provides the message for the other case.",
        "id": "q3",
        "incorrect_ar": "انتبه إلى اتجاه المقارنة، وإلى وجود مسار else للحالة الأخرى. أعد المحاولة واختر الكود الذي يحقق الشرطين.",
        "incorrect_en": "Check the comparison direction and whether there is an else branch for the other case. Try again and choose code that meets both requirements.",
        "prompt_ar": "أي خيار يختار رسالة \"Pass\" عندما تكون الدرجة 60 أو أكثر، ورسالة أخرى خلاف ذلك؟",
        "prompt_en": "Which option selects \"Pass\" when the score is at least 60, and another message otherwise?",
        "review_ar": "استخدم المقارنة المناسبة داخل if، ثم else للحالة التي لا يتحقق فيها الشرط.",
        "review_en": "Use the appropriate comparison in if, then else for the case where the condition is not met."
      }
    ],
    "sequence": 5,
    "starter_css": "",
    "starter_html": "",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "الشرط يجيب بنعم أو لا: true أو false. في JavaScript نضع هذا الشرط داخل أقواس if.",
        "body_en": "A condition answers yes or no: true or false. In JavaScript, we put it inside the parentheses of if.",
        "title_ar": "تعلّم: الشرط سؤال",
        "title_en": "Learning: A condition is a question"
      },
      {
        "body_ar": "إذا كان الشرط true، ينفّذ البرنامج تعليمات if. وإذا كان false، ينتقل إلى else. ينفّذ مسارًا واحدًا فقط.",
        "body_en": "If the condition is true, the program runs the if instructions. If it is false, it goes to else. Only one branch runs.",
        "title_ar": "افهم: اختر المسار",
        "title_en": "Understand: Choose a branch"
      },
      {
        "body_ar": "قارن القيمة بما بعدها، واسأل: هل النتيجة true أم false؟ توقّع أي مسار سيعمل قبل قراءة الرسالة.",
        "body_en": "Compare the value with the number after it and ask: is the result true or false? Predict which branch runs before reading its message.",
        "title_ar": "تدرّب: اقرأ الشرط أولًا",
        "title_en": "Practice: Read the condition first"
      }
    ],
    "title_ar": "اتخاذ القرار بالشروط",
    "title_en": "Making Decisions with Conditions",
    "validation_rules": [
      {
            "id": "temperature-constant",
            "note_ar": "عرّف `temperature` باستخدام `const` واجعل قيمته العدد `28`.",
            "note_en": "Declare `temperature` with `const` and set it to the number `28`.",
            "property": "const",
            "target": "temperature",
            "type": "js-declaration",
            "expectedType": "number",
            "expectedValue": 28
      },
      {
            "id": "temperature-if-condition",
            "type": "js-condition-branches",
            "variable": "temperature",
            "operator": "<",
            "threshold": 25,
            "ifMessage": "Cool",
            "elseMessage": "Warm",
            "note_ar": "اكتب شرط `if` يقارن `temperature < 25`.",
            "note_en": "Write an `if` condition that compares `temperature < 25`.",
            "branchCheck": "condition"
      },
      {
            "id": "temperature-if-message",
            "type": "js-condition-branches",
            "variable": "temperature",
            "operator": "<",
            "threshold": 25,
            "ifMessage": "Cool",
            "elseMessage": "Warm",
            "note_ar": "داخل فرع الشرط الصحيح (`if`)، استخدم `console.log(\"Cool\")`.",
            "note_en": "In the true (`if`) branch, use `console.log(\"Cool\")`.",
            "branchCheck": "if-message"
      },
      {
            "id": "temperature-else-message",
            "type": "js-condition-branches",
            "variable": "temperature",
            "operator": "<",
            "threshold": 25,
            "ifMessage": "Cool",
            "elseMessage": "Warm",
            "note_ar": "داخل فرع `else`، استخدم `console.log(\"Warm\")`.",
            "note_en": "In the `else` branch, use `console.log(\"Warm\")`.",
            "branchCheck": "else-message"
      }
    ]
  },
  "js-functions": {
    "code_explanation": [
      {
        "code": "function addNumbers(first, second) {",
        "why_ar": "يعرّف دالة اسمها `addNumbers`؛ و`first` و`second` معاملان يستقبلان القيم.",
        "why_en": "Declares a function named `addNumbers`; `first` and `second` are parameters that receive values."
      },
      {
        "code": "  const total = first + second;",
        "why_ar": "يجمع القيمتين ويخزّن الناتج في `total`.",
        "why_en": "Adds the two values and stores the result in `total`."
      },
      {
        "code": "  return total;",
        "why_ar": "يعيد قيمة `total` إلى المكان الذي استدعى الدالة.",
        "why_en": "Returns `total` to the place that called the function."
      },
      {
        "code": "}",
        "why_ar": "ينهي جسم الدالة؛ لا تُنفّذ تعليماتها لمجرد تعريفها.",
        "why_en": "Ends the function body; its instructions do not run just because it was declared."
      },
      {
        "code": "const answer = addNumbers(2, 3);",
        "why_ar": "يستدعي الدالة ويرسل `2` و`3` كوسيطتين، ثم يحفظ القيمة المعادة في `answer`.",
        "why_en": "Calls the function with `2` and `3` as arguments, then stores the returned value in `answer`."
      }
    ],
    "example_code": "function addNumbers(first, second) {\n  const total = first + second;\n  return total;\n}\nconst answer = addNumbers(2, 3);",
    "id": "js-functions",
    "objective_ar": "تعرّف كيف تعرّف دالة، وتمرّر إليها القيم، وتعيد منها نتيجة.",
    "objective_en": "Learn to declare a function, pass values to it, and return a result.",
    "outcome_ar": "أصبحت تميّز تعريف الدالة ومعاملاتها ووسيطاتها، وتفهم كيف تعيد `return` نتيجة.",
    "outcome_en": "You can identify a function declaration, its parameters and arguments, and how `return` gives back a result.",
    "path_id": "javascript-fundamentals",
    "practice_ar": "١. عرّف دالة باسم `doubleNumber` وبمعامل اسمه `number`. ٢. أعد من الدالة التعبير `number * 2`. ٣. استدعِ `doubleNumber` مع العدد `4`.",
    "practice_en": "1. Declare a function named `doubleNumber` with a parameter named `number`. 2. Return the expression `number * 2` from the function. 3. Call `doubleNumber` with the number `4`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "arguments",
            "is_correct": true,
            "text_ar": "وسيطات (arguments)",
            "text_en": "Arguments"
          },
          {
            "id": "parameters",
            "is_correct": false,
            "text_ar": "معاملات (parameters)",
            "text_en": "Parameters"
          },
          {
            "id": "function-name",
            "is_correct": false,
            "text_ar": "اسم الدالة",
            "text_en": "The function name"
          },
          {
            "id": "return-value",
            "is_correct": false,
            "text_ar": "القيمة المعادة",
            "text_en": "The return value"
          }
        ],
        "correct_ar": "صحيح: `2` و`3` قيم فعلية مرّرها الاستدعاء، لذا فهما وسيطتان.",
        "correct_choice_id": "arguments",
        "correct_en": "Correct: `2` and `3` are the actual values passed in the call, so they are arguments.",
        "id": "function-parts",
        "incorrect_ar": "ليستا معاملتين؛ المعاملات أسماء مثل `first` و`second` في تعريف الدالة. جرّب مرة أخرى.",
        "incorrect_en": "They are not parameters; parameters are names such as `first` and `second` in the function declaration. Try again.",
        "prompt_ar": "في `addNumbers(2, 3)`، ما اسم القيمتين `2` و`3`؟",
        "prompt_en": "In `addNumbers(2, 3)`, what are the values `2` and `3` called?",
        "review_ar": "تذكّر: أسماء المدخلات في التعريف معاملات، والقيم المرسلة عند الاستدعاء وسيطات.",
        "review_en": "Remember: input names in a declaration are parameters; values passed in a call are arguments."
      },
      {
        "choices": [
          {
            "id": "five",
            "is_correct": true,
            "text_ar": "`5`",
            "text_en": "`5`"
          },
          {
            "id": "twenty-three",
            "is_correct": false,
            "text_ar": "`23`",
            "text_en": "`23`"
          },
          {
            "id": "undefined",
            "is_correct": false,
            "text_ar": "لا توجد قيمة معادة",
            "text_en": "No value is returned"
          },
          {
            "id": "function-name",
            "is_correct": false,
            "text_ar": "`addNumbers` كنص",
            "text_en": "The text `addNumbers`"
          }
        ],
        "correct_ar": "صحيح: تجمع الدالة `2 + 3`، ثم تعيد `5` إلى `answer`.",
        "correct_choice_id": "five",
        "correct_en": "Correct: the function adds `2 + 3`, then returns `5` to `answer`.",
        "id": "read-returned-result",
        "incorrect_ar": "راجع السطر داخل الدالة: `return total` يعيد ناتج الجمع، لا وصل القيم كنص ولا اسم الدالة. حاول مجددًا.",
        "incorrect_en": "Check the function body: `return total` returns the sum, not joined text or the function name. Try again.",
        "prompt_ar": "وفق المثال، ما قيمة `answer` بعد تنفيذ `addNumbers(2, 3)`؟",
        "prompt_en": "In the example, what is the value of `answer` after `addNumbers(2, 3)`?",
        "review_ar": "القيمة التي تتبع `return` هي ما يصل إلى استدعاء الدالة.",
        "review_en": "The value after `return` is what the function call receives."
      },
      {
        "choices": [
          {
            "id": "return-sum",
            "is_correct": true,
            "text_ar": "`function addNumbers(a, b) { return a + b; }`",
            "text_en": "`function addNumbers(a, b) { return a + b; }`"
          },
          {
            "id": "no-return",
            "is_correct": false,
            "text_ar": "`function addNumbers(a, b) { a + b; }`",
            "text_en": "`function addNumbers(a, b) { a + b; }`"
          },
          {
            "id": "return-first",
            "is_correct": false,
            "text_ar": "`function addNumbers(a, b) { return a; b; }`",
            "text_en": "`function addNumbers(a, b) { return a; b; }`"
          },
          {
            "id": "missing-function-keyword",
            "is_correct": false,
            "text_ar": "`addNumbers(a, b) { return a + b; }`",
            "text_en": "`addNumbers(a, b) { return a + b; }`"
          }
        ],
        "correct_ar": "صحيح: `return a + b` يعيد ناتج الجمع. يجب أن يتبع التعريف صيغة `function` ثم الاسم والمعاملات.",
        "correct_choice_id": "return-sum",
        "correct_en": "Correct: `return a + b` gives back the sum. A declaration uses `function`, then the name and parameters.",
        "id": "choose-return-function",
        "incorrect_ar": "التعبير الحسابي وحده لا يعيد النتيجة، و`return a` يعيد قيمة واحدة فقط. اختر التعريف الذي يستخدم `return a + b`.",
        "incorrect_en": "A math expression alone does not return its result, and `return a` returns only one value. Choose the declaration with `return a + b`.",
        "prompt_ar": "أي تعريف يعيد فعلًا مجموع القيمتين عند استدعائه؟",
        "prompt_en": "Which declaration actually returns the sum when called?",
        "review_ar": "لإرسال ناتج من الدالة، اكتب `return` متبوعًا بالتعبير المطلوب.",
        "review_en": "To send a result back from a function, write `return` followed by the desired expression."
      }
    ],
    "sequence": 6,
    "starter_css": "",
    "starter_html": "",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "الدالة مجموعة تعليمات باسم. نكتب `function` ثم اسم الدالة، وتعمل تعليماتها عند استدعائها.",
        "body_en": "A function is a named group of instructions. Write `function` and a name; its instructions run when you call it.",
        "title_ar": "التعلّم",
        "title_en": "Learn"
      },
      {
        "body_ar": "المعاملات مثل `first` و`second` أسماء للمدخلات. عند الاستدعاء، تكون `2` و`3` هي الوسيطات المرسلة. تعيد `return` النتيجة إلى مكان الاستدعاء.",
        "body_en": "Parameters such as `first` and `second` name the inputs. In a call, `2` and `3` are the arguments passed in. `return` sends the result back to the call.",
        "title_ar": "افهم",
        "title_en": "Understand"
      },
      {
        "body_ar": "اقرأ المثال سطرًا سطرًا: التعريف يجهّز الدالة، والاستدعاء يمرّر القيم، و`return` يعيد الناتج.",
        "body_en": "Read the example line by line: the declaration defines the function, the call passes values, and `return` gives back the result.",
        "title_ar": "تدرّب",
        "title_en": "Practice"
      }
    ],
    "title_ar": "الدوال",
    "title_en": "Functions",
    "validation_rules": [
      {
            "id": "double-number-function",
            "type": "js-function",
            "target": "doubleNumber",
            "note_ar": "عرّف `doubleNumber` كدالة وبداخل توقيعها معامل اسمه `number`.",
            "note_en": "Declare `doubleNumber` as a function whose signature includes a parameter named `number`.",
            "parameter": "number"
      },
      {
            "id": "double-number-multiply",
            "type": "js-function-behavior",
            "note_ar": "داخل جسم `doubleNumber`، أعد `number * 2` باستخدام `return`.",
            "note_en": "Inside `doubleNumber`, return `number * 2` using `return`.",
            "functionName": "doubleNumber",
            "parameter": "number",
            "operator": "*",
            "operand": 2
      },
      {
            "id": "double-number-call",
            "note_ar": "استدعِ `doubleNumber` مع وسيط عددي قيمته `4`.",
            "note_en": "Call `doubleNumber` with the numeric argument `4`.",
            "target": "doubleNumber",
            "type": "js-call",
            "argument": 4,
            "argumentIndex": 0
      }
    ]
  },
  "js-arrays": {
    "code_explanation": [
      {
        "code": "const fruits = ['apple', 'banana', 'cherry'];",
        "why_ar": "ينشئ `fruits` ويضع فيه ثلاث قيم داخل array literal بين أقواس مربعة.",
        "why_en": "Creates `fruits` and stores three values in an array literal inside square brackets."
      },
      {
        "code": "console.log(fruits[0]);",
        "why_ar": "يقرأ العنصر عند index `0`، أي أول عنصر، ثم يعرضه.",
        "why_en": "Reads the item at index `0`—the first item—and displays it."
      },
      {
        "code": "console.log(fruits[1]);",
        "why_ar": "يقرأ العنصر الثاني؛ يبدأ العد من صفر، لذلك موقع الثاني هو `1`.",
        "why_en": "Reads the second item; counting starts at zero, so the second item’s index is `1`."
      },
      {
        "code": "console.log(fruits.length);",
        "why_ar": "يعرض عدد عناصر القائمة، وهو `3` هنا.",
        "why_en": "Displays the number of items in the list, which is `3` here."
      }
    ],
    "example_code": "const fruits = ['apple', 'banana', 'cherry'];\nconsole.log(fruits[0]);\nconsole.log(fruits[1]);\nconsole.log(fruits.length);",
    "id": "js-arrays",
    "objective_ar": "أنشئ array واقرأ عنصرًا باستخدام index يبدأ من صفر أو باستخدام length.",
    "objective_en": "Create an array and read an item using a zero-based index or length.",
    "outcome_ar": "أصبحت قادرًا على إنشاء array، وقراءة عنصر بموقع يبدأ من صفر، ومعرفة عدد العناصر باستخدام `length`.",
    "outcome_en": "You can create an array, read an item using a zero-based position, and find the item count with `length`.",
    "path_id": "javascript-fundamentals",
    "practice_ar": "١. عرّف `colors` باستخدام `const`. ٢. اجعل قيمتها مصفوفة من ثلاثة نصوص، وكل نص لون CSS صالح (مثل `navy` أو `#123456`). ٣. اطبع العنصر ذي الفهرس `1` باستخدام `console.log`.",
    "practice_en": "1. Declare `colors` with `const`. 2. Make it an array of three strings, each a valid CSS color (for example, `navy` or `#123456`). 3. Log the item at index `1` with `console.log`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "`0`",
            "text_en": "`0`"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "`1`",
            "text_en": "`1`"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "`-1`",
            "text_en": "`-1`"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "يساوي عدد العناصر دائمًا",
            "text_en": "It is always the item count"
          }
        ],
        "correct_ar": "صحيح: يبدأ index من `0`، لذا أول عنصر موقعه `0`.",
        "correct_choice_id": "a",
        "correct_en": "Correct: indexes start at `0`, so the first item is at `0`.",
        "id": "index-start",
        "incorrect_ar": "ليس تمامًا. تذكّر أن العد في array يبدأ من `0`؛ جرّب مرة أخرى.",
        "incorrect_en": "Not quite. Remember that array counting starts at `0`; try again.",
        "prompt_ar": "ما هو index أول عنصر في array؟",
        "prompt_en": "What is the index of the first item in an array?",
        "review_ar": "راجع فكرة index الصفري: الأول `0` والثاني `1`.",
        "review_en": "Review zero-based indexing: first is `0`, second is `1`."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "العنصر الأول",
            "text_en": "The first item"
          },
          {
            "id": "b",
            "is_correct": true,
            "text_ar": "العنصر الثاني",
            "text_en": "The second item"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "العنصر الثالث",
            "text_en": "The third item"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "عدد العناصر",
            "text_en": "The number of items"
          }
        ],
        "correct_ar": "صحيح: لأن index يبدأ من صفر، فإن `1` يشير إلى العنصر الثاني.",
        "correct_choice_id": "b",
        "correct_en": "Correct: because the index starts at zero, `1` points to the second item.",
        "id": "read-second",
        "incorrect_ar": "ليست هذه الإجابة. `fruits[1]` يقرأ العنصر عند الموقع `1`؛ جرّب ثانية.",
        "incorrect_en": "That is not the answer. `fruits[1]` reads the item at position `1`; try again.",
        "prompt_ar": "ما الذي تقرؤه `fruits[1]`؟",
        "prompt_en": "What does `fruits[1]` read?",
        "review_ar": "راجع مثال قراءة العنصر الثاني باستخدام `fruits[1]`.",
        "review_en": "Review the example that reads the second item with `fruits[1]`."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": false,
            "text_ar": "`0`",
            "text_en": "`0`"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "`2`",
            "text_en": "`2`"
          },
          {
            "id": "c",
            "is_correct": true,
            "text_ar": "`3`",
            "text_en": "`3`"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "`9`",
            "text_en": "`9`"
          }
        ],
        "correct_ar": "صحيح: `length` يعطي عدد العناصر؛ في القائمة ثلاثة عناصر.",
        "correct_choice_id": "c",
        "correct_en": "Correct: `length` gives the number of items; this list has three.",
        "id": "length-count",
        "incorrect_ar": "ليس تمامًا. `length` هو عدد العناصر، وليس index آخر عنصر أو قيمته. حاول مجددًا.",
        "incorrect_en": "Not quite. `length` is the item count, not the last index or its value. Try again.",
        "prompt_ar": "إذا احتوت `nums` على `[4, 7, 9]`، فما قيمة `nums.length`؟",
        "prompt_en": "If `nums` contains `[4, 7, 9]`, what is `nums.length`?",
        "review_ar": "راجع الفرق: `length` عدد العناصر، أما index آخر عنصر هنا فهو `2`.",
        "review_en": "Review the difference: `length` is the item count; the last index here is `2`."
      }
    ],
    "sequence": 7,
    "starter_css": "",
    "starter_html": "",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "تجمع `array` عدة قيم في قائمة واحدة. اكتب القيم بين `[` و`]` وافصل بينها بفواصل، مثل `const fruits = ['apple', 'banana'];`.",
        "body_en": "An `array` groups several values in one list. Write values between `[` and `]`, separated by commas, like `const fruits = ['apple', 'banana'];`.",
        "title_ar": "أنشئ قائمة",
        "title_en": "Make a list"
      },
      {
        "body_ar": "يبدأ `index` من `0`: أول عنصر موقعه `0`، والثاني `1`. اقرأ عنصرًا بكتابة اسم القائمة ثم `[index]`، مثل `fruits[0]`. ويعطي `fruits.length` عدد العناصر.",
        "body_en": "An `index` starts at `0`: the first item is at `0`, the second at `1`. Read an item by writing the array name followed by `[index]`, like `fruits[0]`. `fruits.length` gives the item count.",
        "title_ar": "اقرأ المواقع",
        "title_en": "Read positions"
      },
      {
        "body_ar": "تأمل المثال، ثم أنشئ قائمة ألوان واقرأ عنصرًا منها. تذكّر: أول موقع هو `0`، و`length` هو عدد العناصر لا موقع آخر عنصر.",
        "body_en": "Study the example, then make a color list and read one item. Remember: the first position is `0`, and `length` is the number of items, not the last item’s position.",
        "title_ar": "جرّب بنفسك",
        "title_en": "Try it yourself"
      }
    ],
    "title_ar": "القوائم باستخدام Arrays",
    "title_en": "Lists with Arrays",
    "validation_rules": [
      {
            "id": "colors-const",
            "note_ar": "عرّف المتغير `colors` باستخدام `const`.",
            "note_en": "Declare the `colors` variable with `const`.",
            "property": "const",
            "target": "colors",
            "type": "js-declaration"
      },
      {
            "id": "colors-array",
            "note_ar": "اجعل `colors` مصفوفة من ثلاثة نصوص، وكل نص اسم لون CSS صالح أو قيمة hex صالحة.",
            "note_en": "Make `colors` an array of three strings, each a valid CSS color name or hex value.",
            "target": "colors",
            "type": "js-array",
            "itemCount": 3,
            "stringItems": true,
            "cssColorItems": true
      },
      {
            "id": "show-item",
            "type": "js-array-access",
            "note_ar": "اطبع `colors[1]` تحديدًا باستخدام `console.log`.",
            "note_en": "Log exactly `colors[1]` with `console.log`.",
            "arrayName": "colors",
            "index": 1,
            "logger": "console.log"
      }
    ]
  },
  "js-dom-basics": {
    "code_explanation": [
      {
        "code": "const message = document.querySelector(\"#message\");",
        "why_ar": "يبحث عن عنصر id الخاص به message ويحفظ النتيجة في message.",
        "why_en": "Finds the element with id message and stores the result in message."
      },
      {
        "code": "if (message) {",
        "why_ar": "يتابع التحديث فقط إذا عُثر على العنصر؛ وإن لم يُعثر عليه، يتجنب محاولة تغيير null.",
        "why_en": "Continues only if the element was found; otherwise it avoids trying to change null."
      },
      {
        "code": "  message.textContent = \"Hello!\";",
        "why_ar": "يستبدل النص الظاهر داخل العنصر بنص عادي.",
        "why_en": "Replaces the text inside the element with plain text."
      },
      {
        "code": "}",
        "why_ar": "ينهي كتلة التحقق if.",
        "why_en": "Closes the if-check block."
      }
    ],
    "example_code": "const message = document.querySelector(\"#message\");\nif (message) {\n  message.textContent = \"Hello!\";\n}",
    "id": "js-dom-basics",
    "objective_ar": "استخدم document.querySelector لاختيار عنصر موجود، ثم حدّث نصه بأمان باستخدام textContent.",
    "objective_en": "Use document.querySelector to select an existing element, then safely update its text with textContent.",
    "outcome_ar": "أصبحت قادرًا على اختيار عنصر موجود وفحصه قبل تغيير نصه بأمان.",
    "outcome_en": "You can select an existing element, check it, and safely update its text.",
    "path_id": "javascript-fundamentals",
    "practice_ar": "١. اختر العنصر `#status` الموجود في HTML باستخدام `document.querySelector`. ٢. استخدم شرط `if (status)` للتحقق من وجوده. ٣. داخل هذا الشرط، أسند النص `\"Ready!\"` إلى `status.textContent`.",
    "practice_en": "1. Select the existing `#status` element in the HTML with `document.querySelector`. 2. Use an `if (status)` condition to check that it exists. 3. Inside that condition, assign `\"Ready!\"` to `status.textContent`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "first-match",
            "is_correct": true,
            "text_ar": "أول عنصر يطابق المحدد، أو null إن لم يوجد.",
            "text_en": "The first matching element, or null if none is found."
          },
          {
            "id": "all-matches",
            "is_correct": false,
            "text_ar": "قائمة بكل العناصر المطابقة دائمًا.",
            "text_en": "A list of all matching elements every time."
          },
          {
            "id": "text-value",
            "is_correct": false,
            "text_ar": "نص العنصر المطابق فقط.",
            "text_en": "Only the text of the matching element."
          },
          {
            "id": "new-element",
            "is_correct": false,
            "text_ar": "عنصر جديد يُضاف تلقائيًا للصفحة.",
            "text_en": "A new element automatically added to the page."
          }
        ],
        "correct_ar": "صحيح: querySelector يعيد أول عنصر مطابق، أو null إذا لم يجد تطابقًا.",
        "correct_choice_id": "first-match",
        "correct_en": "Correct: querySelector returns the first matching element, or null if there is no match.",
        "id": "query-selector-result",
        "incorrect_ar": "ليس قائمةً ولا نصًا ولا عنصرًا جديدًا؛ ابحث عن أول عنصر مطابق، وتذكّر احتمال null.",
        "incorrect_en": "It is not a list, text, or a new element: it finds the first match, and may return null.",
        "prompt_ar": "ما نتيجة document.querySelector(\"#message\")؟",
        "prompt_en": "What does document.querySelector(\"#message\") return?",
        "review_ar": "مراجعة: document.querySelector يبحث عن عنصر موجود باستخدام محدد.",
        "review_en": "Review: document.querySelector searches for an existing element using a selector."
      },
      {
        "choices": [
          {
            "id": "check-found",
            "is_correct": true,
            "text_ar": "لأن البحث قد لا يجد عنصرًا، فيمنع الفحص محاولة تحديث null.",
            "text_en": "The search may find no element, so the check avoids trying to update null."
          },
          {
            "id": "query-always-finds",
            "is_correct": false,
            "text_ar": "لأن if تجعل querySelector يعثر دائمًا على عنصر.",
            "text_en": "Because if makes querySelector always find an element."
          },
          {
            "id": "textcontent-needs-array",
            "is_correct": false,
            "text_ar": "لأن textContent لا يعمل إلا مع قائمة عناصر.",
            "text_en": "Because textContent works only with a list of elements."
          },
          {
            "id": "create-if-missing",
            "is_correct": false,
            "text_ar": "لأن if تنشئ العنصر تلقائيًا إذا لم يكن موجودًا.",
            "text_en": "Because if automatically creates the element if it is missing."
          }
        ],
        "correct_ar": "صحيح: نتيجة البحث قد تكون null، والتحقق يمنع تحديث عنصر غير موجود.",
        "correct_choice_id": "check-found",
        "correct_en": "Correct: the search result may be null, and the check prevents updating a missing element.",
        "id": "safe-update-reason",
        "incorrect_ar": "if لا تنشئ عنصرًا ولا تغيّر نتيجة البحث؛ دورها هنا التحقق من وجود العنصر قبل استخدامه.",
        "incorrect_en": "if does not create an element or change the search result; here it checks that the element exists before use.",
        "prompt_ar": "في المثال، لماذا نضع تحديث textContent داخل if (message)؟",
        "prompt_en": "In the example, why do we put the textContent update inside if (message)?",
        "review_ar": "مراجعة: افحص نتيجة الاختيار قبل الوصول إلى خاصية العنصر.",
        "review_en": "Review: check the selection result before accessing an element property."
      },
      {
        "choices": [
          {
            "id": "safe-correct",
            "is_correct": true,
            "text_ar": "const status = document.querySelector(\"#status\"); if (status) { status.textContent = \"Ready!\"; }",
            "text_en": "const status = document.querySelector(\"#status\"); if (status) { status.textContent = \"Ready!\"; }"
          },
          {
            "id": "missing-hash",
            "is_correct": false,
            "text_ar": "const status = document.querySelector(\"status\"); status.textContent = \"Ready!\";",
            "text_en": "const status = document.querySelector(\"status\"); status.textContent = \"Ready!\";"
          },
          {
            "id": "missing-check",
            "is_correct": false,
            "text_ar": "const status = document.querySelector(\"#status\"); status.textContent = \"Ready!\";",
            "text_en": "const status = document.querySelector(\"#status\"); status.textContent = \"Ready!\";"
          },
          {
            "id": "wrong-property",
            "is_correct": false,
            "text_ar": "const status = document.querySelector(\"#status\"); if (status) { status = \"Ready!\"; }",
            "text_en": "const status = document.querySelector(\"#status\"); if (status) { status = \"Ready!\"; }"
          }
        ],
        "correct_ar": "صحيح: #status يختار id المطلوب، وif يتحقق من وجود العنصر، ثم يحدّث textContent.",
        "correct_choice_id": "safe-correct",
        "correct_en": "Correct: #status selects the requested id, if checks that the element exists, and textContent updates its text.",
        "id": "choose-update-code",
        "incorrect_ar": "انتبه: محدد id يحتاج #، ويجب فحص وجود العنصر، كما أن التحديث يكون عبر textContent.",
        "incorrect_en": "Check the details: an id selector needs #, the element should be checked for existence, and its text is updated through textContent.",
        "prompt_ar": "أي مقطع يختار العنصر ذي id هو status ويحدّثه بأمان؟",
        "prompt_en": "Which snippet selects the element with id status and updates it safely?",
        "review_ar": "مراجعة: اختر العنصر المحدد، افحص النتيجة، ثم أسند النص إلى textContent.",
        "review_en": "Review: select the target element, check the result, then assign its text through textContent."
      }
    ],
    "sequence": 8,
    "starter_css": "",
    "starter_html": "<p id=\"status\">Waiting...</p>",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "اكتب document.querySelector(\"#message\") للبحث عن أول عنصر يحمل id يساوي message. الرمز # يعني أن المحدد يبحث عن id.",
        "body_en": "Write document.querySelector(\"#message\") to find the first element whose id is message. The # means the selector is looking for an id.",
        "title_ar": "تعلّم الاختيار",
        "title_en": "Select an element"
      },
      {
        "body_ar": "قد لا يجد البحث عنصرًا، لذلك قد تكون النتيجة null. افحص وجود العنصر بـ if (message) قبل تغييره؛ ثم استخدم message.textContent لتغيير النص العادي.",
        "body_en": "The search may find no element, so its result can be null. Check that the element exists with if (message) before changing it; then use message.textContent to update its plain text.",
        "title_ar": "افهم التحديث الآمن",
        "title_en": "Update it safely"
      },
      {
        "body_ar": "اتبع الأسطر بالترتيب: اختر العنصر، تأكد من وجوده، ثم غيّر نصه. textContent يضع نصًا ولا يفسّره كـ HTML.",
        "body_en": "Follow the lines in order: select the element, make sure it exists, then change its text. textContent sets text; it does not interpret it as HTML.",
        "title_ar": "اقرأ المثال",
        "title_en": "Read the example"
      }
    ],
    "title_ar": "التعامل مع عناصر الصفحة",
    "title_en": "Working with Page Elements",
    "validation_rules": [
      {
            "id": "select-status",
            "note_ar": "استخدم `document.querySelector(\"#status\")` لإسناد عنصر HTML الموجود إلى `status`.",
            "note_en": "Use `document.querySelector(\"#status\")` to bind the existing HTML element to `status`.",
            "type": "js-selector-binding",
            "variable": "status",
            "selector": "#status"
      },
      {
            "id": "guard-selection",
            "type": "js-guard",
            "note_ar": "اكتب شرطًا مباشرًا `if (status)` للتحقق من وجود العنصر.",
            "note_en": "Write a direct `if (status)` condition to check that the element exists.",
            "variable": "status"
      },
      {
            "id": "update-status-text",
            "type": "js-property-assignment",
            "target": "status.textContent",
            "note_ar": "داخل شرط `if (status)`، أسند النص الحرفي `\"Ready!\"` إلى `status.textContent`.",
            "note_en": "Inside `if (status)`, assign the string literal `\"Ready!\"` to `status.textContent`.",
            "value": "Ready!",
            "withinGuardVariable": "status"
      }
    ]
  },
  "js-events": {
    "code_explanation": [
      {
        "code": "const button = document.querySelector(\"#messageButton\");",
        "why_ar": "يبحث عن العنصر ذي id المحدد ويحفظه في متغير اسمه button.",
        "why_en": "Finds the element with that id and stores it in a variable named button."
      },
      {
        "code": "button.addEventListener(\"click\", () => {",
        "why_ar": "يسجّل مستمعًا لحدث click؛ والدالة السهمية هنا هي callback التي ستعمل عند النقرة.",
        "why_en": "Registers a listener for click; the arrow function is the callback that will run on the click."
      },
      {
        "code": "  button.textContent = \"Hello!\";",
        "why_ar": "يغيّر النص المرئي داخل الزر إلى Hello!.",
        "why_en": "Changes the visible text inside the button to Hello!."
      },
      {
        "code": "});",
        "why_ar": "يغلق callback واستدعاء addEventListener.",
        "why_en": "Closes the callback and the addEventListener call."
      }
    ],
    "example_code": "const button = document.querySelector(\"#messageButton\");\nbutton.addEventListener(\"click\", () => {\n  button.textContent = \"Hello!\";\n});",
    "id": "js-events",
    "objective_ar": "استخدم addEventListener للاستجابة لنقرة وتغيير نص زر ظاهر.",
    "objective_en": "Use addEventListener to respond to a click and change a visible button’s text.",
    "outcome_ar": "أصبحت قادرًا على ربط نقرة بزر وتغيير النص الذي يراه المستخدم.",
    "outcome_en": "You can now connect a button click to a change in the text users see.",
    "path_id": "javascript-fundamentals",
    "practice_ar": "١. اختر الزر الموجود في HTML بالمحدد `#messageButton`. ٢. استدعِ `button.addEventListener` مع callback. ٣. مرّر النص `click` كوسيط الحدث الأول. ٤. داخل callback، غيّر `button.textContent` إلى `\"Done!\"`.",
    "practice_en": "1. Select the existing HTML button with `#messageButton`. 2. Call `button.addEventListener` with a callback. 3. Pass `click` as the first event argument. 4. Inside the callback, set `button.textContent` to `\"Done!\"`.",
    "quiz": [
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "يربط حدثًا بدالة تعمل عند وقوعه.",
            "text_en": "Connects an event to a function that runs when it happens."
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "ينشئ زرًا جديدًا في HTML.",
            "text_en": "Creates a new button in HTML."
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "يشغّل الدالة مرارًا دون حدث.",
            "text_en": "Runs a function repeatedly without an event."
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "يغيّر لون الصفحة تلقائيًا.",
            "text_en": "Automatically changes the page color."
          }
        ],
        "correct_ar": "صحيح: يربط addEventListener حدثًا مثل click بدالة callback لتعمل عند وقوع الحدث.",
        "correct_choice_id": "a",
        "correct_en": "Correct: addEventListener connects an event such as click to a callback function that runs when it occurs.",
        "id": "events-purpose",
        "incorrect_ar": "ليس صحيحًا بعد. addEventListener لا ينشئ عناصر ولا يكرر الدالة من تلقاء نفسه؛ إنه يربط حدثًا بدالة.",
        "incorrect_en": "Not quite. addEventListener does not create elements or repeat a function by itself; it connects an event to a function.",
        "prompt_ar": "ما الذي يفعله addEventListener؟",
        "prompt_en": "What does addEventListener do?",
        "review_ar": "راجع: الحدث click، ومستمع الحدث، ودور callback.",
        "review_en": "Review: the click event, the event listener, and the callback’s role."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "عندما ينقر المستخدم الزر.",
            "text_en": "When the user clicks the button."
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "قبل تحميل الصفحة دائمًا.",
            "text_en": "Always before the page loads."
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "عندما يمر المؤشر فوق الزر.",
            "text_en": "When the pointer moves over the button."
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "لا يتغير النص؛ السطر يحدد لون الزر.",
            "text_en": "The text does not change; the line sets the button color."
          }
        ],
        "correct_ar": "صحيح: اسم الحدث هو click، لذا تعمل callback عند النقر وتغيّر textContent.",
        "correct_choice_id": "a",
        "correct_en": "Correct: the event name is click, so the callback runs on a click and changes textContent.",
        "id": "callback-timing",
        "incorrect_ar": "تذكّر أن callback تنتظر الحدث المذكور في addEventListener. هنا الحدث هو click، وليس مرور المؤشر.",
        "incorrect_en": "Remember that the callback waits for the event named in addEventListener. Here the event is click, not pointer movement.",
        "prompt_ar": "متى يتغير النص في هذا المثال؟\nbutton.addEventListener(\"click\", () => { button.textContent = \"Hello!\"; });",
        "prompt_en": "When does the text change in this example?\nbutton.addEventListener(\"click\", () => { button.textContent = \"Hello!\"; });",
        "review_ar": "راجع كيف يحدد النص الحرفي click وقت تشغيل callback.",
        "review_en": "Review how the literal click determines when the callback runs."
      },
      {
        "choices": [
          {
            "id": "a",
            "is_correct": true,
            "text_ar": "button.addEventListener(\"click\", () => { });",
            "text_en": "button.addEventListener(\"click\", () => { });"
          },
          {
            "id": "b",
            "is_correct": false,
            "text_ar": "button.addEventListener(\"click\");",
            "text_en": "button.addEventListener(\"click\");"
          },
          {
            "id": "c",
            "is_correct": false,
            "text_ar": "button.textContent(\"click\", () => { });",
            "text_en": "button.textContent(\"click\", () => { });"
          },
          {
            "id": "d",
            "is_correct": false,
            "text_ar": "button.addEventListener(() => { }, \"click\");",
            "text_en": "button.addEventListener(() => { }, \"click\");"
          }
        ],
        "correct_ar": "صحيح: تمرّر اسم الحدث أولًا، ثم callback التي ستعمل عند وقوعه.",
        "correct_choice_id": "a",
        "correct_en": "Correct: it passes the event name first, then the callback that will run when it occurs.",
        "id": "select-listener",
        "incorrect_ar": "تحقق من ترتيب الوسيطين: اسم الحدث مثل click أولًا، ثم دالة callback. كما يجب استخدام addEventListener.",
        "incorrect_en": "Check the argument order: the event name such as click comes first, then the callback function. Also, use addEventListener.",
        "prompt_ar": "أي سطر يسجّل callback لحدث النقر على button؟",
        "prompt_en": "Which line registers a callback for a click on button?",
        "review_ar": "راجع صيغة addEventListener: اسم الحدث ثم callback.",
        "review_en": "Review the addEventListener form: event name, then callback."
      }
    ],
    "sequence": 9,
    "starter_css": "",
    "starter_html": "<button id=\"messageButton\">Click me</button>",
    "starter_js": "",
    "steps": [
      {
        "body_ar": "الحدث هو شيء يحدث في الصفحة. هنا نستخدم حدث click: ينفّذ المتصفح سلوكًا عندما ينقر الشخص الزر.",
        "body_en": "An event is something that happens on a page. Here we use the click event: the browser responds when a person clicks the button.",
        "title_ar": "التعلّم",
        "title_en": "Learning"
      },
      {
        "body_ar": "تربط addEventListener الحدث بدالة. هذه الدالة تُسمّى callback: تنتظر، ثم تعمل عند حدوث النقرة.",
        "body_en": "addEventListener connects an event to a function. This function is called a callback: it waits, then runs when the click happens.",
        "title_ar": "افهم",
        "title_en": "Understand"
      },
      {
        "body_ar": "يعثر document.querySelector على الزر باستخدام id. داخل callback، يغيّر textContent النص الذي يظهر على الزر.",
        "body_en": "document.querySelector finds the button by its id. Inside the callback, textContent changes the text shown on the button.",
        "title_ar": "تدرّب",
        "title_en": "Practice"
      }
    ],
    "title_ar": "التفاعل مع الأحداث",
    "title_en": "Interacting with Events",
    "validation_rules": [
      {
            "id": "select-message-button",
            "type": "js-selector-binding",
            "variable": "button",
            "selector": "#messageButton",
            "expectedTag": "button",
            "note_ar": "استخدم `document.querySelector(\"#messageButton\")` لإسناد الزر الموجود إلى `button`.",
            "note_en": "Use `document.querySelector(\"#messageButton\")` to bind the existing button to `button`."
      },
      {
            "id": "register-click-handler",
            "type": "js-call",
            "target": "button.addEventListener",
            "note_ar": "سجّل استدعاء `button.addEventListener` مع callback.",
            "note_en": "Register a `button.addEventListener` call with a callback.",
            "requireCallback": true
      },
      {
            "id": "click-event-name",
            "type": "js-call",
            "target": "button.addEventListener",
            "note_ar": "استخدم النص الحرفي `\"click\"` كاسم الحدث في استدعاء المستمع.",
            "note_en": "Use the string literal `\"click\"` as the event name in the listener call.",
            "argument": "click",
            "argumentIndex": 0
      },
      {
            "id": "change-button-text",
            "type": "js-property-assignment",
            "target": "button.textContent",
            "note_ar": "داخل callback الخاص بالنقرة، أسند النص الحرفي `\"Done!\"` إلى `button.textContent`.",
            "note_en": "Inside the click callback, assign the string literal `\"Done!\"` to `button.textContent`.",
            "value": "Done!",
            "withinCall": {
              "target": "button.addEventListener",
              "callbackArgumentIndex": 1,
              "argument": "click",
              "argumentIndex": 0
            }
      }
    ]
  }
};
