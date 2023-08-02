import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    myData: null,
    userId: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setMyData: (state, action) => {
      state.myData = action.payload;
    },
    setUserID: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { setUserData, setUserID, setMyData } = userSlice.actions;

export default userSlice.reducer;
