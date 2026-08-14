---
title: 'Hermes Agent 실전 가이드 8: 부부를 위한 AI 비서 만들기'
description: 상시 실행 홈서버에 부부가 함께 쓰는 Telegram AI 비서를 새 프로필로 만들고, 그룹 챗과 모델 설정을 검증한다.
publishedAt: 2026-08-14
updatedAt: 2026-08-14
tags: [Hermes, Telegram, Profile]
featured: false
articleType: guide
series: Hermes Agent 실전 가이드
seriesOrder: 8
editor: 한결
editorReview: 2026-08-14-hermes-agent-second-telegram-profile
---

혼자 쓰는 개인 비서를 이미 홈서버에 두고 있어도, **부부가 함께 쓰는 비서는 같은 프로필에 얹지 않는 편이 낫다.** 새 이름의 프로필을 만들면 모델, credential, skill, 게이트웨이, Telegram 봇이 기존 개인 비서와 완전히 분리된 상태로 시작한다.[1][5] 이 글은 상시 실행 홈서버에 실제로 부부용 비서를 구성하고, 이사 준비 조사에 써 본 절차를 정리한다.

이 글의 명령과 설정 항목은 2026년 8월 14일 홈서버에서 실행 중인 Hermes Agent v0.20.1 인스턴스와 공식 문서·CLI help로 확인했다.[1][5][7] 실제 봇 사용자명, chat ID, token 값과 조사 중이던 구체적인 금액·주소·일정은 공개하지 않는다.

## 핵심

| 확인 항목 | 이번 구성 |
| --- | --- |
| 프로필 | 기존 개인 비서와 이름이 다른 별도 프로필 |
| 모델 | openai-codex 계열, 기본 프로필과 다른 provider 조합도 가능 |
| Telegram 봇 | 기존 비서와 다른 봇 token, 부부만 허용한 chat |
| 대상 | 1:1 DM과 group chat 모두 허용하도록 `allowed_chats`·`group_allowed_chats` 설정 |
| 실 사용 | 신혼희망타운 자격 확인, 대출 옵션 비교, 보증금 전환 계산 등 이사 준비 조사 |
| Cron | 새 프로필도 빈 상태로 시작 — 필요한 작업만 별도로 만든다 |

완료 기준은 "부부용 봇이 응답한다"가 아니라, 프로필·모델·credential·게이트웨이·Telegram 대상이 기존 개인 비서와 겹치지 않는다는 것을 각각 확인하는 것이다.

## 1. 기존 비서와 분리되는지 먼저 확인한다

```bash
hermes profile list
hermes gateway status --deep
```

`profile list`에 기존 프로필과 새 프로필이 서로 다른 alias·gateway 상태로 나오는지 확인한다. 이 홈서버는 default 프로필이 기존 개인 비서를, 새 프로필이 부부용 비서를 맡는 구조였다. 두 프로필 모두 `running` 상태였고 별도 PID로 떠 있었다.

```bash
hermes -p <새-프로필> profile show
```

`Model`, `Gateway`, `Skills` 개수, `.env`/`SOUL.md` 존재 여부가 기존 프로필과 독립적으로 표시된다.[1][5]

## 2. Telegram 봇과 대상 범위를 새로 정한다

```bash
hermes -p <새-프로필> config set telegram.allowed_chats "<chat-id>"
hermes -p <새-프로필> config set telegram.group_allowed_chats "<chat-id>"
```

1:1 DM만 필요하면 `allowed_chats`만 설정한다. 그룹 챗에서 함께 쓰려면 `group_allowed_chats`에도 같은 chat ID를 등록해야 그룹 메시지를 처리한다. 이 홈서버에서는 두 값을 같은 그룹 chat ID로 맞춰 부부가 한 그룹에서 함께 비서를 쓸 수 있게 했다.

봇 token은 기존 비서와 다른 봇을 새로 만들어 발급받고, 새 프로필의 `.env`에만 넣는다. 같은 token을 두 프로필에서 동시에 쓰면 두 poller가 충돌한다.[3]

```bash
hermes -p <새-프로필> mcp list
```

새 프로필은 LocalMind 같은 외부 MCP도 기존 프로필과 별개로 시작한다. 이 홈서버의 새 프로필은 확인 시점에 `No MCP servers configured` 상태였다. 필요하면 별도로 `hermes mcp add`한다.

