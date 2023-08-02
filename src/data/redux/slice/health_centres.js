import { createSlice } from "@reduxjs/toolkit";

export const healthcentreSlice = createSlice({
  name: "healthcentre",
  initialState: {
    data: null,
  },
  reducers: {
    setHealthCentre: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setHealthCentre } = healthcentreSlice.actions;

export default healthcentreSlice.reducer;
