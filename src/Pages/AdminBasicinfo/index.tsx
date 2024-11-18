import * as React from "react";
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  Tooltip,
  useTheme,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
//import DatePicker from 'react-datepicker';
//import 'react-datepicker/dist/react-datepicker.css';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

import { Field, Form, Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { deepEqual } from "../../utils/helpers";
import maleImage from "../../assets/img/avatars/male.png";
import femaleImage from "../../assets/img/avatars/female.png";
import NameContext from "../Context/NameContext";
import { ChildComponentProps } from "../StudentProfile";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface Department {
  id: number;
  department_name: string;
}
interface AdminInformation {
  admin_login_id?: string;
  department_id?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  // dob?: string,
  dob: Dayjs | null;
  father_name?: string;
  mother_name?: string;
  guardian_name?: string;
  is_kyc_verified?: boolean;
  pic_path?: string;
}

const AdminBasicInfo: React.FC<ChildComponentProps> = ({ setActiveForm }) => {
  const context = React.useContext(NameContext);
  const { setNamepro, setProImage }: any = context;
  const { getData, postData, putData, postFileData } = useApi();
  const [initialAdminState, setInitialAdminState] =
    useState<AdminInformation | null>(null);
  const [adminFName, setAdminFName] = useState("");
  const [adminLName, setAdminLName] = useState("");
  const [adminGender, setAdminGender] = useState("Male");
  const [adminDOB, setAdminDOB] = useState<Dayjs | null | undefined>(
    dayjs("dd-mm-yyyy")
  );
  const [adminFatherName, setAdminFatherName] = useState("");
  const [adminMotherName, setAdminMotherName] = useState("");
  const [adminGurdian, setAdminGurdian] = useState("");
  const [editFalg, setEditFlag] = useState<boolean>(false);
  const [editFalg1, setEditFlag1] = useState<boolean>(false);
  const [dobset_col, setdobset_col] = useState<boolean>(false);
  //const [adminPicPath,setAdminPicPath]=React.useState();
  const [allDepartment, setAllDepartment] = useState<Department[]>([
    { id: 0, department_name: "" },
  ]);
  const [adminDepartment, setAdminDepartment] = useState<string>("");
  const [selectedFile, setSelectedFile] = React.useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [adminFilePath, setAdminFilePath] = useState("");
  let adminId = localStorage.getItem("_id");
//   console.log(adminId);
  const [admin, setadmin] = useState<AdminInformation>({
    first_name: "", 
    last_name: "",
    father_name: "",
    mother_name: "",
    gender: "Male",
    dob: dayjs("dd-mm-yyyy"),
  });
  const [fname_col, setFname_col] = useState<boolean>(false);
  const [lname_col, setLname_col] = useState<boolean>(false);
  const [fname_col1, setFname_col1] = useState<boolean>(false);
  const [lname_col1, setLname_col1] = useState<boolean>(false);
  const [fathername_col, setFathername_col] = useState<boolean>(false);
  const [mothername_col, setMothername_col] = useState<boolean>(false);
  const [gname_col, setGname_col] = useState<boolean>(false);
  const [fathername_col1, setFathername_col1] = useState<boolean>(false);
  const [mothername_col1, setMothername_col1] = useState<boolean>(false);
  const [error1, setError1] = useState("");
  useEffect(() => {
    setadmin((prevState) => ({ ...prevState, dob: adminDOB ?? null }));
  }, [adminDOB]);
  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
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
      if (!/^[A-Za-z]+(?:[ A-Za-z]+)*$/.test(value)) {
        setFathername_col(true);
      } else {
        setFathername_col(false);
      }
    }
    if (name === "mother_name") {
      setMothername_col1(true);
      if (!/^[A-Za-z]+(?:[ A-Za-z]+)*$/.test(value)) {
        setMothername_col(true);
      } else {
        setMothername_col(false);
      }
    }
    if (name === "guardian_name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setGname_col(true);
      } else {
        setGname_col(false);
      }
    }
    setadmin((prevState) => ({ ...prevState, [name]: value }));
  };
  const getBasicInfo = async () => {
    try {
      const response = await getData(`${"admin_basicinfo/edit/" + adminId}`);
      if (response?.status === 200) {
        setadmin((prevState) => ({
          ...prevState,
          first_name: response?.data.first_name,
          last_name: response?.data.last_name,
          dob: response?.data.dob,
          gender: response?.data.gender,
          father_name: response?.data.father_name,
          mother_name: response?.data.mother_name,
          guardian_name: response?.data.guardian_name,
        }));
        setAdminDepartment(response?.data.department_id);
        setAdminFilePath(response?.data.pic_path);
        setInitialAdminState({
          first_name: response?.data.first_name,
          last_name: response?.data.last_name,
          dob: response?.data.dob,
          gender: response?.data.gender,
          father_name: response?.data.father_name,
          mother_name: response?.data.mother_name,
          guardian_name: response?.data.guardian_name,
          department_id: response?.data.department_id,
          pic_path: response?.data.pic_path,
        });
        if (response?.data?.pic_path !== "") {
          getData(`${"upload_file/get_image/" + response?.data?.pic_path}`)
            .then((imgdata: any) => {
              setFilePreview(imgdata.data);
            })
            .catch((e) => {});
        }
      } else if (response?.status === 404) {
        setEditFlag(true);
        toast.warning("Please add your information", {
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        // empty
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.warning("Please login again", {
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error("Request failed", {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  };
  const getDepatment = async () => {
    try {
      const response = await getData(`${"department/list"}`);
      if (response?.status === 200) {
        setAllDepartment(response?.data);
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.warning("Please login again", {
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error("Request failed", {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  };
  useEffect(() => {
    getBasicInfo();
    getDepatment();
  }, [adminId]);

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    setAdminDepartment(value);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const formData = new FormData();

    if (files && files[0]) {
      const file: any = files[0];
      // Check file size (3MB = 3 * 1024 * 1024 bytes)
      if (file.size > 3 * 1024 * 1024) {
        setError1("File size must be less than 3MB");
        return;
      }

      // Check file size (5KB = 5 * 1024 bytes)
      // if (file.size > 3 * 1024) {
      //   setError1('File size must be less than 5KB');
      //   return;
      // }

      // Check file type (only JPG and PNG allowed)
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setError1("Only JPG and PNG files are allowed");
        return;
      }
      setError1("");
      setSelectedFile(file.name);
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
      formData.append("file", file);
      postFileData(`${"upload_file/upload"}`, formData)
        .then((data: any) => {
          if (data?.status === 200) {
            toast.success(data?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          } else if (data?.status === 404) {
            toast.error(data?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          } else {
            toast.error(data?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          }
        })
        .catch((e: any) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    }
  };
  const handleDateChange = (newDate: Dayjs | null) => {
    setAdminDOB(newDate);
    let datecheck: any = dayjs(newDate).format("DD/MM/YYYY");
    if (datecheck === "Invalid Date") {
      setdobset_col(true);
    } else {
      setdobset_col(false);
    }
  };
  const adminBasicInfo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!admin?.first_name) setFname_col1(true);
    if (!admin?.last_name) setLname_col1(true);
    if (!admin?.father_name) setFathername_col1(true);
    if (!admin?.mother_name) setMothername_col1(true);
    let paylod = {
      admin_login_id: adminId,
      department_id: adminDepartment,
      first_name: admin?.first_name,
      last_name: admin?.last_name,
      gender: admin?.gender,
      dob: admin?.dob || null,
      father_name: admin?.father_name,
      mother_name: admin?.mother_name,
      guardian_name: admin?.guardian_name || "",
      is_kyc_verified: true,
      pic_path: selectedFile ? selectedFile : adminFilePath,
    };
    let compare = {
      department_id: adminDepartment,
      first_name: admin?.first_name,
      last_name: admin?.last_name,
      gender: admin?.gender,
      dob: admin?.dob,
      father_name: admin?.father_name,
      mother_name: admin?.mother_name,
      guardian_name: admin?.guardian_name || "",
      pic_path: selectedFile ? selectedFile : adminFilePath,
    };
    let datecheck: any = dayjs(paylod?.dob).format("DD/MM/YYYY");
    if (datecheck === "Invalid Date") {
      setdobset_col(true);
    } else {
      setdobset_col(false);
    }
    const eq = deepEqual(compare, initialAdminState);
    setEditFlag1(true);
    if (editFalg) {
      const seveData = async () => {
        try {
          const response = await postData("admin_basicinfo/add", paylod);
          if (response?.status === 200) {
            toast.success("Admin basic information saved successfully", {
              hideProgressBar: true,
              theme: "colored",
            });
            setNamepro({
              first_name: paylod?.first_name,
              last_name: paylod?.last_name,
              gender: paylod?.gender,
            });
            setActiveForm((prev) => prev + 1);
            getData(
              `${"upload_file/get_image/"}${
                selectedFile ? selectedFile : adminFilePath
              }`
            )
              .then((data: any) => {
                if (data.status == 200) {
                  setProImage(data.data);
                } else {
                }
              })
              .catch((e) => {
                console.log("------------- e -------------", e);
              });
          } else {
            toast.error(response?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          }
        } catch (error: any) {
          toast.error(error?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        }
      };
      if (
        !fname_col &&
        admin.first_name !== "" &&
        !lname_col &&
        admin.last_name !== "" &&
        !fathername_col &&
        admin.father_name !== "" &&
        !mothername_col &&
        admin.mother_name !== "" &&
        !gname_col &&
        adminDepartment &&
        !dobset_col
      ) {
        seveData();
      }
    }
    if (!editFalg) {
      const editData = async () => {
        try {
          const response = await putData(
            "admin_basicinfo/edit/" + adminId,
            paylod
          );

          if (response?.status === 200) {
            toast.success("Admin basic information updated successfully", {
              hideProgressBar: true,
              theme: "colored",
            });
            setNamepro({
              first_name: paylod?.first_name,
              last_name: paylod?.last_name,
              gender: paylod?.gender,
            });
            setActiveForm((prev) => prev + 1);
            getData(
              `${"upload_file/get_image/"}${
                selectedFile ? selectedFile : adminFilePath
              }`
            )
              .then((data: any) => {
                if (data.status == 200) {
                  setProImage(data.data);
                } else {
                }
              })
              .catch((e) => {
                console.log("------------- e -------------", e);
              });
            getBasicInfo();
            getDepatment();
          } else {
            toast.error("Request failed", {
              hideProgressBar: true,
              theme: "colored",
            });
          }
        } catch (error) {
          toast.error("Some issue are occuring.", {
            hideProgressBar: true,
            theme: "colored",
          });
        }
      };
      if (
        !fname_col &&
        admin.first_name !== "" &&
        !lname_col &&
        admin.last_name !== "" &&
        !fathername_col &&
        admin.father_name !== "" &&
        !mothername_col &&
        !gname_col &&
        admin.mother_name !== "" &&
        adminDepartment
      ) {
        // eslint-disable-next-line no-lone-blocks
        {
          if (!eq) editData();
          else setActiveForm((prev) => prev + 1);
        }
      }
    }
  };
  console.log("test log",fname_col1,admin.first_name)
  return (
  
    <form>
      <div className="row d-flex">
        <div className="col-md-6 pb-3form_field_wrapper">
          <label className="col-form-label">
            {" "}
            First Name <span>*</span>{" "}
          </label>
          <input
            name="first_name"
            value={admin.first_name}
            type="text"
            className="form-control"
            onChange={handleInputChange}
            required
          />
          <div>
            {" "}
            {fname_col && admin?.first_name !== "" && (
              <p style={{ color: "red" }}>
                Please enter a valid First Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {" "}
            {admin?.first_name == ""  && fname_col1 && (
              <p style={{ color: "red" }}>Please enter First name.</p>
            )}
          </div>
        </div>

        <div className="col-md-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Last Name <span>*</span>{" "}
          </label>
          <input
            type="text"
            name="last_name"
            className="form-control"
            value={admin.last_name}
            onChange={(e) => handleInputChange(e)}
            required
          />
          <div>
            {" "}
            {lname_col && admin.last_name !== "" && (
              <p style={{ color: "red" }}>
                Please enter a valid Last Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {" "}
            {admin.last_name == "" && lname_col1 && (
              <p style={{ color: "red" }}>Please enter Last name.</p>
            )}
          </div>
        </div>
        <div className="col-md-6 pb-3 form_field_wrapper">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Gender <span>*</span>{" "}
            </FormLabel>
            <RadioGroup
              row
              name="gender"
              value={admin.gender?.toLowerCase()}
              onChange={handleInputChange}
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
        </div>
        <div className="col-md-6 pb-3 form_field_wrapper">
          <Typography className="profiletext" variant="body1">
            Date of Birth <span>*</span>
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dayjs(admin.dob)}
              onChange={(date: any) => handleDateChange(date)}
              format="DD/MM/YYYY"
              disableFuture
              sx={{
                backgroundColor: "#f5f5f5",
              }}
            />
          </LocalizationProvider>
          <div>
            {" "}
            {dobset_col && (
              <p style={{ color: "red" }}>Please enter Date of Birth.</p>
            )}
          </div>
        </div>
        <div className="col-md-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Father Name <span>*</span>{" "}
          </label>
          <input
            type="text"
            name="father_name"
            className="form-control"
            value={admin.father_name}
            onChange={(e) => handleInputChange(e)}
          />
          <div>
            {" "}
            {fathername_col && admin.father_name !== "" && (
              <p style={{ color: "red" }}>
                Please enter a valid Father Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {" "}
            {admin.father_name == "" && fathername_col1 && (
              <p style={{ color: "red" }}>Please enter Father name.</p>
            )}
            {" "}
           
          </div>
        </div>

        <div className="col-md-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Mother Name <span>*</span>{" "}
          </label>
          <input
            type="text"
            name="mother_name"
            className="form-control"
            value={admin.mother_name}
            onChange={(e) => handleInputChange(e)}
          />
          <div>
            {" "}
            {mothername_col && admin.mother_name !== "" && (
              <p style={{ color: "red" }}>
                Please enter a valid Mother Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {" "}
            {admin.mother_name == ""  && mothername_col1 && (
              <p style={{ color: "red" }}>Please enter Mother name.</p>
            )}
          </div>
        </div>
        <div className="col-md-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Guardian Name <span></span>{" "}
          </label>
          <input
            type="text"
            name="guardian_name"
            className="form-control"
            value={admin.guardian_name}
            onChange={(e) => handleInputChange(e)}
          />
          <div>
            {" "}
            {gname_col && (
              <p style={{ color: "red" }}>
                Please enter a valid Guardian Name only characters allowed.
              </p>
            )}
          </div>
        </div>

        <div className="col-md-6 pb-3 form_field_wrapper">
          <FormControl
            sx={{
              m: 1,
              mt: 3,
              minWidth: 250,
              width: {
                xs: "100%",
                sm: "auto",
              },
              marginLeft: 0,
            }}
          >
            <InputLabel id="demo-select-small-label">
              Department Name *{" "}
            </InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={adminDepartment}
              label="Department name"
              onChange={handleDepartmentChange}
              sx={{
                backgroundColor: "#f5f5f5",
              }}
              renderValue={(selected) => {
                const selectedDepartment = allDepartment.find(
                  (dept) => dept.id.toString() == selected
                );
                const selectedDepartment1 = allDepartment.find(
                  (dept) => dept.id.toString() == adminDepartment
                );
                return selectedDepartment
                  ? selectedDepartment?.department_name
                  : selectedDepartment1?.department_name;
              }}
              MenuProps={{
                sx: {
                  "& .MuiPaper-root": {
                    mt: 1,
                  },
                },
              }}
            >
              {allDepartment.map((data) => (
                <MenuItem key={data.id} value={data.id}>
                  {data.department_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            {" "}
            {!adminDepartment && editFalg1 && (
              <p style={{ marginLeft: "10px", color: "red" }}>
                Please select a Department name.
              </p>
            )}
          </div>
        </div>
        <div className="col-lg-12">
          <div className="d-flex flex-wrap align-items-center gap-1">
            <div className="image-container">
              {!filePreview ? (
                <>
                  {admin.gender?.toLowerCase() === "male" ? (
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
                    handleImageChange(e);
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
            onClick={(e: any) => adminBasicInfo(e)}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default AdminBasicInfo;
