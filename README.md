# LIHAO 在线旅游预订平台 — 课程项目完整备份

本仓库是「LIHAO 在线旅游预订平台」小组课程项目的完整备份，包含项目源码、课程材料与设计文档。

## 分支说明

| 分支 | 说明 |
| --- | --- |
| `main` | 完整备份：项目源码 + 课程材料（当前最新文件状态） |
| `dev` | 原团队开发历史（38 次提交，原自建 Gitea 仓库的 dev 分支） |
| `master` | 原团队开发历史（master 分支） |

> 说明：`dev` / `master` 分支保留了原团队完整的提交信息、作者与内容；为保护密钥，历史提交中的真实密钥已被替换为占位符，因此提交 ID 与原服务器上的不同。

## 目录结构

- `Group_Work/Group_Work/` — 主项目源码
  - `backend/` — Spring Boot 后端（Java 17 + MyBatis + MySQL）
  - `frontend/` — uni-app（Vue 3 + TypeScript + wot-ui）移动端
  - `Dashboard/` — Astro 管理后台
  - `docs/`、`PRD/` — 项目文档与产品原型
- `5班3队-在线旅游预订平台的开发与推广系统设计与实现-壮志凌云/` — 课程提交材料（项目文档、答辩 PPT、演示视频、答辩照片）
- `LIHAO在线旅游预订平台的开发/` — 课程材料（项目报告 PDF、原型图、演示视频）
- `高保真.rp` — Axure 高保真原型
- `第1小组-旅游预订平台项目-综合设计报告(1).doc` — 综合设计报告

## 关于密钥

仓库中的真实密钥/密码已全部替换为占位符，公开版本不能直接连接数据库或第三方服务。运行前需要在本地补齐：

`backend/src/main/resources/application.yml`

- `spring.datasource.password` → `${DB_PASSWORD:}`
- `wechat.app-secret` → `${WECHAT_APP_SECRET:}`
- `juhe.scenic-apikey` → `${JUHE_SCENIC_API_KEY:}`
- `juhe.train-apikey` → `${JUHE_TRAIN_API_KEY:}`

`frontend/env/.env`

- `VITE_TENCENT_MAP_KEY`（腾讯地图 Key）
- `VITE_SMS_VENDOR_ENDPOINT`（短信发送 Webhook）

## 未包含的文件

以下文件未上传：`.git` 仓库目录、`node_modules/`、`dist/`、`target/` 等依赖与构建产物，以及 `*.rar` 压缩包（内含无法清理密钥的旧版本代码）。
