import React from "react";
import styled from "styled-components";

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
`;

type TrendFilterBarProps = {
  departments: string[];
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
};

const TrendFilterBar: React.FC<TrendFilterBarProps> = ({
  departments,
  selectedDept,
  setSelectedDept,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  console.log(departments);

  return (
    <FilterBar>
      <label>
        Department:&nbsp;
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="">All</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </label>
      <label>
        Start Date:&nbsp;
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        End Date:&nbsp;
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
    </FilterBar>
  );
};

export default TrendFilterBar;
