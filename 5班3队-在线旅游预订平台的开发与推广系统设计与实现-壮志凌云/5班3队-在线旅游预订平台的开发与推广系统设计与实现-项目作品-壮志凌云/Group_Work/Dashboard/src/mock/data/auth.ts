type UserRole = "merchant" | "admin"

interface MockUser {
  phone: string
  password: string
  role: UserRole
}

export async function mockTrustedLogin(phone: string) {
  const user = ensureUser(phone)
  return {
    token: createToken(user.phone, user.role),
    role: user.role,
    isNew: !user.password,
  }
}

const mockUsers: MockUser[] = [
  {
    phone: "13800138000",
    password: "merchant123",
    role: "merchant",
  },
  {
    phone: "13900139000",
    password: "admin123",
    role: "admin",
  },
]

const verificationStore = new Map<string, { code: string; expires: number }>()
const CODE_TTL = 5 * 60 * 1000

function createToken(phone: string, role: UserRole) {
  return btoa(`${phone}:${role}:${Date.now()}`)
}

function ensureUser(phone: string): MockUser {
  let user = mockUsers.find((item) => item.phone === phone)
  if (!user) {
    user = { phone, password: "", role: "merchant" }
    mockUsers.push(user)
  }
  return user
}

export async function mockSendVerificationCode(phone: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  verificationStore.set(phone, { code, expires: Date.now() + CODE_TTL })
  return { message: "验证码已发送", code }
}

export async function mockLoginOrRegisterWithCode(phone: string, code: string) {
  const record = verificationStore.get(phone)
  if (!record || record.expires < Date.now()) {
    throw new Error("验证码已过期，请重新获取")
  }
  if (record.code !== code) {
    throw new Error("验证码错误")
  }
  const user = ensureUser(phone)
  verificationStore.delete(phone)
  return {
    token: createToken(user.phone, user.role),
    role: user.role,
    isNew: !user.password,
  }
}

export async function mockLoginWithPassword(phone: string, password: string) {
  const user = mockUsers.find((item) => item.phone === phone)
  if (!user || user.password !== password) {
    throw new Error("账号或密码错误")
  }
  return {
    token: createToken(user.phone, user.role),
    role: user.role,
  }
}
