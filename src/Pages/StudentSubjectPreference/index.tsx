import React, { useContext, useEffect, useState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';
import {
  Box,
  // Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  // SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useApi from '../../hooks/useAPI';
import { toast } from 'react-toastify';
import {
  commonStyle,
  deepEqual,
  fieldIcon,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from '../../utils/helpers';
import NameContext from '../Context/NameContext';
//import { ChildComponentProps } from "../StudentProfile";

// Define interfaces for Box, Course, and Subject
interface Box {
  id: number;
  course_id: string;
  subject_id: string;
  preference: string;
  score_in_percentage: string;
  sem_id: string;
  class_id: string;
  stream: string;
  teacher_id: string;
  teachers?: any[]; // Add the 'teachers' property
}
interface Course {
  id: string;
  course_id: string;
  course_name: string;
}
interface Subject {
  id: string;
  subject_name: string;
  subject_id: string;
}
interface Teacher {
  subject_list: any;
  id: string;
  first_name: string;
  last_name: string;
}
interface PropsItem {
  setActiveForm: React.Dispatch<React.SetStateAction<number>>;
  handleReset: () => Promise<void>;
  activeForm?: number;
}
interface Classes {
  id: number;
  class_name: string;
  class_id: string;
}

const StudentSubjectPreference: React.FC<PropsItem> = ({
  setActiveForm,
  handleReset,
  activeForm,
}) => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const { getData, postData, putData, deleteData } = useApi();
  const [boxes, setBoxes] = useState<Box[]>([]);
  // const [boxes11, setBoxes11] = useState<Box[]>([]);
  const StudentId = localStorage.getItem('_id');
  // const [subjectPreferences, setSubjectPreferences] = useState([]);
  const [editFlag, setEditFlag] = useState(false);
  //const [preferenceValidations, setPreferenceValidations] = useState(false)
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsAll, setSubjectsAll] = useState<Subject[]>([]);
  const [teachersAll, setTeachersAll] = useState<Teacher[]>([]);
  const navigate = useNavigate();
  // const [pervalidet, setpervalidet] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: { [key: string]: boolean };
  }>({});
  const [initialState, setInitialState] = useState<any | null>({});

  const [totalSemester, setTotalSemester] = useState<any>([]);
  const [isSubjectPrefTuch, setIsSubjectPrefTuch] = useState(false);

  const [semester, setSemester] = useState<any>([]);
  const [academic, setAcademic] = useState<any>(false);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [particularClass, setParticularClass] = useState<any>([]);
  const [error, setError] = useState<{
    [key: number]: {
      subject_error: boolean;
      preference_error: any;
      percentage_error: any;
      teacher_error: any;
    };
  }>({});

  const validateFields = (index: number, field: string) => {
    setError((prevError) => ({
      ...prevError,
      [index]: {
        ...prevError[index],
        ...(field === 'subject_id' && {
          subject_error: !boxes[index]?.subject_id,
        }),
        ...(field === 'preference' && {
          preference_error: boxes[index]?.preference
            ? !/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(boxes[index]?.preference.trim())
            : !boxes[index]?.preference,
        }),
        ...(field === 'score_in_percentage' && {
          percentage_error: !boxes[index]?.score_in_percentage,
        }),
      },
    }));
  };
  // Fetch data from the endpoints
  const getacademic = async () => {
    getData(`${'new_student_academic_history/get/' + StudentId}`)
      .then(async (response: any) => {
        if (response.status) {
          setAcademic(
            response?.data[0]?.institution_type === 'school' ? true : false,
          );
          if (response?.data[0]?.institution_type) {
            await getSubject(response?.data[0]?.institution_type);
          }
          setBoxes((prevBoxes) =>
            prevBoxes.map((box) => ({
              ...box,
              class_id: response?.data[0]?.class_id,
              stream: response?.data[0]?.stream,
              course_id: response?.data[0]?.course_id,
              sem_id: response?.data[0]?.sem_id,
            })),
          );
          if (response?.data?.[0]?.class_id) {
            getData(`/class/get/${response?.data?.[0]?.class_id}`).then(
              (classResponse: any) => {
                if (classResponse.status) {
                  // Set particularClass as an array
                  setParticularClass([classResponse.data.class_name]);
                } else {
                  setParticularClass([]);
                }
              },
            );
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
  };
  const getclass = async () => {
    getData('/class/list')
      .then((response: any) => {
        if (response.status) {
          const filteredData = response?.data?.classes_data?.filter(
            (item: any) => item?.is_active === true,
          );

          const getModifyClassName = (value: string) => {
            return value?.replace('_', ' ');
          };

          // Map the filtered data to a new format
          let newClassObject = filteredData.map((item: any) => {
            return {
              id: item?.id,
              class_name: getModifyClassName(item?.class_name),
              class_id: item?.class_id,
            };
          });

          // Sort by class_name in ascending order
          newClassObject = newClassObject.sort((a: any, b: any) =>
            a.class_name.localeCompare(b.class_name),
          );

          // Set the sorted and modified class data
          setClasses(newClassObject || []);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
  };
  useEffect(() => {
    const fetchData = async () => {
      if (activeForm === 5) {
        if (StudentId) {
          await getacademic();
          getPrefrencelist();
        }
        getclass();
      }
    };
    fetchData();
  }, [activeForm]);
  const getCourse = async () => {
    getData('/course/list')
      .then((response: any) => {
        if (response.status) {
          const filteredData = response?.data?.course_data?.filter(
            (item: any) => item?.is_active,
          );
          setCourses(filteredData || []);
          // setCourses(response.data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
  };
  const getSubject = async (type: any) => {
    if (type == 'school') {
      getData('school_subject/list')
        .then((response: any) => {
          if (response.status) {
            const filteredData = response?.data?.subjects_data?.filter(
              (item: any) => item?.is_active,
            );
            // setSubjects(filteredData || []);

            if (
              boxes[0]?.stream === '' ||
              boxes[0]?.stream === undefined ||
              boxes[0]?.stream === null
            ) {
              const filterData = filteredData?.filter(
                (item: any) => item?.class_id === boxes[0]?.class_id,
              );
              setSubjects(filterData || []);
            } else {
              const filterData = filteredData?.filter(
                (item: any) =>
                  item?.class_id === boxes[0]?.class_id &&
                  item?.stream === boxes[0]?.stream,
              );
              setSubjects(filterData || []);
            }
            setSubjectsAll(filteredData || []);
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
              (item: any) => item?.is_active,
            );
            // setSubjects(filteredData || []);
            const filterData = filteredData?.filter(
              (item: any) =>
                item?.course_id === boxes[0]?.course_id &&
                item?.semester_id === boxes[0]?.sem_id,
            );
            setSubjects(filterData || []);
            setSubjectsAll(filteredData || []);
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
    getData(`/teacher/teachers_list_for_student/${StudentId}`)
      .then((response: any) => {
        if (response.status) {

          const filteredData = response?.data?.teachers

          setTeachersAll(filteredData || []);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      })
  };

  const getPrefrencelist = async () => {
    let subjectData: any = [];
    let filteredData: any = [];
    let entity: any;
    let teacherlist: any = [];
    await getData(`${'new_student_academic_history/get/' + StudentId}`)
      .then(async (response: any) => {
        if (response.status) {
          if (response?.data[0]?.institution_type == 'school') {
            entity = 'school';
            await getData('school_subject/list')
              .then((response: any) => {
                if (response.status) {
                  filteredData = response?.data?.subjects_data?.filter(
                    (item: any) => item?.is_active,
                  );
                }
              })
              .catch(() => {
                // empty
              });
          } else {
            getData('college_subject/list')
              .then((response: any) => {
                if (response.status) {
                  entity = 'college'
                  filteredData = response?.data?.subjects_data?.filter(
                    (item: any) => item?.is_active,
                  );
                }
              })
              .catch(() => {
                //empty
              });
          }
        }
      })
      .catch(() => {
        // empty
      });
    getData(`/teacher/teachers_list_for_student/${StudentId}`)
      .then((response: any) => {
        if (response.status) {

          const filteredData = response?.data?.teachers

          teacherlist = filteredData || []
        }
      })
      .catch(() => {
        // empty
      })
    getData('/subject_preference/get/' + StudentId)
      .then((data: any) => {
        if (data?.data.length > 0) {
          data?.data?.map(async (item: any, index: number) => {
            if (entity == 'school') {

              if (
                item?.stream === '' ||
                item?.stream === undefined ||
                item?.stream === null
              ) {
                const filterData = filteredData?.filter(
                  (items: any) => items?.class_id === item?.class_id,
                );
                subjectData = filterData || [];
              } else {
                const filterData = filteredData?.filter(
                  (items: any) =>
                    items?.class_id === item?.class_id &&
                    items?.stream === item?.stream,
                );
                subjectData = filterData || [];
              }
            } else {
              const filterData = filteredData?.filter(
                (item: any) =>
                  item?.course_id === boxes[0]?.course_id &&
                  item?.semester_id === boxes[0]?.sem_id,
              );
              subjectData = filterData || [];
            }
            const subjectname = subjectData?.filter((subject: Subject) => subject.subject_id === item?.subject_id)

            const selectedSubject = subjectname[0]?.subject_name?.toLowerCase();
            const teacherData = teacherlist?.filter((teacher: Teacher) =>
              teacher.subject_list.some((sub: any) => sub.toLowerCase() === selectedSubject)
            );
            const newBox: Box = {
              id: item.id,
              course_id: item?.course_id,
              subject_id: item?.subject_id,
              preference: item?.preference,
              score_in_percentage: item?.score_in_percentage,
              sem_id: item?.sem_id,
              class_id: item?.class_id,
              stream: item?.stream,
              teacher_id: item?.teacher_id,
              teachers: teacherData,
            };

            if (!boxes.some((box) => box.id === newBox.id)) {
              setBoxes((prevBoxes) => [...prevBoxes, newBox]);
              setInitialState({
                course_id: String(item?.course_id),
                subject_id: String(item?.subject_id),
                preference: item?.preference,
                score_in_percentage: item?.score_in_percentage,
                student_id: String(item?.student_id),
                sem_id: String(item?.sem_id),
                teacher_id: String(item?.teacher_id),
                teachers: teacherData,
              });

            }

            if (item.class_id) {
              getData(`/class/get/${item.class_id}`).then((response: any) => {
                if (response.status) {
                  // Optionally, log or store class name using the index to ensure uniqueness
                  setParticularClass((prevClasses: any) => {
                    const updatedClasses: any = [...prevClasses];
                    updatedClasses[index] = response.data.class_name; // store class name by index
                    return updatedClasses;
                  });
                } else {
                  // Clear or reset the class name for the index if fetch fails
                  setParticularClass((prevClasses: any) => {
                    const updatedClasses = [...prevClasses];
                    updatedClasses[index] = ''; // Reset the class name for this index
                    return updatedClasses;
                  });
                }
              });
            }
          });
        } else if (data?.code === 404) {
          if(data?.code === 404){
            setBoxes([
              {
                id: 0,
                course_id: '',
                subject_id: '',
                preference: '',
                score_in_percentage: '',
                sem_id: '',
                class_id: '',
                stream: '',
                teacher_id: '',
                teachers: [],
              },
            ]);
            getacademic()
          }else{
            setBoxes([
              {
                id: 0,
                course_id: '',
                subject_id: '',
                preference: '',
                score_in_percentage: '',
                sem_id: '',
                class_id: '',
                stream: '',
                teacher_id: '',
                teachers: [],
              },
            ]);
          }
         
          setEditFlag(true);
        } else {
          // empty
        }
      })
      .catch((e) => {
        if (e.status !== 400 || e.status !== 404) {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        }

      });
  };

  const getSemester = async () => {
    getData('/semester/list')
      .then((response: any) => {
        if (response.status) {
          const filteredData = response?.data?.semesters_data?.filter(
            (item: any) => item?.is_active,
          );
          setSemester(filteredData || []);
          // setCourses(response.data);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
  };
  useEffect(() => {
    const fetchData = async () => {
      getCourse();
      getSemester();
      //getPrefrence();
      await getacademic();

      if (StudentId) {
        getPrefrencelist();
      }
    }
    fetchData()
    // getSubject();
  }, [activeForm]);

  useEffect(() => {
    // const semesterCount = semester?.filter((item: any) => item?.semester_number === boxes[0]?.sem_id)
    const semesterCount = semester?.filter(
      (item: any) => item?.semester_id === boxes[0]?.sem_id,
    );
    setTotalSemester(semesterCount);
  }, [StudentId, semester, boxes]);
  useEffect(() => {
    if (!academic) {
      const filterData = subjectsAll?.filter(
        (item: any) =>
          item?.course_id === boxes[0]?.course_id &&
          item?.semester_id === boxes[0]?.sem_id,
      );
      setSubjects(filterData);
    } else {
      if (
        boxes[0]?.stream === '' ||
        boxes[0]?.stream === undefined ||
        boxes[0]?.stream === null
      ) {
        const filterData = subjectsAll?.filter(
          (item: any) => item?.class_id === boxes[0]?.class_id,
        );
        setSubjects(filterData);
      } else {
        const filterData = subjectsAll?.filter(
          (item: any) =>
            item?.class_id === boxes[0]?.class_id &&
            item?.stream === boxes[0]?.stream,
        );
        setSubjects(filterData);
      }
    }
  }, [boxes, academic]);

  const handleInputChange = async (
    index: number,
    field: string,
    value: string,
  ) => {
    setIsSubjectPrefTuch(true);
    const newBoxes: any = [...boxes];
    const newValidationErrors = { ...validationErrors };
    if (field === 'subject_id') {
      const subjectname = subjects?.filter((subject) => subject.subject_id === value)
      const selectedSubject = subjectname[0]?.subject_name?.toLowerCase();
      const teacherData = teachersAll.filter((teacher) =>
        teacher.subject_list.some((sub: any) => sub.toLowerCase() === selectedSubject)
      );
      newBoxes[index] = {
        ...newBoxes[index],
        teachers: teacherData, // Assign teachers only for this row
        teacher_id: "", // Reset selected teacher when subject changes
      };
    }
    if (field === 'course_id') {
      const semesterCount = semester.filter(
        (item: any) => item.course_id === value,
      );
      setTotalSemester(semesterCount);
    }
    if (field === 'sem_id') {
      const semesterCount = subjectsAll.filter(
        (item: any) => item.course_id === newBoxes[0].course_id,
      );
      const subjectData = semesterCount.filter(
        (item: any) => item.semester_id === value,
      );
      setSubjects(subjectData);
    }
    if (field === 'class_id') {
      const subjectData = subjectsAll.filter(
        (item: any) => item.class_id === value,
      );
      setSubjects(subjectData);

      try {
        const response = await getData(`/class/get/${value}`);

        if (response.status) {
          setParticularClass((prevClasses: any) => {
            const updatedClasses: any = [...prevClasses];
            updatedClasses[index] = response.data.class_name; // store class name by index
            return updatedClasses;
          });
        } else {
          setParticularClass((prevClasses: any) => {
            const updatedClasses: any = [...prevClasses];
            updatedClasses[index] = ''; // Reset the class name for this index
            return updatedClasses;
          });
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
        setParticularClass((prevClasses: any) => {
          const updatedClasses: any = [...prevClasses];
          updatedClasses[index] = ''; // Reset the class name for this index in case of error
          return updatedClasses;
        });
      }
    }

    if (field === 'score_in_percentage') {
      if (value === '') {
        newBoxes[index][field] = value;
        delete newValidationErrors[index]?.[field];
        setValidationErrors(newValidationErrors);
        setBoxes(newBoxes);
        return;
      }

      // Ensure value is properly formatted as a string
      const trimmedValue = String(value).trim();

      // Updated regex to accept 10-100 with up to 2 decimal places
      const regex = /^(100|[1-9][0-9])(\.\d{1,2})?$/;
      if (!regex.test(trimmedValue)) {
        if (!newValidationErrors[index]) {
          newValidationErrors[index] = {};
        }
        newValidationErrors[index][field] = true;
        setValidationErrors(newValidationErrors);
        // return;
      } else {
        if (newValidationErrors[index]) {
          delete newValidationErrors[index][field];
          if (Object.keys(newValidationErrors[index]).length === 0) {
            delete newValidationErrors[index];
          }
        }
        setValidationErrors(newValidationErrors);
      }
    }

    newBoxes[index][field] = value;
    setBoxes(newBoxes);
    validateFields(index, field);
  };

  const addRow = async () => {
    try {
      const response = await getData(`/class/get/${boxes[0]?.class_id}`);

      if (response.status) {
        setParticularClass((prevClasses: any) => {
          const updatedClasses: any = [...prevClasses];
          updatedClasses[boxes?.length] = response.data.class_name; // store class name by index
          return updatedClasses;
        });
      } else {
        setParticularClass((prevClasses: any) => {
          const updatedClasses: any = [...prevClasses];
          updatedClasses[boxes?.length] = ''; // Reset the class name for this index
          return updatedClasses;
        });
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
      setParticularClass((prevClasses: any) => {
        const updatedClasses: any = [...prevClasses];
        updatedClasses[boxes?.length] = ''; // Reset the class name for this index in case of error
        return updatedClasses;
      });
    }
    const newBox: Box = {
      id: 0,
      course_id: boxes[0]?.course_id || '',
      // subject_id: boxes[0]?.subject_id || '',
      subject_id: '',
      preference: '',
      score_in_percentage: '',
      sem_id: boxes[0]?.sem_id || '',
      class_id: boxes[0]?.class_id || '',
      stream: boxes[0]?.stream || '',
      teacher_id: '',
      teachers: boxes[0]?.teachers || []
    };
    setBoxes([...boxes, newBox]);
  };

  const deleteRow = (id: number, indx: number) => {
    if (id !== 0) {
      deleteData(`/subject_preferencedelete/${id}`)
        .then((data: any) => {
          toast.success(data?.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
          setBoxes(boxes.filter((_, index) => index !== indx));
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        });
    } else {
      // toast.success("Data Deleted Successfully", {
      //   hideProgressBar: true,
      //   theme: "colored",
      //   position: "top-center"
      // });
      setBoxes(boxes.filter((_, index) => index !== indx));
    }
  };

  const handleSubmit = async () => {
    let valid = true;
    boxes.forEach((box, index) => {
      if (
        !box?.subject_id ||
        !box?.preference ||
        !box?.score_in_percentage ||
        !box?.teacher_id ||
        !/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(box?.preference)
      ) {
        valid = false;
        setError((prevError) => ({
          ...prevError,
          [index]: {
            subject_error: !box?.subject_id,
            teacher_error: !box?.teacher_id,
            preference_error: boxes[index]?.preference
              ? !/^[a-zA-Z]+(\s[a-zA-Z]+)*$/.test(
                boxes[index]?.preference.trim(),
              )
              : !boxes[index]?.preference,
            percentage_error: !box?.score_in_percentage,
          },
        }));
      }
    });

    if (!valid) return; // Don't proceed if validation fails
    let initial = {};
    let eq;
    try {
      const promises = boxes.map(async (box, index) => {
        const formData = new FormData();

        const submissionData = {
          student_id: StudentId,
          // course_id: String(box.course_id),
          // subject_id: String(box.subject_id),
          ...(box.course_id ? { course_id: String(box.course_id) } : {}),
          ...(box.subject_id ? { subject_id: String(box.subject_id) } : {}),
          ...(box.teacher_id ? { teacher_id: String(box.teacher_id) } : {}),
          preference: box.preference,
          score_in_percentage: box.score_in_percentage,
          // sem_id:String(box.sem_id),
          // class_id:String(box.class_id) !== null ? String(box.class_id) : "",
          // stream:(particularClass === "class_11" || particularClass === "class_12") ? String(box.stream) :""
          ...(box.sem_id ? { sem_id: String(box.sem_id) } : {}), // Include sem_id only if it's not null or undefined
          ...(box.class_id ? { class_id: String(box.class_id) } : {}), // Include class_id only if it's not null or undefined
          ...(['class_11', 'class_12'].includes(particularClass[index]) &&
            box.stream
            ? { stream: String(box.stream) }
            : {}), // Include stream only if particularClass is class_11 or class_12
        } as any;

        initial = submissionData;
        eq = deepEqual(initialState, submissionData);

        Object.keys(submissionData).forEach((key) => {
          formData.append(key, submissionData[key]);
        });

        if (editFlag) {
          return postData('/subject_preference/add', formData);
        } else {
          if (box.id === 0) {
            if (!eq === true) {
              return postData('/subject_preference/add', formData);
            }
          } else {
            // eslint-disable-next-line no-lone-blocks
            {
              if (!eq === true) {
                return putData('/subject_preference/edit/' + box.id, formData);
              } else {
                return Promise.resolve(undefined); // Skip update, return null
              }
            }
          }
        }
      });

      // Wait for all API calls to complete
      const results = await Promise.all(promises);

      // Check if all calls were successful
      const filteredResults = results.filter(
        (result) => result !== null && result !== undefined,
      );
      const allSuccessful = filteredResults.every(
        (result) => result?.status,
      );

      if (allSuccessful) {
        if (editFlag) {
          if (isSubjectPrefTuch) {
            toast.success('Subject Preference saved successfully', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
          }
          await handleReset();
          setTimeout(async () => {
            await navigate('/'); // Navigate after 2 seconds (adjust as necessary)
          }, 1000);
        } else {
          if (!eq === true && isSubjectPrefTuch) {
            toast.success('Subject Preference updated successfully', {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
          }

          setTimeout(async () => {
            await navigate('/'); // Navigate after 2 seconds (adjust as necessary)
          }, 1000);
        }
        setInitialState(initial);

      } else {

        setInitialState(initial);

      }
    } catch (error: any) {
      toast.error(error?.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
      // }
    }
  };
  return (
    <div>
      <form>
        {boxes?.map((box, index) => (
          <div
            className="row d-flex align-items-center"
            key={box.id}
            style={{ marginBottom: '5px' }}
          >
            {!academic ? (
              <>
                <div className="col form_field_wrapper">
                  <FormControl
                    required
                    sx={{ m: 1, minWidth: 220, width: '100%' }}
                  >
                    <InputLabel>Course</InputLabel>
                    <Select
                      name="course_id"
                      value={box.course_id}
                      sx={{
                        backgroundColor: '#f5f5f5',
                        '& .MuiSelect-icon': {
                          color: fieldIcon(namecolor),
                        },
                      }}
                      onChange={(e) =>
                        handleInputChange(index, 'course_id', e.target.value)
                      }
                      label="Course"
                      disabled
                    >
                      {courses?.map((course) => (
                        <MenuItem
                          key={course.id}
                          value={course.id}
                          sx={{
                            backgroundColor: inputfield(namecolor),
                            color: inputfieldtext(namecolor),
                            '&:hover': {
                              backgroundColor: inputfieldhover(namecolor),
                            },
                          }}
                        >
                          {course.course_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className=" col form_field_wrapper">
                  <FormControl
                    required
                    sx={{ m: 1, minWidth: 220, width: '100%' }}
                  >
                    <InputLabel id="semester-select-label">
                      Semester{' '}
                    </InputLabel>
                    <Select
                      name="sem_id"
                      value={box.sem_id}
                      sx={{
                        backgroundColor: '#f5f5f5',
                        '& .MuiSelect-icon': {
                          color: fieldIcon(namecolor),
                        },
                      }}
                      onChange={(e) =>
                        handleInputChange(index, 'sem_id', e.target.value)
                      }
                      label="sem_id"
                      disabled
                    >
                      {/* Generate menu items for semesters 1 to 8 */}
                      {/* {[...Array(totalSemester[0]?.semester_number)]?.map((_, index) => (
                          <MenuItem
                            key={`${index + 1}`}
                            value={index + 1}
                            sx={{
                              backgroundColor: inputfield(namecolor),
                              color: inputfieldtext(namecolor),
                              "&:hover": {
                                backgroundColor: inputfieldhover(namecolor),
                              },
                            }}
                          >
                            Semester {index + 1}
                          </MenuItem>
                        ))} */}
                      {totalSemester
                        ?.sort(
                          (a: any, b: any) =>
                            a.semester_number - b.semester_number,
                        )
                        .map((item: any) => (
                          <MenuItem
                            key={item?.semester_id}
                            value={item?.semester_id}
                            sx={{
                              backgroundColor: inputfield(namecolor),
                              color: inputfieldtext(namecolor),
                              '&:hover': {
                                backgroundColor: inputfieldhover(namecolor),
                              },
                            }}
                          >
                            Semester {item.semester_number}
                          </MenuItem>
                        ))}
                    </Select>
                    <Typography variant="body2" color="error">
                      {/* {typeof errors?.sem_id === "string" && errors.sem_id} */}
                    </Typography>
                  </FormControl>
                </div>
              </>
            ) : (
              <>
                <div className="col form_field_wrapper">
                  <FormControl
                    required
                    sx={{ m: 1, minWidth: 220, width: '100%' }}
                    disabled
                  >
                    <InputLabel id="class-label" shrink>
                      Class
                    </InputLabel>
                    <Select
                      labelId="class-label"
                      value={box.class_id}
                      sx={{
                        backgroundColor: '#f5f5f5',
                        '& .MuiSelect-icon': {
                          color: fieldIcon(namecolor),
                        },
                      }}
                      onChange={(e) =>
                        handleInputChange(index, 'class_id', e.target.value)
                      }
                      label="Class"
                      disabled
                      notched
                    >
                      {classes.map((classes) => (
                        <MenuItem
                          key={classes.id}
                          value={classes.id}
                          sx={{
                            backgroundColor: inputfield(namecolor),
                            color: inputfieldtext(namecolor),
                            '&:hover': {
                              backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                            },
                          }}
                        >
                          {classes.class_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                {/* {  (particularClass === "class_11" ||
                particularClass === "class_12") && ( */}
                {particularClass[index] &&
                  (particularClass[index] === 'class_11' ||
                    particularClass[index] === 'class_12') && (
                    <div className="col-lg-3 form_field_wrapper">
                      <FormControl
                        required
                        sx={{
                          m: 1,
                          minWidth: 70,
                          width: '100%',
                          maxWidth: 200,
                        }}
                      >
                        <InputLabel>Stream</InputLabel>
                        <Select
                          value={box.stream}
                          sx={{
                            backgroundColor: '#f5f5f5',
                            '& .MuiSelect-icon': {
                              color: fieldIcon(namecolor),
                            },
                          }}
                          onChange={(e) =>
                            handleInputChange(index, 'stream', e.target.value)
                          }
                          label="Stream"
                          disabled
                        >
                          <MenuItem
                            value="science"
                            sx={{
                              backgroundColor: inputfield(namecolor),
                              color: inputfieldtext(namecolor),
                              '&:hover': {
                                backgroundColor: inputfieldhover(namecolor),
                              },
                            }}
                          >
                            Science
                          </MenuItem>
                          <MenuItem
                            value="commerce"
                            sx={{
                              backgroundColor: inputfield(namecolor),
                              color: inputfieldtext(namecolor),
                              '&:hover': {
                                backgroundColor: inputfieldhover(namecolor),
                              },
                            }}
                          >
                            Commerce
                          </MenuItem>
                          <MenuItem
                            value="arts"
                            sx={{
                              backgroundColor: inputfield(namecolor),
                              color: inputfieldtext(namecolor),
                              '&:hover': {
                                backgroundColor: inputfieldhover(namecolor),
                              },
                            }}
                          >
                            Arts
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  )}
              </>
            )}
            <div className="col form_field_wrapper">
              <FormControl required sx={{ m: 1, minWidth: 220, width: '100%' }}>
                <InputLabel>Subject</InputLabel>
                <Select
                  name="subject_id"
                  value={box.subject_id}
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '& .MuiSelect-icon': {
                      color: fieldIcon(namecolor),
                    },
                  }}
                  onChange={(e) =>
                    handleInputChange(index, 'subject_id', e.target.value)
                  }
                  label="Subject"
                  onBlur={() => validateFields(index, 'subject_id')}
                >
                  {subjects
                    ?.filter((subject) => subject.subject_id === box.subject_id)
                    ?.map((subject) => (
                      <MenuItem
                        key={subject.subject_id}
                        value={subject.subject_id}
                        disabled
                        sx={commonStyle(namecolor)}
                      >
                        {subject.subject_name}
                      </MenuItem>
                    ))}
                  {subjects
                    ?.filter(
                      (subject) =>
                        !boxes?.some(
                          (b) => b.subject_id === subject.subject_id,
                        ),
                    )
                    ?.map((subject) => (
                      <MenuItem
                        key={subject.subject_id}
                        value={subject.subject_id}
                        sx={commonStyle(namecolor)}
                      >
                        {subject.subject_name}
                      </MenuItem>
                    ))}
                </Select>
                {error[index]?.subject_error && box?.subject_id == '' && (
                  <FormHelperText style={{ color: 'red' }}>
                    Subject is required
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="col form_field_wrapper">
              <FormControl required sx={{ m: 1, minWidth: 220, width: '100%' }}>
                <InputLabel>Teachers</InputLabel>
                <Select
                  name="teacher_id"
                  value={box.teacher_id}
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '& .MuiSelect-icon': {
                      color: fieldIcon(namecolor),
                    },
                  }}
                  onChange={(e) => handleInputChange(index, "teacher_id", e.target.value)}
                  label="Teacher"
                >
                  {/* Show selected teacher first (disabled) */}
                  {box.teachers
                    ?.filter((teacher) => teacher.id === box.teacher_id)
                    ?.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id} disabled sx={commonStyle(namecolor)}>
                        {teacher.first_name}
                      </MenuItem>
                    ))}

                  {/* Show available teachers excluding already selected ones in other rows */}
                  {box.teachers
                    ?.filter((teacher) => !boxes.some((b) => b.teacher_id === teacher.id))
                    ?.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id} sx={commonStyle(namecolor)}>
                        {teacher.first_name}
                      </MenuItem>
                    ))}
                </Select>

                {/* Error message */}
                {error[index]?.teacher_error && box?.teacher_id === "" && (
                  <FormHelperText style={{ color: "red" }}>Teacher is required</FormHelperText>
                )}
              </FormControl>
            </div>
            <div className="col form_field_wrapper">
              <FormControl sx={{ m: 1, minWidth: 180, width: '100%' }}>
                <TextField
                  name="preference"
                  value={box.preference}
                  sx={{
                    backgroundColor: '#f5f5f5',
                  }}
                  onChange={(e) =>
                    handleInputChange(index, 'preference', e.target.value)
                  }
                  label="Preference"
                  required
                  onBlur={() => validateFields(index, 'preference')}
                />
                {error[index]?.preference_error && box?.preference == '' && (
                  <FormHelperText style={{ color: 'red' }}>
                    Preference is required
                  </FormHelperText>
                )}
                {error[index]?.preference_error && !(box?.preference == '') && (
                  <FormHelperText style={{ color: 'red' }}>
                    Provide a valid Preference
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div
              className="col form_field_wrapper"
              style={{
                paddingTop: validationErrors[index]?.score_in_percentage
                  ? 78
                  : '',
              }}
            >
              <FormControl sx={{ m: 1, minWidth: 180, width: '100%' }}>
                <TextField
                  name="score_in_percentage"
                  sx={{
                    backgroundColor: '#f5f5f5',
                  }}
                  value={box.score_in_percentage}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      'score_in_percentage',
                      e.target.value,
                    )
                  }
                  label="Score in Percentage"
                  required
                  onBlur={() => validateFields(index, 'score_in_percentage')}
                />
                {validationErrors[index]?.score_in_percentage && (
                  <p style={{ color: 'red' }}>
                    Score in Percentage must be a number between 0 and 100 with
                    up to two decimal places.
                  </p>
                )}
                {error[index]?.percentage_error &&
                  box?.score_in_percentage == '' && (
                    <FormHelperText style={{ color: 'red' }}>
                      Percentage is required
                    </FormHelperText>
                  )}
              </FormControl>
            </div>
            <div className="col form_field_wrapper">
              <IconButton
                onClick={addRow}
                sx={{
                  width: '35px',
                  height: '35px',
                  color: fieldIcon(namecolor),
                }}
              >
                <AddCircleOutlinedIcon />
              </IconButton>
              {boxes.length !== 1 && (
                <IconButton
                  onClick={() => deleteRow(box.id, index)}
                  sx={{
                    width: '35px',
                    height: '35px',
                    color: fieldIcon(namecolor),
                  }}
                >
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              )}
            </div>
          </div>
        ))}
        <div className="row justify-content-center">
          {/* <div className="col-3">
            <Button
            className="mainbutton"
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginTop: "25px" }}
            >
              Save Subject Preference
            </Button>
          </div> */}
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
              className="btn btn-dark px-lg-5  ms-auto d-block rounded-pill submit-btn"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StudentSubjectPreference;
