<script lang="ts" setup>
import type { IUploadSuccessInfo } from '@/api/modules/auth/types'
import type {
  FootprintItem,
  OrderItem,
  OrderStatus,
  ProfileFavorites,
  ProfileMockData,
  ProfileTabKey,
  TopicItem,
} from '@/mock/profile'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import ArticleCard from '@/components/common/ArticleCard.vue'
import { getProfileMockData, profileMockData } from '@/mock/profile'
import { LOGIN_PAGE } from '@/router/config'
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'
import { HOME_PAGE } from '@/utils'
import { safeAreaInsets } from '@/utils/systemInfo'
import { useUpload } from '@/utils/uploadFile'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '我的',
  },
})

const userStore = useUserStore()
const tokenStore = useTokenStore()
const { userInfo } = storeToRefs(userStore)

const pagePaddingTop = computed(() => `${(safeAreaInsets?.top || 0) + 24}px`)
const pagePaddingBottom = computed(() => `calc(200rpx + ${(safeAreaInsets?.bottom || 0) * 2}px)`)
const hasLogin = computed(() => tokenStore.hasLogin)
const signatureText = computed(() => {
  const info = userInfo.value as { signature?: string } | undefined
  return info?.signature || '该用户太谦虚了还没有写东西'
})

const profileTabs = [
  { label: '足迹', value: 'footprint' as ProfileTabKey },
  { label: '话题', value: 'topics' as ProfileTabKey },
  { label: '订单', value: 'orders' as ProfileTabKey },
  { label: '收藏', value: 'favorites' as ProfileTabKey },
]

const activeTab = ref<ProfileTabKey>('footprint')
const currentTabIndex = ref(0)
const activeTabAnchor = computed(() => `profile-tab-${activeTab.value}`)

const stats = ref(profileMockData.stats)
const footprintList = ref<FootprintItem[]>([])
const topicList = ref<TopicItem[]>([])
const orderList = ref<OrderItem[]>([])
const favoriteList = ref<ProfileFavorites>({ sights: [], footprints: [] })
const favoriteTabs = [
  { label: '景点', value: 'sights' as const },
  { label: '文章', value: 'footprints' as const },
]
const favoriteCategory = ref<typeof favoriteTabs[number]['value']>('sights')
const favoriteCounts = computed<Record<typeof favoriteTabs[number]['value'], number>>(() => ({
  sights: favoriteList.value.sights.length,
  footprints: favoriteList.value.footprints.length,
}))

interface FavoriteCard {
  id: string
  cover: string
  title: string
  desc: string
  likedAt: string
  location?: string
}

const footprintTimeline = computed(() => footprintList.value)
const topicFeed = computed(() => topicList.value)
const orderTimeline = computed(() => orderList.value)

// 足迹数据适配器 - 转换为 ArticleCard 格式
const footprintCards = computed(() => {
  return footprintList.value.map(item => ({
    id: item.id,
    cover: item.media[0] || '/static/images/placeholder.png',
    title: item.title,
    authorName: userInfo.value.nickname || '旅行者',
    authorAvatar: userInfo.value.avatar || '/static/images/default-avatar.png',
    likes: item.likes || 0,
    isLiked: false,
    location: item.destination,
  }))
})

// 话题数据适配器 - 转换为 ArticleCard 格式
const topicCards = computed(() => {
  return topicList.value.map(item => ({
    id: item.id,
    cover: item.attachments[0] || '/static/images/placeholder.png',
    title: item.title,
    authorName: userInfo.value.nickname || '旅行者',
    authorAvatar: userInfo.value.avatar || '/static/images/default-avatar.png',
    likes: item.likes,
    isLiked: false,
    location: item.location,
  }))
})
const favoriteCards = computed<FavoriteCard[]>(() => {
  if (favoriteCategory.value === 'sights') {
    return favoriteList.value.sights.map(item => ({
      id: item.id,
      cover: item.cover,
      title: item.title,
      desc: item.summary,
      likedAt: item.likedAt,
      location: item.location,
    }))
  }

  return favoriteList.value.footprints.map(item => ({
    id: item.id,
    cover: item.cover,
    title: item.title,
    desc: item.article,
    likedAt: item.likedAt,
  }))
})

