# AGENTS.md

이 문서는 AI 에이전트(Claude Code 등)와 함께 이 레포를 개발할 때 따르는 규칙이에요.
사람이 작업할 때도 같은 흐름을 따라요.

> **구분 표시**
>
> - 🔁 **공통 플로우** — 프로젝트와 무관한 개인 개발 플로우. 아직 플러그인으로 옮기지 않은 것들이에요.
> - 📌 **프로젝트 전용** — 이 레포(iamhoonse-world)에만 해당하는 규칙이에요.
>
> 작업 절차(이슈 → 브랜치 → 커밋 → 검증 → PR → 머지 후 정리)는
> [hoonse-claude-plugins](https://github.com/iamhoonse-dev/hoonse-claude-plugins) 의 플러그인이 담당해요. ([1장](#-1-작업-흐름-플러그인))

---

## 📌 1. 작업 흐름 (플러그인)

`.claude/settings.json` 에서 두 플러그인을 켜 두었어요. 다만 이건 **켜 두는 설정**일 뿐이고, 설치 기록은 레포(폴더)마다 따로 남아요.
다른 레포에 설치했더라도 **이 레포 폴더에서 한 번 설치**해야 스킬이 등록돼요. ([플러그인 설치](#플러그인-설치))

| 플러그인          | 제공하는 것                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| `git-workflow`    | 커밋(`auto-committer`), 브랜치 생성(`branch-creator`), **`main` 직접 커밋 차단 훅**              |
| `github-workflow` | 이슈 기반 작업(`work-on-issue`), PR 전 검증(`pr-verification`), PR 생성, 리뷰 대응(`work-on-pr`) |

- 플러그인 스킬은 **`/<플러그인>:<스킬>` 형식으로만** 호출돼요. (예: `/github-workflow:work-on-issue 23`)
  - `/work-on-issue` 처럼 플러그인 이름을 빼면 `Unknown command` 오류가 나요.
- 작업은 **항상 이슈부터** 시작해요. 내부 작업은 `📋 새 할 일` 양식으로 이슈를 만들고 `/github-workflow:work-on-issue <번호>` 로 진행해요.
  - `work-from-scratch` 는 쓰지 않아요.
  - 큰 작업은 하위 이슈(sub-issue)로 나눠요.
- 이 레포의 규약은 `.claude/skills/` 에 있고, 플러그인의 기본 규약보다 우선해요.

  | 규약            | 요약                                                                                    |
  | --------------- | --------------------------------------------------------------------------------------- |
  | commit-message  | Conventional Commits + scope(앱/패키지 디렉토리 이름), 한국어 명사형 요약, `Refs #번호` |
  | branch-strategy | trunk-based, 최신 `main` 에서 `<type>/<short-description>`                              |
  | pr-convention   | PR 템플릿 항목을 빠짐없이 작성, 이슈의 작업 유형 라벨을 PR 에도 부착                    |

- **함께 수정해야 하는 곳**: 커밋/브랜치/PR 규칙을 바꿀 때는 이 표와 `.claude/skills/` 의 해당 스킬을 함께 수정해요.

### 플러그인 설치

레포 루트에서 실행하고, Claude Code 를 재시작해요.

```sh
claude plugin marketplace add iamhoonse-dev/hoonse-claude-plugins   # 마켓플레이스가 없을 때만
claude plugin install git-workflow@hoonse-claude-plugins --scope project
claude plugin install github-workflow@hoonse-claude-plugins --scope project
```

- **설치 확인**: 세션에서 `/github-workflow:` 를 입력해 자동완성에 스킬이 보이면 돼요.
  - `claude plugin list` 는 어느 레포의 설치인지 보여주지 않아요. 정확히 보려면 `~/.claude/plugins/installed_plugins.json` 의 `projectPath` 를 확인해요.
- **업데이트**: `claude plugin marketplace update hoonse-claude-plugins` 후, **이 레포 폴더에서** `claude plugin update <플러그인>@hoonse-claude-plugins` 를 실행하고 재시작해요.
- 설치하면 `.claude/settings.json` 의 키 순서가 바뀔 수 있어요. 내용이 같으면 `git checkout -- .claude/settings.json` 으로 되돌려요.
- **`Unknown command` 가 나면**
  1. `/<플러그인>:<스킬>` 형식으로 호출했는지 확인해요.
  2. 이 레포 폴더에 설치됐는지 확인하고, 아니면 위 명령으로 설치한 뒤 재시작해요.
- **함께 수정해야 하는 곳**: 설치 안내를 바꾸면 Wiki 의 `AI-Workflow.md` 도 함께 수정해요.

## 🔁 2. 기본 원칙

- 모든 문서, 이슈, PR, 커밋 메시지, 코드 주석은 **한국어**로 작성해요.
- 사용자 확인은 **주요 지점에서만** 받아요.
  - 계획 승인
  - 되돌리기 어렵거나 외부에 바로 반영되는 작업 직전
    - 예: 푸시, PR 생성, 레포 설정 변경, 라벨 생성/삭제, 원격 브랜치 삭제, 강제 push, 이슈/PR 닫기
  - 한 번 승인받은 작업이라도 다른 맥락에서는 다시 확인해요.
  - 그 밖의 단계는 결과를 보고하고 이어서 진행해요.
- 결과는 있는 그대로 보고해요. 실패한 것, 건너뛴 것, 확인하지 못한 것을 숨기지 않아요.

## 🔁 3. 검증

검증 절차는 `pr-verification` 스킬을 따라요. 이 레포에서는 다음을 추가로 지켜요.

- **화면/동작이 있는 변경은 Chrome DevTools MCP 로 브라우저에서 직접 사용해 보고** PR 을 올려요.
  - `.mcp.json` 의 `chrome-devtools` 서버를 사용해요.
  - `--autoConnect` 없이 **전용 프로필로 별도 Chrome** 을 띄워요. (macOS 에서 기존 Chrome 프로필 접근이 막히는 문제 회피)
  - 로그인, 2단계 인증은 사람이 직접 하고, 테스트 대상 탭만 다뤄요.
- 테스트용으로 만든 이슈는 결과를 댓글로 남기고 `not planned` 로 닫아요. 프로젝트 보드에 추가됐다면 빼요.

## 🔁 4. MCP 와 민감 정보

- 공용 MCP 설정은 레포의 `.mcp.json` 에 두고 커밋해요.
- 토큰 등 민감 정보는 **값을 직접 쓰지 않고 `${ENV_VAR}` 로 참조**해요.

  ```json
  "env": { "API_TOKEN": "${SOME_SERVICE_TOKEN}" }
  ```

  - 실제 값은 각자 셸 환경변수(`~/.zshrc` 등)에 설정해요.

- 개인적으로만 쓰는 MCP 는 `claude mcp add --scope local ...` 로 추가해요. (레포가 아닌 `~/.claude.json` 에 저장)
- `.env` 계열 파일은 커밋하지 않아요. (`.gitignore` 에 포함)

## 🔁 5. 변경 시 함께 수정해야 하는 곳 명시

- 한 곳을 바꾸면 다른 곳도 같이 바꿔야 하는 경우, **코드 주석과 PR 의 "리뷰어에게"에 명시**해요.

## 🔁 6. AI 스킬 관리

- 외부 스킬은 [skills CLI](https://github.com/vercel-labs/skills) 로 **프로젝트 범위에 설치**해요.
- 스킬 파일(`.claude/skills/`)과 설치 기록(`skills-lock.json`)을 **모두 커밋**해요. 레포를 받으면 별도 복원 없이 바로 적용돼요.
- 공식 스킬이 있으면 공식 스킬을 우선해요. 같은 이름의 서드파티 복사본은 쓰지 않아요.
- 스킬은 AI 가 그대로 따르는 지침이라, **설치/업데이트 후 커밋 전에 내용을 직접 읽고 확인**해요.
- 명령어 (Node 22.20 이상 필요, 통계 수집은 `DISABLE_TELEMETRY=1` 로 꺼요)

  ```sh
  export DISABLE_TELEMETRY=1
  npx skills add <source> --skill <name> -a claude-code -y  # 설치
  npx skills list                                           # 설치 목록
  npx skills check                                          # 업데이트 확인
  npx skills update -p                                      # 프로젝트 스킬 업데이트
  npx skills remove <name>                                  # 삭제
  ```

  - `experimental_install`(lock 으로 복원)은 `.claude/skills/` 가 아닌 `.agents/skills/` 에 복원하고 아직 실험 단계라 쓰지 않아요.

- 레포 규약 스킬(`commit-message`, `branch-strategy`, `pr-convention`)은 직접 작성한 것이라 skills CLI 로 관리하지 않아요.

---

## 📌 7. 이 레포의 구성

- 개인 프로젝트 `iamhoonse-world` 의 **Turborepo** 모노레포예요. 패키지 매니저는 **pnpm** 이에요.

  ```text
  apps/                        # 앱 (아직 없음)
  packages/
    typescript-config/         # @repo/typescript-config — 공용 tsconfig
    eslint-config/             # @repo/eslint-config — 공용 ESLint (flat config)
  turbo.json                   # 태스크 정의
  commitlint.config.mjs        # 커밋 메시지 검사 규칙
  .husky/commit-msg            # 커밋 메시지 검사 훅
  docs/wiki/                   # GitHub Wiki 원본 (main 머지 시 자동 동기화)
  .claude/
    settings.json              # 플러그인 활성화
    skills/                    # 레포 규약 + 설치한 스킬
  ```

- 명령어 (레포 루트에서 실행)

  | 명령               | 설명                                             |
  | ------------------ | ------------------------------------------------ |
  | `pnpm install`     | 의존성 설치                                      |
  | `pnpm dev`         | 개발 서버 실행                                   |
  | `pnpm build`       | 전체 빌드                                        |
  | `pnpm lint`        | 전체 린트                                        |
  | `pnpm check-types` | 전체 타입 체크                                   |
  | `pnpm format`      | Prettier 로 전체 포맷 (`format:check` 는 검사만) |

- 태스크 스크립트는 **각 패키지의 `package.json`** 에 두고, 루트 `package.json` 은 `turbo run` 으로 위임만 해요.
  Turborepo 설정을 바꿀 때는 `turborepo` 스킬을 따라 설치된 버전의 번들 문서(`node_modules/turbo/docs`)를 먼저 확인해요.

### 커밋 메시지 검사

- `pnpm install` 을 하면 `prepare` 스크립트가 husky 훅을 설치하고, 커밋할 때마다 commitlint 가 메시지를 검사해요.
  - 규칙은 `commitlint.config.mjs` 에 있고, 규약 원본은 `.claude/skills/commit-message` 예요.
  - scope 허용 목록은 `apps/*`, `packages/*` 의 디렉토리 이름에서 자동으로 만들어져요.
- 훅이 거부하면 `--no-verify` 로 우회하지 않고 메시지를 고쳐요.
- PR 에서도 `.github/workflows/commitlint.yml` 이 같은 설정으로 커밋 메시지와 PR 제목을 검사해요.
  체크가 실패하면 메시지를 고쳐서(`git rebase -i` / `git commit --amend`) 다시 push 해요.
  - 이 체크는 레포 룰셋 `main 보호` 의 필수 체크라, 실패하면 머지할 수 없어요. (우회 없음, 긴급 시 룰셋을 잠시 비활성화)
  - **함께 수정해야 하는 곳**: 워크플로우의 job 이름(`commitlint`)을 바꾸면 룰셋의 필수 체크 이름도 함께 바꿔요.
- IDE 등 GUI 에서 커밋할 때 `pnpm` 을 찾지 못하면 `~/.config/husky/init.sh` 에서 nvm 을 불러와요.

  ```sh
  # ~/.config/husky/init.sh
  export NVM_DIR="$HOME/.nvm"
  . "$NVM_DIR/nvm.sh"
  ```

- **함께 수정해야 하는 곳**: 커밋 type / scope 규칙을 바꿀 때는 `commitlint.config.mjs` 와 `.claude/skills/commit-message` 를 함께 수정해요.

### 버전 관리

| 대상       | 버전    | 명시 위치                                                        |
| ---------- | ------- | ---------------------------------------------------------------- |
| Node.js    | 26 LTS  | `.nvmrc`, `package.json` 의 `engines.node`, `devEngines.runtime` |
| pnpm       | 12.18.0 | `package.json` 의 `packageManager`                               |
| TypeScript | 6.0.x   | 루트 / `@repo/eslint-config` 의 `devDependencies`                |

- **함께 수정해야 하는 곳**: Node 버전을 바꿀 때는 위 세 곳을 함께 수정해요.
- `devEngines.runtime` 덕분에 pnpm 이 지정된 Node 를 자동으로 내려받아 프로젝트 스크립트를 실행해요. (셸의 Node 버전과 무관)
  nvm 사용자는 `nvm use` 로도 맞출 수 있어요.
- pnpm 은 `npm i -g pnpm@12` 로 **직접 설치**해요. Node 22 에 번들된 Corepack 은 pnpm 12 를 실행하지 못해요.
  - 셸의 기본 Node 가 22 라면 `pnpm` 이 Corepack 쪽을 가리켜 `MODULE_NOT_FOUND` 오류가 날 수 있어요. `nvm use` 로 Node 26 에서 실행해요.
- 레포 안에서 다른 Node 버전으로 `npm` / `npx` 를 실행하면 `devEngines` 조건 때문에 오류(`EBADDEVENGINES`)가 나요.
  `nvm use` 로 Node 26 에서 실행해요.
  - `.mcp.json` 의 MCP 서버도 레포 폴더에서 `npx` 로 실행돼요. Node 22 환경에서 Claude Code 를 띄우면 같은 이유로 MCP 연결이 `CONNECTION_CLOSED` 로 실패해요.
- TypeScript 는 `typescript-eslint` 가 지원하는 범위(현재 `<6.1`)에 맞춰요. 7.x 로 올리려면 `typescript-eslint` 지원 여부를 먼저 확인해요.

### 설치된 스킬

| 스킬        | 출처               | 용도                                       |
| ----------- | ------------------ | ------------------------------------------ |
| `turborepo` | `vercel/turborepo` | turbo.json, 태스크, 캐시 등 Turborepo 설정 |

- Next.js 앱을 추가할 때: Next.js 16.3 이상은 프로젝트 생성 시 `AGENTS.md` / `CLAUDE.md` 를 자동으로 만들어요.
  추가 스킬이 필요하면 `vercel/next.js` 의 공식 스킬을 검토해요. (`vercel-labs/next-skills` 는 더 이상 업데이트되지 않아요)

## 📌 8. 이슈 / 라벨 체계

- 이슈 양식: `🐛 버그 제보`, `💡 기능 제안`, `📋 새 할 일` (자유 논의는 GitHub Discussions)
- `📋 새 할 일` 은 "작업 유형"에 따라 라벨이 자동으로 붙어요. (`.github/workflows/issue-task-type-labeler.yml`)

  | 작업 유형                  | 라벨              |
  | -------------------------- | ----------------- |
  | 신규 기능 개발 / 기능 개선 | `enhancement`     |
  | 리팩토링                   | `refactor`        |
  | 인프라 / 배포              | `infra`           |
  | 프로젝트 설정 / 관리       | `project-setting` |
  | 문서화                     | `documentation`   |
  | 기타                       | (없음)            |

- **함께 수정해야 하는 곳**: 작업 유형 선택지나 `⚠️ 선택해 주세요` 문구를 바꿀 때는
  `.github/ISSUE_TEMPLATE/task.yml` 과 워크플로우의 `TYPE_TO_LABEL` / `PLACEHOLDER` 를 함께 수정해요.
  라벨 이름을 바꾸면 `.claude/skills/pr-convention` 의 라벨 규칙도 함께 수정해요.
- `gh` CLI 로 새 할 일 이슈를 만들 때는 양식과 같은 본문 형식(`### 작업 유형` 등)으로 작성하고 `task` 라벨을 붙여요.

## 📌 9. Wiki

- [GitHub Wiki](https://github.com/iamhoonse-dev/iamhoonse-world/wiki) 의 원본은 `docs/wiki/` 예요.
  `main` 에 머지되면 `.github/workflows/wiki-sync.yml` 이 Wiki 저장소로 동기화해요.
- Wiki 는 **웹에서 직접 고치지 않아요.** 다음 동기화 때 덮어써져요.
- **함께 수정해야 하는 곳**: 레포 구조, 툴체인, 워크플로우, 자동화를 바꾸는 PR 에서는 `docs/wiki/` 의 해당 페이지도 함께 수정해요.

  | 바꾸는 것                                   | 수정할 페이지             |
  | ------------------------------------------- | ------------------------- |
  | 패키지 구성, `turbo.json`, 공용 설정        | `Architecture.md`         |
  | Node / pnpm / TypeScript 등 버전, 포맷/린트 | `Toolchain.md`            |
  | 플러그인, 레포 규약, 훅, 스킬, MCP          | `AI-Workflow.md`          |
  | 이슈 양식, 라벨, PR 템플릿, GitHub Actions  | `GitHub-Automation.md`    |
  | 브라우저 검증 방식                          | `Browser-Verification.md` |

- 이 표는 **`scripts/check-wiki-sync.mjs` 가 확정적으로 검사**해요.
  - Claude 가 `git push` / `gh pr create` 를 실행하기 직전에 프로젝트 훅(`.claude/hooks/check-wiki-sync.sh`)이 검사하고, 누락이 있으면 막아요.
    막히면 안내된 페이지를 고쳐 커밋한 뒤 다시 실행해요.
  - PR 에서도 `.github/workflows/wiki-sync-check.yml` 이 같은 검사를 해요. (필수 체크는 아님)
  - Wiki 에 반영할 내용이 정말 없을 때만 커밋 footer 에 `Wiki-Skip: <이유>` 를 남겨요.
  - **함께 수정해야 하는 곳**: 이 표를 바꾸면 스크립트의 `RULES` 와 Wiki `AI-Workflow.md` 의 표도 함께 수정해요.
- 페이지 이름은 파일 이름을 따르고(`AI-Workflow.md` → "AI Workflow"), 링크는 `[AI Workflow](AI-Workflow)` 처럼 확장자 없이 걸어요.
  새 페이지를 추가하면 `_Sidebar.md` 와 `Home.md` 의 페이지 안내도 함께 수정해요.

---

## 🧭 앞으로의 방향: 공통 플로우의 플러그인화

이 프로젝트를 개발하면서 다듬은 🔁 **공통 플로우**는, 다른 프로젝트에서도 쓸 수 있도록
Claude Code 플러그인([hoonse-claude-plugins](https://github.com/iamhoonse-dev/hoonse-claude-plugins))으로 옮기고 있어요.

### 단계

1. ✅ 이 문서에 공통 플로우와 프로젝트 전용 규칙을 구분해서 정리해요.
2. ✅ 기존 마켓플레이스 `hoonse-claude-plugins` 를 쓰기로 정하고, 플러그인 형식을 최신 스펙에 맞춰요.
   - 처음에는 이 레포에 플러그인 패키지 자리(`packages/claude-workflow`)를 두었지만, 마켓플레이스는 설치 시 레포 전체를 받기 때문에 별도 레포를 쓰기로 했어요.
3. ✅ 작업 절차(이슈 → 브랜치 → 커밋 → 검증 → PR → 머지 후 정리)와 `main` 직접 커밋 차단 훅을
   `git-workflow` / `github-workflow` 로 옮기고, 이 레포에서 활성화해요.
4. **남은 🔁 항목을 옮겨요.**
   - MCP 와 민감 정보 규칙, 기본 MCP 구성 → 플러그인의 skill / `.mcp.json`
   - AI 스킬 관리 → skill
   - 이슈/PR 템플릿, 라벨링 워크플로우 → 새 레포에 깔아 주는 skill
   - 옮긴 뒤 이 문서에는 📌 프로젝트 전용 규칙만 남겨요.

### 이 문서를 고칠 때

- 새 규칙을 추가할 때 🔁 / 📌 중 어디에 해당하는지 판단해서 표시해요.
- 판단 기준: **"다른 프로젝트에서도 그대로 쓸 수 있는가?"** → 그렇다면 🔁
- 작업 절차 자체를 바꾸고 싶다면 이 문서가 아니라 플러그인을 고쳐요. 이 레포에만 필요한 차이는 `.claude/skills/` 나 이 문서에 적어요.
