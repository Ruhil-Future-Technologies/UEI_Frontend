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

const QuizDetailsModal = ({ open, onClose, quizId, quizTitle }: any) => {
  const { getData } = useApi();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);

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
        <Box display="flex" justifyContent="space-between" alignItems="center">
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
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : submissions.length === 0 ? (
          <Typography align="center" sx={{ py: 4 }}>
            No submissions found for this quiz.
          </Typography>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: '#f5f5f5',
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Submissions
                  </Typography>
                  <Typography variant="h6">{submissions.length}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Success Rate
                  </Typography>
                  <Typography variant="h6">{calculateSuccessRate()}</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Average Score
                  </Typography>
                  <Typography variant="h6">
                    {calculateAverageScore()}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Average Time
                  </Typography>
                  <Typography variant="h6">{calculateAverageTime()}</Typography>
                </Box>
              </Box>
            </Box>

            <Typography variant="h6" gutterBottom>
              Student Submissions
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
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
                      ? new Date(submission.submission_date).toLocaleString()
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
                            color={isPassed ? 'success.main' : 'error.main'}
                            sx={{ fontWeight: 'medium' }}
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
