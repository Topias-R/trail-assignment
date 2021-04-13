import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CoreState } from '../../store'

type ScheduleState = {
  times: {
    time: number
    stop: string
    number: number
  }[]
}

const initialState: ScheduleState = {
  times: [],
}

const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<ScheduleState>) => {
      state.times = action.payload.times
    },
  },
})

export const selectSchedule = (state: CoreState) => state.schedule

export const { update } = scheduleSlice.actions

export default scheduleSlice.reducer
