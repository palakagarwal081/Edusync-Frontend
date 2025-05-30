import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import studentService from '../../services/studentService';
import EnrollmentService from '../../services/EnrollmentService';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function CourseDetail() {
    const { courseId } = useParams();
    const [course, setCourse] = useState({});
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);
    const [error, setError] = useState('');
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [showPdf, setShowPdf] = useState(false);
    const [pdfError, setPdfError] = useState('');

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                // Fetch course details
                const courseData = await studentService.getCourseDetails(courseId);
                console.log('Raw Course Data:', courseData); // Debug log
                
                // Check if courseContent exists and is not empty
                if (courseData.courseContent) {
                    console.log('Course Content URL found:', courseData.courseContent);
                } else {
                    console.log('No Course Content URL found in data');
                }
                
                setCourse(courseData);

                // Fetch assessments
                const assessmentsData = await studentService.getAssessments(courseId);
                setAssessments(assessmentsData);

                // Check enrollment status
                const user = JSON.parse(localStorage.getItem('user'));
                const userId = user?.userId;
                console.log('User ID:', userId);
                
                const { success, isEnrolled } = await EnrollmentService.checkEnrollment(courseId, userId);
                console.log('Enrollment check:', { success, isEnrolled });
                setEnrolled(isEnrolled);

                // Debug log for course materials visibility conditions
                console.log('Course Materials Visibility Check:', {
                    enrolled: isEnrolled,
                    hasCourseContent: Boolean(courseData.courseContent),
                    courseContent: courseData.courseContent,
                    shouldShow: isEnrolled && Boolean(courseData.courseContent)
                });

            } catch (err) {
                console.error('Error loading course data:', err);
                setError('Failed to load course data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

    // Debug effect to log state changes
    useEffect(() => {
        console.log('State updated:', {
            enrolled,
            hasCourseContent: Boolean(course.courseContent),
            showPdf,
            pdfError
        });
    }, [enrolled, course.courseContent, showPdf, pdfError]);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPdfError('');
        console.log('PDF loaded successfully with', numPages, 'pages'); // Debug log
    };

    const onDocumentLoadError = (error) => {
        console.error('Error loading PDF:', error);
        setPdfError('Failed to load the PDF. Please try again later.');
    };

    const handlePrevPage = () => {
        setPageNumber(prevPage => Math.max(prevPage - 1, 1));
    };

    const handleNextPage = () => {
        setPageNumber(prevPage => Math.min(prevPage + 1, numPages));
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Debug log for rendering conditions
    console.log('Rendering conditions:', {
        enrolled,
        courseContent: course.courseContent,
        shouldShowMaterials: enrolled && course.courseContent
    });

    return (
        <div className="container mt-4">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="card-title mb-3">{course.title}</h2>
                    <p className="card-text text-muted">{course.description}</p>
                    <p className="text-muted">
                        <i className="bi bi-person me-1"></i>
                        Instructor: {course.instructorName || 'Unknown'}
                    </p>
                </div>
            </div>

            {/* Course Materials Section */}
            {enrolled && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="card-title mb-0">Course Materials</h4>
                            {course.courseContent && (
                                <div>
                                    <a 
                                        href={course.courseContent}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                    >
                                        <i className="bi bi-file-pdf me-2"></i>
                                        View PDF
                                    </a>
                                </div>
                            )}
                        </div>
                        {!course.courseContent && (
                            <p className="text-muted">
                                <i className="bi bi-info-circle me-2"></i>
                                No course materials have been uploaded yet.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Video Content Section */}
            {enrolled && course.mediaUrl && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h4 className="card-title mb-3">Course Video</h4>
                        <div className="ratio ratio-16x9">
                            <iframe
                                src={getEmbedUrl(course.mediaUrl)}
                                title="Course Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* Not Enrolled Message */}
            {!enrolled && (
                <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Please enroll in this course to access the course materials and video content.
                </div>
            )}

            {/* Assessments Section */}
            {enrolled && (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h4 className="card-title mb-3">Course Assessments</h4>
                        {assessments.length === 0 ? (
                            <div className="text-center py-4">
                                <i className="bi bi-journal-text text-muted" style={{ fontSize: '3rem' }}></i>
                                <p className="mt-3 text-muted">No assessments available for this course yet.</p>
                            </div>
                        ) : (
                            <div className="list-group">
                                {assessments.map(assessment => (
                                    <div key={assessment.assessmentId} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5 className="mb-1">{assessment.title}</h5>
                                                <p className="text-muted mb-0">{assessment.description}</p>
                                            </div>
                                            <Link 
                                                to={`/student/course/${courseId}/quiz/${assessment.assessmentId}`}
                                                className="btn btn-primary"
                                            >
                                                <i className="bi bi-pencil-square me-1"></i>
                                                Take Assessment
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function getEmbedUrl(url) {
    if (!url) return '';
    
    // Handle YouTube URLs
    if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Return original URL for non-YouTube videos
    return url;
}

export default CourseDetail;
