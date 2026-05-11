import { readFile } from 'node:fs/promises';
import { load as parseYaml } from 'js-yaml';

export type SchemaRef = { $ref: string };
export type SchemaValue =
  | SchemaRef
  | {
      type?: string;
      items?: SchemaValue;
      properties?: Record<string, SchemaValue>;
      required?: string[];
      $ref?: string;
    };

export type ParameterObject = {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  required?: boolean;
  schema?: SchemaValue;
};

export type OperationObject = {
  operationId?: string;
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: ParameterObject[];
  requestBody?: {
    required?: boolean;
    content?: Record<string, { schema?: SchemaValue }>;
  };
  responses?: Record<
    string,
    {
      description?: string;
      content?: Record<string, { schema?: SchemaValue }>;
    }
  >;
};

export type PathItemObject = Partial<
  Record<'get' | 'post' | 'patch' | 'put' | 'delete', OperationObject>
>;

export type OpenApiSpec = {
  paths?: Record<string, PathItemObject>;
  components?: {
    schemas?: Record<string, SchemaValue>;
  };
};

const HTTP_METHODS = ['get', 'post', 'patch', 'put', 'delete'] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];

export type NormalizedOperation = {
  method: HttpMethod;
  path: string;
  tag: string;
  operationId: string;
  parameters: ParameterObject[];
  requestBodySchemaRef?: string;
  okResponseSchemaRef?: string;
  hasOkResponseBody: boolean;
};

const isUrl = (s: string) => /^https?:\/\//.test(s);

export const loadSpec = async (source: string): Promise<OpenApiSpec> => {
  let raw: string;
  if (isUrl(source)) {
    const res = await fetch(source);
    if (!res.ok) {
      throw new Error(
        `[oas-gen] spec fetch failed: ${res.status} ${res.statusText} (${source})`,
      );
    }
    raw = await res.text();
  } else {
    raw = await readFile(source, 'utf-8');
  }
  const parsed = parseYaml(raw);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('[oas-gen] spec is not a valid YAML object');
  }
  return parsed as OpenApiSpec;
};

const fallbackOperationId = (method: HttpMethod, path: string) => {
  const cleaned = path
    .replace(/\{([^}]+)\}/g, 'By_$1')
    .split('/')
    .filter(Boolean)
    .map((seg, i) =>
      i === 0
        ? seg
        : seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ''),
    )
    .join('');
  return method + cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const refToSchemaName = (ref: string | undefined) => {
  if (!ref) return undefined;
  const match = /^#\/components\/schemas\/(.+)$/.exec(ref);
  return match ? match[1] : undefined;
};

export const normalizeOperations = (
  spec: OpenApiSpec,
): NormalizedOperation[] => {
  const result: NormalizedOperation[] = [];
  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    for (const method of HTTP_METHODS) {
      const op = pathItem[method];
      if (!op) continue;

      const operationId = op.operationId ?? fallbackOperationId(method, path);
      const tag = op.tags?.[0] ?? 'default';

      const okResponse =
        op.responses?.['200'] ?? op.responses?.['201'] ?? undefined;
      const okSchema = okResponse?.content?.['application/json']?.schema;
      const okRef =
        okSchema && '$ref' in okSchema
          ? refToSchemaName(okSchema.$ref)
          : undefined;

      const bodySchema = op.requestBody?.content?.['application/json']?.schema;
      const bodyRef =
        bodySchema && '$ref' in bodySchema
          ? refToSchemaName(bodySchema.$ref)
          : undefined;

      result.push({
        method,
        path,
        tag,
        operationId,
        parameters: op.parameters ?? [],
        requestBodySchemaRef: bodyRef,
        okResponseSchemaRef: okRef,
        hasOkResponseBody: Boolean(okSchema),
      });
    }
  }
  return result;
};

export const groupByTag = (ops: NormalizedOperation[]) => {
  const groups = new Map<string, NormalizedOperation[]>();
  for (const op of ops) {
    const key = op.tag;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(op);
  }
  return groups;
};
