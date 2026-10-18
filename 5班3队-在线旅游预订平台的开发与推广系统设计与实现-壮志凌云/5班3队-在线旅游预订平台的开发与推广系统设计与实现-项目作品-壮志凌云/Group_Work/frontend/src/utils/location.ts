interface ExploreItem {
  id?: string
  title: string
  address?: string
  category?: string
  type?: string
  _distance?: number
  location?: { lat: number, lng: number }
}

export interface NearbyPlace {
  id?: string
  title: string
  address?: string
  category?: string
  distance?: number
  location?: { lat?: number, lng?: number }
}

export interface FetchNearbyParams {
  keyword?: string
  latitude: number
  longitude: number
  radius?: number
  pageSize?: number
  pageIndex?: number
  autoExtend?: boolean
}

const DEFAULT_RADIUS = 2000
const DEFAULT_PAGE_SIZE = 20
const DEFAULT_KEYWORD = '热门景点'

let mapServiceBase = 'https://apis.map.qq.com'
// #ifdef H5
if (typeof window !== 'undefined' && window.location?.origin) {
  mapServiceBase = `${window.location.origin}/tmap`
}
else {
  mapServiceBase = '/tmap'
}
// #endif
const MAP_SEARCH_URL = `${mapServiceBase}/ws/place/v1/search`

function getTencentMapKey() {
  const key = import.meta.env.VITE_TENCENT_MAP_KEY
  if (!key)
    throw new Error('VITE_TENCENT_MAP_KEY 未配置，无法调用腾讯位置服务')
  return key
}

export async function getCurrentLocation(): Promise<{ latitude: number, longitude: number }> {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({ latitude: res.latitude, longitude: res.longitude })
      },
      fail: reject,
    })
  })
}

export async function fetchNearbyPlaces(params: FetchNearbyParams): Promise<NearbyPlace[]> {
  const key = getTencentMapKey()
  const {
    keyword = DEFAULT_KEYWORD,
    latitude,
    longitude,
    radius = DEFAULT_RADIUS,
    pageSize = DEFAULT_PAGE_SIZE,
    pageIndex = 1,
    autoExtend = true,
  } = params

  return new Promise((resolve, reject) => {
    uni.request({
      url: MAP_SEARCH_URL,
      method: 'GET',
      timeout: 10000,
      data: {
        key,
        keyword,
        boundary: buildBoundary(latitude, longitude, radius, autoExtend),
        orderby: '_distance',
        page_size: pageSize,
        page_index: pageIndex,
      },
      success: (res) => {
        const data = res.data as { status: number, message: string, data?: ExploreItem[] }
        if (res.statusCode === 200 && data.status === 0 && Array.isArray(data.data)) {
          resolve(data.data.map(mapExploreItem))
        }
        else {
          reject(new Error(data.message || '腾讯位置服务请求失败'))
        }
      },
      fail: reject,
    })
  })
}

function mapExploreItem(item: ExploreItem): NearbyPlace {
  return {
    id: item.id,
    title: item.title,
    address: item.address,
    category: item.category || item.type,
    distance: item._distance,
    location: item.location,
  }
}

function buildBoundary(lat: number, lng: number, radius: number, autoExtend: boolean) {
  const safeRadius = Math.min(Math.max(radius, 10), 1000)
  const extendFlag = autoExtend ? 1 : 0
  return `nearby(${lat},${lng},${safeRadius},${extendFlag})`
}
