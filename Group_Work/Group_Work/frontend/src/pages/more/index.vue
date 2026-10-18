<script setup lang="ts">
import { computed, ref } from 'vue'
import FloatingBack from '@/components/common/FloatingBack.vue'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'MorePage',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '更多',
  },
})

const city = ref('')
const cityError = ref('')
const isCityExpanded = ref(true)
const isDaysExpanded = ref(false)

const dayColumns = ref(Array.from({ length: 15 }, (_, index) => `${index + 1}`))
const dayValue = ref('')
const selectedDays = ref<number>(0)

const suggestionList = ref([
  {
    id: 'beijing',
    name: '北京',
    duration: '4',
    cover: '/static/images/mock-package-1.png',
  },
  {
    id: 'lushan',
    name: '庐山',
    duration: '2',
    cover: '/static/images/mock-package-2.png',
  },
  {
    id: 'jiujiang',
    name: '九江',
    duration: '2',
    cover: '/static/images/mock-package-3.png',
  },
])

const daysLabel = computed(() => {
  if (selectedDays.value)
    return `${selectedDays.value}天`
  return ''
})

const cityLabel = computed(() => (city.value ? city.value : ''))

const safeTop = safeAreaInsets?.top || 0
const contentPaddingTop = computed(() => {
  const navPadding = typeof uni !== 'undefined' && typeof uni.upx2px === 'function' ? uni.upx2px(160) : 120
  return `${safeTop + navPadding}px`
})

const isGoDisabled = computed(() => !city.value || !selectedDays.value)

function handleGo() {
  if (isGoDisabled.value) {
    if (!city.value)
      cityError.value = '请选择一个国家或城市'
    return
  }
  const days = selectedDays.value || Number(dayValue.value)
  uni.showToast({
    title: '功能开发中',
    icon: 'none',
  })
}

function handleSelectSuggestion(item: (typeof suggestionList.value)[number]) {
  city.value = item.name
  cityError.value = ''
  dayValue.value = item.duration
  selectedDays.value = Number(item.duration)
  isCityExpanded.value = false
  isDaysExpanded.value = true
}

function openCitySection() {
  isCityExpanded.value = true
  isDaysExpanded.value = false
}

function handleCityCardClick() {
  if (isCityExpanded.value)
    return
  openCitySection()
}

function openDaysSection() {
  if (!city.value) {
    cityError.value = '请选择一个国家或城市'
    isCityExpanded.value = true
    isDaysExpanded.value = false
    return
  }
  if (!selectedDays.value && dayValue.value)
    selectedDays.value = Number(dayValue.value)
  isCityExpanded.value = false
  isDaysExpanded.value = true
}

function handleDaysCardClick() {
  if (isDaysExpanded.value)
    return
  openDaysSection()
}

function handleDaysChange({ value }: { value: string | string[] }) {
  const current = Array.isArray(value) ? value[0] : value
  if (!current)
    return
  dayValue.value = current
  selectedDays.value = Number(current)
}

function dayFormatter(value: string) {
  return `${value}天`
}
</script>

