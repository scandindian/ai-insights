import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInsights } from "../store/insightsSlice";
import type { RootState, AppDispatch } from "../store";
import CardList from "../components/CardList";
import SortSelect from "../components/SortSelect";
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

  const sortOptions = [
    { value: "score", label: "Score" },
    { value: "name", label: "Name" },
  ];

  return (
    <div>
      <h1>Users Leaderboard</h1>
      <SortSelect value={sortBy} options={sortOptions} onChange={val => setSortBy(val as "score" | "name")} />
      <CardList users={leaderboard} />
    </div>
  );
};

export default Users;
