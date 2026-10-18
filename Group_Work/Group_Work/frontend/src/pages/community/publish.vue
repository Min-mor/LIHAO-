<template>
  <view class="publish">
    <!-- 自定义导航栏 -->
    <view class="publish__navbar" :style="{ paddingTop: `${statusBarHeight}px` }">
      <view class="publish__navbar-content">
        <view class="publish__navbar-left" @click="handleBack">
          <wd-icon name="arrow-left" size="24px" />
        </view>
        <view class="publish__navbar-center" />
        <view class="publish__navbar-right" @click="handlePreview">
          <text class="publish__navbar-preview">预览</text>
        </view>
      </view>
    </view>

    <scroll-view
      scroll-y
      class="publish__container"
      :style="{
        top: `${navbarHeight}px`,
        height: `calc(100vh - ${navbarHeight}px)`,
      }"
    >
      <!-- 图片上传区 -->
      <view class="publish__media">
        <view
          v-for="(image, index) in images"
          :key="index"
          class="publish__media-item"
        >
          <image :src="image" mode="aspectFill" class="publish__media-img" />
          <view class="publish__media-delete" @click="deleteImage(index)">
            <wd-icon name="close" size="16px" color="#fff" />
          </view>
        </view>
        <view
          v-if="images.length < 9"
          class="publish__media-add"
          @click="chooseImage"
        >
          <wd-icon name="add" size="40px" color="rgba(22, 24, 35, 0.15)" />
        </view>
      </view>

      <!-- 标题输入 -->
      <view class="publish__title">
        <input
          v-model="title"
          type="text"
          placeholder="添加标题"
          placeholder-class="publish__placeholder"
          :maxlength="50"
          class="publish__title-input"
        >
      </view>

      <!-- 正文输入 -->
      <view class="publish__content">
        <textarea
          v-model="content"
          placeholder="添加正文"
          placeholder-class="publish__placeholder"
          :auto-height="false"
          :show-confirm-bar="false"
          class="publish__content-textarea"
        />
      </view>

      <!-- 话题标签区 -->
      <view v-if="hashtags.length > 0" class="publish__hashtags">
        <view
          v-for="(tag, index) in hashtags"
          :key="index"
          class="publish__hashtag"
          @click="removeHashtag(index)"
        >
          <text>{{ tag }}</text>
          <wd-icon name="close" size="12px" />
        </view>
      </view>

      <!-- 底部操作栏 -->
      <view class="publish__footer">
        <!-- 操作选项 -->
        <view class="publish__options">
          <!-- 标记地点 -->
          <view class="publish__option" @click="showLocationPopup = true">
            <view class="publish__option-left">
              <wd-icon name="location" size="20px" color="rgba(22, 24, 35, 0.8)" />
              <text class="publish__option-text">标记地点</text>
            </view>
            <view class="publish__option-right">
              <text v-if="location" class="publish__option-value">{{ location }}</text>
              <wd-icon name="arrow-right" size="16px" color="rgba(22, 24, 35, 0.3)" />
            </view>
          </view>

          <!-- 公开可见 -->
          <view class="publish__option" @click="showVisibilityPopup = true">
            <view class="publish__option-left">
              <wd-icon :name="currentVisibilityOption.icon" size="20px" color="rgba(22, 24, 35, 0.8)" />
              <text class="publish__option-text">{{ currentVisibilityOption.label }}</text>
            </view>
            <view class="publish__option-right">
              <wd-icon name="arrow-right" size="16px" color="rgba(22, 24, 35, 0.3)" />
            </view>
          </view>

          <!-- 添加组件 -->
          <view class="publish__option" @click="showComponentPopup = true">
            <view class="publish__option-left">
              <wd-icon name="add-circle" size="20px" color="rgba(22, 24, 35, 0.8)" />
              <text class="publish__option-text">添加组件</text>
            </view>
            <view class="publish__option-right">
              <text v-if="selectedFootprint" class="publish__option-value">已关联足迹</text>
              <text v-else class="publish__option-hint">可添加文件</text>
              <wd-icon name="arrow-right" size="16px" color="rgba(22, 24, 35, 0.3)" />
            </view>
          </view>
        </view>

        <!-- 发布按钮 -->
        <view class="publish__submit" @click="handlePublish">
          <text class="publish__submit-text">发布笔记</text>
        </view>
      </view>
    </scroll-view>

    <!-- 话题输入弹窗 -->
    <wd-popup v-model="showHashtagPopup" position="bottom" :safe-area-inset-bottom="true">
      <view class="publish__hashtag-popup">
        <view class="publish__hashtag-header">
          <text class="publish__hashtag-title">添加话题</text>
          <wd-icon name="close" size="20px" @click="showHashtagPopup = false" />
        </view>
        <view class="publish__hashtag-input-wrapper">
          <text class="publish__hashtag-prefix">#</text>
          <input
            v-model="hashtagInput"
            type="text"
            placeholder="输入话题"
            :maxlength="20"
            class="publish__hashtag-input"
            @confirm="addHashtag"
          >
        </view>
        <view class="publish__hashtag-confirm" @click="addHashtag">
          <text>确定</text>
        </view>
      </view>
    </wd-popup>

    <!-- 足迹选择弹窗 -->
    <wd-popup v-model="showFootprintPopup" position="bottom" :safe-area-inset-bottom="true">
      <view class="publish__footprint-popup">
        <view class="publish__footprint-header">
          <text class="publish__footprint-title">选择关联足迹</text>
          <wd-icon name="close" size="20px" @click="showFootprintPopup = false" />
        </view>
        <scroll-view scroll-y class="publish__footprint-list">
          <view
            v-for="footprint in footprintList"
            :key="footprint.id"
            class="publish__footprint-item"
            :class="{ 'is-selected': selectedFootprint?.id === footprint.id }"
            @click="selectFootprint(footprint)"
          >
            <image
              :src="footprint.media[0]"
              mode="aspectFill"
              class="publish__footprint-cover"
            />
            <view class="publish__footprint-info">
              <text class="publish__footprint-name">{{ footprint.title }}</text>
              <text class="publish__footprint-location">{{ footprint.destination }}</text>
            </view>
            <wd-icon
              v-if="selectedFootprint?.id === footprint.id"
              name="success"
              size="20px"
              color="var(--color-brand-primary)"
            />
          </view>
        </scroll-view>
      </view>
    </wd-popup>

    <!-- 标记地点弹窗 -->
    <wd-popup v-model="showLocationPopup" position="bottom" :safe-area-inset-bottom="true">
      <view class="publish__location-popup">
        <view class="publish__location-header">
          <view class="publish__location-tabs">
            <view
              class="publish__location-tab"
              :class="{ 'is-active': locationTab === 'location' }"
              @click="locationTab = 'location'"
            >
              地点
            </view>
            <view
              class="publish__location-tab"
              :class="{ 'is-active': locationTab === 'route' }"
              @click="locationTab = 'route'"
            >
              行程
            </view>
          </view>
          <wd-icon name="close" size="20px" @click="showLocationPopup = false" />
        </view>

        <!-- 地点选择 -->
        <view v-if="locationTab === 'location'" class="publish__location-content">
          <view class="publish__location-search">
            <wd-icon name="search" size="18px" color="rgba(22, 24, 35, 0.4)" />
            <input
              v-model.trim="locationSearch"
              type="text"
              placeholder="搜索附近地点"
              class="publish__location-input"
              :disabled="nearbyLoading"
              @confirm="handleSearch"
            >
            <text class="publish__location-search-refresh" @click="handleSearch">搜索</text>
          </view>
          <scroll-view scroll-y class="publish__location-list">
            <view class="publish__location-section">
              <view class="publish__location-section-header">
                <text>{{ locationSearch ? '搜索结果' : '附近地址候选' }}</text>
                <text v-if="nearbyLoading" class="publish__location-hint">定位中...</text>
              </view>
              <view v-if="nearbyError" class="publish__nearby-error">
                <text>{{ nearbyError }}</text>
                <text class="publish__location-retry" @click="retryNearby">重试</text>
              </view>
              <view v-else-if="!candidateLocations.length && !nearbyLoading" class="publish__nearby-empty">
                <text>暂未获取到附近地址，试试输入其他关键词</text>
              </view>
              <view
                v-for="item in candidateLocations"
                :key="item.id || item.title"
                class="publish__nearby-item"
                :class="{ 'is-active': item.title === location }"
                @click="selectNearbyLocation(item)"
              >
                <view class="publish__nearby-item-main">
                  <text class="publish__nearby-name">{{ item.title }}</text>
                  <text v-if="item.address" class="publish__nearby-address">{{ item.address }}</text>
                </view>
                <view class="publish__nearby-meta">
                  <text v-if="item.distance" class="publish__nearby-distance">{{ formatDistance(item.distance) }}</text>
                  <wd-icon
                    v-if="item.title === location"
                    name="success"
                    size="18px"
                    color="var(--color-brand-primary)"
                  />
                </view>
              </view>
            </view>
          </scroll-view>
        </view>

        <!-- 行程选择 -->
        <view v-else class="publish__route-content">
          <text class="publish__route-hint">添加行程，规划路线，开启丝滑出行之旅</text>
          <view class="publish__route-actions">
            <view class="publish__route-action">
              <text>AI自动生成</text>
              <text class="publish__route-action-hint">识别笔记正文内容，一键生成路线规划</text>
            </view>
            <view class="publish__route-action">
              <text>手动添加路线</text>
              <text class="publish__route-action-hint">添加地点，规划路线，开启丝滑出行之旅</text>
            </view>
          </view>
        </view>
      </view>
    </wd-popup>

    <!-- 公开可见弹窗 -->
    <wd-popup v-model="showVisibilityPopup" position="bottom" :safe-area-inset-bottom="true">
      <view class="publish__visibility-popup">
        <view
          v-for="item in visibilityOptions"
          :key="item.value"
          class="publish__visibility-item"
          :class="{ 'is-active': visibility === item.value }"
          @click="selectVisibility(item.value)"
        >
          <view class="publish__visibility-left">
            <wd-icon :name="item.icon" size="20px" color="rgba(22, 24, 35, 0.8)" />
            <text class="publish__visibility-text">{{ item.label }}</text>
          </view>
          <wd-icon
            v-if="visibility === item.value"
            name="success"
            size="20px"
            color="var(--color-brand-primary)"
          />
        </view>
      </view>
    </wd-popup>

    <!-- 添加组件弹窗 -->
    <wd-popup v-model="showComponentPopup" position="bottom" :safe-area-inset-bottom="true">
      <view class="publish__component-popup">
        <view class="publish__component-item" @click="handleSelectFootprint">
          <wd-icon name="link" size="20px" color="rgba(22, 24, 35, 0.8)" />
          <text class="publish__component-text">关联足迹</text>
          <wd-icon name="arrow-right" size="16px" color="rgba(22, 24, 35, 0.3)" />
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script setup lang="ts">
import type { FootprintItem } from '@/mock/profile-types'
import type { NearbyPlace } from '@/utils/location'
import { onLoad } from '@dcloudio/uni-app'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { profileMockData } from '@/mock/profile'
import { publishNote } from '@/service/publish'
import { useUserStore } from '@/store'
import { fetchNearbyPlaces, getCurrentLocation } from '@/utils/location'
import { safeAreaInsets } from '@/utils/systemInfo'

