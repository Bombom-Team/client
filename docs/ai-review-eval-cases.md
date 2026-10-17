# AI 리뷰 고정 평가 사례

- 작성일: 2026-10-18
- 계획: [ai-conventions-review-plan.md](ai-conventions-review-plan.md) 8절
- 변경 전 기준(before): 문서 기준 커밋 `06d9bc65`
- 이 문서는 평가 정답지다. 평가 대상 리뷰어에게 보여주지 않는다(아래 실행 절차 2).

정답은 이후 fix 커밋, 수용된 리뷰 코멘트, 코드 동작으로 정했다. 모델 응답에 따라
정답을 바꾸지 않는다. 신뢰도가 "중간"인 사례는 fix 근거 없이 규칙과 판단으로 정한 것이다.

## 사례 목록

| id | 범주 | 대상 diff (base..head) | workspace | 정답 핵심 | 신뢰도 |
| --- | --- | --- | --- | --- | --- |
| EVAL-01a | query·캐시 처리 누락 | `7d77fef3..3e79005a` (#340 1차) | web | 탐지: loader `ensureQueryData` 재방문 시 재검증 없음, `useQuery` 구독 제거로 읽음 처리 invalidation 미반영 | 높음 |
| EVAL-01b | query 조건 변경 | `c8c7037a..f3d7fc3c` (#291) | web | 탐지: pagination에 null `selectedDate` 전달, 과거 날짜 탭에 작성 박스 노출 | 높음 |
| EVAL-02a | mutation 후 갱신 누락 | `ff8dc9a5..443b7843` (#252) | web | 탐지: 매일메일 구독 취소 후 `mySubscriptions` 무효화 누락 | 높음 |
| EVAL-02b | mutation 후 갱신 누락 | `7e0c100b..e8394e4f` (#341 1차) | web | 탐지: `inquiryRooms()` key가 목록 cache와 불일치 | 높음(코드)·중간(영향) |
| EVAL-03a | WebView 한쪽 계약 | synthetic on `06d9bc65` | shared·web | 탐지: app switch에 새 message type 없음 | 높음(설계) |
| EVAL-03b | WebView 대조군 | `193f596f..485fbc0c` (#346 1차) | shared·web·app | 금지: 양쪽이 바뀐 계약을 불일치로 지적 | 높음 |
| EVAL-04a | admin 외부 adapter | `87b003bf..70ccf24f` (#289) | admin | 탐지: Suspense 종속 + 외부 API 타임아웃 없음. 금지: 공용 fetcher 규칙 | 높음 |
| EVAL-04b | admin 외부 adapter | synthetic on `06d9bc65` | admin | 금지: fetcher·useQuery 규칙 지적 | 높음 |
| EVAL-05a | route export·생성물 | `fccca14a^..fccca14a` (#345) | web | 금지: `routeTree.gen.ts`, `export const Route`, route `function` 지적 | 높음 |
| EVAL-05b | 생성물만 변경 | `88f6674c^..88f6674c` | web | finding 0건, 리뷰 대상 없음 보고 | 중간 |
| EVAL-06a | 동명 hook | `4b105e19..8a80c717` | web | 금지: app `useAuth`를 영향 범위에 포함 | 높음(범위) |
| EVAL-06b | 동명 hook | synthetic on `06d9bc65` | web | 금지: shared 동명 `useScrollLock`으로 영향 범위 확대 | 높음 |
| EVAL-07a | 단순 UI | `60f70339..a0d9fade` (#294 1차) | web | 탐지: div `onClick` 키보드 접근 불가, `challengeId` 없을 때 `/challenge/undefined` 이동 | 높음 |
| EVAL-07b | 단순 UI | `7d77fef3..94eee416` (#338) | web | Major 0건. 금지: 로딩·오류·접근성 요구 | 중간 |
| EVAL-08a | 알려진 오탐 | `78bfde0f..4f583b95` (#244) | web | finding 0건. 금지: `limit: 5` 하드코딩 지적 | 높음 |
| EVAL-08b | 기존 결함 | `ec52e823..67557b45` (#341 중간) | web | 금지: 기존 key 불일치를 이번 변경 finding으로 보고 | 높음 |

완료 조건(계획 8절):

- 필수 탐지: 01a, 01b, 02a, 03a, 04a, 07a의 "탐지" 항목.
- 허용 예외 오탐 0건: 04a의 금지 항목, 04b, 05a, 05b, 06a, 06b, 08a.

## 사례별 정답

### EVAL-01a — 아티클 상세 loader 전환

- 의도: "아티클 상세 접근 오류의 404 화면 연결"
- 탐지:
  1. `web/src/routes/_bombom/articles.$articleId.tsx:32`의 `ensureQueryData`는 cache가 있으면
     서버를 다시 부르지 않는다. 삭제·권한 없는 기사를 재방문하면 404 대신 cache가 보인다.
     `articles.previous.$articleId.tsx`도 같다.
  2. 같은 파일 :57에서 `Route.useLoaderData()`만 쓰고 `useQuery(queries.articleById)` 구독을
     없앴다. `useArticleAsReadMutation`의 `articleById` invalidate가 화면에 반영되지 않아
     :74·:89·:155의 `isRead`가 stale로 남는다.
- 허용: `refetchOnMount`, 초기 중복 요청 언급.
- 오답: loader에서 직접 fetch하면 안 된다는 지적, route `function` 선언 지적.
- 근거: CodeRabbit [r4190530532](https://github.com/Bombom-Team/client/pull/340#discussion_r4190530532),
  [r4190530544](https://github.com/Bombom-Team/client/pull/340#discussion_r4190530544), 작성자 수용.
  수정 내용은 `git diff 3e79005a 5e6e776d -- 'web/src/routes/_bombom/articles.*'`
  (`fetchQuery` + `useQuery`·`initialData` 복구).

### EVAL-01b — 코멘트 날짜 자동 선택

- 의도: "코멘트 페이지 첫 접속 시 마지막 날 자동 선택"
- 탐지 (`web/src/routes/_bombom/_main/challenge/$challengeId/comments.tsx`):
  1. :52 `useState<string | null>(null)` 상태로 :76이 `useCommentsPagination`에 `selectedDate`를
     넘긴다. 필터는 `activeDate`를 보여주지만 query key와 요청의 `start/end`는 null이다.
     fix 9822bc50.
  2. 작성 박스 조건이 `isChallengeDay(today)`로 바뀌어 과거 날짜 탭에서도 오늘 작성 박스가
     보인다. fix 5196104c, [r3563002994](https://github.com/Bombom-Team/client/pull/291#discussion_r3563002994).
- 허용: 1번이 type-check로도 잡힐 수 있다는 언급.
- 오답: `calc(100vh - …)` 같은 취향 지적을 Major로 분류.

### EVAL-02a — 매일메일 구독 취소 후 목록 미갱신

- 탐지: `web/src/pages/my-page/hooks/useUnsubscribeMaeilMailSubscriptionMutations.ts:11-16`이
  `nativeMaeilMailSubscription`만 무효화한다. 카드 목록은 `my.tsx:58`의 `mySubscriptions`라
  취소한 카드가 남는다. 이웃 `useUnsubscribeNewsletterMutation.ts:15`는 무효화한다.
- 재현 조건: `my.tsx`의 5초 polling(최대 60회) 이후에 남는다. 조건을 짚으면 가점,
  영구라고 단정해도 정답.
- 오답: `openapi.d.ts` 리뷰.
- 근거: [r3359961554](https://github.com/Bombom-Team/client/pull/252#discussion_r3359961554), fix 293a4046.

### EVAL-02b — 문의방 안읽음 표시

- 탐지: `web/src/routes/_bombom/_main/support.inquiry.$roomId.tsx:66-67`의
  `queries.inquiryRooms().queryKey`는 `['inquiries','room-list',undefined]`이고 실제 목록 key는
  `[…,'room-list',{page}]`, `[…,'room-list','infinite']`다. `partialMatchKey`는 `undefined`를
  와일드카드로 보지 않아 목록을 갱신하지 못한다. fix 8fa563b6.
- 기대(2차): `inquiryRoom` key가 messages key의 prefix라 :69-70이 메시지 무한쿼리 전체를
  다시 불러온다. fix ec52e823.
- 허용: `hasUnread` prop이 DOM으로 전달된다는 지적(fix 3b91d356).
- 심각도: staleTime 0으로 재진입 시 refetch되므로 Minor~Major 모두 정답.

### EVAL-03a — WebView 한쪽 계약만 변경 (synthetic)

`06d9bc65` 위에 적용한다. 의도 문구: "알림 설정 이동 메시지 이름 정리". app은 수정하지 않는다.

```diff
# shared/src/core/webview.ts (SHOW_NOTIFICATION_PERMISSION_SETTING 멤버 뒤)
+  | { type: 'OPEN_NOTIFICATION_SETTINGS' }
# web/src/pages/my-page/components/NotificationSettingsSection/NotificationSettingsSection.tsx:33
-    sendMessageToRN({ type: 'SHOW_NOTIFICATION_PERMISSION_SETTING' });
+    sendMessageToRN({ type: 'OPEN_NOTIFICATION_SETTINGS' });
```

- 탐지: `app/components/main/MainScreen.tsx:120` switch에 새 type case가 없어 `default`로 빠지고
  앱의 "설정 열기"가 동작하지 않는다([architecture.md](architecture.md)의 WebView 계약).
- 가점: 이미 설치된 구버전 앱과의 호환 문제.
- 오답: 일반 브라우저 guard 지적.
- 실행 전 확인: fixture 적용 후 `pnpm --filter app type-check`가 통과하는지 확인한다.

### EVAL-03b — WebView 양쪽 변경 (대조군)

- 금지: `LOGIN_FAILED.payload.reason` 추가를 한쪽 변경으로 지적. shared 타입, web 송신
  (`useWebViewAuth.ts`), app 수신(`MainScreen.tsx`, `LoginScreen.tsx:118`)이 모두 바뀌었고
  `reason`은 optional이다.
- 가점: `LoginFailureModal.tsx`가 `access_denied`(사용자 취소)에도 실패 모달을 연다.
  fix 60e0cefa, [r4237012965](https://github.com/Bombom-Team/client/pull/346#discussion_r4237012965).

### EVAL-04a — admin GitHub API adapter

- 탐지: `admin/src/routes/_admin/reviewers/index.tsx:32`의
  `useSuspenseQuery(reviewersQueries.prStats())`가 핵심 목록과 같은 Suspense 경계에 있고,
  `reviewers.api.ts`의 외부 fetch에 타임아웃이 없어 응답이 멈추면 대시보드 전체가 skeleton에
  머문다. [r3525400092](https://github.com/Bombom-Team/client/pull/289#discussion_r3525400092), fix 914270c0.
- 금지: `api.github.com` 호출에 공용 fetcher·OpenAPI 타입 요구.
- 허용: 무인증 rate limit, 페이지 경계 Minor.

### EVAL-04b — admin adapter 내부만 변경 (synthetic)

`06d9bc65`의 `admin/src/apis/reviewers/reviewers.api.ts:49` `page <= 3`을 `page <= 5`로 바꾼다.
의도 문구: "PR 통계 조회 범위 확대".

- 정답: fetcher·useQuery 규칙 지적 0건.
- 허용: 무인증 GitHub API 호출 수 증가 Minor. 실패 시 `null` 반환이라 대시보드는 깨지지 않는다.

### EVAL-05a — route rename과 routeTree 생성물

- 금지: `routeTree.gen.ts` diff를 수동 편집·스타일로 지적, `export const Route` named export와
  default export 부재 지적(#220에서 의도적으로 제거), route `function` 선언 지적.
- 허용: routeTree 변경이 route 추가·rename과 일치하는지 확인한 언급.

### EVAL-05b — 생성물만 변경

- `web/src/types/openapi.d.ts`만 바뀐다. 제외 규칙 적용 후 diff가 비어 있다.
- 정답: finding 0건과 "생성물만 변경, 리뷰 대상 없음" 보고.
- 오답: 타입 내용 코멘트, 수동 편집 단정.

### EVAL-06a — web AuthContext 단독 변경

- 정답: 영향 범위는 web `useAuth()` 소비처뿐이다. `app/contexts/AuthContext.tsx`의 `useAuth`는
  별개 구현이고 필드가 다르다.
- 오답: app LoginScreen·MainScreen 영향 주장.

### EVAL-06b — importer 없는 동명 hook (synthetic)

`06d9bc65`의 `web/src/hooks/useScrollLock.ts`에 `document.body.style.touchAction = 'none'`을
추가하고 cleanup에서 원래 값으로 복원한다.

- 정답: web 안의 importer는 0개다. `shared/src/ui-web/hooks/useScrollLock.ts`는 별도 구현이다.
- 오답: shared Modal·maeil-mail·web Modal 영향 주장.
- 허용: 사용되지 않는 코드라는 정보성 언급.

### EVAL-07a — 완료 챌린지 카드 클릭 이동

- 탐지 (`web/src/pages/my-page/components/MyChallengeSection/CompletedChallengeCard.tsx`):
  1. styled.div `Container`에 `onClick`만 있어 키보드로 진입할 수 없다.
     [r3579961175](https://github.com/Bombom-Team/client/pull/294#discussion_r3579961175).
  2. `handleCardClick`이 optional `challengeId`를 검사하지 않아 `/challenge/undefined/dashboard`로
     이동할 수 있다. [r3579960273](https://github.com/Bombom-Team/client/pull/294#discussion_r3579960273), fix 665c3474.
- 허용: `CertButton disabled={isFail}`가 항상 false라는 Minor.
- 오답: 로딩·에러 상태 요구(데이터 fetch 없음).

### EVAL-07b — 태블릿 카드 문구 숨김

- 정답: Major 0건. button `aria-label`에 같은 설명이 있어 tablet에서 `Description`을 숨겨도
  정보가 사라지지 않는다.
- 오답: 접근성 위반 주장, 로딩·오류·Suspense 요구.
- 허용: `line-height: 1` 제거의 시각 확인 권고.

### EVAL-08a — 알려진 AI 오탐

- 정답: finding 0건.
- 오답: `memberStreak({ limit: 5 })` 하드코딩 때문에 `ChallengeStreakCard`가 갱신되지 않는다는
  지적. 모든 호출부가 `limit: 5`다. 반박 이력:
  [r3309498693](https://github.com/Bombom-Team/client/pull/244#discussion_r3309498693),
  [r3310276494](https://github.com/Bombom-Team/client/pull/244#discussion_r3310276494).

### EVAL-08b — 정상 변경과 같은 파일의 기존 결함

- 금지: :69의 `queries.inquiryRooms().queryKey` 불일치(EVAL-02b)를 이번 diff의 finding으로 보고.
  "기존 이슈"로 따로 언급하는 것은 허용.
- 가점: 조회 실패 원인과 무관하게 모두 "문의를 찾을 수 없습니다"로 표시된다는 Minor.
  [r4190751461](https://github.com/Bombom-Team/client/pull/341#discussion_r4190751461), fix 730e061d.

## 실행 절차

### 1. 커밋 고정

squash 전 branch 커밋이 많으므로 PR head를 로컬 ref로 고정한다.

```bash
for n in 244 252 289 291 294 340 341 346; do
  git fetch origin "pull/$n/head:refs/eval/pr$n"
done
```

### 2. 정답 유출 차단

리뷰어가 `git log`의 fix 커밋 메시지나 PR 코멘트를 보지 않도록, 사례마다 history가 없는
평가 repo를 만든다. 문서는 조건별 revision에서 가져오고 이 정답지는 지운다.

```bash
mk_case() {
  id=$1 base=$2 head=$3 docs=${DOCS_REV:-06d9bc65}; d="$EVAL/$id"
  rm -rf "$d" && mkdir -p "$d" && git -C "$REPO" archive "$base" | tar -x -C "$d"
  git -C "$REPO" archive "$docs" -- AGENTS.md CLAUDE.md CONVENTIONS.md docs .review-learnings \
    .agents .claude .coderabbit.yaml web/AGENTS.md admin/AGENTS.md app/AGENTS.md \
    shared/AGENTS.md maeil-mail/AGENTS.md | tar -x -C "$d"
  rm -f "$d/docs/ai-review-eval-cases.md"
  (cd "$d" && git init -q && git add -A && git commit -qm base)
  git -C "$REPO" diff --binary "$base" "$head" | (cd "$d" && git apply --index) \
    && (cd "$d" && git commit -qm head)
}
```

- synthetic 사례(03a, 04b, 06b)는 `base=head=06d9bc65`로 만든 뒤 fixture를 적용해 커밋한다.
- before는 `DOCS_REV=06d9bc65`, after는 정비 후 커밋이다. 코드 tree는 같고 문서만 다르다.
- 과거 코드 위에 최신 문서를 덮으므로 문서의 경로가 당시 코드에 없을 수 있다. 두 조건에
  똑같이 적용되므로 비교에는 영향이 없다.
- user-level `~/.claude` 설정·hook·CLAUDE.md는 두 조건에서 같게 유지한다.

### 3. 리뷰 실행

`ai-review-workflow` skill의 채팅 검토 모드로 `HEAD~1..HEAD`를 리뷰한다. GitHub 게시,
`gh` 사용, PR 코멘트 조회는 금지한다. prompt에는 의도 문구(PR 제목 또는 커밋 메시지)를
넣고, finding마다 severity·`file:line`·발생 조건·영향·근거와 읽은 문서, 확인하지 못한 영역을
요구한다.

```bash
claude -p "$(cat prompt.txt)" --model <고정 model id> --output-format stream-json --verbose \
  > "runs/$id-$cond-$i.jsonl"
```

쓰기 도구와 `gh`를 막는 flag 문법은 실행 전에 확인한다.

### 4. 지표

사례 × 조건마다 최소 2회(권장 3회) 실행하고 모델 id·설정을 고정한다.

| 지표 | 기준 |
| --- | --- |
| 기대 탐지 누락 | 필수 항목별 hit/miss. 파일 ±5줄과 메커니즘을 모두 짚어야 hit |
| 오탐 | "금지·오답" 목록에 해당하는 finding 수. 전체와 Major 이상을 따로 센다 |
| 미분류 finding | 정답지에 없는 finding. 근거가 없으면 오탐 후보 |
| 읽은 문서 | stream-json의 tool_use에서 `docs/`, `.review-learnings/`, `AGENTS.md` 경로 추출 |
| 소요 시간·사용량 | result 이벤트의 `duration_ms`, usage, cost |
| 흔들림 | 같은 조건 반복 간 hit 일치율 |

실제 PR finding의 사후 처리도 같은 분류를 쓴다(이전 `attribution-log.md`의 정의).

| Outcome | 의미 |
| --- | --- |
| accepted | 지적대로 수정 |
| modified | 지적은 유효하나 다른 방식으로 수정 |
| dismissed | 반박·오탐 |
| ignored | 응답·수정 없음. 수용으로 간주하지 않는다 |

결과는 로컬에만 기록하고 PR에 게시하지 않는다. 작은 평가 세트의 통과를 전체 서비스
안전 보장으로 해석하지 않는다.

## 예비 사례

- #341 5f3cd69f: 캐시된 `messagePages` 때문에 unread 갱신이 이르게 실행됨(사람 리뷰 r4227064940).
- #333 0fdfe6e5: `/support`가 `_bombom` 아래로 이동해 비로그인 딥링크가 홈으로 redirect,
  `ON_HOLD`에서도 입력창 노출.
- #286 `afc9c31d..46818367`: Supabase eager 초기화로 admin 흰 화면(fix #287 1edddb6a). diff가 커서 제외.
