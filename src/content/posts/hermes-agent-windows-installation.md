---
title: 'Hermes Agent 실전 가이드 3: Windows에 설치하고 첫 작업까지'
description: Windows 10·11에 Hermes Agent를 네이티브로 설치하고 모델, 파일 도구, 진단, 로그인 시 게이트웨이 시작을 확인한다.
publishedAt: 2026-08-14
updatedAt: 2026-08-14
tags: [Hermes, Windows, AI Agent]
featured: false
articleType: guide
series: Hermes Agent 실전 가이드
seriesOrder: 3
editor: 한결
editorReview: 2026-08-14-hermes-agent-series-part-3-4
---

Windows에서 Hermes Agent를 쓰기 위해 WSL부터 설치할 필요는 없다. 현재 공식 지원 표에서 Windows 10·11의 x86_64와 ARM64는 네이티브 `install.ps1` 설치가 지원되는 Tier 1 환경이다. WSL2도 Tier 1이지만 Linux 환경이 필요한 사용자를 위한 별도 선택지다.[1][2]

이 글은 **Windows Terminal 또는 PowerShell에서 실행하는 네이티브 설치**만 다룬다. 설치 경로, 파일 경로와 로그인 시 자동 시작도 모두 Windows 쪽에 생긴다. 대시보드의 내장 터미널처럼 POSIX PTY가 필요한 일부 기능을 제외하면 CLI, 메시징 게이트웨이, cron, 브라우저 도구와 MCP 등을 네이티브 Windows에서 사용할 수 있다.[3]

명령과 동작은 2026년 8월 14일의 공식 문서, CLI reference와 Hermes Agent v0.20.1 Windows 구현을 교차 확인했다.[3][6][7] 다만 이 원고는 실제 Windows 기기에서 실행 결과를 측정한 기록이 아니다. 따라서 화면 문구나 소요 시간을 보장하지 않으며, 아래 명령으로 **자신의 기기에서 관찰해야 할 결과**를 완료 기준으로 제시한다.

## 핵심

기본 설치는 다음 표의 앞 다섯 항목이 확인될 때 끝난다. 텔레그램이나 예약 작업을 위해 로그인 후 계속 대기시킬 때만 마지막 게이트웨이 항목까지 진행한다.

| 단계 | 확인 명령·작업 | 통과 기준 |
| --- | --- | --- |
| 실행 경로 | `Get-Command hermes` | 현재 사용자용 `hermes.exe` 경로가 출력된다 |
| 실행 환경 | `hermes --version` | Hermes 버전, 설치 방식과 Python 버전이 출력된다 |
| 모델 연결 | 짧은 첫 대화 | 선택한 provider가 정상 응답한다 |
| 도구 연결 | 연습 파일 생성 후 `Get-Content` | 에이전트의 보고가 아니라 실제 파일 내용이 일치한다 |
| 진단 | `hermes doctor` | 지금 사용할 기본 기능을 막는 오류가 없다 |
| 선택 항목: 상주 | `hermes gateway status --deep` | 실행 중인 게이트웨이와 로그인 시작 등록 상태가 확인된다 |

설치 직후부터 봇 토큰, cron과 여러 도구를 한꺼번에 설정하면 실패 원인을 가르기 어렵다. 먼저 로컬 CLI와 파일 작업을 끝까지 확인한 뒤 외부 채널을 붙이는 편이 안전하다.

## 네이티브 Windows와 WSL2 중 무엇을 고를까

두 방식 중 하나가 무조건 우월한 것은 아니다. **Windows 파일과 프로그램을 주로 다룬다면 네이티브 설치가 단순하고**, Linux 개발 환경과 POSIX 동작이 중요하다면 WSL2가 자연스럽다.

| 선택 | 적합한 경우 | 경로와 프로세스 |
| --- | --- | --- |
| 네이티브 Windows | PowerShell, Windows 앱·파일, 일반적인 CLI·게이트웨이 사용 | Windows 경로와 Windows 프로세스 사용 |
| WSL2 | Linux 개발 도구, POSIX PTY, Linux 파일 권한·스크립트가 중요함 | WSL 안의 Linux 경로와 Linux 프로세스 사용 |

네이티브와 WSL2 설치는 데이터 위치도 다르다. 네이티브 설치의 기본 데이터 루트는 `%LOCALAPPDATA%\hermes`, WSL2 설치는 Linux 홈의 `~/.hermes`다.[3] 같은 PC에 둘 다 설치하면 설정, 세션과 credential이 자동으로 하나가 되지 않는다. 이 글을 따라 하는 동안에는 PowerShell 프롬프트와 WSL 셸을 오가지 않는다.

