import React, { useContext, useEffect, useRef, useState } from 'react'
import '../Form/Form.scss';
import useApi from '../../hooks/useAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUERY_KEYS_FORM, QUERY_KEYS_MENU, QUERY_KEYS_ROLE, QUERY_KEYS_ROLEVSFORM,} from '../../utils/const';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { Form, Formik, FormikHelpers, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { MenuListinter } from '../../Components/Table/columns';
import { dataaccess, inputfield, inputfieldhover, inputfieldtext } from '../../utils/helpers';
import NameContext from '../Context/NameContext';
interface IRolevsForm {
    role_master_id: string,
    form_master_id: string,
    is_save:boolean,
    is_update:boolean,
    is_search:boolean
}
const AddEditRolevsForm = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const RolevsFormAddURL = QUERY_KEYS_ROLEVSFORM.ROLEVSFORM_ADD;
    const RolevsFormEditURL = QUERY_KEYS_ROLEVSFORM.ROLEVSFORM_EDIT;
    const RoleURL = QUERY_KEYS_ROLE.GET_ROLE;
    const FormURL = QUERY_KEYS_FORM.GET_FORM;
    const user_type = localStorage.getItem("user_type");
    const MenuListURL = QUERY_KEYS_MENU.GET_MENU 
    const { getData, postData, putData } = useApi()
    const navigator = useNavigate()
    const { id } = useParams();
    const formRef = useRef() as any
    const MenuListURL1 = QUERY_KEYS_MENU.GET_MENULIST

    const location = useLocation();
    const Menulist: any = localStorage.getItem('menulist1');
    const pathSegments = location.pathname.split('/').filter(Boolean);    
    const lastSegment =  id ? pathSegments[pathSegments.length - 3].toLowerCase(): pathSegments[pathSegments.length - 2].toLowerCase();
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);
  
    // const GetDataList = () => {
    //     JSON.parse(Menulist)?.map((data: any) => {
    //         const fistMach = data?.menu_name.toLowerCase() === lastSegment && data;
    //         if (fistMach.length > 0) {
    //             setFilteredData(fistMach)
    //         }
    //         const result = data?.submenus?.filter((menu: any) => menu.menu_name.toLowerCase() === lastSegment)
    //         if (result.length > 0) {
    //             setFilteredData(result)
    //         }
    //     })
    // }

    useEffect(() => {
        // GetDataList()
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: "role vs form"},{ datatest: "rolevsform" }));
    }, [Menulist])
  
    
    if ((id && !filteredData?.form_data?.is_update) || (!id && !filteredData?.form_data?.is_save)) {
        navigator('/main/RoleVsForm')
    }

    const initialState = {
        role_master_id: "",
        form_master_id: "",
        is_search: false,
        is_save: false,
        is_update: false,
        

    };
    const [rolevsform, setRoleVsForm] = useState(initialState);
    const [dataRole, setDataRole] = useState<any>([])
    const [dataForm, setDataForm] = useState<any>([])
   

    const callAPI = async () => {
        getData(`${RoleURL}`).then((data: any) => {
            const filteredData = data?.data?.filter((item:any) => item?.is_active === 1);
            setDataRole(filteredData ||[]);
            // setDataRole(data?.data||[])
        }).catch(e => {
            if (e?.response?.status === 401) {
                navigator("/")
            }
            toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
                });
           });
        getData(`${FormURL}`).then((data: any) => {
            const filteredData = data?.data?.filter((item:any) => item?.is_active === 1);
            setDataForm(filteredData ||[]);
            // setDataForm(data?.data||[])
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
            getData(`${RolevsFormEditURL}${id ? `/${id}` : ''}`).then((data: any) => {

                const datavalue = data?.data
                setRoleVsForm({
                    role_master_id: datavalue?.role_master_id,
                    form_master_id: datavalue?.form_master_id,
                    is_search: datavalue?.is_search,
                    is_save: datavalue?.is_save,
                    is_update: datavalue?.is_update,
                   
                })
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

    const handleChange = async (e: any) => {
        const { name, value } = e.target;
        formRef?.current?.setFieldValue(e.target.name, e.target.value);
        const err = await formRef?.current?.validateForm()
        if (err && Object.keys(err).length > 0) {
            formRef?.current?.setErrors(err)
            formRef?.current?.setTouched(setNestedObjectValues(err, true))
            formRef?.current?.setFieldError(name, formRef?.current?.errors?.[name as keyof IRolevsForm])
            formRef?.current?.setFieldTouched(name, true)
        }
    
        setRoleVsForm((prevUser) => {
            return {
                ...prevUser,
                [e.target.name]: e.target.value,
            };
        });
    };

    const handleChangemenuVisible = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const booleanValue = value === "true";
        formRef?.current?.setFieldValue(e.target.name, e.target.value);
        const err = await formRef?.current?.validateForm()
        if (err && Object.keys(err).length > 0) {
            formRef?.current?.setErrors(err)
            formRef?.current?.setTouched(setNestedObjectValues(err, true))
            formRef?.current?.setFieldError(name, formRef?.current?.errors?.[name as keyof IRolevsForm])
            formRef?.current?.setFieldTouched(name, true)
        }
    
        setRoleVsForm((prevUser) => {
            return {
                ...prevUser,
                [name]: booleanValue,
            };
        });
    };
    useEffect(() => {
        callAPI()
    }, [])
    const profileData:any = sessionStorage.getItem('profileData')
  let basicinfo:any = {}
  if(profileData!==null)
  {
    basicinfo = JSON.parse(profileData)
  }
    const callAPIMenuList = async () => {
        getData(`${MenuListURL}/${user_type}`).then((data:any) => {
            if(data.data)
            {
              localStorage.setItem('menulist',JSON.stringify(data?.data));
            }
        }).catch((e:any) => {
            
        });
        if(basicinfo?.basic_info !==null){
            
            getData(`${MenuListURL1}/${basicinfo?.basic_info?.id}`).then((data:any) => {
              if(data.data)
              {
                
                localStorage.setItem('menulist1',JSON.stringify(data?.data));
              }
          }).catch((e:any) => {
          });
          }
      }
    // const handleSubmit = async (e:any, rolevsformData: { role_master_id?: string; form_master_id?: string; is_search?: boolean; is_save?: boolean; is_update?: boolean; }) => {
        // e.preventDefault()
        const handleSubmit = async (
            rolevsformData: { role_master_id?: string; form_master_id?: string; is_search?: boolean; is_save?: boolean; is_update?: boolean; }, 
            { resetForm }: FormikHelpers<{ role_master_id: string; form_master_id: string; is_search: boolean; is_save: boolean; is_update: boolean; }>
        ) => {
         rolevsformData.role_master_id = String(rolevsformData.role_master_id);
         rolevsformData.form_master_id = String(rolevsformData.form_master_id);
      
        if (id) {
            putData(`${RolevsFormEditURL}/${id}`, rolevsformData).then((data: any) => {
                if (data?.status === 200) {
                    navigator('/main/RoleVsForm')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    callAPIMenuList()
                }else {
                    toast.error(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                }
            })
        } else {
            postData(`${RolevsFormAddURL}`, rolevsformData).then((data: any) => {
                if (data?.status === 200) {
                    // navigator('/main/RoleVsForm')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    setRoleVsForm({
                        role_master_id: "",
                        form_master_id: "",
                        is_search: false,
                        is_save: false,
                        is_update: false,
                        
                
                    })
                    callAPIMenuList()
                }else {
                    toast.error(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                }
            })
        }
    }
    const rolevsformSchema = Yup.object().shape({
        role_master_id: Yup.string().required("Please select Role master"),
        form_master_id: Yup.string().required("Please select Form master"),
        is_save: Yup.string().required("Please select form is save"),
        is_update: Yup.string().required("Please select form is update"),
        is_search: Yup.string().required("Please select form is search"),
    })
    return (
        <>
            <div className='main-wrapper'>
                <div className="main-content">
                <div className='card p-lg-3'>
                    <div className='card-body'>
                        <Typography variant="h6">
                            {id ? <div className='main_title'>Edit Role vs Form</div> : <div className='main_title'>Add Role vs Form</div>}
                        </Typography>
                        <Formik
                            // onSubmit={(e,formData:any)=>handleSubmit(e,formData)}
                            onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                            initialValues={{
                                role_master_id:rolevsform.role_master_id,
                                form_master_id:rolevsform.form_master_id,
                                is_save:rolevsform.is_save,
                                is_update:rolevsform.is_update,
                                is_search:rolevsform.is_search
                            }}
                            enableReinitialize
                            validationSchema={rolevsformSchema}
                            innerRef={formRef}
                        >
                            {({ errors, values ,touched,isValid,dirty }:any) => (
                            <Form>

                                    <div className='row gy-4 mt-0'>
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">Role Master *</InputLabel>
                                                    <Select
                                                        onChange={handleChange}
                                                        label="Role Master"
                                                        name="role_master_id"
                                                        value={values?.role_master_id}
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
                                                        {
                                                            dataRole?.map((item: any) => (
                                                                <MenuItem value={item.id}
                                                                sx={{
                                                                    backgroundColor: inputfield(namecolor),
                                                                    color: inputfieldtext(namecolor),
                                                                    '&:hover': {
                                                                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                                                                    },
                                                                }}
                                                                >{item.role_name}</MenuItem>
                                                            ))
                                                        }

                                                    </Select>
                                                </FormControl>
                                            </div>
                                            {errors.role_master_id  && touched.role_master_id ?
                                                <p style={{ color: 'red' }}>{errors.role_master_id}</p>:<></>
                                            }
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">Form Master *</InputLabel>
                                                    <Select
                                                        onChange={handleChange}
                                                        label="Form Master"
                                                        name="form_master_id"
                                                        value={values?.form_master_id}
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
                                                        {
                                                            dataForm?.map((item: any) => (
                                                                <MenuItem value={item.id}
                                                                sx={{
                                                                    backgroundColor: inputfield(namecolor),
                                                                    color: inputfieldtext(namecolor),
                                                                    '&:hover': {
                                                                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                                                                    },
                                                                }}
                                                                
                                                                >{item.form_name}</MenuItem>
                                                            ))
                                                        }

                                                    </Select>
                                                </FormControl>
                                            </div>
                                            {errors.form_master_id  && touched.form_master_id ?
                                                <p style={{ color: 'red' }}>{errors.form_master_id}</p>:<></>
                                            }
                                        </div>
                                    
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                <Typography sx={{ marginLeft: "15px", display: "flex", alignItems: "flex-start" , color: inputfieldtext(namecolor) }}>Is Search</Typography>
                                                <RadioGroup
                                                    row
                                                    name="is_search"
                                                    value={values.is_search}
                                                    onChange={handleChangemenuVisible}
                                                >
                                                    <FormControlLabel value={true} control={<Radio className='radiobutton' />} label="Yes" />
                                                    <FormControlLabel value={false} control={<Radio className='radiobutton' />} label="No" />
                                                </RadioGroup>
                                            </div>
                                            {errors.is_search  && touched.is_search ?
                                                <p style={{ color: 'red' }}>{errors.is_search}</p>:<></>
                                            }
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                <Typography sx={{ marginLeft: "15px", display: "flex", alignItems: "flex-start" , color: inputfieldtext(namecolor),}}>Is Save</Typography>
                                                <RadioGroup
                                                    row
                                                    name="is_save"
                                                    value={values.is_save}
                                                    onChange={handleChangemenuVisible}
                                                >
                                                    <FormControlLabel value={true} control={<Radio className='radiobutton' />} label="Yes" />
                                                    <FormControlLabel value={false} control={<Radio className='radiobutton'/>} label="No" />
                                                </RadioGroup>
                                            </div>
                                            {errors.is_save  && touched.is_save ?
                                                <p style={{ color: 'red' }}>{errors.is_save}</p>:<></>
                                            }
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                <Typography sx={{ marginLeft: "15px", display: "flex", alignItems: "flex-start" , color: inputfieldtext(namecolor),}}>Is Update</Typography>
                                                <RadioGroup
                                                    row
                                                    name="is_update"
                                                    value={values.is_update}
                                                    onChange={handleChangemenuVisible}
                                                >
                                                    <FormControlLabel value={true} control={<Radio className='radiobutton' />} label="Yes" />
                                                    <FormControlLabel value={false} control={<Radio className='radiobutton' />} label="No" />
                                                </RadioGroup>
                                            </div>
                                            {errors.is_update  && touched.is_update ?
                                                <p style={{ color: 'red' }}>{errors.is_update}</p>:<></>
                                            }
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
        </>
    )
}

export default AddEditRolevsForm