import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import studentService from "../../services/studentService";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const enrolledCourses = await studentService.getEnrolledCourses();
      
      // Fetch additional details for each enrolled course
      const coursesWithDetails = await Promise.all(
        enrolledCourses.map(async (course) => {
          try {
            const details = await studentService.getCourseDetails(course.courseId);
            return {
              ...course,
              ...details,
              isEnrolled: true
            };
          } catch (err) {
            console.error(`Error fetching details for course ${course.courseId}:`, err);
            return course;
          }
        })
      );

      setCourses(coursesWithDetails);
      setError("");
    } catch (err) {
      setError("Failed to load enrolled courses. Please try again later.");
      console.error("Error fetching enrolled courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">My Enrolled Courses</h2>
          <p className="text-muted">View and access your enrolled courses</p>
        </div>
        <Link to="/student/dashboard" className="btn btn-outline-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <i className="bi bi-book text-muted" style={{ fontSize: "3rem" }}></i>
          <p className="mt-3 text-muted">You haven't enrolled in any courses yet.</p>
          <Link to="/student/dashboard" className="btn btn-primary mt-3">
            <i className="bi bi-search me-2"></i>
            Browse Available Courses
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {courses.map((course) => (
            <div key={course.courseId} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text text-muted">{course.description}</p>
                  <div className="mt-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-person-circle me-2"></i>
                      <span>Instructor: {course.instructorName || "Unknown"}</span>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-people me-2"></i>
                      <span>{course.enrollmentCount || 0} Students Enrolled</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-file-text me-2"></i>
                      <span>{course.assessmentCount || 0} Assessments</span>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent border-top-0">
                  <Link
                    to={`/student/course/${course.courseId}`}
                    className="btn btn-primary w-100"
                  >
                    <i className="bi bi-book me-2"></i>
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CourseList;
