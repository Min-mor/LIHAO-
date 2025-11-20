import type { IUserInfoRes } from '@/api/modules/auth/types'

export interface SocialUser extends IUserInfoRes {
  phone: string
  password: string
  signature?: string
  gender?: 'male' | 'female' | 'other'
  stats: {
    footprint: number
    followers: number
    likes: number
  }
}

export const DEFAULT_USER_ID = 1001

// 可变对象内容允许被修改；绑定保持 const 以满足 ESLint 规则
export const users: Record<number, SocialUser> = {
  1001: {
    userId: 1001,
    nickname: '丸子',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=160&h=160&q=60',
    phone: '13800000000',
    password: '123456',
    signature: '落日海风与旅行计划',
    stats: {
      footprint: 24,
      followers: 128,
      likes: 2600,
    },
  },
  1002: {
    userId: 1002,
    nickname: '背包客小美',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=160&h=160&q=60',
    phone: '13800000001',
    password: '123456',
    stats: {
      footprint: 16,
      followers: 89,
      likes: 1340,
    },
  },
  1003: {
    userId: 1003,
    nickname: '旅行的青蛙',
    avatar: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=facearea&w=160&h=160&q=60',
    phone: '13800000002',
    password: '123456',
    stats: {
      footprint: 32,
      followers: 204,
      likes: 5120,
    },
  },
  1004: {
    userId: 1004,
    nickname: '星空邮差',
    avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=facearea&w=160&h=160&q=60',
    phone: '13800000003',
    password: '123456',
    stats: {
      footprint: 18,
      followers: 152,
      likes: 2180,
    },
  },
}
// 模块内私有状态，不直接导出可变绑定
let _activeUserId = DEFAULT_USER_ID
let _nextUserId = 2000

export function getActiveUserId() {
  return _activeUserId
}

export function setActiveUserId(id: number) {
  _activeUserId = id
}

export function resetActiveUser() {
  _activeUserId = DEFAULT_USER_ID
}

export function claimNextUserId() {
  const id = _nextUserId
  _nextUserId += 1
  return id
}

export function findUserByPhone(phone: string) {
  return Object.values(users).find(u => u.phone === phone)
}

export function registerUser(user: SocialUser) {
  users[user.userId] = user
}
