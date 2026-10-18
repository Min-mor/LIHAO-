export type AnnouncementStatus = "draft" | "published" | "revoked"

export interface AnnouncementRecord {
  id: string
  title: string
  cover: string
  content: string
  status: AnnouncementStatus
  createdAt: string
  publishedAt?: string
  lastOperator: string
  lastOperatedAt: string
}

export interface AnnouncementDataset {
  records: AnnouncementRecord[]
}

const defaultCover = "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=640&q=60"

export const announcementMock: AnnouncementDataset = {
  records: [
    {
      id: "notice-1001",
      title: "系统维护通知",
      cover: defaultCover,
      content: "为提升服务稳定性，11 月 28 日凌晨 02:00-04:00 将进行数据库升级，届时部分功能会短暂不可用，请提前安排业务。",
      status: "published",
      createdAt: "2024/11/20 10:00",
      publishedAt: "2024/11/20 10:05",
      lastOperator: "系统管理员",
      lastOperatedAt: "2024/11/20 10:05",
    },
    {
      id: "notice-1002",
      title: "双十二营销素材发布",
      cover: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=640&q=60",
      content: "渠道营销素材现已更新，请登录资源中心下载新版物料，提前准备活动上线。",
      status: "published",
      createdAt: "2024/11/15 09:20",
      publishedAt: "2024/11/15 09:30",
      lastOperator: "市场运营",
      lastOperatedAt: "2024/11/15 09:30",
    },
    {
      id: "notice-1003",
      title: "分销结算策略调整草案",
      cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=640&q=60",
      content: "针对部分区域的佣金结算周期拟做微调，请相关业务团队评估影响并反馈意见。",
      status: "draft",
      createdAt: "2024/11/21 14:10",
      lastOperator: "财务分析组",
      lastOperatedAt: "2024/11/21 14:10",
    },
    {
      id: "notice-1004",
      title: "旧版移动端下线公告",
      cover: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=640&q=60",
      content: "为聚焦新版本体验，旧版 App 将于 12 月 5 日停止维护，请尽快引导商家升级。",
      status: "revoked",
      createdAt: "2024/10/05 11:00",
      publishedAt: "2024/10/06 09:00",
      lastOperator: "平台管理员",
      lastOperatedAt: "2024/11/01 08:30",
    },
  ],
}