definePage({
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '发布笔记',
  },
})

// 页面布局尺寸（使用 px 单位）
const statusBarHeight = safeAreaInsets?.top || 0
// 导航栏内容高度 88rpx ≈ 44px（标准屏幕 2:1 转换）
const navbarContentHeight = 44
const navbarHeight = statusBarHeight + navbarContentHeight

// 基础数据
const images = ref<string[]>([])
const title = ref('')
const content = ref('')
const hashtags = ref<string[]>([])
const location = ref('')
const visibility = ref<'public' | 'private' | 'friends' | 'custom_show' | 'custom_hide'>('public')
const selectedFootprint = ref<FootprintItem | null>(null)
const locationSearch = ref('')

// 弹窗控制
const showHashtagPopup = ref(false)
const showFootprintPopup = ref(false)
const showLocationPopup = ref(false)
const showVisibilityPopup = ref(false)
const showComponentPopup = ref(false)
const hashtagInput = ref('')
const locationTab = ref<'location' | 'route'>('location') // 地点选择tab

// 足迹列表
const footprintList = ref<FootprintItem[]>([])
const userStore = useUserStore()

// 静态配置
const visibilityOptions: Array<{ label: string, value: typeof visibility.value, icon: string }> = [
  { label: '公开可见', value: 'public', icon: 'lock-off' },
  { label: '仅互关好友可见', value: 'friends', icon: 'user-talk' },
  { label: '仅自己可见', value: 'private', icon: 'lock-on' },
]
const fallbackCoords = { latitude: 26.00585635868668, longitude: 119.4473524393012 }
const nearbyLocations = ref<NearbyPlace[]>([])
const nearbyLoading = ref(false)
const nearbyError = ref('')
const hasRequestedNearby = ref(false)
const currentCoords = ref<{ latitude: number, longitude: number } | null>(null)
const usingFallbackLocation = ref(false)

