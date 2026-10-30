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
    <div id="exercise-page-wrapper">
      <div className="exercise-page-top">
        <h1 className="exercise-page-header">Exercises</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="exercise-page-custom-button"
        >
          + Custom Exercise
        </button>
      </div>

      {showForm && (
        <div className="exercise-page-form-wrapper">
          <h3 className="exercise-page-new-exercise-header">New Custom Exercise</h3>
          {error && <p className="exercise-page-form-error">{error}</p>}
          <form className="exercise-page-form" onSubmit={handleCreate}>
            <input
              placeholder="Exercise name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="exercise-name-input"
            />
            <select
              value={muscleGroup}
              onChange={e => setMuscleGroup(e.target.value)}
              className="exercise-muscle-group-select"
            >
              {MUSCLE_GROUPS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <input
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="exercise-description-input"
            />
            <div className="exercise-form-utilities">
              <button
                type="submit"
                className="exercise-form-utilities-create-button"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="exercise-form-utilities-cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="" style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
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