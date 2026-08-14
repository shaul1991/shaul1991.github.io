# Plan — 개인 GitHub 프로필과 상세 포트폴리오

## 접근

### 1. 콘텐츠 정본화

이력서와 현재 공개 GitHub를 근거로 공개 가능한 사실만 추출한다. README는 스캔 속도를 우선해 요약하고, Pages는 문제→행동→결과 구조로 상세화한다. `www.shaul.kr`은 개인 경력의 대체물이 아니라 AI 에이전트 운영 실험으로 설명한다.

### 2. 프로필 README 재작성

기존 프로필 저장소는 삭제하지 않는다. 현재 원격은 이미 mirror 백업과 metadata 백업이 완료됐다. 새 README를 별도 파일로 준비하고 검토한 뒤 orphan `main`을 생성하여 force push한다. 원격의 6개 `claude/*` 브랜치를 삭제한다.

### 3. Pages 정적 사이트 구현

`shaul1991.github.io` 로컬 저장소에 다음 파일을 만든다.

- `index.html`: semantic content와 SEO/OG/JSON-LD
- `styles.css`: 원본 다크 design system, responsive layout, focus/reduced-motion
- `script.js`: 현재 연도 등 보조 기능만 담당; 콘텐츠 의존 없음
- `404.html`: 포트폴리오 홈 복귀가 가능한 일관된 오류 페이지
- `robots.txt`, `sitemap.xml`, `.nojekyll`
- `README.md`: 로컬 실행과 배포 구조

외부 런타임 의존성은 두지 않는다. 폰트도 시스템 stack을 우선해 외부 폰트 실패 시 레이아웃이 깨지지 않게 한다.

### 4. 검증

- HTML 구조 검사, 내부 anchor/외부 URL 검사, 금지 정보 검사
- 로컬 HTTP 서버로 desktop/mobile 브라우저 렌더링
- 콘솔 오류, 키보드 초점, reduced motion, horizontal overflow 확인
- 독립 specialist가 spec compliance와 content/design quality를 검토

### 5. 배포

- Pages repository를 public으로 생성하고 `main` push
- GitHub Pages를 `main` root 배포로 활성화
- 프로필 orphan `main` push와 old branches 삭제
- 두 URL의 HTTP, 렌더링, 링크를 실제 브라우저로 재검증

## 영향 범위

- 변경: `/Users/shaul/personal/shaul1991/shaul1991`
- 신규: `/Users/shaul/personal/shaul1991/shaul1991.github.io`
- 원격 변경: `shaul1991/shaul1991`, 신규 `shaul1991/shaul1991.github.io`
- 보존 백업: `/Users/shaul/backups/shaul1991-repo-reset-20260807-142653`

## 위험과 완화

- 프로필 이력 손실: 검증된 mirror와 GitHub metadata 백업 유지
- 과장/오류: 이력서와 공개 API에 없는 주장은 제거
- 프로필 과밀: README와 Pages의 정보 밀도를 분리
- Pages 전파 지연: Actions/Pages API 상태와 public URL을 bounded polling
- 디자인 과잉: 시각 효과보다 읽기 순서와 근거를 우선

## 검증 명령/관찰

- `python3` 기반 HTML/URL/개인정보 정적 검사
- `python3 -m http.server` 로컬 실행
- 브라우저 desktop/mobile 시각 검사와 console 확인
- `git diff --check`, `git status`, 원격 refs 비교
- `gh api` Pages 상태 및 `curl` HTTP status 확인
