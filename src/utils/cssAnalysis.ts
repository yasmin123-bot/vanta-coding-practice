import { cssLanguage } from '@codemirror/lang-css';
import type { PracticeCodeLocation } from '../content/practiceTypes';

type CssWalkContext = { media: string | null; selector: string | null };

export type CssDeclarationFact = {
  selector: string;
  media: string | null;
  property: string;
  value: string;
  from: number;
  to: number;
  propertyFrom: number;
  propertyTo: number;
  valueFrom: number;
  valueTo: number;
  hasSemicolon: boolean;
};

const knownCssProperties = new Set([
  'accent-color', 'align-content', 'align-items', 'align-self', 'all', 'animation', 'animation-delay',
  'animation-direction', 'animation-duration', 'animation-fill-mode', 'animation-iteration-count',
  'animation-name', 'animation-play-state', 'animation-timing-function', 'appearance', 'aspect-ratio',
  'backdrop-filter', 'backface-visibility', 'background', 'background-attachment', 'background-clip',
  'background-color', 'background-image', 'background-origin', 'background-position', 'background-repeat',
  'background-size', 'border', 'border-block', 'border-bottom', 'border-bottom-color', 'border-bottom-left-radius',
  'border-bottom-right-radius', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color',
  'border-image', 'border-left', 'border-radius', 'border-right', 'border-spacing', 'border-style', 'border-top',
  'border-top-color', 'border-top-left-radius', 'border-top-right-radius', 'border-top-style', 'border-top-width',
  'border-width', 'bottom', 'box-shadow', 'box-sizing', 'break-after', 'break-before', 'break-inside', 'caption-side',
  'caret-color', 'clear', 'clip-path', 'color', 'column-count', 'column-gap', 'columns', 'content', 'cursor',
  'direction', 'display', 'filter', 'flex', 'flex-basis', 'flex-direction', 'flex-flow', 'flex-grow', 'flex-shrink',
  'flex-wrap', 'float', 'font', 'font-family', 'font-feature-settings', 'font-size', 'font-style', 'font-variant',
  'font-weight', 'gap', 'grid', 'grid-area', 'grid-auto-columns', 'grid-auto-flow', 'grid-auto-rows', 'grid-column',
  'grid-row', 'grid-template', 'grid-template-areas', 'grid-template-columns', 'grid-template-rows', 'height',
  'hyphens', 'inset', 'justify-content', 'justify-items', 'justify-self', 'left', 'letter-spacing', 'line-height',
  'list-style', 'margin', 'margin-block', 'margin-bottom', 'margin-inline', 'margin-left', 'margin-right', 'margin-top',
  'max-height', 'max-width', 'min-height', 'min-width', 'object-fit', 'object-position', 'opacity', 'order', 'outline',
  'outline-color', 'outline-offset', 'outline-style', 'outline-width', 'overflow', 'overflow-x', 'overflow-y',
  'overscroll-behavior', 'padding', 'padding-block', 'padding-bottom', 'padding-inline', 'padding-left', 'padding-right',
  'padding-top', 'perspective', 'place-content', 'place-items', 'pointer-events', 'position', 'resize', 'right',
  'scroll-behavior', 'text-align', 'text-decoration', 'text-decoration-color', 'text-decoration-line',
  'text-decoration-style', 'text-indent', 'text-overflow', 'text-shadow', 'text-transform', 'top', 'transform',
  'transform-origin', 'transition', 'transition-delay', 'transition-duration', 'transition-property',
  'transition-timing-function', 'unicode-bidi', 'user-select', 'vertical-align', 'visibility', 'white-space', 'width',
  'word-break', 'word-spacing', 'writing-mode', 'z-index',
]);

const commonColorKeywords = new Set((
  'aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood ' +
  'cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod ' +
  'darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon ' +
  'darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray ' +
  'dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green ' +
  'greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon ' +
  'lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon ' +
  'lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta ' +
  'maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen ' +
  'mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive ' +
  'olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff ' +
  'peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen ' +
  'seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato ' +
  'transparent turquoise violet wheat white whitesmoke yellow yellowgreen currentcolor'
).split(/\s+/));

const semanticColorKeywords: Record<string, string> = {
  aqua: '#00ffff', black: '#000000', blue: '#0000ff', fuchsia: '#ff00ff', gray: '#808080', green: '#008000',
  grey: '#808080', lime: '#00ff00', maroon: '#800000', navy: '#000080', olive: '#808000', purple: '#800080',
  red: '#ff0000', silver: '#c0c0c0', teal: '#008080', white: '#ffffff', yellow: '#ffff00',
};

