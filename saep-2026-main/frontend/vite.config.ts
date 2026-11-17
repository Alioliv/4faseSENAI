import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Repassa as chamadas /api para o backend Express (evita problema de CORS e mantém os cookies)
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
