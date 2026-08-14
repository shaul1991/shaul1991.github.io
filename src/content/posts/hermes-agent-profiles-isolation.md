---
title: 'Hermes Agent 실전 가이드 5: 프로필과 격리 경계'
description: 개인용·업무용 Hermes 프로필을 분리하고 설정·인증·메모리·세션의 경계와 파일 접근까지 막으려면 필요한 추가 격리를 확인한다.
publishedAt: 2026-08-14
updatedAt: 2026-08-14
tags: [Hermes, Profile, Security]
featured: false
articleType: guide
series: Hermes Agent 실전 가이드
seriesOrder: 5
editor: 한결
editorReview: 2026-08-14-hermes-agent-series-part-5-7
---

개인 일정과 회사 저장소를 같은 Hermes Agent에 맡기면 모델만 섞이는 것이 아니다. 기본 모델, API credential, 메모리, 스킬, 대화 기록, 예약 작업과 메시징 게이트웨이도 하나의 상태 공간을 공유한다. **Hermes 프로필은 이 상태 공간을 별도 홈 디렉터리로 나누는 기능**이다.[1]

하지만 프로필은 같은 운영체제 사용자에게서 실행되는 다른 프로세스다. 같은 사용자가 읽을 수 있는 파일과 CLI credential까지 자동으로 차단하는 sandbox는 아니다. 이 글의 명령은 2026년 8월 14일 Hermes Agent v0.20.1 공식 문서와 CLI help에서 확인했다.[1][6]

공개 구현과 보안 문서를 함께 읽어 상태 분리와 실제 격리를 구분했다.[4][5]

## 핵심

| 목표 | 프로필로 해결 | 추가 경계 필요 |
| --- | --- | --- |
| 모델·provider 설정 분리 | 가능 | — |
| Hermes 인증·환경 변수 분리 | 가능 | clone 시 재검토 |
| 메모리·스킬·세션·cron 분리 | 가능 | 공유 디렉터리는 별도 관리 |
| Telegram·Discord 게이트웨이 분리 | 가능 | 봇과 허용 사용자도 따로 구성 |
| 같은 사용자 홈의 파일 읽기 차단 | 불가능 | OS 계정·컨테이너·원격 실행 |
| `gh`, SSH 같은 호스트 credential 차단 | 불가능 | 별도 계정·credential store·실행 환경 |

완료 기준은 “프로필 이름이 두 개 보인다”가 아니다. 각 프로필에서 모델·세션·스킬·게이트웨이를 조회했을 때 의도한 상태만 나오고, 민감한 작업에는 파일과 credential의 실제 접근 경계까지 따로 있어야 한다.

## 프로필이 실제로 나누는 것

기본 프로필은 기존 `~/.hermes`를 그대로 사용한다. 이름을 붙인 프로필은 기본 Hermes 홈 아래 `profiles/<이름>/`에 별도 홈을 만들고, 다음 상태를 각자 가진다.[1][5]

- `config.yaml`, `.env`, `SOUL.md`
- provider credential과 모델 설정
- `MEMORY.md`, `USER.md`
- 스킬, 세션 DB, cron 작업과 로그
- 게이트웨이 PID·상태와 메시징 설정

두 에이전트가 같은 Hermes 홈을 함께 쓰면 자동 memory write와 세션 상태가 서로 섞일 수 있다. 같은 기기에서 목적이 다른 에이전트를 상주시킬 때는 각각 다른 프로필을 준다.[1]

## 1. 현재 프로필과 버전을 먼저 확인한다

```bash
hermes --version
hermes profile list
```

`profile list`에서 활성 프로필을 확인한다. 실제 프로필 이름과 경로가 포함된 출력은 공개 이슈나 화면 공유에 그대로 올리지 않는다. 아직 하나뿐이어도 정상이다.

프로필 이름은 소문자 영문·숫자로 시작하고 하이픈과 밑줄을 사용할 수 있다. `default`, `hermes`, `root`처럼 예약된 이름은 새 이름으로 쓸 수 없다.[2][5]

## 2. 업무용은 빈 프로필에서 시작한다

개인 설정을 복제하기보다 필요한 항목만 넣는 편이 경계를 확인하기 쉽다. 다음 예시는 shell alias와 bundled skill까지 만들지 않는 빈 업무용 프로필이다.

```bash
hermes profile create work-agent \
  --no-alias \
  --no-skills \
  --description "업무 저장소에서 승인된 개발 작업만 수행"
```

기본 스킬이 필요한 경우 `--no-skills`를 빼면 된다. 빈 프로필은 오류가 아니라 아직 모델·스킬·세션이 구성되지 않은 새 상태다.[1][2]

