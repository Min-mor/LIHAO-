import { apiSendSecurityCode, apiUpdatePassword, apiUpdatePhone } from '@/api/modules/security/security'
import { mockUpdatePassword, mockUpdatePhone } from '@/mock/security'

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

const SMS_VENDOR_MODE = import.meta.env.VITE_SMS_VENDOR_MODE || 'none'
const SMS_VENDOR_ENDPOINT = import.meta.env.VITE_SMS_VENDOR_ENDPOINT || ''
const SMS_VENDOR_NAME = import.meta.env.VITE_SMS_VENDOR_NAME || ''

async function triggerVendorSms(phone: string, code?: string) {
  if (SMS_VENDOR_MODE !== 'vendor' || !SMS_VENDOR_ENDPOINT || !code)
    return

  await new Promise<void>((resolve, reject) => {
    uni.request({
      url: SMS_VENDOR_ENDPOINT,
      method: 'POST',
      dataType: 'json',
      header: { 'Content-Type': 'application/json' },
      data: {
        targets: phone,
        code,
        ...(SMS_VENDOR_NAME ? { name: SMS_VENDOR_NAME } : {}),
      },
      success: () => resolve(),
      fail: reject,
    })
  })
}

export async function sendSecurityCode(params: SendSecurityCodeParams): Promise<SendSecurityCodeResult> {
  const res = await apiSendSecurityCode(params)
  if (res.code !== 200)
    throw new Error(res.message || '验证码发送失败')

  try {
    await triggerVendorSms(params.phone, res.smsCode)
  }
  catch (error) {
    console.warn('[sms] vendor send failed', error)
    uni.showToast({ title: '验证码发送成功，短信通道异常', icon: 'none' })
  }

  return { code: import.meta.env.DEV ? res.smsCode : undefined }
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
