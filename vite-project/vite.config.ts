import { defineConfig } from 'vite'
// ...
export default defineConfig({
  // ...
  define: {
    'process.env': {},
    'build.polyfillModulePreload': true
  },
  optimizeDeps: {
    include: ['puppeteer']
  }
})