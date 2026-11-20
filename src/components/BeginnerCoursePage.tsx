import { useEffect, useMemo, useState } from 'react';
import { getBeginnerAssessmentHref, getBeginnerLessonHref, getBeginnerProjectHref, getLearningLevelsHref, type FoundationPathId } from '../content/learningSystem';
import { getBeginnerLessons, getPersistedBeginnerLessonIds } from '../content/beginnerCurriculum';
import { messages, type Locale } from '../i18n/messages';
import { getLearningLevelsCopy } from '../i18n/learningLevels';
import { useStudentProgress } from '../state/StudentProgressProvider';
import {
  getBeginnerUnlockableIndex,
  getSessionBeginnerProgress,
  setSessionPlacementStart,
  type SessionBeginnerProgress,
} from '../utils/sessionBeginnerProgress';
import LearningHeader from './LearningHeader';

function BeginnerCoursePage({ pathId, locale, onSwitchLocale }: { pathId: FoundationPathId; locale: Locale; onSwitchLocale: () => void }) {
  const arabic = locale === 'ar';
  const levels = getLearningLevelsCopy(locale);
  const copy = messages[locale].learningSystem;
  const studentProgress = useStudentProgress();
  const [session, setSession] = useState<SessionBeginnerProgress>(getSessionBeginnerProgress);
  const startFromFirst = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('start') === 'first';
  useEffect(() => {
    if (!startFromFirst || session.placementStartIndex[pathId] === 0) return;
    if (setSessionPlacementStart(pathId, 0)) setSession(getSessionBeginnerProgress());
  }, [pathId, session.placementStartIndex, startFromFirst]);
  const lessons = getBeginnerLessons(pathId);
  const persistedCompleted = useMemo(
    () => getPersistedBeginnerLessonIds(lessons, new Set(studentProgress.lessons.filter((row) => row.completed_at).map((row) => row.lesson_id))),
    [lessons, studentProgress.lessons],
  );
  const courseSession = startFromFirst && session.placementStartIndex[pathId] !== 0
    ? { ...session, placementStartIndex: { ...session.placementStartIndex, [pathId]: 0 } }
    : session;
  const completedIds = useMemo(() => new Set([
    ...session.completedLessonIds[pathId] ?? [],
    ...persistedCompleted,
  ]), [session, pathId, persistedCompleted]);
  const startIndex = courseSession.placementStartIndex[pathId] ?? 0;
  const firstOpen = getBeginnerUnlockableIndex(pathId, lessons.map((lesson) => lesson.id), persistedCompleted, courseSession);
  const requiredCount = lessons.length - startIndex;
  const completedRequired = lessons.slice(startIndex).filter((lesson) => completedIds.has(lesson.id)).length;
  const allLessonsComplete = completedRequired === requiredCount;
  const progressPercent = requiredCount ? Math.round((completedRequired / requiredCount) * 100) : 0;
  const assessmentPassed = session.assessmentPassed.includes(pathId);
  const projectCompleted = session.projectCompleted.includes(pathId);
  const pathCopy = copy.paths[pathId];
  const formatNumber = (value: number) => new Intl.NumberFormat(arabic ? 'ar' : 'en-US').format(value);

  return (
    <div className={`app-shell learning-system-page beginner-course-page ${arabic ? 'is-arabic' : 'is-english'}`}>
      <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={copy.ui.allPaths} stageLabel={`${pathCopy.title} · ${levels.beginner}`} />
      <main className="learning-system-main section-frame">
        <nav className="learning-breadcrumb" aria-label={arabic ? 'مسار التنقل' : 'Breadcrumb'}>
          <a href={getLearningLevelsHref()}>{levels.backToLevels}</a><span aria-hidden="true">/</span>
          <span aria-current="page">{pathCopy.title} · {levels.beginner}</span>
        </nav>
        <header className="learning-system-intro beginner-course-intro">
          <p className="eyebrow"><span className="eyebrow-line" />{levels.available} · {formatNumber(50)} {arabic ? 'درسًا' : 'lessons'}</p>
          <h1>{pathCopy.title} · {levels.beginner}</h1>
          <p className="learning-system-lead">{pathCopy.summary}</p>
          <div className="beginner-progress-summary">
            <div className="beginner-progress-summary-copy">
              <strong>{arabic ? 'تقدمك في هذه الجلسة' : 'Your progress in this session'}</strong>
              <span>{formatNumber(completedRequired)} / {formatNumber(requiredCount)} {arabic ? 'درسًا مطلوبًا مكتملًا' : 'required lessons completed'}</span>
            </div>
            <div className="beginner-progress-track" role="progressbar" aria-label={arabic ? 'تقدم دورة المبتدئ' : 'Beginner course progress'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}>
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <small>{arabic ? 'قد تشمل العلامة تقدمًا محفوظًا سابقًا للدروس التأسيسية؛ تقدم الدروس الجديدة لهذه الدورة مؤقت في التبويب.' : 'The count may include previously saved foundation lessons; new-course progress is temporary to this tab.'}</small>
          </div>
        </header>

        {studentProgress.loading && <p className="student-loading-state" role="status">{arabic ? 'جارٍ تحميل التقدم السابق…' : 'Loading existing progress…'}</p>}
        {studentProgress.error && <p className="student-form-error" role="alert">{arabic ? 'تعذر تحميل التقدم السحابي السابق. يمكنك المتابعة على هذا التبويب، لكن قد لا تظهر الدروس المكتملة سابقًا.' : 'Could not load prior cloud progress. You can continue in this tab, but previously completed lessons may not appear.'}</p>}

        <ol className="beginner-lesson-list" aria-label={arabic ? 'دروس مستوى المبتدئ' : 'Beginner lessons'}>
          {lessons.map((lesson, index) => {
            const completed = completedIds.has(lesson.id);
            const skippedForPlacement = index < startIndex && !completed;
            const unlocked = skippedForPlacement || completed || index <= firstOpen;
            const title = arabic ? lesson.titleAr : lesson.titleEn;
            const status = completed
              ? (arabic ? 'مكتمل' : 'Completed')
              : skippedForPlacement
                ? (arabic ? 'مراجعة اختيارية' : 'Optional review')
                : unlocked
                  ? (arabic ? 'متاح الآن' : 'Available now')
                  : (arabic ? 'مقفل — أكمل الدرس السابق' : 'Locked — complete the previous lesson');
            return (
              <li className={`beginner-lesson-row${completed ? ' is-complete' : ''}${!unlocked ? ' is-locked' : ''}`} key={lesson.id}>
                <span className="beginner-lesson-number" dir="ltr">{formatNumber(index + 1).padStart(2, '0')}</span>
                <div className="beginner-lesson-details">
                  <h2>{title}</h2>
                  <p>{arabic ? lesson.objectiveAr : lesson.objectiveEn}</p>
                  <span className="beginner-lesson-status">{status}</span>
                </div>
                {unlocked ? (
                  <a className="button button-secondary beginner-lesson-open" href={getBeginnerLessonHref(pathId, lesson.id)}>
                    {completed ? (arabic ? 'راجع' : 'Review') : skippedForPlacement ? (arabic ? 'مراجعة' : 'Review') : (arabic ? 'افتح' : 'Open')}
                  </a>
                ) : <span className="beginner-lesson-lock" aria-label={status}>⌑</span>}
              </li>
            );
          })}
        </ol>

        <section className="beginner-course-finish" aria-labelledby="beginner-course-finish-title">
          <h2 id="beginner-course-finish-title">{arabic ? 'إنهاء مستوى المبتدئ' : 'Complete Beginner'}</h2>
          <p>{arabic ? 'يتطلب فتح المستوى التالي إكمال الدروس، واجتياز التقييم الختامي، وإنجاز المشروع.' : 'Unlocking the next level requires completing lessons, passing the final assessment, and finishing the project.'}</p>
          <div className="beginner-finish-checks">
            <span className={allLessonsComplete ? 'is-done' : ''}>{allLessonsComplete ? '✓' : '○'} {arabic ? 'الدروس' : 'Lessons'}</span>
            <span className={assessmentPassed ? 'is-done' : ''}>{assessmentPassed ? '✓' : '○'} {arabic ? 'التقييم الختامي' : 'Final assessment'}</span>
            <span className={projectCompleted ? 'is-done' : ''}>{projectCompleted ? '✓' : '○'} {arabic ? 'المشروع العملي' : 'Practical project'}</span>
          </div>
          <div className="beginner-finish-actions">
            <a className={`button ${allLessonsComplete ? 'button-primary' : 'button-secondary is-disabled'}`} aria-disabled={!allLessonsComplete} href={allLessonsComplete ? getBeginnerAssessmentHref(pathId) : undefined}>
              {arabic ? 'ابدأ التقييم الختامي' : 'Take the final assessment'}
            </a>
            <a className={`button ${assessmentPassed ? 'button-primary' : 'button-secondary is-disabled'}`} aria-disabled={!assessmentPassed} href={assessmentPassed ? getBeginnerProjectHref(pathId) : undefined}>
              {arabic ? 'افتح المشروع' : 'Open the project'}
            </a>
          </div>
          {assessmentPassed && projectCompleted && allLessonsComplete && (
            <p className="beginner-level-complete" role="status">{arabic ? 'اكتمل مستوى المبتدئ. المستوى التالي لم يُنشر بعد.' : 'Beginner is complete. The next level has not been released yet.'}</p>
          )}
        </section>

        <aside className="learning-levels-session-note" role="note">
          <strong>{levels.temporaryTitle}</strong><p>{levels.temporaryBody}</p>
        </aside>
      </main>
    </div>
  );
}

export default BeginnerCoursePage;
