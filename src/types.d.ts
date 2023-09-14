import type { App } from 'vue'

export interface Context {
  app: App<Element>
}
export type UserModule = (ctx: Context) => void
export type RouteModule = {
  path: string;
  name: string;
  component: Promise<typeof import("*.vue")>
}
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
