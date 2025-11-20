import { httpPost } from '@/http/http'

export type SecurityScene = 'login' | 'password' | 'phone'

export interface ApiSendSecurityCodeParams {
  phone: string
  scene: SecurityScene
}

export interface ApiSendSecurityCodeResult {
  code?: string
}

export function apiSendSecurityCode(params: ApiSendSecurityCodeParams) {
  return httpPost<ApiSendSecurityCodeResult>('/security/sendCode', params)
}

export interface ApiUpdatePasswordParams {
  phone: string
  code: string
  newPassword: string
}

export function apiUpdatePassword(params: ApiUpdatePasswordParams) {
  return httpPost<void>('/security/updatePassword', params)
}

export interface ApiUpdatePhoneParams {
  phone: string
  code: string
}

export function apiUpdatePhone(params: ApiUpdatePhoneParams) {
  return httpPost<void>('/security/updatePhone', params)
}
