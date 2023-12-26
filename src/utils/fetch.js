import { ofetch } from 'ofetch'

const pendingMap = new Map()
const instance = ofetch.create({
  baseURL: window.manifest.API,
  timeout: 3000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  },
  onRequest: prepareRequest,
  onRequestError: handleRequestError,
  onResponse: handleResponse,
  onResponseError: handleResponseError,
})

/**
 * 创建一个 AbortController
 * @param {string} url 请求的URL
 * @returns {AbortController} 返回一个 AbortController 实例
 */
function createAbortController(url) {
  let controller = pendingMap.get(url)
  if (controller) {
    controller.abort()
  }
  else {
    controller = new AbortController()
    pendingMap.set(url, controller)
  }
  return controller
}

/**
 * 准备请求
 * @param {import('ofetch').FetchContext} ctx
 */
async function prepareRequest(ctx) {
  const controller = createAbortController(ctx.request.url)
  ctx.options = { ...ctx.options, signal: controller.signal }
}

/**
 * 请求错误处理
 * @param {import('ofetch').FetchContext} ctx
 */
async function handleRequestError(ctx) {
  const controller = pendingMap.get(ctx.request.url)
  if (controller)
    controller.abort()

  pendingMap.delete(ctx.request.url)
  console.error(`Request error for URL: ${ctx.request.url}`, ctx.error)
}

/**
 * 响应处理
 * @param {import('ofetch').FetchContext} ctx
 */
async function handleResponse(ctx) {
  pendingMap.delete(ctx.request.url)
}

/**
 * 响应错误处理
 * @param {import('ofetch').FetchContext} ctx
 */
async function handleResponseError(ctx) {
  const controller = pendingMap.get(ctx.request.url)
  if (controller)
    controller.abort()

  pendingMap.delete(ctx.request.url)
  console.error(`Response error for URL: ${ctx.request.url}`, ctx.error)
}

/**
 * 发起请求
 * @template T
 * @param {string} url 请求地址
 * @param {import('ofetch').FetchOptions} [options] 参数
 * @returns {Promise<import('~/types').FetchResponse<T>>} 返回泛型
 */
async function vFetch(url, options) {
  return instance(url, options)
}
export { vFetch, ofetch as oFetch }
