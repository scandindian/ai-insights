import { configureStore } from '@reduxjs/toolkit';
import insightsReducer from './insightsSlice';
import departmentsReducer from './departmentsSlice';
import usersReducer from './usersSlice';

const store = configureStore({
  reducer: {
    insights: insightsReducer,
    departments: departmentsReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;