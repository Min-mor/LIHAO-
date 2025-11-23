import { mockLoginOrRegisterWithCode, mockLoginWithPassword, mockSendVerificationCode } from "@/mock/data/auth"

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? "http://localhost:8080"
const USE_MOCK = (import.meta.env.PUBLIC_USE_MOCK_AUTH ?? "true") === "true" || import.meta.env.DEV

const endpoints = {
  sendCode: "/auth/send-code",
  loginWithCode: "/auth/login-or-register",
  loginWithPassword: "/auth/password-login",
}

type RequestOptions = {
  method?: "GET" | "POST"
  body?: Record<string, any>
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
    const errorText = await response.text()
    throw new Error(errorText || "请求失败，请稍后重试")
  }

  return (await response.json()) as T
}

export async function sendVerificationCode(phone: string) {
  if (USE_MOCK) {
    return mockSendVerificationCode(phone)
  }
  return request<{ message: string }>(endpoints.sendCode, { body: { phone } })
}

export async function loginOrRegisterWithCode(payload: { phone: string; code: string }) {
  if (USE_MOCK) {
    return mockLoginOrRegisterWithCode(payload.phone, payload.code)
  }
  return request<{ token: string; role: string }>(endpoints.loginWithCode, { body: payload })
}

export async function loginWithPassword(payload: { phone: string; password: string }) {
  if (USE_MOCK) {
    return mockLoginWithPassword(payload.phone, payload.password)
  }
  return request<{ token: string; role: string }>(endpoints.loginWithPassword, { body: payload })
}
