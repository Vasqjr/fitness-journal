import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useMetricPreference, setMetricPreference } from '../utils/units';
import './Navbar.css';

export default function Navbar() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) =>
        location.pathname.startsWith(path)
            ? { borderBottom: '2px solid #ac63f1', color: '#ac63f1' }
            : { borderBottom: '2px solid transparent', color: '#555' };

    const [useMetric, setUseMetric] = useState(useMetricPreference());

    const toggleUnit = () => {
        const newValue = !useMetric;
        setUseMetric(newValue);
        setMetricPreference(newValue);
        window.location.reload(); // reload so all components pick up the change
    };

    return (
        <nav id="navigation-wrapper">
            <div className="navigation-items">
                <span
                    onClick={() => navigate('/workouts')}
                    className='navigation-icon'
                >
                    Fitness Journal
                </span>
                <div className="navigation-elements">
                    <span
                        onClick={() => navigate('/workouts')}
                        style={{
                            ...isActive('/workouts')
                        }}
                        className='nav-element'
                    >
                        Workouts
                    </span>
                    <span
                        onClick={() => navigate('/progress')}
                        style={{
                            ...isActive('/progress')
                        }}
                        className='nav-element'
                    >
                        Progress
                    </span>
                    <span
                        onClick={() => navigate('/exercises')}
                        style={{
                            ...isActive('/exercises')
                        }}
                        className='nav-element'
                    >
                        Exercises
                    </span>
                </div>
            </div>
            <div className="navigation-utilities">
                <span className='nav-display-name'>
                    {user?.displayName}
                </span>
                <button
                    onClick={toggleUnit}
                    className='nav-utility'
                >
                    {useMetric ? 'Switch to lbs' : 'Switch to kg'}
                </button>
                <button
                    onClick={logout}
                    className='nav-utility'
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}