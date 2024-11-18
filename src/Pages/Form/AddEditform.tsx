import React, { useContext, useEffect, useRef, useState } from 'react'
import '../Form/Form.scss';
import TextField from '@mui/material/TextField';
import useApi from '../../hooks/useAPI';
import {  useLocation, useNavigate, useParams} from 'react-router-dom';
import { QUERY_KEYS_FORM, QUERY_KEYS_MENU, QUERY_KEYS_SUBMENU } from '../../utils/const';
import { Button, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { Field, Form, Formik, FormikHelpers, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { MenuListinter } from '../../Components/Table/columns';
import { routes } from '../NotFound/routesConfig';
import { dataaccess, inputfield, inputfieldhover, inputfieldtext } from '../../utils/helpers';
import NameContext from '../Context/NameContext';

interface IForm {
    form_name: string
    menu_master_id: string
    sub_menu_master_id: string
    form_url: string
    form_description: string
    is_visible: string
}

const AddEditForm = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const FormAddURL = QUERY_KEYS_FORM.FORM_ADD;
    const FormEditURL = QUERY_KEYS_FORM.FORM_EDIT;
    const MenuURL = QUERY_KEYS_MENU.GET_MENU;
    const SubMenuURL = QUERY_KEYS_SUBMENU.GET_SUBMENU;
    const { getData, postData, putData } = useApi()
    const navigator = useNavigate()
    const { id } = useParams();
    // const routes = useRoutes();
    const FormNamePattern = /^[a-zA-Z\s]*$/

    const initialState:any = {
        form_name: "",
        menu_master_id: "",
        sub_menu_master_id: "",
        form_url: "",
        form_description: "",
        is_menu_visible: false,

    };
    const [form, setForm] = useState(initialState);
    const [dataMenu, setDataMenu] = useState<any>([])
    const [dataSubMenu, setDataSubMenu] = useState<any>([])
    const formRef = useRef() as any

    const location = useLocation();
    const Menulist: any = localStorage.getItem('menulist1');
    const pathSegments = location.pathname.split('/').filter(Boolean);    
    const lastSegment =  id ? pathSegments[pathSegments.length - 3].toLowerCase(): pathSegments[pathSegments.length - 2].toLowerCase();
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);
    const [dataUrl, setDataUrl] = useState(false)
    const [dataUrl1, setDataUrl1] = useState(false)
  
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
        navigator('/main/Form')
    }

    const callAPI = async () => {
        getData(`${MenuURL}`).then((data: any) => {
            const filteredData = data?.data?.filter((item:any) => item?.is_active === 1);
            setDataMenu(filteredData ||[]);
            // setDataMenu(data?.data||[])
        }).catch(e => {
            if (e?.response?.status === 401) {
                navigator("/")
            }
            toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
                });
           });
        getData(`${SubMenuURL}`).then((data: any) => {
            const filteredData = data?.data?.filter((item:any) => item?.is_active === 1);
            setDataSubMenu(filteredData ||[]);
            // setDataSubMenu(data?.data||[])
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
            getData(`${FormEditURL}${id ? `/${id}` : ''}`).then((data: any) => {

                const datavalue = data?.data
                setForm({
                    form_name: datavalue?.form_name,
                    menu_master_id: datavalue?.menu_master_id,
                    sub_menu_master_id: datavalue?.sub_menu_master_id,
                    form_url: datavalue?.form_url,
                    form_description: datavalue?.form_description,
                    is_menu_visible: datavalue?.is_menu_visible,

                })
            })

        }
    }

    const handleChange = async (e: any) => {
        formRef?.current?.setFieldValue(e.target.name, e.target.value);
        const err = await formRef?.current?.validateForm()
        if (err && Object.keys(err).length > 0) {
            formRef?.current?.setErrors(err)
            formRef?.current?.setTouched(setNestedObjectValues(err, true))
            formRef?.current?.setFieldError(e.target.name, formRef?.current?.errors?.[e.target.name as keyof IForm])
            formRef?.current?.setFieldTouched(e.target.name, true)
        }
        setForm((prevUser:any) => {
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
        }
        setForm((prevUser:any) => {
            return {
                ...prevUser,
                [name]: booleanValue,
            };
        });
    };
    useEffect(() => {
        callAPI()
    }, [])
    // const handleSubmit = async (formData: { form_name: string; menu_master_id: string; sub_menu_master_id: string; form_url: string; form_description: string; is_menu_visible: boolean; }) => {
        const handleSubmit = async (
            formData: { form_name: string; menu_master_id: string; sub_menu_master_id: string; form_url: string; form_description: string; is_menu_visible: boolean; }, 
            { resetForm }: FormikHelpers<{ form_name: string; menu_master_id: string; sub_menu_master_id: string; form_url: string; form_description: string; is_menu_visible: boolean; }>
        ) => {
        formData.menu_master_id = String(formData.menu_master_id);
        formData.sub_menu_master_id = String(formData.sub_menu_master_id);

        const pathToCheck = form.form_url;
        const isPathAvailable = routes.some(route => route.path === pathToCheck);
        let formdata1 = {}
       if( formData.sub_menu_master_id === ""){
        formdata1= {
            form_name: formData.form_name,
            menu_master_id:formData.menu_master_id,
           
            form_url: formData.form_url,
            form_description: formData.form_description,
            is_menu_visibl: formData.is_menu_visible
        }
       }else{
        formdata1 = formData
       }

        if (id && isPathAvailable) {
            putData(`${FormEditURL}/${id}`, formdata1).then((data: any) => {
                if (data?.status === 200) {
                    navigator('/main/Form')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    setDataUrl(false)
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
            if(isPathAvailable){

                postData(`${FormAddURL}`, formdata1).then((data: any) => {
                    if (data?.status === 201) {
                        // navigator('/main/Form')
                        toast.success(data.message, {
                            hideProgressBar: true,
                            theme: "colored",
                        });
                        // resetForm({ values: initialState });
                        setForm({
                            form_name: "",
                            menu_master_id: "",
                            sub_menu_master_id: "",
                            form_url: "",
                            form_description: "",
                            is_menu_visible: false,
                    
                        })
                        setDataUrl(false)
                    }else {
                        toast.error(data.message || "Something went wrong!", {
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
            }else{
                setDataUrl(true);
            }
        }
    }
    const validationSchema = Yup.object().shape({
        form_name: Yup.string().required('Form name is required').matches(FormNamePattern, 'Please enter a valid Form name only characters allowed.'),
        menu_master_id: Yup.string().required('Menu master is required'),
        // sub_menu_master_id: Yup.string().required('Sub Menu Master is required'),
        form_url: Yup.string().required('Form URL is required'),
        form_description: Yup.string()
        // .required('Form Description is required'),
    });

    const privewurl =()=>{
        const pathToCheck = form.form_url;
        const isPathAvailable = routes.some(route => route.path === pathToCheck);
        
        console.log("privewurl rr",isPathAvailable)
       
        if (isPathAvailable) {
            setDataUrl(false);
            window.open(form.form_url, '_blank');
          } else {
            setDataUrl(true);
            window.open('/main/Form/404', '_blank');
          }
    }
    return (
        <>
            <div className='main-wrapper'>
                <div className="main-content">
                <div className='card p-lg-3'>
                    <div className='card-body'>
                        <Typography variant="h6">
                            {id ? <div className='main_title'>Edit Form</div> : <div className='main_title'>Add Form</div>}
                        </Typography>
                        <Formik
                            initialValues={{
                                form_name: form.form_name,
                                menu_master_id: form.menu_master_id,
                                sub_menu_master_id: form.sub_menu_master_id,
                                form_url: form.form_url,
                                form_description: form.form_description,
                                is_menu_visible: form.is_menu_visible,
                        
                            }}
                            // onSubmit={(formData:any)=>handleSubmit(formData)}
                            onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                            enableReinitialize
                            validationSchema={validationSchema}
                             innerRef={formRef}
                        >
                            {({ errors, values, touched,isValid,dirty }:any) => (
                                <Form>

                                    <div className='row gy-4 mt-0'>
                                    <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">Menu Master *</InputLabel>
                                                    <Select
                                                        onChange={handleChange}
                                                        label="Menu Master"
                                                        name="menu_master_id"
                                                        value={values?.menu_master_id}
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
                                                            dataMenu?.map((item: any) => (
                                                                <MenuItem value={item.id}
                                                                sx={{
                                                                    backgroundColor: inputfield(namecolor),
                                                                    color: inputfieldtext(namecolor),
                                                                    '&:hover': {
                                                                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                                                                    },
                                                                }}
                                                                >{item.menu_name}</MenuItem>
                                                            ))
                                                        }

                                                    </Select>
                                                </FormControl>
                                            </div>
                                            {errors.menu_master_id &&  touched.menu_master_id ? 
                                                <p style={{ color: 'red' }}>{errors.menu_master_id}</p>:<></>
                                            }
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">Sub Menu Master *</InputLabel>
                                                    <Select
                                                        onChange={handleChange}
                                                        label="Sub Menu Master"
                                                        name="sub_menu_master_id"
                                                        value={values?.sub_menu_master_id}
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
                                                            dataSubMenu?.map((item: any) => (
                                                                <MenuItem value={item.id}
                                                                sx={{
                                                                    backgroundColor: inputfield(namecolor),
                                                                    color: inputfieldtext(namecolor),
                                                                    '&:hover': {
                                                                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                                                                    },
                                                                }}
                                                                >{item.menu_name}</MenuItem>
                                                            ))
                                                        }

                                                    </Select>
                                                </FormControl>
                                            </div>
                                            {errors.sub_menu_master_id && touched.sub_menu_master_id ? 
                                                <p style={{ color: 'red' }}>{errors.sub_menu_master_id}</p> : <></>
                                            }
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                <TextField
                                                    type="text"
                                                    label="Form Name *"
                                                    name="form_name"
                                                    value={values.form_name}
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                />
                                                {errors.form_name && touched.form_name ?
                                                        <p style={{ color: 'red' }}>{errors.form_name}</p> : <></>
                                                }
                                            </div>
                                        </div>
                                        

                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                <TextField
                                                    label="Form URL *"
                                                    name="form_url"
                                                    value={values.form_url}
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, color:inputfieldtext(namecolor)}}>
                                                URL Example: <strong>/main/SubMenu</strong>
                                            </Typography>
                                            {errors.form_url &&  touched.form_url ? 
                                                <p style={{ color: 'red' }}>{errors.form_url}</p>:<></>
                                            }
                                            <div> {dataUrl && (
                                                <p style={{ color: 'red' }}>Please enter a valid URL.</p>
                                            )}</div>
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                <TextField
                                                    label="Form Description"
                                                    name="form_description"
                                                    value={values.form_description}
                                                    variant="outlined"
                                                    onChange={handleChange}
                                                   
                                                   
                                                />
                                            </div>
                                            {/* {errors.form_description &&  touched.form_description ? 
                                                <p style={{ color: 'red' }}>{errors.form_description}</p>:<></>
                                            } */}
                                        </div>
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper">
                                                <Typography sx={{ marginLeft: "15px", display: "flex", alignItems: "flex-start",color:inputfieldtext(namecolor) }}>Menu Visible</Typography>
                                                <RadioGroup
                                                    row
                                                    name="is_menu_visible"
                                                    value={values.is_menu_visible}
                                                    onChange={handleChangemenuVisible}
                                                >
                                                    <FormControlLabel value={true} control={<Radio className='radiobutton'  />} label="Yes" />
                                                    <FormControlLabel value={false} control={<Radio className='radiobutton' />} label="No" />
                                                </RadioGroup>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                        <button className='btn btn-primary mainbutton' >{id ? "Update" : "Save"}</button>
                                    {/* <button className='btn btn-primary btn-xs' type="button" style={{marginLeft:"10px", marginTop:"10px"}}  onClick={privewurl} > Preivew</button> */}
                                    <button
                                    
                                    //  size='large'
                                     
                                         onClick={privewurl}
                                        className="btn btn-outline-primary ms-3">
                                        Preivew
                                    </button>
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

export default AddEditForm