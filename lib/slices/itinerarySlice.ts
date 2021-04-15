import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CoreState } from '../../store'

import { request, gql } from 'graphql-request'

interface FetchScheduleArgs {
  latitude: number
  longitude: number
}

const SchedulesQuery = (
  { latitude, longitude }: FetchScheduleArgs,
  reverse = false
) => {
  // prettier-ignore
  const from = `{ lat: ${reverse ? 60.16726685101889 : latitude}, lon: ${reverse ? 24.921692418124902 : longitude } }`
  // prettier-ignore
  const to = `{ lat: ${reverse ? latitude : 60.16726685101889}, lon: ${ reverse ? longitude : 24.921692418124902 } }`
  return gql`
  {
    plan(
      from: ${from}
      to: ${to}
      numItineraries: 10
    ) {
      itineraries {
        legs {
          mode
          startTime
          endTime
          from {
            lat
            lon
            name
            stop {
              code
              name
              gtfsId
              stoptimesForPatterns(omitNonPickups: true, timeRange: 86400) {
                pattern {
                  code
                }
                stoptimes {
                  scheduledDeparture
                }
              }
            }
          }
          to {
            lat
            lon
            name
            stop {
              patterns {
                code
              }
            }
          }
          trip {
            gtfsId
            pattern {
              code
              name
              headsign
            }
            tripHeadsign
          }
        }
      }
    }
  }
`
}

interface FetchScheduleArgs {
  latitude: number
  longitude: number
}

export const fetchItineraries = createAsyncThunk(
  'schedule/fetchSchedule',
  async ({
    latitude,
    longitude
  }: FetchScheduleArgs): Promise<ItineraryState> => {
    const { plan } = await request(
      'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
      SchedulesQuery({ latitude, longitude })
    )
    return plan
  }
)

type ItineraryState = {
  itineraries: {
    legs: {
      startTime: number
      endTime: number
      mode: 'WALK' | 'BUS' | 'SUBWAY' | 'RAIL' | 'TRAM' | 'FERRY'
      from: {
        lat: number
        long: number
        name: string
        stop: {
          code: string
          name: string
          gtfsId: string
          stopTimesForPatterns: {
            pattern: {
              code: string
            }
            stoptimes: {
              scheduledDeparture: number
            }[]
          }[]
        } | null
      }
      to: {
        lat: number
        long: number
        name: string
        stop: {
          patterns: {
            code: string
          }[]
        }
      }
      trip: {
        gtfsId: string
        tripHeadsign: string
        pattern: {
          code: string
          name: string
        }
      } | null
    }[]
  }[]
}

const initialState: ItineraryState = {
  itineraries: []
}

const scheduleSlice = createSlice({
  name: 'itineraries',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<ItineraryState>) => {
      state.itineraries = action.payload.itineraries
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchItineraries.fulfilled,
      (state, action: PayloadAction<ItineraryState>) => {
        state.itineraries = action.payload.itineraries
      }
    )
  }
})

export const selectItinerary = (state: CoreState) => state.itineraries

export const { update } = scheduleSlice.actions

export default scheduleSlice.reducer
