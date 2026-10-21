import { defineConfig } from 'vite';
export default defineConfig({ resolve: { preserveSymlinks: true }, server: { proxy: { '/api': 'http://127.0.0.1:5000' } } });
