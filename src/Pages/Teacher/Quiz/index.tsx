import React from 'react';
import { Link } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SaveAsIcon from '@mui/icons-material/SaveAs';

import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  Stack,
} from '@mui/material';
import {
  AccessTime,
  CalendarToday,
  Edit,
  Delete,
  Assessment,
  QuestionAnswerOutlined,
} from '@mui/icons-material';

const quizData = Array.from({ length: 6 }).map((_, i) => ({
  title: `Mathematics Quiz #${i + 1}`,
  grade: 'Grade 10',
  subject: 'Algebra',
  questions: 15,
  duration: '45 Minutes',
  date: 'Dec 15, 2023',
  status: 'Active',
}));

const TeacherQuizPage = () => {
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
                  All Quizzes
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row gy-4 mt-4">
          <div className="col-lg-3">
            <div className="card rounded-4 w-100 mb-0">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <p className="mb-1">Total Quizzes</p>
                    <h3 className="mb-0">32</h3>
                  </div>
                  <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-danger">
                    <AssignmentIcon className="svgwhite" />
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3 gap-2">
                  <div className="card-lable bg-success bg-opacity-10">
                    <p className="text-success mb-0">+34.7%</p>
                  </div>
                  <p className="mb-0 font-13">from last month</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card rounded-4 w-100 mb-0">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <p className="mb-1">Draft Quizzes</p>
                    <h3 className="mb-0">56</h3>
                  </div>
                  <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-danger">
                    <SaveAsIcon className="svgwhite" />
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3 gap-2">
                  <div className="card-lable bg-success bg-opacity-10">
                    <p className="text-success mb-0">+34.7%</p>
                  </div>
                  <p className="mb-0 font-13">from last month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <hr className='my-0' />
          </div>
          <div className="col-lg-12">
            <div className="d-flex align-items-center justify-content-between">
              <h4 className='mb-0 fw-bold'>Quizzes List</h4>
              <Link
            to="/teacher-dashboard/create-assignment"
            className="btn btn-primary"
          >
            Create New Quiz
          </Link>
              
            </div>
            
          </div>
          <div className="col-lg-12">
            <Box >
              {/* Filters */}
              <div className="row g-2 mb-4">
                <div className="col-md-3">
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search quizzes..."
                    size="small"
                  />
                </div>
                <div className="col-md-3">
                  <TextField fullWidth select label="All Subjects" size="small">
                    <MenuItem value="all">All Subjects</MenuItem>
                  </TextField>
                </div>
                <div className="col-md-3">
                  <TextField fullWidth select label="All Grades" size="small">
                    <MenuItem value="all">All Grades</MenuItem>
                  </TextField>
                </div>
                <div className="col-md-3">
                  <TextField fullWidth select label="All Status" size="small">
                    <MenuItem value="all">All Status</MenuItem>
                  </TextField>
                </div>
              </div>

              {/* Quiz Cards Grid */}
              <div className="row g-3">
                {quizData.map((quiz, index) => (
                  <div className="col-md-4" key={index}>
                    <div className="card mb-0">
                      <div className="card-body">
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography fontWeight="bold">
                            {quiz.title}
                          </Typography>
                          <Chip
                            label={quiz.status}
                            color="success"
                            size="small"
                          />
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mt={1}
                        >
                          {quiz.grade} • {quiz.subject}
                        </Typography>

                        
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          mt={1.5}
                        >
                          <QuestionAnswerOutlined fontSize="small" />
                          <Typography variant="body2">
                          {quiz.questions} Questions
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          mt={0.5}
                        >
                          <AccessTime fontSize="small" />
                          <Typography variant="body2">
                            {quiz.duration}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          mt={0.5}
                        >
                          <CalendarToday fontSize="small" />
                          <Typography variant="body2">{quiz.date}</Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} mt={2.5}>
                          <Button
                            className='w-100'
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<Edit />}
                          >
                            Edit
                          </Button>
                          <Button
                          className='w-100'
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Delete />}
                          >
                            Delete
                          </Button>
                          <Button
                          className='w-100'
                            variant="outlined"
                            size="small"
                            startIcon={<Assessment />}
                          >
                            Results
                          </Button>
                        </Stack>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Box>
          </div>
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
