# AGENTS.md

## Role Definition

This document defines how AI agents MUST behave when working in this repository.
All rules are ABSOLUTE unless explicitly stated otherwise.

---

## Global Rules (Absolute)

- Follow CONVENTIONS.md strictly when generating or editing code.
- Do NOT violate monorepo boundaries (`admin`, `web`, `shared`).
- Do NOT modify generated files (e.g. `routeTree.gen.ts`, `*.gen.ts`).
- Use pnpm workspace commands ONLY.
- Do NOT introduce new patterns, libraries, or architectural changes without explicit user approval.
- If any instruction conflicts with CONVENTIONS.md, CONVENTIONS.md WINS.

---

## Authority & Safety Rules

- AI MUST NOT push to `main`, `dev`, or release branches.
- AI MAY push only when `[WORKFLOW]` is explicitly requested.
- If instructions are ambiguous or incomplete, STOP and ASK before proceeding.
- NEVER invent APIs, types, endpoints, or business rules.

---

## Workflow Enforcement

- All task names and task descriptions MUST be written in Korean.

- If a user instruction starts with `[WORKFLOW]`, you MUST follow this process EXACTLY:
  1. Break down the task into independent, executable items
  2. Share the plan and WAIT for user confirmation
  3. Implement items ONE BY ONE
  4. Commit AFTER each item
  5. After all items are complete, run workspace-specific lint and type-check
  6. Push and open a PR (target branch: `dev`)

- Skipping any step above is FORBIDDEN in `[WORKFLOW]` mode.

---

## Git Rules

- Branch naming, commit messages, and PR rules MUST follow CONVENTIONS.md.
- Never skip commit or push steps in `[WORKFLOW]` mode.
- Each commit MUST represent exactly one approved task item.
