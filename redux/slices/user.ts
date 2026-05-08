import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  email?: string;
  username: string;
  handle: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  verified?: boolean;
}

interface UserState {
  data: UserProfile | null;
  token: string | null;
}

const initialState: UserState = {
  data: null,
  token: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile>) {
      state.data = action.payload;
      state.token = action.payload.id;
    },
    clearUser(state) {
      state.data = null;
      state.token = null;
    },
    updateUser(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
