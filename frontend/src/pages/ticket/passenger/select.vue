<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import LoginPrompt from '@/components/LoginPrompt.vue'
import { useLoginGuard } from '@/hooks/useLoginGuard'
import { deleteTravelerById, fetchTravelersForCurrentUser } from '@/service/traveler'
import { useTicketStore } from '@/store/ticket'
import { useLoginPromptStore } from '@/store/uiLoginPrompt'
import { useUserStore } from '@/store/user'

defineOptions({ name: 'PassengerSelectPage' })

definePage({ style: { navigationStyle: 'custom' } })

const loginPrompt = useLoginPromptStore()
const { isLoggedIn, ensureLogin } = useLoginGuard()
const userStore = useUserStore()
const store = useTicketStore()

const saved = computed(() => store.savedPassengersForCurrentUser)
const checked = ref<string[]>([])
const showActionSheet = ref(false)
const currentPassenger = ref<any>(null)
const loading = ref(false)

const maskedPhone = computed(() => {
  const phone = (userStore.userInfo as any)?.phone || ''
  if (!phone)
    return '未绑定手机号'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

async function refreshTravelers() {
  if (!isLoggedIn.value)
    return
  try {
    loading.value = true
    const list = await fetchTravelersForCurrentUser()
    store.setSavedPassengersForCurrentUser(list)
  }
  catch (error) {
    uni.showToast({ title: '加载乘客失败', icon: 'none' })
  }
  finally {
    loading.value = false
  }
}

function toggle(id: string) {
  const set = new Set(checked.value)
  if (set.has(id))
    set.delete(id)
  else set.add(id)
  checked.value = Array.from(set)
}

function goAdd() {
  uni.navigateTo({ url: '/pages/ticket/passenger/add' })
}

function confirm() {
  const list = saved.value.filter(p => checked.value.includes(p.id))
  store.setPassengers(list)

  // 返回上一页
  uni.navigateBack({
    delta: 1,
    fail: (err) => {
      console.error('返回失败：', err)
      // 降级方案：直接跳转到提交页
      uni.redirectTo({
        url: '/pages/ticket/submit',
      })
    },
  })
}

function showActions(passenger: any) {
  currentPassenger.value = passenger
  showActionSheet.value = true
}

function handleAction(detail: any) {
  if (!currentPassenger.value)
    return

  let actionName = ''

  if (detail && typeof detail === 'object') {
    actionName = detail.item?.name || detail.name || ''
    const actionIndex = detail.index !== undefined ? detail.index : -1

    if (!actionName && actionIndex === 0)
      actionName = '编辑'
    if (!actionName && actionIndex === 1)
      actionName = '删除'
  }
  else if (typeof detail === 'number') {
    if (detail === 0)
      actionName = '编辑'
    if (detail === 1)
      actionName = '删除'
  }

  if (actionName === '编辑') {
    uni.navigateTo({
      url: `/pages/ticket/passenger/add?id=${currentPassenger.value.id}`,
    })
    showActionSheet.value = false
    currentPassenger.value = null
  }
  else if (actionName === '删除') {
    // 保存当前乘客信息，避免弹窗关闭时被清空
    const passengerToDelete = currentPassenger.value

    // 先关闭 ActionSheet
    showActionSheet.value = false

    // 确认删除
    uni.showModal({
      title: '删除乘客',
      content: `确定要删除 ${passengerToDelete.name} 吗？`,
      confirmColor: '#325947',
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteTravelerById(passengerToDelete.id)
            store.removeSavedPassenger(passengerToDelete.id)
          }
          catch (error) {
            uni.showToast({ title: '删除失败，请稍后重试', icon: 'none' })
            return
          }
          // 如果该乘客在选中列表中，也要移除
          const index = checked.value.indexOf(passengerToDelete.id)
          if (index > -1) {
            checked.value.splice(index, 1)
          }
          uni.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500,
          })
        }
      },
      complete: () => {
        // 弹窗关闭后清空
        currentPassenger.value = null
      },
    })
  }
  else {
    // 其他情况直接关闭
    showActionSheet.value = false
    currentPassenger.value = null
  }
}

