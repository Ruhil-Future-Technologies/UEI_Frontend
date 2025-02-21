/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
// import { jwtDecode, JwtPayload } from "jwt-decode";
import { toast } from 'react-toastify';
import useApi from '../../hooks/useAPI';
import { QUERY_KEYS } from '../../utils/const';
import FullScreenLoader from '../../Pages/Loader/FullScreenLoader';
import gLogo from '../../assets/img/logo-white.svg';
import gyansetuLogo from '../../assets/img/gyansetu-logo.svg';
import loginImage from '../../assets/img/login-image.png';
import {
  ArrowLeft,
  BackArrowCircle,
  FacebookIcon,
  GoogleIcon,
  VisibilityOn,
  VisibilityOff,
} from '../../assets';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'react-toastify/dist/ReactToastify.css';
import OtpCard from '../../Components/Dailog/OtpCard';
// import "../../assets/css/main.min.css";

const Login = () => {
  // toast.dismiss()
  const navigate = useNavigate();
  useEffect(() => {
    toast.dismiss();
    const login_id = localStorage.getItem('user_uuid');
    if (login_id) {
      navigate('/main/DashBoard');
    }
  }, []);

  const { postData } = useApi();

  const navigator = useNavigate();
  const [password, setPassword] = useState('');
  const [emailphone, setEmailphone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [popupOtpCard, setPopupOtpCard] = useState(false);
  const [uservalue, setuserValue] = React.useState<any>('');
  const [value, setValue] = React.useState('student');
  const loginUrl = QUERY_KEYS.POST_LOGIN;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (event: SelectChangeEvent) => {
    setValue((event.target as HTMLInputElement).value);
  };
  useEffect(() => {
    const theme = localStorage?.getItem('theme') || '';
    if (theme === 'light') {
      document?.documentElement?.setAttribute('data-bs-theme', theme);
    } else if (theme === 'dark') {
      document?.documentElement?.setAttribute('data-bs-theme', theme);
    } else if (theme === 'blue-theme')
      document?.documentElement?.setAttribute('data-bs-theme', theme);
    else if (theme === 'semi-dark')
      document?.documentElement?.setAttribute('data-bs-theme', theme);
    else if (theme === 'bordered-theme')
      document?.documentElement?.setAttribute('data-bs-theme', theme);
    else document?.documentElement?.setAttribute('data-bs-theme', theme);
    // document.documentElement.setAttribute('data-theme', theme);
  }, []);

  useEffect(() => {
    if (emailphone && password) {
      setuserValue('');
    }
  }, [emailphone, password]);

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Assuming emailphone is the value being validated
    if (validateInput(emailphone)) {
      if (password) {
        setLoading(true);
      }
      const UserSignUp = {
        email: String(emailphone),
        password: String(password),
        user_type: String(value),
      };

      // Find empty keys in UserSignUp
      const emptyKeys = Object.keys(UserSignUp).filter(
        (key) => UserSignUp[key as keyof typeof UserSignUp] === '',
      );

      if (emptyKeys.length > 0) {
        setuserValue(emptyKeys[0]);
        return;
      } else {
        setuserValue('');
      }
      try {
        const data = await postData(loginUrl, UserSignUp);
        console.log(data);
        if (data?.status === true) {
          setLoading(false);
          localStorage.setItem('token', 'Bearer ' + data?.token);
          handleSuccessfulLogin(data, UserSignUp?.password);
        } else {
          console.log(data.message);
          if (data?.message === 'User is not verified') {
            setPopupOtpCard(true);
          }
          setLoading(false);
          toast.error(data?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
        toast.error('Invalid userid or password', {
          hideProgressBar: true,
          theme: 'colored',
        });
      }
    }
  };

  const handleSubmit = (otp: string) => {
    const payload = {
      email: emailphone,
      otp: otp,
    };
    postData(`/auth/verify-otp`, payload).then((data) => {
      console.log(data);
      if (data.status === true) {
        handleSuccessfulLogin(data);
        toast.success(data.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
        setPopupOtpCard(false);
      }
    });
  };
  const handleSuccessfulLogin = (data: any, password?: string) => {
    console.log(data);

    localStorage.setItem('token', 'Bearer ' + data?.data?.access_token);
    localStorage.setItem('user_type', value);
    localStorage.setItem('user_uuid', data?.data?.user_uuid);
    localStorage.setItem('pd', password || '');

    localStorage.setItem('lastRoute', window.location.pathname);
    localStorage.setItem('email', data?.data.email)
    localStorage.setItem('phone', data?.data.phone)

    const tokenLifespan = 7100; // token lifespan in seconds (1 hour)
    // Calculate the expiry time
    const expiryTime = Date.now() + tokenLifespan * 1000;
    localStorage.setItem('tokenExpiry', expiryTime.toString());

    toast.success('User logged in successfully', {
      hideProgressBar: true,
      theme: 'colored',
      autoClose: 500,
    });

    //const userType = data.data.user_type?'institute':data.data.user_type;
    const userType = value;
    if (userType === 'admin') {
      navigator('/main/Dashboard');
    } else if (userType === 'student') {
      navigator('/main/Dashboard');
    } else if (userType === 'teacher') {
      navigator('/teacher-dashboard');
    } else if (userType === 'institute') {
      navigate('/institution-dashboard');
    }
    // navigator(userType === "admin" ? "/profile-chat" : "/profile-chat");
    //navigator(userType === 'admin' ? '/main/Dashboard' : '/main/Dashboard');
  };

  const validateInput = (value: string): boolean => {
    if (!value) {
      setError('Please enter an email or phone number');
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (phoneRegex.test(value) || emailRegex.test(value)) {
      setError('');
      return true;
    } else {
      setError('Invalid email or phone number format');
      return false;
    }
  };

  const handleChangeData = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setEmailphone(value);
    validateInput(value);
  };

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
                  el: '.swiper-pagination',
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
                          alt=""
                          width="120px"
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
                              inputProps={{ 'data-testid': 'email' }}
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
                                '& input:-webkit-autofill': {
                                  WebkitBoxShadow:
                                    '0 0 0 1000px white inset !important', // Set the background color you want
                                  WebkitTextFillColor: 'black !important', // Set the text color you want
                                },
                                '& input:-webkit-autofill:hover': {
                                  WebkitBoxShadow:
                                    '0 0 0 1000px white inset !important',
                                  WebkitTextFillColor: 'black !important',
                                },
                                '& input:-webkit-autofill:focus': {
                                  WebkitBoxShadow:
                                    '0 0 0 1000px white inset !important',
                                  WebkitTextFillColor: 'black !important',
                                },
                                '& input:-webkit-autofill:active': {
                                  WebkitBoxShadow:
                                    '0 0 0 1000px white inset !important',
                                  WebkitTextFillColor: 'black !important',
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
                              <TextField
                                inputProps={{ 'data-testid': 'Password' }}
                                id="passwordInput"
                                type={showPassword ? 'text' : 'password'}
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
                                  '& input::-ms-reveal, & input::-ms-clear': {
                                    display: 'none',
                                  },
                                  '& input:-webkit-autofill': {
                                    WebkitBoxShadow:
                                      '0 0 0 1000px white inset !important', // Set the background color you want
                                    WebkitTextFillColor: 'black !important', // Set the text color you want
                                  },
                                  '& input:-webkit-autofill:hover': {
                                    WebkitBoxShadow:
                                      '0 0 0 1000px white inset !important',
                                    WebkitTextFillColor: 'black !important',
                                  },
                                  '& input:-webkit-autofill:focus': {
                                    WebkitBoxShadow:
                                      '0 0 0 1000px white inset !important',
                                    WebkitTextFillColor: 'black !important',
                                  },
                                  '& input:-webkit-autofill:active': {
                                    WebkitBoxShadow:
                                      '0 0 0 1000px white inset !important',
                                    WebkitTextFillColor: 'black !important',
                                  },
                                }}
                                fullWidth
                              />
                            </div>
                            {uservalue === 'password' && (
                              <small className="text-danger">
                                Please Enter Password
                              </small>
                            )}
                          </div>
                          <div>
                            <FormControl fullWidth>
                              <InputLabel>Role</InputLabel>
                              <Select
                                value={value}
                                onChange={handleChange}
                                label="Role"
                              >
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                                <MenuItem value="institute">Institute</MenuItem>
                                <MenuItem value="teacher">Teacher</MenuItem>
                              </Select>
                            </FormControl>
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
                            data-testid="submitBtn"
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
                            New to Gyansetu?{' '}
                            <Link
                              to="/signup"
                              className="fw-semibold"
                              style={{ color: '#9943EC' }}
                            >
                              {' '}
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
                          New to Gyansetu?{' '}
                          <Link to={'/signup'} style={{ color: '#9943EC' }}>
                            {' '}
                            Sign up here
                          </Link>
                        </p>
                      </div>
                      <div className="col-lg-12">
                        <div className="d-flex align-items-center gap-3">
                          <div
                            data-testid="btn-sign"
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
        <OtpCard
          open={popupOtpCard}
          handleOtpClose={() => setPopupOtpCard(false)}
          handleOtpSuccess={(e: any) => handleSubmit(e)}
          email={emailphone}
        />
      </div>
    </>
  );
};

export default Login;
