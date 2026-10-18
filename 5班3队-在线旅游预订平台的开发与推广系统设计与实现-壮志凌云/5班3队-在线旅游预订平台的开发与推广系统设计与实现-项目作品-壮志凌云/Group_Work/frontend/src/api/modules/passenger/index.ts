import type { DeletePassengerReq, DeletePassengerRes, GetPassengersReq, GetPassengersRes, SavePassengerReq, SavePassengerRes } from './types'
import { httpGet, httpPost } from '@/http/http'

/**
 * 获取乘客列表
 */
export function getPassengers(data?: GetPassengersReq) {
  return httpGet<GetPassengersRes>('/api/passengers', data)
}

/**
 * 保存乘客（新增或更新）
 */
export function savePassenger(data: SavePassengerReq) {
  return httpPost<SavePassengerRes>('/api/passengers', data)
}

/**
 * 删除乘客
 */
export function deletePassenger(data: DeletePassengerReq) {
  return httpPost<DeletePassengerRes>(`/api/passengers/${data.id}/delete`, {})
}
