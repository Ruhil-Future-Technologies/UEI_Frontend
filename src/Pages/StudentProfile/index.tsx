import React, { useContext, useEffect, useState } from "react";
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

import { toast } from "react-toastify";

import NameContext from "../Context/NameContext";
import useApi from "../../hooks/useAPI";
import { QUERY_KEYS_STUDENT } from "../../utils/const";
import { Await, useNavigate } from "react-router-dom";
import { inputfield, inputfieldhover, inputfieldtext } from "../../utils/helpers";
import AcademicHistory from "../AcademicHistory/AcademicHistory";


const StudentProfile = () => {
  const context = useContext(NameContext);
  const {namecolor }:any = context;
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
  const [skipped, setSkipped] = useState(new Set<number>());
  const [isEdit, setIsEdit] = useState(false);
  const [isProComplate, setIsProComplate] = useState(0);
  const [isProComplate1, setIsProComplate1] = useState(false);
  const usertype:any = localStorage.getItem('user_type')
  const { getData} = useApi();
  let StudentId = localStorage.getItem("_id");
  const profileURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const navigator = useNavigate()
  const countKeysWithValue = (obj: any): number => {
    return Object.keys(obj).filter(
      (key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== ""
    ).length;
  };

  const callAPIStudent = async () => {
   
    if(usertype === 'student')
    {
        getData(`${profileURL}/${StudentId}`)
          .then((data: any) => {
            if (data.data) {
              // setProfileDatas(data?.data);
            //   let basic_info = data.data.basic_info;
              let basic_info = {
                aim: data?.data?.basic_info?.aim,
                dob: data?.data?.basic_info?.dob,
                father_name: data?.data?.basic_info?.father_name,
                first_name: data?.data?.basic_info?.first_name,
                gender: data?.data?.basic_info?.gender,
                id: data?.data?.basic_info?.id,
                // is_active: data?.data?.basic_info?.is_active,
                // is_kyc_verified: data?.data?.basic_info?.is_kyc_verified,
                last_modified_datetime: data?.data.basic_info?.last_modified_datetime,
                last_name: data?.data?.basic_info?.last_name,
                mother_name: data?.data?.basic_info?.mother_name,
                student_registration_no: data?.data?.basic_info?.student_registration_no
            };
              let address = data?.data?.address;
              let language = data?.data?.language_known;
              let academic_history = data.data.academic_history;
            //   let contact = data.data.contact;
              let contact ={
                    email_id: data?.data?.contact?.email_id,
                    id:data?.data?.contact?.id,
                    is_active: data?.data?.contact?.is_active,
                    mobile_isd_call: data?.data?.contact?.mobile_isd_call,
                    mobile_no_call: data?.data?.contact?.mobile_no_call, 
                    mobile_no_watsapp: data?.data?.contact?.mobile_no_watsapp, 
              }
              let subject_preference = data?.data?.subject_preference;
            //   let hobby = data.data.hobby;
    
              let totalPercentage = 0;
              let sectionCount = 0;
    
              if (basic_info && Object.keys(basic_info).length > 0) {
                if(data?.data?.pic_path !== ""){

                  getData(`${"upload_file/get_image/" + data?.data?.pic_path}`)
                    .then((imgdata: any) => {
                      // setprofileImage(imgdata.data);
                    })
                    .catch((e) => {
                      // Handle error
                    });
                }
    
                let totalcount = Object.keys(basic_info).length;
                let filledCount = countKeysWithValue(basic_info);
                let percentage = (filledCount / totalcount) * 100;
                // setbasicinfoPercentage(percentage);
                totalPercentage += percentage;
                sectionCount++;
              } else {
                sectionCount++;
              }
    
              if (address && Object.keys(address).length > 0) {
                let totalcount = Object.keys(address).length;
                let filledCount = countKeysWithValue(address);
                let percentage = (filledCount / totalcount) * 100;
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
                let totalcount = Object.keys(language).length + totalhobbycount;
                let filledCount = countKeysWithValue(language) + filledhobbyCount;
                let percentage = (filledCount / totalcount) * 100;
                // setlanguagePercentage(percentage);
                totalPercentage += percentage;
                sectionCount++;
              } else {
                sectionCount++;
              }
    
              if (academic_history && Object.keys(academic_history).length > 0) {
                let totalcount = Object.keys(academic_history).length;
                let filledCount = countKeysWithValue(academic_history);
                let percentage = (filledCount / totalcount) * 100;
                // setacademichistoryPercentage(percentage);
                totalPercentage += percentage;
                sectionCount++;
              } else {
                sectionCount++;
              }
    
              if (contact && Object.keys(contact).length > 0) {
                let totalcount = Object.keys(contact).length;
                let filledCount = countKeysWithValue(contact);
                let percentage = (filledCount / totalcount) * 100;
                // setcontactPercentage(percentage);
                totalPercentage += percentage;
                sectionCount++;
              } else {
                sectionCount++;
              }
    
              if (subject_preference && Object.keys(subject_preference).length > 0) {
                let totalcount = Object.keys(subject_preference).length;
                let filledCount = countKeysWithValue(subject_preference);
                let percentage = (filledCount / totalcount) * 100;
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
                setIsProComplate(overallPercentage)
                // console.log("overallPercentage sss", nandata,overallPercentage);
                // setStats1({
                //     Student_Profile:overallPercentage,
                //     Student_null:nandata
                // })
              }
              setIsProComplate1(true)
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
    navigator('/main/DashBoard')
  }
  const handleReset = async() => {
    console.log("test",isProComplate,isProComplate1)
    if(await isProComplate !== 100 && await isProComplate1){
      toast.success('Your profile is incomplete. Please complete your profile.', {
        hideProgressBar: true,
        theme: "colored",
      });
    }else if(await isProComplate === 100 && await isProComplate1){
      toast.success('You have completed your profile', {
        hideProgressBar: true,
        theme: "colored",
      });
    }else{
      toast.success('Your profile is incomplete. Please complete your profile.', {
        hideProgressBar: true,
        theme: "colored",
      });
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
  if(activeStep === 5 ){
    callAPIStudent()
  }

},[activeStep])

  return (
    <>
      <div className="profile_section">
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
          <div className="card-body student-card-body">
            {!isEdit ? (
              <React.Fragment>
                <PreviewStudentProfile editProfile={editProfile} handleStep={setActiveStep}/>

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
                          {label}
                        </StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <div className="hr border border[#9e9e9e] mt-5"></div>
                
                <React.Fragment>
                <div style={{display:"flex", flexDirection:"row",paddingTop:"10px",justifyContent:"space-between"}}>
                  {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}> */}
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                      variant="contained"
                      className={`${activeStep === 0 ? 'disabled-mainbutton' : 'mainbutton'}`}
                    >
                      Previous
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep !== steps.length - 1 ? (
                      <Button onClick={handleNext} variant="contained" className='mainbutton'>Next</Button>
                    ) : (
                      <Button onClick={handleReset} variant="contained" className='mainbutton'>Finish</Button>
                    )}
                  {/* </Box> */}
                  </div>
                  {activeStep === 0 && <StudentBasicInfo />}
                  {activeStep === 1 && <StudentAddress />}
                  {activeStep === 2 && <StudentLanguageKnown />}
                  {activeStep === 3 && <AcademicHistory />}
                  {/* {activeStep === 3 && <StudentAcademicHistory />} */}
                  {activeStep === 4 && <StudentContactDetails />}
                  {activeStep === 5 && <StudentSubjectPreference />}
                  {/* <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep !== steps.length - 1 ? (
                      <Button onClick={handleNext}>Next</Button>
                    ) : (
                      <Button onClick={handleReset}>Finish</Button>
                    )}
                  </Box> */}
                </React.Fragment>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default StudentProfile;
