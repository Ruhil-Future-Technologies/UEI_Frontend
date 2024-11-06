import React, { useContext, useEffect, useState } from "react";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import {
  deepEqual,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from "../../utils/helpers";
import NameContext from "../Context/NameContext";
import { ChildComponentProps } from "../StudentProfile";

const StudentcontactDetails: React.FC<ChildComponentProps> = ({
  setActiveForm,
}) => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const { getData, postData, putData } = useApi();
  const [contcodeWtsap, setContcodeWtsap] = useState("+91");
  const [whatsappNum, setWhatsappNum] = useState("");
  const [contcodePhone, setContcodePhone] = useState("+91");
  const [phoneNum, setPhoneNum] = useState("");
  const [phoneNumerror, setPhoneNumerror] = useState({
    phoneNum: "",
  });
  const [email, setEmail] = useState(localStorage.getItem("userid"));
  const [editFalg, setEditFlag] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    phoneNum: "",
    email: "",
    whatsappNum: "",
  });
  const StudentId = localStorage.getItem("_id");
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };
  const [initialState, setInitialState] = useState<any | null>({});
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    switch (name) {
      case "phoneNum":
        setPhoneNum(value);
        setErrors({
          ...errors,
          phoneNum: !/^\d{10}$/.test(value)
            ? "Phone number should be 10 digits"
            : "",
        });
        setPhoneNumerror({
          ...errors,
          phoneNum: !/^\d{10}$/.test(value)
            ? "Phone number should be 10 digits"
            : "",
        });
        break;
      case "whatsappNum":
        setWhatsappNum(value);
        setErrors({
          ...errors,
          // whatsappNum: !/^\d{10}$/.test(value) ? 'Phone number should be 10 digits' : '',
          whatsappNum:
            value === ""
              ? ""
              : !/^\d{10}$/.test(value)
                ? "Phone number should be 10 digits"
                : "",
        });
        break;
      case "email":
        setEmail(value);
        setErrors({
          ...errors,
          email: validateEmail(value) ? "" : "Email is invalid",
        });
        break;
      default:
        break;
    }
  };
  const getContacInfo = async () => {
    getData(`${"student_contact/edit/" + StudentId}`)
      .then((data: any) => {
        if (data?.status === 200) {
          setContcodeWtsap(data?.data.mobile_isd_watsapp);
          setWhatsappNum(data?.data.mobile_no_watsapp);
          setContcodePhone(data?.data.mobile_isd_call);
          setPhoneNum(data?.data.mobile_no_call);
          setEmail(data?.data.email_id);

          setInitialState({
            mobile_isd_watsapp: data?.data.mobile_isd_watsapp,
            mobile_no_watsapp: data?.data.mobile_no_watsapp,
            mobile_isd_call: data?.data.mobile_isd_call,
            mobile_no_call: data?.data.mobile_no_call,
            email_id: data?.data.email_id,
            student_id: StudentId,
          });
        } else if (data?.status === 404) {
          setEditFlag(true);
          //   toast.warning("Please Add Your Information", {
          //     hideProgressBar: true,
          //     theme: "colored",
          //   });
          var userId = localStorage.getItem("userid");
          if (userId !== null) {
            setEmail(userId);
          } else {
            console.error("No user ID found in localStorage.");
          }
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center"
        });
      });
  };
  useEffect(() => {
    getContacInfo();
  }, []);
  const submitHandel = () => {
    // event: React.FormEvent<HTMLFormElement>
    // event.preventDefault();

    if (errors.phoneNum || errors.email || errors.whatsappNum) {
      toast.error("Please fix the errors before submitting", {
        hideProgressBar: true,
        theme: "colored",
        position: "top-center"
      });
      return;
    }

    if (phoneNum.length !== 10) {
      setPhoneNumerror({
        ...errors,
        phoneNum: !/^\d{10}$/.test(phoneNum)
          ? "Phone number should be 10 digits"
          : "",
      });
      // toast.error("Phone number should be 10 digits", {
      //   hideProgressBar: true,
      //   theme: "colored",
      //   position: "top-center"
      // });
      return;
    }
    let payload = {
      student_id: StudentId,
      mobile_isd_call: contcodePhone,
      mobile_no_call: phoneNum,
      mobile_isd_watsapp: contcodeWtsap,
      mobile_no_watsapp: whatsappNum,
      email_id: email,
    };
    const eq = deepEqual(initialState, payload);
    if (editFalg) {
      postData(`${"student_contact/add"}`, payload)
        .then((data: any) => {
          if (data?.status === 200) {
            toast.success("Contact Details saved successfully", {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center"
            });
            setActiveForm((prev) => prev + 1);
          } else {
            toast.error(data?.message, {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center"
            });
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center"
          });
        });
    } else {
      // eslint-disable-next-line no-lone-blocks
      {
        if (!eq) {
          putData(`${"student_contact/edit/"}${StudentId}`, payload)
            .then((data: any) => {
              if (data.status === 200) {
                toast.success("Contact Details updated successfully", {
                  hideProgressBar: true,
                  theme: "colored",
                  position: "top-center"
                });
                getContacInfo();
                setActiveForm((prev) => prev + 1);
              }
            })
            .catch((e) => {
              toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center"
              });
            });
        } else setActiveForm((prev) => prev + 1);
      }
    }
  };

  return (
    <form>
      {/* <div className=' mt-5'> */}
      <div className="d-flex justify-content-start">
        <div className="row">
          {/* <label className="pb-2">Mobile Number *</label> */}
          <div className="form_field_wrapper">
            <label style={{ textAlign: "left", margin: "10px" }}>
              Mobile Number *
            </label>
          </div>

          <div className="col-3 form_field_wrapper">
            <FormControl required fullWidth>
              {/* <InputLabel id="demo-simple-select-label">
                Country code
              </InputLabel> */}
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{
                  backgroundColor: "#f5f5f5",
                }}
                value={contcodePhone}
                // label="Country code"
                onChange={(event) => setContcodePhone(event.target.value)}
              >
                <MenuItem
                  value={"+91"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  +91
                </MenuItem>
                <MenuItem
                  value={"+971"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  +971
                </MenuItem>
                <MenuItem
                  value={"+1"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  +1
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col form_field_wrapper">
            <TextField
              className="form-control"
              type="text"
              placeholder="Enter Mobile number"
              name="phoneNum"
              value={phoneNum}
              onChange={handleChange}
              sx={{
                backgroundColor: "#f5f5f5",
              }}
              required
              error={!!errors.phoneNum || !!phoneNumerror.phoneNum}
              helperText={errors.phoneNum || phoneNumerror.phoneNum}
            />
          </div>
        </div>
      </div>
      {/* <div className="mt-3"> */}
      <div
        className="d-flex justify-content-start"
      // style={{ margin: "25px" }}
      >
        <div className="row">
          {/* <label className="pb-2"> Whatsapp Number </label> */}
          <div className="form_field_wrapper">
            <label style={{ textAlign: "left", margin: "10px" }}>
              Whatsapp Number{" "}
            </label>
          </div>
          <div className="col-3 form_field_wrapper">
            <FormControl
              // required
              fullWidth
            >
              {/* <InputLabel id="demo-simple-select-label">
                Country code
              </InputLabel> */}
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={contcodeWtsap}
                sx={{
                  backgroundColor: "#f5f5f5",
                }}
                // label="Country code"
                onChange={(event) => setContcodeWtsap(event.target.value)}
              >
                <MenuItem
                  value={"+91"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  +91
                </MenuItem>
                <MenuItem
                  value={"+971"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  +971
                </MenuItem>
                <MenuItem
                  value={"+1"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  +1
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col form_field_wrapper">
            <TextField
              type="text"
              placeholder="Enter Whatsapp number"
              className="form-control"
              value={whatsappNum}
              sx={{
                backgroundColor: "#f5f5f5",
              }}
              name="whatsappNum"
              onChange={handleChange}
              // required
              error={!!errors.whatsappNum}
              helperText={errors.whatsappNum}
            />
          </div>
        </div>
      </div>

      <div
        className="row d-flex justify-content-start"
      // style={{ marginLeft: "1%" }}
      >
        <div className="col-lg-6 form_field_wrapper">
          {/* <label>{""}   E-mail <span></span></label> */}
          <label style={{ textAlign: "left", margin: "5px" }}> Email Id </label>

          <TextField
            type="email"
            className="form-control"
            // placeholder='Enter Email Id'
            name="email"
            value={email?.includes("@") ? email : ""}
            onChange={handleChange}
            // required
            disabled
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              color: inputfieldtext(namecolor),
              backgroundColor: "#f5f5f5",
            }}
          />
        </div>
      </div>
      {/* <div className="col-6 d-flex justify-content-center mt-3">
        <button className="btn btn-primary mainbutton">
          {" "}
          {editFalg ? "save" : "Save Changes"}
        </button>
      </div> */}
      <div className="col-lg-12">
        <div className="mt-3 d-flex align-items-center justify-content-between">
          <button
            type="button"
            className="btn btn-outline-dark prev-btn px-lg-4  rounded-pill"
            onClick={() => {
              setActiveForm((prev) => prev - 1);
            }}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-dark px-lg-5  ms-auto d-block rounded-pill next-btn"
            onClick={submitHandel}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default StudentcontactDetails;
