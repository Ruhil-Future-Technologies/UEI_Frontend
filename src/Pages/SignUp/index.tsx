import React, { ChangeEvent, useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { FormControlLabel, Radio, RadioGroup, Typography, Switch } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { MdContactMail } from "react-icons/md";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import phoneicon from "../../assets/img/phone.svg";
import emailicon from "../../assets/img/email.svg";
import passwordicon from "../../assets/img/password.svg";
import NameContext from "../../Pages/Context/NameContext";
import {
  ArrowLeft,
  BackArrowCircle,
  FacebookIcon,
  GoogleIcon,
  VisibilityOn,
  VisibilityOff,
} from "../../assets";
import gLogo from "../../assets/img/logo-white.svg";
import gyansetuLogo from "../../assets/img/gyansetu-logo.svg";
import useApi from "../../hooks/useAPI";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "react-toastify/dist/ReactToastify.css";
import { QUERY_KEYS } from "../../utils/const";
import FullScreenLoader from "../Loader/FullScreenLoader";
import registerHero from "../../assets/img/register-hero.png";
// import "../../assets/css/main.min.css";
import { styled } from "@mui/material/styles";






interface State extends SnackbarOrigin {
  open: boolean;
}
const Signup = () => {
  const signupUrl = QUERY_KEYS.POST_SIGNUP;
  const navigate = useNavigate();
  const { postData, loading } = useApi();
  const [password, setPassword] = useState("");
  // const [name, setName] = useState("")
  //   const [email, setEmail] = useState("");
  //   const [phone, setPhone] = useState("");
  const context = useContext(NameContext);
  const { namecolor, setNamecolor, setNamepro, setProImage }: any = context;

  const [emailphone, setEmailphone] = useState("");
  const [value, setValue] = React.useState("student");
  const [userId, setuserId] = React.useState("Email");
  const [uservalue, setuserValue] = React.useState<any>("");
  const [errorEmail, setEmailError] = useState("");
  const [errorPassword, setPasswordError] = useState("");
  const [checked, setchecked] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [issuccess, setIssuccess] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  //   const handleChangeUserId = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setuserId((event.target as HTMLInputElement).value);
  //   };
  const [showPassword, setShowPassword] = useState(false);
  // let userdata: any = []
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const theme = localStorage?.getItem("theme") || "";
    if (theme === "light") {
      document?.documentElement?.setAttribute("data-bs-theme", theme);      
    } else if (theme === "dark") {
      document?.documentElement?.setAttribute("data-bs-theme", theme);
   
    } else if (theme === "blue-theme")
      document?.documentElement?.setAttribute("data-bs-theme", theme);
    else if (theme === "semi-dark")
      document?.documentElement?.setAttribute("data-bs-theme", theme);
    else if (theme === "bordered-theme")
      document?.documentElement?.setAttribute("data-bs-theme", theme);
    else
    document?.documentElement?.setAttribute("data-bs-theme", theme);
    // document.documentElement.setAttribute('data-theme', theme);
 }, []);


  const handleCloseicon = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setIssuccess(false);
  };
  useEffect(() => {
    if (emailphone && password) {
      setuserValue("");
    }
  }, [emailphone, password]);

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    // Validate email/phone and password
    if (validateInput(emailphone) && validatePassword(password)) {
      // setLoading(true);
      const UserSignUp = {
        userid:
          userId === "Email" || userId === "Phone" ? String(emailphone) : "",
        password: String(password),
        user_type: String(value),
      };

      let emptyKeys: string[] = [];

      // Check for empty fields
      for (const key in UserSignUp) {
        if (UserSignUp.hasOwnProperty(key)) {
          if (UserSignUp[key as keyof typeof UserSignUp] === "") {
            setuserValue(key);
            emptyKeys.push(key);
            break;
          } else {
            setuserValue("");
          }
        }
      }

      // If no empty fields, proceed with registration
      if (emptyKeys.length === 0) {
        try {
          const data = await postData(signupUrl, UserSignUp);

          if (data?.status === 200) {
            // setLoading(false);
            toast.success(data?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
            setIsLoading(false);
            navigate("/");
          } else if (
            data?.status === 400 &&
            data?.message === "Userid already exists"
          ) {
            // setLoading(false);
            toast.error(data?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
            // setLoading(false);
            setIsLoading(false);
          } else {
            setIssuccess(true);
            setMsg(data?.message);
          }
        } catch (error) {
          // setLoading(false);
          setIsLoading(false);
          let errorMessage = "An unexpected error occurred";

          if (error instanceof Error) {
            errorMessage = error?.message;
          }
          //  setLoading(false);
          toast.error(errorMessage, {
            hideProgressBar: true,
            theme: "colored",
          });
        }
      }
    }
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseicon}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const validateInput = (value: string): boolean => {
    if (!value) {
      setEmailError("Please enter an email or phone number");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (phoneRegex.test(value) || emailRegex.test(value)) {
      setEmailError("");
      return true;
    } else {
      setEmailError("Invalid email or phone number format");
      return false;
    }
  };

  const handleChangeData = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (!emailphone) {
      setEmailError("Please fill out this field test");
      // You can set your custom error message logic here if needed
    }
    setEmailphone(value);
    validateInput(value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(""); // Clear error message when password is changed
    validatePassword(e.target.value);
  };

  const validatePassword = (password: string) => {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    if (
      !uppercaseRegex.test(password) ||
      !lowercaseRegex.test(password) ||
      !numberRegex.test(password) ||
      !specialCharRegex.test(password) ||
      password.length < 8
    ) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long."
      );
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleBlurPassword = () => {
    validatePassword(password);
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      {/* <div className="login">
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={issuccess}
          autoHideDuration={6000}
          // onClose={handleClose}
          message={msg}
          action={action}
        />
        <div className="login_inner">
          <div className="form_wrapper">
            <div className="login_form">
              <div className="login_form_inner">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    register(e as any);
                  }}
                >
                  <div className="title_wrapper">
                    <h1 className="login_title">Register Account</h1>
                    <div className="desc">Sign up to continue as Student.</div>
                  </div> */}

      {/* <div className="form_field_wrapper">
                  <Typography
                    sx={{
                      marginLeft: "15px",
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    UserId Select
                  </Typography>
                  <RadioGroup row value={userId} onChange={handleChangeUserId}>
                    <FormControlLabel
                      value="Email"
                      control={<Radio />}
                      label="Email"
                    />
                    <FormControlLabel
                      value="Number"
                      control={<Radio />}
                      label="Number"
                    />
                  </RadioGroup>
                </div> */}
      {/* {userId === "Email" && (
                  <div className="form_field_wrapper">
                    <TextField
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src={emailicon} alt="email" />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Email"
                      variant="outlined"
                    />
                    {uservalue === "userid" && (
                      <small className="text-danger">Please Enter Email</small>
                    )}
                  </div>
                )}
                {userId === "Number" && (
                  <div className="form_field_wrapper">
                    <TextField
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src={phoneicon} alt="phone" />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Mobile Number"
                      variant="outlined"
                    />
                    {uservalue === "userid" && (
                      <small className="text-danger">
                        Please Enter Mobile No
                      </small>
                    )}
                  </div>
                )} */}
      {/* <div className="form_field_wrapper-login">
                    <TextField
                      id="emailphone"
                      value={emailphone}
                      onChange={handleChangeData}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MdContactMail />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Email or Mobile Number"
                      variant="outlined"
                      error={!!errorEmail}
                      helperText={errorEmail}
                      required={true}
                      sx={{
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important', // Set the background color you want
                          WebkitTextFillColor: 'black !important', // Set the text color you want
                        },
                        '& input:-webkit-autofill:hover': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: 'black !important',
                        },
                        '& input:-webkit-autofill:focus': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: 'black !important',
                        },
                        '& input:-webkit-autofill:active': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: 'black !important',
                        },
                      }}
                    /> */}
      {/* {uservalue === "userid" && (
                    <small className="text-danger">
                      Please Enter Mobile No
                    </small>
                  )} */}
      {/* </div>
                  <div className="form_field_wrapper-login">
                    <TextField
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={handleChangePassword}
                      error={!!errorPassword}
                      helperText={errorPassword}
                      onBlur={handleBlurPassword}
                      required={true}
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
                      sx={{
                        '& input:-webkit-autofill': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important', // Set the background color you want
                          WebkitTextFillColor: 'black !important', // Set the text color you want
                        },
                        '& input:-webkit-autofill:hover': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: 'black !important',
                        },
                        '& input:-webkit-autofill:focus': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: 'black !important',
                        },
                        '& input:-webkit-autofill:active': {
                          WebkitBoxShadow: '0 0 0 1000px white inset !important',
                          WebkitTextFillColor: 'black !important',
                        },
                      }}
                      fullWidth
                    />
                    {uservalue === "password" && (
                      <small className="text-danger">
                        Please Enter Password
                      </small>
                    )}
                  </div> */}

      {/* <RadioGroup row value={value} onChange={handleChange}>
                    <FormControlLabel
                      value="student"
                      control={<Radio />}
                      label="Student"
                    />
                    <FormControlLabel
                      value="admin"
                      control={<Radio />}
                      label="Admin"
                    />
                  </RadioGroup> */}
      {/* <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    Register Now
                  </button>
                  <div className="form_field_wrapper signuplink_block">
                    <Link className="ato signupa" to="/">
                      Already have an account? &nbsp;
                      <span className="signup_txt">Login Now</span>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="without-login">
        <header className="container-fluid mb-5 py-3 d-none d-lg-block">
          <div className="row align-items-center">
            <div className="col-6">
              <div className="logoui">
                <img src={gLogo} alt="" onClick={() => navigate("/")} />
                <span>Gyansetu</span>
              </div>             
            </div>         
          </div>
        </header>
        <section className="container pb-5">
          <div className="row">
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
              <img src={registerHero} alt="" />
            </div>
            <div className="col-lg-6">
              <div className="access-card">
                <div className="row gy-3">
                  <div className="col-lg-12">
                    <BackArrowCircle
                      className="d-none d-lg-block mt-3"
                      onClick={() => navigate("/")}
                    />
                    <ArrowLeft
                      className="d-lg-none mt-3"
                      onClick={() => navigate("/")}
                    />
                  </div>
                  <div className="col-lg-12 d-lg-none d-block">
                      <img
                      src={gyansetuLogo}
                      className=" mx-auto my-0 d-block"
                      alt="" width="120"
                    />
                      </div>
                  <div className="col-lg-12">
                    <h1 className=" mt-2 mt-lg-0 mb-0 inter-600">Sign Up</h1>
                    <p className="fs-14 d-lg-none">
                      Input your gyansetu account!
                    </p>
                  </div>
                  <div className="col-lg-12">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        register(e as any);
                      }}
                      method=""
                      className="mb-3"
                    >
                      <div className="mb-3">
                        <label htmlFor="" className="form-label">
                          Email/Phone
                        </label>
                        {/* <input type="text" className="form-control   h-52"  placeholder="Enter Your Email"/> */}
                        <TextField
                          id="emailphone"
                          value={emailphone}
                          onChange={handleChangeData}
                          placeholder="Email or Mobile Number"
                          error={!!errorEmail}
                          helperText={errorEmail}
                          required={true}
                          fullWidth
                          sx={{
                            "& input:-webkit-autofill": {
                              WebkitBoxShadow:
                                "0 0 0 1000px white inset !important", // Set the background color you want
                              WebkitTextFillColor: "black !important", // Set the text color you want
                            },
                            "& input:-webkit-autofill:hover": {
                              WebkitBoxShadow:
                                "0 0 0 1000px white inset !important",
                              WebkitTextFillColor: "black !important",
                            },
                            "& input:-webkit-autofill:focus": {
                              WebkitBoxShadow:
                                "0 0 0 1000px white inset !important",
                              WebkitTextFillColor: "black !important",
                            },
                            "& input:-webkit-autofill:active": {
                              WebkitBoxShadow:
                                "0 0 0 1000px white inset !important",
                              WebkitTextFillColor: "black !important",
                            },
                          }}
                        />
                      </div>
                      {/* <div className="mb-3">
                    <label htmlFor="" className="form-label">Phone</label>
                    <input type="text" className="form-control   h-52"  placeholder="Enter Your Phone"/>
                  </div> */}
                      <div className="mb-3">
                        <label htmlFor="passwordInput" className="form-label">
                          Password
                        </label>
                        <div className="position-relative">
                          {/* <input type="password" className="form-control   h-52" id="passwordInput" placeholder="Enter your password"/>
                    <img src="assets/images/icons/eye-off.svg" id="togglePassword" className="phone-btn" alt=""/> */}
                          <TextField
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={handleChangePassword}
                            error={!!errorPassword}
                            helperText={errorPassword}
                            onBlur={handleBlurPassword}
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
                            sx={{
                              "& input:-webkit-autofill": {
                                WebkitBoxShadow:
                                  "0 0 0 1000px white inset !important", // Set the background color you want
                                WebkitTextFillColor: "black !important", // Set the text color you want
                              },
                              "& input:-webkit-autofill:hover": {
                                WebkitBoxShadow:
                                  "0 0 0 1000px white inset !important",
                                WebkitTextFillColor: "black !important",
                              },
                              "& input:-webkit-autofill:focus": {
                                WebkitBoxShadow:
                                  "0 0 0 1000px white inset !important",
                                WebkitTextFillColor: "black !important",
                              },
                              "& input:-webkit-autofill:active": {
                                WebkitBoxShadow:
                                  "0 0 0 1000px white inset !important",
                                WebkitTextFillColor: "black !important",
                              },
                            }}
                            fullWidth
                          />
                          {uservalue === "password" && (
                            <small className="text-danger">
                              Please Enter Password
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="form-check mb-3 fs-14">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          By Creating your account you have to agree with our{" "}
                          <a href=""> Terms and Condition</a>
                        </label>
                      </div>
                      <button className="btn btn-secondary w-100 mh-56 rounded-pill">
                        Sign Up Now
                      </button>
                      <p className="my-4 text-center">
                        Already have an account?{" "}
                        <Link to="/" style={{color:"#9943EC"}}> Sign in here </Link>
                      </p>
                    </form>
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

export default Signup;
