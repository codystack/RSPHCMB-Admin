import { createSlice } from "@reduxjs/toolkit";

export const partnersSlice = createSlice({
  name: "partners",
  initialState: {
    partnersData: null,
  },
  reducers: {
    setPartnersData: (state, action) => {
      state.partnersData = action.payload;
    },
    removePartnersData: (state, action) => {
      state.partnersData = action.payload;
    },
  },
});

export const { setPartnersData, removePartnersData } = partnersSlice.actions;

export default partnersSlice.reducer;
