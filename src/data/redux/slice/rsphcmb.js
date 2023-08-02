import { createSlice } from "@reduxjs/toolkit";

export const rsphcmbSlice = createSlice({
  name: "rsphcmb",
  initialState: {
    data: null,
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = rsphcmbSlice.actions;

export default rsphcmbSlice.reducer;
