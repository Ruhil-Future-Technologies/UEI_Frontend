import React, { useEffect, useState } from "react";
import "../Student/Student.scss";
import TextField from "@mui/material/TextField";
import { Select,FormControl, Grid, InputLabel, Typography, MenuItem } from "@mui/material";
import useApi from "../../hooks/useAPI";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QUERY_KEYS_STUDENT } from "../../utils/const";
import { toast } from "react-toastify";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from 'dayjs';
import { MenuListinter } from "../../Components/Table/columns";
import { dataaccess } from "../../utils/helpers";

const AddEditStudent = () => {
  const EditStudentURL = QUERY_KEYS_STUDENT.STUDENT_EDIT_BY_ID;
  const StudentURL = QUERY_KEYS_STUDENT.GET_STUDENT;
  const { getData, putData, postFileData, loading } = useApi();
  const navigator = useNavigate();
  const { id } = useParams();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const initialState = {
    aim: "",
    first_name: "",
    last_name: "",
    gender: "",
    dob: dayjs("2024-05-10"),
    father_name: "",
    mother_name: "",
    guardian_name: "",
    is_kyc_verified: "",
    pic_path: "",
    email_id: "",
    mobile_no_call: "",
    // id: number;
    image_name: "",
  };
  const genderSelectOptions = [
    { name: "Male", value: "male" },
    { name: "Female", value: "female" },
  ];
  const [student, setStudent] = useState(initialState);
  const [aim, setAim] = useState<boolean>(false);
  const [fname, setFname] = useState<boolean>(false);
  const [lname, setLname] = useState<boolean>(false);
  const [gender, setGender] = useState<boolean>(false);
  const [fathernm, setFathernm] = useState<boolean>(false);
  const [mothernm, setMothernm] = useState<boolean>(false);
  const [gname, setGname] = useState<boolean>(false);
  const [filePreview, setFilePreview] = useState(null);
  const [mobile_no_call, setMobileNoCall] = useState<boolean>(false);
  const [uploadedfile, setUploadedFile] = useState();
  const location = useLocation();
  const Menulist: any = localStorage.getItem('menulist1');
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const lastSegment = id ? pathSegments[pathSegments.length - 3].toLowerCase() : pathSegments[pathSegments.length - 2].toLowerCase();
  const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);
  const exactSixYearsAgo = dayjs()?.subtract(6, 'year');
  const minSelectableDate = dayjs("01/01/1900");
  const [error, setError] = React.useState<string | null>(null);
  const [dobset_col, setdobset_col] = useState<boolean>(false);

  useEffect(() => {
    setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: "" }, { datatest: "" }));
  }, [Menulist])

  if ((id && !filteredData?.form_data?.is_update) || (!id && !filteredData?.form_data?.is_save)) {
    navigator('/main/Student')
  }
  const callAPI = async () => {
    try {
      const response = await getData(StudentURL);
      if (response.data) {

        const allStudent = response?.data;
        const filteredStudent = allStudent.filter((std: any) => std.id == id)[0]
        if (filteredStudent?.pic_path) {
          setFilePreview(filteredStudent?.pic_path)
        }
        filteredStudent.dob = dayjs(filteredStudent.dob)
        setStudent(filteredStudent)
      }
    } catch (e: any) {
      toast.error(e.message, {
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };
  useEffect(() => {
    callAPI();
  }, []);

  const handleChange = (e: any) => {
    const { name } = e.target;
    let { value } = e.target;

    if (name === 'aim') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        setAim(true)
      } else {
        setAim(false)
      }

    } else if (name === 'mobile_no_call') {
      if (!/^\d{10}$/.test(value)) {
        console.log(value);
        setMobileNoCall(true)
      } else {
        setMobileNoCall(false)
      }

    } else if (name === 'first_name') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        console.log(value);
        setFname(true)
      } else {
        setFname(false)
      }
    } else if (name === 'last_name') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        console.log(value);
        setLname(true)
      } else {
        setLname(false)
      }
    } else if (name === 'gender') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        console.log(value);
        setGender(true)
      } else {
        setGender(false)
      }
    } else if (name === 'father_name') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        console.log(value);
        setFathernm(true)
      } else {
        setFathernm(false)
      }
    } else if (name === 'mother_name') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        console.log(value);
        setMothernm(true)
      } else {
        setMothernm(false)
      }
    } else if (name === 'guardian_name') {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        console.log(value);
        setGname(true)
      } else {
        setGname(false)
      }
    } else if (name === 'pic_path') {
      const formData = new FormData();
      const { files } = e.target;
      if (files && files[0]) {
        const file: any = files[0];
        // console.log('file',file)
        const reader: any = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(file);
        formData.append('file', file);
        value = file.name
        setUploadedFile(value)
        // console.log('value',value)
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
              });;
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
    console.log(name,value);
    setStudent((prevUser) => {
      return {
        ...prevUser,
        [e.target.name?e.target.name:"gender"]: e.target.value,
      };
    });
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate && newDate?.isValid() && newDate >= minSelectableDate) {
      if (newDate && newDate?.isBefore(exactSixYearsAgo, 'day')) {
        if (newDate !== null) {
          setStudent((prevUser) => {
            return {
              ...prevUser,
              dob: newDate,
            };
          });
        }
        setError(null);
        setdobset_col(false);
      } else {
        // setDob(null);
        const datecheck: any = dayjs(newDate)?.format("DD/MM/YYYY");
        if (datecheck === "Invalid Date") {
          setError(null);
          setdobset_col(true);
        } else {
          setdobset_col(false);
          const currentDate = dayjs();
          if (newDate?.isAfter(currentDate, 'day')) {
            setError('Future dates are not allowed.');
          } else {
            setError('You must be at least 6 years old.');
          }
        }
      }
    } else {
      setError('Invalid date selected. Please choose a valid date.');
    }
  }
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    studentData: {
      aim: string;
      first_name: string;
      last_name: string;
      gender: string;
      dob: Dayjs;
      father_name: string;
      mother_name: string;
      guardian_name: string;
      is_kyc_verified: string;
      pic_path: string;
      image_name: string;
      email_id: string;
      mobile_no_call: string
    }
  ) => {
    e.preventDefault()
    const payload = {
      aim: studentData?.aim,
      first_name: studentData?.first_name,
      last_name: studentData?.last_name,
      gender: studentData?.gender,
      dob: studentData?.dob?.format("YYYY/MM/DD") || null,
      father_name: studentData?.father_name,
      mother_name: studentData?.mother_name,
      guardian_name: studentData?.guardian_name,
      is_kyc_verified: studentData?.is_kyc_verified,
      // pic_path:isBase64Image?studentData.image_name :fileName  ,
      pic_path: uploadedfile ? uploadedfile : studentData?.image_name,
      // pic_path:studentData?.pic_path,
      student_login_id: id,
      // email_id: studentData?.email_id,
      // mobile_no_call: studentData?.mobile_no_call
    }
    console.log(payload);
    const datecheck: any = dayjs(payload?.dob)?.format("DD/MM/YYYY");
    if (datecheck === "Invalid Date") {
      setdobset_col(true);
    } else {
      setdobset_col(false);
    }
    if (!aim && !fname && student?.first_name !== "" && !lname && student?.last_name !== "" && !gender && !fathernm && student?.father_name !== "" && !mothernm && student?.mother_name !== "" && !gname && error === null && datecheck !== "Invalid Date") {

      putData(`${EditStudentURL}${id ? `/${id}` : ''}`, payload)
        .then((data: any) => {
          console.log(data)
          if (data?.status === 200) {
            navigator('/main/Student')
            toast.success(data?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
          }
          else {
            // toast.error(data?.message, {
            //   hideProgressBar: true,
            //   theme: "colored",
            // });

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
  return (
    <>
      <div className='main-wrapper'>
        <div className="main-content">
          <div className='card p-lg-4'>
            <div className="card-body">
              <div className="main_title">Edit Student</div>
              <form onSubmit={(e) => handleSubmit(e, student)}>
                <div className="row  gy-4 mt-0">
                  <div className="col-md-4">
                    <div className="form_field_wrapper">
                      <TextField
                        label="Aim"
                        name="aim"
                        value={student?.aim}
                        variant="outlined"
                        onChange={handleChange}
                      />
                    </div>
                    <div> {aim && (
                      <p style={{ color: 'red' }}>Please enter a valid Aim Name only characters allowed.</p>
                    )}</div>

                  </div>
                  <div className="col-md-4">
                    <div className="form_field_wrapper">
                      <TextField
                        label="First Name *"
                        name="first_name"
                        value={student?.first_name}
                        variant="outlined"
                        onChange={handleChange}
                      />
                    </div>
                    <div> {fname && (
                      <p style={{ color: 'red' }}>Please enter a valid First Name only characters allowed.</p>
                    )}</div>
                    <div> {student?.first_name == "" && !loading && (
                      <p style={{ color: 'red' }}>Please enter First name.</p>
                    )}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="form_field_wrapper">
                      <TextField
                        label="Last Name *"
                        name="last_name"
                        value={student?.last_name}
                        variant="outlined"
                        onChange={handleChange}
                      />
                    </div>
                    <div> {lname && (
                      <p style={{ color: 'red' }}>Please enter a valid Last Name only characters allowed.</p>
                    )}</div>
                    <div> {student?.last_name == "" && !loading && (
                      <p style={{ color: 'red' }}>Please enter Last name.</p>
                    )}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="form_field_wrapper">
                      <FormControl className="col-md-7">
                        <InputLabel id="gender-label">Select Gender</InputLabel>
                        <Select
                          labelId="gender-label"
                          value={student.gender}
                          onChange={handleChange}
                          label="Select Gender"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 250,
                              },
                            },
                          }}
                        >
                          {genderSelectOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div> {gender && (
                      <p style={{ color: 'red' }}>Please enter a valid Gender Name only characters allowed.</p>
                    )}</div>
                    <div> {student?.gender == "" && !loading && (
                      <p style={{ color: 'red' }}>Please enter Gender name.</p>
                    )}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="form_field_wrapper" style={{ maxWidth: 220, width: '100%' }}>

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Date of Birth *"
                          value={dayjs(student?.dob)}
                          onChange={handleDateChange}
                          name="dob"
                          format="DD/MM/YYYY"
                          disableFuture
                          maxDate={exactSixYearsAgo}
                          minDate={minSelectableDate}
                          onError={() => { }}
                          slotProps={{
                            textField: {
                              variant: 'outlined',
                              helperText: error,
                              error: Boolean(error),
                              inputProps: {
                                maxLength: 10,
                              },
                            },
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
                  </div>
                  <div className="col-md-4">
                    <div className="form_field_wrapper">
                      <TextField
                        label="Father Name *"
                        name="father_name"
                        value={student?.father_name}
                        variant="outlined"
                        onChange={handleChange}
                      />
                    </div>
                    <div> {fathernm && (
                      <p style={{ color: 'red' }}>Please enter a valid Father Name only characters allowed.</p>
                    )}</div>
                    <div> {student?.father_name == "" && !loading && (
                      <p style={{ color: 'red' }}>Please enter Father name.</p>
                    )}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="form_field_wrapper">
                      <TextField
                        label="Mother Name *"
                        name="mother_name"
                        value={student?.mother_name}
                        variant="outlined"
                        onChange={handleChange}
                      />
                    </div>
                    <div> {mothernm && (
                      <p style={{ color: 'red' }}>Please enter a valid Mother Name only characters allowed.</p>
                    )}</div>
                    <div> {student?.mother_name == "" && !loading && (
                      <p style={{ color: 'red' }}>Please enter Mother name.</p>
                    )}</div>
                  </div>
                  <div className="col-md-4">
                    <div className="form_field_wrapper">
                      <TextField
                        label="Guardian Name "
                        name="guardian_name"
                        value={student?.guardian_name}
                        variant="outlined"
                        onChange={handleChange}
                      />
                    </div>
                    <div> {gname && (
                      <p style={{ color: 'red' }}>Please enter a valid Guardian Name only characters allowed.</p>
                    )}</div>

                  </div>
                  <div className="col-md-4">
                    <div className="form_field_wrapper">
                      <TextField
                        label="Email"
                        name="email_id"
                        value={student?.email_id}
                        variant="outlined"
                        onChange={handleChange}
                        required
                        disabled
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form_field_wrapper">
                      <TextField
                        label="Mobile No"
                        name="mobile_no_call"
                        value={student?.mobile_no_call}
                        variant="outlined"
                        onChange={handleChange}
                        required
                      disabled
                      />
                    </div>
                    <div> {mobile_no_call && (
                      <p style={{ color: 'red' }}>Please enter a valid  Mobile No only 10 digits allowed.</p>
                    )}</div>
                    <div> {student?.mobile_no_call == "" && !loading && (
                      <p style={{ color: 'red' }}>Please enter Mobile No.</p>
                    )}</div>
                  </div>
                  <div className="col-md-4">
                    <Grid item xs={12}>
                      <Typography variant="h6">
                        Upload Profile Photo <span>*</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <input
                        type="file"
                        name="pic_path"
                        accept="image/*"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      />
                    </Grid>
                    {filePreview && (
                      <img
                        src={filePreview}
                        alt="Uploaded Preview"
                        style={{ maxWidth: "50%", marginTop: "10px" }}
                      />
                    )}
                  </div>
                </div>
                <button className="btn btn-primary">
                  {id ? "Update" : "Save"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditStudent;
