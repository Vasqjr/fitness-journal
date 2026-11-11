import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { register as registerApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import {
  getRegistrationFailure,
  validateRegistration,
  type RegistrationErrorResponse,
  type RegistrationErrors,
  type RegistrationField,
} from '../utils/registration';
import './LoginRegisterPages.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<RegistrationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateRegistration(email, password, displayName);
    setFieldErrors(validationErrors);
    setError('');
    if (Object.keys(validationErrors).length > 0) {
      setError('Please correct the highlighted fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerApi(email.trim(), password, displayName.trim());
      login(res.data.token, {
        userId: res.data.userId,
        email: res.data.email,
        displayName: res.data.displayName,
      });
      navigate('/workouts');
    } catch (err: unknown) {
      const response = isAxiosError<RegistrationErrorResponse>(err) ? err.response : undefined;
      const failure = getRegistrationFailure(response?.status, response?.data);
      setError(failure.message);
      setFieldErrors(failure.fieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearFieldError = (field: RegistrationField) => {
    setFieldErrors(current => ({ ...current, [field]: undefined }));
    setError('');
  };

  return (
    <div id="auth-page-wrap">
      <div className="auth-card">
        <h1 className="auth-card-header">Fitness Journal</h1>
        {error && <p className="auth-card-error" role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-display-name-wrap">
            <label htmlFor="register-display-name" className="auth-display-name-header">Display Name</label>
            <input
              id="register-display-name"
              name="displayName"
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={e => {
                setDisplayName(e.target.value);
                clearFieldError('displayName');
              }}
              autoComplete="name"
              maxLength={100}
              required
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.displayName)}
              aria-describedby={fieldErrors.displayName ? 'register-display-name-error' : undefined}
              className="auth-field"
            />
            {fieldErrors.displayName && <p id="register-display-name-error" className="auth-card-error">{fieldErrors.displayName}</p>}
          </div>
          <div className="auth-email-wrap">
            <label htmlFor="register-email" className="auth-email-header">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                clearFieldError('email');
              }}
              autoComplete="email"
              maxLength={254}
              required
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
              className="auth-field"
            />
            {fieldErrors.email && <p id="register-email-error" className="auth-card-error">{fieldErrors.email}</p>}
          </div>
          <div className="auth-password-wrap">
            <label htmlFor="register-password" className="auth-password-header">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                clearFieldError('password');
              }}
              autoComplete="new-password"
              minLength={8}
              required
              disabled={isSubmitting}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'register-password-error' : undefined}
              className="auth-field"
            />
            <p className="auth-field-hint">Use at least 8 characters.</p>
            {fieldErrors.password && <p id="register-password-error" className="auth-card-error">{fieldErrors.password}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="auth-field auth-button standard-button">
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className='auth-info-field'>Already have an account? <Link to="/login" className='auth-link'>Log in</Link></p>
      </div>
    </div>
  );
}