import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInsights } from "../store/insightsSlice";
import type { RootState, AppDispatch } from "../store";
import type { InsightsState } from "../types/insights";
import PerformanceTrendChart from "../components/PerformanceTrendChart";

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

  // Aggregate scores by unique date (e.g., average if multiple sessions per date)
  const dateScores: Record<string, number[]> = {};
  data.sessions.forEach((session) => {
    if (!dateScores[session.date]) dateScores[session.date] = [];
    dateScores[session.date].push(session.overallScore);
  });

  const trendData = Object.entries(dateScores)
    .map(([date, scores]) => ({
      date,
      score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div>
      <h1>Insights</h1>
      <h2>Performance Trend</h2>
      <PerformanceTrendChart data={trendData} />
      <h2>Stats</h2>
      <pre>{JSON.stringify(data.stats, null, 2)}</pre>
    </div>
  );
};

export default Home;
