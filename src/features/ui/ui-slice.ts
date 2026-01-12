import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  mobileMenuOpen: boolean;
  theme: 'light' | 'dark';
}

const initialState: UiState = {
  mobileMenuOpen: false,
  theme: 'light'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    }
  }
});

export const { toggleMobileMenu, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
