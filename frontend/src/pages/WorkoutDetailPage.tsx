import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkout, addSet, deleteSet, deleteWorkout, updateSet } from '../api/workoutApi';
import type { Workout } from '../types';
import SetRow from '../components/SetRow';
import ExerciseSelector from '../components/ExerciseSelector';
import { useMetricPreference, toKg } from '../utils/units';
import './WorkoutDetailPage.css';

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
    <div id="workout-details-page-wrapper">
      <button className="workout-details-back-button standard-button" onClick={() => navigate('/workouts')}>← Back</button>
      <div className="workout-details-wrap">
        <h1 className="workout-details-header">{workout.name}</h1>
        <button className="workout-details-delete-button standard-button" onClick={handleDeleteWorkout}>Delete Workout</button>
      </div>
      <p className="workout-details-date">{workout.date}</p>

      <h2 className="workout-sets-header">Sets</h2>
      {workout.sets.length === 0 ? (
        <p className="workout-no-sets">No sets yet.</p>
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

      <h2 className="workout-add-sets-header">Add Set</h2>
      <form className="workout-add-sets-form" onSubmit={handleAddSet}>
        <ExerciseSelector
          value={exerciseId}
          onChange={setExerciseId}
        />

        <input
          placeholder="Reps"
          value={reps}
          onChange={e => setReps(e.target.value)}
          className="workout-sets-reps-input"
        />
        <input
          placeholder="Weight (kg)"
          value={weightKg}
          onChange={e => setWeightKg(e.target.value)}
          className="workout-sets-weight-input"
        />
        <button className="workout-details-submit-button standard-button" type="submit">Add Set</button>
      </form>
    </div>
  );
}