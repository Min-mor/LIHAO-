import { getProfileMockData as getProfileMockDataImpl } from '@/mock/mappers/profile'

export * from './profile-types'

export const profileMockData = getProfileMockDataImpl()
export const getProfileMockData = getProfileMockDataImpl
