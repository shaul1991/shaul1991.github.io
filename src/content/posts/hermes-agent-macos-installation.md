---
title: 'Hermes Agent 실전 가이드 2: macOS에 설치하고 첫 작업까지'
description: Hermes Agent를 맥에 설치한 뒤 모델, 파일 도구, launchd 게이트웨이가 실제로 동작하는지 확인한다.
publishedAt: 2026-08-14
updatedAt: 2026-08-14
tags: [Hermes, macOS, AI Agent]
featured: false
articleType: guide
series: Hermes Agent 실전 가이드
seriesOrder: 2
editor: 한결
editorReview: 2026-08-14-hermes-agent-series-part-1-2
---

설치 스크립트가 마지막 줄까지 실행됐다고 해서 Hermes Agent를 쓸 준비가 끝난 것은 아니다. 터미널에서 명령을 찾을 수 있어야 하고, 모델이 응답해야 하며, 허용한 도구가 실제 파일을 다룰 수 있어야 한다. 메신저나 예약 작업을 쓸 계획이라면 백그라운드 게이트웨이까지 살아 있어야 한다.

Hermes Agent는 모델에 파일·터미널·브라우저 같은 도구를 연결하는 로컬 에이전트다. 이 글에서는 macOS에 Hermes를 설치한 뒤, 격리된 연습 폴더에서 첫 작업을 실행하고, 필요한 경우 launchd 서비스로 상주시킬 때까지 다룬다. 텔레그램·디스코드 연결과 ChatGPT 구독 인증은 각각 별도 글에서 더 자세히 다룰 예정이지만, 이 글만 따라 해도 로컬 CLI가 정상인지 판단할 수 있다.

명령과 출력 형태는 2026년 8월 14일의 공식 문서와 Apple Silicon macOS에서 실행 중인 Hermes Agent v0.20.1 git 설치본을 교차 확인했다.[1][2] 이후 버전에서 화면 문구는 달라질 수 있으므로 특정 버전 번호가 아니라 아래의 동작 결과를 완료 기준으로 삼는다.

## 핵심

기본 설치는 아래 표의 앞 다섯 가지가 관찰될 때 끝난다. 메신저나 예약 작업을 위해 상주 운영을 선택했다면 마지막 게이트웨이 항목까지 확인한다.

| 단계 | 확인할 것 | 통과 기준 |
| --- | --- | --- |
| 실행 경로 | `command -v hermes` | 설치된 Hermes 실행 경로가 출력된다 |
| 실행 환경 | `hermes --version` | 버전과 설치 방식, Python 버전이 출력된다 |
| 모델 연결 | 첫 대화 | 단순한 질문에 정상 응답한다 |
| 도구 연결 | 연습 파일 생성 후 재확인 | 에이전트의 말이 아니라 실제 파일 내용이 확인된다 |
| 진단 | `hermes doctor` | 지금 필요한 기본 기능에 차단 오류가 없다 |
| 선택 항목: 상주 | `hermes gateway status` | launchd가 게이트웨이 프로세스를 감독한다 |

처음부터 텔레그램, cron, 여러 모델과 스킬을 한꺼번에 붙이지 않는 게 좋다. 공식 빠른 시작 문서도 일반 대화가 정상 동작한 뒤 게이트웨이와 자동화를 추가하라고 안내한다.[2] 기본 대화가 실패하는 상태에서 기능을 더 얹으면 설치 문제와 연동 문제를 구분하기 어려워진다.

## 시작 전에 Apple Silicon인지 확인한다

현재 공식 지원 표에서 **Apple Silicon macOS는 Tier 1**이지만 Intel macOS는 지원 대상이 아니다.[6] 설치 명령부터 실행하기 전에 ` → 이 Mac에 관하여`에서 **칩** 항목이 Apple Silicon 계열인지 확인한다.

터미널에서도 확인할 수 있다.

```bash
uname -m
```

기본 터미널에서 `arm64`가 나오면 Apple Silicon 환경이다. `x86_64`가 나오면 Intel Mac일 수도 있고 Apple Silicon에서 터미널이 Rosetta로 실행 중일 수도 있으므로, 시스템 정보의 **칩** 항목으로 다시 확인한다. Intel Mac이라면 이 글의 설치 절차를 지원되는 방법으로 간주해 진행하지 않는다.

