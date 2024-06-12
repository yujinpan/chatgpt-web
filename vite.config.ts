import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { resolve } from 'path';
import { resolveWithAlias } from 'path-ops';
import vitePluginGA from 'vite-plugin-ga';
import { defineConfig } from 'vitest/config';

import pkg from './package.json';
import vitePluginObf from './vite-plugin-obf';

const alias = {
  '@': resolve('src'),
};

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vueJsx(),
    vitePluginObf({
      include: [
        'src/utils/secret.ts',
        'src/utils/auth.ts',
        'src/utils/interceptor',
      ],
    }),
    vitePluginGA({
      id: 'G-S66MPLRFJZ',
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://service-nl49jn5a-1301154847.sg.apigw.tencentcs.com',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias,
    extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // ignore external sass warnings for "10px / 2px"
        quietDeps: true,
        // resolve start path for "~", like: "~external/style/var.scss"
        importer: (url: string) => {
          return {
            file: resolveWithAlias(
              url.startsWith('~') ? url.slice(1) : url,
              alias,
            ),
          };
        },
      },
    },
  },
  define: {
    // define package build info, print them in console
    __BUILD__: JSON.stringify({
      name: pkg.name,
      version: pkg.version,
      dateTime: new Date().toLocaleString(),
    }),
  },
  test: {
    environment: 'jsdom',
  },
});
