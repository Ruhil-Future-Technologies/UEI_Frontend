import React, { FormEvent, useEffect, useRef, useState } from 'react'
import '../Role/Role.scss';
// import TextField from '@mui/material/TextField';
import useApi from '../../hooks/useAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUERY_KEYS_ROLE } from '../../utils/const';
import { SelectChangeEvent, TextField, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { Field, Form, Formik, FormikHelpers, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { MenuListinter } from '../../Components/Table/columns';
import { dataaccess } from '../../utils/helpers';
interface IRoleForm {
   role_name: string
}


const AddEditRole = () => {
    const RoleAddURL = QUERY_KEYS_ROLE.ROLE_ADD;
    const RoleEditURL = QUERY_KEYS_ROLE.ROLE_EDIT;
    const { getData, postData, putData } = useApi()
    const navigator = useNavigate()
    const { id } = useParams();
    const RoleNamePattern = /^[a-zA-Z\s]*$/

    const initialState:any = {
        role_name: ""
    };
    const [role, setRole] = useState(initialState);
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
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: ""},{ datatest: "" }));
    }, [Menulist])
  
    
    if ((id && !filteredData?.form_data?.is_update) || (!id && !filteredData?.form_data?.is_save)) {
        navigator('/main/Role')
    }

    const callAPI = async () => {
        if (id) {
            getData(`${RoleEditURL}${id ? `/${id}` : ''}`).then((data: any) => {
                const datavalue = data?.data
                setRole({
                    role_name: datavalue.role_name
                })
            }).catch(e => {
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
    // const handleChange = async (e: any) => {
    //     const { name, value } = e.target;
    //     formRef?.current?.setFieldValue(e.target.name, e.target.value);
    //     const err = await formRef?.current?.validateForm()
    //     if (err && Object.keys(err).length > 0) {
    //         formRef?.current?.setErrors(err)
    //         formRef?.current?.setTouched(setNestedObjectValues(err, true))
    //         formRef?.current?.setFieldError(name, formRef?.current?.errors?.[name as keyof IRoleForm])
    //         formRef?.current?.setFieldTouched(name, true)
    //     }
    //     setRole((prevUser:any) => {
    //         return {
    //             ...prevUser,
    //             [e.target.name]: e.target.value,
    //         };
    //     });
    // };
    const handleChange11 = async (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, fieldName: string) => {
        setRole((prevMenu: any) => {
            return {
                ...prevMenu,
                [e.target.name]: e.target.value,
            };
        });
        formRef?.current?.setFieldValue(fieldName, e.target.value);
        await formRef?.current?.validateField(fieldName)
        if (formRef?.current?.errors?.[fieldName as keyof IRoleForm] !== undefined) {
            formRef?.current?.setFieldError(fieldName, formRef?.current?.errors?.[fieldName as keyof IRoleForm])
            formRef?.current?.setFieldTouched(fieldName, true)
        }
    };
    const roleSchema = Yup.object().shape({
        role_name: Yup.string()
            .required("Please enter Role name")
            .matches(RoleNamePattern, 'Please enter a valid Role name only characters allowed.')
    })
    // const handleSubmit = async (e: any, roleData: { role_name: string }) => {
        // const handleSubmit = async (roleData: IRoleForm) => {
            const handleSubmit = async (
                roleData: IRoleForm, 
                { resetForm }: FormikHelpers<IRoleForm>
            ) => {
        // e.preventDefault()
    // console.log("handleSubmit", roleData)
        if (id) {
            putData(`${RoleEditURL}/${id}`, roleData).then((data: any) => {
                if (data.status === 200) {
                    navigator('/main/Role')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                }else if(data.status === 400) {
                    toast.error('Role name already exists', {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                }else{
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
            postData(`${RoleAddURL}`, roleData).then((data: any) => {
                if (data.status === 200) {
                    // navigator('/main/Role')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    resetForm({ values: initialState });
                    // setRole({ role_name: ""})
                }else if(data.status === 400) {
                    toast.error('Role name already exists', {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                }else{
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

    return (
        <>
            <div className='main-wrapper'>
                <div className="main-content">
                <div className='card p-lg-3'>
                    <div className='card-body'>
                        <Typography variant="h6">
                            {id ? <div className='main_title'>Edit Role</div> : <div className='main_title'>Add Role</div>}
                        </Typography>
                        <Formik
                            //  onSubmit={(formData:any)=>handleSubmit(formData)}
                            onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                            initialValues={{
                                role_name:role.role_name
                            }}
                            enableReinitialize
                            validationSchema={roleSchema}
                            innerRef={formRef}
                        >
                            {({ errors, values ,touched,isValid,dirty }:any) => (
                                <Form>

                                    <div className='row gy-4 flex-column mt-0'>
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                {/* <Field
                                                    label="Role Name"
                                                    name="role_name"
                                                    value={values.role_name}
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                /> */}
                                                   <Field
                                                   component={TextField}
                                                    type="text"
                                                    label="Role Name *"
                                                    name="role_name"
                                                    value={values.role_name}
                                                    variant="outlined"
                                                    // onChange={handleChange}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange11(e, "role_name")}
                                                />
                                                {touched?.role_name && errors?.role_name ?
                                                    <p style={{ color: 'red' }}>{errors?.role_name}</p> : <></>
                                                }
                                            </div>
                                            {/* {errors.role_name && touched.role_name ?
                                                        <p style={{ color: 'red' }}>{errors.role_name}</p> : <></>
                                            } */}
                                        </div>
                                        <div className="col-lg-4">
                                        <button  className='btn btn-primary mainbutton'  >{id ? "Update" : "Save"}</button>
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

export default AddEditRole