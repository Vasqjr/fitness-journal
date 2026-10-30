import { useEffect, useState } from 'react';
import { getExercises } from '../api/exerciseApi';
import type { Exercise } from '../types';
import './ExerciseSelector.css';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export default function ExerciseSelector({ value, onChange }: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getExercises().then(res => {
      setExercises(res.data);
      if (res.data.length > 0 && !value) {
        onChange(res.data[0].id);
      }
    });
  }, []);

  const filtered = exercises.filter(ex =>
    ex.name.toLowerCase().includes(filter.toLowerCase())
  );

  const grouped = filtered.reduce((acc, ex) => {
    const group = ex.muscleGroup;
    if (!acc[group]) acc[group] = [];
    acc[group].push(ex);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return (
    <div id="exercise-selector-wrap">
      <input
        placeholder="Search exercises..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        className="exercise-search-input"
      />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="search-exercises-list"
        size={5}
      >
        {Object.entries(grouped).map(([group, exs]) => (
          <optgroup key={group} label={group}>
            {exs.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.name}{ex.isCustom ? ' (custom)' : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}