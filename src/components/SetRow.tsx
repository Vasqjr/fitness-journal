import { useState } from 'react';
import type { WorkoutSet } from '../types';
import { useMetricPreference, displayWeight, toKg } from '../utils/units';

interface Props {
    set: WorkoutSet;
    onDelete: () => void;
    onUpdate: (setId: string, data: { reps?: number; weightKg?: number; rpe?: number; notes?: string }) => void;
}

export default function SetRow({ set, onDelete, onUpdate }: Props) {
    const useMetric = useMetricPreference();
    const [editing, setEditing] = useState(false);
    const [reps, setReps] = useState(set.reps?.toString() || '');
    const [weightKg, setWeightKg] = useState(
        set.weightKg ? (useMetric ? set.weightKg.toString() : (Math.round(set.weightKg * 2.20462 * 10) / 10).toString()) : ''
    );
    const [rpe, setRpe] = useState(set.rpe?.toString() || '');
    const [notes, setNotes] = useState(set.notes || '');



    const handleSave = () => {
        const weightValue = weightKg ? parseFloat(weightKg) : undefined;
        onUpdate(set.id, {
            reps: reps ? parseInt(reps) : undefined,
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
                <div className="set-row-editor-items" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <input
                        placeholder="Reps"
                        value={reps}
                        onChange={e => setReps(e.target.value)}
                        className='set-row-editor-reps-input'
                        style={{ width: 70 }}
                    />
                    <input
                        placeholder={useMetric ? 'Weight (kg)' : 'Weight (lbs)'}
                        value={weightKg}
                        onChange={e => setWeightKg(e.target.value)}
                        className='set-row-editor-weight-input'
                        style={{ width: 100 }}
                    />
                    <input
                        placeholder="RPE"
                        value={rpe}
                        onChange={e => setRpe(e.target.value)}
                        className='set-row-editor-rpe-input'
                        style={{ width: 60 }}
                    />
                    <input
                        placeholder="Notes"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className='set-row-editor-notes-input'
                        style={{ width: 150 }}
                    />
                    <button
                        onClick={handleSave}
                        className='set-row-editor-save-button'
                    >
                        Save
                    </button>
                    <button
                        onClick={() => setEditing(false)}
                        className='set-row-editor-cancel-button'
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div id="set-row-wrap">
            <div className="set-row-info">
                <span className="set-row-exercise-name">{set.exerciseName}</span>
                <span className="set-row-set-number">Set {set.setNumber}</span>
                {set.reps && <span className="set-row-reps">{set.reps} reps</span>}
                {set.weightKg && <span className="set-row-weight">@ {displayWeight(set.weightKg, useMetric)}</span>}
                {set.rpe && <span className="set-row-rpe">RPE {set.rpe}</span>}
                {set.notes && <span className="set-row-notes">{set.notes}</span>}
            </div>
            <div className="set-row-utilities">
                <button
                    onClick={() => setEditing(true)}
                    className='set-row-utility-edit'
                >
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className='set-row-utility-delete'
                >
                    ✕
                </button>
            </div>
        </div>
    );
}