import { createSlice } from "@reduxjs/toolkit";

export const LGASlice = createSlice({
  name: "lgas",
  initialState: {
    LGAsData: null,
  },
  reducers: {
    setLGAsData: (state, action) => {
      state.LGAsData = action.payload;
    },
    removeLGAsData: (state, action) => {
      state.LGAsData = action.payload;
    },
  },
});

export const { setLGAsData, removeLGAsData } = LGASlice.actions;

export default LGASlice.reducer;
