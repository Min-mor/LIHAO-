import { mockSendSecurityCode, mockUpdatePassword, mockUpdatePhone } from '@/mock/social'

export type SecurityScene = 'password' | 'phone'

export interface SendSecurityCodeParams {
  phone: string
  scene: SecurityScene
}

export interface SendSecurityCodeResult {
  mockCode?: string
}

export interface UpdatePasswordParams {
  phone: string
  code: string
  newPassword: string
}

export interface UpdatePhoneParams {
  phone: string
  code: string
}

export async function sendSecurityCode(params: SendSecurityCodeParams): Promise<SendSecurityCodeResult> {
  if (import.meta.env.DEV)
    return { mockCode: await mockSendSecurityCode(params) }

  throw new Error('sendSecurityCode 接口未实现')
}

export async function updatePassword(params: UpdatePasswordParams): Promise<void> {
  if (import.meta.env.DEV) {
    await mockUpdatePassword(params)
    return
  }

  throw new Error('updatePassword 接口未实现')
}

export async function updatePhone(params: UpdatePhoneParams): Promise<void> {
  if (import.meta.env.DEV) {
    await mockUpdatePhone(params)
    return
  }

  throw new Error('updatePhone 接口未实现')
}
