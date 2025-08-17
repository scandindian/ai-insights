import React from "react";
import styled from "styled-components";

const FilterBar = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-end;
  margin-bottom: 1.5rem;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(60, 64, 67, 0.07);
  padding: 1rem 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
    padding: 1rem;
  }
`;

const Input = styled.input`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #b3c2d1;
  background: #f5f6fa;
  font-size: 1rem;
  color: #222;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  min-width: 0;
  &:focus {
    border-color: #1976d2;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1.1rem;
    max-width: 100%;
  }
`;

const Select = styled.select`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #b3c2d1;
  background: #f5f6fa;
  font-size: 1rem;
  color: #222;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: #1976d2;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1.1rem;
  }
`;

const Label = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #1976d2;
  font-weight: 500;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RangeButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 0.5rem;
    width: 100%;
    justify-content: space-between;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const RangeButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>`
  padding: 0.4rem 1rem;
  border-radius: 2px;
  border: 1px solid #b3c2d1;
  background: ${({ active }) => (active ? "#1976d2" : "#f5f6fa")};
  color: ${({ active }) => (active ? "#fff" : "#222")};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #1976d2;
    color: #fff;
  }

  @media (max-width: 768px) {
    flex: 1;
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const DateInputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const DateRangeContainer = styled.div`
  display: flex;
  gap: 1rem;
  min-width: 0;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
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
  allDates?: string[];
};

function getLatestDate(dates: string[]): string | null {
  if (!dates || dates.length === 0) return null;
  return dates.reduce((a, b) => (new Date(a) > new Date(b) ? a : b));
}

function getDateNDaysBefore(dateStr: string, n: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - n);
  return date.toISOString().slice(0, 10);
}

const TrendFilterBar: React.FC<TrendFilterBarProps> = ({
  departments,
  selectedDept,
  setSelectedDept,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  allDates = [],
}) => {
  const latestDate = getLatestDate(allDates);

  const isWeek =
    latestDate &&
    startDate === getDateNDaysBefore(latestDate, 6) &&
    endDate === latestDate;
  const isMonth =
    latestDate &&
    startDate === getDateNDaysBefore(latestDate, 29) &&
    endDate === latestDate;

  const handleSetWeek = () => {
    if (latestDate) {
      setStartDate(getDateNDaysBefore(latestDate, 6));
      setEndDate(latestDate);
    }
  };

  const handleSetMonth = () => {
    if (latestDate) {
      setStartDate(getDateNDaysBefore(latestDate, 29));
      setEndDate(latestDate);
    }
  };

  React.useEffect(() => {
    if (latestDate && (!startDate || !endDate)) {
      setStartDate(getDateNDaysBefore(latestDate, 6));
      setEndDate(latestDate);
    }
    // eslint-disable-next-line
  }, [latestDate]);

  return (
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
      <DateRangeContainer>
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
          <DateInputContainer>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <RangeButtonGroup>
              <RangeButton active={!!isWeek} type="button" onClick={handleSetWeek}>
                1 Week
              </RangeButton>
              <RangeButton
                active={!!isMonth}
                type="button"
                onClick={handleSetMonth}
              >
                1 Month
              </RangeButton>
            </RangeButtonGroup>
          </DateInputContainer>
        </Label>
      </DateRangeContainer>
    </FilterBar>
  );
};

export default TrendFilterBar;
