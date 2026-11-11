import { useEffect, useState } from 'react';
import { getExercises } from '../api/exerciseApi';
import { getProgress } from '../api/progressApi';
import type { Exercise, ProgressPoint } from '../types';
import ProgressChart from '../components/ProgressChart';
import { useMetricPreference, displayWeight, convertKgForDisplay } from '../utils/units';
import './ProgressPage.css';

interface PersonalRecord {
  maxWeightKg: number;
  date: string;
  totalVolume: number;
}

function calculatePR(data: ProgressPoint[]): PersonalRecord | null {
  if (data.length === 0) return null;
  const best = data.reduce((prev, curr) =>
    curr.maxWeightKg > prev.maxWeightKg ? curr : prev
  );
  return {
    maxWeightKg: best.maxWeightKg,
    date: best.date,
    totalVolume: best.totalVolume
  };
}

export default function ProgressPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [data, setData] = useState<ProgressPoint[]>([]);
  const [pr, setPr] = useState<PersonalRecord | null>(null);
  const useMetric = useMetricPreference();

  useEffect(() => {
    getExercises().then(res => {
      setExercises(res.data);
      if (res.data.length > 0) setSelectedId(res.data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedId) {
      getProgress(selectedId).then(res => {
        setData(res.data);
        setPr(calculatePR(res.data));
      });
    }
  }, [selectedId]);

  return (
    <div id="progress-page-wrap">
      <h1 className="progress-page-header">Progress</h1>

      <select
        value={selectedId}
        onChange={e => setSelectedId(e.target.value)}
        className="progress-page-exercise-select"
      >
        {exercises.map(ex => (
          <option className="progress-page-exercise-option" key={ex.id} value={ex.id}>{ex.name}</option>
        ))}
      </select>

      {pr && (
        <div className="progress-page-stats-wrap">
          <div className="progress-page-statistic">
            <div className="progress-stat-title">
              Personal Record
            </div>
            <div className="personal-record-info max-weight">
              {displayWeight(pr.maxWeightKg, useMetric)}
            </div>
            <div className="progress-date">
              {pr.date}
            </div>
          </div>

          <div className="progress-page-statistic">
            <div className="progress-stat-title">
              Best Volume Day
            </div>
            <div className="personal-record-info total-volume" style={{ fontSize: 24, fontWeight: 700, color: '' }}>
              {convertKgForDisplay(pr.totalVolume, useMetric).toLocaleString()}
            </div>
            <div className="progress-date">
              {useMetric ? 'kg total' : 'lbs total'}
            </div>
          </div>

          <div className="progress-page-statistic">
            <div className="progress-stat-title">
              Sessions Logged
            </div>
            <div className="personal-record-info sessions-logged">
              {data.length}
            </div>
            <div className="progress-date">
              total sessions
            </div>
          </div>
        </div>
      )}

      <div className="progress-chart-display-wrap">
        <h3 className="progress-chart-display-header">Max Weight Over Time</h3>
        <ProgressChart data={data} useMetric={useMetric} />
      </div>
    </div>
  );
}