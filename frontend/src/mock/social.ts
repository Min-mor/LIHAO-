import type { FootprintItem, OrderItem, ProfileFavorites, ProfileMockData, ProfileStat, TopicItem } from './profile-types'
import type { IAuthLoginRes, IUserInfoRes } from '@/api/types/login'
import type { CommunityAuthor, CommunityPost, CommunityTab } from '@/pages/community/types'

export const DEFAULT_USER_ID = 1001

interface SocialUser extends IUserInfoRes {
  phone: string
  password: string
  signature?: string
  bio?: string
  gender?: 'male' | 'female' | 'other'
  stats: {
    footprint: number
    followers: number
    likes: number
  }
}

export interface MockRegisterPayload {
  phone: string
  password?: string
  nickname?: string
  gender?: SocialUser['gender']
  avatar?: string
  signature?: string
  bio?: string
}

interface FootprintSource extends FootprintItem {
  authorId: number
  postedAt: string
  stats: CommunityPost['stats']
  tabs: CommunityTab[]
  likedBy: number[]
  followingBy: number[]
}

interface TopicSource extends TopicItem {
  authorId: number
  postedAt: string
  stats: CommunityPost['stats']
  mediaType: 'gallery' | 'video'
  mediaCover: string
  gallery?: string[]
  duration?: string
  tabs: CommunityTab[]
  likedBy: number[]
  followingBy: number[]
  title: string
}

const users: Record<number, SocialUser> = {
  1001: {
    userId: 1001,
    nickname: '丸子',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=160&h=160&q=60',
    phone: '13800000000',
    password: '123456',
    signature: '落日海风与旅行计划',
    bio: '旅行体验官 / 目的地策划',
    stats: {
      footprint: 24,
      followers: 128,
      likes: 2600,
    },
  },
  1002: {
    userId: 1002,
    nickname: '背包客小美',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=160&h=160&q=60',
    phone: '13800000001',
    password: '123456',
    bio: '露营装备发烧友',
    stats: {
      footprint: 16,
      followers: 89,
      likes: 1340,
    },
  },
  1003: {
    userId: 1003,
    nickname: '旅行的青蛙',
    avatar: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=facearea&w=160&h=160&q=60',
    phone: '13800000002',
    password: '123456',
    bio: 'Vlog 旅行创作者',
    stats: {
      footprint: 32,
      followers: 204,
      likes: 5120,
    },
  },
  1004: {
    userId: 1004,
    nickname: '星空邮差',
    avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=facearea&w=160&h=160&q=60',
    phone: '13800000003',
    password: '123456',
    bio: '银河摄影师',
    stats: {
      footprint: 18,
      followers: 152,
      likes: 2180,
    },
  },
}

let activeUserId = DEFAULT_USER_ID
let nextUserId = 2000

const footprintSources: FootprintSource[] = [
  {
    id: 'fp-001',
    authorId: 1001,
    icon: 'location',
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
    postedAt: '15:30',
    stats: { share: 18, comments: 26, likes: 138 },
    tabs: ['recommend', 'following'],
    likedBy: [1001, 1002],
    followingBy: [1001],
  },
  {
    id: 'fp-002',
    authorId: 1001,
    icon: 'location',
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
    postedAt: '09:48',
    stats: { share: 12, comments: 18, likes: 94 },
    tabs: ['recommend'],
    likedBy: [1002],
    followingBy: [1001],
  },
  {
    id: 'fp-101',
    authorId: 1002,
    icon: 'location',
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
    postedAt: '21:10',
    stats: { share: 22, comments: 34, likes: 164 },
    tabs: ['recommend', 'following'],
    likedBy: [1001, 1003],
    followingBy: [1001, 1003],
  },
]

