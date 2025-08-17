import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PROD_BASE_URL, DEV_BASE_URL } from "../utils/constants";

const BASE_URL = import.meta.env.PROD ? PROD_BASE_URL : DEV_BASE_URL;

// Set base URL for axios
axios.defaults.baseURL = BASE_URL;

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
