/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useApi from '../../../hooks/useAPI';
// import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
// import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
// import maleImage from '../../../assets/img/avatars/male.png';
import { IEntity, IUniversity } from '../../../Components/Table/columns';
import { QUERY_KEYS, QUERY_KEYS_UNIVERSITY } from '../../../utils/const';
import {
  inputfield,
  inputfieldtext,
  fieldIcon,
  inputfieldhover,
} from '../../../utils/helpers';
import NameContext from '../../Context/NameContext';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

interface Institute {
  institute_name: string;
  university_id: string;
  school_name: string;
  entity_id: string;
  email: string;
  phone: string;
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
const InstitutionProfile = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const instituttionLoginId = localStorage.getItem("user_uuid");
  const { getData } = useApi();

  const InstituteEntityURL = QUERY_KEYS.ENTITY_LIST;
  const UniversityURL = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;

  const [website_error, setWebsite_error] = useState<boolean>(false);
  const [institute_name_error, setInstitute_name_error] =
    useState<boolean>(false);
  const [mobile_no_error, setMobile_no_error] = useState<boolean>(false);
  const [pincode_error, setPincode_error] = useState<boolean>(false);
  const [address_error, setAddress_error] = useState<boolean>(false);
  const [district_error, setDistrict_error] = useState<boolean>(false);
  const [city_error, setCity_error] = useState<boolean>(false);
  // const [state_error, setState_error] = useState<boolean>(false);
  // const [country_error, setCountry_error] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState('');
  //const [filePreview, setFilePreview] = useState(null);
  //const [documents, setDocuments] = useState<File[]>([]);
  const [documentsDisplay, setdocumentsDisplay] = useState<string[]>([]);
  const [entityData, setEntityData] = useState<IEntity[]>([])
  const [universityData, setUniversityData] = useState<IUniversity[]>([]);
 // const [instituteId, setInstituteId] = useState('');
  const [instituteInfo, setInstituteInfo] = useState<Institute>({
    institute_name: '',
    university_id: '',
    school_name: '',
    entity_id: '',
    email: '',
    phone: '',
    website_url: '',
    country: '',
    state: '',
    city: '',
    district: '',
    address: '',
    pincode: '',
    icon: '',
    document: [],
  });
  useEffect(() => {
    getEntity();
    getInstitutionInfo();
    getUniversity();
  }, [])
  const getEntity = () => {
    getData(`${InstituteEntityURL}`)
      .then((data) => {
        if (data?.status) {
          const filteredData = data?.data?.entityes_data.filter(
            (entity: any) => entity.is_active === true,
          );
          setEntityData(filteredData);
        }

      })
      .catch((e) => {

        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  const getUniversity = () => {
    getData(`${UniversityURL}`)
      .then((data) => {
        if (data.status) {
          setUniversityData(data?.data?.universities_data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  const getInstitutionInfo = async () => {
    try {
      await getData(`institute/edit/${instituttionLoginId}`).then((response) => {
        if (response?.status) {
          setInstituteInfo(response?.data);
          //setInstituteId(response.data.id);
          if (response?.data.university_id === '' || response?.data.university_id === null) {
            setSelectedEntity("School");
          } else {
            setSelectedEntity("College");
          }
          if (response?.data?.documents?.length > 0) {
            setdocumentsDisplay(response?.data.documents)
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { files } = event.target;
  //   const formData = new FormData();

  //   if (files && files[0]) {
  //     const file: any = files[0];
  //     if (file.size > 3 * 1024 * 1024) {
  //       return;
  //     }
  //     if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
  //       return;
  //     }
  //     const reader: any = new FileReader();
  //     reader.onloadend = () => {
  //       setFilePreview(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //     formData.append('file', file);
  //     postFileData(`${'upload_file/upload'}`, formData)
  //       .then((data: any) => {
  //         if (data?.status) {
  //           toast.success(data?.message, {
  //             hideProgressBar: true,
  //             theme: 'colored',
  //             position: 'top-center',
  //           });
  //         } else if (data?.code) {
  //           toast.error(data?.message, {
  //             hideProgressBar: true,
  //             theme: 'colored',
  //             position: 'top-center',
  //           });
  //         } else {
  //           toast.error(data?.message, {
  //             hideProgressBar: true,
  //             theme: 'colored',
  //             position: 'top-center',
  //           });
  //         }
  //       })
  //       .catch((e: any) => {
  //         toast.error(e?.message, {
  //           hideProgressBar: true,
  //           theme: 'colored',
  //           position: 'top-center',
  //         });
  //       });
  //   }
  // };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && event.target.name !== 'icon') {
      //const filesArray = Array.from(files); // Convert FileList to an array

      // setDocuments((prevFiles) => [
      //   ...prevFiles, // Keep previously selected files
      //   ...filesArray, // Add newly selected files
      // ]);
    } else {
      // setLogo(files);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      name === 'website' &&
      !/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]*)*(\/)?$/.test(
        value,
      )
    ) {
      setWebsite_error(true);
    } else {
      setWebsite_error(false);
    }
    if (
      name === 'institution_name' &&
      !/^(?=.*[a-zA-Z .,&'()-])[a-zA-Z0-9 .,&'()-]+$/.test(value)
    ) {
      setInstitute_name_error(true);
    } else {
      setInstitute_name_error(false);
    }
    if (name === 'mobile_no' && !/^(?!0{10})[0-9]{10}$/.test(value)) {
      setMobile_no_error(true);
    } else {
      setMobile_no_error(false);
    }
    if (name === 'pincode' && !/^(?!0{6})[0-9]{6}$/.test(value)) {
      setPincode_error(true);
    } else {
      setPincode_error(false);
    }
    if (
      name === 'address' &&
      !/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(value)
    ) {
      setAddress_error(true);
    } else {
      setAddress_error(false);
    }
    if (
      name === 'district' &&
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value)
    ) {
      setDistrict_error(true);
    } else {
      setDistrict_error(false);
    }
    if (
      name === 'city' &&
      !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value)
    ) {
      setCity_error(true);
    } else {
      setCity_error(false);
    }
    setInstituteInfo((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleSelect = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    console.log(name, value);
  };
  const handleInputChangecountry = (val: string, name: string) => {
    setInstituteInfo({ ...instituteInfo, [name]: val });
    if (name === 'country') {
      setInstituteInfo((prevState) => ({ ...prevState, ['state']: '' }));
    }
  };
  const handleDocumentClick = (url: string) => {
    window.open(url, '_blank');
  };

  // const handleSubmit = () => {
  //   // if (
  //   //   !/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]*)*(\/)?$/.test(
  //   //     instituteInfo.website_url,
  //   //   )
  //   // ) {
  //   //   setWebsite_error(true);
  //   //   return;
  //   // }

  //   if (
  //     !/^(?=.*[a-zA-Z .,'&-])[a-zA-Z0-9 .,'&-]+$/.test(instituteInfo.address)
  //   ) {
  //     setAddress_error(true);
  //     return;
  //   }
  //   if (
  //     !/^(?=.*[a-zA-Z .,&'()-])[a-zA-Z0-9 .,&'()-]+$/.test(
  //       instituteInfo.institute_name,
  //     )
  //   ) {
  //     setInstitute_name_error(true);
  //     return;
  //   }
  //   if (!/^(?!0{10})[0-9]{10}$/.test(instituteInfo.phone)) {
  //     setMobile_no_error(true);
  //     return;
  //   }
  //   if (
  //     !instituteInfo.pincode ||
  //     !/^(?!0{6})[0-9]{6}$/.test(instituteInfo.pincode)
  //   ) {
  //     setPincode_error(true);
  //     return;
  //   }
  //   if (
  //     !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
  //       instituteInfo.district.trim(),
  //     )
  //   ) {
  //     setDistrict_error(true);
  //     return;
  //   }
  //   if (
  //     !/^(?!([a-zA-Z])\1{2,})[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(
  //       instituteInfo.city.trim(),
  //     )
  //   ) {
  //     setCity_error(true);
  //     return;
  //   }
  //   if (instituteInfo.state === '') {
  //     setState_error(true);
  //     return;
  //   }
  //   if (instituteInfo.country === '') {
  //     setCountry_error(true);
  //     return;
  //   }

  //   const payload = {
  //     institute_name: instituteInfo.institute_name,
  //     email: instituteInfo.email,
  //     address: instituteInfo.address,
  //     city: instituteInfo.city,
  //     country: instituteInfo.country,
  //     state: instituteInfo.state,
  //     district: instituteInfo.district,
  //     pincode: instituteInfo.pincode,
  //     entity_id: instituteInfo.entity_id,
  //     phone: instituteInfo.phone,
  //     website_url: instituteInfo.website_url,
  //     ...(selectedEntity === "College" && { university_id: instituteInfo.university_id }),
  //     documents: documents,
  //   }
  //   try {
     
  //     putData(`/institute/edit/${instituteId}`, payload).then((reaponse) => {
  //       if (reaponse.status) {
  //         toast.success('Profile updated successfully', {
  //           hideProgressBar: true,
  //           theme: 'colored',
  //           position: 'top-center',
  //         });
  //         getInstitutionInfo()
  //       } else {
  //         toast.error('Failed to update profile', {
  //           hideProgressBar: true,
  //           theme: 'colored',
  //           position: 'top-center',
  //         });
  //       }
  //     })

  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  return (
    <>
      <div className="main-wrapper">
        <div className="main-content">
          <div className="container mb-5">
            <div className="row align-items-center">
              <div className="col-lg-6 px-0">

                <h4 className="fs-1 fw-bold">
                  My <span style={{ color: '#9943EC' }}> Profile </span>
                </h4>
              </div>
              <div className="row">
                <div className="card rounded-5 mt-3 bg-transparent-mb">
                  <div className="card-body p-0">
                    <div className="row">
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
                            disabled
                            value={instituteInfo.entity_id || ''}
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
                            {entityData.map((item, idx) => (
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
                          Website<span></span>
                        </label>
                        <TextField
                          autoComplete="off"
                          className="form-control"
                          name="website_url"
                          value={instituteInfo.website_url}
                          onChange={handleChange}
                        />
                        <div>
                          {website_error === true && (
                            <p className="error-text" style={{ color: 'red' }}>
                              <small>Please enter a valid Website .</small>
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
                            name="institution_name"
                            value={instituteInfo.institute_name}
                            onChange={handleChange}
                          />
                          <div>
                            {institute_name_error === true && (
                              <p className="error-text " style={{ color: 'red' }}>
                                <small>
                                  Please enter a valid school name
                                </small>
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
                              value={instituteInfo?.university_id || ''}
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
                              {universityData?.map((item, idx) => (
                                <MenuItem
                                  value={item.id}
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
                            {instituteInfo.university_id === '' && (
                              <p className="error-text " style={{ color: 'red' }}>
                                <small>Please select a university name.</small>
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
                            name="institution_name"
                            value={instituteInfo.institute_name}
                            onChange={handleChange}
                          />
                          <div>
                            {institute_name_error === true && (
                              <p
                                className="error-text "
                                style={{ color: 'red' }}
                              >
                                <small>
                                  Please enter a valid institute name.
                                </small>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="row d-flex justify-content-center">
                      <div className="col-md-6 col-12 mb-3">
                        <label className="col-form-label">
                          Mobile No<span>*</span>
                        </label>

                        <TextField
                          autoComplete="off"
                          className="form-control"
                          name="mobile_no"
                          value={instituteInfo.phone}
                          onChange={handleChange}
                        />
                        <div>
                          {mobile_no_error === true && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small>Please enter a valid mobile number.</small>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6 col-12 mb-3">
                        <label className="col-form-label">
                          Email Id<span>*</span>
                        </label>
                        <TextField
                          disabled
                          autoComplete="off"
                          className="form-control"
                          name="email_id"
                          value={instituteInfo.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row d-flex justify-content-center">
                      <div className="col-md-6 col-12 mb-3">
                        <label className={`col-form-label`}>
                          Country<span>*</span>
                        </label>
                        <CountryDropdown
                          classes="form-select custom-dropdown"
                          defaultOptionLabel={instituteInfo.country || ''}
                          value={instituteInfo.country || ''}
                          onChange={(e: string) =>
                            handleInputChangecountry(e, 'country')
                          }
                        />
                        {/* {country_error && (
                          <p className="error-text " style={{ color: 'red' }}>
                            <small>Please select a Country.</small>
                          </p>
                        )} */}
                      </div>

                      <div className="col-md-6 col-12 mb-3">
                        <label className="col-form-label">
                          State<span>*</span>
                        </label>
                        <RegionDropdown
                          data-testid="perStateDropdown"
                          classes="form-select custom-dropdown"
                          defaultOptionLabel={instituteInfo.state || ''}
                          country={instituteInfo.country || ''}
                          value={instituteInfo.state || ''}
                          // onChange={(val) => setRegion(val)}
                          onChange={(e: string) =>
                            handleInputChangecountry(e, 'state')
                          }
                        />
                        {/* {state_error && (
                          <p className="error-text " style={{ color: 'red' }}>
                            <small>Please select a state.</small>
                          </p>
                        )} */}
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
                          value={instituteInfo.district}
                        />
                        <div>
                          {district_error === true && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small>
                                {' '}
                                Please enter a valid district name.
                              </small>
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
                          value={instituteInfo.city}
                        />
                        <div>
                          {city_error === true && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small>Please enter a valid city name.</small>
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
                          value={instituteInfo.address}
                        />
                        <div>
                          {address_error === true && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small>Please enter a valid address</small>
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
                          value={instituteInfo.pincode}
                        />
                        <div>
                          {pincode_error === true && (
                            <p className="error-text " style={{ color: 'red' }}>
                              <small> Please enter a valid Pincode.</small>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 pb-3 form_field_wrapper">
                        <label className="col-form-label">
                          Documents <span>*</span>
                        </label>
                        <input
                          type="file"
                          name="document"
                          accept=".pdf, .jpg, .jpeg, .png, .gif"
                          multiple
                          onChange={handleFileChange}
                        />
                        <List>
                          {documentsDisplay.length > 0 ? (
                            documentsDisplay?.map((doc) => (
                              <ListItem
                                key={doc}
                                button
                                onClick={() => handleDocumentClick(doc)}
                              >
                                <ListItemText primary={doc} />
                              </ListItem>
                            ))
                          ) : (
                            <Typography
                              variant="body2"
                              color="textSecondary"
                              style={{ marginTop: '10px' }}
                            >
                              No documents found.
                            </Typography>
                          )}
                        </List>
                      </div>
                      {/* <div className="col-lg-12">
                        <div className="d-flex flex-wrap align-items-center gap-1">
                          <div className="image-container">
                            {!filePreview ? (
                              <>
                                <div className="image-box">
                                  <input
                                    type="checkbox"
                                    className="image-checkbox"
                                  />
                                  <img src={maleImage} alt="male" />
                                  <span className="check-icon">
                                    <CheckCircleOutlinedIcon />
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="image-box">
                                <img
                                  src={filePreview}
                                  alt="Uploaded Preview"
                                  style={{ marginTop: '10px' }}
                                />
                              </div>
                            )}
                          </div>
                          <label htmlFor="file">
                            <div className="upload-profile-image" role="button">
                              <UploadOutlinedIcon />
                              <input
                                data-testid="profile_image"
                                type="file"
                                id="file"
                                name="pic_path"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  handleImageChange(e);
                                }}
                              />
                              Upload Your Picture
                            </div>
                          </label>
                        </div>
                      </div> */}
                    </div>
                    {/* <div className="d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSubmit}
                      >
                        Update
                      </button>
                    </div> */}
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

export default InstitutionProfile;
