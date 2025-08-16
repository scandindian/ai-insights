import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Set base URL for axios
axios.defaults.baseURL = "http://localhost:3001";

export const fetchDepartments = createAsyncThunk<string[]>(
  "departments/fetchDepartments",
  async () => {
    const res = await axios.get("/api/departments");
    return res.data;
  }
);

const initialState = {
  list: [] as string[],
  loading: false,
  error: null as string | null,
};

const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch departments";
      });
  },
});

export default departmentsSlice.reducer;