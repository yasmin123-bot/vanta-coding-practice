import { useMemo, useState } from 'react';
import { getJourneyCourseHref, getLearningLevelsHref, type FoundationPathId } from '../content/learningSystem';
import { getJourneyCourse, type JourneyLevel, type JourneyLocaleText } from '../content/journeyCurriculum';
import { JOURNEY_PROJECTS } from '../content/journeyProjects';
import { messages, type Locale } from '../i18n/messages';
import { useStudentProgress } from '../state/StudentProgressProvider';
import { getBeginnerLessons, getPersistedBeginnerLessonIds } from '../content/beginnerCurriculum';
import { getSessionBeginnerProgress } from '../utils/sessionBeginnerProgress';
import { getJourneyCourseGate, getJourneyCourseProgress, getJourneyProgress, getJourneyProjectDraft, getJourneyProjectGate, recordJourneyAssessmentResult, recordJourneyLessonComplete, recordJourneyProjectReview, recordJourneyProjectStageComplete, saveJourneyProjectDraft, type JourneyGate } from '../utils/journeyProgress';
import { validatePracticeRules, type PracticeSource } from '../utils/practiceValidation';
import LearningHeader from './LearningHeader';
import PracticeCodeEditor from './PracticeCodeEditor';
import JourneyCourseOutline from './JourneyCourseOutline';
import JourneyLessonWorkspace from './JourneyLessonWorkspace';

type PageProps = { locale: Locale; onSwitchLocale: () => void; kind: 'course'|'lesson'|'assessment'|'project'; pathId?: FoundationPathId; level: JourneyLevel; lessonId?: string };
const text = (copy: JourneyLocaleText, locale: Locale) => copy[locale];
const levelText = (level: JourneyLevel, locale: Locale) => level === 'intermediate' ? (locale === 'ar' ? 'المتوسط' : 'Intermediate') : (locale === 'ar' ? 'المحترف' : 'Professional');

