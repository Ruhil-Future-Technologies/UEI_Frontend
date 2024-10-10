import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Card, CardContent, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Theme, Tooltip, useTheme } from '@mui/material';
import { LocalizationProvider, DateTimePicker, DatePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState, useEffect, useRef } from 'react';
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';

interface Department {
    id: number;
    department_name: string;
}
const steps = ['Admin Basic Information', 'Admin Address', 'Language know', 'Admin Description', 'Admin Contact Dtails', 'Admin Profession'];

let adminId = localStorage.getItem('_id')
console.log(adminId);
export default function AdminProfileMgt() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set<number>());

    const isStepOptional = (step: number) => {
        return step > 0 && step < steps.length - 1;
    };

    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    // const handleSkip = () => {
    //     if (!isStepOptional(activeStep)) {
    //         // You probably want to guard against something like this,
    //         // it should never occur unless someone's actively trying to break something.
    //         throw new Error("You can't skip a step that isn't optional.");
    //     }

    //     setActiveStep((prevActiveStep) => prevActiveStep + 1);
    //     setSkipped((prevSkipped) => {
    //         const newSkipped = new Set(prevSkipped.values());
    //         newSkipped.add(activeStep);
    //         return newSkipped;
    //     });
    // };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: {
                        optional?: React.ReactNode;
                    } = {};
                    // if (isStepOptional(index)) {
                    //     labelProps.optional = (
                    //         <Typography variant="caption">Optional</Typography>
                    //     );
                    // }
                    // if (isStepSkipped(index)) {
                    //     stepProps.completed = false;
                    // }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                         <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Previous
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                    <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}
                        {activeStep === 0 &&
                            <AdminBasicInfo />
                        }
                        {activeStep === 1 &&
                            <AdminAddress />
                        }
                        {activeStep === 2 &&
                            <AdminLenguage />
                        }
                        {activeStep === 3 &&
                            <AdminDescription />

                        }
                        {activeStep === 4 &&
                            <AdmincontactDtails />
                        }
                        {
                            activeStep === 5 &&
                            <AdminProfession />
                        }
                    </Typography>
                    {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box> */}
                </React.Fragment>
            )}
        </Box>
    );
}

function AdminAddress() {
    const { getData, postData } = useApi();

    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [addressType, setAddressType] = useState("current_address");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [pinNo, setPinNo] = useState("");

    useEffect(() => {
        getData("admin_address/edit/" + adminId).then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
                setAddress1(data?.data.address1)
                setAddress2(data?.data.address2)
                setAddressType(data?.data.address_type)
                setCountry(data?.data.country)
                setState(data?.data.state)
                setDistrict(data?.data.district)
                setCity(data?.data.city)
                setPinNo(data?.data.pincode)
            }
        })
    }, [])

    const submitHandle = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("working")
        let paylod = {
            admin_id: adminId,
            address1: address1,
            address2: address2,
            country: country,
            state: state,
            city: city,
            district: district,
            pincode: pinNo,
            address_type: addressType
        }
        //console.log(paylod)
        postData("admin_address/add", paylod).then((data: any) => {
            console.log(data)
            if (data?.state === 200) {
                toast.success(("address saved"), {
                    hideProgressBar: true,
                    theme: "colored"
                })
            }
        })
    }
    return (
        <form onSubmit={submitHandle}>
            <div className="row justify-content-center">
                <div className="col-4">
                    <FormControl>

                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={addressType}
                            onChange={(event) => setAddressType(event.target.value)}
                        >
                            <FormControlLabel value="current_address" control={<Radio />} label="Current Address" />
                            <FormControlLabel value="permanent_address" control={<Radio />} label="Permanent Address" />


                        </RadioGroup>
                    </FormControl>
                </div>
            </div>
            <div className='row d-flex justify-content-center'>
                <div className='col-4'>
                    <label > address 1</label>
                    <TextField type="text"
                        name='address1'
                        className='form-control'
                        value={address1}
                        onChange={(event) => setAddress1(event.target.value)}
                    />
                </div>

                <div className='col-4'>
                    <label >  address 2</label>
                    <TextField
                        type="text"
                        name='address2'
                        className='form-control'
                        value={address2}
                        onChange={(event) => setAddress2(event.target.value)}
                    />
                </div>
            </div>
            <div className='row d-flex justify-content-center'>
                <div className='col-4'>
                    <label > Country</label>
                    <TextField type="text"
                        name='Country'
                        className='form-control'
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                    />
                </div>

                <div className='col-4'>
                    <label > State</label>
                    <TextField type="text"
                        name='state'
                        className='form-control'
                        value={state}
                        onChange={(event) => setState(event.target.value)}
                    />
                </div>
            </div>
            <div className='row d-flex justify-content-center'>
                <div className='col-4'>
                    <label > City</label>
                    <TextField type="text"
                        name='city'
                        className='form-control'
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                    />
                </div>

                <div className='col-4'>
                    <label > District</label>
                    <TextField type="text"
                        name='district'
                        className='form-control'
                        value={district}
                        onChange={(event) => setDistrict(event.target.value)}
                    />
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-4">
                        <label>Pin code</label>
                        <TextField
                            type="text"
                            name='pincode'
                            className='form-control'
                            value={pinNo}
                            onChange={(event) => setPinNo(event.target.value)}
                        />
                    </div>
                    <div className='col-1' style={{ marginTop: '28px' }}>
                        <button className='btn btn-primary'>save</button>
                    </div>
                </div>
            </div>

        </form>
    );
}

