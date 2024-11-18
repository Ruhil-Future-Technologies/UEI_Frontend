import React, { useContext, useEffect, useState } from "react";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
// import { toast } from 'react-toastify';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useAPI";
import {
  LocalizationProvider,
  DateTimePicker,
  DatePicker,
} from "@mui/x-date-pickers";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { QUERY_KEYS_STUDENT } from "../../utils/const";
import { useNavigate, useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { toast } from "react-toastify";
import maleImage from "../../assets/img/avatars/male.png";
import femaleImage from "../../assets/img/avatars/female.png";
import { deepEqual } from "../../utils/helpers";
import NameContext from "../Context/NameContext";
import { ChildComponentProps } from "../StudentProfile";

interface StudentBasicInformation {
  student_id?: number;
  first_name?: string;
  last_name?: string;
  gender?: string;
  dob?: Dayjs | null;
  father_name?: string;
  mother_name?: string;
  guardian_name?: string;
  pic_path?: string;
  aim?: string;
}

const StudentBasicInfo: React.FC<ChildComponentProps> = ({ setActiveForm }) => {
  const context = useContext(NameContext);
  const { setNamepro, setProImage }: any = context;
  let StudentId = localStorage.getItem("_id");
  const { getData, postData, putData, postFileData } = useApi();
  const [gender, setGender] = useState("Male");
  const [name, setName] = useState();
  const [lastname, setlastName] = useState();
  const [dob, setDob] = useState<Date | null>();
  const [selectedFile, setSelectedFile] = useState();
  const [filePreview, setFilePreview] = useState(null);
  const [editFalg, setEditFlag] = useState<boolean>(false);
  const [proFalg, setProFlag] = useState<boolean>(false);
  const someDate = dayjs(); // Creating a Dayjs object representing the current date and time
  const [fname_col, setFname_col] = useState<boolean>(false);
  const [lname_col, setLname_col] = useState<boolean>(false);
  const [fathername_col, setFathername_col] = useState<boolean>(false);
  const [mothername_col, setMothername_col] = useState<boolean>(false);
  const [gname_col, setGname_col] = useState<boolean>(false);
  const [aim_col, setaim_col] = useState<boolean>(false);
  const [dobset_col, setdobset_col] = useState<boolean>(false);
  const [fname_col1, setFname_col1] = useState<boolean>(false);
  const [lname_col1, setLname_col1] = useState<boolean>(false);
  const [fathername_col1, setFathername_col1] = useState<boolean>(false);
  const [mothername_col1, setMothername_col1] = useState<boolean>(false);
  const [error1, setError1] = useState("");

  useEffect(() => {
    localStorage.setItem("proFalg", proFalg ? "true" : "false");
  }, [proFalg]);

  const [basicInfo, setBasicInfo] = useState<StudentBasicInformation>({
    student_id: 0,
    first_name: "",
    last_name: "",
    gender: "male",
    dob: dayjs("dd-mm-yyyy"),
    father_name: "",
    mother_name: "",
    guardian_name: "",
    pic_path: "",
    aim: "",
  });
  const [initialAdminState, setInitialState] = useState<any | null>({});

  const getStudentBasicInfo = async () => {
    getData(`${"student/get/" + StudentId}`, StudentId)
      .then((data: any) => {
        if (data?.status === 200) {
          // console.log(data);
          // setBasicInfo(data);
          if (data?.data?.pic_path !== "") {
            getData(`${"upload_file/get_image/" + data?.data?.pic_path}`)
              .then((imgdata: any) => {
                setFilePreview(imgdata.data);
              })
              .catch((e) => {});
          }
          setBasicInfo(data?.data);
          setInitialState({
            student_login_id: StudentId,
            first_name: data?.data?.first_name,
            last_name: data?.data?.last_name,
            gender: data?.data?.gender,
            dob: data?.data?.dob || null,
            father_name: data?.data?.father_name,
            mother_name: data?.data?.mother_name,
            guardian_name: data?.data?.guardian_name,
            pic_path: selectedFile ? selectedFile : data?.data?.pic_path,
            aim: data?.data?.aim,
          });

          // setSelectedFile(data?.data?.pic_path);
          // console.log(typeof data?.data?.gender);
        } else if (data?.status === 404) {
          setEditFlag(true);
          toast.warning("Please add your information", {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center",
          });
        } else {
          // console.log("error comes from api");
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center",
        });
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getStudentBasicInfo();
    // getData(`${"student/get/" + StudentId}`, StudentId)
    //   .then((data: any) => {

    //     if (data?.status === 200) {
    //       console.log(data);
    //       // setBasicInfo(data);
    //       getData(`${"upload_file/get_image/" +data.data.pic_path }`)
    //       .then((imgdata: any) => {
    //         setFilePreview(imgdata.data)
    //       }).catch((e) => {

    //       });
    //       setBasicInfo(data?.data);
    //       setInitialState({
    //         student_login_id: StudentId,
    //         first_name:data?.data?.first_name,
    //         last_name: data?.data?.last_name,
    //         gender: data?.data?.gender,
    //         dob: data?.data?.dob || null,
    //         father_name: data?.data?.father_name,
    //         mother_name: data?.data?.mother_name,
    //         guardian_name: data?.data?.guardian_name,
    //         pic_path: selectedFile ? selectedFile : data?.data?.pic_path,
    //         aim: data?.data?.aim,

    //       })

    //       // setSelectedFile(data?.data?.pic_path);
    //       // console.log(typeof data?.data?.gender);
    //     } else if (data?.status === 404) {
    //       setEditFlag(true);
    //     } else {
    //       // console.log("error comes from api");
    //     }
    //   })
    //   .catch((e) => {
    //     toast.error(e?.message, {
    //       hideProgressBar: true,
    //       theme: "colored",
    //     });
    //   });
    if (Object.keys(basicInfo).length === 0) {
      //postData(`${'student/add'}`)
    }
  }, []);

  const [error, setError]: any = useState({});

  const handleChange = (event: any) => {
    let { name, value } = event.target;

    if (name === "first_name") {
      setFname_col1(true);
      // if (!/^[a-zA-Z\s]*$/.test(value)) {
        if (!/^[A-Za-z]+(?:[ A-Za-z]+)*$/.test(value)) {
        setFname_col(true);
      } else {
        setFname_col(false);
      }
    }
    if (name === "last_name") {
      setLname_col1(true);
      // if (!/^[a-zA-Z\s]*$/.test(value)) {
        if (!/^[A-Za-z]+(?:[ A-Za-z]+)*$/.test(value)) {
        setLname_col(true);
      } else {
        setLname_col(false);
      }
    }
    if (name === "father_name") {
      setFathername_col1(true);
      // if (!/^[a-zA-Z\s]*$/.test(value)) {
        if (!/^[A-Za-z]+(?:[ A-Za-z]+)*$/.test(value)) {
        setFathername_col(true);
      } else {
        setFathername_col(false);
      }
    }
    if (name === "mother_name") {
      setMothername_col1(true);
      // if (!/^[a-zA-Z\s]*$/.test(value)) {
        if (!/^[A-Za-z]+(?:[ A-Za-z]+)*$/.test(value)) {
        setMothername_col(true);
      } else {
        setMothername_col(false);
      }
    }
    if (name === "guardian_name") {
      // if (!/^[a-zA-Z\s]*$/.test(value)) {
        if (!/^[A-Za-z]+(?:[ A-Za-z]+)*$/.test(value)) {
        setGname_col(true);
      } else {
        setGname_col(false);
      }
    }
    if (name === "aim") {
      // if (!/^[a-zA-Z\s]*$/.test(value)) {
        if (!/^[A-Za-z]+(?:[ A-Za-z]+)*$/.test(value)) {
        setaim_col(true);
      } else {
        setaim_col(false);
      }
    }
    if (name === "pic_path") {
      const formData = new FormData();
      const { files } = event.target;

      if (files && files[0]) {
        const file: any = files[0];

        // Check file size (3MB = 3 * 1024 * 1024 bytes)
        if (file.size > 3 * 1024 * 1024) {
          setError1("File size must be less than 3MB");
          return;
        }

        // Check file size (5KB = 5 * 1024 bytes)
        // if (file.size > 6 * 1024) {
        //   setError1('File size must be less than 5KB');
        //   return;
        // }

        // Check file type (only JPG and PNG allowed)
        if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
          setError1("Only JPG and PNG files are allowed");
          return;
        }

        setError1("");
        // console.log('file',file)
        const reader: any = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
        formData.append("file", file);
        value = file.name;
        postFileData(`${"upload_file/upload"}`, formData)
          .then((data: any) => {
            if (data?.status === 200) {
              toast.success(data?.message, {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center",
              });
            } else if (data?.status === 404) {
              toast.error(data?.message, {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center",
              });
            } else {
              toast.error(data?.message, {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center",
              });
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
          });
      }
    }
    setBasicInfo((values) => ({ ...values, [name]: value }));
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const datachange = (event: Date | null) => {
    setDob(event);
  };

  // const handleDate = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  //     handleChange(event.target.value as Date | null);
  //   };
  const handleDateChange = (newDate: Dayjs | null) => {
    console.log("handleDate", newDate);

    setBasicInfo((values) => ({ ...values, dob: newDate }));

    let datecheck: any = dayjs(newDate).format("DD/MM/YYYY");
    if (datecheck === "Invalid Date") {
      setdobset_col(true);
    } else {
      setdobset_col(false);
    }
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    father_name: "",
    mother_name: "",
    guardian_name: "",
    pic_path: "",
    aim: "",
  });

  // const validate = () => {
  //     const validationError: any = {}

  //     if (!formData.first_name) {
  //         validationError.first_name = "First Name is required";
  //     }

  //     if (!formData.last_name) {
  //         validationError.last_name = "Last Name is required";
  //     }

  //     if (!formData.gender) {
  //         validationError.gender = "Gender is required";
  //     }

  //     if (!formData.dob) {
  //         validationError.dob = "Date of Birth is required";
  //     }

  //     if (!formData.father_name) {
  //         validationError.father_name = "Father Name is required";
  //     }

  //     if (!formData.mother_name) {
  //         validationError.mother_name = "Mother Name is required"
  //     }

  //     if (!formData.guardian_name) {
  //         validationError.guardian_name = "Guardian Name is required"
  //     }

  //     if (!formData.aim) {
  //         validationError.aim = "Aim is required"
  //     }

  //     if (!formData.pic_path) {
  //         validationError.pic_path = "Profile Picture is required"
  //     }
  //     setError(validationError)
  //     return Object.keys(validationError).length === 0 ? true : false;
  //     // if (Object.keys(validationError).length === 0) {
  //     //     toast.success("Basic Info Added Successfully")
  //     // }
  // }

  const submitHandel = () => {
    // event.preventDefault();
    // const validation = validate()
    // if (validation == true) {

    if (!basicInfo?.first_name) setFname_col1(true);
    if (!basicInfo?.last_name) setLname_col1(true);
    if (!basicInfo?.father_name) setFathername_col1(true);
    if (!basicInfo?.mother_name) setMothername_col1(true);

    let payload = {
      student_login_id: StudentId,
      first_name: basicInfo?.first_name,
      last_name: basicInfo?.last_name,
      gender: basicInfo?.gender,
      dob: basicInfo?.dob || null,
      father_name: basicInfo?.father_name,
      mother_name: basicInfo?.mother_name,
      guardian_name: basicInfo?.guardian_name,
      pic_path: selectedFile ? selectedFile : basicInfo?.pic_path,
      aim: basicInfo?.aim,
    };

    let datecheck: any = dayjs(payload?.dob).format("DD/MM/YYYY");
    if (datecheck === "Invalid Date") {
      setdobset_col(true);
    } else {
      setdobset_col(false);
    }

    const eq = deepEqual(initialAdminState, payload);

    if (
      basicInfo?.first_name &&
      basicInfo?.last_name &&
      basicInfo?.father_name &&
      basicInfo?.mother_name &&
      !fname_col &&
      !lname_col &&
      !fathername_col &&
      !mothername_col
    ) {
      if (editFalg) {
        postData(`${"student/add"}`, payload)
          .then((data: any) => {
            if (data.status == 200) {
              toast.success("Basic information saved successfully", {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center",
              });
              setActiveForm((prev) => prev + 1);
              setNamepro({
                first_name: basicInfo?.first_name,
                last_name: basicInfo?.last_name,
                gender: basicInfo?.gender,
              });
              getData(
                `${"upload_file/get_image/"}${
                  selectedFile ? selectedFile : basicInfo?.pic_path
                }`
              )
                .then((data: any) => {
                  // setprofileImage(imgdata.data)
                  if (data.status == 200) {
                    setProImage(data.data);
                  } else {
                  }
                })
                .catch((e) => {
                  console.log("------------- e -------------", e);
                });
            } else {
              toast.error(data?.message, {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center",
              });
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
          });
      } else {
        const editData = async () => {
          putData(`${"student/edit/"}${StudentId}`, payload)
            .then((data: any) => {
              // console.log("----- res ----", data);
              if (data.status == 200) {
                toast.success("Basic information updated successfully", {
                  hideProgressBar: true,
                  theme: "colored",
                  position: "top-center",
                });
                setActiveForm((prev) => prev + 1);
                // getStudentBasicInfo()
                setNamepro({
                  first_name: basicInfo?.first_name,
                  last_name: basicInfo?.last_name,
                  gender: basicInfo?.gender,
                });
                if (selectedFile ? selectedFile : basicInfo?.pic_path) {
                  getData(
                    `${"upload_file/get_image/"}${
                      selectedFile ? selectedFile : basicInfo?.pic_path
                    }`
                  )
                    .then((data: any) => {
                      // setprofileImage(imgdata.data)
                      if (data.status == 200) {
                        setProImage(data.data);
                      } else {
                      }
                    })
                    .catch((e) => {
                      console.log("------------- e -------------", e);
                    });
                }
              } else {
                toast.error(data?.message, {
                  hideProgressBar: true,
                  theme: "colored",
                  position: "top-center",
                });
              }
            })
            .catch((e: any) => {
              console.log("--------- e --------", e);

              // toast.error(e?.message, {
              //   hideProgressBar: true,
              //   theme: "colored",
              // });
            });
          // .then((data: any) => {
          //   console.log("---------- data.data.pic_path -----------", data.data.pic_path);

          //   if(data.status == 200)
          //     {
          //       toast.success(data?.message, {
          //         hideProgressBar: true,
          //         theme: "colored",
          //       });
          //       getStudentBasicInfo()
          //       setNamepro({
          //         first_name: basicInfo?.first_name,
          //         last_name: basicInfo?.last_name,
          //         gender: basicInfo?.gender,})
          //         getData(`${"upload_file/get_image/"}${data.data.pic_path}`)
          //         .then((data: any) => {
          //           console.log("immmmmm",data)
          //           // setprofileImage(imgdata.data)
          //           if(data.status == 200){

          //             setProImage(data.data)
          //           }else{

          //           }
          //         }).catch((e) => {
          //           console.log("------------- e -------------", e);

          //         })

          //     }
          //     else
          //     {
          //       toast.error(data?.message, {
          //         hideProgressBar: true,
          //         theme: "colored",
          //       });
          //     }
          // })
          // .catch((e) => {
          //   console.log("---------- e top data ------------",e);

          //   toast.error(e?.message, {
          //     hideProgressBar: true,
          //     theme: "colored",
          //   });
          // });
        };
        // eslint-disable-next-line no-lone-blocks
        if (!eq) editData();
        else setActiveForm((prev) => prev + 1);
      }
    }
    // console.log(payload);
    // }
    setProFlag(!proFalg);
  };

  return (
    <form>
      <div className="row d-flex">
        <div className="col-md-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            First Name <span>*</span>
          </label>
          {/* <TextField
            type="text"
            name="first_name"
            className="form-control"
            value={basicInfo.first_name}
            onChange={handleChange}
            required
          /> */}
          <input
            name="first_name"
            value={basicInfo.first_name}
            type="text"
            className="form-control"
            onChange={handleChange}
            required
          />
          <div>
            {" "}
            {fname_col && basicInfo?.first_name !== "" &&(
              <p style={{ color: "red" }}>
                Please enter a valid First Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {" "}
            {basicInfo?.first_name == "" && fname_col1 && (
              <p style={{ color: "red" }}>Please enter First name.</p>
            )}
          </div>
          {/* {error.first_name && <span style={{ color: 'red' }}>{error.first_name}</span>} */}
        </div>

        <div className="col-md-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Last Name <span>*</span>
          </label>
          {/* <TextField
            type="text"
            name="last_name"
            className="form-control"
            value={basicInfo.last_name || ""}
            onChange={handleChange}
            required
          /> */}
          <input
            name="last_name"
            value={basicInfo.last_name || ""}
            type="text"
            className="form-control"
            onChange={handleChange}
            required
          />
          <div>
            {" "}
            {lname_col && basicInfo?.last_name !== "" && (
              <p style={{ color: "red" }}>
                Please enter a valid Last Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {" "}
            {basicInfo?.last_name == "" && lname_col1 && (
              <p style={{ color: "red" }}>Please enter Last name.</p>
            )}
          </div>
          {/* {error.last_name && <span style={{ color: 'red' }}>{error.last_name}</span>} */}
        </div>

        <div className="col-md-6 pb-3 form_field_wrapper">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Gender *
            </FormLabel>
            <RadioGroup
              row
              name="gender"
              value={basicInfo.gender?.toLowerCase()}
              onChange={handleChange}
            >
              <FormControlLabel
                value="male"
                control={<Radio className="radiobutton" />}
                label="Male"
              />
              <FormControlLabel
                value="female"
                control={<Radio className="radiobutton" />}
                label="Female"
              />
            </RadioGroup>
          </FormControl>
          <div>
            {error.gender && (
              <span style={{ color: "red" }}>{error.gender}</span>
            )}
          </div>
        </div>
        <div className="col-md-6 pb-3 form_field_wrapper">
          <Typography className="profiletext" variant="body1">
            Date of Birth <span>*</span>
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              // label="Date of Birth"
              sx={{
                backgroundColor: "#f5f5f5",
              }}
              value={dayjs(basicInfo.dob)}
              onChange={handleDateChange}
              disableFuture
              format="DD/MM/YYYY"
            />
          </LocalizationProvider>
          {/* <input
            type="date"
            className="form-control"
            value={basicInfo.dob}
            onChange={handleDateChange}
            // disableFuture
            format="DD/MM/YYYY"
          /> */}
          <div>
            {" "}
            {dobset_col && (
              <p style={{ color: "red" }}>Please enter Date of Birth.</p>
            )}
          </div>
          {/* <div>{error.dob && <span style={{ color: 'red' }}>{error.dob}</span>}</div> */}
        </div>

        <div className="col-md-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Father Name <span>*</span>
          </label>
          {/* <TextField
            type="text"
            name="father_name"
            className="form-control"
            value={basicInfo.father_name}
            onChange={handleChange}
            required
          /> */}
          <input
            name="father_name"
            value={basicInfo.father_name}
            type="text"
            className="form-control"
            onChange={handleChange}
            required
          />
          <div>
            {" "}
            {fathername_col && basicInfo?.father_name !== "" && (
              <p style={{ color: "red" }}>
                Please enter a valid Father Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {" "}
            {basicInfo?.father_name == "" && fathername_col1 && (
              <p style={{ color: "red" }}>Please enter Father name.</p>
            )}
          </div>
          {/* {error.father_name && <span style={{ color: 'red' }}>{error.father_name}</span>} */}
        </div>

        <div className="col-md-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Mother Name <span>*</span>
          </label>
          {/* <TextField
            type="text"
            name="mother_name"
            className="form-control"
            value={basicInfo.mother_name}
            onChange={handleChange}
            required
          /> */}
          <input
            name="mother_name"
            value={basicInfo.mother_name || ""}
            type="text"
            className="form-control"
            onChange={handleChange}
            required
          />
          <div>
            {" "}
            {mothername_col && basicInfo?.mother_name !== "" &&(
              <p style={{ color: "red" }}>
                Please enter a valid Mother Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {" "}
            {basicInfo?.mother_name == "" && mothername_col1 && (
              <p style={{ color: "red" }}>Please enter Mother name.</p>
            )}
          </div>
          {/* {error.mother_name && <span style={{ color: 'red' }}>{error.mother_name}</span>} */}
        </div>

        <div className="col-md-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Guardian Name <span></span>
          </label>
          {/* <TextField
            type="text"
            name="guardian_name"
            className="form-control"
            value={basicInfo.guardian_name}
            onChange={handleChange}
            // required
          /> */}
          <input
            name="guardian_name"
            value={basicInfo?.guardian_name || ""}
            type="text"
            className="form-control"
            onChange={handleChange}
          />
          <div>
            {" "}
            {gname_col && basicInfo?.guardian_name !== "" &&(
              <p style={{ color: "red" }}>
                Please enter a valid Guardian Name only characters allowed.
              </p>
            )}
          </div>
          {/* {error.guardian_name && <span style={{ color: 'red' }}>{error.guardian_name}</span>} */}
        </div>

        <div className="col-md-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Aim <span></span>
          </label>
          {/* <TextField
            type="text"
            name="aim"
            className="form-control"
            value={basicInfo.aim}
            onChange={handleChange}
            // required
          /> */}
          <input
            name="aim"
            value={basicInfo.aim || ""}
            type="text"
            className="form-control"
            onChange={handleChange}
          />
          <div>
            {" "}
            {aim_col && basicInfo.aim !== "" &&(
              <p style={{ color: "red" }}>
                Please enter a valid Aim Name only characters allowed.
              </p>
            )}
          </div>
          {/* {error.aim && <span style={{ color: 'red' }}>{error.aim}</span>} */}
        </div>

       
        <div className="col-lg-12">
          <div className="d-flex flex-wrap align-items-center gap-1">
            <div className="image-container">
              {!filePreview ? (
                <>
                  {basicInfo.gender?.toLowerCase() === "male" ? (
                    <div className="image-box">
                      <input type="checkbox" className="image-checkbox" />
                      <img src={maleImage} alt="male" />
                      <span className="check-icon">
                        <CheckCircleOutlinedIcon />
                      </span>
                    </div>
                  ) : (
                    <div className="image-box">
                      <input type="checkbox" className="image-checkbox" />
                      <img src={femaleImage} alt="female" />
                      <span className="check-icon">
                        <CheckCircleOutlinedIcon />
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="image-box">
                  <img
                    src={filePreview}
                    alt="Uploaded Preview"
                    style={{ marginTop: "10px" }}
                  />
                </div>
              )}
            </div>
            <label htmlFor="file">
              <div className="upload-profile-image" role="button">
                <UploadOutlinedIcon />
                <input
                  type="file"
                  id="file"
                  name="pic_path"
                  accept="image/*"
                  style={{ display: "none" }}
                  // value={basicInfo.pic_path}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                Upload Your Picture
              </div>
            </label>
          </div>
        </div>
        <div className="col-lg-12">
          <button
            type="button"
            className="btn btn-dark px-lg-5 mt-3 ms-auto d-block rounded-pill next-btn px-4"
            onClick={() => submitHandel()}
          >
            Next
          </button>
        </div>
      </div>
      {/* <div className="d-flex justify-content-center mt-5">
        <button className="btn btn-primary sunbutton mainbutton" type="submit">
          {editFalg ? "Save" : "Save Changes"}
        </button>
      </div> */}
    </form>
  );
};

export default StudentBasicInfo;