function JourneyPage({ locale, onSwitchLocale, kind, pathId = 'html-fundamentals', level, lessonId }: PageProps) {
  const ar = locale === 'ar';
  const subject = messages[locale].learningSystem.paths[pathId];
  const course = getJourneyCourse(level, pathId);
  const courseProgress = getJourneyCourseProgress(level, pathId);
  const [progress, setProgress] = useState(getJourneyProgress);
  const [saveFailed, setSaveFailed] = useState(false);
  const [beginner] = useState(getSessionBeginnerProgress);
  const cloud = useStudentProgress();
  const priorIds = getPersistedBeginnerLessonIds(getBeginnerLessons(pathId), new Set(cloud.lessons.filter(row => row.completed_at).map(row => row.lesson_id)));
  const courseGate = getJourneyCourseGate(level, pathId, beginner, priorIds, progress);
  const projectGate = getJourneyProjectGate(level, progress);
  const gate: JourneyGate = kind === 'project' ? projectGate : courseGate;
  const project = JOURNEY_PROJECTS[level];
  const refresh = () => setProgress(getJourneyProgress());
  const reportSaveResult = (saved: boolean) => { setSaveFailed(!saved); return saved; };
  const blocked = !gate.unlocked;
  const header = <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={messages[locale].learningSystem.ui.allPaths} stageLabel={`${subject.title} · ${levelText(level, locale)}`} />;
  const wrapper = (body: React.ReactNode) => <div className={`app-shell learning-system-page journey-page ${ar ? 'is-arabic' : 'is-english'}`}>{header}<main className="learning-system-main section-frame"><nav className="learning-breadcrumb" aria-label={ar?'مسار التنقل':'Breadcrumb'}><a href={getLearningLevelsHref()}>{ar?'المستويات':'Levels'}</a><span aria-hidden="true"> / </span><span>{subject.title} · {levelText(level, locale)}</span></nav>{body}{saveFailed && <p className="is-missing" role="alert">{ar ? 'تعذر حفظ التقدم أو المسودة على هذا الجهاز. قد لا تبقى التغييرات بعد مغادرة الصفحة؛ تحقق من مساحة التخزين في المتصفح ثم أعد المحاولة.' : 'Could not save progress or this draft in this browser. Changes may be lost after leaving this page; check browser storage and try again.'}</p>}</main></div>;
  const gateMessage = blocked && <section className="journey-gate" aria-labelledby="journey-gate-title"><h1 id="journey-gate-title">{ar?'هذا المستوى مقفل حاليًا':'This level is currently locked'}</h1><p>{ar?'أكمل المتطلبات السابقة لفتح هذا المسار. التقدم الحالي لا يُمسح.':'Complete the prerequisites to unlock this path. Existing progress is preserved.'}</p><ul>{gate.requirements.map(req=><li key={req.id} className={req.met?'is-met':'is-missing'}>{req.met?'✓':'○'} <a href={req.href}>{ar?'أكمل المتطلب السابق':'Complete the prerequisite'}</a></li>)}</ul></section>;

  if (kind === 'course') return wrapper(<>{gateMessage}{!blocked && <><header className="learning-system-intro"><p className="eyebrow">{levelText(level,locale)} · {course.lessons.length} {ar?'دروس':'lessons'}</p><h1>{text(course.title,locale)}</h1><p className="learning-system-lead">{text(course.summary,locale)}</p></header><JourneyCourseOutline course={course} locale={locale} pathId={pathId} completedLessonIds={courseProgress.completedLessonIds}/><div className="journey-actions"><a className="button button-primary" href={`/levels/${pathId}/${level}/assessment`}>{ar?'التقييم الختامي':'Final assessment'}</a><a className="button button-secondary" href={`/levels/${level}/project`}>{ar?'المشروع النهائي للمستوى':'Level capstone project'}</a></div></>}</>);

  if (kind === 'lesson') {
    const lesson = course.lessons.find(item=>item.id===lessonId);
    if (!lesson) return wrapper(<section className="journey-gate"><h1>{ar?'الدرس غير موجود':'Lesson not found'}</h1></section>);
    const lessonIndex = course.lessons.findIndex(item => item.id === lesson.id);
    const priorLessonsComplete = course.lessons.slice(0, lessonIndex).every(item => courseProgress.completedLessonIds.includes(item.id));
    const access = courseGate.unlocked && priorLessonsComplete;
    const [code,setCode]=useState(lesson.starterCode);
    const [results,setResults]=useState<ReturnType<typeof validatePracticeRules>|null>(null);
    const [saved,setSaved]=useState(courseProgress.completedLessonIds.includes(lesson.id));
    const source: PracticeSource = lesson.pathId==='html-fundamentals'?code: lesson.pathId==='css-fundamentals'?{html_code:'',css_code:code,js_code:''}:{html_code:'',css_code:'',js_code:code};
    const run = () => {
      if (lesson.manualReview) {
        if (reportSaveResult(recordJourneyLessonComplete(level, pathId, lesson.id))) {
          setSaved(true);
          refresh();
        }
        return;
      }
      const checked = validatePracticeRules(lesson.pathId === 'html-fundamentals' ? 'html' : lesson.pathId === 'css-fundamentals' ? 'css' : 'javascript', source, lesson.validationRules, locale);
      setResults(checked);
      if (checked.length && checked.every((result) => result.passed)) {
        if (reportSaveResult(recordJourneyLessonComplete(level, pathId, lesson.id))) {
          setSaved(true);
          refresh();
        }
      }
    };
    return wrapper(access?<><header className="learning-system-intro"><p className="eyebrow">{levelText(level,locale)} · {lesson.sequence}/{course.lessons.length}</p><h1>{text(lesson.title,locale)}</h1><p className="learning-system-lead">{text(lesson.objective,locale)}</p></header><JourneyLessonWorkspace lesson={lesson} locale={locale} code={code} onCodeChange={setCode} results={results} onCheck={run} saved={saved}/><a className="button button-secondary" href={getJourneyCourseHref(pathId,level)}>{ar?'العودة إلى الدورة':'Back to course'}</a></>:gateMessage);
  }

  if (kind === 'assessment') {
    const savedScore = courseProgress.assessmentLastScore ?? courseProgress.assessmentBestScore;
    const [answers,setAnswers]=useState<Record<string,string>>({});const [submitted,setSubmitted]=useState(false);const [attemptStarted,setAttemptStarted]=useState(savedScore === null && !courseProgress.assessmentPassed);const score=course.assessment.filter(q=>answers[q.id]===q.correctChoiceId).length;
    const lessonGate=course.lessons.every(l=>courseProgress.completedLessonIds.includes(l.id));
    if(!lessonGate||blocked)return wrapper(<>{gateMessage}<p className="journey-gate">{ar?'أكمل دروس هذا المسار أولًا قبل التقييم.':'Complete this course’s lessons before taking the assessment.'}</p></>);
    const hasSavedResult = savedScore !== null || courseProgress.assessmentPassed;
    if (!attemptStarted && hasSavedResult) {
      const savedPassed = savedScore !== null ? savedScore >= course.passingScore : courseProgress.assessmentPassed;
      const savedLabel = savedScore === null
        ? (ar ? 'التقييم مجتاز؛ لا تتوفر درجة محفوظة في هذا السجل.' : 'Assessment passed; no score is available in this saved record.')
        : `${courseProgress.assessmentLastScore !== null ? (ar ? 'آخر نتيجة' : 'Latest result') : (ar ? 'الدرجة المحفوظة' : 'Saved score')}: ${savedScore}/${course.assessment.length}`;
      return wrapper(<><header className="learning-system-intro"><p className="eyebrow">{levelText(level,locale)} · {course.assessment.length} {ar?'أسئلة':'questions'}</p><h1>{ar?'التقييم الختامي':'Final assessment'} · {subject.title}</h1><p className="learning-system-lead">{ar?`تحتاج إلى ${course.passingScore} من ${course.assessment.length} إجابات صحيحة على الأقل.`:`Pass with at least ${course.passingScore} of ${course.assessment.length} correct answers.`}</p></header><section className="journey-results" role="status"><h2>{savedLabel}</h2><p>{savedPassed?(ar?'اجتزت التقييم.':'Assessment passed.'):(ar?'لم تجتز آخر تقييم محفوظ.':'The saved assessment result did not pass.')}</p>{courseProgress.assessmentPassed && !savedPassed && <p>{ar?'اجتياز سابق محفوظ، وما زال يفتح المستوى التالي.':'A previous pass is preserved and still unlocks the next level.'}</p>}<button className="button button-secondary" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setAttemptStarted(true);}}>{ar?'بدء محاولة جديدة':'Start a new attempt'}</button></section><a href={getJourneyCourseHref(pathId,level)}>{ar?'العودة للدروس':'Back to lessons'}</a></>);
    }
    return wrapper(<><header className="learning-system-intro"><p className="eyebrow">{levelText(level,locale)} · {course.assessment.length} {ar?'أسئلة':'questions'}</p><h1>{ar?'التقييم الختامي':'Final assessment'} · {subject.title}</h1><p className="learning-system-lead">{ar?`تحتاج إلى ${course.passingScore} من ${course.assessment.length} إجابات صحيحة على الأقل.`:`Pass with at least ${course.passingScore} of ${course.assessment.length} correct answers.`}</p></header>{course.assessment.map((q,index)=><fieldset className="journey-question" key={q.id} disabled={submitted}><legend>{index+1}. {text(q.prompt,locale)}</legend>{q.choices.map(choice=><label key={choice.id}><input type="radio" name={q.id} checked={answers[q.id]===choice.id} onChange={()=>setAnswers({...answers,[q.id]:choice.id})}/>{text(choice.text,locale)}</label>)}{submitted&&<p>{answers[q.id]===q.correctChoiceId?'✓ ':''}{text(q.feedback,locale)}</p>}</fieldset>)}{!submitted?<button className="button button-primary" type="button" onClick={()=>{setSubmitted(true);if(reportSaveResult(recordJourneyAssessmentResult(level,pathId,score)))refresh();}}>{ar?'اعرض النتيجة':'Submit assessment'}</button>:<section className="journey-results" role="status"><h2>{ar?`نتيجتك ${score}/${course.assessment.length}`:`Score ${score}/${course.assessment.length}`}</h2><p>{score>=course.passingScore?(ar?'اجتزت التقييم.':'Assessment passed.'):(ar?'راجع الدروس ثم أعد المحاولة.':'Review the lessons and retry.')}</p>{courseProgress.assessmentPassed && score < course.passingScore && <p>{ar?'اجتياز سابق محفوظ، وما زال يفتح المستوى التالي.':'A previous pass is preserved and still unlocks the next level.'}</p>}<button className="button button-secondary" type="button" onClick={()=>{setAnswers({});setSubmitted(false);setAttemptStarted(true);}}>{ar?'محاولة جديدة':'Start a new attempt'}</button></section>}<a href={getJourneyCourseHref(pathId,level)}>{ar?'العودة للدروس':'Back to lessons'}</a></>);
  }

  const [draft,setDraft]=useState(()=>getJourneyProjectDraft(level,Object.fromEntries(project.files.map(f=>[f.name,f.initial]))));
  const [stageIndex,setStageIndex]=useState(0);const [rubric,setRubric]=useState(false);const [reviewed,setReviewed]=useState(progress.projects[level]?.completed??false);
  const results=useMemo(()=>project.files.flatMap(file=>validatePracticeRules(file.language,draft[file.name]??file.initial,file.rules,locale)),[project.files,draft,locale]);
  if(blocked)return wrapper(gateMessage);
  const stage=project.stages[stageIndex];
  return wrapper(<><header className="learning-system-intro"><p className="eyebrow">{levelText(level,locale)} · {ar?'مشروع نهائي مستقل':'Independent capstone'}</p><h1>{text(project.title,locale)}</h1><p className="learning-system-lead">{text(project.summary,locale)}</p></header><nav className="journey-stage-nav" aria-label={ar?'مراحل المشروع':'Project stages'}>{project.stages.map((item,i)=><button type="button" className={i===stageIndex?'is-current':''} key={item.id} onClick={()=>setStageIndex(i)}>{i+1}. {text(item.title,locale)} {progress.projects[level]?.completedStageIds.includes(item.id)?'✓':''}</button>)}</nav><section className="journey-stage"><p className="eyebrow">{ar?'المرحلة':'Stage'} {stageIndex+1}/{project.stages.length}</p><h2>{text(stage.title,locale)}</h2><p>{text(stage.task,locale)}</p><details><summary>{ar?'أظهر تلميحًا لهذه المرحلة':'Reveal this stage hint'}</summary><p>{text(stage.hint,locale)}</p></details><ul>{stage.checklist.map((item,i)=><li key={i}>{text(item,locale)}</li>)}</ul><button type="button" className="button button-secondary" onClick={()=>{if(reportSaveResult(recordJourneyProjectStageComplete(level,stage.id))){refresh();setStageIndex(Math.min(stageIndex+1,project.stages.length-1));}}}>{ar?'أنهيت المرحلة':'Mark stage complete'}</button></section><section className="journey-project-files"><h2>{ar?'ملفات المشروع':'Project files'}</h2>{project.files.map(file=><article className="journey-project-file" key={file.name}><h3><code dir="ltr">{file.name}</code></h3><PracticeCodeEditor language={file.language} locale={locale} label={`${file.name} editor`} value={draft[file.name]??file.initial} onChange={value=>{const next={...draft,[file.name]:value};setDraft(next);reportSaveResult(saveJourneyProjectDraft(level,next));}} validationRules={file.rules} validationResults={results.filter(r=>file.rules.some(rule=>rule.id===r.id))}/></article>)}</section><section className="journey-project-evaluation"><h2>{ar?'فحص المتطلبات والتقييم':'Requirements and review'}</h2>{results.map(r=><p className={r.passed?'is-met':'is-missing'} key={r.id}>{r.passed?'✓':'○'} {r.label}</p>)}{project.evaluation.map((line,i)=><p className="journey-disclaimer" key={i}>{text(line,locale)}</p>)}<label className="journey-rubric"><input type="checkbox" checked={rubric} onChange={e=>setRubric(e.target.checked)}/>{ar?'راجعت معايير التسليم والحالات اليدوية في قائمة الفحص.':'I reviewed the submission criteria and manual test cases.'}</label><button className="button button-primary" type="button" disabled={!rubric||project.stages.some(s=>!progress.projects[level]?.completedStageIds.includes(s.id))||results.some(r=>!r.passed)} onClick={()=>{if(reportSaveResult(recordJourneyProjectReview(level,true,true))){setReviewed(true);refresh();}}}>{ar?'تأكيد مراجعة المشروع':'Confirm project review'}</button>{reviewed&&<p role="status">{ar?'سُجل إكمال المشروع محليًا.':'Project completion recorded locally.'}</p>}</section><a className="button button-secondary" href="/levels">{ar?'العودة إلى المستويات':'Back to levels'}</a></>);
}

export default JourneyPage;
