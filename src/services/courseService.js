import API from './apiService';

const courseService = {
  getAvailableCourses: async () => {
    try {
      const res = await API.get('/courses');
      const courses = res.data?.$values || res.data;
      return Array.isArray(courses) ? courses : [];
    } catch (error) {
      console.error('Error fetching available courses:', error);
      throw error;
    }
  },
  
  getMyCourses: async () => {
    try {
      console.log('Fetching instructor courses...');
      const res = await API.get('/courses/my');
      console.log('Instructor courses response:', res);
      console.log('Response data:', res.data);
      const courses = res.data?.$values || res.data;
      return Array.isArray(courses) ? courses : [];
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      throw error;
    }
  },
  createCourse: async (courseData) => {
    try {
      console.log('=== Creating Course ===');
      console.log('Course data:', courseData);

      const res = await API.post('/courses', courseData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Course creation response:', res.data);
      return res.data;
    } catch (error) {
      console.error('=== Course Creation Error ===');
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  updateCourse: async (id, courseData) => {
    try {
      console.log('=== Updating Course ===');
      console.log('Course ID:', id);
      console.log('Course data:', courseData);

      const res = await API.put(`/courses/${id}`, courseData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Update response:', res.data);
      return res.data;
    } catch (error) {
      console.error('=== Course Update Error ===');
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  },

  getCourseById: async (courseId) => {
    try {
      console.log('Fetching course details for:', courseId);
      const response = await API.get(`/courses/${courseId}`);
      console.log('Course details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching course details:', error);
      throw error;
    }
  },

  deleteCourse: async (courseId) => {
    try {
      console.log('Deleting course:', courseId);
      const res = await API.delete(`/courses/${courseId}`);
      return res.status === 204;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },
};

export default courseService;
