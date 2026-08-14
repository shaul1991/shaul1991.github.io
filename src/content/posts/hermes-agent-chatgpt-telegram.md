---
title: 'Hermes Agent 실전 가이드 4: ChatGPT OAuth와 Telegram 연동'
description: ChatGPT 계정을 openai-codex OAuth로 인증하고 Telegram 봇, 허용 사용자, 게이트웨이를 연결해 원격 대화를 검증한다.
publishedAt: 2026-08-14
updatedAt: 2026-08-14
tags: [Hermes, ChatGPT, Telegram]
featured: false
articleType: guide
series: Hermes Agent 실전 가이드
seriesOrder: 4
editor: 한결
editorReview: 2026-08-14-hermes-agent-series-part-3-4
---

Hermes Agent에서 “ChatGPT를 Telegram에 연결한다”는 말에는 서로 다른 두 연결이 들어 있다. **ChatGPT 계정 OAuth는 답을 생성할 모델 provider를 인증하고, Telegram 봇은 요청과 결과가 오가는 사용자 인터페이스가 된다.** 둘 사이에서 세션과 도구 실행을 관리하는 것은 Hermes 게이트웨이다.

```text
Telegram 사용자
      │ 메시지
      ▼
Telegram 봇 ── 허용 사용자 검사
      │
      ▼
Hermes Gateway ── 세션 · 도구 · 승인 · 응답 전달
      │
      ▼
openai-codex provider ── ChatGPT 계정 OAuth
      │
      ▼
Codex 모델 응답
```

이 연결은 `chatgpt.com`의 기존 대화를 Telegram으로 옮기거나 ChatGPT 앱을 원격 조종하는 기능이 아니다. Hermes가 지원하는 `openai-codex` provider에 ChatGPT 계정으로 기기 코드 로그인을 하고, 그 provider가 제공하는 Codex 모델을 Hermes의 모델로 사용하는 구조다.[1] 명령은 2026년 8월 14일의 Hermes Agent v0.20.1 CLI와 공식 Telegram·CLI 문서를 교차 확인했으며, 계정마다 다른 credential과 사용자 ID는 예시에 사용하지 않는다.[3][5]

## 핵심

다음 항목은 위에서 아래로 확인한다. 앞 단계가 실패하면 Telegram 설정을 더 바꾸지 말고 그 층부터 해결한다.

| 연결 층 | 확인 명령·작업 | 통과 기준 |
| --- | --- | --- |
| Hermes 설치 | `hermes --version` | 로컬 CLI가 실행된다 |
| OpenAI 인증 | `hermes auth status openai-codex` | 사용할 OAuth credential이 인식된다 |
| 모델 선택 | `hermes status`와 로컬 한 줄 질문 | 활성 provider가 `openai-codex`이고 응답한다 |
| Telegram 비밀 값 | `hermes gateway setup` | 봇 토큰과 허용 사용자 ID가 저장된다 |
| 포그라운드 전달 | `hermes gateway run` 후 봇에 메시지 전송 | 메시지를 받고 같은 대화로 답한다 |
| 선택 항목: 상주 | `hermes gateway status --deep` | 게이트웨이가 서비스로 실행 중이다 |

중요한 순서는 **로컬 모델 응답 → Telegram 포그라운드 응답 → 백그라운드 상주**다. 처음부터 서비스를 설치하면 OAuth 오류, 봇 토큰 오류와 서비스 환경 문제를 한꺼번에 보게 된다.

## 시작 전에 알아둘 세 가지

### ChatGPT OAuth와 OpenAI API 키는 같은 인증이 아니다

Hermes는 `OpenAI Codex — ChatGPT plan OAuth`와 `OpenAI API (direct)`를 별도 provider로 구분한다. 이 글은 API 키가 아니라 `openai-codex` 기기 코드 OAuth를 사용한다.[1] 공식 문서는 대상 요금제와 Codex 한도 차감 방식을 아직 완전히 설명하지 않으므로, 모든 요금제나 무제한 사용을 가정하지 말고 자신의 계정 정책을 확인한다.[1]

### Telegram 봇은 별도 계정이 아니라 토큰으로 제어되는 프로그램이다

Telegram의 `@BotFather`가 봇과 API 토큰을 발급한다. 토큰을 가진 사람은 봇을 제어할 수 있으므로 공개 사용자명과 달리 비밀번호처럼 취급한다.[3][8]

### 게이트웨이는 실행 중인 기기에서만 응답한다

