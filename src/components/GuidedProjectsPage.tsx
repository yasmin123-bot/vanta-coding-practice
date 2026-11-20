import { useState } from 'react';
import { GUIDED_PROJECTS } from '../content/guidedProjects';
import type { Locale } from '../i18n/messages';
import { messages } from '../i18n/messages';
import LearningHeader from './LearningHeader';

type GuidedProjectsPageProps = {
  locale: Locale;
  onSwitchLocale: () => void;
};

function copyText(text: string): boolean {
  const legacyCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    return copied;
  };
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text).catch(() => undefined);
    return true;
  }
  return legacyCopy();
}

function GuidedProjectsPage({ locale, onSwitchLocale }: GuidedProjectsPageProps) {
  const copy = messages[locale].learningSystem;
  const ui = copy.ui;
  const projects = GUIDED_PROJECTS[locale];
  const [copyState, setCopyState] = useState<Record<string, 'copied' | 'failed'>>({});

  const handleCopy = async (projectId: string, fileName: string, code: string) => {
    const key = `${projectId}/${fileName}`;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(code);
      else if (!copyText(code)) throw new Error('clipboard unavailable');
      setCopyState((current) => ({ ...current, [key]: 'copied' }));
    } catch {
      setCopyState((current) => ({ ...current, [key]: 'failed' }));
    }
  };

  return (
    <div className={`app-shell learning-system-page guided-projects-page ${locale === 'ar' ? 'is-arabic' : 'is-english'}`}>
      <LearningHeader locale={locale} onSwitchLocale={onSwitchLocale} allPathsLabel={ui.allPaths} stageLabel={ui.projectsTitle} />
      <main className="learning-system-main section-frame">
        <nav className="learning-breadcrumb" aria-label={locale === 'ar' ? 'مسار التنقل' : 'Breadcrumb'}>
          <a href="/paths">{ui.allPaths}</a><span aria-hidden="true">/</span><span aria-current="page">{ui.projectsTitle}</span>
        </nav>
        <header className="learning-system-intro">
          <p className="eyebrow"><span className="eyebrow-line" />{ui.projectsTitle}</p>
          <h1>{ui.projectsPageTitle}</h1>
          <p className="learning-system-lead">{ui.projectsPageIntro}</p>
        </header>
        <p className="project-local-only-note" role="note">{ui.projectNoSavedProgress}</p>

        <div className="guided-project-list">
          {projects.map((project, projectIndex) => (
            <details className="guided-project-card" key={project.id} open={projectIndex === 0}>
              <summary className="guided-project-summary">
                <span className="guided-project-index" dir="ltr">{String(projectIndex + 1).padStart(2, '0')}</span>
                <span>
                  <strong>{project.title}</strong>
                  <small>{project.objective}</small>
                </span>
                <span className="guided-project-summary-icon" aria-hidden="true">+</span>
              </summary>
              <div className="guided-project-content">
                <p className="guided-project-description">{project.description}</p>
                <section className="guided-project-section" aria-labelledby={`project-prereq-${project.id}`}>
                  <h3 id={`project-prereq-${project.id}`}>{ui.projectPrerequisitesLabel}</h3>
                  <ul>{project.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <section className="guided-project-section" aria-labelledby={`project-stages-${project.id}`}>
                  <h3 id={`project-stages-${project.id}`}>{ui.projectMilestonesLabel}</h3>
                  <ol className="guided-project-stages">
                    {project.stages.map((stage, stageIndex) => (
                      <li key={`${stageIndex}-${stage.title}`}>
                        <h4>{stage.title}</h4>
                        <ul>{stage.instructions.map((item) => <li key={item}>{item}</li>)}</ul>
                        <p><strong>{locale === 'ar' ? 'تحقق من:' : 'Check that:'}</strong></p>
                        <ul className="project-completion-criteria">{stage.completionCriteria.map((item) => <li key={item}>{item}</li>)}</ul>
                      </li>
                    ))}
                  </ol>
                </section>
                <section className="guided-project-section" aria-labelledby={`project-requirements-${project.id}`}>
                  <h3 id={`project-requirements-${project.id}`}>{ui.projectRequirementsLabel}</h3>
                  <ul>{project.requirements.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <section className="guided-project-section" aria-labelledby={`project-checklist-${project.id}`}>
                  <h3 id={`project-checklist-${project.id}`}>{ui.projectChecklistLabel}</h3>
                  <ul className="guided-project-checklist">{project.checklist.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <section className="guided-project-section project-expected-result" aria-labelledby={`project-result-${project.id}`}>
                  <h3 id={`project-result-${project.id}`}>{ui.projectExpectedResultLabel}</h3>
                  <p>{project.expectedResult}</p>
                </section>
                <section className="guided-project-section" aria-labelledby={`project-optional-${project.id}`}>
                  <h3 id={`project-optional-${project.id}`}>{ui.projectOptionalImprovementsLabel}</h3>
                  <ul>{project.optionalImprovements.map((item) => <li key={item}>{item}</li>)}</ul>
                </section>
                <section className="guided-project-section guided-project-files" aria-labelledby={`project-files-${project.id}`}>
                  <h3 id={`project-files-${project.id}`}>{ui.projectStarterFilesLabel}</h3>
                  <p>{ui.projectNoSavedProgress}</p>
                  {project.starterFiles.map((file) => {
                    const key = `${project.id}/${file.name}`;
                    const state = copyState[key];
                    return (
                      <details className="guided-project-file" key={file.name}>
                        <summary><span dir="ltr">{file.name}</span><span dir="ltr">{file.language.toUpperCase()}</span></summary>
                        <div className="guided-project-code-actions">
                          <button type="button" className="button button-quiet" onClick={() => { void handleCopy(project.id, file.name, file.code); }}>
                            {state === 'copied' ? ui.projectCodeCopied : state === 'failed' ? ui.projectCopyFailed : ui.projectCopyCode}
                          </button>
                        </div>
                        <pre dir="ltr"><code>{file.code}</code></pre>
                      </details>
                    );
                  })}
                </section>
              </div>
            </details>
          ))}
        </div>
        <a className="learning-text-link" href="/paths">{ui.allPaths}<span aria-hidden="true"> {locale === 'ar' ? '←' : '→'}</span></a>
      </main>
    </div>
  );
}

export default GuidedProjectsPage;
