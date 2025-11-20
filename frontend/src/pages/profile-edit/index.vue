<script lang="ts" setup>
import type { IUploadSuccessInfo } from '@/api/modules/auth/types'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import { useUserStore } from '@/store'
import { safeAreaInsets } from '@/utils/systemInfo'
import { useUpload } from '@/utils/uploadFile'

definePage({
  style: {
    navigationStyle: 'custom',
  },
})

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const form = reactive({
  nickname: '',
  signature: '',
})

const showSignatureDialog = ref(false)
const signatureDraft = ref('')

const safeTop = safeAreaInsets?.top ?? 0
const safeBottom = safeAreaInsets?.bottom ?? 0
const paddingTop = computed(() => `${safeTop + 12}px`)
const paddingBottom = computed(() => `${safeBottom + 80}px`)

const { run: uploadAvatar } = useUpload<IUploadSuccessInfo>(
  '/upload',
  {},
  {
    onSuccess: (res) => {
      userStore.setUserAvatar(res.url)
      uni.showToast({ title: '头像已更新', icon: 'success' })
    },
  },
)

watch(
  userInfo,
  (val) => {
    form.nickname = val.nickname || val.username || ''
    form.signature = val.signature || ''
  },
  { immediate: true },
)

function handleAvatarTap() {
  uploadAvatar()
}

function openSignatureDialog() {
  signatureDraft.value = form.signature
  showSignatureDialog.value = true
}

function closeSignatureDialog() {
  showSignatureDialog.value = false
}

function confirmSignature() {
  form.signature = signatureDraft.value.trim()
  showSignatureDialog.value = false
  uni.showToast({ title: '签名已更新', icon: 'success', duration: 1200 })
}

function handleSave() {
  const trimmedNickname = form.nickname.trim()
  userStore.setUserInfo({
    ...userInfo.value,
    nickname: trimmedNickname || userInfo.value.nickname,
    signature: form.signature.trim(),
  })
  uni.showToast({ title: '已保存', icon: 'success' })
  setTimeout(() => {
    uni.navigateBack({ delta: 1 })
  }, 600)
}
</script>

<template>
  <view class="profile-edit" :style="{ paddingTop, paddingBottom }">
    <floating-back :left-offset="32" />

    <view class="profile-edit__header">
      <text class="profile-edit__title">编辑资料</text>
      <text class="profile-edit__subtitle">更新资料，保持形象在线</text>
    </view>

    <view class="profile-edit__card">
      <view class="profile-edit__row profile-edit__row--avatar" @click="handleAvatarTap">
        <view class="profile-edit__row-label">
          头像
        </view>
        <view class="profile-edit__row-content">
          <image :src="userInfo.avatar" mode="aspectFill" class="profile-edit__avatar" />
          <wd-icon name="arrow-right" size="32rpx" />
        </view>
      </view>

      <view class="profile-edit__row">
        <view class="profile-edit__row-label">
          昵称
        </view>
        <input
          v-model="form.nickname"
          class="profile-edit__row-input"
          type="text"
          placeholder="请输入昵称"
          :maxlength="20"
        >
      </view>

      <view class="profile-edit__row">
        <view class="profile-edit__row-label">
          用户 ID
        </view>
        <text class="profile-edit__row-value">{{ userInfo.userId }}</text>
      </view>

      <view class="profile-edit__row profile-edit__row--clickable" @click="openSignatureDialog">
        <view class="profile-edit__row-label">
          个性签名
        </view>
        <view class="profile-edit__row-content profile-edit__row-content--signature">
          <text class="profile-edit__row-signature">{{ form.signature || '点击填写个性签名' }}</text>
          <wd-icon name="edit" size="28rpx" />
        </view>
      </view>
    </view>

    <wd-button
      type="primary"
      block
      custom-class="profile-edit__submit"
      @click="handleSave"
    >
      保存更新
    </wd-button>

    <view v-if="showSignatureDialog" class="profile-edit__signature-overlay" @click="closeSignatureDialog">
      <view class="profile-edit__signature-dialog" @click.stop>
        <view class="profile-edit__signature-header">
          编辑个性签名
        </view>
        <textarea
          v-model="signatureDraft"
          class="profile-edit__signature-textarea"
          :maxlength="80"
          placeholder="写点什么，让大家更了解你"
          show-confirm-bar
        />
        <view class="profile-edit__signature-actions">
          <wd-button size="small" custom-class="profile-edit__signature-cancel" @click="closeSignatureDialog">
            取消
          </wd-button>
          <wd-button size="small" type="primary" custom-class="profile-edit__signature-confirm" @click="confirmSignature">
            修改签名
          </wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@use '@/style/index.scss' as *;

