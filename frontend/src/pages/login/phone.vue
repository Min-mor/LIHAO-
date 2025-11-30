<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useToast } from 'wot-design-uni'
import { useSmsCode } from '@/hooks/useSmsCode'
import { sendSecurityCode } from '@/service/security'
import { useTokenStore } from '@/store/token'
import { isPageTabbar, tabbarStore } from '@/tabbar/store'
import { ensureDecodeURIComponent, HOME_PAGE } from '@/utils'

defineOptions({
  name: 'LoginPhonePage',
})

definePage({
  style: {
    navigationBarTitleText: '手机号登录',
    navigationStyle: 'custom',
  },
})

const form = reactive({
  phone: '',
  code: '',
  password: '',
  agree: false,
})

const loginMode = ref<'sms' | 'password'>('sms')
const { info: showInfo } = useToast()
const tokenStore = useTokenStore()

const showPassword = ref(false)
const redirectUrl = ref<string | null>(null)

const cleanedPhone = computed(() => form.phone.replace(/\s/g, ''))

const sms = useSmsCode({
  phoneGetter: () => cleanedPhone.value,
  async sendCode(phone) {
    const res = await sendSecurityCode({ phone, scene: 'login' })
    return { code: res.code }
  },
  onInvalidPhone: () => showInfo({ msg: '请输入正确手机号' }),
})

const isSmsMode = computed(() => loginMode.value === 'sms')
const formattedPhone = computed({
  get: () => form.phone,
  set: (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    form.phone = digits.replace(/(\d{3})(\d{4})(\d{0,4})/, (_, a, b, c) =>
      c ? `${a} ${b} ${c}` : `${a} ${b}`).trim()
  },
})
const showCodeField = computed(() => isSmsMode.value && sms.hasRequested.value)
const canSendCode = computed(
  () => isSmsMode.value && sms.hasRequested.value && validatePhone(cleanedPhone.value) && sms.countdown.value === 0 && !sms.sending.value,
)
const sendButtonLabel = computed(() => (sms.countdown.value > 0 ? `重新发送 ${sms.countdown.value}s` : '重新发送'))
const submitDisabled = computed(() => {
  if (!validatePhone(cleanedPhone.value)) {
    return true
  }
  if (isSmsMode.value) {
    return sms.hasRequested.value && !form.code
  }
  return !form.password
})
const submitText = computed(() => (isSmsMode.value ? '验证并登录' : '密码登录'))

function validatePhone(phone: string) {
  return /^\d{11}$/.test(phone.trim())
}

function clearTimer() {}

function resetCodeState() {
  sms.reset()
  showPassword.value = false
  form.code = ''
}

function startCountdown(seconds = 60) {}

async function requestSmsCode() {
  if (!validatePhone(cleanedPhone.value)) {
    showInfo({ msg: '请输入正确手机号' })
    return false
  }
  const ok = await sms.request()
  if (ok) {
    form.code = ''
    if (sms.lastCode.value)
      console.debug('[sms] code(debug):', sms.lastCode.value)
    showInfo({ msg: sms.lastCode.value ? `验证码已发送（调试码：${sms.lastCode.value}）` : '验证码已发送' })
    return true
  }
  return false
}

async function handleSendCode() {
  if (!isSmsMode.value || !sms.hasRequested.value || sms.countdown.value > 0 || sms.sending.value) {
    return
  }
  if (await requestSmsCode()) {
    showInfo({ msg: sms.lastCode.value ? `验证码已重新发送（调试码：${sms.lastCode.value}）` : '验证码已重新发送' })
    if (sms.lastCode.value)
      console.debug('[sms] code(debug,resend):', sms.lastCode.value)
  }
}

async function handleSubmit() {
  if (!validatePhone(cleanedPhone.value)) {
    showInfo({ msg: '请输入合法手机号' })
    return
  }
  if (isSmsMode.value) {
    if (!sms.hasRequested.value || sms.countdown.value === 0) {
      const sent = await requestSmsCode()
      if (sent) {
        return
      }
    }
    if (!form.code) {
      showInfo({ msg: '请输入验证码' })
      return
    }
    if (sms.lastCode.value) {
      if (form.code !== sms.lastCode.value) {
        showInfo({ msg: '验证码不正确' })
        return
      }
    }
  }
  else if (!form.password) {
    showInfo({ msg: '请输入密码' })
    return
  }

  try {
    if (isSmsMode.value) {
      await tokenStore.loginBySms(cleanedPhone.value, form.code)
    }
    else {
      await tokenStore.login({
        username: cleanedPhone.value,
        password: form.password,
      })
    }

    showInfo({ msg: '登录成功' })
    resetCodeState()
    navigateAfterLogin()
  }
  catch (error) {
    const message = error instanceof Error ? error.message : '登录失败，请稍后再试'
    showInfo({ msg: message })
  }
}

