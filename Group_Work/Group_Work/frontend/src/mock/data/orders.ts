import type { OrderItem } from '../profile-types'

export const orderList: OrderItem[] = [
  {
    id: 'ord-001',
    orderType: '高铁动车',
    status: '进行中',
    date: '2025-10-12',
    title: '上海 ⇄ 北京 高铁双人往返',
    subtitle: 'G123 次 · 商务座 · 含接站服务',
    amount: '￥3,980',
    hasComment: false,
  },
  {
    id: 'ord-002',
    orderType: '旅行团',
    status: '已完成',
    date: '2025-09-18',
    title: '圣托里尼深度 5 日自由行',
    subtitle: '含机酒+洞穴酒店+私人导游',
    amount: '￥18,640',
    hasComment: true,
    attachments: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=720&q=60',
    ],
  },
  {
    id: 'ord-003',
    orderType: '酒店',
    status: '待付款',
    date: '2025-10-21',
    title: '巴厘岛悦榕庄海景套房 3 晚',
    subtitle: '含早餐 · 双人水疗体验券',
    amount: '￥7,280',
    hasComment: false,
  },
  {
    id: 'ord-004',
    orderType: '飞机',
    status: '已退款',
    date: '2025-08-09',
    title: '成都 ⇄ 桂林 往返机票',
    subtitle: '川航 3U8821 · 经济舱 · 含 23kg 行李',
    amount: '￥1,680',
    hasComment: true,
  },
]
