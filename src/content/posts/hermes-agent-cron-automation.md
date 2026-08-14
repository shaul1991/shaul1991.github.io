---
title: 'Hermes Agent 실전 가이드 7: Cron 자동화와 운영'
description: LLM 작업, script-only watchdog와 변경 감지 Cron을 예약하고 gateway, 실행 이력, local·Telegram 전달과 실패 원인을 검증한다.
publishedAt: 2026-08-14
updatedAt: 2026-08-14
tags: [Hermes, Cron, Automation]
featured: false
articleType: guide
series: Hermes Agent 실전 가이드
seriesOrder: 7
editor: 한결
editorReview: 2026-08-14-hermes-agent-series-part-5-7
---

Hermes Agent의 Cron은 단순히 정해진 시간에 prompt를 다시 보내는 기능이 아니다. Gateway 안의 scheduler가 작업을 claim하고, 필요하면 fresh agent session을 실행한 뒤 결과를 local file이나 Telegram 같은 채널로 전달한다.[1][5] 따라서 **예약 생성, 실제 실행, 결과 생성과 전달 성공을 서로 다른 단계로 검증해야 한다.**

이 글의 명령은 2026년 8월 14일 Hermes Agent v0.20.1 공식 Cron·Gateway 문서와 CLI help에서 확인했다.[1][5][7]

공개 scheduler·monitor 구현도 교차 확인했고, 로컬 검증은 외부 메시지를 보내지 않는 `local` target과 비식별 smoke script로 수행했다.[8][9]

## 핵심

| 실행 방식 | 무엇이 판단하는가 | LLM 호출 | 변경 없을 때 |
| --- | --- | --- | --- |
| 일반 Cron | Agent가 자료를 읽고 요약·판단 | 실행마다 있음 | Prompt에서 `[SILENT]` 지시 가능 |
| No-agent | Script stdout이 곧 메시지 | 없음 | 빈 stdout이면 silent |
| Monitor | Script·URL 출력 hash가 agent를 깨움 | 바뀐 tick만 있음 | Agent 실행 자체를 억제 |

세 방식 모두 built-in scheduler를 자동으로 tick하려면 해당 profile의 gateway가 실행 중이어야 한다.[1][4][5] 노트북이 꺼지거나 절전 중이면 정시 실행을 보장할 수 없다.

## 시작 전에 실행 주체부터 확인한다

```bash
hermes --version
hermes profile list
hermes cron status
hermes gateway status --deep
```

`cron status`는 gateway process뿐 아니라 scheduler heartbeat와 active job 수를 보여 준다. “Gateway is running”과 최근 heartbeat가 확인돼야 built-in schedule이 자동으로 fire한다.[1][4]

Profile을 나눴다면 모든 명령에 같은 `-p`를 붙인다.

```bash
hermes -p work-agent cron status
hermes -p work-agent gateway status --deep
```

기본 profile의 healthy gateway는 다른 profile의 Cron을 실행하지 않는다.

## 실행 방식을 먼저 고른다

결과 문장을 만들기 위해 모델의 해석이 필요한지 먼저 판단한다.

- 긴 문서 요약, 중요 항목 선별, 자연어 보고서 작성이면 일반 Cron
- 임계치 초과, heartbeat, CI 결과처럼 script가 정확한 문장을 만들 수 있으면 no-agent
- 자료가 바뀐 경우에만 모델이 차이를 해석해야 하면 monitor

고정 임계치와 긴 문서 요약을 같은 방식으로 처리하지 말고 기계적 판정과 언어적 판단을 분리한다.[2][3]

## 1. No-agent smoke job으로 실행 경로를 확인한다

실제 업무보다 먼저 token과 외부 전달이 없는 최소 작업을 한 번 끝까지 실행한다. 현재 profile의 home은 다음 명령으로 확인한다.

```bash
hermes profile list
hermes profile show <active-profile>
```

그 profile의 `scripts/` 아래 `cron-smoke.py`를 만들고 한 줄만 넣는다.

```python
print("CRON_SMOKE_OK")
```

Script는 현재 profile의 `scripts/` 안에 있어야 한다. `.sh`·`.bash`는 Bash, 나머지는 Hermes의 Python으로 실행되며 provider credential은 전달되지 않는다.[1][3]

작업을 생성한다.

```bash
hermes cron create "every 1h" \
  --no-agent \
  --script cron-smoke.py \
  --deliver local \
  --name "cron-smoke"
```

출력에서 job ID, `Mode: no-agent`, 다음 실행 시간을 확인한다. `every 1h`는 한 시간 간격의 반복이고 `1h`는 한 번만 실행되는 delay다.[1]

기다리지 말고 manual run으로 시험한다.

```bash
hermes cron run <job-id>
hermes cron runs <job-id> --limit 5
```

Manual run은 호출 surface에 따라 background handle을 먼저 반환할 수 있다. Trigger 문구를 완료로 보지 말고 `cron runs`의 terminal state가 `completed`인지 확인한다.[1] `local` output은 profile의 `cron/output/<job-id>/` 아래 최신 Markdown에서 `CRON_SMOKE_OK`를 확인한다.

