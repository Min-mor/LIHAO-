export interface OrderDTO {
  id?: number
  userId: number
  productId: number
  productType: number // 1: 门票, 2: 火车票, etc.
  amount: number // 数量
  totalPrice: number
  status?: number // 0: 待支付, 1: 已支付, etc.
  orderSn?: string // 订单编号
  createTime?: string
  updateTime?: string
  // 预留扩展字段
  extraInfo?: string
}

export interface OrderListResponse {
  list: OrderDTO[]
  total: number
  page: number
  limit: number
}
