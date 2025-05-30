import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import './ViewAssessment.css';

function ViewAssessment() {
    const { courseId, assessmentId } = useParams();
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // First fetch the assessment data
                const assessmentData = await assessmentService.getAssessmentById(assessmentId);

                // Parse the questions JSON string if it exists
                if (assessmentData.questions) {
                    assessmentData.questions = JSON.parse(assessmentData.questions);
                }

                // Calculate max score from questions if not provided
                if (!assessmentData.maxScore && assessmentData.questions) {
                    assessmentData.maxScore = assessmentData.questions.reduce(
                        (sum, q) => sum + (parseInt(q.points) || 1),
                        0
                    );
                }

                setAssessment(assessmentData);

                // Then fetch submissions
                try {
                    const submissionsData = await assessmentService.getSubmissions(assessmentId);
                    setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
                } catch (submissionErr) {
                    console.warn('Error fetching submissions:', submissionErr);
                    // Don't set error state here, just show empty submissions
                    setSubmissions([]);
                }
            } catch (err) {
                console.error('Error fetching assessment data:', err);
                if (err.response?.status === 404) {
                    setError('Assessment not found. It may have been deleted or you may not have permission to view it.');
                } else if (err.response?.status === 403) {
                    setError('You do not have permission to view this assessment.');
                } else {
                    setError('Failed to load assessment data. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [assessmentId]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
            try {
                await assessmentService.deleteAssessment(courseId, assessmentId);
                navigate(`/instructor/courses/${courseId}/assessments`);
            } catch (err) {
                setError('Failed to delete assessment. Please try again later.');
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

    if (!assessment) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning" role="alert">
                    Assessment not found.
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">{assessment.title}</h2>
                    <p className="text-muted mb-0">{assessment.description}</p>
                </div>
                <div className="d-flex gap-2">
                    <Link
                        to={`/instructor/courses/${courseId}/assessments/${assessmentId}/edit`}
                        className="btn btn-primary"
                    >
                        <i className="bi bi-pencil me-2"></i>
                        Edit Assessment
                    </Link>
                    <button
                        className="btn btn-danger"
                        onClick={handleDelete}
                    >
                        <i className="bi bi-trash me-2"></i>
                        Delete Assessment
                    </button>
                    <Link
                        to={`/instructor/courses/${courseId}/assessments`}
                        className="btn btn-outline-secondary"
                    >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Assessments
                    </Link>
                </div>
            </div>

            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Assessment Details</h5>
                            <div className="assessment-info">
                                <div className="info-item">
                                    <i className="bi bi-star me-2"></i>
                                    <span>Max Score: {assessment.maxScore || 0} points</span>
                                </div>
                                <div className="info-item">
                                    <i className="bi bi-people me-2"></i>
                                    <span>Total Submissions: {submissions.length}</span>
                                </div>
                                {submissions.length > 0 && (
                                    <div className="info-item">
                                        <i className="bi bi-graph-up me-2"></i>
                                        <span>Average Score: {
                                            (submissions.reduce((sum, sub) => sum + (sub.score || 0), 0) / submissions.length).toFixed(1)
                                        } points</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Questions</h5>
                            {assessment.questions && assessment.questions.length > 0 ? (
                                <div className="questions-list">
                                    {assessment.questions.map((question, index) => (
                                        <div key={index} className="question-item mb-4">
                                            <div className="question-header">
                                                <h6 className="mb-2">Question {index + 1}</h6>
                                                <span className="badge bg-primary">Points: {question.points || 1}</span>
                                            </div>
                                            <p className="question-text">{question.text}</p>
                                            <div className="options-list">
                                                {question.options.map((option, optionIndex) => (
                                                    <div
                                                        key={optionIndex}
                                                        className={`option-item ${optionIndex === question.correctOptionIndex ? 'correct' : ''}`}
                                                    >
                                                        <span className="option-number">{optionIndex + 1}.</span>
                                                        <span className="option-text">{option}</span>
                                                        {optionIndex === question.correctOptionIndex && (
                                                            <i className="bi bi-check-circle-fill text-success ms-2"></i>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted mb-0">No questions added to this assessment yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewAssessment; 