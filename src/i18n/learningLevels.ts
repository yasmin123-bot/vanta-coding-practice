import type { Locale } from './messages';

export type LearningLevelsCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  available: string;
  locked: string;
  lessonsCount: string;
  startBeginner: string;
  placementTitle: string;
  optional: string;
  placementBody: string;
  placementRule: string;
  placementLimit: string;
  takePlacement: string;
  skipPlacement: string;
  recommendation: string;
  sessionSaveError: string;
  sessionSaved: string;
  openCourse: string;
  openCourseFromStart: string;
  assessmentTitle: string;
  assessmentIntro: string;
  assessmentLocked: string;
  assessmentPass: string;
  assessmentFail: string;
  assessmentScoreUnavailable: string;
  assessmentRetry: string;
  projectLocked: string;
  projectChecklistTitle: string;
  projectSelfCheck: string;
  projectSaved: string;
  unlockTitle: string;
  unlockItems: string[];
  temporaryTitle: string;
  temporaryBody: string;
  choosePath: string;
  backToLevels: string;
  pathNotFound: string;
};

const copies: Record<Locale, LearningLevelsCopy> = {
  ar: {
    eyebrow: 'Mabda / مستويات التعلّم',
    title: 'ابدأ من المستوى المناسب لك',
    lead: 'اختر مادة، ثم ابدأ من الأساسيات أو خذ اختبارًا تشخيصيًا اختياريًا يقترح نقطة بداية بناءً على مجموعة مهارات متدرجة.',
    beginner: 'المبتدئ',
    intermediate: 'المتوسط',
    advanced: 'المتقدم',
    available: 'متاح الآن',
    locked: 'غير متاح بعد',
    lessonsCount: '{count} درسًا',
    startBeginner: 'استعرض مستوى المبتدئ',
    placementTitle: 'اختبار تحديد مستوى اختياري',
    optional: 'اختياري',
    placementBody: 'يساعدك على اختيار نقطة بداية مناسبة؛ لا يستبدل اختبارات الدروس، ويمكنك تخطيه والبدء من الدرس الأول.',
    placementRule: 'يتقدم الاختبار من نطاق إلى التالي فقط عند الإجابة عن السؤالين معًا بشكل صحيح. لا يمكن لنتيجة أعلى تجاوز فجوة في مهارة سابقة.',
    placementLimit: 'هذا اقتراح تعليمي محدود وليس شهادة إتقان. يمكنك مراجعة الدروس السابقة في أي وقت، وسيظل اختبار كل درس مطلوبًا.',
    takePlacement: 'ابدأ الاختبار التشخيصي',
    skipPlacement: 'تخطَّ الاختبار وابدأ من الأول',
    recommendation: 'نقطة البداية المقترحة',
    sessionSaveError: 'تعذر حفظ نقطة البداية في جلسة هذا التبويب. أعد المحاولة أو ابدأ من الدرس الأول.',
    sessionSaved: 'تم حفظ نقطة البداية لهذا التبويب فقط.',
    openCourse: 'افتح الدورة من النقطة المقترحة',
    openCourseFromStart: 'ابدأ الدورة من الدرس الأول',
    assessmentTitle: 'التقييم الختامي للمبتدئ',
    assessmentIntro: 'أجب عن أسئلة متنوعة من نطاقات المنهج. تحتاج إلى 80٪ على الأقل للنجاح. يمكنك إعادة المحاولة؛ هذا التقييم لا يغيّر اختبارات الدروس.',
    assessmentLocked: 'أكمل جميع الدروس المطلوبة قبل فتح التقييم الختامي.',
    assessmentPass: 'اجتزت التقييم الختامي. يمكنك الانتقال إلى المشروع العملي.',
    assessmentFail: 'لم تصل إلى درجة النجاح بعد. راجع الموضوعات المرتبطة وحاول مرة أخرى.',
    assessmentScoreUnavailable: 'اجتزت التقييم سابقًا، لكن بيانات الجلسة القديمة لا تحتوي على درجته.',
    assessmentRetry: 'أعد التقييم',
    projectLocked: 'أكمل الدروس المطلوبة واجتز التقييم الختامي قبل فتح المشروع.',
    projectChecklistTitle: 'معايير التسليم',
    projectSelfCheck: 'تقييم ذاتي: تأشير المتطلبات لا يفحص ملفاتك أو كودك تلقائيًا.',
    projectSaved: 'حُفظ إكمال المشروع في جلسة هذا التبويب فقط.',
    unlockTitle: 'ما المطلوب لفتح المستوى التالي؟',
    unlockItems: [
      'إكمال دروس المستوى واجتياز اختبار كل درس.',
      'اجتياز التقييم الختامي للمستوى.',
      'إنجاز المشروع العملي النهائي وفق متطلباته.',
    ],
    temporaryTitle: 'ملاحظة عن حفظ التقدم',
    temporaryBody: 'تقدم مستويات المبتدئ الجديدة يُحفظ مؤقتًا في جلسة هذا التبويب فقط. لا يُرفع إلى حسابك أو Supabase، وقد يختفي عند إغلاق التبويب.',
    choosePath: 'اختر مادة',
    backToLevels: 'العودة إلى المستويات',
    pathNotFound: 'المسار غير متاح.',
  },
  en: {
    eyebrow: 'Mabda / Learning levels',
    title: 'Start at the level that fits you',
    lead: 'Choose a subject, then begin with the fundamentals or take an optional diagnostic that recommends a starting point from a sequence of skills.',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    available: 'Available now',
    locked: 'Not available yet',
    lessonsCount: '{count} lessons',
    startBeginner: 'Explore Beginner',
    placementTitle: 'Optional placement check',
    optional: 'Optional',
    placementBody: 'It helps recommend a starting point; it does not replace lesson quizzes, and you can skip it to begin at lesson one.',
    placementRule: 'The check advances to the next band only when both questions are correct. A later result cannot skip a gap in an earlier skill.',
    placementLimit: 'This is a limited learning suggestion, not a mastery certificate. You may review earlier lessons at any time, and every lesson quiz still applies.',
    takePlacement: 'Take the diagnostic',
    skipPlacement: 'Skip and start from lesson one',
    recommendation: 'Recommended starting point',
    sessionSaveError: 'Could not save the starting point for this tab session. Try again or begin at lesson one.',
    sessionSaved: 'The starting point is saved for this tab only.',
    openCourse: 'Open the course at the recommendation',
    openCourseFromStart: 'Start the course at lesson one',
    assessmentTitle: 'Beginner final assessment',
    assessmentIntro: 'Answer questions sampled across the curriculum. You need at least 80% to pass. You may retry; this assessment does not replace lesson quizzes.',
    assessmentLocked: 'Complete all required lessons before opening the final assessment.',
    assessmentPass: 'You passed the final assessment. You can continue to the practical project.',
    assessmentFail: 'You have not reached the passing score yet. Review the related topics and try again.',
    assessmentScoreUnavailable: 'You passed earlier, but this saved session does not include the score.',
    assessmentRetry: 'Retry assessment',
    projectLocked: 'Complete the required lessons and pass the final assessment before opening the project.',
    projectChecklistTitle: 'Submission criteria',
    projectSelfCheck: 'Self-assessment: checking these items does not automatically inspect your files or code.',
    projectSaved: 'Project completion is saved for this tab session only.',
    unlockTitle: 'What unlocks the next level?',
    unlockItems: [
      'Complete the level’s lessons and pass each lesson quiz.',
      'Pass the level’s final assessment.',
      'Complete the practical capstone project requirements.',
    ],
    temporaryTitle: 'Progress-saving note',
    temporaryBody: 'Progress for the new Beginner levels is stored temporarily in this tab’s session only. It is not uploaded to your account or Supabase and may disappear when the tab closes.',
    choosePath: 'Choose a subject',
    backToLevels: 'Back to levels',
    pathNotFound: 'This learning path is not available.',
  },
};

export function getLearningLevelsCopy(locale: Locale): LearningLevelsCopy {
  return copies[locale];
}
