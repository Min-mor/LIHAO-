import type { TicketMessage } from "./ticketConversations"

export interface SupportConversationMeta {
  id: string
  subject: string
  channel: string
  contact: {
    name: string
    role: string
    responseSla: string
  }
  messages: TicketMessage[]
}

export interface SupportConversationDataset {
  threads: SupportConversationMeta[]
}

const defaultContactAvatar =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=60"

export const supportConversationMock: SupportConversationDataset = {
  threads: [
    {
      id: "support-default",
      subject: "联系 Trip 平台管理员",
      channel: "站内消息",
      contact: {
        name: "管理员 · 李雪",
        role: "平台客服经理",
        responseSla: "15 分钟内响应",
      },
      messages: [
        {
          id: "support-1",
          ticketId: "support-default",
          authorType: "requester",
          authorName: "山川旅行社",
          avatar:
            "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=60",
          timestamp: "2024/11/05 10:12",
          content: "早上好，想确认下本周是否可以提前完成结算？",
        },
        {
          id: "support-2",
          ticketId: "support-default",
          authorType: "agent",
          authorName: "管理员 · 李雪",
          avatar: defaultContactAvatar,
          timestamp: "2024/11/05 10:18",
          content: "可以的，我已经帮您提交财务加急申请，预计今晚前完成。",
        },
      ],
    },
  ],
}

export function getSupportThread(threadId?: string) {
  return supportConversationMock.threads.find((thread) => thread.id === threadId) ?? supportConversationMock.threads[0]
}
