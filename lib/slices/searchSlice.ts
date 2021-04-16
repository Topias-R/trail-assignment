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
  term?: string
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
    let res
    if (term && coords) {
      res = fetch(
        `https://api.digitransit.fi/geocoding/v1/search?text=${term}&size=1&focus.point.lat=${coords.latitude}&focus.point.lon=${coords.longitude}`
      )
    } else if (term) {
      res = fetch(
        `https://api.digitransit.fi/geocoding/v1/search?text=${term}&size=1`
      )
    } else if (coords) {
      res = fetch(
        `http://api.digitransit.fi/geocoding/v1/reverse?point.lat=${coords.latitude}&point.lon=${coords.longitude}&size=1`
      )
    } else {
      throw new Error('Nothing to search with')
    }
    const json = await (await res).json()
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
        state.search.term = action.payload.name
      }
    )
  }
})

export const selectSearch = (state: CoreState) => state.search

export const { updateTerm, updateReverse } = searchSlice.actions

export default searchSlice.reducer
