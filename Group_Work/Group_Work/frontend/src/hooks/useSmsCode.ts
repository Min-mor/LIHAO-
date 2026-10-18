import { computed, onBeforeUnmount, ref } from 'vue'

interface UseSmsCodeOptions {
  phoneGetter: () => string
  sendCode?: (phone: string) => Promise<{ code?: string } | void>
  validatePhone?: (phone: string) => boolean
  countdownSeconds?: number
  onInvalidPhone?: () => void
}

export function useSmsCode(options: UseSmsCodeOptions) {
  const countdown = ref(0)
  const sending = ref(false)
  const hasRequested = ref(false)
  const lastCode = ref<string | null>(null)

  const validate = options.validatePhone ?? (phone => /^\d{11}$/.test(phone.trim()))
  const countdownSeconds = options.countdownSeconds ?? 60

  const isCounting = computed(() => countdown.value > 0)

  let timer: ReturnType<typeof setInterval> | null = null

  function clearTimer() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function startCountdown(seconds = countdownSeconds) {
    clearTimer()
    countdown.value = seconds
    timer = setInterval(() => {
      if (countdown.value <= 1) {
        clearTimer()
        countdown.value = 0
        return
      }
      countdown.value -= 1
    }, 1000)
  }

  function reset() {
    clearTimer()
    countdown.value = 0
    sending.value = false
    hasRequested.value = false
    lastCode.value = null
  }

  async function request(force = false) {
    const phone = options.phoneGetter().trim()
    if (!validate(phone)) {
      options.onInvalidPhone?.()
      return false
    }

    hasRequested.value = true

    if (sending.value)
      return false

    if (!force && countdown.value > 0)
      return false

    try {
      sending.value = true
      const result = await options.sendCode?.(phone)
      if (result && typeof result === 'object' && 'code' in result)
        lastCode.value = result.code ?? null
      startCountdown()
      return true
    }
    finally {
      sending.value = false
    }
  }

  function dispose() {
    reset()
  }

  onBeforeUnmount(dispose)

  return {
    countdown,
    sending,
    hasRequested,
    lastCode,
    isCounting,
    request,
    resend: () => request(true),
    reset,
    dispose,
  }
}
