import React, { useContext, useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import "react-toastify/dist/ReactToastify.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import useApi from "../../hooks/useAPI";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import NameContext from "../Context/NameContext";
import {
  inputfield,
  inputfieldhover,
  inputfieldtext,
  tabletools,
  deepEqual,
} from "../../utils/helpers";
import { Country, State, City } from "country-state-city";
import { ChildComponentProps } from "../StudentProfile";

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
}
interface Boxset {
  id: number;
  Institute_Name_Add: string;
}
interface Institute {
  id: number;
  institute_id: string;
  institution_name: string;
}

interface Course {
  id: number;
  course_name: string;
  course_id: string;
}
interface Classes {
  id: number;
  class_name: string;
  class_id: string;
}

const Boxsetvalue = {
  id: 0,
  Institute_Name_Add: "",
};
interface Option {
  value: string;
  label: string;
}

const AcademicHistory: React.FC<ChildComponentProps> = ({ setActiveForm }) => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const { getData, postData, putData, deleteData } = useApi();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [checkBoxes, setCheckBoxes] = useState<Box[]>([]);
  const [boxes1, setBoxes1] = useState<Boxset[]>([Boxsetvalue]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [particularClass, setParticularClass] = useState("");
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const [idInstitute, setIdInstitute] = useState();
  const [insituteFlag, setInsituteFlag] = useState<boolean>(false);
  const [enddateInvalidList, setEnddateInvalidList] = useState<boolean[]>([]);
  const [stateOptions, setStateOptions] = useState<Option[]>([]);

  let StudentId = localStorage.getItem("_id");

  useEffect(() => {
    const states = State.getStatesOfCountry("IN");
    const stateOptions = states.map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
    setStateOptions(stateOptions);
  }, [State]);

  const addRow = () => {
    const newBox: Box = {
      id: 0,
      institute_type: "",
      board: "",
      state_for_stateboard: "",
      class_id: "",
      institute_id: "",
      course_id: "",
      learning_style: "",
      year: "",
      stream: "",
      //   starting_date: null,
      //   ending_date: null,
    };
    setBoxes([...boxes, newBox]);
  };

  const deleterow = (id: number, indx: number) => {
    if (id !== 0) {
      deleteData(`/new_student_academic_history/delete/${id}`)
        .then((data: any) => {
          if (data.status === 200) {
            toast.success("Academic history deleted successfully", {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
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
    setBoxes(boxes.filter((box, index) => index !== indx));
  };

  const listData = async () => {
    return new Promise((resolve) => {
      getData("/institution/list")
        .then(async (response: any) => {
          if (response.status === 200) {
            const filteredData = await response?.data?.filter(
              (item: any) => item?.is_active === 1
            );
            setInstitutes(filteredData || []);
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

  useEffect(() => {
    listData();

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

    // getData(`${"student_academic_history/edit/" + StudentId}`)
    //   .then((data: any) => {
    //     if (data?.status === 200) {
    //       data?.data?.forEach((item: any) => {
    //         const newBox = {
    //           id: item?.id,
    //           institute_type: item?.institution_type,
    //           board: item?.board,
    //           state_for_stateboard: item?.state_for_stateboard,
    //           institute_id: item?.institute_id,
    //           course_id: item?.course_id,
    //           learning_style: item?.learning_style,
    //           class_id: item?.class_id,
    //           year: item?.year ? dayjs(item?.year) : null,
    //         };
    //         if (!boxes.some((box) => box.id === newBox.id)) {
    //           setBoxes((prevBoxes) => [...prevBoxes, newBox]);
    //         }
    //       });
    //     } else if (data?.status === 404) {
    //       setBoxes([
    //         {
    //           id: 0,
    //           institute_type: "",
    //           board: "",
    //           state_for_stateboard: "",
    //           institute_id: "",
    //           course_id: "",
    //           learning_style: "",
    //           class_id: "",
    //           year: null,
    //         },
    //       ]);
    //       setEditFlag(true);
    //     } else {
    //       console.error("Unexpected response:", data);
    //     }
    //   })
    //   .catch((error) => {
    //     toast.error(error?.message, {
    //       hideProgressBar: true,
    //       theme: "colored",
    //     });
    //   });
    getData(`${"new_student_academic_history/get/" + StudentId}`)
      .then((data: any) => {
        if (data?.status === 200) {
          getData(`/class/get/${data?.data?.[0]?.class_id}`).then(
            (response: any) => {
              if (response.status === 200) {
                setParticularClass(response.data.class_name);
              } else setParticularClass("");
            }
          );
          data?.data?.forEach((item: any) => {
            const newBox = {
              id: item?.id,
              institute_type: item?.institution_type,
              board: item?.board,
              state_for_stateboard: item?.state_for_stateboard,
              institute_id: item?.institute_id,
              course_id: item?.course_id,
              learning_style: item?.learning_style,
              class_id: item?.class_id,
              year: item?.year ? dayjs(item?.year) : null,
              stream: item?.stream,
            };
            if (!boxes.some((box) => box.id === newBox.id)) {
              setBoxes((prevBoxes) => [...prevBoxes, newBox]);
              setCheckBoxes((prevBoxes) => [...prevBoxes, newBox]);
            }
          });
        } else if (data?.status === 404) {
          setBoxes([
            {
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
            },
          ]);
          setEditFlag(true);
        } else {
          console.error("Unexpected response:", data);
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

  const saveAcademicHistory = async (instituteId: number = 0) => {
    // event: React.FormEvent<HTMLFormElement>
    // event.preventDefault();
    // const validatePayload = (
    //   payload: { [s: string]: unknown } | ArrayLike<unknown>
    // ) => {
    //   return Object.values(payload).map((value: any) => {
    //     console.log(value);

    //     // debugger;
    //     // if (value == "college") {
    //     //   // value !== ""
    //     //   isDateValid(value.year);
    //     // }
    //   });
    // };
    const validatePayload = (college: string, year: string) => {
      if (college == "college") {
        return isDateValid(year);
      } else {
        return true;
      }
    };

    // const promises = boxes
    //   .map((box) => {
    //     const payload = {
    //       student_id: StudentId,
    //       institution_type: box.institute_type,
    //       board: box.board,
    //       state_for_stateboard: box.state_for_stateboard,
    //       institute_id: String(!box.institute_id ? 95 : box.institute_id),
    //       course_id: String(!box.course_id ? 18 : box.course_id),
    //       learning_style: box.learning_style,
    //       class_id: String(!box.class_id ? 1 : box.class_id),
    //       year: String(box?.year?.$y), // Assuming 'year' is a string
    //     };
    // validatePayload(payload

    const isDateValid = (year: string) => {
      return (
        dayjs(year).isBefore(dayjs(year)) || dayjs(year).isSame(dayjs(year))
      );
    };
    const promises = boxes
      .map((box) => {
        const payload = {
          student_id: StudentId,
          institution_type: box.institute_type,
          board: box.board,
          state_for_stateboard: box.state_for_stateboard,
          institute_id: String(
            instituteId || (!box.institute_id ? 95 : box.institute_id)
          ),
          course_id: String(!box.course_id ? 18 : box.course_id),
          learning_style: box.learning_style,
          class_id: String(!box.class_id ? 1 : box.class_id),
          year: String(box?.year?.$y), // Assuming 'year' is a string
          stream:
            particularClass === "class_11" || particularClass === "class_12"
              ? box?.stream
              : "",
        };

        //validatePayload(payload)
        if (validatePayload(payload.institution_type, payload.year)) {
          if (editFlag || box.id === 0) {
            return postData("/new_student_academic_history/add", payload);
          } else {
            return putData(
              "/new_student_academic_history/edit/" + box.id,
              payload
            );
          }
        } else {
          toast.error(" PLease Enter Year ", {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center",
          });
          return Promise.resolve(null); // If payload is invalid, return a resolved promise
        }
      })
      .filter((promise) => promise !== null);

    Promise.all(promises)
      .then((responses) => {
        // Check if all responses have a status of 200
        const allSuccessful = responses.every(
          (response) => response?.status === 200
        );

        if (allSuccessful) {
          if (editFlag) {
            toast.success("Academic history saved successfully", {
              hideProgressBar: true,
              theme: "colored",
              position: "top-center",
            });
            setActiveForm((prev) => prev + 1);
          } else {
            const isEqual = deepEqual(checkBoxes[0], boxes[0]);
            if (!isEqual) {
              toast.success("Academic history updated successfully", {
                hideProgressBar: true,
                theme: "colored",
                position: "top-center",
              });
            }
            setActiveForm((prev) => prev + 1);
          }
        } else {
          toast.error("An error occurred while saving", {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center",
          });
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error processing payloads:", error);
        // toast.error("An error occurred while saving", {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
      });
  };

  const setDataInsitute = async (value: any) => {
    setInsituteFlag(true);
  };

  const saveAcademy = async (index: number) => {
    if (boxes1[0].Institute_Name_Add) {
      try {
        const validatePayload = (
          payload: { [s: string]: unknown } | ArrayLike<unknown>
        ) => {
          return Object.values(payload).every((value) => value !== "");
        };

        const promises = boxes1
          .map((box) => {
            const payload = {
              institution_name: box.Institute_Name_Add,
            };

            if (validatePayload(payload)) {
              if (editFlag || box.id === 0) {
                return postData("/institution/add", payload);
              } else {
                return postData("/institution/add", payload);
              }
            } else {
              return Promise.resolve(null);
            }
          })
          .filter((promise) => promise !== null);

        const responses = await Promise.all(promises);

        const allSuccessful = responses.every(
          (response) => response?.status === 200
        );

        if (allSuccessful) {
          setIdInstitute(responses[0].institution.id);
          // setBoxes([...boxes, { institute_id: responses[0]?.institution?.id }]);
          const newBoxes: any = [...boxes];
          newBoxes[index]["institute_id"] = responses[0].institution.id;
          saveAcademicHistory(responses[0].institution.id);
          setBoxes(newBoxes);
          setBoxes1([
            {
              id: 0,
              Institute_Name_Add: "",
            },
          ]);
          // setBoxes((prevBoxes) => [...prevBoxes, { institute_id: responses[0]?.institution?.id }]);

          await listData();
          toast.success("Institution name saved successfully", {
            hideProgressBar: true,
            theme: "colored",
            position: "top-center",
          });
          setDataInsitute(boxes1[0]?.Institute_Name_Add);
        }
      } catch (error) {
        console.error("Error while saving academy", error);
        toast.error("Error while saving institution name", {
          hideProgressBar: true,
          theme: "colored",
          position: "top-center",
        });
      }
    } else saveAcademicHistory();
  };

  const handleInputChange = (
    index: number,
    field: keyof Box,
    value: string | dayjs.Dayjs | null
  ) => {
    const newBoxes = [...boxes];
    newBoxes[index] = { ...newBoxes[index], [field]: value };

    // Check date validity
    const year = dayjs(newBoxes[index].year);
    // const endDate = dayjs(newBoxes[index].ending_date);

    const newEnddateInvalidList = [...enddateInvalidList];
    if (
      year.isValid()
      //   endDate.isValid() &&
      //   endDate.isBefore(startDate)
    ) {
      newEnddateInvalidList[index] = true;
    } else {
      newEnddateInvalidList[index] = false;
    }

    setBoxes(newBoxes);
    setEnddateInvalidList(newEnddateInvalidList);
    if (field === "class_id") {
      getData(`/class/get/${value}`).then((response: any) => {
        if (response.status === 200) {
          setParticularClass(response.data.class_name);
        } else setParticularClass("");
      });
    }
  };
  const handleInputChange1 = (
    index: number,
    field: keyof Boxset,
    value: any
  ) => {
    // setenddateInvalid(value)
    const newBoxes: any = [...boxes1];
    newBoxes[index][field] = value;
    setBoxes1(newBoxes);
  };

  return (
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
                  {/* <MenuItem
                    value="competition_exams"
                    sx={{
                      backgroundColor: inputfield(namecolor),
                      color: inputfieldtext(namecolor),
                      "&:hover": {
                        backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                      },
                    }}
                  >
                    Competition Exams
                  </MenuItem> */}
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
                    value={box.state_for_stateboard}
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
                    {stateOptions.map((state) => (
                      <MenuItem
                        key={state.value}
                        value={state.label}
                        sx={{
                          backgroundColor: inputfield(namecolor),
                          color: inputfieldtext(namecolor),
                          "&:hover": {
                            backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
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
                  <InputLabel>University Name</InputLabel>
                  <Select
                    name="institute_id"
                    value={box.institute_id}
                    sx={{
                      backgroundColor: "#f5f5f5",
                    }}
                    onChange={(e) =>
                      handleInputChange(index, "institute_id", e.target.value)
                    }
                    label="University Name"
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
                  {/* <div> {!box.institute_id && (
                        <p style={{ marginLeft: "10px", color: 'red' }}>Please select a Department name.</p>
                    )}</div> */}
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
            {box.institute_id == "1" && (
              <div className="col form_field_wrapper">
                <FormControl sx={{ m: 1, minWidth: 180, width: "100%" }}>
                  {boxes1.map((box, index) => (
                    <TextField
                      key={box.id}
                      name="Institute_Name_Add"
                      sx={{
                        backgroundColor: "#f5f5f5",
                      }}
                      value={box.Institute_Name_Add}
                      onChange={(e) =>
                        handleInputChange1(
                          index,
                          "Institute_Name_Add",
                          e.target.value
                        )
                      }
                      label="Institute Name"
                    />
                  ))}
                </FormControl>
                {/* <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => saveAcademi(index)}
                    style={{ marginTop: "25px" }}
                  >
                    Save Institute Name
                  </Button>
                </div> */}
              </div>
            )}
            {box.institute_type === "college" && (
              <div className="col-lg-3 form_field_wrapper">
                <FormControl
                  required
                  sx={{ m: 1, minWidth: 70, width: "100%", maxWidth: 200 }}
                >
                  <InputLabel>Learning Style</InputLabel>
                  <Select
                    value={box.learning_style}
                    sx={{
                      backgroundColor: "#f5f5f5",
                    }}
                    onChange={(e) =>
                      handleInputChange(index, "learning_style", e.target.value)
                    }
                    label="Learning Style"
                  >
                    <MenuItem
                      value="online"
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        "&:hover": {
                          backgroundColor: inputfieldhover(namecolor),
                        },
                      }}
                    >
                      Online
                    </MenuItem>
                    <MenuItem
                      value="offline"
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        "&:hover": {
                          backgroundColor: inputfieldhover(namecolor),
                        },
                      }}
                    >
                      Offline
                    </MenuItem>
                    <MenuItem
                      value="any"
                      sx={{
                        backgroundColor: inputfield(namecolor),
                        color: inputfieldtext(namecolor),
                        "&:hover": {
                          backgroundColor: inputfieldhover(namecolor),
                        },
                      }}
                    >
                      Any
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            )}
            {box.institute_type === "college" && (
              <div
                className={`${
                  box.institute_id == "1" ? "col-lg-3" : "col-lg-3 col-md-6"
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
            )}
          </div>
        ))}
        {/* <div className="row justify-content-center">
          <div className="col-3">
            <Button
              className="mainbutton"
              variant="contained"
              color="primary"
              type="submit"
              // onClick={saveAcademicHistory}
              style={{ marginTop: "25px" }}
            >
              Save Academic History
            </Button>
          </div>
        </div> */}
        <div className="mt-3 d-flex align-items-center justify-content-between">
          <button
            type="button"
            className="btn btn-outline-dark prev-btn px-lg-4 rounded-pill"
            onClick={() => setActiveForm((prev) => prev - 1)}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-dark px-lg-5 ms-auto d-block rounded-pill next-btn"
            onClick={() => saveAcademy(0)}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default AcademicHistory;
