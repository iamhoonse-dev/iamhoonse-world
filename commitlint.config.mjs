// 커밋 메시지 규약 검사 설정 (.husky/commit-msg 훅에서 실행돼요)
// 규약 원본은 .claude/skills/commit-message/SKILL.md 예요.
//
// 함께 수정해야 하는 곳: type 이나 scope 규칙을 바꾸면
// .claude/skills/commit-message/SKILL.md 의 type / scope 표를 함께 수정해요.
import { readdirSync } from "node:fs";

/** apps/*, packages/* 의 디렉토리 이름을 scope 후보로 모아요. */
const listDirs = (parent) => {
  try {
    return readdirSync(new URL(`./${parent}/`, import.meta.url), {
      withFileTypes: true,
    })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return [];
  }
};

const scopes = [...listDirs("apps"), ...listDirs("packages")];

/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "refactor",
        "perf",
        "test",
        "docs",
        "style",
        "build",
        "ci",
        "chore",
      ],
    ],
    // scope 는 앱/패키지 디렉토리 이름만 허용해요. (생략 가능)
    "scope-enum": [2, "always", scopes],
    // 첫째 줄은 72자 이내
    "header-max-length": [2, "always", 72],
    // 한국어 본문이나 URL 이 기본 제한(100자)에 걸리지 않게 꺼요.
    "body-max-line-length": [0],
  },
};
