import type { FareOption, OrderDraft, SearchContext, Trip } from '@/types/ticket'
import { defineStore } from 'pinia'
import { searchTrips } from '@/api/ticket'

export const useTicketStore = defineStore('ticket', {
  state: () => ({
    search: {
      mode: 'train',
      from: '上海',
      to: '北京',
      date: Date.now(),
      options: ['standard'] as string[],
      directOnly: false,
      sortAsc: true,
    } as SearchContext,
    results: [] as Trip[],
    loading: false,
    selectedTrip: null as Trip | null,
    selectedFareId: '' as string,
    passengers: [] as { id: string; name: string; type: 'adult' | 'child' | 'student'; idNo?: string }[],
    contactPhone: '',
  }),
  persist: true,
  getters: {
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
      this.search = { ...this.search, ...payload }
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
      } finally {
        this.loading = false
      }
    },
    chooseTrip(trip: Trip) {
      this.selectedTrip = trip
      this.selectedFareId = trip.fares[0]?.id || ''
    },
    chooseFare(fareId: string) {
      this.selectedFareId = fareId
    },
    setPassengers(list: { id: string; name: string; type: 'adult' | 'child' | 'student'; idNo?: string }[]) {
      this.passengers = list
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