let searchTimer: ReturnType<typeof setTimeout> | null = null

// 当前选中的可见性选项
const currentVisibilityOption = computed(() => {
  return visibilityOptions.find(opt => opt.value === visibility.value) || visibilityOptions[0]
})

const candidateLocations = computed(() => nearbyLocations.value)

onLoad(() => {
  // 加载用户的足迹列表
  loadFootprints()
})

watch(showLocationPopup, (visible) => {
  if (visible && !hasRequestedNearby.value)
    initNearby()
})

watch(locationSearch, (keyword) => {
  if (!hasRequestedNearby.value)
    return
  scheduleSearch(keyword)
})

onBeforeUnmount(() => {
  clearTimeout(searchTimer as any)
})

// 加载足迹列表
function loadFootprints() {
  const userId = userStore.userInfo.id
  const profileData = profileMockData
  footprintList.value = profileData.footprint || []
}

// 选择图片
function chooseImage() {
  uni.chooseImage({
    count: 9 - images.value.length,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const paths = Array.isArray(res.tempFilePaths) ? res.tempFilePaths : [res.tempFilePaths]
      images.value = [...images.value, ...paths]
    },
  })
}

// 删除图片
function deleteImage(index: number) {
  images.value.splice(index, 1)
}

// 显示话题输入
function showHashtagInput() {
  showHashtagPopup.value = true
}

