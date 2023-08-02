import { createSlice } from "@reduxjs/toolkit";

export const homepageSlice = createSlice({
  name: "homepage",
  initialState: {
    healthAccess: null,
    buildingCulture: null,
  },
  reducers: {
    setHealthAccessData: (state, action) => {
      state.healthAccess = action.payload;
    },
    setBuildingCultureData: (state, action) => {
      state.buildingCulture = action.payload;
    },
  },
});

export const { setHealthAccessData, setBuildingCultureData } =
  homepageSlice.actions;

export default homepageSlice.reducer;
