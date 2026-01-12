import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  search: string;
  category: string;
  tag: string;
  sort: string;
  page: number;
}

const initialState: FiltersState = {
  search: '',
  category: 'All',
  tag: 'All',
  sort: 'latest',
  page: 1
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
    },
    setTag(state, action: PayloadAction<string>) {
      state.tag = action.payload;
    },
    setSort(state, action: PayloadAction<string>) {
      state.sort = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    }
  }
});

export const { setSearch, setCategory, setTag, setSort, setPage } = filtersSlice.actions;
export default filtersSlice.reducer;
