/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useContext,
} from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import './stylechat.css'; // Import your CSS file
import useApi from '../../hooks/useAPI';
import glogo from '../../assets/img/logo-white.svg';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import { Button, FormControlLabel, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import { Country, State } from 'country-state-city';
import { QUERY_KEYS_STUDENT } from '../../utils/const';
import SendIcon from '@mui/icons-material/Send';
import NameContext from '../../Pages/Context/NameContext';
import {
  chatcalandericon,
  chatdatetext,
  chattextbgleft,
  chattextbgright,
  chattextleft,
  chattextright,
} from '../../utils/helpers';
import CloseIcon from '@mui/icons-material/Close';
import { ChatDialogClose } from './ChatDialogClose';
import { styled } from '@mui/material/styles';
import Course from '../../Pages/Course/Course';
import { Teacher } from '../../Pages/TeacherRgistrationForm';
//import { Initializable } from '@mui/x-charts/internals';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 28,
  padding: 8,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 20 20'><path fill='${encodeURIComponent(
          '#fff',
        )}' d='M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z'/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 24,
    height: 24,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 20 20'><path fill='${encodeURIComponent(
        '#fff',
      )}' d='M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z'/></svg>')`,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));

interface Institute {
  id: number;
  institution_id: string;
  institute_name: string;
  university_id: string;
  is_active: number;
  is_approve: boolean;
  entity_type?: string;
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
}> = ({ isOpen, onCancel }) => {
  // const handleClose: DialogProps['onClose'] = (event, reason) => {
  //   if (reason && reason === 'backdropClick') return;
  //   onCancel();
  // };

  const context = useContext(NameContext);
  const { namecolor, setNamecolor, setNamepro, setProImage }: any = context;
  const Student_uuid = localStorage.getItem('user_uuid');
  const usertype = localStorage.getItem('user_type');
  const { getData, postData, postFileData } = useApi();
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesAll, setCoursesAll] = useState<Course[]>([]);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentSection, setCurrentSection] = useState<string | null>('basic');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [error1, setError1] = useState('');
  // const [errordate, setErordate] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [messages, setMessages] = useState<
    { text: string; type: 'question' | 'answer' }[]
  >([{ text: 'What is your name?', type: 'question' }]);
  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);
  const [alllanguage, setAllLanguage] = useState<Language[]>([]);
  const [university, setUniversity] = useState<University[]>([]);
  const [semester, setSemester] = useState<Semester[]>([]);
  const [semesterpre, setSemesterpre] = useState<Semester[]>([]);
  const [teacherList, setTeacherList] = useState<Teacher[]>([]);
  //const [filteredTeacherList, setFilteredTeacherList] = useState<Teacher[]>([]);

  const [selectedHobby, setSelectedHobby] = useState<any>('');
  const [selectedLanguage, setSelectedLanguage] = useState<any>('');
  const [selectedproficiency, setSelectedproficiency] = useState<any>('');
  const [selectedgender, setSelectedgender] = useState<any>('');
  const [selectedInstitute, setSelectedInstitute] = useState<any>('');
  const [selectCourse, setSelectedCourse] = useState<any>('');
  const [selectUniversity, setSelectedUniversity] = useState<any>('');
  const [selectSemester, setSelectedSemester] = useState<any>('');
 // const [selectSubjectName, setSelectedSubjectName] = useState<any>('');
  const [selectTeacher, setSelectedTeacher] = useState<any>('');
  const [selectSemesterpre, setSelectedSemesterpre] = useState<any>('');
  const [selectSubject, setSelectedSubject] = useState<any>('');
  const [selectedInstituteType, setSelectedInstituteType] = useState<any>('');
  const [selectedBoard, setSelectedBoard] = useState<any>('');
  const [selectedAcademicState, setSelectedAcademicState] = useState<any>('');
  const [selectedClass, setSelectedClass] = useState<any>('');
  const [selectedStream, setSelectedStream] = useState<any>('');
  
  const [selectedLearningStyle, setSelectedLearningStyle] = useState<any>('');

  // const [selectedAcademicYear, setSelectedAcademicYear] = useState<any>('');

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
  const [checkChanges, setCheckChanges] = useState(false);

  const [filterdQuestions1, setFilterdQuestions1] = useState<{
    [key: string]: string[];
  }>({});

  // const [mobile, setMobile] = useState('');
  // const user_id = localStorage.getItem('userid');
  const isEmail = (id: any) => /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(id);

  // const [open, setOpen] = useState(true);

  const errordata = [
    'Please enter a valid full name only characters allowed.',
    '',
    'Please enter a Goal.',
    '',
    'Please enter a valid mother name only characters allowed.',
    'Please enter a valid father name only characters allowed.',
    "Please enter a valid guardian's name only characters allowed.",
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    'Mobile number should be 10 digits',
    'WhatsApp number should be 10 digits',
    '',
    '',
    '',
    'Please enter a valid preference only characters allowed.',
    'Please enter a valid percentage.',
    '',
    '',
    'Please enter a valid district name only characters allowed.',
    'Please enter a valid city name only characters allowed.',
    'Invalid Pincode. It must be 6 digits only.',
    'Please enter first address .',
    '',
  ];
  const profileURL = QUERY_KEYS_STUDENT.STUDENT_GET_PROFILE;
  const callAPI = async () => {
    if (usertype === 'student') {
      const user_id = localStorage.getItem('userid');

      if (!isEmail(user_id)) {
        // setMobile(user_id ? user_id : '');
      }

      getData(`${profileURL}/${Student_uuid}`)
        .then((data: any) => {
          if (data.status) {
            setAnsweredData(data.data);
            localStorage.setItem('register_num', data?.data?.register_num);
            if (data?.data?.academic_history?.institution_type === 'school') {
              getData(
                `/class/get/${data?.data?.academic_history?.class_id}`,
              ).then((response: any) => {
                if (response.status) {
                  setSelectedClass({
                    label: response.data.class_name,
                    value: response.data.class_id,
                  });
                }
              });
            }
          }
        })
        .catch(() => {
          // toast.error(e?.message, {
          //     hideProgressBar: true,
          //     theme: 'colored',
          //     });
        });
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

  useEffect(() => {
    if (isOpen) document.body.classList.add('test');
  }, [isOpen]);

  const initialQuestions: { [key: string]: string[] } = {
    basic: [
      'What is your full name?',
      'What is your DOB?',
      'What is your main learning goal or interest for visiting our application?',
      'What is your gender?',
      "What is your mother's name?",
      "What is your father's name?",
      "What is your guardian's name?",
      'Upload your profile picture',
      'Hi! Please provide your academic information! What is your institute type?',
      'Please select your school name',
      'Please select your board',
      'Please select your state',
      'Please select your class',
      'Please select your stream',
      'Please select your university',
      'Please select your institution',
      'Please select your course',
      'Please select your semester',
      'What is your learning style?',
      'Please select year',
      'Hi, Please choose your hobbies',
      'Select your known language',
      'What is your proficiency in the selected language?',
      'Please select your mobile number country code',
      // 'What is your mobile number?',
      'What is your WhatsApp number?',
      'Hi, Please provide your subject preference information! what is your course name to which your subject belongs?',
      'Please select your semester ?',
      'Select your subject name',
      'What is your preference?',
      'Add your score in percentage',
      'Please select a teacher',
      'Please select your current country of residence',
      'Which state do you currently reside in?',
      'Which district do you currently live in?',
      'Which city do you live in?',
      'What is your Pin code?',
      'What is your first address?',
      'What is your second address?',
      'Thanks for providing your personal information',
    ],
  };

  const sectionOrder = ['basic'];
  const mapping: Mapping = {
    // Basic Info
    'What is your full name?': ['0', 'basic_info', 'first_name', 'last_name'],
    'What is your DOB?': ['1', 'basic_info', 'dob'],
    'What is your main learning goal or interest for visiting our application?':
      ['2', 'basic_info', 'aim'],
    'What is your gender?': ['3', 'basic_info', 'gender'],
    "What is your mother's name?": ['4', 'basic_info', 'mother_name'],
    "What is your father's name?": ['5', 'basic_info', 'father_name'],
    "What is your guardian's name?": ['6', 'basic_info', 'guardian_name'],
    'Upload your profile picture': ['7', 'basic_info', 'pic_path'],

    // Academic Information
    'Hi! Please provide your academic information! What is your institute type?':
      ['8', 'academic_history', 'institution_type'],
    // School-specific
    'Please select your board': ['9', 'academic_history', 'board'],
    'Please select your state': [
      '10',
      'academic_history',
      'state_for_stateboard',
    ], // This is for state board-specific question
    'Please select your class': ['11', 'academic_history', 'class_id'],
    'Please select your stream': ['12', 'academic_history', 'stream'],

    // College-specific
    'Please select your university': [
      '13',
      'academic_history',
      'university_id',
    ],
    'Please select your institution': [
      '14',
      'academic_history',
      'institution_name',
    ],
    'Please select your course': ['15', 'academic_history', 'course_id'],
    'Please select your semester': ['16', 'academic_history', 'sem_id'],
    'What is your learning style?': [
      '17',
      'academic_history',
      'learning_style',
    ],
    'Please select year': ['18', 'academic_history', 'year'],

    //Hobby
    'Hi, Please choose your hobbies': ['19', 'hobby', 'hobby_id'],

    //Language Known
    'Select your known language': ['20', 'language_known', 'language_id'],
    'What is your proficiency in the selected language?': [
      '21',
      'language_known',
      'proficiency',
    ],

    // Contact
    'Please select your mobile number country code': [
      '22',
      'contact',
      'mobile_isd_call',
      'mobile_isd_watsapp',
    ],
    'What is your mobile number?': ['23', 'contact', 'mobile_no_call'],
    'What is your WhatsApp number?': ['24', 'contact', 'mobile_no_watsapp'],

    //Subject
    'Hi, Please provide your subject preference information! what is your course name to which your subject belongs?':
      ['25', 'subject_preference', 'course_name'],
    'Please select your semester ': ['26', 'subject_preference', 'sem_id'],
    'Select your subject name': ['27', 'subject_preference', 'subject_name'],

    'What is your preference?': ['28', 'subject_preference', 'preference'],
    'Add your score in percentage': [
      '29',
      'subject_preference',
      'score_in_percentage',
    ],

    // Address
    'Please select your current country of residence': [
      '30',
      'address',
      'country',
    ],
    'Which state do you currently reside in?': ['31', 'address', 'state'],
    'Which district do you currently live in?': ['32', 'address', 'district'],
    'Which city do you live in?': ['33', 'address', 'city'],
    'What is your Pin code?': ['34', 'address', 'pincode'],
    'What is your first address?': ['35', 'address', 'address1'],
    'What is your second address?': ['36', 'address', 'address2'],
  };

  const getSubject = async () => {
    if (answeredData?.academic_history?.institution_type === 'school') {
      getData('school_subject/list')
        .then((response: any) => {
          if (response.status) {
            if (answeredData?.academic_history?.class_id) {
              const filteredData = response?.data?.subjects_data?.filter(
                (item: any) =>
                  item?.is_active &&
                  item?.class_id === answeredData?.academic_history?.class_id &&
                  (answeredData?.academic_history?.stream
                    ? item.stream == answeredData?.academic_history?.stream
                    : true)
              );
              setSubjects(filteredData || []);
            } else {
              const filteredData = response?.data?.filter(
                (item: any) => item?.is_active,
              );
              setSubjects(filteredData || []);
            }
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        });
    } else {
      getData('college_subject/list')
        .then((response: any) => {
          if (response.status) {
            const filteredData = response?.data?.subjects_data?.filter(
              (item: any) =>
                item?.is_active &&
                item.course_id === answeredData?.academic_history?.course_id &&
                item.semester_id === answeredData?.academic_history?.sem_id,
            );
            setSubjects(filteredData || []);
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        });
    }
  };
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const filteredQuestions = initialQuestions;
  useEffect(() => {
    if (usertype === 'student') {
      setAnswers([]);
      if (currentSection) {
        const fetchProfileData = async () => {
          try {
            const data = await getData(`${profileURL}/${Student_uuid}`);
            if (data.status) {
              setAnsweredData(data.data);
              localStorage.setItem('student_id', data?.data?.basic_info?.id);
              // Get the values from the fetched data
              const guardianName = data?.data?.basic_info?.father_name || '';
              const subjectPref =
                data?.data?.subject_preference?.score_in_percentage || '';
              const contact = data?.data?.contact?.mobile_no_call || '';
              const language = data?.data?.language_known?.language_id || '';
              const hobby = data?.data?.hobby?.hobby_id || '';
              const instituteType =
                data?.data?.academic_history?.institution_type || '';
              const address = data?.data?.address?.address1 || '';
              if (guardianName) {
                filteredQuestions.basic = filteredQuestions.basic.filter(
                  (_, index) => index > 7,
                );
              }
              if (instituteType) {
                // Skip institution type-related questions
                if (instituteType === 'school') {
                  setSelectedStream(data?.data?.academic_history?.stream ? data?.data?.academic_history?.stream : 'general');
                  const questionsToRemove = [
                    'Hi! Please provide your academic information! What is your institute type?',
                    'Please select your school name',
                    'Please select your board',
                    'Please select your state',
                    'Please select your class',
                    'Please select your stream',
                    'Please select your university',
                    'Please select your institution',
                    'Please select your course',
                    'Please select your semester',
                    'Hi, Please provide your subject preference information! what is your course name to which your subject belongs?',
                    'What is your learning style?',
                    'Please select year',
                    'Please select your semester ?',
                  ];
                  filteredQuestions.basic = filteredQuestions.basic.filter(
                    (question) => !questionsToRemove.includes(question),
                  );
                } else {
                  setSelectedCourse(data?.data?.academic_history?.course_id);
                  const questionsToRemove = [
                    'Hi! Please provide your academic information! What is your institute type?',
                    'Please select your school name',
                    'Please select your board',
                    'Please select your state',
                    'Please select your class',
                    'Please select your stream',
                    'Please select your university',
                    'Please select your institution',
                    'Please select your course',
                    'Please select your semester',
                    'What is your learning style?',
                    'Please select year',
                    'Select your subject name',
                  ];
                  filteredQuestions.basic = filteredQuestions.basic.filter(
                    (question) => !questionsToRemove.includes(question),
                  );
                }
                setSelectedInstituteType(instituteType);
              }
              if (hobby) {
                filteredQuestions.basic = filteredQuestions.basic.filter(
                  (question) => question !== 'Hi, Please choose your hobbies',
                );
              }
              if (language) {
                filteredQuestions.basic = filteredQuestions.basic.filter(
                  (question) =>
                    ![
                      'Select your known language',
                      'What is your proficiency in the selected language?',
                    ].includes(question),
                );
              }
              if (contact) {
                filteredQuestions.basic = filteredQuestions.basic.filter(
                  (question) =>
                    ![
                      'What is your WhatsApp number?',
                      'What is your mobile number?',
                      'Please select your mobile number country code',
                    ].includes(question),
                );
              }
              if (subjectPref) {
                filteredQuestions.basic = filteredQuestions.basic.filter(
                  (question) =>
                    ![
                      'Add your score in percentage',
                      'What is your preference?',
                      'Select your subject name',
                      'Please select a teacher',
                      'Hi, Please provide your subject preference information! what is your course name to which your subject belongs?',
                      'Please select your semester ?',
                    ].includes(question),
                );
              }
              if (address) {
                filteredQuestions.basic = filteredQuestions.basic.filter(
                  (question) =>
                    ![
                      'Please select your current country of residence',
                      'Which state do you currently reside in?',
                      'Which district do you currently live in?',
                      'Which city do you live in?',
                      'What is your Pin code?',
                      'What is your first address?',
                      'What is your second address?',
                    ].includes(question),
                );
              }
            }

            setFilterdQuestions1(filteredQuestions);
            // Update state after filtering
            // const firstQuestionIndex = Number(mapping[filteredQuestions.basic?.[0]]?.[0]);
            setCurrentQuestionIndex(0);
            setMessages([{ text: filteredQuestions.basic[0], type: 'question' }]);
          } catch (error) {
            console.error('Error fetching profile data:', error);
          }
        };

        fetchProfileData();

        setCurrentQuestionIndex(
          Number(mapping[filteredQuestions.basic?.[0]]?.[0]),
        );
        setMessages([{ text: filteredQuestions.basic[0], type: 'question' }]);
      }

      getData('/class/list')
        .then((response: any) => {
          if (response.status) {
            const filteredData = response?.data?.classes_data?.filter(
              (item: any) => item?.is_active,
            );
            setClasses(filteredData || []);
          }
        })
        .catch((error) => {
          toast.error(error?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
      getData('/university/list')
        .then(async (response: any) => {
          if (response.status) {
            const filteredData = await response?.data?.universities_data?.filter(
              (item: any) => item?.is_active,
            );
            setUniversity(filteredData || []);
          }
        })
        .catch((error) => {
          toast.error(error?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
      getData('/semester/list')
        .then(async (response: any) => {
          if (response.status) {
            const filteredData = await response?.data?.semesters_data?.filter(
              (item: any) => item?.is_active,
            );
            setSemester(filteredData || []);
            setSemesterpre(filteredData || []);
          }
        })
        .catch((error) => {
          toast.error(error?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
      getData('/institute/list')
        .then(async (response: any) => {
          if (response.status) {
            const filteredData = await response?.data?.filter(
              (item: any) => item?.is_active && item.is_approve,
            );
            setInstitutes(filteredData || []);
          }
        })
        .catch((error) => {
          toast.error(error?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });

      getData('/course/list')
        .then((response: any) => {
          if (response.status) {
            const filteredData = response?.data?.course_data?.filter(
              (item: any) => item?.is_active,
            );
            setCourses(filteredData || []);
            setCoursesAll(filteredData || []);
          }
        })
        .catch((error) => {
          toast.error(error?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });

      getData('hobby/list')
        .then((data: any) => {
          if (data?.status) {
            const filteredData = data?.data?.hobby_data?.filter(
              (item: any) => item?.is_active,
            );
            setAllHobbies(filteredData || []);
            // setAllHobbies(data?.data);
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });

      getData('language/list')
        .then((data: any) => {
          if (data?.status) {
            const filteredData = data?.data?.languagees_data?.filter(
              (item: any) => item?.is_active,
            );
            setAllLanguage(filteredData || []);
            // setAllLanguage(data?.data);
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });

      getSubject();
    }
  }, [currentSection, isOpen]);

  const getTeahcersList = (subject:any) => {
    const student_id=localStorage.getItem('student_id')
    if(student_id){
      getData(`/teacher/teachers_list_for_student/${student_id}`).then((data) => {
        if (data.status) {
          console.log(data.data);
          const filteredTeacher = data.data?.teachers?.filter((teacher:any) =>
            teacher?.subject_list?.includes(subject)
          );
            setTeacherList(filteredTeacher);
        }
      }).catch((error) => {
        toast.error(error.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center'
        })
      })
    }
  
  }
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
    if (typeof dateStr === 'string') {
      // Check if the date string is in DD/MM/YYYY format
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        // Create a new Date object using year, month (0-indexed), and day
        const date = new Date(year, month - 1, day);
        if (isNaN(date.getTime())) {
          return null;
        }
        return date.toISOString();
      } else {
        return null;
      }
    }

    // If dateStr is already a Date object or a number, use it directly
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString();
  };

  const saveAnswersforBasic = async  (answers: string[]) => {
    const birthdate: any = parseDate(answers[1]);
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

      // Format as 'yyyy-mm-ddThh:mm:ss.sssZ'
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    }
    const formattedDate = formatDateToISO(birthdateObj);

    const fullName = answers?.[0];
    const nameParts: string[] = fullName?.split(' ');
    const firstname = nameParts?.[0];
    const lastname = nameParts?.[1];
    const email = localStorage.getItem('email');
    const phone = localStorage.getItem('phone');
    const formData = new FormData();
    const nfile: any = uploadedFile;
    formData.append('file', nfile)
    let img_res: string = '';
    if (formData.has('file')) {
      try {
        const data: any = await postFileData("upload_file/upload", formData);
    
        if (data?.status) {
          setProImage(data?.data?.url);
          const fileUrl = data?.data?.url;
          const fileName = fileUrl ? fileUrl?.split('/').pop() : null;
          img_res = fileName // ✅ Now img_res is updated correctly
        }
      } catch (error) {
        console.error("File upload failed", error);
      }
    }

    const payload = {
      user_uuid: Student_uuid,
      first_name: answeredData?.basic_info?.first_name || firstname,
      last_name: answeredData?.basic_info?.last_name || lastname,
      // gender: answers[1],
      gender: answeredData?.basic_info?.gender || answers[3] || selectedgender,
      dob: answeredData?.basic_info?.dob || formattedDate,
      father_name: answeredData?.basic_info?.father_name || answers[5],
      mother_name: answeredData?.basic_info?.mother_name || answers[4],
      guardian_name:
        answeredData?.basic_info?.guardian_name || answers[6] || '',
      aim: answeredData?.basic_info?.aim || answers[2],
      pic_path: img_res|| answeredData?.basic_info?.pic_path || answers[7],
      email: email,
      phone: phone
    };

    postData(`${'student/add'}`, payload)
      .then((data: any) => {
        if (data.status) {
          // toast.success(data?.message, {
          //   hideProgressBar: true,
          //   theme: 'colored',
          // });
          callAPI();
          localStorage.setItem('student_id', data?.data?.id);
          setNamepro(data?.first_name);
          const formData = new FormData();
          const nfile: any = uploadedFile;
          formData.append('file', nfile);

        } else {
          toast.error(data?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const saveAnswersforContact = (answer: string[]) => {
    // const contfullPhone = answer[20];
    // let phoneNum = contfullPhone?.split(' ');
    // const contfullPhonewtsp = answer[21];
    // let phoneNumwtsp = contfullPhonewtsp?.split(' ');
    const email = localStorage.getItem('email');
    const payload = {
      student_id: localStorage.getItem('student_id'),
      mobile_isd_call: answeredData?.contact?.mobile_isd_call || phone,
      mobile_no_call: localStorage.getItem('register_num'),

      mobile_isd_watsapp: answeredData?.contact?.mobile_isd_watsapp || phone,
      mobile_no_watsapp:
        answeredData?.contact?.mobile_no_watsapp ||
          answer[answer.length - 1] === ''
          ? answer[answer.length - 1]
          : answer[answer.length - 2],

      email_id: answeredData?.contact?.email_id || email,
    } as any;
    const formData = new FormData();


    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    postData(`${'student_contact/add'}`, payload)
      .then((data: any) => {
        if (data?.status) {
          // toast.success(data?.message, {
          //   hideProgressBar: true,
          //   theme: 'colored',
          // });
        } else {
          toast.error(data?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const saveAnswerforAddress = (answers: string[]) => {
    const payload = {
      student_id: localStorage.getItem('student_id'),

      address1:
        answeredData?.address?.address1 || answers[answers.length - 1] === ''
          ? answers[answers.length - 2]
          : answers[answers.length - 3],
      address2: answeredData?.address?.address2 || answers[answers.length - 1],
      country:
        answeredData?.address?.country || answers[answers.length - 1] === ''
          ? answers[answers.length - 7]
          : answers[answers.length - 8],
      state:
        answeredData?.address?.state || answers[answers.length - 1] === ''
          ? answers[answers.length - 6]
          : answers[answers.length - 7],
      district:
        answeredData?.address?.district || answers[answers.length - 1] === ''
          ? answers[answers.length - 5]
          : answers[answers.length - 6],
      city:
        answeredData?.address?.city || answers[answers.length - 1] === ''
          ? answers[answers.length - 4]
          : answers[answers.length - 5],
      pincode:
        answeredData?.address?.pincode || answers[answers.length - 1] === ''
          ? answers[answers.length - 3]
          : answers[answers.length - 4],

      address_type: 'current',
    };

    postData('/student_address/add', payload).then((response) => {
      if (response.status) {
        // toast.success('Address information saved successfully', {
        //   hideProgressBar: true,
        //   theme: 'colored',
        // });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      }
    });
  };

  const saveAnswersforacadmichistory = (answers: string[]) => {
    const length = answers.length;
    const classname = classes.find(
      (item) =>
        String(item.id) === String(answers[answers.length - 1]) ||
        String(item.id) === String(answers[answers.length - 2]),
    )?.class_name;
    const selectedInstituteTypeLower = selectedInstituteType?.toLowerCase();
    const payload = {
      student_id: localStorage.getItem('student_id'),
      ...(selectedInstituteType && {
        institution_type: selectedInstituteType,
      }),
      ...(selectedInstituteTypeLower === 'school' && {
        board: selectedBoard,
        ...(selectedAcademicState && {
          state_for_stateboard: selectedAcademicState?.toLowerCase(),
        }),
        class_id:
          classname === 'class_11' || classname === 'class_12'
            ? answers[length - 2]?.toString()
            : answers[length - 1]?.toString(),
        // ...((classname === 'class_11' || classname === 'class_12') && {
        //   stream: answers[length - 1]
        // }),
          ...(classname === 'class_11' || classname === 'class_12'
            ? { stream: answers[length - 1] }
            : { stream: 'general' }) // Default to 'General' for other classes
        

      }),
      institute_id: selectedInstitute?.toString(),
      ...(selectedInstituteTypeLower === 'college' && {
        course_id: selectCourse?.toString(),
        learning_style: selectedLearningStyle,
        year: (answers[length - 1]
          ? dayjs(answers[length - 1], ['DD/MM/YYYY', 'YYYY'])?.year()?.toString()
          : ''),
        university_id: answers[answers.length - 6],
        sem_id: answers[length - 3],
      }),
    };
    postData('/new_student_academic_history/add', payload).then((response) => {
      if (response.status) {
        // toast.success('Academic hinstory information saved successfully', {
        //   hideProgressBar: true,
        //   theme: 'colored',
        // });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      }
    });
  };

  const saveAnswerforsubjectpreference = (answers: string[]) => {
    const length = answers.length;
    const payload = {
      student_id: localStorage.getItem('student_id'),
      subject_id: selectSubject,
      preference: answers[length - 3],
      score_in_percentage: answers[length - 2],
      ...((answeredData?.academic_history?.institution_type)?.toLowerCase() === 'school'&&
       { class_id:answeredData?.academic_history?.class_id || answers[11]}
      ),
      
      sem_id:
        selectedInstituteType?.toLowerCase() === 'college' ||
          answeredData?.academic_history?.institution_type === 'college'
          ? answers[length - 4]
          : null,
      ...((answeredData?.academic_history?.institution_type)?.toLowerCase()  === 'school' &&
        answeredData?.academic_history?.stream && {
        stream: answeredData?.academic_history?.stream || answers[12],
      }),
      ...((answeredData?.academic_history?.institution_type === 'college' ||
        selectedInstituteType?.toLowerCase() === 'college') && {
        course_id: answeredData?.academic_history?.course_id || selectCourse,
      }),
      teacher_id: answers[length - 1]
    };
    postData('/subject_preference/add', payload).then((response) => {
      if (response.status) {
        // toast.success('Subject Preference information saved successfully', {
        //   hideProgressBar: true,
        //   theme: 'colored',
        // });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      }
    });
  };
  const proficiency = [
    {
      lable: 'Read',
      value: 'read',
    },
    {
      lable: 'Write',
      value: 'write',
    },
    {
      lable: 'Both',
      value: 'both',
    },
  ];
  const gender = [
    {
      lable: 'Male',
      value: 'male',
    },
    {
      lable: 'Female',
      value: 'female',
    },
  ];
  const hobbyOptions = allHobbies?.map((option) => ({
    value: option.id,
    label: option.hobby_name,
  }));
  const courseSelectOptions = courses?.map((option) => ({
    value: option.id,
    label: option.course_name,
  }));
  const universitySelectOptions = university?.map((option) => ({
    value: option.id,
    label: option.university_name,
  }));

  const semesterSelectOptions = semester?.map((option) => ({
    value: option.semester_id,
    label: `Semester ${option?.semester_number}`,
  }));

  const teacherSelectOption = teacherList?.map((option) => ({
    value: option.id,
    label: `${option.first_name} ${option.last_name}`
  }));

  const semlable = semester?.filter(
    (item) => item?.semester_id === selectSemester,
  );
  const semesterSelectOptionspre = selectSemester
    ? [
      {
        value: selectSemester,
        label: `Semester ${semlable[0]?.semester_number}`,
      },
    ]
    : semesterpre[0]?.semester_id
      ? [
        {
          value: semesterpre[0]?.semester_id,
          label: `Semester ${semesterpre[0]?.semester_number}`,
        },
      ]
      : [];


  const instituteSelectOptions = institutes.map((option) => ({
    value: option.id,
    label: option.institute_name,
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
      label: 'School',
      value: 'school',
    },
    {
      label: 'College',
      value: 'college',
    },
  ];
  const boardOptions = [
    {
      label: 'CBSE',
      value: 'cbse',
    },
    {
      label: 'ICSE',
      value: 'icse',
    },
    {
      label: 'State Board',
      value: 'state_board',
    },
  ];
  const learningStyleOptions = [
    {
      label: 'Online',
      value: 'online',
    },
    {
      label: 'Offline',
      value: 'offline',
    },
    {
      label: 'Any',
      value: 'any',
    },
  ];
  const streamOptions = [
    {
      label: 'Science',
      value: 'science',
    },
    {
      label: 'Commerce',
      value: 'commerce',
    },
    {
      label: 'Arts',
      value: 'arts',
    },
  ];
  useEffect(() => {
    if (courceforpref) {
      if (
        answers[8] === 'school' ||
        answeredData?.academic_history?.institution_type === 'school'
      ) {
        setCourses(coursesAll);
      } else {
        const filteredCourse = courses?.filter(
          (item) =>
            (item?.institution_id ===
              answeredData?.academic_history?.institute_id &&
              item.id === answeredData?.academic_history?.course_id) ||
            (item?.institution_name === answers[14] &&
              item.course_name === answers[15]),
        );
        setCourses(filteredCourse);
      }
    }
  }, [currentQuestionIndex, answeredData, selectedInstitute]);

  const academicStateOptions = State.getStatesOfCountry('IN').map(
    (state: any) => ({
      value: state.isoCode,
      label: state.name,
    }),
  );

  const saveanswerForHobbeis = () => {
    const payload = {
      student_id: localStorage.getItem('student_id'),
      hobby_id: answeredData?.hobby?.hobby_id || selectedHobby,
    };

    if (selectedHobby) {
      postData('student_hobby/add', payload).then((response) => {
        if (response.status) {
          // toast.success('Your hobbies saved successfully', {
          //   hideProgressBar: true,
          //   theme: 'colored',
          // });
        } else {
          // toast.error(response?.message, {
          //   hideProgressBar: true,
          //   theme: 'colored',
          // });
        }
      });
    }
  };

  const saveAnswerForLanguage = () => {
    const payload = {
      student_id: localStorage.getItem('student_id'),
      language_id:
        answeredData?.language_known?.language_id || selectedLanguage,
      proficiency:
        answeredData?.language_known?.proficiency || selectedproficiency,
    };
    postData('student_language_known/add', payload).then((response) => {
      if (response.status) {
        // toast.success('Your language saved successfully', {
        //   hideProgressBar: true,
        //   theme: 'colored',
        // });
      } else {
        toast.error(response?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      }
    });
  };

  const viewProfile = () => {
    toast.success('Your profile saved successfully', {
      hideProgressBar: true,
      theme: 'colored',
    });
    onCancel();
    navigate('/main/StudentProfile');
  };

  const proceedToNextSection = (currentSection: string) => {
    const nextSection = sectionOrder[sectionOrder.indexOf(currentSection) + 1];
    if (nextSection) {
      setMessages([
        ...messages,
        {
          text: `Do you want to add ${nextSection} information?`,
          type: 'question',
        },
      ]);
      setCurrentSection(null);
      setAnswers([]);
    } else {
      alert('Thank you for completing the profile information!');
    }
  };

  const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedAnswers = [...answers];
    if (e.target.value === '') {
      // Remove the value if it's empty
      delete updatedAnswers[currentQuestionIndex];
      setCheckChanges(false);
    } else {
      // Otherwise, save the value
      updatedAnswers[currentQuestionIndex] = e.target.value;
      setCheckChanges(true);
    }
    const filteredAnswers = updatedAnswers.filter((item) => item !== undefined);

    setAnswers(filteredAnswers);
    if (fullnamequestion) {
      const fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
      if (!fullNameRegex.test(updatedAnswers[answers.length - 1])) {
        setFullName(true);
        return;
      } else {
        setFullName(false);
      }
    }
    if (gendercheck) {
      const gender = updatedAnswers[answers.length - 1].toLowerCase();
      if (gender !== 'male' && gender !== 'female') {
        // You can set an error state here if needed
        setGenderError(true);
        return;
      } else {
        setGenderError(false);
      }
    }
    if (maaname) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(updatedAnswers[answers.length - 1])) {
        setMotherNameError(true);
        return;
      } else {
        setMotherNameError(false);
      }
    }
    if (paaquestion) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(updatedAnswers[answers.length - 1])) {
        setFName(true);
        return;
      } else {
        setFName(false);
      }
    }

    if (guardianquestion) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(updatedAnswers[answers.length - 1])) {
        setgName(true);
        return;
      } else {
        setgName(false);
      }
    }
    if (mobilequestion) {
      // Regular expression for exactly 10 digits
      const phoneRegex = /^(?!0{10})[0-9]{10}$/;

      if (!phoneRegex.test(updatedAnswers[answers.length - 1])) {
        setphnumber(true);
        return;
      } else {
        setphnumber(false);
      }
    }
    if (whatsappnumbet) {
      // Regular expression for exactly 10 digits
      const phoneRegex = /^(?!0{10})[0-9]{10}$/;
      if (!phoneRegex.test(updatedAnswers[answers.length - 1])) {
        setphnumber(true);
        return;
      } else {
        setphnumber(false);
      }
    }
    if (districtquestion) {
      // Regular expression for exactly 10 digits
      const disticRegex = /^[a-zA-Z\s]+$/;

      if (!disticRegex.test(updatedAnswers[answers.length - 1])) {
        setdisct(true);
        return;
      } else {
        setdisct(false);
      }
    }
    if (statelist) {
      const disticRegex = /^[a-zA-Z\s]+$/;

      if (!disticRegex.test(updatedAnswers[answers.length - 1])) {
        setdisct(true);
        return;
      } else {
        setdisct(false);
      }
    }
    if (cityquestion) {
      const disticRegex = /^[a-zA-Z\s]+$/;

      if (!disticRegex.test(updatedAnswers[answers.length - 1])) {
        setcity(true);
        return;
      } else {
        setcity(false);
      }
    }
    if (pincodequestion) {
      const pincodeRegex = /^(?!0{6})[0-9]{6}$/;

      if (!pincodeRegex.test(updatedAnswers[answers.length - 1])) {
        // setpincode(true);
        setpincode(true);
        setError1('');
      } else {
        // setpincode(false);
        setpincode(false); // Clear the error if valid
        setError1('');
      }
    }
    if (preferencequestion) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(updatedAnswers[answers.length - 1])) {
        setpreferenceError(true);
        return;
      } else {
        setpreferenceError(false);
      }
    }
    if (scorequestion) {
      // Regular expression for exactly 6 digits (adjust the length as per your requirement)
      const regex = /^(100(\.0{1,2})?|[0-9]?[0-9](\.[0-9]{1,2})?)$/;

      if (!regex.test(updatedAnswers[answers.length - 1])) {
        setper(true);
        return;
      } else {
        setper(false);
      }
    }
    if (firstaddressquestion) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null
      ) {
        setFirstAddress(true);
      } else {
        setFirstAddress(false);
      }
    }

    if (secondaddressquestion) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null
      ) {
        setSecondAddress(true);
      } else {
        setSecondAddress(false);
      }
    }

    if (scorequestion) {
      // Regular expression for exactly 6 digits (adjust the length as per your requirement)
      const regex = /^(100(\.0{1,2})?|[0-9]?[0-9](\.[0-9]{1,2})?)$/;

      if (!regex.test(updatedAnswers[answers.length - 1])) {
        setper(true);
        return;
      } else {
        setper(false);
      }
    }
  };
  const handleSkip = () => {
    setError1('');
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: '', type: 'answer' as const },
    ];
    if (checkChanges) {
      delete answers[currentQuestionIndex];
      setphnumber(false);
    }
    if (whatsappnumbet) {
      setphnumber(false);
    }
    if (guardianquestion) {
      setgName(false);
    }

    const updatedAnswers = [...answers, ''];
    const filteredAnswers = updatedAnswers.filter((item) => item !== undefined);
    setAnswers(filteredAnswers);
    if (imagecheck) {
      saveAnswersforBasic([...answers]);
    }
    if (whatsappnumbet) {
      saveAnswersforContact([...filteredAnswers]);
    }
    if (secondaddressquestion) {
      saveAnswerforAddress([...filteredAnswers]);
    }

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
      if (file.size > 1024 * 1024) {
        setError1('File size must be less than 1MB');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError1('Only JPG and PNG files are allowed');
        return;
      }
      setError1('');
      setUploadedFile(e.target.files[0]);
      const updatedAnswers = [...answers];
      updatedAnswers[answers.length] = e.target.files[0].name; // Store the file name as answer

      setAnswers(updatedAnswers);
      const currentQuestions = filterdQuestions1['basic'];
      const updatedMessages = [
        ...messages,
        { text: e.target.files[0].name, type: 'answer' as const },
      ];

      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setMessages([
          ...updatedMessages,
          {
            text: currentQuestions[currentQuestionIndex + 1],
            type: 'question' as const,
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
    if (yearquesiton) {
      datecheck = dayjs(datecheck).format('YYYY');
    }
    if (datecheck) {
      const updatedAnswers = [...answers];
      updatedAnswers[answers.length] = datecheck;
      setAnswers(updatedAnswers);
      if (yearquesiton) {
        saveAnswersforacadmichistory(updatedAnswers);
      }

      const currentQuestions = filterdQuestions1['basic'];
      const updatedMessages = [
        ...messages,
        { text: datecheck, type: 'answer' as const },
      ];

      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setMessages([
          ...updatedMessages,
          {
            text: currentQuestions[currentQuestionIndex + 1],
            type: 'question' as const,
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
    // setErordate('')

    datecheck = dayjs(newDate).format(yearquesiton ? 'YYYY' : 'DD/MM/YYYY');

    if (hitcount === ++hitcount) {
      if (currentQuestionIndex === 11) {
        if (datecheck > answers[10]) {
          const updatedAnswers = [...answers];
          updatedAnswers[answers.length] = datecheck;
          setAnswers(updatedAnswers);
          const currentQuestions = filterdQuestions1['basic'];
          const updatedMessages = [
            ...messages,
            { text: datecheck, type: 'answer' as const },
          ];

          if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setMessages([
              ...updatedMessages,
              {
                text: currentQuestions[currentQuestionIndex + 1],
                type: 'question' as const,
              },
            ]);
          } else {
            setMessages(updatedMessages);
            //proceedToNextSection(currentSection!);
            setCurrentQuestionIndex(0);
          }
        } else {
          // setErordate('The course completion date cannot be earlier than the date of joining.')
          // toast.error(
          //   'Date of joining should be less than to the starting date of academic course',
          //   {
          //     hideProgressBar: true,
          //     theme: 'colored',
          //   }
          // );
        }
      } else {
        const updatedAnswers = [...answers];
        updatedAnswers[answers.length] = datecheck;
        setAnswers(updatedAnswers);
        const currentQuestions = filterdQuestions1['basic'];
        const updatedMessages = [
          ...messages,
          { text: datecheck, type: 'answer' as const },
        ];

        if (currentQuestionIndex < currentQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setMessages([
            ...updatedMessages,
            {
              text: currentQuestions[currentQuestionIndex + 1],
              type: 'question' as const,
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
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    const currentQuestions = filterdQuestions1['basic'];

    if (answers[currentQuestionIndex]?.trim() !== '') {
      const updatedMessages = [
        ...messages,
        { text: answers[currentQuestionIndex], type: 'answer' as const },
      ];

      if (currentQuestionIndex < currentQuestions.length - 1) {
        // if (
        //   (answers[8]?.toLowerCase() === 'school' ||
        //     answeredData?.academic_history?.institution_type === 'school') &&
        //   currentQuestionIndex === 24
        // ) {
        //   setCurrentQuestionIndex(27);
        // } else {
        //   setCurrentQuestionIndex(currentQuestionIndex + 1);
        // }
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        // setMessages([
        //   ...updatedMessages,
        //   {
        //     text:
        //       (answers[8]?.toLowerCase() === 'school' ||
        //         answeredData?.academic_history?.institution_type ===
        //         'school') &&
        //         currentQuestionIndex === 24
        //         ? currentQuestions[27]
        //         : currentQuestions[currentQuestionIndex + 1],
        //     type: 'question' as const,
        //   },
        // ]);
        setMessages([
          ...updatedMessages,
          {
            text: currentQuestions[currentQuestionIndex + 1],
            type: 'question' as const,
          },
        ]);

        if (whatsappnumbet) {
          saveAnswersforContact([...answers, e.currentTarget.value]);
        }
        else if (secondaddressquestion)
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
        } else if (selectedproficiency !== '') {
          // saveanswerForHobbeis([...answers, e.currentTarget.value]);
          // saveAnswerForLanguage([...answers, e.currentTarget.value]);
        }
      } else {
        setMessages(updatedMessages);
        //proceedToNextSection(currentSection!);
        setCurrentQuestionIndex(0);
      }
    }
  };
  useEffect(() => {
    if (selectedproficiency !== '') {
      if (selectedHobby !== '') {
        saveanswerForHobbeis();
      }
      saveAnswerForLanguage();
    }
  }, [selectedproficiency]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    const charecterRegex = /^[a-zA-Z\s]+$/;
    const regex = /^(100(\.0{1,2})?|[0-9]?[0-9](\.[0-9]{1,2})?)$/;

    const updatedAnswers = [...answers];
    if (fullnamequestion) {
      const fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
      if (!fullNameRegex.test(updatedAnswers[answers.length - 1])) {
        setFullName(true);
        return;
      } else {
        setFullName(false);
      }
    }

    if (aimquestoin) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !charecterRegex.test(updatedAnswers[answers.length - 1])
      ) {
        setGoal(true);
        return;
      } else {
        setGoal(false);
      }
    }
    if (maaname) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !charecterRegex.test(updatedAnswers[answers.length - 1]) ||
        !checkChanges
      ) {
        setMotherNameError(true);
        return;
      } else {
        setMotherNameError(false);
      }
    }
    if (paaquestion) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !charecterRegex.test(updatedAnswers[answers.length - 1]) ||
        !checkChanges
      ) {
        setFName(true);
        return;
      } else {
        setFName(false);
      }
    }
    if (guardianquestion) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !charecterRegex.test(updatedAnswers[answers.length - 1]) ||
        !checkChanges
      ) {
        setgName(true);
        return;
      } else {
        setgName(false);
      }
    }

    if (gendercheck) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !charecterRegex.test(updatedAnswers[answers.length - 1])
      ) {
        setGenderError(true);
        return;
      } else {
        setGenderError(false);
      }
    }
    if (mobilequestion) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !/^(?!0{10})[0-9]{10}$/.test(updatedAnswers[answers.length - 1]) ||
        !checkChanges
      ) {
        setphnumber(true);
        return;
      } else {
        setphnumber(false);
      }
    }

    if (whatsappnumbet) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !/^(?!0{10})[0-9]{10}$/.test(updatedAnswers[answers.length - 1]) ||
        !checkChanges
      ) {
        setphnumber(true);
        return;
      } else {
        setphnumber(false);
      }
    }
    if (preferencequestion) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !charecterRegex.test(updatedAnswers[answers.length - 1]) ||
        !checkChanges
      ) {
        setpreferenceError(true);
        return;
      } else {
        setpreferenceError(false);
      }
    }

    if (scorequestion) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !regex.test(updatedAnswers[answers.length - 1]) ||
        !checkChanges
      ) {
        setper(true);
        return;
      } else {
        setper(false);
      }
    }

    if (statelist) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !charecterRegex.test(updatedAnswers[answers.length - 1]) ||
        !checkChanges
      ) {
        setdisct(true);
        return;
      } else {
        setdisct(false);
      }
    }
    if (districtquestion) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !charecterRegex.test(updatedAnswers[answers.length - 1]) ||
        !checkChanges
      ) {
        setdisct(true);
        return;
      } else {
        setdisct(false);
      }
    }
    if (cityquestion) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !charecterRegex.test(updatedAnswers[answers.length - 1]) ||
        !checkChanges
      ) {
        setcity(true);
        return;
      } else {
        setcity(false);
      }
    }
    if (secondaddressquestion) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !checkChanges
      ) {
        setSecondAddress(true);
        return;
      } else {
        setSecondAddress(false);
      }
    }
    if (firstaddressquestion) {
      if (
        updatedAnswers[answers.length - 1] === '' ||
        updatedAnswers[answers.length - 1] == null ||
        !checkChanges
      ) {
        setFirstAddress(true);
        return;
      } else {
        setFirstAddress(false);
      }
    }

    if (e.key === 'Enter') {
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
        //errordate ||
        goal ||
        firstaddress ||
        secondaddress
      ) {
        return; // Stop further execution if full name validation fails
      }
      e.preventDefault();

      if (mobilequestion || whatsappnumbet) {
        if (answers[answers.length - 1]?.length === 10) {
          answerSaveandGotoNextquestoin(e);
        } else {
          toast.error('Please enter valid 10 digit mobile number', {
            hideProgressBar: true,
            theme: 'colored',
          });
        }
      } else if (pincodequestion) {
        if (answers[answers.length - 1]?.length === 6) {
          answerSaveandGotoNextquestoin(e);
          setError1('');
        } else {
          setError1('Please enter valid 6 digit pincode');
          // toast.error('Please enter valid 6 digit pincode', {
          //   hideProgressBar: true,
          //   theme: 'colores',
          // });
        }
      } else if (firstaddressquestion) {
        if (
          updatedAnswers[answers.length - 1] === '' ||
          updatedAnswers[answers.length - 1] == null
        ) {
          setFirstAddress(true);
        } else {
          setFirstAddress(false);
          answerSaveandGotoNextquestoin(e);
        }
      } else if (secondaddressquestion) {
        if (
          updatedAnswers[answers.length - 1] === '' ||
          updatedAnswers[answers.length - 1] == null
        ) {
          setSecondAddress(true);
        } else {
          setSecondAddress(false);
          answerSaveandGotoNextquestoin(e);
        }
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        answerSaveandGotoNextquestoin(e);
      }
    }
    setCheckChanges(false);
  };

  const handlePhoneChange = (value: string) => {
    setPhone('+' + value);
    const updatedAnswers = [...answers];
    updatedAnswers[answers.length] = '+' + value;
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: '+' + value, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
    updatedAnswers[answers.length] = e.label;
    setSelectedHobby(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
    updatedAnswers[answers.length] = e.label;
    setSelectedLanguage(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
    updatedAnswers[answers.length] = e.label;
    setSelectedproficiency(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
    updatedAnswers[answers.length] = e.label;
    setSelectedgender(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
    updatedAnswers[answers.length] = e.label;
    setSelectedInstituteType(e.value);
    setAnswers(updatedAnswers);
    let currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      if (e.value === 'school') {
        const questionsToRemove = [
          //'Please select your stream',
          'Please select your university',
          'Please select your institution',
          'Please select your course',
          'Please select your semester',
          'Please select your semester ?',
          'Hi, Please provide your subject preference information! what is your course name to which your subject belongs?',
          'What is your learning style?',
          'Please select year',
        ];

        filterdQuestions1['basic'] = filterdQuestions1['basic'].filter(
          (question) => !questionsToRemove.includes(question),
        );

        setCurrentQuestionIndex(currentQuestionIndex + 1);
        getData('school_subject/list')
          .then((response: any) => {
            if (response.status) {
              const filteredData = response?.data?.subjects_data?.filter(
                (item: any) => item?.is_active,
              );
              setSubjects(filteredData || []);
              // setSubjects(response.data);
              // setSubjectsAll(filteredData || [])
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
          });

        const filteredInstitution = institutes.filter(
          (item) =>
            item.is_active &&
            item.entity_type == 'school' &&
            item.is_approve == true,
        );
        setInstitutes(filteredInstitution);
      } else {
        const questionsToRemove = [
          'Please select your board',
          'Please select your state',
          'Please select your class',
          'Select your subject name',
          'Please select your stream',
          'Please select your school name'
        ];
        filterdQuestions1['basic'] = filterdQuestions1['basic'].filter(
          (question) => !questionsToRemove.includes(question),
        );
        currentQuestions = currentQuestions.filter(
          (question) => !questionsToRemove.includes(question),
        );

        getData('college_subject/list')
          .then((response: any) => {
            if (response.status) {
              const filteredData = response?.data?.subjects_data?.filter(
                (item: any) => item?.is_active,
              );
              setSubjects(filteredData || []);
              // setSubjects(response.data);
              // setSubjectsAll(filteredData || [])
            }
          })
          .catch((e) => {
            toast.error(e?.message, {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
          });
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }

      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[
            e.value === 'school'
              ? currentQuestionIndex + 1
              : currentQuestionIndex + 1
          ],
          type: 'question' as const,
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
    updatedAnswers[answers.length] = e.label;
    setSelectedBoard(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      if (e.value === 'state_board')
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      else {
        const questionsToRemove = ['Please select your state'];
        filterdQuestions1['basic'] = filterdQuestions1['basic'].filter(
          (question) => !questionsToRemove.includes(question),
        );
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }

      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[
            e.value === 'state_board'
              ? currentQuestionIndex + 1
              : currentQuestionIndex + 2
          ],
          type: 'question' as const,
        },
      ]);
    } else {
      setMessages(updatedMessages);
      //proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };
  const handleDropdownChangestream = (e: any) => {
    const filterData = subjects?.filter(
      (item: any) =>
        (item.class_id === answeredData?.academic_history?.class_id ||
          item.class_id === selectedClass.value) &&
        (item.stream === answeredData?.academic_history?.stream ||
          item.stream === e.value),
    );
    setSubjects(filterData);
    const updatedAnswers = [...answers];
    updatedAnswers[answers.length] = e.value;

    setSelectedStream(e.value);
    setAnswers(updatedAnswers);
    saveAnswersforacadmichistory(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.value, type: 'answer' as const },
    ];
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
    updatedAnswers[answers.length] = e.label;
    setSelectedAcademicState(e.label);
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
    updatedAnswers[answers.length] = e.value;
    setSelectedClass(e);
    setAnswers(updatedAnswers);
    if (e.label !== 'class_11' && e.label !== 'class_12') {
      const filterData = subjects?.filter(
        (item: any) =>
          item.class_id === answeredData?.academic_history?.class_id ||
          item.class_id === e.value,
      );

      setSubjects(filterData);

      if (e.value != 'class_11' || e.value != 'class_12') {
        saveAnswersforacadmichistory(updatedAnswers);
      }
    }
    let currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      if (e.label === 'class_11' || e.label === 'class_12') {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        const questionsToRemove = ['Please select your stream'];
        currentQuestions = currentQuestions.filter(
          (question) => !questionsToRemove.includes(question),
        );
        filterdQuestions1['basic'] = filterdQuestions1['basic'].filter(
          (question) => !questionsToRemove.includes(question),
        );

        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }

      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[
            e.label === 'class_11' || e.label === 'class_12'
              ? currentQuestionIndex + 1
              : currentQuestionIndex + 1
          ],
          type: 'question' as const,
        },
      ]);
    } else {
      setMessages(updatedMessages);
      // proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };
  const handleDropdownChangeLearningStyle = (e: any) => {
    const updatedAnswers = [...answers];
    updatedAnswers[answers.length] = e.label;
    setSelectedLearningStyle(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };

  const handleDropdownChangecourse = (e: any) => {
    const filteredsem = semester.filter((item) => item.course_id === e.value);
    // const filteredsempre = semesterpre.filter(
    //   (item) => (item.course_id === e.value && (item.semester_number === answeredData?.academic_history?.sem_id || item.semester_number === answers[16])));
    const filteredsempre = semesterpre.filter(
      (item) =>
        item.course_id === e.value &&
        (item.semester_id === answeredData?.academic_history?.sem_id ||
          item.semester_id === answers[16]),
    );
    setSemester(filteredsem);
    setSemesterpre(filteredsempre);

    const updatedAnswers = [...answers];
    updatedAnswers[answers.length] = e.label;
    setSelectedCourse(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
      (item) =>
        item.university_id === e.value &&
        item.is_active &&
        item.is_approve == true,
    );
    setInstitutes(filteredInstitution);
    const updatedAnswers = [...answers];
    updatedAnswers[answers.length] = e.value;
    setSelectedUniversity(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
    updatedAnswers[answers.length] = e.value;
    setSelectedSemester(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];
    const filterData = subjects?.filter(
      (item: any) =>
        item.course_id === answeredData?.academic_history?.course_id ||
        (selectCourse && item.semester_id === e.value),
    );

    setSubjects(filterData);
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  };

  const handleDropdownChangeTeacher = (e: any) => {
    const currentQuestions = filterdQuestions1['basic'];
    const updatedAnswers = [...answers];
    updatedAnswers[answers.length] = e.value;
    setSelectedTeacher(e.value);
    setAnswers(updatedAnswers);
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];
    if (teacherQuestion) saveAnswerforsubjectpreference(updatedAnswers);
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
        },
      ]);
    } else {
      setMessages(updatedMessages);
      proceedToNextSection(currentSection!);
      setCurrentQuestionIndex(0);
    }
  }
  const handleDropdownChangesemesterpre = (e: any) => {
    // const courses = courses.filter((item)=> item.course_name === answers[] )
    const filteredsubject = subjects.filter(
      (item) =>
        item.semester_id === e.value &&
        (item.course_id === answeredData?.academic_history?.course_id ||
          item.course_name === answers[15]),
    );
    setSubjects(filteredsubject);
    const updatedAnswers = [...answers];
    updatedAnswers[answers.length] = e.value;
    setSelectedSemesterpre(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
    updatedAnswers[answers.length] = e.label;
    setSelectedSubject(e.value);
   // setSelectedSubjectName(e.label)
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];
   
    getTeahcersList(e.label);
    
    const filteredsempre = semesterpre.filter(
      (item) =>
      (item.semester_id === answeredData?.academic_history?.sem_id
      )
    );

    setSemesterpre(filteredsempre);


    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
      (item) => item.institution_id === e.value,
    );

    setCourses(filteredcourse);
    const updatedAnswers = [...answers];
    updatedAnswers[answers.length] = e.label;
    setSelectedInstitute(e.value);
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: e.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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
    setSelectedCountry(selectedOption);
    if (selectedOption) {
      const states = State.getStatesOfCountry(selectedOption.value);
      const stateOptions = states.map((state: any) => ({
        value: state.isoCode,
        label: state.name,
      }));
      setStateOptions(stateOptions);
    } else {
      setStateOptions([]);
    }
    const updatedAnswers = [...answers];
    updatedAnswers[answers.length] = selectedOption.label;
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: selectedOption.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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

    updatedAnswers[answers.length] = selectedOption.label;
    setAnswers(updatedAnswers);
    const currentQuestions = filterdQuestions1['basic'];
    const updatedMessages = [
      ...messages,
      { text: selectedOption.label, type: 'answer' as const },
    ];

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMessages([
        ...updatedMessages,
        {
          text: currentQuestions[currentQuestionIndex + 1],
          type: 'question' as const,
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

    document?.documentElement?.setAttribute('data-bs-theme', themes);
    setNamecolor(themes);
    localStorage.setItem('theme', themes);
  };
  const handlecancel = () => {
    setclosemodel(false);
  };
  const handleok = () => {
    onCancel();
    setclosemodel(false);
    document.body.classList.remove('overflow-hidden');
    // navigate('/main/Dashboard');
  };
  // const handleOpen = () => {
  //   // setOpen(true);
  // };
  const getLastQuestion = () => {
    // Find the last message of type 'question'
    const lastQuestion = [...messages]
      .reverse() // Reverse to start searching from the end
      .find((message) => message.type === 'question');

    return lastQuestion?.text || ' '; // Return the text or null if no question found
  };
  const fullnamequestion = getLastQuestion() === 'What is your full name?';
  const maaname = getLastQuestion() == "What is your mother's name?";
  const aimquestoin =
    getLastQuestion() ==
    'What is your main learning goal or interest for visiting our application?';
  const paaquestion = getLastQuestion() === "What is your father's name?";
  const guardianquestion =
    getLastQuestion() === "What is your guardian's name?";
  const mobilequestion = getLastQuestion() === 'What is your mobile number?';
  const preferencequestion = getLastQuestion() === 'What is your preference?';
  const scorequestion = getLastQuestion() === 'Add your score in percentage';
  const districtquestion =
    getLastQuestion() === 'Which district do you currently live in?';
  const cityquestion = getLastQuestion() === 'Which city do you live in?';
  const pincodequestion = getLastQuestion() === 'What is your Pin code?';
  const firstaddressquestion =
    getLastQuestion() === 'What is your first address?';
  const secondaddressquestion =
    getLastQuestion() === 'What is your second address?';

  const isLastQuestionCourseSelection =
    getLastQuestion() === 'Please select your course';
  const courceforpref =
    getLastQuestion() ===
    'Hi, Please provide your subject preference information! what is your course name to which your subject belongs?';

  const questioncountrycode =
    getLastQuestion() === 'Please select your mobile number country code';
  const Dobcheck = getLastQuestion() == 'What is your DOB?';
  const gendercheck = getLastQuestion() == 'What is your gender?';
  const imagecheck = getLastQuestion() == 'Upload your profile picture';
  const insttypequestion =
    getLastQuestion() ==
    'Hi! Please provide your academic information! What is your institute type?';
  const boardcheck = getLastQuestion() == 'Please select your board';
  const statequestion = getLastQuestion() == 'Please select your state';
  const classquestion = getLastQuestion() == 'Please select your class';
  const stremquestion = getLastQuestion() == 'Please select your stream';
  const unversityquest = getLastQuestion() == 'Please select your university';
  const institutequestion =
    getLastQuestion() == 'Please select your institution';
  const semisterquestion = getLastQuestion() == 'Please select your semester';
  const semisterprepquestion =
    getLastQuestion() == 'Please select your semester ?';

  const schoolnameQuestion = getLastQuestion() == 'Please select your school name';
  const stylequestion = getLastQuestion() == 'What is your learning style?';
  const yearquesiton = getLastQuestion() == 'Please select year';
  const hobbyquestion = getLastQuestion() == 'Hi, Please choose your hobbies';
  const languagequestion = getLastQuestion() == 'Select your known language';
  const languagepref =
    getLastQuestion() == 'What is your proficiency in the selected language?';
  const subjectquestion = getLastQuestion() == 'Select your subject name';
  const whatsappnumbet = getLastQuestion() == 'What is your WhatsApp number?';
  //const subjectpref =getLastQuestion()=='What is your preference?';
  const countrylist =
    getLastQuestion() == 'Please select your current country of residence';
  const statelist =
    getLastQuestion() == 'Which state do you currently reside in?';
  const persentegequestion =
    getLastQuestion() == 'Add your score in percentage';
  const teacherQuestion = getLastQuestion() == 'Please select a teacher';
  const verylastquestion =
    getLastQuestion() == 'Thanks for providing your personal information';

  // if(mobilequestion && whatsappnumbet){
  //    setCurrentQuestionIndex(answers.length);
  // }
  const sixYearsAgo = dayjs()?.subtract(6, 'year');
  const maxSelectableDate = dayjs(sixYearsAgo);
  return (
    <>
      <div
        style={{ display: 'flex' }}
        id="freechatbox"
        className={`${!isOpen ? 'd-none' : ''} freechatbox`}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="profilechatinner">
          <div className="proheader">
            <div className="me-auto">
              {' '}
              <img src={glogo} width="20" alt="" /> Add your information <br />{' '}
              for better services
            </div>
            <FormControlLabel
              className="me-0"
              control={
                <MaterialUISwitch
                  sx={{ m: 0 }}
                  size="small"
                  checked={checked}
                  onChange={() => handleChange(checked ? 'light' : 'dark')}
                />
              }
              label=""
            />
            <IconButton onClick={() => setclosemodel(true)} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>

          <div className="afterheader">
            <div className="chat-box" ref={chatBoxRef}>
              {messages.map((message, index) => {
                if (message.text) {
                  return (
                    <div
                      key={index}
                      className={`message-wrapper d-flex mb-3 ${message.type === 'question'
                        ? 'justify-content-start'
                        : 'justify-content-end'
                        }`}
                    >
                      <div
                        className={`message-bubble p-3 ${message.type === 'question' ? 'left' : 'right'
                          }`}
                        style={{
                          maxWidth: '80%',
                          backgroundColor:
                            message.type === 'question'
                              ? chattextbgleft(namecolor)
                              : chattextbgright(namecolor),
                          color:
                            message.type === 'question'
                              ? chattextleft(namecolor)
                              : chattextright(namecolor),
                          borderRadius: '15px',
                          padding: '10px',
                          wordBreak: 'break-word',
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
              <div>
                <div className="chatinput-body">
                  {(fullName && fullnamequestion && (
                    <p className="error-text">{errordata[0]}</p>
                  )) ||
                    (goal && aimquestoin && (
                      <p className="error-text">{errordata[2]}</p>
                    )) ||
                    (motherNameError && maaname && (
                      <p className="error-text">{errordata[4]}</p>
                    )) ||
                    (fName && paaquestion && (
                      <p className="error-text">{errordata[5]}</p>
                    )) ||
                    (gName && guardianquestion && (
                      <p className="error-text">{errordata[6]}</p>
                    )) ||
                    (phnumber && mobilequestion && (
                      <p className="error-text">{errordata[23]}</p>
                    )) ||
                    (whatsappnumbet && phnumber && (
                      <p className="error-text">{errordata[24]}</p>
                    )) ||
                    (preferenceError && preferencequestion && (
                      <p className="error-text">{errordata[28]}</p>
                    )) ||
                    (per && persentegequestion && (
                      <p className="error-text">{errordata[29]}</p>
                    )) ||
                    (distic && districtquestion && (
                      <p className="error-text">{errordata[32]}</p>
                    )) ||
                    (city && cityquestion && (
                      <p className="error-text">{errordata[33]}</p>
                    )) ||
                    (pincode && pincodequestion && (
                      <p className="error-text">{errordata[34]}</p>
                    )) ||
                    (firstaddress && firstaddressquestion && (
                      <p className="error-text">{errordata[35]}</p>
                    )) ||
                    (secondaddress && secondaddressquestion && (
                      <p className="error-text">{errordata[36]}</p>
                    ))}

                  {error1 && (
                    <p
                      style={{
                        color: 'red',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                      }}
                    >
                      {error1}
                    </p>
                  )}
                  {isLastQuestionCourseSelection ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangecourse}
                      options={courseSelectOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectCourse}
                    />
                  ) : insttypequestion ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeInstituteType}
                      options={institutionTypeOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedInstituteType}
                    />
                  ) : questioncountrycode ? (
                    <PhoneInput
                      country={''}
                      value={phone}
                      onChange={handlePhoneChange}
                      inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: true,
                        readOnly: true,
                      }}
                      inputStyle={{
                        color: 'black',
                      }}
                      dropdownStyle={{ color: 'black' }}
                      placeholder=""
                      enableSearch={true}
                      disableDropdown={false}
                      preferredCountries={['us', 'in']}
                    />
                  ) : imagecheck ? (
                    <>
                      <div
                        style={{
                          position: 'relative',
                          display: 'inline-block',
                        }}
                      >
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleFileUpload}
                          style={{ paddingLeft: '2px' }} // Adjust padding to make space for the button
                        />
                        <p
                          style={{
                            position: 'absolute',
                            top: '50%',
                            right: '10px', // Adjust this value to move the button horizontally
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            // color: chattextbgright(namecolor),
                            margin: 0,
                          }}
                          onClick={handleSkip}
                        >
                          Skip
                        </p>
                      </div>
                    </>
                  ) : boardcheck ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeBoard}
                      options={boardOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedBoard}
                    />
                  ) : stremquestion ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangestream}
                      options={streamOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedStream}
                    />
                  ) : unversityquest ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeuniversity}
                      options={universitySelectOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectUniversity}
                    />
                  ) : semisterquestion ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangesemester}
                      options={semesterSelectOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectSemester}
                    />
                  ) : teacherQuestion ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeTeacher}
                      options={teacherSelectOption}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectTeacher}
                    />
                  ) : semisterprepquestion ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangesemesterpre}
                      options={semesterSelectOptionspre}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectSemesterpre}
                    />
                  ) : institutequestion || schoolnameQuestion ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeInstitute}
                      options={instituteSelectOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedInstitute}
                    />
                  ) : statequestion ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeAcademicState}
                      options={academicStateOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedAcademicState}
                    />
                  ) : classquestion ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeClass}
                      options={classOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedClass?.value || ''}
                    />
                  ) : stylequestion ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeLearningStyle}
                      options={learningStyleOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedLearningStyle}
                    />
                  ) : subjectquestion || courceforpref ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangesubject}
                      options={subjectOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectSubject}
                    />
                  ) : Dobcheck ? (
                    <>
                      <div style={{ display: 'flex' }}>
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative',
                          }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              //  open={open}
                              // open={true}
                              label={'Date of Birth'}
                              onChange={handleDateChange}
                              // onAccept={() => setOpen(false)} // Close on date selection
                              // onClose={() => setOpen(false)}  // Close on outside click
                              disableFuture
                              format={'DD/MM/YYYY'}
                              maxDate={maxSelectableDate}
                              // value={datecheck}
                              slotProps={{
                                field: {
                                  readOnly: true,
                                },
                                textField: {
                                  sx: {
                                    '& .MuiInputLabel-root': {
                                      // paddingLeft: '0px',
                                      color: chatdatetext(namecolor), // Change the label text color
                                      backgroundColor: 'transperent',
                                    },
                                    '& .MuiInputBase-root': {
                                      // flexDirection: 'row-reverse',
                                      color: chatdatetext(namecolor), // Change the label text color
                                      backgroundColor: 'transperent',
                                      paddingLeft: '100px',
                                      paddingRight: '50px',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      // borderColor: 'transperent',
                                    },
                                    '& .MuiInputAdornment-root': {
                                      // color: chatdatetext(namecolor), // Change the color of the calendar icon
                                    },
                                    '& .MuiInputBase-input': {
                                      minHeight: '15px !important',
                                    },
                                  },
                                },
                                inputAdornment: {
                                  sx: {
                                    '& .MuiSvgIcon-root': {
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
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                              }}
                              type="button"
                              onClick={handleclickdate}
                            >
                              {' '}
                              <SendIcon className="mainsearch" />
                            </button>
                          </LocalizationProvider>
                        </div>
                      </div>
                    </>
                  ) : yearquesiton ? (
                    <>
                      <div style={{ display: 'flex' }}>
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative',
                          }}
                        >
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              //  open={open}
                              // open={true}
                              views={['year']}
                              label={'Year'}
                              onChange={handleDateChange}
                              // onAccept={() => setOpen(false)} // Close on date selection
                              // onClose={() => setOpen(false)}  // Close on outside click
                              disableFuture
                              format={'YYYY'}
                              // value={datecheck}
                              slotProps={{
                                field: {
                                  readOnly: true,
                                },
                                textField: {
                                  sx: {
                                    '& .MuiInputLabel-root': {
                                      // paddingLeft: '0px',
                                      color: chatdatetext(namecolor), // Change the label text color
                                      backgroundColor: 'transperent',
                                    },
                                    '& .MuiInputBase-root': {
                                      // flexDirection: 'row-reverse',
                                      color: chatdatetext(namecolor), // Change the label text color
                                      backgroundColor: 'transperent',
                                      paddingLeft: '100px',
                                      paddingRight: '50px',
                                    },
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      // borderColor: 'transperent',
                                    },
                                    '& .MuiInputAdornment-root': {
                                      // color: chatdatetext(namecolor), // Change the color of the calendar icon
                                    },
                                  },
                                },
                                inputAdornment: {
                                  sx: {
                                    '& .MuiSvgIcon-root': {
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
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                              }}
                              type="button"
                              onClick={handleclickdate}
                            >
                              {' '}
                              <SendIcon className="mainsearch" />
                            </button>
                          </LocalizationProvider>
                        </div>
                      </div>
                    </>
                  ) : hobbyquestion ? (
                    <div
                      style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '100%',
                      }}
                    >
                      <Select
                        className="dropdown-wrapper"
                        onChange={handleDropdownChangehobby}
                        options={hobbyOptions}
                        placeholder="Select an option"
                        menuPlacement="top"
                        value={selectedHobby}
                        styles={{
                          container: (base) => ({ ...base, width: '90%' }),
                        }}
                      />
                      <p
                        style={{
                          position: 'absolute',
                          top: '50%',
                          right: '10px',
                          transform: 'translateY(-50%)',
                          cursor: 'pointer',
                          margin: 0,
                        }}
                        onClick={handleSkip}
                      >
                        Skip
                      </p>
                    </div>
                  ) : countrylist ? (
                    <Select
                      className="dropdown-wrapper"
                      options={countryOptions}
                      onChange={handleCountryChange}
                      placeholder="Select a country"
                      menuPlacement="top"
                      value={selectedCountry}
                    />
                  ) : statelist && stateOptions?.length > 0 ? (
                    <Select
                      className="dropdown-wrapper"
                      options={stateOptions}
                      placeholder="Select a state"
                      onChange={handleStateChange}
                      isDisabled={!selectedCountry}
                      menuPlacement="top"
                      value={selectedstate}
                    />
                  ) : languagequestion ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangelanguage}
                      options={languageOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedLanguage}
                    />
                  ) : languagepref ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangeproficiency}
                      options={proficiencyOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedproficiency}
                    />
                  ) : gendercheck ? (
                    <Select
                      className="dropdown-wrapper"
                      onChange={handleDropdownChangegender}
                      options={genderOptions}
                      placeholder="Select an option"
                      menuPlacement="top"
                      value={selectedgender}
                    />
                  ) : verylastquestion ? (
                    <Button
                      onClick={viewProfile}
                      style={{ display: 'block', margin: '0 auto' }}
                    >
                      View Profile
                    </Button>
                  ) : (
                    <div
                      style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '100%',
                      }}
                    >
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type your answer and press enter"
                        value={answers[currentQuestionIndex] || ''}
                        onChange={handleAnswerChange}
                        onKeyPress={handleKeyPress}
                      />
                      {(guardianquestion ||
                        whatsappnumbet ||
                        secondaddressquestion) && (
                          <p
                            style={{
                              position: 'absolute',
                              top: '50%',
                              right: '10px', // Adjust this value to move the button horizontally
                              transform: 'translateY(-50%)',
                              cursor: 'pointer',
                              // color: chattextbgright(namecolor),
                              margin: 0,
                            }}
                            onClick={handleSkip}
                          >
                            Skip
                          </p>
                        )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* <Button onClick={onCancel} autoFocus>
      Cancel
    </Button> */}

            {/* </DialogActions> */}
          </div>
        </div>
        {/* <div className='copyright'>&copy; Copyright 2024, All Right Reserved </div> */}
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
