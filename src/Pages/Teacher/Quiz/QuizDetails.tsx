/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import useApi from '../../../hooks/useAPI';
import { toast } from 'react-toastify';
import './QuizDetails.scss';
import { formatDateToIST } from '../../../utils/helpers';

const QuizDetailsModal = ({ open, onClose, quizId, quizTitle }: any) => {
  const { getData } = useApi();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem('isDarkMode');
    setDarkMode(storedMode === 'true');

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'isDarkMode') {
        setDarkMode(event.newValue === 'true');
      }
    };

    const handleCustomDarkModeChange = (event: CustomEvent) => {
      setDarkMode(event.detail === true);
    };

    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      originalSetItem.apply(this, [key, value]);

      if (key === 'isDarkMode') {
        setDarkMode(value === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(
      'darkModeChange',
      handleCustomDarkModeChange as EventListener,
    );

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(
        'darkModeChange',
        handleCustomDarkModeChange as EventListener,
      );
      localStorage.setItem = originalSetItem;
    };
  }, []);

  useEffect(() => {
    const checkDarkMode = () => {
      const currentSetting = localStorage.getItem('isDarkMode') === 'true';
      if (currentSetting !== darkMode) {
        setDarkMode(currentSetting);
      }
    };

    const intervalId = setInterval(checkDarkMode, 1000);

    return () => clearInterval(intervalId);
  }, [darkMode]);

  useEffect(() => {
    if (open && quizId) {
      fetchQuizDetails();
    }
  }, [open, quizId]);

  const fetchQuizDetails = async () => {
    try {
      setLoading(true);
      const response = await getData(`/quiz_submission/details/${quizId}`);
      if (response.status) {
        setSubmissions(response.data || []);
      } else {
        setSubmissions([]);
      }
    } catch (err) {
      toast.error('Error connecting to the server', {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
      console.error('Error fetching quiz details:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSuccessRate = () => {
    if (!submissions || submissions.length === 0) return '0%';
    const successfulSubmissions: any = submissions.filter(
      (submission) =>
        parseFloat(submission.result_points) >=
        parseFloat(submission.points) / 2,
    ).length;
    const rate = (successfulSubmissions / submissions.length) * 100;
    return `${rate.toFixed(1)}%`;
  };

  const calculateAverageScore = () => {
    if (!submissions || submissions.length === 0) return '0';
    const totalPoints: any = submissions.reduce(
      (acc, submission) => acc + parseFloat(submission.result_points || 0),
      0,
    );
    return (totalPoints / submissions.length).toFixed(1);
  };

  const calculateAverageTime = () => {
    if (!submissions || submissions.length === 0) return '0 mins';
    const totalTime: any = submissions.reduce(
      (acc, submission) => acc + parseFloat(submission.time_taken || 0),
      0,
    );
    return `${(totalTime / submissions.length).toFixed(2)} mins`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="quiz-details-dialog-title"
    >
      <DialogTitle id="quiz-details-dialog-title">
        <Box className="quiz-details-dialog__header">
          <Typography variant="h6">
            {quizTitle ? `Quiz Results: ${quizTitle.title}` : 'Quiz Results'}
          </Typography>
          <IconButton aria-label="close" onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box className="quiz-details-dialog__content--loading">
            <CircularProgress />
          </Box>
        ) : submissions.length === 0 ? (
          <Typography className="quiz-details-dialog__content--empty">
            No submissions found for this quiz.
          </Typography>
        ) : (
          <>
            <Box className="quiz-details-dialog__summary">
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Box
                className={`quiz-details-dialog__summary-container${
                  darkMode
                    ? ' quiz-details-dialog__summary-container--dark'
                    : ''
                }`}
              >
                <Box className="quiz-details-dialog__summary-box">
                  <Typography
                    variant="body2"
                    className={`quiz-details-dialog__summary-label${
                      darkMode ? '--dark' : ''
                    }`}
                  >
                    Total Submissions
                  </Typography>
                  <Typography
                    variant="h6"
                    className={`quiz-details-dialog__summary-value${
                      darkMode ? '--dark' : ''
                    }`}
                  >
                    {submissions.length}
                  </Typography>
                </Box>
                <Box className="quiz-details-dialog__summary-box">
                  <Typography
                    variant="body2"
                    className={`quiz-details-dialog__summary-label${
                      darkMode ? '--dark' : ''
                    }`}
                  >
                    Success Rate
                  </Typography>
                  <Typography
                    variant="h6"
                    className={`quiz-details-dialog__summary-value${
                      darkMode ? '--dark' : ''
                    }`}
                  >
                    {calculateSuccessRate()}
                  </Typography>
                </Box>
                <Box className="quiz-details-dialog__summary-box">
                  <Typography
                    variant="body2"
                    className={`quiz-details-dialog__summary-label${
                      darkMode ? '--dark' : ''
                    }`}
                  >
                    Average Score
                  </Typography>
                  <Typography
                    variant="h6"
                    className={`quiz-details-dialog__summary-value${
                      darkMode ? '--dark' : ''
                    }`}
                  >
                    {calculateAverageScore()}
                  </Typography>
                </Box>
                <Box className="quiz-details-dialog__summary-box">
                  <Typography
                    variant="body2"
                    className={`quiz-details-dialog__summary-label${
                      darkMode ? '--dark' : ''
                    }`}
                  >
                    Average Time
                  </Typography>
                  <Typography
                    variant="h6"
                    className={`quiz-details-dialog__summary-value${
                      darkMode ? '--dark' : ''
                    }`}
                  >
                    {calculateAverageTime()}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="h6" gutterBottom>
              Student Submissions
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead
                  className={`quiz-details-dialog__table-header${
                    darkMode ? ' quiz-details-dialog__table-header--dark' : ''
                  }`}
                >
                  <TableRow>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Submission Date</TableCell>
                    <TableCell>Time Taken</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((submission: any, index) => {
                    const firstName = submission.first_name || '';
                    const lastName = submission.last_name || '';
                    const submissionDate = submission.submission_date
                      ? formatDateToIST(submission.submission_date)
                      : 'N/A';
                    const timeTaken = submission.time_taken
                      ? `${submission.time_taken} mins`
                      : 'N/A';
                    const resultPoints = parseFloat(
                      submission.result_points || 0,
                    );
                    const totalPoints = parseFloat(submission.points || 0);
                    const scoreText = `${resultPoints}/${totalPoints}`;
                    const isPassed = resultPoints >= totalPoints / 2;
                    return (
                      <TableRow key={index} hover>
                        <TableCell>
                          {`${firstName} ${lastName}`.trim() ||
                            'Unknown Student'}
                        </TableCell>
                        <TableCell>{submissionDate}</TableCell>
                        <TableCell>{timeTaken}</TableCell>
                        <TableCell>{scoreText}</TableCell>
                        <TableCell>
                          <Typography
                            className={`quiz-details-dialog__table-status ${
                              isPassed
                                ? 'quiz-details-dialog__table-status--passed'
                                : 'quiz-details-dialog__table-status--failed'
                            }`}
                          >
                            {isPassed ? 'Passed' : 'Failed'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizDetailsModal;
