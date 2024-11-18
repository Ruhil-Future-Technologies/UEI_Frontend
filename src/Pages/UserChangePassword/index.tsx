import React, { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import emailicon from "../../assets/img/email.svg";
import phoneicon from "../../assets/img/phone.svg";
import passwordicon from "../../assets/img/password.svg";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LockResetIcon from '@mui/icons-material/LockReset';
import {
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  Snackbar,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QUERY_KEYS } from "../../utils/const";
import { Field, Formik, FormikHelpers, FormikProps, Form } from "formik";
import * as Yup from "yup";
interface changepasswordform {
  oldpassword: string;
  password: string;
  confpassword: string;
}

const UserChangePassword = () => {
  const user_type = localStorage.getItem("user_type");
  const email = localStorage.getItem("userid");
  const { postData } = useApi();
  const navigator = useNavigate();
  const [password, setPassword] = useState("");
  const [oldpassword, setOldPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");
  const initialState = {
    oldpassword: "",
    password: "",
    confpassword: "",
  };
  const [changepassword, setChangePassword] = useState(initialState);
  let [searchParams, setSearchParams] = useSearchParams();
  const [uservalue, setuserValue] = React.useState<any>("");

  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const changepassUrl = QUERY_KEYS.CHANGE_PASSWORD;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  const uppercaseRegex = /[A-Z]/;

  const formRef = useRef<FormikProps<changepasswordform>>(null);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const handleClickShowConfPassword = () => {
    setShowConfPassword(!showConfPassword);
  };
  const changePassword = (e: any) => {
    e.preventDefault();
    let UserSignUp = {
      email: String(email),
      new_password: String(password),
      old_password: String(oldpassword),
      user_type: String(user_type),
    };
    let emptyKeys: string[] = [];
    for (const key in UserSignUp) {
      if (UserSignUp.hasOwnProperty(key)) {
        if (UserSignUp[key as keyof typeof UserSignUp] === "") {
          emptyKeys.push(key);
          break;
        } else {
          setuserValue("");
        }
      }
    }

    if (emptyKeys.length === 0) {
      postData(`${changepassUrl}`, UserSignUp)
        .then((data: any) => {
          if (data?.status === 200) {
            // navigator('/')
            toast.success(
              "Your Password has been changed successfuly!! Please try to login again with new password",
              {
                hideProgressBar: true,
                theme: "colored",
              }
            );
          } else if (
            data?.status === 404 &&
            data?.message === "Invalid userid or password"
          ) {
            toast.error("Invalid userid or password!", {
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
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    }
  };
  const handleSubmit = async (
    formData: changepasswordform,
    { resetForm }: FormikHelpers<changepasswordform>
  ) => {
    // e.preventDefault()
    // e.target.reset()
    let UserSignUp = {
      email: String(email),
      new_password: String(formData.password),
      old_password: String(formData.oldpassword),
      user_type: String(user_type),
    };
    let emptyKeys: string[] = [];
    for (const key in UserSignUp) {
      if (UserSignUp.hasOwnProperty(key)) {
        if (UserSignUp[key as keyof typeof UserSignUp] === "") {
          emptyKeys.push(key);
          break;
        } else {
          setuserValue("");
        }
      }
    }

    if (emptyKeys.length === 0) {
      postData(`${changepassUrl}`, UserSignUp)
        .then((data: any) => {
          if (data?.status === 200) {
            // navigator('/')
            toast.success(
              "Your Password has been changed successfuly! Please try to login again with new password",
              {
                hideProgressBar: true,
                theme: "colored",
              }
            );
            resetForm();
            setPassword("");
            setOldPassword("");
            setConfPassword("");
          } else if (
            data?.status === 404 &&
            data?.message === "Invalid userid or password"
          ) {
            toast.error("Invalid userid or password", {
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
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    }
  };
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
    fieldName: string
  ) => {
    setChangePassword((prevValue) => {
      return {
        ...prevValue,
        [e.target.name]: e.target.value,
      };
    });
    formRef?.current?.setFieldValue(fieldName, e.target.value);
    await formRef?.current?.validateField(fieldName);
    if (
      formRef?.current?.errors?.[fieldName as keyof changepasswordform] !==
      undefined
    ) {
      formRef?.current?.setFieldError(
        fieldName,
        formRef?.current?.errors?.[fieldName as keyof changepasswordform]
      );
      formRef?.current?.setFieldTouched(fieldName, true);
    }
  };
  const changePasswordSchema = Yup.object().shape({
    oldpassword: Yup.string()
      .required("Please enter a password")
      .min(
        8,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .matches(
        uppercaseRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .matches(
        lowercaseRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .matches(
        numberRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .matches(
        specialCharRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      ),

    password: Yup.string()
      .required("Please enter a password")
      .min(
        8,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .matches(
        uppercaseRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .matches(
        lowercaseRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .matches(
        numberRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .matches(
        specialCharRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      ),

    confpassword: Yup.string()
      .required("Please enter a password")
      .min(
        8,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .matches(
        uppercaseRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .matches(
        lowercaseRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .matches(
        numberRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .matches(
        specialCharRegex,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long"
      )
      .oneOf([Yup.ref("password")], "Password did not match."),
  });

  return (
    <>
      <div className="main-wrapper">
        <div className="main-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
			<div className="breadcrumb-title pe-3">Change Password</div>		
            <div className="ps-3">
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb mb-0 p-0">
						<li className="breadcrumb-item"><a href=""><LockResetIcon/></a>
						</li>
						<li className="breadcrumb-item active" aria-current="page">Reset My Password</li>
					</ol>
				</nav>
			</div>
		</div>
          <div className="profile_section">
            <div className="card w-100 rounded-4 shadow-none desk-card p-4">
              <div className="card-body">
                {/* <Typography variant="h6">
                  <div className="main_title"></div>
                </Typography> */}
                <Formik
                  // onSubmit={(formData) => handleSubmit(formData)}
                  onSubmit={(formData, formikHelpers) =>
                    handleSubmit(formData, formikHelpers)
                  }
                  initialValues={{
                    oldpassword: oldpassword,
                    password: password,
                    confpassword: confpassword,
                  }}
                  enableReinitialize
                  validationSchema={changePasswordSchema}
                  innerRef={formRef}
                >
                  {({ errors, values, touched }) => (
                    <Form>
                      <div className="row gy-4 flex-column justify-content-center align-items-center">
                        <div className="col-md-4">
                          <div className="form_field_wrapper w-100">
                            <TextField
                              type={showOldPassword ? "text" : "password"}
                              name="oldpassword"
                              label="Current Password"
                              className="w-100"
                              value={values?.oldpassword}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleChange(e, "oldpassword")}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <img src={passwordicon} alt="oldpassword" />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowOldPassword}
                                      edge="end"
                                    >
                                      {showOldPassword ? (
                                        <Visibility />
                                      ) : (
                                        <VisibilityOff />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                            {touched?.oldpassword && errors?.oldpassword ? (
                              <small className="text-danger d-block">
                                {errors?.oldpassword}
                              </small>
                            ) : (
                              <></>
                            )}
                          </div>

                          
                          {/* </div> */}
                        </div>

                        <div className="col-lg-4">
                          {" "}
                          <div className="form_field_wrapper">
                            <TextField
                              type={showPassword ? "text" : "password"}
                              name="password"
                              label="New Password"
                              className="w-100"
                              value={values?.password}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleChange(e, "password")}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <img src={passwordicon} alt="password" />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      edge="end"
                                    >
                                      {showPassword ? (
                                        <Visibility />
                                      ) : (
                                        <VisibilityOff />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                            {touched?.password && errors?.password ? (
                              <small className="text-danger d-block">{errors?.password}</small>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4">
                        <div className="form_field_wrapper">
                            <TextField
                            
                              type={showConfPassword ? "text" : "password"}
                              name="confpassword"
                              className="w-100"
                              label="Confirm Password"
                              value={values?.confpassword}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => handleChange(e, "confpassword")}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <img
                                      src={passwordicon}
                                      alt="confpassword"
                                    />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowConfPassword}
                                      edge="end"
                                    >
                                      {showConfPassword ? (
                                        <Visibility />
                                      ) : (
                                        <VisibilityOff />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                            {touched?.confpassword && errors?.confpassword ? (
                              <small className="text-danger d-block">
                                {errors?.confpassword}
                              </small>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                        <div className="col-lg-4">
                        <button className="btn btn-primary w-100 mh-56">
                          {"Change Password"}
                        </button>
                      </div>
                      </div>                     
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserChangePassword;
