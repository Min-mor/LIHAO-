import type { IAuthLoginRes, IUserInfoRes } from '@/api/modules/auth/types'
import { resetActiveUser as _resetActiveUser, claimNextUserId, findUserByPhone, getActiveUserId, registerUser, setActiveUserId, users } from '@/mock/data/users'

export interface MockRegisterPayload {
  phone: string
  password?: string
  nickname?: string
  gender?: 'male' | 'female' | 'other'
  avatar?: string
  signature?: string
}

export async function mockFetchUserInfo(): Promise<IUserInfoRes> {
  const user = users[getActiveUserId()]
  if (!user)
    return Promise.reject(new Error('未登录'))
  return {
    userId: user.userId,
    nickname: user.nickname,
    avatar: user.avatar,
    phone: user.phone,
    signature: user.signature,
  } as IUserInfoRes & { signature?: string }
}

export async function mockRegisterByPhone(payload: MockRegisterPayload): Promise<IAuthLoginRes> {
  const exists = !!findUserByPhone(payload.phone)
  if (exists)
    return Promise.reject(new Error('该手机号已注册'))

  const userId = claimNextUserId()
  const nickname = payload.nickname?.trim() || `旅人${userId}`
  const password = payload.password?.trim() || 'sms-auto'
  const avatar = payload.avatar?.trim() || '/static/images/default-avatar.png'
  registerUser({
    userId,
    nickname,
    avatar,
    phone: payload.phone,
    password,
    gender: payload.gender,
    signature: payload.signature,
    stats: {
      footprint: 0,
      followers: 0,
      likes: 0,
    },
  })

  setActiveUserId(userId)

  return {
    token: `mock-token-${userId}`,
    expiresIn: 3600,
  }
}

export async function mockLoginByPhone(phone: string, password?: string): Promise<IAuthLoginRes> {
  const target = findUserByPhone(phone)
  const normalizedPassword = password?.trim()

  if (target) {
    if (normalizedPassword && target.password !== normalizedPassword)
      return Promise.reject(new Error('手机号或密码不正确'))
    setActiveUserId(target.userId)
    return { token: `mock-token-${target.userId}`, expiresIn: 3600 }
  }

  if (normalizedPassword)
    return Promise.reject(new Error('账号不存在，请使用验证码注册'))

  return mockRegisterByPhone({ phone })
}

export function resetActiveUser() {
  _resetActiveUser()
}
