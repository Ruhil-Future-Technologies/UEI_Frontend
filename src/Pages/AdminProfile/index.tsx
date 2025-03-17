/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import AdminBasicInfo from '../AdminBasicinfo';
import AdminAddress from '../AdminAddress';
import AdminDescription from '../AdminDescription';
import AdminLanguage from '../AdminLanguage';
//import AdminProfession from '../AdminProfession';
import AdminContactDetails from '../AdminContact';
import { toast } from 'react-toastify';
import { QUERY_KEYS_ADMIN_BASIC_INFO } from '../../utils/const';
import useApi from '../../hooks/useAPI';
import NameContext from '../Context/NameContext';

export default function AdminProfile() {
  const adminId = localStorage.getItem('user_uuid');
  const [isProComplete, setIsProComplete] = React.useState(0);
  console.log(isProComplete);
  const [isProComplete1, setIsProComplete1] = React.useState(false);
  const context = React.useContext(NameContext);

  const { activeForm, setActiveForm }: any = context;
  const profileURL = QUERY_KEYS_ADMIN_BASIC_INFO.ADMIN_GET_PROFILE;
  const { getData } = useApi();
  const [isMobile, setIsMobile] = React.useState(false);
  const totalSteps = 6;
  const stepsRef = React.useRef<HTMLDivElement[]>([]);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const progressLineRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia('(max-width: 1024px)').matches);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check on component mount

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // const handleReset = async () => {
  //   if ((await isProComplete) !== 100 && (await isProComplete1)) {
  //     toast.success(
  //       'Your profile is incomplete. Please complete your profile.',
  //       {
  //         hideProgressBar: true,
  //         theme: 'colored',
  //       },
  //     );
  //   } else if ((await isProComplete) === 100 && (await isProComplete1)) {
  //     toast.success('You have completed your profile', {
  //       hideProgressBar: true,
  //       theme: 'colored',
  //     });
  //   } else {
  //     toast.success(
  //       'Your profile is incomplete. Please complete your profile.',
  //       {
  //         hideProgressBar: true,
  //         theme: 'colored',
  //       },
  //     );
  //   }
  // };

  const countKeysWithValue = (obj: any): number => {
    return Object.keys(obj).filter(
      (key) => obj[key] !== null && obj[key] !== undefined && obj[key] !== '',
    ).length;
  };
  const adminAPI = async () => {
    getData(`${profileURL}/${adminId}`)
      .then((data: any) => {

        if (data.data.admin_data) {
          console.log(data.data.admin_data);
          const basic_info = {
            first_name: data?.data?.admin_data?.basic_info?.first_name,
            last_name: data?.data?.admin_data?.basic_info?.last_name,
            gender: data?.data?.admin_data?.basic_info?.gender,
            dob: data?.data?.admin_data?.basic_info?.dob,
            father_name: data?.data?.admin_data?.basic_info?.father_name,
            mother_name: data?.data?.admin_data?.basic_info?.mother_name,
            department_id: data?.data?.admin_data?.basic_info?.department_id,
            guardian_name: data?.data?.admin_data?.basic_info?.guardian_name,
          };
          const address = data?.data?.admin_data?.address;
          const language = data?.data?.admin_data?.language_known;
          const description = data?.data?.admin_data?.admin_description;
          // let contact = data.data.contact
          const contact = {
            mobile_no_call: data?.data?.admin_data?.contact?.mobile_no_call,
            mobile_isd_call: data?.data?.admin_data?.contact?.mobile_isd_call,
            mobile_no_watsapp: data?.data?.admin_data?.contact?.mobile_no_watsapp,
          };
          const profession = data.data.admin_data?.profession;
          // let hobby = data.data.hobby

          let totalPercentage = 0;
          let sectionCount = 0;

          if (basic_info && Object.keys(basic_info)?.length > 0) {
            if (data?.data?.pic_path !== null) {
              getData(`${'upload_file/get_image/' + data?.data?.pic_path}`)
                .then(() => {
                  // setprofileImage(imgdata.data)
                })
                .catch(() => { });
            }

            const totalcount = Object.keys(basic_info)?.length;
            const filledCount = countKeysWithValue(basic_info);
            const percentage = (filledCount / totalcount) * 100;
            // setbasicinfoPercentage(percentage)
            totalPercentage += percentage;
            sectionCount++;
          } else {
            sectionCount++;
          }
          if (address && Object.keys(address).length > 0) {
            const totalcount = Object.keys(address)?.length;
            const filledCount = countKeysWithValue(address);
            const percentage = (filledCount / totalcount) * 100;
            // setaddressPercentage(percentage)
            totalPercentage += percentage;
            sectionCount++;
          } else {
            sectionCount++;
          }
          if (language && Object.keys(language)?.length > 0) {
            const totalcount = Object.keys(language)?.length;
            const filledCount = countKeysWithValue(language);
            const percentage = (filledCount / totalcount) * 100;
            // setlanguagePercentage(percentage)
            totalPercentage += percentage;
            sectionCount++;
          } else {
            sectionCount++;
          }
          if (description && Object.keys(description)?.length > 0) {
            const totalcount = Object.keys(description)?.length;
            const filledCount = countKeysWithValue(description);
            const percentage = (filledCount / totalcount) * 100;
            // setdesctiptionPercentage(percentage)
            totalPercentage += percentage;
            sectionCount++;
          } else {
            sectionCount++;
          }
          if (contact && Object.keys(contact)?.length > 0) {
            const totalcount = Object.keys(contact)?.length;
            const filledCount = countKeysWithValue(contact);
            const percentage = (filledCount / totalcount) * 100;
            // setcontactPercentage(percentage)
            totalPercentage += percentage;
            sectionCount++;
          } else {
            sectionCount++;
          }
          if (profession && Object.keys(profession)?.length > 0) {
            const totalcount = Object.keys(profession)?.length;
            const filledCount = countKeysWithValue(profession);
            const percentage = (filledCount / totalcount) * 100;
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
          theme: 'colored',
        });
      });
  };
  React.useEffect(() => {
    adminAPI();
  }, []);

  React.useEffect(() => {
    updateWizard();
  }, [activeForm, isMobile]);

  // Function to update the progress line based on the screen size
  const updateWizard = () => {
    if (progressRef.current && progressLineRef.current) {
      if (isMobile) {
        // Horizontal progress for mobile
        progressRef.current.style.width = `${((activeForm + 1) / totalSteps) * 100
          }%`;
        progressLineRef.current.style.width = `${((activeForm + 1) / totalSteps) * 100
          }%`;
        progressLineRef.current.style.height = '2px';
        progressLineRef.current.style.top = 'auto';
      } else {
        // Vertical progress for desktop
        progressRef.current.style.width = `${((activeForm + 1) / totalSteps) * 100
          }%`;

        const stepHeight = stepsRef.current[activeForm]?.offsetHeight || 0;
        const computedStyle = window.getComputedStyle(
          stepsRef.current[activeForm],
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
        progressLineRef.current.style.width = '2px';
        progressLineRef.current.style.top = '0px';
      }
    }
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
                    My <span style={{ color: '#9943EC' }}> Profile </span>
                  </h4>
                ) : (
                  <>
                    {' '}
                    <h4 className="fs-1 fw-bold d-xxl-block">
                      Complete Your{' '}
                      <span style={{ color: '#9943EC' }}> Account </span>
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
                  style={{ border: '0' }}
                >
                  <div className="card-body p-0">
                    <div className="row">
                      <div className="col-xxl-12">
                        <div className="myform-wizard">
                          <div className="wizard-sidebar">
                            <div className="steps-container">
                              <div className="progress-background-admin"></div>
                              <div
                                ref={progressLineRef}
                                className="progress-line"
                              ></div>
                              <div
                                ref={(el) => (stepsRef.current[0] = el!)}
                                className={`step ${activeForm === 0 ? 'active' : ''
                                  }`}
                                onClick={() => setActiveForm(0)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div
                                  className={`step-circle ${activeForm >= 0 ? 'filled' : ''
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
                                className={`step ${activeForm === 1 ? 'active' : ''
                                  }`}
                               // onClick={() => setActiveForm(1)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div
                                  className={`step-circle ${activeForm >= 1 ? 'filled' : ''
                                    }`}
                                >
                                  <CheckOutlinedIcon />
                                </div>
                                <div className="step-label">Address</div>
                              </div>
                              <div
                                ref={(el) => (stepsRef.current[2] = el!)}
                                className={`step ${activeForm === 2 ? 'active' : ''
                                  }`}
                              //  onClick={() => setActiveForm(2)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div
                                  className={`step-circle ${activeForm >= 2 ? 'filled' : ''
                                    }`}
                                >
                                  <CheckOutlinedIcon />
                                </div>
                                <div className="step-label">Language Known</div>
                              </div>
                              <div
                                ref={(el) => (stepsRef.current[3] = el!)}
                                className={`step ${activeForm === 3 ? 'active' : ''
                                  }`}
                               // onClick={() => setActiveForm(3)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div
                                  className={`step-circle ${activeForm >= 3 ? 'filled' : ''
                                    }`}
                                >
                                  <CheckOutlinedIcon />
                                </div>
                                <div className="step-label">Description</div>
                              </div>

                              <div
                                ref={(el) => (stepsRef.current[4] = el!)}
                                className={`step ${activeForm === 4 ? 'active' : ''
                                  }`}
                               // onClick={() => setActiveForm(4)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div
                                  className={`step-circle ${activeForm >= 4 ? 'filled' : ''
                                    }`}
                                >
                                  <CheckOutlinedIcon />
                                </div>
                                <div className="step-label">
                                  Contact Details
                                </div>
                              </div>

                              {/* <div
                                ref={(el) => (stepsRef.current[5] = el!)}
                                className={`step ${activeForm === 5 ? 'active' : ''
                                  }`}
                                onClick={() => setActiveForm(5)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div
                                  className={`step-circle ${activeForm >= 5 ? 'filled' : ''
                                    }`}
                                >
                                  <CheckOutlinedIcon />
                                </div>
                                <div className="step-label">Profession</div>
                              </div> */}
                            </div>
                          </div>
                          <div className="wizard-content">
                            <form id="wizard-form">
                              <div
                                className={`form-step ${activeForm === 0 ? 'active' : ''
                                  }`}
                              >
                                <AdminBasicInfo
                                  setActiveForm={setActiveForm}
                                  activeForm={activeForm}
                                />
                              </div>
                              <div
                                className={`form-step ${activeForm === 1 ? 'active' : ''
                                  }`}
                              >
                                <AdminAddress
                                  setActiveForm={setActiveForm}
                                  activeForm={activeForm}
                                />
                              </div>
                              <div
                                className={`form-step ${activeForm === 2 ? 'active' : ''
                                  }`}
                              >
                                <AdminLanguage
                                  activeForm={activeForm}
                                  setActiveForm={setActiveForm}
                                />
                              </div>
                              <div
                                className={`form-step ${activeForm === 3 ? 'active' : ''
                                  }`}
                              >
                                <div>
                                  <div>
                                    <AdminDescription
                                      activeForm={activeForm}
                                      setActiveForm={setActiveForm}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div
                                className={`form-step ${activeForm === 4 ? 'active' : ''
                                  }`}
                              >
                                <AdminContactDetails
                                  activeForm={activeForm}
                                  setActiveForm={setActiveForm}
                                />
                              </div>
                              {/*
                              <div
                                className={`form-step ${activeForm === 5 ? 'active' : ''
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
                              */}
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
