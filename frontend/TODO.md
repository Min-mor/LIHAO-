# Frontend TODO（Unibest 项目）

## Phase 0 项目奠基
- [ ] 按照仓库根目录 `README.md` 的分支流程创建个人开发分支并更新 `frontend/README.md` 版本记录。
- [ ] 使用 context7 (`/unibest-tech/unibest-tech.github.io`) 获取最新（官网会自动更新）安装与目录约定文档，确认本地依赖、脚手架脚本及 `env/` 模板配置始终与官方同步。
- [ ] 清点 `src/pages-fg/`、`src/pages-sub/` 等演示页面，清理不相关的文件。
- [ ] 在 `docs/design/` 中补充最新草图索引，并在 `frontend/README.md` 标注小程序 Safe Area 适配策略。
- [ ] 核对 `draw/首页.png`、`draw/行程.png`、`draw/个人.png`、`draw/社区.png`、`draw/心动模式.png` 等低保真稿，记录关键交互与组件清单。
- [ ] 从上交镜像 `https://mirror.sjtu.edu.cn/google-fonts/` 下载 `Noto Serif` 子集，配置 H5 `@import` 与本地 `@font-face` fallback，并在小程序、App 端设置 `wx.loadFontFace` 或相对路径加载，更新 `frontend/README.md` 字体章节。

## Phase 1 游客端核心实现
- [ ] 在 `src/pages/` 下新建 `home/`、`product/`、`order/`、`profile/` 目录并更新 `pages.config.ts`。
- [ ] 使用 context7 查询 Wot Design Uni 组件用法，对照 `draw/首页.png` 的卡片、标签、底部导航完成首页瀑布流、城市推荐与产品卡片开发，确保符合配色和排版规范。
- [ ] 在小程序 (WeChat) 端调试首页与下单流程，针对系统原生按钮遮挡问题设置 Safe Area 填充（如 `padding-bottom`、`safe-area-inset-bottom`）。
- [ ] 编写 Pinia store (`src/store/`) 和请求模块 (`src/service/`)，生成 API 类型后使用 Vitest 与 Cypress 编写测试。

## Phase 2 商家端控制台
- [ ] 建立 `src/pages/merchant/` 页面与 `merchantLayout.vue`，复用/更新 `tabbar/`、`router/`。
- [ ] 通过 context7 获取 Unibest 请求钩子与 UnoCSS 指南，完成店铺、产品、订单管理页面。
- [ ] 在微信小程序端验证列表页和操作按钮，记录 Safe Area 兼容方案。

## Phase 3 管理员后台
- [ ] 新增 `src/pages/admin/` 模块，扩展权限路由与 Pinia token 逻辑，保持 `frontend/README.md` 规范同步。
- [ ] 参考 context7 文档实现数据看板和审批流程，确保输入校验与安全处理。
- [ ] 小程序端检查弹窗/按钮遮挡情况，记录适配方案。

## Phase 4 集成与上线
- [ ] 使用 `pnpm generate:api`（如需）与 context7 指南校验 OpenAPI 生成配置；完成前后端联调并更新 `docs/tests/`。
- [ ] 运行多端打包脚本，重点测试小程序 Safe Area、胶囊/底部菜单遮挡情况。
- [ ] 汇总性能、安全、自适配报告，并依据根 README 流程提交合并请求。

## Post-MVP
- [ ] 结合 context7 文档与 `draw/心动模式.png`、`draw/社区.png` 设计稿，规划“心动模式”“社区功能”组件与接口扩展，并更新前端设计规范。
