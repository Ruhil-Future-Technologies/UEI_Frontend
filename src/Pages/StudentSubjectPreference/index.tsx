import React, { useContext, useEffect, useState } from "react";

import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import { deepEqual, inputfield, inputfieldhover, inputfieldtext, tabletools } from "../../utils/helpers";
import NameContext from "../Context/NameContext";

// Define interfaces for Box, Course, and Subject
interface Box {
  id: number;
  course_id: string;
  subject_id: string;
  preference: string;
  score_in_percentage: string;
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

const StudentSubjectPreference = () => {
  const context = useContext(NameContext);
  const {namecolor }:any = context;
  const { getData, postData, putData, deleteData } = useApi();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [boxes11, setBoxes11] = useState<Box[]>([]);
  let StudentId = localStorage.getItem("_id");
  const [subjectPreferences, setSubjectPreferences] = useState([]);
  const [editFalg, setEditFlag] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  // const [pervalidet, setpervalidet] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: number]: { [key: string]: boolean } }>({});
  const [initialState, setInitialState] = useState<any | null>({});

  // Fetch data from the endpoints
  const getCourse = async () => {
  getData("/course/list")
    .then((response: any) => {
      if (response.status === 200) {
        const filteredData = response?.data?.filter((item:any) => item?.is_active === 1);
        setCourses(filteredData ||[]);
        // setCourses(response.data);
      }
    })
    .catch((e) => {
      toast.error(e?.message, {
        hideProgressBar: true,
        theme: "colored",
      });
    });
  }
  const getSubject = async () => {
  getData("/subject/list")
    .then((response: any) => {
      if (response.status === 200) {
        const filteredData = response?.data?.filter((item:any) => item?.is_active === 1);
        setSubjects(filteredData ||[]);
        // setSubjects(response.data);
      }
    })
    .catch((e) => {
      toast.error(e?.message, {
        hideProgressBar: true,
        theme: "colored",
      });
    });
  }
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
      });
    });
  }
  const getPrefrencelist = async () => {
  getData("/subject_preference/edit/" + StudentId)
    .then((data: any) => {
      console.log(data);
      if (data?.status === 200) {
        data.data.map((item: any, index: number) => {
          const newBox: Box = {
            id: item.id,
            course_id: item?.course_id,
            subject_id: item?.subject_id,
            preference: item?.preference,
            score_in_percentage: item?.score_in_percentage,
          };
          if (!boxes.some((box) => box.id === newBox.id)) {
            // setBoxes([...boxes, newBox]);
            setBoxes((prevBoxes) => [...prevBoxes, newBox]);
            setInitialState({
              course_id: String(item?.course_id),
              subject_id: String(item?.subject_id),
              preference: item?.preference,
              score_in_percentage: item?.score_in_percentage,
              student_id:String(item?.student_id)

            })
            setBoxes11((prevBoxes) => [...prevBoxes, newBox]);
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
          },
        ]);
        setEditFlag(true);
      }else{
        // empty
      }
    })
    .catch((e) => {
      toast.error(e?.message, {
        hideProgressBar: true,
        theme: "colored",
      });
    });
  }
  useEffect(() => {
    getCourse()
    getSubject()
    getPrefrence()
    getPrefrencelist()

  }, []);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newBoxes: any = [...boxes];
    const newValidationErrors = { ...validationErrors };

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
    
  };

  const addRow = () => {
    const newBox: Box = {
      id: 0,
      course_id: "",
      subject_id: "",
      preference: "",
      score_in_percentage: "",
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
          });
          setBoxes(boxes.filter((box, index) => index !== indx));
        })
        .catch((e) => {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    } else {
      toast.success("Data Deleted Successfully", {
        hideProgressBar: true,
        theme: "colored",
      });
      console.log("Data Deleted Successfully", boxes,indx)
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    // const eqq = deepEqual(boxes11,boxes)
    // console.log("test data11111",boxes11,boxes,eqq)
    // if(!eqq === true)  {
    let initial = {}
    try {
      const promises = boxes.map(async (box) => {
        const submissionData = {
          student_id: StudentId,
          course_id: String(box.course_id),
          subject_id: String(box.subject_id),
          preference: box.preference,
          score_in_percentage: box.score_in_percentage,
        };
        initial = submissionData
        const eq = deepEqual(initialState,submissionData)
        console.log("test data",eq,initialState,submissionData,editFalg,box.id)
        if (editFalg) {
          return postData("/subject_preference/add", submissionData);
        } else {
          if (box.id === 0) {
            if(!eq === true)  {
            
            return postData("/subject_preference/add", submissionData);
            }
          } else {
             // eslint-disable-next-line no-lone-blocks
             {if(!eq === true)  {
             
               return putData("/subject_preference/edit/" + box.id, submissionData)

             }else{
           
                return Promise.resolve(undefined); // Skip update, return null
           

               
             }
          }
          }
        }
      });
  
      // Wait for all API calls to complete
      const results = await Promise.all(promises);
  
      // Check if all calls were successful
      const filteredResults = results.filter(result => result !== null && result !== undefined);
      const allSuccessful = filteredResults.every(result => result?.status === 200);
      
      console.log("test data allSuccessful",allSuccessful,results)
      if (allSuccessful) {
        toast.success("Subject Preference save successfully", {
          hideProgressBar: true,
          theme: "colored",
        })
        setInitialState(initial)
        // getPrefrencelist()
        // setBoxes11(boxes)
        
      } else {
        // toast.error("Some entries failed to save", {
        //   hideProgressBar: true,
        //   theme: "colored",
        // });
        // getPrefrencelist()
        setInitialState(initial)
        // setBoxes11(boxes)
      }
    } catch (error: any) {
      toast.error(error?.message, {
        hideProgressBar: true,
        theme: "colored",
      });
    // }
  }
  };
  
  return (
    <div className="mt-5">
      <form onSubmit={handleSubmit}>
        {boxes.map((box, index) => (
          <div
            className="row d-flex align-items-center"
            key={box.id}
            style={{ marginBottom: "5px" }}
          >
            <div className="col form_field_wrapper">
              <FormControl required sx={{ m: 1, minWidth: 220, width: "100%" }}>
                <InputLabel>Course</InputLabel>
                <Select
                  name="course_id"
                  value={box.course_id}
                  onChange={(e) =>
                    handleInputChange(index, "course_id", e.target.value)
                  }
                  label="Course"
                >
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}
                    sx={{
                      backgroundColor: inputfield(namecolor),
                      color: inputfieldtext(namecolor),
                      '&:hover': {
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
            <div className="col form_field_wrapper">
              <FormControl required sx={{ m: 1, minWidth: 220, width: "100%" }}>
                <InputLabel>Subject</InputLabel>
                <Select
                  name="subject_id"
                  value={box.subject_id}
                  onChange={(e) =>
                    handleInputChange(index, "subject_id", e.target.value)
                  }
                  label="Subject"
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}
                    sx={{
                      backgroundColor: inputfield(namecolor),
                      color: inputfieldtext(namecolor),
                      '&:hover': {
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
            <div className="col form_field_wrapper">
              <FormControl sx={{ m: 1, minWidth: 180, width: "100%" }}>
                <TextField
                  name="preference"
                  value={box.preference}
                  onChange={(e) =>
                    handleInputChange(index, "preference", e.target.value)
                  }
                  label="Preference"
                  required
                />
              </FormControl>
            </div>
            <div className="col form_field_wrapper" style={{paddingTop:validationErrors[index]?.score_in_percentage ? 78 : ""}}>
              <FormControl sx={{ m: 1, minWidth: 180, width: "100%" }}>
                <TextField
               
                  name="score_in_percentage"
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
                />
                    {validationErrors[index]?.score_in_percentage && (
                  <p style={{ color: 'red' }}>
                    Score in Percentage must be a number between 0 and 100 with up to two decimal places.
                  </p>
                )}
              </FormControl>
            
            </div>
            <div className="col form_field_wrapper">
              <IconButton
                onClick={addRow}
                sx={{ width: "35px", height: "35px", color: tabletools(namecolor) }}
              >
                <AddIcon />
              </IconButton>
              {boxes.length !== 1 && (
                <IconButton
                  onClick={() => deleteRow(box.id, index)}
                  sx={{ width: "35px", height: "35px",  color: tabletools(namecolor) }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          </div>
        ))}
        <div className="row justify-content-center">
          <div className="col-3">
            <Button
            className="mainbutton"
              variant="contained"
              color="primary"
              type="submit"
              style={{ marginTop: "25px" }}
            >
              Save Subject Preference
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};


export default StudentSubjectPreference;

