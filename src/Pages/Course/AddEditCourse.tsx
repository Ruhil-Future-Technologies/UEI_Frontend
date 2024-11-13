import React, { useContext, useEffect, useRef, useState } from 'react'
import '../Course/Course.scss';
import TextField from '@mui/material/TextField';
import TextareaAutosize from 'react-textarea-autosize';
import useApi from '../../hooks/useAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUERY_KEYS, QUERY_KEYS_COURSE } from '../../utils/const';
import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { CourseRep0oDTO, MenuListinter } from '../../Components/Table/columns';
import { Field, Form, Formik, FormikProps, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { dataaccess, inputfield, inputfieldhover, inputfieldtext } from '../../utils/helpers';
import NameContext from '../Context/NameContext';


const AddEditCourse = () => {
    const initialState = {
        // id: 0,
        institution_id:"",
        institute: "",
        course_name: "",
        duration:""
    };
    const context = useContext(NameContext);
    const { namecolor }: any = context;
    const CourseAddURL = QUERY_KEYS_COURSE.COURSE_ADD;
    const CourseEditURL = QUERY_KEYS_COURSE.COURSE_EDIT;
    const InstituteListURL = QUERY_KEYS.GET_INSTITUTES;
    const { getData, postData, putData } = useApi()
    const navigator = useNavigate()
    const { id } = useParams();
    const [course, setCourse] = useState<string | null>("");
    const [institute, setInstitute] = useState<any>(initialState);
    const [instituteList, setinstituteList] = useState<any[]>([])
    const [selectedFile, setSelectedFile] = React.useState('');
    // const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const formRef = useRef<FormikProps<{
        duration: any;
        institute: any;
        course_name: string | null
    }>>(null)
    const location = useLocation();
    const Menulist: any = localStorage.getItem('menulist1');
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = id ? pathSegments[pathSegments.length - 3].toLowerCase() : pathSegments[pathSegments.length - 2].toLowerCase();
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);

    // const GetDataList = () => {
    //     JSON.parse(Menulist)?.map((data: any) => {
    //         const fistMach = data?.menu_name.toLowerCase() === lastSegment && data;
    //         if (fistMach.length > 0) {
    //             setFilteredData(fistMach)
    //         }
    //         const result = data?.submenus?.filter((menu: any) => menu.menu_name.toLowerCase() === lastSegment)
    //         if (result.length > 0) {
    //             setFilteredData(result)
    //         }
    //     })
    // }

    // const GetDataList = () => {
    //     let filteredData = null;

    //     JSON.parse(Menulist)?.forEach((data: any) => {
    //         if (data?.menu_name.toLowerCase() === lastSegment) {
    //             filteredData = data; // Found a match in the main menu
    //         } else {
    //             const result = data?.submenus?.find((menu: any) => menu.menu_name.toLowerCase() === lastSegment);
    //             if (result) {
    //                 // Found a match in the submenu
    //                 filteredData = {
    //                     ...data,
    //                     submenus: [result] // Include only the matched submenu
    //                 };
    //             }
    //         }
    //     });

    //     if (filteredData) {
    //         setFilteredData(filteredData);

    //     } else {
    //         // Handle case when no match is found
    //         setFilteredData(null);

    //     }
    // }

    useEffect(() => {
        // GetDataList()
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: "" }, { datatest: "" }));
    }, [Menulist])


    if ((id && !filteredData?.form_data?.is_update) || (!id && !filteredData?.form_data?.is_save)) {
        navigator('/main/Course')
    }

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
        if (id) {
            getData(`${CourseEditURL}${id ? `/${id}` : ''}`).then((data: { data: any }) => {
                setInstitute(data?.data)
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

    useEffect(() => {
        callAPI()
    }, [])

    // const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     setCourse(e.target.value);
    //     formRef?.current?.setFieldValue("course_name", e.target.value);
    //     const err = await formRef?.current?.validateForm()
    //     if (err && Object.keys(err).length > 0) {
    //         formRef?.current?.setErrors(err)
    //         formRef?.current?.setTouched(setNestedObjectValues(err, true))
    //     }
    // };
    // const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, fieldName: string) => {
    //     setInstitute((prevInstitute: IInstituteForm) => {
    //         return {
    //             ...prevInstitute,
    //             [e.target.name]: e.target.value,
    //         };
    //     });
    //     formRef?.current?.setFieldValue(fieldName, e.target.value);
    //     await formRef?.current?.validateField(fieldName)
    //     if (formRef?.current?.errors?.[fieldName as keyof any] !== undefined) {
    //         formRef?.current?.setFieldError(fieldName, formRef?.current?.errors?.[fieldName as keyof any])
    //         formRef?.current?.setFieldTouched(fieldName, true)
    //     }
    // };
    // { course_name: string | null }


    useEffect(() => {
        // Update the institute field whenever the institute state changes
        formRef.current?.resetForm();
     }, [institute]);
    const handleSubmit = async (courseData: any) => {
      const coursedata =  {
            course_name: courseData.course_name,
            institution_id: JSON.stringify(courseData.institute),
             duration:  JSON.stringify(courseData.duration)
          }
        if (id) {
            putData(`${CourseEditURL}/${id}`, coursedata).then((data: { status: number,message:string }) => {
                if (data.status === 200) {
                    navigator('/main/Course')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                }else {
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
        } else {
            postData(`${CourseAddURL}`, coursedata).then((data: { status: number, message:string }) => {
                if (data.status === 200) {
                    // navigator('/main/Course')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    setCourse("")
                    setInstitute(initialState)
                }else {
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

    const courseSchema = Yup.object().shape({
        course_name: Yup.string()
            .required("Please enter course name")
            .test(
                "not-whitespace",
                "Please enter a valid course name; whitespace is not allowed.",
                (value:any) => value && value?.trim().length > 0 
              )
            .matches(/^[a-zA-Z0-9\s\-.]*$/,  'Please enter a valid course name'),
            institute: Yup.string()
            .required("Please select institute name"),
            duration: Yup.string()
            .required("Please select duration")
   
    })
    return (
        <>
            <div className='main-wrapper'>
                <div className="main-content">
                    <div className='card p-lg-3'>
                        <div className='card-body'>
                            <Typography variant="h6" className='mb-3'>
                                <div className='main_title'>{id ? "Edit" : "Add"} Course</div>
                            </Typography>
                            <Formik
                                onSubmit={(formData) => handleSubmit(formData)}
                                initialValues={{
                                    course_name: institute?.course_name,
                                    institute: institute?.institution_id,
                                    duration: institute?.duration
                                    // course_image: null,
                                    // course_description: ""
                                }}
                                enableReinitialize
                                validationSchema={courseSchema}
                                innerRef={formRef}
                            >
                                {({ errors, values, touched, isValid, dirty, handleChange, handleBlur }) => (
                                    <Form>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <div className="form_field_wrapper">
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label">Institute *</InputLabel>
                                                        <Select
                                                            onChange={handleChange}
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
                                                            // error={Boolean(errors.institute && touched.institute)}
                                                            
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
                                                    <Field
                                                        name="course_name"
                                                        render={({ field, form }: any) => (
                                                            <TextField
                                                                {...field}
                                                                className="form-control"
                                                                label="Course Name *"
                                                                error={Boolean(form.errors.course_name && form.touched.course_name)}
                                                                helperText={form.errors.course_name && form.touched.course_name ? form.errors.course_name : ""}
                                                                onBlur={form.handleBlur}
                                                                onChange={form.handleChange}
                                                            />
                                                        )}
                                                    />
                                                    {/* {touched?.course_name && errors?.course_name ?
                                                    <p style={{ color: 'red' }}>{errors?.course_name}</p> : <></>
                                                } */}
                                                </div>
                                            </div>
                                            <div className='col-md-4'>
                                                <div className="form_field_wrapper">
                                                    <FormControl fullWidth>
                                                        <InputLabel id="semester-select-label">Duration *</InputLabel>
                                                        <Select
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            label="duration"
                                                            name="duration"
                                                            value={values?.duration}
                                                            error={Boolean(errors.duration && touched.duration)}
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
                                                            {[...Array(4)].map((_, index) => (
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
                                                                     {index + 1}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        <Typography variant="body2" color="error">
                                                            {typeof errors?.duration === "string" && errors.duration}
                                                        </Typography>
                                                    </FormControl>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-4 mt-2'>
                                                <div className='col'>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row mt-4'>
                                        </div>
                                        <div className=' mt-3'>
                                            <button className='btn btn-primary mainbutton' >{id ? "Update" : "Save"}</button>
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

export default AddEditCourse