import { combineReducers, configureStore } from '@reduxjs/toolkit'
import itineraryReducer from '../lib/slices/itinerarySlice'
import searchReducer from '../lib/slices/searchSlice'

const rootReducer = combineReducers({
  itineraries: itineraryReducer,
  search: searchReducer
})

export type CoreState = ReturnType<typeof rootReducer>

const store = configureStore({
  reducer: rootReducer,
  devTools: true
})

export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
