<script setup lang="ts">
import { computed, ref } from "vue"
import { ArrowDownRight, ArrowUpRight, BarChart3, LineChart, TrendingUp } from "lucide-vue-next"
import AppSidebar from "@/components/dashboard/AppSidebar.vue"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  ChartCrosshair,
  componentToString,
  type ChartConfig,
} from "@/components/ui/chart"
import { VisArea, VisAxis, VisLine, VisStackedBar, VisXYContainer } from "@unovis/vue"
import type { ProductPerformance, ReportRange } from "@/mock/data/sales"
import { chartDatasets, revenueSummaries, topProductsDataset } from "@/mock/data/sales"
import type { UserRole } from "@/components/dashboard/types"

const props = withDefaults(defineProps<{ role?: UserRole; activePath?: string }>(), {
  role: "merchant",
  activePath: "/reports",
})

const range = ref<ReportRange>("week")
const ranges: { label: string; value: ReportRange }[] = [
  { label: "单日", value: "day" },
  { label: "单周", value: "week" },
  { label: "单月", value: "month" },
  { label: "单季", value: "quarter" },
  { label: "全年", value: "year" },
]

const summary = computed(() => revenueSummaries.find((item) => item.range === range.value)!)

const trendRanges: { label: string; value: ReportRange }[] = [...ranges]
const revenueTrendRange = ref<ReportRange>("week")
const orderTrendRange = ref<ReportRange>("week")
const productRange = ref<ReportRange>("week")

const revenueTrendData = computed(() => chartDatasets.revenue[revenueTrendRange.value])
const orderTrendData = computed(() => chartDatasets.orders[orderTrendRange.value])
const topProducts = computed(() => topProductsDataset[productRange.value])

function formatCurrency(value: number) {
  return `￥${value.toLocaleString()}`
}

function formatNumber(value: number) {
  return value.toLocaleString()
}

const growthIcon = computed(() => (summary.value.growthRate >= 0 ? ArrowUpRight : ArrowDownRight))
const growthTone = computed(() => (summary.value.growthRate >= 0 ? "text-emerald-600" : "text-rose-600"))

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

