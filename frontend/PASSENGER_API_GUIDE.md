# 乘客管理 API 集成指南

## 📋 已完成的工作

###  1. **类型定义** (`src/api/types/passenger.ts`)
- `PassengerInfo`: 乘客信息接口
- `PassengerType`: 乘客类型（成人/儿童/学生）
- `GetPassengersReq/Res`: 获取乘客列表
- `SavePassengerReq/Res`: 保存乘客
- `DeletePassengerReq/Res`: 删除乘客

### 2. **Mock 数据层** (`src/mock/data/passengers.ts`)
- `getPassengersByUserId()`: 按用户ID获取乘客
- `savePassenger()`: 保存或更新乘客
- `deletePassenger()`: 删除乘客
- 支持多用户数据隔离

### 3. **Mock API** (`src/mock/passenger.ts`)
- `mockGetPassengers()`: 模拟获取乘客列表
- `mockSavePassenger()`: 模拟保存乘客
- `mockDeletePassenger()`: 模拟删除乘客
- 自动验证登录状态

### 4. **API 层** (`src/api/passenger.ts`)
- `getPassengers()`: 获取乘客列表
- `savePassenger()`: 保存乘客
- `deletePassenger()`: 删除乘客
- 使用 `httpGet` 和 `httpPost`

### 5. **Service 层** (`src/service/passenger.ts`)
- 统一的业务逻辑层
- 开发环境自动使用 mock
- 生产环境调用真实 API

### 6. **页面导航优化** (`src/pages/ticket/passenger/select.vue`)
- 添加详细的调试日志
- `navigateBack` 失败时降级到 `redirectTo`
- 明确的成功/失败回调

---

## 🔧 如何集成到 Pinia Store

### 方案 1：完全替换 Pinia 本地存储（推荐）

```typescript
// src/store/ticket.ts
import { getPassengers, savePassenger, deletePassenger } from '@/service/passenger'

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    // 移除本地 savedPassengers
    // savedPassengers: [] as PassengerInfo[],
    
    passengers: [] as PassengerInfo[],
    loadingPassengers: false,
  }),
  
  actions: {
    /**
     * 从服务器加载乘客列表
     */
    async loadSavedPassengers() {
      this.loadingPassengers = true
      try {
        const passengers = await getPassengers()
        // 不再需要 savedPassengers，直接使用 API 数据
        return passengers
      }
      catch (error) {
        console.error('加载乘客列表失败：', error)
        return []
      }
      finally {
        this.loadingPassengers = false
      }
    },
    
    /**
     * 添加或更新乘客
     */
    async addSavedPassenger(p: SavePassengerReq) {
      try {
        const passenger = await savePassenger(p)
        
        // 显示成功提示
        uni.showToast({
          title: p.id ? '修改成功！' : '添加成功！',
          icon: 'success',
          duration: 1500,
        })
        
        return passenger.id
      }
      catch (error) {
        uni.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000,
        })
        throw error
      }
    },
    
    /**
     * 删除乘客
     */
    async removeSavedPassenger(id: string) {
      try {
        await deletePassenger({ id })
        
        uni.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1500,
        })
      }
      catch (error) {
        uni.showToast({
          title: '删除失败',
          icon: 'none',
          duration: 2000,
        })
        throw error
      }
    },
  },
})
```

### 方案 2：保留 Pinia 作为缓存（性能优化）

```typescript
export const useTicketStore = defineStore('ticket', {
  state: () => ({
    savedPassengers: [] as PassengerInfo[],
    passengersLoaded: false,
  }),
  
  getters: {
    savedPassengersForCurrentUser(state): PassengerInfo[] {
      const userStore = useUserStore()
      const currentUserId = userStore.userInfo?.userId
      if (!currentUserId || currentUserId === -1)
        return []
      return state.savedPassengers.filter(p => p.userId === currentUserId)
    },
  },
  
  actions: {
    /**
     * 加载乘客列表（带缓存）
     */
    async loadSavedPassengers(forceRefresh = false) {
      if (this.passengersLoaded && !forceRefresh) {
        return this.savedPassengersForCurrentUser
      }
      
      try {
        const passengers = await getPassengers()
        this.savedPassengers = passengers
        this.passengersLoaded = true
        return passengers
      }
      catch (error) {
        console.error('加载乘客失败：', error)
        return []
      }
    },
    
    /**
     * 添加/更新乘客（更新本地缓存）
     */
    async addSavedPassenger(p: SavePassengerReq) {
      const passenger = await savePassenger(p)
      
      // 更新本地缓存
      const index = this.savedPassengers.findIndex(x => x.id === passenger.id)
      if (index !== -1) {
        this.savedPassengers[index] = passenger
      }
      else {
        this.savedPassengers.push(passenger)
      }
      
      return passenger.id
    },
    
    /**
     * 删除乘客（更新本地缓存）
     */
    async removeSavedPassenger(id: string) {
      await deletePassenger({ id })
      
      // 更新本地缓存
      this.savedPassengers = this.savedPassengers.filter(x => x.id !== id)
    },
  },
})
```

