<script setup lang="ts">
import { computed } from 'vue'
import { safeAreaInsets } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '404',
  },
})

const safeTop = safeAreaInsets?.top || 0
const paddingTop = computed(() => `${safeTop + 24}px`)

function goHome() {
  uni.switchTab({ url: '/pages/home/index' })
}
</script>

<template>
  <view class="page404" :style="{ paddingTop }">
    <view class="page404__icon">
      <wd-icon name="warning-filled" size="64rpx" />
    </view>
    <view class="page404__title">页面走丢了</view>
    <view class="page404__desc">您访问的页面不存在或已被移动</view>
    <wd-button type="primary" size="small" class="page404__btn" @click="goHome">返回首页</wd-button>
  </view>
</template>

<style scoped lang="scss">
.page404 {
  min-height: 100vh;
  padding: 24rpx 32rpx env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}
.page404__icon {
  margin-top: 120rpx;
  color: var(--color-brand-primary);
}
.page404__title {
  margin-top: 8rpx;
  font-size: 40rpx;
  font-weight: 600;
}
.page404__desc {
  font-size: 26rpx;
  color: var(--color-text-secondary);
}
.page404__btn {
  margin-top: 20rpx;
  --wot-button-border-radius: 999rpx;
}
</style>
