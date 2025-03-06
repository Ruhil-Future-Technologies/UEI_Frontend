/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { FormControl, MenuItem, Select, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';
import {
  commonStyle,
  deepEqual,
  fieldIcon,
  inputfieldtext,
} from '../../utils/helpers';
import NameContext from '../Context/NameContext';
import { ChildComponentProps } from '../StudentProfile';

const AdminContactDetails: React.FC<ChildComponentProps> = ({
  setActiveForm,
}) => {
  const context = React.useContext(NameContext);
  const { namecolor }: any = context;
  const adminUuId = localStorage.getItem('user_uuid');
  const adminId= localStorage.getItem('_id');
  const { getData, postData, putData } = useApi();
  const [contcodeWtsap, setContcodeWtsap] = useState('+91');
  const [whatsappNum, setWhatsappNum] = useState('');
  const [contcodePhone, setContcodePhone] = useState('+91');
  const [phoneNum, setPhoneNum] = useState('');
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const [contectId, setContectId] = useState();
  const [errors, setErrors] = useState({
    phoneNum: '',
    email: '',
    whatsappNum: '',
  });
  const [initialState, setInitialState] = useState<any | null>({});
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };
  const phoneCodes = [
    { value: '+91', label: '+91' },
    { value: '+971', label: '+971' },
    { value: '+1', label: '+1' },
  ];

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    switch (name) {
      case 'phoneNum':
        setPhoneNum(value);
        setErrors({
          ...errors,
          phoneNum: !/^(?!0{10})[0-9]{10}$/.test(value)
            ? 'Mobile number should be 10 digits'
            : '',
        });
        break;
      case 'whatsappNum':
        setWhatsappNum(value);
        setErrors({
          ...errors,
          // whatsappNum:  !/^(?!0{10})[0-9]{10}$/.test(value) ? 'Phone number should be 10 digits' : '',
          whatsappNum:
            value === ''
              ? ''
              : !/^(?!0{10})[0-9]{10}$/.test(value)
                ? 'Whatsapp number should be 10 digits'
                : '',
        });
        break;
      case 'email':
        setEmail(value);
        setErrors({
          ...errors,
          email: validateEmail(value) ? '' : 'Email is invalid',
        });
        break;
      default:
        break;
    }
  };

  const getContact = async () => {
    try {
      const response = await getData('admin_contact/get/' + adminUuId);
      if (!response) {
        // Handle case where response is undefined or null
        console.error('No response received from Data');
        return;
      }
     
      if (response?.status) {
        console.log(response?.data.admin_contactes_data[0]);
        setContectId(response?.data.admin_contactes_data[0].id);
        setContcodeWtsap(response?.data.admin_contactes_data[0].mobile_isd_watsapp);
        setWhatsappNum(response?.data.admin_contactes_data[0].mobile_no_watsapp);
        setContcodePhone(response?.data.admin_contactes_data[0].mobile_isd_call);
        setPhoneNum(response?.data.admin_contactes_data[0].mobile_no_call);
        setEmail(response?.data.email_id?response?.data.email:localStorage.getItem('email'));
        setInitialState({
          mobile_isd_watsapp: response?.data.admin_contactes_data[0].mobile_isd_watsapp,
          mobile_no_watsapp: response?.data.admin_contactes_data[0].mobile_no_watsapp,
          mobile_isd_call: response?.data.admin_contactes_data[0].mobile_isd_call,
          mobile_no_call: response?.data.admin_contactes_data[0].mobile_no_call,
          email_id:response?.data.email_id?response?.data.email:localStorage.getItem('email'),
          admin_id: adminId,
        });
        setEditFlag(false);
      } else if (response?.code === 404) {
        setEditFlag(true);
      } else {
        // empty
        console.error('Unexpected response:', response);
      }
    } catch (error: any) {
      if (error?.response?.code === 401) {
        toast.warning('Please login again', {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      } else if(error.code !== 404){
        const userId = localStorage.getItem('email');
        if (userId !== null) {
          setEmail(userId);
        } else {
          console.error('No user ID found in localStorage.');
        }
        toast.error('Request failed', {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      }
    }
  };
  useEffect(() => {
    getContact();
  }, [adminId]);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (errors.phoneNum || errors.email || errors.whatsappNum) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    if (phoneNum === '') {
      setErrors({
        ...errors,
        phoneNum: 'Mobile number should be 10 digits',
      });
    }
    const paylod = {
      admin_address_admin_id: adminId,
      mobile_isd_call: contcodePhone,
      mobile_no_call: phoneNum,
      mobile_isd_watsapp: contcodeWtsap,
      mobile_no_watsapp: whatsappNum,
      email_id: email,
    };
    console.log(paylod,email);
    const formData = new FormData();
    Object.entries(paylod).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
          formData.append(key, value);
      }
  });

    const eq = deepEqual(initialState, paylod);

    if (editFlag) {
      const saveData = async () => {
        try {
          const response = await postData('admin_contact/add', formData);

          if (response?.status) {
            setEditFlag(false);
            toast.success('Admin Contact details saved successfully', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
            getContact();
            setActiveForm((prev) => prev + 1);
          }
        } catch (error: any) {
          if (error?.response?.code === 401) {
            toast.warning('Please login again', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
          } else {
            if (error?.response?.message === 'Email Already exist') {
              setEditFlag(false);
              try {
                const response = await putData(
                  'admin_contact/edit/' + adminId,
                  formData,
                );

                if (response?.status) {
                  toast.success(response?.message, {
                    hideProgressBar: true,
                    theme: 'colored',
                    position: 'top-center',
                  });
                  setActiveForm((prev) => prev + 1);
                  getContact();
                } else {
                  toast.error('Something went wrong ', {
                    hideProgressBar: true,
                    theme: 'colored',
                    position: 'top-center',
                  });
                }
              } catch (error: any) {
                if (error?.response?.code === 401) {
                  toast.warning('Please login again', {
                    hideProgressBar: true,
                    theme: 'colored',
                    position: 'top-center',
                  });
                } else {
                  toast.error('Request failed', {
                    hideProgressBar: true,
                    theme: 'colored',
                    position: 'top-center',
                  });
                }
              }
            } else {
              toast.error('Request Failed', {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
            }
          }
        }
      };
      saveData();
    } else if (!editFlag) {
      const editData = async () => {
        try {
          const response = await putData(
            'admin_contact/edit/' + contectId,
            formData,
          );

          if (response?.status) {
            toast.success(response?.message, {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
            setActiveForm((prev) => prev + 1);
            getContact();
          } else {
            toast.error('Something went wrong ', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
          }
        } catch (error: any) {
          if (error?.response?.code === 401) {
            toast.warning('Please login again', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
          } else {
            toast.error('Request failed', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
          }
        }
      };
      // eslint-disable-next-line no-lone-blocks
      if (!eq) editData();
      else setActiveForm((prev) => prev + 1);
    }
  };

  return (
    <form>
      <div className="d-flex justify-content-start">
        <div className="row">
          <div className="form_field_wrapper">
            <label style={{ textAlign: 'left', margin: '10px' }}>
              Mobile Number *
            </label>
          </div>

          <div className="col-3 form_field_wrapper">
            <FormControl required fullWidth>
              {/* <InputLabel id="demo-simple-select-label">
                Country code *
              </InputLabel> */}
              <Select
                data-testid="county_pcode"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{
                  backgroundColor: '#f5f5f5',
                  '& .MuiSelect-icon': {
                    color: fieldIcon(namecolor),
                  },
                }}
                value={contcodePhone}
                // label="Country code"
                onChange={(event) => setContcodePhone(event.target.value)}
              >
                {/* <MenuItem
                  value={"+91"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  +91
                </MenuItem>
                <MenuItem
                  value={"+971"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  +971
                </MenuItem>
                <MenuItem
                  value={"+1"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  +1
                </MenuItem> */}
                {phoneCodes?.map((item) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                    sx={commonStyle(namecolor)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col form_field_wrapper">
            <TextField
              data-testid="mobile_num"
              className="form-control"
              //   label="Enter Mobile Number"
              type="text"
              placeholder="Enter Mobile Number"
              value={phoneNum}
              name="phoneNum"
              onChange={handleChange}
              sx={{
                backgroundColor: '#f5f5f5',
              }}
              required
              error={!!errors.phoneNum}
              helperText={errors.phoneNum}
            />
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-start">
        <div className="row">
          <div className="form_field_wrapper">
            <label style={{ textAlign: 'left', margin: '10px' }}>
              Whatsapp Number{' '}
            </label>
          </div>
          <div className="col-3 form_field_wrapper">
            <FormControl fullWidth>
              {/* <InputLabel id="demo-simple-select-label">
                Country code{" "}
              </InputLabel> */}
              <Select
                data-testid="county_wpcode"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={contcodeWtsap}
                sx={{
                  backgroundColor: '#f5f5f5',
                  '& .MuiSelect-icon': {
                    color: fieldIcon(namecolor),
                  },
                }}
                // label="Country code"
                onChange={(event) => setContcodeWtsap(event.target.value)}
              >
                {/* <MenuItem
                  value={"+91"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  +91
                </MenuItem>
                <MenuItem
                  value={"+971"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  +971
                </MenuItem>
                <MenuItem
                  value={"+1"}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  +1
                </MenuItem> */}
                {phoneCodes?.map((item) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                    sx={commonStyle(namecolor)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col form_field_wrapper ">
            <TextField
              type="text"
              data-testid="whtmobile_num"
              className="form-control"
              placeholder="Enter Whatsapp Number"
              name="whatsappNum"
              value={whatsappNum}
              sx={{
                backgroundColor: '#f5f5f5',
              }}
              // required
              onChange={handleChange}
              error={!!errors.whatsappNum}
              helperText={errors.whatsappNum}
            />
          </div>
        </div>
      </div>

      <div className="row d-flex justify-content-start">
        {/* <div className="row" style={{ marginLeft: "0%" }}> */}
        <div className="col-lg-6 form_field_wrapper">
          <label style={{ textAlign: 'left', margin: '10px' }}>
            {' '}
            Email Id{' '}
          </label>
          <TextField
            type="email"
            data-testid="email_id"
            // label=" Email Id "
            className="form-control"
            // placeholder='Enter Email Id'
            value={email?.includes('@') ? email : ''}
            name="email"
            onChange={handleChange}
            // required
            error={!!errors.email}
            helperText={errors.email}
            disabled
            sx={{
              color: inputfieldtext(namecolor),
              backgroundColor: '#f5f5f5',
            }}
          />
        </div>
        {/* </div> */}
      </div>
      {/* <div className="row" style={{ marginTop: '55px' }}> */}
      {/* <div className="col-6 d-flex justify-content-center mt-3">
        <button className="btn btn-primary mainbutton">
          {editFlag ? "save" : "save changes"}
        </button>
      </div> */}
      <div className="col-lg-12">
        <div className="mt-3 d-flex align-items-center justify-content-between">
          <button
            type="button"
            data-testid="gobackform"
            className="btn btn-outline-dark prev-btn px-lg-4  rounded-pill"
            onClick={() => {
              setActiveForm((prev) => prev - 1);
            }}
          >
            Previous
          </button>
          <button
            type="button"
            data-testid="submitForm"
            className="btn btn-dark px-lg-5  ms-auto d-block rounded-pill next-btn"
            onClick={(e: any) => handleSubmit(e)}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default AdminContactDetails;
