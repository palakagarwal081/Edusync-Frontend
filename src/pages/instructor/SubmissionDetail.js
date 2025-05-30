import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';

function SubmissionDetail() {
    const { resultId } = useParams();
    const [result, setResult] = useState(null);

    useEffect(() => {
        assessmentService.getResultById(resultId).then(setResult);
    }, [resultId]);

    if (!result) return <div className="container mt-4">Loading...</div>;

    return (
        <div className="container mt-4">
            <h4>Submission Detail</h4>
            <p><strong>Student:</strong> {result.userName || result.userId}</p>
            <p><strong>Assessment:</strong> {result.assessmentTitle || 'Quiz'}</p>
            <p><strong>Score:</strong> {result.score}</p>
            <p><strong>Attempt Date:</strong> {new Date(result.attemptDate).toLocaleString()}</p>

            <h5 className="mt-4">Answers:</h5>
            {result.answers?.length > 0 ? (
                <ul className="list-group">
                    {result.answers.map((a, i) => (
                        <li className="list-group-item" key={i}>
                            <strong>Q{i + 1}:</strong> {a.questionText || `Question ${i + 1}`}<br />
                            <strong>Answer:</strong> {a.answer}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No answers available.</p>
            )}
        </div>
    );
}

export default SubmissionDetail;
