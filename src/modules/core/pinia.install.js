import { createPinia } from 'pinia'

/**
 * Pinia插件安装函数
 * @type {import('~/types').UserModule}
 */
export function install({ app }) {
  // 创建Pinia实例，并将其安装到Vue应用上
  const pinia = createPinia()
  app.use(pinia)
}
