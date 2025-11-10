<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import LoginPrompt from '@/components/LoginPrompt.vue'
import { useLoginGuard } from '@/hooks/useLoginGuard'
import { useTicketStore } from '@/store/ticket'
import { useLoginPromptStore } from '@/store/uiLoginPrompt'

defineOptions({ name: 'TicketSubmitPage' })

definePage({ style: { navigationStyle: 'custom', navigationBarTitleText: '提交订单' } })

const loginPrompt = useLoginPromptStore()
const { ensureLogin } = useLoginGuard()
const store = useTicketStore()

const draft = computed(() => store.orderDraft)
const phone = ref(store.contactPhone)
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
const selectedFare = computed(() => {
  const id = store.selectedFareId
  const fares = store.selectedTrip?.fares || []
  return fares.find(f => f.id === id) || fares[0]
})
function formatDuration(mins?: number) {
  if (mins === undefined || mins === null) return ''
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}时${m}分`
}

function addPassenger() {
  const list = store.passengers.length ? [...store.passengers] : []
  list.push({ id: `p${Date.now()}`, name: '张三', type: 'adult' })
  store.setPassengers(list)
}

function removePassenger(id: string) {
  const list = store.passengers.filter(p => p.id !== id)
  store.setPassengers(list)
}

function submit() {
  ensureLogin(() => {
    store.setContactPhone(phone.value)
    if (!draft.value) {
      uni.showToast({ title: '请选择舱位/席别', icon: 'none' })
      return
    }
    uni.showToast({ title: '下单成功（mock）', icon: 'none' })
    setTimeout(() => {
      store.resetDraft()
      uni.switchTab({ url: '/pages/order/index' })
    }, 500)
  })
}

onLoad(() => {
  if (!draft.value) {
    uni.reLaunch({ url: '/pages/ticket/list' })
  }
})

onShow(() => {
  loginPrompt.close()
})
</script>

<template>
  <view class="ticket-submit">
    <floating-back :left-offset="20" :top-offset="20" />
    <LoginPrompt />

    <view v-if="draft" class="head">
      <view class="left-space" />
      <text class="title">{{ dateLabel }} {{ relativeLabel }}{{ store.selectedTrip?.mode === 'train' ? '出发' : '' }}</text>
      <view class="right-space" />
    </view>

    <view v-if="draft" class="summary">
      <view class="row main">
        <text class="time">{{ store.selectedTrip?.departTime }}</text>
        <view class="mid">
          <view class="line" />
          <view class="center">
            <text class="duration">{{ formatDuration(store.selectedTrip?.durationMinutes) }}</text>
            <text class="code-mid">{{ store.selectedTrip?.code }}</text>
          </view>
        </view>
        <text class="time">{{ store.selectedTrip?.arriveTime }}</text>
      </view>
      <view class="row meta">
        <text>{{ store.selectedTrip?.fromName }}</text>
        <text>{{ store.selectedTrip?.toName }}</text>
      </view>
      <view class="row fare-row">
        <text class="fare-name">{{ selectedFare?.name }}</text>
        <text class="fare-price"><text class="currency">￥</text><text class="amount">{{ selectedFare?.price || 0 }}</text></text>
      </view>
    </view>

    <view class="section">
      <view class="section__title">
        常用乘客信息
      </view>
      <view v-for="p in store.passengers" :key="p.id" class="passenger">
        <view class="info">
          <text class="name">{{ p.name }}</text>
          <text class="type">{{ p.type === 'adult' ? '成人票' : p.type === 'child' ? '儿童票' : '学生票' }}</text>
        </view>
        <wd-button size="small" @click="removePassenger(p.id)">
          删
        </wd-button>
      </view>
      <view class="add" @click="addPassenger">
        添加/编辑乘客
      </view>
    </view>

    <view class="section">
      <view class="section__title">
        联系电话
      </view>
      <wd-input v-model="phone" placeholder="用于接收订单信息" clearable />
    </view>

    <view class="footer">
      <view class="total">
        合计：￥{{ draft?.totalPrice || 0 }}
      </view>
      <wd-button type="primary" @click="submit">
        立即下单
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.ticket-submit {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding: 0 24rpx 120rpx;
}
.head { padding-top: calc(env(safe-area-inset-top) + 20rpx); height: 80rpx; display: flex; align-items: center; justify-content: center; }
.left-space, .right-space { width: 100rpx; flex: 0 0 auto; }
.title { color: var(--color-text-dark); font-size: 30rpx; }
.summary {
  background: var(--color-surface);
  border-radius: 20rpx;
  padding: 24rpx;
  margin-top: 12rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
.mid {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  padding: 16rpx 0;
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
.meta {
  gap: 12rpx;
  color: var(--color-text-secondary);
}
.code {
  color: var(--color-text-secondary);
}
.fare-row { margin-top: 6rpx; }
.fare-name { color: var(--color-text-primary); }
.fare-price { color: var(--color-text-primary); white-space: nowrap; }
.currency { font-size: 22rpx; margin-right: 2rpx; opacity: 0.9; }
.amount { font-size: 32rpx; font-weight: 600; color: var(--color-text-primary); }
.section {
  background: var(--color-surface);
  border-radius: 20rpx;
  padding: 24rpx;
  margin-top: 20rpx;
}
.section__title {
  color: var(--color-text-dark);
  margin-bottom: 12rpx;
}
.passenger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 2rpx solid var(--color-border-strong);
}
.passenger:last-child {
  border-bottom: none;
}
.info {
  display: flex;
  flex-direction: column;
}
.name {
  font-weight: 600;
}
.type {
  color: var(--color-text-secondary);
  font-size: 24rpx;
}
.add {
  color: var(--color-brand-primary);
  margin-top: 12rpx;
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-surface);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 24rpx env(safe-area-inset-bottom);
  border-top: 2rpx solid var(--color-border-strong);
}
.total {
  font-weight: 600;
  color: var(--color-text-primary);
}
</style>
