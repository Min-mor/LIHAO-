<script setup lang="ts">
import { computed } from "vue"
import type { ChartConfig } from "./types"

const props = withDefaults(defineProps<{
  chart: ChartConfig
  rangeLabel?: string
}>(), {
  rangeLabel: "近 7 天",
})

const maxValue = computed(() => Math.max(...props.chart.data.map((item) => item.value)) || 1)

const barSeries = computed(() =>
  props.chart.data.map((item) => ({
    ...item,
    percent: Math.round((item.value / maxValue.value) * 100),
  })),
)

const gradientId = computed(() => `chart-gradient-${props.chart.id}`)

const polylinePoints = computed(() => {
  if (props.chart.type !== "line" || props.chart.data.length === 0)
    return ""
  const lastIndex = props.chart.data.length - 1 || 1
  return props.chart.data
    .map((item, index) => {
      const x = (index / lastIndex) * 100
      const y = 100 - (item.value / maxValue.value) * 100
      return `${x},${y}`
    })
    .join(" ")
})

const polygonPoints = computed(() => {
  if (!polylinePoints.value)
    return ""
  return `${polylinePoints.value} 100,100 0,100`
})
</script>

<template>
  <article class="dashboard-chart-card">
    <header class="dashboard-chart-card__header">
      <div>
        <p class="dashboard-chart-card__title">{{ chart.title }}</p>
        <p v-if="chart.subtitle" class="dashboard-chart-card__subtitle">{{ chart.subtitle }}</p>
      </div>
      <span class="dashboard-chart-card__range">{{ rangeLabel }}</span>
    </header>

    <div v-if="chart.type === 'bar'" class="dashboard-chart-card__bar-group">
      <div v-for="item in barSeries" :key="item.label" class="dashboard-chart-card__bar-item">
        <div class="dashboard-chart-card__bar-shell">
          <div class="dashboard-chart-card__bar" :style="{ height: `${item.percent}%` }"></div>
        </div>
        <p class="dashboard-chart-card__subtitle">{{ item.label }}</p>
        <p class="dashboard-chart-card__bar-value">{{ item.value }}</p>
      </div>
    </div>

    <div v-else class="dashboard-chart-card__line-group">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="dashboard-chart-card__line-graph">
        <defs>
          <linearGradient :id="gradientId" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="rgb(32 185 112 / 0.35)" />
            <stop offset="100%" stop-color="rgb(32 185 112 / 0)" />
          </linearGradient>
        </defs>
        <polygon
          v-if="polygonPoints"
          :points="polygonPoints"
          :fill="`url(#${gradientId})`"
          stroke="none"
        />
        <polyline
          v-if="polylinePoints"
          :points="polylinePoints"
          fill="none"
          class="dashboard-chart-card__line"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <div class="dashboard-chart-card__line-x">
        <span v-for="item in chart.data" :key="item.label">{{ item.label }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
@reference "../../styles/global.css";
.dashboard-chart-card {
  @apply rounded-3xl bg-white/95 p-6 shadow-sm ring-1 ring-black/5;
}

.dashboard-chart-card__header {
  @apply mb-4 flex items-center justify-between;
}

.dashboard-chart-card__title {
  @apply text-lg font-semibold text-foreground;
}

.dashboard-chart-card__subtitle {
  @apply text-xs text-muted-foreground;
}

.dashboard-chart-card__range {
  @apply text-xs text-muted-foreground;
}

.dashboard-chart-card__bar-group {
  @apply flex items-end gap-6;
}

.dashboard-chart-card__bar-item {
  @apply flex flex-1 flex-col items-center gap-3;
}

.dashboard-chart-card__bar-shell {
  @apply flex h-48 w-full items-end rounded-3xl bg-muted/60 p-3;
}

.dashboard-chart-card__bar {
  @apply w-full rounded-3xl bg-gradient-to-t from-primary/40 to-primary;
}

.dashboard-chart-card__bar-value {
  @apply text-sm font-semibold text-foreground;
}

.dashboard-chart-card__line-group {
  @apply flex flex-col gap-4;
}

.dashboard-chart-card__line-graph {
  @apply h-48 w-full;
}

.dashboard-chart-card__line {
  @apply stroke-primary;
}

.dashboard-chart-card__line-x {
  @apply flex justify-between text-xs text-muted-foreground;
}
</style>