function handleBack() {
  uni.navigateBack({ delta: 1 })
}

function toggleLoginMode() {
  loginMode.value = isSmsMode.value ? 'password' : 'sms'
  form.code = ''
  form.password = ''
  resetCodeState()
}

function navigateAfterLogin() {
  const target = redirectUrl.value || HOME_PAGE

  const reset = () => {
    redirectUrl.value = null
  }

  if (isPageTabbar(target)) {
    const success = () => {
      tabbarStore.setAutoCurIdx(target)
      reset()
    }
    const fail = () => {
      uni.reLaunch({
        url: target,
        success,
        complete: reset,
      })
    }

    uni.switchTab({ url: target, success, fail, complete: () => {} })
    return
  }

  uni.redirectTo({ url: target, complete: reset })
}

onLoad((options: { redirect?: string }) => {
  if (options?.redirect) {
    redirectUrl.value = ensureDecodeURIComponent(options.redirect)
  }
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  currentPage.eventChannel?.on('prefillPhone', (phone: string) => {
    if (validatePhone(phone)) {
      form.phone = phone
    }
  })
})

watch(
  () => form.phone,
  (value) => {
    if (!value) {
      resetCodeState()
    }
  },
)

onBeforeUnmount(() => {
  sms.dispose()
})
</script>

<template>
  <view class="phone-login">
    <view class="phone-login__close" @click="handleBack">
      <wd-icon name="close" size="20px" />
    </view>

    <view class="phone-login__content">
      <view class="phone-login__header">
        <text class="phone-login__title">手机号登录</text>
        <text class="phone-login__subtitle">未注册的手机号登录成功后将自动注册</text>
      </view>

      <view class="phone-login__body">
        <view class="phone-login__phone">
          <text class="phone-login__prefix">+86</text>
          <wd-input
            v-model="formattedPhone"
            placeholder="请输入手机号"
            :maxlength="13"
            keyboard-type="number"
            no-border
            clearable
            custom-class="phone-login__input phone-login__input--phone"
          />
        </view>

        <view v-if="isSmsMode && showCodeField" class="phone-login__code">
          <wd-input
            v-model="form.code"
            placeholder="请输入验证码"
            :maxlength="6"
            keyboard-type="number"
            clearable
            no-border
            custom-class="phone-login__input phone-login__input--code"
          >
            <template #suffix>
              <view
                class="phone-login__code-btn"
                :class="{ 'is-disabled': !canSendCode }"
                @click="handleSendCode"
              >
                {{ sendButtonLabel }}
              </view>
            </template>
          </wd-input>
        </view>

        <view v-else-if="!isSmsMode" class="phone-login__password">
          <wd-icon name="lock" size="18px" class="phone-login__field-icon" />
          <wd-input
            v-model="form.password"
            placeholder="请输入密码"
            no-border
            :show-password="true"
            :clearable="false"
            custom-class="phone-login__input phone-login__input--password"
            @change="showPassword = $event.detail.showPassword"
          />
        </view>

        <view class="phone-login__switch" @click="toggleLoginMode">
          <wd-icon name="translate-bold" size="18px" />
          <text>{{ isSmsMode ? '密码登录' : '验证码登录' }}</text>
        </view>
      </view>
    </view>

    <view class="phone-login__footer">
      <wd-button
        class="phone-login__submit"
        type="primary"
        size="large"
        :disabled="submitDisabled"
        @click="handleSubmit"
      >
        {{ submitText }}
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.phone-login {
  height: 100vh;
  overflow: hidden;
  padding: 48rpx 48rpx 72rpx;
  background: linear-gradient(
    180deg,
    var(--color-bg-primary) 0%,
    rgba(var(--color-bg-primary-rgb), 0.92) 40%,
    rgba(var(--color-surface-rgb), 0.95) 70%,
    var(--color-surface) 100%
  );
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
}

