# ArticleCard 组件使用指南

## 📦 组件位置
`src/components/common/ArticleCard.vue`

## 🎨 设计特性
- ✅ 小红书风格竖版卡片
- ✅ 3:4 封面比例
- ✅ 作者信息（头像 + 名字 + 认证标识）
- ✅ 可交互点赞（独立事件，不触发卡片点击）
- ✅ 流式/瀑布流布局适配
- ✅ 符合项目配色规范（荷花、松石绿、漆黑、米白）

## 📋 Props 接口

```typescript
interface ArticleCardProps {
  id: string              // 必填：文章ID
  cover: string           // 必填：封面图URL
  title: string           // 必填：标题
  authorName: string      // 必填：作者名称
  authorAvatar: string    // 必填：作者头像URL
  likes: number           // 必填：点赞数
  isLiked?: boolean       // 可选：是否已点赞（默认false）
  verified?: boolean      // 可选：作者是否认证
  location?: string       // 可选：位置信息
}
```

## 🎯 Events

```typescript
@click    // 卡片点击事件：(id: string) => void
@like     // 点赞事件：(id: string, isLiked: boolean) => void
```

---

## 📖 使用示例

### 1️⃣ 社区页（已集成）

**文件**：`src/pages/community/index.vue`

```vue
<script setup lang="ts">
import ArticleCard from '@/components/common/ArticleCard.vue'

function handleCardClick(id: string) {
  uni.navigateTo({ url: `/pages/community-detail/index?id=${id}` })
}

function handleCardLike(id: string, shouldLike: boolean) {
  ensureLogin(() => {
    const item = posts.value.find(post => post.id === id)
    if (!item) return
    
    item.isLiked = shouldLike
    item.stats.likes += shouldLike ? 1 : -1
  })
}
</script>

<template>
  <view class="community__grid">
    <ArticleCard
      v-for="item in posts"
      :key="item.id"
      :id="item.id"
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
</template>

<style lang="scss" scoped>
.community__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}
</style>
```

---

### 2️⃣ 收藏页集成示例

**文件**：`src/pages/profile/index.vue`

#### 步骤 1：引入组件

```typescript
import ArticleCard from '@/components/common/ArticleCard.vue'
```

#### 步骤 2：准备数据适配器

```typescript
// 将现有的 favoriteCards 转换为 ArticleCard 需要的格式
const articleCardData = computed(() => {
  return favoriteCards.value.map(card => ({
    id: card.id,
    cover: card.cover,
    title: card.title,
    // 假设有作者信息，如果没有可以使用默认值
    authorName: '匿名用户',
    authorAvatar: '/static/images/default-avatar.png',
    likes: 0, // 收藏卡片可能没有点赞数据
    isLiked: false,
  }))
})
```

#### 步骤 3：替换模板

```vue
<template>
  <!-- 旧代码 -->
  <!-- <view class="profile__favorite-grid">
    <view v-for="card in favoriteCards" class="profile__favorite-card">
      <image :src="card.cover" />
      <view class="profile__favorite-title">{{ card.title }}</view>
    </view>
  </view> -->

  <!-- 新代码 -->
  <view class="profile__favorite-grid">
    <ArticleCard
      v-for="card in articleCardData"
      :key="card.id"
      :id="card.id"
      :cover="card.cover"
      :title="card.title"
      :author-name="card.authorName"
      :author-avatar="card.authorAvatar"
      :likes="card.likes"
      :is-liked="card.isLiked"
      @click="handleFavoriteDetail"
      @like="handleFavoriteLike"
    />
  </view>
</template>
```

#### 步骤 4：样式保持不变

```scss
.profile__favorite-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24rpx;
}
```

---

### 3️⃣ 足迹页集成示例

**文件**：`src/pages/profile/index.vue`（足迹 Tab）

```vue
<script setup lang="ts">
// 将足迹数据转换为 ArticleCard 格式
const footprintCards = computed(() => {
  return footprintList.value.map(item => ({
    id: item.id,
    cover: item.media[0] || '/static/images/placeholder.png',
    title: item.title,
    authorName: userInfo.value.nickname,
    authorAvatar: userInfo.value.avatar,
    likes: item.likes || 0,
    isLiked: false,
    location: item.destination,
  }))
})

function handleFootprintClick(id: string) {
  uni.navigateTo({ url: `/pages/community-detail/index?id=${id}` })
}
</script>

<template>
  <view class="footprint__grid">
    <ArticleCard
      v-for="card in footprintCards"
      :key="card.id"
      :id="card.id"
      :cover="card.cover"
      :title="card.title"
      :author-name="card.authorName"
      :author-avatar="card.authorAvatar"
      :likes="card.likes"
      :is-liked="card.isLiked"
      :location="card.location"
      @click="handleFootprintClick"
      @like="handleFootprintLike"
    />
  </view>
</template>

<style lang="scss">
.footprint__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}
</style>
```

