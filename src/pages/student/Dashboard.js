// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import studentService from '../../services/studentService';
// import courseService from "../../services/courseService";

// function StudentDashboard() {
//     const [userName, setUserName] = useState('');
//     const [courses, setCourses] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [enrollingCourseId, setEnrollingCourseId] = useState(null);
//     const navigate = useNavigate();
//     const isLoggedIn = localStorage.getItem('token') !== null;

//     // Move fetchCourses outside useEffect so it can be called from other functions
//     const fetchCourses = async () => {
//         try {
//             console.log('Starting to fetch courses...');
//             setLoading(true);
//             const [availableCourses, enrolledCourses] = await Promise.all([
//                 studentService.getAllCourses(),
//                 studentService.getEnrolledCourses()
//             ]);

//             console.log('Available courses:', availableCourses);
//             console.log('Enrolled courses:', enrolledCourses);

//             // Create a map of enrolled course IDs for quick lookup
//             const enrolledCourseIds = new Set(enrolledCourses.map(ec => ec.courseId));
//             console.log('Enrolled course IDs:', Array.from(enrolledCourseIds));

//             // Mark courses as enrolled if they exist in enrolledCourses
//             const coursesWithEnrollmentStatus = availableCourses.map(course => ({
//                 ...course,
//                 isEnrolled: enrolledCourseIds.has(course.courseId)
//             }));

//             console.log('Courses with enrollment status:', coursesWithEnrollmentStatus);
//             setCourses(coursesWithEnrollmentStatus);
//             setError('');
//         } catch (err) {
//             console.error('Error in fetchCourses:', err);
//             console.error('Error details:', {
//                 message: err.message,
//                 response: err.response,
//                 request: err.request
//             });
//             setError(err.response?.data?.message || 'Failed to load courses. Please try again later.');
//             setCourses([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         // Get user's name from localStorage
//         const name = localStorage.getItem('userName');
//         setUserName(name || 'Student'); // Fallback to 'Student' if name is not available

//         // Fetch courses when component mounts
//         fetchCourses();
//     }, []);

//     // Add focus event listener to refresh courses when tab becomes active
//     useEffect(() => {
//         const handleFocus = () => {
//             if (document.visibilityState === 'visible') {
//                 console.log('Tab became active, refreshing courses...');
//                 fetchCourses();
//             }
//         };

//         document.addEventListener('visibilitychange', handleFocus);
//         window.addEventListener('focus', fetchCourses);

//         return () => {
//             document.removeEventListener('visibilitychange', handleFocus);
//             window.removeEventListener('focus', fetchCourses);
//         };
//     }, []);

//     const handleEnroll = async (courseId) => {
//         if (!isLoggedIn) {
//             navigate('/login');
//             return;
//         }

//         try {
//             setEnrollingCourseId(courseId);
//             const response = await studentService.enrollInCourse(courseId);
            
//             // Update the course's enrollment status in the UI
//             setCourses(prevCourses => 
//                 prevCourses.map(course => 
//                     course.courseId === courseId 
//                         ? { 
//                             ...course, 
//                             isEnrolled: true
//                         }
//                         : course
//                 )
//             );
            
//             // Show appropriate message based on enrollment status
//             if (response.message === 'Already enrolled in course') {
//                 alert('You are already enrolled in this course. Click the course to view its content.');
//             } else {
//                 alert('Successfully enrolled in the course!');
//             }

//             // Refresh the courses list to ensure everything is up to date
//             await fetchCourses();
//         } catch (err) {
//             console.error('Error enrolling in course:', err);
//             alert(err.message || 'Failed to enroll in the course. Please try again.');
//         } finally {
//             setEnrollingCourseId(null);
//         }
//     };

