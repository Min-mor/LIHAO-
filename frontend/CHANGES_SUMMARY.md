# 乘客管理模块完整改造总结

## 📅 更新日期：2025年11月16日

---

## 🎯 解决的核心问题

### 1. **页面导航异常**
- ❌ 点击"确认"后页面刷新而不是返回提交页
- ❌ 返回按钮有时失灵
- ✅ 优化了 `uni.navigateBack()` 逻辑，添加失败降级方案

### 2. **缺少 API 层**
- ❌ 乘客数据直接存储在 Pinia，没有后端 API
- ✅ 完整实现了 API/Mock/Service 三层架构

### 3. **事件冒泡问题**
- ❌ 编辑按钮和复选框事件冲突
- ✅ 使用 `.stop` 修饰符阻止事件冒泡

### 4. **ActionSheet 参数解析**
- ❌ `@select` 事件参数格式不明确导致功能失效
- ✅ 兼容多种参数格式（对象/索引）

---

## 📂 新增文件清单

### 1. 类型定义
```
src/api/types/passenger.ts
```
- `PassengerInfo` - 乘客信息接口
- `PassengerType` - 乘客类型枚举
- 所有请求/响应类型定义

### 2. API 层
```
src/api/passenger.ts
```
- `getPassengers()` - 获取乘客列表
- `savePassenger()` - 保存乘客（新增/更新）
- `deletePassenger()` - 删除乘客

### 3. Mock 数据层
```
src/mock/data/passengers.ts
```
- `getPassengersByUserId()` - 按用户获取乘客
- `savePassenger()` - 保存到内存数据库
- `deletePassenger()` - 从内存删除
- 支持多用户数据隔离

### 4. Mock API
```
src/mock/passenger.ts
```
- `mockGetPassengers()` - 模拟获取
- `mockSavePassenger()` - 模拟保存
- `mockDeletePassenger()` - 模拟删除
- 自动验证登录状态

### 5. Service 层
```
src/service/passenger.ts
```
- 统一的业务逻辑入口
- 开发环境自动使用 Mock
- 生产环境调用真实 API

### 6. 文档
```
PASSENGER_API_GUIDE.md - API 集成指南
DEBUG_NAVIGATION.md - 页面导航调试指南
CHANGES_SUMMARY.md - 本文件
```

---

## 🔄 修改的现有文件

### 1. `src/pages/ticket/passenger/select.vue`

#### 修改点：
1. **优化导航逻辑**
```typescript
// 之前
function confirm() {
  store.setPassengers(list)
  uni.navigateBack()
}

// 之后
function confirm() {
  const list = saved.value.filter(p => checked.value.includes(p.id))
  store.setPassengers(list)
  
  uni.navigateBack({
    delta: 1,
    fail: (err) => {
      console.error('返回失败：', err)
      uni.redirectTo({ url: '/pages/ticket/submit' })
    },
  })
}
```

2. **修复 ActionSheet 参数解析**
```typescript
function handleAction(detail: any) {
  let actionName = ''
  
  // 兼容对象和索引两种格式
  if (detail && typeof detail === 'object') {
    actionName = detail.item?.name || detail.name || ''
    const actionIndex = detail.index !== undefined ? detail.index : -1
    if (!actionName && actionIndex === 0) actionName = '编辑'
    if (!actionName && actionIndex === 1) actionName = '删除'
  }
  else if (typeof detail === 'number') {
    if (detail === 0) actionName = '编辑'
    if (detail === 1) actionName = '删除'
  }
  
  // ... 处理编辑和删除
}
```

3. **优化删除逻辑**
```typescript
// 先保存引用，避免提前清空
const passengerToDelete = currentPassenger.value
showActionSheet.value = false

uni.showModal({
  success: (res) => {
    if (res.confirm) {
      store.removeSavedPassenger(passengerToDelete.id)
    }
  },
  complete: () => {
    currentPassenger.value = null
  },
})
```

4. **清理导航配置**
```typescript
// 移除多余的 navigationBarTitleText
definePage({ style: { navigationStyle: 'custom' } })
```

### 2. `src/pages/ticket/passenger/add.vue`

#### 修改点：
1. **清理导航配置**
```typescript
definePage({ style: { navigationStyle: 'custom' } })
```

---

## 🏗️ 架构设计

### 分层架构

```
┌─────────────────────────────────────────┐
│            Vue 组件层                     │
│  (select.vue, add.vue, submit.vue)      │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│          Pinia Store 层                  │
│        (ticket.ts - 状态管理)            │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│         Service 业务层                   │
│   (passenger.ts - 环境切换逻辑)          │
└────────────┬────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
┌─────▼─────┐ ┌────▼────────┐
│  Mock API │ │  真实 API    │
│ (DEV 环境) │ │ (PROD 环境)  │
└─────┬─────┘ └────┬────────┘
      │             │
┌─────▼─────┐ ┌────▼────────┐
│ Mock 数据  │ │  后端服务    │
│  (内存)    │ │   (REST)    │
└───────────┘ └─────────────┘
```

### 数据流

#### 获取乘客列表
```
1. 组件调用: store.loadSavedPassengers()
2. Store 调用: getPassengers()
3. Service 判断环境:
   - DEV → mockGetPassengers()
   - PROD → apiGetPassengers()
4. Mock 从内存读取
5. 返回数据到组件
```

#### 保存乘客
```
1. 组件调用: store.addSavedPassenger(data)
2. Store 调用: savePassenger(data)
3. Service 判断环境:
   - DEV → mockSavePassenger()
   - PROD → apiSavePassenger()
4. Mock 写入内存
5. 显示成功提示
6. 返回上一页
```

