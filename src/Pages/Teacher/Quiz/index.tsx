/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import {
  QUERY_KEYS_CLASS,
  QUERY_KEYS_COURSE,
  QUERY_KEYS_QUIZ,
} from '../../../utils/const';
import { toast } from 'react-toastify';
import QuizDetailsModal from './QuizDetails';
import { DeleteDialog } from '../../../Components/Dailog/DeleteDialog';

const TeacherQuizPage = () => {
  const [quizData, setQuizData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataClasses, setDataClasses] = useState<any>([]);
  const [dataCourses, setDataCourses] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const { getData, deleteData } = useApi();
  const user_uuid = localStorage.getItem('user_uuid') || '';
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState({
    id: '',
    title: '',
  });
  const [dataDelete, setDataDelete] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState<any>();
  const current_time = new Date();
  const [statusFilter, setStatusFilter] = useState('all');

  const getCourseOrClassName = (id: string, type: string) => {
    if (type === 'school') {
      const currentClass = dataClasses?.classes_data?.find((cls: any) => {
        return cls.id == Number(id);
      });

      return currentClass?.class_name;
    } else if (type === 'college') {
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

  const openQuizDetails = (quizId: any, quizTitle: any) => {
    setSelectedQuiz({
      id: quizId,
      title: quizTitle,
    });
    setModalOpen(true);
  };

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      getData(`${QUERY_KEYS_QUIZ.GET_QUIZ_BY_TEACHER}${user_uuid}`).then(
        (response) => {
          const filtered = response?.data.map((quiz: any) => {
            const dueDate = new Date(quiz.due_date_time);

            if (dueDate < current_time) {
              quiz.status = 'closed';
            }

            if (quiz.course_semester_subjects) {
              const keys = Object.keys(quiz.course_semester_subjects);
              const firstKey = keys[0];
              const currentCourseName = getCourseOrClassName(
                firstKey,
                'college',
              );
              const semester = Object.keys(
                quiz?.course_semester_subjects[firstKey],
              )[0];
              const subjects =
                quiz?.course_semester_subjects[firstKey][semester];
              quiz.course = currentCourseName;
              quiz.semester = semester;
              quiz.subjects = subjects;
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
            }
            return quiz;
          });
          setQuizData(filtered);
          setLoading(false);
        },
      );
    } catch (err) {
      console.error('Error fetching quiz data:', err);
      toast.error('Error fetching quiz data', {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, [dataClasses, dataCourses]);

  // const subjects = [
  //   ...new Set(
  //     quizData.flatMap((quiz) =>
  //       quiz.class_stream_subjects.flatMap((entry: any) =>
  //         Object.values(entry).flatMap((streams: any) =>
  //           Object.values(streams).flat(),
  //         ),
  //       ),
  //     ),
  //   ),
  // ];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const day = date.getDate();
    const month = date.toLocaleString('en-IN', { month: 'short' });

    return `${hours}.${minutes} ${month} ${day}`;
  };

  const filteredQuizzes = quizData?.filter((quiz) => {
    const matchesSearch = quiz?.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubject =
      subjectFilter === 'all' || quiz.class_stream_subjects === subjectFilter;

    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'closed') {
        matchesStatus = quiz.status === 'closed';
      } else if (statusFilter === 'draft') {
        matchesStatus = quiz.save_draft === true;
      } else if (statusFilter === 'active') {
        matchesStatus = !quiz.save_draft && quiz.status !== 'closed';
      }
    }

    return matchesSearch && matchesSubject && matchesStatus;
  });

  const draftQuizzes = quizData.filter((quiz) => quiz.save_draft).length;
  const totalQuizzes = quizData.length;

  const handlecancel = () => {
    setDataDelete(false);
  };

  const handleDeleteFiles = (id: number) => {
    setDataDeleteId(id);
    setDataDelete(true);
  };

  const handleEditQuiz = async (id: number) => {
    const quiz = filteredQuizzes.find((quiz) => quiz.id === id);
    const response = await getData(`/quiz_submission/details/${id}`);

    const due_date_time = new Date(quiz?.due_date_time);
    const now = new Date();

    if (due_date_time <= now) {
      toast.error('You cannot Edit Closed Quiz', {
        hideProgressBar: true,
        theme: 'colored',
      });
      return;
    } else if (response.status && !quiz.is_multiple_attempt) {
      toast.error('You cannot Edit someone already submitted', {
        hideProgressBar: true,
        theme: 'colored',
      });
      return;
    } else {
      navigate(`/teacher-dashboard/edit-quiz/${id}`, {
        state: { type: 'quiz', edit: true },
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      deleteData(`${QUERY_KEYS_QUIZ.DELETE_QUIZ}${id}`).then((res) => {
        toast.error(res.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
        fetchQuizData();
        setDataDelete(false);
      });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Error deleting quiz', {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  return (
    <div className="main-wrapper pb-5 pb-lg-4">
      <div className="main-content">
        <div className="page-breadcrumb d-flex align-items-center ">
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

        <div className="row gy-4 mt-1">
          <div className="col-md-6 col-lg-3">
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
          <div className="col-md-6 col-lg-3">
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
                to="/teacher-dashboard/create-quiz"
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
                    {/* {subjects.map((subject, index) => (
                      <MenuItem key={index} value={subject}>
                        {subject}
                      </MenuItem> */}
                    {/* ))} */}
                  </TextField>
                </div>
                <div className="col-md-3">
                  <TextField fullWidth select label="All Grades" size="small">
                    <MenuItem value="all">All Grades</MenuItem>
                  </TextField>
                </div>
                <div className="col-md-3">
                  <TextField
                    fullWidth
                    select
                    label="All Status"
                    size="small"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
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
                      <div className="col-md-6 col-lg-3 col-xl-4" key={index}>
                        <div className="card mb-0 h-100">
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
                                label={
                                  quiz.status === 'closed'
                                    ? 'Closed'
                                    : quiz.save_draft
                                      ? 'Draft'
                                      : 'Active'
                                }
                                color={
                                  quiz.status === 'closed'
                                    ? 'error'
                                    : quiz.save_draft
                                      ? 'warning'
                                      : 'success'
                                }
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
                                onClick={() => handleEditQuiz(quiz.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                className="w-100"
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<Delete />}
                                onClick={() => handleDeleteFiles(quiz.id)}
                              >
                                Delete
                              </Button>
                              <Button
                                className="w-100"
                                variant="outlined"
                                size="small"
                                startIcon={<Assessment />}
                                onClick={() => {
                                  openQuizDetails(quiz.id, quiz);
                                }}
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
        <QuizDetailsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          quizId={selectedQuiz.id}
          quizTitle={selectedQuiz.title}
        />
        <DeleteDialog
          isOpen={dataDelete}
          onCancel={handlecancel}
          onDeleteClick={() => handleDelete(dataDeleteId)}
          title="Quiz"
        />
      </div>
    </div>
  );
};

export default TeacherQuizPage;
