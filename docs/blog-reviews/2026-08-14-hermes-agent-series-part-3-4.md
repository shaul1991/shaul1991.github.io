# 편집 평가: Hermes Agent 실전 가이드 3·4편

- 편집자: 한결
- 평가일: 2026-08-14
- 대상: `Hermes Agent 실전 가이드` 3·4편
- LocalMind 확인: 개인 정본 brain, 읽기 전용 검색
- 공개 근거: Hermes Agent 공식 문서, 공개 소스와 v0.20.1 CLI 계약
- 저장소 노출 확인: 공개 저장소
- 현재 판정: **승인**

## 편집 절차

저장소 규칙에 지정된 `blog-editor` 스킬은 설치 목록에 없었다. community 스킬을 임의 설치하지 않고 저장소 정본인 `docs/blog-editor.md`에 정의된 한결의 역할과 평가 기준을 적용했다.

`mcp__localmind_home__whoami`로 개인 정본 brain 연결을 확인하고, Windows 설치와 ChatGPT OAuth·Telegram 운영에 관한 기록을 읽기 전용으로 검색했다. 검색된 기록에는 비공개 운영 환경과 개인 식별자가 섞여 있어 공개 사실의 출처로 복사하지 않았다. 공개 원고의 지원 범위와 명령은 Hermes Agent 공식 웹 문서, 공개 GitHub 소스와 현재 v0.20.1 CLI help를 우선해 교차 검증했다.

## 독자가 답을 얻을 질문

| 순서 | 글 | 독자의 질문 |
| --- | --- | --- |
| 3 | Windows에 설치하고 첫 작업까지 | 지원되는 Windows에서 네이티브 Hermes를 어떻게 설치하고 모델·파일 도구·진단·로그인 상주 상태를 자신의 결과로 확인하는가 |
| 4 | ChatGPT OAuth와 Telegram 연동 | ChatGPT 계정 OAuth와 Telegram 봇을 어떤 순서로 연결하고 인증·모델·게이트웨이·접근 제한 문제를 어떻게 분리하는가 |

두 글은 앞선 편의 링크 없이 검색으로 직접 들어온 독자도 필요한 선행 조건과 완료 판정법을 알 수 있게 작성했다. 3편은 특정 provider 없이도 설치 질문에 답하고, 4편은 macOS·Windows 어느 쪽에서든 정상 설치된 Hermes를 전제로 연동 질문에 답한다.

## 사실 검증과 적용 경계

### Windows 편

- 2026-08-14의 공식 지원 표에서 Windows 10·11 x86_64·ARM64 네이티브 `install.ps1`가 Tier 1임을 확인했다.
- 공식 Windows 안내와 `gateway_windows.py`에서 Scheduled Task, UAC 선택, Startup 폴더 fallback과 상태 병합 동작을 교차 확인했다.
- 공식 Windows 문서의 예시 작업 이름과 현재 구현 기본 이름이 달라 원고에서는 내부 작업 이름을 하드코딩하지 않았다.
- 현재 CLI에 없는 `hermes gateway logs` 대신 실제 `hermes logs gateway -n 100`을 사용했다.
- 실제 Windows 기기에서 실행하지 않았다는 제한을 도입부에 공개했다. 설치 성공, 출력 문구와 소요 시간을 실측 결과처럼 쓰지 않고 독자가 자신의 기기에서 확인할 통과 기준으로 제시했다.
- 관리자 권한 없는 기본 설치와 로그인 자동 시작 등록 중 발생할 수 있는 UAC를 구분했다. 조직 정책을 우회하도록 PowerShell 실행 정책을 낮추는 안내는 넣지 않았다.

### ChatGPT OAuth·Telegram 편

- `hermes auth add openai-codex --type oauth`, `hermes auth status openai-codex`, `hermes model`, `hermes gateway setup`, `hermes gateway run`과 서비스 명령을 현재 CLI help에서 확인했다.
- `openai-codex`의 ChatGPT 기기 코드 OAuth와 `openai-api`의 API 키 방식을 분리했다.
- 공식 문서가 요금제별 자격과 구독 한도 차감 방식을 완전히 문서화하지 않았다는 경계를 원고에 그대로 반영했다. 무제한 사용, 모든 요금제 지원이나 API 비용 부재를 주장하지 않았다.
- BotFather 토큰, 숫자 사용자 ID, allowlist와 Home channel의 역할을 구분했다. allowlist를 비워 열린 봇으로 만드는 구성을 권하지 않았다.
- 모델 호출, Telegram 연결, 허용 사용자와 백그라운드 서비스 문제를 층별 표로 나눠 독자가 실패 위치를 찾게 했다.

## 최종 콘텐츠 평가

