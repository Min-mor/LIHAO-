import type { SearchContext, Trip } from '@/types/ticket'
import { searchTripsMock } from '@/mock/data/tickets'

// 统一对外 API：后续接入真实后端时，仅需替换这里的实现
export async function searchTrips(ctx: SearchContext): Promise<Trip[]> {
  return searchTripsMock(ctx)
}
