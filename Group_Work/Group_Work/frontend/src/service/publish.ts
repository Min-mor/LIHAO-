/**
 * 发布相关业务逻辑层
 */
import type { PublishNoteParams, PublishNoteResponse } from '@/mock/publish'
import { mockPublishNote } from '@/mock/publish'
import { apiPublishNote } from '@/api/modules/publish'

/**
 * 发布笔记
 * 开发环境使用 Mock，生产环境调用真实 API
 */
export async function publishNote(params: PublishNoteParams): Promise<PublishNoteResponse> {
  if (import.meta.env.DEV) {
    // 开发环境使用 Mock
    return await mockPublishNote(params)
  }

  // 生产环境调用真实 API
  return await apiPublishNote(params)
}
