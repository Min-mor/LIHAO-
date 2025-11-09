<script setup lang="ts">
import type { SwiperList } from 'wot-design-uni/components/wd-swiper/types'
import type { ProductCard } from '@/api/types/product'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, ref, unref } from 'vue'
import LoginPrompt from '@/components/LoginPrompt.vue'
import { useLoginGuard } from '@/hooks/useLoginGuard'
import { destinationTabsMock, heroPackagesMock } from '@/mock/data/product'
import { useUserStore } from '@/store'
import { useLoginPromptStore } from '@/store/uiLoginPrompt'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'HomePage',
})

definePage({
  type: 'home',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
})

const { isLoggedIn, ensureLogin } = useLoginGuard()
const loginPrompt = useLoginPromptStore()
const userStore = useUserStore()
const greeting = computed(() => (isLoggedIn.value ? (userStore.userInfo?.nickname?.trim() || 'traveler') : 'traveler'))
const avatarUrl = computed(() => (isLoggedIn.value ? (userStore.userInfo?.avatar || '/static/images/default-avatar.png') : '/static/images/default-avatar.png'))
const searchValue = ref('')

const destinationTabs = ref(destinationTabsMock.map(tab => ({ ...tab })))
const activeDestination = ref(destinationTabs.value[0]?.name ?? 'nearby')

type HomeSwiperItem = ProductCard & SwiperList

const swiperList = ref<HomeSwiperItem[]>(heroPackagesMock.map(item => ({ ...item })))

const headerPaddingOffset = typeof uni !== 'undefined' && uni.upx2px ? uni.upx2px(32) : 32
const homePaddingTop = computed(() => `${(safeAreaInsets?.top || 0) + headerPaddingOffset}px`)
const toolButtonStyle = 'border-radius:999rpx;padding:36rpx 0;background:#325947!important;color:#f5f2ea!important;min-width:auto;display:inline-flex;align-items:center;justify-content:center;'
const seeMoreButtonStyle = 'border-radius:999rpx;padding:18rpx 36rpx;background:#325947!important;color:#f5f2ea!important;min-width:220rpx;max-width:360rpx;display:flex;align-items:center;justify-content:center;width:auto;margin:24rpx auto 0;'
const filterNormalStyle = '--wot-button-info-bg-color:rgba(22,24,35,0.06);--wot-button-info-color:#161823;--wot-button-info-border-radius:999rpx;--wot-button-info-padding-y:14rpx;--wot-button-info-padding-x:36rpx;'
const filterActiveStyle = '--wot-button-info-bg-color:#161823;--wot-button-info-color:#fcfbfa;--wot-button-info-border-radius:999rpx;--wot-button-info-padding-y:14rpx;--wot-button-info-padding-x:36rpx;'

const swiperCurrent = ref(0)

const swiperDots = computed(() => swiperList.value.length)

function getSwiperItem(item: SwiperList | string) {
  return item as HomeSwiperItem
}

function handleSwiperClick(itemId: string) {
  uni.navigateTo({
    url: `/pages/product/index?id=${itemId}`,
  })
}

function handleTraffic() {
  uni.navigateTo({
    url: '/pages/traffic/index',
  })
}

function handleSeeMore() {
  uni.navigateTo({
    url: '/pages/more/index',
  })
}

function handleOpenProfile() {
  if (isLoggedIn.value) {
    uni.navigateTo({ url: '/pages/profile/index' })
  }
  else {
    ensureLogin()
  }
}

function handleSwiperChange({ current }: { current: number }) {
  swiperCurrent.value = current
}

function isActiveCard(index: number) {
  return index === swiperCurrent.value
}

function isPrevCard(index: number) {
  const total = swiperList.value.length
  return (swiperCurrent.value - 1 + total) % total === index
}

function isNextCard(index: number) {
  const total = swiperList.value.length
  return (swiperCurrent.value + 1) % total === index
}

function handleToggleFavorite(itemId: string) {
  console.log('toggle favorite', itemId)
}

