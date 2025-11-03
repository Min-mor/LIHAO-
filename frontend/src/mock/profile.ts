import { getProfileMockData as getProfileMockDataImpl } from './social'

export * from './profile-types'

export const profileMockData = getProfileMockDataImpl()
export const getProfileMockData = getProfileMockDataImpl
