import { createPinia } from 'pinia'

/**
 *
 * @type {import('~/types').UserModule}
 */
export function install({ app }) {
  const pinia = createPinia()
  app.use(pinia)
}
