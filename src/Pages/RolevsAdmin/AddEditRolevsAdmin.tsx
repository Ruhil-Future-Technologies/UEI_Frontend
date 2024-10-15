import React, { useContext, useEffect, useRef, useState } from 'react'
import '../RolevsAdmin/RolevsAdmin.scss';
import TextField from '@mui/material/TextField';
import useApi from '../../hooks/useAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUERY_KEYS_ADMIN_BASIC_INFO, QUERY_KEYS_ROLE, QUERY_KEYS_ROLEVSADMIN} from '../../utils/const';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { Form, Formik, FormikHelpers, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { MenuListinter } from '../../Components/Table/columns';
import { dataaccess, inputfield, inputfieldhover, inputfieldtext } from '../../utils/helpers';
import NameContext from '../Context/NameContext';
interface IRolevsAdmin {
    role_master_id: string,
    admin_id: string
}

const AddEditRoleVsAdmin = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const RolevsAdminAddURL = QUERY_KEYS_ROLEVSADMIN.ROLEVSADMIN_ADD;
    const RolevsAdminEditURL = QUERY_KEYS_ROLEVSADMIN.ROLEVSADMIN_EDIT;
    const RoleURL = QUERY_KEYS_ROLE.GET_ROLE;
    const AdminURL = QUERY_KEYS_ADMIN_BASIC_INFO.GET_ADMIN_BASIC_INFO;
    const { getData, postData, putData } = useApi()
    const navigator = useNavigate()
    const { id } = useParams();
    const formRef = useRef() as any

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
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: "role vs user"},{ datatest: "rolevsuser" }));
    }, [Menulist])
  
    
    if ((id && !filteredData?.form_data?.is_update) || (!id && !filteredData?.form_data?.is_save)) {
        navigator('/main/RoleVsUser')
    }

    const initialState = {
        role_master_id: "",
        admin_id: ""
        

    };
    const [rolevsadmin, setRoleVsAdmin] = useState(initialState);
    const [dataRole, setDataRole] = useState<any>([])
    const [dataAdmin, setDataAdmin] = useState<any>([])

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
        getData(`${AdminURL}`).then((data: any) => {
            const filteredData = data?.data?.filter((item:any) => item?.is_active === 1);
            setDataAdmin(filteredData ||[]);
            // setDataAdmin(data?.data||[])
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
            getData(`${RolevsAdminEditURL}${id ? `/${id}` : ''}`).then((data: any) => {

                const datavalue = data?.data
                setRoleVsAdmin({
                    role_master_id: datavalue?.role_master_id,
                    admin_id: datavalue?.admin_id
                   
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
            formRef?.current?.setFieldError(name, formRef?.current?.errors?.[name as keyof IRolevsAdmin])
            formRef?.current?.setFieldTouched(name, true)
        }
        setRoleVsAdmin((prevUser) => {
            return {
                ...prevUser,
                [e.target.name]: e.target.value,
            };
        });
    };

    const handleChangemenuVisible = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const booleanValue = value === "true";
        setRoleVsAdmin((prevUser) => {
            return {
                ...prevUser,
                [name]: booleanValue,
            };
        });
    };
    useEffect(() => {
        callAPI()
    }, [])
    // const handleSubmit = async (rolevsadminData: { role_master_id?: string; admin_id?: string}) => {
        // const handleSubmit = async (rolevsadminData: IRolevsAdmin) => {
            const handleSubmit = async (
                rolevsadminData: IRolevsAdmin, 
                { resetForm }: FormikHelpers<IRolevsAdmin>
            ) => {

        // rolevsadminData.role_master_id = String(rolevsadminData.role_master_id);
        // rolevsadminData.admin_id = String(rolevsadminData.admin_id);
        if (id) {
            putData(`${RolevsAdminEditURL}/${id}`, rolevsadminData).then((data: any) => {
                if (data?.status === 200) {
                    navigator('/main/RoleVsUser')
                    toast.success(data.message, {
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
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                    });
               });
        } else {
            postData(`${RolevsAdminAddURL}`, rolevsadminData).then((data: any) => {
                if (data?.status === 200) {
                    // navigator('/main/RoleVsUser')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    setRoleVsAdmin({
                        role_master_id: "",
                        admin_id: ""
                    })

                }else {
                    toast.error(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                }
            }).catch(e => {
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                    });
               });
        }
    }
    const rolevsadminSchema = Yup.object().shape({
        role_master_id: Yup.string().required("Please select Role matser"),
        admin_id: Yup.string().required("Please select Admin")
    })
    return (
        <>
            <div className='main-wrapper'>
                <div className="main-content">
                <div className='card p-lg-3'>
                    <div className='card-body'>
                        <Typography variant="h6">
                            {id ? <div className='main_title'>Edit Role vs User</div> : <div className='main_title'>Add Role vs User</div>}
                        </Typography>
                        <Formik
                            //  onSubmit={(formData) => handleSubmit(formData)}
                            onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                            initialValues={{
                                role_master_id:rolevsadmin.role_master_id,
                                admin_id:rolevsadmin.admin_id
                            }}
                            enableReinitialize
                            validationSchema={rolevsadminSchema}
                            innerRef={formRef}
                        >
                            {({ errors, values ,touched,isValid,dirty }:any) => (
                                // <form onSubmit={(e) => handleSubmit(rolevsadmin)}>
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
                                            {errors.role_master_id && touched.role_master_id ?
                                                <p style={{ color: 'red' }}>{errors.role_master_id}</p>:<></>
                                            }
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">Admin *</InputLabel>
                                                    <Select
                                                        onChange={handleChange}
                                                        label="Admin"
                                                        name="admin_id"
                                                        value={values?.admin_id}
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
                                                            dataAdmin?.map((item: any) => (
                                                                <MenuItem value={item.id}
                                                                sx={{
                                                                    backgroundColor: inputfield(namecolor),
                                                                    color: inputfieldtext(namecolor),
                                                                    '&:hover': {
                                                                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                                                                    },
                                                                }}
                                                                >{item.first_name}</MenuItem>
                                                            ))
                                                        }

                                                    </Select>
                                                </FormControl>
                                            </div>
                                            {errors.admin_id && touched.admin_id ?
                                                <p style={{ color: 'red' }}>{errors.admin_id}</p>:<></>
                                            }
                                        </div>
                                        <div className="col-lg-12">
                                        <button className='btn btn-primary mainbutton'  >{id ? "Update" : "Save"}</button>
                                        </div>
                                    </div>
                                    
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

export default AddEditRoleVsAdmin