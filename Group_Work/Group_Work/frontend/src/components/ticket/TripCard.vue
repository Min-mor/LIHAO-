<script setup lang="ts">
import type { Trip } from '@/types/ticket'

defineOptions({ name: 'TripCard' })

const props = defineProps<{ trip: Trip }>()
const emit = defineEmits<{ (e: 'select', trip: Trip): void }>()

function handleClick() {
  emit('select', props.trip)
}
</script>

<template>
  <view class="trip-item" @click="handleClick">
    <view class="row row--top">
      <text class="time">{{ trip.departTime }}</text>
      <view class="line" />
      <text class="time">{{ trip.arriveTime }}</text>
      <text class="price">￥{{ trip.priceFrom }}</text>
    </view>
    <view class="row row--meta">
      <text class="place">{{ trip.fromName }}</text>
      <text class="code">{{ trip.code }}</text>
      <text class="place">{{ trip.toName }}</text>
    </view>
    <view class="divider" />
  </view>
</template>

<style scoped lang="scss">
.trip-item { padding: 28rpx 12rpx; }
.row { display: flex; align-items: center; }
.row--top { gap: 12rpx; }
.time { font-size: 40rpx; font-weight: 700; color: var(--color-text-primary); }
.line { flex: 1; height: 2rpx; background: var(--color-border-strong); margin: 0 16rpx; }
.price { margin-left: auto; font-size: 30rpx; color: var(--color-text-primary); }
.row--meta { gap: 12rpx; margin-top: 8rpx; color: var(--color-text-dark); font-size: 24rpx; }
.code { color: var(--color-text-secondary); }
.place { flex: 1; }
.divider { height: 2rpx; background: var(--color-border-strong); margin-top: 28rpx; }
</style>
