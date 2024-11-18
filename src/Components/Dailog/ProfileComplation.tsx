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
import glogo from "../../assets/img/logo-white.svg";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
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
import { styled } from "@mui/material/styles";
import Course from "../../Pages/Course/Course";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 28,
  padding: 8,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
        ...theme.applyStyles("dark", {
          backgroundColor: "#8796A5",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#001e3c",
    width: 24,
    height: 24,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles("dark", {
      backgroundColor: "#003892",
    }),
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 20 / 2,
    ...theme.applyStyles("dark", {
      backgroundColor: "#8796A5",
    }),
  },
}));

interface Institute {
  id: number;
  institution_id: string;
  institution_name: string;
  university_id: string;
}

interface Course {
  id: number;
  course_name: string;
  course_id: string;
  institution_id: string;
  institution_name: string;
}
interface Classes {
  id: number;
  class_name: string;
}

interface Subject {
  course_name: string;
  id: string;
  subject_name: string;
  subject_id: string;
  semester_id: string;
  course_id: string;
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

interface University {
  id: string;
  university_id: string;
  is_active?: number;
  university_name: string;
}

interface Semester {
  id: string;
  semester_id: string;
  is_active?: number;
  semester_number: any;
  course_id: any;
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
  const { namecolor, setNamecolor, setNamepro, setProImage }: any = context;
  let StudentId = localStorage.getItem("_id");
  let usertype = localStorage.getItem("user_type");
  const { getData, postData, postFileData } = useApi();
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesAll, setCoursesAll] = useState<Course[]>([]);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Classes[]>([]);
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
  const [university, setUniversity] = useState<University[]>([]);
  const [semester, setSemester] = useState<Semester[]>([]);
  const [semesterpre, setSemesterpre] = useState<Semester[]>([]);

