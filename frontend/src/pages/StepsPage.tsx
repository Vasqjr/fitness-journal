import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSteps, saveSteps, deleteSteps } from '../api/stepsApi';
import type { StepEntry } from '../types';
import StepsChart from '../components/StepsChart';
import type { StepsChartPoint } from '../components/StepsChart';
import {
  HISTORY_DAYS,
  MAX_DAILY_STEPS,
  toDateString,
  parseDateString,
  addDays,
  getStepGoal,
  setStepGoal,
  calculateStreak,
} from '../utils/steps';
import './StepsPage.css';

type RangeDays = 7 | 30;

const QUICK_ADD = [500, 1000, 2500];

export default function StepsPage() {
  const today = toDateString(new Date());

  const [entries, setEntries] = useState<StepEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [rangeDays, setRangeDays] = useState<RangeDays>(7);
  const [selectedDate, setSelectedDate] = useState(today);
  const [goal, setGoal] = useState(getStepGoal);

  // null means "untouched": the field shows the saved value for the selected date
  const [draft, setDraft] = useState<string | null>(null);
  const [goalDraft, setGoalDraft] = useState<string | null>(null);

  const load = useCallback(async () => {
    const to = toDateString(new Date());
    const from = toDateString(addDays(new Date(), -(HISTORY_DAYS - 1)));
    const res = await getSteps(from, to);
    setEntries(res.data);
  }, []);

  useEffect(() => {
    load()
      .catch(() => setError('Could not load your steps.'))
      .finally(() => setLoading(false));
  }, [load]);

  const byDate = useMemo(
    () => new Map<string, number>(entries.map(e => [e.date, e.steps] as [string, number])),
    [entries]
  );

  // One point per day in the range; days with no entry stay null so the chart shows a gap
  const chartData = useMemo<StepsChartPoint[]>(() => {
    const points: StepsChartPoint[] = [];
    for (let i = rangeDays - 1; i >= 0; i--) {
      const day = addDays(new Date(), -i);
      const key = toDateString(day);
      points.push({
        date: key,
        label: day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        steps: byDate.get(key) ?? null,
      });
    }
    return points;
  }, [byDate, rangeDays]);

  const stats = useMemo(() => {
    const logged = chartData.flatMap(p => (p.steps === null ? [] : [{ date: p.date, steps: p.steps }]));
    const average = logged.length
      ? Math.round(logged.reduce((sum, p) => sum + p.steps, 0) / logged.length)
      : 0;
    const best = logged.reduce<{ date: string; steps: number } | null>(
      (top, p) => (top === null || p.steps > top.steps ? p : top),
      null
    );
    return { average, best, streak: calculateStreak(byDate, goal) };
  }, [chartData, byDate, goal]);

  const savedSteps = byDate.get(selectedDate);
  const inputValue = draft ?? (savedSteps !== undefined ? String(savedSteps) : '');
  const parsedSteps = Number(inputValue);
  const canSave =
    !saving &&
    inputValue !== '' &&
    Number.isInteger(parsedSteps) &&
    parsedSteps >= 0 &&
    parsedSteps <= MAX_DAILY_STEPS;

  const percent = savedSteps ? Math.min(100, Math.round((savedSteps / goal) * 100)) : 0;

  const goalInputValue = goalDraft ?? String(goal);
  const parsedGoal = Number(goalInputValue);
  const canSaveGoal =
    goalDraft !== null &&
    Number.isInteger(parsedGoal) &&
    parsedGoal > 0 &&
    parsedGoal <= MAX_DAILY_STEPS &&
    parsedGoal !== goal;

  const heading =
    selectedDate === today
      ? 'Today'
      : parseDateString(selectedDate).toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value || value > today) return;
    setSelectedDate(value);
    setDraft(null);
  };

  const handleQuickAdd = (amount: number) => {
    const current = Number(inputValue) || 0;
    setDraft(String(Math.min(MAX_DAILY_STEPS, current + amount)));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setError('');
    try {
      await saveSteps(selectedDate, parsedSteps);
      await load();
      setDraft(null);
    } catch {
      setError('Could not save your steps. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleClear = async () => {
    setError('');
    try {
      await deleteSteps(selectedDate);
      await load();
      setDraft(null);
    } catch {
      setError('Could not clear that day. Please try again.');
    }
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSaveGoal) return;
    setStepGoal(parsedGoal);
    setGoal(parsedGoal);
    setGoalDraft(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div id="steps-page-wrap">
      <h1 className="steps-page-header">Steps</h1>

      <section className="steps-log-card">
        <div className="steps-log-heading">{heading}</div>
        <div className="steps-log-count">
          {(savedSteps ?? 0).toLocaleString()}
          <span> / {goal.toLocaleString()} steps</span>
        </div>
        <div className="steps-progress">
          <div
            className={`steps-progress-fill${percent >= 100 ? ' met' : ''}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <form className="steps-log-form" onSubmit={handleSave}>
          <label className="steps-log-field">
            Date
            <input
              type="date"
              value={selectedDate}
              max={today}
              onChange={handleDateChange}
              className="steps-log-date-input"
            />
          </label>
          <label className="steps-log-field">
            Steps
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max={MAX_DAILY_STEPS}
              step="1"
              value={inputValue}
              onChange={e => setDraft(e.target.value)}
              className="steps-log-steps-input"
            />
          </label>
          <div className="steps-quick-add">
            {QUICK_ADD.map(amount => (
              <button key={amount} type="button" onClick={() => handleQuickAdd(amount)}>
                +{amount.toLocaleString()}
              </button>
            ))}
          </div>
          <div className="steps-log-actions">
            <button className="steps-log-submit-button standard-button" type="submit" disabled={!canSave}>
              {saving ? 'Saving…' : savedSteps !== undefined ? 'Update' : 'Save'}
            </button>
            {savedSteps !== undefined && (
              <button type="button" className="steps-clear-button" onClick={handleClear}>
                Clear day
              </button>
            )}
          </div>
        </form>

        {error && (
          <p className="steps-error" role="alert">
            {error}
          </p>
        )}
      </section>

      <div className="steps-stats-wrap">
        <div className="steps-statistic">
          <div className="steps-stat-title">Daily Average</div>
          <div className="steps-stat-value average">{stats.average.toLocaleString()}</div>
          <div className="steps-stat-note">last {rangeDays} days</div>
        </div>
        <div className="steps-statistic">
          <div className="steps-stat-title">Best Day</div>
          <div className="steps-stat-value best">{stats.best ? stats.best.steps.toLocaleString() : '—'}</div>
          <div className="steps-stat-note">{stats.best ? stats.best.date : 'no data yet'}</div>
        </div>
        <div className="steps-statistic">
          <div className="steps-stat-title">Goal Streak</div>
          <div className="steps-stat-value streak">
            {stats.streak}
            {stats.streak >= HISTORY_DAYS ? '+' : ''}
          </div>
          <div className="steps-stat-note">days in a row</div>
        </div>
      </div>

      <div className="steps-chart-display-wrap">
        <div className="steps-chart-display-top">
          <h3 className="steps-chart-display-header">Steps Per Day</h3>
          <div className="steps-range-toggle">
            {([7, 30] as const).map(days => (
              <button
                key={days}
                type="button"
                className={days === rangeDays ? 'active' : ''}
                onClick={() => setRangeDays(days)}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>
        <StepsChart data={chartData} goal={goal} />
      </div>

      <form className="steps-goal-form" onSubmit={handleSaveGoal}>
        <label className="steps-goal-field">
          Daily goal
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max={MAX_DAILY_STEPS}
            step="1"
            value={goalInputValue}
            onChange={e => setGoalDraft(e.target.value)}
            className="steps-goal-input"
          />
        </label>
        <button type="submit" className="steps-goal-submit-button" disabled={!canSaveGoal}>
          Set goal
        </button>
      </form>
    </div>
  );
}