const topicSources: TopicSource[] = [
  {
    id: 'tp-001',
    authorId: 1001,
    icon: 'chat1',
    date: '2025-10-09',
    content: '人不能一直停留在年少时分，再等等，等那个姑娘在我心底老去。',
    title: '旅途随笔｜再等等那个姑娘',
    location: '巴西 · 里约热内卢',
    attachments: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=720&q=60',
    ],
    likes: 86,
    comments: 12,
    postedAt: '13:20',
    stats: { share: 9, comments: 12, likes: 86 },
    mediaType: 'gallery',
    mediaCover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=60',
    gallery: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=60',
      'https://images.unsplash.com/photo-1526481280695-3c46973edbc6?auto=format&fit=crop&w=600&q=60',
    ],
    tabs: ['following'],
    likedBy: [1001],
    followingBy: [1001],
  },
  {
    id: 'tp-002',
    authorId: 1001,
    icon: 'chat1',
    date: '2025-09-30',
    content: '雨夜在京都的咖啡馆，与陌生人聊起旅行目的地，突然觉得世界好小。',
    title: '京都雨夜的咖啡对话',
    location: '日本 · 京都',
    attachments: [
      'https://images.unsplash.com/photo-1526481280695-3c46973edbc6?auto=format&fit=crop&w=720&q=60',
    ],
    likes: 45,
    comments: 6,
    postedAt: '20:42',
    stats: { share: 6, comments: 6, likes: 45 },
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
    icon: 'chat1',
    date: '2025-09-12',
    content: '图三的构图太绝了，想问一下是用什么镜头拍的？',
    title: '摄影手札｜关于图三的镜头',
    attachments: [],
    likes: 58,
    comments: 18,
    postedAt: '08:18',
    stats: { share: 4, comments: 18, likes: 58 },
    mediaType: 'video',
    mediaCover: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=60',
    duration: '02:14',
    tabs: ['recommend'],
    likedBy: [1001],
    followingBy: [1001, 1002],
  },
]

const orderList: OrderItem[] = [
  {
    id: 'ord-001',
    icon: 'calendar',
    orderType: '高铁动车',
    status: '进行中',
    date: '2025-10-12',
    title: '上海 ⇄ 北京 高铁双人往返',
    subtitle: 'G123 次 · 商务座 · 含接站服务',
    amount: '￥3,980',
    hasComment: false,
  },
  {
    id: 'ord-002',
    icon: 'calendar',
    orderType: '旅行团',
    status: '已完成',
    date: '2025-09-18',
    title: '圣托里尼深度 5 日自由行',
    subtitle: '含机酒+洞穴酒店+私人导游',
    amount: '￥18,640',
    hasComment: true,
    attachments: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=720&q=60',
    ],
  },
  {
    id: 'ord-003',
    icon: 'calendar',
    orderType: '酒店',
    status: '待付款',
    date: '2025-10-21',
    title: '巴厘岛悦榕庄海景套房 3 晚',
    subtitle: '含早餐 · 双人水疗体验券',
    amount: '￥7,280',
    hasComment: false,
  },
  {
    id: 'ord-004',
    icon: 'calendar',
    orderType: '飞机',
    status: '已退款',
    date: '2025-08-09',
    title: '成都 ⇄ 桂林 往返机票',
    subtitle: '川航 3U8821 · 经济舱 · 含 23kg 行李',
    amount: '￥1,680',
    hasComment: true,
  },
]

