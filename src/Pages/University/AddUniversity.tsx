import { TextField, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import React, { useEffect, useState } from 'react'
import { QUERY_KEYS_UNIVERSITY } from '../../utils/const';
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

const AddUniversity = () => {
    const UniversityAddURL = QUERY_KEYS_UNIVERSITY.UNIVERSITY_ADD;
    const UniversityeditURL = QUERY_KEYS_UNIVERSITY.UNIVERSITY_GET;
    const UniversityupdateURL = QUERY_KEYS_UNIVERSITY.UNIVERSITY_UPDATE;
    const { postData, getData, putData } = useApi()
    const navigator = useNavigate()
    const { id } = useParams();

    const initialState = {
        // id: 0,
        university_name: "",
    };
    const [univesity, setUnivesity] = useState<any>(initialState);

    const callAPI = async () => {
        if (id) {
            getData(`${UniversityeditURL}${id ? `/${id}` : ""}`)
                .then((data: any) => {
                    setUnivesity(data?.data);
                })
                .catch((e) => {
                    toast.error(e?.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                });
        }
    };
    useEffect(() => {
        callAPI();
    }, []);
    const handleSubmit = async (universityData: any , { resetForm }: FormikHelpers<any>) => {

        if (id) {
            putData(`${UniversityupdateURL}/${id}`, universityData)
                .then((data: any) => {
                    // const linesInfo = data || [];
                    // dispatch(setLine(linesInfo))
                    if (data.status === 200) {
                        navigator("/main/University");
                        toast.success(data.message, {
                            hideProgressBar: true,
                            theme: "colored",
                        });
                    } else {
                        toast.error(data.message, {
                            hideProgressBar: true,
                            theme: "colored",
                        });

                    }
                })
                .catch((e) => {
                    toast.error(e?.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                });
        } else {
            postData(`${UniversityAddURL}`, universityData).then((data: { status: number, message: string }) => {
                if (data.status === 201) {
                    // navigator('/main/Course')
                    toast.success(data.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                    setUnivesity({ university_name: "" })
                    resetForm({ values: initialState });

                } else {
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
    const universitySchema = Yup.object().shape({
        university_name: Yup.string().required("Please enter university name")
        .test(
            "not-whitespace",
            "Please enter a valid university name;not-whitespace only characters allowed.",
            (value:any) => value && value?.trim().length > 0 
          ),
        
    })
    return (
        <>
            <div className='main-wrapper'>
                <div className="main-content">
                    <div className='card p-lg-3'>
                        <div className='card-body'>
                            <Typography variant="h6" className='mb-3'>
                                <div className='main_title'>{id ? "Edit" : "Add"} University</div>
                            </Typography>
                            <Formik
                                // onSubmit={(formData) => handleSubmit(formData)}
                                onSubmit={(formData, formikHelpers) => handleSubmit(formData, formikHelpers)}
                                initialValues={{
                                    university_name: univesity?.university_name,
                                }}
                                enableReinitialize
                            validationSchema={universitySchema}
                            // innerRef={formRef}
                            >
                                {({ errors, values, touched, isValid, dirty, handleChange, handleBlur }) => (
                                    <Form>
                                        <div className='row'>

                                            <div className='col-md-4'>
                                                <div className="form_field_wrapper">
                                                    <Field
                                                        name="university_name"
                                                        render={({ field, form }: any) => (
                                                            <TextField
                                                                {...field}
                                                                className="form-control"
                                                                label="University Name *"
                                                                error={Boolean(form.errors.university_name && form.touched.university_name)}
                                                                helperText={form.errors.university_name && form.touched.university_name ? form.errors.university_name : ""}
                                                                onBlur={form.handleBlur}
                                                                onChange={form.handleChange}
                                                            />
                                                        )}
                                                    />
                                                    {/* {touched?.course_name && errors?.course_name ?
                                                    <p style={{ color: 'red' }}>{errors?.course_name}</p> : <></>
                                                } */}
                                                </div>
                                            </div>
                                        </div>

                                        <div className=' mt-3'>
                                            <button className='btn btn-primary mainbutton' > Save</button>
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

export default AddUniversity