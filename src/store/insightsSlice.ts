import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { InsightsResponse, InsightsState } from "../types/insights";

// Set base URL for axios
axios.defaults.baseURL = "http://localhost:3001";

export const fetchInsights = createAsyncThunk<
  InsightsResponse,
  { department?: string; startDate?: string; endDate?: string }
>("insights/fetchInsights", async (params) => {
  const res = await axios.get("/api/insights", { params });
  return res.data;
});

const initialState: InsightsState = {
  data: null,
  loading: false,
  error: null,
};

const insightsSlice = createSlice({
  name: "insights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch insights";
      });
  },
});

export default insightsSlice.reducer;
