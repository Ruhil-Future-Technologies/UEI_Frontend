import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { useContext, useEffect, useState } from 'react'
import { QUERY_KEYS, QUERY_KEYS_COURSE, QUERY_KEYS_SEMESTER, QUERY_KEYS_UNIVERSITY } from '../../utils/const';
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { inputfield, inputfieldhover, inputfieldtext } from '../../utils/helpers';
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
    const { postData, getData, putData } = useApi()
    const navigator = useNavigate()
    const { id } = useParams();

    const initialState = {
        course_id: "",
        institution_id: "",
        semester_number: ""
    };
    const [semester, setSemester] = useState<any>(initialState);
    const [instituteList, setinstituteList] = useState<any[]>([])
    const [courseList, setCourseList] = useState<any[]>([])

    const callAPI = async () => {
        getData(`${InstituteListURL}`).then((data: { data: any[] }) => {
            const filteredData = data?.data.filter(item => item.is_active === 1);
            setinstituteList(filteredData);
            // setDataEntity(data?.data)
        }).catch(e => {
            if (e?.response?.status === 401) {
                navigator("/")
            }
            toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
            });
        });
        getData(`${CourseListURL}`).then((data: { data: any[] }) => {
            const filteredData = data?.data.filter(item => item.is_active === 1);
            setCourseList(filteredData);
            // setDataEntity(data?.data)
        }).catch(e => {
            if (e?.response?.status === 401) {
                navigator("/")
            }
            toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
            });
        });
        if (id) {
            getData(`${SemestereditURL}${id ? `/${id}` : ""}`)
                .then((data: any) => {
                    setSemester(data?.data);
                })
                .catch((e) => {
                    toast.error(e?.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                });
        }
    };
    useEffect(() => {
        callAPI();
    }, []);
    const handleSubmit = async (semesterData: any, { resetForm }: any) => {
        const semPayload = {
            course_id: semesterData.course,
            institution_id: semesterData.institute,
            semester_number: semesterData?.semester_name
        }

        if (id) {
            putData(`${semesterUpdateURL}/${id}`, semPayload)
                .then((data: any) => {
                    // const linesInfo = data || [];
                    // dispatch(setLine(linesInfo))
                    if (data.status === 200) {
                        navigator("/main/Semester");
                        resetForm();
                        toast.success(data.message, {
                            hideProgressBar: true,
                            theme: "colored",
                        });
                    } else {
                        toast.error(data.message, {
                            hideProgressBar: true,
                            theme: "colored",
                        });

                    }
                })
                .catch((e) => {
                    toast.error(e?.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                });
        } else {
            postData(`${SemesterAddURL}`, semPayload).then((data: { status: number, message: string }) => {
                if (data.status === 200) {
                    // navigator('/main/Course')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    resetForm();
                    setSemester(initialState)

                } else {
                    toast.error(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                }
            }).catch(e => {
                if (e?.response?.status === 401) {
                    navigator("/")
                }
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                });
            });
        }

    }
    const semesterSchema = Yup.object().shape({
        semester_name: Yup.string().required("Please select semester"),
        institute: Yup.string().required("Please select institute name"),
        course: Yup.string().required("Please select course name")

    })
    return (
        <>
            <div className='main-wrapper'>
                <div className="main-content">
                    <div className='card p-lg-3'>
                        <div className='card-body'>
                            <Typography variant="h6" className='mb-3'>
                                <div className='main_title'>{id ? "Edit" : "Add"} Semester</div>
                            </Typography>
                            <Formik
                                onSubmit={(formData, { resetForm }) => handleSubmit(formData, { resetForm })}
                                initialValues={{
                                    semester_name: semester?.semester_number,
                                    institute: semester?.institution_id,
                                    course: semester?.course_id,
                                }}
                                enableReinitialize
                                validationSchema={semesterSchema}
                            // innerRef={formRef}
                            >
                                {({ errors, values, touched, isValid, dirty, handleChange, handleBlur,setFieldValue,setFieldTouched,setFieldError }) => (
                                    <Form>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <div className="form_field_wrapper">
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label">Institute *</InputLabel>
                                                        <Select
                                                            onChange={handleChange}
                                                            // onChange={(event) => {
                                                            //     handleChange(event);
                                                            //     setFieldValue('course', ''); 
                                                            //     setFieldValue('semester_name', '');
                                                            // }}
                                                            // onChange={(event) => {
                                                            //     handleChange(event);
                                                            //     // setFieldValue('institute', event.target.value);
                                                            //     // setFieldTouched('institute', true, false); // Mark as touched without showing error
                                                            //     setFieldError('institute',undefined ); // Clear institute error message
                                                            //     setFieldValue('course', ''); // Optionally reset course
                                                            // }}
                                                            label="institute"
                                                            name="institute"


                                                            onBlur={handleBlur}
                                                            value={values.institute}
                                                            variant="outlined"
                                                            sx={{
                                                                backgroundColor: inputfield(namecolor),
                                                                color: inputfieldtext(namecolor)
                                                            }}
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    style: {
                                                                        backgroundColor: inputfield(namecolor),
                                                                        color: inputfieldtext(namecolor)
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            {instituteList.map((item, idx) => (
                                                                <MenuItem value={item.id} key={`${item.institution_name}-${idx + 1}`}

                                                                    sx={{
                                                                        backgroundColor: inputfield(namecolor),
                                                                        color: inputfieldtext(namecolor),
                                                                        '&:hover': {
                                                                            backgroundColor: inputfieldhover(namecolor),
                                                                        },
                                                                    }}
                                                                >{item.institution_name}</MenuItem>
                                                            ))}
                                                        </Select>
                                                        <Typography variant="body2" color="error">
                                                            {typeof errors?.institute === "string" && errors.institute}
                                                        </Typography>
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className="form_field_wrapper">
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label">Course *</InputLabel>
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
                                                                color: inputfieldtext(namecolor)
                                                            }}
                                                            MenuProps={{
                                                                PaperProps: {
                                                                    style: {
                                                                        backgroundColor: inputfield(namecolor),
                                                                        color: inputfieldtext(namecolor)
                                                                    },
                                                                },
                                                            }}
                                                        >
                                                            {courseList
                                                                .filter(item => values.institute === item.institution_id) // Filter condition
                                                                .map((item, idx) => (
                                                                    <MenuItem
                                                                        value={item.id}
                                                                        key={`${item.course_name}-${idx + 1}`}
                                                                        sx={{
                                                                            backgroundColor: inputfield(namecolor),
                                                                            color: inputfieldtext(namecolor),
                                                                            '&:hover': {
                                                                                backgroundColor: inputfieldhover(namecolor),
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
                                                        <Typography variant="body2" color="error">
                                                            {typeof errors?.course === "string" && errors.course}
                                                        </Typography>
                                                    </FormControl>
                                                </div>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className="form_field_wrapper">
                                                    <FormControl fullWidth>
                                                        <InputLabel id="semester-select-label">Semester *</InputLabel>
                                                        <Select
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            label="Semester"
                                                            name="semester_name"
                                                            value={values.semester_name}
                                                            error={Boolean(errors.semester_name && touched.semester_name)}
                                                            variant="outlined"
                                                            sx={{
                                                                backgroundColor: inputfield(namecolor),
                                                                color: inputfieldtext(namecolor)
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
                                                                            backgroundColor: inputfieldhover(namecolor),
                                                                        },
                                                                    }}
                                                                >
                                                                    Semester {index + 1}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        <Typography variant="body2" color="error">
                                                            {typeof errors?.semester_name === "string" && errors.semester_name}
                                                        </Typography>
                                                    </FormControl>
                                                </div>
                                            </div>

                                        </div>

                                        <div className=' mt-3'>
                                            <button className='btn btn-primary mainbutton' > Save</button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default AddSemester