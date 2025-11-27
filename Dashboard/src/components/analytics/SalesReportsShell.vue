<script setup lang="ts">
import { computed, ref } from "vue"
import AppSidebar from "@/components/dashboard/AppSidebar.vue"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import RevenueTrendChart from "./RevenueTrendChart.vue"
import OrderTrendChart from "./OrderTrendChart.vue"
import ProductRankingChart from "./ProductRankingChart.vue"
import { ChartTooltipContent, componentToString, type ChartConfig } from "@/components/ui/chart"
import type { ReportRange } from "@/mock/data/sales"
import { chartDatasets, topProductsDataset } from "@/mock/data/sales"
import type { UserRole } from "@/components/dashboard/types"

const props = withDefaults(defineProps<{ role?: UserRole; activePath?: string }>(), {
  role: "merchant",
  activePath: "/reports",
})

const trendRanges: { label: string; value: ReportRange }[] = [
  { label: "单日", value: "day" },
  { label: "单周", value: "week" },
  { label: "单月", value: "month" },
  { label: "单季", value: "quarter" },
  { label: "全年", value: "year" },
]

const revenueTrendRange = ref<ReportRange>("week")
const orderTrendRange = ref<ReportRange>("week")
const productRange = ref<ReportRange>("week")

const revenueTrendData = computed(() => chartDatasets.revenue[revenueTrendRange.value])
const orderTrendData = computed(() => chartDatasets.orders[orderTrendRange.value])
const topProducts = computed(() => topProductsDataset[productRange.value])
const productSeries = computed(() =>
  topProducts.value.map((item, index) => ({ ...item, index, label: item.name })),
)

function formatCurrency(value: number) {
  return `￥${value.toLocaleString()}`
}

function formatNumber(value: number) {
  return value.toLocaleString()
}

const revenueChartConfig = {
  revenue: {
    label: "销售额",
    color: "#16a34a",
  },
} as const satisfies ChartConfig

const orderChartConfig = {
  orders: {
    label: "订单数",
    color: "#2563eb",
  },
} as const satisfies ChartConfig

const productChartConfig = {
  revenue: { label: "销售额", color: "#0ea5e9" },
} as const satisfies ChartConfig

const revenueSeries = computed(() =>
  revenueTrendData.value.data.map((item, index) => ({ ...item, index, revenue: item.value })),
)

const orderSeries = computed(() =>
  orderTrendData.value.data.map((item, index) => ({ ...item, index, orders: item.value })),
)

const revenueSummaryValue = computed(() =>
  formatCurrency(revenueSeries.value.reduce((total, item) => total + item.revenue, 0)),
)

const orderSummaryValue = computed(() =>
  formatNumber(orderSeries.value.reduce((total, item) => total + item.orders, 0)),
)

const productSummaryValue = computed(() =>
  formatCurrency(topProducts.value.reduce((total, item) => total + item.revenue, 0)),
)

const trendChartMargin = { top: 12, right: 16, bottom: 36, left: 56 }
const productChartMargin = { top: 12, right: 16, bottom: 32, left: 120 }

const revenueTooltipTemplate = componentToString(revenueChartConfig, ChartTooltipContent, {
  labelKey: "label",
})

const orderTooltipTemplate = componentToString(orderChartConfig, ChartTooltipContent, {
  labelKey: "label",
})

const productTooltipTemplate = componentToString(productChartConfig, ChartTooltipContent, {
  labelKey: "name",
})

const createTickFormatter = (seriesGetter: () => { label: string }[]) => (value: number) => {
  const series = seriesGetter()
  if (!Number.isFinite(value))
    return ""
  const index = Math.max(0, Math.min(series.length - 1, Math.round(value)))
  return series[index]?.label ?? ""
}

const revenueTickFormatter = createTickFormatter(() => revenueTrendData.value.data)
const orderTickFormatter = createTickFormatter(() => orderTrendData.value.data)
const productTickFormatter = createTickFormatter(() => productSeries.value)

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
</script>