.phone-login__close {
  align-self: flex-start;
  padding: 12rpx;
  color: rgba(var(--color-text-primary-rgb), 0.7);
}

.phone-login__title {
  font-size: 48rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.phone-login__subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: var(--color-text-muted);
}

.phone-login__content {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.phone-login__header {
  text-align: center;
  padding: 0 16rpx;
}
.phone-login__body {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  align-items: center;
  padding: 0 16rpx;
  margin-top: 30px;
}

.phone-login__phone {
  display: flex;
  align-items: center;
  gap: 16rpx;
  justify-content: flex-start;
  width: 100%;
  max-width: 520rpx;
}

.phone-login__input {
  flex: 1;
  --wot-input-padding-y: 0rpx;
  --wot-input-bg-color: transparent;
  --wot-input-border-bottom-color: transparent;
  --wot-input-border-color: transparent;
  --wot-input-focus-border-color: transparent;
  --wot-input-border-width: 0;
  --wot-input-placeholder-color: rgba(var(--color-text-secondary-rgb), 0.8);
  --wot-input-color: var(--color-text-primary);
  --wot-input-placeholder-font-size: 26rpx;
  --wot-input-font-size: 30rpx;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.phone-login__input :deep(.wd-input__container) {
  background: transparent !important;
  padding: 0 !important;
  border: none !important;
}

.phone-login__input :deep(.wd-input__body),
.phone-login__input :deep(.wd-input__value) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.phone-login__input :deep(.wd-input) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.phone-login__input :deep(.wd-input__inner) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.phone-login__input :deep(.wd-input__border),
.phone-login__input :deep(.wd-input__line) {
  display: none !important;
}

.phone-login__input :deep(.wd-input__clear) {
  right: 12rpx;
}

.phone-login__password :deep(.wd-input__suffix) {
  display: flex;
  align-items: center;
  height: 100%;
  color: rgba(var(--color-text-primary-rgb), 0.6);
}

.phone-login__password .phone-login__input {
  padding-right: 16rpx;
}

.phone-login__code {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  align-items: center;
  width: 100%;
}

.phone-login__code-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24rpx;
  padding: 4rpx 0;
  width: 100%;
  max-width: 520rpx;
}

.phone-login__code-label {
  color: rgba(var(--color-text-secondary-rgb), 0.9);
}

.phone-login__code-action {
  color: rgba(var(--color-brand-primary-rgb), 0.9);
  cursor: pointer;
}

.phone-login__code-timer {
  color: rgba(var(--color-text-secondary-rgb), 0.6);
}

.phone-login__code :deep(.wd-input__suffix) {
  display: flex;
  align-items: center;
}

.phone-login__code .phone-login__input {
  width: 100%;
  max-width: 520rpx;
}

.phone-login__code :deep(.wd-input__container) {
  padding-left: 12rpx;
}

.phone-login__prefix {
  font-size: 24rpx;
  color: rgba(var(--color-text-secondary-rgb), 0.95);
  letter-spacing: 1rpx;
}

.phone-login__field-icon {
  color: rgba(var(--color-text-primary-rgb), 0.7);
}

.phone-login__toggle {
  color: rgba(var(--color-text-primary-rgb), 0.6);
}

.phone-login__switch {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: rgba(var(--color-text-primary-rgb), 0.65);
  padding: 4rpx 0;
  width: 100%;
  max-width: 520rpx;
  margin: 0 auto;
  justify-content: flex-start;
}

.phone-login__footer {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  margin-top: auto;
}

.phone-login__code-btn {
  min-width: 180rpx;
  padding: 12rpx 0;
  text-align: center;
  border-radius: 999rpx;
  font-size: 24rpx;
  color: var(--color-brand-primary);
  background: var(--color-brand-soft);
}

.phone-login__code-btn.is-disabled {
  color: rgba(var(--color-brand-primary-rgb), 0.35);
  background: rgba(var(--color-brand-primary-rgb), 0.08);
}

.phone-login__submit {
  margin-top: 24rpx;
  border-radius: 999rpx;
  background: linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-accent));
  border: none;
  box-shadow: 0 16rpx 32rpx rgba(60, 169, 119, 0.26);
  --wot-button-padding-y: 26rpx;
  font-size: 30rpx;
}

.phone-login__submit:disabled {
  opacity: 0.5;
}

.phone-login :deep(.wd-checkbox__label) {
  font-size: 24rpx;
}
</style>
