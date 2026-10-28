export const useMetricPreference = (): boolean => {
  return localStorage.getItem('useMetric') !== 'false';
};

export const setMetricPreference = (useMetric: boolean): void => {
  localStorage.setItem('useMetric', useMetric.toString());
};

export const kgToLbs = (kg: number): number =>
  Math.round(kg * 2.20462 * 10) / 10;

export const lbsToKg = (lbs: number): number =>
  Math.round(lbs / 2.20462 * 100) / 100;

export const displayWeight = (kg: number | null, useMetric: boolean): string => {
  if (kg === null) return '';
  if (useMetric) return `${kg} kg`;
  return `${kgToLbs(kg)} lbs`;
};

export const toKg = (value: number, useMetric: boolean): number =>
  useMetric ? value : lbsToKg(value);