// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import courseService from '../../services/courseService';

// function InstructorDashboard() {
//     const [myCourses, setMyCourses] = useState([]);
//     const [otherCourses, setOtherCourses] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const currentUserId = localStorage.getItem('userId');

//     const fetchCourses = async () => {
//         try {
//             setLoading(true);
//             setError('');
//             console.log('Fetching courses for instructor dashboard...');
            
//             const [myCoursesData, allCoursesData] = await Promise.all([
//                 courseService.getMyCourses(),
//                 courseService.getAvailableCourses()
//             ]);
            
//             console.log('My courses:', myCoursesData);
//             console.log('All courses:', allCoursesData);
            
//             setMyCourses(myCoursesData || []);
//             // Filter out my courses from all courses
//             const otherCoursesData = (allCoursesData || []).filter(
//                 course => course.instructorId !== currentUserId
//             );
//             setOtherCourses(otherCoursesData);
//         } catch (err) {
//             console.error('Error in fetchCourses:', err);
//             setError(err.response?.data?.message || 'Failed to load courses. Please try again later.');
//             setMyCourses([]);
//             setOtherCourses([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchCourses();
//     }, [currentUserId]);

//     const handleDeleteCourse = async (courseId) => {
//         if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
//             try {
//                 await courseService.deleteCourse(courseId);
//                 // Refresh the courses list after deletion
//                 fetchCourses();
//             } catch (err) {
//                 setError('Failed to delete course. Please try again later.');
//                 console.error('Error deleting course:', err);
//             }
//         }
//     };

//     if (loading) {
//         return (
//             <div className="container mt-4">
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
//             <div className="mb-4 d-flex justify-content-between align-items-center">
//                 <h2>Instructor Dashboard</h2>
//                 {/* <Link to="/instructor/courses/new" className="btn btn-primary">
//                     <i className="bi bi-plus-circle me-2"></i>
//                     Create New Course
//                 </Link> */}
//             </div>

//             {error && (
//                 <div className="alert alert-danger" role="alert">
//                     {error}
//                 </div>
//             )}

//             {/* My Courses Section */}
//             <div className="mb-5">
//                 <div className="d-flex justify-content-between align-items-center mb-4">
//                     <h3>My Courses</h3>
//                 </div>
//                 {myCourses.length === 0 ? (
//                     <div className="text-center py-5 bg-light rounded">
//                         <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></i>
//                         <p className="mt-3 text-muted">You haven't created any courses yet.</p>
//                         <Link to="/instructor/courses/new" className="btn btn-primary">
//                             Create Your First Course
//                         </Link>
//                     </div>
//                 ) : (
//                     <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
//                         {myCourses.map(course => (
//                             <div key={course.courseId} className="col">
//                                 <div className="card h-100 shadow-sm">
//                                     <div className="card-body">
//                                         <h5 className="card-title">{course.title}</h5>
//                                         <p className="card-text text-muted">{course.description}</p>
//                                         <div className="mt-3">
//                                             <div className="d-flex align-items-center mb-2">
//                                                 <i className="bi bi-people me-2"></i>
//                                                 <span>{course.enrollmentCount || 0} Students Enrolled</span>
//                                             </div>
//                                             <div className="d-flex align-items-center">
//                                                 <i className="bi bi-file-text me-2"></i>
//                                                 <span>{course.assessmentCount || 0} Assessments</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="card-footer bg-transparent border-top-0">
//                                         <Link 
//                                             to={`/instructor/courses/${course.courseId}`}
//                                             className="btn btn-outline-primary w-100"
//                                         >
//                                             <i className="bi bi-eye me-1"></i>
//                                             View Details
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Other Courses Section */}
//             <div className="mb-5">
//                 <h3 className="mb-4">Other Instructors' Courses</h3>
//                 {otherCourses.length === 0 ? (
//                     <div className="text-center py-5 bg-light rounded">
//                         <i className="bi bi-book text-muted" style={{ fontSize: '3rem' }}></i>
//                         <p className="mt-3 text-muted">No courses from other instructors available.</p>
//                     </div>
//                 ) : (
//                     <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
//                         {otherCourses.map(course => (
//                             <div key={course.courseId} className="col">
//                                 <div className="card h-100 shadow-sm">
//                                     <div className="card-body">
//                                         <h5 className="card-title">{course.title}</h5>
//                                         <p className="card-text text-muted">{course.description}</p>
//                                         <div className="mt-3">
//                                             <div className="d-flex align-items-center mb-2">
//                                                 <i className="bi bi-person-circle me-2"></i>
//                                                 <span>Instructor: {course.instructorName || 'Unknown'}</span>
//                                             </div>
//                                             <div className="d-flex align-items-center mb-2">
//                                                 <i className="bi bi-people me-2"></i>
//                                                 <span>{course.enrollmentCount || 0} Students Enrolled</span>
//                                             </div>
//                                             <div className="d-flex align-items-center">
//                                                 <i className="bi bi-file-text me-2"></i>
//                                                 <span>{course.assessmentCount || 0} Assessments</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default InstructorDashboard;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import courseService from "../../services/courseService";

