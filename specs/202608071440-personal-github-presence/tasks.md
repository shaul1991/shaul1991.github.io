# Tasks — 개인 GitHub 프로필과 상세 포트폴리오

- [ ] T1 프로필 README 초안 작성
  - 대상: 새 `README.md` 콘텐츠. 기존 프로필 working tree에는 아직 적용하지 않는다.
  - 계약: 이름/직무/4년+ 경력/문제 정의 포지셔닝, 성과 3~4개, 핵심 역량, public 프로젝트, Pages/이메일 CTA. 전화번호·통계 위젯·숙련도 퍼센트 금지.
  - 근거: spec FR1.
  - 완료: 링크가 실제 public URL이고, 120줄 이하이며, 개인정보 금지 검사 통과.

- [ ] T2 Pages 사이트 구현
  - 대상: `index.html`, `styles.css`, `script.js`, `404.html`, `robots.txt`, `sitemap.xml`, `.nojekyll`, `README.md`.
  - 계약: spec FR2/FR3의 7개 영역, SEO/OG/JSON-LD, no-JS 콘텐츠, 반응형/접근성. Linear 원칙을 참고한 원본 다크 시스템이며 복제·과한 효과 금지.
  - 함정: private repo 링크 노출, 전화번호 노출, fake metrics, horizontal overflow, 외부 JS 의존.
  - 완료: 로컬 HTTP 200, console error 0, 320/1440px overflow 없음, anchor/link 검사 통과.

- [ ] T3 독립 spec/content/design 검토
  - 대상: T1/T2 산출물. 낮춰 위임하지 않음: 최종 판단은 독립 reviewer가 수행.
  - 계약: AC1~AC13을 하나씩 판정하고 과장·AI 문체·채용 관점의 정보 위계·접근성 결함을 지적한다.
  - 완료: Critical/Important issue 0 또는 모두 수정 후 재검토 승인.

- [ ] T4 프로필 저장소 이력 초기화와 원격 반영
  - 대상: `shaul1991/shaul1991`.
  - 계약: verified backup 보존, orphan `main` 단일 새 커밋, 원격 `claude/*` 삭제, 저장소 자체는 삭제하지 않음.
  - 완료: 원격 기본 main이 새 commit, old branches 0, profile URL에 새 README 렌더링.

- [ ] T5 Pages 저장소 생성·배포
  - 대상: 신규 public `shaul1991/shaul1991.github.io`.
  - 계약: main/root Pages, HTTPS, static files push.
  - 완료: Pages API `built`, public URL HTTP 200, 로컬/원격 SHA 일치.

- [ ] T6 최종 통합 검증과 review 작성
  - 대상: 두 공개 URL, Git 상태, `review.md`.
  - 계약: AC1~AC16별 증거, 실제 브라우저 관찰, 잔여 위험, localmind 결정 경로 기록.
  - 완료: review가 자리표시자가 아니고 각 AC 상태가 명시됨.
