import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      // Externalize @brand/tokens dependency
      external: ['@brand/tokens'],
      output: {
        // Preserve tree-shaking
        preserveModules: false,
        // Asset file naming
        assetFileNames: '[name].[ext]',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
    // Generate source maps for debugging
    sourcemap: true,
  },
  // Resolve @brand/tokens for development
  resolve: {
    alias: {
      '@brand/tokens': resolve(__dirname, '../tokens/src/index.css'),
    },
  },
});
