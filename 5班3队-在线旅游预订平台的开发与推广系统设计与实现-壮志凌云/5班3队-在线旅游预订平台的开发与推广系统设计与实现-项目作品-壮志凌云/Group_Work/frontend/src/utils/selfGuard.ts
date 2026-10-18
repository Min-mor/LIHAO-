export type SelfAction = 'follow' | 'like' | 'collect'

export function isSelf(authorName?: string, viewerName?: string) {
  return Boolean(authorName && viewerName && authorName === viewerName)
}

export function guardSelf(action: SelfAction, authorName?: string, viewerName?: string) {
  if (isSelf(authorName, viewerName)) {
    const message = action === 'follow' ? '不能关注自己' : action === 'like' ? '不能给自己点赞' : '不能收藏自己'
    uni.showToast({ title: message, icon: 'none' })
    return false
  }
  return true
}
