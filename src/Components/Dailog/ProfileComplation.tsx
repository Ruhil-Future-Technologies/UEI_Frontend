// import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
// import React, { FunctionComponent } from "react";

// export const ProfileDialog: FunctionComponent<{
//   isOpen: boolean;
//   onCancel: () => void;
//   onOkClick: () => void;
//   title: string;
// }> = ({ isOpen, onCancel, onOkClick, title}) => (

//   <Dialog
//     open={isOpen}
//     onClose={onCancel}
//     aria-labelledby="alert-dialog-title"
//     aria-describedby="alert-dialog-description"
//     disableBackdropClick
//   >
//     <DialogTitle id="alert-dialog-title">
//       {title}
//     </DialogTitle>
//     <DialogContent>
//       <DialogContentText id="alert-dialog-description">
//       To access the chat feature, please complete your profile by filling in all required fields. Thank you!
//       </DialogContentText>
//     </DialogContent>
//     <DialogActions>
//       <Button onClick={onCancel} autoFocus>
//         Cancel
//       </Button>
//       <Button onClick={onOkClick} autoFocus>
//        Ok
//       </Button>
//     </DialogActions>
//   </Dialog>
// );

import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useContext,
} from "react";
import Backdrop from "@mui/material/Backdrop";
import type {
  DialogProps,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextFieldVariants,
} from "@mui/material";

import "bootstrap/dist/css/bootstrap.min.css";
import "./stylechat.css"; // Import your CSS file
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { QUERY_KEYS_STUDENT } from "../../utils/const";
import SendIcon from "@mui/icons-material/Send";
import { JSX } from "react/jsx-runtime";
import NameContext from "../../Pages/Context/NameContext";
import {
  chatcalandericon,
  chatdatetext,
  chatdialog,
  chattextbgleft,
  chattextbgright,
  chattextleft,
  chattextright,
  inputfieldtext,
} from "../../utils/helpers";
import CloseIcon from "@mui/icons-material/Close";
import { Flag } from "@mui/icons-material";
import { ChatDialogClose } from "./ChatDialogClose";

interface Institute {
  id: number;
  institution_id: string;
  institution_name: string;
}

interface Course {
  id: number;
  course_name: string;
  course_id: string;
}

interface Subject {
  id: string;
  subject_name: string;
  subject_id: string;
}
interface Hobby {
  hobby_name: string;
  id: number;
  is_active: number;
}

interface Language {
  id: string;
  is_active?: number;
  language_name: string;
}

interface Option {
  value: string;
  label: string;
}
interface Mapping {
  [key: string]: string[];
}