function canonicalRgbChannels(channels: number[], alpha = 1): string | null {
  if (channels.length !== 3 || channels.some((channel) => !Number.isFinite(channel) || channel < 0 || channel > 255)
    || !Number.isFinite(alpha) || alpha < 0 || alpha > 1) return null;
  const rgb = channels.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('');
  const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return `#${rgb}${alphaHex === 'ff' ? '' : alphaHex}`;
}

function normalizeWithCssom(candidate: string): string | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') return null;
  const host = document.body ?? document.documentElement;
  if (!host) return null;
  const probe = document.createElement('span');
  probe.style.color = candidate;
  if (!probe.style.color) return null;
  host.appendChild(probe);
  let computed = '';
  try {
    computed = window.getComputedStyle(probe).color.trim().toLowerCase();
  } catch {
    return null;
  } finally {
    probe.remove();
  }
  const rgb = computed.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (!rgb) return null;
  return canonicalRgbChannels(rgb.slice(1, 4).map(Number), rgb[4] === undefined ? 1 : Number(rgb[4]));
}

/** Canonicalize valid CSS color formats for semantic exercise matching. */
export function normalizeCssColor(value: string): string | null {
  const candidate = value.trim().toLowerCase();
  const named = semanticColorKeywords[candidate];
  if (named) return named;
  if (candidate === 'transparent') return '#00000000';
  const hex = candidate.match(/^#([\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i)?.[1];
  if (hex) {
    const expanded = hex.length <= 4 ? [...hex].map((digit) => digit + digit).join('') : hex;
    return canonicalRgbChannels(
      [0, 2, 4].map((index) => Number.parseInt(expanded.slice(index, index + 2), 16)),
      Number.parseInt(expanded.slice(6, 8) || 'ff', 16) / 255,
    );
  }
  const rgb = candidate.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (rgb) {
    const channels = rgb.slice(1, 4).map(Number);
    const alpha = rgb[4] === undefined ? 1 : Number(rgb[4]);
    return canonicalRgbChannels(channels, alpha);
  }
  const modernRgb = candidate.match(/^rgba?\(\s*(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})(?:\s*\/\s*([\d.]+))?\s*\)$/i);
  if (modernRgb) {
    const channels = modernRgb.slice(1, 4).map(Number);
    const alpha = modernRgb[4] === undefined ? 1 : Number(modernRgb[4]);
    return canonicalRgbChannels(channels, alpha);
  }
  return normalizeWithCssom(candidate);
}

export function isCssColorKeyword(value: string): boolean {
  return commonColorKeywords.has(value.trim().toLowerCase());
}

