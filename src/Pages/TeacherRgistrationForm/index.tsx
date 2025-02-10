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
} from '../../Components/Table/columns';
import useApi from '../../hooks/useAPI';
import {
  QUERY_KEYS,
  QUERY_KEYS_CLASS,
  QUERY_KEYS_COURSE,
  QUERY_KEYS_ROLE,
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL /* QUERY_KEYS_ROLE*/,
} from '../../utils/const';
import { toast } from 'react-toastify';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs/AdapterDayjs';
import UploadBtn from '../../Components/UploadBTN/UploadBtn';
import OtpCard from "../../Components/Dailog/OtpCard";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';


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
const stream = [
  "Science",
  "Commerce",
  "Arts",
]

export interface Boxes {
  semester_number: string,
  subjects: string[],
  course_id: string,
  filteredSemesters?: any[];
  filteredSubjects?: any[];
}
export interface BoxesForSchool {
  stream?: string,
  subjects: string[],
  class_id: string,
  filteredStream?: any[];
  filteredSubjects?: any[];
  is_Stream?: boolean;
  selected_class_name?: string;
}


const TeacherRegistrationPage = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const navigate = useNavigate();
  const { postRegisterData, getForRegistration } = useApi();


  const InstituteURL = QUERY_KEYS.GET_INSTITUTES;
  const InstituteEntityURL = QUERY_KEYS.ENTITY_LIST;
  const getsubjectSchool = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;
  const getSubjectCollege = QUERY_KEYS_SUBJECT.GET_SUBJECT;
  const Rolelist = QUERY_KEYS_ROLE.GET_ROLE;
  const getTeacherURL = QUERY_KEYS.GET_TEACHER;
  const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;
  const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;


  const [dataEntity, setDataEntity] = useState<IEntity[]>([]);
  const [allselectedfiles, setAllSelectedfiles] = useState<File[]>([]);
  const [dataInstitute, setDataInstitute] = useState<InstituteRep0oDTO[]>([]);
  const [filteredInstitute, setFiteredInstitute] = useState<InstituteRep0oDTO[]>([]);
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
  const [selectedClassName, setSelectedClassName] = useState("col-6");
  const [semesterData, setSemesterData] = useState<SemesterRep0oDTO[]>([]);


  const [boxes, setBoxes] = useState<Boxes[]>([{
    semester_number: '',
    subjects: [],
    course_id: '',
  }]);
  const [boxesForSchool, setBoxesForSchool] = useState<BoxesForSchool[]>([{
    stream: '',
    subjects: [],
    class_id: '',
    is_Stream: false,
    selected_class_name: "col-6"
  }]);


  const [roleId, setRoleId] = useState("c848bc42-0e62-46b1-ab2e-2dd4f9bef546");
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
    school_name: '',
    documents: [],
    is_verified: false,
    is_kyc_verified: false,
    pic_path: '',
  });
  const [error, setError] = useState<{
    first_name_error: boolean;
    last_name_error: boolean;
    email_id_error: boolean;
    phone_no_error: boolean;
    address_error: boolean;
    country_error: boolean;
    state_error: boolean;
    district_error: boolean;
    city_error: boolean;
    pincode_error: boolean;
    qualifications_error: boolean;
    teaching_experience_error: boolean;
    designation_role_error: boolean;
    entity_error: boolean;
    institution_id_error: boolean;
  }>({
    first_name_error: false,
    last_name_error: false,
    email_id_error: false,
    phone_no_error: false,
    address_error: false,
    country_error: false,
    state_error: false,
    district_error: false,
    city_error: false,
    pincode_error: false,
    qualifications_error: false,
    teaching_experience_error: false,
    designation_role_error: false,
    entity_error: false,
    institution_id_error: false
  });


  const exactSixYearsAgo = dayjs().subtract(18, 'year').subtract(1, 'day').endOf('day');
  const minSelectableDate = dayjs('01/01/1900');


  const [errorForClass_stream_subject, setErrorForClass_stream_subject] = useState<{
    [key: number]: { class_id_error: boolean; stream_error: boolean; subjects_error: boolean };
  }>({});
  const [errorForCourse_semester_subject, setErrorForCourse_semester_subject] = useState<{
    [key: number]: { course_id_error: boolean; semester_number_error: boolean; subjects_error: boolean };
  }>({});
  const validateFields = (index: number, field: string, boxesForSchool: BoxesForSchool) => {
    setErrorForClass_stream_subject((prevError) => ({
      ...prevError,
      [index]: {
        ...prevError[index],
        ...(field === "class_id" && {
          class_id_error: !boxesForSchool.class_id,
        }),
        ...(field === "stream" && {
          stream_error: !boxesForSchool.stream, // Fix: stream_error should check stream
        }),
        ...(field === "subjects" && {
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
        ...(field === "course_id" && {
          course_id_error: !boxes.course_id, // Fixed key name
        }),
        ...(field === "semester_number" && {
          semester_number_error: !boxes.semester_number, // Fixed key name
        }),
        ...(field === "subjects" && {
          subjects_error: !boxes.subjects?.length, // Ensuring subjects is not empty
        }),
      },
    }));
  };


  const getCourses = () => {
    getForRegistration(`${CourseURL}`)
      .then((data: { data: CourseRep0oDTO[] }) => {
        if (data.data) {
          setDataCourse(data?.data);
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


  const getEntity = () => {
    getForRegistration(`${InstituteEntityURL}`)
      .then((data: { data: IEntity[] }) => {
        const filteredData = data?.data.filter(
          (entity) => entity.is_active === 1,
        );
        setDataEntity(filteredData);
        // setDataEntity(data?.data)
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


  const getInstitutelist = async () => {
    getForRegistration(`${InstituteURL}`)
      .then((data) => {
        const fiteredInstitutedata = data.data.filter(
          (institute: any) => institute.is_active === 1 && institute.is_approve === true);
        if (data.data) {
          setDataInstitute(fiteredInstitutedata);
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
    getForRegistration(`${ClassURL}`)
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


  const getRole = () => {
    getForRegistration(`${Rolelist}`)
      .then((data) => {
        console.log(data.data)
        if (data.data) {
          const filerRoleId = data.data.find((role: any) => role.role_name === "Teacher").id
          console.log(filerRoleId);
          setRoleId(filerRoleId) // setRoleData(data?.data);
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
  }


  const getSubjects = (type: string) => {
    if (type === 'College') {
      getForRegistration(`${getSubjectCollege}`)
        .then((data) => {
          if (data.data) {
            setTotleSubject(data?.data);
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
    } else {
      getForRegistration(`${getsubjectSchool}`)
        .then((data) => {
          if (data.data) {
            setTotleSubject(data?.data);
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
    }
  };


  const getSemester = () => {
    try {
      getForRegistration(`/semester/list`).then((data) => {
        if (data.status === 200) {
          setSemesterData(data.data);
        }
      }).catch((e) => {
        console.error(e)
      })
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    getInstitutelist();
    getEntity();
    getCourses();
    getClasslist();
    getSemester();
    getRole();
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

      const filteredInstitute = dataInstitute.filter(
        (item) => String(item.entity_id) === value,
      );
      setFiteredInstitute(filteredInstitute);
    }

    if (name === 'school_name') {
      const selectedSchool = dataInstitute.find(
        (item) => String(item.id) === value,
      )?.institution_name;
      setSelectedSchool(String(selectedSchool));
    }

    validation(name, value);
  };

  const validation = (name: string, value: string) => {
    setError({
      first_name_error:
        name === 'first_name' &&
        !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim()),
      last_name_error:
        name == 'last_name' &&
        !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim()),
      email_id_error:
        name === 'email_id' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      phone_no_error: name === 'phone' && !/^(?!0{10})[0-9]{10}$/.test(value),
      address_error: name === 'address' && !/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(value),
      country_error: name === 'country' && value === '',
      state_error: name === 'state' && value === '',
      district_error:
        name === 'district' &&
        !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim()),
      city_error:
        name === 'city' &&
        !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim()),
      pincode_error: name === 'pincode' && !/^(?!0{6})[0-9]{6}$/.test(value),
      qualifications_error: name === 'qualifications' && value == '',
      teaching_experience_error: name === 'experience' && !/^\d+$/.test(value),
      designation_role_error: name === 'designation_role' && value == '',
      entity_error: name === 'entity_id' && value === "",
      institution_id_error: name === 'institution_id' && value === ""
    });
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


  const openPopupOtp = () => {
    console.log("opened")
    setError({
      first_name_error: !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacher.first_name.trim(),
      ),
      last_name_error: !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacher.last_name.trim(),
      ),
      email_id_error: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacher.email_id),
      phone_no_error: !/^(?!0{10})[0-9]{10}$/.test(teacher.phone),
      address_error: !/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(teacher.address),
      country_error: teacher.country == '',
      state_error: teacher.state == '',
      district_error: !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacher.district.trim(),
      ),
      city_error: !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacher.city.trim(),
      ),
      pincode_error: !/^(?!0{6})[0-9]{6}$/.test(teacher.pincode),
      qualifications_error: teacher.qualification === '',
      teaching_experience_error: !/^\d+$/.test(teacher.experience),
      designation_role_error: false,
      entity_error: teacher.entity_id === '',
      institution_id_error: teacher.institution_id === '',
    });



    let valid = true;
    if (selectedEntity.toLowerCase() === 'school') {
      boxesForSchool.forEach((box, index) => {
        if (!box.class_id || (box.stream === '' ? false : !box.stream) || !box.subjects?.length) {
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


    console.log(valid)
    if (!valid) return;
    if (!teacher.dob || !dayjs(teacher.dob).isValid()) {
      setdobset_col(true);
      return;
    }
    if (
      !error.first_name_error &&

      /^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacher.first_name.trim(),
      ) &&
      !error.last_name_error &&
      /^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        teacher.last_name.trim(),
      ) &&

      !error.email_id_error &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacher.email_id) &&
      !error.phone_no_error &&
      /^(?!0{10})[0-9]{10}$/.test(teacher.phone) &&
      !error.address_error &&

      /^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(
        teacher.address.trim(),
      ) &&

      !error.country_error &&
      !(teacher.country === '') &&
      !error.state_error &&
      !(teacher.state === '') &&
      !error.district_error &&

      /^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(teacher.district.trim()) &&
      !error.city_error &&
      /^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(teacher.city.trim()) &&

      !error.pincode_error &&
      /^(?!0{6})[0-9]{6}$/.test(teacher.pincode) &&
      !error.qualifications_error &&
      !(teacher.qualification === '') &&
      !error.teaching_experience_error &&
      /^\d+$/.test(teacher.experience) &&
      !error.institution_id_error &&
      !(teacher.institution_id === '')
    ) {
      setPopupOtpCard(true)
    } else {
      toast.error('validation error', {
        hideProgressBar: true,
        theme: 'colored',
      })
    }
  };
  const handleSubmit = () => {

    const formData = new FormData();
    allselectedfiles.forEach((file) => {
      formData.append("documents", file);
    });


    formData.append("first_name", teacher.first_name);
    formData.append("last_name", teacher.last_name);
    formData.append("gender", genderData);
    formData.append("dob", teacher.dob ? dayjs(teacher.dob).format("YYYY-MM-DD") : "");
    formData.append("phone", teacher.phone);
    formData.append("email_id", teacher.email_id);
    formData.append("qualification", teacher.qualification);
    formData.append("entity_id", teacher.entity_id);
    formData.append("role_id", roleId);
    formData.append("experience", teacher.experience);
    formData.append("address", teacher.address);
    formData.append("country", teacher.country);
    formData.append("state", teacher.state);
    formData.append("district", teacher.district);
    formData.append("city", teacher.city);
    formData.append("pincode", teacher.pincode);



    if (selectedEntity.toLowerCase() === "school") {
      const class_stream_subjects = boxesForSchool.reduce((acc, boxesForSchool) => {
        const { class_id, stream, subjects } = boxesForSchool;
        const streamKey = stream === '' ? "general" : stream || "general";
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
      }, {} as Record<string, Record<string, string[]>>);
      console.log(class_stream_subjects);
      formData.append("class_stream_subjects", JSON.stringify(class_stream_subjects));
      formData.append("school_name", selectedSchool);
      formData.append("institution_id", teacher.institution_id?.toString() || '');
      if (selectedClassName === "col-6") {
        formData.append("stream", teacher.stream);
      }
    } else {

      formData.append("institution_id", teacher.institution_id?.toString() || '');
      const course_semester_subjects = boxes.reduce((acc, box) => {
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
      }, {} as Record<string, Record<string, string[]>>);
      formData.append("course_semester_subjects", JSON.stringify(course_semester_subjects));
    }
    postRegisterData(getTeacherURL, formData)
      .then((response) => {
        if (response.status === 200) {
          toast.success('Teacher registration request sent successfully', {
            hideProgressBar: true,
            theme: 'colored',
          });
          alert(
            'Teacher registered request sended successfully please wait for 24-48 hours',
          );
          window.location.reload();
        } else {
          toast.error(response.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Convert FileList to an array
      const filesArray = Array.from(files);

      setAllSelectedfiles((prevFiles) => [
        ...prevFiles, // Keep previously selected files
        ...filesArray, // Add newly selected files
      ]);
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
    if (newDate && newDate.isValid() && newDate.isAfter(minSelectableDate, 'day')) {
      if (newDate.isBefore(exactSixYearsAgo, 'day') || newDate.isSame(exactSixYearsAgo, 'day')) {
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
    index: number
  ) => {
    const { value, name } = event.target;


    setBoxes((prevBoxes) =>
      prevBoxes.map((box, i) => {
        if (i !== index) return box;

        let updatedBox = { ...box, [name]: value };

        if (name === "course_id") {
          const filteredSemesters = semesterData.filter(item => item.course_id === value);
          updatedBox = { ...updatedBox, filteredSemesters, semester_number: "", subjects: [], filteredSubjects: [] };
        }

        if (name === "semester_number") {
          const filteredSubjects = totleSubject.filter(item => item.semester_number === value && item.course_id === boxes[index].course_id);
          updatedBox = { ...updatedBox, filteredSubjects, subjects: [] };
        }

        validateCourseFields(index, name, updatedBox);
        return updatedBox;
      })
    );

  };
  const handelSchoolBoxChange = (
    event: SelectChangeEvent<string[]>,
    index: number
  ) => {
    const { value, name } = event.target;

    setBoxesForSchool((prevBoxes) =>
      prevBoxes.map((box, i) => {
        if (i !== index) return box;

        let updatedBox = { ...box, [name]: value }; // Always update the changed value

        if (name === "class_id") {
          const selectedClass = dataClass.find(
            (item) => String(item.id) === value
          )?.class_name;


          setSelectedClassName(
            selectedClass === "class_11" || selectedClass === "class_12"
              ? "col-4"
              : "col-6"
          );

          if (selectedClass === "class_11" || selectedClass === "class_12") {

            updatedBox = { ...updatedBox, stream: "", is_Stream: true, selected_class_name: 'col-4', subjects: [], filteredSubjects: [] }; // Reset stream & subjects
          } else {


            // Filter subjects immediately based on the selected class
            const filteredSubjects = totleSubject.filter(
              (item) => item.class_id === value
            );
            console.log("Filtered Subjects:", filteredSubjects);

            updatedBox = { ...updatedBox, is_Stream: false, stream: "", selected_class_name: 'col-6', filteredSubjects, subjects: [] };
          }
        }

        if (name === "stream") {
          console.log(totleSubject, value);
          const filteredSubjects = totleSubject.filter(
            (item) => String(item.stream).toLowerCase() === value.toString().toLowerCase()
          );
          console.log("Filtered Subjects by Stream:", filteredSubjects);

          updatedBox = { ...updatedBox, stream: value.toString(), filteredSubjects, subjects: [] };

        }
        validateFields(index, name, updatedBox);
        return updatedBox;
      })
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
    if (eneity.toLowerCase() === "school") {
      const newBox =
        { stream: '', class_id: '', selected_class_name: "col-6", subjects: [] }
      setBoxesForSchool([...boxesForSchool, newBox])
    } else {
      const newbox: Boxes =
        { semester_number: '', course_id: '', subjects: [] }

      setBoxes([...boxes, newbox]);
    }

  }
  const handleRemove = (entity: string, index: number) => {
    if (entity.toLowerCase() === "school") {
      setBoxesForSchool(boxesForSchool.filter((_, i) => i !== index));
    } else {
      setBoxes(boxes.filter((_, i) => i !== index));
    }
  };
  const handleRemoveFile = (index: number) => {
    setAllSelectedfiles((previous) => previous.filter((_, ind) => ind !== index));
  }
  return (
    <div className="without-login">
      <header className="container-fluid  py-3 d-none d-lg-block">
        <div className="row align-items-center">
          <div className="col-6">
            <div className="logoui">
              <img src={gLogo} alt="" onClick={() => navigate('/signup')} />
              <span>Gyansetu</span>
            </div>
          </div>
        </div>
      </header>
      <div className="access1-card">
        <div className="card-body">
          <h3 className="text-center fw-bold">Register As Teacher</h3>
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
                onChange={handelChange}
              />
              {error.first_name_error === true && (
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
                onChange={handelChange}
              />
              {error.last_name_error === true && (
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
                  <small>

                    Please enter a valid Date of Birth.

                  </small>
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
                onChange={handelChange}
              />
              {error.phone_no_error === true && (
                <p className="error-text " style={{ color: 'red' }}>
                  <small> Please enter a valid Mobile number.</small>
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
                onChange={handelChange}
              />
              {error.email_id_error === true && (
                <p className="error-text " style={{ color: 'red' }}>
                  <small>Please enter a valid Email Id.</small>
                </p>
              )}
            </div>
          </div>
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 col-12 mb-3">
              <label className={`col-form-label`}>
                Country<span>*</span>
              </label>
              <CountryDropdown
                classes="form-select custom-dropdown"
                defaultOptionLabel={teacher.country}
                value={teacher.country || ''}
                onChange={(e: string) => handleInputChangecountry(e, 'country')}
              />
              {error.country_error === true && (
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
                defaultOptionLabel={teacher.state || ''}
                country={teacher.country || ''}
                value={teacher.state || ''}
                // onChange={(val) => setRegion(val)}
                onChange={(e: string) => handleInputChangecountry(e, 'state')}
              />
              {error.state_error === true && (
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
                onChange={handelChange}
              />
              {error.district_error === true && (
                <p className="error-text " style={{ color: 'red' }}>

                  <small>
                    Please enter a valid District name.
                  </small>

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
                onChange={handelChange}
              />
              {error.city_error === true && (
                <p className="error-text " style={{ color: 'red' }}>

                  <small>Please enter a valid City name.</small>

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
                onChange={handelChange}
              />
              {error.address_error === true && (
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
                onChange={handelChange}
              />
              {error.pincode_error === true && (
                <p className="error-text " style={{ color: 'red' }}>
                  <small>Please enter a valid Pincode.</small>
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
                <InputLabel id="demo-simple-select-label">Entity *</InputLabel>
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
              {error.entity_error && (
                <p className="error-text " style={{ color: 'red' }}>
                  <small>
                    Please select an Entity.
                  </small>
                </p>
              )}
            </div>

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
              {error.institution_id_error === true && (
                <p className="error-text " style={{ color: 'red' }}>
                  <small>Please select an Institute name.</small>
                </p>
              )}
            </div>
          </div>
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
                onChange={handelChange}
                inputProps={{ min: '0' }}
              />
              {error.teaching_experience_error === true && (
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
              {error.qualifications_error && (
                <p className='error-text' style={{ color: 'red' }}>
                  <small>Please select a Qualification.</small>
                </p>
              )

              }
            </div>

          </div>
          {selectedEntity.toLowerCase() === 'college' && boxes.length > 0 &&
            boxes.map((box, index) => (
              <div key={index} className="row d-flex justify-content-center">
                {/* Course Selection */}
                <div className="col-md-4 col-12 mb-3">
                  <label className="col-form-label">
                    Course<span>*</span>
                  </label>
                  <FormControl fullWidth>
                    <InputLabel id={`course_id_${index}`}>Course</InputLabel>
                    <Select
                      labelId={`course_id_${index}`}
                      id={`demo3-multiple-name-${index}`}
                      name="course_id"
                      label="Course"
                      onChange={(event: any) => handelSubjectBoxChange(event, index)}
                      value={box.course_id || ""}
                    >
                      {filteredCourse.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.course_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errorForCourse_semester_subject[index]?.course_id_error === true && (
                    <p className="error-text" style={{ color: "red" }}>
                      <small>Please select Course name.</small>
                    </p>
                  )}
                </div>

                {/* Semester Selection */}
                <div className="col-md-4 col-12 mb-3">
                  <label className="col-form-label">
                    Semester <span>*</span>
                  </label>
                  <FormControl fullWidth>
                    <InputLabel id={`semester_id_${index}`}>Semester</InputLabel>
                    <Select
                      labelId={`semester_id_${index}`}
                      id={`semester_select_${index}`}
                      name="semester_number"
                      label="Semester"
                      onChange={(event: any) => handelSubjectBoxChange(event, index)}
                      value={box.semester_number || ""}
                    >
                      {box.filteredSemesters?.map((item) => (
                        <MenuItem key={item.id} value={item.semester_number || ""}>
                          {item.semester_number}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errorForCourse_semester_subject[index]?.semester_number_error && (
                    <p className="error-text" style={{ color: "red" }}>
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
                    <InputLabel id={`subject_label_${index}`}>Subject</InputLabel>
                    <Select
                      labelId={`subject_label_${index}`}
                      id={`subject_select_${index}`}
                      multiple
                      name="subjects"
                      value={box.subjects || []}
                      onChange={(event: any) => handelSubjectBoxChange(event, index)}
                      input={<OutlinedInput label="Subject" />}
                      renderValue={(selected) =>
                        (selected as string[])
                          .map((id) => {
                            const subject = totleSubject.find(
                              (subject: any) => subject.subject_name === id
                            );
                            return subject ? subject.subject_name : "";
                          })
                          .join(", ")
                      }
                    >
                      {box.filteredSubjects?.map((subject: any) => (
                        <MenuItem key={subject.subject_id} value={subject.subject_name}>
                          <Checkbox
                            checked={box.subjects?.includes(subject.subject_name.toString())}
                          />
                          <ListItemText primary={subject.subject_name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errorForCourse_semester_subject[index]?.subjects_error && (
                    <p className="error-text" style={{ color: "red" }}>
                      <small>Please select at least one subject.</small>
                    </p>
                  )}
                </div>
                <div>
                  { }
                  {((selectedEntity.toLowerCase() === "college" || selectedEntity.toLowerCase() === "school") &&
                    ((boxes.length === 1 && index === 0) ||
                      (boxes.length > 1 && index === boxes.length - 1))) && (
                      <AddCircleIcon className="m-2 cursor-pointer" onClick={() => handleAddmore(selectedEntity)} />
                    )}
                  {index > 0 && (
                    <DeleteOutlinedIcon onClick={() => handleRemove(selectedEntity, index)} className='m-2 cursor-pointer' />
                  )}

                </div>
              </div>

            ))}
          {selectedEntity.toLowerCase() === 'school' && boxesForSchool.length > 0 &&
            boxesForSchool.map((box, index) => (
              <div key={index} className="row d-flex justify-content-center">
                {/* Class Selection */}
                <div className={box.selected_class_name}>
                  <label className="col-form-label">
                    Class<span>*</span>
                  </label>
                  <FormControl fullWidth>
                    <InputLabel id={`class_id_${index}`}>Class</InputLabel>
                    <Select
                      labelId={`class_id_${index}`}
                      id={`class_select_${index}`}
                      name="class_id"
                      onChange={(event: any) => handelSchoolBoxChange(event, index)}
                      value={box.class_id || ""}
                      input={<OutlinedInput label="Class" />}
                    >
                      {dataClass.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.class_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errorForClass_stream_subject[index]?.class_id_error && (
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
                      <InputLabel id={`stream_id_${index}`}>Stream Name</InputLabel>
                      <Select
                        labelId={`stream_id_${index}`}
                        id={`stream_select_${index}`}
                        name="stream"
                        onChange={(event: any) => handelSchoolBoxChange(event, index)}
                        value={box.stream || ""}
                        sx={{
                          backgroundColor: inputfield(namecolor),
                          color: inputfieldtext(namecolor),
                          '& .MuiSelect-icon': { color: fieldIcon(namecolor) },
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
                              '&:hover': { backgroundColor: inputfieldhover(namecolor) },
                            }}
                          >
                            {item}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {errorForClass_stream_subject[index]?.stream_error && (
                      <p className="error-text" style={{ color: "red" }}>
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
                    <InputLabel id={`subject_label_${index}`}>Subject</InputLabel>
                    <Select
                      labelId={`subject_label_${index}`}
                      id={`subject_select_${index}`}
                      multiple
                      name="subjects"
                      value={box.subjects || []}
                      onChange={(event: any) => handelSchoolBoxChange(event, index)}
                      input={<OutlinedInput label="Subject" />}
                      renderValue={(selected) =>
                        (selected as string[])
                          .map((id) => {
                            const subject = totleSubject.find(
                              (subject: any) => subject.subject_name === id
                            );
                            return subject ? subject.subject_name : "";
                          })
                          .join(", ")
                      }
                    >
                      {box.filteredSubjects?.map((subject: any) => (
                        <MenuItem key={subject.subject_id} value={subject.subject_name}>
                          <Checkbox
                            checked={box.subjects?.includes(subject.subject_name.toString())}
                          />
                          <ListItemText primary={subject.subject_name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errorForClass_stream_subject[index]?.subjects_error && (
                    <p className="error-text" style={{ color: "red" }}>
                      <small>Please select at least one subject.</small>
                    </p>
                  )}
                </div>

                <div>
                  {((selectedEntity.toLowerCase() === "college" || selectedEntity.toLowerCase() === "school") &&
                    ((boxesForSchool.length === 1 && index === 0) ||
                      (boxesForSchool.length > 1 && index === boxesForSchool.length - 1))) && (
                      <AddCircleIcon className="m-2 cursor-pointer" onClick={() => handleAddmore(selectedEntity)} />

                    )}
                  {index > 0 && (
                    <DeleteOutlinedIcon onClick={() => handleRemove(selectedEntity, index)} className='m-2 cursor-pointer' />
                  )}
                </div>


              </div>
            ))}
          <div className="row d-flex justify-content-between">
            <div className="col-md-6 col-12 ">
              <label className="col-form-label">
                {' '}
                Document<span>*   </span>
              </label>
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
                      <li key={index} className="flex items-center justify-between">
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
            </div>
          </div>
          <div className="form-check mb-3 mt-2 fs-14">
            <input
              data-testid="checkbox"
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
              onChange={handleTermandCondi}
            />
            <label className="form-check-label " htmlFor="flexCheckDefault">
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
          </div>
          <div className=" d-flex justify-content-center m-2">
            <Button
              variant="contained"
              onClick={openPopupOtp}
              disabled={CheckTermandcondi}
            >
              Submit
            </Button>
          </div>
          <Dialog open={popupTermandCondi} onClose={handleClose}>
            <DialogTitle>{'Terms and Condition'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Content of Gyanshetu Terms and Conditions...... will come soon
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <OtpCard open={popupOtpCard} handleOtpClose={() => setPopupOtpCard(false)} handleOtpSuccess={handleSubmit} />
      </div>
    </div>
  );
};

export default TeacherRegistrationPage;