const productSeries = computed(() =>
  topProducts.value.map((item, index) => ({ ...item, index, label: item.name })),
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

const indexAccessor = (datum: { index: number }) => datum.index
const revenueValueAccessor = (datum: { revenue: number }) => datum.revenue
const orderValueAccessor = (datum: { orders: number }) => datum.orders
const productRevenueAccessor = (datum: ProductPerformance) => datum.revenue

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
            <Tabs v-model="range" class="range-tabs">
              <TabsList class="range-list">
                <TabsTrigger
                  v-for="item in ranges"
                  :key="item.value"
                  :value="item.value"
                  class="range-trigger"
                >
                  {{ item.label }}
                </TabsTrigger>
              </TabsList>
              <TabsContent v-for="item in ranges" :key="item.value" :value="item.value">
                <div class="panel-content">
                  <div class="stat-grid">
                    <article class="stat-card">
                      <div class="stat-icon stat-icon--primary">
                        <BarChart3 class="icon-md" />
                      </div>
                      <div>
                        <p class="stat-label">销售额</p>
                        <p class="stat-value">{{ formatCurrency(summary.revenue) }}</p>
                      </div>
                    </article>
                    <article class="stat-card">
                      <div class="stat-icon stat-icon--accent">
                        <LineChart class="icon-md" />
                      </div>
                      <div>
                        <p class="stat-label">订单数</p>
                        <p class="stat-value">{{ formatNumber(summary.orders) }}</p>
                      </div>
                    </article>
                    <article class="stat-card">
                      <div class="stat-icon stat-icon--muted">
                        <TrendingUp class="icon-md" />
                      </div>
                      <div>
                        <p class="stat-label">客单价</p>
                        <p class="stat-value">{{ formatCurrency(summary.averageOrderValue) }}</p>
                      </div>
                    </article>
                    <article class="stat-card">
                      <div :class="['stat-icon', summary.growthRate >= 0 ? 'stat-icon--up' : 'stat-icon--down']">
                        <component :is="growthIcon" class="icon-md" />
                      </div>
                      <div>
                        <p class="stat-label">环比增长</p>
                        <p :class="['stat-value', growthTone]">{{ summary.growthRate }}%</p>
                      </div>
                    </article>
                  </div>

                  <div class="chart-stack">
                    <article class="chart-card">
                      <div class="chart-header">
                        <div>
                          <p class="chart-title">销售额趋势</p>
                          <p class="chart-caption">展示不同粒度的销售额变化，单位：元</p>
                        </div>
                        <Select v-model="revenueTrendRange">
                          <SelectTrigger class="chart-select">
                            <SelectValue placeholder="选择粒度" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="option in trendRanges" :key="option.value" :value="option.value">
                              {{ option.label }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <ChartContainer :config="revenueChartConfig" class="chart-container">
                        <VisXYContainer
                          :data="revenueSeries"
                          :margin="trendChartMargin"
                          :height="320"
                        >
                          <VisArea
                            :x="indexAccessor"
                            :y="revenueValueAccessor"
                            :color="() => revenueChartConfig.revenue.color"
                            curve-type="monotoneX"
                          />
                          <VisAxis type="x" position="bottom" :tick-format="revenueTickFormatter" />
                          <VisAxis type="y" position="left" :tick-format="formatAxisCurrency" />
                          <ChartCrosshair :template="revenueTooltipTemplate" show-circle />
                          <ChartTooltip :template="revenueTooltipTemplate" />
                        </VisXYContainer>
                        <ChartLegendContent />
                      </ChartContainer>
                    </article>

                    <article class="chart-card">
                      <div class="chart-header">
                        <div>
                          <p class="chart-title">订单趋势</p>
                          <p class="chart-caption">订单数量随时间的变化，单位：单</p>
                        </div>
                        <Select v-model="orderTrendRange">
                          <SelectTrigger class="chart-select">
                            <SelectValue placeholder="选择粒度" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="option in trendRanges" :key="option.value" :value="option.value">
                              {{ option.label }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <ChartContainer :config="orderChartConfig" class="chart-container">
                        <VisXYContainer
                          :data="orderSeries"
                          :margin="trendChartMargin"
                          :height="320"
                        >
                          <VisLine
                            :x="indexAccessor"
                            :y="orderValueAccessor"
                            :color="() => orderChartConfig.orders.color"
                            curve-type="monotoneX"
                          />
                          <VisAxis type="x" position="bottom" :tick-format="orderTickFormatter" />
                          <VisAxis type="y" position="left" :tick-format="formatAxisNumber" />
                          <ChartCrosshair :template="orderTooltipTemplate" show-circle />
                          <ChartTooltip :template="orderTooltipTemplate" />
                        </VisXYContainer>
                        <ChartLegendContent />
                      </ChartContainer>
                    </article>

                    <article class="chart-card">
                      <div class="chart-header">
                        <div>
                          <p class="chart-title">畅销商品排行榜</p>
                          <p class="chart-caption">按所选区间的销售额排序</p>
                        </div>
                        <Select v-model="productRange">
                          <SelectTrigger class="chart-select">
                            <SelectValue placeholder="选择粒度" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem v-for="option in trendRanges" :key="option.value" :value="option.value">
                              {{ option.label }}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <ChartContainer :config="productChartConfig" class="chart-container">
                        <VisXYContainer
                          :data="productSeries"
                          :margin="productChartMargin"
                          :height="360"
                        >
                          <VisStackedBar
                            :x="indexAccessor"
                            :y="productRevenueAccessor"
                            orientation="horizontal"
                            :color="() => productChartConfig.revenue.color"
                            :bar-padding="0.3"
                          />
                          <VisAxis type="y" position="left" :tick-format="productTickFormatter" />
                          <VisAxis type="x" position="bottom" :tick-format="formatAxisCurrency" />
                          <ChartCrosshair :template="productTooltipTemplate" />
                          <ChartTooltip :template="productTooltipTemplate" />
                        </VisXYContainer>
                        <ChartLegendContent />
                      </ChartContainer>
                      <ul class="product-list">
                        <li v-for="(product, index) in topProducts" :key="product.name" class="product-item">
                          <div class="product-rank">
                            <span>{{ index + 1 }}</span>
                          </div>
                          <div class="product-meta">
                            <p class="product-name">{{ product.name }}</p>
                            <p class="product-category">{{ product.category }}</p>
                          </div>
                          <div class="product-metrics">
                            <p class="product-revenue">{{ formatCurrency(product.revenue) }}</p>
                            <p class="product-orders">{{ product.orders }} 单</p>
                          </div>
                          <span :class="['product-growth', product.growth >= 0 ? 'text-emerald-600' : 'text-rose-600']">
                            {{ product.growth >= 0 ? '+' : '' }}{{ product.growth }}%
                          </span>
                        </li>
                      </ul>
                    </article>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
