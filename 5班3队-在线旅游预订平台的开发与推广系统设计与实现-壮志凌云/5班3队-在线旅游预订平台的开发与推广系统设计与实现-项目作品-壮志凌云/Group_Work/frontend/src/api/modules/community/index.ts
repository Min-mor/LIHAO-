import type { CommunityComment, CommunityDetail, CommunityPost } from '@/api/modules/community/types'
import { httpGet } from '@/http/http'

export function apiListCommunityPosts() {
  return httpGet<CommunityPost[]>('/community/posts')
}

export function apiGetCommunityDetail(id: string) {
  return httpGet<CommunityDetail>('/community/detail', { id })
}

export function apiListCommunityComments(detailId: string) {
  return httpGet<CommunityComment[]>('/community/comments', { id: detailId })
}
