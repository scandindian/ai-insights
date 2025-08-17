import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { departmentColors } from "../utils/colors";
import { capitalizeWords } from "../utils/textUtils";

type DepartmentSkillsBarChartProps = {
  chartData: { skill: string; [dept: string]: number | string }[];
  selectedDepts: string[];
};

const DepartmentSkillsBarChart: React.FC<DepartmentSkillsBarChartProps> = ({
  chartData,
  selectedDepts,
}) => (
  <div style={{ width: "100%" }}>
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid stroke="#b3c2d1" strokeDasharray="3 3" />
        <XAxis dataKey="skill" tickFormatter={capitalizeWords} />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [value, capitalizeWords(name as string)]}
          labelFormatter={capitalizeWords}
        />
        <Legend formatter={(value) => capitalizeWords(value as string)} />
        {selectedDepts.map((dept, idx) => (
          <Bar
            key={dept}
            dataKey={dept}
            fill={departmentColors[idx % departmentColors.length]}
            name={dept}
            barSize={30}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default DepartmentSkillsBarChart;
