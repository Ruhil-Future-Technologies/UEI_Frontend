/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { ChildComponentProps } from "../StudentProfile";
import { FormControl, TextField } from "@mui/material";


const ParentInStudentProfile: React.FC<ChildComponentProps> = ({ setActiveForm, }) => {

    const [parentEmail, setParentEmail] = useState("");
    const [parentPhone, setParentPhone] = useState("");
    const [parentEmailError, setParentEmailError] = useState(false);
    const [parentPhoneError, setParentPhoneError] = useState(false);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validateMobile = (id: string) => {
        const regex = /^[1-9][0-9]{9}$/;
        return regex.test(id) && !/^0+$/.test(id);
    };
    const handleChanges = (value: string, name: string) => {

        console.log(value, name)
        if (name == "email") {
            setParentEmail(value);
            if (!emailPattern.test(value)) {
                setParentEmailError(true)
            } else {
                setParentEmailError(false)
            }
        }
        if (name == "phone") {
            setParentPhone(value);
            if (!validateMobile(value)) {
                setParentPhoneError(true)
            } else {
                setParentPhoneError(false)
            }
        }
    }

    const submitHandel = () => {
        setActiveForm(6);
    }

    return (
        <>
            <div>
                <b className="font-weight-bold profiletext mb-4 d-block">
                    Parent Information
                </b>
            </div>
            <div className="form_field_wrapper">
                <div className="col-md-6 col-12 form_field_wrapper mb-3">
                    <FormControl fullWidth>
                        <TextField
                            name="email"
                            size="small"
                            label="parent email"
                            type="email"
                            onChange={(event) => handleChanges(event.target.value, event.target.name)}
                            value={parentEmail}
                        />
                        {parentEmailError &&
                            <p style={{ color: 'red' }}>
                                Please enter a valid email.
                            </p>
                        }
                    </FormControl>
                </div>
                <div className="col-md-6 col-12 mt-3">
                    <FormControl fullWidth>
                        <TextField
                            name="phone"
                            size="small"
                            label="mobile number"
                            onChange={(event) => handleChanges(event.target.value, event.target.name)}
                            value={parentPhone}
                        />
                        {parentPhoneError &&
                            <p style={{ color: 'red' }}>
                                Please enter a valid phone no.
                            </p>
                        }
                    </FormControl>
                </div>
            </div>
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
        </>
    );
}

export default ParentInStudentProfile;