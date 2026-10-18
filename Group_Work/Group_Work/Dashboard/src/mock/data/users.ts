import type { ProfileInfo, UserRole } from "@/components/dashboard/types"

export interface MockUserRecord {
  userId: string
  phone: string
  password: string
  role: UserRole
  username: string
  roleLabel: string
  avatar?: string | null
}

export const mockUsers: MockUserRecord[] = [
  {
    userId: "merchant-001",
    phone: "13800138000",
    password: "merchant123",
    role: "merchant",
    username: "山川旅行社",
    roleLabel: "商家用户",
    avatar: null,
  },
  {
    userId: "admin-ops-07",
    phone: "13900139000",
    password: "admin123",
    role: "admin",
    username: "运营值守专员",
    roleLabel: "管理员",
    avatar: null,
  },
]

export function findUserByPhone(phone: string) {
  return mockUsers.find((item) => item.phone === phone)
}

export function findUserByRole(role: UserRole) {
  return mockUsers.find((item) => item.role === role)
}

function nextMerchantId() {
  const count = mockUsers.filter((item) => item.role === "merchant").length + 1
  return `merchant-${String(count).padStart(3, "0")}`
}

export function createMerchantUser(phone: string) {
  const newUser: MockUserRecord = {
    userId: nextMerchantId(),
    phone,
    password: "",
    role: "merchant",
    username: `新商家 ${phone.slice(-4)}`,
    roleLabel: "商家用户",
    avatar: null,
  }
  mockUsers.push(newUser)
  return newUser
}

export function ensureMerchantUser(phone: string) {
  return findUserByPhone(phone) ?? createMerchantUser(phone)
}

export function toProfileInfo(user: MockUserRecord): ProfileInfo {
  return {
    userId: user.userId,
    username: user.username,
    role: user.roleLabel,
    avatar: user.avatar ?? null,
  }
}

export function getProfileByRole(role: UserRole): ProfileInfo {
  const fallback: ProfileInfo = {
    userId: `${role}-guest`,
    username: role === "admin" ? "管理员" : "商家用户",
    role: role === "admin" ? "管理员" : "商家用户",
    avatar: null,
  }
  const user = findUserByRole(role)
  return user ? toProfileInfo(user) : fallback
}