function normalized(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function normalizedSelector(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizedMedia(value: string): string {
  return normalized(value).replace(/^\((.*)\)$/, '$1').replace(/\s*:\s*/g, ':');
}

function childNamed(node: import('@lezer/common').SyntaxNode, name: string) {
  for (let child = node.firstChild; child; child = child.nextSibling) if (child.name === name) return child;
  return null;
}

function stripComments(value: string): string {
  return value.replace(/\/\*[\s\S]*?\*\//g, (comment) => ' '.repeat(comment.length));
}

function hasSemicolonAfter(source: string, offset: number): boolean {
  const tail = source.slice(offset);
  const withoutLeadingComments = tail.replace(/^(?:(?:\s+)|(?:\/\*[\s\S]*?\*\/))*/, '');
  return withoutLeadingComments.startsWith(';');
}

function declarationValue(source: string, from: number, to: number) {
  const raw = stripComments(source.slice(from, to));
  const important = raw.match(/\s*!important\s*$/i);
  const valuePart = important ? raw.slice(0, important.index) : raw;
  const leading = valuePart.search(/\S/);
  const valueFrom = from + (leading < 0 ? valuePart.length : leading);
  const value = valuePart.trim();
  return {
    value: normalized(value),
    valueFrom,
    valueTo: valueFrom + value.length,
  };
}

export function getCssDeclarationFacts(source: string): CssDeclarationFact[] {
  const facts: CssDeclarationFact[] = [];
  const tree = cssLanguage.parser.parse(source);

  const walk = (node: import('@lezer/common').SyntaxNode, context: CssWalkContext) => {
    let current = context;
    if (node.name === 'MediaStatement') {
      const block = childNamed(node, 'Block');
      current = {
        ...context,
        media: normalizedMedia(source.slice(node.from, block?.from ?? node.to).replace(/^@media\s*/i, '')),
      };
    }
    if (node.name === 'RuleSet') {
      const block = childNamed(node, 'Block');
      current = { ...current, selector: normalizedSelector(source.slice(node.from, block?.from ?? node.to)) };
    }
    if (node.name === 'Declaration' && current.selector) {
      const property = childNamed(node, 'PropertyName');
      const colon = childNamed(node, ':');
      if (property && colon) {
        const value = declarationValue(source, colon.to, node.to);
        facts.push({
          selector: current.selector,
          media: current.media,
          property: normalized(source.slice(property.from, property.to)),
          value: value.value,
          from: node.from,
          to: node.to,
          propertyFrom: property.from,
          propertyTo: property.to,
          valueFrom: value.valueFrom,
          valueTo: value.valueTo,
          hasSemicolon: hasSemicolonAfter(source, node.to),
        });
      }
    }
    for (let child = node.firstChild; child; child = child.nextSibling) walk(child, current);
  };

  walk(tree.topNode, { media: null, selector: null });
  return facts;
}

export function isKnownCssProperty(property: string): boolean {
  const normalizedProperty = property.trim().toLowerCase();
  if (normalizedProperty.startsWith('--')) return true;
  if (knownCssProperties.has(normalizedProperty)) return true;
  if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
    try {
      return CSS.supports(normalizedProperty, 'initial');
    } catch {
      return false;
    }
  }
  return false;
}

function levenshtein(left: string, right: string): number {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    let diagonal = previous[0];
    previous[0] = row;
    for (let column = 1; column <= right.length; column += 1) {
      const above = previous[column];
      previous[column] = Math.min(
        previous[column] + 1,
        previous[column - 1] + 1,
        diagonal + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return previous[right.length];
}

export function suggestCssProperty(property: string): string | null {
  const candidate = property.trim().toLowerCase();
  if (!candidate || candidate.startsWith('--')) return null;
  let best: { value: string; distance: number } | null = null;
  for (const known of knownCssProperties) {
    const distance = levenshtein(candidate, known);
    if (!best || distance < best.distance) best = { value: known, distance };
  }
  const limit = candidate.length < 7 ? 1 : 2;
  return best && best.distance <= limit ? best.value : null;
}

export function cssValueSupport(property: string, value: string): boolean | null {
  if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
    try {
      return CSS.supports(property, value);
    } catch {
      return false;
    }
  }
  if (['color', 'background-color', 'border-color', 'outline-color'].includes(property.toLowerCase())) {
    const normalizedValue = value.trim().toLowerCase();
    if (commonColorKeywords.has(normalizedValue)) return true;
    if (/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(normalizedValue)) return true;
    if (/^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(/i.test(normalizedValue)) return true;
    return false;
  }
  return null;
}

export function suggestCssColorValue(value: string): string | null {
  const candidate = value.trim().toLowerCase();
  if (!candidate || candidate.startsWith('#') || candidate.includes('(')) return null;
  let best: { value: string; distance: number } | null = null;
  for (const known of commonColorKeywords) {
    const distance = levenshtein(candidate, known);
    if (!best || distance < best.distance) best = { value: known, distance };
  }
  return best && best.distance <= 2 && best.distance < candidate.length ? best.value : null;
}

export function getCssUnmatchedBraceOffsets(source: string): number[] {
  const stack: number[] = [];
  const unmatched: number[] = [];
  let quote = '';
  let inComment = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (inComment) {
      if (char === '*' && next === '/') { inComment = false; index += 1; }
      continue;
    }
    if (quote) {
      if (char === '\\') { index += 1; continue; }
      if (char === quote) quote = '';
      continue;
    }
    if (char === '/' && next === '*') { inComment = true; index += 1; continue; }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === '{') stack.push(index);
    else if (char === '}') {
      if (stack.length) stack.pop();
      else unmatched.push(index);
    }
  }
  unmatched.push(...stack);
  return unmatched.sort((left, right) => left - right);
}

export function cssLocation(source: string, language: 'css', from: number, to = from): PracticeCodeLocation {
  const safeFrom = Math.max(0, Math.min(from, source.length));
  const safeTo = Math.max(safeFrom, Math.min(to, source.length));
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

export function normalizeCssMediaCondition(value: string): string {
  return normalizedMedia(value);
}
