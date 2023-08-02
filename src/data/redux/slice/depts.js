import { createSlice } from "@reduxjs/toolkit";

export const departmentSlice = createSlice({
  name: "departments",
  initialState: {
    departmentsData: null,
    deptFunctions: null,
  },
  reducers: {
    setDepartmentsData: (state, action) => {
      state.departmentsData = action.payload;
    },
    setDeptFunctions: (state, action) => {
      state.deptFunctions = action.payload;
    },
  },
});

export const { setDepartmentsData, setDeptFunctions } = departmentSlice.actions;

export default departmentSlice.reducer;
