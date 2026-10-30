export type PracticeSeverity = 'error' | 'warning' | 'hint';
export type PracticeRequirementStatus = 'passed' | 'failed' | 'missing';
export type PracticeRequirementReason =
  | 'satisfied'
  | 'missing'
  | 'syntax'
  | 'unknown-property'
  | 'wrong-selector'
  | 'wrong-property'
  | 'wrong-value'
  | 'missing-semicolon'
  | 'wrong-structure'
  | 'wrong-behavior';
export type PracticeEditorLanguage = 'html' | 'css' | 'javascript';

export type PracticeCodeLocation = {
  editor: PracticeEditorLanguage;
  from: number;
  to: number;
  line: number;
  column: number;
};

export type PracticeRequirementResult = {
  id: string;
  status: PracticeRequirementStatus;
  /** Kept as a convenience for existing consumers; derived from status. */
  passed: boolean;
  label: string;
  explanation: string;
  concept: string;
  reason: PracticeRequirementReason;
  severity: PracticeSeverity;
  location: PracticeCodeLocation | null;
  diagnosticCode?: string;
};

export type PracticeValidationSummary = {
  requirements: PracticeRequirementResult[];
  completedCount: number;
  totalCount: number;
  isComplete: boolean;
};

export type PracticeRuleBase = {
  id: string;
  note_ar: string;
  note_en: string;
  label_ar?: string;
  label_en?: string;
  concept_ar?: string;
  concept_en?: string;
  severity?: PracticeSeverity;
};

export type CssDeclarationRule = PracticeRuleBase & {
  type: 'css-declaration';
  target: string;
  property: string;
  value: string;
  /** Compare valid color representations by their color value instead of raw text. */
  valueMatch?: 'exact' | 'semantic-color';
  /** Require a trailing semicolon for this exercise requirement (CSS itself permits omitting the final one). */
  requireSemicolon?: boolean;
};

export type CssSelectorRule = PracticeRuleBase & {
  type: 'css-selector';
  target: string;
};

export type CssMediaRule = PracticeRuleBase & {
  type: 'css-media';
  target: string;
};

export type CssDeclarationInMediaRule = PracticeRuleBase & {
  type: 'css-declaration-in-media';
  target: string;
  property: string;
  value: string;
  media: string;
  valueMatch?: 'exact' | 'semantic-color';
  requireSemicolon?: boolean;
};

export type JavaScriptDeclarationRule = PracticeRuleBase & {
  type: 'js-declaration';
  target: string;
  property: 'const' | 'let';
  expectedType?: 'number' | 'string' | 'boolean' | 'array';
  expectedValue?: string | number | boolean;
};

export type JavaScriptCallRule = PracticeRuleBase & {
  type: 'js-call';
  target: string;
  argument?: string | number;
  argumentIndex?: number;
  requireCallback?: boolean;
};

export type JavaScriptComparisonRule = PracticeRuleBase & {
  type: 'js-comparison';
  variable: string;
  operator: '<' | '<=' | '>' | '>=';
  value: number;
  combineWith?: {
    logic: '&&' | '||';
    variable: string;
    operator: '<' | '<=' | '>' | '>=';
    value: number;
  };
};

export type JavaScriptAssignmentRule = PracticeRuleBase & {
  type: 'js-assignment';
  target: string;
  expectedType?: 'number' | 'string' | 'boolean';
  expectedValue?: string | number | boolean;
  mustDifferFrom?: string | number;
  mustBeNonEmpty?: boolean;
  mustFollowVariable?: string;
  mustFollowKind?: 'const' | 'let';
};

export type JavaScriptStringRule = PracticeRuleBase & {
  type: 'js-string';
  target: string;
};

export type JavaScriptOperatorRule = PracticeRuleBase & {
  type: 'js-operator';
  target: string;
};

export type JavaScriptIfRule = PracticeRuleBase & {
  type: 'js-if';
  target: 'IfStatement';
};

export type JavaScriptArrayRule = PracticeRuleBase & {
  type: 'js-array';
  target: string;
  itemCount?: number;
  stringItems?: boolean;
  cssColorItems?: boolean;
};

export type JavaScriptFunctionRule = PracticeRuleBase & {
  type: 'js-function';
  target: string;
  parameter?: string;
};

export type JavaScriptSelectorBindingRule = PracticeRuleBase & {
  type: 'js-selector-binding';
  variable: string;
  selector: string;
  expectedTag?: string;
};

export type JavaScriptRangeExpressionRule = PracticeRuleBase & {
  type: 'js-range-expression';
  variable: string;
  lowerBound: number;
  upperBound: number;
};

export type JavaScriptConditionBranchesRule = PracticeRuleBase & {
  type: 'js-condition-branches';
  variable: string;
  operator: '<' | '<=' | '>' | '>=';
  threshold: number;
  ifMessage: string;
  elseMessage: string;
  branchCheck?: 'condition' | 'if-message' | 'else-message';
};

export type JavaScriptFunctionBehaviorRule = PracticeRuleBase & {
  type: 'js-function-behavior';
  functionName: string;
  parameter: string;
  operator: '*' | '+' | '-' | '/';
  operand: number;
};

export type JavaScriptArrayAccessRule = PracticeRuleBase & {
  type: 'js-array-access';
  arrayName: string;
  index: number;
  logger: string;
};

export type JavaScriptPropertyAssignmentRule = PracticeRuleBase & {
  type: 'js-property-assignment';
  target: string;
  value: string;
  withinCallback?: boolean;
  withinCall?: {
    target: string;
    callbackArgumentIndex?: number;
    argument?: string | number;
    argumentIndex?: number;
  };
  withinGuardVariable?: string;
};

export type JavaScriptGuardRule = PracticeRuleBase & {
  type: 'js-guard';
  variable: string;
};

export type PracticeValidationRule =
  | CssDeclarationRule
  | CssSelectorRule
  | CssMediaRule
  | CssDeclarationInMediaRule
  | JavaScriptDeclarationRule
  | JavaScriptCallRule
  | JavaScriptAssignmentRule
  | JavaScriptStringRule
  | JavaScriptOperatorRule
  | JavaScriptComparisonRule
  | JavaScriptIfRule
  | JavaScriptArrayRule
  | JavaScriptFunctionRule
  | JavaScriptSelectorBindingRule
  | JavaScriptRangeExpressionRule
  | JavaScriptConditionBranchesRule
  | JavaScriptFunctionBehaviorRule
  | JavaScriptArrayAccessRule
  | JavaScriptPropertyAssignmentRule
  | JavaScriptGuardRule;

export type LocalizedExerciseCopy = Record<'ar' | 'en', string>;
