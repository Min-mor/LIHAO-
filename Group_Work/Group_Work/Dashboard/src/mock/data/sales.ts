export type ReportRange = "day" | "week" | "month" | "quarter" | "year"

export interface TrendDatum {
  label: string
  value: number
}

export interface ProductPerformance {
  name: string
  category: string
  revenue: number
  orders: number
  growth: number
}

interface RevenueSummary {
  range: ReportRange
  revenue: number
  orders: number
  averageOrderValue: number
  growthRate: number
}

interface TrendDataset {
  label: string
  data: TrendDatum[]
}

export type TrendChartType = "revenue" | "orders" | "users"

export const revenueSummaries: RevenueSummary[] = [
  { range: "day", revenue: 68000, orders: 128, averageOrderValue: 531, growthRate: 4.8 },
  { range: "week", revenue: 418000, orders: 962, averageOrderValue: 434, growthRate: 6.2 },
  { range: "month", revenue: 1680000, orders: 3810, averageOrderValue: 441, growthRate: 9.5 },
  { range: "quarter", revenue: 4860000, orders: 10840, averageOrderValue: 448, growthRate: 11.3 },
  { range: "year", revenue: 18450000, orders: 41020, averageOrderValue: 450, growthRate: 14.6 },
]

export type ChartDataMap = Record<TrendChartType, Record<ReportRange, TrendDataset>>

export const chartDatasets: ChartDataMap = {
  revenue: {
    day: {
      label: "小时销售额",
      data: [
        { label: "08:00", value: 6000 },
        { label: "10:00", value: 9200 },
        { label: "12:00", value: 8500 },
        { label: "14:00", value: 10000 },
        { label: "16:00", value: 11200 },
        { label: "18:00", value: 9000 },
        { label: "20:00", value: 6600 },
      ],
    },
    week: {
      label: "近 7 天销售额",
      data: [
        { label: "Mon", value: 54000 },
        { label: "Tue", value: 68000 },
        { label: "Wed", value: 72000 },
        { label: "Thu", value: 61000 },
        { label: "Fri", value: 78000 },
        { label: "Sat", value: 51000 },
        { label: "Sun", value: 54000 },
      ],
    },
    month: {
      label: "周销售额",
      data: Array.from({ length: 4 }).map((_, index) => ({
        label: `Week ${index + 1}`,
        value: 410000 + index * 20000,
      })),
    },
    quarter: {
      label: "季度月度对比",
      data: [
        { label: "Q1-M1", value: 1500000 },
        { label: "Q1-M2", value: 1680000 },
        { label: "Q1-M3", value: 1680000 },
      ],
    },
    year: {
      label: "年季度销售额",
      data: [
        { label: "Q1", value: 4200000 },
        { label: "Q2", value: 4680000 },
        { label: "Q3", value: 4800000 },
        { label: "Q4", value: 4860000 },
      ],
    },
  },
  orders: {
    day: {
      label: "小时订单数",
      data: [
        { label: "08:00", value: 12 },
        { label: "10:00", value: 18 },
        { label: "12:00", value: 16 },
        { label: "14:00", value: 20 },
        { label: "16:00", value: 22 },
        { label: "18:00", value: 17 },
        { label: "20:00", value: 13 },
      ],
    },
    week: {
      label: "近 7 天订单数",
      data: [
        { label: "Mon", value: 120 },
        { label: "Tue", value: 150 },
        { label: "Wed", value: 160 },
        { label: "Thu", value: 135 },
        { label: "Fri", value: 180 },
        { label: "Sat", value: 112 },
        { label: "Sun", value: 105 },
      ],
    },
    month: {
      label: "周订单数",
      data: Array.from({ length: 4 }).map((_, index) => ({
        label: `Week ${index + 1}`,
        value: 900 + index * 80,
      })),
    },
    quarter: {
      label: "季度订单走势",
      data: [
        { label: "Q1-M1", value: 3500 },
        { label: "Q1-M2", value: 3600 },
        { label: "Q1-M3", value: 3740 },
      ],
    },
    year: {
      label: "年季度订单数",
      data: [
        { label: "Q1", value: 9300 },
        { label: "Q2", value: 9800 },
        { label: "Q3", value: 10100 },
        { label: "Q4", value: 10820 },
      ],
    },
  },
  users: {
    day: {
      label: "小时新增用户",
      data: [
        { label: "08:00", value: 30 },
        { label: "10:00", value: 48 },
        { label: "12:00", value: 52 },
        { label: "14:00", value: 60 },
        { label: "16:00", value: 66 },
        { label: "18:00", value: 58 },
        { label: "20:00", value: 42 },
      ],
    },
    week: {
      label: "近 7 天新增用户",
      data: [
        { label: "Mon", value: 180 },
        { label: "Tue", value: 210 },
        { label: "Wed", value: 190 },
        { label: "Thu", value: 240 },
        { label: "Fri", value: 260 },
        { label: "Sat", value: 230 },
        { label: "Sun", value: 250 },
      ],
    },
    month: {
      label: "周新增用户",
      data: Array.from({ length: 4 }).map((_, index) => ({
        label: `Week ${index + 1}`,
        value: 1400 + index * 120,
      })),
    },
    quarter: {
      label: "季度新增用户",
      data: [
        { label: "Q1-M1", value: 4200 },
        { label: "Q1-M2", value: 4480 },
        { label: "Q1-M3", value: 4720 },
      ],
    },
    year: {
      label: "年季度新增用户",
      data: [
        { label: "Q1", value: 12600 },
        { label: "Q2", value: 13400 },
        { label: "Q3", value: 14100 },
        { label: "Q4", value: 14850 },
      ],
    },
  },
}

