import { useState } from 'react';
import type { JourneyLesson, JourneyLocaleText } from '../content/journeyCurriculum';
import type { Locale } from '../i18n/messages';
import type { PracticeRequirementResult } from '../content/practiceTypes';
import PracticeCodeEditor from './PracticeCodeEditor';

type Props = {
  lesson: JourneyLesson;
  locale: Locale;
  code: string;
  onCodeChange: (value: string) => void;
  results: PracticeRequirementResult[] | null;
  onCheck: () => void;
  saved: boolean;
};

const localized = (copy: JourneyLocaleText, locale: Locale) => copy[locale];

export default function JourneyLessonWorkspace({ lesson, locale, code, onCodeChange, results, onCheck, saved }: Props) {
  const [hintLevel, setHintLevel] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [checkSubmitted, setCheckSubmitted] = useState(false);
  const [manualReviewConfirmed, setManualReviewConfirmed] = useState(false);
  const isArabic = locale === 'ar';
  const language = lesson.pathId === 'html-fundamentals' ? 'html' : lesson.pathId === 'css-fundamentals' ? 'css' : 'javascript';
  const correct = selectedChoice === lesson.knowledgeCheck.correctChoiceId;

  return (
    <div className="journey-lesson-grid">
      <article className="journey-learning-copy">
        <h2>{isArabic ? 'الشرح' : 'Concept'}</h2>
        {lesson.sections.map((section, index) => (
          <section key={`${lesson.id}-section-${index}`}>
            <h3>{localized(section.title, locale)}</h3>
            <p>{localized(section, locale)}</p>
            {section.code && <pre dir="ltr"><code>{section.code}</code></pre>}
          </section>
        ))}
        <section className="journey-lesson-example">
          <h3>{isArabic ? 'مثال مشروح' : 'Worked example'}</h3>
          <pre dir="ltr"><code>{lesson.example.code}</code></pre>
          <p>{localized(lesson.example.explanation, locale)}</p>
        </section>
        {lesson.commonMistakes.length > 0 && (
          <section className="journey-common-mistakes">
            <h3>{isArabic ? 'أخطاء شائعة' : 'Common mistakes'}</h3>
            <ul>{lesson.commonMistakes.map((mistake, index) => <li key={`${lesson.id}-mistake-${index}`}>{localized(mistake, locale)}</li>)}</ul>
          </section>
        )}
        <section>
          <h2>{isArabic ? 'تمرين عملي' : 'Practice'}</h2>
          <p>{localized(lesson.practice, locale)}</p>
          <div className="journey-hints">
            {lesson.hints.slice(0, hintLevel).map((hint, index) => (
              <p className="journey-hint" key={`${lesson.id}-hint-${index}`}>
                <strong>{isArabic ? `تلميح ${index + 1}:` : `Hint ${index + 1}:`}</strong> {localized(hint, locale)}
              </p>
            ))}
            <button
              className="button button-secondary"
              type="button"
              onClick={() => setHintLevel(hintLevel >= lesson.hints.length ? 0 : hintLevel + 1)}
            >
              {hintLevel === 0
                ? (isArabic ? 'أظهر التلميح الأول' : 'Reveal first hint')
                : hintLevel < lesson.hints.length
                  ? (isArabic ? 'أظهر التلميح التالي' : 'Reveal next hint')
                  : (isArabic ? 'إخفاء التلميحات' : 'Hide hints')}
            </button>
          </div>
        </section>
        <section className="journey-quick-check">
          <h2>{isArabic ? 'تحقق سريع' : 'Quick check'}</h2>
          <fieldset className="journey-question" disabled={checkSubmitted}>
            <legend>{localized(lesson.knowledgeCheck.prompt, locale)}</legend>
            {lesson.knowledgeCheck.choices.map((choice) => (
              <label key={choice.id}>
                <input
                  type="radio"
                  name={lesson.knowledgeCheck.id}
                  checked={selectedChoice === choice.id}
                  onChange={() => setSelectedChoice(choice.id)}
                />
                {localized(choice.text, locale)}
              </label>
            ))}
          </fieldset>
          {!checkSubmitted ? (
            <button className="button button-secondary" type="button" disabled={!selectedChoice} onClick={() => setCheckSubmitted(true)}>
              {isArabic ? 'تحقق من الإجابة' : 'Check answer'}
            </button>
          ) : (
            <>
              <p className={correct ? 'is-met' : 'is-missing'} role="status">
                {correct ? (isArabic ? 'إجابة صحيحة. ' : 'Correct. ') : (isArabic ? 'ليست الإجابة الصحيحة بعد. ' : 'Not quite. ')}
                {localized(lesson.knowledgeCheck.feedback, locale)}
              </p>
              <button className="button button-secondary" type="button" onClick={() => { setSelectedChoice(null); setCheckSubmitted(false); }}>
                {isArabic ? 'جرّب مرة أخرى' : 'Try again'}
              </button>
            </>
          )}
        </section>
        <section className="journey-lesson-summary">
          <h2>{isArabic ? 'الخلاصة' : 'Summary'}</h2>
          <p>{localized(lesson.summary, locale)}</p>
        </section>
      </article>
      <section className="journey-exercise" aria-labelledby="journey-exercise-title">
        <h2 id="journey-exercise-title">{isArabic ? 'اكتب الحل' : 'Write your solution'}</h2>
        <PracticeCodeEditor
          language={language}
          locale={locale}
          label={isArabic ? 'محرر التمرين' : 'Exercise editor'}
          value={code}
          onChange={onCodeChange}
          validationRules={lesson.validationRules}
          validationResults={results ?? []}
        />
        {lesson.manualReview && (
          <>
            <p className="journey-disclaimer">
              {isArabic
                ? 'هذا التمرين يحتاج إلى مراجعة أو قياس خارج المحرر. لا تتحقق المنصة من صحة الملاحظة ولا تنفّذ الشيفرة.'
                : 'This exercise needs review or measurement outside the editor. Mabda does not verify the observation or execute this code.'}
            </p>
            <label className="journey-rubric">
              <input type="checkbox" checked={manualReviewConfirmed} onChange={(event) => setManualReviewConfirmed(event.currentTarget.checked)} />
              {isArabic
                ? 'أؤكد أنني راجعت عملي وفق متطلبات التمرين، وأفهم أن المنصة لم تنفّذ الشيفرة.'
                : 'I confirm that I reviewed my work against the exercise requirements and understand the platform did not execute the code.'}
            </label>
          </>
        )}
        <button className="button button-primary" type="button" disabled={lesson.manualReview && !manualReviewConfirmed} onClick={onCheck}>
          {lesson.manualReview
            ? (isArabic ? 'تأكيد المراجعة اليدوية' : 'Record manual review')
            : (isArabic ? 'تحقق من المتطلبات' : 'Check requirements')}
        </button>
        {results && results.length > 0 && <ul className="journey-results">{results.map((result) => (
          <li className={result.passed ? 'is-met' : 'is-missing'} key={result.id}>
            <strong>{result.passed ? '✓' : '○'} {result.label}</strong><p>{result.explanation}</p>
          </li>
        ))}</ul>}
        {saved && <p role="status">{lesson.manualReview
          ? (isArabic ? 'سُجلت المراجعة اليدوية. لم تُنفّذ الشيفرة ولم تتحقق المنصة من النتيجة.' : 'Manual review recorded. The code was not executed and the result was not verified by the app.')
          : (isArabic ? 'اكتمل هذا الدرس.' : 'Lesson completed.')}</p>}
        <p className="journey-disclaimer">
          {lesson.manualReview
            ? (isArabic ? 'الإكمال هنا إقرار ذاتي بالمراجعة، وليس نتيجة تحقق آلي أو تشغيل للشيفرة.' : 'Completion here is a self-attestation, not an automated check or code execution.')
            : isArabic
            ? 'التحقق يفحص البنية وقواعد محددة فقط، ولا يثبت تشغيل التطبيق أو سلوكه كاملًا.'
            : 'Validation checks selected structure and rules only; it does not prove the complete runtime behavior.'}
        </p>
      </section>
    </div>
  );
}
