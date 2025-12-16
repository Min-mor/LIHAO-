<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { isMpWeixin } from '@uni-helper/uni-env'
import { computed, ref } from 'vue'
import { useToast } from 'wot-design-uni'
import { tabbarCacheEnable } from '@/tabbar/config'
import { tabbarStore } from '@/tabbar/store'
import { HOME_PAGE } from '@/utils'

defineOptions({
  name: 'LoginLandingPage',
})

const heroImage = 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80'

definePage({
  type: 'login',
  style: {
    navigationStyle: 'custom',
  },
  excludeLoginPath: true,
})

const isMiniProgram = ref(false)
const isAppPlatform = ref(false)
const showChannelSheet = ref(false)
const safeAreaTop = ref('32px')

const showOtherChannels = computed(() => !isMiniProgram.value)
const primaryButtonText = computed(() => {
  if (isMiniProgram.value) {
    return '微信登录'
  }
  return '手机号登录'
})
const secondaryButtonVisible = computed(() => isMiniProgram.value)

const { info: showInfo } = useToast()

interface ChannelOption {
  type: 'qq'
  icon: string
}

const channelOptions: ChannelOption[] = [{ type: 'qq', icon: '/static/icons/qq.svg' }]

function handlePrimaryAction() {
  if (isMiniProgram.value) {
    showInfo({ msg: '微信登录（mock）' })
    return
  }
  navigateToPhoneLogin()
}

function handleSecondaryAction() {
  navigateToPhoneLogin()
}

function handleOtherChannels() {
  showChannelSheet.value = true
}

function handleChannelLogin(type: 'qq') {
  showInfo({ msg: `${type.toUpperCase()} 登录模拟中` })
  showChannelSheet.value = false
}

function navigateToPhoneLogin() {
  uni.navigateTo({
    url: '/pages/login/phone',
    animationType: 'slide-in-right',
    animationDuration: 230,
  })
}

function navigateHome() {
  const url = HOME_PAGE
  const success = () => {
    tabbarStore.setAutoCurIdx(url)
  }
  const fail = (error: UniApp.GeneralCallbackResult) => {
    console.warn('[login] navigateHome fail:', error)
    uni.showToast({ title: '返回首页失败', icon: 'none' })
  }

  if (tabbarCacheEnable) {
    uni.switchTab({ url, success, fail })
  }
  else {
    uni.reLaunch({ url, success, fail })
  }
}

function handleClose() {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 })
    return
  }
  navigateHome()
}

async function initPlatform() {
  const info = uni.getSystemInfoSync()
  const insetTop = info.safeAreaInsets?.top || 0
  isMiniProgram.value = isMpWeixin
  isAppPlatform.value = info.uniPlatform === 'app-plus'

  // 小程序端使用自定义导航，背景可以延伸到状态栏区域，这里不再额外增加 paddingTop，避免页面高度超过一屏
  safeAreaTop.value = isMpWeixin ? '0px' : `${insetTop + 24}px`
}

onLoad(() => {
  initPlatform()
})
</script>

<template>
  <view class="login" :style="{ paddingTop: safeAreaTop }">
    <view class="login__background">
      <image class="login__background-img" :src="heroImage" mode="aspectFill" />
      <view class="login__background-mask" />
    </view>

    <view class="login__content">
      <view class="login__close" @click="handleClose">
        <wd-icon name="close" size="18px" />
      </view>

      <view class="login__title-block">
        <text class="login__hero-title">Trip</text>
        <text class="login__hero-sub">从未如此简单</text>
      </view>

      <view class="login__actions">
        <wd-button class="login__button" type="primary" size="large" @click="handlePrimaryAction">
          {{ primaryButtonText }}
        </wd-button>

        <wd-button
          v-if="secondaryButtonVisible"
          class="login__button login__button--secondary"
          type="info"
          size="large"
          plain
          @click="handleSecondaryAction"
        >
          手机号登录
        </wd-button>
      </view>

      <view v-if="showOtherChannels" class="login__other-entry" @click="handleOtherChannels">
        其他登录方式
      </view>
    </view>

    <transition name="login-channel">
      <view v-if="showChannelSheet" class="login-channel" @click="showChannelSheet = false">
        <view class="login-channel__mask" />
        <view class="login-channel__panel" @click.stop>
          <view class="login-channel__header">
            <text class="login-channel__title">选择登录方式</text>
            <text class="login-channel__close" role="button" @click="showChannelSheet = false">×</text>
          </view>
          <view class="login-channel__divider" />
          <view class="login-channel__content">
            <view
              v-for="item in channelOptions"
              :key="item.type"
              class="login-channel__item"
              @click="handleChannelLogin(item.type)"
            >
              <image :src="item.icon" mode="aspectFit" class="login-channel__icon" />
            </view>
          </view>
        </view>
      </view>
    </transition>
  </view>
