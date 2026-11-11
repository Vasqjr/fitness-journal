import { describe, expect, it } from 'vitest';
import { getRegistrationFailure, validateRegistration } from './registration';

describe('validateRegistration', () => {
  it('accepts valid details after trimming surrounding whitespace', () => {
    expect(validateRegistration(' runner@example.com ', 'password123', ' Runner ')).toEqual({});
  });

  it('reports all required and length errors', () => {
    expect(validateRegistration(' ', 'short', ' '.repeat(101))).toEqual({
      email: 'Email is required.',
      password: 'Password must be at least 8 characters.',
      displayName: 'Display name is required.',
    });
    expect(validateRegistration('x'.repeat(255), 'password123', 'Runner')).toEqual({
      email: 'Email must be 254 characters or less.',
    });
    expect(validateRegistration('runner@example.com', 'password123', 'R'.repeat(101))).toEqual({
      displayName: 'Display name must be 100 characters or less.',
    });
  });
});

describe('getRegistrationFailure', () => {
  it('formats duplicate, validation, network, and server failures', () => {
    expect(getRegistrationFailure(409).message).toContain('already exists');
    expect(getRegistrationFailure(400, {
      fieldErrors: { password: 'Password must be at least 8 characters' },
    })).toEqual({
      message: 'Password must be at least 8 characters',
      fieldErrors: { password: 'Password must be at least 8 characters' },
    });
    expect(getRegistrationFailure(undefined).message).toContain('connect');
    expect(getRegistrationFailure(503).message).toContain('temporarily unavailable');
  });
});