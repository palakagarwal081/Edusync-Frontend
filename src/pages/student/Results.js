import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';

function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const data = await studentService.getMyResults();
                setResults(data);
                setError('');
            } catch (err) {
                console.error('Error fetching results:', err);
                setError('Failed to load results. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

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

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Your Assessment Results</h3>
            {results.length === 0 ? (
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    You haven't taken any assessments yet.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-light">
                            <tr>
                                <th>Assessment</th>
                                <th>Score</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(result => (
                                <tr key={result.resultId}>
                                    <td>{result.assessmentTitle || 'Untitled Assessment'}</td>
                                    <td>{result.score}%</td>
                                    <td>
                                        <span className={`badge ${result.score >= 70 ? 'bg-success' : 'bg-danger'}`}>
                                            {result.score >= 70 ? 'Passed' : 'Failed'}
                                        </span>
                                    </td>
                                    <td>{new Date(result.attemptDate).toLocaleString()}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => navigate(`/student/results/${result.resultId}`)}
                                        >
                                            <i className="bi bi-eye me-1"></i>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Results;
