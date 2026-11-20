import type { Locale } from '../i18n/messages';
import { getJourneyLessonHref } from '../content/learningSystem';
import type { FoundationPathId } from '../content/learningSystem';
import type { JourneyCourse } from '../content/journeyCurriculum';

type Props = {
  course: JourneyCourse;
  locale: Locale;
  pathId: FoundationPathId;
  completedLessonIds: string[];
};

const localized = (copy: { ar: string; en: string }, locale: Locale) => copy[locale];

export default function JourneyCourseOutline({ course, locale, pathId, completedLessonIds }: Props) {
  const completed = new Set(completedLessonIds);

  return (
    <div className="journey-units">
      {course.units.map((unit, unitIndex) => {
        const lessons = unit.lessonIds.map((id) => course.lessons.find((lesson) => lesson.id === id)).filter((lesson) => lesson !== undefined);
        return (
          <section className="journey-unit" key={unit.id} aria-labelledby={`${unit.id}-title`}>
            <header className="journey-unit-header">
              <p className="eyebrow" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                {locale === 'ar' ? `الوحدة ${unitIndex + 1} · ${lessons.length} دروس` : `Unit ${unitIndex + 1} · ${lessons.length} lessons`}
              </p>
              <h2 id={`${unit.id}-title`}>{localized(unit.title, locale)}</h2>
              <p>{localized(unit.outcome, locale)}</p>
              <p className="journey-unit-bridge"><strong>{locale === 'ar' ? 'الخطوة التالية:' : 'Next:'}</strong> {localized(unit.bridge, locale)}</p>
            </header>
            <div className="journey-course-list">
              {lessons.map((lesson) => {
                const done = completed.has(lesson.id);
                return (
                  <article className={`journey-row ${done ? 'is-done' : ''}`} key={lesson.id}>
                    <span className="journey-number" dir="ltr">{String(lesson.sequence).padStart(2, '0')}</span>
                    <div>
                      <h3>{localized(lesson.title, locale)}</h3>
                      <p>{localized(lesson.objective, locale)}</p>
                      <small>{done ? (locale === 'ar' ? 'مكتمل' : 'Completed') : (locale === 'ar' ? 'متاح' : 'Available')}</small>
                    </div>
                    <a className="button button-secondary" href={getJourneyLessonHref(pathId, course.level, lesson.id)}>
                      {done ? (locale === 'ar' ? 'مراجعة' : 'Review') : (locale === 'ar' ? 'ابدأ' : 'Start')}
                    </a>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
