# AI behavior rules

이 문서는 AI agent가 이 저장소에서 안전하고 효율적으로 작업하는 방법을
정의합니다. [AGENTS.md](../AGENTS.md)의 진입 규칙을 보완합니다.

## 작업 범위 및 확인

- 사용자 요청이 작업의 목표와 범위를 정합니다.
- 요청한 결과를 완료하는 데 직접 필요한 supporting file은 함께 수정할 수 있습니다.
- 관련 없는 refactor, rename, reformatting, dependency 변경은 한 작업에 섞지
  않습니다.
- code와 configuration으로 확인할 수 있는 구현 세부 사항은 먼저 확인하고 진행합니다.
- 제품 동작, API·data contract, authorization·security, 또는 작업 범위를 실질적으로
  바꾸는 판단이 필요할 때만 방향을 확인합니다.

## Generated files

- `.gen.ts` 파일은 직접 수정하지 않습니다.
- Generated file은 generator command로만 갱신합니다.
- Generated file을 수동으로 수정하는 것은 금지합니다.

## 검증 및 완료

변경한 workspace에 해당 command가 있을 때는 그 workspace의 command를 사용합니다.

| 변경 종류 | 필요한 검증 |
| --- | --- |
| Documentation만 변경 | `git diff --check`를 실행하고, 수정한 link·path·command·저장소 사실을 확인합니다. |
| 일반 application code 변경 | 변경한 workspace의 `lint`와 `type-check`를 실행합니다. |
| 기존 test가 있는 기능 변경 | 변경한 workspace의 `lint`와 `type-check`, 해당 기능의 focused test를 실행합니다. |
| UI 또는 사용자 흐름 변경 | 변경한 workspace의 `lint`와 `type-check`를 실행하고, 대상 흐름의 E2E test가 있으면 실행합니다. E2E test가 없으면 해당 흐름을 직접 확인합니다. |
| API, TanStack Query, authorization, routing 변경 | 변경한 workspace의 `lint`와 `type-check`, 관련 focused test를 실행하고 request·response type과 소비 code를 확인합니다. |
| Configuration, script, CI 변경 | configuration syntax를 확인하고, 변경한 command 또는 build를 안전한 범위에서 실행합니다. |
| Generated output 변경 | generator command를 실행하고 생성된 diff를 검토합니다. |
| 여러 workspace 변경 | 변경한 각 workspace에 적용되는 위 검증을 실행합니다. |

- Auto-fix는 사용자가 요청했거나 lint error를 고치기 위해 필요한 경우에만 실행합니다.
  Auto-fix가 변경한 파일은 모두 검토합니다.
- commit은 사용자가 요청하거나 작업에 명시된 경우에만 만듭니다.
- 필요한 검증을 실행할 수 없으면 실행하지 못한 이유와 대신 확인한 근거를 알립니다.
- 변경과 무관한 기존 failure는 별도로 알리고, 이를 고치기 위해 관련 없는 변경을
  추가하지 않습니다.

## Language

팀이 읽는 설명과 report는 한국어로 작성합니다. Command, path, code, 기존
technical identifier는 자연스러운 영어 표기를 유지합니다.
