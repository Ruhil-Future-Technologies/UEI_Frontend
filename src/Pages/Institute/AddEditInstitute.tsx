import React, { useContext, useEffect, useRef, useState } from 'react'
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
import { IEntity, InstituteRep0oDTO, IUniversity, MenuListinter } from '../../Components/Table/columns';
import { dataaccess, inputfield, inputfieldhover, inputfieldselect, inputfieldtext, inputfieldtextselect } from '../../utils/helpers';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import NameContext from '../Context/NameContext';

interface IInstituteForm {
    institution_name: string
    email_id: string
    address: string
    city: string
    country: string
    state: string
    district: string
    pincode: string
    entity_id: string
    mobile_no: string
    website_url: string
    university_id: string
}

const AddEditInstitute = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const InstituteEntityURL = QUERY_KEYS.ENTITY_LIST;
    const InstituteAddURL = QUERY_KEYS.INSTITUTE_ADD;
    const InstituteEditURL = QUERY_KEYS.INSTITUTE_EDIT;
    const InstituteURL = QUERY_KEYS.GET_INSTITUTES;
    const UniversityURL = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;
    const { getData, postData, putData } = useApi()
    const navigator = useNavigate()
    const { id } = useParams();
    const charPattern = /^[a-zA-Z\s]*$/;
    const mobilePattern = /^\d{10}$/;
    const emailPattern = /\S+@\S+\.\S+/;
    // const pincodePattern = /^\d+$/;
    const pincodePattern = /^\d{6}$/;
    // const websitePattern = /^[\w\s.,@#$%^&*()\-+=[\]{}|\\;:'"/?]+$/;
    const addressPattern = /^[\w\s,]+$/;

    const [dataInstitute, setDataInstitute] = useState<InstituteRep0oDTO[]>([])


    const callAPIfilter = async () => {
        getData(`${InstituteURL}`).then((data: { data: InstituteRep0oDTO[] }) => {
            if (data.data) {
                setDataInstitute(data?.data)
            }
        }).catch(e => {
            if (e?.response?.status === 401) {
                // navigate("/")
            }
            
        });
    }

    useEffect(() => {
        callAPIfilter()
    }, [])

    const initialState = {
        institution_name: "",
        email_id: "",
        address: "",
        city: "",
        country: "",
        state: "",
        district: "",
        pincode: "",
        entity_id: "",
        mobile_no: "",
        website_url: "",
        university_id:"",
    };
    const [institute, setInstitute] = useState(initialState);
    const [dataEntity, setDataEntity] = useState<IEntity[]>([])
    const [dataUniversity, setDataUniversity] = useState<IUniversity[]>([])
    const formRef = useRef<FormikProps<IInstituteForm>>(null)
    const location = useLocation();
    const Menulist: any = localStorage.getItem('menulist1');
    const pathSegments = location.pathname.split('/').filter(Boolean);    
    const lastSegment =  id ? pathSegments[pathSegments.length - 3].toLowerCase(): pathSegments[pathSegments.length - 2].toLowerCase();
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);
    const [contry_col, setcontry_col] = useState<boolean>(false)
    const [state_col, setstate_col] = useState<boolean>(false)
    useEffect(() => {
        // GetDataList()
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: ""},{ datatest: "" }));
    }, [Menulist])

    
    if ((id && !filteredData?.form_data?.is_update) || (!id && !filteredData?.form_data?.is_save)) {
        navigator('/main/Institute')
    }

    const callAPI = async () => {
        getData(`${InstituteEntityURL}`).then((data: { data: IEntity[] }) => {
            const filteredData = data?.data.filter(entity => entity.is_active === 1);
            setDataEntity(filteredData);
            // setDataEntity(data?.data)
        }).catch(e => {
            if (e?.response?.status === 401) {
                navigator("/")
            }
            toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
            });
        });
        getData(`${UniversityURL}`).then((data: { data: IUniversity[] }) => {

            if (data.data) {
                setDataUniversity(data?.data)
            }
        }).catch(e => {
            if (e?.response?.status === 401) {
                navigator("/")
            }
            toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
            });
        });
        if (id) {
            getData(`${InstituteEditURL}${id ? `/${id}` : ''}`).then((data: { data: IInstituteForm }) => {
                setInstitute(data?.data)
            }).catch(e => {
                if (e?.response?.status === 401) {
                    navigator("/")
                }
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                });
            });
        }
    }

    useEffect(() => {
        callAPI()
    }, [])

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, fieldName: string) => {
        setInstitute((prevInstitute) => {
            return {
                ...prevInstitute,
                [e.target.name]: e.target.value,
            };
        });
        formRef?.current?.setFieldValue(fieldName, e.target.value);
        await formRef?.current?.validateField(fieldName)
        if (formRef?.current?.errors?.[fieldName as keyof IInstituteForm] !== undefined) {
            formRef?.current?.setFieldError(fieldName, formRef?.current?.errors?.[fieldName as keyof IInstituteForm])
            formRef?.current?.setFieldTouched(fieldName, true)
        }
    };

    const handleInputChangecountry = async (value: string, addressType: string, name: string) => {
        if (addressType === "current_address") {
          if (name === "country") {
            // setStudentAddress((prevState) => ({ ...prevState, ["country"]: value }));
            // setStudentAddress((prevState) => ({ ...prevState, ["state"]: "" }));
            // setstate_col(true)
            // setcontry_col(false);
            setInstitute((prevInstitute) => {
                return {
                    ...prevInstitute,
                    ["country"]: value,
                };
            });
            setInstitute((prevInstitute) => {
                return {
                    ...prevInstitute,
                    ["state"]: "",
                };
            });
            setstate_col(true)
            setcontry_col(false);
            // formRef?.current?.setFieldValue("country", value);
            // await formRef?.current?.validateField("country")
            // if (formRef?.current?.errors?.["country" as keyof IInstituteForm] !== undefined) {
            //     formRef?.current?.setFieldError("country", formRef?.current?.errors?.["country"as keyof IInstituteForm])
            //     formRef?.current?.setFieldTouched("country", true)
            // }
          } else if (name === "state") {
            // setStudentAddress((prevState) => ({ ...prevState, ["state"]: value }));
            // setstate_col(false)
            setInstitute((prevInstitute) => {
                return {
                    ...prevInstitute,
                    ["state"]: value,
                };
            });
            setstate_col(false)
          } else {
            return;
          }
    
        } 
      }

    // const handleSubmit = async (instituteData: IInstituteForm) => {
        const handleSubmit = async (
            instituteData: IInstituteForm, 
            { resetForm }: FormikHelpers<IInstituteForm>
        ) => {
        if (id) {
            putData(`${InstituteEditURL}/${id}`, instituteData).then((data: { status: number; message:string }) => {
                if (data.status === 200) {
                    navigator('/main/Institute')
                    toast.success("Institute updated successfully", {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                }else {
                    toast.error(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                }
            }).catch(e => {
                if (e?.response?.status === 401) {
                    navigator("/")
                }
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                });
            });
        } else {
            postData(`${InstituteAddURL}`, instituteData).then((data: { status: number; message:string }) => {
                if (data.status === 200) {
                    // navigator('/main/Institute')
                    toast.success("Institute save successfully", {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    resetForm({ values: initialState });
                    setInstitute((prevInstitute) => {
                        return {
                            ...prevInstitute,
                            ["state"]: "",
                            ["country"]: "",
                            ["university_id"]:"",
                            ["entity_id"]:""
                        };
                    });
                    
                }else {
                    toast.error(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                }
            }).catch(e => {
                if (e?.response?.status === 401) {
                    navigator("/")
                }
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                });
            });
        }
    }
    let instituteSchema ;
{
    if(id){
         instituteSchema = Yup.object().shape({
            institution_name: Yup.string()
                .required("Please enter Institute name")
                .test(
                    "not-whitespace",
                    "Please enter a valid Institute name; whitespace is not allowed.",
                    (value:any) => value && value?.trim().length > 0 
                  )
                .matches(charPattern, 'Please enter a valid Institute name only characters allowed.')
                .test('unique', 'institute name already exists', function (value) {
                    if (!value) return true;
                    
                    // Check if the value matches the current institute name
                    if (value.toLowerCase() === institute.institution_name.toLowerCase()) {
                      return true;
                    }
              
                    // Check for uniqueness against dataInstitute
                    const exists = dataInstitute.some(inst => 
                      inst.institution_name && inst.institution_name.toLowerCase() === value.toLowerCase()
                    );
              
                    return !exists;
                  }),
                  
            email_id: Yup.string()
                .required("Please enter Email")
                .matches(emailPattern, 'Please enter a valid Email format.')
                .test('unique', 'email already exists', function (value) {
                    if (!value) return true;
                    
                    // Check if the value matches the current institute name
                    if (value.toLowerCase() === institute?.email_id.toLowerCase()) {
                      return true;
                    }
              
                    // Check for uniqueness against dataInstitute
                    const exists = dataInstitute?.some(inst => 
                      inst?.email_id && inst?.email_id?.toLowerCase() === value?.toLowerCase()
                    );
              
                    return !exists;
                  }),
                
            address: Yup.string()
                .required("Please enter Address")
                .test(
                    "not-whitespace",
                    "Please enter a valid Address; whitespace is not allowed.",
                    (value:any) => value && value?.trim().length > 0 
                  ),
                // .matches(addressPattern, 'Please enter a valid Address only characters allowed.'),
            city: Yup.string()
                .required("Please enter City")
                .test(
                    "not-whitespace",
                    "Please enter a valid City; whitespace is not allowed.",
                    (value:any) => value && value?.trim().length > 0 
                  )
                .matches(charPattern, 'Please enter a valid City name only characters allowed.'),
            country: Yup.string()
                .required("Please enter Country")
                .matches(charPattern, 'Please enter a valid Contry name only characters allowed.'),
            state: Yup.string()
                .required("Please enter State")
                .matches(charPattern, 'Please enter a valid State name only characters allowed.'),
            district: Yup.string()
                .required("Please enter District")
                .test(
                    "not-whitespace",
                    "Please enter a valid District; whitespace is not allowed.",
                    (value:any) => value && value?.trim().length > 0 
                  )
                .matches(charPattern, 'Please enter a valid District name only characters allowed.'),
            pincode: Yup.string()
                .required("Please enter Pincode")
                .matches(pincodePattern, 'Please enter a valid 6-digit pincode.'),
            entity_id: Yup.string()
                .required("Please select Entity"),
                university_id: Yup.string()
                .required("Please select University"),
            mobile_no: Yup.string()
                .required("Please enter Mobile number")
                .matches(mobilePattern, 'Please enter a valid mobile number.It must be 10 digits long.')
                .test('unique', 'mobile number already exists', function (value) {
                    if (!value) return true;
                    
                    // Check if the value matches the current institute name
                    if (value?.toLowerCase() === institute?.mobile_no?.toLowerCase()) {
                      return true;
                    }
              
                    // Check for uniqueness against dataInstitute
                    const exists = dataInstitute?.some(inst => 
                      inst?.mobile_no && inst?.mobile_no?.toLowerCase() === value?.toLowerCase()
                    );
              
                    return !exists;
                  }),
               
            website_url: Yup.string()
            //     .required("Please enter Website")
            //     .matches(websitePattern, 'Please enter a valid URL format.'),
        })
    }else{
         instituteSchema = Yup.object().shape({
            institution_name: Yup.string()
                .required("Please enter Institute name")
                .test(
                    "not-whitespace",
                    "Please enter a valid Institute name; whitespace is not allowed.",
                    (value:any) => value && value?.trim().length > 0 
                  )
                .matches(charPattern, 'Please enter a valid Institute name only characters allowed.')
                .test('unique', 'institute name already exists', value => {
                    if (!value) return true;
                    const exists = dataInstitute.some(inst => inst.institution_name && inst.institution_name.toLowerCase() === value.toLowerCase());
                    return !exists;
                }),  
            email_id: Yup.string()
                .required("Please enter Email")
                .matches(emailPattern, 'Please enter a valid Email format.')
                .test('unique', 'email already exists', value => {
                    if (!value) return true;
                    const exists = dataInstitute.some(inst => inst?.email_id && inst?.email_id.toLowerCase() === value?.toLowerCase());
                    return !exists;
                }),
            address: Yup.string()
                .required("Please enter Address")
                .test(
                    "not-whitespace",
                    "Please enter a valid Address; whitespace is not allowed.",
                    (value:any) => value && value?.trim().length > 0 
                  ),
                // .matches(addressPattern, 'Please enter a valid Address only characters allowed.'),
            city: Yup.string()
                .required("Please enter City")
                .test(
                    "not-whitespace",
                    "Please enter a valid City; whitespace is not allowed.",
                    (value:any) => value && value?.trim().length > 0 
                  )
                .matches(charPattern, 'Please enter a valid City name only characters allowed.'),
            country: Yup.string()
                .required("Please enter Country")
                .matches(charPattern, 'Please enter a valid Contry name only characters allowed.'),
            state: Yup.string()
                .required("Please enter State")
                .matches(charPattern, 'Please enter a valid State name only characters allowed.'),
            district: Yup.string()
                .required("Please enter District")
                .test(
                    "not-whitespace",
                    "Please enter a valid District; whitespace is not allowed.",
                    (value:any) => value && value?.trim().length > 0 
                  )
                .matches(charPattern, 'Please enter a valid District name only characters allowed.'),
            pincode: Yup.string()
                .required("Please enter Pincode")
                .matches(pincodePattern, 'Please enter a valid 6-digit pincode.'),
            entity_id: Yup.string()
                .required("Please select Entity"),
                university_id: Yup.string()
                .required("Please select University"),
            mobile_no: Yup.string()
                .required("Please enter Mobile number")
                .matches(mobilePattern, 'Please enter a valid mobile number.It must be 10 digits long.')
                .test('unique', 'mobile number already exists', value => {
                    if (!value) return true;
                    const exists = dataInstitute.some(inst => inst?.mobile_no && inst?.mobile_no.toLowerCase() === value?.toLowerCase());
                    return !exists;
                }),
            website_url: Yup.string()
            //     .required("Please enter Website")
            //     .matches(websitePattern, 'Please enter a valid URL format.'),
        })
    }
}
 
const [isFocused, setIsFocused] = useState(false);
const [isFocusedstate, setIsFocusedstate] = useState(false);
const dropdownRef = useRef<HTMLDivElement>(null);
const dropdownstateRef = useRef<HTMLDivElement>(null);
const [isCountryOpen, setIsCountryOpen] = useState(false);
const [isStateOpen, setIsStateOpen] = useState(false);

useEffect(() => {
  const handleFocus = () => setIsFocused(true);
  const handleFocusstate = () => setIsFocusedstate(true);
  const handleBlur = (e: FocusEvent) => {
   
    if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget as Node)) {
      setIsFocused(false);
    }
  };
  const handleBlurstate = (e: FocusEvent) => {
    console.log("Blurstate")
    if (dropdownstateRef.current && !dropdownstateRef.current.contains(e.relatedTarget as Node)) {
        setIsFocusedstate(false);
    }
  };

  const currentDropdown = dropdownRef.current;
  console.log("currentDropdown",currentDropdown)

  if (currentDropdown) {
    currentDropdown.addEventListener('focus', handleFocus as EventListener);
    currentDropdown.addEventListener('blur', handleBlur as EventListener);
  }
  const currentDropdownstate = dropdownstateRef.current;
  console.log("currentDropdownstate",currentDropdownstate)
  if (currentDropdownstate) {
    currentDropdownstate.addEventListener('focus', handleFocusstate as EventListener);
    currentDropdownstate.addEventListener('blur', handleBlurstate as EventListener);
  }

  return () => {
    if (currentDropdown) {
      currentDropdown.removeEventListener('focus', handleFocus as EventListener);
      currentDropdown.removeEventListener('blur', handleBlur as EventListener);
    }
    if (currentDropdownstate) {
        currentDropdownstate.removeEventListener('focus', handleFocusstate as EventListener);
        currentDropdownstate.removeEventListener('blur', handleBlurstate as EventListener);
      }
  };
}, []);

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
        <div className='main-wrapper'>
            <div className="main-content">
            <div className='card p-lg-3'>
                <div className='card-body'>
                    <Typography variant="h6">
                        <div className='main_title'>{id ? "Edit" : "Add"} Institute</div>
                    </Typography>
                    <Formik
                        // onSubmit={(formData) => handleSubmit(formData)}
                        onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                        initialValues={{
                            institution_name: institute?.institution_name,
                            email_id: institute?.email_id,
                            address: institute?.address,
                            city: institute?.city,
                            country: institute?.country,
                            state: institute?.state,
                            district: institute?.district,
                            pincode: institute?.pincode,
                            entity_id: institute?.entity_id,
                            mobile_no: institute?.mobile_no,
                            website_url: institute?.website_url,
                            university_id: institute?.university_id
                        }}
                        enableReinitialize
                        validationSchema={instituteSchema}
                        innerRef={formRef}
                    >
                        {({ errors, values, touched ,isValid,dirty}) => (
                            <Form>
                                <div className='row gy-4 mt-0'>
                                <div className='col-md-4'>
                                        <div className="form_field_wrapper">
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">University *</InputLabel>
                                                <Select
                                                    onChange={(e: SelectChangeEvent<string>) => handleChange(e, "entity_id")}
                                                    label="University"
                                                    name="university_id"
                                                    value={values?.university_id}
                                                    variant="outlined"
                                                    sx={{
                                                        backgroundColor: inputfield(namecolor) , 
                                                        color: inputfieldtext(namecolor) 
                                                    }}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                backgroundColor: inputfield(namecolor),
                                                                color: inputfieldtext(namecolor)
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {dataUniversity?.map((item, idx) => (
                                                        <MenuItem value={item.university_id} key={`${item.university_name}-${idx + 1}`} 
                                                        
                                                        sx={{
                                                            backgroundColor: inputfield(namecolor),
                                                                color: inputfieldtext(namecolor),
                                                            '&:hover': {
                                                                backgroundColor:  inputfieldhover(namecolor),
                                                            },
                                                        }}
                                                        >{item.university_name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {touched?.university_id && errors?.university_id ?
                                                <p style={{ color: 'red' }}>{errors?.university_id}</p> : <></>
                                            }
                                        </div>
                                    </div>
                                <div className='col-md-4'>
                                        <div className="form_field_wrapper">
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Entity *</InputLabel>
                                                <Select
                                                    onChange={(e: SelectChangeEvent<string>) => handleChange(e, "entity_id")}
                                                    label="Entity"
                                                    name="entity_id"
                                                    value={values?.entity_id}
                                                    variant="outlined"
                                                    sx={{
                                                        backgroundColor: inputfield(namecolor) , 
                                                        color: inputfieldtext(namecolor) 
                                                    }}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                backgroundColor: inputfield(namecolor),
                                                                color: inputfieldtext(namecolor)
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {dataEntity.map((item, idx) => (
                                                        <MenuItem value={item.id} key={`${item.entity_type}-${idx + 1}`} 
                                                        
                                                        sx={{
                                                            backgroundColor: inputfield(namecolor),
                                                                color: inputfieldtext(namecolor),
                                                            '&:hover': {
                                                                backgroundColor:  inputfieldhover(namecolor),
                                                            },
                                                        }}
                                                        >{item.entity_type}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {touched?.entity_id && errors?.entity_id ?
                                                <p style={{ color: 'red' }}>{errors?.entity_id}</p> : <></>
                                            }
                                        </div>
                                    </div>
                                    <div className="floating-label-container col-md-4" ref={dropdownRef}>
                                        <label className={`floating-label ${isFocused || values?.country || isCountryOpen ? "focused" : "focusedempty"}`}>
                                            Country <span>*</span>
                                        </label>
                                        <div className="form_field_wrapper" 
                                        // onClick={() => setIsCountryOpen((prev) => !prev)}
                                        onClick={handleCountryClick}
                                        onBlur={handleCountryBlur}    // Detect blur event (when the dropdown loses focus)
                                        tabIndex={-1} 
                                        >
                                            <CountryDropdown
                                                classes="form-control p-3 custom-dropdown"
                                                defaultOptionLabel={values?.country || ""}
                                                value={values?.country || ""}
                                                onChange={(e) => handleInputChangecountry(e, "current_address", "country")}  
                                              
                                            />
                                            {/* {contry_col && <p style={{ color: "red" }}>Please enter Country Name.</p>} */}
                                            {touched?.country && errors?.country ?
                                                <p style={{ color: 'red' }}>Please enter Country Name.</p> : <></>
                                            }
                                        </div>
                                    </div>


                                    <div className='floating-label-container col-md-4' ref={dropdownstateRef}>
                                    <label className={`floating-label ${isFocusedstate || values?.state || isStateOpen ? "focused" : "focusedempty"}`}>
                                            State <span>*</span>
                                        </label>
                                        <div className="form_field_wrapper"
                                        //  onClick={() => setIsStateOpen((prev) => !prev)}
                                        onClick={handleStateClick}
                                        onBlur={handleStateBlur}    // Detect blur event (when the dropdown loses focus)
                                        tabIndex={-1} 
                                         >
                                            <RegionDropdown
                                                classes="form-control p-3 custom-dropdown"
                                                defaultOptionLabel={values?.state || ""}
                                                country={values?.country || ""}
                                                value={values?.state || ""}
                                                // onChange={(val) => setRegion(val)} 
                                                onChange={(e: string) => handleInputChangecountry(e, "current_address", "state")}
                                            />
                                            <div> {state_col && (
                                                <p style={{ color: 'red' }}>Please enter a valid state Name.</p>
                                            )}</div>
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className="form_field_wrapper">
                                            <Field
                                             fullWidth
                                                component={TextField}
                                                type="text"
                                                name="institution_name"
                                                label="Institute name *"
                                                value={values?.institution_name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "institution_name")}
                                            />
                                            {touched?.institution_name && errors?.institution_name ?
                                                <p style={{ color: 'red' }}>{errors?.institution_name}</p> : <></>
                                            }
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className="form_field_wrapper">
                                            <Field
                                             fullWidth
                                                component={TextField}
                                                label="Address *"
                                                name="address"
                                                value={values?.address}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "address")}
                                            />
                                            {touched?.address && errors?.address ?
                                                <p style={{ color: 'red' }}>{errors?.address}</p> : <></>
                                            }
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className="form_field_wrapper">
                                            <Field
                                             fullWidth
                                                component={TextField}
                                                type='email'
                                                label="Email *"
                                                name="email_id"
                                                value={values?.email_id}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "email_id")}
                                            />
                                            {touched?.email_id && errors?.email_id ?
                                                <p style={{ color: 'red' }}>{errors?.email_id}</p> : <></>
                                            }
                                        </div>
                                    </div>
                                    {/* <div className='col-md-4'>
                                         <div className="form_field_wrapper">
                                            <Field
                                                component={TextField}
                                                label="Country *"
                                                name="country"
                                                value={values?.country}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "country")}
                                            />
                                            {touched?.country && errors?.country ?
                                                <p style={{ color: 'red' }}>{errors?.country}</p> : <></>
                                            }
                                        </div> 
                                    </div> */}
                                    
                                    <div className='col-md-4'>
                                        <div className="form_field_wrapper">
                                            <Field
                                                component={TextField}
                                                type="text"
                                                name="mobile_no"
                                                label="Mobile Number *"
                                                value={values?.mobile_no}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "mobile_no")}
                                            />
                                            {touched?.mobile_no && errors?.mobile_no ?
                                                <p style={{ color: 'red' }}>{errors?.mobile_no}</p> : <></>
                                            }
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className="form_field_wrapper">
                                            <Field
                                                component={TextField}
                                                label="City *"
                                                name="city"
                                                value={values?.city}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "city")}
                                            />
                                            {touched?.city && errors?.city ?
                                                <p style={{ color: 'red' }}>{errors?.city}</p> : <></>
                                            }
                                        </div>
                                    </div>
                                    {/* <div className='col-md-4'>
                                        <div className="form_field_wrapper">
                                            <Field
                                                component={TextField}
                                                label="State *"
                                                name="state"
                                                value={values?.state}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "state")}
                                            />
                                            {touched?.state && errors?.state ?
                                                <p style={{ color: 'red' }}>{errors?.state}</p> : <></>
                                            }
                                        </div>
                                    </div> */}
                                    <div className='col-md-4'>
                                        <div className="form_field_wrapper">
                                            <Field
                                                component={TextField}
                                                label="District *"
                                                name="district"
                                                value={values?.district}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "district")}
                                            />
                                            {touched?.district && errors?.district ?
                                                <p style={{ color: 'red' }}>{errors?.district}</p> : <></>
                                            }
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className="form_field_wrapper">
                                            <Field
                                                component={TextField}
                                                label="Pincode *"
                                                name="pincode"
                                                value={values?.pincode}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "pincode")}
                                            />
                                            {touched?.pincode && errors?.pincode ?
                                                <p style={{ color: 'red' }}>{errors?.pincode}</p> : <></>
                                            }
                                        </div>
                                    </div>
                                    <div className='col-md-4'>
                                        <div className="form_field_wrapper">
                                            <Field
                                                component={TextField}
                                                label="Website"
                                                name="website_url"
                                                value={values?.website_url}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "website_url")}
                                            />
                                            {/* {touched?.website_url && errors?.website_url ?
                                                <p style={{ color: 'red' }}>{errors?.website_url}</p> : <></>
                                            } */}
                                        </div>
                                    </div>
                                    
                                </div>
                                <button className='btn btn-primary mainbutton mt-4'  >{id ? "Update" : "Save"}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            </div>
           
        </div>
    )
}

export default AddEditInstitute