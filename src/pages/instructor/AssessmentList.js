// import React, { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import assessmentService from '../../services/assessmentService';

// function AssessmentList() {
//     const { courseId } = useParams();
//     const [assessments, setAssessments] = useState([]);

//     useEffect(() => {
//         loadAssessments();
//     }, [courseId]);

//     const loadAssessments = async () => {
//         try {
//             const data = await assessmentService.getCourseAssessments(courseId);
//             setAssessments(data);
//         } catch (error) {
//             console.error('Error loading assessments:', error);
//         }
//     };

//     const handleDelete = async (assessmentId) => {
//         if (window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
//             try {
//                 await assessmentService.deleteAssessment(courseId, assessmentId);
//                 loadAssessments(); // Reload the list after deletion
//             } catch (error) {
//                 console.error('Error deleting assessment:', error);
//                 alert('Failed to delete assessment');
//             }
//         }
//     };

//     return (
//         <div className="container mt-4">
//             <div className="d-flex justify-content-between align-items-center mb-4">
//                 <h3>Course Assessments</h3>
//                 <Link 
//                     to={`/instructor/courses/${courseId}/assessments/create`} 
//                     className="btn btn-primary"
//                 >
//                     <i className="bi bi-plus-circle me-2"></i>
//                     Create Assessment
//                 </Link>
//             </div>

//             {assessments.length === 0 ? (
//                 <div className="alert alert-info">
//                     No assessments created yet. Click the button above to create your first assessment.
//                 </div>
//             ) : (
//                 <div className="list-group">
//                     {assessments.map(assessment => (
//                         <div key={assessment.assessmentId} className="list-group-item">
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div>
//                                     <h5 className="mb-1">{assessment.title}</h5>
//                                     <p className="text-muted mb-0">{assessment.description}</p>
//                                 </div>
//                                 <div className="d-flex gap-2">
//                                     <Link
//                                         to={`/instructor/courses/${courseId}/assessments/${assessment.assessmentId}/edit`}
//                                         className="btn btn-outline-primary btn-sm"
//                                     >
//                                         <i className="bi bi-pencil me-1"></i>
//                                         Edit
//                                     </Link>
//                                     <Link
//                                         to={`/instructor/courses/${courseId}/assessments/${assessment.assessmentId}`}
//                                         className="btn btn-outline-secondary btn-sm"
//                                     >
//                                         <i className="bi bi-eye me-1"></i>
//                                         View
//                                     </Link>
//                                     <button
//                                         onClick={() => handleDelete(assessment.assessmentId)}
//                                         className="btn btn-outline-danger btn-sm"
//                                     >
//                                         <i className="bi bi-trash"></i>
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default AssessmentList;


import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import assessmentService from "../../services/assessmentService";

function AssessmentList() {
  const { courseId } = useParams();
  const [assessments, setAssessments] = useState([]);

  const loadAssessments = useCallback(async () => {
    try {
      const data = await assessmentService.getCourseAssessments(courseId);
      setAssessments(data);
    } catch (error) {
      console.error("Error loading assessments:", error);
    }
  }, [courseId]);

  useEffect(() => {
    loadAssessments();
  }, [loadAssessments]);

  const handleDelete = async (assessmentId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this assessment? This action cannot be undone."
      )
    ) {
      try {
        await assessmentService.deleteAssessment(courseId, assessmentId);
        loadAssessments(); // Reload after deletion
      } catch (error) {
        console.error("Error deleting assessment:", error);
        alert("Failed to delete assessment");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Course Assessments</h3>
        <Link
          to={`/instructor/courses/${courseId}/assessments/create`}
          className="btn btn-primary"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create Assessment
        </Link>
      </div>

      {assessments.length === 0 ? (
        <div className="alert alert-info">
          No assessments created yet. Click the button above to create your
          first assessment.
        </div>
      ) : (
        <div className="list-group">
          {assessments.map((assessment) => (
            <div key={assessment.assessmentId} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">{assessment.title}</h5>
                  <p className="text-muted mb-0">{assessment.description}</p>
                </div>
                <div className="d-flex gap-2">
                  <Link
                    to={`/instructor/courses/${courseId}/assessments/${assessment.assessmentId}/edit`}
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Edit
                  </Link>
                  <Link
                    to={`/instructor/courses/${courseId}/assessments/${assessment.assessmentId}`}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="bi bi-eye me-1"></i>
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(assessment.assessmentId)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AssessmentList;
