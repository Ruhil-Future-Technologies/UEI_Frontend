/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import '../Teacher/Teacher.scss';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, Typography, Box } from '@mui/material';
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

interface ITeacherForm {
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  phone: string;
  email_id: string;
  qualification: string;
  role_id: string;
  subjects: string[];
  entity_id: string;
  class_id?: string;
  school_name?: string;
  university_id?: string;
  course_id?: string;
  experience: number;
  institution_id: string;
  address: string;
  country: string;
  state: string;
  city: string;
  district: string;
  pincode: string;
}

const AddEditTeacher = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  // const location = useLocation();
  // const pathSegments = location.pathname.split('/').filter(Boolean);
  const { id } = useParams();

  // const lastSegment = id
  //   ? pathSegments[pathSegments.length - 3].toLowerCase()
  //   : pathSegments[pathSegments.length - 2].toLowerCase();
  // const Menulist: any = localStorage.getItem('menulist1');
  //   const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);
  const navigator = useNavigate();

  const { getData, postData, putData } = useApi();
  const GET_UNIVERSITY = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;
  const GET_ENTITIES = QUERY_KEYS_ENTITY.GET_ENTITY;
  const GET_COURSE = QUERY_KEYS_COURSE.GET_COURSE;

  const [dataUniversity, setDataUniversity] = useState<any[]>([]);
  const [dataEntity, setDataEntity] = useState<any[]>([]);
  const [dataInstitutes, setDataInstitutes] = useState<any[]>([]);
  const [dataCourses, setDataCourses] = useState<any[]>([]);
  const [dataClasses, setDataClasses] = useState<any[]>([]);
  const [collegeSubjects, setCollegeSubjects] = useState<any[]>([]);
  const [schoolSubjects, setSchoolSubjects] = useState<any[]>([]);
  const [role, setRole] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState<any[]>([]);
  const [schoolInstitutes, setSchoolInstitutes] = useState<any[]>([]);
  const [collegeInstitutes, setCollegeInstitutes] = useState<any[]>([]);

  const initialState = {
    first_name: '',
    last_name: '',
    gender: '',
    dob: '',
    phone: '',
    email_id: '',
    qualification: '',
    role_id: '',
    subjects: [],
    entity_id: '',
    class_id: '',
    school_name: '',
    university_id: '',
    course_id: '',
    experience: 0,
    institution_id: '',
    address: '',
    country: '',
    state: '',
    city: '',
    district: '',
    pincode: '',
  };

  const [teacher, setTeacher] = useState(initialState);
  const formRef = useRef<FormikProps<ITeacherForm>>(null);
  const [state_col, setstate_col] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedstate, setIsFocusedstate] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownstateRef = useRef<HTMLDivElement>(null);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const genderOptions = ['Male', 'Female'];
  const [dob, setDob] = useState<any>(null);

  const maxSelectableDate = dayjs().subtract(18, 'year');
  const minSelectableDate = dayjs().subtract(100, 'year');

  const charPattern = /^[a-zA-Z\s]*$/;
  const mobilePattern = /^\d{10}$/;
  const emailPattern = /\S+@\S+\.\S+/;
  const pincodePattern = /^\d{6}$/;
  const qualificationPattern = /^[a-zA-Z0-9\s.,()'-]+$/;

  const isSchoolEntity = (entityId: string | string[]): boolean => {
    const selectedEntity = dataEntity?.find((entity) => entity.id === entityId);
    return selectedEntity?.entity_type?.toLowerCase() === 'school';
  };

  const isCollegeEntity = (entityId: string | string[]): boolean => {
    const selectedEntity = dataEntity?.find((entity) => entity.id === entityId);
    return selectedEntity?.entity_type?.toLowerCase() === 'college';
  };

  const callAPI = async () => {
    if (id) {
      getData(`teacher/get/${id}`)
        .then((data: { data: any }) => {
          const processedData = {
            first_name: data?.data?.first_name || '',
            last_name: data?.data?.last_name || '',
            gender: data?.data?.gender || '',
            dob: data?.data?.dob || '',
            phone: data?.data?.phone || '',
            email_id: data?.data?.email_id || '',
            qualification: data?.data?.qualification || '',
            role_id: data?.data?.role_id || '',
            subjects: data?.data?.subjects || [],
            entity_id: data?.data?.entity_id || '',
            class_id: data?.data?.class_id || '',
            school_name: data?.data?.school_name || '',
            university_id: data?.data?.university_id || '',
            course_id: data?.data?.course_id || '',
            experience: Number(data?.data?.experience) || 0,
            institution_id: data?.data?.institution_id || '',
            address: data?.data?.address || '',
            country: data?.data?.country || '',
            state: data?.data?.state || '',
            city: data?.data?.city || '',
            district: data?.data?.district || '',
            pincode: data?.data?.pincode || '',
          };

          setTeacher(processedData);

          if (data?.data?.dob) {
            setDob(dayjs(data.data.dob));
          }
        })
        .catch((e) => {
          if (e?.response?.status === 401) {
            navigator('/');
          }
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  // useEffect(() => {
  //   setFilteredData(
  //     dataaccess(Menulist, lastSegment, { urlcheck: '' }, { datatest: '' }),
  //   );
  // }, [Menulist]);

  // if (
  //   (id && !filteredData?.form_data?.is_update) ||
  //   (!id && !filteredData?.form_data?.is_save)
  // ) {
  //   navigator('/main/Institute');
  // }

  useEffect(() => {
    getData(`${GET_UNIVERSITY}`).then((data) => {
      setDataUniversity(data.data);
    });
    getData(`${GET_ENTITIES}`).then((data) => {
      setDataEntity(data.data);
    });
    getData(`${GET_COURSE}`).then((data) => setDataCourses(data.data));
    getData(`${QUERY_KEYS.GET_INSTITUTES}`).then((data) => {
      const allInstitutes = data.data;
      const schoolInstitutes = allInstitutes?.filter(
        (institute: any) => institute.entity_type?.toLowerCase() === 'school',
      );
      const collegeInstitutes = allInstitutes?.filter(
        (institute: any) => institute.entity_type?.toLowerCase() === 'college',
      );

      setDataInstitutes(allInstitutes);
      setSchoolInstitutes(schoolInstitutes);
      setCollegeInstitutes(collegeInstitutes);
    });
    getData(`${QUERY_KEYS_ROLE.GET_ROLE}`).then((data) => {
      setRole(data.data);
    });
    getData(`${QUERY_KEYS_CLASS.GET_CLASS}`).then((data) => {
      setDataClasses(data.data);
    });
    getData(`${QUERY_KEYS_COURSE.GET_COURSE}`).then((data) => {
      setDataCourses(data.data);
    });
    getData(`${QUERY_KEYS_SUBJECT.GET_SUBJECT}`).then((data) => {
      setCollegeSubjects(data.data);
    });
    getData(`${QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT}`).then((data) => {
      setSchoolSubjects(data.data);
    });
  }, []);

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
    } else {
      setFilteredInstitutes([]);
    }
  }, [
    formRef.current?.values?.entity_id,
    formRef.current?.values?.university_id,
    schoolInstitutes,
    collegeInstitutes,
  ]);

  useEffect(() => {
    if (formRef.current?.values?.institution_id) {
      const filtered = dataCourses.filter(
        (course) =>
          course.institution_id === formRef.current?.values?.institution_id,
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [formRef.current?.values?.institution_id, dataCourses]);

  const SubjectsHandler = ({ values }: { values: ITeacherForm }) => {
    useEffect(() => {
      if (values?.entity_id) {
        if (isSchoolEntity(values.entity_id)) {
          if (values.class_id) {
            const filtered = schoolSubjects.filter(
              (subject) => subject.class_id === values.class_id,
            );
            setFilteredSubjects(filtered);
          } else {
            setFilteredSubjects([]);
          }
        } else if (isCollegeEntity(values.entity_id)) {
          if (values.course_id) {
            const filtered = collegeSubjects.filter(
              (subject) => subject.course_id === values.course_id,
            );
            setFilteredSubjects(filtered);
          } else {
            setFilteredSubjects([]);
          }
        }
      }
    }, [values?.class_id, values?.course_id, values?.entity_id]);

    return null;
  };

  const teacherSchema = Yup.object().shape({
    first_name: Yup.string()
      .required('Please enter First Name')
      .matches(charPattern, 'Please enter valid name, only characters allowed'),
    last_name: Yup.string()
      .required('Please enter Last Name')
      .matches(charPattern, 'Please enter valid name, only characters allowed'),
    gender: Yup.string().required('Please select Gender'),
    email_id: Yup.string()
      .required('Please enter Email')
      .matches(emailPattern, 'Please enter a valid Email format'),
    dob: Yup.date().required('Please enter Date of Birth'),
    phone: Yup.string()
      .required('Please enter Phone number')
      .matches(mobilePattern, 'Please enter a valid 10-digit mobile number'),
    subjects: Yup.array()
      .of(Yup.string())
      .min(1, 'Please select at least one subject')
      .required('Please select at least one subject'),
    qualification: Yup.string()
      .required('Please enter Qualification')
      .matches(
        qualificationPattern,
        'Please enter valid qualification (letters, numbers, and basic punctuation allowed)',
      ),

    class_id: Yup.string().when('entity_id', {
      is: (val: string) => !isCollegeEntity(val),
      then: () => Yup.string().required('Please select Class'),
      otherwise: () => Yup.string(),
    }),
    course_id: Yup.string().when('entity_id', {
      is: (val: string) => !isSchoolEntity(val),
      then: () => Yup.string().required('Please select Course'),
      otherwise: () => Yup.string(),
    }),
    experience: Yup.number()
      .required('Please enter Experience')
      .min(0, 'Experience cannot be negative')
      .typeError('Experience must be a number'),
    entity_id: Yup.string().required('Please select Entity'),
    university_id: Yup.string().when('entity_id', {
      is: (val: string) => !isSchoolEntity(val),
      then: () => Yup.string().required('Please select University'),
      otherwise: () => Yup.string(),
    }),
    institution_id: Yup.string().when('entity_id', {
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
      .required('Please enter City')
      .matches(charPattern, 'Please enter valid city name'),
    district: Yup.string()
      .required('Please enter District')
      .matches(charPattern, 'Please enter valid district name'),
    pincode: Yup.string()
      .required('Please enter Pincode')
      .matches(pincodePattern, 'Please enter a valid 6-digit pincode'),
  });

  const handleSubmit = async (
    teacherData: ITeacherForm,
    { resetForm }: FormikHelpers<ITeacherForm>,
  ) => {
    const teacherRole = role.find(
      (r) => r.role_name.toLowerCase() === 'teacher',
    );

    if (teacherData.class_id == '' || teacherData.school_name == '') {
      delete teacherData.class_id;
      delete teacherData.school_name;
    }
    if (teacherData.university_id == '' || teacherData.course_id == '') {
      delete teacherData.university_id;
      delete teacherData.course_id;
    }
    const formattedData = {
      ...teacherData,
      role_id: teacherRole?.id,
    };

    if (id) {
      putData(`${QUERY_KEYS_TEACHER.TEACHER_EDIT}/${id}`, formattedData)
        .then((data: { status: number; message: string }) => {
          if (data.status === 200) {
            navigator('/main/Teacher');
            toast.success('Teacher updated successfully', {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        })
        .catch((e: any) => {
          if (e?.response?.status === 401) {
            navigator('/');
          }
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    } else {
      postData(`${QUERY_KEYS_TEACHER.TEACHER_ADD}`, formattedData)
        .then((data: { status: number; message: string }) => {
          if (data.status === 200) {
            toast.success('Teacher saved successfully', {
              hideProgressBar: true,
              theme: 'colored',
            });
            resetForm({ values: initialState });
          } else {
            toast.error(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        })
        .catch((e: any) => {
          navigator('/');
          toast.error(e?.message, {
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
    if (newValue) {
      const formattedDate = dayjs(newValue).format('YYYY-MM-DD');
      setTeacher((prevTeacher) => ({
        ...prevTeacher,
        dob: formattedDate,
      }));

      if (!formattedDate || formattedDate == 'Invalid Date') {
        return;
      }
      formRef?.current?.setFieldValue('dob', formattedDate);
    } else {
      setTeacher((prevTeacher) => ({
        ...prevTeacher,
        dob: '',
      }));
      formRef?.current?.setFieldValue('dob', '');
    }
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
        }));
        setstate_col(true);
      } else if (name === 'state') {
        setTeacher((prevTeacher) => ({
          ...prevTeacher,
          state: value,
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

    setTeacher((prevTeacher: any) => {
      if (!prevTeacher) return prevTeacher;
      const newState = {
        ...prevTeacher,
        [fieldName]: value,
      };

      if (fieldName === 'institution_id') {
        formRef?.current?.setFieldValue('course_id', '');
        formRef?.current?.setFieldValue('subjects', []);
      }

      if (fieldName === 'entity_id' && typeof value === 'string') {
        if (isSchoolEntity(value)) {
          newState.course_id = '';
          newState.university_id = '';
          newState.institution_id = '';
        }
        if (isCollegeEntity(value)) {
          newState.class_id = '';
          newState.school_name = '';
        }
        newState.subjects = [];
      }

      if (fieldName === 'university_id') {
        newState.institution_id = '';

        const filtered = dataInstitutes?.filter(
          (institute) => institute.university_id === value,
        );
        setFilteredInstitutes(filtered);
      }

      if (fieldName === 'class_id' || fieldName === 'course_id') {
        newState.subjects = [];
      }

      return newState;
    });

    formRef?.current?.setFieldValue(fieldName, value);

    if (fieldName === 'entity_id' && typeof value === 'string') {
      if (isSchoolEntity(value)) {
        formRef?.current?.setFieldValue('course_id', '');
        formRef?.current?.setFieldValue('university_id', '');
        formRef?.current?.setFieldValue('institution_id', '');
        setFilteredInstitutes([]);
      }
      if (isCollegeEntity(value)) {
        formRef?.current?.setFieldValue('class_id', '');
        formRef?.current?.setFieldValue('school_name', '');
      }
      formRef?.current?.setFieldValue('subjects', []);
    }

    if (fieldName === 'university_id') {
      formRef?.current?.setFieldValue('institution_id', '');
    }

    if (fieldName === 'class_id' || fieldName === 'course_id') {
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

  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="card p-lg-3">
          <div className="card-body">
            <Typography variant="h6">
              <div className="main_title">{id ? 'Edit' : 'Add'} Teacher</div>
            </Typography>
            <Formik
              onSubmit={(formData, formikHelpers) => {
                return handleSubmit(formData, formikHelpers);
              }}
              initialValues={teacher}
              enableReinitialize
              validationSchema={teacherSchema}
              innerRef={formRef}
            >
              {({ errors, values, touched }) => (
                <Form>
                  <SubjectsHandler values={values} />
                  <div className="row gy-4 mt-0">
                    <div className="col-md-2">
                      <div className="form_field_wrapper">
                        <Field
                          fullWidth
                          component={TextField}
                          label="First Name *"
                          name="first_name"
                          value={values?.first_name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'first_name')
                          }
                        />
                        {touched?.first_name && errors?.first_name && (
                          <p className="error">{errors.first_name}</p>
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'last_name')
                          }
                        />
                        {touched?.last_name && errors?.last_name && (
                          <p className="error">{errors.last_name}</p>
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
                          <p className="error">{errors.gender}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form_field_wrapper">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <Box width={300}>
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
                          <p className="error">{errors.dob}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form_field_wrapper">
                        <Field
                          fullWidth
                          component={TextField}
                          label="Email *"
                          name="email_id"
                          type="email"
                          value={values?.email_id}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'email_id')
                          }
                        />
                        {touched?.email_id && errors?.email_id && (
                          <p className="error">{errors.email_id}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form_field_wrapper">
                        <Field
                          fullWidth
                          component={TextField}
                          label="Phone *"
                          name="phone"
                          value={values?.phone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'phone')
                          }
                        />
                        {touched?.phone && errors?.phone && (
                          <p className="error">{errors.phone}</p>
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
                                    backgroundColor: inputfieldhover(namecolor),
                                  },
                                }}
                              >
                                {qual}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched?.qualification && errors?.qualification && (
                          <p className="error">{errors.qualification}</p>
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'experience')
                          }
                        />
                        {touched?.experience && errors?.experience && (
                          <p className="error">{errors.experience}</p>
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
                                    backgroundColor: inputfieldhover(namecolor),
                                  },
                                }}
                              >
                                {item.entity_type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched?.entity_id && errors?.entity_id ? (
                          <p style={{ color: 'red' }}>{errors?.entity_id}</p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>

                    <div className="col-md-2">
                      <div className="form_field_wrapper">
                        <FormControl fullWidth>
                          <InputLabel>Class *</InputLabel>
                          <Select
                            name="class_id"
                            value={values?.class_id}
                            label="Class *"
                            onChange={(e: SelectChangeEvent<string>) =>
                              handleChange(e, 'class_id')
                            }
                            style={{
                              backgroundColor: isCollegeEntity(
                                values?.entity_id,
                              )
                                ? '#f0f0f0'
                                : inputfield(namecolor),
                              color: isCollegeEntity(values?.entity_id)
                                ? '#999999'
                                : inputfieldtext(namecolor),
                              border: isCollegeEntity(values?.entity_id)
                                ? '1px solid #d0d0d0'
                                : undefined,
                            }}
                            disabled={isCollegeEntity(values?.entity_id)}
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
                            {dataClasses?.map((classItem: any) => (
                              <MenuItem
                                key={classItem.id}
                                value={classItem.id}
                                sx={{
                                  backgroundColor: inputfield(namecolor),
                                  color: inputfieldtext(namecolor),
                                  '&:hover': {
                                    backgroundColor: inputfieldhover(namecolor),
                                  },
                                }}
                              >
                                {classItem.class_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched?.class_id && errors?.class_id && (
                          <p className="error">{errors.class_id}</p>
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
                              backgroundColor: isSchoolEntity(values?.entity_id)
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
                                value={university.university_id}
                                sx={{
                                  backgroundColor: inputfield(namecolor),
                                  color: inputfieldtext(namecolor),
                                  '&:hover': {
                                    backgroundColor: inputfieldhover(namecolor),
                                  },
                                }}
                              >
                                {university.university_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched?.university_id && errors?.university_id && (
                          <p className="error">{errors.university_id}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form_field_wrapper">
                        <FormControl fullWidth>
                          <InputLabel>Institute *</InputLabel>
                          <Select
                            name="institution_id"
                            value={values?.institution_id}
                            label="Institute *"
                            onChange={(e: SelectChangeEvent<string>) =>
                              handleChange(e, 'institution_id')
                            }
                            disabled={
                              isCollegeEntity(values?.entity_id)
                                ? !values?.university_id
                                : false
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
                                    backgroundColor: inputfieldhover(namecolor),
                                  },
                                }}
                              >
                                {institute?.institution_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched?.institution_id && errors?.institution_id && (
                          <p className="error">{errors?.institution_id}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form_field_wrapper">
                        <FormControl fullWidth>
                          <InputLabel>Course *</InputLabel>
                          <Select
                            name="course_id"
                            value={values?.course_id}
                            label="Course *"
                            onChange={(e: SelectChangeEvent<string>) =>
                              handleChange(e, 'course_id')
                            }
                            style={{
                              backgroundColor: isSchoolEntity(values?.entity_id)
                                ? '#f0f0f0'
                                : inputfield(namecolor),
                              color: isSchoolEntity(values?.entity_id)
                                ? '#999999'
                                : inputfieldtext(namecolor),
                              border: isSchoolEntity(values?.entity_id)
                                ? '1px solid #d0d0d0'
                                : undefined,
                            }}
                            disabled={
                              isSchoolEntity(values?.entity_id) ||
                              !values?.institution_id
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
                            {filteredCourses?.map((course: any) => (
                              <MenuItem
                                key={course.id}
                                value={course.id}
                                sx={{
                                  backgroundColor: inputfield(namecolor),
                                  color: inputfieldtext(namecolor),
                                  '&:hover': {
                                    backgroundColor: inputfieldhover(namecolor),
                                  },
                                }}
                              >
                                {course.course_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched?.course_id && errors?.course_id && (
                          <p className="error">{errors.course_id}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form_field_wrapper">
                        <FormControl fullWidth>
                          <InputLabel>Subjects *</InputLabel>
                          <Select
                            multiple
                            name="subjects"
                            value={values?.subjects}
                            label="Subjects *"
                            onChange={(e: SelectChangeEvent<string[]>) => {
                              handleChange(e, 'subjects');
                            }}
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
                            {filteredSubjects?.map((subject: any) => (
                              <MenuItem
                                key={subject.subject_id}
                                value={subject.subject_id}
                                sx={{
                                  backgroundColor: inputfield(namecolor),
                                  color: inputfieldtext(namecolor),
                                  '&:hover': {
                                    backgroundColor: inputfieldhover(namecolor),
                                  },
                                }}
                              >
                                {subject.subject_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched?.subjects && errors?.subjects && (
                          <p className="error">{errors.subjects}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form_field_wrapper">
                        <Field
                          fullWidth
                          component={TextField}
                          label="Address *"
                          name="address"
                          value={values?.address}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'address')
                          }
                        />
                        {touched?.address && errors?.address && (
                          <p className="error">{errors.address}</p>
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
                          classes="form-control p-3 custom-dropdown"
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
                          <p className="error">Please enter Country Name.</p>
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
                          classes="form-control p-3 custom-dropdown"
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'city')
                          }
                        />
                        {touched?.city && errors?.city && (
                          <p className="error">{errors.city}</p>
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'district')
                          }
                        />
                        {touched?.district && errors?.district && (
                          <p className="error">{errors.district}</p>
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
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'pincode')
                          }
                        />
                        {touched?.pincode && errors?.pincode && (
                          <p className="error">{errors.pincode}</p>
                        )}
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
  );
};

export default AddEditTeacher;
