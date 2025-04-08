/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SaveAsIcon from '@mui/icons-material/SaveAs';
// import axios from 'axios';

import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  AccessTime,
  CalendarToday,
  Edit,
  Delete,
  Assessment,
  QuestionAnswerOutlined,
} from '@mui/icons-material';
import useApi from '../../../hooks/useAPI';
import { QUERY_KEYS_CLASS, QUERY_KEYS_COURSE } from '../../../utils/const';

const TeacherQuizPage = () => {
  const [quizData, setQuizData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataClasses, setDataClasses] = useState<any>([]);
  const [dataCourses, setDataCourses] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const { getData } = useApi();

  const getCourseOrClassName = (id: string, type: string) => {
    console.log({ id, type });

    if (type === 'school') {
      const currentClass = dataClasses?.classes_data?.find((cls: any) => {
        return cls.id == Number(id);
      });

      return currentClass?.class_name;
    } else if (type === 'college') {
      console.log({ dataCourses });

      const course: any = dataCourses?.course_data?.find((course: any) => {
        return course.id == Number(id);
      });
      return course?.course_name;
    }
  };

  useEffect(() => {
    getData(`${QUERY_KEYS_CLASS.GET_CLASS}`).then((data) => {
      setDataClasses(data.data);
    });
    getData(`${QUERY_KEYS_COURSE.GET_COURSE}`).then((data) => {
      setDataCourses(data.data);
    });
  }, []);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);

        // const response = await axios.get('/api/quizzes');
        const response = {
          data: [
            {
              course_semester_subjects: {
                '5': {
                  '1': ['LLMs'],
                },
              },
              class_stream_subjects: null,
              title: 'Web Development Quiz for B.C.A',
              questions: [
                {
                  question:
                    "What is the purpose of the 'viewport' meta tag in HTML?",
                  options: [
                    'To set the page background color',
                    "To control the page's dimensions and scaling on different devices",
                    'To define the character encoding for the HTML document',
                    'To specify the document type',
                  ],
                  answer:
                    "To control the page's dimensions and scaling on different devices",
                  reason:
                    "The viewport meta tag helps ensure proper rendering on mobile devices by controlling the page's width and zoom level.",
                  marks: 1,
                },
                {
                  question:
                    'Which of the following is NOT a valid way to declare a variable in JavaScript?',
                  options: [
                    'let x = 5;',
                    'const y = 10;',
                    'var z = 15;',
                    'int w = 20;',
                  ],
                  answer: 'int w = 20;',
                  reason:
                    "JavaScript doesn't use 'int' for variable declaration. It uses 'let', 'const', or 'var'.",
                  marks: 1,
                },
                {
                  question: 'What does AJAX stand for in web development?',
                  options: [
                    'Asynchronous JavaScript and XML',
                    'Advanced JavaScript and XHTML',
                    'Automated JSON and XML',
                    'Active Java and XSLT',
                  ],
                  answer: 'Asynchronous JavaScript and XML',
                  reason:
                    'AJAX allows web pages to be updated asynchronously by exchanging data with a web server behind the scenes.',
                  marks: 1,
                },
                {
                  question:
                    'Which CSS property is used to create a flexible container?',
                  options: [
                    'flex-box',
                    'display: flex',
                    'flexible-container',
                    'flex-wrap',
                  ],
                  answer: 'display: flex',
                  reason:
                    "The 'display: flex' property establishes a flex container, enabling flexible box layout for its children.",
                  marks: 1,
                },
                {
                  question:
                    "What is the purpose of the 'use strict' directive in JavaScript?",
                  options: [
                    'To enable new ECMAScript features',
                    'To enforce stricter parsing and error handling',
                    'To improve performance',
                    'To enable browser compatibility mode',
                  ],
                  answer: 'To enforce stricter parsing and error handling',
                  reason:
                    "'use strict' enables strict mode, which catches common coding bloopers and prevents unsafe actions.",
                  marks: 1,
                },
                {
                  question: 'Which HTTP method is idempotent?',
                  options: ['POST', 'GET', 'PATCH', 'DELETE'],
                  answer: 'GET',
                  reason:
                    'GET requests are idempotent, meaning multiple identical requests should have the same effect as a single request.',
                  marks: 2,
                },
                {
                  question:
                    "What is the purpose of the 'localStorage' object in web browsers?",
                  options: [
                    'To store session data',
                    'To cache external resources',
                    'To store data with no expiration date',
                    'To manage browser cookies',
                  ],
                  answer: 'To store data with no expiration date',
                  reason:
                    'localStorage allows web applications to store key-value pairs in a web browser with no expiration date.',
                  marks: 2,
                },
                {
                  question:
                    'Which of the following is a valid way to include an external JavaScript file?',
                  options: [
                    "<script href='script.js'>",
                    "<script src='script.js'>",
                    "<javascript src='script.js'>",
                    "<link rel='script' href='script.js'>",
                  ],
                  answer: "<script src='script.js'>",
                  reason:
                    "The correct way to include an external JavaScript file is using the 'src' attribute in a <script> tag.",
                  marks: 3,
                },
                {
                  question:
                    "What does the 'async' attribute do in a script tag?",
                  options: [
                    'Executes the script immediately',
                    'Loads the script asynchronously and executes it immediately',
                    'Loads the script asynchronously and executes it when loaded',
                    'Prevents the script from loading',
                  ],
                  answer:
                    'Loads the script asynchronously and executes it when loaded',
                  reason:
                    "The 'async' attribute allows the script to be downloaded asynchronously without blocking page rendering, and executes as soon as it's available.",
                  marks: 3,
                },
                {
                  question:
                    'Which of the following is NOT a valid HTTP status code?',
                  options: [
                    '200 OK',
                    '404 Not Found',
                    '500 Internal Server Error',
                    '600 Server Timeout',
                  ],
                  answer: '600 Server Timeout',
                  reason:
                    '600 is not a standard HTTP status code. Valid status codes range from 100 to 599.',
                  marks: 3,
                },
              ],
              points: 18,
              allow_multiple_attempt: false,
              allow_late_submission: false,
              available_from: 'Tue, 08 Apr 2025 18:30:00 GMT',
              due_date_time: 'Wed, 09 Apr 2025 18:40:00 GMT',
              students: [
                '592c4e18-65fe-4bbe-8236-2ffeaa2ef73a',
                'af149e45-790a-4962-8489-5a3061b8fa05',
              ],
              add_to_report: true,
              notify: true,
              save_draft: false,
              timer: '60',
            },
            {
              course_semester_subjects: {
                '5': {
                  '2': ['Machine Learning'],
                },
              },
              class_stream_subjects: null,
              title: 'Web Development Quiz for B.C.A',
              questions: [
                {
                  question:
                    "What is the purpose of the 'viewport' meta tag in HTML?",
                  options: [
                    'To set the page background color',
                    "To control the page's dimensions and scaling on different devices",
                    'To define the character encoding for the HTML document',
                    'To specify the document type',
                  ],
                  answer:
                    "To control the page's dimensions and scaling on different devices",
                  reason:
                    "The viewport meta tag helps ensure proper rendering on mobile devices by controlling the page's width and zoom level.",
                  marks: 1,
                },
                {
                  question:
                    'Which of the following is NOT a valid way to declare a variable in JavaScript?',
                  options: [
                    'let x = 5;',
                    'const y = 10;',
                    'var z = 15;',
                    'int w = 20;',
                  ],
                  answer: 'int w = 20;',
                  reason:
                    "JavaScript doesn't use 'int' for variable declaration. It uses 'let', 'const', or 'var'.",
                  marks: 1,
                },
                {
                  question: 'What does AJAX stand for in web development?',
                  options: [
                    'Asynchronous JavaScript and XML',
                    'Advanced JavaScript and XHTML',
                    'Automated JSON and XML',
                    'Active Java and XSLT',
                  ],
                  answer: 'Asynchronous JavaScript and XML',
                  reason:
                    'AJAX allows web pages to be updated asynchronously by exchanging data with a web server behind the scenes.',
                  marks: 1,
                },
                {
                  question:
                    'Which CSS property is used to create a flexible container?',
                  options: [
                    'flex-box',
                    'display: flex',
                    'flexible-container',
                    'flex-wrap',
                  ],
                  answer: 'display: flex',
                  reason:
                    "The 'display: flex' property establishes a flex container, enabling flexible box layout for its children.",
                  marks: 1,
                },
                {
                  question:
                    "What is the purpose of the 'use strict' directive in JavaScript?",
                  options: [
                    'To enable new ECMAScript features',
                    'To enforce stricter parsing and error handling',
                    'To improve performance',
                    'To enable browser compatibility mode',
                  ],
                  answer: 'To enforce stricter parsing and error handling',
                  reason:
                    "'use strict' enables strict mode, which catches common coding bloopers and prevents unsafe actions.",
                  marks: 1,
                },
                {
                  question: 'Which HTTP method is idempotent?',
                  options: ['POST', 'GET', 'PATCH', 'DELETE'],
                  answer: 'GET',
                  reason:
                    'GET requests are idempotent, meaning multiple identical requests should have the same effect as a single request.',
                  marks: 2,
                },
                {
                  question:
                    "What is the purpose of the 'localStorage' object in web browsers?",
                  options: [
                    'To store session data',
                    'To cache external resources',
                    'To store data with no expiration date',
                    'To manage browser cookies',
                  ],
                  answer: 'To store data with no expiration date',
                  reason:
                    'localStorage allows web applications to store key-value pairs in a web browser with no expiration date.',
                  marks: 2,
                },
                {
                  question:
                    'Which of the following is a valid way to include an external JavaScript file?',
                  options: [
                    "<script href='script.js'>",
                    "<script src='script.js'>",
                    "<javascript src='script.js'>",
                    "<link rel='script' href='script.js'>",
                  ],
                  answer: "<script src='script.js'>",
                  reason:
                    "The correct way to include an external JavaScript file is using the 'src' attribute in a <script> tag.",
                  marks: 3,
                },
                {
                  question:
                    "What does the 'async' attribute do in a script tag?",
                  options: [
                    'Executes the script immediately',
                    'Loads the script asynchronously and executes it immediately',
                    'Loads the script asynchronously and executes it when loaded',
                    'Prevents the script from loading',
                  ],
                  answer:
                    'Loads the script asynchronously and executes it when loaded',
                  reason:
                    "The 'async' attribute allows the script to be downloaded asynchronously without blocking page rendering, and executes as soon as it's available.",
                  marks: 3,
                },
                {
                  question:
                    'Which of the following is NOT a valid HTTP status code?',
                  options: [
                    '200 OK',
                    '404 Not Found',
                    '500 Internal Server Error',
                    '600 Server Timeout',
                  ],
                  answer: '600 Server Timeout',
                  reason:
                    '600 is not a standard HTTP status code. Valid status codes range from 100 to 599.',
                  marks: 3,
                },
              ],
              points: 18,
              allow_multiple_attempt: false,
              allow_late_submission: false,
              available_from: 'Tue, 08 Apr 2025 18:30:00 GMT',
              due_date_time: 'Wed, 09 Apr 2025 18:40:00 GMT',
              students: [
                '592c4e18-65fe-4bbe-8236-2ffeaa2ef73a',
                'af149e45-790a-4962-8489-5a3061b8fa05',
              ],
              add_to_report: true,
              notify: true,
              save_draft: true,
              timer: 60,
            },
          ],
        };

        const filtered = response.data.map((quiz: any) => {
          if (quiz.course_semester_subjects) {
            const keys = Object.keys(quiz.course_semester_subjects);
            const firstKey = keys[0];

            const currentCourseName = getCourseOrClassName(firstKey, 'college');

            const semester = Object.keys(
              quiz?.course_semester_subjects[firstKey],
            )[0];
            const subjects = quiz?.course_semester_subjects[firstKey][semester];

            quiz.course = currentCourseName;
            quiz.semester = semester;
            quiz.subjects = subjects;
            console.log({ firstKey, currentCourseName, semester, subjects });
          }
          if (quiz?.class_stream_subjects) {
            const schoolKey = Object.keys(quiz?.class_stream_subjects);
            const firstSchoolKey = schoolKey[0];

            const currentClassName = getCourseOrClassName(
              firstSchoolKey,
              'school',
            );

            const stream = Object.keys(
              quiz?.class_stream_subjects[firstSchoolKey],
            )[0];
            const subjects =
              quiz?.class_stream_subjects[firstSchoolKey][stream];

            quiz.class = currentClassName;
            quiz.stream = stream;
            quiz.subjects = subjects;
            console.log({ firstSchoolKey, currentClassName, subjects });
          }
          return quiz;
        });
        console.log({ filtered });

        setQuizData(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz data:', err);

        setLoading(false);
      }
    };

    fetchQuizData();
  }, [dataClasses, dataCourses]);

  // Extract unique subjects and grades for filters
  const subjects = [
    ...new Set(quizData.map((quiz) => quiz.class_stream_subjects)),
  ];

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const day = date.getDate();
    const month = date.toLocaleString('en-IN', { month: 'short' });

    return `${hours}.${minutes} ${month} ${day}`;
  };

  // Filter quizzes based on search and filters
  const filteredQuizzes = quizData.filter((quiz) => {
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubject =
      subjectFilter === 'all' || quiz.class_stream_subjects === subjectFilter;
    // Add more filters as needed

    return matchesSearch && matchesSubject;
  });

  const draftQuizzes = quizData.filter((quiz) => quiz.save_draft).length;
  const totalQuizzes = quizData.length;
  console.log({ quizData, totalQuizzes, draftQuizzes });

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
                    <h3 className="mb-0">{totalQuizzes}</h3>
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
                    <h3 className="mb-0">{draftQuizzes}</h3>
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
            <hr className="my-0" />
          </div>
          <div className="col-lg-12">
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="mb-0 fw-bold">Quiz List</h4>
              <Link
                to="/teacher-dashboard/create-assignment"
                state={{ type: 'quiz' }}
                className="btn btn-primary"
              >
                Create Quiz
              </Link>
            </div>
          </div>
          <div className="col-lg-12">
            <Box>
              {/* Filters */}
              <div className="row g-2 mb-4">
                <div className="col-md-3">
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search quizzes..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <TextField
                    fullWidth
                    select
                    label="All Subjects"
                    size="small"
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Subjects</MenuItem>
                    {subjects.map((subject, index) => (
                      <MenuItem key={index} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
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
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                  </TextField>
                </div>
              </div>

              {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              )}

              {!loading && (
                <div className="row g-3">
                  {filteredQuizzes.length > 0 ? (
                    filteredQuizzes.map((quiz, index) => (
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
                                label={quiz.save_draft ? 'Draft' : 'Active'}
                                color={quiz.save_draft ? 'warning' : 'success'}
                                size="small"
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mt={1}
                            >
                              {quiz.course ? quiz.course : quiz.class}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mt={1}
                            >
                              {quiz.semester
                                ? `Semester ${quiz.semester}`
                                : `Stream ${quiz.stream}`}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mt={1}
                            >
                              {quiz?.subjects?.map((sub: any) => sub)}
                            </Typography>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              mt={1.5}
                            >
                              <QuestionAnswerOutlined fontSize="small" />
                              <Typography variant="body2">
                                {quiz.questions?.length || 0} Questions
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
                                {quiz.timer || 0} Minutes
                              </Typography>
                            </Stack>

                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              mt={0.5}
                            >
                              <CalendarToday fontSize="small" />
                              <Typography variant="body2">
                                Due: {formatDate(quiz.due_date_time)}
                              </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} mt={2.5}>
                              <Button
                                className="w-100"
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<Edit />}
                              >
                                Edit
                              </Button>
                              <Button
                                className="w-100"
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<Delete />}
                              >
                                Delete
                              </Button>
                              <Button
                                className="w-100"
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
                    ))
                  ) : (
                    <Box textAlign="center" my={4}>
                      <Typography>No quizzes found</Typography>
                    </Box>
                  )}
                </div>
              )}
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherQuizPage;
