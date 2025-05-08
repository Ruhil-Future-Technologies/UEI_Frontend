/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import '../Teacher/Teacher.scss';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, Typography, Box, Checkbox } from '@mui/material';
import useApi from '../../hooks/useAPI';
import {
  QUERY_KEYS,
  QUERY_KEYS_CLASS,
  QUERY_KEYS_COURSE,
  QUERY_KEYS_ENTITY,
  QUERY_KEYS_ROLE,
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL,
  QUERY_KEYS_TEACHER,
  QUERY_KEYS_UNIVERSITY,
} from '../../utils/const';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
// import { IEntity, MenuListinter } from '../../Components/Table/columns';
// import { dataaccess } from '../../utils/helpers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import {
  inputfield,
  inputfieldtext,
  fieldIcon,
  inputfieldhover,
} from '../../utils/helpers';
import NameContext from '../Context/NameContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { qualifications } from '../TeacherRgistrationForm';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import UploadBtn from '../../Components/UploadBTN/UploadBtn';
import FullScreenLoader from '../Loader/FullScreenLoader';

interface ITeacherForm {
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  qualification: string;
  role_id?: string;
  subjects?: string[];
  entity_id: string;
  class_id?: string;
  university_id?: string;
  experience: number;
  institute_id: string;
  stream?: string;
  address: string;
  country: string;
  state: string;
  city: string;
  district: string;
  pincode: string;
  classes?: IClass[];
  courses?: ICourse[];
  documents?: [];
}

interface ICourse {
  course_id: string;
  semester: string;
  subjects: string[];
}
interface IClass {
  class_id: string;
  stream?: string;
  subjects: string[];
}

