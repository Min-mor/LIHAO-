import type { Component } from "vue"

export type UserRole = "merchant" | "admin"

export interface SidebarItem {
  label: string
  icon: Component
  path: string
  badge?: number
  variant?: "default" | "logout"
}

export interface StatCard {
  id: string
  title: string
  description: string
  value: string
  icon: Component
  accent: string
}

export interface ChartDatum {
  label: string
  value: number
}

export interface ChartConfig {
  id: string
  title: string
  subtitle?: string
  type: "bar" | "line"
  data: ChartDatum[]
}

export interface QuickLink {
  id: string
  label: string
  action: string
}

export interface ProfileInfo {
  userId: string
  username: string
  role: string
  avatar?: string | null
}

export interface ReminderItem {
  id: string
  title: string
  detail: string
  time: string
  tone: "success" | "info" | "warning" | "error"
}

export interface ReminderToneMeta {
  icon: Component
  iconBg: string
  iconText: string
}
