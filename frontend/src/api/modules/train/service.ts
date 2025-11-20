import type { TrainInfoDTO, TrainScheduleRequest, TrainScheduleResponseDTO } from './types'
import type { FareOption, SearchContext, Trip } from '@/types/ticket'
import dayjs from 'dayjs'
import { getModuleBaseUrl } from '@/api/config'
import { httpGet } from '@/http/http'

const DEFAULT_FILTER = ''
const HIGH_SPEED_FILTER = 'G,D'
const DEFAULT_ENABLE_BOOKING = '1'
const DEFAULT_DEPARTURE_TIME_RANGE = ''

function formatDate(value: number) {
  const date = dayjs(value || Date.now())
  return date.format('YYYY-MM-DD')
}

function resolveTrainFilter(ctx: SearchContext) {
  if (ctx.mode !== 'train')
    return DEFAULT_FILTER
  const options = ctx.options || []
  return options.includes('standard') ? HIGH_SPEED_FILTER : DEFAULT_FILTER
}

function buildTrainRequest(ctx: SearchContext): TrainScheduleRequest {
  return {
    searchType: '1',
    departureStation: ctx.from,
    arrivalStation: ctx.to,
    date: formatDate(ctx.date),
    filter: resolveTrainFilter(ctx),
    enableBooking: DEFAULT_ENABLE_BOOKING,
    departureTimeRange: DEFAULT_DEPARTURE_TIME_RANGE,
  }
}

function parseDurationMinutes(duration: string) {
  if (!duration)
    return 0
  const match = duration.match(/(\d{1,2}):(\d{2})/)
  if (!match)
    return 0
  const [, hour, minute] = match
  return Number(hour) * 60 + Number(minute)
}

function mapPriceToFare(trainNo: string, price: TrainInfoDTO['prices'][number]): FareOption {
  const remaining = Number(price.num)
  return {
    id: `${trainNo}-${price.seatTypeCode}`,
    name: price.seatName,
    price: price.price,
    remaining: Number.isNaN(remaining) ? undefined : remaining,
    classCode: price.seatTypeCode,
  }
}

function mapTrainToTrip(info: TrainInfoDTO): Trip {
  const fares = (info.prices || []).map(price => mapPriceToFare(info.trainNo, price))
  const priceFrom = fares.length ? Math.min(...fares.map(f => f.price)) : 0
  return {
    id: `train-${info.trainNo}-${info.departureTime}-${info.arrivalTime}`,
    mode: 'train',
    code: info.trainNo,
    fromName: info.departureStation,
    toName: info.arrivalStation,
    departTime: info.departureTime,
    arriveTime: info.arrivalTime,
    durationMinutes: parseDurationMinutes(info.duration),
    priceFrom,
    fares,
    direct: true,
    meta: {
      departureStationCode: info.departureStationCode,
      arrivalStationCode: info.arrivalStationCode,
      enableBooking: info.enableBooking,
      trainFlags: info.trainFlags,
    },
  }
}

export async function fetchTrainTrips(ctx: SearchContext): Promise<Trip[]> {
  const baseUrl = getModuleBaseUrl('train')
  if (!baseUrl)
    throw new Error('未配置火车服务地址，请设置 VITE_API_BASE_TRAIN')

  const requestParams = buildTrainRequest(ctx)
  const response = await httpGet<TrainScheduleResponseDTO>(
    `${baseUrl}/train/query`,
    requestParams,
    undefined,
    { hideErrorToast: true },
  )

  if (response.errorCode !== 0)
    throw new Error(response.reason || '火车车次查询失败')

  return (response.result || []).map(mapTrainToTrip)
}
