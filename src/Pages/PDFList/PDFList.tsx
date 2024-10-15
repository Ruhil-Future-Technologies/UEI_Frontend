import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { QUERY_KEYS_COURSE, QUERY_KEYS_SUBJECT } from "../../utils/const";
import FullScreenLoader from "../Loader/FullScreenLoader";
import NameContext from "../Context/NameContext";
import { tabletools } from "../../utils/helpers";
import { DeleteDialog } from "../../Components/Dailog/DeleteDialog";
import {
  inputfield,
  inputfieldhover,
  inputfieldtext,
} from "../../utils/helpers";
import { TrashIcon } from "../../assets";
import useApi from "../../hooks/useAPI";
import { PDF_LIST_COLUMNS, IPDFList } from "../../Components/Table/columns";
import "../Uploadpdf/Uploadpdf.scss";

interface Classes {
  id: number;
  class_name: string;
  new_class_name: string;
  class_id: string;
}

interface FileList {
  pdf_id: string;
  pdf_file_name: string;
  pdf_path: string;
  upload_by: number;
  upload_date_time: string;
}

const PDFList = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const location = useLocation();
  const navigate = useNavigate();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const SubjectURL = QUERY_KEYS_SUBJECT.GET_SUBJECT;
  const usertype: any = localStorage.getItem("user_type");
  let AdminId: string | null = localStorage.getItem("_id");
  if (AdminId) {
    AdminId = String(AdminId);
  }
  const [selectedClass, setSelectedClass] = useState("");
  const [dataSubject, setDataSubject] = useState([]);
  const [classes, setClasses] = useState<Classes[]>([]);
  const [fileList, setFileList] = useState<FileList[]>([]);
  const [selectedFile, setSelectedFile] = useState<IPDFList>();
  const [dataDelete, setDataDelete] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState<number>();

  const { getData, loading, deleteFileData } = useApi();
  const columns = PDF_LIST_COLUMNS;

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

  useEffect(() => {
    if (selectedClass && !dataDelete) {
      getData(
        `https://uatllm.gyansetu.ai/display-files?class_name=${selectedClass}`
      )
        .then((response: any) => {
          if (response.status === 200) {
            setFileList(response?.filenames);
          }
        })
        .catch((error) => {
          toast.error(error?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        });
    }
  }, [selectedClass, dataDelete]);

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

  if (usertype !== "admin") {
    navigate("/main/*");
  }

  const handleChange = (event: any) => {
    const { name, value } = event?.target;
    if (name === "class_id") setSelectedClass(value);
    else setSelectedFile(value);
  };

  const handlecancel = () => {
    setDataDelete(false);
  };

  const handleDeleteFiles = (fileData: any) => {
    setSelectedFile(fileData);
    setDataDelete(true);
  };

  const handleDelete = () => {
    console.log("Delete File", selectedFile);

    const payload = {
      file_id:selectedFile?.pdf_id,
      file_path: selectedFile?.pdf_path,
      file_name: selectedFile?.pdf_file_name,
      class_name: selectedClass,
    };
    deleteFileData(`https://uatllm.gyansetu.ai/delete-files`, payload)
      .then((data: any) => {
        console.log("DELETED FILES", data);
        if (data.status === 201) {
          setDataDelete(false);
          toast.success(data?.message, {
            hideProgressBar: true,
            theme: "colored",
          });
        }
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          navigate("/");
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
      });
  };

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
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "20px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <FormControl sx={{ minWidth: 300 }}>
                      <InputLabel
                        id="select-class-label"
                        sx={{ color: inputfieldtext(namecolor) }}
                      >
                        Class *
                      </InputLabel>
                      <Select
                        labelId="select-class-label"
                        value={selectedClass}
                        onChange={handleChange}
                        label="Class *"
                        placeholder="Select class"
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
                  </div>
                  {/* <div>
                    <FormControl sx={{ minWidth: 300 }}>
                      <InputLabel
                        id="select-file-label"
                        sx={{ color: inputfieldtext(namecolor) }}
                      >
                        File *
                      </InputLabel>
                      <Select
                        labelId="select-file-label"
                        value={selectedFile}
                        disabled={!selectedClass}
                        onChange={handleChange}
                        label="File *"
                        placeholder="Select file"
                        variant="outlined"
                        name={"file_id"}
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
                        {fileList?.map((file) => (
                          <MenuItem
                            key={file.pdf_path}
                            value={file.pdf_path}
                            sx={{
                              backgroundColor: inputfield(namecolor),
                              color: inputfieldtext(namecolor),
                              "&:hover": {
                                backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                              },
                            }}
                          >
                            {file?.pdf_file_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <a
                      href={
                        selectedFile.length > 0
                          ? `http://13.232.96.204:5000/files${selectedFile}`
                          : ""
                      }
                      target={selectedFile.length > 0 ? "_blank" : ""}
                    >
                      <Button
                        variant="contained"
                        component="label"
                        className={`custom-button ${
                          !selectedFile ? "disabled-mainbutton" : "mainbutton"
                        }`}
                        disabled={!selectedFile}
                      >
                        Preview
                      </Button>
                    </a>
                  </div> */}
                  {/* <div>
                    <Button
                      variant="contained"
                      component="label"
                      className={`custom-button ${
                        !selectedFile ? "disabled-mainbutton" : "mainbutton"
                      }`}
                      disabled={!selectedFile}
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </div> */}
                </div>
                <Box marginTop="10px">
                  <MaterialReactTable
                    columns={columns}
                    data={fileList}
                    enableRowVirtualization
                    positionActionsColumn="first"
                    muiTablePaperProps={{
                      elevation: 0,
                    }}
                    enableRowActions
                    displayColumnDefOptions={{
                      "mrt-row-actions": {
                        header: "Actions",
                        size: 150,
                      },
                    }}
                    renderRowActions={(row) => (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "nowrap",
                          gap: "0.5",
                          marginLeft: "-5px",
                          width: "140px",
                        }}
                      >
                        <Tooltip arrow placement="bottom" title="View">
                          <a
                            href={`https://uatllm.gyansetu.ai/files/${row?.row?.original?.pdf_path}`}
                            target="_blank"
                          >
                            <IconButton
                              sx={{
                                width: "35px",
                                height: "35px",
                                color: tabletools(namecolor),
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </a>
                        </Tooltip>
                        <Tooltip arrow placement="bottom" title="Delete">
                          <IconButton
                            sx={{
                              width: "35px",
                              height: "35px",
                              color: tabletools(namecolor),
                            }}
                            onClick={() => {
                              handleDeleteFiles(row?.row?.original);
                            }}
                          >
                            <TrashIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
        </div>
        
      </div>
      <DeleteDialog
        isOpen={dataDelete}
        onCancel={handlecancel}
        onDeleteClick={handleDelete}
        title="Delete documents?"
      />
    </>
  );
};

export default PDFList;
