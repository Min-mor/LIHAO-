import type { PassengerInfo, SavePassengerReq } from '@/api/modules/passenger/types'
import type { Traveler, TravelerListParams } from '@/api/modules/traveler/types'
import { addTraveler, deleteTraveler, getTravelerDetail, getTravelerList, updateTraveler } from '@/api/modules/traveler'
import { useUserStore } from '@/store/user'

type PassengerType = PassengerInfo['type']

function toPassengerType(value?: number | string | null): PassengerType {
  const code = Number(value)
  if (code === 2)
    return 'child'
  return 'adult'
}

function toTravelerType(type: PassengerType): number {
  if (type === 'child')
    return 2
  return 1
}

function idCardTypeCodeToLabel(code?: number | string | null): string {
  const value = Number(code)
  switch (value) {
    case 2:
      return '护照'
    case 3:
      return '回乡证'
    case 4:
      return '台胞证'
    default:
      return '二代身份证'
  }
}

function idCardTypeLabelToCode(label?: string): number {
  switch (label) {
    case '护照':
      return 2
    case '回乡证':
      return 3
    case '台胞证':
      return 4
    default:
      return 1
  }
}

function mapTravelerToPassenger(traveler: Traveler): PassengerInfo {
  return {
    id: String(traveler.id),
    name: traveler.fullName,
    type: toPassengerType(traveler.travelerType),
    idNo: traveler.idCardNumber,
    idType: idCardTypeCodeToLabel(traveler.idCardType),
    phone: String(traveler.phone ?? ''),
  }
}

function buildTravelerCreatePayload(input: SavePassengerReq, userId: number): Omit<Traveler, 'id'> {
  return {
    userId,
    fullName: input.name,
    phone: input.phone ?? '',
    idCardType: idCardTypeLabelToCode(input.idType),
    idCardNumber: input.idNo ?? '',
    travelerType: toTravelerType(input.type),
  }
}

function buildTravelerUpdatePayload(id: string, input: SavePassengerReq, userId: number): Traveler {
  return {
    id: Number(id),
    userId,
    fullName: input.name,
    phone: input.phone ?? '',
    idCardType: idCardTypeLabelToCode(input.idType),
    idCardNumber: input.idNo ?? '',
    travelerType: toTravelerType(input.type),
  }
}

export async function fetchTravelersForCurrentUser(params?: Omit<TravelerListParams, 'userId'>): Promise<PassengerInfo[]> {
  const userStore = useUserStore()
  const userId = userStore.userInfo?.userId
  if (!userId || userId === -1)
    return []
  const query: TravelerListParams = {
    page: 1,
    limit: 50,
    ...params,
    userId,
  }
  const res = await getTravelerList(query)
  return (res.records || []).map(mapTravelerToPassenger)
}

export async function createTravelerFromPassenger(payload: SavePassengerReq): Promise<PassengerInfo> {
  const userStore = useUserStore()
  const userId = userStore.userInfo?.userId
  if (!userId || userId === -1)
    throw new Error('未登录，无法添加乘客')
  const travelerInput = buildTravelerCreatePayload(payload, userId)
  const created = await addTraveler(travelerInput)
  return mapTravelerToPassenger(created)
}

export async function updateTravelerFromPassenger(id: string, payload: SavePassengerReq): Promise<PassengerInfo> {
  const userStore = useUserStore()
  const userId = userStore.userInfo?.userId
  if (!userId || userId === -1)
    throw new Error('未登录，无法更新乘客')
  const travelerInput = buildTravelerUpdatePayload(id, payload, userId)
  const updated = await updateTraveler(travelerInput)
  return mapTravelerToPassenger(updated)
}

export async function deleteTravelerById(id: string): Promise<void> {
  await deleteTraveler(id)
}

export async function fetchTravelerDetailAsPassenger(id: string): Promise<PassengerInfo> {
  const detail = await getTravelerDetail(id)
  return mapTravelerToPassenger(detail)
}
