import { createApp as createClientApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

/**
 * 统一注册插件
 * @param {import('vue').Component} App
 * @param {{base?: string; routes: import('vue-router').RouteRecordRaw[]}} routerOptions
 * @param {(context: import('~/types').Context) => Promise<void> | void} [initFn]
 * @param {import('~/types').ClientOptions} options
 * @returns import('~/types').Context
 */
export function createUnplugin(App, routerOptions, initFn, options = {}) {
  async function createClientAppContext() {
    const app = createClientApp(App)
    const router = createRouter({
      history: createWebHistory(),
      ...routerOptions,
    })
    const context = {
      app,
      router,
    }

    await initFn?.(context)
    app.use(router)

    return {
      ...context,
    }
  }

  async function mountApp() {
    const context = await createClientAppContext()
    await context.router.isReady()
    await context.app.mount(options.rootContainer || '#app')
  }

  // 执行应用挂载
  mountApp()

  return createClientAppContext
}
