import API from './apiService';

const studentService = {
    getAllCourses: async () => {
        try {
            console.log('Fetching available courses...');
            const res = await API.get('/courses/available');
            console.log('Raw response:', res);
            console.log('Response status:', res.status);
            console.log('Response headers:', res.headers);
            console.log('Response data:', res.data);
            
            // Handle different response formats
            let courses;
            if (Array.isArray(res.data)) {
                courses = res.data;
            } else if (res.data && Array.isArray(res.data.value)) {
                courses = res.data.value;
            } else if (typeof res.data === 'object' && res.data !== null) {
                // If it's an object response, try to find an array property
                const arrayProperty = Object.values(res.data).find(val => Array.isArray(val));
                courses = arrayProperty || [];
            } else {
                courses = [];
            }
            
            console.log('Processed courses:', courses);
            return courses;
        } catch (error) {
            console.error('Error fetching courses:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                request: error.request,
                config: error.config
            });
            throw error;
        }
    },

    getEnrolledCourses: async () => {
        try {
            const res = await API.get('/enrollments/student');
            console.log('Enrolled courses raw response:', res.data);
            
            // Handle different response formats
            let enrolledCourses;
            if (Array.isArray(res.data)) {
                enrolledCourses = res.data;
            } else if (res.data && res.data.$values) {
                enrolledCourses = res.data.$values;
            } else if (typeof res.data === 'object' && res.data !== null) {
                // If it's an object response, try to find an array property
                const arrayProperty = Object.values(res.data).find(val => Array.isArray(val));
                enrolledCourses = arrayProperty || [];
            } else {
                enrolledCourses = [];
            }
            
            console.log('Processed enrolled courses:', enrolledCourses);
            return enrolledCourses;
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            throw error;
        }
    },

    enrollInCourse: async (courseId) => {
        try {
            console.log('Enrolling in course:', courseId);
            const response = await API.post('/enrollments', { CourseId: courseId });
            console.log('Enrollment response:', response.data);
            
            return {
                success: true,
                message: 'Successfully enrolled in course',
                enrollment: response.data,
                isEnrolled: true
            };
        } catch (error) {
            console.error('Error enrolling in course:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                
                if (error.response.status === 409) {
                    // If already enrolled, return success with isEnrolled true
                    return {
                        success: true,
                        message: 'Already enrolled in course',
                        isEnrolled: true
                    };
                }
                if (error.response.status === 404) {
                    throw new Error('Course not found');
                }
            }
            throw new Error(error.response?.data?.message || 'Server error occurred while enrolling in course');
        }
    },

    checkEnrollment: async (courseId) => {
        try {
            const res = await API.get(`/enrollments/check/${courseId}`);
            return res.data;
        } catch (error) {
            console.error('Error checking enrollment:', error);
            return false;
        }
    },

    getCourseDetails: async (courseId) => {
        try {
            const res = await API.get(`/courses/${courseId}`);
            return res.data;
        } catch (error) {
            console.error('Error fetching course details:', error);
            throw error;
        }
    },

    getAssessments: async (courseId) => {
        try {
            console.log('Fetching assessments for course:', courseId);
            const res = await API.get(`/assessments/byCourse/${courseId}`);
            console.log('Raw assessment response:', res);
            console.log('Assessment response data:', res.data);
            
            // Handle different response formats
            let assessments;
            if (Array.isArray(res.data)) {
                assessments = res.data;
            } else if (res.data && Array.isArray(res.data.value)) {
                assessments = res.data.value;
            } else if (typeof res.data === 'object' && res.data !== null) {
                // If it's an object response, try to find an array property
                const arrayProperty = Object.values(res.data).find(val => Array.isArray(val));
                assessments = arrayProperty || [];
            } else {
                assessments = [];
            }
            
            console.log('Processed assessments:', assessments);
            return assessments;
        } catch (error) {
            console.error('Error fetching assessments:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                request: error.request,
                config: error.config
            });
            throw error;
        }
    },

    submitQuiz: async (assessmentId, resultPayload) => {
        try {
            console.log('Submitting quiz for assessment:', assessmentId);
            console.log('Result payload:', resultPayload);
            
            const response = await API.post('/results', {
                assessmentId,
                submittedAnswers: JSON.stringify(resultPayload.answers),
                score: resultPayload.score
            });
            console.log('Quiz submission response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Quiz submission error:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
                
                if (error.response.status === 404) {
                    throw new Error('Assessment not found');
                }
                if (error.response.status === 400) {
                    throw new Error(error.response.data?.message || 'Invalid submission data');
                }
            }
            throw new Error(error.response?.data?.message || 'Failed to submit quiz');
        }
    },

    getMyResults: async () => {
        try {
            console.log('Fetching student results...');
            const res = await API.get('/results/my');
            console.log('Raw results response:', res);
            console.log('Results response data:', res.data);
            
            // Handle different response formats
            let results;
            if (Array.isArray(res.data)) {
                results = res.data;
            } else if (res.data && Array.isArray(res.data.value)) {
                results = res.data.value;
            } else if (typeof res.data === 'object' && res.data !== null) {
                // If it's an object response, try to find an array property
                const arrayProperty = Object.values(res.data).find(val => Array.isArray(val));
                results = arrayProperty || [];
            } else {
                results = [];
            }
            
            console.log('Processed results:', results);
            return results;
        } catch (error) {
            console.error('Error fetching results:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                request: error.request,
                config: error.config
            });
            throw error;
        }
    },

    getEnrolledStudents: async (courseId) => {
        try {
            console.log('Fetching enrolled students for course:', courseId);
            const response = await API.get(`/enrollments/course/${courseId}/students`);
            console.log('Enrolled students response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching enrolled students:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
            throw new Error(error.response?.data?.message || 'Failed to fetch enrolled students');
        }
    },

    getAssessmentResults: async (courseId, assessmentId) => {
        try {
            const response = await API.get(`/results/course/${courseId}/assessment/${assessmentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching assessment results:', error);
            throw error;
        }
    }
}

export default studentService;