// 添加话题
function addHashtag() {
  if (hashtagInput.value.trim()) {
    const tag = `#${hashtagInput.value.trim()}`
    if (!hashtags.value.includes(tag)) {
      hashtags.value.push(tag)
    }
    hashtagInput.value = ''
    showHashtagPopup.value = false
  }
}

// 移除话题
function removeHashtag(index: number) {
  hashtags.value.splice(index, 1)
}

// 选择地点
function selectLocation(loc: string) {
  location.value = loc
  showLocationPopup.value = false
}

function selectNearbyLocation(place: NearbyPlace) {
  location.value = place.title
  showLocationPopup.value = false
}

async function initNearby(force = false) {
  if (nearbyLoading.value)
    return
  try {
    nearbyError.value = ''
    await ensureCurrentCoords(force)
    await loadNearby({ keyword: locationSearch.value })
    hasRequestedNearby.value = true
  }
  catch (error) {
    handleNearbyError(error)
  }
}

function scheduleSearch(keyword: string) {
  if (searchTimer)
    clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    loadNearby({ keyword })
  }, 400)
}

function handleSearch() {
  if (!hasRequestedNearby.value)
    hasRequestedNearby.value = true
  loadNearby({ keyword: locationSearch.value.trim() })
}

async function loadNearby({ keyword }: { keyword?: string }) {
  await ensureCurrentCoords(false)
  nearbyLoading.value = true
  try {
    const normalizedKeyword = keyword?.trim()
    nearbyLocations.value = await fetchNearbyPlaces({
      keyword: normalizedKeyword || undefined,
      latitude: currentCoords.value!.latitude,
      longitude: currentCoords.value!.longitude,
    })
    if (!nearbyLocations.value.length)
      nearbyError.value = '附近暂无推荐，试试输入其他关键词'
    else
      nearbyError.value = ''
  }
  catch (error) {
    handleNearbyError(error)
  }
  finally {
    nearbyLoading.value = false
  }
}

