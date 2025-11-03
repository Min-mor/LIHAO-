<script setup lang="ts">
import { computed } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'RecommendPage',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '推荐',
  },
})

const sections = [
  {
    id: 'traffic',
    title: '行程工具',
    description: '显示航班、车次、接驳等出行方案，用于快速筛选交通方式。',
  },
  {
    id: 'packages',
    title: '推荐套餐',
    description: '以卡片形式展示推荐团期或酒店，支持展开查看详情。',
  },
  {
    id: 'spots',
    title: '景点推荐',
    description: '根据城市与日期智能匹配景点列表，提供收藏与预定操作。',
  },
]
const safeTop = safeAreaInsets?.top || 0
const contentPaddingTop = computed(() => {
  const navPadding = typeof uni !== 'undefined' && typeof uni.upx2px === 'function' ? uni.upx2px(160) : 120
  return `${safeTop + navPadding}px`
})
</script>

<template>
  <view class="page" :style="{ paddingTop: `${safeTop}px` }">
    <floating-back />

    <view class="page__content" :style="{ paddingTop: contentPaddingTop }">
      <view class="page__header">
        <text class="page__title">目的地产品</text>
        <text class="page__subtitle">根据你的偏好筛选旅行方案</text>
      </view>

      <view class="page__sections">
        <view
          v-for="section in sections"
          :key="section.id"
          class="page__section"
        >
          <text class="section__title">{{ section.title }}</text>
          <text class="section__desc">{{ section.description }}</text>
          <view class="section__placeholder" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding: 24rpx 32rpx env(safe-area-inset-bottom);
  position: relative;
}

.page__content {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.page__header {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 32rpx 28rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, var(--color-brand-primary-opaque), var(--color-brand-accent-opaque));
  color: var(--color-text-inverse);
}

.page__title {
  font-size: 44rpx;
  font-weight: 600;
}

.page__subtitle {
  font-size: 26rpx;
  color: var(--color-text-secondary);
}

.page__sections {
  margin-top: 36rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.page__section {
  padding: 32rpx;
  border-radius: 24rpx;
  background: var(--color-surface);
  box-shadow: 0 12rpx 32rpx var(--color-shadow-soft);
}

.section__title {
  font-size: 34rpx;
  font-weight: 600;
  color: var(--color-text-primary);
}

.section__desc {
  display: block;
  margin-top: 10rpx;
  font-size: 26rpx;
  color: var(--color-text-secondary);
}

.section__placeholder {
  margin-top: 24rpx;
  height: 200rpx;
  border-radius: 20rpx;
  border: 1rpx dashed var(--color-brand-muted);
  background: var(--color-brand-soft);
}
</style>
