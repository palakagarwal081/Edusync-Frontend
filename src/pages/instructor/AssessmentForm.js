// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import assessmentService from '../../services/assessmentService';

// function AssessmentForm() {
//     const { courseId, assessmentId } = useParams();
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         duration: 30,
//         passingScore: 60,
//         questions: [
//             {
//                 text: '',
//                 options: ['', '', '', ''],
//                 correctOptionIndex: 0,
//                 points: 1
//             }
//         ]
//     });
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (assessmentId) {
//             loadAssessment();
//         }
//     }, [assessmentId]);

//     const loadAssessment = async () => {
//         try {
//             setLoading(true);
//             const data = await assessmentService.getAssessmentById(assessmentId);
//             setFormData({
//                 title: data.title,
//                 description: data.description || '',
//                 duration: data.duration || 30,
//                 passingScore: data.passingScore || 60,
//                 questions: data.questions ? JSON.parse(data.questions) : [{
//                     text: '',
//                     options: ['', '', '', ''],
//                     correctOptionIndex: 0,
//                     points: 1
//                 }]
//             });
//         } catch (err) {
//             setError('Failed to load assessment');
//             console.error('Error loading assessment:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleQuestionChange = (index, field, value) => {
//         const updatedQuestions = [...formData.questions];
//         updatedQuestions[index] = {
//             ...updatedQuestions[index],
//             [field]: value
//         };
//         setFormData({ ...formData, questions: updatedQuestions });
//     };

//     const handleOptionChange = (questionIndex, optionIndex, value) => {
//         const updatedQuestions = [...formData.questions];
//         updatedQuestions[questionIndex].options[optionIndex] = value;
//         setFormData({ ...formData, questions: updatedQuestions });
//     };

//     const addQuestion = () => {
//         setFormData({
//             ...formData,
//             questions: [
//                 ...formData.questions,
//                 {
//                     text: '',
//                     options: ['', '', '', ''],
//                     correctOptionIndex: 0,
//                     points: 1
//                 }
//             ]
//         });
//     };

//     const removeQuestion = (index) => {
//         if (formData.questions.length > 1) {
//             const updatedQuestions = formData.questions.filter((_, i) => i !== index);
//             setFormData({ ...formData, questions: updatedQuestions });
//         } else {
//             setError('Assessment must have at least one question');
//         }
//     };

//     const validateForm = () => {
//         if (!formData.title.trim()) {
//             setError('Please enter an assessment title');
//             return false;
//         }
//         if (!formData.description.trim()) {
//             setError('Please enter an assessment description');
//             return false;
//         }
//         if (formData.duration < 1) {
//             setError('Duration must be at least 1 minute');
//             return false;
//         }
//         if (formData.passingScore < 0 || formData.passingScore > 100) {
//             setError('Passing score must be between 0 and 100');
//             return false;
//         }
//         for (const question of formData.questions) {
//             if (!question.text.trim()) {
//                 setError('All questions must have text');
//                 return false;
//             }
//             if (question.options.some(opt => !opt.trim())) {
//                 setError('All options must be filled');
//                 return false;
//             }
//         }
//         return true;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');

//         if (!validateForm()) {
//             return;
//         }

//         try {
//             setLoading(true);
//             const assessmentData = {
//                 title: formData.title.trim(),
//                 description: formData.description.trim(),
//                 duration: parseInt(formData.duration),
//                 passingScore: parseInt(formData.passingScore),
//                 courseId: courseId,
//                 questions: formData.questions.map(q => ({
//                     text: q.text.trim(),
//                     options: q.options.map(opt => opt.trim()),
//                     correctOptionIndex: parseInt(q.correctOptionIndex),
//                     points: parseInt(q.points) || 1
//                 }))
//             };

//             console.log('Submitting assessment data:', assessmentData);

//             if (assessmentId) {
//                 await assessmentService.updateAssessment(assessmentId, assessmentData);
//             } else {
//                 await assessmentService.createAssessment(courseId, assessmentData);
//             }
//             navigate(`/instructor/courses/${courseId}/assessments`);
//         } catch (err) {
//             console.error('Error saving assessment:', err);
//             setError(err.message || 'Failed to save assessment. Please try again.');
//         } finally {
//             setLoading(false);
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
//             <div className="card shadow">
//                 <div className="card-body">
//                     <h2 className="card-title mb-4">{assessmentId ? 'Edit Assessment' : 'Create Assessment'}</h2>

//                     {error && (
//                         <div className="alert alert-danger" role="alert">
//                             {error}
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmit}>
//                         <div className="mb-3">
//                             <label htmlFor="title" className="form-label">Title</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 id="title"
//                                 value={formData.title}
//                                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                                 required
//                             />
//                         </div>

