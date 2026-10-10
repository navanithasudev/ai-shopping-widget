// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   build: {
//     outDir: 'dist-widget',
//     emptyOutDir: true,
//     lib: {
//       entry: 'src/widget-entry.jsx',
//       name: 'AureliaShoppingWidget',
//       formats: ['iife'],
//       fileName: () => 'aurelia-widget.js',
//       cssFileName: 'aurelia-widget',
//     },
//     rollupOptions: {
//       output: {
//         inlineDynamicImports: true,
//       },
//     },
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Replace the Node.js environment reference for browser builds.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },

  build: {
    outDir: 'dist-widget',
    emptyOutDir: true,
    lib: {
      entry: 'src/widget-entry.jsx',
      name: 'AureliaShoppingWidget',
      formats: ['iife'],
      fileName: () => 'aurelia-widget.js',
      cssFileName: 'aurelia-widget',
    },
  },
});