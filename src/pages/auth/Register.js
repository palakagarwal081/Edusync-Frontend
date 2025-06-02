import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Student'
    });
    const [showPassword] = useState(false);
    const [showConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        const result = await authService.register(formData);
        if (result.success) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('role', result.role);
            localStorage.setItem('userId', result.userId);
            localStorage.setItem('userName', result.name);
            navigate(result.redirectTo || '/login');
        } else {
            setError(result.message || 'Registration failed');
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
                <div className="d-flex justify-content-between align-items-center" style={{ marginBottom: '0.5rem' }}>
                    <h3 className="mb-0" style={{ 
                        color: '#2c3e50',
                        fontWeight: '600'
                    }}>Join EduSync!</h3>
                    <button 
                        onClick={() => {
                            const role = localStorage.getItem('role')?.toLowerCase();
                            if (role === 'student') {
                                navigate('/student/dashboard');
                            } else if (role === 'instructor') {
                                navigate('/instructor/dashboard');
                            } else {
                                navigate('/');
                            }
                        }}
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
                            gap: '6px',
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
                <p className="text-right" style={{ 
                    color: '#6b7280', 
                    marginTop: '-0.5rem',
                    marginBottom: '1.5rem'
                }}>Start your learning journey</p>
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
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label small" style={{ color: '#4b5563', fontWeight: '500' }}>
                                Full Name
                            </label>
                            <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                name="name" 
                                onChange={handleChange} 
                                required 
                                style={{
                                    borderRadius: '6px',
                                    border: '1px solid #e5e7eb',
                                    padding: '8px 12px'
                                }}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label small" style={{ color: '#4b5563', fontWeight: '500' }}>
                                Role
                            </label>
                            <select 
                                className="form-select form-select-sm" 
                                name="role" 
                                onChange={handleChange}
                                value={formData.role}
                                style={{
                                    borderRadius: '6px',
                                    border: '1px solid #e5e7eb',
                                    padding: '8px 12px'
                                }}
                            >
                                <option value="Student">Student</option>
                                <option value="Instructor">Instructor</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label small" style={{ color: '#4b5563', fontWeight: '500' }}>
                            Email
                        </label>
                        <input 
                            type="email" 
                            className="form-control form-control-sm" 
                            name="email" 
                            onChange={handleChange} 
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
                        <div className="input-group">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="form-control form-control-sm" 
                                name="password" 
                                onChange={handleChange} 
                                required 
                                style={{
                                    borderRadius: '6px',
                                    border: '1px solid #e5e7eb',
                                    padding: '8px 12px'
                                }}
                            />
                            
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label small" style={{ color: '#4b5563', fontWeight: '500' }}>
                            Confirm Password
                        </label>
                        <div className="input-group">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                className="form-control form-control-sm" 
                                name="confirmPassword" 
                                onChange={handleChange} 
                                required 
                                style={{
                                    borderRadius: '6px',
                                    border: '1px solid #e5e7eb',
                                    padding: '8px 12px'
                                }}
                            />
                            
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
                        <i className="bi bi-person-plus me-1"></i>Register
                    </button>
                </form>
                <p className="text-center mt-3 mb-0 small" style={{ color: '#6b7280' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ 
                        color: '#3498db',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;