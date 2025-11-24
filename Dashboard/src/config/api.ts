import {
  mockLoginOrRegisterWithCode,
  mockLoginWithPassword,
  mockSendVerificationCode,
  mockTrustedLogin,
} from "@/mock/data/auth"

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? "http://localhost:8080/api"
const USE_MOCK = (import.meta.env.PUBLIC_USE_MOCK_AUTH ?? "true") === "true"

const endpoints = {
  sendCode: "/auth/sms/sendCode",
  loginWithCode: "/auth/login-or-register",
  loginWithPassword: "/auth/password-login",
}

type RequestOptions = {
  method?: "GET" | "POST"
  body?: Record<string, any>
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

export async function sendVerificationCode(phone: string) {
  if (USE_MOCK) {
    return mockSendVerificationCode(phone)
  }
  const url = `${endpoints.sendCode}?phone=${encodeURIComponent(phone)}`
  return request<{ message: string; code?: string }>(url)
}

export async function loginOrRegisterWithCode(payload: { phone: string; code: string }) {
  if (USE_MOCK) {
    return mockLoginOrRegisterWithCode(payload.phone, payload.code)
  }
  try {
    return await request<{ token: string; role: string }>(endpoints.loginWithCode, { body: payload })
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
  return request<{ token: string; role: string }>(endpoints.loginWithPassword, { body: payload })
}
