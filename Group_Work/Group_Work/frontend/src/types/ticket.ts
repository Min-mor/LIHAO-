export type TransportMode = 'train' | 'flight'

export interface SearchContext {
  mode: TransportMode
  from: string
  to: string
  date: number // timestamp of selected day start
  options?: string[] // e.g. ['standard'] | ['student'] for train, empty for flight
  directOnly?: boolean
  sortBy?: 'depart' | 'price' | 'duration'
  sortAsc?: boolean
}

export interface FareOption {
  id: string
  name: string // 二等座/一等座/商务座/硬座/硬卧/经济舱/公务舱 等
  price: number
  remaining?: number
  classCode?: string // Y/C/F or seat code if needed
}

export interface AirlineInfo {
  code: string
  name: string
  logo?: string
}

export interface Trip {
  id: string
  mode: TransportMode
  code: string // 车次或航班号，例如 G104、CZ886
  fromName: string // 出发站/机场
  toName: string // 到达站/机场
  departTime: string // 06:17
  arriveTime: string // 13:12
  durationMinutes: number
  priceFrom: number
  fares: FareOption[]
  direct: boolean
  meta?: Record<string, any>
  airline?: AirlineInfo // 仅航班
  aircraft?: string // 仅航班
  meal?: boolean // 仅航班
}

export type PassengerType = 'adult' | 'child' | 'student'

export interface Passenger {
  id: string
  name: string
  idNo?: string
  type: PassengerType
  seat?: string
}

export interface OrderDraft {
  tripId: string
  fareId: string
  passengers: Passenger[]
  contactPhone?: string
  mode: TransportMode
  totalPrice: number
}
