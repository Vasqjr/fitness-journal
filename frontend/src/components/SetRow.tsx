import { useState } from 'react';
import type { WorkoutSet } from '../types';
import { useMetricPreference, displayWeight, toKg } from '../utils/units';
import './SetRow.css';

interface Props {
    set: WorkoutSet;
    showExerciseName?: boolean;
    onDelete: () => void;
    onUpdate: (setId: string, data: { reps?: number; weightKg?: number; rpe?: number; notes?: string }) => void;
}

export default function SetRow({ set, showExerciseName = true, onDelete, onUpdate }: Props) {
    const useMetric = useMetricPreference();
    const [editing, setEditing] = useState(false);
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [rpe, setRpe] = useState('');
    const [notes, setNotes] = useState('');

    // Fields are loaded fresh each time editing starts, so Cancel discards edits
    // and a kg/lbs switch since the last edit is picked up.
    const startEditing = () => {
        setReps(set.reps != null ? set.reps.toString() : '');
        setWeight(
            set.weightKg != null
                ? (useMetric ? set.weightKg.toString() : (Math.round(set.weightKg * 2.20462 * 10) / 10).toString())
                : ''
        );
        setRpe(set.rpe != null ? set.rpe.toString() : '');
        setNotes(set.notes || '');
        setEditing(true);
    };

    const handleSave = () => {
        const weightValue = weight ? parseFloat(weight) : undefined;
        onUpdate(set.id, {
            reps: reps ? parseInt(reps, 10) : undefined,
            weightKg: weightValue !== undefined ? toKg(weightValue, useMetric) : undefined,
            rpe: rpe ? parseFloat(rpe) : undefined,
            notes: notes || undefined,
        });
        setEditing(false);
    };

    if (editing) {
        return (
            <div id="set-row-editor-wrap">
                <div className="set-row-info">
                    {set.exerciseName} — Set {set.setNumber}
                </div>
                <div className="set-row-editor-items">
                    <input
                        placeholder="Reps"
                        inputMode="numeric"
                        value={reps}
                        onChange={e => setReps(e.target.value)}
                        className="set-row-editor-reps-input"
                    />
                    <input
                        placeholder={useMetric ? 'Weight (kg)' : 'Weight (lbs)'}
                        inputMode="decimal"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                        className="set-row-editor-weight-input"
                    />
                    <input
                        placeholder="RPE"
                        inputMode="decimal"
                        value={rpe}
                        onChange={e => setRpe(e.target.value)}
                        className="set-row-editor-rpe-input"
                    />
                    <input
                        placeholder="Notes"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="set-row-editor-notes-input"
                    />
                    <button onClick={handleSave} className="set-row-editor-save-button">
                        Save
                    </button>
                    <button onClick={() => setEditing(false)} className="set-row-editor-cancel-button">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div id="set-row-wrap">
            <div className="set-row-info">
                {showExerciseName && <span className="set-row-exercise-name">{set.exerciseName}</span>}
                <span className="set-row-set-number">Set {set.setNumber}</span>
                {set.reps != null && <span className="set-row-reps">{set.reps} reps </span>}
                {set.weightKg != null && (
                    <span className="set-row-weight">@ {displayWeight(set.weightKg, useMetric)}</span>
                )}
                {set.rpe != null && <span className="set-row-rpe">RPE {set.rpe}</span>}
                {set.notes && <span className="set-row-notes">{set.notes}</span>}
            </div>
            <div className="set-row-utilities">
                <button onClick={startEditing} className="set-row-utility-edit">
                    Edit
                </button>
                <button onClick={onDelete} className="set-row-utility-delete">
                    ✕
                </button>
            </div>
        </div>
    );
}