</template>

<style scoped lang="scss">
.login {
  min-height: 100vh;
  height: 100vh;
  position: relative;
  background: #0c1113;
  color: #f5f6f7;
  overflow: hidden;
}

.login__background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.login__background-img {
  width: 100%;
  height: 100%;
}

.login__background-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(12, 17, 19, 0.15) 0%,
    rgba(12, 17, 19, 0.6) 55%,
    rgba(12, 17, 19, 0.85) 100%
  );
}

.login__close {
  position: absolute;
  // top: calc(env(safe-area-inset-top) + 24rpx);
  left: 24rpx;
  padding: 12rpx;
  color: rgba(255, 255, 255, 0.85);
}

.login__content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 80rpx 40rpx calc(56rpx + env(safe-area-inset-bottom));
  overflow: hidden;
  box-sizing: border-box;
}

.login__title-block {
  text-align: center;
  margin-top: 48rpx;
}

.login__hero-title {
  font-size: 72rpx;
  font-weight: 700;
  letter-spacing: 6rpx;
}

.login__hero-sub {
  margin-top: 16rpx;
  font-size: 32rpx;
  letter-spacing: 4rpx;
  color: rgba(255, 255, 255, 0.86);
}

.login__actions {
  width: 100%;
  max-width: 560rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.login__button {
  border-radius: 999rpx;
  --wot-button-primary-bg-color: linear-gradient(90deg, #1da1a1 0%, #30d0ae 100%);
  --wot-button-primary-color: #ffffff;
  --wot-button-padding-y: 24rpx;
  font-size: 32rpx;
}

.login__button--secondary {
  --wot-button-info-bg-color: rgba(255, 255, 255, 0.94);
  --wot-button-info-color: #161823;
  --wot-button-info-border-color: rgba(22, 24, 35, 0.12);
}

.login__other-entry {
  margin-bottom: 16rpx;
  text-align: center;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.75);
}

.login-channel {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.login-channel__mask {
  position: absolute;
  inset: 0;
  background: rgba(22, 24, 35, 0.45);
}

.login-channel__panel {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 40rpx 48rpx 56rpx;
  background: #fcfbfa;
  border-radius: 36rpx 36rpx 0 0;
  box-shadow: 0 18rpx 48rpx rgba(22, 24, 35, 0.18);
  box-sizing: border-box;
  transform: translateY(0);
  transition:
    transform 220ms ease,
    opacity 220ms ease;
}

.login-channel__header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.login-channel__title {
  font-size: 30rpx;
  color: #161823;
}

.login-channel__close {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 36rpx;
  color: #161823;
}

.login-channel__divider {
  margin: 28rpx 0 48rpx;
  height: 2rpx;
  background: rgba(51, 47, 44, 0.35);
}

.login-channel__content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-channel__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  font-size: 26rpx;
  color: #161823;
}

.login-channel__icon {
  width: 120rpx;
  height: 120rpx;
}

.login-channel__label {
  font-size: 28rpx;
  color: #161823;
}

.login-channel-enter-active,
.login-channel-leave-active {
  transition: opacity 220ms ease;
}

.login-channel-enter-from,
.login-channel-leave-to {
  opacity: 0;
}

.login-channel-enter-from .login-channel__panel,
.login-channel-leave-to .login-channel__panel {
  transform: translateY(48rpx);
  opacity: 0;
}
</style>
