import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useMetricPreference, setMetricPreference } from '../utils/units';
import './Navbar.css';

export default function Navbar() {
    const { logout, user } = useAuth();

    const [useMetric, setUseMetric] = useState(useMetricPreference());

    const toggleUnit = () => {
        const newValue = !useMetric;
        setUseMetric(newValue);
        setMetricPreference(newValue);
        window.location.reload(); // reload so all components pick up the change
    };

    return (
        <nav id="navigation-wrapper" aria-label="Primary navigation">
            <div className="navigation-items">
                <Link to="/workouts" className="navigation-icon">
                    Fitness Journal
                </Link>
                <div className="navigation-elements">
                    <NavLink to="/workouts" className="nav-element" end>
                        Workouts
                    </NavLink>
                    <NavLink to="/progress" className="nav-element">
                        Progress
                    </NavLink>
                    <NavLink to="/exercises" className="nav-element">
                        Exercises
                    </NavLink>
                    <NavLink to="/steps" className="nav-element">
                        Steps
                    </NavLink>
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