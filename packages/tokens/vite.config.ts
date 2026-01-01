import { defineConfig } from 'vite';
import { resolve } from 'path';

// For CSS-only package, we need a minimal JS entry that imports the CSS
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
