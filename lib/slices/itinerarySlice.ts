import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CoreState } from '../../store'

import { request, gql } from 'graphql-request'

interface SchedulesQueryArgs {
  latitude: number
  longitude: number
  reverse?: boolean
}

const SchedulesQuery = ({
  latitude,
  longitude,
  reverse
}: SchedulesQueryArgs) => {
  // prettier-ignore
  const from = `{ lat: ${reverse ? 60.166947 : latitude}, lon: ${reverse ? 24.921601 : longitude } }`
  // prettier-ignore
  const to = `{ lat: ${reverse ? latitude : 60.166947}, lon: ${ reverse ? longitude : 24.921601 } }`
  return gql`
  {
    plan(
      from: ${from}
      to: ${to}
      numItineraries: 10
    ) {
      itineraries {
        startTime
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

export const fetchItineraries = createAsyncThunk(
  'schedule/fetchSchedule',
  async ({
    latitude,
    longitude,
    reverse
  }: SchedulesQueryArgs): Promise<ItineraryState> => {
    const { plan } = await request(
      'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql',
      SchedulesQuery({ latitude, longitude, reverse })
    )
    return plan
  }
)

type ItineraryState = {
  itineraries: {
    startTime: number
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

const itinerarySlice = createSlice({
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

export const { update } = itinerarySlice.actions

export default itinerarySlice.reducer
