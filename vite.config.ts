import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';
import {defineConfig} from 'vite';

/** Copies static HTML documentation to dist/docs/ for production hosting. */
function copyDocsPlugin(): Plugin {
  return {
    name: 'copy-docs',
    closeBundle() {
      const src = path.resolve(__dirname, 'docs');
      const dest = path.resolve(__dirname, 'dist', 'docs');
      if (!fs.existsSync(src)) return;
      fs.cpSync(src, dest, { recursive: true });
    },
  };
}

/** Injects absolute APP_URL into SEO meta tags at build time when set. */
function seoMetaPlugin(): Plugin {
  return {
    name: 'seo-meta-app-url',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const appUrl =
          process.env.APP_URL?.replace(/\/$/, '') ||
          (process.env.NODE_ENV === 'production'
            ? 'https://carbonwisecoach.netlify.app'
            : '');
        return html.replaceAll('__APP_URL__', appUrl);
      },
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), seoMetaPlugin(), copyDocsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            charts: ['recharts'],
            pdf: ['jspdf'],
            motion: ['motion'],
            icons: ['lucide-react'],
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
