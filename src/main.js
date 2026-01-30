/* eslint-disable perfectionist/sort-imports */
import 'virtual:env'
import 'virtual:uno.css'
import { routes } from 'vue-router/auto-routes'
import { createUnplugin } from '~/utils'

import App from './App.vue'
import '~/styles/index.css'

export const createApp = createUnplugin(App, { routes }, async (ctx) => {
  /**
   * 核心模块 eager 引入，可选模块按需加载
   * @type {string[]}
   */
  const coreModulePaths = ['./modules/pinia.install.js']
  /** @type {Record<string, { install?: import('~/types').UserModule; default?: import('~/types').UserModule }>} */
  const coreModules = import.meta.glob(['./modules/pinia.install.js'], { eager: true })
  /** @type {Record<string, () => Promise<{ install?: import('~/types').UserModule; default?: import('~/types').UserModule }>>} */
  const optionalModules = import.meta.glob('./modules/*.install.js')

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

  for (const [path, loadModule] of Object.entries(optionalModules)) {
    if (coreModulePaths.includes(path))
      continue
    try {
      const module = await loadModule()
      await installModule(module)
    }
    catch (error) {
      console.error('模块安装过程中出现错误:', error)
    }
  }
})
