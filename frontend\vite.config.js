import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  return {
    base: env.VITE_BASE_PATH || '/',
    plugins: [react()],
    server: { host: '127.0.0.1', port: 5173, proxy: { '/api': 'http://127.0.0.1:5000' } },
  };
});
