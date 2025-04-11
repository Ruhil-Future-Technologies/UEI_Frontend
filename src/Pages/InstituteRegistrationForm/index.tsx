/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import gLogo from '../../assets/img/logo-white.svg';
import { useNavigate, Link as LinkReact } from 'react-router-dom';
import Link from '@mui/material/Link';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import './instituteRegistration.css';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import useApi from '../../hooks/useAPI';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { BackArrowCircle } from '../../assets';
import {
  IEntity,
  InstituteRep0oDTO,
  IUniversity,
} from '../../Components/Table/columns';
import { QUERY_KEYS, QUERY_KEYS_UNIVERSITY } from '../../utils/const';
import { toast } from 'react-toastify';
import {
  Step,
  StepLabel,
  Stepper,
  Typography,
  Box,
  FormControlLabel,
  //Checkbox,
  List,
  ListItem,
} from '@mui/material';
import {
  fieldIcon,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from '../../utils/helpers';
import NameContext from '../Context/NameContext';
import UploadBtn from '../../Components/UploadBTN/UploadBtn';
import OtpCard from '../../Components/Dailog/OtpCard';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import WestIcon from '@mui/icons-material/West';
import FullScreenLoader from '../Loader/FullScreenLoader';
interface Institute {
  institute_name: string;
  university_id: string;
  school_name: string;
  entity_id: string;
  email_id: string;
  mobile_no: string;
  website_url: string;
  country: string;
  state: string;
  city: string;
  district: string;
  address: string;
  pincode: string;
  document: File[];
  icon: string;
}

const InstituteRegistrationForm = () => {
  const navigate = useNavigate();
  const context = useContext(NameContext);
  const { namecolor }: any = context;

  const UniversityURL = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;
  const InstituteEntityURL = QUERY_KEYS.ENTITY_LIST;
  const InstituteAddURL = QUERY_KEYS.INSTITUTE_ADD;
  const InstituteURL = QUERY_KEYS.GET_INSTITUTES;

  const { postRegisterData, getForRegistration, postDataJson ,loading} = useApi();
  const [dataUniversity, setDataUniversity] = useState<IUniversity[]>([]);
  const [valueInstitute, setValueInstitute] = useState<Institute>({
    institute_name: '',
    university_id: '',
    school_name: '',
    entity_id: '',
    email_id: '',
    mobile_no: '',
    website_url: '',
    country: '',
    state: '',
    city: '',
    district: '',
    address: '',
    pincode: '',
    icon: '',
    document: [], // Initialize as an empty array
  });
  const [institute_name_error, setInstitute_name_error] = useState(false);
  const [university_id_error, setUniversity_id_error] = useState(false);
  const [institute_type_error, setInstitute_type_error] = useState(false);
  const [school_name_error, setSchool_name_error] = useState(false);
  const [email_id_error, setEmail_id_error] = useState(false);
  const [mobile_no_error, setMobile_no_error] = useState(false);
   const [website_error, setWebsite_error] = useState(false);
  const [country_error, setCountry_error] = useState(false);
  const [state_error, setState_error] = useState(false);
  const [city_error, setCity_error] = useState(false);
  const [district_error, setDistrict_error] = useState(false);
  const [address_error, setAddress_error] = useState(false);
  const [pincode_error, setPincode_error] = useState(false);
  const [document_error, setDocument_error] = useState(false);

  const [emailExist, setEmailExist] = useState<boolean>(false);
  const [dataEntity, setDataEntity] = useState<IEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [popupOtpCard, setPopupOtpCard] = useState(false);
  const [popupTermandCondi, setPopupTermandcondi] = useState(false);
  const [CheckTermandcondi, setCheckTermandcondi] = useState(true);
  const [allselectedfiles, setAllSelectedfiles] = useState<File[]>([]);
  const [dataInstitute, setDataInstitute] = useState<InstituteRep0oDTO[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getUniversity = () => {
    getForRegistration(`${UniversityURL}`)
      .then((data) => {
        if (data.status) {
          const filteredData = data?.data?.universities_data?.filter(
            (item: any) => item?.is_active,
          );
          setDataUniversity(filteredData || []);
        }
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const getEntity = () => {
    getForRegistration(`${InstituteEntityURL}`)
      .then((data) => {
        if (data.status) {
          const filteredData = data?.data?.entityes_data?.filter(
            (item: any) => item?.is_active,
          );
          setDataEntity(filteredData || []);
        }
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  useEffect(() => {
    getUniversity();
    getEntity();
    getInstitutelist();
  }, []);

  const getInstitutelist = async () => {
    getForRegistration(`${InstituteURL}`)
      .then((data) => {
        const fiteredInstitutedata = data.data.filter(
          (institute: any) =>
            institute.is_active === 1 && institute.is_approve === true,
        );
        if (data.data) {
          setDataInstitute(fiteredInstitutedata);
        }
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  const handleClose = () => {
    setPopupTermandcondi(false);
  };

  const handleTermandCondi = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    setCheckTermandcondi(!isChecked);
  };

  const handleTACpopup = () => {
    setPopupTermandcondi(true);
  };

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    setDocument_error(false);
    setErrorMessage('');
  
    if (!files) return;
  
    const filesArray = Array.from(files);
  
    // Check for duplicate files (compare name + lastModified for uniqueness)
    const duplicateFiles = filesArray.filter((file) =>
      allselectedfiles.some(
        (existingFile) => 
          existingFile.name === file.name && 
          existingFile.lastModified === file.lastModified
      )
    );
  
    if (duplicateFiles.length > 0) {
      setErrorMessage('This document has already been selected');
      event.target.value = '';
      return; // Stop execution to prevent adding duplicate files
    }
  
    setAllSelectedfiles((prevFiles) => [
      ...prevFiles, // Keep previously selected files
      ...filesArray, // Add newly selected files
    ]);
  
    // Reset input field to allow selecting the same files again
    event.target.value = '';
  };
  

  const validation = (name: string, value: string) => {
    if (
      name === 'institute_name' &&
      !/^(?=.*[a-zA-Z .,&'()-])[a-zA-Z0-9 .,&'()-]+$/.test(value)
    ) {
      setInstitute_name_error(true);
    } else {
      setInstitute_name_error(false);
    }

    if (
      name === 'school_name' &&
      !/^(?=.*[a-zA-Z .,'()&-])[a-zA-Z0-9 .,'&()-]+$/.test(value)
    ) {
      setSchool_name_error(true);
    } else {
      setSchool_name_error(false);
    }

    if (
      name === 'email_id' &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
    ) {
      setEmail_id_error(true);
    } else {
      setEmail_id_error(false);
    }

    if (name === 'mobile_no' && !/^(?!0{10})[0-9]{10}$/.test(value.trim())) {
      setMobile_no_error(true);
    } else {
      setMobile_no_error(false);
    }

    if (
      name === 'city' &&
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim())
    ) {
      setCity_error(true);
    } else {
      setCity_error(false);
    }

    if (
      name === 'district' &&
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim())
    ) {
      setDistrict_error(true);
    } else {
      setDistrict_error(false);
    }

    if (
      name === 'address' &&
      !/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(value.trim())
    ) {
      setAddress_error(true);
    } else {
      setAddress_error(false);
    }

    if (name === 'pincode' && !/^(?!0{6})[0-9]{6}$/.test(value.trim())) {
      setPincode_error(true);
    } else {
      setPincode_error(false);
    }
    if (name === 'entity_id' && value == '') {
      setInstitute_type_error(true);
    } else {
      setInstitute_type_error(false);
    }
    if (name === 'university_id' && value === '') {
      setUniversity_id_error(true);
    } else {
      setUniversity_id_error(false);
    }
    if (name === 'country') {
      setCountry_error(value === '' ? true : false);
    }
    if (name === 'state') {
      setState_error(value === '' ? true : false);
    }
    if (
      !/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]*)*(\/)?$/.test(value) && name === 'website_url'
    ) {
      if(value==''){
        setWebsite_error(false);
      }else{
        setWebsite_error(true);
      }
    }else{
      setWebsite_error(false);  
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    e.preventDefault();

    setValueInstitute({ ...valueInstitute, [e.target.name]: e.target.value });
    validation(name, value);
  };
  const handleSelect = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    console.log(name, value);
    if (name === 'entity_id') {
      dataEntity.map((item) => {
        if (String(item.id) == value) {
          setSelectedEntity(item.entity_type);
        }
      });
    }
    validation(name, value);
    setValueInstitute({ ...valueInstitute, [name]: value });
  };

  // const loginSuperUser=()=>{
  //   let payload={
  //     email: process.env.REACT_APP_SUPER_USER_EMAIL,
  //     password: process.env.REACT_APP_SUPER_USER_PASSWORD,
  //     type: "super_admin"
  //   }
  //   postDataJson(`auth/login`,payload).then((data)=>{
  //      if(data.status){

  //      }
  //   })
  // };
  const openPopupOtp = () => {
    //  loginSuperUser();

    const emailExists = dataInstitute.some(
      (item) => item.email === valueInstitute.email_id,
    );
    setEmailExist(emailExists);
    if (emailExists) {
      return;
    }
    // setInstitute_name_error(
    //   selectedEntity === 'College' &&
    //     !/^[a-zA-Z0-9 .,'()& -]+$/.test(valueInstitute.institute_name)
    //     ? true
    //     : false
    // );

    // setUniversity_id_error(
    //   selectedEntity === 'College' && valueInstitute.university_id === ''
    //     ? true
    //     : false
    // );

    // setInstitute_type_error(valueInstitute.entity_id === '' ? true : false);

    // setEmail_id_error(
    //   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valueInstitute.email_id.trim())
    //     ? true
    //     : false
    // );

    // setMobile_no_error(
    //   !/^(?!0{10})[0-9]{10}$/.test(valueInstitute.mobile_no.trim()) ? true : false
    // );

    // setWebsite_error(false);

    // setCountry_error(valueInstitute.country.trim() === '' ? true : false);

    // setState_error(valueInstitute.state.trim() === '' ? true : false);

    // setSchool_name_error(
    //   selectedEntity === 'School' && valueInstitute.school_name === ''
    //     ? true
    //     : false
    // );

    // setCity_error(
    //   !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
    //     valueInstitute.city.trim()
    //   )
    //     ? true
    //     : false
    // );

    // setDistrict_error(
    //   !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
    //     valueInstitute.district.trim()
    //   )
    //     ? true
    //     : false
    // );

    // setAddress_error(
    //   !/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(valueInstitute.address.trim())
    //     ? true
    //     : false
    // );

    // setPincode_error(
    //   !/^(?!0{6})[0-9]{6}$/.test(valueInstitute.pincode.trim()) ? true : false
    // );

    // setDocument_error(valueInstitute.document === null ? true : false);

    // const isSchoolValid =
    //   selectedEntity === 'School'
    //     ? !school_name_error &&
    //     /^(?=.*[a-zA-Z .,&'()-])[a-zA-Z0-9 .,&'()-]+$/.test(
    //       valueInstitute.school_name,
    //     )
    //     : true;

    // const isCollegeValid =
    //   selectedEntity === 'College'
    //     ? !institute_name_error &&
    //     /^(?=.*[a-zA-Z .,&'()-])[a-zA-Z0-9 .,&'()-]+$/.test(
    //       valueInstitute.institute_name,
    //     ) &&
    //     !university_id_error &&
    //     valueInstitute.university_id !== ''
    //     : true;
    if (allselectedfiles.length > 0) {
      setDocument_error(false);
    } else {
      setDocument_error(true);
      return;
    }

    if (
      !institute_type_error &&
      !(valueInstitute.entity_id === '') &&
      !email_id_error &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valueInstitute.email_id) &&
      !mobile_no_error &&
      /^(?!0{10})[0-9]{10}$/.test(valueInstitute.mobile_no) &&
      !country_error &&
      !(valueInstitute.country === '') &&
      !state_error &&
      !(valueInstitute.state === '') &&
      !city_error &&
      /^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        valueInstitute.city.trim(),
      ) &&
      !district_error &&
      /^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
        valueInstitute.district.trim(),
      ) &&
      !address_error &&
      /^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(
        valueInstitute.address.trim(),
      ) &&
      !pincode_error &&
      /^(?!0{6})[0-9]{6}$/.test(valueInstitute.pincode) &&
      !document_error
    ) {
      const formData = new FormData();

      allselectedfiles.forEach((file) => {
        formData.append('documents', file); // Backend reads it as an array
      });

      // Append text fields to FormData
      formData.append(
        'institute_name',
        valueInstitute.school_name || valueInstitute.institute_name,
      );
      formData.append('entity_id', valueInstitute.entity_id);
      formData.append('address', valueInstitute.address);
      formData.append('country', valueInstitute.country);
      formData.append('state', valueInstitute.state);
      formData.append('city', valueInstitute.city);
      formData.append('district', valueInstitute.district);
      formData.append('pincode', valueInstitute.pincode);
      formData.append('website_url', valueInstitute.website_url);
      formData.append('phone', valueInstitute.mobile_no);
      formData.append('email', valueInstitute.email_id);
      formData.append('icon', valueInstitute.icon);
      formData.append('is_verified', 'False');

      if (selectedEntity.toLowerCase() !== 'school') {
        formData.append('university_id', valueInstitute.university_id);
      }
      const payload = {
        email: process.env.REACT_APP_SUPER_USER_EMAIL,
        password: process.env.REACT_APP_SUPER_USER_PASSWORD,
        user_type: 'super_admin',
      };
      postDataJson(`auth/login`, payload).then((data) => {
        if (data.status) {
          const token = data.data.access_token;
          // console.log(token);

          try {
            postRegisterData(`${InstituteAddURL}`, formData, token).then(
              (response) => {

                if (response.status) {
                  toast.success(response.message, {
                    hideProgressBar: true,
                    theme: 'colored',
                  });
                  setPopupOtpCard(true);
                } else {

                  toast.error(response.message, {
                    hideProgressBar: true,
                    theme: 'colored',
                  });
                }
              },
            );
          } catch (error: any) {
            toast.error(error.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        }
      });
    } else {
      toast.error('validation error', {
        hideProgressBar: true,
        theme: 'colored',
      });
    }
  };
  const handleOtpSubmit = (otp: string) => {
    const payload = {
      email: valueInstitute.email_id,
      otp: otp,
    };
    postDataJson(`/auth/verify-otp`, payload).then((data) => {
      if (data.status === true) {
        alert('Wait for 24-48 hours, the Administrator will inform you.');
        window.location.reload();
      }else{
        toast.error(data.message,{
          hideProgressBar:true,
          theme:'colored',
          position:'top-center'
        })
      }
    });
  };
  const handleInputChangecountry = (val: string, name: string) => {
    setValueInstitute({ ...valueInstitute, [name]: val });
    if (name === 'country') {
      setValueInstitute((prevState) => ({ ...prevState, ['state']: '' }));
    }
    validation(name, val);
  };
  const handleRemoveFile = (index: number) => {
    setAllSelectedfiles((previous) =>
      previous.filter((_, ind) => ind !== index),
    );
    setErrorMessage('');
  };

  const steps = [
    {
      label: 'Personal Details',
      subline: 'Enter your entity details here',
      icon: <SchoolOutlinedIcon />,
    },
    {
      label: 'Address Details',
      subline: 'Enter your complete address',
      icon: <BusinessIcon />,
    },
    {
      label: 'Upload Documents',
      subline: 'Upload your documents',
      icon: <DriveFolderUploadIcon />,
    },
  ];
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep == 0) {
      let valid = false;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valueInstitute.email_id.trim())) {
        setEmail_id_error(true);
        valid = true;
      } else {
        setEmail_id_error(false);
      }

      if (
        !/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]*)*(\/)?$/.test(
          valueInstitute.website_url,
        )&& valueInstitute.website_url!=''
      ) {
        setWebsite_error(true);
        valid = true;
      }else{
        setWebsite_error(false);
      }

      if (!/^(?!0{10})[0-9]{10}$/.test(valueInstitute.mobile_no.trim())) {
        setMobile_no_error(true);
        valid = true;
      } else {
        setMobile_no_error(false);
      }

      if (valueInstitute.entity_id == '') {
        setInstitute_type_error(true);
        setUniversity_id_error(true);
        setInstitute_name_error(true);
        valid = true;
      } else {
        setInstitute_type_error(false);
      }

      if (
        selectedEntity.toLowerCase() === 'college' &&
        !/^(?=.*[a-zA-Z .,&'()-])[a-zA-Z0-9 .,&'()-]+$/.test(
          valueInstitute.institute_name,
        )
      ) {
        setInstitute_name_error(true);
        valid = true;
      } else {
        setInstitute_name_error(false);
      }

      if (
        selectedEntity.toLowerCase() === 'college' &&
        valueInstitute.university_id == ''
      ) {
        setUniversity_id_error(true);
        valid = true;
      } else {
        setUniversity_id_error(false);
      }

      if (
        selectedEntity.toLowerCase() === 'school' &&
        !/^(?=.*[a-zA-Z .,'()&-])[a-zA-Z0-9 .,'&()-]+$/.test(
          valueInstitute.school_name,
        )
      ) {
        setSchool_name_error(true);
        valid = true;
      } else {
        setSchool_name_error(false);
      }

      if (!valid) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else if (activeStep == 1) {
      let valid = false;
      if (
        !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
          valueInstitute.city.trim(),
        )
      ) {
        setCity_error(true);
        valid = true;
      } else {
        setCity_error(false);
      }

      if (
        !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
          valueInstitute.district.trim(),
        )
      ) {
        setDistrict_error(true);
        valid = true;
      } else {
        setDistrict_error(false);
      }

      if (
        !/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(
          valueInstitute.address.trim(),
        )
      ) {
        setAddress_error(true);
        valid = true;
      } else {
        setAddress_error(false);
      }

      if (!/^(?!0{6})[0-9]{6}$/.test(valueInstitute.pincode.trim())) {
        setPincode_error(true);
        valid = true;
      } else {
        setPincode_error(false);
      }
      if (valueInstitute.country.trim() === '') {
        setCountry_error(true);
      } else {
        setCountry_error(false);
      }
      if (valueInstitute.state.trim() === '') {
        setState_error(true);
      } else {
        setState_error(false);
      }
      if (!valid) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
 // console.log(dataUniversity);
  return (
    <>
        {loading && <FullScreenLoader />}
      <Box sx={{ width: '100%' }} className="Stepperform">
        <div className="p-lg-4 bg-primary-20 flex-column d-none d-lg-flex">
          <div className="logoui mb-4">
            <img src={gLogo} alt="" onClick={() => navigate('/signup')} />
            <span>Gyansetu</span>
          </div>

          <Stepper
            className="mt-5"
            activeStep={activeStep}
            orientation="vertical"
          >
            {steps.map(({ label, subline, icon }, index) => (
              <Step key={index}>
                <StepLabel icon={icon}>
                  {label}
                  <Typography variant="body2" className="opacity-50">
                    {subline}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          <div className="mt-auto d-flex justify-content-between ">
            <Link
              href="/"
              className="text-dark opacity-75 text-capitalize fs-14 d-flex align-items-center gap-2"
            >
              <WestIcon /> Back to login
            </Link>
          </div>
        </div>
        <Box>
          {activeStep === 0 && (
            <Box>
              <div className="without-login p-3">
                <div className="access1-card">
                  <div className="card-body">
                    <div className="logoui mb-4 justify-content-center d-lg-none">
                      <img
                        src={gLogo}
                        alt=""
                        onClick={() => navigate('/signup')}
                      />
                      <span>Gyansetu</span>
                    </div>
                    <h3 className="text-center fw-bold">
                      Register As Institution
                    </h3>
                    <p className="mb-lg-5 mb-4 text-center text-black-50">
                      Empower your institution—get started today!
                    </p>
                    <div className="row d-flex justify-content-center g-4 mb-4">
                      <div className="col-md-6 col-12">
                        {/* <label className="col-form-label">
                            Entity<span>*</span>
                          </label> */}

                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Entity*
                          </InputLabel>
                          <Select
                            onChange={(e: SelectChangeEvent<string>) =>
                              handleSelect(e)
                            }
                            label="Entity"
                            name="entity_id"
                            value={valueInstitute?.entity_id}
                            variant="outlined"
                            sx={{
                              backgroundColor: inputfield(namecolor),
                              color: inputfieldtext(namecolor),
                              '& .MuiSelect-icon': {
                                color: fieldIcon(namecolor),
                              },
                            }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  backgroundColor: inputfield(namecolor),
                                  color: inputfieldtext(namecolor),
                                },
                              },
                            }}
                          >
                            {dataEntity.map((item, idx) => (
                              <MenuItem
                                value={item.id}
                                key={`${item.entity_type}-${idx + 1}`}
                                sx={{
                                  backgroundColor: inputfield(namecolor),
                                  color: inputfieldtext(namecolor),
                                  '&:hover': {
                                    backgroundColor: inputfieldhover(namecolor),
                                  },
                                }}
                              >
                                {item.entity_type}
                              </MenuItem>
                            ))}
                          </Select>
                          <div>
                            {institute_type_error === true && (
                              <p
                                className="error-text"
                                style={{ color: 'red' }}
                              >
                                <small>Please select a Entity.</small>
                              </p>
                            )}
                          </div>
                        </FormControl>
                      </div>

                      <div className="col-md-6 col-12">
                        {/* <label className="col-form-label">
                            Website<span></span>
                          </label> */}
                        <TextField
                          autoComplete="off"
                          className="form-control"
                          name="website_url"
                          onChange={handleChange}
                          value={valueInstitute.website_url}
                          label="Website"
                          variant="outlined"
                        />

                        <div>
                        {website_error === true && (
                          <p
                            className="error-text"
                            style={{ color: 'red' }}
                          >
                            <small>Please enter a valid Website.</small>
                          </p>
                        )}
                      </div>
                      </div>
                    </div>
                    {selectedEntity.toLowerCase() === 'school' ? (
                      <div className="row d-flex justify-content-center mb-4">
                        <div className="col-12">
                          {/* <label className="col-form-label">
                              School Name<span>*</span>
                            </label> */}
                          <TextField
                            autoComplete="off"
                            className="form-control"
                            name="school_name"
                            value={valueInstitute.school_name}
                            onChange={handleChange}
                            label="School Name*"
                          />
                          <div>
                            {school_name_error === true && (
                              <p
                                className="error-text "
                                style={{ color: 'red' }}
                              >
                                <small>Please enter a valid School name.</small>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="row d-flex justify-content-center mb-4 g-4">
                        <div className="col-md-6 col-12 ">
                          {/* <label className="col-form-label">
                              University Name<span>*</span>
                            </label> */}
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              University*
                            </InputLabel>
                            <Select
                              onChange={(e: SelectChangeEvent<string>) =>
                                handleSelect(e)
                              }
                              label="University*"
                              name="university_id"
                              value={valueInstitute?.university_id}
                              variant="outlined"
                              sx={{
                                backgroundColor: inputfield(namecolor),
                                color: inputfieldtext(namecolor),
                                '& .MuiSelect-icon': {
                                  color: fieldIcon(namecolor),
                                },
                              }}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    backgroundColor: inputfield(namecolor),
                                    color: inputfieldtext(namecolor),
                                  },
                                },
                              }}
                            >
                              {dataUniversity?.map((item, idx) => (
                                <MenuItem
                                  value={item.id}
                                  key={`${item.university_name}-${idx + 1}`}
                                  sx={{
                                    backgroundColor: inputfield(namecolor),
                                    color: inputfieldtext(namecolor),
                                    '&:hover': {
                                      backgroundColor:
                                        inputfieldhover(namecolor),
                                    },
                                  }}
                                >
                                  {item.university_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <div>
                            {university_id_error === true && (
                              <p
                                className="error-text "
                                style={{ color: 'red' }}
                              >
                                <small>Please select a University name.</small>
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6 col-12 ">
                          {/* <label className="col-form-label">
                              Institute Name<span>*</span>
                            </label> */}

                          <TextField
                            label="Institute Name*"
                            autoComplete="off"
                            className="form-control"
                            name="institute_name"
                            onChange={handleChange}
                            value={valueInstitute.institute_name}
                          />
                          <div>
                            {institute_name_error === true && (
                              <p
                                className="error-text "
                                style={{ color: 'red' }}
                              >
                                <small>
                                  Please enter a valid Institute name.
                                </small>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="row d-flex justify-content-center">
                      <div className="col-md-6 col-12 mb-3">
                        {/* <label className="col-form-label">
                            Mobile Number<span>*</span>
                          </label> */}

                        <TextField
                          autoComplete="off"
                          className="form-control"
                          name="mobile_no"
                          onChange={handleChange}
                          value={valueInstitute.mobile_no}
                          variant="outlined"
                          label="Mobile Number*"
                        />
                        <div>
                          {mobile_no_error === true && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small>Please enter a valid Mobile Number.</small>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6 col-12 mb-3">
                        {/* <label className="col-form-label">
                            Email Id<span>*</span>
                          </label> */}
                        <TextField
                          autoComplete="off"
                          className="form-control"
                          name="email_id"
                          value={valueInstitute.email_id}
                          onChange={handleChange}
                          variant="outlined"
                          label="Email Id*"
                        />
                        <div>
                          {email_id_error === true && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small> Please enter a valid Email Id.</small>
                            </p>
                          )}
                          {emailExist === true && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small>Email ID already exists.</small>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-12">
                        <Button
                          className="btn btn-secondary w-100 mt-4 outsecbtn "
                          variant="contained"
                          onClick={handleNext}
                        >
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>

                        <Link
                          href="/"
                          className="text-dark opacity-75 d-lg-none text-capitalize mt-3 fs-14 d-flex align-items-center gap-2 justify-content-center"
                        >
                          <WestIcon /> Back to login
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <div className="without-login p-3">
                <div className="access1-card">
                  <div className="card-body">
                    <div className="row d-flex justify-content-center g-4 mb-4">
                      <div className="col-12">
                        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                          <BackArrowCircle
                            onClick={handleBack}
                            role="button"
                            fontSize="small"
                          />
                          Address Details
                        </h5>
                      </div>
                      <div className="col-md-6 col-12 ">
                        {/* <label className={`col-form-label`}>
                          Country<span>*</span>
                        </label> */}
                        <CountryDropdown
                          classes="form-select custom-dropdown"
                          defaultOptionLabel="Select your country"
                          value={valueInstitute.country || ''}
                          onChange={(e: string) =>
                            handleInputChangecountry(e, 'country')
                          }
                        />
                        {country_error === true && (
                          <p className="error-text " style={{ color: 'red' }}>
                            <small>Please select a Country.</small>
                          </p>
                        )}
                      </div>

                      <div className="col-md-6 col-12 ">
                        {/* <label className="col-form-label">
                          State<span>*</span>
                        </label> */}
                        <RegionDropdown
                          data-testid="perStateDropdown"
                          classes="form-select custom-dropdown"
                          defaultOptionLabel="Select your state"
                          country={valueInstitute.country || ''}
                          value={valueInstitute.state || ''}
                          // onChange={(val) => setRegion(val)}
                          onChange={(e: string) =>
                            handleInputChangecountry(e, 'state')
                          }
                        />
                        {state_error === true && (
                          <p className="error-text " style={{ color: 'red' }}>
                            <small>Please select a State.</small>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center g-4 mb-4">
                      <div className="col-md-6 col-12 ">
                        {/* <label className="col-form-label">
                            District<span>*</span>
                          </label> */}
                        <TextField
                          autoComplete="off"
                          className="form-control"
                          name="district"
                          onChange={handleChange}
                          value={valueInstitute.district}
                          label="District*"
                        />
                        <div>
                          {district_error === true && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small>
                                {' '}
                                Please enter a valid District name.
                              </small>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        {/* <label className="col-form-label">
                            City<span>*</span>
                          </label> */}

                        <TextField
                          autoComplete="off"
                          className="form-control"
                          name="city"
                          onChange={handleChange}
                          value={valueInstitute.city}
                          label="City*"
                        />
                        <div>
                          {city_error === true && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small>Please enter a valid City name.</small>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center mb-4 g-4">
                      <div className="col-md-6 col-12">
                        {/* <label className="col-form-label">
                            Address<span>*</span>
                          </label> */}

                        <TextField
                          autoComplete="off"
                          className="form-control"
                          name="address"
                          onChange={handleChange}
                          value={valueInstitute.address}
                          label="Address*"
                        />
                        <div>
                          {address_error === true && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small>Please enter a valid Address.</small>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 col-12">
                        {/* <label className="col-form-label">
                            Pincode<span>*</span>
                          </label> */}

                        <TextField
                          autoComplete="off"
                          className="form-control"
                          name="pincode"
                          onChange={handleChange}
                          value={valueInstitute.pincode}
                          label="Pincode*"
                        />
                        <div>
                          {pincode_error === true && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small> Please enter a valid Pincode.</small>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <Box>
                          <Button
                            variant="contained"
                            className="btn btn-secondary w-100 outsecbtn mb-2"
                            onClick={handleNext}
                          >
                            {activeStep === steps.length - 1
                              ? 'Finish'
                              : 'Next'}
                          </Button>
                        </Box>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          )}
          {activeStep === 2 && (
            <Box>
              <div className="without-login p-3">
                <div className="access1-card">
                  <div className="card-body">
                    <div className="row d-flex justify-content-center g-4">
                      <div className="col-12">
                        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                          <BackArrowCircle
                            onClick={handleBack}
                            role="button"
                            fontSize="small"
                          />{' '}
                          Documents & Logo
                        </h5>
                      </div>
                      <div className="col-md-6 col-12 ">
                        <Card>
                          <CardContent>
                            <label className="col-form-label">
                              {' '}
                              Document<span>*</span>
                            </label>
                            <br />
                            <UploadBtn
                              label="Upload Documents"
                              name="document"
                              accept=".pdf, .jpg, .jpeg, .png, .gif"
                              handleFileChange={handleFileChange}
                            />
                            <div>
                              {document_error && (
                                <p
                                  className="error-text "
                                  style={{ color: 'red' }}
                                >
                                  <small>
                                    {' '}
                                    Please select at least a Document file.
                                  </small>
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="col-md-6 col-12 ">
                        <Card>
                          <CardContent>
                            <label className="col-form-label">
                              {' '}
                              Logo<span></span>
                            </label>
                            <br />
                            <UploadBtn
                              label="Upload Logo"
                              name="icon"
                              accept=".jpg, .jpeg, .png, .gif"
                              handleFileChange={handleFileChange}
                            />
                          </CardContent>
                        </Card>
                        <div>
                          <ul>{valueInstitute.icon}</ul>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="">
                          {allselectedfiles.length > 0 && (
                            <ul className="doclist">
                              {allselectedfiles.map((file, index) => (
                                <li
                                  key={index}
                                  className="flex items-center justify-between"
                                >
                                  {file.name}
                                  <DeleteOutlinedIcon
                                    className="m-2 cursor-pointer"
                                    onClick={() => handleRemoveFile(index)}
                                  />
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        {errorMessage && <p style={{ color: 'red' }} className="text-red-500">{errorMessage}</p>}
                      </div>
                      <div className="col-lg-12">
                        <FormControlLabel
                          control={
                            <input
                              data-testid="checkbox"
                              className="form-check-input me-1"
                              type="checkbox"
                              value=""
                              id="flexCheckDefault"
                              onChange={handleTermandCondi}
                            />
                          }
                          label={
                            <Typography variant="body2">
                              By registering your account you have to agree with
                              our{' '}
                              <Link
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleTACpopup();
                                }}
                                sx={{ fontSize: '0.85rem' }} // Adjusts font size of the link
                              >
                                Terms & Conditions
                              </Link>
                            </Typography>
                          }
                          sx={{
                            '& .MuiTypography-root': { fontSize: '0.85rem' },
                          }} // Adjusts font size of the entire label
                        />
                      </div>
                      <div className="col-12">
                        <div className=" d-flex justify-content-center  flex-column">
                          <Button
                            variant="contained"
                            disabled={CheckTermandcondi}
                            onClick={openPopupOtp}
                            className="py-3"
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* <div className="form-check mb-3 fs-14">
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
                          By registering your account you have to agree with our{' '}
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleTACpopup();
                            }}
                          >
                            {' '}
                            Terms & Conditions
                          </a>
                        </label>
                      </div> */}

                    <Dialog open={popupTermandCondi} onClose={handleClose}>
                      <DialogTitle>{'Terms and Conditions'}</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Content of Gyansetu Terms and Conditions...... will
                          come soon
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
            </Box>
          )}
          <OtpCard
            open={popupOtpCard}
            handleOtpClose={() => setPopupOtpCard(false)}
            handleOtpSuccess={(otp: string) => handleOtpSubmit(otp)}
            email={valueInstitute.email_id}
          />
          <footer className="login-footer bg-light">
                      <p className="mb-0">Copyright © 2025. All rights reserved.</p>
                      <List
                        sx={{
                          display: 'inline-flex',
                          flexWrap: 'wrap',
                          gap: 2,
                          padding: 0,
                        }}
                      >
                        <ListItem sx={{ width: 'auto', padding: 0 }}>
                          <LinkReact to="/privacypolicy" color="primary">
                            Privacy Policy
                          </LinkReact>
                        </ListItem>
                        <ListItem sx={{ width: 'auto', padding: 0 }}>
                          <LinkReact to="/refundpolicy" color="primary">
                            Refund Policy
                          </LinkReact>
                        </ListItem>
                        <ListItem sx={{ width: 'auto', padding: 0 }}>
                          <LinkReact to="/Disclaimer" color="primary">
                            Disclaimer
                          </LinkReact>
                        </ListItem>
                        <ListItem sx={{ width: 'auto', padding: 0 }}>
                          <LinkReact to="/ServicesAgreement" color="primary">
                            End User Agreement
                          </LinkReact>
                        </ListItem>
                      </List>
                    </footer>
        </Box>
      </Box>
     
    </>
  );
};

export default InstituteRegistrationForm;
