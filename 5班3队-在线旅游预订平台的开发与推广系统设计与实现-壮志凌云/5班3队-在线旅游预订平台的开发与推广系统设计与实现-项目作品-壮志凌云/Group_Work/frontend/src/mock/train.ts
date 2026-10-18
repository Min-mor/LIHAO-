import type { TrainInfoDTO, TrainScheduleRequestDTO, TrainScheduleResponseDTO } from '@/api/types/train'
import { searchTripsMock } from '@/mock/data/tickets'
import type { SearchContext } from '@/types/ticket'

export const trainMock = {
  query: async (params: TrainScheduleRequestDTO): Promise<TrainScheduleResponseDTO> => {
    // Convert DTO params to SearchContext for existing mock
    const ctx: SearchContext = {
      mode: 'train',
      from: params.departureStation,
      to: params.arrivalStation,
      date: new Date(params.date).getTime(),
    }

    const trips = await searchTripsMock(ctx)

    // Map Trip[] to TrainInfoDTO[]
    const result: TrainInfoDTO[] = trips.map(trip => ({
      train_no: trip.code,
      departure_station: trip.fromName,
      arrival_station: trip.toName,
      departure_station_code: 'MOCK_DEP',
      arrival_station_code: 'MOCK_ARR',
      departure_time: trip.departTime,
      arrival_time: trip.arriveTime,
      duration: `${Math.floor(trip.durationMinutes / 60)}:${trip.durationMinutes % 60}`,
      enable_booking: 'Y',
      prices: trip.fares.map(f => ({
        seat_type: f.name,
        price: f.price.toString(),
        remaining: f.remaining?.toString() || '有',
      })),
      train_flags: ['智能动车组'],
    }))

    return {
      error_code: 0,
      reason: 'Success',
      result,
    }
  },
}
