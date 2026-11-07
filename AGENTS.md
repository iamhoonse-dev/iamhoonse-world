# AGENTS.md

이 문서는 AI 에이전트(Claude Code 등)와 함께 이 레포를 개발할 때 따르는 규칙이에요.
사람이 작업할 때도 같은 흐름을 따라요.

> **구분 표시**
>
> - 🔁 **공통 플로우** — 프로젝트와 무관한 개인 개발 플로우. 나중에 Claude Code 플러그인으로 옮길 대상이에요.
> - 📌 **프로젝트 전용** — 이 레포(iamhoonse-world)에만 해당하는 규칙이에요.

---

## 🔁 1. 기본 원칙

- 모든 문서, 이슈, PR, 커밋 메시지, 코드 주석은 **한국어**로 작성해요.
- 되돌리기 어렵거나 외부에 바로 반영되는 작업은 **실행 전에 사용자에게 확인**해요.
  - 예: 레포 설정 변경, 라벨 생성/삭제, 원격 브랜치 삭제, 강제 push, 이슈/PR 닫기
  - 한 번 승인받은 작업이라도 다른 맥락에서는 다시 확인해요.
- 결과는 있는 그대로 보고해요. 실패한 것, 건너뛴 것, 확인하지 못한 것을 숨기지 않아요.

## 🔁 2. 작업 흐름

### 2.1 이슈에서 시작

- 작업은 **이슈를 먼저 만들고** 시작해요. 내부 작업은 `📋 새 할 일` 양식을 사용해요.
- 큰 작업은 하위 이슈(sub-issue)로 나눠요.

### 2.2 브랜치

- `main` 에 직접 커밋하지 않아요. 항상 브랜치를 만들어 PR 로 반영해요.
- 브랜치는 최신 `main` 에서 만들어요.
- 이름은 `<유형>/<짧은-설명>` 형식이에요.

  | 유형        | 용도                     |
  | ----------- | ------------------------ |
  | `feat/`     | 기능 추가                |
  | `fix/`      | 버그 수정                |
  | `refactor/` | 동작 변화 없는 구조 개선 |
  | `docs/`     | 문서                     |
  | `chore/`    | 설정, 빌드, 기타         |

### 2.3 커밋

- 메시지 형식: `<유형>: <한국어 요약>`
  - 본문에 무엇을, 왜 바꿨는지 적어요.
  - 관련 이슈는 `Refs #번호` 로 남겨요.
- 성격이 다른 변경은 커밋을 나눠요. (예: PR 템플릿 / 이슈 템플릿)

### 2.4 PR

- `.github/pull_request_template.md` 의 항목을 **빠짐없이** 채워요. 특히 **영향 범위(위험도)** 와 **검증 방법**.
- 머지 시 닫을 이슈는 `Closes #번호` 로 연결해요.
- 리뷰 중 추가 변경이 생기면 PR 본문도 함께 갱신해요.

### 2.5 머지 후 정리

- 원격 브랜치는 머지 시 자동 삭제돼요. (레포 설정)
- 로컬은 `main` 으로 이동해 최신화하고, 머지된 브랜치를 `git branch -d` 로 삭제해요.

## 🔁 3. 검증

- PR 을 올리기 전에 **검증한 것과 검증하지 못한 것을 구분**해서 PR 에 적어요.
  - 로컬에서 가능한 검증(빌드, 린트, 파싱, 스크립트 시뮬레이션 등)은 먼저 해요.
- **화면/동작이 있는 변경은 Chrome DevTools MCP 로 브라우저에서 직접 사용해 보고** PR 을 올려요.
- 기본 브랜치에 있어야 동작하는 변경(이슈 템플릿, GitHub Actions 등)은
  PR 에 **머지 후 확인 절차**를 적고, 머지 후 실제로 확인해요.
- 테스트용으로 만든 이슈는 결과를 댓글로 남기고 `not planned` 로 닫아요. 프로젝트 보드에 추가됐다면 빼요.

## 🔁 4. 브라우저 테스트 (Chrome DevTools MCP)

- `.mcp.json` 의 `chrome-devtools` 서버를 사용해요.
  - `--autoConnect` 없이 **전용 프로필로 별도 Chrome** 을 띄워요. (macOS 에서 기존 Chrome 프로필 접근이 막히는 문제 회피)
- **로그인, 2단계 인증은 사람이 직접** 해요. AI 는 비밀번호나 인증 코드를 입력하지 않아요.
- 테스트 대상 탭만 다루고, 다른 탭은 건드리지 않아요.

## 🔁 5. MCP 와 민감 정보

