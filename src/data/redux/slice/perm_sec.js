import { createSlice } from "@reduxjs/toolkit";

export const permSecSlice = createSlice({
  name: "permSec",
  initialState: {
    permSecData: null,
  },
  reducers: {
    setPermSecData: (state, action) => {
      state.permSecData = action.payload;
    },
    removePermSecData: (state, action) => {
      state.permSecData = action.payload;
    },
  },
});

export const { setPermSecData, removePermSecData } = permSecSlice.actions;

export default permSecSlice.reducer;
