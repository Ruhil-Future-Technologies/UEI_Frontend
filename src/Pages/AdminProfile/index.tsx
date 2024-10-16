import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import AdminBasicInfo from "../AdminBasicinfo";
import AdminAddress from "../AdminAddress";
import AdminDescription from "../AdminDescription";
import AdminLanguage from "../AdminLanguage";
import AdminProfession from "../AdminProfession";
import AdminContactDetails from "../AdminContact";
import PreviewAdminProfile from "../PreviewAdminProfile";

import { Divider, useMediaQuery, useTheme } from "@mui/material";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import { QUERY_KEYS_ADMIN_BASIC_INFO } from "../../utils/const";
import useApi from "../../hooks/useAPI";
import { inputfieldtext } from "../../utils/helpers";
import NameContext from "../Context/NameContext";

const steps = [
  "Admin Basic Information",
  "Admin Address",
  "Language known",
  "Admin Description",
  "Admin Contact Details",
  "Admin Profession",
];

export default function AdminProfile() {
  const context = React.useContext(NameContext);
  const { namecolor }: any = context;
  let adminId = localStorage.getItem("_id");
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const [isEdit, setIsEdit] = React.useState(false);
  const [isEdit1, setIsEdit1] = React.useState(false);
  const [isProComplete, setIsProComplete] = React.useState(0);
  const [isProComplete1, setIsProComplete1] = React.useState(false);
  const [activeForm, setActiveForm] = React.useState(0);
  const theme = useTheme();
  const navigator = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };
  const profileURL = QUERY_KEYS_ADMIN_BASIC_INFO.ADMIN_GET_PROFILE;
  const { getData } = useApi();

  const [isMobile, setIsMobile] = React.useState(false);
  const totalSteps = 6;
  const stepsRef = React.useRef<HTMLDivElement[]>([]);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const progressLineRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check on component mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
    window.scrollTo(0, 0);
  };

  const handleReset = async () => {
    // console.log('resetting ===',isProComplate)
    if ((await isProComplete) !== 100 && (await isProComplete1)) {
      toast.success(
        "Your profile is incomplete. Please complete your profile.",
        {
          hideProgressBar: true,
          theme: "colored",
        }
      );
    } else if ((await isProComplete) === 100 && (await isProComplete1)) {
      toast.success("You have completed your profile", {
        hideProgressBar: true,
        theme: "colored",
      });
    } else {
      toast.success(
        "Your profile is incomplete. Please complete your profile.",
        {
          hideProgressBar: true,
          theme: "colored",
        }
      );
    }

    setActiveStep(0);
  };

  const editProfile = () => {
    setIsEdit(true);

    // setIsEdit1(true)
  };
  const isEditfun = () => {
    setIsEdit1(false);
  };
  const viewProfile = () => {
    setIsEdit(false);
  };

  const viewProfileHome = () => {
    navigator("/main/DashBoard");
  };
  const viewProfile1 = () => {
    setIsEdit1(true);
  };
  const countKeysWithValue = (obj: any): number => {
    return Object.keys(obj).filter(
      (key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== ""
    ).length;
  };
  const adminAPI = async () => {
    // console.log("======-=-=-==--=-=-==",adminId);
    getData(`${profileURL}/${adminId}`)
      .then((data: any) => {
        // console.log(data.data)
        if (data.data) {
          // setProfileData(data?.data)
          // let basic_info = data.data.basic_info
          let basic_info = {
            first_name: data?.data?.basic_info?.first_name,
            last_name: data?.data?.basic_info?.last_name,
            gender: data?.data?.basic_info?.gender,
            dob: data?.data?.basic_info?.dob,
            father_name: data?.data?.basic_info?.father_name,
            mother_name: data?.data?.basic_info?.mother_name,
            department_id: data?.data?.basic_info?.department_id,
            guardian_name: data?.data?.basic_info?.guardian_name,
          };
          let address = data?.data?.address;
          let language = data?.data?.language_known;
          let description = data?.data?.admin_description;
          // let contact = data.data.contact
          let contact = {
            mobile_no_call: data?.data?.contact?.mobile_no_call,
            mobile_isd_call: data?.data?.contact?.mobile_isd_call,
            mobile_no_watsapp: data?.data?.contact?.mobile_no_watsapp,
          };
          let profession = data.data.profession;
          // let hobby = data.data.hobby

          let totalPercentage = 0;
          let sectionCount = 0;

          if (basic_info && Object.keys(basic_info)?.length > 0) {
            if (data?.data?.pic_path !== "") {
              getData(`${"upload_file/get_image/" + data?.data?.pic_path}`)
                .then((imgdata: any) => {
                  // setprofileImage(imgdata.data)
                })
                .catch((e) => {});
            }

            let totalcount = Object.keys(basic_info)?.length;
            let filledCount = countKeysWithValue(basic_info);
            let percentage = (filledCount / totalcount) * 100;
            // setbasicinfoPercentage(percentage)
            totalPercentage += percentage;
            sectionCount++;
          } else {
            sectionCount++;
          }
          if (address && Object.keys(address).length > 0) {
            let totalcount = Object.keys(address)?.length;
            let filledCount = countKeysWithValue(address);
            let percentage = (filledCount / totalcount) * 100;
            // setaddressPercentage(percentage)
            totalPercentage += percentage;
            sectionCount++;
          } else {
            sectionCount++;
          }
          if (language && Object.keys(language)?.length > 0) {
            // let totalhobbycount = 0
            // let filledhobbyCount = 0
            // if (hobby && Object.keys(hobby).length > 0) {
            //   totalhobbycount = Object.keys(hobby).length
            //   filledhobbyCount = countKeysWithValue(hobby)
            // }
            let totalcount = Object.keys(language)?.length;
            let filledCount = countKeysWithValue(language);
            let percentage = (filledCount / totalcount) * 100;
            // setlanguagePercentage(percentage)
            totalPercentage += percentage;
            sectionCount++;
          } else {
            sectionCount++;
          }
          if (description && Object.keys(description)?.length > 0) {
            let totalcount = Object.keys(description)?.length;
            let filledCount = countKeysWithValue(description);
            let percentage = (filledCount / totalcount) * 100;
            // setdesctiptionPercentage(percentage)
            totalPercentage += percentage;
            sectionCount++;
          } else {
            sectionCount++;
          }
          if (contact && Object.keys(contact)?.length > 0) {
            let totalcount = Object.keys(contact)?.length;
            let filledCount = countKeysWithValue(contact);
            let percentage = (filledCount / totalcount) * 100;
            // setcontactPercentage(percentage)
            totalPercentage += percentage;
            sectionCount++;
          } else {
            sectionCount++;
          }
          if (profession && Object.keys(profession)?.length > 0) {
            let totalcount = Object.keys(profession)?.length;
            let filledCount = countKeysWithValue(profession);
            let percentage = (filledCount / totalcount) * 100;
            // setprofessionPercentage(percentage)
            totalPercentage += percentage;
            sectionCount++;
          } else {
            sectionCount++;
          }
          if (sectionCount > 0) {
            let overallPercentage = totalPercentage / sectionCount;
            // setoverallProfilePercentage(overallPercentage); // Set the overall percentage
            overallPercentage = Math.round(overallPercentage);
            // const nandata = 100 - overallPercentage

            setIsProComplete(overallPercentage);
          }
          setIsProComplete1(true);
          // setper(true)
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  };
  React.useEffect(() => {
    adminAPI();
  }, []);
  // const handleMouseEnter = (event:any) => {
  //   event.target.style.backgroundColor = '#6c757d';  // Example hover style
  //   // event.target.style.fontSize= '.90rem'
  // };

  // const handleMouseLeave = (event:any) => {
  //   // event.target.style.color = 'initial';  // Reset to initial style
  //   // event.target.style.fontSize= '.90rem'
  //   event.target.style.backgroundColor = 'inherit';
  // };

  React.useEffect(() => {
    updateWizard();
  }, [activeForm, isMobile]);

  // Function to update the progress line based on the screen size
  const updateWizard = () => {
    if (progressRef.current && progressLineRef.current) {
      if (isMobile) {
        // Horizontal progress for mobile
        progressRef.current.style.width = `${
          ((activeForm + 1) / totalSteps) * 100
        }%`;
        progressLineRef.current.style.width = `${
          ((activeForm + 1) / totalSteps) * 100
        }%`;
        progressLineRef.current.style.height = "2px";
        progressLineRef.current.style.top = "auto";
      } else {
        // Vertical progress for desktop
        progressRef.current.style.width = `${
          ((activeForm + 1) / totalSteps) * 100
        }%`;

        const stepHeight = stepsRef.current[activeForm]?.offsetHeight || 0;
        const computedStyle = window.getComputedStyle(
          stepsRef.current[activeForm]
        );

        // Extract margin-top and margin-bottom
        const marginTop = parseFloat(computedStyle.marginTop) || 0;
        const marginBottom = parseFloat(computedStyle.marginBottom) || 0;

        // Calculate total height including margins
        const totalHeight =
          activeForm === totalSteps - 1
            ? stepHeight + 30
            : stepHeight + marginTop + marginBottom;
        const currentHeight = totalHeight * (activeForm + 1);

        progressLineRef.current.style.height = `${currentHeight - 62}px`;
        progressLineRef.current.style.width = "2px";
        progressLineRef.current.style.top = "0px";
      }
    }
  };

  return (
    <>
      {/* <div className="profile_section">
        <div className="card">
          <div className="card-header custom-header">
            <div className="card-header--actions d-flex justify-content-between align-items-right">
              <Button className="float-left custom-header" onClick={viewProfileHome}>
                Back
              </Button>
              <div>
                {isEdit ? (
                  <Button onClick={viewProfile} className="float-right custom-header">
                    View Profile
                  </Button>
                ) : (
                  <Button onClick={editProfile} className="float-right custom-header">
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="card-body admin-card-body">
            {!isEdit ? (
              <React.Fragment>
                <PreviewAdminProfile editProfile={editProfile} handleStep={setActiveStep} isEdit1={isEdit1} isEditfun={isEditfun} ></PreviewAdminProfile>
              </React.Fragment>
            ) : (
              <>
                <Stepper activeStep={activeStep} className='mt-3'
                  orientation={isSmallScreen ? 'vertical' : 'horizontal'}
                >
                  {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                      optional?: React.ReactNode;
                    } = {};

                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}
                          onClick={handleStep(index)}
                          style={{ cursor: "pointer"}}
                          sx={{
                            '& .MuiStepLabel-label': {
                                color: activeStep === index ? inputfieldtext(namecolor) : 'gray', 
                            },
                            '& .MuiStepLabel-label.Mui-active': {
                                color: inputfieldtext(namecolor), // Active step color
                            },
                            // '& .MuiStepLabel-label.Mui-completed': {
                            //     color: inputfield(namecolor), // Completed step color
                            // },
                        }}
                          
                        >
                          {label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <div className="hr border border[#9e9e9e] mt-5"></div>
                <React.Fragment>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                      // color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                      variant="contained"
                      className='mainbutton'
                      
                      // onMouseEnter={handleMouseEnter}
                      // onMouseLeave={handleMouseLeave}
                      
                    >
                      Previous
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep !== steps.length - 1 ?
                      <Button onClick={handleNext}
                      variant="contained"
                       className='mainbutton'
                      >
                        Next
                      </Button>
                      : <Button onClick={() => {
                        handleReset();
                        viewProfile();
                        viewProfile1();
                      }}
                      variant="contained"
                       className='mainbutton'
                      >

                        Finish
                      </Button>
                    }
                  </Box>

                  <Typography sx={{ mt: 2, mb: 1 }}>

                    {activeStep === 0 &&
                      <AdminBasicInfo />
                    }
                    {activeStep === 1 &&
                      <AdminAddress />
                    }
                    {activeStep === 2 &&
                      <AdminLenguage />
                    }
                    {activeStep === 3 &&
                      <AdminDescription />

                    }
                    {activeStep === 4 &&
                      <AdmincontactDtails />
                    }
                    {
                      activeStep === 5 &&
                      <AdminProfession />
                    }
                  </Typography>
                </React.Fragment>
              </>
            )}
          </div>
        </div>
      </div> */}

      <div className="main-wrapper">
        <div className="main-content">
          <div className="container mb-5">
            <div className="row align-items-center">
              <div className="col-lg-6 px-0">
                {isProComplete1 ? (
                  <h4 className="fs-1 fw-bold">
                    My <span style={{ color: "#9943EC" }}> Profile </span>
                  </h4>
                ) : (
                  <>
                    {" "}
                    <h4 className="fs-1 fw-bold d-xxl-block">
                      Complete Your{" "}
                      <span style={{ color: "#9943EC" }}> Account </span>
                    </h4>
                    {/* <h4 className="fs-1 d-xxl-none fw-bold mb-0">
                      {`Hey, ${studentData?.basic_info?.first_name || "User"} ${
                        studentData?.basic_info?.last_name || ""
                      }`}
                      <small className="mt-1 fs-14 d-block opacity-50 fw-normal">
                        Please Complete Your Profile
                      </small>
                    </h4> */}
                  </>
                )}
              </div>
              <div className="col-lg-12 d-none d-xxl-block px-0">
                <div className="wizard-content p-0 mt-4">
                  <div className="progress-bar">
                    <div ref={progressRef} className="progress"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 px-0">
                <div
                  className="card rounded-5 mt-3 bg-transparent-mb"
                  style={{ border: "0" }}
                >
                  <div className="card-body p-0">
                    <div className="row">
                      <div className="col-xxl-12">
                        <div className="myform-wizard">
                          <div className="wizard-sidebar">
                            <div className="steps-container">
                              <div className="progress-background"></div>
                              <div
                                ref={progressLineRef}
                                className="progress-line"
                              ></div>
                              <div
                                ref={(el) => (stepsRef.current[0] = el!)}
                                className={`step ${
                                  activeForm === 0 ? "active" : ""
                                }`}
                                onClick={() => setActiveForm(0)}
                                style={{ cursor: "pointer" }}
                              >
                                <div
                                  className={`step-circle ${
                                    activeForm >= 0 ? "filled" : ""
                                  }`}
                                >
                                  <CheckOutlinedIcon />
                                </div>
                                <div className="step-label">
                                  Basic Information
                                </div>
                              </div>
                              <div
                                ref={(el) => (stepsRef.current[1] = el!)}
                                className={`step ${
                                  activeForm === 1 ? "active" : ""
                                }`}
                                onClick={() => setActiveForm(1)}
                                style={{ cursor: "pointer" }}
                              >
                                <div
                                  className={`step-circle ${
                                    activeForm >= 1 ? "filled" : ""
                                  }`}
                                >
                                  <CheckOutlinedIcon />
                                </div>
                                <div className="step-label">Address</div>
                              </div>
                              <div
                                ref={(el) => (stepsRef.current[2] = el!)}
                                className={`step ${
                                  activeForm === 2 ? "active" : ""
                                }`}
                                onClick={() => setActiveForm(2)}
                                style={{ cursor: "pointer" }}
                              >
                                <div
                                  className={`step-circle ${
                                    activeForm >= 2 ? "filled" : ""
                                  }`}
                                >
                                  <CheckOutlinedIcon />
                                </div>
                                <div className="step-label">Language Known</div>
                              </div>
                              <div
                                ref={(el) => (stepsRef.current[3] = el!)}
                                className={`step ${
                                  activeForm === 3 ? "active" : ""
                                }`}
                                onClick={() => setActiveForm(3)}
                                style={{ cursor: "pointer" }}
                              >
                                <div
                                  className={`step-circle ${
                                    activeForm >= 3 ? "filled" : ""
                                  }`}
                                >
                                  <CheckOutlinedIcon />
                                </div>
                                <div className="step-label">Description</div>
                              </div>

                              <div
                                ref={(el) => (stepsRef.current[4] = el!)}
                                className={`step ${
                                  activeForm === 4 ? "active" : ""
                                }`}
                                onClick={() => setActiveForm(4)}
                                style={{ cursor: "pointer" }}
                              >
                                <div
                                  className={`step-circle ${
                                    activeForm >= 4 ? "filled" : ""
                                  }`}
                                >
                                  <CheckOutlinedIcon />
                                </div>
                                <div className="step-label">
                                  Contact Details
                                </div>
                              </div>

                              <div
                                ref={(el) => (stepsRef.current[5] = el!)}
                                className={`step ${
                                  activeForm === 5 ? "active" : ""
                                }`}
                                onClick={() => setActiveForm(5)}
                                style={{ cursor: "pointer" }}
                              >
                                <div
                                  className={`step-circle ${
                                    activeForm >= 5 ? "filled" : ""
                                  }`}
                                >
                                  <CheckOutlinedIcon />
                                </div>
                                <div className="step-label">Profession</div>
                              </div>
                            </div>
                          </div>
                          <div className="wizard-content">
                            <form id="wizard-form">
                              <div
                                className={`form-step ${
                                  activeForm === 0 ? "active" : ""
                                }`}
                              >
                                <AdminBasicInfo setActiveForm={setActiveForm} />
                              </div>
                              <div
                                className={`form-step ${
                                  activeForm === 1 ? "active" : ""
                                }`}
                              >
                                <AdminAddress setActiveForm={setActiveForm} />
                              </div>
                              <div
                                className={`form-step ${
                                  activeForm === 2 ? "active" : ""
                                }`}
                              >
                                <AdminLanguage setActiveForm={setActiveForm} />
                              </div>
                              <div
                                className={`form-step ${
                                  activeForm === 3 ? "active" : ""
                                }`}
                              >
                                <div>
                                  <div>
                                    <AdminDescription
                                      setActiveForm={setActiveForm}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`form-step ${
                                  activeForm === 4 ? "active" : ""
                                }`}
                              >
                                <AdminContactDetails
                                  setActiveForm={setActiveForm}
                                />
                              </div>
                              <div
                                className={`form-step ${
                                  activeForm === 5 ? "active" : ""
                                }`}
                              >
                                <div>
                                  <div>
                                    <AdminProfession
                                      handleReset={handleReset}
                                      setActiveForm={setActiveForm}
                                    />
                                  </div>
                                </div>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