---

## 🔑 关键技术点

### 1. **TypeScript 类型安全**

```typescript
// 完整的类型定义
export interface PassengerInfo {
  id: string
  name: string
  type: PassengerType
  idType?: string
  idNo?: string
  phone?: string
}

// 请求和响应分离
export interface SavePassengerReq extends Omit<PassengerInfo, 'id'> {
  id?: string  // 更新时才需要
}

export interface SavePassengerRes {
  passenger: PassengerInfo
}
```

### 2. **环境切换**

```typescript
// service 层自动判断
export async function savePassenger(params: SavePassengerReq): Promise<PassengerInfo> {
  if (import.meta.env.DEV) {
    const res = await mockSavePassenger(params)
    return res.passenger
  }

  const res = await apiSavePassenger(params)
  return res.passenger
}
```

### 3. **用户数据隔离**

```typescript
// Mock 层按用户ID存储
const passengerDatabase: Record<number, PassengerInfo[]> = {}

export function getPassengersByUserId(userId: number): PassengerInfo[] {
  return passengerDatabase[userId] || []
}
```

### 4. **错误处理**

```typescript
async function addSavedPassenger(p: SavePassengerReq) {
  try {
    const passenger = await savePassenger(p)
    uni.showToast({ title: '保存成功', icon: 'success' })
    return passenger.id
  }
  catch (error) {
    uni.showToast({ title: '保存失败', icon: 'none' })
    throw error
  }
}
```

---

## 📊 集成方式对比

### 方案 A：完全替换 Pinia 本地存储（推荐）

**优点**：
- ✅ 数据来源单一，与后端保持一致
- ✅ 避免数据同步问题
- ✅ 简化状态管理

**缺点**：
- ❌ 每次都需要请求 API
- ❌ 网络依赖性强

**适用场景**：
- 生产环境
- 需要实时数据
- 多端同步需求

### 方案 B：保留 Pinia 作为缓存

**优点**：
- ✅ 减少网络请求
- ✅ 提升加载速度
- ✅ 支持离线访问

**缺点**：
- ❌ 需要维护缓存同步逻辑
- ❌ 可能出现数据不一致

**适用场景**：
- 开发调试
- 弱网环境
- 性能优化需求

---

## 🚀 下一步工作

### 立即需要

1. **集成到 Pinia Store**
   - [ ] 选择集成方案（A 或 B）
   - [ ] 修改 `src/store/ticket.ts`
   - [ ] 更新页面组件调用

2. **测试验证**
   - [ ] 添加乘客功能
   - [ ] 编辑乘客功能
   - [ ] 删除乘客功能
   - [ ] 用户数据隔离
   - [ ] 页面导航流程

3. **清理工作**
   - [ ] 移除调试日志
   - [ ] 删除临时代码
   - [ ] 更新注释文档

### 后端对接时

1. **修改 API 地址**
   ```typescript
   // src/api/passenger.ts
   export function getPassengers(data?: GetPassengersReq) {
     return httpGet<GetPassengersRes>('/api/v1/passengers', data)
     //                                ^^^^^^^^^^^^^^^^^^^^
     //                                修改为真实的后端地址
   }
   ```

2. **调整响应格式**
   ```typescript
   // 根据后端实际返回格式调整类型定义
   export interface GetPassengersRes {
     code: number
     message: string
     data: {
       passengers: PassengerInfo[]
     }
   }
   ```

3. **移除 Mock**
   ```typescript
   // service/passenger.ts
   export async function getPassengers() {
     // 直接调用 API，移除环境判断
     const res = await apiGetPassengers()
     return res.passengers
   }
   ```

### 优化建议

1. **添加缓存策略**
   - 使用 LRU 缓存减少网络请求
   - 设置缓存过期时间

2. **添加乐观更新**
   - 先更新 UI，后台同步 API
   - 失败时回滚

3. **添加加载状态**
   - 骨架屏
   - 加载指示器

4. **错误重试机制**
   - 网络失败自动重试
   - 指数退避策略

---

## 📚 参考文档

- [PASSENGER_API_GUIDE.md](./PASSENGER_API_GUIDE.md) - API 集成详细指南
- [DEBUG_NAVIGATION.md](./DEBUG_NAVIGATION.md) - 页面导航调试指南
- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [Pinia 官方文档](https://pinia.vuejs.org/)

---

## 💡 常见问题

### Q1: TypeScript 报错找不到模块？
**A**: 重启 VSCode 或运行 `pnpm dev`，让 TypeScript 重新扫描文件。

### Q2: Mock 数据没有生效？
**A**: 检查 `import.meta.env.DEV` 是否为 true，确认在开发环境。

### Q3: 删除乘客时报 "Cannot read properties of null"？
**A**: 已修复，使用局部变量保存乘客引用，避免提前清空。

### Q4: 点击确认后页面刷新？
**A**: 已添加 `navigateBack` 失败降级方案，检查控制台日志定位具体原因。

### Q5: 如何查看当前页面栈？
**A**: 使用 `getCurrentPages()` 查看，参考 [DEBUG_NAVIGATION.md](./DEBUG_NAVIGATION.md)。

---

## 👥 贡献者

- 主要开发：Cascade AI
- 需求提出：Lemorica
- 项目位置：`frontend/src/pages/ticket/passenger/`

---

## 📄 许可证

本项目遵循项目根目录的许可证。
