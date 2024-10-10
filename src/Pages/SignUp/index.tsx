import React, { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import phoneicon from "../../assets/img/phone.svg";
import emailicon from "../../assets/img/email.svg";
import passwordicon from "../../assets/img/password.svg";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useAPI";
import CloseIcon from "@mui/icons-material/Close";
import { FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QUERY_KEYS } from "../../utils/const";
import { MdContactMail } from "react-icons/md";
import FullScreenLoader from "../Loader/FullScreenLoader";

interface State extends SnackbarOrigin {
  open: boolean;
}
const Signup = () => {
  const signupUrl = QUERY_KEYS.POST_SIGNUP;
  const navigate = useNavigate();
  const { postData,loading } = useApi();
  const [password, setPassword] = useState("");
  // const [name, setName] = useState("")
  //   const [email, setEmail] = useState("");
  //   const [phone, setPhone] = useState("");
  const [emailphone, setEmailphone] = useState("");
  const [value, setValue] = React.useState("student");
  const [userId, setuserId] = React.useState("Email");
  const [uservalue, setuserValue] = React.useState<any>("");
  const [errorEmail, setEmailError] = useState("");
  const [errorPassword, setPasswordError] = useState("");
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
    setIsLoading(true)
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
            setIsLoading(false)
            navigate("/");
          } else if (
            data?.status === 201 &&
            data?.message === "Userid already exists"
          ) {
            // setLoading(false);
            toast.info(data?.message, {
              hideProgressBar: true,
              theme: "colored",
            });
            // setLoading(false);
            setIsLoading(false)
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
      setEmailError('Please fill out this field test');
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
      <div className="login">
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
                  </div>

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
                  <div className="form_field_wrapper-login">
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
                    />
                    {/* {uservalue === "userid" && (
                    <small className="text-danger">
                      Please Enter Mobile No
                    </small>
                  )} */}
                  </div>
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
                  </div>

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
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
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
      </div>
    </>
  );
};

export default Signup;