<template>
  <view class="more" :style="{ paddingTop: `${safeTop}px` }">
    <floating-back :left-offset="40" />

    <view class="more__content" :style="{ paddingTop: contentPaddingTop }">
      <view class="more__header">
        <text class="more__title">目的地</text>
        <text class="more__subtitle">为你匹配最合适的目的地灵感</text>
      </view>

      <view
        class="more__card more__card--city"
        :class="{ 'is-collapsed': !isCityExpanded, 'is-active': isCityExpanded }"
      >
        <view class="more__card-header" @click="handleCityCardClick">
          <text class="more__card-label" :class="{ 'is-active': isCityExpanded }">目的地</text>
          <view class="more__card-value">
            <text class="more__card-text" :class="{ 'is-active': isCityExpanded }">{{ cityLabel }}</text>
            <wd-icon name="arrow-right" size="24px" />
          </view>
        </view>

        <transition name="more-collapse">
          <view v-if="isCityExpanded" class="more__card-body">
            <view class="more__search">
              <wd-icon name="search" size="28px" class="more__search-icon" />
              <wd-input
                v-model="city"
                placeholder="国家 / 城市"
                clearable
                @input="cityError = ''"
              />
            </view>
            <text v-if="cityError" class="more__error">{{ cityError }}</text>

            <view class="more__suggestions">
              <view
                v-for="item in suggestionList"
                :key="item.id"
                class="more__suggestion"
                @click="handleSelectSuggestion(item)"
              >
                <image :src="item.cover" class="more__suggestion-cover" mode="scaleToFill" />
                <view class="more__suggestion-body">
                  <text class="more__suggestion-title">{{ item.name }}</text>
                  <text class="more__suggestion-sub">建议游玩{{ item.duration }}天</text>
                </view>
              </view>
            </view>

            <wd-button
              class="more__next"
              type="primary"
              :disabled="!city"
              @click="openDaysSection"
            >
              下一步
            </wd-button>
          </view>
        </transition>
      </view>

      <view
        class="more__card more__card--days"
        :class="{ 'is-active': isDaysExpanded, 'is-collapsed': !isDaysExpanded }"
      >
        <view class="more__card-header" @click="handleDaysCardClick">
          <text class="more__card-label" :class="{ 'is-active': isDaysExpanded }">游玩天数</text>
          <view class="more__card-value">
            <text class="more__card-text" :class="{ 'is-active': isDaysExpanded }">
              {{ isDaysExpanded ? '' : daysLabel || '请选择游玩天数' }}
            </text>
            <wd-icon name="arrow-right" size="24" />
          </view>
        </view>

        <transition name="more-collapse">
          <view v-if="isDaysExpanded" class="more__card-body more__card-body--days">
            <view class="more__days-picker-container">
              <wd-picker-view
                v-model="dayValue"
                class="more__days-picker"
                :columns="dayColumns"
                :formatter="dayFormatter"
                indicator-style="height: 128rpx;"
                @change="handleDaysChange"
              />
            </view>
          </view>
        </transition>
      </view>

      <!-- 查询行程按钮 - 移到卡片外 -->
      <wd-button
        v-if="isDaysExpanded"
        class="more__submit-button"
        type="primary"
        :disabled="isGoDisabled"
        @click="handleGo"
      >
        查询行程
      </wd-button>
    </view>
  </view>
</template>

<style scoped lang="scss">
.more {
  min-height: 100vh;
  background: var(--color-bg-primary);
  padding: 32rpx 40rpx calc(env(safe-area-inset-bottom) + 48rpx);
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  position: relative;
}

.more__content {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  margin-top: 0;
}

.more__header {
  color: var(--color-text-primary);
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.more__title {
  font-size: 44rpx;
  font-weight: 700;
}

.more__subtitle {
  font-size: 26rpx;
  color: var(--color-text-secondary);
}

.more__card {
  padding: 36rpx 40rpx;
  border-radius: 32rpx;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.08);
  border: 2rpx solid transparent;
  transition:
    padding 0.24s ease,
    box-shadow 0.24s ease,
    background 0.24s ease,
    border-color 0.24s ease;
}

.more__card.is-active {
  background: var(--color-highlight-bg);
  border-color: var(--color-border-light);
  box-shadow: 0 20rpx 40rpx var(--color-shadow-soft);
}

.more__card--city.is-collapsed {
  padding: 32rpx 36rpx;
}

.more__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.more__card-label {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--color-text-primary);
  transition:
    color 0.24s ease,
    font-size 0.24s ease,
    font-weight 0.24s ease;
}

.more__card-label.is-active {
  font-size: 34rpx;
  font-weight: 650;
  color: var(--color-brand-primary);
}

