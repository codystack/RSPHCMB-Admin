import { createSlice } from "@reduxjs/toolkit";

export const resourcesSlice = createSlice({
  name: "resources",
  initialState: {
    researchData: null,
    reportsData: [],
    downloadsData: [],
    galleryData: [],
  },
  reducers: {
    setResearchData: (state, action) => {
      state.researchData = action.payload;
    },
    removeResearchData: (state, action) => {
      state.researchData = action.payload;
    },
    setReportsData: (state, action) => {
      state.reportsData = action.payload;
    },
    removeReportsData: (state, action) => {
      state.reportsData = action.payload;
    },
    setDownloadsData: (state, action) => {
      state.downloadsData = action.payload;
    },
    setGalleryData: (state, action) => {
      state.galleryData = action.payload;
    },
  },
});

export const {
  setResearchData,
  removeResearchData,
  setReportsData,
  removeReportsData,
  setDownloadsData,
  setGalleryData,
} = resourcesSlice.actions;

export default resourcesSlice.reducer;