---

## 🚀 页面中的使用

### select.vue 页面

```vue
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { computed, ref } from 'vue'

const store = useTicketStore()
const saved = ref<PassengerInfo[]>([])
const loading = ref(false)

// 加载乘客列表
onLoad(async () => {
  loading.value = true
  try {
    saved.value = await store.loadSavedPassengers()
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <view v-if="loading">加载中...</view>
  <view v-else-if="saved.length === 0">暂无乘客</view>
  <view v-else v-for="p in saved" :key="p.id">
    {{ p.name }}
  </view>
</template>
```

### add.vue 页面

```vue
<script setup lang="ts">
async function confirm() {
  // 验证逻辑...
  
  try {
    await store.addSavedPassenger({
      id: editingId.value || undefined,
      name: trimmedName,
      type: type.value,
      idNo: trimmedIdNo,
      idType: idType.value,
      phone: trimmedPhone,
    })
    
    // 返回上一页
    uni.navigateBack()
  }
  catch (error) {
    // 错误已在 store 中处理
  }
}
</script>
```

---

## 🐛 页面导航问题排查

### 问题现象
- 点击"确认"后页面刷新而不是返回
- 返回按钮有时失灵

### 根本原因
1. **页面栈问题**：可能不在正确的导航栈中
2. **缓存机制**：uni-app 默认不缓存页面
3. **重复导航**：可能多次触发导航函数

### 解决方案

#### 1. 检查页面栈（调试用）
```typescript
function checkPageStack() {
  const pages = getCurrentPages()
  console.log('当前页面栈：', pages.map(p => p.route))
  console.log('页面栈深度：', pages.length)
}
```

#### 2. 确保单次导航
```typescript
let isNavigating = false

function confirm() {
  if (isNavigating) {
    console.log('正在导航，忽略重复点击')
    return
  }
  
  isNavigating = true
  
  // ... 业务逻辑
  
  uni.navigateBack({
    success: () => {
      isNavigating = false
    },
    fail: () => {
      isNavigating = false
    },
  })
}
```

#### 3. 使用事件总线通知刷新
```typescript
// select.vue 确认时
function confirm() {
  store.setPassengers(list)
  
  // 发送事件通知 submit 页面刷新
  uni.$emit('passengersUpdated', list)
  
  uni.navigateBack()
}

// submit.vue 监听事件
onShow(() => {
  uni.$on('passengersUpdated', (list) => {
    console.log('乘客列表已更新：', list)
    // 这里可以刷新UI
  })
})

onUnload(() => {
  uni.$off('passengersUpdated')
})
```

---

## 📝 后续建议

### 1. 清理调试日志
生产环境前移除 `console.log`：
```typescript
// 使用条件编译
// #ifdef  DEV
console.log('调试信息')
// #endif
```

### 2. 添加加载状态
```vue
<wd-button :loading="loading" @click="confirm">
  确认
</wd-button>
```

### 3. 错误边界处理
```typescript
try {
  await someAsyncOperation()
}
catch (error) {
  // 统一错误处理
  handleError(error)
}
```

### 4. 页面缓存优化
在 `pages.json` 中配置（如果需要）：
```json
{
  "path": "pages/ticket/submit",
  "style": {
    "navigationStyle": "custom",
    "disableScroll": false,
    "enablePullDownRefresh": true
  }
}
```

---

## ✅ 测试清单

- [ ] 登录后能正常加载乘客列表
- [ ] 添加新乘客成功
- [ ] 编辑乘客信息成功
- [ ] 删除乘客成功
- [ ] 未登录时显示登录提示
- [ ] 不同用户的乘客数据隔离
- [ ] 选择乘客后正确返回提交页
- [ ] 提交页显示选中的乘客
- [ ] 网络错误时有友好提示
- [ ] 多次快速点击不会重复提交

---

## 🔗 相关文件

- 类型定义：`src/api/types/passenger.ts`
- API 层：`src/api/passenger.ts`
- Service 层：`src/service/passenger.ts`
- Mock 数据：`src/mock/data/passengers.ts`
- Mock API：`src/mock/passenger.ts`
- Store：`src/store/ticket.ts`
- 页面：`src/pages/ticket/passenger/*.vue`
