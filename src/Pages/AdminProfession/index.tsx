import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import { useEffect, useState } from "react";
import useApi from "../../hooks/useAPI";
import { toast } from "react-toastify";
import {
  deepEqual,
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from "../../utils/helpers";
import NameContext from "../Context/NameContext";

interface PropsItem {
  setActiveForm: React.Dispatch<React.SetStateAction<number>>;
  handleReset: () => Promise<void>;
}
// console.log(adminId);

const AdminProfession: React.FC<PropsItem> = ({
  setActiveForm,
  handleReset,
}) => {
  const context = React.useContext(NameContext);
  const { namecolor }: any = context;
  let adminId = localStorage.getItem("_id");
  const { getData, postData, putData } = useApi();
  const [institude, setInstitude] = React.useState<
    [{ id: string; institution_name: string }]
  >([{ id: "", institution_name: "" }]);
  const [selectInstitude, setSelectInstitude] = React.useState("");
  const [course, setCourse] = React.useState<
    [{ id: string; course_name: string }]
  >([{ id: "", course_name: "" }]);
  const [selectCourse, setSelectCourse] = React.useState("");
  const [subject, setSubject] =
    React.useState<[{ id: string; subject_name: string }]>();
  const [selectSubject, setSelectSubject] = React.useState("");
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const [initialState, setInitialState] = useState<any | null>({});
  const profilePercentage = localStorage.getItem("Profile_completion");
  const navigate = useNavigate();

  const handleInstiChange = (event: SelectChangeEvent<string>) => {
    setSelectInstitude(event.target.value);
  };
  const handleCourseChange = (event: SelectChangeEvent<string>) => {
    setSelectCourse(event.target.value);
  };
  const handleSubjectChange = (event: SelectChangeEvent<string>) => {
    setSelectSubject(event.target.value);
  };

  const getinstitutes = async () => {
    try {
      const response = await getData("institution/list");

      if (response?.status === 200) {
        const filteredData = response?.data?.filter(
          (item: any) => item?.is_active === 1
        );
        setInstitude(filteredData || []);
        // setInstitude(response?.data);
      }
    } catch (error: any) {
      console.error("error comes :", error?.response?.status);
      if (error?.response?.status === 401) {
        toast.warning("Please login again", {
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error("Request failed", {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  };

  const getCourse = async () => {
    try {
      const response = await getData("course/list");
      if (response?.status === 200) {
        const filteredData = response?.data?.filter(
          (item: any) => item?.is_active === 1
        );
        setCourse(filteredData || []);
        // setCourse(response?.data);
      }
    } catch (error: any) {
      // console.error("error comes :", error.response.status);
      if (error?.response?.status === 401) {
        toast.warning("Please login again ", {
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error("Request failed", {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  };

  const getSubject = async () => {
    
    // try {
    //   const response = await getData("subject/list");

    //   if (response?.status === 200) {
    //     const filteredData = response?.data?.filter(
    //       (item: any) => item?.is_active === 1
    //     );
    //     setSubject(filteredData || []);
       
    //   }
    // } catch (error: any) {
      
    //   if (error?.response?.status === 401) {
    //     toast.warning("Please login again", {
    //       hideProgressBar: true,
    //       theme: "colored",
    //     });
    //   } else {
    //     toast.error("Request failed", {
    //       hideProgressBar: true,
    //       theme: "colored",
    //     });
    //   }
    // }
  };

  const getProfation = async () => {
    try {
      const response = await getData("admin_profession/edit/" + adminId);

      if (response?.status === 200) {
        setSelectInstitude(response?.data?.institution_id);
        setSelectCourse(response?.data?.course_id);
        setSelectSubject(response?.data?.subject_id);
        setInitialState({
          admin_id: adminId,
          institution_id: response?.data.institution_id,
          course_id: response?.data?.course_id,
          subject_id: response?.data?.subject_id,
        });
      } else if (response?.status === 404) {
        setEditFlag(true);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.warning("Please login again", {
          hideProgressBar: true,
          theme: "colored",
        });
      } else {
        toast.error("Request failed", {
          hideProgressBar: true,
          theme: "colored",
        });
      }
    }
  };

  useEffect(() => {
    getinstitutes();
    getCourse();
    getSubject();
    getProfation();
  }, [adminId]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let payload = {
      admin_id: adminId,
      institution_id: selectInstitude,
      course_id: selectCourse,
      subject_id: selectSubject,
    };
    // console.log(paylod);

    const eq = deepEqual(initialState, payload);    

    if (editFlag) {
      const saveData = async () => {
        try {
          const response = await postData("admin_profession/add", payload);

          if (response?.status === 200) {
            toast.success("Admin profession saved successfully", {
              hideProgressBar: true,
              theme: "colored",
            });
            handleReset();
            navigate("/");
          }
        } catch (error: any) {
          if (error?.response?.status === 401) {
            toast.warning("Please login again", {
              hideProgressBar: true,
              theme: "colored",
            });
          } else {
            toast.error("Request failed", {
              hideProgressBar: true,
              theme: "colored",
            });
          }
        }
      };
      saveData();
    } else if (!editFlag) {
      const editData = async () => {
        try {
          const response = await putData(
            "admin_profession/edit/" + adminId,
            payload
          );

          if (response?.status === 200) {
            toast.success("Admin profession updated successfully", {
              hideProgressBar: true,
              theme: "colored",
            });
            getProfation();
            if (profilePercentage !== "100") handleReset();
            navigate("/");
          } else {
            toast.error("somthing want wrong", {
              hideProgressBar: true,
              theme: "colored",
            });
          }
        } catch (error: any) {
          if (error?.response?.status === 401) {
            toast.warning("Please login again", {
              hideProgressBar: true,
              theme: "colored",
            });
          } else {
            toast.error("Request failed", {
              hideProgressBar: true,
              theme: "colored",
            });
          }
        }
      };
      // eslint-disable-next-line no-lone-blocks

      if (!eq) editData();
      else navigate("/");
    }
  };
  // console.log("testing",selectInstitude,selectCourse,selectSubject)

  return (
    <form>
      <div
        className="row d-flex justify-content-center"
        style={{ marginBottom: "5px" }}
      >
        <div className="col form_field_wrapper">
          <FormControl required sx={{ m: 1, minWidth: 220 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Institute
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectInstitude}
              sx={{
                backgroundColor: "#f5f5f5",
              }}
              onChange={handleInstiChange}
              label="Institute"
            >
              {institude?.map((institut) => (
                <MenuItem
                  key={institut?.id}
                  value={institut?.id}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  {institut?.institution_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <div> {!selectInstitude && (
            <p style={{marginLeft:"10px", color: 'red' }}>Please select an Institute.</p>
          )}</div> */}
        </div>
        <div className="col form_field_wrapper">
          <FormControl required sx={{ m: 1, minWidth: 220 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Course
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectCourse}
              sx={{
                backgroundColor: "#f5f5f5",
              }}
              onChange={handleCourseChange}
              label="Course"
              MenuProps={{
                // sx: {
                //   "& .MuiPaper-root": {
                //   // ml:"auto",

                //   }
                // },
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
              }}
            >
              {course?.map((data) => (
                <MenuItem
                  key={data?.id}
                  value={data?.id}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  {data?.course_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <div> {!selectCourse && (
            <p style={{marginLeft:"10px", color: 'red' }}>Please select a Course.</p>
          )}</div> */}
        </div>
        <div className="col form_field_wrapper">
          <FormControl required sx={{ m: 1, minWidth: 220 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Subject
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectSubject}
              sx={{
                backgroundColor: "#f5f5f5",
              }}
              onChange={handleSubjectChange}
              label="Subject"
            >
              {subject?.map((data) => (
                <MenuItem
                  key={data?.id}
                  value={data?.id}
                  sx={{
                    backgroundColor: inputfield(namecolor),
                    color: inputfieldtext(namecolor),
                    "&:hover": {
                      backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                    },
                  }}
                >
                  {data?.subject_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <div> {!selectSubject && (
            <p style={{marginLeft:"10px", color: 'red' }}>Please select a Subject.</p>
          )}</div> */}
        </div>
      </div>
      <div className="row justify-content-center" style={{ marginTop: "50px" }}>
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
            onClick={(e: any) => handleSubmit(e)}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default AdminProfession;
