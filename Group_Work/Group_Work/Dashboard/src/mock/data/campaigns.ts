export type CampaignStatus = "draft" | "published" | "ongoing" | "revoked" | "finished"

export interface MarketingCampaignRecord {
  id: string
  title: string
  cover: string
  content: string
  status: CampaignStatus
  createdAt: string
  publishedAt?: string
  startAt?: string
  endAt?: string
  preNotifyMinutes?: number
  postNotifyMinutes?: number
  notifyTargets: string[]
  lastOperator: string
  lastOperatedAt: string
}

export interface CampaignDataset {
  records: MarketingCampaignRecord[]
}

const fallbackCover = "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?auto=format&fit=crop&w=640&q=60"

export const campaignMock: CampaignDataset = {
  records: [
    {
      id: "campaign-1001",
      title: "冬季暖心补贴",
      cover: fallbackCover,
      content: "热门目的地酒店预订享 85 折，配套餐饮券每日限量发放。",
      status: "ongoing",
      createdAt: "2024/11/05 09:00",
      publishedAt: "2024/11/05 09:30",
      startAt: "2024-12-01T00:00",
      endAt: "2024-12-15T23:59",
      preNotifyMinutes: 60 * 24,
      postNotifyMinutes: 60 * 6,
      notifyTargets: ["merchants", "users"],
      lastOperator: "市场运营",
      lastOperatedAt: "2024/11/05 09:30",
    },
    {
      id: "campaign-1002",
      title: "黑五闪购",
      cover: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=640&q=60",
      content: "黑五期间精选线路 5 折起，支持优惠券叠加。",
      status: "finished",
      createdAt: "2024/10/20 08:40",
      publishedAt: "2024/10/21 10:10",
      startAt: "2024-11-25T08:00",
      endAt: "2024-11-29T23:00",
      preNotifyMinutes: 60 * 12,
      postNotifyMinutes: 60 * 2,
      notifyTargets: ["merchants", "users", "partners"],
      lastOperator: "平台管理员",
      lastOperatedAt: "2024/11/30 09:10",
    },
    {
      id: "campaign-1003",
      title: "新商家上架冲刺",
      cover: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=640&q=60",
      content: "针对新入驻商家提供站内曝光位及广告券，名额有限。",
      status: "draft",
      createdAt: "2024/11/24 14:20",
      startAt: "2024-12-10T09:00",
      endAt: "2024-12-31T23:59",
      preNotifyMinutes: 60 * 24 * 2,
      postNotifyMinutes: 60 * 12,
      notifyTargets: ["merchants"],
      lastOperator: "招商团队",
      lastOperatedAt: "2024/11/24 14:20",
    },
  ],
}