const orderStatusVariantMap: Record<OrderStatus, 'success' | 'processing' | 'pending' | 'refund' | 'danger'> = {
  已完成: 'success',
  进行中: 'processing',
  待付款: 'pending',
  已退款: 'refund',
  退款中: 'danger',
}

const TOPIC_PUBLISH_PAGE = '/pages/community/publish'
const PROFILE_PAGE_PATH = '/pages/profile/index'

function formatDateLabel(date: string) {
  return date.replace(/-/g, '.')
}

function applyProfileData(data: ProfileMockData) {
  stats.value = data.stats
  footprintList.value = data.footprint
  topicList.value = data.topics
  orderList.value = data.orders
  favoriteList.value = {
    sights: data.favorites.sights,
    footprints: data.favorites.footprints,
  }
}

function refreshProfileData() {
  const data = getProfileMockData()
  applyProfileData(data)
}
let hasRedirected = false

function redirectToLogin() {
  if (hasRedirected)
    return
  hasRedirected = true
  uni.navigateTo({
    url: `${LOGIN_PAGE}?redirect=${encodeURIComponent(PROFILE_PAGE_PATH)}`,
    complete: () => {
      setTimeout(() => {
        hasRedirected = false
      }, 400)
    },
  })
}

function redirectToHome() {
  if (hasRedirected)
    return
  hasRedirected = true
  const complete = () => {
    setTimeout(() => {
      hasRedirected = false
    }, 400)
  }
  uni.switchTab({ url: HOME_PAGE, fail: () => uni.reLaunch({ url: HOME_PAGE, complete }), complete })
}

function ensureLoggedIn({ redirectToLogin: needLogin, redirectToHome: needHome }: { redirectToLogin?: boolean, redirectToHome?: boolean } = {}) {
  if (hasLogin.value)
    return true

  stats.value = profileMockData.stats
  footprintList.value = []
  topicList.value = []
  orderList.value = []
  favoriteList.value = { sights: [], footprints: [] }

  if (needLogin)
    redirectToLogin()
  else if (needHome)
    redirectToHome()

  return false
}

onLoad(() => {
  if (!ensureLoggedIn({ redirectToLogin: true }))
    return
  refreshProfileData()
})

onShow(() => {
  if (!ensureLoggedIn({ redirectToHome: true }))
    return
  refreshProfileData()
})

// #ifndef MP-WEIXIN
const { run: uploadAvatar } = useUpload<IUploadSuccessInfo>(
  '/upload',
  {},
  {
    onSuccess: (res) => {
      useUserStore().setUserAvatar(res.url)
      uni.showToast({ title: '头像已更新', icon: 'success' })
    },
  },
)
// #endif

async function handleLogin() {
  // #ifdef MP-WEIXIN
  await tokenStore.wxLogin()
  // #endif
  // #ifndef MP-WEIXIN
  uni.navigateTo({
    url: `${LOGIN_PAGE}?redirect=${encodeURIComponent(PROFILE_PAGE_PATH)}`,
  })
  // #endif
}

// #ifdef MP-WEIXIN
function onChooseAvatar(e: any) {
  const { avatarUrl } = e.detail
  const { run } = useUpload<IUploadSuccessInfo>(
    '/upload',
    {},
    {
      onSuccess: (res) => {
        useUserStore().setUserAvatar(res.url)
        uni.showToast({ title: '头像已更新', icon: 'success' })
      },
    },
    avatarUrl,
  )
  run()
}

function getUserInfo(e: any) {
  console.log(e.detail)
}
// #endif

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        useTokenStore().logout()
        uni.showToast({ title: '已退出登录', icon: 'success' })
      }
    },
  })
}

function handleTabChange(tab: ProfileTabKey) {
  if (activeTab.value === tab)
    return
  activeTab.value = tab
  const targetIndex = profileTabs.findIndex(item => item.value === tab)
  if (targetIndex !== -1)
    currentTabIndex.value = targetIndex
}

