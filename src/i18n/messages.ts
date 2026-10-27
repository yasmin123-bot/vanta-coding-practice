export type Locale = 'ar' | 'en';

type NumberedItem = {
  title: string;
  body: string;
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
    visualLabel: string;
    visualTitle: string;
    visualBody: string;
    visualFoot: string;
  };
  journey: {
    eyebrow: string;
    title: string;
    description: string;
    steps: NumberedItem[];
  };
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
      visualLabel: 'منهج VANTA',
      visualTitle: 'الفكرة لا تبقى فكرة.',
      visualBody:
        'كل مفهوم يقود إلى ممارسة، وكل ممارسة تقرّبك من مشروع تفخر ببنائه.',
      visualFoot: 'مسار يتّسع لمهاراتك القادمة',
    },
    journey: {
      eyebrow: 'رحلة تتجاوز الدرس',
      title: 'من أول سطر إلى ما تصنعه بنفسك.',
      description:
        'ليست البرمجة قائمة دروس تنتهي عند آخر صفحة. إنها مهارة تنمو حين تجرّب، تخطئ، تفهم، ثم تعود أقوى.',
      steps: [
        { title: 'تعلّم', body: 'افهم المفاهيم من نقطة البداية.' },
        { title: 'مارس', body: 'اكتب الشيفرة وجرّبها بنفسك.' },
        { title: 'ابنِ', body: 'حوّل ما تعلّمته إلى أفكار ومشاريع.' },
        { title: 'حلّ', body: 'واجه تحديات تكشف طريقة تفكيرك.' },
        { title: 'طوّر', body: 'راجع محاولاتك وصقل مهاراتك.' },
        { title: 'نافس', body: 'اختبر ما بنيته في تحديات أكبر.' },
      ],
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
      visualLabel: 'THE VANTA METHOD',
      visualTitle: 'Ideas are made to become real.',
      visualBody:
        'Every concept leads to practice, and every practice brings you closer to a project you are proud to build.',
      visualFoot: 'A path that grows with your skills',
    },
    journey: {
      eyebrow: 'BEYOND THE LESSON',
      title: 'From your first line to what you make yourself.',
      description:
        'Programming is not a list of lessons that ends on the last page. It is a skill that grows when you try, make mistakes, understand, and come back stronger.',
      steps: [
        { title: 'Learn', body: 'Understand concepts from the beginning.' },
        { title: 'Practice', body: 'Write code and experiment yourself.' },
        { title: 'Build', body: 'Turn what you learn into ideas and projects.' },
        { title: 'Solve', body: 'Meet challenges that reveal how you think.' },
        { title: 'Improve', body: 'Review your attempts and sharpen your skills.' },
        { title: 'Compete', body: 'Test what you have built in bigger challenges.' },
      ],
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
