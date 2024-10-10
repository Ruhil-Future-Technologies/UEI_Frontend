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
import { QUERY_KEYS_SUBJECT } from "../../utils/const";
import { toast } from "react-toastify";
import { Field, Form, Formik, FormikHelpers, FormikProps, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { MenuListinter } from "../../Components/Table/columns";
import { dataaccess, inputfield, inputfieldtext } from "../../utils/helpers";
import NameContext from "../Context/NameContext";


interface ISubjectForm {
  subject_name: string
  // created_by: string
}
const AddEditSubject = () => {
  const context = useContext(NameContext);
  const {namecolor }:any = context;
  const SubjectAddURL = QUERY_KEYS_SUBJECT.SUBJECT_ADD;
  const SubjectEditURL = QUERY_KEYS_SUBJECT.SUBJECT_EDIT;
  const { getData, postData, putData } = useApi();
  const navigator = useNavigate();
  const { id } = useParams();
  const userdata = JSON.parse(localStorage.getItem("userdata") || "");
  const charPattern = /^[a-zA-Z\s]*$/;
  

  const initialState = {
    subject_name: "",
    created_by: userdata?.id,
    description: "",
  };
  const [subject, setSubject] = useState(initialState);
  // const [subject_namecol, setSubjectNamevalid] = useState<boolean>(false);
  // const [selectedFile, setSelectedFile] = React.useState("");
  const formRef = useRef<FormikProps<ISubjectForm>>(null)

  const location = useLocation();
  const Menulist: any = localStorage.getItem('menulist1');
  const pathSegments = location.pathname.split('/').filter(Boolean);    
  const lastSegment =  id ? pathSegments[pathSegments.length - 3].toLowerCase(): pathSegments[pathSegments.length - 2].toLowerCase();
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


  useEffect(() => {
      // GetDataList()
      setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: ""},{ datatest: "" }));
  }, [Menulist])

  
  if ((id && !filteredData?.form_data?.is_update) || (!id && !filteredData?.form_data?.is_save)) {
    navigator("/main/Subject");
  }


  const callAPI = async () => {
    if (id) {
      getData(`${SubjectEditURL}${id ? `/${id}` : ""}`)
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
    setSubject((prevMenu) => {
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
      const handleSubmit = async (
        subjectData: ISubjectForm, 
        { resetForm }: FormikHelpers<ISubjectForm>
    ) => {
    // e.preventDefault();
    // e.target.reset()
    if (id) {
      // console.log("Submit 1", subjectData);
      putData(`${SubjectEditURL}/${id}`, subjectData)
        .then((data: any) => {
          // const linesInfo = data || [];
          // dispatch(setLine(linesInfo))
          if (data.status === 200) {
            navigator("/main/Subject");
            toast.success(data.message, {
              hideProgressBar: true,
              theme: "colored",
          });
          }else{
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
      postData(`${SubjectAddURL}`, subjectData)
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
        .matches(charPattern, 'Please enter a valid Subject name only characters allowed.'),
    description: Yup.string(),
    menu_image: Yup.string()
       
})

  return (
    <>
      <div className="profile_section">
        <div className="card">
          <div className="card-body">
            <Typography variant="h6">
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
                           
                           
                        }}
                        enableReinitialize
                        validationSchema={menuSchema}
                        innerRef={formRef}
                    >
                       {({ errors, values, touched }:any) => (
                            <Form>
            {/* <form onSubmit={(e) => handleSubmit(e, subject)}> */}
              <div className="row">
                <div className="col-md-4">
                  <div className="form_field_wrapper">
                    {/* <TextField
                      label="Subject Name"
                      name="subject_name"
                      value={subject.subject_name}
                      variant="outlined"
                      onChange={handleChange}
                     
                    /> */}
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
                  {/* {subject_namecol && (
                    <p style={{ color: "red" }}>
                      Please enter a valid Subject Name Only characters allowed.
                    </p>
                  )} */}
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-2">
                  <div className="col">
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{color:inputfieldtext(namecolor)}}>Upload a Photo</Typography>
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
                        style={{ color:inputfieldtext(namecolor)}}
                      />

                      {/* {selectedFile && (
                        <Typography variant="body1">{selectedFile}</Typography>
                      )} */}
                    </Grid>
                  </div>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-4">
                  <InputLabel className="text-secondary" sx={{color:inputfieldtext(namecolor)}}>
                    Description
                  </InputLabel>
                  <TextareaAutosize
                    aria-label="empty textarea"
                    minRows={5} 
                    style={{ width: "100%", fontSize:"1rem" ,backgroundColor:inputfield(namecolor) , color:inputfieldtext(namecolor) }} 
                    placeholder="Enter your text here..."
                    name="description"
                    value={values.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(e, "description")}
                  />
                </div>
              </div>
              <div className=" mt-3">
                <button className="btn btn-primary mainbutton">
                  {id ? "Update" : "Save"}
                </button>
              </div>
            {/* </form> */}
            </Form>
                        )}
                        </Formik>  
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditSubject;
