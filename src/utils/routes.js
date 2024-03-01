/**
 * 生成路由数组
 * @returns {Array<import('~/types').RouteModule>} 路由数组
 */
export function generatedRoutes() {
  /**
   * 使用 import.meta.glob 模式匹配 router 目录下的 *.js 文件和 pages 目录下的 route.js 文件，并立即加载它们
   * @type {Record<string, {default?: import('~/types').RouteModule}>}
   */
  const modules = import.meta.glob(['~/router/*.js', '~/pages/**/route.js'], { eager: true })
  // 获取所有模块实例并提取其中的路由定义（默认为每个模块的 default 属性）
  const routes = Object.values(modules).map(i => i.default).flat()
  // 返回过滤掉 undefined 的路由数组
  return routes.filter(Boolean)
}
