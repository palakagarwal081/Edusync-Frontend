import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import courseService from '../../services/courseService';

function CourseForm() {
    const { courseId } = useParams();
    const isEdit = courseId && courseId !== 'new';
    const [form, setForm] = useState({ 
        title: '', 
        description: '', 
        mediaUrl: '',
        courseContent: '',
        instructorId: JSON.parse(localStorage.getItem('user'))?.userId || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isEdit) {
            courseService.getCourseById(courseId)
                .then((res) => {
                    console.log('Loading existing course data:', res);
                    const courseContent = res.courseContent || '';
                    setForm({
                        ...res,
                        courseContent: courseContent,
                        instructorId: res.instructorId || JSON.parse(localStorage.getItem('user'))?.userId
                    });
                })
                .catch((err) => {
                    console.error('Error loading course:', err);
                    setError('Failed to load course details. Please try again.');
                });
        }
    }, [isEdit, courseId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccessMessage('');
    };

    const validateForm = () => {
        if (!form.title?.trim()) {
            setError('Title is required');
            return false;
        }
        if (!form.description?.trim()) {
            setError('Description is required');
            return false;
        }
        if (!form.mediaUrl?.trim()) {
            setError('Media URL is required');
            return false;
        }

        // Validate URLs
        try {
            if (form.mediaUrl) new URL(form.mediaUrl);
            if (form.courseContent) new URL(form.courseContent);
        } catch (e) {
            setError('Please enter valid URLs');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            
            const courseData = {
                courseId: isEdit ? courseId : undefined,
                title: form.title?.trim(),
                description: form.description?.trim(),
                mediaUrl: form.mediaUrl?.trim(),
                courseContent: form.courseContent?.trim(),
                instructorId: form.instructorId
            };

            let response;
            if (isEdit) {
                response = await courseService.updateCourse(courseId, courseData);
            } else {
                response = await courseService.createCourse(courseData);
            }

            setSuccessMessage('Course saved successfully!');
            setTimeout(() => {
                navigate('/instructor/courses');
            }, 2000);
        } catch (error) {
            console.error('Error saving course:', error);
            setError(error.message || 'Failed to save course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 col-md-8">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h3 className="card-title mb-4">{isEdit ? 'Edit' : 'Create'} Course</h3>
                    
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-3">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={form.title || ''}
                                onChange={handleChange}
                                placeholder="Enter course title"
                                required
                            />
                        </div>
                        
                        <div className="form-group mb-3">
                            <label className="form-label">Description</label>
                            <textarea
                                name="description"
                                className="form-control"
                                value={form.description || ''}
                                onChange={handleChange}
                                placeholder="Enter course description"
                                rows="4"
                                required
                            />
                        </div>
                        
                        <div className="form-group mb-3">
                            <label className="form-label">Video URL</label>
                            <input
                                type="url"
                                name="mediaUrl"
                                className="form-control"
                                value={form.mediaUrl || ''}
                                onChange={handleChange}
                                placeholder="Enter video URL (YouTube or direct video link)"
                                required
                            />
                            <small className="text-muted">
                                Enter a YouTube video URL or direct video file URL
                            </small>
                        </div>
                        
                        <div className="form-group mb-3">
                            <label className="form-label">Course Materials URL</label>
                            <input
                                type="url"
                                name="courseContent"
                                className="form-control"
                                value={form.courseContent || ''}
                                onChange={handleChange}
                                placeholder="Enter URL to your course materials"
                            />
                            <small className="text-muted">
                                Enter the URL to your course materials (e.g., PDF document)
                            </small>
                            {form.courseContent && (
                                <div className="mt-2">
                                    <a 
                                        href={form.courseContent}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            try {
                                                new URL(form.courseContent);
                                                window.open(form.courseContent, '_blank');
                                            } catch (err) {
                                                setError('Invalid URL format');
                                            }
                                        }}
                                    >
                                        Test Link
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="d-flex gap-2 justify-content-end">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/instructor/courses')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>Save Course</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CourseForm;
