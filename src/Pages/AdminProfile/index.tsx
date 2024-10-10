import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AdminBasicInfo from '../AdminBasicinfo';
import AdminAddress from '../AdminAddress';
import AdminDescription from '../AdminDescription';
import AdminLenguage from '../AdminLanguage';
import AdminProfession from '../AdminProfession';
import AdmincontactDtails from '../AdminContact';
import PreviewAdminProfile from '../PreviewAdminProfile';

import { Divider, useMediaQuery, useTheme } from '@mui/material';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';
import { QUERY_KEYS_ADMIN_BASIC_INFO } from '../../utils/const';
import useApi from '../../hooks/useAPI';
import { inputfieldtext } from '../../utils/helpers';
import NameContext from '../Context/NameContext';


const steps = ['Admin Basic Information', 'Admin Address', 'Language known', 'Admin Description', 'Admin Contact Details', 'Admin Profession'];

export default function AdminProfile() {
  const context = React.useContext(NameContext);
  const {namecolor }:any = context;
  let adminId = localStorage.getItem('_id')
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const [isEdit, setIsEdit] = React.useState(false);
  const [isEdit1, setIsEdit1] = React.useState(false);
  const [isProComplate, setIsProComplate] = React.useState(0);
  const [isProComplate1, setIsProComplate1] = React.useState(false);
  const theme = useTheme();
  const navigator = useNavigate()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  }
  const profileURL = QUERY_KEYS_ADMIN_BASIC_INFO.ADMIN_GET_PROFILE;
  const { getData } = useApi()


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

    setActiveStep(0);

  };

  const editProfile = () => {
    setIsEdit(true)

    // setIsEdit1(true)
  }
  const isEditfun = () => {
    setIsEdit1(false)

  }
  const viewProfile = () => {
    setIsEdit(false)
  }

  const viewProfileHome = () => {
    navigator('/main/DashBoard')
  }
  const viewProfile1 = () => {
    setIsEdit1(true)
  }
  const countKeysWithValue = (obj: any): number => {
    return Object.keys(obj).filter(key => obj[key] !== null && obj[key] !== undefined && obj[key] !== '').length;
  };
  const adminAPI = async () => {
    // console.log("======-=-=-==--=-=-==",adminId);
    getData(`${profileURL}/${adminId}`).then((data: any) => {
      // console.log(data.data)
      if (data.data) {
        // setProfileData(data?.data)
        // let basic_info = data.data.basic_info
        let basic_info = {
          first_name:data?.data?.basic_info?.first_name,
          last_name:data?.data?.basic_info?.last_name,
          gender:data?.data?.basic_info?.gender,
          dob:data?.data?.basic_info?.dob,
          father_name:data?.data?.basic_info?.father_name,
          mother_name:data?.data?.basic_info?.mother_name,
          department_id:data?.data?.basic_info?.department_id,
          guardian_name:data?.data?.basic_info?.guardian_name

        }
        let address = data?.data?.address
        let language = data?.data?.language_known
        let description = data?.data?.admin_description
        // let contact = data.data.contact
        let contact = {
          mobile_no_call:data?.data?.contact?.mobile_no_call,
          mobile_isd_call:data?.data?.contact?.mobile_isd_call,
          mobile_no_watsapp: data?.data?.contact?.mobile_no_watsapp, 
        }
        let profession = data.data.profession
        // let hobby = data.data.hobby

        let totalPercentage = 0;
        let sectionCount = 0;

        if (basic_info && Object.keys(basic_info)?.length > 0) {
          if(data?.data?.pic_path !== ""){

            getData(`${"upload_file/get_image/" + data?.data?.pic_path}`)
              .then((imgdata: any) => {
                // setprofileImage(imgdata.data)
              }).catch((e) => {
                
              });
          }

          let totalcount = Object.keys(basic_info)?.length
          let filledCount = countKeysWithValue(basic_info)
          let percentage = (filledCount / totalcount) * 100
          // setbasicinfoPercentage(percentage)
          totalPercentage += percentage;
          sectionCount++;
        }else {
          sectionCount++;
        }
        if (address && Object.keys(address).length > 0) {
          let totalcount = Object.keys(address)?.length
          let filledCount = countKeysWithValue(address)
          let percentage = (filledCount / totalcount) * 100
          // setaddressPercentage(percentage)
          totalPercentage += percentage;
                sectionCount++;
        }else {
          sectionCount++;
        }
        if (language && Object.keys(language)?.length > 0) {
          // let totalhobbycount = 0
          // let filledhobbyCount = 0
          // if (hobby && Object.keys(hobby).length > 0) {
          //   totalhobbycount = Object.keys(hobby).length
          //   filledhobbyCount = countKeysWithValue(hobby)
          // }
          let totalcount = Object.keys(language)?.length 
          let filledCount = countKeysWithValue(language) 
          let percentage = (filledCount / totalcount) * 100
          // setlanguagePercentage(percentage)
          totalPercentage += percentage;
          sectionCount++;
        }else {
          sectionCount++;
        }
        if (description && Object.keys(description)?.length > 0) {
          let totalcount = Object.keys(description)?.length
          let filledCount = countKeysWithValue(description)
          let percentage = (filledCount / totalcount) * 100
          // setdesctiptionPercentage(percentage)
          totalPercentage += percentage;
          sectionCount++;
        }else {
          sectionCount++;
        }
        if (contact && Object.keys(contact)?.length > 0) {
          let totalcount = Object.keys(contact)?.length
          let filledCount = countKeysWithValue(contact)
          let percentage = (filledCount / totalcount) * 100
          // setcontactPercentage(percentage)
          totalPercentage += percentage;
          sectionCount++;
        }else {
          sectionCount++;
        }
        if (profession && Object.keys(profession)?.length > 0) {
          let totalcount = Object.keys(profession)?.length
          let filledCount = countKeysWithValue(profession)
          let percentage = (filledCount / totalcount) * 100
          // setprofessionPercentage(percentage)
          totalPercentage += percentage;
           sectionCount++;
        }else {
          sectionCount++;
        }
        if (sectionCount > 0) {
          let overallPercentage = totalPercentage / sectionCount;
          // setoverallProfilePercentage(overallPercentage); // Set the overall percentage
          overallPercentage = Math.round(overallPercentage);
          // const nandata = 100 - overallPercentage 
          setIsProComplate(overallPercentage)
         
        }
        setIsProComplate1(true)
        // setper(true)
      }
    }).catch(e => {
      toast.error(e?.message, {
        hideProgressBar: true,
        theme: "colored",
      });
    });
  }
  React.useEffect(() => {
    if(activeStep === 5){
      adminAPI()
    }
  },[activeStep])
  // const handleMouseEnter = (event:any) => {
  //   event.target.style.backgroundColor = '#6c757d';  // Example hover style
  //   // event.target.style.fontSize= '.90rem'
  // };
  
  // const handleMouseLeave = (event:any) => {
  //   // event.target.style.color = 'initial';  // Reset to initial style
  //   // event.target.style.fontSize= '.90rem'
  //   event.target.style.backgroundColor = 'inherit';
  // };

  return (
    <>
      <div className="profile_section">
        <div className="card">
          <div className="card-header custom-header">
            {/* <div className="card-header--actions d-flex justify-content-end align-items-right">
            <Button  className="float-left">
                  Back 
                </Button> 
              {isEdit ?
                <Button onClick={viewProfile} className="float-right">
                  View Profile
                </Button> :
                <Button onClick={editProfile} className="float-right">
                  Edit Profile
                </Button>}
            </div> */}
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
                {/* <Divider sx={{ borderBottomWidth: 1, borderColor: 'black', marginBottom: "20px" }} />

              <Box sx={{ width: '100%' }}> */}
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

                    {/* <Divider sx={{ borderBottomWidth: 1, borderColor: 'black' }} /> */}

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
                  {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {activeStep !== steps.length - 1 ?
                      <Button onClick={handleNext}>
                        Next
                      </Button>
                      : <Button onClick={() => {
                        handleReset();
                        viewProfile();
                      }}>
                        Finish
                      </Button>
                    }
                  </Box> */}

                </React.Fragment>
              </>
            )}
          </div>
        </div>
      </div>
    </>

  );
}
