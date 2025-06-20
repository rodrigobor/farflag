import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    host: true,            // escuta todos os endereços, não só localhost
    strictPort: true,      // erro se porta já estiver em uso
    allowedHosts: [
      'localhost',
      '.trycloudflare.com' // aceito seu subdomínio gerado
    ],
  },

  preview: {
    host: true,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '.trycloudflare.com'
    ],
  },

  build: {
    outDir: 'dist',
  },
})
