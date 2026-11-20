import { useMemo, useState } from 'react';
import { getBeginnerCourseHref, getBeginnerProjectHref, getLearningLevelsHref, type FoundationPathId } from '../content/learningSystem';
import { getBeginnerLessons, getPersistedBeginnerLessonIds } from '../content/beginnerCurriculum';
import { type Locale } from '../i18n/messages';
import { getLearningLevelsCopy } from '../i18n/learningLevels';
import { useStudentProgress } from '../state/StudentProgressProvider';
import { createQuizChoiceOrder, getOrderedQuizChoices } from '../utils/quizChoices';
import {
  BEGINNER_ASSESSMENT_QUESTION_COUNT,
  getSessionBeginnerProgress,
  recordSessionAssessmentPassed,
} from '../utils/sessionBeginnerProgress';
import LearningHeader from './LearningHeader';

type AssessmentQuestion = {
  id: string;
  prompt: string;
  choices: Array<{ id: string; label: string }>;
  correctChoiceId: string;
  feedback: string;
};

function makeQuestions(pathId: FoundationPathId, locale: Locale): AssessmentQuestion[] {
  const newLessons = getBeginnerLessons(pathId).filter((lesson) => lesson.newContent);
  const sampleCount = BEGINNER_ASSESSMENT_QUESTION_COUNT;
  return Array.from({ length: sampleCount }, (_, index) => {
    const lessonIndex = Math.min(newLessons.length - 1, Math.floor(((index + 0.5) * newLessons.length) / sampleCount));
    const lesson = newLessons[lessonIndex];
    const quiz = lesson.newContent!.quiz;
    return {
      id: `final-${pathId}-${lesson.id}`,
      prompt: locale === 'ar' ? quiz.promptAr : quiz.promptEn,
      choices: quiz.choices.map((choice) => ({ id: choice.id, label: locale === 'ar' ? choice.ar : choice.en })),
      correctChoiceId: quiz.correctChoiceId,
      feedback: locale === 'ar' ? quiz.correctFeedbackAr : quiz.correctFeedbackEn,
    };
  });
}