<template>
  <SidebarProvider class="reports-shell">
    <AppSidebar :role="props.role" :active-path="props.activePath" />
    <SidebarInset class="reports-inset">
      <div class="reports-grid">
        <section class="reports-main">
          <header class="surface-card reports-hero">
            <div>
              <p class="hero-title">销售报表</p>
              <p class="hero-desc">快速了解不同粒度下的销售额、订单数与畅销商品表现。</p>
            </div>
          </header>

          <section class="surface-card reports-panel">
            <div class="chart-stack">
              <RevenueTrendChart
                title="销售额趋势"
                caption="展示不同粒度的销售额变化，单位：元"
                :trend-ranges="trendRanges"
                v-model="revenueTrendRange"
                :chart-config="revenueChartConfig"
                :series="revenueSeries"
                :chart-margin="trendChartMargin"
                :tick-formatter="revenueTickFormatter"
                :axis-formatter="formatAxisCurrency"
                :tooltip-template="revenueTooltipTemplate"
                summary-label="总销售额"
                :summary-value="revenueSummaryValue"
              />

              <OrderTrendChart
                title="订单趋势"
                caption="订单数量随时间的变化，单位：单"
                :trend-ranges="trendRanges"
                v-model="orderTrendRange"
                :chart-config="orderChartConfig"
                :series="orderSeries"
                :chart-margin="trendChartMargin"
                :tick-formatter="orderTickFormatter"
                :axis-formatter="formatAxisNumber"
                :tooltip-template="orderTooltipTemplate"
                summary-label="总订单数"
                :summary-value="orderSummaryValue"
              />

              <ProductRankingChart
                title="畅销商品排行榜"
                caption="按所选区间的销售额排序"
                :trend-ranges="trendRanges"
                v-model="productRange"
                :chart-config="productChartConfig"
                :series="productSeries"
                :chart-margin="productChartMargin"
                :tick-formatter="productTickFormatter"
                :axis-formatter="formatAxisCurrency"
                :tooltip-template="productTooltipTemplate"
                :value-formatter="formatCurrency"
                :products="topProducts"
                summary-label="总销售额"
                :summary-value="productSummaryValue"
              />
            </div>
          </section>
        </section>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>
@reference "../../styles/global.css";
.reports-shell {
  @apply bg-muted/20 text-sm text-foreground;
}

.reports-inset {
  @apply min-h-screen;
}

.reports-grid {
  @apply px-4 py-6 lg:px-10;
}

.reports-main {
  @apply flex flex-col gap-6;
}

.surface-card {
  @apply rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5;
}

.reports-hero {
  @apply flex flex-col justify-between gap-4 border border-border/60 lg:flex-row lg:items-center;
}

.hero-title {
  @apply text-3xl font-semibold;
}

.hero-desc {
  @apply text-sm text-muted-foreground;
}

.hero-meta {
  @apply text-right;
}

.hero-value {
  @apply text-3xl font-semibold;
}

.hero-caption {
  @apply text-muted-foreground;
}

.reports-panel {
  @apply border border-border/50;
}

.range-tabs {
  @apply flex flex-col gap-4;
}

.range-list {
  @apply inline-flex flex-wrap gap-2 rounded-2xl bg-muted/60 p-1;
}

.range-trigger {
  @apply rounded-2xl px-4 py-2 text-sm font-semibold text-muted-foreground transition;
  @apply data-[state=active]:bg-white data-[state=active]:text-foreground;
}

.panel-content {
  @apply flex flex-col gap-5;
}

.stat-grid {
  @apply grid gap-4 md:grid-cols-2 xl:grid-cols-4;
}

.stat-card {
  @apply flex items-center gap-3 rounded-3xl border border-border/50 px-4 py-4;
}

.stat-icon {
  @apply flex size-11 items-center justify-center rounded-2xl text-white;
}

.stat-icon--primary {
  @apply bg-primary;
}

.stat-icon--accent {
  @apply bg-amber-500;
}

.stat-icon--muted {
  @apply bg-indigo-500;
}

.stat-icon--up {
  @apply bg-emerald-500;
}

.stat-icon--down {
  @apply bg-rose-500;
}

.stat-label {
  @apply text-xs uppercase tracking-wide text-muted-foreground;
}

.stat-value {
  @apply text-2xl font-semibold;
}


.chart-stack {
  @apply flex flex-col gap-6;
}

.chart-card {
  @apply rounded-3xl border border-border/40 p-5 space-y-4;
}

.chart-header {
  @apply mb-4 flex items-center justify-between;
}

.chart-title {
  @apply text-base font-semibold;
}

.chart-caption {
  @apply text-xs text-muted-foreground;
}

.chart-body {
  @apply relative flex flex-col gap-3;
}

.chart-container {
  @apply aspect-[16/7] w-full;
}

.chart-select {
  @apply w-[120px] rounded-2xl border border-border bg-white px-3 py-1.5 text-xs font-semibold;
}

.product-list {
  @apply flex flex-col gap-3;
}

.product-item {
  @apply flex items-center gap-3 rounded-2xl border border-border/60 px-4 py-3;
}

.product-rank span {
  @apply flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary;
}

.product-meta {
  @apply flex-1;
}

.product-name {
  @apply font-semibold;
}

.product-category {
  @apply text-xs text-muted-foreground;
}

.product-metrics {
  @apply text-right;
}

.product-revenue {
  @apply font-semibold;
}

.product-orders {
  @apply text-xs text-muted-foreground;
}

.product-growth {
  @apply text-sm font-semibold;
}

.icon-md {
  @apply size-5;
}
</style>
