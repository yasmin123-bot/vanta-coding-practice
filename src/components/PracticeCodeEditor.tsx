import { useEffect, useMemo, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { lintGutter, linter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import type { Locale } from '../i18n/messages';
import { practiceStudioMessages } from '../i18n/practiceStudio';
import type { PracticeRequirementResult, PracticeValidationRule } from '../content/practiceTypes';
import { getPracticeDiagnostics, getPracticeRequirementDiagnostics, toCodeMirrorDiagnostics } from '../utils/practiceDiagnostics';
import type { PracticeCodeDiagnostic, PracticeCodeLanguage, RuntimeCodeIssue } from '../utils/practiceDiagnostics';

export type PracticeLanguage = PracticeCodeLanguage;

function editorDiagnostics(
  source: string,
  language: PracticeLanguage,
  locale: Locale,
  runtimeIssue: RuntimeCodeIssue | null,
  validationRules: readonly PracticeValidationRule[],
  validationResults: readonly PracticeRequirementResult[],
) {
  const codeFindings = getPracticeDiagnostics(source, language, locale, runtimeIssue, validationRules);
  const requirementFindings = getPracticeRequirementDiagnostics(validationResults.filter((result) => result.location?.editor === language));
  const distinctRequirements = requirementFindings.filter((requirement) => !codeFindings.some((finding) => (
    finding.from <= requirement.to && finding.to >= requirement.from
  )));
  return [...codeFindings, ...distinctRequirements];
}

type PracticeCodeEditorProps = {
  language: PracticeLanguage;
  locale: Locale;
  label: string;
  value: string;
  runtimeIssue?: RuntimeCodeIssue | null;
  validationResults?: readonly PracticeRequirementResult[];
  validationRules?: readonly PracticeValidationRule[];
  disabled?: boolean;
  onChange: (value: string) => void;
};

function PracticeCodeEditor({ language, locale, label, value, runtimeIssue = null, validationResults = [], validationRules = [], disabled = false, onChange }: PracticeCodeEditorProps) {
  const copy = practiceStudioMessages[locale].diagnostics;
  const viewRef = useRef<EditorView | null>(null);
  const [diagnostics, setDiagnostics] = useState<PracticeCodeDiagnostic[] | null>(null);
  const extensions = useMemo(() => {
    const languageExtension = language === 'html'
      ? html({ autoCloseTags: true })
      : language === 'css'
        ? css()
        : javascript();
    return [
      languageExtension,
      EditorView.lineWrapping,
      EditorView.contentAttributes.of({ 'aria-label': label, dir: 'ltr', spellcheck: 'false' }),
      EditorView.editable.of(!disabled),
      lintGutter(),
      linter((view) => toCodeMirrorDiagnostics(editorDiagnostics(
        view.state.doc.toString(), language, locale, runtimeIssue, validationRules, validationResults,
      )), {
        delay: 300,
        autoPanel: false,
      }),
    ];
  }, [language, locale, label, disabled, runtimeIssue, validationRules, validationResults]);

  useEffect(() => {
    setDiagnostics(null);
    const timer = window.setTimeout(() => {
      setDiagnostics(editorDiagnostics(value, language, locale, runtimeIssue, validationRules, validationResults));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [value, language, locale, runtimeIssue, validationRules, validationResults]);

  const focusDiagnostic = (diagnostic: PracticeCodeDiagnostic) => {
    const view = viewRef.current;
    if (!view || diagnostic.line === null || diagnostic.column === null) return;
    const line = view.state.doc.line(Math.min(Math.max(1, diagnostic.line), view.state.doc.lines));
    const position = Math.min(line.from + diagnostic.column - 1, line.to);
    view.dispatch({
      selection: { anchor: position },
      effects: EditorView.scrollIntoView(position, { y: 'center' }),
    });
    view.focus();
  };

  const renderDiagnostic = (diagnostic: PracticeCodeDiagnostic) => {
    const kindLabel = diagnostic.kind === 'structure'
      ? copy.structure
      : diagnostic.kind === 'property'
        ? copy.property
      : diagnostic.kind === 'value'
        ? copy.value
        : diagnostic.kind === 'format'
          ? copy.format
          : diagnostic.kind === 'requirement'
            ? copy.requirement
            : diagnostic.kind === 'runtime' ? copy.runtime : copy.syntax;
    const severityLabel = diagnostic.severity === 'warning'
      ? copy.warningLabel
      : diagnostic.severity === 'info' ? copy.hintLabel : copy.errorLabel;
    const location = diagnostic.line !== null && diagnostic.column !== null
      ? copy.location(diagnostic.line, diagnostic.column)
      : copy.locationUnknown;
    return (
      <li key={diagnostic.id}>
        <button
          className={`practice-diagnostic-item is-${diagnostic.severity}`}
          type="button"
          onClick={() => focusDiagnostic(diagnostic)}
          disabled={diagnostic.line === null || diagnostic.column === null}
          aria-label={`${kindLabel}: ${diagnostic.message}. ${location}`}
        >
          <span className="practice-diagnostic-severity" aria-hidden="true">{diagnostic.severity === 'warning' ? '!' : diagnostic.severity === 'info' ? 'i' : '×'}</span>
          <span className="practice-diagnostic-content">
            <span className="practice-diagnostic-meta"><strong>{kindLabel} · {severityLabel}</strong><code dir="ltr">{location}</code></span>
            <span className="practice-diagnostic-message">{diagnostic.message}</span>
            {diagnostic.suggestion && <span className="practice-diagnostic-suggestion">{diagnostic.suggestion}</span>}
            {diagnostic.detail && <code className="practice-diagnostic-detail" dir="ltr">{diagnostic.detail}</code>}
          </span>
          <span className="practice-diagnostic-jump" aria-hidden="true">↗</span>
        </button>
      </li>
    );
  };

  const visibleDiagnostics = diagnostics?.slice(0, 4) ?? [];
  const remainingDiagnostics = diagnostics?.slice(4) ?? [];

  return (
    <div className="practice-codemirror" dir="ltr">
      <CodeMirror
        value={value}
        height="360px"
        minHeight="260px"
        maxHeight="58vh"
        theme="dark"
        extensions={extensions}
        onChange={onChange}
        onCreateEditor={(view) => { viewRef.current = view; }}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          highlightSelectionMatches: false,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
          tabSize: 2,
        }}
      />
      <section className="practice-diagnostics-panel" dir={locale === 'ar' ? 'rtl' : 'ltr'} aria-labelledby="practice-diagnostics-title" aria-live="polite">
        <header className="practice-diagnostics-heading">
          <h4 id="practice-diagnostics-title">{copy.title}</h4>
          {diagnostics && <span className={diagnostics.length ? 'has-issues' : 'no-issues'}>{diagnostics.length}</span>}
        </header>
        {diagnostics === null ? (
          <p className="practice-diagnostics-empty" role="status">{copy.analyzing}</p>
        ) : diagnostics.length === 0 ? (
          <p className="practice-diagnostics-empty">{copy.noIssues}</p>
        ) : (
          <>
            <p className="practice-diagnostics-summary">{copy.count(diagnostics.length)}</p>
            <ol className="practice-diagnostics-list">{visibleDiagnostics.map(renderDiagnostic)}</ol>
            {remainingDiagnostics.length > 0 && (
              <details className="practice-diagnostics-more">
                <summary>{copy.showMore(remainingDiagnostics.length)}</summary>
                <ol className="practice-diagnostics-list" start={visibleDiagnostics.length + 1}>
                  {remainingDiagnostics.map(renderDiagnostic)}
                </ol>
              </details>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default PracticeCodeEditor;
