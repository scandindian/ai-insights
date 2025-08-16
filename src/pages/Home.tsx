import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchInsights } from '../store/insightsSlice';
import type { RootState, AppDispatch } from '../store';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  type Stats = {
    // Define the actual properties of stats here, for example:
    // count: number;
    // users: string[];
    // For now, use Record<string, unknown> as a safe placeholder
    [key: string]: unknown;
  };

  const { data, loading, error } = useSelector((state: RootState) => state.insights as {
    data: { stats: Stats } | null;
    loading: boolean;
    error: string | null;
  });

  useEffect(() => {
    dispatch(fetchInsights({}));
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  return (
    <div>
      <h1>Insights</h1>
      <pre>{JSON.stringify(data.stats, null, 2)}</pre>
    </div>
  );
};

export default Home;
