import { isH5, isMpWeixin } from '@uni-helper/uni-env'

import fontInlineUrl from '@/../static/fonts/NotoSerifSC-Regular.ttf?inline'

const NOTO_SERIF_FAMILY = 'Noto Serif SC'
let registered = false

export function initCustomFont() {
  // H5 使用 CSS @font-face，微信小程序端避免通过本地路径加载字体，防止控制台报错
  if (registered || isH5 || isMpWeixin) {
    return
  }

  registered = true

  Promise.resolve(fontInlineUrl as string | undefined)
    .then((source) => {
      if (!source) {
        registered = false
        return
      }

      const options: UniNamespace.LoadFontFaceOptions = {
        family: NOTO_SERIF_FAMILY,
        source: `url("${source}") format('truetype')`,
        global: true,
      }

      uni.loadFontFace(options)
    })
    .catch(() => {
      registered = false
    })
}

export { NOTO_SERIF_FAMILY }
