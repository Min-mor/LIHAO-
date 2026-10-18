/**
 * 发布相关 API
 */
import type { PublishNoteParams, PublishNoteResponse } from '@/mock/publish'
import { http } from '@/http/http'

/**
 * 发布笔记
 */
export function apiPublishNote(data: PublishNoteParams) {
  return http.post<PublishNoteResponse>('/api/v1/community/notes', data)
}

/**
 * 上传图片
 */
export function apiUploadImage(file: File) {
  return http.post<{ url: string }>('/api/v1/upload/image', { file })
}
