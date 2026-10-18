<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import type { AcceptableValue } from "reka-ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChartContainer,
  ChartCrosshair,
  ChartLegendContent,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { VisAxis, VisStackedBar, VisXYContainer } from "@unovis/vue"
import type { ProductPerformance, ReportRange } from "@/mock/data/sales"

interface RangeOption {
  label: string
  value: ReportRange
}

interface ProductPoint extends ProductPerformance {
  index: number
  label?: string
}

interface ChartMargin {
  top: number
  right: number
  bottom: number
  left: number
}

type TooltipTemplate = ((data: any, x: number | Date) => string | undefined) | undefined

type ValueFormatter = (value: number) => string

const props = withDefaults(defineProps<{
  title: string
  caption: string
  trendRanges: RangeOption[]
  modelValue: ReportRange
  chartConfig: ChartConfig
  series: ProductPoint[]
  chartMargin: ChartMargin
  height?: number
  tickFormatter: (value: number) => string
  axisFormatter: (value: number | Date) => string
  tooltipTemplate?: TooltipTemplate
  valueFormatter?: ValueFormatter
  products: ProductPerformance[]
  summaryLabel?: string
  summaryValue?: string
}>(), {
  height: 360,
  valueFormatter: (value: number) => `￥${value.toLocaleString()}`,
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

const indexAccessor = (datum: ProductPoint) => datum.index
const valueAccessor = (datum: ProductPoint) => datum.revenue
const barColor = computed(() => Object.values(props.chartConfig)[0]?.color || "#0ea5e9")
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
const showTooltip = computed(() => isMounted.value && !!props.tooltipTemplate)

const growthTone = (growth: number) => (growth >= 0 ? "text-emerald-600" : "text-rose-600")
</script>

<template>
  <article class="rounded-3xl border border-border/40 p-5 space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div class="space-y-2">
        <div class="space-y-1">
          <p class="text-base font-semibold">{{ title }}</p>
          <p class="text-xs text-muted-foreground">{{ caption }}</p>
        </div>
        <div v-if="summaryValue" class="flex flex-col">
          <p class="text-2xl font-semibold leading-tight">{{ summaryValue }}</p>
          <p v-if="summaryLabel" class="text-xs text-muted-foreground">{{ summaryLabel }}</p>
        </div>
      </div>
      <Select v-model="selectedRange">
        <SelectTrigger class="w-[120px] rounded-2xl border border-border bg-white px-3 py-1.5 text-xs font-semibold">
          <SelectValue placeholder="选择粒度" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="option in trendRanges" :key="option.value" :value="option.value">
            {{ option.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <ChartContainer
      :config="chartConfig"
      class="w-full !aspect-auto"
      :style="{ minHeight: `${props.height}px` }"
    >
      <VisXYContainer :data="series" :margin="chartMargin" :height="height">
        <VisStackedBar
          :x="indexAccessor"
          :y="valueAccessor"
          orientation="horizontal"
          :color="() => barColor"
          :bar-padding="0.3"
        />
        <VisAxis type="y" position="left" :tick-format="tickFormatter" />
        <VisAxis type="x" position="bottom" :tick-format="axisFormatter" />
        <ChartCrosshair v-if="showTooltip" :template="tooltipTemplate" />
        <ChartTooltip v-if="showTooltip" :template="tooltipTemplate" />
      </VisXYContainer>
      <ChartLegendContent />
    </ChartContainer>

    <ul class="flex flex-col gap-3">
      <li
        v-for="(product, index) in products"
        :key="product.name"
        class="flex items-center gap-3 rounded-2xl border border-border/60 px-4 py-3"
      >
        <div class="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {{ index + 1 }}
        </div>
        <div class="flex-1">
          <p class="font-semibold">{{ product.name }}</p>
          <p class="text-xs text-muted-foreground">{{ product.category }}</p>
        </div>
        <div class="text-right">
          <p class="font-semibold">{{ valueFormatter(product.revenue) }}</p>
          <p class="text-xs text-muted-foreground">{{ product.orders }} 单</p>
        </div>
        <span class="text-sm font-semibold" :class="growthTone(product.growth)">
          {{ product.growth >= 0 ? "+" : "" }}{{ product.growth }}%
        </span>
      </li>
    </ul>
  </article>
</template>
