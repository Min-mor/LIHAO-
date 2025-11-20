import type { CommunityTab } from '@/api/modules/community/types'

export interface FootprintSource {
  id: string
  authorId: number
  date: string
  destination: string
  title: string
  article: string
  rating?: number
  orderId: string
  media: string[]
  postedAt: string
  likes: number
  comments: number
  shares: number
  tabs: CommunityTab[]
  likedBy: number[]
  followingBy: number[]
}

export const footprintSources: FootprintSource[] = [
  {
    id: 'fp-001',
    authorId: 1001,
    date: '2025-10-09',
    destination: '希腊 · 圣托里尼',
    title: 'Oia 日落之旅',
    article: '整段旅程像是按下「暂停键」。第一晚扎营在高山草甸上，夜晚抬头能看到银河清晰划过；第二天徒步穿过冷杉林，在日出时抵达雪山脚下，云海在脚边翻涌。记得带上保暖衣物和保温杯，昼夜温差真的很大。',
    rating: 5,
    orderId: 'ord-002',
    media: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=60',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=720&q=60',
    ],
    postedAt: '2025-10-09 15:30',
    likes: 138,
    comments: 26,
    shares: 18,
    tabs: ['recommend', 'following'],
    likedBy: [1002],
    followingBy: [1001],
  },
  {
    id: 'fp-002',
    authorId: 1001,
    date: '2025-09-26',
    destination: '中国 · 桂林',
    title: '漓江日出热气球',
    article: '凌晨起飞的热气球从漓江上空缓慢升起，江面上的薄雾被染成金色。落地之后沿着古老的青石板街散步，顺便尝了当地的米粉和桂花糕。',
    rating: 4.5,
    orderId: 'ord-004',
    media: [
      'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=720&q=60',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=720&q=60',
    ],
    postedAt: '2025-09-26 09:48',
    likes: 94,
    comments: 18,
    shares: 12,
    tabs: ['recommend'],
    likedBy: [1002],
    followingBy: [1001],
  },
  {
    id: 'fp-101',
    authorId: 1002,
    date: '2025-09-18',
    destination: '川西 · 稻城亚丁',
    title: '雪山营地星空夜',
    article: '营地旁的牛群在夜里缓缓经过，只有星空和呼吸声。第二天顺着木栈道上山，雪山的倒影映在牛奶海里，仿佛另一个世界。',
    rating: 4.8,
    orderId: 'ord-201',
    media: [
      'https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?auto=format&fit=crop&w=720&q=60',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=720&q=60',
    ],
    postedAt: '2025-09-18 21:10',
    likes: 164,
    comments: 34,
    shares: 22,
    tabs: ['recommend', 'following'],
    likedBy: [1001, 1003],
    followingBy: [1001, 1003],
  },
]
