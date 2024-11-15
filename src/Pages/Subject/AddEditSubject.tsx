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
import { QUERY_KEYS, QUERY_KEYS_COURSE, QUERY_KEYS_SUBJECT } from "../../utils/const";
import { toast } from "react-toastify";
import { Field, Form, Formik, FormikHelpers, FormikProps, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { MenuListinter } from "../../Components/Table/columns";
import { dataaccess, inputfield, inputfieldhover, inputfieldtext } from "../../utils/helpers";
import NameContext from "../Context/NameContext";


interface ISubjectForm {
  menu_image: string,
  subject_name: string,
  semester_id: string,
  course_id: string,
  pdf_content?: string,
  institution_id: string


  // created_by: string
}
const AddEditSubject = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const SubjectAddURL = QUERY_KEYS_SUBJECT.SUBJECT_ADD;
  const SubjectEditURL = QUERY_KEYS_SUBJECT.SUBJECT_EDIT;
  const SubjectGETURL = QUERY_KEYS_SUBJECT.SUBJECT_GET;
  const CourseListURL = QUERY_KEYS_COURSE.GET_COURSE;
  const InstituteListURL = QUERY_KEYS.GET_INSTITUTES;
  const { getData, postData, putData } = useApi();
  const navigator = useNavigate();
  const { id } = useParams();
  const userdata = JSON.parse(localStorage.getItem("userdata") || "");
  const charPattern = /^[a-zA-Z\s]*$/;


  const initialState = {
    subject_name: "",
    institution_id: "",
    created_by: userdata?.id,
    semester_id: "",
    course_id: "",
    menu_image: "",
    pdf_content: "",
    
  };
  const [subject, setSubject] = useState<any>(initialState);
  // const [subject_namecol, setSubjectNamevalid] = useState<boolean>(false);
  // const [selectedFile, setSelectedFile] = React.useState("");
  const formRef = useRef<FormikProps<ISubjectForm>>(null)

  const location = useLocation();
  const Menulist: any = localStorage.getItem('menulist1');
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const lastSegment = id ? pathSegments[pathSegments.length - 3].toLowerCase() : pathSegments[pathSegments.length - 2].toLowerCase();
  const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);
  const [courseList, setCourseList] = useState<any[]>([])
  const [courseListAll, setCourseListAll] = useState<any[]>([])
  const [totalSemester, setTotalSemester] = useState<any>([])
  const [semester, setSemester] = useState<any>([]);
  const [instituteList, setinstituteList] = useState<any[]>([])

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
      setCourseListAll(filteredData);
      
    }).catch(e => {
      if (e?.response?.status === 401) {
        navigator("/")
      }
      toast.error(e?.message, {
        hideProgressBar: true,
        theme: "colored",
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
      getData(`${SubjectGETURL}${id ? `/${id}` : ""}`)
        .then((data: any) => {
          setSubject(data?.data);
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
    if (fieldName === 'institution_id') {
      const courses = courseListAll.filter((item: any) => item.institution_id === e.target.value)
      setCourseList(courses)
     
       setSubject((prevMenu:any) => {
      return {
        ...prevMenu,
        ["course_id"]: "",
        ["semester_id"]: "",
      };
    });
    }
    if (fieldName === 'course_id') {
      const semesterCount = semester.filter((item: any) => item.course_id === e.target.value)
      setTotalSemester(semesterCount)
       setSubject((prevMenu:any) => {
      return {
        ...prevMenu,
        ["semester_id"]: "",
      };
    });
    }
    setSubject((prevMenu:any) => {
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
  const handleSubmit1 =()=>{
    
    const submitData = {
      subject_name: subject[""] as string || subject?.subject_name,
      pdf_content: subject?.pdf_content || "",
      semester_id: subject.semester_id,
      course_id: subject.course_id,
      institution_id: subject.institution_id
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
  const handleSubmit = async (
    subjectData: ISubjectForm,
    { resetForm }: FormikHelpers<ISubjectForm>
  ) => {
    // e.preventDefault();
    // e.target.reset()
    const submitData = {
      subject_name: subjectData.subject_name,
      pdf_content: subjectData?.menu_image || "",
      semester_id: subjectData.semester_id,
      course_id: subjectData.course_id,
      institution_id: subjectData.institution_id


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
            // navigator("/main/Subject");
            resetForm({ values: initialState });
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
        (value:any) => value && value?.trim().length > 0 
      )
      .matches(charPattern, 'Please enter a valid Subject name only characters allowed.'),
    description: Yup.string(),
    menu_image: Yup.string(),
    semester_id: Yup.string()
      .required("Please select Semester name"),
    course_id: Yup.string()
      .required("Please select Course name"),
      institution_id: Yup.string()
      .required("Please select institute name")
  })


  const maxSemester = totalSemester && totalSemester?.length > 0
  ? Math.max(...totalSemester?.map((item: { semester_number: any; }) => item?.semester_number))
  : 0;
 
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
                // onSubmit={(formData) => handleSubmit(formData)}
                onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                initialValues={{
                  subject_name: subject?.subject_name,
                  semester_id: subject?.semester_id,
                  course_id: subject?.course_id,
                  menu_image: subject?.pdf_content,
                  institution_id: subject?.institution_id
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
                                                    <FormControl fullWidth>
                                                        <InputLabel id="demo-simple-select-label">Institute *</InputLabel>
                                                        <Select
                                                            onChange={(e: SelectChangeEvent<string>) => handleChange(e, "institution_id")}
                                                            label="institute"
                                                            name="institution_id"
                                                            onBlur={handleBlur}
                                                            value={values.institution_id}
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
                              {typeof errors?.institution_id === "string" && errors.institution_id}
                            </Typography>
                                                    </FormControl>
                                                </div>
                                            </div>
                      <div className='col-md-4'>
                        <div className="form_field_wrapper">
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Course *</InputLabel>
                            <Select
                              onChange={(e: SelectChangeEvent<string>) => handleChange(e, "course_id")}
                              label="course"
                              name="course_id"


                              onBlur={handleBlur}
                              value={values.course_id}
                              error={Boolean(errors.course_name && touched.course_id)}
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

                              {courseList.map((item, idx) => (
                                <MenuItem value={item.id} key={`${item.course_name}-${idx + 1}`}

                                  sx={{
                                    backgroundColor: inputfield(namecolor),
                                    color: inputfieldtext(namecolor),
                                    '&:hover': {
                                      backgroundColor: inputfieldhover(namecolor),
                                    },
                                  }}
                                >{item.course_name}</MenuItem>
                              ))}
                            </Select>
                            <Typography variant="body2" color="error">
                              {typeof errors?.course_id === "string" && errors.course_id}
                            </Typography>
                          </FormControl>
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <div className="form_field_wrapper">
                          <FormControl fullWidth>
                            <InputLabel id="semester-select-label">Semester *</InputLabel>
                            <Select
                              onChange={(e: SelectChangeEvent<string>) => handleChange(e, "semester_id")}
                              onBlur={handleBlur}
                              label="Semester"
                              name="semester_id"
                              value={values.semester_id}
                              error={Boolean(errors.semester_name && touched.semester_id)}
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
                              {/* {[...Array(totalSemester[0]?.semester_number)].map((_, index) => ( */}
                            {  [...Array(maxSemester)]?.map((_, index) => (
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
                              {typeof errors?.semester_id === "string" && errors.semester_id}
                            </Typography>
                          </FormControl>
                        </div>
                      </div>
                      <div className="col-md-4 mt-4">
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
                            <p style={{ color: 'red' }}>{errors?.subject_name}</p> : <></>
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
                      <button className="btn btn-primary mainbutton">
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
                    {/* </form> */}
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

export default AddEditSubject;
