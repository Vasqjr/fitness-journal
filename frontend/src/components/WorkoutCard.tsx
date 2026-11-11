import { Link } from 'react-router-dom';
import type { Workout } from '../types';
import './WorkoutCard.css';

interface Props {
  workout: Workout;
  onDelete: (e: React.MouseEvent) => void;
}

export default function WorkoutCard({ workout, onDelete }: Props) {
  return (
    <article id="workout-card-wrap">
      <Link
        to={`/workouts/${workout.id}`}
        aria-label={`Open ${workout.name}, ${workout.date}, ${workout.sets.length} sets`}
        className="workout-card"
      >
        <h3 className="workout-card-header">{workout.name}</h3>
        <p className="workout-card-info">
          {workout.date} · {workout.sets.length} sets
        </p>
      </Link>
      <button
        type="button"
        aria-label={`Delete workout ${workout.name}`}
        onClick={onDelete}
        className="workout-card-delete-button"
      >
        ✕
      </button>
    </article>
  );
}