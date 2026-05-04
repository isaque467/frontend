import { defineConfig } from 'vite'

export default defineConfig({
  root: './pages',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: './pages/index.html',
        login: './pages/login.html',
        dashboard: './pages/dashboard.html',
        podium: './pages/podio.html',
        ranking: './pages/ranking.html'
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})

