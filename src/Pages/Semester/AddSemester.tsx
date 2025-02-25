/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import {
  QUERY_KEYS,
  QUERY_KEYS_COURSE,
  QUERY_KEYS_SEMESTER,
} from '../../utils/const';
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fieldIcon,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from '../../utils/helpers';
import NameContext from '../Context/NameContext';
import * as Yup from 'yup';

const AddSemester = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const SemesterAddURL = QUERY_KEYS_SEMESTER.SEMESTER_ADD;
  const SemestereditURL = QUERY_KEYS_SEMESTER.SEMESTER_GET;
  const semesterUpdateURL = QUERY_KEYS_SEMESTER.SEMESTER_UPDATE;
  const InstituteListURL = QUERY_KEYS.GET_INSTITUTES;
  const CourseListURL = QUERY_KEYS_COURSE.GET_COURSE;
  const { postDataJson, getData, putData } = useApi();
  const navigator = useNavigate();
  const { id } = useParams();

  const initialState = {
    course_id: '',
    institution_id: '',
    semester_number: '',
  };
  const [semester, setSemester] = useState<any>(initialState);
  const [instituteList, setinstituteList] = useState<any[]>([]);
  const [courseList, setCourseList] = useState<any[]>([]);

  const callAPI = async () => {
    getData(`${InstituteListURL}`)
      .then((data: { data: any[] }) => {
        const filteredData = data?.data.filter(
          (item) => item.is_active && item.is_approve ,
        );
        setinstituteList(filteredData);
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigator('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
    getData(`${CourseListURL}`)
      .then((data) => {
        console.log(data);
        if(data.status){
          const filteredData = data?.data?.course_data?.filter((item:any) => item.is_active);
          setCourseList(filteredData);
        }
       
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigator('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
    if (id) {
      getData(`${SemestereditURL}${id ? `/${id}` : ''}`)
        .then((data: any) => {
          setSemester(data?.data);
        })
        .catch((e) => {
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
  const handleSubmit = async (semesterData: any, { resetForm }: any) => {
    const formData = new FormData();
    const semPayload = {
      course_id: semesterData.course,
      institution_id: semesterData.institute,
      semester_number: Number(semesterData?.semester_name),
    } as any;
    console.log(typeof (semPayload.semester_number) );
    if (id) {
      Object.keys(semPayload).forEach((key) => {
        formData.append(key, semPayload[key]);
      });
     
      putData(`${semesterUpdateURL}/${id}`, semPayload)
        .then((data: any) => {
          if (data.status) {
            navigator('/main/Semester');
            resetForm();
            toast.success(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          } else {
            toast.error(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    } else {
      Object.keys(semPayload).forEach((key) => {
        formData.append(key, semPayload[key]);
      });
      postDataJson(`${SemesterAddURL}`, semPayload)
        .then((data) => {
          if (data.status) {
            toast.success(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
            resetForm();
            setSemester(initialState);
          } else {
            toast.error(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
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
  const semesterSchema = Yup.object().shape({
    semester_name: Yup.string().required('Please select semester'),
    institute: Yup.string().required('Please select institute name'),
    course: Yup.string().required('Please select course name'),
  });
  return (
    <>
      <div className="main-wrapper">
        <div className="main-content">
          <div className="card p-lg-3">
            <div className="card-body">
              <Typography variant="h6" className="mb-3">
                <div className="main_title">{id ? 'Edit' : 'Add'} Semester</div>
              </Typography>
              <Formik
                onSubmit={(formData, { resetForm }) =>
                  handleSubmit(formData, { resetForm })
                }
                initialValues={{
                  semester_name: semester?.semester_number,
                  institute: semester?.institution_id,
                  course: semester?.course_id,
                }}
                enableReinitialize
                validationSchema={semesterSchema}
              >
                {({ errors, values, touched, handleChange, handleBlur }) => (
                  <Form>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form_field_wrapper">
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Institute *
                            </InputLabel>
                            <Select
                              onChange={handleChange}
                              label="institute"
                              name="institute"
                              onBlur={handleBlur}
                              value={values.institute}
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
                              {instituteList.map((item, idx) => (
                                <MenuItem
                                  value={item.id}
                                  key={`${item.institute_name}-${idx + 1}`}
                                  sx={{
                                    backgroundColor: inputfield(namecolor),
                                    color: inputfieldtext(namecolor),
                                    '&:hover': {
                                      backgroundColor:
                                        inputfieldhover(namecolor),
                                    },
                                  }}
                                >
                                  {item.institute_name}
                                </MenuItem>
                              ))}
                            </Select>
                            {touched?.institute && errors?.institute && (
                              <p className="error">
                                {String(errors.institute)}
                              </p>
                            )}
                          </FormControl>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form_field_wrapper">
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              Course *
                            </InputLabel>
                            <Select
                              onChange={handleChange}
                              // onChange={(event) => {
                              //     handleChange(event);
                              //     setFieldValue('semester_name', '');
                              // }}
                              label="course"
                              name="course"
                              onBlur={handleBlur}
                              value={values.course}
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
                              {courseList
                                .filter(
                                  (item) =>
                                    values.institute === item.institution_id,
                                ) // Filter condition
                                .map((item, idx) => (
                                  <MenuItem
                                    value={item.id}
                                    key={`${item.course_name}-${idx + 1}`}
                                    sx={{
                                      backgroundColor: inputfield(namecolor),
                                      color: inputfieldtext(namecolor),
                                      '&:hover': {
                                        backgroundColor:
                                          inputfieldhover(namecolor),
                                      },
                                    }}
                                  >
                                    {item.course_name}
                                  </MenuItem>
                                ))}
                              {/* {courseList.map((item, idx) => (
                                                                <MenuItem value={item.id} key={`${item.course_name}-${idx + 1}`}

                                                                    sx={{
                                                                        backgroundColor: inputfield(namecolor),
                                                                        color: inputfieldtext(namecolor),
                                                                        '&:hover': {
                                                                            backgroundColor: inputfieldhover(namecolor),
                                                                        },
                                                                    }}
                                                                >{item.course_name}</MenuItem>
                                                            ))} */}
                            </Select>
                            {touched?.course && errors?.course && (
                              <p className="error">{String(errors.course)}</p>
                            )}
                          </FormControl>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form_field_wrapper">
                          <FormControl fullWidth>
                            <InputLabel id="semester-select-label">
                              Semester *
                            </InputLabel>
                            <Select
                              onChange={handleChange}
                              onBlur={handleBlur}
                              label="Semester"
                              name="semester_name"
                              value={values.semester_name}
                              error={Boolean(
                                errors.semester_name && touched.semester_name,
                              )}
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
                              {/* Generate menu items for semesters 1 to 8 */}
                              {[...Array(8)].map((_, index) => (
                                <MenuItem
                                  key={`${index + 1}`}
                                  value={index + 1}
                                  sx={{
                                    backgroundColor: inputfield(namecolor),
                                    color: inputfieldtext(namecolor),
                                    '&:hover': {
                                      backgroundColor:
                                        inputfieldhover(namecolor),
                                    },
                                  }}
                                >
                                  Semester {index + 1}
                                </MenuItem>
                              ))}
                            </Select>

                            {touched?.semester_name &&
                              errors?.semester_name && (
                                <p className="error">
                                  {String(errors.semester_name)}
                                </p>
                              )}
                          </FormControl>
                        </div>
                      </div>
                    </div>

                    <div className=" mt-3">
                      <button className="btn btn-primary mainbutton">
                        {' '}
                        Save
                      </button>
                    </div>
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

export default AddSemester;