function refreshNearby() {
  hasRequestedNearby.value = false
  initNearby(true)
}

function retryNearby() {
  initNearby(true)
}

function handleNearbyError(error: unknown) {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : '获取附近地点失败'
  nearbyLocations.value = []
  nearbyError.value = message.includes('auth') || message.includes('permission')
    ? '定位未授权，已经恢复常用地点'
    : message
}

async function ensureCurrentCoords(force = false) {
  if (currentCoords.value && !force)
    return
  try {
    const coords = await getCurrentLocation()
    currentCoords.value = coords
    usingFallbackLocation.value = false
  }
  catch (error) {
    console.warn('[location] getLocation failed, use fallback coords', error)
    currentCoords.value = { ...fallbackCoords }
    usingFallbackLocation.value = true
    nearbyError.value = '定位失败，已切换至默认地点，可自行搜索'
  }
}

function formatDistance(distance?: number) {
  if (typeof distance !== 'number' || Number.isNaN(distance))
    return ''
  return distance >= 1000 ? `${(distance / 1000).toFixed(1)} km` : `${Math.round(distance)} m`
}

// 选择可见性
function selectVisibility(val: typeof visibility.value) {
  visibility.value = val
  // 延迟关闭弹窗，让用户看到选中效果
  setTimeout(() => {
    showVisibilityPopup.value = false
  }, 300)
}

// 选择关联足迹
function handleSelectFootprint() {
  showComponentPopup.value = false
  if (footprintList.value.length === 0) {
    uni.showToast({ title: '暂未有足迹', icon: 'none' })
    return
  }
  showFootprintPopup.value = true
}

// 选中足迹
function selectFootprint(footprint: FootprintItem) {
  // 如果点击已选中的，则取消选择
  if (selectedFootprint.value?.id === footprint.id) {
    selectedFootprint.value = null
  }
  else {
    selectedFootprint.value = footprint
    // 自动填充地点
    if (!location.value && footprint.destination) {
      location.value = footprint.destination
    }
  }
  showFootprintPopup.value = false
  showComponentPopup.value = false
}

// 选择文件
function handleSelectFile() {
  showComponentPopup.value = false
  uni.showToast({ title: '文件功能开发中', icon: 'none' })
}

// 返回
function handleBack() {
  if (title.value || content.value || images.value.length > 0) {
    uni.showModal({
      title: '确认退出',
      content: '退出后内容将不会保存',
      success: (res) => {
        if (res.confirm) {
          uni.navigateBack()
        }
      },
    })
  }
  else {
    uni.navigateBack()
  }
}

// 预览
function handlePreview() {
  // TODO: 跳转到预览页面
  uni.showToast({ title: '预览功能开发中', icon: 'none' })
}

// 发布
async function handlePublish() {
  // 验证必填项
  if (!title.value.trim()) {
    uni.showToast({ title: '请输入标题', icon: 'none' })
    return
  }
  if (!content.value.trim()) {
    uni.showToast({ title: '请输入正文', icon: 'none' })
    return
  }
  if (images.value.length === 0) {
    uni.showToast({ title: '请至少添加一张图片', icon: 'none' })
    return
  }

  uni.showLoading({ title: '发布中...' })

  try {
    const result = await publishNote({
      images: images.value,
      title: title.value.trim(),
      content: content.value.trim(),
      hashtags: hashtags.value,
      location: location.value,
      visibility: visibility.value,
      footprintId: selectedFootprint.value?.id,
    })

    uni.hideLoading()
    uni.showToast({
      title: result.message || '发布成功',
      icon: 'success',
      success: () => {
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      },
    })
  }
  catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '发布失败，请重试',
      icon: 'none',
    })
  }
}
</script>

