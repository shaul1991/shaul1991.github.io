# 저장소 작업 규칙

## 블로그 편집자 게이트

`src/content/posts/`의 글을 생성·수정·삭제하거나 제목, 설명, 시리즈 구성을 바꿀 때는 반드시 전담 편집자 **한결**을 거친다.

1. 설치된 `blog-editor` 스킬을 불러온다.
2. `mcp__localmind_home__whoami`로 연결된 LocalMind brain을 확인한다.
3. `mcp__localmind_home__search_notes`로 프로젝트·결정·작업 기록을 검색한다.
4. LocalMind 기록을 현재 저장소와 사용자의 최신 지시에 교차 검증한다.
5. LocalMind가 연결되지 않거나 근거가 없으면 내용을 추정하지 않고 `보류`한다.
6. `docs/blog-editor.md`의 역할과 평가 기준을 적용한다.
7. 한결이 초안을 작성하거나 기존 원고를 평가한다.
8. 평가 항목이 모두 `승인`일 때만 저장소에 반영한다.
9. 평가 결과를 `docs/blog-reviews/`에 남기고 원고의 `editorReview`에서 참조한다.
10. 원고 frontmatter에 `editor: 한결`을 기록한다.
11. `수정 필요` 또는 `보류`가 하나라도 있으면 게시하지 않는다.

코드, 스타일, 빌드 설정처럼 글 내용과 무관한 변경에는 이 게이트를 적용하지 않는다.
