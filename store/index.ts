import { combineReducers, configureStore } from '@reduxjs/toolkit'
import scheduleReducer from '../lib/slices/scheduleSlice'

const rootReducer = combineReducers({ schedule: scheduleReducer })

export type CoreState = ReturnType<typeof rootReducer>

export default configureStore({
  reducer: rootReducer,
  devTools: true
})