.profile-edit {
  min-height: 100vh;
  padding-left: 28rpx;
  padding-right: 28rpx;
  background: linear-gradient(180deg, #fff 0%, $color-profile-background 100%);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  position: relative;
}

.profile-edit__header {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-top: 60rpx;
  color: $color-text-muted;
}

.profile-edit__title {
  font-size: 40rpx;
  font-weight: 650;
  color: $color-brand-primary;
}

.profile-edit__subtitle {
  font-size: 26rpx;
  line-height: 1.5;
}

.profile-edit__card {
  background: $color-profile-surface;
  border-radius: 36rpx;
  box-shadow: 0 18rpx 48rpx $color-shadow-card;
  padding: 16rpx 28rpx;
  display: flex;
  flex-direction: column;
}

.profile-edit__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
  gap: 24rpx;
  border-bottom: 1px solid $color-border-light;
}

.profile-edit__row:last-child {
  border-bottom: none;
}

.profile-edit__row-label {
  font-size: 28rpx;
  color: rgba($color-base-text, 0.68);
}

.profile-edit__row-content {
  display: inline-flex;
  align-items: center;
  gap: 20rpx;
  color: $color-text-muted;
}

.profile-edit__row-content--signature {
  max-width: 420rpx;
  justify-content: flex-end;
}

.profile-edit__row-signature {
  font-size: 26rpx;
  color: $color-text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-edit__row-input {
  flex: 1;
  text-align: right;
  font-size: 28rpx;
  color: $color-text-primary;
  background: transparent;
}

.profile-edit__row-value {
  font-size: 28rpx;
  color: $color-text-muted;
}

.profile-edit__row--avatar {
  cursor: pointer;
}

.profile-edit__row--clickable {
  cursor: pointer;
}

.profile-edit__avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba($color-brand-primary, 0.18);
  box-shadow: 0 12rpx 32rpx rgba($color-base-text, 0.08);
}

.profile-edit__submit {
  --wot-button-font-size: 30rpx;
  --wot-button-padding-y: 18rpx;
  --wot-button-border-radius: 999rpx;
  margin-bottom: 60rpx;
}

.profile-edit__signature-overlay {
  position: fixed;
  inset: 0;
  background: rgba($color-base-text, 0.35);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 48rpx;
  z-index: 120;
}

.profile-edit__signature-dialog {
  width: 100%;
  max-width: 640rpx;
  background: #ffffff;
  border-radius: 36rpx;
  padding: 40rpx 36rpx 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  box-shadow: 0 32rpx 68rpx rgba($color-base-text, 0.18);
}

.profile-edit__signature-header {
  font-size: 34rpx;
  font-weight: 600;
  color: $color-text-primary;
}

.profile-edit__signature-textarea {
  width: 100%;
  min-height: 200rpx;
  border-radius: 28rpx;
  padding: 24rpx;
  background: rgba($color-brand-primary, 0.06);
  border: 1px solid rgba($color-brand-primary, 0.2);
  box-sizing: border-box;
  font-size: 28rpx;
  color: $color-text-primary;
}

.profile-edit__signature-actions {
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
}

.profile-edit__signature-cancel {
  --wot-button-border-radius: 999rpx;
  --wot-button-padding-x: 32rpx;
  --wot-button-padding-y: 12rpx;
}

.profile-edit__signature-confirm {
  --wot-button-border-radius: 999rpx;
  --wot-button-padding-x: 40rpx;
  --wot-button-padding-y: 12rpx;
}

@media (max-width: 375px) {
  .profile-edit__row-content--signature {
    max-width: 340rpx;
  }
}
</style>
