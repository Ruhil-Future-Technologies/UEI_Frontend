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
  SubjectRep0oDTO,
} from '../../Components/Table/columns';
import useApi from '../../hooks/useAPI';
import {
  QUERY_KEYS,
  QUERY_KEYS_CLASS,
  QUERY_KEYS_COURSE,
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

interface Teacher {
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
  state: string;
  district: string;
  city: string;
  pincode: string;
  course_id: string;
  is_verified: boolean;
  is_kyc_verified: boolean;
  pic_path?: string; // Optional profile picture path
}

const qualifications = [
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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const TeacherRegistrationPage = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const navigate = useNavigate();
  const { postRegisterData, getForRegistration } = useApi();
  const InstituteURL = QUERY_KEYS.GET_INSTITUTES;
  const InstituteEntityURL = QUERY_KEYS.ENTITY_LIST;
  const getsubjectSchool = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;
  const getSubjectCollege = QUERY_KEYS_SUBJECT.GET_SUBJECT;
  //const Rolelist = QUERY_KEYS_ROLE.GET_ROLE;
  const getTeacherURL = QUERY_KEYS.GET_TEACHER;
  const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;
  const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;
  const [dataEntity, setDataEntity] = useState<IEntity[]>([]);
  const [allselectedfiles, handleFileChanges] = useState<File[]>([]);
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
  const [selectedSubject, setSelectedSubject] = useState<string[]>([]);
  const [popupTermandCondi, setPopupTermandcondi] = useState(false);
  const [CheckTermandcondi, setCheckTermandcondi] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState('');
  //const [roleId, setRoleId] = useState("c848bc42-0e62-46b1-ab2e-2dd4f9bef546");
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
    district: '',
    city: '',
    pincode: '',
    qualification: '',
    experience: '',
    subjects: [''],
    role_id: '',
    entity_id: 'school',
    class_id: '',
    course_id: '',
    institution_id: '',
    school_name: '',
    documents: [],
    is_verified: false,
    is_kyc_verified: false,
    pic_path: '',
  });
  const exactSixYearsAgo = dayjs()?.subtract(18, 'year');
  const minSelectableDate = dayjs('01/01/1900');
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
    subject_name_error: boolean;
    designation_role_error: boolean;
    entity_error: boolean;
    class_id_error: boolean;
    course_id_error: boolean;
    institution_id_error: boolean;
    school_name_error: boolean;
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
    subject_name_error: false,
    designation_role_error: false,
    entity_error: false,
    class_id_error: false,
    course_id_error: false,
    institution_id_error: false,
    school_name_error: false,
  });

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
        console.log(data.data);
        if (data.data) {
          setDataInstitute(data?.data);
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
  // const getRole = () => {
  //     getForRegistration(`${Rolelist}`)
  //         .then((data) => {
  //             if (data.data) {
  //                 setRoleId(data.data.id) // setRoleData(data?.data);
  //             }
  //         })
  //         .catch((e) => {
  //             if (e?.response?.status === 401) {
  //                 navigate('/');
  //             }
  //             toast.error(e?.message, {
  //                 hideProgressBar: true,
  //                 theme: 'colored',
  //             });
  //         });
  // }

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
  useEffect(() => {
    getInstitutelist();
    getEntity();
    getCourses();
    getClasslist();
    //getRole();
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
      first_name_error: name === 'first_name' && value === '',
      last_name_error: name == 'last_name' && value === '',
      email_id_error:
        name === 'email_id' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      phone_no_error: name === 'phone' && !/^\d{10}$/.test(value),
      address_error: name === 'address' && value === '',
      country_error: name === 'country' && value === '',
      state_error: name === 'state' && value === '',
      district_error: name === 'district' && value === '',
      city_error: name === 'city' && value === '',
      pincode_error: name === 'pincode' && !/^(?!0{6})[0-9]{6}$/.test(value),
      qualifications_error: name === 'qualifications' && value == '',
      teaching_experience_error: name === 'teaching_experience' && value === '',
      subject_name_error: name === 'subject_name' && value == '',
      designation_role_error: name === 'designation_role' && value == '',
      entity_error: false,
      class_id_error: name == 'class' && value === '',
      course_id_error: name === 'course' && value === '',
      institution_id_error: name === 'institute_name' && value === '',
      school_name_error: selectedEntity === 'School' && value === '',
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
  const handleSubmit = () => {
    setError({
      first_name_error: teacher.first_name === '',
      last_name_error: teacher.last_name === '',
      email_id_error: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(teacher.email_id),
      phone_no_error: !/^\d{10}$/.test(teacher.phone),
      address_error: teacher.address === '',
      country_error: teacher.country == '',
      state_error: teacher.state == '',
      district_error: teacher.district == '',
      city_error: teacher.city == '',
      pincode_error: !/^\d{6}$/.test(teacher.pincode),
      qualifications_error: teacher.qualification === '',
      teaching_experience_error: teacher.experience === '',
      subject_name_error: teacher.subjects.length === 0,
      designation_role_error: false,
      entity_error: false,
      class_id_error:
        selectedEntity === 'School' && teacher.class_id === '' ? true : false,
      course_id_error:
        selectedEntity === 'College' && teacher.institution_id === ''
          ? true
          : false,
      institution_id_error:
        selectedEntity === 'College' && teacher.institution_id === ''
          ? true
          : false,
      school_name_error:
        selectedEntity === 'School' && teacher.school_name === '',
    });
    if (!teacher.dob || !dayjs(teacher.dob).isValid()) {
      setdobset_col(true);
      return;
    }

    const isSchoolValid =
      selectedEntity === 'School'
        ? !error.class_id_error &&
        !(teacher.class_id === '') &&
        !error.school_name_error &&
        !(teacher.school_name === '')
        : true;

    const isCollegeValid =
      selectedEntity === 'College'
        ? !error.course_id_error &&
        !(teacher.course_id === '') &&
        !error.institution_id_error &&
        !(teacher.institution_id === '')
        : true;
    console.log("inside sunction")
    if (
      !error.first_name_error &&
      !(teacher.first_name === '') &&
      !error.last_name_error &&
      !(teacher.last_name === '') &&
      !error.email_id_error &&
      !(teacher.email_id === '') &&
      !error.phone_no_error &&
      !(teacher.phone === '') &&
      !error.address_error &&
      !(teacher.address === '') &&
      !error.country_error &&
      !(teacher.country === '') &&
      !error.state_error &&
      !(teacher.state === '') &&
      !error.district_error &&
      !(teacher.district === '') &&
      !error.city_error &&
      !(teacher.city === '') &&
      !error.pincode_error &&
      !(teacher.pincode === '') &&
      !error.qualifications_error &&
      !(teacher.qualification === '') &&
      !error.teaching_experience_error &&
      !(teacher.experience === '') &&
      !error.subject_name_error &&
      teacher.subjects.length > 0 &&
      isCollegeValid &&
      isSchoolValid
    ) {
      console.log("inside if code")
      let payload;
      // All required fields are valid, proceed with the next steps
      if (selectedEntity === 'School') {
        payload = {
          first_name: teacher.first_name,
          last_name: teacher.last_name,
          gender: genderData,
          dob: teacher.dob,
          phone: teacher.phone,
          email_id: teacher.email_id,
          qualification: teacher.qualification,
          subjects: selectedSubject,
          entity_id: teacher.entity_id,
          role_id: 'c848bc42-0e62-46b1-ab2e-2dd4f9bef546',
          school_name: selectedSchool,
          institution_id: teacher.school_name,
          class_id: teacher.class_id,
          experience: teacher.experience,
          address: teacher.address,
          country: teacher.country,
          state: teacher.state,
          district: teacher.district,
          city: teacher.city,
          pincode: teacher.pincode,
          documents: allselectedfiles,
        };
        console.log("payload", payload)
      } else {
        payload = {
          first_name: teacher.first_name,
          last_name: teacher.last_name,
          gender: genderData,
          dob: teacher.dob,
          phone: teacher.phone,
          email_id: teacher.email_id,
          qualification: teacher.qualification,
          documents: allselectedfiles,
          subjects: selectedSubject,
          entity_id: teacher.entity_id,
          course_id: teacher.course_id,
          role_id: 'c848bc42-0e62-46b1-ab2e-2dd4f9bef546',
          institution_id: teacher.institution_id,
          experience: teacher.experience,
          address: teacher.address,
          country: teacher.country,
          state: teacher.state,
          district: teacher.district,
          city: teacher.city,
          pincode: teacher.pincode,
        };
      }

      postRegisterData(getTeacherURL, payload)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            toast.success('Teacher registration request sent successfully', {
              hideProgressBar: true,
              theme: 'colored',
            });
            alert(
              'Teacher registered request sended successfully please wait for 24-48 hours',
            );
            window.location.reload();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const filesArray = Array.from(files); // Convert FileList to an array

      handleFileChanges((prevFiles) => [
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
    if (newDate && newDate?.isValid() && newDate >= minSelectableDate) {
      if (newDate && newDate?.isBefore(exactSixYearsAgo, 'day')) {
        setTeacher((values) => ({ ...values, dob: newDate }));

        setdobset_col(false);
      } else {
        setdobset_col(true);
      }
    } else {
      setdobset_col(true);
    }
  };
  const handelSubjectChange = (
    event: SelectChangeEvent<typeof selectedSubject>,
  ) => {
    const { value } = event.target;

    setSelectedSubject(value as string[]);
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
  console.log(teacher);
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
                  <small> Please enter a valid first name.</small>
                 
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
                  <small>
                  Please enter a valid last name.
                  </small>
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
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
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
                  Please Enter a valid last name.
                </p>
              )}
            </div>
          </div>
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                Phone Number<span>*</span>
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
                 <small> Please enter a valid mobile number.</small>
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
                  <small>
                  Please enter a valid email ID.
                  </small>
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
            </div>
            {selectedEntity === 'School' ? (
              <div className="col-md-6 col-12 mb-3">
                <label className="col-form-label">
                  Class<span>*</span>
                </label>

                <FormControl sx={{ width: 280 }}>
                  <InputLabel id="demo-multiple-name-label">class</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo1-multiple-name"
                    name="class_id"
                    onChange={handleSelect}
                    value={teacher.class_id}
                    input={<OutlinedInput label="Branch" />}
                  >
                    {dataClass.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.class_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {error.class_id_error === true && (
                  <p className="error-text " style={{ color: 'red' }}>
                    <small>
                      Please select a class.
                    </small>
                  </p>
                )}
              </div>
            ) : (
              <div className="col-md-6 col-12 mb-3">
                <label className="col-form-label">
                  Qualification<span>*</span>
                </label>
                <FormControl sx={{ width: 280 }}>
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
              </div>
            )}
          </div>

          {selectedEntity === 'School' ? (
            <div className="row d-flex justify-content-center">
              <div className="col-12">
                <label className="col-form-label">
                  School Name<span>*</span>
                </label>
                <FormControl sx={{ width: 580 }}>
                  <InputLabel id="school_id">School Name</InputLabel>
                  <Select
                    labelId="school_id"
                    id="demo2-multiple-name"
                    name="school_name"
                    label="School Name"
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
              </div>
            </div>
          ) : (
            <div className="row d-flex justify-content-center">
              <div className="col-md-6 col-12 mb-3">
                <label className="col-form-label">
                  Institute Name<span>*</span>
                </label>
                <FormControl sx={{ width: 280 }}>
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
                    <small>Please select an institute name.</small>
                  </p>
                )}
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="col-form-label">
                  Course<span>*</span>
                </label>
                <FormControl sx={{ width: 280 }}>
                  <InputLabel id="course_id">Course</InputLabel>
                  <Select
                    labelId="course_id"
                    id="demo3-multiple-name"
                    name="course_id"
                    label="Course"
                    onChange={handleSelect}
                  >
                    {filteredCourse.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.course_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {error.course_id_error === true && (
                  <p className="error-text " style={{ color: 'red' }}>
                    <small>
                    Please enter a valid course.
                    </small>
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                Subjects Taught<span>*</span>
              </label>
              <FormControl
                sx={{
                  maxWidth: '300px',
                  width: '100%',
                }}
              >
                <InputLabel id="demo-multiple-checkbox-label">
                  Subject
                </InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  data-testid="Subject_text"
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '& .MuiSelect-icon': {
                      color: fieldIcon(namecolor),
                    },
                  }}
                  value={selectedSubject}
                  onChange={handelSubjectChange}
                  input={<OutlinedInput label="Subject" />}
                  renderValue={(selected) =>
                    (selected as string[])
                      .map((id) => {
                        const subject = totleSubject.find(
                          (subject: any) => subject.subject_id === id,
                        );
                        return subject ? subject.subject_name : '';
                      })
                      // .join(", ")
                      .reduce(
                        (prev, curr) =>
                          prev === '' ? curr : `${prev}, ${curr}`,
                        '',
                      )
                  }
                  MenuProps={MenuProps}
                >
                  {totleSubject.map((subject: any) => (
                    <MenuItem
                      key={subject.subject_id}
                      value={subject.subject_id}
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        // "&:hover": {
                        //   backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                        // },
                        '&:hover': {
                          backgroundColor: inputfieldhover(namecolor),
                          color: 'black !important',
                        },
                        '&.Mui-selected': {
                          // backgroundColor: inputfield(namecolor),
                          color: 'black',
                        },
                        '&.Mui-selected, &:focus': {
                          backgroundColor: inputfield(namecolor),
                          color: namecolor === 'dark' ? 'white' : 'black',
                        },
                      }}
                    >
                      <Checkbox
                        checked={
                          selectedSubject.indexOf(
                            subject.subject_id.toString(),
                          ) > -1
                        }
                      />
                      <ListItemText primary={subject.subject_name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {error.subject_name_error === true && (
                <p className="error-text " style={{ color: 'red' }}>
                  <small>
                    Please enter a valid subject name.
                  </small>
                </p>
              )}
            </div>
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
                inputProps={{ min: "0" }}
              />
              {error.teaching_experience_error === true && (
                <p className="error-text " style={{ color: 'red' }}>
                  <small>
                  Please Enter a valid Teaching Experience.
                  </small>
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
                  <small>
                    Please select a country.
                  </small>
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
                  <small>
                  Please select a state.                   
                  </small>

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
                  Please enter a valid district.
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
                <small>Please enter a valid city.</small>
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
                 <small>
                 Please enter a valid address.
                 </small>
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
                 <small>
                 Please enter a valid pincode
                 </small>
                </p>
              )}
            </div>
          </div>
          <div className="row d-flex justify-content-center">
            {selectedEntity === 'School' && (
              <div className="col-md-6 col-12 mb-3">
                <label className="col-form-label">
                  Qualification<span>*</span>
                </label>
                <FormControl sx={{ width: 280 }}>
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
              </div>
            )}
            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                {' '}
                Document<span>*</span>
              </label>
              <Button
                variant="contained"
                component="label"
                className="custom-button mainbutton"
                sx={{ height: 50 }}
              >
                Upload Documents
                <input
                  type="file"
                  name="document"
                  accept=".pdf, .jpg, .jpeg, .png, .gif"
                  hidden
                  multiple
                  onChange={handleFileChange}
                />
              </Button>
              <div>
                {allselectedfiles.length > 0 && (
                  <ul>
                    {allselectedfiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="form-check mb-3 fs-14">
            <input
              data-testid="checkbox"
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
              onChange={handleTermandCondi}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
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
              onClick={handleSubmit}
              disabled={CheckTermandcondi}
            >
              Submit Form
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
      </div>
    </div>
  );
};

export default TeacherRegistrationPage;