const AddEditTeacher = () => {
  const formRef = useRef<FormikProps<ITeacherForm>>(null);
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const { id } = useParams();
  const navigator = useNavigate();
  const { getData, postData, putData, loading } = useApi();
  const GET_UNIVERSITY = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;
  const GET_ENTITIES = QUERY_KEYS_ENTITY.GET_ENTITY;
  const [dataUniversity, setDataUniversity] = useState<any[]>([]);
  const [dataEntity, setDataEntity] = useState<any[]>([]);
  const [dataInstitutes, setDataInstitutes] = useState<any[]>([]);
  const [dataCourses, setDataCourses] = useState<any[]>([]);
  const [dataClasses, setDataClasses] = useState<any[]>([]);
  const [collegeSubjects, setCollegeSubjects] = useState<any[]>([]);
  const [schoolSubjects, setSchoolSubjects] = useState<any[]>([]);
  const [role, setRole] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [, setFilteredSubjects] = useState<any[]>([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState<any[]>([]);
  const [schoolInstitutes, setSchoolInstitutes] = useState<any[]>([]);
  const [collegeInstitutes, setCollegeInstitutes] = useState<any[]>([]);
  const [courseSubjects, setCourseSubjects] = useState<{
    [key: number]: any[];
  }>({});
  const [courseSemesters, setCourseSemesters] = useState<{
    [key: number]: string[];
  }>({});
  const [selectedInstitutionId, setSelectedInstitutionId] =
    useState<string>('');
  const [classSubjects, setClassSubjects] = useState<{
    [key: number]: any[];
  }>({});

  const [classStreams, setClassStreams] = useState<{
    [key: number]: string[];
  }>({});

  const initialState = {
    first_name: '',
    last_name: '',
    gender: '',
    dob: '',
    phone: '',
    email: '',
    qualification: '',
    role_id: '',
    subjects: [],
    entity_id: '',
    class_id: '',
    university_id: '',
    experience: 0,
    institute_id: '',
    address: '',
    country: '',
    state: '',
    city: '',
    district: '',
    pincode: '',
    stream: '',
    courses: [{ course_id: '', semester: '', subjects: [] }],
    classes: [{ class_id: '', stream: '', subjects: [] }],
  };
  const [teacher, setTeacher] = useState<ITeacherForm>(initialState);
  const [state_col, setstate_col] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedstate, setIsFocusedstate] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownstateRef = useRef<HTMLDivElement>(null);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const genderOptions = ['Male', 'Female'];
  const [dob, setDob] = useState<any>(null);
  const navigate = useNavigate();
  const [, setStreams] = useState<string[]>([]);
  const TeacherURL = QUERY_KEYS_TEACHER.GET_TEACHER;
  const TEACHEREDITDOC = QUERY_KEYS_TEACHER.TEACHER_DOC_EDIT;
  const maxSelectableDate = dayjs().subtract(18, 'year');
  const minSelectableDate = dayjs().subtract(100, 'year');
  const charPattern = /^[a-zA-Z\s]*$/;
  const mobilePattern = /^\d{10}$/;
  const emailPattern = /\S+@\S+\.\S+/;
  const pincodePattern = /^\d{6}$/;
  const qualificationPattern = /^[a-zA-Z0-9\s.,()'-]+$/;
  const [error, setError] = React.useState<string | null>(null);
  const [allselectedfiles, setAllSelectedfiles] = useState<File[]>([]);
  const [allfiles, setAllfiles] = useState<[]>([]);

  const isSchoolEntity = (entityId: string | string[]): boolean => {
    const selectedEntity = dataEntity?.find(
      (entity) => entity.id === entityId && entity?.is_active,
    );
    return selectedEntity?.entity_type?.toLowerCase?.() === 'school';
  };
  const isCollegeEntity = (entityId: string | string[]): boolean => {
    const selectedEntity = dataEntity?.find(
      (entity) => entity.id === entityId && entity?.is_active,
    );

    return selectedEntity?.entity_type?.toLowerCase() === 'college';
  };
  const callAPI = async () => {
    let all_courses: any = [];
    let all_classes: any = [];

    await getData(`${QUERY_KEYS_CLASS.GET_CLASS}`)
      .then((data) => {
        all_classes = data?.data.classes_data;
        setDataClasses(data.data?.classes_data);
      })
      .catch((error) => {
        toast.error(error.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
    await getData(`${QUERY_KEYS_COURSE.GET_COURSE}`)
      .then((data) => {
        all_courses = data.data.course_data;
        setDataCourses(
          data?.data?.course_data?.filter((subject: any) => subject.is_active),
        );
      })
      .catch((error) => {
        toast.error(error.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
    await getData(`${QUERY_KEYS_SUBJECT.GET_SUBJECT}`)
      .then((data) => {
        setCollegeSubjects(
          data?.data?.subjects_data?.filter(
            (subject: any) => subject.is_active,
          ),
        );
      })
      .catch((error) => {
        toast.error(error.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
    await getData(`${QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT}`)
      .then((data) => {
        setSchoolSubjects(
          data?.data?.subjects_data?.filter(
            (subject: any) => subject.is_active,
          ),
        );
      })
      .catch((error) => {
        toast.error(error.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
    if (id) {
      const teacherData = await getData(`${TeacherURL}`);

      try {
        if (!teacherData?.data) {
          return;
        }
        const currentTeacher = teacherData?.data.find((teacher: any) => {
          if (teacher.user_uuid == id) {
            return teacher.user_uuid;
          }
        });

        if (!currentTeacher?.user_uuid) {
          return;
        }
        const teacherDetail = await getData(
          `${QUERY_KEYS_TEACHER.GET_TECHER_BY_UUID}/${currentTeacher.user_uuid}`,
        );
        const filterTeacherCourses = (
          teacherDetail: any,
          allCourses: any,
        ): { coures: any[] } => {
          const result = {
            courses: [],
          } as any;
          const teacherCoursesObj =
            teacherDetail?.data?.course_semester_subjects;
          if (teacherCoursesObj) {
            for (const [courseId, semesterData] of Object.entries(
              teacherCoursesObj as any,
            )) {
              const matchingCourse = allCourses.find(
                (course: any) =>
                  course.id === Number(courseId) &&
                  course.institution_id === teacherDetail?.data?.institute_id,
              );

              if (matchingCourse) {
                for (const [semester, subjects] of Object.entries(
                  semesterData as any,
                )) {
                  result.courses.push({
                    course_id: matchingCourse.id,
                    semester:
                      semester.charAt(0).toUpperCase() + semester.slice(1),
                    subjects: subjects,
                  });
                }
              }
            }
          }

          return result;
        };
        const course_semester_subjects_arr: any = filterTeacherCourses(
          teacherDetail,
          all_courses,
        );
        const filterTeacherClasses = (
          teacherDetail: any,
          all_classes: any,
        ): { classes: any[] } => {
          const result = {
            classes: [],
          } as any;
          const teacherClassesObj = teacherDetail.data.class_stream_subjects;
          if (teacherClassesObj) {
            for (const [classId, streamData] of Object.entries(
              teacherClassesObj as any,
            )) {
              const matchingClass = all_classes.find(
                (cls: any) => cls.id === Number(classId),
              );

              if (matchingClass) {
                for (const [stream, subjects] of Object.entries(
                  streamData as any,
                )) {
                  result.classes.push({
                    class_id: matchingClass.id,
                    stream: stream.toLowerCase(),
                    subjects: subjects,
                  });
                }
              }
            }
          }

          return result;
        };
        const class_stream_subjects_arr: any = filterTeacherClasses(
          teacherDetail,
          all_classes,
        );

        const urls = teacherDetail?.data?.documents || [];
        setAllfiles(urls);

        const processedData = await {
          documents: urls,
          first_name: teacherDetail?.data?.first_name || '',
          last_name: teacherDetail?.data?.last_name || '',
          gender:
            teacherDetail?.data?.gender.charAt(0).toUpperCase() +
              teacherDetail?.data?.gender.slice(1) || '',
          dob: teacherDetail?.data?.dob || '',
          phone: teacherDetail?.data?.phone || '',
          email: teacherDetail?.data?.email || '',
          qualification: teacherDetail?.data?.qualification || '',
          role_id: teacherDetail?.data?.role_id || '',

          courses: course_semester_subjects_arr?.courses || [
            { course_id: '', Semester: '', subjects: [] },
          ],
          entity_id: teacherDetail?.data?.entity_id || '',
          classes: class_stream_subjects_arr?.classes || [
            { class_id: '', stream: '', subjects: [] },
          ],
          school_name: teacherDetail?.data?.school_name || '',
          university_id: teacherDetail.data?.university_id || '',
          experience: Number(teacherDetail?.data?.experience) || 0,
          institute_id: teacherDetail?.data?.institute_id || '',
          address: teacherDetail?.data?.address || '',
          country: teacherDetail?.data?.country || '',
          state: teacherDetail?.data?.state || '',
          city: teacherDetail?.data?.city || '',
          district: teacherDetail?.data?.district || '',
          pincode: teacherDetail?.data?.pincode || '',
        };
        setTeacher(processedData);
        if (teacherDetail?.data?.dob) {
          setDob(dayjs(teacherDetail?.data?.dob));
        }
      } catch (e: any) {
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      }
    }
  };

  const fetchData = async () => {
    const promises = [
      getData(`${GET_UNIVERSITY}`)
        .then((data) =>
          setDataUniversity(
            data.data?.universities_data.filter((uni: any) => uni.is_active) ||
              [],
          ),
        )
        .catch(() => setDataUniversity([])),

      getData(`${GET_ENTITIES}`)
        .then((data) =>
          setDataEntity(
            data.data?.entityes_data.filter(
              (entity: any) => entity.is_active,
            ) || [],
          ),
        )
        .catch(() => setDataEntity([])),

      getData(`${QUERY_KEYS.GET_INSTITUTES}`)
        .then((data) => {
          const allInstitutes = data.data || [];
          const schoolInstitutes = allInstitutes.filter(
            (institute: any) =>
              institute.entity_type?.toLowerCase() === 'school' &&
              institute.is_approve &&
              institute.is_active,
          );
          const collegeInstitutes = allInstitutes.filter(
            (institute: any) =>
              institute.entity_type?.toLowerCase() === 'college' &&
              institute.is_approve &&
              institute.is_active,
          );

          setDataInstitutes(allInstitutes);
          setSchoolInstitutes(schoolInstitutes);
          setCollegeInstitutes(collegeInstitutes);
        })
        .catch(() => {
          setDataInstitutes([]);
          setSchoolInstitutes([]);
          setCollegeInstitutes([]);
        }),

      getData(`${QUERY_KEYS_ROLE.GET_ROLE}`)
        .then((data) => setRole(data.data?.rolees_data || []))
        .catch(() => setRole([])),

      getData(`${QUERY_KEYS_CLASS.GET_CLASS}`)
        .then((data) => setDataClasses(data.data?.classes_data || []))
        .catch(() => setDataClasses([])),

      getData(`${QUERY_KEYS_COURSE.GET_COURSE}`)
        .then((data) =>
          setDataCourses(
            data.data?.course_data.filter((course: any) => course.is_active) ||
              [],
          ),
        )
        .catch(() => setDataCourses([])),

      getData(`${QUERY_KEYS_SUBJECT.GET_SUBJECT}`)
        .then((data) =>
          setCollegeSubjects(
            data.data?.subjects_data.filter(
              (subject: any) => subject.is_active,
            ) || [],
          ),
        )
        .catch(() => setCollegeSubjects([])),

      getData(`${QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT}`)
        .then((data) =>
          setSchoolSubjects(
            data.data?.subjects_data.filter(
              (subject: any) => subject.is_active,
            ) || [],
          ),
        )
        .catch(() => setSchoolSubjects([])),
    ];

    await Promise.allSettled(promises);
  };

  useEffect(() => {
    const fetchAndCallAPI = async () => {
      await fetchData();
      callAPI();
    };

    fetchAndCallAPI();
  }, []);

  useEffect(() => {
    if (teacher.entity_id) {
      if (isSchoolEntity(teacher.entity_id)) {
        setFilteredInstitutes(schoolInstitutes);
      } else if (isCollegeEntity(teacher.entity_id)) {
        if (teacher.university_id) {
          const filtered = collegeInstitutes?.filter(
            (institute) => institute.university_id === teacher.university_id,
          );
          setFilteredInstitutes(filtered);
        } else {
          setFilteredInstitutes([]);
        }
      }
    } else {
      setFilteredInstitutes([]);
    }
  }, [teacher.university_id, teacher.entity_id]);

  useEffect(() => {
    const institutionId = selectedInstitutionId || teacher?.institute_id;
    if (institutionId) {
      const filtered = dataCourses?.filter(
        (course) => course.institution_id === institutionId,
      );

      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [teacher?.institute_id]);

  const checkHigherClass = (
    classId: string | undefined,
    dataClasses: any[],
  ): boolean => {
    if (!classId) return false;
    return dataClasses.some(
      (classes) =>
        classes.id === classId &&
        (classes.class_name === 'class_11' ||
          classes.class_name === 'class_12'),
    );
  };
  useEffect(() => {
    if (teacher?.entity_id) {
      if (isSchoolEntity(teacher.entity_id)) {
        if (teacher.class_id) {
          const filtered = schoolSubjects.filter(
            (subject) => subject.class_id === teacher.class_id,
          );
          const higherClass = checkHigherClass(teacher.class_id, dataClasses);
          if (higherClass) {
            if (teacher.stream) {
              const streamFiltered = filtered.filter(
                (subject) => subject.stream === teacher.stream,
              );
              setFilteredSubjects(streamFiltered);
            } else {
              setFilteredSubjects([]);
            }
            setStreams(
              filtered
                .map((subject) => subject.stream)
                .filter(
                  (stream, index, array) => array.indexOf(stream) === index,
                ),
            );
          } else {
            setFilteredSubjects(filtered);
            setStreams([]);
          }
        } else {
          setFilteredSubjects([]);
          setStreams([]);
        }
      }
    }
  }, [teacher.classes]);

  useEffect(() => {
    const initialClasses = teacher.classes;

    formRef.current?.setFieldValue('classes', initialClasses);

    setTeacher((prev) => ({
      ...prev,
      classes: initialClasses,
    }));
    if (!Array.isArray(schoolSubjects)) {
      return;
    }

    initialClasses?.forEach((cls, index) => {
      if (cls.class_id) {
        const allSubjects = schoolSubjects.filter(
          (subject) => subject.class_id === cls.class_id,
        );

        const uniqueStreams = allSubjects
          .map((subject) => subject.stream)
          .filter((stream, index, self) => self.indexOf(stream) === index);

        setClassStreams((prev) => ({
          ...prev,
          [index]: uniqueStreams,
        }));

        if (cls.stream) {
          const filteredSubjects = allSubjects.filter(
            (subject) =>
              (subject.class_id === cls.class_id &&
                subject.stream === cls.stream?.toLowerCase()) ||
              subject.stream == '',
          );

          setClassSubjects((prev) => ({
            ...prev,
            [index]: filteredSubjects,
          }));
        }
      }
    });
  }, [teacher?.classes, schoolSubjects]);

  useEffect(() => {
    const initialCourses = teacher.courses;

    formRef.current?.setFieldValue('courses', initialCourses);

    setTeacher((prev) => ({
      ...prev,
      courses: initialCourses,
    }));

    initialCourses?.forEach((course, index) => {
      if (course.course_id) {
        const allSubjects = collegeSubjects.filter(
          (subject) => subject.course_id === course.course_id,
        );
        const uniqueSemesters = allSubjects
          .map((subject) => subject.semester_number)
          .filter((semester, index, self) => self.indexOf(semester) === index)
          .sort((a, b) => Number(a) - Number(b));

        setCourseSemesters((prev) => ({
          ...prev,
          [index]: uniqueSemesters,
        }));
        if (course.semester) {
          const filteredSubjects = allSubjects.filter(
            (subject) =>
              Number(subject.semester_number) === Number(course.semester),
          );

          setCourseSubjects((prev) => ({
            ...prev,
            [index]: filteredSubjects,
          }));
        }
      }
    });
  }, [teacher?.courses, collegeSubjects]);

  useEffect(() => {
    if (formRef.current?.values?.courses) {
      formRef.current?.values?.courses.forEach((course, index) => {
        if (course.course_id) {
          const allSubjects = collegeSubjects.filter(
            (subject) => subject.course_id === course.course_id,
          );

          const uniqueSemesters = allSubjects
            .map((subject) => subject.semester_number)
            .filter((semester, index, self) => self.indexOf(semester) === index)
            .sort((a, b) => Number(a) - Number(b));

          setCourseSemesters((prev) => ({
            ...prev,
            [index]: uniqueSemesters,
          }));

          if (course.semester) {
            const filteredSubjects = allSubjects.filter(
              (subject) =>
                Number(subject.semester_number) === Number(course.semester),
            );
            setCourseSubjects((prev) => ({
              ...prev,
              [index]: filteredSubjects,
            }));
          }
        }
      });
    }
  }, [teacher?.courses, collegeSubjects]);

  const isDuplicateCourseAndSemester = (courses: any[]): boolean => {
    const combinations = new Set();
    for (const course of courses) {
      if (course.course_id && course.semester) {
        const combination = `${course.course_id}-${course.semester}`;
        if (combinations.has(combination)) {
          return true;
        }
        combinations.add(combination);
      }
    }
    return false;
  };

  const teacherSchema = Yup.object().shape({
    first_name: Yup.string()
      .required('Please enter First name')
      .matches(charPattern, 'Please enter valid name, only characters allowed'),
    last_name: Yup.string()
      .required('Please enter last Name')
      .matches(charPattern, 'Please enter valid name, only characters allowed'),
    gender: Yup.string().required('Please select Gender'),
    email: Yup.string()
      .required('Please enter Email Id')
      .matches(emailPattern, 'Please enter a valid Email format'),
    dob: Yup.date().required('Please enter Date of Birth'),
    phone: Yup.string()
      .required('Please enter Mobile number')
      .matches(mobilePattern, 'Please enter a valid 10-digit mobile number'),
    stream: Yup.string().when('class_id', {
      is: (class_id: string) => ['class_11', 'class_12'].includes(class_id),
      then: () => Yup.string().required('Stream is required'),
      otherwise: () => Yup.string(),
    }),

    qualification: Yup.string()
      .required('Please enter Qualification')
      .matches(
        qualificationPattern,
        'Please enter valid qualification (letters, numbers, and basic punctuation allowed)',
      ),

    courses: Yup.mixed().when('entity_id', {
      is: (entityId: string) => isCollegeEntity(entityId),
      then: () =>
        Yup.array()
          .of(
            Yup.object().shape({
              course_id: Yup.string().required('Please select Course'),
              semester: Yup.string().required('Please select Semester'),
              subjects: Yup.array()
                .of(Yup.string())
                .min(1, 'Please select at least one subject')
                .required('Please select at least one subject'),
            }),
          )
          .min(1, 'At least one course is required')
          .test(
            'no-duplicate-course-semester',
            'Course and semester combination must be unique',
            function (courses) {
              return courses ? !isDuplicateCourseAndSemester(courses) : true;
            },
          ),
      otherwise: () =>
        Yup.array().of(
          Yup.object().shape({
            course_id: Yup.string(),
            semester: Yup.string(),
            subjects: Yup.array().of(Yup.string()),
          }),
        ),
    }),
    classes: Yup.mixed().when('entity_id', {
      is: (entityId: string) => isSchoolEntity(entityId),
      then: () =>
        Yup.array()
          .of(
            Yup.object().shape({
              class_id: Yup.string().required('Please select Class'),
              stream: Yup.string().when('class_id', {
                is: (class_id: string) =>
                  checkHigherClass(class_id, dataClasses),
                then: () => Yup.string().required('Please select Stream'),
                otherwise: () => Yup.string(),
              }),
              subjects: Yup.array()
                .of(Yup.string())
                .min(1, 'Please select at least one subject')
                .required('Please select at least one subject'),
            }),
          )
          .min(1, 'At least one class is required'),
      otherwise: () =>
        Yup.array().of(
          Yup.object().shape({
            class_id: Yup.string(),
            stream: Yup.string(),
            subjects: Yup.array().of(Yup.string()),
          }),
        ),
    }),
    experience: Yup.number()
      .required('Please enter Experience in years')
      .min(0, 'Experience cannot be negative') // Minimum of 0 years
      .max(40, 'Experience cannot exceed 40 years') // Maximum of 40 years
      .integer('Experience must be a whole number') // Ensure it's an integer
      .typeError('Please enter a valid number for experience'),
    entity_id: Yup.string().required('Please select Entity'),
    university_id: Yup.string().when('entity_id', {
      is: (entity_id: string) => {
        const selectedEntity = dataEntity.find(
          (entity) => entity.id === Number(entity_id),
        );

        return selectedEntity?.entity_type !== 'school';
      },
      then: (schema) => schema.required('Please select University'),
      otherwise: (schema) => schema.notRequired(),
    }),
    institute_id: Yup.string().when('entity_id', {
      is: (val: string) => isCollegeEntity(val),
      then: () =>
        Yup.string()
          .required('Please select Institute')
          .test('hasUniversity', 'Please select University first', function () {
            return !!this.parent.university_id;
          }),
      otherwise: () => Yup.string().required('Please select Institute'),
    }),
    address: Yup.string().required('Please enter Address'),
    country: Yup.string().required('Please select Country'),
    state: Yup.string().required('Please select State'),
    city: Yup.string()
      .required('Please enter City name')
      .matches(charPattern, 'Please enter valid city name'),
    district: Yup.string()
      .required('Please enter District name')
      .matches(charPattern, 'Please enter valid district name'),
    pincode: Yup.string()
      .required('Please enter Pincode')
      .matches(pincodePattern, 'Please enter a valid 6-digit pincode'),
  });

  const handleSubmit = async (
    teacherData: ITeacherForm,
    { resetForm }: FormikHelpers<ITeacherForm>,
  ) => {
    const formData = new FormData();
    const transformCollegeData = (originalData: any) => {
      const transformedData = { ...originalData };

      delete transformedData.courses;
      delete transformedData.classes;

      const course_semester_subjects = {} as any;

      originalData.courses.forEach((course: any) => {
        const courseDetail = dataCourses.find(
          (dataCourse) => dataCourse.id === course.course_id,
        );

        const semesterorCourseName =
          course.semester === '' && courseDetail ? '' : course.semester;

        if (!course_semester_subjects[course.course_id]) {
          course_semester_subjects[course.course_id] = {};
        }

        course_semester_subjects[course.course_id][semesterorCourseName] =
          course.subjects;
      });

      return {
        ...transformedData,
        course_semester_subjects: JSON.stringify(course_semester_subjects),
      };
    };

    const transformSchoolData = (originalData: any) => {
      const transformedData = { ...originalData };

      delete transformedData.classes;
      const class_stream_subjects = {} as any;
      originalData.classes.forEach((cls: any) => {
        const classDetails = dataClasses.find(
          (dataClass) => dataClass.id === cls.class_id,
        );
        const streamOrClassName =
          cls.stream === '' && classDetails ? 'general' : cls.stream;

        if (!class_stream_subjects[cls.class_id]) {
          class_stream_subjects[cls.class_id] = {};
        }
        class_stream_subjects[cls.class_id][streamOrClassName] = cls.subjects;
      });
      return {
        ...transformedData,
        class_stream_subjects: JSON.stringify(class_stream_subjects),
      };
    };
    const teacherRole = role.find(
      (r) => r.role_name.toLowerCase() === 'teacher',
    );
    Object.keys(teacherData).forEach((key) => {
      const typedKey = key as keyof ITeacherForm;
      if (typedKey.startsWith('courses.')) {
        delete teacherData[typedKey];
      }
    });
    Object.keys(teacherData).forEach((key) => {
      const typedKey = key as keyof ITeacherForm;
      if (typedKey.startsWith('classes.')) {
        delete teacherData[typedKey];
      }
    });
    if (teacherData.class_id == '' || teacherData.class_id == 'None') {
      delete teacherData.class_id;
      delete teacherData.stream;
      delete teacherData.subjects;
      // delete teacherData.classes;
    }
    if (
      !teacherData.university_id ||
      teacherData.university_id == '' ||
      teacherData.university_id == 'None'
    ) {
      delete teacherData.courses;
      delete teacherData.university_id;
    }
    const checkCollege = isCollegeEntity(teacherData.entity_id);
    const transformedData = checkCollege
      ? transformCollegeData(teacherData)
      : transformSchoolData(teacherData);

    const formattedData = {
      ...transformedData,
      role_id: teacherRole?.id,
    } as any;
    if (error !== null) {
      return;
    }

    if (id) {
      const fileData = new FormData();

      fileData.append('existing_docs', JSON.stringify(allfiles));

      allselectedfiles.forEach((file) => {
        fileData.append('documents', file);
      });
      Object.keys(formattedData).forEach((key) => {
        formData.append(key, formattedData[key]);
      });

      fileData.append('delete_existing_documents', 'true');

      const current_docs = teacher.documents || [];

      const allExist = current_docs.every((file) => allfiles.includes(file));

      if (
        allselectedfiles.length === 0 &&
        current_docs.length === allfiles.length &&
        allExist
      ) {
        putData(`${QUERY_KEYS_TEACHER.TEACHER_EDIT}/${id}`, formData)
          .then((data: any) => {
            if (data.status) {
              navigator('/main/Teacher');
              toast.success(data.message, {
                hideProgressBar: true,
                theme: 'colored',
              });
              setAllSelectedfiles([]);
            } else {
              toast.error(data?.message, {
                hideProgressBar: true,
                theme: 'colored',
              });
              setAllSelectedfiles([]);
            }
          })
          .catch((e: any) => {
            if (e?.response?.code === 401) {
              navigator('/');
            }
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          });
      } else {
        putData(`${TEACHEREDITDOC}${id}`, fileData).then((response) => {
          if (response?.code === 201) {
            putData(`${QUERY_KEYS_TEACHER.TEACHER_EDIT}/${id}`, formData)
              .then((data: any) => {
                if (data.status) {
                  navigator('/main/Teacher');
                  toast.success(data.message, {
                    hideProgressBar: true,
                    theme: 'colored',
                  });
                  setAllSelectedfiles([]);
                } else {
                  toast.error(data?.message, {
                    hideProgressBar: true,
                    theme: 'colored',
                  });
                  setAllSelectedfiles([]);
                }
              })
              .catch((e: any) => {
                if (e?.response?.code === 401) {
                  navigator('/');
                }
                toast.error(e?.message, {
                  hideProgressBar: true,
                  theme: 'colored',
                });
              });
          } else {
            toast.error(response?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        });
      }
    } else {
      allselectedfiles.forEach((file) => {
        formData.append('documents', file);
      });
      Object.keys(formattedData).forEach((key) => {
        formData.append(key, formattedData[key]);
        formData.append('is_verified', 'True');
      });

      postData(`${QUERY_KEYS_TEACHER.TEACHER_ADD}`, formData)
        .then((data: any) => {
          if (data.status) {
            toast.success(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
            setAllSelectedfiles([]);
            resetForm({ values: initialState });
            setDob(null);
            setTeacher(initialState);
          } else {
            toast.error(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        })
        .catch((e: any) => {
          // navigator('/');
          toast.error(e?.response?.data.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    }
  };

  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleFocusstate = () => setIsFocusedstate(true);

    const handleBlur = (e: FocusEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsFocused(false);
      }
    };
    const handleBlurstate = (e: FocusEvent) => {
      if (
        dropdownstateRef.current &&
        !dropdownstateRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsFocusedstate(false);
      }
    };

    const currentDropdown = dropdownRef.current;
    const currentDropdownstate = dropdownstateRef.current;

    if (currentDropdown) {
      currentDropdown.addEventListener('focus', handleFocus as EventListener);
      currentDropdown.addEventListener('blur', handleBlur as EventListener);
    }

    if (currentDropdownstate) {
      currentDropdownstate.addEventListener(
        'focus',
        handleFocusstate as EventListener,
      );
      currentDropdownstate.addEventListener(
        'blur',
        handleBlurstate as EventListener,
      );
    }

    return () => {
      if (currentDropdown) {
        currentDropdown.removeEventListener(
          'focus',
          handleFocus as EventListener,
        );
        currentDropdown.removeEventListener(
          'blur',
          handleBlur as EventListener,
        );
      }
      if (currentDropdownstate) {
        currentDropdownstate.removeEventListener(
          'focus',
          handleFocusstate as EventListener,
        );
        currentDropdownstate.removeEventListener(
          'blur',
          handleBlurstate as EventListener,
        );
      }
    };
  }, []);

  const handleDateChange = (newValue: any) => {
    setDob(newValue);
    if (!newValue) {
      setTeacher((prevTeacher) => ({
        ...prevTeacher,
        dob: '',
      }));
      formRef?.current?.setFieldValue('dob', '');
      return;
    }

    const formattedDate = dayjs(newValue).format('YYYY-MM-DD');
    const today = dayjs();
    const minAgeDate = today.subtract(18, 'year');

    if (!formattedDate || formattedDate === 'Invalid Date') {
      // toast.error('Teacher must be 18 years old');
      setError(null);
      setDob('');
      return;
    }
    if (dayjs(newValue).isAfter(minAgeDate)) {
      const currentDate = dayjs();
      if (newValue?.isAfter(currentDate, 'day')) {
        setError('Future dates are not allowed.');
      } else {
        setError('Teacher at least 18 years old.');
      }
    } else {
      setError(null);
    }
    setTeacher((prevTeacher) => ({
      ...prevTeacher,
      dob: formattedDate,
    }));
    formRef?.current?.setFieldValue('dob', formattedDate);
  };

  const handleInputChangecountry = async (
    value: string,
    addressType: string,
    name: string,
  ) => {
    if (addressType === 'current_address') {
      if (name === 'country') {
        setTeacher((prevTeacher) => ({
          ...prevTeacher,
          country: value,
          state: '',
          city: '',
          district: '',
          pincode: '',
        }));
        setstate_col(true);
      } else if (name === 'state') {
        setTeacher((prevTeacher) => ({
          ...prevTeacher,
          state: value,
          city: '',
          district: '',
          pincode: '',
        }));
        setstate_col(false);
      }
    }
  };
  const handleChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | SelectChangeEvent<string | string[]>,
    fieldName: string,
  ) => {
    const value = e.target.value;

    if (fieldName === 'institute_id') {
      setSelectedInstitutionId(value as string);
    }
    if (fieldName.startsWith('courses.')) {
      const [, index, field] = fieldName.split('.');
      const currentIndex = parseInt(index);

      if (field === 'course_id' || field === 'semester') {
        if (formRef?.current?.values?.courses) {
          const updatedCourses = formRef?.current?.values?.courses.map(
            (course: any, i: number) => {
              if (i === currentIndex) {
                return { ...course, [field]: value };
              }
              return course;
            },
          );

          if (updatedCourses) {
            const isDuplicate = updatedCourses.some(
              (course1: any, index1: number) => {
                return updatedCourses.some((course2: any, index2: number) => {
                  return (
                    index1 !== index2 &&
                    course1.course_id &&
                    course2.course_id &&
                    course1.semester &&
                    course2.semester &&
                    course1.course_id === course2.course_id &&
                    course1.semester === course2.semester
                  );
                });
              },
            );

            if (isDuplicate) {
              toast.error(
                'This course and semester combination already exists',
                {
                  hideProgressBar: true,
                  theme: 'colored',
                },
              );
              return;
            }
          }
        }
      }

      setTeacher((prevTeacher: any) => ({
        ...prevTeacher,
        courses: prevTeacher.courses.map((course: any, i: number) => {
          if (i === currentIndex) {
            const updatedCourse = { ...course, [field]: value };

            if (field === 'course_id') {
              updatedCourse.semester = '';
              updatedCourse.subjects = [];

              const courseSubjects = collegeSubjects.filter(
                (subject) => subject.course_id === value,
              );

              const uniqueSemesters = courseSubjects
                .map((subject) => subject.semester_number)
                .filter(
                  (semester, index, array) => array.indexOf(semester) === index,
                )
                .sort((a, b) => Number(a) - Number(b));

              setCourseSemesters((prev) => ({
                ...prev,
                [currentIndex]: uniqueSemesters,
              }));

              setCourseSubjects((prev) => ({
                ...prev,
                [currentIndex]: [],
              }));
            }

            if (field === 'semester') {
              updatedCourse.subjects = [];

              const courseSubjects = collegeSubjects.filter(
                (subject) =>
                  subject.course_id === course.course_id &&
                  subject.semester_number === value,
              );

              setCourseSubjects((prev) => ({
                ...prev,
                [currentIndex]: courseSubjects,
              }));
            }

            return updatedCourse;
          }
          return course;
        }),
      }));
    }

    if (fieldName.startsWith('classes.')) {
      const [, index, field] = fieldName.split('.');
      const currentIndex = parseInt(index);

      if (field === 'class_id' || field === 'stream') {
        if (formRef?.current?.values?.classes) {
          const updatedClasses = formRef?.current?.values?.classes.map(
            (cls: any, i: number) => {
              if (i === currentIndex) {
                return { ...cls, [field]: value };
              }
              return cls;
            },
          );

          if (updatedClasses) {
            const isDuplicate = updatedClasses.some(
              (class1: any, index1: number) => {
                return updatedClasses.some((class2: any, index2: number) => {
                  const isHigher = checkHigherClass(
                    class1.class_id,
                    dataClasses,
                  );

                  return isHigher
                    ? index1 !== index2 &&
                        class1.class_id &&
                        class2.class_id &&
                        class1.stream &&
                        class2.stream &&
                        class1.class_id === class2.class_id &&
                        class1.stream === class2.stream
                    : index1 !== index2 && class1.class_id === class2.class_id;
                });
              },
            );

            if (isDuplicate) {
              toast.error('This class or stream combination already exists', {
                hideProgressBar: true,
                theme: 'colored',
              });
              return;
            }
          }
        }
      }

      setTeacher((prevTeacher: any) => ({
        ...prevTeacher,
        classes: prevTeacher.classes.map((cls: any, i: number) => {
          if (i === currentIndex) {
            const updatedClass = { ...cls, [field]: value };

            if (field === 'class_id') {
              updatedClass.stream = '';
              updatedClass.subjects = [];

              const isHigherClass = checkHigherClass(
                String(value),
                dataClasses,
              );
              if (isHigherClass) {
                const classSubjects = schoolSubjects.filter(
                  (subject) => subject.class_id === value,
                );

                const uniqueStreams = classSubjects
                  .map((subject) => subject.stream)
                  .filter((stream, idx, self) => self.indexOf(stream) === idx);

                setClassStreams((prev) => ({
                  ...prev,
                  [currentIndex]: uniqueStreams,
                }));
              } else {
                const filteredSubjects = schoolSubjects.filter(
                  (subject) => subject.class_id === value,
                );
                setClassSubjects((prev) => ({
                  ...prev,
                  [currentIndex]: filteredSubjects,
                }));
              }
            }

            if (field === 'stream') {
              updatedClass.subjects = [];
              const filteredSubjects = schoolSubjects.filter(
                (subject) =>
                  subject.class_id === cls.class_id && subject.stream === value,
              );
              setClassSubjects((prev) => ({
                ...prev,
                [currentIndex]: filteredSubjects,
              }));
            }
            return updatedClass;
          }

          return cls;
        }),
      }));
    }

    setTeacher((prevTeacher: any) => {
      if (!prevTeacher) return prevTeacher;
      const newState = {
        ...prevTeacher,
        [fieldName]: value,
      };
      if (fieldName === 'class_id') {
        formRef?.current?.setFieldValue('subjects', []);
        newState.stream = '';
        setStreams([]);
      }
      if (fieldName === 'entity_id' && typeof value === 'string') {
        if (isSchoolEntity(value)) {
          newState.university_id = '';
          newState.institute_id = '';
        }
        if (isCollegeEntity(value)) {
          newState.class_id = '';
        }
      }
      if (fieldName === 'university_id') {
        newState.institute_id = '';
        const filtered = dataInstitutes?.filter(
          (institute) => institute.university_id === value,
        );
        setFilteredInstitutes(filtered);
      }

      return newState;
    });

    formRef?.current?.setFieldValue(fieldName, value);

    if (fieldName === 'entity_id' && typeof value === 'string') {
      if (isSchoolEntity(value)) {
        formRef?.current?.setFieldValue('university_id', '');
        formRef?.current?.setFieldValue('institute_id', '');
        setFilteredInstitutes([]);
      }
    }

    if (fieldName === 'university_id') {
      formRef?.current?.setFieldValue('institute_id', '');
    }

    if (fieldName === 'class_id') {
      formRef?.current?.setFieldValue('subjects', []);
    }

    await formRef?.current?.validateField(fieldName);
    if (
      formRef?.current?.errors?.[fieldName as keyof ITeacherForm] !== undefined
    ) {
      const errorMessage =
        formRef?.current?.errors?.[fieldName as keyof ITeacherForm];
      formRef?.current?.setFieldError(
        fieldName,
        typeof errorMessage === 'string' ? errorMessage : String(errorMessage),
      );
      formRef?.current?.setFieldTouched(fieldName, true);
    }
  };

  const handleCountryClick = () => {
    setIsCountryOpen(true);
  };

  const handleCountryBlur = () => {
    setIsCountryOpen(false);
  };

  const handleStateClick = () => {
    setIsStateOpen(true);
  };

  const handleStateBlur = () => {
    setIsStateOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) return;

    const filesArray = Array.from(files);

    const duplicateFiles = filesArray.filter((file) =>
      allselectedfiles.some(
        (existingFile) =>
          existingFile.name === file.name &&
          existingFile.lastModified === file.lastModified,
      ),
    );

    if (duplicateFiles.length > 0) {
      event.target.value = '';
      return;
    }

    setAllSelectedfiles((prevFiles) => [...prevFiles, ...filesArray]);

    event.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setAllSelectedfiles((previous) =>
      previous.filter((_, ind) => ind !== index),
    );
  };

  const handleDeleteFile = (index: any) => {
    setAllfiles((previous: any) =>
      previous.filter((_: any, ind: any) => ind !== index),
    );
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="main-wrapper">
        <div className="main-content">
          <div className="card p-lg-3">
            <div className="card-body">
              <Typography variant="h6">
                <div className="main_title">{id ? 'Edit' : 'Add'} Teacher</div>
              </Typography>
              <Formik
                onSubmit={async (
                  formData,
                  formikHelpers: FormikHelpers<any>,
                ) => {
                  try {
                    await handleSubmit(formData, formikHelpers);
                  } catch (error) {
                    console.error('Form submission error:', error);
                    toast.error('Failed to submit form. Please try again.');
                  }
                }}
                initialValues={teacher}
                enableReinitialize
                validationSchema={teacherSchema}
                innerRef={formRef}
              >
                {({ errors, values, touched }) => (
                  <Form>
                    {/* <SubjectsHandler values={values} /> */}
                    <div className="row gy-4 mt-0">
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <Field
                            fullWidth
                            component={TextField}
                            label="First Name *"
                            name="first_name"
                            value={values?.first_name}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange(e, 'first_name')}
                          />
                          {touched?.first_name && errors?.first_name && (
                            <p className="error">
                              {String(errors?.first_name)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <Field
                            fullWidth
                            component={TextField}
                            label="Last Name *"
                            name="last_name"
                            value={values?.last_name}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange(e, 'last_name')}
                          />
                          {touched?.last_name && errors?.last_name && (
                            <p className="error">{String(errors.last_name)}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <FormControl fullWidth>
                            <InputLabel>Gender *</InputLabel>
                            <Select
                              name="gender"
                              value={values?.gender || ''}
                              label="Gender *"
                              onChange={(e: SelectChangeEvent<string>) =>
                                handleChange(e, 'gender')
                              }
                            >
                              {genderOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {touched?.gender && errors?.gender && (
                            <p className="error">{String(errors.gender)}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box>
                              <DatePicker
                                aria-label="datepicker_label"
                                value={dob}
                                onChange={handleDateChange}
                                format="DD/MM/YYYY"
                                label="DOB *"
                                disableFuture
                                maxDate={maxSelectableDate}
                                minDate={minSelectableDate}
                                sx={{
                                  backgroundColor: '#f5f5f5',
                                }}
                                slotProps={{
                                  textField: {
                                    variant: 'outlined',

                                    inputProps: {
                                      maxLength: 10,
                                      'aria-label': 'datepicker_label',
                                    },
                                  },
                                }}
                              />
                            </Box>
                          </LocalizationProvider>
                          {touched?.dob && errors?.dob && (
                            <p className="error">{String(errors.dob)}</p>
                          )}
                          {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <Field
                            fullWidth
                            component={TextField}
                            label="Email Id*"
                            name="email"
                            type="email"
                            value={values?.email}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange(e, 'email')}
                          />
                          {touched?.email && errors?.email && (
                            <p className="error">{String(errors.email)}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <Field
                            fullWidth
                            component={TextField}
                            label="Mobile Number*"
                            name="phone"
                            inputProps={{ maxLength: 10 }}
                            value={values?.phone}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange(e, 'phone')}
                          />
                          {touched?.phone && errors?.phone && (
                            <p className="error">{String(errors.phone)}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <FormControl fullWidth>
                            <InputLabel>Qualification *</InputLabel>
                            <Select
                              name="qualification"
                              value={values?.qualification}
                              label="Qualification *"
                              onChange={(e: SelectChangeEvent<string>) =>
                                handleChange(e, 'qualification')
                              }
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
                              {qualifications.map((qual) => (
                                <MenuItem
                                  key={qual}
                                  value={qual}
                                  sx={{
                                    backgroundColor: inputfield(namecolor),
                                    color: inputfieldtext(namecolor),
                                    '&:hover': {
                                      backgroundColor:
                                        inputfieldhover(namecolor),
                                    },
                                  }}
                                >
                                  {qual}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {touched?.qualification && errors?.qualification && (
                            <p className="error">
                              {String(errors.qualification)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <Field
                            fullWidth
                            component={TextField}
                            label="Experience (years) *"
                            name="experience"
                            type="number"
                            value={values?.experience}
                            onInput={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              let value = e?.target?.value?.replace(
                                /[^0-9]/g,
                                '',
                              ); // Remove non-numeric characters
                              if (value?.length > 2) {
                                value = value?.substring(0, 2); // Allow only the first two digits
                              }
                              e.target.value = value;
                              handleChange(e, 'experience');
                            }}
                          />
                          {touched?.experience && errors?.experience && (
                            <p className="error">
                              {String(errors?.experience)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Entity *
                            </InputLabel>
                            <Select
                              onChange={(e: SelectChangeEvent<string>) => {
                                handleChange(e, 'entity_id');
                              }}
                              label="Entity"
                              name="entity_id"
                              value={values?.entity_id}
                              variant="outlined"
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
                              {dataEntity?.map((item, idx) => (
                                <MenuItem
                                  value={item.id}
                                  key={`${item.entity_type}-${idx + 1}`}
                                  sx={{
                                    backgroundColor: inputfield(namecolor),
                                    color: inputfieldtext(namecolor),
                                    '&:hover': {
                                      backgroundColor:
                                        inputfieldhover(namecolor),
                                    },
                                  }}
                                >
                                  {item.entity_type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {touched?.entity_id && errors?.entity_id ? (
                            <p style={{ color: 'red' }}>
                              {String(errors?.entity_id)}
                            </p>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>

                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <FormControl fullWidth>
                            <InputLabel>University *</InputLabel>
                            <Select
                              name="university_id"
                              value={values?.university_id}
                              label="University *"
                              onChange={(e: SelectChangeEvent<string>) =>
                                handleChange(e, 'university_id')
                              }
                              style={{
                                backgroundColor: isSchoolEntity(
                                  values?.entity_id,
                                )
                                  ? '#f0f0f0'
                                  : inputfield(namecolor),
                                color: isSchoolEntity(values?.entity_id)
                                  ? '#999999'
                                  : inputfieldtext(namecolor),
                                border: isSchoolEntity(values?.entity_id)
                                  ? '1px solid #d0d0d0'
                                  : undefined,
                              }}
                              disabled={isSchoolEntity(values?.entity_id)}
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
                              {dataUniversity?.map((university: any) => (
                                <MenuItem
                                  key={university.id}
                                  value={university.id}
                                  sx={{
                                    backgroundColor: inputfield(namecolor),
                                    color: inputfieldtext(namecolor),
                                    '&:hover': {
                                      backgroundColor:
                                        inputfieldhover(namecolor),
                                    },
                                  }}
                                >
                                  {university.university_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {touched?.university_id && errors?.university_id && (
                            <p className="error">
                              {String(errors.university_id)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <FormControl fullWidth>
                            <InputLabel>
                              {isSchoolEntity(values?.entity_id)
                                ? 'School Name *'
                                : isCollegeEntity(values?.entity_id)
                                  ? 'College Name *'
                                  : 'Institute *'}
                            </InputLabel>
                            <Select
                              name="institute_id"
                              value={values?.institute_id || ''}
                              label={
                                isSchoolEntity(values?.entity_id)
                                  ? 'School Name *'
                                  : isCollegeEntity(values?.entity_id)
                                    ? 'College Name *'
                                    : 'Institute *'
                              }
                              onChange={(e: SelectChangeEvent<string>) =>
                                handleChange(e, 'institute_id')
                              }
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
                              {filteredInstitutes?.map((institute: any) => (
                                <MenuItem
                                  key={institute.id}
                                  value={institute.id}
                                  sx={{
                                    backgroundColor: inputfield(namecolor),
                                    color: inputfieldtext(namecolor),
                                    '&:hover': {
                                      backgroundColor:
                                        inputfieldhover(namecolor),
                                    },
                                  }}
                                >
                                  {institute?.institute_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {touched?.institute_id && errors?.institute_id && (
                            <p className="error">
                              {String(errors?.institute_id)}
                            </p>
                          )}
                        </div>
                      </div>

                      {isCollegeEntity(values?.entity_id) &&
                        values?.courses?.length > 0 && (
                          <>
                            {values.courses.map((course: any, index: any) => (
                              <div className="row gy-4 mt-2" key={index}>
                                <div className="col-md-2">
                                  <div className="form_field_wrapper">
                                    <FormControl fullWidth>
                                      <InputLabel>Course *</InputLabel>
                                      <Select
                                        name={`courses.${index}.course_id`}
                                        value={course.course_id}
                                        label="Course *"
                                        onChange={(
                                          e: SelectChangeEvent<string>,
                                        ) =>
                                          handleChange(
                                            e,
                                            `courses.${index}.course_id`,
                                          )
                                        }
                                        disabled={!values?.institute_id}
                                        sx={{
                                          backgroundColor:
                                            inputfield(namecolor),
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
                                        {filteredCourses?.map((course: any) => (
                                          <MenuItem
                                            key={course.id}
                                            value={course.id}
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
                                            {course.course_name}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </div>
                                </div>

                                <div className="col-md-2">
                                  <div className="form_field_wrapper">
                                    <FormControl fullWidth>
                                      <InputLabel>Semester *</InputLabel>
                                      <Select
                                        name={`courses.${index}.semester`}
                                        value={course.semester}
                                        label="Semester *"
                                        onChange={(
                                          e: SelectChangeEvent<string>,
                                        ) =>
                                          handleChange(
                                            e,
                                            `courses.${index}.semester`,
                                          )
                                        }
                                        disabled={!course.course_id}
                                        sx={{
                                          backgroundColor:
                                            inputfield(namecolor),
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
                                        {courseSemesters[index]?.map(
                                          (semesterOption: string) => (
                                            <MenuItem
                                              key={semesterOption}
                                              value={semesterOption}
                                              sx={{
                                                backgroundColor:
                                                  inputfield(namecolor),
                                                color:
                                                  inputfieldtext(namecolor),
                                                '&:hover': {
                                                  backgroundColor:
                                                    inputfieldhover(namecolor),
                                                },
                                              }}
                                            >
                                              {semesterOption}
                                            </MenuItem>
                                          ),
                                        )}
                                      </Select>
                                    </FormControl>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form_field_wrapper">
                                    <FormControl fullWidth>
                                      <InputLabel>Subjects *</InputLabel>
                                      <Select
                                        multiple
                                        name={`courses.${index}.subjects`}
                                        value={course.subjects}
                                        label="Subjects *"
                                        onChange={(
                                          e: SelectChangeEvent<string[]>,
                                        ) =>
                                          handleChange(
                                            e,
                                            `courses.${index}.subjects`,
                                          )
                                        }
                                        disabled={!course.semester}
                                        sx={{
                                          backgroundColor:
                                            inputfield(namecolor),
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
                                        {courseSubjects[index]?.map(
                                          (subject: any) => (
                                            <MenuItem
                                              key={subject.subject_id}
                                              value={subject.subject_name}
                                              sx={{
                                                backgroundColor:
                                                  inputfield(namecolor),
                                                color:
                                                  inputfieldtext(namecolor),
                                                '&:hover': {
                                                  backgroundColor:
                                                    inputfieldhover(namecolor),
                                                },
                                              }}
                                            >
                                              <Checkbox
                                                checked={course.subjects.includes(
                                                  subject.subject_name,
                                                )}
                                                sx={{
                                                  color: fieldIcon(namecolor),
                                                  '&.Mui-checked': {
                                                    color: fieldIcon(namecolor),
                                                  },
                                                }}
                                              />
                                              {subject.subject_name}
                                            </MenuItem>
                                          ),
                                        )}
                                      </Select>
                                    </FormControl>
                                  </div>
                                </div>
                                {values.courses.length > 1 && (
                                  <IconButton
                                    onClick={() => {
                                      setTeacher((prevTeacher) => ({
                                        ...prevTeacher,
                                        courses: prevTeacher?.courses?.filter(
                                          (_, i) => i !== index,
                                        ),
                                      }));

                                      const updatedCourses =
                                        values.courses.filter(
                                          (i: any) => i !== index,
                                        );
                                      formRef.current?.setFieldValue(
                                        'courses',
                                        updatedCourses,
                                      );
                                    }}
                                    sx={{
                                      width: '35px',
                                      height: '35px',
                                      marginTop: '25px',
                                      color: fieldIcon(namecolor),
                                    }}
                                  >
                                    <DeleteOutlineIcon />
                                  </IconButton>
                                )}
                                {index === values.courses.length - 1 && (
                                  <div className="col-md-1">
                                    <IconButton
                                      onClick={() => {
                                        const newCourse = {
                                          course_id: '',
                                          semester: '',
                                          subjects: [],
                                        };

                                        setTeacher((prevTeacher) => ({
                                          ...prevTeacher,
                                          courses: [
                                            ...(prevTeacher.courses || []),
                                            newCourse,
                                          ],
                                        }));
                                      }}
                                      sx={{
                                        width: '35px',
                                        height: '35px',
                                        color: fieldIcon(namecolor),
                                      }}
                                    >
                                      <AddCircleOutlinedIcon />
                                    </IconButton>
                                  </div>
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      {isSchoolEntity(values?.entity_id) &&
                        values?.classes?.length > 0 && (
                          <>
                            {values.classes.map((cls: any, index: any) => (
                              <div className="row gy-4 mt-2" key={index}>
                                <div className="col-md-2">
                                  <div className="form_field_wrapper">
                                    <FormControl fullWidth>
                                      <InputLabel>Class *</InputLabel>
                                      <Select
                                        name={`classes.${index}.class_id`}
                                        value={cls.class_id}
                                        label="Class *"
                                        onChange={(
                                          e: SelectChangeEvent<string>,
                                        ) =>
                                          handleChange(
                                            e,
                                            `classes.${index}.class_id`,
                                          )
                                        }
                                        disabled={!values?.institute_id}
                                        sx={{
                                          backgroundColor:
                                            inputfield(namecolor),
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
                                        {dataClasses?.map((cls: any) => (
                                          <MenuItem
                                            key={cls.id}
                                            value={cls.id}
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
                                            {cls.class_name}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </div>
                                </div>
                                {checkHigherClass(
                                  cls.class_id,
                                  dataClasses,
                                ) && (
                                  <div className="col-md-2">
                                    <div className="form_field_wrapper">
                                      <FormControl fullWidth>
                                        <InputLabel>Stream *</InputLabel>
                                        <Select
                                          name={`classes.${index}.stream`}
                                          value={cls.stream}
                                          label="Stream *"
                                          onChange={(
                                            e: SelectChangeEvent<string>,
                                          ) =>
                                            handleChange(
                                              e,
                                              `classes.${index}.stream`,
                                            )
                                          }
                                          disabled={!cls.class_id}
                                          sx={{
                                            backgroundColor:
                                              inputfield(namecolor),
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
                                                color:
                                                  inputfieldtext(namecolor),
                                              },
                                            },
                                          }}
                                        >
                                          {classStreams[index]?.map(
                                            (streamOption: string) => (
                                              <MenuItem
                                                key={streamOption}
                                                value={streamOption}
                                                sx={{
                                                  backgroundColor:
                                                    inputfield(namecolor),
                                                  color:
                                                    inputfieldtext(namecolor),
                                                  '&:hover': {
                                                    backgroundColor:
                                                      inputfieldhover(
                                                        namecolor,
                                                      ),
                                                  },
                                                }}
                                              >
                                                {streamOption}
                                              </MenuItem>
                                            ),
                                          )}
                                        </Select>
                                      </FormControl>
                                    </div>
                                  </div>
                                )}

                                <div className="col-md-4">
                                  <div className="form_field_wrapper">
                                    <FormControl fullWidth>
                                      <InputLabel>Subjects *</InputLabel>
                                      <Select
                                        multiple
                                        name={`classes.${index}.subjects`}
                                        value={
                                          Array.isArray(cls.subjects)
                                            ? cls.subjects
                                            : []
                                        }
                                        label="Subjects *"
                                        onChange={(
                                          e: SelectChangeEvent<string[]>,
                                        ) =>
                                          handleChange(
                                            e,
                                            `classes.${index}.subjects`,
                                          )
                                        }
                                        disabled={
                                          !cls.class_id ||
                                          (checkHigherClass(
                                            cls.class_id,
                                            dataClasses,
                                          ) &&
                                            !cls.stream)
                                        }
                                        renderValue={(selected) =>
                                          Array.isArray(selected)
                                            ? selected.join(', ')
                                            : ''
                                        }
                                        sx={{
                                          backgroundColor:
                                            inputfield(namecolor),
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
                                        {classSubjects[index]?.map(
                                          (subject: any) => (
                                            <MenuItem
                                              key={subject.subject_id}
                                              value={subject.subject_name}
                                              sx={{
                                                backgroundColor:
                                                  inputfield(namecolor),
                                                color:
                                                  inputfieldtext(namecolor),
                                                '&:hover': {
                                                  backgroundColor:
                                                    inputfieldhover(namecolor),
                                                },
                                              }}
                                            >
                                              <Checkbox
                                                checked={cls.subjects.includes(
                                                  subject.subject_name,
                                                )}
                                                sx={{
                                                  color: fieldIcon(namecolor),
                                                  '&.Mui-checked': {
                                                    color: fieldIcon(namecolor),
                                                  },
                                                }}
                                              />
                                              {subject.subject_name}
                                            </MenuItem>
                                          ),
                                        )}
                                      </Select>
                                    </FormControl>
                                  </div>
                                </div>

                                {values.classes.length > 1 && (
                                  <IconButton
                                    onClick={() => {
                                      setTeacher((prevTeacher) => ({
                                        ...prevTeacher,
                                        classes: prevTeacher?.classes?.filter(
                                          (_, i) => i !== index,
                                        ),
                                      }));

                                      const updatedClasses =
                                        values.classes.filter(
                                          (i: any) => i !== index,
                                        );
                                      formRef.current?.setFieldValue(
                                        'classes',
                                        updatedClasses,
                                      );
                                    }}
                                    sx={{
                                      width: '35px',
                                      height: '35px',
                                      marginTop: '25px',
                                      color: fieldIcon(namecolor),
                                    }}
                                  >
                                    <DeleteOutlineIcon />
                                  </IconButton>
                                )}
                                {index === values.classes.length - 1 && (
                                  <div className="col-md-1">
                                    <IconButton
                                      onClick={() => {
                                        const newCourse = {
                                          class_id: '',
                                          stream: '',
                                          subjects: [],
                                        };

                                        setTeacher((prevTeacher) => ({
                                          ...prevTeacher,
                                          classes: [
                                            ...(prevTeacher.classes || []),
                                            newCourse,
                                          ],
                                        }));
                                      }}
                                      sx={{
                                        width: '35px',
                                        height: '35px',
                                        color: fieldIcon(namecolor),
                                      }}
                                    >
                                      <AddCircleOutlinedIcon />
                                    </IconButton>
                                  </div>
                                )}
                              </div>
                            ))}
                          </>
                        )}
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <Field
                            fullWidth
                            component={TextField}
                            label="Address *"
                            name="address"
                            value={values?.address}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange(e, 'address')}
                          />
                          {touched?.address && errors?.address && (
                            <p className="error">{String(errors.address)}</p>
                          )}
                        </div>
                      </div>
                      <div
                        className="floating-label-container col-md-2"
                        ref={dropdownRef}
                      >
                        <label
                          className={`floating-label ${isFocused || values?.country || isCountryOpen ? 'focused' : 'focusedempty'}`}
                        >
                          Country <span>*</span>
                        </label>
                        <div
                          className="form_field_wrapper"
                          onClick={handleCountryClick}
                          onBlur={handleCountryBlur}
                          tabIndex={-1}
                        >
                          <CountryDropdown
                            classes="form-control custom-dropdown"
                            defaultOptionLabel={values?.country || ''}
                            value={values?.country || ''}
                            onChange={(e) =>
                              handleInputChangecountry(
                                e,
                                'current_address',
                                'country',
                              )
                            }
                          />
                          {touched?.country && errors?.country && (
                            <p className="error">Please enter Country name.</p>
                          )}
                        </div>
                      </div>
                      <div
                        className="floating-label-container col-md-2"
                        ref={dropdownstateRef}
                      >
                        <label
                          className={`floating-label ${isFocusedstate || values?.state || isStateOpen ? 'focused' : 'focusedempty'}`}
                        >
                          State <span>*</span>
                        </label>
                        <div
                          className="form_field_wrapper"
                          onClick={handleStateClick}
                          onBlur={handleStateBlur}
                          tabIndex={-1}
                        >
                          <RegionDropdown
                            classes="form-control custom-dropdown"
                            defaultOptionLabel={values?.state || ''}
                            country={values?.country || ''}
                            value={values?.state || ''}
                            onChange={(e: string) =>
                              handleInputChangecountry(
                                e,
                                'current_address',
                                'state',
                              )
                            }
                          />
                          {state_col && (
                            <p className="error">
                              Please enter a valid state Name.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <Field
                            fullWidth
                            component={TextField}
                            label="City *"
                            name="city"
                            value={values?.city}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange(e, 'city')}
                          />
                          {touched?.city && errors?.city && (
                            <p className="error">{String(errors.city)}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <Field
                            fullWidth
                            component={TextField}
                            label="District *"
                            name="district"
                            value={values?.district}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange(e, 'district')}
                          />
                          {touched?.district && errors?.district && (
                            <p className="error">{String(errors.district)}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <Field
                            fullWidth
                            component={TextField}
                            label="Pincode *"
                            name="pincode"
                            value={values?.pincode}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange(e, 'pincode')}
                          />
                          {touched?.pincode && errors?.pincode && (
                            <p className="error">{String(errors.pincode)}</p>
                          )}
                        </div>
                      </div>

                      <div className="row d-flex justify-content-between mt-0 g-4">
                        <div className="col-12 ">
                          <UploadBtn
                            label="Upload Documents"
                            name="document"
                            accept=".pdf, .jpg, .jpeg, .png, .gif, .mp4"
                            handleFileChange={handleFileChange}
                          />
                          <div className="col-8">
                            {allselectedfiles?.length > 0 && (
                              <ul className="doclist">
                                {allselectedfiles?.map((file, index) => (
                                  <li
                                    key={index}
                                    className="flex mt-2 items-center justify-between "
                                  >
                                    {'name' in file
                                      ? file.name
                                      : (file as any)?.url}

                                    <DeleteOutlinedIcon
                                      className="m-2 cursor-pointer"
                                      onClick={() => handleRemoveFile(index)}
                                    />
                                  </li>
                                ))}
                              </ul>
                            )}
                            {allfiles?.length > 0 && (
                              <ul className="doclist">
                                {allfiles?.map((file: any, index) => (
                                  <li
                                    key={index}
                                    className="flex mt-2 items-center justify-between "
                                  >
                                    {file}
                                    <DeleteOutlinedIcon
                                      className="m-2 cursor-pointer"
                                      onClick={() => handleDeleteFile(index)}
                                    />
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary mainbutton mt-4"
                    >
                      {id ? 'Update' : 'Save'}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditTeacher;
