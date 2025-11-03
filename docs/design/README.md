# 设计稿索引

## 低保真原型
- 首页：`draw/首页.png`
- 行程：`draw/行程.png`
- 个人中心：`draw/个人.png`
- 社区：`draw/社区.png`
- 心动模式：`draw/心动模式.png`

## 记录规范
- 每次迭代请更新交互要点与组件清单，确保与 `frontend/TODO.md` 同步。
- 颜色与字体需遵循 `frontend/README.md` 中的设计规范。

## 演示页面清单（2025-10-15）
- `src/pages/home/index.vue`：首页骨架（待 Phase 1 实现）。
- `src/pages/product/index.vue`：产品详情/列表骨架。
- `src/pages/order/index.vue`：订单流程骨架。
- `src/pages/profile/index.vue`：个人中心骨架。

## 交互与组件要点（依据 `draw/*.png`）

### 首页（`draw/首页.png`）
- **信息结构**：顶部沉浸式 banner、下方城市标签滑动区、分区列表（本周精选、心动体验等）。
- **关键交互**：
  - 城市标签横向滚动，点击后过滤推荐卡片；需记录当前选中城市状态。
  - Banner 主按钮触发“心动模式”或快速下单流程；需要突出主 CTA。
  - 推荐卡片支持左右滑动或瀑布流布局，卡片点击进入 `product/index`。
- **组件映射**：
  - `HeroBanner`（自定义）+ `CityTabs`（横向滚动标签）+ `ProductCard`（复用产品页组件）。
  - 底部自定义 `tabbar` 保持 Safe Area padding。

### 行程页（`draw/行程.png`）
- **信息结构**：行程时间轴、日程卡片、操作面板（修改、取消、联系客服）。
- **关键交互**：
  - 顶部日期选择/切换未来行程，需与行程数据联动。
  - 时间轴节点点击展开详情；支持滚动定位当前日期位置。
  - CTA（分享、下载行程单）弹出底部操作表。
- **组件映射**：
  - `ItineraryTimeline`（纵向步进器）+ `ActionSheet`（Wot UI / 自定义）+ `StickyActionBar`（底部按钮）。

### 个人中心（`draw/个人.png`）
- **信息结构**：顶部用户信息卡、积分/优惠入口、功能九宫格、最近订单。
- **关键交互**：
  - 用户头像区域支持上传/编辑；未登录状态展示登录入口。
  - 功能入口（订单、收藏、客服等）点击跳转至对应页面。
  - 底部“心动模式设置”“安全中心”等列表项采用统一 Cell 组件。
- **组件映射**：
  - `UserCard` + `GridMenu`（Wot UI `wd-grid`）+ `ListCell`（封装）。

### 社区页（`draw/社区.png`）
- **信息结构**：推荐帖子瀑布流、顶部导航（关注/发现）、发布按钮。
- **关键交互**：
  - 顶部 Tab 切换内容源；需支持吸顶效果。
  - 帖子卡片包含封面、标题、作者、互动数；点击进入帖子详情。
  - “+” 发布按钮浮动于页面右下角，点击弹出发布类型选择。
- **组件映射**：
  - `StickyTabs` + `WaterfallCard`（支持图片比例）+ `FloatingActionButton`。

### 心动模式（`draw/心动模式.png`）
- **信息结构**：分步骤问卷（出行偏好、预算、氛围等），结果预览卡片。
- **关键交互**：
  - 步骤指示器（Stepper）引导用户完成问卷，每步提交后进入下一项。
  - 选项多为卡片单选/多选，需提供视觉反馈与下一步按钮。
  - 完成后跳转推荐列表（可重用首页卡片组件）或展示匹配总结。
- **组件映射**：
  - `Stepper`/`ProgressBar` + `OptionCard` 组合 + `ResultPreview`。

### 设计执行提醒
- Safe Area：所有底部按钮、Tabbar、浮动控件需使用 `env(safe-area-inset-bottom)` 与 `safeAreaInsets` 调整。
- 配色：继续沿用 `frontend/README.md` 设定的浅色/深色方案；强调主引导色 `#325947` 与 `#A0D4C4`。
- 字体：全局采用 Noto Serif，注意标题字号层级与字重（待 Phase 1 落地时补充具体变量）。
