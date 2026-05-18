#!/usr/bin/env python3
"""PR 리뷰 본문을 결정적으로 렌더링하고 GitHub 리뷰 API 페이로드를 생성한다.

사용법: python3 render_pr_review.py <result.json 경로>

오케스트레이터(LLM)는 발견 사항을 result.json 으로만 내고, 리뷰 본문 마크다운은
이 스크립트가 고정 템플릿으로 만든다 — 그래야 형식이 매 실행 동일해진다.

- result.json 의 should_submit 이 false 면 'SKIP: ...' 출력 후 종료 (페이로드 미생성).
- 아니면 /tmp/review-<pr>-payload.json 에 {body, event, comments} 페이로드를 쓰고,
  stdout 마지막에 'PAYLOAD=<경로>' / 'EVENT=<APPROVE|COMMENT>' 를 출력한다.

result.json 스키마는 .review-learnings/orchestrator-runbook.md Step 5 참조.
"""

import json
import sys

SEVERITY = {
    "critical": ("🚨", "Critical"),
    "major": ("⚠️", "Major"),
    "minor": ("📝", "Minor"),
}


def one_line(text):
    """여러 줄 문자열을 공백으로 합쳐 한 줄로."""
    return " ".join((text or "").split())


def render_body(result):
    """result dict → 리뷰 본문 마크다운 (REVIEW_META 포함)."""
    pr = result["pr"]
    review_sha = result.get("review_sha", "")
    review_mode = result.get("review_mode", "full")
    findings = result.get("findings", [])
    previous = result.get("previous_issues", [])

    # 정의되지 않은 severity 는 minor 로 보정
    for fnd in findings:
        if fnd.get("severity") not in SEVERITY:
            fnd["severity"] = "minor"
    crit = [f for f in findings if f["severity"] == "critical"]
    major = [f for f in findings if f["severity"] == "major"]
    minor = [f for f in findings if f["severity"] == "minor"]
    blocking = crit + major

    lines = ["## 🤖 PR Review", ""]
    if review_mode == "incremental":
        lines += ["> 📌 증분 리뷰: 새 커밋만 리뷰", ""]

    summary = one_line(result.get("summary", ""))
    if not summary:
        summary = (
            "✅ 전반적으로 양호합니다."
            if not blocking
            else "⚠️ 수정이 필요한 항목이 있습니다."
        )
    lines += [f"> {summary}", ""]
    lines += [
        f"🚨 **{len(crit)}** Critical · ⚠️ **{len(major)}** Major · 📝 **{len(minor)}** Minor",
        "",
    ]

    if previous:
        lines += [
            "### 이전 리뷰 이슈 추적",
            "",
            "| ID | 상태 | 심각도 | 파일 | 이슈 |",
            "| -- | ---- | ------ | ---- | ---- |",
        ]
        for p in previous:
            status = "✅ 해결" if p.get("resolved") else "❌ 미해결"
            lines.append(
                f"| {p.get('id', '')} | {status} | {p.get('severity', '')} "
                f"| {p.get('file', '')} | {one_line(p.get('title', ''))} |"
            )
        lines.append("")

    if blocking:
        lines += ["### 수정 필요", ""]
        for f in blocking:
            lines.append(
                f"- **{f.get('file', '')}:{f.get('line', '')}** — "
                f"{one_line(f.get('title', ''))}: {one_line(f.get('detail', ''))}"
            )
        lines.append("")

    if minor:
        lines += ["### 참고", ""]
        for f in minor[:2]:  # Minor 는 최대 2개
            lines.append(
                f"- **{f.get('file', '')}:{f.get('line', '')}** — "
                f"{one_line(f.get('title', ''))}"
            )
        lines.append("")

    lines += ["<details><summary>📋 검증 과정</summary>", ""]
    risks = result.get("checked_risks", [])
    if risks:
        lines += ["**확인한 리스크**:", ""]
        lines += [f"- {one_line(r)}" for r in risks]
        lines.append("")
    counts = result.get("agent_counts", {})
    lines += [
        "| Agent | Issues |",
        "| ----- | ------ |",
        f"| 🔍 Bug & Logic | {counts.get('bug_logic', 0)} |",
        f"| 📏 Convention | {counts.get('convention', 0)} |",
        "",
    ]
    skeptic = result.get("skeptic", {})
    lines += [
        f"Skeptic 검증: {skeptic.get('verified', 0)}건 중 "
        f"{skeptic.get('passed', 0)}건 통과",
        "",
        "</details>",
        "",
    ]

    # REVIEW_META — 항상 유효한 JSON (증분 리뷰·attribution 이 파싱)
    open_ids = [f.get("id", "") for f in blocking]
    open_ids += [p.get("id", "") for p in previous if not p.get("resolved")]
    open_ids = [i for i in dict.fromkeys(open_ids) if i]  # dedup + 빈값 제거
    meta = {
        "version": 3,
        "pr": pr,
        "review_sha": review_sha,
        "findings": [
            {
                "id": f.get("id", ""),
                "severity": f["severity"],
                "file": f.get("file", ""),
                "line": f.get("line", 0),
                "title": f.get("title", ""),
            }
            for f in findings
        ],
        "open_issues": open_ids,
    }
    lines += [
        "<!-- REVIEW_META",
        json.dumps(meta, ensure_ascii=False, indent=2),
        "-->",
        "",
        "---",
        "<sub>🤖 PR Review | 💡 `/claude-review`로 재실행</sub>",
    ]
    return "\n".join(lines)


def render_comments(findings):
    """inline=true 인 findings → GitHub 리뷰 comments[] 배열."""
    comments = []
    for f in findings:
        if not f.get("inline"):
            continue
        emoji, label = SEVERITY[f["severity"]]
        block = [
            f"{emoji} **[{label}] {one_line(f.get('title', ''))}**",
            "",
            (f.get("detail") or "").strip(),
        ]
        if f.get("skeptic_evidence"):
            block += ["", f"**Skeptic 검증**: {one_line(f['skeptic_evidence'])}"]
        if f.get("suggestion"):
            block += [
                "",
                "**수정 제안:**",
                "```suggestion",
                f["suggestion"].rstrip("\n"),
                "```",
            ]
        comments.append(
            {
                "path": f.get("file", ""),
                "line": int(f.get("line", 1) or 1),
                "side": "RIGHT",
                "body": "\n".join(block),
            }
        )
    return comments


def main():
    if len(sys.argv) < 2:
        print("usage: render_pr_review.py <result.json>", file=sys.stderr)
        sys.exit(2)

    with open(sys.argv[1], encoding="utf-8") as f:
        result = json.load(f)

    if not result.get("should_submit", False):
        print(f"SKIP: {result.get('skip_reason', '(이유 미기재)')}")
        return

    findings = result.get("findings", [])
    for fnd in findings:
        if fnd.get("severity") not in SEVERITY:
            fnd["severity"] = "minor"
    has_blocking = any(f["severity"] in ("critical", "major") for f in findings)
    event = "COMMENT" if has_blocking else "APPROVE"

    payload = {"body": render_body(result), "event": event}
    comments = render_comments(findings)
    if comments:
        payload["comments"] = comments

    out_path = f"/tmp/review-{result['pr']}-payload.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"PAYLOAD={out_path}")
    print(f"EVENT={event}")


if __name__ == "__main__":
    main()