onLoad(() => {
  // 预留：可在此拉取用户称谓等信息
})

onShow(() => {
  loginPrompt.close()
})
</script>

<template>
  <view class="home" :style="{ paddingTop: homePaddingTop }">
    <view class="home__header">
      <view class="home__greeting">
        <text class="home__greeting-title">Hello {{ greeting }}</text>
        <text class="home__greeting-sub">welcome to trip</text>
      </view>
      <view class="home__avatar" @click="handleOpenProfile">
        <image :src="avatarUrl" mode="aspectFill" class="home__avatar-img" />
      </view>
    </view>

    <view class="home__search">
      <wd-input
        v-model="searchValue"
        prefix-icon="search"
        placeholder="Search"
        clearable
      />
    </view>

    <view class="home__section">
      <text class="home__section-title">select your next trip</text>
      <wd-button
        class="home__traffic"
        type="primary"
        :custom-style="toolButtonStyle"
        @click="handleTraffic"
      >
        <view class="home__traffic-content">
          <wd-icon name="send" size="28px" />
          <text>交通</text>
          <wd-icon name="arrow-right" size="20px" />
        </view>
      </wd-button>

      <view class="home__filters">
        <wd-button
          v-for="tab in destinationTabs"
          :key="tab.name"
          class="home__filter"
          type="info"
          size="large"
          :custom-style="tab.name === activeDestination ? filterActiveStyle : filterNormalStyle"
          @click="activeDestination = tab.name"
        >
          {{ tab.title }}
        </wd-button>
      </view>
    </view>

    <view class="home__swiper">
      <wd-swiper
        v-slot="{ item, index }"
        :list="swiperList"
        height="360"
        :indicator="false"
        previous-margin="32rpx"
        next-margin="32rpx"
        :loop="false"
        @click="({ current }) => handleSwiperClick(getSwiperItem(unref(swiperList)[current]).id)"
        @change="handleSwiperChange"
      >
        <view
          class="home__swiper-card"
          :class="{
            'home__swiper-card--active': isActiveCard(index),
            'home__swiper-card--prev': isPrevCard(index),
            'home__swiper-card--next': isNextCard(index),
          }"
        >
          <image
            class="home__swiper-cover"
            :src="getSwiperItem(item).cover"
            mode="aspectFill"
          />
          <view class="home__swiper-content">
            <view class="home__swiper-header">
              <text class="home__swiper-title">{{ getSwiperItem(item).title }}</text>
              <wd-tag size="small" plain round custom-class="home__swiper-score">
                {{ getSwiperItem(item).score }}
              </wd-tag>
            </view>
            <text class="home__swiper-summary">{{ getSwiperItem(item).summary }}</text>
            <view class="home__swiper-tags">
              <wd-tag
                v-for="tag in getSwiperItem(item).tags"
                :key="tag"
                size="mini"
                plain
                round
                custom-class="home__swiper-tag"
              >
                {{ tag }}
              </wd-tag>
            </view>
          </view>
          <view
            class="home__swiper-heart"
            @click.stop="handleToggleFavorite(getSwiperItem(item).id)"
          >
            <wd-icon name="heart" size="24px" />
          </view>
        </view>
      </wd-swiper>
      <view class="home__swiper-dots">
        <view
          v-for="(_, dotIndex) in swiperDots"
          :key="dotIndex"
          class="home__swiper-dot"
          :class="{ 'home__swiper-dot--active': isActiveCard(dotIndex) }"
        />
      </view>
      <wd-button
        class="home__swiper-more"
        type="primary"
        :custom-style="seeMoreButtonStyle"
        @click="handleSeeMore"
      >
        see more
      </wd-button>
    </view>
  </view>
  <LoginPrompt />
</template>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding: 32rpx 32rpx 160rpx;
  background: #fcfbfa;
  color: #161823;
}

.home__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.home__greeting-title {
  font-size: 44rpx;
  font-weight: 600;
}

