import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : '';

export const fetchInsights = createAsyncThunk(
  'insights/fetchInsights',
  async (params: { department?: string; startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await axios.get(
      `${API_BASE_URL}/api/insights${query ? `?${query}` : ''}`,
      { headers: { 'Cache-Control': 'no-cache' } }
    );
    return res.data;
  }
);

const insightsSlice = createSlice({
  name: 'insights',
  initialState: {
    data: null,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchInsights.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch insights';
      });
  },
});

export default insightsSlice.reducer;