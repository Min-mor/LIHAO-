import type { CommunityComment, CommunityDetail } from '@/pages/community/types'
import { getCommunityDetailSource } from './social'

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
    postedAt: '2小时前',
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
        postedAt: '1小时前',
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
    postedAt: '3小时前',
  },
]
