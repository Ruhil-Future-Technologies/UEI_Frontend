/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import StudentBasicInfo from "../StudentBasicInfo";
import StudentAddress from "../StudentAddress";
import StudentLanguageKnown from "../StudentLanguageKnown";
import StudentContactDetails from "../StudentContactDetails";
import StudentSubjectPreference from "../StudentSubjectPreference";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

import { toast } from "react-toastify";

// import NameContext from "../Context/NameContext";
import useApi from "../../hooks/useAPI";
import { QUERY_KEYS_STUDENT } from "../../utils/const";
import { useLocation} from "react-router-dom";

import AcademicHistory from "../AcademicHistory/AcademicHistory";
export interface ChildComponentProps {
  setActiveForm: React.Dispatch<React.SetStateAction<number>>;
}

const StudentProfile = () => {
  const location: {
    state: {
      value: number;
    };
  } = useLocation();

  const [studentData, setStudentData] = useState<any>({});
  const [isProComplete, setIsProComplete] = useState(0);
  const [isProComplete1, setIsProComplete1] = useState(false);
  const [activeForm, setActiveForm] = useState(0);
  const usertype: any = localStorage.getItem("user_type");
  const { getData } = useApi();
  const StudentId = localStorage.getItem("_id");
  const profileURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
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
            const basic_info = {
              // aim: data?.data?.basic_info?.aim,
              dob: data?.data?.basic_info?.dob,
              father_name: data?.data?.basic_info?.father_name,
              first_name: data?.data?.basic_info?.first_name,
              gender: data?.data?.basic_info?.gender,
              id: data?.data?.basic_info?.id,
              last_name: data?.data?.basic_info?.last_name,
              mother_name: data?.data?.basic_info?.mother_name,
              // student_registration_no: data?.data?.basic_info?.student_registration_no,
            };
            const address = data?.data?.address;
            const language = data?.data?.language_known;
            const academic_history = data.data.academic_history;
            //   let contact = data.data.contact;
            const contact = {
              // email_id: data?.data?.contact?.email_id,
              id: data?.data?.contact?.id,
              // is_active: data?.data?.contact?.is_active,
              mobile_isd_call: data?.data?.contact?.mobile_isd_call,
              mobile_no_call: data?.data?.contact?.mobile_no_call,
              // mobile_no_watsapp: data?.data?.contact?.mobile_no_watsapp,
            };
            const subject_preference = data?.data?.subject_preference;
            //   let hobby = data.data.hobby;

            let totalPercentage = 0;
            let sectionCount = 0;

            if (basic_info && Object.keys(basic_info).length > 0) {
            
              const totalCount = Object.keys(basic_info).length;
              const filledCount = countKeysWithValue(basic_info);
              const percentage = (filledCount / totalCount) * 100;
              // setbasicinfoPercentage(percentage);
              totalPercentage += percentage;
            console.log(percentage);
              sectionCount++;
            } else {
              sectionCount++;
            }

            if (address && Object.keys(address).length > 0) {
              const totalCount = Object.keys(address).length;
              const filledCount = countKeysWithValue(address);
              const percentage = (filledCount / totalCount) * 100;
              // setaddressPercentage(percentage);
              totalPercentage += percentage;
              console.log(percentage);
              sectionCount++;
            } else {
              sectionCount++;
            }

            if (language && Object.keys(language).length > 0) {
              const totalhobbycount = 0;
              const filledhobbyCount = 0;
              const totalCount = Object.keys(language).length + totalhobbycount;
              const filledCount = countKeysWithValue(language) + filledhobbyCount;
              const percentage = (filledCount / totalCount) * 100;
              // setlanguagePercentage(percentage);
              totalPercentage += percentage;
              console.log(percentage);
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

                delete academic_history?.id;
                delete academic_history?.is_active;
                delete academic_history?.sem_id;
                delete academic_history?.stream;
                delete academic_history?.university_id;
                academic_history?.board !== "state_board" &&

                  delete academic_history?.state_for_stateboard;
                }
                // academic_history?.board !== "state_board" &&
                //   delete academic_history?.state_for_stateboard;
              } else {
                delete academic_history?.board;
                delete academic_history?.class_id;
                delete academic_history?.state_for_stateboard;
                delete academic_history?.university_name;
                delete academic_history?.id;
                delete academic_history?.stream;
                delete academic_history?.is_active;
              }
              const totalCount = Object.keys(academic_history).length;
              const filledCount = countKeysWithValue(academic_history);
              const percentage = (filledCount / totalCount) * 100;
              // setacademichistoryPercentage(percentage);
              totalPercentage += percentage;
              console.log(percentage);
              console.log(academic_history);
              console.log(filledCount);
              console.log(totalCount);
              sectionCount++;
            } else {
              sectionCount++;
            }

            if (contact && Object.keys(contact).length > 0) {
              const totalCount = Object.keys(contact).length;
              const filledCount = countKeysWithValue(contact);
              const percentage = (filledCount / totalCount) * 100;
              // setcontactPercentage(percentage);
              totalPercentage += percentage;
              console.log(percentage);
              sectionCount++;
            } else {
              sectionCount++;
            }

            if (
              subject_preference &&
              Object.keys(subject_preference).length > 0
            ) {

              console.log(subject_preference);
              if(academic_history?.institution_type === "school"){
              delete subject_preference?.id;
              delete subject_preference?.is_active;
              delete subject_preference?.course_id;
              delete subject_preference?.course_name;
              delete subject_preference?.sem_id;
              }else {    

              
              delete subject_preference?.id;
              delete subject_preference?.is_active;
              delete subject_preference?.course_id;
              delete subject_preference?.course_name;
              delete subject_preference?.sem_id;
            }
              let totalCount = Object.keys(subject_preference).length;
              let filledCount = countKeysWithValue(subject_preference);
              let percentage = (filledCount / totalCount) * 100;

              // setsubjectPercentage(percentage);
              totalPercentage += percentage;
              console.log(percentage);
              console.log(subject_preference);
              console.log(filledCount);
              console.log(totalCount);
              sectionCount++;
            } else {
              sectionCount++;
            }

            if (sectionCount > 0) {
              let overallPercentage = (totalPercentage+100) / sectionCount;
              // setoverallProfilePercentage(overallPercentage); // Set the overall percentage
              overallPercentage = Math.round(overallPercentage);
              // const nandata = 100 - overallPercentage
              setIsProComplete(overallPercentage);
              console.log(totalPercentage,sectionCount);
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

  
  const handleReset = async () => {
    
    if (((await isProComplete) === 100 ||(await isProComplete) === 117)  && (await isProComplete1)) {
      toast.success("You have completed your profile", {
        hideProgressBar: true,
        theme: "colored",
        position: "top-center",
      });
    } else {
      toast.error(
        "Your profile is incomplete. Please complete your profile.",
        {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center",
        }
      );
    }

    // setActiveStep(0);
    // setIsEdit(false);
    window.scrollTo(0, 0);
  };

  

  return (
    <>
      
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
