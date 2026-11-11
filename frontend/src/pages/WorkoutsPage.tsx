import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkouts, createWorkout, deleteWorkout } from '../api/workoutApi';
import { useAuth } from '../context/AuthContext';
import type { Workout } from '../types';
import WorkoutCard from '../components/WorkoutCard';
import './WorkoutsPage.css';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const { } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    getWorkouts().then(res => {
      setWorkouts(res.data.content);
      setLoading(false);
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createWorkout({ name, date });
    navigate(`/workouts/${res.data.id}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div id="workout-page-wrapper">
      <div className="training-log-content">
        <h1 className="training-log-header">Training Log</h1>
        <button
          className="training-log-new-workout-button standard-button"
          aria-expanded={showForm}
          onClick={() => setShowForm(!showForm)}
        >
          + New Workout
        </button>
        {showForm && (
          <form id="create-workout-form" className="create-workout-form" onSubmit={handleCreate}>
            <input
              aria-label="Workout name"
              required
              placeholder="Workout name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="create-workout-name-input"
            />
            <input
              aria-label="Workout date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="create-workout-date-input"
            />
            <button className="create-workout-submit" type="submit">Create</button>
          </form>
        )}

        {workouts.length === 0 ? (
          <p className="no-workout-notice">No workouts yet. Create your first one!</p>
        ) : (
          workouts.map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onDelete={async (e) => {
                e.stopPropagation();
                await deleteWorkout(workout.id);
                setWorkouts(prev => prev.filter(w => w.id !== workout.id));
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}