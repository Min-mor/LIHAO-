import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useTokenStore } from '@/store/token'
import { useLoginPromptStore } from '@/store/uiLoginPrompt'

export interface LoginGuardOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  loginPath?: string
  onConfirm?: () => void
  onCancel?: () => void
}

const DEFAULT_OPTIONS: Required<Omit<LoginGuardOptions, 'onConfirm' | 'onCancel'>> = {
  title: '提示',
  message: '当前未登录，是否前往登录注册？',
  confirmText: '去登录',
  cancelText: '取消',
  loginPath: '/pages/login/index',
}

export function useLoginGuard(initialOptions?: LoginGuardOptions) {
  const options = ref<LoginGuardOptions>({ ...DEFAULT_OPTIONS, ...initialOptions })

  const tokenStore = useTokenStore()
  const { hasLogin } = storeToRefs(tokenStore)
  const loginPrompt = useLoginPromptStore()

  const isLoggedIn = computed(() => hasLogin.value)

  function promptLogin(overrides?: LoginGuardOptions) {
    const finalOptions = { ...options.value, ...overrides }
    loginPrompt.open(finalOptions)
  }

  function ensureLogin(action?: () => void, overrides?: LoginGuardOptions) {
    if (isLoggedIn.value) {
      action?.()
      return true
    }

    promptLogin(overrides)
    return false
  }

  function updateOptions(nextOptions: LoginGuardOptions) {
    options.value = { ...options.value, ...nextOptions }
  }

  return {
    isLoggedIn,
    ensureLogin,
    promptLogin,
    updateOptions,
  }
}
