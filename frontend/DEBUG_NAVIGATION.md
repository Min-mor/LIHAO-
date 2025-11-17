# 页面导航问题排查指南

## 🐛 问题现象

1. **点击"确认"后页面刷新而不是返回提交页**
2. **返回按钮有时失灵**
3. **整个页面缓存机制有问题**

---

## 🔍 根本原因分析

### 1. **页面栈问题**

当从 A 页面跳转到 B 页面时，uni-app 会将页面压入栈中：
```
[提交页] -> [选择乘客页]
```

正常情况下，`uni.navigateBack()` 会弹出当前页面并返回上一页。但可能出现：
- 页面栈被清空（使用了 `reLaunch` 或 `redirectTo`）
- 页面不在预期的栈位置
- 页面已被销毁

### 2. **事件冒泡导致重复触发**

```vue
<!-- 错误示例 -->
<view @click="selectPassenger">
  <view @click="toggleCheckbox">  <!-- 点击会同时触发两个事件 -->
    <checkbox />
  </view>
</view>

<!-- 正确示例 -->
<view @click="selectPassenger">
  <view @click.stop="toggleCheckbox">  <!-- .stop 阻止冒泡 -->
    <checkbox />
  </view>
</view>
```

### 3. **uni-app 页面生命周期**

```
onLoad -> onShow -> onReady -> onHide -> onUnload
```

如果在 `onLoad` 中执行导航，可能导致页面未完全初始化就被销毁。

---

## ✅ 已实施的修复

### 1. **优化导航逻辑** (`select.vue`)

```typescript
function confirm() {
  const list = saved.value.filter(p => checked.value.includes(p.id))
  store.setPassengers(list)
  
  // 返回上一页
  uni.navigateBack({
    delta: 1,
    fail: (err) => {
      console.error('返回失败：', err)
      // 降级方案：直接跳转到提交页
      uni.redirectTo({
        url: '/pages/ticket/submit',
      })
    },
  })
}
```

**关键点**：
- ✅ 明确指定 `delta: 1`
- ✅ 添加失败回调
- ✅ 提供 `redirectTo` 降级方案
- ✅ 清理冗余日志

### 2. **防止事件冒泡**

```vue
<!-- 编辑图标 -->
<view class="passenger-left" @click.stop="showActions(p)">
  <wd-icon name="edit" />
</view>

<!-- 复选框 -->
<wd-checkbox @click.stop="toggle(p.id)" />
```

### 3. **清理 ActionSheet 关闭逻辑**

```typescript
function handleAction(detail: any) {
  if (actionName === '编辑') {
    uni.navigateTo({ url: `/pages/ticket/passenger/add?id=${...}` })
    showActionSheet.value = false  // 立即关闭
    currentPassenger.value = null
  }
  else if (actionName === '删除') {
    const passengerToDelete = currentPassenger.value  // 保存引用
    showActionSheet.value = false  // 先关闭 ActionSheet
    
    uni.showModal({
      success: (res) => {
        if (res.confirm) {
          store.removeSavedPassenger(passengerToDelete.id)  // 使用保存的引用
        }
      },
      complete: () => {
        currentPassenger.value = null  // 最后清空
      },
    })
  }
}
```

---

## 🔧 调试工具

### 1. **检查页面栈**

在任意页面添加：

```typescript
function debugPageStack() {
  const pages = getCurrentPages()
  console.log('=== 页面栈信息 ===')
  console.log('栈深度：', pages.length)
  pages.forEach((page, index) => {
    console.log(`[${index}] ${page.route}`)
  })
  console.log('当前页：', pages[pages.length - 1].route)
}

// 在关键位置调用
onLoad(() => {
  debugPageStack()
})

function confirm() {
  debugPageStack()
  // ...
}
```

### 2. **监听导航事件**

```typescript
// 页面显示时
onShow(() => {
  console.log(`[${Date.now()}] 页面显示`)
})

// 页面隐藏时
onHide(() => {
  console.log(`[${Date.now()}] 页面隐藏`)
})

// 页面卸载时
onUnload(() => {
  console.log(`[${Date.now()}] 页面卸载`)
})
```

### 3. **监听返回事件**

```typescript
// #ifdef H5
window.addEventListener('popstate', () => {
  console.log('浏览器返回按钮被点击')
})
// #endif

// #ifdef MP-WEIXIN
onBackPress(() => {
  console.log('小程序返回按钮被点击')
  return false  // 返回 true 可以阻止返回
})
// #endif
```

---

## 🚨 常见错误场景

### 场景 1：多次点击导致重复导航

**问题**：
```typescript
function confirm() {
  uni.navigateBack()
  uni.navigateBack()  // 重复调用
}
```

**解决**：
```typescript
let isNavigating = false

function confirm() {
  if (isNavigating) return
  
  isNavigating = true
  
  uni.navigateBack({
    complete: () => {
      setTimeout(() => {
        isNavigating = false
      }, 300)
    },
  })
}
```

### 场景 2：在异步操作中导航

**问题**：
```typescript
async function confirm() {
  await saveData()  // 异步操作期间页面可能被销毁
  uni.navigateBack()
}
```

