import type { NormalizedOperation } from './parseSpec';

const looksLikePageParam = (name: string) => /^page$/i.test(name);
const looksLikeSizeParam = (name: string) => /^size$/i.test(name);

export const isPageable = (op: NormalizedOperation): boolean => {
  if (op.method !== 'get') return false;
  const queryParams = op.parameters.filter((p) => p.in === 'query');
  const hasPage = queryParams.some((p) => looksLikePageParam(p.name));
  const hasSize = queryParams.some((p) => looksLikeSizeParam(p.name));
  if (hasPage && hasSize) return true;
  // Spring Pageable as single $ref parameter
  return queryParams.some((p) => {
    const schemaRef =
      p.schema && '$ref' in p.schema ? p.schema.$ref : undefined;
    return Boolean(schemaRef && /Pageable/i.test(schemaRef));
  });
};
