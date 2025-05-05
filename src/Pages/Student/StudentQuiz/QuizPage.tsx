/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfettiExplosion from 'react-confetti-explosion';
import {
  Button,
  Radio,
  FormControlLabel,
  RadioGroup,
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
import useApi from '../../../hooks/useAPI';
import { toast } from 'react-toastify';
import { QUERY_KEYS_QUIZ } from '../../../utils/const';

const getMessage = (score: number) => {
  if (score >= 80) return 'Excellent Work! 🎉';
  if (score >= 50) return 'Good Job! Keep Practicing!';
  return 'Better luck next time!';
};

const QuizPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quizData, setQuizData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [lockedAnswers, setLockedAnswers] = useState<{
    [key: number]: boolean;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const { getData, postDataJson } = useApi();
  const studentId = localStorage.getItem('_id') || {};
  const GET_QUIZ = QUERY_KEYS_QUIZ.GET_QUIZ;
  const ADD_SUBMISSION = QUERY_KEYS_QUIZ.ADD_SUBMISSION;

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true);
        getData(`${GET_QUIZ}/${id}`).then((response) => {
          if (response.status && response.code === 200) {
            const current_time = new Date();
            const quiztime = new Date(response.data.due_date_time);

            if (current_time > quiztime) {
              toast.error('Quiz Timeout', {
                hideProgressBar: true,
                theme: 'colored',
              });
              navigate('/main/student/quiz');
              return;
            } else {
              setQuizData(response?.data);
              setTimeLeft(response?.data.timer * 60);
              if (!response?.data?.is_multiple_attempt) {
                toast.success(
                  'You won’t be able to reattempt once submitted. As reattempt not allowed for this quiz.',
                  {
                    hideProgressBar: true,
                    theme: 'colored',
                    position: 'top-center',
                  },
                );
              }
            }
          }
        });
      } catch (error) {
        toast.error('Error fetching quiz data', {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
        console.error('Error fetching quiz data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchQuizData();
    }
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (timeLeft > 0 && timerActive) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isLoading && quizData && timerActive) {
      setShowResults(true);
      setShowConfetti(false);
      setIsSubmit(true);
      submitQuiz();
      setTimerActive(false);
    }
  }, [timeLeft, isLoading, quizData, timerActive]);

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!quizData) return;
    if (!lockedAnswers[currentQuestionIndex]) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestionIndex]: event.target.value,
      });
    }
  };

  const handleNext = () => {
    if (!quizData) return;
    if (selectedAnswers[currentQuestionIndex]) {
      setLockedAnswers({
        ...lockedAnswers,
        [currentQuestionIndex]: true,
      });
      if (currentQuestionIndex < quizData.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const isCorrectAnswer = (questionIndex: number) => {
    if (!quizData) return false;
    return (
      selectedAnswers[questionIndex] ===
      quizData.questions[questionIndex].answer
    );
  };

  const formatStudentAnswers = () => {
    if (!quizData) return {};
    const formattedAnswers: any = {};
    quizData.questions.forEach((question: any, index: any) => {
      if (selectedAnswers[index]) {
        formattedAnswers[question.id] = selectedAnswers[index];
      }
    });
    return formattedAnswers;
  };

  const calculateTimeTaken = () => {
    if (!quizData) return 0;
    const totalTimeInSeconds = quizData.timer * 60;
    const timeTakenInSeconds = totalTimeInSeconds - timeLeft;
    return (timeTakenInSeconds / 60).toFixed(2);
  };

  const submitQuiz = async () => {
    try {
      const correctAnswersCount = Object.keys(selectedAnswers).filter((qIdx) =>
        isCorrectAnswer(parseInt(qIdx)),
      ).length;
      const totalQuestions = quizData.questions.length;
      const percentageCorrect = (correctAnswersCount / totalQuestions) * 100;
      const earnedPoints = Math.round(
        (percentageCorrect / 100) * parseInt(quizData.points),
      );
      const payload = {
        quiz_id: id,
        student_id: studentId,
        points: quizData.points.toString(),
        result_points: earnedPoints.toString(),
        time_taken: calculateTimeTaken(),
        student_answers: formatStudentAnswers(),
      };
      postDataJson(ADD_SUBMISSION, payload).then((response) => {
        if (response.data && response.status) {
          toast.success('Quiz submitted successfully', {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        } else {
          toast.error(response.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
          setShowResults(false);
          navigate('/main/student/quiz');
        }
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Error submitting quiz', {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  const handleSubmit = () => {
    const updatedLockedAnswers = { ...lockedAnswers };

    Object.keys(selectedAnswers).forEach((qIdx) => {
      const index = parseInt(qIdx);
      updatedLockedAnswers[index] = true;
    });

    setLockedAnswers(updatedLockedAnswers);
    setShowResults(true);
    setIsSubmit(true);
    setTimerActive(false);
    submitQuiz();
  };

  const preventCopySx: React.CSSProperties = {
    userSelect: 'none',
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    let totalCorrect = 0;
    const totalQuestions = quizData.questions.length;
    Object.keys(selectedAnswers).forEach((qIdx) => {
      const index = parseInt(qIdx);
      if (isCorrectAnswer(index)) {
        totalCorrect++;
      }
    });
    return (totalCorrect / totalQuestions) * 100;
  };

  const scorePercentage = calculateScore();
  const correctCount = quizData
    ? Object.keys(selectedAnswers).filter((qIdx) =>
        isCorrectAnswer(parseInt(qIdx)),
      ).length
    : 0;

  useEffect(() => {
    let confettiTimer: any;
    if (showResults && scorePercentage > 80) {
      confettiTimer = setTimeout(() => {
        setShowConfetti(true);
      }, 300);
    }
    return () => clearTimeout(confettiTimer);
  }, [showResults, scorePercentage]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: '80vh' }}
      >
        <CircularProgress />
      </div>
    );
  }

  const isLastQuestion =
    quizData && currentQuestionIndex === quizData.questions.length - 1;

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
            <div className="d-flex justify-content-between flex-wrap">
              <div className="">
                <Typography
                  variant="h4"
                  className="text-dark text-m-16"
                  fontWeight="bold"
                  gutterBottom
                >
                  {quizData?.title}
                </Typography>
                <Typography variant="body1" gutterBottom className="text-m-14">
                  {quizData?.instructions ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: quizData.instructions,
                      }}
                    />
                  ) : (
                    'Complete all questions. You can review your answers before final submission.'
                  )}
                </Typography>
                <small>
                  Duration: {quizData?.timer} minutes • Total Questions:{' '}
                  {quizData?.questions?.length} • Points: {quizData?.points}
                </small>
                <div className="d-flex justify-content-between my-3 align-items-center">
                  <small className="fw-medium d-block text-m-14">
                    Question {currentQuestionIndex + 1} of{' '}
                    {quizData?.questions.length}
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
            <Typography
              variant="body1"
              className="text-dark fs-5"
              gutterBottom
              style={preventCopySx}
              onCopy={(e: any) => e.preventDefault()}
            >
              {quizData?.questions[currentQuestionIndex].question}
            </Typography>
            <RadioGroup
              className="optiongrp"
              value={selectedAnswers[currentQuestionIndex] || ''}
              onChange={handleAnswerChange}
            >
              {quizData?.questions[currentQuestionIndex].options.map(
                (option: any, index: any) => {
                  const isLocked = lockedAnswers[currentQuestionIndex];
                  const correctAnswer =
                    quizData?.questions[currentQuestionIndex].answer;
                  const selectedAnswer = selectedAnswers[currentQuestionIndex];
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
                        width: '100%',
                        padding: '2px 10px 2px 5px',
                        border: isSubmit
                          ? isCorrect
                            ? '2px solid green'
                            : isSelectedWrong
                              ? '2px solid red'
                              : ''
                          : '',
                      }}
                      label={<div>{option}</div>}
                      disabled={isLocked}
                    />
                  );
                },
              )}
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
                disabled={
                  !selectedAnswers[currentQuestionIndex] || isLastQuestion
                }
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
                disabled={isSubmit}
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
                          <h2>{scorePercentage.toFixed(0)}%</h2>
                        </div>
                      </Box>
                    </Box>
                  </Box>
                  <p className="text-dark text-center fs-4 mt-4 fw-bold mb-1">
                    {getMessage(scorePercentage)}
                  </p>
                  <p className="text-center mb-4">
                    You&apos;ve completed the {quizData?.title}
                  </p>
                  <div className="card bg-primary-20 mb-0">
                    <div className="card-body">
                      <ul className="quizsubre">
                        <li>
                          <AccessTimeOutlined color="primary" />
                          <div className="">
                            <span>Time Taken:</span>
                            <span className="text-dark">
                              {((quizData?.timer * 60 - timeLeft) / 60).toFixed(
                                2,
                              )}{' '}
                              mins
                            </span>
                          </div>
                        </li>
                        <li>
                          <ForumIcon color="primary" />
                          <div className="">
                            <span>Questions:</span>
                            <span className="text-dark">
                              {correctCount}/{quizData?.questions.length}{' '}
                              Correct
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
                    onClick={() => navigate('/main/student/quiz')}
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
              {quizData?.questions.map((_q: any, index: any) => (
                <Grid item key={index} className="listit">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor:
                        currentQuestionIndex === index
                          ? '#9943EC'
                          : lockedAnswers[index] && isSubmit
                            ? isCorrectAnswer(index)
                              ? '#4CAF50'
                              : '#F44336'
                            : lockedAnswers[index]
                              ? '#4CAF50'
                              : '#9E9E9E',
                      color: 'white',
                    }}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
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
