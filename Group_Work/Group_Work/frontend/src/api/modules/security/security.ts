import { httpPost } from '@/http/http'
import { getEnvBaseUrl } from '@/utils'

export type SecurityScene = 'login' | 'password' | 'phone'

export interface ApiSendSecurityCodeParams {
  phone: string
  scene: SecurityScene
}

export interface ApiSendSecurityCodeResult {
  code: number
  message: string
  smsCode?: string
}

export function apiSendSecurityCode(params: ApiSendSecurityCodeParams) {
  const baseUrl = getEnvBaseUrl().replace(/\/$/, '')
  const url = `${baseUrl}/auth/sms/sendCode`
  return new Promise<ApiSendSecurityCodeResult>((resolve, reject) => {
    uni.request({
      url,
      method: 'POST',
      dataType: 'json',
      timeout: 60000,
      header: { 'Content-Type': 'application/json' },
      data: {},
      query: { phone: params.phone },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300 && res.data)
          resolve(res.data as ApiSendSecurityCodeResult)
        else
          reject(new Error((res.data as any)?.message || '发送验证码失败'))
      },
      fail: reject,
    })
  })
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