로컬 검증에서는 create·run·history가 exit 0, execution이 `completed`, output에 marker가 있는 것을 확인했다. 정리 후 active job은 0건이었다.

```bash
hermes cron remove <job-id>
```

## 2. 판단이 필요한 작업은 자기완결적인 prompt로 예약한다

Cron agent는 현재 대화의 맥락을 이어받지 않는 fresh session에서 실행된다. “그 저장소 확인해 줘”가 아니라 대상·허용 작업·출력 형식·조용히 끝낼 조건을 prompt 안에 적는다.[1][2]

```bash
hermes cron create "0 9 * * 1-5" \
  "이 작업 디렉터리의 AGENTS.md를 먼저 읽어라. 파일을 수정하지 말고 git status와 프로젝트에 문서화된 test command를 실행하라. 실패한 항목만 command, exit code, 첫 원인 순서로 요약하라. 모두 통과하면 [SILENT]만 출력하라." \
  --workdir /absolute/path/to/project \
  --deliver local \
  --name "weekday-project-health"
```

`workdir`는 존재하는 absolute directory여야 한다. Context file이 주입되고 file·terminal tool의 cwd가 된다.[1] Test가 외부 service나 비용을 쓰는지는 먼저 수동 확인한다.

Recurring job은 `--model`·`--provider` 또는 `cron.model`로 inference route를 고정할 수 있다. `blocked_config`이면 credential, skill, delivery target과 model drift guard를 확인한다.[1]

## 3. 변경될 때만 Agent를 깨운다

`--monitor-script`와 `--monitor-url`은 매 tick의 source output을 exact byte hash로 비교한다. 첫 tick은 baseline을 만들며 agent가 실행되고, 이후 output이 같으면 `no_change`로 기록한 뒤 inference와 delivery를 억제한다. 달라지면 이전·현재 output의 diff와 새 내용을 prompt에 넣어 agent를 실행한다.[1][8][9]

```bash
hermes cron create "every 1h" \
  "변경된 항목만 요약하고 사용자 영향과 확인할 공식 URL을 알려 줘." \
  --monitor-url https://status.example.com/api/summary \
  --deliver local \
  --name "service-status-change"
```

위 URL은 형식을 보여 주는 placeholder다. 실제로는 자신이 접근 권한을 가진 stable HTTP endpoint를 넣는다. Monitor source에 현재 시각, random ID, 정렬이 매번 달라지는 JSON이 포함되면 내용이 같아도 hash가 달라져 매번 agent를 깨운다. Script에서 timestamp를 제거하고 key·item 순서를 고정한다.[1][8]

Script가 최종 알림 문장까지 만들 수 있다면 monitor와 agent를 합치지 말고 no-agent를 쓴다.

## 4. Watchdog는 빈 stdout을 정상 상태로 만든다

다음 Python 예시는 현재 profile의 home volume이 90% 이상일 때만 한 줄을 출력한다.

```python
from pathlib import Path
from shutil import disk_usage

usage = disk_usage(Path.home())
percent = round(usage.used * 100 / usage.total)
if percent >= 90:
    print(f"Disk usage is {percent}% on the Hermes host")
```

`disk-watch.py`로 저장한 뒤 등록한다.

```bash
hermes cron create "every 15m" \
  --no-agent \
  --script disk-watch.py \
  --deliver telegram \
  --name "disk-watch"
```

No-agent job은 exit 0의 non-empty stdout을 그대로 전달하고, empty stdout은 silent tick으로 처리한다. Non-zero exit나 timeout은 watchdog 고장이 묻히지 않도록 error alert를 만든다.[1][3]

처음에는 `--deliver local`로 marker와 threshold를 확인한 뒤 Telegram으로 바꾼다. 개인 Telegram home channel과 allowlist를 아직 구성하지 않았다면 4편의 gateway setup을 먼저 끝낸다. 실제 chat ID를 command history나 blog에 넣지 않는다.

## Schedule과 시간대를 구분한다

| 형식 | 예 | 반복 |
| --- | --- | --- |
| Relative delay | `30m` | 한 번 |
| Interval | `every 2h` | 제거할 때까지 |
| Cron expression | `0 9 * * 1-5` | 평일 09:00 반복 |
| ISO timestamp | `2026-08-20T09:00:00` | 한 번 |

Cron expression은 host의 local timezone을 따른다.[1][4] Next run을 확인하고, DST·절전·restart가 중요한 업무는 execution ledger와 downstream idempotency를 설계한다.

## 전달 대상은 실행과 별도로 확인한다

Standalone CLI에서 deliver를 생략하면 기본값은 `local`, messaging chat에서 만들면 `origin`이다.[1] Telegram home channel로 보내려면 다음처럼 명시한다.

```bash
hermes cron edit <job-id> --deliver telegram
hermes cron run <job-id>
hermes cron runs <job-id> --limit 5
```