//                         <div className="mb-3">
//                             <label htmlFor="description" className="form-label">Description</label>
//                             <textarea
//                                 className="form-control"
//                                 id="description"
//                                 value={formData.description}
//                                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                                 rows="3"
//                                 required
//                             />
//                         </div>

//                         <div className="row mb-4">
//                             <div className="col-md-6">
//                                 <label htmlFor="duration" className="form-label">Duration (minutes)</label>
//                                 <input
//                                     type="number"
//                                     className="form-control"
//                                     id="duration"
//                                     value={formData.duration}
//                                     onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
//                                     min="1"
//                                     required
//                                 />
//                             </div>
//                             <div className="col-md-6">
//                                 <label htmlFor="passingScore" className="form-label">Passing Score (%)</label>
//                                 <input
//                                     type="number"
//                                     className="form-control"
//                                     id="passingScore"
//                                     value={formData.passingScore}
//                                     onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
//                                     min="0"
//                                     max="100"
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         <div className="mb-4">
//                             <h4>Questions</h4>
//                             {formData.questions.map((question, index) => (
//                                 <div key={index} className="card mb-3">
//                                     <div className="card-body">
//                                         <div className="d-flex justify-content-between align-items-center mb-3">
//                                             <h5 className="card-title mb-0">Question {index + 1}</h5>
//                                             {formData.questions.length > 1 && (
//                                                 <button
//                                                     type="button"
//                                                     className="btn btn-outline-danger btn-sm"
//                                                     onClick={() => removeQuestion(index)}
//                                                 >
//                                                     <i className="bi bi-trash"></i>
//                                                 </button>
//                                             )}
//                                         </div>

//                                         <div className="mb-3">
//                                             <label className="form-label">Question Text</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 value={question.text}
//                                                 onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="mb-3">
//                                             <label className="form-label">Options</label>
//                                             {question.options.map((option, optIndex) => (
//                                                 <div key={optIndex} className="input-group mb-2">
//                                                     <div className="input-group-text">
//                                                         <input
//                                                             type="radio"
//                                                             name={`correctOption-${index}`}
//                                                             checked={question.correctOptionIndex === optIndex}
//                                                             onChange={() => handleQuestionChange(index, 'correctOptionIndex', optIndex)}
//                                                         />
//                                                     </div>
//                                                     <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         value={option}
//                                                         onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
//                                                         placeholder={`Option ${optIndex + 1}`}
//                                                         required
//                                                     />
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         <div className="mb-3">
//                                             <label className="form-label">Points</label>
//                                             <input
//                                                 type="number"
//                                                 className="form-control"
//                                                 value={question.points}
//                                                 onChange={(e) => handleQuestionChange(index, 'points', parseInt(e.target.value))}
//                                                 min="1"
//                                                 required
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}

//                             <button
//                                 type="button"
//                                 className="btn btn-outline-primary"
//                                 onClick={addQuestion}
//                             >
//                                 <i className="bi bi-plus-circle me-2"></i>
//                                 Add Question
//                             </button>
//                         </div>

//                         <div className="d-flex justify-content-between">
//                             <button
//                                 type="button"
//                                 className="btn btn-outline-secondary"
//                                 onClick={() => navigate(`/instructor/courses/${courseId}/assessments`)}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="btn btn-primary"
//                                 disabled={loading}
//                             >
//                                 {loading ? (
//                                     <>
//                                         <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                         Saving...
//                                     </>
//                                 ) : (
//                                     assessmentId ? 'Update Assessment' : 'Create Assessment'
//                                 )}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AssessmentForm;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import assessmentService from "../../services/assessmentService";

