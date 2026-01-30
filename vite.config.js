import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import Unplugin from 'unplugin-env/vite'
import { defineConfig } from 'vite'
import VueRouter from 'vue-router/vite'

// 使用path模块的join方法来处理路径
const srcPath = path.join(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: false,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  plugins: [
    VueRouter({
      dts: 'src/typed-router.d.ts',
      routesFolder: 'src/pages',
      extensions: ['.vue'],
    }),
    vue(),
    vueJsx(),
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: false,
      include: [path.resolve(__dirname, 'locales/**')],
    }),
    Unplugin(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '~': srcPath,
    },
  },
})
