import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // const navigate = useNavigate();

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await courseService.getMyCourses();
            console.log('Courses data:', data);
            console.log('Courses data type:', typeof data);
            console.log('Is Array?', Array.isArray(data));
            setCourses(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            setError('Failed to load courses. Please try again later.');
            console.error('Error fetching courses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            try {
                await courseService.deleteCourse(courseId);
                // Refresh the courses list after deletion
                fetchCourses();
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

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Manage Courses</h2>
                <Link to="/instructor/courses/new" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Create New Course
                </Link>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {courses.length === 0 ? (
                <div className="text-center py-5 bg-light rounded">
                    <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-3 text-muted">You haven't created any courses yet.</p>
                    <Link to="/instructor/courses/new" className="btn btn-outline-primary">
                        Create Your First Course
                    </Link>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {courses.map(course => (
                        <div key={course.courseId} className="col">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{course.title}</h5>
                                    <p className="card-text text-muted">{course.description}</p>
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div className="small text-muted">
                                            <i className="bi bi-people me-1"></i>
                                            {course.enrollmentCount} Enrolled
                                        </div>
                                        <div className="small text-muted">
                                            <i className="bi bi-file-text me-1"></i>
                                            {course.assessmentCount} Assessments
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <small className="text-muted">
                                            <i className="bi bi-calendar me-1"></i>
                                            Created: {new Date(course.lastUpdated).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </small>
                                    </div>
                                </div>
                                <div className="card-footer bg-transparent border-top-0">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Link 
                                            to={`/instructor/courses/${course.courseId}`}
                                            className="btn btn-outline-primary"
                                        >
                                            <i className="bi bi-pencil me-1"></i>
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteCourse(course.courseId)}
                                            className="btn btn-outline-danger"
                                        >
                                            <i className="bi bi-trash me-1"></i>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CourseList;
