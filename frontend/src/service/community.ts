import type { CommunityComment, CommunityDetail, CommunityPost } from '@/api/modules/community/types'
import { apiGetCommunityDetail, apiListCommunityComments, apiListCommunityPosts } from '@/api/modules/community'
import { communityPostsMock } from '@/mock/community'
import { communityCommentsMock, getCommunityDetailMock } from '@/mock/communityDetail'

export async function listCommunityPosts(): Promise<CommunityPost[]> {
  if (import.meta.env.DEV)
    return Promise.resolve(communityPostsMock.map(item => ({ ...item, author: { ...item.author }, media: { ...item.media, gallery: item.media.gallery ? [...item.media.gallery] : undefined }, stats: { ...item.stats } })))

  return apiListCommunityPosts()
}

export async function getCommunityDetail(id: string): Promise<CommunityDetail> {
  if (import.meta.env.DEV)
    return Promise.resolve((() => {
      const d = getCommunityDetailMock(id)
      return {
        ...d,
        media: [...d.media],
        stats: { ...d.stats },
        author: { ...d.author, tags: d.author.tags ? [...d.author.tags] : undefined },
      }
    })())

  return apiGetCommunityDetail(id)
}

export async function listCommunityComments(detailId: string): Promise<CommunityComment[]> {
  if (import.meta.env.DEV)
    return Promise.resolve(communityCommentsMock.map(c => ({
      ...c,
      author: { ...c.author, tags: c.author.tags ? [...c.author.tags] : undefined },
      replies: c.replies ? c.replies.map(r => ({ ...r, author: { ...r.author, tags: r.author.tags ? [...r.author.tags] : undefined } })) : undefined,
    })))

  return apiListCommunityComments(detailId)
}
