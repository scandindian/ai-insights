export interface Session {
  sessionId: string;
  userId: string;
  userName: string;
  department: string;
  date: string;
  overallScore: number;
  skills: Record<string, number>;
  completionTime: number;
  passed: boolean;
}

export type User = {
  userId: string;
  userName: string;
};
export type Department = string;

export interface Stats {
  totalSessions: number;
  passRate: number;
  avgScoresByDept: Record<string, number>;
  topSkills: { skill: string; avgScore: number }[];
  recentSessions: Session[];
}

export interface InsightsResponse {
  message: string;
  stats: Stats;
  sessions: Session[];
}

export interface InsightsState {
  data: InsightsResponse | null;
  loading: boolean;
  error: string | null;
}