import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('site foundation provides a token-based SCSS design system', () => {
  assert.equal(existsSync(new URL('../src/styles/tokens/_index.scss', import.meta.url)), true);
  const tokens = read('src/styles/tokens/_index.scss');

  assert.match(tokens, /--color-surface/);
  assert.match(tokens, /--font-sans/);
  assert.match(tokens, /--space-4/);
  assert.match(tokens, /\[data-theme='dark'\]/);
});

test('home page is composed from reusable navigation and content cards', () => {
  const page = read('src/pages/index.astro');

  assert.match(page, /<Header/);
  assert.match(page, /<ProjectCard/);
  assert.match(page, /<PostPreview/);
  assert.match(page, /recent-posts/);
});

test('project and post content collections are typed and ready for Markdown content', () => {
  const config = read('src/content.config.ts');

  assert.match(config, /defineCollection/);
  assert.match(config, /projects/);
  assert.match(config, /posts/);
});
