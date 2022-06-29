// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
// eslint-disable-next-line import/no-extraneous-dependencies
import vue from '@vitejs/plugin-vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import * as path from 'path';

export default defineConfig({
    build: {
        sourcemap: false,
        outDir: './docker/nginx/dist',
    },
    resolve: {
        alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
    },
    plugins: [
        vue({
            template: { transformAssetUrls },
        }),
        quasar({
            sassVariables: 'src/styles/quasar-variables.sass',
        }),
    ],
    server: {
        proxy: {
            '/api': {
                // target: 'http://localhost:8888',
                target: 'http://8.142.89.150:8888',
                changeOrigin: true,
                // eslint-disable-next-line no-shadow
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});
