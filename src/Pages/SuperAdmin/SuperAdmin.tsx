import React, { useContext, useEffect, useRef, useState } from 'react'
import '../Menu/Menu.scss';
import TextField from '@mui/material/TextField';
import useApi from '../../hooks/useAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUERY_KEYS, QUERY_KEYS_MENU } from '../../utils/const';
import { SelectChangeEvent, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { MenuListinter } from '../../Components/Table/columns';
import { inputfield, inputfieldtext } from '../../utils/helpers';
import NameContext from '../Context/NameContext';

interface IMenuForm {
  userid: string
  password: string
}
const SuperAdmin = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const location = useLocation();
    const signupUrl = QUERY_KEYS.POST_SIGNUP;
    const MenuAddURL = QUERY_KEYS_MENU.MENU_ADD;
    const MenuEditURL = QUERY_KEYS_MENU.MENU_EDIT;
    const { getData, postData, putData } = useApi()
    const Navigate = useNavigate();
    const { id } = useParams();
    const charPattern = /^[a-zA-Z\s]*$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const numberPattern = /^\d+$/;
        const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const Menulist: any = localStorage.getItem('menulist');
    const [value, setValue] = React.useState("admin");

    const initialState = {
      userid: "",
      password: ""
    };
    const [menu, setMenu] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
  
    // const [dataEntity, setDataEntity] = useState<any>([])
    const formRef = useRef<FormikProps<IMenuForm>>(null)
    const pathSegments = location.pathname.split('/').filter(Boolean);    
    const lastSegment =  id ? pathSegments[pathSegments.length - 3].toLowerCase(): pathSegments[pathSegments.length - 2].toLowerCase();
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);

    const callAPI = async () => {
        if (id) {
            getData(`${MenuEditURL}${id ? `/${id}` : ''}`).then((data: any) => {


                setMenu(data?.data)
            }).catch(e => {
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                });
            });

        }
    }

    const GetDataList = () => {
        JSON.parse(Menulist)?.map((data: any) => {
            const fistMach = data?.menu_name.toLowerCase() === lastSegment && data;
            if (fistMach.length > 0) {
                setFilteredData(fistMach)
            }
            const result = data?.submenus?.filter((menu: any) => menu.menu_name.toLowerCase() === lastSegment)
            if (result.length > 0) {
                setFilteredData(result)
            }
        })
    }
    useEffect(() => {
        GetDataList()
    }, [Menulist])

    
    // if ((id && !filteredData?.[0]?.is_update) || (!id && !filteredData?.[0]?.is_save)) {
    //     Navigate("/main/Menu")
    // }

    useEffect(() => {
        callAPI()
    }, [])
    // const handleChange = (e: any) => {
    //     const { name, value } = e.target;
    //     if (name === 'menu_name') {
    //         if (!/^[a-zA-Z\s]*$/.test(value)) {
    //             setMenunamevalid(true)
    //         } else {
    //             setMenunamevalid(false)
    //         }
    //     } 
    //     if (name === 'priority') {
    //         if (!/^[a-zA-Z\s]*$/.test(value)) {
    //             setMenupriorityvalid(true)
    //         } else {
    //             setMenupriorityvalid(false)
    //         }
    //     } 
    //     setMenu((prevUser) => {
    //         return {
    //             ...prevUser,
    //             [e.target.name]: e.target.value,
    //         };
    //     });
    // };
    const [isemail,setIsEmail]=useState(false)
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, fieldName: string) => {
        let email = e.target.value.includes('@');
        if(email && e.target.name === "userid") {
            setIsEmail(true)
        }else{
            setIsEmail(false)
        }
        setMenu((prevMenu) => {
            return {
                ...prevMenu,
                [e.target.name]: e.target.value,
            };
        });
        formRef?.current?.setFieldValue(fieldName, e.target.value);
        await formRef?.current?.validateField(fieldName)
        if (formRef?.current?.errors?.[fieldName as keyof IMenuForm] !== undefined) {
            formRef?.current?.setFieldError(fieldName, formRef?.current?.errors?.[fieldName as keyof IMenuForm])
            formRef?.current?.setFieldTouched(fieldName, true)
        }
    };

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, menuData: { menu_name:string,priority:string }) => {
    // const handleSubmit = async (menuData: IMenuForm) => {
        const handleSubmit = async (
            menuData: IMenuForm, 
            { resetForm }: FormikHelpers<IMenuForm>
        ) => {
            setIsLoading(true)
        // e.preventDefault()
        // e.target.reset()
        console.log("reset", menuData)
   let payload ={
    user_type:value,
    userid:menuData?.userid,
    password:menuData?.password
   }
            postData(`${signupUrl}`, payload).then((data: any) => {
                // const linesInfo = data || [];
                // dispatch(setLine(linesInfo))
                if (data.status === 200) {
                    // Navigate('/main/Menu')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    setIsLoading(false)
                    resetForm({ values: initialState });
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
                setIsLoading(false)
            });
        
    }
   
    const menuSchema = Yup.object().shape({
        userid: Yup.string()
          .test(
            'is-email-or-phone',
            'Please enter a valid email or phone number',
            function(value) {
              if (!value) {
                return this.createError({ message: 'Please enter email or phone number' });
              }
              if (emailRegex.test(value)) {
                return Yup.string().email().isValidSync(value);
              }
              if (phoneRegex.test(value)) {
                return Yup.string().matches(phoneRegex).isValidSync(value);
              }
              return false;
            }
          ),
        password: Yup.string()
          .required('Please enter a password')
          .min(8, 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long')
          .matches(uppercaseRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long')
          .matches(lowercaseRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long')
          .matches(numberRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long')
          .matches(specialCharRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long'),
      });

    return (
        <>
            <div className='main-wrapper'>
                <div className="main-content">
                <div className='card p-lg-3'>
                    <div className='card-body'>
                        <Typography variant="h6" className='mb-3'>
                             <div className='main_title'>Add User</div>
                        </Typography>
                        <Formik
                            // onSubmit={(formData) => handleSubmit(formData)}
                            onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                            initialValues={{
                              userid: menu?.userid,
                              password: menu?.password,

                            }}
                            enableReinitialize
                            validationSchema={menuSchema}
                            innerRef={formRef}
                        >
                          
                            {({ errors, values, touched }) => (
                                <Form>

                                    <div className='row'>
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper mb-4">
                                                {/* <TextField
                                            label="Menu Name"
                                            name="menu_name"
                                            value={menu.menu_name}
                                            variant="outlined"
                                            onChange={handleChange}
                                     
                                        /> */}
  
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    name="userid"
                                                    label="Email or Mobile Number *"
                                                    value={values?.userid}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "userid")}
                                                    // required
                                                    InputProps={{
                                                        style: {
                                                            backgroundColor: inputfield(namecolor) ,
                                                            // backgroundColor:'red' ,
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        style: {
                                                            color: inputfieldtext(namecolor)
                                                        }
                                                    }}
                                                />
                                                {touched?.userid && errors?.userid ?
                                                    <p style={{ color: 'red' }}>{errors?.userid}</p> : <></>
                                                }
                                            </div>
                                            {/* <div className='col-md-4'> */}
                                            <div className="form_field_wrapper">

                                                {/* <TextField
                                            label="Menu priority"
                                            name="priority"
                                            value={menu.priority}
                                            variant="outlined"
                                            onChange={handleChange}
                                        /> */}
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    name="password"
                                                    label="Password *"
                                                    value={values?.password}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "password")}
                                                    // required
                                                    InputProps={{
                                                        style: {
                                                            backgroundColor: inputfield(namecolor) ,
                                                            // backgroundColor:'red' ,
                                                        }
                                                    }}
                                                    InputLabelProps={{
                                                        style: {
                                                            color: inputfieldtext(namecolor)
                                                        }
                                                    }}
                                                />
                                                {touched?.password && errors?.password ?
                                                    <p style={{ color: 'red' }}>{errors?.password}</p> : <></>
                                                }
                                            </div>
                                        {/* </div> */}
                                       
                                        </div>
                                       
                                    </div>
                                   
                                    
                                    <div className=' mt-3'>
                                        <button className='btn btn-primary mainbutton' disabled={isLoading}>{"Save"}</button>
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

export default SuperAdmin
