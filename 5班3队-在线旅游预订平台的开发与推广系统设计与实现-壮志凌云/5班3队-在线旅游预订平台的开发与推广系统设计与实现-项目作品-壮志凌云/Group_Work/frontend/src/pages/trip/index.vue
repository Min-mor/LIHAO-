<script setup lang="ts">
import { computed, reactive } from 'vue'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'TripPage',
})

definePage({
  style: {
    navigationStyle: 'custom',
  },
})

type TripStatus = 'upcoming' | 'ongoing' | 'completed'

interface TripCard {
  id: string
  title: string
  dateRange: string
  destination: string
  status: TripStatus
  tag?: string
}

const tripStatusLabel: Record<TripStatus, string> = {
  upcoming: '即将开始',
  ongoing: '进行中',
  completed: '已完成',
}

const trips = reactive<TripCard[]>([
  {
    id: 't1',
    title: '华东五市 6 日 5 晚跟团游',
    dateRange: '2023.10.01 - 2023.10.06（6天）',
    destination: '上海、杭州、苏州、南京、无锡',
    status: 'upcoming',
  },
  {
    id: 't2',
    title: '北京 5 日自由行',
    dateRange: '2023.08.15 - 2023.08.19（5天）',
    destination: '北京',
    status: 'ongoing',
  },
  {
    id: 't3',
    title: '三亚 海岛度假',
    dateRange: '2023.05.01 - 2023.05.05（5天）',
    destination: '三亚',
    status: 'completed',
  },
])

const paddingTop = computed(() => `${(safeAreaInsets?.top || 0) + 24}px`)
const paddingBottom = computed(() => `calc(200rpx + ${(safeAreaInsets?.bottom || 0) * 2}px)`)

function handleCreateTrip() {
  uni.showToast({ title: '敬请期待行程创建', icon: 'none' })
}

function handleTripAction(type: 'edit' | 'detail', trip: TripCard) {
  const label = type === 'edit' ? '编辑行程' : '查看详情'
  uni.showToast({ title: `${label}：${trip.title}`, icon: 'none' })
}

function getStatusLabel(status: TripStatus) {
  return tripStatusLabel[status]
}
</script>

<template>
  <view class="trip" :style="{ paddingTop, paddingBottom }">
    <view class="trip__top">
      <view>
        <text class="trip__title">我的行程</text>
        <text class="trip__subtitle">记录每一次出发与归来</text>
      </view>
      <wd-icon name="add" size="40rpx" class="trip__add" @click="handleCreateTrip" />
    </view>

    <scroll-view class="trip__list" scroll-y>
      <view
        v-for="trip in trips"
        :key="trip.id"
        class="trip__card"
        :class="`is-${trip.status}`"
      >
        <view class="trip__card-header">
          <view class="trip__status">
            {{ getStatusLabel(trip.status) }}
          </view>
          <wd-icon name="more" size="36rpx" class="trip__more" />
        </view>

        <view class="trip__card-body">
          <text class="trip__card-title">{{ trip.title }}</text>
          <view class="trip__info">
            <view class="trip__info-item">
              <wd-icon name="calendar" size="30rpx" />
              <text>{{ trip.dateRange }}</text>
            </view>
            <view class="trip__info-item">
              <wd-icon name="location" size="30rpx" />
              <text>{{ trip.destination }}</text>
            </view>
          </view>
        </view>

        <view class="trip__actions">
          <wd-button
            v-if="trip.status !== 'completed'"
            size="small"
            plain
            type="primary"
            custom-class="trip__action-btn trip__action-btn--plain"
            @click="handleTripAction('edit', trip)"
          >
            编辑行程
          </wd-button>
          <wd-button
            size="small"
            type="primary"
            custom-class="trip__action-btn"
            @click="handleTripAction('detail', trip)"
          >
            查看详情
          </wd-button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
@use '@/style/index.scss' as *;

$trip-bg: $color-bg-primary;
$trip-card-bg: mix(#ffffff, $color-base-bg, 60%);
$trip-card-bg-ongoing: mix($color-base-accent, #ffffff, 92%);
$trip-card-bg-completed: mix($color-base-border, #ffffff, 92%);
$trip-shadow: rgba($color-base-text, 0.1);

$trip-status-upcoming-fg: $color-brand-primary;
$trip-status-upcoming-bg: rgba($color-brand-primary, 0.12);
$trip-status-ongoing-fg: darken($color-brand-accent, 18%);
$trip-status-ongoing-bg: rgba($color-brand-accent, 0.2);
$trip-status-completed-fg: rgba($color-base-text, 0.5);
$trip-status-completed-bg: rgba($color-base-border, 0.12);

.trip {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 24rpx 32rpx;
  background: $trip-bg;
  color: var(--color-text-primary);
}

.trip__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32rpx;
}

.trip__title {
  display: block;
  font-size: 44rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
}

.trip__subtitle {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--color-text-muted);
}

.trip__add {
  padding: 18rpx;
  border-radius: 50%;
  background: rgba($color-brand-primary, 0.15);
  color: $color-brand-primary;
  box-shadow: 0 8rpx 18rpx rgba($color-brand-primary, 0.22);
}

.trip__list {
  flex: 1;
}

.trip__card {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  padding: 32rpx;
  border-radius: 32rpx;
  background: $trip-card-bg;
  margin-bottom: 28rpx;
}

.trip__card.is-ongoing {
  background: $trip-card-bg-ongoing;
}

.trip__card.is-completed {
  background: $trip-card-bg-completed;
}

.trip__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.trip__status {
  padding: 0;
  font-size: 26rpx;
  font-weight: 600;
  color: $trip-status-upcoming-fg;
}

.trip__card.is-ongoing .trip__status {
  color: $trip-status-ongoing-fg;
}

.trip__card.is-completed .trip__status {
  color: $trip-status-completed-fg;
}

.trip__more {
  color: rgba($color-base-text, 0.35);
}

.trip__card-title {
  font-size: 36rpx;
  font-weight: 650;
  line-height: 1.4;
}

.trip__info {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  color: rgba($color-base-text, 0.65);
}

.trip__info-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 26rpx;
}

.trip__actions {
  display: flex;
  gap: 20rpx;
}

.trip__action-btn {
  --wot-button-font-size: 26rpx;
  --wot-button-padding-y: 12rpx;
  --wot-button-padding-x: 32rpx;
  --wot-button-border-radius: 999rpx;
}

.trip__action-btn--plain {
  --wot-button-border-color: rgba(#{$color-brand-primary}, 0.45);
  --wot-button-color: rgba(#{$color-brand-primary}, 0.85);
}
</style>
