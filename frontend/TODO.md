# Frontend TODO（Unibest 项目）

**优先级约定**
- (P0) 核心主线，必须优先完成
- (P1) 重要功能，排在 P0 之后跟进
- (P2) 中长期事项，按资源安排

## Phase 0 项目奠基
- [x] 按照仓库根目录 `README.md` 的分支流程创建个人开发分支并更新 `frontend/README.md` 版本记录。
- [x] 使用 context7 (`/unibest-tech/unibest-tech.github.io`) 获取最新（官网会自动更新）安装与目录约定文档，确认本地依赖、脚手架脚本及 `env/` 模板配置始终与官方同步。
- [x] 清点 `src/pages-fg/`、`src/pages-sub/` 等演示页面，清理不相关的文件。
- [x] 在 `docs/design/` 中补充最新草图索引，并在 `frontend/README.md` 标注小程序 Safe Area 适配策略。
- [x] 核对 `draw/首页.png`、`draw/行程.png`、`draw/个人.png`、`draw/社区.png`、`draw/心动模式.png` 等低保真稿，记录关键交互与组件清单。
- [x] 从上交镜像 `https://mirror.sjtu.edu.cn/google-fonts/` 下载 `Noto Serif` 子集，配置 H5 `@import` 与本地 `@font-face` fallback，并在小程序、App 端设置 `wx.loadFontFace` 或相对路径加载，更新 `frontend/README.md` 字体章节。

## Phase 1 游客端核心实现
- [x] 在 `src/pages/` 下新建 `home/`、`product/`、`order/`、`profile/` 目录并更新 `pages.config.ts`。
- [x] 使用 context7 (`/moonofweisheng/wot-design-uni`) 校验 `wd-input`、`wd-button`、`wd-swiper` 等组件，完成首页搜索框、交通按钮与卡片样式。
- [x] 首页完成：移除搜索框底线、统一“交通”命名、实现“交通”按钮跳转、`see more` 跳转及推荐页参数透传。
- [x] 新增 `pages/traffic/index`、`pages/more/index` 页面骨架并纳入导航；`pages/product/index` 调整为推荐页结构。
- [x] 对照 `draw/首页.png` 与最新色板，补充首页卡片细节、收藏态及底部导航交互，确保配色一致。
- [x] 重构 `pages/profile/index` 四大 Tab 卡片布局，启用纵向滚动与签名交互。
- [ ] (P0) 新增 `pages/login/index` 登录页，完成手机号/验证码登录流程并接入游客核心导航跳转。
- [ ] (P0) 新增 `pages/register/index` 注册页，与登录流程共用校验与协议组件。
- [ ] (P0) 登录/注册页细节完善：输入校验、协议勾选、错误提示与加载态，覆盖 H5/小程序双端适配。
- [ ] (P0) 实现首页搜索逻辑：绑定 `search` 接口（或 mock 数据），补齐搜索结果页跳转与空态文案。
- [ ] (P0) 补充交通页与查看更多页实际数据源对接（API 或高保真 mock），完善推荐页筛选逻辑与分页占位。
- [ ] (P0) 社区页作者详情：新增作者个人页，串联社区卡片跳转、关注/私信等交互占位。
- [ ] (P0) 新增设置相关页面骨架（账号安全、通知偏好等），串联个人页入口。
- [ ] (P1) 对接 Profile 页实际数据源，编写足迹/话题/订单收藏接口与测试。
- [ ] (P1) 在小程序 (WeChat) 端调试首页与下单流程，针对系统原生按钮遮挡问题设置 Safe Area 填充（如 `padding-bottom`、`safe-area-inset-bottom`）。
- [ ] (P1) 编写 Pinia store (`src/store/`) 和请求模块 (`src/service/`)，生成 API 类型后使用 Vitest 与 Cypress 编写测试。

## Phase 2 商家端控制台
- [ ] (P1) 建立 `src/pages/merchant/` 页面与 `merchantLayout.vue`，复用/更新 `tabbar/`、`router/`。
- [ ] (P1) 通过 context7 获取 Unibest 请求钩子与 UnoCSS 指南，完成店铺、产品、订单管理页面。
- [ ] (P1) 在微信小程序端验证列表页和操作按钮，记录 Safe Area 兼容方案。

## Phase 3 管理员后台
- [ ] (P2) 新增 `src/pages/admin/` 模块，扩展权限路由与 Pinia token 逻辑，保持 `frontend/README.md` 规范同步。
- [ ] (P2) 参考 context7 文档实现数据看板和审批流程，确保输入校验与安全处理。
- [ ] (P2) 小程序端检查弹窗/按钮遮挡情况，记录适配方案。

## Phase 4 集成与上线
- [ ] (P1) 使用 `pnpm generate:api`（如需）与 context7 指南校验 OpenAPI 生成配置；完成前后端联调并更新 `docs/tests/`。
- [ ] (P1) 运行多端打包脚本，重点测试小程序 Safe Area、胶囊/底部菜单遮挡情况。
- [ ] (P1) 汇总性能、安全、自适配报告，并依据根 README 流程提交合并请求。

## Post-MVP
- [ ] (P2) 结合 context7 文档与 `draw/心动模式.png`、`draw/社区.png` 设计稿，规划“心动模式”“社区功能”组件与接口扩展，并更新前端设计规范。
