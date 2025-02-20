/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import {
  Boxes,
  BoxesForSchool,
  qualifications,
  Teacher,
} from '../../TeacherRgistrationForm';
import useApi from '../../../hooks/useAPI';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs, { Dayjs } from 'dayjs';
import NameContext from '../../Context/NameContext';
import UploadBtn from '../../../Components/UploadBTN/UploadBtn';
import {
  fieldIcon,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from '../../../utils/helpers';
import {
  CourseRep0oDTO,
  IClass,
  IEntity,
  InstituteRep0oDTO,
  SemesterRep0oDTO,
  SubjectRep0oDTO,
  UniversityRep0oDTO,
} from '../../../Components/Table/columns';
import { toast } from 'react-toastify';
import {
  QUERY_KEYS,
  QUERY_KEYS_CLASS,
  QUERY_KEYS_COURSE,
  QUERY_KEYS_ROLE,
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL,
  QUERY_KEYS_UNIVERSITY,
} from '../../../utils/const';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { useNavigate } from 'react-router-dom';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
//import axios from "axios";

const TeacherProfile = () => {
  const stream = ['Science', 'Commerce', 'Arts'];
  const navigate = useNavigate();
  const teacherLoginId = localStorage.getItem('_id');
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const { getData, putData } = useApi();
  const InstituteEntityURL = QUERY_KEYS.ENTITY_LIST;
  const InstituteURL = QUERY_KEYS.GET_INSTITUTES;
  const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;
  const getsubjectSchool = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;
  const getSubjectCollege = QUERY_KEYS_SUBJECT.GET_SUBJECT;
  const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;
  const Rolelist = QUERY_KEYS_ROLE.GET_ROLE;
  const UniversityURL = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;
  const [teacherData, setTeacherData] = useState<Teacher>({
    first_name: '',
    last_name: '',
    gender: '',
    dob: dayjs('dd-mm-yyyy'),
    email_id: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    stream: '',
    district: '',
    city: '',
    pincode: '',
    qualification: '',
    experience: '',
    subjects: [''],
    role_id: '',
    entity_id: '',
    class_id: '',
    course_id: '',
    institution_id: '',
    school_name: '',
    documents: [],
    is_verified: false,
    is_kyc_verified: false,
    pic_path: '',
  });

  const [genderData, setGenderData] = useState('male');
  const [dataEntity, setDataEntity] = useState<IEntity[]>([]);
  const [dataClass, setDataClass] = useState<IClass[]>([]);
  const [allselectedfiles, handleFileChanges] = useState<File[]>([]);
  const [universityData, setUniversityData] = useState<UniversityRep0oDTO[]>(
    [],
  );
  const [selectedEntity, setSelectedEntity] = useState('');
  const [institutionsData, setInstitutionsData] = useState<InstituteRep0oDTO[]>(
    [],
  );
  const [coursesData, setCoursesData] = useState<CourseRep0oDTO[]>([]);
  const [filteredcoursesData, setFilteredCoursesData] = useState<
    CourseRep0oDTO[]
  >([]);
  const [totleSubject, setTotleSubject] = useState<SubjectRep0oDTO[]>([]);
  const exactYearsAgo = dayjs()?.subtract(18, 'year');
  const minSelectableDate = dayjs('01/01/1920');
  const [roleId, setRoleId] = useState('c848bc42-0e62-46b1-ab2e-2dd4f9bef546');
  const [selectedClassName, setSelectedClassName] = useState('col-12');
  const [filteredInstitute, setFiteredInstitute] = useState<
    InstituteRep0oDTO[]
  >([]);
  const [semesterData, setSemesterData] = useState<SemesterRep0oDTO[]>([]);

  const [dob_error, setDob_error] = useState<boolean>(false);
  const [first_name_error, setFirst_name_error] = useState<boolean>(false);
  const [last_name_error, setLast_name_error] = useState<boolean>(false);
  const [institute_name_error, setInstitute_name_error] =
    useState<boolean>(false);
  const [mobile_no_error, setMobile_no_error] = useState<boolean>(false);
  const [pincode_error, setPincode_error] = useState<boolean>(false);
  const [address_error, setAddress_error] = useState<boolean>(false);
  const [district_error, setDistrict_error] = useState<boolean>(false);
  const [city_error, setCity_error] = useState<boolean>(false);
  const [state_error, setState_error] = useState<boolean>(false);
  const [country_error, setCountry_error] = useState<boolean>(false);
  const [universityError, setUniversityError] = useState<boolean>(false);
  const [experience_error, setExperience_error] = useState<boolean>(false);

  const [teacherId, setTeacherId] = useState('');
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

  useEffect(() => {
    getTeacherProfileInfo();
    getEntity();
    // getInstitutelist();
    getUniversity();
    getSemester();
    getClasslist();
    getRole();
  }, []);
  const getRole = () => {
    getData(`${Rolelist}`)
      .then((data) => {
        if (data.data) {
          const filerRoleId = data.data.find(
            (role: any) => role.role_name === 'Teacher',
          ).id;
          setRoleId(filerRoleId);
        }
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  const getClasslist = () => {
    getData(`${ClassURL}`)
      .then((data) => {
        if (data.data) {
          setDataClass(data?.data);
        }
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  const getSubjects = async (type: string): Promise<any> => {
    try {
      const url = type === 'College' ? getSubjectCollege : getsubjectSchool;
      const data = await getData(url);

      if (data?.data) {
        setTotleSubject(data.data);
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

  const getCourses = (instituteId: any) => {
    getData(`${CourseURL}`)
      .then((data: { data: CourseRep0oDTO[] }) => {
        if (data.data) {
          setCoursesData(data?.data);
          const filtredCourses = data.data.filter(
            (course) => course.institution_id === instituteId,
          );
          setFilteredCoursesData(filtredCourses);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  const getInstitutelist = async (entityId: any) => {
    getData(`${InstituteURL}`)
      .then((data) => {
        const fiteredInstitutedata = data.data.filter(
          (institute: any) =>
            institute.is_active === 1 &&
            institute.is_approve === true &&
            institute.entity_id === entityId,
        );
        if (data.data) {
          setInstitutionsData(fiteredInstitutedata);
          setFiteredInstitute(fiteredInstitutedata);
        }
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        }
      });
  };
  const getEntity = () => {
    getData(`${InstituteEntityURL}`)
      .then((data: { data: IEntity[] }) => {
        const filteredData = data?.data.filter(
          (entity) => entity.is_active === 1,
        );
        setDataEntity(filteredData);
        // setDataEntity(data?.data)
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        }
      });
  };
  const getUniversity = () => {
    getData(`${UniversityURL}`)
      .then((data) => {
        if (data.data) {
          setUniversityData(data?.data);
        }
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  const getTeacherProfileInfo = async () => {
    try {
      getData(`/teacher/getbyloginid/${teacherLoginId}`).then(async (data) => {
        if (data?.status === 200) {
          setTeacherData(data.data);
          setGenderData(data.data.gender);
          handleFileChanges(data?.data?.documents);
          setTeacherId(data.data.teacher_id);
          if (data.data.university_id !== 'None') {
            const allSubject: SubjectRep0oDTO[] = await getSubjects('College');
            const allsemesters: SemesterRep0oDTO[] = await getSemester();
            setSelectedEntity('College');
            getCourses(data.data.institution_id);
            const output: Boxes[] = Object.keys(
              data.data.course_semester_subjects,
            ).flatMap((CourseKey) =>
              Object.keys(data.data.course_semester_subjects[CourseKey]).map(
                (semester_number) => ({
                  course_id: CourseKey,
                  semester_number: semester_number,
                  subjects:
                    data.data.course_semester_subjects[CourseKey][
                      semester_number
                    ],
                  filteredSemesters: allsemesters.filter(
                    (item) => item.course_id == CourseKey,
                  ),
                  filteredSubjects: allSubject.filter(
                    (item) =>
                      item.semester_number == semester_number &&
                      item.course_id === CourseKey,
                  ),
                }),
              ),
            );
            setBoxes(output);
          } else {
            getSubjects('School');
            setSelectedEntity('School');
            const allSubject: SubjectRep0oDTO[] = await getSubjects('School');
            const output: BoxesForSchool[] = Object.keys(
              data.data.class_stream_subjects,
            ).flatMap((classKey) =>
              Object.keys(data.data.class_stream_subjects[classKey]).map(
                (stream) => ({
                  stream: stream,
                  subjects: data.data.class_stream_subjects[classKey][stream],
                  class_id: classKey,
                  is_Stream: stream !== 'general',
                  selected_class_name: stream === 'general' ? 'col-6' : 'col-4',
                  filteredSubjects:
                    stream == 'general'
                      ? allSubject.filter((item) => item.class_id === classKey)
                      : allSubject.filter(
                          (item) =>
                            item.class_id === classKey &&
                            item.stream === stream,
                        ),
                }),
              ),
            );
            setBoxesForSchool(output);
          }
          if (data.data.stream) {
            setSelectedClassName('col-6');
          }
          getInstitutelist(data.data.entity_id);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (
      name === 'first_name' &&
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim())
    ) {
      setFirst_name_error(true);
    } else {
      setFirst_name_error(false);
    }
    if (
      name === 'last_name' &&
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim())
    ) {
      setLast_name_error(true);
    } else {
      setLast_name_error(false);
    }
    if (name === 'gender') {
      setGenderData(value);
    }
    if (name === 'phone' && !/^(?!0{10})[0-9]{10}$/.test(value)) {
      setMobile_no_error(true);
    } else {
      setMobile_no_error(false);
    }
    if (name === 'pincode' && !/^(?!0{6})[0-9]{6}$/.test(value)) {
      setPincode_error(true);
    } else {
      setPincode_error(false);
    }

    if (
      name === 'address' &&
      !/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(value)
    ) {
      setAddress_error(true);
    } else {
      setAddress_error(false);
    }
    if (
      name === 'district' &&
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value)
    ) {
      setDistrict_error(true);
    } else {
      setDistrict_error(false);
    }
    if (
      name === 'city' &&
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value)
    ) {
      setCity_error(true);
    } else {
      setCity_error(false);
    }
    if (name === 'experience' && !/^\d+$/.test(value)) {
      setExperience_error(true);
    } else {
      setExperience_error(false);
    }
    setTeacherData({ ...teacherData, [name]: value });
  };

  const handleDate = (date: Dayjs | null) => {
    if (date && date.isValid() && date >= minSelectableDate) {
      if (date && date.isBefore(exactYearsAgo, 'day')) {
        setTeacherData((values) => ({ ...values, dob: date }));
        setDob_error(false);
      } else {
        setDob_error(true);
      }
    } else {
      setDob_error(true);
    }
  };

  const handleSelect = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name === 'entity_id') {
      dataEntity.map((item) => {
        if (String(item.id) == value) {
          setSelectedEntity(item.entity_type);
          getSubjects(item.entity_type);
        }
      });
    }
    if (name === 'institution_id' && value === '') {
      setInstitute_name_error(true);
    } else {
      if (name === 'institution_id') {
        const filteredCourse = coursesData.filter(
          (course) => course.institution_id === value,
        );
        setFilteredCoursesData(filteredCourse);
      }
      setInstitute_name_error(false);
    }

    if (name === 'class_id') {
      const selectedClass = dataClass.find(
        (item) => String(item.id) === value,
      )?.class_name;
      if (selectedClass === 'class_11' || selectedClass === 'class_12') {
        setSelectedClassName('col-6');
      } else {
        setSelectedClassName('col-12');
      }
    }
    if (name === 'university_id') {
      const filteredInstitute = institutionsData.filter(
        (item) => item.university_id === value,
      );
      setUniversityError(false);
      setFiteredInstitute(filteredInstitute);
    }
    setTeacherData({ ...teacherData, [name]: value });
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
            (item) => String(item.id) === value,
          )?.class_name;

          setSelectedClassName(
            selectedClass === 'class_11' || selectedClass === 'class_12'
              ? 'col-4'
              : 'col-6',
          );

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
            stream: value.toString().toLowerCase(),
            filteredSubjects,
            subjects: [],
          };
        }

        return updatedBox;
      }),
    );
  };
  const handleInputChangecountry = (val: string, name: string) => {
    if (name === 'state' && val === '') {
      setState_error(true);
    } else {
      setState_error(false);
    }
    if (name === 'country' && val === '') {
      setCountry_error(true);
    } else {
      setCountry_error(false);
    }
    setTeacherData((teacher) => ({ ...teacher, [name]: val }));
    if (name === 'country') {
      setTeacherData((prevState) => ({ ...prevState, ['state']: '' }));
    }
  };
  const handleSubmit = () => {
    if (!/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(teacherData.address)) {
      setAddress_error(true);
      return;
    }
    if (teacherData.institution_id === '') {
      setInstitute_name_error(true);
      return;
    }
    if (!teacherData?.dob) {
      setDob_error(true);
      return;
    }
    if (
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacherData.first_name.trim(),
      )
    ) {
      setFirst_name_error(true);
      return;
    }
    if (
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacherData.last_name.trim(),
      )
    ) {
      setLast_name_error(true);
      return;
    }
    if (!/^(?!0{10})[0-9]{10}$/.test(teacherData.phone)) {
      setMobile_no_error(true);
      return;
    }
    if (!/^(?!0{6})[0-9]{6}$/.test(teacherData.pincode)) {
      setPincode_error(true);
      return;
    }
    if (
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacherData.district.trim(),
      )
    ) {
      setDistrict_error(true);
      return;
    }
    if (
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacherData.city.trim(),
      )
    ) {
      setCity_error(true);
      return;
    }
    if (teacherData.state === '') {
      setState_error(true);
      return;
    }
    if (teacherData.country === '') {
      setCountry_error(true);
      return;
    }
    if (!/^\d+$/.test(teacherData.experience)) {
      setExperience_error(true);
      return;
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

    if (!valid) return;

    const formData = new FormData();
    formData.append('first_name', teacherData.first_name);
    formData.append('last_name', teacherData.last_name);
    formData.append('email_id', teacherData.email_id);
    formData.append('phone', teacherData.phone);
    formData.append('address', teacherData.address);
    formData.append('district', teacherData.district);
    formData.append('city', teacherData.city);
    formData.append('pincode', teacherData.pincode);
    formData.append(
      'dob',
      teacherData.dob ? dayjs(teacherData.dob).format('YYYY-MM-DD') : '',
    );
    formData.append('role_id', roleId);
    formData.append('gender', teacherData.gender);
    formData.append('entity_id', teacherData.entity_id);
    formData.append('institution_id', teacherData.institution_id || '');
    formData.append('experience', teacherData.experience);
    formData.append('qualification', teacherData.qualification);
    formData.append('state', teacherData.state);
    formData.append('country', teacherData.country);

    // Conditionally append properties
    if (selectedEntity === 'College') {
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

          return acc;
        },
        {} as Record<string, Record<string, string[]>>,
      );
      formData.append('university_id', teacherData.university_id || '');
      formData.append(
        'course_semester_subjects',
        JSON.stringify(course_semester_subjects),
      );
    }

    if (selectedEntity === 'School') {
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

          acc[class_id][streamKey] = [
            ...new Set([...acc[class_id][streamKey], ...subjects]),
          ];

          return acc;
        },
        {} as Record<string, Record<string, string[]>>,
      );

      formData.append(
        'class_stream_subjects',
        JSON.stringify(class_stream_subjects),
      );
    }

    try {
      putData(`/teacher/edit/${teacherId}`, formData).then((response) => {
        if (response.status === 200) {
          toast.success(response.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        } else {
          toast.error(response.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const { files } = event.target;
  //     const formData = new FormData();

  //     if (files && files[0]) {
  //         const file: any = files[0];
  //         if (file.size > 3 * 1024 * 1024) {
  //             return;
  //         }
  //         if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
  //             return;
  //         }
  //         setSelectedFile(file.name);
  //         const reader: any = new FileReader();
  //         reader.onloadend = () => {
  //             setFilePreview(reader.result);
  //         };
  //         reader.readAsDataURL(file);
  //         formData.append('file', file);
  //         postFileData(`${'upload_file/upload'}`, formData)
  //             .then((data: any) => {
  //                 if (data?.status === 200) {
  //                     toast.success(data?.message, {
  //                         hideProgressBar: true,
  //                         theme: 'colored',
  //                         position: 'top-center',
  //                     });
  //                 } else if (data?.status === 404) {
  //                     toast.error(data?.message, {
  //                         hideProgressBar: true,
  //                         theme: 'colored',
  //                         position: 'top-center',
  //                     });
  //                 } else {
  //                     toast.error(data?.message, {
  //                         hideProgressBar: true,
  //                         theme: 'colored',
  //                         position: 'top-center',
  //                     });
  //                 }
  //             })
  //             .catch((e: any) => {
  //                 toast.error(e?.message, {
  //                     hideProgressBar: true,
  //                     theme: 'colored',
  //                     position: 'top-center',
  //                 });
  //             });
  //     }
  // };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && event.target.name !== 'icon') {
      const filesArray = Array.from(files); // Convert FileList to an array

      handleFileChanges((prevFiles) => [
        ...prevFiles, // Keep previously selected files
        ...filesArray, // Add newly selected files
      ]);
    } else {
      // setLogo(files);
    }
  };

  // const handleDocumentClick = (url: string) => {
  //     window.open(url, "_blank");
  // };
  const getSemester = async (): Promise<any[]> => {
    try {
      const data = await getData(`/semester/list`);

      if (data?.status === 200 && data?.data) {
        setSemesterData(data.data);
        return data.data; // Return the fetched semesters
      }

      return []; // Return an empty array if no data
    } catch (error) {
      console.error('Error fetching semester data:', error);
      return Promise.reject(error); // Reject the promise if an error occurs
    }
  };

  const handleRemove = (entity: string, index: number) => {
    if (entity.toLowerCase() === 'school') {
      setBoxesForSchool(boxesForSchool.filter((_, i) => i !== index));
    } else {
      setBoxes(boxes.filter((_, i) => i !== index));
    }
  };
  const [errorForClass_stream_subject, setErrorForClass_stream_subject] =
    useState<{
      [key: number]: {
        class_id_error: boolean;
        stream_error: boolean;
        subjects_error: boolean;
      };
    }>({});
  const [errorForCourse_semester_subject, setErrorForCourse_semester_subject] =
    useState<{
      [key: number]: {
        course_id_error: boolean;
        semester_number_error: boolean;
        subjects_error: boolean;
      };
    }>({});

  const handleAddmore = (eneity: string) => {
    if (eneity.toLowerCase() === 'school') {
      const newBox = {
        stream: '',
        class_id: '',
        selected_class_name: 'col-6',
        subjects: [],
      };
      setBoxesForSchool([...boxesForSchool, newBox]);
    } else {
      const newbox: Boxes = {
        semester_number: '',
        course_id: '',
        subjects: [],
      };

      setBoxes([...boxes, newbox]);
    }
  };
  console.log(selectedClassName);
  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="container mb-5">
          <div className="row align-items-center">
            <div className="col-lg-6 px-0">
              <h4 className="fs-1 fw-bold">
                My <span style={{ color: '#9943EC' }}> Profile </span>
              </h4>
            </div>
            <div className="row">
              <div className="card rounded-5 mt-3 bg-transparent-mb">
                <div className="card-body p-0">
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        First Name<span>*</span>
                      </label>

                      <TextField
                        autoComplete="off"
                        name="first_name"
                        className="form-control"
                        type="text"
                        onChange={handleChange}
                        value={teacherData.first_name}
                      />
                      {first_name_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small> Please enter a valid First name.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        Last Name<span>*</span>
                      </label>
                      <TextField
                        autoComplete="off"
                        name="last_name"
                        className="form-control"
                        type="text"
                        onChange={handleChange}
                        value={teacherData.last_name}
                      />
                      {last_name_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid Last name.</small>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        Gender<span>*</span>
                      </label>
                      <br />
                      <FormControl>
                        <RadioGroup
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="gender"
                          value={genderData}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value="male"
                            control={<Radio />}
                            label="Male"
                          />
                          <FormControlLabel
                            value="female"
                            control={<Radio />}
                            label="Female"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        Date Of Birth<span>*</span>
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={[
                            'DatePicker',
                            'MobileDatePicker',
                            'DesktopDatePicker',
                            'StaticDatePicker',
                          ]}
                        >
                          <DemoItem>
                            <DatePicker
                              name="dob"
                              value={dayjs(teacherData?.dob)}
                              onChange={handleDate}
                              format="DD/MM/YYYY"
                              minDate={minSelectableDate}
                              maxDate={exactYearsAgo}
                            />
                          </DemoItem>
                        </DemoContainer>
                      </LocalizationProvider>
                      {dob_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid Date of Birth.</small>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        Mobile Number<span>*</span>
                      </label>
                      <TextField
                        autoComplete="off"
                        name="phone"
                        className="form-control"
                        type="text"
                        onChange={handleChange}
                        value={teacherData.phone}
                      />
                      {mobile_no_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small> Please enter a valid Mobile Number.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        Email Id<span>*</span>
                      </label>
                      <TextField
                        autoComplete="off"
                        name="email_id"
                        className="form-control"
                        type="text"
                        disabled
                        onChange={handleChange}
                        value={teacherData.email_id}
                      />
                    </div>
                  </div>
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-6 col-12 mb-3">
                      <label className={`col-form-label`}>
                        Country<span>*</span>
                      </label>
                      <CountryDropdown
                        classes="form-select custom-dropdown"
                        defaultOptionLabel={teacherData.country}
                        value={teacherData.country || ''}
                        onChange={(e: string) =>
                          handleInputChangecountry(e, 'country')
                        }
                      />
                      {country_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please select a Country.</small>
                        </p>
                      )}
                    </div>

                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        State<span>*</span>
                      </label>
                      <RegionDropdown
                        data-testid="perStateDropdown"
                        classes="form-select custom-dropdown"
                        defaultOptionLabel={teacherData.state || ''}
                        country={teacherData.country || ''}
                        value={teacherData.state || ''}
                        // onChange={(val) => setRegion(val)}
                        onChange={(e: string) =>
                          handleInputChangecountry(e, 'state')
                        }
                      />
                      {state_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please select a State.</small>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        District<span>*</span>
                      </label>
                      <TextField
                        autoComplete="off"
                        name="district"
                        className="form-control"
                        type="text"
                        onChange={handleChange}
                        value={teacherData.district}
                      />
                      {district_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid District Name.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        City<span>*</span>
                      </label>
                      <TextField
                        autoComplete="off"
                        name="city"
                        className="form-control"
                        type="text"
                        onChange={handleChange}
                        value={teacherData.city}
                      />
                      {city_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid City Name.</small>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        Address<span>*</span>
                      </label>
                      <TextField
                        autoComplete="off"
                        name="address"
                        className="form-control"
                        type="text"
                        onChange={handleChange}
                        value={teacherData.address}
                      />
                      {address_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid Address.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        Pincode<span>*</span>
                      </label>
                      <TextField
                        autoComplete="off"
                        name="pincode"
                        className="form-control"
                        type="text"
                        onChange={handleChange}
                        value={teacherData.pincode}
                      />
                      {pincode_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid Pincode</small>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        Entity<span>*</span>
                      </label>

                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Entity *
                        </InputLabel>
                        <Select
                          onChange={(e: SelectChangeEvent<string>) =>
                            handleSelect(e)
                          }
                          label="Entity"
                          name="entity_id"
                          value={teacherData?.entity_id}
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
                          {dataEntity.map((item, idx) => (
                            <MenuItem
                              value={item.id}
                              key={`${item.entity_type}-${idx + 1}`}
                              sx={{
                                backgroundColor: inputfield(namecolor),
                                color: inputfieldtext(namecolor),
                                '&:hover': {
                                  backgroundColor: inputfieldhover(namecolor),
                                },
                              }}
                            >
                              {item.entity_type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    {selectedEntity.toLowerCase() === 'college' ? (
                      <div className="col-md-6 col-12 mb-3">
                        <label className="col-form-label">
                          University Name<span>*</span>
                        </label>
                        <FormControl fullWidth>
                          <InputLabel id="university_id">
                            University Name
                          </InputLabel>
                          <Select
                            labelId="institution_id"
                            id="demo2-multiple-name"
                            name="university_id"
                            label="University Name"
                            onChange={handleSelect}
                            value={teacherData?.university_id}
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
                            {universityData.map((item) => (
                              <MenuItem
                                key={item.id}
                                value={item.university_id}
                                sx={{
                                  backgroundColor: inputfield(namecolor),
                                  color: inputfieldtext(namecolor),
                                  '&:hover': {
                                    backgroundColor: inputfieldhover(namecolor),
                                  },
                                }}
                              >
                                {item.university_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {universityError === true && (
                          <p className="error-text " style={{ color: 'red' }}>
                            <small>Please select an University name.</small>
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="col-md-6 col-12 mb-3">
                        <label className="col-form-label">
                          Institution Name<span>*</span>
                        </label>
                        <FormControl fullWidth>
                          <InputLabel id="institution_id">Institute</InputLabel>
                          <Select
                            labelId="institution_id"
                            id="demo2-multiple-name"
                            name="institution_id"
                            label="Institute"
                            onChange={handleSelect}
                            value={teacherData?.institution_id}
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
                            {filteredInstitute.map((item) => (
                              <MenuItem
                                key={item.id}
                                value={item.id}
                                sx={{
                                  backgroundColor: inputfield(namecolor),
                                  color: inputfieldtext(namecolor),
                                  '&:hover': {
                                    backgroundColor: inputfieldhover(namecolor),
                                  },
                                }}
                              >
                                {item.institution_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {institute_name_error && (
                          <p className="error-text " style={{ color: 'red' }}>
                            <small>Please select an Institute name.</small>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedEntity.toLowerCase() === 'college' && (
                    <div className="row d-flex justify-content-center">
                      <div className="col-md-12 col-12 mb-3">
                        <label className="col-form-label">
                          Institution Name<span>*</span>
                        </label>
                        <FormControl fullWidth>
                          <InputLabel id="institution_id">Institute</InputLabel>
                          <Select
                            labelId="institution_id"
                            id="demo2-multiple-name"
                            name="institution_id"
                            label="Institute"
                            onChange={handleSelect}
                            value={teacherData?.institution_id}
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
                            {filteredInstitute.map((item) => (
                              <MenuItem
                                key={item.id}
                                value={item.id}
                                sx={{
                                  backgroundColor: inputfield(namecolor),
                                  color: inputfieldtext(namecolor),
                                  '&:hover': {
                                    backgroundColor: inputfieldhover(namecolor),
                                  },
                                }}
                              >
                                {item.institution_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {institute_name_error && (
                          <p className="error-text " style={{ color: 'red' }}>
                            <small>Please select an Institute name.</small>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        Experience(Yr)<span>*</span>
                      </label>
                      <TextField
                        autoComplete="off"
                        name="experience"
                        className="form-control"
                        type="number"
                        onChange={handleChange}
                        inputProps={{ min: '0' }}
                        value={teacherData.experience}
                      />
                      {experience_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>
                            Please enter a valid Teaching Experience.
                          </small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                      <label className="col-form-label">
                        Qualification<span>*</span>
                      </label>
                      <FormControl fullWidth>
                        <InputLabel id="demo-multiple-name-label">
                          Qualification
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo1-multiple-name"
                          name="qualification"
                          onChange={handleSelect}
                          value={teacherData.qualification}
                          input={<OutlinedInput label="Qualification" />}
                        >
                          {qualifications.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {/* {qualifications_error && (
                                                <p className='error-text' style={{ color: 'red' }}>
                                                    <small>Please select a Qualification</small>
                                                </p>
                                            )

                                            } */}
                    </div>
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
                              {filteredcoursesData.map((course) => (
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
                              {box.filteredSemesters?.map((item) => (
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
                              multiple
                              name="subjects"
                              value={box.subjects || []}
                              onChange={(event: any) =>
                                handelSubjectBoxChange(event, index)
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
                              {box.filteredSubjects?.map((subject: any) => (
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
                          {errorForCourse_semester_subject[index]
                            ?.subjects_error && (
                            <p className="error-text" style={{ color: 'red' }}>
                              <small>Please select at least one subject.</small>
                            </p>
                          )}
                        </div>
                        <div>
                          {}
                          {(selectedEntity.toLowerCase() === 'college' ||
                            selectedEntity.toLowerCase() === 'school') &&
                            ((boxes.length === 1 && index === 0) ||
                              (boxes.length > 1 &&
                                index === boxes.length - 1)) && (
                              <AddOutlinedIcon
                                className="m-2"
                                onClick={() => handleAddmore(selectedEntity)}
                              />
                            )}
                          {index > 0 && (
                            <DeleteOutlinedIcon
                              onClick={() =>
                                handleRemove(selectedEntity, index)
                              }
                              className="m-2"
                            />
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
                                {stream.map((item) => (
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
                              {box.filteredSubjects?.map((subject: any) => (
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

                        <div>
                          {(selectedEntity.toLowerCase() === 'college' ||
                            selectedEntity.toLowerCase() === 'school') &&
                            ((boxesForSchool.length === 1 && index === 0) ||
                              (boxesForSchool.length > 1 &&
                                index === boxesForSchool.length - 1)) && (
                              <AddOutlinedIcon
                                className="m-2"
                                onClick={() => handleAddmore(selectedEntity)}
                              />
                            )}
                          {index > 0 && (
                            <DeleteOutlinedIcon
                              onClick={() =>
                                handleRemove(selectedEntity, index)
                              }
                              className="m-2"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  <div className="row d-flex justify-content-between">
                    <div className="col-md-6 col-12 mb-5">
                      <label className="col-form-label">
                        {' '}
                        Document<span>* </span>
                      </label>{' '}
                      <UploadBtn
                        label="Upload Documents"
                        name="document"
                        accept=".pdf, .jpg, .jpeg, .png, .gif"
                        handleFileChange={handleFileChange}
                      />
                      <div>
                        {allselectedfiles.length > 0 && (
                          <ul>
                            {allselectedfiles.map((file, index) => (
                              <li key={index}>
                                {file.name ? file.name : String(file)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      {' '}
                      update
                    </button>
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
export default TeacherProfile;
