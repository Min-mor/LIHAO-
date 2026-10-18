/**
 * 乘客类型
 */
export type PassengerType = 'adult' | 'child' | 'student'

/**
 * 乘客信息
 */
export interface PassengerInfo {
  /** 乘客ID */
  id: string
  /** 姓名 */
  name: string
  /** 乘客类型 */
  type: PassengerType
  /** 证件类型 */
  idType?: string
  /** 证件号 */
  idNo?: string
  /** 联系电话 */
  phone?: string
}

/**
 * 获取乘客列表请求参数
 */
export interface GetPassengersReq {
  /** 用户ID（可选，服务端通过token获取） */
  userId?: number
}

/**
 * 获取乘客列表响应
 */
export interface GetPassengersRes {
  passengers: PassengerInfo[]
}

/**
 * 保存乘客请求参数
 */
export interface SavePassengerReq extends Omit<PassengerInfo, 'id'> {
  /** 乘客ID，更新时必传 */
  id?: string
}

/**
 * 保存乘客响应
 */
export interface SavePassengerRes {
  passenger: PassengerInfo
}

/**
 * 删除乘客请求参数
 */
export interface DeletePassengerReq {
  /** 乘客ID */
  id: string
}

/**
 * 删除乘客响应
 */
export interface DeletePassengerRes {
  success: boolean
}