function InstructorDashboard() {
  const [myCourses, setMyCourses] = useState([]);
  const [otherCourses, setOtherCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUserId = localStorage.getItem("userId");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const [myCoursesData, allCoursesData] = await Promise.all([
        courseService.getMyCourses(),
        courseService.getAvailableCourses(),
      ]);

      setMyCourses(myCoursesData || []);

      const filteredOtherCourses = (allCoursesData || []).filter(
        (course) => String(course.instructorId) !== String(currentUserId)
      );
      setOtherCourses(filteredOtherCourses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load courses. Please try again later."
      );
      setMyCourses([]);
      setOtherCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchCourses();
    }
  }, [currentUserId]);

  const handleDeleteCourse = async (courseId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      )
    ) {
      try {
        await courseService.deleteCourse(courseId);
        fetchCourses();
      } catch (err) {
        console.error("Error deleting course:", err);
        setError("Failed to delete course. Please try again later.");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h2>Instructor Dashboard</h2>
        <Link to="/instructor/courses/new" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Create New Course
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* My Courses Section */}
      <section className="mb-5">
        <h3 className="mb-3">My Courses</h3>
        {myCourses.length === 0 ? (
          <div className="text-center py-5 bg-light rounded">
            <i
              className="bi bi-book text-muted"
              style={{ fontSize: "3rem" }}
            ></i>
            <p className="mt-3 text-muted">
              You haven't created any courses yet.
            </p>
            <Link to="/instructor/courses/new" className="btn btn-primary">
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {myCourses.map((course) => (
              <div key={course.courseId} className="col">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text text-muted">{course.description}</p>
                    <div className="mt-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-people me-2"></i>
                        <span>
                          {course.enrollmentCount || 0} Students Enrolled
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-file-text me-2"></i>
                        <span>{course.assessmentCount || 0} Assessments</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent d-flex justify-content-between">
                    <Link
                      to={`/instructor/courses/${course.courseId}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </Link>
                    <button
                      onClick={() => handleDeleteCourse(course.courseId)}
                      className="btn btn-outline-danger btn-sm"
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Other Courses Section */}
      <section className="mb-5">
        <h3 className="mb-4">Other Instructors' Courses</h3>
        {otherCourses.length === 0 ? (
          <div className="text-center py-5 bg-light rounded">
            <i
              className="bi bi-book text-muted"
              style={{ fontSize: "3rem" }}
            ></i>
            <p className="mt-3 text-muted">
              No courses from other instructors available.
            </p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {otherCourses.map((course) => (
              <div key={course.courseId} className="col">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{course.title}</h5>
                    <p className="card-text text-muted">{course.description}</p>
                    <div className="mt-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-person-circle me-2"></i>
                        <span>
                          Instructor: {course.instructorName || "Unknown"}
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-people me-2"></i>
                        <span>
                          {course.enrollmentCount || 0} Students Enrolled
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-file-text me-2"></i>
                        <span>{course.assessmentCount || 0} Assessments</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default InstructorDashboard;

