export type ProductStatus = "published" | "unpublished"

export interface MerchantProduct {
  id: string
  name: string
  sku: string
  cover: string
  category: string
  price: number
  inventory: {
    total: number
    label: string
    tone: "default" | "warning"
  }
  status: ProductStatus
  updatedAt: string
}

export interface ProductFilterMeta {
  categories: string[]
  statuses: { value: ProductStatus; label: string }[]
}

export interface MerchantProductDataset {
  summary: {
    total: number
    published: number
    draft: number
  }
  filters: ProductFilterMeta
  list: MerchantProduct[]
}

export const merchantProductsMock: MerchantProductDataset = {
  summary: {
    total: 25,
    published: 18,
    draft: 7,
  },
  filters: {
    categories: ["冒险体验", "城市玩乐", "浪漫旅行", "奢华度假", "亲子家庭"],
    statuses: [
      { value: "published", label: "已发布" },
      { value: "unpublished", label: "未发布" },
    ],
  },
  list: [
    {
      id: "PROD-001",
      name: "巴厘岛梯田一日游",
      sku: "TRIP-001",
      cover:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
      category: "冒险体验",
      price: 120,
      inventory: { total: 50, label: "剩余 50", tone: "default" },
      status: "published",
      updatedAt: "2 小时前",
    },
    {
      id: "PROD-002",
      name: "东京夜景轻旅",
      sku: "TRIP-002",
      cover:
        "https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=600&q=80",
      category: "城市玩乐",
      price: 250,
      inventory: { total: 2, label: "仅剩 2", tone: "warning" },
      status: "published",
      updatedAt: "昨天",
    },
    {
      id: "PROD-003",
      name: "巴黎浪漫旅拍",
      sku: "TRIP-003",
      cover:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
      category: "浪漫旅行",
      price: 899,
      inventory: { total: 15, label: "剩余 15", tone: "default" },
      status: "unpublished",
      updatedAt: "3 天前",
    },
    {
      id: "PROD-004",
      name: "马尔代夫水上别墅",
      sku: "TRIP-004",
      cover:
        "https://www.runhotel.hk/wp-content/uploads/2017/05/ocean-villa-with-pool-dusit-thani-maldives-resort-mudhdhoo-5-star-luxurious-beach-island-hotel-book-honeymoon-vacation-packages-holidays-offers-booking-deals-reviews.jpg",
      category: "奢华度假",
      price: 1299,
      inventory: { total: 6, label: "仅剩 6", tone: "warning" },
      status: "published",
      updatedAt: "1 周前",
    },
    {
      id: "PROD-005",
      name: "苏格兰高地徒步",
      sku: "TRIP-005",
      cover:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
      category: "冒险体验",
      price: 560,
      inventory: { total: 30, label: "剩余 30", tone: "default" },
      status: "published",
      updatedAt: "2 周前",
    },
  ],
}
