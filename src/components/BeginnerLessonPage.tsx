import { useMemo, useState } from 'react';
import { FOUNDATION_LESSON_IDS, getBeginnerCourseHref, getBeginnerLessonHref, type FoundationLessonId, type FoundationPathId } from '../content/learningSystem';
import { getBeginnerLesson, getBeginnerLessons, getPersistedBeginnerLessonIds } from '../content/beginnerCurriculum';
import { messages, type Locale } from '../i18n/messages';
import { getLearningLevelsCopy } from '../i18n/learningLevels';
import { useStudentProgress } from '../state/StudentProgressProvider';
import { getBeginnerLessonAccess, getSessionBeginnerProgress, recordSessionExerciseComplete, recordSessionLessonComplete } from '../utils/sessionBeginnerProgress';
import { createQuizChoiceOrder } from '../utils/quizChoices';
import LearningHeader from './LearningHeader';
import LearningLesson from './LearningLesson';
import StartLesson from './StartLesson';

function BeginnerLessonPage({ pathId, lessonId, locale, onSwitchLocale }: { pathId: FoundationPathId; lessonId: string; locale: Locale; onSwitchLocale: () => void }) {
  const arabic = locale === 'ar';
  const levels = getLearningLevelsCopy(locale);
  const copy = messages[locale].learningSystem;
  const studentProgress = useStudentProgress();
  const lessons = getBeginnerLessons(pathId);
  const lesson = getBeginnerLesson(pathId, lessonId);
  const index = lessons.findIndex((item) => item.id === lessonId);
  const [session, setSession] = useState(getSessionBeginnerProgress);
  const persistedCompleted = useMemo(
    () => getPersistedBeginnerLessonIds(lessons, new Set(studentProgress.lessons.filter((row) => row.completed_at).map((row) => row.lesson_id))),
    [lessons, studentProgress.lessons],
  );

  if (!lesson || index < 0) {
    return (
      <div className={`app-shell learning-system-page beginner-lesson-page ${arabic ? 'is-arabic' : 'is-english'}`}>
        <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={copy.ui.allPaths} stageLabel={levels.beginner} />
        <main className="learning-system-main section-frame"><p role="alert">{levels.pathNotFound}</p><a className="button button-primary" href={getBeginnerCourseHref(pathId)}>{levels.backToLevels}</a></main>
      </div>
    );
  }

  const access = getBeginnerLessonAccess(pathId, lessons.map((item) => item.id), lesson.id, persistedCompleted, session);
  if (access === 'locked') {
    return (
      <div className={`app-shell learning-system-page beginner-lesson-page ${arabic ? 'is-arabic' : 'is-english'}`}>
        <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={copy.ui.allPaths} stageLabel={levels.beginner} />
        <main className="learning-system-main section-frame"><section className="beginner-lesson-locked"><h1>{arabic ? 'هذا الدرس مقفل حاليًا' : 'This lesson is currently locked'}</h1><p>{arabic ? 'أكمل الاختبار القصير في الدرس السابق لفتح هذا الدرس، أو ارجع إلى قائمة الدورة.' : 'Pass the short quiz in the previous lesson to unlock this one, or return to the course list.'}</p><a className="button button-primary" href={getBeginnerCourseHref(pathId)}>{levels.backToLevels}</a></section></main>
      </div>
    );
  }

  const previousHref = index > 0 ? getBeginnerLessonHref(pathId, lessons[index - 1].id) : null;
  const nextHref = index < lessons.length - 1 ? getBeginnerLessonHref(pathId, lessons[index + 1].id) : null;

  if (lesson.existingLessonId && FOUNDATION_LESSON_IDS.includes(lesson.existingLessonId as FoundationLessonId)) {
    const existingId = lesson.existingLessonId as FoundationLessonId;
    const navigation = { backHref: getBeginnerCourseHref(pathId), nextHref: nextHref ?? getBeginnerCourseHref(pathId), previousHref };
    const onQuizPassed = () => {
      recordSessionLessonComplete(pathId, lesson.id);
      setSession(getSessionBeginnerProgress());
    };
    if (existingId === 'html-introduction') {
      return <StartLesson locale={locale} onSwitchLocale={onSwitchLocale} onComplete={(score, total) => studentProgress.completeLessonQuiz('html-introduction', score, total)} onQuizPassed={onQuizPassed} navigation={{ backHref: navigation.backHref, nextHref: navigation.nextHref }} />;
    }
    return (
      <LearningLesson
        lessonId={existingId as Exclude<FoundationLessonId, 'html-introduction'>}
        locale={locale}
        onSwitchLocale={onSwitchLocale}
        onComplete={(score, total) => studentProgress.completeLessonQuiz(existingId, score, total)}
        onQuizPassed={onQuizPassed}
        navigation={navigation}
      />
    );
  }

  if (!lesson.newContent) {
    return <main className="app-shell learning-system-page section-frame"><p role="alert">{levels.pathNotFound}</p><a href={getBeginnerCourseHref(pathId)}>{levels.backToLevels}</a></main>;
  }

  return (
    <NewBeginnerLesson
      pathId={pathId}
      lesson={lesson}
      index={index}
      total={lessons.length}
      locale={locale}
      onSwitchLocale={onSwitchLocale}
      session={session}
      onSessionUpdate={setSession}
      access={access}
    />
  );
}

