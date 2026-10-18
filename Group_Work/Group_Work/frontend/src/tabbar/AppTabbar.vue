<script setup lang="ts">
import { computed } from 'vue'

type NavMethod = 'navigateTo' | 'switchTab' | 'reLaunch'

interface NavigationItem {
  icon: string
  pagePath: string
  method?: NavMethod
}

const navigationItems: NavigationItem[] = [
  { icon: 'a-rootlist', pagePath: '/pages/community/index', method: 'reLaunch' },
  { icon: 'calendar', pagePath: '/pages/trip/index', method: 'reLaunch' },
  { icon: 'home', pagePath: '/pages/home/index', method: 'reLaunch' },
  { icon: 'heart', pagePath: '/pages/romantic/index', method: 'reLaunch' },
  { icon: 'user', pagePath: '/pages/profile/index', method: 'reLaunch' },
]

const currentPath = computed(() => {
  const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : []
  const route = pages?.[pages.length - 1]?.route || ''
  return route ? `/${route}` : ''
})

function handleNavigate(item: NavigationItem) {
  if (currentPath.value === item.pagePath)
    return

  switch (item.method) {
    case 'switchTab':
      uni.switchTab({ url: item.pagePath })
      break
    case 'reLaunch':
      uni.reLaunch({ url: item.pagePath })
      break
    default:
      uni.navigateTo({ url: item.pagePath })
      break
  }
}
</script>

<template>
  <view class="app-tabbar">
    <view
      v-for="item in navigationItems"
      :key="item.pagePath"
      class="app-tabbar__item"
      :class="{ 'app-tabbar__item--active': currentPath === item.pagePath }"
      @click="handleNavigate(item)"
    >
      <wd-icon :name="item.icon" size="32px" />
    </view>
  </view>
</template>

<style scoped lang="scss">
.app-tabbar {
  position: fixed;
  left: 32rpx;
  right: 32rpx;
  bottom: 32rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 24rpx 40rpx;
  border-radius: 48rpx;
  background: #161823;
  color: #fcfbfa;
  box-shadow: none;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
}

.app-tabbar__item {
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  transition: transform 0.2s ease;
}

.app-tabbar__item--active {
  transform: scale(1.12);
  color: #a0d4c4;
}
</style>
