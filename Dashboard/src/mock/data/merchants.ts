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
  status: "active" | "inactive" | "pending"
  contactPerson: string
  email: string
  phone: string
  businessType: string
  merchantId: string
  joinedOn: string
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
    },
    {
      id: "app-2",
      name: "Beachcomber Villas",
      location: "Lombok, Indonesia",
      description: "海滨度假别墅，提供私人泳池与定制服务。",
    },
    {
      id: "app-3",
      name: "Aurora Cruise",
      location: "Labuan Bajo",
      description: "精品邮轮线路，聚焦沉浸式海岛体验。",
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
      joinedOn: "14 August 2022",
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
      joinedOn: "18 February 2023",
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
      joinedOn: "09 May 2023",
    },
  ],
}
