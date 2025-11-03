import { isH5 } from '@uni-helper/uni-env'

import fontInlineUrl from '@/../static/fonts/NotoSerifSC-Regular.ttf?inline'

const NOTO_SERIF_FAMILY = 'Noto Serif SC'
let registered = false

export function initCustomFont() {
  if (registered || isH5) {
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