function AdminBasicInfo() {
    const { getData, postData } = useApi();

    const [adminFName, setAdminFName] = useState('');
    const [adminLName, setAdminLName] = useState('');
    const [adminGender, setAdminGender] = useState('Male');
    const [adminDOB, setAdminDOB] = useState('');
    const [adminFatherName, setAdminFatherName] = useState('');
    const [adminMotherName, setAdminMotherName] = useState('');
    const [adminGurdian, setAdminGurdian] = useState('');
    //const [adminPicPath,setAdminPicPath]=React.useState();
    const [allDepartment, setAllDepartment] = useState<Department[]>([
        { id: 0, department_name: "" }
    ]);
    const [adminDepartment, setAdminDepartment] = useState<string>('');
    let adminId = localStorage.getItem('_id')
    console.log(adminId);

    useEffect(() => {
        getData(`${'admin_basicinfo/edit/' + adminId}`).then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
                setAdminFName(data?.data.first_name)
                setAdminLName(data?.data.last_name)
                setAdminDOB(data?.data.dob)
                setAdminGender(data?.data.gender)
                setAdminFatherName(data?.data.father_name)
                setAdminMotherName(data?.data.mother_name)
                setAdminGurdian(data?.data.guardian_name)
                setAdminDepartment(data?.data.department_id)
                setSelectedFile(data?.data.pic_path)
            } else {
                console.log("error comes from api")
            }

        })
        getData(`${'department/list'}`).then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
                setAllDepartment(data?.data);
                //console.log("hello")
            }
        })

    }, []);
    const [selectedFile, setSelectedFile] = React.useState('');

    const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        //const selectedDepartments = value.map(id => allDepartment.find(dept => dept.id.toString() == id)?id.toString():'' );
        setAdminDepartment(value);
    };

    const adminBasicInfo = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let paylod = {
            admin_login_id: adminId,
            department_id: adminDepartment,
            first_name: adminFName,
            last_name: adminLName,
            gender: adminGender,
            dob: "2024-05-13",
            father_name: adminFatherName,
            mother_name: adminMotherName,
            guardian_name: adminGurdian,
            is_kyc_verified: true,
            pic_path: selectedFile
        }
        postData('admin_basicinfo/add', paylod).then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
                toast.success(("info save successfully"), {
                    hideProgressBar: true,
                    theme: "colored"
                })
            }
        })

    }
    return (
        <form onSubmit={adminBasicInfo}>
            <div className='row d-flex justify-content-center'>
                <div className='col-4'>
                    <label > first Name</label>
                    <TextField type="text"
                        name='firstname'
                        className='form-control'
                        value={adminFName}
                        onChange={(event) => setAdminFName(event.target.value)} />
                </div>

                <div className='col-4'>
                    <label > Last Name</label>
                    <TextField type="text"
                        name='lastname'
                        className='form-control'
                        value={adminLName}
                        onChange={(event) => setAdminLName(event.target.value)}
                    />
                </div>
            </div>
            <div className='row d-flex justify-content-center'>
                <div className='col-4'>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={adminGender}
                            onChange={(event) => setAdminGender(event.target.value)}
                        >
                            <FormControlLabel value="Male" control={<Radio />} label="Male" />
                            <FormControlLabel value="Female" control={<Radio />} label="Female" />

                        </RadioGroup>
                    </FormControl>
                </div>
                <div className='col-4'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker label="Basic date picker" />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
            </div>
            <div className='row d-flex justify-content-center'>
                <div className='col-4'>
                    <label > Father name</label>
                    <TextField type="text"
                        name='fathername'
                        className='form-control'
                        value={adminFatherName}
                        onChange={(event) => setAdminFatherName(event.target.value)} />
                </div>

                <div className='col-4'>
                    <label > Mother Name</label>
                    <TextField type="text"
                        name='mothername'
                        className='form-control'
                        value={adminMotherName}
                        onChange={(event) => setAdminMotherName(event.target.value)} />
                </div>
            </div>
            <div className='row d-flex justify-content-center'>
                <div className='col-4'>
                    <label > Gurdian Name</label>
                    <TextField type="text"
                        name='gurdianname'
                        className='form-control'
                        value={adminGurdian}
                        onChange={(event) => setAdminGurdian(event.target.value)} />
                </div>

                <div className='col-4'>
                    <Grid item xs={12}>
                        <Typography variant="h6">Upload a Photo</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(event) => setSelectedFile(event.target.value)}
                            // value={selectedFile}
                            //style={{ display: 'none' }}
                            id="file-upload"
                        />

                        {selectedFile && (
                            <Typography variant="body1">{selectedFile}</Typography>
                        )}
                    </Grid>
                </div>
            </div>
            <div className='row d-flex justify-content-center'>
                <div className='col-4'>
                    <FormControl sx={{ m: 1, minWidth: 320 }} >
                        <InputLabel id="demo-select-small-label">Department name</InputLabel>
                        <Select

                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={adminDepartment}
                            label="Department name"
                            onChange={handleDepartmentChange}
                            renderValue={(selected) => (selected as string)
                            }
                        >
                            {allDepartment.map((data) => (
                                <MenuItem key={data.id} value={data.id}>
                                    {data.department_name}
                                </MenuItem>
                            ))}


                        </Select>
                    </FormControl>
                </div>
                <div className='col-3'>
                    <button className='btn btn-primary'>save</button>

                </div>
            </div>
        </form>
    );
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

