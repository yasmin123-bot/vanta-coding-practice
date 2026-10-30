import { cssLanguage } from '@codemirror/lang-css';
import { htmlLanguage } from '@codemirror/lang-html';
import { javascriptLanguage } from '@codemirror/lang-javascript';
import type { SyntaxNode } from '@lezer/common';
import type { Locale } from '../i18n/messages';
import { practiceStudioMessages } from '../i18n/practiceStudio';
import type { PracticeRequirementReason, PracticeValidationRule } from '../content/practiceTypes';
import { getCssDeclarationFacts, isCssColorKeyword, normalizeCssColor, normalizeCssMediaCondition, suggestCssProperty } from './cssAnalysis';
import { makePracticeRequirementResult } from './practiceResults';

type AstNode = {
  name: string;
  from: number;
  to: number;
  error: boolean;
  parent: AstNode | null;
  children: AstNode[];
};

function makeAst(node: SyntaxNode, parent: AstNode | null = null): AstNode {
  const result: AstNode = {
    name: node.name,
    from: node.from,
    to: node.to,
    error: node.type.isError,
    parent,
    children: [],
  };
  for (let child = node.firstChild; child; child = child.nextSibling) result.children.push(makeAst(child, result));
  return result;
}

function descendants(node: AstNode): AstNode[] {
  return node.children.flatMap((child) => [child, ...descendants(child)]);
}

function allNodes(root: AstNode): AstNode[] {
  return [root, ...descendants(root)];
}

function text(source: string, node: AstNode): string {
  return source.slice(node.from, node.to);
}

