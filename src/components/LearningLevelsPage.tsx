import { FOUNDATION_PATH_IDS, getBeginnerCourseHref, getLearningPathHref, getPlacementTestHref, LEARNING_PATH_ARTWORK } from '../content/learningSystem';
import { messages, type Locale } from '../i18n/messages';
import { getLearningLevelsCopy } from '../i18n/learningLevels';
import LearningHeader from './LearningHeader';

function LearningLevelsPage({ locale, onSwitchLocale }: { locale: Locale; onSwitchLocale: () => void }) {
  const isArabic = locale === 'ar';
  const copy = getLearningLevelsCopy(locale);
  const learningCopy = messages[locale].learningSystem;
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
                    <div className="learning-levels-tier is-locked" aria-disabled="true">
                      <span className="learning-levels-tier-index" aria-hidden="true">02</span>
                      <span><strong>{copy.intermediate}</strong><small>{copy.locked}</small></span>
                    </div>
                    <div className="learning-levels-tier is-locked" aria-disabled="true">
                      <span className="learning-levels-tier-index" aria-hidden="true">03</span>
                      <span><strong>{copy.advanced}</strong><small>{copy.locked}</small></span>
                    </div>
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

export default LearningLevelsPage;
