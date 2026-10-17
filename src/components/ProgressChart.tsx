import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ProgressPoint } from '../types';

interface Props {
  data: ProgressPoint[];
  useMetric: boolean;
}

export default function ProgressChart({ data, useMetric }: Props) {
  if (data.length === 0) {
    return (
      <div className="progress-chart-empty">
        No data yet for this exercise. Log some sets to see your progress!
      </div>
    );
  }

  return (
    <div id="progress-chart-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart className="progress-chart" data={data}>
          <CartesianGrid />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            className="line-weight"
            yAxisId="left"
            type="monotone"
            dataKey="maxWeightKg"
            stroke="var(--chart-weight)"
            name={useMetric ? "Max Weight (kg)" : "Max Weight (lbs)"}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            className="line-volume"
            yAxisId="right"
            type="monotone"
            dataKey="totalVolume"
            stroke="var(--chart-volume)"
            name="Total Volume"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}