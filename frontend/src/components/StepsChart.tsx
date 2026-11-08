import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import './StepsChart.css';

export interface StepsChartPoint {
  date: string;
  label: string;
  steps: number | null;
}

interface Props {
  data: StepsChartPoint[];
  goal: number;
}

export default function StepsChart({ data, goal }: Props) {
  if (data.every(point => point.steps === null)) {
    return (
      <div className="steps-chart-empty">
        No steps logged in this range yet. Add a day above to get started!
      </div>
    );
  }

  return (
    <div id="steps-chart-wrap">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart className="steps-chart" data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" minTickGap={12} />
          <YAxis width={52} tickFormatter={(value: number) => value.toLocaleString()} />
          <Tooltip formatter={(value) => [Number(value ?? 0).toLocaleString(), 'Steps']} />
          <ReferenceLine y={goal} stroke="#f59e0b" label={{ value: 'Goal', position: 'insideTopRight' }} />
          <Bar dataKey="steps" name="Steps" radius={[4, 4, 0, 0]}>
            {data.map(point => (
              <Cell
                key={point.date}
                fill={point.steps !== null && point.steps >= goal ? '#10b981' : '#ab5cff'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}