.home__greeting-sub {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #2b2b2b;
}

.home__avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: rgba(160, 212, 196, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #325947;
}

.home__avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.home__search {
  width: 100%;
  :deep(.wd-input) {
    --wot-input-border-width: 0;
    --wot-input-border-radius: 44rpx;
    --wot-input-padding-y: 8rpx;
    --wot-input-padding-x: 56rpx;
    --wot-input-font-size: 30rpx;
    --wot-input-height: 60rpx;
    --wot-input-background-color: #ffffff;
    background: #f7f4ec;
    border-radius: 44rpx;
    overflow: hidden;
    box-shadow: none;
  }
  :deep(.wd-input__wrapper) {
    border-radius: 44rpx;
    background: #ffffff;
    padding: 0;
  }
  :deep(.wd-input__value) {
    padding: 0 32rpx 0 48rpx;
  }
  :deep(.wd-input__value)::after {
    display: none;
  }
  :deep(.wd-input__prefix) {
    margin-right: 20rpx;
    background: transparent;
    padding: 0;
  }
  :deep(.wd-input__prefix .wd-icon) {
    background: transparent !important;
  }
  :deep(.wd-input__clear) {
    background: transparent !important;
    color: #325947;
  }
  :deep(.wd-input__inner) {
    height: 60rpx;
    line-height: 60rpx;
  }
}

.home__section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  text-align: center;
}

.home__section-title {
  font-size: 32rpx;
  font-weight: 600;
}

.home__traffic {
  align-self: center;
  width: 60%;
  max-width: 420rpx;
  min-width: 200rpx;
}

.home__traffic-content {
  display: flex;
  align-items: center;
  gap: 20rpx;
  font-size: 30rpx;
}

.home__filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20rpx;
}

.home__filter {
  font-size: 28rpx;
  min-width: 120rpx;
}

.home__swiper-card {
  position: relative;
  width: 100%;
  border-radius: 36rpx;
  background: #f8f5ee;
  box-shadow: none;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  overflow: hidden;
  min-height: 340rpx;
}

.home__swiper-card--active {
  transform: scale(1) translateX(0) translateY(0);
  opacity: 1;
}

.home__swiper-card--prev {
  transform: scale(0.9) translateX(-52rpx) translateY(12rpx);
  opacity: 0.6;
}

.home__swiper-card--next {
  transform: scale(0.9) translateX(52rpx) translateY(12rpx);
  opacity: 0.6;
}

.home__swiper-cover {
  width: 100%;
  height: 220rpx;
  object-fit: cover;
}

.home__swiper-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 28rpx 32rpx 40rpx;
}

.home__swiper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.home__swiper-title {
  font-size: 34rpx;
  font-weight: 600;
}

.home__swiper-score {
  padding: 8rpx 20rpx;
  background: rgba(22, 24, 35, 0.08) !important;
  color: #161823 !important;
  font-size: 24rpx;
}

.home__swiper-heart {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #325947;
  background: transparent;
  border: none;
}

.home__swiper-summary {
  font-size: 26rpx;
  color: #2b2b2b;
  text-align: left;
}

.home__swiper-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.home__swiper-tag {
  background: rgba(22, 24, 35, 0.08) !important;
  color: #161823 !important;
  border-radius: 999rpx !important;
  font-size: 22rpx !important;
  padding: 6rpx 16rpx !important;
}

.home__swiper-dots {
  display: flex;
  justify-content: center;
  gap: 16rpx;
  margin: 24rpx 0 12rpx;
}

.home__swiper-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: rgba(22, 24, 35, 0.16);
  transition:
    transform 0.3s ease,
    background 0.3s ease;
}

.home__swiper-dot--active {
  background: #325947;
  transform: scale(1.2);
}

.home__swiper-more {
  margin-top: 32rpx;
  --wot-button-border-width: 0;
  --wot-button-border-radius: 999rpx;
  --wot-button-font-size: 30rpx;
  background: #f8f5ee;
}
</style>
