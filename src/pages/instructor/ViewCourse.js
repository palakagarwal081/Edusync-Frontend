import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseById } from '../../redux/actions/courseActions';
import { getEnrolledStudents } from '../../redux/actions/studentActions';
import { getCourse } from '../../redux/reducers/courseReducer';
import { getEnrolledStudents as getEnrolledStudentsReducer } from '../../redux/reducers/studentReducer';
import { getCourseId } from '../../redux/reducers/courseReducer';
import { getEnrolledStudentsId } from '../../redux/reducers/studentReducer';
import courseService from '../../services/courseService';
import studentService from '../../services/studentService';
import assessmentService from '../../services/assessmentService';

const ViewCourse = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const courseId = useSelector(getCourseId);
    const enrolledStudents = useSelector(getEnrolledStudentsReducer);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [enrollmentCount, setEnrollmentCount] = useState(0);

    useEffect(() => {
        const fetchCourseAndEnrollments = async () => {
            try {
                setLoading(true);
                // Fetch course details
                const courseData = await courseService.getCourseById(courseId);
                setCourse(courseData);

                // Fetch enrolled students
                const students = await studentService.getEnrolledStudents(courseId);
                setEnrollmentCount(students.length);
                setError('');
            } catch (err) {
                setError('Failed to load course details. Please try again later.');
                console.error('Error fetching course:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndEnrollments();
    }, [courseId]);

    const handleDeleteAssessment = async (assessmentId) => {
        if (window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
            try {
                await assessmentService.deleteAssessment(assessmentId);
                // Update the course state to remove the deleted assessment
                setCourse(prevCourse => ({
                    ...prevCourse,
                    assessments: prevCourse.assessments.filter(a => a.assessmentId !== assessmentId)
                }));
            } catch (err) {
                setError('Failed to delete assessment. Please try again.');
                console.error('Error deleting assessment:', err);
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

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning" role="alert">
                    Course not found.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>{course.title}</h2>
                <div>
                    <Link
                        to={`/instructor/courses/${courseId}/students`}
                        className="btn btn-outline-primary me-2"
                    >
                        <i className="bi bi-people me-2"></i>
                        View Students ({enrollmentCount})
                    </Link>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/instructor/courses')}
                    >
                        Back to Courses
                    </button>
                </div>
            </div>

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="card-title">Course Details</h5>
                    <p className="card-text">{course.description}</p>
                    <div className="row">
                        <div className="col-md-4">
                            <p><strong>Duration:</strong> {course.courseDuration} minutes</p>
                        </div>
                        <div className="col-md-4">
                            <p><strong>Difficulty:</strong> {course.difficultyLevel}</p>
                        </div>
                        <div className="col-md-4">
                            <p><strong>Created:</strong> {new Date(course.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</p>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-6">
                            <p><strong>Enrolled Students:</strong> {enrollmentCount}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Assessments:</strong> {course.assessmentCount || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">Assessments</h5>
                        <Link
                            to={`/instructor/courses/${courseId}/assessments/create`}
                            className="btn btn-primary btn-sm"
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Create Assessment
                        </Link>
                    </div>
                    {course.assessments && course.assessments.length > 0 ? (
                        <div className="list-group">
                            {course.assessments.map(assessment => (
                                <div key={assessment.assessmentId} className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1">{assessment.title}</h6>
                                            <p className="mb-1 text-muted">{assessment.description}</p>
                                            <small className="text-muted">
                                                Duration: {assessment.duration} minutes | 
                                                Passing Score: {assessment.passingScore}%
                                            </small>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <Link
                                                to={`/instructor/courses/${courseId}/assessments/${assessment.assessmentId}/edit`}
                                                className="btn btn-outline-primary btn-sm"
                                            >
                                                <i className="bi bi-pencil me-1"></i>
                                                Edit
                                            </Link>
                                            <Link
                                                to={`/instructor/courses/${courseId}/assessments/${assessment.assessmentId}`}
                                                className="btn btn-outline-secondary btn-sm"
                                            >
                                                <i className="bi bi-eye me-1"></i>
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteAssessment(assessment.assessmentId)}
                                                className="btn btn-outline-danger btn-sm"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted mb-0">No assessments created yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewCourse; 