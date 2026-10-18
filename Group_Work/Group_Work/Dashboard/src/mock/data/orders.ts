export type OrderStatus = "completed" | "processing" | "pending" | "cancelled"

export interface OrderRecord {
  id: string
  orderNo: string
  customerName: string
  customerAvatar: string
  productName: string
  departDate: string
  total: number
  status: OrderStatus
}

export const ordersMock: OrderRecord[] = [
  {
    id: "order-7463",
    orderNo: "#TRV7463",
    customerName: "简·杜",
    customerAvatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=80&q=60",
    productName: "塞梅鲁火山 5 日团",
    departDate: "2023-11-02",
    total: 6900,
    status: "completed",
  },
  {
    id: "order-7462",
    orderNo: "#TRV7462",
    customerName: "约翰·史密斯",
    customerAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=80&q=60",
    productName: "默拉布徒步",
    departDate: "2023-11-01",
    total: 4500,
    status: "pending",
  },
  {
    id: "order-7461",
    orderNo: "#TRV7461",
    customerName: "萨曼莎·格林",
    customerAvatar: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=80&q=60",
    productName: "曼达拉登山",
    departDate: "2023-10-30",
    total: 5700,
    status: "processing",
  },
  {
    id: "order-7460",
    orderNo: "#TRV7460",
    customerName: "彼得·琼斯",
    customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=60",
    productName: "克林奇峰 3 日团",
    departDate: "2023-10-29",
    total: 3200,
    status: "cancelled",
  },
  {
    id: "order-7459",
    orderNo: "#TRV7459",
    customerName: "王洁",
    customerAvatar: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=80&q=60",
    productName: "巴厘岛家庭套团",
    departDate: "2023-10-28",
    total: 8800,
    status: "completed",
  },
  {
    id: "order-7458",
    orderNo: "#TRV7458",
    customerName: "刘阳",
    customerAvatar: "https://images.unsplash.com/photo-1542206395-9feb3edaa68e?auto=format&fit=crop&w=80&q=60",
    productName: "龙目岛深潜",
    departDate: "2023-10-27",
    total: 5400,
    status: "processing",
  },
  {
    id: "order-7457",
    orderNo: "#TRV7457",
    customerName: "陈思思",
    customerAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=80&q=60",
    productName: "吉利群岛自由行",
    departDate: "2023-10-25",
    total: 3600,
    status: "pending",
  },
  {
    id: "order-7456",
    orderNo: "#TRV7456",
    customerName: "黄磊",
    customerAvatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=80&q=60",
    productName: "婆罗摩日出体验",
    departDate: "2023-10-24",
    total: 4200,
    status: "completed",
  },
]