function navigateToProfileEdit() {
  uni.navigateTo({ url: '/pages/profile-edit/index' })
}

function handleSignatureClick() {
  navigateToProfileEdit()
}

function handleOpenSettings() {
  uni.navigateTo({ url: '/pages/settings/index' })
}

function handleSwiperChange(event: { detail?: { current: number } }) {
  const index = event?.detail?.current ?? 0
  if (index === currentTabIndex.value)
    return
  currentTabIndex.value = index
  const target = profileTabs[index]
  if (target && target.value !== activeTab.value)
    activeTab.value = target.value
}

function handleFavoriteSwitch(category: typeof favoriteTabs[number]['value']) {
  if (favoriteCategory.value === category)
    return
  favoriteCategory.value = category
}

function handleOpenFootprint(item: FootprintItem) {
  uni.navigateTo({ url: `/pages/community-detail/index?id=${item.id}` })
}

function handleOpenTopic(item: TopicItem) {
  uni.navigateTo({ url: `/pages/community-detail/index?id=${item.id}` })
}

function handleCreateTopic() {
  if (!hasLogin.value) {
    handleLogin()
    return
  }
  uni.navigateTo({ url: TOPIC_PUBLISH_PAGE })
}

function handleViewOrder(order: OrderItem) {
  uni.navigateTo({ url: `/pages/order/detail?id=${order.id}` })
}

function handleFavoriteDetail(item: FavoriteCard) {
  if (favoriteCategory.value === 'footprints') {
    const sourceId = item.id.replace(/^fav-/, '')
    uni.navigateTo({ url: `/pages/community-detail/index?id=${sourceId}` })
  }
  else {
    uni.navigateTo({ url: '/pages/product/index' })
  }
}

// ArticleCard 点击事件处理
function handleFootprintCardClick(id: string) {
  uni.navigateTo({ url: `/pages/community-detail/index?id=${id}` })
}

function handleTopicCardClick(id: string) {
  uni.navigateTo({ url: `/pages/community-detail/index?id=${id}` })
}

// ArticleCard 点赞事件处理
function handleFootprintCardLike(id: string, shouldLike: boolean) {
  // 足迹是自己的，不能给自己点赞
  uni.showToast({ title: '不能给自己点赞哦', icon: 'none' })
}

function handleTopicCardLike(id: string, shouldLike: boolean) {
  // 话题是自己的，不能给自己点赞
  uni.showToast({ title: '不能给自己点赞哦', icon: 'none' })
}
</script>

