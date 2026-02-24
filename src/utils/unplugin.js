import { createApp as createClientApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

/**
 * 统一注册插件
 * @param {import('vue').Component} App
 * @param {{ base?: string } & Omit<import('vue-router').RouterOptions, 'history'>} routerOptions
 * @param {(context: import('~/types').Context) => Promise<void> | void} [initFn]
 * @param {import('~/types').ClientOptions} [options]
 * @returns {() => Promise<import('~/types').Context>} 返回创建客户端上下文的工厂函数
 */
export function createUnplugin(App, routerOptions, initFn, options = {}) {
  async function createClientAppContext() {
    const app = createClientApp(App)
    const base = routerOptions?.base ?? import.meta.env.BASE_URL
    const router = createRouter({
      history: createWebHistory(base),
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