export const ProfileDialog: FunctionComponent<{
  isOpen: boolean;
  onCancel: () => void;
  onOkClick: () => void;
  title: string;
}> = ({ isOpen, onCancel, onOkClick, title }) => {
  const handleClose: DialogProps["onClose"] = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    onCancel();
  };
  const context = useContext(NameContext);
  const { namecolor, setNamecolor }: any = context;
  let StudentId = localStorage.getItem("_id");
  let usertype = localStorage.getItem("user_type");
  const { getData, postData, postFileData } = useApi();
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentSection, setCurrentSection] = useState<string | null>("basic");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [error1, setError1] = useState("");
  const [errordate, setErordate] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [messages, setMessages] = useState<
    { text: string; type: "question" | "answer" }[]
  >([]);
  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);
  const [alllanguage, setAllLanguage] = useState<Language[]>([]);

  const [selectedHobby, setSelectedHobby] = useState<any>("");
  const [selectedLanguage, setSelectedLanguage] = useState<any>("");
  const [selectedproficiency, setSelectedproficiency] = useState<any>("");
  const [selectedgender, setSelectedgender] = useState<any>("");
  const [selectedInstitute, setSelectedInstitute] = useState<any>("");
  const [selectCourse, setSelectedCourse] = useState<any>("");
  const [selectSubject, setSelectedSubject] = useState<any>("");

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedstate, setSelectedState] = useState(null);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [fullName, setFullName] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [motherNameError, setMotherNameError] = useState(false);
  const [fName, setFName] = useState(false);
  const [gName, setgName] = useState(false);
  const [phnumber, setphnumber] = useState(false);
  const [distic, setdisct] = useState(false);
  const [preferenceError, setpreferenceError] = useState(false);
  const [pincode, setpincode] = useState(false);
  const [per, setper] = useState(false);
  const [checked, setchecked] = useState(false);
  const [closemodel, setclosemodel] = useState(false);
  const [datejoin, setdatejoin] = useState<any>();
  const [answeredData, setAnsweredData] = useState<any>();
  // const [open, setOpen] = useState(true);

  const errordata = [
    "Please enter a valid full name only characters allowed.",
    "",
    "",
    "Please enter a valid mother name only characters allowed.",
    "Please enter a valid father name only characters allowed.",
    "Please enter a valid guardian name only characters allowed.",
    "",
    "",
    "",
    "Mobile number should be 10 digits",
    "WhatsApp number should be 10 digits",
    "",
    "",
    "Joining date cannot be today. Please select a past date.",
    "The course completion date cannot be earlier than the date of joining.",
    "",
    "",
    "Please enter a valid district name only characters allowed.",
    "Please enter a valid city name only characters allowed.",
    "Invalid Pincode. It must be 6 digits only.",
    "",
    "",
    "",
    "",
    "Please enter a valid preference only characters allowed.",
    "Please enter a valid percentage.",
  ];
  const profileURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const callAPI = async () => {
    if (usertype === "student") {
      getData(`${profileURL}/${StudentId}`)
        .then((data: any) => {
          console.log("ALL DATA ===>>>>", data);
          if (data.status === 200) {
            //  navigate("/main/Dashboard");
            setAnsweredData(data.data);
          }
        })
        .catch((e: any) => {
          // toast.error(e?.message, {
          //     hideProgressBar: true,
          //     theme: "colored",
          //     });
        });
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  const initialQuestions: { [key: string]: string[] } = {
    basic: [
      "What is your full name?",
      "What is your gender?",
      "What is your DOB?",
      "What is your mother's name?",
      "What is your father's name?",
      "What is your guardian's name?",
      "What is your main learning goal or interest for visiting our application?",
      "Upload your profile picture",
      "Please select your mobile number country code",
      "What is your mobile number?",
      "What is your WhatsApp number?",
      "Hi! Please provide your academic information! What is your course name?",
      "What is your institute name?",
      "When did you join this course?",
      "When did you complete this course?",
      "Please select your current country of residence",
      "Which state do you currently reside in?",
      "Which district do you currently live in?",
      "Which city do you live in?",
      "What is your Pin code?",
      "What is your first address?",
      "What is your second address?",
      "Hi, Please provide your subject preference information! what is your course name to which your subject belongs?",
      "Select your preference subject name",
      "What is your preference?",
      "Add your score in percentage",
      "Hi, Please choose your hobbies",
      "Select your known language",
      "What is your proficiency in the selected language?",
      "Thanks for providing your personal information",
    ],
  };

  const sectionOrder = ["basic"];

  const getSubject = async () => {
    getData("/subject/list")
      .then((response: any) => {
        if (response.status === 200) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setSubjects(filteredData || []);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  };
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentSection) {
      const mapping: Mapping = {
        // Basic Info
        "What is your full name?": ["basic_info", "first_name", "last_name"],
        "What is your gender?": ["basic_info", "gender"],
        "What is your DOB?": ["basic_info", "dob"],
        "What is your mother's name?": ["basic_info", "mother_name"],
        "What is your father's name?": ["basic_info", "father_name"],
        "What is your guardian's name?": ["basic_info", "guardian_name"],
        "Upload your profile picture": ["basic_info", "pic_path"],
        "What is your main learning goal or interest for visiting our application?":
          ["basic_info", "aim"],

        // Address
        "What is your first address?": ["address", "address1"],
        "What is your second address?": ["address", "address2"],
        "Which city do you live in?": ["address", "city"],
        "Which district do you currently live in?": ["address", "district"],
        "Which state do you currently reside in?": ["address", "state"],
        "Please select your current country of residence": [
          "address",
          "country",
        ],
        "What is your Pin code?": ["address", "pincode"],

        // Contact
        "Please select your mobile number country code": [
          "contact",
          "mobile_isd_call",
          "mobile_isd_watsapp",
        ],
        "What is your mobile number?": ["contact", "mobile_no_call"],
        "What is your WhatsApp number?": ["contact", "mobile_no_watsapp"],

        //Subject
        "Hi, Please provide your subject preference information! what is your course name to which your subject belongs?":
          ["subject_preference", "course_name"],
        "Select your preference subject name": [
          "subject_preference",
          "subject_name",
        ],
        "What is your preference?": ["subject_preference", "preference"],
        "Add your score in percentage": [
          "subject_preference",
          "score_in_percentage",
        ],

        //Language Known
        "Select your known language": ["language_known", "language_id"],
        "What is your proficiency in the selected language?": [
          "language_known",
          "proficiency",
        ],

        //Hobby
        "Hi, Please choose your hobbies": ["hobby", "hobby_id"],

        // Academic Information
        // "Hi! Please provide your academic information! What is your course name?":
        //   ["academic_history", "course_id"],
        // "What is your institute name?": [
        //   "academic_history",
        //   "institution_name",
        // ],
        // "When did you join this course?": ["academic_history", "year"], // Example for the year, adjust if necessary
        // "When did you complete this course?": ["academic_history", "year"], // Adjust based on end year if available
      };

      // const filteredQuestions = initialQuestions[currentSection].filter(
      //   (question: string) => {
      //     const keys: any = mapping[question];
      //     if (!keys) return true; // If no mapping exists, keep the question

      //     const [section, ...fields] = keys;
      //     const sectionData = answeredData[section];

      //     return !fields.every((field: any) => sectionData[field]); // Remove the question if all fields have values
      //   }
      // );
      setMessages([
        { text: initialQuestions[currentSection][0], type: "question" },
      ]);
    }
    getData("/institution/list")
      .then(async (response: any) => {
        if (response.status === 200) {
          const filteredData = await response?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setInstitutes(filteredData || []);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });

    getData("/course/list")
      .then((response: any) => {
        if (response.status === 200) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setCourses(filteredData || []);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });

    getData("hobby/list")
      .then((data: any) => {
        if (data?.status === 200) {
          const filteredData = data?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setAllHobbies(filteredData || []);
          // setAllHobbies(data?.data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });

    getData("language/list")
      .then((data: any) => {
        if (data?.status === 200) {
          const filteredData = data?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setAllLanguage(filteredData || []);
          // setAllLanguage(data?.data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });

    getSubject();
  }, [currentSection]);

  useEffect(() => {
    // Scroll to the bottom of the chat box whenever messages update
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      // chatBoxRef.current = chatBoxRef.current.scrollIntoView();
    }
  }, [messages]);

  const parseDate = (dateStr: string | number | Date) => {
    if (typeof dateStr === "string") {
      // Check if the date string is in DD/MM/YYYY format
      const parts = dateStr?.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts?.map(Number);
        // Create a new Date object using year, month (0-indexed), and day
        const date = new Date(year, month - 1, day);
        if (isNaN(date?.getTime())) {
          return null;
        }
        return date?.toISOString();
      } else {
        return null;
      }
    }

    // If dateStr is already a Date object or a number, use it directly
    const date = new Date(dateStr);
    if (isNaN(date?.getTime())) {
      return null;
    }
    return date.toISOString();
  };

  const saveAnswersforBasic = (answers: string[]) => {
    const birthdate = parseDate(answers[2]);
    const fullName = answers[0];
    let nameParts: string[] = fullName?.split(" ");
    const firstname = nameParts[0];
    const lastname = nameParts[1];
    let payload = {
      student_login_id: StudentId,
      first_name: firstname,
      last_name: lastname,
      // gender: answers[1],
      gender: answers[1] || selectedgender,
      dob: birthdate,
      father_name: answers[3],
      mother_name: answers[4],
      guardian_name: answers[5],
      pic_path: answers[7],
      aim: answers[6],
    };
    // postData(`${"student/add"}`, payload)
    postData(`${"student/add"}`, payload)
      .then((data: any) => {
        if (data.status === 200) {
          const formData = new FormData();
          const nfile: any = uploadedFile;
          formData.append("file", nfile);

          if (formData.has("file")) {
            postFileData(`${"upload_file/upload"}`, formData)
              .then((data: any) => {
                if (data?.status === 200) {
                  // toast.success(data?.message, {
                  //   hideProgressBar: true,
                  //   theme: "colored",
                  // });
                } else if (data?.status === 404) {
                  // toast.error(data?.message, {
                  //   hideProgressBar: true,
                  //   theme: "colored",
                  // });
                } else {
                  // toast.error(data?.message, {
                  //   hideProgressBar: true,
                  //   theme: "colored",
                  // });
                }
              })
              .catch((e) => {
                // toast.error(e?.message, {
                //   hideProgressBar: true,
                //   theme: "colored",
                // });
              });
          }
          // toast.success("Basic information saved successfully", {
          //   hideProgressBar: true,
          //   theme: "colored",
          // });
        } else {
          toast.error(data?.message, {
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

  const saveAnswersforContact = (answer: string[]) => {
    const contfullPhone = answer[8];
    let phoneNum = contfullPhone?.split(" ");
    const contfullPhonewtsp = answer[9];
    let phoneNumwtsp = contfullPhonewtsp?.split(" ");
    let email = localStorage.getItem("userid");

    let payload = {
      student_id: StudentId,
      mobile_isd_call: answer[8],
      mobile_no_call: answer[9],
      mobile_isd_watsapp: answer[8],
      mobile_no_watsapp: answer[10],
      email_id: email,
    };
    postData(`${"student_contact/add"}`, payload)
      .then((data: any) => {
        if (data?.status === 200) {
          // toast.success(data?.message, {
          //   hideProgressBar: true,
          //   theme: "colored",
          // });
        } else {
          toast.error(data?.message, {
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

  const saveAnswerforAddress = (answers: string[]) => {
    const Address = answers[15];
    let addressParts = Address?.split(",");

    const payload = {
      student_id: StudentId,
      address1: answers[20],
      address2: answers[21],
      country: answers[15],
      state: answers[16],
      city: answers[18],
      district: answers[17],
      pincode: answers[19],
      address_type: "current",
    };
    postData("/student_address/add", payload).then((response) => {
      if (response.status === 200) {
        // toast.success("Address information saved successfully", {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    });
  };

  const saveAnswersforacadmichistory = (answers: string[]) => {
    const startDate = parseDate(answers[13]);
    const endDate = parseDate(answers[14]);
    const payload = {
      student_id: StudentId,
      institution_id: selectedInstitute?.toString(),
      course_id: selectCourse?.toString(),
      // starting_date: answers[13],
      // ending_date: answers[14],
      starting_date: startDate,
      ending_date: endDate,
      learning_style: "any",
    };

    postData("/student_academic_history/add", payload).then((response) => {
      if (response.status === 200) {
        // toast.success("Academic hinstory information saved successfully", {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    });
  };

  const saveAnswerforsubjectpreference = (answers: string[]) => {
    const payload = {
      student_id: StudentId,
      course_id: selectCourse,
      subject_id: selectSubject,
      preference: answers[24],
      score_in_percentage: answers[25],
    };
    postData("/subject_preference/add", payload).then((response) => {
      if (response.status === 200) {
        // toast.success("Subject Preference information saved successfully", {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    });
  };
  const proficiency = [
    {
      lable: "Read",
      value: "read",
    },
    {
      lable: "Write",
      value: "write",
    },
    {
      lable: "Both",
      value: "both",
    },
  ];
  const gender = [
    {
      lable: "Male",
      value: "male",
    },
    {
      lable: "Female",
      value: "female",
    },
  ];
  const hobbyOptions = allHobbies.map((option) => ({
    value: option.id,
    label: option.hobby_name,
  }));
  const courseSelectOptions = courses.map((option) => ({
    value: option.id,
    label: option.course_name,
  }));
  const instituteSelectOptions = institutes.map((option) => ({
    value: option.id,
    label: option.institution_name,
  }));
  const languageOptions = alllanguage.map((option) => ({
    value: option.id,
    label: option.language_name,
  }));
  const proficiencyOptions = proficiency.map((option) => ({
    value: option.value,
    label: option.lable,
  }));
  const genderOptions = gender.map((option) => ({
    value: option.value,
    label: option.lable,
  }));
  const subjectOptions = subjects.map((option) => ({
    value: option.id,
    label: option.subject_name,
  }));

  const saveanswerForHobbeis = (answers: string[]) => {
    let payload = {
      student_id: StudentId,
      hobby_id: selectedHobby,
    };

    postData("student_hobby/add", payload).then((response) => {
      if (response.status === 200) {
        // toast.success("Your hobbies saved successfully", {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    });
  };

  const saveAnswerForLanguage = (answers: string[]) => {
    const payload = {
      student_id: StudentId,
      language_id: selectedLanguage,
      proficiency: selectedproficiency,
    };
    postData("student_language_known/add", payload).then((response) => {
      if (response.status === 200) {
        // toast.success("Your language saved successfully", {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    });
  };

  const viewProfile = () => {
    toast.success("Your profile saved successfully", {
      hideProgressBar: true,
      theme: "colored",
    });
    onCancel();
    navigate("/main/StudentProfile");
  };

  const proceedToNextSection = (currentSection: string) => {
    const nextSection = sectionOrder[sectionOrder.indexOf(currentSection) + 1];
    if (nextSection) {
      setMessages([
        ...messages,
        {
          text: `Do you want to add ${nextSection} information?`,
          type: "question",
        },
      ]);
      setCurrentSection(null);
      setAnswers([]);
    } else {
      alert("Thank you for completing the profile information!");
    }
  };

  const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.target.value;
    setAnswers(updatedAnswers);
    if (currentQuestionIndex === 0) {
      const fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
      if (!fullNameRegex.test(updatedAnswers[0])) {
        setFullName(true);
        return;
      } else {
        setFullName(false);
      }
    }
    if (currentQuestionIndex === 1) {
      const gender = updatedAnswers[1].toLowerCase();
      if (gender !== "male" && gender !== "female") {
        // You can set an error state here if needed
        setGenderError(true);
        return;
      } else {
        setGenderError(false);
      }
    }
    if (currentQuestionIndex === 3) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(updatedAnswers[3])) {
        setMotherNameError(true);
        return;
      } else {
        setMotherNameError(false);
      }
    }
    if (currentQuestionIndex === 4) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(updatedAnswers[4])) {
        setFName(true);
        return;
      } else {
        setFName(false);
      }
    }
    if (currentQuestionIndex === 5) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(updatedAnswers[5])) {
        setgName(true);
        return;
      } else {
        setgName(false);
      }
    }
    if (currentQuestionIndex === 9) {
      // Regular expression for exactly 10 digits
      const phoneRegex = /^\d{10}$/;

      if (!phoneRegex.test(updatedAnswers[9])) {
        setphnumber(true);
        return;
      } else {
        setphnumber(false);
      }
    }
    if (currentQuestionIndex === 10) {
      // Regular expression for exactly 10 digits
      const phoneRegex = /^\d{10}$/;

      if (!phoneRegex.test(updatedAnswers[10])) {
        setphnumber(true);
        return;
      } else {
        setphnumber(false);
      }
    }
    if (currentQuestionIndex === 17) {
      // Regular expression for exactly 10 digits
      const disticRegex = /^[a-zA-Z\s]+$/;

      if (!disticRegex.test(updatedAnswers[17])) {
        setdisct(true);
        return;
      } else {
        setdisct(false);
      }
    }
    if (currentQuestionIndex === 18) {
      // Regular expression for exactly 10 digits
      const disticRegex = /^[a-zA-Z\s]+$/;

      if (!disticRegex.test(updatedAnswers[18])) {
        setdisct(true);
        return;
      } else {
        setdisct(false);
      }
    }
    if (currentQuestionIndex === 19) {
      const pincodeRegex = /^\d{6}$/;

      if (!pincodeRegex.test(updatedAnswers[19])) {
        // setpincode(true);
        setpincode(true);
      } else {
        // setpincode(false);
        setpincode(false); // Clear the error if valid
      }
    }
    if (currentQuestionIndex === 24) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(updatedAnswers[24])) {
        setpreferenceError(true);
        return;
      } else {
        setpreferenceError(false);
      }
    }
    if (currentQuestionIndex === 25) {
      // Regular expression for exactly 6 digits (adjust the length as per your requirement)
      const regex = /^(100(\.0{1,2})?|[0-9]?[0-9](\.[0-9]{1,2})?)$/;

      if (!regex.test(updatedAnswers[25])) {
        setper(true);
        return;
      } else {
        setper(false);
      }
    }

    if (currentQuestionIndex === 28) {
      // Regular expression for exactly 6 digits (adjust the length as per your requirement)
      const regex = /^(100(\.0{1,2})?|[0-9]?[0-9](\.[0-9]{1,2})?)$/;

      if (!regex.test(updatedAnswers[28])) {
        setper(true);
        return;
      } else {
        setper(false);
      }
    }
  };
  const handleSkip = () => {
    setError1("");
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: "", type: "answer" as "answer" },
    ];
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file: any = e.target.files[0];

      // Check file size (3MB = 3 * 1024 * 1024 bytes)
      if (file.size > 3 * 1024 * 1024) {
        setError1("File size must be less than 3MB");
        return;
      }
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setError1("Only JPG and PNG files are allowed");
        return;
      }
      setError1("");
      setUploadedFile(e.target.files[0]);
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex] = e.target.files[0].name; // Store the file name as answer

      setAnswers(updatedAnswers);
      const currentQuestions = initialQuestions[currentSection!];
      const updatedMessages = [
        ...messages,
        { text: e.target.files[0].name, type: "answer" as "answer" },
      ];

      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setMessages([
          ...updatedMessages,
          {
            text: currentQuestions[currentQuestionIndex + 1],
            type: "question" as "question",
          },
        ]);
      } else {
        setMessages(updatedMessages);
        proceedToNextSection(currentSection!);
        setCurrentQuestionIndex(0);
      }
    }
  };
  let datecheck: any;
  let hitcount = 1;

  const handleclickdate = () => {
    if (currentQuestionIndex === 13) {
      datecheck = dayjs(datecheck || datejoin).format("DD/MM/YYYY");
    }
    if (datecheck) {
      if (currentQuestionIndex == 14) {
        if (datecheck > answers[13]) {
          const updatedAnswers = [...answers];
          updatedAnswers[currentQuestionIndex] = datecheck;
          setAnswers(updatedAnswers);
          const currentQuestions = initialQuestions[currentSection!];
          const updatedMessages = [
            ...messages,
            { text: datecheck, type: "answer" as "answer" },
          ];

          if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setMessages([
              ...updatedMessages,
              {
                text: currentQuestions[currentQuestionIndex + 1],
                type: "question" as "question",
              },
            ]);
          } else {
            setMessages(updatedMessages);
            proceedToNextSection(currentSection!);
            setCurrentQuestionIndex(0);
          }
        } else {
          // setErordate("The course completion date cannot be earlier than the date of joining.")
          // toast.error(
          //   "The course completion date cannot be earlier than the date of joining.",
          //   {
          //     hideProgressBar: true,
          //     theme: "colored",
          //   }
          // );
        }
      } else {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = datecheck;
        setAnswers(updatedAnswers);
        const currentQuestions = initialQuestions[currentSection!];
        const updatedMessages = [
          ...messages,
          { text: datecheck, type: "answer" as "answer" },
        ];

        if (currentQuestionIndex < currentQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setMessages([
            ...updatedMessages,
            {
              text: currentQuestions[currentQuestionIndex + 1],
              type: "question" as "question",
            },
          ]);
        } else {
          setMessages(updatedMessages);
          proceedToNextSection(currentSection!);
          setCurrentQuestionIndex(0);
        }
      }
    }
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    // setBasicInfo((values) => ({ ...values, dob: newDate }));
    // setOpen(false);
    // setErordate("")
    datecheck = dayjs(newDate).format("DD/MM/YYYY");
    const currentDate = dayjs().format("DD/MM/YYYY");
    const startDate = answers[13];
    const endDate = datecheck;
    if (currentQuestionIndex === 13) {
      setdatejoin(dayjs(newDate).format("DD/MM/YYYY"));
      if (datecheck === currentDate) {
        setErordate(true);
        return;
      } else {
        setErordate(false);
      }
    }
    if (currentQuestionIndex === 14) {
      if (startDate === null || endDate === null) {
        return;
      }

      if (startDate > endDate) {
        //  console.log("startDate is greater than endDate",startDate,endDate);
        setErordate(true);
        return;
      } else {
        setErordate(false);
      }
    }

    if (hitcount % 2 === 0) {
      if (currentQuestionIndex == 14) {
        if (datecheck > answers[13]) {
          const updatedAnswers = [...answers];
          updatedAnswers[currentQuestionIndex] = datecheck;
          setAnswers(updatedAnswers);
          const currentQuestions = initialQuestions[currentSection!];
          const updatedMessages = [
            ...messages,
            { text: datecheck, type: "answer" as "answer" },
          ];

          if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setMessages([
              ...updatedMessages,
              {
                text: currentQuestions[currentQuestionIndex + 1],
                type: "question" as "question",
              },
            ]);
          } else {
            setMessages(updatedMessages);
            proceedToNextSection(currentSection!);
            setCurrentQuestionIndex(0);
          }
        } else {
          // setErordate("The course completion date cannot be earlier than the date of joining.")
          // toast.error(
          //   "Date of joining should be less than to the starting date of academic course",
          //   {
          //     hideProgressBar: true,
          //     theme: "colored",
          //   }
          // );
        }
      } else {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = datecheck;
        setAnswers(updatedAnswers);
        const currentQuestions = initialQuestions[currentSection!];
        const updatedMessages = [
          ...messages,
          { text: datecheck, type: "answer" as "answer" },
        ];

        if (currentQuestionIndex < currentQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setMessages([
            ...updatedMessages,
            {
              text: currentQuestions[currentQuestionIndex + 1],
              type: "question" as "question",
            },
          ]);
        } else {
          setMessages(updatedMessages);
          proceedToNextSection(currentSection!);
          setCurrentQuestionIndex(0);
        }
      }
    } else {
      hitcount++;
    }
  };

  const answerSaveandGotoNextquestoin = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    const currentQuestions = initialQuestions[currentSection!];
    if (answers[currentQuestionIndex]?.trim() !== "") {
      const updatedMessages = [
        ...messages,
        { text: answers[currentQuestionIndex], type: "answer" as "answer" },
      ];

      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setMessages([
          ...updatedMessages,
          {
            text: currentQuestions[currentQuestionIndex + 1],
            type: "question" as "question",
          },
        ]);

        if (answers.length === 10) {
          saveAnswersforBasic([...answers, e.currentTarget.value]);
        } else if (answers.length === 11) {
          saveAnswersforContact([...answers, e.currentTarget.value]);
        } else if (answers.length === 18) {
          saveAnswersforacadmichistory([...answers, e.currentTarget.value]);
        } else if (answers.length === 22) {
          saveAnswerforAddress([...answers, e.currentTarget.value]);
        } else if (answers.length === 26) {
          saveAnswerforsubjectpreference([...answers, e.currentTarget.value]);
        } else if (selectedproficiency !== "") {
          saveanswerForHobbeis([...answers, e.currentTarget.value]);
          saveAnswerForLanguage([...answers, e.currentTarget.value]);
        }
      } else {
        setMessages(updatedMessages);
        proceedToNextSection(currentSection!);
        setCurrentQuestionIndex(0);
      }
    }
  };
  useEffect(() => {
    if (selectedproficiency !== "") {
      saveanswerForHobbeis([...answers]);
      saveAnswerForLanguage([...answers]);
    }
  }, [selectedproficiency]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (
        fullName ||
        genderError ||
        motherNameError ||
        fName ||
        gName ||
        phnumber ||
        distic ||
        pincode ||
        per ||
        preferenceError ||
        errordate
      ) {
        return; // Stop further execution if full name validation fails
      }
      e.preventDefault();

      if (currentQuestionIndex == 10 || currentQuestionIndex == 9) {
        if (answers[currentQuestionIndex].length == 10) {
          answerSaveandGotoNextquestoin(e);
        } else {
          toast.error("Please enter valid 10 digit mobile number", {
            hideProgressBar: true,
            theme: "colored",
          });
        }
      } else if (currentQuestionIndex == 19) {
        if (answers[currentQuestionIndex].length == 6) {
          answerSaveandGotoNextquestoin(e);
          setError1("");
        } else {
          setError1("Please enter valid 6 digit pincode");
          // toast.error("Please enter valid 6 digit pincode", {
          //   hideProgressBar: true,
          //   theme: "colores",
          // });
        }
      } else {
        answerSaveandGotoNextquestoin(e);
      }
    }
  };

  const handlePhoneChange = (value: string, country: any) => {
    setPhone(value);
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = "+" + value;
    setAnswers(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: "+" + value, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };

  const handleDropdownChangehobby = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.label;
    setSelectedHobby(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };

  const handleDropdownChangelanguage = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.label;
    setSelectedLanguage(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };

  const handleDropdownChangeproficiency = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.label;
    setSelectedproficiency(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: "question" as "question",
        },
      ]);
      // answerSaveandGotoNextquestoin(e)
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };
  const handleDropdownChangegender = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.label;
    setSelectedgender(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: "question" as "question",
        },
      ]);
      // answerSaveandGotoNextquestoin(e)
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };

  const handleDropdownChangecourse = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.label;
    setSelectedCourse(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };

  const handleDropdownChangesubject = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.label;
    setSelectedSubject(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };

  const handleDropdownChangeInstitute = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.label;
    setSelectedInstitute(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };

  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const handleCountryChange = (selectedOption: any) => {
    setSelectedCountry(selectedOption);
    // console.log("contry",selectedOption,selectedOption.value)
    if (selectedOption) {
      const states = State.getStatesOfCountry(selectedOption.value);
      // console.log("contry ==s",states)
      const stateOptions = states.map((state) => ({
        value: state.isoCode,
        label: state.name,
      }));
      setStateOptions(stateOptions);
    } else {
      setStateOptions([]);
    }
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedOption.label;
    setAnswers(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: selectedOption.label, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };

  const handleStateChange = async (selectedOption: any) => {
    setSelectedState(selectedOption);
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedOption.label;
    setAnswers(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: selectedOption.label, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };
  const handleChange = (themes: any) => {
    setchecked(!checked);

    document?.documentElement?.setAttribute("data-theme", themes);
    setNamecolor(themes);
    localStorage.setItem("theme", themes);
  };
  const handlecancel = () => {
    setclosemodel(false);
  };
  const handleok = () => {
    onCancel();
    setclosemodel(false);
    // navigate("/main/Dashboard");
  };
  const handleOpen = () => {
    // setOpen(true);
  };

  // code for loacal store set quest and answer

  // useEffect(() => {
  //   const savedMessages = localStorage.getItem('messages');
  //   const savedIndex = localStorage.getItem('currentQuestionIndex');
  //   const answers = localStorage.getItem('answers');

  //   if (savedMessages) {
  //     setMessages(JSON.parse(savedMessages));
  //   }
  //   if (savedIndex !== null) {
  //     setCurrentQuestionIndex(JSON.parse(savedIndex));
  //   }
  //   if (answers) {
  //     setAnswers(JSON.parse(answers));
  //   }
  //   if (selectedInstitute) {
  //     setSelectedInstitute(JSON.parse(selectedInstitute));
  //   }
  //   if (selectCourse) {
  //     setSelectedCourse(JSON.parse(selectCourse));
  //   }
  //   if (selectSubject) {
  //     setSelectedSubject(JSON.parse(selectSubject));
  //   }
  //   if (selectedHobby) {
  //     setSelectedHobby(JSON.parse(selectedHobby));
  //   }if (selectedLanguage) {
  //     setSelectedLanguage(JSON.parse(selectedLanguage));
  //   }if (selectedproficiency) {
  //     setSelectedproficiency(JSON.parse(selectedproficiency));
  //   }
  // }, []);
  // useEffect(()=>{
  //   if(messages){
  //     localStorage.setItem('messages', JSON.stringify(messages));
  //     localStorage.setItem('currentQuestionIndex', JSON.stringify(currentQuestionIndex));
  //     localStorage.setItem('answers', JSON.stringify(answers));
  //     localStorage.setItem('selectedInstitute', JSON.stringify(selectedInstitute));
  //     localStorage.setItem('selectCourse', JSON.stringify(selectCourse));
  //     localStorage.setItem('selectSubject', JSON.stringify(selectSubject));
  //     localStorage.setItem('setSelectedHobby', JSON.stringify(selectedHobby));
  //     localStorage.setItem('selectedLanguage', JSON.stringify(selectedLanguage));
  //     localStorage.setItem('selectedproficiency', JSON.stringify(selectedproficiency));
  //   }

  // },[messages,currentQuestionIndex,answers,selectedInstitute,selectCourse,selectSubject,selectedHobby,selectedLanguage,selectedproficiency])
  return (
    <>
      <Dialog
        open={isOpen}
        // className="dialog"
        // open={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            position: "fixed",
            bottom: 50,
            // left: 0,
            right: 50,
            margin: 0,
            width: "400px",
            backgroundColor: chatdialog(namecolor),
          },
        }}
      >
        {/* <Button
   onClick={() => handleClose({}, 'backdropClick')}  // Adjusted to pass the expected arguments
   style={{ position: 'absolute', top: 10, right: 10 }}
   aria-label="close"
 > */}
        <Button
          onClick={() => setclosemodel(true)}
          style={{ position: "absolute", top: 10, left: 0 }}
          aria-label="close"
        >
          <CloseIcon />
        </Button>

        <div
          style={{
            position: "fixed",
            right: 50,
            margin: "2px",
            padding: "5px",
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={checked}
                onChange={() => handleChange(checked ? "light" : "dark")}
              />
            }
            label=""
          />
        </div>
        <div style={{ marginTop: "25px" }}>
          <DialogTitle id="alert-dialog-title">
            <p style={{ color: inputfieldtext(namecolor) }}>
              Add your information for better services
            </p>
          </DialogTitle>
          <DialogContent>
            <div
              className="chat-box"
              ref={chatBoxRef}
              style={{
                height: "400px",
                overflowY: "scroll",
                paddingBottom: "80px",
                scrollbarWidth: "none", // For Firefox
                msOverflowStyle: "none", // For Internet Explorer and Edge
              }}
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-wrapper d-flex mb-3 ${
                    message.type === "question"
                      ? "justify-content-start"
                      : "justify-content-end"
                  }`}
                >
                  <div
                    className={`message-bubble p-3 ${
                      message.type === "question" ? "left" : "right"
                    }`}
                    style={{
                      maxWidth: "80%",
                      backgroundColor:
                        message.type === "question"
                          ? chattextbgleft(namecolor)
                          : chattextbgright(namecolor),
                      color:
                        message.type === "question"
                          ? chattextleft(namecolor)
                          : chattextright(namecolor),
                      borderRadius: "15px",
                      padding: "10px",
                      wordBreak: "break-word",
                    }}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
          {currentSection && (
            <>
              <div className="chatinput-body">
                {(fullName ||
                  genderError ||
                  motherNameError ||
                  fName ||
                  gName ||
                  phnumber ||
                  distic ||
                  pincode ||
                  per ||
                  preferenceError ||
                  errordate) && (
                  <p
                    style={{
                      color: "red",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}
                  >
                    {errordata[currentQuestionIndex]}
                  </p>
                )}
                {error1 && (
                  <p
                    style={{
                      color: "red",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}
                  >
                    {error1}
                  </p>
                )}
                {currentQuestionIndex === 11 || currentQuestionIndex === 22 ? (
                  <Select
                    className="dropdown-wrapper"
                    onChange={handleDropdownChangecourse}
                    options={courseSelectOptions}
                    placeholder="Select an option"
                    menuPlacement="top"
                    value={selectCourse}
                  />
                ) : currentQuestionIndex === 8 ? (
                  <PhoneInput
                    country={""}
                    value={phone}
                    onChange={handlePhoneChange}
                    inputProps={{
                      name: "phone",
                      required: true,
                      autoFocus: true,
                      readOnly: true,
                    }}
                    placeholder=""
                    enableSearch={true}
                    disableDropdown={false}
                    preferredCountries={["us", "in"]}
                  />
                ) : currentQuestionIndex === 7 ? (
                  <>
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileUpload}
                        style={{ paddingLeft: "2px" }} // Adjust padding to make space for the button
                      />
                      <p
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: "10px", // Adjust this value to move the button horizontally
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: chattextbgright(namecolor),
                          margin: 0,
                        }}
                        onClick={handleSkip}
                      >
                        Skip
                      </p>
                    </div>
                  </>
                ) : currentQuestionIndex === 12 ? (
                  <Select
                    className="dropdown-wrapper"
                    onChange={handleDropdownChangeInstitute}
                    options={instituteSelectOptions}
                    placeholder="Select an option"
                    menuPlacement="top"
                    value={selectedInstitute}
                  />
                ) : currentQuestionIndex === 23 ? (
                  <Select
                    className="dropdown-wrapper"
                    onChange={handleDropdownChangesubject}
                    options={subjectOptions}
                    placeholder="Select an option"
                    menuPlacement="top"
                    value={selectSubject}
                  />
                ) : currentQuestionIndex === 2 ||
                  currentQuestionIndex === 13 ||
                  currentQuestionIndex === 14 ? (
                  <>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          position: "relative",
                        }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            //  open={open}
                            // open={true}
                            label={
                              currentQuestionIndex === 13
                                ? "Date of Joining"
                                : currentQuestionIndex === 14
                                ? "Date of Completion"
                                : "Date of Birth"
                            }
                            onChange={handleDateChange}
                            // onAccept={() => setOpen(false)} // Close on date selection
                            // onClose={() => setOpen(false)}  // Close on outside click
                            disableFuture
                            format="DD/MM/YYYY"
                            // value={datecheck}
                            slotProps={{
                              field: {
                                readOnly: true,
                              },
                              textField: {
                                sx: {
                                  "& .MuiInputLabel-root": {
                                    // paddingLeft: '0px',
                                    color: chatdatetext(namecolor), // Change the label text color
                                    backgroundColor: "transperent",
                                  },
                                  "& .MuiInputBase-root": {
                                    // flexDirection: 'row-reverse',
                                    color: chatdatetext(namecolor), // Change the label text color
                                    backgroundColor: "transperent",
                                    paddingLeft: "100px",
                                    paddingRight: "50px",
                                  },
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    // borderColor: 'transperent',
                                  },
                                  "& .MuiInputAdornment-root": {
                                    // color: chatdatetext(namecolor), // Change the color of the calendar icon
                                  },
                                },
                              },
                              inputAdornment: {
                                sx: {
                                  "& .MuiSvgIcon-root": {
                                    color: chatcalandericon(namecolor), // Ensure the icon color is changed
                                  },
                                },
                                // onClick: handleOpen
                              },
                            }}
                          />
                          <button
                            className="chat_search_btn"
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                            }}
                            type="button"
                            onClick={handleclickdate}
                          >
                            {" "}
                            <SendIcon className="mainsearch" />
                          </button>
                        </LocalizationProvider>
                      </div>
                    </div>
                  </>
                ) : currentQuestionIndex === 26 ? (
                  <Select
                    className="dropdown-wrapper"
                    onChange={handleDropdownChangehobby}
                    options={hobbyOptions}
                    placeholder="Select an option"
                    menuPlacement="top"
                    value={selectedHobby}
                  />
                ) : currentQuestionIndex === 15 ? (
                  <Select
                    className="dropdown-wrapper"
                    options={countryOptions}
                    onChange={handleCountryChange}
                    placeholder="Select a country"
                    menuPlacement="top"
                    value={selectedCountry}
                  />
                ) : currentQuestionIndex === 16 && stateOptions.length > 1 ? (
                  <Select
                    className="dropdown-wrapper"
                    options={stateOptions}
                    placeholder="Select a state"
                    onChange={handleStateChange}
                    isDisabled={!selectedCountry}
                    menuPlacement="top"
                    value={selectedstate}
                  />
                ) : currentQuestionIndex === 27 ? (
                  <Select
                    className="dropdown-wrapper"
                    onChange={handleDropdownChangelanguage}
                    options={languageOptions}
                    placeholder="Select an option"
                    menuPlacement="top"
                    value={selectedLanguage}
                  />
                ) : currentQuestionIndex === 28 ? (
                  <Select
                    className="dropdown-wrapper"
                    onChange={handleDropdownChangeproficiency}
                    options={proficiencyOptions}
                    placeholder="Select an option"
                    menuPlacement="top"
                    value={selectedproficiency}
                  />
                ) : currentQuestionIndex === 1 ? (
                  <Select
                    className="dropdown-wrapper"
                    onChange={handleDropdownChangegender}
                    options={genderOptions}
                    placeholder="Select an option"
                    menuPlacement="top"
                    value={selectedgender}
                  />
                ) : currentQuestionIndex + 1 ===
                  initialQuestions.basic.length ? (
                  <Button
                    onClick={viewProfile}
                    style={{ display: "block", margin: "0 auto" }}
                  >
                    View Profile
                  </Button>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your answer and press enter"
                    value={answers[currentQuestionIndex] || ""}
                    onChange={handleAnswerChange}
                    onKeyPress={handleKeyPress}
                  />
                )}
              </div>
            </>
          )}
          {/* <Button onClick={onCancel} autoFocus>
      Cancel
    </Button> */}

          {/* </DialogActions> */}
        </div>
      </Dialog>
      <ChatDialogClose
        isOpen={closemodel}
        onCancel={handlecancel}
        onDeleteClick={() => handleok()}
        title="Close chat?"
      />
    </>
  );
};
