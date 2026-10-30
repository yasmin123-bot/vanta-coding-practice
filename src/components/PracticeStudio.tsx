import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { practiceExercises } from '../content/practiceExercises';
import type { FoundationLessonId, HtmlLessonId } from '../content/learningSystem';
import { practiceStudioMessages } from '../i18n/practiceStudio';
import type { Locale } from '../i18n/messages';
import { useAuth } from '../auth/AuthProvider';
import { loadPracticeDraft, savePracticeDraft, type PracticeDraft, type PracticeDraftContent } from '../services/practiceDrafts';
import type { RuntimeCodeIssue } from '../utils/practiceDiagnostics';
import { buildPracticePreviewDocument } from '../utils/practicePreviewDocument';
import { validatePractice, type PracticeCheckResult } from '../utils/practiceValidation';
import { summarizePracticeRequirements } from '../utils/practiceResults';
import ProgrammingLanguageLabel from './ProgrammingLanguageLabel';

const PracticeCodeEditor = lazy(() => import('./PracticeCodeEditor'));
type EditorTab = 'html' | 'css' | 'javascript';
type MobilePanel = 'code' | 'preview';
type LoadState = 'loading' | 'ready' | 'error';
type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export type PracticeStudioProps = {
  lessonId: FoundationLessonId;
  lessonTitle: string;
  expectedOutcome?: string;
  locale: Locale;
  isVisible: boolean;
  onBackToLesson: () => void;
  onContinueToQuiz: () => void;
};

function tokenForRun() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function contentFromDraft(draft: PracticeDraft): PracticeDraftContent {
  return { html_code: draft.html_code, css_code: draft.css_code, js_code: draft.js_code };
}

