import type { PassengerInfo } from '@/api/modules/passenger/types'

// 模拟的乘客数据库（按用户ID组织）
const passengerDatabase: Record<number, PassengerInfo[]> = {}

/**
 * 获取指定用户的所有乘客
 */
export function getPassengersByUserId(userId: number): PassengerInfo[] {
  return passengerDatabase[userId] || []
}

/**
 * 添加或更新乘客信息
 */
export function savePassenger(userId: number, passenger: PassengerInfo): PassengerInfo {
  if (!passengerDatabase[userId]) {
    passengerDatabase[userId] = []
  }

  const existing = passengerDatabase[userId].findIndex(p => p.id === passenger.id)
  
  if (existing !== -1) {
    // 更新现有乘客
    passengerDatabase[userId][existing] = passenger
  }
  else {
    // 添加新乘客
    passengerDatabase[userId].push(passenger)
  }

  return passenger
}

/**
 * 删除乘客
 */
export function deletePassenger(userId: number, passengerId: string): boolean {
  if (!passengerDatabase[userId])
    return false

  const index = passengerDatabase[userId].findIndex(p => p.id === passengerId)
  
  if (index !== -1) {
    passengerDatabase[userId].splice(index, 1)
    return true
  }

  return false
}

/**
 * 初始化测试数据（可选）
 */
export function initMockPassengers() {
  // 可以在这里添加一些测试数据
  // 例如：为用户ID 1001 添加测试乘客
  const testUserId = 1001
  passengerDatabase[testUserId] = [
    {
      id: 'mock_passenger_1',
      name: '张三',
      type: 'adult',
      idType: '二代身份证',
      idNo: '110101199001011234',
      phone: '13800138000',
    },
  ]
}
