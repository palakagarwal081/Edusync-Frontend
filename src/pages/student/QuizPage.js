import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../services/apiService'; // Centralized Axios instance
import studentService from '../../services/studentService';

function QuizPage() {
    const { assessmentId } = useParams();
    const [assessment, setAssessment] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [results, setResults] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    useEffect(() => {
        const loadAssessment = async () => {
            try {
                setLoading(true);
                const res = await API.get(`/assessments/${assessmentId}`);
                const raw = res.data;
                console.log('Raw assessment data:', raw);
                
                // Parse questions if they are stored as a string
                let parsedQuestions = [];
                if (raw.questions) {
                    try {
                        // First try to parse if it's a string
                        let questionsData = typeof raw.questions === 'string'
                            ? JSON.parse(raw.questions)
                            : raw.questions;

                        // If it's an array, use it directly
                        if (Array.isArray(questionsData)) {
                            parsedQuestions = questionsData;
                        } 
                        // If it's an object with a questions array, use that
                        else if (questionsData.questions && Array.isArray(questionsData.questions)) {
                            parsedQuestions = questionsData.questions;
                        }
                        // If it's a single question object, wrap it in an array
                        else if (typeof questionsData === 'object') {
                            parsedQuestions = [questionsData];
                        }

                        console.log('Parsed questions:', parsedQuestions);
                    } catch (parseError) {
                        console.error('Error parsing questions:', parseError);
                        parsedQuestions = [];
                    }
                }

                // Ensure questions have the correct structure
                parsedQuestions = parsedQuestions.map(q => {
                    // Log the raw question data to see what we're working with
                    console.log('Raw question data:', q);
                    
                    // Find the correct answer from the options
                    let correctAnswer = '';
                    if (q.correctOptionIndex !== undefined && Array.isArray(q.options)) {
                        correctAnswer = q.options[q.correctOptionIndex];
                    } else if (q.correctOption !== undefined) {
                        correctAnswer = q.correctOption;
                    } else if (q.answer !== undefined) {
                        correctAnswer = q.answer;
                    }

                    const question = {
                        question: q.question || q.text || '',
                        options: Array.isArray(q.options) ? q.options : [],
                        answer: correctAnswer
                    };
                    
                    // Log the processed question to verify the answer is set
                    console.log('Processed question:', {
                        question: question.question,
                        options: question.options,
                        answer: question.answer,
                        rawAnswer: q.answer,
                        rawCorrectOption: q.correctOption,
                        rawCorrectOptionIndex: q.correctOptionIndex
                    });
                    
                    return question;
                });

                setAssessment(raw);
                setQuestions(parsedQuestions);
                setError('');
            } catch (err) {
                console.error('Failed to load assessment:', err);
                setError('Failed to load assessment. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadAssessment();
    }, [assessmentId]);

    const handleChange = (qIndex, selectedOption) => {
        setAnswers((prev) => ({ ...prev, [qIndex]: selectedOption }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (questions.length === 0) {
            setError('No questions available in this assessment.');
            return;
        }

        // Calculate score
        let correct = 0;
        questions.forEach((q, i) => {
            // Convert both answers to strings and normalize them for comparison
            const selectedAnswer = String(answers[i] || '').trim().toLowerCase();
            const correctAnswer = String(q.answer || '').trim().toLowerCase();
            
            console.log(`Question ${i + 1} comparison:`, {
                question: q.question,
                selectedAnswer,
                correctAnswer,
                isCorrect: selectedAnswer === correctAnswer,
                options: q.options,
                rawAnswer: q.answer,
                questionData: q
            });
            
            if (selectedAnswer === correctAnswer) {
                correct++;
            }
        });
        
        const total = questions.length;
        const calculatedScore = Math.round((correct / total) * 100);
        setScore(calculatedScore);
        setCorrectAnswers(correct);

        // Submit result to backend
        const resultPayload = {
            assessmentId,
            answers: Object.entries(answers).map(([index, answer]) => ({
                questionIndex: parseInt(index),
                answer: String(answer || '')
            })),
            score: calculatedScore
        };

        try {
            const ok = await studentService.submitQuiz(assessmentId, resultPayload);
            if (ok) {
                setSubmitted(true);
            }
        } catch (err) {
            setError('Failed to submit assessment. Please try again.');
            console.error('Error submitting assessment:', err);
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
            <h4>{assessment.title} - Quiz</h4>
            {questions.length === 0 ? (
                <div className="alert alert-warning" role="alert">
                    No questions available in this assessment.
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {questions.map((q, i) => (
                        <div key={i} className="mb-4">
                            <strong>{i + 1}. {q.question}</strong>
                            <div className="ms-3 mt-2">
                                {Array.isArray(q.options) && q.options.map((option, j) => {
                                    const normalizedOption = String(option).trim().toLowerCase();
                                    const normalizedAnswer = String(q.answer).trim().toLowerCase();
                                    const isSelected = String(answers[i] || '').trim().toLowerCase() === normalizedOption;
                                    const isCorrect = submitted && normalizedOption === normalizedAnswer;
                                    const isWrong = submitted && isSelected && normalizedOption !== normalizedAnswer;

                                    console.log(`Option ${j + 1} for Question ${i + 1}:`, {
                                        option,
                                        normalizedOption,
                                        normalizedAnswer,
                                        isSelected,
                                        isCorrect,
                                        isWrong
                                    });

                                    return (
                                        <div key={j} className={`form-check ${isCorrect ? 'bg-success text-white p-2 rounded' : isWrong ? 'bg-danger text-white p-2 rounded' : ''}`}>
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name={`question-${i}`}
                                                value={option}
                                                checked={isSelected}
                                                onChange={() => handleChange(i, option)}
                                                disabled={submitted}
                                            />
                                            <label className="form-check-label">{option}</label>
                                            {submitted && (
                                                <span className="ms-2">
                                                    {isCorrect && <i className="bi bi-check-circle-fill"></i>}
                                                    {isWrong && <i className="bi bi-x-circle-fill"></i>}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    {!submitted && (
                        <button className="btn btn-primary" type="submit">
                            Submit Quiz
                        </button>
                    )}
                    {submitted && (
                        <div className="alert alert-info mt-4">
                            <h5>Quiz Submitted Successfully!</h5>
                            <p>Your Score: <strong>{score}%</strong></p>
                            <p>Correct Answers: {correctAnswers} out of {questions.length}</p>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
}

export default QuizPage;