## Desktop과 CLI 설치 중 무엇을 고를까

공식 문서는 macOS와 Windows에서 Hermes Desktop 설치 프로그램을 권장한다. Desktop 설치 프로그램은 데스크톱 앱과 명령줄 도구를 함께 준비한다.[1] 터미널만 필요한 사용자를 위해 셸 설치 스크립트도 제공한다.

| 방식 | 적합한 경우 | 설치 방법 |
| --- | --- | --- |
| Hermes Desktop | GUI와 CLI를 함께 쓰고 싶다 | 공식 사이트에서 macOS 설치 프로그램 다운로드 |
| CLI 전용 | 서버형 운영, 터미널 중심 사용, 설치 과정을 직접 확인하고 싶다 | 공식 `install.sh` 실행 |

이 글은 설치 위치와 검증 과정을 직접 확인하기 쉬운 CLI 전용 방식을 사용한다. Desktop을 설치했더라도 이후의 `hermes setup`, `hermes doctor`, `hermes gateway` 명령은 같은 목적으로 사용할 수 있다. 익숙하다는 이유로 `brew install`이나 `pip install`을 대신 사용하면 안 된다. 현재 공식 지원 표는 Homebrew와 PyPI 배포 방식을 지원하지 않는다.[6]

## 1. Git만 먼저 확인한다

Apple Silicon macOS용 셸 설치 프로그램이 미리 요구하는 것은 Git이다. Python, Node.js, `uv`, `ripgrep`, `ffmpeg`는 설치 프로그램이 필요한 버전을 감지해 준비한다. 현재 공식 문서 기준으로 Python 3.11과 Node.js 22도 이 과정에 포함된다.[1]

```bash
git --version
```

버전이 출력되면 다음 단계로 간다. 명령을 찾지 못하면 macOS의 Command Line Tools 설치 창을 연 뒤 다시 확인한다.

```bash
xcode-select --install
```

여기서 Python과 Node.js를 Homebrew로 먼저 하나씩 설치할 필요는 없다. 이미 설치돼 있어도 괜찮지만, Hermes가 사용할 실행 환경은 설치 프로그램이 관리하도록 두는 편이 충돌을 줄인다.

## 2. 일반 사용자 권한으로 설치한다

공식 CLI 설치 명령은 다음과 같다.[1]

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

인터넷에서 받은 스크립트를 바로 셸에 넘기는 방식이 불편하다면 파일로 받아 먼저 읽어볼 수 있다.

```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh \
  -o /tmp/hermes-install.sh
less /tmp/hermes-install.sh
bash /tmp/hermes-install.sh
```

개인 맥북에서는 `sudo`를 붙이지 않는다. 일반 사용자 설치 기준으로 소스는 `~/.hermes/hermes-agent/`, 실행 명령은 `~/.local/bin/hermes`, 설정과 세션 데이터는 `~/.hermes/` 아래에 놓인다.[1] `sudo`로 실행하면 설치 주체와 설정 소유자가 달라져 이후에 권한 문제를 만들기 쉽다.

설치가 끝나면 새 터미널을 열거나 zsh 설정을 다시 읽는다.

```bash
source ~/.zshrc
command -v hermes
hermes --version
```

정상이라면 `command -v hermes`가 실행 경로를 보여주고, `hermes --version`은 Hermes 버전과 설치 방식, 사용 중인 Python 버전을 출력한다. 버전 번호 자체는 업데이트에 따라 바뀌므로 특정 숫자와 일치할 필요는 없다.

## 3. 모델과 기본 도구를 설정한다

Hermes는 에이전트 실행 계층이고, 답을 생성할 모델은 별도로 선택한다. 처음에는 전체 설정 마법사를 실행하는 편이 쉽다.

```bash
hermes setup
```

현재 설정 마법사는 빠른 OAuth 설정, 전체 설정, 최소 도구만 켜는 Blank Slate 같은 시작 방식을 제공한다.[2] 설치 확인이 목적이라면 사용 가능한 모델 하나와 파일·터미널 도구만 준비해도 충분하다. 모델은 나중에 언제든 다시 고를 수 있다.

```bash
hermes model
```

