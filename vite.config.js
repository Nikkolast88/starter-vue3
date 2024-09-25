import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Unplugin from 'unplugin-env/vite'
import { defineConfig } from 'vite'

// 使用path模块的join方法来处理路径
const srcPath = path.join(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),
    Unplugin(),
  ],
  resolve: {
    alias: {
      '~': srcPath,
    },
  },
})
