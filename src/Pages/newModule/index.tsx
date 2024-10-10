import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./stylechat.css"; // Import your CSS file
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import { Country, State, City } from "country-state-city";


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

const NewModule: React.FC = () => {
  const { getData, postData, postFileData } = useApi();
  let StudentId = localStorage.getItem("_id");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentSection, setCurrentSection] = useState<string | null>("basic");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [messages, setMessages] = useState<
    { text: string; type: "question" | "answer" }[]
  >([]);
  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);
  const [alllanguage, setAllLanguage] = useState<Language[]>([]);

  const [selectedHobby, setSelectedHobby] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedInstitute, setSelectedInstitute] = useState<string>("");
  const [selectCourse, setSelectedCourse] = useState<string>("");
  const [selectSubject, setSelectedSubject] = useState<string>("");

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);

  const initialQuestions: { [key: string]: string[] } = {
    basic: [
      "What is your full name?",
      "What is your gender?",
      "What is your DOB?(Ex. MM/DD/YYYY)",
      "What are your mother's names?",
      "What are your father's names?",
      "What are your guardian's names?",
      "What is your main learning goal or interest for visiting our application",
      "Upload your profile picture?",
      "please select your mobile number country code ?",
      "What is your mobile number?",
      "What is your WhatsApp number ?",
      "Hi! Please provide your academic information !!! What is your course name?",
      "What is your institute name?",
      "When did you join this course? (Ex. DD/MM/YYYY)",
      "When did you complete this course? (Ex. DD/MM/YYYY)",
      "Which country are living ?",
      "What is your state?",
      "What is your district",
      "What is your city?",
      "what is your pincode",
      "what is your first address ?",
      "what is your second address",
      "Hi! Please provide your subject preference information !!! what is your course name to which your subject belongs ?.",
      "Select your prefrence Subject name",
      "what is your prefrence",
      "add your score in presentage",
      "Hii !!! Please choose your hobbies",
      "Select your known language",
      "proficiency of your Selected language (Ex. witre ,read, both)",
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
      setMessages([
        { text: initialQuestions[currentSection][0], type: "question" },
      ]);
    }
    getData("/institution/list")
      .then(async (response: any) => {
        if (response.status === 200) {
          console.log(response);
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
          console.log(response);
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
    }
  }, [messages]);

  const saveAnswersforBasic = (answers: string[]) => {
    const fullName = answers[0];
    let nameParts: string[] = fullName.split(" ");
    const firstname = nameParts[0];
    const lastname = nameParts[1];
    let payload = {
      student_login_id: StudentId,
      first_name: firstname,
      last_name: lastname,
      gender: answers[1],
      dob: answers[2],
      father_name: answers[3],
      mother_name: answers[4],
      guardian_name: answers[5],
      pic_path: answers[7],
      aim: answers[6],
    };
    postData(`${"student/add"}`, payload)
      .then((data: any) => {
        if (data.status === 200) {
          const formData = new FormData();
          const nfile: any = uploadedFile;
          formData.append("file", nfile);

          postFileData(`${"upload_file/upload"}`, formData)
            .then((data: any) => {
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
                });
              }
            })
            .catch((e) => {
              toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
              });
            });

          toast.success("Basic information saved successfully", {
            hideProgressBar: true,
            theme: "colored",
          });
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

    console.log(payload);
  };

  const saveAnswersforContact = (answer: string[]) => {
    const contfullPhone = answer[8];
    let phoneNum = contfullPhone.split(" ");
    const contfullPhonewtsp = answer[9];
    let phoneNumwtsp = contfullPhonewtsp.split(" ");
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
          toast.success(data?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
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
    let addressParts = Address.split(",");

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
    console.log(payload);
    postData("/student_address/add", payload).then((response) => {
      if (response.status === 200) {
        toast.success("Address information saved successfully", {
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    });

    //console.log(payload);
  };

  const saveAnswersforacadmichistory = (answers: string[]) => {
    const payload = {
      student_id: StudentId,
      institution_id: selectedInstitute,
      course_id: selectCourse,
      starting_date: answers[13],
      ending_date: answers[14],
      learning_style: "any",
    };
    console.log(payload);
    postData("/student_academic_history/add", payload).then((response) => {
      if (response.status === 200) {
        toast.success("Academic hinstory information saved successfully", {
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    });
  };

  const saveAnswerforsubjectpreference = (answers: string[]) => {
    console.log(answers[15]);

    const payload = {
      student_id: StudentId,
      course_id: selectCourse,
      subject_id: selectSubject,
      preference: answers[24],
      score_in_percentage: answers[25],
    };
    postData("/subject_preference/add", payload).then((response) => {
      if (response.status === 200) {
        toast.success("Subject Preference information saved successfully", {
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    });
    console.log(payload);
  };

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
        toast.success("Your hobbies saved successfully", {
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    });
    console.log(payload);
  };

  const saveAnswerForLanguage = (answers: string[]) => {
    const payload = {
      student_id: StudentId,
      language_id: selectedLanguage,
      proficiency: answers[28],
    };
    console.log(payload);
    postData("student_language_known/add", payload).then((response) => {
      if (response.status === 200) {
        toast.success("Your language saved successfully", {
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    });
  };

  const viewProfile = () => {
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
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
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
    console.log(e.target.files?.length);
  };

  let hitcount = 1;
  const handleDateChange = (newDate: Dayjs | null) => {
    // setBasicInfo((values) => ({ ...values, dob: newDate }));
    console.log(currentQuestionIndex);
    let datecheck: any = dayjs(newDate).format("DD/MM/YYYY");
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
          toast.error(
            "Date of joining should be less than to the starting date of academic course",
            {
              hideProgressBar: true,
              theme: "colored",
            }
          );
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
      console.log(datecheck);
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
          //
          saveAnswersforContact([...answers, e.currentTarget.value]);
        } else if (answers.length === 18) {
          saveAnswersforacadmichistory([...answers, e.currentTarget.value]);
        } else if (answers.length === 22) {
          saveAnswerforAddress([...answers, e.currentTarget.value]);
        } else if (answers.length === 26) {
          saveAnswerforsubjectpreference([...answers, e.currentTarget.value]);
        } else if (answers.length === 29) {
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

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
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
        } else {
          toast.error("Please enter valid 6 digit pincode", {
            hideProgressBar: true,
            theme: "colores",
          });
        }
      } else {
        answerSaveandGotoNextquestoin(e);
      }
    }
  };

  const handlePhoneChange = (value: string, country: any) => {
    setPhone(value);
    console.log(value);
    // Move to the next question
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
    console.log(selectedOption);
    if (selectedOption) {
      const states = State.getStatesOfCountry(selectedOption.value);
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
    console.log(selectedOption);
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

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h3>Add your information for better services</h3>
      </div>

      <div
        className="chat-box"
        ref={chatBoxRef}
        style={{
          height: "400px",
          float: "right",
          position: "relative",
          paddingBottom: "80px",
          overflow: "auto",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className="message-wrapper d-flex justify-content-start mb-3"
          >
            <div
              className={`message-bubble p-3 ${
                message.type === "question" ? "left" : "right"
              }`}
              style={{
                maxWidth: "100%",
                backgroundColor:
                  message.type === "question" ? "#f1f1f1" : "#cce5ff",
                color: message.type === "question" ? "#000" : "#004085",
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {currentSection && (
        <div className="fixed-bottom bg-light p-3" style={{ zIndex: 1000 }}>
          {currentQuestionIndex === 11 || currentQuestionIndex === 22 ? (
            <Select
              className="dropdown-wrapper"
              onChange={handleDropdownChangecourse}
              options={courseSelectOptions}
              placeholder="Select an option"
              menuPlacement="top"
            />
          ) : currentQuestionIndex === 8 ? (
            <PhoneInput
              country={"in"}
              value={phone}
              onChange={handlePhoneChange}
              inputProps={{
                name: "phone",
                required: true,
                autoFocus: true,
              }}
              enableSearch={true}
              disableDropdown={false}
              preferredCountries={["us", "in"]}
            />
          ) : currentQuestionIndex === 7 ? (
            <input
              type="file"
              className="form-control"
              onChange={handleFileUpload}
            />
          ) : currentQuestionIndex === 12 ? (
            <Select
              className="dropdown-wrapper"
              onChange={handleDropdownChangeInstitute}
              options={instituteSelectOptions}
              placeholder="Select an option"
              menuPlacement="top"
            />
          ) : currentQuestionIndex === 23 ? (
            <Select
              className="dropdown-wrapper"
              onChange={handleDropdownChangesubject}
              options={subjectOptions}
              placeholder="Select an option"
              menuPlacement="top"
            />
          ) : currentQuestionIndex === 2 ||
            currentQuestionIndex === 13 ||
            currentQuestionIndex === 14 ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                onChange={handleDateChange}
                disableFuture
                format="DD/MM/YYYY"
              />
            </LocalizationProvider>
          ) : currentQuestionIndex === 26 ? (
            <Select
              className="dropdown-wrapper"
              onChange={handleDropdownChangehobby}
              options={hobbyOptions}
              placeholder="Select an option"
              menuPlacement="top"
            />
          ) : currentQuestionIndex === 15 ? (
            <Select
              className="dropdown-wrapper"
              options={countryOptions}
              onChange={handleCountryChange}
              placeholder="Select a country"
              menuPlacement="top"
            />
          ) : currentQuestionIndex === 16 ? (
            <Select
              className="dropdown-wrapper"
              options={stateOptions}
              placeholder="Select a state"
              onChange={handleStateChange}
              isDisabled={!selectedCountry}
              menuPlacement="top"
            />
          ) : currentQuestionIndex === 27 ? (
            <Select
              className="dropdown-wrapper"
              onChange={handleDropdownChangelanguage}
              options={languageOptions}
              placeholder="Select an option"
              menuPlacement="top"
            />
          ) : currentQuestionIndex + 1 === initialQuestions.basic.length ? (
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
              placeholder="Type your answer and press Enter"
              value={answers[currentQuestionIndex] || ""}
              onChange={handleAnswerChange}
              onKeyPress={handleKeyPress}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default NewModule;
