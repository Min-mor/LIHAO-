<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { ConfigProviderThemeVars } from 'wot-design-uni'
import { onShow } from '@dcloudio/uni-app'
import { computed, reactive, ref } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import LoginPrompt from '@/components/LoginPrompt.vue'
import { useLoginGuard } from '@/hooks/useLoginGuard'
import { useTicketStore } from '@/store/ticket'
import { useLoginPromptStore } from '@/store/uiLoginPrompt'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'TrafficPage',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '交通工具',
  },
})

const loginPrompt = useLoginPromptStore()
const { ensureLogin } = useLoginGuard()

interface PassengerOption {
  label: string
  value: string
}

const safeTop = safeAreaInsets?.top || 0
const contentPaddingTop = computed(() => {
  const navPadding = typeof uni !== 'undefined' && typeof uni.upx2px === 'function' ? uni.upx2px(160) : 120
  return `${safeTop + navPadding}px`
})

const tabs = [
  { name: 'train', title: '火车票', icon: 'train' },
  { name: 'flight', title: '飞机票', icon: 'plane' },
]

const state = reactive({
  activeTab: 'train',
  fromCity: '',
  toCity: '',
})

const ticketChecks = ref<string[]>([])

const actionButtonStyle
  = 'border-radius:999rpx;background:#325947;color:#fcfbfa;border:none;padding:28rpx 0;font-size:32rpx;'

const calendarRef = ref()
const departDateValue = ref(Date.now())

const CALENDAR_PREORDER_DAYS = 14
const MS_PER_DAY = 24 * 60 * 60 * 1000

const calendarThemeVars = computed<ConfigProviderThemeVars>(() => ({
  colorTheme: '#325947',
  calendarSelectedBackgroundColor: '#a0d4c4',
  calendarSelectedDayColor: '#161823',
  calendarDayTodayColor: '#325947',
  calendarDayTodayBorderColor: '#325947',
  calendarDayBottomInfoColor: '#325947',
  calendarDayTopInfoColor: '#325947',
}))

const calendarMinDate = computed(() => {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  return startOfToday.getTime()
})

const isTrainTab = computed(() => state.activeTab === 'train')

type TrafficCalendarDay = {
  date: number
  text?: string | number
  topInfo?: string
  bottomInfo?: string
  disabled?: boolean
  type?: CalendarDayType
} & Record<string, unknown>

type CalendarDayType = string

const calendarFormatter: ComputedRef<(day: any) => any> = computed(() => {
  const minTimestamp = calendarMinDate.value
  const trainMode = isTrainTab.value

  return (day) => {
    const dayStart = new Date(day.date)
    dayStart.setHours(0, 0, 0, 0)
    const dayTimestamp = dayStart.getTime()
    const topInfo = dayTimestamp === minTimestamp ? '今天' : day.topInfo

    if (!trainMode) {
      return {
        ...day,
        topInfo,
        disabled: dayTimestamp < minTimestamp,
        bottomInfo: '',
      } as TrafficCalendarDay
    }

    if (dayTimestamp < minTimestamp) {
      return {
        ...day,
        topInfo,
        disabled: true,
        bottomInfo: '',
      } as TrafficCalendarDay
    }

    const preorderThreshold = minTimestamp + CALENDAR_PREORDER_DAYS * MS_PER_DAY
    return {
      ...day,
      topInfo,
      disabled: false,
      bottomInfo: dayTimestamp > preorderThreshold ? '可预约' : '',
    } as TrafficCalendarDay
  }
})

const passengerOptions: PassengerOption[] = [
  { label: '高铁/动车', value: 'standard' },
  { label: '学生票', value: 'student' },
]

const activeTabTitle = computed(() =>
  tabs.find(item => item.name === state.activeTab)?.title || '',
)

