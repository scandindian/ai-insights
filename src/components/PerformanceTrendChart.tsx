import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type PerformanceTrendChartProps = {
  data: { date: string; [department: string]: number | string }[];
  departments: string[];
  colors?: string[];
  height?: number;
};

const ChartBackground = {
  background: "#f5f6fa",
  borderRadius: "12px",
  padding: "1rem",
};

const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({
  data,
  departments,
  colors = [
    "#1976d2", "#388e3c", "#fbc02d", "#d32f2f", "#7b1fa2", "#0288d1", "#c2185b"
  ],
  height = 300,
}) => (
  <div style={ChartBackground}>
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid stroke="#b3c2d1" strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fill: "#222" }} axisLine={{ stroke: "#b3c2d1" }} />
        <YAxis tick={{ fill: "#222" }} axisLine={{ stroke: "#b3c2d1" }} />
        <Tooltip />
        {departments.map((dept, idx) => (
          <Line
            key={dept}
            type="monotone"
            dataKey={dept}
            stroke={colors[idx % colors.length]}
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