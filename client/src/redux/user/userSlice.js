import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  currentUser: null,
  errorMessage: null,
  loading: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.errorMessage = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.errorMessage = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    updateStart: (state) => {
      state.loading = true;
      state.errorMessage = null;
    },
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.errorMessage = null;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
    },
    deleteStart: (state) => {
      state.loading = true;
      state.errorMessage = null;
    },
    deleteSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.errorMessage = null;
    },
    deleteFailure: (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload;
    }
  }
});

export const {
  signInStart, signInSuccess, signInFailure, 
  updateStart, updateSuccess, updateFailure,
  deleteStart, deleteSuccess, deleteFailure
} = userSlice.actions;

export default userSlice.reducer;