Hermes와 파일 도구는 Telegram 앱이 아니라 게이트웨이가 실행되는 Mac, Windows PC 또는 Linux 서버에서 동작한다.[4] 그 기기가 꺼지거나 절전하면 봇도 응답하지 않는다.

## 1. 기존 Hermes 설치를 먼저 확인한다

macOS 또는 Windows 설치 편의 기본 검증을 끝낸 환경에서 시작한다.

```bash
hermes --version
hermes doctor
```

PowerShell에서도 같은 두 명령을 그대로 사용한다. `doctor`에 아직 쓰지 않는 선택 도구 경고가 있을 수 있지만, Hermes 실행 환경이나 모델 설정 자체를 막는 오류는 먼저 해결한다. 이미 다른 provider를 쓰고 있어도 `openai-codex` credential을 추가할 수 있다. 중요한 자동화가 실행 중이라면 기본 모델 변경 영향을 확인하고, 필요하면 별도 Hermes 프로필에서 먼저 시험한다.[7]

## 2. ChatGPT 계정을 OAuth로 인증한다

터미널에서 다음 명령을 실행한다.

```bash
hermes auth add openai-codex --type oauth
```

Hermes는 브라우저에서 열 URL과 짧은 기기 코드를 보여주고 로그인이 끝날 때까지 기다린다. 표시된 공식 로그인 페이지에서 사용할 ChatGPT 계정으로 로그인하며 Codex CLI는 필요 없다.[1] 기기 코드와 로그인 화면은 공개하지 말고, 터미널이 보여준 도메인이 예상한 OpenAI 로그인 경로인지 확인한다.

로그인이 끝나면 credential 상태를 확인한다.

```bash
hermes auth status openai-codex
```

이 명령이 OAuth credential을 인식하면 인증 저장 단계가 끝난 것이다. Hermes는 토큰을 활성 프로필의 인증 저장소에 보관하고 필요할 때 갱신한다.[1] 인증 파일의 원문을 열어 토큰을 복사하거나 다른 기기로 수동 동기화하지 않는다.

## 3. `openai-codex`를 실제 모델 provider로 선택한다

credential을 추가한 것과 현재 기본 모델을 바꾼 것은 별도 단계다. 모델 설정 마법사를 연다.

```bash
hermes model
```

목록에서 **ChatGPT or Codex Subscription**과 사용할 수 있는 Codex 모델을 고른 뒤 실제 응답을 확인한다.[1] 모델 목록은 계정과 Hermes 버전에 따라 달라질 수 있으므로 특정 모델 ID를 고정하지 않는다.

```bash
hermes status
hermes chat -q "답변 첫 줄에 CODEX_CONNECTION_OK라고만 써 줘."
```

`hermes status`에서 활성 provider가 `openai-codex`인지 보고 두 번째 명령의 응답을 확인한다. 여기서 실패한다면 Telegram으로 넘어가지 않는다. Telegram은 이미 실패하는 모델 호출을 고쳐 주지 않는다.

| 증상 | 확인할 것 | 처리 |
| --- | --- | --- |
| 기기 코드가 나오지 않거나 계속 대기함 | 네트워크, CLI 버전, 브라우저 승인 | `hermes update --check`와 승인 상태 확인 후 OAuth 다시 시작 |
| credential은 있으나 다른 provider로 답함 | `hermes status` | `hermes model`에서 기본 provider와 모델 다시 선택 |
| `401`, `invalid_grant`, 재인증 안내 | 토큰 취소·만료 여부 | `hermes auth add openai-codex --type oauth`로 새 로그인 |
| 요금제·사용 한도 오류 | 계정의 Codex 사용 가능 상태 | Hermes 설정이 아니라 계정 정책과 한도 확인 |

인증 저장, 모델 선택과 추론 요청 허용은 각각 다른 확인 지점이다.

## 4. BotFather에서 Telegram 봇을 만든다

Telegram에서 공식 계정 `@BotFather`를 연다. 비슷한 이름의 계정을 검색 결과만 보고 선택하지 말고 공식 링크와 인증 표시를 확인한다.[8]

1. `/newbot`을 보낸다.
2. 사용자에게 보일 표시 이름을 정한다.
3. 고유하며 `bot`으로 끝나는 사용자명을 정한다.
4. BotFather가 발급한 API 토큰을 안전한 임시 위치에 보관한다.