const formattedDate = computed(() => {
  const date = new Date(departDateValue.value)
  if (Number.isNaN(date.getTime()))
    return ''
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const today = new Date()
  const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diff = Math.round((dayStart(date) - dayStart(today)) / (24 * 60 * 60 * 1000))
  let suffix = days[date.getDay()]
  if (diff === 0)
    suffix = '今天出发'
  else if (diff === 1)
    suffix = '明天出发'
  else if (diff === 2)
    suffix = '后天出发'
  else suffix = `${days[date.getDay()]}出发`
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 · ${suffix}`
})

function handleSwapCity() {
  const temp = state.fromCity
  state.fromCity = state.toCity
  state.toCity = temp
}

function handlePickDate() {
  calendarRef.value?.open?.()
}

function handleCalendarConfirm({ value }: { value: number }) {
  departDateValue.value = value
}

function handleQuery() {
  const fromCity = state.fromCity.trim()
  const toCity = state.toCity.trim()

  if (!fromCity || !toCity) {
    uni.showToast({ title: '请输入出发和到达城市', icon: 'none' })
    return
  }

  state.fromCity = fromCity
  state.toCity = toCity

  ensureLogin(() => {
    const ticket = useTicketStore()
    ticket.setSearch({
      mode: state.activeTab as 'train' | 'flight',
      from: state.fromCity,
      to: state.toCity,
      date: departDateValue.value,
      options: isTrainTab.value ? ticketChecks.value : [],
      directOnly: false,
    })
    uni.navigateTo({ url: '/pages/ticket/list' })
  }, {
    message: '查询车票需要登录',
  })
}

onShow(() => {
  loginPrompt.close()
})
</script>

<template>
  <wd-config-provider :theme-vars="calendarThemeVars">
    <view class="traffic" :style="{ paddingTop: `${safeTop}px` }">
      <floating-back />
      <LoginPrompt />

      <view class="traffic__body" :style="{ paddingTop: contentPaddingTop }">
        <view class="traffic__tabs">
          <view
            v-for="tab in tabs"
            :key="tab.name"
            class="traffic__tab"
            :class="{ 'traffic__tab--active': tab.name === state.activeTab }"
            @click="state.activeTab = tab.name"
          >
            <wd-icon :name="tab.icon" size="28px" />
            <text>{{ tab.title }}</text>
          </view>
        </view>

        <view class="traffic__panel">
          <view class="traffic__row traffic__row--cities">
            <input
              v-model.trim="state.fromCity"
              type="text"
              class="traffic__city-input"
              placeholder="出发城市"
              placeholder-style="color: rgba(22, 24, 35, 0.4); text-align: center;"
              confirm-type="done"
            >
            <view class="traffic__swap" @click="handleSwapCity">
              <wd-icon name="translate-bold" size="26px" />
            </view>
            <input
              v-model.trim="state.toCity"
              type="text"
              class="traffic__city-input"
              placeholder="到达城市"
              placeholder-style="color: rgba(22, 24, 35, 0.4); text-align: center;"
              confirm-type="done"
            >
          </view>

          <view class="traffic__divider" />

          <view class="traffic__row traffic__row--date" @click="handlePickDate">
            <text class="traffic__label">日期</text>
            <text class="traffic__value">{{ formattedDate }}</text>
            <wd-icon name="calendar" size="24px" />
          </view>

          <view v-if="state.activeTab === 'train'" class="traffic__options">
            <wd-checkbox-group v-model="ticketChecks" inline>
              <wd-checkbox
                v-for="option in passengerOptions"
                :key="option.value"
                :model-value="option.value"
                :name="option.value"
              >
                {{ option.label }}
              </wd-checkbox>
            </wd-checkbox-group>
          </view>

          <wd-button
            class="traffic__action"
            block
            :custom-style="actionButtonStyle"
            @click="handleQuery"
          >
            查询 {{ activeTabTitle }}
          </wd-button>
        </view>
      </view>
    </view>

    <wd-calendar
      ref="calendarRef"
      v-model="departDateValue"
      title="选择出发日期"
      :show-type-switch="false"
      :with-cell="false"
      :min-date="calendarMinDate"
      :formatter="calendarFormatter"
      @confirm="handleCalendarConfirm"
    />
  </wd-config-provider>
</template>

<style scoped lang="scss">
.traffic {
  min-height: 100vh;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  padding: 0 32rpx env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
  --wot-color-theme: var(--color-brand-primary);
  position: relative;
}

.traffic__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding-bottom: 48rpx;
}

.traffic__tabs {
  margin-top: 12rpx;
  display: flex;
  gap: 32rpx;
  padding: 10rpx 6rpx;
}

.traffic__tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 18rpx 0;
  color: rgba(var(--color-text-primary-rgb, 22, 24, 35), 0.6);
  position: relative;
}

.traffic__tab--active {
  color: var(--color-brand-primary);
  font-weight: 600;
}

.traffic__tab::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -8rpx;
  transform: translateX(-50%);
  width: 0;
  height: 6rpx;
  border-radius: 999rpx;
  background: transparent;
  transition:
    width 0.24s ease,
    background 0.24s ease;
}

.traffic__tab--active::after {
  width: 50%;
  background: var(--color-brand-primary);
}

.traffic__panel {
  flex: 1;
  background: var(--color-surface);
  border-radius: 36rpx;
  padding: 48rpx 40rpx 60rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.traffic__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
}

.traffic__row--cities {
  font-size: 36rpx;
  font-weight: 600;
}

.traffic__row--date {
  gap: 12rpx;
  cursor: pointer;
}

.traffic__city-input {
  flex: 1;
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-text-primary);
  padding: 10rpx 12rpx;
}

.traffic__swap {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-brand-primary);
}

.traffic__divider {
  height: 2rpx;
  background: var(--color-border-strong);
}

.traffic__label {
  color: var(--color-text-dark);
}

.traffic__value {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.traffic__options {
  margin-top: 20rpx;
}

:deep(.traffic__options .wd-checkbox-group) {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(0, 0, 0, 0);
}

:deep(.traffic__options .wd-checkbox) {
  --wot-checkbox-icon-color: var(--color-border-strong);
  --wot-checkbox-border-color: var(--color-border-strong);
  --wot-checkbox-checked-icon-color: var(--color-text-primary);
  --wot-checkbox-checked-background-color: var(--color-calendar-selected);
  --wot-checkbox-checked-border-color: var(--color-brand-primary);
  --wot-checkbox-label-color: var(--color-text-dark);
  --wot-checkbox-label-margin-left: 16rpx;
}

:deep(.traffic__options .wd-checkbox__icon) {
  width: 28rpx;
  height: 28rpx;
}

.traffic__action {
  margin-top: auto;
}
</style>
