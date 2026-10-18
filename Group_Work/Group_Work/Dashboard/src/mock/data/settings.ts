import type { Component } from "vue"
import type { UserRole } from "@/components/dashboard/types"
import {
  ActivitySquare,
  BellRing,
  CreditCard,
  Database,
  Mail,
  ServerCog,
  ShieldCheck,
  Store,
  UsersRound,
} from "lucide-vue-next"

export type SettingTab = {
  value: string
  label: string
}

export interface RolePolicy {
  id: string
  name: string
  users: number
  permissions: string[]
  critical?: boolean
}

export interface ToggleSetting {
  id: string
  label: string
  description: string
  enabled: boolean
  badge?: string
}

export interface IntegrationCard {
  id: string
  name: string
  description: string
  status: "connected" | "action_required"
  icon: Component
  accent: string
  hint?: string
}

export interface ShopProfileField {
  id: string
  label: string
  value: string
  hint?: string
}

export interface ChannelStatus {
  id: string
  name: string
  status: "connected" | "action_required"
  description: string
}

export interface AuditLogEntry {
  id: string
  action: string
  actor: string
  time: string
  channel: string
  risk: "low" | "medium" | "high"
}

export interface ComplianceBadge {
  id: string
  label: string
  status: "pass" | "attention"
  detail: string
}

export interface SettingsDataset {
  tabs: SettingTab[]
  platform: {
    roles: RolePolicy[]
    approvals: ToggleSetting[]
    integrations: IntegrationCard[]
  }
  shop: {
    profile: ShopProfileField[]
    notifications: ToggleSetting[]
    channels: ChannelStatus[]
  }
  security: {
    policies: ToggleSetting[]
    compliance: ComplianceBadge[]
    auditLogs: AuditLogEntry[]
  }
}

function createAdminSettings(): SettingsDataset {
  return {
    tabs: [
      { value: "platform", label: "平台设置" },
      { value: "shop", label: "商家协作" },
      { value: "security", label: "安全与合规" },
    ],
    platform: {
      roles: [
        { id: "role-admin", name: "管理员", users: 5, permissions: ["全局访问", "系统配置"], critical: true },
        { id: "role-merchant", name: "商家", users: 128, permissions: ["商品管理", "订单处理"] },
        { id: "role-support", name: "客服", users: 18, permissions: ["工单处理", "消息回复"] },
      ],
      approvals: [
        { id: "ap-merchant", label: "商家入驻审批", description: "提交新商家资料后需要双人审核。", enabled: true },
        {
          id: "ap-dispute",
          label: "订单争议自动升级",
          description: "超 48 小时未处理的争议自动升级给运营。",
          enabled: true,
        },
        {
          id: "ap-campaign",
          label: "活动发布门槛",
          description: "大型活动需至少 1 位管理员复核。",
          enabled: false,
          badge: "推荐",
        },
      ],
      integrations: [
        {
          id: "payment",
          name: "支付网关",
          description: "Stripe, Adyen, PayPal",
          status: "connected",
          icon: CreditCard,
          accent: "text-primary",
          hint: "实时同步结算状态",
        },
        {
          id: "analytics",
          name: "数据分析",
          description: "Looker Studio, GA4",
          status: "connected",
          icon: ActivitySquare,
          accent: "text-emerald-600",
          hint: "用于 KPI 看板",
        },
        {
          id: "email",
          name: "邮件服务",
          description: "SendGrid, Tencent SES",
          status: "action_required",
          icon: Mail,
          accent: "text-amber-500",
          hint: "待补充发件域名记录",
        },
        {
          id: "crm",
          name: "商家 CRM",
          description: "Salesforce, 飞书 CRM",
          status: "action_required",
          icon: Database,
          accent: "text-sky-600",
          hint: "需要新的 API KEY",
        },
      ],
    },
    shop: {
      profile: [
        { id: "brand", label: "平台品牌", value: "Trip 管理平台" },
        { id: "domain", label: "商家门户域名", value: "merchant.trip.com" },
        { id: "hotline", label: "客服热线", value: "400-888-0000" },
        { id: "sla", label: "SLA 目标", value: "首次响应 < 15 分钟" },
      ],
      notifications: [
        { id: "notify-announcement", label: "商家公告推送", description: "发布公告时给全部商家推送。", enabled: true },
        { id: "notify-finance", label: "结算提醒", description: "结算异常或延迟时通知管理员。", enabled: true },
        { id: "notify-risk", label: "风险预警", description: "监测到异常订单即刻提醒。", enabled: false },
      ],
      channels: [
        {
          id: "wechat",
          name: "微信服务号",
          status: "connected",
          description: "已绑定 Trip 官方服务号，用于模板消息通知。",
        },
        {
          id: "sms",
          name: "短信服务",
          status: "connected",
          description: "腾讯云短信通道，每日限额 5 万条。",
        },
        {
          id: "email-broadcast",
          name: "邮件广播",
          status: "action_required",
          description: "需补充发信域名 SPF 记录。",
        },
      ],
    },
    security: {
      policies: [
        { id: "sec-2fa", label: "管理员双因子登录", description: "登录后台需短信 + 动态口令。", enabled: true },
        { id: "sec-ip", label: "IP 白名单", description: "限制访问来源于办公网络。", enabled: true },
        { id: "sec-session", label: "会话超时", description: "30 分钟无操作自动退出。", enabled: true },
        { id: "sec-export", label: "数据导出审批", description: "导出订单需主管批准。", enabled: false },
      ],
      compliance: [
        { id: "iso27001", label: "ISO 27001", status: "pass", detail: "已通过 2025 年度复审" },
        { id: "gdpr", label: "GDPR 数据映射", status: "attention", detail: "待补充数据处理清单" },
        { id: "pci", label: "PCI-DSS", status: "pass", detail: "支付链路全部达标" },
      ],
      auditLogs: [
        { id: "log-1", action: "修改角色权限", actor: "运营 · 李雷", time: "今天 14:20", channel: "Web", risk: "medium" },
        { id: "log-2", action: "导出商家列表", actor: "管理员 · 韩梅", time: "今天 10:05", channel: "Web", risk: "low" },
        { id: "log-3", action: "批量关闭营销活动", actor: "运营 · 陈越", time: "昨日 19:42", channel: "API", risk: "medium" },
      ],
    },
  }
}

