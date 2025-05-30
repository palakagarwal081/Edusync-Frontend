import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await authService.login(email, password);
            if (result.success) {
                console.log('Login successful, storing user data:', {
                    token: result.token ? 'Present' : 'Missing',
                    role: result.role,
                    name: result.name,
                    userId: result.userId
                });
                
                localStorage.setItem('token', result.token);
                localStorage.setItem('role', result.role);
                localStorage.setItem('userName', result.name);
                localStorage.setItem('userId', result.userId);
                
                const role = result.role.toLowerCase();
                if (role === 'instructor') {
                    navigate('/instructor/dashboard');
                } else if (role === 'student') {
                    navigate('/student/dashboard');
                } else {
                    console.error('Unknown role:', result.role);
                    navigate('/login');
                }
            } else {
                setError(result.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred during login. Please try again.');
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ 
            minHeight: '90vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}>
            <div className="card p-4 shadow-lg w-100" style={{ 
                maxWidth: '400px',
                borderRadius: '15px',
                border: 'none',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-0" style={{ 
                        color: '#2c3e50',
                        fontWeight: '600'
                    }}>Welcome Back!</h3>
                    <button 
                        onClick={() => navigate('/')}
                        className="btn"
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            color: '#64748b',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                            e.currentTarget.style.color = '#334155';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#f8fafc';
                            e.currentTarget.style.color = '#64748b';
                        }}
                    >
                        <i className="bi bi-house-door-fill" style={{ fontSize: '1.1rem' }}></i>
                        <span style={{ fontWeight: '500' }}>Home</span>
                    </button>
                </div>
                <p className="text-right mb-3" style={{ color: '#6b7280' }}>Sign in to continue</p>
                {error && (
                    <div className="alert alert-danger py-2 mb-3" style={{
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small" style={{ color: '#4b5563', fontWeight: '500' }}>
                            Email address
                        </label>
                        <input 
                            type="email" 
                            className="form-control form-control-sm" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={{
                                borderRadius: '6px',
                                border: '1px solid #e5e7eb',
                                padding: '8px 12px'
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small" style={{ color: '#4b5563', fontWeight: '500' }}>
                            Password
                        </label>
                        <div className="input-group input-group-sm">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    borderRadius: '6px 0 0 6px',
                                    border: '1px solid #e5e7eb',
                                    padding: '8px 12px'
                                }}
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                                style={{
                                    borderRadius: '0 6px 6px 0',
                                    border: '1px solid #e5e7eb',
                                    backgroundColor: '#f9fafb'
                                }}
                            >
                                <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                            </button>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="btn w-100" 
                        style={{
                            backgroundColor: '#3498db',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '6px',
                            border: 'none',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <i className="bi bi-box-arrow-in-right me-1"></i>Login
                    </button>
                </form>
                <p className="text-center mt-3 mb-0 small" style={{ color: '#6b7280' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ 
                        color: '#3498db',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
