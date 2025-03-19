/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// import  { SnackbarOrigin } from "@mui/material/Snackbar";
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ListItem,
  List,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { toast } from 'react-toastify';
// import CloseIcon from "@mui/icons-material/Close";
// import NameContext from "../../Pages/Context/NameContext";
import {
  ArrowLeft,
  BackArrowCircle,
  VisibilityOn,
  VisibilityOff,
} from '../../assets';
import gLogo from '../../assets/img/logo-white.svg';
import gyansetuLogo from '../../assets/img/gyansetu-logo.svg';
import useApi from '../../hooks/useAPI';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'react-toastify/dist/ReactToastify.css';
import { QUERY_KEYS } from '../../utils/const';
import FullScreenLoader from '../Loader/FullScreenLoader';
import registerHero from '../../assets/img/register-hero.png';
import OtpCard from '../../Components/Dailog/OtpCard';
const Signup = () => {
  const signupUrl = QUERY_KEYS.POST_SIGNUP;
  const navigate = useNavigate();
  const { postData, postDataJson, loading } = useApi();
  const [password, setPassword] = useState('');

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const value = 'student';
  const [popupOtpCard, setPopupOtpCard] = useState(false);
  const [uservalue, setuserValue] = React.useState<any>('');
  const [errorEmail, setEmailError] = useState('');
  const [errorPhone, setPhoneError] = useState('');
  const [errorPhoneValidation, setErrorPhoneValidation] =
    useState<boolean>(false);
  const [errorEmailValidation, setErrorEmailValidation] =
    useState<boolean>(false);
  const [errorPassword, setPasswordError] = useState('');

  const [CheckTermandcondi, setCheckTermandcondi] = useState(true);
  const [popupTermandCondi, setPopupTermandcondi] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
    if (email && password) {
      setuserValue('');
    }
  }, [email, password]);

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    // setIsLoading(true);
    e.preventDefault();
    // Validate email/phone and password
    if (
      errorEmailValidation &&
      errorPhoneValidation &&
      validatePassword(password)
    ) {
      // setLoading(true);
      const UserSignUp = {
        email: String(email),
        password: String(password),
        user_type: String(value),
        phone: String(phone),
      };

      const emptyKeys: string[] = [];

      // Check for empty fields
      for (const key in UserSignUp) {
        // if (UserSignUp?.hasOwnProperty(key)) {
        if (Object.prototype.hasOwnProperty.call(UserSignUp, key)) {
          if (UserSignUp[key as keyof typeof UserSignUp] === '') {
            setuserValue(key);
            emptyKeys.push(key);
            break;
          } else {
            setuserValue('');
          }
        }
      }
      if (emptyKeys.length === 0) {
        try {
          const data = await postData(signupUrl, UserSignUp);
          if (data?.status === true) {
            // setLoading(false);
            setPopupOtpCard(true);
            toast.success(data?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
            localStorage.setItem('user_uuid', data?.data.user_uuid);
            localStorage.setItem('email', data?.data.email);
            localStorage.setItem('phone', data?.data.phone);
            localStorage.setItem('user_type', data?.data.user_type);
          } else {
            toast.error(data?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        } catch (error) {
          let errorMessage = 'An unexpected error occurred';

          if (
            (error as any)?.response &&
            (error as any)?.response.data &&
            (error as any)?.response?.data?.message
          ) {
            errorMessage = (error as any)?.response?.data?.message;
          } else if ((error as any)?.message) {
            errorMessage = (error as Error)?.message;
          }
          toast.error(errorMessage, {
            hideProgressBar: true,
            theme: 'colored',
          });
        }
      }
    }
  };

  const handleSubmit = (otp: string) => {
    const payload = {
      email: email,
      otp: otp,
    };
    try {
      postDataJson(`/auth/verify-otp`, payload).then((data) => {
        console.log(data);
        if (data.status === true) {
          handleSuccessfulLogin(data.data);
        } else {
          toast.error(data.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        }
      });
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
        theme: 'colored',
      });
    }
  };

  const handleSuccessfulLogin = (data: any) => {
    localStorage.setItem('token', 'Bearer ' + data?.access_token);
    localStorage.setItem('userid', data?.data?.userid);
    localStorage.setItem('lastRoute', window.location.pathname);

    const tokenLifespan = 7100; // token lifespan in seconds (1 hour)
    // Calculate the expiry time
    const expiryTime = Date.now() + tokenLifespan * 1000;
    localStorage.setItem('tokenExpiry', expiryTime.toString());

    toast.success('User logged in successfully', {
      hideProgressBar: true,
      theme: 'colored',
      autoClose: 500,
    });
    const userType = localStorage.getItem('user_type');
    if (userType === 'student') {
      navigate('/main/Dashboard');
    }
  };
  const validateInput = (value: string, name: string): boolean => {
    const phoneRegex = /^(?!0{10})[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let valid = true;
    if (name === 'email_id') {
      if (!value) {
        setEmailError('Please enter an email');
        valid = false;
        setErrorEmailValidation(false);
      }
      if (emailRegex.test(value)) {
        setEmailError('');
        valid = true;
        setErrorEmailValidation(true);
      } else {
        setEmailError('Invalid email format');
        valid = false;
        setErrorEmailValidation(false);
      }
    }

    if (name === 'phone_no') {
      if (!value) {
        setPhoneError('Please enter valid Phone No');
        valid = false;
        setErrorPhoneValidation(false);
      }
      if (phoneRegex.test(value)) {
        setPhoneError('');
        valid = true;
        setErrorPhoneValidation(true);
      } else {
        setPhoneError('Invalid  phone number');
        valid = false;
        setErrorPhoneValidation(false);
      }
    }
    return valid;
  };
  const handleChangeData = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value, name } = e.target;

    if (name == 'email_id') {
      if (!email) {
        setEmailError('Please fill out this field test');
      }
      setEmail(value);
    }
    if (name == 'phone_no') {
      setPhone(value);
    }
    validateInput(value, name);
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(''); // Clear error message when password is changed
    validatePassword(e.target.value);
  };
  const validatePassword = (password: string) => {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]/;

    if (
      !uppercaseRegex.test(password) ||
      !lowercaseRegex.test(password) ||
      !numberRegex.test(password) ||
      !specialCharRegex.test(password) ||
      password.length < 8
    ) {
      setPasswordError(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.',
      );
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const handleBlurPassword = () => {
    validatePassword(password);
  };
  const handleTermandCondi = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setCheckTermandcondi(!isChecked);
  };
  const handleTACpopup = () => {
    setPopupTermandcondi(true);
  };
  const handleClose = () => {
    setPopupTermandcondi(false);
  };
  return (
    <>
      {loading && <FullScreenLoader />}

      <div className="without-login">
        <header className="container-fluid mb-5 py-3 d-none d-lg-block">
          <div className="row align-items-center">
            <div className="col-6">
              <div className="logoui">
                <img src={gLogo} alt="" onClick={() => navigate('/')} />
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
              <img src={registerHero} alt="" />
            </div>
            <div className="col-lg-6">
              <div className="access-card">
                <div className="row gy-3">
                  <div className="col-lg-12">
                    <BackArrowCircle
                      className="d-none d-lg-block mt-3"
                      onClick={() => navigate('/')}
                    />
                    <ArrowLeft
                      className="d-lg-none mt-3"
                      onClick={() => navigate('/')}
                    />
                  </div>
                  <div className="col-lg-12 d-lg-none d-block">
                    <img
                      src={gyansetuLogo}
                      className=" mx-auto my-0 d-block"
                      alt=""
                      width="120"
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
                          Email
                        </label>
                        <TextField
                          data-testid="email"
                          id="email"
                          name="email_id"
                          value={email}
                          onChange={handleChangeData}
                          placeholder="Enter your email"
                          error={!!errorEmail}
                          helperText={errorEmail}
                          required={true}
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
                        <label htmlFor="" className="form-label">
                          Phone NO.
                        </label>
                        <TextField
                          data-testid="phone"
                          id="phone"
                          name="phone_no"
                          value={phone}
                          onChange={handleChangeData}
                          placeholder="Mobile Number"
                          error={!!errorPhone}
                          helperText={errorPhone}
                          required={true}
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
                        <label htmlFor="passwordInput" className="form-label">
                          Password
                        </label>
                        <div className="position-relative">
                          <TextField
                            data-testid="Password"
                            type={showPassword ? 'text' : 'password'}
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
                          {uservalue === 'password' && (
                            <small className="text-danger">
                              Please Enter Password
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="form-check mb-3 fs-14">
                        <input
                          data-testid="checkbox"
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          onChange={handleTermandCondi}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexCheckDefault"
                        >
                          By Creating your account you have to agree with our{' '}
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleTACpopup();
                            }}
                          >
                            {' '}
                            Terms and Condition
                          </a>
                        </label>
                      </div>
                      <button
                        className="btn btn-secondary w-100 mh-56 rounded-pill"
                        disabled={CheckTermandcondi}
                      >
                        Sign Up Now
                      </button>
                      <p className="my-4 text-center">
                        Already have an account?{' '}
                        <Link to="/" style={{ color: '#9943EC' }}>
                          {' '}
                          <u>Sign in here </u>
                        </Link>
                      </p>
                      <div className="d-flex justify-content-between">
                        <Link
                          to="/institute-registration"
                          style={{ color: '#9943EC' }}
                        >
                          <u>Register As Institution</u>
                        </Link>
                        <Link
                          to="/teacher-registration"
                          style={{ color: '#9943EC' }}
                        >
                          <u>Register As Teacher</u>
                        </Link>
                      </div>
                    </form>
                    <Dialog open={popupTermandCondi} onClose={handleClose}>
                      <DialogTitle>{'Terms and Condition'}</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Content of Gyanshetu Terms and Condition...... will
                          coming soon
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} color="primary">
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <OtpCard
          open={popupOtpCard}
          handleOtpClose={() => setPopupOtpCard(false)}
          handleOtpSuccess={(otp: string) => handleSubmit(otp)}
          email={email}
        />
        <footer className="login-footer">
          <p className="mb-0">Copyright © 2025. All right reserved.</p>
          <List
            sx={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              gap: 2,
              padding: 0,
            }}
          >
            <ListItem sx={{ width: 'auto', padding: 0 }}>
              <Link to="privacypolicy" color="primary">
                Privacy Policy
              </Link>
            </ListItem>
            <ListItem sx={{ width: 'auto', padding: 0 }}>
              <Link to="refundpolicy" color="primary">
                Refund Policy
              </Link>
            </ListItem>
            <ListItem sx={{ width: 'auto', padding: 0 }}>
              <Link to="Disclaimer" color="primary">
                Disclaimer
              </Link>
            </ListItem>
            <ListItem sx={{ width: 'auto', padding: 0 }}>
              <Link to="ServicesAgreement" color="primary">
                End User Aggrement
              </Link>
            </ListItem>
          </List>
        </footer>
      </div>
    </>
  );
};

export default Signup;
