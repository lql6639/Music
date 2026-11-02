import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import compression from 'vite-plugin-compression'

/**
 * 构建时生成版本标识，供前端自动检测更新：
 * - 每次 build 生成唯一 version，写入 dist/version.json
 * - 往 index.html 注入 <meta name="app-version">，运行时据此判断是否发布了新版本
 */
function appVersionPlugin(): Plugin {
  const version = Date.now().toString()
  return {
    name: 'app-version',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<head>',
        `<head>\n    <meta name="app-version" content="${version}" />`
      )
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version })
      })
    }
  }
}

export default defineConfig({
  plugins: [
    appVersionPlugin(),
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver(), IconsResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver(), IconsResolver()]
    }),
    Icons({
      autoInstall: true
    }),
    compression({
      verbose: true,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://110.42.251.70:4000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
