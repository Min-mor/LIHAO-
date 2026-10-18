<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  topOffset?: number
  leftOffset?: number
  reLaunchFallback?: string
}>(), {
  topOffset: 24,
  leftOffset: 32,
  reLaunchFallback: '/pages/home/index',
})

const topStyle = computed(() => `calc(env(safe-area-inset-top) + ${props.topOffset}rpx)`)
const leftStyle = computed(() => `${props.leftOffset}rpx`)

function handleBack() {
  uni.navigateBack({
    delta: 1,
    fail() {
      uni.reLaunch({ url: props.reLaunchFallback })
    },
  })
}
</script>

<template>
  <view class="floating-back" :style="{ top: topStyle, left: leftStyle }" @click="handleBack">
    <view class="floating-back__button">
      <wd-icon name="arrow-left" size="28px" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.floating-back {
  position: fixed;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-back__button {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-overlay-light);
  color: var(--color-text-primary);
  box-shadow: 0 12rpx 24rpx var(--color-shadow-strong);
}
</style>
