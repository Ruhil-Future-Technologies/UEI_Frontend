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
  QUERY_KEYS_CLASS,
  QUERY_KEYS_COURSE,
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

export interface Assignment {
  id?: string;
  S;
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
  files: File[] | string[]; // Assuming file is optional and a File object
}
export const CreateAssignments = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const location = useLocation();
  const { type } = location.state || {};
  console.log({ assignmentType: type });

  const { id } = useParams();

  const { getData, postData, putData } = useApi();
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
  const nevegate = useNavigate();
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
  const [selectAll, setSelectAll] = useState(false);
  const [teacherStream, setTeacherStream] = useState<string[]>();
  const [tescherSchoolSubjects, setTeacherSchoolSubjects] =
    useState<string[]>();

  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [listOfStudent, setListOfStudent] = useState<StudentRep0oDTO[]>();

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

  const [quizData, setQuizData] = useState<any>({});
  const [level, setLevel] = useState('');
  const [questions, setQuestions] = useState<any>([
    { one: null, two: null, three: null, four: null, five: null },
  ]);
  const [topic, setTopic] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalQuestions = questions.reduce(
    (acc: any, curr: any) =>
      acc + curr.one + curr.two + curr.three + curr.four + curr.five,
    0,
  );

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
  // useEffect(() => {

  // }, [id]);
  const getAssignmentInfo = (students: StudentRep0oDTO[]) => {
    if (id) {
      try {
        getData(`/assignment/get/${id}`)
          .then(async (response) => {
            if (response.data) {
              setAssignmentData(response.data);
              if (response?.data?.files) {
                setFiles(response?.data?.files);
              }
              const extractedDate = dayjs(response?.data?.due_date_time).format(
                'YYYY-MM-DD',
              ); // "2025-03-02"
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
              console.log(selectedStudents);
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
                ).map((semester_number) => ({
                  course_id: CourseKey,
                  semester_number: semester_number,
                  subjects:
                    response.data.course_semester_subjects[CourseKey][
                      semester_number
                    ],
                  filteredSemesters: allsemesters.filter(
                    (item) => item.course_id == CourseKey,
                  ),
                  filteredSubjects: allSubject.filter(
                    (item) =>
                      item.semester_number == semester_number &&
                      item.course_id == CourseKey,
                  ),
                })),
              );
              setBoxes(output);
            } else {
              getSubjects('School');
              setSelectedEntity('School');
              const allSubject: SubjectRep0oDTO[] = await getSubjects('School');
              const output: BoxesForSchool[] = Object.keys(
                response.data.class_stream_subjects,
              ).flatMap((classKey) =>
                Object.keys(response.data.class_stream_subjects[classKey]).map(
                  (stream) => ({
                    stream: stream,
                    subjects:
                      response.data.class_stream_subjects[classKey][stream],
                    class_id: classKey,
                    is_Stream: stream !== 'general',
                    selected_class_name:
                      stream === 'general' ? 'col-6' : 'col-4',
                    filteredSubjects:
                      stream == 'general'
                        ? allSubject.filter((item) => item.class_id == classKey)
                        : allSubject.filter(
                            (item) =>
                              item.class_id == classKey &&
                              item.stream == stream,
                          ),
                  }),
                ),
              );
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
      } catch (error: any) {
        toast.error(error.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      }
    }
  };
  useEffect(() => {
    getAssignmentInfo();
  }, [id]);
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
                  ? subjectList.map((subject) => ({ semester, subject }))
                  : [],
              ),
            );
            setTeacherSubjects(semesterSubjects.map(({ subject }) => subject));

            setTeacherCourse((prev) => [...(prev || []), ...courseKeys]);
          } else {
            getSubjects('School');
            setSelectedEntity('School');
            // const allSubject: SubjectRep0oDTO[] = await getSubjects('School');
            // const output: BoxesForSchool[] = Object.keys(
            //   data.data.class_stream_subjects,
            // ).flatMap((classKey) =>
            //   Object.keys(data.data.class_stream_subjects[classKey]).map(
            //     (stream) => ({
            //       stream: stream,
            //       subjects: data.data.class_stream_subjects[classKey][stream],
            //       class_id: classKey,
            //       is_Stream: stream !== 'general',
            //       selected_class_name: stream === 'general' ? 'col-6' : 'col-4',
            //       filteredSubjects:
            //         stream == 'general'
            //           ? allSubject.filter((item) => item.class_id === classKey)
            //           : allSubject.filter(
            //             (item) =>
            //               item.class_id === classKey &&
            //               item.stream === stream,
            //           ),
            //     }),
            //   ),
            // );

            const streeamKeys = Object.values(
              data.data.class_stream_subjects as Record<
                string,
                Record<string, any>
              >,
            ).flatMap((streamkeys) => Object.keys(streamkeys));
            setTeacherStream(streeamKeys);

            const classIds = Object.keys(data.data.class_stream_subjects).map(
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
                  subjectArray.map((subject) => ({
                    stream: streamName,
                    subject,
                  })),
                ),
            );

            setTeacherSchoolSubjects(Subjects.map(({ subject }) => subject));
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  // const getInstitutelist = async (entityId: any) => {
  //   getData(`${InstituteURL}`)
  //     .then((data) => {
  //       const fiteredInstitutedata = data.data.filter(
  //         (institute: any) =>
  //           institute.is_active === 1 &&
  //           institute.is_approve === true &&
  //           institute.entity_id === entityId,
  //       );
  //       if (data.data) {
  //         setInstitutionsData(fiteredInstitutedata);
  //         setFiteredInstitute(fiteredInstitutedata);
  //       }
  //     })
  //     .catch((e) => {
  //       if (e?.response?.status === 401) {
  //         toast.error(e?.message, {
  //           hideProgressBar: true,
  //           theme: 'colored',
  //         });
  //       }
  //     });
  // };
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
          const filteredCourses = data.data.course_data.filter(
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
        if (data.data) {
          const filteredClasses = data.data.classes_data.filter((classn: any) =>
            classIds.includes(classn.id),
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

  // const getListOfStudnetsForAssignment = () => {

  //   getData(`/assignment_submission/get/students/${teacher_id}`).then((response) => {
  //     if (response?.status) {
  //       //console.log(assignmentId)
  //       console.log(response?.data)
  //       // const filteredSubmition=response.data
  //       setSelectedStudents(response?.data)
  //     }
  //   })
  // }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedStudents(listOfStudent || []);
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

  const submitAssignment = () => {
    let valid1 = false;
    if (
      !/^[A-Za-z0-9][A-Za-z0-9 _-]{3,98}[A-Za-z0-9]*$/.test(
        assignmentData.title,
      )
    ) {
      setTitle_error(true);
      valid1 = true;
    }
    if (!(files.length > 0)) {
      setFile_error(true);
      valid1 = true;
    } else {
      setFile_error(false);
    }
    if (!/^\d+$/.test(assignmentData.points)) {
      setPoint_error(true);
      valid1 = true;
    } else {
      setPoint_error(false);
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
    const formData = new FormData();
    formData.append('title', assignmentData.title);
    formData.append('type', assignmentType);
    formData.append('contact_email', assignmentData.contact_email);
    formData.append('allow_late_submission', String(allowLateSubmission));
    formData.append('due_date_time', String(mergeDateAndTime()));
    formData.append('available_from', String(availableFrom));
    formData.append('instructions', assignmentData.instructions);
    formData.append('points', assignmentData.points);
    formData.append('save_draft', String(assignmentData.save_draft));
    formData.append('add_to_report', String(addToStudentRepost));
    formData.append('notify', String(sendNotification));
    //const students = selectedStudents.map((student) => String(student.id))
    const students = selectedStudents.map((student) => student.id);
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
        formData.forEach((k, v) => console.log({ k, v }));

        postData('assignment/add', formData).then((response) => {
          if (response.status) {
            toast.success(response.message, {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
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
          nevegate('/teacher-dashboard/assignments');
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
        putData(`/assignment/edit/${id}`, formData)
          .then((response) => {
            if (response.status) {
              toast.success(response.message, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
              nevegate('/teacher-dashboard/assignments');
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

  const generateQuiz = async () => {
    console.log({ topic, level, questions });
    console.log({ assignmentData });

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

    if (error != null) {
      valid1 = true;
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
              subjects_error: !box.subjects?.length, // Ensures subjects is not empty
            },
          }));
        }
      });
    }

    if (valid1) return;

    if (!valid) return;
    console.log({ setLevel_error, setTopic_error, setQuestions_error });

    // const response = await axios.post('/api/quiz/getData', {
    //   // Your request params here
    // });
    const response = {
      data: {
        title: 'Web Development Quiz for B.C.A',
        questions: [
          {
            question: "What is the purpose of the 'viewport' meta tag in HTML?",
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
            question: "What does the 'async' attribute do in a script tag?",
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
            question: 'Which of the following is NOT a valid HTTP status code?',
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
      },
    };
    setQuizData(response.data);
    setIsModalOpen(true);
  };

  const handleSaveQuiz = (updatedQuizData: any) => {
    // Do something with the updated quiz data
    console.log('Updated quiz data:', updatedQuizData);

    // You can make another API call here to save the changes
    // axios.post('/api/quiz/save', updatedQuizData);
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
      prevBoxes.map((box, i) => {
        if (i !== index) return box;

        let updatedBox = { ...box, [name]: value };

        if (name === 'course_id') {
          const filteredSemesters = semesterData.filter(
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

        if (name === 'semester_number') {
          const filteredSubjects = totleSubject.filter(
            (item) =>
              item.semester_number === value &&
              item.course_id === boxes[index].course_id,
          );
          updatedBox = { ...updatedBox, filteredSubjects, subjects: [] };
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
      prevBoxes.map((box, i) => {
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
            const filteredSubjects = totleSubject.filter(
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
        }

        if (name === 'stream') {
          const filteredSubjects = totleSubject.filter(
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
    console.log('save draft called');
    setQuizPayload((prevState: any) => ({
      ...prevState,
      ['save_draft']: true,
    }));
    setSaveAsDraft((prev) => !prev);
    setAssignmentData((prev) => ({
      ...prev,
      ['save_draft']: true,
    }));

    if (assignmentType !== 'quiz') {
      submitAssignment();
    } else {
      handleSubmitQuiz();
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
  }, [dueDate, availableFrom, dueTime]);

  return (
    <div className="main-wrapper">
      <div className="main-content">
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
                  Create Assignments
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="card p-lg-4 bg-m-transparent">
          <div className="cardbody p-0 p-lg-2">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-9">
                  <div className="row g-4">
                    <div className="col-12">
                      <Typography variant="h5" className="mb-4 fw-bold">
                        Create Assignment
                      </Typography>
                      <TextField
                        fullWidth
                        label="Assignment Title"
                        variant="outlined"
                        name="title"
                        value={assignmentData.title}
                        onChange={handleChanges}
                      />
                      {title_error && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small> Please enter a valid Title.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-12">
                      <Typography variant="subtitle1" className="mb-2">
                        Assignment Type
                      </Typography>
                      <div className="overflow-auto">
                        <ToggleButtonGroup
                          value={assignmentType}
                          exclusive
                          onChange={(_, newValue) =>
                            setAssignmentType(newValue)
                          }
                          fullWidth
                          className="assignbtngrp"
                        >
                          <ToggleButton value="written">
                            {' '}
                            <AssignmentIcon /> Written
                          </ToggleButton>
                          <ToggleButton value="quiz">
                            <QuizIcon /> Quiz
                          </ToggleButton>
                          <ToggleButton value="project">
                            <AccountTreeIcon /> Project
                          </ToggleButton>
                          <ToggleButton value="presentation">
                            {' '}
                            <PresentToAllIcon />
                            Presentation
                          </ToggleButton>
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
                        {assignmentType !== 'Quiz' ? 'Assignment' : 'Quiz'}
                      </Typography>
                      {assignmentType !== 'Quiz' && (
                        <TextField
                          fullWidth
                          label="Assignment Title"
                          variant="outlined"
                          name="title"
                          value={assignmentData.title}
                          onChange={handleChanges}
                        />
                      )}
                      {title_error && (
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

                    {assignmentType !== 'quiz' && (
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
                            {files.map((file, index) => (
                              <ListItem
                                className="fileslistitem"
                                key={index}
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
                                <ListItemText primary={file.name as any || file as any} />
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
                    {assignmentType === 'quiz' && (
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
                        <div className="col-12">
                          <label className="col-form-label pb-0">
                            Number of Questions for Each Mark
                          </label>
                        </div>

                        <div className="col-md-2 col-12">
                          <TextField
                            label="One Mark"
                            type="number"
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
                    )}

                    <div className="col-12 mt-3 mb-5">
                      <label className="col-form-label">
                        Instructions<span>*</span>
                      </label>
                      <ReactQuill
                        id="text"
                        placeholder="instuctions"
                        ref={quillRef}
                        value={assignmentData.instructions}
                        onChange={handleQuillChange} // Use the new handler
                        theme="snow"
                        style={{ height: '120px', borderRadius: '8px' }}
                      />
                      {instructions_error && (
                        <p className="error-text" style={{ color: 'red' }}>
                          <small>Please enter Instructions.</small>
                        </p>
                      )}
                    </div>

                    <div className="col-12">
                      {selectedEntity.toLowerCase() === 'college' &&
                        boxes.length > 0 &&
                        boxes.map((box, index) => (
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
                                    .filter((course) =>
                                      teacherCourse?.includes(
                                        String(course.id),
                                      ),
                                    )
                                    .map((course) => (
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
                                    .map((item) => (
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
                                    .map((subject: any) => (
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
                        boxesForSchool.map((box, index) => (
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
                                  {dataClass.map((item) => (
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
                                    .map((subject: any) => (
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
                          options={listOfStudent || []}
                          getOptionLabel={(option) => `${option.name}`}
                          value={selectedStudents}
                          onChange={(_, newValue) => {
                            setSelectedStudents(newValue);
                            setSelectAll(
                              newValue.length === listOfStudent?.length,
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
                              {value.map((option, index) => {
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
                            <DesktopDatePicker
                              label="Available From"
                              value={availableFrom}
                              minDate={dayjs()}
                              onChange={handleAvailableFromChange}
                              slots={{
                                textField: (params) => (
                                  <TextField {...params} />
                                ),
                              }}
                            />
                            {availableFrom_error && (
                              <p
                                className="error-text"
                                style={{ color: 'red' }}
                              >
                                <small>
                                  Please select today or a future date.
                                </small>
                              </p>
                            )}
                          </div>
                          <div className="col-lg-4">
                            <DesktopDatePicker
                              className="col-6"
                              label="Due Date"
                              value={dueDate}
                              onChange={handleDueDateChange}
                              slots={{
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
                              slots={{
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
                    <div className="col-12">
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
                        assignmentType == 'project' ||
                        assignmentType == 'presentation' ||
                        (assignmentType == 'quiz' && isModalOpen) ? (
                        {assignmentType == 'written' ||
                      assignmentType == 'project' ||
                      assignmentType == 'presentation' ||
                      (assignmentType == 'quiz' && isQuizGenerated) ? (
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
                              color={saveAsDraft ? 'primary' : 'secondary'} // Change color dynamically
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
                                : handleSubmitQuiz
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
                            onClick={generateQuiz}
                          >
                            Generate Quiz
                          </Button>
                          ) : (
                        <div className="d-flex align-items-center gap-2 justify-content-end">
                          <Button
                            variant="contained"
                            color="success"
                            style={{ marginTop: 20 }}
                            onClick={generateQuiz}
                          >
                            Generate Quiz
                          </Button>
                        </div>
                      )}
                        )}
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <QuizModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          quizData={quizData}
          onSave={handleSaveQuiz}
        />
        </div>
        <QuizModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          quizData={quizData}
          onSave={handleSaveQuiz}
        />
      </div>
    </div>
  );
};
