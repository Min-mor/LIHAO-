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
const pagePaddingBottom = computed(() => `calc(200rpx + ${(safeAreaInsets?.bottom || 0) * 2}px)`)
</script>

<template>
  <view class="romantic" :style="{ paddingTop: pagePaddingTop, paddingBottom: pagePaddingBottom }">
    <!-- <view class="romantic__header">
      <text class="romantic__title">心动精选</text>
      <text class="romantic__subtitle">为你甄选充满惊喜的主题活动</text>
    </view>

    <view class="romantic__grid">
      <view v-for="index in 4" :key="index" class="romantic__item">
        <wd-icon name="heart" size="32px" />
        <text class="romantic__item-title">心动主题 {{ index }}</text>
        <text class="romantic__item-desc">探索更多浪漫灵感，等待下次出发。</text>
      </view>
    </view> -->
  </view>
</template>

<style scoped lang="scss">
.romantic {
  padding: 32rpx;
  background: #fcfbfa;
  color: #161823;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
</style>