export const topProductsDataset: Record<ReportRange, ProductPerformance[]> = {
  day: [
    { name: "巴厘岛家庭套餐", category: "自由行", revenue: 18000, orders: 22, growth: 8 },
    { name: "科莫多岛潜水", category: "潜水", revenue: 13200, orders: 15, growth: 5 },
    { name: "龙目岛日落巡航", category: "包船", revenue: 9500, orders: 12, growth: 3 },
  ],
  week: [
    { name: "巴厘岛蜜月行", category: "度假", revenue: 98000, orders: 70, growth: 12 },
    { name: "婆罗洲雨林探险", category: "探险", revenue: 76000, orders: 58, growth: 6 },
    { name: "塞梅鲁徒步", category: "徒步", revenue: 52000, orders: 48, growth: 4 },
    { name: "曼达拉登山", category: "徒步", revenue: 42000, orders: 36, growth: 3 },
    { name: "龙目岛冲浪营", category: "运动", revenue: 36000, orders: 32, growth: 5 },
  ],
  month: [
    { name: "印尼群岛 10 日环线", category: "长线", revenue: 280000, orders: 150, growth: 10 },
    { name: "巴厘岛高端定制", category: "定制", revenue: 240000, orders: 120, growth: 7 },
    { name: "婆罗摩火山日出", category: "短线", revenue: 160000, orders: 210, growth: 5 },
    { name: "曼达拉徒步", category: "徒步", revenue: 132000, orders: 140, growth: 4 },
    { name: "蓝梦岛浮潜", category: "水上", revenue: 118000, orders: 230, growth: 6 },
  ],
  quarter: [
    { name: "印尼金三角尊享", category: "定制", revenue: 620000, orders: 260, growth: 9 },
    { name: "婆罗洲野奢探险", category: "探险", revenue: 540000, orders: 210, growth: 7 },
    { name: "苏拉威西潜水季", category: "潜水", revenue: 480000, orders: 195, growth: 6 },
    { name: "巴厘岛亲子营", category: "亲子", revenue: 420000, orders: 230, growth: 5 },
    { name: "爪哇文化巡礼", category: "文化", revenue: 385000, orders: 180, growth: 4 },
  ],
  year: [
    { name: "海岛豪华巡航", category: "邮轮", revenue: 1380000, orders: 420, growth: 12 },
    { name: "印尼文化深度游", category: "文化", revenue: 1180000, orders: 380, growth: 9 },
    { name: "婆罗洲雨林考察", category: "探险", revenue: 960000, orders: 340, growth: 7 },
    { name: "龙目岛亲子营", category: "亲子", revenue: 820000, orders: 360, growth: 6 },
    { name: "苏门答腊野奢", category: "自然", revenue: 780000, orders: 310, growth: 5 },
  ],
}
