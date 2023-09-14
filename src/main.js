import App from './App.vue'
import { Unplugin, generatedRoutes } from '~/utils'

const routes = generatedRoutes()

export const createApp = Unplugin(App, { routes }, (ctx) => {
  /**
   * @type {Record<string, {install: import('~/types').UserModule}>}
   */
  const modules = import.meta.glob('./modules/*.js', { eager: true })
  Object.values(modules).forEach(i => i.install?.(ctx))
})
