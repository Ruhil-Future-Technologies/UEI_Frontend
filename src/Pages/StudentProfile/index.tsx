import React, { useContext, useEffect, useRef, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Box, Button, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import StudentBasicInfo from "../StudentBasicInfo";
import StudentAddress from "../StudentAddress";
import StudentLanguageKnown from "../StudentLanguageKnown";
import StudentAcademicHistory from "../StudentAcademicHistory";
import StudentContactDetails from "../StudentContactDetails";
import StudentHobbies from "../StudentHobbies";
import StudentSubjectPreference from "../StudentSubjectPreference";
import PreviewStudentProfile from "../PreviewStudentProfile";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

import { toast } from "react-toastify";

import NameContext from "../Context/NameContext";
import useApi from "../../hooks/useAPI";
import { QUERY_KEYS_STUDENT } from "../../utils/const";
import { Await, useLocation, useNavigate } from "react-router-dom";
import {
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from "../../utils/helpers";
import AcademicHistory from "../AcademicHistory/AcademicHistory";
// import "../../assets/css/main.min.css";
// import "../../assets/css/newstyle.min.css";
export interface ChildComponentProps {
  setActiveForm: React.Dispatch<React.SetStateAction<number>>;
}

const StudentProfile = () => {
  const context = useContext(NameContext);
  const location: {
    state: {
      value: number;
    };
  } = useLocation();

  const { namecolor }: any = context;
  const steps = [
    "Basic Information",
    "Address",
    "Hobbies / Language Known",
    "Academic History",
    "Contact Details",
    "Subject Preference",
    // "Student History",
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [studentData, setStudentData] = useState<any>({});
  const [skipped, setSkipped] = useState(new Set<number>());
  const [isEdit, setIsEdit] = useState(false);
  const [isProComplete, setIsProComplete] = useState(0);
  const [isProComplete1, setIsProComplete1] = useState(false);
  const [activeForm, setActiveForm] = useState(0);
  const usertype: any = localStorage.getItem("user_type");
  const { getData } = useApi();
  let StudentId = localStorage.getItem("_id");
  const profileURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const navigator = useNavigate();
  const countKeysWithValue = (obj: any): number => {
    return Object.keys(obj).filter(
      (key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== ""
    ).length;
  };

  const [isMobile, setIsMobile] = useState(false);
  const totalSteps = 6;
  const stepsRef = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    callAPIStudent();
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check on component mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    if (location?.state?.value) setActiveForm(location?.state?.value);
    else setActiveForm(0);
  }, [location?.state?.value]);

  const callAPIStudent = async () => {
    if (usertype === "student") {
      getData(`${profileURL}/${StudentId}`)
        .then((data: any) => {
          if (data.data) {
            // setProfileDatas(data?.data);
            setStudentData(data?.data);
            //   let basic_info = data.data.basic_info;
            let basic_info = {
              // aim: data?.data?.basic_info?.aim,
              dob: data?.data?.basic_info?.dob,
              father_name: data?.data?.basic_info?.father_name,
              first_name: data?.data?.basic_info?.first_name,
              gender: data?.data?.basic_info?.gender,
              id: data?.data?.basic_info?.id,
              // is_active: data?.data?.basic_info?.is_active,
              // is_kyc_verified: data?.data?.basic_info?.is_kyc_verified,
              // last_modified_datetime: data?.data.basic_info?.last_modified_datetime,
              last_name: data?.data?.basic_info?.last_name,
              mother_name: data?.data?.basic_info?.mother_name,
              // student_registration_no: data?.data?.basic_info?.student_registration_no,
            };
            let address = data?.data?.address;
            let language = data?.data?.language_known;
            let academic_history = data.data.academic_history;
            //   let contact = data.data.contact;
            let contact = {
              // email_id: data?.data?.contact?.email_id,
              id: data?.data?.contact?.id,
              // is_active: data?.data?.contact?.is_active,
              mobile_isd_call: data?.data?.contact?.mobile_isd_call,
              mobile_no_call: data?.data?.contact?.mobile_no_call,
              // mobile_no_watsapp: data?.data?.contact?.mobile_no_watsapp,
            };
            let subject_preference = data?.data?.subject_preference;
            //   let hobby = data.data.hobby;

            let totalPercentage = 0;
            let sectionCount = 0;

            if (basic_info && Object.keys(basic_info).length > 0) {
              if (data?.data?.basic_info?.pic_path !== "") {
                getData(`${"upload_file/get_image/" + data?.data?.basic_info?.pic_path}`)
                  .then((imgdata: any) => {
                    // setprofileImage(imgdata.data);
                  })
                  .catch((e) => {
                    // Handle error
                  });
              }

              let totalCount = Object.keys(basic_info).length;
              let filledCount = countKeysWithValue(basic_info);
              let percentage = (filledCount / totalCount) * 100;
              // setbasicinfoPercentage(percentage);
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }

            if (address && Object.keys(address).length > 0) {
              let totalCount = Object.keys(address).length;
              let filledCount = countKeysWithValue(address);
              let percentage = (filledCount / totalCount) * 100;
              // setaddressPercentage(percentage);
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }

            if (language && Object.keys(language).length > 0) {
              let totalhobbycount = 0;
              let filledhobbyCount = 0;
              // if (hobby && Object.keys(hobby).length > 0) {
              //   totalhobbycount = Object.keys(hobby).length;
              //   filledhobbyCount = countKeysWithValue(hobby);
              // }
              let totalCount = Object.keys(language).length + totalhobbycount;
              let filledCount = countKeysWithValue(language) + filledhobbyCount;
              let percentage = (filledCount / totalCount) * 100;
              // setlanguagePercentage(percentage);
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }

            if (academic_history && Object.keys(academic_history).length > 0) {
              if (academic_history?.institution_type === "school") {
                delete academic_history?.course_id;
                delete academic_history?.institute_id;
                delete academic_history?.institution_name;
                delete academic_history?.learning_style;
                delete academic_history?.university_name;
                delete academic_history?.year;
                academic_history?.board !== "state_board" &&
                  delete academic_history?.state_for_stateboard;
              } else {
                delete academic_history?.board;
                delete academic_history?.class_id;
                delete academic_history?.state_for_stateboard;
                delete academic_history?.university_name;
              }
              let totalCount = Object.keys(academic_history).length;
              let filledCount = countKeysWithValue(academic_history);
              let percentage = (filledCount / totalCount) * 100;
              // setacademichistoryPercentage(percentage);
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }

            if (contact && Object.keys(contact).length > 0) {
              let totalCount = Object.keys(contact).length;
              let filledCount = countKeysWithValue(contact);
              let percentage = (filledCount / totalCount) * 100;
              // setcontactPercentage(percentage);
              totalPercentage += percentage;
              sectionCount++;
            } else {
              sectionCount++;
            }

            if (
              subject_preference &&
              Object.keys(subject_preference).length > 0
            ) {
              let totalCount = Object.keys(subject_preference).length;
              let filledCount = countKeysWithValue(subject_preference);
              let percentage = (filledCount / totalCount) * 100;
              // setsubjectPercentage(percentage);
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
              // console.log("overallPercentage sss", nandata,overallPercentage);
              // setStats1({
              //     Student_Profile:overallPercentage,
              //     Student_null:nandata
              // })
            }
            setIsProComplete1(true);
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

  const isStepOptional = (step: number) => {
    return step > 0 && step < steps.length - 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    window.scrollTo(0, 0);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
    window.scrollTo(0, 0);
  };
  const viewProfileHome = () => {
    navigator("/main/DashBoard");
  };
  const handleReset = async () => {
    if ((await isProComplete) === 100 && (await isProComplete1)) {
      toast.success("You have completed your profile", {
        hideProgressBar: true,
        theme: "colored",
        position: "top-center",
      });
    } else {
      toast.success(
        "Your profile is incomplete. Please complete your profile.",
        {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center",
        }
      );
    }

    // setActiveStep(0);
    setIsEdit(false);
    window.scrollTo(0, 0);
  };

  const editProfile = () => {
    setIsEdit(true);
  };

  const viewProfile = () => {
    setIsEdit(false);
  };
  useEffect(() => {
    if (activeStep === 5 || activeForm === 5) callAPIStudent();
  }, [activeStep, activeForm]);

  return (
    <>
      {/* <div className="profile_section">
        <div className="card">
          <div className="card-header custom-header">
            <div className="card-header--actions d-flex justify-content-between align-items-right">
              <Button
                className="float-left custom-header"
                onClick={viewProfileHome}
              >
                Back
              </Button>
              <div>
                {isEdit ? (
                  <Button
                    onClick={viewProfile}
                    className="float-right custom-header"
                  >
                    View Profile
                  </Button>
                ) : (
                  <Button
                    onClick={editProfile}
                    className="float-right custom-header"
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="card-body student-card-body">
            {!isEdit ? (
              <React.Fragment>
                <PreviewStudentProfile
                  editProfile={editProfile}
                  handleStep={setActiveStep}
                />
              </React.Fragment>
            ) : (
              <>
                <Stepper activeStep={activeStep} className="mt-3">
                  {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                      optional?: React.ReactNode;
                    } = {};
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel
                          {...labelProps}
                          onClick={handleStep(index)}
                          style={{ cursor: "pointer" }}
                          sx={{
                            "& .MuiStepLabel-label": {
                              color:
                                activeStep === index
                                  ? inputfieldtext(namecolor)
                                  : "gray",
                            },
                            "& .MuiStepLabel-label.Mui-active": {
                              color: inputfieldtext(namecolor), // Active step color
                            },
                            // '& .MuiStepLabel-label.Mui-completed': {
                            //     color: inputfield(namecolor), // Completed step color
                            // },
                          }}
                        >
                          {label}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <div className="hr border border[#9e9e9e] mt-5"></div>

                <React.Fragment>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingTop: "10px",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                      variant="contained"
                      className={`${
                        activeStep === 0 ? "disabled-mainbutton" : "mainbutton"
                      }`}
                    >
                      Previous
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep !== steps.length - 1 ? (
                      <Button
                        onClick={handleNext}
                        variant="contained"
                        className="mainbutton"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={handleReset}
                        variant="contained"
                        className="mainbutton"
                      >
                        Finish
                      </Button>
                    )}
                  </div>
                  {activeStep === 0 && <StudentBasicInfo setActiveForm={setActiveForm} />}
                  {activeStep === 1 && <StudentAddress />}
                  {activeStep === 2 && <StudentLanguageKnown />}
                  {activeStep === 3 && <AcademicHistory />}
                  {activeStep === 4 && <StudentContactDetails />}
                  {activeStep === 5 && <StudentSubjectPreference />}
                
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
                    <h4 className="fs-1 fw-bold d-none d-xxl-block">
                      Complete Your{" "}
                      <span style={{ color: "#9943EC" }}> Account </span>
                    </h4>
                    <h4 className="fs-1 d-xxl-none fw-bold mb-0">
                      {`Hey, ${studentData?.basic_info?.first_name || "User"} ${
                        studentData?.basic_info?.last_name || ""
                      }`}
                      <small className="mt-1 fs-14 d-block opacity-50 fw-normal">
                        Please Complete Your Profile
                      </small>
                    </h4>
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
                                <div className="step-label">
                                  Hobbies / Language Known
                                </div>
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
                                <div className="step-label">
                                  Academic History
                                </div>
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
                                <div className="step-label">
                                  Subject Preference
                                </div>
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
                                <StudentBasicInfo
                                  setActiveForm={setActiveForm}
                                />
                              </div>
                              <div
                                className={`form-step ${
                                  activeForm === 1 ? "active" : ""
                                }`}
                              >
                                <StudentAddress setActiveForm={setActiveForm} />
                              </div>
                              <div
                                className={`form-step ${
                                  activeForm === 2 ? "active" : ""
                                }`}
                              >
                                <StudentLanguageKnown
                                  setActiveForm={setActiveForm}
                                />
                              </div>
                              <div
                                className={`form-step ${
                                  activeForm === 3 ? "active" : ""
                                }`}
                              >
                                <div>
                                  <div>
                                    <AcademicHistory
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
                                <StudentContactDetails
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
                                    <StudentSubjectPreference
                                      handleReset={handleReset}
                                      setActiveForm={setActiveForm}
                                      activeForm={activeForm}
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
};

export default StudentProfile;
