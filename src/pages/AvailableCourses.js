import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import './AvailableCourses.css';

function AvailableCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const coursesData = await courseService.getAvailableCourses();
                setCourses(coursesData);
                setError('');
            } catch (err) {
                setError('Failed to load courses. Please try again later.');
                console.error('Error fetching courses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleEnrollClick = () => {
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1 fw-bold text-primary">Available Courses</h2>
                    <p className="text-muted">Browse our collection of courses</p>
                </div>
                <Link to="/" className="btn btn-outline-primary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Home
                </Link>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {courses.length === 0 ? (
                <div className="text-center py-5 bg-light rounded-3 shadow-sm">
                    <i className="bi bi-book empty-state-icon"></i>
                    <p className="mt-3 empty-state-text">No courses available at the moment.</p>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {courses.map(course => (
                        <div key={course.courseId} className="col">
                            <div className="card h-100 course-card">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="course-title mb-0">
                                            {course.title}
                                        </h5>
                                    </div>
                                    <p className="course-description mb-4">
                                        {course.description}
                                    </p>
                                    <div className="course-info">
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-person-circle course-info-icon me-2"></i>
                                            <span className="course-info-text">Instructor: {course.instructorName || 'Unknown'}</span>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <i className="bi bi-people course-info-icon me-2"></i>
                                            <span className="course-info-text">{course.enrollmentCount || 0} Students Enrolled</span>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-file-text course-info-icon me-2"></i>
                                            <span className="course-info-text">{course.assessmentCount || 0} Assessments</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                                    <button 
                                        onClick={handleEnrollClick}
                                        className="btn btn-primary w-100"
                                    >
                                        <i className="bi bi-lock me-2"></i>
                                        Login to Enroll
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AvailableCourses; 