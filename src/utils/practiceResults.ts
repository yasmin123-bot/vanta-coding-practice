import type {
  PracticeCodeLocation,
  PracticeEditorLanguage,
  PracticeRequirementReason,
  PracticeRequirementResult,
  PracticeRequirementStatus,
  PracticeSeverity,
  PracticeValidationSummary,
} from '../content/practiceTypes';

export type PracticeRequirementResultInput = {
  id: string;
  status: PracticeRequirementStatus;
  label: string;
  explanation: string;
  concept: string;
  reason: PracticeRequirementReason;
  language: PracticeEditorLanguage;
  source: string;
  from?: number | null;
  to?: number | null;
  severity?: PracticeSeverity;
  diagnosticCode?: string;
};

export function editorLocation(
  source: string,
  language: PracticeEditorLanguage,
  from: number | null | undefined,
  to: number | null | undefined = from,
): PracticeCodeLocation | null {
  if (!Number.isFinite(from)) return null;
  const safeFrom = Math.max(0, Math.min(Number(from), source.length));
  const safeTo = Number.isFinite(to)
    ? Math.max(safeFrom, Math.min(Number(to), source.length))
    : safeFrom;
  const prefix = source.slice(0, safeFrom);
  const lastNewline = prefix.lastIndexOf('\n');
  return {
    editor: language,
    from: safeFrom,
    to: safeTo,
    line: prefix.split('\n').length,
    column: safeFrom - lastNewline,
  };
}

export function makePracticeRequirementResult(input: PracticeRequirementResultInput): PracticeRequirementResult {
  const passed = input.status === 'passed';
  return {
    id: input.id,
    status: input.status,
    passed,
    label: input.label,
    explanation: input.explanation,
    concept: input.concept,
    reason: input.reason,
    severity: input.severity ?? (input.reason === 'syntax' || input.reason === 'unknown-property' ? 'error' : 'warning'),
    location: editorLocation(input.source, input.language, input.from, input.to),
    diagnosticCode: input.diagnosticCode,
  };
}

export function summarizePracticeRequirements(requirements: PracticeRequirementResult[]): PracticeValidationSummary {
  const completedCount = requirements.reduce((count, requirement) => count + Number(requirement.status === 'passed'), 0);
  return {
    requirements,
    completedCount,
    totalCount: requirements.length,
    isComplete: requirements.length > 0 && completedCount === requirements.length,
  };
}
