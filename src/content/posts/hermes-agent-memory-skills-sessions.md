---
title: 'Hermes Agent 실전 가이드 6: 메모리·스킬·세션 관리'
description: Hermes가 계속 기억할 사실, 필요할 때 불러올 절차, 다시 찾을 대화 기록을 구분하고 저장·검증·교정·정리하는 기준을 세운다.
publishedAt: 2026-08-14
updatedAt: 2026-08-14
tags: [Hermes, Memory, Skills]
featured: false
articleType: guide
series: Hermes Agent 실전 가이드
seriesOrder: 6
editor: 한결
editorReview: 2026-08-14-hermes-agent-series-part-5-7
---

Hermes Agent가 지난 대화를 저장한다고 해서 모든 과거 정보가 매번 모델에 들어가는 것은 아니다. 항상 필요한 짧은 사실은 memory, 반복 절차는 skill, 대화 원문은 session에 서로 다른 방식으로 보관된다. **무엇을 기억시킬지보다 먼저 정할 것은 어느 저장소에 둘지다.**

이 글은 2026년 8월 14일 Hermes Agent v0.20.1의 공식 memory·skill·session 문서를 교차 확인했다.[1][2][3]

명령은 같은 버전의 CLI help로 다시 확인했으며, API 키·OAuth 토큰·고객 데이터는 예제로 사용하지 않는다.[6]

## 핵심

| 저장소 | 넣을 것 | 불러오는 때 | 대표 검증 |
| --- | --- | --- | --- |
| `USER.md` | 사용자 역할·선호·소통 방식 | 새 session 시작 시 항상 | 새 session에서 선호가 반영됨 |
| `MEMORY.md` | 안정적인 환경·규칙·도구 특성 | 새 session 시작 시 항상 | Hermes가 정확한 사실을 다시 말함 |
| Skill | 반복 가능한 절차·명령·실패 복구법 | 관련 작업에 필요할 때만 | skill을 불러 실제 절차가 적용됨 |
| Session | 대화, tool call·result, 결정 과정 | 검색·resume할 때 | 제목·검색어로 원문을 찾음 |
| 프로젝트 문서 | 팀이 검토할 설계·결정·상태 | 저장소를 열 때 | Git diff와 review로 확인 |

한 줄 규칙은 다음과 같다.

- **매번 알아야 할 짧고 오래가는 사실**이면 memory
- **다시 수행할 방법**이면 skill
- **그때 무슨 말을 하고 실행했는지**면 session
- **팀의 정본이나 변경 가능한 업무 상태**면 프로젝트 문서

## Memory는 작은 상시 문맥이다

Hermes의 built-in memory는 프로필별 `memories/` 아래 두 파일로 구성된다. 현재 기본 한도는 `MEMORY.md` 2,200자, `USER.md` 1,375자다.[1]

| 대상 | 적합한 예 | 부적합한 예 |
| --- | --- | --- |
| `user` | “한국어로 답한다”, “표 뒤에 요약을 붙인다” | 오늘만 원하는 출력 형식 |
| `memory` | 프로젝트의 테스트 명령, 안정적인 환경 특성 | 임시 파일 경로, 이번 작업 진행률 |

Memory는 모든 새 session의 system prompt에 들어가므로 짧아도 매번 token 비용이 생긴다. 한도를 채우는 것이 목표가 아니다. 일주일 안에 낡을 이슈 번호, commit SHA, 작업 완료 기록과 임시 TODO는 session이나 프로젝트 문서에 두는 편이 낫다.

## 1. 실제 선호 하나를 저장하고 새 session에서 확인한다

Hermes에게 값의 성격과 저장 대상을 함께 말한다.

> 앞으로 코드 리뷰 결과는 표로 먼저 보여 줘. 여러 작업에서 계속 쓸 소통 선호이므로 user memory에 저장해.

Memory tool이 성공했다고 보고하면 같은 대화에서 즉시 시험하지 않는다. Memory는 disk에 바로 저장되지만, 현재 session의 system prompt에는 시작 시점 snapshot이 유지된다.[1] 새 session을 열어 검증한다.

```text
/new memory-check
```

> 내가 선호하는 코드 리뷰 결과 형식이 무엇인지 알려 줘.

정확히 답하면 저장과 다음-session load가 함께 확인된 것이다. 테스트용 항목이었다면 “방금 저장한 코드 리뷰 형식 선호를 user memory에서 제거하고 결과를 알려 줘”라고 요청한 뒤 다시 새 session에서 사라졌는지 확인한다.

## Memory에 넣지 말아야 할 것

다음 값은 짧고 자주 필요해 보여도 memory에 저장하지 않는다.

