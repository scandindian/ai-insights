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

type TrendDataPoint = {
  date: string;
  score: number;
};

type PerformanceTrendChartProps = {
  data: TrendDataPoint[];
};

const ChartBackground = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "1rem",
};

const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ data }) => (
  <div style={ChartBackground}>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#b3c2d1" strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fill: "#222" }} axisLine={{ stroke: "#b3c2d1" }} />
        <YAxis tick={{ fill: "#222" }} axisLine={{ stroke: "#b3c2d1" }} />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#1976d2" strokeWidth={2} dot />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default PerformanceTrendChart;