import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  LocalizationProvider,
  DateTimePicker,
  DatePicker,
} from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState, useEffect, useRef } from "react";
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import { error } from "console";
import { deepEqual } from "../../utils/helpers";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { ChildComponentProps } from "../StudentProfile";
let adminId = localStorage.getItem("_id");
// console.log(adminId);
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
////start
const AdminAddress: React.FC<ChildComponentProps> = ({ setActiveForm }) => {
  let adminId = localStorage.getItem("_id");

  // console.log(adminId);

  const { getData, postData, putData } = useApi();
  const [adminAddress, setadminAddress] = useState<AdminAddress>({
    address_type: "current_address",
  });

  const [adminAddress1, setadminAddress1] = useState<AdminAddress>({
    address_type: "current_address",
  });

  const [permanentAddress, setPermanentAddress] = useState<AdminAddress>({
    address_type: "permanent_address",
  });

  const [permanentAddress1, setPermanentAddress1] = useState<AdminAddress>({
    address_type: "permanent",
  });

  const [editFlag, setEditFlag] = useState<boolean>(false);

  const [contry_col, setcontry_col] = useState<boolean>(false);
  const [state_col, setstate_col] = useState<boolean>(false);
  const [city_col, setcity_col] = useState<boolean>(false);
  const [district_col, setdistrict_col] = useState<boolean>(false);
  const [city_colerror, setCity_colerror] = useState<boolean>(false);
  const [district_colerror, setDistrict_colerror] = useState<boolean>(false);
  const [pincode_col, setpincode_col] = useState<boolean>(false);
  const [contry_col1, setcontry_col1] = useState<boolean>(false);
  const [state_col1, setstate_col1] = useState<boolean>(false);
  const [city_col1, setcity_col1] = useState<boolean>(false);
  const [district_col1, setdistrict_col1] = useState<boolean>(false);
  const [pincode_col1, setpincode_col1] = useState<boolean>(false);
  const [add_col, setAdd_col] = useState<boolean>(false);
  const [add2_col, setAdd2_col] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const getAddressInfo = async () => {
    getData(`${"admin_address/edit/" + adminId}`)
      .then((response: any) => {
        // console.log(response);
        if (response?.status === 200) {
          let add1 :any
          let add2 :any
          response?.data.forEach((address: any) => {
            if (address?.address_type === "permanent_address") {
              setPermanentAddress(address);
              setPermanentAddress1(address);
              add1 = address
            } else if (address?.address_type === "current_address") {
              setadminAddress(address);
              setadminAddress1(address);
              add2 = address
            } else {
              //empty
              console.error("Unexpected response:", response);
            }
          });

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
        } else {
          toast.error(response?.message, {
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
  };
  useEffect(() => {
    getAddressInfo();
  }, [adminId]);

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | SelectChangeEvent<string>,

    addressType: string
  ) => {
    const { name, value } = event.target;
    setChecked(false)
    if (addressType === "current_address") {
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

      setadminAddress((prevState) => ({ ...prevState, [name]: value }));
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
        if (value === "" || /^\d+$/.test(value)) {
          setpincode_col1(false);
        } else {
          setpincode_col1(true);
        }
      }

      setPermanentAddress((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handlePermanentAddressCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setChecked(true)
      for (const key of Object.keys(adminAddress)) {
        if (key === "country") {
          if (!/^[a-zA-Z\s]*$/.test(adminAddress?.country || "")) {
            setcontry_col1(true);
          } else {
            setcontry_col1(false);
          }
        }
        if (key === "state") {
          if (!/^[a-zA-Z\s]*$/.test(adminAddress?.state || "")) {
            setstate_col1(true);
          } else {
            setstate_col1(false);
          }
        }
        if (key === "city") {
          if (!/^[a-zA-Z\s]*$/.test(adminAddress?.city || "")) {
            setcity_col1(true);
          } else {
            setcity_col1(false);
          }
        }
        if (key === "district") {
          if (!/^[a-zA-Z\s]*$/.test(adminAddress?.district || "")) {
            setdistrict_col1(true);
          } else {
            setdistrict_col1(false);
          }
        }
        if (key === "pincode") {
          if (/^\d+$/.test(adminAddress?.pincode || "")) {
            setpincode_col1(false);
          } else {
            setpincode_col1(true);
          }
        }
      }

      setPermanentAddress({
        ...adminAddress,
        address_type: "permanent_address",
      });
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
        address_type: "permanent_address",
      }));
    }
  };

  const SubmitHandle = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!("address1" in adminAddress) || adminAddress?.address1 === ""){
      setAdd_col(true)
    }else{
      setAdd_col(false)
    }
    // if(!("address2" in adminAddress) || adminAddress?.address2 === ""){
    //   setAdd2_col(true)
    // }else{
    //   setAdd2_col(false)
    // }
    if (!("country" in adminAddress) || adminAddress?.country === "") {
      setcontry_col(true);
    } else {
      setcontry_col(false);
    }
    if (!("country" in permanentAddress) || permanentAddress?.country === "") {
      setcontry_col1(true);
    } else {
      setcontry_col1(false);
    }
    if(!("city" in adminAddress) || adminAddress?.city === ""){
      setCity_colerror(true)
    }else{
      setCity_colerror(false)
    }
    if(!("district" in adminAddress) || adminAddress?.district === ""){
      setDistrict_colerror(true)
    }else{
      setDistrict_colerror(false)
    }
    if(!("pincode" in adminAddress) || adminAddress?.pincode === ""){
      setpincode_col(true)
    }else{
      setpincode_col(false)
    }
    const currentAddressPayload = {
      admin_id: adminId,
      ...adminAddress,
    };
    const permanentAddressPayload = {
      admin_id: adminId,
      ...permanentAddress,
    };
    const eq = deepEqual(adminAddress1, currentAddressPayload);
    const permanentAddressEq = deepEqual(
      permanentAddress1,
      permanentAddressPayload
    );
    if (editFlag) {
      const addAddress = async (addressType: string, addressPayload: any) => {
        try {
          const data = await postData("/admin_address/add", addressPayload);
          if (data?.status === 200) {
            toast.success(`${addressType} Address saved successfully`, {
              hideProgressBar: true,
              theme: "colored",
            });
            setActiveForm((prev) => prev + 1);
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
            });
          } else {
            toast.error("An unexpected error occurred", {
              hideProgressBar: true,
              theme: "colored",
            });
          }
        }
      };
      // Add current address
      if (adminAddress?.address_type === "current_address") {
        await addAddress("Current", currentAddressPayload);
      }
      // Add permanent address
      if (permanentAddress?.address_type === "permanent_address") {
        await addAddress("Permanent", permanentAddressPayload);
      }
    } else {
      const editAddress = async (addressType: string, addressPayload: any) => {
        try {
          const data = await putData(
            "/admin_address/edit/" + adminId,
            addressPayload
          );
          if (data?.status === 200) {
            toast.success(`${addressType} Address updated successfully`, {
              hideProgressBar: true,
              theme: "colored",
            });
            getAddressInfo();
            setActiveForm((prev) => prev + 1);
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
            });
          } else {
            toast.error("An unexpected error occurred", {
              hideProgressBar: true,
              theme: "colored",
            });
          }
        }
      };

      if (adminId !== null) {
        // Edit current address
        if (eq && permanentAddressEq) setActiveForm((prev) => prev + 1);
        else {
          if (
            adminAddress?.address_type === "current_address" &&
            adminAddress.address1 !== "" &&
            !contry_col &&
            adminAddress.country !== "" &&
            !state_col &&
            adminAddress.state !== "" &&
            !city_col &&
            adminAddress.city !== "" &&
            !district_col &&
            adminAddress.district !== "" &&
            !pincode_col &&
            adminAddress.pincode !== ""
          ) {
            // eslint-disable-next-line no-lone-blocks
            {
              !eq && (await editAddress("Current", currentAddressPayload));
            }
          }
          // Edit permanent address
          if (
            permanentAddress?.address_type === "permanent_address" &&
            "address1" in permanentAddress &&
            permanentAddress.address1 !== "" &&
            "address2" in permanentAddress &&
            !contry_col1 &&
            "country" in permanentAddress &&
            permanentAddress.country !== "" &&
            !state_col1 &&
            "state" in permanentAddress &&
            permanentAddress.state !== "" &&
            !city_col1 &&
            "city" in permanentAddress &&
            permanentAddress.city !== "" &&
            !district_col1 &&
            "district" in permanentAddress &&
            permanentAddress.district !== "" &&
            !pincode_col1 &&
            "pincode" in permanentAddress &&
            permanentAddress.pincode !== ""
          ) {
            await editAddress("Permanent", permanentAddressPayload);
          }
        }
      } else {
        // Handle the case where adminId is null
        console.error("adminId is null. Unable to edit addresses.");
      }
    }
  };
  const handleInputChangecountry = (
    value: string,
    addressType: string,
    name: string
  ) => {
    if (addressType === "current_address") {
      if (name === "country") {
        setadminAddress((prevState) => ({ ...prevState, ["country"]: value }));
        setadminAddress((prevState) => ({ ...prevState, ["state"]: "" }));
        setstate_col(true);
        setcontry_col(false);
      } else if (name === "state") {
        setadminAddress((prevState) => ({ ...prevState, ["state"]: value }));
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
            value={adminAddress.address1}
            onChange={(e) => handleInputChange(e, "current_address")}
            required
          />
          <div>
            {" "}
            {(adminAddress.address1 == "" || add_col) && (
              <p style={{ color: "red" }}>Please enter Address 1.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper mt-2">
          <label>
            {" "}
            Address 2 <span></span>
          </label>
          <input
            type="text"
            name="address2"
            className="form-control mt-1"
            value={adminAddress.address2}
            onChange={(e) => handleInputChange(e, "current_address")}
            // required
          />
           {/* <div>
            {" "}
            {(adminAddress.address2 == "" || add2_col) && (
              <p style={{ color: "red" }}>Please enter Address 2.</p>
            )}
          </div> */}
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label
            className={`col-form-label  ${
              isFocusedstate || adminAddress.country
                ? "focused"
                : "focusedempty"
            }`}
            style={{ fontSize: "14px" }}
          >
            Country <span>*</span>
          </label>
          <CountryDropdown
            classes="form-select custom-dropdown"
            defaultOptionLabel={adminAddress.country}
            value={adminAddress.country || ""}
            onChange={(e: string) =>
              handleInputChangecountry(e, "current_address", "country")
            }
          />
          <div>
            {" "}
            {contry_col && (
              <p style={{ color: "red" }}>Please enter Country Name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label
            className={`col-form-label ${
              isFocusedstate || adminAddress.state ? "focused" : "focusedempty"
            }`}
            style={{ fontSize: "14px" }}
          >
            State <span>*</span>
          </label>

          <RegionDropdown
            classes="form-select custom-dropdown"
            defaultOptionLabel={adminAddress.state}
            country={adminAddress.country || ""}
            value={adminAddress.state || ""}
            onChange={(e: string) =>
              handleInputChangecountry(e, "current_address", "state")
            }
          />
          <div>
            {" "}
            {state_col && (
              <p style={{ color: "red" }}>Please enter a valid state Name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            City <span>*</span>
          </label>
          <input
            type="text"
            name="city"
            className="form-control"
            value={adminAddress.city}
            onChange={(e) => handleInputChange(e, "current_address")}
            required
          />
          <div>
            {" "}
            {city_col && adminAddress.city !== "" && (
              <p style={{ color: "red" }}>
                Please enter a valid City Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {" "}
            {(adminAddress.city == "" || city_colerror )&& (
              <p style={{ color: "red" }}>Please enter City name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            District <span>*</span>
          </label>
          <input
            type="text"
            name="district"
            className="form-control"
            value={adminAddress.district}
            onChange={(e) => handleInputChange(e, "current_address")}
            required
          />
          <div>
            {" "}
            {district_col && adminAddress.district !== "" && (
              <p style={{ color: "red" }}>
                Please enter a valid District Name only characters allowed.
              </p>
            )}
          </div>
          <div>
            {" "}
            {(adminAddress.district == "" || district_colerror) && (
              <p style={{ color: "red" }}>Please enter District name.</p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Pincode <span>*</span>
          </label>
          <input
            type="text"
            name="pincode"
            className="form-control"
            value={adminAddress.pincode}
            onChange={(e) => handleInputChange(e, "current_address")}
            required
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
            {adminAddress.pincode == "" && (
              <p style={{ color: "red" }}>Please enter Pincode.</p>
            )}
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
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
          <input
            type="text"
            name="address1"
            className="form-control"
            value={permanentAddress.address1}
            onChange={(e) => handleInputChange(e, "permanent_address")}
          />
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Address 2 <span></span>
          </label>
          <input
            type="text"
            name="address2"
            className="form-control"
            value={permanentAddress.address2}
            onChange={(e) => handleInputChange(e, "permanent_address")}
          />
        </div>
        <div className="col-6 pb-3 form_field_wrapper " ref={dropdownRef}>
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
          <input
            type="text"
            name="city"
            className="form-control"
            value={permanentAddress.city}
            onChange={(e) => handleInputChange(e, "permanent_address")}
          />
          <div>
            {" "}
            {city_col1 && (
              <p style={{ color: "red" }}>
                Please enter a valid City Name only characters allowed.
              </p>
            )}
          </div>
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            District <span></span>
          </label>
          <input
            type="text"
            name="district"
            className="form-control"
            value={permanentAddress.district}
            onChange={(e) => handleInputChange(e, "permanent_address")}
          />
          <div>
            {" "}
            {district_col1 && (
              <p style={{ color: "red" }}>
                Please enter a valid District Name only characters allowed.
              </p>
            )}
          </div>
         
        </div>
        <div className="col-6 pb-3 form_field_wrapper">
          <label className="col-form-label">
            {" "}
            Pincode <span></span>
          </label>
          <input
            type="text"
            name="pincode"
            className="form-control"
            value={permanentAddress.pincode}
            onChange={(e) => handleInputChange(e, "permanent_address")}
          />
          <div>
            {" "}
            {pincode_col1 && (
              <p style={{ color: "red" }}>
                Please enter a valid Pincode only numbers allowed.
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
                setActiveForm((prev) => prev - 1);
              }}
            >
              Previous
            </button>
            <button
              type="submit"
              className="btn btn-dark px-lg-5  ms-auto d-block rounded-pill next-btn px-4"
              onClick={(e: any) => SubmitHandle(e)}
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

//////end
