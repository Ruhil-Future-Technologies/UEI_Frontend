/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useContext, useEffect, useState } from "react";
import "../Uploadpdf/Uploadpdf.scss";
import useApi from "../../hooks/useAPI";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { QUERY_KEYS_COURSE, QUERY_KEYS_SUBJECT } from "../../utils/const";
import FullScreenLoader from "../Loader/FullScreenLoader";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import NameContext from "../Context/NameContext";
import { State} from "country-state-city";
import {
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from "../../utils/helpers";

interface Classes {
  id: number;
  class_name: string;
  new_class_name: string;
  class_id: string;
}
interface Box {
  id: number;
  institute_type: string;
  board: string;
  state_for_stateboard: string;
  institute_id: string;
  course_id: string;
  learning_style: string;
  class_id: string;
  year: any;
  stream: string;
  university_id?: string;
  // sem_id: string;
  sem_id?: string;
  subject_id?: string;
}
interface Institute {
  id: number;
  institute_id: string;
  institution_name: string;
  university_id: any
}
interface Course {
  id: number;
  course_name: string;
  course_id: string;
  institution_id: string;
}
interface Semester {
  id: number;
  semester_number: string;
  sem_id: string;
  course_id: string;
}
interface University {
  id: number;
  university_name: string;
  university_id: string;
}
interface Option {
  value: string;
  label: string;
}
interface Boxset {
  id: number;
  Institute_Name_Add: string;
}
interface Subject {
  id: string;
  subject_name: string;
  subject_id: string;
}

const Uploadpdf = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const location = useLocation();
  const navigator = useNavigate();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const SubjectURL = QUERY_KEYS_SUBJECT.GET_SUBJECT;
  const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
  const Menulist: any = localStorage.getItem("menulist1");
  let AdminId: string | null = localStorage.getItem("_id");
  if (AdminId) {
    AdminId = String(AdminId);
  }
  const initials = {
      id: 0,
      institute_type: "",
      board: "",
      state_for_stateboard: "",
      institute_id: "",
      course_id: "",
      learning_style: "",
      class_id: "",
      year: null,
      stream: "",
      university_id: "",
      sem_id: "",
    }
    const Boxsetvalue = {
      id: 0,
      Institute_Name_Add: "",
    };
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [dataSubject, setDataSubject] = useState([]);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([initials]);
  const [institutesAll, setInstitutesAll] = useState<Institute[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [coursesAll, setCoursesAll] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semester, setSemester] = useState<Semester[]>([]);
  const [totalSemester, setTotalSemester] = useState<any>([])
  const [particularClass, setParticularClass] = useState("");
  const [stateOptions, setStateOptions] = useState<Option[]>([]);
  const [university, setUniversity] = useState<University[]>([]);
  const [boxes1, setBoxes1] = useState<Boxset[]>([Boxsetvalue]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsAll, setSubjectsAll] = useState<Subject[]>([]);

  const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;
  const DeleteCourseURL = QUERY_KEYS_COURSE.COURSE_DELETE;
  const { getData, loading, postFileData } = useApi();
  useEffect(() => {
    const states = State.getStatesOfCountry("IN");
    const stateOptions = states.map((state) => ({
      // value: state.isoCode,
      value: state.name,
      label: state.name,
    }));
    setStateOptions(stateOptions);
  }, [State]);

  const callAPI = async () => {
    getData(`${SubjectURL}`)
      .then((data: any) => {
        if (data.data) {
          setDataSubject(data?.data);
        }
      })
      .catch((e) => {
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  };
  useEffect(() => {
    callAPI();

    getData("/class/list")
      .then((response: any) => {
        if (response.status === 200) {
          // const filteredData = response?.data?.filter((item:any) => item?.is_active === 1);
          let filteredData: any[] = [];
          response?.data?.forEach((item: any) => {
            if (item?.is_active) {
              let updatedClassName = item.class_name.split("_").join(" ");
              item.new_class_name =
                updatedClassName.charAt(0).toUpperCase() +
                updatedClassName.slice(1);
              filteredData.push(item);
            }
          });

          setClasses(filteredData || []);
          // setCourses(response.data);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  }, []);
  const listData = async () => {
    return new Promise((resolve) => {
      getData("/institution/list")
        .then(async (response: any) => {
          if (response.status === 200) {
            const filteredData = await response?.data?.filter(
              (item: any) => item?.is_active === 1
            );
            setInstitutes(filteredData || []);
            setInstitutesAll(filteredData || [])
            // setInstitutes(response.data);
            // return filteredData || []
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          toast.error(error?.message, {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center",
          });

          resolve(false);
        });
    });
  };
  const getSubject = async () => {
    if(boxes[0]?.institute_type?.toLowerCase() === "school"){
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
    }else{
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

  useEffect(() => {
    listData();
    getData("university/list")
      .then((response: any) => {
        if (response.status === 200) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setUniversity(filteredData || []);
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

    getData("/course/list")
      .then((response: any) => {
        if (response.status === 200) {
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === 1
          );
          setCourses(filteredData || []);
          setCoursesAll(filteredData || [])
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
    getData("/class/list")
      .then((response: any) => {
        if (response.status === 200) {
          // const filteredData = response?.data?.filter((item:any) => item?.is_active === 1);
          const filteredData = response?.data?.filter(
            (item: any) => item?.is_active === true
          );
          const getModifyClassMane = (value: string) => {
            return value?.replace("_", " ");
          };
          const newClassObject = filteredData.map((item: any) => {
            return {
              id: item?.id,
              class_name: getModifyClassMane(item?.class_name),
              class_id: item?.class_id,
            };
          });
          setClasses(newClassObject || []);
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

 
  }, []);
  useEffect(()=>{
   
    
    getSubject();

  },[boxes[0]?.institute_type])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const pdfFiles = filesArray.filter(
        (file) => file.type === "application/pdf"
      );

      if (pdfFiles.length !== filesArray.length) {
        toast.error("Only PDF files are allowed");
      }

      setSelectedFiles(pdfFiles);
      // if (pdfFiles.length > 0) {
      //     setSelectedPdf(URL.createObjectURL(pdfFiles[0])); // Preview the first PDF
      // }
      // let payload={};
      // if(boxes[0].institute_type==="school"){
      //    payload={
      //     board_selection:boxes[0].board?boxes[0].board.toUpperCase():'',
      //     class_selection:particularClass?particularClass:boxes[0].class_id,
      //     state_board_selection:boxes[0].state_for_stateboard?boxes[0].state_for_stateboard:'',
      //     stream_selection:boxes[0].stream?boxes[0].stream:"",
      //     subject:boxes[0].subject_id?boxes[0].subject_id:'',
      //     school_college_selection:boxes[0].institute_type?boxes[0].institute_type:'',
      //     teacher_id:AdminId
      //    }
      // }else{
      //    payload={
      //     college_selection:boxes[0].institute_id?boxes[0].institute_id:'',
      //     university_selection:boxes[0].university_id?boxes[0].university_id:"",
      //     course_selection:boxes[0].course_id?boxes[0].course_id:"",
      //     sem_id:boxes[0].sem_id ?boxes[0].sem_id:"",
      //     subject:boxes[0].subject_id?boxes[0].subject_id:"",
      //     school_college_selection:boxes[0].institute_type?boxes[0].institute_type:"",
      //     teacher_id:AdminId
      //   }

      // }
      //  console.log(payload);
      //   postFileData("https://dbllm.gyansetu.ai/upload-pdf-hierarchy",payload).then((data: any) => {
      //   //console.log("atul is doing some thing");
      //     if (data?.status === 201) {
      //     toast.success(data?.message, {
      //       hideProgressBar: true,
      //       theme: "colored",
      //     });
      //     setSelectedFiles([]);
      //   } else {
      //     toast.error(data?.message, {
      //       hideProgressBar: true,
      //       theme: "colored",
      //     });
      //   }
      // })
      // .catch((e) => {
      //   toast.error(e?.message, {
      //     hideProgressBar: true,
      //     theme: "colored",
      //   });
      // });
       }
    
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No files selected");
      return;
    }
    if(boxes[0]?.institute_type?.toLowerCase() === "college"){
      const { institute_id, university_id, course_id, sem_id, subject_id } = boxes[0];
      // Check if any of the fields are empty
      if (!institute_id || !university_id || !course_id || !sem_id ) {
        toast.error("Required fields are missing");
        return;
      }
    }
    if(boxes[0]?.institute_type?.toLowerCase() === "school"){
      const { board, class_id, state_for_stateboard, stream, subject_id } = boxes[0];
    
      // Check if any of the fields are empty
      if (!board || !class_id ) {
        toast.error("Required fields are missing");
        return;
      }
      // Additional check if the board is "state_board" and `state_for_stateboard` is required
      if (board.toLowerCase() === "state_board" && !state_for_stateboard) {
        toast.error("State for State Board is required");
        return;
      }
  
      // Additional check if the class is "class_11" or "class_12" and `stream` is required
      if ((particularClass === "class_11" || particularClass === "class_12") && !stream) {
        toast.error("Stream is required for Class 11 and Class 12");
        return;
      }
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("pdf_file", file);
    });
    if (AdminId !== null) {
      formData.append("teacher_id", String(AdminId));
      if (boxes[0]?.institute_type?.toLowerCase() === "college") {
        const { institute_id, university_id, course_id, sem_id, institute_type } = boxes[0];
        if (institute_type) formData.append("school_college_selection", institute_type);
        if (institute_id) formData.append("college_selection", institute_id);
        if (university_id) formData.append("university_selection", university_id);
        if (course_id) formData.append("course_selection", course_id);
        // if (sem_id) formData.append("sem_id", sem_id);
      
       // Convert sem_id to a number if it is a string
    const semIdNumber = Number(sem_id);

    let year = null;
    if (semIdNumber === 1 || semIdNumber === 2) {
      year = "1";
    } else if (semIdNumber === 3 || semIdNumber === 4) {
      year = "2";
    } else if (semIdNumber === 5 || semIdNumber === 6) {
      year = "3";
    } else if (semIdNumber === 7 || semIdNumber === 8) {
      year = "4";
    }
    if (year) formData.append("year", year);
      }
      if(boxes[0]?.institute_type?.toLowerCase() === "school"){
        const { board, class_id, state_for_stateboard, stream,institute_type } = boxes[0];
        if (institute_type) formData.append("school_college_selection", institute_type);
        if (board) formData.append("board_selection", board?.toUpperCase());
        if (class_id) formData.append("class_selection",particularClass || class_id);
        if (state_for_stateboard) formData.append("state_board_selection", state_for_stateboard);
        if (stream) formData.append("stream_selection", stream);
        // if (subject_id) formData.append("subject", subject_id);

      }
      // formData.append("class_name", selectedClass);
      // formData.append('subject_id', selectedSubject);
    }
    console.log("test log",formData)
    if(boxes[0]?.institute_type){

    }
    await postFileData(
      // `${"https://uatllm.gyansetu.ai/upload-pdf-class"}`,
      `${"https://dbllm.gyansetu.ai/upload-pdf-hierarchy"}`,
      formData
    )
      .then((data: any) => {
        if (data?.status === 201) {
          toast.success(data?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
          setSelectedFiles([]);
          setBoxes([initials]);
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
  const usertype: any = localStorage.getItem("user_type");

  if (usertype !== "admin") {
    navigator("/main/*");
  }

  const handleChange = (event: any) => {
    const { name, value } = event?.target;
    if (name === "class_id") {
      setSelectedClass(value);
    } else if (name === "subject_id") {
      setSelectedSubject(value);
    }
  };
  // Create an array for classes from 1 to 12
  // const classes = Array.from({ length: 12 }, (_, i) => i + 1);
  const midpoint = Math.ceil(selectedFiles.length / 2);
  const firstBatch = selectedFiles.slice(0, midpoint);
  const secondBatch = selectedFiles.slice(midpoint);

  // const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  // const handleClose = () => {
  //     setSelectedPdf(null); // This will close the iframe
  //   };
  const handleInputChange = (
    index: number,
    field: keyof Box,
    value: string | null
  ) => {
    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], [field]: value };
    if (field === "institute_type") {
      if(value?.toLowerCase() === "school"){
        newBoxes[index].institute_id = "";
        newBoxes[index].university_id = "";
        newBoxes[index].course_id = "";
        newBoxes[index].sem_id = "";
        newBoxes[index].subject_id = "";
      }else{
        newBoxes[index].board = "";
        newBoxes[index].state_for_stateboard = "";
        newBoxes[index].class_id = "";
        newBoxes[index].stream = "";
        newBoxes[index].subject_id = "";

      }
    }
    if (field === "board") {
      newBoxes[index].state_for_stateboard = "";
    }
    if (field === "university_id") {
      newBoxes[index].institute_id = "";
      newBoxes[index].course_id = "";
      newBoxes[index].sem_id = "";
      newBoxes[index].subject_id = "";
      const filterDataInstitute = institutesAll.filter((item) => item.university_id === value)
      setInstitutes(filterDataInstitute)
    }
    if (field === "institute_id") {
      newBoxes[index].course_id = "";
      newBoxes[index].sem_id = "";
      newBoxes[index].subject_id = "";
      const filterDataCourse = coursesAll.filter((item) => item.institution_id === value)
      setCourses(filterDataCourse)
    }

    if (field === 'course_id') {
      newBoxes[index].sem_id = "";
      newBoxes[index].subject_id = "";
      const semesterCount = semester.filter((item) => item.course_id === value)

      // const semesterCount = semester.reduce((acc: any, crr) => {
      //   if (crr.semester_number === value) acc = crr.semester_number
      //   return acc
      // }, 0)
      setTotalSemester(semesterCount)
    }
    if (field === "sem_id") {
      newBoxes[index].subject_id = "";
      const filterData = subjectsAll?.filter((item:any)=> item?.institution_id  === boxes[0]?.institute_id && item?.course_id  === boxes[0]?.course_id && item?.semester_id  === value )
        setSubjects(filterData)
    }

    if (field === "class_id") {
      newBoxes[index].subject_id = "";
      const filterData = subjectsAll?.filter((item:any)=> item?.class_id  === value )
        setSubjects(filterData)
    }
    if (field === "stream") {
      if(boxes[0]?.stream !== "" || boxes[0]?.stream !== undefined){
        const filterData = subjectsAll?.filter((item:any)=> item?.class_id  === boxes[0]?.class_id && item?.stream === value )
        setSubjects(filterData)
      }
    }
   
    setBoxes(newBoxes);
    if (field === "class_id") {
      getData(`/class/get/${value}`).then((response: any) => {
        if (response.status === 200) {
          setParticularClass(response.data.class_name);
        } else setParticularClass("");
      });
    }
  };
  // const handleInputChange1 = (
  //   index: number,
  //   field: keyof Boxset,
  //   value: any
  // ) => {
  //   // setenddateInvalid(value)
  //   const newBoxes: any = [...boxes1];
  //   newBoxes[index][field] = value;
  //   setBoxes1(newBoxes);
  // };
  console.log("test log",boxes,boxes1)
  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="main-wrapper">
        <div className="main-content">
        <div className="card">
          <div className="card-body">
            <div className="table_wrapper">
              <div className="table_inner">
                <div
                  className="containerbutton"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="h6" sx={{ m: 1 }}>
                    {/* <div className='main_title'>Teacher</div> */}
                  </Typography>
                </div>
                <div className="mt-5">
      <form>
        {boxes?.map((box, index) => (
          <div
            className="row align-items-center"
            key={box.id}
            style={{ marginBottom: "5px" }}
          >
            <div className="col form_field_wrapper">
              <FormControl
                required
                sx={{ m: 1, minWidth: 70, width: "100%", maxWidth: 200 }}
              >
                <InputLabel>Institute Type</InputLabel>
                <Select
                  value={box.institute_type}
                  sx={{
                    backgroundColor: "#f5f5f5",
                  }}
                  onChange={(e) =>
                    handleInputChange(index, "institute_type", e.target.value)
                  }
                  label="Institute Type"
                >
                  <MenuItem
                    value="school"
                    sx={{
                      backgroundColor: inputfield(namecolor),
                      color: inputfieldtext(namecolor),
                      "&:hover": {
                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                      },
                    }}
                  >
                    School
                  </MenuItem>
                  <MenuItem
                    value="college"
                    sx={{
                      backgroundColor: inputfield(namecolor),
                      color: inputfieldtext(namecolor),
                      "&:hover": {
                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                      },
                    }}
                  >
                    College
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {box.institute_type == "school" && (
              <div className="col form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 70, width: "100%", maxWidth: 200 }}
                >
                  <InputLabel>Board</InputLabel>
                  <Select
                    value={box.board}
                    sx={{
                      backgroundColor: "#f5f5f5",
                    }}
                    onChange={(e) =>
                      handleInputChange(index, "board", e.target.value)
                    }
                    label="Board"
                  >
                    <MenuItem
                      value="cbse"
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        "&:hover": {
                          backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                        },
                      }}
                    >
                      CBSE
                    </MenuItem>
                    <MenuItem
                      value="icse"
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        "&:hover": {
                          backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                        },
                      }}
                    >
                      ICSE
                    </MenuItem>
                    <MenuItem
                      value="state_board"
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        "&:hover": {
                          backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                        },
                      }}
                    >
                      State Board
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}
            {box.board == "state_board" && box.institute_type !== "college" && (
              <div className="col form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 70, width: "100%", maxWidth: 200 }}
                >
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state_for_stateboard"
                    value={box.state_for_stateboard.toLowerCase()}
                    sx={{
                      backgroundColor: "#f5f5f5",
                    }}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "state_for_stateboard",
                        e.target.value
                      )
                    }
                    label="State"
                  >
                    {stateOptions.map((state: any) => (
                      <MenuItem
                        key={state.value}
                        value={state.label.toLowerCase()}
                        sx={{
                          backgroundColor: inputfield(namecolor),
                          color: inputfieldtext(namecolor),
                          "&:hover": {
                            backgroundColor: inputfieldhover(namecolor),
                          },
                        }}
                      >
                        {state.label}
                      </MenuItem>
                    ))}
                    <MenuItem
                      key={1}
                      value={1}
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        "&:hover": {
                          backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                        },
                      }}
                    >
                      Others
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}

            {box.institute_type == "college" && (
              <div className="col form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 220, width: "100%" }}
                >
                  <InputLabel>University name</InputLabel>
                  <Select
                    value={box.university_id}
                    sx={{
                      backgroundColor: "#f5f5f5",
                    }}
                    onChange={(e) =>
                      handleInputChange(index, "university_id", e.target.value)
                    }
                    label="University Name"
                  >
                    {university.map((item) => (
                      <MenuItem
                        key={item?.university_id}
                        value={item?.university_id}
                        sx={{
                          backgroundColor: inputfield(namecolor),
                          color: inputfieldtext(namecolor),
                          "&:hover": {
                            backgroundColor: inputfieldhover(namecolor),
                          },
                        }}
                      >
                        {item.university_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}



            {box.institute_type == "college" && (
              <div className="col form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 220, width: "100%" }}
                >
                  <InputLabel>Institute Name</InputLabel>
                  <Select
                    name="institute_id"
                    value={box.institute_id}
                    sx={{
                      backgroundColor: "#f5f5f5",
                    }}
                    onChange={(e) =>
                      handleInputChange(index, "institute_id", e.target.value)
                    }
                    label="Institute Name"
                  >
                    {institutes.map((institute) => (
                      <MenuItem
                        key={institute.id}
                        value={institute.id}
                        sx={{
                          backgroundColor: inputfield(namecolor),
                          color: inputfieldtext(namecolor),
                          "&:hover": {
                            backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                          },
                        }}
                      >
                        {institute.institution_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
            {box.institute_type == "college" && (
              <div className="col form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 220, width: "100%" }}
                >
                  <InputLabel>Course</InputLabel>
                  <Select
                    value={box.course_id}
                    sx={{
                      backgroundColor: "#f5f5f5",
                    }}
                    onChange={(e) =>
                      handleInputChange(index, "course_id", e.target.value)
                    }
                    label="Course"
                  >
                    {courses.map((course) => (
                      <MenuItem
                        key={course.id}
                        value={course.id}
                        sx={{
                          backgroundColor: inputfield(namecolor),
                          color: inputfieldtext(namecolor),
                          "&:hover": {
                            backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                          },
                        }}
                      >
                        {course.course_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
            {box.institute_type == "college" && (
              <div className="col-lg-3 form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 220, width: "100%" }}
                >
                  <InputLabel>Semester</InputLabel>
                  <Select
                    value={box.sem_id}
                    sx={{
                      backgroundColor: "#f5f5f5",
                    }}
                    onChange={(e) =>
                      handleInputChange(index, "sem_id", e.target.value)
                    }
                    label="Semester"
                  >
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
                </FormControl>
              </div>
            )}
            {box.institute_type == "school" && (
              <div className="col form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 220, width: "100%" }}
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
                  >
                    {/* {classes.map((classes) => (
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
                    ))} */}
                    {classes
  .sort((a, b) => a.class_name.localeCompare(b.class_name)) // Sorts by class_name in ascending order
  .map((classes) => (
    <MenuItem
      key={classes.id}
      value={classes.id}
      sx={{
        backgroundColor: inputfield(namecolor),
        color: inputfieldtext(namecolor),
        "&:hover": {
          backgroundColor: inputfieldhover(namecolor),
        },
      }}
    >
      {classes.class_name}
    </MenuItem>
  ))}
                  </Select>
                </FormControl>
              </div>
            )}
            {box.institute_type == "school" &&
              (particularClass === "class_11" ||
                particularClass === "class_12") && (
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
          {box.institute_type && (

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
              </FormControl>
            </div>
          )}
            
            {/* {box.institute_type === "college" && (
              <div
                className={`${box.institute_id == "1" ? "col-lg-3" : "col-lg-3 col-md-6"
                  } form_field_wrapper`}
              >
                <FormControl
                  required
                  sx={{
                    m: 1,
                    minWidth: 180,
                    // width: "100%",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={["year"]}
                      format="YYYY"
                      label="Year *"
                      sx={{
                        backgroundColor: "#f5f5f5",
                      }}
                      value={dayjs(box.year)}
                      onChange={(date) =>
                        handleInputChange(index, "year", date)
                      }
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
            )} */}
          </div>
        ))}
      
        {/* <div className="mt-3 d-flex align-items-center justify-content-between">
          <button
            type="button"
            className="btn btn-dark px-lg-5 ms-auto d-block rounded-pill next-btn"
            // onClick={() => saveAcademy(0)}
          >
            save
          </button>
        </div> */}
      </form>
    </div>
                <div
                  style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
                >
                  {/* <FormControl sx={{ minWidth: 300 }}>
                    <InputLabel
                      id="select-class-label"
                      sx={{ color: inputfieldtext(namecolor) }}
                    >
                      Select class *
                    </InputLabel>
                    <Select
                      labelId="select-class-label"
                      value={selectedClass}
                      onChange={handleChange}
                      label="Select class *"
                      variant="outlined"
                      name="class_id"
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                      }}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            backgroundColor: inputfield(namecolor),
                            color: inputfieldtext(namecolor),
                          },
                        },
                      }}
                    >
                      {classes?.map((classes) => (
                        <MenuItem
                          key={classes.class_name}
                          value={classes.class_name}
                          sx={{
                            backgroundColor: inputfield(namecolor),
                            color: inputfieldtext(namecolor),
                            "&:hover": {
                              backgroundColor: inputfieldhover(namecolor), 
                            },
                          }}
                        >
                          {classes?.new_class_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl> */}
                  <div className="custbutton">
                    <Button
                      variant="contained"
                      component="label"
                      className="custom-button mainbutton"
                    >
                      Upload PDFs
                      <input
                        type="file"
                        accept=".pdf"
                        hidden
                        multiple
                        onChange={handleFileChange}
                      />
                    </Button>
                  </div>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="file-list-container">
                    <div className="file-columns">
                      <div className="file-column">
                        {firstBatch.map((file, index) => (
                          <div
                            key={index}
                            className="file-item"
                            //  onClick={() => setSelectedPdf(URL.createObjectURL(file))}
                          >
                            {file.name}
                          </div>
                        ))}
                      </div>
                      <div className="file-column">
                        {secondBatch.map((file, index) => (
                          <div
                            key={index}
                            className="file-item"
                            // onClick={() => setSelectedPdf(URL.createObjectURL(file))}
                          >
                            {file.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  className={`${
                    selectedFiles.length === 0
                      ? "disabled-mainbutton"
                      : "mainbutton"
                  }`}
                  sx={{ marginTop: 5 }}
                  variant="contained"
                  onClick={handleFileUpload}
                  disabled={selectedFiles.length === 0}
                >
                  Submit
                </Button>
              </div>
              {/* {selectedPdf && (
                                    <div className='pdfView'>
                                    <button onClick={handleClose} className='closeButton'>
                                      &times; 
                                    </button>
                                    <iframe src={selectedPdf} width="100%" height="800px" />
                                  </div>
                                     )} */}
            </div>
          </div>
        </div>
        </div>
        
      </div>
    </>
  );
};

export default Uploadpdf;
