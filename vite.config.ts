import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   allowedHosts: [
  //     "retivate.com",
  //     "reti-dev.up.railway.app",
  //     "reti-production.up.railway.app",
  //     "localhost"
  //   ],
  //   port: 3000,
  //   host: true
  // },
  // preview: {
  //   allowedHosts: [
  //     "retivate.com",
  //     "reti-production.up.railway.app",
  //     "reti-dev.up.railway.app",
  //     "localhost"
  //   ],
  //   port: 3000,
  //   host: true
  // }
})
