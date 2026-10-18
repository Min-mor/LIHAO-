export interface Traveler {
  id: number
  userId: number
  fullName: string
  phone: string | number
  idCardType: number | string
  idCardNumber: string
  travelerType: number | string
}

export interface TravelerListParams {
  page?: number
  limit?: number
  userId?: number
}

export interface TravelerListResult {
  records: Traveler[]
  total: number
  size: number
  current: number
  pages: number
}
