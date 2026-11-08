#!/usr/bin/env node
// Wiki 갱신 누락 검사
//
// 브랜치의 변경 파일 중 "Wiki 를 함께 고쳐야 하는 파일"이 있는데
// docs/wiki/ 의 해당 페이지가 바뀌지 않았으면 실패(exit 1)해요.
//
// 사용: node scripts/check-wiki-sync.mjs [--base <ref>] [--head <ref>]
//   - base 기본값: origin/main, head 기본값: HEAD
//   - 비교 범위: base...head (merge-base 기준, 브랜치에서 바뀐 것만)
//
// 예외: 범위 안 커밋 메시지에 `Wiki-Skip: <이유>` footer 가 있으면 통과해요.
//
// 사용하는 곳: .claude/hooks/check-wiki-sync.sh (Claude 의 git push / gh pr create 직전),
//             .github/workflows/wiki-sync-check.yml (PR 체크)
//
// 함께 수정해야 하는 곳: RULES 를 바꾸면 AGENTS.md 9장의 "바꾸는 것 → 수정할 페이지" 표도 함께 수정해요.

import { execFileSync } from "node:child_process";
import path from "node:path";

/**
 * 파일 glob → 후보 Wiki 페이지.
 * 한 파일이 여러 규칙에 걸리면 후보를 합치고, 후보 중 하나만 바뀌어도 통과해요.
 */
const RULES = [
  {
    patterns: ["packages/**", "turbo.json", "pnpm-workspace.yaml"],
    pages: ["Architecture.md"],
  },
  {
    patterns: [
      "package.json",
      ".nvmrc",
      ".prettierrc*",
      ".prettierignore",
      "commitlint.config.mjs",
      ".husky/**",
      "packages/eslint-config/**",
      "packages/typescript-config/**",
    ],
    pages: ["Toolchain.md"],
  },
  {
    patterns: [
      ".claude/settings.json",
      ".claude/skills/**",
      ".claude/hooks/**",
      "skills-lock.json",
      "scripts/check-wiki-sync.mjs",
    ],
    pages: ["AI-Workflow.md"],
  },
  {
    patterns: [".mcp.json"],
    pages: ["AI-Workflow.md", "Browser-Verification.md"],
  },
  {
    patterns: [".github/**"],
    pages: ["GitHub-Automation.md"],
  },
];

const WIKI_DIR = "docs/wiki/";
const SKIP_TRAILER = /^Wiki-Skip:\s*(.+)$/im;

const parseArgs = (argv) => {
  const args = { base: "origin/main", head: "HEAD" };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--base") args.base = argv[++i];
    else if (argv[i] === "--head") args.head = argv[++i];
  }
  return args;
};

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

const main = () => {
  if (typeof path.matchesGlob !== "function") {
    console.error(
      `[wiki-sync] Node ${process.version} 에는 path.matchesGlob 이 없어요. Node 22.5 이상에서 실행해 주세요.`,
    );
    process.exit(3);
  }

  const { base, head } = parseArgs(process.argv.slice(2));

  const changed = git("diff", "--name-only", `${base}...${head}`)
    .split("\n")
    .filter(Boolean);

  const changedPages = new Set(
    changed
      .filter((file) => file.startsWith(WIKI_DIR))
      .map((file) => file.slice(WIKI_DIR.length)),
  );

  // 페이지 조합(후보 목록) → 원인 파일
  const missing = new Map();
  for (const file of changed) {
    if (file.startsWith(WIKI_DIR)) continue;
    const candidates = new Set(
      RULES.filter((rule) =>
        rule.patterns.some((pattern) => path.matchesGlob(file, pattern)),
      ).flatMap((rule) => rule.pages),
    );
    if (candidates.size === 0) continue;
    if ([...candidates].some((page) => changedPages.has(page))) continue;

    const key = [...candidates].sort().join(" 또는 ");
    if (!missing.has(key)) missing.set(key, []);
    missing.get(key).push(file);
  }

  if (missing.size === 0) {
    console.log("[wiki-sync] Wiki 갱신 누락이 없어요.");
    return;
  }

  const messages = git("log", "--format=%B%x00", `${base}..${head}`);
  const skip = messages
    .split("\0")
    .map((message) => message.match(SKIP_TRAILER))
    .find(Boolean);
  if (skip) {
    console.log(
      `[wiki-sync] Wiki-Skip footer 가 있어 검사를 건너뛰어요: ${skip[1].trim()}`,
    );
    return;
  }

  const lines = ["[wiki-sync] Wiki 를 함께 수정해야 하는 변경이 있어요."];
  for (const [pages, files] of missing) {
    lines.push(
      "",
      `- ${WIKI_DIR}${pages.replaceAll(" 또는 ", ` 또는 ${WIKI_DIR}`)}`,
    );
    for (const file of files) lines.push(`    ← ${file}`);
  }
  lines.push(
    "",
    "해당 페이지에 변경 내용을 반영해 커밋한 뒤 다시 실행해 주세요. (AGENTS.md 9장)",
    "Wiki 에 반영할 내용이 정말 없다면 커밋 메시지 footer 에 `Wiki-Skip: <이유>` 를 남겨요.",
  );
  console.error(lines.join("\n"));
  process.exit(1);
};

main();
