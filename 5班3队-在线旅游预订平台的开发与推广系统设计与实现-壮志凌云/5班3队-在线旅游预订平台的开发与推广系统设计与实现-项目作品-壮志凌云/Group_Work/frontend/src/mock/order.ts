import type { OrderDTO, OrderListResponse } from '@/api/types/order'

const mockOrders: OrderDTO[] = [
  {
    id: 1,
    userId: 1,
    productId: 101,
    productType: 2, // Train
    amount: 1,
    totalPrice: 553.0,
    status: 1,
    orderSn: 'ORD202310010001',
    createTime: '2023-10-01 12:00:00',
  },
]

export const orderMock = {
  addOrder: async (data: OrderDTO): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    console.log('Mock add order:', data)
  },

  listOrders: async (page: number, limit: number, userId?: number): Promise<OrderListResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      list: mockOrders,
      total: mockOrders.length,
      page,
      limit,
    }
  },

  getDetail: async (id: number): Promise<OrderDTO> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const order = mockOrders.find(o => o.id === id)
    if (order)
      return order
    throw new Error('Order not found')
  },

  deleteOrder: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    console.log('Mock delete order:', id)
  },
}
