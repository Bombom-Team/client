# AGENTS.md

This document defines the REQUIRED behavior for all AI agents
operating in this repository.

This includes (but is not limited to):

- OpenAI Codex
- Claude Code
- Cursor
- Any future AI coding agents

Failure to follow these rules is considered a critical violation.

---

## 1. Entry Point & Rule Hierarchy (Absolute)

AI agents MUST follow the rule hierarchy below, in order:

1. CONVENTIONS.md (hub document)
2. docs/ai-rules.md
3. docs/frontend-coding-standards.md (when touching frontend code)
4. Existing codebase patterns
5. Tool defaults (eslint, prettier, framework conventions)

If rules conflict, the higher-level document ALWAYS wins.

---

## 2. Required Reading Order (Mandatory)

Before making ANY code changes, the AI MUST:

1. Read `CONVENTIONS.md`
2. Identify which rule document applies:
   - Frontend code → `frontend-coding-standards.md`
   - AI behavior → `ai-rules.md`
3. Apply ONLY the relevant rules

If the applicable rules are unclear, the AI MUST STOP and ASK.

---

## 3. Modification Scope Rules (Blocking)

- Modify ONLY files explicitly requested by the user
  OR files strictly required to complete the task.
- DO NOT refactor unrelated code.
- DO NOT reformat, reorder, or rename code without necessity.
- DO NOT apply stylistic or cosmetic changes unless requested.

If scope is ambiguous, the AI MUST STOP and ASK.

---

## 4. Generated Files (Absolute Prohibition)

- Files ending with `.gen.ts` MUST NOT be edited manually.
- Generated files MUST be updated ONLY via their generator commands.
- Any direct modification of generated files is STRICTLY FORBIDDEN.

If a task requires changing generated output:

- The AI MUST instruct the user to run the generator.
- The AI MUST NOT patch the file manually.

---

## 5. Frontend Code Responsibilities

When modifying frontend code, the AI MUST:

- Follow `frontend-coding-standards.md` strictly.
- Respect component, hook, and utility separation rules.
- Use the approved folder structure and naming conventions.
- Follow TanStack Query usage rules when handling server state.

If unsure whether code is frontend-related, ASK before proceeding.

---

## 6. Lint & Style Enforcement (Blocking)

AI agents MUST treat linting as a BLOCKING requirement.

Before considering any task complete, the AI MUST:

1. Run ESLint auto-fix:
   - `pnpm --filter {workspace} lint:fix`
2. Run Stylelint auto-fix:
   - `pnpm --filter {workspace} stylelint:fix`
3. Re-run lint checks:
   - ESLint / Stylelint MUST pass with ZERO errors

Rules:

- If auto-fix produces changes → those changes MUST be committed.
- Ending a task with lint/stylelint errors is STRICTLY FORBIDDEN.
- If lint cannot be fixed automatically, the AI MUST fix manually.

---

## 7. Task Completion Definition

A task is considered COMPLETE only when ALL conditions are met:

- Requested features are fully implemented
- No lint or stylelint errors remain
- All rule documents are respected
- No forbidden files were modified
- Scope violations did not occur

If any condition is not satisfied, the AI MUST NOT end the task.

---

## 8. Failure Handling Rules

The AI MUST STOP and ASK if:

- Requirements are ambiguous
- Rules are missing or contradictory
- Required commands cannot be run
- A decision would require guessing

The AI MUST NEVER:

- Guess project-specific behavior
- Invent APIs, code paths, or data contracts
- Silently ignore rule violations
- End a task in a broken or unverified state

---

## 9. Communication Rules

- Be explicit about assumptions.
- Report when auto-fix or additional commits are required.
- Explain why a rule prevents a requested action when refusing.

Silence or implicit behavior is NOT acceptable.

---

## 10. Repository Overview

봄봄(BomBom) monorepo. Packages include:

- `web/` — React/TypeScript web client (see `web/CLAUDE.md`)
- `app/` — React Native mobile client
- `shared/` — Shared theme, UI components, and utilities used by both `web/` and `app/`
- `server/` — Backend API

---

## 11. Conventions Index

Detailed conventions live under `/docs/` and are indexed in `/CONVENTIONS.md`. Read the indexed documents in the situations they describe — do not duplicate their content here.

---

## 12. Git Workflow

These rules apply to commits and pull requests in **any** package.

- **Commit Message Convention**: Read `/docs/git-commit-convention.md` before composing a commit message. Summary: `type: 한국어 명사형 설명` — no scope, no ticket prefix in the subject, no `Co-Authored-By` trailer.
- **PR Format**: `[{issue_key}] {type}: {subject}` — the issue key prefix belongs in the PR title only, not in commit subjects.
  - Example: `[BOM-75] feat: SearchInput component 제작`
- **Branch Naming**: `{type}/{issue_key}` (e.g., `feat/BOM-5`)
- **Merge Strategy**: Squash & Merge to `develop`, Create a Commit merge to `main`

---

## 13. Codex Review Policy

When Codex reviews a pull request, it MUST act as a high-signal reviewer.

Focus on:

- Production bugs, runtime crashes, and broken user flows
- Data loss, stale data, duplicate requests, and consistency issues
- Security issues, auth/permission bypass, and secret exposure
- API contract breaks, generated-type misuse, and backward compatibility risks
- Repository convention violations that lint cannot catch

Avoid:

- Style, formatting, import-order, or naming comments handled by tools
- Optional refactors and "nice to have" suggestions
- Comments on pre-existing issues outside the PR diff
- Findings without exact file and line evidence

Rules:

- Review only changes introduced by the PR.
- Prefer no comment over a low-confidence comment.
- Critical and Major findings require a concrete failure scenario.
- Minor findings are allowed only when they are actionable and limited.
- All review text should be concise Korean.

---

## Final Note

This repository prioritizes:

- Safety over speed
- Correctness over completion
- Explicit rules over assumptions

AI agents are expected to behave as
**strict, conservative collaborators**, not autonomous decision-makers.
