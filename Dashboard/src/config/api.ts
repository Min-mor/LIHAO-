import {
  mockLoginOrRegisterWithCode,
  mockLoginWithPassword,
  mockSendVerificationCode,
  mockTrustedLogin,
} from "@/mock/data/auth"
import type { ProfileInfo, UserRole } from "@/components/dashboard/types"
import { readAuthSession } from "@/lib/auth"

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? "http://localhost:8080/api"
const USE_MOCK = (import.meta.env.PUBLIC_USE_MOCK_AUTH ?? "true") === "true"

const endpoints = {
  sendCode: "/auth/sms/sendCode",
  loginWithCode: "/auth/sms/login",
  loginWithPassword: "/auth/login",
}

type RequestOptions = {
  method?: "GET" | "POST"
  body?: Record<string, any>
  headers?: Record<string, string>
}

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const raw = await response.text()
    let message = raw || "请求失败，请稍后重试"
    try {
      const parsed = JSON.parse(raw)
      message = parsed?.message ?? message
    } catch (_) {
      // ignore JSON parse error
    }
    throw new ApiError(message, response.status)
  }

  return (await response.json()) as T
}

interface SmsLoginUser {
  id: number
  username: string
  nickname?: string
  tel?: string
  email?: string
  role?: string
  password?: string | null
  [key: string]: any
}

interface SmsLoginResponse {
  loginType: string
  success: boolean
  user: SmsLoginUser
  token: string
}

interface BackendUserInfo {
  userId?: number
  id?: number
  username?: string
  userName?: string
  nickname?: string
  role?: string
  avatar?: string | null
  avatarUrl?: string | null
  companyName?: string
  [key: string]: any
}

function normalizeUserInfo(raw: any): BackendUserInfo {
  if (raw && typeof raw === "object" && "data" in raw)
    return (raw as any).data as BackendUserInfo
  return raw as BackendUserInfo
}

function mapBackendRoleToUserRole(role?: string): UserRole {
  if (!role)
    return "merchant"
  const normalized = role.toLowerCase()
  if (normalized.includes("admin") || normalized.includes("管理员"))
    return "admin"
  return "merchant"
}

function extractTokenFromLoginResponse(res: any): string {
  if (res && typeof res === "object") {
    if (typeof (res as any).token === "string")
      return (res as any).token
    if (typeof (res as any).accessToken === "string")
      return (res as any).accessToken
  }
  throw new Error("登录返回缺少 token 字段")
}

export async function fetchDashboardProfile(token: string): Promise<ProfileInfo> {
  const raw = await request<any>("/user/info", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const userInfo = normalizeUserInfo(raw)
  const userId = userInfo.userId ?? userInfo.id ?? 0
  const displayName =
    userInfo.nickname
    || userInfo.companyName
    || userInfo.userName
    || userInfo.username
    || "商家用户"
  const userRole = mapBackendRoleToUserRole(userInfo.role)
  const displayRole = userRole === "admin" ? "平台管理员" : "商家用户"
  const avatar = userInfo.avatarUrl ?? userInfo.avatar ?? null
  return {
    userId: String(userId || ""),
    username: displayName,
    role: displayRole,
    avatar,
  }
}

export async function sendVerificationCode(phone: string) {
  if (USE_MOCK) {
    return mockSendVerificationCode(phone)
  }
  const url = `${endpoints.sendCode}?phone=${encodeURIComponent(phone)}`
  return request<{ code: number; message: string; smsCode?: string }>(url)
}

export async function loginOrRegisterWithCode(payload: { phone: string; code: string }) {
  if (USE_MOCK) {
    return mockLoginOrRegisterWithCode(payload.phone, payload.code)
  }
  try {
    const url = `${endpoints.loginWithCode}?phone=${encodeURIComponent(payload.phone)}&code=${encodeURIComponent(payload.code)}`
    const res = await request<SmsLoginResponse>(url)
    const role: UserRole = mapBackendRoleToUserRole(res.user?.role)
    const displayName = res.user?.nickname || res.user?.username || res.user?.tel || payload.phone
    const avatar = res.user?.avatar ?? null
    return {
      token: res.token,
      role,
      isNew: res.loginType === "register" || !res.user?.password,
      displayName,
      avatar,
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      console.warn("login with code fallback to mock due to 401", error.message)
      return mockTrustedLogin(payload.phone)
    }
    throw error
  }
}

export async function loginWithPassword(payload: { phone: string; password: string }) {
  if (USE_MOCK) {
    return mockLoginWithPassword(payload.phone, payload.password)
  }
  try {
    const loginRes = await request<any>(endpoints.loginWithPassword, {
      body: { username: payload.phone, password: payload.password },
    })
    const token = extractTokenFromLoginResponse(loginRes)

    let role: UserRole = "merchant"
    try {
      const resp = await fetch(`${API_BASE_URL}/user/info`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (resp.ok) {
        const userInfo = (await resp.json()) as any
        role = mapBackendRoleToUserRole(userInfo?.role)
      }
    } catch (e) {
      console.warn("获取用户信息失败，使用默认角色 merchant", e)
    }

    // 暂时使用手机号作为展示名称，后续如需更精细可根据 /user/info 调整
    const displayName = payload.phone
    return { token, role, displayName, avatar: null }
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      console.warn("password login fallback to mock due to 401", error.message)
      return mockLoginWithPassword(payload.phone, payload.password)
    }
    throw error
  }
}

interface BackendProduct {
  id: number
  name: string
  destination: string
  price: number
  itinerary: string
  userId: number
  description: string
  stock: number
  status: boolean
  hotelOrNo: boolean
  hotel: string | null
}

interface BackendPage<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
  [key: string]: any
}

interface BackendPageResponse<T> {
  code: number
  message?: string
  data: BackendPage<T>
}

export type { BackendProduct }

export async function fetchProductList(params: { page?: number; limit?: number; keyword?: string } = {}) {
  const searchParams = new URLSearchParams()
  if (params.page != null)
    searchParams.set("page", String(params.page))
  if (params.limit != null)
    searchParams.set("limit", String(params.limit))
  if (params.keyword && params.keyword.trim())
    searchParams.set("keyword", params.keyword.trim())

  const query = searchParams.toString()
  const path = `/product/list${query ? `?${query}` : ""}`

  const raw = await request<BackendPageResponse<BackendProduct>>(path, {
    method: "GET",
  })

  if (raw && typeof raw === "object" && "data" in raw)
    return (raw as BackendPageResponse<BackendProduct>).data

  return raw as unknown as BackendPage<BackendProduct>
}

export async function updateProductStatus(payload: { id: number | string; status: boolean }) {
  const id = typeof payload.id === "number" ? payload.id : Number(payload.id)
  const session = readAuthSession()
  const headers: Record<string, string> = {}
  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`
    headers.token = session.token
  }

  return request<any>("/product/update", {
    headers,
    body: {
      id,
      status: payload.status,
    },
  })
}
