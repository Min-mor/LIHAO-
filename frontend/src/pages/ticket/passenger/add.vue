<script setup lang="ts">
import type { SavePassengerReq } from '@/api/modules/passenger/types'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import LoginPrompt from '@/components/LoginPrompt.vue'
import { useLoginGuard } from '@/hooks/useLoginGuard'
import { createTravelerFromPassenger, fetchTravelerDetailAsPassenger, updateTravelerFromPassenger } from '@/service/traveler'
import { useTicketStore } from '@/store/ticket'
import { useLoginPromptStore } from '@/store/uiLoginPrompt'

defineOptions({ name: 'PassengerAddPage' })

definePage({ style: { navigationStyle: 'custom' } })

const loginPrompt = useLoginPromptStore()
const { isLoggedIn, ensureLogin } = useLoginGuard()
const store = useTicketStore()

const editingId = ref<string>('')
const isEditMode = ref(false)
const type = ref<'adult' | 'child' | 'student'>('adult')
const name = ref('')
const idType = ref('二代身份证')
const idTypeOptions = {
  columns: [
    { label: '二代身份证', value: '二代身份证' },
    { label: '护照', value: '护照' },
    { label: '回乡证', value: '回乡证' },
    { label: '台胞证', value: '台胞证' },
    { label: '外国人永久居留身份证', value: '外国人永久居留身份证' },
    { label: '港澳台居民居住证', value: '港澳台居民居住证' },
  ],
}
const idNo = ref('')
const phone = ref('')

function handleIdTypeConfirm(item: { label: string, value: string }) {
  idType.value = item.value
}

async function confirm() {
  // 姓名验证 - 只允许中文、英文、·
  const trimmedName = name.value?.trim() || ''
  if (!trimmedName) {
    uni.showToast({ title: '请输入姓名', icon: 'none', duration: 2000 })
    return
  }

  const namePattern = /^[\u4E00-\u9FA5A-Z·]+$/i
  if (!namePattern.test(trimmedName)) {
    uni.showToast({ title: '姓名只能包含中文、英文和·', icon: 'none', duration: 2000 })
    return
  }

  if (trimmedName.length < 2 || trimmedName.length > 20) {
    uni.showToast({ title: '姓名长度应为2-20个字符', icon: 'none', duration: 2000 })
    return
  }

  // 证件号验证
  const trimmedIdNo = idNo.value?.trim() || ''
  if (!trimmedIdNo) {
    uni.showToast({ title: '请输入证件号', icon: 'none', duration: 2000 })
    return
  }

  // 根据证件类型验证格式
  if (idType.value === '二代身份证' || idType.value === '港澳台居民居住证') {
    // 二代身份证和港澳台居民居住证：必须是18位
    const idPattern = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dx]$/i
    if (!idPattern.test(trimmedIdNo)) {
      uni.showToast({ title: '请输入正确的18位身份证号', icon: 'none', duration: 2000 })
      return
    }
  }
  else if (idType.value === '护照') {
    // 护照：6-20位字母数字组合
    const passportPattern = /^[a-z0-9]{6,20}$/i
    if (!passportPattern.test(trimmedIdNo)) {
      uni.showToast({ title: '护照号应为6-20位字母或数字', icon: 'none', duration: 2000 })
      return
    }
  }
  else if (idType.value === '回乡证' || idType.value === '台胞证') {
    // 回乡证、台胞证：8-11位字母数字组合
    const hkTwPattern = /^[a-z0-9]{8,11}$/i
    if (!hkTwPattern.test(trimmedIdNo)) {
      uni.showToast({ title: '证件号应为8-11位字母或数字', icon: 'none', duration: 2000 })
      return
    }
  }
  else if (idType.value === '外国人永久居留身份证') {
    // 外国人永久居留身份证：15位或18位
    const foreignerPattern = /^[a-z0-9]{15}$|^[a-z0-9]{18}$/i
    if (!foreignerPattern.test(trimmedIdNo)) {
      uni.showToast({ title: '证件号应为15位或18位字母数字组合', icon: 'none', duration: 2000 })
      return
    }
  }

  // 手机号验证（必填）
  const trimmedPhone = phone.value?.trim() || ''
  if (!trimmedPhone) {
    uni.showToast({ title: '请输入手机号', icon: 'none', duration: 2000 })
    return
  }

  const phonePattern = /^1[3-9]\d{9}$/
  if (!phonePattern.test(trimmedPhone)) {
    uni.showToast({ title: '请输入正确的11位手机号', icon: 'none', duration: 2000 })
    return
  }

  const payload: SavePassengerReq = {
    id: isEditMode.value ? editingId.value : undefined,
    name: trimmedName,
    type: type.value,
    idNo: trimmedIdNo,
    idType: idType.value,
    phone: trimmedPhone,
  }

  try {
    if (isEditMode.value)
      await updateTravelerFromPassenger(editingId.value, payload)
    else
      await createTravelerFromPassenger(payload)

    uni.navigateBack({
      success: () => {
        setTimeout(() => {
          uni.showToast({
            title: isEditMode.value ? '修改成功！' : '添加成功！',
            icon: 'success',
            duration: 1500,
          })
        }, 100)
      },
    })
  }
  catch (error) {
    uni.showToast({ title: '保存乘客失败，请稍后重试', icon: 'none', duration: 2000 })
  }
}