  const [selectedHobby, setSelectedHobby] = useState<any>("");
  const [selectedLanguage, setSelectedLanguage] = useState<any>("");
  const [selectedproficiency, setSelectedproficiency] = useState<any>("");
  const [selectedgender, setSelectedgender] = useState<any>("");
  const [selectedInstitute, setSelectedInstitute] = useState<any>("");
  const [selectCourse, setSelectedCourse] = useState<any>("");
  const [selectUniversity, setSelectedUniversity] = useState<any>("");
  const [selectSemester, setSelectedSemester] = useState<any>("");
  const [selectSemesterpre, setSelectedSemesterpre] = useState<any>("");
  const [selectSubject, setSelectedSubject] = useState<any>("");
  const [selectedInstituteType, setSelectedInstituteType] = useState<any>("");
  const [selectedBoard, setSelectedBoard] = useState<any>("");
  const [selectedAcademicState, setSelectedAcademicState] = useState<any>("");
  const [selectedClass, setSelectedClass] = useState<any>("");
  const [selectedStream, setSelectedStream] = useState<any>("");
  const [selectedLearningStyle, setSelectedLearningStyle] = useState<any>("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<any>("");

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
  const [city, setcity] = useState(false);
  const [preferenceError, setpreferenceError] = useState(false);
  const [pincode, setpincode] = useState(false);
  const [per, setper] = useState(false);
  const [checked, setchecked] = useState(false);
  const [closemodel, setclosemodel] = useState(false);
  const [goal, setGoal] = useState(false);
  const [firstaddress, setFirstAddress] = useState(false);
  const [secondaddress, setSecondAddress] = useState(false);
  const [answeredData, setAnsweredData] = useState<any>();
  // const [open, setOpen] = useState(true);

  const errordata = [
    "Please enter a valid full name only characters allowed.",
    "",
    "Please enter a Goal.",
    "",
    "Please enter a valid mother name only characters allowed.",
    "Please enter a valid father name only characters allowed.",
    "Please enter a valid guardian name only characters allowed.",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Mobile number should be 10 digits",
    "WhatsApp number should be 10 digits",
    "",
    "",
    "",
    "Please enter a valid preference only characters allowed.",
    "Please enter a valid percentage.",
    "",
    "",
    "Please enter a valid district name only characters allowed.",
    "Please enter a valid city name only characters allowed.",
    "Invalid Pincode. It must be 6 digits only.",
    "Please enter first address .",
    "Please enter second address.",
  ];
  const profileURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const callAPI = async () => {
    if (usertype === "student") {
      getData(`${profileURL}/${StudentId}`)
        .then((data: any) => {
          if (data.status === 200) {
            //  navigate("/main/Dashboard");
            setAnsweredData(data.data);
            if (data?.data?.academic_history?.institution_type === "school") {
              getData(
                `/class/get/${data?.data?.academic_history?.class_id}`
              ).then((response: any) => {
                if (response.status === 200) {
                  setSelectedClass({
                    label: response.data.class_name,
                    value: response.data.class_id,
                  });
                }
              });
            }
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

  useEffect(() => {
    if (isOpen) document.body.classList.add("test");
  }, [isOpen]);

  const initialQuestions: { [key: string]: string[] } = {
    basic: [
      "What is your full name?",
      "What is your DOB?",
      "What is your main learning goal or interest for visiting our application?",
      "What is your gender?",
      "What is your mother's name?",
      "What is your father's name?",
      "What is your guardian's name?",
      "Upload your profile picture",
      "Hi! Please provide your academic information! What is your institute type?",
      "Please select your board",
      "Please select your state",
      "Please select your class",
      "Please select your stream",
      "Please select your university",
      "Please select your institution",
      "Please select your course",
      "Please select your semester",
      "What is your learning style?",
      "Please select year",
      "Hi, Please choose your hobbies",
      "Select your known language",
      "What is your proficiency in the selected language?",
      "Please select your mobile number country code",
      "What is your mobile number?",
      "What is your WhatsApp number?",
      "Hi, Please provide your subject preference information! what is your course name to which your subject belongs?",
      "Please select your semester",
      "Select your subject name",
      "What is your preference?",
      "Add your score in percentage",
      "Please select your current country of residence",
      "Which state do you currently reside in?",
      "Which district do you currently live in?",
      "Which city do you live in?",
      "What is your Pin code?",
      "What is your first address?",
      "What is your second address?",
      "Thanks for providing your personal information",
    ],
  };

  const sectionOrder = ["basic"];
  const mapping: Mapping = {
    // Basic Info
    "What is your full name?": ["0", "basic_info", "first_name", "last_name"],
    "What is your DOB?": ["1", "basic_info", "dob"],
    "What is your main learning goal or interest for visiting our application?":
      ["2", "basic_info", "aim"],
    "What is your gender?": ["3", "basic_info", "gender"],
    "What is your mother's name?": ["4", "basic_info", "mother_name"],
    "What is your father's name?": ["5", "basic_info", "father_name"],
    "What is your guardian's name?": ["6", "basic_info", "guardian_name"],
    "Upload your profile picture": ["7", "basic_info", "pic_path"],

    // Academic Information
    "Hi! Please provide your academic information! What is your institute type?":
      ["8", "academic_history", "institution_type"],
    // School-specific
    "Please select your board": ["9", "academic_history", "board"],
    "Please select your state": [
      "10",
      "academic_history",
      "state_for_stateboard",
    ], // This is for state board-specific question
    "Please select your class": ["11", "academic_history", "class_id"],
    "Please select your stream": ["12", "academic_history", "stream"],

    // College-specific
    "Please select your university": [
      "13",
      "academic_history",
      "university_id",
    ],
    "Please select your institution": [
      "14",
      "academic_history",
      "institution_name",
    ],
    "Please select your course": ["15", "academic_history", "course_id"],
    "Please select your semester": ["16", "academic_history", "sem_id"],
    "What is your learning style?": [
      "17",
      "academic_history",
      "learning_style",
    ],
    "Please select year": ["18", "academic_history", "year"],

    //Hobby
    "Hi, Please choose your hobbies": ["19", "hobby", "hobby_id"],

    //Language Known
    "Select your known language": ["20", "language_known", "language_id"],
    "What is your proficiency in the selected language?": [
      "21",
      "language_known",
      "proficiency",
    ],

    // Contact
    "Please select your mobile number country code": [
      "22",
      "contact",
      "mobile_isd_call",
      "mobile_isd_watsapp",
    ],
    "What is your mobile number?": ["23", "contact", "mobile_no_call"],
    "What is your WhatsApp number?": ["24", "contact", "mobile_no_watsapp"],

    //Subject
    "Hi, Please provide your subject preference information! what is your course name to which your subject belongs?":
      ["25", "subject_preference", "course_name"],
    "Please select your semester ": ["26", "subject_preference", "sem_id"],
    "Select your subject name": ["27", "subject_preference", "subject_name"],

    "What is your preference?": ["28", "subject_preference", "preference"],
    "Add your score in percentage": [
      "29",
      "subject_preference",
      "score_in_percentage",
    ],

    // Address
    "Please select your current country of residence": [
      "30",
      "address",
      "country",
    ],
    "Which state do you currently reside in?": ["31", "address", "state"],
    "Which district do you currently live in?": ["32", "address", "district"],
    "Which city do you live in?": ["33", "address", "city"],
    "What is your Pin code?": ["34", "address", "pincode"],
    "What is your first address?": ["35", "address", "address1"],
    "What is your second address?": ["36", "address", "address2"],
  };

  const adjustQuestionsForInstitutionType = (institutionType: string) => {
    let adjustedQuestions = [...initialQuestions[currentSection!]];
    let adjustedMapping = { ...mapping };
    let board = answeredData?.academic_history?.board;

    if (institutionType === "school") {
      // Remove college-specific questions
      if (board === "state_board") {
        adjustedQuestions = adjustedQuestions.filter(
          (question) =>
            question !== "Please select your university" &&
            question !== "Please select your institution" &&
            question !== "Please select your course" &&
            question !== "Please select your semester" &&
            question !== "What is your learning style?" &&
            question !== "Please select year" &&
            question !==
            "Hi, Please provide your subject preference information! what is your course name to which your subject belongs?" &&
            question !== "Please select your semester "
        );
      } else {
        adjustedQuestions = adjustedQuestions.filter(
          (question) =>
            question !== "Please select your university" &&
            question !== "Please select your institution" &&
            question !== "Please select your course" &&
            question !== "Please select your semester" &&
            question !== "What is your learning style?" &&
            question !== "Please select year" &&
            question !== "Please select your state" &&
            question !==
            "Hi, Please provide your subject preference information! what is your course name to which your subject belongs?" &&
            question !== "Please select your semester "
        );
      }

      if (
        selectedClass?.label !== "class_11" &&
        selectedClass?.label !== "class_12"
      ) {
        adjustedQuestions = adjustedQuestions.filter(
          (question) => question !== "Please select your stream"
        );
      }

      // Remove college-specific mappings
      delete adjustedMapping["Please select your university"];
      delete adjustedMapping["Please select your institution"];
      delete adjustedMapping["Please select your course"];
      delete adjustedMapping["Please select your semester"];
      delete adjustedMapping["What is your learning style?"];
      delete adjustedMapping["Please select year"];
      delete adjustedMapping[
        "Hi, Please provide your subject preference information! what is your course name to which your subject belongs?"
      ];
      delete adjustedMapping["Please select your semester "];
    } else if (institutionType === "college") {
      // Remove school-specific questions
      adjustedQuestions = adjustedQuestions.filter(
        (question) =>
          question !== "Please select your board" &&
          question !== "Please select your class" &&
          question !== "Please select your state" &&
          question !== "Please select your stream"
      );

      // Remove school-specific mappings
      delete adjustedMapping["Please select your board"];
      delete adjustedMapping["Please select your class"];
    }

    return { adjustedQuestions, adjustedMapping };
  };

  const getSubject = async () => {
    if (answeredData?.academic_history?.institution_type === "school" || answers[8]?.toLowerCase() === "school") {
      getData("school_subject/list")
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
            position: "top-center",
          });
        });
    } else {
      getData("college_subject/list")
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
            position: "top-center",
          });
        });
    }
  };
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentSection) {
      if (answeredData) {
        const institutionType = answeredData.academic_history.institution_type;
        const { adjustedQuestions } =
          adjustQuestionsForInstitutionType(institutionType);

        let filteredQuestions;

        if (institutionType) {
          filteredQuestions = adjustedQuestions.filter((question: string) => {
            if (question !== "Upload your profile picture") {
              const keys: any = mapping[question];
              if (!keys) return true; // If no mapping exists, keep the question

              const [index, section, ...fields] = keys;
              const sectionData = answeredData[section];

              return !fields.every((field: any) => sectionData[field]); // Remove the question if all fields have values
            }
          });
        } else {
          filteredQuestions = initialQuestions[currentSection].filter(
            (question: string) => {
              if (question !== "Upload your profile picture") {
                const keys: any = mapping[question];
                if (!keys) return true; // If no mapping exists, keep the question

                const [index, section, ...fields] = keys;
                const sectionData = answeredData[section];

                return !fields.every((field: any) => sectionData[field]); // Remove the question if all fields have values
              }
            }
          );
        }
        setCurrentQuestionIndex(Number(mapping[filteredQuestions?.[0]]?.[0]));
        setMessages([{ text: filteredQuestions[0], type: "question" }]);
      } else {
        setMessages([
          { text: initialQuestions[currentSection][0], type: "question" },
        ]);
      }
    }

    getData("/class/list")
      .then((response: any) => {
        if (response.status === 200) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active
          );
          setClasses(filteredData || []);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
    getData("/university/list")
      .then(async (response: any) => {
        if (response.status === 200) {
          const filteredData = await response?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setUniversity(filteredData || []);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
    getData("/semester/list")
      .then(async (response: any) => {
        if (response.status === 200) {
          const filteredData = await response?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setSemester(filteredData || []);
          setSemesterpre(filteredData || []);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
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
          setCoursesAll(filteredData || []);
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
  }, [currentSection, answeredData]);

  useEffect(() => {
    // Scroll to the bottom of the chat box whenever messages update
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      // chatBoxRef.current = chatBoxRef.current.scrollIntoView();
    }
  }, [messages]);

  useEffect(() => {
    if (uploadedFile) saveAnswersforBasic([...answers]);
  }, [uploadedFile]);

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
    const birthdate:any = parseDate(answers[1]);
    // Convert the birthdate to a Date object
const birthdateObj = new Date(birthdate);
// Get the current day of the month
const dayOfMonth = birthdateObj?.getDate();
// Increment the date to the next day
birthdateObj?.setDate(dayOfMonth);
function formatDateToISO(date: Date): string {
  const year = date?.getFullYear();
  const month = (date?.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const day = date?.getDate().toString().padStart(2, '0');
  const hours = date?.getHours().toString().padStart(2, '0');
  const minutes = date?.getMinutes().toString().padStart(2, '0');
  const seconds = date?.getSeconds().toString().padStart(2, '0');
  const milliseconds = date?.getMilliseconds().toString().padStart(3, '0');

  // Format as "yyyy-mm-ddThh:mm:ss.sssZ"
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}
const formattedDate = formatDateToISO(birthdateObj);


    const fullName = answers?.[0];
    let nameParts: string[] = fullName?.split(" ");
    const firstname = nameParts?.[0];
    const lastname = nameParts?.[1];
    let payload = {
      student_login_id: StudentId,
      first_name: answeredData?.basic_info?.first_name || firstname,
      last_name: answeredData?.basic_info?.last_name || lastname,
      // gender: answers[1],
      gender: answeredData?.basic_info?.gender || answers[3] || selectedgender,
      dob: answeredData?.basic_info?.dob || formattedDate,
      father_name: answeredData?.basic_info?.father_name || answers[5],
      mother_name: answeredData?.basic_info?.mother_name || answers[4],
      guardian_name: answeredData?.basic_info?.guardian_name || answers[6],
      aim: answeredData?.basic_info?.aim || answers[2],
      pic_path: answeredData?.basic_info?.pic_path || answers[7],
    };

    postData(`${"student/add"}`, payload)
      .then((data: any) => {
        if (data.status === 200) {
          setNamepro(data?.first_name);
          const formData = new FormData();
          const nfile: any = uploadedFile;
          formData.append("file", nfile);

          if (formData.has("file")) {
            postFileData(`${"upload_file/upload"}`, formData)
              .then((data: any) => {
                if (data?.status === 200) {
                  setProImage(data?.image_url);
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
    const contfullPhone = answer[20];
    let phoneNum = contfullPhone?.split(" ");
    const contfullPhonewtsp = answer[21];
    let phoneNumwtsp = contfullPhonewtsp?.split(" ");
    let email = localStorage.getItem("userid");

    let payload = {
      student_id: StudentId,
      mobile_isd_call: answeredData?.contact?.mobile_isd_call || answer[22],
      mobile_no_call: answeredData?.contact?.mobile_no_call || answer[23],
      mobile_isd_watsapp:
        answeredData?.contact?.mobile_isd_watsapp || answer[22],
      mobile_no_watsapp: answeredData?.contact?.mobile_no_watsapp || answer[24],
      email_id: answeredData?.contact?.email_id || email,
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
    // const Address = answers[13];
    // let addressParts = Address?.split(",");

    const payload = {
      student_id: StudentId,
      address1: answeredData?.address?.address1 || answers[35],
      address2: answeredData?.address?.address2 || answers[36],
      country: answeredData?.address?.country || answers[30],
      state: answeredData?.address?.state || answers[31],
      district: answeredData?.address?.district || answers[32],
      city: answeredData?.address?.city || answers[33],
      pincode: answeredData?.address?.pincode || answers[34],
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
    const payload = {
      student_id: StudentId,
      institution_type:
        answeredData?.academic_history?.institution_type ||
        selectedInstituteType,
      board: (answeredData?.academic_history?.institution_type?.toLowerCase() || selectedInstituteType?.toLowerCase() === "school") ? answeredData?.academic_history?.board || selectedBoard : null,
      state_for_stateboard: (answeredData?.academic_history?.institution_type?.toLowerCase() || selectedInstituteType?.toLowerCase() === "school") ?
        answeredData?.academic_history?.state_for_stateboard ||
        selectedAcademicState?.toLowerCase() : null,
      institute_id: (answeredData?.academic_history?.institution_type?.toLowerCase() || selectedInstituteType?.toLowerCase() === "college") ?
        answeredData?.academic_history?.institute_id ||
        selectedInstitute?.toString() : null,
      course_id: (answeredData?.academic_history?.institution_type?.toLowerCase() || selectedInstituteType?.toLowerCase() === "college") ?
        answeredData?.academic_history?.course_id ||
        selectCourse?.toString() : null,
      learning_style: (answeredData?.academic_history?.institution_type?.toLowerCase() || selectedInstituteType?.toLowerCase() === "college") ?
        answeredData?.academic_history?.learning_style || selectedLearningStyle : null,
      class_id: (answeredData?.academic_history?.institution_type?.toLowerCase() || selectedInstituteType?.toLowerCase() === "school") ?
        answeredData?.academic_history?.class_id ||
        answers[11]?.toString() : null,
      // year: answeredData?.academic_history?.year || answers[18] || "",
      year: (answeredData?.academic_history?.institution_type?.toLowerCase() || selectedInstituteType?.toLowerCase() === "college") ?
        answeredData?.academic_history?.year || (answers[18] ? dayjs(answers[18], ["DD/MM/YYYY", "YYYY"])?.year()?.toString() : "") : "",
      stream: (answeredData?.academic_history?.institution_type?.toLowerCase() || selectedInstituteType?.toLowerCase() === "school") ?
        answeredData?.academic_history?.stream || answers[12] : null,
      university_id: (answeredData?.academic_history?.institution_type?.toLowerCase() || selectedInstituteType?.toLowerCase() === "college") ?
        answeredData?.academic_history?.university_id || answers[13] : null,
      sem_id: (answeredData?.academic_history?.institution_type?.toLowerCase() || selectedInstituteType?.toLowerCase() === "college") ?
        answeredData?.academic_history?.sem_id || answers[16] : null,
    };

    postData("/new_student_academic_history/add", payload).then((response) => {
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
      subject_id: answeredData?.subject_preference?.id || selectSubject,
      preference: answeredData?.subject_preference?.preference || answers[28],
      score_in_percentage:
        answeredData?.subject_preference?.score_in_percentage || answers[29],
      sem_id: answeredData?.subject_preference?.sem_id || answers[26],
      ...(answeredData?.academic_history?.institution_type === "school" &&
        answeredData?.academic_history?.stream && {
        stream: answeredData?.academic_history?.stream || answers[12],
      }),
      ...((answeredData?.academic_history?.institution_type === "college" || answers[8]?.toLowerCase() === "college") && {
        course_id: answeredData?.subject_preference?.course_id || selectCourse,
      }),
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
  const universitySelectOptions = university.map((option) => ({
    value: option.university_id,
    label: option.university_name,
  }));
  // const semesterSelectOptions = semester.map((option) => ({
  //   value: option.semester_id,
  //   label: option.semester_number,
  // }));
  const maxSemester = semester && semester?.length > 0
    ? Math.max(...semester?.map((item: { semester_number: any; }) => item?.semester_number))
    : 0;
  // const semesterSelectOptions = [...Array(semester[0]?.semester_number)].map(
  const semesterSelectOptions = [...Array(maxSemester)]?.map(
    (_, index) => ({
      value: index + 1, // Setting the value based on index
      label: `Semester ${index + 1}`, // Displaying as "Semester {index + 1}"
    })
  );
  const semesterSelectOptionspre = selectSemester
    ? [{
      value: selectSemester,
      label: `Semester ${selectSemester}`,
    }]
    : semesterpre[0]?.semester_number ? [{
      value: semesterpre[0]?.semester_number,
      label: `Semester ${semesterpre[0]?.semester_number}`,
    }] : [];



  // const semesterSelectOptionspre = [
  //   ...Array(semesterpre[0]?.semester_number),
  // ].map((_, index) => ({
  //   value: index + 1, 
  //   label: `Semester ${index + 1}`, 
  // }));
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
    value: option?.subject_id || option?.id,
    label: option.subject_name,
  }));
  const classOptions = classes.map((option) => ({
    value: option.id,
    label: option.class_name,
  }));
  const institutionTypeOptions = [
    {
      label: "School",
      value: "school",
    },
    {
      label: "College",
      value: "college",
    },
  ];
  const boardOptions = [
    {
      label: "CBSE",
      value: "cbse",
    },
    {
      label: "ICSE",
      value: "icse",
    },
    {
      label: "State Board",
      value: "state_board",
    },
  ];
  const learningStyleOptions = [
    {
      label: "Online",
      value: "online",
    },
    {
      label: "Offline",
      value: "offline",
    },
    {
      label: "Any",
      value: "any",
    },
  ];
  const streamOptions = [
    {
      label: "Science",
      value: "science",
    },
    {
      label: "Commerce",
      value: "commerce",
    },
    {
      label: "Arts",
      value: "arts",
    },
  ];
  useEffect(() => {
    if (currentQuestionIndex === 25) {
      if (answers[8] === "school" || answeredData?.academic_history?.institution_type === 'school') {
        setCourses(coursesAll);
      } else {
        const filteredCourse = courses?.filter(
          (item) => ((item?.institution_id === answeredData?.academic_history?.institute_id && item.id === answeredData?.academic_history?.course_id) || (item?.institution_name === answers[14] && item.course_name === answers[15]))
        );
        console.log("FILTERED COURSE", filteredCourse);
        setCourses(filteredCourse);
      }
    }
  }, [currentQuestionIndex, answeredData, selectedInstitute]);

  const academicStateOptions = State.getStatesOfCountry("IN").map(
    (state: any) => ({
      value: state.isoCode,
      label: state.name,
    })
  );

  const saveanswerForHobbeis = (answers: string[]) => {
    let payload = {
      student_id: StudentId,
      hobby_id: answeredData?.hobby?.hobby_id || selectedHobby,
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
      language_id:
        answeredData?.language_known?.language_id || selectedLanguage,
      proficiency:
        answeredData?.language_known?.proficiency || selectedproficiency,
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
    if (currentQuestionIndex === 3) {
      const gender = updatedAnswers[3].toLowerCase();
      if (gender !== "male" && gender !== "female") {
        // You can set an error state here if needed
        setGenderError(true);
        return;
      } else {
        setGenderError(false);
      }
    }
    if (currentQuestionIndex === 4) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(updatedAnswers[4])) {
        setMotherNameError(true);
        return;
      } else {
        setMotherNameError(false);
      }
    }
    if (currentQuestionIndex === 5) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(updatedAnswers[5])) {
        setFName(true);
        return;
      } else {
        setFName(false);
      }
    }
    if (currentQuestionIndex === 6) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(updatedAnswers[6])) {
        setgName(true);
        return;
      } else {
        setgName(false);
      }
    }
    if (currentQuestionIndex === 23) {
      // Regular expression for exactly 10 digits
      const phoneRegex = /^\d{10}$/;

      if (!phoneRegex.test(updatedAnswers[23])) {
        setphnumber(true);
        return;
      } else {
        setphnumber(false);
      }
    }
    if (currentQuestionIndex === 24) {
      // Regular expression for exactly 10 digits
      const phoneRegex = /^\d{10}$/;

      if (!phoneRegex.test(updatedAnswers[24])) {
        setphnumber(true);
        return;
      } else {
        setphnumber(false);
      }
    }
    if (currentQuestionIndex === 30) {
      // Regular expression for exactly 10 digits
      const disticRegex = /^[a-zA-Z\s]+$/;

      if (!disticRegex.test(updatedAnswers[30])) {
        setdisct(true);
        return;
      } else {
        setdisct(false);
      }
    }
    if (currentQuestionIndex === 32) {
      const disticRegex = /^[a-zA-Z\s]+$/;

      if (!disticRegex.test(updatedAnswers[32])) {
        setdisct(true);
        return;
      } else {
        setdisct(false);
      }
    }
    if (currentQuestionIndex === 33) {
      const disticRegex = /^[a-zA-Z\s]+$/;

      if (!disticRegex.test(updatedAnswers[33])) {
        setcity(true);
        return;
      } else {
        setcity(false);
      }
    }
    if (currentQuestionIndex === 34) {
      const pincodeRegex = /^\d{6}$/;

      if (!pincodeRegex.test(updatedAnswers[34])) {
        // setpincode(true);
        setpincode(true);
        setError1("");
      } else {
        // setpincode(false);
        setpincode(false); // Clear the error if valid
        setError1("");
      }
    }
    if (currentQuestionIndex === 28) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(updatedAnswers[28])) {
        setpreferenceError(true);
        return;
      } else {
        setpreferenceError(false);
      }
    }
    if (currentQuestionIndex === 29) {
      // Regular expression for exactly 6 digits (adjust the length as per your requirement)
      const regex = /^(100(\.0{1,2})?|[0-9]?[0-9](\.[0-9]{1,2})?)$/;

      if (!regex.test(updatedAnswers[29])) {
        setper(true);
        return;
      } else {
        setper(false);
      }
    }
    if (currentQuestionIndex === 35) {
      if (updatedAnswers[35] === "" || updatedAnswers[35] == null) {
        setFirstAddress(true);
      } else {
        setFirstAddress(false);
      }
    }
    if (currentQuestionIndex === 36) {
      if (updatedAnswers[36] === "" || updatedAnswers[36] == null) {
        setSecondAddress(true);
      } else {
        setSecondAddress(false);
      }
    }

    // if (currentQuestionIndex === 28) {
    //   // Regular expression for exactly 6 digits (adjust the length as per your requirement)
    //   const regex = /^(100(\.0{1,2})?|[0-9]?[0-9](\.[0-9]{1,2})?)$/;

    //   if (!regex.test(updatedAnswers[28])) {
    //     setper(true);
    //     return;
    //   } else {
    //     setper(false);
    //   }
    // }
  };
  const handleSkip = () => {
    setError1("");
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: "", type: "answer" as "answer" },
    ];
    saveAnswersforBasic([...answers]);
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
    // if (currentQuestionIndex === 13) {
    //   datecheck = dayjs(datecheck).format("DD/MM/YYYY");
    // }
    if (datecheck) {
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex] = datecheck;
      setAnswers(updatedAnswers);
      if (currentQuestionIndex === 18)
        saveAnswersforacadmichistory(updatedAnswers);
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
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    // setBasicInfo((values) => ({ ...values, dob: newDate }));
    // setOpen(false);
    // setErordate("")
    
    datecheck = dayjs(newDate).format(
      currentQuestionIndex === 18 ? "YYYY" : "DD/MM/YYYY"
    );

    if (hitcount % 2 === 0) {
      if (currentQuestionIndex === 11) {
        if (datecheck > answers[10]) {
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
        if (
          (answers[8]?.toLowerCase() === "school" ||
            answeredData?.academic_history?.institution_type === "school") &&
          currentQuestionIndex === 24
        ) {
          setCurrentQuestionIndex(27);
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
        setMessages([
          ...updatedMessages,
          {
            text:
              (answers[8]?.toLowerCase() === "school" ||
                answeredData?.academic_history?.institution_type ===
                "school") &&
                currentQuestionIndex === 24
                ? currentQuestions[27]
                : currentQuestions[currentQuestionIndex + 1],
            type: "question" as "question",
          },
        ]);

        if (currentQuestionIndex === 24)
          saveAnswersforContact([...answers, e.currentTarget.value]);
        else if (currentQuestionIndex === 29)
          saveAnswerforsubjectpreference([...answers, e.currentTarget.value]);
        else if (currentQuestionIndex === 36)
          saveAnswerforAddress([...answers, e.currentTarget.value]);

        if (answers.length === 10) {
          // saveAnswersforBasic([...answers, e.currentTarget.value]);
        } else if (answers.length === 22) {
          // saveAnswersforContact([...answers, e.currentTarget.value]);
        } else if (answers.length === 19) {
          // saveAnswersforacadmichistory([...answers, e.currentTarget.value]);
        } else if (answers.length === 27) {
          // saveAnswerforAddress([...answers, e.currentTarget.value]);
        } else if (answers.length === 31) {
          // saveAnswerforsubjectpreference([...answers, e.currentTarget.value]);
        } else if (selectedproficiency !== "") {
          // saveanswerForHobbeis([...answers, e.currentTarget.value]);
          // saveAnswerForLanguage([...answers, e.currentTarget.value]);
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
    const charecterRegex = /^[a-zA-Z\s]+$/;
    const regex = /^(100(\.0{1,2})?|[0-9]?[0-9](\.[0-9]{1,2})?)$/;

    const updatedAnswers = [...answers];
    if (currentQuestionIndex === 0) {
      const fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
      if (!fullNameRegex.test(updatedAnswers[0])) {
        setFullName(true);
        return;
      } else {
        setFullName(false);
      }
    }

    if (currentQuestionIndex === 2) {
      if (updatedAnswers[2] === "" || updatedAnswers[2] == null || !charecterRegex.test(updatedAnswers[2])) {
        setGoal(true);
        return;
      } else {
        setGoal(false);
      }
    }
    if (currentQuestionIndex === 4) {
      if (updatedAnswers[4] === "" || updatedAnswers[4] == null || !charecterRegex.test(updatedAnswers[4])) {
        setMotherNameError(true);
        return;
      } else {
        setMotherNameError(false);
      }
    }
    if (currentQuestionIndex === 5) {
      if (updatedAnswers[5] === "" || updatedAnswers[5] == null || !charecterRegex.test(updatedAnswers[5])) {
        setFName(true);
        return;
      } else {
        setFName(false);
      }
    }
    if (currentQuestionIndex === 6) {
      if (updatedAnswers[6] === "" || updatedAnswers[6] == null || !charecterRegex.test(updatedAnswers[6])) {
        setgName(true);
        return;
      } else {
        setgName(false);
      }
    }
    if (currentQuestionIndex === 23) {
      if (updatedAnswers[23] === "" || updatedAnswers[23] == null || !/^\d{10}$/.test(updatedAnswers[23])) {
        setphnumber(true);
        return;
      } else {
        setphnumber(false);
      }
    }
    if (currentQuestionIndex === 24) {
      if (updatedAnswers[24] === "" || updatedAnswers[24] == null || !/^\d{10}$/.test(updatedAnswers[24])) {
        setphnumber(true);
        return;
      } else {
        setphnumber(false);
      }
    }
    if (currentQuestionIndex === 28) {
      if (updatedAnswers[28] === "" || updatedAnswers[28] == null || !charecterRegex.test(updatedAnswers[28])) {
        setpreferenceError(true);
        return;
      } else {
        setpreferenceError(false);
      }
    }

    if (currentQuestionIndex === 29) {
      if (updatedAnswers[29] === "" || updatedAnswers[29] == null || !regex.test(updatedAnswers[29])) {
        setper(true);
        return;
      } else {
        setper(false);
      }
    }
    if (currentQuestionIndex === 32) {
      if (updatedAnswers[32] === "" || updatedAnswers[32] == null || !charecterRegex.test(updatedAnswers[32])) {
        setdisct(true);
        return;
      } else {
        setdisct(false);
      }
    }
    if (currentQuestionIndex === 33) {
      if (updatedAnswers[33] === "" || updatedAnswers[33] == null || !charecterRegex.test(updatedAnswers[33])) {
        setcity(true);
        return;
      } else {
        setcity(false);
      }
    }

    if (e.key === "Enter") {
      if (
        fullName ||
        genderError ||
        motherNameError ||
        fName ||
        gName ||
        phnumber ||
        distic ||
        city ||
        pincode ||
        per ||
        preferenceError ||
        errordate ||
        goal ||
        firstaddress ||
        secondaddress
      ) {
        return; // Stop further execution if full name validation fails
      }
      e.preventDefault();
      if (currentQuestionIndex === 23 || currentQuestionIndex === 24) {
        if (answers[currentQuestionIndex]?.length === 10) {
          answerSaveandGotoNextquestoin(e);
        } else {
          toast.error("Please enter valid 10 digit mobile number", {
            hideProgressBar: true,
            theme: "colored",
          });
        }
      } else if (currentQuestionIndex === 34) {
        if (answers[currentQuestionIndex]?.length === 6) {
          answerSaveandGotoNextquestoin(e);
          setError1("");
        } else {
          setError1("Please enter valid 6 digit pincode");
          // toast.error("Please enter valid 6 digit pincode", {
          //   hideProgressBar: true,
          //   theme: "colores",
          // });
        }
      } else if (currentQuestionIndex === 35) {
        if (updatedAnswers[35] === "" || updatedAnswers[35] == null) {
          setFirstAddress(true);
        } else {
          setFirstAddress(false);
          answerSaveandGotoNextquestoin(e);
        }
      } else if (currentQuestionIndex === 36) {
        if (updatedAnswers[36] === "" || updatedAnswers[36] == null) {
          setSecondAddress(true);
        } else {
          setSecondAddress(false);
          answerSaveandGotoNextquestoin(e);
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

  const handleDropdownChangeInstituteType = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.label;
    setSelectedInstituteType(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      if (e.value === "school") {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        getData("school_subject/list")
          .then((response: any) => {
            if (response.status === 200) {
              const filteredData = response?.data?.filter(
                (item: any) => item?.is_active === 1
              );
              setSubjects(filteredData || []);
              // setSubjects(response.data);
              // setSubjectsAll(filteredData || [])
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
          });

      }
      else {
        getData("college_subject/list")
          .then((response: any) => {
            if (response.status === 200) {
              const filteredData = response?.data?.filter(
                (item: any) => item?.is_active === 1
              );
              setSubjects(filteredData || []);
              // setSubjects(response.data);
              // setSubjectsAll(filteredData || [])
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
          });
        setCurrentQuestionIndex(13);
      }

      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[
            e.value === "school" ? currentQuestionIndex + 1 : 13
          ],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };
  const handleDropdownChangeBoard = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.label;
    setSelectedBoard(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      if (e.value === "state_board")
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      else setCurrentQuestionIndex(11);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[
            e.value === "state_board" ? currentQuestionIndex + 1 : 11
          ],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };
  const handleDropdownChangestream = (e: any) => {
    const filterData = subjects?.filter(
      (item: any) =>
        (item.class_id === answeredData?.academic_history?.class_id ||
          item.class_id === answers[11]) &&
        (item.stream === answeredData?.academic_history?.stream ||
          item.stream === e.value)
    );
    setSubjects(filterData)
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.value;
    setSelectedStream(e.value);
    setAnswers(updatedAnswers);
    saveAnswersforacadmichistory(updatedAnswers);
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: e.value, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(19);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[19],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };
  const handleDropdownChangeAcademicState = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.label;
    setSelectedAcademicState(e.label);
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
  const handleDropdownChangeClass = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.value;
    setSelectedClass(e);
    setAnswers(updatedAnswers);
    if (e.label !== "class_11" && e.label !== "class_12") {
      const filterData = subjects?.filter(
        (item: any) =>
          item.class_id === answeredData?.academic_history?.class_id ||
          item.class_id === e.value
      );
      setSubjects(filterData)
      saveAnswersforacadmichistory(updatedAnswers);
    }
    const currentQuestions = initialQuestions[currentSection!];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: "answer" as "answer" },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      if (e.label === "class_11" || e.label === "class_12")
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      else setCurrentQuestionIndex(19);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[
            e.label === "class_11" || e.label === "class_12"
              ? currentQuestionIndex + 1
              : 19
          ],
          type: "question" as "question",
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };
  const handleDropdownChangeLearningStyle = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.label;
    setSelectedLearningStyle(e.value);
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

  const handleDropdownChangecourse = (e: any) => {
    console.log("Course Handle Change currentQuestionIndex", currentQuestionIndex);
    console.log("PRE SEM", semesterpre);
    console.log("PRE SEM ANSWERED DATA", answeredData);
    console.log("PRE SEM ANSWERS", answers);

    const filteredsem = semester.filter((item) => item.course_id === e.value);
    const filteredsempre = semesterpre.filter(
      (item) => (item.course_id === e.value && (item.semester_number === answeredData?.academic_history?.sem_id || item.semester_number === answers[16])));

    setSemester(filteredsem);
    console.log("FILTERED SEMESTER", filteredsempre);

    setSemesterpre(filteredsempre);

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

  const handleDropdownChangeuniversity = (e: any) => {
    const filteredInstitution = institutes.filter(
      (item) => item.university_id === e.value
    );
    setInstitutes(filteredInstitution);
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.value;
    setSelectedUniversity(e.value);
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
  const handleDropdownChangesemester = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.value;
    setSelectedSemester(e.value);
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
  const handleDropdownChangesemesterpre = (e: any) => {
    console.log("SEMESTER EVENT VALUE", e.value);
    console.log("ALL SUBJECTS", subjects);
    console.log("ANS DATA", answeredData);
    console.log("ANS", answers);
    // const courses = courses.filter((item)=> item.course_name === answers[] )
    const filteredsubject = subjects.filter(
      (item) => item.semester_id === e.value && (item.course_id === answeredData?.academic_history?.course_id || item.course_name === answers[15]));
    console.log("test log subject subjects", subjects)
    console.log("test log subject filteredsubject", filteredsubject, e.value, courses, answers)
    setSubjects(filteredsubject);
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = e.value;
    setSelectedSemesterpre(e.value);
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
    const filteredcourse = courses.filter(
      (item) => item.institution_id === e.value
    );

    setCourses(filteredcourse);
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

  const countryOptions = Country.getAllCountries().map((country: any) => ({
    value: country.isoCode,
    label: country.name,
  }));

  const handleCountryChange = (selectedOption: any) => {
    console.log("COUNTRY SELECTED OPTION", selectedOption);

    setSelectedCountry(selectedOption);
    if (selectedOption) {
      const states = State.getStatesOfCountry(selectedOption.value);
      const stateOptions = states.map((state: any) => ({
        value: state.isoCode,
        label: state.name,
      }));
      console.log("ALL STATES", stateOptions);
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

    document?.documentElement?.setAttribute("data-bs-theme", themes);
    setNamecolor(themes);
    localStorage.setItem("theme", themes);
  };
  const handlecancel = () => {
    setclosemodel(false);
  };
  const handleok = () => {
    onCancel();
    setclosemodel(false);
    document.body.classList.remove("overflow-hidden");
    // navigate("/main/Dashboard");
  };
  const handleOpen = () => {
    // setOpen(true);
  };


  return (
    <>
      <div
        style={{ display: "flex" }}
        id="freechatbox"
        className={`${!isOpen ? "d-none" : ""} freechatbox`}
        //open={isOpen}
        // className="dialog"
        // open={true}
        //onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      // PaperProps={{
      //   style: {
      //     position: "fixed",
      //     bottom: 50,
      //     // left: 0,
      //     right: 50,
      //     margin: 0,
      //     width: "400px",
      //     backgroundColor: chatdialog(namecolor),
      //   },
      // }}
      >
        <div className="profilechatinner">
          {/* <Button
   onClick={() => handleClose({}, 'backdropClick')}  // Adjusted to pass the expected arguments
   style={{ position: 'absolute', top: 10, right: 10 }}
   aria-label="close"
 > */}
          <div className="proheader">
            <div className="me-auto">
              {" "}
              <img src={glogo} width="20" alt="" /> Add your information <br />{" "}
              for better services
            </div>
            {/* <FormControlLabel
            control={
              <Switch
                checked={checked}
                onChange={() => handleChange(checked ? "light" : "dark")}
              />
            }
            label=""
          /> */}
            <FormControlLabel
              className="me-0"
              control={
                <MaterialUISwitch
                  sx={{ m: 0 }}
                  size="small"
                  checked={checked}
                  onChange={() => handleChange(checked ? "light" : "dark")}
                />
              }
              label=""
            />
            <IconButton onClick={() => setclosemodel(true)} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="afterheader">
            {/* <DialogTitle id="alert-dialog-title">
            <p style={{ color: inputfieldtext(namecolor) }}>
              Add your information for better services
            </p>
          </DialogTitle> */}

            <div className="chat-box" ref={chatBoxRef}>
              {messages.map((message, index) => {
                if (message.text) {
                  return (
                    <div
                      key={index}
                      className={`message-wrapper d-flex mb-3 ${message.type === "question"
                        ? "justify-content-start"
                        : "justify-content-end"
                        }`}
                    >
                      <div
                        className={`message-bubble p-3 ${message.type === "question" ? "left" : "right"
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
                  );
                }
              })}
            </div>

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
                    city ||
                    pincode ||
                    per ||
                    preferenceError ||
                    errordate ||
                    goal ||
                    firstaddress ||
                    secondaddress) && (
                      <p className="error-text">
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
                  {currentQuestionIndex === 15 ||
                    currentQuestionIndex === 25 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangecourse}
                      options={courseSelectOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectCourse}
                    />
                  ) : currentQuestionIndex === 8 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeInstituteType}
                      options={institutionTypeOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedInstituteType}
                    />
                  ) : currentQuestionIndex === 22 ? (
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
                        style={{
                          position: "relative",
                          display: "inline-block",
                        }}
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
                  ) : currentQuestionIndex === 9 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeBoard}
                      options={boardOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedBoard}
                    />
                  ) : currentQuestionIndex === 12 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangestream}
                      options={streamOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedStream}
                    />
                  ) : currentQuestionIndex === 13 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeuniversity}
                      options={universitySelectOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectUniversity}
                    />
                  ) : currentQuestionIndex === 16 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangesemester}
                      options={semesterSelectOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectSemester}
                    />
                  ) : currentQuestionIndex === 26 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangesemesterpre}
                      options={semesterSelectOptionspre}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectSemesterpre}
                    />
                  ) : currentQuestionIndex === 14 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeInstitute}
                      options={instituteSelectOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedInstitute}
                    />
                  ) : currentQuestionIndex === 10 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeAcademicState}
                      options={academicStateOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedAcademicState}
                    />
                  ) : currentQuestionIndex === 11 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeClass}
                      options={classOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedClass?.value || ""}
                    />
                  ) : currentQuestionIndex === 17 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeLearningStyle}
                      options={learningStyleOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedLearningStyle}
                    />
                  ) : currentQuestionIndex === 27 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangesubject}
                      options={subjectOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectSubject}
                    />
                  ) : currentQuestionIndex === 1 ? (
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
                              label={"Date of Birth"}
                              onChange={handleDateChange}
                              // onAccept={() => setOpen(false)} // Close on date selection
                              // onClose={() => setOpen(false)}  // Close on outside click
                              disableFuture
                              format={"DD/MM/YYYY"}
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
                                    "& .MuiInputBase-input": {
                                      minHeight: "15px !important",
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
                  ) : currentQuestionIndex === 18 ? (
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
                              views={["year"]}
                              label={"Year"}
                              onChange={handleDateChange}
                              // onAccept={() => setOpen(false)} // Close on date selection
                              // onClose={() => setOpen(false)}  // Close on outside click
                              disableFuture
                              format={"YYYY"}
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
                  ) : currentQuestionIndex === 19 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangehobby}
                      options={hobbyOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedHobby}
                    />
                  ) : currentQuestionIndex === 30 ? (
                    <Select
                      className="dropdown-wrapper"
                      options={countryOptions}
                      onChange={handleCountryChange}
                      placeholder="Select a country"
                      menuPlacement="top"
                      value={selectedCountry}
                    />
                  ) : currentQuestionIndex === 31 &&
                    stateOptions?.length > 0 ? (
                    <Select
                      className="dropdown-wrapper"
                      options={stateOptions}
                      placeholder="Select a state"
                      onChange={handleStateChange}
                      isDisabled={!selectedCountry}
                      menuPlacement="top"
                      value={selectedstate}
                    />
                  ) : currentQuestionIndex === 20 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangelanguage}
                      options={languageOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedLanguage}
                    />
                  ) : currentQuestionIndex === 21 ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeproficiency}
                      options={proficiencyOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedproficiency}
                    />
                  ) : currentQuestionIndex === 3 ? (
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
        </div>
        {/* <div className="copyright">&copy; Copyright 2024, All Right Reserved </div> */}
        <ChatDialogClose
          isOpen={closemodel}
          onCancel={handlecancel}
          onDeleteClick={() => handleok()}
          title="Close chat?"
        />
      </div>
    </>
  );
};
