import React, { useContext, useEffect, useState } from 'react';

// import Stepper from "@mui/material/Stepper";
// import Step from "@mui/material/Step";
// import StepLabel from "@mui/material/StepLabel";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  //Box,
  //Button,
  FormControl,
  //FormControlLabel,
  //InputLabel,
  MenuItem,
  //Radio,
  //RadioGroup,
  Select,
  //SelectChangeEvent,
  TextField,
  // Typography,
} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
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

const StudentcontactDetails: React.FC<ChildComponentProps> = ({
  setActiveForm,
}) => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;

  const { activeForm }: any = context;
  const { getData, postData, putData } = useApi();
  const [contcodeWtsap, setContcodeWtsap] = useState('+91');
  const [whatsappNum, setWhatsappNum] = useState('');
  const [contcodePhone, setContcodePhone] = useState('+91');
  const [phoneNum, setPhoneNum] = useState(localStorage.getItem('phone') ||'');

  const [phoneNumerror, setPhoneNumerror] = useState({
    phoneNum: '',
  });
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [editFalg, setEditFlag] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    phoneNum: '',
    email: '',
    whatsappNum: '',
  });
  const StudentId = localStorage.getItem('_id');
  const register_num=localStorage.getItem('register_num');
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const validateMobile = (id: string) => /^\+?\d{10,15}$/.test(id);

  const [initialState, setInitialState] = useState<any | null>({});
  const phoneCodes = [
    { value: '+91', label: '+91' },
    { value: '+971', label: '+971' },
    { value: '+1', label: '+1' },
  ];
  const user_id = localStorage.getItem('userid');

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
        setPhoneNumerror({
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
          // whatsappNum: !/^(?!0{10})[0-9]{10}$/.test(value) ? 'Phone number should be 10 digits' : '',
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
  const getContacInfo = async () => {
    getData(`${'student_contact/edit/' + StudentId}`)
      .then((data: any) => {
        if (data?.status) {
          setContcodeWtsap(data?.data.mobile_isd_watsapp);
          setWhatsappNum(data?.data.mobile_no_watsapp);
          setContcodePhone(data?.data.mobile_isd_call);
          setPhoneNum(data?.data.mobile_no_call ? data?.data.mobile_no_call:localStorage.getItem('phone'));
          setEmail(data?.data.email_id?data?.data.email:localStorage.getItem('email'));

          setInitialState({
            mobile_isd_watsapp: data?.data.mobile_isd_watsapp,
            mobile_no_watsapp: data?.data.mobile_no_watsapp,
            mobile_isd_call: data?.data.mobile_isd_call,
            mobile_no_call: data?.data.mobile_no_call,
            email_id: data?.data.email_id
              ? data?.data.email
              : localStorage.getItem('email'),
            student_id: StudentId,
          });
          setEditFlag(false);
        } else if (data?.code === 404) {
          setEditFlag(true);
          //   toast.warning("Please Add Your Information", {
          //     hideProgressBar: true,
          //     theme: "colored",
          //   });
          const userId = localStorage.getItem('email');
          if (userId !== null) {
            setEmail(userId);
          } else if (userId && validateMobile(userId)) {
            setPhoneNum(userId);
          } else {
            console.error('No user ID found in localStorage.');
          }
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
  };
  useEffect(() => {
    if(StudentId){
      setPhoneNum(register_num as string);
      getContacInfo();
    }
  }, [activeForm]);
  const submitHandel = () => {
    // event: React.FormEvent<HTMLFormElement>
    // event.preventDefault();

    if (errors.phoneNum || errors.email || errors.whatsappNum) {
      // toast.error("Please fix the errors before submitting", {
      //   hideProgressBar: true,
      //   theme: "colored",
      //   position: "top-center"
      // });
      return;
    }

    if (phoneNum?.length !== 10) {
      setPhoneNumerror({
        ...errors,
        phoneNum: !/^(?!0{10})[0-9]{10}$/.test(phoneNum)
          ? 'Mobile number should be 10 digits'
          : '',
      });
      // toast.error("Phone number should be 10 digits", {
      //   hideProgressBar: true,
      //   theme: "colored",
      //   position: "top-center"
      // });
      return;
    }
    const formData = new FormData();

    const payload = {
      student_id: StudentId,
      mobile_isd_call: contcodePhone,
      mobile_no_call: phoneNum,
      mobile_isd_watsapp: contcodeWtsap,
      mobile_no_watsapp: whatsappNum,
      email_id: email,
    } as any;

    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    const eq = deepEqual(initialState, payload);
    if (editFalg) {
      postData(`${'student_contact/add'}`, formData)
        .then((data: any) => {
          if (data?.status) {
            setEditFlag(false);
            toast.success('Contact Details saved successfully', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
            getContacInfo();
            setActiveForm((prev) => prev + 1);
          } else {
            if (data?.message === 'Email Already exist') {
              setEditFlag(false);
              putData(`${'student_contact/edit/'}${StudentId}`, formData)
                .then((data: any) => {
                  if (data.status) {
                    toast.success('Contact Details updated successfully', {
                      hideProgressBar: true,
                      theme: 'colored',
                      position: 'top-center',
                    });
                    getContacInfo();
                    setActiveForm((prev) => prev + 1);
                  }
                })
                .catch((e) => {
                  toast.error(e?.message, {
                    hideProgressBar: true,
                    theme: 'colored',
                    position: 'top-center',
                  });
                });
            } else {
              toast.error(data?.message, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
            }
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        });
    } else {
      // eslint-disable-next-line no-lone-blocks
      {
        if (!eq) {
          putData(`${'student_contact/edit/'}${StudentId}`, formData)
            .then((data: any) => {
              if (data.status) {
                toast.success('Contact Details updated successfully', {
                  hideProgressBar: true,
                  theme: 'colored',
                  position: 'top-center',
                });
                getContacInfo();
                setActiveForm((prev) => prev + 1);
              }
            })
            .catch((e) => {
              toast.error(e?.message, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
            });
        } else setActiveForm((prev) => prev + 1);
      }
    }
  };

  return (
    <form>
      
      <b className="font-weight-bold profiletext mb-4 d-block">
        Contact Details
      </b>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="row g-2">
            <div className="col-12">
              <label className="col-form-label ">Mobile Number *</label>
            </div>
            <div className="col-3 ">
              <FormControl required fullWidth>
                {/* <InputLabel id="demo-simple-select-label">
                Country code
              </InputLabel> */}
                <Select
                  labelId="demo-simple-select-label"
                  data-testid="county_pcode"
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
            <div className="col-9 ">
              <TextField
                className="form-control"
                data-testid="mobile_num"
                type="text"
                placeholder="Enter Mobile number"
                name="phoneNum"
                value={phoneNum}
                disabled={user_id ? !validateEmail(user_id) : false}
                onChange={handleChange}
                sx={{
                  backgroundColor: '#f5f5f5',
                }}
                required
                error={!!errors.phoneNum || !!phoneNumerror.phoneNum}
                helperText={errors.phoneNum || phoneNumerror.phoneNum}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="row g-2">
            <div className="col-12">
              <label className="col-form-label">Whatsapp Number</label>
            </div>
            <div className="col-3 ">
              <FormControl
                // required
                fullWidth
              >
                {/* <InputLabel id="demo-simple-select-label">
                Country code
              </InputLabel> */}
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  data-testid="county_wpcode"
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
            <div className="col-9 ">
              <TextField
                type="text"
                data-testid="whtmobile_num"
                placeholder="Enter Whatsapp number"
                className="form-control w-100"
                value={whatsappNum}
                sx={{
                  backgroundColor: '#f5f5f5',
                }}
                name="whatsappNum"
                onChange={handleChange}
                // required
                error={!!errors.whatsappNum}
                helperText={errors.whatsappNum}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-12 ">        
         
          <label className="col-form-label"> Email Id </label>

          <TextField
            type="email"
            className="form-control"
            data-testid="email_id"
            // placeholder='Enter Email Id'
            name="email"
            value={email}
            onChange={handleChange}
            // required
            disabled={user_id ? validateEmail(user_id) : false}
            error={!!errors.email}
            helperText={errors.email}
            sx={{
              color: inputfieldtext(namecolor),
              backgroundColor: '#f5f5f5',
            }}
          />
        </div>

        <div className="col-lg-12">
        <div className="mt-5 d-flex align-items-center justify-content-between">
          <button
            type="button"
            className="btn btn-outline-dark prev-btn px-lg-4  rounded-pill"
            onClick={() => {
              setActiveForm((prev) => prev - 1);
            }}
            data-testid="gobackform"
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-dark px-lg-5  ms-auto d-block rounded-pill next-btn"
            onClick={submitHandel}
            data-testid="submitForm"
          >
            Next
          </button>
        </div>
      </div>
      </div>

     
    </form>
  );
};

export default StudentcontactDetails;