function AssessmentForm() {
  const { courseId, assessmentId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    passingScore: 60,
    questions: [
      {
        text: "",
        options: ["", "", "", ""],
        correctOptionIndex: 0,
        points: 1,
      },
    ],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);
        const data = await assessmentService.getAssessmentById(assessmentId);
        setFormData({
          title: data.title,
          description: data.description || "",
          duration: data.duration || 30,
          passingScore: data.passingScore || 60,
          questions: data.questions
            ? JSON.parse(data.questions)
            : [
                {
                  text: "",
                  options: ["", "", "", ""],
                  correctOptionIndex: 0,
                  points: 1,
                },
              ],
        });
      } catch (err) {
        setError("Failed to load assessment");
        console.error("Error loading assessment:", err);
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      loadAssessment();
    }
  }, [assessmentId]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: "",
          options: ["", "", "", ""],
          correctOptionIndex: 0,
          points: 1,
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData({ ...formData, questions: updatedQuestions });
    } else {
      setError("Assessment must have at least one question");
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Please enter an assessment title");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Please enter an assessment description");
      return false;
    }
    if (formData.duration < 1) {
      setError("Duration must be at least 1 minute");
      return false;
    }
    if (formData.passingScore < 0 || formData.passingScore > 100) {
      setError("Passing score must be between 0 and 100");
      return false;
    }
    for (const question of formData.questions) {
      if (!question.text.trim()) {
        setError("All questions must have text");
        return false;
      }
      if (question.options.some((opt) => !opt.trim())) {
        setError("All options must be filled");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const assessmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: parseInt(formData.duration),
        passingScore: parseInt(formData.passingScore),
        courseId: courseId,
        questions: formData.questions.map((q) => ({
          text: q.text.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctOptionIndex: parseInt(q.correctOptionIndex),
          points: parseInt(q.points) || 1,
        })),
      };

      console.log("Submitting assessment data:", assessmentData);

      if (assessmentId) {
        await assessmentService.updateAssessment(assessmentId, assessmentData);
      } else {
        await assessmentService.createAssessment(courseId, assessmentData);
      }
      navigate(`/instructor/courses/${courseId}/assessments`);
    } catch (err) {
      console.error("Error saving assessment:", err);
      setError(err.message || "Failed to save assessment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">
            {assessmentId ? "Edit Assessment" : "Create Assessment"}
          </h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="3"
                required
              />
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="duration" className="form-label">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="duration"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  min="1"
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="passingScore" className="form-label">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="passingScore"
                  value={formData.passingScore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passingScore: parseInt(e.target.value),
                    })
                  }
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <h4>Questions</h4>
              {formData.questions.map((question, index) => (
                <div key={index} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-title mb-0">Question {index + 1}</h5>
                      {formData.questions.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeQuestion(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Question Text</label>
                      <input
                        type="text"
                        className="form-control"
                        value={question.text}
                        onChange={(e) =>
                          handleQuestionChange(index, "text", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Options</label>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="input-group mb-2">
                          <div className="input-group-text">
                            <input
                              type="radio"
                              name={`correctOption-${index}`}
                              checked={question.correctOptionIndex === optIndex}
                              onChange={() =>
                                handleQuestionChange(
                                  index,
                                  "correctOptionIndex",
                                  optIndex
                                )
                              }
                            />
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                index,
                                optIndex,
                                e.target.value
                              )
                            }
                            placeholder={`Option ${optIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Points</label>
                      <input
                        type="number"
                        className="form-control"
                        value={question.points}
                        onChange={(e) =>
                          handleQuestionChange(
                            index,
                            "points",
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addQuestion}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add Question
              </button>
            </div>

            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  navigate(`/instructor/courses/${courseId}/assessments`)
                }
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
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : assessmentId ? (
                  "Update Assessment"
                ) : (
                  "Create Assessment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssessmentForm;
