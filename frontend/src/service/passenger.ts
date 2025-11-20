import type { DeletePassengerReq, GetPassengersReq, PassengerInfo, SavePassengerReq } from '@/api/modules/passenger/types'
import { deletePassenger as apiDeletePassenger, getPassengers as apiGetPassengers, savePassenger as apiSavePassenger } from '@/api/modules/passenger'
import { mockDeletePassenger, mockGetPassengers, mockSavePassenger } from '@/mock/passenger'

/**
 * 获取乘客列表
 */
export async function getPassengers(params?: GetPassengersReq): Promise<PassengerInfo[]> {
  if (import.meta.env.DEV) {
    const res = await mockGetPassengers(params)
    return res.passengers
  }

  const res = await apiGetPassengers(params)
  return res.passengers
}

/**
 * 保存乘客（新增或更新）
 */
export async function savePassenger(params: SavePassengerReq): Promise<PassengerInfo> {
  if (import.meta.env.DEV) {
    const res = await mockSavePassenger(params)
    return res.passenger
  }

  const res = await apiSavePassenger(params)
  return res.passenger
}

/**
 * 删除乘客
 */
export async function deletePassenger(params: DeletePassengerReq): Promise<boolean> {
  if (import.meta.env.DEV) {
    const res = await mockDeletePassenger(params)
    return res.success
  }

  const res = await apiDeletePassenger(params)
  return res.success
}
