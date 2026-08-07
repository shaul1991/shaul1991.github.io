import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('토큰 기반 SCSS 디자인 시스템을 제공한다', () => {
  assert.equal(existsSync(new URL('../src/styles/tokens/_index.scss', import.meta.url)), true);
  const tokens = read('src/styles/tokens/_index.scss');

  assert.match(tokens, /--color-surface/);
  assert.match(tokens, /--font-sans/);
  assert.match(tokens, /--space-4/);
  assert.match(tokens, /\[data-theme='dark'\]/);
});

test('홈 페이지는 재사용 가능한 탐색과 콘텐츠 카드로 구성된다', () => {
  const page = read('src/pages/index.astro');

  assert.match(page, /<Header/);
  assert.match(page, /<ProjectCard/);
  assert.match(page, /<PostPreview/);
  assert.match(page, /recent-posts/);
});

test('프로젝트와 글 컬렉션은 Markdown 콘텐츠를 위한 타입을 제공한다', () => {
  const config = read('src/content.config.ts');

  assert.match(config, /defineCollection/);
  assert.match(config, /projects/);
  assert.match(config, /posts/);
});

test('주요 메뉴에서 디자인 시스템 카탈로그로 이동할 수 있다', () => {
  const header = read('src/components/Header.astro');

  assert.match(header, /href: '\/design-system'/);
  assert.match(header, /label: '디자인 시스템'/);
});

test('디자인 시스템 카탈로그에서 토큰과 공용 컴포넌트를 살펴볼 수 있다', () => {
  const catalog = read('src/pages/design-system.astro');

  assert.match(catalog, /id="colors"/);
  assert.match(catalog, /id="typography"/);
  assert.match(catalog, /id="spacing"/);
  assert.match(catalog, /id="components"/);
  assert.match(catalog, /<ProjectCard/);
  assert.match(catalog, /<PostPreview/);
});

test('모바일 헤더는 접고 펼칠 수 있는 좌우 사이드바를 제공한다', () => {
  const header = read('src/components/Header.astro');

  assert.match(header, /data-mobile-sidebar="left"/);
  assert.match(header, /data-mobile-sidebar="right"/);
  assert.match(header, /aria-controls="mobile-navigation"/);
  assert.match(header, /aria-controls="mobile-context"/);
  assert.match(header, /<details/);
  assert.match(header, /<summary/);
});

test('디자인 시스템은 오른쪽 모바일 사이드바에 2단 목차를 전달한다', () => {
  const catalog = read('src/pages/design-system.astro');

  assert.match(catalog, /<Header contextGroups=/);
  assert.match(catalog, /label: '토큰'/);
  assert.match(catalog, /label: '컴포넌트'/);
});

test('모바일 사이드바는 화면의 60%만 사용하고 내부 스크롤을 만들지 않는다', () => {
  const header = read('src/components/Header.astro');

  assert.match(header, /width: 60vw/);
  assert.doesNotMatch(header, /width: min\(22rem, 88vw\)/);
  assert.doesNotMatch(header, /overflow-y: auto/);
});

test('상단 헤더는 페이지를 내려도 화면 위에 고정된다', () => {
  const header = read('src/components/Header.astro');

  assert.match(header, /\.site-header \{ position: sticky; z-index: 10; top: 0;/);
});

test('운영 페이지는 CSS를 HTML에 포함해 배포 직후에도 스타일을 유지한다', () => {
  const config = read('astro.config.mjs');

  assert.match(config, /inlineStylesheets: 'always'/);
});
