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

test('글 목록은 최신 글부터 정렬하고 시리즈 순서를 유지한다', async () => {
  const { comparePostsNewestFirst } = await import('../src/lib/post-order.mjs');
  const posts = [
    { id: 'workflow-1', data: { publishedAt: new Date('2026-08-08'), series: '나의 작업 흐름', seriesOrder: 1 } },
    { id: 'sdd-1', data: { publishedAt: new Date('2026-08-08'), series: 'sdd-5docs', seriesOrder: 1 } },
    { id: 'sdd-6', data: { publishedAt: new Date('2026-08-08'), series: 'sdd-5docs', seriesOrder: 6 } },
    { id: 'workflow-2', data: { publishedAt: new Date('2026-08-08'), series: '나의 작업 흐름', seriesOrder: 2 } },
    { id: 'newest', data: { publishedAt: new Date('2026-08-09') } },
  ];

  assert.deepEqual(posts.sort(comparePostsNewestFirst).map(({ id }) => id), [
    'newest',
    'sdd-6',
    'sdd-1',
    'workflow-2',
    'workflow-1',
  ]);
});

test('글 목록은 시리즈 필터와 시리즈 태그를 제공한다', () => {
  const page = read('src/pages/blog/index.astro');
  const filter = read('src/components/SeriesFilter.astro');
  const preview = read('src/components/PostPreview.astro');

  assert.match(filter, /aria-label="시리즈 필터"/);
  assert.match(filter, /data-series-filter/);
  assert.match(filter, /aria-pressed/);
  assert.match(page, /URLSearchParams/);
  assert.match(page, /data-series=/);
  assert.match(preview, /<SeriesBadge label=\{series\}/);
});

test('시리즈 필터는 운영 글 목록과 디자인 시스템이 같은 컴포넌트를 사용한다', () => {
  const page = read('src/pages/blog/index.astro');
  const catalog = read('src/pages/design-system.astro');
  const component = read('src/components/SeriesFilter.astro');

  assert.match(page, /<SeriesFilter/);
  assert.match(catalog, /<SeriesFilter/);
  assert.match(catalog, /시리즈 필터와 태그/);
  assert.match(component, /aria-label="시리즈 필터"/);
  assert.match(component, /min-height: 2\.75rem/);
  assert.match(component, /:focus-visible/);
  assert.match(component, /padding-inline: var\(--space-3\)/);
  assert.match(component, /border: 1px solid var\(--color-line\)/);
  assert.match(component, /border-radius: 99rem/);
  assert.match(component, /background: var\(--color-accent-soft\)/);
});

test('시리즈 배지는 목록·상세·디자인 시스템이 같은 스타일 컴포넌트를 사용한다', () => {
  const badge = read('src/components/SeriesBadge.astro');
  const preview = read('src/components/PostPreview.astro');
  const article = read('src/pages/blog/[...slug].astro');
  const catalog = read('src/pages/design-system.astro');

  assert.match(badge, /class="series-badge"/);
  assert.match(badge, /background: var\(--color-accent-soft\)/);
  assert.match(badge, /border: 1px solid var\(--color-accent-strong\)/);
  assert.match(badge, /border-radius: 99rem/);
  assert.match(preview, /<SeriesBadge/);
  assert.match(article, /<SeriesBadge/);
  assert.match(catalog, /<SeriesBadge label="sdd-5docs"/);
  assert.match(catalog, /시리즈 배지/);
});

