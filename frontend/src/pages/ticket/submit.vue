<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import LoginPrompt from '@/components/LoginPrompt.vue'
import { useLoginGuard } from '@/hooks/useLoginGuard'
import { useTicketStore } from '@/store/ticket'
import { useLoginPromptStore } from '@/store/uiLoginPrompt'
import { useUserStore } from '@/store/user'

defineOptions({ name: 'TicketSubmitPage' })

definePage({ style: { navigationStyle: 'custom', navigationBarTitleText: '提交订单' } })

const loginPrompt = useLoginPromptStore()
const { ensureLogin } = useLoginGuard()
const userStore = useUserStore()
const store = useTicketStore()

const draft = computed(() => store.orderDraft)
const phone = ref((userStore.userInfo as any)?.phone || store.contactPhone || '')
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
  if (mins === undefined || mins === null)
    return ''
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}时${m}分`
}

function goSelectPassengers() {
  uni.navigateTo({ url: '/pages/ticket/passenger/select' })
}

function removePassenger(id: string) {
  const list = store.passengers.filter(p => p.id !== id)
  store.setPassengers(list)
}

function submit() {
  ensureLogin(() => {
    // 验证订单信息
    if (!draft.value) {
      uni.showToast({ title: '请选择舱位/席别', icon: 'none', duration: 2000 })
      return
    }

    // 验证乘客信息
    if (!store.passengers || store.passengers.length === 0) {
      uni.showToast({ title: '请选择乘车人', icon: 'none', duration: 2000 })
      return
    }

    // 验证联系电话
    const phoneValue = phone.value.trim()
    if (!phoneValue) {
      uni.showToast({ title: '请输入联系电话', icon: 'none', duration: 2000 })
      return
    }

    const phonePattern = /^1[3-9]\d{9}$/
    if (!phonePattern.test(phoneValue)) {
      uni.showToast({ title: '请输入正确的11位手机号', icon: 'none', duration: 2000 })
      return
    }

    // 保存联系电话
    store.setContactPhone(phoneValue)

    // 显示购票成功提示
    uni.showToast({
      title: '购票成功！\n祝您旅途愉快！',
      icon: 'success',
      duration: 2000,
    })

    // 延迟跳转到首页
    setTimeout(() => {
      store.resetDraft()
      // 使用 reLaunch 清空页面栈并跳转到首页
      uni.reLaunch({ url: '/pages/home/index' })
    }, 2000)
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

    <view class="section-passengers">
      <view class="section__title">
        常用乘客信息
      </view>
      <view v-for="p in store.passengers" :key="p.id" class="passenger-card">
        <view class="passenger-info">
          <view class="passenger-row1">
            <text class="passenger-name">{{ p.name }}</text>
            <text class="chip">{{ p.type === 'adult' ? '成人票' : p.type === 'child' ? '儿童票' : '学生票' }}</text>
          </view>
          <view class="passenger-row2">
            <text class="passenger-id">身份证{{ p.idNo?.slice(0, 6) }}********{{ p.idNo?.slice(-4) }}</text>
          </view>
        </view>
        <view class="passenger-fold" @click="removePassenger(p.id)">
          <wd-icon name="minus-circle" size="40rpx" color="var(--color-text-secondary)" />
        </view>
      </view>
      <view class="add-link" @click="goSelectPassengers">
        添加/编辑乘客
      </view>
    </view>

    <view class="section-phone">
      <text class="phone-label">联系电话：</text>
      <wd-input v-model="phone" class="phone-input" placeholder="用于接收订单信息" clearable custom-style="background-color: transparent !important;" />
    </view>

    <view class="footer">
      <wd-button class="cta" type="primary" @click="submit">
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
.head {
  padding-top: calc(env(safe-area-inset-top) + 20rpx);
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.left-space,
.right-space {
  width: 100rpx;
  flex: 0 0 auto;
}
.title {
  color: var(--color-text-dark);
  font-size: 30rpx;
}
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
.fare-row {
  margin-top: 6rpx;
}
.fare-name {
  color: var(--color-text-primary);
}
.fare-price {
  color: var(--color-text-primary);
  white-space: nowrap;
}
.currency {
  font-size: 20rpx;
  margin-right: 2rpx;
  opacity: 0.9;
}
.amount {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--color-text-primary);
}
.section-passengers {
  margin-top: 20rpx;
}
.section__title {
  color: var(--color-text-dark);
  margin-bottom: 16rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: 500;
}
.passenger-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-highlight-bg);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}
.passenger-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.passenger-row1,
.passenger-row2 {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}
.passenger-name {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--color-text-primary);
}
.passenger-id {
  font-size: 24rpx;
  color: var(--color-text-secondary);
}
.chip {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-secondary);
  background: transparent;
}
.passenger-fold {
  flex: 0 0 auto;
  padding: 8rpx;
}
.add-link {
  color: var(--color-brand-primary);
  margin-top: 8rpx;
  text-align: center;
  font-size: 28rpx;
}
.section-phone {
  margin-top: 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.phone-label {
  color: var(--color-text-dark);
  font-size: 28rpx;
  flex: 0 0 auto;
}
.phone-input {
  flex: 1;
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16rpx 24rpx calc(24rpx + env(safe-area-inset-bottom));
  background: transparent;
  border: none;
  box-shadow: none;
}
.cta {
  min-width: 320rpx;
  padding: 0 40rpx;
}
</style>