Hermes의 접근 제한에는 `@username`이 아닌 Telegram **숫자 사용자 ID**가 필요하다. 공식 안내는 `@userinfobot`에서 확인하는 방법을 제시한다.[3] 이는 제3자 봇이므로 사용 가능 여부를 판단한 뒤 필요한 최소 메시지만 보낸다.

## 5. 토큰과 허용 사용자를 설정 마법사에 입력한다

토큰을 명령줄 인자로 붙이면 셸 기록에 남을 수 있다. 다음 대화형 설정을 사용한다.

```bash
hermes gateway setup
```

목록에서 Telegram을 선택한다. 이 글은 앞 단계에서 만든 BotFather 봇의 토큰을 직접 입력하는 수동 설정을 기준으로 하며, 생성 방식 선택 화면이 나오면 수동 설정을 선택한다.[3]

| 입력 | 넣을 값 | 보안 기준 |
| --- | --- | --- |
| Telegram bot token | BotFather가 방금 발급한 비밀 토큰 | 채팅·스크린샷·Git에 남기지 않음 |
| Allowed user IDs | 자신의 숫자 사용자 ID | 비워 두지 않음 |
| Home channel | 개인 DM의 숫자 ID | cron·알림을 받을 때만 지정 |

**Allowed user IDs를 빈 값으로 두면 봇을 찾은 다른 사람도 사용할 수 있는 열린 구성이 될 수 있다.** 공식 설정 마법사도 이 위험을 경고한다.[3][6] 개인용 봇은 자신의 ID부터 허용한다. Home channel은 cron 결과나 알림의 기본 전달 위치이며 일반 대화에는 필수가 아니다.[4] 마법사는 이 값들을 활성 프로필에 저장하므로 확인을 위해 `.env`나 인증 파일 전체를 출력하지 않는다.[2][3]

## 6. 포그라운드에서 첫 메시지를 검증한다

백그라운드 서비스를 설치하기 전에 로그가 보이는 터미널에서 게이트웨이를 실행한다.

```bash
hermes gateway run
```

초기화 로그에서 Telegram adapter가 시작되고 인증·설정 오류가 없는지 확인한다. 그 상태로 Telegram에서 자신이 만든 봇과 1:1 대화를 열어 다음처럼 보낸다.

> 답변 첫 줄에 `TELEGRAM_HERMES_OK`라고 쓰고, 지금 메시지를 받은 채널이 Telegram이라고 알려 줘.

같은 Telegram 대화로 답이 오면 다음 경로가 한 번 끝까지 동작한 것이다.

```text
허용된 Telegram 사용자
→ Telegram 봇
→ Hermes Gateway
→ openai-codex 모델
→ Hermes Gateway
→ 같은 Telegram 대화
```

이 응답을 받기 전에는 게이트웨이 서비스를 설치하지 않는다. 실패하면 포그라운드 로그를 보면서 다음 세 층을 분리한다.

| 로컬 CLI | 게이트웨이 로그 | Telegram | 가능성이 큰 원인 |
| --- | --- | --- | --- |
| 실패 | 확인 전 | 무응답 | OAuth, provider 또는 모델 설정 |
| 성공 | 토큰·연결 오류 | 무응답 | BotFather 토큰 또는 네트워크 |
| 성공 | 연결됨 | 허용 거부 | 숫자 사용자 ID allowlist |
| 성공 | 메시지 수신 | 생성 실패 | 게이트웨이 프로필의 모델·credential |
| 성공 | 답변 전송 기록 | 앱에 안 보임 | 잘못된 chat, Telegram 전달 문제 |

별도 터미널에서 최근 게이트웨이 로그를 볼 수도 있다.

```bash
hermes logs gateway -n 100
```

로그에는 사용자명, 채팅 정보와 메시지 일부가 포함될 수 있다. 지원 요청에 전체 로그를 첨부하지 말고 문제 시각 주변의 필요한 줄만 골라 ID, 토큰, 내부 경로와 대화 내용을 가린다.

## 7. 검증 후에만 백그라운드로 상주시킨다

포그라운드 테스트가 성공하면 `Ctrl+C`로 종료한 뒤 운영체제의 사용자 서비스로 설치한다.

```bash
hermes gateway install --start-now --start-on-login
hermes gateway status --deep --full
```

같은 명령이라도 운영체제별 감독 방식은 다르다.[4][5]

| 실행 환경 | 로그인 시작 방식 |
| --- | --- |
| macOS | 사용자 LaunchAgent와 launchd |
| Windows 네이티브 | Scheduled Task, 등록 불가 시 Startup 폴더 fallback |
| Linux | 사용자 systemd 서비스 |

