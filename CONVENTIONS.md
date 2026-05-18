# CONVENTIONS.md

This document defines the entry point for all conventions in this repository.

All contributors (human or AI) MUST follow the appropriate rules
defined in the documents referenced below.

---

## Rule Structure Overview

This repository separates conventions by responsibility.

### 1. Frontend Coding Standards (Human)

Frontend developers MUST follow the coding standards defined here:

→ `docs/frontend-coding-standards.md`

This document defines:

- How frontend code should be written
- Component, hook, and utility conventions
- Folder structure and naming rules
- State management and data handling standards

These rules are used during:

- Code writing
- Code review
- Team discussion and onboarding

---

### 2. AI Behavior Rules (AI Agents)

AI agents (e.g. Claude, Codex, Cursor) MUST follow the rules defined here:

→ `docs/ai-rules.md`

This document defines:

- Modification scope and boundaries
- Generated file handling
- Lint / stylelint auto-fix requirements
- Task completion and failure conditions

These rules exist to prevent:

- Overreach
- Guessing
- Incomplete or unsafe changes

---

### 3. Git Commit Message Convention (Commit Time Only)

Anyone composing a commit message MUST follow the convention defined here:

→ `docs/git-commit-convention.md`

This document defines:

- Commit message format (`type: 한국어 명사형 설명`)
- Allowed `type` values and their usage
- Rules around scope, ticket prefix, body, and trailers
- Examples per type

This document is referenced **only at commit time** — it is intentionally not
imported into the default editor context, to avoid polluting day-to-day
prompts. Read it before writing or reviewing commit messages.

---

## Priority

When rules conflict, the following priority applies:

1. This `CONVENTIONS.md`
2. The referenced rule documents (`frontend-coding-standards.md`, `ai-rules.md`, `git-commit-convention.md`)
3. Existing codebase patterns
4. Tool defaults (eslint, prettier, framework conventions)

---

## Applicability

- Human contributors MUST follow **Frontend Coding Standards**.
- AI contributors MUST follow **AI Behavior Rules**.
- Any contributor modifying frontend code MUST ensure compliance
  with `frontend-coding-standards.md`.

---

## Notes

- This file intentionally contains **no detailed rules**.
- All detailed conventions MUST live in their respective documents.
- Changes to conventions MUST be made in the target document,
  not by expanding this file.
