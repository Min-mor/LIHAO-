<script setup lang="ts">
import type { Trip } from '@/types/ticket'

defineOptions({ name: 'TrainTripCard' })

const props = defineProps<{ trip: Trip }>()
const emit = defineEmits<{ (e: 'select', trip: Trip): void }>()

function handleClick() {
  emit('select', props.trip)
}

function formatDuration(mins: number) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}时${m}分`
}

function seatLabel(rem?: number) {
  if (rem === undefined)
    return '有票'
  return rem > 20 ? '有票' : `余${rem}张`
}
</script>

<template>
  <view class="train-card" @click="handleClick">
    <text class="time depart">{{ trip.departTime }}</text>
    <view class="mid">
      <view class="line" />
      <view class="center">
        <text class="duration">{{ formatDuration(trip.durationMinutes) }}</text>
        <text class="code-mid">{{ trip.code }}</text>
      </view>
    </view>
    <text class="time arrive">{{ trip.arriveTime }}</text>
    <text class="price">￥{{ trip.priceFrom }}</text>

    <text class="place from">{{ trip.fromName }}</text>
    <text class="place to">{{ trip.toName }}</text>

    <view class="seats">
      <view v-for="f in trip.fares" :key="f.id" class="chip" :class="{ ok: (f.remaining ?? 99) > 0 }">
        {{ f.name }} {{ seatLabel(f.remaining) }}
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.train-card {
  padding: 24rpx;
  background: var(--color-surface);
  border-radius: 20rpx;
  margin: 12rpx 0;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  grid-column-gap: 12rpx;
  grid-template-areas:
    'depart mid arrive price'
    'from   mid to     price'
    'seats  seats seats seats';
}
.time {
  font-size: 40rpx;
  font-weight: 700;
  color: var(--color-text-primary);
}
.depart {
  grid-area: depart;
}
.arrive {
  grid-area: arrive;
}
.price {
  grid-area: price;
  font-size: 30rpx;
  color: var(--color-text-primary);
  align-self: center;
  justify-self: end;
}
.mid {
  grid-area: mid;
  position: relative;
  display: flex;
  align-items: center;
  padding: 18rpx 0;
}
.line {
  flex: 1;
  height: 2rpx;
  background: var(--color-border-strong);
}
.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}
.duration {
  font-size: 22rpx;
  color: var(--color-text-secondary);
  line-height: 1;
  margin-bottom: 8rpx;
}
.code-mid {
  font-size: 24rpx;
  color: var(--color-text-secondary);
  line-height: 1;
  margin-top: 8rpx;
}
.place {
  font-size: 24rpx;
  color: var(--color-text-dark);
}
.from {
  grid-area: from;
}
.to {
  grid-area: to;
}
.seats {
  grid-area: seats;
  display: flex;
  gap: 12rpx;
  margin-top: 10rpx;
  flex-wrap: wrap;
}
.chip {
  font-size: 22rpx;
  color: var(--color-text-dark);
  padding: 6rpx 10rpx;
  border-radius: 999rpx;
  background: rgba(var(--color-text-primary-rgb, 22, 24, 35), 0.06);
}
.chip.ok {
  color: var(--color-brand-primary);
}
</style>
