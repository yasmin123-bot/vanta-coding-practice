import type { Locale } from './messages';

export type StudentPortalMessages = {
  common: {
    paths: string;
    home: string;
    dataError: string;
    serviceError: string;
    setupUnsafeKey: string;
    setupInvalidKey: string;
    setupInvalidUrl: string;
    setupMissing: string;
    signInToSave: string;
    backToLogin: string;
    displayName: string;
    displayNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    confirmPassword: string;
    minimumPassword: string;
    showPassword: string;
    hidePassword: string;
    signIn: string;
    createAccount: string;
    sendReset: string;
    updatePassword: string;
    noAccount: string;
    haveAccount: string;
    loading: string;
    accountOnly: string;
    savingError: string;
    loadErrorTitle: string;
    loadErrorBody: string;
    retry: string;
    edit: string;
    save: string;
    cancel: string;
    saving: string;
    displayNameHint: string;
    displayNameValidation: string;
    displayNameUpdated: string;
    displayNameUpdateFailed: string;
    savingProgress: string;
    progressSaved: string;
    progressSaveFailed: string;
    retryProgressSave: string;
  };
  nav: {
    dashboard: string;
    profile: string;
    logout: string;
    signingOut: string;
    login: string;
    signup: string;
  };
  appShell: {
    openMenu: string;
    closeMenu: string;
    menuTitle: string;
    primaryNavigation: string;
    learningPaths: string;
    practice: string;
    quizzes: string;
    quizNote: string;
    more: string;
    preferences: string;
    language: string;
    appearance: string;
    account: string;
    challenges: string;
    projects: string;
    comingSoon: string;
    bottomNavigation: string;
  };
  home: {
    heroEyebrow: string;
    heroBody: string;
    heroAction: string;
    firstLessonAction: string;
    pathsTitle: string;
    pathsBody: string;
    htmlPathBody: string;
    cssPathBody: string;
    javascriptPathBody: string;
    loopTitle: string;
    loopSteps: string[];
    practiceTitle: string;
    practiceBody: string;
    practiceAction: string;
    quizTitle: string;
    quizBody: string;
    quizAction: string;
    quickActionsTitle: string;
    profileAction: string;
    settingsAction: string;
    settingsBody: string;
    challengeAction: string;
    projectAction: string;
    guestNote: string;
  };
  auth: {
    eyebrow: string;
    fullName: string;
    fullNamePlaceholder: string;
    signInAction: string;
    createAccountAction: string;
    loginTitle: string;
    loginBody: string;
    signupTitle: string;
    signupBody: string;
    forgotTitle: string;
    forgotBody: string;
    resetTitle: string;
    resetBody: string;
    callbackTitle: string;
    callbackBody: string;
    callbackReady: string;
    callbackFailed: string;
    gatewayLoading: string;
    submitBusy: string;
    setupOnly: string;
    confirmationBody: string;
    resetSentBody: string;
    passwordUpdated: string;
    passwordResetMissingSession: string;
      validationName: string;
      validationRequired: string;
      validationEmail: string;
      validationPassword: string;
    validationConfirm: string;
    errorCredentials: string;
    errorUnconfirmed: string;
    errorExists: string;
    errorRateLimit: string;
    errorGeneric: string;
    forgotLink: string;
    signupLink: string;
    loginLink: string;
    resetLink: string;
  };
  intro: {
    preferencesLabel: string;
    tagline: string;
    secondaryTagline: string;
    next: string;
  };
  authVisual: {
    brandLine: string;
    title: string;
    body: string;
    codeLabel: string;
    sequenceLabel: string;
    steps: string[];
  };
  dashboard: {
    eyebrow: string;
    title: string;
    lead: string;
    pathsStarted: string;
    pathsCompleted: string;
    lessonsCompleted: string;
    latestQuiz: string;
    noScore: string;
    continueTitle: string;
    continueBody: string;
    currentLesson: string;
    noCurrentLesson: string;
    nextRecommended: string;
    continueAction: string;
    reviewAction: string;
    allComplete: string;
    pathProgress: string;
    currentPath: string;
    pathNotStarted: string;
    pathInProgress: string;
    pathCompleted: string;
    pathLessonCount: string;
    recentQuizResults: string;
    noRecentQuizResults: string;
    scorePercent: string;
    completed: string;
    started: string;
    notStarted: string;
    accountDataNote: string;
    profileLink: string;
  };
  profile: {
    eyebrow: string;
    title: string;
    lead: string;
    displayName: string;
    email: string;
    joined: string;
    currentLevel: string;
    beginnerLevel: string;
    emailVerified: string;
    verified: string;
    pending: string;
    pathsStarted: string;
    pathsCompleted: string;
    lessonsCompleted: string;
    overallProgress: string;
    pathProgress: string;
    quizResults: string;
    noQuizResults: string;
    futureAchievements: string;
    futureAchievementsNote: string;
    backDashboard: string;
  };
  progress: {
    lessonCount: string;
    savePrompt: string;
    catalogNote: string;
    pathNote: string;
    saveUnavailable: string;
  };
};

