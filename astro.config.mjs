import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()]
  },

  site: 'https://uncutelecmech.co.za',
  integrations: [sitemap()],

  build: {
    inlineStylesheets: 'always',
  },
});