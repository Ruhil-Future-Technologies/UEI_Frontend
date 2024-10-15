import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { toast } from "react-toastify";
import useApi from "../../hooks/useAPI";
import {
  FEEDBACK_COLUMNS,
  IFeedback,
  MenuListinter,
} from "../../Components/Table/columns";
import { EditIcon, TrashIcon } from "../../assets";
import { QUERY_KEYS_FEEDBACK, QUERY_KEYS_HOBBY } from "../../utils/const";
import { DeleteDialog } from "../../Components/Dailog/DeleteDialog";
import FullScreenLoader from "../Loader/FullScreenLoader";
import { dataaccess, tabletools } from "../../utils/helpers";
import NameContext from "../Context/NameContext";
import "../Hobby/Hobby.scss";

const AdminFeedback = () => {
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

  const FeedbackURL = QUERY_KEYS_FEEDBACK.GET_FEEDBACK;
  const DeleteFeedbackURl = QUERY_KEYS_FEEDBACK.FEEDBACK_DELETE;
  const columns = FEEDBACK_COLUMNS;
  const navigate = useNavigate();
  const { getData, deleteData, loading } = useApi();
  const [dataFeedback, setDataFeedback] = useState<IFeedback[]>([]);
  const [dataDelete, setDataDelete] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState<number>();

  const callAPI = async () => {
    getData(`${FeedbackURL}`)
      .then((data: { data: IFeedback[] }) => {
        if (data.data) {
          console.log("FeedBack Data", data.data);

          setDataFeedback(data?.data);
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
                    <div className="main_title"> Feedback</div>
                  </Typography>
                  {/* {filteredData?.form_data?.is_save === true && ( */}
                  <Button
                    className="mainbutton"
                    variant="contained"
                    component={NavLink}
                    to="add-feedback"
                  >
                    Add Feedback
                  </Button>
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
                        {/* {filteredData?.form_data?.is_update === true && ( */}
                        <Tooltip arrow placement="right" title="Edit">
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
                        </Tooltip>
                        {/* )} */}
                        <Tooltip arrow placement="right" title="Delete">
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
        onDeleteClick={() => handleDelete(dataDeleteId)}
        title="Delete documents?"
      />
    </>
  );
};

export default AdminFeedback;
