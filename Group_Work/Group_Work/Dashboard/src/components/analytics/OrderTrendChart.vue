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
import { VisAxis, VisLine, VisXYContainer } from "@unovis/vue"
import type { ReportRange } from "@/mock/data/sales"

interface RangeOption {
  label: string
  value: ReportRange
}

interface OrderPoint {
  index: number
  orders: number
  label?: string
}

type TooltipTemplate = ((data: any, x: number | Date) => string | undefined) | undefined

const props = withDefaults(defineProps<{
  title: string
  caption: string
  trendRanges: RangeOption[]
  modelValue: ReportRange
  chartConfig: ChartConfig
  series: OrderPoint[]
  chartMargin: { top: number; right: number; bottom: number; left: number }
  height?: number
  tickFormatter: (value: number) => string
  axisFormatter: (value: number | Date) => string
  tooltipTemplate?: TooltipTemplate
  summaryLabel?: string
  summaryValue?: string
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

const indexAccessor = (datum: OrderPoint) => datum.index
const valueAccessor = (datum: OrderPoint) => datum.orders
const lineColor = computed(() => Object.values(props.chartConfig)[0]?.color || "#2563eb")
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
const showTooltip = computed(() => isMounted.value && !!props.tooltipTemplate)
</script>

<template>
  <article class="rounded-3xl border border-border/40 p-5 space-y-4">
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
        <VisLine
          :x="indexAccessor"
          :y="valueAccessor"
          :color="() => lineColor"
          curve-type="monotoneX"
        />
        <VisAxis type="x" position="bottom" :tick-format="tickFormatter" />
        <VisAxis type="y" position="left" :tick-format="axisFormatter" />
        <ChartCrosshair v-if="showTooltip" :template="tooltipTemplate" show-circle />
        <ChartTooltip v-if="showTooltip" :template="tooltipTemplate" />
      </VisXYContainer>
      <ChartLegendContent />
    </ChartContainer>
  </article>
</template>