정상 설정과 비밀 값은 서로 다른 파일에 저장된다. 모델명이나 도구 설정은 `config.yaml`, API 키와 토큰은 `.env`, OAuth 자격증명은 별도 인증 저장소로 간다.[2] 경로는 파일을 직접 찾기보다 CLI로 확인한다.

```bash
hermes config path
hermes config env-path
```

`.env`나 인증 파일의 내용을 블로그, 이슈, 채팅창에 붙여넣으면 안 된다. `hermes status`와 `hermes doctor`도 로컬 경로, provider, 프로젝트 이름 같은 운영 식별자를 보여줄 수 있다. 문제를 공유할 때는 전체 출력을 복사하지 말고 필요한 줄만 골라 경로와 식별자를 가린다.

## 4. 대답보다 실제 작업 결과를 확인한다

첫 검증을 기존 프로젝트나 홈 디렉터리에서 하지 않는 편이 안전하다. 연습 폴더를 하나 만든다.

```bash
mkdir -p ~/hermes-playground
cd ~/hermes-playground
hermes
```

Hermes가 열리면 다음처럼 범위와 완료 조건이 분명한 작업을 요청한다.

> 현재 폴더에 `hello-hermes.txt`를 만들고, 파일 안에 `Hermes file tool works.`를 한 줄로 적어줘. 저장한 뒤 파일을 다시 읽어서 실제 내용을 보여줘. 다른 폴더는 수정하지 마.

이 요청은 세 가지를 한 번에 확인한다. 모델이 지시를 이해하는지, 파일 도구를 호출하는지, 저장한 결과를 다시 검증하는지다. Hermes가 "완료했다"고 답한 것만으로 통과시키지 않고 터미널에서도 확인한다.

```bash
cat ~/hermes-playground/hello-hermes.txt
```

요청한 한 줄이 보이면 기본 대화와 파일 도구가 함께 동작한다. 실행 승인 창이 나타나면 명령과 대상 경로가 `~/hermes-playground` 안인지 읽고 승인한다. 설치 확인을 빨리 끝내려고 `--yolo`로 승인 절차를 꺼버리는 방식은 권하지 않는다. 처음부터 어떤 동작에 확인이 필요한지 보는 것도 설치 검증의 일부다.

## 5. 진단 명령으로 상태를 한 번 더 확인한다

첫 작업이 성공해도 진단 결과를 남겨두는 게 좋다.

```bash
hermes doctor
hermes status
```

두 명령의 역할은 다르다.

| 명령 | 확인하는 내용 |
| --- | --- |
| `hermes doctor` | 의존성, 설정 누락, 실행 환경 문제와 수정 방법 |
| `hermes status` | 현재 provider·model, 인증 상태, 설치된 구성 요소 |

`doctor`가 경고를 보여준다고 무조건 설치 실패는 아니다. 아직 쓰지 않는 음성·브라우저 도구의 선택 의존성이 없을 수도 있다. 지금 필요한 기능이 무엇인지 기준으로 읽는다. 반대로 모델 인증이나 기본 실행 환경에 오류가 있다면 메신저 연동으로 넘어가기 전에 고쳐야 한다.

## 6. 항상 켜둘 때만 게이트웨이를 설치한다

터미널에서 필요할 때 `hermes`를 실행하는 사용자는 게이트웨이가 없어도 된다. 텔레그램·디스코드·슬랙에서 메시지를 받거나, cron 작업 결과를 보내거나, 로그인 후 계속 대기하는 에이전트가 필요할 때 게이트웨이를 상주시킨다.

먼저 포그라운드에서 실행해 오류가 없는지 본다.

```bash
hermes gateway run
```

정상 기동을 확인했으면 `Ctrl+C`로 종료하고 launchd에 등록한다.

```bash
hermes gateway install --start-now --start-on-login
hermes gateway status
```

macOS에서는 사용자 LaunchAgent가 생성된다. 기본 프로필의 서비스 정의는 `~/Library/LaunchAgents/ai.hermes.gateway.plist`에 놓이고, launchd가 로그인 시 시작과 프로세스 재실행을 맡는다.[4] 정상 상태에서는 다음과 비슷한 요약이 나온다.

```text
Launchd plist: ~/Library/LaunchAgents/ai.hermes.gateway.plist
✓ Service definition matches the current Hermes install
✓ Gateway is supervised by launchd (PID ...)
```

