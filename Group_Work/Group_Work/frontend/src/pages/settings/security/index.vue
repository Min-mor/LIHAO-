<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import { useSmsCode } from '@/hooks/useSmsCode'
import { sendSecurityCode, updatePassword, updatePhone } from '@/service/security'
import { useUserStore } from '@/store/user'
import { safeAreaInsets } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
  },
})

const safeTop = safeAreaInsets?.top ?? 0
const safeBottom = safeAreaInsets?.bottom ?? 0

const paddingTop = computed(() => `${safeTop + 24}px`)
const paddingBottom = computed(() => `${safeBottom + 48}px`)

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const userPhone = computed(() => userInfo.value.phone || '')

const passwordVerifyVisible = ref(false)
const passwordResetVisible = ref(false)
const phoneDialogVisible = ref(false)

const passwordVerifyForm = reactive({
  phone: '',
  code: '',
})

const passwordResetForm = reactive({
  password: '',
  confirm: '',
})

const phoneForm = reactive({
  phone: '',
  code: '',
})

const passwordTicket = ref<string | null>(null)
const passwordLoading = ref(false)
const phoneLoading = ref(false)

function showToast(message: string, icon: 'none' | 'success' = 'none') {
  uni.showToast({ title: message, icon, duration: 1500 })
}

