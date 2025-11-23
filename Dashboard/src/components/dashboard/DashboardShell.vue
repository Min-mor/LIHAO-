<script setup lang="ts">
import { computed, ref } from "vue"
import { AlertOctagon, AlertTriangle, BellRing, CheckCircle2, Filter, Info } from "lucide-vue-next"
import type { ReminderItem, ReminderToneMeta, UserRole } from "./types"
import { dashboardMock } from "@/mock/data/dashboard"
import AppSidebar from "./AppSidebar.vue"
import ProfilePanel from "./ProfilePanel.vue"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const props = withDefaults(defineProps<{ role?: UserRole }>(), {
  role: "merchant",
})

const emit = defineEmits<{ (e: "logout"): void }>()

const activePath = ref("/")

const dataset = computed(() => dashboardMock[props.role])

const charts = computed(() =>
  dataset.value.chartConfigs.map((chart) => {
    const max = Math.max(...chart.data.map((item) => item.value)) || 1
    const polyline =
      chart.type === "line"
        ? chart.data
            .map((item, index) => {
              const x = (index / (chart.data.length - 1 || 1)) * 100
              const y = 100 - (item.value / max) * 100
              return `${x},${y}`
            })
            .join(" ")
        : undefined
    return {
      ...chart,
      max,
      polyline,
    }
  }),
)

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

          <section class="chart-grid">
            <article
              v-for="chart in charts"
              :key="chart.id"
              class="surface-card chart-card"
            >
              <header class="chart-card__header">
                <div>
                  <p class="panel-title">{{ chart.title }}</p>
                  <p class="panel-caption" v-if="chart.subtitle">{{ chart.subtitle }}</p>
                </div>
                <span class="panel-caption">近 7 天</span>
              </header>
              <div v-if="chart.type === 'bar'" class="chart-bar-group">
                <div
                  v-for="item in chart.data"
                  :key="item.label"
                  class="chart-bar-item"
                >
                  <div class="chart-bar-shell">
                    <div
                      class="chart-bar"
                      :style="{ height: `${Math.round((item.value / chart.max) * 100)}%` }"
                    ></div>
                  </div>
                  <p class="panel-caption">{{ item.label }}</p>
                  <p class="chart-bar-value">{{ item.value }}</p>
                </div>
              </div>
              <div v-else class="chart-line-group">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="chart-line-graph">
                  <defs>
                    <linearGradient id="line-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stop-color="rgb(32 185 112 / 0.35)" />
                      <stop offset="100%" stop-color="rgb(32 185 112 / 0)" />
                    </linearGradient>
                  </defs>
                  <polygon
                    :points="`${chart.polyline} 100,100 0,100`"
                    fill="url(#line-fill)"
                    stroke="none"
                  />
                  <polyline
                    :points="chart.polyline"
                    fill="none"
                    class="chart-line"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div class="chart-line-x">
                  <span v-for="item in chart.data" :key="item.label">{{ item.label }}</span>
                </div>
              </div>
            </article>
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
            :profile="dataset.profile"
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

.chart-grid {
  @apply grid gap-6 xl:grid-cols-1;
}

.chart-card__header {
  @apply mb-4 flex items-center justify-between;
}

.panel-title {
  @apply text-lg font-semibold text-foreground;
}

.panel-caption {
  @apply text-xs text-muted-foreground;
}

.chart-bar-group {
  @apply flex items-end gap-6;
}

.chart-bar-item {
  @apply flex flex-1 flex-col items-center gap-3;
}

.chart-bar-shell {
  @apply flex h-48 w-full items-end rounded-3xl bg-muted/60 p-3;
}

.chart-bar {
  @apply w-full rounded-3xl bg-gradient-to-t from-primary/40 to-primary;
}

.chart-bar-value {
  @apply text-sm font-semibold text-foreground;
}

.chart-line-group {
  @apply flex flex-col gap-4;
}

.chart-line-graph {
  @apply h-48 w-full;
}

.chart-line {
  @apply stroke-primary;
}

.chart-line-x {
  @apply flex justify-between text-xs text-muted-foreground;
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