## 1. 일반 사용자 PowerShell에서 설치한다

Windows Terminal에서 새 **PowerShell** 탭을 연다. 표준 CLI 설치 명령은 다음과 같다.[1]

```powershell
iex (irm https://hermes-agent.nousresearch.com/install.ps1)
```

관리자 PowerShell은 기본 설치에 필요하지 않다. 설치 프로그램은 필요한 Python 환경, Node.js, PortableGit과 보조 도구를 준비하고, Hermes 소스와 가상 환경을 현재 사용자의 `%LOCALAPPDATA%\hermes` 아래에 둔다. 설치가 끝나면 사용자 PATH에 명령 실행 경로를 추가한다.[1][3]

원격 스크립트를 바로 실행하기 전에 읽어보고 싶다면 임시 파일로 내려받아 확인할 수 있다.

```powershell
$installer = Invoke-RestMethod https://hermes-agent.nousresearch.com/install.ps1
$reviewCopy = Join-Path $env:TEMP 'hermes-install.ps1'
$installer | Set-Content $reviewCopy
Get-Content $reviewCopy
Invoke-Expression $installer
```

마지막 명령은 화면에서 검토한 것과 같은 `$installer` 문자열을 실행한다. 검토용 파일을 다시 내려받아 실행하지 않으므로 확인한 내용과 실행할 내용 사이에 별도의 다운로드가 끼지 않는다.

회사 PC에서 PowerShell 스크립트 실행이나 외부 다운로드가 정책으로 차단됐다면 실행 정책을 임의로 낮추지 않는다. Hermes Desktop 설치가 허용되는지 확인하거나 조직 관리자에게 승인된 설치 경로를 문의한다. 개인 PC에서도 출처가 Hermes 공식 도메인인지 확인하고, 검색 결과에서 찾은 제3자 설치 스크립트로 URL을 바꾸지 않는다.

설치 프로그램은 기본적으로 초기 설정 마법사까지 이어간다. 중간에 설정을 건너뛰었거나 나중에 다시 구성하려면 다음 명령을 사용한다.[1][4]

```powershell
hermes setup
```

여기서는 사용 가능한 모델 provider 하나와 기본 파일·터미널 도구만 설정하면 충분하다. ChatGPT 구독을 OAuth로 연결하는 과정은 다음 편에서 별도로 다룬다.

## 2. 새 터미널에서 PATH와 버전을 확인한다

설치가 끝난 뒤 **현재 PowerShell을 닫고 새 탭이나 창을 연다**. User PATH 변경은 이미 열려 있던 셸에 자동 반영되지 않기 때문이다.[3]

```powershell
Get-Command hermes
hermes --version
```

`Get-Command hermes`는 현재 사용자 프로필 아래의 `AppData\Local\hermes\hermes-agent\bin\hermes.exe`에 해당하는 경로를 보여야 한다. 실제 사용자명과 드라이브 문자는 PC마다 다르다. `hermes --version`에서는 설치된 버전, 설치 방식과 Python 실행 환경을 확인한다.

명령을 찾지 못한다면 설치를 바로 반복하기 전에 새 터미널인지 확인한다. 그래도 실패하면 현재 설치의 실행 파일을 직접 조회한다.[3]

```powershell
$hermesExe = Join-Path $env:LOCALAPPDATA 'hermes\hermes-agent\bin\hermes.exe'
Test-Path $hermesExe
& $hermesExe --version
```

`Test-Path`가 `True`이고 직접 실행은 되는데 `Get-Command hermes`만 실패한다면 설치 자체보다 User PATH 반영 문제다. `False`라면 설치 로그의 최초 오류로 돌아가야 한다.

## 3. 모델이 실제로 답하는지 확인한다

Hermes는 실행 계층이므로 답을 생성할 모델 provider가 하나 이상 필요하다. 설치 중 선택하지 않았다면 다음 명령으로 설정한다.[1]

```powershell
hermes model
```

설정 후 현재 상태를 확인하고 짧은 질문을 실행한다.

```powershell
hermes status
hermes chat -q "답변 첫 줄에 WINDOWS_HERMES_OK라고만 써 줘."
```

`hermes status`에서 의도한 provider와 model이 선택돼 있고, 두 번째 명령이 응답하면 모델 연결의 기본 경로가 동작한다. `WINDOWS_HERMES_OK`라는 문자열 자체가 제품의 고정 출력은 아니다. 요청과 응답이 한 번 왕복하는지를 쉽게 판별하기 위한 테스트 문구다.

