import { apiSendSecurityCode, apiUpdatePassword, apiUpdatePhone } from '@/api/modules/security/security'
import { mockSendSecurityCode, mockUpdatePassword, mockUpdatePhone } from '@/mock/security'

export type SecurityScene = 'login' | 'password' | 'phone'

export interface SendSecurityCodeParams {
  phone: string
  scene: SecurityScene
}

export interface SendSecurityCodeResult {
  code?: string
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
    return { code: await mockSendSecurityCode(params) }

  const res = await apiSendSecurityCode(params)
  return { code: res.code }
}

export async function updatePassword(params: UpdatePasswordParams): Promise<void> {
  if (import.meta.env.DEV) {
    await mockUpdatePassword(params)
    return
  }

  await apiUpdatePassword(params)
}

export async function updatePhone(params: UpdatePhoneParams): Promise<void> {
  if (import.meta.env.DEV) {
    await mockUpdatePhone(params)
    return
  }

  await apiUpdatePhone(params)
}