type NewBeginnerLessonProps = {
  pathId: FoundationPathId;
  lesson: NonNullable<ReturnType<typeof getBeginnerLesson>>;
  index: number;
  total: number;
  locale: Locale;
  onSwitchLocale: () => void;
  session: ReturnType<typeof getSessionBeginnerProgress>;
  onSessionUpdate: (progress: ReturnType<typeof getSessionBeginnerProgress>) => void;
  access: ReturnType<typeof getBeginnerLessonAccess>;
};

function NewBeginnerLesson({ pathId, lesson, index, total, locale, onSwitchLocale, session, onSessionUpdate, access }: NewBeginnerLessonProps) {
  const arabic = locale === 'ar';
  const levels = getLearningLevelsCopy(locale);
  const copy = messages[locale].learningSystem;
  const content = lesson.newContent!;
  const [stepIndex, setStepIndex] = useState(0);
  const [exerciseDone, setExerciseDone] = useState(session.completedExerciseIds[pathId]?.includes(lesson.id) ?? false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [passed, setPassed] = useState(session.completedLessonIds[pathId]?.includes(lesson.id) ?? false);
  const [storageError, setStorageError] = useState(false);
  const [choiceOrder] = useState(() => createQuizChoiceOrder([{
    id: `${lesson.id}-quiz`,
    choices: content.quiz.choices.map(({ id }) => ({ id })),
    correctChoiceId: content.quiz.correctChoiceId,
  }])[`${lesson.id}-quiz`]);
  const orderedChoices = useMemo(() => {
    const byId = new Map(content.quiz.choices.map((choice) => [choice.id, choice]));
    return (choiceOrder ?? content.quiz.choices.map((choice) => choice.id)).map((id) => byId.get(id)).filter((choice): choice is typeof content.quiz.choices[number] => Boolean(choice));
  }, [choiceOrder, content.quiz.choices]);
  const step = content.steps[stepIndex];
  const title = arabic ? lesson.titleAr : lesson.titleEn;
  const bodyFor = (stepIndex: number) => arabic ? content.steps[stepIndex].bodyAr : content.steps[stepIndex].bodyEn;
  const nextHref = index < total - 1 ? getBeginnerLessonHref(pathId, getBeginnerLessons(pathId)[index + 1].id) : null;

  const completeExercise = () => {
    const saved = recordSessionExerciseComplete(pathId, lesson.id);
    setStorageError(!saved);
    if (saved) {
      setExerciseDone(true);
      onSessionUpdate(getSessionBeginnerProgress());
    }
  };
  const completeLesson = () => {
    const saved = recordSessionLessonComplete(pathId, lesson.id);
    setStorageError(!saved);
    if (saved) {
      setPassed(true);
      onSessionUpdate(getSessionBeginnerProgress());
    }
  };

  return (
    <div className={`app-shell learning-system-page beginner-lesson-page ${arabic ? 'is-arabic' : 'is-english'}`}>
      <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={copy.ui.allPaths} stageLabel={`${levels.beginner} · ${lesson.sequence}`} />
      <main className="learning-system-main section-frame">
        <nav className="learning-breadcrumb" aria-label={arabic ? 'مسار التنقل' : 'Breadcrumb'}><a href={getBeginnerCourseHref(pathId)}>{levels.beginner}</a><span aria-hidden="true">/</span><span aria-current="page">{title}</span></nav>
        <header className="learning-system-intro beginner-lesson-intro">
          <p className="eyebrow"><span className="eyebrow-line" />{arabic ? 'الدرس' : 'Lesson'} {new Intl.NumberFormat(arabic ? 'ar' : 'en-US').format(index + 1)} / {new Intl.NumberFormat(arabic ? 'ar' : 'en-US').format(total)}{access === 'review' ? ` · ${arabic ? 'مراجعة' : 'Review'}` : ''}</p>
          <h1>{title}</h1>
          <p className="learning-system-lead">{arabic ? lesson.objectiveAr : lesson.objectiveEn}</p>
          <p className="student-progress-notice">{levels.temporaryBody}</p>
        </header>

        {!passed && (
          <>
            <section className="beginner-learning-step" aria-labelledby="beginner-step-title">
              <div className="beginner-step-top"><span dir="ltr">{String(stepIndex + 1).padStart(2, '0')}</span><span>{arabic ? 'شرح الدرس' : 'Lesson explanation'}</span></div>
              <h2 id="beginner-step-title">{arabic ? step.titleAr : step.titleEn}</h2>
              <p>{bodyFor(stepIndex)}</p>
              {step.examples.map((example, exampleIndex) => (
                <figure className="beginner-example" key={`${step.titleEn}-${exampleIndex}`}>
                  <pre dir="ltr"><code>{example.code}</code></pre>
                  <figcaption>{arabic ? example.explanationAr : example.explanationEn}</figcaption>
                </figure>
              ))}
              <div className="beginner-lesson-controls">
                <button className="button button-secondary" type="button" disabled={stepIndex === 0} onClick={() => setStepIndex((current) => Math.max(0, current - 1))}>{arabic ? 'السابق' : 'Previous'}</button>
                <button className="button button-primary" type="button" disabled={stepIndex >= content.steps.length - 1} onClick={() => setStepIndex((current) => Math.min(content.steps.length - 1, current + 1))}>{arabic ? 'التالي' : 'Next'}</button>
              </div>
            </section>

            <section className="beginner-exercise" aria-labelledby="beginner-exercise-title">
              <p className="eyebrow"><span className="eyebrow-line" />{arabic ? 'تطبيق عملي' : 'Practical exercise'}</p>
              <h2 id="beginner-exercise-title">{arabic ? 'جرّب بنفسك' : 'Try it yourself'}</h2>
              <p>{arabic ? content.exerciseAr : content.exerciseEn}</p>
              <label className="beginner-exercise-confirm"><input type="checkbox" checked={exerciseDone} onChange={completeExercise} /><span>{arabic ? 'حاولت تنفيذ التطبيق أو كتابة خطواته.' : 'I tried the exercise or wrote down my implementation steps.'}</span></label>
              {storageError && <p role="alert" className="student-form-error">{arabic ? 'تعذر حفظ الحالة في جلسة هذا التبويب. أعد المحاولة.' : 'Could not save this tab-session state. Please try again.'}</p>}
              <p className="beginner-exercise-note">{arabic ? 'هذا إقرار ذاتي بالتجربة وليس فحصًا آليًا للكود.' : 'This is a self-check, not automated code validation.'}</p>
            </section>

            <section className="beginner-quiz" aria-labelledby="beginner-quiz-title">
              <h2 id="beginner-quiz-title">{arabic ? 'تحقق من الفهم' : 'Check your understanding'}</h2>
              <p>{arabic ? 'أكمل الخطوات السابقة وحاول التطبيق قبل بدء السؤال.' : 'Finish the steps and try the exercise before starting the question.'}</p>
              {!quizStarted ? <button className="button button-primary" type="button" disabled={!exerciseDone || stepIndex < content.steps.length - 1} onClick={() => { setSelectedChoiceId(null); setQuizStarted(true); }}>{arabic ? 'ابدأ سؤال الدرس' : 'Start lesson question'}</button> : (
                <>
                  <h3>{arabic ? content.quiz.promptAr : content.quiz.promptEn}</h3>
                  <div className="learning-question-options" role="group" aria-label={arabic ? content.quiz.promptAr : content.quiz.promptEn}>
                    {orderedChoices.map((choice) => <button className={`learning-choice${selectedChoiceId === choice.id ? (choice.id === content.quiz.correctChoiceId ? ' is-correct' : ' is-incorrect') : ''}`} key={choice.id} type="button" disabled={selectedChoiceId !== null} aria-pressed={selectedChoiceId === choice.id} onClick={() => setSelectedChoiceId(choice.id)}><span>{arabic ? choice.ar : choice.en}</span></button>)}
                  </div>
                  {selectedChoiceId && <div className={`learning-quiz-feedback${selectedChoiceId === content.quiz.correctChoiceId ? ' is-correct' : ' is-incorrect'}`} role="status" aria-live="polite"><strong>{selectedChoiceId === content.quiz.correctChoiceId ? (arabic ? 'إجابة صحيحة' : 'Correct') : (arabic ? 'حاول مرة أخرى' : 'Try again')}</strong><p>{selectedChoiceId === content.quiz.correctChoiceId ? (arabic ? content.quiz.correctFeedbackAr : content.quiz.correctFeedbackEn) : (arabic ? content.quiz.incorrectFeedbackAr : content.quiz.incorrectFeedbackEn)}</p></div>}
                  {selectedChoiceId && selectedChoiceId !== content.quiz.correctChoiceId && <button className="button button-secondary" type="button" onClick={() => setSelectedChoiceId(null)}>{arabic ? 'أعد المحاولة' : 'Try again'}</button>}
                  {selectedChoiceId === content.quiz.correctChoiceId && <button className="button button-primary" type="button" onClick={completeLesson}>{arabic ? 'اجتزت الدرس وافتح التالي' : 'Pass lesson and unlock next'}</button>}
                </>
              )}
            </section>
          </>
        )}

        {passed && <div className="beginner-lesson-passed" role="status"><strong>{arabic ? 'تم حفظ اجتياز الدرس في جلسة هذا التبويب.' : 'Lesson completion saved for this tab session.'}</strong><p>{arabic ? content.quiz.reviewAr : content.quiz.reviewEn}</p><a className="button button-primary" href={nextHref ?? getBeginnerCourseHref(pathId)}>{nextHref ? (arabic ? 'الدرس التالي' : 'Next lesson') : (arabic ? 'العودة إلى الدورة' : 'Return to course')}</a></div>}

        <aside className="beginner-mistakes"><h2>{arabic ? 'أخطاء شائعة انتبه لها' : 'Common mistakes to watch for'}</h2><ul>{(arabic ? lesson.commonMistakesAr : lesson.commonMistakesEn).map((item) => <li key={item}>{item}</li>)}</ul></aside>
      </main>
    </div>
  );
}

export default BeginnerLessonPage;
