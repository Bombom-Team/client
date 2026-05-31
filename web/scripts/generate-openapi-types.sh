#!/usr/bin/env bash
set -euo pipefail

OAS_SPEC_URL="${OAS_SPEC_URL:-https://raw.githubusercontent.com/Bombom-Team/bom-bom-api-spec/main/openapi.yaml}"

WEB_LEGACY_TYPES="./src/types/openapi.d.ts"
SHARED_GENERATED_DIR="../shared/src/core/apis/generated"
SHARED_TYPES="${SHARED_GENERATED_DIR}/types.d.ts"

if [ -n "${OPEN_API_DOCS:-}" ]; then
  openapi-typescript "$OPEN_API_DOCS" -o "$WEB_LEGACY_TYPES"
  prettier --write "$WEB_LEGACY_TYPES"
else
  echo "[gen:api] OPEN_API_DOCS 미설정 — legacy openapi.d.ts 생성을 건너뜁니다."
fi

openapi-typescript "$OAS_SPEC_URL" -o "$SHARED_TYPES"
prettier --write "$SHARED_TYPES"

node ../shared/oas-gen/bin/oas-gen.mjs --spec "$OAS_SPEC_URL" --out shared/src/core/apis/generated
prettier --write "${SHARED_GENERATED_DIR}/**/*.ts"
