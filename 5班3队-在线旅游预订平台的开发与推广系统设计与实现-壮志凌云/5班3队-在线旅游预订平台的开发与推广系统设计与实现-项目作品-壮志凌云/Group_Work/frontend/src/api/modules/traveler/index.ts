import type { Traveler, TravelerListParams, TravelerListResult } from './types'
import { httpDelete, httpGet, httpPost } from '@/http/http'

export function getTravelerList(params: TravelerListParams) {
  return httpGet<TravelerListResult>('/traveler/list', params)
}

export function addTraveler(data: Omit<Traveler, 'id'>) {
  return httpPost<Traveler>('/traveler/add', data as Traveler)
}

export function updateTraveler(data: Traveler) {
  return httpPost<Traveler>('/traveler/update', data)
}

export function deleteTraveler(id: number | string) {
  return httpDelete<void>(`/traveler/delete/${id}`)
}

export function getTravelerDetail(id: number | string) {
  return httpGet<Traveler>(`/traveler/detail/${id}`)
}
