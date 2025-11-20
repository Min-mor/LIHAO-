import type { SearchContext, Trip } from '@/types/ticket'
import { API_MODE } from '@/api/config'
import { fetchTrainTrips } from '../train'
import { fetchMockTrips } from '../train/mock'

// 统一对外 API：根据接口模式自动切换 mock/真实数据
export async function searchTrips(ctx: SearchContext): Promise<Trip[]> {
  const useRealApi = API_MODE === 'real' && ctx.mode === 'train'
  if (useRealApi) {
    try {
      return await fetchTrainTrips(ctx)
    }
    catch (error) {
      console.warn('[ticket] 火车真实接口调用失败，回退 mock：', error)
    }
  }

  return fetchMockTrips(ctx)
}
