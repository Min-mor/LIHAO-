<script setup lang="ts">
import type { CommunityPost, CommunityTab } from '@/api/types/community'
import { onShow } from '@dcloudio/uni-app'
import { computed, ref, watch } from 'vue'
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
  // 简易解析：支持 HH:mm 或 YYYY-MM-DD/时间字符串
  if (/^\d{1,2}:\d{2}$/.test(t)) {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }
  const d = new Date(t)
  return Number.isNaN(d.getTime()) ? 0 : d.getTime()
}

const filteredPosts = computed(() => {
  const list = posts.value.filter(item => item.tab === activeTab.value && (activeTab.value !== 'following' || item.isFollowing))
  return list.slice().sort((a, b) => getTimeValue(b.postedAt) - getTimeValue(a.postedAt))
})

const pagePaddingTop = computed(() => `${(safeAreaInsets?.top || 0) + 24}px`)

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

function handleCreatePost() {
  ensureLogin(() => {
    uni.showToast({ title: '暂未开放，敬请期待', icon: 'none' })
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
    if (!guardSelf('like', item.author.name, viewerNickname)) return
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
</script>

<template>
  <view class="community" :style="{ paddingTop: pagePaddingTop }">
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

    <scroll-view class="community__list" scroll-y>
      <view
        v-for="item in filteredPosts"
        :key="item.id"
        class="community__card"
      >
        <view class="community__card-header">
          <view class="community__user">
            <image :src="item.author.avatar" mode="aspectFill" class="community__avatar" />
            <view class="community__user-meta">
              <view class="community__user-name">
                {{ item.author.name }}
                <wd-icon
                  v-if="item.author.verified"
                  name="verified"
                  size="24rpx"
                  class="community__verified"
                />
              </view>
              <text class="community__time">{{ item.postedAt }}</text>
            </view>
          </view>
        </view>

        <text class="community__excerpt">{{ item.title }}</text>

        <view
          v-if="item.media.type === 'gallery' && item.media.gallery?.length"
          class="community__gallery"
        >
          <image
            v-for="(src, index) in item.media.gallery"
            :key="index"
            :src="src"
            mode="aspectFill"
            class="community__gallery-item"
          />
        </view>
        <view v-else class="community__video">
          <image :src="item.media.cover" mode="aspectFill" class="community__video-cover" />
          <view class="community__video-play">
            <wd-icon name="play" size="40rpx" />
          </view>
          <text v-if="item.media.duration" class="community__video-duration">
            {{ item.media.duration }}
          </text>
        </view>

        <view class="community__actions">
          <view class="community__action-item" @click="handleShare(item)">
            <wd-icon name="share" size="32rpx" />
            <text>分享</text>
          </view>
          <view class="community__action-item" @click="handleComment(item)">
            <wd-icon name="chat" size="32rpx" />
            <text>{{ formatStat(item.stats.comments) }}</text>
          </view>
          <view class="community__action-item" :class="{ 'is-liked': item.isLiked }" @click="handleLike(item)">
            <wd-icon :name="item.isLiked ? 'heart-filled' : 'heart'" size="32rpx" />
            <text>{{ formatStat(item.stats.likes) }}</text>
          </view>
        </view>
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24rpx 28rpx 160rpx;
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
}

.community__card {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 32rpx;
  border-radius: 28rpx;
  background: $community-card-bg;
  // box-shadow: $community-card-shadow;
  margin-bottom: 24rpx;
}

.community__card-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.community__user {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.community__avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.community__user-meta {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.community__user-name {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: var(--color-text-primary);
}

.community__verified {
  color: rgba($color-brand-primary, 0.72);
}

.community__time {
  font-size: 24rpx;
  color: rgba($color-base-text, 0.48);
}

.community__excerpt {
  font-size: 28rpx;
  line-height: 1.6;
  color: rgba($color-base-text, 0.82);
}

.community__gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.community__gallery-item {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 18rpx;
  object-fit: cover;
}

.community__video {
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;
}

.community__video-cover {
  width: 100%;
  height: 320rpx;
  object-fit: cover;
}

.community__video-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 108rpx;
  height: 108rpx;
  border-radius: 50%;
  background: $community-video-mask;
  color: #fff;
}

.community__video-duration {
  position: absolute;
  right: 24rpx;
  bottom: 20rpx;
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: $community-video-duration-bg;
  color: #fff;
  font-size: 22rpx;
}

.community__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12rpx;
  border-top: 1rpx solid rgba(22, 24, 35, 0.08);
  color: rgba($color-base-text, 0.5);
}

.community__action-item {
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
}

.community__action-item.is-liked {
  color: rgba($color-brand-primary, 0.85);
}

.community__action-item :deep(.wd-icon) {
  color: inherit;
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
