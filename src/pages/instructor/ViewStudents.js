import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';
import assessmentService from '../../services/assessmentService';

function ViewStudents() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [studentResults, setStudentResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudentsAndResults = async () => {
            try {
                setLoading(true);
                // Fetch enrolled students
                const response = await studentService.getEnrolledStudents(courseId);
                
                // Handle response with $values array
                let studentsData;
                if (response && response.$values) {
                    studentsData = response.$values;
                } else if (Array.isArray(response)) {
                    studentsData = response;
                } else {
                    console.error('Invalid response format:', response);
                    throw new Error('Invalid response format from server');
                }

                // Transform enrollments to get student data
                const students = studentsData.map(student => ({
                    studentId: student.userId,
                    name: student.name || 'Unknown',
                    email: student.email || 'No email',
                    enrollmentDate: student.enrollmentDate
                }));
                setEnrolledStudents(students);

                // Fetch all assessments for the course
                const assessments = await assessmentService.getCourseAssessments(courseId);
                
                // Initialize results map for each student
                const resultsMap = {};
                students.forEach(student => {
                    resultsMap[student.studentId] = [];
                });

                // Fetch results for each assessment
                for (const assessment of assessments) {
                    try {
                        const assessmentResults = await assessmentService.getSubmissions(assessment.assessmentId);
                        
                        // Process results data
                        let resultsData;
                        if (assessmentResults && assessmentResults.$values) {
                            resultsData = assessmentResults.$values;
                        } else if (Array.isArray(assessmentResults)) {
                            resultsData = assessmentResults;
                        } else {
                            resultsData = [];
                        }

                        // Add assessment title to each result and distribute to students
                        resultsData.forEach(result => {
                            const studentId = result.userId;
                            if (resultsMap[studentId]) {
                                resultsMap[studentId].push({
                                    ...result,
                                    assessmentTitle: assessment.title || 'Untitled Assessment'
                                });
                            }
                        });
                    } catch (err) {
                        console.error(`Error fetching results for assessment ${assessment.assessmentId}:`, err);
                        // Continue with other assessments even if one fails
                    }
                }

                setStudentResults(resultsMap);
                setError('');
            } catch (err) {
                console.error('Error fetching students:', err);
                setError(err.message || 'Failed to load students. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentsAndResults();
    }, [courseId]);

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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Enrolled Students</h2>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/instructor/courses/${courseId}`)}
                >
                    Back to Course
                </button>
            </div>

            {enrolledStudents.length === 0 ? (
                <div className="alert alert-info">
                    No students are currently enrolled in this course.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Email</th>
                                <th>Enrollment Date</th>
                                <th>Assessment Results</th>
                                <th>Average Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrolledStudents.map(student => {
                                const results = studentResults[student.studentId] || [];
                                const averageScore = results.length > 0
                                    ? Math.round(results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length)
                                    : 0;

                                return (
                                    <tr key={student.studentId}>
                                        <td>{student.name}</td>
                                        <td>{student.email}</td>
                                        <td>{new Date(student.enrollmentDate).toLocaleDateString()}</td>
                                        <td>
                                            {results.length > 0 ? (
                                                <div className="list-group list-group-flush">
                                                    {results.map(result => (
                                                        <div key={result.resultId} className="list-group-item px-0 py-2">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span className="text-truncate me-2" style={{ maxWidth: '200px' }}>
                                                                    {result.assessmentTitle}
                                                                </span>
                                                                <span className={`badge ${result.score >= 70 ? 'bg-success' : 'bg-danger'}`}>
                                                                    {result.score || 0}%
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted">No assessments taken</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`badge ${averageScore >= 70 ? 'bg-success' : 'bg-danger'}`}>
                                                {averageScore}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ViewStudents; 