import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import { Swiper, SwiperSlide } from "swiper/react";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import useApi from "../../hooks/useAPI";
import emailicon from "../../assets/img/email.svg";
import gLogo from "../../assets/img/logo-white.svg";
import gyansetuLogo from "../../assets/img/gyansetu-logo.svg";
import loginImage from "../../assets/img/login-image.png";
import { QUERY_KEYS } from "../../utils/const";
import { Autoplay, Pagination } from "swiper/modules";
import {
  ArrowLeft,
  BackArrowCircle
} from "../../assets";
import "swiper/css";
import "swiper/css/pagination";
// import "../../assets/css/main.min.css";
import FullScreenLoader from "../Loader/FullScreenLoader";

const Forgotpassword = () => {
  const { postData } = useApi();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [value, setValue] = React.useState("student");
  const [isLoading, setIsLoading] = useState(false);

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

  const forgotpassUrl = QUERY_KEYS.FORGOT_PASSWORD;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const sendLink = (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    let UserSignUp = {
      email: email,
      user_type: String(value),
    };
    postData(`${forgotpassUrl}`, UserSignUp)
      .then((data: any) => {
        if (data?.status === 200) {
          setMsg(data?.message);
          toast.success(data?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
          setIsLoading(false);
        } else {
          toast.error(data?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
          setIsLoading(false);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
        setIsLoading(false);
      });
  };
  return (
    // <div className="login">
    //   <div className="login_inner">
    //     <div className="form_wrapper">
    //       <div className="login_form">
    //         <div className="login_form_inner">
    //           <form>
    //             <div className="title_wrapper">
    //               <h1 className="login_title">Forgot Password</h1>
    //               <div className="desc">
    //                 We'll email you link to reset your password.
    //               </div>
    //             </div>
    //             <h4 className="text-success">{msg}</h4>
    //             <div className="form_field_wrapper">
    //               <RadioGroup row value={value} onChange={handleChange}>
    //                 <FormControlLabel
    //                   value="student"
    //                   control={<Radio />}
    //                   label="Student"
    //                 />
    //                 <FormControlLabel
    //                   value="admin"
    //                   control={<Radio />}
    //                   label="Admin"
    //                 />
    //               </RadioGroup>
    //               <TextField
    //                 onChange={(e) => setEmail(e.target.value)}
    //                 id="input-with-icon-textfield"
    //                 InputProps={{
    //                   startAdornment: (
    //                     <InputAdornment position="start">
    //                       <img src={emailicon} alt="email" />
    //                     </InputAdornment>
    //                   ),
    //                 }}
    //                 placeholder="Email"
    //                 variant="outlined"
    //               />
    //             </div>
    //             {/* <div className="form_field_wrapper forgotpass">
    //                     <Link className="ato" to="/">Login</Link>
    //                 </div> */}
    //             <div className="d-flex justify-content-between form_field_wrapper signuplink_block1 forgotpass">
    //                 <span>Already have an account?</span>{"  "}
    //               <Link className="ato signupa" to="/">
    //                 <span className="signup_txt">Login</span>
    //               </Link>
    //             </div>

    //             <button
    //               type="submit"
    //               className="btn btn-primary"
    //               onClick={(e) => sendLink(e)}
    //               disabled={isLoading}
    //             >
    //               Send Link
    //             </button>
    //           </form>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <>
      {isLoading && <FullScreenLoader />}
      <div className="without-login">
        <header className="container-fluid mb-5 py-3 d-none d-lg-block">
          <div className="row align-items-center">
            <div className="col-6">
              
              <div className="logoui">
                <img onClick={() => navigate("/")} src={gLogo} alt="" />
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
                    <BackArrowCircle
                      className="d-none d-lg-block"
                      onClick={() => navigate("/")}
                    />
                    <ArrowLeft
                      className="d-lg-none"
                      onClick={() => navigate("/")}
                    />
                  </div>
                  <div className="col-lg-12">
                    <h1 className=" mt-4 mt-lg-0 mb-0 inter-600">
                      Forgot Password
                    </h1>
                  </div>
                  <div className="col-lg-12">
                    <form method="" className="mb-3">
                      <div className="mb-4">
                        <div className="mb-4">
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
                        </div>
                        <label htmlFor="" className="form-label">
                          Email / Phone
                        </label>
                        {/* <input type="text" className="form-control   h-52" autoFocus  placeholder="Enter Your Email / Phone"/> */}

                        <TextField
                          onChange={(e) => setEmail(e.target.value)}
                          id="input-with-icon-textfield"
                          placeholder="Email"
                          // variant="outlined"
                          fullWidth
                        />
                      </div>
                      <button
                        type="submit"
                        onClick={(e) => sendLink(e)}
                        className="btn btn-secondary w-100 mb-4 mh-56 rounded-pill"
                      >
                        Send Link
                      </button>
                      <p className="text-center">
                        Remember Now{" "}
                        <Link
                          to="/"
                          className="fw-semibold"
                          style={{
                            color: "#9943EC",
                          }}
                        >
                          {" "}
                          Sign In here
                        </Link>
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

export default Forgotpassword;