function PracticeStudio({ lessonId, lessonTitle, expectedOutcome, locale, isVisible, onBackToLesson, onContinueToQuiz }: PracticeStudioProps) {
  const copy = practiceStudioMessages[locale];
  const exerciseCopy = copy.exercises[lessonId as HtmlLessonId];
  const exercise = practiceExercises[lessonId];
  const taskCopy = exerciseCopy?.task ?? exercise.instructions?.[locale] ?? copy.intro;
  const expectedCopy = exerciseCopy?.expected ?? expectedOutcome
    ?? (locale === 'ar' ? 'اكتب الكود المطلوب ثم افحص كل شرط على حدة.' : 'Write the requested code, then check each requirement separately.');
  const taskRequirements = useMemo(() => {
    if (exerciseCopy) {
      return Object.entries(exerciseCopy.checks).flatMap(([id, item]) => item ? [{
        id,
        label: item.label,
        instruction: item.missing,
      }] : []);
    }
    return (exercise.validationRules ?? []).map((rule) => {
      const label = (locale === 'ar' ? rule.label_ar : rule.label_en)?.trim();
      return {
        id: rule.id,
        label: label || (locale === 'ar' ? rule.note_ar : rule.note_en),
        instruction: label ? (locale === 'ar' ? rule.note_ar : rule.note_en) : '',
      };
    });
  }, [exercise.validationRules, exerciseCopy, locale]);
  const auth = useAuth();
  const isArabic = locale === 'ar';
  const starter = useMemo<PracticeDraftContent>(() => ({
    html_code: exercise.starterHtml,
    css_code: exercise.starterCss,
    js_code: exercise.starterJs,
  }), [exercise]);
  const currentOwner = auth.user?.id ?? (auth.setupState === 'ready' ? 'guest' : `guest:${auth.setupState}`);
  const [draft, setDraft] = useState<PracticeDraftContent>(starter);
  const [draftOwner, setDraftOwner] = useState<string | null>(null);
  const [savedDraft, setSavedDraft] = useState<PracticeDraft | null>(null);
  const [savedDraftRestored, setSavedDraftRestored] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveInProgress, setSaveInProgress] = useState(false);
  const [activeTab, setActiveTab] = useState<EditorTab>(exercise.language);
  const [editorRevision, setEditorRevision] = useState(0);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('code');
  const [checkResults, setCheckResults] = useState<PracticeCheckResult[] | null>(null);
  const [previewDocument, setPreviewDocument] = useState('');
  const [previewCode, setPreviewCode] = useState<PracticeDraftContent | null>(null);
  const [previewToken, setPreviewToken] = useState('');
  const [previewState, setPreviewState] = useState<'empty' | 'running' | 'updated' | 'stale' | 'failed' | 'withIssues'>('empty');
  const [runtimeIssue, setRuntimeIssue] = useState<RuntimeCodeIssue | null>(null);
  const [runIssueCount, setRunIssueCount] = useState(0);
  const [notice, setNotice] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const requestId = useRef(0);
  const saveInProgressRef = useRef(false);
  const currentOwnerRef = useRef(currentOwner);
  const currentDraftRef = useRef(draft);
  const currentPreviewTokenRef = useRef(previewToken);
  const runIssueCountRef = useRef(0);
  const runHasJavaScriptSyntaxErrorRef = useRef(false);
  const runtimeErrorTokenRef = useRef<string | null>(null);
  const previewStaleRef = useRef(false);
  currentOwnerRef.current = currentOwner;
  currentDraftRef.current = draft;
  currentPreviewTokenRef.current = previewToken;

  useEffect(() => {
    setActiveTab(exercise.language);
  }, [exercise.language, lessonId]);

  const loadCurrentDraft = useCallback(async () => {
    const request = ++requestId.current;
    setNotice('');
    setSaveState('idle');
    setCheckResults(null);
    setSavedDraft(null);
    setSavedDraftRestored(false);

    if (auth.loading) {
      setLoadState('loading');
      return;
    }

    if (!auth.user || auth.setupState !== 'ready') {
      setDraft(starter);
      setDraftOwner(currentOwner);
      setLoadState('ready');
      return;
    }

    const user = auth.user;
    setLoadState('loading');
    setDraftOwner(null);
    setDraft(starter);
    try {
      const stored = await loadPracticeDraft(user, lessonId);
      if (requestId.current !== request || currentOwnerRef.current !== user.id) return;
      setSavedDraft(stored);
      setSavedDraftRestored(Boolean(stored));
      setDraft(stored ? contentFromDraft(stored) : starter);
      setDraftOwner(user.id);
      setLoadState('ready');
    } catch {
      if (requestId.current !== request || currentOwnerRef.current !== user.id) return;
      setDraftOwner(user.id);
      setLoadState('error');
    }
  }, [auth.loading, auth.setupState, auth.user, currentOwner, lessonId, starter]);

  useEffect(() => {
    void loadCurrentDraft();
    return () => { requestId.current += 1; };
  }, [loadCurrentDraft]);

  useEffect(() => {
    if (isVisible) headingRef.current?.focus();
  }, [isVisible]);

  useEffect(() => {
    const onMessage = (event: MessageEvent<unknown>) => {
      if (!iframeRef.current?.contentWindow || event.source !== iframeRef.current.contentWindow) return;
      if (!event.data || typeof event.data !== 'object') return;
      const data = event.data as { type?: unknown; token?: unknown; message?: unknown; detail?: unknown; line?: unknown; column?: unknown };
      if (data.token !== currentPreviewTokenRef.current) return;
      if (data.type === 'vanta-preview-error') {
        if (previewStaleRef.current) return;
        runtimeErrorTokenRef.current = String(data.token);
        setRuntimeIssue({
          message: typeof data.message === 'string' ? data.message.slice(0, 300) : 'JavaScript error',
          detail: typeof data.detail === 'string' ? data.detail.slice(0, 500) : undefined,
          line: Number.isInteger(data.line) && Number(data.line) > 0 ? Number(data.line) : null,
          column: Number.isInteger(data.column) && Number(data.column) > 0 ? Number(data.column) : null,
        });
        setPreviewState('failed');
      } else if (data.type === 'vanta-preview-complete' && !previewStaleRef.current && runtimeErrorTokenRef.current !== String(data.token)) {
        setPreviewState(runHasJavaScriptSyntaxErrorRef.current
          ? 'failed'
          : runIssueCountRef.current > 0 ? 'withIssues' : 'updated');
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const workspaceReady = loadState === 'ready' && draftOwner === currentOwner && !auth.loading;
  const signedIn = Boolean(auth.user) && auth.setupState === 'ready';
  useEffect(() => {
    if (savedDraftRestored && workspaceReady) setNotice(practiceStudioMessages[locale].restoredDraftNotice);
  }, [locale, savedDraftRestored, workspaceReady]);

  const hasUnsavedChanges = workspaceReady && (
    !savedDraft
      ? JSON.stringify(draft) !== JSON.stringify(starter)
      : draft.html_code !== savedDraft.html_code || draft.css_code !== savedDraft.css_code || draft.js_code !== savedDraft.js_code
  );
  const checkSummary = useMemo(() => checkResults ? summarizePracticeRequirements(checkResults) : null, [checkResults]);
  const allChecksPassed = Boolean(checkSummary?.isComplete);
  const activeCodeKey: keyof PracticeDraftContent = activeTab === 'html'
    ? 'html_code'
    : activeTab === 'css' ? 'css_code' : 'js_code';

  const updateCode = (key: keyof PracticeDraftContent, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaveState('idle');
    setNotice('');
    setCheckResults(null);
    setRuntimeIssue(null);
    if (previewDocument) {
      previewStaleRef.current = true;
      setPreviewState('stale');
    }
  };

  const runPreview = async () => {
    if (!workspaceReady) return;
    const token = tokenForRun();
    const codeSnapshot = { ...draft };
    currentPreviewTokenRef.current = token;
    previewStaleRef.current = false;
    runtimeErrorTokenRef.current = null;
    runIssueCountRef.current = 0;
    runHasJavaScriptSyntaxErrorRef.current = false;
    setRunIssueCount(0);
    setPreviewToken(token);
    setPreviewCode(codeSnapshot);
    setPreviewDocument('');
    setRuntimeIssue(null);
    setPreviewState('running');
    setMobilePanel('preview');
    setNotice('');
    try {
      const { getAllPracticeDiagnostics } = await import('../utils/practiceDiagnostics');
      if (currentPreviewTokenRef.current !== token) return;
      const codeIssues = getAllPracticeDiagnostics(codeSnapshot.html_code, codeSnapshot.css_code, codeSnapshot.js_code, locale);
      runIssueCountRef.current = codeIssues.length;
      runHasJavaScriptSyntaxErrorRef.current = codeIssues.some((issue) => issue.language === 'javascript' && issue.kind === 'syntax');
      setRunIssueCount(codeIssues.length);
      setPreviewDocument(buildPracticePreviewDocument(codeSnapshot.html_code, token));
    } catch {
      if (currentPreviewTokenRef.current === token) setPreviewState('failed');
    }
  };

  const sendPreviewCode = () => {
    if (!previewToken || !iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({
      type: 'vanta-run-code',
      token: previewToken,
      css: previewCode?.css_code ?? '',
      javascript: previewCode?.js_code ?? '',
    }, '*');
  };

  const checkTask = () => {
    if (!workspaceReady) return;
    setCheckResults(validatePractice(lessonId, draft, locale));
    setNotice('');
  };

  const resetEditor = () => {
    if (!workspaceReady || saveInProgressRef.current) return;
    setDraft(starter);
    setSavedDraftRestored(false);
    setEditorRevision((revision) => revision + 1);
    setSaveState('idle');
    setCheckResults(null);
    setNotice(copy.resetNotice);
    setRuntimeIssue(null);
    if (previewDocument) {
      previewStaleRef.current = true;
      setPreviewState('stale');
    }
  };

  const restoreSaved = () => {
    if (!workspaceReady || !savedDraft || saveInProgressRef.current) return;
    setDraft(contentFromDraft(savedDraft));
    setSavedDraftRestored(true);
    setEditorRevision((revision) => revision + 1);
    setSaveState('idle');
    setCheckResults(null);
    setRuntimeIssue(null);
    setNotice(copy.restoredDraftNotice);
    if (previewDocument) {
      previewStaleRef.current = true;
      setPreviewState('stale');
    }
  };

  const persistDraft = async () => {
    const user = auth.user;
    if (!user || !signedIn || !workspaceReady || saveInProgressRef.current) return;
    const requestedOwner = user.id;
    const content = { ...currentDraftRef.current };
    const request = requestId.current;
    saveInProgressRef.current = true;
    setSaveInProgress(true);
    setSaveState('saving');
    setNotice('');
    try {
      const stored = await savePracticeDraft(user, lessonId, content);
      if (currentOwnerRef.current !== requestedOwner || requestId.current !== request) return;
      setSavedDraft(stored);
      const now = currentDraftRef.current;
      setSaveState(now.html_code === content.html_code && now.css_code === content.css_code && now.js_code === content.js_code ? 'saved' : 'idle');
    } catch {
      if (currentOwnerRef.current === requestedOwner && requestId.current === request) setSaveState('error');
    } finally {
      saveInProgressRef.current = false;
      setSaveInProgress(false);
    }
  };

  const selectTab = (tab: EditorTab) => {
    setActiveTab(tab);
    setMobilePanel('code');
  };

  const onFrameLoad = () => {
    if (!previewToken || !previewCode || previewState !== 'running') return;
    sendPreviewCode();
  };

  return (
    <section
      className="practice-studio"
      aria-labelledby="practice-studio-title"
      data-testid="practice-studio"
    >
      <header className="practice-studio-heading">
        <p className="practice-studio-kicker"><span dir="ltr">02</span>{copy.stepName}</p>
        <h2 id="practice-studio-title" ref={headingRef} tabIndex={-1}>{copy.title}</h2>
        <p>{copy.intro}</p>
        <span className="practice-studio-lesson-name">{lessonTitle}</span>
      </header>

      <div className="practice-task-brief">
        <article>
          <span>{copy.taskLabel}</span>
          <p dir="auto">{taskCopy}</p>
        </article>
        <article>
          <span>{copy.expectedLabel}</span>
          <p dir="auto">{expectedCopy}</p>
        </article>
      </div>

      {!signedIn && (
        <div className="practice-guest-note" role="note">
          <span aria-hidden="true">i</span>
          <p>{auth.setupState === 'ready' ? copy.guestNotice : copy.cloudUnavailable}</p>
          {auth.setupState === 'ready' && <a href="/login">{copy.login}</a>}
        </div>
      )}

      <div className="practice-workspace" data-mobile-panel={mobilePanel}>
        <div className="practice-workspace-topbar">
          <div className="practice-workspace-file-label" dir="ltr"><span aria-hidden="true">▤</span> {activeTab === 'css' ? 'styles.css' : activeTab === 'javascript' ? 'script.js' : 'index.html'}</div>
          <div className="practice-save-status" role="status" aria-live="polite">
            {loadState === 'loading' ? copy.loading : saveInProgress || saveState === 'saving' ? copy.saving : null}
            {saveState === 'saved' ? copy.saved : null}
            {saveState === 'error' ? copy.saveFailed : null}
            {saveState === 'idle' && hasUnsavedChanges ? copy.changedNotice : null}
            {saveState === 'idle' && !hasUnsavedChanges && loadState === 'ready' && signedIn && !savedDraft ? copy.noSavedDraft : null}
          </div>
        </div>
        {notice && <p className="practice-inline-notice" role="status" aria-live="polite">{notice}</p>}

        <div className="practice-mobile-view-switch" role="group" aria-label={isArabic ? 'عرض مساحة الممارسة' : 'Practice workspace view'}>
          <button type="button" aria-pressed={mobilePanel === 'code'} onClick={() => setMobilePanel('code')}>{copy.editorLabel}</button>
          <button type="button" aria-pressed={mobilePanel === 'preview'} onClick={() => setMobilePanel('preview')}>{copy.previewLabel}</button>
        </div>

        <section className="practice-checklist" aria-labelledby="practice-checklist-title">
          <div className="practice-checklist-heading">
            <div>
              <h3 id="practice-checklist-title">{copy.checksTitle}</h3>
              <p>{copy.requirementProgress(checkSummary?.completedCount ?? 0, taskRequirements.length)}</p>
            </div>
            <button className="button button-quiet" type="button" onClick={checkTask} disabled={!workspaceReady}>{copy.checkTask}</button>
          </div>
          <div
            className="practice-requirements-progress"
            role="progressbar"
            aria-label={copy.checksTitle}
            aria-valuemin={0}
            aria-valuemax={taskRequirements.length}
            aria-valuenow={checkSummary?.completedCount ?? 0}
            aria-valuetext={copy.requirementProgress(checkSummary?.completedCount ?? 0, taskRequirements.length)}
          >
            <span style={{ width: `${taskRequirements.length ? ((checkSummary?.completedCount ?? 0) / taskRequirements.length) * 100 : 0}%` }} />
          </div>
          <ol className="practice-checklist-items">
            {taskRequirements.map((requirement, index) => {
              const result = checkResults?.find((item) => item.id === requirement.id);
              return (
                <li
                  className={result ? `is-${result.status} is-${result.severity}` : 'is-unchecked'}
                  data-requirement-id={requirement.id}
                  key={requirement.id}
                >
                  <span className="practice-checklist-number" aria-hidden="true">{index + 1}</span>
                  <div className="practice-checklist-result">
                    <strong>{result?.label ?? requirement.label}</strong>
                    <p>{result?.explanation ?? requirement.instruction}</p>
                    {result?.concept && <span className="practice-checklist-concept">{result.concept}</span>}
                    {result?.location && <code className="practice-checklist-location" dir="ltr">{copy.diagnostics.location(result.location.line, result.location.column)}</code>}
                  </div>
                  {result && <span className={`practice-checklist-severity is-${result.severity}`}>{copy.severityLabels[result.severity]}</span>}
                </li>
              );
            })}
          </ol>
          {checkResults && !allChecksPassed && (
            <p className="practice-checklist-summary is-pending" role="status" aria-live="polite">
              {checkSummary
                ? copy.partialProgress(checkSummary.completedCount, checkSummary.totalCount, checkSummary.totalCount - checkSummary.completedCount, checkResults.find((result) => !result.passed)?.label ?? copy.someChecksPending)
                : copy.someChecksPending}
            </p>
          )}
        </section>

        <div className="practice-workspace-grid">
          <section className="practice-editor-panel" aria-label={copy.editorLabel}>
            <div className="practice-editor-tabs" role="tablist" aria-label={isArabic ? 'لغة المحرر' : 'Editor language'}>
              {([
                ['html', copy.htmlTab],
                ['css', copy.cssTab],
                ['javascript', copy.jsTab],
              ] as const).map(([tab, label]) => {
                const tabLabel = tab === exercise.language
                  ? tab === 'javascript' ? 'JavaScript' : tab.toUpperCase()
                  : label;
                return (
                  <button
                    type="button"
                    role="tab"
                    id={`practice-tab-${tab}`}
                    aria-selected={activeTab === tab}
                    aria-controls="practice-editor-content"
                    key={tab}
                    onClick={() => selectTab(tab)}
                    dir="ltr"
                  >
                    <ProgrammingLanguageLabel language={tab} label={tabLabel}>{tabLabel}</ProgrammingLanguageLabel>
                  </button>
                );
              })}
            </div>

            <div className="practice-editor-frame" id="practice-editor-content" role="tabpanel" aria-labelledby={`practice-tab-${activeTab}`} dir="ltr">
              {!workspaceReady ? (
                <div className="practice-workspace-state" role={loadState === 'error' ? 'alert' : 'status'}>
                  <p>{auth.loading || loadState === 'loading' ? copy.loading : copy.loadFailed}</p>
                  {loadState === 'error' && (
                    <button className="button button-quiet" type="button" onClick={() => { void loadCurrentDraft(); }}>{copy.retryLoad}</button>
                  )}
                </div>
              ) : (
                <Suspense fallback={<div className="practice-workspace-state" role="status">{copy.loading}</div>}>
                  <PracticeCodeEditor
                    key={`${activeTab}-${editorRevision}`}
                    language={activeTab}
                    locale={locale}
                    label={`${copy.editorLabel}: ${activeTab}`}
                    value={draft[activeCodeKey]}
                    runtimeIssue={activeTab === 'javascript' ? runtimeIssue : null}
                    validationResults={checkResults ?? []}
                    validationRules={exercise.validationRules ?? []}
                    onChange={(value) => updateCode(activeCodeKey, value)}
                  />
                </Suspense>
              )}
            </div>
            <p className="practice-editor-help">{copy.editorHelp}</p>
          </section>

          <section className="practice-preview-panel" aria-label={copy.previewLabel}>
            <header className="practice-preview-heading">
              <div className="practice-preview-browser-bar">
                <span className="practice-preview-browser-dots" aria-hidden="true"><i /><i /><i /></span>
                <h3>{copy.previewLabel}</h3>
              </div>
              <span dir="auto" className={`practice-preview-state is-${previewState}`}>{copy.previewLabels[previewState]}</span>
            </header>
            <div className="practice-preview-canvas">
              {previewDocument ? (
                <iframe
                  key={previewToken}
                  ref={iframeRef}
                  title={copy.previewFrameTitle}
                  sandbox="allow-scripts"
                  referrerPolicy="no-referrer"
                  srcDoc={previewDocument}
                  onLoad={onFrameLoad}
                />
              ) : (
                <div className="practice-preview-empty"><span aria-hidden="true">&lt;/&gt;</span><p>{copy.previewEmpty}</p></div>
              )}
            </div>
            {previewState === 'failed' && <p className="practice-preview-status is-error" role="alert">{copy.previewFailed}</p>}
            {runtimeIssue && (
              <div className="practice-runtime-error" role="alert">
                <strong>{copy.previewErrorTitle}</strong>
                <p>{copy.diagnostics.runtimeMessage(runtimeIssue.message)}</p>
                <code dir="auto">{runtimeIssue.line !== null && runtimeIssue.column !== null
                  ? copy.diagnostics.location(runtimeIssue.line, runtimeIssue.column)
                  : copy.diagnostics.locationUnknown}</code>
                {runtimeIssue.detail && <code className="practice-runtime-error-detail" dir="ltr">{runtimeIssue.detail}</code>}
                <p>{copy.diagnostics.runtimeSuggestion}</p>
              </div>
            )}
            {previewState === 'updated' && <p className="practice-preview-status" role="status">{copy.previewUpdated}</p>}
            {previewState === 'stale' && <p className="practice-preview-status" role="status">{copy.previewStale}</p>}
            {previewState === 'withIssues' && <p className="practice-preview-status is-warning" role="status">{copy.previewWithIssues(runIssueCount)}</p>}

          </section>
        </div>

        {checkResults && allChecksPassed && (
          <section className="practice-success-card" role="status" aria-live="polite" aria-labelledby="practice-success-title">
            <span className="practice-success-mark" aria-hidden="true">✓</span>
            <div>
              <h3 id="practice-success-title">{copy.successTitle}</h3>
              <p>{copy.successBody}</p>
            </div>
            <button className="button button-primary" type="button" onClick={onContinueToQuiz}>{copy.continueToQuiz}</button>
          </section>
        )}

        <div className="practice-workspace-actions">
          <div className="practice-workspace-actions-primary">
            <button className="button button-primary" type="button" onClick={runPreview} disabled={!workspaceReady || previewState === 'running'}>
              <span aria-hidden="true">▶</span>{previewState === 'running' ? copy.running : copy.run}
            </button>
              <button className="button button-quiet" type="button" onClick={resetEditor} disabled={!workspaceReady || saveInProgress}>{copy.reset}</button>
          </div>
          <div className="practice-workspace-actions-secondary">
            {savedDraft && (
              <button className="button button-quiet" type="button" onClick={restoreSaved} disabled={!workspaceReady || saveInProgress || saveState === 'saving'}>{copy.restoreSaved}</button>
            )}
            {signedIn ? (
              <button className="button button-quiet practice-save-button" type="button" onClick={() => { void persistDraft(); }} disabled={!workspaceReady || saveInProgress || saveState === 'saving' || !hasUnsavedChanges}>
                {saveState === 'error' ? copy.retrySave : saveState === 'saving' ? copy.saving : copy.save}
              </button>
            ) : auth.setupState === 'ready' ? (
              <a className="button button-quiet" href="/login">{copy.login}</a>
            ) : null}
          </div>
        </div>
      </div>

      <p className="practice-sandbox-note"><span aria-hidden="true">◇</span>{copy.sandboxNote}</p>
      <div className="practice-studio-navigation">
        <button className="button button-quiet" type="button" onClick={onBackToLesson}>{copy.returnToLesson}</button>
        <button className="button button-primary" type="button" onClick={onContinueToQuiz}>{copy.continueToQuiz}<span aria-hidden="true">{isArabic ? '←' : '→'}</span></button>
      </div>
    </section>
  );
}

export default PracticeStudio;
