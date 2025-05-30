import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import assessmentService from '../../services/assessmentService';
import studentService from '../../services/studentService';

function ResultDetails() {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [assessment, setAssessment] = useState(null);

    useEffect(() => {
        const fetchResultDetails = async () => {
            try {
                setLoading(true);
                // Fetch the result details
                const resultData = await assessmentService.getResultById(resultId);
                console.log('Result Data:', resultData);
                setResult(resultData);

                // Fetch the assessment details to get questions
                const assessmentData = await assessmentService.getAssessmentById(resultData.assessmentId);
                console.log('Assessment Data:', assessmentData);
                setAssessment(assessmentData);
                
                setError('');
            } catch (err) {
                console.error('Error fetching result details:', err);
                setError('Failed to load result details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchResultDetails();
    }, [resultId]);

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
                <button 
                    className="btn btn-primary" 
                    onClick={() => navigate('/student/results')}
                >
                    Back to Results
                </button>
            </div>
        );
    }

    if (!result || !assessment) {
        return (
            <div className="container mt-4">
                <div className="alert alert-info">No result details found.</div>
                <button 
                    className="btn btn-primary" 
                    onClick={() => navigate('/student/results')}
                >
                    Back to Results
                </button>
            </div>
        );
    }

    // Helper function to get the submitted answer for a question
    const getSubmittedAnswer = (questionIndex) => {
        // Find the answer with matching questionIndex
        const answer = submittedAnswers.find(a => a.questionIndex === questionIndex);
        if (!answer) return null;
        
        // Log the raw answer data for debugging
        console.log(`Raw answer data for question ${questionIndex + 1}:`, answer);
        
        if (typeof answer === 'object' && answer !== null) {
            return answer.answer || null;
        }
        return answer;
    };

    // Helper function to check if an answer is correct
    const isAnswerCorrect = (question, submittedAnswer) => {
        if (!submittedAnswer) return false;
        
        // Get the correct answer text
        const correctAnswer = question.options[parseInt(question.correctOptionIndex)];
        
        // Compare the answer texts
        const normalizedSubmitted = String(submittedAnswer).trim().toLowerCase();
        const normalizedCorrect = String(correctAnswer).trim().toLowerCase();
        
        // Log comparison details for debugging
        console.log(`Answer comparison for question "${question.text}":`, {
            submittedAnswer: normalizedSubmitted,
            correctAnswer: normalizedCorrect,
            isMatch: normalizedSubmitted === normalizedCorrect
        });
        
        return normalizedSubmitted === normalizedCorrect;
    };

    // Helper function to determine option styling
    const getOptionStyling = (question, option, optIndex, submittedAnswer) => {
        // Compare the actual text values
        const normalizedOption = String(option).trim().toLowerCase();
        const normalizedSubmitted = submittedAnswer ? String(submittedAnswer).trim().toLowerCase() : '';
        const isUserAnswer = normalizedOption === normalizedSubmitted;
        const isCorrectAnswer = optIndex === parseInt(question.correctOptionIndex);
        
        let className = '';
        let icon = '';
        let labels = [];

        // Case 1: User selected this option
        if (isUserAnswer) {
            labels.push('Your Answer');
            if (isCorrectAnswer) {
                // User selected the correct answer
                className = 'bg-success bg-opacity-25';
                icon = '✓';
            } else {
                // User selected wrong answer
                className = 'bg-danger bg-opacity-25';
                icon = '✗';
            }
        }
        // Case 2: This is the correct answer but user didn't select it
        else if (isCorrectAnswer) {
            className = 'bg-success bg-opacity-25';
            labels.push('Correct Answer');
        }
        // Case 3: Unselected and incorrect option
        else {
            className = 'bg-light';
        }

        return { className, icon, labels };
    };

    // Parse questions and submitted answers
    let questions = [];
    let submittedAnswers = [];
    
    try {
        questions = typeof assessment.questions === 'string' 
            ? JSON.parse(assessment.questions) 
            : (assessment.questions || []);

        // Ensure correctOptionIndex is a number in all questions
        questions = questions.map(q => ({
            ...q,
            correctOptionIndex: parseInt(q.correctOptionIndex)
        }));

        console.log('Parsed questions:', questions);
    } catch (e) {
        console.error('Error parsing questions:', e);
        questions = [];
    }

    try {
        submittedAnswers = typeof result.submittedAnswers === 'string'
            ? JSON.parse(result.submittedAnswers)
            : (result.submittedAnswers || []);
            
        // Sort submitted answers by questionIndex to ensure correct order
        submittedAnswers.sort((a, b) => a.questionIndex - b.questionIndex);
        
        console.log('Parsed and sorted submitted answers:', submittedAnswers);
    } catch (e) {
        console.error('Error parsing submitted answers:', e);
        submittedAnswers = [];
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Result Details</h3>
                <button 
                    className="btn btn-secondary" 
                    onClick={() => navigate('/student/results')}
                >
                    Back to Results
                </button>
            </div>

            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">{assessment.title}</h5>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <strong>Score:</strong> {result.score}%
                        </div>
                        <div className="col-md-4">
                            <strong>Attempt Date:</strong> {new Date(result.attemptDate).toLocaleString()}
                        </div>
                        <div className="col-md-4">
                            <strong>Status:</strong> 
                            <span className={`badge ${result.score >= 70 ? 'bg-success' : 'bg-danger'} ms-2`}>
                                {result.score >= 70 ? 'Passed' : 'Failed'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="questions-list">
                {questions.map((question, index) => {
                    const submittedAnswer = getSubmittedAnswer(index);
                    const isCorrect = isAnswerCorrect(question, submittedAnswer);
                    
                    // Log detailed information for each question
                    console.log(`Question ${index + 1} details:`, {
                        text: question.text,
                        correctOptionIndex: question.correctOptionIndex,
                        correctAnswer: question.options[question.correctOptionIndex],
                        submittedAnswer,
                        submittedAnswerType: typeof submittedAnswer,
                        isCorrect,
                        matchingAnswer: submittedAnswers.find(a => a.questionIndex === index)
                    });
                    
                    return (
                        <div key={index} className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title d-flex justify-content-between align-items-center">
                                    <span>Question {index + 1}</span>
                                    <span className={`badge ${isCorrect ? 'bg-success' : 'bg-danger'}`}>
                                        {isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                </h5>
                                <p className="card-text">{question.text}</p>
                                
                                <div className="options-list">
                                    {question.options.map((option, optIndex) => {
                                        const styling = getOptionStyling(question, option, optIndex, submittedAnswer);
                                        
                                        return (
                                            <div 
                                                key={optIndex} 
                                                className={`option p-2 mb-2 rounded ${styling.className}`}
                                            >
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <span className="me-2">{String.fromCharCode(65 + optIndex)}.</span>
                                                        {styling.icon && <span className="me-2">{styling.icon}</span>}
                                                        {option}
                                                    </div>
                                                    <div>
                                                        {styling.labels.map((label, i) => (
                                                            <span 
                                                                key={i} 
                                                                className={`badge ms-2 ${
                                                                    label === 'Your Answer' 
                                                                        ? (isCorrect ? 'bg-success' : 'bg-danger')
                                                                        : 'bg-primary'
                                                                }`}
                                                            >
                                                                {label}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-3">
                                    <div className="d-flex align-items-center">
                                        <strong className="me-3">Points: {question.points || 1}</strong>
                                        {isCorrect ? (
                                            <span className="text-success">
                                                <i className="bi bi-check-circle-fill me-1"></i>
                                                Full points awarded
                                            </span>
                                        ) : (
                                            <span className="text-danger">
                                                <i className="bi bi-x-circle-fill me-1"></i>
                                                No points awarded
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ResultDetails; 