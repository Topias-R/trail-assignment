import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CoreState } from '../../store'

type SearchState = {
  search: {
    term: string
    reverse: boolean
    address: {
      name: string
      coords: {
        latitude: number
        longitude: number
      }
    }
  }
}

interface AddressSearchArgs {
  term: string
  coords?: {
    latitude: number
    longitude: number
  }
}

export const addressSearch = createAsyncThunk(
  'search/addressSearch',
  async ({
    term,
    coords
  }: AddressSearchArgs): Promise<SearchState['search']['address']> => {
    const res = await fetch(
      `https://api.digitransit.fi/geocoding/v1/search?text=${term}&size=1${
        coords
          ? `&focus.point.lat=${coords.latitude}&focus.point.lon=${coords.longitude}`
          : ''
      }`
    )
    const json = await res.json()
    return {
      name: json.features[0].properties.label,
      coords: {
        latitude: json.features[0].geometry.coordinates[1],
        longitude: json.features[0].geometry.coordinates[0]
      }
    }
  }
)

const initialState: SearchState = {
  search: {
    term: '',
    reverse: false,
    address: {
      name: '',
      coords: {
        latitude: 0,
        longitude: 0
      }
    }
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
  },
  extraReducers: (builder) => {
    builder.addCase(
      addressSearch.fulfilled,
      (state, action: PayloadAction<SearchState['search']['address']>) => {
        state.search.address = action.payload
      }
    )
  }
})

export const selectSearch = (state: CoreState) => state.search

export const { updateTerm, updateReverse } = searchSlice.actions

export default searchSlice.reducer
