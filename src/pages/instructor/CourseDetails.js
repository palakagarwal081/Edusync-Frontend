import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import courseService from '../../services/courseService';

function CourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setLoading(true);
                const courseData = await courseService.getCourseById(courseId);
                setCourse(courseData);
            } catch (err) {
                setError('Failed to load course details. Please try again later.');
                console.error('Error fetching course details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            try {
                await courseService.deleteCourse(courseId);
                navigate('/instructor/dashboard');
            } catch (err) {
                setError('Failed to delete course. Please try again later.');
                console.error('Error deleting course:', err);
            }
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    Course not found or you don't have permission to view it.
                </div>
            </div>
        );
    }

    const isOwner = course.instructorId === currentUserId;

    return (
        <div className="container mt-4">
            <div className="mb-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/instructor/dashboard">Dashboard</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Course Details
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                            <h2 className="card-title mb-3">{course.title}</h2>
                            <p className="text-muted mb-4">{course.description}</p>
                        </div>
                        {isOwner && (
                            <div className="d-flex gap-2">
                                <button
                                    onClick={() => navigate(`/instructor/courses/${courseId}/edit`)}
                                    className="btn btn-primary"
                                >
                                    <i className="bi bi-pencil me-2"></i>
                                    Edit Course
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-outline-danger"
                                >
                                    <i className="bi bi-trash me-2"></i>
                                    Delete Course
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <i className="bi bi-people me-2"></i>
                                        Enrollment
                                    </h5>
                                    <p className="card-text display-6">{course.enrollmentCount || 0}</p>
                                    <p className="text-muted">Students enrolled</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <i className="bi bi-file-text me-2"></i>
                                        Assessments
                                    </h5>
                                    <p className="card-text display-6">{course.assessmentCount || 0}</p>
                                    <p className="text-muted">Total assessments</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="d-flex gap-3 mt-4">
                            <Link 
                                to={`/instructor/courses/${courseId}/assessments`}
                                className="btn btn-outline-primary"
                            >
                                <i className="bi bi-file-text me-2"></i>
                                Manage Assessments
                            </Link>
                            <Link 
                                to={`/instructor/courses/${courseId}/students`}
                                className="btn btn-outline-primary"
                            >
                                <i className="bi bi-people me-2"></i>
                                View Students
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="alert alert-danger mt-4" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
}

export default CourseDetails; 