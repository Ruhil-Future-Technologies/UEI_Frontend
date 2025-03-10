/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import gLogo from '../../assets/img/logo-white.svg';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  ListItemText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import {
  fieldIcon,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from '../../utils/helpers';
import NameContext from '../Context/NameContext';
import {
  CourseRep0oDTO,
  IClass,
  IEntity,
  InstituteRep0oDTO,
  SemesterRep0oDTO,
  SubjectRep0oDTO,
  UniversityRep0oDTO,
} from '../../Components/Table/columns';
import useApi from '../../hooks/useAPI';
import {
  QUERY_KEYS,
  QUERY_KEYS_CLASS,
  QUERY_KEYS_COURSE,
  QUERY_KEYS_ROLE,
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL /* QUERY_KEYS_ROLE*/,
  QUERY_KEYS_UNIVERSITY,
} from '../../utils/const';
import { toast } from 'react-toastify';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs';
import UploadBtn from '../../Components/UploadBTN/UploadBtn';
import OtpCard from '../../Components/Dailog/OtpCard';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { BackArrowCircle } from '../../assets';
import { Step, StepLabel, Stepper, Typography, Box } from '@mui/material';
import Link from '@mui/material/Link';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import WestIcon from '@mui/icons-material/West';

export interface Teacher {
  first_name: string;
  last_name: string;
  gender: string;
  dob: Dayjs | null;
  phone: string;
  email_id: string;
  qualification: string;
  documents?: File[]; // Updated from 'document' to 'documents'
  role_id: string; // UUID for teacher role
  subjects: string[]; // Array of UUIDs for subjects
  entity_id: string; // UUID
  school_name: string;
  institution_id?: string; // UUID
  university_id?: string; // UUID
  class_id?: string; // UUID
  experience: string;
  address: string;
  country: string;
  stream: string;
  semester_id?: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  course_id: string;
  is_verified: boolean;
  is_kyc_verified: boolean;
  pic_path?: string; // Optional profile picture path
}

export const qualifications = [
  // Bachelor's Degrees
  'B.Tech',
  'B.E',
  'B.Sc',
  'B.Com',
  'B.A',
  'BBA',
  'BCA',
  'MBBS',
  'B.Pharm',
  'Diploma',
  'ITI',
  'B.Arch',
  'B.Des',
  'BMS',
  'BFA',
  'LLB (5-Year Integrated)',
  'Hotel Management',
  'Nursing',
  'Paramedical Courses',
  'B.Voc',
  'B.Ed (Integrated)',
  'BASLP',
  'Bachelor of Fine Arts',
  'Bachelor of Social Work',
  'B.Plan',

  // Master's Degrees
  'M.Tech',
  'M.E',
  'M.Sc',
  'M.Com',
  'M.A',
  'MBA',
  'MCA',
  'LLM',
  'M.Pharm',
  'Master of Design (M.Des)',
  'Master of Architecture (M.Arch)',
  'Master of Fine Arts (MFA)',
  'Master of Social Work (MSW)',
  'Master of Public Health (MPH)',
  'Master of Hotel Management (MHM)',

  // Doctorate Degrees
  'Ph.D.',
  'Doctor of Science (D.Sc)',
  'Doctor of Literature (D.Litt)',
  'Doctor of Medicine (MD)',
  'Doctor of Pharmacy (Pharm.D)',
  'Doctor of Business Administration (DBA)',
];
const stream = ['Science', 'Commerce', 'Arts'];

export interface Boxes {
  semester_number: string;
  subjects: string[];
  course_id: string;
  filteredSemesters?: any[];
  filteredSubjects?: any[];
}
export interface BoxesForSchool {
  stream?: string;
  subjects: string[];
  class_id: string;
  filteredStream?: any[];
  filteredSubjects?: any[];
  is_Stream?: boolean;
  selected_class_name?: string;
}

const TeacherRegistrationPage = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const navigate = useNavigate();
  const { postRegisterData, getForRegistration, postDataJson } = useApi();

  const InstituteURL = QUERY_KEYS.GET_INSTITUTES;
  const InstituteEntityURL = QUERY_KEYS.ENTITY_LIST;
  const getsubjectSchool = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;
  const getSubjectCollege = QUERY_KEYS_SUBJECT.GET_SUBJECT;
  const Rolelist = QUERY_KEYS_ROLE.GET_ROLE;
  const getTeacherURL = QUERY_KEYS.GET_TEACHER;
  const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;
  const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;
  const UniversityURL = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;

  const [dataEntity, setDataEntity] = useState<IEntity[]>([]);
  const [allselectedfiles, setAllSelectedfiles] = useState<File[]>([]);
  const [dataInstitute, setDataInstitute] = useState<InstituteRep0oDTO[]>([]);
  const [filteredInstitute, setFiteredInstitute] = useState<
    InstituteRep0oDTO[]
  >([]);
  const [dataCourse, setDataCourse] = useState<CourseRep0oDTO[]>([]);
  const [filteredCourse, FilteredDataCourse] = useState<CourseRep0oDTO[]>([]);
  const [dataClass, setDataClass] = useState<IClass[]>([]);
  const [genderData, setGenderData] = useState('male');
  const [dobset_col, setdobset_col] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [totleSubject, setTotleSubject] = useState<SubjectRep0oDTO[]>([]);
  const [popupTermandCondi, setPopupTermandcondi] = useState(false);
  const [popupOtpCard, setPopupOtpCard] = useState(false);
  const [CheckTermandcondi, setCheckTermandcondi] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClassName, setSelectedClassName] = useState('col-6');
  const [semesterData, setSemesterData] = useState<SemesterRep0oDTO[]>([]);
  const [universityData, setUniversityData] = useState<UniversityRep0oDTO[]>(
    [],
  );
  const [universityError, setUniversityError] = useState<boolean>(false);

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

  const [roleId, setRoleId] = useState('c848bc42-0e62-46b1-ab2e-2dd4f9bef546');
  const [teacher, setTeacher] = useState<Teacher>({
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
    semester_id: '',
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
    university_id: '',
    school_name: '',
    documents: [],
    is_verified: false,
    is_kyc_verified: false,
    pic_path: '',
  });
  const [first_name_error, setFirst_name_error] = useState(false);
  const [last_name_error, setLast_name_error] = useState(false);
  const [email_id_error, setEmail_id_error] = useState(false);
  const [phone_no_error, setPhone_no_error] = useState(false);
  const [address_error, setAddress_error] = useState(false);
  const [country_error, setCountry_error] = useState(false);
  const [state_error, setState_error] = useState(false);
  const [district_error, setDistrict_error] = useState(false);
  const [city_error, setCity_error] = useState(false);
  const [pincode_error, setPincode_error] = useState(false);
  const [qualifications_error, setQualifications_error] = useState(false);
  const [teaching_experience_error, setTeaching_experience_error] = useState(false);
  const [entity_error, setEntity_error] = useState(false);
  const [institution_id_error, setInstitution_id_error] = useState(false);
  const [document_error, setDocument_error] = useState(false);

  const exactSixYearsAgo = dayjs()
    .subtract(18, 'year')
    .subtract(1, 'day')
    .endOf('day');
  const minSelectableDate = dayjs('01/01/1900');

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

  const getCourses = () => {
    getForRegistration(`${CourseURL}`)
      .then((data) => {
        if (data.status) {
          setDataCourse(data?.data?.course_data);
        }
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const getEntity = () => {
    getForRegistration(`${InstituteEntityURL}`)
      .then((data) => {
        console.log(data.data.entityes_data);
        const filteredData = data?.data?.entityes_data.filter(
          (entity: any) => entity.is_active === true,
        );
        setDataEntity(filteredData);
        // setDataEntity(data?.data)
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const getInstitutelist = async () => {
    getForRegistration(`${InstituteURL}`)
      .then((data) => {
        const fiteredInstitutedata = data.data.filter(
          (institute: any) =>
            institute.is_active && institute.is_approve,
        );
        if (data.status) {
          setDataInstitute(fiteredInstitutedata);
        }
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const getClasslist = () => {
    getForRegistration(`${ClassURL}`)
      .then((data) => {
        if (data.status) {
          setDataClass(data?.data?.classes_data);
        }
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const getRole = () => {
    getForRegistration(`${Rolelist}`)
      .then((data) => {
        if (data.data) {
          const filerRoleId = data?.data?.rolees_data?.find(
            (role: any) => (role.role_name).toLowerCase() === 'teacher',
          ).id;
          setRoleId(filerRoleId); // setRoleData(data?.data);
        }
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const getSubjects = (type: string) => {
    if (type === 'college') {
      getForRegistration(`${getSubjectCollege}`)
        .then((data) => {
          if (data.status) {
            setTotleSubject(data?.data?.subjects_data);
          }
        })
        .catch((e) => {
          if (e?.response?.code === 401) {
            navigate('/');
          }
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    } else {
      getForRegistration(`${getsubjectSchool}`)
        .then((data) => {
          if (data.status) {
            setTotleSubject(data?.data?.subjects_data);
          }
        })
        .catch((e) => {
          if (e?.response?.code === 401) {
            navigate('/');
          }
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    }
  };

  const getSemester = () => {
    try {
      getForRegistration(`/semester/list`)
        .then((data) => {
          if (data.status) {
            setSemesterData(data.data?.semesters_data);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getUniversity = () => {
    getForRegistration(`${UniversityURL}`)
      .then((data) => {
        if (data.status) {
          setUniversityData(data?.data?.universities_data);
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

  useEffect(() => {
    getInstitutelist();
    getEntity();
    getCourses();
    getClasslist();
    getSemester();
    getRole();
    getUniversity();
  }, []);

  const handleSelect = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setTeacher({ ...teacher, [name]: value });
    if (name === 'entity_id') {
      dataEntity.map((item) => {
        if (String(item.id) == value) {
          setSelectedEntity(item.entity_type);
          getSubjects(item.entity_type);
        }
      });
    }

    if (name === 'institution_id') {
      const filteredDta = dataCourse.filter(
        (item) => String(item.institution_id) === value,
      );
      FilteredDataCourse(filteredDta);
    }

    if (name === 'entity_id') {
      console.log(dataInstitute)
      const filteredInstitute = dataInstitute.filter(
        (item) => item.entity_id === value,
      );
      console.log(filteredInstitute)
      setFiteredInstitute(filteredInstitute);
    }

    if (name === 'school_name') {
      const selectedSchool = dataInstitute.find(
        (item) => String(item.id) === value,
      )?.institute_name;
      setSelectedSchool(String(selectedSchool));
    }
    if (name === 'university_id') {
      console.log(dataInstitute);
      const filteredInstitute = dataInstitute.filter(
        (item) => item.university_id === value,
      );
      setUniversityError(false);
      setFiteredInstitute(filteredInstitute);
    }

    validation(name, value);
  };

  const validation = (name: string, value: string) => {
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

    if (name === 'email_id' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmail_id_error(true);
    } else {
      setEmail_id_error(false);
    }

    if (name === 'phone' && !/^(?!0{10})[0-9]{10}$/.test(value)) {
      setPhone_no_error(true);
    } else {
      setPhone_no_error(false);
    }

    if (
      name === 'address' &&
      !/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(value)
    ) {
      setAddress_error(true);
    } else {
      setAddress_error(false);
    }

    if (name === 'country' && value === '') {
      setCountry_error(true);
    } else {
      setCountry_error(false);
    }

    if (name === 'state' && value === '') {
      setState_error(true);
    } else {
      setState_error(false);
    }

    if (
      name === 'district' &&
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim())
    ) {
      setDistrict_error(true);
    } else {
      setDistrict_error(false);
    }

    if (
      name === 'city' &&
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim())
    ) {
      setCity_error(true);
    } else {
      setCity_error(false);
    }

    if (name === 'pincode' && !/^(?!0{6})[0-9]{6}$/.test(value)) {
      setPincode_error(true);
    } else {
      setPincode_error(false);
    }

    if (name === 'qualifications' && value === '') {
      setQualifications_error(true);
    } else {
      setQualifications_error(false);
    }

    if (name === 'experience' && !/^\d+$/.test(value)) {
      setTeaching_experience_error(true);
    } else {
      setTeaching_experience_error(false);
    }

    if (name === 'entity_id' && value === '') {
      setEntity_error(true);
    } else {
      setEntity_error(false);
    }

    if (name === 'institution_id' && value === '') {
      setInstitution_id_error(true);
    } else {
      setInstitution_id_error(false);
    }

    if (name === 'dob') {
      setdobset_col(teacher.dob === dayjs('dd-mm-yyyy'));
    }
  };

  const handelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'gender') {
      setGenderData(event.target.value);
    }
    const { name, value } = event.target;
    setTeacher({ ...teacher, [event.target.name]: event.target.value });

    validation(name, value);
  };

  const handleSubmit = () => {
    let valid1=false;
    if (teacher.entity_id == '') {
      setEntity_error(true)
      setUniversityError(true)
      setInstitution_id_error(true)
      valid1 = true;
    } else {
      setEntity_error(false)
    }
    if (!/^(?=.*[a-zA-Z .,&'()-])[a-zA-Z0-9 .,&'()-]+$/.test(teacher.institution_id || '')) {
      setInstitution_id_error(true);
      valid1 = true;
    } else {
      setInstitution_id_error(false);
    }

    if (selectedEntity.toLowerCase() === 'college' && teacher.university_id == '') {
      setUniversityError(true);
      valid1 = true;
    } else {
      setUniversityError(false);
    }
    if ( teacher.qualification === '') {
      valid1 = true;
      setQualifications_error(true);
    } else {
      setQualifications_error(false);
    }
    if (!/^\d+$/.test(teacher.experience)) {
      valid1 = true;
      setTeaching_experience_error(true);
    } else {
      setTeaching_experience_error(false);
    }

if(valid1) return;

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

      if (teacher.university_id === '') {
        valid = true;
        setUniversityError(true);
      }
    }

    if (!valid) return;
    if (!teacher.dob || !dayjs(teacher.dob).isValid()) {
      setdobset_col(true);
      return;
    }
    if (
      !first_name_error &&
      /^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacher.first_name.trim(),
      ) &&
      !last_name_error &&
      /^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacher.last_name.trim(),
      ) &&
      !email_id_error &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacher.email_id) &&
      !phone_no_error &&
      /^(?!0{10})[0-9]{10}$/.test(teacher.phone) &&
      !address_error &&
      /^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(teacher.address.trim()) &&
      !country_error &&
      !(teacher.country === '') &&
      !state_error &&
      !(teacher.state === '') &&
      !district_error &&
      /^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacher.district.trim(),
      ) &&
      !city_error &&
      /^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacher.city.trim(),
      ) &&
      !pincode_error &&
      /^(?!0{6})[0-9]{6}$/.test(teacher.pincode) &&
      !qualifications_error &&
      !(teacher.qualification === '') &&
      !teaching_experience_error &&
      /^\d+$/.test(teacher.experience) &&
      !institution_id_error &&
      !(teacher.institution_id === '')
    ) {
      const formData = new FormData();
      allselectedfiles.forEach((file) => {
        formData.append('documents[]', file);
      });

      formData.append('first_name', teacher.first_name);
      formData.append('last_name', teacher.last_name);
      formData.append('gender', genderData);
      formData.append(
        'dob',
        teacher.dob ? dayjs(teacher.dob).format('YYYY-MM-DD') : '',
      );
      formData.append('phone', teacher.phone);
      formData.append('email', teacher.email_id);
      formData.append('qualification', teacher.qualification);
      formData.append('entity_id', teacher.entity_id);
      formData.append('role_id', roleId);
      formData.append('experience', teacher.experience);
      formData.append('address', teacher.address);
      formData.append('country', teacher.country);
      formData.append('state', teacher.state);
      formData.append('district', teacher.district);
      formData.append('city', teacher.city);
      formData.append('pincode', teacher.pincode);
      formData.append('is_verified', 'False');

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
        formData.append('school_name', selectedSchool);
        formData.append(
          'institute_id',
          teacher.institution_id?.toString() || '',
        );
        if (selectedClassName === 'col-6') {
          formData.append('stream', teacher.stream);
        }
      } else {
        formData.append('university_id', teacher.university_id || '');
        formData.append(
          'institute_id',
          teacher.institution_id?.toString() || '',
        );
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
        formData.append(
          'course_semester_subjects',
          JSON.stringify(course_semester_subjects),
        );
      }
      const payload = {
        email: process.env.REACT_APP_SUPER_USER_EMAIL,
        password: process.env.REACT_APP_SUPER_USER_PASSWORD,
        user_type: "super_admin"
      }
      postDataJson(`auth/login`, payload).then((data) => {
        if (data.status) {
          const token = data.data.access_token;
          postRegisterData(getTeacherURL, formData, token)
            .then((response) => {
              if (response.status) {
                toast.success('Teacher registration request sent successfully', {
                  hideProgressBar: true,
                  theme: 'colored',
                });
                setPopupOtpCard(true);
              } else {
                toast.error(response.message, {
                  hideProgressBar: true,
                  theme: 'colored',
                });
              }
            })
            .catch((error) => {
                toast.error(error.response.data.message, {
                            hideProgressBar: true,
                            theme: 'colored',
                          });
            });
        }
      })
    } else {
      toast.error('validation error', {
        hideProgressBar: true,
        theme: 'colored',
      });
    }
  };

  
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      console.log(files, typeof files);
      setDocument_error(false);
    
      if (files && event.target.name !== "icon") {
        const filesArray = Array.from(files);
    
        setAllSelectedfiles((prevFiles) => [
          ...prevFiles, // Keep previously selected files
          ...filesArray, // Add newly selected files
        ]);
    
        // Reset the input field to allow selecting the same files again
        event.target.value = "";
      } else {
        // setLogo(files);
      }
    };

  const handleInputChangecountry = (val: string, name: string) => {
    setTeacher({ ...teacher, [name]: val });
    if (name === 'country') {
      setTeacher((prevState) => ({ ...prevState, ['state']: '' }));
    }
    validation(name, val);
  };

  const handleDate = (newDate: Dayjs | null) => {
    if (
      newDate &&
      newDate.isValid() &&
      newDate.isAfter(minSelectableDate, 'day')
    ) {
      if (
        newDate.isBefore(exactSixYearsAgo, 'day') ||
        newDate.isSame(exactSixYearsAgo, 'day')
      ) {
        setTeacher((values) => ({ ...values, dob: newDate }));
        setdobset_col(false);
      } else {
        setdobset_col(true);
      }
    } else {
      setdobset_col(true);
    }
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
          console.log(dataClass,value)
          const selectedClass = dataClass.find(
            (item) => String(item.id) == value,
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

  const handleClose = () => {
    setPopupTermandcondi(false);
  };

  const handleTermandCondi = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    setCheckTermandcondi(!isChecked);
  };
  const handleTACpopup = () => {
    setPopupTermandcondi(true);
  };

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
  const handleRemove = (entity: string, index: number) => {
    if (entity.toLowerCase() === 'school') {
      setBoxesForSchool(boxesForSchool.filter((_, i) => i !== index));
    } else {
      setBoxes(boxes.filter((_, i) => i !== index));
    }
  };
  const handleRemoveFile = (index: number) => {
    setAllSelectedfiles((previous) =>
      previous.filter((_, ind) => ind !== index),
    );
  };

  const steps = [
    {
      label: 'Personal Details',
      subline: 'Enter your entity details here',
      icon: <SchoolOutlinedIcon />,
    },
    {
      label: 'Address Details',
      subline: 'Enter your complete address',
      icon: <BusinessIcon />,
    },
    {
      label: 'Upload Documents',
      subline: 'Upload your documents',
      icon: <DriveFolderUploadIcon />,
    },
  ];
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    
    if (activeStep == 0) {
      let valid = false;
      if (!teacher.dob || !dayjs(teacher.dob).isValid()) {
        setdobset_col(true);
        valid = true;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacher.email_id.trim())) {
        setEmail_id_error(true);
        valid = true;
      } else {
        setEmail_id_error(false);
      }
      if (!/^(?!0{10})[0-9]{10}$/.test(teacher.phone.trim())) {
        setPhone_no_error(true);
        valid = true;
      } else {
        setPhone_no_error(false);
      }
      if (!/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(teacher.first_name.trim())
      ) {
        setFirst_name_error(true);
        valid = true;
      } else {
        setFirst_name_error(false);
      }

      if (!/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(teacher.last_name.trim())
      ) {
        setLast_name_error(true);
        valid = true;
      } else {
        setLast_name_error(false);
      }
      if (!valid) {
        setActiveStep((prevStep) => prevStep + 1);
      }

    } else if (activeStep == 1) {
      let valid = false;
      if (!/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(teacher.city.trim())) {
        setCity_error(true);
        valid = true;
      } else {
        setCity_error(false);
      }

      if (!/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(teacher.district.trim())) {
        setDistrict_error(true);
        valid = true;
      } else {
        setDistrict_error(false);
      }

      if (!/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(teacher.address.trim())) {
        setAddress_error(true);
        valid = true;
      } else {
        setAddress_error(false);
      }

      if (!/^(?!0{6})[0-9]{6}$/.test(teacher.pincode.trim())) {
        setPincode_error(true);
        valid = true;
      } else {
        setPincode_error(false);
      }
      if (teacher.country.trim() === '') {
        setCountry_error(true);
      } else {
        setCountry_error(false);
      }
      if (teacher.state.trim() === '') {
        setState_error(true);
      } else {
        setState_error(false);
      }

      if (!valid) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1)
    }

  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  const handleOtpSubmit = (otp: string) => {

    const payload = {
      email: teacher.email_id,
      otp: otp
    }
    postDataJson(`/auth/verify-otp`, payload).then((data) => {
      console.log(data);
      if (data.status === true) {
        setPopupOtpCard(false);
        alert('Wait for 24-48 hours, the Administrator will inform you.');
        window.location.reload();
      }
    })

  };
  return (
    <Box sx={{ width: '100%' }} className="Stepperform">
      <div className="p-lg-4 bg-primary-20 flex-column d-none d-lg-flex">
        <div className="logoui mb-4">
          <img src={gLogo} alt="" onClick={() => navigate('/signup')} />
          <span>Gyansetu</span>
        </div>

        <Stepper
          className="mt-5"
          activeStep={activeStep}
          orientation="vertical"
        >
          {steps.map(({ label, subline, icon }, index) => (
            <Step key={index}>
              <StepLabel icon={icon}>
                {label}
                <Typography variant="body2" className="opacity-50">
                  {subline}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="mt-auto d-flex justify-content-between ">
          <Link
            href="/"
            className="text-dark opacity-75 text-capitalize fs-14 d-flex align-items-center gap-2"
          >
            <WestIcon /> Back to login
          </Link>
        </div>
      </div>
      <Box>
        {activeStep === 0 && (
          <Box>
            <div className="without-login p-3">
              <div className="access1-card">
                <div className="card-body">
                  <div className="logoui mb-4 justify-content-center d-lg-none">
                    <img
                      src={gLogo}
                      alt=""
                      onClick={() => navigate('/signup')}
                    />
                    <span>Gyansetu</span>
                  </div>
                  <h3 className="text-center fw-bold">Register As Teacher</h3>
                  <p className="mb-lg-5 mb-4 text-center text-black-50">
                    Empower your institution—get started today!
                  </p>

                  <div className="row d-flex justify-content-center g-4">
                    <div className="col-md-6 col-12 ">
                      {/* <label className="col-form-label">
                        First Name<span>*</span>
                      </label> */}

                      <TextField
                        autoComplete="off"
                        name="first_name"
                        className="form-control"
                        type="text"
                        value={teacher.first_name}
                        onChange={handelChange}
                        label="First Name *"
                      />
                      {first_name_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small> Please enter a valid First name.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12 ">
                      {/* <label className="col-form-label">
                        Last Name<span>*</span>
                      </label> */}
                      <TextField
                        autoComplete="off"
                        name="last_name"
                        className="form-control"
                        type="text"
                        value={teacher.last_name}
                        onChange={handelChange}
                        label="Last Name *"
                      />
                      {last_name_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid Last name.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12 ">
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
                          onChange={handelChange}
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
                    <div className="col-md-6 col-12 ">
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
                              value={dayjs(teacher?.dob)}
                              onChange={handleDate}
                              format="DD/MM/YYYY"
                              minDate={minSelectableDate}
                              maxDate={exactSixYearsAgo}
                            />
                          </DemoItem>
                        </DemoContainer>
                      </LocalizationProvider>
                      {dobset_col === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid Date of Birth.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12">
                      {/* <label className="col-form-label">
                        Mobile Number<span>*</span>
                      </label> */}
                      <TextField
                        autoComplete="off"
                        name="phone"
                        className="form-control"
                        type="text"
                        value={teacher.phone}
                        onChange={handelChange}
                        label="Mobile Number*"
                      />
                      {phone_no_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small> Please enter a valid Mobile number.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12">
                      {/* <label className="col-form-label">
                        Email Id<span>*</span>
                      </label> */}
                      <TextField
                        autoComplete="off"
                        name="email_id"
                        className="form-control"
                        type="text"
                        value={teacher.email_id}
                        onChange={handelChange}
                        label="Email Id *"
                      />
                      {email_id_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid Email Id.</small>
                        </p>
                      )}
                    </div>

                    <div className="col-12">
                      <Button
                        className="btn btn-secondary w-100 mt-4 outsecbtn "
                        variant="contained"
                        onClick={handleNext}
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>

                      <Link
                        href="/"
                        className="text-dark opacity-75 d-lg-none text-capitalize mt-3 fs-14 d-flex align-items-center gap-2 justify-content-center"
                      >
                        <WestIcon /> Back to login
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <div className="without-login p-3">
              <div className="access1-card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center g-4 mb-4">
                    <div className="col-12">
                      <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                        <BackArrowCircle
                          onClick={handleBack}
                          role="button"
                          fontSize="small"
                        />{' '}
                        Address Details
                      </h5>
                    </div>
                  </div>

                  <div className="row d-flex justify-content-center g-4">
                    <div className="col-md-6 col-12 ">
                      <label className={`col-form-label`}>
                        Country<span>*</span>
                      </label>
                      <CountryDropdown
                        classes="form-select custom-dropdown"
                        defaultOptionLabel={teacher.country}
                        value={teacher.country || ''}
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

                    <div className="col-md-6 col-12 ">
                      <label className="col-form-label">
                        State<span>*</span>
                      </label>
                      <RegionDropdown
                        data-testid="perStateDropdown"
                        classes="form-select custom-dropdown"
                        defaultOptionLabel={teacher.state || ''}
                        country={teacher.country || ''}
                        value={teacher.state || ''}
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
                    <div className="col-md-6 col-12 ">
                      {/* <label className="col-form-label">
                        District<span>*</span>
                      </label> */}
                      <TextField
                        autoComplete="off"
                        name="district"
                        className="form-control"
                        type="text"
                        value={teacher.district}
                        onChange={handelChange}
                        label="District *"
                      />
                      {district_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid District name.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12 ">
                      {/* <label className="col-form-label">
                        City<span>*</span>
                      </label> */}
                      <TextField
                        autoComplete="off"
                        name="city"
                        value={teacher.city}
                        className="form-control"
                        type="text"
                        onChange={handelChange}
                        label="City *"
                      />
                      {city_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid City name.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12 ">
                      {/* <label className="col-form-label">
                        Address<span>*</span>
                      </label> */}
                      <TextField
                        autoComplete="off"
                        name="address"
                        className="form-control"
                        type="text"
                        value={teacher.address}
                        onChange={handelChange}
                        label="Address*"
                      />
                      {address_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid Address.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12 ">
                      {/* <label className="col-form-label">
                        Pincode<span>*</span>
                      </label> */}
                      <TextField
                        autoComplete="off"
                        name="pincode"
                        className="form-control"
                        type="text"
                        value={teacher.pincode}
                        onChange={handelChange}
                        label="pincode*"
                      />
                      {pincode_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid Pincode.</small>
                        </p>
                      )}
                    </div>

                    <div className="col-12">
                      <Box>
                        <Button
                          variant="contained"
                          className="btn btn-secondary w-100 outsecbtn mb-2"
                          onClick={handleNext}
                        >
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        )}
        {activeStep === 2 && (
          <Box>
            <div className="without-login p-3">
              <div className="access1-card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center g-4">
                    <div className="col-12">
                      <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                        <BackArrowCircle
                          onClick={handleBack}
                          role="button"
                          fontSize="small"
                        />{' '}
                        Documents & Logo
                      </h5>
                    </div>
                    <div className="col-md-6 col-12 ">
                      {/* <label className="col-form-label">
                        Entity<span>*</span>
                      </label> */}

                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Entity*</InputLabel>
                        <Select
                          onChange={(e: SelectChangeEvent<string>) => handleSelect(e)}
                          label="Entity"
                          name="entity_id"
                          value={teacher?.entity_id}
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
                      {entity_error && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please select an Entity.</small>
                        </p>
                      )}
                    </div>
                    {selectedEntity.toLowerCase() === 'college' ? (
                      <div className="col-md-6 col-12 mb-3">
                        {/* <label className="col-form-label">
                          University Name<span>*</span>
                        </label> */}
                        <FormControl fullWidth>
                          <InputLabel id="university_id">University Name*</InputLabel>
                          <Select
                            labelId="university_id"
                            id="demo2-multiple-name"
                            name="university_id"
                            label="University Name*"
                            onChange={handleSelect}
                            value={teacher.university_id}
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
                                value={item.id}
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
                        {/* <label className="col-form-label">
                          Institution Name<span>*</span>
                        </label> */}
                        <FormControl fullWidth>
                          <InputLabel id="institution_id">Institute*</InputLabel>
                          <Select
                            labelId="institution_id"
                            id="demo2-multiple-name"
                            name="institution_id"
                            label="Institute"
                            onChange={handleSelect}
                            value={teacher.institution_id}
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
                                {item.institute_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {institution_id_error === true && (
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
                        {/* <label className="col-form-label">
                  Institution Name<span>*</span>
                </label> */}
                        <FormControl fullWidth>
                          <InputLabel id="institution_id">Institute*</InputLabel>
                          <Select
                            labelId="institution_id"
                            id="demo2-multiple-name"
                            name="institution_id"
                            label="Institute*"
                            onChange={handleSelect}
                            value={teacher.institution_id}
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
                                {item.institute_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {institution_id_error === true && (
                          <p className="error-text " style={{ color: 'red' }}>
                            <small>Please select an Institute name.</small>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="row d-flex justify-content-center">
                    <div className="col-md-6 col-12 mb-3">
                      {/* <label className="col-form-label">
                Experience(Yr)<span>*</span>
              </label> */}

                      <TextField
                        placeholder='Teaching Experience'
                        autoComplete="off"
                        name="experience"
                        className="form-control"
                        type="number"
                        value={teacher.experience}
                        label="Teaching Experience*"
                        onChange={handelChange}
                        inputProps={{ min: '0' }}
                      />
                      {teaching_experience_error === true && (
                        <p className="error-text " style={{ color: 'red' }}>
                          <small>Please enter a valid Teaching Experience.</small>
                        </p>
                      )}
                    </div>
                    <div className="col-md-6 col-12 mb-3">
                      {/* <label className="col-form-label">
                Qualification<span>*</span>
              </label> */}
                      <FormControl fullWidth>
                        <InputLabel id="demo-multiple-name-label">
                          Qualification*
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-name-label"
                          id="demo1-multiple-name"
                          name="qualification"
                          onChange={handleSelect}
                          value={teacher.qualification}
                          input={<OutlinedInput label="Qualification" />}
                        >
                          {qualifications.map((item) => (
                            <MenuItem key={item} value={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {qualifications_error && (
                        <p className="error-text" style={{ color: 'red' }}>
                          <small>Please select a Qualification.</small>
                        </p>
                      )}
                    </div>
                  </div>
                  {selectedEntity.toLowerCase() === 'college' &&
                    boxes.length > 0 &&
                    boxes.map((box, index) => (
                      <div key={index} className="row d-flex justify-content-center">
                        {/* Course Selection */}
                        <div className="col-md-4 col-12 mb-3">
                          {/* <label className="col-form-label">
                            Course<span>*</span>
                          </label> */}
                          <FormControl fullWidth>
                            <InputLabel id={`course_id_${index}`}>Course*</InputLabel>
                            <Select
                              labelId={`course_id_${index}`}
                              id={`demo3-multiple-name-${index}`}
                              name="course_id"
                              label="Course*"
                              onChange={(event: any) =>
                                handelSubjectBoxChange(event, index)
                              }
                              value={box.course_id || ''}
                            >
                              {filteredCourse.map((course) => (
                                <MenuItem key={course.id} value={course.id}>
                                  {course.course_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {errorForCourse_semester_subject[index]?.course_id_error ===
                            true && (
                              <p className="error-text" style={{ color: 'red' }}>
                                <small>Please select Course name.</small>
                              </p>
                            )}
                        </div>

                        {/* Semester Selection */}
                        <div className="col-md-4 col-12 ">
                          {/* <label className="col-form-label">
                            Semester <span>*</span>
                          </label> */}
                          <FormControl fullWidth>
                            <InputLabel id={`semester_id_${index}`}>
                              Semester*
                            </InputLabel>
                            <Select
                              labelId={`semester_id_${index}`}
                              id={`semester_select_${index}`}
                              name="semester_number"
                              label="Semester*"
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
                        <div className="col-md-4 col-12 ">
                          {/* <label className="col-form-label">
                            Subjects Taught<span>*</span>
                          </label> */}
                          <FormControl fullWidth>
                            <InputLabel id={`subject_label_${index}`}>
                              Subject*
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
                          {(selectedEntity.toLowerCase() === 'college' ||
                            selectedEntity.toLowerCase() === 'school') &&
                            ((boxes.length === 1 && index === 0) ||
                              (boxes.length > 1 &&
                                index === boxes.length - 1)) && (
                              <AddCircleIcon
                                className="m-2 cursor-pointer"
                                onClick={() => handleAddmore(selectedEntity)}
                              />
                            )}
                          {index > 0 && (
                            <DeleteOutlinedIcon
                              onClick={() =>
                                handleRemove(selectedEntity, index)
                              }
                              className="m-2 cursor-pointer"
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
                        className="row d-flex justify-content-center mt-0 g-4"
                      >
                        {/* Class Selection */}
                        <div
                           className={box.selected_class_name}
                          //className="col-md-6 col-12"
                        >
                          {/* <label className="col-form-label">
                            Class<span>*</span>
                          </label> */}
                          <FormControl fullWidth>
                            <InputLabel id={`class_id_${index}`}>
                              Class*
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
                          <div className="col-md-4 col-12 ">
                            {/* <label className="col-form-label">
                              Stream Name<span>*</span>
                            </label> */}
                            <FormControl fullWidth>
                              <InputLabel id={`stream_id_${index}`}>
                                Stream Name*
                              </InputLabel>
                              <Select
                                labelId={`stream_id_${index}`}
                                id={`stream_select_${index}`}
                                name="stream"
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
                          {/* <label className="col-form-label">
                            Subjects Taught<span>*</span>
                          </label> */}
                          <FormControl fullWidth>
                            <InputLabel id={`subject_label_${index}`}>
                              Subject*
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
                              <AddCircleIcon
                                className="m-2 cursor-pointer"
                                onClick={() => handleAddmore(selectedEntity)}
                              />
                            )}
                          {index > 0 && (
                            <DeleteOutlinedIcon
                              onClick={() =>
                                handleRemove(selectedEntity, index)
                              }
                              className="m-2 cursor-pointer"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  <div className="row d-flex justify-content-between mt-0 g-4">
                    <div className="col-12 ">
                      <label className="col-form-label">
                        Document<span>*</span>
                      </label>
                      <UploadBtn
                        label="Upload Documents"
                        name="document"
                        accept=".pdf, .jpg, .jpeg, .png, .gif"
                        handleFileChange={handleFileChange}
                      />
                      <div>
                        {allselectedfiles.length > 0 && (
                          <ul className='doclist'>
                            {allselectedfiles.map((file, index) => (
                              <li
                                key={index}
                                className="flex items-center justify-between"
                              >
                                {file.name}
                                <DeleteOutlinedIcon
                                  className="m-2 cursor-pointer"
                                  onClick={() => handleRemoveFile(index)}
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div>
                            {document_error && (
                              <p
                                className="error-text "
                                style={{ color: 'red' }}
                              >
                                <small >
                                  {' '}
                                  Please select at least a Document file.
                                </small>
                              </p>
                            )}
                          </div>
                    </div>
                    <div className="col-lg-12">
                      <FormControlLabel
                        control={
                          <Checkbox
                            data-testid="checkbox"
                            onChange={handleTermandCondi}
                          />
                        }
                        label={
                          <Typography variant="body2">
                            By registering your account you have to agree with
                            our{' '}
                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleTACpopup();
                              }}
                              sx={{ fontSize: '0.85rem' }} // Adjusts font size of the link
                            >
                              Terms & Conditions
                            </Link>
                          </Typography>
                        }
                        sx={{
                          '& .MuiTypography-root': { fontSize: '0.85rem' },
                        }} // Adjusts font size of the entire label
                      />
                    </div>
                    <div className="col-12">
                      <div className=" d-flex justify-content-center  flex-column">
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={CheckTermandcondi}
                          className="py-3"
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* <div className="form-check my-3 fs-14">
                    <input
                      data-testid="checkbox"
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      onChange={handleTermandCondi}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      By registering your account you have to agree with our{' '}
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleTACpopup();
                        }}
                      >
                        {' '}
                        Terms & Conditions
                      </a>
                    </label>
                  </div> */}

                  <Dialog open={popupTermandCondi} onClose={handleClose}>
                    <DialogTitle>{'Terms and Condition'}</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Content of Gyanshetu Terms and Conditions...... will
                        come soon
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <OtpCard open={popupOtpCard} handleOtpClose={() => setPopupOtpCard(false)} handleOtpSuccess={(otp: string) => handleOtpSubmit(otp)} email={teacher.email_id} />
                </div>
              </div>
            </div>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TeacherRegistrationPage;
