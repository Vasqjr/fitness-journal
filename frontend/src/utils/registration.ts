export type RegistrationField = 'email' | 'password' | 'displayName';
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;

export interface RegistrationErrorResponse {
  error?: string;
  fieldErrors?: RegistrationErrors;
}

export const validateRegistration = (
  email: string,
  password: string,
  displayName: string,
): RegistrationErrors => {
  const errors: RegistrationErrors = {};
  const trimmedEmail = email.trim();
  const trimmedDisplayName = displayName.trim();

  if (!trimmedEmail) errors.email = 'Email is required.';
  else if (trimmedEmail.length > 254) errors.email = 'Email must be 254 characters or less.';

  if (!password) errors.password = 'Password is required.';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';

  if (!trimmedDisplayName) errors.displayName = 'Display name is required.';
  else if (trimmedDisplayName.length > 100) {
    errors.displayName = 'Display name must be 100 characters or less.';
  }

  return errors;
};

export const getRegistrationFailure = (
  status: number | undefined,
  data?: RegistrationErrorResponse,
): { message: string; fieldErrors: RegistrationErrors } => {
  if (status === undefined) {
    return {
      message: 'Unable to connect. Check your internet connection and try again.',
      fieldErrors: {},
    };
  }

  if (status === 409) {
    return {
      message: 'An account with this email already exists. Try logging in instead.',
      fieldErrors: {},
    };
  }

  const fieldErrors = data?.fieldErrors ?? {};
  const validationMessage = Object.values(fieldErrors).filter(Boolean).join(' ');
  if (validationMessage) return { message: validationMessage, fieldErrors };

  if (status >= 500) {
    return {
      message: 'Registration is temporarily unavailable. Please try again later.',
      fieldErrors: {},
    };
  }

  return {
    message: data?.error ?? 'Registration failed. Please check your details and try again.',
    fieldErrors: {},
  };
};