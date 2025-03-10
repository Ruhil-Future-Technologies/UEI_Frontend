import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
  OutlinedInput
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

import useApi from '../../../hooks/useAPI';
import { QUERY_KEYS_CLASS, QUERY_KEYS_COURSE, QUERY_KEYS_SUBJECT, QUERY_KEYS_SUBJECT_SCHOOL } from '../../../utils/const';
import { toast } from 'react-toastify';
import { Boxes, BoxesForSchool } from '../../TeacherRgistrationForm';
import { CourseRep0oDTO, IClass, SemesterRep0oDTO, StudentRep0oDTO, SubjectRep0oDTO } from '../../../Components/Table/columns';
import NameContext from '../../Context/NameContext';


export interface Assignment {
  title: string;
  type: string;
  contact_email: string;
  allow_late_submission: boolean;
  due_date_time: string; // Consider using Date if working with Date objects
  available_from: string; // Consider using Date if working with Date objects
  assign_to_students: string[]; // Converted from string representation to an actual array
  instructions: string;
  points: string;
  save_draft: boolean;
  add_to_report: boolean;
  notify: boolean;
  file: File | null; // Assuming file is optional and a File object
}

export const CreateAssignments = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const { getData, postData } = useApi()
  //const stream = ['Science', 'Commerce', 'Arts'];


  const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;
  const getsubjectSchool = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;
  const getSubjectCollege = QUERY_KEYS_SUBJECT.GET_SUBJECT;
  const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;

  const teacherId = localStorage.getItem('user_uuid');
  const [assignmentType, setAssignmentType] = useState('written');
  const [files, setFiles] = useState<File[]>([]);
  const [availableFrom, setAvailableFrom] = useState<Date | null>(null);
 // const [availableUntil, setAvailableUntil] = useState<Date | null>(null);
  const [allowLateSubmission, setAllowLateSubmission] = useState(false);
  const [addToStudentRepost, setAddToStudentRepost] = useState(false);
  const [sendNotification, setSendNotification] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueTime, setDueTime] = useState<Date | null>(null);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [totleSubject, setTotleSubject] = useState<SubjectRep0oDTO[]>([]);
  const [coursesData, setCoursesData] = useState<CourseRep0oDTO[]>([]);
  const [semesterData, setSemesterData] = useState<SemesterRep0oDTO[]>([]);
  const [dataClass, setDataClass] = useState<IClass[]>([]);
  const [teacherCourse, setTeacherCourse] = useState<string[]>();
  const [teacherSemester, setTeacherSemester] = useState<string[]>();
  const [tescherSubjects, setTeacherSubjects] = useState<string[]>();
  //const [teacherClass, setTeacherClass] = useState<string[]>();
  const [teacherStream, setTeacherStream] = useState<string[]>();
  const [tescherSchoolSubjects, setTeacherSchoolSubjects] = useState<string[]>();

  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [listOfStudent, setListOfStudent] = useState<StudentRep0oDTO[]>()


  const [title_error, setTitle_error] = useState(false);
  const [file_error, setFile_error] = useState(false);
  const [point_error, setPoint_error] = useState(false);
  const [instructions_error, setInstructoins_error] = useState(false);
  const [contact_email_email, setContact_email_error] = useState(false);
  const [availableFrom_error,setAvailableFrom_error]= useState(false);
  const [due_date_error, setDue_date_error]=useState(false);
  const [dueTime_error,setDueTime_error]=useState(false);

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
    title: "",
    type: "written",
    contact_email: "",
    allow_late_submission: false,
    due_date_time: "", // Or new Date().toISOString() if using Date type
    available_from: "", // Or new Date().toISOString() if using Date type
    assign_to_students: [],
    instructions: "",
    points: '',
    save_draft: false,
    add_to_report: false,
    notify: false,
    file: null, // File should be null initially
  });

  const getSubjects = async (type: string): Promise<any> => {
    try {
      const url = type === 'college' ? getSubjectCollege : getsubjectSchool;
      const data = await getData(url);

      if (data?.data) {
        setTotleSubject(data.data?.subjects_data);
        return data.data; // Return subjects
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
          
          if (data.data.course_semester_subjects!= null) {
            setSelectedEntity('College');
            getSubjects('college')
            // Extract all course IDs (keys)
            const courseKeys = Object.keys(data.data.course_semester_subjects);

            // Extract all semester IDs for each course
            const semesterKeys = Object.values(data.data.course_semester_subjects as Record<string, Record<string, any>>)
              .flatMap((semesters) => Object.keys(semesters));
            setTeacherSemester(semesterKeys);


            const semesterSubjects = Object.entries(data.data.course_semester_subjects as Record<string, Record<string, string[]>>)
              .flatMap(([semester, subjects]) =>
                Object.entries(subjects).flatMap(([_, subjectList]) =>
                  Array.isArray(subjectList) ? subjectList.map((subject) => ({ semester, subject })) : []
                )
              );
            console.log(semesterSubjects, data.data.course_semester_subjects)
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

            const streeamKeys = Object.values(data.data.class_stream_subjects as Record<string, Record<string, any>>)
            .flatMap((streamkeys) => Object.keys(streamkeys));
          setTeacherStream(streeamKeys);

            const classIds = Object.keys(data.data.class_stream_subjects).map((classKey) => parseInt(classKey, 10));
            //setBoxesForSchool(output);
            getClasslist(classIds);

            const Subjects = Object.entries(data.data.class_stream_subjects as Record<string, Record<string, string[]>>)
              .flatMap(([streasm, subjects]) =>
                Object.entries(subjects).flatMap(([_, subjectList]) =>
                  Array.isArray(subjectList) ? subjectList.map((subject) => ({ streasm, subject })) : []
                )
              );
              setTeacherSchoolSubjects(Subjects.map(({ subject }) => subject))
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
        return data.data; // Return the fetched semesters
      }

      return []; // Return an empty array if no data
    } catch (error) {
      console.error('Error fetching semester data:', error);
      return Promise.reject(error); // Reject the promise if an error occurs
    }
  };

  const getCourses = () => {
    getData(`${CourseURL}`)
      .then((data) => {
        if (data.data) {
          setCoursesData(data?.data);
          const filteredCourses = data.data.course_data.filter((course: any) =>
            course.is_active
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
              classIds.includes(classn.id)
            )
            console.log(classIds,filteredClasses)
            setDataClass(filteredClasses);
          }
        })
        .catch((e) => {
          if (e?.response?.status === 401) {
          }
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    };
  useEffect(() => {
    getSemester();
    getCourses();
    getStudentsForTeacher();
    getTeacherProfileInfo();
  }, [])
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
      setFile_error(false)
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

  const validation = (name: string, value: string) => {
    if (name == "title" && !/^[A-Za-z0-9][A-Za-z0-9 _-]{3,98}[A-Za-z0-9]*$/.test(value)) {
      setTitle_error(true)
    } else {
      setTitle_error(false);
    }

    if (name == 'points' && !/^\d+$/.test(value)) {
      setPoint_error(true)
    } else {
      setPoint_error(false)
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
  }
  const getStudentsForTeacher = () => {
    try {
      getData(`/student/get/${teacherId}`).then((response) => {
        if (response.status) {
          setListOfStudent(response.data)
        }
      }).catch((error) => {
        toast.error(error.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center'
        })
      })
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center'
      })
    }
  }
  
  const submitAssignment = () => {

    let valid1 = false;
    if (!/^[A-Za-z0-9][A-Za-z0-9 _-]{3,98}[A-Za-z0-9]*$/.test(assignmentData.title)) {
      setTitle_error(true)
      valid1 = true;
    }
    if (!(files.length > 0)) {
      setFile_error(true);
      valid1 = true;
    } else {
      setFile_error(false);
    }
    if (!/^\d+$/.test(assignmentData.points)) {
      setPoint_error(true)
      valid1 = true;
    } else {
      setPoint_error(false)
    }

    if (assignmentData.instructions == '') {
      setInstructoins_error(true);
      valid1 = true;
    } else {
      setInstructoins_error(false);
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assignmentData.contact_email)){
      setContact_email_error(true)
      valid1 =true;
    }else{
      setContact_email_error(false)
    }
    if(availableFrom==null){
      setAvailableFrom_error(true);
      valid1 =true;
    }else{
      setAvailableFrom_error(false);
    }
    if(dueDate==null){
      setDue_date_error(true);
      valid1 =true;
    }else{
      setDue_date_error(false);
    }
    if(dueTime ==null){
      setDueTime_error(true);
      valid1 =true;
    }else{
      setDueTime_error(false);
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
      console.log(boxes)
      boxes.forEach((box, index) => {
        console.log(!box.course_id, !box.semester_number, !box.subjects?.length)
        if (!box.course_id || !box.semester_number || !box.subjects?.length) {
          console.log("kdfsdhkjjfsdf")
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
    console.log(valid);
    if (valid1) return;
    if (!valid) return;
    const formData = new FormData();
    formData.append('title', assignmentData.title);
    formData.append('type', assignmentData.type);
    formData.append('contact_email', assignmentData.contact_email);
    formData.append('allow_late_submission', assignmentData.allow_late_submission ? 'True' : 'False');
    formData.append('due_date_time', String(dueDate));
    formData.append('available_from', String(availableFrom));
    formData.append('instructions', assignmentData.instructions);
    formData.append('points', assignmentData.points);
    formData.append('save_draft', assignmentData.save_draft ? 'True' : 'False');
    formData.append('add_to_report', addToStudentRepost ? 'True' : 'False');
    formData.append('notify', sendNotification ? 'True' : 'False');
    let students = ['2323']
    students.forEach((student) => {
      formData.append('assign_to_students', student)
    })
    files.forEach((file) => {
      formData.append('file[]', file);
    });

    try {
      postData('assignment/add', formData).then((response) => {
        if (response.status) {
          toast.success(response.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center'
          })
        }
        setAssignmentData({
          title: "",
          type: "written",
          contact_email: "",
          allow_late_submission: false,
          due_date_time: "", // Or new Date().toISOString() if using Date type
          available_from: "", // Or new Date().toISOString() if using Date type
          assign_to_students: [],
          instructions: "",
          points: '',
          save_draft: false,
          add_to_report: false,
          notify: false,
          file: null, // File should be null initially
        })
      });
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center'
      })
    }

  }

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
    }
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
          console.log(semesterData)
          updatedBox = {
            ...updatedBox,
            filteredSemesters,
            semester_number: '',
            subjects: [],
            filteredSubjects: [],
          };
        }

        if (name === 'semester_number') {
          console.log(totleSubject);
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
          console.log(selectedClass);
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
              String(item.stream).toLowerCase() ===
              value.toString().toLowerCase(),
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
    if((files.length==1)){
      setFile_error(true)
    }else{
      setFile_error(false)
    }

  };
  const handleSaveAsDraft = () => {
    setSaveAsDraft((prev) => !prev)
    setAssignmentData((prev) => ({
      ...prev,
      ["save_draft"]: true,
    }));
  }

  useEffect(()=>{

    if(availableFrom==null && availableFrom_error){
      setAvailableFrom_error(true);
      
    }else{
      setAvailableFrom_error(false);
    }
    if(dueDate==null && due_date_error){
      setDue_date_error(true);
    }else{
      setDue_date_error(false);
    }
    if(dueTime ==null && dueTime_error){
      setDueTime_error(true);
    }else{
      setDueTime_error(false);
    }
  },[dueDate,availableFrom,dueTime])
  console.log( coursesData, listOfStudent,boxesForSchool,teacherStream);
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
                  Assignments
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-6">
            <div className="card p-4">
              <div className="cardbody">
                <div className="row g-4">
                  <div className="col-12">
                    <Typography variant="h5" className="mb-4 fw-bold">
                      Create Assignment
                    </Typography>
                    <TextField
                      fullWidth
                      label="Assignment Title"
                      variant="outlined"
                      name='title'
                      value={assignmentData.title}
                      onChange={handleChanges}
                    />
                    {
                      title_error && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small> Please enter a valid Title.</small>
                        </p>
                      )
                    }
                  </div>
                  <div className="col-12">
                    <Typography variant="subtitle1" className="mb-2">
                      Assignment Type
                    </Typography>
                    <ToggleButtonGroup
                      value={assignmentType}
                      exclusive
                      onChange={(_, newValue) => setAssignmentType(newValue)}
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
                  <div className="col-12">
                    <Typography variant="subtitle1">Attachments</Typography>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      multiple
                      name='file'
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
                          <ListItemText primary={file.name} />
                        </ListItem>
                      ))}
                    </List>
                    {file_error &&
                      <p className="error-text " style={{ color: 'red' }}>
                        <small> Please add at least one file.</small>
                      </p>
                    }

                  </div>
                  <div className="col-lg-6">
                    <TextField
                      fullWidth
                      label="Points"
                      variant="outlined"
                      name='points'
                      onChange={handleChanges}
                      type="number"
                      inputProps={{ min: '0' }}
                      value={assignmentData.points}
                    />
                    {
                      point_error && (
                        <p className='error-text' style={{ color: 'red' }}>
                          <small>
                            Please enter a valid points.
                          </small>
                        </p>
                      )
                    }
                  </div>
                  <div className="col-12">
                    <TextField
                      fullWidth
                      label="Instructions"
                      variant="outlined"
                      onChange={handleChanges}
                      value={assignmentData.instructions}
                      name='instructions'
                      multiline
                      rows={4}
                    />
                    {
                      instructions_error && (
                        <p className='error-text' style={{ color: 'red' }}>
                          <small>
                            Please enter Instructions.
                          </small>
                        </p>
                      )
                    }
                  </div>
                  {selectedEntity.toLowerCase() === 'college' &&
                    boxes.length > 0 &&
                    boxes.map((box, index) => (
                      <div
                        key={index}
                        className="row d-flex justify-content-center"
                      >
                        {/* Course Selection */}
                        <div className="col-md-4 col-12 mb-3">
                          <label className="col-form-label">
                            Course<span>*</span>
                          </label>
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
                              {filteredcoursesData.filter((course) => teacherCourse?.includes(String(course.id))).map((course) => (
                                <MenuItem key={course.id} value={course.id}>
                                  {course.course_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {errorForCourse_semester_subject[index]
                            ?.course_id_error === true && (
                              <p className="error-text" style={{ color: 'red' }}>
                                <small>Please enter a valid Course.</small>
                              </p>
                            )}
                        </div>

                        {/* Semester Selection */}
                        <div className="col-md-4 col-12 mb-3">
                          <label className="col-form-label">
                            Semester <span>*</span>
                          </label>
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
                              {box.filteredSemesters?.filter((item) => teacherSemester?.includes(String(item.semester_number))).map((item) => (
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
                              <p className="error-text" style={{ color: 'red' }}>
                                <small>Please select a Semester.</small>
                              </p>
                            )}
                        </div>

                        {/* Subjects Selection */}
                        <div className="col-md-4 col-12 mb-3">
                          <label className="col-form-label">
                            Subjects Taught<span>*</span>
                          </label>
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
                              {box.filteredSubjects?.filter((subject) => tescherSubjects?.includes(subject.subject_name)).map((subject: any) => (
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
                              <p className="error-text" style={{ color: 'red' }}>
                                <small>Please select at least one subject.</small>
                              </p>
                            )}
                        </div>

                      </div>
                    ))}
                  {selectedEntity.toLowerCase() === 'school' &&
                    boxesForSchool.length > 0 &&
                    boxesForSchool.map((box, index) => (
                      <div
                        key={index}
                        className="row d-flex justify-content-center"
                      >
                        {/* Class Selection */}
                        <div className={box.selected_class_name}>
                          <label className="col-form-label">
                            Class<span>*</span>
                          </label>
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
                              <p className="error-text" style={{ color: 'red' }}>
                                <small>Please select a Class.</small>
                              </p>
                            )}
                        </div>
                        {box.is_Stream && (
                          <div className="col-md-4 col-12 mb-3">
                            <label className="col-form-label">
                              Stream Name<span>*</span>
                            </label>
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
                          <label className="col-form-label">
                            Subjects Taught<span>*</span>
                          </label>
                          <FormControl fullWidth>
                            <InputLabel id={`subject_label_${index}`}>
                              Subject
                            </InputLabel>
                            <Select
                              labelId={`subject_label_${index}`}
                              id={`subject_select_${index}`}
                              multiple
                              name="subjects"
                              value={box.subjects || []}
                              onChange={(event: any) =>
                                handelSchoolBoxChange(event, index)
                              }
                              input={<OutlinedInput label="Subject" />}
                              renderValue={(selected) =>
                                (selected as string[])
                                  .map((id) => {
                                    const subject = totleSubject.find(
                                      (subject: any) =>
                                        subject.subject_name === id,
                                    );
                                    return subject ? subject.subject_name : '';
                                  })
                                  .join(', ')
                              }
                            >
                              {box.filteredSubjects?.filter((subject) => tescherSchoolSubjects?.includes(subject.subject_name))?.map((subject: any) => (
                                <MenuItem
                                  key={subject.subject_id}
                                  value={subject.subject_name}
                                >
                                  <Checkbox
                                    checked={box.subjects?.includes(
                                      subject.subject_name.toString(),
                                    )}
                                  />
                                  <ListItemText
                                    primary={subject.subject_name}
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {errorForClass_stream_subject[index]
                            ?.subjects_error && (
                              <p className="error-text" style={{ color: 'red' }}>
                                <small>Please select at least one subject.</small>
                              </p>
                            )}
                        </div>
                      </div>
                    ))}

                  <div className="col-12">
                    <TextField
                      fullWidth
                      label="Contact Email"
                      variant="outlined"
                      name='contact_email'
                      onChange={handleChanges}
                      type="email"
                      value={assignmentData.contact_email}
                      autoComplete='off'
                    />
                    {
                      contact_email_email && (
                        <p className='error-text' style={{ color: 'red' }}>
                          <small>
                            Please enter a valid Email Id.
                          </small>
                        </p>
                      )
                    }
                  </div>
                  <div className="col-lg-12">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <div className="row g-4">
                        <div className="col-lg-6">
                          <DesktopDatePicker
                            label="Available From"
                            value={availableFrom}
                            onChange={(newValue) => setAvailableFrom(newValue)}
                            slots={{
                              textField: (params) => <TextField {...params} />,
                            }}
                          />
                          {
                            availableFrom_error && (
                              <p className='error-text' style={{color:'red'}}>
                                <small>
                                    Please select a available date.
                                </small>
                              </p>
                            )
                          }
                        </div>

                        <div className="col-lg-6">
                          <DesktopDatePicker
                            className="col-6"
                            label="Due Date"
                            value={dueDate}
                            onChange={(newValue) => setDueDate(newValue)}
                            slots={{
                              textField: (params) => <TextField {...params} />,
                            }}
                          />
                          {
                            due_date_error && (
                              <p className='error-text' style={{color:'red'}}>
                                <small>
                                   Please select a due date.
                                </small>
                              </p>
                            )
                          }
                        </div>
                        <div className="col-lg-6">
                          <TimePicker
                            className="col-6"
                            label="Due Time"
                            value={dueTime}
                            onChange={(newValue) => setDueTime(newValue)}
                            slots={{
                              textField: (params) => <TextField {...params} />,
                            }}
                          />
                          {
                            dueTime_error &&(
                              <p className='error-text' style={{color:'red'}}>
                                <small>
                                   Please select a due time.
                                </small>
                              </p>
                            )
                          }
                        </div>
                      </div>
                    </LocalizationProvider>
                  </div>
                  <div className="col-12">
                    <div className="d-flex flex-column ">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={allowLateSubmission}
                            onChange={(e) => setAllowLateSubmission(e.target.checked)}
                          />
                        }
                        label="Allow late submissions"
                      />
                      <FormControlLabel
                        control={<Checkbox
                          checked={sendNotification}
                          onChange={(e) => setSendNotification(e.target.checked)}
                        />}
                        label="Send notification to students"
                      />
                      <FormControlLabel
                        control={<Checkbox
                          checked={addToStudentRepost}
                          onChange={(e) => setAddToStudentRepost(e.target.checked)}
                        />}
                        label="Add to student report"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="d-flex align-items-center gap-2 justify-content-end">
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: 20, marginRight: 10 }}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="outlined"

                        color={saveAsDraft ? "primary" : "secondary"} // Change color dynamically
                        style={{
                          marginTop: 20,
                          marginRight: 10,
                          backgroundColor: saveAsDraft ? "#e3f2fd" : "transparent", // Optional custom background
                          borderColor: saveAsDraft ? "#1976d2" : "", // Optional border color change
                        }}
                        onClick={handleSaveAsDraft}
                      >
                        Save as Draft
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        style={{ marginTop: 20 }}
                        onClick={submitAssignment}
                      >
                        Publish
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