<style scoped lang="scss">
$navbar-height: 88rpx;

.publish {
  width: 100vw;
  height: 100vh;
  background: var(--color-bg-primary);
  overflow: hidden;
  position: relative;
}

// 导航栏
.publish__navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--color-surface);
  z-index: 10;
}

.publish__navbar-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
}

.publish__navbar-left {
  flex-shrink: 0;
}

.publish__navbar-center {
  flex: 1;
}

.publish__navbar-right {
  flex-shrink: 0;
}

.publish__navbar-preview {
  font-size: 28rpx;
  color: var(--color-text-primary);
}

// 内容区（可滚动）
.publish__container {
  position: fixed;
  left: 0;
  right: 0;
  padding: 24rpx 28rpx;
  overflow-y: scroll;
  box-sizing: border-box;
}

// 图片上传
.publish__media {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 32rpx;
  padding-bottom: 24rpx;
}

.publish__media-item {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background: #f5f5f5;
  border-radius: 12rpx;
  overflow: hidden;
}

.publish__media-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.publish__media-delete {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.publish__media-add {
  width: 100%;
  padding-bottom: 100%;
  background: var(--color-overlay-light);
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.publish__media-add :deep(.wd-icon) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-text-muted);
}

// 标题
.publish__title {
  min-height: 80rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: var(--color-text-primary);
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  padding: 0;
  margin-bottom: 24rpx;
}

.publish__content-textarea {
  width: 100%;
  height: 30vh;
  min-height: 300rpx;
  max-height: 600rpx;
  font-size: 28rpx;
  color: var(--color-text-primary);
  line-height: 1.6;
}

.publish__placeholder {
  color: rgba(var(--color-text-rgb), 0.3);
}

// 话题标签
.publish__hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.publish__hashtag {
  padding: 12rpx 24rpx;
  background: var(--color-brand-soft);
  border-radius: 32rpx;
  font-size: 24rpx;
  color: var(--color-brand-primary);
  display: flex;
  align-items: center;
  gap: 8rpx;
}

// 底部操作栏
.publish__footer {
  padding: 24rpx 0;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}

// 操作选项
.publish__options {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.publish__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: var(--color-overlay-light);
  border-radius: 16rpx;
}

.publish__option-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.publish__option-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.publish__option-text {
  font-size: 28rpx;
  color: var(--color-text-primary);
}

.publish__option-value {
  font-size: 24rpx;
  color: var(--color-text-muted);
}

.publish__option-hint {
  font-size: 24rpx;
  color: var(--color-text-muted);
  opacity: 0.6;
}

// 发布按钮
.publish__submit {
  padding: 28rpx;
  background: var(--color-brand-primary);
  border-radius: 48rpx;
  text-align: center;
  box-shadow: 0 8rpx 20rpx rgba(var(--color-brand-primary-rgb), 0.25);
}

.publish__submit-text {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--color-surface);
}

// 话题输入弹窗
.publish__hashtag-popup {
  padding: 40rpx 28rpx;
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
}

.publish__hashtag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.publish__hashtag-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--color-text-primary);
}

.publish__hashtag-input-wrapper {
  display: flex;
  align-items: center;
  padding: 24rpx 28rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.publish__hashtag-prefix {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--color-brand-primary);
  margin-right: 8rpx;
}

.publish__hashtag-input {
  flex: 1;
  font-size: 28rpx;
  color: var(--color-text-primary);
}

.publish__hashtag-confirm {
  width: 100%;
  height: 88rpx;
  background: var(--color-brand-primary);
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 600;
  color: var(--color-surface);
}

