/**
 * 发布页面 Mock 数据
 */

// Mock 地点列表
export const mockLocations = [
  '江湾里 MEET678',
  '壹纸信息科技',
  '抖音集团',
  '阳光学院(福州校本部)',
  '中国船政文化博物馆',
  '中国船政文化景区',
  '三坊七巷',
  '鼓山风景区',
  '西湖公园',
  '福州森林公园',
]

// 可见性选项类型
export type VisibilityType = 'public' | 'private' | 'friends' | 'custom_show' | 'custom_hide'

// 可见性选项配置
export interface VisibilityOption {
  label: string
  value: VisibilityType
  icon: string
}

export const visibilityOptions: VisibilityOption[] = [
  { label: '公开可见', value: 'public', icon: 'lock-off' },
  { label: '仅互关好友可见', value: 'friends', icon: 'user-talk' },
  { label: '仅自己可见', value: 'private', icon: 'lock-on' },
]

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
