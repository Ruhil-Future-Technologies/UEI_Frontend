/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import '../Institute/Institute.scss';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, Typography } from '@mui/material';
import useApi from '../../hooks/useAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUERY_KEYS, QUERY_KEYS_UNIVERSITY } from '../../utils/const';
import { toast } from 'react-toastify';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  InstituteRep0oDTO,
  IUniversity,
  MenuListinter,
} from '../../Components/Table/columns';
import {
  dataaccess,
  fieldIcon,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from '../../utils/helpers';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import NameContext from '../Context/NameContext';

interface IInstituteForm {
  institute_name: string;
  email: string;
  address: string;
  city: string;
  country: string;
  state: string;
  district: string;
  pincode: string;
  entity_id: string;
  phone: string;
  website_url: string;
  university_id?: string;
}

const AddEditInstitute = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const InstituteEntityURL = QUERY_KEYS.ENTITY_LIST;
  const InstituteAddURL = QUERY_KEYS.INSTITUTE_ADD;
  const InstituteEditURL = QUERY_KEYS.INSTITUTE_EDIT;
  const InstituteURL = QUERY_KEYS.GET_INSTITUTES;
  const UniversityURL = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;
  const { getData, postData, putData } = useApi();
  const navigator = useNavigate();
  const { id } = useParams();
  const charPattern = /^[a-zA-Z0-9\s()-]*$/;
  const mobilePattern = /^(?!0{10})[0-9]{10}$/;
  const emailPattern = /\S+@\S+\.\S+/;
  const pincodePattern = /^(?!0{6})[0-9]{6}$/;
  const websiteRegex =
    /^(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/;

  const [dataInstitute, setDataInstitute] = useState<InstituteRep0oDTO[]>([]);
  const initialState = {
    institute_name: '',
    email: '',
    address: '',
    city: '',
    country: '',
    state: '',
    district: '',
    pincode: '',
    entity_id: '',
    phone: '',
    website_url: '',
    university_id: '',
  };
  const [institute, setInstitute] = useState(initialState);
  const [dataEntity, setDataEntity] = useState<any[]>([]);
  const [dataUniversity, setDataUniversity] = useState<IUniversity[]>([]);
  const formRef = useRef<FormikProps<IInstituteForm>>(null);
  const location = useLocation();
  const Menulist: any = localStorage.getItem('menulist1');
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const lastSegment = id
    ? pathSegments[pathSegments.length - 3].toLowerCase()
    : pathSegments[pathSegments.length - 2].toLowerCase();
  const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);
  const [state_col, setstate_col] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedstate, setIsFocusedstate] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownstateRef = useRef<HTMLDivElement>(null);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);

  const isSchoolEntity = (entityId: string | string[]): boolean => {
    const selectedEntity = dataEntity?.find((entity) => entity.id === entityId);
    return selectedEntity?.entity_type?.toLowerCase() === 'school';
  };

  const callAPIfilter = async () => {
    getData(`${InstituteURL}`)
      .then((data: { status: boolean; data: InstituteRep0oDTO[] }) => {
        if (data.status) {
          setDataInstitute(data?.data);
        }
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          // navigate("/")
        }
      });
  };

  useEffect(() => {
    callAPIfilter();
  }, []);
  useEffect(() => {
    setFilteredData(
      dataaccess(Menulist, lastSegment, { urlcheck: '' }, { datatest: '' }),
    );
  }, [Menulist]);

  if (
    (id && !filteredData?.form_data?.is_update) ||
    (!id && !filteredData?.form_data?.is_save)
  ) {
    navigator('/main/Institute');
  }

  const callAPI = async () => {
    getData(`${InstituteEntityURL}`)
      .then((data) => {
        if (data.status) {
          const filteredData = data?.data?.entityes_data.filter(
            (entity: any) => entity.is_active === true,
          );
          setDataEntity(filteredData);
        }

        // setDataEntity(data?.data)
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigator('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
    getData(`${UniversityURL}`)
      .then((data) => {
        if (data.status) {
          setDataUniversity(data?.data?.universities_data);
        }
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigator('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
    if (id) {
      getData(`${InstituteEditURL}${id ? `/${id}` : ''}`)
        .then((data: { status: boolean; data: any }) => {
          if (data.status) {
            setInstitute(data?.data);
          }
        })
        .catch((e) => {
          if (e?.response?.code === 401) {
            navigator('/');
          }
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    }
  };

  useEffect(() => {
    callAPI();
  }, []);
  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleFocusstate = () => setIsFocusedstate(true);
    const handleBlur = (e: FocusEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsFocused(false);
      }
    };
    const handleBlurstate = (e: FocusEvent) => {
      if (
        dropdownstateRef.current &&
        !dropdownstateRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsFocusedstate(false);
      }
    };

    const currentDropdown = dropdownRef.current;
    console.log('currentDropdown', currentDropdown);

    if (currentDropdown) {
      currentDropdown.addEventListener('focus', handleFocus as EventListener);
      currentDropdown.addEventListener('blur', handleBlur as EventListener);
    }
    const currentDropdownstate = dropdownstateRef.current;
    console.log('currentDropdownstate', currentDropdownstate);
    if (currentDropdownstate) {
      currentDropdownstate.addEventListener(
        'focus',
        handleFocusstate as EventListener,
      );
      currentDropdownstate.addEventListener(
        'blur',
        handleBlurstate as EventListener,
      );
    }

    return () => {
      if (currentDropdown) {
        currentDropdown.removeEventListener(
          'focus',
          handleFocus as EventListener,
        );
        currentDropdown.removeEventListener(
          'blur',
          handleBlur as EventListener,
        );
      }
      if (currentDropdownstate) {
        currentDropdownstate.removeEventListener(
          'focus',
          handleFocusstate as EventListener,
        );
        currentDropdownstate.removeEventListener(
          'blur',
          handleBlurstate as EventListener,
        );
      }
    };
  }, []);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
    fieldName: string,
  ) => {
    if (fieldName === 'entity_id') {
      const selectedEntity = dataEntity.find(
        (entity) => entity.id === e.target.value,
      );
      const isSchoolEntity = selectedEntity?.entity_type === 'school';

      if (isSchoolEntity) {
        setInstitute((prev) => ({
          ...prev,

          university_id: '',
        }));

        formRef?.current?.setFieldValue('university_id', '');
      }
    }
    setInstitute((prevInstitute) => {
      return {
        ...prevInstitute,
        [e.target.name]: e.target.value,
      };
    });
    formRef?.current?.setFieldValue(fieldName, e.target.value);
    await formRef?.current?.validateField(fieldName);
    if (
      formRef?.current?.errors?.[fieldName as keyof IInstituteForm] !==
      undefined
    ) {
      formRef?.current?.setFieldError(
        fieldName,
        formRef?.current?.errors?.[fieldName as keyof IInstituteForm],
      );
      formRef?.current?.setFieldTouched(fieldName, true);
    }
  };

  const handleInputChangecountry = async (
    value: string,
    addressType: string,
    name: string,
  ) => {
    if (addressType === 'current_address') {
      if (name === 'country') {
        setInstitute((prevInstitute) => {
          return {
            ...prevInstitute,
            ['country']: value,
          };
        });
        setInstitute((prevInstitute) => {
          return {
            ...prevInstitute,
            ['state']: '',
          };
        });
        setstate_col(true);
      } else if (name === 'state') {
        setInstitute((prevInstitute) => {
          return {
            ...prevInstitute,
            ['state']: value,
          };
        });
        setstate_col(false);
      } else {
        return;
      }
    }
  };

  const handleSubmit = async (
    instituteData: IInstituteForm,
    { resetForm }: FormikHelpers<IInstituteForm>,
  ) => {
    const filteredData = { ...instituteData };
    if (filteredData.university_id === '') {
      delete filteredData.university_id;
    }
    const isDataUnchanged = Object.keys(filteredData).every(
      (key) =>
        filteredData[key as keyof IInstituteForm] ===
        institute[key as keyof IInstituteForm],
    );
    if (id) {
      if (isDataUnchanged) {
        return; // Skip API call if no changes
      }
      putData(`${InstituteEditURL}/${id}`, filteredData)
        .then((data: { status: boolean; message: string }) => {
          if (data.status) {
            navigator('/main/Institute');
            toast.success('Institute updated successfully', {
              hideProgressBar: true,
              theme: 'colored',
            });
          } else {
            toast.error(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        })
        .catch((e) => {
          if (e?.response?.code === 401) {
            toast.error(e?.response.data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
            navigator('/');
          }
          toast.error(e?.response.data.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    } else {
      const newInstituteData = {
        ...filteredData,
        is_verified: 'True', // Add this key only in the else block
      };
      postData(`${InstituteAddURL}`, newInstituteData)
        .then((data: { status: boolean; message: string }) => {
          if (data.status) {
            // navigator('/main/Institute')
            toast.success('Institute saved successfully', {
              hideProgressBar: true,
              theme: 'colored',
            });
            resetForm({ values: initialState });
            setInstitute((prevInstitute) => {
              return {
                ...prevInstitute,
                ['state']: '',
                ['country']: '',
                ['university_id']: '',
                ['entity_id']: '',
              };
            });
          } else {
            toast.error(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        })
        .catch((e) => {
          if (e?.response?.status === 401) {
            toast.error(e?.response.data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
            navigator('/');
          }
          toast.error(e?.response.data.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    }
  };
  let instituteSchema;
  {
    if (id) {
      instituteSchema = Yup.object().shape({
        institute_name: Yup.string()
          .required('Please enter Institute name')
          .test(
            'not-whitespace',
            'Please enter a valid Institute name; whitespace is not allowed.',
            (value: any) => value && value?.trim().length > 0,
          )
          .matches(
            charPattern,
            'Please enter a valid Institute name only characters allowed.',
          )
          .test('unique', 'Institute name already exists', function (value) {
            if (!value) return true;

            // Check if the value matches the current institute name
            if (
              value.toLowerCase() === institute.institute_name.toLowerCase()
            ) {
              return true;
            }

            // Check for uniqueness against dataInstitute
            const exists = dataInstitute.some(
              (inst) =>
                inst.institute_name &&
                inst.institute_name.toLowerCase() === value.toLowerCase(),
            );

            return !exists;
          }),

        email: Yup.string()
          .required('Please enter Email id')
          .matches(emailPattern, 'Please enter a valid Email format.')
          .test('unique', 'Email already exists', function (value) {
            if (!value) return true;

            // Check if the value matches the current institute name
            if (value.toLowerCase() === institute?.email.toLowerCase()) {
              return true;
            }

            // Check for uniqueness against dataInstitute
            const exists = dataInstitute?.some(
              (inst) =>
                inst?.email &&
                inst?.email?.toLowerCase() === value?.toLowerCase(),
            );

            return !exists;
          }),

        address: Yup.string()
          .required('Please enter Address')
          .test(
            'not-whitespace',
            'Please enter a valid Address; whitespace is not allowed.',
            (value: any) => value && value?.trim().length > 0,
          ),
        // .matches(addressPattern, 'Please enter a valid Address only characters allowed.'),
        city: Yup.string()
          .required('Please enter City name')
          .test(
            'not-whitespace',
            'Please enter a valid City; whitespace is not allowed.',
            (value: any) => value && value?.trim().length > 0,
          )
          .matches(
            charPattern,
            'Please enter a valid City name only characters allowed.',
          ),
        country: Yup.string().required('Please enter Country name'),
        // .matches(
        //   charPattern,
        //   'Please enter a valid Contry name only characters allowed.',
        // ),
        state: Yup.string().required('Please enter State'),
        // .matches(
        //   charPattern,
        //   'Please enter a valid State name only characters allowed.',
        // ),
        district: Yup.string()
          .required('Please enter District name')
          .test(
            'not-whitespace',
            'Please enter a valid District; whitespace is not allowed.',
            (value: any) => value && value?.trim().length > 0,
          )
          .matches(
            charPattern,
            'Please enter a valid District name only characters allowed.',
          ),
        pincode: Yup.string()
          .required('Please enter Pincode')
          .matches(pincodePattern, 'Please enter a valid 6-digit pincode.'),
        entity_id: Yup.string().required('Please select Entity'),
        university_id: Yup.string().when('entity_id', {
          is: (entity_id: string) => {
            const selectedEntity = dataEntity.find(
              (entity) => entity.id === Number(entity_id),
            );
            return selectedEntity?.entity_type !== 'school';
          },
          then: (schema) => schema.required('Please select University'),
          otherwise: (schema) => schema.notRequired(),
        }),
        phone: Yup.string()
          .required('Please enter Mobile number')
          .matches(
            mobilePattern,
            'Please enter a valid mobile number.It must be 10 digits long.',
          )
          .test('unique', 'Mobile number already exists', function (value) {
            if (!value) return true;

            // Check if the value matches the current institute name
            if (value?.toLowerCase() === institute?.phone?.toLowerCase()) {
              return true;
            }

            // Check for uniqueness against dataInstitute
            const exists = dataInstitute?.some(
              (inst) =>
                inst?.phone &&
                inst?.phone?.toLowerCase() === value?.toLowerCase(),
            );

            return !exists;
          }),

        website_url: Yup.string()
          .nullable()
          .test(
            'is-valid-url',
            'Please enter a valid URL format (e.g., https://example.com).',
            (value) => {
              if (!value) return true; // Allow empty values
              return websiteRegex.test(value); // Validate only if a value is present
            },
          ),
      });
    } else {
      instituteSchema = Yup.object().shape({
        institute_name: Yup.string()
          .required('Please enter Institute name')
          .test(
            'not-whitespace',
            'Please enter a valid Institute name; whitespace is not allowed.',
            (value: any) => value && value?.trim().length > 0,
          )
          .matches(
            charPattern,
            'Please enter a valid Institute name only characters allowed.',
          )
          .test('unique', 'Institute name already exists', (value) => {
            if (!value) return true;
            const exists = dataInstitute.some(
              (inst) =>
                inst.institute_name &&
                inst.institute_name.toLowerCase() === value.toLowerCase(),
            );
            return !exists;
          }),
        email: Yup.string()
          .required('Please enter Email id')
          .matches(emailPattern, 'Please enter a valid Email format.')
          .test('unique', 'Email already exists', (value) => {
            if (!value) return true;
            const exists = dataInstitute.some(
              (inst) =>
                inst?.email &&
                inst?.email.toLowerCase() === value?.toLowerCase(),
            );
            return !exists;
          }),
        address: Yup.string()
          .required('Please enter Address')
          .test(
            'not-whitespace',
            'Please enter a valid Address; whitespace is not allowed.',
            (value: any) => value && value?.trim().length > 0,
          ),
        // .matches(addressPattern, 'Please enter a valid Address only characters allowed.'),
        city: Yup.string()
          .required('Please enter City name')
          .test(
            'not-whitespace',
            'Please enter a valid City; whitespace is not allowed.',
            (value: any) => value && value?.trim().length > 0,
          )
          .matches(
            charPattern,
            'Please enter a valid City name only characters allowed.',
          ),
        country: Yup.string().required('Please enter Country name'),
        // .matches(
        //   charPattern,
        //   'Please enter a valid Contry name only characters allowed.',
        // ),
        state: Yup.string().required('Please enter State name'),
        // .matches(
        //   charPattern,
        //   'Please enter a valid State name only characters allowed.',
        // ),
        district: Yup.string()
          .required('Please enter District name')
          .test(
            'not-whitespace',
            'Please enter a valid District; whitespace is not allowed.',
            (value: any) => value && value?.trim().length > 0,
          )
          .matches(
            charPattern,
            'Please enter a valid District name only characters allowed.',
          ),
        pincode: Yup.string()
          .required('Please enter Pincode')
          .matches(pincodePattern, 'Please enter a valid 6-digit pincode.'),
        entity_id: Yup.string().required('Please select Entity'),
        university_id: Yup.string().when('entity_id', {
          is: (entity_id: string) => {
            const selectedEntity = dataEntity.find(
              (entity) => entity.id === Number(entity_id),
            );
            return selectedEntity?.entity_type !== 'school';
          },
          then: (schema) => schema.required('Please select University'),
          otherwise: (schema) => schema.notRequired(),
        }),
        phone: Yup.string()
          .required('Please enter Mobile number')
          .matches(
            mobilePattern,
            'Please enter a valid mobile number.It must be 10 digits long.',
          )
          .test('unique', 'Mobile number already exists', (value) => {
            if (!value) return true;
            const exists = dataInstitute.some(
              (inst) =>
                inst?.phone &&
                inst?.phone.toLowerCase() === value?.toLowerCase(),
            );
            return !exists;
          }),
        website_url: Yup.string()
          .nullable()
          .test(
            'is-valid-url',
            'Please enter a valid URL format (e.g., https://example.com).',
            (value) => {
              if (!value) return true; // Allow empty values
              return websiteRegex.test(value); // Validate only if a value is present
            },
          ),
      });
    }
  }

  const handleCountryClick = () => {
    setIsCountryOpen(true);
  };
  const handleCountryBlur = () => {
    setIsCountryOpen(false);
  };
  const handleStateClick = () => {
    setIsStateOpen(true);
  };
  const handleStateBlur = () => {
    setIsStateOpen(false);
  };

  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="card p-lg-3">
          <div className="card-body">
            <Typography variant="h6">
              <div className="main_title">{id ? 'Edit' : 'Add'} Institute</div>
            </Typography>
            <Formik
              // onSubmit={(formData) => handleSubmit(formData)}
              onSubmit={(formData, formikHelpers) =>
                handleSubmit(formData, formikHelpers)
              }
              initialValues={{
                institute_name: institute?.institute_name,
                email: institute?.email,
                address: institute?.address,
                city: institute?.city,
                country: institute?.country,
                state: institute?.state,
                district: institute?.district,
                pincode: institute?.pincode,
                entity_id: institute?.entity_id,
                phone: institute?.phone,
                website_url: institute?.website_url,
                university_id: institute?.university_id,
              }}
              enableReinitialize
              validationSchema={instituteSchema}
              innerRef={formRef}
            >
              {({
                errors,
                values,
                touched,
                setFieldValue,
                setFieldTouched,

                isValid,
                dirty,
              }) => (
                <Form>
                  <div className="row gy-4 mt-0">
                    <div className="col-md-4">
                      <div className="form_field_wrapper">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Entity *
                          </InputLabel>
                          <Select
                            onChange={(e: SelectChangeEvent<string>) =>
                              handleChange(e, 'entity_id')
                            }
                            label="Entity"
                            name="entity_id"
                            value={values?.entity_id}
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
                        {touched?.entity_id && errors?.entity_id ? (
                          <p style={{ color: 'red' }}>{errors?.entity_id}</p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form_field_wrapper">
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            University *
                          </InputLabel>
                          <Select
                            onChange={(e: SelectChangeEvent<string>) =>
                              handleChange(e, 'entity_id')
                            }
                            label="University"
                            name="university_id"
                            value={values?.university_id}
                            variant="outlined"
                            disabled={isSchoolEntity(values?.entity_id)}
                            style={{
                              backgroundColor: isSchoolEntity(values?.entity_id)
                                ? '#f0f0f0'
                                : inputfield(namecolor),
                              color: isSchoolEntity(values?.entity_id)
                                ? '#999999'
                                : inputfieldtext(namecolor),
                              border: isSchoolEntity(values?.entity_id)
                                ? '1px solid #d0d0d0'
                                : undefined,
                            }}
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
                                    backgroundColor: inputfieldhover(namecolor),
                                  },
                                }}
                              >
                                {item.university_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched?.university_id && errors?.university_id ? (
                          <p style={{ color: 'red' }}>
                            {errors?.university_id}
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>

                    <div
                      className="floating-label-container col-md-4"
                      ref={dropdownRef}
                    >
                      <label
                        className={`floating-label ${isFocused || values?.country || isCountryOpen ? 'focused' : 'focusedempty'}`}
                      >
                        <InputLabel>
                          Country <span>*</span>
                        </InputLabel>
                      </label>
                      <div
                        className="form_field_wrapper"
                        // onClick={() => setIsCountryOpen((prev) => !prev)}
                        onClick={handleCountryClick}
                        onBlur={handleCountryBlur} // Detect blur event (when the dropdown loses focus)
                        tabIndex={-1}
                      >
                        <CountryDropdown
                          classes="form-control p-3 pt-1 pb-1 custom-dropdown"
                          defaultOptionLabel={values?.country || ''}
                          value={values?.country || ''}
                          onChange={(e) =>
                            handleInputChangecountry(
                              e,
                              'current_address',
                              'country',
                            )
                          }
                        />
                        {/* {contry_col && <p style={{ color: "red" }}>Please enter Country Name.</p>} */}
                        {touched?.country && errors?.country ? (
                          <p style={{ color: 'red' }}>
                            Please enter Country name.
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>

                    <div
                      className="floating-label-container col-md-4 mt-4"
                      ref={dropdownstateRef}
                    >
                      <label
                        className={`floating-label ${isFocusedstate || values?.state || isStateOpen ? 'focused' : 'focusedempty'}`}
                      >
                        <InputLabel>
                          State <span>*</span>
                        </InputLabel>
                      </label>
                      <div
                        className="form_field_wrapper"
                        //  onClick={() => setIsStateOpen((prev) => !prev)}
                        onClick={handleStateClick}
                        onBlur={handleStateBlur} // Detect blur event (when the dropdown loses focus)
                        tabIndex={-1}
                      >
                        <RegionDropdown
                          classes="form-control p-3 pt-1 pb-1 custom-dropdown"
                          defaultOptionLabel={values?.state || ''}
                          country={values?.country || ''}
                          value={values?.state || ''}
                          // onChange={(val) => setRegion(val)}
                          onChange={(e: string) =>
                            handleInputChangecountry(
                              e,
                              'current_address',
                              'state',
                            )
                          }
                        />
                        <div>
                          {' '}
                          {state_col && (
                            <p style={{ color: 'red' }}>
                              Please enter a valid state Name.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form_field_wrapper">
                        <Field
                          inputProps={{ className: 'institute-name' }}
                          fullWidth
                          component={TextField}
                          type="text"
                          name="institute_name"
                          label={
                            isSchoolEntity(values?.entity_id)
                              ? 'School Name *'
                              : 'Institute name *'
                          }
                          value={values?.institute_name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'institute_name')
                          }
                        />
                        {touched?.institute_name && errors?.institute_name ? (
                          <p style={{ color: 'red' }}>
                            {errors?.institute_name}
                          </p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form_field_wrapper">
                        <Field
                          inputProps={{ className: 'address' }}
                          fullWidth
                          component={TextField}
                          label="Address *"
                          name="address"
                          value={values?.address}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'address')
                          }
                        />
                        {touched?.address && errors?.address ? (
                          <p style={{ color: 'red' }}>{errors?.address}</p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form_field_wrapper">
                        <Field
                          inputProps={{ className: 'email' }}
                          fullWidth
                          component={TextField}
                          type="email"
                          label="Email Id*"
                          name="email"
                          value={values?.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'email')
                          }
                        />
                        {touched?.email && errors?.email ? (
                          <p style={{ color: 'red' }}>{errors?.email}</p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form_field_wrapper">
                        <Field
                          inputProps={{ className: 'mobile' }}
                          component={TextField}
                          type="text"
                          name="phone"
                          label="Mobile Number *"
                          value={values?.phone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'phone')
                          }
                        />
                        {touched?.phone && errors?.phone ? (
                          <p style={{ color: 'red' }}>{errors?.phone}</p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form_field_wrapper">
                        <Field
                          inputProps={{ className: 'city' }}
                          component={TextField}
                          label="City *"
                          name="city"
                          value={values?.city}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'city')
                          }
                        />
                        {touched?.city && errors?.city ? (
                          <p style={{ color: 'red' }}>{errors?.city}</p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form_field_wrapper">
                        <Field
                          inputProps={{ className: 'district' }}
                          component={TextField}
                          label="District *"
                          name="district"
                          value={values?.district}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'district')
                          }
                        />
                        {touched?.district && errors?.district ? (
                          <p style={{ color: 'red' }}>{errors?.district}</p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form_field_wrapper">
                        <Field
                          inputProps={{ className: 'pincode' }}
                          component={TextField}
                          label="Pincode *"
                          name="pincode"
                          value={values?.pincode}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange(e, 'pincode')
                          }
                        />
                        {touched?.pincode && errors?.pincode ? (
                          <p style={{ color: 'red' }}>{errors?.pincode}</p>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form_field_wrapper">
                        <Field
                          inputProps={{ className: 'website' }}
                          component={TextField}
                          label="Website"
                          name="website_url"
                          value={values?.website_url}
                          // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          //   handleChange(e, 'website_url')
                          // }
                          onChange={(e: any) => {
                            handleChange(e, 'website_url');
                            setFieldValue('website_url', e?.target?.value);
                            setFieldTouched('website_url', true, false); // Manually trigger validation
                          }}
                        />
                        {errors?.website_url && (
                          <p style={{ color: 'red' }}>{errors?.website_url}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!dirty || !isValid}
                    className="btn btn-primary mainbutton mt-4"
                  >
                    {id ? 'Update' : 'Save'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditInstitute;
