import 'virtual:env'

import App from './App.vue'
import { createUnplugin, generatedRoutes } from '~/utils'

const routes = generatedRoutes()

export const createApp = createUnplugin(App, { routes }, (ctx) => {
  /**
   * 使用动态导入来按需加载模块
   * 由于没有提供modules的结构，这里假设每个模块都会导出一个对象
   * @type {Record<string, {install?: import('~/types').UserModule}>}
   */
  Object.values(import.meta.glob('./modules/*.js')).forEach((module) => {
    try {
      // 尝试调用install方法，如果存在的话
      module.install?.(ctx)
    }
    catch (error) {
      console.error('模块安装过程中出现错误:', error)
    }
  })
})
