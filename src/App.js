import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import InstructorDashboard from './pages/instructor/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import ProtectedRoute from './utils/ProtectedRoute';
import CourseList from './pages/instructor/CourseList';
import CourseForm from './pages/instructor/CourseForm';
import CourseDetails from './pages/instructor/CourseDetails';
import StudentCourseList from './pages/student/CourseList';
import StudentCourseDetail from './pages/student/CourseDetail';
import QuizPage from './pages/student/QuizPage';
import AssessmentList from './pages/instructor/AssessmentList';
import SubmissionsView from './pages/instructor/SubmissionsView';
import AssessmentForm from './pages/instructor/AssessmentForm';
import StudentResults from './pages/student/Results';
import ResultDetails from './pages/student/ResultDetails';
import SubmissionDetail from './pages/instructor/SubmissionDetail';
import AvailableCourses from './pages/AvailableCourses';
import ViewAssessment from './pages/instructor/ViewAssessment';
import ViewStudents from './pages/instructor/ViewStudents';

// Wrapper component to conditionally render Navbar
function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        {/* Root route */}
        <Route path="/" element={<Homepage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirects */}
        <Route path="/instructor-dashboard" element={<Navigate to="/instructor/dashboard" replace />} />

        {/* Protected Routes */}
        {/* Instructor */}
        <Route path="/instructor/dashboard" element={<ProtectedRoute roleRequired="Instructor"><InstructorDashboard /></ProtectedRoute>} />
        <Route path="/instructor/courses" element={<ProtectedRoute roleRequired="Instructor"><CourseList /></ProtectedRoute>} />
        <Route path="/instructor/courses/new" element={<ProtectedRoute roleRequired="Instructor"><CourseForm /></ProtectedRoute>} />
        <Route path="/instructor/courses/:courseId" element={<ProtectedRoute roleRequired="Instructor"><CourseDetails /></ProtectedRoute>} />
        <Route path="/instructor/courses/:courseId/edit" element={<ProtectedRoute roleRequired="Instructor"><CourseForm /></ProtectedRoute>} />
        <Route path="/instructor/courses/:courseId/students" element={<ProtectedRoute roleRequired="Instructor"><ViewStudents /></ProtectedRoute>} />
        <Route path="/instructor/courses/:courseId/assessments" element={<ProtectedRoute roleRequired="Instructor"><AssessmentList /></ProtectedRoute>} />
        <Route path="/instructor/courses/:courseId/assessments/create" element={<ProtectedRoute roleRequired="Instructor"><AssessmentForm /></ProtectedRoute>} />
        <Route path="/instructor/courses/:courseId/assessments/:assessmentId" element={<ProtectedRoute roleRequired="Instructor"><ViewAssessment /></ProtectedRoute>} />
        <Route path="/instructor/courses/:courseId/assessments/:assessmentId/edit" element={<ProtectedRoute roleRequired="Instructor"><AssessmentForm /></ProtectedRoute>} />
        <Route path="/instructor/courses/:courseId/assessments/:assessmentId/submissions" element={<ProtectedRoute roleRequired="Instructor"><SubmissionsView /></ProtectedRoute>} />
        <Route path="/instructor/courses/:courseId/assessments/:assessmentId/submissions/:resultId" element={<ProtectedRoute roleRequired="Instructor"><SubmissionDetail /></ProtectedRoute>} />

        {/* Student */}
        <Route path="/student-dashboard" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/dashboard" element={<ProtectedRoute roleRequired="Student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute roleRequired="Student"><StudentCourseList /></ProtectedRoute>} />
        <Route path="/student/course/:courseId" element={<ProtectedRoute roleRequired="Student"><StudentCourseDetail /></ProtectedRoute>} />
        <Route path="/student/course/:courseId/quiz/:assessmentId" element={<ProtectedRoute roleRequired="Student"><QuizPage /></ProtectedRoute>} />
        <Route path="/student/results" element={<ProtectedRoute roleRequired="Student"><StudentResults /></ProtectedRoute>} />
        <Route path="/student/results/:resultId" element={<ProtectedRoute roleRequired="Student"><ResultDetails /></ProtectedRoute>} />

        {/* Public Routes */}
        <Route path="/available-courses" element={<AvailableCourses />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;