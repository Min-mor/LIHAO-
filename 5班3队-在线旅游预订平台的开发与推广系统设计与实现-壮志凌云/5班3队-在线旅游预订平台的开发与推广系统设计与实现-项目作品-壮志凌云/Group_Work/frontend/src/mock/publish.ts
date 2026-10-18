/**
 * 发布页面 Mock 数据
 */

// 可见性选项类型
export type VisibilityType = 'public' | 'private' | 'friends' | 'custom_show' | 'custom_hide'

// 发布笔记请求参数
export interface PublishNoteParams {
  images: string[]
  title: string
  content: string
  hashtags: string[]
  location?: string
  visibility: VisibilityType
  footprintId?: string
}

// 发布笔记响应
export interface PublishNoteResponse {
  success: boolean
  noteId: string
  message: string
}

/**
 * Mock 发布笔记接口
 */
export async function mockPublishNote(params: PublishNoteParams): Promise<PublishNoteResponse> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 模拟发布成功
  return {
    success: true,
    noteId: `note_${Date.now()}`,
    message: '发布成功',
  }
}
