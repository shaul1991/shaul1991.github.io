# Spec — 개인 GitHub 프로필과 상세 포트폴리오

## 정보 출처

- 사용자 승인 대화
- `/Users/shaul/personal/shaul1991/resume/base/resume.md`
- 기존 `shaul1991/shaul1991/README.md`
- GitHub API로 확인한 public 저장소와 현재 프로필
- `https://www.shaul.kr`
- localmind 결정 노트: `localmind/2026-08-07T05-40-18-GitHub-프로필과-Pages-포트폴리오-역할-분리.md`

## FR1 — 이력서형 GitHub 프로필 README

README 상단은 이름, `Backend Developer`, 4년+ 경력, "도메인/비즈니스 문제를 정의하고 해결"한다는 포지셔닝을 먼저 보여준다. 이어서 확인 가능한 성과 3~4개, 핵심 역량, 대표 공개 프로젝트, 상세 포트폴리오와 이메일 링크를 제공한다.

- Goal 지지: 성공 기준 1, 2, 4
- AC1: GitHub 프로필 렌더링 첫 화면에 이름·직무·포지셔닝·상세 포트폴리오 링크가 보인다.
- AC2: 리텐션 0.2→0.4, 무중단 CMS MSA 전환, 실시간 항공 예약/발권 구축, 운영 모니터링 경험 중 최소 3개가 구체적 문장으로 표시된다.
- AC3: 공개 프로젝트는 실제 접근 가능한 public URL만 연결한다.
- AC4: 전화번호, 숙련도 퍼센트, 방문자 카운터, 동적 GitHub 통계 이미지를 포함하지 않는다.

## FR2 — 상세 GitHub Pages 포트폴리오

한 페이지 안에서 다음 순서로 제공한다.

1. Hero: 이름, 역할, 한 문장 포지셔닝, GitHub/이메일 CTA
2. Evidence: 경력 4년 3개월, 리텐션 100% 개선, 신규 서비스 구축, 무중단 전환
3. Selected work: 업무 문제 해결 사례 4개
4. Open source & experiments: `localmind`, `md2htmlreview`, AI 에이전트 회사/`www.shaul.kr`
5. Experience: 회사·기간·역할 타임라인
6. Capabilities: Backend, Data/Architecture, Infra/Operations, AI-assisted workflow
7. Contact: 이메일과 GitHub

- Goal 지지: 성공 기준 3, 4, 5
- AC5: 위 7개 콘텐츠 영역이 semantic HTML landmark/heading 구조로 존재한다.
- AC6: 320px 모바일과 1440px 데스크톱에서 가로 스크롤 없이 읽을 수 있다.
- AC7: 모든 외부 링크는 유효한 `https` URL이며 새 탭 링크에는 안전한 `rel` 속성이 있다.
- AC8: 키보드 포커스가 보이고, skip link가 있으며, `prefers-reduced-motion`을 존중한다.
- AC9: title, description, canonical, Open Graph, Twitter card, JSON-LD Person 메타데이터가 존재한다.
- AC10: JavaScript가 비활성화되어도 핵심 콘텐츠를 전부 읽을 수 있다.

## FR3 — 시각 시스템

Linear의 원칙을 참고하되 복제하지 않은 독자적인 다크 개발자 포트폴리오를 만든다.

- near-black 배경, 회색 텍스트, 제한된 violet/blue accent
- 정교한 typography와 충분한 여백
- 반투명 얇은 테두리, 작은 radius
- 기술 labels에만 monospace 사용
- 과한 gradient, glassmorphism, 아이콘 카드 남발, 애니메이션 쇼를 금지

- Goal 지지: 성공 기준 3, 5
- AC11: 색상·타입·간격·focus tokens가 CSS custom properties로 정의된다.
- AC12: 텍스트 대비는 WCAG AA 수준을 만족하도록 설계한다.
- AC13: 모바일 메뉴가 필요 없는 단순 anchor navigation을 사용하고 터치 대상은 최소 44px이다.

## FR4 — 배포와 저장소 초기화

- 프로필 저장소: 백업 후 새 orphan `main`, README 중심, 기존 원격 `claude/*` 브랜치 삭제
- Pages 저장소: 새 public repository, root에서 정적 사이트 배포

- Goal 지지: 성공 기준 2, 5와 제약
- AC14: `shaul1991/shaul1991` 원격에는 새 `main`과 새 README 내용만 기본 이력으로 존재하며 기존 `claude/*` 브랜치가 없다.
- AC15: `shaul1991/shaul1991.github.io`가 public이고 Pages가 활성화되어 URL이 HTTP 200을 반환한다.
- AC16: 두 로컬 저장소가 각각 원격 기본 브랜치와 동기화되고 working tree가 clean이다.

## Open questions

- ~~README와 Pages 역할~~: README는 빠른 이력서, Pages는 상세 포트폴리오로 사용자 확정.
- ~~전화번호 공개 여부~~: 제외.
- GitHub Pages 최초 배포 전파 시간은 GitHub 외부 상태에 따라 달라질 수 있다. bounded polling 후 상태를 review에 기록한다.
