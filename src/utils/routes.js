/**
 * 生成路由数组
 * @returns {Array<import('~/types').RouteModule>} 路由数组
 */
export function generatedRoutes() {
  /**
   * @type {Record<string, {default?: import('~/types').RouteModule}>}
   */
  const modules = import.meta.glob(['../router/*.js', '../pages/**/route.js'], { eager: true })
  const routes = Object.values(modules).map(i => i.default).flat()
  return routes.filter(i => i !== undefined)
}
