export type Locale = 'ar' | 'en';

type NumberedItem = {
  title: string;
  body: string;
};

type JourneyItem = NumberedItem & {
  level: string;
};

type LessonStep = {
  id: 'html' | 'tag' | 'element' | 'anatomy' | 'example' | 'summary';
  title: string;
  body: string;
};

type LessonChoice = {
  id: string;
  label: string;
  kind: 'code' | 'text';
};

type LessonQuestion = {
  id: string;
  prompt: string;
  choices: LessonChoice[];
  correctChoiceId: string;
  correctFeedback: string;
  incorrectFeedback: string;
  reviewTopic: string;
};

type LessonCopy = {
  metaTitle: string;
  metaDescription: string;
  stageLabel: string;
  backToJourney: string;
  eyebrow: string;
  title: string;
  intro: string;
  objectiveLabel: string;
  objectiveText: string;
  learningProgress: string;
  learningProgressNote: string;
  learningLabel: string;
  htmlStructureCaption: string;
  learningSteps: LessonStep[];
  summaryPoints: string[];
  tagExampleLabel: string;
  tagCompareLabel: string;
  elementCompareLabel: string;
  elementDiagramTitle: string;
  openingTagLabel: string;
  contentLabel: string;
  closingTagLabel: string;
  exampleLabel: string;
  exampleTitle: string;
  exampleNote: string;
  headingRole: string;
  paragraphRole: string;
  practiceLabel: string;
  quizTitle: string;
  quizIntro: string;
  quizProgress: string;
  quizProgressNote: string;
  questions: LessonQuestion[];
  correctTitle: string;
  incorrectTitle: string;
  tryAgain: string;
  previousStep: string;
  nextStep: string;
  startQuiz: string;
  nextQuestion: string;
  showResult: string;
  resultTitle: string;
  scoreLabel: string;
  resultMessages: {
    perfect: string;
    four: string;
    three: string;
    low: string;
  };
  resultNote: string;
  reviewTitle: string;
  noMissedQuestions: string;
  retryQuiz: string;
  outcomeLabel: string;
  outcomeBody: string;
};

type LandingCopy = {
  metaTitle: string;
  metaDescription: string;
  nav: {
    vision: string;
    journey: string;
    platform: string;
    about: string;
    menu: string;
    closeMenu: string;
    switchLanguage: string;
  };
  hero: {
    eyebrow: string;
    titleFirst: string;
    titleAccent: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
    note: string;
  };
  coreIdea: {
    eyebrow: string;
    title: string;
    description: string;
    visionLabel: string;
    roadmapNote: string;
    loopLabel: string;
    steps: NumberedItem[];
    structureLabel: string;
    structure: string[];
  };
  journey: {
    eyebrow: string;
    title: string;
    description: string;
    roadmapNote: string;
    steps: JourneyItem[];
  };
  lesson: LessonCopy;
  vision: {
    eyebrow: string;
    title: string;
    description: string;
    principles: NumberedItem[];
  };
  platform: {
    eyebrow: string;
    title: string;
    description: string;
    status: string;
    cards: NumberedItem[];
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    quote: string;
  };
  closing: {
    eyebrow: string;
    title: string;
    description: string;
    action: string;
  };
  footer: {
    tagline: string;
    backToTop: string;
    copyright: string;
  };
};

