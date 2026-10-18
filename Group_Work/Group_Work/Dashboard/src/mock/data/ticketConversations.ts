export interface TicketMessage {
  id: string
  ticketId: string
  authorType: "requester" | "agent"
  authorName: string
  avatar?: string
  timestamp: string
  content: string
}

export interface TicketConversationDataset {
  messages: TicketMessage[]
}

const defaultAvatars = {
  requester: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=60",
  agent: "https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=120&q=60",
}

export const ticketConversationMock: TicketConversationDataset = {
  messages: [
    {
      id: "msg-1001-1",
      ticketId: "t-1001",
      authorType: "requester",
      authorName: "Lisa Putri",
      avatar: defaultAvatars.requester,
      timestamp: "2024/11/01 13:26",
      content: "你好，后台仪表盘最近加载很慢，还偶尔 504，可以帮忙看下吗？",
    },
    {
      id: "msg-1001-2",
      ticketId: "t-1001",
      authorType: "agent",
      authorName: "运维专员 Maya",
      avatar: defaultAvatars.agent,
      timestamp: "2024/11/01 13:28",
      content: "已收到，正在检查链路。能否提供近 1 小时的大概访问时间段？",
    },
    {
      id: "msg-1001-3",
      ticketId: "t-1001",
      authorType: "requester",
      authorName: "Lisa Putri",
      avatar: defaultAvatars.requester,
      timestamp: "2024/11/01 13:30",
      content: "主要是 12:30 左右，客服登录也比较慢。",
    },
    {
      id: "msg-1002-1",
      ticketId: "t-1002",
      authorType: "requester",
      authorName: "Rio Dimas",
      avatar: defaultAvatars.requester,
      timestamp: "2024/10/14 09:51",
      content: "模板导入后字段对不上，麻烦帮忙核对一下版本。",
    },
    {
      id: "msg-1002-2",
      ticketId: "t-1002",
      authorType: "agent",
      authorName: "审核顾问 Adi",
      avatar: defaultAvatars.agent,
      timestamp: "2024/10/14 09:55",
      content: "收到～请确认是否使用 V3.2，若不是请在附件下载最新版再试。",
    },
  ],
}
