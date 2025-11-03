<script setup lang="ts">
import { computed } from 'vue'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'RomanticPage',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '心动',
  },
})

const pagePaddingTop = computed(() => `${(safeAreaInsets?.top || 0) + 32}px`)
</script>

<template>
  <view class="romantic" :style="{ paddingTop: pagePaddingTop }">
    <view class="romantic__header">
      <text class="romantic__title">心动精选</text>
      <text class="romantic__subtitle">为你甄选充满惊喜的主题活动</text>
    </view>

    <view class="romantic__grid">
      <view v-for="index in 4" :key="index" class="romantic__item">
        <wd-icon name="heart" size="32px" />
        <text class="romantic__item-title">心动主题 {{ index }}</text>
        <text class="romantic__item-desc">探索更多浪漫灵感，等待下次出发。</text>
      </view>
    </view>

  </view>
</template>

<style scoped lang="scss">
.romantic {
  min-height: 100vh;
  padding: 32rpx 32rpx 160rpx;
  background: #fcfbfa;
  color: #161823;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.romantic__header {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.romantic__title {
  font-size: 44rpx;
  font-weight: 600;
}

.romantic__subtitle {
  font-size: 26rpx;
  color: rgba(22, 24, 35, 0.7);
}

.romantic__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24rpx;
}

.romantic__item {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 28rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, rgba(160, 212, 196, 0.2), rgba(50, 89, 71, 0.15));
  color: #161823;
}

.romantic__item-title {
  font-size: 32rpx;
  font-weight: 600;
}

.romantic__item-desc {
  font-size: 26rpx;
  color: rgba(22, 24, 35, 0.7);
}
</style>
