import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://uncutelecmech.co.za',
  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()]
  },

  build: {
    inlineStylesheets: 'always',
  },
});