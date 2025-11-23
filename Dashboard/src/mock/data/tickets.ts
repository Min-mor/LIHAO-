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

export const ticketCenterMock: TicketDataset = {
  tickets: [
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
  ],
}
