import type { OrderDTO, OrderListResponse } from './types'
import { shouldUseMock } from '@/api/config'
import { http } from '@/http/http'
import { orderMock } from '@/mock/order'

export const orderApi = {
  addOrder: (data: OrderDTO) => {
    if (shouldUseMock('order'))
      return orderMock.addOrder(data)
    return http.post<void>('/api/order/add', data)
  },

  listOrders: (page: number, limit: number, userId?: number) => {
    if (shouldUseMock('order'))
      return orderMock.listOrders(page, limit, userId)
    return http.get<OrderListResponse>('/api/order/list', { page, limit, userId })
  },

  getDetail: (id: number) => {
    if (shouldUseMock('order'))
      return orderMock.getDetail(id)
    return http.get<OrderDTO>(`/api/order/detail/${id}`)
  },

  deleteOrder: (id: number) => {
    if (shouldUseMock('order'))
      return orderMock.deleteOrder(id)
    return http.delete<void>(`/api/order/delete/${id}`)
  },
}
