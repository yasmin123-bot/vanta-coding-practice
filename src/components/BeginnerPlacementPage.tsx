import { useMemo, useState } from 'react';
import { getBeginnerCourseHref, getLearningLevelsHref, LEARNING_PATH_ARTWORK, type FoundationPathId } from '../content/learningSystem';
import { getBeginnerLessons, getBeginnerPlacementBands, getBeginnerRecommendedStartIndex } from '../content/beginnerCurriculum';
import { type Locale } from '../i18n/messages';
import { getLearningLevelsCopy } from '../i18n/learningLevels';
import { createQuizChoiceOrder, getOrderedQuizChoices } from '../utils/quizChoices';
import { setSessionPlacementStart } from '../utils/sessionBeginnerProgress';
import LearningHeader from './LearningHeader';

function BeginnerPlacementPage({ pathId, locale, onSwitchLocale }: { pathId: FoundationPathId; locale: Locale; onSwitchLocale: () => void }) {
  const arabic = locale === 'ar';
  const copy = getLearningLevelsCopy(locale);
  const bands = getBeginnerPlacementBands(pathId);
  const pathTitle = getBeginnerLessons(pathId)[0]?.existingLessonId ? pathId.split('-')[0].toUpperCase() : pathId;
  const [bandIndex, setBandIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [bandScore, setBandScore] = useState(0);
  const [passedBands, setPassedBands] = useState(0);
  const [finished, setFinished] = useState(false);
  const [savedStart, setSavedStart] = useState<number | null>(null);
  const [storageError, setStorageError] = useState(false);
  const questions = bands[bandIndex]?.questions ?? [];
  const question = questions[questionIndex];
  const allQuestions = useMemo(() => bands.flatMap((band) => band.questions.map((item) => ({ id: item.id, choices: item.choices, correctChoiceId: item.correctChoiceId }))), [bands]);
  const [choiceOrders] = useState(() => createQuizChoiceOrder(allQuestions));
  const choices = question ? getOrderedQuizChoices(question.choices, choiceOrders[question.id]) : [];
  const recommendedIndex = getBeginnerRecommendedStartIndex(pathId, passedBands);
  const recommendedLesson = getBeginnerLessons(pathId)[recommendedIndex];
  const assessmentBand = bands[Math.min(passedBands, bands.length - 1)];

  const acceptAnswer = (choiceId: string) => {
    if (selected || !question) return;
    setSelected(choiceId);
  };

  const continueQuestion = () => {
    if (!question || !selected) return;
    const nextScore = bandScore + (selected === question.correctChoiceId ? 1 : 0);
    if (questionIndex === questions.length - 1) {
      if (nextScore === questions.length) {
        const nextPassed = passedBands + 1;
        setPassedBands(nextPassed);
        setBandScore(0);
        setQuestionIndex(0);
        setSelected(null);
        if (nextPassed >= bands.length) setFinished(true);
        else setBandIndex(nextPassed);
      } else {
        setBandScore(nextScore);
        setFinished(true);
      }
      return;
    }
    setBandScore(nextScore);
    setQuestionIndex((current) => current + 1);
    setSelected(null);
  };

  const saveRecommendation = () => {
    const ok = setSessionPlacementStart(pathId, recommendedIndex);
    setStorageError(!ok);
    if (ok) setSavedStart(recommendedIndex);
  };

  return (
    <div className={`app-shell learning-system-page beginner-placement-page ${arabic ? 'is-arabic' : 'is-english'}`}>
      <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={copy.backToLevels} stageLabel={`${pathTitle} · ${copy.beginner}`} />
      <main className="learning-system-main section-frame">
        <nav className="learning-breadcrumb" aria-label={arabic ? 'مسار التنقل' : 'Breadcrumb'}><a href={getLearningLevelsHref()}>{copy.backToLevels}</a><span aria-hidden="true">/</span><span aria-current="page">{copy.placementTitle}</span></nav>
        <header className="learning-system-intro beginner-placement-intro">
          <p className="eyebrow"><span className="eyebrow-line" />{copy.optional}</p>
          <h1>{copy.placementTitle}</h1>
          <p className="learning-system-lead">{copy.placementBody}</p>
          <p className="beginner-placement-safety">{copy.placementRule}</p>
          <figure className="beginner-placement-artwork" aria-hidden="true">
            <img src={LEARNING_PATH_ARTWORK[pathId]} alt="" loading="eager" decoding="async" />
          </figure>
        </header>

        {!finished && question && assessmentBand && (
          <section className="beginner-placement-question" aria-labelledby="placement-question-title">
            <div className="beginner-placement-progress"><span>{arabic ? assessmentBand.titleAr : assessmentBand.titleEn}</span><span>{new Intl.NumberFormat(arabic ? 'ar' : 'en-US').format(questionIndex + 1)} / {new Intl.NumberFormat(arabic ? 'ar' : 'en-US').format(questions.length)}</span></div>
            <h2 id="placement-question-title">{arabic ? question.promptAr : question.promptEn}</h2>
            <div className="learning-question-options" role="group" aria-label={arabic ? question.promptAr : question.promptEn}>
              {choices.map((choice) => <button key={choice.id} className={`learning-choice${selected === choice.id ? (selected === question.correctChoiceId ? ' is-correct' : ' is-incorrect') : ''}`} type="button" disabled={selected !== null} aria-pressed={selected === choice.id} onClick={() => acceptAnswer(choice.id)}><span>{arabic ? choice.labelAr : choice.labelEn}</span></button>)}
            </div>
            {selected && <div className={`learning-quiz-feedback${selected === question.correctChoiceId ? ' is-correct' : ' is-incorrect'}`} role="status" aria-live="polite"><p>{arabic ? question.feedbackAr : question.feedbackEn}</p><button className="button button-primary" type="button" onClick={continueQuestion}>{questionIndex === questions.length - 1 && bandScore + (selected === question.correctChoiceId ? 1 : 0) < questions.length ? (arabic ? 'عرض الاقتراح' : 'See recommendation') : (arabic ? 'متابعة' : 'Continue')}</button></div>}
          </section>
        )}

        {finished && (
          <section className="beginner-placement-result" aria-labelledby="placement-result-title">
            <p className="eyebrow"><span className="eyebrow-line" />{copy.recommendation}</p>
            <h2 id="placement-result-title">{passedBands > 0 ? (arabic ? `اجتزت ${passedBands} من ${bands.length} نطاقات متتالية` : `You passed ${passedBands} of ${bands.length} consecutive bands`) : (arabic ? 'ابدأ من الأساسيات' : 'Start with the foundations')}</h2>
            <p>{arabic ? `نقترح البدء من الدرس ${recommendedIndex + 1}: ${recommendedLesson?.titleAr ?? ''}.` : `We recommend starting at lesson ${recommendedIndex + 1}: ${recommendedLesson?.titleEn ?? ''}.`}</p>
            <p>{copy.placementLimit}</p>
            {storageError && <p role="alert" className="student-form-error">{copy.sessionSaveError}</p>}
            {savedStart === null ? <button className="button button-primary" type="button" onClick={saveRecommendation}>{arabic ? 'استخدم نقطة البداية المقترحة' : 'Use recommended starting point'}</button> : <p className="beginner-level-complete" role="status">{copy.sessionSaved}</p>}
            <a className="button button-secondary" href={getBeginnerCourseHref(pathId)}>{savedStart !== null ? copy.openCourse : copy.openCourseFromStart}</a>
          </section>
        )}

        <p className="beginner-placement-skip"><a href={`${getBeginnerCourseHref(pathId)}?start=first`}>{copy.skipPlacement}</a></p>
      </main>
    </div>
  );
}

export default BeginnerPlacementPage;