## 3. Gateway와 모델을 검증한다

```bash
hermes -p <새-프로필> gateway status --deep
```

`Active: active (running)`, 최근 heartbeat, 단일 프로세스가 확인돼야 한다. 이 홈서버의 새 프로필 게이트웨이는 systemd 하나의 unit이 여러 프로필 프로세스를 관리하는 구성이었고, `cron status`에서 `Ticker heartbeat`가 최근 값으로 갱신되고 있었다.

```bash
hermes -p <새-프로필> cron status
```

`Gateway is running — cron jobs will fire automatically`와 `No active jobs`가 함께 나오면, 예약 작업 없이 순수 대화형 비서로만 시작된 상태다. 자동화가 필요해지면 7편의 절차대로 job을 하나씩 추가한다.

## 4. 실제로 부부가 함께 쓴 사례: 이사 준비 조사

부부용 비서를 만든 뒤 실제로 쓴 첫 사례는 이사 준비였다. 그룹 챗에 각자 알고 있는 조건을 올리면, 비서가 공고문과 대출 상품 페이지를 조사해서 자격 여부와 선택지를 정리해 줬다.

1. **입주 자격 확인** — 신혼희망타운 행복주택 같은 공공주택 공고문을 찾아 읽고, 혼인 시점·자녀 유무 같은 부부의 조건을 대입해 신청 가능 여부를 판단했다.
2. **대출 옵션 비교** — 신생아 특례 버팀목대출처럼 조건부로 유리한 대출 상품을 찾아, 실행 시점을 이사 일정과 맞추는 전략의 장단점을 정리했다.
3. **보증금 전환 계산** — 현재 월세를 기준으로 보증금을 추가 납입했을 때 전환이율별 예상 월세를 표로 계산해 비교했다.

세 단계 모두 부부 중 한 명이 그룹 챗에 질문을 던지면 비서가 웹 조사와 계산을 거쳐 결론과 근거를 함께 제시하는 흐름이었다. 구체적인 금액·주소·일정은 이 글에 옮기지 않는다.

## 5. 실제 대화로 마무리 확인한다

1. 새 봇에 `/start` 또는 인사말을 보낸다.
2. 1:1과(설정했다면) 그룹 챗 양쪽에서 응답이 오는지 확인한다.
3. `hermes -p <새-프로필> gateway status --deep`로 세션이 새로 기록됐는지 확인한다.
4. 기존 비서 봇에 같은 메시지를 보내 두 비서가 서로 응답을 가로채지 않는지 확인한다.

이 네 가지가 모두 통과하면, 두 비서는 모델·credential·Telegram 대상·게이트웨이 프로세스가 서로 독립된 상태로 운영되는 것이다.

## 자주 막히는 지점

| 증상 | 먼저 확인 | 처리 |
| --- | --- | --- |
| 그룹에서 응답 없음 | `group_allowed_chats` | DM용 `allowed_chats`만 설정된 경우가 흔함 |
| 새 프로필에 기존 MCP가 안 보임 | `hermes -p <프로필> mcp list` | 프로필별로 별도 등록 필요 |
| 두 비서가 같은 메시지에 동시 응답 | 봇 token 재사용 여부 | 프로필마다 다른 봇 token 사용 |
| Cron이 자동 실행 안 됨 | 해당 프로필의 `gateway status --deep` | heartbeat와 프로세스가 그 프로필용인지 확인 |

## 프라이버시

Telegram 봇 사용자명, 실제 chat ID, token 값, 이사 준비 중 다룬 구체적인 금액·주소·일정은 로그나 공개 문서에 그대로 남기지 않는다. 이 글의 예시 명령도 실제 식별자 대신 placeholder를 사용했다.

이로써 시리즈는 개인 비서 하나를 세우는 절차에서, 프로필을 새로 만들어 부부가 함께 쓰는 비서를 독립적으로 운영하는 절차까지 이어진다.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/user-guide/features/profiles — Profiles

[3] https://hermes-agent.nousresearch.com/docs/guides/cron-script-only — Script-Only Cron Jobs

[5] https://hermes-agent.nousresearch.com/docs/user-guide/messaging — Messaging Gateway

[7] https://hermes-agent.nousresearch.com/docs/reference/cli-commands — Hermes Agent CLI Commands
