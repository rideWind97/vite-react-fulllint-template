import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'
import { visualizer } from 'rollup-plugin-visualizer'
import viteImagemin from 'vite-plugin-imagemin'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    react(),
    visualizer() as any,
    importToCDN({
      modules: [
        {
          name: 'antd',
          var: 'antd',
          path: 'https://unpkg.com/antd@5.14.1/dist/antd.min.js'
          // 根据自己的版本号找到对应的CDN网址
          // css: 'https://unpkg.com/@arco-design/web-vue@2.47.1/dist/arco.css'
        }
      ]
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    }),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 20
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    })
  ],

  // 本地开发服务
  server: {
    host: true, // host设置为true才可以使用network的形式，以ip访问项目
    port: 5173, // 端口号
    // open: true, // 自动打开浏览器
    strictPort: true, // 如果端口已占用直接退出
    // 接口代理服务器
    proxy: {
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  esbuild: {
    pure: []
  },
  // build configure
  build: {
    outDir: 'dist',
    sourcemap: true, // Source map generation must be turned on
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // return 'vendor'
            return id.toString().split('node_modules/')[1].replace('.pnpm/', '').replace('registry.npmmirror.com', '')
          }
        }
      }
    }
  }
})
