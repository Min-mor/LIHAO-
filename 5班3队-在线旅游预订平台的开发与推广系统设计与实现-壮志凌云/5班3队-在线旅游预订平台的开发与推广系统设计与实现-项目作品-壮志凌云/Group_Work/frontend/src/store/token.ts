import type {
  ILoginForm,
} from '@/api/modules/auth/login'
import type { SmsLoginResponseUser } from '@/api/modules/auth/sms'
import type { IAuthLoginRes, IUserInfoRes } from '@/api/modules/auth/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue' // 修复：导入 computed
import {
  login as _login,
  logout as _logout,
  refreshToken as _refreshToken,
  wxLogin as _wxLogin,
  getWxCode,
} from '@/api/modules/auth/login'
import { smsLogin } from '@/api/modules/auth/sms'
import { isDoubleTokenRes, isSingleTokenRes } from '@/api/modules/auth/types'
import { mockLoginByPhone, resetActiveUser } from '@/mock/auth'
import { isDoubleTokenMode } from '@/utils'
import { useUserStore } from './user'

const DEFAULT_TOKEN_EXPIRE_SECONDS = 7 * 24 * 60 * 60 // 7天兜底

function decodeBase64Url(segment: string) {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4))
  const base64 = normalized + padding
  if (typeof atob === 'function')
    return atob(base64)

  // 手写兜底，仅在极端环境下使用
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let result = ''
  let buffer = 0
  let bitCount = 0
  for (const char of base64.replace(/=+$/, '')) {
    const index = chars.indexOf(char)
    if (index === -1)
      continue
    buffer = (buffer << 6) | index
    bitCount += 6
    if (bitCount >= 8) {
      bitCount -= 8
      const byte = (buffer >> bitCount) & 0xFF
      result += String.fromCharCode(byte)
    }
  }
  return result
}

function parseJwtExpireSeconds(token: string) {
  try {
    const segments = token.split('.')
    if (segments.length < 2)
      return DEFAULT_TOKEN_EXPIRE_SECONDS

    const decoded = decodeBase64Url(segments[1])
    if (!decoded)
      return DEFAULT_TOKEN_EXPIRE_SECONDS

    const payload = JSON.parse(decoded)
    if (payload.exp) {
      const diffMs = payload.exp * 1000 - Date.now()
      if (diffMs > 0)
        return Math.floor(diffMs / 1000)
    }
  }
  catch (error) {
    console.warn('[auth] 解析 token 过期时间失败', error)
  }
  return DEFAULT_TOKEN_EXPIRE_SECONDS
}

function mapUserInfoFromSms(user: SmsLoginResponseUser): IUserInfoRes {
  const phone = user.tel || ''
  return {
    userId: user.id,
    nickname: user.nickname || user.username || `用户_${user.id}`,
    avatar: user.avatar || '',
    username: user.username,
    phone,
    tel: phone,
    email: user.email,
    role: user.role,
    status: user.status,
  } as IUserInfoRes
}

// 初始化状态
const tokenInfoState = isDoubleTokenMode
  ? {
      accessToken: '',
      accessExpiresIn: 0,
      refreshToken: '',
      refreshExpiresIn: 0,
    }
  : {
      token: '',
      expiresIn: 0,
    }

