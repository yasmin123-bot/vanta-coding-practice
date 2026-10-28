import { useEffect, useRef, useState } from 'react';
import {
  HTML_LESSON_IDS,
  getHtmlLessonHref,
  type AdditionalHtmlLessonId,
} from '../content/learningSystem';
import { messages, type Locale } from '../i18n/messages';
import { markLessonCompleted } from '../state/sessionProgress';
import { createQuizChoiceOrder, getOrderedQuizChoices } from '../utils/quizChoices';
import LearningHeader from './LearningHeader';

export type LearningLessonProps = {
  lessonId: AdditionalHtmlLessonId;
  locale: Locale;
  onSwitchLocale: () => void;
};

type LessonFlow = 'learn' | 'quiz' | 'result';

function fillTemplate(template: string, current: number, total: number) {
  return template.replace('{current}', String(current)).replace('{total}', String(total));
}

function InlineCodeText({ text }: { text: string }) {
  const tokenPattern = /(<!DOCTYPE html>|<\/?[a-z][a-z0-9]*(?:\s+[^<>]*?)?\s*\/?>|(?:href|src|alt|lang|charset)=["'][^"']*["'])/gi;
  const codeTokenPattern = /^(?:<!DOCTYPE html>|<\/?[a-z][a-z0-9]*(?:\s+[^<>]*?)?\s*\/?>|(?:href|src|alt|lang|charset)=["'][^"']*["'])$/i;
  const parts = text.split(tokenPattern);

  return (
    <>
      {parts.map((part, index) => (
        codeTokenPattern.test(part) ? (
          <code className="lesson-inline-code" dir="ltr" key={`${index}-${part}`}>{part}</code>
        ) : (
          <span key={`${index}-text`}>{part}</span>
        )
      ))}
    </>
  );
}

