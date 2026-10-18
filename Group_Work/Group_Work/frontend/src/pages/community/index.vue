<script setup lang="ts">
import type { CommunityPost, CommunityTab } from '@/api/modules/community/types'
import { onShow } from '@dcloudio/uni-app'
import { computed, ref, watch } from 'vue'
import ArticleCard from '@/components/common/ArticleCard.vue'
import LoginPrompt from '@/components/LoginPrompt.vue'
import { useLoginGuard } from '@/hooks/useLoginGuard'
import { communityPostsMock } from '@/mock/community'
import { useUserStore } from '@/store'
import { useLoginPromptStore } from '@/store/uiLoginPrompt'
import { guardSelf } from '@/utils/selfGuard'
import { safeAreaInsets } from '@/utils/systemInfo'

defineOptions({
  name: 'CommunityPage',
})

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '社区',
  },
})

const tabs = [
  { label: '推荐', value: 'recommend' as const },
  { label: '关注', value: 'following' as const },
]

function clonePost(item: CommunityPost): CommunityPost {
  return {
    ...item,
    author: { ...item.author },
    media: {
      ...item.media,
      gallery: item.media.gallery ? [...item.media.gallery] : undefined,
    },
    stats: { ...item.stats },
  }
}

const basePosts = communityPostsMock.map(clonePost)
const posts = ref<CommunityPost[]>([])
const activeTab = ref<CommunityTab>('recommend')

function getTimeValue(t: string) {
  // 简易解析：支持 HH:mm 或完整日期时间字符串
  // 1) 仅时间：HH:mm，用于同一天内的排序
  if (/^\d{1,2}:\d{2}$/.test(t)) {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  let d: Date

  // 2) 兼容 iOS：将 'YYYY-MM-DD HH:mm' / 'YYYY-MM-DD HH:mm:ss' 转为 'YYYY-MM-DDTHH:mm:ss'
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(?::\d{2})?$/.test(t)) {
    const normalized = t.replace(' ', 'T')
    const withSeconds = /:\d{2}$/.test(normalized) ? normalized : `${normalized}:00`
    d = new Date(withSeconds)
  }
  else {
    // 其它格式交给内置解析（如 ISO 字符串等）
    d = new Date(t)
  }

  return Number.isNaN(d.getTime()) ? 0 : d.getTime()
}

const filteredPosts = computed(() => {
  const list = posts.value.filter(item => item.tab === activeTab.value && (activeTab.value !== 'following' || item.isFollowing))
  return list.slice().sort((a, b) => getTimeValue(b.postedAt) - getTimeValue(a.postedAt))
})

const pagePaddingTop = computed(() => `${(safeAreaInsets?.top || 0) + 12}px`)
const pagePaddingBottom = computed(() => `calc(200rpx + ${(safeAreaInsets?.bottom || 0) * 2}px)`)

const { isLoggedIn, ensureLogin } = useLoginGuard()
const loginPrompt = useLoginPromptStore()
const viewerNickname = useUserStore().userInfo.nickname

function rebuildPosts(loggedIn: boolean) {
  posts.value = basePosts.map((item) => {
    const clone = clonePost(item)
    clone.isLiked = loggedIn ? item.isLiked : false
    return clone
  })
}

watch(isLoggedIn, (loggedIn) => {
  rebuildPosts(loggedIn)
}, { immediate: true })

onShow(() => {
  loginPrompt.close()
})

// 跳转到发帖页
function handleCreatePost() {
  ensureLogin(() => {
    uni.navigateTo({ url: '/pages/community/publish' })
  })
}

function handleShare(item: CommunityPost) {
  uni.showToast({ title: `已复制《${item.author.name}》的分享链接`, icon: 'none' })
}

function handleComment(item: CommunityPost) {
  const query = `id=${item.id}&likes=${item.stats.likes}&comments=${item.stats.comments}&collects=0`
  uni.navigateTo({ url: `/pages/community-detail/index?${query}` })
}

function handleLike(item: CommunityPost) {
  ensureLogin(() => {
    if (!guardSelf('like', item.author.name, viewerNickname))
      return
    item.isLiked = !item.isLiked
    if (item.isLiked)
      item.stats.likes += 1
    else if (item.stats.likes > 0)
      item.stats.likes -= 1

    const base = basePosts.find(post => post.id === item.id)
    if (base) {
      base.isLiked = item.isLiked
      base.stats.likes = item.stats.likes
    }
  })
}

