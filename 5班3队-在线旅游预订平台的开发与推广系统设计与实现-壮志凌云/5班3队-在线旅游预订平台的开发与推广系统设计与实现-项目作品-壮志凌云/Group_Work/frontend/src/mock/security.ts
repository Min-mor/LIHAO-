import { findUserByPhone, getActiveUserId, users } from '@/mock/data/users'

export type SecurityScene = 'login' | 'password' | 'phone'

export async function mockSendSecurityCode({ phone, scene }: { phone: string, scene: SecurityScene }): Promise<string> {
  // 非登录场景需要手机号已注册
  if (scene !== 'login') {
    const target = findUserByPhone(phone)
    if (!target)
      throw new Error('手机号未注册')
  }
  await new Promise(resolve => setTimeout(resolve, 500))
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function mockUpdatePassword({ phone, code, newPassword }: { phone: string, code: string, newPassword: string }) {
  if (!code)
    throw new Error('验证码无效')
  const target = findUserByPhone(phone)
  if (!target)
    throw new Error('手机号未注册')
  target.password = newPassword
  await new Promise(resolve => setTimeout(resolve, 400))
}

export async function mockUpdatePhone({ phone, code }: { phone: string, code: string }) {
  if (!code)
    throw new Error('验证码无效')
  const activeId = getActiveUserId()
  const target = users[activeId]
  if (!target)
    throw new Error('登录状态已失效')
  const exists = Boolean(findUserByPhone(phone))
  if (exists)
    throw new Error('手机号已被占用')
  target.phone = phone
  await new Promise(resolve => setTimeout(resolve, 400))
}
