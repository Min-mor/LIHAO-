import type { ProfileMockData } from '@/mock/profile'
import { apiGetProfileData } from '@/api/modules/profile'
import { getProfileMockData } from '@/mock/profile'

export async function getProfileData(userId?: string | number): Promise<ProfileMockData> {
  if (import.meta.env.DEV)
    return Promise.resolve(getProfileMockData(typeof userId === 'number' ? userId : undefined as any))

  return apiGetProfileData(typeof userId === 'number' ? String(userId) : userId)
}
