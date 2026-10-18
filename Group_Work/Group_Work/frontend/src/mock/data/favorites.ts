import type { ProfileFavorites } from '../profile-types'

export const favoriteList: ProfileFavorites = {
  sights: [
    {
      id: 'fav-s-001',
      type: 'sight',
      cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=720&q=60',
      title: '摩洛哥撒哈拉星空营地',
      location: '摩洛哥 · 梅祖卡',
      summary: '夜晚的银汉星空和沙漠日出让人沉醉。',
      likedAt: '2025-09-02',
    },
    {
      id: 'fav-s-002',
      type: 'sight',
      cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=60',
      title: '那不勒斯悬崖海景餐厅',
      location: '意大利 · 阿马尔菲',
      summary: '面海露台与手工海鲜面，最佳日落餐厅。',
      likedAt: '2025-08-17',
    },
  ],
  footprints: [
    {
      id: 'fav-fp-001',
      type: 'footprint',
      cover: 'https://images.unsplash.com/photo-1526481280695-3c46973edbc6?auto=format&fit=crop&w=720&q=60',
      title: '京都清晨散步',
      article: '穿过花见小路，看晨曦洒在古街石板上，余晖映在町屋的木窗上。',
      likedAt: '2025-09-12',
    },
    {
      id: 'fav-fp-002',
      type: 'footprint',
      cover: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=720&q=60',
      title: '桂林山水泛舟',
      article: '青山如黛，江水如镜，一叶扁舟穿过漓江的薄雾，仿佛行走在山水画里。',
      likedAt: '2025-08-30',
    },
  ],
}
