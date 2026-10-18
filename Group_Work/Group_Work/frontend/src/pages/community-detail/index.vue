<script setup lang="ts">
import type { CommunityAuthor, CommunityComment, CommunityDetail } from '@/api/modules/community/types'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import LoginPrompt from '@/components/LoginPrompt.vue'
import { useLoginGuard } from '@/hooks/useLoginGuard'
import { getCommunityDetail, listCommunityComments } from '@/service/community'
import { useUserStore } from '@/store'
import { useLoginPromptStore } from '@/store/uiLoginPrompt'
import { guardSelf } from '@/utils/selfGuard'
import { safeAreaInsets } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
  },
})

const safeTop = safeAreaInsets?.top ?? 0
const safeBottom = safeAreaInsets?.bottom ?? 0

const headerPaddingTop = computed(() => `${safeTop + 12}px`)
const contentPaddingBottom = computed(() => `${safeBottom + 120}px`)

function cloneDetail(source: CommunityDetail): CommunityDetail {
  return {
    ...source,
    media: [...source.media],
    stats: { ...source.stats },
    author: {
      ...source.author,
      tags: source.author.tags ? [...source.author.tags] : undefined,
    },
  }
}

function cloneComments(source: CommunityComment[]): CommunityComment[] {
  const list = source.map(item => ({
    ...item,
    author: {
      ...item.author,
      tags: item.author.tags ? [...item.author.tags] : undefined,
    },
    replies: item.replies ? cloneComments(item.replies) : undefined,
  }))

  sortCommentList(list)
  return list
}

interface ReplyContext {
  host: CommunityComment
  target?: CommunityComment
}

const { isLoggedIn, ensureLogin } = useLoginGuard()
const loginPrompt = useLoginPromptStore()
const viewerNickname = useUserStore().userInfo.nickname

onShow(() => {
  // 防止从其它页面遗留的登录弹窗在进入详情页时自动显示
  loginPrompt.close()
})

function createDetail(loggedIn: boolean, base: CommunityDetail): CommunityDetail {
  const cloned = cloneDetail(base)
  if (!loggedIn) {
    cloned.isLiked = false
    cloned.isFollowing = false
    cloned.isCollected = false
  }
  return cloned
}

const detail = reactive<CommunityDetail>({
  id: '',
  title: '',
  content: '',
  postedAt: '',
  stats: { share: 0, collects: 0, comments: 0, likes: 0 },
  media: [],
  author: { name: '', avatar: '' },
  isFollowing: false,
  isLiked: false,
  isCollected: false,
})
const comments = ref<CommunityComment[]>([])
const showActionSheet = ref(false)
const activeCommentId = ref<string | null>(null)
const currentSlide = ref(0)
const expandedReplies = ref<string[]>([])
const commentDraft = ref('')
const isSubmittingComment = ref(false)
const canSubmitComment = computed(() => commentDraft.value.trim().length > 0 && !isSubmittingComment.value)
const replyContext = ref<ReplyContext | null>(null)
const isReplying = computed(() => Boolean(replyContext.value))
const commentPlaceholder = computed(() => {
  if (!replyContext.value)
    return '说点什么吧…'

  const target = replyContext.value.target ?? replyContext.value.host
  return `回复 ${target.author.name}`
})
const commentFieldFocus = ref(false)

const viewerProfile: CommunityAuthor = {
  name: '我',
  avatar: '',
}

