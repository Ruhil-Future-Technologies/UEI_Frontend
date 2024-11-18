import React, { useEffect, useRef, useState } from 'react'
import '../Hobby/Hobby.scss';
import TextField from '@mui/material/TextField';
import useApi from '../../hooks/useAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUERY_KEYS_HOBBY } from '../../utils/const';
import { SelectChangeEvent, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { Field, Form, Formik, FormikHelpers, FormikProps, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { HobbyRep0oDTO, MenuListinter } from '../../Components/Table/columns';
import { dataaccess } from '../../utils/helpers';

interface IHobbyForm {
    hobby_name: string
    
}

const AddEditHobby = () => {
    const HobbyAddURL = QUERY_KEYS_HOBBY.HOBBY_ADD;
    const HobbyEditURL = QUERY_KEYS_HOBBY.HOBBY_EDIT;
    const HobbyURL = QUERY_KEYS_HOBBY.GET_HOBBY;
    const { getData, postData, putData } = useApi()
    const navigator = useNavigate()
    const { id } = useParams();

    const initialState = {
        hobby_name: "",
      
    };
    const [hobby, setHobby] = useState(initialState);
    const [dataHobby, setDataHobby] = useState<HobbyRep0oDTO[]>([])
    const formRef = useRef<FormikProps<{ hobby_name: string | null }>>(null)
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
    //         // const result = data?.submenus?.filter((menu: any) => menu.menu_name.toLowerCase() === lastSegment)
    //         const result = data?.submenus?.filter((menu: any) => {
    //             if (menu.menu_name.toLowerCase() === 'hobbies') {
    //               // Assuming menu.hobby exists and is the property you want to match with lastSegment
    //               return "hobby" === lastSegment;
    //             }
    //             return menu.menu_name.toLowerCase() === lastSegment
    //           });
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
        navigator('/main/Hobby')
    }
    const callAPI = async () => {
        if (id) {
            getData(`${HobbyEditURL}${id ? `/${id}` : ''}`).then((data: { data: IHobbyForm }) => {
                setHobby(data?.data)
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
    const callAPIHobby = async () => {
        getData(`${HobbyURL}`).then((data: { data: HobbyRep0oDTO[] }) => {
            if (data.data) {
                setDataHobby(data?.data)
            }
        }).catch(e => {
            if (e?.response?.status === 401) {
                // navigate("/")
            }
            // toast.error(e?.message, {
            //     hideProgressBar: true,
            //     theme: "colored",
            // });
        });
    }

    useEffect(() => {
        callAPI()
        callAPIHobby()
    }, [])

    // const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, fieldName: string) => {
        // setHobby(e.target.value);
        setHobby((prevHobby) => {
            return {
                ...prevHobby,
                [e.target.name]: e.target.value,
            };
        });
        formRef?.current?.setFieldValue(fieldName, e.target.value);
        const err = await formRef?.current?.validateForm(fieldName)
        // if (err && Object.keys(err).length > 0) {
        //     formRef?.current?.setErrors(err)
        //     formRef?.current?.setTouched(setNestedObjectValues(err, true))
        // }
        if (formRef?.current?.errors?.[fieldName as keyof IHobbyForm] !== undefined) {
            formRef?.current?.setFieldError(fieldName, formRef?.current?.errors?.[fieldName as keyof IHobbyForm])
            formRef?.current?.setFieldTouched(fieldName, true)
        }
    };

    // const handleSubmit = async (hobbyData: { hobby_name: string | null }) => {
        const handleSubmit = async (
            hobbyData: { hobby_name: string | null },
            { resetForm }: FormikHelpers<{ hobby_name: string | null }>
        ) => {
        // console.log("hobbyData-->", hobbyData)
        if (id) {
            putData(`${HobbyEditURL}/${id}`, hobbyData).then((data: { status: number; message:string }) => {
                if (data.status === 200) {
                    navigator('/main/Hobby')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    callAPIHobby()
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
            postData(`${HobbyAddURL}`, hobbyData).then((data: { status: number; message:string }) => {
                if (data.status === 200) {
                    // navigator('/main/Hobby')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    callAPIHobby()
                    // setHobby("")
                    resetForm({ values: initialState });
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

    let hobbySchema;
{
    if(id){
         hobbySchema = Yup.object().shape({
            hobby_name: Yup.string()
                .required("Please enter hobby name")
                .test(
                    "not-whitespace",
                    "Please enter a valid hobby name; whitespace is not allowed.",
                    (value:any) => value && value?.trim().length > 0 
                  )
                .matches(/^[a-zA-Z\s]*$/, 'Please enter a valid hobby name only characters allowed.')
                .test('unique', 'Hobby name already exists', function (value) {
                    if (!value) return true;
                    
                    // Check if the value matches the current institute name
                    if (value.toLowerCase() === hobby?.hobby_name.toLowerCase()) {
                      return true;
                    }
              
                    // Check for uniqueness against dataInstitute
                    const exists = dataHobby.some(inst => 
                      inst.hobby_name && inst.hobby_name.toLowerCase() === value.toLowerCase()
                    );
              
                    return !exists;
                  }),
        })

    }else{
         hobbySchema = Yup.object().shape({
            hobby_name: Yup.string()
                .required("Please enter Hobby name")
                .test(
                    "not-whitespace",
                    "Please enter a valid hobby name; whitespace is not allowed.",
                    (value:any) => value && value?.trim().length > 0 
                  )
                .matches(/^[a-zA-Z\s]*$/, 'Please enter a valid Hobby name only characters allowed.')
                .test('unique', 'Hobby name already exists', value => {
                    if (!value) return true;
                    const exists = dataHobby?.some(inst => inst.hobby_name && inst.hobby_name?.toLowerCase() === value?.toLowerCase());
                    return !exists;
                }), 
        })

    }
}
    // const hobbySchema = Yup.object().shape({
    //     hobby_name: Yup.string()
    //         .required("Please enter hobby name")
    //         .matches(/^[a-zA-Z\s]*$/, 'Please enter a valid hobby name only characters allowed.')
    // })

    return (
        <>
            <div className='main-wrapper'>
                <div className="main-content">
                <div className='card p-lg-3'>
                    <div className='card-body'>
                        <Typography variant="h6">
                            <div className='main_title mb-3'>{id ? "Edit" : "Add"} Hobbies</div>
                        </Typography>
                        <Formik
                            // onSubmit={(formData) => handleSubmit(formData)} 
                            onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                            initialValues={{
                                hobby_name: hobby?.hobby_name
                            }}
                            enableReinitialize
                            validationSchema={hobbySchema}
                            innerRef={formRef}
                        >
                            {({ errors, values, touched ,isValid,dirty}) => (
                                <Form>
                                    <div className='row'>
                                        <div className='col-md-4'>
                                            <div className="form_field_wrapper mb-4">
                                                <Field
                                                    component={TextField}
                                                    type="text"
                                                    label="Hobby Name *"
                                                    name="hobby_name"
                                                    value={values?.hobby_name}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e,"hobby_name")}
                                                />
                                                {touched?.hobby_name && errors?.hobby_name ?
                                                    <p style={{ color: 'red' }}>{errors?.hobby_name}</p> : <></>
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
        </>
    )
}

export default AddEditHobby