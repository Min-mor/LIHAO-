import type { ProfileMockData, ProfileStat } from '@/mock/profile-types'
import { favoriteList } from '@/mock/data/favorites'
import { footprintSources } from '@/mock/data/footprints'
import { orderList } from '@/mock/data/orders'
import { topicSources } from '@/mock/data/topics'
import { DEFAULT_USER_ID, getActiveUserId, users } from '@/mock/data/users'

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

function formatStatValue(value: number): string {
  if (value >= 1000)
    return `${(value / 1000).toFixed(1)}k`
  return `${value}`
}

export function getProfileMockData(userId = getActiveUserId()): ProfileMockData {
  const user = users[userId] || users[DEFAULT_USER_ID]

  const commentedOrderIds = new Set(orderList.filter(o => o.hasComment).map(o => o.id))
  const footprint = footprintSources
    .filter(item => item.authorId === userId && commentedOrderIds.has(item.orderId))
    .map(item => ({
      id: item.id,
      date: item.date,
      destination: item.destination,
      title: item.title,
      article: item.article,
      rating: item.rating,
      orderId: item.orderId,
      media: deepClone(item.media),
      likes: item.likes,
      comments: item.comments,
    }))

  const topics = topicSources.filter(item => item.authorId === userId).map(item => ({
    id: item.id,
    date: item.date,
    title: item.title,
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

  return { stats, footprint, topics, orders, favorites }
}

export const profileMockData: ProfileMockData = getProfileMockData()