onLoad(() => {
  if (!isLoggedIn.value) {
    ensureLogin(() => {
      refreshTravelers()
    }, {
      message: '查看和管理乘客信息需要登录',
      onCancel: () => {
        uni.navigateBack()
      },
    })
  }
  else {
    refreshTravelers()
  }
})

onShow(() => {
  loginPrompt.close()
  if (isLoggedIn.value)
    refreshTravelers()
})
</script>

<template>
  <view class="p-select">
    <floating-back :left-offset="20" :top-offset="20" />
    <LoginPrompt />

    <view class="head">
      <view class="left-space" />
      <text class="title">选择乘车人</text>
      <view class="right-space" />
    </view>

    <view class="add-card">
      <view class="add-avatar">
        <wd-icon name="user" size="56rpx" color="var(--color-text-primary)" />
      </view>
      <view class="add-info">
        <text class="add-label">{{ maskedPhone }}</text>
        <view class="add-tag">
          账号信息
        </view>
      </view>
    </view>

    <view class="toolbar">
      <text class="toolbar-label">乘车人</text>
      <text class="toolbar-add" @click="goAdd">添加乘车人</text>
    </view>

    <view class="list">
      <view v-for="p in saved" :key="p.id" class="passenger-item" @click="toggle(p.id)">
        <view class="passenger-left" @click.stop="showActions(p)">
          <wd-icon name="edit" size="40rpx" color="var(--color-text-secondary)" />
        </view>
        <view class="passenger-mid">
          <view class="passenger-row1">
            <text class="passenger-name">{{ p.name }}</text>
            <text class="chip">{{ p.type === 'adult' ? '成人票' : p.type === 'child' ? '儿童票' : '学生票' }}</text>
          </view>
          <text class="passenger-id">身份证{{ p.idNo?.slice(0, 4) }}**********{{ p.idNo?.slice(-3) }}</text>
        </view>
        <view class="passenger-right">
          <wd-checkbox :model-value="checked.includes(p.id)" @click.stop="toggle(p.id)" />
        </view>
      </view>
    </view>

    <view class="footer">
      <wd-button class="cta" type="primary" @click="confirm">
        确认
      </wd-button>
    </view>

    <wd-action-sheet
      v-model="showActionSheet"
      :actions="[
        { name: '编辑' },
        { name: '删除', color: '#ff4444' },
      ]"
      @select="handleAction"
    />
  </view>
</template>

<style scoped lang="scss">
.p-select {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding: 0 0 140rpx;
}
.head {
  padding-top: calc(env(safe-area-inset-top) + 24rpx);
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}
.left-space,
.right-space {
  width: 100rpx;
  flex: 0 0 auto;
}
.title {
  color: var(--color-text-dark);
  font-size: 32rpx;
  font-weight: 500;
}
.add-card {
  margin: 0 24rpx 24rpx;
  background: var(--color-surface);
  border-radius: 20rpx;
  padding: 20rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  border: 2rpx solid var(--color-highlight-bg);
}
.add-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: var(--color-bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.add-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.add-label {
  color: var(--color-text-primary);
  font-size: 28rpx;
  font-weight: 500;
}
.add-tag {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-secondary);
  background: transparent;
}
.toolbar {
  margin: 0 24rpx 16rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.toolbar-label {
  color: var(--color-text-dark);
  font-size: 28rpx;
  font-weight: 500;
}
.toolbar-add {
  color: var(--color-brand-primary);
  font-size: 28rpx;
}
.list {
  margin: 0 24rpx;
}
.passenger-item {
  background: var(--color-surface);
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.passenger-left {
  flex: 0 0 auto;
  cursor: pointer;
  padding: 8rpx;
  margin: -8rpx;
  transition: opacity 0.2s;

  &:active {
    opacity: 0.6;
  }
}
.passenger-mid {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.passenger-row1 {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.passenger-name {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--color-text-primary);
}
.chip {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-secondary);
  background: transparent;
}
.passenger-id {
  font-size: 24rpx;
  color: var(--color-text-secondary);
}
.passenger-right {
  flex: 0 0 auto;
}
.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  padding: 16rpx 24rpx calc(24rpx + env(safe-area-inset-bottom));
  background: transparent;
}
.cta {
  min-width: 320rpx;
}
</style>
