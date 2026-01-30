import type { App } from 'vue'

export interface Context {
  app: App<Element>
}
export type UserModule = (ctx: Context) => void
export interface ClientOptions {
  /**
   * The application's root container query selector.
   *
   * @default `#app`
   */
  rootContainer?: string | Element
}
declare interface FetchResponse<T> {
  body: T
}
