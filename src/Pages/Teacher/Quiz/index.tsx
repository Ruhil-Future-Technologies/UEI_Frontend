/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useContext } from 'react';
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
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';
import {
  AccessTime,
  // CalendarToday,
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
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL,
} from '../../../utils/const';
import { toast } from 'react-toastify';
import QuizDetailsModal from './QuizDetails';
import { DeleteDialog } from '../../../Components/Dailog/DeleteDialog';
import { CourseRep0oDTO, IClass, SemesterRep0oDTO, SubjectRep0oDTO, } from '../../../Components/Table/columns';
import { fieldIcon, formatDate, inputfield, inputfieldhover, inputfieldtext } from '../../../utils/helpers';
import NameContext from '../../Context/NameContext';
import { Boxes, BoxesForSchool } from '../../TeacherRgistrationForm';

const TeacherQuizPage = () => {
  const [quizData, setQuizData] = useState<any[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataClasses, setDataClasses] = useState<any>([]);
  const [dataCourses, setDataCourses] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState('');
  // const [subjectFilter, setSubjectFilter] = useState('all');
  const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;
  const { getData, deleteData } = useApi();
  const user_uuid = localStorage.getItem('user_uuid') || '';
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState({
    id: '',
    title: '',
  });
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;
  const getsubjectSchool = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;
  const getSubjectCollege = QUERY_KEYS_SUBJECT.GET_SUBJECT;
  const [teacherCourse, setTeacherCourse] = useState<string[]>();
  const [statusFilter, setStatusFilter] = useState('');
  const [teacherSemester, setTeacherSemester] = useState<string[]>();
  const [tescherSubjects, setTeacherSubjects] = useState<string[]>();
  const [teacherStream, setTeacherStream] = useState<string[]>();
  const [dataClass, setDataClass] = useState<IClass[]>([]);
  const [filteredcoursesData, setFilteredCoursesData] = useState<
    CourseRep0oDTO[]
  >([]);
  const [semesterData, setSemesterData] = useState<SemesterRep0oDTO[]>([]);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [totleSubject, setTotleSubject] = useState<SubjectRep0oDTO[]>([]);
  const [tescherSchoolSubjects, setTeacherSchoolSubjects] =
    useState<string[]>();
  const [boxes, setBoxes] = useState<Boxes[]>([
    {
      semester_number: '',
      subjects: [],
      course_id: '',
    },
  ]);
  const [boxesForSchool, setBoxesForSchool] = useState<BoxesForSchool[]>([
    {
      stream: '',
      subjects: [],
      class_id: '',
      is_Stream: false,
      selected_class_name: 'col-3',
    },
  ]);

  const [dataDelete, setDataDelete] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState<any>();
  const current_time = new Date();

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
  const optionOfStatus = [
    { label: 'All', value: 'all' },
    {
      label: 'Closed',
      value: 'closed',
    },
    {
      label: 'Draft',
      value: 'draft',
    },
    { label: 'Active', value: 'active' },
  ];

  useEffect(() => {
    getData(`${QUERY_KEYS_CLASS.GET_CLASS}`).then((data) => {
      setDataClasses(data.data);
    });
    getData(`${QUERY_KEYS_COURSE.GET_COURSE}`).then((data) => {
      setDataCourses(data.data);
    });
    getTeacherProfileInfo();
    getSemester();
    getCourses();
  }, []);
  const getTeacherProfileInfo = async () => {
    try {
      getData(`/teacher/edit/${user_uuid}`).then(async (data) => {
        if (data?.status) {
          if (data.data.course_semester_subjects != null) {
            setSelectedEntity('College');
            getSubjects('college');
            const courseKeys = Object.keys(data.data.course_semester_subjects);
            // Extract all semester IDs for each course
            const semesterKeys = Object.values(
              data.data.course_semester_subjects as Record<
                string,
                Record<string, any>
              >,
            ).flatMap((semesters) => Object.keys(semesters));
            setTeacherSemester(semesterKeys);

            const semesterSubjects = Object.entries(
              data.data.course_semester_subjects as Record<
                string,
                Record<string, string[]>
              >,
            ).flatMap(([semester, subjects]) =>
              Object.values(subjects).flatMap((subjectList) =>
                Array.isArray(subjectList)
                  ? subjectList?.map((subject) => ({ semester, subject }))
                  : [],
              ),
            );
            setTeacherSubjects(semesterSubjects?.map(({ subject }) => subject));

            setTeacherCourse((prev) => [...(prev || []), ...courseKeys]);
          } else {
            setSelectedEntity('School');
            getSubjects('school');
            const streeamKeys = Object.values(
              data.data.class_stream_subjects as Record<
                string,
                Record<string, any>
              >,
            ).flatMap((streamkeys) => Object.keys(streamkeys));

            const uniqueStreamKeys = [...new Set(streeamKeys)];

            setTeacherStream(uniqueStreamKeys);

            const classIds = Object.keys(data.data.class_stream_subjects)?.map(
              (classKey) => parseInt(classKey, 10),
            );
            //setBoxesForSchool(output);
            getClasslist(classIds);

            const Subjects = Object.entries(
              data.data.class_stream_subjects as Record<
                string,
                Record<string, string[]>
              >,
            ).flatMap(
              (
                [, subjects], // Ignore the first key (e.g., "8")
              ) =>
                Object.entries(subjects).flatMap(([streamName, subjectArray]) =>
                  subjectArray?.map((subject) => ({
                    stream: streamName,
                    subject,
                  })),
                ),
            );

            setTeacherSchoolSubjects(Subjects?.map(({ subject }) => subject));
          }
        }
      });
    } catch (error: any) {
      toast.error(error?.message, {
        hideProgressBar: true,
        theme: 'colored',
      });
    }
  };
  const openQuizDetails = (quizId: any, quizTitle: any) => {
    setSelectedQuiz({
      id: quizId,
      title: quizTitle,
    });
    setModalOpen(true);
  };
  const getClasslist = (classIds: any) => {
    getData(`${ClassURL}`)
      .then((data) => {
        if (data.status) {
          const filteredClasses = data?.data?.classes_data.filter(
            (classn: any) => classIds.includes(classn.id),
          );
          setDataClass(filteredClasses);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
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
          setFilteredQuizzes(filtered);
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

  const handleStatus = (status: string) => {
    setStatusFilter(status);
    let matchesStatus = [];
    if (selectedEntity == 'School') {
      if (status == 'all') {
        matchesStatus = quizData.filter((quiz) => {
          const classId = Object.keys(quiz?.class_stream_subjects)[0];
          const stream = Object.keys(quiz?.class_stream_subjects?.[classId])[0];
          const subjects =
            quiz?.class_stream_subjects?.[classId]?.[stream] || [];
          return boxesForSchool[0].subjects.length > 0
            ? subjects.includes(boxesForSchool[0].subjects) &&
                classId == boxesForSchool[0].class_id
            : true;
        });
      } else if (status === 'closed') {
        matchesStatus = quizData.filter((quiz) => {
          const classId = Object.keys(quiz?.class_stream_subjects)[0];
          const stream = Object.keys(quiz?.class_stream_subjects?.[classId])[0];
          const subjects =
            quiz?.class_stream_subjects?.[classId]?.[stream] || [];
          return (
            quiz.status == 'closed' &&
            (boxesForSchool[0].subjects.length > 0
              ? subjects.includes(boxesForSchool[0].subjects) &&
                classId == boxesForSchool[0].class_id
              : true)
          );
        });
      } else if (status === 'draft') {
        matchesStatus = quizData.filter((quiz) => {
          const classId = Object.keys(quiz?.class_stream_subjects)[0];
          const stream = Object.keys(quiz?.class_stream_subjects?.[classId])[0];
          const subjects =
            quiz?.class_stream_subjects?.[classId]?.[stream] || [];
          return (
            quiz.save_draft === true &&
            (boxesForSchool[0].subjects.length > 0
              ? subjects.includes(boxesForSchool[0].subjects) &&
                classId == boxesForSchool[0].class_id
              : true)
          );
        });
      } else if (status === 'active') {
        matchesStatus = quizData.filter((quiz) => {
          const classId = Object.keys(quiz?.class_stream_subjects)[0];
          const stream = Object.keys(quiz?.class_stream_subjects?.[classId])[0];
          const subjects =
            quiz?.class_stream_subjects?.[classId]?.[stream] || [];
          return (
            !quiz.save_draft &&
            quiz.status !== 'closed' &&
            (boxesForSchool[0].subjects.length > 0
              ? subjects.includes(boxesForSchool[0].subjects) &&
                classId == boxesForSchool[0].class_id
              : true)
          );
        });
      }
    } else {
      if (status == 'all') {
        matchesStatus = quizData.filter((quiz) => {
          const courseId = Object.keys(quiz?.course_semester_subjects)[0];
          const semester = Object.keys(
            quiz?.course_semester_subjects?.[courseId],
          )[0];
          const subjects =
            quiz?.course_semester_subjects?.[courseId]?.[semester] || [];
          return boxes[0].subjects.length > 0
            ? subjects.includes(boxes[0].subjects) &&
                courseId == boxes[0].course_id
            : true;
        });
      } else if (status === 'closed') {
        matchesStatus = quizData.filter((quiz) => {
          const courseId = Object.keys(quiz?.course_semester_subjects)[0];
          const semester = Object.keys(
            quiz?.course_semester_subjects?.[courseId],
          )[0];
          const subjects =
            quiz?.course_semester_subjects?.[courseId]?.[semester] || [];
          return (
            quiz.status == 'closed' &&
            (boxes[0].subjects.length > 0
              ? subjects.includes(boxes[0].subjects) &&
                courseId == boxes[0].course_id
              : true)
          );
        });
      } else if (status === 'draft') {
        matchesStatus = quizData.filter((quiz) => {
          const courseId = Object.keys(quiz?.course_semester_subjects)[0];
          const semester = Object.keys(
            quiz?.course_semester_subjects?.[courseId],
          )[0];
          const subjects =
            quiz?.course_semester_subjects?.[courseId]?.[semester] || [];
          return (
            quiz.save_draft === true &&
            (boxes[0].subjects.length > 0
              ? subjects.includes(boxes[0].subjects) &&
                courseId == boxes[0].course_id
              : true)
          );
        });
      } else if (status === 'active') {
        matchesStatus = quizData.filter((quiz) => {
          const courseId = Object.keys(quiz?.course_semester_subjects)[0];
          const semester = Object.keys(
            quiz?.course_semester_subjects?.[courseId],
          )[0];
          const subjects =
            quiz?.course_semester_subjects?.[courseId]?.[semester] || [];
          return (
            !quiz.save_draft &&
            quiz.status !== 'closed' &&
            (boxes[0].subjects.length > 0
              ? subjects.includes(boxes[0].subjects) &&
                courseId == boxes[0].course_id
              : true)
          );
        });
      }
    }

    setFilteredQuizzes(matchesStatus);
  };

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
  const handleSearchResults = (searchText: string) => {
    setSearchTerm(searchText);
    if (selectedEntity == 'College') {
      const filterquiz = quizData.filter((quiz) => {
        const courseId = Object.keys(quiz?.course_semester_subjects)[0];
        const semester = Object.keys(
          quiz?.course_semester_subjects?.[courseId],
        )[0];
        const subjects =
          quiz?.course_semester_subjects?.[courseId]?.[semester] || [];
        const selectedCourse = filteredcoursesData.find(
          (item) => String(item.id) == courseId,
        )?.course_name;
        return (
          quiz.title.toLowerCase().includes(searchText.toLowerCase()) ||
          (selectedCourse && selectedCourse.includes(searchText)) ||
          subjects[0].toLowerCase().includes(searchText.toLowerCase()) ||
          semester.includes(searchText)
        );
      });
      setFilteredQuizzes(filterquiz);
    } else {
      const filterquiz = quizData.filter((quiz) => {
        const classId = Object.keys(quiz?.class_stream_subjects)[0];
        const stream = Object.keys(quiz?.class_stream_subjects?.[classId])[0];
        const subjects = quiz?.class_stream_subjects?.[classId]?.[stream] || [];
        const selectedClass = dataClass.find(
          (item) => String(item.id) == classId,
        )?.class_name;
        return (
          quiz.title.toLowerCase().includes(searchText.toLowerCase()) ||
          (selectedClass &&
            selectedClass.toLowerCase().includes(searchText.toLowerCase())) ||
          subjects[0].toLowerCase().includes(searchText.toLowerCase()) ||
          stream.toLowerCase().includes(searchText.toLowerCase())
        );
      });
      setFilteredQuizzes(filterquiz);
    }
  };

  const handelSubjectBoxChange = (
    event: SelectChangeEvent<string[]>,
    index: number,
  ) => {
    const { value, name } = event.target;
    setBoxes((prevBoxes) =>
      prevBoxes?.map((box, i) => {
        if (i !== index) return box;

        let updatedBox = { ...box, [name]: value };

        if (name === 'course_id') {
          if (boxes[index].course_id != value) {
            const filteredSemesters = semesterData?.filter(
              (item) => item.course_id === value,
            );
            updatedBox = {
              ...updatedBox,
              filteredSemesters,
              semester_number: '',
              subjects: [],
              filteredSubjects: [],
            };
          }
        }
        if (name === 'semester_number') {
          if (boxes[index].semester_number != value) {
            const filteredSubjects = totleSubject?.filter(
              (item) =>
                item.semester_number === value &&
                item.course_id === boxes[index].course_id,
            );
            updatedBox = { ...updatedBox, filteredSubjects, subjects: [] };
          }
        }
        if (name == 'subjects') {
          if (boxes[index].subjects[0] != value) {
            const filteredQuiz = quizData.filter((quiz) => {
              const courseId = Object.keys(quiz?.course_semester_subjects)[0];
              const semester = Object.keys(
                quiz?.course_semester_subjects?.[courseId],
              )[0];
              const subjects =
                quiz?.course_semester_subjects?.[courseId]?.[semester] || [];
              if (statusFilter != '') {
                if (statusFilter == 'all') {
                  return (
                    courseId == boxes[index].course_id &&
                    semester == boxes[index].semester_number &&
                    subjects.includes(value)
                  );
                } else if (statusFilter === 'closed') {
                  return (
                    quiz.status == statusFilter &&
                    courseId == boxes[index].course_id &&
                    semester == boxes[index].semester_number &&
                    subjects.includes(value)
                  );
                } else if (statusFilter === 'draft') {
                  return (
                    quiz.save_draft === true &&
                    courseId == boxes[index].course_id &&
                    semester == boxes[index].semester_number &&
                    subjects.includes(value)
                  );
                } else {
                  return (
                    !quiz.save_draft &&
                    quiz.status !== 'closed' &&
                    courseId == boxes[index].course_id &&
                    semester == boxes[index].semester_number &&
                    subjects.includes(value)
                  );
                }
              } else {
                return (
                  courseId == boxes[index].course_id &&
                  semester == boxes[index].semester_number &&
                  subjects.includes(value)
                );
              }
            });
            setFilteredQuizzes(filteredQuiz);
          }
        }
        return updatedBox;
      }),
    );
  };

  const handelSchoolBoxChange = (
    event: SelectChangeEvent<string[]>,
    index: number,
  ) => {
    //setSelectedStudents([]);
    const { value, name } = event.target;

    setBoxesForSchool((prevBoxes) =>
      prevBoxes?.map((box, i) => {
        if (i !== index) return box;

        let updatedBox = { ...box, [name]: value }; // Always update the changed value

        if (name === 'class_id') {
          if (boxesForSchool[index].class_id != value) {
            const selectedClass = dataClass.find(
              (item) => String(item.id) == value,
            )?.class_name;
            // setSelectedClassName(
            //   selectedClass === 'class_11' || selectedClass === 'class_12'
            //     ? 'col-4'
            //     : 'col-6',
            // );

            if (selectedClass === 'class_11' || selectedClass === 'class_12') {
              updatedBox = {
                ...updatedBox,
                stream: '',
                is_Stream: true,
                selected_class_name: 'col-2',
                subjects: [],
                filteredSubjects: [],
              }; // Reset stream & subjects
            } else {
              // Filter subjects immediately based on the selected class
              const filteredSubjects = totleSubject?.filter(
                (item) => item.class_id === value,
              );

              updatedBox = {
                ...updatedBox,
                is_Stream: false,
                stream: '',
                selected_class_name: 'col-3',
                filteredSubjects,
                subjects: [],
              };
            }
          }
        }
        if (name == 'stream') {
          if (boxesForSchool[index].stream != value) {
            const filteredSubjects = totleSubject?.filter(
              (item) =>
                String(item.stream).toLowerCase() ==
                  value.toString().toLowerCase() &&
                item.class_id == boxesForSchool[index].class_id,
            );
            updatedBox = {
              ...updatedBox,
              stream: value.toString(),
              filteredSubjects,
              subjects: [],
            };
          }
        }
        if (name == 'subjects') {
          if (boxesForSchool[index].subjects[0] != value) {
            const filteredQuiz = quizData.filter((quiz) => {
              const classId = Object.keys(quiz?.class_stream_subjects)[0];
              const stream = Object.keys(
                quiz?.class_stream_subjects?.[classId],
              )[0];
              const subjects =
                quiz?.class_stream_subjects?.[classId]?.[stream] || [];
              const selectedClass = dataClass.find(
                (item) => String(item.id) == value,
              )?.class_name;
              if (
                selectedClass === 'class_11' ||
                selectedClass === 'class_12'
              ) {
                if (statusFilter != '') {
                  if (statusFilter == 'all') {
                    return (
                      classId == boxesForSchool[index].class_id && subjects.includes(value) && stream == boxesForSchool[index].stream && subjects.includes(value)
                    )
                  } else
                    if (statusFilter === 'closed') {
                      return (
                        quiz.status == statusFilter && classId == boxesForSchool[index].class_id && stream == boxesForSchool[index].stream && subjects.includes(value)
                      )
                    } else if (statusFilter === 'draft') {
                      return (quiz.save_draft === true &&
                        classId == boxesForSchool[index].class_id && stream == boxesForSchool[index].stream && subjects.includes(value)
                      )
                    } else {
                      return (
                        !quiz.save_draft && quiz.status !== 'closed' &&
                        classId == boxesForSchool[index].class_id && stream == boxesForSchool[index].stream && subjects.includes(value)
                      )
                    }
                } else {
                  return (
                    classId == boxesForSchool[index].class_id &&
                    stream == boxesForSchool[index].stream &&
                    subjects.includes(value)
                  );
                }
              } else {
                if (statusFilter != '') {
                  if (statusFilter == "all") {
                    return (
                      classId == boxesForSchool[index].class_id && subjects.includes(value)
                    )
                  } else
                  if (statusFilter === 'closed') {
                    return (
                      classId == boxesForSchool[index].class_id &&
                      subjects.includes(value)
                    );
                  } else if (statusFilter === 'closed') {
                    return (
                      quiz.status == statusFilter &&
                      classId == boxesForSchool[index].class_id &&
                      subjects.includes(value)
                    );
                  } else if (statusFilter === 'draft') {
                    return (
                      quiz.save_draft === true &&
                      classId == boxesForSchool[index].class_id &&
                      subjects.includes(value)
                    );
                  } else {
                    return (
                      !quiz.save_draft &&
                      quiz.status !== 'closed' &&
                      classId == boxesForSchool[index].class_id &&
                      subjects.includes(value)
                    );
                  }
                } else {
                  return (
                    classId == boxesForSchool[index].class_id &&
                    subjects.includes(value)
                  );
                }
              }
            });
            setFilteredQuizzes(filteredQuiz);
          }
        }
        return updatedBox;
      }),
    );
  };
  const getSubjects = async (type: string): Promise<any> => {
    try {
      const url = type === 'college' ? getSubjectCollege : getsubjectSchool;
      const data = await getData(url);

      if (data?.data) {
        setTotleSubject(data.data?.subjects_data);
        return data.data?.subjects_data; // Return subjects
      }

      return []; // Return empty array if no data
    } catch (e: any) {
      toast.error(e?.message, {
        hideProgressBar: true,
        theme: 'colored',
      });

      return Promise.reject(e); // Reject the promise in case of an error
    }
  };

  const getSemester = async (): Promise<any[]> => {
    try {
      const data = await getData(`/semester/list`);

      if (data?.status && data?.data) {
        setSemesterData(data.data.semesters_data);
        return data.data.semesters_data; // Return the fetched semesters
      }

      return []; // Return an empty array if no data
    } catch (error) {
      return Promise.reject(error); // Reject the promise if an error occurs
    }
  };

  const getCourses = () => {
    getData(`${CourseURL}`)
      .then((data) => {
        if (data.data) {
          //  setCoursesData(data?.data);
          const filteredCourses = data?.data?.course_data?.filter(
            (course: any) => course.is_active,
          );
          setFilteredCoursesData(filteredCourses);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  return (
    <div className="main-wrapper pb-5 pb-lg-4">
      <div className="main-content">
        <div className="page-breadcrumb d-flex align-items-center ">
          <div className="breadcrumb-title pe-3">
            <Link to={'/teacher-dashboard'} className="text-dark">
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
                {/* <div className="d-flex align-items-center mt-3 gap-2">
                  <div className="card-lable bg-success bg-opacity-10">
                    <p className="text-success mb-0">+34.7%</p>
                  </div>
                  <p className="mb-0 font-13">from last month</p>
                </div> */}
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mt-8">
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
                {/* <div className="d-flex align-items-center mt-3 gap-2">
                  <div className="card-lable bg-success bg-opacity-10">
                    <p className="text-success mb-0">+34.7%</p>
                  </div>
                  <p className="mb-0 font-13">from last month</p>
                </div> */}
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
                    onChange={(e) => handleSearchResults(e.target.value)}
                  />
                </div>

                {selectedEntity.toLowerCase() === 'college' &&
                  boxes.length > 0 &&
                  boxes?.map((box, index) => (
                    <>
                      <div className="col-md-2 col-12">
                        {/* <label className="col-form-label">
                                               Course<span>*</span>
                                             </label> */}
                        <FormControl fullWidth size="small" variant="outlined">
                          <InputLabel id={`course_id_${index}`}>
                            Course
                          </InputLabel>
                          <Select
                            labelId={`course_id_${index}`}
                            id={`demo3-multiple-name-${index}`}
                            name="course_id"
                            label="Course"
                            size="small"
                            onChange={(event: any) =>
                              handelSubjectBoxChange(event, index)
                            }
                            value={box.course_id || ''}
                          >
                            {filteredcoursesData
                              ?.filter((course) =>
                                teacherCourse?.includes(String(course.id)),
                              )
                              ?.map((course) => (
                                <MenuItem key={course.id} value={course.id}>
                                  {course.course_name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>

                      {/* Semester Selection */}
                      <div className="col-md-2 col-12">
                        {/* <label className="col-form-label">
                                           {/* Semester Selection */}

                        <FormControl fullWidth size="small" variant="outlined">
                          <InputLabel id={`semester_id_${index}`}>
                            Semester
                          </InputLabel>
                          <Select
                            labelId={`semester_id_${index}`}
                            id={`semester_select_${index}`}
                            name="semester_number"
                            size="small"
                            label="Semester"
                            onChange={(event: any) =>
                              handelSubjectBoxChange(event, index)
                            }
                            value={box.semester_number || ''}
                          >
                            {box.filteredSemesters
                              ?.filter((item) =>
                                teacherSemester?.includes(
                                  String(item.semester_number),
                                ),
                              )
                              ?.map((item) => (
                                <MenuItem
                                  key={item.id}
                                  value={item.semester_number || ''}
                                >
                                  {item.semester_number}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>

                      {/* Subjects Selection */}
                      <div className="col-md-2 col-12">
                        {/* <label className="col-form-label">
                                           {/* Subjects Selection */}
                        <FormControl fullWidth size="small" variant="outlined">
                          <InputLabel id={`subject_label_${index}`}>
                            Subject
                          </InputLabel>
                          <Select
                            labelId={`subject_label_${index}`}
                            id={`subject_select_${index}`}
                            name="subjects"
                            label="subjects"
                            size="small"
                            value={box.subjects || []}
                            onChange={(event: any) =>
                              handelSubjectBoxChange(event, index)
                            }
                          >
                            {box.filteredSubjects
                              ?.filter((subject) =>
                                tescherSubjects?.includes(subject.subject_name),
                              )
                              ?.map((subject: any) => (
                                <MenuItem
                                  key={subject.subject_id}
                                  value={subject.subject_name}
                                >
                                  {subject.subject_name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>
                    </>
                  ))}
                {selectedEntity.toLowerCase() === 'school' &&
                  boxesForSchool.length > 0 &&
                  boxesForSchool?.map((box, index) => (
                    <>
                      {/* Class Selection */}
                      <div className={box.selected_class_name}>
                        {/* <label className="col-form-label">
                                               Class<span>*</span>
                                             </label> */}
                        <FormControl fullWidth size="small" variant="outlined">
                          <InputLabel id={`class_id_${index}`}>
                            Class
                          </InputLabel>
                          <Select
                            labelId={`class_id_${index}`}
                            id={`class_select_${index}`}
                            name="class_id"
                            size="small"
                            onChange={(event: any) =>
                              handelSchoolBoxChange(event, index)
                            }
                            value={box.class_id || ''}
                            input={<OutlinedInput label="Class" />}
                          >
                            {dataClass?.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.class_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      {box.is_Stream && (
                        <div className="col-md-2 col-12 mb-3">
                          {/* <label className="col-form-label">
                                                 Stream Name<span>*</span>
                                               </label> */}
                          <FormControl
                            fullWidth
                            size="small"
                            variant="outlined"
                          >
                            <InputLabel id={`stream_id_${index}`}>
                              Stream Name
                            </InputLabel>
                            <Select
                              labelId={`stream_id_${index}`}
                              id={`stream_select_${index}`}
                              name="stream"
                              label="Stream Name"
                              size="small"
                              onChange={(event: any) =>
                                handelSchoolBoxChange(event, index)
                              }
                              value={box.stream || ''}
                              sx={{
                                backgroundColor: inputfield(namecolor),
                                color: inputfieldtext(namecolor),
                                '& .MuiSelect-icon': {
                                  color: fieldIcon(namecolor),
                                },
                              }}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    backgroundColor: inputfield(namecolor),
                                    color: inputfieldtext(namecolor),
                                  },
                                },
                              }}
                            >
                              {teacherStream?.map((item) => (
                                <MenuItem
                                  key={item}
                                  value={item}
                                  sx={{
                                    backgroundColor: inputfield(namecolor),
                                    color: inputfieldtext(namecolor),
                                    '&:hover': {
                                      backgroundColor:
                                        inputfieldhover(namecolor),
                                    },
                                  }}
                                >
                                  {item}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      )}
                      <div className={box.selected_class_name}>
                        {/* <label className="col-form-label">
                                               Subjects <span>*</span>
                                             </label> */}
                        <FormControl fullWidth size="small" variant="outlined">
                          <InputLabel id={`subject_label_${index}`}>
                            Subject
                          </InputLabel>
                          <Select
                            labelId={`subject_label_${index}`}
                            id={`subject_select_${index}`}
                            name="subjects"
                            label="subjects"
                            size="small"
                            value={box.subjects || []}
                            onChange={(event: any) =>
                              handelSchoolBoxChange(event, index)
                            }
                          >
                            {box.filteredSubjects
                              ?.filter((subject) =>
                                tescherSchoolSubjects?.includes(
                                  subject.subject_name,
                                ),
                              )
                              ?.map((subject: any) => (
                                <MenuItem
                                  key={subject.subject_id}
                                  value={subject.subject_name}
                                >
                                  {subject.subject_name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>
                    </>
                  ))}

                <div className="col-md-2">
                  <FormControl fullWidth size="small" variant="outlined">
                    <InputLabel id="subject_label">Status</InputLabel>
                    <Select
                      labelId="subject_label"
                      name="status"
                      label="Status"
                      size="small"
                      value={statusFilter}
                      onChange={(e) => handleStatus(e.target.value)}
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        '& .MuiSelect-icon': {
                          color: fieldIcon(namecolor),
                        },
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            backgroundColor: inputfield(namecolor),
                            color: inputfieldtext(namecolor),
                          },
                        },
                      }}
                    >
                      {optionOfStatus.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
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
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              sx={{ mt: 1 }}
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                mt={0.5}
                              >
                                
                                <Typography variant='body2'>Created At: {formatDate(quiz?.created_at)}
                                </Typography>
                              </Stack>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                mt={0.5}
                              >
                                <Typography variant="body2">
                                  Due: {formatDate(quiz.due_date_time)}
                                </Typography>
                              </Stack>
                            </Box>
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
