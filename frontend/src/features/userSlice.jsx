import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userType: localStorage.getItem('userType') || null, 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.userType = action.payload.userType;
      state.token = action.payload.token;
      localStorage.setItem('userType', action.payload.userType); // Store userType in localStorage
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.userType = null;
      state.token = null;
      localStorage.removeItem('userType'); // Clear userType
      localStorage.removeItem('token'); // Clear token
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
