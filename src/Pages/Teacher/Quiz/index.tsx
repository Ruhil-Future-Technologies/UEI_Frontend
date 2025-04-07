import React from 'react';
import { Link } from 'react-router-dom';

const TeacherQuizPage = () => {
  return (
    <div className="main-wrapper">
      <div className="main-content">
        <h1>Quiz Page</h1>
        <div className="col-lg-12 ">
          <Link
            to="/teacher-dashboard/create-assignment"
            className="btn btn-primary m-0"
          >
            Create Quiz
          </Link>
        </div>

        <div className="col-lg-12 mt-4 ">
          <Link
            to="/teacher-dashboard/quiz-details/1"
            className="btn btn-primary m-0"
          >
            Quiz Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherQuizPage;