`--clone`은 빠르지만 보안 분리를 시작하는 기본값으로 삼지 않는다. CLI help는 config, `.env`, `SOUL.md`와 skills를 복사한다고 안내한다. v0.20.1 구현은 여기에 `MEMORY.md`와 `USER.md`도 포함한다.[2][5] 개인 credential과 선호가 업무용에 들어가도 되는지 하나씩 확인할 수 없다면 clone하지 않는다.

## 3. 기본값을 바꾸지 않고 새 프로필을 구성한다

전역 `-p`는 그 명령에만 사용할 프로필을 고른다. 처음에는 sticky 기본값을 바꾸지 말고 모든 명령에 붙인다.[2]

```bash
hermes -p work-agent setup
hermes -p work-agent model
hermes -p work-agent status
```

설정 마법사에는 업무용으로 허용된 provider와 credential만 넣는다. 개인 계정의 API 키나 OAuth 파일을 복사하지 않는다. `status`에서 의도한 provider와 모델이 선택됐는지 확인한 뒤 짧은 대화를 실행한다.

```bash
hermes -p work-agent chat -q \
  "첫 줄에 WORK_PROFILE_OK라고 쓰고 현재 프로필 이름만 알려 줘."
```

응답 문자열은 제품의 고정 출력이 아니라 왕복 확인용이다. 상태 출력과 로그에는 provider, 경로와 계정 정보가 포함될 수 있으므로 필요한 줄만 가린 뒤 공유한다.

## 4. 상태가 비어 있는지 직접 비교한다

```bash
hermes profile show work-agent
hermes -p work-agent sessions stats
hermes -p work-agent skills list
hermes -p work-agent status
```

새 blank 프로필이라면 기존 대화와 개인 스킬이 나타나지 않아야 한다. 이 글을 검증한 macOS 환경에서는 임시 `--no-skills` 프로필의 session이 0건, 설치된 skill이 0건이었고, 일회성 `-p` 실행 전후 sticky 기본 프로필은 바뀌지 않았다. 임시 프로필은 확인 후 삭제했다.

이 검증은 **Hermes 상태가 분리됐다는 증거**다. 두 프로필에서 같은 문서 파일을 읽을 수 있는지는 별도 문제이며, 읽을 수 있다고 해서 프로필 구현이 실패한 것이 아니다.

## 5. 충분히 확인한 뒤에만 기본 프로필을 바꾼다

```bash
hermes profile use work-agent
hermes profile list
```

`profile use`는 이후 프로필을 생략한 명령의 sticky 기본값을 바꾼다.[2] 업무가 끝났다면 명시적으로 되돌린다.

```bash
hermes profile use default
```

터미널 창마다 다른 역할을 동시에 쓸 때는 sticky 전환보다 `hermes -p <프로필> ...`를 계속 쓰는 편이 실수를 줄인다. 명령을 실행하기 전에 prompt나 `profile list`에서 대상 프로필을 확인한다.

## 6. 게이트웨이도 프로필별로 검증한다

Telegram이나 Discord 봇을 두 역할로 나누려면 봇 credential, allowlist와 게이트웨이 서비스도 각 프로필에서 구성한다.[3]

```bash
hermes -p work-agent gateway setup
hermes -p work-agent gateway
```

포그라운드에서 의도한 업무용 채널만 연결되는지 확인한 뒤 상주 서비스를 설치한다.

```bash
hermes -p work-agent gateway install
hermes -p work-agent gateway status --deep --full
```

프로필별 게이트웨이는 독립적인 서비스 이름, PID, 로그와 상태 파일을 사용한다.[3] 기본 프로필의 gateway가 실행 중이라는 사실은 `work-agent` gateway의 성공을 뜻하지 않는다. 각 프로필에서 상태와 실제 메시지 왕복을 따로 확인한다.

## 프로필이 막지 못하는 접근

Hermes 프로필은 애플리케이션 상태의 소유권을 나누지만 프로세스 권한을 낮추지 않는다. v0.20.1 구현도 호스트 subprocess가 일반 CLI credential을 사용할 수 있도록 기본적으로 실제 사용자 `HOME`을 유지한다.[5]

따라서 같은 OS 사용자로 실행하면 다음 자원은 여전히 공유될 수 있다.

- 사용자가 읽을 수 있는 개인·회사 파일
- Git credential helper와 `gh` 로그인
- SSH agent와 키 접근
- 브라우저 로그인 상태
- 같은 Docker daemon과 로컬 네트워크
- 프로필 밖에 둔 shared skill 디렉터리

