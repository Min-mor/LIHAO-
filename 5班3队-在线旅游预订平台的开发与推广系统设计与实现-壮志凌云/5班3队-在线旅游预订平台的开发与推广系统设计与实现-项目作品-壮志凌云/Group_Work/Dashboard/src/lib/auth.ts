import type { UserRole } from "@/components/dashboard/types"

export interface AuthSession {
  token: string
  role: UserRole
  phone?: string
  isNew?: boolean
  /**
   * 用于展示的用户昵称/商家名称，来源于后端登录返回
   */
  displayName?: string
  /**
   * 头像链接，可选
   */
  avatar?: string | null
  timestamp?: number
}

const AUTH_STORAGE_KEY = "trip-dashboard-auth"

function isBrowser() {
  return typeof window !== "undefined"
}

export function readAuthSession(): AuthSession | null {
  if (!isBrowser()) return null
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthSession
  } catch (error) {
    console.warn("Failed to parse auth session", error)
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

export function writeAuthSession(session: AuthSession) {
  if (!isBrowser()) return
  const payload: AuthSession = {
    ...session,
    timestamp: Date.now(),
  }
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload))
}

export function clearAuthSession() {
  if (!isBrowser()) return
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export { AUTH_STORAGE_KEY }
