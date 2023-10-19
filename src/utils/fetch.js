import { ofetch } from 'ofetch'

const pendingMap = new Map()
const instance = ofetch.create({
  baseURL: window.manifest.API,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
  onRequest,
  onRequestError,
  onResponse,
  onResponseError,
})

/**
 * 请求
 * @param {import('ofetch').FetchContext} ctx
 */
async function onRequest(ctx) {
  if (pendingMap.has(ctx.request.url)) {
    pendingMap.get(ctx.url).abort()
  }
  else {
    const controller = new AbortController()
    pendingMap.set(ctx.request.url, controller)
    ctx.options = { ...ctx.options, signal: controller.signal }
  }
}

/**
 * 请求错误
 * @param {import('ofetch').FetchContext} ctx
 */
async function onRequestError(ctx) {
  pendingMap.delete(ctx.request.url)
}

/**
 * 响应
 * @param {import('ofetch').FetchContext} ctx
 */
async function onResponse(ctx) {
  pendingMap.delete(ctx.request.url)
}

/**
 * 响应错误
 * @param {import('ofetch').FetchContext} ctx
 */
async function onResponseError(ctx) {
  pendingMap.delete(ctx.request.url)
}

/**
 *
 * @template T
 * @param {string} url 请求地址
 * @param {import('ofetch').FetchOptions} [options] 参数
 * @returns {Promise<import('~/types').FetchResponse<T>>} 返回泛型
 */
async function vFetch(url, options) {
  return instance(url, options)
}
export { vFetch, ofetch as oFetch }