onLoad((options: any) => {
  if (!isLoggedIn.value) {
    ensureLogin(() => {}, {
      message: '添加乘客信息需要登录',
      onCancel: () => {
        uni.navigateBack()
      },
    })
  }

  // 检查是否是编辑模式
  if (options?.id) {
    editingId.value = options.id
    isEditMode.value = true

    fetchTravelerDetailAsPassenger(options.id)
      .then((passenger) => {
        name.value = passenger.name
        type.value = passenger.type
        idNo.value = passenger.idNo || ''
        idType.value = passenger.idType || '二代身份证'
        phone.value = passenger.phone || ''
      })
      .catch(() => {
        uni.showToast({ title: '加载乘客信息失败', icon: 'none', duration: 2000 })
        setTimeout(() => {
          uni.navigateBack()
        }, 500)
      })
  }
})

onShow(() => {
  loginPrompt.close()
})
</script>

<template>
  <view class="p-add">
    <floating-back :left-offset="20" :top-offset="20" />
    <LoginPrompt />

    <view class="head">
      <view class="left-space" />
      <text class="title">{{ isEditMode ? '编辑乘客' : '乘客信息' }}</text>
      <view class="right-space" />
    </view>

    <view class="card">
      <view class="form-grid">
        <text class="label">姓名</text>
        <wd-input v-model="name" class="field" placeholder="与证件一致" clearable custom-style="background-color: transparent!important;" />

        <text class="label">乘客类型</text>
        <wd-radio-group v-model="type" class="field" custom-style="background-color: transparent!important;">
          <view class="radio-wrapper">
            <wd-radio value="adult" custom-style="background-color: transparent!important;">
              成人
            </wd-radio>
            <wd-radio value="child" custom-style="background-color: transparent!important;">
              儿童
            </wd-radio>
          </view>
        </wd-radio-group>

        <text class="label">证件类型</text>
        <wd-picker v-model="idType" class="field" :columns="idTypeOptions.columns" custom-style="background-color: transparent!important;" @confirm="handleIdTypeConfirm" />

        <text class="label">证件号</text>
        <wd-input v-model="idNo" class="field" placeholder="与证件一致" clearable custom-style="background-color: transparent!important;" />

        <text class="label">手机号</text>
        <wd-input v-model="phone" class="field" placeholder="请输入手机号" clearable custom-style="background-color: transparent!important;" />
      </view>
    </view>

    <view class="footer">
      <wd-button type="primary" class="cta" @click="confirm">
        {{ isEditMode ? '保存' : '确认' }}
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.p-add {
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
.card {
  margin: 0 24rpx 20rpx;
  background: var(--color-surface);
  border-radius: 20rpx;
  padding: 24rpx;
}
.form-grid {
  display: grid;
  grid-template-columns: 160rpx 1fr;
  gap: 24rpx 16rpx;
  align-items: center;
}
.label {
  color: var(--color-text-dark);
  font-size: 28rpx;
  text-align: left;
}
.field {
  justify-self: stretch;
}
.radio-wrapper {
  display: flex;
  align-items: center;
  gap: 48rpx;
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
