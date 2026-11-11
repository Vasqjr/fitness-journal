import { afterEach, describe, expect, it, vi } from 'vitest';
import { addDays, calculateStreak, parseDateString, toDateString } from './steps';

describe('step date helpers', () => {
  it('round-trips local calendar dates, including leap day', () => {
    const leapDay = new Date(2024, 1, 29, 12);

    expect(toDateString(leapDay)).toBe('2024-02-29');
    expect(toDateString(parseDateString('2024-02-29'))).toBe('2024-02-29');
    expect(toDateString(addDays(leapDay, 1))).toBe('2024-03-01');
  });
});

describe('calculateStreak', () => {
  afterEach(() => vi.useRealTimers());

  it('continues from yesterday when today has not reached the goal', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 11, 12));

    const entries = new Map([
      ['2026-11-09', 10000],
      ['2026-11-10', 10000],
    ]);

    expect(calculateStreak(entries, 10000)).toBe(2);
  });

  it('counts today and consecutive prior days when today has reached the goal', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 11, 12));

    const entries = new Map([
      ['2026-11-09', 10000],
      ['2026-11-10', 10000],
      ['2026-11-11', 12000],
    ]);

    expect(calculateStreak(entries, 10000)).toBe(3);
  });
});