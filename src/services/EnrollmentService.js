import API from '../services/apiService';


const EnrollmentService = {
    // Enroll a student in a course
    enrollStudent: async (courseId, userId) => {
        try {
            const response = await API.post('/enrollments', {
                courseId,
                userId
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Enrollment failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || 'Failed to enroll in course'
            };
        }
    },

    // Get all enrollments for a specific user
    getUserEnrollments: async (userId) => {
        try {
            console.log('Fetching user enrollments...');
            const response = await API.get('/enrollments/student');
            console.log('Raw enrollments response:', response);
            console.log('Enrollments response data:', response.data);
            
            // Handle different response formats
            let enrollments;
            if (Array.isArray(response.data)) {
                enrollments = response.data;
            } else if (response.data && Array.isArray(response.data.value)) {
                enrollments = response.data.value;
            } else if (typeof response.data === 'object' && response.data !== null) {
                // If it's an object response, try to find an array property
                const arrayProperty = Object.values(response.data).find(val => Array.isArray(val));
                enrollments = arrayProperty || [];
            } else {
                enrollments = [];
            }
            
            console.log('Processed enrollments:', enrollments);
            return {
                success: true,
                enrollments: enrollments
            };
        } catch (error) {
            console.error('Failed to fetch user enrollments:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response,
                request: error.request,
                config: error.config
            });
            return {
                success: false,
                error: error.response?.data || 'Failed to fetch enrollments'
            };
        }
    },

    // Get all enrollments for a specific course
    getCourseEnrollments: async (courseId) => {
        try {
            const response = await API.get(`/enrollments/course/${courseId}`);
            return {
                success: true,
                enrollments: response.data
            };
        } catch (error) {
            console.error('Failed to fetch course enrollments:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || 'Failed to fetch course enrollments'
            };
        }
    },

    // Get a specific enrollment by ID
    getEnrollment: async (enrollmentId) => {
        try {
            const response = await API.get(`/enrollments/${enrollmentId}`);
            return {
                success: true,
                enrollment: response.data
            };
        } catch (error) {
            console.error('Failed to fetch enrollment:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || 'Failed to fetch enrollment'
            };
        }
    },

    // Mark an enrollment as completed
    markAsCompleted: async (enrollmentId) => {
        try {
            const response = await API.patch(`/enrollments/${enrollmentId}/complete`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Failed to mark as completed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || 'Failed to update enrollment'
            };
        }
    },

    // Delete an enrollment
    deleteEnrollment: async (enrollmentId) => {
        try {
            const response = await API.delete(`/enrollments/${enrollmentId}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Failed to delete enrollment:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data || 'Failed to delete enrollment'
            };
        }
    },

    // Check if a user is enrolled in a course
    checkEnrollment: async (courseId, userId) => {
        try {
            console.log('Checking enrollment for courseId:', courseId, 'userId:', userId);
            const { success, enrollments } = await EnrollmentService.getUserEnrollments(userId);
            console.log('Got enrollments:', enrollments);
            
            if (success) {
                const isEnrolled = enrollments.some(enrollment => {
                    console.log('Comparing:', {
                        enrollmentCourseId: enrollment.courseId,
                        courseId: courseId,
                        isMatch: enrollment.courseId.toString() === courseId.toString()
                    });
                    return enrollment.courseId.toString() === courseId.toString();
                });
                
                console.log('Enrollment check result:', isEnrolled);
                return {
                    success: true,
                    isEnrolled
                };
            }
            return {
                success: false,
                error: 'Failed to check enrollment status'
            };
        } catch (error) {
            console.error('Failed to check enrollment:', error);
            return {
                success: false,
                error: 'Failed to check enrollment status'
            };
        }
    }
};

export default EnrollmentService;