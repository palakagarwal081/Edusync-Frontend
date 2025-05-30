import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const role = localStorage.getItem('role');
    const [userName, setUserName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user's name from localStorage
        const name = localStorage.getItem('userName');
        if (name) {
            setUserName(name);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showDropdown && !event.target.closest('.user-profile-dropdown')) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    return (
        <nav className="navbar navbar-expand-lg px-4 shadow" style={{ 
            background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
            transition: 'all 0.3s ease'
        }}>
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold text-white" to="/" style={{ fontSize: '1.5rem' }}>
                    🎓 EduSync
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" 
                    style={{ border: '1px solid rgba(255,255,255,0.5)' }}>
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {role === 'Instructor' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/instructor/dashboard" 
                                        style={{ transition: 'all 0.2s ease', ':hover': { opacity: 0.8 } }}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/instructor/courses"
                                        style={{ transition: 'all 0.2s ease', ':hover': { opacity: 0.8 } }}>
                                        My Courses
                                    </Link>
                                </li>
                            </>
                        )}
                        {role === 'Student' && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/student/dashboard"
                                        style={{ transition: 'all 0.2s ease', ':hover': { opacity: 0.8 } }}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/student/courses"
                                        style={{ transition: 'all 0.2s ease', ':hover': { opacity: 0.8 } }}>
                                        My Courses
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link text-white" to="/student/results"
                                        style={{ transition: 'all 0.2s ease', ':hover': { opacity: 0.8 } }}>
                                        Results
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                    {role && (
                        <div className="d-flex align-items-center user-profile-dropdown">
                            <div 
                                className="d-flex align-items-center me-3" 
                                onClick={toggleDropdown}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                }}
                            >
                                <i className="bi bi-person-circle text-white me-2" style={{ fontSize: '1.4rem' }}></i>
                                <span className="navbar-text text-white">
                                    {userName || 'User'}
                                </span>
                                <i className="bi bi-chevron-down text-white ms-2" style={{ fontSize: '0.8rem' }}></i>
                            </div>

                            {showDropdown && (
                                <div className="position-absolute" style={{
                                    top: '100%',
                                    right: '1rem',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    padding: '0.5rem 0',
                                    minWidth: '200px',
                                    zIndex: 1000,
                                    marginTop: '0.5rem'
                                }}>
                                    <div className="px-3 py-2 border-bottom">
                                        <div className="text-muted small">Signed in as</div>
                                        <div className="fw-bold">{userName || 'User'}</div>
                                        <div className="text-muted small">Role: {role}</div>
                                    </div>
                                    <button
                                        className="btn btn-link text-danger w-100 text-start px-3 py-2"
                                        onClick={logout}
                                        style={{
                                            textDecoration: 'none',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = '#fee2e2';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-right me-2"></i>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
