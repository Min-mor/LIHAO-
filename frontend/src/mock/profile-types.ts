import type { Dayjs } from 'dayjs'

export type ProfileTabKey = 'footprint' | 'topics' | 'orders' | 'favorites'

export interface ProfileStat {
  id: string
  label: string
  value: string
}

export interface FootprintItem {
  id: string
  date: string
  destination: string
  title: string
  article: string
  rating?: number
  orderId: string
  media: string[]
  likes: number
  comments: number
  createdAt?: Dayjs | string
}

export interface TopicItem {
  id: string
  date: string
  title: string
  content: string
  location?: string
  attachments: string[]
  likes: number
  comments: number
  createdAt?: Dayjs | string
  relatedFootprintId?: string // 关联的足迹ID
  hashtags?: string[] // 话题标签
  visibility?: 'public' | 'private' // 可见性
}

export type OrderType = '高铁动车' | '飞机' | '酒店' | '旅行团'
export type OrderStatus = '已完成' | '进行中' | '待付款' | '已退款' | '退款中'

export interface OrderItem {
  id: string
  orderType: OrderType
  status: OrderStatus
  date: string
  title: string
  subtitle: string
  amount: string
  hasComment: boolean
  attachments?: string[]
}

export interface FavoriteSightItem {
  id: string
  type: 'sight'
  cover: string
  title: string
  location: string
  summary: string
  likedAt: string
}

export interface FavoriteFootprintItem {
  id: string
  type: 'footprint'
  cover: string
  title: string
  article: string
  likedAt: string
}

export interface ProfileFavorites {
  sights: FavoriteSightItem[]
  footprints: FavoriteFootprintItem[]
}

export interface ProfileMockData {
  stats: ProfileStat[]
  footprint: FootprintItem[]
  topics: TopicItem[]
  orders: OrderItem[]
  favorites: ProfileFavorites
}
