import type { Workout } from '../types';
import './WorkoutCard.css';

interface Props {
  workout: Workout;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function WorkoutCard({ workout, onClick, onDelete }: Props) {
  return (
    <div
      onClick={onClick}
      id="workout-card-wrap"
    >
      <div className="workout-card">
        <h3 className="workout-card-header">{workout.name}</h3>
        <p className="workout-card-info">
          {workout.date} · {workout.sets.length} sets
        </p>
      </div>
      <button
        onClick={onDelete}
        className="workout-card-delete-button"
      >
        ✕
      </button>
    </div>
  );
}