# Conventions index

이 문서는 작업별 규칙 문서의 색인입니다. 세부 규칙은 반드시 해당 규칙을
소유한 문서에만 둡니다.

| 상황 | 읽을 문서 | 소유자 |
| --- | --- | --- |
| AI-assisted repository work | [AGENTS.md](AGENTS.md) → [docs/ai-rules.md](docs/ai-rules.md) | Repository agent policy |
| `web/`, `admin/`, `maeil-mail/` React UI code 변경 | [docs/frontend-coding-standards.md](docs/frontend-coding-standards.md) | React frontend conventions |
| `app/` React Native UI code 변경 | app/AGENTS.md와 작업 대상의 인접 구현 | 별도 coding standards 없음 |
| Commit message 작성·검토 | [docs/git-commit-convention.md](docs/git-commit-convention.md) | Git convention |
| Pull request review | `ai-review-workflow` skill; cross-boundary review면 [docs/architecture.md](docs/architecture.md) 추가 | Review workflow |
| Workspace별 작업 | 해당 workspace의 AGENTS.md가 있으면 함께 확인 | Workspace owner |

## 사용 방법

AI agent는 먼저 [AGENTS.md](AGENTS.md)를 읽고, 작업 종류에 맞는 문서를 이 표에서
찾습니다. 이 문서는 색인만 담당하며, AI 행동 정책과 code convention의 세부 규칙은
각 소유 문서에서 관리합니다.
