import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkout, addSet, deleteSet, deleteWorkout, updateSet } from '../api/workoutApi';
import type { Workout, WorkoutSet } from '../types';
import SetRow from '../components/SetRow';
import ExerciseSelector from '../components/ExerciseSelector';
import { useMetricPreference, displayWeight, toKg } from '../utils/units';
import './WorkoutDetailPage.css';

const KG_TO_LBS = 2.20462;

// Weight as a plain number string in the user's current unit (for form fields)
function toDisplayNumber(kg: number, useMetric: boolean): string {
  return (useMetric ? kg : Math.round(kg * KG_TO_LBS * 10) / 10).toString();
}

interface SetGroup {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

type SetUpdate = { reps?: number; weightKg?: number; rpe?: number; notes?: string };

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const useMetric = useMetricPreference();
  const repsInputRef = useRef<HTMLInputElement>(null);

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [exerciseId, setExerciseId] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const refresh = useCallback(async () => {
    if (!id) return;
    const res = await getWorkout(id);
    setWorkout(res.data);
  }, [id]);

  useEffect(() => {
    refresh().catch(() => setLoadError('Could not load this workout.'));
  }, [refresh]);

  // Sets grouped by exercise, in the order each exercise first appears
  const groups = useMemo<SetGroup[]>(() => {
    const map = new Map<string, SetGroup>();
    for (const set of workout?.sets ?? []) {
      const group = map.get(set.exerciseId) ?? {
        exerciseId: set.exerciseId,
        exerciseName: set.exerciseName,
        sets: [],
      };
      group.sets.push(set);
      map.set(set.exerciseId, group);
    }
    return [...map.values()];
  }, [workout]);

  const totalVolumeKg = useMemo(
    () => (workout?.sets ?? []).reduce((sum, s) => sum + (s.reps ?? 0) * (s.weightKg ?? 0), 0),
    [workout]
  );

  // Picking an exercise prefills reps/weight from its most recent set in this workout
  const selectExercise = (newId: string) => {
    setExerciseId(newId);
    const previous = (workout?.sets ?? []).filter(s => s.exerciseId === newId);
    const last = previous[previous.length - 1];
    setReps(last?.reps != null ? String(last.reps) : '');
    setWeight(last?.weightKg != null ? toDisplayNumber(last.weightKg, useMetric) : '');
  };

  const canSubmit =
    !submitting &&
    exerciseId !== '' &&
    reps !== '' &&
    Number(reps) > 0 &&
    (weight === '' || Number(weight) >= 0);

  const handleAddSet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !workout || !canSubmit) return;
    setSubmitting(true);
    setActionError('');
    try {
      // Set numbers count per exercise, not across the whole workout
      const setNumber = workout.sets.filter(s => s.exerciseId === exerciseId).length + 1;
      await addSet(id, {
        exerciseId,
        setNumber,
        reps: parseInt(reps, 10),
        weightKg: weight !== '' ? toKg(parseFloat(weight), useMetric) : undefined,
      });
      await refresh();
      // Reps and weight stay filled in so the next identical set is one click
      repsInputRef.current?.focus();
    } catch {
      setActionError('Could not add that set. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddAnother = (group: SetGroup) => {
    selectExercise(group.exerciseId);
    repsInputRef.current?.focus();
    repsInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleUpdateSet = async (setId: string, data: SetUpdate) => {
    if (!id) return;
    setActionError('');
    try {
      await updateSet(id, setId, data);
      await refresh();
    } catch {
      setActionError('Could not save that change. Please try again.');
    }
  };

  const handleDeleteSet = async (setId: string) => {
    if (!id) return;
    setActionError('');
    try {
      await deleteSet(id, setId);
      await refresh();
    } catch {
      setActionError('Could not delete that set. Please try again.');
    }
  };

  const handleDeleteWorkout = async () => {
    if (!id || !workout) return;
    if (!window.confirm(`Delete "${workout.name}" and all of its sets? This can't be undone.`)) return;
    try {
      await deleteWorkout(id);
      navigate('/workouts');
    } catch {
      setActionError('Could not delete this workout. Please try again.');
    }
  };

  if (loadError) return <p className="workout-details-error">{loadError}</p>;
  if (!workout) return <p>Loading...</p>;

  return (
    <div id="workout-details-page-wrapper">
      <button className="workout-details-back-button standard-button" onClick={() => navigate('/workouts')}>
        ← Back
      </button>

      <div className="workout-details-wrap">
        <h1 className="workout-details-header">{workout.name}</h1>
      </div>
      <p className="workout-details-date">{workout.date}</p>

      {workout.sets.length > 0 && (
        <p className="workout-details-summary">
          {workout.sets.length} {workout.sets.length === 1 ? 'set' : 'sets'} · {groups.length}{' '}
          {groups.length === 1 ? 'exercise' : 'exercises'}
          {totalVolumeKg > 0 && ` · ${displayWeight(totalVolumeKg, useMetric)} total volume`}
        </p>
      )}

      {actionError && (
        <p className="workout-details-error" role="alert">
          {actionError}
        </p>
      )}

      <h2 className="workout-sets-header">Sets</h2>
      {groups.length === 0 ? (
        <p className="workout-no-sets">No sets yet. Add your first one below.</p>
      ) : (
        groups.map(group => (
          <section key={group.exerciseId} className="workout-set-group">
            <h3 className="workout-set-group-header">{group.exerciseName}</h3>
            {group.sets.map(set => (
              <SetRow
                key={set.id}
                set={set}
                showExerciseName={false}
                onDelete={() => handleDeleteSet(set.id)}
                onUpdate={handleUpdateSet}
              />
            ))}
            <button type="button" className="workout-set-group-add" onClick={() => handleAddAnother(group)}>
              + Add set
            </button>
          </section>
        ))
      )}

      <h2 className="workout-add-sets-header">Add Set</h2>
      <form className="workout-add-sets-form" onSubmit={handleAddSet}>
        <ExerciseSelector value={exerciseId} onChange={selectExercise} />

        <div className="workout-add-sets-fields">
          <label className="workout-add-sets-field">
            Reps
            <input
              ref={repsInputRef}
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={reps}
              onChange={e => setReps(e.target.value)}
              className="workout-sets-reps-input"
            />
          </label>
          <label className="workout-add-sets-field">
            {useMetric ? 'Weight (kg)' : 'Weight (lbs)'}
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              className="workout-sets-weight-input"
            />
          </label>
        </div>

        <button className="workout-details-submit-button standard-button" type="submit" disabled={!canSubmit}>
          {submitting ? 'Adding…' : 'Add Set'}
        </button>
      </form>

      <div className="workout-details-danger-zone">
        <button className="workout-details-delete-button standard-button" onClick={handleDeleteWorkout}>
          Delete Workout
        </button>
      </div>
    </div>
  );
}