<template>
  <view class="profile" :style="{ paddingTop: pagePaddingTop, paddingBottom: pagePaddingBottom }">
    <view class="profile__hero">
      <view class="profile__settings" @click="handleOpenSettings">
        <wd-icon name="setting" size="44rpx" />
      </view>
      <view class="profile__avatar">
        <!-- #ifdef MP-WEIXIN -->
        <button class="profile__avatar-button" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image :src="userInfo.avatar" mode="aspectFill" class="profile__avatar-image" />
        </button>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <view class="profile__avatar-wrapper" @click="uploadAvatar">
          <image :src="userInfo.avatar" mode="aspectFill" class="profile__avatar-image" />
        </view>
        <!-- #endif -->
      </view>

      <!-- #ifdef MP-WEIXIN -->
      <input
        v-model="userInfo.nickname"
        type="nickname"
        class="profile__input-nickname"
        placeholder="点击编辑昵称"
      >
      <!-- #endif -->
      <!-- #ifndef MP-WEIXIN -->
      <view class="profile__name">
        {{ userInfo.nickname || '旅人' }}
      </view>
      <!-- #endif -->
      <view class="profile__signature" @click="handleSignatureClick">
        <view class="profile__signature-edit" @click.stop="handleSignatureClick">
          <wd-icon name="edit-outline" size="32rpx" />
        </view>
        <text class="profile__signature-text">{{ signatureText }}</text>
      </view>

      <view class="profile__meta">
        <view
          v-for="stat in stats"
          :key="stat.id"
          class="profile__meta-item"
        >
          <text class="profile__meta-value">{{ stat.value }}</text>
          <text class="profile__meta-label">{{ stat.label }}</text>
        </view>
      </view>
    </view>

    <scroll-view
      class="profile__tabs"
      scroll-x
      enable-flex
      :scroll-into-view="activeTabAnchor"
      scroll-with-animation
      :show-scrollbar="false"
    >
      <view class="profile__tabs-inner">
        <view
          v-for="tab in profileTabs"
          :id="`profile-tab-${tab.value}`"
          :key="tab.value"
          class="profile__tab"
          :class="{ 'is-active': tab.value === activeTab }"
          @click="handleTabChange(tab.value)"
        >
          {{ tab.label }}
        </view>
      </view>
    </scroll-view>

    <swiper
      class="profile__swiper"
      :current="currentTabIndex"
      @change="handleSwiperChange"
    >
      <swiper-item
        v-for="tab in profileTabs"
        :key="tab.value"
        class="profile__swiper-item"
      >
        <view class="profile__panel">
          <view class="profile__panel-inner">
            <template v-if="tab.value === 'footprint'">
              <view v-if="footprintCards.length" class="profile__card-grid">
                <ArticleCard
                  v-for="card in footprintCards"
                  :id="card.id"
                  :key="card.id"
                  :cover="card.cover"
                  :title="card.title"
                  :author-name="card.authorName"
                  :author-avatar="card.authorAvatar"
                  :likes="card.likes"
                  :is-liked="card.isLiked"
                  @click="handleFootprintCardClick"
                  @like="handleFootprintCardLike"
                />
              </view>
              <view v-else class="profile__empty">
                <wd-icon name="location" size="48rpx" />
                <text>暂无足迹，去完成订单留下回忆吧</text>
              </view>
            </template>

            <template v-else-if="tab.value === 'topics'">
              <view class="profile__topic-compose" @click="handleCreateTopic">
                <text class="profile__topic-plus">＋</text>
                <text class="profile__topic-placeholder">此刻想说点什么？</text>
              </view>
              <view v-if="topicCards.length" class="profile__card-grid">
                <ArticleCard
                  v-for="card in topicCards"
                  :id="card.id"
                  :key="card.id"
                  :cover="card.cover"
                  :title="card.title"
                  :author-name="card.authorName"
                  :author-avatar="card.authorAvatar"
                  :likes="card.likes"
                  :is-liked="card.isLiked"
                  @click="handleTopicCardClick"
                  @like="handleTopicCardLike"
                />
              </view>
              <view v-else class="profile__empty">
                <wd-icon name="chat1" size="48rpx" />
                <text>还没有话题，去分享你的旅行灵感吧</text>
              </view>
            </template>

            <template v-else-if="tab.value === 'orders'">
              <view v-if="orderTimeline.length" class="profile__order-list">
                <view
                  v-for="order in orderTimeline"
                  :key="order.id"
                  class="profile__order-item"
                  @click="handleViewOrder(order)"
                >
                  <view class="profile__order-header">
                    <wd-icon name="calendar" size="36rpx" />
                    <view class="profile__order-meta">
                      <text class="profile__order-title">{{ order.title }}</text>
                      <text class="profile__order-date">{{ formatDateLabel(order.date) }}</text>
                    </view>
                  </view>
                  <view class="profile__order-subtitle">
                    {{ order.subtitle }}
                  </view>
                  <view class="profile__order-tags">
                    <text class="profile__order-tag">{{ order.orderType }}</text>
                    <text class="profile__order-tag" :class="`is-status--${orderStatusVariantMap[order.status]}`">{{ order.status }}</text>
                  </view>
                  <view class="profile__order-footer">
                    <text class="profile__order-amount">{{ order.amount }}</text>
                    <text v-if="order.hasComment" class="profile__order-comment">已生成足迹</text>
                  </view>
                </view>
              </view>
              <view v-else class="profile__empty">
                <wd-icon name="calendar" size="48rpx" />
                <text>暂无订单，去探索新的行程吧</text>
              </view>
            </template>

            <template v-else>
              <view class="profile__favorite-tabs">
                <view
                  v-for="tabItem in favoriteTabs"
                  :key="tabItem.value"
                  class="profile__favorite-tab"
                  :class="{ 'is-active': favoriteCategory === tabItem.value }"
                  @click="handleFavoriteSwitch(tabItem.value)"
                >
                  <text class="profile__favorite-tab-label">{{ tabItem.label }}</text>
                  <text class="profile__favorite-tab-count">{{ favoriteCounts[tabItem.value] }}</text>
                </view>
              </view>
              <view v-if="favoriteCards.length" class="profile__favorite-grid">
                <view
                  v-for="card in favoriteCards"
                  :key="card.id"
                  class="profile__favorite-card"
                  @click="handleFavoriteDetail(card)"
                >
                  <image :src="card.cover" mode="aspectFill" class="profile__favorite-cover" />
                  <view class="profile__favorite-body">
                    <view class="profile__favorite-title">
                      {{ card.title }}
                    </view>
                  </view>
                </view>
              </view>
              <view v-else class="profile__empty">
                <wd-icon name="star" size="48rpx" />
                <text>暂无收藏，去标记你喜欢的足迹吧</text>
              </view>
            </template>
          </view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss" scoped>
