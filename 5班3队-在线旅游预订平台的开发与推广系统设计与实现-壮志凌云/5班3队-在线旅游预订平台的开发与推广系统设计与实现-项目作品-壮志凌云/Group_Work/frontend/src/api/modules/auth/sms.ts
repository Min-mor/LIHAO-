import { getEnvBaseUrl } from '@/utils'

export interface SmsLoginParams {
  phone: string
  code: string
}

export interface SmsLoginResponseUser {
  id: number
  username: string
  nickname?: string
  password?: string | null
  tel?: string
  email?: string
  role?: string
  avatar?: string
  status?: boolean
  [key: string]: any
}

export interface SmsLoginResponse {
  loginType: string
  success: boolean
  user: SmsLoginResponseUser
  token: string
}

export function smsLogin(params: SmsLoginParams) {
  const baseUrl = getEnvBaseUrl().replace(/\/$/, '')
  const url = `${baseUrl}/auth/sms/login`
  return new Promise<SmsLoginResponse>((resolve, reject) => {
    uni.request({
      url,
      method: 'POST',
      dataType: 'json',
      timeout: 60000,
      header: { 'Content-Type': 'application/json' },
      data: {},
      query: params,
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300 && res.data)
          resolve(res.data as SmsLoginResponse)
        else
          reject(new Error((res.data as any)?.message || '短信登录失败'))
      },
      fail: reject,
    })
  })
}