test('글 목록은 시리즈와 주제 태그의 위계를 분리하고 모바일 진입을 단축한다', () => {
  const page = read('src/pages/blog/index.astro');
  const preview = read('src/components/PostPreview.astro');

  assert.match(preview, /class="topic-tag"/);
  assert.match(preview, /\.topic-tag \{ color: var\(--color-muted\)/);
  assert.match(preview, /<SeriesBadge/);
  assert.match(preview, /class="post-copy"/);
  assert.match(page, /@media \(max-width: 38rem\)/);
  assert.match(page, /padding-top: var\(--space-12\)/);
  assert.match(page, /\.page-header \{ margin-bottom: var\(--space-8\)/);
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
  assert.match(catalog, /<ArticleNavigation/);
  assert.match(catalog, /글 하단 탐색/);
});

test('공용 사이트 푸터는 짧은 페이지를 마감하고 디자인 시스템에서 같은 컴포넌트를 사용한다', () => {
  const footer = read('src/components/SiteFooter.astro');
  const layout = read('src/layouts/BaseLayout.astro');
  const catalog = read('src/pages/design-system.astro');
  const home = read('src/pages/index.astro');

  assert.match(footer, /<footer class="site-footer"/);
  assert.match(footer, /aria-label="하단 탐색"/);
  assert.match(footer, /Shaul Kim/);
  assert.match(footer, /실제 프로젝트와 작업 과정을 기록합니다/);
  assert.match(footer, /GitHub에서 작업 보기/);
  assert.match(footer, /https:\/\/github\.com\/shaul1991/);
  assert.doesNotMatch(footer, /href="\/blog"/);
  assert.doesNotMatch(footer, /href="\/projects"/);
  assert.doesNotMatch(footer, /background: var\(--color-surface-raised\)/);
  assert.match(layout, /import SiteFooter from/);
  assert.match(layout, /<slot \/>\s*<SiteFooter \/>/);
  assert.match(layout, /<body>\s*<slot \/>\s*<SiteFooter \/>\s*<\/body>/);
  assert.doesNotMatch(layout, /min-height: 100svh/);
  assert.doesNotMatch(layout, /site-shell/);
  assert.match(catalog, /import SiteFooter from/);
  assert.match(catalog, /<SiteFooter \/>/);
  assert.doesNotMatch(home, /<footer class="container">/);
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

test('닫힌 모바일 사이드바는 문서 전체의 가로 스크롤을 만들지 않는다', () => {
  const header = read('src/components/Header.astro');

  assert.match(header, /@media \(max-width: 48rem\)[\s\S]+\.mobile-sidebar \{[\s\S]+display: none;/);
  assert.match(header, /\.mobile-sidebar\[data-open\] \{ display: flex; visibility: visible; \}/);
  assert.doesNotMatch(header, /\.mobile-sidebar\.right \{[^}]+translateX/);
});

test('상단 헤더는 페이지를 내려도 화면 위에 고정된다', () => {
  const header = read('src/components/Header.astro');

  assert.match(header, /\.site-header \{ position: sticky; z-index: 10; top: 0;/);
});

test('운영 페이지는 CSS를 HTML에 포함해 배포 직후에도 스타일을 유지한다', () => {
  const config = read('astro.config.mjs');

  assert.match(config, /inlineStylesheets: 'always'/);
});

test('블로그 글은 전담 편집자 승인 후에만 반영한다', () => {
  const agentRules = read('AGENTS.md');
  const editor = read('docs/blog-editor.md');
  const collections = read('src/content.config.ts');
  const posts = readdirSync(new URL('../src/content/posts', import.meta.url)).filter((name) => /\.mdx?$/.test(name));

  assert.match(agentRules, /src\/content\/posts\//);
  assert.match(agentRules, /blog-editor/);
  assert.match(agentRules, /한결/);
  assert.match(agentRules, /모두 `승인`일 때만/);
  assert.match(agentRules, /mcp__localmind_home__whoami/);
  assert.match(agentRules, /mcp__localmind_home__search_notes/);
  assert.match(editor, /LocalMind를 읽기 전용 근거 저장소/);
  assert.match(editor, /현재 저장소[\s\S]+사용자의 최신 지시/);
  assert.match(editor, /비공개 note 경로[\s\S]+공개 글/);
  assert.match(editor, /각 핵심에는 의미와 적용 경계를 설명하는 1~2줄/);
  assert.match(editor, /정확성[\s\S]+설명 충분성[\s\S]+해석 일관성/);
  assert.match(editor, /시리즈는 글자 수가 아니라 독자가 답을 얻으려는 질문 단위/);
  assert.match(editor, /수정 필요[\s\S]+보류/);
  assert.match(collections, /editor: z\.literal\('한결'\)/);
  assert.match(collections, /editorReview: z\.string\(\)/);

  for (const filename of posts) {
    const post = read(`src/content/posts/${filename}`);
    const reviewId = post.match(/editorReview: ([^\n]+)/)?.[1];
    assert.match(post, /editor: 한결/);
    assert.ok(reviewId, `${filename}에 편집 평가 기록이 필요합니다`);
    assert.ok(
      existsSync(new URL(`../docs/blog-reviews/${reviewId}.md`, import.meta.url)),
      `${filename}의 편집 평가 기록을 찾을 수 없습니다: ${reviewId}`,
    );
  }
});

test('실제 글과 실제 프로젝트만 콘텐츠 컬렉션에 남는다', () => {
  const posts = readdirSync(new URL('../src/content/posts', import.meta.url)).filter((name) => /\.mdx?$/.test(name)).sort();
  const projects = readdirSync(new URL('../src/content/projects', import.meta.url)).filter((name) => /\.mdx?$/.test(name)).sort();

  assert.deepEqual(posts, [
    'agent-permission-boundaries.md',
    'ai-memory-outside-model.md',
    'central-knowledge-local-execution.md',
    'decision-records.md',
    'hermes-agent-macos-installation.md',
    'hermes-agent-overview.md',
    'hermes-localmind-lifecycle.md',
    'how-i-finish-and-record-work.md',
    'how-i-use-sdd-5docs.md',
    'how-i-work-with-ai.md',
    'sdd-5docs-design.md',
    'sdd-5docs-execution.md',
    'verification-checklist.md',
  ]);
  assert.deepEqual(projects, ['localmind-addons.md', 'localmind.md']);
  assert.equal(existsSync(new URL('../src/pages/blog/[...slug].astro', import.meta.url)), true);
});

test('모든 글은 핵심과 형식에 맞는 분량을 제공한다', () => {
  const filenames = readdirSync(new URL('../src/content/posts', import.meta.url)).filter((name) => /\.mdx?$/.test(name));

  filenames.forEach((filename) => {
    const content = read(`src/content/posts/${filename}`);
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
    const visibleTextLength = body
      .replace(/<[^>]+>/g, '')
      .replace(/[`#|*]/g, '')
      .replace(/\s/g, '')
      .length;
    const proseBlocks = body
      .split(/\n\s*\n/)
      .filter((block) => !/^(##|- |\d+\.|\||```|<)/.test(block.trim()));
    const isGuide = /^articleType: guide$/m.test(content);
    const maxVisibleTextLength = isGuide ? 7000 : 1000;
    const maxProseBlocks = isGuide ? 50 : 8;

    assert.match(body, /## 핵심\n/);
    assert.match(body, /(^|\n)(?:- |\d+\. |\|)/m);
    assert.ok(
      visibleTextLength <= maxVisibleTextLength,
      `${filename}은 ${isGuide ? '가이드' : '일반 글'} 분량 기준을 지켜야 합니다: ${visibleTextLength}자`,
    );
    assert.ok(proseBlocks.length >= 2, `${filename}은 핵심을 해석할 설명 문단이 필요합니다`);
    assert.ok(proseBlocks.length <= maxProseBlocks, `${filename}의 서술 문단이 너무 많습니다: ${proseBlocks.length}개`);
    if (isGuide) {
      assert.match(body, /## Sources\n/);
      assert.ok((body.match(/^## /gm) ?? []).length >= 5, `${filename}은 다시 찾기 쉬운 단계 제목이 필요합니다`);
    }
  });

  const article = read('src/pages/blog/[...slug].astro');
  assert.match(article, /\.article-body :global\(\.process-flow\)/);
  assert.match(article, /\.process-flow ol\)[\s\S]+grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(article, /\.process-flow--5 ol\)[\s\S]+grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(article, /@media \(max-width: 38rem\)[\s\S]+\.process-flow ol/);
});

test('기억이 이어지는 개인 AI는 여섯 편이 독립된 질문과 공통 원칙을 설명한다', () => {
  const filenames = [
    'ai-memory-outside-model.md',
    'decision-records.md',
    'hermes-localmind-lifecycle.md',
    'central-knowledge-local-execution.md',
    'agent-permission-boundaries.md',
    'verification-checklist.md',
  ];
  const posts = filenames.map((filename) => read(`src/content/posts/${filename}`));

  posts.forEach((post, index) => {
    assert.match(post, /series: 기억이 이어지는 개인 AI/);
    assert.match(post, new RegExp(`seriesOrder: ${index + 1}`));
    assert.match(post, /LocalMind/);
    assert.match(post, /Hermes/);
    assert.match(post, /## 핵심\n/);
  });

  assert.match(posts[0], /기억의 정본은 모델 밖/);
  assert.match(posts[1], /선택[\s\S]+이유[\s\S]+전제/);
  assert.match(posts[2], /whoami[\s\S]+brief[\s\S]+search_notes[\s\S]+capture_note/);
  assert.match(posts[3], /지식은 중앙에 두고 실행은 저장소가 있는 기기/);
  assert.match(posts[4], /원격 접근은 사용자가 허용한 범위/);
  assert.match(posts[5], /성공 문구가 아니라 파일, 테스트, 화면과 diff/);
});

test('블로그 본문 표는 모바일에서도 셀 경계와 열 너비를 구분한다', () => {
  const styles = read('src/styles/index.scss');
  const tokens = read('src/styles/tokens/_index.scss');
  const catalog = read('src/pages/design-system.astro');

  assert.match(tokens, /--color-line-strong:/);
  assert.match(styles, /\.article-body table,[\s\S]+\.content-table-demo table/);
  assert.match(styles, /border-collapse: collapse/);
  assert.match(styles, /table-layout: fixed/);
  assert.match(styles, /border: 1px solid var\(--color-line-strong\)/);
  assert.match(styles, /\.article-body :is\(th, td\),[\s\S]+\.content-table-demo :is\(th, td\)/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.match(styles, /@media \(max-width: 38rem\)[\s\S]+padding: var\(--space-3\) var\(--space-2\)/);
  assert.match(catalog, /class="content-table-demo"/);
  assert.match(catalog, /본문 표/);
});

test('블로그 본문의 긴 링크와 inline code는 모바일 너비 안에서 줄바꿈된다', () => {
  const article = read('src/pages/blog/[...slug].astro');

  assert.match(article, /\.article-body :global\(a\), \.article-body :global\(code\) \{ overflow-wrap: anywhere; \}/);
  assert.match(article, /\.article-body :global\(pre\) \{ overflow-x: auto;/);
});

test('첫 글은 LocalMind 기록에 근거한 작업 흐름과 의사결정 방식을 설명한다', () => {
  const firstPost = read('src/content/posts/how-i-work-with-ai.md');
  const secondPost = read('src/content/posts/how-i-finish-and-record-work.md');
  const post = `${firstPost}\n${secondPost}`;
  const collections = read('src/content.config.ts');
  const blogIndex = read('src/pages/blog/index.astro');
  const blogDetail = read('src/pages/blog/[...slug].astro');
  const articleNavigation = read('src/components/ArticleNavigation.astro');
  const home = read('src/pages/index.astro');

  assert.match(post, /AI에게 맡길 일과 내가 결정할 일/);
  assert.match(firstPost, /<ol class="process-flow"/);
  assert.match(firstPost, /aria-hidden="true">🧭/);
  assert.match(secondPost, /<ol class="process-flow"/);
  assert.match(secondPost, /aria-hidden="true">🧩/);
  assert.match(post, /완료 조건/);
  assert.match(post, /작업 크기에 맞게/);
  assert.match(post, /트레이드오프/);
  assert.match(post, /self-review/);
  assert.match(firstPost, /goal\.md[\s\S]+spec\.md[\s\S]+plan\.md/);
  assert.match(firstPost, /tasks\.md[\s\S]+self-review/);
  assert.match(firstPost, /방향이 정해진 뒤/);
  assert.match(post, /사람이 최종 결정/);
  assert.match(post, /LocalMind/);
  assert.match(firstPost, /요청이 모호한 채로 시작하면/);
  assert.match(secondPost, /검증이 없으면/);
  assert.match(firstPost, /## 핵심\n/);
  assert.match(secondPost, /## 핵심\n/);
  assert.match(firstPost, /seriesOrder: 1/);
  assert.match(secondPost, /seriesOrder: 2/);
  for (const content of [firstPost, secondPost]) {
    const body = content
      .replace(/^---\n[\s\S]*?\n---\n/, '')
      .replace(/<[^>]+>/g, '')
      .replace(/[`#|*\s]/g, '');
    assert.ok(body.length <= 1000, `글은 3~4분 안에 읽을 수 있어야 합니다: ${body.length}자`);
  }
  assert.match(collections, /series: z\.string\(\)\.optional/);
  assert.match(collections, /const posts = defineCollection/);
  assert.match(blogIndex, /getCollection\('posts'\)/);
  assert.match(blogDetail, /getCollection\('posts'\)/);
  assert.match(blogDetail, /<ArticleNavigation/);
  assert.match(articleNavigation, /@media \(max-width: 38rem\)[\s\S]+\.series-nav a \{[^}]*padding: var\(--space-4\)/);
  assert.match(articleNavigation, /@media \(max-width: 38rem\)[\s\S]+\.series-nav strong \{[^}]*font-size: var\(--text-base\)/);
  assert.match(articleNavigation, /\.article-footer \{[^}]*border-top: 1px solid var\(--color-line\)/);
  assert.match(articleNavigation, /\.article-footer \{[^}]*padding-block: var\(--space-12\) var\(--space-24\)/);
  assert.match(articleNavigation, /@media \(max-width: 38rem\)[\s\S]+\.article-footer \{[^}]*padding-block: var\(--space-12\) var\(--space-16\)/);
  const tokenSource = read('src/styles/tokens/_index.scss');
  const definedTokens = new Set([...tokenSource.matchAll(/(--[\w-]+):/g)].map(([, token]) => token));
  const usedTokens = [...`${blogDetail}\n${articleNavigation}`.matchAll(/var\((--[\w-]+)/g)].map(([, token]) => token);
  assert.deepEqual(usedTokens.filter((token) => !definedTokens.has(token)), []);
  assert.match(home, /getCollection\('posts'\)/);
  assert.doesNotMatch(blogIndex, /아직 공개한 글이 없습니다/);
});

test('sdd-5docs는 개요·설계·실행 세 편으로 설명한다', () => {
  const filenames = [
    'how-i-use-sdd-5docs.md',
    'sdd-5docs-design.md',
    'sdd-5docs-execution.md',
  ];
  const posts = filenames.map((filename) => read(`src/content/posts/${filename}`));

  posts.forEach((post, index) => {
    assert.match(post, /series: sdd-5docs/);
    assert.match(post, new RegExp(`seriesOrder: ${index + 1}`));
    assert.match(post, /## 핵심\n/);
  });

  assert.match(posts[0], /나는 실제로/);
  assert.match(posts[0], /문서를 나누면/);
  assert.match(posts[0], /실제 실행에서는[\s\S]+구현과 독립 self-review[\s\S]+review\.md/);
  assert.match(posts[0], /조사·벤치마킹[\s\S]+intake/);
  assert.match(posts[0], /<ol class="process-flow"/);
  assert.match(posts[0], /aria-hidden="true">🎯/);
  assert.match(posts[1], /goal\.md/);
  assert.match(posts[1], /spec\.md/);
  assert.match(posts[1], /plan\.md/);
  assert.match(posts[1], /해석 차이/);
  assert.match(posts[2], /tasks\.md/);
  assert.match(posts[2], /AI에게 맡길 실행 계약/);
  assert.match(posts[2], /독립 self-review 결과/);
  assert.match(posts[2], /review\.md/);
  assert.match(posts[2], /완료 선언/);
  assert.match(posts.join('\n'), /작업 크기에 비례/);
  assert.match(posts.join('\n'), /LocalMind/);
});

test('localmind-addons 프로젝트는 선택 설치형 AI 위임 프로토콜을 설명한다', () => {
  const project = read('src/content/projects/localmind-addons.md');
  const collections = read('src/content.config.ts');
  const detailPage = read('src/pages/projects/[...slug].astro');

  assert.match(project, /localmind-core/);
  assert.match(project, /shape/);
  assert.match(project, /sdd-5docs/);
  assert.match(project, /goal-impl/);
  assert.match(project, /선택 설치/);
  assert.match(project, /형식을 고정하지/);
  assert.match(project, /현재 저장소는 비공개/);
  assert.doesNotMatch(project, /repository: https:\/\/github\.com\/shaul1991\/localmind-addons/);
  assert.match(collections, /facts: z\.array\(z\.string\(\)\)/);
  assert.match(collections, /initials: z\.string\(\)/);
  assert.match(detailPage, /project\.data\.facts/);
  assert.match(detailPage, /project\.data\.initials/);
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
