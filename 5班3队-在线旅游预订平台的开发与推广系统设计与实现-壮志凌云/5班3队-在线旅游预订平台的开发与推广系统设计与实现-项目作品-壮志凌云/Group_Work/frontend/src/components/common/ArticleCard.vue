<script setup lang="ts">
/**
 * 文章卡片组件 - 小红书风格
 * 适用场景：社区、足迹、话题、收藏等流式布局
 */
interface ArticleCardProps {
  /** 文章ID */
  id: string
  /** 封面图 */
  cover: string
  /** 标题 */
  title: string
  /** 作者名称 */
  authorName: string
  /** 作者头像 */
  authorAvatar: string
  /** 点赞数 */
  likes: number
  /** 是否已点赞 */
  isLiked?: boolean
  /** 作者是否认证 */
  verified?: boolean
  /** 位置信息（可选） */
  location?: string
}

const props = defineProps<ArticleCardProps>()

const emit = defineEmits<{
  click: [id: string]
  like: [id: string, isLiked: boolean]
}>()

function handleCardClick() {
  emit('click', props.id)
}

function handleLikeClick(event: Event) {
  // 阻止冒泡，避免触发卡片点击
  event.stopPropagation()
  emit('like', props.id, !props.isLiked)
}

function formatLikes(count: number): string {
  if (count < 1000)
    return String(count)
  if (count < 10000)
    return `${(count / 1000).toFixed(1)}k`
  return `${(count / 10000).toFixed(1)}w`
}
</script>

<template>
  <view class="article-card" @click="handleCardClick">
    <!-- 封面图 -->
    <view class="article-card__cover-wrapper">
      <image
        :src="cover"
        mode="aspectFill"
        class="article-card__cover"
      />
    </view>

    <!-- 内容区 -->
    <view class="article-card__body">
      <!-- 标题 -->
      <text class="article-card__title">{{ title }}</text>

      <!-- 底部信息：作者 + 点赞 -->
      <view class="article-card__footer">
        <!-- 作者信息 -->
        <view class="article-card__author">
          <image
            :src="authorAvatar"
            mode="aspectFill"
            class="article-card__avatar"
          />
          <text class="article-card__author-name">{{ authorName }}</text>
          <wd-icon
            v-if="verified"
            name="verified"
            size="20rpx"
            class="article-card__verified"
          />
        </view>

        <!-- 点赞 -->
        <view
          class="article-card__like"
          :class="{ 'is-liked': isLiked }"
          @click.stop="handleLikeClick"
        >
          <wd-icon
            :name="isLiked ? 'heart-filled' : 'heart'"
            size="28rpx"
            class="article-card__like-icon"
          />
          <text class="article-card__like-count">{{ formatLikes(likes) }}</text>
        </view>
      </view>

      <!-- 位置信息（可选） -->
      <view v-if="location" class="article-card__location">
        <wd-icon name="location" size="20rpx" />
        <text class="article-card__location-text">{{ location }}</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@use '@/style/index.scss' as *;

// 配色变量（符合设计规范）
$card-bg: mix(#fbede0, #ffffff, 88%); // 荷花色混合米白
$card-shadow: 0 8rpx 24rpx rgba(#161823, 0.06);
$card-shadow-hover: 0 12rpx 32rpx rgba(#161823, 0.12);
$title-color: #161823; // 漆黑
$author-color: rgba(#2b2b2b, 0.65); // 灰色半透明
$like-color: rgba(#161823, 0.5);
$like-active-color: #325947; // 松石绿
$verified-color: rgba(#325947, 0.72);
$border-radius: 20rpx;
$avatar-size: 40rpx;

.article-card {
  display: flex;
  flex-direction: column;
  background: $card-bg;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: $card-shadow;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // 确保无额外空白
  margin: 0;
  padding: 0;
  min-height: 0;
  height: fit-content;

  &:active {
    transform: scale(0.98);
    box-shadow: $card-shadow-hover;
  }
}

// 封面区域
.article-card__cover-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.article-card__cover {
  width: 100%;
  aspect-ratio: 3 / 4; // 竖版比例，符合小红书风格
  object-fit: cover;
  display: block;
  vertical-align: top;
  margin: 0;
  padding: 0;
  line-height: 0;
}

// 内容区域
.article-card__body {
  padding: 20rpx 24rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

// 标题
.article-card__title {
  font-size: 26rpx;
  font-weight: 500;
  line-height: 1.4;
  color: $title-color;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

// 底部信息区
.article-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

// 作者信息
.article-card__author {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 1;
  min-width: 0; // 允许文字截断
}

.article-card__avatar {
  width: $avatar-size;
  height: $avatar-size;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1rpx solid rgba(#161823, 0.06);
}

.article-card__author-name {
  font-size: 22rpx;
  color: $author-color;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.article-card__verified {
  color: $verified-color;
  flex-shrink: 0;
}

// 点赞区域
.article-card__like {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: transparent;
  color: $like-color;
  transition: all 0.25s ease;
  flex-shrink: 0;

  &:active {
    transform: scale(0.92);
  }

  &.is-liked {
    color: $like-active-color;
    background: rgba($like-active-color, 0.08);

    .article-card__like-icon {
      animation: heart-beat 0.4s ease;
    }
  }
}

.article-card__like-icon {
  color: inherit;
}

.article-card__like-count {
  font-size: 22rpx;
  font-weight: 500;
  font-variant-numeric: tabular-nums; // 等宽数字
  color: inherit;
}

// 位置信息（可选）
.article-card__location {
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
  font-size: 20rpx;
  color: rgba(#161823, 0.4);
  padding-top: 4rpx;
}

.article-card__location-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// 点赞动画
@keyframes heart-beat {
  0%,
  100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.25);
  }
  50% {
    transform: scale(0.95);
  }
}

// 深色模式适配（可选，根据项目需要启用）
// @media (prefers-color-scheme: dark) {
//   .article-card {
//     background: #2b2b2b;
//   }
//   .article-card__title {
//     color: #fcfbfa;
//   }
//   .article-card__author-name {
//     color: rgba(#fcfbfa, 0.65);
//   }
// }
</style>
