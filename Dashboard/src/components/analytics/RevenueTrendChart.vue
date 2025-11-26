<script setup lang="ts">
import { computed } from "vue"
import type { AcceptableValue } from "reka-ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChartContainer,
  ChartCrosshair,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { VisArea, VisAxis, VisXYContainer } from "@unovis/vue"
import type { ReportRange } from "@/mock/data/sales"

interface RangeOption {
  label: string
  value: ReportRange
}

interface RevenuePoint {
  index: number
  revenue: number
}

type TooltipTemplate = ((data: any, x: number | Date) => string | undefined) | undefined

const props = withDefaults(defineProps<{
  title: string
  caption: string
  trendRanges: RangeOption[]
  modelValue: ReportRange
  chartConfig: ChartConfig
  series: (RevenuePoint & { label?: string })[]
  chartMargin: { top: number; right: number; bottom: number; left: number }
  height?: number
  tickFormatter: (value: number) => string
  axisFormatter: (value: number | Date) => string
  tooltipTemplate?: TooltipTemplate
}>(), {
  height: 320,
})

const emit = defineEmits<{ "update:modelValue": [ReportRange] }>()

const selectedRange = computed({
  get: () => props.modelValue,
  set: (value: AcceptableValue) => {
    if (typeof value !== "string")
      return
    emit("update:modelValue", value as ReportRange)
  },
})

const indexAccessor = (datum: RevenuePoint) => datum.index
const valueAccessor = (datum: RevenuePoint) => datum.revenue
const areaColor = computed(() => Object.values(props.chartConfig)[0]?.color)
</script>

<template>
  <article class="chart-card">
    <div class="chart-header">
      <div>
        <p class="chart-title">{{ title }}</p>
        <p class="chart-caption">{{ caption }}</p>
      </div>
      <Select v-model="selectedRange">
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
    <ChartContainer :config="chartConfig" class="chart-container">
      <VisXYContainer :data="series" :margin="chartMargin" :height="height">
        <VisArea
          :x="indexAccessor"
          :y="valueAccessor"
          :color="() => areaColor"
          curve-type="monotoneX"
        />
        <VisAxis type="x" position="bottom" :tick-format="tickFormatter" />
        <VisAxis type="y" position="left" :tick-format="axisFormatter" />
        <ChartCrosshair v-if="tooltipTemplate" :template="tooltipTemplate" show-circle />
        <ChartTooltip v-if="tooltipTemplate" :template="tooltipTemplate" />
      </VisXYContainer>
      <ChartLegendContent />
    </ChartContainer>
  </article>
</template>
