import React from "react";
import Card from "./Card";
import type { Session } from "../types/insights";

type UserLeaderboard = {
  name: string;
  score: number;
  sessions: Session[];
};

type CardListProps = {
  users: UserLeaderboard[];
};

const CardList: React.FC<CardListProps> = ({ users }) => (
  <div>
    {users.map((user, idx) => (
      <Card
        key={user.name}
        name={user.name}
        score={user.score}
        rank={idx + 1}
        details={
          <div>
            <div><strong>Sessions:</strong> {user.sessions.length}</div>
            <div>
              <strong>Recent Scores:</strong>{" "}
              {user.sessions.slice(-3).map(s => s.overallScore).join(", ")}
            </div>
            <div>
              <strong>Departments:</strong>{" "}
              {[...new Set(user.sessions.map(s => s.department))].join(", ")}
            </div>
          </div>
        }
      />
    ))}
  </div>
);

export default CardList;