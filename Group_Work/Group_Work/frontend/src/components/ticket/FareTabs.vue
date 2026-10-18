<script setup lang="ts">
import type { FareOption } from '@/types/ticket'
import { computed } from 'vue'

defineOptions({ name: 'FareTabs' })

const props = defineProps<{
  fares: FareOption[]
  modelValue: string
}>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const isScroll = computed(() => (props.fares?.length || 0) > 3)

function select(id: string) {
  emit('update:modelValue', id)
}
</script>

<template>
  <scroll-view v-if="isScroll" class="fare-tabs-scroll" scroll-x :show-scrollbar="false">
    <view class="fare-tabs is-scroll">
      <view
        v-for="fare in fares"
        :key="fare.id"
        class="fare-tabs__item"
        :class="{ 'is-active': fare.id === modelValue }"
        @click="select(fare.id)"
      >
        <text class="fare-tabs__name">{{ fare.name }}</text>
        <text class="fare-tabs__price">￥{{ fare.price }}</text>
      </view>
    </view>
  </scroll-view>
  <view v-else class="fare-tabs">
    <view
      v-for="fare in fares"
      :key="fare.id"
      class="fare-tabs__item"
      :class="{ 'is-active': fare.id === modelValue }"
      @click="select(fare.id)"
    >
      <text class="fare-tabs__name">{{ fare.name }}</text>
      <text class="fare-tabs__price">￥{{ fare.price }}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
.fare-tabs-scroll { width: 100%; position: relative; z-index: 2; background: var(--color-surface); padding: 8rpx 0; }
.fare-tabs-scroll { height: 168rpx; }
.fare-tabs {
  display: flex;
  background: var(--color-surface);
  border-radius: 16rpx;
  overflow: hidden;
}
.fare-tabs.is-scroll { display: inline-flex; white-space: nowrap; background: transparent; border-radius: 0; overflow: visible; height: 100%; }
.fare-tabs__item {
  flex: 1; padding: 20rpx 12rpx; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8rpx; box-sizing: border-box; height: 100%;
  color: var(--color-text-dark); border: 2rpx solid var(--color-border-strong);
}
.is-scroll .fare-tabs__item { flex: 0 0 auto; min-width: 250rpx; display: inline-flex; }
.fare-tabs__item + .fare-tabs__item { border-left: none; }
.fare-tabs__item.is-active { border-color: var(--color-brand-primary); color: var(--color-text-primary); }
.fare-tabs__name { font-weight: 600; }
.fare-tabs__price { font-size: 24rpx; color: var(--color-text-secondary); }
</style>
