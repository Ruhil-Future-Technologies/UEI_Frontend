import React, { useContext, useEffect, useRef, useState } from 'react'
import '../Submenu/Submenu.scss';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, Typography } from '@mui/material';
import useApi from '../../hooks/useAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUERY_KEYS_SUBMENU } from '../../utils/const';
import { toast } from 'react-toastify';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { MenuListinter } from '../../Components/Table/columns';
import { dataaccess, inputfield, inputfieldhover, inputfieldtext } from '../../utils/helpers';
import NameContext from '../Context/NameContext';

interface ISubMenuForm {
    menu_name: string
    priority: string
    menu_master_id:string
}
const AddEditSubmenu = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const SubmenuMenuURL = QUERY_KEYS_SUBMENU.GET_MENU;
    const SubmenuAddURL =QUERY_KEYS_SUBMENU.SUBMENU_ADD;
    const SubmenuEditURL = QUERY_KEYS_SUBMENU.SUBMENU_EDIT;
    const { getData, postData, putData } = useApi()
    const navigator = useNavigate()
    const { id } = useParams();
    const charPattern = /^[a-zA-Z\s]*$/;
    const numberPattern = /^\d+$/;

    const initialState = {
        menu_name: "",
        menu_master_id: "",
        priority: ""
    };
    const [submenu, setSubmenu] = useState(initialState);
    const [dataMenu, setDataMenu] = useState<any>([])
    // const [submenunm, setSubmenunm] = useState<boolean>(false)
    // const [priorityvalid, setPriorityvalid] = useState<boolean>(false)
    const formRef = useRef<FormikProps<ISubMenuForm>>(null)

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
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck:  "sub menu"},{ datatest: "submenu" }));
    }, [Menulist,lastSegment])
  
    
    if ((id && !filteredData?.form_data?.is_update) || (!id && !filteredData?.form_data?.is_save)) {
        navigator('/main/Submenu')
    }


    const callAPI = async () => {
        getData(`${SubmenuMenuURL}`).then((data: any) => {
            // const linesInfo = data || [];
            // dispatch(setLine(linesInfo))
            const filteredData = data?.data.filter((item:any )=> item?.is_active === 1);
            setDataMenu(filteredData);
            // setDataMenu(data?.data)
        }).catch((e)=>{
            toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
                });

        })
        if (id) {
            getData(`${SubmenuEditURL}${id ? `/${id}` : ''}`).then((data: any) => {
                // const linesInfo = data || [];
                // dispatch(setLine(linesInfo))
                // setDataMenu(data?.data)


                setSubmenu(data?.data)
            }).catch((e)=>{
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                    });
    
            })

        }
    }
    useEffect(() => {
        callAPI()
    }, [])
    // const handleChange = (e: any) => {
    //     const { name, value } = e.target;
    //     if (name === 'submenu_name') {
    //         if (!/^[a-zA-Z\s]*$/.test(value)) {
    //             setSubmenunm(true)
    //         } else {
    //             setSubmenunm(false)
    //         }
    //     } else if (name === 'priority') {
    //         if (!/^\d$/.test(value)) {
    //             setPriorityvalid(true)
    //         } else {
    //             setPriorityvalid(false)
    //         }
    //     }

    //     setSubmenu((prevUser) => {
    //         return {
    //             ...prevUser,
    //             [e.target.name]: e.target.value,
    //         };
    //     });
    // };
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, fieldName: string) => {
        setSubmenu((prevMenu) => {
            return {
                ...prevMenu,
                [e.target.name]: e.target.value,
            };
        });
        formRef?.current?.setFieldValue(fieldName, e.target.value);
        await formRef?.current?.validateField(fieldName)
        if (formRef?.current?.errors?.[fieldName as keyof ISubMenuForm] !== undefined) {
            formRef?.current?.setFieldError(fieldName, formRef?.current?.errors?.[fieldName as keyof ISubMenuForm])
            formRef?.current?.setFieldTouched(fieldName, true)
        }
    };

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, submenuData: { menu_name: string;priority: string; menu_master_id: string; }) => {
        // const handleSubmit = async (submenuData: ISubMenuForm) => {
            const handleSubmit = async (
                submenuData: ISubMenuForm, 
                { resetForm }: FormikHelpers<ISubMenuForm>
            ) => {
        // e.preventDefault()
        // e.target.reset()
        if (id) {
            putData(`${SubmenuEditURL}/${id}`, submenuData).then((data: any) => {
                // const linesInfo = data || [];
                // dispatch(setLine(linesInfo))
                if (data.status === 200) {
                    navigator('/main/Submenu')
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
            }).catch((e)=>{
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                    });
    
            })
        } else {
            postData(`${SubmenuAddURL}`, submenuData).then((data: any) => {
                // const linesInfo = data || [];
                // dispatch(setLine(linesInfo))
                if (data.status === 200) {
                    // navigator('/main/Submenu')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    resetForm({ values: initialState });
                }

                else {
                    toast.error(("Please add menu first"),
                        {
                            hideProgressBar: true,
                            theme: "colored",
                        })
                }
            }).catch((e) => {

                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                    });
    
            })
        }
    }
    const submenuSchema = Yup.object().shape({
        menu_name: Yup.string()
            .required("Please enter submenu name")
            .matches(charPattern, 'Please enter valid Submenu name only characters allowed.'),
            priority: Yup.string()
            .required("Please enter valid menu sequence number")
            .matches(numberPattern, 'Please enter valid menu sequence number.'),
            menu_master_id: Yup.string()
            .required("Please select menu name"),
    })

    return (
        <>
            <div className='main-wrapper'>
                <div className="main-content">
                <div className='card p-lg-3'>
                    <div className='card-body'>
                        <Typography variant="h6" >
                            {id ? <div className='main_title'>Edit Submenu</div> : <div className='main_title'>Add Submenu</div>}
                        </Typography>
                        <Formik
                        // onSubmit={(formData) => handleSubmit(formData)}
                        onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                        initialValues={{
                            menu_name: submenu?.menu_name,
                            priority: submenu?.priority,
                            menu_master_id:submenu?.menu_master_id
                           
                        }}
                        enableReinitialize
                        validationSchema={submenuSchema}
                        innerRef={formRef}
                    >
                         {({ errors, values, touched }) => (
                            <Form>
                        {/* <form onSubmit={(e) => handleSubmit(e, submenu)}> */}

                            <div className='row gy-4 mt-0'>
                            <div className='col-md-4'>
                                    <div className="form_field_wrapper">
                                        {/* <label>Speciality</label> */}
                                        {/* <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Menu</InputLabel>
                                            <Select
                                                // id="demo-simple-select"
                                                // value={speciality}
                                                onChange={handleChange}
                                                label="Menu"
                                                name="menu_master_id"
                                                value={submenu?.menu_master_id}
                                                variant="outlined"
                                            >
                                                {
                                                    dataMenu.map((item: any) => (
                                                        <MenuItem value={item.id}>{item.menu_name}</MenuItem>
                                                    ))
                                                }

                                            </Select>
                                        </FormControl> */}
                                          <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Menu name *</InputLabel>
                                                <Select
                                                    onChange={(e: SelectChangeEvent<string>) => handleChange(e, "menu_master_id")}
                                                    label="Menu"
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
                                                    {dataMenu.map((item: { id: string | number | readonly string[] | undefined; menu_master_id: any; menu_name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, idx: number) => (
                                                        <MenuItem value={item.id} key={`${item.menu_master_id}-${idx + 1}`} 
                                                        sx={{
                                                            backgroundColor: inputfield(namecolor),
                                                            color: inputfieldtext(namecolor),
                                                            '&:hover': {
                                                                backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                                                            },
                                                        }}
                                                        >{item.menu_name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {touched?.menu_master_id && errors?.menu_master_id ?
                                                <p style={{ color: 'red' }}>{errors?.menu_master_id}</p> : <></>
                                            }
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className="form_field_wrapper">
                                        {/* <TextField
                                            label="Submenu name"
                                            name="menu_name"
                                            value={submenu.menu_name}
                                            variant="outlined"
                                            onChange={handleChange}
                                     
                                        /> */}
                                         <Field
                                                component={TextField}
                                                type="text"
                                                name="menu_name"
                                                label="Submenu name *"
                                                value={values?.menu_name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "menu_name")}
                                            />
                                            {touched?.menu_name && errors?.menu_name ?
                                                <p style={{ color: 'red' }}>{errors?.menu_name}</p> : <></>
                                            }
                                    </div>
                                    {/* {submenunm && (
                                        <p style={{ color: 'red' }}>Please enter a valid Submenu name Only characters allowed.</p>
                                    )} */}
                                </div>
                                <div className='col-md-4'>
                                    <div className="form_field_wrapper">
                                        {/* <TextField
                                            // type='number'
                                            label="Sequence"
                                            name="priority"
                                            value={submenu.priority}
                                            variant="outlined"
                                            onChange={handleChange}
                                        /> */}
                                         <Field
                                                component={TextField}
                                                type="text"
                                                name="priority"
                                                label="Menu sequence *"
                                                value={values?.priority}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "priority")}
                                            />
                                            {touched?.priority && errors?.priority ?
                                                <p style={{ color: 'red' }}>{errors?.priority}</p> : <></>
                                            }
                                    </div>
                                    {/* {priorityvalid && (
                                        <p style={{ color: 'red' }}>Please enter a valid Priority Only digits allowed.</p>
                                    )} */}
                                </div>
                                
                            </div>
                            <button className='btn btn-primary mainbutton mt-4'>{id ? "Update" : "Save"}</button>
                        {/* </form> */}
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

export default AddEditSubmenu