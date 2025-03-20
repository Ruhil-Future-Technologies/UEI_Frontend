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

interface AdminAddress {
  admin_id?: string;
  address1?: string;
  address2?: string;
  country?: string;
  state?: string;
  city?: string;
  district?: string;
  pincode?: string;
  address_type?: string;
}

const AdminAddress: React.FC<ChildComponentProps> = () => {
  const context = useContext(NameContext);

  const { activeForm, setActiveForm }: any = context;
  const adminId = localStorage.getItem('_id');
  const UuId = localStorage.getItem('user_uuid');
  const { namecolor }: any = context;
  const { getData, postData, putData } = useApi();
  const [adminAddress, setadminAddress] = useState<AdminAddress>({
    address_type: 'current_address',
  });
  const [permanentAddress, setPermanentAddress] = useState<AdminAddress>({
    address_type: 'permanent_address',
  });
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const [contry_col, setcontry_col] = useState<boolean>(false);
  const [add_col, setAdd_col] = useState<boolean>(false);
  const [city_colerror, setCity_colerror] = useState<boolean>(false);
  const [district_colerror, setDistrict_colerror] = useState<boolean>(false);
  const [state_col, setstate_col] = useState<boolean>(false);
  const [city_col, setcity_col] = useState<boolean>(false);
  const [district_col, setdistrict_col] = useState<boolean>(false);
  const [pincode_col, setpincode_col] = useState<boolean>(false);
  const [state_col1, setstate_col1] = useState<boolean>(false);
  const [city_col1, setcity_col1] = useState<boolean>(false);
  const [add_col1, setAdd_col1] = useState<boolean>(false);
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
    try {
      getData(`${'admin_address/get/' + UuId}`).then((response: any) => {
        if (response?.status) {
          let add1: any;
          let add2: any;
          response?.data.admin_addresses_data.forEach((address: any) => {
            if (address?.address_type === 'permanent_address') {
              setPermanentAddress(address);

              // setPermanentAddress1(address);
              add1 = address;
            } else if (address?.address_type === 'current_address') {
              setadminAddress(address);
              // setadminAddress1(address);
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
          setEditFlag(true);
        } else {
          // toast.error(response?.message, {
          //   hideProgressBar: true,
          //   theme: 'colored',
          //   position: 'top-center',
          // });
        }
      });
    } catch (error: any) {
      if (error.code !== 404) {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      }
    }
  };
  useEffect(() => {
    listData();
  }, []);

  useEffect(() => {
    getData(`${'admin_address/get/' + UuId}`).then((response: any) => {
      if (response?.status) {
        response?.data.admin_addresses_data.forEach((address: any) => {
          if (address?.address_type === 'permanent_address') {
            setEditableCurrectPerm(true);
            setTuchedPram(false);
          } else if (address?.address_type === 'current_address') {
            setEditableCurrect(true);
            setTuchedCurrent(false);
          } else {
            setEditableCurrect(false);
            setEditableCurrectPerm(false);
          }
        });
      }
    });
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
      setadminAddress((prevState) => ({ ...prevState, [name]: value }));
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
        if (name === 'country') {
          if (!/^[a-zA-Z\s]*$/.test(value)) {
            setcontry_col1(true);
          } else {
            setcontry_col1(false);
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
      setPermanentAddress({
        ...adminAddress,
        address_type: 'permanent_address',
      });
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
        address_type: 'permanent_address',
      }));
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
    if (!('address1' in adminAddress) || adminAddress?.address1 === '') {
      setAdd_col(true);
    } else {
      setAdd_col(false);
    }

    if (!('city' in adminAddress) || adminAddress?.city === '') {
      setCity_colerror(true);
    } else {
      setCity_colerror(false);
    }
    if (!('district' in adminAddress) || adminAddress?.district === '') {
      setDistrict_colerror(true);
    } else {
      setDistrict_colerror(false);
    }
    if (
      !('pincode' in adminAddress) ||
      adminAddress?.pincode === '' ||
      !validatePincode(adminAddress.pincode)
    ) {
      setpincode_col(true);
    } else {
      setpincode_col(false);
    }

    if (!('country' in adminAddress) || adminAddress?.country === '') {
      setcontry_col(true);
    } else {
      setcontry_col(false);
    }

    validatinforperm();
    const currentAddressPayload = {
      admin_id: adminId,
      ...adminAddress,
    };

    const permanentAddressPayload = {
      admin_id: adminId,
      ...permanentAddress,
    };
    if (
      (!hasPermanentAddressFields || validPermanentAddress) &&
      adminAddress?.address1 &&
      adminAddress?.country &&
      adminAddress?.state &&
      adminAddress?.city &&
      adminAddress?.district &&
      adminAddress?.pincode &&
      !city_col &&
      !district_col &&
      !pincode_col &&
      !pincode_col1 &&
      !add_col1 &&
      !district_col1 &&
      !city_col1 &&
      !contry_col1
    ) {
      if (editFlag && tuched) {
        const addAddress = async (addressType: string, addressPayload: any) => {
          const formData = new FormData();
          // Loop through each key in the payload and append it if it's not null or undefined
          Object.entries(addressPayload).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(key, value as string);
            }
          });
          try {
            const data = await postData('/admin_address/add', formData);
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

        // Add current address
        if (adminAddress?.address_type === 'current_address') {
          await addAddress('Current', currentAddressPayload);
        }

        // Add permanent address
        if (permanentAddress?.address_type === 'permanent_address') {
          await addAddress('Permanent', permanentAddressPayload);
        }
      } else {
        const editAddress = async (
          addressType: string,
          addressPayload: any,
        ) => {
          const formData = new FormData();

          // Loop through each key in the payload and append it if it's not null or undefined
          Object.entries(addressPayload).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(key, value as string);
            }
          });
          try {
            const data = await putData(
              '/admin_address/edit/' + addressPayload.id,
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

        if (adminId !== null) {
          // Edit current address

          if (!tuched) setActiveForm((prev: number) => prev + 1);
          else {
            if (
              adminAddress?.address_type === 'current_address' &&
              editableCurrent &&
              tuchedCurrent
            )
              await editAddress('Current', currentAddressPayload);
            // Edit permanent address

            if (
              permanentAddress?.address_type === 'permanent_address' &&
              tuchedPram
            )
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
        setadminAddress((prevState) => ({
          ...prevState,
          ['country']: value,
        }));
        setadminAddress((prevState) => ({ ...prevState, ['state']: '' }));
        setstate_col(true);
        setcontry_col(false);
      } else if (name === 'state') {
        setadminAddress((prevState) => ({ ...prevState, ['state']: value }));
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
            data-testid="address1"
            type="text"
            name="address1"
            className="form-control"
            value={adminAddress.address1}
            onChange={(e) => handleInputChange(e, 'current')}
            required
            autoComplete="off"
          />
          <div>
            {' '}
            {(adminAddress?.address1 === '' || add_col) && (
              <p style={{ color: 'red' }}>Please enter Address 1.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label"> Address 2</label>
          <input
            type="text"
            data-testid="address2"
            name="address2"
            className="form-control"
            value={adminAddress?.address2}
            onChange={(e) => handleInputChange(e, 'current')}
            // required

            autoComplete="off"
          />
        </div>

        <div className="col-6 pb-3 form_field_wrapper">
          <label
            className={`col-form-label  ${
              isFocusedstate || adminAddress?.country
                ? 'focused'
                : 'focusedempty'
            }`}
            style={{ fontSize: '14px' }}
          >
            Country <span>*</span>
          </label>
          <CountryDropdown
            data-testid="countryDropdown"
            classes="form-select custom-dropdown"
            defaultOptionLabel={adminAddress.country}
            value={adminAddress.country || ''}
            onChange={(e: string) =>
              handleInputChangecountry(e, 'current_address', 'country')
            }
          />
          <div>
            {' '}
            {contry_col && (
              <p style={{ color: 'red' }}>Please select Country Name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label
            className={`col-form-label ${
              isFocusedstate || adminAddress.state ? 'focused' : 'focusedempty'
            }`}
            style={{ fontSize: '14px' }}
          >
            State <span>*</span>
          </label>

          <RegionDropdown
            data-testid="stateDropdown"
            classes="form-select custom-dropdown"
            defaultOptionLabel={adminAddress.state}
            country={adminAddress.country || ''}
            value={adminAddress.state || ''}
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
            data-testid="cityid"
            type="text"
            name="city"
            className="form-control"
            value={adminAddress?.city}
            onChange={(e) => handleInputChange(e, 'current')}
            required
            autoComplete="off"
          />
          <div>
            {' '}
            {city_col && adminAddress?.city !== '' && (
              <p style={{ color: 'red' }}>
                Please enter a valid City Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {' '}
            {(adminAddress?.city == '' || city_colerror) && (
              <p style={{ color: 'red' }}>Please enter City name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            District <span>*</span>
          </label>

          <input
            data-testid="districtid"
            type="text"
            name="district"
            className="form-control"
            value={adminAddress?.district}
            onChange={(e) => handleInputChange(e, 'current')}
            required
            autoComplete="off"
          />
          <div>
            {' '}
            {district_col && adminAddress?.district !== '' && (
              <p style={{ color: 'red' }}>
                Please enter a valid District Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {' '}
            {(adminAddress?.district == '' || district_colerror) && (
              <p style={{ color: 'red' }}>Please enter District name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            Pincode <span>*</span>
          </label>

          <input
            data-testid="pincodeid"
            type="text"
            name="pincode"
            className="form-control"
            maxLength={6}
            value={adminAddress.pincode || ''}
            onChange={(e) => handleInputChange(e, 'current')}
            required
            autoComplete="off"
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
            {adminAddress.pincode === '' && (
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
                  data-testid="checkboxAddress"
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
            data-testid="per_address1"
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
            {(adminAddress?.address1 === '' || add_col1) && (
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
            data-testid="per_address2"
            type="text"
            name="address2"
            className="form-control"
            value={permanentAddress.address2}
            onChange={(e) => handleInputChange(e, 'permanent')}
            // required

            autoComplete="off"
          />
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
            data-testid="perCountryDropdown"
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
            data-testid="perStateDropdown"
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
            data-testid="per_city"
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
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            District <span></span>
          </label>

          <input
            data-testid="per_district"
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
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {' '}
            Pincode <span></span>
          </label>

          <input
            data-testid="per_pincode"
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
              data-testid="submitForm"
              type="button"
              className="btn btn-dark px-lg-5  ms-auto d-block rounded-pill next-btn px-4"
              onClick={SubmitHandle}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdminAddress;
