/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfettiExplosion from 'react-confetti-explosion';
import {
  Button,
  Radio,
  FormControlLabel,
  RadioGroup,
  // Card,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { AccessTimeOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import ForumIcon from '@mui/icons-material/Forum';
import NameContext from '../../Context/NameContext';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

const quizData: Question[] = [
  {
    id: 1,
    question: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
  },
  {
    id: 2,
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
  },
  {
    id: 3,
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
    correctAnswer: 'Mars',
  },
  {
    id: 4,
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
    correctAnswer: 'Mars',
  },
  {
    id: 5,
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
    correctAnswer: 'Mars',
  },
  {
    id: 6,
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
    correctAnswer: 'Mars',
  },
  {
    id: 7,
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
    correctAnswer: 'Mars',
  },
  {
    id: 8,
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
    correctAnswer: 'Mars',
  },
  {
    id: 9,
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
    correctAnswer: 'Mars',
  },
];
const getMessage = (score: number) => {
  if (score >= 80) return 'Excellent Work! 🎉';
  if (score >= 50) return 'Good Job! Keep Practicing!';
  return 'Better luck next time!';
};

const QuizPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [lockedAnswers, setLockedAnswers] = useState<{
    [key: number]: boolean;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const context = useContext(NameContext);
  const { namecolor }: any = context;

  console.log({ namecolor });

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowResults(true);

      setShowConfetti(false);
    }
  }, [timeLeft]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!lockedAnswers[quizData[currentQuestionIndex].id]) {
      setSelectedAnswers({
        ...selectedAnswers,
        [quizData[currentQuestionIndex].id]: event.target.value,
      });
    }
  };

  const handleNext = () => {
    if (selectedAnswers[quizData[currentQuestionIndex].id]) {
      setLockedAnswers({
        ...lockedAnswers,
        [quizData[currentQuestionIndex].id]: true,
      });
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isCorrectAnswer = (questionId: number) =>
    selectedAnswers[questionId] ===
    quizData.find((q) => q.id === questionId)?.correctAnswer;

  const handleSubmit = () => {
    setShowResults(true);
    setIsSubmit(true);
  };
  const correctCount = Object.keys(selectedAnswers).filter((qId) =>
    isCorrectAnswer(parseInt(qId)),
  ).length;
  const scorePercentage = (correctCount / quizData.length) * 100;

  useEffect(() => {
    let confettiTimer: any;

    if (showResults && scorePercentage > 80) {
      confettiTimer = setTimeout(() => {
        setShowConfetti(true);
      }, 300);
    }

    return () => clearTimeout(confettiTimer);
  }, [showResults, scorePercentage]);

  return (
    <div className="main-wrapper">
      <div className="main-content p-0">
        <div className="quiz-panel">
          <div className="left-cards">
            <div className="page-breadcrumb d-flex align-items-center mb-4">
              <div className="breadcrumb-title pe-3">
                <div className="d-flex gap-1 align-items-center" role="button">
                  <ArrowBackIcon onClick={handleBack} className="me-1" />
                  <Link to={'/main/dashboard'} className="text-dark">
                    Dashboard
                  </Link>
                </div>
              </div>
              <div className="ps-3">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0 p-0">
                    <li className="breadcrumb-item active" aria-current="page">
                      My Quiz
                    </li>
                  </ol>
                </nav>
              </div>
            </div>

            <div className="d-flex justify-content-between flex-wrap  ">
              <div className="">
                <Typography
                  variant="h4"
                  className="text-dark text-m-16"
                  fontWeight="bold"
                  gutterBottom
                >
                  Mathematics Final Exam
                </Typography>
                <Typography variant="body1" gutterBottom className="text-m-14">
                  Complete all questions. You can review your answers before
                  final submission.
                </Typography>
                <div className="d-flex justify-content-between my-3 align-items-center">
                  <small className=" fw-medium d-block text-m-14">
                    Question {currentQuestionIndex + 1} of {quizData.length}
                  </small>
                  <Typography
                    variant="body1"
                    gutterBottom
                    className="text-danger fw-bold text-m-14 d-lg-none"
                  >
                    <AccessTimeOutlined className="d-none d-lg-block" />{' '}
                    {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, '0')} Time Remaining
                  </Typography>
                </div>
              </div>
              <Typography
                variant="body1"
                gutterBottom
                className="text-danger fw-bold text-m-14 d-none d-lg-flex gap-1"
              >
                <AccessTimeOutlined className="d-none d-lg-block" />{' '}
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, '0')} Time Remaining
              </Typography>
            </div>

            <Typography variant="body1" className="text-dark fs-5" gutterBottom>
              {quizData[currentQuestionIndex].question}
            </Typography>

            <RadioGroup
              className="optiongrp"
              value={selectedAnswers[quizData[currentQuestionIndex].id] || ''}
              onChange={handleAnswerChange}
            >
              {quizData[currentQuestionIndex].options.map((option, index) => {
                const isLocked =
                  lockedAnswers[quizData[currentQuestionIndex].id];
                const correctAnswer =
                  quizData[currentQuestionIndex].correctAnswer;
                const selectedAnswer =
                  selectedAnswers[quizData[currentQuestionIndex].id];
                const isCorrect = option === correctAnswer;
                const isSelectedWrong =
                  isSubmit && option === selectedAnswer && !isCorrect;

                return (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    sx={{
                      borderRadius: '10px',
                      marginTop: '5px',
                      width: '40%',
                      padding: '2px 10px 2px 5px',

                      border: isSubmit
                        ? isCorrect
                          ? '2px solid green'
                          : isSelectedWrong
                            ? '2px solid red'
                            : '2px solid var(--bs-purple)'
                        : '2px solid var(--bs-purple)',
                    }}
                    label={<div>{option}</div>}
                    disabled={isLocked}
                  />
                );
              })}
            </RadioGroup>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 3,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!selectedAnswers[quizData[currentQuestionIndex].id]}
              >
                Next
              </Button>
            </Box>

            <Box>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 3 }}
                onClick={handleSubmit}
                className="text-center mx-auto d-block"
              >
                Submit Quiz
              </Button>
              <Dialog
                open={showResults}
                onClose={() => setShowResults(false)}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle
                  sx={{
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  Quiz Results
                  <IconButton onClick={() => setShowResults(false)}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>

                <DialogContent>
                  {showConfetti && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 9999,
                        pointerEvents: 'none',
                      }}
                    >
                      <ConfettiExplosion />
                    </div>
                  )}

                  <Box
                    position="relative"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ margin: '0 auto' }}
                  >
                    <Box
                      position="relative"
                      sx={{ width: '120px', height: '120px' }}
                    >
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={120}
                        thickness={4}
                        sx={{
                          color: 'rgba(128, 0, 128, 0.2)',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                        }}
                      />

                      <CircularProgress
                        variant="determinate"
                        value={scorePercentage}
                        size={120}
                        thickness={4}
                        sx={{
                          color: '$primary',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                        }}
                      />

                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div className="score-content">
                          <h1>
                            {scorePercentage.toFixed(0)}% <span>Score</span>{' '}
                          </h1>
                        </div>
                      </Box>
                    </Box>
                  </Box>
                  <p className="text-dark text-center fs-4 mt-4 fw-bold mb-1">
                    {getMessage(scorePercentage)}
                  </p>

                  <p className="text-center mb-4">
                    You&apos;ve completed the Mathematics Quiz
                  </p>

                  <div className="card bg-primary-20 mb-0">
                    <div className="card-body">
                      <ul className="quizsubre">
                        <li>
                          <AccessTimeOutlined color="primary" />
                          <div className="">
                            <span>Time Taken:</span>
                            <span className="text-dark">
                              {((300 - timeLeft) / 60).toFixed(2)} mins
                            </span>
                          </div>
                        </li>
                        <li>
                          <ForumIcon color="primary" />
                          <div className="">
                            <span>Questions:</span>
                            <span className="text-dark">
                              {correctCount}/{quizData.length} Correct
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                  <button
                    className="btn btn-primary rounded-pill mb-4 px-4"
                    onClick={() => setShowResults(false)}
                  >
                    Go To Results
                  </button>
                </DialogActions>
              </Dialog>
            </Box>
          </div>
          <div className="right-cards">
            <h6 className="mb-3 fw-medium">Question Navigator</h6>
            <Grid className="rebtns">
              {quizData.map((q) => (
                <Grid item key={q.id} className="listit">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor:
                        currentQuestionIndex === q.id - 1
                          ? '#9943EC'
                          : lockedAnswers[q.id]
                            ? isCorrectAnswer(q.id)
                              ? '#4CAF50'
                              : '#F44336'
                            : '#9E9E9E',
                      color: 'white',
                    }}
                    onClick={() => setCurrentQuestionIndex(q.id - 1)}
                  >
                    {q.id}
                  </Button>
                </Grid>
              ))}
            </Grid>

            <ul className="quiz-hint">
              <li>
                <span style={{ backgroundColor: '#4CAF50' }}></span> Answered
              </li>
              <li>
                <span style={{ backgroundColor: '#9943EC' }}></span> Current
              </li>
              <li>
                <span style={{ backgroundColor: '#9E9E9E' }}></span> Unanswered
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
