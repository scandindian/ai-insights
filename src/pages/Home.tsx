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
import { getLLMInsights } from "../utils/llmInsights";

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 2.5fr 4fr;
  gap: 2rem;
  margin-top: 2rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const TilesColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const TopSkillsColumn = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
  }
`;

const SummaryTile = styled.div`
  background: #e3f2fd;
  border-radius: 4px;
  min-height: 200px;
  text-align: left;
  color: #1565c0;
  font-weight: 600;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(60, 64, 67, 0.07);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 2rem;

  @media (max-width: 768px) {
    min-height: 150px;
    font-size: 1.1rem;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 1rem;
    min-height: 120px;
  }
`;

const SquareTile = styled.div`
  background: #e3f2fd;
  border-radius: 4px;
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

  @media (max-width: 768px) {
    width: 140px;
    height: 140px;
    min-width: 140px;
    min-height: 140px;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
    min-width: 120px;
    min-height: 120px;
    font-size: 1rem;
  }
`;

const TrendSection = styled.div`
  margin-bottom: 2.5rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
    padding: 0 0.5rem;
  }
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

  // State for LLM summary
  const [llmSummary, setLlmSummary] = useState<string>("");
  const [llmLoading, setLlmLoading] = useState(false);

  // Debounce timer ref
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  // Load departments once
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  // Get all unique dates in filtered sessions
  const filteredSessions: Session[] = React.useMemo(
    () => data?.sessions ?? [],
    [data?.sessions]
  );
  const allDates: string[] = Array.from(
    new Set(filteredSessions.map((session: Session) => session.date))
  ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // Set default to 1 week from latest date
  useEffect(() => {
    if (allDates.length > 0 && (!startDate || !endDate)) {
      const latestDate = allDates[allDates.length - 1];
      const weekAgo = new Date(latestDate);
      weekAgo.setDate(weekAgo.getDate() - 6);
      setStartDate(weekAgo.toISOString().slice(0, 10));
      setEndDate(latestDate);
    }
    // eslint-disable-next-line
  }, [allDates]);

  // Fetch insights when filter changes
  useEffect(() => {
    // Only fetch if departments are loaded and not loading
    if (departments.length > 0 && startDate && endDate) {
      dispatch(fetchInsights({ department: selectedDept, startDate, endDate }));
    } else if (departments.length > 0 && (!startDate || !endDate)) {
      // If no date filter, fetch all data
      dispatch(fetchInsights({ department: selectedDept }));
    }
  }, [dispatch, departments, selectedDept, startDate, endDate]);

  useEffect(() => {
    // Only run if not loading and there are sessions
    if (!loading && filteredSessions.length > 0) {
      // Clear previous debounce
      if (debounceRef.current) clearTimeout(debounceRef.current);

      setLlmLoading(true);
      debounceRef.current = setTimeout(async () => {
        try {
          const insights = await getLLMInsights(filteredSessions);
          setLlmSummary(insights[0]);
        } catch {
          setLlmSummary("LLM summarization failed.");
        } finally {
          setLlmLoading(false);
        }
      }, 1500); // 1.5 seconds debounce
    } else {
      setLlmSummary("");
      setLlmLoading(false);
    }
    // Cleanup on unmount
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filteredSessions, loading]);

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
  // const filteredSessions: Session[] = data?.sessions;

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
  // (already declared above)

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
    chartDepartments.some((dept) =>
      trendChartData.some(
        (point) =>
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
          allDates={allDates}
        />
        <h2>Performance Trend</h2>
        {hasChartData ? (
          <>
            <PerformanceTrendChart
              data={trendChartData}
              departments={chartDepartments}
            />
            <SummaryGrid>
              <TilesColumn>
                <SquareTile>
                  <div>Total Sessions</div>
                  <div style={{ fontSize: "2rem", fontWeight: 700 }}>
                    {data?.stats.totalSessions}
                  </div>
                </SquareTile>
                <SquareTile>
                  <div>Pass Rate</div>
                  <div style={{ fontSize: "2rem", fontWeight: 700 }}>
                    {data?.stats.passRate.toFixed(2)}%
                  </div>
                </SquareTile>
              </TilesColumn>
              <TopSkillsColumn>
                <h3 style={{ margin: 0, color: "#1565c0" }}>Top Skills</h3>
                {topSkills.map((skill, idx) => (
                  <Card
                    key={skill.skill}
                    rank={idx + 1}
                    title={capitalizeWords(skill.skill)}
                    subtitle={`Avg Score: ${skill.avgScore.toFixed(2)}`}
                  />
                ))}
              </TopSkillsColumn>
              <SummaryTile>
                <div style={{ marginBottom: "0.5rem" }}>Summary</div>
                <div style={{ fontSize: "1rem", color: "#222" }}>
                  {llmLoading
                    ? "Generating summary..."
                    : llmSummary || "No summary available."}
                </div>
              </SummaryTile>
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