function formatPhoneDisplay(phone: string) {
  if (!phone)
    return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const passwordSms = useSmsCode({
  phoneGetter: () => passwordVerifyForm.phone,
  async sendCode(phone) {
    const res = await sendSecurityCode({ phone, scene: 'password' })
    return { code: res.code }
  },
  onInvalidPhone: () => showToast('请输入正确的手机号'),
})

const phoneSms = useSmsCode({
  phoneGetter: () => phoneForm.phone,
  async sendCode(phone) {
    const res = await sendSecurityCode({ phone, scene: 'phone' })
    return { code: res.code }
  },
  onInvalidPhone: () => showToast('请输入正确的新手机号'),
})

const passwordSendText = computed(() => passwordSms.countdown.value > 0 ? `${passwordSms.countdown.value}s` : '发送验证码')
const phoneSendText = computed(() => phoneSms.countdown.value > 0 ? `${phoneSms.countdown.value}s` : '发送验证码')

function openPasswordFlow() {
  if (!userPhone.value) {
    showToast('未获取到手机号，请重新登录')
    return
  }
  passwordVerifyForm.phone = userPhone.value
  passwordVerifyForm.code = ''
  passwordSms.reset()
  passwordTicket.value = null
  passwordVerifyVisible.value = true
}

function closePasswordVerify() {
  passwordVerifyVisible.value = false
}

async function handlePasswordSendCode() {
  if (passwordSms.isCounting.value)
    return
  const success = await passwordSms.request()
  if (success) {
    const code = passwordSms.lastCode.value
    showToast(code ? `验证码已发送（调试码：${code}）` : '验证码已发送')
    if (code)
      console.debug('[sms] security password code:', code)
  }
}

function confirmPasswordVerify() {
  const inputCode = passwordVerifyForm.code.trim()
  if (!inputCode) {
    showToast('请输入验证码')
    return
  }
  if (passwordSms.lastCode.value && inputCode !== passwordSms.lastCode.value) {
    showToast('验证码不正确')
    return
  }
  passwordTicket.value = inputCode
  passwordResetForm.password = ''
  passwordResetForm.confirm = ''
  passwordVerifyVisible.value = false
  passwordResetVisible.value = true
}

function closePasswordReset() {
  passwordResetVisible.value = false
}

async function submitPasswordReset() {
  if (!passwordTicket.value) {
    showToast('请先完成短信验证')
    return
  }
  const newPassword = passwordResetForm.password.trim()
  const confirmPassword = passwordResetForm.confirm.trim()
  if (!newPassword || newPassword.length < 6) {
    showToast('新密码至少 6 位')
    return
  }
  if (newPassword !== confirmPassword) {
    showToast('两次输入的密码不一致')
    return
  }
  passwordLoading.value = true
  try {
    await updatePassword({ phone: passwordVerifyForm.phone, code: passwordTicket.value, newPassword })
    showToast('密码已更新', 'success')
    passwordResetVisible.value = false
    passwordTicket.value = null
  }
  catch (error) {
    const message = error instanceof Error ? error.message : '密码更新失败'
    showToast(message)
  }
  finally {
    passwordLoading.value = false
  }
}

function openPhoneFlow() {
  phoneForm.phone = ''
  phoneForm.code = ''
  phoneSms.reset()
  phoneDialogVisible.value = true
}

function closePhoneDialog() {
  phoneDialogVisible.value = false
}

async function handlePhoneSendCode() {
  if (phoneSms.isCounting.value)
    return
  const success = await phoneSms.request()
  if (success) {
    const code = phoneSms.lastCode.value
    showToast(code ? `验证码已发送（调试码：${code}）` : '验证码已发送')
    if (code)
      console.debug('[sms] security phone code:', code)
  }
}

async function submitPhoneChange() {
  const newPhone = phoneForm.phone.trim()
  if (!/^\d{11}$/.test(newPhone)) {
    showToast('请输入 11 位新手机号')
    return
  }
  if (!phoneForm.code.trim()) {
    showToast('请输入验证码')
    return
  }
  if (phoneSms.lastCode.value && phoneForm.code.trim() !== phoneSms.lastCode.value) {
    showToast('验证码不正确')
    return
  }

  phoneLoading.value = true
  try {
    await updatePhone({ phone: newPhone, code: phoneForm.code.trim() })
    userStore.setUserInfo({ ...userInfo.value, phone: newPhone })
    showToast('手机号已更新', 'success')
    phoneDialogVisible.value = false
  }
  catch (error) {
    const message = error instanceof Error ? error.message : '手机号更新失败'
    showToast(message)
  }
  finally {
    phoneLoading.value = false
  }
}
</script>

<template>
  <view class="security" :style="{ paddingTop, paddingBottom }">
    <floating-back :left-offset="32" :top-offset="32" re-launch-fallback="/pages/profile/index" />

    <view class="security__header">
      <text class="security__title">账号安全</text>
      <text class="security__subtitle">守护账号信息与登录凭证</text>
    </view>

    <view class="security__meta">
      当前手机号：<text class="security__meta-phone">{{ formatPhoneDisplay(userPhone) || '未绑定' }}</text>
    </view>

    <view class="security__card">
      <view class="security__item" @click="openPasswordFlow">
        <view class="security__item-info">
          <text class="security__item-title">修改密码</text>
          <text class="security__item-desc">短信验证后设置新的登录密码</text>
        </view>
        <wd-icon name="arrow-right" size="32rpx" />
      </view>
      <view class="security__item" @click="openPhoneFlow">
        <view class="security__item-info">
          <text class="security__item-title">更换手机号</text>
          <text class="security__item-desc">变更账号绑定的登录手机号</text>
        </view>
        <wd-icon name="arrow-right" size="32rpx" />
      </view>
    </view>

    <transition name="security-fade">
      <view v-if="passwordVerifyVisible" class="security__overlay" @click.self="closePasswordVerify">
        <view class="security__dialog">
          <view class="security__dialog-header">
            <text class="security__dialog-title">短信验证</text>
            <wd-icon name="close" size="28px" class="security__dialog-close" @click="closePasswordVerify" />
          </view>
          <view class="security__dialog-body">
            <text class="security__dialog-tip">验证码将发送至 {{ formatPhoneDisplay(passwordVerifyForm.phone) }}</text>
            <wd-input
              v-model="passwordVerifyForm.code"
              placeholder="请输入验证码"
              :maxlength="6"
              type="number"
              no-border
              custom-class="security__input"
            >
              <template #suffix>
                <view
                  class="security__action"
                  :class="{ 'is-disabled': passwordSms.isCounting.value }"
                  @click.stop="handlePasswordSendCode"
                >
                  {{ passwordSendText }}
                </view>
              </template>
            </wd-input>
          </view>
          <view class="security__dialog-actions">
            <view class="security__btn security__btn--ghost" @click="closePasswordVerify">
              取消
            </view>
            <view class="security__btn security__btn--primary" @click="confirmPasswordVerify">
              下一步
            </view>
          </view>
        </view>
      </view>
    </transition>

    <transition name="security-fade">
      <view v-if="passwordResetVisible" class="security__overlay" @click.self="closePasswordReset">
        <view class="security__dialog">
          <view class="security__dialog-header">
            <text class="security__dialog-title">设置新密码</text>
            <wd-icon name="close" size="28px" class="security__dialog-close" @click="closePasswordReset" />
          </view>
          <view class="security__dialog-body security__dialog-body--stack">
            <wd-input
              v-model="passwordResetForm.password"
              placeholder="请输入新密码"
              show-password
              clearable
              no-border
              custom-class="security__input"
            />
            <wd-input
              v-model="passwordResetForm.confirm"
              placeholder="请再次输入新密码"
              show-password
              clearable
              no-border
              custom-class="security__input"
            />
          </view>
          <view class="security__dialog-actions">
            <view class="security__btn security__btn--ghost" @click="closePasswordReset">
              取消
            </view>
            <view
              class="security__btn security__btn--primary"
              :class="{ 'is-loading': passwordLoading }"
              @click="submitPasswordReset"
            >
              确认修改
            </view>
          </view>
        </view>
      </view>
    </transition>

    <transition name="security-fade">
      <view v-if="phoneDialogVisible" class="security__overlay" @click.self="closePhoneDialog">
        <view class="security__dialog">
          <view class="security__dialog-header">
            <text class="security__dialog-title">更换手机号</text>
            <wd-icon name="close" size="28px" class="security__dialog-close" @click="closePhoneDialog" />
          </view>
          <view class="security__dialog-body security__dialog-body--stack">
            <wd-input
              v-model="phoneForm.phone"
              placeholder="请输入新的手机号"
              :maxlength="11"
              type="number"
              no-border
              custom-class="security__input"
            />
            <wd-input
              v-model="phoneForm.code"
              placeholder="请输入验证码"
              :maxlength="6"
              type="number"
              no-border
              custom-class="security__input"
            >
              <template #suffix>
                <view
                  class="security__action"
                  :class="{ 'is-disabled': phoneSms.isCounting.value }"
                  @click.stop="handlePhoneSendCode"
                >
                  {{ phoneSendText }}
                </view>
              </template>
            </wd-input>
          </view>
          <view class="security__dialog-actions">
            <view class="security__btn security__btn--ghost" @click="closePhoneDialog">
              取消
            </view>
            <view
              class="security__btn security__btn--primary"
              :class="{ 'is-loading': phoneLoading }"
              @click="submitPhoneChange"
            >
              保存
            </view>
          </view>
        </view>
      </view>
    </transition>
  </view>
</template>

<style scoped lang="scss">
@use '@/style/index.scss' as *;

$card-bg: mix($color-base-highlight, #fff, 92%);
$dialog-bg: mix($color-base-highlight, #fff, 96%);

.security {
  position: relative;
  min-height: 100vh;
  background: mix($color-base-bg, #fff, 96%);
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.security__header {
  margin-top: 120rpx;
  padding-left: 16rpx;
}

.security__title {
  font-size: 48rpx;
  font-weight: 650;
  color: rgba($color-base-text, 0.94);
}

.security__subtitle {
  display: block;
  margin-top: 12rpx;
  font-size: 28rpx;
  color: rgba($color-base-text, 0.6);
}

.security__meta {
  padding: 0 16rpx;
  font-size: 26rpx;
  color: rgba($color-base-text, 0.6);
}

.security__meta-phone {
  margin-left: 8rpx;
  color: rgba($color-base-text, 0.85);
  font-weight: 550;
}

.security__card {
  border-radius: 48rpx;
  background: $card-bg;
  box-shadow: 0 22rpx 42rpx rgba($color-base-text, 0.1);
  overflow: hidden;
}

.security__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 48rpx;
  border-bottom: 1px solid rgba($color-base-border, 0.08);
  transition: background 0.2s ease;
}

.security__item:last-child {
  border-bottom: none;
}

.security__item-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.security__item-title {
  font-size: 34rpx;
  font-weight: 560;
  color: rgba($color-base-text, 0.92);
}

.security__item-desc {
  font-size: 26rpx;
  color: rgba($color-base-text, 0.55);
}

.security__item:hover {
  background: rgba($color-brand-primary, 0.06);
}

.security__overlay {
  position: fixed;
  inset: 0;
  background: rgba($color-base-text, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60rpx 48rpx;
  z-index: 999;
}

.security__dialog {
  width: 640rpx;
  max-width: 90vw;
  border-radius: 36rpx;
  background: $dialog-bg;
  box-shadow: 0 26rpx 48rpx rgba($color-base-text, 0.12);
  padding: 48rpx 40rpx 42rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.security__dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.security__dialog-title {
  font-size: 36rpx;
  font-weight: 600;
  color: rgba($color-base-text, 0.94);
}

.security__dialog-close {
  color: rgba($color-base-text, 0.45);
}

.security__dialog-body {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.security__dialog-body--stack {
  gap: 28rpx;
}

.security__dialog-tip {
  font-size: 26rpx;
  color: rgba($color-base-text, 0.55);
}

.security__dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 24rpx;
}

.security__btn {
  min-width: 160rpx;
  padding: 22rpx 36rpx;
  border-radius: 999px;
  font-size: 30rpx;
  text-align: center;
  transition: opacity 0.2s ease;
}

.security__btn--ghost {
  background: transparent;
  border: 1px solid rgba($color-base-border, 0.18);
  color: rgba($color-base-text, 0.75);
}

.security__btn--primary {
  background: rgba($color-brand-primary, 0.92);
  color: $color-base-bg;
  box-shadow: 0 12rpx 22rpx rgba($color-brand-primary, 0.25);
}

.security__btn.is-loading {
  opacity: 0.68;
}

.security__action {
  padding: 10rpx 0 10rpx 24rpx;
  font-size: 26rpx;
  color: rgba($color-brand-primary, 0.92);
  white-space: nowrap;
}

.security__action.is-disabled {
  color: rgba($color-base-text, 0.35);
}

.security__input {
  --wot-input-padding-y: 0rpx;
  --wot-input-bg-color: transparent;
  --wot-input-border-bottom-color: transparent;
  --wot-input-border-color: transparent;
  --wot-input-focus-border-color: transparent;
  --wot-input-border-width: 0;
  --wot-input-placeholder-color: rgba(var(--color-text-secondary-rgb), 0.75);
  --wot-input-color: rgba(var(--color-text-primary-rgb), 0.95);
  --wot-input-placeholder-font-size: 26rpx;
  --wot-input-font-size: 30rpx;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.security__input :deep(.wd-input),
.security__input :deep(.wd-input__wrapper),
.security__input :deep(.wd-input__container),
.security__input :deep(.wd-input__body),
.security__input :deep(.wd-input__value),
.security__input :deep(.wd-input__inner) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
}

.security__input :deep(.wd-input__container) {
  border-radius: 28rpx !important;
}

.security__input :deep(.wd-input__value) {
  padding: 0 !important;
  font-size: 30rpx;
}

.security__input :deep(.wd-input__border),
.security__input :deep(.wd-input__line) {
  display: none !important;
}

.security__input :deep(.wd-input__prefix),
.security__input :deep(.wd-input__clear),
.security__input :deep(.wd-input__suffix) {
  background: transparent !important;
  margin-left: 16rpx;
}

.security__input :deep(.wd-input__icon) {
  background: transparent !important;
}

.security-fade-enter-active,
.security-fade-leave-active {
  transition: opacity 0.18s ease;
}

.security-fade-enter-from,
.security-fade-leave-to {
  opacity: 0;
}
</style>
