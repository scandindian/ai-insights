import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInsights } from "../store/insightsSlice";
import { fetchDepartments } from "../store/departmentsSlice";
import type { RootState, AppDispatch } from "../store";
import PerformanceTrendChart from "../components/PerformanceTrendChart";
import Card from "../components/Card";
import styled from "styled-components";
import { capitalizeWords } from "../utils/textUtils";
import TrendFilterBar from "../components/TrendFilterBar";
import type { Session } from "../types/insights";
import Loader from "../components/Loader";
import NoData from "../components/NoData";

const SummaryGrid = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Tile = styled.div`
  background: #e3f2fd;
  border-radius: 10px;
  width: 180px;
  height: 180px;
  min-width: 180px;
  min-height: 180px;
  aspect-ratio: 1 / 1;
  text-align: center;
  color: #1565c0;
  font-weight: 600;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(60, 64, 67, 0.07);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TrendSection = styled.div`
  margin-bottom: 2.5rem;
`;

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const departments = useSelector((state: RootState) => state.departments.list);
  const { data, loading, error } = useSelector(
    (state: RootState) => state.insights
  );

  // Filter states for chart only
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Load departments once
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Fetch insights when filter changes
  useEffect(() => {
    dispatch(fetchInsights({ department: selectedDept, startDate, endDate }));
  }, [dispatch, selectedDept, startDate, endDate]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  if (error) return <NoData message={`Error: ${error}`} />;
  if (!departments.length || !data?.stats || !data?.sessions) {
    return <NoData />;
  }

  // Filtered sessions for chart
  const filteredSessions: Session[] = data?.sessions;

  // Build a map: { [dept]: { [date]: scores[] } }
  const deptDateScores: Record<string, Record<string, number[]>> = {};
  filteredSessions.forEach((session: Session) => {
    if (!deptDateScores[session.department])
      deptDateScores[session.department] = {};
    if (!deptDateScores[session.department][session.date])
      deptDateScores[session.department][session.date] = [];
    deptDateScores[session.department][session.date].push(session.overallScore);
  });

  // Get all unique dates in filtered sessions
  const allDates: string[] = Array.from(
    new Set(filteredSessions.map((session: Session) => session.date))
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // Build chart data: [{ date, [dept1]: score, [dept2]: score, ... }]
  const chartDepartments: string[] =
    selectedDept && departments.includes(selectedDept)
      ? [selectedDept]
      : departments;

  const trendChartData = allDates.map((date) => {
    const entry: { date: string; [dept: string]: number | string } = { date };
    chartDepartments.forEach((dept) => {
      const scores = deptDateScores[dept]?.[date] || [];
      entry[dept] = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : ""; // Use empty string instead of null
    });
    return entry;
  });

  const topSkills = data?.stats?.topSkills ?? [];

  // If no data for selected filter, show NoData and hide summary grid
  const hasChartData =
    trendChartData.length > 0 &&
    chartDepartments.some(
      dept =>
        trendChartData.some(
          point =>
            point[dept] !== "" &&
            point[dept] !== null &&
            point[dept] !== undefined
        )
    );

  return (
    <div>
      <h1>Insights</h1>
      <TrendSection>
        <TrendFilterBar
          departments={departments}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <h2>Performance Trend</h2>
        {hasChartData ? (
          <>
            <PerformanceTrendChart
              data={trendChartData}
              departments={chartDepartments}
            />
            <SummaryGrid>
              <Tile>
                <div>Total Sessions</div>
                <div style={{ fontSize: "2rem", fontWeight: 700 }}>
                  {data?.stats.totalSessions}
                </div>
              </Tile>
              <Tile>
                <div>Pass Rate</div>
                <div style={{ fontSize: "2rem", fontWeight: 700 }}>
                  {data?.stats.passRate.toFixed(2)}%
                </div>
              </Tile>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ margin: 0, color: "#1565c0" }}>Top Skills</h3>
                {topSkills.map((skill, idx) => (
                  <Card
                    key={skill.skill}
                    rank={idx + 1}
                    title={capitalizeWords(skill.skill)}
                    subtitle={`Avg Score: ${skill.avgScore.toFixed(2)}`}
                  />
                ))}
              </div>
            </SummaryGrid>
          </>
        ) : (
          <NoData message="No data available for the selected filter." />
        )}
      </TrendSection>
    </div>
  );
};

export default Home;