---

### 4️⃣ 话题页集成示例

**文件**：`src/pages/profile/index.vue`（话题 Tab）

```vue
<script setup lang="ts">
const topicCards = computed(() => {
  return topicList.value.map(item => ({
    id: item.id,
    cover: item.attachments[0] || '/static/images/placeholder.png',
    title: item.content.slice(0, 50), // 截取部分内容作为标题
    authorName: userInfo.value.nickname,
    authorAvatar: userInfo.value.avatar,
    likes: item.likes,
    isLiked: false,
    location: item.location,
  }))
})
</script>

<template>
  <view class="topic__grid">
    <ArticleCard
      v-for="card in topicCards"
      :key="card.id"
      v-bind="card"
      @click="handleTopicClick"
      @like="handleTopicLike"
    />
  </view>
</template>

<style lang="scss">
.topic__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}
</style>
```

---

## 🎨 配色说明

组件严格遵循项目配色规范（`README.md`）：

| 元素 | 颜色 | 用途 |
|------|------|------|
| 卡片背景 | 荷花混合米白 `#fbede0 + #ffffff` | 柔和通透 |
| 标题文字 | 漆黑 `#161823` | 高对比度可读性 |
| 作者名字 | 灰 `rgba(#2b2b2b, 0.65)` | 次要信息 |
| 点赞激活 | 松石绿 `#325947` | 主引导色 |
| 认证标识 | 松石绿半透明 `rgba(#325947, 0.72)` | 品牌色点缀 |

---

## ⚡ 性能优化建议

### 1. 图片懒加载（uni-app 自带）
```vue
<ArticleCard
  :cover="item.cover"
  lazy-load
/>
```

### 2. 虚拟列表（长列表场景）
```bash
# 安装 uni-ui 的 recycle-view
npm install @dcloudio/uni-ui
```

### 3. 防抖点赞（避免频繁请求）
```typescript
import { debounce } from 'lodash-es'

const handleCardLike = debounce((id: string, shouldLike: boolean) => {
  // 点赞逻辑
}, 300)
```

---

## 🐛 常见问题

### Q1: 点赞图标点击无反应？
**A**: 检查是否正确传递 `@like` 事件，组件内部使用 `@click.stop` 阻止冒泡。

### Q2: 卡片高度不一致？
**A**: 这是正常现象，标题长度不同导致。如需统一高度，可设置 CSS：
```scss
.article-card__title {
  min-height: 80rpx; // 固定两行高度
}
```

### Q3: 如何适配瀑布流？
**A**: 使用第三方库如 `mescroll-uni` 或自行实现：
```scss
.waterfall-grid {
  column-count: 2;
  column-gap: 20rpx;
  
  .article-card {
    break-inside: avoid;
    margin-bottom: 20rpx;
  }
}
```

---

## 🔧 自定义扩展

### 添加新的 Props
编辑 `ArticleCard.vue`：

```typescript
interface ArticleCardProps {
  // ... 现有 props
  badge?: string // 新增角标
  tags?: string[] // 新增标签
}
```

### 添加新的事件
```typescript
const emit = defineEmits<{
  click: [id: string]
  like: [id: string, isLiked: boolean]
  share: [id: string] // 新增分享事件
}>()
```

---

## 📌 设计原则

1. **单一职责**：组件只负责展示和基础交互，业务逻辑由父组件处理
2. **数据适配**：不同数据源通过 computed 转换为统一格式
3. **事件上抛**：所有交互通过 emit 传递给父组件
4. **样式隔离**：使用 scoped 避免污染全局样式
5. **可访问性**：保留语义化标签和合理的点击区域

---

## 🚀 后续计划

- [ ] 支持视频封面（带播放按钮）
- [ ] 支持多图封面（轮播或拼接）
- [ ] 支持骨架屏加载态
- [ ] 支持长按操作菜单
- [ ] 深色模式适配

---

## 📝 更新日志

### v1.0.0 (2025-11-16)
- ✅ 初始版本
- ✅ 支持基础卡片展示
- ✅ 支持点赞交互
- ✅ 支持作者信息展示
- ✅ 流式布局适配
