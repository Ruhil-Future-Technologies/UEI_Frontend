import React, { useContext, useEffect, useRef, useState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useApi from '../../hooks/useAPI';
import { deepEqual, fieldIcon } from '../../utils/helpers';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { ChildComponentProps } from '../StudentProfile';
import NameContext from '../Context/NameContext';

interface StudentAddress {
  student_id?: string;
  address1?: string;
  address2?: string;
  country?: string;
  state?: string;
  city?: string;
  district?: string;
  pincode?: string;
  address_type?: string;
}

//let isToastActive = false;

// const showErrorToast = (message: string) => {
//   if (isToastActive) return;

//   isToastActive = true;

//   toast.error(message, {
//     onClose: () => {
//       isToastActive = false;
//     },
//     hideProgressBar: true,
//     theme: "colored",
//     position: "top-center"
//   });
// };

const StudentAddress: React.FC<ChildComponentProps> = () => {
  const context = useContext(NameContext);
  const { activeForm, setActiveForm }: any = context;
  let StudentId = localStorage.getItem('_id');
  useEffect(()=>{
     StudentId = localStorage.getItem('_id');
     console.log("DFGDFGD")
  },[activeForm])
 

  const { namecolor }: any = context;

  const { getData, postData, putData } = useApi();
  const [studentAddress, setStudentAddress] = useState<StudentAddress>({
    address_type: 'current',
  });
  // const [studentAddress1, setStudentAddress1] = useState<StudentAddress>({
  //   address_type: "current",
  // });
  const [permanentAddress, setPermanentAddress] = useState<StudentAddress>({
    address_type: 'permanent',
  });
  // const [permanentAddress1, setPermanentAddress1] = useState<StudentAddress>({
  //   address_type: "permanent",
  // });
  const [editFlag, setEditFlag] = useState<boolean>(false);
  // const [pincode, setPincode] = useState("");
  const [contry_col, setcontry_col] = useState<boolean>(false);
  const [add_col, setAdd_col] = useState<boolean>(false);
  const [add_col1, setAdd_col1] = useState<boolean>(false);

  const [city_colerror, setCity_colerror] = useState<boolean>(false);
  const [district_colerror, setDistrict_colerror] = useState<boolean>(false);
  const [state_col, setstate_col] = useState<boolean>(false);
  const [city_col, setcity_col] = useState<boolean>(false);
  const [district_col, setdistrict_col] = useState<boolean>(false);
  const [pincode_col, setpincode_col] = useState<boolean>(false);
  const [state_col1, setstate_col1] = useState<boolean>(false);
  const [city_col1, setcity_col1] = useState<boolean>(false);
  const [contry_col1, setcontry_col1] = useState<boolean>(false);
  const [district_col1, setdistrict_col1] = useState<boolean>(false);
  const [pincode_col1, setpincode_col1] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [editableCurrent, setEditableCurrect] = useState<boolean>(false);
  const [editablePerm, setEditableCurrectPerm] = useState<boolean>(false);
  const [tuched, setTuched] = useState<boolean>(false);
  const [tuchedPram, setTuchedPram] = useState<boolean>(false);
  const [tuchedCurrent, setTuchedCurrent] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedstate, setIsFocusedstate] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownstateRef = useRef<HTMLDivElement>(null);
  // const [editaddress,seteditaddress] = useState(false);
  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleFocusstate = () => setIsFocusedstate(true);
    const handleBlur = (e: FocusEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsFocused(false);
      }
    };
    const handleBlurstate = (e: FocusEvent) => {
      if (
        dropdownstateRef.current &&
        !dropdownstateRef.current.contains(e.relatedTarget as Node)
      ) {
        setIsFocusedstate(false);
      }
    };

    const currentDropdown = dropdownRef.current;
    if (currentDropdown) {
      currentDropdown.addEventListener('focus', handleFocus as EventListener);
      currentDropdown.addEventListener('blur', handleBlur as EventListener);
    }
    const currentDropdownstate = dropdownstateRef.current;
    if (currentDropdownstate) {
      currentDropdownstate.addEventListener(
        'focus',
        handleFocusstate as EventListener,
      );
      currentDropdownstate.addEventListener(
        'blur',
        handleBlurstate as EventListener,
      );
    }

    return () => {
      if (currentDropdown) {
        currentDropdown.removeEventListener(
          'focus',
          handleFocus as EventListener,
        );
        currentDropdown.removeEventListener(
          'blur',
          handleBlur as EventListener,
        );
      }
      if (currentDropdownstate) {
        currentDropdownstate.removeEventListener(
          'focus',
          handleFocusstate as EventListener,
        );
        currentDropdownstate.removeEventListener(
          'blur',
          handleBlurstate as EventListener,
        );
      }
    };
  }, []);

  const validatePincode = (pincode: any) => {
    const pincodePattern = /^(?!0{6})[0-9]{6}$/;
    return pincodePattern.test(pincode);
  };

  const listData = async () => {
    getData(`${'student_address/edit/' + StudentId}`)
      .then((response: any) => {
        if (response?.status) {
          let add1: any;
          let add2: any;
          response?.data.forEach((address: any) => {
            if (address?.address_type === 'permanent') {
              setPermanentAddress(address);
              // setPermanentAddress1(address);
              add1 = address;
            } else if (address?.address_type === 'current') {
              setStudentAddress(address);
              // setStudentAddress1(address);
              add2 = address;
            }
          });
          // Filter out unwanted fields from both add1 and add2
          const fieldsToCompare = [
            'address1',
            'address2',
            'city',
            'country',
            'district',
            'pincode',
            'state',
          ];

          const filteredAdd1: any = {};
          const filteredAdd2: any = {};

          fieldsToCompare?.forEach((field) => {
            if (add1 && Object.prototype.hasOwnProperty.call(add1, field)) {
              filteredAdd1[field] = add1[field];
            }
            if (add2 && Object.prototype.hasOwnProperty.call(add2, field)) {
              filteredAdd2[field] = add2[field];
            }
          });

          // Use deepEqual to compare only the selected fields
          const equal = deepEqual(filteredAdd1, filteredAdd2);
          if (equal) {
            setChecked(true);
          }
        } else if (response?.code === 404) {
          console.log("inside 404")
          setEditFlag(true);
          // toast.error(response?.message, {
          //   hideProgressBar: true,
          //   theme: "colored",
          // });
        } else {
          toast.error(response?.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
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
      listData();
    }

  }, [activeForm]);

  useEffect(() => {
    if(StudentId){
      getData(`${'student_address/edit/' + StudentId}`).then((response: any) => {
        if (response?.status) {
          response?.data.forEach((address: any) => {
            if (address?.address_type === 'permanent') {
              //setPermanentAddress(address);
              //setPermanentAddress1(address);
              setEditableCurrectPerm(true);
              setTuchedPram(false);
            } else if (address?.address_type === 'current') {
              // setStudentAddress(address);
              // setStudentAddress1(address);
              setEditableCurrect(true);
              setTuchedCurrent(false);
            } else {
              setEditableCurrect(false);
              setEditableCurrectPerm(false);
            }
          });
          if(response.code===404){
            setEditFlag(true);
          }
        }
      });
    }
  }, [activeForm]);
  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    addressType: string,
  ) => {
    setTuched(true);
    const { name, value } = event.target;
    setChecked(false);

    if (addressType === 'current') {
      if (name === 'country') {
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setcontry_col(true);
        } else {
          setcontry_col(false);
        }
      }
      if (name === 'state') {
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setstate_col(true);
        } else {
          setstate_col(false);
        }
      }
      if (name === 'city') {
        if (value === '') {
          setCity_colerror(true);
        } else {
          setCity_colerror(false);
        }
        // if (!/^[a-zA-Z\s]*$/.test(value)) {
        if (!/^[A-Za-z]+(?:[ A-Za-z]+)*$/.test(value)) {
          setcity_col(true);
        } else {
          setcity_col(false);
        }
      }
      if (name === 'district') {
        if (value === '') {
          setDistrict_colerror(true);
        } else {
          setDistrict_colerror(false);
        }
        if (!/^[A-Za-z]+(?:[ A-Za-z]+)*$/.test(value)) {
          setdistrict_col(true);
        } else {
          setdistrict_col(false);
        }
      }
      if (name === 'pincode') {
        if (value === '' || validatePincode(value)) {
          setpincode_col(false);
        } else {
          setpincode_col(true);
        }
      }
      if (name === 'address1') {
        // if (value === "") {
        if (value === '' || !/^[A-Za-z0-9/]+(?:[ A-Za-z0-9/]+)*$/.test(value)) {
          setAdd_col(true);
        } else {
          setAdd_col(false);
        }
      }
      setTuchedCurrent(true);
      setStudentAddress((prevState) => ({ ...prevState, [name]: value }));
    } else {
      if (name !== 'address2' && value === '') {
        setAdd_col1(false);
        setstate_col1(false);
        setcity_col1(false);
        setcontry_col1(false);
        setdistrict_col1(false);
        setpincode_col1(false);
        if (!editablePerm) {
          setChecked(false);
          setTuched(false);
          setTuchedPram(false);
        }
      } else {
        setTuchedPram(true);
        if (name === 'address1') {
          // if (value === "") {
          if (!/^[A-Za-z0-9/]+(?:[ A-Za-z0-9/]+)*$/.test(value)) {
            setAdd_col1(true);
          } else {
            setAdd_col1(false);
          }
        }
        if (name === 'state') {
          if (!/^[a-zA-Z\s]*$/.test(value)) {
            setstate_col1(true);
          } else {
            setstate_col1(false);
          }
        }
        if (name === 'city') {
          if (!/^[a-zA-Z\s]*$/.test(value)) {
            setcity_col1(true);
          } else {
            setcity_col1(false);
          }
        }
        if (name === 'country') {
          if (!/^[a-zA-Z\s]*$/.test(value)) {
            setcontry_col1(true);
          } else {
            setcontry_col1(false);
          }
        }
        if (name === 'district') {
          if (!/^[a-zA-Z\s]*$/.test(value)) {
            setdistrict_col1(true);
          } else {
            setdistrict_col1(false);
          }
        }
        if (name === 'pincode') {
          if (value === '' || validatePincode(value)) {
            setpincode_col1(false);
          } else {
            setpincode_col1(true);
          }
        }
      }
      // if(name==='pincode')
      //   {
      //         setErrors({
      //           ...errors,
      //           permanentpin: !validatePincode(value) ? 'Please enter a valid Pincode Only numbers allowed.' : '',
      //         });
      //   }
      setPermanentAddress((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handlePermanentAddressCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.checked) {
      setChecked(true);
      setTuched(true);
      setTuchedPram(true);
      setPermanentAddress({ ...studentAddress, address_type: 'permanent' });
      if (pincode_col) {
        setpincode_col1(true);
      } else {
        setpincode_col1(false);
      }
      validatinforperm();
    } else {
      setChecked(false);
      setTuched(false);
      setTuchedPram(false);
      setPermanentAddress((prevPermanentAddress) => ({
        ...prevPermanentAddress,
        address1: '',
        address2: '',
        country: '',
        state: '',
        city: '',
        district: '',
        pincode: '',
        address_type: 'permanent',
      }));
      validatinforperm();
    }
  };
  let hasPermanentAddressFields = false;
  let validPermanentAddress = true;
  const validatinforperm = () => {
    // Check if any permanent address field has a value
    if (
      (permanentAddress.address1 && permanentAddress.address1 !== '') ||
      (permanentAddress.address2 && permanentAddress.address2 !== '') ||
      (permanentAddress.country && permanentAddress.country !== '') ||
      (permanentAddress.state && permanentAddress.state !== '') ||
      (permanentAddress.district && permanentAddress.district !== '') ||
      (permanentAddress.city && permanentAddress.city !== '') ||
      (permanentAddress.pincode && permanentAddress.pincode !== '')
    ) {
      hasPermanentAddressFields = true;

      if (permanentAddress?.address1 === '' || !permanentAddress?.address1) {
        setAdd_col1(true);
        validPermanentAddress = false;
      } else {
        setAdd_col1(false);
      }

      if (permanentAddress?.country === '' || !permanentAddress?.country) {
        setcontry_col1(true);
        validPermanentAddress = false;
      } else {
        setcontry_col1(false);
      }

      if (permanentAddress?.city === '' || !permanentAddress?.city) {
        setcity_col1(true);
        validPermanentAddress = false;
      } else {
        setcity_col1(false);
      }

      if (permanentAddress?.district === '' || !permanentAddress?.district) {
        setdistrict_col1(true);
        validPermanentAddress = false;
      } else {
        setdistrict_col1(false);
      }

      if (
        permanentAddress?.pincode === '' ||
        !validatePincode(permanentAddress.pincode)
      ) {
        setpincode_col1(true);
        validPermanentAddress = false;
      } else {
        setpincode_col1(false);
      }
    }
  };
  const SubmitHandle = async () => {
    if (!('address1' in studentAddress) || studentAddress?.address1 === '') {
      setAdd_col(true);
    } else {
      setAdd_col(false);
    }

    if (!('city' in studentAddress) || studentAddress?.city === '') {
      setCity_colerror(true);
    } else {
      setCity_colerror(false);
    }
    if (!('district' in studentAddress) || studentAddress?.district === '') {
      setDistrict_colerror(true);
    } else {
      setDistrict_colerror(false);
    }

    if (
      !('pincode' in studentAddress) ||
      studentAddress?.pincode === '' ||
      !validatePincode(studentAddress.pincode)
    ) {
      setpincode_col(true);
      // toast.error("Pincode is invalid");
      // showErrorToast("Entered Pincode is invalid");
    } else {
      setpincode_col(false);
    }

    if (!('country' in studentAddress) || studentAddress?.country === '') {
      setcontry_col(true);
    } else {
      setcontry_col(false);
    }

    validatinforperm();

    
    const currentAddressPayload = {
      student_id: StudentId,
      ...studentAddress,
    };

    const permanentAddressPayload = {
      student_id: StudentId,
      ...permanentAddress,
    };
    // const eq = deepEqual(studentAddress1, currentAddressPayload);
    // const permanentAddressEq = deepEqual(
    //   permanentAddress1,
    //   permanentAddressPayload
    // );
    if (
      (!hasPermanentAddressFields || validPermanentAddress) &&
      studentAddress?.address1 &&
      studentAddress?.country &&
      studentAddress?.state &&
      studentAddress?.city &&
      studentAddress?.district &&
      studentAddress?.pincode &&
      !city_col &&
      !district_col &&
      !pincode_col &&
      !pincode_col1 &&
      !add_col1 &&
      !district_col1 &&
      !city_col1 &&
      !contry_col1
    ) {
      console.log(editFlag,tuched)
      if (editFlag && tuched) {
        const addAddress = async (addressType: string, addressPayload: any) => {
          try {
            const formData = new FormData();
            Object.keys(addressPayload).forEach((key) => {
              formData.append(key, addressPayload[key]);
            });
            const data = await postData('/student_address/add', formData);

            if (data?.status) {
              toast.success(`${addressType} address saved successfully`, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
              if (addressType === 'Current') {
                setActiveForm(2);
              }
              setTuched(false);
              setEditFlag(false);
            } else {
              // toast.error(`Failed to add ${addressType} address`, {
              //   hideProgressBar: true,
              //   theme: "colored",
              // });
            }
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error?.message, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
            } else {
              toast.error('An unexpected error occurred', {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
            }
          }
        };
       
        console.log(studentAddress?.address_type);
        // Add current address
        if (studentAddress?.address_type === 'current') {
          console.log("issues");
          await addAddress('Current', currentAddressPayload);
        }
        // Add permanent address
        if (permanentAddress?.address_type === 'permanent') {
          await addAddress('Permanent', permanentAddressPayload);
        }
      } else {
        const editAddress = async (
          addressType: string,
          addressPayload: any,
        ) => {
          console.log(addressPayload);
          try {
            const formData = new FormData();

            // Object.keys(addressPayload).forEach((key) => {
            //   console.log(key,addressPayload[key]);
            //   formData.append(key, addressPayload[key]);
            // });
            console.log(addressPayload.pincode,addressPayload?.address1,addressPayload?.address1)
            formData.append('pincode', addressPayload?.pincode || 0);
            formData.append('address1', addressPayload?.address1 || '');
            formData.append('address2', addressPayload?.address2 || '');
            formData.append('country', addressPayload?.country || '');
            formData.append('state', addressPayload?.state || '');
            formData.append('city', addressPayload?.city || '');
            formData.append('district', addressPayload?.district || '');
            formData.append('address_type',addressPayload?.address_type ||'')
            formData.append('student_id',StudentId || '')
            console.log(formData);
            const data = await putData('/student_address/edit/' + StudentId, 
              formData,
            );

            if (data?.status) {
              toast.success(`${addressType} address updated successfully`, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
              listData();
              setTuched(false);

              if (tuchedPram && tuchedCurrent) {
                // if (!eq && !permanentAddressEq) {
                //   // block of code to write the address
                // } else {
                //   setActiveForm((prev: number) => prev + 1);
                // }

                await setTuchedCurrent(false);
                await setTuchedPram(false);
                setActiveForm(2);
              } else if (tuchedPram && !tuchedCurrent) {
                setActiveForm(2);
              } else if (!tuchedPram && tuchedCurrent) {
                setActiveForm(2);
              }
            } else if (data?.code === 201) {
              toast.success(`${addressType} address updated successfully`, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
              listData();
              setTuched(false);

              setTuchedCurrent(false);

              setTuchedPram(false);
              setActiveForm(2);
            } else setActiveForm(2);
            // else {
            // toast.error(`Failed to update ${addressType} address`, {
            //   hideProgressBar: true,
            //   theme: "colored",
            // });
            // }
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error?.message, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
            } else {
              toast.error('An unexpected error occurred', {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center',
              });
            }
          }
        };

        if (StudentId !== null) {
          // Edit current address
          console.log(tuched);
          if (!tuched) setActiveForm((prev: number) => prev + 1);
          else {
            console.log(  studentAddress?.address_type === 'current' ,editableCurrent , tuchedCurrent)
            if (
              studentAddress?.address_type === 'current' &&
              editableCurrent &&
              tuchedCurrent
            )
            console.log(  studentAddress?.address_type === 'current' &&editableCurrent && tuchedCurrent)
              await editAddress('Current', currentAddressPayload);

            console.log(editablePerm);
            if (permanentAddress?.address_type === 'permanent' && tuchedPram)
              await editAddress('Permanent', permanentAddressPayload);
          }
        } else {
          // Handle the case where StudentId is null
          console.error('StudentId is null. Unable to edit addresses.');
        }
      }
    }
    // }
  };
  const handleInputChangecountry = (
    value: string,
    addressType: string,
    name: string,
  ) => {
    if (addressType === 'current_address') {
      if (name === 'country') {
        setStudentAddress((prevState) => ({
          ...prevState,
          ['country']: value,
        }));
        setStudentAddress((prevState) => ({ ...prevState, ['state']: '' }));
        setstate_col(true);
        setcontry_col(false);
        // if(adminAddress1.country === value && adminAddress1.state === adminAddress.state ){
        //   setstate_col(false)
        // }
      } else if (name === 'state') {
        setStudentAddress((prevState) => ({ ...prevState, ['state']: value }));
        setstate_col(false);
      } else {
        return;
      }
      setTuchedCurrent(true);
    } else {
      if (name === 'country') {
        setPermanentAddress((prevState) => ({
          ...prevState,
          ['country']: value,
        }));
        setPermanentAddress((prevState) => ({ ...prevState, ['state']: '' }));
        setstate_col1(true);
        // setcontry_col1(false);
      } else if (name === 'state') {
        setPermanentAddress((prevState) => ({
          ...prevState,
          ['state']: value,
        }));
        setstate_col1(false);
      } else {
        return;
      }
      setTuchedPram(true);
    }
    setTuched(true);
  };
  return (
    <form>
      <div className="row form_field_wrapper">
        <div className="col-12">
          <h5 className="font-weight-bold profiletext">
            {' '}
            <b>Current Address</b>
          </h5>
        </div>
      </div>
      <div className="row">
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            Address 1 <span>*</span>
          </label>
          <input
            type="text"
            name="address1"
            className="form-control"
            value={studentAddress.address1}
            onChange={(e) => handleInputChange(e, 'current')}
            required
            autoComplete="off"
          />
          <div>
            {' '}
            {(studentAddress?.address1 === '' || add_col) && (
              <p style={{ color: 'red' }}>Please enter Address 1.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label"> Address 2</label>
          <input
            type="text"
            name="address2"
            className="form-control"
            value={studentAddress?.address2}
            onChange={(e) => handleInputChange(e, 'current')}
            // required
            autoComplete="off"
          />
        </div>

        <div className="col-6 pb-3 form_field_wrapper">
          <label
            className={`col-form-label  ${
              isFocusedstate || studentAddress?.country
                ? 'focused'
                : 'focusedempty'
            }`}
            style={{ fontSize: '14px' }}
          >
            Country <span>*</span>
          </label>
          <CountryDropdown
            classes="form-select custom-dropdown"
            defaultOptionLabel={studentAddress.country}
            value={studentAddress.country || ''}
            onChange={(e: string) =>
              handleInputChangecountry(e, 'current_address', 'country')
            }
          />
          <div>
            {' '}
            {contry_col && (
              <p style={{ color: 'red' }}>Please select Country name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label
            className={`col-form-label ${
              isFocusedstate || studentAddress.state
                ? 'focused'
                : 'focusedempty'
            }`}
            style={{ fontSize: '14px' }}
          >
            State <span>*</span>
          </label>

          <RegionDropdown
            classes="form-select custom-dropdown"
            defaultOptionLabel={studentAddress.state}
            country={studentAddress.country || ''}
            value={studentAddress.state || ''}
            // onChange={(val) => setRegion(val)}
            onChange={(e: string) =>
              handleInputChangecountry(e, 'current_address', 'state')
            }
          />
          <div>
            {' '}
            {state_col && (
              <p style={{ color: 'red' }}>Please select a valid state Name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            City <span>*</span>
          </label>

          <input
            type="text"
            name="city"
            className="form-control"
            value={studentAddress?.city}
            onChange={(e) => handleInputChange(e, 'current')}
            required
            autoComplete="off"
          />
          <div>
            {' '}
            {city_col && studentAddress?.city !== '' && (
              <p style={{ color: 'red' }}>
                Please enter a valid City Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {' '}
            {(studentAddress?.city == '' || city_colerror) && (
              <p style={{ color: 'red' }}>Please enter City name.</p>
            )}
          </div>
          {/* {error.city && <span style={{ color: 'red' }}>{error.city}</span>} */}
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            District <span>*</span>
          </label>

          <input
            type="text"
            name="district"
            className="form-control"
            value={studentAddress?.district}
            onChange={(e) => handleInputChange(e, 'current')}
            required
            autoComplete="off"
          />
          <div>
            {' '}
            {district_col && studentAddress?.district !== '' && (
              <p style={{ color: 'red' }}>
                Please enter a valid District Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {' '}
            {(studentAddress?.district == '' || district_colerror) && (
              <p style={{ color: 'red' }}>Please enter District name.</p>
            )}
          </div>
          {/* {error.district && <span style={{ color: 'red' }}>{error.district}</span>} */}
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            Pincode <span>*</span>
          </label>

          <input
            type="text"
            name="pincode"
            className="form-control"
            maxLength={6}
            value={studentAddress.pincode || ''}
            onChange={(e) => handleInputChange(e, 'current')}
            required
            autoComplete="off"
            // error={!!errors.currentpin}
            // helperText={errors.currentpin}
          />
          <div>
            {' '}
            {pincode_col && (
              <p style={{ color: 'red' }}>
                Please enter a valid 6-digit Pincode (numbers only).
              </p>
            )}
          </div>
          <div>
            {' '}
            {studentAddress.pincode === '' && (
              <p style={{ color: 'red' }}>Please enter Pincode.</p>
            )}
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12 ">
          <h5 className="font-weight-bold profiletext">
            {' '}
            <b>Permanent Address</b>
          </h5>
        </div>
      </div>
      <div className="row form_field_wrapper">
        <div className="col-12 pb-3">
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={handlePermanentAddressCheckbox}
                  name="sameAsCurrent"
                  checked={checked}
                  sx={{
                    color: fieldIcon(namecolor),
                  }}
                />
              }
              label="Same as Current Address"
            />
          </FormControl>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            Address 1 <span></span>
          </label>

          <input
            type="text"
            name="address1"
            className="form-control"
            value={permanentAddress.address1}
            onChange={(e) => handleInputChange(e, 'permanent')}
            // required
            autoComplete="off"
          />
          <div>
            {' '}
            {(studentAddress?.address1 === '' || add_col1) && (
              <p style={{ color: 'red' }}>Please enter Address 1.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            Address 2 <span></span>
          </label>

          <input
            type="text"
            name="address2"
            className="form-control"
            value={permanentAddress.address2}
            onChange={(e) => handleInputChange(e, 'permanent')}
            // required
            autoComplete="off"
          />
          {/* {error.address2 && <span style={{ color: 'red' }}>{error.address2}</span>} */}
        </div>

        <div className="col-6 pb-3 form_field_wrapper" ref={dropdownRef}>
          <label
            className={`col-form-label ${
              isFocused || permanentAddress.country ? 'focused' : 'focusedempty'
            }`}
            style={{ fontSize: '14px' }}
          >
            Country <span></span>
          </label>
          <CountryDropdown
            classes="form-select custom-dropdown"
            defaultOptionLabel={permanentAddress.country || ''}
            value={permanentAddress.country || ''}
            onChange={(e: string) =>
              handleInputChangecountry(e, 'permanent_address', 'country')
            }
          />
          <div>
            {' '}
            {contry_col1 && (
              <p style={{ color: 'red' }}>Please selete a country Name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper" ref={dropdownstateRef}>
          <label
            className={`col-form-label ${
              isFocusedstate || permanentAddress.state
                ? 'focused'
                : 'focusedempty'
            }`}
            style={{ fontSize: '14px' }}
          >
            State <span></span>
          </label>

          <RegionDropdown
            classes="form-select custom-dropdown"
            defaultOptionLabel={permanentAddress.state || ''}
            country={permanentAddress.country || ''}
            value={permanentAddress.state || ''}
            // onChange={(val) => setRegion(val)}
            onChange={(e: string) =>
              handleInputChangecountry(e, 'permanent_address', 'state')
            }
          />
          <div>
            {' '}
            {state_col1 && (
              <p style={{ color: 'red' }}>Please enter a valid state Name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            City <span></span>
          </label>

          <input
            type="text"
            name="city"
            className="form-control"
            value={permanentAddress.city}
            onChange={(e) => handleInputChange(e, 'permanent')}
            // required
            autoComplete="off"
          />
          <div>
            {' '}
            {city_col1 && (
              <p style={{ color: 'red' }}>
                Please enter a valid City Name only characters allowed.
              </p>
            )}
          </div>
          {/* {error.city && <span style={{ color: 'red' }}>{error.city}</span>} */}
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            District <span></span>
          </label>

          <input
            type="text"
            name="district"
            className="form-control"
            value={permanentAddress.district}
            onChange={(e) => handleInputChange(e, 'permanent')}
            // required
            autoComplete="off"
          />
          <div>
            {' '}
            {district_col1 && (
              <p style={{ color: 'red' }}>
                Please enter a valid District Name only characters allowed.
              </p>
            )}
          </div>
          {/* {error.district && <span style={{ color: 'red' }}>{error.district}</span>} */}
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            Pincode <span></span>
          </label>

          <input
            type="text"
            name="pincode"
            className="form-control"
            maxLength={6}
            value={permanentAddress.pincode || ''}
            onChange={(e) => handleInputChange(e, 'permanent')}
            autoComplete="off"
          />
          <div>
            {' '}
            {pincode_col1 && (
              <p style={{ color: 'red' }}>
                Please enter a valid 6-digit Pincode (numbers only).
              </p>
            )}
          </div>
          {/* {error.pincode && <span style={{ color: 'red' }}>{error.pincode}</span>} */}
        </div>
        <div className="col-lg-12">
          <div className="mt-3 d-flex align-items-center justify-content-between">
            <button
              type="button"
              className="btn btn-outline-dark prev-btn px-lg-4  rounded-pill"
              onClick={() => {
                setActiveForm((prev: number) => prev - 1);
              }}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-dark px-lg-5  ms-auto d-block rounded-pill next-btn px-4"
              onClick={SubmitHandle}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* <div className="d-flex justify-content-center">
        <Button
          className="mainbutton"
          variant="contained"
          color="primary"
          type="submit"
        >
          {editFlag ? "save" : "Save Changes"}
        </Button>
      </div> */}
    </form>
  );
};

export default StudentAddress;