**解决**：
```typescript
async function confirm() {
  try {
    await saveData()
    
    // 检查页面是否还存在
    const pages = getCurrentPages()
    if (pages.length > 0) {
      uni.navigateBack()
    }
  }
  catch (error) {
    console.error('保存失败：', error)
  }
}
```

### 场景 3：页面栈被意外清空

**问题**：
```typescript
// 在某处使用了 reLaunch
uni.reLaunch({ url: '/pages/home/index' })

// 导致页面栈变成：
// [首页]  <- 只剩一个页面，无法 navigateBack
```

**解决**：
- 检查是否有地方使用了 `reLaunch` 或 `redirectTo`
- 使用 `navigateTo` 保持页面栈

---

## 📋 最佳实践

### 1. **统一导航管理**

创建 `src/utils/navigation.ts`：

```typescript
export class NavigationHelper {
  private static isNavigating = false
  
  static async goBack(options?: UniApp.NavigateBackOptions) {
    if (this.isNavigating) {
      console.warn('正在导航中，忽略重复请求')
      return
    }
    
    this.isNavigating = true
    
    return new Promise<void>((resolve, reject) => {
      uni.navigateBack({
        ...options,
        success: () => {
          console.log('返回成功')
          resolve()
        },
        fail: (err) => {
          console.error('返回失败：', err)
          reject(err)
        },
        complete: () => {
          setTimeout(() => {
            this.isNavigating = false
          }, 300)
        },
      })
    })
  }
  
  static checkCanGoBack(): boolean {
    const pages = getCurrentPages()
    return pages.length > 1
  }
}
```

### 2. **使用事件总线同步状态**

```typescript
// utils/eventBus.ts
export const EventBus = {
  emit(event: string, data?: any) {
    uni.$emit(event, data)
  },
  
  on(event: string, callback: (data: any) => void) {
    uni.$on(event, callback)
  },
  
  off(event: string, callback?: (data: any) => void) {
    uni.$off(event, callback)
  },
}

// select.vue
function confirm() {
  store.setPassengers(list)
  EventBus.emit('passengersUpdated', list)
  uni.navigateBack()
}

// submit.vue
onShow(() => {
  EventBus.on('passengersUpdated', (list) => {
    console.log('乘客列表已更新')
    // 刷新UI
  })
})

onUnload(() => {
  EventBus.off('passengersUpdated')
})
```

### 3. **页面防抖处理**

```typescript
import { debounce } from 'lodash-es'

// 防抖版本的确认按钮
const confirm = debounce(() => {
  const list = saved.value.filter(p => checked.value.includes(p.id))
  store.setPassengers(list)
  uni.navigateBack()
}, 300, { leading: true, trailing: false })
```

---

## 🎯 测试检查清单

测试时按以下顺序验证：

- [ ] **正常流程**：提交页 → 选择乘客 → 点击确认 → 返回提交页
- [ ] **快速点击**：连续点击"确认"按钮，只触发一次导航
- [ ] **页面栈深度**：检查 getCurrentPages() 数量是否正常
- [ ] **编辑乘客**：点击编辑图标 → 编辑页面 → 保存 → 返回列表页
- [ ] **删除乘客**：点击编辑图标 → 删除 → 确认 → 列表刷新
- [ ] **登录拦截**：未登录时跳转到登录页，登录后返回原页面
- [ ] **网络错误**：模拟网络失败，检查错误提示
- [ ] **浏览器返回**（H5）：点击浏览器返回按钮，页面正常返回
- [ ] **小程序返回**（小程序）：点击左上角返回，页面正常返回

---

## 📞 如果问题仍然存在

### 1. 收集日志信息

```typescript
// 在 confirm() 前后添加
console.log('=== 点击确认前 ===')
console.log('当前页面栈：', getCurrentPages().map(p => p.route))
console.log('选中的乘客：', checked.value)

// ...导航逻辑

console.log('=== 导航触发后 ===')
```

### 2. 检查 pages.json 配置

确认页面配置正确：

```json
{
  "path": "pages/ticket/passenger/select",
  "style": {
    "navigationStyle": "custom"
  }
}
```

### 3. 清除缓存

- 开发工具：清除缓存 → 重新编译
- H5：清除浏览器缓存 → 硬刷新（Ctrl+Shift+R）
- 小程序：删除小程序 → 重新打开

### 4. 检查 store 持久化

如果使用了 pinia-plugin-persistedstate：

```typescript
export const useTicketStore = defineStore('ticket', {
  // ...
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'ticket-store',
        storage: {
          getItem: (key) => uni.getStorageSync(key),
          setItem: (key, value) => uni.setStorageSync(key, value),
        },
      },
    ],
  },
})
```

---

## 🔗 相关资源

- [uni-app 路由与页面跳转](https://uniapp.dcloud.net.cn/api/router.html)
- [页面生命周期](https://uniapp.dcloud.net.cn/tutorial/page.html#lifecycle)
- [页面通讯](https://uniapp.dcloud.net.cn/api/window/communication.html)
