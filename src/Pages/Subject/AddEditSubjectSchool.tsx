import React, { useContext, useEffect, useRef, useState } from "react";
import "../Subject/Subject.scss";
import TextareaAutosize from 'react-textarea-autosize';
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Grid, InputLabel, Typography } from "@mui/material";
import useApi from "../../hooks/useAPI";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QUERY_KEYS_COURSE, QUERY_KEYS_SUBJECT, QUERY_KEYS_SUBJECT_SCHOOL } from "../../utils/const";
import { toast } from "react-toastify";
import { Field, Form, Formik, FormikHelpers, FormikProps, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { MenuListinter } from "../../Components/Table/columns";
import { dataaccess, inputfield, inputfieldhover, inputfieldtext } from "../../utils/helpers";
import NameContext from "../Context/NameContext";


interface ISubjectForm {
    menu_image: string,
    subject_name: string,
    class_id: string,
    stream: string,
    pdf_content?: string,

    // created_by: string
}
interface Classes {
    id: number;
    class_name: string;
    class_id: string;
}
const AddEditSubjectSchool = () => {
    const context = useContext(NameContext);
    const { namecolor }: any = context;
    const SubjectAddURL = QUERY_KEYS_SUBJECT_SCHOOL.SUBJECT_ADD;
    const SubjectEditURL = QUERY_KEYS_SUBJECT_SCHOOL.SUBJECT_EDIT;
    const SubjectEditgetURL = QUERY_KEYS_SUBJECT_SCHOOL.SUBJECT_GET;
    //   const CourseListURL = QUERY_KEYS_COURSE.GET_COURSE;
    const { getData, postData, putData } = useApi();
    const navigator = useNavigate();
    const { id } = useParams();
    const userdata = JSON.parse(localStorage.getItem("userdata") || "");
    const charPattern = /^[a-zA-Z\s]*$/;


    const initialState = {
        subject_name: "",
        created_by: userdata?.id,
        class_id: "",
        stream: "",
        menu_image: "",
        pdf_content: "",

    };
    const [subject, setSubject] = useState<any>(initialState);
    const [classes, setClasses] = useState<Classes[]>([]);
    // const [subject_namecol, setSubjectNamevalid] = useState<boolean>(false);
    // const [selectedFile, setSelectedFile] = React.useState("");
    const formRef = useRef<FormikProps<ISubjectForm>>(null)

    const location = useLocation();
    const Menulist: any = localStorage.getItem('menulist1');
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = id ? pathSegments[pathSegments.length - 3].toLowerCase() : pathSegments[pathSegments.length - 2].toLowerCase();
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);
    const [courseList, setCourseList] = useState<any[]>([])
    const [totalSemester, setTotalSemester] = useState<any>([])
    const [semester, setSemester] = useState<any>([]);
    const [particularClass, setParticularClass] = useState("");

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


    useEffect(() => {
        // GetDataList()
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: "" }, { datatest: "" }));
    }, [Menulist])


    if ((id && !filteredData?.form_data?.is_update) || (!id && !filteredData?.form_data?.is_save)) {
        navigator("/main/Subject");
    }


    const callAPI = async () => {
        // getData(`${CourseListURL}`).then((data: { data: any[] }) => {
        //   const filteredData = data?.data.filter(item => item.is_active === 1);
        //   setCourseList(filteredData);
        //   // setDataEntity(data?.data)
        // }).catch(e => {
        //   if (e?.response?.status === 401) {
        //     navigator("/")
        //   }
        //   toast.error(e?.message, {
        //     hideProgressBar: true,
        //     theme: "colored",
        //   });
        // });
        getData("/class/list")
            .then((response: any) => {
                if (response.status === 200) {
                    // const filteredData = response?.data?.filter((item:any) => item?.is_active === 1);
                    const filteredData = response?.data?.filter(
                        (item: any) => item?.is_active === true
                    );
                    const getModifyClassMane = (value: string) => {
                        return value?.replace("_", " ");
                    };
                    const newClassObject = filteredData.map((item: any) => {
                        return {
                            id: item?.id,
                            class_name: getModifyClassMane(item?.class_name),
                            class_id: item?.class_id,
                        };
                    })
                        .sort((a: { class_name: string; }, b: { class_name: any; }) => a.class_name.localeCompare(b.class_name));
                    setClasses(newClassObject || []);
                    // setCourses(response.data);
                }
            })
            .catch((error) => {
                toast.error(error?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                    position: "top-center",
                });
            });
        getData("/semester/list")
            .then((response: any) => {
                if (response.status === 200) {
                    const filteredData = response?.data?.filter(
                        (item: any) => item?.is_active === 1
                    );
                    setSemester(filteredData || []);
                    // setCourses(response.data);
                }
            })
            .catch((error) => {
                toast.error(error?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                    position: "top-center",
                });
            });
        if (id) {
            getData(`${SubjectEditgetURL}${id ? `/${id}` : ""}`)
                .then((data: any) => {
                    setSubject(data?.data);
                    getData(`/class/get/${data?.data?.class_id}`).then((response: any) => {
                        if (response.status === 200) {
                            setParticularClass(response.data.class_name);
                        } else setParticularClass("");
                    });
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
    useEffect(() => {
        if (id) {
            const semesterCount = semester.filter((item: any) => item.course_id === subject.course_id)
            setTotalSemester(semesterCount)
        }
    }, [id, semester]);
    // const handleChange = (e: any) => {
    //   const { name, value } = e.target;
    //   if (name === "subject_name") {
    //     if (!/^[a-zA-Z\s]*$/.test(value)) {
    //       setSubjectNamevalid(true);
    //     } else {
    //       setSubjectNamevalid(false);
    //     }
    //   }
    //   setSubject((prevUser) => {
    //     return {
    //       ...prevUser,
    //       [e.target.name]: e.target.value,
    //     };
    //   });
    // };
    // const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, fieldName: string) => {
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, fieldName: string) => {

        // if (fieldName === 'course_id') {
        //     const semesterCount = semester.filter((item: any) => item.course_id === e.target.value)
        //     setTotalSemester(semesterCount)
        //     setSubject((prevMenu: any) => {
        //         return {
        //             ...prevMenu,
        //             ["semester_id"]: "",
        //         };
        //     });
        // }
        if (fieldName === "class_id") {
            getData(`/class/get/${e.target.value}`).then((response: any) => {
                if (response.status === 200) {
                    setParticularClass(response.data.class_name);
                } else setParticularClass("");
            });
        }
        setSubject((prevMenu: any) => {
            return {
                ...prevMenu,
                [e.target.name]: e.target.value,
            };
        });
        formRef?.current?.setFieldValue(fieldName, e.target.value);
        await formRef?.current?.validateField(fieldName)
        if (formRef?.current?.errors?.[fieldName as keyof ISubjectForm] !== undefined) {
            formRef?.current?.setFieldError(fieldName, formRef?.current?.errors?.[fieldName as keyof ISubjectForm])
            formRef?.current?.setFieldTouched(fieldName, true)
        }
    };

    // const handleSubmit = async (
    //   e: React.FormEvent<HTMLFormElement>,
    //   subjectData: { subject_name: string }
    // ) => {
    // const handleSubmit = async (subjectData: ISubjectForm) => {
    const handleSubmit1 = () => {

        const submitData = {
            subject_name: subject[""] as string,
            pdf_content: subject?.pdf_content || "",
            class_id: subject.class_id,
            stream: subject.stream || ""
        }
        if (!submitData.subject_name || !submitData.class_id) {
            return;
        }
        if (
            (particularClass === "class_11" || particularClass === "class_12") &&
            !submitData.stream
        ) {
            return;
        }
        if (id) {
            putData(`${SubjectEditURL}/${id}`, submitData)
                .then((data: any) => {
                    // const linesInfo = data || [];
                    // dispatch(setLine(linesInfo))
                    if (data.status === 200) {
                        navigator("/main/Subject");
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
        }
    }
    const handleSubmit123 =()=>{

    }
    const handleSubmit = async (

    ) => {
        // e.preventDefault();
        // e.target.reset()

        const submitData = {
            //   subject_name: subject.subject_name,
            subject_name: subject[""] as string,
            pdf_content: subject?.menu_image || "",
            class_id: subject.class_id,
            stream: subject.stream || ""
        }
        if (!submitData.subject_name || !submitData.class_id) {
            return;
        }
        if (
            (particularClass === "class_11" || particularClass === "class_12") &&
            !submitData.stream
        ) {
            return;
        }
        if (id) {
            putData(`${SubjectEditURL}/${id}`, submitData)
                .then((data: any) => {
                    // const linesInfo = data || [];
                    // dispatch(setLine(linesInfo))
                    if (data.status === 200) {
                        navigator("/main/Subject");
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
            postData(`${SubjectAddURL}`, submitData)
                .then((data: any) => {
                    // const linesInfo = data || [];
                    // dispatch(setLine(linesInfo))
                    if (data.status === 200) {
                        toast.success(data?.message, {
                            hideProgressBar: true,
                            theme: "colored",
                        });

                        // resetForm({ values: initialState });
                        setSubject(initialState)
                    }
                    else {
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
        }
    };
    const menuSchema = Yup.object().shape({
        subject_name: Yup.string()
            .required("Please enter Subject name")
            .test(
                "not-whitespace",
                "Please enter a valid Subject name;not-whitespace only characters allowed.",
                (value: any) => value && value?.trim().length > 0
            )
            .matches(charPattern, 'Please enter a valid Subject name only characters allowed.'),
        description: Yup.string(),
        menu_image: Yup.string(),
        class_id: Yup.string()
            .required("Please select Class name"),
        stream: Yup.string()
            .required("Please select Stream")
    })

    return (
        <>
            <div className="main-wrapper">
                <div className="main-content">
                    <div className="card p-lg-3">
                        <div className="card-body">
                            <Typography variant="h6" className="mb-3">
                                {id ? (
                                    <div className="main_title">Edit Subject</div>
                                ) : (
                                    <div className="main_title">Add Subject</div>
                                )}
                            </Typography>
                            <Formik
                                onSubmit={(formData) => handleSubmit123()}
                                // onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                                initialValues={{
                                    subject_name: subject?.subject_name,
                                    class_id: subject?.class_id,
                                    stream: subject?.stream,
                                    menu_image: subject?.pdf_content
                                }}
                                enableReinitialize
                                validationSchema={menuSchema}
                                innerRef={formRef}
                            >
                                {({ errors, values, touched, handleBlur }: any) => (
                                    <Form>
                                        {/* <form onSubmit={(e) => handleSubmit(e, subject)}> */}
                                        <div className="row">
                                            <div className='col-md-4'>
                                                <div className="form_field_wrapper">
                                                    <FormControl
                                                        //   required
                                                        sx={{ m: 0, minWidth: 220, width: "100%" }}
                                                    >
                                                        <InputLabel>Class</InputLabel>
                                                        <Select
                                                            name="class_id"
                                                            value={values.class_id}
                                                            sx={{
                                                                backgroundColor: "#f5f5f5",
                                                            }}
                                                            onChange={(e: SelectChangeEvent<string>) => handleChange(e, "class_id")}
                                                            label="Class"
                                                            onBlur={handleBlur}
                                                        >
                                                            {classes.map((classes) => (
                                                                <MenuItem
                                                                    key={classes.id}
                                                                    value={classes.id}
                                                                    sx={{
                                                                        backgroundColor: inputfield(namecolor),
                                                                        color: inputfieldtext(namecolor),
                                                                        "&:hover": {
                                                                            backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                                                                        },
                                                                    }}
                                                                >
                                                                    {classes.class_name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        <Typography variant="body2" color="error">
                                                            {typeof errors?.class_id === "string" && errors.class_id}
                                                        </Typography>
                                                    </FormControl>
                                                </div>
                                            </div>

                                            {(particularClass === "class_11" ||
                                                particularClass === "class_12") && (
                                                    <div className="col-lg-2 form_field_wrapper">
                                                        <FormControl
                                                            // required
                                                            sx={{ m: 0, minWidth: 70, width: "100%", maxWidth: 250 }}
                                                        >
                                                            <InputLabel>Stream</InputLabel>
                                                            <Select
                                                                name="stream"
                                                                value={values.stream}
                                                                sx={{
                                                                    backgroundColor: "#f5f5f5",
                                                                }}
                                                                onChange={(e: SelectChangeEvent<string>) => handleChange(e, "stream")}
                                                                label="Stream"
                                                                onBlur={handleBlur}
                                                            >
                                                                <MenuItem
                                                                    value="science"
                                                                    sx={{
                                                                        backgroundColor: inputfield(namecolor),
                                                                        color: inputfieldtext(namecolor),
                                                                        "&:hover": {
                                                                            backgroundColor: inputfieldhover(namecolor),
                                                                        },
                                                                    }}
                                                                >
                                                                    Science
                                                                </MenuItem>
                                                                <MenuItem
                                                                    value="commerce"
                                                                    sx={{
                                                                        backgroundColor: inputfield(namecolor),
                                                                        color: inputfieldtext(namecolor),
                                                                        "&:hover": {
                                                                            backgroundColor: inputfieldhover(namecolor),
                                                                        },
                                                                    }}
                                                                >
                                                                    Commerce
                                                                </MenuItem>
                                                                <MenuItem
                                                                    value="arts"
                                                                    sx={{
                                                                        backgroundColor: inputfield(namecolor),
                                                                        color: inputfieldtext(namecolor),
                                                                        "&:hover": {
                                                                            backgroundColor: inputfieldhover(namecolor),
                                                                        },
                                                                    }}
                                                                >
                                                                    Arts
                                                                </MenuItem>
                                                            </Select>
                                                            <Typography variant="body2" color="error">
                                                                {typeof errors?.stream === "string" && errors.stream}
                                                            </Typography>
                                                        </FormControl>
                                                    </div>
                                                )}

                                            <div className="col-md-4">
                                                <div className="form_field_wrapper">

                                                    <Field
                                                        component={TextField}
                                                        type="text"
                                                        name="subject_name"
                                                        label="Subject Name *"
                                                        value={values?.subject_name}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "subject_name")}
                                                    />
                                                    {touched?.subject_name && errors?.subject_name ?
                                                        <Typography variant="body2" color="error">{errors?.subject_name}</Typography> : <></>
                                                    }

                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-4 mt-2">
                                                <div className="col">
                                                    <Grid item xs={12}>
                                                        <Typography variant="h6" sx={{ color: inputfieldtext(namecolor) }}>Upload a Photo</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.doc,.docx"
                                                            // onChange={(event) =>
                                                            //   setSelectedFile(event.target.value)
                                                            // }
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "menu_image")}
                                                            id="file-upload"
                                                            name='menu_image'
                                                            style={{ color: inputfieldtext(namecolor) }}
                                                        />
                                                    </Grid>
                                                </div>
                                            </div>
                                        </div>

                                        <div className=" mt-3">
                                            {!id ?
                                                <button className="btn btn-primary mainbutton" type="submit" onClick={() => handleSubmit()}>
                                                    {id ? "Update" : "Save"}
                                                </button>
                                                :
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary mainbutton"
                                                    onClick={() => handleSubmit1()}
                                                >
                                                    Update
                                                </button>
                                            }
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

export default AddEditSubjectSchool;
