# AI Rules

This document defines STRICT behavior rules for AI agents
working in this repository.

These rules exist to prevent overreach, guessing,
and incomplete or unsafe changes.

---

## Priority

1. CONVENTIONS.md
2. ai-rules.md
3. Existing codebase patterns

If any rule conflicts, higher priority rules ALWAYS win.

---

## Modification Scope (Critical)

- Modify ONLY files explicitly mentioned by the user.
- DO NOT refactor unrelated code.
- DO NOT perform cosmetic or formatting-only changes.
- DO NOT rename files, symbols, or structure unless explicitly requested.
- If scope is unclear, STOP and ASK before proceeding.

---

## Generated Files (Absolute)

- Files ending with `.gen.ts` MUST NOT be edited manually.
- Generated files MUST be updated ONLY via their generating commands.
- Any manual modification to generated files is FORBIDDEN.

---

## Lint & Auto-Fix (Blocking)

- ESLint and Stylelint MUST be auto-fixed before task completion.
- Auto-fix MUST be executed using workspace scripts:
  - `pnpm --filter {workspace} lint:fix`
  - `pnpm --filter {workspace} stylelint:fix`

- If auto-fix produces changes:
  - Those changes MUST be reviewed.
  - Those changes MUST be committed.

- If lint or stylelint fails, the task MUST NOT end.

---

## Workflow Enforcement

All tasks MUST follow this order:

1. Understand and confirm the task
2. Implement changes
3. Run auto-fix
4. Re-run lint checks
5. Commit changes

A task is COMPLETE only when all checks pass.

---

## Failure Handling (Absolute)

- NEVER guess project-specific behavior.
- NEVER invent APIs, data contracts, or code paths.
- NEVER end a task with failing lint or stylelint.
- If rules are missing or unclear, STOP and ASK.
