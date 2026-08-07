# shaul1991.github.io

개발 기록과 실제로 동작하는 프로젝트를 소개하는 개인 웹사이트입니다.

## Stack

- [Astro](https://astro.build) — static-first site generation
- Dart Sass — design tokens and component styling
- Astro Content Collections — typed Markdown content

## Local development

```bash
npm install
npm run dev
```

`src/content/posts/`에 글을, `src/content/projects/`에 프로젝트를 Markdown으로 추가하세요.

## Design system

디자인 토큰은 `src/styles/tokens/_index.scss`에 정의되어 있습니다. 색상·타이포그래피·공간·반경·그림자는 CSS custom properties로 노출되어 있으며, `[data-theme='dark']` 토큰을 통해 다크 모드를 지원합니다.

## Verification

```bash
npm test
npm run build
```
