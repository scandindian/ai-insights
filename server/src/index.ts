import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

type Skills = Record<string, number>;

type Session = {
  sessionId: string;
  userId: string;
  userName: string;
  department: string;
  date: string;
  overallScore: number;
  skills: Skills;
  completionTime: number;
  passed: boolean;
};

type InsightsData = {
  metadata: { generatedAt: string; version: string };
  sessions: Session[];
};

app.get("/api/insights", (req: Request, res: Response) => {
  const insightsPath = path.join(__dirname, "data", "insights.json");

  fs.readFile(insightsPath, "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading insights data." });
    }

    const parsedData: InsightsData = JSON.parse(data);
    let sessions = parsedData.sessions;

    // Filtering
    const { department, startDate, endDate } = req.query;
    if (department) {
      sessions = sessions.filter((s) => s.department === department);
    }
    if (startDate) {
      sessions = sessions.filter((s) => new Date(s.date) >= new Date(startDate as string));
    }
    if (endDate) {
      sessions = sessions.filter((s) => new Date(s.date) <= new Date(endDate as string));
    }

    // Statistics
    const totalSessions = sessions.length;
    const passCount = sessions.filter((s) => s.passed).length;
    const passRate = totalSessions ? (passCount / totalSessions) * 100 : 0;

    // Average scores by department
    const deptScores: Record<string, number[]> = {};
    sessions.forEach((s) => {
      const dept = s.department;
      if (!deptScores[dept]) deptScores[dept] = [];
      deptScores[dept].push(s.overallScore);
    });
    const avgScoresByDept = Object.fromEntries(
      Object.entries(deptScores).map(([dept, scores]) => [
        dept,
        scores.reduce((a, b) => a + b, 0) / scores.length,
      ])
    );

    // Top performing skills
    const skillScores: Record<string, number[]> = {};
    sessions.forEach((s) => {
      if (s.skills) {
        Object.entries(s.skills).forEach(([skill, score]) => {
          if (!skillScores[skill]) skillScores[skill] = [];
          skillScores[skill].push(score);
        });
      }
    });
    const topSkills = Object.entries(skillScores)
      .map(([skill, scores]) => ({
        skill,
        avgScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);

    // Recent performance trends (last 5 sessions)
    const recentSessions = sessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // List of unique users with userId and userName
    const users = Array.from(
      new Map(sessions.map((s) => [s.userId, { userId: s.userId, userName: s.userName }])).values()
    );

    // List of unique departments
    const departments = Array.from(new Set(sessions.map((s) => s.department)));

    res.json({
      message: "AI Insights API",
      stats: {
        totalSessions,
        passRate,
        avgScoresByDept,
        topSkills,
        recentSessions,
      },
      users,
      departments,
      sessions,
    });
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