상태 출력에는 로컬 경로, provider 이름이나 환경 정보가 포함될 수 있다. 지원을 요청할 때 전체 출력을 공개 게시판에 그대로 붙이지 말고 필요한 줄만 남긴 뒤 사용자명과 내부 경로를 가린다.

## 4. 연습 폴더에서 파일 도구를 검증한다

모델 답변이 성공해도 도구가 실제 Windows 파일을 다룰 수 있다는 뜻은 아니다. 중요한 프로젝트 대신 별도 연습 폴더에서 시작한다.

```powershell
$playground = Join-Path $env:USERPROFILE 'hermes-playground'
New-Item -ItemType Directory -Force $playground | Out-Null
Set-Location $playground
hermes
```

Hermes가 시작되면 다음처럼 대상과 완료 조건을 좁혀 요청한다.

> 현재 폴더에 `hello-hermes.txt`를 만들고 `Hermes file tool works on Windows.`를 한 줄로 적어 줘. 저장한 뒤 파일을 다시 읽어 실제 내용을 보여 줘. 다른 폴더는 수정하지 마.

도구 승인 화면이 나타나면 명령과 대상 경로가 `hermes-playground` 안인지 확인한다. 설치 확인을 빨리 끝내려고 `--yolo`로 승인 절차를 끄지 않는다. 완료 응답을 받은 뒤 PowerShell에서 파일을 다시 확인한다.

```powershell
Get-Content .\hello-hermes.txt
```

요청한 한 줄이 출력되면 모델 판단, 파일 도구와 Windows 경로 처리가 함께 동작한다. Hermes의 터미널 도구는 Windows에서 설치 프로그램이 준비한 Git Bash를 사용하므로, 모델이 POSIX 형태의 명령을 요청하더라도 Hermes가 Windows 쪽 `bash.exe`를 찾아 실행한다.[3] 이 단계가 실패하면 기존 프로젝트를 열기 전에 진단 명령으로 원인을 좁힌다.

## 5. `doctor`와 `status`의 역할을 구분한다

```powershell
hermes doctor
hermes status
```

| 명령 | 확인하는 것 | 읽는 방법 |
| --- | --- | --- |
| `hermes doctor` | 설치 방식, 의존성, 설정과 선택 기능의 누락 | 지금 사용할 기능을 막는 오류인지 본다 |
| `hermes status` | 활성 provider·model, 인증과 플랫폼 구성 | 의도한 실행 경로가 선택됐는지 본다 |

브라우저나 음성 기능을 아직 설정하지 않았다면 관련 선택 의존성 경고가 나올 수 있다. 모든 경고를 무조건 설치 실패로 보지 말고, 기본 대화와 파일 작업에 필요한 항목부터 해결한다. 반대로 모델 인증이나 Hermes 실행 환경의 오류는 게이트웨이를 추가하기 전에 고친다.

## 6. 필요할 때만 게이트웨이를 로그인 시 시작한다

로컬 터미널에서만 Hermes를 사용한다면 게이트웨이 설치는 필요 없다. 텔레그램 같은 외부 채널에서 메시지를 받거나 예약 작업 결과를 전달하려면 게이트웨이가 계속 실행돼야 한다.[5]

먼저 포그라운드에서 시작해 초기 오류를 화면에서 확인한다.

```powershell
hermes gateway run
```

아직 메시징 채널을 설정하지 않았다면 이 단계는 다음 편까지 미뤄도 된다. 채널 설정을 마친 상태에서 정상 연결을 확인했다면 `Ctrl+C`로 종료하고 로그인 시작 항목을 설치한다.

```powershell
hermes gateway install --start-now --start-on-login
hermes gateway status --deep --full
```

현재 Windows 구현은 로그인 자동 시작을 **작업 스케줄러**에 등록하고, 생성 권한이나 조직 정책 때문에 등록할 수 없으면 사용자의 Startup 폴더 항목으로 전환한다. 설치 과정에서 작업 스케줄러 등록을 위한 UAC 승인을 물을 수 있으며, 승인을 사용하지 않아도 Startup 폴더 fallback을 선택할 수 있다. 두 방식 모두 `hermes gateway status`가 등록 상태와 실행 중인 프로세스를 함께 보여준다.[3][7]

내부 Scheduled Task 이름을 직접 가정해 `schtasks` 명령을 복사할 필요는 없다. 버전이나 프로필에 따라 이름이 달라질 수 있으므로 다음 명령을 진단의 기준으로 삼는다.

