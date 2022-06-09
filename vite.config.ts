import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {quasar, transformAssetUrls} from '@quasar/vite-plugin'
import * as path from "path";

export default defineConfig({
  build: {
    target: 'es2015',
    outDir: './docker/dist',
    terserOptions: {
      compress: {
        keep_infinity: true,
        drop_console: true,
      },
    },
    brotliSize: false,
    chunkSizeWarningLimit: 2000,
  },
  resolve: {
    alias: [{find: '@', replacement: path.resolve(__dirname, './src')}],
  },
  plugins: [
    vue({
      template: {transformAssetUrls}
    }),
    quasar({
      sassVariables: 'src/styles/quasar-variables.sass'
    })
  ],
  server:{
    proxy:{
      "/api": {
        target: "http://localhost:8888",
        // target: "http://8.142.89.150:8888",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    }
  }
})
