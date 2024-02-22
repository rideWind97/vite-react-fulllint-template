import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { Plugin as importToCDN, autoComplete } from 'vite-plugin-cdn-import'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    react(),
    importToCDN({
      modules: [
        autoComplete('antd')
        // {
        //   // 引入时的包名
        //   name: "@arco-design/web-vue",
        //   // app.use(), 全局注册时分配给模块的变量
        //   var: "ArcoVue",
        //   // 根据自己的版本号找到对应的CDN网址
        //   path: "https://unpkg.com/@arco-design/web-vue@2.47.1/dist/arco-vue.min.js",
        //   // 根据自己的版本号找到对应的CDN网址
        //   css: "https://unpkg.com/@arco-design/web-vue@2.47.1/dist/arco.css",
        // },
      ]
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
  }
})
