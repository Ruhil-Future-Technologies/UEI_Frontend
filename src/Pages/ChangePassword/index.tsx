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
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  Snackbar,
  Typography,
} from "@mui/material";
import { Field, Formik, FormikHelpers, FormikProps, Form } from "formik";
import * as Yup from "yup";
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import gLogo from "../../assets/img/logo-white.svg";
import loginImage from "../../assets/img/login-image.png";
import { Autoplay, Pagination } from "swiper/modules";
import {
  ArrowLeft,
  BackArrowCircle,
  VisibilityOn,
  VisibilityOff,
} from "../../assets";
import "swiper/css";
import "swiper/css/pagination";
// import "../../assets/css/main.min.css";
import "react-toastify/dist/ReactToastify.css";
import { QUERY_KEYS } from "../../utils/const";
interface changepasswordform {
  newpassword: string;
  confpassword: string;
}
const ChangePassword = () => {
  const { postData } = useApi();
  const navigate = useNavigate();
  const [confpassword, setConfPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  let [searchParams, setSearchParams] = useSearchParams();
  const [uservalue, setuserValue] = React.useState<any>("");
  const initialState = {
    new_password: "",
    conf_password: "",
  };
  const [changepassword, setChangePassword] = useState(initialState);
  const [email, setEmail] = useState(searchParams?.get("email"));
  const [user_type, setUserType] = useState(searchParams?.get("user_type"));
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const changepassUrl = QUERY_KEYS.RESET_PASSWORD;
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

  const changePassword = (e: any) => {
    e.preventDefault();
    let UserSignUp = {
      email: String(email),
      new_password: String(newpassword),
      conf_password: String(confpassword),
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
            navigate("/");
            toast.success(data?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
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
      new_password: String(formData.newpassword),
      conf_password: String(formData.confpassword),
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
            navigate("/");
            toast.success(data?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
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
    newpassword: Yup.string()
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
      .oneOf([Yup.ref("newpassword")], "Password did not match."),
  });

  return (
    // <div className="login">
    //     <div className="login_inner">

    //         <div className="form_wrapper">
    //             <div className="login_form">
    //             <Formik
    //             // onSubmit={(formData) => handleSubmit(formData)}
    //             onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
    //             initialValues={{
    //             newpassword:newpassword,
    //             confpassword:confpassword
    //             }}
    //             enableReinitialize
    //             validationSchema={changePasswordSchema}
    //             innerRef={formRef}
    //         >

    //             {({ errors, values, touched }) => (
    //                 <Form>

    //                 <div className="login_form_inner">
    //                     <div className='title_wrapper'>
    //                         <h1 className="login_title">Reset Password !</h1>
    //                         <div className='desc'>Reset the password of user.</div>
    //                     </div>
    //                         <div className="form_field_wrapper">
    //                                 <TextField
    //                                     type={showOldPassword ? "text" : "password"}
    //                                     placeholder="New Password"
    //                                     id="newpassword"
    //                                     name="newpassword"
    //                                     value={values?.newpassword}
    //                                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "newpassword")}
    //                                     required={true}
    //                                     InputProps={{
    //                                         startAdornment: (
    //                                             <InputAdornment position="start">
    //                                                 <img src={passwordicon} alt='newpassword' />
    //                                             </InputAdornment>
    //                                         ),
    //                                         endAdornment: (
    //                                             <InputAdornment position="end">
    //                                                 <IconButton
    //                                                     aria-label="toggle password visibility"
    //                                                     onClick={handleClickShowOldPassword}
    //                                                     edge="end"
    //                                                 >
    //                                                     {showOldPassword ? <Visibility /> : <VisibilityOff />}
    //                                                 </IconButton>
    //                                             </InputAdornment>
    //                                         ),
    //                                     }}
    //                                     fullWidth
    //                                 />
    //                                  {touched?.newpassword && errors?.newpassword ?
    //                                         <p style={{ color: 'red' }}>{errors?.newpassword}</p> : <></>
    //                                     }
    //                             </div>
    //                             <div className="form_field_wrapper">
    //                                 <TextField
    //                                     type={showPassword ? "text" : "password"}
    //                                     placeholder="Confirm password"
    //                                     value={values?.confpassword}
    //                                     id="confpassword"
    //                                     name="confpassword"
    //                                     onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "confpassword")}
    //                                     required={true}
    //                                     InputProps={{
    //                                         startAdornment: (
    //                                             <InputAdornment position="start">
    //                                                 <img src={passwordicon} alt='confpassword' />
    //                                             </InputAdornment>
    //                                         ),
    //                                         endAdornment: (
    //                                             <InputAdornment position="end">
    //                                                 <IconButton
    //                                                     aria-label="toggle password visibility"
    //                                                     onClick={handleClickShowPassword}
    //                                                     edge="end"
    //                                                 >
    //                                                     {showPassword ? <Visibility /> :  <VisibilityOff />}
    //                                                 </IconButton>
    //                                             </InputAdornment>
    //                                         ),
    //                                     }}
    //                                     fullWidth
    //                                 />
    //                                 {touched?.confpassword && errors?.confpassword ?
    //                                         <p style={{ color: 'red' }}>{errors?.confpassword}</p> : <></>
    //                                     }
    //                             </div>
    //                             <button type="submit" className='btn btn-primary'> Reset Password</button>

    //                 </div>

    //                 </Form>
    //             )}
    //             </Formik>
    //             </div>
    //         </div>
    //     </div>
    // </div>
    <>
      <div className="without-login">
        <header className="container-fluid mb-5 py-3 d-none d-lg-block">
          <div className="row align-items-center">
            <div className="col-6">
              <div className="logoui">
                <img onClick={() => navigate("/")} src={gLogo} alt="" />
                <span>Gyansetu</span>
              </div>
              
            </div>
          </div>
        </header>
        <section className="container pb-5">
          <div className="row ">
            <div className="col-lg-6 d-none d-lg-block">
              <Swiper
                loop
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  el: ".swiper-pagination",
                }}
                modules={[Autoplay, Pagination]}
                className="mySwiper login-textslider"
              >
                <SwiperSlide>
                  <div className="login-slider-card">
                    <h2 className="fs-5 fw-semibold">
                      Learn With Gyansetu A.I.
                    </h2>
                    <p className="fs-14">
                      Welcome to the future of learning! Our AI-based Learning
                      Management System (LMS) revolutionizes the way you learn,
                      providing personalized and adaptive educational
                      experiences tailored to your individual needs. Harness the
                      power of artificial intelligence to make learning more
                      efficient, engaging, and effective.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="login-slider-card">
                    <h2 className="fs-5 fw-semibold">
                      Learn With Gyansetu A.I.
                    </h2>
                    <p className="fs-14">
                      Welcome to the future of learning! Our AI-based Learning
                      Management System (LMS) revolutionizes the way you learn,
                      providing personalized and adaptive educational
                      experiences tailored to your individual needs. Harness the
                      power of artificial intelligence to make learning more
                      efficient, engaging, and effective.
                    </p>
                  </div>
                </SwiperSlide>
                <div className="swiper-pagination"></div>
              </Swiper>
              <img src={loginImage} alt="" />
            </div>
            <div className="col-lg-6">
              <div className="access-card">
                <div className="row gy-4">
                  <div className="col-lg-12">
                    <h1 className=" mt-4 mt-lg-0 mb-0 inter-600">
                      Reset Password
                    </h1>
                  </div>
                  <div className="col-lg-12">
                    <Formik
                      // onSubmit={(formData) => handleSubmit(formData)}
                      onSubmit={(formData, formikHelpers) =>
                        handleSubmit(formData, formikHelpers)
                      }
                      initialValues={{
                        newpassword: newpassword,
                        confpassword: confpassword,
                      }}
                      enableReinitialize
                      validationSchema={changePasswordSchema}
                      innerRef={formRef}
                    >
                      {({ errors, values, touched }) => (
                        <Form>
                          <div className="login_form_inner">
                            <div className="form_field_wrapper">
                              <label htmlFor="" className="form-label">
                                New Password
                              </label>
                              <TextField
                                className="mb-4"
                                type={showOldPassword ? "text" : "password"}
                                placeholder="New Password"
                                id="newpassword"
                                name="newpassword"
                                value={values?.newpassword}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => handleChange(e, "newpassword")}
                                required={true}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowOldPassword}
                                        edge="end"
                                      >
                                        {showOldPassword ? (
                                          <VisibilityOn />
                                        ) : (
                                          <VisibilityOff />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                                fullWidth
                              />
                              {touched?.newpassword && errors?.newpassword ? (
                                <p style={{ color: "red" }}>
                                  {errors?.newpassword}
                                </p>
                              ) : (
                                <></>
                              )}
                            </div>
                            <div className="form_field_wrapper">
                              <label htmlFor="" className="form-label">
                                Confirm Password
                              </label>
                              <TextField
                                className="mb-4"
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm password"
                                value={values?.confpassword}
                                id="confpassword"
                                name="confpassword"
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => handleChange(e, "confpassword")}
                                required={true}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                      >
                                        {showPassword ? (
                                          <VisibilityOn />
                                        ) : (
                                          <VisibilityOff />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                                fullWidth
                              />
                              {touched?.confpassword && errors?.confpassword ? (
                                <p style={{ color: "red" }}>
                                  {errors?.confpassword}
                                </p>
                              ) : (
                                <></>
                              )}
                            </div>
                            <button
                              type="submit"
                              className="btn btn-primary w-100"
                            >
                              {" "}
                              Reset Password
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ChangePassword;