Execution이 `completed`여도 delivery credential·권한이 틀리면 메시지는 오지 않을 수 있다. `local` output이 생성됐는지 먼저 보고, 그 다음 gateway log와 platform 권한을 확인한다.[1][4]

일반 agent job에서 변화가 없을 때는 최종 응답을 정확히 `[SILENT]` 하나로 만들 수 있다. 문장 안에 marker를 설명하는 것은 quiet response가 아니다. No-agent는 빈 stdout, monitor는 unchanged hash가 각각 더 앞단의 조용한 경로다.[1][5]

## Headless 실행의 보안 기준

예약 작업에는 사용자가 앞에서 approval prompt에 답하지 못한다. 기본 `approvals.cron_mode: deny`를 유지하면 dangerous command가 필요한 job은 차단되고 다른 경로를 찾는다.[6]

```yaml
approvals:
  cron_mode: deny
```

다음 원칙을 지킨다.

1. Prompt와 script에 token·password를 직접 넣지 않는다.
2. `workdir`와 enabled toolset을 필요한 범위로 줄인다.
3. Script는 profile의 `scripts/` 아래에 두고 source review한다.
4. 업무 변경 job은 먼저 `local`, manual run과 test environment에서 검증한다.
5. 삭제·배포·결제처럼 되돌리기 어려운 작업을 무인 승인으로 바꾸지 않는다.
6. Job store를 직접 patch하지 말고 `hermes cron` 또는 Cron tool을 사용한다.[1][6]

Hermes의 built-in Cron이 멈췄는지를 감시하는 critical watchdog을 같은 gateway 안에 두면 함께 멈춘다. Gateway 자체의 생존이 관건이면 OS scheduler나 외부 monitoring service처럼 별도 failure domain을 사용한다.[3]

## 자주 막히는 지점

| 증상 | 먼저 확인 | 처리 |
| --- | --- | --- |
| Job이 자동 실행되지 않음 | `hermes cron status` | 대상 profile gateway와 heartbeat 복구 |
| Run을 눌렀지만 완료가 불명 | `hermes cron runs <id>` | terminal state와 output 확인 |
| `blocked_config` | provider·skill·delivery preflight | 누락 credential·dependency·target 수정 |
| Execution 성공, 메시지 없음 | deliver, `[SILENT]`, empty stdout | local output과 platform 권한 분리 확인 |
| Monitor가 매번 실행됨 | source byte 안정성 | timestamp·random·정렬 변동 제거 |
| Script를 찾지 못함 | active profile과 `scripts/` | 다른 profile에 만든 file인지 확인 |
| 예상 시각과 다름 | host clock·timezone·next run | timezone 수정 후 schedule 재검토 |
| 같은 job이 겹침 | running state·tick lock | manual run 반복 금지, long job 분리 |
| Gateway와 watchdog이 함께 멈춤 | 동일 failure domain | OS·외부 monitor 추가 |

Log를 공유할 때는 문제 시각 주변만 남기고 secret·사용자 ID·업무 내용을 가린다.

## 자동화가 끝났다면

다음 다섯 항목이 실제 결과로 확인돼야 한다.

1. 대상 profile의 `cron status`에 healthy gateway와 heartbeat가 보인다.
2. Manual run의 execution ledger가 terminal state로 끝난다.
3. `local` output이나 지정 channel에서 기대 marker·report를 확인한다.
4. 변화 없는 tick은 no-agent empty stdout, monitor `no_change` 또는 정확한 `[SILENT]`로 조용하다.
5. Job을 pause·edit·remove하고 실패 원인을 execution과 delivery로 나눌 수 있다.

이로써 시리즈는 개념 → macOS·Windows 설치 → ChatGPT OAuth·Telegram → profile 격리 → memory·skill·session → Cron 운영까지 이어진다. 자동화의 목표는 많이 예약하는 것이 아니라, 언제 실행됐고 무엇이 바뀌었으며 왜 전달됐는지를 다시 확인할 수 있게 만드는 것이다.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/user-guide/features/cron — Scheduled Tasks (Cron)

[2] https://hermes-agent.nousresearch.com/docs/guides/automate-with-cron — Automate Anything with Cron

[3] https://hermes-agent.nousresearch.com/docs/guides/cron-script-only — Script-Only Cron Jobs

[4] https://hermes-agent.nousresearch.com/docs/guides/cron-troubleshooting — Cron Troubleshooting

[5] https://hermes-agent.nousresearch.com/docs/user-guide/messaging — Messaging Gateway

[6] https://hermes-agent.nousresearch.com/docs/user-guide/security — Security

[7] https://hermes-agent.nousresearch.com/docs/reference/cli-commands — Hermes Agent CLI Commands

[8] https://github.com/NousResearch/hermes-agent/blob/main/cron/monitor.py — Hermes cron monitor implementation

[9] https://github.com/NousResearch/hermes-agent/blob/main/cron/scheduler.py — Hermes cron scheduler implementation
