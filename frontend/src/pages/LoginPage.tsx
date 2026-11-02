import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import './LoginRegisterPages.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginApi(email, password);
      login(res.data.token, {
        userId: res.data.userId,
        email: res.data.email,
        displayName: res.data.displayName,
      });
      navigate('/workouts');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div id="auth-page-wrap">
      <div className="auth-card">
        <h1 className="auth-card-header">Fitness Journal</h1>
        {error && <p className="auth-card-error">{error}</p>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <h2>Email</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="auth-field"
            />
          </div>
          <div>
            <h2>Password</h2>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="auth-field"
            />
          </div>
          <button type="submit" className='auth-field auth-button standard-button'>Log in</button>
        </form>
        <p className='auth-info-field'>Don't have an account? <Link to="/register" className='auth-link'>Register</Link></p>
      </div>

    </div>
  );
}