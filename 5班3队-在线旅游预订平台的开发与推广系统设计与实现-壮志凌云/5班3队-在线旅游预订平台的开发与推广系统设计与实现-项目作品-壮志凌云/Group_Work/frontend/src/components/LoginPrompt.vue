<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoginPromptStore } from '@/store/uiLoginPrompt'

const store = useLoginPromptStore()
const { visible, options } = storeToRefs(store)

function onBackdrop() {
  store.close()
}
</script>

<template>
  <view v-if="visible" class="login-prompt">
    <view class="login-prompt__overlay" @click="onBackdrop" />
    <view class="login-prompt__panel">
      <text class="login-prompt__title">{{ options.title }}</text>
      <text class="login-prompt__message">{{ options.message }}</text>
      <view class="login-prompt__actions">
        <wd-button
          class="login-prompt__cancel"
          type="info"
          size="large"
          @click="store.cancel"
        >
          {{ options.cancelText }}
        </wd-button>
        <wd-button
          class="login-prompt__confirm"
          type="primary"
          size="large"
          @click="store.confirm"
        >
          {{ options.confirmText }}
        </wd-button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@use '@/style/index.scss' as *;

.login-prompt {
  position: fixed;
  inset: 0;
  z-index: 9999;
}

.login-prompt__overlay {
  position: absolute;
  inset: 0;
  background: rgba(var(--color-text-primary-rgb), 0.28);
}

.login-prompt__panel {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 120rpx);
  max-width: 620rpx;
  border-radius: 28rpx;
  padding: 32rpx 28rpx;
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: 0 24rpx 48rpx var(--color-shadow-soft);
  border: 1rpx solid var(--color-border-light);
}

.login-prompt__title {
  display: block;
  font-size: 34rpx;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.login-prompt__message {
  display: block;
  font-size: 28rpx;
  color: var(--color-text-secondary);
}

.login-prompt__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-top: 28rpx;
}

.login-prompt__confirm {
  --wot-button-border-width: 0;
  --wot-button-border-radius: 999rpx;
  --wot-button-padding-y: 18rpx;
  --wot-button-padding-x: 28rpx;
  --wot-button-primary-bg-color: var(--color-brand-primary);
  --wot-button-primary-color: var(--color-text-inverse);
}

.login-prompt__cancel {
  --wot-button-border-width: 0;
  --wot-button-border-radius: 999rpx;
  --wot-button-padding-y: 18rpx;
  --wot-button-padding-x: 28rpx;
  --wot-button-info-bg-color: var(--color-brand-soft);
  --wot-button-info-color: var(--color-text-primary);
}
</style>
