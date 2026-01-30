import { vFetch } from '~/utils'

/**
 *
 * @param {import('ofetch').FetchOptions} [options]
 * @returns {Promise<import('~/types').FetchResponse<string>>}.
 */
export function postLamps(options) {
  return vFetch('/login/getVerifyImg', options)
}
