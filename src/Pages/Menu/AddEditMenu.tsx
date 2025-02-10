/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useRef, useState } from 'react';
import '../Menu/Menu.scss';
import TextField from '@mui/material/TextField';
import TextareaAutosize from 'react-textarea-autosize';
import useApi from '../../hooks/useAPI';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QUERY_KEYS_MENU } from '../../utils/const';
import { Grid, InputLabel, SelectChangeEvent, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { MenuListinter } from '../../Components/Table/columns';
import { dataaccess, inputfield, inputfieldtext } from '../../utils/helpers';
import NameContext from '../Context/NameContext';

interface IMenuForm {
  menu_name: string;
  priority: string;
}
const AddEditMenu = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const location = useLocation();
  const MenuAddURL = QUERY_KEYS_MENU.MENU_ADD;
  const MenuEditURL = QUERY_KEYS_MENU.MENU_EDIT;
  const { getData, postData, putData } = useApi();
  const Navigate = useNavigate();
  const { id } = useParams();
  const charPattern = /^[a-zA-Z\s]*$/;
  const numberPattern = /^\d+$/;
  const Menulist: any = localStorage.getItem('menulist1');

  const initialState = {
    menu_name: '',
    priority: '',
  };
  const [menu, setMenu] = useState(initialState);
  const formRef = useRef<FormikProps<IMenuForm>>(null);
  const pathSegments = location?.pathname?.split('/').filter(Boolean);
  const lastSegment = id
    ? pathSegments[pathSegments.length - 3]?.toLowerCase()
    : pathSegments[pathSegments.length - 2]?.toLowerCase();
  const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);

  const callAPI = async () => {
    if (id) {
      getData(`${MenuEditURL}${id ? `/${id}` : ''}`)
        .then((data: any) => {
          if(data.status){
            setMenu(data?.data);
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    }
  };
  useEffect(() => {
    setFilteredData(
      dataaccess(Menulist, lastSegment, { urlcheck: '' }, { datatest: '' }),
    );
  }, [Menulist]);

  if (
    (id && !filteredData?.form_data?.is_update) ||
    (!id && !filteredData?.form_data?.is_save)
  ) {
    Navigate('/main/Menu');
  }

  useEffect(() => {
    callAPI();
  }, []);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>,
    fieldName: string,
  ) => {
    setMenu((prevMenu) => {
      return {
        ...prevMenu,
        [e.target.name]: e.target.value,
      };
    });
    formRef?.current?.setFieldValue(fieldName, e.target.value);
    await formRef?.current?.validateField(fieldName);
    if (
      formRef?.current?.errors?.[fieldName as keyof IMenuForm] !== undefined
    ) {
      formRef?.current?.setFieldError(
        fieldName,
        formRef?.current?.errors?.[fieldName as keyof IMenuForm],
      );
      formRef?.current?.setFieldTouched(fieldName, true);
    }
  };
  const handleSubmit = async (
    menuData: IMenuForm,
    { resetForm }: FormikHelpers<IMenuForm>,
  ) => {
    const formData =new FormData();

    Object.entries(menuData).forEach(([key,value])=>{
       if(value !== undefined && value!==null){
        formData.append(key ,value);
       }
    })

    if (id) {
      putData(`${MenuEditURL}/${id}`, formData)
        .then((data: any) => {
          if (data.status) {
            Navigate('/main/Menu');
            toast.success(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          } else {
            toast.error(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    } else {
      postData(`${MenuAddURL}`, formData)
        .then((data: any) => {
          if (data.status) {
            toast.success(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
            resetForm({ values: initialState });
          } else {
            toast.error(data.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    }
  };
  const menuSchema = Yup.object().shape({
    menu_name: Yup.string()
      .required('Please enter Menu name')
      .test(
        'not-whitespace',
        'Please enter a valid Menu name; whitespace is not allowed.',
        (value: any) => value && value?.trim().length > 0,
      )
      .matches(
        charPattern,
        'Please enter a valid Menu name only characters allowed.',
      ),
    priority: Yup.string()
      .required('Please enter valid Menu sequence number')
      .matches(numberPattern, 'Please enter a valid Menu sequence number.'),
    menu_image: Yup.string(),
  });

  return (
    <>
      <div className="main-wrapper">
        <div className="main-content">
          <div className="card p-lg-3">
            <div className="card-body">
              <Typography variant="h6">
                {id ? (
                  <div className="main_title">Edit Menu</div>
                ) : (
                  <div className="main_title">Add Menu</div>
                )}
              </Typography>
              <Formik
                onSubmit={(formData, formikHelpers) =>
                  handleSubmit(formData, formikHelpers)
                }
                initialValues={{
                  menu_name: menu?.menu_name,
                  priority: menu?.priority,
                }}
                enableReinitialize
                validationSchema={menuSchema}
                innerRef={formRef}
              >
                {({ errors, values, touched }) => (
                  <Form>
                    <div className="row gy-4 mt-0">
                      <div className="col-md-4">
                        <div className="form_field_wrapper">
                          <Field
                            data-testid="menu_name"
                            component={TextField}
                            type="text"
                            name="menu_name"
                            label="Menu name *"
                            value={values?.menu_name}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange(e, 'menu_name')}
                            InputProps={{
                              style: {
                                backgroundColor: inputfield(namecolor),
                              },
                            }}
                            InputLabelProps={{
                              style: {
                                color: inputfieldtext(namecolor),
                              },
                            }}
                          />
                          {touched?.menu_name && errors?.menu_name ? (
                            <p style={{ color: 'red' }}>{errors?.menu_name}</p>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form_field_wrapper">
                          <Field
                            data-testid="priority"
                            component={TextField}
                            type="text"
                            name="priority"
                            label="Menu sequence *"
                            value={values?.priority}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange(e, 'priority')}
                            InputProps={{
                              style: {
                                backgroundColor: inputfield(namecolor),
                              },
                            }}
                            InputLabelProps={{
                              style: {
                                color: inputfieldtext(namecolor),
                              },
                            }}
                          />
                          {touched?.priority && errors?.priority ? (
                            <p style={{ color: 'red' }}>{errors?.priority}</p>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 mt-2">
                        <div className="col">
                          <Grid item xs={12}>
                            <Typography
                              variant="h6"
                              sx={{ color: inputfieldtext(namecolor) }}
                            >
                              Upload a Photo
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                              ) => handleChange(e, 'menu_image')}
                              style={{ color: inputfieldtext(namecolor) }}
                              id="file-upload"
                              name="menu_image"
                              data-testid="file-upload"
                            />
                          </Grid>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-md-4">
                        <InputLabel
                          className="text-secondary"
                          sx={{ color: inputfieldtext(namecolor) }}
                        >
                          Description
                        </InputLabel>
                        <TextareaAutosize
                          aria-label="empty textarea"
                          minRows={5}
                          style={{
                            width: '100%',
                            fontSize: '1rem',
                            backgroundColor: inputfield(namecolor),
                            color: inputfieldtext(namecolor),
                          }}
                          placeholder="Enter your text here..."
                        />
                      </div>
                    </div>
                    <div className=" mt-3">
                      <button
                        className="btn btn-primary mainbutton"
                        data-testid="save_btn"
                      >
                        {id ? 'Update' : 'Save'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddEditMenu;
