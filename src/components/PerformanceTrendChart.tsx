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

const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="score" stroke="#1976d2" strokeWidth={2} dot />
    </LineChart>
  </ResponsiveContainer>
);

export default PerformanceTrendChart;