<script setup lang="ts">
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import FlightTripCard from '@/components/ticket/FlightTripCard.vue'
import TrainTripCard from '@/components/ticket/TrainTripCard.vue'
import { useTicketStore } from '@/store/ticket'

defineOptions({ name: 'TicketListPage' })

definePage({
  style: { navigationStyle: 'custom', navigationBarTitleText: '车次/航班' },
})

const store = useTicketStore()

const days = computed(() => {
  // 生成未来30天，横向滚动显示，单个宽度20%（5列）
  const arr: { ts: number, label: string, day: string }[] = []
  const today = new Date()
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
  for (let i = 0; i < 30; i++) {
    const ts = base + i * 24 * 60 * 60 * 1000
    const d = new Date(ts)
    const diff = Math.round((ts - base) / (24 * 60 * 60 * 1000))
    const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
    const label = diff === 0 ? '今天' : diff === 1 ? '明天' : diff === 2 ? '后天' : weekday
    arr.push({ ts, label, day: String(d.getDate()).padStart(2, '0') })
  }
  return arr
})

const activeDayIndex = computed(() => {
  const dayStart = (ts: number) => new Date(new Date(ts).getFullYear(), new Date(ts).getMonth(), new Date(ts).getDate()).getTime()
  const s = dayStart(store.search.date)
  const idx = days.value.findIndex(d => dayStart(d.ts) === s)
  return idx >= 0 ? idx : 0
})

const scrollIntoId = computed(() => `d${activeDayIndex.value}`)

function selectDay(idx: number) {
  const d = days.value[idx]
  if (!d)
    return
  store.setSearch({ date: d.ts })
  store.query()
}

function swap() {
  store.swapCities()
  store.query()
}

function toggleDirect() {
  store.setSearch({ directOnly: !store.search.directOnly })
  store.query()
}

function toggleSort(key: 'depart' | 'price' | 'duration') {
  const sortAsc = store.search.sortBy === key ? !store.search.sortAsc : true
  store.setSearch({ sortBy: key, sortAsc })
  store.query()
}

function handleSelectTrip(trip: any) {
  store.chooseTrip(trip)
  uni.navigateTo({ url: '/pages/ticket/choose' })
}

onLoad(async () => {
  // 默认不选中任何排序
  store.setSearch({ sortBy: undefined as any })
  await store.query()
})

onPullDownRefresh(async () => {
  try {
    await store.query()
  }
  finally {
    uni.stopPullDownRefresh()
  }
})

// 日历弹层
const calendarRef = ref()
const departDateValue = ref<number>(store.search.date)
function openCalendar() {
  // 同步当前选中
  departDateValue.value = store.search.date
  calendarRef.value?.open?.()
}
function handleCalendarConfirm({ value }: { value: number }) {
  store.setSearch({ date: value })
  store.query()
}
</script>

<template>
  <view class="ticket-list">
    <floating-back :left-offset="20" :top-offset="20" />

    <view class="header">
      <view class="top-row">
        <view class="left-space" />
        <view class="cities">
          <text class="city">{{ store.search.from }}</text>
          <view class="swap" @click="swap">
            <wd-icon name="translate-bold" size="26px" />
          </view>
          <text class="city">{{ store.search.to }}</text>
        </view>
      </view>
      <view class="days-row">
        <scroll-view class="days" scroll-x :scroll-into-view="scrollIntoId">
          <view class="days-content">
            <view
              v-for="(d, i) in days"
              :id="`d${i}`"
              :key="d.ts"
              class="day"
              :class="{ active: i === activeDayIndex }"
              @click="selectDay(i)"
            >
              <text class="label">{{ d.label }}</text>
              <text class="num">{{ d.day }}</text>
            </view>
          </view>
        </scroll-view>
        <view class="calendar-btn" @click="openCalendar">
          <wd-icon name="calendar" size="22px" />
        </view>
      </view>
    </view>

    <view class="list">
      <view v-if="store.loading" class="loading">
        加载中...
      </view>
      <template v-else>
        <template v-if="store.search.mode === 'train'">
          <train-trip-card
            v-for="item in store.results"
            :key="item.id"
            :trip="item"
            @select="handleSelectTrip"
          />
        </template>
        <template v-else>
          <flight-trip-card
            v-for="item in store.results"
            :key="item.id"
            :trip="item"
            @select="handleSelectTrip"
          />
        </template>
      </template>
    </view>

    <view class="bottom-bar">
      <view class="tool" :class="{ active: store.search.directOnly }" @click="toggleDirect">
        {{ store.search.mode === 'flight' ? '仅看直飞' : '仅看直达' }}
      </view>
      <view class="tool" :class="{ active: store.search.sortBy === 'depart' }" @click="toggleSort('depart')">
        出发 {{ store.search.sortBy === 'depart' ? (store.search.sortAsc ? '早-晚' : '晚-早') : '早-晚' }}
      </view>
      <view class="tool" :class="{ active: store.search.sortBy === 'duration' }" @click="toggleSort('duration')">
        耗时 {{ store.search.sortBy === 'duration' ? (store.search.sortAsc ? '短-长' : '长-短') : '短-长' }}
      </view>
      <view class="tool" :class="{ active: store.search.sortBy === 'price' }" @click="toggleSort('price')">
        价格 {{ store.search.sortBy === 'price' ? (store.search.sortAsc ? '低-高' : '高-低') : '低-高' }}
      </view>
    </view>

    <wd-calendar
      ref="calendarRef"
      v-model="departDateValue"
      title="选择日期"
      :show-type-switch="false"
      :with-cell="false"
      @confirm="handleCalendarConfirm"
    />
  </view>
</template>

<style scoped lang="scss">
.ticket-list {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding: 0 24rpx env(safe-area-inset-bottom);
}
.header {
  background: var(--color-bg-primary);
  position: sticky;
  top: 0;
  z-index: 1;
  padding-top: calc(env(safe-area-inset-top) + 12rpx);
}
.top-row {
  align-items: center;
  height: 80rpx;
  padding: 0 24rpx;
  padding-top: 10px;
}
.left-space {
  width: 100rpx;
  flex: 0 0 auto;
}
.cities {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  font-size: 36rpx;
  font-weight: 600;
}
.city {
  text-align: center;
}
.swap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-brand-primary);
}
.days-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx 6rpx;
}
.days {
  flex: 1;
}
.days-content {
  display: flex;
  flex-wrap: nowrap;
}
.day {
  flex: 0 0 20%;
  text-align: center;
  color: var(--color-text-secondary);
  padding: 12rpx 0;
  border-bottom: 2rpx solid transparent;
}
.day.active {
  color: var(--color-brand-primary);
  font-weight: 600;
}
.calendar-btn {
  flex: 0 0 auto;
  padding-left: 8rpx;
  color: var(--color-brand-primary);
}
.list {
  padding: 16rpx 0 120rpx;
}
.loading {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 40rpx 0;
}
.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 14rpx 16rpx calc(14rpx + env(safe-area-inset-bottom));
  background: var(--color-surface);
  border-radius: 0;
  border: none;
  box-shadow: none;
}
.tool {
  color: var(--color-text-dark);
}
.tool.active {
  color: var(--color-brand-primary);
  font-weight: 600;
}
</style>
