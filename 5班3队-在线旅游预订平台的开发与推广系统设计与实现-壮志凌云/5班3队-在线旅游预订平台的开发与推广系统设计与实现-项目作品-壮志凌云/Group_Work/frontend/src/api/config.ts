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

export function shouldUseMock(_module: ApiModule): boolean {
  return API_MODE === 'mock'
}

export function getModuleBaseUrl(_module: ApiModule): string {
  return SERVER_BASE_URL
}
