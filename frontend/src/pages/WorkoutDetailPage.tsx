import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkout, addSet, deleteSet, deleteWorkout, updateSet } from '../api/workoutApi';
import type { Workout } from '../types';
import SetRow from '../components/SetRow';
import ExerciseSelector from '../components/ExerciseSelector';
import { useMetricPreference, toKg } from '../utils/units';

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exerciseId, setExerciseId] = useState('');
  const [reps, setReps] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const useMetric = useMetricPreference();

  useEffect(() => {
    if (!id) return;
    getWorkout(id).then(res => setWorkout(res.data));
  }, [id]);

  const handleAddSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !workout) return;
    const setNumber = workout.sets.length + 1;
    const weightValue = weightKg ? parseFloat(weightKg) : undefined;
    await addSet(id, {
      exerciseId,
      setNumber,
      reps: reps ? parseInt(reps) : undefined,
      weightKg: weightValue !== undefined ? toKg(weightValue, useMetric) : undefined,
    });
    const res = await getWorkout(id);
    setWorkout(res.data);
    setReps('');
    setWeightKg('');
  };



  const handleUpdateSet = async (setId: string, data: { reps?: number; weightKg?: number; rpe?: number; notes?: string }) => {
    if (!id) return;
    await updateSet(id, setId, data);
    const res = await getWorkout(id);
    setWorkout(res.data);
  };

  const handleDeleteSet = async (setId: string) => {
    if (!id) return;
    await deleteSet(id, setId);
    const res = await getWorkout(id);
    setWorkout(res.data);
  };

  const handleDeleteWorkout = async () => {
    if (!id) return;
    await deleteWorkout(id);
    navigate('/workouts');
  };

  if (!workout) return <p>Loading...</p>;

  return (
    <div>
      <button onClick={() => navigate('/workouts')}>← Back</button>
      <div>
        <h1>{workout.name}</h1>
        <button onClick={handleDeleteWorkout} style={{ color: 'red' }}>Delete Workout</button>
      </div>
      <p>{workout.date}</p>

      <h2>Sets</h2>
      {workout.sets.length === 0 ? (
        <p>No sets yet.</p>
      ) : (
        workout.sets.map(set => (
          <SetRow
            key={set.id}
            set={set}
            onDelete={() => handleDeleteSet(set.id)}
            onUpdate={handleUpdateSet}
          />
        ))
      )}

      <h2>Add Set</h2>
      <form onSubmit={handleAddSet}>
        <ExerciseSelector
          value={exerciseId}
          onChange={setExerciseId}
        />

        <input
          placeholder="Reps"
          value={reps}
          onChange={e => setReps(e.target.value)}
        />
        <input
          placeholder="Weight (kg)"
          value={weightKg}
          onChange={e => setWeightKg(e.target.value)}
        />
        <button type="submit">Add Set</button>
      </form>
    </div>
  );
}