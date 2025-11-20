import type { DeletePassengerReq, DeletePassengerRes, GetPassengersReq, GetPassengersRes, SavePassengerReq, SavePassengerRes } from '@/api/modules/passenger/types'
import { deletePassenger, getPassengersByUserId, savePassenger } from '@/mock/data/passengers'
import { getActiveUserId } from '@/mock/data/users'

/**
 * 获取当前用户的乘客列表
 */
export async function mockGetPassengers(_req?: GetPassengersReq): Promise<GetPassengersRes> {
  const userId = getActiveUserId()
  
  if (userId === -1) {
    return Promise.reject(new Error('未登录'))
  }

  const passengers = getPassengersByUserId(userId)
  
  return {
    passengers,
  }
}

/**
 * 保存乘客信息（新增或更新）
 */
export async function mockSavePassenger(req: SavePassengerReq): Promise<SavePassengerRes> {
  const userId = getActiveUserId()
  
  if (userId === -1) {
    return Promise.reject(new Error('未登录'))
  }

  // 生成ID（如果是新增）
  const passengerId = req.id || `passenger_${userId}_${Date.now()}`
  
  const passenger = {
    ...req,
    id: passengerId,
  }

  const savedPassenger = savePassenger(userId, passenger)
  
  return {
    passenger: savedPassenger,
  }
}

/**
 * 删除乘客
 */
export async function mockDeletePassenger(req: DeletePassengerReq): Promise<DeletePassengerRes> {
  const userId = getActiveUserId()
  
  if (userId === -1) {
    return Promise.reject(new Error('未登录'))
  }

  const success = deletePassenger(userId, req.id)
  
  if (!success) {
    return Promise.reject(new Error('乘客不存在'))
  }

  return {
    success: true,
  }
}
