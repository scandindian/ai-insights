import React from "react";
import styled from "styled-components";

const FilterBar = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  margin-bottom: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(60, 64, 67, 0.07);
  padding: 1rem 2rem;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #1976d2;
  font-weight: 500;
`;

const Select = styled.select`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #b3c2d1;
  background: #f5f6fa;
  font-size: 1rem;
  color: #222;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: #1976d2;
  }
`;

const Input = styled.input`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #b3c2d1;
  background: #f5f6fa;
  font-size: 1rem;
  color: #222;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: #1976d2;
  }
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
}) => (
  <FilterBar>
    <Label>
      Department
      <Select
        value={selectedDept}
        onChange={(e) => setSelectedDept(e.target.value)}
      >
        <option value="">All</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </Select>
    </Label>
    <Label>
      Start Date
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
    </Label>
    <Label>
      End Date
      <Input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </Label>
  </FilterBar>
);

export default TrendFilterBar;