function AdminLenguage() {
    const lenaguage = [
        'Hindi',
        'English',
        'Spanish',
        'Bengali',
        'Portuguese',
        'Russian',
        'Japanese',
        'Marathi',
        'Telugu',
        'Tamil',
    ];

    const theme = useTheme();
    const [personName, setPersonName] = React.useState<string[]>([]);

    const handleChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <div className='row justify-content-center'>
            <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                <Select
                    multiple
                    displayEmpty
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <em>Choose Language</em>;
                        }

                        return selected.join(', ');
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem disabled value="">

                    </MenuItem>
                    {lenaguage.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

function AdminDescription() {

    const { getData, postData } = useApi();
    const [description, setDesctiption] = useState("");

    useEffect(() => {
        getData('admin_profile_description/edit/' + adminId).then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
                setDesctiption(data?.data.description);
                //console.log("working")
            }
        })
    }, [])
    const submitHandle = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let paylod = {
            admin_id: adminId,
            description: description
        }
        postData('admin_profile_description/add', paylod).then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
                toast.success(("description saved"), {
                    hideProgressBar: true,
                    theme: "colored"
                })
            }
        })
    }
    return (
        <form onSubmit={submitHandle}>
            <Card>
                <CardContent>
                    <TextField
                        id="description"
                        label="Description"
                        multiline
                        rows={6}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={description}
                        onChange={(event) => setDesctiption(event.target.value)}
                    />
                </CardContent>
            </Card>
            <div className='row justify-content-center'>
                <div className="col-2">
                    <button className='btn btn-primary'>save</button>
                </div>
            </div>
        </form>
    );
}

function AdmincontactDtails() {
    const { getData, postData } = useApi();
    const [contcodeWtsap, setContcodeWtsap] = useState("+91");
    const [whatsappNum, setWhatsappNum] = useState('');
    const [contcodePhone, setContcodePhone] = useState('+91');
    const [phoneNum, setPhoneNum] = useState('');
    const [email, setEmail] = useState('');
    useEffect(() => {
        getData("admin_contact/edit/" + adminId).then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
                setContcodeWtsap(data?.data.mobile_isd_watsapp);
                setWhatsappNum(data?.data.mobile_no_watsapp);
                setContcodePhone(data?.data.mobile_isd_call);
                setPhoneNum(data?.data.mobile_no_call);
                setEmail(data?.data.email_id);
            }
        })
    }, [])
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let paylod = {
            admin_id: adminId,
            mobile_isd_call: contcodePhone,
            mobile_no_call: phoneNum,
            mobile_isd_watsapp: contcodeWtsap,
            mobile_no_watsapp: whatsappNum,
            email_id: email
        }
        console.log(paylod)
        postData("admin_contact/add", paylod).then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
                toast.success(("contact saved"), {
                    hideProgressBar: true,
                    theme: "colored"
                })
            }
        })
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className='d-flex justify-content-center'>
                <div className='row'>
                    <div className='col'>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Country code</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={contcodeWtsap}
                                label="Country code"
                                onChange={(event) => setContcodeWtsap(event.target.value)}
                            >
                                <MenuItem value={"+91"}>+91</MenuItem>
                                <MenuItem value={"+971"}>+971</MenuItem>
                                <MenuItem value={"+1"}>+1</MenuItem>
                            </Select>
                        </FormControl>

                    </div>
                    <div className='col'>
                        <TextField
                            type='text'
                            placeholder='Enter Whatsapp number'
                            value={whatsappNum}
                            onChange={(event) => setWhatsappNum(event.target.value)}
                        />
                    </div>

                </div>
            </div>
            <div className='d-flex justify-content-center' style={{ margin: '15px' }}>
                <div className='row'>
                    <div className='col'>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Country code</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={contcodePhone}
                                label="Country code"
                                onChange={(event) => setContcodePhone(event.target.value)}
                            >
                                <MenuItem value={"+91"}>+91</MenuItem>
                                <MenuItem value={"+971"}>+971</MenuItem>
                                <MenuItem value={"+1"}>+1</MenuItem>
                            </Select>
                        </FormControl>

                    </div>
                    <div className='col'>
                        <TextField
                            type='text'
                            placeholder='Enter mobile number'
                            value={phoneNum}
                            onChange={(event) => setPhoneNum(event.target.value)}
                        />
                    </div>

                </div>

            </div>
            <div className=' row d-flex justify-content-center'>
                <div className='col-2'>

                    <TextField
                        type='gmail'
                        placeholder='Enter Email Id'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>


                <div className="col-1">
                    <button className="btn btn-primary">save</button>
                </div>
            </div>
        </form>
    );

}

