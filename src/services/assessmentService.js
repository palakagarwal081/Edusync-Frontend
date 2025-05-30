import API from './apiService';

const assessmentService = {
    getInstructorAssessments: async () => {
        const res = await API.get('/assessments/my');
        return res.data;
    },

    getSubmissions: async (assessmentId) => {
        const res = await API.get(`/Results/byAssessment/${assessmentId}`);
        return res.data;
    },

    createAssessment: async (courseId, assessmentData) => {
        try {
            console.log('Creating assessment for course:', courseId);
            console.log('Assessment data:', assessmentData);
            const data = {
                courseId: courseId,
                title: assessmentData.title,
                questions: JSON.stringify(assessmentData.questions),
                maxScore: assessmentData.questions.reduce((sum, q) => sum + (parseInt(q.points) || 1), 0)
            };
            console.log('Sending assessment data:', data);
            const response = await API.post('/assessments', data);
            console.log('Assessment creation response:', response.data);
            
            // Extract assessment from $values if present, otherwise use the data directly
            const assessment = response.data?.$values ? response.data.$values[0] : response.data;
            return assessment;
        } catch (error) {
            console.error('Error creating assessment:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
            throw new Error(error.response?.data?.message || 'Failed to create assessment');
        }
    },

    getResultById: async (resultId) => {
        const res = await API.get(`/Results/${resultId}`);
        return res.data;
    },

    getAssessments: async () => {
        try {
            const response = await API.get('/assessments');
            return response.data;
        } catch (error) {
            console.error('Error fetching assessments:', error);
            throw error;
        }
    },

    getAssessmentById: async (assessmentId) => {
        try {
            const response = await API.get(`/assessments/${assessmentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching assessment:', error);
            throw error;
        }
    },

    getCourseAssessments: async (courseId) => {
        try {
            const response = await API.get(`/assessments/byCourse/${courseId}`);
            // Extract assessments from $values if present, otherwise try to use the data directly
            const assessments = response.data?.$values || response.data;
            return Array.isArray(assessments) ? assessments : [];
        } catch (error) {
            console.error('Error fetching course assessments:', error);
            throw error;
        }
    },

    updateAssessment: async (assessmentId, assessmentData) => {
        try {
            const data = {
                assessmentId: assessmentId,
                courseId: assessmentData.courseId,
                title: assessmentData.title,
                questions: JSON.stringify(assessmentData.questions),
                maxScore: assessmentData.questions.reduce((sum, q) => sum + (parseInt(q.points) || 1), 0)
            };
            console.log('Updating assessment with data:', data);
            const response = await API.put(`/assessments/${assessmentId}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating assessment:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);
            }
            throw new Error(error.response?.data?.message || 'Failed to update assessment');
        }
    },

    deleteAssessment: async (courseId, assessmentId) => {
        try {
            const response = await API.delete(`/assessments/${assessmentId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting assessment:', error);
            throw error;
        }
    }
};

export default assessmentService;
