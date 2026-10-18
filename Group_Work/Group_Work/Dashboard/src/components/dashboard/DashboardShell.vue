<script setup lang="ts">
import { computed, ref } from "vue"
import { AlertOctagon, AlertTriangle, BellRing, CheckCircle2, Filter, Info } from "lucide-vue-next"
import type { ReminderItem, ReminderToneMeta, UserRole } from "./types"
import { dashboardMock } from "@/mock/data/dashboard"
import AppSidebar from "./AppSidebar.vue"
import ProfilePanel from "./ProfilePanel.vue"
import DashboardChartCard from "./DashboardChartCard.vue"
import RevenueTrendChart from "@/components/analytics/RevenueTrendChart.vue"
import OrderTrendChart from "@/components/analytics/OrderTrendChart.vue"
import { ChartTooltipContent, componentToString, type ChartConfig } from "@/components/ui/chart"
import type { ReportRange } from "@/mock/data/sales"
import { chartDatasets } from "@/mock/data/sales"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { readAuthSession } from "@/lib/auth"

const props = withDefaults(defineProps<{ role?: UserRole }>(), {
  role: "merchant",
})

const emit = defineEmits<{ (e: "logout"): void }>()

const activePath = ref("/")

const dataset = computed(() => dashboardMock[props.role])
const profile = ref(dataset.value.profile)

if (typeof window !== "undefined") {
	const session = readAuthSession()
	if (session) {
		const base = dataset.value.profile
		const displayRole = session.role === "admin" ? "平台管理员" : "商家用户"
		profile.value = {
			userId: base.userId || (session.phone ?? ""),
			username: session.displayName || base.username,
			role: displayRole,
			avatar: session.avatar ?? base.avatar,
		}
	}
}
const isAdmin = computed(() => props.role === "admin")

const reminderToneMap: Record<ReminderItem["tone"], ReminderToneMeta> = {
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
  },
  info: {
    icon: Info,
    iconBg: "bg-primary/10",
    iconText: "text-primary",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
  },
  error: {
    icon: AlertOctagon,
    iconBg: "bg-destructive/10",
    iconText: "text-destructive",
  },
}

const trendRanges: { label: string; value: ReportRange }[] = [
  { label: "单日", value: "day" },
  { label: "单周", value: "week" },
  { label: "单月", value: "month" },
  { label: "单季", value: "quarter" },
  { label: "全年", value: "year" },
]

const adminRevenueRange = ref<ReportRange>("week")
const adminOrderRange = ref<ReportRange>("week")
const adminUserRange = ref<ReportRange>("week")

const adminRevenueTrend = computed(() => chartDatasets.revenue[adminRevenueRange.value])
const adminOrderTrend = computed(() => chartDatasets.orders[adminOrderRange.value])
const adminUserTrend = computed(() => chartDatasets.users[adminUserRange.value])

const adminRevenueSeries = computed(() =>
  adminRevenueTrend.value.data.map((item, index) => ({ ...item, index, revenue: item.value })),
)

const adminOrderSeries = computed(() =>
  adminOrderTrend.value.data.map((item, index) => ({ ...item, index, orders: item.value })),
)

const adminUserSeries = computed(() =>
  adminUserTrend.value.data.map((item, index) => ({ ...item, index, orders: item.value })),
)

function formatCurrency(value: number) {
  return `￥${value.toLocaleString()}`
}

function formatNumber(value: number) {
  return value.toLocaleString()
}

const adminRevenueSummary = computed(() =>
  formatCurrency(adminRevenueSeries.value.reduce((sum, item) => sum + item.revenue, 0)),
)

const adminOrderSummary = computed(() =>
  formatNumber(adminOrderSeries.value.reduce((sum, item) => sum + item.orders, 0)),
)

const adminUserSummary = computed(() =>
  formatNumber(adminUserSeries.value.reduce((sum, item) => sum + item.orders, 0)),
)

const trendChartMargin = { top: 12, right: 16, bottom: 36, left: 56 }

const adminRevenueChartConfig = {
  revenue: {
    label: "全站流水",
    color: "#0ea5e9",
  },
} as const satisfies ChartConfig

const adminOrderChartConfig = {
  orders: {
    label: "预订量",
    color: "#2563eb",
  },
} as const satisfies ChartConfig

const adminUserChartConfig = {
  users: {
    label: "新增用户",
    color: "#9333ea",
  },
} as const satisfies ChartConfig

const createTickFormatter = (seriesGetter: () => { label: string }[]) => (value: number) => {
  const series = seriesGetter()
  if (!Number.isFinite(value))
    return ""
  const index = Math.max(0, Math.min(series.length - 1, Math.round(value)))
  return series[index]?.label ?? ""
}

