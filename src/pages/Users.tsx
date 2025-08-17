import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInsights } from "../store/insightsSlice";
import type { RootState, AppDispatch } from "../store";
import SortSelect from "../components/SortSelect";
import type { Session } from "../types/insights";
import Card from "../components/Card";
import Loader from "../components/Loader";
import NoData from "../components/NoData";

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.insights
  );
  const [sortBy, setSortBy] = useState<"score" | "name">("score");

  useEffect(() => {
    dispatch(fetchInsights({}));
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <NoData message={`Error: ${error}`} />;
  if (!data) return <NoData message="No user data available." />;

  // Aggregate user scores and sessions for leaderboard
  const userScores: { [name: string]: Session[] } = {};
  data.sessions.forEach((session: Session) => {
    if (!userScores[session.userName]) userScores[session.userName] = [];
    userScores[session.userName].push(session);
  });

  // Calculate leaderboard and sort by score descending
  const leaderboard = Object.entries(userScores).map(([name, sessions]) => ({
    name,
    score: Math.round(
      sessions.reduce((a, b) => a + b.overallScore, 0) / sessions.length
    ),
    rank: 0,
    sessions,
  }));

  leaderboard.sort((a, b) => b.score - a.score);

  // Assign rank based on score order
  leaderboard.forEach((user, idx) => {
    user.rank = idx + 1;
  });

  // Sort by selected option
  if (sortBy === "name") {
    leaderboard.sort((a, b) => a.name.localeCompare(b.name));
  }

  const sortOptions = [
    { value: "score", label: "Score" },
    { value: "name", label: "Name" },
  ];

  return (
    <div>
      <h1>Users</h1>
      <SortSelect
        value={sortBy}
        options={sortOptions}
        onChange={(val) => setSortBy(val as "score" | "name")}
      />
      <div>
        {leaderboard.map((user) => (
          <Card
            key={user.name}
            rank={user.rank}
            title={user.name}
            subtitle={`Avg Score: ${user.score}`}
            details={
              <div>
                <div>Sessions: {user.sessions.length}</div>
                <div>
                  Recent Scores:{" "}
                  {user.sessions
                    .slice(-3)
                    .map((s) => s.overallScore)
                    .join(", ")}
                </div>
                <div>
                  Departments:{" "}
                  {[...new Set(user.sessions.map((s) => s.department))].join(", ")}
                </div>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Users;
