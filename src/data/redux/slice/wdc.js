import { createSlice } from "@reduxjs/toolkit";

export const wdcSlice = createSlice({
  name: "wdc",
  initialState: {
    wdcData: null,
  },
  reducers: {
    setWDCData: (state, action) => {
      state.wdcData = action.payload;
    },
    removeWDCData: (state, action) => {
      state.wdcData = action.payload;
    },
  },
});

export const { setWDCData, removeWDCData } = wdcSlice.actions;

export default wdcSlice.reducer;
