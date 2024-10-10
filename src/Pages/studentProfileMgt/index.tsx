import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import { YearCalendar } from "@mui/x-date-pickers/YearCalendar";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
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
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import { log } from "console";
import { YearPicker } from "@mui/lab";
import StudentAddress from "../StudentAddress";
import StudentBasicInfo from "../StudentBasicInfo";
import StudentAcadmicHistory from "../StudentAcademicHistory";
import StudentcontactDetails from "../StudentContactDetails";
import StudentHobbies from "../StudentHobbies";
import StudentLanguage from "../StudentLanguageKnown";

let StudentId = localStorage.getItem("_id");
console.log(StudentId);

// interface StudentBasicInformation {
//     student_id?: number;
//     first_name?: string;
//     last_name?: string;
//     gender?: string;
//     dob?: Date;
//     father_name?: string;
//     mother_name?: string;
//     guardian_name?: string;
//     pic_path?: string;
//     aim?: string;

// }

// interface StudentAddress {
//     student_id?: string,
//     address1?: string,
//     address2?: string,
//     country?: string,
//     state?: string,
//     city?: string,
//     district?: string,
//     pincode?: string,
//     address_type?: string
// }

// interface Language {
//     id: string,
//     is_active?: number,
//     language_name: string
// }

//  interface StudentcontactDtails{
//     student_id?: string,
//   mobile_isd_call?: string,
//   mobile_no_call?: string,
//   mobile_isd_watsapp?: string,
//   mobile_no_watsapp?: string
//  }

const steps = [
  "Student Basic Information",
  "Student Address",
  "Language know",
  "Student Academic History",
  "Student Contact Dtails",
  "Hobbies/Subject preference",
];

