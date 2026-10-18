<script setup lang="ts">
import { computed } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'OrderPage',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '订单',
  },
})

const safeTop = safeAreaInsets?.top || 0
const contentPaddingTop = computed(() => {
  const navPadding = typeof uni !== 'undefined' && typeof uni.upx2px === 'function' ? uni.upx2px(160) : 120
  return `${safeTop + navPadding}px`
})

const steps = [
  { id: 'select', title: '选择产品', description: '展示所选行程摘要与旅客信息' },
  { id: 'schedule', title: '确认行程', description: '日期、数量、增值服务确认' },
  { id: 'payment', title: '支付与确认', description: '选择支付方式、填写联系人及发票' },
]
</script>

<template>
  <view class="order" :style="{ paddingTop: `${safeTop}px` }">
    <floating-back />

    <view class="order__content" :style="{ paddingTop: contentPaddingTop }">
      <view class="order__header">
        <text class="order__title">订单流程</text>
        <text class="order__subtitle">完成预订只需三步</text>
      </view>

      <view class="order__steps">
        <wd-steps :active="0" direction="vertical" custom-class="order__steps-inner">
          <wd-step
            v-for="step in steps"
            :key="step.id"
            :title="step.title"
            :description="step.description"
          />
        </wd-steps>
      </view>

      <wd-card title="联系与支付信息" custom-class="order__card">
        <view class="order__card-desc">
          预留表单区域，用于填写旅客信息、选择支付方式与优惠券。
        </view>
        <template #footer>
          <wd-button type="primary" block>
            继续下一步
          </wd-button>
        </template>
      </wd-card>
    </view>
  </view>
</template>

<style scoped lang="scss">
.order {
  min-height: 100vh;
  padding: 24rpx 32rpx calc(env(safe-area-inset-bottom) + 48rpx);
  background: var(--color-bg-primary);
  position: relative;
}

.order__content {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.order__header {
  padding: 36rpx 28rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, var(--color-brand-accent-opaque), var(--color-brand-primary-opaque));
  color: var(--color-text-inverse);
  box-shadow: 0 16rpx 32rpx var(--color-shadow-card);
}

.order__title {
  font-size: 44rpx;
  font-weight: 600;
}

.order__subtitle {
  margin-top: 8rpx;
  font-size: 26rpx;
  color: var(--color-text-secondary);
}

.order__steps {
  margin-top: 40rpx;
  border-radius: 24rpx;
  background: var(--color-surface);
  padding: 24rpx;
  box-shadow: 0 12rpx 28rpx var(--color-shadow-soft);
}

.order__card-desc {
  font-size: 28rpx;
  color: var(--color-text-muted);
  line-height: 1.6;
}

:deep(.order__steps-inner) {
  --wot-steps-line-color: rgba(50, 89, 71, 0.25);
  --wot-steps-title-font-size: 30rpx;
  --wot-steps-description-font-size: 26rpx;
}

:deep(.order__card) {
  margin-top: 36rpx;
  border-radius: 24rpx;
  box-shadow: 0 12rpx 28rpx var(--color-shadow-soft);
}
</style>
