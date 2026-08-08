import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
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

test('홈 페이지는 실제 프로젝트와 최근 글을 보여준다', () => {
  const page = read('src/pages/index.astro');

  assert.match(page, /<Header/);
  assert.match(page, /<ProjectCard/);
  assert.match(page, /getCollection\('posts'\)/);
  assert.match(page, /<PostPreview/);
  assert.doesNotMatch(page, /아직 공개한 글이 없습니다/);
});

test('글과 프로젝트 컬렉션은 실제 Markdown 콘텐츠 타입을 제공한다', () => {
  const config = read('src/content.config.ts');

  assert.match(config, /defineCollection/);
  assert.match(config, /const posts/);
  assert.match(config, /const projects/);
  assert.match(config, /publishedAt: z\.coerce\.date/);
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
  assert.doesNotMatch(catalog, /<PostPreview/);
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

test('실제 글과 LocalMind 프로젝트만 콘텐츠 컬렉션에 남는다', () => {
  const posts = readdirSync(new URL('../src/content/posts', import.meta.url)).filter((name) => /\.mdx?$/.test(name)).sort();
  const projects = readdirSync(new URL('../src/content/projects', import.meta.url)).filter((name) => /\.mdx?$/.test(name));

  assert.deepEqual(posts, ['how-i-finish-and-record-work.md', 'how-i-work-with-ai.md']);
  assert.deepEqual(projects, ['localmind.md']);
  assert.equal(existsSync(new URL('../src/pages/blog/[...slug].astro', import.meta.url)), true);
});

test('첫 글은 LocalMind 기록에 근거한 작업 흐름과 의사결정 방식을 설명한다', () => {
  const firstPost = read('src/content/posts/how-i-work-with-ai.md');
  const secondPost = read('src/content/posts/how-i-finish-and-record-work.md');
  const post = `${firstPost}\n${secondPost}`;
  const collections = read('src/content.config.ts');
  const blogIndex = read('src/pages/blog/index.astro');
  const blogDetail = read('src/pages/blog/[...slug].astro');
  const home = read('src/pages/index.astro');

  assert.match(post, /AI에게 맡길 일과 내가 결정할 일/);
  assert.match(post, /완료 조건/);
  assert.match(post, /작업 크기에 맞게/);
  assert.match(post, /트레이드오프/);
  assert.match(post, /self-review/);
  assert.match(post, /사람이 최종 결정/);
  assert.match(post, /LocalMind/);
  assert.match(firstPost, /## 핵심부터/);
  assert.match(secondPost, /## 핵심부터/);
  assert.match(firstPost, /seriesOrder: 1/);
  assert.match(secondPost, /seriesOrder: 2/);
  for (const content of [firstPost, secondPost]) {
    const body = content.split('---').at(-1).replace(/\s/g, '');
    assert.ok(body.length <= 2000, `글 한 편은 3~4분 분량이어야 합니다: ${body.length}자`);
  }
  assert.match(collections, /series: z\.string\(\)\.optional/);
  assert.match(collections, /const posts = defineCollection/);
  assert.match(blogIndex, /getCollection\('posts'\)/);
  assert.match(blogDetail, /getCollection\('posts'\)/);
  assert.match(blogDetail, /@media \(max-width: 38rem\)[\s\S]+\.series-nav a \{[^}]*padding: var\(--space-4\)/);
  assert.match(blogDetail, /@media \(max-width: 38rem\)[\s\S]+\.series-nav strong \{[^}]*font-size: var\(--text-base\)/);
  assert.match(blogDetail, /\.article-footer \{[^}]*border-top: 1px solid var\(--color-line\)/);
  assert.match(home, /getCollection\('posts'\)/);
  assert.doesNotMatch(blogIndex, /아직 공개한 글이 없습니다/);
});

test('LocalMind 상세 페이지는 비개발자 설명과 접근 가능한 시각화를 제공한다', () => {
  const project = read('src/content/projects/localmind.md');
  const detailPage = read('src/pages/projects/[...slug].astro');
  const card = read('src/components/ProjectCard.astro');

  assert.match(project, /AI에게 일을 맡길 때마다/);
  assert.match(project, /쉽게 말하면/);
  assert.match(project, /https:\/\/github\.com\/shaul1991\/localmind/);
  assert.match(project, /한 대의 기기/);
  assert.match(project, /서버는 필수가 아닙니다/);
  assert.match(project, /로컬 stdio MCP/);
  assert.match(project, /원격 HTTP MCP/);
  assert.match(project, /어느 방식이든[^<]+MCP/);
  assert.match(project, /작게 시작해 필요할 때 확장/);
  assert.match(project, /MCP 연결 설정을 stdio에서 HTTP로/);
  assert.match(project, /class="expansion-path"/);
  assert.match(project, /class="architecture-flow architecture-flow-stepper"/);
  assert.match(detailPage, /@media \(max-width: 38rem\)[\s\S]+architecture-flow-stepper/);
  assert.match(detailPage, /architecture-flow-stepper\).*grid-template-columns: 1fr/);
  assert.doesNotMatch(project, /<figure class="architecture-map">[\s\S]*?<svg/);
  assert.doesNotMatch(project, /#08111f|#0d1727/);
  assert.match(detailPage, /\.architecture-map\).*background: var\(--color-surface-raised\)/);
  assert.match(project, /class="deployment-modes"/);
  assert.match(project, /class="before-after"/);
  assert.match(project, /class="project-flow"/);
  assert.match(project, /class="architecture-flow architecture-flow-stepper" role="img"/);
  assert.match(project, /capture_note/);
  assert.match(project, /search_notes/);
  assert.match(project, /whoami/);
  assert.match(project, /brief/);
  assert.match(detailPage, /getCollection\('projects'\)/);
  assert.match(detailPage, /프로젝트 소스 보기/);
  assert.match(detailPage, /project\.data\.repository/);
  assert.match(detailPage, /\.source-link[^}]+background: var\(--color-ink\)/);
  assert.match(detailPage, /<Content \/>/);
  assert.match(card, /href\?: string/);
});
