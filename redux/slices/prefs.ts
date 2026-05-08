import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Mode = 'system' | 'light' | 'dark';

interface PrefsState {
  mode: Mode;
  isHighEnd: boolean;
}

const initialState: PrefsState = {
  mode: 'system',
  isHighEnd: false,
};

export const prefsSlice = createSlice({
  name: 'prefs',
  initialState,
  reducers: {
    setMode(state, action: PayloadAction<Mode>) {
      state.mode = action.payload;
    },
    setHighEnd(state, action: PayloadAction<{ isHighEnd: boolean }>) {
      state.isHighEnd = action.payload.isHighEnd;
    },
  },
});

export const { setMode, setHighEnd } = prefsSlice.actions;
export default prefsSlice.reducer;
