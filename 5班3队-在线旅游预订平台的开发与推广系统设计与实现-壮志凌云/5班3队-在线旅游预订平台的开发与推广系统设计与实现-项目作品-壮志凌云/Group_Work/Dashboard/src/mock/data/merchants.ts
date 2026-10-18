export interface MerchantApplication {
  id: string
  name: string
  location: string
  description: string
  logo?: string
}

export interface MerchantRecord {
  id: string
  name: string
  contact: string
  joinedAt: string
  status: "active" | "pending" | "suspended"
}

export interface MerchantDetail {
  id: string
  name: string
  location: string
  status: "active" | "inactive" | "pending" | "suspended"
  contactPerson: string
  email: string
  phone: string
  businessType: string
  merchantId: string
  joinedAt: string
  logo?: string
  pitch?: string
}

export interface MerchantManagementDataset {
  applications: MerchantApplication[]
  merchants: MerchantRecord[]
  details: MerchantDetail[]
}

export const merchantManagementMock: MerchantManagementDataset = {
  applications: [
    {
      id: "app-1",
      name: "Sunrise Lodge",
      location: "Banyuwangi, Indonesia",
      description: "Premium hiking packages与山间住宿体验。",
      logo: "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=120&q=60",
    },
    {
      id: "app-2",
      name: "Beachcomber Villas",
      location: "Lombok, Indonesia",
      description: "海滨度假别墅，提供私人泳池与定制服务。",
      logo: "https://images.unsplash.com/photo-1501117716987-c8e1ecb210cc?auto=format&fit=crop&w=120&q=60",
    },
    {
      id: "app-3",
      name: "Aurora Cruise",
      location: "Labuan Bajo",
      description: "精品邮轮线路，聚焦沉浸式海岛体验。",
      logo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=60",
    },
  ],
  merchants: [
    { id: "MER-8498C2", name: "Mount Semeru Adventures", contact: "Ahmad Syafii", joinedAt: "2022-08-14", status: "active" },
    { id: "MER-9931AB", name: "Bali Serenity Retreat", contact: "Lisa Putri", joinedAt: "2023-02-18", status: "pending" },
    { id: "MER-6722DD", name: "Jakarta City Walks", contact: "Rio Dimas", joinedAt: "2021-11-02", status: "active" },
    { id: "MER-3401XZ", name: "Komodo Dive Center", contact: "Dewi Rahman", joinedAt: "2023-05-09", status: "suspended" },
  ],
  details: [
    {
      id: "MER-8498C2",
      name: "Mount Semeru Adventures",
      location: "Malang, Indonesia",
      status: "active",
      contactPerson: "Ahmad Syafii",
      email: "ahmad@semeru.com",
      phone: "+62 812 3456 7890",
      businessType: "Tour Operator",
      merchantId: "MER-8498C2",
      joinedAt: "14 August 2022",
      logo: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=200&q=60",
      pitch: "精品登山行程与山间住宿体验，打造沉浸式火山冒险。",
    },
    {
      id: "MER-9931AB",
      name: "Bali Serenity Retreat",
      location: "Ubud, Indonesia",
      status: "pending",
      contactPerson: "Lisa Putri",
      email: "team@balisarenity.com",
      phone: "+62 812 9988 2211",
      businessType: "Resort",
      merchantId: "MER-9931AB",
      joinedAt: "18 February 2023",
      logo: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=200&q=60",
      pitch: "海岛身心疗愈度假村，提供私人泳池与本地养生导师。",
    },
    {
      id: "MER-3401XZ",
      name: "Komodo Dive Center",
      location: "Labuan Bajo",
      status: "inactive",
      contactPerson: "Dewi Rahman",
      email: "support@komododive.io",
      phone: "+62 811 4400 9988",
      businessType: "Dive Operator",
      merchantId: "MER-3401XZ",
      joinedAt: "09 May 2023",
      logo: "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?auto=format&fit=crop&w=200&q=60",
      pitch: "星级潜水教练团队，主打科莫多国家公园深潜路线。",
    },
    {
      id: "MER-6722DD",
      name: "Jakarta City Walks",
      location: "Jakarta, Indonesia",
      status: "active",
      contactPerson: "Rio Dimas",
      email: "hello@jcwalks.com",
      phone: "+62 812 7772 9911",
      businessType: "Guide Service",
      merchantId: "MER-6722DD",
      joinedAt: "02 November 2021",
      logo: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=200&q=60",
      pitch: "城市微旅行策展人，带你解锁雅加达的隐藏市井。",
    },
  ],
}
