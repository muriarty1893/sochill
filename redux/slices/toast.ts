import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ToastType = 'Success' | 'Failed' | 'Info' | 'Message';

interface ToastState {
  open: boolean;
  text: string;
  type: ToastType;
  imageUri?: string;
}

const initialState: ToastState = {
  open: false,
  text: '',
  type: 'Info',
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    openToast(state, action: PayloadAction<{ text: string; type: ToastType; imageUri?: string }>) {
      state.open = true;
      state.text = action.payload.text;
      state.type = action.payload.type;
      state.imageUri = action.payload.imageUri;
    },
    closeToast(state) {
      state.open = false;
    },
  },
});

export const { openToast, closeToast } = toastSlice.actions;
export default toastSlice.reducer;