function AdminProfession() {
    const { getData, postData } = useApi();
    const [institude, setInstitude] = React.useState<[{ id: string, institution_name: string }]>([{ id: '', institution_name: '' }]);
    const [selectInstitude, setSelectInstitude] = React.useState('');
    const [course, setCourse] = React.useState<[{ id: string, course_name: string }]>([{ id: '', course_name: '' }]);
    const [selectCourse, setSelectCourse] = React.useState('');
    const [subject, setSubject] = React.useState<[{ id: string, subject_name: string }]>();
    const [selectSubject, setSelectSubject] = React.useState('');
    const handleInstiChange = (event: SelectChangeEvent<string>) => {
        setSelectInstitude(event.target.value);
    };
    const handleCourseChange = (event: SelectChangeEvent<string>) => {
        setSelectCourse(event.target.value);
    };
    const handleSubjectChange = (event: SelectChangeEvent<string>) => {
        setSelectSubject(event.target.value);
    };

    useEffect(() => {
        getData("institution/list").then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
                setInstitude(data?.data)
            }
        })
        getData("course/list").then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
                setCourse(data?.data);
            }
        })
        getData("subject/list").then((data: any) => {
            console.log(data);
            if (data?.status === 200) {
                setSubject(data?.data)
            }
        })
        getData("admin_profession/edit/" + adminId).then((data: any) => {
            console.log(data);
            if (data?.status===200) {
                setSelectInstitude(data?.data.institution_id);
                setSelectCourse(data?.data.course_id);
                setSelectSubject(data?.data.subject_id);
            }
        })
    }, [])
    const handleSubmit = (event:React.FormEvent<HTMLFormElement>) => {
         event.preventDefault();
         let paylod={
            admin_id: adminId,
            institution_id: selectInstitude,
            course_id: selectCourse,
            subject_id: selectSubject
         }
         console.log(paylod);
         postData('admin_profession/add',paylod).then((data:any)=>{
            console.log(data);
            if(data?.status===200){
                toast.success(("profession saved"),{
                    hideProgressBar:true,
                    theme:"colored"
                })
            }
         })
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='row d-flex justify-content-center'>

                <div className='col-4'>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
                        <InputLabel id="demo-simple-select-standard-label">Institude</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={selectInstitude}
                            onChange={handleInstiChange}
                            label="Institude"
                           
                        >
                            {institude?.map((institut) => (
                                <MenuItem key={institut.id} value={institut.id}>{institut.institution_name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className='col-3'>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
                        <InputLabel id="demo-simple-select-standard-label">Course</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={selectCourse}
                            onChange={handleCourseChange}
                            label="Course"
                           

                        >
                            {course?.map((data) => (
                                <MenuItem key={data.id} value={data.id}>{data.course_name}</MenuItem>
                            ))}


                        </Select>
                    </FormControl>
                </div>
                <div className='col-2'>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
                        <InputLabel id="demo-simple-select-standard-label">Subject</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={selectSubject}
                            onChange={handleSubjectChange}
                            label="Subject"
                        >
                            {subject?.map((data) => (
                                <MenuItem key={data.id} value={data.id}>{data.subject_name}</MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className='row justify-content-center' style={{ marginTop: "50px" }}>
                <div className='col-1'>
                    <button className='btn btn-primary'>save</button>
                </div>
            </div>
        </form>
    );
}