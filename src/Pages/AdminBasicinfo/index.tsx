
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Card, CardContent, FormControl, FormControlLabel, FormLabel, Grid, IconButton, InputLabel, MenuItem, OutlinedInput, Paper, Radio, RadioGroup, Select, SelectChangeEvent, TextField, Theme, Tooltip, useTheme } from '@mui/material';
import { LocalizationProvider, DateTimePicker, } from '@mui/x-date-pickers';
//import DatePicker from 'react-datepicker';
//import 'react-datepicker/dist/react-datepicker.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState, useEffect, useRef } from 'react';
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';

import { Field, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { deepEqual } from '../../utils/helpers';
import NameContext from '../Context/NameContext';


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


interface Department {
    id: number;
    department_name: string;
}
interface AdminInformation {

    admin_login_id?: string,
    department_id?: string,
    first_name?: string,
    last_name?: string,
    gender?: string,
    // dob?: string,
    dob: Dayjs | null;
    father_name?: string,
    mother_name?: string,
    guardian_name?: string,
    is_kyc_verified?: boolean,
    pic_path?: string
  }

export default function AdminBasicInfo() {

    const context = React.useContext(NameContext);
    const { setNamepro,setProImage }:any = context;
    const { getData, postData, putData, postFileData } = useApi();
    const [initialAdminState, setInitialAdminState] = useState<AdminInformation | null>(null);
    const [adminFName, setAdminFName] = useState('');
    const [adminLName, setAdminLName] = useState('');
    const [adminGender, setAdminGender] = useState('Male');
    const [adminDOB, setAdminDOB] = useState<Dayjs | null | undefined>(dayjs('dd-mm-yyyy'));
    const [adminFatherName, setAdminFatherName] = useState('');
    const [adminMotherName, setAdminMotherName] = useState('');
    const [adminGurdian, setAdminGurdian] = useState('');
    const [editFalg, setEditFlag] = useState<boolean>(false);
    const [editFalg1, setEditFlag1] = useState<boolean>(false);
    const [dobset_col, setdobset_col] = useState<boolean>(false)
    //const [adminPicPath,setAdminPicPath]=React.useState();
    const [allDepartment, setAllDepartment] = useState<Department[]>([
        { id: 0, department_name: "" }
    ]);
    const [adminDepartment, setAdminDepartment] = useState<string>('');
    const [selectedFile, setSelectedFile] = React.useState('');
    const [filePreview, setFilePreview] = useState(null);
    const [adminFilePath, setAdminFilePath] = useState('');
    let adminId = localStorage.getItem('_id')
    console.log(adminId);
    const [admin, setadmin] = useState<AdminInformation>({
        gender:'Male',
        dob:dayjs('dd-mm-yyyy'),


    });
    const [fname_col, setFname_col] = useState<boolean>(false)
    const [lname_col, setLname_col] = useState<boolean>(false)
    const [fathername_col, setFathername_col] = useState<boolean>(false)
    const [mothername_col, setMothername_col] = useState<boolean>(false)
    const [gname_col, setGname_col] = useState<boolean>(false)
    const [error1, setError1] = useState("");
useEffect(()=>{
    setadmin((prevState) => ({ ...prevState, dob: adminDOB ?? null })); 
},[adminDOB])
// console.log("handle", admin,adminDepartment)
    const handleInputChange = (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        // addressType: string
      ) => {
        // console.log("handle sssss",event.target.name, event.target.value)
        const { name, value } = event.target;
      
        if (name === 'first_name') {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
                setFname_col(true)
            } else {
                setFname_col(false)
            }
        } 
        if (name === 'last_name') {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
                setLname_col(true)
            } else {
                setLname_col(false)
            }
        } 
        if (name === 'father_name') {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
                setFathername_col(true)
            } else {
                setFathername_col(false)
            }
        } 
        if (name === 'mother_name') {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
                setMothername_col(true)
            } else {
                setMothername_col(false)
            }
        } 
        if (name === 'guardian_name') {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
                setGname_col(true)
            } else {
                setGname_col(false)
            }
        } 
        setadmin((prevState) => ({ ...prevState, [name]: value }));
      }
  
   
      const getBasicInfo = async () => {
          try {
              const response = await getData(`${'admin_basicinfo/edit/' + adminId}`);
            //   console.log(response);
              if (response?.status === 200) {
                  setadmin((prevState) => ({ ...prevState, 
                      first_name: response?.data.first_name,
                      last_name: response?.data.last_name,
                      dob: response?.data.dob,
                      gender: response?.data.gender,
                      father_name: response?.data.father_name,
                      mother_name: response?.data.mother_name,
                      guardian_name: response?.data.guardian_name, 
                   }));
                  setAdminDepartment(response?.data.department_id)
                  setAdminFilePath(response?.data.pic_path)
                  setInitialAdminState(
                     { first_name: response?.data.first_name,
                      last_name: response?.data.last_name,
                      dob: response?.data.dob,
                      gender: response?.data.gender,
                      father_name: response?.data.father_name,
                      mother_name: response?.data.mother_name,
                      guardian_name: response?.data.guardian_name,
                      department_id:response?.data.department_id,
                      pic_path:response?.data.pic_path}

                  )
                  if(response?.data?.pic_path !== ""){

                      getData(`${"upload_file/get_image/" + response?.data?.pic_path}`)
                          .then((imgdata: any) => {
                              setFilePreview(imgdata.data)
                          }).catch((e) => {
                             
                          });
                  }
              } else if (response?.status === 404) {
                  setEditFlag(true);
                  toast.warning(("Please add your information"), {
                      hideProgressBar: true,
                      theme: "colored"
                  })
              }else {
                // empty
              }
          } catch (error: any) {
            //   console.error('error comes :', error.response.status);
              if (error?.response?.status === 401) {
                  toast.warning(("Please login again"), {
                      hideProgressBar: true,
                      theme: "colored"
                  })
              } else {
                  toast.error(("Request failed"), {
                      hideProgressBar: true,
                      theme: "colored"
                  })
              }

          }

      }
      const getDepatment = async () => {
          try {
              const response = await getData(`${'department/list'}`);
              if (response?.status === 200) {
                  setAllDepartment(response?.data);
                  //console.log("hello")
              }
          } catch (error: any) {
            //   console.error('error comes :', error?.response?.status);
              if (error?.response?.status === 401) {
                  toast.warning(("Please login again"), {
                      hideProgressBar: true,
                      theme: "colored"
                  })
              } else {
                  toast.error(("Request failed"), {
                      hideProgressBar: true,
                      theme: "colored"
                  })
              }
          }
      }
    useEffect(() => {
        getBasicInfo();
        getDepatment();
    }, [adminId]);

    const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as string;
        //const selectedDepartments = value.map(id => allDepartment.find(dept => dept.id.toString() == id)?id.toString():'' );
        setAdminDepartment(value);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(event.target.value)
        const { files } = event.target;
        const formData = new FormData();

        if (files && files[0]) {
            const file: any = files[0];
              // Check file size (3MB = 3 * 1024 * 1024 bytes)
           if (file.size > 3 * 1024 * 1024) {
            setError1('File size must be less than 3MB');
            return;
          }

            // Check file size (5KB = 5 * 1024 bytes)
        // if (file.size > 3 * 1024) {
        //   setError1('File size must be less than 5KB');
        //   return;
        // }

          // Check file type (only JPG and PNG allowed)
          if (!['image/jpeg','image/jpg', 'image/png'].includes(file.type)) {
            setError1('Only JPG and PNG files are allowed');
            return;
          }
          setError1('');
            setSelectedFile(file.name)
            const reader: any = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
            formData.append('file', file);
            postFileData(`${"upload_file/upload"}`, formData)
                .then((data: any) => {
                    // console.log(data)
                    if (data?.status === 200) {
                        toast.success(data?.message, {
                            hideProgressBar: true,
                            theme: "colored",
                        });
                    } else if (data?.status === 404) {
                        toast.error(data?.message, {
                            hideProgressBar: true,
                            theme: "colored",
                        });
                    } else {
                        toast.error(data?.message, {
                            hideProgressBar: true,
                            theme: "colored",
                        });;
                    }
                })
                .catch((e: any) => {
                    toast.error(e?.message, {
                        hideProgressBar: true,
                        theme: "colored",
                    });
                });
        }
    }
    const handleDateChange = (newDate: Dayjs | null) => {
        setAdminDOB(newDate)
        // setBasicInfo((values) => ({ ...values, dob: newDate }));
        let datecheck:any =dayjs(newDate).format('DD/MM/YYYY')
        if (datecheck === "Invalid Date") {
            setdobset_col(true);
        } else {
            setdobset_col(false);
        }
      };
    const adminBasicInfo = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // console.log(adminDOB);
     

        let paylod = {
            // admin_login_id: adminId,
            // department_id: adminDepartment,
            // first_name: adminFName,
            // last_name: adminLName,
            // gender: adminGender,
            // dob: adminDOB,
            // father_name: adminFatherName,
            // mother_name: adminMotherName,
            // guardian_name: adminGurdian,
            // is_kyc_verified: true,
            // pic_path: selectedFile ? selectedFile : adminFilePath
            admin_login_id: adminId,
            department_id: adminDepartment,
            first_name: admin?.first_name,
            last_name: admin?.last_name,
            gender: admin?.gender,
            dob: admin?.dob || null,
            father_name: admin?.father_name,
            mother_name: admin?.mother_name,
            guardian_name: admin?.guardian_name || "",
            is_kyc_verified: true,
            pic_path: selectedFile ? selectedFile : adminFilePath
        }
        let compare ={
            // admin_login_id: adminId,
            department_id: adminDepartment,
            first_name: admin?.first_name,
            last_name: admin?.last_name,
            gender: admin?.gender,
            dob: admin?.dob,
            father_name: admin?.father_name,
            mother_name: admin?.mother_name,
            guardian_name: admin?.guardian_name || "",
            // is_kyc_verified: true,
            pic_path: selectedFile ? selectedFile : adminFilePath

        }
        // console.log("admin",JSON.stringify(compare))
        // function sortObjectKeys(obj: { [key: string]: any } | null): { [key: string]: any } | null {
        //     if (obj === null) return null;
        
        //     return Object.keys(obj).sort().reduce((result: { [key: string]: any }, key: string) => {
        //         result[key] = obj[key];
        //         return result;
        //     }, {});
        // }
        // // console.log("admin 1",JSON.stringify(initialAdminState))
        // const sortedObj1 = sortObjectKeys(compare);
        // const sortedObj2 = sortObjectKeys(initialAdminState);

        // const eq = JSON.stringify(sortedObj1) === JSON.stringify(sortedObj2);
        let datecheck:any =dayjs(paylod?.dob).format('DD/MM/YYYY')
    
        if (datecheck === "Invalid Date") {
            setdobset_col(true);
        } else {
            setdobset_col(false);
        }
       const eq = deepEqual(compare,initialAdminState)
       setEditFlag1(true)
        
        if (editFalg) {
            const seveData = async () => {
                try {
                    const response = await postData('admin_basicinfo/add', paylod);
                    if (response?.status === 200) {
                        toast.success("Admin basic information saved successfully", {
                            hideProgressBar: true,
                            theme: "colored"
                        })
                        setNamepro({ 
                            first_name: paylod?.first_name,
                            last_name: paylod?.last_name,
                            gender: paylod?.gender,})
                            getData(`${"upload_file/get_image/"}${selectedFile ? selectedFile : adminFilePath}`)
                            .then((data: any) => {
                              // setprofileImage(imgdata.data)
                              if(data.status == 200){
              
                                setProImage(data.data)
                              }else{
              
                              }
                            }).catch((e) => {
                              console.log("------------- e -------------", e);
                              
                            })
                       
                    } else {
                        toast.error(response?.message, {
                            hideProgressBar: true,
                            theme: "colored"
                        })
                    }
                } catch (error:any) {
                    toast.error(error?.message, {
                        hideProgressBar: true,
                        theme: "colored"
                    })
                }
            }
            if(!fname_col && admin.first_name !== "" && !lname_col && admin.last_name !== "" && !fathername_col && admin.father_name !== "" && !mothername_col && admin.mother_name !== "" && !gname_col && adminDepartment && !dobset_col){
            seveData();
            }
        }
        if (!editFalg) {

           
            const editData = async () => {
                try {
                    const response = await putData("admin_basicinfo/edit/" + adminId, paylod);

                    if (response?.status === 200) {
                        toast.success("Admin basic information updated successfully", {
                            hideProgressBar: true,
                            theme: "colored"
                        })
                        setNamepro({ 
                            first_name: paylod?.first_name,
                            last_name: paylod?.last_name,
                            gender: paylod?.gender,})
                            getData(`${"upload_file/get_image/"}${selectedFile ? selectedFile : adminFilePath}`)
                            .then((data: any) => {
                              // setprofileImage(imgdata.data)
                              if(data.status == 200){
              
                                setProImage(data.data)
                              }else{
              
                              }
                            }).catch((e) => {
                              console.log("------------- e -------------", e);
                              
                            })
                        getBasicInfo()
                        getDepatment()
                    } else {
                        toast.error(("Request failed"), {
                            hideProgressBar: true,
                            theme: "colored"
                        })
                    }

                } catch (error) {
                    toast.error("some issue are occuring.", {
                        hideProgressBar: true,
                        theme: "colored"
                    })
                }
            }
            // !gname_col && admin.guardian_name !== ""
            if(!fname_col && admin.first_name !== "" && !lname_col && admin.last_name !== "" && !fathername_col && admin.father_name !== "" && !mothername_col && !gname_col && admin.mother_name !== "" && adminDepartment){

                // eslint-disable-next-line no-lone-blocks
                {!eq && (

                    editData()
                )}
            }
        }
    }



    return (

        <form onSubmit={adminBasicInfo}>
            <div className='row d-flex justify-content-start' style={{ margin: "15px" }}>
                <div className='col form_field_wrapper'>
                    <label > First Name <span>*</span> </label>
                    <TextField type="text"
                        name='first_name'
                        className='form-control'
                        // value={adminFName}
                        // onChange={(event) => setAdminFName(event.target.value)} 
                        value={admin.first_name}
                        onChange={(e) => handleInputChange(e)}
                        required
                    />
                    <div> {fname_col && (
                        <p style={{ color: 'red' }}>Please enter a valid First Name only characters allowed.</p>
                    )}</div>
                    <div> {admin.first_name == "" && (
                        <p style={{ color: 'red' }}>Please enter First name.</p>
                    )}</div>
                </div>

                <div className='col form_field_wrapper'>
                    <label > Last Name <span>*</span> </label>
                    <TextField type="text"
                        name='last_name'
                        className='form-control'
                        // value={adminLName}
                        // onChange={(event) => setAdminLName(event.target.value)}
                        value={admin.last_name}
                        onChange={(e) => handleInputChange(e)}
                        required
                    />
                    <div> {lname_col && (
                        <p style={{ color: 'red' }}>Please enter a valid Last Name only characters allowed.</p>
                    )}</div>
                    <div> {admin.last_name == "" && (
                        <p style={{ color: 'red' }}>Please enter Last name.</p>
                    )}</div>
                </div>
            </div>
            <div className='row d-flex justify-content-start' style={{ margin: "15px" }}>
                <div className='col form_field_wrapper'>
                    <FormControl >
                        <FormLabel id="demo-row-radio-buttons-group-label">Gender <span>*</span> </FormLabel>
                        <RadioGroup
                        
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            // name="row-radio-buttons-group"
                            // value={adminGender}
                            // onChange={(event) => setAdminGender(event.target.value)}
                            name="gender"
                            value={admin.gender}
                            onChange={(e) => handleInputChange(e)}
                        >
                            <FormControlLabel value="Male" control={<Radio className='radiobutton' />} label="Male"/>
                            <FormControlLabel value="Female" control={<Radio  className='radiobutton'/>} label="Female" />

                        </RadioGroup>
                    </FormControl>
                </div>
                <div className='col form_field_wrapper' style={{ marginTop: "20PX" }}>

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date of Birth *"
                            value={dayjs(admin.dob)}
                            // onChange={(date: any) => setAdminDOB(date)}
                            onChange={(date: any)=>handleDateChange(date)}
                            // name="dob"
                            // value={dayjs(admin.gender)}
                            // onChange={(e:any) => handleInputChange(e)}
                             format="DD/MM/YYYY"
                            disableFuture
                        />
                    </LocalizationProvider>
                    <div> {dobset_col && (
                        <p style={{ color: 'red' }}>Please enter Date of Birth.</p>
                    )}</div>



                </div>
            </div>
            <div className='row d-flex justify-content-start' style={{ margin: "15px" }}>

                <div className='col form_field_wrapper'>

                    <label > Father Name <span>*</span> </label>
                    <TextField type="text"
                        name='father_name'
                        className='form-control'
                        // value={adminFatherName}
                        // onChange={(event) => setAdminFatherName(event.target.value)} 
                        value={admin.father_name}
                        onChange={(e) => handleInputChange(e)}
                        
                        />
                        <div> {fathername_col && (
                        <p style={{ color: 'red' }}>Please enter a valid Father Name only characters allowed.</p>
                    )}</div>
                    <div> {admin.father_name == "" && (
                        <p style={{ color: 'red' }}>Please enter Father name.</p>
                    )}</div>
                </div>

                <div className='col form_field_wrapper'>
                    <label > Mother Name <span>*</span> </label>
                    <TextField type="text"
                        name='mother_name'
                        className='form-control'
                        // value={adminMotherName}
                        // onChange={(event) => setAdminMotherName(event.target.value)}
                        value={admin.mother_name}
                        onChange={(e) => handleInputChange(e)}
                         />
                         <div> {mothername_col && (
                        <p style={{ color: 'red' }}>Please enter a valid Mother Name only characters allowed.</p>
                    )}</div>
                    <div> {admin.mother_name == "" && (
                        <p style={{ color: 'red' }}>Please enter Mother name.</p>
                    )}</div>

                </div>
            </div>
            <div className='row d-flex justify-content-start' style={{ margin: "15px" }}>
                <div className='col form_field_wrapper'>

                    <label > Guardian Name <span></span> </label>
                    <TextField type="text"
                        name='guardian_name'
                        className='form-control'
                        // value={adminGurdian}
                        // onChange={(event) => setAdminGurdian(event.target.value)} 
                        value={admin.guardian_name}
                        onChange={(e) => handleInputChange(e)}
                        
                        />
                        <div> {gname_col && (
                        <p style={{ color: 'red' }}>Please enter a valid Guardian Name only characters allowed.</p>
                    )}</div>
                    {/* <div> {admin.guardian_name == "" && (
                        <p style={{ color: 'red' }}>Please enter Guardian name.</p>
                    )}</div> */}
                </div>

                <div className='col form_field_wrapper'>
                    {/* <Grid item xs={12}>
                        <Typography variant="h6">Upload Profile Picture *</Typography>

                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            component="label"
                            role={undefined}
                            //variant="contained"
                            tabIndex={-1}

                            startIcon={<CloudUploadIcon />}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white'
                                },
                            }}
                        >
                            Upload Photo
                            <VisuallyHiddenInput type="file" onChange={(event) => handleImageChange(event)} />
                        </Button>
                        {filePreview && (
                            <img
                                src={filePreview}
                                alt="Uploaded Preview"
                                style={{ maxWidth: "50%", marginTop: "10px" }}
                            />
                        )}
                    </Grid> */}
                     <FormControl sx={{
                        m: 1, mt:3,minWidth: 250, width: {
                            xs: '100%',
                            sm: 'auto',
                        }, marginLeft: 0
                    }} >
                        <InputLabel id="demo-select-small-label">Department Name * </InputLabel>
                        <Select

                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={adminDepartment}
                            label="Department name"
                            onChange={handleDepartmentChange}
                            renderValue={(selected) => {
                                const selectedDepartment = allDepartment.find(dept => dept.id.toString() == selected);
                                const selectedDepartment1 = allDepartment.find(dept => dept.id.toString() == adminDepartment);
                                return selectedDepartment ? selectedDepartment?.department_name : selectedDepartment1?.department_name;
                            }}
                              MenuProps={{
                                sx: {
                                  "& .MuiPaper-root": {
                                    mt: 1,
                                    
                                  }
                                },
                               
                              }}
                        >
                            {allDepartment.map((data) => (
                                <MenuItem key={data.id} value={data.id}>
                                    {data.department_name}
                                </MenuItem>
                            ))}


                        </Select>
                    </FormControl>
                    <div> {(!adminDepartment && editFalg1) && (
                        <p style={{ marginLeft: "10px", color: 'red' }}>Please select a Department name.</p>
                    )}</div>

                </div>
            </div>
            <div className='row d-flex justify-content-start' style={{ margin: "15px" }}>
                <div className='col'>

                    {/* <FormControl sx={{
                        m: 1, minWidth: 250, width: {
                            xs: '100%',
                            sm: 'auto',
                        }, marginLeft: 0
                    }} >
                        <InputLabel id="demo-select-small-label">Department Name * </InputLabel>

                        <Select

                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={adminDepartment}
                            label="Department name"
                            onChange={handleDepartmentChange}
                            renderValue={(selected) => {
                                const selectedDepartment = allDepartment.find(dept => dept.id.toString() == selected);
                                return selectedDepartment ? selectedDepartment.department_name : '';
                            }}

                              MenuProps={{
                                sx: {
                                  "& .MuiPaper-root": {
                                    mt: 4,
                                    
                                  }
                                },
                               
                              }}

                        >
                            {allDepartment.map((data) => (
                                <MenuItem key={data.id} value={data.id}>
                                    {data.department_name}
                                </MenuItem>
                            ))}


                        </Select>

                    </FormControl> */}
                    <Grid item xs={12}>
                        <Typography variant="h6">Upload Profile Picture </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            component="label"
                            role={undefined}
                            //variant="contained"
                            tabIndex={-1}

                            startIcon={<CloudUploadIcon />}
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'primary.light',
                                    color: 'white'
                                },
                            }}
                        >
                            Upload Photo
                            <VisuallyHiddenInput type="file" onChange={(event) => handleImageChange(event)} />
                        </Button>
                        {filePreview && (
                            <img
                                src={filePreview}
                                alt="Uploaded Preview"
                                style={{ maxWidth: "50%", marginTop: "10px" }}
                            />
                        )}
                        {error1 && (
                            <Typography variant="body1" style={{ color: 'red' }}>
                                {error1}
                            </Typography>
                        )}
                    </Grid>
                </div>
                <div className='col' style={{marginTop:"320px"}}>
                    <button className='btn btn-primary mainbutton'>{editFalg ? "save" : "Save Changes"}</button>


                </div>
            </div>
        </form>

    );
}

