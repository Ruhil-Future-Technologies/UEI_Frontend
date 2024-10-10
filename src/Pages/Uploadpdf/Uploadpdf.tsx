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
  Typography,
} from "@mui/material";
import { QUERY_KEYS_COURSE, QUERY_KEYS_SUBJECT } from "../../utils/const";
import FullScreenLoader from "../Loader/FullScreenLoader";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import NameContext from "../Context/NameContext";
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [dataSubject, setDataSubject] = useState([]);
  const [classes, setClasses] = useState<Classes[]>([]);

  const CourseURL = QUERY_KEYS_COURSE.GET_COURSE;
  const DeleteCourseURL = QUERY_KEYS_COURSE.COURSE_DELETE;
  const { getData, loading, postFileData } = useApi();

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
    }
  };

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No files selected");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("pdf_file", file);
    });
    if (AdminId !== null) {
      formData.append("teacher_id", AdminId);
      formData.append("class_name", selectedClass);
      // formData.append('subject_id', selectedSubject);
    }
    await postFileData(
      `${"https://uatllm.gyansetu.ai/upload-pdf-class"}`,
      formData
    )
      .then((data: any) => {
        if (data?.status === 201) {
          toast.success(data?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
          setSelectedFiles([]);
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
  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="dashboard">
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
                <div
                  style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
                >
                  <FormControl sx={{ minWidth: 300 }}>
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
                              backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                            },
                          }}
                        >
                          {classes?.new_class_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/* <FormControl sx={{ minWidth: 300}}>
                                    <InputLabel id="select-subject-label"  sx={{color:inputfieldtext(namecolor)}}>Select subject *</InputLabel>
                                    <Select
                                        labelId="select-subject-label"
                                        value={selectedSubject}
                                        onChange={handleChange}
                                        label="Select subject *"
                                        variant="outlined"
                                        name="subject_id"
                                        sx={{
                                            backgroundColor: inputfield(namecolor) , 
                                            color: inputfieldtext(namecolor) 
                                        }}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    backgroundColor: inputfield(namecolor),
                                                    color: inputfieldtext(namecolor)
                                                },
                                            },
                                        }}
                                    >
                                        {dataSubject.map((item:any) => (
                                            <MenuItem key={item.id} value={item.id}
                                            sx={{
                                                backgroundColor: inputfield(namecolor),
                                                color: inputfieldtext(namecolor),
                                                '&:hover': {
                                                    backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                                                },
                                            }}
                                            
                                            >
                                                {item.subject_name}
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
    </>
  );
};

export default Uploadpdf;
