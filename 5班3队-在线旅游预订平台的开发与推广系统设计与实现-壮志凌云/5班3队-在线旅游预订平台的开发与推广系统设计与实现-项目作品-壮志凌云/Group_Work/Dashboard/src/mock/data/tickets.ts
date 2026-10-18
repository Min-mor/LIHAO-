export type TicketStatus = "pending" | "processing" | "completed"

export interface TicketRecord {
  id: string
  ticketNo: string
  description: string
  issueType: string
  serviceType: string
  requester: string
  status: TicketStatus
  createdAt: string
}

export interface TicketDataset {
  tickets: TicketRecord[]
}

import type { UserRole } from "@/components/dashboard/types"

const merchantTickets: TicketRecord[] = [
  {
    id: "t-1001",
    ticketNo: "TS20241101A9WX",
    description: "客户后台仪表盘加载缓慢，偶发 504，需要运维排查网络链路。",
    issueType: "性能问题",
    serviceType: "SaaS 控制台",
    requester: "Lisa Putri",
    status: "processing",
    createdAt: "2024/11/01 13:24",
  },
  {
    id: "t-1002",
    ticketNo: "TS20241014BW8G",
    description: "导入商家数据后字段错位，需确认模板版本。",
    issueType: "数据异常",
    serviceType: "商家管理",
    requester: "Rio Dimas",
    status: "pending",
    createdAt: "2024/10/14 09:50",
  },
  {
    id: "t-1003",
    ticketNo: "CS20240611A03B",
    description: "移动端下单页偶发崩溃，影响支付漏斗。",
    issueType: "移动端缺陷",
    serviceType: "交易服务",
    requester: "Ahmad Syafii",
    status: "pending",
    createdAt: "2024/06/11 16:32",
  },
  {
    id: "t-1004",
    ticketNo: "CS20240508X9LM",
    description: "需要为 VIP 商家开通旗舰模板，请确认排期。",
    issueType: "功能请求",
    serviceType: "模板服务",
    requester: "Dewi Rahman",
    status: "completed",
    createdAt: "2024/05/08 10:15",
  },
  {
    id: "t-1005",
    ticketNo: "TS20240320TT03",
    description: "账号被锁定无法登录，已由客服处理，待关闭。",
    issueType: "账号权限",
    serviceType: "账户中心",
    requester: "Komang Arta",
    status: "completed",
    createdAt: "2024/03/20 18:05",
  },
]

const adminTickets: TicketRecord[] = [
  {
    id: "a-2001",
    ticketNo: "ADM20241103SYS1",
    description: "支付网关重试率上升，需要统一巡检。",
    issueType: "系统告警",
    serviceType: "支付网关",
    requester: "平台监控",
    status: "processing",
    createdAt: "2024/11/03 08:40",
  },
  {
    id: "a-2002",
    ticketNo: "ADM20241028MER2",
    description: "3 家商户提交入驻资料待审核。",
    issueType: "商家审核",
    serviceType: "商家平台",
    requester: "Trip BD 团队",
    status: "pending",
    createdAt: "2024/10/28 17:20",
  },
  {
    id: "a-2003",
    ticketNo: "ADM20241005SYS3",
    description: "短信通道与邮件通道需切换备用线路。",
    issueType: "渠道维护",
    serviceType: "消息中心",
    requester: "系统调度",
    status: "pending",
    createdAt: "2024/10/05 14:05",
  },
  {
    id: "a-2004",
    ticketNo: "ADM20240922OPS4",
    description: "周末营销活动需额外监控资源。",
    issueType: "运营支持",
    serviceType: "活动中心",
    requester: "运营部",
    status: "completed",
    createdAt: "2024/09/22 09:15",
  },
  {
    id: "a-2005",
    ticketNo: "ADM20240901SEC5",
    description: "商家 API AccessKey 泄露，需强制轮换。",
    issueType: "安全事件",
    serviceType: "安全中心",
    requester: "安全巡检",
    status: "completed",
    createdAt: "2024/09/01 21:30",
  },
]

export const ticketCenterMock: Record<UserRole, TicketDataset> = {
  merchant: { tickets: merchantTickets },
  admin: { tickets: adminTickets },
}
