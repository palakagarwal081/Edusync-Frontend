import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';

function SubmissionsView() {
    const { assessmentId } = useParams();
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        assessmentService.getSubmissions(assessmentId).then(setSubmissions);
    }, [assessmentId]);

    return (
        <div className="container mt-4">
            <h4>Submissions</h4>
            {submissions.length === 0 ? (
                <p>No submissions found.</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Score</th>
                            <th>Attempt Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map(s => (
                            <tr key={s.resultId}>
                                <td>{s.userName || s.userId}</td>
                                <td>{s.score} <br /><Link to={`/instructor/results/${s.resultId}`}>View</Link></td>

                                <td>{new Date(s.attemptDate).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default SubmissionsView;
