import type { FareOption, SearchContext, Trip } from '@/types/ticket'

function minutes(h: number, m: number) {
  return h * 60 + m
}

const trainBase: Trip[] = [
  {
    id: 'train-G104-0617-1312',
    mode: 'train',
    code: 'G104',
    fromName: '上海虹桥站',
    toName: '北京南站',
    departTime: '06:17',
    arriveTime: '13:12',
    durationMinutes: minutes(6, 55),
    priceFrom: 615,
    fares: [
      { id: 'se-2', name: '二等座', price: 615, remaining: 114 },
      { id: 'se-1', name: '一等座', price: 1023, remaining: 6 },
      { id: 'se-biz', name: '商务座', price: 2023, remaining: 4 },
      { id: 'se-0', name: '无座', price: 615, remaining: 20 },
    ],
    direct: true,
  },
  {
    id: 'train-G130-0812-1510',
    mode: 'train',
    code: 'G130',
    fromName: '上海虹桥站',
    toName: '北京南站',
    departTime: '08:12',
    arriveTime: '15:10',
    durationMinutes: minutes(6, 58),
    priceFrom: 620,
    fares: [
      { id: 'g130-2', name: '二等座', price: 620, remaining: 50 },
      { id: 'g130-1', name: '一等座', price: 1030, remaining: 10 },
      { id: 'g130-biz', name: '商务座', price: 2030, remaining: 3 },
    ],
    direct: true,
  },
  {
    id: 'train-K52-0710-2105',
    mode: 'train',
    code: 'K52',
    fromName: '上海站',
    toName: '北京站',
    departTime: '07:10',
    arriveTime: '21:05',
    durationMinutes: minutes(13, 55),
    priceFrom: 228,
    fares: [
      { id: 'k52-hard-seat', name: '硬座', price: 128, remaining: 120 },
      { id: 'k52-hard-sleeper', name: '硬卧', price: 228, remaining: 40 },
      { id: 'k52-soft-sleeper', name: '软卧', price: 328, remaining: 16 },
    ],
    direct: false,
  },
]

const flightBase: Trip[] = [
  {
    id: 'flight-CZ886-0617-0820',
    mode: 'flight',
    code: 'CZ886',
    fromName: '虹桥T2',
    toName: '大兴',
    departTime: '06:17',
    arriveTime: '08:20',
    durationMinutes: minutes(2, 3),
    priceFrom: 615,
    airline: { code: 'CZ', name: '南方航空' },
    aircraft: 'A320',
    meal: true,
    meta: { cheapestFareName: '经济舱', discount: '' },
    fares: [
      { id: 'y', name: '经济舱', price: 615, remaining: 20, classCode: 'Y' },
      { id: 'c', name: '公务舱', price: 1023, remaining: 6, classCode: 'C' },
    ],
    direct: true,
  },
  {
    id: 'flight-MU512-0920-1140',
    mode: 'flight',
    code: 'MU512',
    fromName: '浦东T1',
    toName: '首都T2',
    departTime: '09:20',
    arriveTime: '11:40',
    durationMinutes: minutes(2, 20),
    priceFrom: 720,
    airline: { code: 'MU', name: '东方航空' },
    aircraft: 'A321',
    meal: true,
    meta: { cheapestFareName: '经济舱', discount: '' },
    fares: [
      { id: 'mu-y', name: '经济舱', price: 720, remaining: 9, classCode: 'Y' },
      { id: 'mu-c', name: '公务舱', price: 1280, remaining: 2, classCode: 'C' },
    ],
    direct: true,
  },
]

function cloneTrips(list: Trip[]): Trip[] {
  return JSON.parse(JSON.stringify(list))
}

export async function searchTripsMock(ctx: SearchContext): Promise<Trip[]> {
  const { mode, from, to, directOnly, sortBy, sortAsc = true } = ctx
  let base: Trip[] = []
  if (mode === 'train')
    base = cloneTrips(trainBase)
  else base = cloneTrips(flightBase)

  // 简单的城市过滤（mock）
  base = base.filter(() => true)

  // 学生票折扣（仅火车，演示用）
  if (mode === 'train' && ctx.options?.includes('student')) {
    base.forEach((t) => {
      t.fares = t.fares.map((f): FareOption => ({ ...f, price: Math.round(f.price * 0.75) }))
      t.priceFrom = Math.min(...t.fares.map(f => f.price))
    })
  }

  // 排序：出发时间/价格/耗时（未指定 sortBy 时保持原顺序）
  if (sortBy) {
    base.sort((a, b) => {
      const toMin = (t: string) => {
        const [h, m] = t.split(':').map(Number)
        return h * 60 + m
      }
      const valA = sortBy === 'price' ? a.priceFrom : sortBy === 'duration' ? a.durationMinutes : toMin(a.departTime)
      const valB = sortBy === 'price' ? b.priceFrom : sortBy === 'duration' ? b.durationMinutes : toMin(b.departTime)
      return sortAsc ? valA - valB : valB - valA
    })
  }

  // 模拟网络延迟
  await new Promise(r => setTimeout(r, 200))
  return base
}
