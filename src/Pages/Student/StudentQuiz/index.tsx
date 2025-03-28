import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentQuiz = () => {
  const navigate = useNavigate();
  const quizId = 1;

  return (
    <div className="main-wrapper">
      <div className="main-content">Student Quiz</div>
      <Button
        className=""
        onClick={() => navigate(`/main/student/quiz/${quizId}`)}
      >
        Take Quiz
      </Button>
    </div>
  );
};

export default StudentQuiz;
