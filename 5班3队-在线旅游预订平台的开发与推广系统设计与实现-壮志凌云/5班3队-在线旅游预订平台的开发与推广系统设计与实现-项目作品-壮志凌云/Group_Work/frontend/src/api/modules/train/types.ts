export interface TrainScheduleRequest {
  /** 查询方式。1-站名，2-站点编码 */
  searchType: string
  /** 出发站（站名或站码） */
  departureStation: string
  /** 到达站（站名或站码） */
  arrivalStation: string
  /** 出发日期，格式：YYYY-MM-DD */
  date: string
  /** 车次筛选条件，例如 G/D/C，空字符串表示全部 */
  filter: string
  /** 是否可预定：1-仅可预定，2-全部 */
  enableBooking: string
  /** 出发时间段：凌晨/上午/下午/晚上 */
  departureTimeRange: string
}

export interface PriceInfoDTO {
  seatName: string
  seatTypeCode: string
  price: number
  discount: number | null
  num: string
}

export interface TrainInfoDTO {
  trainNo: string
  departureStation: string
  arrivalStation: string
  departureStationCode: string
  arrivalStationCode: string
  departureTime: string
  arrivalTime: string
  duration: string
  enableBooking: string
  prices: PriceInfoDTO[]
  trainFlags: string[]
}

export interface TrainScheduleResponseDTO {
  errorCode: number
  reason: string
  result: TrainInfoDTO[]
}
