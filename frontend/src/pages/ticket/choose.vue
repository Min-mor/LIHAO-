<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import FareTabs from '@/components/ticket/FareTabs.vue'
import { useTicketStore } from '@/store/ticket'

defineOptions({ name: 'TicketChoosePage' })

definePage({ style: { navigationStyle: 'custom', navigationBarTitleText: '选择舱位/席别' } })

const store = useTicketStore()

const trip = computed(() => store.selectedTrip)
const dateLabel = computed(() => {
  const d = new Date(store.search.date)
  return `${d.getMonth() + 1}月${d.getDate()}日`
})
const relativeLabel = computed(() => {
  const dayStart = (ts: number) => new Date(new Date(ts).getFullYear(), new Date(ts).getMonth(), new Date(ts).getDate()).getTime()
  const s = dayStart(store.search.date)
  const today = dayStart(Date.now())
  const diff = Math.round((s - today) / (24 * 60 * 60 * 1000))
  return diff === 0 ? '今天' : diff === 1 ? '明天' : diff === 2 ? '后天' : ''
})
const activeFare = computed(() => {
  const fares = trip.value?.fares || []
  const id = store.selectedFareId
  return fares.find(f => f.id === id) || fares[0]
})

function order(id?: string) {
  if (id)
    store.chooseFare(id)
  uni.navigateTo({ url: '/pages/ticket/submit' })
}

onLoad(() => {
  if (!store.selectedTrip) {
    uni.reLaunch({ url: '/pages/ticket/list' })
  }
})
</script>

<template>
  <view class="ticket-choose">
    <floating-back :left-offset="20" :top-offset="20" />

    <view v-if="trip" class="head">
      <view class="left-space" />
      <text class="title">{{ dateLabel }} {{ relativeLabel }}{{ trip.mode === 'train' ? '出发' : '' }}</text>
      <view class="right-space" />
    </view>

    <view v-if="trip" class="summary">
      <view class="row main">
        <text class="time">{{ trip.departTime }}</text>
        <view class="dash" />
        <text class="time">{{ trip.arriveTime }}</text>
      </view>
      <view class="row meta">
        <text>{{ trip.fromName }}</text>
        <text class="code">{{ trip.code }}</text>
        <text>{{ trip.toName }}</text>
      </view>
    </view>

    <view v-if="trip" class="fares">
      <fare-tabs v-model="store.selectedFareId" :fares="trip.fares" />
    </view>

    <view v-if="trip && activeFare" class="products">
      <view class="product simple">
        <view class="price"><text class="currency">￥</text><text class="amount">{{ activeFare.price }}</text></view>
        <wd-button size="small" :disabled="activeFare.remaining === 0" @click="order(activeFare.id)">订</wd-button>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.ticket-choose {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding: 0 24rpx 24rpx;
}
.head { padding-top: calc(env(safe-area-inset-top) + 20rpx); height: 80rpx; display: flex; align-items: center; justify-content: center; }
.left-space, .right-space { width: 100rpx; flex: 0 0 auto; }
.title { color: var(--color-text-dark); font-size: 30rpx; }
.summary {
  background: var(--color-surface);
  border-radius: 20rpx;
  padding: 24rpx;
  margin-top: 8rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.top {
  color: var(--color-text-dark);
}
.main {
  gap: 12rpx;
}
.time {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--color-text-dark);
}
.dash {
  flex: 1;
  height: 2rpx;
  background: var(--color-border-strong);
}
.meta {
  gap: 12rpx;
  color: var(--color-text-secondary);
}
.code {
  color: var(--color-text-secondary);
}
.fares {
  margin: 20rpx 0;
  position: relative;
  z-index: 5;
  background: var(--color-surface);
  border-radius: 16rpx;
  padding: 0 8rpx;
}
.products {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.product {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: var(--color-surface);
  border-radius: 16rpx;
  padding: 20rpx;
}
.price {
  font-size: 32rpx; font-weight: 600; color: var(--color-text-primary); width: 160rpx;
}
.currency { font-size: 22rpx; margin-right: 2rpx; opacity: .9; }
.amount { font-size: 36rpx; font-weight: 700; }
.desc {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  color: var(--color-text-dark);
  font-size: 24rpx;
}
.product.simple { justify-content: space-between; }
</style>
