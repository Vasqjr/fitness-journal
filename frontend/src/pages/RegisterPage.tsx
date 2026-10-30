import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import './LoginRegisterPages.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await registerApi(email, password, displayName);
      login(res.data.token, {
        userId: res.data.userId,
        email: res.data.email,
        displayName: res.data.displayName,
      });
      navigate('/workouts');
    } catch {
      setError('Registration failed. Email may already be in use.');
    }
  };

  return (
    <div id="register-page-wrap">
      <div className='register-card'>
        <h1>Fitness Journal</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit} className='register-form'>
          <div>
            <h2>Display Name</h2>
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="register-field"
            /></div>
          <div><h2>Email</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="register-field"
            /></div>
          <div>
            <h2>Password</h2>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="register-field"
            />
          </div>
          <button type="submit" className='register-field standard-button'>Register</button>
        </form>
        <p className='register-info-field'>Already have an account? <Link to="/login" className='register-link'>Log in</Link></p>
      </div>
    </div>
  );
}