| 항목 | 판정 | 근거 |
| --- | --- | --- |
| 정확성 | 승인 | 공식 문서·공개 소스·CLI help로 명령과 경계를 확인했고, Windows 실기기 미검증과 ChatGPT 요금제 미문서화 범위를 명시했다 |
| 핵심성 | 승인 | 3편은 네이티브 설치 완료 기준, 4편은 설치→OAuth→모델→Telegram→상주 순서를 도입 직후 표로 제시한다 |
| 설명 충분성 | 승인 | 각 명령에 목적, 통과 기준, 실패 시 확인 위치와 보안 주의가 붙어 있다 |
| 해석 일관성 | 승인 | 모델 OAuth는 추론 권한, Hermes는 실행·세션, Telegram은 접점, OS는 실제 실행 환경으로 일관되게 구분한다 |
| 시각화 적합성 | 승인 | 역할·선택·진단은 표, 메시지 경로는 텍스트 다이어그램, 실행은 코드 블록으로 제한해 사용했다 |
| 중복 | 승인 | 3편은 Windows 설치, 4편은 provider·메신저 연동에 집중하며 완료 기준을 마지막에 다시 복제하지 않는다 |
| 분량 | 승인 | 두 글 모두 `guide` 목표 안에서 독립 실행에 필요한 설명을 갖추고, 첫 화면 핵심·번호 단계·진단 표로 다시 찾기 쉽다 |
| 시리즈 구조 | 승인 | 1편 정의, 2편 macOS 설치, 3편 Windows 설치, 4편 ChatGPT·Telegram 연동이 서로 다른 질문에 답한다 |

## 문체·독립성 검사

- 과장 표현, 성과 수치, 보장되지 않은 소요 시간과 “완벽”, “무제한” 같은 홍보 문구를 쓰지 않았다.
- 두 원고에서 정확히 중복된 장문 문장은 발견되지 않았다.
- 명령 목록만 나열하지 않고 왜 실행하는지와 결과를 어떻게 판정하는지 설명했다.
- Windows 편은 WSL2가 필수라고 설명하지 않으며, 네이티브와 WSL2를 독자의 작업 환경에 따른 선택으로 구분한다.
- 4편은 기존 ChatGPT 대화가 이전되거나 ChatGPT 앱을 원격 조종한다는 오해를 첫 부분에서 차단한다.

## 공개·보안 검사

- 실제 사용자 홈 절대경로, 호스트명, 사설 IP, 이메일, 계정 ID, API 키, OAuth credential과 Telegram 봇 토큰: 없음.
- `%LOCALAPPDATA%`, `%USERPROFILE%`, `~/.hermes`는 제품 사용법을 위한 비식별 환경 변수·상대 경로다.
- 실제처럼 보이는 가짜 Telegram 토큰도 원고에 넣지 않았다.
- OAuth 기기 코드와 봇 토큰을 셸 기록·Git·화면 공유에 남기지 않도록 안내했다.
- 외부 메신저가 로컬 도구 실행 통로가 된다는 위험, allowlist, 승인 정책, 프로필과 실제 sandbox의 차이를 설명했다.
- LocalMind에서 검색한 비공개 note 경로, 봇 이름, 사용자 ID와 내부 운영 주소를 공개 원고나 평가 기록에 옮기지 않았다.

## 게시 전 기술 검증

- source ledger strict 검사: 3편 7개, 4편 8개 출처 모두 통과.
- 공개 출처 URL: 12개 고유 URL 모두 최종 HTTP 200 확인.
- 민감 식별자 검사: 개인 절대경로, 호스트명, 사설 주소, API 키·봇 토큰 패턴 0건.
- 정확히 중복된 장문 문장과 과장·AI식 상투 표현 검사: 0건.
- clean detached worktree `npm run test`: 28/28 통과. 새 게시물 목록과 네 편의 시리즈 순서·핵심 경계를 보호하는 회귀 테스트를 포함한다.
- clean detached worktree `npm run build`: Astro 진단 오류·경고·힌트 0건, 최종 경고 없는 빌드에서 21개 페이지 생성.
- 실제 Chrome 렌더: 3·4편 모두 데스크톱 1,280px와 모바일 390px에서 문서와 본문 수평 overflow 없음.
- 렌더된 본문 구조: 3편 제목 12개·출처 링크 7개, 4편 제목 14개·출처 링크 8개가 목차와 일치.
- 모바일 목차: 두 글 모두 열림 상태 너비 234px, `display: flex`, ARIA expanded 상태와 링크 수를 확인했다. 닫힌 뒤 `display: none`, ARIA 복원과 수평 overflow 없음.
- 모바일 상단 이미지 검토에서 3편은 고아 줄이 없었고, 4편의 한 글자 고아 줄은 제목을 `ChatGPT OAuth와 Telegram 연동`으로 줄여 해결했다.

**최종 판정: 승인 — 저장소에 반영하고 게시할 수 있다.**
