/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  //InputLabel,
  //Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  SelectChangeEvent,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import {
  fieldIcon,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from '../../../utils/helpers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PresentToAllIcon from '@mui/icons-material/PresentToAll';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Box } from '@mui/system';
import useApi from '../../../hooks/useAPI';
import {
  QUERY_KEYS_ASSIGNMENT,
  QUERY_KEYS_CLASS,
  QUERY_KEYS_COURSE,
  QUERY_KEYS_QUIZ,
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL,
} from '../../../utils/const';
import { toast } from 'react-toastify';
import { Boxes, BoxesForSchool } from '../../TeacherRgistrationForm';
import {
  CourseRep0oDTO,
  IClass,
  SemesterRep0oDTO,
  StudentRep0oDTO,
  SubjectRep0oDTO,
} from '../../../Components/Table/columns';
import NameContext from '../../Context/NameContext';
import dayjs, { Dayjs } from 'dayjs';
import { Autocomplete, Chip } from '@mui/material';
import ReactQuill from 'react-quill';
import QuizModal from './QuizModal';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker/DateTimePicker';
import FullScreenLoader from '../../Loader/FullScreenLoader';
import AssignmentModal from './AssignmentModal';
import theme from '../../../theme';

export interface Assignment {
  id?: string;
  title: string;
  type: string;
  contact_email: string;
  allow_late_submission: boolean;
  allow_multiple_attempt?: boolean;
  due_date_time: string; // Consider using Date if working with Date objects
  available_from: string; // Consider using Date if working with Date objects
  assign_to_students: string[]; // Converted from string representation to an actual array
  instructions: string;
  points: string;
  course_semester_subjects?: any;
  class_stream_subjects?: any;
  save_draft: boolean;
  add_to_report: boolean;
  notify: boolean;
  created_at?: any;
  created_by?: any;
  created_by_name?: any;
  is_active?: any;
  is_deleted?: any;
  questions?: any;
  files: File[] | string[]; // Assuming file is optional and a File object
}
type QuestionItem = {
  key: string;

  value: string;
};
export const CreateAssignments = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const location = useLocation();
  const { type, edit } = location.state || {};

  const { id } = useParams();

  const { getData, postData, postDataJson, putDataJson, putData } = useApi();
  const [darkMode, setDarkMode] = useState(false);

  //const stream = ['Science', 'Commerce', 'Arts'];

  const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;
  const getsubjectSchool = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;
  const getSubjectCollege = QUERY_KEYS_SUBJECT.GET_SUBJECT;
  const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;
  const teacher_id = localStorage.getItem('teacher_id');
  const teacherId = localStorage.getItem('user_uuid');
  const [assignmentType, setAssignmentType] = useState(
    type !== 'quiz' ? 'written' : 'quiz',
  );
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill | null>(null);
  const [availableFrom, setAvailableFrom] = useState<Dayjs | null>(null);
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);
  const [allowMultipleAttempt, setAllowMultipleAttempt] = useState(false);
  const [addToStudentRepost, setAddToStudentRepost] = useState(true);
  const [sendNotification, setSendNotification] = useState(true);
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [dueTime, setDueTime] = useState<Dayjs | null>(null);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [totleSubject, setTotleSubject] = useState<SubjectRep0oDTO[]>([]);
  const [semesterData, setSemesterData] = useState<SemesterRep0oDTO[]>([]);
  const [dataClass, setDataClass] = useState<IClass[]>([]);
  const [teacherCourse, setTeacherCourse] = useState<string[]>();
  const [teacherSemester, setTeacherSemester] = useState<string[]>();
  const [tescherSubjects, setTeacherSubjects] = useState<string[]>();
  const [selectedStudents, setSelectedStudents] = useState<StudentRep0oDTO[]>(
    [],
  );
  const [questionKey, setQuestionKey] = useState('');
  const [questionValue, setQuestionValue] = useState('');
  const [questionMap, setQuestionMap] = useState<QuestionItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [teacherStream, setTeacherStream] = useState<string[]>();
  const [tescherSchoolSubjects, setTeacherSchoolSubjects] =
    useState<string[]>();

  const [saveAsDrafts, setSaveAsDraft] = useState(false);
  const [listOfStudentFiltered, setListOfStudentFiltered] = useState<any[]>();
  const [listOfStudent, setListOfStudent] = useState<any[]>();

  const [title_error, setTitle_error] = useState(false);
  const [file_error, setFile_error] = useState(false);
  const [point_error, setPoint_error] = useState(false);
  const [instructions_error, setInstructoins_error] = useState(false);
  const [contact_email_email, setContact_email_error] = useState(false);
  const [availableFrom_error, setAvailableFrom_error] = useState(false);
  const [due_date_error, setDue_date_error] = useState(false);
  const [dueTime_error, setDueTime_error] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorselectStudent, setErrorSelectStudent] = useState(false);
  const [level_error, setLevel_error] = useState(false);
  const [questions_error, setQuestions_error] = useState(false);
  const [topic_error, setTopic_error] = useState(false);
  const [quiz_timer, setQuizTimer] = useState('');
  const [quiz_timer_error, setQuizTimer_error] = useState(false);
  const GENERATE_QUIZ = QUERY_KEYS_QUIZ.GENERATE_QUIZ;
  const ASSIGNMENT = QUERY_KEYS_ASSIGNMENT;
  const [loading, setLoading] = useState(false);
  const [isAssignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignmentJsonQuestions, setAssignmentJsonQuestions] = useState<any>();

  const [filteredcoursesData, setFilteredCoursesData] = useState<
    CourseRep0oDTO[]
  >([]);
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
      selected_class_name: 'col-6',
    },
  ]);

  const [errorForCourse_semester_subject, setErrorForCourse_semester_subject] =
    useState<{
      [key: number]: {
        course_id_error: boolean;
        semester_number_error: boolean;
        subjects_error: boolean;
      };
    }>({});
  const [errorForClass_stream_subject, setErrorForClass_stream_subject] =
    useState<{
      [key: number]: {
        class_id_error: boolean;
        stream_error: boolean;
        subjects_error: boolean;
      };
    }>({});

  const [assignmentData, setAssignmentData] = useState<Assignment>({
    title: '',
    type: '',
    contact_email: localStorage.getItem('email') || '',
    allow_late_submission: false,
    allow_multiple_attempt: false,
    due_date_time: '', // Or new Date().toISOString() if using Date type
    available_from: '', // Or new Date().toISOString() if using Date type
    assign_to_students: [],
    instructions: '',
    points: '',
    save_draft: false,
    add_to_report: false,
    notify: false,
    files: [], // File should be null initially
  });
  const [assignmentGenrData, setAssignmentGenrData] = useState<any[]>([]);
  const [quizData, setQuizData] = useState<any>({});
  const [level, setLevel] = useState('');
  const [questions, setQuestions] = useState<any>([
    { one: '', two: '', three: '', four: '', five: '' },
  ]);
  const [topic, setTopic] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizGenerated, setIsQuizGenerated] = useState(false);
  const [isAiAssignmentGenerated, setAiAssignmentGenerated] = useState(false);
  const [quizPayload, setQuizPayload] = useState<any>({});
  const [totalQuestions, setTotalQuestion] = useState<any>('');
  const [totalMarks, setTotalMarks] = useState<any>('');
  const [configInstructions, setConfigInstructions] = useState('');
  const [isedit, setisedit] = useState(false);

  const getTotal = (questions: Record<string, any>[]) => {
    const total = questions.reduce((acc, obj) => {
      for (const value of Object.values(obj)) {
        const num = Number(value);
        if (!isNaN(num)) acc += num;
      }
      return acc;
    }, 0);

    setTotalQuestion(total);
  };

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
    getTotal(questions);
  }, [questions]);

  useEffect(() => {
    const fetchData = async () => {
      await getStudentsForTeacher();
      await getSemester();
      await getCourses();
      await getTeacherProfileInfo();
    };
    fetchData();
    //getListOfStudnetsForAssignment();
  }, []);

  const getClassOrCourseName = () => {
    if (boxes[0]?.course_id) {
      return boxes[0]?.filteredSubjects &&
        boxes[0]?.filteredSubjects[0]?.course_name
        ? boxes[0]?.filteredSubjects[0]?.course_name
        : '';
    } else if (boxesForSchool[0].class_id) {
      return boxesForSchool[0]?.filteredSubjects &&
        boxesForSchool[0]?.filteredSubjects[0]?.class_name
        ? boxesForSchool[0]?.filteredSubjects[0]?.class_name
        : '';
    }
  };

  const getAssignmentInfo = (students: any[]) => {
    if (id) {
      try {
        if (type !== 'quiz') {
          getData(`${ASSIGNMENT.GET_ASSIGNMENT}${id}`)
            .then(async (response) => {
              if (response.data) {
                setAssignmentData(response.data);
                if (response?.data?.files) {
                  setFiles(response?.data?.files);
                }
                const extractedDate = dayjs(
                  response?.data?.due_date_time,
                ).format('YYYY-MM-DD'); // "2025-03-02"
                //const extractedTime = dayjs(response?.data?.due_date_time).format("HH:mm:ss");
                setSendNotification(response?.data?.notify);
                setAddToStudentRepost(response?.data?.add_to_report);
                setAllowLateSubmission(response?.data?.allow_late_submission);
                setSaveAsDraft(response?.data?.save_draft);
                setDueDate(dayjs(extractedDate));
                setDueTime(dayjs(response?.data?.due_date_time));
                setAvailableFrom(dayjs(response?.data?.available_from));
                const selectedStudents =
                  students?.filter((student) =>
                    response?.data?.assign_to_students?.includes(student.id),
                  ) || [];

                setSelectedStudents(selectedStudents);
              }
              if (response.data.class_stream_subjects == null) {
                const allSubject: SubjectRep0oDTO[] =
                  await getSubjects('college');
                const allsemesters: SemesterRep0oDTO[] = await getSemester();
                setSelectedEntity('College');
                const output: Boxes[] = Object.keys(
                  response.data.course_semester_subjects,
                ).flatMap((CourseKey) =>
                  Object.keys(
                    response.data.course_semester_subjects[CourseKey],
                  )?.map((semester_number) => ({
                    course_id: CourseKey,
                    semester_number: semester_number,
                    subjects:
                      response.data.course_semester_subjects[CourseKey][
                        semester_number
                      ],
                    filteredSemesters: allsemesters?.filter(
                      (item) => item.course_id == CourseKey,
                    ),
                    filteredSubjects: allSubject?.filter(
                      (item) =>
                        item.semester_number == semester_number &&
                        item.course_id == CourseKey,
                    ),
                  })),
                );
                const filteredStudents =
                  students?.filter(
                    (student) =>
                      output[0].course_id == student.course_id &&
                      output[0].semester_number == student.semester_number &&
                      output[0].subjects[0] == student.subject_name,
                  ) || [];
                setListOfStudentFiltered(filteredStudents);
                setBoxes(output);
              } else {
                getSubjects('School');
                setSelectedEntity('School');
                const allSubject: SubjectRep0oDTO[] =
                  await getSubjects('School');
                const output: BoxesForSchool[] = Object.keys(
                  response.data.class_stream_subjects,
                ).flatMap((classKey) =>
                  Object.keys(
                    response.data.class_stream_subjects[classKey],
                  )?.map((stream) => ({
                    stream: stream,
                    subjects:
                      response.data.class_stream_subjects[classKey][stream],
                    class_id: classKey,
                    is_Stream: stream !== 'general',
                    selected_class_name:
                      stream === 'general' ? 'col-6' : 'col-4',
                    filteredSubjects:
                      stream == 'general'
                        ? allSubject?.filter(
                            (item) => item.class_id == classKey,
                          )
                        : allSubject?.filter(
                            (item) =>
                              item.class_id == classKey &&
                              item.stream == stream,
                          ),
                  })),
                );
                const filteredStudents =
                  students?.filter((student) =>
                    output[0].class_id == student.class_id &&
                    output[0].subjects[0] == student.subject_name &&
                    output[0].is_Stream
                      ? output[0].stream == student.stream
                      : true,
                  ) || [];
                setListOfStudentFiltered(filteredStudents);
                setBoxesForSchool(output);
              }
              // setBoxesForSchool(response?.data?.class_stream_subjects);
            })
            .catch((error) => {
              toast.error(error.message, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
            });
        } else {
          getData(`/quiz/get/${id}`)
            .then(async (response) => {
              if (response.data) {
                setAssignmentData(response.data);

                const extractedDate = dayjs(
                  response?.data?.due_date_time,
                ).format('YYYY-MM-DD'); // "2025-03-02"
                //const extractedTime = dayjs(response?.data?.due_date_time).format("HH:mm:ss");
                setSendNotification(response?.data?.notify);
                setAddToStudentRepost(response?.data?.add_to_report);
                setAllowLateSubmission(response?.data?.allow_late_submission);
                setSaveAsDraft(response?.data?.save_draft);
                setDueDate(dayjs(extractedDate));
                setDueTime(dayjs(response?.data?.due_date_time));
                setAvailableFrom(dayjs(response?.data?.available_from));
                setQuizTimer(response?.data?.timer);
                setAllowMultipleAttempt(response?.data?.is_multiple_attempt);
                setQuizData((prev: any) => ({
                  ...prev,
                  questions: response?.data?.questions,
                  title: response?.data.title,
                }));
                const selectedStudents =
                  students?.filter((student) =>
                    response?.data?.assign_to_students?.includes(student.id),
                  ) || [];

                setSelectedStudents(selectedStudents);
              }
              if (response.data.class_stream_subjects == null) {
                const allSubject: SubjectRep0oDTO[] =
                  await getSubjects('college');
                const allsemesters: SemesterRep0oDTO[] = await getSemester();
                setSelectedEntity('College');
                const output: Boxes[] = Object.keys(
                  response.data.course_semester_subjects,
                ).flatMap((CourseKey) =>
                  Object.keys(
                    response.data.course_semester_subjects[CourseKey],
                  )?.map((semester_number) => ({
                    course_id: CourseKey,
                    semester_number: semester_number,
                    subjects:
                      response.data.course_semester_subjects[CourseKey][
                        semester_number
                      ],
                    filteredSemesters: allsemesters?.filter(
                      (item) => item.course_id == CourseKey,
                    ),
                    filteredSubjects: allSubject?.filter(
                      (item) =>
                        item.semester_number == semester_number &&
                        item.course_id == CourseKey,
                    ),
                  })),
                );

                const filteredStudents =
                  students?.filter(
                    (student) =>
                      Number(output[0].course_id) == student.course_id &&
                      Number(output[0].semester_number) ==
                        student.semester_number &&
                      output[0].subjects[0] == student.subject_name,
                  ) || [];

                setListOfStudentFiltered(filteredStudents);
                setBoxes(output);
              } else {
                getSubjects('School');
                setSelectedEntity('School');
                const allSubject: SubjectRep0oDTO[] =
                  await getSubjects('School');
                const output: BoxesForSchool[] = Object.keys(
                  response.data.class_stream_subjects,
                ).flatMap((classKey) =>
                  Object.keys(
                    response.data.class_stream_subjects[classKey],
                  )?.map((stream) => ({
                    stream: stream,
                    subjects:
                      response.data.class_stream_subjects[classKey][stream],
                    class_id: classKey,
                    is_Stream: stream !== 'general',
                    selected_class_name:
                      stream === 'general' ? 'col-6' : 'col-4',
                    filteredSubjects:
                      stream == 'general'
                        ? allSubject?.filter(
                            (item) => item.class_id == classKey,
                          )
                        : allSubject?.filter(
                            (item) =>
                              item.class_id == classKey &&
                              item.stream == stream,
                          ),
                  })),
                );

                const filteredStudents =
                  students?.filter((student) =>
                    Number(output[0].class_id) == student.class_id &&
                    output[0].subjects[0] == student.subject_name &&
                    output[0].is_Stream
                      ? output[0].stream == student.stream
                      : true,
                  ) || [];
                setListOfStudentFiltered(filteredStudents);
                setBoxesForSchool(output);
              }
              setisedit(true);
              // setBoxesForSchool(response?.data?.class_stream_subjects);
            })
            .catch((error) => {
              toast.error(error.message, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
            });
        }
      } catch (error: any) {
        toast.error(error.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      }
    }
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
  const getTeacherProfileInfo = async () => {
    try {
      getData(`/teacher/edit/${teacherId}`).then(async (data) => {
        if (data?.status) {
          if (data.data.course_semester_subjects != null) {
            setSelectedEntity('College');
            getSubjects('college');
            // Extract all course IDs (keys)
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
            getSubjects('School');
            setSelectedEntity('School');

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
    } catch (error) {
      console.log(error);
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedStudents(listOfStudentFiltered || []);
      setSelectAll(true);
    } else {
      setSelectedStudents([]);
      setSelectAll(false);
    }
    setErrorSelectStudent(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
      setFile_error(false);
    }
  };

  const handleChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setAssignmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validation(name, value);
  };
  const handleQuillChange = (value: string) => {
    setAssignmentData((prev) => ({
      ...prev,
      instructions: value, // Update the 'instructions' field in state
    }));
    validation('instructions', value);
  };

  const validation = (name: string, value: string) => {
    if (
      name == 'title' &&
      !/^[A-Za-z0-9][A-Za-z0-9 _-]{3,98}[A-Za-z0-9]*$/.test(value)
    ) {
      setTitle_error(true);
    } else {
      setTitle_error(false);
    }

    if (name == 'points' && !/^\d+$/.test(value)) {
      setPoint_error(true);
    } else {
      setPoint_error(false);
    }
    if (name == 'instructions' && value == '') {
      setInstructoins_error(true);
    } else {
      setInstructoins_error(false);
    }
    if (name == 'contact_email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setContact_email_error(true);
    } else {
      setContact_email_error(false);
    }
  };
  const getStudentsForTeacher = () => {
    try {
      getData(`/student_teacher/teacher/${teacher_id}/students`)
        .then((response) => {
          if (response.status) {
            //setListOfStudentFiltered(response.data);
            setListOfStudent(response.data);
            getAssignmentInfo(response.data);
          }
        })
        .catch((error) => {
          toast.error(error.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        });
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  const submitAssignment = (
    saveAsDraft?: any,
    assignmentDataType?: string,
    questions?: any,
  ) => {
    let valid1 = false;
    if (
      !/^[A-Za-z0-9][A-Za-z0-9 _-]{3,98}[A-Za-z0-9]*$/.test(
        assignmentData.title,
      )
    ) {
      setTitle_error(true);
      valid1 = true;
    }
    if (assignmentDataType != 'json' && !(files.length > 0)) {
      setFile_error(true);
      valid1 = true;
    } else {
      setFile_error(false);
    }
    if (assignmentDataType != 'json') {
      if (!/^\d+$/.test(assignmentData.points)) {
        setPoint_error(true);
        valid1 = true;
      } else {
        setPoint_error(false);
      }
    } else {
      if (!/^\d+$/.test(totalMarks)) {
        setPoint_error(true);
        valid1 = true;
      } else {
        setPoint_error(false);
      }
    }
    if (assignmentData.instructions == '') {
      setInstructoins_error(true);
      valid1 = true;
    } else {
      setInstructoins_error(false);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assignmentData.contact_email)) {
      setContact_email_error(true);
      valid1 = true;
    } else {
      setContact_email_error(false);
    }
    if (availableFrom == null || availableFrom.isBefore(dayjs(), 'day')) {
      setAvailableFrom_error(true);
      valid1 = true;
    } else {
      setAvailableFrom_error(false);
    }
    if (dueDate == null) {
      setDue_date_error(true);
      valid1 = true;
    } else {
      setDue_date_error(false);
    }
    if (dueTime == null) {
      setDueTime_error(true);
      valid1 = true;
    } else {
      setDueTime_error(false);
    }
    if (error != null) {
      valid1 = true;
    }
    if (selectedStudents.length < 1) {
      setErrorSelectStudent(true);
      valid1 = true;
    } else {
      setErrorSelectStudent(false);
    }
    let valid = true;
    if (selectedEntity.toLowerCase() === 'school') {
      boxesForSchool.forEach((box, index) => {
        if (
          !box.class_id ||
          (box.stream === '' ? false : !box.stream) ||
          !box.subjects?.length
        ) {
          valid = false;
          setErrorForClass_stream_subject((prevError) => ({
            ...prevError,
            [index]: {
              class_id_error: !box.class_id,
              stream_error: !box.stream, // Handles missing or empty stream
              subjects_error: !box.subjects?.length, // Ensures subjects is not empty
            },
          }));
        }
      });
    } else {
      boxes.forEach((box, index) => {
        if (!box.course_id || !box.semester_number || !box.subjects?.length) {
          valid = false;
          setErrorForCourse_semester_subject((prevError) => ({
            ...prevError,
            [index]: {
              course_id_error: !box.course_id,
              semester_number_error: !box.semester_number,
              subjects_error: !box.subjects?.length, // Ensures subjects is not empty
            },
          }));
        }
      });
    }
    if (valid1) return;
    if (!valid) return;

    const formData: any = new FormData();
    formData.append('title', assignmentData.title);
    formData.append('type', type);
    formData.append('contact_email', assignmentData.contact_email);
    formData.append('allow_late_submission', String(allowLateSubmission));
    formData.append('due_date_time', String(mergeDateAndTime()));
    formData.append('available_from', String(availableFrom));
    formData.append('instructions', assignmentData.instructions);
    formData.append(
      'points',
      assignmentDataType == 'json' ? totalMarks : assignmentData.points,
    );
    formData.append(
      'save_draft',
      saveAsDraft == true ? String(saveAsDraft) : String(saveAsDrafts),
    );
    formData.append('add_to_report', String(addToStudentRepost));
    formData.append('notify', String(sendNotification));
    formData.append('questions', []);
    //const students = selectedStudents.map((student) => String(student.id))
    const students = selectedStudents?.map((student) => student.id);

    formData.append('assign_to_students', JSON.stringify(students));
    files.forEach((file) => {
      formData.append('files', file);
    });
    if (selectedEntity.toLowerCase() === 'school') {
      const class_stream_subjects = boxesForSchool.reduce(
        (acc, boxesForSchool) => {
          const { class_id, stream, subjects } = boxesForSchool;
          const streamKey = stream === '' ? 'general' : stream || 'general';
          if (!acc[class_id]) {
            acc[class_id] = {};
          }

          if (!acc[class_id][streamKey]) {
            acc[class_id][streamKey] = [];
          }

          const subjectString = Array.isArray(subjects)
            ? subjects.join('')
            : subjects;

          acc[class_id][streamKey] = [subjectString];

          return acc;
        },
        {} as Record<string, Record<string, string[]>>,
      );
      formData.append(
        'class_stream_subjects',
        JSON.stringify(class_stream_subjects),
      );

      // if (selectedClassName === 'col-4') {
      //   formData.append('stream', teacher.stream);
      // }
    } else {
      const course_semester_subjects = boxes.reduce(
        (acc, box) => {
          const { course_id, semester_number, subjects } = box;

          if (!acc[course_id]) {
            acc[course_id] = {};
          }

          if (!acc[course_id][semester_number]) {
            acc[course_id][semester_number] = [];
          }

          acc[course_id][semester_number] = [
            ...new Set([...acc[course_id][semester_number], ...subjects]),
          ];

          const subjectString = Array.isArray(subjects)
            ? subjects.join('')
            : subjects;

          acc[course_id][semester_number] = [subjectString];
          return acc;
        },
        {} as Record<string, Record<string, string[]>>,
      );
      formData.append(
        'course_semester_subjects',
        JSON.stringify(course_semester_subjects),
      );
    }

    if (!id) {
      try {
        console.log(assignmentJsonQuestions, questions);
        postData(ASSIGNMENT.ADD_ASSIGNMENT, formData).then((response) => {
          if (response.status) {
            toast.success(response.message, {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
            navigate('/teacher-dashboard/assignments');
          }
          setAssignmentData({
            title: '',
            type: 'written',
            contact_email: '',
            allow_late_submission: false,
            due_date_time: '', // Or new Date().toISOString() if using Date type
            available_from: '', // Or new Date().toISOString() if using Date type
            assign_to_students: [],
            instructions: '',
            points: '',
            save_draft: false,
            add_to_report: false,
            notify: false,
            files: [], // File should be null initially
          });
        });
      } catch (error: any) {
        toast.error(error.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      }
    } else {
      try {
        putData(`${ASSIGNMENT.EDIT_ASSIGNMENT}${id}`, formData)
          .then((response) => {
            if (response.status) {
              toast.success(response.message, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
              navigate('/teacher-dashboard/assignments');
              setAssignmentData({
                title: '',
                type: 'written',
                contact_email: '',
                allow_late_submission: false,
                due_date_time: '',
                available_from: '',
                assign_to_students: [],
                instructions: '',
                points: '',
                save_draft: false,
                add_to_report: false,
                notify: false,
                files: [],
              });
            }
          })
          .catch((response) => {
            toast.error(response.message, {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
          });
      } catch (error: any) {
        toast.error(error.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      }
    }
  };

  const generateQuiz = async (type?: any) => {
    let valid1 = false;
    if (!topic) {
      setTopic_error(true);

      valid1 = true;
    } else {
      setTopic_error(false);
    }

    if (!level) {
      setLevel_error(true);

      valid1 = true;
    } else {
      setLevel_error(false);
    }

    if (totalQuestions < 1) {
      setQuestions_error(true);

      valid1 = true;
    } else {
      setQuestions_error(false);
    }
    if (assignmentData)
      if (assignmentData.instructions == '') {
        setInstructoins_error(true);

        valid1 = true;
      } else {
        setInstructoins_error(false);
      }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assignmentData.contact_email)) {
      setContact_email_error(true);

      valid1 = true;
    } else {
      setContact_email_error(false);
    }

    if (availableFrom == null) {
      setAvailableFrom_error(true);

      valid1 = true;
    } else {
      setAvailableFrom_error(false);
    }

    if (dueDate == null) {
      setDue_date_error(true);

      valid1 = true;
    } else {
      setDue_date_error(false);
    }

    if (dueTime == null) {
      setDueTime_error(true);

      valid1 = true;
    } else {
      setDueTime_error(false);
    }

    if (error != null) {
      valid1 = true;
    }
    if (selectedStudents.length < 1) {
      setErrorSelectStudent(true);
      valid1 = true;
    } else {
      setErrorSelectStudent(false);
    }

    if (type !== 'assignment') {
      if (!Number(quiz_timer) || Number(quiz_timer) == 0) {
        setQuizTimer_error(true);

        valid1 = true;
      } else {
        setQuizTimer_error(false);
      }
    }

    // if (assignmentType == 'ai generated') {
    // }

    let valid = true;

    if (selectedEntity.toLowerCase() === 'school') {
      boxesForSchool.forEach((box, index) => {
        if (
          !box.class_id ||
          (box.stream === '' ? false : !box.stream) ||
          !box.subjects?.length
        ) {
          valid = false;

          setErrorForClass_stream_subject((prevError) => ({
            ...prevError,
            [index]: {
              class_id_error: !box.class_id,
              stream_error: !box.stream,
              subjects_error: !box.subjects?.length,
            },
          }));
        }
      });
    } else {
      boxes.forEach((box, index) => {
        if (!box.course_id || !box.semester_number || !box.subjects?.length) {
          valid = false;
          setErrorForCourse_semester_subject((prevError) => ({
            ...prevError,
            [index]: {
              course_id_error: !box.course_id,
              semester_number_error: !box.semester_number,
              subjects_error: !box.subjects?.length,
            },
          }));
        }
      });
    }

    if (valid1) return;

    if (!valid) return;

    const class_or_course =
      getClassOrCourseName().replace('_', ' ') + ' ' + 'science';
    const rawMarks = questions[0] || {};
    const wordToNumberMap: Record<string, number> = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
    };

    const cleanedMarks = Object.fromEntries(
      Object.entries(rawMarks)
        ?.filter(([, value]) => value !== '')
        ?.map(([key, value]) => [wordToNumberMap[key] || key, value]), //
    );

    const obj = Object.fromEntries(
      questionMap?.map(({ key, value }) => [String(value), Number(key)]),
    );

    const payload = {
      class_or_course,
      level,
      marks: type == 'assignment' ? obj : cleanedMarks,
      topic,
      ...(type != 'assignment' && {
        num_questions: totalQuestions,
      }),
      ...(type == 'assignment' && {
        instruction: configInstructions,
        format_of_output: 'json',
        number_of_questions: totalQuestions,
      }),

      questions: [],
    };

    try {
      if (type == 'assignment') {
        setLoading(true);
        postDataJson(ASSIGNMENT.GENERATE_AI_ASSIGNMENT, payload).then(
          (response) => {
            setAssignmentGenrData(response);

            setAssignmentModalOpen(true);
            setLoading(false);
          },
        );
      } else {
        setLoading(true);
        postDataJson(GENERATE_QUIZ, payload).then((response) => {
          setQuizData(response);
          setIsModalOpen(true);
          setLoading(false);
        });
      }
    } catch (error) {
      setLoading(false);
      console.error('Error generating quiz:', error);

      toast.error('Quiz generation failed', {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  const handleSubmitQuiz = (save_draft: boolean, payload?: any) => {
    let data = quizPayload;
    if (save_draft) {
      data = payload;
    } else {
      data.save_draft = save_draft;
    }

    let valid1 = false;
    if (assignmentData)
      if (assignmentData.instructions == '') {
        setInstructoins_error(true);

        valid1 = true;
      } else {
        setInstructoins_error(false);
      }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assignmentData.contact_email)) {
      setContact_email_error(true);

      valid1 = true;
    } else {
      setContact_email_error(false);
    }

    if (availableFrom == null) {
      setAvailableFrom_error(true);

      valid1 = true;
    } else {
      setAvailableFrom_error(false);
    }

    if (dueDate == null) {
      setDue_date_error(true);

      valid1 = true;
    } else {
      setDue_date_error(false);
    }

    if (dueTime == null) {
      setDueTime_error(true);

      valid1 = true;
    } else {
      setDueTime_error(false);
    }

    if (!Number(quiz_timer) || Number(quiz_timer) == 0) {
      setQuizTimer_error(true);

      valid1 = true;
    } else {
      setQuizTimer_error(false);
    }

    if (error != null) {
      valid1 = true;
    }
    if (selectedStudents.length < 1) {
      setErrorSelectStudent(true);
      valid1 = true;
    } else {
      setErrorSelectStudent(false);
    }
    let valid = true;

    if (selectedEntity.toLowerCase() === 'school') {
      boxesForSchool.forEach((box, index) => {
        if (
          !box.class_id ||
          (box.stream === '' ? false : !box.stream) ||
          !box.subjects?.length
        ) {
          valid = false;

          setErrorForClass_stream_subject((prevError) => ({
            ...prevError,
            [index]: {
              class_id_error: !box.class_id,
              stream_error: !box.stream,
              subjects_error: !box.subjects?.length,
            },
          }));
        }
      });
    } else {
      boxes.forEach((box, index) => {
        if (!box.course_id || !box.semester_number || !box.subjects?.length) {
          valid = false;
          setErrorForCourse_semester_subject((prevError) => ({
            ...prevError,
            [index]: {
              course_id_error: !box.course_id,
              semester_number_error: !box.semester_number,
              subjects_error: !box.subjects?.length,
            },
          }));
        }
      });
    }

    if (valid1) return;

    if (!valid) return;

    if (edit) {
      if (!data.title || data.questions.length === 0) {
        toast.error('Please select questions before publishing the quiz', {
          hideProgressBar: true,
          theme: 'colored',
        });
        return;
      }

      putDataJson(`/quiz/edit/${id}`, data).then((response) => {
        if (response.status) {
          toast.success(response.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
          navigate('/teacher-dashboard/quizzes');
          setAssignmentData({
            title: '',
            type: 'written',
            contact_email: '',
            allow_late_submission: false,
            due_date_time: '', // Or new Date().toISOString() if using Date type
            available_from: '', // Or new Date().toISOString() if using Date type
            assign_to_students: [],
            instructions: '',
            points: '',
            save_draft: false,
            add_to_report: false,
            notify: false,
            files: [], // File should be null initially
          });
          setQuizPayload([]);
          setQuizData([]);
        } else {
          toast.error(response.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        }
      });
    } else {
      postDataJson('/quiz/add', data).then((response) => {
        if (response.status) {
          toast.success(response.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
          navigate('/teacher-dashboard/quizzes');
          setAssignmentData({
            title: '',
            type: 'written',
            contact_email: '',
            allow_late_submission: false,
            due_date_time: '', // Or new Date().toISOString() if using Date type
            available_from: '', // Or new Date().toISOString() if using Date type
            assign_to_students: [],
            instructions: '',
            points: '',
            save_draft: false,
            add_to_report: false,
            notify: false,
            files: [], // File should be null initially
          });
          setQuizPayload([]);
          setQuizData([]);
        } else {
          toast.error(response.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        }
      });
    }
  };

  const handleSaveQuiz = (updatedQuizData: any) => {
    const payload: any = { ...updatedQuizData };
    const students = selectedStudents?.map((student) => student.id);

    payload.is_multiple_attempt = String(allowMultipleAttempt);
    payload.allow_late_submission = String(allowLateSubmission);
    payload.available_from = String(availableFrom);
    payload.due_date_time = String(mergeDateAndTime());
    payload.assign_to_students = students;
    payload.add_to_report = String(addToStudentRepost);
    payload.notify = String(sendNotification);

    payload.save_draft = String(saveAsDrafts);
    payload.timer = String(quiz_timer);
    payload.type = type;
    payload.contact_email = assignmentData.contact_email;
    payload.instructions = assignmentData.instructions;

    if (selectedEntity.toLowerCase() === 'school') {
      const class_stream_subjects = boxesForSchool.reduce(
        (acc, boxesForSchool) => {
          const { class_id, stream, subjects } = boxesForSchool;
          const streamKey = stream === '' ? 'general' : stream || 'general';
          if (!acc[class_id]) {
            acc[class_id] = {};
          }

          if (!acc[class_id][streamKey]) {
            acc[class_id][streamKey] = [];
          }

          const subjectString = Array.isArray(subjects)
            ? subjects.join('')
            : subjects;

          acc[class_id][streamKey] = [subjectString];

          return acc;
        },
        {} as Record<string, Record<string, string[]>>,
      );
      payload.class_stream_subjects = JSON.stringify(class_stream_subjects);
    } else {
      const course_semester_subjects = boxes.reduce(
        (acc, box) => {
          const { course_id, semester_number, subjects } = box;

          if (!acc[course_id]) {
            acc[course_id] = {};
          }

          if (!acc[course_id][semester_number]) {
            acc[course_id][semester_number] = [];
          }

          acc[course_id][semester_number] = [
            ...new Set([...acc[course_id][semester_number], ...subjects]),
          ];

          const subjectString = Array.isArray(subjects)
            ? subjects.join('')
            : subjects;

          acc[course_id][semester_number] = [subjectString];
          return acc;
        },
        {} as Record<string, Record<string, string[]>>,
      );
      payload.course_semester_subjects = JSON.stringify(
        course_semester_subjects,
      );
    }

    setQuizPayload(payload);
    setIsQuizGenerated(true);
    return;
  };

  const handleAvailableFromChange = (newDate: Dayjs | null) => {
    setAvailableFrom(newDate);
    if (dueDate && newDate && newDate.isAfter(dueDate)) {
      setError('Available From should be less than Due Date');
    } else {
      setError(null);
    }
  };

  const handleDueDateChange = (newDate: Dayjs | null) => {
    setDueDate(newDate);
    if (availableFrom && newDate && availableFrom.isAfter(newDate)) {
      setError('Available From should be less than Due Date');
    } else {
      setError(null);
    }
  };
  // const classOptions = ['Class 1', 'Class 2', 'Class 3', 'Class 4'];

  // const handleClassChange = (
  //   event: SelectChangeEvent<typeof selectedClasses>,
  // ) => {
  //   const value = event.target.value;
  //   setSelectedClasses(typeof value === 'string' ? value.split(',') : value);
  // };

  const validateCourseFields = (index: number, field: string, boxes: Boxes) => {
    setErrorForCourse_semester_subject((prevError) => ({
      ...prevError,
      [index]: {
        ...prevError[index],
        ...(field === 'course_id' && {
          course_id_error: !boxes.course_id, // Fixed key name
        }),
        ...(field === 'semester_number' && {
          semester_number_error: !boxes.semester_number, // Fixed key name
        }),
        ...(field === 'subjects' && {
          subjects_error: !boxes.subjects?.length, // Ensuring subjects is not empty
        }),
      },
    }));
  };
  const validateFields = (
    index: number,
    field: string,
    boxesForSchool: BoxesForSchool,
  ) => {
    setErrorForClass_stream_subject((prevError) => ({
      ...prevError,
      [index]: {
        ...prevError[index],
        ...(field === 'class_id' && {
          class_id_error: !boxesForSchool.class_id,
        }),
        ...(field === 'stream' && {
          stream_error: !boxesForSchool.stream, // Fix: stream_error should check stream
        }),
        ...(field === 'subjects' && {
          subjects_error: !boxesForSchool.subjects?.length, // Fix: Check if subjects array is empty
        }),
      },
    }));
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
          setSelectedStudents([]);
          setListOfStudentFiltered([]);
          setSelectAll(false);
        }

        if (name === 'semester_number') {
          const filteredSubjects = totleSubject?.filter(
            (item) =>
              item.semester_number === value &&
              item.course_id === boxes[index].course_id,
          );
          updatedBox = { ...updatedBox, filteredSubjects, subjects: [] };
          setListOfStudentFiltered([]);
          setSelectedStudents([]);
          setSelectAll(false);
        }
        if (name == 'subjects') {
          const filteredStudents = listOfStudent?.filter((student) => {
            const matchedSubject = totleSubject?.find(
              (subject) =>
                subject.subject_name === value &&
                subject.course_id === boxes[index].course_id &&
                subject.semester_number === boxes[index].semester_number,
            );
            return student.subject_id === matchedSubject?.subject_id;
          });
          setListOfStudentFiltered(filteredStudents);
        }
        validateCourseFields(index, name, updatedBox);
        return updatedBox;
      }),
    );
  };

  const handelSchoolBoxChange = (
    event: SelectChangeEvent<string[]>,
    index: number,
  ) => {
    const { value, name } = event.target;

    setBoxesForSchool((prevBoxes) =>
      prevBoxes?.map((box, i) => {
        if (i !== index) return box;

        let updatedBox = { ...box, [name]: value }; // Always update the changed value

        if (name === 'class_id') {
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
              selected_class_name: 'col-4',
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
              selected_class_name: 'col-6',
              filteredSubjects,
              subjects: [],
            };
          }
          setSelectedStudents([]);
          setListOfStudentFiltered([]);
          setSelectAll(false);
        }

        if (name === 'stream') {
          const filteredSubjects = totleSubject?.filter(
            (item) =>
              String(item.stream).toLowerCase() ==
                value.toString().toLowerCase() &&
              item.class_id === boxesForSchool[index].class_id,
          );
          updatedBox = {
            ...updatedBox,
            stream: value.toString(),
            filteredSubjects,
            subjects: [],
          };
          setSelectedStudents([]);
          setListOfStudentFiltered([]);
          setSelectAll(false);
        }
        if (name == 'subjects') {
          const filteredStudents = listOfStudent?.filter((student) => {
            const matchedSubject = totleSubject?.find(
              (subject) =>
                subject.subject_name === value &&
                subject.class_id === boxesForSchool[index].class_id &&
                subject.stream === boxesForSchool[index].stream,
            );
            return student.subject_id === matchedSubject?.subject_id;
          });
          setListOfStudentFiltered(filteredStudents);
        }
        validateFields(index, name, updatedBox);
        return updatedBox;
      }),
    );
  };

  const handleFileRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    if (files.length == 1) {
      setFile_error(true);
    } else {
      setFile_error(false);
    }
  };
  const handleSaveAsDraft = () => {
    const updatedPayload = {
      ...quizPayload,
      save_draft: 'true',
    };

    setQuizPayload(updatedPayload);

    setSaveAsDraft(true);
    setAssignmentData((prev) => ({
      ...prev,
      ['save_draft']: true,
    }));

    if (assignmentType !== 'quiz') {
      submitAssignment(true);
    } else {
      handleSubmitQuiz(true, updatedPayload);
    }
  };
  const mergeDateAndTime = () => {
    if (!dueDate || !dueTime) return null;

    // Extract hours and minutes using Dayjs methods
    const hours = dueTime.hour(); // Use hour() instead of getHours()
    const minutes = dueTime.minute(); // Use minute() instead of getMinutes()

    // Set these hours & minutes in `dueDate`
    const mergedDateTime = dueDate.hour(hours).minute(minutes).second(0);

    return mergedDateTime;
  };

  const checkStudent = (newValue: any) => {
    if (newValue.length == 0) {
      setErrorSelectStudent(true);
    } else {
      setErrorSelectStudent(false);
    }
  };
  useEffect(() => {
    if (availableFrom == null && availableFrom_error) {
      setAvailableFrom_error(true);
    } else {
      setAvailableFrom_error(false);
    }
    if (dueDate == null && due_date_error) {
      setDue_date_error(true);
    } else {
      setDue_date_error(false);
    }
    if (dueTime == null && dueTime_error) {
      setDueTime_error(true);
    } else {
      setDueTime_error(false);
    }
    if (level == '' && level) {
      setLevel_error(true);
    } else {
      setLevel_error(false);
    }

    if (topic == '' && topic) {
      setTopic_error(true);
    } else {
      setTopic_error(false);
    }
  }, [dueDate, availableFrom, dueTime, level, topic]);
  const handleQuestionmap = () => {
    if (questionKey && questionValue) {
      setQuestions_error(false);
      setQuestionMap((prev) => [
        ...prev,
        { key: questionKey, value: questionValue },
      ]);
      const totalQuestions = questionMap.reduce((sum, item) => {
        return sum + Number(item.key); // convert key to number and add
      }, 0);
      const totalMarks = questionMap.reduce((sum, item) => {
        const key = Number(item.key);
        const value = Number(item.value);

        return sum + key * value;
      }, 0);
      setTotalQuestion(Number(totalQuestions) + Number(questionKey));
      setTotalMarks(totalMarks + Number(questionValue) * Number(questionKey));
      setQuestionValue('');
      setQuestionKey('');
    }
  };
  const handleDelete = (key: any, value: any, index: number) => {
    const filteredQuestion = questionMap?.filter(
      (_: any, ind: number) => ind !== index,
    );
    setQuestionMap(filteredQuestion);
    console.log(value);
    setTotalQuestion(totalQuestions - key);
    setAiAssignmentGenerated(false);
    if (questionMap.length == 1) {
      setQuestions_error(true);
    } else {
      setQuestions_error(false);
    }
  };
  return (
    <div className="main-wrapper">
      <div className="main-content">
        {loading && <FullScreenLoader />}
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">
            {' '}
            <Link to={'/teacher-dashboard'} className="text-dark">
              Dashboard
            </Link>
          </div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item active" aria-current="page">
                  Create {assignmentType == 'quiz' ? 'Quiz' : 'Assignments'}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <Typography variant="subtitle1" className="my-2">
          Assignment Type
        </Typography>
        <div className="overflow-auto">
          <ToggleButtonGroup
            value={assignmentType}
            exclusive
            onChange={(_, newValue) => {
              if (newValue !== null) {
                setAssignmentType(newValue);
              }
            }}
            className="assignbtngrp"
          >
            {type !== 'quiz' && (
              <>
                <ToggleButton value="written">
                  <AssignmentIcon /> Written
                </ToggleButton>
                <ToggleButton value="ai generated">
                  <AccountTreeIcon /> Ai generated
                </ToggleButton>
                <ToggleButton value="presentation">
                  <PresentToAllIcon />
                  Presentation
                </ToggleButton>
              </>
            )}
            {type == 'quiz' && (
              <ToggleButton value="quiz">
                <QuizIcon /> Quiz
              </ToggleButton>
            )}
          </ToggleButtonGroup>
        </div>

        <div className="card p-lg-3  mt-4 mt-lg-0">
          <div className="cardbody p-2">
            <div className="container-fluid">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <div className="row g-4">
                    <div className="col-12">
                      <Typography variant="h6" className="mb-4 fw-bold">
                        Create{' '}
                        {assignmentType == 'quiz' ? 'Quiz' : 'Assignment'}
                      </Typography>
                      {assignmentType !== 'quiz' && (
                        <TextField
                          fullWidth
                          label="Assignment Title"
                          variant="outlined"
                          name="title"
                          value={assignmentData.title}
                          onChange={handleChanges}
                        />
                      )}
                      {title_error && assignmentType != 'quiz' && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small> Please enter a valid Title.</small>
                        </p>
                      )}
                    </div>

                    <div className="col-6">
                      <TextField
                        fullWidth
                        label="Contact Email"
                        variant="outlined"
                        name="contact_email"
                        disabled
                        onChange={handleChanges}
                        type="email"
                        value={assignmentData.contact_email}
                        autoComplete="off"
                      />
                      {contact_email_email && (
                        <p className="error-text" style={{ color: 'red' }}>
                          <small>Please enter a valid Email Id.</small>
                        </p>
                      )}
                    </div>

                    {assignmentType == 'written' && (
                      <>
                        {' '}
                        <div className="col-lg-6">
                          <TextField
                            fullWidth
                            label="Points"
                            variant="outlined"
                            name="points"
                            onChange={handleChanges}
                            type="number"
                            inputProps={{ min: '0' }}
                            value={assignmentData.points}
                          />
                          {point_error && (
                            <p className="error-text" style={{ color: 'red' }}>
                              <small>Please enter a valid points.</small>
                            </p>
                          )}
                        </div>
                        <div className="col-12">
                          <label className="col-form-label">Attachments</label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            multiple
                            name="file"
                            style={{ display: 'none' }}
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="uploadfile">
                            <Button
                              variant="contained"
                              component="span"
                              startIcon={<CloudUploadIcon />}
                            >
                              Browse Files
                            </Button>
                          </label>
                          <List>
                            {files?.map((file, index) => (
                              <ListItem
                                className="fileslistitem"
                                key={index}
                                sx={{
                                  backgroundColor: darkMode
                                    ? '#1e1e1e'
                                    : '#f5f5f5',
                                  color: darkMode
                                    ? '#b0b0b0'
                                    : theme.palette.text.primary,
                                  borderRadius: 1,
                                  mb: 1,
                                }}
                                secondaryAction={
                                  <IconButton
                                    edge="end"
                                    onClick={() => handleFileRemove(index)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                }
                              >
                                <div className="pinwi-20">
                                  <AttachFileIcon />
                                </div>
                                <ListItemText
                                  primary={(file.name as any) || (file as any)}
                                />
                              </ListItem>
                            ))}
                          </List>
                          {file_error && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small> Please add at least one file.</small>
                            </p>
                          )}
                        </div>
                      </>
                    )}
                    {(assignmentType === 'quiz' && !edit) ||
                    assignmentType === 'ai generated' ? (
                      <>
                        <div className="col-md-6 col-12">
                          <FormControl fullWidth className="">
                            <InputLabel id="level-select-label">
                              Level
                            </InputLabel>

                            <Select
                              label="Level"
                              labelId="level-select-label"
                              id="level-select"
                              value={level}
                              disabled={isQuizGenerated}
                              onChange={(e) => setLevel(e.target.value)}
                            >
                              <MenuItem value="easy">Easy</MenuItem>

                              <MenuItem value="medium">Medium</MenuItem>

                              <MenuItem value="hard">Hard</MenuItem>
                            </Select>
                          </FormControl>

                          {level_error && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small> Please Select a level</small>
                            </p>
                          )}
                        </div>
                        {assignmentType === 'quiz' ? (
                          <>
                            <div className="col-12">
                              <label className="col-form-label pb-0">
                                Number of Questions for Each Mark
                              </label>
                            </div>

                            <div className="col-md-2 col-12">
                              <TextField
                                label="One Mark"
                                type="number"
                                inputProps={{ min: 0 }}
                                disabled={isQuizGenerated}
                                value={questions[0].one}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  setQuestions((prevState: any) => {
                                    const updatedQuestions = [...prevState];
                                    updatedQuestions[0] = {
                                      ...updatedQuestions[0],
                                      one: value,
                                    };
                                    return updatedQuestions;
                                  });
                                }}
                                fullWidth
                              />
                            </div>
                            <div className="col-md-2 col-12">
                              <TextField
                                label="Two Marks"
                                type="number"
                                inputProps={{ min: 0 }}
                                disabled={isQuizGenerated}
                                value={questions[0].two}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  setQuestions((prevState: any) => {
                                    const updatedQuestions = [...prevState];
                                    updatedQuestions[0] = {
                                      ...updatedQuestions[0],
                                      two: value,
                                    };
                                    return updatedQuestions;
                                  });
                                }}
                                fullWidth
                              />
                            </div>
                            <div className="col-md-2 col-12">
                              <TextField
                                label="Three Marks"
                                type="number"
                                inputProps={{ min: 0 }}
                                disabled={isQuizGenerated}
                                value={questions[0].three}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  setQuestions((prevState: any) => {
                                    const updatedQuestions = [...prevState];
                                    updatedQuestions[0] = {
                                      ...updatedQuestions[0],
                                      three: value,
                                    };
                                    return updatedQuestions;
                                  });
                                }}
                                fullWidth
                              />
                            </div>
                            <div className="col-md-2 col-12">
                              <TextField
                                label="Four Marks"
                                type="number"
                                inputProps={{ min: 0 }}
                                disabled={isQuizGenerated}
                                value={questions[0].four}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  setQuestions((prevState: any) => {
                                    const updatedQuestions = [...prevState];
                                    updatedQuestions[0] = {
                                      ...updatedQuestions[0],
                                      four: value,
                                    };
                                    return updatedQuestions;
                                  });
                                }}
                                fullWidth
                              />
                            </div>
                            <div className="col-md-2 col-12">
                              <TextField
                                label="Five Marks"
                                type="number"
                                inputProps={{ min: 0 }}
                                disabled={isQuizGenerated}
                                value={questions[0].five}
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  setQuestions((prevState: any) => {
                                    const updatedQuestions = [...prevState];
                                    updatedQuestions[0] = {
                                      ...updatedQuestions[0],
                                      five: value,
                                    };
                                    return updatedQuestions;
                                  });
                                }}
                                fullWidth
                              />
                            </div>
                            <div className="col-md-2 col-12">
                              <TextField
                                label="Total Questions"
                                type="number"
                                disabled
                                value={totalQuestions}
                                // onChange={(e) => setQuestions(e.target.value)}
                                fullWidth
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="row mt-4">
                              <div className="col-4">
                                <TextField
                                  label="No. of questions"
                                  type="number"
                                  name="no_questions"
                                  value={questionKey}
                                  onChange={(e) =>
                                    setQuestionKey(e.target.value)
                                  }
                                  fullWidth
                                />
                              </div>
                              <div className="col-4">
                                <TextField
                                  label="Marks per question"
                                  type="number"
                                  value={questionValue}
                                  name="marks_per_questions"
                                  onChange={(e) =>
                                    setQuestionValue(e.target.value)
                                  }
                                  fullWidth
                                />
                              </div>
                              <button
                                className="col-md-2 col-12 btn btn-primary"
                                onClick={handleQuestionmap}
                              >
                                Add questions
                              </button>
                              <div className="col-md-2 col-12">
                                <TextField
                                  label="Total Questions"
                                  type="number"
                                  disabled
                                  value={totalQuestions}
                                  // onChange={(e) => setQuestions(e.target.value)}
                                  fullWidth
                                />
                              </div>
                              <div className="row">
                                <div className="col-6">
                                  <ul className="ps-3">
                                    {questionMap?.map((item, index) => (
                                      <li
                                        key={index}
                                        className="fancy-hover list-item"
                                      >
                                        <div className="d-flex justify-content-between align-items-center">
                                          <span>
                                            {item.key} question(s) of{' '}
                                            {item.value} mark(s) each
                                          </span>
                                          <DeleteIcon
                                            className="text-danger delete-icon"
                                            onClick={() =>
                                              handleDelete(
                                                item.key,
                                                item.value,
                                                index,
                                              )
                                            }
                                          />
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {questions_error && (
                          <p className="error-text " style={{ color: 'red' }}>
                            <small>
                              {' '}
                              Please enter a valid Number of Questions
                            </small>
                          </p>
                        )}

                        <div className="col-lg-12">
                          <TextField
                            label="Topic"
                            type="text"
                            disabled={isQuizGenerated}
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            fullWidth
                          />

                          {topic_error && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small> Please enter a valid Topic</small>
                            </p>
                          )}
                        </div>
                      </>
                    ) : null}

                    <div className="col-12 mt-3 mb-5">
                      <label className="col-form-label">
                        Instructions for students<span>*</span>
                      </label>
                      <ReactQuill
                        id="text"
                        readOnly={isQuizGenerated}
                        placeholder="instructions"
                        ref={quillRef}
                        value={assignmentData.instructions}
                        onChange={handleQuillChange}
                        theme="snow"
                        className={darkMode ? 'quill-dark' : ''}
                        style={{ height: '120px', borderRadius: '8px' }}
                      />
                      {instructions_error && (
                        <p className="error-text" style={{ color: 'red' }}>
                          <small>Please enter Instructions.</small>
                        </p>
                      )}
                    </div>
                    {assignmentType == 'ai generated' && (
                      <div className="col-12 mt-3 mb-5">
                        {/* <label className="col-form-label">
                        Assignment Configuration Instructions<span>*</span>
                        </label> */}
                        <TextField
                          fullWidth
                          multiline
                          name="config_instructions"
                          label="Assignment configuration instructions"
                          type="text"
                          value={configInstructions}
                          onChange={(e) =>
                            setConfigInstructions(e.target.value)
                          }
                          rows={3}
                        />
                        {instructions_error && (
                          <p className="error-text" style={{ color: 'red' }}>
                            <small>Please enter Instructions.</small>
                          </p>
                        )}
                      </div>
                    )}

                    <div className="col-12">
                      {selectedEntity.toLowerCase() === 'college' &&
                        boxes.length > 0 &&
                        boxes?.map((box, index) => (
                          <div key={index} className="row g-4">
                            {/* Course Selection */}
                            <div className="col-md-4 col-12">
                              {/* <label className="col-form-label">
                                Course<span>*</span>
                              </label> */}
                              <FormControl fullWidth>
                                <InputLabel id={`course_id_${index}`}>
                                  Course
                                </InputLabel>
                                <Select
                                  labelId={`course_id_${index}`}
                                  id={`demo3-multiple-name-${index}`}
                                  name="course_id"
                                  label="Course"
                                  onChange={(event: any) =>
                                    handelSubjectBoxChange(event, index)
                                  }
                                  value={box.course_id || ''}
                                >
                                  {filteredcoursesData
                                    ?.filter((course) =>
                                      teacherCourse?.includes(
                                        String(course.id),
                                      ),
                                    )
                                    ?.map((course) => (
                                      <MenuItem
                                        key={course.id}
                                        value={course.id}
                                      >
                                        {course.course_name}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                              {errorForCourse_semester_subject[index]
                                ?.course_id_error === true && (
                                <p
                                  className="error-text"
                                  style={{ color: 'red' }}
                                >
                                  <small>Please enter a valid Course.</small>
                                </p>
                              )}
                            </div>

                            {/* Semester Selection */}
                            <div className="col-md-4 col-12">
                              {/* <label className="col-form-label">
                                Semester <span>*</span>
                              </label> */}
                              <FormControl fullWidth>
                                <InputLabel id={`semester_id_${index}`}>
                                  Semester
                                </InputLabel>
                                <Select
                                  labelId={`semester_id_${index}`}
                                  id={`semester_select_${index}`}
                                  name="semester_number"
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
                              {errorForCourse_semester_subject[index]
                                ?.semester_number_error && (
                                <p
                                  className="error-text"
                                  style={{ color: 'red' }}
                                >
                                  <small>Please select a Semester.</small>
                                </p>
                              )}
                            </div>

                            {/* Subjects Selection */}
                            <div className="col-md-4 col-12">
                              {/* <label className="col-form-label">
                                Subjects <span>*</span>
                              </label> */}
                              <FormControl fullWidth>
                                <InputLabel id={`subject_label_${index}`}>
                                  Subject
                                </InputLabel>
                                <Select
                                  labelId={`subject_label_${index}`}
                                  id={`subject_select_${index}`}
                                  name="subjects"
                                  label="subjects"
                                  value={box.subjects || []}
                                  onChange={(event: any) =>
                                    handelSubjectBoxChange(event, index)
                                  }
                                >
                                  {box.filteredSubjects
                                    ?.filter((subject) =>
                                      tescherSubjects?.includes(
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
                              {errorForCourse_semester_subject[index]
                                ?.subjects_error && (
                                <p
                                  className="error-text"
                                  style={{ color: 'red' }}
                                >
                                  <small>
                                    Please select at least one subject.
                                  </small>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      {selectedEntity.toLowerCase() === 'school' &&
                        boxesForSchool.length > 0 &&
                        boxesForSchool?.map((box, index) => (
                          <div key={index} className="row">
                            {/* Class Selection */}
                            <div className={box.selected_class_name}>
                              {/* <label className="col-form-label">
                                Class<span>*</span>
                              </label> */}
                              <FormControl fullWidth>
                                <InputLabel id={`class_id_${index}`}>
                                  Class
                                </InputLabel>
                                <Select
                                  labelId={`class_id_${index}`}
                                  id={`class_select_${index}`}
                                  name="class_id"
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
                              {errorForClass_stream_subject[index]
                                ?.class_id_error && (
                                <p
                                  className="error-text"
                                  style={{ color: 'red' }}
                                >
                                  <small>Please select a Class.</small>
                                </p>
                              )}
                            </div>
                            {box.is_Stream && (
                              <div className="col-md-4 col-12 mb-3">
                                {/* <label className="col-form-label">
                                  Stream Name<span>*</span>
                                </label> */}
                                <FormControl fullWidth>
                                  <InputLabel id={`stream_id_${index}`}>
                                    Stream Name
                                  </InputLabel>
                                  <Select
                                    labelId={`stream_id_${index}`}
                                    id={`stream_select_${index}`}
                                    name="stream"
                                    label="Stream Name"
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
                                          backgroundColor:
                                            inputfield(namecolor),
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
                                          backgroundColor:
                                            inputfield(namecolor),
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
                                {errorForClass_stream_subject[index]
                                  ?.stream_error && (
                                  <p
                                    className="error-text"
                                    style={{ color: 'red' }}
                                  >
                                    <small>Please select a Stream.</small>
                                  </p>
                                )}
                              </div>
                            )}
                            <div className={box.selected_class_name}>
                              {/* <label className="col-form-label">
                                Subjects <span>*</span>
                              </label> */}
                              <FormControl fullWidth>
                                <InputLabel id={`subject_label_${index}`}>
                                  Subject
                                </InputLabel>
                                <Select
                                  labelId={`subject_label_${index}`}
                                  id={`subject_select_${index}`}
                                  name="subjects"
                                  label="subjects"
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
                              {errorForClass_stream_subject[index]
                                ?.subjects_error && (
                                <p
                                  className="error-text"
                                  style={{ color: 'red' }}
                                >
                                  <small>
                                    Please select at least one subject.
                                  </small>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="col-12">
                      <Box>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectAll}
                              onChange={handleChange}
                            />
                          }
                          label="Select All"
                        />
                        {'(' + selectedStudents?.length + ')'}
                        <Autocomplete
                          multiple
                          options={listOfStudentFiltered || []}
                          getOptionLabel={(option) => `${option.name}`}
                          value={selectedStudents}
                          onChange={(_, newValue) => {
                            setSelectedStudents(newValue);
                            checkStudent(newValue);
                            setSelectAll(
                              newValue.length === listOfStudentFiltered?.length,
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Students"
                              placeholder="search students"
                            />
                          )}
                          renderOption={(props, option, { selected }) => (
                            <li {...props} key={option.id || option.first_name}>
                              <Checkbox checked={selected} />
                              {option.name}
                            </li>
                          )}
                          renderTags={(value, getTagProps) => (
                            <Box
                              sx={{
                                maxHeight: '75px',
                                overflowY: 'auto',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '4px',
                              }}
                            >
                              {value?.map((option, index) => {
                                const tagProps = getTagProps({ index });

                                return (
                                  <React.Fragment
                                    key={option.id || `${option.name}-${index}`}
                                  >
                                    <Chip
                                      {...tagProps} // Spread other props WITHOUT key
                                      label={`${option.name}`}
                                    />
                                  </React.Fragment>
                                );
                              })}
                            </Box>
                          )}
                          sx={{
                            '& .MuiAutocomplete-inputRoot': {
                              flexWrap: 'wrap',
                            },
                            '& .MuiAutocomplete-tagList': {
                              maxHeight: '75px',
                              overflowY: 'auto',
                            },
                          }}
                        />
                        {errorselectStudent && (
                          <p className="error-text" style={{ color: 'red' }}>
                            <small>Please select at least one student</small>
                          </p>
                        )}
                      </Box>
                    </div>
                    <div className="col-lg-12">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="row g-4">
                          <div className="col-lg-4">
                            {type !== 'quiz' ? (
                              <DesktopDatePicker
                                label="Available From"
                                value={availableFrom}
                                minDate={!edit ? dayjs() : undefined}
                                onChange={handleAvailableFromChange}
                                slotProps={{
                                  textField: (params) => (
                                    <TextField {...params} />
                                  ),
                                }}
                              />
                            ) : (
                              <DateTimePicker
                                label="Available From"
                                value={availableFrom}
                                minDateTime={
                                  !edit ? dayjs().add(10, 'minute') : undefined
                                }
                                onChange={handleAvailableFromChange}
                                closeOnSelect={false}
                                slotProps={{
                                  textField: (params) => (
                                    <TextField {...params} />
                                  ),
                                }}
                              />
                            )}
                            {availableFrom_error && (
                              <p
                                className="error-text"
                                style={{ color: 'red' }}
                              >
                                <small>
                                  Please select today or a future date.
                                </small>{' '}
                              </p>
                            )}
                          </div>
                          <div className="col-lg-4">
                            <DesktopDatePicker
                              className="col-6"
                              label="Due Date"
                              value={dueDate}
                              onChange={handleDueDateChange}
                              minDate={!edit ? dayjs() : undefined}
                              slotProps={{
                                textField: (params) => (
                                  <TextField {...params} />
                                ),
                              }}
                            />
                            {due_date_error && (
                              <p
                                className="error-text"
                                style={{ color: 'red' }}
                              >
                                <small>Please select a due date.</small>
                              </p>
                            )}
                          </div>
                          {error != null && (
                            <span>
                              <small
                                className="error-text"
                                style={{ color: 'red' }}
                              >
                                {error}
                              </small>
                            </span>
                          )}

                          <div className="col-lg-4">
                            <TimePicker
                              className="col-6"
                              label="Due Time"
                              value={dueTime} // Ensure it's a Dayjs object
                              onChange={(newValue) => setDueTime(newValue)} // Directly set Dayjs object
                              closeOnSelect={false}
                              slotProps={{
                                textField: (params) => (
                                  <TextField {...params} />
                                ),
                              }}
                            />
                            {dueTime_error && (
                              <p
                                className="error-text"
                                style={{ color: 'red' }}
                              >
                                <small>Please select a due time.</small>
                              </p>
                            )}
                          </div>
                          {type === 'quiz' && (
                            <div className="col-lg-4">
                              <TextField
                                type="number"
                                label="Quiz Duration (minutes)"
                                value={quiz_timer}
                                inputProps={{ min: 0 }}
                                onChange={(e) => setQuizTimer(e.target.value)}
                                fullWidth
                                margin="normal"
                              />
                              {quiz_timer_error && (
                                <p
                                  className="error-text"
                                  style={{ color: 'red' }}
                                >
                                  Please enter quiz timer.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </LocalizationProvider>
                    </div>
                    <div className="col-3">
                      <div className="d-flex flex-column ">
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={allowLateSubmission}
                              onChange={(e) =>
                                setAllowLateSubmission(e.target.checked)
                              }
                            />
                          }
                          label="Allow late submissions"
                        />
                        {assignmentType === 'quiz' && (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={allowMultipleAttempt}
                                onChange={(e) =>
                                  setAllowMultipleAttempt(e.target.checked)
                                }
                              />
                            }
                            label="Allow multiple attempt"
                          />
                        )}
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={sendNotification}
                              onChange={(e) =>
                                setSendNotification(e.target.checked)
                              }
                            />
                          }
                          label="Send notification to students"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={addToStudentRepost}
                              onChange={(e) =>
                                setAddToStudentRepost(e.target.checked)
                              }
                            />
                          }
                          label="Add to Student Grade Report"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      {assignmentType == 'written' ||
                      (assignmentType == 'quiz' && isQuizGenerated) ||
                      (assignmentType == 'quiz' && edit) ||
                      (assignmentType == 'ai generated' &&
                        isAiAssignmentGenerated) ? (
                        <div className="d-flex align-items-center gap-2 justify-content-end">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              assignmentType === 'quiz' && setIsModalOpen(true)
                            }
                            style={{ marginTop: 20, marginRight: 10 }}
                          >
                            Preview
                          </Button>

                          <Button
                            variant="outlined"
                            color={saveAsDrafts ? 'primary' : 'secondary'} // Change color dynamically
                            style={{
                              marginTop: 20,

                              marginRight: 10,
                            }}
                            onClick={handleSaveAsDraft}
                          >
                            Save as Draft
                          </Button>

                          <Button
                            variant="contained"
                            color="success"
                            style={{ marginTop: 20 }}
                            onClick={
                              assignmentType !== 'quiz'
                                ? submitAssignment
                                : () => handleSubmitQuiz(false)
                            }
                          >
                            Publish
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center gap-2 justify-content-end">
                          <Button
                            variant="contained"
                            color="success"
                            style={{ marginTop: 20 }}
                            onClick={
                              assignmentType == 'ai generated'
                                ? () => generateQuiz('assignment')
                                : generateQuiz
                            }
                          >
                            {assignmentType == 'ai generated'
                              ? 'Generate Assignment'
                              : 'Generate Quiz'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AssignmentModal
          open={isAssignmentModalOpen}
          onClose={() => setAssignmentModalOpen(false)}
          assignments={[assignmentGenrData]}
          onProceed={(assignmentData) => {
            setAssignmentJsonQuestions(assignmentData);
            setAssignmentModalOpen(false);
            submitAssignment(false, 'json', assignmentData); // close after proceed
          }}
          totalQuestions={totalQuestions}
          totalMarks={totalMarks}
        />
        <QuizModal
          isEdit={isedit}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          quizData={quizData}
          onSave={handleSaveQuiz}
        />
      </div>
    </div>
  );
};