const favoriteList: ProfileFavorites = {
  sights: [
    {
      id: 'fav-s-001',
      type: 'sight',
      cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=720&q=60',
      title: '摩洛哥撒哈拉星空营地',
      location: '摩洛哥 · 梅祖卡',
      summary: '夜晚的银汉星空和沙漠日出让人沉醉。',
      likedAt: '2025-09-02',
    },
    {
      id: 'fav-s-002',
      type: 'sight',
      cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=60',
      title: '那不勒斯悬崖海景餐厅',
      location: '意大利 · 阿马尔菲',
      summary: '面海露台与手工海鲜面，最佳日落餐厅。',
      likedAt: '2025-08-17',
    },
  ],
  footprints: [
    {
      id: 'fav-fp-001',
      type: 'footprint',
      cover: 'https://images.unsplash.com/photo-1526481280695-3c46973edbc6?auto=format&fit=crop&w=720&q=60',
      title: '京都清晨散步',
      article: '穿过花见小路，看晨曦洒在古街石板上，余晖映在町屋的木窗上。',
      likedAt: '2025-09-12',
    },
    {
      id: 'fav-fp-002',
      type: 'footprint',
      cover: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=720&q=60',
      title: '桂林山水泛舟',
      article: '青山如黛，江水如镜，一叶扁舟穿过漓江的薄雾，仿佛行走在山水画里。',
      likedAt: '2025-08-30',
    },
  ],
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function formatStatValue(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`
  }
  return `${value}`
}

function mapToAuthor(authorId: number): CommunityAuthor {
  const user = users[authorId]
  return {
    name: user.nickname,
    avatar: user.avatar,
    verified: authorId === 1001,
  }
}

function createFootprintPost(item: FootprintSource, tab: CommunityTab): CommunityPost {
  return {
    id: `${tab}-${item.id}`,
    tab,
    author: mapToAuthor(item.authorId),
    postedAt: item.postedAt,
    title: item.title,
    article: item.article,
    media: {
      type: 'gallery',
      cover: item.media[0],
      gallery: item.media.slice(0, 3),
    },
    stats: { ...item.stats },
    isFollowing: item.followingBy.includes(activeUserId),
    isLiked: item.likedBy.includes(activeUserId),
  }
}

function createTopicPost(item: TopicSource, tab: CommunityTab): CommunityPost {
  return {
    id: `${tab}-${item.id}`,
    tab,
    author: mapToAuthor(item.authorId),
    postedAt: item.postedAt,
    title: item.title,
    article: item.content,
    media: item.mediaType === 'gallery'
      ? {
          type: 'gallery',
          cover: item.mediaCover,
          gallery: item.gallery?.slice(0, 3) || [],
        }
      : {
          type: 'video',
          cover: item.mediaCover,
          duration: item.duration,
        },
    stats: { ...item.stats },
    isFollowing: item.followingBy.includes(activeUserId),
    isLiked: item.likedBy.includes(activeUserId),
  }
}

export function getCommunityPostsMock(): CommunityPost[] {
  const posts: CommunityPost[] = []
  footprintSources.forEach((item) => {
    item.tabs.forEach((tab) => {
      posts.push(createFootprintPost(item, tab))
    })
  })
  topicSources.forEach((item) => {
    item.tabs.forEach((tab) => {
      posts.push(createTopicPost(item, tab))
    })
  })
  return posts
}

export function getCommunityDetailSource() {
  const primary = footprintSources.find(item => item.tabs.includes('recommend')) || footprintSources[0]
  if (!primary)
    return null

  return {
    id: primary.id,
    title: primary.title,
    article: primary.article,
    postedAt: primary.postedAt,
    destination: primary.destination,
    stats: {
      likes: primary.stats.likes,
      collects: primary.stats.share,
      comments: primary.stats.comments,
    },
    media: [...primary.media],
    author: mapToAuthor(primary.authorId),
    isFollowing: primary.followingBy.includes(activeUserId),
    isLiked: primary.likedBy.includes(activeUserId),
    isCollected: false,
  }
}

export function getProfileMockData(userId = activeUserId): ProfileMockData {
  const user = users[userId] || users[DEFAULT_USER_ID]

  const footprint = footprintSources
    .filter(item => item.authorId === userId)
    .map(item => ({
      id: item.id,
      icon: item.icon,
      date: item.date,
      destination: item.destination,
      title: item.title,
      article: item.article,
      rating: item.rating,
      orderId: item.orderId,
      media: deepClone(item.media),
    }))
  const topics = topicSources.filter(item => item.authorId === userId).map(item => ({
    id: item.id,
    icon: item.icon,
    date: item.date,
    content: item.content,
    location: item.location,
    attachments: deepClone(item.attachments),
    likes: item.likes,
    comments: item.comments,
  }))
  const stats: ProfileStat[] = [
    { id: 'footprint', label: '足迹', value: formatStatValue(user.stats.footprint) },
    { id: 'followers', label: '关注', value: formatStatValue(user.stats.followers) },
    { id: 'likes', label: '获赞', value: formatStatValue(user.stats.likes) },
  ]
  const hasPersonalizedData = footprint.length > 0 || topics.length > 0
  const orders = userId === DEFAULT_USER_ID || hasPersonalizedData ? deepClone(orderList) : []
  const favorites = userId === DEFAULT_USER_ID || hasPersonalizedData
    ? deepClone(favoriteList)
    : { sights: [], footprints: [] }
  return {
    stats,
    footprint,
    topics,
    orders,
    favorites,
  }
}

export function getActiveUserId() {
  return activeUserId
}

export async function mockFetchUserInfo(): Promise<IUserInfoRes> {
  const user = users[activeUserId]
  if (!user) {
    return Promise.reject(new Error('未登录'))
  }
  return {
    userId: user.userId,
    nickname: user.nickname,
    avatar: user.avatar,
    phone: user.phone,
    signature: user.signature,
    bio: user.bio,
  } as IUserInfoRes & { signature?: string, bio?: string }
}

export function resetActiveUser() {
  activeUserId = DEFAULT_USER_ID
}

export async function mockRegisterByPhone(payload: MockRegisterPayload): Promise<IAuthLoginRes> {
  const exists = Object.values(users).some(user => user.phone === payload.phone)
  if (exists) {
    return Promise.reject(new Error('该手机号已注册'))
  }

  const userId = nextUserId++
  const nickname = payload.nickname?.trim() || `旅人${userId}`
  const password = payload.password?.trim() || 'sms-auto'
  const avatar = payload.avatar?.trim() || '/static/images/default-avatar.png'
  const newUser: SocialUser = {
    userId,
    nickname,
    avatar,
    phone: payload.phone,
    password,
    gender: payload.gender,
    signature: payload.signature,
    bio: payload.bio,
    stats: {
      footprint: 0,
      followers: 0,
      likes: 0,
    },
  }

  users[userId] = newUser
  activeUserId = userId

  return {
    token: `mock-token-${userId}`,
    expiresIn: 3600,
  }
}

export async function mockLoginByPhone(phone: string, password?: string): Promise<IAuthLoginRes> {
  const target = Object.values(users).find(user => user.phone === phone)
  const normalizedPassword = password?.trim()

  if (target) {
    if (normalizedPassword && target.password !== normalizedPassword) {
      return Promise.reject(new Error('手机号或密码不正确'))
    }
    activeUserId = target.userId
    return {
      token: `mock-token-${target.userId}`,
      expiresIn: 3600,
    }
  }

  if (normalizedPassword) {
    return Promise.reject(new Error('账号不存在，请使用验证码注册'))
  }

  return mockRegisterByPhone({ phone })
}

export async function mockSendSecurityCode({ phone }: { phone: string, scene: 'password' | 'phone' }) {
  const target = Object.values(users).find(user => user.phone === phone)
  if (!target)
    throw new Error('手机号未注册')

  await new Promise(resolve => setTimeout(resolve, 500))
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function mockUpdatePassword({ phone, code, newPassword }: { phone: string, code: string, newPassword: string }) {
  if (!code)
    throw new Error('验证码无效')
  const target = Object.values(users).find(user => user.phone === phone)
  if (!target)
    throw new Error('手机号未注册')
  target.password = newPassword
  await new Promise(resolve => setTimeout(resolve, 400))
}

export async function mockUpdatePhone({ phone, code }: { phone: string, code: string }) {
  if (!code)
    throw new Error('验证码无效')
  const target = users[activeUserId]
  if (!target)
    throw new Error('登录状态已失效')
  const exists = Object.values(users).some(user => user.phone === phone)
  if (exists)
    throw new Error('手机号已被占用')
  target.phone = phone
  await new Promise(resolve => setTimeout(resolve, 400))
}
