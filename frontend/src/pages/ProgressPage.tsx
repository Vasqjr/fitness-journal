import { useEffect, useState } from 'react';
import { getExercises } from '../api/exerciseApi';
import { getProgress } from '../api/progressApi';
import type { Exercise, ProgressPoint } from '../types';
import ProgressChart from '../components/ProgressChart';
import { useMetricPreference, displayWeight } from '../utils/units';

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
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>Progress</h1>

      <select
        value={selectedId}
        onChange={e => setSelectedId(e.target.value)}
        style={{ marginBottom: 24, padding: 8, borderRadius: 4, border: '1px solid #ccc', width: '100%' }}
      >
        {exercises.map(ex => (
          <option key={ex.id} value={ex.id}>{ex.name}</option>
        ))}
      </select>

      {pr && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{
            padding: 16,
            backgroundColor: '#fff',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
              Personal Record
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}>
              {displayWeight(pr.maxWeightKg, useMetric)}
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              {pr.date}
            </div>
          </div>

          <div style={{
            padding: 16,
            backgroundColor: '#fff',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
              Best Volume Day
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>
              {pr.totalVolume.toLocaleString()}
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              {useMetric ? 'kg total' : 'lbs total'}
            </div>
          </div>

          <div style={{
            padding: 16,
            backgroundColor: '#fff',
            borderRadius: 8,
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
              Sessions Logged
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#f59e0b' }}>
              {data.length}
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
              total sessions
            </div>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', padding: 16 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 14, color: '#555' }}>Max Weight Over Time</h3>
        <ProgressChart data={data} useMetric={useMetric} />
      </div>
    </div>
  );
}