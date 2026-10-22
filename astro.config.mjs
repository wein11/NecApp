import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// Cambiar por el dominio definitivo cuando esté comprado.
export default defineConfig({
  site: 'https://necapp.com.ar',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en', pt: 'pt-BR' } },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'pt'],
    routing: { prefixDefaultLocale: false },
  },
});
