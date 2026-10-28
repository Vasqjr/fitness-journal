import type { Workout } from '../types';

interface Props {
  workout: Workout;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function WorkoutCard({ workout, onClick, onDelete }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 16,
        border: '1px solid #ccc',
        borderRadius: 8,
        marginBottom: 8,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      <div>
        <h3 style={{ margin: 0, fontSize: 16 }}>{workout.name}</h3>
        <p style={{ margin: '4px 0 0', color: '#666', fontSize: 14 }}>
          {workout.date} · {workout.sets.length} sets
        </p>
      </div>
      <button
        onClick={onDelete}
        style={{
          background: 'none',
          border: 'none',
          color: '#e53e3e',
          cursor: 'pointer',
          fontSize: 18,
          padding: '4px 8px'
        }}
      >
        ✕
      </button>
    </div>
  );
}