// 足迹选择弹窗
.publish__footprint-popup {
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.publish__footprint-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 28rpx 24rpx;
  border-bottom: 1rpx solid var(--color-border);
}

.publish__footprint-title {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--color-text-primary);
}

.publish__footprint-list {
  flex: 1;
  padding: 16rpx 28rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
}

.publish__footprint-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
  transition: all 0.2s ease;
}

.publish__footprint-item.is-selected {
  background: var(--color-brand-soft);
}

.publish__footprint-cover {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  background: #f5f5f5;
}

.publish__footprint-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.publish__footprint-name {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.publish__footprint-location {
  font-size: 24rpx;
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 标记地点弹窗
.publish__location-popup {
  max-height: 80vh;
  width: 100vw;
  max-width: 100%;
  box-sizing: border-box;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.publish__location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 28rpx 16rpx;
  border-bottom: 1rpx solid var(--color-border);
}

.publish__location-tabs {
  display: flex;
  gap: 40rpx;
}

.publish__location-tab {
  font-size: 28rpx;
  color: var(--color-text-muted);
  padding-bottom: 16rpx;
  position: relative;
}

.publish__location-tab.is-active {
  color: var(--color-text-primary);
  font-weight: 600;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4rpx;
    background: var(--color-brand-primary);
    border-radius: 2rpx;
  }
}

.publish__location-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.publish__location-search {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 28rpx;
  background: var(--color-overlay-light);
  margin: 16rpx 28rpx;
  border-radius: 12rpx;
}

.publish__location-search-refresh {
  font-size: 24rpx;
  color: var(--color-brand-primary);
}

.publish__location-input {
  flex: 1;
  font-size: 26rpx;
  border: none;
  background: transparent;
}

.publish__location-list {
  flex: 1;
  min-height: 0;
  width: 100%;
  max-height: calc(80vh - 260rpx);
  overflow-y: auto;
  box-sizing: border-box;
  padding: 0 28rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
}

.publish__location-section {
  margin-bottom: 32rpx;
  width: 100%;
}

.publish__location-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 26rpx;
  color: var(--color-text-secondary);
  margin-bottom: 12rpx;
}

.publish__location-hint {
  font-size: 24rpx;
  color: var(--color-text-muted);
}

.publish__location-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--color-border-light);
}

.publish__location-name {
  font-size: 28rpx;
  color: var(--color-text-primary);
}

.publish__nearby-item {
  padding: 20rpx 0;
  display: flex;
  justify-content: space-between;
  gap: 16rpx;
  border-bottom: 1rpx dashed var(--color-border-light);
}

.publish__nearby-item-main {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.publish__nearby-name {
  font-size: 28rpx;
  color: var(--color-text-primary);
}

.publish__nearby-address {
  font-size: 24rpx;
  color: var(--color-text-muted);
}

.publish__nearby-distance {
  font-size: 24rpx;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.publish__nearby-error,
.publish__nearby-empty {
  padding: 24rpx 0;
  font-size: 24rpx;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.publish__location-retry {
  color: var(--color-brand-primary);
}

.publish__route-content {
  padding: 32rpx 28rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.publish__route-hint {
  font-size: 24rpx;
  color: var(--color-text-muted);
  display: block;
  margin-bottom: 24rpx;
}

.publish__route-actions {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.publish__route-action {
  padding: 24rpx;
  background: var(--color-brand-soft);
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.publish__route-action-hint {
  font-size: 22rpx;
  color: var(--color-text-muted);
}

// 公开可见弹窗
.publish__visibility-popup {
  padding: 16rpx 0;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
}

.publish__visibility-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
}

.publish__visibility-item.is-active {
  background: var(--color-brand-soft);
}

.publish__visibility-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.publish__visibility-text {
  font-size: 28rpx;
  color: var(--color-text-primary);
}

// 添加组件弹窗
.publish__component-popup {
  padding: 16rpx 0;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
}

.publish__component-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 28rpx;
}

.publish__component-text {
  flex: 1;
  font-size: 28rpx;
  color: var(--color-text-primary);
}
</style>