function formatStat(value: number) {
  if (value < 1000)
    return value
  return `${(value / 1000).toFixed(1)}k`
}

function handleCardClick(id: string) {
  const item = posts.value.find(post => post.id === id)
  if (!item)
    return
  const query = `id=${item.id}&likes=${item.stats.likes}&comments=${item.stats.comments}&collects=0`
  uni.navigateTo({ url: `/pages/community-detail/index?${query}` })
}

function handleCardLike(id: string, shouldLike: boolean) {
  ensureLogin(() => {
    const item = posts.value.find(post => post.id === id)
    if (!item)
      return

    if (!guardSelf('like', item.author.name, viewerNickname))
      return

    item.isLiked = shouldLike
    if (shouldLike)
      item.stats.likes += 1
    else if (item.stats.likes > 0)
      item.stats.likes -= 1

    const base = basePosts.find(post => post.id === item.id)
    if (base) {
      base.isLiked = item.isLiked
      base.stats.likes = item.stats.likes
    }
  })
}

// 下拉刷新
const isRefreshing = ref(false)
function handleRefresh() {
  isRefreshing.value = true
  // 模拟刷新延迟
  setTimeout(() => {
    rebuildPosts(isLoggedIn.value)
    isRefreshing.value = false
    uni.showToast({ title: '已刷新', icon: 'none' })
  }, 1000)
}
</script>

<template>
  <view class="community" :style="{ paddingTop: pagePaddingTop, paddingBottom: pagePaddingBottom }">
    <view class="community__top">
      <view class="community__tabs">
        <view
          v-for="tab in tabs"
          :key="tab.value"
          class="community__tab"
          :class="{ 'is-active': tab.value === activeTab }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </view>
      </view>
      <wd-icon name="search" size="36rpx" class="community__icon" />
    </view>

    <scroll-view
      class="community__list"
      scroll-y
      refresher-enabled
      :refresher-triggered="isRefreshing"
      @refresherrefresh="handleRefresh"
    >
      <view class="community__grid">
        <ArticleCard
          v-for="item in filteredPosts"
          :id="item.id"
          :key="item.id"
          :cover="item.media.cover"
          :title="item.title"
          :author-name="item.author.name"
          :author-avatar="item.author.avatar"
          :likes="item.stats.likes"
          :is-liked="item.isLiked"
          :verified="item.author.verified"
          @click="handleCardClick"
          @like="handleCardLike"
        />
      </view>
    </scroll-view>

    <view class="community__fab" @click="handleCreatePost">
      <wd-icon name="add" size="40rpx" />
    </view>
  </view>
  <LoginPrompt />
</template>

<style scoped lang="scss">
@use '@/style/index.scss' as *;

$community-bg: $color-base-bg;
$community-card-bg: mix($color-base-highlight, #ffffff, 88%);
$community-tab-active-shadow: 0 8rpx 16rpx rgba($color-brand-primary, 0.12);
$community-card-shadow: 0 16rpx 32rpx rgba($color-base-text, 0.08);
$community-video-mask: rgba($color-base-text, 0.42);
$community-video-duration-bg: rgba($color-base-text, 0.55);
$community-fab-shadow: 0 16rpx 32rpx rgba($color-brand-primary, 0.18);

.community {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 24rpx 28rpx;
  background: $community-bg;
}

.community__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.community__tabs {
  display: inline-flex;
  padding: 6rpx;
  border-radius: 999rpx;
  gap: 6rpx;
}

.community__tab {
  min-width: 128rpx;
  padding: 14rpx 28rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
  text-align: center;
  color: rgba($color-base-text, 0.68);
  transition: all 0.24s ease;
  background: transparent;
  position: relative;
}

.community__tab.is-active {
  color: $color-brand-primary;
  font-weight: 600;
}

.community__tab::after {
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

.community__tab.is-active::after {
  width: 60%;
  background: $color-brand-primary;
}

.community__icon {
  color: rgba($color-base-text, 0.5);
}

.community__list {
  flex: 1;
  padding: 0;
}

// 流式网格布局
.community__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 0 0 32rpx;
}

.community__fab {
  position: fixed;
  right: 48rpx;
  bottom: 220rpx;
  width: 108rpx;
  height: 108rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba($color-brand-primary, 0.92) 0%, rgba($color-brand-primary, 0.78) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  // box-shadow: $community-fab-shadow;
}
</style>
