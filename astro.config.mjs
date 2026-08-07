import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shaul1991.github.io',
  output: 'static',
  build: {
    inlineStylesheets: 'always',
  },
});
