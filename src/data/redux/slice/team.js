import { createSlice } from "@reduxjs/toolkit";

export const teamSlice = createSlice({
  name: "teams",
  initialState: {
    teamMembersData: null,
  },
  reducers: {
    setTeamData: (state, action) => {
      state.teamMembersData = action.payload;
    },
    removeTeamData: (state, action) => {
      state.teamMembersData = action.payload;
    },
  },
});

export const { setTeamData, removeTeamData } = teamSlice.actions;

export default teamSlice.reducer;