const portal: Record<Locale, StudentPortalMessages> = {
  ar: {
    common: {
      paths: 'المسارات',
      home: 'الرئيسية',
      dataError: 'تعذر تحميل بيانات التقدم. يمكنك متابعة الدرس، لكن راجع الاتصال بقاعدة البيانات.',
      serviceError: 'تعذر الاتصال بخدمة الحسابات. حاول مجددًا بعد قليل.',
      setupUnsafeKey: 'إعداد غير آمن: لا تضع مفتاح Supabase السري في تطبيق المتصفح. استخدم Publishable Key فقط.',
      setupInvalidKey: 'مفتاح Supabase غير معروف. استخدم Publishable Key أو مفتاح anon العام القديم فقط.',
      setupInvalidUrl: 'رابط مشروع Supabase غير صالح. راجع VITE_SUPABASE_URL.',
      setupMissing: 'خدمة الحسابات غير مهيأة بعد. أضف رابط Supabase ومفتاح Publishable إلى متغيرات البيئة لتفعيلها.',
      signInToSave: 'سجّل الدخول لحفظ تقدمك على حسابك.',
      backToLogin: 'العودة إلى تسجيل الدخول',
      displayName: 'الاسم الظاهر',
      displayNamePlaceholder: 'كيف نعرض اسمك؟',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'name@example.com',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      minimumPassword: '8 أحرف على الأقل.',
      showPassword: 'إظهار كلمة المرور',
      hidePassword: 'إخفاء كلمة المرور',
      signIn: 'تسجيل الدخول',
      createAccount: 'إنشاء الحساب',
      sendReset: 'إرسال رابط الاستعادة',
      updatePassword: 'تحديث كلمة المرور',
      noAccount: 'ليس لديك حساب؟',
      haveAccount: 'لديك حساب بالفعل؟',
      loading: 'جارٍ تحميل بيانات حسابك…',
      accountOnly: 'يُحفظ هذا التقدم في حسابك عبر Supabase.',
      savingError: 'لم نتمكن من حفظ هذا التقدم. تحقّق من إعدادات قاعدة البيانات وحاول مجددًا.',
      loadErrorTitle: 'تعذر تحميل بيانات التعلّم.',
      loadErrorBody: 'لم نعرض تقدمًا افتراضيًا حتى لا يبدو كأنه محفوظ. تحقّق من الاتصال ثم أعد المحاولة.',
      retry: 'إعادة المحاولة',
      edit: 'تعديل',
      save: 'حفظ',
      cancel: 'إلغاء',
      saving: 'جارٍ الحفظ…',
      displayNameHint: 'يظهر هذا الاسم في لوحة التعلّم والملف الشخصي فقط.',
      displayNameValidation: 'اكتب اسمًا من حرفين إلى 80 حرفًا.',
      displayNameUpdated: 'تم تحديث الاسم وحفظه في ملفك الشخصي.',
      displayNameUpdateFailed: 'لم نتمكن من تحديث الاسم. تحقق من الاتصال وحاول مجددًا.',
      savingProgress: 'جارٍ حفظ نتيجة الدرس في حسابك…',
      progressSaved: 'تم حفظ نتيجة هذا الدرس في حسابك.',
      progressSaveFailed: 'ظهرت النتيجة هنا، لكن تعذّر تأكيد حفظها على حسابك.',
      retryProgressSave: 'إعادة حفظ النتيجة',
    },
    nav: {
      dashboard: 'لوحة الطالب',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',
      signingOut: 'جارٍ تسجيل الخروج…',
    login: 'دخول',
    signup: 'إنشاء حساب',
  },
    appShell: {
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة',
      menuTitle: 'التنقّل والتفضيلات',
      primaryNavigation: 'التنقّل الرئيسي',
      learningPaths: 'مسارات التعلّم',
      practice: 'التدريب',
      quizzes: 'الاختبارات',
      quizNote: 'الاختبارات جزء من الدروس المتاحة في مسارات التعلّم، ولا توجد صفحة اختبارات مستقلة.',
      more: 'المزيد',
      preferences: 'التفضيلات',
      language: 'اللغة',
      appearance: 'المظهر',
      account: 'الحساب',
      challenges: 'التحديات',
      projects: 'المشاريع',
      comingSoon: 'قريبًا',
      bottomNavigation: 'التنقّل السريع',
    },
    auth: {
      eyebrow: 'Mabda / حساب المتعلم',
      fullName: 'الاسم الكامل',
      fullNamePlaceholder: 'اكتب اسمك الكامل',
      signInAction: 'تسجيل الدخول',
      createAccountAction: 'إنشاء حساب',
      loginTitle: 'مرحبًا بعودتك',
      loginBody: 'سجّل الدخول لمتابعة مسارات التعلّم والاحتفاظ بتقدمك على حسابك.',
      signupTitle: 'ابدأ رحلتك مع Mabda',
      signupBody: 'أنشئ حسابًا لحفظ تقدمك والعودة إلى الدروس من حيث توقفت.',
      forgotTitle: 'استعادة كلمة المرور',
      forgotBody: 'أدخل البريد المرتبط بحسابك وسنرسل رابطًا آمنًا لإعادة تعيين كلمة المرور.',
      resetTitle: 'اختر كلمة مرور جديدة',
      resetBody: 'اكتب كلمة مرور جديدة لحسابك ثم أكّدها.',
      callbackTitle: 'تأكيد حسابك',
      callbackBody: 'جارٍ التحقق من رابط Supabase واستعادة جلستك الآمنة…',
      callbackReady: 'تم التحقق. جارٍ فتح حسابك…',
      callbackFailed: 'لم نتمكن من التحقق من الرابط. قد يكون منتهيًا أو مستخدمًا من قبل.',
      gatewayLoading: 'جارٍ تجهيز بوابة Mabda الآمنة…',
      submitBusy: 'جارٍ المعالجة…',
      setupOnly: 'إعداد خدمة الحسابات غير مكتمل بعد.',
      confirmationBody: 'إذا كان البريد صالحًا، ستصلك رسالة من Supabase لتأكيد الحساب. افتح الرابط للمتابعة.',
      resetSentBody: 'إذا كان البريد مرتبطًا بحساب، ستصلك رسالة تتضمن رابط استعادة صالحًا لفترة محدودة.',
      passwordUpdated: 'تم تحديث كلمة المرور. يمكنك متابعة رحلتك في حسابك.',
      passwordResetMissingSession: 'افتح رابط الاستعادة الذي أرسله Supabase أولًا. إذا انتهت صلاحيته، اطلب رابطًا جديدًا.',
      validationName: 'اكتب اسمًا من حرفين على الأقل.',
      validationRequired: 'أكمل الحقول المطلوبة.',
      validationEmail: 'أدخل بريدًا إلكترونيًا صالحًا.',
      validationPassword: 'استخدم كلمة مرور من 8 أحرف على الأقل.',
      validationConfirm: 'كلمتا المرور غير متطابقتين.',
      errorCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
      errorUnconfirmed: 'أكّد بريدك الإلكتروني من الرسالة التي أرسلها Supabase أولًا.',
      errorExists: 'تعذر إنشاء الحساب بهذه البيانات. جرّب تسجيل الدخول أو استعادة كلمة المرور.',
      errorRateLimit: 'تم إرسال طلبات كثيرة. انتظر قليلًا ثم حاول مجددًا.',
      errorGeneric: 'تعذر إكمال الطلب. تحقق من البيانات وإعدادات Supabase ثم أعد المحاولة.',
      forgotLink: 'نسيت كلمة المرور؟',
      signupLink: 'أنشئ حسابًا',
      loginLink: 'تسجيل الدخول',
      resetLink: 'طلب رابط استعادة جديد',
    },
    intro: {
      preferencesLabel: 'تفضيلات العرض واللغة',
      tagline: 'كل بداية لها مبدأ.',
      secondaryTagline: 'حيث تنتهي البدايات العشوائية، يبدأ مبدأ.',
      next: 'التالي',
    },
    authVisual: {
      brandLine: 'Mabda — تدريب عملي على البرمجة للمبتدئين',
      title: 'من أول سطر، تبدأ قدرتك على البناء.',
      body: 'افهم الفكرة، جرّبها بنفسك، ثم استخدمها لحل مشكلة حقيقية.',
      codeLabel: 'كل مهارة تبدأ بخطوة',
      sequenceLabel: 'رحلة التعلّم في Mabda',
      steps: ['تعلّم', 'تدرّب', 'ابنِ', 'حلّ', 'تطوّر'],
    },
    dashboard: {
      eyebrow: 'Mabda / مساحة التعلم',
      title: 'أهلًا، {name}',
      lead: 'تابع مسارك الحالي، وارجع إلى آخر نقطة تعلمت منها.',
      pathsStarted: 'مسارات بدأتَها',
      pathsCompleted: 'مسارات مكتملة',
      lessonsCompleted: 'دروس مكتملة',
      latestQuiz: 'آخر نتيجة اختبار',
      noScore: 'لا توجد نتيجة بعد',
      continueTitle: 'واصل خطوة بخطوة',
      continueBody: 'المسار الحالي متاح للتعلم. تقدمك مرتبط بحسابك عند فتح الدروس وإكمال اختباراتها.',
      currentLesson: 'آخر درس فتحته',
      noCurrentLesson: 'لم تبدأ درسًا بعد.',
      nextRecommended: 'الدرس التالي المقترح',
      continueAction: 'متابعة التعلم',
      reviewAction: 'مراجعة الدروس',
      allComplete: 'أكملت دروس هذا المسار. يمكنك مراجعة أي درس في أي وقت.',
      pathProgress: 'اكتمل {completed} من {total}',
      currentPath: 'مسارك الحالي',
      pathNotStarted: 'لم تبدأ المسار بعد',
      pathInProgress: 'مسار قيد التعلّم',
      pathCompleted: 'اكتمل المسار',
      pathLessonCount: '{count} دروس متاحة',
      recentQuizResults: 'أحدث نتائج الاختبارات',
      noRecentQuizResults: 'ستظهر نتائجك هنا بعد إكمال اختبار أحد الدروس.',
      scorePercent: '{percent}٪',
      completed: 'مكتمل',
      started: 'بدأت هذا الدرس',
      notStarted: 'لم يبدأ بعد',
      accountDataNote: 'تعرض لوحة Mabda مسارات التعلّم النشطة وبيانات التقدم المحفوظة لحسابك فقط.',
      profileLink: 'عرض الملف الشخصي',
    },
    home: {
      heroEyebrow: 'مساحة تعلّمك',
      heroBody: 'ابدأ بأساسيات HTML، ثم تعلّم تنسيق الصفحات بـCSS وإضافة التفاعل بـJavaScript عبر دروس قصيرة وممارسة خطوة بخطوة.',
      heroAction: 'استكشف مسار HTML',
      firstLessonAction: 'ابدأ الدرس الأول',
      pathsTitle: 'مسارات التعلّم',
      pathsBody: 'اختر مسار HTML أو CSS أو JavaScript المتاح، واجمع في كل واحد بين الدروس القصيرة والتطبيق العملي.',
      htmlPathBody: 'تعلّم كيف تصف بنية الصفحة باستخدام عناصر HTML.',
      cssPathBody: 'تعلّم تنسيق واجهات الويب عبر المحددات والألوان والطباعة والتخطيط والتصميم المتجاوب في 8 دروس.',
      javascriptPathBody: 'أضف السلوك والتفاعل إلى صفحاتك عبر المتغيرات والشروط والدوال وDOM في 9 دروس.',
      loopTitle: 'من الفهم إلى التطبيق',
      loopSteps: ['تعلّم', 'افهم', 'تدرّب', 'طبّق'],
      practiceTitle: 'جرّب بنفسك',
      practiceBody: 'افتح Practice Studio داخل الدرس، واكتب الكود ثم راجع المعاينة والتشخيصات.',
      practiceAction: 'افتح Practice Studio',
      quizTitle: 'اختبارات قصيرة داخل الدروس',
      quizBody: 'تأتي الاختبارات بعد التعلّم والممارسة ضمن الدروس المتاحة، وليست مركزًا مستقلًا.',
      quizAction: 'افتح مسار HTML',
      quickActionsTitle: 'اختصارات',
      profileAction: 'الملف الشخصي',
      settingsAction: 'اللغة والمظهر',
      settingsBody: 'غيّر اللغة والوضع الفاتح أو الداكن من القائمة.',
      challengeAction: 'التحديات',
      projectAction: 'المشاريع',
      guestNote: 'يمكنك استكشاف الدروس، لكن التقدم والمسودات لا تُحفظ سحابيًا قبل تسجيل الدخول.',
    },
    profile: {
      eyebrow: 'Mabda / بيانات الحساب',
      title: 'ملفك الشخصي',
      lead: 'معلومات الحساب الأساسية المرتبطة بخدمة Supabase.',
      displayName: 'الاسم الظاهر',
      email: 'البريد الإلكتروني',
      joined: 'تاريخ إنشاء الحساب',
      currentLevel: 'المستوى الحالي',
      beginnerLevel: 'مبتدئ · أساسيات الويب',
      emailVerified: 'حالة البريد',
      verified: 'تم التأكيد',
      pending: 'بانتظار التأكيد',
      pathsStarted: 'المسارات التي بدأتها',
      pathsCompleted: 'المسارات المكتملة',
      lessonsCompleted: 'الدروس المكتملة',
      overallProgress: 'التقدم الكلي',
      pathProgress: 'تقدم المسار',
      quizResults: 'نتائج الاختبارات',
      noQuizResults: 'لا توجد نتائج اختبارات بعد. ستظهر هنا بعد إكمال اختبار درس.',
      futureAchievements: 'الإنجازات',
      futureAchievementsNote: 'الإنجازات والشارات جزء من رؤية Mabda المستقبلية، ولم تُنفّذ بعد.',
      backDashboard: 'العودة إلى لوحة الطالب',
    },
    progress: {
      lessonCount: '{completed} / {total} دروس مكتملة',
      savePrompt: 'سجّل الدخول لحفظ تقدمك والعودة إليه لاحقًا.',
      catalogNote: 'تُحفظ بيانات المسار والتقدم للحسابات المسجلة فقط.',
      pathNote: 'ما زال الدخول اختياريًا؛ لن يُحفظ التقدم إلا بعد تسجيل الدخول.',
      saveUnavailable: 'حفظ التقدم غير متاح حاليًا لأن إعداد Supabase لم يكتمل.',
    },
  },
  en: {
    common: {
      paths: 'Learning paths',
      home: 'Home',
      dataError: 'We could not load your progress. You can keep learning, but check the database connection.',
      serviceError: 'The account service could not be reached. Please try again shortly.',
      setupUnsafeKey: 'Unsafe configuration: never put a Supabase secret key in a browser app. Use a publishable key only.',
      setupInvalidKey: 'Unrecognized Supabase key. Use a publishable key or the legacy public anon key only.',
      setupInvalidUrl: 'The Supabase project URL is invalid. Check VITE_SUPABASE_URL.',
      setupMissing: 'Accounts are not configured yet. Add the Supabase URL and publishable key to environment variables to enable them.',
      signInToSave: 'Sign in to save your learning progress to your account.',
      backToLogin: 'Back to sign in',
      displayName: 'Display name',
      displayNamePlaceholder: 'How should we address you?',
      email: 'Email address',
      emailPlaceholder: 'name@example.com',
      password: 'Password',
      confirmPassword: 'Confirm password',
      minimumPassword: 'At least 8 characters.',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      signIn: 'Sign in',
      createAccount: 'Create account',
      sendReset: 'Send reset link',
      updatePassword: 'Update password',
      noAccount: 'Don\'t have an account?',
      haveAccount: 'Already have an account?',
      loading: 'Loading your account…',
      accountOnly: 'This progress is saved to your account through Supabase.',
      savingError: 'We could not save this progress. Check the database setup and try again.',
      loadErrorTitle: 'Your learning data could not be loaded.',
      loadErrorBody: 'We have not shown default progress as if it were saved. Check your connection and retry.',
      retry: 'Try again',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      saving: 'Saving…',
      displayNameHint: 'This name is used in your learning dashboard and profile only.',
      displayNameValidation: 'Enter a name between 2 and 80 characters.',
      displayNameUpdated: 'Your display name has been saved to your profile.',
      displayNameUpdateFailed: 'We could not update your name. Check your connection and retry.',
      savingProgress: 'Saving this lesson result to your account…',
      progressSaved: 'This lesson result is saved to your account.',
      progressSaveFailed: 'Your result is shown here, but we could not confirm it was saved to your account.',
      retryProgressSave: 'Save result again',
    },
    nav: {
      dashboard: 'Student dashboard',
      profile: 'Profile',
      logout: 'Sign out',
      signingOut: 'Signing out…',
      login: 'Sign in',
      signup: 'Create account',
    },
    appShell: {
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      menuTitle: 'Navigation and preferences',
      primaryNavigation: 'Primary navigation',
      learningPaths: 'Learning paths',
      practice: 'Practice',
      quizzes: 'Quizzes',
      quizNote: 'Quizzes are built into lessons across the active learning paths; there is no standalone quiz page.',
      more: 'More',
      preferences: 'Preferences',
      language: 'Language',
      appearance: 'Appearance',
      account: 'Account',
      challenges: 'Challenges',
      projects: 'Projects',
      comingSoon: 'Coming soon',
      bottomNavigation: 'Quick navigation',
    },
    auth: {
      eyebrow: 'Mabda / Learner account',
      fullName: 'Full name',
      fullNamePlaceholder: 'Enter your full name',
      signInAction: 'Sign in',
      createAccountAction: 'Create account',
      loginTitle: 'Welcome back',
      loginBody: 'Sign in to continue your learning paths and keep your progress on your account.',
      signupTitle: 'Start your Mabda journey',
      signupBody: 'Create an account to save your progress and return to your lessons where you left off.',
      forgotTitle: 'Reset your password',
      forgotBody: 'Enter the email for your account and we will send a secure password-reset link.',
      resetTitle: 'Choose a new password',
      resetBody: 'Enter and confirm a new password for your account.',
      callbackTitle: 'Confirm your account',
      callbackBody: 'Verifying your Supabase link and restoring your secure session…',
      callbackReady: 'Verified. Opening your account…',
      callbackFailed: 'We could not verify this link. It may have expired or already been used.',
      gatewayLoading: 'Preparing your secure Mabda gateway…',
      submitBusy: 'Working…',
      setupOnly: 'Account service setup is not complete yet.',
      confirmationBody: 'If this email can be registered, Supabase will send a confirmation message. Open its link to continue.',
      resetSentBody: 'If this email belongs to an account, Supabase will send a password-reset link that expires after a limited time.',
      passwordUpdated: 'Your password has been updated. You can continue your learning journey.',
      passwordResetMissingSession: 'Open the password-reset link sent by Supabase first. If it expired, request a new link.',
      validationName: 'Enter a name with at least two characters.',
      validationRequired: 'Complete all required fields.',
      validationEmail: 'Enter a valid email address.',
      validationPassword: 'Use a password with at least eight characters.',
      validationConfirm: 'The passwords do not match.',
      errorCredentials: 'The email or password is incorrect.',
      errorUnconfirmed: 'Confirm your email using the message from Supabase first.',
      errorExists: 'We could not create an account with these details. Try signing in or resetting your password.',
      errorRateLimit: 'Too many requests were sent. Wait a little and try again.',
      errorGeneric: 'We could not complete the request. Check the details and Supabase setup, then try again.',
      forgotLink: 'Forgot password?',
      signupLink: 'Create one',
      loginLink: 'Sign in',
      resetLink: 'Request a new reset link',
    },
    intro: {
      preferencesLabel: 'Display and language preferences',
      tagline: 'Every beginning needs a foundation.',
      secondaryTagline: 'Where random beginnings end, Mabda begins.',
      next: 'Next',
    },
    authVisual: {
      brandLine: 'Mabda — Coding Practice for Beginners',
      title: 'Your first line can lead somewhere real.',
      body: 'Understand the idea, try it yourself, then use it to solve a real problem.',
      codeLabel: 'Every skill starts somewhere',
      sequenceLabel: 'The Mabda learning journey',
      steps: ['Learn', 'Practice', 'Build', 'Solve', 'Improve'],
    },
    dashboard: {
      eyebrow: 'Mabda / Learning space',
      title: 'Welcome, {name}',
      lead: 'Pick up your current path and return to the last lesson you opened.',
      pathsStarted: 'Paths started',
      pathsCompleted: 'Paths completed',
      lessonsCompleted: 'Lessons completed',
      latestQuiz: 'Latest quiz score',
      noScore: 'No score yet',
      continueTitle: 'Keep moving forward',
      continueBody: 'The current path is available to learn. Your account records progress when you open lessons and complete their quizzes.',
      currentLesson: 'Last lesson opened',
      noCurrentLesson: 'You have not started a lesson yet.',
      nextRecommended: 'Next recommended lesson',
      continueAction: 'Continue learning',
      reviewAction: 'Review lessons',
      allComplete: 'You have completed the lessons in this path. You can revisit any lesson at any time.',
      pathProgress: '{completed} of {total} complete',
      currentPath: 'Your current path',
      pathNotStarted: 'Not started yet',
      pathInProgress: 'In progress',
      pathCompleted: 'Path completed',
      pathLessonCount: '{count} lessons available',
      recentQuizResults: 'Recent quiz results',
      noRecentQuizResults: 'Your results will appear here after you complete a lesson quiz.',
      scorePercent: '{percent}%',
      completed: 'Completed',
      started: 'Started',
      notStarted: 'Not started',
      accountDataNote: 'Your Mabda dashboard summarizes active learning paths and progress saved to your account only.',
      profileLink: 'View profile',
    },
    home: {
      heroEyebrow: 'Your learning space',
      heroBody: 'Start with HTML, then style pages with CSS and add interaction with JavaScript through short lessons and practice.',
      heroAction: 'Explore the HTML path',
      firstLessonAction: 'Start the first lesson',
      pathsTitle: 'Learning paths',
      pathsBody: 'Choose an active HTML, CSS, or JavaScript path. Each combines short lessons with hands-on practice.',
      htmlPathBody: 'Learn how to describe page structure with HTML elements.',
      cssPathBody: 'Learn to style web interfaces through selectors, color, typography, layout, and responsive design in 8 lessons.',
      javascriptPathBody: 'Add behavior and interaction with variables, conditions, functions, and the DOM across 9 lessons.',
      loopTitle: 'From understanding to application',
      loopSteps: ['Learn', 'Understand', 'Practice', 'Apply'],
      practiceTitle: 'Try it yourself',
      practiceBody: 'Open the Practice Studio inside the lesson, write code, then review the preview and diagnostics.',
      practiceAction: 'Open Practice Studio',
      quizTitle: 'Short quizzes inside lessons',
      quizBody: 'Quizzes follow learning and practice within available lessons; they are not a separate center.',
      quizAction: 'Open HTML path',
      quickActionsTitle: 'Quick actions',
      profileAction: 'Profile',
      settingsAction: 'Language and appearance',
      settingsBody: 'Change the language and light or dark theme from the menu.',
      challengeAction: 'Challenges',
      projectAction: 'Projects',
      guestNote: 'You can explore lessons, but progress and drafts are not saved to the cloud until you sign in.',
    },
    profile: {
      eyebrow: 'Mabda / Account details',
      title: 'Your profile',
      lead: 'Basic account information connected to Supabase Auth.',
      displayName: 'Display name',
      email: 'Email address',
      joined: 'Account created',
      currentLevel: 'Current learning level',
      beginnerLevel: 'Beginner · Web fundamentals',
      emailVerified: 'Email status',
      verified: 'Confirmed',
      pending: 'Confirmation pending',
      pathsStarted: 'Paths started',
      pathsCompleted: 'Paths completed',
      lessonsCompleted: 'Lessons completed',
      overallProgress: 'Overall progress',
      pathProgress: 'Path progress',
      quizResults: 'Quiz results',
      noQuizResults: 'No quiz results yet. They will appear here after you complete a lesson quiz.',
      futureAchievements: 'Achievements',
      futureAchievementsNote: 'Achievements and badges are part of the future Mabda vision and are not implemented yet.',
      backDashboard: 'Back to dashboard',
    },
    progress: {
      lessonCount: '{completed} / {total} lessons complete',
      savePrompt: 'Sign in to save your progress and return to it later.',
      catalogNote: 'Path and progress data are saved for signed-in accounts only.',
      pathNote: 'Sign-in is still optional; progress will only be saved after you sign in.',
      saveUnavailable: 'Progress saving is currently unavailable because Supabase is not configured.',
    },
  },
};

export function getStudentPortalCopy(locale: Locale): StudentPortalMessages {
  return portal[locale];
}
