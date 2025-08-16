import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { departmentColors } from "../utils/colors";

type ChartDataPoint = {
  date: string;
  [department: string]: number | string;
};

type PerformanceTrendChartProps = {
  data: ChartDataPoint[];
  departments: string[];
  height?: number;
};

const ChartBackground = {
  background: "#f5f6fa",
  borderRadius: "12px",
  padding: "1rem",
};

const getDeptColor = (dept: string, deptList: string[]) => {
  return departmentColors[deptList.indexOf(dept) % departmentColors.length];
};

const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({
  data,
  departments,
  height = 300,
}) => (
  <div style={ChartBackground}>
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid stroke="#b3c2d1" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#222" }}
          axisLine={{ stroke: "#b3c2d1" }}
        />
        <YAxis tick={{ fill: "#222" }} axisLine={{ stroke: "#b3c2d1" }} />
        <Tooltip />
        <Legend />
        {departments.map((dept) => (
          <Line
            key={dept}
            type="linear"
            dataKey={dept}
            stroke={getDeptColor(dept, departments)}
            strokeWidth={2}
            dot={false}
            name={dept}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default PerformanceTrendChart;