const revenueTickFormatter = createTickFormatter(() => adminRevenueTrend.value.data)
const orderTickFormatter = createTickFormatter(() => adminOrderTrend.value.data)
const userTickFormatter = createTickFormatter(() => adminUserTrend.value.data)

function formatAxisCurrency(value: number | Date) {
  if (typeof value !== "number")
    return String(value)
  if (value >= 1_000_000)
    return `￥${(value / 1_000_000).toFixed(1)}M`
  if (value >= 10000)
    return `￥${(value / 10000).toFixed(1)}万`
  return `￥${Math.round(value).toLocaleString()}`
}

function formatAxisNumber(value: number | Date) {
  if (typeof value !== "number")
    return String(value)
  return value.toLocaleString()
}

const adminRevenueTooltip = componentToString(adminRevenueChartConfig, ChartTooltipContent, {
  labelKey: "label",
})

const adminOrderTooltip = componentToString(adminOrderChartConfig, ChartTooltipContent, {
  labelKey: "label",
})

const adminUserTooltip = componentToString(adminUserChartConfig, ChartTooltipContent, {
  labelKey: "label",
})
</script>

<template>
  <SidebarProvider class="dashboard-shell">
    <AppSidebar :role="props.role" :active-path="activePath" @logout="emit('logout')" />
    <SidebarInset class="dashboard-inset">
      <div class="dashboard-grid">
        <div class="dashboard-main">
          <section class="surface-card welcome-card">
            <div class="welcome-body">
              <div class="welcome-header">
                <div>
                  <p class="welcome-title">
                    {{ props.role === 'admin' ? '您好，管理员！' : '您好，商家伙伴！' }}
                  </p>
                  <p class="welcome-desc">
                    欢迎回来，{{ props.role === 'admin' ? '让我们检查平台状态' : '关注最新销售走势' }}。
                  </p>
                </div>
                <button class="notify-button">
                  <BellRing class="icon-md" />
                  <span class="notify-dot"></span>
                </button>
              </div>
              <div class="search-row">
                <div class="search-input-wrapper">
                  <input
                    type="search"
                    placeholder="搜索目的地、订单等"
                    class="search-input"
                  />
                </div>
                <button class="filter-btn">
                  <Filter class="icon-sm" />
                  筛选
                </button>
                <button class="primary-btn">
                  搜索
                </button>
              </div>
            </div>
          </section>

          <section class="stats-grid">
            <article
              v-for="card in dataset.statCards"
              :key="card.id"
              class="surface-card stat-card"
            >
              <div class="stat-card__header">
                <div>
                  <p class="stat-card__label">{{ card.title }}</p>
                  <p class="stat-card__value">{{ card.value }}</p>
                </div>
                <div :class="['stat-card__icon', card.accent]">
                  <component :is="card.icon" class="icon-lg" />
                </div>
              </div>
              <p class="stat-card__desc">{{ card.description }}</p>
            </article>
          </section>

          <section v-if="isAdmin" class="surface-card admin-chart-panel">
            <div class="admin-chart-stack">
              <RevenueTrendChart
                title="全站流水走势"
                caption="展示不同粒度的交易流水，单位：元"
                :trend-ranges="trendRanges"
                v-model="adminRevenueRange"
                :chart-config="adminRevenueChartConfig"
                :series="adminRevenueSeries"
                :chart-margin="trendChartMargin"
                :tick-formatter="revenueTickFormatter"
                :axis-formatter="formatAxisCurrency"
                :tooltip-template="adminRevenueTooltip"
                summary-label="总流水"
                :summary-value="adminRevenueSummary"
              />

              <OrderTrendChart
                title="平台预订量"
                caption="订单数量随时间的变化，单位：单"
                :trend-ranges="trendRanges"
                v-model="adminOrderRange"
                :chart-config="adminOrderChartConfig"
                :series="adminOrderSeries"
                :chart-margin="trendChartMargin"
                :tick-formatter="orderTickFormatter"
                :axis-formatter="formatAxisNumber"
                :tooltip-template="adminOrderTooltip"
                summary-label="总预订量"
                :summary-value="adminOrderSummary"
              />

              <OrderTrendChart
                title="新增用户"
                caption="平台新增用户趋势，单位：人"
                :trend-ranges="trendRanges"
                v-model="adminUserRange"
                :chart-config="adminUserChartConfig"
                :series="adminUserSeries"
                :chart-margin="trendChartMargin"
                :tick-formatter="userTickFormatter"
                :axis-formatter="formatAxisNumber"
                :tooltip-template="adminUserTooltip"
                summary-label="新增用户数"
                :summary-value="adminUserSummary"
              />
            </div>
          </section>

          <section class="panel-grid">
            <article class="surface-card quick-card md:col-span-2">
              <header class="panel-header">
                <p class="panel-title">快捷入口</p>
                <button class="link-button">查看全部</button>
              </header>
              <div class="quick-links">
                <button
                  v-for="link in dataset.quickLinks"
                  :key="link.id"
                  class="quick-link-btn"
                >
                  <span class="quick-link-label">{{ link.label }}</span>
                  <span class="quick-link-action">{{ link.action }}</span>
                </button>
              </div>
            </article>
            <article class="surface-card broadcast-card">
              <p class="panel-title">系统广播</p>
              <p class="panel-desc">
                {{ props.role === 'admin' ? '本周平台稳定运行，关注活动触达表现。' : '活动素材已更新，记得同步到店铺。' }}
              </p>
              <ul class="panel-list">
                <li>· 月度结算将在 3 天后开始</li>
                <li>· 新增《旅行品质指南》培训</li>
                <li>· API 网关升级窗口：本周日晚</li>
              </ul>
            </article>
          </section>
        </div>

        <aside class="profile-panel-wrapper">
          <ProfilePanel
            :profile="profile"
            :reminders="dataset.reminders"
            :reminder-tone-map="reminderToneMap"
          />
        </aside>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
