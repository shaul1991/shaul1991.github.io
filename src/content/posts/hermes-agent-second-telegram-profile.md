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
hermes -p failmy_bot profile show
```

`Model`, `Gateway`, `Skills` 개수, `.env`/`SOUL.md` 존재 여부가 기존 프로필과 독립적으로 표시된다.[1][5]

## 2. Telegram 봇과 대상 범위를 새로 정한다

```bash
hermes -p failmy_bot config set telegram.allowed_chats "<chat-id>"
hermes -p failmy_bot config set telegram.group_allowed_chats "<chat-id>"
```

1:1 DM만 필요하면 `allowed_chats`만 설정한다. 그룹 챗에서 함께 쓰려면 `group_allowed_chats`에도 같은 chat ID를 등록해야 그룹 메시지를 처리한다. 이 홈서버에서는 두 값을 같은 그룹 chat ID로 맞춰 부부가 한 그룹에서 함께 비서를 쓸 수 있게 했다.

봇 token은 기존 비서와 다른 봇을 새로 만들어 발급받고, 새 프로필의 `.env`에만 넣는다. 같은 token을 두 프로필에서 동시에 쓰면 두 poller가 충돌한다.[3]

```bash
hermes -p failmy_bot mcp list
```

새 프로필은 LocalMind 같은 외부 MCP도 기존 프로필과 별개로 시작한다. 이 홈서버의 새 프로필은 확인 시점에 `No MCP servers configured` 상태였다. 필요하면 별도로 `hermes mcp add`한다.

## 3. Gateway와 모델을 검증한다

```bash
hermes -p failmy_bot gateway status --deep
```

`Active: active (running)`, 최근 heartbeat, 단일 프로세스가 확인돼야 한다. 이 홈서버의 새 프로필 게이트웨이는 systemd 하나의 unit이 여러 프로필 프로세스를 관리하는 구성이었고, `cron status`에서 `Ticker heartbeat`가 최근 값으로 갱신되고 있었다.

```bash
hermes -p failmy_bot cron status
```

`Gateway is running — cron jobs will fire automatically`와 `No active jobs`가 함께 나오면, 예약 작업 없이 순수 대화형 비서로만 시작된 상태다. 자동화가 필요해지면 7편의 절차대로 job을 하나씩 추가한다.

## 4. 실제로 부부가 함께 쓴 사례: 이사 준비 조사

부부용 비서를 만든 뒤 실제로 쓴 첫 사례는 청약 공고 확인부터 자금 계획까지 이어지는 이사 준비였다. 그룹 챗에 서류를 올리고 조건을 말하면, 비서가 문서를 읽고 조사와 계산을 거쳐 다음 질문의 재료를 만들어 주는 방식으로 대화가 진행됐다.

1. **공고문 PDF를 읽고 자격을 판정** — 공공주택 청약 공고문 PDF를 그룹 챗에 올리자, 비서가 파일을 직접 열어 텍스트를 추출하고 신청 자격 판단에 필요한 항목(혼인 시점, 자녀 유무, 거주지, 소득)을 되물었다.
2. **근로계약서로 소득 요건을 계산** — 근로계약서 PDF를 올리자 세전 월급여를 기준으로 가구 소득 한도 대비 충족 여부를 계산하고, 외벌이·맞벌이 두 경우의 소득 상한을 각각 표로 비교했다. 이후 배우자의 소득 형태(프리랜서 등)와 대략적인 월 소득을 말로 알려주자 계산을 다시 갱신했다.
3. **현재 거주 조건으로 대출 여력을 계산** — 현재 임대주택의 보증금과 임대 형태를 알려주자, 총자산 한도 대비 여유분과 함께 "청약 자체는 결격사유가 아니다"는 판단 근거를 정리했다.
4. **은행 대출추천서로 정확한 한도를 재계산** — 은행에서 받은 대출추천서 PDF를 올리자, 문서에 적힌 전환 전·후 보증금과 잔여한도를 읽어 최대 추가 대출액을 계산했다. 이후 "재계약하며 자기자금을 조금 더 넣어서 보증금이 바뀌었다"고 정정하자, 그 차액만큼 한도를 다시 계산해 갱신된 결과를 내놨다.
5. **보증금 전환에 따른 월세 변화를 표로 제시** — 현재 월세를 알려주자, LH 보증금 전환이율 구간별(낮음·중간·높음)로 월세 감소액과 변경 후 예상 월세를 표로 계산했고, 이어서 대출 이자를 금리 구간별로 얹어 "월세 절감분과 대출이자를 합친 실제 체감 부담"까지 비교했다.
6. **자금이 필요한 시점을 캘린더로 정리** — "언제 얼마가 필요한지 정리해 달라"는 요청에 청약 접수·서류 제출·계약금·잔금 시점을 순서대로 나열하고, 각 시점에 필요한 목돈을 표로 정리했다. 계약금 시점에는 상대적으로 적은 금액이, 입주 전 잔금 시점에는 보증금 선택에 따라 큰 폭의 차이가 나는 금액이 필요하다는 구조가 드러났다.
7. **두 가지 자금 전략을 비교** — "지금 집에서 추가 대출을 받아 저축을 늘리는 방향은 어떤가"라는 질문에, 비서는 대출을 받는다고 순자산이 느는 건 아니라는 점을 짚으면서도, 자녀 나이 기준 특례 대출 요건이 만료되기 전에 미리 대출을 실행해 두는 것이 갖는 실질적 가치를 설명했다. 이후 "만기 시점에 최대로 전세대출을 받는다면"이라는 가정 질문에는 최대 대출 시나리오의 필요 자기자금과 예상 월 임대료까지 이어서 계산했다.

이 흐름에서 비서가 실제로 한 일은 세 가지로 요약된다. **문서를 직접 읽어 숫자를 추출**하고, **말로 준 새 정보로 이전 계산을 정정**하고, **여러 시나리오를 같은 기준으로 비교**하는 것이다. 사람이 각 공고문·계약서·추천서를 따로 읽고 계산기를 두드리는 대신, 대화 한 번으로 다음 질문("그럼 월세는 얼마나 줄어?", "그럼 언제까지 얼마를 모아야 해?")까지 이어갈 수 있었다. 실명, 정확한 소득·보증금·대출 금액, 주소, 확정 일정은 이 글에 옮기지 않고 흐름과 구조만 남긴다.

## 5. 그룹 대화에 끼어들지 않게 조정한다

부부가 봇 없이 둘이서만 대화하다가, 비서가 문맥을 잘못 판단해 끼어드는 상황이 생겼다. 이때 실제로 쓴 조정은 다음과 같다.

```bash
hermes -p failmy_bot config set telegram.require_mention true
hermes -p failmy_bot config set telegram.observe_unmentioned_group_messages false
hermes -p failmy_bot config set telegram.exclusive_bot_mentions true
```

이 세 값을 설정하면 그룹에서는 봇을 직접 태그하거나 봇 메시지에 답장했을 때만 응답하고, 태그하지 않은 대화는 세션에도 저장하지 않는다. 응답 여부를 시각적으로 구분하고 싶다면 리액션도 켤 수 있다.

```bash
hermes -p failmy_bot config set telegram.reactions true
```

처리 시작·완료·오류를 각각 다른 이모지 리액션으로 표시해, 그룹 안에서 봇이 지금 무엇을 하고 있는지 채팅을 어지럽히지 않고 알 수 있다. 설정은 저장 즉시가 아니라 게이트웨이 재시작 후에 적용된다.

```bash
hermes -p failmy_bot gateway restart
```

## 6. 실제 대화로 마무리 확인한다

1. 새 봇에 `/start` 또는 인사말을 보낸다.
2. 1:1과(설정했다면) 그룹 챗 양쪽에서 응답이 오는지 확인한다.
3. `hermes -p failmy_bot gateway status --deep`로 세션이 새로 기록됐는지 확인한다.
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