@use '@/style/index.scss' as *;

$profile-base-bg: #fcfbfa;
$profile-lotus: #fbede0;
$profile-ink: #161823;
$profile-muted: rgba($color-base-text, 0.58);
$profile-card-bg: mix($profile-lotus, #ffffff, 78%);
$profile-panel-bg: $profile-card-bg;
$profile-hero-shadow: 0 28rpx 56rpx rgba($color-base-text, 0.14);
$profile-card-shadow: none;
$profile-avatar-border: rgba($color-brand-primary, 0.16);
$profile-avatar-shadow: 0 16rpx 40rpx rgba($color-base-text, 0.12);
$profile-stat-color: rgba($color-brand-primary, 0.88);
$profile-tab-shadow: 0 12rpx 24rpx rgba($color-brand-primary, 0.18);
$profile-tag-bg: rgba($color-brand-primary, 0.12);
$profile-tag-color: rgba($color-brand-primary, 0.82);

.profile {
  padding: 24rpx 28rpx;
  background: $profile-base-bg;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  box-sizing: border-box;
}

.profile__hero {
  position: relative;
  border-radius: 44rpx;
  padding: 48rpx 32rpx 24rpx;
  background: $profile-lotus;
  box-shadow: $profile-hero-shadow;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.profile__settings {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  color: rgba($color-base-text, 0.55);
}

.profile__avatar {
  position: relative;
}

.profile__avatar-wrapper,
.profile__avatar-button {
  width: 168rpx;
  height: 168rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 6rpx solid $profile-avatar-border;
  box-shadow: $profile-avatar-shadow;
  padding: 0;
  background: transparent;
}

.profile__avatar-button::after {
  border: none;
}

.profile__avatar-image {
  width: 100%;
  height: 100%;
}

.profile__input-nickname {
  font-size: 38rpx;
  text-align: center;
  color: var(--color-text-primary);
  font-weight: 600;
}

.profile__name {
  font-size: 40rpx;
  font-weight: 650;
  color: $profile-ink;
}

.profile__signature {
  display: inline-flex;
  align-items: center;
  gap: 16rpx;
  padding: 12rpx 0;
  border-radius: 999rpx;
  background: transparent;
  box-shadow: none;
  color: $profile-muted;
  max-width: 560rpx;
}

.profile__signature-text {
  font-size: 26rpx;
  line-height: 1.4;
  color: $profile-ink;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile__signature-edit {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: transparent;
  color: $color-brand-primary;
}

.profile__meta {
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 12rpx 0;
}

.profile__meta-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}

.profile__meta-value {
  font-size: 38rpx;
  font-weight: 650;
  color: $profile-stat-color;
}

.profile__meta-label {
  font-size: 24rpx;
  color: rgba($color-base-text, 0.48);
}

.profile__tabs {
  max-width: 100%;
  padding: 6rpx 24rpx;
  background: transparent;
  align-self: center;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  flex: 0;
}

.profile__tabs::-webkit-scrollbar {
  display: none;
}

.profile__tabs-inner {
  display: inline-flex;
  gap: 12rpx;
  padding: 0;
}

.profile__tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 168rpx;
  padding: 18rpx 36rpx;
  text-align: center;
  border-radius: 999rpx;
  font-size: 28rpx;
  color: rgba($color-base-text, 0.52);
  transition:
    background 0.24s ease,
    color 0.24s ease;
}

.profile__tab.is-active {
  color: #fff;
  background: $color-brand-primary;
}

.profile__swiper {
  width: 100%;
  flex: none !important;
  min-height: 800rpx;

  :deep(swiper),
  :deep(.uni-swiper) {
    flex: none !important;
    min-height: 800rpx;
  }

  :deep(.uni-swiper-wrapper) {
    min-height: 800rpx;
  }

  :deep(.uni-swiper-slide) {
    min-height: 800rpx;
    padding-bottom: 80rpx;
  }
}

.profile__panel {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  box-sizing: border-box;
}

.profile__panel-inner {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.profile__empty {
  padding: 80rpx 24rpx;
  margin: 0 24rpx;
  text-align: center;
  color: rgba($color-base-text, 0.45);
  display: grid;
  place-items: center;
  gap: 18rpx;
  background: $profile-panel-bg;
  border-radius: 32rpx;
  box-shadow: inset 0 0 0 2rpx rgba($color-brand-primary, 0.04);
  line-height: 1.4;
}

.profile__timeline {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

.profile__timeline-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 28rpx 32rpx;
  border-radius: 36rpx;
  background: $profile-panel-bg;
  box-shadow: $profile-card-shadow;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.profile__timeline-item:hover {
  transform: translateY(-4rpx);
  box-shadow: none;
}

.profile__timeline-meta {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  font-size: 26rpx;
  color: $color-brand-primary;
}

.profile__timeline-date {
  font-weight: 600;
  color: $profile-ink;
}

.profile__timeline-content {
  font-size: 26rpx;
  line-height: 1.5;
  color: $profile-ink;
}

.profile__timeline-icon {
  z-index: 1;
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba($color-brand-primary, 0.12);
  display: grid;
  place-items: center;
  color: $color-brand-primary;
}

.profile__timeline-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.profile__timeline-title {
  font-size: 32rpx;
  font-weight: 600;
  color: $profile-ink;
}

.profile__timeline-description {
  font-size: 26rpx;
  line-height: 1.5;
  color: $profile-muted;
  white-space: pre-wrap;
  word-break: break-word;
}

.profile__timeline-image {
  width: 100%;
  height: 240rpx;
  border-radius: 28rpx;
  object-fit: cover;
}

.profile__timeline-location {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  font-size: 24rpx;
  color: rgba($color-base-text, 0.65);
}

.profile__timeline-location-text {
  color: rgba($color-base-text, 0.65);
}

.profile__topic-compose {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 32rpx;
  margin: 0 24rpx;
  border-radius: 36rpx;
  background: rgba($color-brand-primary, 0.06);
  font-size: 28rpx;
  color: rgba($color-base-text, 0.5);
  cursor: pointer;
  backdrop-filter: blur(8rpx);
  line-height: 1;
}

.profile__topic-plus {
  font-size: 40rpx;
  color: $color-brand-primary;
}

.profile__topic-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.profile__topic-item {
  padding: 28rpx 32rpx;
  border-radius: 36rpx;
  background: $profile-panel-bg;
  box-shadow: $profile-card-shadow;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
  overflow: hidden;
}

.profile__topic-item:hover {
  transform: translateY(-4rpx);
  box-shadow: none;
}

.profile__topic-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  color: $color-brand-primary;
  font-size: 24rpx;
}

.profile__topic-date {
  color: rgba($color-base-text, 0.5);
}

.profile__topic-content {
  font-size: 28rpx;
  line-height: 1.6;
  color: $profile-ink;
  white-space: pre-wrap;
  word-break: break-word;
}

.profile__topic-image {
  width: 100%;
  height: 240rpx;
  border-radius: 28rpx;
  object-fit: cover;
}

.profile__topic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  color: rgba($color-base-text, 0.5);
}

.profile__topic-location {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  color: $color-brand-primary;
}

.profile__topic-location-text {
  color: rgba($color-base-text, 0.65);
}

.profile__topic-stats {
  font-variant-numeric: tabular-nums;
}

.profile__order-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 0 24rpx;
  min-height: 0;
  height: fit-content;
}

