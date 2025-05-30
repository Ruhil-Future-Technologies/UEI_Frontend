/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  QUERY_KEYS,
  QUERY_KEYS_CLASS,
  QUERY_KEYS_CONTENT,
  QUERY_KEYS_COURSE,
  QUERY_KEYS_ENTITY,
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL,
  QUERY_KEYS_TEACHER,
  QUERY_KEYS_UNIVERSITY,
} from '../../utils/const';
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import NameContext from '../Context/NameContext';
import {
  fieldIcon,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from '../../utils/helpers';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import UploadBtn from '../../Components/UploadBTN/UploadBtn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface IContentForm {
  subjects: string[];
  entity_id: string;
  class_id: string;
  university_id: string;
  institute_id: string;
  stream: string;
  courses: { course_id: string; semester: string; subjects: string[] }[];
  classes: { class_id: string; stream: string; subjects: string[] }[];
  url?: string;
  content_type: string;
  author: string;
  description: string;
  documents?: File[];
  thumnail?: File;
  cover_page?: File;
}

const AddContent = () => {
  const formRef = useRef<FormikProps<IContentForm>>(null);
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const { id } = useParams();
  const navigator = useNavigate();
  const { getData, deleteData, postFileWithProgress, putFileWithProgress } =
    useApi();
  const navigate = useNavigate();
  const GET_UNIVERSITY = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;
  const GET_ENTITIES = QUERY_KEYS_ENTITY.GET_ENTITY;
  const [dataUniversity, setDataUniversity] = useState<any[]>([]);
  const [dataEntity, setDataEntity] = useState<any[]>([]);
  const [dataInstitutes, setDataInstitutes] = useState<any[]>([]);
  const [dataCourses, setDataCourses] = useState<any[]>([]);
  const [dataClasses, setDataClasses] = useState<any[]>([]);
  const [collegeSubjects, setCollegeSubjects] = useState<any[]>([]);
  const [schoolSubjects, setSchoolSubjects] = useState<any[]>([]);
  const [, setStreams] = useState<string[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [teacherCourses, setTeacherCourses] = useState<any[]>([]);
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
  const [classSubjects, setClassSubjects] = useState<{ [key: number]: any[] }>(
    {},
  );
  const [classSubjectsTeacher, setClassSubjectsTeacher] = useState<string[]>(
    [],
  );
  const [classStreams, setClassStreams] = useState<{ [key: number]: string[] }>(
    {},
  );
  const [classStreamsTeacher, setClassStreamsTeacher] = useState<string[]>([]);
  const [allselectedfiles, setAllSelectedfiles] = useState<File[]>([]);
  const [selectedthumnail_cover, setSelectedthumnail_cover] =
    useState<File | null | string>(null);
  const [allfiles, setAllfiles] = useState<File[]>([]);
  const user_type = localStorage.getItem('user_type');
  const user_uuid = localStorage.getItem('user_uuid');

  const DeleteContentURL = QUERY_KEYS_CONTENT.CONTENT_FILE_DELETE;
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [showAuthor, setShowAuthor] = useState(false);
  const [showthumnail, setShowthumnail] = useState('');
  const [loading, setLoading] = useState(false);
  const [teacherClasses, setTeacherClasses] = useState<any>([]);

  const initialState: IContentForm = {
    subjects: [],
    entity_id: '',
    class_id: '',
    university_id: '',
    institute_id: '',
    stream: '',
    courses: [{ course_id: '', semester: '', subjects: [] }],
    classes: [{ class_id: '', stream: '', subjects: [] }],
    url: '',
    content_type: '',
    description: '',
    author: '',
  };
  const [uploadProgress, setUploadProgress] = useState(0);
  const [content, setContent] = useState<IContentForm>(initialState);

  const isSchoolEntity = (entityId: string | string[]): boolean => {
    const selectedEntity = dataEntity?.find(
      (entity) => entity.id === entityId && entity?.is_active,
    );
    return selectedEntity?.entity_type?.toLowerCase() === 'school';
  };

  const isCollegeEntity = (entityId: string | string[]): boolean => {
    const selectedEntity = dataEntity?.find(
      (entity) => entity.id === entityId && entity?.is_active,
    );
    return selectedEntity?.entity_type?.toLowerCase() === 'college';
  };

  const callAPI = async () => {
    let all_courses: any = [];

    await getData(`${QUERY_KEYS_COURSE.GET_COURSE}`)
      .then((data) => {
        all_courses = data.data?.course_data;

        const courses = data.data?.course_data;
        setDataCourses(
          Array.isArray(courses)
            ? courses?.filter((s: any) => s?.is_active)
            : [],
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
      const contentData = await getData(`${QUERY_KEYS_CONTENT.GET_CONTENT}`);
      try {
        if (!contentData?.data) {
          return;
        }

        const currentContent = contentData?.data.contents_data?.find(
          (content: any) => {
            if (content.id == id) {
              return content.id;
            }
          },
        );

        if (!currentContent?.id) {
          return;
        }
        const contentDetail = await getData(
          `${QUERY_KEYS_CONTENT.CONTENT_GET}/${currentContent.id}`,
        );

        const filterContentCourses = (
          contentDetail: any,
          allCourses: any,
        ): { coures: any[] } => {
          const result = {
            courses: [],
          } as any;

          const contentCoursesObj = JSON.parse(
            contentDetail?.course_semester_subjects,
          );

          if (contentCoursesObj) {
            for (const [courseId, semesterData] of Object.entries(
              contentCoursesObj as any,
            )) {
              const matchingCourse = allCourses?.find(
                (course: any) =>
                  course.id === Number(courseId) &&
                  course.institute_id === contentDetail?.data?.institute_id,
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

        const course_semester_subjects_arr: any = filterContentCourses(
          contentDetail?.data?.content_data,
          all_courses,
        );

        const filterContentClasses = (
          contentDetail: any,
          all_classes: any,
        ): { classes: any[] } => {
          const result = {
            classes: [],
          } as any;

          const contentClassesObj = JSON.parse(
            contentDetail.class_stream_subjects,
          );

          if (contentClassesObj) {
            for (const [classId, streamData] of Object.entries(
              contentClassesObj as any,
            )) {
              const matchingClass = all_classes?.find(
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
        const class_stream_subjects_arr: any = filterContentClasses(
          contentDetail?.data?.content_data,
          dataClasses,
        );

        const urls = contentDetail?.data?.content_data?.url || [];

        const fileExtensions = /\.(pdf|png|jpg|mp4)$/i;
        const fileUrls = urls?.filter((item: { url: string }) =>
          fileExtensions.test(item.url),
        );
        const nonFileUrls = urls?.find(
          (item: { url: string }) => !fileExtensions.test(item.url),
        );

        if (fileUrls?.length > 0) {
          setAllfiles(fileUrls);
        }

        const processedData = {
          url: nonFileUrls?.url,
          subjects: contentDetail?.data?.content_data.subjects || [],
          entity_id: contentDetail?.data?.content_data.entity_id || '',
          class_id: contentDetail?.data?.content_data.class_id || '',
          university_id: contentDetail.data?.content_data.university_id || '',
          institute_id: contentDetail?.data?.content_data.institute_id || '',
          stream: contentDetail?.data?.content_data.stream || '',
          courses: course_semester_subjects_arr.courses || [
            { course_id: '', Semester: '', subjects: [] },
          ],
          classes: class_stream_subjects_arr.classes || [
            { class_id: '', stream: '', subjects: [] },
          ],

          content_type: contentDetail?.data?.content_data.content_type || '',
          author: contentDetail?.data?.content_data.author || '',
          description: contentDetail?.data?.content_data.description || '',
        };
        if (contentDetail?.data?.content_data?.content_type == "video_lecture" || contentDetail?.data?.content_data?.content_type == "e-book") {
          if (contentDetail?.data?.content_data?.thumbnail_url) {
            setSelectedthumnail_cover(contentDetail?.data?.content_data?.thumbnail_url);
          }
          setShowthumnail(contentDetail?.data?.content_data?.content_type);
        }
        console.log(contentDetail)
        setContent(processedData);

        if (
          contentDetail?.data?.content_data.author !== 'admin' &&
          contentDetail?.data?.content_data.author !== 'institute' &&
          contentDetail?.data?.content_data.author !== 'teacher'
        ) {
          setShowAuthor(true);
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
    if (user_type === 'institute') {
      await getData(`${QUERY_KEYS.INSTITUTE_EDIT}/${user_uuid}`).then(
        (data) => {
          setContent((prevState) => ({
            ...prevState,
            entity_id: data?.data.entity_id,
            university_id: data?.data.university_id,
            institute_id: data?.data.id,
          }));
        },
      );
    }
    if (user_type === 'teacher') {
      setLoading(true);
      await getData(`${QUERY_KEYS_TEACHER.TEACHER_EDIT}/${user_uuid}`).then(
        (data) => {
          const filteredCourses = data?.data?.course_semester_subjects;

          if (data?.data?.entity_type === 'school') {
            const classStreamSubjects = data?.data
              ?.class_stream_subjects as Record<
                string,
                Record<string, string[]>
              >;

            // Pre-compute values once
            const validClassIds = new Set(
              Object.keys(classStreamSubjects)?.map(Number),
            );

            const uniqueStreamKeys = new Set<string>();
            const subjects: string[] = [];

            for (const streams of Object.values(classStreamSubjects)) {
              for (const [streamName, subjectArray] of Object.entries(
                streams,
              )) {
                if (streamName !== 'general') uniqueStreamKeys.add(streamName);
                for (const subject of subjectArray) {
                  subjects.push(subject);
                }
              }
            }

            // Set state in batch
            setClassSubjectsTeacher(subjects);
            setClassStreamsTeacher([...uniqueStreamKeys]);
            setTeacherClasses(
              dataClasses?.filter((cls) => validClassIds?.has(cls?.id)),
            );
            setLoading(false);
          }

          setTeacherCourses((prevCourses) => ({
            ...prevCourses,
            ...filteredCourses,
          }));

          setContent((prevState) => ({
            ...prevState,
            entity_id: data?.data.entity_id,
            university_id: data?.data.university_id,
            institute_id: data?.data.institute_id,
          }));
        },
      );

      setLoading(false);
    }
  };

  useEffect(() => {
    getData(`${GET_UNIVERSITY}`).then((data) => {
      setDataUniversity(
        data.data?.universities_data?.filter((uni: any) => uni.is_active),
      );
    });
    getData(`${GET_ENTITIES}`).then((data) => {
      setDataEntity(
        data.data?.entityes_data?.filter((entity: any) => entity.is_active),
      );
    });
    getData(`${QUERY_KEYS_CLASS.GET_CLASS}`)
      .then((data) => {
        setDataClasses(data.data?.classes_data);
      })
      .catch((error) => {
        toast.error(error.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
    getData(`${QUERY_KEYS.GET_INSTITUTES}`).then((data) => {
      const allInstitutes = data.data;
      const schoolInstitutes = allInstitutes?.filter(
        (institute: any) =>
          institute.entity_type?.toLowerCase() === 'school' &&
          institute.is_approve &&
          institute.is_active,
      );
      const collegeInstitutes = allInstitutes?.filter(
        (institute: any) =>
          institute.entity_type?.toLowerCase() === 'college' &&
          institute.is_approve &&
          institute.is_active,
      );
      setDataInstitutes(allInstitutes);
      setSchoolInstitutes(schoolInstitutes);
      setCollegeInstitutes(collegeInstitutes);
    });

    getData(`${QUERY_KEYS_COURSE.GET_COURSE}`).then((data) => {
      setDataCourses(data.data.course_data);
    });
    getData(`${QUERY_KEYS_SUBJECT.GET_SUBJECT}`).then((data) => {
      const subjects = data.data?.subjects_data;
      setCollegeSubjects(
        Array.isArray(subjects)
          ? subjects?.filter((s: any) => s?.is_active)
          : [],
      );
    });

    getData(`${QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT}`).then((data) => {
      const subjects = data.data?.subjects_data;
      setSchoolSubjects(
        Array.isArray(subjects)
          ? subjects?.filter((s: any) => s?.is_active)
          : [],
      );
    });
    setIsInitialDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isInitialDataLoaded) {
      callAPI();
    }
  }, [isInitialDataLoaded]);

  useEffect(() => {
    if (formRef.current?.values?.entity_id) {
      if (isSchoolEntity(formRef.current?.values?.entity_id)) {
        setFilteredInstitutes(schoolInstitutes);
      } else if (isCollegeEntity(formRef.current?.values?.entity_id)) {
        if (formRef.current?.values?.university_id) {
          const filtered = collegeInstitutes?.filter(
            (institute) =>
              institute.university_id ===
              formRef.current?.values?.university_id,
          );
          setFilteredInstitutes(filtered);
        } else {
          setFilteredInstitutes([]);
        }
      }
    } else if (content.entity_id) {
      if (isSchoolEntity(content.entity_id)) {
        setFilteredInstitutes(schoolInstitutes);
      } else if (isCollegeEntity(content.entity_id)) {
        if (content.university_id) {
          const filtered = collegeInstitutes?.filter(
            (institute) => institute.university_id === content.university_id,
          );
          setFilteredInstitutes(filtered);
        } else {
          setFilteredInstitutes([]);
        }
      }
    } else {
      setFilteredInstitutes([]);
    }
  }, [
    formRef.current?.values?.entity_id,
    formRef.current?.values?.university_id,

    content.university_id,
    content.entity_id,
  ]);

  useEffect(() => {
    const institutionId = content?.institute_id || selectedInstitutionId;

    if (
      user_type === 'institute' ||
      (institutionId && user_type !== 'teacher')
    ) {
      const filtered = dataCourses?.filter(
        (course) => course.institution_id === institutionId,
      );

      setFilteredCourses(filtered);
    } else if (user_type === 'teacher') {
      const teacher_courses_id = Object.keys(teacherCourses);

      const filtered = dataCourses?.filter((course) =>
        teacher_courses_id.includes(String(course.id)),
      );

      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [
    formRef.current?.values?.institute_id,
    content?.institute_id,

    teacherCourses,
    selectedInstitutionId,
    dataClasses,
  ]);

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

  const SubjectsHandler = ({ values }: { values: IContentForm }) => {
    useEffect(() => {
      if (values?.entity_id) {
        if (isSchoolEntity(values.entity_id)) {
          if (values.class_id) {
            const filtered = schoolSubjects?.filter(
              (subject) => subject.class_id === values.class_id,
            );

            const higherClass = checkHigherClass(values.class_id, dataClasses);

            if (higherClass) {
              if (values.stream) {
                const streamFiltered = filtered?.filter(
                  (subject) => subject.stream === values.stream,
                );

                setFilteredSubjects(streamFiltered);
              } else {
                setFilteredSubjects([]);
              }

              setStreams(
                filtered
                  ?.map((subject) => subject.stream)
                  ?.filter(
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
    }, [values?.class_id, values?.entity_id, values?.stream]);

    return null;
  };

  useEffect(() => {
    const initialCourses = content?.courses;

    formRef.current?.setFieldValue('courses', initialCourses);

    setContent((prev) => ({
      ...prev,
      courses: initialCourses,
    }));

    initialCourses?.forEach((course, index) => {
      if (course.course_id) {
        const allSubjects = collegeSubjects?.filter(
          (subject) => subject.course_id === course.course_id,
        );

        const uniqueSemesters = allSubjects
          ?.map((subject) => subject.semester_number)
          ?.filter((semester, index, self) => self.indexOf(semester) === index)
          ?.sort((a, b) => Number(a) - Number(b));

        setCourseSemesters((prev) => ({
          ...prev,
          [index]: uniqueSemesters,
        }));

        if (course.semester) {
          const filteredSubjects = allSubjects?.filter(
            (subject) =>
              subject.semester_number === Number(course.semester) &&
              subject?.course_id === initialCourses[index]?.course_id,
          );

          setCourseSubjects((prev) => ({
            ...prev,
            [index]: filteredSubjects,
          }));
        }
      }
    });
  }, [content?.courses, collegeSubjects]);

  useEffect(() => {
    const initialClasses = content.classes;

    formRef.current?.setFieldValue('classes', initialClasses);

    setContent((prev) => ({
      ...prev,
      classes: initialClasses,
    }));
    if (!Array.isArray(schoolSubjects)) {
      return;
    }

    initialClasses?.forEach((cls, index) => {
      if (cls.class_id) {
        const allSubjects = schoolSubjects?.filter(
          (subject) => subject.class_id === cls.class_id,
        );

        const uniqueStreams = allSubjects
          ?.map((subject) => subject.stream)
          ?.filter((stream, index, self) => self.indexOf(stream) === index);

        setClassStreams((prev) => ({
          ...prev,
          [index]: uniqueStreams,
        }));

        if (cls.stream) {
          const filteredSubjects = allSubjects?.filter(
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
  }, [content?.classes, schoolSubjects]);

  useEffect(() => {
    if (formRef.current?.values?.courses) {
      formRef.current?.values?.courses?.forEach((course, index) => {
        if (course.course_id) {
          const allSubjects = collegeSubjects?.filter(
            (subject) => subject.course_id === course.course_id,
          );

          const uniqueSemesters = allSubjects
            ?.map((subject) => subject.semester_number)
            ?.filter(
              (semester, index, self) => self.indexOf(semester) === index,
            )
            ?.sort((a, b) => Number(a) - Number(b));

          setCourseSemesters((prev) => ({
            ...prev,
            [index]: uniqueSemesters,
          }));

          if (course.semester) {
            const filteredSubjects = allSubjects?.filter(
              (subject) => subject.semester_number === course.semester,
            );

            setCourseSubjects((prev) => ({
              ...prev,
              [index]: filteredSubjects,
            }));
          }
        }
      });
    }
  }, [content?.courses, collegeSubjects]);

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

  const contentSchema = Yup.object().shape({
    entity_id: Yup.string().required('Please select Entity'),
    stream: Yup.string().when('class_id', {
      is: (class_id: string) => ['class_11', 'class_12'].includes(class_id),
      then: () => Yup.string().required('Stream is required'),
      otherwise: () => Yup.string(),
    }),
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

    university_id: Yup.string().when('entity_id', {
      is: (entity_id: string) => {
        const selectedEntity = dataEntity?.find(
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
    url: Yup.string(),
    content_type: Yup.string().required('Please select Content Type'),
    author: Yup.string().when('content_type', {
      is: (content_type: string) => {
        return (
          content_type == 'e-book' ||
          content_type == 'video_lecture' ||
          content_type == 'research_paper'
        );
      },
      then: (schema) =>
        schema.required('Please Fill Author or Instructor name'),
      otherwise: (schema) => schema.notRequired(),
    }),
    description: Yup.string().required('Please enter Description'),
  });

  const handleSubmit = async (
    contentData: IContentForm,
    { resetForm }: FormikHelpers<IContentForm>,
  ) => {
    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();

    if (!contentData.url && allselectedfiles?.length <= 0 && !id) {
      toast.error('Please Enter URL or Upload File', {
        hideProgressBar: true,
        theme: 'colored',
      });
      setLoading(false);
      return;
    }
    if (contentData?.url) {
      let videoId: string | null = null;
      const url = new URL(contentData.url);
      if (
        url.hostname === 'www.youtube.com' ||
        url.hostname === 'youtube.com'
      ) {
        if (url.pathname === '/watch') {
          videoId = url.searchParams.get('v');
        } else if (url.pathname.startsWith('/live/')) {
          videoId = url.pathname.split('/live/')[1];
        }
      } else if (url.hostname === 'youtu.be') {
        videoId = url.pathname.substring(1);
      }

      if (videoId) {
        contentData.url = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    const transformCollegeData = (originalData: any) => {
      const transformedData = { ...originalData };

      delete transformedData.courses;
      delete transformedData.classes;

      const course_semester_subjects = {} as any;

      originalData?.courses?.forEach((course: any) => {
        const courseDetail = dataCourses?.find(
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
        const classDetails = dataClasses?.find(
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

    Object.keys(contentData)?.forEach((key) => {
      const typedKey = key as keyof IContentForm;
      if (typedKey.startsWith('courses.')) {
        delete contentData[typedKey];
      }
    });
    Object.keys(contentData)?.forEach((key) => {
      const typedKey = key as keyof IContentForm;
      if (typedKey.startsWith('classes.')) {
        delete contentData[typedKey];
      }
    });

    if (contentData.class_id == '' || contentData.class_id == 'None') {
      delete (contentData as any).class_id;
      delete (contentData as any).stream;
      delete (contentData as any).subjects;
    }
    if (
      !contentData.university_id ||
      contentData.university_id == '' ||
      contentData.university_id == 'None'
    ) {
      delete (contentData as any).courses;

      delete (contentData as any).university_id;
    }

    const checkCollege = isCollegeEntity(contentData.entity_id);

    const transformedData = checkCollege
      ? transformCollegeData(contentData)
      : transformSchoolData(contentData);

    const formattedData = {
      ...transformedData,
      user_type: user_type,
    } as any;

    if (id) {
      allselectedfiles?.forEach((file) => {
        formData.append('documents[]', file);
      });
      if (selectedthumnail_cover) {
        if (showthumnail == 'e-book') {
          formData.append('cover_page', selectedthumnail_cover);
        }
        if (showthumnail == 'video_lecture') {
          formData.append('thumbnail', selectedthumnail_cover);
        }
      }

      Object.keys(formattedData)?.forEach((key) => {
        formData.append(key, formattedData[key]);
      });

      const urls = allfiles?.map((file: any) => file?.url);

      if (formattedData?.url) {
        urls.push(formattedData?.url);
      }

      const urlStr = JSON.stringify(urls);

      formData.set('url', urlStr);

      putFileWithProgress(
        `${QUERY_KEYS_CONTENT.CONTENT_EDIT}/${id}`,
        formData,
        {
          onProgress: (progress: any) => {
            setUploadProgress(progress);
          },
          onSuccess: (data: any) => {
            if (data.status) {
              toast.success('Content Updated successfully', {
                hideProgressBar: true,
                theme: 'colored',
              });
              resetForm({ values: initialState });
              setContent((prev) => ({
                ...prev,
                subjects: [],
                stream: '',
                courses: [{ course_id: '', semester: '', subjects: [] }],
                classes: [{ class_id: '', stream: '', subjects: [] }],
                url: '',
                content_type: '',
                description: '',
                author: '',
              }));
              setAllSelectedfiles([]);
              setLoading(false);
              if (user_type === 'admin') {
                navigator('/main/Content');
              } else if (user_type === 'teacher') {
                navigator('/teacher-dashboard/Content');
              } else if (user_type === 'institute') {
                navigator('/institution-dashboard/Content');
              }
            } else {
              toast.error('Content Upload Failed', {
                hideProgressBar: true,
                theme: 'colored',
              });
              resetForm({ values: initialState });
              setContent(initialState);
              setAllSelectedfiles([]);
              setLoading(false);
            }
          },
          onError: (error: any) => {
            setLoading(false);
            toast.error(error?.response?.data.message || 'An error occurred', {
              hideProgressBar: true,
              theme: 'colored',
            });
          },
        },
      );
    } else {
      Object.keys(formattedData)?.forEach((key) => {
        formData.append(key, formattedData[key]);
      });
      if (selectedthumnail_cover) {
        if (showthumnail == 'e-book') {
          formData.append('thumbnail', selectedthumnail_cover);
        }
        if (showthumnail == 'video_lecture') {
          formData.append('thumbnail', selectedthumnail_cover);
        }
      }
      allselectedfiles?.forEach((file) => {
        formData.append('documents[]', file);
      });

      postFileWithProgress(`${QUERY_KEYS_CONTENT.CONTENT_ADD}`, formData, {
        onProgress: (progress: any) => {
          setUploadProgress(progress);
        },
        onSuccess: (data: any) => {
          if (data.status) {
            toast.success('Content saved successfully', {
              hideProgressBar: true,
              theme: 'colored',
            });
            resetForm({ values: initialState });
            setContent((prev) => ({
              ...prev,
              subjects: [],
              stream: '',
              courses: [{ course_id: '', semester: '', subjects: [] }],
              classes: [{ class_id: '', stream: '', subjects: [] }],
              url: '',
              content_type: '',
              description: '',
              author: '',
            }));
            setSelectedthumnail_cover(null);
            setAllSelectedfiles([]);
            setLoading(false);
          } else {
            toast.error('Content Upload Failed', {
              hideProgressBar: true,
              theme: 'colored',
            });
            resetForm({ values: initialState });
            setContent(initialState);
            setAllSelectedfiles([]);
            setLoading(false);
          }
        },
        onError: (error: any) => {
          setLoading(false);
          toast.error(error?.response?.data.message || 'An error occurred', {
            hideProgressBar: true,
            theme: 'colored',
          });
        },
      });
    }
  };

  const handleChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | SelectChangeEvent<string | string[]>,
    fieldName: string,
  ) => {
    const value = e.target?.value;

    if (
      (fieldName === 'content_type' && value === 'e-book') ||
      value === 'video_lecture' ||
      value === 'research_paper'
    ) {
      setShowthumnail(value);
      setShowAuthor(true);
      setContent((prevState: any) => ({
        ...prevState,
        author: '',
      }));

      if (allselectedfiles?.length > 1) {
        setAllSelectedfiles([]);

        toast.error(
          'Video Lecture, Research Paper and E-book only support one File',
          { hideProgressBar: true, theme: 'colored' },
        );
      }
    }

    if (fieldName === 'content_type' && value === 'notes') {
      setShowAuthor(false);
      setContent((prevState: any) => ({
        ...prevState,
        author: user_type,
      }));
    }
    if (fieldName === 'institute_id') {
      setSelectedInstitutionId(value as string);
    }
    if (fieldName.startsWith('courses.')) {
      const [, index, field] = fieldName.split('.');
      const currentIndex = parseInt(index);

      if (field === 'course_id' || field === 'semester') {
        if (formRef?.current?.values?.courses) {
          const updatedCourses = formRef?.current?.values?.courses?.map(
            (course: any, i: number) => {
              if (i === currentIndex) {
                return { ...course, [field]: value };
              }
              return course;
            },
          );

          if (updatedCourses) {
            const isDuplicate = updatedCourses?.some(
              (course1: any, index1: number) => {
                return updatedCourses?.some((course2: any, index2: number) => {
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

      setContent((prevContent: any) => ({
        ...prevContent,
        courses: prevContent?.courses?.map((course: any, i: number) => {
          if (i === currentIndex) {
            const updatedCourse = { ...course, [field]: value };

            if (field === 'course_id') {
              updatedCourse.semester = '';
              updatedCourse.subjects = [];

              const courseSubjects = collegeSubjects?.filter(
                (subject) => subject.course_id === value,
              );
              const uniqueSemesters = courseSubjects
                ?.map((subject) => subject.semester_number)
                ?.filter(
                  (semester, index, array) => array.indexOf(semester) === index,
                )
                ?.sort((a, b) => Number(a) - Number(b));
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

              const courseSubjects = collegeSubjects?.filter(
                (subject) =>
                  subject?.course_id === course?.course_id &&
                  subject?.semester_number === value,
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

    if (fieldName?.startsWith('classes.')) {
      const [, index, field] = fieldName.split('.');
      const currentIndex = parseInt(index);

      if (field === 'class_id' || field === 'stream') {
        if (formRef?.current?.values?.classes) {
          const updatedClasses = formRef?.current?.values?.classes?.map(
            (cls: any, i: number) => {
              if (i === currentIndex) {
                return { ...cls, [field]: value };
              }
              return cls;
            },
          );

          if (updatedClasses) {
            const isDuplicate = updatedClasses?.some(
              (class1: any, index1: number) => {
                return updatedClasses?.some((class2: any, index2: number) => {
                  const isHigher = checkHigherClass(
                    class1?.class_id,
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

      setContent((prevTeacher: any) => ({
        ...prevTeacher,
        classes: prevTeacher?.classes?.map((cls: any, i: number) => {
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
                const classSubjects = schoolSubjects?.filter(
                  (subject) => subject.class_id === value,
                );

                const uniqueStreams = classSubjects
                  ?.map((subject) => subject.stream)
                  ?.filter((stream, idx, self) => self.indexOf(stream) === idx);

                setClassStreams((prev) => ({
                  ...prev,
                  [currentIndex]: uniqueStreams,
                }));
              } else {
                const filteredSubjects = schoolSubjects?.filter(
                  (subject) => subject?.class_id === value,
                );
                setClassSubjects((prev) => ({
                  ...prev,
                  [currentIndex]: filteredSubjects,
                }));
              }
            }

            if (field === 'stream') {
              updatedClass.subjects = [];
              const filteredSubjects = schoolSubjects?.filter(
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

    setContent((prevTeacher: any) => {
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
      formRef?.current?.errors?.[fieldName as keyof IContentForm] !== undefined
    ) {
      const errorMessage =
        formRef?.current?.errors?.[fieldName as keyof IContentForm];
      formRef?.current?.setFieldError(
        fieldName,
        typeof errorMessage === 'string' ? errorMessage : String(errorMessage),
      );
      formRef?.current?.setFieldTouched(fieldName, true);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (content?.url) {
      setContent((prevState) => ({
        ...prevState,
        url: '',
      }));
      toast.error('URL sets to empty. Content can be either URL or File ', {
        hideProgressBar: true,
        theme: 'colored',
      });
    }

    const files = event.target.files || '';

    if (
      (content?.content_type === 'e-book' && files?.length > 1) ||
      (content?.content_type === 'video_lecture' && files?.length > 1) ||
      (content?.content_type === 'research_paper' && files?.length > 1)
    ) {
      setAllSelectedfiles([]);
      event.target.value = '';
      toast.error(
        'Video Lecture, Research Paper, and E-book only support one File',
        { hideProgressBar: true, theme: 'colored' },
      );
    }

    if (files && event.target.name !== 'icon') {
      const filesArray = Array.from(files);

      const PDF_MAX_SIZE = 10 * 1024 * 1024;
      // const MP4_MAX_SIZE = 500 * 1024 * 1024;
      const MP4_MAX_SIZE = 100 * 1024 * 1024;

      const filteredFiles = filesArray?.filter((file) => {
        const fileType = file.type;
        const fileSize = file.size;

        if (fileType === 'application/pdf' && fileSize > PDF_MAX_SIZE) {
          toast.error(`File ${file.name} exceeds the 10MB limit for PDFs.`, {
            hideProgressBar: true,
            theme: 'colored',
          });
          return false;
        }

        if (fileType === 'video/mp4' && fileSize > MP4_MAX_SIZE) {
          toast.error(`File ${file.name} exceeds the 100MB limit for MP4s.`, {
            hideProgressBar: true,
            theme: 'colored',
          });
          return false;
        }

        return true;
      });

      setAllSelectedfiles((prevFiles) => [...prevFiles, ...filteredFiles]);

      event.target.value = '';
    }
  };

  const handleFileChangeThumnail = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: any,
  ) => {
    const file = event.target.files;
    if (file) {
      if (type == 'Cover page') {
        setContent((prevState) => ({
          ...prevState,
          cover_page: file[0],
        }));
      }
      if (type == 'Thumnail') {
        setContent((prevState) => ({
          ...prevState,
          thumnail: file[0],
        }));
      }
      setSelectedthumnail_cover(file[0]);
    }
  };
  const handleRemoveFile = (index: number) => {
    setAllSelectedfiles((previous) =>
      previous?.filter((_, ind) => ind !== index),
    );
  };

  const handleDeleteFile = (id: number | undefined) => {
    deleteData(`${DeleteContentURL}/${id}`)
      .then((data: { message: string }) => {
        toast.success(data?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
        callAPI();
      })
      .catch((e: any) => {
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const handleBack = () => {
    navigate(-1); // navigates to the previous page
  };

  return (
    <>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9,
          }}
        >
          <Box sx={{ width: '80vw', mt: 2, mb: 2 }}>
            {id ? (
              <Typography variant="body2" color="text.secondary" align="center">
                Loading..
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" align="center">
                {uploadProgress < 100
                  ? `Uploading: ${uploadProgress}%`
                  : 'Processing...'}
              </Typography>
            )}
            <LinearProgress
              variant={uploadProgress === 100 ? 'indeterminate' : 'determinate'}
              value={uploadProgress}
              sx={{ mt: 1, height: 10, borderRadius: 5 }}
            />
          </Box>
        </div>
      )}
      <div className="main-wrapper">
        <div className="main-content">
          <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
            <div className="breadcrumb-title pe-3">
              <div className="d-flex align-items-center gap-2">
                <ArrowBackIcon role="button" onClick={handleBack} />
                <a className="text-dark" href="/teacher-dashboard">
                  Dashboard
                </a>
              </div>
            </div>
            <div className="ps-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    <div className="main_title">
                      {id ? 'Edit' : 'Add'} Content
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="card p-lg-3">
            <div className="card-body">
              <Typography variant="h6">
                <div className="main_title">{id ? 'Edit' : 'Add'} Content</div>
              </Typography>
              <Formik
                onSubmit={handleSubmit}
                initialValues={content}
                enableReinitialize
                validationSchema={contentSchema}
                innerRef={formRef}
              >
                {({ errors, values, touched }) => (
                  <Form>
                    <SubjectsHandler values={values} />
                    <div className="row gy-4 mt-0">
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <FormControl fullWidth>
                            <InputLabel>Entity *</InputLabel>
                            <Select
                              name="entity_id"
                              value={values?.entity_id}
                              label="Entity *"
                              disabled={
                                user_type === 'institute' ||
                                user_type === 'teacher'
                              }
                              style={{
                                backgroundColor:
                                  user_type === 'institute' ||
                                    user_type === 'teacher'
                                    ? '#f0f0f0'
                                    : inputfield(namecolor),
                                color:
                                  user_type === 'institute' ||
                                    user_type === 'teacher'
                                    ? '#999999'
                                    : inputfieldtext(namecolor),
                                border:
                                  user_type === 'institute' ||
                                    user_type === 'teacher'
                                    ? '1px solid #d0d0d0'
                                    : undefined,
                              }}
                              onChange={(e: SelectChangeEvent<string>) =>
                                handleChange(e, 'entity_id')
                              }
                            >
                              {dataEntity?.map((entity) => (
                                <MenuItem key={entity?.id} value={entity?.id}>
                                  {entity?.entity_type}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {touched?.entity_id && errors?.entity_id && (
                            <p style={{ color: 'red' }}>
                              {String(errors.entity_id)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="form_field_wrapper">
                          <FormControl fullWidth>
                            <InputLabel>University *</InputLabel>
                            <Select
                              name="university_id"
                              value={
                                dataUniversity?.some(
                                  (u) => u.id === values?.university_id,
                                )
                                  ? values?.university_id
                                  : ''
                              }
                              label="University *"
                              onChange={(e: SelectChangeEvent<string>) =>
                                handleChange(e, 'university_id')
                              }
                              style={{
                                backgroundColor:
                                  isSchoolEntity(values?.entity_id) ||
                                    user_type === 'institute' ||
                                    user_type === 'teacher'
                                    ? '#f0f0f0'
                                    : inputfield(namecolor),
                                color:
                                  isSchoolEntity(values?.entity_id) ||
                                    user_type === 'institute' ||
                                    user_type === 'teacher'
                                    ? '#999999'
                                    : inputfieldtext(namecolor),
                                border:
                                  isSchoolEntity(values?.entity_id) ||
                                    user_type === 'institute' ||
                                    user_type === 'teacher'
                                    ? '1px solid #d0d0d0'
                                    : undefined,
                              }}
                              disabled={
                                isSchoolEntity(values?.entity_id) ||
                                user_type === 'institute' ||
                                user_type === 'teacher'
                              }
                            >
                              {dataUniversity?.map((university: any) => (
                                <MenuItem
                                  key={university?.id}
                                  value={university?.id}
                                >
                                  {university?.university_name}
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
                            <InputLabel>Institute *</InputLabel>
                            <Select
                              name="institute_id"
                              value={values?.institute_id}
                              label="Institute *"
                              onChange={(e: SelectChangeEvent<string>) =>
                                handleChange(e, 'institute_id')
                              }
                              disabled={
                                user_type === 'institute' ||
                                user_type === 'teacher'
                              }
                              style={{
                                backgroundColor:
                                  user_type === 'institute' ||
                                    user_type === 'teacher'
                                    ? '#f0f0f0'
                                    : inputfield(namecolor),
                                color:
                                  user_type === 'institute' ||
                                    user_type === 'teacher'
                                    ? '#999999'
                                    : inputfieldtext(namecolor),
                                border:
                                  user_type === 'institute' ||
                                    user_type === 'teacher'
                                    ? '1px solid #d0d0d0'
                                    : undefined,
                              }}
                            >
                              {filteredInstitutes?.map((institute) => (
                                <MenuItem
                                  key={institute?.id}
                                  value={institute?.id}
                                >
                                  {institute?.institute_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {touched?.institute_id && errors?.institute_id && (
                            <p className="error">
                              {String(errors.institute_id)}
                            </p>
                          )}
                        </div>
                      </div>
                      {isCollegeEntity(values?.entity_id) &&
                        values?.courses?.length > 0 && (
                          <>
                            {values?.courses?.map((course: any, index: any) => (
                              <div className="row gy-4 mt-2" key={index}>
                                <div className="col-md-2">
                                  <div className="form_field_wrapper">
                                    <FormControl fullWidth>
                                      <InputLabel>Course *</InputLabel>
                                      <Select
                                        name={`courses.${index}.course_id`}
                                        value={course?.course_id}
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
                                      >
                                        {filteredCourses?.map((course: any) => (
                                          <MenuItem
                                            key={course?.id}
                                            value={course?.id}
                                          >
                                            {course?.course_name}
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
                                        value={course?.semester}
                                        label="Semester *"
                                        onChange={(
                                          e: SelectChangeEvent<string>,
                                        ) =>
                                          handleChange(
                                            e,
                                            `courses.${index}.semester`,
                                          )
                                        }
                                        disabled={!course?.course_id}
                                      >
                                        {courseSemesters[index]?.map(
                                          (semesterOption: string) => (
                                            <MenuItem
                                              key={semesterOption}
                                              value={semesterOption}
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
                                        value={course?.subjects}
                                        label="Subjects *"
                                        onChange={(
                                          e: SelectChangeEvent<string[]>,
                                        ) =>
                                          handleChange(
                                            e,
                                            `courses.${index}.subjects`,
                                          )
                                        }
                                        disabled={!course?.semester}
                                        renderValue={(selected) =>
                                          selected?.join(', ')
                                        }
                                      >
                                        {courseSubjects[index]?.map(
                                          (subject: any) => (
                                            <MenuItem
                                              key={subject?.subject_id}
                                              value={subject?.subject_name}
                                            >
                                              <Checkbox
                                                checked={course?.subjects.includes(
                                                  subject?.subject_name,
                                                )}
                                                sx={{
                                                  color: fieldIcon(namecolor),
                                                  '&.Mui-checked': {
                                                    color: fieldIcon(namecolor),
                                                  },
                                                }}
                                              />
                                              {subject?.subject_name}
                                            </MenuItem>
                                          ),
                                        )}
                                      </Select>
                                    </FormControl>
                                  </div>
                                </div>
                                {values?.courses?.length > 1 && (
                                  <IconButton
                                    onClick={() => {
                                      setContent((prevTeacher) => ({
                                        ...prevTeacher,
                                        courses: prevTeacher?.courses?.filter(
                                          (_, i) => i !== index,
                                        ),
                                      }));

                                      const updatedCourses =
                                        values?.courses?.filter(
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
                                    <DeleteOutlinedIcon />
                                  </IconButton>
                                )}
                                {index === values?.courses?.length - 1 && (
                                  <div className="col-md-1">
                                    <IconButton
                                      onClick={() => {
                                        const newCourse = {
                                          course_id: '',
                                          semester: '',
                                          subjects: [],
                                        };

                                        setContent((prevTeacher) => ({
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
                            {values?.classes?.map((cls: any, index: any) => (
                              <div className="row gy-4 mt-2" key={index}>
                                <div className="col-md-2">
                                  <div className="form_field_wrapper">
                                    <FormControl fullWidth>
                                      <InputLabel>Class *</InputLabel>
                                      <Select
                                        name={`classes.${index}.class_id`}
                                        value={cls?.class_id}
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
                                        {(user_type === 'admin' ||
                                          user_type === 'institute') &&
                                          dataClasses?.length > 0
                                          ? dataClasses?.map((cls: any) => (
                                            <MenuItem
                                              key={cls?.id}
                                              value={cls?.id}
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
                                              {cls?.class_name.replace(
                                                'class_',
                                                'Class ',
                                              )}
                                            </MenuItem>
                                          ))
                                          : user_type === 'teacher' &&
                                            teacherClasses?.length > 0
                                            ? teacherClasses?.map(
                                              (cls: any) => (
                                                <MenuItem
                                                  key={cls?.id}
                                                  value={cls?.id}
                                                  sx={{
                                                    backgroundColor:
                                                      inputfield(namecolor),
                                                    color:
                                                      inputfieldtext(
                                                        namecolor,
                                                      ),
                                                    '&:hover': {
                                                      backgroundColor:
                                                        inputfieldhover(
                                                          namecolor,
                                                        ),
                                                    },
                                                  }}
                                                >
                                                  {cls?.class_name.replace(
                                                    'class_',
                                                    'Class ',
                                                  )}
                                                </MenuItem>
                                              ),
                                            )
                                            : ''}
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
                                            value={cls?.stream}
                                            label="Stream *"
                                            onChange={(
                                              e: SelectChangeEvent<string>,
                                            ) =>
                                              handleChange(
                                                e,
                                                `classes.${index}.stream`,
                                              )
                                            }
                                            disabled={!cls?.class_id}
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
                                            {classStreams[index]
                                              ?.filter((item) =>
                                                classStreamsTeacher?.includes(
                                                  item,
                                                ),
                                              )
                                              ?.map((streamOption: string) => (
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
                                              ))}
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
                                        value={cls?.subjects}
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
                                          !cls?.class_id ||
                                          (checkHigherClass(
                                            cls?.class_id,
                                            dataClasses,
                                          ) &&
                                            !cls?.stream)
                                        }
                                        renderValue={(selected) =>
                                          selected.join(', ')
                                        }
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
                                        {classSubjects[index]
                                          ?.filter((item) =>
                                            classSubjectsTeacher?.includes(
                                              item?.subject_name,
                                            ),
                                          )
                                          ?.map((subject: any) => (
                                            <MenuItem
                                              key={subject?.subject_id}
                                              value={subject?.subject_name}
                                            >
                                              <Checkbox
                                                checked={cls?.subjects?.includes(
                                                  subject?.subject_name,
                                                )}
                                                sx={{
                                                  color: fieldIcon(namecolor),
                                                  '&.Mui-checked': {
                                                    color: fieldIcon(namecolor),
                                                  },
                                                }}
                                              />
                                              {subject?.subject_name}
                                            </MenuItem>
                                          ))}
                                      </Select>
                                    </FormControl>
                                  </div>
                                </div>

                                {values?.classes?.length > 1 && (
                                  <IconButton
                                    onClick={() => {
                                      setContent((prevTeacher) => ({
                                        ...prevTeacher,
                                        classes: prevTeacher?.classes?.filter(
                                          (_, i) => i !== index,
                                        ),
                                      }));

                                      const updatedClasses =
                                        values?.classes?.filter(
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
                                    <DeleteOutlinedIcon />
                                  </IconButton>
                                )}
                                {index === values?.classes?.length - 1 && (
                                  <div className="col-md-1">
                                    <IconButton
                                      onClick={() => {
                                        const newCourse = {
                                          class_id: '',
                                          stream: '',
                                          subjects: [],
                                        };

                                        setContent((prevTeacher) => ({
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
                          <FormControl fullWidth>
                            <InputLabel>Content Type *</InputLabel>
                            <Select
                              name="content_type"
                              value={values?.content_type}
                              label="Content Type *"
                              onChange={(e: SelectChangeEvent<string>) =>
                                handleChange(e, 'content_type')
                              }
                              disabled={id ? true : false}
                              style={{
                                backgroundColor: id
                                  ? '#f0f0f0'
                                  : inputfield(namecolor),
                                color: id
                                  ? '#999999'
                                  : inputfieldtext(namecolor),
                                border: id ? '1px solid #d0d0d0' : undefined,
                              }}
                            >
                              <MenuItem value="notes">Notes</MenuItem>
                              <MenuItem value="e-book">eBook</MenuItem>
                              <MenuItem value="video_lecture">
                                Video Lecture
                              </MenuItem>

                              <MenuItem value="research_paper">
                                Research Paper
                              </MenuItem>
                            </Select>
                          </FormControl>
                          {touched?.content_type && errors?.content_type && (
                            <p className="error">
                              {String(errors.content_type)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form_field_wrapper">
                          <Field
                            fullWidth
                            component={TextField}
                            label="URL *"
                            name="url"
                            value={values?.url}
                            disabled={
                              allselectedfiles?.length > 0 ||
                              allfiles?.length > 0
                            }
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange(e, 'url')}
                            style={{
                              backgroundColor:
                                allselectedfiles?.length > 0 ||
                                  allfiles?.length > 0
                                  ? '#f0f0f0'
                                  : inputfield(namecolor),
                              color:
                                allselectedfiles?.length > 0 ||
                                  allfiles?.length > 0
                                  ? '#999999'
                                  : inputfieldtext(namecolor),
                              border:
                                allselectedfiles?.length > 0 ||
                                  allfiles?.length > 0
                                  ? '1px solid #d0d0d0'
                                  : undefined,
                            }}
                          />
                          {touched?.url && errors?.url && (
                            <p className="error">{String(errors.url)}</p>
                          )}
                        </div>
                      </div>

                      {showAuthor && (
                        <div className="col-md-2">
                          <div className="form_field_wrapper">
                            <Field
                              fullWidth
                              component={TextField}
                              label="Author or Instructor *"
                              name="author"
                              value={values?.author}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) => handleChange(e, 'author')}
                            />
                            {touched?.author && errors?.author && (
                              <p className="error">{String(errors.author)}</p>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="row d-flex justify-content-between mt-0 g-4">
                        <div className="col-6">
                          <InputLabel id="">Content *</InputLabel>
                          <UploadBtn
                            label="Upload Files"
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
                                {allfiles?.map((file, index) => (
                                  <li
                                    key={index}
                                    className="flex mt-2 items-center justify-between "
                                  >
                                    {'name' in file
                                      ? file.name
                                      : (file as any)?.url}

                                    <DeleteOutlinedIcon
                                      className="m-2 cursor-pointer"
                                      onClick={() =>
                                        handleDeleteFile((file as any)?.id)
                                      }
                                    />
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div>
                            {touched?.documents && errors?.documents && (
                              <p className="error">
                                {String(errors.documents)}
                              </p>
                            )}
                          </div>
                        </div>
                        {showthumnail == 'video_lecture' && (
                          <Box className="col-6">
                            {/* Hidden File Input */}
                            <input
                              accept="image/*" // ✅ Restrict only to images
                              type="file"
                              id="upload-thumbnail"
                              name="thumbnail"
                              multiple
                              hidden
                              onChange={(e) =>
                                handleFileChangeThumnail(e, 'Thumbnail')
                              }
                            />

                            {/* Upload Button */}
                            <label htmlFor="upload-thumbnail">
                              <Button variant="contained" component="span">
                                Upload thumbnail
                              </Button>
                            </label>

                            {/* Image Preview of Selected Files */}
                            <Box className="col-8" mt={2}>
                              <List className="doclist">
                                {selectedthumnail_cover && (
                                  <ListItem
                                    className="flex items-center justify-between"
                                    sx={{ pl: 0 }}
                                  >
                                    <Box className="flex items-center">
                                      {id ?
                                        <img width={120} height={110} src={selectedthumnail_cover as string} alt={selectedthumnail_cover as string} />
                                        : <Avatar
                                          src={URL.createObjectURL(
                                            selectedthumnail_cover as File,
                                          )}
                                          variant="rounded"
                                          sx={{ width: 48, height: 48, mr: 2 }}
                                        />}

                                    </Box>
                                    <IconButton
                                      onClick={() =>
                                        setSelectedthumnail_cover(null)
                                      }
                                    >
                                      <DeleteOutlinedIcon />
                                    </IconButton>
                                  </ListItem>
                                )}
                              </List>
                            </Box>

                            {/* Validation Error */}
                            {touched?.thumnail && errors?.thumnail && (
                              <Typography color="error" variant="caption">
                                {String(errors.documents)}
                              </Typography>
                            )}
                          </Box>
                        )}
                        {showthumnail == 'e-book' && (
                          <Box className="col-6">
                            {/* Upload Button */}
                            <input
                              accept="image/*"
                              type="file"
                              id="upload-cover-page"
                              name="cover_page"
                              style={{ display: 'none' }}
                              onChange={(e) =>
                                handleFileChangeThumnail(e, 'Cover page')
                              }
                            />
                            <label htmlFor="upload-cover-page">
                              <Button variant="contained" component="span">
                                Upload Cover Page
                              </Button>
                            </label>

                            {/* Preview & Selected File */}
                            <Box className="col-8" mt={2}>
                              <List className="doclist">
                                {selectedthumnail_cover && (
                                  <ListItem
                                    className="flex items-center justify-between"
                                    sx={{ pl: 0 }}
                                  >
                                    {id ?
                                      <img width={120} height={110} src={selectedthumnail_cover as string} alt={selectedthumnail_cover as string} />
                                      :
                                      <Avatar
                                        src={URL.createObjectURL(
                                          selectedthumnail_cover as File,
                                        )}
                                        variant="rounded"
                                        sx={{ width: 60, height: 60, mr: 2 }}
                                      />
                                    }

                                    <IconButton
                                      onClick={() =>
                                        setSelectedthumnail_cover(null)
                                      }
                                    >
                                      <DeleteOutlinedIcon />
                                    </IconButton>
                                  </ListItem>
                                )}
                              </List>
                            </Box>

                            {/* Error message */}
                            {touched?.cover_page && errors?.cover_page && (
                              <Typography variant="caption" color="error">
                                {String(errors.cover_page)}
                              </Typography>
                            )}
                          </Box>
                        )}
                      </div>
                      <div className="row mt-4">
                        <div className="col-md-4">
                          <div className="form_field_wrapper">
                            <Field
                              fullWidth
                              component={TextField}
                              label="Description *"
                              name="description"
                              value={values?.description}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) => handleChange(e, 'description')}
                              multiline
                              rows={2}
                            />
                            {touched?.description && errors?.description && (
                              <p className="error">
                                {String(errors.description)}
                              </p>
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

export default AddContent;