// 相对时间格式化
function formatRelativeTime(dateStr: string): string {
  // 解析时间字符串 (支持 'YYYY-MM-DD HH:mm' 格式)
  const targetTime = new Date(dateStr.replace(' ', 'T'))
  const now = new Date()

  const diffMs = now.getTime() - targetTime.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) {
    return `${diffSeconds}秒前`
  }
  else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`
  }
  else if (diffHours < 24) {
    return `${diffHours}小时前`
  }
  else {
    return `${diffDays}天前`
  }
}

// 底部元信息（小红书样式）
const metaInfo = computed(() => {
  const time = formatRelativeTime(detail.postedAt)
  const parts = [time]

  if (detail.location) {
    parts.push(detail.location)
  }

  return parts.join('  ') // 使用两个空格分隔
})

const followBtnBaseStyle = [
  '--wot-button-padding-x: 34rpx',
  '--wot-button-padding-y: 12rpx',
  '--wot-button-font-size: 26rpx',
  '--wot-button-border-radius: 999rpx',
  '--wot-button-border-width: 0',
].join(';')

function getFollowBtnStyle(target: { isFollowing: boolean }) {
  const palette = target.isFollowing
    ? [
        '--wot-button-primary-bg-color: var(--color-brand-primary)',
        '--wot-button-primary-color: var(--color-text-inverse)',
      ]
    : [
        '--wot-button-primary-bg-color: var(--color-brand-accent)',
        '--wot-button-primary-color: var(--color-text-inverse)',
      ]

  return `${followBtnBaseStyle};${palette.join(';')}`
}

function handleSwiperChange(event: UniHelper.SwiperOnChangeEvent) {
  currentSlide.value = event.detail.current ?? 0
}

function handleBack() {
  uni.navigateBack({
    delta: 1,
    fail() {
      uni.reLaunch({ url: '/pages/community/index' })
    },
  })
}

function handleShare() {
  uni.showShareMenu()
}

onLoad(async (query) => {
  const queryId = (query?.id as string) || ''
  const fetched = await getCommunityDetail(queryId)
  const likes = Number(query?.likes ?? fetched.stats.likes)
  const commentsCount = Number(query?.comments ?? fetched.stats.comments)
  const collects = Number(query?.collects ?? fetched.stats.collects)

  const baseDetail = createDetail(isLoggedIn.value, fetched)

  Object.assign(detail, baseDetail, {
    id: queryId || fetched.id,
    stats: {
      share: baseDetail.stats.share ?? 0,
      likes: Number.isNaN(likes) ? fetched.stats.likes : likes,
      comments: Number.isNaN(commentsCount) ? fetched.stats.comments : commentsCount,
      collects: Number.isNaN(collects) ? fetched.stats.collects : collects,
    },
  })

  viewerProfile.avatar = detail.author.avatar

  const list = await listCommunityComments(detail.id)
  comments.value = cloneComments(list)
  detail.stats.comments = computeCommentCount(comments.value)
  currentSlide.value = 0
})

watch(isLoggedIn, (loggedIn) => {
  if (!loggedIn) {
    detail.isLiked = false
    detail.isFollowing = false
    detail.isCollected = false
  }
})

function sortCommentList(list: CommunityComment[] = []) {
  list.sort(compareComments)
  list.forEach((item) => {
    if (item.replies?.length)
      sortCommentList(item.replies)
  })
}

function compareComments(a: CommunityComment, b: CommunityComment) {
  const likeDiff = (b.likes || 0) - (a.likes || 0)
  if (likeDiff !== 0)
    return likeDiff

  const replyDiff = (b.replies?.length || 0) - (a.replies?.length || 0)
  if (replyDiff !== 0)
    return replyDiff

  const timeDiff = parsePostedAtTimestamp(b.postedAt) - parsePostedAtTimestamp(a.postedAt)
  if (timeDiff !== 0)
    return timeDiff

  return (b.id || '').localeCompare(a.id || '')
}

function parsePostedAtTimestamp(value?: string): number {
  if (!value)
    return 0

  const now = Date.now()

  if (value.includes('刚刚'))
    return now

  const minuteMatch = value.match(/(\d+)\s*分钟前/)
  if (minuteMatch)
    return now - Number(minuteMatch[1]) * 60 * 1000

  const hourMatch = value.match(/(\d+)\s*小时前/)
  if (hourMatch)
    return now - Number(hourMatch[1]) * 3600 * 1000

  const dayMatch = value.match(/(\d+)\s*天前/)
  if (dayMatch)
    return now - Number(dayMatch[1]) * 24 * 3600 * 1000

  const timeMatch = value.match(/^(\d{1,2}):(\d{2})$/)
  if (timeMatch) {
    const date = new Date()
    date.setHours(Number(timeMatch[1]), Number(timeMatch[2]), 0, 0)
    if (date.getTime() > now)
      date.setDate(date.getDate() - 1)
    return date.getTime()
  }

  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

function toggleFollow() {
  ensureLogin(() => {
    if (!guardSelf('follow', detail.author.name, viewerNickname))
      return
    detail.isFollowing = !detail.isFollowing
  })
}

function toggleLike() {
  ensureLogin(() => {
    if (!guardSelf('like', detail.author.name, viewerNickname))
      return
    detail.isLiked = !detail.isLiked
    if (detail.isLiked)
      detail.stats.likes += 1
    else if (detail.stats.likes > 0)
      detail.stats.likes -= 1
  })
}

function toggleCollect() {
  ensureLogin(() => {
    if (!guardSelf('collect', detail.author.name, viewerNickname))
      return
    detail.isCollected = !detail.isCollected
    if (detail.isCollected)
      detail.stats.collects += 1
    else if (detail.stats.collects > 0)
      detail.stats.collects -= 1
  })
}

function handleCommentAction(id: string) {
  activeCommentId.value = id
  showActionSheet.value = true
}

function toggleCommentLike(target: CommunityComment) {
  ensureLogin(() => {
    target.liked = !target.liked
    if (target.liked)
      target.likes += 1
    else if (target.likes > 0)
      target.likes -= 1
  })
}

function toggleReplyLike(target: CommunityComment, host: CommunityComment) {
  ensureLogin(() => {
    target.liked = !target.liked
    if (target.liked)
      target.likes += 1
    else if (target.likes > 0)
      target.likes -= 1

    if (!isRepliesExpanded(host.id) && (host.replies?.length || 0) > 2)
      toggleRepliesVisibility(host.id)
  })
}

function isRepliesExpanded(id: string) {
  return expandedReplies.value.includes(id)
}

function toggleRepliesVisibility(id: string, expand = false) {
  if (expand) {
    if (!isRepliesExpanded(id))
      expandedReplies.value = [...expandedReplies.value, id]
    return
  }

  if (isRepliesExpanded(id))
    expandedReplies.value = expandedReplies.value.filter(item => item !== id)
  else
    expandedReplies.value = [...expandedReplies.value, id]
}

function getVisibleReplies(comment: CommunityComment) {
  if (!comment.replies?.length)
    return []

  return isRepliesExpanded(comment.id) ? comment.replies : comment.replies.slice(0, 2)
}

function computeCommentCount(list: CommunityComment[] = []) {
  return list.reduce((acc, item) => acc + 1 + computeCommentCount(item.replies ?? []), 0)
}

// 点击关联足迹
function handleFootprintClick() {
  if (!detail.relatedFootprint)
    return
  // TODO: 跳转到足迹详情页
  uni.showToast({ title: '跳转到足迹详情', icon: 'none' })
}

function handleReply(target: CommunityComment, host?: CommunityComment) {
  const replyHost = host ?? target
  const replyTarget = host ? target : replyHost

  if (replyHost.replies && replyHost.replies.length > 2 && !isRepliesExpanded(replyHost.id))
    toggleRepliesVisibility(replyHost.id, true)

  replyContext.value = {
    host: replyHost,
    target: replyTarget,
  }
  commentDraft.value = ''
  commentFieldFocus.value = false
  nextTick(() => {
    commentFieldFocus.value = true
  })
}

function submitComment() {
  ensureLogin(() => {
    if (!canSubmitComment.value)
      return

    isSubmittingComment.value = true
    const text = commentDraft.value.trim()

    if (replyContext.value) {
      const host = replyContext.value.host
      const replyList = host.replies || (host.replies = [])
      const newReply: CommunityComment = {
        id: `reply-${Date.now()}`,
        author: { ...viewerProfile },
        content: text,
        liked: false,
        likes: 0,
        postedAt: '刚刚',
        replies: [],
      }

      replyList.unshift(newReply)

      detail.stats.comments = computeCommentCount(comments.value)

      if (!isRepliesExpanded(host.id))
        toggleRepliesVisibility(host.id, true)

      uni.showToast({ title: '回复已发布', icon: 'success' })
      replyContext.value = null
    }
    else {
      comments.value.unshift({
        id: `comment-${Date.now()}`,
        author: { ...viewerProfile },
        content: text,
        liked: false,
        likes: 0,
        postedAt: '刚刚',
        replies: [],
      })

      detail.stats.comments = computeCommentCount(comments.value)
      uni.showToast({ title: '评论已发布', icon: 'success' })
    }

    commentDraft.value = ''
    commentFieldFocus.value = false
    isSubmittingComment.value = false
  })
}

function handleCommentConfirm(event: UniHelper.InputOnConfirmEvent) {
  commentDraft.value = event.detail.value
  submitComment()
}

function handleCommentBlur() {
  commentFieldFocus.value = false
  if (!commentDraft.value.trim())
    cancelReplyContext()
}

function cancelReplyContext(force = false) {
  if (!replyContext.value)
    return

  if (force || !commentDraft.value.trim()) {
    replyContext.value = null
    commentDraft.value = ''
  }
}
</script>

<template>
  <view class="community-detail">
    <scroll-view
      scroll-y
      class="community-detail__scroll"
      :style="{ paddingBottom: contentPaddingBottom }"
    >
      <view class="community-detail__header" :style="{ paddingTop: headerPaddingTop }">
        <wd-icon name="arrow-left" size="40rpx" class="community-detail__header-back" @click="handleBack" />

        <view class="community-detail__header-author">
          <image :src="detail.author.avatar" mode="aspectFill" class="community-detail__avatar" />
          <view class="community-detail__header-info">
            <text class="community-detail__author-name">{{ detail.author.name }}</text>
          </view>
        </view>

        <view class="community-detail__header-actions">
          <wd-button
            size="small"
            type="primary"
            custom-class="community-detail__follow-btn"
            :custom-style="getFollowBtnStyle(detail)"
            @click="toggleFollow"
          >
            {{ detail.isFollowing ? '已关注' : '关注' }}
          </wd-button>
          <view class="community-detail__share" @click="handleShare">
            <wd-icon name="share" size="32rpx" />
          </view>
        </view>
      </view>

      <view v-if="detail.media.length" class="community-detail__media">
        <swiper
          class="community-detail__swiper"
          indicator-dots
          circular
          :current="currentSlide"
          indicator-color="rgba(255, 255, 255, 0.35)"
          indicator-active-color="#ffffff"
          @change="handleSwiperChange"
        >
          <swiper-item v-for="src in detail.media" :key="src" class="community-detail__swiper-item">
            <image :src="src" mode="aspectFill" class="community-detail__media-item" />
          </swiper-item>
        </swiper>
        <view class="community-detail__media-counter">
          {{ currentSlide + 1 }} / {{ detail.media.length }}
        </view>
      </view>

      <view class="community-detail__content">
        <text class="community-detail__title">{{ detail.title }}</text>
        <text class="community-detail__body">{{ detail.content }}</text>
      </view>

      <view class="community-detail__meta">
        <text class="community-detail__meta-text">{{ metaInfo }}</text>
      </view>

      <!-- 文中提及 -->
      <view v-if="detail.relatedFootprint" class="community-detail__related">
        <text class="community-detail__related-title">文中提及</text>
        <view class="community-detail__related-card" @click="handleFootprintClick">
          <image
            :src="detail.relatedFootprint.cover"
            mode="aspectFill"
            class="community-detail__related-cover"
          />
          <view class="community-detail__related-info">
            <view class="community-detail__related-header">
              <text class="community-detail__related-label">景点</text>
              <text class="community-detail__related-name">{{ detail.relatedFootprint.title }}</text>
            </view>
            <text class="community-detail__related-location">{{ detail.relatedFootprint.destination }}</text>
            <view v-if="detail.relatedFootprint.rating" class="community-detail__related-rating">
              <text class="community-detail__related-score">{{ detail.relatedFootprint.rating }}</text>
              <text class="community-detail__related-reviews">18.7万条点评</text>
            </view>
          </view>
          <wd-icon name="arrow-right" size="16px" color="rgba(22, 24, 35, 0.3)" />
        </view>
      </view>

      <view class="community-detail__comments">
        <view class="community-detail__comments-header">
          <text class="community-detail__comments-count">共 {{ detail.stats.comments }} 条评论</text>
        </view>

        <view
          v-for="comment in comments"
          :key="comment.id"
          class="community-detail__comment"
          @longpress="handleCommentAction(comment.id)"
        >
          <view class="community-detail__comment-avatar">
            <image
              :src="comment.author.avatar"
              mode="aspectFill"
              class="community-detail__comment-avatar-img"
            />
          </view>
          <view class="community-detail__comment-body">
            <view class="community-detail__comment-top">
              <view class="community-detail__comment-author">
                <text class="community-detail__comment-name">{{ comment.author.name }}</text>
                <text
                  v-if="comment.author.tags && comment.author.tags.includes('作者')"
                  class="community-detail__comment-tag"
                >
                  作者
                </text>
              </view>
            </view>
            <text class="community-detail__comment-content">{{ comment.content }}</text>
            <view class="community-detail__comment-footer">
              <text class="community-detail__comment-time">{{ formatRelativeTime(comment.postedAt) }}</text>
              <view class="community-detail__comment-stats">
                <view class="community-detail__comment-stat" @click="toggleCommentLike(comment)">
                  <wd-icon
                    :name="comment.liked ? 'heart-filled' : 'heart'"
                    size="28rpx"
                    :class="{ 'is-active': comment.liked }"
                  />
                  <text>{{ comment.likes }}</text>
                </view>
                <view class="community-detail__comment-stat" @click="handleReply(comment)">
                  <wd-icon name="chat1" size="28rpx" />
                  <text>{{ comment.replies?.length ? comment.replies.length : '回复' }}</text>
                </view>
              </view>
            </view>

            <view v-if="comment.replies?.length" class="community-detail__replies">
              <view v-for="reply in getVisibleReplies(comment)" :key="reply.id" class="community-detail__reply">
                <view class="community-detail__reply-avatar">
                  <image
                    :src="reply.author.avatar"
                    mode="aspectFill"
                    class="community-detail__reply-avatar-img"
                  />
                </view>
                <view class="community-detail__reply-body">
                  <view class="community-detail__reply-top">
                    <view class="community-detail__comment-author">
                      <text class="community-detail__comment-name">{{ reply.author.name }}</text>
                      <text
                        v-if="reply.author.tags && reply.author.tags.includes('作者')"
                        class="community-detail__comment-tag"
                      >
                        作者
                      </text>
                    </view>
                  </view>
                  <text class="community-detail__comment-content">{{ reply.content }}</text>
                  <view class="community-detail__comment-footer">
                    <text class="community-detail__comment-time">{{ formatRelativeTime(reply.postedAt) }}</text>
                    <view class="community-detail__comment-stats">
                      <view class="community-detail__comment-stat" @click="toggleReplyLike(reply, comment)">
                        <wd-icon
                          :name="reply.liked ? 'heart-filled' : 'heart'"
                          size="26rpx"
                          :class="{ 'is-active': reply.liked }"
                        />
                        <text>{{ reply.likes }}</text>
                      </view>
                      <view class="community-detail__comment-stat" @click="handleReply(reply, comment)">
                        <wd-icon name="chat1" size="26rpx" />
                        <text>{{ reply.replies?.length ? reply.replies.length : '回复' }}</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
              <view
                v-if="comment.replies.length > 2"
                class="community-detail__replies-more"
                @click="toggleRepliesVisibility(comment.id)"
              >
                {{ isRepliesExpanded(comment.id) ? '收起回复' : `查看全部 ${comment.replies.length} 条回复` }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view
      v-if="isReplying"
      class="community-detail__reply-overlay"
      @tap="cancelReplyContext(true)"
    />

    <view class="community-detail__footer">
      <view class="community-detail__footer-input">
        <wd-icon name="edit" size="32rpx" />
        <input
          v-model="commentDraft"
          type="text"
          confirm-type="send"
          class="community-detail__footer-field"
          :focus="commentFieldFocus"
          :placeholder="commentPlaceholder"
          @focus="commentFieldFocus = true"
          @blur="handleCommentBlur"
          @confirm="handleCommentConfirm"
        >
      </view>
      <view class="community-detail__footer-actions">
        <view
          class="community-detail__footer-icon"
          :class="{ 'is-active': detail.isCollected }"
          @click="toggleCollect"
        >
          <wd-icon :name="detail.isCollected ? 'star-filled' : 'star'" size="32rpx" />
        </view>
        <view
          class="community-detail__footer-icon"
          :class="{ 'is-active': detail.isLiked }"
          @click="toggleLike"
        >
          <wd-icon :name="detail.isLiked ? 'heart-filled' : 'heart'" size="32rpx" />
        </view>
        <wd-button
          type="primary"
          size="small"
          custom-class="community-detail__footer-send"
          :disabled="!canSubmitComment"
          :loading="isSubmittingComment"
          @click="submitComment"
        >
          发布
        </wd-button>
      </view>
    </view>

    <wd-action-sheet
      v-model="showActionSheet"
      :actions="[{ name: '复制评论' }, { name: '举报', color: 'var(--color-brand-primary)' }]"
    />
  </view>
  <LoginPrompt />
</template>

<style scoped lang="scss">
@use '@/style/index.scss' as *;

$detail-bg: $color-base-bg;
$detail-text: rgba($color-base-text, 0.96);
$detail-muted: rgba($color-base-text, 0.6);
$detail-card: mix($color-base-highlight, #ffffff, 94%);

.community-detail {
  position: relative;
  min-height: 100vh;
  background: $detail-bg;
}

.community-detail__scroll {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.community-detail__header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16rpx;
  padding: 0 24rpx 20rpx;
  background: rgba($detail-bg, 0.95);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba($color-base-text, 0.04);
}

.community-detail__header-back {
  padding: 12rpx;
  border-radius: 999rpx;
  background: rgba($color-base-text, 0.06);
  color: $detail-text;
}

.community-detail__header-author {
  display: inline-flex;
  align-items: center;
  gap: 16rpx;
  min-width: 0;
}

.community-detail__avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
}

.community-detail__header-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  min-width: 0;
}

.community-detail__author-name {
  font-size: 30rpx;
  font-weight: 600;
  color: $detail-text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.community-detail__header-actions {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
}

.community-detail__media {
  position: relative;
  margin: 24rpx;
  border-radius: 36rpx;
  overflow: hidden;
  box-shadow: 0 24rpx 48rpx rgba($color-base-text, 0.14);
}

.community-detail__swiper {
  width: 100%;
  height: 620rpx;
}

.community-detail__media-item {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.community-detail__media-counter {
  position: absolute;
  right: 24rpx;
  bottom: 24rpx;
  padding: 10rpx 22rpx;
  border-radius: 999rpx;
  background: rgba(0, 0, 0, 0.28);
  color: #fff;
  font-size: 24rpx;
}

.community-detail__content {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  padding: 0 28rpx;
}

.community-detail__title {
  font-size: 42rpx;
  font-weight: 650;
  color: $detail-text;
  line-height: 1.4;
}

.community-detail__excerpt {
  font-size: 30rpx;
  color: rgba($detail-text, 0.82);
  line-height: 1.6;
}

.community-detail__body {
  font-size: 28rpx;
  line-height: 1.7;
  color: rgba($detail-text, 0.9);
  white-space: pre-wrap;
}

// 元信息区域（小红书样式）
.community-detail__meta {
  padding: 24rpx 28rpx 0;
}

.community-detail__meta-text {
  font-size: 24rpx;
  color: rgba($detail-text, 0.48);
  line-height: 1.5;
}

.community-detail__related {
  padding: 24rpx 28rpx;
  margin-top: 16rpx;
}

.community-detail__related-title {
  font-size: 28rpx;
  font-weight: 600;
  color: $detail-text;
  display: block;
  margin-bottom: 16rpx;
}

.community-detail__related-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  border: 1rpx solid rgba($detail-text, 0.08);
}

.community-detail__related-cover {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
  flex-shrink: 0;
}

.community-detail__related-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  min-width: 0;
}

.community-detail__related-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.community-detail__related-label {
  padding: 4rpx 12rpx;
  background: rgba($color-brand-primary, 0.08);
  border-radius: 8rpx;
  font-size: 20rpx;
  color: $color-brand-primary;
  flex-shrink: 0;
}

.community-detail__related-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $detail-text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.community-detail__related-location {
  font-size: 24rpx;
  color: rgba($detail-text, 0.5);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.community-detail__related-rating {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.community-detail__related-score {
  font-size: 26rpx;
  font-weight: 600;
  color: #ff6900;
}

.community-detail__related-reviews {
  font-size: 22rpx;
  color: rgba($detail-text, 0.4);
}

.community-detail__comments {
  margin: 32rpx 28rpx 120rpx;
  background: $detail-card;
  border-radius: 32rpx;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.community-detail__comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.community-detail__comments-count {
  font-size: 30rpx;
  font-weight: 600;
  color: $detail-text;
}

.community-detail__comment {
  display: flex;
  gap: 18rpx;
}

.community-detail__comment-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.community-detail__comment-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.community-detail__reply-avatar {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.community-detail__reply-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.community-detail__comment-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.community-detail__comment-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.community-detail__comment-author {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.community-detail__comment-name {
  font-size: 28rpx;
  font-weight: 600;
  color: $detail-text;
}

.community-detail__comment-tag {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  background: rgba($color-brand-primary, 0.08);
  color: rgba($color-brand-primary, 0.75);
}

.community-detail__comment-actions {
  display: inline-flex;
  align-items: center;
  gap: 12rpx;
}

.community-detail__comment-like {
  color: rgba($color-base-text, 0.35);
}

.community-detail__comment-like.is-active {
  color: $color-brand-primary;
}

.community-detail__comment-content {
  font-size: 26rpx;
  line-height: 1.6;
  color: rgba($detail-text, 0.92);
}

.community-detail__comment-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12rpx;
}

.community-detail__comment-time {
  font-size: 22rpx;
  color: rgba($detail-text, 0.4);
  line-height: 1.4;
}

.community-detail__comment-stats {
  display: flex;
  align-items: center;
  gap: 36rpx;
  color: rgba($detail-text, 0.7);
}

.community-detail__comment-stat {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 20rpx;
}

.community-detail__comment-stat :deep(.wd-icon) {
  color: rgba($detail-text, 0.7);
  transition: color 0.2s ease;
}

.community-detail__comment-stat text {
  color: rgba($detail-text, 0.68);
}

.community-detail__comment-stat .is-active {
  color: var(--color-brand-primary);
}

.community-detail__comment-stat:active {
  opacity: 0.7;
}

.community-detail__replies-more {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: rgba($color-brand-primary, 0.82);
}

.community-detail__replies {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  padding: 18rpx 22rpx;
  border-radius: 24rpx;
  background: rgba($color-base-text, 0.04);
}

.community-detail__reply {
  display: flex;
  gap: 14rpx;
}

.community-detail__reply-body {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.community-detail__reply-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}

.community-detail__reply-overlay {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 9;
}

.community-detail__footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  padding: 24rpx 28rpx calc(24rpx + env(safe-area-inset-bottom));
  background: rgba($detail-bg, 0.92);
  backdrop-filter: blur(18px);
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 -12rpx 36rpx rgba($color-base-text, 0.08);
}

.community-detail__footer-input {
  flex: 1;
  display: inline-flex;
  align-items: center;
  gap: 14rpx;
  padding: 18rpx 24rpx;
  border-radius: 999rpx;
  background: rgba($color-base-text, 0.05);
  color: $detail-muted;
}

.community-detail__footer-actions {
  display: inline-flex;
  align-items: center;
  gap: 18rpx;
}

.community-detail__footer-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba($color-brand-primary, 0.08);
  color: $color-brand-primary;
}

.community-detail__footer-send {
  --wot-button-border-radius: 999rpx;
  --wot-button-padding-x: 32rpx;
  --wot-button-padding-y: 16rpx;
}
</style>
