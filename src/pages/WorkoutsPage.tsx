import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWorkouts, createWorkout, deleteWorkout } from '../api/workoutApi';
import { useAuth } from '../context/AuthContext';
import type { Workout } from '../types';
import WorkoutCard from '../components/WorkoutCard';

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
        <h1>Training Log</h1>
        <button className="standard-button" onClick={() => setShowForm(!showForm)}>
          + New Workout
        </button>
        {showForm && (
          <form onSubmit={handleCreate}>
            <input
              placeholder="Workout name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
            <button type="submit">Create</button>
          </form>
        )}

        {workouts.length === 0 ? (
          <p>No workouts yet. Create your first one!</p>
        ) : (
          workouts.map(workout => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onClick={() => navigate(`/workouts/${workout.id}`)}
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