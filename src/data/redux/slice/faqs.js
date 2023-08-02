import { createSlice } from "@reduxjs/toolkit";

export const faqSlice = createSlice({
  name: "faqs",
  initialState: {
    faqData: [],
  },
  reducers: {
    setFAQs: (state, action) => {
      state.faqData = action.payload;
    },
  },
});

export const { setFAQs } = faqSlice.actions;

export default faqSlice.reducer;
