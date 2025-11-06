import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Configuração padrão para Vue + Tailwind 4
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5173,
  },
})