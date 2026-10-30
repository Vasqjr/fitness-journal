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

      <div className="exercise-page-search-wrapper">
        <input
          placeholder="Search exercises..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="exercise-page-search-input"
        />
        <select
          value={groupFilter}
          onChange={e => setGroupFilter(e.target.value)}
          className="exercise-page-search-filter"
        >
          <option value="ALL">All Groups</option>
          {MUSCLE_GROUPS.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {Object.entries(grouped).map(([group, exs]) => (
        <div className="exercise-page-categories-wrapper" key={group}>
          <h3 className="exercise-page-category-header">
            {group}
          </h3>
          <div className="exercise-page-category-items">
            {exs.map((ex, i) => (
              <div
                key={ex.id}
                className="exercise-page-category-item"
                style={{ borderBottom: i < exs.length - 1 ? '1px solid #f3f4f6' : 'none' }}
              >
                <div className="exercise-page-category-item-content">
                  <span className="exercise-page-category-item-name">{ex.name}</span>
                  {ex.isCustom && (
                    <span className="exercise-page-category-item-custom-tag">
                      custom
                    </span>
                  )}
                  {ex.description && (
                    <p className="exercise-page-category-item-description">{ex.description}</p>
                  )}
                </div>
                {ex.isCustom && (
                  <button
                    onClick={() => handleDelete(ex.id)}
                    className="exercise-page-category-item-delete-button"
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