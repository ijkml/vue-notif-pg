import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import WindiCSS from 'vite-plugin-windicss';
import VueTypeImports from 'vite-plugin-vue-type-imports';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [Vue(), WindiCSS(), VueTypeImports()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