.more__card-value {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.more__card-value .wd-icon {
  transition: transform 0.24s ease;
}

.more__card.is-active .more__card-value .wd-icon {
  transform: rotate(90deg);
}

.more__card-text {
  max-width: 360rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 30rpx;
  font-weight: 520;
}

.more__card-text.is-active,
.more__card-value .is-active {
  font-size: 32rpx;
  color: var(--color-brand-primary);
}

.more__card-body {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.more__card-body--days {
  gap: 40rpx;
  align-items: center;
  padding: 20rpx 24rpx 0;
}

.more__days-picker-container {
  position: relative;
  width: 100%;
  height: 420rpx;
  padding: 0 20rpx;
  overflow: hidden;
  background: transparent;
}

.more__days-picker {
  width: 100%;
  height: 100%;
  background: transparent;
  --wot-picker-column-fs: 38rpx;
  --wot-picker-column-color: rgba(22, 24, 35, 0.52);
  --wot-picker-column-active-fs: 56rpx;
  --wot-picker-column-active-color: var(--color-brand-primary);
  --wot-picker-column-active-font-weight: 650;
  --picker-view-column-indicator-height: 132rpx;
}

:deep(.more__days-picker .wd-picker-view__mask) {
  background: transparent !important;
}

:deep(.more__days-picker .wd-picker-view__indicator) {
  height: var(--picker-view-column-indicator-height) !important;
  top: calc(50% - (var(--picker-view-column-indicator-height) / 2)) !important;
  border-radius: 24rpx;
  border: 2rpx solid var(--color-brand-soft-strong);
  background: transparent;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

:deep(.more__days-picker .wd-picker-view__indicator)::before,
:deep(.more__days-picker .wd-picker-view__indicator)::after {
  content: '';
  position: absolute;
  left: 20rpx;
  right: 20rpx;
  height: 2rpx;
  background: var(--color-border-light);
  opacity: 0.7;
}

:deep(.more__days-picker .wd-picker-view__indicator)::before {
  top: 26rpx;
}

:deep(.more__days-picker .wd-picker-view__indicator)::after {
  bottom: 26rpx;
}

:deep(.more__days-picker .wd-picker-view-column__item) {
  height: var(--picker-view-column-indicator-height) !important;
  line-height: var(--picker-view-column-indicator-height) !important;
  font-size: var(--wot-picker-column-fs) !important;
  font-weight: 520 !important;
  color: var(--wot-picker-column-color) !important;
  transition:
    font-size 0.24s ease,
    font-weight 0.24s ease,
    color 0.24s ease,
    opacity 0.24s ease,
    transform 0.24s ease;
  opacity: 0.45;
  transform: scale(0.9);
}

:deep(.more__days-picker .wd-picker-view-column__item--active) {
  font-size: var(--wot-picker-column-active-fs) !important;
  font-weight: var(--wot-picker-column-active-font-weight) !important;
  color: var(--wot-picker-column-active-color) !important;
  opacity: 1;
  transform: scale(1);
}

.more__submit-button {
  margin-top: 48rpx;
  width: 100%;
  --wot-button-border-radius: 999rpx;
  --wot-button-border-width: 0;
  --wot-button-font-size: 32rpx;
  --wot-button-height: 96rpx;
  font-weight: 600;
}

:deep(.more__days-picker-view) {
  height: 100%;
}

.more__search {
  display: flex;
  align-items: center;
  gap: 20rpx;

  border-radius: 32rpx;
  padding: 26rpx 30rpx;
  background: transparent;

  :deep(.wd-input) {
    flex: 1;
    --wot-input-font-size: 32rpx;
    --wot-input-color: var(--color-text-primary);
    --wot-input-placeholder-color: rgba(22, 24, 35, 0.4);
    --wot-input-caret-color: var(--color-brand-primary);
    --wot-input-border-width: 0;
    --wot-input-padding-y: 0;
    --wot-input-padding-x: 0;
    --wot-input-background-color: transparent;
    background-color: transparent;
    box-shadow: none;
  }

  :deep(.wd-input__value) {
    padding: 0;
    font-size: 32rpx;
    color: var(--color-text-primary);
  }

  :deep(.wd-input__value)::after {
    display: none;
  }

  :deep(.wd-input__clear) {
    background: transparent !important;
    color: #325947;
  }
}

.more__search-icon {
  color: var(--color-text-secondary);
}

.more__error {
  font-size: 26rpx;
  color: var(--color-danger, #ff4d4f);
  padding-left: 12rpx;
}

.more-collapse-enter-active,
.more-collapse-leave-active {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
  transform-origin: top;
}

.more-collapse-enter-from,
.more-collapse-leave-to {
  opacity: 0;
  transform: translateY(-12rpx);
}

.more-fade-enter-active,
.more-fade-leave-active {
  transition:
    opacity 0.24s ease,
    transform 0.24s ease;
}

.more-fade-enter-from,
.more-fade-leave-to {
  opacity: 0;
  transform: translateY(16rpx);
}

.more__suggestions {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.more__suggestion {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 12rpx 0;
  border-radius: 999rpx;
  color: var(--color-text-primary);
}

.more__suggestion-cover {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  object-fit: cover;
}

.more__suggestion-body {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.more__suggestion-title {
  font-size: 30rpx;
  font-weight: 650;
  color: var(--color-text-primary);
}

.more__suggestion-sub {
  font-size: 24rpx;
  color: rgba(22, 24, 35, 0.56);
}

.more__next {
  align-self: flex-end;
  margin-top: 12rpx;
  --wot-button-border-radius: 999rpx;
  --wot-button-border-width: 0;
  --wot-button-font-size: 30rpx;
  background: var(--color-brand-primary);
  color: var(--color-bg-primary);
  padding: 0 60rpx;
}
</style>
