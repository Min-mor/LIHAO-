import type { TopicItem } from '../profile-types'
import type { CommunityTab } from '@/api/modules/community/types'

export interface TopicSource extends TopicItem {
  authorId: number
  postedAt: string
  mediaType: 'gallery' | 'video'
  mediaCover: string
  gallery?: string[]
  duration?: string
  tabs: CommunityTab[]
  likedBy: number[]
  followingBy: number[]
  title: string
}

export const topicSources: TopicSource[] = [
  {
    id: 'tp-001',
    authorId: 1001,
    date: '2025-10-09',
    content: '人不能一直停留在年少时分，再等等，等那个姑娘在我心底老去。',
    title: '旅途随笔｜再等等那个姑娘',
    location: '巴西 · 里约热内卢',
    attachments: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=720&q=60',
    ],
    likes: 86,
    comments: 12,
    postedAt: '2025-10-09 13:20',
    mediaType: 'gallery',
    mediaCover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=60',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1526481280695-3c46973edbc6?auto=format&fit=crop&w=600&q=60',
    ],
    tabs: ['following'],
    likedBy: [],
    followingBy: [1001],
  },
  {
    id: 'tp-002',
    authorId: 1001,
    date: '2025-09-30',
    content: '雨夜在京都的咖啡馆，与陌生人聊起旅行目的地，突然觉得世界好小。',
    title: '京都雨夜的咖啡对话',
    location: '日本 · 京都',
    attachments: [
      'https://images.unsplash.com/photo-1526481280695-3c46973edbc6?auto=format&fit=crop&w=720&q=60',
    ],
    likes: 45,
    comments: 6,
    postedAt: '2025-09-30 20:42',
    mediaType: 'gallery',
    mediaCover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=720&q=60',
    gallery: [
      'https://images.unsplash.com/photo-1526481280695-3c46973edbc6?auto=format&fit=crop&w=600&q=60',
    ],
    tabs: ['following'],
    likedBy: [1002],
    followingBy: [1001],
  },
  {
    id: 'tp-101',
    authorId: 1003,
    date: '2025-09-12',
    content: '图三的构图太绝了，想问一下是用什么镜头拍的？',
    title: '摄影手札｜关于图三的镜头',
    attachments: [],
    likes: 58,
    comments: 18,
    postedAt: '2025-09-12 08:18',
    mediaType: 'video',
    mediaCover: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=60',
    duration: '02:14',
    tabs: ['recommend'],
    likedBy: [1001],
    followingBy: [1001, 1002],
  },
]
