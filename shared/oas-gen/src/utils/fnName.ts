import type { NormalizedOperation } from './parseSpec';

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

const firstWordIsActionVerb = (name: string): boolean => {
  const match = /^([a-z]+)/.exec(name);
  if (!match) return false;
  return ACTION_VERBS.has(match[1]);
};

const capitalize = (s: string): string =>
  s.length === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1);

export const deriveFnName = (op: NormalizedOperation): string => {
  if (firstWordIsActionVerb(op.operationId)) {
    return op.operationId;
  }
  return `${op.method}${capitalize(op.tag)}${capitalize(op.operationId)}`;
};

export const fnNamePascal = (op: NormalizedOperation): string =>
  capitalize(deriveFnName(op));
