import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  //Card,
  //CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Avatar,
} from '@mui/material';
import {
  CheckCircle,
  BarChart,
  Event,
  AccessTime,
  ListAlt,
  Science,
  Functions,
  HistoryEdu,
} from '@mui/icons-material';
import { MaterialReactTable } from 'material-react-table';
const StudentQuiz = () => {
  const navigate = useNavigate();
  const quizId = 1;

  const quizStats = [
    {
      icon: <CheckCircle color="success" />,
      title: 'Completed Quizzes',
      value: 24,
    },
    {
      icon: <BarChart color="primary" />,
      title: 'Average Score',
      value: '85%',
    },
    { icon: <Event color="warning" />, title: 'Upcoming Quizzes', value: 5 },
  ];

  const activeQuizzes = [
    {
      subject: 'Biology',
      title: 'Cell Structure and Function',
      icon: <Science />,
      time: '45 mins',
      questions: 30,
    },
    {
      subject: 'Mathematics',
      title: 'Advanced Calculus',
      icon: <Functions />,
      time: '60 mins',
      questions: 25,
    },
    {
      subject: 'History',
      title: 'World War II',
      icon: <HistoryEdu />,
      time: '40 mins',
      questions: 35,
    },
  ];

  const recentResults = [
    {
      quiz: 'Chemistry Basics',
      date: 'Nov 15, 2023',
      score: '92%',
      time: '38 mins',
      status: 'Passed',
    },
    {
      quiz: 'Linear Algebra',
      date: 'Nov 14, 2023',
      score: '78%',
      time: '55 mins',
      status: 'Passed',
    },
    {
      quiz: 'English Literature',
      date: 'Nov 13, 2023',
      score: '65%',
      time: '42 mins',
      status: 'Failed',
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
          {/* Stats Section */}
          <Grid container spacing={2}>
            {quizStats.map((stat, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <div className="rounded-4 card">
                  <div className="card-body d-flex gap-3">
                    {stat.icon}
                    <Box>
                      <Typography variant="subtitle2" className='fs-6 fw-semibold text-'>{stat.title}</Typography>
                      <Typography variant="h6" className='fs-3 fw-bold text-dark lh-1 mt-2 mb-0'>{stat.value}</Typography>
                    </Box>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>

          {/* Active Quizzes */}
          <Typography variant="h6" sx={{ mt: 2 }} className="mb-2 fw-semibold">
            Active Quizzes
          </Typography>
          <Grid container spacing={2}>
            {activeQuizzes.map((quiz, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <div className="rounded-4 card">
                  <div className="card-body">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar>{quiz.icon}</Avatar>
                      <Typography variant="subtitle1" className='fw-semibold'>
                        {quiz.subject}
                      </Typography>
                    </Box>
                    <h6 className='mt-4 fw-semibold fs-5 text-dark'>
                      {quiz.title}
                    </h6>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      sx={{ mt: 1 }}
                    >
                      <div className='small'>
                        <AccessTime fontSize="small" /> {quiz.time}
                      </div>
                      <div className='small'>
                        <ListAlt fontSize="small" /> {quiz.questions} Questions
                      </div>
                    </Box>
                    <Button
                      variant="contained"
                      className="rounded-3"
                      fullWidth
                      sx={{ mt: 3 }}
                      onClick={() => navigate(`/main/student/quiz/${quizId}`)}
                    >
                      Start Quiz
                    </Button>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>

          {/* Recent Results */}
          <Typography variant="h6" sx={{ mt: 2 }} className="mb-2 fw-semibold">
            Recent Results
          </Typography>
          <div className="card rounded-4">
            <div className="card-body">
              <MaterialReactTable
                columns={[
                  { accessorKey: 'quiz', header: 'Quiz Name' },
                  { accessorKey: 'date', header: 'Date Taken' },
                  { accessorKey: 'score', header: 'Score' },
                  { accessorKey: 'time', header: 'Time Taken' },
                  {
                    accessorKey: 'status',
                    header: 'Status',
                    Cell: ({ cell }) => (
                      <Typography
                        color={
                          cell.getValue() === 'Failed' ? 'error' : 'success'
                        }
                      >
                        {cell.getValue()}
                      </Typography>
                    ),
                  },
                ]}
                data={recentResults}
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