```powershell
hermes gateway status --deep --full
hermes logs gateway -n 100
```

게이트웨이는 Windows 서비스처럼 부팅 직후 시스템 전체에서 실행되는 방식이 아니라, 사용자 로그인과 함께 시작되는 구성이다. PC가 꺼져 있거나 절전 중이거나 네트워크가 끊긴 동안에는 텔레그램 요청에도 응답할 수 없다. 24시간 운영이 목적이라면 항상 켜진 별도 기기나 서버가 더 적합할 수 있다.

## Windows에서 자주 막히는 지점

| 증상 | 먼저 확인할 것 | 처리 |
| --- | --- | --- |
| 설치 직후 `hermes`를 찾지 못함 | 새 PowerShell인지, `Test-Path $hermesExe` 결과 | 새 터미널을 열고 User PATH와 설치 파일을 구분해 확인 |
| 모델이 응답하지 않음 | `hermes status` | `hermes model`에서 provider 인증과 model을 다시 선택 |
| 파일·터미널 도구가 실패함 | `hermes doctor`, Git Bash 감지 | 표준 설치 프로그램이 준비한 PortableGit 경로를 우선 복구 |
| 한글이나 기호가 깨짐 | 사용 중인 콘솔 | 오래된 `cmd.exe` 대신 Windows Terminal 사용 |
| 브라우저 도구가 처음부터 시간 초과 | `hermes doctor`의 Node·Chromium 항목 | 진단이 제시하는 설치 명령을 적용한 뒤 다시 시도 |
| 포그라운드는 되지만 로그인 후 꺼짐 | `gateway status --deep --full` | 등록 방식과 실행 PID를 확인하고 gateway 로그 조회 |
| 회사 PC에서 UAC·작업 스케줄러가 차단됨 | 조직 정책 | Startup fallback을 사용하거나 관리자에게 승인 요청 |

Windows 네이티브 설치는 `HERMES_GIT_BASH_PATH`와 UTF-8 콘솔 처리를 자동으로 구성한다.[3] 일반 설치에서 이 환경 변수를 먼저 수동 조정하지 않는다. 표준 설치 후에도 진단이 특정 경로 문제를 보여줄 때만 공식 Windows 안내에 따라 변경한다.

업데이트는 설치 방식을 감지하는 Hermes 명령으로 확인한다.[1]

```powershell
hermes update --check
```

변경 내용을 확인한 뒤 필요할 때 `hermes update`를 실행한다. 상주 게이트웨이와 자동화가 있다면 업데이트 후 `hermes gateway status --deep`와 핵심 작업을 다시 확인한다.

## 제거할 때 설정 데이터의 경계를 안다

```powershell
hermes uninstall
```

공식 제거 명령은 로그인 시작 등록과 Hermes 실행 파일을 제거하지만, 재설치를 위해 `%LOCALAPPDATA%\hermes` 아래의 설정, 인증, 스킬, 세션과 로그는 남긴다.[3] 이 디렉터리를 통째로 삭제하면 단순 프로그램 제거가 아니라 개인 데이터 초기화가 된다. 백업 없이 `Remove-Item -Recurse`로 지우지 않는다.

## 설치가 끝났다면

상단 표의 기본 다섯 항목을 자신의 Windows에서 관찰했다면 네이티브 로컬 설치를 사용할 준비가 된 것이다. 이 글에서 설명한 공식 지원 범위와 구현 검토만으로 그 결과를 대신할 수는 없다. 로그인 상주는 외부 메시징이나 예약 실행이 필요할 때만 추가한다.

다음 편에서는 로컬에서 동작하는 Hermes에 ChatGPT 계정을 OAuth로 인증하고, 별도의 Telegram 봇을 게이트웨이에 연결한다. 모델 인증 문제와 메신저 전달 문제를 서로 다른 층으로 나눠 검증한다.

## Sources

[1] https://hermes-agent.nousresearch.com/docs/getting-started/installation — Hermes Agent Installation

[2] https://hermes-agent.nousresearch.com/docs/getting-started/platform-support — Hermes Agent Platform Support

[3] https://hermes-agent.nousresearch.com/docs/user-guide/windows-native — Windows Native Guide

[4] https://hermes-agent.nousresearch.com/docs/getting-started/quickstart — Hermes Agent Quickstart

[5] https://hermes-agent.nousresearch.com/docs/user-guide/messaging — Messaging Gateway

[6] https://hermes-agent.nousresearch.com/docs/reference/cli-commands — Hermes Agent CLI Commands

[7] https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/gateway_windows.py — Windows gateway implementation
