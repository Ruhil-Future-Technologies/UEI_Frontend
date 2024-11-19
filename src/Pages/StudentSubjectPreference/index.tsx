import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import {
  deepEqual,
  inputfield,
  inputfieldhover,
  inputfieldtext,
  tabletools,
} from "../../utils/helpers";
import NameContext from "../Context/NameContext";
import { ChildComponentProps } from "../StudentProfile";

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
  activeForm
}) => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const { getData, postData, putData, deleteData } = useApi();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [boxes11, setBoxes11] = useState<Box[]>([]);
  let StudentId = localStorage.getItem("_id");
  const [subjectPreferences, setSubjectPreferences] = useState([]);
  const [editFlag, setEditFlag] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsAll, setSubjectsAll] = useState<Subject[]>([]);
  const navigate = useNavigate()
  // const [pervalidet, setpervalidet] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: { [key: string]: boolean };
  }>({});
  const [initialState, setInitialState] = useState<any | null>({});
  const [totalSemester, setTotalSemester] = useState<any>([])
  const [semester, setSemester] = useState<any>([]);
  const [academic, setAcademic] = useState<any>(false);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [particularClass, setParticularClass] = useState<any>([]);
  const [error, setError] = useState<{ [key: number]: { subject_error: boolean; preference_error: any; percentage_error: any } }>({});


  const validateFields = (index: number, field: string) => {
    setError((prevError) => ({
      ...prevError,
      [index]: {
        ...prevError[index],
        ...(field === "subject_id" && { subject_error: !boxes[index]?.subject_id }),
        ...(field === "preference" && { preference_error: !boxes[index]?.preference }),
        ...(field === "score_in_percentage" && { percentage_error: !boxes[index]?.score_in_percentage }),
      },
    }));
  };
  // Fetch data from the endpoints
  const getacademic = async () => {
    getData(`${"new_student_academic_history/get/" + StudentId}`)
      .then((response: any) => {
        if (response.status === 200) {
          setAcademic(response?.data[0]?.institution_type === "school" ? true : false)
          setBoxes((prevBoxes) =>
            prevBoxes.map((box) => ({
              ...box,
              class_id: response?.data[0]?.class_id,
              stream: response?.data[0]?.stream,
              course_id: response?.data[0]?.course_id,
              sem_id: response?.data[0]?.sem_id,
            }))
          );
          if (response?.data?.[0]?.class_id) {
            getData(`/class/get/${response?.data?.[0]?.class_id}`).then(
              (classResponse: any) => {
                if (classResponse.status === 200) {
                  // Set particularClass as an array
                  setParticularClass([classResponse.data.class_name]);
                } else {
                  setParticularClass([]);
                }
              }
            );
          }
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center"
        });
      });
  }
  const getclass = async () => {
    getData("/class/list")
      .then((response: any) => {
        if (response.status === 200) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === true
          );

          const getModifyClassName = (value: string) => {
            return value?.replace("_", " ");
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
            a.class_name.localeCompare(b.class_name)
          );

          // Set the sorted and modified class data
          setClasses(newClassObject || []);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center",
        });
      });

  }
  useEffect(() => {
    if (activeForm === 5) {
      getacademic();
      getclass();
    }
  }, [activeForm])
  const getCourse = async () => {
    getData("/course/list")
      .then((response: any) => {
        if (response.status === 200) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setCourses(filteredData || []);
          // setCourses(response.data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center"
        });
      });
  };
  const getSubject = async () => {
    if (academic) {
      getData("school_subject/list")
        .then((response: any) => {
          if (response.status === 200) {
            const filteredData = response?.data?.filter(
              (item: any) => item?.is_active === 1
            );
            setSubjects(filteredData || []);
            // setSubjects(response.data);
            setSubjectsAll(filteredData || [])
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center"
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
            // setSubjects(response.data);
            setSubjectsAll(filteredData || [])
          }
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center"
          });
        });

    }

  };
  const getPrefrence = async () => {
    getData("/subject_preference/list")
      .then((response: any) => {
        if (response.status === 200) {
          setSubjectPreferences(response.data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center"
        });
      });
  };
  const getPrefrencelist = async () => {
    getData("/subject_preference/edit/" + StudentId)
      .then((data: any) => {
        if (data?.status === 200) {
          data?.data.map((item: any, index: number) => {
            const newBox: Box = {
              id: item.id,
              course_id: item?.course_id,
              subject_id: item?.subject_id,
              preference: item?.preference,
              score_in_percentage: item?.score_in_percentage,
              sem_id: item?.sem_id,
              class_id: item?.class_id,
              stream: item?.stream,
            };
            if (!boxes.some((box) => box.id === newBox.id)) {
              // setBoxes([...boxes, newBox]);
              setBoxes((prevBoxes) => [...prevBoxes, newBox]);
              setInitialState({
                course_id: String(item?.course_id),
                subject_id: String(item?.subject_id),
                preference: item?.preference,
                score_in_percentage: item?.score_in_percentage,
                student_id: String(item?.student_id),
                sem_id: String(item?.sem_id)
              });
              setBoxes11((prevBoxes) => [...prevBoxes, newBox]);
            }
            // getData(`/class/get/${data?.data?.[0]?.class_id}`).then(
            //   (response: any) => {
            //     if (response.status === 200) {
            //       setParticularClass(response.data.class_name);
            //     } else setParticularClass("");
            //   }
            // );
            // Fetch class name for each preference item based on the index
            if (item.class_id) {

              getData(`/class/get/${item.class_id}`).then((response: any) => {
                if (response.status === 200) {
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
                    updatedClasses[index] = ""; // Reset the class name for this index
                    return updatedClasses;
                  });
                }
              });
            }
          });
        } else if (data?.status === 404) {
          setBoxes([
            {
              id: 0,
              course_id: "",
              subject_id: "",
              preference: "",
              score_in_percentage: "",
              sem_id: "",
              class_id: "",
              stream: "",
            },
          ]);
          setEditFlag(true);
        } else {
          // empty
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center"
        });
      });
  };

  const getSemester = async () => {
    getData("/semester/list")
      .then((response: any) => {
        if (response.status === 200) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setSemester(filteredData || []);
          // setCourses(response.data);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center",
        });
      });
  };
  useEffect(() => {
    getCourse();
    getPrefrence();
    getPrefrencelist();
    getSemester();
    getacademic();
    // getSubject();
  }, []);

  useEffect(() => {


    getSubject();

  }, [academic])
  useEffect(() => {
    const semesterCount = semester?.filter((item: any) => item?.semester_number === boxes[0]?.sem_id)
    setTotalSemester(semesterCount)
  }, [StudentId, semester])
  useEffect(() => {
    if (!academic) {
      const filterData = subjectsAll?.filter((item: any) => item?.course_id === boxes[0]?.course_id && item?.semester_id === boxes[0]?.sem_id)
      setSubjects(filterData)
    } else {
      if (boxes[0]?.stream !== "" || boxes[0]?.stream !== undefined) {
        const filterData = subjectsAll?.filter((item: any) => item?.class_id === boxes[0]?.class_id && item?.stream === boxes[0]?.stream)
        setSubjects(filterData)
      } else {
        const filterData = subjectsAll?.filter((item: any) => item?.class_id === boxes[0]?.class_id)
        setSubjects(filterData)
      }
    }

  }, [boxes, academic])

  const handleInputChange = async (index: number, field: string, value: string) => {
    // console.log("test academic 66666666data",academic)
    const newBoxes: any = [...boxes];
    const newValidationErrors = { ...validationErrors };
    // if (field === 'course_id') {
    //   const subjectData = subjectsAll.filter((item:any) => item.course_id === value)
    //   setSubjects(subjectData)
    // }
    if (field === 'course_id') {
      const semesterCount = semester.filter((item: any) => item.course_id === value)
      setTotalSemester(semesterCount)
    }
    if (field === 'sem_id') {
      const semesterCount = subjectsAll.filter((item: any) => item.course_id === newBoxes[0].course_id)
      const subjectData = semesterCount.filter((item: any) => item.semester_id === value)
      setSubjects(subjectData)
    }
    if (field === 'class_id') {
      const subjectData = subjectsAll.filter((item: any) => item.class_id === value)
      setSubjects(subjectData)

      try {
        const response = await getData(`/class/get/${value}`);

        if (response.status === 200) {
          setParticularClass((prevClasses: any) => {
            const updatedClasses: any = [...prevClasses];
            updatedClasses[index] = response.data.class_name; // store class name by index
            return updatedClasses;
          });
        } else {
          setParticularClass((prevClasses: any) => {
            const updatedClasses: any = [...prevClasses];
            updatedClasses[index] = ""; // Reset the class name for this index
            return updatedClasses;
          });
        }
      } catch (error) {
        console.error("Error fetching class data:", error);
        setParticularClass((prevClasses: any) => {
          const updatedClasses: any = [...prevClasses];
          updatedClasses[index] = ""; // Reset the class name for this index in case of error
          return updatedClasses;
        });
      }

    }

    if (field === "score_in_percentage") {
      // Allow empty value
      if (value === "") {
        newBoxes[index][field] = value;
        delete newValidationErrors[index]?.[field];
        setValidationErrors(newValidationErrors);
        setBoxes(newBoxes);
        return;
      }

      // Validate the score_in_percentage using regex
      const regex = /^(100(\.0{1,2})?|[0-9]?[0-9](\.[0-9]{1,2})?)$/;
      if (!regex.test(value)) {
        if (!newValidationErrors[index]) {
          newValidationErrors[index] = {};
        }
        newValidationErrors[index][field] = true;
        setValidationErrors(newValidationErrors);
        return;
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

      if (response.status === 200) {
        setParticularClass((prevClasses: any) => {
          const updatedClasses: any = [...prevClasses];
          updatedClasses[boxes?.length] = response.data.class_name; // store class name by index
          return updatedClasses;
        });
      } else {
        setParticularClass((prevClasses: any) => {
          const updatedClasses: any = [...prevClasses];
          updatedClasses[boxes?.length] = ""; // Reset the class name for this index
          return updatedClasses;
        });
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
      setParticularClass((prevClasses: any) => {
        const updatedClasses: any = [...prevClasses];
        updatedClasses[boxes?.length] = ""; // Reset the class name for this index in case of error
        return updatedClasses;
      });
    }
    const newBox: Box = {
      id: 0,
      course_id: boxes[0]?.course_id || "",
      subject_id: boxes[0]?.subject_id || "",
      preference: "",
      score_in_percentage: "",
      sem_id: boxes[0]?.sem_id || "",
      class_id: boxes[0]?.class_id || "",
      stream: boxes[0]?.stream || ""
    };
    setBoxes([...boxes, newBox]);
  };

  const deleteRow = (id: number, indx: number) => {
    if (id !== 0) {
      deleteData(`/subject_preferencedelete/${id}`)
        .then((data: any) => {
          toast.success(data?.message, {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center"
          });
          setBoxes(boxes.filter((box, index) => index !== indx));
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center"
          });
        });
    } else {
      // toast.success("Data Deleted Successfully", {
      //   hideProgressBar: true,
      //   theme: "colored",
      //   position: "top-center"
      // });
      // console.log("Data Deleted Successfully", boxes, indx);
      setBoxes(boxes.filter((box, index) => index !== indx));
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     for (const box of boxes) {
  //       const submissionData = {
  //         student_id: StudentId,
  //         course_id: String(box.course_id),
  //         subject_id: String(box.subject_id),
  //         preference: box.preference,
  //         score_in_percentage: box.score_in_percentage,
  //       };
  //       if (editFalg) {
  //         await postData("/subject_preference/add", submissionData).then(
  //           async (data: any) => {
  //             if (data?.status === 200) {
  //               console.log("Data Added successfully");
  //               toast.success(data?.message, {
  //                 hideProgressBar: true,
  //                 theme: "colored",
  //               });
  //             } else {
  //               toast.error(data?.message, {
  //                 hideProgressBar: true,
  //                 theme: "colored",
  //               });
  //             }
  //           }
  //         );
  //       } else {
  //         if (box.id === 0) {
  //           await postData("/subject_preference/add", submissionData).then(
  //             async (data: any) => {
  //               if (data?.status === 200) {
  //                 console.log("Data Added successfully");
  //                 toast.success(data?.message, {
  //                   hideProgressBar: true,
  //                   theme: "colored",
  //                 });
  //               } else {
  //                 toast.error(data?.message, {
  //                   hideProgressBar: true,
  //                   theme: "colored",
  //                 });
  //               }
  //             }
  //           );
  //         } else {
  //           await putData(
  //             "/subject_preference/edit/" + box.id,
  //             submissionData
  //           ).then(async (data: any) => {
  //             if (data?.status === 200) {
  //               console.log("Data updated successfully");
  //               toast.success(data?.message, {
  //                 hideProgressBar: true,
  //                 theme: "colored",
  //               });
  //             } else {
  //               toast.error(data?.message, {
  //                 hideProgressBar: true,
  //                 theme: "colored",
  //               });
  //             }
  //           });
  //         }
  //       }
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.message, {
  //       hideProgressBar: true,
  //       theme: "colored",
  //     });
  //   }
  // };
  // console.log("Loading",validationErrors)
  const handleSubmit = async () => {
    // e: React.FormEvent
    // e.preventDefault();

    // const eqq = deepEqual(boxes11,boxes)
    // console.log("test data11111",boxes11,boxes,eqq)
    // if(!eqq === true)  {

    let valid = true;
    boxes.forEach((box, index) => {
      if (!box?.subject_id || !box?.preference || !box?.score_in_percentage) {
        valid = false;
        setError((prevError) => ({
          ...prevError,
          [index]: {
            subject_error: !box?.subject_id,
            preference_error: !box?.preference,
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
        const submissionData = {
          student_id: StudentId,
          // course_id: String(box.course_id),
          // subject_id: String(box.subject_id),
          ...(box.course_id ? { course_id: String(box.course_id) } : {}),
          ...(box.subject_id ? { subject_id: String(box.subject_id) } : {}),
          preference: box.preference,
          score_in_percentage: box.score_in_percentage,
          // sem_id:String(box.sem_id),
          // class_id:String(box.class_id) !== null ? String(box.class_id) : "",
          // stream:(particularClass === "class_11" || particularClass === "class_12") ? String(box.stream) :""
          ...(box.sem_id ? { sem_id: String(box.sem_id) } : {}), // Include sem_id only if it's not null or undefined
          ...(box.class_id ? { class_id: String(box.class_id) } : {}), // Include class_id only if it's not null or undefined
          ...(["class_11", "class_12"].includes(particularClass[index]) && box.stream ? { stream: String(box.stream) } : {}) // Include stream only if particularClass is class_11 or class_12
        };
        initial = submissionData;
        eq = deepEqual(initialState, submissionData);

        if (editFlag) {
          return postData("/subject_preference/add", submissionData);
        } else {
          if (box.id === 0) {
            if (!eq === true) {
              return postData("/subject_preference/add", submissionData);
            }
          } else {
            // eslint-disable-next-line no-lone-blocks
            {
              if (!eq === true) {
                return putData(
                  "/subject_preference/edit/" + box.id,
                  submissionData
                );
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
        (result) => result !== null && result !== undefined
      );
      const allSuccessful = filteredResults.every(
        (result) => result?.status === 200
      );

      if (allSuccessful) {
        if (editFlag) {
          toast.success("Subject Preference saved successfully", {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center"
          });
          handleReset()
          navigate('/')
        } else {
          if (!eq === true) {
            toast.success("Subject Preference updated successfully", {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center"
            });
          }
          navigate('/')
        }
        setInitialState(initial);

        // getPrefrencelist()
        // setBoxes11(boxes)
      } else {
        // toast.error("Some entries failed to save", {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
        // getPrefrencelist()
        setInitialState(initial);
        // setBoxes11(boxes)
      }
    } catch (error: any) {
      toast.error(error?.message, {
        hideProgressBar: true,
        theme: "colored",
        position: "top-center"
      });
      // }
    }
  };
  return (
    <div>
      <form>
        {boxes.map((box, index) => (
          <div
            className="row d-flex align-items-center"
            key={box.id}
            style={{ marginBottom: "5px" }}
          >
            {
              !academic ? (
                <>

                  <div className="col form_field_wrapper">
                    <FormControl required sx={{ m: 1, minWidth: 220, width: "100%" }}>
                      <InputLabel>Course</InputLabel>
                      <Select
                        name="course_id"
                        value={box.course_id}
                        sx={{
                          backgroundColor: "#f5f5f5",
                        }}
                        onChange={(e) =>
                          handleInputChange(index, "course_id", e.target.value)
                        }
                        label="Course"
                        disabled
                      >
                        {courses.map((course) => (
                          <MenuItem
                            key={course.id}
                            value={course.id}
                            sx={{
                              backgroundColor: inputfield(namecolor),
                              color: inputfieldtext(namecolor),
                              "&:hover": {
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
                    <FormControl required sx={{ m: 1, minWidth: 220, width: "100%" }}>
                      <InputLabel id="semester-select-label">Semester </InputLabel>
                      <Select
                        name="sem_id"
                        value={box.sem_id}
                        sx={{
                          backgroundColor: "#f5f5f5",
                        }}
                        onChange={(e) =>
                          handleInputChange(index, "sem_id", e.target.value)
                        }
                        label="sem_id"
                        disabled
                      >
                        {/* Generate menu items for semesters 1 to 8 */}
                        {[...Array(totalSemester[0]?.semester_number)].map((_, index) => (
                          <MenuItem
                            key={`${index + 1}`}
                            value={index + 1}
                            sx={{
                              backgroundColor: inputfield(namecolor),
                              color: inputfieldtext(namecolor),
                              '&:hover': {
                                backgroundColor: inputfieldhover(namecolor),
                              },
                            }}
                          >
                            Semester {index + 1}
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
                      sx={{ m: 1, minWidth: 220, width: "100%" }}
                      disabled
                    >
                      <InputLabel>Class</InputLabel>
                      <Select
                        value={box.class_id}
                        sx={{
                          backgroundColor: "#f5f5f5",
                        }}
                        onChange={(e) =>
                          handleInputChange(index, "class_id", e.target.value)
                        }
                        label="Class"
                        // disabled
                      >
                        {classes.map((classes) => (
                          <MenuItem
                            key={classes.id}
                            value={classes.id}
                            sx={{
                              backgroundColor: inputfield(namecolor),
                              color: inputfieldtext(namecolor),
                              "&:hover": {
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
                  {particularClass[index] && (particularClass[index] === "class_11" || particularClass[index] === "class_12") && (
                    <div className="col-lg-3 form_field_wrapper">
                      <FormControl
                        required
                        sx={{ m: 1, minWidth: 70, width: "100%", maxWidth: 200 }}
                      >
                        <InputLabel>Stream</InputLabel>
                        <Select
                          value={box.stream}
                          sx={{
                            backgroundColor: "#f5f5f5",
                          }}
                          onChange={(e) =>
                            handleInputChange(index, "stream", e.target.value)
                          }
                          label="Stream"
                          disabled
                        >
                          <MenuItem
                            value="science"
                            sx={{
                              backgroundColor: inputfield(namecolor),
                              color: inputfieldtext(namecolor),
                              "&:hover": {
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
                              "&:hover": {
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
                              "&:hover": {
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
              )

            }
            <div className="col form_field_wrapper">
              <FormControl required sx={{ m: 1, minWidth: 220, width: "100%" }}>
                <InputLabel>Subject</InputLabel>
                <Select
                  name="subject_id"
                  value={box.subject_id}
                  sx={{
                    backgroundColor: "#f5f5f5",
                  }}
                  onChange={(e) =>
                    handleInputChange(index, "subject_id", e.target.value)
                  }
                  label="Subject"
                  onBlur={() => validateFields(index, "subject_id")}
                >
                  {subjects.map((subject) => (
                    <MenuItem
                      key={subject.subject_id}
                      value={subject.subject_id}
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        "&:hover": {
                          backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                        },
                      }}
                    >
                      {subject.subject_name}
                    </MenuItem>
                  ))}
                </Select>
                {error[index]?.subject_error && box?.subject_id == "" && <FormHelperText style={{ color: "red" }}>Subject is required</FormHelperText>}
              </FormControl>
            </div>
            <div className="col form_field_wrapper">
              <FormControl sx={{ m: 1, minWidth: 180, width: "100%" }}>
                <TextField
                  name="preference"
                  value={box.preference}
                  sx={{
                    backgroundColor: "#f5f5f5",
                  }}
                  onChange={(e) =>
                    handleInputChange(index, "preference", e.target.value)
                  }
                  label="Preference"
                  required
                  onBlur={() => validateFields(index, "preference")}
                />
                {error[index]?.preference_error && box?.preference == "" && <FormHelperText style={{ color: "red" }}>Preference is required</FormHelperText>}
              </FormControl>
            </div>
            <div
              className="col form_field_wrapper"
              style={{
                paddingTop: validationErrors[index]?.score_in_percentage
                  ? 78
                  : "",
              }}
            >
              <FormControl sx={{ m: 1, minWidth: 180, width: "100%" }}>
                <TextField
                  name="score_in_percentage"
                  sx={{
                    backgroundColor: "#f5f5f5",
                  }}
                  value={box.score_in_percentage}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "score_in_percentage",
                      e.target.value
                    )
                  }
                  label="Score in Percentage"
                  required
                  onBlur={() => validateFields(index, "score_in_percentage")}
                />
                {validationErrors[index]?.score_in_percentage && (
                  <p style={{ color: "red" }}>
                    Score in Percentage must be a number between 0 and 100 with
                    up to two decimal places.
                  </p>
                )}
                {error[index]?.percentage_error && box?.score_in_percentage == "" && <FormHelperText style={{ color: "red" }}>Percentage is required</FormHelperText>}
              </FormControl>
            </div>
            <div className="col form_field_wrapper">
              <IconButton
                onClick={addRow}
                sx={{
                  width: "35px",
                  height: "35px",
                  color: tabletools(namecolor),
                }}
              >
                <AddCircleOutlinedIcon />
              </IconButton>
              {boxes.length !== 1 && (
                <IconButton
                  onClick={() => deleteRow(box.id, index)}
                  sx={{
                    width: "35px",
                    height: "35px",
                    color: tabletools(namecolor),
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
