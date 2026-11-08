export const HISTORY_DAYS = 90;
export const MAX_DAILY_STEPS = 200000;

const DEFAULT_GOAL = 10000;
const GOAL_KEY = 'dailyStepGoal';

const pad = (n: number): string => String(n).padStart(2, '0');

// Local calendar date as YYYY-MM-DD. Deliberately not toISOString(), which
// converts to UTC and can shift the date by a day in the evening.
export const toDateString = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseDateString = (s: string): Date => {
  const [year, month, day] = s.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const addDays = (d: Date, days: number): Date => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
};

export const getStepGoal = (): number => {
  const raw = localStorage.getItem(GOAL_KEY);
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_GOAL;
};

export const setStepGoal = (goal: number): void => {
  localStorage.setItem(GOAL_KEY, goal.toString());
};

// Consecutive days at or above the goal, counting back from today.
// If today isn't there yet, the streak starts from yesterday instead of resetting.
export const calculateStreak = (byDate: Map<string, number>, goal: number): number => {
  const cursor = new Date();
  if ((byDate.get(toDateString(cursor)) ?? 0) < goal) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let streak = 0;
  while ((byDate.get(toDateString(cursor)) ?? 0) >= goal) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};