`status --deep --full`에서 서비스 정의와 실행 프로세스를 확인한 뒤 Telegram 메시지를 한 번 더 보낸다. 포그라운드에서는 되는데 서비스에서만 실패한다면 모델이나 봇을 다시 만들기보다 서비스가 읽는 프로필, 환경과 로그를 먼저 확인한다.

```bash
hermes logs gateway -n 100
```

노트북 덮개를 닫아 절전 상태가 되면 사용자 서비스가 등록돼 있어도 네트워크 요청을 처리할 수 없다. 로그인 시작은 “기기가 동작할 때 자동으로 실행”한다는 뜻이지, 꺼진 기기를 24시간 서버로 바꾸는 기능은 아니다.

## 그룹 채팅은 개인 DM 확인 뒤에 연다

Privacy Mode가 기본으로 켜진 Telegram 봇은 그룹의 일반 대화가 아니라 slash command, 봇 메시지에 대한 답장과 일부 서비스 메시지만 받는다.[3] 일반 메시지가 필요하면 BotFather에서 Privacy Mode를 끄거나 봇을 관리자로 설정하고, 변경 후 봇을 제거했다가 다시 추가한다.[3] 메시지 수신 범위와 응답 범위는 별개이므로 다음도 제한한다.

- 허용할 chat과 사용자를 명시한다.
- 직접 멘션이나 봇 메시지에 대한 답장일 때만 반응하게 한다.
- 그룹 기록을 문맥으로 쓰는 기능은 보존 범위를 확인한 뒤 켠다.

## 토큰이 유출됐거나 연결을 중단할 때

BotFather 토큰이 로그, Git, 화면 공유나 채팅에 노출됐다면 BotFather에서 기존 토큰을 폐기하고 새 토큰을 발급한 뒤 `hermes gateway setup`으로 교체한다.[3][8] 게이트웨이 상주만 중단하려면 다음 명령을 사용한다.

```bash
hermes gateway stop
hermes gateway uninstall
```

`uninstall`은 서비스 등록을 제거하는 명령이지 BotFather의 봇이나 OAuth 계정을 삭제하는 명령은 아니다. Telegram 봇 폐기, ChatGPT OAuth 해제와 Hermes 로컬 credential 정리는 각 인증 주체에서 별도로 수행한다.

## 외부에서 명령할 수 있다는 의미

Telegram 연결 뒤에는 휴대전화에서 보낸 문장이 게이트웨이 기기의 파일·터미널·브라우저 도구를 실행할 수 있다.[6] 처음에는 다음 경계를 유지한다.

1. Telegram 허용 사용자를 자신의 숫자 ID로 제한한다.
2. 위험 명령 승인 정책을 유지하고 상주 프로세스에 `--yolo`를 적용하지 않는다.
3. 봇 토큰과 OAuth 저장소를 Git이나 클라우드 동기화 폴더에 복사하지 않는다.
4. 게이트웨이의 작업 폴더와 도구를 필요한 범위로 좁힌다.
5. 개인용과 업무용 credential·세션은 프로필과 OS·컨테이너 경계로 나눈다.[7]

프로필은 설정과 상태를 분리하지만 파일 시스템 sandbox는 아니다.[6][7] 실제 격리에는 별도 OS 계정, Docker·원격 backend나 별도 기기가 필요하다.

## 연결이 끝났다면

상단 표에서 로컬 `openai-codex` 응답과 Telegram 포그라운드 응답까지 직접 확인했다면 모델 인증과 메시지 전달이 분리된 상태로 연결됐다. 항상 켜 둘 때만 서비스 항목을 추가한다. 다음 편에서는 개인용·업무용 설정, 메모리, 스킬, 세션과 credential을 프로필로 나누고 프로필만으로 막을 수 없는 파일 접근 경계를 정리한다.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/integrations/providers — AI Providers

[2] https://hermes-agent.nousresearch.com/docs/getting-started/quickstart — Hermes Agent Quickstart

[3] https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram — Telegram Setup

[4] https://hermes-agent.nousresearch.com/docs/user-guide/messaging — Messaging Gateway

[5] https://hermes-agent.nousresearch.com/docs/reference/cli-commands — Hermes Agent CLI Commands

[6] https://hermes-agent.nousresearch.com/docs/user-guide/security — Security

[7] https://hermes-agent.nousresearch.com/docs/user-guide/profiles — Profiles

[8] https://core.telegram.org/bots/features#botfather — Telegram BotFather
