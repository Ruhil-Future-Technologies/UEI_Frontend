/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Typography,
  Button,
  Grid,
  Box,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle,
  Event,
  AccessTime,
  ListAlt,
  MenuBook,
} from '@mui/icons-material';
import { MaterialReactTable } from 'material-react-table';
import { toast } from 'react-toastify';
import useApi from '../../../hooks/useAPI';
import { QUERY_KEYS_QUIZ } from '../../../utils/const';

const StudentQuiz = () => {
  const { getData } = useApi();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState({
    activeQuizzes: [],
    upcomingQuizzes: [],
    recentResults: [],
  });
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    completed: 0,
  });

  const studentId = localStorage.getItem('_id') || 'student_Id';
  const GET_QUIZ_STUDENT = QUERY_KEYS_QUIZ.GET_QUIZ_STUDENT;
  const GET_SUBMISSION = QUERY_KEYS_QUIZ.GET_SUBMISSION;
  const current_time = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const quizResponse = await getData(`${GET_QUIZ_STUDENT}/${studentId}`);

        const submissionsResponse = await getData(
          `${GET_SUBMISSION}/${studentId}`,
        );

        if (quizResponse?.status) {
          processQuizData(quizResponse?.data);
        }

        if (submissionsResponse?.status) {
          processSubmissionsData(submissionsResponse?.data);
        }
      } catch (err) {
        toast.error('Error fetching quiz data', {
          hideProgressBar: true,
          theme: 'colored',
        });
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processQuizData = (data: any) => {
    const currentDate = new Date();
    const active: any = [];
    const upcoming: any = [];

    data.forEach((quiz: any) => {
      const availableFromDate = new Date(quiz.available_from);

      let subjectName = 'General';
      if (quiz?.course_semester_subjects) {
        const courseKeys = Object.keys(quiz?.course_semester_subjects);
        if (courseKeys.length > 0) {
          const semesterKeys = Object.keys(
            quiz?.course_semester_subjects[courseKeys[0]],
          );
          if (semesterKeys?.length > 0) {
            subjectName =
              quiz?.course_semester_subjects[courseKeys[0]][
                semesterKeys[0]
              ][0] || 'General';
          }
        }
      }
      if (quiz?.class_stream_subjects) {
        const classKeys = Object.keys(quiz?.class_stream_subjects);
        if (classKeys.length > 0) {
          const streamKeys = Object.keys(
            quiz?.class_stream_subjects[classKeys[0]],
          );
          if (streamKeys?.length > 0) {
            subjectName =
              quiz?.class_stream_subjects[classKeys[0]][streamKeys[0]][0] ||
              'General';
          }
        }
      }
      const processedQuiz = {
        id: quiz.id,
        subject: subjectName,
        title: quiz.title,
        icon: <MenuBook />,
        time: `${quiz.timer} mins`,
        questions: quiz.questions.length,
        instructions: quiz.instructions,
        availableFrom: new Date(quiz.available_from),
        dueDate: new Date(quiz.due_date_time),
      };

      if (availableFromDate <= currentDate) {
        active.push(processedQuiz);
      } else {
        upcoming.push(processedQuiz);
      }
    });

    setQuizData((prevData) => ({
      ...prevData,
      activeQuizzes: active,
      upcomingQuizzes: upcoming,
    }));

    setStats((prevStats) => ({
      ...prevStats,
      active: active.length,
      upcoming: upcoming.length,
    }));
  };

  const processSubmissionsData = (data: any) => {
    if (!data || !Array.isArray(data)) {
      return;
    }

    const formattedResults = data.map(async (submission) => {
      const dateTaken = new Date(submission.created_at);
      let subject = '';

      if (submission && submission.course_semester_subjects) {
        const courseKey = Object.keys(submission?.course_semester_subjects)[0];
        const semesterKey = Object.keys(
          submission?.course_semester_subjects[courseKey],
        )[0];
        subject =
          submission?.course_semester_subjects[courseKey][semesterKey][0];
      } else if (submission && submission.class_stream_subjects) {
        const classKey = Object.keys(submission?.class_stream_subjects)[0];
        const streamKey = Object.keys(
          submission?.class_stream_subjects[classKey],
        )[0];
        subject = submission?.class_stream_subjects[classKey][streamKey][0];
      }

      let isPastDue = false;
      try {
        const quizResponse = await getData(`/quiz/get/${submission.quiz_id}`);
        const quizData = quizResponse?.data;
        if (quizData?.due_date_time) {
          const dueDate = new Date(quizData.due_date_time);
          isPastDue = dueDate < current_time;
        }
      } catch (error) {
        console.error('Error fetching quiz data for submission:', error);
      }

      return {
        id: submission.id,
        quiz_id: submission.quiz_id,
        quiz: submission.quiz_title,
        subject: subject,
        date: dateTaken.toLocaleString(),
        score: `${submission.result_points}/${submission.points}`,
        totalQuestions: submission.total_questions,
        correctAnswers: submission.correct_answers,
        timeTaken: `${submission.time_taken} mins`,
        isMultipleAttempt: submission.is_multiple_attempt,
        isPastDue: isPastDue,
      };
    });

    Promise.all(formattedResults).then((resolvedResults) => {
      setQuizData((prevData: any) => ({
        ...prevData,
        recentResults: resolvedResults,
      }));

      setStats((prevStats) => ({
        ...prevStats,
        completed: resolvedResults.length,
      }));
    });
  };

  const startQuiz = (quizId: any) => {
    navigate(`/main/student/quiz/${quizId}`);
  };

  const retakeQuiz = (quizId: any) => {
    const quiz = quizData.activeQuizzes.find((quiz: any) => quiz.id === quizId);

    if (quiz) {
      navigate(`/main/student/quiz/${quizId}`);
    } else {
      toast.error('Quiz Due Date Time has been passed.', {
        hideProgressBar: true,
        theme: 'colored',
      });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const quizStats = [
    {
      icon: <CheckCircle color="success" />,
      title: 'Active Quizzes',
      value: stats.active,
    },
    {
      icon: <Event color="warning" />,
      title: 'Upcoming Quizzes',
      value: stats.upcoming,
    },
    {
      icon: <ListAlt color="info" />,
      title: 'Completed Quizzes',
      value: stats.completed,
    },
  ];

  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center ">
          <div className="breadcrumb-title pe-3">
            <Link to={'/main/dashboard'} className="text-dark">
              Dashboard
            </Link>
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

        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {quizStats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <div className="rounded-4 card">
                  <div className="card-body d-flex gap-3">
                    {stat.icon}
                    <Box>
                      <Typography
                        variant="subtitle2"
                        className="fs-6 fw-semibold text-"
                      >
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="h6"
                        className="fs-3 fw-bold text-dark lh-1 mt-2 mb-0"
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" sx={{ mt: 4 }} className="mb-2 fw-semibold">
            Active Quizzes
          </Typography>
          {quizData.activeQuizzes.length > 0 ? (
            <Grid container spacing={2}>
              {quizData.activeQuizzes.map((quiz: any, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <div className="rounded-4 card">
                    <div className="card-body">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar>{quiz.icon}</Avatar>
                        <Typography variant="subtitle1" className="fw-semibold">
                          {quiz.subject}
                        </Typography>
                      </Box>
                      <h6 className="mt-4 fw-semibold fs-5 text-dark">
                        {quiz.title}
                      </h6>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        sx={{ mt: 1 }}
                      >
                        <div className="small">
                          <AccessTime fontSize="small" /> {quiz.time}
                        </div>
                        <div className="small">
                          <ListAlt fontSize="small" /> {quiz.questions}{' '}
                          Questions
                        </div>
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Due: {quiz.dueDate.toLocaleString()}
                      </Typography>
                      <Button
                        variant="contained"
                        className="rounded-3"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => startQuiz(quiz.id)}
                      >
                        Start Quiz
                      </Button>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, mb: 4 }}
            >
              No active quizzes available at the moment.
            </Typography>
          )}

          <Typography variant="h6" sx={{ mt: 4 }} className="mb-2 fw-semibold">
            Upcoming Quizzes
          </Typography>
          {quizData.upcomingQuizzes.length > 0 ? (
            <Grid container spacing={2}>
              {quizData.upcomingQuizzes.map((quiz: any, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <div className="rounded-4 card">
                    <div className="card-body">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar>{quiz.icon}</Avatar>
                        <Typography variant="subtitle1" className="fw-semibold">
                          {quiz.subject}
                        </Typography>
                      </Box>
                      <h6 className="mt-4 fw-semibold fs-5 text-dark">
                        {quiz.title}
                      </h6>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        sx={{ mt: 1 }}
                      >
                        <div className="small">
                          <AccessTime fontSize="small" /> {quiz.time}
                        </div>
                        <div className="small">
                          <ListAlt fontSize="small" /> {quiz.questions}{' '}
                          Questions
                        </div>
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Available from: {quiz.availableFrom.toLocaleString()}
                      </Typography>
                      <Button
                        variant="outlined"
                        className="rounded-3"
                        fullWidth
                        sx={{ mt: 2 }}
                        disabled
                      >
                        Not Yet Available
                      </Button>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2, mb: 4 }}
            >
              No upcoming quizzes scheduled.
            </Typography>
          )}

          <Typography variant="h6" sx={{ mt: 4 }} className="mb-2 fw-semibold">
            Recent Results
          </Typography>
          <div className="card rounded-4">
            <div className="">
              <MaterialReactTable
                columns={[
                  { accessorKey: 'quiz', header: 'Quiz Name', size: 350 },
                  { accessorKey: 'subject', header: 'Subject', size: 200 },
                  { accessorKey: 'date', header: 'Date Taken', size: 200 },
                  { accessorKey: 'score', header: 'Score' },
                  {
                    accessorKey: 'totalQuestions',
                    header: 'Total Questions',
                    size: 200,
                  },
                  {
                    accessorKey: 'correctAnswers',
                    header: 'Correct Answers',
                    size: 200,
                  },
                  { accessorKey: 'timeTaken', header: 'Time Taken' },
                  {
                    accessorKey: 'action',
                    header: 'Action',
                    Cell: ({ row }: any) => (
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        disabled={
                          !row.original.isMultipleAttempt ||
                          row.original.isPastDue
                        }
                        onClick={() => retakeQuiz(row.original.quiz_id)}
                      >
                        Reattempt
                      </Button>
                    ),
                  },
                ]}
                data={quizData.recentResults}
                enableColumnResizing
                muiTableBodyRowProps={{ hover: true }}
              />
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default StudentQuiz;