export default function StudentProfileManagement() {
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
    <Box sx={{ width: "100%" }}>
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
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              className={`${activeStep === 0 ? "disabled-mainbutton" : ""}`}
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Previous
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Step {activeStep + 1}
            {/* {activeStep === 0 && <StudentBasicInfo />}
            {activeStep === 1 && <StudentAddress />}
            {activeStep === 2 && <StudentLanguage />}
            {activeStep === 3 && <StudentAcadmicHistory />}
            {activeStep === 4 && <StudentcontactDetails />} */}
            {/* {
                            activeStep === 5 &&
                            <StudentHobbies />
                        } */}
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

// function StudentAddress() {
//     const { getData, postData } = useApi();
//     const [studentAddress, setStudentAddress] = useState<StudentAddress>({
//         address_type: ""
//     });

//     useEffect(() => {
//         getData(`${'student_address/edit/' + StudentId}`).then((data: any) => {
//             console.log(data);
//             if (data?.status === 200) {
//                 setStudentAddress(data?.data);
//             } else if (data?.status === 404) {
//                 console.log("student not found")
//             } else {
//                 console.log("error comes from api")
//             }
//         })
//     }, [])
//     const changeHendels = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
//         const { name, value } = event.target;
//         setStudentAddress(values => ({ ...values, [name]: value }))
//     }

//     const SubmitHeandle = (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         let payload = {
//             student_id: StudentId,
//             address1: studentAddress.address1,
//             address2: studentAddress.address2,
//             country: studentAddress.country,
//             state: studentAddress.state,
//             city: studentAddress.city,
//             district: studentAddress.district,
//             pincode: studentAddress.pincode,
//             address_type: studentAddress.address_type
//         }
//         postData('/student_address/add', payload).then((data: any) => {
//             console.log(data);
//             if (data?.status === 200) {
//                 toast.success(data?.message, {
//                     hideProgressBar: true,
//                     theme: "colored",
//                 })
//             }
//             else {
//                 toast.error("some problrms is here ", {
//                     hideProgressBar: true,
//                     theme: "colored",
//                 })
//             }
//         })

//     }
//     return (
//         <form onSubmit={SubmitHeandle}>
//             <div className="row justify-content-center">
//                 <div className="col-4">
//                     <FormControl>

//                         <RadioGroup
//                             row
//                             aria-labelledby="demo-row-radio-buttons-group-label"
//                             name="address_type"
//                             value={studentAddress.address_type}
//                             onChange={changeHendels}
//                         >
//                             <FormControlLabel value="current" control={<Radio />} label="Current Address" />
//                             <FormControlLabel value="permanent" control={<Radio />} label="Permanent Address" />

//                         </RadioGroup>
//                     </FormControl>
//                 </div>
//             </div>
//             <div className='row d-flex justify-content-center'>
//                 <div className='col-4'>
//                     <label > address 1</label>
//                     <TextField type="text"
//                         name='address1'
//                         className='form-control'
//                         value={studentAddress.address1}
//                         onChange={changeHendels} />
//                 </div>

//                 <div className='col-4'>
//                     <label >  address 2</label>
//                     <TextField type="text"
//                         name='address2'
//                         className='form-control'
//                         value={studentAddress.address2}
//                         onChange={changeHendels} />
//                 </div>
//             </div>
//             <div className='row d-flex justify-content-center'>
//                 <div className='col-4'>
//                     <label > Country</label>
//                     <TextField type="text"
//                         name='country'
//                         className='form-control'
//                         value={studentAddress.country}
//                         onChange={changeHendels}
//                     />
//                 </div>

//                 <div className='col-4'>
//                     <label > State</label>
//                     <TextField type="text"
//                         name='state'
//                         className='form-control'
//                         value={studentAddress.state}
//                         onChange={changeHendels}
//                     />
//                 </div>
//             </div>
//             <div className='row d-flex justify-content-center'>
//                 <div className='col-4'>
//                     <label > City</label>
//                     <TextField type="text"
//                         name='city'
//                         className='form-control'
//                         value={studentAddress.city}
//                         onChange={changeHendels}
//                     />
//                 </div>

//                 <div className='col-4'>
//                     <label > District</label>
//                     <TextField type="text"
//                         name='district'
//                         className='form-control'
//                         value={studentAddress.district}
//                         onChange={changeHendels}
//                     />
//                 </div>
//                 <div className="row d-flex justify-content-center">
//                     <div className="col-4">
//                         <label>Pin code</label>
//                         <TextField
//                             type="text"
//                             name='pincode'
//                             className='form-control'
//                             value={studentAddress.pincode}
//                             onChange={changeHendels}
//                         />
//                     </div>
//                     <div className="col-4">

//                         <button className='btn btn-primary' style={{ marginTop: '27px' }}> save</button>
//                     </div>
//                 </div>
//             </div>

//         </form>
//     );
// }

// function StudentBasicInfo() {
//     const { getData, postData } = useApi();
//     const [gender, setGender] = useState('Male');
//     const [name, setName] = useState();
//     const [lastname, setlastName] = useState();
//     const [dob, setDob] = useState<Date | null>();
//     const [selectedFile, setSelectedFile] = useState();

//     const [basicInfo, setBasicInfo] = useState<StudentBasicInformation>({
//         student_id: 0,
//         first_name: '',
//         last_name: '',
//         gender: 'male',
//         dob: new Date('2024-05-10'),
//         father_name: '',
//         mother_name: '',
//         guardian_name: '',
//         pic_path: '',
//         aim: '',
//     });

//     useEffect(() => {
//         getData(`${'student/get/' + StudentId}`, StudentId).then((data: any) => {
//             console.log(data);
//             if (data?.status === 200) {
//                 setBasicInfo(data?.data);
//                 setSelectedFile(data?.data?.pic_path);
//                 //console.log(typeof(data?.data?.gender));
//             } else if (data?.status === 404) {

//             } else {
//                 console.log("error comes from api")
//             }

//         });
//         if (Object.keys(basicInfo).length === 0) {

//             //postData(`${'student/add'}`)
//         }

//     }, []);

//     const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>) => {
//         const { name, value } = event.target;
//         setBasicInfo(values => ({ ...values, [name]: value }));
//     }

//     const datachange = (event: Date | null) => {
//         setDob(event);
//     }

//     // const handleDate = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     //     handleChange(event.target.value as Date | null);
//     //   };
//     const submitHandel = (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         let payload = {
//             student_login_id: StudentId,
//             first_name: basicInfo.first_name,
//             last_name: basicInfo.last_name,
//             gender: basicInfo.gender,
//             dob: "2000-01-01",
//             father_name: basicInfo.father_name,
//             mother_name: basicInfo.mother_name,
//             guardian_name: basicInfo.guardian_name,
//             pic_path: basicInfo.pic_path,
//             aim: basicInfo.aim
//         }

//         postData(`${'student/add'}`, payload).then((data: any) => {
//             console.log(data?.data);

//         })
//         console.log(payload);

//     }

//     return (
//         <form onSubmit={submitHandel}>
//             <div className='row d-flex justify-content-center'>
//                 <div className='col-4'>
//                     <label > first Name</label>
//                     <TextField type="text"
//                         name='first_name'
//                         className='form-control'
//                         value={basicInfo.first_name}
//                         onChange={handleChange}
//                     />
//                 </div>

//                 <div className='col-4'>
//                     <label > Last Name</label>
//                     <TextField type="text"
//                         name='last_name'
//                         className='form-control'
//                         value={basicInfo.last_name || ''}
//                         onChange={handleChange}
//                     />
//                 </div>
//             </div>
//             <div className='row d-flex justify-content-center'>
//                 <div className='col-4'>
//                     <FormControl>
//                         <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
//                         <RadioGroup
//                             row
//                             name="gender"
//                             value={basicInfo.gender}
//                             onChange={handleChange}
//                         >
//                             <FormControlLabel value="female" control={<Radio />} label="Female" />
//                             <FormControlLabel value="male" control={<Radio />} label="Male" />
//                         </RadioGroup>
//                     </FormControl>
//                 </div>
//                 <div className='col-4'>
//                     <Typography variant="body1">Date of Birth</Typography>
//                     <LocalizationProvider dateAdapter={AdapterDayjs}>
//                         <DatePicker
//                             label="Date of Birth"
//                         // value={basicInfo.dob}
//                         // onChange={(newValue) => setDob(newValue)}

//                         />
//                     </LocalizationProvider>
//                 </div>
//             </div>
//             <div className='row d-flex justify-content-center'>
//                 <div className='col-4'>
//                     <label > Father name</label>
//                     <TextField type="text"
//                         name='father_name'
//                         className='form-control'
//                         value={basicInfo.father_name}
//                         onChange={handleChange}
//                     />
//                 </div>

//                 <div className='col-4'>
//                     <label > Mother Name</label>
//                     <TextField type="text"
//                         name='mother_name'
//                         className='form-control'
//                         value={basicInfo.mother_name}
//                         onChange={handleChange}
//                     />
//                 </div>
//             </div>
//             <div className='row d-flex justify-content-center'>
//                 <div className='col-4'>
//                     <label > Gurdian Name</label>
//                     <TextField type="text"
//                         name='guardian_name'
//                         className='form-control'
//                         value={basicInfo.guardian_name}
//                         onChange={handleChange} />
//                 </div>

//                 <div className='col-4'>
//                     <label > Aim</label>
//                     <TextField type="text"
//                         name='aim'
//                         className='form-control'
//                         value={basicInfo.aim}
//                         onChange={handleChange} />
//                 </div>
//             </div>
//             <div className='row d-flex justify-content-center'>
//                 <div className='col-4'>
//                     <Grid item xs={12}>
//                         <Typography variant="h6">Upload a Photo</Typography>
//                     </Grid>
//                     <Grid item xs={12}>
//                         <input
//                             type="file"
//                             name='pic_path'
//                             accept=".pdf,.doc,.docx"
//                             // value={basicInfo.pic_path}
//                             onChange={handleChange}

//                         />

//                         {selectedFile && (
//                             <Typography variant="body1">{selectedFile}</Typography>
//                         )}
//                     </Grid>
//                 </div>
//                 <div className='col-4'>
//                     <button className="btn btn-primary sunbutton" type="submit">
//                         Save
//                     </button>
//                 </div>
//             </div>

//         </form>
//     );
// }

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: 250,
//         },
//     },
// };

// function getStyles(languageName: string, selectedLanguages: readonly Language[], theme: Theme) {
//     return {
//         fontWeight:
//             selectedLanguages.map((lang) => lang.language_name).indexOf(languageName) === -1
//                 ? theme.typography.fontWeightRegular
//                 : theme.typography.fontWeightMedium,
//     };
// }

// function StudentLanguage() {
//     // const storeLanguage: Language[] = [];
//     interface Box {
//         id: number;
//         language_id:any;
//         proficiency:any
//     }
//     const { getData, postData } = useApi();

//     const theme = useTheme();
//     const [alllanguage, setAllLanguage] = React.useState<Language[]>([]);
//     const [selectedLeng,setSelectedLeng]=useState<any>();
//     //const [selectedLeng,setSelectedLeng]=useState();
//     // const [id, setId] = useState([]);

//     // const handleIdChange = () => {
//     //   setId();

//     // };

//     const [boxes, setBoxes] = useState<Box[]>([{ id: 1 ,language_id:'',proficiency:''}]);
//     const [proficiency, setProficiency] = useState<any>('read');

//     const addRow = () => {
//         const newBox: Box = {
//             id: boxes.length + 1,
//             language_id:"",
//             proficiency:""
//         };
//         setBoxes([...boxes, newBox]);
//     };

//     const deleterow = (id: any) => {

//         setBoxes(boxes.filter(box => box.id !== id));
//     }

//     useEffect(() => {

//         getData(`${'language/list'}`).then((data: any) => {
//             if (data?.status === 200) {
//                 setAllLanguage(data?.data);
//             }
//         })
//         getData(`${'student_language_known/edit/' + StudentId}`).then((data: any) => {
//             console.log(data);
//             if (data?.status === 200) {
//             //    setAllLanguage(data?.data);
//               const lenduageIds=data.data.language_id;
//               setSelectedLeng(lenduageIds);
//               const newBox: Box = {
//                 id: data.data.length,
//                 language_id:data.data.language_id,
//                 proficiency:data.data.proficiency
//             };
//             setBoxes([...boxes, newBox]);
//             } else {

//             }
//         });

//     }, [])

//     // const saveLanguage = (event: React.FormEvent<HTMLFormElement| typeof setSelectedLeng>) => {
//     //     event.preventDefault();
//     //    // console.log(selectedLeng,proficiency);
//     //    let payload={
//     //     student_id:StudentId,
//     //     language_id:selectedLeng,
//     //     proficiency:proficiency
//     //    }
//     //    postData('student_language_known/add',payload).then((data:any)=>{
//     //     console.log(data);

//     //    })
//     // }
//     const saveLanguage = (event: React.FormEvent<HTMLFormElement | typeof setSelectedLeng>) => {
//         event.preventDefault();
//         const payloads = boxes.map(box => ({
//             student_id: StudentId,
//             language_id: box.language_id,
//             proficiency: box.proficiency
//         }));

//         payloads.forEach(payload => {
//             postData('student_language_known/add', payload).then((data: any) => {
//                 console.log(data);
//             });
//         });
//     };

//     const handleChange = (event: SelectChangeEvent<HTMLSelectElement>,index:any) => {

//         const { value,name } = event.target;
//         // setSelectedLeng(value);
//         let currentbox = boxes[index]
//         if(currentbox)
//         {
//             currentbox.language_id = String(value)
//         }
//         console.log("boxes", boxes)
//         setBoxes(prevItems =>
//             prevItems.map(item =>
//                 item.id === index ? { ...item, ['language_id']: String(value) } : item
//             ))
//         // setBoxes(boxes)
//     };
//     const handleChange1 = (event: SelectChangeEvent<HTMLSelectElement>,index:any) => {
//         const { value ,name} = event.target;
//         // setProficiency(value);
//         let currentbox = boxes[index]
//         if(currentbox)
//         {
//             currentbox.proficiency = String(value)
//         }
//         setBoxes(prevItems =>
//             prevItems.map(item =>
//                 item.id === index ? { ...item, ['proficiency']: String(value) } : item
//             ))
//     };

//     return (
//         <form onSubmit={saveLanguage}>
//              {boxes.map((box, index) => (
//             <div className='row d-flex justify-content-center'>
//                 <div className='col-3'>
//                 <FormControl required sx={{ m: 1, minWidth: 320 }}>
//                     <InputLabel id="demo-simple-select-required-label">Language</InputLabel>
//                     <Select
//                         labelId={`language-label-${box.id}`}
//                         id={`language-select-${box.id}`}
//                         name={`language_${box.id}`}
//                         value={box.language_id}
//                         label="language *"
//                         onChange={(e)=>{handleChange(e,index)}}
//                     >

//                         {alllanguage.map((lang)=>
//                               <MenuItem value={lang.id}>{lang.language_name}</MenuItem>
//                               )}

//                     </Select>

//                 </FormControl>
//                 </div>
//                 <div className='col-2'>
//                 <FormControl required sx={{ m: 1, minWidth: 220 }}>
//                     <InputLabel id="demo-simple-select-required-label">proficiency</InputLabel>
//                     <Select
//                        labelId={`language-label-${box.id}`}
//                        id={`language-select-${box.id}`}
//                        name={`language_${box.id}`}
//                         value={box.proficiency}
//                         label="proficiency *"
//                         onChange={(e)=>{handleChange1(e,index)}}
//                     >
//                         <MenuItem value={"both"}>Both</MenuItem>
//                         <MenuItem value={"read"}>Read</MenuItem>
//                         <MenuItem value={"write"}>Write</MenuItem>
//                     </Select>

//                 </FormControl>
//                 </div>
//                 <div className="col-1">
//                         <IconButton onClick={addRow} sx={{ width: "35px", height: "35px" }}>
//                             <AddIcon />
//                         </IconButton>
//                         {boxes.length !== 1 && (
//                             <IconButton onClick={() => deleterow(box.id)} sx={{ width: "35px", height: "35px" }}>
//                                 <DeleteIcon />
//                             </IconButton>
//                         )}
//                     </div>
//             </div>
//              ))}
//             <div className='row justify-content-center'>
//                 <div className='col-3'>
//                     <button className='btn btn-primary' style={{ marginTop: "25px" }} >save your language</button>
//                 </div>
//             </div>

//         </form>
//     );
// }

// interface Box {
//     id: number;
//     institution_id: string;
//     course_id: string;
//     starting_year: any;
//     starting_date: any;
//     learning_style: string;
// }
// interface Institute {
//     id: number;
//     institution_id: string;
//     institution_name: string;
// }

// interface Course {
//     id: number;
//     course_name: string;
//     course_id:string;
// }

// function StudentAcadmicHistory() {
//     const { getData, postData } = useApi();
//     const [boxes, setBoxes] = useState<Box[]>([{ id: 1, institution_id: '',course_id: '', starting_year: null, starting_date: null, learning_style: '' }]);
//     const [institutes, setInstitutes] = useState<Institute[]>([]);
//     const [courses, setCourses] = useState<Course[]>([]);

//     let StudentId = localStorage.getItem('_id')
//     const addRow = () => {
//         const newBox: Box = {
//             id: boxes.length + 1,
//             institution_id: '',
//             course_id: '',
//             starting_year: null,
//             starting_date: null,
//             learning_style: ''
//         };
//         setBoxes([...boxes, newBox]);
//     };

//     const deleterow = (id: number) => {
//         setBoxes(boxes.filter(box => box.id !== id));
//     }
//     useEffect(() => {
//         getData('/institution/list')
//             .then((response: any) => {
//                 if (response.status === 200) {
//                     setInstitutes(response.data);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching institutes:', error);
//             });

//         getData('/course/list')
//             .then((response: any) => {
//                 if (response.status === 200) {
//                     setCourses(response.data);

//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching courses:', error);
//             });
//             getData(`${'student_academic_history/edit/' + StudentId}`).then((data: any) => {
//                 console.log(data);
//                 if (data?.status === 200) {
//                   const newBox: Box = {
//                     id: data.data.length,
//                     institution_id:data.data.institution_id,
//                     course_id:data.data.course_id,
//                     starting_year:data.data.starting_year,
//                     starting_date:data.data.starting_date,
//                     learning_style:data.data.learning_style
//                 };
//                 setBoxes([...boxes, newBox]);
//                 } else {

//                 }
//             });
//     }, []);

//     useEffect(() => {

//         getData('/student_academic_history/list')
//             .then((response: any) => {
//                 if (response.status === 200) {
//                     const data = response.data.map((item: any, index: number) => ({
//                         id: index + 1,
//                         institution_id: item.institution_id,
//                         course_id: item.course_id,
//                         startingYear: item.startingYear,
//                         endingYear: item.endingYear,
//                         learningStyle: item.learningStyle
//                     }));
//                     setBoxes(data);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching academic history:', error);
//             });
//     }, []);

//     const saveAcademicHistory = () => {
//         boxes.forEach(box => {
//         const payload ={
//             student_id:StudentId,
//             institution_id: String(box.institution_id),
//             course_id: String(box.course_id),
//             starting_year: box.starting_year.$y,
//             starting_date: box.starting_date,
//             learning_style: box.learning_style
//         }

//         postData('/student_academic_history/add', payload)
//             .then((response: any) => {
//                 console.log('Academic history saved:', response.data);
//             })
//             .catch(error => {
//                 console.error('Error saving academic history:', error);
//             });
//         });
//     }

//     const handleInputChange = (index: number, field: keyof Box, value: any) => {
//         console.log(value.$y)
//         const newBoxes:any= [...boxes];
//         newBoxes[index][field] = value;
//         setBoxes(newBoxes);
//     }

//     return (
//         <div className="container">
//             {boxes.map((box, index) => (
//                 <div className="row" key={box.id} style={{ marginBottom: '5px' }}>
//                     <div className='col'>
//                     <FormControl required sx={{ m: 1, minWidth: 220 }}>
//                         <InputLabel>Institute Name</InputLabel>
//                         <Select
//                             // id={'institute_${box.instituteName}'}
//                             value={box.institution_id}
//                             onChange={(e) => handleInputChange(index, 'institution_id', e.target.value)}
//                             label="Institute Name"
//                         >
//                             {institutes.map(institute => (
//                                 <MenuItem key={institute.id} value={institute.id}>
//                                     {institute.institution_name}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                     </div>
//                     <div className='col'>
//                     <FormControl required sx={{ m: 1, minWidth: 220 }}>
//                         <InputLabel>Course</InputLabel>
//                         <Select
//                             value={box.course_id}
//                             onChange={(e) => handleInputChange(index, 'course_id', e.target.value)}
//                             label="Course"
//                         >
//                             {courses.map(course => (
//                                 <MenuItem key={course.id} value={course.id}>
//                                     {course.course_name}
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                     </div>
//                     <div className='col'>
//                         <FormControl>
//                             <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DatePicker
//                                     views={['year']}
//                                     label="Starting Year"
//                                     value={box.starting_year}
//                                     onChange={(date) => handleInputChange(index, 'starting_year', date)}
//                                 />
//                             </LocalizationProvider>
//                         </FormControl>
//                     </div>
//                     <div className='col'>
//                         <FormControl>
//                             <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DatePicker
//                                     views={['day']}
//                                     label="Starting Date"
//                                     value={box.starting_date}
//                                     onChange={(date) => handleInputChange(index, 'starting_date', date)}
//                                 />
//                             </LocalizationProvider>
//                         </FormControl>
//                     </div>
//                     <div className='col'>
//                         <FormControl>
//                             <TextField
//                                 value={box.learning_style}
//                                 onChange={(e) => handleInputChange(index, 'learning_style', e.target.value)}
//                                 label="Learning Style"
//                             />
//                         </FormControl>
//                     </div>
//                     <div className="col">
//                         <IconButton
//                             onClick={addRow}
//                             sx={{ width: "35px", height: "35px" }}>
//                             <AddIcon />
//                         </IconButton>
//                         {boxes.length !== 1 &&
//                             <IconButton
//                                 onClick={() => deleterow(box.id)}
//                                 sx={{ width: "35px", height: "35px" }}>
//                                 <DeleteIcon />
//                             </IconButton>
//                         }
//                     </div>
//                 </div>
//             ))}
//             <div className='row justify-content-center'>
//                 <div className='col-3'>
//                     <button className='btn btn-primary' onClick={saveAcademicHistory} style={{ marginTop: "25px" }}>
//                         Save Academic History
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// interface Box {
//     id: number;
//     instituteName: string;
//     course: string;
//     startingYear: any;
//     endingYear: any;
//     learningStyle: string;
// }

// function StudentAcadmicHistory() {
//     const [boxes, setBoxes] = useState<Box[]>([{ id: 1, instituteName: '', course: '', startingYear: null, endingYear: null, learningStyle: '' }]);
//     const { getData, postData } = useApi();
//     const addRow = () => {
//         const newBox: Box = {
//             id: boxes.length + 1,
//             instituteName: '',
//             course: '',
//             startingYear: null,
//             endingYear: null,
//             learningStyle: ''
//         };
//         setBoxes([...boxes, newBox]);
//     };

//     const deleterow = (id: number) => {
//         setBoxes(boxes.filter(box => box.id !== id));
//     }

//     useEffect(() => {

//         getData('student_academic_history/list')
//             .then((response) => {
//                 if (response?.status === 200) {
//                     const data = response.data.map((item: any, index: number) => ({
//                         id: index + 1,
//                         instituteName: item.instituteName,
//                         course: item.course,
//                         startingYear: item.startingYear,
//                         endingYear: item.endingYear,
//                         learningStyle: item.learningStyle
//                     }));
//                     setBoxes(data);
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching academic history:', error);
//             });
//     }, []);

//     const saveAcademicHistory = () => {
//         const payload = boxes.map(box => ({
//             instituteName: box.instituteName,
//             course: box.course,
//             startingYear: box.startingYear,
//             endingYear: box.endingYear,
//             learningStyle: box.learningStyle
//         }));

//         postData('student_academic_history/add', payload)
//             .then((data:any)=> {
//                 console.log('Academic history saved:', data);
//             })
//             .catch(error => {
//                 console.error('Error saving academic history:', error);
//             });
//     }

//     const handleInputChange = (index: number, field: keyof Box, value: any) => {
//         const newBoxes: any= [...boxes];
//         newBoxes[index][field] = value;
//         setBoxes(newBoxes);
//     }

//     return (
//         <div className="container">
//             {boxes.map((box, index) => (
//                 <div className="row" key={box.id} style={{ marginBottom: '5px' }}>
//                     <div className='col'>
//                         <FormControl required>
//                             {/* <InputLabel></InputLabel> */}
//                             <TextField
//                                 value={box.instituteName}
//                                 onChange={(e) => handleInputChange(index, 'instituteName', e.target.value)}
//                                 label="Institute Name"
//                             />
//                         </FormControl>
//                     </div>
//                     <div className='col'>
//                         <FormControl required>
//                             {/* <InputLabel></InputLabel> */}
//                             <TextField
//                                 value={box.course}
//                                 onChange={(e) => handleInputChange(index, 'course', e.target.value)}
//                                 label="Course"
//                             />
//                         </FormControl>
//                     </div>
//                     <div className='col'>
//                         <FormControl>
//                             <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DatePicker
//                                     views={['year']}
//                                     label="Starting Year"
//                                     value={box.startingYear}
//                                     onChange={(date) => handleInputChange(index, 'startingYear', date)}
//                                 />
//                             </LocalizationProvider>
//                         </FormControl>
//                     </div>
//                     <div className='col'>
//                         <FormControl>
//                             <LocalizationProvider dateAdapter={AdapterDayjs}>
//                                 <DatePicker
//                                     views={['day']}
//                                     label="Starting Date"
//                                     value={box.endingYear}
//                                     onChange={(date) => handleInputChange(index, 'endingYear', date)}
//                                 />
//                             </LocalizationProvider>
//                         </FormControl>
//                     </div>
//                     <div className='col'>
//                         <FormControl>
//                             <TextField
//                                 value={box.learningStyle}
//                                 onChange={(e) => handleInputChange(index, 'learningStyle', e.target.value)}
//                                 label="Learning Style"
//                             />
//                         </FormControl>
//                     </div>
//                     <div className="col">
//                         <IconButton
//                             onClick={addRow}
//                             sx={{ width: "35px", height: "35px" }}>
//                             <AddIcon />
//                         </IconButton>
//                         {boxes.length !== 1 &&
//                             <IconButton
//                                 onClick={() => deleterow(box.id)}
//                                 sx={{ width: "35px", height: "35px" }}>
//                                 <DeleteIcon />
//                             </IconButton>
//                         }
//                     </div>
//                 </div>
//             ))}
//             <div className='row justify-content-center'>
//                 <div className='col-3'>
//                     <button className='btn btn-primary' onClick={saveAcademicHistory} style={{ marginTop: "25px" }}>
//                         Save Academic History
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function StudentcontactDtails() {
//     const { getData, postData } = useApi();
//     const [contcodeWtsap, setContcodeWtsap] = useState("+91");
//     const [whatsappNum, setWhatsappNum] = useState('');
//     const [contcodePhone, setContcodePhone] = useState('+91');
//     const [phoneNum, setPhoneNum] = useState('');
//     const [email, setEmail] = useState('');

//     const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//         const { value, name } = event.target;
//         setContcodeWtsap(event.target.value as string)
//     }

//     useEffect(() => {
//         getData(`${'student_contact/edit/' + StudentId}`).then((data: any) => {
//             console.log(data)
//             if (data?.status === 200) {
//                 setContcodeWtsap(data?.data.mobile_isd_watsapp);
//                 setWhatsappNum(data?.data.mobile_no_watsapp);
//                 setContcodePhone(data?.data.mobile_isd_call);
//                 setPhoneNum(data?.data.mobile_no_call);
//                 setEmail(data?.data.email_id);
//             }
//         })
//     }, [])
//     const submitHandel = (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         let payload = {
//             student_id: StudentId,
//             mobile_isd_call: contcodePhone,
//             mobile_no_call: phoneNum,
//             mobile_isd_watsapp: contcodeWtsap,
//             mobile_no_watsapp: whatsappNum,
//             email_id: email
//         }
//         postData(`${'student_contact/add'}`, payload).then((data: any) => {
//             console.log(data);
//             if (data?.status === 200) {
//                 toast.success(data?.message, {
//                     hideProgressBar: true,
//                     theme: 'colored'
//                 })
//             }
//         })
//     }

//     return (
//         <form onSubmit={submitHandel}>
//             <div className='d-flex justify-content-center'>
//                 <div className='row'>
//                     <div className='col'>
//                         <FormControl fullWidth>
//                             <InputLabel id="demo-simple-select-label">Country code</InputLabel>
//                             <Select
//                                 labelId="demo-simple-select-label"
//                                 id="demo-simple-select"
//                                 value={contcodeWtsap}
//                                 label="Country code"
//                                 onChange={(event) => setContcodeWtsap(event.target.value)}
//                             >
//                                 <MenuItem value={"+91"}>+91</MenuItem>
//                                 <MenuItem value={"+971"}>+971</MenuItem>
//                                 <MenuItem value={"+1"}>+1</MenuItem>
//                             </Select>
//                         </FormControl>

//                     </div>
//                     <div className='col'>
//                         <TextField
//                             type='text'
//                             placeholder='Enter Whatsapp number'
//                             value={whatsappNum}
//                             onChange={(event) => setWhatsappNum(event.target.value)}

//                         />
//                     </div>

//                 </div>
//             </div>
//             <div className='d-flex justify-content-center' style={{ margin: '15px' }}>
//                 <div className='row'>
//                     <div className='col'>
//                         <FormControl fullWidth>
//                             <InputLabel id="demo-simple-select-label">Country code</InputLabel>
//                             <Select
//                                 labelId="demo-simple-select-label"
//                                 id="demo-simple-select"
//                                 value={contcodePhone}
//                                 label="Country code"
//                                 onChange={(event) => setContcodePhone(event.target.value)}
//                             >
//                                 <MenuItem value={"+91"}>+91</MenuItem>
//                                 <MenuItem value={20}>+971</MenuItem>
//                                 <MenuItem value={30}>+1</MenuItem>
//                             </Select>
//                         </FormControl>

//                     </div>
//                     <div className='col'>
//                         <TextField
//                             type='text'
//                             placeholder='Enter mobile number'
//                             value={phoneNum}
//                             onChange={(event) => setPhoneNum(event.target.value)}
//                         />
//                     </div>

//                 </div>

//             </div>
//             <div className=' row d-flex justify-content-center'>
//                 <div className='col-2'>

//                     <TextField
//                         type='gmail'
//                         placeholder='Enter Email Id'
//                         value={email}
//                         onChange={(event) => setEmail(event.target.value)}
//                     />
//                 </div>
//                 <div className='col-1'>
//                     <button className='btn btn-primary'>save</button>
//                 </div>
//             </div>
//         </form>
//     );

// }
// interface Hobby {
//     hobby_name: string;
//     id: number;
//     is_active: number;
// }
// const StudentHobbies: React.FC = () => {
//     const { getData, postData } = useApi();
//     const theme = useTheme();
//     const [allHobbies, setAllHobbies] = React.useState<Hobby[]>([]);
//     const [selectedHobbies, setSelectedHobbies] = React.useState<string[]>([]);

//     useEffect(() => {
//         getData('hobby/list').then((data: any) => {
//             console.log(data);
//             if (data?.status === 200) {
//                 setAllHobbies(data?.data);
//             }
//         });
//         getData('student_hobby/edit/' + StudentId).then((data: any) => {
//             console.log(data);
//             if (data?.status === 200) {
//                 const hobbyIds = data.data.map((selecthobby: any) => selecthobby.hobby_id);
//                 setSelectedHobbies(hobbyIds);
//             }
//         })
//     }, []);

//     const handleChange = (event: SelectChangeEvent<typeof selectedHobbies>) => {
//         setSelectedHobbies(event.target.value as string[]);
//     };

//     const submithandle = (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         selectedHobbies.map((hobbyid) => {
//             let payload = {
//                 student_id: StudentId,
//                 hobby_id: hobbyid
//             }
//             console.log(payload);
//             postData("student_hobby/add", payload).then((data: any) => {
//                 console.log(data);
//                 if (data?.status === 200) {
//                     toast.success(("hobby saved successfully !!"), {
//                         hideProgressBar: true,
//                         theme: "colored"
//                     }
//                     )
//                 }
//             })
//         }
//         );
//     }

//     return (
//         <form onSubmit={submithandle}>
//             <div className='row justify-content-center'>
//                 <div className='col-4'>
//                     <FormControl sx={{ m: 1, width: 300 }}>
//                         <InputLabel id="demo-multiple-checkbox-label">Hobby</InputLabel>
//                         <Select
//                             labelId="demo-multiple-checkbox-label"
//                             id="demo-multiple-checkbox"
//                             multiple
//                             value={selectedHobbies}
//                             onChange={handleChange}
//                             input={<OutlinedInput label="Hobby" />}
//                             renderValue={(selected) => (selected as string[]).join(', ')}
//                         >
//                             {allHobbies.map((hobby) => (
//                                 <MenuItem key={hobby.id} value={hobby.id}>
//                                     <Checkbox checked={selectedHobbies.indexOf(hobby.hobby_name) > -1} />
//                                     <ListItemText primary={hobby.hobby_name} />
//                                 </MenuItem>
//                             ))}
//                         </Select>
//                     </FormControl>
//                 </div>
//                 <div className='col-3'>
//                     <button className='btn btn-primary'> save</button>
//                 </div>
//             </div>
//         </form>
//     );
// };
