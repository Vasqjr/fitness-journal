import { useEffect, useState } from 'react';
import { getExercises, createExercise, deleteExercise } from '../api/exerciseApi';
import type { Exercise } from '../types';

const MUSCLE_GROUPS = [
  'CHEST', 'BACK', 'SHOULDERS', 'BICEPS',
  'TRICEPS', 'LEGS', 'CORE', 'FULL_BODY'
];

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('CHEST');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('ALL');

  useEffect(() => {
    getExercises().then(res => setExercises(res.data));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    try {
      const res = await createExercise({ name, muscleGroup, description });
      setExercises(prev => [...prev, res.data]);
      setName('');
      setMuscleGroup('CHEST');
      setDescription('');
      setShowForm(false);
      setError('');
    } catch {
      setError('Failed to create exercise');
    }
  };

  const handleDelete = async (id: string) => {
    await deleteExercise(id);
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const filtered = exercises.filter(ex => {
    const matchesName = ex.name.toLowerCase().includes(filter.toLowerCase());
    const matchesGroup = groupFilter === 'ALL' || ex.muscleGroup === groupFilter;
    return matchesName && matchesGroup;
  });

  const grouped = filtered.reduce((acc, ex) => {
    if (!acc[ex.muscleGroup]) acc[ex.muscleGroup] = [];
    acc[ex.muscleGroup].push(ex);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Exercises</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 14
          }}
        >
          + Custom Exercise
        </button>
      </div>

      {showForm && (
        <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 24, backgroundColor: '#fff' }}>
          <h3 style={{ margin: '0 0 16px' }}>New Custom Exercise</h3>
          {error && <p style={{ color: 'red', margin: '0 0 8px' }}>{error}</p>}
          <form onSubmit={handleCreate}>
            <input
              placeholder="Exercise name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8, boxSizing: 'border-box', borderRadius: 4, border: '1px solid #ccc' }}
            />
            <select
              value={muscleGroup}
              onChange={e => setMuscleGroup(e.target.value)}
              style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            >
              {MUSCLE_GROUPS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <input
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8, boxSizing: 'border-box', borderRadius: 4, border: '1px solid #ccc' }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="submit"
                style={{ padding: '8px 16px', backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ padding: '8px 16px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: 6, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Search exercises..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <select
          value={groupFilter}
          onChange={e => setGroupFilter(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="ALL">All Groups</option>
          {MUSCLE_GROUPS.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {Object.entries(grouped).map(([group, exs]) => (
        <div key={group} style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 8px', color: '#6366f1', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
            {group}
          </h3>
          <div style={{ backgroundColor: '#fff', borderRadius: 8, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            {exs.map((ex, i) => (
              <div
                key={ex.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: i < exs.length - 1 ? '1px solid #f3f4f6' : 'none'
                }}
              >
                <div>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{ex.name}</span>
                  {ex.isCustom && (
                    <span style={{ marginLeft: 8, fontSize: 11, backgroundColor: '#e0e7ff', color: '#6366f1', padding: '2px 6px', borderRadius: 10 }}>
                      custom
                    </span>
                  )}
                  {ex.description && (
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>{ex.description}</p>
                  )}
                </div>
                {ex.isCustom && (
                  <button
                    onClick={() => handleDelete(ex.id)}
                    style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: 16 }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}