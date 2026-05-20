import type { NormalizedOperation } from './parseSpec';
import { toCamel } from './naming';

const ACTION_VERBS = new Set([
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'add',
  'remove',
  'create',
  'update',
  'list',
  'find',
  'fetch',
  'replace',
  'save',
]);

const API_VERSION_PREFIXES = new Set(['api', 'v1', 'v2', 'v3', 'v4']);

const firstWordIsActionVerb = (name: string): boolean => {
  const match = /^([a-z]+)/.exec(name);
  if (!match) return false;
  return ACTION_VERBS.has(match[1]);
};

const capitalize = (s: string): string =>
  s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);

const toPascal = (s: string): string => capitalize(toCamel(s));

const actionFromPath = (op: NormalizedOperation): string => {
  const segments = op.path
    .split('/')
    .filter(Boolean)
    .filter((s) => !s.startsWith('{'))
    .filter((s) => !API_VERSION_PREFIXES.has(s.toLowerCase()));

  const lastSeg = segments[segments.length - 1];
  if (!lastSeg) return '';
  if (lastSeg.toLowerCase() === op.tag.toLowerCase()) return '';
  return toPascal(lastSeg);
};

export const deriveFnName = (op: NormalizedOperation): string => {
  if (firstWordIsActionVerb(op.operationId)) {
    return op.operationId;
  }
  return `${op.method}${capitalize(op.tag)}${actionFromPath(op)}`;
};

export const fnNamePascal = (op: NormalizedOperation): string =>
  capitalize(deriveFnName(op));
