import type { ProfileMockData } from '@/mock/profile'
import { httpGet } from '@/http/http'

export function apiGetProfileData(userId?: string) {
  const query = userId ? { userId } : undefined
  return httpGet<ProfileMockData>('/profile/data', query)
}
