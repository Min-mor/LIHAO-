import type { SearchContext, Trip } from '@/types/ticket'
import { searchTripsMock } from '@/mock/data/tickets'

/**
 * 火车/航班 mock 数据统一出口，方便在 API 层切换
 */
export async function fetchMockTrips(ctx: SearchContext): Promise<Trip[]> {
  return searchTripsMock(ctx)
}