`HERMES_WRITE_SAFE_ROOT`는 `write_file`과 `patch`의 쓰기 범위를 제한하지만, 같은 권한의 `terminal` 명령까지 sandbox하지는 않는다.[4] 이를 파일 읽기·실행의 완전한 보안 경계로 설명해서는 안 된다.

## 필요한 격리 수준을 고른다

| 위험 | 권장 경계 | 이유 |
| --- | --- | --- |
| 개인 취향과 업무 대화가 섞임 | Hermes 프로필 | memory·session·config 분리 |
| 업무 저장소 밖 쓰기 방지 | write safe root와 좁은 workdir | 실수 범위 축소 |
| 개인 파일 읽기 자체를 차단 | 별도 OS 사용자 | 파일 권한 경계 |
| 호스트 명령·credential 차단 | Docker·원격 backend | 실행 환경과 secret 전달 제한 |
| 회사 정보의 개인 장비 유출 방지 | 회사 승인 기기·계정·네트워크 | 조직 경계 유지 |
| 최고 수준 분리 | 별도 기기 또는 VM | OS·credential·프로세스까지 분리 |

컨테이너를 사용해도 host directory와 환경 변수를 mount하면 그 범위는 다시 노출된다. 필요한 workspace만 연결하고 provider·GitHub secret은 작업에 필요한 최소값만 전달한다.[4]

## 자주 막히는 지점

| 증상 | 먼저 확인 | 처리 |
| --- | --- | --- |
| 새 프로필에서 모델이 없음 | `hermes -p work-agent status` | 해당 프로필에서 `setup` 또는 `model` 실행 |
| 개인 memory가 새 프로필에 보임 | clone 사용 여부 | `MEMORY.md`·`USER.md`와 `.env` 감사, 필요하면 fresh 생성 |
| 명령이 엉뚱한 프로필에서 실행됨 | `profile list`, `-p` 위치 | 전역 `-p`를 `hermes` 바로 뒤에 둠 |
| 기본 gateway만 응답함 | 프로필별 `gateway status` | 대상 프로필에서 setup·포그라운드 확인 |
| 업무 프로필이 개인 파일을 읽음 | OS 사용자와 terminal backend | 프로필이 아니라 OS·컨테이너 경계 추가 |
| `gh`가 개인 계정으로 인증됨 | 호스트 credential helper | 별도 OS 계정·credential store 또는 격리 backend 사용 |

## 삭제하기 전에 백업 범위를 확인한다

더 이상 쓰지 않는 프로필은 먼저 내용을 검토하고 필요한 비밀이 없는 portable archive만 만든다.

```bash
hermes profile export work-agent -o work-agent.tar.gz
hermes profile delete work-agent
```

v0.20.1 export는 `.env`·`auth.json`을 제외하고 text의 secret pattern을 redact한다. Default profile export는 DB·로그도 거르지만, named profile archive에는 session DB·로그 같은 다른 상태가 포함될 수 있다.[5] Archive를 공유하기 전 파일 목록과 내용에서 대화, 내부 경로, memory와 업무 문서를 직접 확인한다. `delete`는 해당 프로필의 로컬 상태와 gateway 서비스를 제거할 수 있으므로 이름을 다시 읽고 승인한다.[2]

## 분리가 끝났다면

다음 네 항목을 확인하면 프로필 수준의 분리는 끝났다.

1. `hermes profile list`에 의도한 프로필이 있고 현재 선택을 안다.
2. `-p`를 붙인 `status`, `sessions stats`, `skills list`가 서로 다른 상태를 보여 준다.
3. 메시징을 쓴다면 프로필별 gateway에서 각자의 봇과 allowlist를 검증했다.
4. 민감한 파일과 host credential에는 profile 밖의 OS·컨테이너·기기 경계가 있다.

다음 편에서는 분리된 프로필 안에서 어떤 정보는 memory, 어떤 절차는 skill, 어떤 과거 맥락은 session에 남겨야 하는지 판단 기준을 정리한다.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/user-guide/profiles — Profiles: Running Multiple Agents

[2] https://hermes-agent.nousresearch.com/docs/reference/profile-commands — Profile Commands

[3] https://hermes-agent.nousresearch.com/docs/user-guide/multi-profile-gateways — Multi-Profile Gateways

[4] https://hermes-agent.nousresearch.com/docs/user-guide/security — Security

[5] https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/profiles.py — Hermes profile implementation

[6] https://hermes-agent.nousresearch.com/docs/reference/cli-commands — Hermes Agent CLI Commands
