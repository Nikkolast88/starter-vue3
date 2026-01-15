import { ofetch } from 'ofetch'

/** @type {Map<string, { controller: AbortController; id: number }>} */
const pendingMap = new Map()
const PENDING_ID = Symbol('pending_id')
let requestSeq = 0

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]'
}

function serializeValue(value) {
  if (value === null || typeof value !== 'object')
    return JSON.stringify(value)

  if (value instanceof URLSearchParams)
    return value.toString()

  if (value instanceof FormData)
    return `form:${[...value.keys()].sort().join(',')}`

  if (Array.isArray(value))
    return `[${value.map(serializeValue).join(',')}]`

  if (!isPlainObject(value))
    return ''

  const keys = Object.keys(value).sort()
  return `{${keys.map(key => `${JSON.stringify(key)}:${serializeValue(value[key])}`).join(',')}}`
}

/**
 * 根据 URL 和参数生成唯一请求 key
 * @param {string} url 请求 URL
 * @param {import('ofetch').FetchOptions} [options]
 * @returns {string} 请求 key
 */
function getRequestKey(url, options) {
  const method = (options?.method || 'GET').toUpperCase()
  const body = typeof options?.body === 'undefined' ? '' : serializeValue(options?.body)
  const params = typeof options?.params === 'undefined' ? '' : serializeValue(options?.params)
  return `${method}|${url}|${body}|${params}`
}

/**
 * 确保请求拥有唯一 id（用于并发去重校验）
 * @param {import('ofetch').FetchOptions} options
 * @returns {number} 请求 id
 */
function ensurePendingId(options) {
  if (options[PENDING_ID])
    return options[PENDING_ID]
  const id = ++requestSeq
  options[PENDING_ID] = id
  return id
}

/**
 * 创建并管理 AbortController（自动中止上一个相同请求）
 * @param {string} key 唯一 key
 * @param {number} id 请求 id
 * @returns {AbortController} 新创建的 AbortController
 */
function createAbortController(key, id) {
  const existing = pendingMap.get(key)
  if (existing)
    existing.controller.abort()

  const controller = new AbortController()
  pendingMap.set(key, { controller, id })
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
  const id = ensurePendingId(ctx.options)
  const controller = createAbortController(key, id)
  ctx.options.signal = controller.signal

  // 自动设置 Content-Type（仅在有 body 时设置）
  const headers = new Headers(ctx.options.headers || {})
  if (ctx.options.body instanceof FormData) {
    headers.delete('Content-Type') // 让浏览器自动设置 multipart 边界
  }
  else if (typeof ctx.options.body !== 'undefined' && !headers.has('Content-Type')) {
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
  const entry = pendingMap.get(key)
  if (entry && entry.id === ctx.options[PENDING_ID])
    pendingMap.delete(key)
}

/**
 * 错误处理（请求或响应阶段）
 * @param {import('ofetch').FetchContext} ctx
 */
async function handleError(ctx) {
  const url = getUrl(ctx)
  const key = getRequestKey(url, ctx.options)
  const entry = pendingMap.get(key)
  if (entry && entry.id === ctx.options[PENDING_ID])
    pendingMap.delete(key)
  console.error(`[Fetch Error] ${url}`, ctx.error)
}

/**
 * 创建 ofetch 实例
 */
const instance = ofetch.create({
  baseURL:
    (typeof window !== 'undefined' && window.manifest?.API)
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
  const requestOptions = options ? { ...options } : {}
  ensurePendingId(requestOptions)
  const key = getRequestKey(url, requestOptions)
  try {
    return await instance(url, requestOptions)
  }
  finally {
    const entry = pendingMap.get(key)
    if (entry && entry.id === requestOptions[PENDING_ID])
      pendingMap.delete(key)
  }
}

export { ofetch as oFetch, vFetch }
