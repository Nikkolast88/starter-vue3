import { ofetch } from 'ofetch'

const instance = ofetch.create({
  baseURL: 'http://192.168.54.140/iot-api',
  timeout: 30000,
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
 */
async function onRequest() { }

/**
 * 请求错误
 */
async function onRequestError() { }

/**
 * 响应
 */
async function onResponse() { }

/**
 * 响应错误
 */
async function onResponseError() { }

/**
 *
 * @template T
 * @param {string} url 请求地址
 * @param {*} [options] 参数
 * @returns {Promise<import('~/types').FetchResponse<T>>}
 */
async function vFetch(url, options) {
  return instance(url, options)
}
export { vFetch, ofetch as oFetch }
