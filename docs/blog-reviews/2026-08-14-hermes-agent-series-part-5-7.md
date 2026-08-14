# Hermes Agent 실전 가이드 5·6·7편 편집 평가

- 평가일: 2026-08-14
- 편집자: 한결
- 대상:
  - `src/content/posts/hermes-agent-profiles-isolation.md`
  - `src/content/posts/hermes-agent-memory-skills-sessions.md`
  - `src/content/posts/hermes-agent-cron-automation.md`
- 시리즈: `Hermes Agent 실전 가이드`
- 판정: **승인**

## 독자 질문과 독립 결론

| 편 | 검색으로 들어온 독자의 질문 | 독립 결론 | 판정 |
| --- | --- | --- | --- |
| 5편 | 개인용·업무용 Hermes를 프로필만 나누면 안전한가 | 프로필은 Hermes 상태를 나누지만 파일·호스트 credential 차단에는 OS·컨테이너·기기 경계가 추가로 필요하다 | 승인 |
| 6편 | Memory, skill과 session 중 어디에 정보를 저장해야 하는가 | 매번 필요한 안정적 사실은 memory, 반복 절차는 skill, 당시 원문은 session, 팀 정본은 프로젝트 문서에 둔다 | 승인 |
| 7편 | Cron이 생성된 뒤 실제 실행·결과·전달까지 어떻게 확인하는가 | 일반 agent, no-agent와 monitor를 구분하고 gateway heartbeat, execution ledger, output과 delivery를 단계별로 검증한다 | 승인 |

세 편 모두 1~4편을 읽지 않은 독자에게 Hermes 기능과 이번 편의 범위를 다시 설명한다. 이전 편은 선행 지식 강제가 아니라 다음 행동을 찾는 독자를 위한 연결로만 사용했다.

## 근거와 검증 상태

| 범위 | 근거 | 공개 원고 표기 | 판정 |
| --- | --- | --- | --- |
| 프로필 생성·`-p` 일회성 선택·blank 상태 | Hermes Agent v0.20.1 로컬 실행 | 임시 프로필의 session·skill 0건과 sticky 기본값 유지로 명시 | 승인 |
| Profile clone·export·host credential 경계 | 공식 문서와 공개 v0.20.1 구현 | 실행 관찰로 과장하지 않고 구현 기준으로 명시 | 승인 |
| Memory·skill·session 저장·검색·정리 | 공식 기능 문서, CLI help와 session storage 문서 | source-derived 절차로 설명 | 승인 |
| No-agent Cron 생성·실행·history·output·삭제 | Hermes Agent v0.20.1 로컬 실행 | `local` marker, `completed`, active job 0건으로 명시 | 승인 |
| Monitor hash suppression·scheduler 동작 | 공식 문서와 공개 scheduler·monitor 구현 | source-derived 동작으로 설명 | 승인 |
| Telegram 전달 | 공식 gateway 문서와 4편의 선행 검증 | 실제 ID·token 없이 재검증 절차만 제공 | 승인 |

## 평가 항목

| 항목 | 5편 | 6편 | 7편 | 근거 |
| --- | --- | --- | --- | --- |
| 핵심 가치 | 승인 | 승인 | 승인 | 각 글이 하나의 운영 질문에 답하고 실행 결과로 끝난다 |
| 내용 충실도 | 승인 | 승인 | 승인 | 목적, 선행 조건, 명령, 성공 기준, 실패 진단과 보안 경계를 포함한다 |
| 해석 일관성 | 승인 | 승인 | 승인 | 1~4편의 개념→설치→연동 다음을 격리→정보 관리→자동화로 확장한다 |
| 시각화 적합성 | 승인 | 승인 | 승인 | 상태·저장소·실행 모드·장애 계층은 비교표로, 순차 작업은 번호로 표현했다 |
| 문체·독립성 | 승인 | 승인 | 승인 | 공지형 도입, 과장, 즉답형 수사 질문과 일반론적 결론을 제거했다 |
| 보안·개인정보 | 승인 | 승인 | 승인 | token shape, 개인 홈 경로, 사설 IP, email과 실제 Telegram 식별자 0건이다 |
| 출처 | 승인 | 승인 | 승인 | citation strict 통과, 모든 inline source가 ledger와 일치하고 live URL이 유효하다 |
| 분량 | 승인 | 승인 | 승인 | visible 기준 5편 5,177자, 6편 5,734자, 7편 6,972자다 |

## 수정 이력

1. **프로필 export 범위** — 초안은 named profile도 session DB·log를 제외한다고 일반화했다. v0.20.1 구현을 다시 읽어 `.env`·`auth.json` 제외는 공통, DB·log 추가 제외는 default profile에 해당하며 named archive에는 다른 상태가 포함될 수 있다고 교정했다.
2. **Profile clone 경고** — `--clone`이 설정·credential뿐 아니라 curated memory 파일도 복사하는 현재 구현을 명시하고, 새 역할에는 fresh profile을 기본값으로 제시했다.
3. **Cron 완료 판정** — manual trigger가 background handle을 먼저 반환할 수 있으므로 trigger 문구 대신 execution terminal state와 실제 output을 확인하도록 고쳤다.
4. **7편 분량·문체** — 중복 진단 문단을 줄이고 즉답형 수사 질문을 평서문으로 바꿔 guide 상한 안으로 조정했다.

## 게시 전 검사

- citation strict: 5·6·7편 모두 통과
- source block/ledger: 누락·미등록·미사용 source 0건
- live citation URL: 공식 문서와 공개 source page 404 0건
- 민감정보 패턴: token, 개인 홈 경로, 사설 IP, email, Telegram token label 0건
- 장문 exact 중복: 기존 1~4편 및 세 초안 사이 0건
- Humanizer 점검: 과장, vague authority, AI 상투어, generic conclusion 0건

## 저장소 검증 결과

- `npm run test`: 28/28 통과
- `npm run build`: Astro check 0 errors·0 warnings·0 hints, 정적 페이지 24개 생성
- Orca desktop: 5·6·7편 모두 1,425px viewport에서 document horizontal overflow 0
- 시리즈 이동: 4→5→6→7편의 이전·다음 링크와 7편의 마지막 글 상태 확인
- Orca mobile iframe: 세 글 모두 실제 `innerWidth=390`, `(max-width: 768px)` 활성, document `scrollWidth=clientWidth=390`
- 모바일 표·코드: box는 좌우 16px 여백 안에 유지되고 긴 code는 document를 밀지 않고 `pre` 내부 scroll 영역에 머묾
- Orca screenshot helper와 macOS window capture는 host 권한·stale owner 제한으로 bitmap을 저장하지 못했다. 제목·navigation·table·code block과 responsive geometry는 live embedded browser DOM에서 측정했다.

**편집 기준과 저장소 기술 검증이 모두 승인됐으며 게시할 수 있다.**
