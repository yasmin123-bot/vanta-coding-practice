import { useMemo, useState } from 'react';
import { getBeginnerCourseHref, getLearningLevelsHref, type FoundationPathId } from '../content/learningSystem';
import { getBeginnerLessons, getPersistedBeginnerLessonIds } from '../content/beginnerCurriculum';
import { BEGINNER_CAPSTONES } from '../content/beginnerCapstones';
import { type Locale } from '../i18n/messages';
import { getLearningLevelsCopy } from '../i18n/learningLevels';
import { useStudentProgress } from '../state/StudentProgressProvider';
import { getSessionBeginnerProgress, recordSessionProjectCompleted } from '../utils/sessionBeginnerProgress';
import LearningHeader from './LearningHeader';

function BeginnerProjectPage({ pathId, locale, onSwitchLocale }: { pathId: FoundationPathId; locale: Locale; onSwitchLocale: () => void }) {
  const arabic = locale === 'ar';
  const copy = getLearningLevelsCopy(locale);
  const capstone = BEGINNER_CAPSTONES[pathId];
  const lessons = getBeginnerLessons(pathId);
  const studentProgress = useStudentProgress();
  const session = getSessionBeginnerProgress();
  const persistedCompleted = useMemo(
    () => getPersistedBeginnerLessonIds(lessons, new Set(studentProgress.lessons.filter((row) => row.completed_at).map((row) => row.lesson_id))),
    [lessons, studentProgress.lessons],
  );
  const requiredLessons = lessons.slice(session.placementStartIndex[pathId] ?? 0);
  const lessonsComplete = requiredLessons.every((lesson) => session.completedLessonIds[pathId]?.includes(lesson.id) || persistedCompleted.has(lesson.id));
  const assessmentPassed = session.assessmentPassed.includes(pathId);
  const unlocked = lessonsComplete && assessmentPassed;
  const rubric = arabic ? capstone.rubricAr : capstone.rubricEn;
  const deliverables = arabic ? capstone.deliverablesAr : capstone.deliverablesEn;
  const objectives = arabic ? capstone.objectivesAr : capstone.objectivesEn;
  const steps = arabic ? capstone.stepsAr : capstone.stepsEn;
  const [checked, setChecked] = useState<boolean[]>(() => rubric.map(() => false));
  const [complete, setComplete] = useState(session.projectCompleted.includes(pathId));
  const [saveError, setSaveError] = useState(false);
  const allChecked = checked.length > 0 && checked.every(Boolean);
  const saveCompletion = () => {
    const saved = recordSessionProjectCompleted(pathId);
    setSaveError(!saved);
    setComplete(saved);
  };

  return (
    <div className={`app-shell learning-system-page beginner-project-page ${arabic ? 'is-arabic' : 'is-english'}`}>
      <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={copy.backToLevels} stageLabel={`${copy.beginner} · ${arabic ? 'المشروع الختامي' : 'Capstone project'}`} />
      <main className="learning-system-main section-frame">
        <nav className="learning-breadcrumb" aria-label={arabic ? 'مسار التنقل' : 'Breadcrumb'}><a href={getLearningLevelsHref()}>{copy.backToLevels}</a><span aria-hidden="true">/</span><a href={getBeginnerCourseHref(pathId)}>{copy.beginner}</a><span aria-hidden="true">/</span><span aria-current="page">{arabic ? 'المشروع الختامي' : 'Capstone'}</span></nav>
        {!unlocked ? (
          <section className="beginner-lesson-locked"><p className="eyebrow"><span className="eyebrow-line" />{copy.locked}</p><h1>{copy.projectLocked}</h1><ul className="beginner-project-prerequisites"><li className={lessonsComplete ? 'is-done' : ''}>{lessonsComplete ? '✓' : '○'} {arabic ? 'إكمال الدروس المطلوبة' : 'Complete the required lessons'}</li><li className={assessmentPassed ? 'is-done' : ''}>{assessmentPassed ? '✓' : '○'} {arabic ? 'اجتياز التقييم الختامي' : 'Pass the final assessment'}</li></ul><a className="button button-primary" href={getBeginnerCourseHref(pathId)}>{copy.openCourseFromStart}</a></section>
        ) : (
          <>
            <header className="learning-system-intro beginner-project-intro"><p className="eyebrow"><span className="eyebrow-line" />{arabic ? 'مشروع ختامي' : 'Capstone project'}</p><h1>{arabic ? capstone.titleAr : capstone.titleEn}</h1><p className="learning-system-lead">{arabic ? capstone.briefAr : capstone.briefEn}</p><p className="beginner-exercise-note">{copy.temporaryBody}</p></header>
            <section className="beginner-project-section"><h2>{arabic ? 'أهداف التعلم' : 'Learning objectives'}</h2><ul>{objectives.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section className="beginner-project-section"><h2>{arabic ? 'المطلوب تسليمه' : 'Deliverables'}</h2><ul>{deliverables.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section className="beginner-project-section"><h2>{arabic ? 'خطوات مقترحة' : 'Suggested steps'}</h2><ol>{steps.map((item) => <li key={item}>{item}</li>)}</ol></section>
            <section className="beginner-project-rubric"><h2>{copy.projectChecklistTitle}</h2><p>{copy.projectSelfCheck}</p><fieldset disabled={complete}><legend>{arabic ? 'راجع كل معيار بعد إنهاء العمل' : 'Check each criterion after completing the work'}</legend>{rubric.map((item, index) => <label className="beginner-exercise-confirm" key={item}><input type="checkbox" checked={checked[index]} onChange={(event) => setChecked((current) => current.map((value, itemIndex) => itemIndex === index ? event.target.checked : value))} /><span>{item}</span></label>)}</fieldset>{saveError && <p role="alert" className="student-form-error">{copy.sessionSaveError}</p>}{complete ? <p role="status" className="beginner-level-complete">{copy.projectSaved}</p> : <button className="button button-primary" type="button" disabled={!allChecked} onClick={saveCompletion}>{arabic ? 'أؤكد إكمال المشروع' : 'Confirm project completion'}</button>}</section>
            <section className="beginner-course-finish"><h2>{arabic ? 'ماذا بعد؟' : 'What comes next?'}</h2><p>{arabic ? 'تم تصميم المتطلبات لتكون قابلة للمراجعة الذاتية. لا يتم رفع ملفات أو فحص مشروعك تلقائيًا.' : 'The criteria are for self-review. No files are uploaded and the project is not automatically inspected.'}</p>{complete && <p className="beginner-level-complete" role="status">{arabic ? 'أكملت متطلبات مستوى المبتدئ. المستوى المتوسط غير منشور بعد.' : 'You completed the Beginner requirements. Intermediate has not been released yet.'}</p>}</section>
          </>
        )}
      </main>
    </div>
  );
}

export default BeginnerProjectPage;
