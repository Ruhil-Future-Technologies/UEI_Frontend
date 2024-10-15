import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Snackbar,
  Typography,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
// import { jwtDecode, JwtPayload } from "jwt-decode";
import { toast } from "react-toastify";
import { MdContactMail } from "react-icons/md";
import { Visibility } from "@mui/icons-material";
import useApi from "../../hooks/useAPI";
import { QUERY_KEYS, QUERY_KEYS_STUDENT } from "../../utils/const";
import FullScreenLoader from "../../Pages/Loader/FullScreenLoader";
import emailicon from "../../assets/img/email.svg";
import phoneicon from "../../assets/img/phone.svg";
import passwordicon from "../../assets/img/password.svg";
import gLogo from "../../assets/img/logo-white.svg";
import gyansetuLogo from "../../assets/img/gyansetu-logo.svg";
import loginImage from "../../assets/img/login-image.png";
import {
  ArrowLeft,
  BackArrowCircle,
  FacebookIcon,
  GoogleIcon,
  VisibilityOn,
  VisibilityOff,
} from "../../assets";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "react-toastify/dist/ReactToastify.css";
// import "../../assets/css/main.min.css";

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    let login_id = localStorage.getItem("_id");
    const token = localStorage.getItem("token");
    if (login_id) {
      navigate("/main/DashBoard");
    }
  }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     try {
  //       // const decodedToken = jwtDecode(token);
  //       const decodedToken: JwtPayload = jwtDecode<JwtPayload>(token);
  //       const currentTime = Date.now() / 1000; // Current time in seconds
  //       // console.log("t-=-=-=-=",decodedToken,currentTime)
  //       // if (decodedToken.exp < currentTime) {
  //         if (decodedToken.exp && decodedToken.exp < currentTime) {
  //         // Token has expired
  //         localStorage.removeItem("token");
  //         localStorage.removeItem("_id");
  //         navigate("/"); // Redirect to login page
  //       } else {
  //         // Token is valid
  //         const login_id = localStorage.getItem("_id");
  //         if (login_id) {
  //           navigate("/main/DashBoard");
  //         }
  //       }
  //     } catch (error) {
  //       // console.error("Invalid token", error);
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("_id");
  //       navigate("/"); // Redirect to login page
  //     }
  //   } else {
  //     navigate("/"); // Redirect to login page if no token found
  //   }
  // }, [navigate]);

  //   useEffect(() => {
  //     const token = localStorage.getItem('token');
  //     const tokenExpiry = localStorage.getItem('tokenExpiry');
  // console.log("test expire time",tokenExpiry)
  //     if (token && tokenExpiry) {
  //       const currentTime = Date.now();
  //       console.log("test expire time in",currentTime,tokenExpiry)
  //       if (currentTime > parseInt(tokenExpiry)) {
  //         console.log("test expire time finally done",currentTime,tokenExpiry)
  //         // Token has expired
  //         localStorage.removeItem('token');
  //         localStorage.removeItem('tokenExpiry');
  //         navigate('/');
  //       }
  //     } else {
  //       navigate('/');
  //     }
  //   }, [navigate]);

  const { postData } = useApi();

  const navigator = useNavigate();
  const [password, setPassword] = useState("");
  // const [email, setEmail] = useState("")
  // const [phone, setPhone] = useState("")
  const [emailphone, setEmailphone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setuserId] = React.useState("Email");
  const [uservalue, setuserValue] = React.useState<any>("");
  const [value, setValue] = React.useState("student");
  const loginUrl = QUERY_KEYS.POST_LOGIN;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const profileURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const [flagforcheck, setFlagforcheck] = useState<boolean>(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
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

  useEffect(() => {
    if (emailphone && password) {
      setuserValue("");
    }
  }, [emailphone, password]);


  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Assuming emailphone is the value being validated
    if (validateInput(emailphone)) {
      password && setLoading(true);
      const UserSignUp = {
        userid:
          userId === "Email" || userId === "Phone" ? String(emailphone) : "",
        password: String(password),
        user_type: String(value),
      };

      // Find empty keys in UserSignUp
      const emptyKeys = Object.keys(UserSignUp).filter(
        (key) => UserSignUp[key as keyof typeof UserSignUp] === ""
      );

      if (emptyKeys.length > 0) {
        setuserValue(emptyKeys[0]);
        return;
      } else {
        setuserValue("");
      }

      try {
        const data = await postData(loginUrl, UserSignUp);
        if (data?.status === 200) {
          setLoading(false);
          await localStorage.setItem("token", data?.token);
          handleSuccessfulLogin(data, UserSignUp?.password);
        } else if (
          data?.status === 404 &&
          data?.message === "Invalid userid or password"
        ) {
          setLoading(false);
          toast.error("Invalid userid or password", {
            hideProgressBar: true,
            theme: "colored",
          });
        } else {
          setLoading(false);
          toast.error(data?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        }
      } catch (error) {
        setLoading(false);
        let errorMessage = "An unexpected error occurred";

        if (error instanceof Error) {
          errorMessage = error?.message;
        }

        toast.error("Invalid userid or password", {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  };

  const handleSuccessfulLogin = (data: any, password: string) => {
    localStorage.setItem("token", data?.token);
    localStorage.setItem("user_type", data?.data?.user_type);
    localStorage.setItem("userid", data?.data?.userid);
    localStorage.setItem("pd", password);
    localStorage.setItem("userdata", JSON.stringify(data?.data));
    localStorage.setItem("_id", data?.data?.id);
    localStorage.setItem("lastRoute", window.location.pathname);    

    const tokenLifespan = 7100; // token lifespan in seconds (1 hour)
    // Calculate the expiry time
    const expiryTime = Date.now() + tokenLifespan * 1000;
    localStorage.setItem("tokenExpiry", expiryTime.toString());

    toast.success("User logged in successfully", {
      hideProgressBar: true,
      theme: "colored",
      autoClose: 500,
    });
    let usertype = localStorage.getItem("token");
    // if(data?.data?.id && data.data.user_type ==='student' && usertype){
    //  getData(profileURL+'/'+data?.data?.id).then((data) => {
    //    console.log(data.data);
    //    if(data.status==200){
    //      setFlagforcheck(true);
    //    }
    //  });
    //  }
    const userType = data.data.user_type;
    // navigator(userType === "admin" ? "/profile-chat" : "/profile-chat");
    navigator(userType === "admin" ? "/main/Dashboard" : "/main/Dashboard");
  };

  //   const handleChangeUserId = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setuserId((event.target as HTMLInputElement).value);
  //   };

  const validateInput = (value: string): boolean => {
    if (!value) {
      setError("Please enter an email or phone number");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (phoneRegex.test(value) || emailRegex.test(value)) {
      setError("");
      return true;
    } else {
      setError("Invalid email or phone number format");
      return false;
    }
  };

  const handleChangeData = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setEmailphone(value);
    validateInput(value);
  };

  // const handleLoginWithGoogle = () => {
  //   console.log("Google Login");

  //   const callbackUrl = `http://localhost:3000/main/DashBoard`;
  //   const googleClientId = "1043008903468-cu580j8e65vo7a97mmlgj1jbu63lbnep.apps.googleusercontent.com";
  //   const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
  //     callbackUrl
  //   )}&response_type=token&client_id=${googleClientId}&scope=openid%20email%20profile`;
  //   window.location.href = targetUrl;
  // };

  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="without-login">
        <header className="container-fluid mb-5 py-3 d-none d-lg-block">
          <div className="row align-items-center">
            <div className="col-6">
              <div className="logoui">
                <img src={gLogo} alt="" />
                <span>Gyansetu</span>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex justify-content-end">
                <Link to="/signup" className="btn btn-secondary px-4">
                  Register
                </Link>
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
              <img src={loginImage} alt="" />
            </div>
            <div className="col-lg-6">
              <div className="access-card">
                {showForm ? (
                  <>
                    <div className="row gy-3">
                      <div className="col-lg-12">
                        <BackArrowCircle
                          className="d-none d-lg-block mt-3"
                          onClick={() => setShowForm(false)}
                        />
                        <ArrowLeft
                          className="d-lg-none mt-3"
                          onClick={() => setShowForm(false)}
                        />
                      </div>
                      <div className="col-lg-12 d-lg-none d-block">
                        <img
                          src={gyansetuLogo}
                          className=" mx-auto my-0 d-block"
                          alt="" width="120px"
                        />
                      </div>
                      <div className="col-lg-12">
                        <h1 className="mt-2 mb-0 inter-600">Sign In</h1>
                        <p className="fs-14 d-lg-none">
                          Input your Gyansetu account!
                        </p>
                      </div>
                      <div className="col-lg-12">
                        <form method="" className="mb-3">
                          <div className="mb-3">
                            <label htmlFor="" className="form-label">
                              Email / Phone
                            </label>
                            {/* <input
                                type="text"
                                className="form-control h-52"
                                placeholder="Enter Your Email / Phone"
                                onChange={handleChangeData}
                              /> */}
                            <TextField
                              id="email/phone"
                              value={emailphone}
                              // className="form-control"
                              onChange={handleChangeData}
                              required={true}
                              placeholder="Enter Your Email / Phone"
                              // variant="outlined"
                              error={!!error}
                              helperText={error}
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
                          <div className="mb-3">
                            <label
                              htmlFor="passwordInput"
                              className="form-label"
                            >
                              Password
                            </label>
                            <div className="position-relative">
                              {/* <input
                                  type={showPassword ? "text" : "password"}
                                  className="form-control h-52"
                                  id="passwordInput"
                                  placeholder="Type your password"
                                  onChange={(e) => setPassword(e.target.value)}
                                /> */}
                              <TextField
                                // id="passwordInput"
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            </div>
                            {uservalue === "password" && (
                              <small className="text-danger">
                                Please Enter Password
                              </small>
                            )}
                          </div>
                          <div>
                            <RadioGroup
                              row
                              value={value}
                              onChange={handleChange}
                            >
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
                            </RadioGroup>
                          </div>
                          <div className="mt-2 mb-4 text-center">
                            <Link
                              to="/forgotpassword"
                              className="text-danger fw-semibold"
                            >
                              Forgot Password?
                            </Link>
                          </div>
                          <button
                            type="submit"
                            className="btn btn-secondary w-100 mb-3 mh-56 rounded-pill"
                            onClick={(e) => {
                              e.preventDefault();
                              login(e as any);
                            }}
                          >
                            Sign in Now
                          </button>
                          <p className="text-center mt-2">
                            New to Gyansetu?{" "}
                            <Link
                              to="/signup"
                              className="fw-semibold"
                              style={{ color: "#9943EC" }}
                            >
                              {" "}
                              Sign up here
                            </Link>
                          </p>
                        </form>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="my-4 inter-600 d-none d-lg-block">
                      Sign In
                    </h1>
                    <img
                      src={gyansetuLogo}
                      className="d-lg-none d-block mx-auto my-4"
                      alt=""
                    />
                    <p className="text-center fs-14 px-4 mb-5 d-lg-none">
                      By using our services you are agreeing to our
                      <a href=""> Terms</a> and <a href="">Privacy Policy</a>
                    </p>
                    <div className="row gy-4 flex-wrap-reverse flex-lg-wrap">
                      <div className="col-lg-12">
                        <p className="text-center d-lg-none">
                          New to Gyansetu?{" "}
                          <Link to={"/signup"} style={{ color: "#9943EC" }}>
                            {" "}
                            Sign up here
                          </Link>
                        </p>
                      </div>
                      <div className="col-lg-12">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            onClick={() => setShowForm(true)}
                            className="btn btn-secondary w-100 outsecbtn rounded-pill"
                          >
                            Sign in with Email / Phone
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="seprator">
                          <span> or </span>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <button className="btn btn-outline-secondary outsecbtn rounded-pill">
                          <FacebookIcon /> Login with Facebook
                        </button>
                      </div>
                      <div className="col-lg-12">
                        <button className="btn btn-outline-secondary outsecbtn rounded-pill">
                          <GoogleIcon /> Login with Google
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <div className="login">
        <div className="login_inner">
          <div className="form_wrapper">
            <div className="login_form">
              <div className="login_form_inner">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    login(e as any);
                  }}
                >
                  <div className="title_wrapper">
                    <h1 className="login_title">Welcome Back !</h1>
                    <div className="desc">Sign in to continue to our web.</div>
                  </div> */}
      {/* <div className="form_field_wrapper">
                                    <Typography sx={{ marginLeft: "15px", display: "flex", alignItems: "flex-start" }}>UserId Select</Typography>
                                    <RadioGroup
                                        row
                                        value={userId}
                                        onChange={handleChangeUserId}
                                    >
                                        <FormControlLabel value="Email" control={<Radio />} label="Email" />
                                        <FormControlLabel value="Number" control={<Radio />} label="Number" />
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
                        <small className="text-danger">
                          Please Enter Email
                        </small>
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
                      id="email/phone"
                      value={emailphone}
                      onChange={handleChangeData}
                      required={true}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MdContactMail />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Email or Mobile Number"
                      variant="outlined"
                      error={!!error}
                      helperText={error}
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
                  <div className="form_field_wrapper-login">
                    <TextField
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  </div> */}
      {/* <div className="form_field_wrapper-login forgotpass">
                    <Link className="ato" to="/forgotpassword">
                      Forgot Password?
                    </Link>
                  </div> */}
      {/* <div className="form_field_wrapper signuplink_block">
                    <Link className="ato signupa" to="/forgotpassword">
                      <span className="signup_txt"> Forgot Password?</span>
                    </Link>
                  </div>
                  <RadioGroup row value={value} onChange={handleChange}>
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
                  </RadioGroup>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    //   onClick={(e) => login(e)}
                  >
                    {" "}
                    Login
                  </button>
                  <div className="form_field_wrapper signuplink_block">
                    <Link className="ato signupa" to="/signup">
                      Don't have an account? &nbsp;
                      <span className="signup_txt">Register Now</span>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Login;
