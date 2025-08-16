import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInsights } from "../store/insightsSlice";
import type { RootState, AppDispatch } from "../store";
import type { InsightsState } from "../types/insights";

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.insights as InsightsState
  );

  useEffect(() => {
    dispatch(fetchInsights({}));
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  return (
    <div>
      <h1>Insights</h1>
      <h2>Users</h2>
      <ul>
        {data.users.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>
      <h2>Departments</h2>
      <ul>
        {data.departments.map((dept) => (
          <li key={dept}>{dept}</li>
        ))}
      </ul>
      <h2>Stats</h2>
      <pre>{JSON.stringify(data.stats, null, 2)}</pre>
    </div>
  );
};

export default Home;
