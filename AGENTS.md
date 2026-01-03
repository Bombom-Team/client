# AGENTS.md

## Global Rules (Absolute)

- Follow CONVENTIONS.md strictly when generating or editing code
- Do NOT violate monorepo boundaries (admin / web / shared)
- Do NOT modify generated files (e.g. routeTree.gen.ts)
- Use pnpm workspace commands only
- Do NOT introduce new patterns or libraries without explicit user approval

## Workflow Enforcement

- All task names and task descriptions MUST be written in Korean.
- If user instruction starts with [WORKFLOW], you MUST:
  1. Break down tasks
  2. Share plan and wait for confirmation
  3. Implement per item
  4. Commit per item
  5. 모든 구현과 커밋을 마친 후 push 전에 워크스페이스별 lint/type-check를 수행한다
  6. Push and open PR (target: dev)

## Git Rules

- Branch naming, commit message, PR rules MUST follow CONVENTIONS.md
- Never skip commit or push steps in [WORKFLOW] mode
