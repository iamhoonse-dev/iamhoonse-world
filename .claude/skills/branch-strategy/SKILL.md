---
name: branch-strategy
description: iamhoonse-world 의 브랜치 전략입니다. 이 레포에서 브랜치를 만들고 관리할 때 따릅니다.
user-invocable: false
---

# 브랜치 전략 (iamhoonse-world)

> git-workflow 플러그인의 기본 규약 대신 이 문서를 따라요.

## 전략

- **trunk-based development** — `main` 이 유일한 장기 브랜치예요.
- `main` 에 직접 커밋하지 않아요. 항상 브랜치를 만들어 PR 로 반영해요. (git-workflow 훅이 직접 커밋을 막아요)
- 브랜치는 **최신 `main`** 에서 만들어요.
- 작업은 **이슈를 먼저 만들고** 시작해요.

## 이름

```
<type>/<short-description>
```

- `type`: 커밋 규약(commit-message)의 type 을 그대로 써요. 주로 `feat`, `fix`, `refactor`, `docs`, `chore` 를 써요.
- `short-description`: 영문 소문자, 숫자, 하이픈만 사용해요.
  - 하나의 앱/패키지만 바꾸면 그 이름을 앞에 붙여요. (예: `feat/web-post-list`)

## 예시

```
feat/web-post-list
fix/eslint-config-import-order
chore/turborepo-setup
docs/agents-md-rules
```

## 머지 후 정리

- 원격 브랜치는 머지 시 자동으로 삭제돼요. (레포 설정)
- 로컬은 `main` 으로 이동해 최신화하고, 머지된 브랜치를 `git branch -d` 로 삭제해요.

## 금지 사항

- 사용자 확인 없이 force push 하지 않아요.
- 원격 브랜치를 직접 삭제할 때는 사용자에게 먼저 확인해요.
