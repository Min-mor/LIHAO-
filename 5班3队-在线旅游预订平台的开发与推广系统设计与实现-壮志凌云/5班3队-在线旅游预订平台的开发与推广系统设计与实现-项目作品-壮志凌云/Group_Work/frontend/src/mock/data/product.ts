import type { DestinationTab, ProductCard } from '@/api/modules/product/types'

export const destinationTabsMock: DestinationTab[] = [
  { name: 'nearby', title: '附近' },
  { name: 'recommend', title: '推荐' },
  { name: 'hotel', title: '酒店' },
]

export const heroPackagesMock: ProductCard[] = [
  {
    id: 's-1',
    title: '夕阳红团',
    cover: 'https://images.unsplash.com/photo-1624396963238-df0e48367ff7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvdmVyJTIwcGhvdG98ZW58MHx8MHx8fDA%3D',
    score: '4.9',
    summary: '含机酒服务 · 四晚五星酒店 · 私导陪同',
    tags: ['含接送', '私导团', '双人房'],
  },
  {
    id: 's-2',
    title: '喜阳光团',
    cover: 'https://images.unsplash.com/photo-1608408843596-b3119736057c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNvdmVyJTIwcGhvdG98ZW58MHx8MHx8fDA%3D',
    score: '4.8',
    summary: '亲子俱乐部 · 全天候泳池 · 亲子餐厅',
    tags: ['亲子优选', '海景房', '温泉'],
  },
  {
    id: 's-3',
    title: '心动精选',
    cover: 'https://images.unsplash.com/photo-1615196534055-7aa534f6836b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGNvdmVyJTIwcGhvdG98ZW58MHx8MHx8fDA%3D',
    score: '5.0',
    summary: 'AI 智能匹配行程 · 7x24 私人客服',
    tags: ['AI 行程', '私人客服', '豪华宅度'],
  },
]
