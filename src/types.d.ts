import type { App } from 'vue'
import type { Router } from 'vue-router'

export interface Context {
  app: App<Element>
  router: Router
}
export type UserModule = (ctx: Context) => void | Promise<void>
export interface ClientOptions {
  /**
   * The application's root container query selector.
   *
   * @default `#app`
   */
  rootContainer?: string | Element
}
export interface FetchResponse<T> {
  body: T
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

declare global {
  const definePage: (typeof import('vue-router/experimental'))['definePage']
}