//     const handleCourseClick = (course) => {
//         if (!isLoggedIn) {
//             navigate('/login');
//             return;
//         }
//         if (course.isEnrolled) {
//             navigate(`/student/course/${course.courseId}`);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="container mt-5">
//                 <div className="d-flex justify-content-center">
//                     <div className="spinner-border text-primary" role="status">
//                         <span className="visually-hidden">Loading...</span>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container mt-4">
//             <div className="row">
//                 <div className="col-12">
//                     <div className="d-flex justify-content-between align-items-center mb-4">
//                         <h3>Available Courses</h3>
//                         {isLoggedIn && (
//                             <Link to="/student/courses" className="btn btn-outline-primary">
//                                 <i className="bi bi-book me-2"></i>
//                                 View My Courses
//                             </Link>
//                         )}
//                     </div>
                    
//                     {courses.length === 0 ? (
//                         <div className="text-center py-5 bg-light rounded">
//                             <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></i>
//                             <p className="mt-3 text-muted">No courses available at the moment.</p>
//                         </div>
//                     ) : (
//                         <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
//                             {courses.map(course => (
//                                 <div key={course.courseId} className="col">
//                                     <div 
//                                         className={`card h-100 shadow-sm ${course.isEnrolled ? 'cursor-pointer' : ''}`}
//                                         style={{
//                                             border: 'none',
//                                             borderRadius: '12px',
//                                             transition: 'transform 0.2s ease',
//                                             cursor: course.isEnrolled ? 'pointer' : 'default'
//                                         }}
//                                         onClick={() => handleCourseClick(course)}
//                                         onMouseOver={(e) => {
//                                             e.currentTarget.style.transform = 'translateY(-5px)';
//                                             e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
//                                         }}
//                                         onMouseOut={(e) => {
//                                             e.currentTarget.style.transform = 'translateY(0)';
//                                             e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
//                                         }}
//                                     >
//                                         <div className="card-body">
//                                             <div className="d-flex justify-content-between align-items-start mb-3">
//                                                 <h5 className="card-title mb-0">{course.title}</h5>
//                                                 {course.isEnrolled && (
//                                                     <span className="badge bg-success">
//                                                         <i className="bi bi-check-circle me-1"></i>
//                                                         Enrolled
//                                                     </span>
//                                                 )}
//                                             </div>
//                                             <p className="card-text text-muted">{course.description}</p>
//                                             <div className="course-info mt-3">
//                                                 <div className="d-flex align-items-center mb-2">
//                                                     <i className="bi bi-person-circle course-info-icon me-2"></i>
//                                                     <span className="course-info-text">Instructor: {course.instructorName || 'Unknown'}</span>
//                                                 </div>
//                                                 <div className="d-flex align-items-center mb-2">
//                                                     <i className="bi bi-people course-info-icon me-2"></i>
//                                                     <span className="course-info-text">{course.enrollmentCount || 0} Students Enrolled</span>
//                                                 </div>
//                                                 <div className="d-flex align-items-center">
//                                                     <i className="bi bi-file-text course-info-icon me-2"></i>
//                                                     <span className="course-info-text">{course.assessmentCount || 0} Assessments</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <div className="card-footer bg-transparent border-0">
//                                             <div className="d-flex justify-content-between align-items-center">
//                                                 <button
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         if (!course.isEnrolled) {
//                                                             handleEnroll(course.courseId);
//                                                         } else {
//                                                             navigate(`/student/course/${course.courseId}`);
//                                                         }
//                                                     }}
//                                                     className={`btn btn-primary btn-sm w-100`}
//                                                     disabled={enrollingCourseId === course.courseId}
//                                                 >
//                                                     {enrollingCourseId === course.courseId ? (
//                                                         <>
//                                                             <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
//                                                             Enrolling...
//                                                         </>
//                                                     ) : course.isEnrolled ? (
//                                                         <>
//                                                             <i className="bi bi-check-circle me-1"></i>
//                                                             Enrolled
//                                                         </>
//                                                     ) : (
//                                                         <>
//                                                             <i className="bi bi-plus-circle me-1"></i>
//                                                             {isLoggedIn ? 'Enroll Now' : 'Login to Enroll'}
//                                                         </>
//                                                     )}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default StudentDashboard;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import studentService from "../../services/studentService";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token") !== null;

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const [availableCourses, enrolledCourses] = await Promise.all([
        studentService.getAllCourses(),
        studentService.getEnrolledCourses(),
      ]);

      const enrolledCourseIds = new Set(
        enrolledCourses.map((ec) => ec.courseId)
      );

      const coursesWithEnrollmentStatus = availableCourses.map((course) => ({
        ...course,
        isEnrolled: enrolledCourseIds.has(course.courseId),
      }));

      setCourses(coursesWithEnrollmentStatus);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        fetchCourses();
      }
    };

    document.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("focus", fetchCourses);

    return () => {
      document.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("focus", fetchCourses);
    };
  }, []);

  const handleEnroll = async (courseId) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      setEnrollingCourseId(courseId);
      const response = await studentService.enrollInCourse(courseId);

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseId === courseId
            ? { ...course, isEnrolled: true }
            : course
        )
      );

      if (response.message === "Already enrolled in course") {
        alert(
          "You are already enrolled in this course. Click the course to view its content."
        );
      } else {
        alert("Successfully enrolled in the course!");
      }

      await fetchCourses();
    } catch (err) {
      console.error("Error enrolling in course:", err);
      alert(err.message || "Failed to enroll in the course. Please try again.");
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleCourseClick = (course) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (course.isEnrolled) {
      navigate(`/student/course/${course.courseId}`);
    }
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

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Available Courses</h3>
            {isLoggedIn && (
              <Link to="/student/courses" className="btn btn-outline-primary">
                <i className="bi bi-book me-2"></i>
                View My Courses
              </Link>
            )}
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-5 bg-light rounded">
              <i
                className="bi bi-book text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <p className="mt-3 text-muted">
                No courses available at the moment.
              </p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {courses.map((course) => (
                <div key={course.courseId} className="col">
                  <div
                    className={`card h-100 shadow-sm ${
                      course.isEnrolled ? "cursor-pointer" : ""
                    }`}
                    style={{
                      border: "none",
                      borderRadius: "12px",
                      transition: "transform 0.2s ease",
                      cursor: course.isEnrolled ? "pointer" : "default",
                    }}
                    onClick={() => handleCourseClick(course)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 15px rgba(0,0,0,0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 4px rgba(0,0,0,0.05)";
                    }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0">{course.title}</h5>
                        {course.isEnrolled && (
                          <span className="badge bg-success">
                            <i className="bi bi-check-circle me-1"></i>
                            Enrolled
                          </span>
                        )}
                      </div>
                      <p className="card-text text-muted">
                        {course.description}
                      </p>
                      <div className="course-info mt-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-person-circle course-info-icon me-2"></i>
                          <span className="course-info-text">
                            Instructor: {course.instructorName || "Unknown"}
                          </span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <i className="bi bi-people course-info-icon me-2"></i>
                          <span className="course-info-text">
                            {course.enrollmentCount || 0} Students Enrolled
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-file-text course-info-icon me-2"></i>
                          <span className="course-info-text">
                            {course.assessmentCount || 0} Assessments
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent border-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!course.isEnrolled) {
                              handleEnroll(course.courseId);
                            } else {
                              navigate(`/student/course/${course.courseId}`);
                            }
                          }}
                          className="btn btn-primary btn-sm w-100"
                          disabled={enrollingCourseId === course.courseId}
                        >
                          {enrollingCourseId === course.courseId ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-1"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Enrolling...
                            </>
                          ) : course.isEnrolled ? (
                            <>
                              <i className="bi bi-check-circle me-1"></i>
                              Enrolled
                            </>
                          ) : (
                            <>
                              <i className="bi bi-plus-circle me-1"></i>
                              {isLoggedIn ? "Enroll Now" : "Login to Enroll"}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