- 공용 MCP 설정은 레포의 `.mcp.json` 에 두고 커밋해요.
- 토큰 등 민감 정보는 **값을 직접 쓰지 않고 `${ENV_VAR}` 로 참조**해요.

  ```json
  "env": { "API_TOKEN": "${SOME_SERVICE_TOKEN}" }
  ```

  - 실제 값은 각자 셸 환경변수(`~/.zshrc` 등)에 설정해요.

- 개인적으로만 쓰는 MCP 는 `claude mcp add --scope local ...` 로 추가해요. (레포가 아닌 `~/.claude.json` 에 저장)
- `.env` 계열 파일은 커밋하지 않아요. (`.gitignore` 에 포함)

## 🔁 6. 변경 시 함께 수정해야 하는 곳 명시

- 한 곳을 바꾸면 다른 곳도 같이 바꿔야 하는 경우, **코드 주석과 PR 의 "리뷰어에게"에 명시**해요.

## 🔁 7. AI 스킬 관리

- 프로젝트에서 쓰는 스킬은 [skills CLI](https://github.com/vercel-labs/skills) 로 **프로젝트 범위에 설치**해요.
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

---

## 📌 8. 이 레포의 구성

- 개인 프로젝트 `iamhoonse-world` 의 **Turborepo** 모노레포예요. 패키지 매니저는 **pnpm** 이에요.

  ```text
  apps/                        # 앱 (아직 없음)
  packages/
    typescript-config/         # @repo/typescript-config — 공용 tsconfig
    eslint-config/             # @repo/eslint-config — 공용 ESLint (flat config)
    claude-workflow/           # @repo/claude-workflow — 공통 플로우 플러그인 자리
  turbo.json                   # 태스크 정의
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
- 레포 안에서 다른 Node 버전으로 `npm` / `npx` 를 실행하면 `devEngines` 조건 때문에 오류(`EBADDEVENGINES`)가 나요.
  `nvm use` 로 Node 26 에서 실행해요.
- TypeScript 는 `typescript-eslint` 가 지원하는 범위(현재 `<6.1`)에 맞춰요. 7.x 로 올리려면 `typescript-eslint` 지원 여부를 먼저 확인해요.

### 설치된 스킬

| 스킬        | 출처               | 용도                                       |
| ----------- | ------------------ | ------------------------------------------ |
| `turborepo` | `vercel/turborepo` | turbo.json, 태스크, 캐시 등 Turborepo 설정 |

- Next.js 앱을 추가할 때: Next.js 16.3 이상은 프로젝트 생성 시 `AGENTS.md` / `CLAUDE.md` 를 자동으로 만들어요.
  추가 스킬이 필요하면 `vercel/next.js` 의 공식 스킬을 검토해요. (`vercel-labs/next-skills` 는 더 이상 업데이트되지 않아요)

## 📌 9. 이슈 / 라벨 체계

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
- `gh` CLI 로 새 할 일 이슈를 만들 때는 양식과 같은 본문 형식(`### 작업 유형` 등)으로 작성하고 `task` 라벨을 붙여요.

---

## 🧭 앞으로의 방향: 공통 플로우의 플러그인화

이 프로젝트를 개발하면서 다듬은 🔁 **공통 플로우**는, 다른 프로젝트에서도 쓸 수 있도록
**Claude Code 플러그인**으로 분리할 계획이에요.

### 단계

1. **지금** — 이 문서에 공통 플로우와 프로젝트 전용 규칙을 구분해서 정리해요.
2. **Turborepo 구성 시** ✅ — 플러그인 전용 패키지 자리를 마련해요. (`packages/claude-workflow`)
   - 빌드가 필요 없는 정적 파일 패키지로, 다른 앱/패키지와 의존 관계를 두지 않아요.
3. **규칙이 안정되면** — 🔁 섹션을 플러그인으로 옮겨요.
   - 절차형 규칙 → `skills/` (예: PR 올리기, 브라우저 검증)
   - 자주 쓰는 동작 → `commands/` (예: 이슈로 작업 시작하기)
   - 강제해야 하는 규칙 → `hooks/` (예: `main` 직접 커밋 차단)
   - 기본 MCP 구성 → 플러그인의 `.mcp.json`
   - 이슈/PR 템플릿, 라벨링 워크플로우 → 새 레포에 깔아 주는 skill
   - 옮긴 뒤 이 문서에는 📌 프로젝트 전용 규칙만 남겨요.
4. **다른 프로젝트에서 쓰기 시작하면** — 플러그인을 별도 레포(마켓플레이스)로 분리해요.
   - 마켓플레이스로 쓰면 설치할 때 레포 전체를 받기 때문에, 개인 사이트 코드와 분리하는 것이 좋아요.

### 이 문서를 고칠 때

- 새 규칙을 추가할 때 🔁 / 📌 중 어디에 해당하는지 판단해서 표시해요.
- 판단 기준: **"다른 프로젝트에서도 그대로 쓸 수 있는가?"** → 그렇다면 🔁