- API key, OAuth token, password, SSH private key
- 실제 고객·환자·직원 정보와 비공개 대화 원문
- 곧 바뀔 branch, issue, PR, commit 상태
- 긴 log, code block, 문서 전체
- 웹사이트에서 방금 읽은 현재 상태

Session search로 과거에 “서비스가 정상”이라고 찾았더라도 현재 서비스 상태의 증거는 아니다. URL, 저장소, 서버처럼 원본이 있는 질문은 원본을 다시 조회하고 session은 당시 논의의 보조 맥락으로만 사용한다.

## 2. 잘못 저장되는 것이 걱정되면 승인 대기열을 켠다

기본 설정에서는 Hermes가 memory를 직접 갱신할 수 있다. 저장 전 검토가 필요한 환경은 profile의 `config.yaml`에서 approval을 켠다.[1]

```yaml
memory:
  write_approval: true
```

이후 대기 중인 변경을 확인한다.

```text
/memory pending
/memory approve <id>
/memory reject <id>
```

Messaging이나 background review처럼 inline 승인을 받을 수 없는 경로에서도 변경은 pending 상태로 남는다. “Memory updated” 알림만 보고 내용을 신뢰하지 말고 중요한 선호와 환경 정보는 실제 항목을 검토한다.

## Skill은 필요할 때만 불러오는 절차다

Skill은 `SKILL.md`와 선택적인 reference·template·script로 이루어진 on-demand 지식이다. Hermes는 이름과 짧은 설명만 먼저 알고 있다가, 관련 작업에 필요할 때 본문과 reference를 단계적으로 불러온다.[2][4]

Memory에 다음처럼 긴 절차를 넣지 않는다.

> 배포 전에 branch 확인 → test → build → staged diff 검사 → 배포 → health check → rollback 판단

이 내용은 “배포 방법”이라는 skill에 적합하다. 절차가 바뀌면 한 파일을 고치고, 배포 작업에서만 load할 수 있기 때문이다.

## 3. 설치 전 검사하고 한 작업에서 사용한다

현재 프로필의 skill부터 확인한다.

```bash
hermes skills list
```

Hub나 URL에서 찾은 skill은 바로 설치하기 전에 metadata와 내용을 검사한다.[2]

```bash
hermes skills search <검색어>
hermes skills inspect <출처/스킬>
hermes skills install <출처/스킬>
```

설치한 skill은 새 session에서 index에 반영된다. 현재 session에서 즉시 index를 다시 만들면 prompt cache 비용이 달라질 수 있으므로, 급하지 않다면 `/new`로 시작한다.[4]

```text
/<skill-name> 구체적인 작업과 완료 조건
```

성공 기준은 slash command가 인식되는 데서 끝나지 않는다. Skill의 procedure가 실제 tool call에 반영되고, 명시된 verification이 통과하며, 실패 경로가 현재 환경과 맞는지 본다.

## 제3자 Skill은 실행 가능한 공급망 입력이다

Skill은 단순 참고 글이 아니다. Agent에게 terminal command, URL access와 file write를 지시할 수 있고 script도 포함할 수 있다. 설치 전 다음을 확인한다.[2][5]

1. 출처와 정확한 content hash
2. 요구하는 환경 변수와 credential
3. terminal·browser·file 접근 범위
4. 외부로 보내는 데이터와 목적지
5. 삭제·업로드·배포 같은 side effect
6. verification과 rollback 절차

이름이 익숙하거나 인기가 많다는 이유로 신뢰하지 않는다. 공유 skill directory가 writable하면 Hermes가 수정할 수도 있으므로, 읽기 전용이 필요하면 파일 권한이나 별도 profile·실행 환경으로 막는다.[2]

Skill 변경도 사람이 승인하도록 설정할 수 있다.

```yaml
skills:
  write_approval: true
```

```text
/skills pending
/skills diff <id>
/skills approve <id>
/skills reject <id>
```

긴 `SKILL.md`는 요약만 보고 승인하지 말고 CLI나 dashboard에서 전체 diff를 읽는다.[1][2]

## Session은 검색 가능한 원문 기록이다

CLI와 Telegram·Discord·Cron을 포함한 대화는 profile의 SQLite session store에 message, tool call·result, model, token, 시간과 source 정보로 저장된다.[3] 이 기록은 memory보다 크고 자동으로 쌓이지만, 매 prompt에 전부 들어가지는 않는다.

대화를 다시 찾기 쉽게 시작할 때 제목을 붙인다.

```text
/title payment-refactor
```

새 주제로 넘어갈 때는 session을 분리한다.

```text
/new release-check
```

CLI에서 최근 session이나 특정 제목을 이어갈 수 있다.

```bash
hermes --continue
hermes --resume "payment-refactor"
hermes sessions list
```

