import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CoreState } from '../../store'

type SearchState = {
  search: {
    term: string
    reverse: boolean
  }
}

const initialState: SearchState = {
  search: {
    term: '',
    reverse: false
  }
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    updateTerm: (state, action: PayloadAction<string>) => {
      state.search.term = action.payload
    },
    updateReverse: (state, action: PayloadAction<boolean>) => {
      state.search.reverse = action.payload
    }
  }
})

export const selectSearch = (state: CoreState) => state.search

export const { updateTerm, updateReverse } = searchSlice.actions

export default searchSlice.reducer
