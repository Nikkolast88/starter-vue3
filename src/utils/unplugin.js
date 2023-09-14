import { createApp as createClientApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

/**
 * 统一注册插件
 * @param {import('vue').Component} App
 * @param {{base?: string; routes: import('vue-router').RouteRecordRaw[]}} routerOptions
 * @param {(context: import('~/types').Context) => Promise<void> | void} [fn]
 * @param {import('~/types').ClientOptions} options
 * @returns import('~/types').Context
 */
export function Unplugin(App, routerOptions, fn, options = {}) {
  const { rootContainer = '#app' } = options

  async function createApp() {
    const app = createClientApp(App)

    const router = createRouter({
      history: createWebHistory(),
      ...routerOptions,
    })

    const context = {
      app,
      router,
    }
    await fn?.(context)
    app.use(router)

    return {
      ...context,
    }
  }

  (async () => {
    const { app, router } = await createApp()
    // wait until page component is fetched before mounting
    await router.isReady()
    app.mount(rootContainer)
  })()

  return createApp
}
