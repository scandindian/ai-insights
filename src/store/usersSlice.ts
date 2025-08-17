import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { User } from "../types/insights";
import { PROD_BASE_URL, DEV_BASE_URL } from "../utils/constants";

const BASE_URL = import.meta.env.PROD ? PROD_BASE_URL : DEV_BASE_URL;
// Set base URL for axios
axios.defaults.baseURL = BASE_URL;

export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => {
    const res = await axios.get("/api/users");
    return res.data;
  }
);

const initialState = {
  list: [] as User[],
  loading: false,
  error: null as string | null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export default usersSlice.reducer;
