/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import gLogo from '../../assets/img/logo-white.svg';
import { useNavigate } from 'react-router-dom';
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
import { IEntity, IUniversity } from '../../Components/Table/columns';
import { QUERY_KEYS, QUERY_KEYS_UNIVERSITY } from '../../utils/const';
import { toast } from 'react-toastify';
import {
  fieldIcon,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from '../../utils/helpers';
import NameContext from '../Context/NameContext';
import UploadBtn from '../../Components/UploadBTN/UploadBtn';
import OtpCard from '../../Components/Dailog/OtpCard';
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
  const { postRegisterData, getForRegistration } = useApi();
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
  const [error, setError] = useState<{
    institute_name_error: boolean;
    university_id_error: boolean;
    institute_type_error: boolean;
    school_name_error: boolean;
    email_id_error: boolean;
    mobile_no_error: boolean;
    website_error: boolean;
    country_error: boolean;
    state_error: boolean;
    city_error: boolean;
    district_error: boolean;
    address_error: boolean;
    pincode_error: boolean;
    document_error: boolean;
  }>({
    institute_name_error: false,
    university_id_error: false,
    institute_type_error: false,
    school_name_error: false,
    email_id_error: false,
    mobile_no_error: false,
    website_error: false,
    country_error: false,
    state_error: false,
    city_error: false,
    district_error: false,
    address_error: false,
    pincode_error: false,
    document_error: false,
  });
  const [dataEntity, setDataEntity] = useState<IEntity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState('');
  const [popupOtpCard, setPopupOtpCard] = useState(false);
  const [popupTermandCondi, setPopupTermandcondi] = useState(false);
  const [CheckTermandcondi, setCheckTermandcondi] = useState(true);
  const [allselectedfiles, handleFileChanges] = useState<File[]>([]);
  // const [logo,setLogo]=useState<File>();
  const getUniversity = () => {
    getForRegistration(`${UniversityURL}`)
      .then((data: { data: IUniversity[] }) => {
        if (data.data) {
          setDataUniversity(data?.data);
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

  const getEntity = () => {
    getForRegistration(`${InstituteEntityURL}`)
      .then((data: { data: IEntity[] }) => {
        // const filteredData = data?.data.filter(
        //     (entity) => entity.is_active === 1,
        // );
        // setDataEntity(filteredData);
        setDataEntity(data?.data);
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

  useEffect(() => {
    getUniversity();
    getEntity();
  }, []);

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
console.log(files,typeof files)
    if (files && event.target.name !== 'icon') {
      const filesArray = Array.from(files); // Convert FileList to an array
      handleFileChanges((prevFiles) => [
        ...prevFiles, // Keep previously selected files
        ...filesArray, // Add newly selected files
      ]);
    } else {
      // setLogo(files);
    }
  };

  const validation = (name: string, value: string) => {
    setError({
      institute_name_error:
        name === 'institute_name' &&
          !/^(?=.*[a-zA-Z .,&'()-])[a-zA-Z0-9 .,&'()-]+$/.test(value)
          ? true
          : false,
      university_id_error: false,
      institute_type_error: false,
      school_name_error:
        name === 'school_name' &&
        !/^(?=.*[a-zA-Z .,'()&-])[a-zA-Z0-9 .,'&()-]+$/.test(value),
      email_id_error:
        name === 'email_id' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          ? true
          : false,
      mobile_no_error:
        name === 'mobile_no' && !/^(?!0{10})[0-9]{10}$/.test(value.trim())
          ? true
          : false,
      website_error:
        name === 'website' &&
        !/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]*)*(\/)?$/.test(
          value.trim(),
        ),
      country_error: false,
      state_error: false,
      city_error:
        name === 'city' && !/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(value.trim())
          ? true
          : false,
      district_error:
        name === 'district' && !/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(value.trim())
          ? true
          : false,
      address_error:
        name === 'address' &&
        !/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(value.trim())
          ? true
          : false,
      pincode_error:
        name === 'pincode' && !/^(?!0{6})[0-9]{6}$/.test(value.trim()),
      document_error: false,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    e.preventDefault();

    setValueInstitute({ ...valueInstitute, [e.target.name]: e.target.value });
    validation(name, value);
  };
  const handleSelect = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
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
  const openPopupOtp=()=>{
    setError({
      institute_name_error:
        selectedEntity === 'College' &&
        !/^[a-zA-Z0-9 .,'()& -]+$/.test(valueInstitute.institute_name)
          ? true
          : false,
      university_id_error:
        selectedEntity === 'College' &&
        valueInstitute.university_id.trim() === ''
          ? true
          : false,
      institute_type_error:
        valueInstitute.entity_id.trim() === '' ? true : false,
      email_id_error: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        valueInstitute.email_id.trim(),
      )
        ? true
        : false,
      mobile_no_error: !/^(?!0{10})[0-9]{10}$/.test(
        valueInstitute.mobile_no.trim(),
      )
        ? true
        : false,
      website_error: !/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]*)*(\/)?$/.test(valueInstitute.website_url),
      country_error: valueInstitute.country.trim() === '' ? true : false,
      state_error: valueInstitute.state.trim() === '' ? true : false,
      school_name_error:
        selectedEntity === 'School' && valueInstitute.school_name === ''
          ? true
          : false,
      city_error: !/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(valueInstitute.city.trim())
        ? true
        : false,
      district_error: !/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(
        valueInstitute.district.trim(),
      )
        ? true
        : false,
      address_error: !/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(
        valueInstitute.address.trim(),
      )
        ? true
        : false,
      pincode_error: !/^(?!0{6})[0-9]{6}$/.test(valueInstitute.pincode.trim())
        ? true
        : false,
      document_error: valueInstitute.document === null ? true : false,
    });
    console.log(selectedEntity);
    const isSchoolValid =
      selectedEntity === 'School'
        ? !error.school_name_error &&
          /^(?=.*[a-zA-Z .,&'()-])[a-zA-Z0-9 .,&'()-]+$/.test(
            valueInstitute.school_name,
          )
        : true;

    const isCollegeValid =
      selectedEntity === 'College'
        ? !error.institute_name_error &&
          /^(?=.*[a-zA-Z .,&'()-])[a-zA-Z0-9 .,&'()-]+$/.test(
            valueInstitute.institute_name,
          ) &&
          !error.university_id_error &&
          valueInstitute.university_id !== ''
        : true;
    console.log(error);
    console.log(isSchoolValid, isCollegeValid);
    if (
      !error.institute_type_error &&
      !(valueInstitute.entity_id === '') &&
      !error.email_id_error &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valueInstitute.email_id) &&
      !error.mobile_no_error &&
      /^(?!0{10})[0-9]{10}$/.test(valueInstitute.mobile_no) &&
      !error.website_error &&
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]*)*(\/)?$/.test(valueInstitute.website_url) &&
      !error.country_error &&
      !(valueInstitute.country === '') &&
      !error.state_error &&
      !(valueInstitute.state === '') &&
      !error.city_error &&
      /^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(valueInstitute.city.trim()) &&
      !error.district_error &&
      /^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(valueInstitute.district.trim()) &&
      !error.address_error &&

      /^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(valueInstitute.address.trim()) &&

      !error.pincode_error &&
      /^(?!0{6})[0-9]{6}$/.test(valueInstitute.pincode) &&
      !error.document_error &&
      valueInstitute.document &&
      isCollegeValid &&
      isSchoolValid
    ) {
      setPopupOtpCard(true)
    }  else {
      toast.error('validation error', {
        hideProgressBar: true,
        theme: 'colored',
      })

  }
}
  const handleSubmit = () => {
    // setPopupOtpCard(true);
   
   
   
      const formData = new FormData();

      // allselectedfiles.forEach((file, index) => {
      //   if (file instanceof File) {
      //     formData.append(`documents[${index}]`, file);
      //   } else {
      //     console.error(`Invalid file at index ${index}`, file);
      //   }
      // });
      allselectedfiles.forEach((file) => {
        formData.append("documents", file);  // Use same key for all files
      });
    
      // Append text fields to FormData
      formData.append("institution_name", valueInstitute.school_name || valueInstitute.institute_name);
      formData.append("entity_id", valueInstitute.entity_id);
      formData.append("address", valueInstitute.address);
      formData.append("country", valueInstitute.country);
      formData.append("state", valueInstitute.state);
      formData.append("city", valueInstitute.city);
      formData.append("district", valueInstitute.district);
      formData.append("pincode", valueInstitute.pincode);
      formData.append("website_url", valueInstitute.website_url);
      formData.append("mobile_no", valueInstitute.mobile_no);
      formData.append("email_id", valueInstitute.email_id);
      formData.append("icon", "");  
      

      if (selectedEntity !== 'School') {
        formData.append("university_id", valueInstitute.university_id);
      }
    
      // ✅ Debugging: Check FormData contents before sending
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      try{
        postRegisterData(`${InstituteAddURL}`, formData).then((response) => {
          console.log(response)
          if (response.status === 200) {
            toast.success('Institute registration request sent successfully', {
              hideProgressBar: true,
              theme: 'colored',
            });
            alert('Wait for 24-48 hours, the Administrator will inform you.');
            window.location.reload();
          } else {
            toast.error(response.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        });
      } catch (error) {
        console.error(error);
      }
   
  };
  const handleInputChangecountry = (val: string, name: string) => {
    setValueInstitute({ ...valueInstitute, [name]: val });
    if (name === 'country') {
      setValueInstitute((prevState) => ({ ...prevState, ['state']: '' }));
    }
    validation(name, val);
  };

  return (
    <div className="without-login">
      <header className="container-fluid  py-3 d-none d-lg-block">
        <div className="row align-items-center">
          <div className="col-6">
            <div className="logoui">
              <img src={gLogo} alt="" onClick={() => navigate('/signup')} />
              <span>Gyansetu</span>
            </div>
          </div>
        </div>
      </header>
      <div className="access1-card">
        <div className="card-body">
          <h3 className="text-center fw-bold">Register As Institution</h3>
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                Entity<span>*</span>
              </label>

              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Entity *</InputLabel>
                <Select
                  onChange={(e: SelectChangeEvent<string>) => handleSelect(e)}
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
              </FormControl>
            </div>

            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                Website<span>*</span>
              </label>
              <TextField
                autoComplete="off"
                className="form-control"
                name="website_url"
                onChange={handleChange}
                value={valueInstitute.website_url}
              />
              <div>
                {error.website_error === true && (
                  <p className="error-text" style={{ color: 'red' }}>
                    <small>Please enter a valid Website.</small>
                  </p>
                )}
              </div>
            </div>
          </div>
          {selectedEntity === 'School' ? (
            <div className="row d-flex justify-content-center">
              <div className="col-12">
                <label className="col-form-label">
                  School Name<span>*</span>
                </label>
                <TextField
                  autoComplete="off"
                  className="form-control"
                  name="school_name"
                  value={valueInstitute.school_name}
                  onChange={handleChange}
                />
                <div>
                  {error.school_name_error === true && (
                    <p className="error-text " style={{ color: 'red' }}>
                      <small>Please enter a valid School name.</small>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="row d-flex justify-content-center">
              <div className="col-md-6 col-12 mb-3">
                <label className="col-form-label">
                  University Name<span>*</span>
                </label>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    University *
                  </InputLabel>
                  <Select
                    onChange={(e: SelectChangeEvent<string>) => handleSelect(e)}
                    label="University"
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
                        value={item.university_id}
                        key={`${item.university_name}-${idx + 1}`}
                        sx={{
                          backgroundColor: inputfield(namecolor),
                          color: inputfieldtext(namecolor),
                          '&:hover': {
                            backgroundColor: inputfieldhover(namecolor),
                          },
                        }}
                      >
                        {item.university_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div>
                  {error.university_id_error === true && (
                    <p className="error-text " style={{ color: 'red' }}>
                      <small>Please select a University name.</small>
                    </p>
                  )}
                </div>
              </div>
              <div className="col-md-6 col-12 mb-3">
                <label className="col-form-label">
                  Institute Name<span>*</span>
                </label>

                <TextField
                  autoComplete="off"
                  className="form-control"
                  name="institute_name"
                  onChange={handleChange}
                  value={valueInstitute.institute_name}
                />
                <div>
                  {error.institute_name_error === true && (
                    <p className="error-text " style={{ color: 'red' }}>
                      <small>Please enter a valid Institute name.</small>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="row d-flex justify-content-center">
            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                Mobile Number<span>*</span>
              </label>

              <TextField
                autoComplete="off"
                className="form-control"
                name="mobile_no"
                onChange={handleChange}
                value={valueInstitute.mobile_no}
              />
              <div>
                {error.mobile_no_error === true && (
                  <p className="error-text " style={{ color: 'red' }}>
                    <small>Please enter a valid Mobile Number.</small>
                  </p>
                )}
              </div>
            </div>

            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                Email Id<span>*</span>
              </label>
              <TextField
                autoComplete="off"
                className="form-control"
                name="email_id"
                value={valueInstitute.email_id}
                onChange={handleChange}
              />
              <div>
                {error.email_id_error === true && (
                  <p className="error-text " style={{ color: 'red' }}>
                    <small> Please enter a valid Email Id.</small>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 col-12 mb-3">
              <label className={`col-form-label`}>
                Country<span>*</span>
              </label>
              <CountryDropdown
                classes="form-select custom-dropdown"
                defaultOptionLabel={valueInstitute.country}
                value={valueInstitute.country || ''}
                onChange={(e: string) => handleInputChangecountry(e, 'country')}
              />
              {error.country_error === true && (
                <p className="error-text " style={{ color: 'red' }}>
                  <small>Please select a Country.</small>
                </p>
              )}
            </div>

            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                State<span>*</span>
              </label>
              <RegionDropdown
                data-testid="perStateDropdown"
                classes="form-select custom-dropdown"
                defaultOptionLabel={valueInstitute.state || ''}
                country={valueInstitute.country || ''}
                value={valueInstitute.state || ''}
                // onChange={(val) => setRegion(val)}
                onChange={(e: string) => handleInputChangecountry(e, 'state')}
              />
              {error.state_error === true && (
                <p className="error-text " style={{ color: 'red' }}>
                  <small>Please select a State.</small>
                </p>
              )}
            </div>
          </div>
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                District<span>*</span>
              </label>
              <TextField
                autoComplete="off"
                className="form-control"
                name="district"
                onChange={handleChange}
                value={valueInstitute.district}
              />
              <div>
                {error.district_error === true && (
                  <p className="error-text " style={{ color: 'red' }}>
                    <small> Please enter a valid District name.</small>
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                City<span>*</span>
              </label>

              <TextField
                autoComplete="off"
                className="form-control"
                name="city"
                onChange={handleChange}
                value={valueInstitute.city}
              />
              <div>
                {error.city_error === true && (
                  <p className="error-text " style={{ color: 'red' }}>
                    <small>Please enter a valid City name.</small>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                Address<span>*</span>
              </label>

              <TextField
                autoComplete="off"
                className="form-control"
                name="address"
                onChange={handleChange}
                value={valueInstitute.address}
              />
              <div>
                {error.address_error === true && (
                  <p className="error-text " style={{ color: 'red' }}>
                    <small>Please enter a valid Address.</small>
                  </p>
                )}
              </div>
            </div>
            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                Pincode<span>*</span>
              </label>

              <TextField
                autoComplete="off"
                className="form-control"
                name="pincode"
                onChange={handleChange}
                value={valueInstitute.pincode}
              />
              <div>
                {error.pincode_error === true && (
                  <p className="error-text " style={{ color: 'red' }}>
                    <small> Please enter a valid Pincode.</small>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="row d-flex justify-content-center">
            <div className="col-md-6 col-12 mb-3">
              <label className="col-form-label">
                {' '}
                Document<span></span>
              </label>
              <br />
              <UploadBtn
                label="Upload Documents"
                name="document"
                accept=".pdf, .jpg, .jpeg, .png, .gif"
                handleFileChange={handleFileChange}
              />
              <div>
                {allselectedfiles.length > 0 && (
                  <ul>
                    {allselectedfiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="col-md-6 col-12 mb-3">
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
              <div>
                <ul>{valueInstitute.icon}</ul>
              </div>
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
            <label className="form-check-label" htmlFor="flexCheckDefault">
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
          </div>
          <div className=" d-flex justify-content-center m-2">
            <Button
              variant="contained"
              disabled={CheckTermandcondi}
              onClick={openPopupOtp}
            >
              Submit
            </Button>
          </div>
          <Dialog open={popupTermandCondi} onClose={handleClose}>
            <DialogTitle>{'Terms and Condition'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Content of Gyansetu Terms and Conditions...... will come soon
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <OtpCard open={popupOtpCard} handleOtpClose={() => setPopupOtpCard(false)} handleOtpSuccess={handleSubmit}/>
      </div>
    </div>
  );
};

export default InstituteRegistrationForm;