function normalized(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function cssColorComparable(value: string, property: string, semantic: boolean): string {
  const normalizedValue = normalized(value).toLowerCase();
  if (!semantic) return normalizedValue;
  if (property.toLowerCase() === 'border') {
    return (normalizedValue.match(/rgba?\([^)]*\)|#[\da-f]{3,8}|[^\s]+/gi) ?? [])
      .map((token) => normalizeCssColor(token) ?? token)
      .sort()
      .join(' ');
  }
  return normalizeCssColor(normalizedValue) ?? normalizedValue;
}

function cssRuleValueMatches(actual: string, expected: string, property: string, semantic = false): boolean {
  return cssColorComparable(actual, property, semantic) === cssColorComparable(expected, property, semantic);
}

function isExpression(node: AstNode): boolean {
  return /^(?:VariableName|VariableDefinition|Number|NumberLiteral|String|ArrayExpression|ObjectExpression|CallExpression|MemberExpression|BinaryExpression|UnaryExpression|UpdateExpression|ArrowFunction|FunctionExpression|TemplateString|RegExp)$/.test(node.name)
    || node.name === 'true' || node.name === 'false' || node.name === 'null';
}

function expressionChildren(node: AstNode): AstNode[] {
  return node.children.filter(isExpression);
}

function unquote(source: string, node: AstNode): string | null {
  const raw = text(source, node);
  if (node.name !== 'String' && node.name !== 'TemplateString') return null;
  if (raw.startsWith('`') || raw.startsWith('"')) {
    try {
      if (raw.startsWith('`')) return raw.slice(1, -1).replace(/\\([`\\$])/g, '$1');
      return JSON.parse(raw) as string;
    } catch {
      return null;
    }
  }
  if (raw.startsWith("'")) {
    // Decode only common string escapes; never execute source code.
    return raw.slice(1, -1).replace(/\\(\\|'|n|r|t|b|f|v|0)/g, (_match, escaped: string) => ({
      '\\': '\\', "'": "'", n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v', '0': '\0',
    }[escaped] ?? escaped));
  }
  return null;
}

function literalValue(source: string, node: AstNode): string | number | boolean | null | undefined {
  if (node.name === 'String') return unquote(source, node);
  if (node.name === 'Number' || node.name === 'NumberLiteral') {
    const value = Number(text(source, node).replaceAll('_', ''));
    return Number.isFinite(value) ? value : undefined;
  }
  if (node.name === 'true') return true;
  if (node.name === 'false') return false;
  if (node.name === 'null') return null;
  return undefined;
}

function matchesLiteral(source: string, node: AstNode, expected: string | number | boolean): boolean {
  return literalValue(source, node) === expected;
}

function declarationInfo(node: AstNode, source: string) {
  if (node.name !== 'VariableDeclaration') return null;
  const name = node.children.find((child) => child.name === 'VariableDefinition');
  const kind = node.children.find((child) => child.name === 'const' || child.name === 'let');
  const initializer = node.children.find((child) => child.from > (name?.to ?? node.from) && isExpression(child));
  if (!name || !kind) return null;
  return { name: text(source, name), kind: kind.name, initializer };
}

function expressionType(node: AstNode | undefined): 'number' | 'string' | 'boolean' | 'array' | 'other' {
  if (!node) return 'other';
  if (node.name === 'Number' || node.name === 'NumberLiteral') return 'number';
  if (node.name === 'String' || node.name === 'TemplateString') return 'string';
  if (node.name === 'true' || node.name === 'false') return 'boolean';
  if (node.name === 'ArrayExpression') return 'array';
  return 'other';
}

function callParts(node: AstNode, source: string) {
  if (node.name !== 'CallExpression') return null;
  const callee = node.children.find((child) => child.name !== 'ArgList' && child.name !== '(' && child.name !== ')');
  const argsNode = node.children.find((child) => child.name === 'ArgList');
  if (!callee || !argsNode) return null;
  return { callee: normalized(text(source, callee)), args: expressionChildren(argsNode) };
}

function targetText(node: AstNode, source: string): string {
  return normalized(text(source, node));
}

function binaryParts(node: AstNode, source: string) {
  if (node.name !== 'BinaryExpression') return null;
  const operands = expressionChildren(node);
  const operator = node.children.find((child) => /^(?:ArithOp|CompareOp|LogicOp)$/.test(child.name));
  return operands.length === 2 && operator
    ? { left: operands[0], operator: text(source, operator), right: operands[1] }
    : null;
}

function isBinary(node: AstNode | undefined, source: string, left: string, operator: string, right: string | number): boolean {
  if (!node) return false;
  const parts = binaryParts(node, source);
  return Boolean(parts && targetText(parts.left, source) === left && parts.operator === operator
    && (typeof right === 'number' ? literalValue(source, parts.right) === right : targetText(parts.right, source) === right));
}

function functionBehaviorMatches(node: AstNode, source: string, functionName: string, parameterName: string, operatorName: string, operand: number): boolean {
  if (node.name !== 'FunctionDeclaration' || !node.children.some((child) => child.name === 'VariableDefinition' && text(source, child) === functionName)) return false;
  const returned = descendants(node).find((child) => child.name === 'ReturnStatement');
  const returnedExpression = returned?.children.find(isExpression);
  return Boolean(returnedExpression && isBinary(returnedExpression, source, parameterName, operatorName, operand));
}

function selectorBinding(root: AstNode, source: string, html: string, variable: string, selector: string, expectedTag?: string): boolean {
  return allNodes(root).some((node) => {
    const info = declarationInfo(node, source);
    const call = info?.initializer ? callParts(info.initializer, source) : null;
    return Boolean(info && info.name === variable && info.kind === 'const' && call
      && call.callee === 'document.querySelector' && call.args.length === 1
      && matchesLiteral(source, call.args[0], selector) && htmlHasSelector(html, selector, expectedTag));
  });
}

function consoleLogStringIn(node: AstNode, source: string, expected: string): boolean {
  return descendants(node).some((child) => {
    const call = callParts(child, source);
    return Boolean(call && call.callee === 'console.log' && call.args.some((arg) => matchesLiteral(source, arg, expected)));
  });
}

function conditionMatches(root: AstNode, source: string, variable: string, operator: string, value: number): AstNode | null {
  return allNodes(root).find((node) => {
    if (node.name !== 'IfStatement') return false;
    const condition = node.children.find((child) => child.name === 'ParenthesizedExpression');
    const expressions = condition ? expressionChildren(condition) : [];
    return expressions.length === 1 && isBinary(expressions[0], source, variable, operator, value);
  }) ?? null;
}

function conditionBranchMatches(root: AstNode, source: string, rule: Extract<PracticeValidationRule, { type: 'js-condition-branches' }>, branch: 'if' | 'else', message: string): boolean {
  const statement = conditionMatches(root, source, rule.variable, rule.operator, rule.threshold);
  if (!statement) return false;
  const blocks = statement.children.filter((child) => child.name === 'Block');
  if (branch === 'if') return Boolean(blocks[0] && consoleLogStringIn(blocks[0], source, message));
  return Boolean(statement.children.some((child) => child.name === 'else')
    && blocks[1] && consoleLogStringIn(blocks[1], source, message));
}

function comparisonRuleMatches(root: AstNode, source: string, rule: Extract<PracticeValidationRule, { type: 'js-comparison' }>): boolean {
  if (!rule.combineWith) return allNodes(root).some((node) => isBinary(node, source, rule.variable, rule.operator, rule.value));
  return allNodes(root).some((node) => {
    const parts = binaryParts(node, source);
    if (!parts || parts.operator !== rule.combineWith?.logic) return false;
    const leftMatches = isBinary(parts.left, source, rule.variable, rule.operator, rule.value)
      && isBinary(parts.right, source, rule.combineWith.variable, rule.combineWith.operator, rule.combineWith.value);
    const rightMatches = isBinary(parts.right, source, rule.variable, rule.operator, rule.value)
      && isBinary(parts.left, source, rule.combineWith.variable, rule.combineWith.operator, rule.combineWith.value);
    return leftMatches || rightMatches;
  });
}

function directVariableCondition(condition: AstNode | undefined, source: string, variable: string): boolean {
  if (!condition) return false;
  const expression = condition.children.filter((child) => child.name !== '(' && child.name !== ')');
  return expression.length === 1 && expression[0].name === 'VariableName' && text(source, expression[0]) === variable;
}

function statusGuardMatches(root: AstNode, source: string, variable: string): boolean {
  return allNodes(root).some((node) => node.name === 'IfStatement'
    && directVariableCondition(node.children.find((child) => child.name === 'ParenthesizedExpression'), source, variable));
}

function assignmentIsInsideGuard(node: AstNode, source: string, variable: string): boolean {
  let parent = node.parent;
  while (parent) {
    if (parent.name === 'IfStatement') {
      const condition = parent.children.find((child) => child.name === 'ParenthesizedExpression');
      if (directVariableCondition(condition, source, variable)) return true;
    }
    parent = parent.parent;
  }
  return false;
}

function containsError(root: AstNode): boolean {
  return allNodes(root).some((node) => node.error);
}

function cssMediaCondition(media: AstNode, source: string): string {
  const block = media.children.find((child) => child.name === 'Block');
  return normalized(source.slice(media.from, block?.from ?? media.to).replace(/^@media\s*/i, ''));
}

function normalizedMediaCondition(value: string): string {
  return normalized(value).replace(/^\((.*)\)$/, '$1').replace(/\s*:\s*/g, ':');
}

function selectorListIncludes(selectorList: string, target: string): boolean {
  const selectors: string[] = [];
  let start = 0;
  let depth = 0;
  let quote = '';
  let escaped = false;
  for (let index = 0; index < selectorList.length; index += 1) {
    const character = selectorList[index];
    if (escaped) { escaped = false; continue; }
    if (character === '\\') { escaped = true; continue; }
    if (quote) {
      if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'") { quote = character; continue; }
    if (character === '[' || character === '(') depth += 1;
    else if (character === ']' || character === ')') depth = Math.max(0, depth - 1);
    else if (character === ',' && depth === 0) {
      selectors.push(selectorList.slice(start, index));
      start = index + 1;
    }
  }
  selectors.push(selectorList.slice(start));
  return selectors.some((selector) => normalized(selector) === normalized(target));
}

function cssRuleMatches(root: AstNode, source: string, rule: PracticeValidationRule): boolean {
  if (rule.type === 'css-selector') {
    return allNodes(root).some((node) => {
      if (node.name !== 'RuleSet') return false;
      const block = node.children.find((child) => child.name === 'Block');
      return selectorListIncludes(source.slice(node.from, block?.from ?? node.to), rule.target);
    });
  }
  if (rule.type === 'css-media') {
    return allNodes(root).some((media) => media.name === 'MediaStatement'
      && normalizedMediaCondition(cssMediaCondition(media, source)) === normalizedMediaCondition(rule.target));
  }
  if (rule.type !== 'css-declaration' && rule.type !== 'css-declaration-in-media') return false;
  const expectedMedia = rule.type === 'css-declaration-in-media' ? normalizeCssMediaCondition(rule.media) : null;
  return getCssDeclarationFacts(source).some((declaration) => selectorListIncludes(declaration.selector, rule.target)
    && (expectedMedia === null || normalizeCssMediaCondition(declaration.media ?? '') === expectedMedia)
    && declaration.property === rule.property.trim().toLowerCase()
    && cssRuleValueMatches(declaration.value, rule.value, rule.property, rule.valueMatch === 'semantic-color')
    && (!rule.requireSemicolon || declaration.hasSemicolon));
}

type PracticeEvidence = {
  passed: boolean;
  reason: PracticeRequirementReason;
  from?: number;
  to?: number;
  severity?: 'error' | 'warning' | 'hint';
};

function cssEvidence(root: AstNode, source: string, rule: PracticeValidationRule): PracticeEvidence {
  if (rule.type === 'css-selector') {
    const ruleSets = allNodes(root).filter((node) => node.name === 'RuleSet');
    const exact = ruleSets.find((node) => {
      const block = node.children.find((child) => child.name === 'Block');
      return selectorListIncludes(source.slice(node.from, block?.from ?? node.to), rule.target);
    });
    if (exact) {
      const block = exact.children.find((child) => child.name === 'Block');
      return { passed: true, reason: 'satisfied', from: exact.from, to: block?.from ?? exact.to, severity: 'hint' };
    }
    const other = ruleSets[0];
    if (other) {
      const block = other.children.find((child) => child.name === 'Block');
      return { passed: false, reason: 'wrong-selector', from: other.from, to: block?.from ?? other.to, severity: 'warning' };
    }
    return { passed: false, reason: 'missing', severity: 'hint' };
  }
  if (rule.type === 'css-media') {
    const media = allNodes(root).find((node) => node.name === 'MediaStatement');
    if (cssRuleMatches(root, source, rule)) return { passed: true, reason: 'satisfied', from: media?.from, to: media?.to };
    return media
      ? { passed: false, reason: 'wrong-value', from: media.from, to: media.to, severity: 'warning' }
      : { passed: false, reason: 'missing', severity: 'hint' };
  }
  if (rule.type !== 'css-declaration' && rule.type !== 'css-declaration-in-media') {
    return { passed: false, reason: 'missing', severity: 'hint' };
  }
  if (cssRuleMatches(root, source, rule)) {
    const expectedMedia = rule.type === 'css-declaration-in-media' ? normalizeCssMediaCondition(rule.media) : null;
    const exact = getCssDeclarationFacts(source).find((item) => item.selector === normalized(rule.target)
      && item.property === rule.property.toLowerCase()
      && (expectedMedia === null || normalizeCssMediaCondition(item.media ?? '') === expectedMedia)
      && cssRuleValueMatches(item.value, rule.value, rule.property, rule.valueMatch === 'semantic-color')
      && (!rule.requireSemicolon || item.hasSemicolon));
    return { passed: true, reason: 'satisfied', from: exact?.from, to: exact?.to, severity: 'hint' };
  }

  const declarations = getCssDeclarationFacts(source);
  const selectorDeclarations = declarations.filter((item) => item.selector === normalized(rule.target));
  const scopedDeclarations = rule.type === 'css-declaration-in-media'
    ? selectorDeclarations.filter((item) => normalizeCssMediaCondition(item.media ?? '') === normalizeCssMediaCondition(rule.media))
    : selectorDeclarations;
  const sameProperty = scopedDeclarations.find((item) => item.property === rule.property.toLowerCase());
  if (sameProperty && cssRuleValueMatches(sameProperty.value, rule.value, rule.property, rule.valueMatch === 'semantic-color') && rule.requireSemicolon && !sameProperty.hasSemicolon) {
    return { passed: false, reason: 'missing-semicolon', from: sameProperty.to, to: sameProperty.to, severity: 'warning' };
  }
  if (sameProperty) return { passed: false, reason: 'wrong-value', from: sameProperty.valueFrom, to: sameProperty.valueTo, severity: 'warning' };

  const sameValue = scopedDeclarations.find((item) => cssRuleValueMatches(item.value, rule.value, rule.property, rule.valueMatch === 'semantic-color'));
  if (sameValue) {
    const typo = suggestCssProperty(sameValue.property);
    if (typo) return { passed: false, reason: 'unknown-property', from: sameValue.propertyFrom, to: sameValue.propertyTo, severity: 'error' };
    return { passed: false, reason: 'wrong-property', from: sameValue.propertyFrom, to: sameValue.propertyTo, severity: 'warning' };
  }
  const likelyWrongProperty = scopedDeclarations.find((item) => suggestCssProperty(item.property) === rule.property.toLowerCase());
  if (likelyWrongProperty) {
    return { passed: false, reason: 'wrong-property', from: likelyWrongProperty.propertyFrom, to: likelyWrongProperty.propertyTo, severity: 'warning' };
  }
  if (rule.type === 'css-declaration-in-media' && selectorDeclarations.length) {
    const first = selectorDeclarations[0];
    return { passed: false, reason: 'wrong-structure', from: first.from, to: first.to, severity: 'warning' };
  }
  if (!selectorDeclarations.length && declarations.length) {
    const first = declarations[0];
    return { passed: false, reason: 'wrong-selector', from: first.propertyFrom, to: first.propertyTo, severity: 'warning' };
  }
  return { passed: false, reason: 'missing', severity: 'hint' };
}

function jsRelatedNodes(root: AstNode, source: string, rule: PracticeValidationRule): AstNode[] {
  const nodes = allNodes(root);
  if (rule.type === 'js-declaration') return nodes.filter((node) => declarationInfo(node, source)?.name === rule.target);
  if (rule.type === 'js-call') return nodes.filter((node) => callParts(node, source)?.callee === normalized(rule.target));
  if (rule.type === 'js-assignment') return nodes.filter((node) => node.name === 'AssignmentExpression'
    && expressionChildren(node).some((child) => targetText(child, source) === normalized(rule.target)));
  if (rule.type === 'js-string') return nodes.filter((node) => node.name === 'String');
  if (rule.type === 'js-operator') return nodes.filter((node) => node.name === 'BinaryExpression');
  if (rule.type === 'js-comparison') return nodes.filter((node) => node.name === 'BinaryExpression');
  if (rule.type === 'js-if' || rule.type === 'js-condition-branches' || rule.type === 'js-guard') return nodes.filter((node) => node.name === 'IfStatement');
  if (rule.type === 'js-array') return nodes.filter((node) => declarationInfo(node, source)?.name === rule.target);
  if (rule.type === 'js-function') return nodes.filter((node) => text(source, node).includes(rule.target));
  if (rule.type === 'js-selector-binding') return nodes.filter((node) => declarationInfo(node, source)?.name === rule.variable);
  if (rule.type === 'js-range-expression') return nodes.filter((node) => node.name === 'ForStatement');
  if (rule.type === 'js-function-behavior') return nodes.filter((node) => node.name === 'FunctionDeclaration' && text(source, node).includes(rule.functionName));
  if (rule.type === 'js-array-access') return nodes.filter((node) => callParts(node, source)?.callee === normalized(rule.logger));
  if (rule.type === 'js-property-assignment') return nodes.filter((node) => node.name === 'AssignmentExpression'
    && expressionChildren(node).some((child) => targetText(child, source) === normalized(rule.target)));
  return [];
}

function localizedRule(rule: PracticeValidationRule, locale: Locale) {
  return {
    label: (locale === 'ar' ? rule.label_ar : rule.label_en)?.trim()
      || (locale === 'ar' ? rule.note_ar : rule.note_en).trim()
      || rule.id,
    concept: (locale === 'ar' ? rule.concept_ar : rule.concept_en)
      ?? (locale === 'ar' ? 'قراءة الكود والتحقق من بنيته' : 'Reading code and checking its structure'),
  };
}

function explainEvidence(rule: PracticeValidationRule, evidence: PracticeEvidence, code: string, locale: Locale): string {
  const copy = practiceStudioMessages[locale];
  const { label } = localizedRule(rule, locale);
  if (evidence.passed) return copy.validationFeedback.passed(label);
  switch (evidence.reason) {
    case 'syntax': return copy.validationFeedback.syntax(label);
    case 'wrong-structure': return copy.validationFeedback.wrongStructure(label);
    case 'wrong-selector': return copy.validationFeedback.wrongSelector(label);
    case 'wrong-property': return copy.validationFeedback.wrongProperty(label);
    case 'unknown-property': {
      const from = evidence.from ?? 0;
      const property = code.slice(from, evidence.to ?? from).trim();
      return copy.validationFeedback.unknownProperty(property, suggestCssProperty(property));
    }
    case 'wrong-value': return copy.validationFeedback.wrongValue(label);
    case 'missing-semicolon': return copy.validationFeedback.missingSemicolon(label);
    case 'wrong-behavior': return copy.validationFeedback.wrongBehavior(label);
    default: return copy.validationFeedback.missing(label);
  }
}

function htmlHasSelector(html: string, selector: string, expectedTag?: string): boolean {
  const root = makeAst(htmlLanguage.parser.parse(html).topNode);
  if (containsError(root)) return false;
  const wanted = selector.trim();
  const elements = allNodes(root).filter((node) => node.name === 'Element' || node.name === 'OpenTag');
  return elements.some((element) => {
    const tag = descendants(element).find((node) => node.name === 'TagName');
    if (expectedTag && (!tag || text(html, tag).toLowerCase() !== expectedTag.toLowerCase())) return false;
    if (wanted.startsWith('#') || wanted.startsWith('.')) {
      const attr = descendants(element).filter((node) => node.name === 'Attribute');
      return attr.some((attribute) => {
        const attrName = attribute.children.find((child) => child.name === 'AttributeName');
        const attrValue = attribute.children.find((child) => child.name === 'AttributeValue');
        if (!attrName || !attrValue) return false;
        const value = unquote(html, { ...attrValue, name: 'String' });
        return wanted.startsWith('#')
          ? text(html, attrName).toLowerCase() === 'id' && value === wanted.slice(1)
          : text(html, attrName).toLowerCase() === 'class' && Boolean(value?.split(/\s+/).includes(wanted.slice(1)));
      });
    }
    return Boolean(tag && text(html, tag).toLowerCase() === wanted.toLowerCase());
  });
}

function declarationHasTypeAndValue(source: string, initializer: AstNode | undefined, expectedType?: 'number' | 'string' | 'boolean' | 'array', expectedValue?: string | number | boolean): boolean {
  if (!initializer) return expectedType === undefined && expectedValue === undefined;
  if (expectedType && expressionType(initializer) !== expectedType) return false;
  if (expectedValue !== undefined && !matchesLiteral(source, initializer, expectedValue)) return false;
  return true;
}

function assignmentMatches(
  node: AstNode,
  source: string,
  target: string,
  expectedType?: 'number' | 'string' | 'boolean',
  expectedValue?: string | number | boolean,
  mustDifferFrom?: string | number,
  mustBeNonEmpty = false,
): boolean {
  if (node.name !== 'AssignmentExpression') return false;
  const operands = expressionChildren(node);
  const left = operands[0];
  const right = operands[1];
  if (!left || !right || targetText(left, source) !== normalized(target)) return false;
  if (expectedType && expressionType(right) !== expectedType) return false;
  if (expectedValue !== undefined && !matchesLiteral(source, right, expectedValue)) return false;
  if (mustDifferFrom !== undefined && literalValue(source, right) === mustDifferFrom) return false;
  if (mustBeNonEmpty) {
    const value = literalValue(source, right);
    if (typeof value !== 'string' || !value.trim()) return false;
  }
  return true;
}

function assignmentIsInsideCallCallback(
  assignment: AstNode,
  root: AstNode,
  source: string,
  context: NonNullable<Extract<PracticeValidationRule, { type: 'js-property-assignment' }>['withinCall']>,
): boolean {
  return allNodes(root).some((node) => {
    const call = callParts(node, source);
    if (!call || call.callee !== normalized(context.target)) return false;
    if (context.argument !== undefined) {
      const argument = context.argumentIndex === undefined
        ? call.args
        : (call.args[context.argumentIndex] ? [call.args[context.argumentIndex]] : []);
      if (!argument.some((item) => matchesLiteral(source, item, context.argument as string | number))) return false;
    }
    const callbackIndex = context.callbackArgumentIndex ?? call.args.length - 1;
    const callback = call.args[callbackIndex];
    if (!callback || (callback.name !== 'ArrowFunction' && callback.name !== 'FunctionExpression')) return false;
    return assignment.from >= callback.from && assignment.to <= callback.to;
  });
}

function jsRuleMatches(root: AstNode, source: string, html: string, rule: PracticeValidationRule): boolean {
  const nodes = allNodes(root);
  switch (rule.type) {
    case 'js-declaration':
      return nodes.some((node) => {
        const info = declarationInfo(node, source);
        return Boolean(info && info.name === rule.target && info.kind === rule.property
          && declarationHasTypeAndValue(source, info.initializer, rule.expectedType, rule.expectedValue));
      });
    case 'js-call':
      return nodes.some((node) => {
        const call = callParts(node, source);
        if (!call || call.callee !== normalized(rule.target)) return false;
        if (rule.argument !== undefined) {
          const candidates = rule.argumentIndex === undefined
          ? call.args
          : (call.args[rule.argumentIndex] ? [call.args[rule.argumentIndex]] : []);
          if (!candidates.some((arg) => matchesLiteral(source, arg, rule.argument as string | number))) return false;
        }
        if (rule.requireCallback) {
          const callback = call.args.at(-1);
          if (!callback || (callback.name !== 'ArrowFunction' && callback.name !== 'FunctionExpression')) return false;
        }
        return true;
      });
    case 'js-assignment':
      return nodes.some((node) => {
        if (!assignmentMatches(node, source, rule.target, rule.expectedType, rule.expectedValue, rule.mustDifferFrom, rule.mustBeNonEmpty)) return false;
        if (!rule.mustFollowVariable && !rule.mustFollowKind) return true;
        return nodes.some((candidate) => {
          const declaration = declarationInfo(candidate, source);
          return declaration?.name === (rule.mustFollowVariable ?? rule.target)
            && (!rule.mustFollowKind || declaration.kind === rule.mustFollowKind)
            && candidate.to < node.from;
        });
      });
    case 'js-string':
      return nodes.some((node) => node.name === 'String' && unquote(source, node) === rule.target);
    case 'js-operator':
      return nodes.some((node) => /(?:Op|Equals)$/.test(node.name) && text(source, node) === rule.target);
    case 'js-comparison':
      return comparisonRuleMatches(root, source, rule);
    case 'js-if':
      return nodes.some((node) => node.name === 'IfStatement');
    case 'js-array':
      return nodes.some((node) => {
        const info = declarationInfo(node, source);
        if (!info || info.name !== rule.target || info.initializer?.name !== 'ArrayExpression') return false;
        const items = expressionChildren(info.initializer);
        return (rule.itemCount === undefined || items.length === rule.itemCount)
          && (rule.stringItems !== true || items.every((item) => item.name === 'String'))
          && (rule.cssColorItems !== true || items.every((item) => {
            const value = item.name === 'String' ? unquote(source, item) : null;
            return Boolean(value && (isCssColorKeyword(value) || normalizeCssColor(value)));
          }));
      });
    case 'js-function':
      return nodes.some((node) => {
        const isDeclaration = node.name === 'FunctionDeclaration'
          && node.children.some((child) => child.name === 'VariableDefinition' && text(source, child) === rule.target);
        const declaration = declarationInfo(node, source);
        const isFunctionExpression = declaration?.name === rule.target
          && (declaration.initializer?.name === 'ArrowFunction' || declaration.initializer?.name === 'FunctionExpression');
        if (!isDeclaration && !isFunctionExpression) return false;
        return !rule.parameter || descendants(node).some((child) => child.name === 'VariableDefinition' && text(source, child) === rule.parameter);
      });
    case 'js-selector-binding':
      return selectorBinding(root, source, html, rule.variable, rule.selector, rule.expectedTag);
    case 'js-range-expression':
      return nodes.some((node) => {
        if (node.name !== 'ForStatement') return false;
        const declaration = descendants(node).find((child) => declarationInfo(child, source)?.name === rule.variable);
        const info = declaration ? declarationInfo(declaration, source) : null;
        const condition = descendants(node).find((child) => child.name === 'BinaryExpression');
        if (!info || !condition || !info.initializer || literalValue(source, info.initializer) !== rule.lowerBound) return false;
        const sides = expressionChildren(condition);
        const op = condition.children.find((child) => /(?:CompareOp|ArithOp|LogicOp)/.test(child.name));
        return Boolean(sides[0] && sides[1] && targetText(sides[0], source) === rule.variable
          && literalValue(source, sides[1]) === rule.upperBound && op && ['<', '<=', '>', '>='].includes(text(source, op)));
      });
    case 'js-condition-branches':
      if (rule.branchCheck === 'condition') return Boolean(conditionMatches(root, source, rule.variable, rule.operator, rule.threshold));
      if (rule.branchCheck === 'if-message') return conditionBranchMatches(root, source, rule, 'if', rule.ifMessage);
      if (rule.branchCheck === 'else-message') return conditionBranchMatches(root, source, rule, 'else', rule.elseMessage);
      return false;
    case 'js-function-behavior':
      return nodes.some((node) => functionBehaviorMatches(node, source, rule.functionName, rule.parameter, rule.operator, rule.operand));
    case 'js-array-access':
      return nodes.some((node) => {
        const call = callParts(node, source);
        return Boolean(call && call.callee === normalized(rule.logger) && call.args.some((arg) => arg.name === 'MemberExpression'
          && arg.children.some((child) => child.name === 'VariableName' && text(source, child) === rule.arrayName)
          && arg.children.some((child) => child.name === 'Number' && literalValue(source, child) === rule.index)));
      });
    case 'js-property-assignment':
      return nodes.some((node) => {
        if (!assignmentMatches(node, source, rule.target, 'string', rule.value)) return false;
        if (rule.withinGuardVariable && !assignmentIsInsideGuard(node, source, rule.withinGuardVariable)) return false;
        if (rule.withinCall && !assignmentIsInsideCallCallback(node, root, source, rule.withinCall)) return false;
        if (rule.withinCall) return true;
        if (!rule.withinCallback) return true;
        let ancestor = node.parent;
        while (ancestor) {
          if (ancestor.name === 'ArrowFunction' || ancestor.name === 'FunctionExpression') {
            const args = ancestor.parent;
            if (args?.name === 'ArgList' && args.parent?.name === 'CallExpression') return true;
          }
          ancestor = ancestor.parent;
        }
        return false;
      });
    case 'js-guard':
      return statusGuardMatches(root, source, rule.variable);
    default:
      return false;
  }
}

/**
 * Validate CSS or JavaScript practice rules without executing learner code.
 * Matching is intentionally structural and conservative; the rule schema does not
 * encode JS scope/type inference or full CSS cascade semantics, so checks use local
 * declarations, literal initializers, and the nearest matching syntax subtree.
 */
export function validateAstPractice(
  language: 'css' | 'javascript',
  html: string,
  code: string,
  rules: readonly PracticeValidationRule[],
  locale: Locale = 'en',
) {
  const root = makeAst((language === 'css' ? cssLanguage : javascriptLanguage).parser.parse(code).topNode);
  const syntaxError = allNodes(root).find((node) => node.error);
  return rules.map((rule) => {
    let evidence: PracticeEvidence;
    if (language === 'css') {
      evidence = cssEvidence(root, code, rule);
      if (!evidence.passed && evidence.reason === 'missing' && syntaxError) {
        evidence = { passed: false, reason: 'syntax', from: syntaxError.from, to: syntaxError.to, severity: 'error' };
      }
    } else if (jsRuleMatches(root, code, html, rule)) {
      const location = jsRelatedNodes(root, code, rule)[0];
      evidence = { passed: true, reason: 'satisfied', from: location?.from, to: location?.to, severity: 'hint' };
    } else {
      const candidates = jsRelatedNodes(root, code, rule);
      const relatedSyntaxError = syntaxError && (!candidates.length || candidates.some((node) => syntaxError.from <= node.to && syntaxError.to >= node.from));
      if (relatedSyntaxError) {
        evidence = { passed: false, reason: 'syntax', from: syntaxError.from, to: syntaxError.to, severity: 'error' };
      } else if (candidates.length) {
        evidence = { passed: false, reason: 'wrong-behavior', from: candidates[0].from, to: candidates[0].to, severity: 'warning' };
      } else {
        evidence = syntaxError
          ? { passed: false, reason: 'syntax', from: syntaxError.from, to: syntaxError.to, severity: 'error' }
          : { passed: false, reason: 'missing', severity: 'hint' };
      }
    }
    const { label, concept } = localizedRule(rule, locale);
    const status = evidence.passed ? 'passed' : evidence.reason === 'missing' ? 'missing' : 'failed';
    return makePracticeRequirementResult({
      id: rule.id,
      status,
      label,
      concept,
      explanation: explainEvidence(rule, evidence, code, locale),
      reason: evidence.reason,
      language,
      source: code,
      from: evidence.from,
      to: evidence.to,
      severity: evidence.severity,
    });
  });
}
