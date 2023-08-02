import { createSlice } from "@reduxjs/toolkit";

export const enquirySlice = createSlice({
  name: "enquiries",
  initialState: {
    enquiriesData: null,
  },
  reducers: {
    setEnquiriesData: (state, action) => {
      state.enquiriesData = action.payload;
    },
  },
});

export const { setEnquiriesData } = enquirySlice.actions;

export default enquirySlice.reducer;
