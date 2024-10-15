import React, { useContext, useEffect, useRef, useState } from 'react';
import '../Class/Class.scss';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import useApi from '../../hooks/useAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUERY_KEYS_CLASS} from '../../utils/const';
import { toast } from 'react-toastify';
import { Field, Form, Formik, FormikHelpers, FormikProps, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { MenuListinter } from '../../Components/Table/columns';
import { dataaccess, inputfield, inputfieldhover, inputfieldtext } from '../../utils/helpers';
import NameContext from '../Context/NameContext';

const AddEditClass = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const ClassAddURL = QUERY_KEYS_CLASS.CLASS_ADD;
    const ClassEditURL = QUERY_KEYS_CLASS.CLASS_EDIT;
    const ClassGetEditURL = QUERY_KEYS_CLASS.CLASS_GET_EDIT;
    const ClassNamePattern = /^[a-zA-Z\s]*$/
    const { getData, postData, putData } = useApi()
    const navigator = useNavigate()
    const { id } = useParams();
    const [entity, setEntity] = useState("");
    const [classnm, setClassnm] = useState("");
    const formRef = useRef<FormikProps<{ class_name: string }>>(null)
    const location = useLocation();
    const Menulist: any = localStorage.getItem('menulist1');
    const pathSegments = location.pathname.split('/').filter(Boolean);    
    const lastSegment =  id ? pathSegments[pathSegments.length - 3].toLowerCase(): pathSegments[pathSegments.length - 2].toLowerCase();
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);
    const [selectedSubject, setSelectedSubject] = useState('');

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
        navigator("/main/class")
    }

    const callAPI = async () => {
        if (id) {
            getData(`${ClassGetEditURL}${id ? `/${id}` : ''}`).then((data: { data: { class_name: string }; }) => {
                setClassnm(data?.data?.class_name)
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

    // const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setClassnm(e.target.value);
    //     formRef?.current?.setFieldValue("class_name", e.target.value);
    //     const err = await formRef?.current?.validateForm()
    //     if (err && Object.keys(err).length > 0) {
    //         formRef?.current?.setErrors(err)
    //         formRef?.current?.setTouched(setNestedObjectValues(err, true))
    //     }
    // };
    const handleChange = async (e: SelectChangeEvent<string>) => {
        setClassnm(e.target.value);
        formRef?.current?.setFieldValue("class_name", e.target.value);
        const err = await formRef?.current?.validateForm()
        if (err && Object.keys(err).length > 0) {
            formRef?.current?.setErrors(err);
            formRef?.current?.setTouched(setNestedObjectValues(err, true));
        }
    };
  
    // const handleSubmit = async (formData: { entity_type: string; }) => {
        const handleSubmit = async (
            formData: { class_name: string },
            { resetForm }: FormikHelpers<{ class_name: string }>
        ) => {
        if (id) {
            putData(`${ClassEditURL}/${id}`, formData).then((data: { status: number; message:string }) => {
                if (data.status === 200) {
                    navigator('/main/Class')
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
                if (e?.response?.status === 401) {
                    navigator("/")
                }
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                });
            });
        } else {
            postData(`${ClassAddURL}`, formData).then((data: { status: number;message:string }) => {
                if (data.status === 200) {
                    // navigator('/main/Entity')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    
                    resetForm({ values:{ class_name:""} });
                    setClassnm("")
                   
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

    const classSchema = Yup.object().shape({
        class_name: Yup.string()
            .required("Please enter Class name")
            // .matches(ClassNamePattern, 'Please enter a valid Class name only characters allowed.')
    })
// Create an array for classes from 1 to 12
const classes = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
console.log("test",classes,selectedSubject)
    return (
        <div className='main-wrapper'>
            <div className="main-content">
            <div className='card p-lg-3'>
                <div className='card-body'>
                    <Typography variant="h6" className='mb-3'>
                        <div className='main_title'>{id ? "Edit" : "Add"} Class</div>
                    </Typography>
                    <Formik
                        // onSubmit={(formData) => handleSubmit(formData)}
                        onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                        initialValues={{
                            class_name: classnm
                            
                        }}
                        enableReinitialize
                        validationSchema={classSchema}
                        innerRef={formRef}
                    >
                        {({ errors, values, touched ,isValid,dirty }) => (
                            <Form>
                                <div className='row '>
                                    <div className='col-md-4'>
                                        <div className="form_field_wrapper mb-4">
                                            {/* <Field
                                                component={TextField}
                                                type="text"
                                                name="class_name"
                                                placeholder="Class name"
                                                label="Class name *"
                                                value={values?.class_name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                                // onChange={handleChange}
                                                //   error={touched.entity_type && !!errors.entity_type}
                                                //   helperText={touched.entity_type && errors.entity_type}
                                            /> */}
                                             <FormControl sx={{ minWidth: 300}}>
                                    <InputLabel id="select-subject-label"  sx={{color:inputfieldtext(namecolor)}}>class_name *</InputLabel>
                                    <Select
                                        labelId="select-subject-label"
                                        value={values?.class_name}
                                        onChange={handleChange}
                                        label="Select subject *"
                                        variant="outlined"
                                        name="class_name"
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
                                        {classes.map((item:any) => (
                                            <MenuItem key={`class_${item}`} value={`class_${item}`}
                                            sx={{
                                                backgroundColor: inputfield(namecolor),
                                                color: inputfieldtext(namecolor),
                                                '&:hover': {
                                                    backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                                                },
                                            }}
                                            
                                            >
                                                {`class_${item}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                            {touched?.class_name && errors?.class_name ?
                                                <p style={{ color: 'red' }}>{errors?.class_name}</p> : <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <button className='btn btn-primary mainbutton'  >{id ? "Update" : "Save"}</button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            </div>
            
        </div>
    )
}

export default AddEditClass