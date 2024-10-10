import * as React from 'react';

import { Card, CardContent,  SelectChangeEvent,  TextField } from '@mui/material';

import { useState, useEffect, useRef } from 'react';
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Field, Form, Formik, FormikProps, setNestedObjectValues } from 'formik';
import * as Yup from 'yup';
import { deepEqual, inputfieldtext } from '../../utils/helpers';
import NameContext from '../Context/NameContext';
interface IAdminDescription {
    description: string
 }


// console.log(adminId);

export default function AdminDescription() {
    const initialState = {
        description: "",
       
    };
    const context = React.useContext(NameContext);
    const {namecolor }:any = context;
    let adminId = localStorage.getItem('_id')
    const { getData, postData, putData,loading } = useApi();
    const [description, setDesctiption] = useState(initialState);
    const [editFalg,setEditFlag]=useState<boolean>(false);
    const navigator = useNavigate()
    // const formRef = useRef() as any
    const formRef = useRef<FormikProps<IAdminDescription>>(null)

    const getDescription=async ()=>{
        try {
            const response=await  getData('admin_profile_description/edit/' + adminId);

            if (response && response?.status === 200) {
                setDesctiption(response?.data);
            }else if(response && response?.status===404){
               setEditFlag(true);
            } else {
                console.error("Unexpected response:", response);
            }
        } catch (error:any) {
            if(error?.response && error?.response?.status===401){
                navigator("/")
                toast.warning(("Please login again"),{
                    hideProgressBar:true,
                    theme:"colored"
                })
            }else{
                toast.error(("Request failed"),{
                    hideProgressBar:true,
                    theme:"colored"
                })
            }
        }
    }
    useEffect(() => {
        getDescription();
       
    }, [adminId])
    // const handleChange = async (e: any) => {
    //     const { name, value } = e.target;
    //     formRef?.current?.setFieldValue(e.target.name, e.target.value);
    //     const err = await formRef?.current?.validateForm()
    //     if (err && Object.keys(err).length > 0) {
    //         formRef?.current?.setErrors(err)
    //         formRef?.current?.setTouched(setNestedObjectValues(err, true))
    //         formRef?.current?.setFieldError(name, formRef?.current?.errors?.[name as keyof IAdminDescription])
    //         formRef?.current?.setFieldTouched(name, true)
    //     }
    //     setDesctiption(value);
    // };
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>, fieldName: string) => {
        setDesctiption((prevMenu) => {
            return {
                ...prevMenu,
                [e.target.name]: e.target.value,
            };
        });
        formRef?.current?.setFieldValue(fieldName, e.target.value);
        await formRef?.current?.validateField(fieldName)
        if (formRef?.current?.errors?.[fieldName as keyof IAdminDescription] !== undefined) {
            formRef?.current?.setFieldError(fieldName, formRef?.current?.errors?.[fieldName as keyof IAdminDescription])
            formRef?.current?.setFieldTouched(fieldName, true)
        }
    };
    // const submitHandle = (event: any,descriptionData:{description:string}) => {
        const submitHandle = async (description1: IAdminDescription) => {
            const eq = deepEqual(description1,formRef?.current?.initialValues)
        // event.preventDefault();
        let paylod = {
            admin_id: adminId,
            description: description1?.description
        }
        if(editFalg){
            const saveData=async ()=>{
                try {
                    const response=await postData('admin_profile_description/add', paylod);
          
                    if (response?.status === 200) {
                        toast.success("Admin description saved successfully", {
                            hideProgressBar: true,
                            theme: "colored"
                        })
                    }
                } catch (error:any) {
                    if(error?.response?.status === 401){
                        toast.warning(("Please login again"),{
                            hideProgressBar:true,
                            theme:"colored"
                        })
                    }else{
                        toast.error(("Request failed"),{
                            hideProgressBar:true,
                            theme:"colored"
                        })
                    }
                }
            }
         saveData();
           
        }else if(!editFalg){
            const editData=async ()=>{
                try {
                    const response=await putData('admin_profile_description/edit/'+adminId,paylod);
        
                    if(response?.status === 200){
                         toast.success("Admin description updated successfully",{
                            hideProgressBar:true,
                            theme:"colored"
                         })
                         getDescription()
                    }else{
                        toast.error(("something want wrong "),{
                            hideProgressBar:true,
                            theme:"colored"
                        })
                    } 
                } catch (error:any) {
                    if(error?.response?.status===401){
                        navigator("/")
                        toast.warning(("Please login again"),{
                            hideProgressBar:true,
                            theme:"colored"
                        })
                    }else{
                        toast.error(("Request failed"),{
                            hideProgressBar:true,
                            theme:"colored"
                        })
                    }
                }
             
            }

                 // eslint-disable-next-line no-lone-blocks
                 {!eq && (

                     editData()
                 )}
         
        }
       
    }
     const descriptionSchema = Yup.object().shape({
        description: Yup.string()
            .required("Please enter Description")
    })
    return (

          
            <Formik
        onSubmit={(formData) => submitHandle(formData)}
        initialValues={{
            description:description?.description
        }}
        enableReinitialize
        validationSchema={descriptionSchema}
        innerRef={formRef}
    >
        {({ errors, values ,touched , isValid, dirty}:any) => (
            <Form>

                <Card className='description' style={{ margin: "15px" }}>

                    <CardContent className='description'>
                        {/* <TextField
                            id="description"
                            label="Description *"
                            multiline
                            rows={9}
                            fullWidth
                            margin="normal"
                            value={values.description}
                            onChange={handleChange}
                        /> */}
                        
                            <Field
                                id="description"
                                label="Description *"
                                component={TextField}
                                type="text"
                                name="description"
                                fullWidth
                                rows={9}
                                multiline
                                margin="normal"
                                value={values?.description}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, "description")}
                                InputProps={{
                                    style: {
                                        color: inputfieldtext(namecolor), // Change this to your desired text color
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        color:inputfieldtext(namecolor), // Change this to your desired label color
                                    },
                                }}
                                
                            />
                            {touched?.description && errors?.description ?
                                <p style={{ color: 'red' }}>{errors?.description}</p> : <></>
                                            }
                    </CardContent>
                </Card>
                <div className='row justify-content-center' style={{margin:"10px"}}>

                    <div className="col-2">
                        <button className='btn btn-primary  mainbutton'  >{editFalg?"save":"save changes"}</button>
                    </div>

                </div>
            </Form>
        )}
        </Formik>
        
 
    );
}
