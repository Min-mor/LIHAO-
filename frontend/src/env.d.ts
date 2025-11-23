/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  /** 网站标题，应用名称 */
  readonly VITE_APP_TITLE: string
  /** 服务端口号 */
  readonly VITE_SERVER_PORT: string
  /** 后台接口地址 */
  readonly VITE_SERVER_BASEURL: string
  /** H5是否需要代理 */
  readonly VITE_APP_PROXY_ENABLE: 'true' | 'false'
  /** H5是否需要代理，需要的话有个前缀 */
  readonly VITE_APP_PROXY_PREFIX: string
  /** 后端是否有统一前缀 /api */
  readonly VITE_SERVER_HAS_API_PREFIX: 'true' | 'false'
  /** 认证模式，'single' | 'double' ==> 单token | 双token */
  readonly VITE_AUTH_MODE: 'single' | 'double'
  /** 接口模式，mock 或 real */
  readonly VITE_API_MODE: 'mock' | 'real'
  /** 是否清除console */
  readonly VITE_DELETE_CONSOLE: string
  /** 腾讯位置服务 WebService Key */
  readonly VITE_TENCENT_MAP_KEY?: string
  /** 短信供应商模式，none | vendor */
  readonly VITE_SMS_VENDOR_MODE?: 'none' | 'vendor'
  /** 短信供应商请求地址 */
  readonly VITE_SMS_VENDOR_ENDPOINT?: string
  /** 短信供应商模板中的 name 字段，可选 */
  readonly VITE_SMS_VENDOR_NAME?: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __VITE_APP_PROXY__: 'true' | 'false'
