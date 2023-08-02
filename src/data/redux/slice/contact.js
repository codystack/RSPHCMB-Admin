import { createSlice } from "@reduxjs/toolkit";

export const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contactData: null,
  },
  reducers: {
    setContact: (state, action) => {
      state.contactData = action.payload;
    },
  },
});

export const { setContact } = contactSlice.actions;

export default contactSlice.reducer;
