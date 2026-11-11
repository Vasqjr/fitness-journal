import { describe, expect, it } from 'vitest';
import { convertKgForDisplay, displayWeight, kgToLbs, lbsToKg, toKg } from './units';

describe('weight conversions', () => {
  it('converts between kilograms and pounds with the expected precision', () => {
    expect(kgToLbs(100)).toBe(220.5);
    expect(lbsToKg(220.462)).toBe(100);
    expect(lbsToKg(220.5)).toBe(100.02);
  });

  it('converts entered pounds to kilograms and formats display values', () => {
    expect(toKg(220.5, false)).toBe(100.02);
    expect(convertKgForDisplay(10.5, false)).toBe(23.1);
    expect(convertKgForDisplay(10.5, true)).toBe(10.5);
    expect(displayWeight(100, false)).toBe('220.5 lbs');
    expect(displayWeight(100, true)).toBe('100 kg');
    expect(displayWeight(null, true)).toBe('');
  });
});