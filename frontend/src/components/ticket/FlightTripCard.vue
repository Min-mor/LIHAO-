<script setup lang="ts">
import type { Trip } from '@/types/ticket'

defineOptions({ name: 'FlightTripCard' })

const props = defineProps<{ trip: Trip }>()
const emit = defineEmits<{ (e: 'select', trip: Trip): void }>()

function handleClick() {
  emit('select', props.trip)
}

function airportShort(name: string) {
  return name.replace(/国际机场|机场/g, '').trim()
}

const meta = (props.trip.meta || {}) as any
const airlineObj = (props.trip.airline || {}) as any
const airlineName = airlineObj.name || meta.airlineName || '航空'
const logoChar = (airlineObj.code?.charAt(0) || (airlineName as string).charAt(0))
const fareName = meta.cheapestFareName || (props.trip.fares[0]?.name || '')
const discount = meta.discount || ''
const aircraft = props.trip.aircraft || meta.aircraft
const hasMeal = typeof props.trip.meal === 'boolean' ? props.trip.meal : !!meta.meal
</script>

<template>
  <view class="flight-card" @click="handleClick">
    <view class="logo">{{ logoChar }}</view>
    <text class="time depart">{{ trip.departTime }}</text>
    <view class="arrow-line" aria-hidden="true" />
    <text class="time arrive">{{ trip.arriveTime }}</text>
    <text class="price"><text class="currency">￥</text><text class="amount">{{ trip.priceFrom }}</text></text>

    <text class="place from">{{ airportShort(trip.fromName) }}</text>
    <text class="place to">{{ airportShort(trip.toName) }}</text>
    <text class="fare">{{ fareName }}<text v-if="discount"> {{ discount }}</text></text>

    <view class="meta">
      <text class="airline">{{ airlineName }}</text>
      <text class="code">{{ trip.code }}</text>
      <text v-if="aircraft" class="aircraft">· {{ aircraft }}</text>
      <view v-if="hasMeal" class="meal">餐</view>
    </view>
    <view class="divider" />
  </view>
</template>

<style scoped lang="scss">
.flight-card { padding: 28rpx 12rpx; display: grid; grid-template-columns: 56rpx auto 1fr auto auto; grid-column-gap: 16rpx; grid-template-areas:
  'logo depart arrow arrive price'
  'logo from   from   to     fare'
  'logo meta   meta   meta   fare'; }
.logo { grid-area: logo; width: 48rpx; height: 48rpx; border-radius: 50%; background: rgba(var(--color-text-primary-rgb, 22, 24, 35), 0.1); color: var(--color-brand-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; }
.time { font-size: 36rpx; font-weight: 700; color: var(--color-text-primary); }
.depart { grid-area: depart; }
.arrow-line { grid-area: arrow; align-self: center; position: relative; height: 2rpx; background: var(--color-border-strong); width: 100%; }
.arrow-line::after { content: ''; position: absolute; right: -8rpx; top: 50%; transform: translateY(-50%); border-left: 12rpx solid var(--color-border-strong); border-top: 7rpx solid transparent; border-bottom: 7rpx solid transparent; }
.arrive { grid-area: arrive; }
.price { grid-area: price; font-size: 30rpx; color: var(--color-text-primary); align-self: center; white-space: nowrap; }
.currency { font-size: 22rpx; margin-right: 2rpx; opacity: 0.9; }
.place { font-size: 24rpx; color: var(--color-text-dark); }
.from { grid-area: from; }
.to { grid-area: to; color: var(--color-brand-primary); }
.fare { grid-area: fare; font-size: 24rpx; color: var(--color-text-secondary); align-self: end; }
.meta { grid-area: meta; display: flex; align-items: center; gap: 10rpx; color: var(--color-text-secondary); font-size: 24rpx; }
.meal { margin-left: 6rpx; font-size: 20rpx; padding: 0 8rpx; border-radius: 999rpx; background: rgba(var(--color-text-primary-rgb, 22, 24, 35), 0.06); color: var(--color-text-dark); }
.divider { grid-column: 1 / -1; height: 2rpx; background: var(--color-border-strong); margin-top: 20rpx; }
</style>
