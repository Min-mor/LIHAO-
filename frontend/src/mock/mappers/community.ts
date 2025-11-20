import type { CommunityAuthor, CommunityPost, CommunityTab } from '@/api/modules/community/types'
import { footprintSources } from '@/mock/data/footprints'
import { topicSources } from '@/mock/data/topics'
import { getActiveUserId, users } from '@/mock/data/users'

function mapToAuthor(authorId: number): CommunityAuthor {
  const user = users[authorId]
  return {
    name: user.nickname,
    avatar: user.avatar,
    verified: authorId === 1001,
  }
}

export function createFootprintPost(item: typeof footprintSources[number], tab: CommunityTab): CommunityPost {
  const activeUserId = getActiveUserId()
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
    stats: { share: (item as any).shares ?? 0, collects: 0, comments: (item as any).comments ?? 0, likes: (item as any).likes ?? 0 },
    isFollowing: item.authorId !== activeUserId && item.followingBy.includes(activeUserId),
    isLiked: item.authorId !== activeUserId && item.likedBy.includes(activeUserId),
    self: item.authorId === activeUserId,
  }
}

export function createTopicPost(item: typeof topicSources[number], tab: CommunityTab): CommunityPost {
  const activeUserId = getActiveUserId()
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
    stats: { share: 0, collects: 0, comments: (item as any).comments ?? 0, likes: (item as any).likes ?? 0 },
    isFollowing: item.authorId !== activeUserId,
    isLiked: item.authorId !== activeUserId && item.likedBy.includes(activeUserId),
    self: item.authorId === activeUserId,
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

export function getCommunityDetailSource(postId?: string) {
  const activeUserId = getActiveUserId()

  // 解析来自列表的 id: `${tab}-${sourceId}`
  let sourceId = ''
  if (postId && typeof postId === 'string') {
    // 新协议：直接传入 fp-* 或 tp-*
    if (/^(fp|tp)-/.test(postId)) {
      sourceId = postId
    }
    else {
      // 旧协议：`${tab}-${sourceId}`，如 recommend-fp-001 / following-tp-001
      const parts = postId.split('-')
      const maybeTab = parts[0]
      if (maybeTab === 'recommend' || maybeTab === 'following')
        sourceId = parts.slice(1).join('-') || ''
      else
        sourceId = postId
    }
  }

  const fromFootprint = sourceId
    ? footprintSources.find(i => i.id === sourceId)
    : (footprintSources.find(item => item.tabs.includes('recommend')) || footprintSources[0])

  if (fromFootprint) {
    return {
      id: fromFootprint.id,
      title: fromFootprint.title,
      article: fromFootprint.article,
      postedAt: fromFootprint.postedAt,
      destination: fromFootprint.destination,
      stats: {
        share: (fromFootprint as any).shares ?? 0,
        collects: 0,
        comments: (fromFootprint as any).comments ?? 0,
        likes: (fromFootprint as any).likes ?? 0,
      },
      media: [...fromFootprint.media],
      author: mapToAuthor(fromFootprint.authorId),
      isFollowing: fromFootprint.authorId !== activeUserId && fromFootprint.followingBy.includes(activeUserId),
      isLiked: fromFootprint.authorId !== activeUserId && fromFootprint.likedBy.includes(activeUserId),
      isCollected: false,
    }
  }

  // 尝试从话题中匹配
  const fromTopic = sourceId ? topicSources.find(i => i.id === sourceId) : undefined
  if (fromTopic) {
    const media = fromTopic.mediaType === 'gallery'
      ? (fromTopic.gallery && fromTopic.gallery.length ? [...fromTopic.gallery] : [fromTopic.mediaCover])
      : [fromTopic.mediaCover]

    return {
      id: fromTopic.id,
      title: fromTopic.title,
      article: fromTopic.content,
      postedAt: fromTopic.postedAt,
      destination: fromTopic.location || undefined,
      stats: {
        share: 0,
        collects: 0,
        comments: (fromTopic as any).comments ?? 0,
        likes: (fromTopic as any).likes ?? 0,
      },
      media,
      author: mapToAuthor(fromTopic.authorId),
      isFollowing: fromTopic.authorId !== activeUserId && fromTopic.followingBy.includes(activeUserId),
      isLiked: fromTopic.authorId !== activeUserId && fromTopic.likedBy.includes(activeUserId),
      isCollected: false,
    }
  }

  return null
}
