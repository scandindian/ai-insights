import React from "react";
import styled from "styled-components";
import { MdSort } from "react-icons/md";

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 500;
  margin-right: 0.5rem;
  color: #1976d2;
  display: flex;
  align-items: center;
`;

const Select = styled.select`
  padding: 0.4rem 1.2rem 0.4rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #1976d2;
  background: #e3f2fd;
  color: #1565c0;
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border: 2px solid #1565c0;
  }
`;

type SortSelectProps = {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

const SortSelect: React.FC<SortSelectProps> = ({ value, options, onChange }) => (
  <SelectWrapper>
    <Label>
      <MdSort style={{ marginRight: 4 }} />
      Sort by:
    </Label>
    <Select value={value} onChange={e => onChange(e.target.value)}>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </Select>
  </SelectWrapper>
);

export default SortSelect;