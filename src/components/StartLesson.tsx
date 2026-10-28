import { Fragment, useEffect, useRef, useState } from 'react';
import { initialHtmlExercise } from '../content/initialHtmlExercise';
import { messages, type Locale } from '../i18n/messages';
import { createQuizChoiceOrder, getOrderedQuizChoices } from '../utils/quizChoices';

type StartLessonProps = {
  locale: Locale;
  onSwitchLocale: () => void;
  onComplete: () => void;
};

type LessonFlow = 'learn' | 'quiz' | 'result';

function InlineLessonText({ text }: { text: string }) {
  const parts = text.split(/(<\/?[a-z][a-z0-9]*>)/gi);

  return (
    <>
      {parts.map((part, index) => (
        /^<\/?[a-z][a-z0-9]*>$/i.test(part) ? (
          <code className="lesson-inline-code" dir="ltr" key={`${index}-${part}`}>
            {part}
          </code>
        ) : (
          <Fragment key={`${index}-text`}>{part}</Fragment>
        )
      ))}
    </>
  );
}

function interpolateProgress(template: string, current: number, total: number) {
  return template.replace('{current}', String(current)).replace('{total}', String(total));
}

function StartLesson({ locale, onSwitchLocale, onComplete }: StartLessonProps) {
  const pageCopy = messages[locale];
  const copy = pageCopy.lesson;
  const learningUi = pageCopy.learningSystem.ui;
  const isArabic = locale === 'ar';
  const [flow, setFlow] = useState<LessonFlow>('learn');
  const [learningStepIndex, setLearningStepIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [choiceOrderByQuestion, setChoiceOrderByQuestion] = useState<Record<string, string[]>>({});
  const [attempts, setAttempts] = useState(0);
  const [firstTryScore, setFirstTryScore] = useState(0);
  const [missedQuestionIds, setMissedQuestionIds] = useState<string[]>([]);
  const quizQuestionHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (flow === 'quiz') quizQuestionHeadingRef.current?.focus();
  }, [flow, quizIndex]);

  const headingExample = initialHtmlExercise.lesson.example;
  const anatomyExample = '<h1>Hello</h1>';
  const exampleLines = [headingExample, '<p>Welcome to VANTA.</p>'];
  const activeStep = copy.learningSteps[learningStepIndex];
  const currentQuestion = copy.questions[quizIndex];
  const orderedChoices = getOrderedQuizChoices(
    currentQuestion.choices,
    choiceOrderByQuestion[currentQuestion.id],
  );
  const answerIsCorrect = selectedChoiceId !== null && selectedChoiceId === currentQuestion.correctChoiceId;
  const progressLabel = flow === 'quiz'
    ? interpolateProgress(copy.quizProgress, quizIndex + 1, copy.questions.length)
    : interpolateProgress(copy.learningProgress, learningStepIndex + 1, copy.learningSteps.length);
  const progressValue = flow === 'quiz'
    ? ((quizIndex + 1) / copy.questions.length) * 100
    : ((learningStepIndex + 1) / copy.learningSteps.length) * 100;

  const openingTagEnd = anatomyExample.indexOf('>') + 1;
  const closingTagStart = anatomyExample.lastIndexOf('<');
  const elementParts = [
    { token: anatomyExample.slice(0, openingTagEnd), label: copy.openingTagLabel },
    { token: anatomyExample.slice(openingTagEnd, closingTagStart), label: copy.contentLabel },
    { token: anatomyExample.slice(closingTagStart), label: copy.closingTagLabel },
  ];

  const beginQuiz = () => {
    setQuizIndex(0);
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

  const retryCurrentQuestion = () => {
    setAttempts((current) => current + 1);
    setSelectedChoiceId(null);
  };

  const continueQuiz = () => {
    if (quizIndex === copy.questions.length - 1) {
      onComplete();
      setFlow('result');
      return;
    }

    setQuizIndex((current) => current + 1);
    setSelectedChoiceId(null);
    setAttempts(0);
  };

  const resultMessage = firstTryScore === copy.questions.length
    ? copy.resultMessages.perfect
    : firstTryScore === 4
      ? copy.resultMessages.four
      : firstTryScore === 3
        ? copy.resultMessages.three
        : copy.resultMessages.low;
  const missedQuestions = copy.questions.filter((question) => missedQuestionIds.includes(question.id));

  const renderStepVisual = () => {
    switch (activeStep.id) {
      case 'html':
        return (
          <div className="lesson-step-visual lesson-html-visual" aria-label={copy.htmlStructureCaption}>
            <span className="lesson-visual-primary" dir="ltr">HTML</span>
            <span className="lesson-visual-connector" aria-hidden="true">→</span>
            <span className="lesson-visual-secondary">{copy.htmlStructureCaption}</span>
          </div>
        );
      case 'tag':
        return (
          <div className="lesson-step-visual lesson-tag-visual" dir="ltr">
            <code dir="ltr">{'<h1>'}</code>
            <span dir="auto">{copy.tagExampleLabel}</span>
          </div>
        );
      case 'element':
        return (
          <div className="lesson-step-visual lesson-element-compare" dir="ltr">
            <div className="lesson-compare-item">
              <span dir="auto">{copy.tagCompareLabel}</span>
              <code dir="ltr">{'<h1>'}</code>
            </div>
            <span className="lesson-compare-divider" aria-hidden="true">≠</span>
            <div className="lesson-compare-item">
              <span dir="auto">{copy.elementCompareLabel}</span>
              <code dir="ltr">{'<h1>Hello</h1>'}</code>
            </div>
          </div>
        );
      case 'anatomy':
        return (
          <div className="lesson-step-visual lesson-element-anatomy" role="group" aria-label={copy.elementDiagramTitle} dir="ltr">
            {elementParts.map((part, partIndex) => (
              <Fragment key={part.token}>
                {partIndex > 0 && <span className="lesson-element-operator" aria-hidden="true">+</span>}
                <span className="lesson-element-part">
                  <code dir="ltr">{part.token}</code>
                  <span dir="auto">{part.label}</span>
                </span>
              </Fragment>
            ))}
          </div>
        );
      case 'example':
        return (
          <div className="lesson-step-visual lesson-example-visual">
            <div className="lesson-code-window">
              <div className="lesson-code-language" dir="ltr">HTML</div>
              <div className="lesson-code-lines" dir="ltr">
                {exampleLines.map((line, index) => (
                  <div className="lesson-code-line" key={line}>
                    <span className="lesson-code-line-index" aria-hidden="true">0{index + 1}</span>
                    <code dir="ltr">{line}</code>
                    <span className="lesson-code-line-role" dir="auto">
                      {index === 0 ? copy.headingRole : copy.paragraphRole}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="lesson-visual-note">{copy.exampleNote}</p>
          </div>
        );
      case 'summary':
        return (
          <div className="lesson-step-visual lesson-summary-visual">
            <ol className="lesson-summary-points">
              {copy.summaryPoints.map((point, index) => (
                <li key={point}>
                  <span className="lesson-summary-index" aria-hidden="true">0{index + 1}</span>
                  <p><InlineLessonText text={point} /></p>
                </li>
              ))}
            </ol>
            <div className="lesson-step-outcome">
              <span className="lesson-kicker">{copy.outcomeLabel}</span>
              <p><InlineLessonText text={copy.outcomeBody} /></p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`app-shell lesson-shell ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <header className="site-header lesson-header section-frame">
        <a className="brand-link" href="/" aria-label="VANTA — Create Beyond">
          <img src="/brand/vanta-logo.png" alt="VANTA — Create Beyond" />
        </a>

        <div className="lesson-header-meta">
          <span className="lesson-stage-index" dir="ltr">{copy.stageLabel}</span>
          <button
            className="language-toggle"
            type="button"
            onClick={onSwitchLocale}
            aria-label={pageCopy.nav.switchLanguage}
          >
            <span className="language-toggle-mark" aria-hidden="true">文</span>
            <span>{isArabic ? 'EN' : 'عربي'}</span>
          </button>
        </div>
      </header>

      <main className="lesson-main section-frame" aria-labelledby="lesson-title">
        <a className="lesson-back-link" href="/paths/html-fundamentals">
          <span aria-hidden="true">↩</span>
          {copy.backToJourney}
        </a>

        <header className="lesson-intro">
          <p className="eyebrow"><span className="eyebrow-line" />{copy.eyebrow}</p>
          <h1 className="lesson-title" id="lesson-title">{copy.title}</h1>
          <p className="lesson-lead">{copy.intro}</p>
          <div className="lesson-objective">
            <span className="lesson-objective-label">{copy.objectiveLabel}</span>
            <p>{copy.objectiveText}</p>
          </div>
        </header>

        {flow === 'learn' && activeStep && (
          <section className="lesson-experience" aria-labelledby={`lesson-step-title-${activeStep.id}`}>
            <div className="lesson-flow-progress">
              <div className="lesson-flow-progress-top">
                <span className="lesson-flow-progress-label" aria-live="polite">{progressLabel}</span>
                <span className="lesson-flow-progress-note">{copy.learningProgressNote}</span>
              </div>
              <div
                className="lesson-flow-progress-track"
                role="progressbar"
                aria-label={progressLabel}
                aria-valuemin={1}
                aria-valuemax={copy.learningSteps.length}
                aria-valuenow={learningStepIndex + 1}
              >
                <span className="lesson-flow-progress-fill" style={{ width: `${progressValue}%` }} />
              </div>
            </div>

            <article className="lesson-step-surface" key={activeStep.id}>
              <div className="lesson-step-heading">
                <span className="lesson-step-number" dir="ltr">0{learningStepIndex + 1}</span>
                <div>
                  <p className="lesson-kicker">{copy.learningLabel}</p>
                  <h2 id={`lesson-step-title-${activeStep.id}`} tabIndex={-1}>{activeStep.title}</h2>
                </div>
              </div>
              <p className="lesson-step-body"><InlineLessonText text={activeStep.body} /></p>
              {renderStepVisual()}
            </article>

            <nav className="lesson-flow-controls" aria-label={isArabic ? 'التنقّل بين خطوات الدرس' : 'Lesson step navigation'}>
              <button
                className="button button-quiet lesson-flow-button"
                type="button"
                onClick={() => setLearningStepIndex((current) => Math.max(0, current - 1))}
                disabled={learningStepIndex === 0}
              >
                <span aria-hidden="true">{isArabic ? '→' : '←'}</span>
                {copy.previousStep}
              </button>
              <button
                className="button button-primary lesson-flow-button"
                type="button"
                onClick={() => {
                  if (learningStepIndex === copy.learningSteps.length - 1) {
                    beginQuiz();
                  } else {
                    setLearningStepIndex((current) => current + 1);
                  }
                }}
              >
                {learningStepIndex === copy.learningSteps.length - 1 ? copy.startQuiz : copy.nextStep}
                <span className="button-arrow" aria-hidden="true">{isArabic ? '←' : '→'}</span>
              </button>
            </nav>
          </section>
        )}

        {flow === 'quiz' && currentQuestion && (
          <section className="lesson-experience lesson-quiz-experience" aria-labelledby="lesson-quiz-title">
            <header className="lesson-quiz-heading">
              <p className="lesson-kicker">{copy.practiceLabel}</p>
              <h2 id="lesson-quiz-title">{copy.quizTitle}</h2>
              <p>{copy.quizIntro}</p>
            </header>

            <div className="lesson-flow-progress">
              <div className="lesson-flow-progress-top">
                <span className="lesson-flow-progress-label" aria-live="polite">
                  {interpolateProgress(copy.quizProgress, quizIndex + 1, copy.questions.length)}
                </span>
                <span className="lesson-flow-progress-note">{copy.quizProgressNote}</span>
              </div>
              <div
                className="lesson-flow-progress-track"
                role="progressbar"
                aria-label={progressLabel}
                aria-valuemin={1}
                aria-valuemax={copy.questions.length}
                aria-valuenow={quizIndex + 1}
              >
                <span className="lesson-flow-progress-fill" style={{ width: `${progressValue}%` }} />
              </div>
            </div>

            <article className="lesson-question-surface" key={currentQuestion.id}>
              <div className="lesson-question-heading">
                <span className="lesson-question-index" dir="ltr">0{quizIndex + 1}</span>
                <h3 ref={quizQuestionHeadingRef} tabIndex={-1}><InlineLessonText text={currentQuestion.prompt} /></h3>
              </div>

              <div className="lesson-question-options" role="group" aria-label={currentQuestion.prompt}>
                {orderedChoices.map((choice) => {
                  const isSelected = selectedChoiceId === choice.id;
                  const isCorrectChoice = choice.id === currentQuestion.correctChoiceId;
                  const stateClass = isSelected
                    ? (answerIsCorrect ? 'is-correct' : 'is-incorrect')
                    : selectedChoiceId !== null && isCorrectChoice ? 'is-answer' : '';

                  return (
                    <button
                      className={`lesson-choice ${stateClass}`}
                      type="button"
                      key={choice.id}
                      onClick={() => chooseAnswer(choice.id)}
                      disabled={selectedChoiceId !== null}
                      aria-pressed={isSelected}
                    >
                      {choice.kind === 'code'
                        ? <code dir="ltr">{choice.label}</code>
                        : <span dir="auto">{choice.label}</span>}
                    </button>
                  );
                })}
              </div>

              {selectedChoiceId !== null && (
                <div className={`lesson-quiz-feedback ${answerIsCorrect ? 'is-correct' : 'is-incorrect'}`} role="status" aria-live="polite">
                  <span className="lesson-feedback-mark" aria-hidden="true">{answerIsCorrect ? '✓' : '↺'}</span>
                  <div>
                    <p className="lesson-feedback-title">{answerIsCorrect ? copy.correctTitle : copy.incorrectTitle}</p>
                    <p className="lesson-feedback-body"><InlineLessonText text={answerIsCorrect ? currentQuestion.correctFeedback : currentQuestion.incorrectFeedback} /></p>
                  </div>
                </div>
              )}

              <div className="lesson-question-actions">
                {selectedChoiceId !== null && !answerIsCorrect && (
                  <button className="button button-quiet lesson-flow-button" type="button" onClick={retryCurrentQuestion}>
                    {copy.tryAgain}
                  </button>
                )}
                {answerIsCorrect && (
                  <button className="button button-primary lesson-flow-button" type="button" onClick={continueQuiz}>
                    {quizIndex === copy.questions.length - 1 ? copy.showResult : copy.nextQuestion}
                    <span className="button-arrow" aria-hidden="true">{isArabic ? '←' : '→'}</span>
                  </button>
                )}
              </div>
            </article>
          </section>
        )}

        {flow === 'result' && (
          <section className="lesson-experience lesson-result-experience" aria-labelledby="lesson-result-title">
            <article className="lesson-result-surface">
              <p className="lesson-kicker">{copy.practiceLabel}</p>
              <h2 id="lesson-result-title">{copy.resultTitle}</h2>
              <div className="lesson-result-score" aria-label={`${copy.scoreLabel}: ${firstTryScore} / ${copy.questions.length}`}>
                <span>{firstTryScore}</span>
                <span className="lesson-result-divider" aria-hidden="true">/</span>
                <span>{copy.questions.length}</span>
              </div>
              <p className="lesson-result-score-label">{copy.scoreLabel}</p>
              <p className="lesson-result-message">{resultMessage}</p>
              <p className="lesson-result-note">{copy.resultNote}</p>

              <div className="lesson-review-topics">
                <h3>{copy.reviewTitle}</h3>
                {missedQuestions.length > 0 ? (
                  <ul>
                    {missedQuestions.map((question) => <li key={question.id}>{question.reviewTopic}</li>)}
                  </ul>
                ) : (
                  <p>{copy.noMissedQuestions}</p>
                )}
              </div>

              <div className="learning-result-actions lesson-path-actions">
                <a className="button button-primary learning-lesson-button" href="/lesson/headings-paragraphs">
                  {learningUi.nextLesson}
                  <span className="button-arrow" aria-hidden="true">{isArabic ? '←' : '→'}</span>
                </a>
                <button className="button button-quiet learning-lesson-button" type="button" onClick={beginQuiz}>
                  {copy.retryQuiz}
                  <span className="button-arrow" aria-hidden="true">↻</span>
                </button>
              </div>
              <nav className="learning-result-navigation" aria-label={isArabic ? 'التنقل بين الدروس' : 'Lesson navigation'}>
                <a href="/paths/html-fundamentals">{learningUi.returnToPath}</a>
                <a href="/lesson/headings-paragraphs">{learningUi.nextLesson}</a>
              </nav>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}

export default StartLesson;
