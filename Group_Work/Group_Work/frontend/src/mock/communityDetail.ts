import type { CommunityComment, CommunityDetail } from '@/api/modules/community/types'
import { getCommunityDetailSource } from '@/mock/mappers/community'

const detailSource = getCommunityDetailSource()

if (!detailSource) {
  throw new Error('[communityDetailMock] 未找到社区详情数据，请检查 social.ts 中的 footprintSources 配置')
}

export const communityDetailMock: CommunityDetail = {
  id: `recommend-${detailSource.id}`,
  title: detailSource.title,
  content: detailSource.article,
  postedAt: detailSource.postedAt,
  location: detailSource.destination,
  stats: detailSource.stats,
  media: detailSource.media.slice(0, 4),
  author: detailSource.author,
  isFollowing: detailSource.isFollowing,
  isLiked: detailSource.isLiked,
  isCollected: detailSource.isCollected,
  relatedFootprint: {
    id: detailSource.id,
    title: 'Oia 日落之旅',
    destination: '希腊 · 圣托里尼',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=60',
    rating: 5,
  },
}

export const communityCommentsMock: CommunityComment[] = [
  {
    id: 'c1',
    author: {
      name: '旅途拾光',
      avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=facearea&w=120&h=120&q=60',
      tags: ['旅行策划'],
    },
    content: '去年也去了！最推荐早起看日出，山谷里的云海真的太震撼了。记得提前预约营地哦。',
    liked: false,
    likes: 42,
    postedAt: '2025-11-16 18:00',
    replies: [
      {
        id: 'c1-1',
        author: {
          name: '丸子',
          avatar: communityDetailMock.author.avatar,
          tags: ['作者'],
          verified: true,
        },
        content: '谢谢分享！我们当时是凌晨四点出发的，自驾上山记得带防滑链~',
        liked: false,
        likes: 10,
        postedAt: '2025-11-16 19:00',
      },
    ],
  },
  {
    id: 'c2',
    author: {
      name: '星空邮差',
      avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=facearea&w=120&h=120&q=60',
      tags: ['摄影师'],
    },
    content: '图三的构图太绝了，想问一下是用什么镜头拍的？',
    liked: false,
    likes: 18,
    postedAt: '2025-11-16 17:00',
  },
]

export function getCommunityDetailMock(id?: string): CommunityDetail {
  const source = getCommunityDetailSource(id)
  if (!source)
    throw new Error('[communityDetailMock] 未找到社区详情数据')
  return {
    id: source.id,
    title: source.title,
    content: source.article,
    postedAt: source.postedAt,
    location: source.destination,
    stats: source.stats,
    media: source.media.slice(0, 4),
    author: source.author,
    isFollowing: source.isFollowing,
    isLiked: source.isLiked,
    isCollected: source.isCollected,
  }
}