export const messages: Record<Locale, LandingCopy> = {
  ar: {
    metaTitle: 'VANTA — تعلّم، مارس، ابنِ',
    metaDescription: 'VANTA — تعلّم البرمجة بالممارسة، وابنِ ما يتجاوز المعتاد.',
    nav: {
      vision: 'الرؤية',
      journey: 'رحلة التعلّم',
      platform: 'ما نبنيه',
      about: 'عن VANTA',
      menu: 'القائمة',
      closeMenu: 'إغلاق القائمة',
      switchLanguage: 'Switch to English',
    },
    hero: {
      eyebrow: 'تعلّم • مارس • ابنِ • نافس',
      titleFirst: 'ابدأ من الصفر.',
      titleAccent: 'وابنِ ما يتجاوز المعتاد.',
      description:
        'VANTA مساحة تعلّم برمجة للمبتدئين، تبدأ بالفضول وتكبر مع كل سطر تكتبه وكل مشكلة تتعلّم حلّها.',
      primaryAction: 'اكتشف رحلة VANTA',
      secondaryAction: 'ما الذي نؤمن به؟',
      note: 'تعلّم بالممارسة، لا بالمشاهدة فقط.',
    },
    coreIdea: {
      eyebrow: 'فكرة VANTA',
      title: 'مش مجرد كورس... اتعلّم بالممارسة',
      description:
        'VANTA منصة عملية لتعلّم البرمجة للمبتدئين. تكتب الشيفرة بنفسك، تشغّلها، تكتشف الخطأ وتفهم كيف تصلحه. ومع مسارات ودروس متدرجة، تنتقل من الأساسيات إلى تحديات ومشاريع تنمّي مهارتك في حلّ المشكلات.',
      visionLabel: 'رؤية المنصة — تُبنى على مراحل',
      roadmapNote:
        'هذا وصف للتجربة المستهدفة؛ المسارات والدروس، تشغيل الشيفرة، المساعدة الذكية والتلميحات، التحديات والمشاريع والمسابقات ليست وظائف مفعّلة في النسخة التأسيسية.',
      loopLabel: 'حلقة التعلّم',
      steps: [
        { title: 'اكتب', body: 'ابدأ بالشيفرة بنفسك، لا بالمشاهدة وحدها.' },
        { title: 'شغّل', body: 'جرّبها ولاحظ ما تعلّمك إياه النتيجة.' },
        { title: 'اكتشف', body: 'تتبّع الخطأ وافهم السبب وراءه.' },
        { title: 'أصلح', body: 'حسّن محاولتك وابنِ خطوة جديدة.' },
      ],
      structureLabel: 'رحلة تعلّم منظّمة',
      structure: ['مسارات', 'دروس', 'تحديات', 'مشاريع عملية'],
    },
    journey: {
      eyebrow: 'رحلة التعلّم',
      title: 'من الأساسيات إلى بناء مشاريعك.',
      description:
        'خمس محطات مقترحة تساعد المبتدئ على فهم المفاهيم، ثم تطبيقها تدريجيًا حتى يجمعها في مشاريع صغيرة.',
      roadmapNote:
        'تصوّر للمسار المستقبلي؛ لا توجد دروس أو تحديات أو مشاريع أو متابعة تقدّم مفعّلة حاليًا.',
      steps: [
        {
          title: 'البداية',
          level: 'مبتدئ',
          body: 'تعرّف إلى البرمجة وطريقة التفكير خطوة بخطوة.',
        },
        {
          title: 'الأساسيات',
          level: 'تأسيس',
          body: 'افهم المتغيرات والشروط والحلقات والدوال.',
        },
        {
          title: 'الممارسة',
          level: 'تطبيق موجّه',
          body: 'طبّق المفاهيم في تمارين صغيرة ومتدرجة.',
        },
        {
          title: 'التحديات',
          level: 'حلّ المشكلات',
          body: 'فكّر في حلول لمشكلات تجمع ما تعلّمته.',
        },
        {
          title: 'المشاريع',
          level: 'بناء عملي',
          body: 'اجمع مهاراتك لبناء مشاريع صغيرة من الصفر.',
        },
      ],
    },
    lesson: {
      metaTitle: 'VANTA — أساسيات HTML',
      metaDescription: 'درس HTML تفاعلي من ست خطوات واختبار قصير بخمسة أسئلة.',
      stageLabel: '01 / البداية • الأساسيات',
      backToJourney: 'العودة إلى رحلة التعلّم',
      eyebrow: 'البداية • أساسيات HTML',
      title: 'أول صفحة لك بـ HTML',
      intro: 'تعلّم فكرة HTML خطوة بخطوة، ثم اختبر فهمك بمثال بسيط وأسئلة قصيرة.',
      objectiveLabel: 'هدف الدرس',
      objectiveText: 'افهم كيف تصف HTML الصفحة، وما الفرق بين الوسم والعنصر، وكيف تكوّن عنوانًا وفقرة.',
      learningProgress: 'الشرح {current} / {total}',
      learningProgressNote: 'مؤشر مؤقت داخل الدرس الحالي؛ لا يتم حفظ التقدّم.',
      learningLabel: 'افهم الفكرة',
      htmlStructureCaption: 'بنية الصفحة ومحتواها',
      learningSteps: [
        { id: 'html', title: 'ما هي HTML؟', body: 'HTML طريقة لوصف أجزاء صفحة الويب ومحتواها. تساعد المتصفح على فهم ما إذا كان النص عنوانًا أو فقرة.' },
        { id: 'tag', title: 'ما هو الوسم؟', body: 'الوسم تعليمة قصيرة نكتبها بين علامتَي < و > لتحديد نوع المحتوى. مثل <h1> لعنوان رئيسي.' },
        { id: 'element', title: 'ما هو العنصر؟', body: 'الوسم يحدد نوع المحتوى، أما العنصر فهو الجزء الكامل: وسم فتح، ومحتوى، ووسم إغلاق.' },
        { id: 'anatomy', title: 'وسم الفتح والمحتوى ووسم الإغلاق', body: 'لاحظ أن الشرطة المائلة / تظهر في وسم الإغلاق، وأن المحتوى يقع بين الوسمين.' },
        { id: 'example', title: 'مثال صغير يجمعهما', body: 'يحتوي المثال على عنوان رئيسي يتبعه نص ترحيبي في فقرة. اقرأ وظيفة كل سطر.' },
        { id: 'summary', title: 'ملخص سريع', body: 'هذه أهم الأفكار التي ستساعدك على قراءة أول مثال HTML.' },
      ],
      summaryPoints: [
        'HTML تصف بنية الصفحة ومحتواها.',
        'الوسم يحدد نوع المحتوى، مثل <h1> للعنوان الرئيسي و <p> للفقرة.',
        'العنصر الكامل يتكوّن من وسم فتح ومحتوى ووسم إغلاق.',
      ],
      tagExampleLabel: 'وسم لعنوان رئيسي',
      tagCompareLabel: 'وسم',
      elementCompareLabel: 'عنصر كامل',
      elementDiagramTitle: 'أجزاء عنصر العنوان',
      openingTagLabel: 'وسم الفتح',
      contentLabel: 'المحتوى',
      closingTagLabel: 'وسم الإغلاق',
      exampleLabel: 'مثال عملي',
      exampleTitle: 'عنوان وفقرة في صفحة واحدة',
      exampleNote: 'للقراءة فقط · لا ينفّذ هذا الدرس الكود.',
      headingRole: 'عنوان رئيسي',
      paragraphRole: 'فقرة ترحيب',
      practiceLabel: 'تطبيق سريع',
      quizTitle: 'خمسة أسئلة قصيرة',
      quizIntro: 'سؤال واحد في كل مرة. إذا أخطأت، سنوضح السبب ونترك لك فرصة للمحاولة.',
      quizProgress: 'السؤال {current} / {total}',
      quizProgressNote: 'الإجابات والنتيجة مؤقتة ولا يتم حفظها.',
      questions: [
        {
          id: 'opening-tag',
          prompt: 'أي جزء هو وسم الفتح في عنصر العنوان؟',
          choices: [
            { id: 'h1', label: '<h1>', kind: 'code' },
            { id: 'closing-h1', label: '</h1>', kind: 'code' },
          ],
          correctChoiceId: 'h1',
          correctFeedback: 'صحيح. وسم الفتح يحدد بداية العنوان، ولا يحتوي على شرطة مائلة.',
          incorrectFeedback: 'ربما اختلط عليك الفتح والإغلاق. الشرطة المائلة / تعني أن الوسم يغلق العنصر؛ وسم الفتح هو <h1>.',
          reviewTopic: 'وسم الفتح ووسم الإغلاق',
        },
        {
          id: 'heading-role',
          prompt: 'ما الذي يخبرنا به <h1> عن المحتوى؟',
          choices: [
            { id: 'main-heading', label: 'أنه عنوان رئيسي', kind: 'text' },
            { id: 'paragraph', label: 'أنه فقرة', kind: 'text' },
          ],
          correctChoiceId: 'main-heading',
          correctFeedback: 'أحسنت. هذا الوسم يوضح أن المحتوى عنوان رئيسي، وليس فقرة.',
          incorrectFeedback: 'اختلط عليك نوعا المحتوى: <h1> للعنوان الرئيسي، أما <p> فيستخدم للفقرة.',
          reviewTopic: 'الفرق بين العنوان والفقرة',
        },
        {
          id: 'complete-element',
          prompt: 'أي اختيار يمثّل العنصر كاملًا؟',
          choices: [
            { id: 'whole-element', label: '<h1>Hello</h1>', kind: 'code' },
            { id: 'opening-only', label: '<h1>', kind: 'code' },
          ],
          correctChoiceId: 'whole-element',
          correctFeedback: 'بالضبط. العنصر هو وسم الفتح والمحتوى ووسم الإغلاق معًا.',
          incorrectFeedback: 'هنا اختلط الوسم بالعنصر: <h1> هو الوسم فقط، أما <h1>Hello</h1> فهو العنصر كاملًا.',
          reviewTopic: 'الفرق بين الوسم والعنصر',
        },
        {
          id: 'paragraph-element',
          prompt: 'أي كود ينشئ فقرة HTML صحيحة؟',
          choices: [
            { id: 'valid-paragraph', label: '<p>Welcome to VANTA.</p>', kind: 'code' },
            { id: 'wrong-closing-tag', label: '<p>Welcome to VANTA.</h1>', kind: 'code' },
          ],
          correctChoiceId: 'valid-paragraph',
          correctFeedback: 'صحيح. تبدأ الفقرة بوسم <p> وتنتهي بالوسم المطابق </p>.',
          incorrectFeedback: 'انتبه لتطابق الوسمين: فتحت الفقرة بـ <p>، لذلك يجب إغلاقها بـ </p> وليس وسم العنوان.',
          reviewTopic: 'وسم الفقرة وإغلاقه الصحيح',
        },
        {
          id: 'read-example',
          prompt: 'ماذا تعرض سطرا المثال معًا؟',
          choices: [
            { id: 'heading-paragraph', label: 'عنوان رئيسي يتبعه نص ترحيبي في فقرة', kind: 'text' },
            { id: 'two-paragraphs', label: 'فقرتان متتاليتان', kind: 'text' },
          ],
          correctChoiceId: 'heading-paragraph',
          correctFeedback: 'رائع. السطر الأول عنوان رئيسي، والثاني فقرة ترحيب.',
          incorrectFeedback: 'اقرأ الوسم في بداية كل سطر: <h1> يحدد العنوان، و <p> تحدد الفقرة.',
          reviewTopic: 'قراءة العنوان والفقرة معًا',
        },
      ],
      correctTitle: 'برافو! إجابة صحيحة 🎉',
      incorrectTitle: 'مش الإجابة الصحيحة، لكن عادي! جرّب تاني 💪',
      tryAgain: 'أحاول مرة أخرى',
      previousStep: 'السابق',
      nextStep: 'التالي',
      startQuiz: 'ابدأ الاختبار',
      nextQuestion: 'السؤال التالي',
      showResult: 'اعرض نتيجتي',
      resultTitle: 'نتيجتك',
      scoreLabel: 'إجابات صحيحة من أول محاولة',
      resultMessages: {
        perfect: 'ممتاز! 🎉 أنت جاهز لاستكشاف ما يأتي.',
        four: 'رائع! لديك فهم جيد جدًا. راجع النقطة التي احتجت فيها للمحاولة.',
        three: 'كويس! الأساس موجود. راجع النقاط المحددة وحاول مرة أخرى.',
        low: 'ولا يهمك! الخطأ جزء من التعلّم. راجع النقاط المحددة وابدأ من جديد.',
      },
      resultNote: 'الدرجة للمراجعة فقط، وليست حكمًا على مستواك. النتيجة مؤقتة ولا يتم حفظها.',
      reviewTitle: 'نقاط للمراجعة',
      noMissedQuestions: 'أجبت عن كل الأسئلة بشكل صحيح من أول محاولة.',
      retryQuiz: 'إعادة الاختبار',
      outcomeLabel: 'بعد هذا الدرس',
      outcomeBody: 'ستكون قادرًا على قراءة HTML بسيطة، وفهم الفرق بين الوسم والعنصر، واستخدام <h1> للعنوان و <p> للفقرة.',
    },
    vision: {
      eyebrow: 'لماذا VANTA؟',
      title: 'البرمجة تُفهم حين تضع يدك عليها.',
      description:
        'نصمّم تجربة عملية تجعل التعلّم أقرب إلى بناء شيء حقيقي: تكتب، تجرّب، ترى النتيجة، وتفهم الخطوة التالية.',
      principles: [
        {
          title: 'من الصفر، بوضوح',
          body: 'مفاهيم مترابطة ومراحل تساعد المبتدئ على التقدّم دون افتراض خبرة سابقة.',
        },
        {
          title: 'التجربة جزء من الدرس',
          body: 'الفهم لا يكتمل بالمشاهدة؛ الممارسة والتغذية الراجعة هما قلب الرحلة.',
        },
        {
          title: 'مهارة تبقى معك',
          body: 'الهدف ليس إنهاء محتوى، بل اكتساب طريقة تفكير تساعدك على بناء حلولك.',
        },
      ],
    },
    platform: {
      eyebrow: 'أفق VANTA',
      title: 'بيئة برمجية تتكوّن خطوة بخطوة.',
      description:
        'هذه محاور في رؤية المنتج، وليست وظائف مفعّلة في هذه النسخة التأسيسية.',
      status: 'ضمن خارطة المنصة',
      cards: [
        {
          title: 'مسارات ومشاريع',
          body: 'رحلات مترابطة من أساسيات الويب إلى مشاريع عملية قابلة للتوسّع.',
        },
        {
          title: 'مساعد يعلّمك التفكير',
          body: 'توجيه وتلميحات تساعدك على فهم الخطأ قبل طلب الحل الكامل.',
        },
        {
          title: 'تحديات ومنافسات',
          body: 'مساحات لاختبار المهارة، والتدرّب على حل المشكلات مع الآخرين.',
        },
      ],
    },
    about: {
      eyebrow: 'عن VANTA',
      title: 'نحن لا نضيف درسًا آخر. نحن نبني مساحة لصناعة المستقبل.',
      description:
        'VANTA مشروع تعلّم برمجة للمبتدئين، ينطلق من إيمان بسيط: الوصول إلى التقنية يبدأ حين تمنح نفسك فرصة أن تجرّب وتبني.',
      quote: 'حيث ينتهي خيال المعتاد.. تبدأ سيطرة VANTA',
    },
    closing: {
      eyebrow: 'تعلّم لتبني',
      title: 'المستقبل لا يُكتفى بمشاهدته.',
      description: 'تعلّم كيف تكتب سطرك الأول، ثم اتركه يقودك إلى ما بعده.',
      action: 'عد إلى بداية الرحلة',
    },
    footer: {
      tagline: 'Create Beyond>',
      backToTop: 'العودة إلى الأعلى',
      copyright: 'بيئة تعلّم برمجة للمبتدئين.',
    },
  },
  en: {
    metaTitle: 'VANTA — Learn, Practice, Build',
    metaDescription: 'Learn programming through practice with VANTA, and build beyond the ordinary.',
    nav: {
      vision: 'Our vision',
      journey: 'The journey',
      platform: 'What we are building',
      about: 'About VANTA',
      menu: 'Menu',
      closeMenu: 'Close menu',
      switchLanguage: 'التبديل إلى العربية',
    },
    hero: {
      eyebrow: 'LEARN • PRACTICE • BUILD • COMPETE',
      titleFirst: 'Start from zero.',
      titleAccent: 'Build beyond the ordinary.',
      description:
        'VANTA is a place for beginners to learn programming through practice—starting with curiosity and growing with every line you write and every problem you learn to solve.',
      primaryAction: 'Explore the VANTA journey',
      secondaryAction: 'What do we believe?',
      note: 'Learn by doing, not by watching alone.',
    },
    coreIdea: {
      eyebrow: 'THE VANTA APPROACH',
      title: 'Not just a course. Learn by building.',
      description:
        'VANTA is a practical coding-learning platform for beginners. You write and run code, find mistakes, understand why they happen, and fix them. Structured paths and lessons lead toward practical challenges and projects that build real coding and problem-solving skills.',
      visionLabel: 'THE PLATFORM VISION — BUILT IN STAGES',
      roadmapNote:
        'This describes the intended experience. Paths and lessons, code execution, AI assistance and hints, challenges, projects, and competitions are not active features in this foundation release.',
      loopLabel: 'THE LEARNING LOOP',
      steps: [
        { title: 'Write', body: 'Start by writing code, not only watching.' },
        { title: 'Run', body: 'Try it and learn from the result.' },
        { title: 'Inspect', body: 'Find the mistake and understand why.' },
        { title: 'Fix', body: 'Improve your attempt and build the next step.' },
      ],
      structureLabel: 'A structured learning journey',
      structure: ['Paths', 'Lessons', 'Challenges', 'Practical projects'],
    },
    journey: {
      eyebrow: 'THE LEARNING JOURNEY',
      title: 'From fundamentals to building your own projects.',
      description:
        'Five proposed stages for beginners: build a foundation, practice step by step, then bring those skills together in small projects.',
      roadmapNote:
        'A roadmap concept only—not active lessons, challenges, projects, or progress tracking.',
      steps: [
        {
          title: 'Start',
          level: 'BEGINNER',
          body: 'Meet programming and learn to think one step at a time.',
        },
        {
          title: 'Fundamentals',
          level: 'FOUNDATION',
          body: 'Understand variables, conditions, loops, and functions.',
        },
        {
          title: 'Practice',
          level: 'GUIDED PRACTICE',
          body: 'Apply concepts through short, progressive exercises.',
        },
        {
          title: 'Challenges',
          level: 'PROBLEM-SOLVING',
          body: 'Reason through problems using what you have learned.',
        },
        {
          title: 'Projects',
          level: 'APPLIED BUILDING',
          body: 'Bring your skills together in small projects of your own.',
        },
      ],
    },
    lesson: {
      metaTitle: 'VANTA — HTML Fundamentals',
      metaDescription: 'A six-step introduction to HTML with a five-question interactive practice check.',
      stageLabel: '01 / START · FUNDAMENTALS',
      backToJourney: 'Back to the learning journey',
      eyebrow: 'START · HTML FUNDAMENTALS',
      title: 'Your first HTML page',
      intro: 'Learn what HTML does one small step at a time, then check your understanding with a tiny example.',
      objectiveLabel: 'LEARNING OBJECTIVE',
      objectiveText: 'Understand how HTML describes a page, how a tag differs from an element, and how to write a heading and a paragraph.',
      learningProgress: 'Learning {current} / {total}',
      learningProgressNote: 'A temporary indicator for this lesson only; progress is not saved.',
      learningLabel: 'LEARN',
      htmlStructureCaption: 'Page structure + content',
      learningSteps: [
        { id: 'html', title: 'What is HTML?', body: 'HTML describes the parts and content of a web page. It helps a browser tell whether text is a heading or a paragraph.' },
        { id: 'tag', title: 'What is a tag?', body: 'A tag is a short instruction written between < and > to name the kind of content. For example, <h1> marks a main heading.' },
        { id: 'element', title: 'What is an element?', body: 'A tag names the content type; an element is the whole piece: opening tag, content, and closing tag.' },
        { id: 'anatomy', title: 'Opening tag, content, closing tag', body: 'Notice the slash / in the closing tag. The content sits between the two tags.' },
        { id: 'example', title: 'A small example that brings it together', body: 'This example has a main heading followed by a welcome paragraph. Read what each line describes.' },
        { id: 'summary', title: 'A quick recap', body: 'Keep these ideas in mind as you read your first small piece of HTML.' },
      ],
      summaryPoints: [
        'HTML describes a page’s structure and content.',
        'A tag names the content type: <h1> for a main heading and <p> for a paragraph.',
        'A complete element has an opening tag, content, and a closing tag.',
      ],
      tagExampleLabel: 'A main heading tag',
      tagCompareLabel: 'Tag',
      elementCompareLabel: 'Complete element',
      elementDiagramTitle: 'The three parts of a heading element',
      openingTagLabel: 'Opening tag',
      contentLabel: 'Content',
      closingTagLabel: 'Closing tag',
      exampleLabel: 'A PRACTICAL EXAMPLE',
      exampleTitle: 'A heading and paragraph on one page',
      exampleNote: 'Read-only · This lesson does not run code.',
      headingRole: 'Main heading',
      paragraphRole: 'Welcome paragraph',
      practiceLabel: 'PRACTICE',
      quizTitle: 'Five quick questions',
      quizIntro: 'One question at a time. If you miss one, we’ll explain why and let you try again.',
      quizProgress: 'Question {current} / {total}',
      quizProgressNote: 'Your answers and result are temporary and are not saved.',
      questions: [
        {
          id: 'opening-tag',
          prompt: 'Which part is the opening tag in a heading element?',
          choices: [
            { id: 'h1', label: '<h1>', kind: 'code' },
            { id: 'closing-h1', label: '</h1>', kind: 'code' },
          ],
          correctChoiceId: 'h1',
          correctFeedback: 'Correct. The opening tag marks where the heading begins and has no slash.',
          incorrectFeedback: 'It is easy to mix these up. The slash / marks the closing tag; <h1> is the opening tag.',
          reviewTopic: 'Opening and closing tags',
        },
        {
          id: 'heading-role',
          prompt: 'What does <h1> tell the browser about the content?',
          choices: [
            { id: 'main-heading', label: 'It is the main heading', kind: 'text' },
            { id: 'paragraph', label: 'It is a paragraph', kind: 'text' },
          ],
          correctChoiceId: 'main-heading',
          correctFeedback: 'That’s right. This tag identifies the content as a main heading, not a paragraph.',
          incorrectFeedback: 'These two content types are easy to mix up: <h1> is for a main heading, while <p> is for a paragraph.',
          reviewTopic: 'Headings versus paragraphs',
        },
        {
          id: 'complete-element',
          prompt: 'Which choice is the complete element?',
          choices: [
            { id: 'whole-element', label: '<h1>Hello</h1>', kind: 'code' },
            { id: 'opening-only', label: '<h1>', kind: 'code' },
          ],
          correctChoiceId: 'whole-element',
          correctFeedback: 'Exactly. The element includes the opening tag, content, and closing tag together.',
          incorrectFeedback: 'This is the tag-versus-element mix-up: <h1> is only the tag; <h1>Hello</h1> is the complete element.',
          reviewTopic: 'Tag versus element',
        },
        {
          id: 'paragraph-element',
          prompt: 'Which code creates a valid HTML paragraph?',
          choices: [
            { id: 'valid-paragraph', label: '<p>Welcome to VANTA.</p>', kind: 'code' },
            { id: 'wrong-closing-tag', label: '<p>Welcome to VANTA.</h1>', kind: 'code' },
          ],
          correctChoiceId: 'valid-paragraph',
          correctFeedback: 'Correct. <p> opens a paragraph and its matching </p> closes it.',
          incorrectFeedback: 'Check that the tags match: a paragraph opened with <p> must close with </p>, not a heading tag.',
          reviewTopic: 'Paragraph tags and matching closers',
        },
        {
          id: 'read-example',
          prompt: 'What do the two example lines show together?',
          choices: [
            { id: 'heading-paragraph', label: 'A main heading followed by a welcome paragraph', kind: 'text' },
            { id: 'two-paragraphs', label: 'Two paragraphs in a row', kind: 'text' },
          ],
          correctChoiceId: 'heading-paragraph',
          correctFeedback: 'That’s it. The first line is a main heading; the second is a welcome paragraph.',
          incorrectFeedback: 'Look at each line’s opening tag: <h1> marks the heading, and <p> marks the paragraph.',
          reviewTopic: 'Reading a heading and paragraph together',
        },
      ],
      correctTitle: 'Correct! Nicely done. 🎉',
      incorrectTitle: 'Not quite—and that’s okay. Try again. 💪',
      tryAgain: 'Try again',
      previousStep: 'Previous',
      nextStep: 'Next',
      startQuiz: 'Start the quiz',
      nextQuestion: 'Next question',
      showResult: 'See my result',
      resultTitle: 'Your result',
      scoreLabel: 'Correct on the first try',
      resultMessages: {
        perfect: 'Excellent! 🎉 You have a strong grasp and are ready for what comes next.',
        four: 'Great work! You understand the core ideas. Review the one that took another try.',
        three: 'Good start! Review the marked ideas, then give it another go.',
        low: 'No worries—getting things wrong is part of learning. Review the ideas and start again.',
      },
      resultNote: 'Your score is for reflection, not a judgment of your ability. It is temporary and is not saved.',
      reviewTitle: 'Ideas to review',
      noMissedQuestions: 'You answered every question correctly on the first try.',
      retryQuiz: 'Try the quiz again',
      outcomeLabel: 'AFTER THIS LESSON',
      outcomeBody: 'You can read simple HTML, tell a tag from an element, and use <h1> for a heading and <p> for a paragraph.',
    },
    vision: {
      eyebrow: 'WHY VANTA?',
      title: 'Programming makes sense when you get hands-on.',
      description:
        'We are shaping a practical experience that feels like building something real: write, experiment, see what happens, and understand what to do next.',
      principles: [
        {
          title: 'Start at zero, clearly',
          body: 'Connected concepts and stages help beginners progress without assuming prior experience.',
        },
        {
          title: 'Practice is part of the lesson',
          body: 'Watching is not enough; practice and feedback are at the heart of the journey.',
        },
        {
          title: 'Skills that stay with you',
          body: 'The goal is not to finish content, but to develop a way of thinking that helps you build solutions.',
        },
      ],
    },
    platform: {
      eyebrow: 'THE VANTA HORIZON',
      title: 'A programming environment, built one step at a time.',
      description:
        'These are product directions, not features enabled in this foundation release.',
      status: 'On the platform roadmap',
      cards: [
        {
          title: 'Paths and projects',
          body: 'Connected journeys from web fundamentals to practical, expandable projects.',
        },
        {
          title: 'An assistant that teaches thinking',
          body: 'Guidance and hints that help you understand an error before asking for the full solution.',
        },
        {
          title: 'Challenges and competitions',
          body: 'Places to test your skills and practice problem-solving with others.',
        },
      ],
    },
    about: {
      eyebrow: 'ABOUT VANTA',
      title: 'Not another course. A space to build what comes next.',
      description:
        'VANTA is a programming-learning project for beginners, grounded in a simple belief: entering technology starts when you give yourself room to try and build.',
      quote: 'Where the ordinary ends, VANTA begins.',
    },
    closing: {
      eyebrow: 'LEARN TO BUILD',
      title: 'The future is not something you only watch.',
      description: 'Learn to write your first line, then let it lead you to what comes next.',
      action: 'Back to the beginning',
    },
    footer: {
      tagline: 'Create Beyond>',
      backToTop: 'Back to top',
      copyright: 'A coding practice environment for beginners.',
    },
  },
};