export const useTokenStore = defineStore(
  'token',
  () => {
    // 定义用户信息
    const tokenInfo = ref<IAuthLoginRes>({ ...tokenInfoState })
    // 设置用户信息
    const setTokenInfo = (val: IAuthLoginRes) => {
      tokenInfo.value = val

      // 计算并存储过期时间
      const now = Date.now()
      if (isSingleTokenRes(val)) {
        // 单token模式
        const expireTime = now + val.expiresIn * 1000
        uni.setStorageSync('accessTokenExpireTime', expireTime)
      }
      else if (isDoubleTokenRes(val)) {
        // 双token模式
        const accessExpireTime = now + val.accessExpiresIn * 1000
        const refreshExpireTime = now + val.refreshExpiresIn * 1000
        uni.setStorageSync('accessTokenExpireTime', accessExpireTime)
        uni.setStorageSync('refreshTokenExpireTime', refreshExpireTime)
      }
    }

    const loginBySms = async (phone: string, code: string) => {
      try {
        const res = await smsLogin({ phone, code })
        if (!res?.token) {
          throw new Error('登录返回信息缺少 token')
        }
        const expiresIn = parseJwtExpireSeconds(res.token)
        await _postLogin({ token: res.token, expiresIn }, mapUserInfoFromSms(res.user))
        uni.showToast({
          title: '登录成功',
          icon: 'success',
        })
        return res
      }
      catch (error) {
        console.error('短信登录失败:', error)
        uni.showToast({
          title: error instanceof Error ? error.message : '短信登录失败，请重试',
          icon: 'none',
        })
        throw error
      }
    }

    /**
     * 判断token是否过期
     */
    const isTokenExpired = computed(() => {
      if (!tokenInfo.value) {
        return true
      }

      const now = Date.now()
      const expireTime = uni.getStorageSync('accessTokenExpireTime')

      if (!expireTime)
        return true
      return now >= expireTime
    })

    /**
     * 判断refreshToken是否过期
     */
    const isRefreshTokenExpired = computed(() => {
      if (!isDoubleTokenMode)
        return true

      const now = Date.now()
      const refreshExpireTime = uni.getStorageSync('refreshTokenExpireTime')

      if (!refreshExpireTime)
        return true
      return now >= refreshExpireTime
    })

    /**
     * 登录成功后处理逻辑
     * @param tokenInfo 登录返回的token信息
     */
    async function _postLogin(tokenInfo: IAuthLoginRes, userInfo?: IUserInfoRes) {
      setTokenInfo(tokenInfo)
      const userStore = useUserStore()
      if (userInfo) {
        userStore.setUserInfo(userInfo)
      }
      else {
        await userStore.fetchUserInfo()
      }
    }

    /**
     * 用户登录
     * 有的时候后端会用一个接口返回token和用户信息，有的时候会分开2个接口，一个获取token，一个获取用户信息
     * （各有利弊，看业务场景和系统复杂度），这里使用2个接口返回的来模拟
     * @param loginForm 登录参数
     * @returns 登录结果
     */
    const login = async (loginForm: ILoginForm) => {
      try {
        const res = await _login(loginForm)
        console.log('普通登录-res: ', res)
        await _postLogin(res)
        uni.showToast({
          title: '登录成功',
          icon: 'success',
        })
        return res
      }
      catch (error) {
        console.error('登录失败:', error)
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'error',
        })
        throw error
      }
    }

    const loginByPhoneMock = async (phone: string, password?: string) => {
      if (!import.meta.env.DEV) {
        throw new Error('mock 登录仅在开发环境可用')
      }
      try {
        const res = await mockLoginByPhone(phone, password)
        await _postLogin(res)
        uni.showToast({
          title: '登录成功',
          icon: 'success',
        })
        return res
      }
      catch (error) {
        const message = error instanceof Error ? error.message : '登录失败，请重试'
        uni.showToast({
          title: message,
          icon: 'none',
        })
        throw error
      }
    }

    /**
     * 微信登录
     * 有的时候后端会用一个接口返回token和用户信息，有的时候会分开2个接口，一个获取token，一个获取用户信息
     * （各有利弊，看业务场景和系统复杂度），这里使用2个接口返回的来模拟
     * @returns 登录结果
     */
    const wxLogin = async () => {
      try {
        // 获取微信小程序登录的code
        const code = await getWxCode()
        console.log('微信登录-code: ', code)
        const res = await _wxLogin(code)
        console.log('微信登录-res: ', res)
        await _postLogin(res)
        uni.showToast({
          title: '登录成功',
          icon: 'success',
        })
        return res
      }
      catch (error) {
        console.error('微信登录失败:', error)
        uni.showToast({
          title: '微信登录失败，请重试',
          icon: 'error',
        })
        throw error
      }
    }

    /**
     * 退出登录 并 删除用户信息
     */
    const logout = async () => {
      try {
        // TODO 实现自己的退出登录逻辑
        await _logout()
      }
      catch (error) {
        console.error('退出登录失败:', error)
      }
      finally {
        // 无论成功失败，都需要清除本地token信息
        // 清除存储的过期时间
        uni.removeStorageSync('accessTokenExpireTime')
        uni.removeStorageSync('refreshTokenExpireTime')
        console.log('退出登录-清除用户信息')
        tokenInfo.value = { ...tokenInfoState }
        uni.removeStorageSync('token')
        const userStore = useUserStore()
        userStore.clearUserInfo()
        if (import.meta.env.DEV) {
          resetActiveUser()
        }
      }
    }

    const logoutByMock = async () => {
      // TODO【可选】：如果登录数据结构比较复杂，可以在这里做细化处理。演示demo只做简单处理
      tokenInfo.value = { ...tokenInfoState }
      uni.removeStorageSync('accessTokenExpireTime')
      uni.removeStorageSync('refreshTokenExpireTime')
      resetActiveUser()
      const userStore = useUserStore()
      userStore.clearUserInfo()
    }

    /**
     * 刷新token
     * @returns 刷新结果
     */
    const refreshToken = async () => {
      if (!isDoubleTokenMode) {
        console.error('单token模式不支持刷新token')
        throw new Error('单token模式不支持刷新token')
      }

      try {
        // 安全检查，确保refreshToken存在
        if (!isDoubleTokenRes(tokenInfo.value) || !tokenInfo.value.refreshToken) {
          throw new Error('无效的refreshToken')
        }

        const refreshToken = tokenInfo.value.refreshToken
        const res = await _refreshToken(refreshToken)
        console.log('刷新token-res: ', res)
        setTokenInfo(res)
        return res
      }
      catch (error) {
        console.error('刷新token失败:', error)
        throw error
      }
    }

    /**
     * 获取有效的token
     * 注意：在computed中不直接调用异步函数，只做状态判断
     * 实际的刷新操作应由调用方处理
     */
    const getValidToken = computed(() => {
      // token已过期，返回空
      if (isTokenExpired.value) {
        return ''
      }

      if (!isDoubleTokenMode) {
        return isSingleTokenRes(tokenInfo.value) ? tokenInfo.value.token : ''
      }
      else {
        return isDoubleTokenRes(tokenInfo.value) ? tokenInfo.value.accessToken : ''
      }
    })

    /**
     * 检查是否有登录信息（不考虑token是否过期）
     */
    const hasLoginInfo = computed(() => {
      if (!tokenInfo.value) {
        return false
      }
      if (isDoubleTokenMode) {
        return isDoubleTokenRes(tokenInfo.value) && !!tokenInfo.value.accessToken
      }
      else {
        return isSingleTokenRes(tokenInfo.value) && !!tokenInfo.value.token
      }
    })

    /**
     * 检查是否已登录且token有效
     */
    const hasValidLogin = computed(() => {
      console.log('hasValidLogin', hasLoginInfo.value, !isTokenExpired.value)
      return hasLoginInfo.value && !isTokenExpired.value
    })

    /**
     * 尝试获取有效的token，如果过期且可刷新，则刷新token
     * @returns 有效的token或空字符串
     */
    const tryGetValidToken = async (): Promise<string> => {
      if (!getValidToken.value && isDoubleTokenMode && !isRefreshTokenExpired.value) {
        try {
          await refreshToken()
          return getValidToken.value
        }
        catch (error) {
          console.error('尝试刷新token失败:', error)
          return ''
        }
      }
      return getValidToken.value
    }

    return {
      // 核心API方法
      login,
      loginByPhoneMock,
      loginBySms,
      wxLogin,
      logout,
      logoutByMock,

      // 认证状态判断（最常用的）
      hasLogin: hasValidLogin,

      // 内部系统使用的方法
      refreshToken,
      tryGetValidToken,
      validToken: getValidToken,

      // 调试或特殊场景可能需要直接访问的信息
      tokenInfo,
      setTokenInfo,
    }
  },
  {
    // 添加持久化配置，确保刷新页面后token信息不丢失
    persist: true,
  },
)