이것은 시스템 전체 데몬이 아니라 로그인한 사용자 계정의 서비스다. 맥이 잠자기 상태에 들어가 네트워크가 멈추면 텔레그램 봇도 그 시간에는 응답할 수 없다. 24시간 개인 비서를 목표로 한다면 노트북의 전원·잠자기 정책이나 별도의 상시 실행 기기까지 함께 고려해야 한다.

launchd에는 셸에서 쓰던 Homebrew 경로가 자동으로 모두 전달되지 않는다. Hermes는 `gateway install`을 실행할 때 현재 PATH를 서비스 정의에 담는다. 게이트웨이를 등록한 뒤 Node.js나 `ffmpeg` 같은 도구를 추가했다면 설치 명령을 다시 실행해 PATH를 갱신한다.[3]

```bash
hermes gateway install
hermes gateway start
```

## macOS 권한은 필요한 기능만 연다

기본 CLI 설치와 파일 작업을 확인하기 위해 접근성, 화면 기록, 전체 디스크 접근 권한을 미리 모두 허용할 필요는 없다. 화면을 읽고 마우스·키보드를 조작하는 Computer Use 기능을 켤 때는 터미널 또는 Hermes 앱에 접근성 및 화면 기록 권한이 필요하다.[5]

```bash
hermes computer-use doctor
```

이 명령으로 빠진 권한을 확인한 뒤 macOS의 `시스템 설정 → 개인정보 보호 및 보안`에서 필요한 항목만 허용한다. macOS 데이터에 접근하는 별도 기능은 각 기능 문서에서 요구하는 권한을 따로 확인한다. "Hermes를 설치했다"는 이유만으로 전체 디스크 접근 권한부터 열어두는 것은 범위를 필요 이상으로 넓힌다.

## 자주 막히는 지점

| 증상 | 먼저 확인할 것 | 처리 |
| --- | --- | --- |
| `hermes: command not found` | `command -v hermes` | 새 터미널을 열거나 `source ~/.zshrc` 실행 |
| 모델이 응답하지 않음 | `hermes status` | `hermes model`로 인증과 모델 다시 선택 |
| Python 버전 오류 | 설치 방식 | 표준 설치 프로그램을 다시 사용하고, 수동 설치라면 Python 3.11 이상 확인 |
| 게이트웨이만 도구를 못 찾음 | launchd의 PATH | `hermes gateway install` 재실행 후 시작 |
| 게이트웨이가 뜨지 않음 | `hermes gateway status` | `~/.hermes/logs/gateway.log` 확인 |
| 업데이트가 있는지 궁금함 | 설치 방식 자동 감지 | `hermes update --check`로 먼저 확인 |

표준 git 설치는 설치 레이아웃을 보고 업데이트 방식을 자동 감지한다.[1] `hermes update --check`로 변경 여부를 확인한 뒤 `hermes update`를 적용한다. 중요한 자동화와 스킬을 운영 중이라면 업데이트 전에 설정을 백업하고 변경 사항을 확인한다.

## 설치가 끝났다면

앞의 완료 기준 표에서 기본 다섯 항목을 통과했다면 macOS용 로컬 설치는 끝났다. 상주 운영을 선택한 경우에만 게이트웨이 항목까지 추가로 확인한다. 아직 텔레그램 봇 토큰이나 슬랙 앱을 붙이지 않았더라도 괜찮다. 먼저 로컬에서 한 번의 작업을 끝까지 수행할 수 있어야 이후의 메신저 문제를 모델·도구 문제와 분리해서 진단할 수 있다.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/getting-started/installation — Hermes Agent Installation

[2] https://hermes-agent.nousresearch.com/docs/getting-started/quickstart — Hermes Agent Quickstart

[3] https://hermes-agent.nousresearch.com/docs/reference/faq — Hermes Agent FAQ

[4] https://hermes-agent.nousresearch.com/docs/reference/cli-commands — Hermes Agent CLI Commands

[5] https://hermes-agent.nousresearch.com/docs/user-guide/features/computer-use — Hermes Agent Computer Use

[6] https://hermes-agent.nousresearch.com/docs/getting-started/platform-support — Hermes Agent Platform Support