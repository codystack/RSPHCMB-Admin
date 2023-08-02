import { createSlice } from "@reduxjs/toolkit";

export const serviceSlice = createSlice({
  name: "service",
  initialState: {
    serviceData: null,
    newServiceData: null,
    featuredServiceData: null,
  },
  reducers: {
    setFeaturedService: (state, action) => {
      state.featuredServiceData = action.payload;
    },
    setSevicesData: (state, action) => {
      state.serviceData = action.payload;
    },
    setNewSevicesData: (state, action) => {
      state.newServiceData = action.payload;
    },
  },
});

export const { setFeaturedService, setSevicesData, setNewSevicesData } =
  serviceSlice.actions;

export default serviceSlice.reducer;
