#!/usr/bin/env bash
# Claude 가 git push / gh pr create 를 실행하기 직전에 Wiki 갱신 누락을 검사하는 PreToolUse 훅
#
# - 입력: Claude Code 가 stdin 으로 넘기는 JSON (tool_input.command, cwd)
# - 검사: scripts/check-wiki-sync.mjs (기본 브랜치...HEAD 범위)
# - 차단: 누락이 있으면 exit 2 + stderr 메시지 (Claude 에게 이유가 전달됨)
# - jq / node 가 없거나 검사 스크립트가 오류를 내면 경고만 하고 통과해요. (도구 문제로 작업이 막히지 않게)
#
# 함께 수정해야 하는 곳: 검사 시점(대상 명령)을 바꾸면 AGENTS.md 9장과 docs/wiki/AI-Workflow.md 도 함께 수정해요.

set -u

command -v jq >/dev/null 2>&1 || exit 0

input="$(cat)"
cmd="$(printf '%s' "$input" | jq -r '.tool_input.command // empty')"
cwd="$(printf '%s' "$input" | jq -r '.cwd // empty')"

[ -n "$cmd" ] || exit 0

# git push / gh pr create 가 포함된 명령만 검사 (체이닝 포함)
push_re='(^|[;&|[:space:](])git([[:space:]]+-C[[:space:]]+[^[:space:]]+)?[[:space:]]+push([[:space:]]|$)'
pr_re='(^|[;&|[:space:](])gh[[:space:]]+pr[[:space:]]+create([[:space:]]|$)'
printf '%s' "$cmd" | grep -Eq "$push_re|$pr_re" || exit 0

project="${CLAUDE_PROJECT_DIR:-}"
target="${cwd:-$PWD}"
[ -d "$target" ] || exit 0
top="$(git -C "$target" rev-parse --show-toplevel 2>/dev/null)" || exit 0

# 이 프로젝트 레포에서 실행하는 명령만 검사
if [ -n "$project" ] && [ "$(cd "$top" && pwd -P)" != "$(cd "$project" && pwd -P)" ]; then
  exit 0
fi

default="$(git -C "$top" symbolic-ref --short -q refs/remotes/origin/HEAD 2>/dev/null)"
default="${default#origin/}"
default="${default:-main}"

# 기본 브랜치 위에서는 비교할 범위가 없음
[ "$(git -C "$top" branch --show-current 2>/dev/null)" = "$default" ] && exit 0

if ! command -v node >/dev/null 2>&1; then
  echo "[wiki-sync] node 를 찾지 못해 Wiki 갱신 검사를 건너뛰어요." >&2
  exit 0
fi

out="$(cd "$top" && node scripts/check-wiki-sync.mjs --base "origin/$default" 2>&1)"
code=$?

case "$code" in
  0) exit 0 ;;
  1)
    printf '%s\n' "$out" >&2
    exit 2
    ;;
  *)
    printf '[wiki-sync] 검사 스크립트 오류(exit %s)로 건너뛰어요.\n%s\n' "$code" "$out" >&2
    exit 0
    ;;
esac
