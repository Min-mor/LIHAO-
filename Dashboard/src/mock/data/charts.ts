import type { ChartDatum } from "@/components/dashboard/types"

export const WEEK_LABELS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]

export type NumericSeries = number[]

export function buildSeriesFromArray(values: NumericSeries, labels: string[] = WEEK_LABELS): ChartDatum[] {
  return values.map((value, index) => ({
    label: labels[index] ?? `Day ${index + 1}`,
    value,
  }))
}

export function buildSeriesFromTuples(points: Array<[string, number]>): ChartDatum[] {
  return points.map(([label, value]) => ({
    label,
    value,
  }))
}
