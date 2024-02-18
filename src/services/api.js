import { vFetch } from '~/utils'

/**
 *
 * @param {string} params
 * @returns {Promise<import('~/types').FetchResponse<string>>}.
 */
export function postLamps(params) {
  return vFetch('/login/getVerifyImg', params)
}
