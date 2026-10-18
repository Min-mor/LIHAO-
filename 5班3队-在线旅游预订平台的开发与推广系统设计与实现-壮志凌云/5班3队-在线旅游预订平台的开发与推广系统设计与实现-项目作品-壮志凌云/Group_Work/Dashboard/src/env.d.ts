/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@astrojs/vue/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}

declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_API_BASE_URL?: string
    readonly PUBLIC_USE_MOCK_AUTH?: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

export {}
