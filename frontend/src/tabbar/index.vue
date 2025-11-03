<script setup lang="ts">
// i-carbon-code
import type { CustomTabBarItem } from './config'
import { customTabbarEnable, needHideNativeTabbar, tabbarCacheEnable } from './config'
import { tabbarList, tabbarStore } from './store'

// #ifdef MP-WEIXIN
// 将自定义节点设置成虚拟的（去掉自定义组件包裹层），更加接近Vue组件的表现，能更好的使用flex属性
defineOptions({
  virtualHost: true,
})
// #endif

/**
 * 中间的鼓包tabbarItem的点击事件
 */
function handleClickBulge() {
  uni.showToast({
    title: '点击了中间的鼓包tabbarItem',
    icon: 'none',
  })
}

function handleClick(index: number) {
  // 点击原来的不做操作
  if (index === tabbarStore.curIdx) {
    return
  }
  if (tabbarList[index].isBulge) {
    handleClickBulge()
    return
  }
  const target = tabbarList[index].pagePath.startsWith('/') ? tabbarList[index].pagePath : `/${tabbarList[index].pagePath}`
  const prevIdx = tabbarStore.curIdx

  if (tabbarCacheEnable) {
    uni.switchTab({
      url: target,
      success: () => {
        tabbarStore.setCurIdx(index)
      },
      fail: (error) => {
        console.warn('[tabbar] switchTab fail:', error)
        uni.showToast({ title: '页面跳转失败', icon: 'none' })
      },
    })
  }
  else {
    uni.reLaunch({
      url: target,
      success: () => {
        tabbarStore.setCurIdx(index)
      },
      fail: (error) => {
        console.warn('[tabbar] reLaunch fail:', error)
        tabbarStore.setCurIdx(prevIdx)
        uni.showToast({ title: '页面跳转失败', icon: 'none' })
      },
    })
  }
}
// #ifndef MP-WEIXIN || MP-ALIPAY
// 因为有了 custom:true， 微信里面不需要多余的hide操作
onLoad(() => {
  // 解决原生 tabBar 未隐藏导致有2个 tabBar 的问题
  needHideNativeTabbar
  && uni.hideTabBar({
    fail(err) {
      console.log('hideTabBar fail: ', err)
    },
    success(res) {
      // console.log('hideTabBar success: ', res)
    },
  })
})
// #endif

// #ifdef MP-ALIPAY
onMounted(() => {
  // 解决支付宝自定义tabbar 未隐藏导致有2个 tabBar 的问题; 注意支付宝很特别，需要在 onMounted 钩子调用
  customTabbarEnable // 另外，支付宝里面，只要是 customTabbar 都需要隐藏
  && uni.hideTabBar({
    fail(err) {
      console.log('hideTabBar fail: ', err)
    },
    success(res) {
      // console.log('hideTabBar success: ', res)
    },
  })
})
// #endif
function isActiveIndex(index: number) {
  return tabbarStore.curIdx === index
}

function getImageByIndex(index: number, item: CustomTabBarItem) {
  if (!item.iconActive) {
    console.warn('image 模式下，需要配置 iconActive (高亮时的图片），否则无法切换高亮图片')
    return item.icon
  }
  return tabbarStore.curIdx === index ? item.iconActive : item.icon
}

function getIconColor(index: number) {
  return isActiveIndex(index) ? '#A0D4C4' : '#FCFBFA'
}
</script>

<template>
  <view v-if="customTabbarEnable" class="fg-tabbar" @touchmove.stop.prevent>
    <view class="fg-tabbar__container">
      <view
        v-for="(item, index) in tabbarList"
        :key="index"
        class="fg-tabbar__item"
        :class="{ 'fg-tabbar__item--active': isActiveIndex(index) }"
        @click="handleClick(index)"
      >
        <view class="fg-tabbar__icon-wrapper">
          <template v-if="item.iconType === 'uiLib'">
            <wd-icon
              :name="item.icon"
              size="28px"
              :style="{ color: getIconColor(index) }"
              custom-class="fg-tabbar__icon"
            />
          </template>
          <template v-if="item.iconType === 'unocss' || item.iconType === 'iconfont'">
            <view :class="item.icon" class="fg-tabbar__icon" :style="{ color: getIconColor(index) }" />
          </template>
          <template v-if="item.iconType === 'image'">
            <image :src="getImageByIndex(index, item)" mode="scaleToFill" class="fg-tabbar__image" />
          </template>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.fg-tabbar {
  position: fixed;
  left: 32rpx;
  right: 32rpx;
  bottom: calc(env(safe-area-inset-bottom) + 32rpx);
  z-index: 999;
}

.fg-tabbar__container {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 24rpx 40rpx;
  border-radius: 48rpx;
  background: #161823;
  color: #fcfbfa;
  box-shadow: 0 18rpx 36rpx rgba(22, 24, 35, 0.16);
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  overflow: visible;
}

.fg-tabbar__item {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fcfbfa;
  transition: transform 0.2s ease, color 0.2s ease;
}

.fg-tabbar__icon-wrapper {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fg-tabbar__item--active {
  transform: scale(1.12);
  color: #a0d4c4;
}

.fg-tabbar__icon {
  font-size: 28px;
  line-height: 1;
}

.fg-tabbar__image {
  width: 48rpx;
  height: 48rpx;
}
</style>
