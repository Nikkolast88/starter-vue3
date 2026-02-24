/* eslint-disable perfectionist/sort-imports */
import 'virtual:env'
import 'virtual:uno.css'
import { routes } from 'vue-router/auto-routes'
import { createUnplugin } from '~/utils'

import App from './App.vue'
import '~/styles/index.css'

export const createApp = createUnplugin(App, { routes }, async (ctx) => {
  /**
   * @typedef {{ install?: import('~/types').UserModule; default?: import('~/types').UserModule }} UserModuleExports
   */
  ctx.router.afterEach((to) => {
    const title = to.meta?.title || '未知'
    if (title != null)
      document.title = String(title)
  })
  /**
   * 核心模块 eager 引入，可选模块按需加载
   */
  const coreModules = /** @type {Record<string, UserModuleExports>} */ (
    import.meta.glob('./modules/core/*.install.js', { eager: true })
  )
  const optionalModules = /** @type {Record<string, () => Promise<UserModuleExports>>} */ (
    import.meta.glob('./modules/*.install.js')
  )

  /**
   * @param {UserModuleExports} module
   */
  async function installModule(module) {
    const install = module.install ?? module.default
    await install?.(ctx)
  }

  for (const module of Object.values(coreModules)) {
    try {
      await installModule(module)
    }
    catch (error) {
      console.error('模块安装过程中出现错误:', error)
    }
  }

  for (const loadModule of Object.values(optionalModules)) {
    try {
      const module = await loadModule()
      await installModule(module)
    }
    catch (error) {
      console.error('模块安装过程中出现错误:', error)
    }
  }
})
