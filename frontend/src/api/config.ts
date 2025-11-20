export type ApiModule =
  | 'train'
  | 'order'
  | 'user'
  | 'community'
  | 'passenger'
  | 'security'
  | 'auth'
  | 'profile'
  | 'publish'

export const API_MODE = (import.meta.env.VITE_API_MODE || 'mock') as 'mock' | 'real'

const SERVER_BASE_URL = (import.meta.env.VITE_SERVER_BASEURL || '').replace(/\/$/, '')
const TRAIN_API_BASE = (import.meta.env.VITE_API_BASE_TRAIN || SERVER_BASE_URL || '').replace(/\/$/, '')

export function shouldUseMock(_module: ApiModule): boolean {
  return API_MODE === 'mock'
}

export function getModuleBaseUrl(module: ApiModule): string {
  if (module === 'train')
    return TRAIN_API_BASE || SERVER_BASE_URL

  return SERVER_BASE_URL
}
