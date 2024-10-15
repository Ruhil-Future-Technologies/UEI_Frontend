import React, { useContext, useEffect, useState } from "react";

import "../Hobby/Hobby.scss";
import useApi from "../../hooks/useAPI";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import {
  IStudentFeedback,
  MenuListinter,
  STUDENT_FEEDBACK_COLUMNS,
} from "../../Components/Table/columns";
import { EditIcon, TrashIcon } from "../../assets";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  QUERY_KEYS_FEEDBACK,
  QUERY_KEYS_STUDENT_FEEDBACK,
} from "../../utils/const";
import { DeleteDialog } from "../../Components/Dailog/DeleteDialog";
import { toast } from "react-toastify";
import FullScreenLoader from "../Loader/FullScreenLoader";
import {
  dataaccess,
  inputfield,
  inputfieldhover,
  inputfieldtext,
  tabletools,
} from "../../utils/helpers";
import NameContext from "../Context/NameContext";

let newObject = [
  {
    student_name: "Aesglient",
    student_id: 1,
  },
  {
    student_name: "Ashish chopra",
    student_id: 2,
  },
  {
    student_name: "John Smith",
    student_id: 3,
  },
];

const StudentFeedback = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
  // const roleset = lastSegment == "feedback" ? "feedbacks" : lastSegment;
  const Menulist: any = localStorage.getItem("menulist1");
  const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);

  // useEffect(() => {
  //   debugger
  //     JSON.parse(Menulist)?.map((data: any) => {
  //         const fistMach = data?.menu_name.toLowerCase() === roleset.toLowerCase() && data;
  //         if (fistMach.length > 0) {
  //             setFilteredData(fistMach)
  //         }
  //         const result = data?.submenus?.filter((menu: any) => menu.menu_name.toLowerCase() === roleset.toLowerCase())
  //         if (result.length > 0) {
  //             setFilteredData(result)
  //         }
  //     })
  // }, [Menulist])

  useEffect(() => {
    setFilteredData(
      dataaccess(Menulist, lastSegment, { urlcheck: "" }, { datatest: "" })
    );
  }, [Menulist, lastSegment]);

  const FeedbackURL = QUERY_KEYS_STUDENT_FEEDBACK.GET_FEEDBACK;
  const DeleteFeedbackURl = QUERY_KEYS_FEEDBACK.FEEDBACK_DELETE;
  const columns = STUDENT_FEEDBACK_COLUMNS;
  const navigate = useNavigate();
  const { getData, deleteData, loading } = useApi();
  const [dataFeedback, setDataStudent] = useState<IStudentFeedback[]>([]);
  const [student, setStudent] = useState<any>(newObject);
  const [studentDeepCopy, setDataStudentDeepCopy] = useState<any>([]);
  const [dataDelete, setDataDelete] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState<number>();

  const callAPI = async () => {
    getData(`${FeedbackURL}`)
      .then((data: { data: IStudentFeedback[] }) => {
        if (data.data) {
          setDataStudent(data?.data);
          setDataStudentDeepCopy(data?.data);
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
    // getData(`student/list`)
    //   .then((data: { data: any }) => {
    //     if (data.data) {
          // setDataStudent(data?.data);
          // let newObject={
          //   student_name: data.data.first_name + " " + data.data.last_name,
          //   student_id :data.data.student_id
          // }
          // let newObject = [
          //   {
          //     student_name: "Aesglient",
          //     student_id: 1,
          //   },
          //   {
          //     student_name: "Ashish chopra",
          //     student_id: 2,
          //   },
          //   {
          //     student_name: "John Smith",
          //     student_id: 3,
          //   },
          // ];
          // setStudent(newObject);
          // console.log(data.data);
      //   }
      // })
      // .catch((e) => {
      //   if (e?.response?.status === 401) {
      //     navigate("/");
      //   }
      //   toast.error(e?.message, {
      //     hideProgressBar: true,
      //     theme: "colored",
      //   });
      // });
  };

  useEffect(() => {
    callAPI();
  }, []);

  const handleEditFile = (id: number) => {
    navigate(`edit-feedback/${id}`);
  };

  const handlecancel = () => {
    setDataDelete(false);
  };

  const handleDeleteFiles = (id: number) => {
    setDataDeleteId(id);
    setDataDelete(true);
  };
  const handleChange = (id: number) => {
    let filterStudent = studentDeepCopy.filter((student:any) => student.id === id)
    setDataStudent(filterStudent);
  };


  const handleDelete = (id: number | undefined) => {
    deleteData(`${DeleteFeedbackURl}/${id}`)
      .then((data: { message: string }) => {
        toast.success(data?.message, {
          hideProgressBar: true,
          theme: "colored",
        });
        callAPI();
        setDataDelete(false);
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
                    <div className="main_title">Student Feedback</div>
                  </Typography>
                  {/* {filteredData?.form_data?.is_save === true && ( */}
                  {/* <div className="form_field_wrapper">
                    <FormControl fullWidth> 
                      <InputLabel id="demo-simple-select-label">
                        Select Student *
                      </InputLabel>
                      <Select
                        // onChange={handleChange}
                        // label="Role Master"
                        name="student_name"
                        // value={values?.role_master_id}
                        variant="outlined"
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
                        {student?.map((item: any) => (
                          <MenuItem
                            value={item.student_name}
                            onClick={() => handleChange(item.student_id)}
                            sx={{
                              backgroundColor: inputfield(namecolor),
                              color: inputfieldtext(namecolor),
                              "&:hover": {
                                backgroundColor: inputfieldhover(namecolor), // Change this to your desired hover background color
                              },
                            }}
                          >
                            {item.student_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div> */}
                  {/* )} */}
                </div>
                <Box marginTop="10px">
                  <MaterialReactTable
                    columns={columns}
                    data={dataFeedback}
                    enableRowVirtualization
                    positionActionsColumn="first"
                    muiTablePaperProps={{
                      elevation: 0,
                    }}  
                    // enableRowActions
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
                        {/* {filteredData?.form_data?.is_update === true && ( */}
                        {/* <Tooltip arrow placement="right" title="Edit">
                          <IconButton
                            sx={{
                              width: "35px",
                              height: "35px",
                              color: tabletools(namecolor),
                            }}
                            onClick={() => {
                              handleEditFile(row?.row?.original?.id);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip> */}
                        {/* )} */}
                        {/* <Tooltip arrow placement="right" title="Delete">
                          <IconButton
                            sx={{
                              width: "35px",
                              height: "35px",
                              color: tabletools(namecolor),
                            }}
                            onClick={() => {
                              handleDeleteFiles(row?.row?.original?.id);
                            }}
                          >
                            <TrashIcon />
                          </IconButton>
                        </Tooltip> */}
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
        onDeleteClick={() => handleDelete(dataDeleteId)}
        title="Delete documents?"
      />
    </>
  );
};

export default StudentFeedback;
