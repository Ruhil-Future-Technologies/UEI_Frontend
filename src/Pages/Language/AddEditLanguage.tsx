import React, { useContext, useEffect, useRef, useState } from 'react';
import '../Language/Language.scss';
import TextField from '@mui/material/TextField';
import TextareaAutosize from 'react-textarea-autosize';
import useApi from '../../hooks/useAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUERY_KEYS_LANGUAGE } from '../../utils/const';
import { Grid, InputLabel, SelectChangeEvent, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { Field, Form, Formik, FormikHelpers, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { LanguageRep0oDTO, MenuListinter } from '../../Components/Table/columns';
import { dataaccess, inputfield, inputfieldtext } from '../../utils/helpers';
import NameContext from '../Context/NameContext';
interface ILanguageForm {
    language_name: string
    // description:string
 }
const AddEditLanguage = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const LanguageAddURL = QUERY_KEYS_LANGUAGE.LANGUAGE_ADD;
    const LanguageEditURL = QUERY_KEYS_LANGUAGE.LANGUAGE_EDIT;
    const LanguageURL = QUERY_KEYS_LANGUAGE.GET_LANGUAGE;
    const { getData, postData, putData } = useApi();
    const navigate = useNavigate();
    const { id } = useParams();
    const formRef = useRef() as any
    const LanguageNamePattern = /^[a-zA-Z\s]*$/

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
        navigate('/main/Language');
    }

    const initialState = {
        language_name: "",
        // description: "",
    };
    const [language, setLanguage] = useState(initialState);
    const [selectedFile, setSelectedFile] = useState('');
    const [dataLanguage, setDataLanguage] = useState<LanguageRep0oDTO[]>([])

    useEffect(() => {
        if (id) {
            getData(`${LanguageEditURL}/${id}`).then((data) => {
                setLanguage(data?.data || initialState);
            }).catch(e => {
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                });
            });
        }
    }, [id, LanguageEditURL]);

    const callAPILanguage = async () => {
        getData(`${LanguageURL}`).then((data: any) => {
            if (data?.data) {
                setDataLanguage(data?.data)
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
useEffect(()=>{
    callAPILanguage()
},[])
    // const handleChange = async (e: any) => {
    //     const { name, value } = e.target;
    //     formRef?.current?.setFieldValue("language_name", e.target.value);
    //     const err = await formRef?.current?.validateForm()
    //     if (err && Object.keys(err).length > 0) {
    //         formRef?.current?.setErrors(err)
    //         formRef?.current?.setTouched(setNestedObjectValues(err, true))
    //         formRef?.current?.setFieldError(name, formRef?.current?.errors?.[name as keyof ILanguageForm])
    //         formRef?.current?.setFieldTouched(name, true)
    //     }
    //     setLanguage((prevLanguage:any) => ({
    //         ...prevLanguage,
    //         [name]: value,
    //     }));
    // };
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, fieldName: string) => {
        setLanguage((prevMenu) => {
            return {
                ...prevMenu,
                [e.target.name]: e.target.value,
            };
        });
      
        formRef?.current?.setFieldValue(fieldName, e.target.value);
        // await formRef?.current?.validateField(fieldName)
        const err = await formRef?.current?.validateForm(fieldName)
         // if (err && Object.keys(err).length > 0) {
        //     formRef?.current?.setErrors(err)
        //     formRef?.current?.setTouched(setNestedObjectValues(err, true))
        // }
        if (formRef?.current?.errors?.[fieldName as keyof ILanguageForm] !== undefined) {
            formRef?.current?.setFieldError(fieldName, formRef?.current?.errors?.[fieldName as keyof ILanguageForm])
            formRef?.current?.setFieldTouched(fieldName, true)
        }
    };
    


    // const handleSubmit = async (languageData: { language_name: string}) => {
       
            const handleSubmit = async (
                languageData: ILanguageForm, 
                { resetForm }: FormikHelpers<ILanguageForm>
            ) => {
        // console.log("test submit", languageData)
        if (id) {
            putData(`${LanguageEditURL}/${id}`, languageData).then((data) => {
                if (data.status === 200) {
                    navigate('/main/Language');
                    toast.success(data.message, {
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
            postData(LanguageAddURL, languageData).then((data) => {
                if (data.status === 200) {
                    // navigate('/main/Language');
                    callAPILanguage()
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    resetForm({ values: initialState });
                    setLanguage(initialState)
                }
            }).catch(e => {
                toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: "colored",
                });
            });
        }
    };
   let languageSchema;
    {
        if(id){
             languageSchema = Yup.object().shape({
                language_name: Yup.string()
                    .required("Please enter Language name")
                    .test(
                        "not-whitespace",
                        "Please enter a valid Language name; whitespace is not allowed.",
                        (value:any) => value && value?.trim().length > 0 
                      )
                    .matches(LanguageNamePattern, 'Please enter a valid Language name only characters allowed.')
                    .test('unique', 'Language name already exists', function (value) {
                        if (!value) return true;
                        
                        // Check if the value matches the current institute name
                        if (value.toLowerCase() === language?.language_name.toLowerCase()) {
                          return true;
                        }
                  
                        // Check for uniqueness against dataInstitute
                        const exists = dataLanguage?.some(inst => 
                          inst?.language_name && inst?.language_name.toLowerCase() === value?.toLowerCase()
                        );
                  
                        return !exists;
                      }),
                    // description: Yup.string()
                    // .required("Please enter description ")
                   
            })

        }else{
             languageSchema = Yup.object().shape({
                language_name: Yup.string()
                    .required("Please enter Language name")
                    .test(
                        "not-whitespace",
                        "Please enter a valid Language name; whitespace is not allowed.",
                        (value:any) => value && value?.trim().length > 0 
                      )
                    .matches(LanguageNamePattern, 'Please enter a valid Language name only characters allowed.')
                    .test('unique', 'Language name already exists', value => {
                        if (!value) return true;
                        const exists = dataLanguage?.some(inst => inst?.language_name && inst?.language_name?.toLowerCase() === value?.toLowerCase());
                        return !exists;
                    }),
                    // description: Yup.string()
                    // .required("Please enter description ")
                   
            })
        }
    }
    // const languageSchema = Yup.object().shape({
    //     language_name: Yup.string()
    //         .required("Please enter language name")
    //         .matches(LanguageNamePattern, 'Please enter a valid language Name only characters allowed.'),
    //         description: Yup.string()
    //         // .required("Please enter description ")
           
    // })

    return (
        <div className='main-wrapper'>
            <div className="main-content">
            <div className='card p-lg-3'>
                <div className='card-body'>
                    <Typography variant="h6" className='mb-3'>
                        {id ? <div className='main_title'>Edit Language</div> : <div className='main_title'>Add Language</div>}
                    </Typography>
                    <Formik
                            // onSubmit={(formData) => handleSubmit(formData)}
                            onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                    
                            initialValues={{
                                language_name:language?.language_name
                            }}
                           
                            enableReinitialize
                            validationSchema={languageSchema}
                            innerRef={formRef}
                        >
                    {({ errors, values ,touched , isValid, dirty}:any) => (
                        <Form>
                            <div className='row'>
                                <div className='col-md-4'>
                                    <div className="form_field_wrapper">
                                        {/* <TextField
                                            label="Language Name *"
                                            name="language_name"
                                            value={values.language_name}
                                            variant="outlined"
                                            // onChange={handleChange}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "language_name")}
                                            fullWidth
                                        /> */}
                                         <Field
                                                    component={TextField}
                                                    type="text"
                                                    label="Language Name *"
                                                    name="language_name"
                                                    value={values.language_name}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "language_name")}
                                                />
                                    {errors.language_name && touched.language_name ? 
                                        <p style={{ color: 'red' }} color="error">
                                            {errors.language_name}
                                        </p> : <></>
                                        
                                    }
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-4 mt-2'>
                                    <div className='col'>
                                        <Grid item xs={12}>
                                            <Typography variant="h6" sx={{color:inputfieldtext(namecolor)}}>Upload a Photo</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(event) => setSelectedFile(event.target.value)}
                                                id="file-upload"
                                                style={{ color:inputfieldtext(namecolor)}}
                                            />
                                        </Grid>
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-4'>
                                <div className='col-md-4'>
                                    <InputLabel className='text-secondary'  sx={{color:inputfieldtext(namecolor)}}>Description</InputLabel>
                                    <TextareaAutosize
                                        aria-label="empty textarea"
                                        minRows={5}
                                        style={{ width: "100%", fontSize: "1rem" ,backgroundColor:inputfield(namecolor) , color:inputfieldtext(namecolor)}}
                                        placeholder="Enter your text here..."
                                        name="description"
                                        value={values.description}
                                        // onChange={handleChange}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(e, "description")}

                                    />
                                        {/* <div> {values.description == "" && (
                                            <p style={{ color: 'red' }}>Please enter description.</p>
                                        )}</div> */}
                                         {/* {errors.description ? 
                                        <p style={{ color: 'red' }} color="error">
                                            {errors.description}
                                        </p> :
                                         <></>
                                        
                                    } */}
                                </div>
                            </div>
                            <div className='mt-3'>
                                <button type="submit" className='btn btn-primary mainbutton'  >{id ? "Update" : "Save"}</button>
                            </div>
                        </Form>
                    )}
                    </Formik>
                </div>
            </div>
            </div>
            
        </div>
    );
};

export default AddEditLanguage;
