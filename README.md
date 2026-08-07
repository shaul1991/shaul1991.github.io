# shaul1991.github.io

개발 기록과 실제로 동작하는 프로젝트를 소개하는 개인 웹사이트입니다.

## 기술 구성

- [Astro](https://astro.build) — 정적 사이트 우선 생성기
- Dart Sass — 디자인 토큰과 컴포넌트 스타일링
- Astro Content Collections — 타입 안전한 Markdown 콘텐츠

## 로컬 개발

```bash
npm install
npm run dev
```

`src/content/posts/`에 글을, `src/content/projects/`에 프로젝트를 Markdown으로 추가하세요.

## 디자인 시스템

디자인 토큰은 `src/styles/tokens/_index.scss`에 정의되어 있습니다. 색상·타이포그래피·공간·반경·그림자는 CSS 사용자 정의 속성으로 노출되어 있으며, `[data-theme='dark']` 토큰을 통해 다크 모드를 지원합니다.

## 검증

```bash
npm test
npm run build
```
