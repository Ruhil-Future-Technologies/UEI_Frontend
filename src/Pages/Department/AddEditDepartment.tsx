import React, { useContext, useEffect, useRef, useState } from 'react'
import '../Department/Department.scss';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import useApi from '../../hooks/useAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUERY_KEYS_DEPARTMENT } from '../../utils/const';
import { toast } from 'react-toastify';
import { DepartmentRep0oDTO, MenuListinter } from '../../Components/Table/columns';
import { Field, Form, Formik, FormikHelpers, FormikProps, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { dataaccess, inputfield, inputfieldtext } from '../../utils/helpers';
import NameContext from '../Context/NameContext';

const AddEditDepartment = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const DepartmentAddURL = QUERY_KEYS_DEPARTMENT.DEPARTMENT_ADD;
    const DepartmentEditURL = QUERY_KEYS_DEPARTMENT.DEPARTMENT_EDIT;
    const { getData, postData, putData } = useApi()
    const navigator = useNavigate()
    const { id } = useParams();
    const userdata = JSON.parse(localStorage.getItem('userdata') || '')
    const [department, setDepartment] = useState<string | null>("");
    const formRef = useRef<FormikProps<{ department_name: string | null }>>(null)
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
        navigator('/main/Department')
    }

    const callAPI = async () => {
        if (id) {
            getData(`${DepartmentEditURL}${id ? `/${id}` : ''}`).then((data: { data: DepartmentRep0oDTO }) => {
                setDepartment(data?.data?.department_name)
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

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setDepartment(e.target.value);
        formRef?.current?.setFieldValue("department_name", e.target.value);
        const err = await formRef?.current?.validateForm()
        if (err && Object.keys(err).length > 0) {
            formRef?.current?.setErrors(err)
            formRef?.current?.setTouched(setNestedObjectValues(err, true))
        }
    };

    // const handleSubmit = async (formData: { department_name: string | null; }) => {
        const handleSubmit = async (
            formData: { department_name: string | null;},
            { resetForm }: FormikHelpers<{ department_name: string| null; }>
        ) => {
        const payload = {
            ...formData,
            created_by: userdata?.id
        }
        if (id) {
            putData(`${DepartmentEditURL}/${id}`, payload).then((data: { status: number,message:string }) => {
                if (data.status === 200) {
                    navigator('/main/Department')
                    toast.success(data.message, {
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
                if (e?.response?.status === 401) {
                    navigator("/")
                }
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                });
            });
        } else {
            postData(`${DepartmentAddURL}`, payload).then((data: { status: number,message:string }) => {
                if (data.status === 200) {
                    // navigator('/main/Department')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    setDepartment("")
                }else{
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

    const departmentSchema = Yup.object().shape({
        department_name: Yup.string()
            .required("Please enter Department name")
            .test(
                "not-whitespace",
                "Please enter a valid Department name; whitespace is not allowed.",
                (value:any) => value && value?.trim().length > 0 
              ) 
            .matches(/^[a-zA-Z\s]*$/, 'Please enter a valid Department name only characters allowed.')
    })
console.log("ttttt",inputfield(namecolor))
    return (
        <div className='main-wrapper'>
            <div className="main-content">
            <div className='card p-lg-3'>
                <div className='card-body'>
                    <Typography variant="h6" className='mb-3'>
                        <div className='main_title'>{id ? "Edit" : "Add"} Department</div>
                    </Typography>
                    <Formik
                        // onSubmit={(formData) => handleSubmit(formData)}
                        onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                        initialValues={{
                            department_name: department
                        }}
                        enableReinitialize
                        validationSchema={departmentSchema}
                        innerRef={formRef}
                    >
                        {({ errors, values, touched,isValid,dirty }:any) => (
                            <Form>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className="form_field_wrapper mb-4">
                                            <Field
                                                component={TextField}
                                                type="text"
                                                label="Department Name *"
                                                name="department_name"
                                                value={values?.department_name}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
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
                                            {touched?.department_name && errors?.department_name ?
                                                <p style={{ color: 'red' }}>{errors?.department_name}</p> : <></>
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

export default AddEditDepartment