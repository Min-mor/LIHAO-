export type CommunityTab = 'recommend' | 'following'

export interface CommunityAuthor {
  name: string
  avatar: string
  verified?: boolean
  tags?: string[]
}

export interface CommunityMedia {
  type: 'gallery' | 'video'
  cover: string
  gallery?: string[]
  duration?: string
}

export interface CommunityStats {
  share: number
  collects: number
  comments: number
  likes: number
}

export interface CommunityPost {
  id: string
  tab: CommunityTab
  author: CommunityAuthor
  postedAt: string
  title: string
  article: string
  media: CommunityMedia
  stats: CommunityStats
  isFollowing: boolean
  isLiked: boolean
  self?: boolean
}

export interface RelatedFootprint {
  id: string
  title: string
  destination: string
  cover: string
  rating?: number
}

export interface CommunityDetail {
  id: string
  title: string
  content: string
  postedAt: string
  location?: string
  stats: CommunityStats
  media: string[]
  author: CommunityAuthor
  isFollowing: boolean
  isLiked: boolean
  isCollected: boolean
  relatedFootprint?: RelatedFootprint  // 关联的足迹
}

export interface CommunityComment {
  id: string
  author: CommunityAuthor
  content: string
  liked: boolean
  likes: number
  postedAt: string
  replies?: CommunityComment[]
}
