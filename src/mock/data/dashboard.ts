import type {
  ChartConfig,
  ProfileInfo,
  QuickLink,
  ReminderItem,
  StatCard,
  UserRole,
} from "@/components/dashboard/types"
import {
  BarChart3,
  LineChart,
  MessageCircle,
  MessageCircleWarning,
  Package,
  ShieldCheck,
  ShoppingCart,
  Store,
} from "lucide-vue-next"

interface DashboardDataset {
  statCards: StatCard[]
  chartConfigs: ChartConfig[]
  quickLinks: QuickLink[]
  profile: ProfileInfo
  reminders: ReminderItem[]
}

export const dashboardMock: Record<UserRole, DashboardDataset> = {
  merchant: {
    statCards: [
      {
        id: "m-orders-24h",
        title: "近 24 小时订单",
        description: "实时刷新",
        value: "312",
        icon: ShoppingCart,
        accent: "bg-primary/10 text-primary",
      },
      {
        id: "m-orders-total",
        title: "订单总数",
        description: "累计成交",
        value: "12,480",
        icon: Package,
        accent: "bg-accent/10 text-accent",
      },
      {
        id: "m-messages",
        title: "待处理消息",
        description: "客服消息与投诉",
        value: "18",
        icon: MessageCircleWarning,
        accent: "bg-destructive/10 text-destructive",
      },
    ],
    chartConfigs: [
      {
        id: "sales",
        title: "近 7 天销售额",
        subtitle: "单位：万元",
        type: "bar",
        data: [
          { label: "周一", value: 12 },
          { label: "周二", value: 18 },
          { label: "周三", value: 16 },
          { label: "周四", value: 22 },
          { label: "周五", value: 28 },
          { label: "周六", value: 24 },
          { label: "周日", value: 14 },
        ],
      },
      {
        id: "orders",
        title: "近 7 天订单数",
        subtitle: "单位：单",
        type: "line",
        data: [
          { label: "周一", value: 220 },
          { label: "周二", value: 260 },
          { label: "周三", value: 210 },
          { label: "周四", value: 340 },
          { label: "周五", value: 420 },
          { label: "周六", value: 360 },
          { label: "周日", value: 260 },
        ],
      },
    ],
    quickLinks: [
      { id: "ql-1", label: "创建新品", action: "发布" },
      { id: "ql-2", label: "查看订单", action: "进入" },
      { id: "ql-3", label: "下载报表", action: "导出" },
    ],
    profile: {
      userId: "merchant-001",
      username: "山川旅行社",
      role: "商家用户",
      avatar: null,
    },
    reminders: [
      {
        id: "mr-1",
        title: "工单回复",
        detail: "有 2 条工单等待反馈",
        time: "5 分钟前",
        tone: "warning",
      },
      {
        id: "mr-2",
        title: "营销活动",
        detail: "周末折扣活动将在 2 天后到期",
        time: "1 小时前",
        tone: "info",
      },
      {
        id: "mr-3",
        title: "库存提醒",
        detail: "巴厘岛线路库存不足 10 份",
        time: "3 小时前",
        tone: "error",
      },
    ],
  },
  admin: {
    statCards: [
      {
        id: "a-bookings",
        title: "近 24 小时预订",
        description: "平台新增",
        value: "1,204",
        icon: ShoppingCart,
        accent: "bg-primary/10 text-primary",
      },
      {
        id: "a-merchants",
        title: "待审核商家",
        description: "需要尽快处理",
        value: "16",
        icon: Store,
        accent: "bg-accent/10 text-accent",
      },
      {
        id: "a-tickets",
        title: "开放工单",
        description: "客服支持",
        value: "8",
        icon: MessageCircle,
        accent: "bg-primary/10 text-primary",
      },
      {
        id: "a-system",
        title: "系统状态",
        description: "近 24h",
        value: "稳定",
        icon: ShieldCheck,
        accent: "bg-emerald-50 text-emerald-600",
      },
    ],
    chartConfigs: [
      {
        id: "booking-volume",
        title: "近 7 天预订量",
        subtitle: "单位：单",
        type: "bar",
        data: [
          { label: "周一", value: 180 },
          { label: "周二", value: 220 },
          { label: "周三", value: 300 },
          { label: "周四", value: 260 },
          { label: "周五", value: 380 },
          { label: "周六", value: 280 },
          { label: "周日", value: 200 },
        ],
      },
    ],
    quickLinks: [
      { id: "ql-1", label: "商家审核列表", action: "立即处理" },
      { id: "ql-2", label: "发布平台公告", action: "新建" },
      { id: "ql-3", label: "营销活动配置", action: "进入" },
    ],
    profile: {
      userId: "admin-ops-07",
      username: "运营值守专员",
      role: "管理员",
      avatar: null,
    },
    reminders: [
      {
        id: "ar-1",
        title: "商家审核",
        detail: "3 家新商户等待审核",
        time: "10 分钟前",
        tone: "warning",
      },
      {
        id: "ar-2",
        title: "活动到期",
        detail: "暑期推广将在 1 天后结束",
        time: "40 分钟前",
        tone: "info",
      },
      {
        id: "ar-3",
        title: "异常通知",
        detail: "支付网关有 1 条重试记录",
        time: "2 小时前",
        tone: "error",
      },
    ],
  },
}
