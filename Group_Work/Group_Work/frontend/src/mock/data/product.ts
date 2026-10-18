import type { DestinationTab, ProductCard } from '@/api/modules/product/types'

export const destinationTabsMock: DestinationTab[] = [
  { name: 'nearby', title: '附近' },
  { name: 'recommend', title: '推荐' },
  { name: 'hotel', title: '酒店' },
]

export const heroPackagesMock: ProductCard[] = [
  // 推荐 items
  {
    id: 'rec-1',
    title: '夕阳红团',
    cover: 'https://images.unsplash.com/photo-1624396963238-df0e48367ff7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNvdmVyJTIwcGhvdG98ZW58MHx8MHx8fDA%3D',
    score: '4.9',
    summary: '含机酒服务 · 四晚五星酒店 · 私导陪同',
    tags: ['含接送', '私导团', '双人房'],
    category: 'recommend',
  },
  {
    id: 'rec-2',
    title: '心动精选',
    cover: 'https://images.unsplash.com/photo-1615196534055-7aa534f6836b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGNvdmVyJTIwcGhvdG98ZW58MHx8MHx8fDA%3D',
    score: '5.0',
    summary: 'AI 智能匹配行程 · 7x24 私人客服',
    tags: ['AI 行程', '私人客服', '豪华宅度'],
    category: 'recommend',
  },
  {
    id: 'rec-3',
    title: '山川湖海',
    cover: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    score: '4.7',
    summary: '探索未知的自然风光 · 专业摄影师跟拍',
    tags: ['摄影游', '自然风光', '小团'],
    category: 'recommend',
  },
  // 酒店 items
  {
    id: 'hotel-1',
    title: '喜阳光团',
    cover: 'https://images.unsplash.com/photo-1608408843596-b3119736057c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNvdmVyJTIwcGhvdG98ZW58MHx8MHx8fDA%3D',
    score: '4.8',
    summary: '亲子俱乐部 · 全天候泳池 · 亲子餐厅',
    tags: ['亲子优选', '海景房', '温泉'],
    category: 'hotel',
  },
  {
    id: 'hotel-2',
    title: '云端度假村',
    cover: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    score: '4.9',
    summary: '高山云海景观 · 悬崖无边泳池',
    tags: ['奢华', '景观', '情侣'],
    category: 'hotel',
  },
  {
    id: 'hotel-3',
    title: '森林木屋',
    cover: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    score: '4.6',
    summary: '隐居森林深处 · 独立庭院',
    tags: ['静谧', '独栋', '宠物友好'],
    category: 'hotel',
  },
  // 附近 items (nearby)
  {
    id: 'near-1',
    title: '周末短途',
    cover: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    score: '4.5',
    summary: '城市周边 2 小时圈 · 轻松惬意',
    tags: ['短途', '自驾', '野餐'],
    category: 'nearby',
  },
  {
    id: 'near-2',
    title: '古镇探秘',
    cover: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    score: '4.4',
    summary: '体验传统文化 · 品尝地道美食',
    tags: ['文化', '美食', '古建'],
    category: 'nearby',
  },
  {
    id: 'near-3',
    title: '城市露营',
    cover: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    score: '4.8',
    summary: '无需远行 · 享受户外乐趣',
    tags: ['露营', '聚会', '亲子'],
    category: 'nearby',
  },
]
