---
name: commit-message
description: iamhoonse-world 의 커밋 메시지 규약입니다. 이 레포에서 git commit 메시지를 작성할 때 따릅니다.
user-invocable: false
---

# 커밋 메시지 규약 (iamhoonse-world)

> git-workflow 플러그인의 기본 규약 대신 이 문서를 따라요.
> **함께 수정해야 하는 곳**: type 이나 scope 규칙을 바꾸면 `branch-strategy`, `pr-convention` 스킬도 함께 확인해요.

[Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) + scope 를 사용해요.

## 형식

```
<type>[(scope)][!]: <한국어 요약>

<무엇을, 왜 바꿨는지>

Refs #<이슈 번호>
```

## type

| type       | 사용 시점                             |
| ---------- | ------------------------------------- |
| `feat`     | 기능 추가                             |
| `fix`      | 버그 수정                             |
| `refactor` | 동작 변화 없는 구조 개선              |
| `perf`     | 성능 개선                             |
| `test`     | 테스트 추가/수정                      |
| `docs`     | 문서만 변경                           |
| `style`    | 동작에 영향 없는 포매팅               |
| `build`    | 빌드 도구, 의존성 변경                |
| `ci`       | GitHub Actions 등 CI 변경             |
| `chore`    | 그 외 설정/관리 (템플릿, AI 설정 등)  |

## scope

**앱/패키지의 디렉토리 이름**을 scope 로 써요.

| 변경 대상                          | scope                    | 예                                          |
| ---------------------------------- | ------------------------ | ------------------------------------------- |
| `apps/<name>`                      | `<name>`                 | `feat(web): 글 목록 페이지 추가`            |
| `packages/<name>`                  | `<name>`                 | `fix(eslint-config): import 순서 규칙 수정` |
| 여러 앱/패키지 또는 레포 전역 설정 | 생략                     | `chore: Turborepo 버전 업데이트`            |

- 한 커밋이 여러 앱/패키지에 걸치면 가능하면 커밋을 나누고, 나눌 수 없으면 scope 를 생략해요.

## 작성 규칙

- 요약은 **한국어 명사형**으로 끝내고 마침표를 붙이지 않아요. (예: "로그인 페이지 추가", "헤더 깨짐 수정")
- 첫째 줄은 72자 이내로 써요.
- 본문에 **무엇을, 왜** 바꿨는지 적어요. 변경이 사소하면 생략해도 돼요.
- 관련 이슈는 footer 에 `Refs #<번호>` 로 남겨요. (이슈를 닫는 것은 PR 의 `Closes #<번호>` 로 해요)
- 성격이 다른 변경은 커밋을 나눠요. (예: PR 템플릿 / 이슈 템플릿)
- 호환되지 않는 변경은 `feat(web)!:` 처럼 `!` 를 붙이고 footer 에 `BREAKING CHANGE: <설명>` 을 적어요.

## 예시

```
feat(web): 글 목록 페이지 추가

최신순으로 글 목록을 보여주고, 10개 단위로 페이지를 나눔

Refs #21
```

```
chore: Issue, PR 템플릿 추가

Refs #1
```