.profile__order-item {
  padding: 28rpx 32rpx;
  border-radius: 36rpx;
  background: $profile-panel-bg;
  box-shadow: $profile-card-shadow;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.profile__order-item:hover {
  transform: translateY(-4rpx);
  box-shadow: none;
}

.profile__order-header {
  display: flex;
  gap: 20rpx;
  align-items: center;
}

.profile__order-meta {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.profile__order-title {
  font-size: 30rpx;
  font-weight: 600;
  color: $profile-ink;
}

.profile__order-date {
  font-size: 24rpx;
  color: rgba($color-base-text, 0.5);
}

.profile__order-subtitle {
  font-size: 26rpx;
  color: $profile-muted;
  line-height: 1.5;
}

.profile__order-tags {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.profile__order-tag {
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: $profile-tag-bg;
  color: $profile-tag-color;
  font-size: 24rpx;
}

.profile__order-tag.is-status--success {
  background: rgba(#35c16a, 0.12);
  color: #35c16a;
}

.profile__order-tag.is-status--processing {
  background: rgba(#3b82f6, 0.12);
  color: #3b82f6;
}

.profile__order-tag.is-status--pending {
  background: rgba(#f59e0b, 0.15);
  color: #b45309;
}

.profile__order-tag.is-status--refund {
  background: rgba(#10b981, 0.12);
  color: #047857;
}

.profile__order-tag.is-status--danger {
  background: rgba(#ef4444, 0.12);
  color: #b91c1c;
}

.profile__order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
}

.profile__order-amount {
  font-size: 30rpx;
  font-weight: 600;
  color: $profile-ink;
}

.profile__order-comment {
  color: $color-brand-primary;
}

.profile__favorite-tabs {
  display: inline-flex;
  gap: 24rpx;
  align-self: flex-start;
}

.profile__favorite-tab {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  color: rgba($color-base-text, 0.55);
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease;
}

.profile__favorite-tab.is-active {
  background: rgba($color-brand-primary, 0.08);
  color: rgba($color-base-text, 0.82);
}

.profile__favorite-tab-label {
  font-weight: 500;
}

.profile__favorite-tab-count {
  font-size: 22rpx;
  color: rgba($color-base-text, 0.4);
  min-width: 32rpx;
  text-align: center;
}

// ArticleCard 网格布局（足迹、话题）
.profile__card-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 0 24rpx 40rpx;
  box-sizing: border-box;

  // 确保高度完全由内容决定
  min-height: 0;
  height: fit-content;
}

.profile__favorite-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24rpx;
  padding: 0 24rpx;
  min-height: 0;
  height: fit-content;
}

.profile__favorite-card {
  background: $profile-panel-bg;
  border-radius: 32rpx;
  box-shadow: $profile-card-shadow;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.profile__favorite-card:hover {
  transform: translateY(-4rpx);
  box-shadow: none;
}

.profile__favorite-cover {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
}

.profile__favorite-body {
  padding: 18rpx 20rpx 22rpx;
}

.profile__favorite-title {
  font-size: 24rpx;
  font-weight: 500;
  color: $profile-ink;
  line-height: 1.4;
}
</style>
