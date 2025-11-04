import { ofetch } from 'ofetch'

/** @type {Map<string, AbortController>} */
const pendingMap = new Map()

/**
 * 根据 URL 和参数生成唯一请求 key
 * @param {string} url 请求 URL
 * @param {import('ofetch').FetchOptions} [options]
 * @returns {string} 请求 key
 */
function getRequestKey(url, options) {
  const body = options?.body ? JSON.stringify(options.body) : ''
  const params = options?.params ? JSON.stringify(options.params) : ''
  return `${url}|${body}|${params}`
}

/**
 * 创建并管理 AbortController（自动中止上一个相同请求）
 * @param {string} key 唯一 key
 * @returns {AbortController} 新创建的 AbortController
 */
function createAbortController(key) {
  const existing = pendingMap.get(key)
  if (existing)
    existing.abort()

  const controller = new AbortController()
  pendingMap.set(key, controller)
  return controller
}

/**
 * 获取请求 URL（兼容字符串与 Request 对象）
 * @param {import('ofetch').FetchContext} ctx
 * @returns {string} 请求 URL
 */
function getUrl(ctx) {
  return typeof ctx.request === 'string' ? ctx.request : ctx.request.url
}

/**
 * 请求发送前的处理
 * - 自动创建 AbortController
 * - 动态设置 Content-Type
 * @param {import('ofetch').FetchContext} ctx
 */
async function prepareRequest(ctx) {
  const url = getUrl(ctx)
  const key = getRequestKey(url, ctx.options)
  const controller = createAbortController(key)
  ctx.options.signal = controller.signal

  // 自动设置 Content-Type
  const headers = new Headers(ctx.options.headers || {})
  if (ctx.options.body instanceof FormData) {
    headers.delete('Content-Type') // 让浏览器自动设置 multipart 边界
  }
  else if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json;charset=UTF-8')
  }
  ctx.options.headers = headers
}

/**
 * 响应成功时清理 pendingMap
 * @param {import('ofetch').FetchContext} ctx
 */
async function handleResponse(ctx) {
  const url = getUrl(ctx)
  const key = getRequestKey(url, ctx.options)
  pendingMap.delete(key)
}

/**
 * 错误处理（请求或响应阶段）
 * @param {import('ofetch').FetchContext} ctx
 */
async function handleError(ctx) {
  const url = getUrl(ctx)
  const key = getRequestKey(url, ctx.options)
  pendingMap.delete(key)
  console.error(`[Fetch Error] ${url}`, ctx.error)
}

/**
 * 创建 ofetch 实例
 */
const instance = ofetch.create({
  baseURL:
    (typeof window !== 'undefined' && window.manifest?.API)
    || import.meta.env.VITE_API
    || '',
  timeout: 3000, // ✅ 原生超时支持
  onRequest: prepareRequest,
  onRequestError: handleError,
  onResponse: handleResponse,
  onResponseError: handleError,
})

/**
 * 通用请求函数
 * @template T
 * @param {string} url 请求地址
 * @param {import('ofetch').FetchOptions} [options] 请求参数
 * @returns {Promise<T>} 泛型响应结果
 */
async function vFetch(url, options) {
  const key = getRequestKey(url, options)
  try {
    return await instance(url, options)
  }
  finally {
    pendingMap.delete(key)
  }
}

export { ofetch as oFetch, vFetch }
