import type {
  IAuthLoginRes,
  ICaptcha,
  IDoubleTokenRes,
  ILoginForm,
  IUpdateInfo,
  IUpdatePassword,
  IUserInfoRes,
} from './types'
import { http } from '@/http/http'

export const authService = {
  getCode(): Promise<ICaptcha> {
    return http.get<ICaptcha>('/user/getCode')
  },

  login(payload: ILoginForm): Promise<IAuthLoginRes> {
    return http.post<IAuthLoginRes>('/auth/login', payload)
  },

  refreshToken(refreshToken: string): Promise<IDoubleTokenRes> {
    return http.post<IDoubleTokenRes>('/auth/refreshToken', { refreshToken })
  },

  getUserInfo(): Promise<IUserInfoRes> {
    return http.get<IUserInfoRes>('/user/info')
  },

  logout(): Promise<void> {
    return http.get<void>('/auth/logout')
  },

  updateInfo(data: IUpdateInfo) {
    return http.post('/user/updateInfo', data)
  },

  updateUserPassword(data: IUpdatePassword) {
    return http.post('/user/updatePassword', data)
  },

  getWxCode() {
    return new Promise<UniApp.LoginRes>((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: res => resolve(res),
        fail: err => reject(new Error(err)),
      })
    })
  },

  wxLogin(data: { code: string }): Promise<IAuthLoginRes> {
    return http.post<IAuthLoginRes>('/auth/wxLogin', data)
  },
}