function createMerchantSettings(): SettingsDataset {
  return {
    tabs: [
      { value: "platform", label: "平台设置" },
      { value: "shop", label: "商家协作" },
      { value: "security", label: "安全与合规" },
    ],
    platform: {
      roles: [
        { id: "role-owner", name: "店铺负责人", users: 2, permissions: ["商品管理", "财务查看"], critical: true },
        { id: "role-operator", name: "运营专员", users: 6, permissions: ["订单处理", "营销配置"] },
      ],
      approvals: [
        { id: "ap-stock", label: "库存同步提醒", description: "库存低于 20% 时提醒所有运营。", enabled: true },
        { id: "ap-promo", label: "促销审批", description: "大额折扣需要负责人确认。", enabled: false },
      ],
      integrations: [
        { id: "erp", name: "店铺 ERP", description: "金蝶、用友", status: "connected", icon: ServerCog, accent: "text-primary" },
        { id: "message", name: "消息中心", description: "企业微信、飞书", status: "action_required", icon: BellRing, accent: "text-amber-500" },
      ],
    },
    shop: {
      profile: [
        { id: "shop-brand", label: "品牌名", value: "山川旅行社" },
        { id: "shop-domain", label: "对外域名", value: "sunriver.travel" },
        { id: "shop-service", label: "售后邮箱", value: "support@sunriver.travel" },
      ],
      notifications: [
        { id: "notify-order", label: "订单提醒", description: "新订单即时推送。", enabled: true },
        { id: "notify-review", label: "评价通知", description: "收到新评价时邮件通知。", enabled: true },
        { id: "notify-risk", label: "风险警报", description: "异常支付时短信提示。", enabled: true },
      ],
      channels: [
        { id: "miniapp", name: "小程序", status: "connected", description: "已上线微信小程序" },
        { id: "douyin", name: "抖音店铺", status: "action_required", description: "等待电商接口授权" },
      ],
    },
    security: {
      policies: [
        { id: "sec-pwd", label: "定期修改密码", description: "每 60 天提醒一次。", enabled: true },
        { id: "sec-device", label: "设备绑定", description: "新设备登录需要确认。", enabled: true },
      ],
      compliance: [
        { id: "travel-license", label: "旅行社资质", status: "pass", detail: "证照有效" },
        { id: "insurance", label: "游客保险", status: "attention", detail: "需要补充保险名单" },
      ],
      auditLogs: [
        { id: "log-m-1", action: "修改结算账户", actor: "负责人 · 王一", time: "今天 09:10", channel: "Web", risk: "high" },
      ],
    },
  }
}

export const settingsMock: Record<UserRole, SettingsDataset> = {
  admin: createAdminSettings(),
  merchant: createMerchantSettings(),
}