function BeginnerAssessmentPage({ pathId, locale, onSwitchLocale }: { pathId: FoundationPathId; locale: Locale; onSwitchLocale: () => void }) {
  const arabic = locale === 'ar';
  const copy = getLearningLevelsCopy(locale);
  const lessons = getBeginnerLessons(pathId);
  const session = getSessionBeginnerProgress();
  const studentProgress = useStudentProgress();
  const persistedCompleted = getPersistedBeginnerLessonIds(
    lessons,
    new Set(studentProgress.lessons.filter((row) => row.completed_at).map((row) => row.lesson_id)),
  );
  const requiredLessons = lessons.slice(session.placementStartIndex[pathId] ?? 0);
  const courseComplete = requiredLessons.every((lesson) => session.completedLessonIds[pathId]?.includes(lesson.id) || persistedCompleted.has(lesson.id));
  const questions = useMemo(() => makeQuestions(pathId, locale), [pathId, locale]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [passed, setPassed] = useState(session.assessmentPassed.includes(pathId));
  const [passedScore, setPassedScore] = useState<number | undefined>(session.assessmentScores[pathId]);
  const [saveError, setSaveError] = useState(false);
  const [choiceOrder, setChoiceOrder] = useState(() => createQuizChoiceOrder(questions));
  const question = questions[questionIndex];
  const orderedChoices = question ? getOrderedQuizChoices(question.choices, choiceOrder[question.id]) : [];
  const score = questions.reduce((sum, item) => sum + (answers[item.id] === item.correctChoiceId ? 1 : 0), 0);
  const formatNumber = (value: number) => new Intl.NumberFormat(arabic ? 'ar' : 'en-US').format(value);

  const finishAssessment = () => {
    const finalScore = score;
    const passedAttempt = finalScore >= Math.ceil(questions.length * 0.8);
    setCompleted(true);
    if (passedAttempt) {
      const saved = recordSessionAssessmentPassed(pathId, finalScore);
      setSaveError(!saved);
      setPassed(saved);
      if (saved) setPassedScore(finalScore);
    }
  };

  const submitAnswer = (choiceId: string) => {
    setAnswers((current) => ({ ...current, [question.id]: choiceId }));
  };

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) finishAssessment();
    else setQuestionIndex((current) => current + 1);
  };

  const retryAssessment = () => {
    setQuestionIndex(0);
    setAnswers({});
    setCompleted(false);
    setPassed(false);
    setPassedScore(undefined);
    setSaveError(false);
    setChoiceOrder(createQuizChoiceOrder(questions));
  };

  return (
    <div className={`app-shell learning-system-page beginner-assessment-page ${arabic ? 'is-arabic' : 'is-english'}`}>
      <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={copy.backToLevels} stageLabel={`${copy.beginner} · ${copy.assessmentTitle}`} />
      <main className="learning-system-main section-frame">
        <nav className="learning-breadcrumb" aria-label={arabic ? 'مسار التنقل' : 'Breadcrumb'}><a href={getLearningLevelsHref()}>{copy.backToLevels}</a><span aria-hidden="true">/</span><a href={getBeginnerCourseHref(pathId)}>{copy.beginner}</a><span aria-hidden="true">/</span><span aria-current="page">{copy.assessmentTitle}</span></nav>
        <header className="learning-system-intro beginner-assessment-intro"><p className="eyebrow"><span className="eyebrow-line" />{arabic ? 'تقييم ختامي' : 'Final assessment'}</p><h1>{copy.assessmentTitle}</h1><p className="learning-system-lead">{copy.assessmentIntro}</p><p className="beginner-placement-safety">{copy.temporaryBody}</p></header>

        {!courseComplete ? (
          <section className="beginner-lesson-locked"><h2>{copy.assessmentLocked}</h2><a className="button button-primary" href={getBeginnerCourseHref(pathId)}>{copy.openCourseFromStart}</a></section>
        ) : passed ? (
          <section className="beginner-assessment-result" role="status"><h2>{copy.assessmentPass}</h2>{passedScore === undefined ? <p>{copy.assessmentScoreUnavailable}</p> : <p>{arabic ? `النتيجة: ${formatNumber(passedScore)} من ${formatNumber(questions.length)}.` : `Score: ${formatNumber(passedScore)} of ${formatNumber(questions.length)}.`}</p>}<a className="button button-primary" href={getBeginnerProjectHref(pathId)}>{arabic ? 'افتح المشروع العملي' : 'Open the practical project'}</a></section>
        ) : completed ? (
          <section className="beginner-assessment-result" role="status"><h2>{copy.assessmentFail}</h2><p>{arabic ? `النتيجة: ${formatNumber(score)} من ${formatNumber(questions.length)} (${formatNumber(Math.round((score / questions.length) * 100))}٪).` : `Score: ${formatNumber(score)} of ${formatNumber(questions.length)} (${formatNumber(Math.round((score / questions.length) * 100))}%).`}</p>{saveError && <p role="alert" className="student-form-error">{copy.sessionSaveError}</p>}<button className="button button-primary" type="button" onClick={retryAssessment}>{copy.assessmentRetry}</button></section>
        ) : question ? (
          <section className="beginner-final-question" aria-labelledby="final-question-title"><div className="beginner-placement-progress"><span>{arabic ? 'السؤال' : 'Question'} {formatNumber(questionIndex + 1)} / {formatNumber(questions.length)}</span><span>{arabic ? 'درجة النجاح 80٪' : 'Passing score: 80%'}</span></div><h2 id="final-question-title">{question.prompt}</h2><div className="learning-question-options" role="group" aria-label={question.prompt}>{orderedChoices.map((choice) => <button key={choice.id} className={`learning-choice${answers[question.id] === choice.id ? (choice.id === question.correctChoiceId ? ' is-correct' : ' is-incorrect') : ''}`} type="button" disabled={Boolean(answers[question.id])} aria-pressed={answers[question.id] === choice.id} onClick={() => submitAnswer(choice.id)}><span>{choice.label}</span></button>)}</div>{answers[question.id] && <div className={`learning-quiz-feedback${answers[question.id] === question.correctChoiceId ? ' is-correct' : ' is-incorrect'}`} role="status"><p>{answers[question.id] === question.correctChoiceId ? question.feedback : (arabic ? 'راجع الدرس المرتبط بهذا المفهوم بعد التقييم.' : 'Review the related lesson after the assessment.')}</p><button className="button button-primary" type="button" onClick={nextQuestion}>{questionIndex === questions.length - 1 ? (arabic ? 'إنهاء التقييم' : 'Finish assessment') : (arabic ? 'السؤال التالي' : 'Next question')}</button></div>}</section>
        ) : null}
      </main>
    </div>
  );
}

export default BeginnerAssessmentPage;