@reference "../../styles/global.css";
.dashboard-shell {
  @apply bg-muted/20 text-sm text-foreground;
}

.dashboard-inset {
  @apply relative min-h-screen;
}

.dashboard-grid {
  @apply grid gap-6 px-4 py-6 lg:px-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:pr-0;
}

.dashboard-main {
  @apply flex flex-col gap-6;
}

.surface-card {
  @apply rounded-3xl bg-white/95 p-6 shadow-sm ring-1 ring-black/5;
}

.welcome-card {
  @apply px-7 py-6;
}

.welcome-body {
  @apply flex flex-col gap-4;
}

.welcome-header {
  @apply flex flex-wrap items-center justify-between gap-4;
}

.welcome-title {
  @apply text-3xl font-semibold text-foreground;
}

.welcome-desc {
  @apply text-base text-muted-foreground;
}

.notify-button {
  @apply relative flex size-12 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:text-foreground;
}

.notify-dot {
  @apply absolute -right-0.5 -top-0.5 inline-flex size-3 rounded-full bg-destructive;
}

.search-row {
  @apply flex flex-wrap items-center gap-3;
}

.search-input-wrapper {
  @apply flex min-w-[220px] flex-1 items-center gap-3 rounded-2xl border border-border bg-background px-5 py-3;
}

.search-input {
  @apply w-full bg-transparent text-base outline-none placeholder:text-muted-foreground;
}

.filter-btn {
  @apply inline-flex items-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground;
}

.primary-btn {
  @apply rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90;
}

.icon-md {
  @apply size-5;
}

.icon-sm {
  @apply size-4;
}

.stats-grid {
  @apply grid gap-4 md:grid-cols-2 xl:grid-cols-4;
}

.admin-chart-panel {
  @apply p-6;
}

.admin-chart-stack {
  @apply flex flex-col gap-6;
}

.stat-card__header {
  @apply flex items-center justify-between gap-3;
}

.stat-card__label {
  @apply text-xs uppercase tracking-wide text-muted-foreground;
}

.stat-card__value {
  @apply text-2xl font-semibold text-foreground;
}

.stat-card__icon {
  @apply flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary;
}

.stat-card__desc {
  @apply mt-3 text-sm text-muted-foreground;
}

.icon-lg {
  @apply size-6;
}

.panel-title {
  @apply text-lg font-semibold text-foreground;
}

.panel-caption {
  @apply text-xs text-muted-foreground;
}

.panel-grid {
  @apply grid gap-4 md:grid-cols-3;
}

.panel-header {
  @apply mb-4 flex items-center justify-between;
}

.link-button {
  @apply text-sm text-primary hover:underline;
}

.quick-links {
  @apply grid gap-4 sm:grid-cols-3;
}

.quick-link-btn {
  @apply flex flex-col items-start gap-2 rounded-2xl border border-dashed border-border px-4 py-3 text-left transition hover:border-primary;
}

.quick-link-label {
  @apply text-sm font-semibold text-foreground;
}

.quick-link-action {
  @apply text-xs text-primary;
}

.broadcast-card {
  @apply space-y-3;
}

.panel-desc {
  @apply text-sm text-muted-foreground;
}

.panel-list {
  @apply mt-1 space-y-3 text-sm text-muted-foreground;
}

.profile-panel-wrapper {
  @apply hidden h-full xl:flex xl:-my-6 xl:pr-6;
  position: sticky;
  top: 0;
  height: 100vh;
}
</style>
