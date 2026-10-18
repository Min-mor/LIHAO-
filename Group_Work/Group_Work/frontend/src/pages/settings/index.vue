<script setup lang="ts">
import { computed } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import { useTokenStore } from '@/store/token'
import { useUserStore } from '@/store/user'
import { safeAreaInsets } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
  },
})

const safeTop = safeAreaInsets?.top ?? 0
const safeBottom = safeAreaInsets?.bottom ?? 0

const paddingTop = computed(() => `${safeTop + 16}px`)
const paddingBottom = computed(() => `${safeBottom + 32}px`)

interface SettingItem {
  key: string
  label: string
}

const tokenStore = useTokenStore()
const userStore = useUserStore()
const hasLogin = computed(() => tokenStore.hasLogin)

const settingItems = computed<SettingItem[]>(() => {
  const items: SettingItem[] = [
    { key: 'security', label: '账号安全' },
    { key: 'privacy', label: '隐私设置' },
    { key: 'support', label: '帮助与客服' },
    { key: 'about', label: '关于我们' },
  ]
  if (hasLogin.value) {
    items.push({ key: 'logout', label: '退出登录' })
  }
  return items
})

function handleBack() {
  uni.navigateBack({
    delta: 1,
    fail() {
      uni.switchTab({ url: '/pages/profile/index' })
    },
  })
}

async function handleLogout() {
  const confirm = await new Promise<boolean>((resolve) => {
    uni.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: (res) => resolve(res.confirm),
      fail: () => resolve(false),
    })
  })
  if (!confirm)
    return

  try {
    if (import.meta.env.DEV) {
      await tokenStore.logoutByMock()
    }
    else {
      await tokenStore.logout()
    }
    userStore.clearUserInfo()
    uni.showToast({ title: '已退出登录', icon: 'success' })
    uni.switchTab({ url: '/pages/profile/index' })
  }
  catch (error) {
    const message = error instanceof Error ? error.message : '退出失败，请稍后再试'
    uni.showToast({ title: message, icon: 'none' })
  }
}

function handleItemTap(item: SettingItem) {
  if (item.key === 'logout') {
    handleLogout()
    return
  }

  if (item.key === 'security') {
    if (!hasLogin.value) {
      uni.showToast({ title: '请先登录后再操作', icon: 'none' })
      return
    }
    uni.navigateTo({ url: '/pages/settings/security/index' })
    return
  }

  uni.showToast({ title: `${item.label} 功能筹备中`, icon: 'none' })
}
</script>

<template>
  <view class="settings" :style="{ paddingTop, paddingBottom }">
    <floating-back :left-offset="32" :top-offset="32" re-launch-fallback="/pages/profile/index" />

    <view class="settings__header">
      <text class="settings__title">设置</text>
    </view>

    <view class="settings__card">
      <view class="settings__row" v-for="item in settingItems" :key="item.key" @click="handleItemTap(item)">
        <text class="settings__row-label">{{ item.label }}</text>
        <wd-icon name="arrow-right" size="32rpx" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@use '@/style/index.scss' as *;

$card-bg: mix($color-base-highlight, #fff, 90%);
$card-border: rgba($color-base-text, 0.08);

.settings {
  position: relative;
  min-height: 100vh;
  background: mix($color-base-bg, #fff, 96%);
  padding: 24rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.settings__header {
  padding-left: 12rpx;
  margin-top: 120rpx;
}

.settings__title {
  font-size: 48rpx;
  font-weight: 650;
  color: rgba($color-base-text, 0.94);
}

.settings__card {
  border-radius: 48rpx;
  background: $card-bg;
  box-shadow: 0 18rpx 36rpx rgba($color-base-text, 0.08);
  padding: 12rpx 0;
  overflow: hidden;
}

.settings__row {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 36rpx 48rpx;
  color: rgba($color-base-text, 0.88);
  transition: background 0.2s ease;
}

.settings__row:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 48rpx;
  right: 48rpx;
  bottom: 0;
  height: 1px;
  background: $card-border;
}

.settings__row:hover {
  background: rgba($color-brand-primary, 0.06);
}

.settings__row-label {
  font-size: 32rpx;
  font-weight: 500;
}
</style>
