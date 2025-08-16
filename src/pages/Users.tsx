import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInsights } from "../store/insightsSlice";
import type { RootState, AppDispatch } from "../store";
import CardList from "../components/CardList";
import type { Session } from "../types/insights";

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.insights);
  const [sortBy, setSortBy] = useState<"score" | "name">("score");

  useEffect(() => {
    dispatch(fetchInsights({}));
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  // Aggregate user scores and sessions for leaderboard
  const userScores: { [name: string]: Session[] } = {};
  data.sessions.forEach((session: Session) => {
    if (!userScores[session.userName]) userScores[session.userName] = [];
    userScores[session.userName].push(session);
  });

  const leaderboard = Object.entries(userScores).map(([name, sessions]) => ({
    name,
    score: Math.round(sessions.reduce((a, b) => a + b.overallScore, 0) / sessions.length),
    sessions,
  }));

  leaderboard.sort((a, b) =>
    sortBy === "score"
      ? b.score - a.score
      : a.name.localeCompare(b.name)
  );

  return (
    <div>
      <h1>Users Leaderboard</h1>
      <div>
        <label>Sort by: </label>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as "score" | "name")}>
          <option value="score">Score</option>
          <option value="name">Name</option>
        </select>
      </div>
      <CardList users={leaderboard} />
    </div>
  );
};

export default Users;
