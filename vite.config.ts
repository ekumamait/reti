import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   allowedHosts: [
  //     "reti.onrender.com",
  //     "reti-dev.up.railway.app",
  //     "localhost"
  //   ],
  //   port: 3000,
  //   host: true
  // },
  // preview: {
  //   allowedHosts: "all",
  //   port: 3000,
  //   host: true
  // }
})
