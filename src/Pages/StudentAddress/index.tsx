import React, { useEffect, useRef, useState } from "react";

import {
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useApi from "../../hooks/useAPI";
import { deepEqual } from "../../utils/helpers";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { ChildComponentProps } from "../StudentProfile";

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

const StudentAddress: React.FC<ChildComponentProps> = ({ setActiveForm }) => {
  let StudentId = localStorage.getItem("_id");
  console.log(StudentId);
  const { getData, postData, putData } = useApi();
  const [studentAddress, setStudentAddress] = useState<StudentAddress>({
    address_type: "current",
  });
  const [studentAddress1, setStudentAddress1] = useState<StudentAddress>({
    address_type: "current",
  });
  const [permanentAddress, setPermanentAddress] = useState<StudentAddress>({
    address_type: "permanent",
  });
  const [permanentAddress1, setPermanentAddress1] = useState<StudentAddress>({
    address_type: "permanent",
  });
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const [pincode, setPincode] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState({ currentpin: "", permanentpin: "" });
  const [contry_col, setcontry_col] = useState<boolean>(false);
  const [add_col, setAdd_col] = useState<boolean>(false);
  const [add2_col, setAdd2_col] = useState<boolean>(false);
  const [city_colerror, setCity_colerror] = useState<boolean>(false);
  const [district_colerror, setDistrict_colerror] = useState<boolean>(false);
  const [state_col, setstate_col] = useState<boolean>(false);
  const [city_col, setcity_col] = useState<boolean>(false);
  const [district_col, setdistrict_col] = useState<boolean>(false);
  const [pincode_col, setpincode_col] = useState<boolean>(false);
  const [contry_col1, setcontry_col1] = useState<boolean>(false);
  const [state_col1, setstate_col1] = useState<boolean>(false);
  const [city_col1, setcity_col1] = useState<boolean>(false);
  const [district_col1, setdistrict_col1] = useState<boolean>(false);
  const [pincode_col1, setpincode_col1] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

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
      currentDropdown.addEventListener("focus", handleFocus as EventListener);
      currentDropdown.addEventListener("blur", handleBlur as EventListener);
    }
    const currentDropdownstate = dropdownstateRef.current;
    if (currentDropdownstate) {
      currentDropdownstate.addEventListener(
        "focus",
        handleFocusstate as EventListener
      );
      currentDropdownstate.addEventListener(
        "blur",
        handleBlurstate as EventListener
      );
    }

    return () => {
      if (currentDropdown) {
        currentDropdown.removeEventListener(
          "focus",
          handleFocus as EventListener
        );
        currentDropdown.removeEventListener(
          "blur",
          handleBlur as EventListener
        );
      }
      if (currentDropdownstate) {
        currentDropdownstate.removeEventListener(
          "focus",
          handleFocusstate as EventListener
        );
        currentDropdownstate.removeEventListener(
          "blur",
          handleBlurstate as EventListener
        );
      }
    };
  }, []);

  const validatePincode = (pincode: any) => {
    const pincodePattern = /^[1-9][0-9]{5}$/;
    return pincodePattern.test(pincode);
  };
  const listData = async () => {
    getData(`${"student_address/edit/" + StudentId}`)
      .then((response: any) => {
        if (response?.status === 200) {
          let add1 :any
            let add2 :any
          response?.data.forEach((address: any) => {
            
            if (address?.address_type === "permanent") {
              setPermanentAddress(address);
              setPermanentAddress1(address);
               add1 = address
            } else if (address?.address_type === "current") {
              setStudentAddress(address);
              setStudentAddress1(address);
               add2 = address
              
            }
          
          });
           // Filter out unwanted fields from both add1 and add2
      const fieldsToCompare = ['address1', 'address2', 'city', 'country', 'district', 'pincode', 'state'];

      const filteredAdd1:any = {};
      const filteredAdd2:any = {};

      fieldsToCompare?.forEach(field => {
        if (add1?.hasOwnProperty(field)) {
          filteredAdd1[field] = add1[field];
        }
        if (add2?.hasOwnProperty(field)) {
          filteredAdd2[field] = add2[field];
        }
      });

      // Use deepEqual to compare only the selected fields
      const equal = deepEqual(filteredAdd1, filteredAdd2);
          if(equal){
            setChecked(true)
          }
        } else if (response?.status === 404) {
          setEditFlag(true);
          // toast.error(response?.message, {
          //   hideProgressBar: true,
          //   theme: "colored",
          // });
        } else {
          toast.error(response?.message, {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center",
          });
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center",
        });
      });
  };
  useEffect(() => {
    listData();
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    addressType: string
  ) => {
    const { name, value } = event.target;
    setChecked(false)

    if (addressType === "current") {
      if (name === "country") {
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setcontry_col(true);
        } else {
          setcontry_col(false);
        }
      }
      if (name === "state") {
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setstate_col(true);
        } else {
          setstate_col(false);
        }
      }
      if (name === "city") {
        if(value === "" ){
          setCity_colerror(true)
        }else{
          setCity_colerror(false)
        }
        // if (!/^[a-zA-Z\s]*$/.test(value)) {
          if (!/^[A-Za-z]+(?:[ A-Za-z]+)*$/.test(value)) {
          setcity_col(true);
        } else {
          setcity_col(false);
        }
      }
      if (name === "district") {
        if(value === "" ){
          setDistrict_colerror(true)
        }else{
          setDistrict_colerror(false)
        }
        if (!/^[A-Za-z]+(?:[ A-Za-z]+)*$/.test(value)) {
          setdistrict_col(true);
        } else {
          setdistrict_col(false);
        }
      }
      if (name === "pincode") {
        if (value === "" || /^\d{6}$/.test(value)) {
          setpincode_col(false);
        } else {
          setpincode_col(true);
        }
      }
      if (name === "address1") {
        // if (value === "") {
          if (value === "" || (!/^[A-Za-z0-9]+(?:[ A-Za-z0-9]+)*$/.test(value))) {
          setAdd_col(true);
        } else {
          setAdd_col(false)
        }
      }
      if (name === "address2") {
        if (value === "") {
          setAdd2_col(true);
        } else {
          setAdd2_col(false)
        }
      }
      // if(name==='pincode')
      // {
      //       setErrors({
      //         ...errors,
      //         currentpin: !validatePincode(value) ? 'Please enter a valid Pincode Only numbers allowed.' : '',
      //       });
      // }
      setStudentAddress((prevState) => ({ ...prevState, [name]: value }));
    } else {
      if (name === "country") {
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setcontry_col1(true);
        } else {
          setcontry_col1(false);
        }
      }
      if (name === "state") {
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setstate_col1(true);
        } else {
          setstate_col1(false);
        }
      }
      if (name === "city") {
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setcity_col1(true);
        } else {
          setcity_col1(false);
        }
      }
      if (name === "district") {
        if (!/^[a-zA-Z\s]*$/.test(value)) {
          setdistrict_col1(true);
        } else {
          setdistrict_col1(false);
        }
      }
      if (name === "pincode") {
        if (value === "" || /^\d{6}$/.test(value)) {
          setpincode_col1(false);
        } else {
          setpincode_col1(true);
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
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setChecked(true)
      setPermanentAddress({ ...studentAddress, address_type: "permanent" });
    } else {
      setChecked(false)
      setPermanentAddress((prevPermanentAddress) => ({
        ...prevPermanentAddress,
        address1: "",
        address2: "",
        country: "",
        state: "",
        city: "",
        district: "",
        pincode: "",
        address_type: "permanent",
      }));
    }
  };

  const changeHendels = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    // setStudentAddress(values => ({ ...values, [name]: value }))
    setPincode(event.target.value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const [error, setError]: any = useState({});
  const [formData, setFormData] = useState({
    address_type: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    district: "",
    pincode: "",
  });

  //   const validate = () => {
  //     const validationError: any = {}
  //     // Address type validation
  //     if (!formData.address_type) {
  //         validationError.address_type = 'Address type is required';
  //     }

  //     // Address1 validation
  //     if (!formData.address1) {
  //         validationError.address1 = 'Address 1 is required';
  //     }
  //     // Address2 validation
  //     if (!formData.address2) {
  //         validationError.address2 = 'Address 2 is required';
  //     }

  //     // Country validation
  //     if (!formData.country) {
  //         validationError.country = 'Country is required';
  //     }

  //     // State validation
  //     if (!formData.state) {
  //         validationError.state = 'State is required';
  //     }

  //     // City validation
  //     if (!formData.city) {
  //         validationError.city = 'City is required';
  //     }

  //     // District validation
  //     if (!formData.district) {
  //         validationError.district = 'District is required';
  //     }

  //     // Pincode validation
  //     if (!formData.pincode) {
  //         validationError.pincode = 'Pincode is required';
  //     } else if (!/^\d{6}$/.test(formData.pincode)) {
  //         validationError.pincode = 'Invalid pincode';
  //     }

  //     setError(validationError);
  //     return Object.keys(validationError).length === 0 ? true : false;
  //     // // If no errors, proceed with form submission
  //     if (Object.keys(validationError).length === 0) {
  //         // Your form submission logic here
  //         console.log('Form submitted successfully!');
  //     }
  // }

  const SubmitHandle = async () => {
    if(!("address1" in studentAddress) || studentAddress?.address1 === ""){
      setAdd_col(true)

    }else{
      setAdd_col(false)
    }
    // if(!("address2" in studentAddress) || studentAddress?.address2 === ""){
    //   setAdd2_col(true)

    // }else{
    //   setAdd2_col(false)
    // }
    if(!("city" in studentAddress) || studentAddress?.city === ""){
      setCity_colerror(true)

    }else{
      setCity_colerror(false)
    }
    if(!("district" in studentAddress) || studentAddress?.district === ""){
      setDistrict_colerror(true)

    }else{
      setDistrict_colerror(false)
    }
    if(!("pincode" in studentAddress) || studentAddress?.pincode === ""){
      setpincode_col(true)

    }else{
      setpincode_col(false)
    }
    // event: React.FormEvent<HTMLFormElement>
    // event.preventDefault();
    if (validatePincode(pincode)) {
      setIsValid(true);
      // toast.success('Pincode is valid');
    } else {
      setIsValid(false);
      // toast.error('Pincode is invalid');
    }
    // const validation = validate();
    // if (validation == true) {

    if (!("country" in studentAddress) || studentAddress?.country === "") {
      setcontry_col(true);
    } else {
      setcontry_col(false);
    }

    if (!("country" in permanentAddress) || permanentAddress?.country === "") {
      setcontry_col1(true);
    } else {
      setcontry_col1(false);
    }

    const currentAddressPayload = {
      student_id: StudentId,
      ...studentAddress,
    };

    const permanentAddressPayload = {
      student_id: StudentId,
      ...permanentAddress,
    };
    const eq = deepEqual(studentAddress1, currentAddressPayload);
    const permanentAddressEq = deepEqual(
      permanentAddress1,
      permanentAddressPayload
    );
    if (
      studentAddress?.address1 &&
      studentAddress?.country &&
      studentAddress?.state &&
      studentAddress?.city &&
      studentAddress?.district &&
      studentAddress?.pincode &&
      !city_col &&
      !district_col
    ) {
      if (editFlag) {
        const addAddress = async (addressType: string, addressPayload: any) => {
          try {
            const data = await postData("/student_address/add", addressPayload);
            console.log(data);
            if (data?.status === 200) {
              toast.success(`${addressType} address saved successfully`, {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center",
              });
         if(addressType === "Current"){
           setActiveForm((prev) => prev + 1);
         }
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
                theme: "colored",
                position: "top-center",
              });
            } else {
              toast.error("An unexpected error occurred", {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center",
              });
            }
          }
        };

        // Add current address
        if (studentAddress?.address_type === "current") {
          await addAddress("Current", currentAddressPayload);
        }
        // Add permanent address
        if (permanentAddress?.address_type === "permanent") {
          await addAddress("Permanent", permanentAddressPayload);
        }
      } else {
        const editAddress = async (
          addressType: string,
          addressPayload: any
        ) => {
          try {
            const data = await putData("/student_address/edit/" + StudentId, {
              ...addressPayload,
              pincode: addressPayload?.pincode || 0,
            });
            // console.log(data);
            if (data?.status === 200) {
              toast.success(`${addressType} address updated successfully`, {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center",
              });
              listData();
              
              if (!eq || !permanentAddressEq){
                if(!eq && !permanentAddressEq){
                }else{
                  console.log("tets log tt",!eq,!permanentAddressEq)
                  setActiveForm((prev) => prev + 1);
                }
              }
              
            } else if (data?.status === 201) setActiveForm((prev) => prev + 1);
            else {
              // toast.error(`Failed to update ${addressType} address`, {
              //   hideProgressBar: true,
              //   theme: "colored",
              // });
            }
          } catch (error) {
            if (error instanceof Error) {
              toast.error(error?.message, {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center",
              });
            } else {
              toast.error("An unexpected error occurred", {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center",
              });
            }
          }
        };

        if (StudentId !== null) {
          // Edit current address
          if (eq && permanentAddressEq) setActiveForm((prev) => prev + 1);
          else {
            if (studentAddress?.address_type === "current" && !eq)
              await editAddress("Current", currentAddressPayload);
            // Edit permanent address
            if (
              permanentAddress?.address_type === "permanent" &&
              !permanentAddressEq
            )
              await editAddress("Permanent", permanentAddressPayload);
          }
        } else {
          // Handle the case where StudentId is null
          console.error("StudentId is null. Unable to edit addresses.");
        }
      }
    }
    // }
  };
  const handleInputChangecountry = (
    value: string,
    addressType: string,
    name: string
  ) => {
    if (addressType === "current_address") {
      if (name === "country") {
        setStudentAddress((prevState) => ({
          ...prevState,
          ["country"]: value,
        }));
        setStudentAddress((prevState) => ({ ...prevState, ["state"]: "" }));
        setstate_col(true);
        setcontry_col(false);
        // if(adminAddress1.country === value && adminAddress1.state === adminAddress.state ){
        //   setstate_col(false)
        // }
      } else if (name === "state") {
        setStudentAddress((prevState) => ({ ...prevState, ["state"]: value }));
        setstate_col(false);
      } else {
        return;
      }
    } else {
      if (name === "country") {
        setPermanentAddress((prevState) => ({
          ...prevState,
          ["country"]: value,
        }));
        setPermanentAddress((prevState) => ({ ...prevState, ["state"]: "" }));
        setstate_col1(true);
        setcontry_col1(false);
      } else if (name === "state") {
        setPermanentAddress((prevState) => ({
          ...prevState,
          ["state"]: value,
        }));
        setstate_col1(false);
      } else {
        return;
      }
    }
  };
  return (
    <form>
      <div className="row form_field_wrapper">
        <div className="col-12">
          <h5 className="font-weight-bold profiletext">
            {" "}
            <b>Current Address</b>
          </h5>
        </div>
      </div>
      <div className="row">
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Address 1 <span>*</span>
          </label>
          <input
            type="text"
            name="address1"
            className="form-control"
            value={studentAddress.address1}
            onChange={(e) => handleInputChange(e, "current")}
            required
          />
          <div>
            {" "}
            {(studentAddress?.address1 === "" || add_col) && (
              <p style={{ color: "red" }}>Please enter Address 1.</p>
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
            onChange={(e) => handleInputChange(e, "current")}
            // required
          />
           {/* {" "}
            {(studentAddress.address2 === "" || add2_col) && (
              <p style={{ color: "red" }}>Please enter Address 2.</p>
            )} */}
        </div>
       

        <div className="col-6 pb-3 form_field_wrapper">
          <label
            className={`col-form-label  ${
              isFocusedstate || studentAddress?.country
                ? "focused"
                : "focusedempty"
            }`}
            style={{ fontSize: "14px" }}
          >
            Country <span>*</span>
          </label>
          <CountryDropdown
            classes="form-select custom-dropdown"
            defaultOptionLabel={studentAddress.country}
            value={studentAddress.country || ""}
            onChange={(e: string) =>
              handleInputChangecountry(e, "current_address", "country")
            }
          />
          <div>
            {" "}
            {contry_col && (
              <p style={{ color: "red" }}>Please select Country Name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label
            className={`col-form-label ${
              isFocusedstate || studentAddress.state
                ? "focused"
                : "focusedempty"
            }`}
            style={{ fontSize: "14px" }}
          >
            State <span>*</span>
          </label>

          <RegionDropdown
            classes="form-select custom-dropdown"
            defaultOptionLabel={studentAddress.state}
            country={studentAddress.country || ""}
            value={studentAddress.state || ""}
            // onChange={(val) => setRegion(val)}
            onChange={(e: string) =>
              handleInputChangecountry(e, "current_address", "state")
            }
          />
          <div>
            {" "}
            {state_col && (
              <p style={{ color: "red" }}>Please select a valid state Name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            City <span>*</span>
          </label>
          {/* <TextField
            type="text"
            name="city"
            className="form-control"
            value={studentAddress?.city}
            onChange={(e) => handleInputChange(e, "current")}
            required
          /> */}
          <input
            type="text"
            name="city"
            className="form-control"
            value={studentAddress?.city}
            onChange={(e) => handleInputChange(e, "current")}
            required
          />
          <div>
            {" "}
            {city_col && studentAddress?.city !== "" && (
              <p style={{ color: "red" }}>
                Please enter a valid City Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {" "}
            {(studentAddress?.city == "" || city_colerror) && (
              <p style={{ color: "red" }}>Please enter City name.</p>
            )}
          </div>
          {/* {error.city && <span style={{ color: 'red' }}>{error.city}</span>} */}
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            District <span>*</span>
          </label>
          {/* <TextField
            type="text"
            name="district"
            className="form-control"
            value={studentAddress?.district}
            onChange={(e) => handleInputChange(e, "current")}
            required
          /> */}
          <input
            type="text"
            name="district"
            className="form-control"
            value={studentAddress?.district}
            onChange={(e) => handleInputChange(e, "current")}
            required
          />
          <div>
            {" "}
            {district_col && studentAddress?.district !== "" && (
              <p style={{ color: "red" }}>
                Please enter a valid District Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {" "}
            {(studentAddress?.district == "" || district_colerror) && (
              <p style={{ color: "red" }}>Please enter District name.</p>
            )}
          </div>
          {/* {error.district && <span style={{ color: 'red' }}>{error.district}</span>} */}
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Pincode <span>*</span>
          </label>
          {/* <TextField
            type="text"
            name="pincode"
            className="form-control"
            value={studentAddress.pincode}
            onChange={(e) => handleInputChange(e, "current")}
            required
            // error={!!errors.currentpin}
            // helperText={errors.currentpin}
          /> */}
          <input
            type="text"
            name="pincode"
            className="form-control"
            value={studentAddress.pincode || ""}
            onChange={(e) => handleInputChange(e, "current")}
            required
            // error={!!errors.currentpin}
            // helperText={errors.currentpin}
          />
          <div>
            {" "}
            {pincode_col && (
              <p style={{ color: "red" }}>
                Please enter a valid 6-digit Pincode (numbers only).
              </p>
            )}
          </div>
          <div>
            {" "}
            {studentAddress.pincode === "" && (
              <p style={{ color: "red" }}>Please enter Pincode.</p>
            )}
          </div>
          {/* {error.pincode && <span style={{ color: 'red' }}>{error.pincode}</span>} */}
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12 ">
          <h5 className="font-weight-bold profiletext">
            {" "}
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
                />
              }
              label="Same as Current Address"
            />
          </FormControl>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Address 1 <span></span>
          </label>
          {/* <TextField
            type="text"
            name="address1"
            className="form-control"
            value={permanentAddress.address1}
            onChange={(e) => handleInputChange(e, "permanent")}
            // required
          /> */}
          <input
            type="text"
            name="address1"
            className="form-control"
            value={permanentAddress.address1}
            onChange={(e) => handleInputChange(e, "permanent")}
            // required
          />
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Address 2 <span></span>
          </label>
          {/* <TextField
            type="text"
            name="address2"
            className="form-control"
            value={permanentAddress.address2}
            onChange={(e) => handleInputChange(e, "permanent")}
            // required
          /> */}
          <input
            type="text"
            name="address2"
            className="form-control"
            value={permanentAddress.address2}
            onChange={(e) => handleInputChange(e, "permanent")}
            // required
          />
          {/* {error.address2 && <span style={{ color: 'red' }}>{error.address2}</span>} */}
        </div>
        {/* <div className="col-6 pb-3">
          <label>
            {" "}
            Country <span></span>
          </label>
          <TextField
            type="text"
            name="country"
            className="form-control"
            value={permanentAddress.country}
            onChange={(e) => handleInputChange(e, "permanent")}
            // required
          />
           <div> {contry_col1 && (
            <p style={{ color: 'red' }}>Please enter a valid Country Name only characters allowed.</p>
          )}</div>
        </div>
        <div className="col-6 pb-3">
          <label>
            {" "}
            State <span></span>
          </label>
          <TextField
            type="text"
            name="state"
            className="form-control"
            value={permanentAddress.state}
            onChange={(e) => handleInputChange(e, "permanent")}
            // required
          />
           <div> {state_col1 && (
            <p style={{ color: 'red' }}>Please enter a valid state Name only characters allowed.</p>
          )}</div>
        </div> */}
        <div className="col-6 pb-3 form_field_wrapper" ref={dropdownRef}>
          <label
            className={`col-form-label ${
              isFocused || permanentAddress.country ? "focused" : "focusedempty"
            }`}
            style={{ fontSize: "14px" }}
          >
            Country <span></span>
          </label>
          <CountryDropdown
            classes="form-select custom-dropdown"
            defaultOptionLabel={permanentAddress.country || ""}
            value={permanentAddress.country || ""}
            onChange={(e: string) =>
              handleInputChangecountry(e, "permanent_address", "country")
            }
          />
          {/* <div>
            {" "}
            {contry_col1 && (
              <p style={{ color: "red" }}>Please enter Country Name.</p>
            )}
          </div> */}
        </div>
        <div className="col-6 pb-3 form_field_wrapper" ref={dropdownstateRef}>
          <label
            className={`col-form-label ${
              isFocusedstate || permanentAddress.state
                ? "focused"
                : "focusedempty"
            }`}
            style={{ fontSize: "14px" }}
          >
            State <span></span>
          </label>

          <RegionDropdown
            classes="form-select custom-dropdown"
            defaultOptionLabel={permanentAddress.state || ""}
            country={permanentAddress.country || ""}
            value={permanentAddress.state || ""}
            // onChange={(val) => setRegion(val)}
            onChange={(e: string) =>
              handleInputChangecountry(e, "permanent_address", "state")
            }
          />
          <div>
            {" "}
            {state_col1 && (
              <p style={{ color: "red" }}>Please enter a valid state Name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            City <span></span>
          </label>
          {/* <TextField
            type="text"
            name="city"
            className="form-control"
            value={permanentAddress.city}
            onChange={(e) => handleInputChange(e, "permanent")}
            // required
          /> */}
          <input
            type="text"
            name="city"
            className="form-control"
            value={permanentAddress.city}
            onChange={(e) => handleInputChange(e, "permanent")}
            // required
          />
          <div>
            {" "}
            {city_col1 && (
              <p style={{ color: "red" }}>
                Please enter a valid City Name only characters allowed.
              </p>
            )}
          </div>
          {/* {error.city && <span style={{ color: 'red' }}>{error.city}</span>} */}
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            District <span></span>
          </label>
          {/* <TextField
            type="text"
            name="district"
            className="form-control"
            value={permanentAddress.district}
            onChange={(e) => handleInputChange(e, "permanent")}
            // required
          /> */}
          <input
            type="text"
            name="district"
            className="form-control"
            value={permanentAddress.district}
            onChange={(e) => handleInputChange(e, "permanent")}
            // required
          />
          <div>
            {" "}
            {district_col1 && (
              <p style={{ color: "red" }}>
                Please enter a valid District Name only characters allowed.
              </p>
            )}
          </div>
          {/* {error.district && <span style={{ color: 'red' }}>{error.district}</span>} */}
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Pincode <span></span>
          </label>
          {/* <TextField
            type="text"
            name="pincode"
            className="form-control"
            value={permanentAddress.pincode}
            onChange={(e) => handleInputChange(e, "permanent")}
            // required
            // error={!!errors.permanentpin}
            // helperText={errors.permanentpin}
          /> */}
          <input
            type="text"
            name="pincode"
            className="form-control"
            value={permanentAddress.pincode || ""}
            onChange={(e) => handleInputChange(e, "permanent")}
            // required
            // error={!!errors.permanentpin}
            // helperText={errors.permanentpin}
          />
          <div>
            {" "}
            {pincode_col1 && (
              <p style={{ color: "red" }}>
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
                setActiveForm((prev) => prev - 1);
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
