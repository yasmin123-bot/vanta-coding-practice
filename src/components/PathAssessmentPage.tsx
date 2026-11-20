import { useMemo, useState } from 'react';
import { PATH_ASSESSMENTS } from '../content/pathAssessments';
import type { FoundationPathId } from '../content/learningSystem';
import { messages, type Locale } from '../i18n/messages';
import LearningHeader from './LearningHeader';

type PathAssessmentPageProps = {
  pathId: FoundationPathId;
  locale: Locale;
  onSwitchLocale: () => void;
};

function fillTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}

function PathAssessmentPage({ pathId, locale, onSwitchLocale }: PathAssessmentPageProps) {
  const copy = messages[locale].learningSystem;
  const ui = copy.ui;
  const pathCopy = copy.paths[pathId];
  const questions = useMemo(() => PATH_ASSESSMENTS[pathId], [pathId]);
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [firstAttemptResults, setFirstAttemptResults] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const question = questions[questionIndex];
  const correctChoice = question?.choices.find((choice) => choice.id === question.correctChoiceId);
  const isCorrect = selectedChoiceId === question?.correctChoiceId;
  const numberLocale = locale === 'ar' ? 'ar' : 'en-US';

  const answer = (choiceId: string) => {
    if (!question || feedbackVisible) return;
    setSelectedChoiceId(choiceId);
    setFeedbackVisible(true);
    if (!(question.id in firstAttemptResults)) {
      setFirstAttemptResults((current) => ({ ...current, [question.id]: choiceId === question.correctChoiceId }));
    }
  };

  const continueAfterCorrectAnswer = () => {
    if (!question || !isCorrect) return;
    if (questionIndex === questions.length - 1) {
      const finalScore = Object.values(firstAttemptResults).filter(Boolean).length;
      setScore(finalScore);
      setFinished(true);
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedChoiceId(null);
    setFeedbackVisible(false);
  };

  const retry = () => {
    setSelectedChoiceId(null);
    setFeedbackVisible(false);
  };

  const restart = () => {
    setStarted(false);
    setQuestionIndex(0);
    setSelectedChoiceId(null);
    setFeedbackVisible(false);
    setFirstAttemptResults({});
    setFinished(false);
    setScore(0);
  };

  return (
    <div className={`app-shell learning-system-page path-assessment-page ${locale === 'ar' ? 'is-arabic' : 'is-english'}`}>
      <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={ui.allPaths} stageLabel={pathCopy.title} />
      <main className="learning-system-main section-frame">
        <nav className="learning-breadcrumb" aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}>
          <a href="/paths">{ui.allPaths}</a><span aria-hidden="true">/</span><a href={`/paths/${pathId}`}>{pathCopy.title}</a><span aria-hidden="true">/</span><span aria-current="page">{ui.finalAssessmentTitle}</span>
        </nav>

        <header className="learning-system-intro">
          <p className="eyebrow"><span className="eyebrow-line" />{ui.finalAssessmentTitle}</p>
          <h1>{pathCopy.title}</h1>
          <p className="learning-system-lead">{ui.finalAssessmentBody}</p>
        </header>

        {!started ? (
          <section className="path-assessment-card" aria-labelledby="assessment-start-title">
            <div className="path-assessment-card-mark" aria-hidden="true">{String(questions.length).padStart(2, '0')}</div>
            <div>
              <h2 id="assessment-start-title">{ui.finalAssessmentTitle}</h2>
              <p>{ui.assessmentScoreNote}</p>
              <p className="learning-session-note">{ui.assessmentNotSaved}</p>
              <button className="button button-primary" type="button" onClick={() => setStarted(true)}>{ui.assessmentStart}</button>
            </div>
          </section>
        ) : finished ? (
          <section className="path-assessment-result" aria-live="polite" aria-labelledby="assessment-result-title">
            <p className="eyebrow"><span className="eyebrow-line" />{ui.resultTitle}</p>
            <h2 id="assessment-result-title">{new Intl.NumberFormat(numberLocale).format(score)} / {new Intl.NumberFormat(numberLocale).format(questions.length)}</h2>
            <p>{ui.scoreLabel}</p>
            <p className="learning-session-note">{ui.assessmentScoreNote} {ui.assessmentNotSaved}</p>
            <div className="learning-not-found-actions">
              <button className="button button-primary" type="button" onClick={restart}>{ui.assessmentRetry}</button>
              <a className="button button-quiet" href={`/paths/${pathId}`}>{ui.assessmentBackToPath}</a>
            </div>
          </section>
        ) : question ? (
          <section className="path-assessment-question" aria-labelledby="assessment-question-title">
            <div className="path-assessment-progress">
              <span>{fillTemplate(ui.questionProgress, {
                current: new Intl.NumberFormat(numberLocale).format(questionIndex + 1),
                total: new Intl.NumberFormat(numberLocale).format(questions.length),
              })}</span>
              <div role="progressbar" aria-label={ui.finalAssessmentTitle} aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={questionIndex + 1}>
                <span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} />
              </div>
            </div>
            <h2 id="assessment-question-title" dir="auto">{locale === 'ar' ? question.prompt_ar : question.prompt_en}</h2>
            <fieldset className="path-assessment-choices" disabled={feedbackVisible}>
              <legend className="visually-hidden">{ui.assessmentStart}</legend>
              {question.choices.map((choice) => {
                const label = locale === 'ar' ? choice.label_ar : choice.label_en;
                const selected = selectedChoiceId === choice.id;
                return (
                  <label className={`path-assessment-choice ${selected ? (isCorrect ? 'is-correct' : 'is-incorrect') : ''}`} key={choice.id}>
                    <input type="radio" name={`assessment-${question.id}`} value={choice.id} checked={selected} onChange={() => answer(choice.id)} />
                    <span className="path-assessment-choice-marker" aria-hidden="true" />
                    <span dir="auto">{choice.kind === 'code' ? <code dir="ltr">{label}</code> : label}</span>
                  </label>
                );
              })}
            </fieldset>
            {feedbackVisible && (
              <div className={`path-assessment-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`} role="status">
                <strong>{isCorrect ? ui.correctTitle : ui.incorrectTitle}</strong>
                <p>{isCorrect
                  ? (locale === 'ar' ? question.correctFeedback_ar : question.correctFeedback_en)
                  : `${locale === 'ar' ? question.incorrectFeedback_ar : question.incorrectFeedback_en} ${locale === 'ar' ? 'الإجابة الأنسب: ' : 'A stronger answer is: '}${correctChoice ? (locale === 'ar' ? correctChoice.label_ar : correctChoice.label_en) : ''}`}</p>
                <p className="path-assessment-review-topic">{locale === 'ar' ? question.reviewTopic_ar : question.reviewTopic_en}</p>
                {isCorrect
                  ? <button className="button button-primary" type="button" onClick={continueAfterCorrectAnswer}>{questionIndex === questions.length - 1 ? ui.assessmentFinish : ui.nextQuestion}</button>
                  : <button className="button button-quiet" type="button" onClick={retry}>{ui.tryAgain}</button>}
              </div>
            )}
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default PathAssessmentPage;
