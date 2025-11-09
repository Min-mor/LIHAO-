import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface LoginPromptOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loginPath?: string
  onConfirm?: () => void
  onCancel?: () => void
}

const DEFAULT_OPTIONS: Required<Omit<LoginPromptOptions, 'onConfirm' | 'onCancel'>> = {
  title: '提示',
  message: '当前未登录，是否前往登录注册？',
  confirmText: '去登录',
  cancelText: '取消',
  loginPath: '/pages/login/index',
}

export const useLoginPromptStore = defineStore(
  'uiLoginPrompt',
  () => {
    const visible = ref(false)
    const options = ref<LoginPromptOptions>({ ...DEFAULT_OPTIONS })

    function open(overrides?: LoginPromptOptions) {
      options.value = { ...DEFAULT_OPTIONS, ...overrides }
      visible.value = true
    }

    function close() {
      visible.value = false
    }

    function confirm() {
      const current = { ...DEFAULT_OPTIONS, ...options.value }
      close()
      if (current.onConfirm) {
        current.onConfirm()
        return
      }
      const target = current.loginPath || DEFAULT_OPTIONS.loginPath
      if (target)
        uni.navigateTo({ url: target })
    }

    function cancel() {
      close()
      options.value.onCancel?.()
    }

    return {
      visible,
      options,
      open,
      close,
      confirm,
      cancel,
    }
  },
  {
    persist: false,
  },
)
