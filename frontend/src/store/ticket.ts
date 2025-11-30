import type { FareOption, OrderDraft, SearchContext, Trip } from '@/types/ticket'
import { defineStore } from 'pinia'
import { searchTrips } from '@/api/modules/ticket/ticket'
import { useUserStore } from '@/store/user'

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    search: {
      mode: 'train',
      from: '上海',
      to: '北京',
      date: Date.now(),
      options: [] as string[],
      directOnly: false,
      sortAsc: true,
    } as SearchContext,
    results: [] as Trip[],
    loading: false,
    selectedTrip: null as Trip | null,
    selectedFareId: '' as string,
    passengers: [] as { id: string, name: string, type: 'adult' | 'child' | 'student', idNo?: string, idType?: string, phone?: string }[],
    savedPassengers: [] as { id: string, userId: number, name: string, type: 'adult' | 'child' | 'student', idNo?: string, idType?: string, phone?: string }[],
    contactPhone: '',
  }),
  persist: true,
  getters: {
    savedPassengersForCurrentUser(state): { id: string, userId: number, name: string, type: 'adult' | 'child' | 'student', idNo?: string, idType?: string, phone?: string }[] {
      const userStore = useUserStore()
      const currentUserId = userStore.userInfo?.userId
      if (!currentUserId || currentUserId === -1)
        return []
      return state.savedPassengers.filter(p => p.userId === currentUserId)
    },
    selectedFare(state): FareOption | undefined {
      return state.selectedTrip?.fares.find(f => f.id === state.selectedFareId)
    },
    orderDraft(state): OrderDraft | null {
      const fare = state.selectedTrip?.fares.find(f => f.id === state.selectedFareId)
      if (!state.selectedTrip || !fare)
        return null
      const total = fare.price * Math.max(1, state.passengers.length || 1)
      return {
        tripId: state.selectedTrip.id,
        fareId: fare.id,
        passengers: state.passengers.length ? state.passengers : [{ id: 'p1', name: '张三', type: 'adult' }],
        contactPhone: state.contactPhone,
        mode: state.selectedTrip.mode,
        totalPrice: total,
      }
    },
  },
  actions: {
    setSearch(payload: Partial<SearchContext>) {
      this.search = {
        ...this.search,
        ...payload,
        options: payload.options ?? this.search.options,
      }
    },
    swapCities() {
      const { from, to } = this.search
      this.search.from = to
      this.search.to = from
    },
    async query() {
      this.loading = true
      try {
        this.results = await searchTrips(this.search)
      }
      finally {
        this.loading = false
      }
    },
    setSavedPassengersForCurrentUser(list: { id: string, name: string, type: 'adult' | 'child' | 'student', idNo?: string, idType?: string, phone?: string }[]) {
      const userStore = useUserStore()
      const userId = userStore.userInfo?.userId || -1
      const others = this.savedPassengers.filter(x => x.userId !== userId)
      const mapped = list.map(p => ({ ...p, userId }))
      this.savedPassengers = [...others, ...mapped]
    },
    chooseTrip(trip: Trip) {
      this.selectedTrip = trip
      this.selectedFareId = trip.fares[0]?.id || ''
    },
    chooseFare(fareId: string) {
      this.selectedFareId = fareId
    },
    setPassengers(list: { id: string, name: string, type: 'adult' | 'child' | 'student', idNo?: string }[]) {
      this.passengers = list
    },
    addSavedPassenger(p: { id?: string, name: string, type: 'adult' | 'child' | 'student', idNo?: string, idType?: string, phone?: string }) {
      const userStore = useUserStore()
      const userId = userStore.userInfo?.userId || -1
      const id = p.id || `sp_${Date.now()}`
      const item = { id, userId, name: p.name, type: p.type, idNo: p.idNo, idType: p.idType, phone: p.phone }
      this.savedPassengers = [...this.savedPassengers.filter(x => x.id !== id), item]
      return id
    },
    updateSavedPassenger(p: { id: string, name?: string, type?: 'adult' | 'child' | 'student', idNo?: string, idType?: string, phone?: string }) {
      this.savedPassengers = this.savedPassengers.map(x => x.id === p.id ? { ...x, ...p } : x)
    },
    removeSavedPassenger(id: string) {
      this.savedPassengers = this.savedPassengers.filter(x => x.id !== id)
    },
    setContactPhone(v: string) {
      this.contactPhone = v
    },
    resetDraft() {
      this.selectedTrip = null
      this.selectedFareId = ''
      this.passengers = []
      this.contactPhone = ''
    },
  },
})