function LearningLesson({ lessonId, locale, onSwitchLocale }: LearningLessonProps) {
  const landingCopy = messages[locale];
  const systemCopy = landingCopy.learningSystem;
  const copy = systemCopy.lessons[lessonId];
  const ui = systemCopy.ui;
  const isArabic = locale === 'ar';
  const lessonIndex = HTML_LESSON_IDS.indexOf(lessonId);
  const previousLessonId = lessonIndex > 0 ? HTML_LESSON_IDS[lessonIndex - 1] : null;
  const nextLessonId = lessonIndex < HTML_LESSON_IDS.length - 1 ? HTML_LESSON_IDS[lessonIndex + 1] : null;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasRendered = useRef(false);
  const [flow, setFlow] = useState<LessonFlow>('learn');
  const [stepIndex, setStepIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [choiceOrderByQuestion, setChoiceOrderByQuestion] = useState<Record<string, string[]>>({});
  const [attempts, setAttempts] = useState(0);
  const [firstTryScore, setFirstTryScore] = useState(0);
  const [missedQuestionIds, setMissedQuestionIds] = useState<string[]>([]);

  const currentStep = copy.steps[stepIndex];
  const currentQuestion = copy.questions[questionIndex];
  const orderedChoices = getOrderedQuizChoices(
    currentQuestion.choices,
    choiceOrderByQuestion[currentQuestion.id],
  );
  const answerIsCorrect = selectedChoiceId !== null && selectedChoiceId === currentQuestion.correctChoiceId;
  const progressLabel = flow === 'quiz'
    ? fillTemplate(ui.questionProgress, questionIndex + 1, copy.questions.length)
    : fillTemplate(ui.stepProgress, stepIndex + 1, copy.steps.length);
  const progressValue = flow === 'quiz'
    ? ((questionIndex + 1) / copy.questions.length) * 100
    : ((stepIndex + 1) / copy.steps.length) * 100;
  const missedQuestions = copy.questions.filter((question) => missedQuestionIds.includes(question.id));
  const resultMessage = firstTryScore === copy.questions.length
    ? ui.perfectResult
    : firstTryScore >= Math.ceil(copy.questions.length * 0.6)
      ? ui.goodResult
      : ui.keepPracticingResult;
  const previousLesson = previousLessonId ? getHtmlLessonHref(previousLessonId) : null;
  const nextLesson = nextLessonId ? getHtmlLessonHref(nextLessonId) : null;

  useEffect(() => {
    if (hasRendered.current) {
      if (flow === 'quiz') questionHeadingRef.current?.focus();
      else headingRef.current?.focus();
    }
    hasRendered.current = true;
  }, [flow, stepIndex, questionIndex]);

  const beginQuiz = () => {
    setQuestionIndex(0);
    setSelectedChoiceId(null);
    setChoiceOrderByQuestion(createQuizChoiceOrder(copy.questions));
    setAttempts(0);
    setFirstTryScore(0);
    setMissedQuestionIds([]);
    setFlow('quiz');
  };

  const chooseAnswer = (choiceId: string) => {
    if (selectedChoiceId !== null) return;
    setSelectedChoiceId(choiceId);
    if (choiceId === currentQuestion.correctChoiceId) {
      if (attempts === 0) setFirstTryScore((score) => score + 1);
      return;
    }
    setMissedQuestionIds((current) => (
      current.includes(currentQuestion.id) ? current : [...current, currentQuestion.id]
    ));
  };

  const retryQuestion = () => {
    setAttempts((current) => current + 1);
    setSelectedChoiceId(null);
  };

  const continueQuiz = () => {
    if (questionIndex === copy.questions.length - 1) {
      markLessonCompleted(lessonId);
      setFlow('result');
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedChoiceId(null);
    setAttempts(0);
  };

  const restartQuiz = () => {
    setStepIndex(copy.steps.length - 1);
    beginQuiz();
  };

  return (
    <div className={`app-shell learning-system-page learning-lesson-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <LearningHeader
        locale={locale}
        onSwitchLocale={onSwitchLocale}
        allPathsLabel={ui.allPaths}
        homeLabel={ui.home}
        stageLabel={copy.eyebrow}
      />

      <main className="learning-system-main section-frame">
        <nav className="learning-breadcrumb" aria-label={isArabic ? 'مسار التنقل' : 'Breadcrumb'}>
          <a href="/paths/html-fundamentals">{ui.backToPath}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{copy.title}</span>
        </nav>

        <header className="learning-system-intro learning-lesson-intro">
          <p className="eyebrow"><span className="eyebrow-line" />{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="learning-system-lead">{copy.intro}</p>
          <div className="learning-lesson-objective">
            <span>{copy.objectiveLabel}</span>
            <p><InlineCodeText text={copy.objectiveText} /></p>
          </div>
        </header>

        {flow === 'learn' && currentStep && (
          <section className="learning-lesson-flow" aria-labelledby="learning-step-title">
            <div className="learning-flow-progress">
              <div className="learning-flow-progress-top">
                <span aria-live="polite">{progressLabel}</span>
                <span>{ui.lessonProgressNote}</span>
              </div>
              <div
                className="learning-flow-progress-track"
                role="progressbar"
                aria-label={progressLabel}
                aria-valuemin={1}
                aria-valuemax={copy.steps.length}
                aria-valuenow={stepIndex + 1}
              >
                <span style={{ width: `${progressValue}%` }} />
              </div>
            </div>

            <article className="learning-lesson-surface" key={currentStep.title}>
              <header className="learning-lesson-step-heading">
                <span className="learning-lesson-step-number" dir="ltr">{String(stepIndex + 1).padStart(2, '0')}</span>
                <div>
                  <p className="learning-lesson-kicker">{ui.learnLabel}</p>
                  <h2 id="learning-step-title" ref={headingRef} tabIndex={-1}>{currentStep.title}</h2>
                </div>
              </header>
              <p className="learning-lesson-step-body"><InlineCodeText text={currentStep.body} /></p>

              {currentStep.code && (
                <section className="learning-code-example" aria-label={ui.codeExampleLabel}>
                  <div className="learning-code-example-head" dir="ltr">
                    <span>HTML</span>
                    <span>{ui.codeReadOnly}</span>
                  </div>
                  <ol className="learning-code-lines" dir="ltr">
                    {currentStep.code.map((line, index) => (
                      <li key={`${index}-${line.code}`}>
                        <code dir="ltr">{line.code}</code>
                        <span dir="auto">{line.note}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {currentStep.note && <p className="learning-lesson-note">{currentStep.note}</p>}

              <div className="learning-lesson-controls">
                <button
                  className="button button-quiet learning-lesson-button"
                  type="button"
                  onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                  disabled={stepIndex === 0}
                >
                  <span aria-hidden="true">{isArabic ? '→' : '←'}</span>{ui.previousStep}
                </button>
                {stepIndex < copy.steps.length - 1 ? (
                  <button
                    className="button button-primary learning-lesson-button"
                    type="button"
                    onClick={() => setStepIndex((current) => current + 1)}
                  >
                    {ui.nextStep}<span aria-hidden="true">{isArabic ? '←' : '→'}</span>
                  </button>
                ) : (
                  <button className="button button-primary learning-lesson-button" type="button" onClick={beginQuiz}>
                    {ui.startQuiz}<span aria-hidden="true">{isArabic ? '←' : '→'}</span>
                  </button>
                )}
              </div>
            </article>
          </section>
        )}

        {flow === 'quiz' && currentQuestion && (
          <section className="learning-lesson-flow" aria-labelledby="learning-quiz-title">
            <header className="learning-quiz-intro">
              <p className="learning-lesson-kicker">{ui.practiceLabel}</p>
              <h2 id="learning-quiz-title" ref={headingRef} tabIndex={-1}>{ui.quizTitle}</h2>
              <p>{ui.quizIntro}</p>
            </header>
            <div className="learning-flow-progress">
              <div className="learning-flow-progress-top">
                <span aria-live="polite">{progressLabel}</span>
                <span>{ui.quizProgressNote}</span>
              </div>
              <div
                className="learning-flow-progress-track"
                role="progressbar"
                aria-label={progressLabel}
                aria-valuemin={1}
                aria-valuemax={copy.questions.length}
                aria-valuenow={questionIndex + 1}
              >
                <span style={{ width: `${progressValue}%` }} />
              </div>
            </div>

            <article className="learning-question-surface" key={currentQuestion.id}>
              <div className="learning-question-heading">
                <span dir="ltr">{String(questionIndex + 1).padStart(2, '0')}</span>
                <h3 ref={questionHeadingRef} tabIndex={-1}><InlineCodeText text={currentQuestion.prompt} /></h3>
              </div>
              <div className="learning-question-options" role="group" aria-label={currentQuestion.prompt}>
                {orderedChoices.map((choice) => {
                  const isSelected = selectedChoiceId === choice.id;
                  const isAnswer = selectedChoiceId !== null && choice.id === currentQuestion.correctChoiceId;
                  const stateClass = isSelected
                    ? answerIsCorrect ? 'is-correct' : 'is-incorrect'
                    : isAnswer ? 'is-answer' : '';
                  return (
                    <button
                      className={`learning-choice ${stateClass}`}
                      type="button"
                      key={choice.id}
                      onClick={() => chooseAnswer(choice.id)}
                      disabled={selectedChoiceId !== null}
                      aria-pressed={isSelected}
                    >
                      {choice.kind === 'code'
                        ? <code dir="ltr">{choice.label}</code>
                        : <span><InlineCodeText text={choice.label} /></span>}
                    </button>
                  );
                })}
              </div>

              {selectedChoiceId !== null && (
                <div className={`learning-quiz-feedback ${answerIsCorrect ? 'is-correct' : 'is-incorrect'}`} role="status" aria-live="polite">
                  <span aria-hidden="true">{answerIsCorrect ? '✓' : '↺'}</span>
                  <div>
                    <strong>{answerIsCorrect ? ui.correctTitle : ui.incorrectTitle}</strong>
                    <p><InlineCodeText text={answerIsCorrect ? currentQuestion.correctFeedback : currentQuestion.incorrectFeedback} /></p>
                  </div>
                </div>
              )}

              <div className="learning-question-actions">
                {selectedChoiceId !== null && !answerIsCorrect && (
                  <button className="button button-quiet learning-lesson-button" type="button" onClick={retryQuestion}>{ui.tryAgain}</button>
                )}
                {answerIsCorrect && (
                  <button className="button button-primary learning-lesson-button" type="button" onClick={continueQuiz}>
                    {questionIndex === copy.questions.length - 1 ? ui.seeResult : ui.nextQuestion}
                    <span aria-hidden="true">{isArabic ? '←' : '→'}</span>
                  </button>
                )}
              </div>
            </article>
          </section>
        )}

        {flow === 'result' && (
          <section className="learning-lesson-flow learning-result-flow" aria-labelledby="learning-result-title">
            <article className="learning-result-surface">
              <p className="learning-lesson-kicker">{ui.practiceLabel}</p>
              <h2 id="learning-result-title" ref={headingRef} tabIndex={-1}>{ui.resultTitle}</h2>
              <div className="learning-result-score" aria-label={`${ui.scoreLabel}: ${firstTryScore} / ${copy.questions.length}`}>
                <span>{firstTryScore}</span><span aria-hidden="true">/</span><span>{copy.questions.length}</span>
              </div>
              <p className="learning-result-score-label">{ui.scoreLabel}</p>
              <p className="learning-result-message">{resultMessage}</p>
              <p className="learning-result-note">{ui.resultNote}</p>

              <section className="learning-result-outcome" aria-labelledby="learning-outcome-title">
                <h3 id="learning-outcome-title">{copy.outcomeLabel}</h3>
                <p><InlineCodeText text={copy.outcomeText} /></p>
              </section>

              <section className="learning-result-review" aria-labelledby="learning-review-title">
                <h3 id="learning-review-title">{ui.reviewTitle}</h3>
                {missedQuestions.length > 0 ? (
                  <ul>{missedQuestions.map((question) => <li key={question.id}>{question.reviewTopic}</li>)}</ul>
                ) : <p>{ui.noMissedQuestions}</p>}
              </section>

              <div className="learning-result-actions">
                {nextLesson ? (
                  <a className="button button-primary learning-lesson-button" href={nextLesson}>
                    {ui.nextLesson}<span aria-hidden="true">{isArabic ? '←' : '→'}</span>
                  </a>
                ) : (
                  <a className="button button-primary learning-lesson-button" href="/paths/html-fundamentals">{ui.finalLesson}</a>
                )}
                <button className="button button-quiet learning-lesson-button" type="button" onClick={restartQuiz}>{ui.retryQuiz}</button>
              </div>
              <nav className="learning-result-navigation" aria-label={isArabic ? 'التنقل بين الدروس' : 'Lesson navigation'}>
                {previousLesson && <a href={previousLesson}>{ui.previousLesson}</a>}
                <a href="/paths/html-fundamentals">{ui.returnToPath}</a>
                {nextLesson && <a href={nextLesson}>{ui.nextLesson}</a>}
              </nav>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}

export default LearningLesson;
