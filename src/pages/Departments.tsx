import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDepartments } from "../store/departmentsSlice";
import { fetchInsights } from "../store/insightsSlice";
import type { RootState, AppDispatch } from "../store";
import styled from "styled-components";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import type { Session } from "../types/insights";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const DepartmentsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const DeptButton = styled.button<{ selected?: boolean }>`
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: 1px solid #b3c2d1;
  background: ${({ selected }) => (selected ? "#1976d2" : "#e3f2fd")};
  color: ${({ selected }) => (selected ? "#fff" : "#1976d2")};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #1976d2;
    color: #fff;
  }
`;

const Departments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const departments = useSelector((state: RootState) => state.departments.list);
  const { data, loading, error } = useSelector((state: RootState) => state.insights);

  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDepts.length > 0) {
      dispatch(fetchInsights({ department: undefined })); // fetch all, filter client-side
    }
  }, [dispatch, selectedDepts]);

  if (loading) return <Loader />;
  if (error) return <NoData message={`Error: ${error}`} />;
  if (!departments.length) return <NoData message="No departments found." />;

  // Aggregate skills for selected departments
  const sessions = data?.sessions ?? [];
  const skillsSet = new Set<string>();
  sessions.forEach((session: Session) => {
    Object.keys(session.skills).forEach((skill) => skillsSet.add(skill));
  });
  const allSkills = Array.from(skillsSet);

  // Build chart data: [{ skill, [dept1]: avgScore, [dept2]: avgScore, ... }]
  const chartData = allSkills.map((skill) => {
    const entry: { skill: string; [dept: string]: number | string } = { skill };
    selectedDepts.forEach((dept) => {
      const deptSessions = sessions.filter((s: Session) => s.department === dept);
      const scores = deptSessions.map((s: Session) => s.skills[skill]).filter((v) => typeof v === "number");
      entry[dept] = scores.length
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : "";
    });
    return entry;
  });

  return (
    <Container>
      <h1>Departments</h1>
      <DepartmentsList>
        {departments.map((dept) => (
          <DeptButton
            key={dept}
            selected={selectedDepts.includes(dept)}
            onClick={() =>
              setSelectedDepts((prev) =>
                prev.includes(dept)
                  ? prev.filter((d) => d !== dept)
                  : [...prev, dept]
              )
            }
          >
            {dept}
          </DeptButton>
        ))}
      </DepartmentsList>
      {selectedDepts.length === 0 ? (
        <NoData message="Select one or more departments to view skills comparison." />
      ) : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis dataKey="skill" />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedDepts.map((dept, idx) => (
              <Bar
                key={dept}
                dataKey={dept}
                fill={`hsl(${(idx * 60) % 360}, 70%, 80%)`}
                name={dept}
                barSize={30}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </Container>
  );
};

export default Departments;