“지난주 인증 refactor에서 어떤 결정을 했는지 찾아 줘”처럼 요청하면 Hermes는 `session_search`로 실제 저장 message를 검색할 수 있다.[1][3] 검색 결과가 비어 있다고 모든 과거 대화가 없었다고 단정하지 말고, profile·source·검색어와 session 제목을 바꿔 확인한다.

## 4. 보관과 삭제를 분리한다

목록에서 숨기고 싶을 뿐이라면 먼저 archive를 preview한다.[3]

```bash
hermes sessions archive --older-than 90 --dry-run
hermes sessions archive --older-than 90 --yes
```

DB가 커졌지만 기록은 유지하려면 data를 지우기 전에 optimize한다.

```bash
hermes sessions optimize
hermes sessions stats
```

정말 삭제할 때만 prune 대상을 좁히고 dry run을 확인한다.

```bash
hermes sessions prune --source cron --older-than 90 --dry-run
hermes sessions prune --source cron --older-than 90 --yes
```

Filter를 하나라도 주면 bare `prune`의 기본 90일 조건이 달라질 수 있으므로, source만 쓰지 말고 시간 조건을 명시한다. Prune은 종료된 session만 대상으로 하지만 삭제 후 검색할 수 없으므로 export가 필요하면 먼저 수행한다.[3]

```bash
hermes sessions export session-backup.jsonl --redact
```

`--redact`는 알려진 secret pattern을 줄이는 보조 장치다. 공유 전에는 대화 본문, tool output, 내부 URL과 개인 경로를 직접 다시 읽는다.

## 같은 정보가 여러 곳에 있을 때

우선순위를 정하지 않으면 오래된 memory와 최신 프로젝트 문서가 충돌한다.

| 충돌 | 기준 |
| --- | --- |
| 사용자 선호가 바뀜 | 기존 user memory를 replace·remove |
| Skill 명령이 현재 버전과 다름 | 공식 문서 확인 후 skill patch |
| 과거 session과 현재 저장소가 다름 | 현재 원본을 먼저 확인 |
| 팀 결정과 개인 memory가 다름 | 검토된 팀 문서를 정본으로 삼음 |
| 다른 profile에서 정보가 안 보임 | 정상 분리인지 확인하고 무조건 복사하지 않음 |

Memory와 skill은 profile별이고 session DB도 profile에 속한다.[7] 개인 profile의 선호·대화를 업무 profile로 공유해야 한다면 자동 동기화보다 공개 가능한 최소 항목만 다시 작성한다.

## 자주 막히는 지점

| 증상 | 원인 후보 | 확인·처리 |
| --- | --- | --- |
| 방금 저장한 memory가 반영 안 됨 | 현재 session snapshot | `/new` 후 다시 확인 |
| Memory가 가득 참 | 중복·오래된 항목 | add만 반복하지 말고 replace·remove |
| Skill이 목록에 없음 | 다른 profile, 새 session 필요 | `profile list`, `skills list`, `/new` 확인 |
| Skill은 load됐지만 실패 | command·dependency·credential 불일치 | procedure보다 최초 tool error와 verification 확인 |
| 과거 대화를 못 찾음 | 검색어·source·profile 불일치 | 제목, 고유 용어와 profile을 좁혀 재검색 |
| DB만 커짐 | session 누적 | 삭제 전 `sessions optimize`와 stats |
| Export에 민감정보가 있음 | 대화·tool result에 원문 저장 | `--redact` 후 수동 검토, 공개 중단 |

## 관리가 끝났다면

다음 네 가지를 실제 결과로 확인한다.

1. 오래가는 선호 하나가 새 session에서 정확히 반영된다.
2. 반복 절차는 memory가 아니라 관련 작업에서만 불러오는 skill에 있다.
3. 과거 대화의 고유 문장을 session search나 resume로 찾을 수 있다.
4. 오래된 정보의 교정·archive·export·삭제 경로를 알고 있다.

다음 편에서는 fresh session에서 실행되는 Cron에 자기완결적인 작업을 예약하고, gateway 상태·실행 이력·local 또는 Telegram 전달까지 검증한다.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/user-guide/features/memory — Persistent Memory

[2] https://hermes-agent.nousresearch.com/docs/user-guide/features/skills — Skills System

[3] https://hermes-agent.nousresearch.com/docs/user-guide/sessions — Sessions

[4] https://hermes-agent.nousresearch.com/docs/guides/work-with-skills — Working with Skills

[5] https://hermes-agent.nousresearch.com/docs/user-guide/security — Security

[6] https://hermes-agent.nousresearch.com/docs/reference/cli-commands — Hermes Agent CLI Commands

[7] https://hermes-agent.nousresearch.com/docs/user-guide/profiles — Profiles: Running Multiple Agents
