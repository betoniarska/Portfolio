import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    plugins: [glsl()],
    server: {
        proxy: {
            '/assets': 'http://external-server.com'
          },
        
        proxy: {
            '/api': {
                target: 'http://localhost:4000', // Proxying API requests to backend
                changeOrigin: true,
                secure: false,
            },
        },
    },
    build: {
        outDir: '../backend/frontend', // Ensure this matches your backend static files path if you build it
    }
});