import { FOUNDATION_PATH_IDS, getBeginnerCourseHref, getLearningPathHref, getPlacementTestHref, LEARNING_PATH_ARTWORK } from '../content/learningSystem';
import { messages, type Locale } from '../i18n/messages';
import { getLearningLevelsCopy } from '../i18n/learningLevels';
import LearningHeader from './LearningHeader';
import { getBeginnerLessons, getPersistedBeginnerLessonIds } from '../content/beginnerCurriculum';
import { getSessionBeginnerProgress } from '../utils/sessionBeginnerProgress';
import { getJourneyCourseGate, getJourneyProgress } from '../utils/journeyProgress';
import { useStudentProgress } from '../state/StudentProgressProvider';

function LearningLevelsPage({ locale, onSwitchLocale }: { locale: Locale; onSwitchLocale: () => void }) {
  const isArabic = locale === 'ar';
  const copy = getLearningLevelsCopy(locale);
  const learningCopy = messages[locale].learningSystem;
  const studentProgress = useStudentProgress();
  const beginnerProgress = getSessionBeginnerProgress();
  const journeyProgress = getJourneyProgress();
  const count = new Intl.NumberFormat(isArabic ? 'ar' : 'en-US').format(50);
  const lessonsLabel = copy.lessonsCount.replace('{count}', count);

  return (
    <div className={`app-shell learning-system-page learning-levels-page ${isArabic ? 'is-arabic' : 'is-english'}`}>
      <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={learningCopy.ui.allPaths} stageLabel={copy.title} />
      <main className="learning-system-main section-frame">
        <header className="learning-system-intro learning-levels-intro">
          <p className="eyebrow"><span className="eyebrow-line" />{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p className="learning-system-lead">{copy.lead}</p>
        </header>

        <section className="learning-levels-grid" aria-label={copy.choosePath}>
          {FOUNDATION_PATH_IDS.map((pathId) => {
            const pathCopy = learningCopy.paths[pathId];
            const savedBeginner = getPersistedBeginnerLessonIds(getBeginnerLessons(pathId), new Set(studentProgress.lessons.filter((row) => row.completed_at).map((row) => row.lesson_id)));
            const intermediateOpen = getJourneyCourseGate('intermediate', pathId, beginnerProgress, savedBeginner, journeyProgress).unlocked;
            const professionalOpen = getJourneyCourseGate('professional', pathId, beginnerProgress, savedBeginner, journeyProgress).unlocked;
            return (
              <article className="learning-levels-subject" key={pathId}>
                <div className="learning-levels-subject-art">
                  <img src={LEARNING_PATH_ARTWORK[pathId]} alt="" loading="lazy" decoding="async" />
                </div>
                <div className="learning-levels-subject-content">
                  <p className="learning-levels-subject-kicker">{copy.available} · {lessonsLabel}</p>
                  <h2>{pathCopy.title}</h2>
                  <p>{pathCopy.summary}</p>
                  <a className="button button-primary" href={getBeginnerCourseHref(pathId)}>
                    {copy.startBeginner}
                  </a>

                  <div className="learning-levels-tier-list">
                    <div className="learning-levels-tier is-available">
                      <span className="learning-levels-tier-index" aria-hidden="true">01</span>
                      <span><strong>{copy.beginner}</strong><small>{lessonsLabel} · {copy.available}</small></span>
                    </div>
                    <TierLink index="02" label={copy.intermediate} unlocked={intermediateOpen} href={`/levels/${pathId}/intermediate`} note={intermediateOpen ? copy.available : (isArabic ? 'أكمل المبتدئ: الدروس والتقييم والمشروع' : 'Complete Beginner lessons, assessment, and project')} />
                    <TierLink index="03" label={copy.advanced} unlocked={professionalOpen} href={`/levels/${pathId}/professional`} note={professionalOpen ? copy.available : (isArabic ? 'أكمل المتوسط ومشروعه' : 'Complete Intermediate and its capstone')} />
                  </div>

                  <details className="learning-levels-placement">
                    <summary>{copy.placementTitle}</summary>
                    <p>{copy.placementBody}</p>
                    <a href={getPlacementTestHref(pathId)}>{copy.takePlacement}</a>
                    <a href={`${getBeginnerCourseHref(pathId)}?start=first`}>{copy.skipPlacement}</a>
                  </details>
                  <a className="learning-levels-legacy-link" href={getLearningPathHref(pathId)}>
                    {isArabic ? 'المسار التأسيسي الحالي' : 'Existing foundation path'}
                  </a>
                </div>
              </article>
            );
          })}
        </section>

        <section className="learning-levels-unlock" aria-labelledby="learning-levels-unlock-title">
          <h2 id="learning-levels-unlock-title">{copy.unlockTitle}</h2>
          <ol>{copy.unlockItems.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>

        <aside className="learning-levels-session-note" role="note">
          <strong>{copy.temporaryTitle}</strong>
          <p>{copy.temporaryBody}</p>
        </aside>
      </main>
    </div>
  );
}

function TierLink({ index, label, unlocked, href, note }: { index: string; label: string; unlocked: boolean; href: string; note: string }) {
  const className = `learning-levels-tier ${unlocked ? 'is-available' : 'is-locked'}`;
  const content = <><span className="learning-levels-tier-index" aria-hidden="true">{index}</span><span><strong>{label}</strong><small>{note}</small></span></>;
  return unlocked ? <a className={className} href={href}>{content}</a> : <div className={className} aria-disabled="true">{content}</div>;
}

export default LearningLevelsPage;
