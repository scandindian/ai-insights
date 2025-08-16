import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInsights } from "../store/insightsSlice";
import type { RootState, AppDispatch } from "../store";
import type { InsightsState } from "../types/insights";
import PerformanceTrendChart from "../components/PerformanceTrendChart";
import Card from "../components/Card";
import styled from "styled-components";

const SummaryGrid = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Tile = styled.div`
  background: #e3f2fd;
  border-radius: 10px;
  padding: 1.5rem 2rem;
  min-width: 180px;
  text-align: center;
  color: #1565c0;
  font-weight: 600;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(60, 64, 67, 0.07);
`;

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

  // Aggregate scores by unique date
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

  // Prepare top skills for Card display
  const topSkills = data.stats.topSkills;

  return (
    <div>
      <h1>Insights</h1>
      <h2>Performance Trend</h2>
      <PerformanceTrendChart data={trendData} />

      <SummaryGrid>
        <Tile>
          <div>Total Sessions</div>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>
            {data.stats.totalSessions}
          </div>
        </Tile>
        <Tile>
          <div>Pass Rate</div>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>
            {data.stats.passRate.toFixed(2)}%
          </div>
        </Tile>
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: "1rem", color: "#1565c0" }}>Top Skills</h3>
          {topSkills.map((skill, idx) => (
            <Card
              key={skill.skill}
              rank={idx + 1}
              title={skill.skill}
              subtitle={`Avg Score: ${skill.avgScore.toFixed(2)}`}
            />
          ))}
        </div>
      </SummaryGrid>
    </div>
  );
};

export default Home;