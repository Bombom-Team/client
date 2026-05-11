import { defineConfig } from 'orval';

const SPEC = process.env.OPEN_API_DOCS;
const OUTPUT_DIR =
  process.env.OAS_GEN_OUTPUT_DIR ?? '../../web/src/apis/__oas_tmp__';

if (!SPEC) {
  throw new Error(
    '[oas-gen] OPEN_API_DOCS env is required (yaml URL or local path)',
  );
}

export default defineConfig({
  bombom: {
    input: { target: SPEC },
    output: {
      mode: 'tags-split',
      target: OUTPUT_DIR,
      schemas: `${OUTPUT_DIR}/_models`,
      client: 'fetch',
      clean: true,
      prettier: false,
      override: {
        mutator: {
          path: '../../shared/src/core/apis/orvalMutator.ts',
          name: 'orvalMutator',
          default: false,
        },
        useTypeOverInterfaces: true,
        useNamedParameters: true,
      },
    },
  },
});
