/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import "../Course/Course.scss";
import useApi from "../../hooks/useAPI";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import {
  UNIVERSITY_COLUMNS,
  UniversityRep0oDTO,
} from "../../Components/Table/columns";
import { EditIcon, TrashIcon } from "../../assets";
import { NavLink, useNavigate } from "react-router-dom";
import { QUERY_KEYS_UNIVERSITY } from "../../utils/const";
import { toast } from "react-toastify";
import { DeleteDialog } from "../../Components/Dailog/DeleteDialog";
import FullScreenLoader from "../Loader/FullScreenLoader";
import { tabletools } from "../../utils/helpers";
import NameContext from "../Context/NameContext";

const University = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;

 

  const UniversityURL = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;
  const DeleteUniversityURL = QUERY_KEYS_UNIVERSITY.UNIVERSITY_DELETE;
  const columns = UNIVERSITY_COLUMNS;
  const navigate = useNavigate();
  const { getData, deleteData, loading } = useApi();
  // const { getData, deleteData } = useApi()
  const [dataUniversity, setDataUniversity] = useState<UniversityRep0oDTO[]>(
    []
  );
  const [dataDelete, setDataDelete] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState<number>();

  const callAPI = async () => {
    getData(`${UniversityURL}`)
      .then((data: { data: UniversityRep0oDTO[] }) => {
        if (data.data) {
          setDataUniversity(data?.data);
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
    navigate(`edit-University/${id}`);
  };

  const handlecancel = () => {
    setDataDelete(false);
  };

  const handleDeleteFiles = (id: number) => {
    setDataDeleteId(id);
    setDataDelete(true);
  };

  const handleDelete = (id: number | undefined) => {
    deleteData(`${DeleteUniversityURL}/${id}`)
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
                      <div className="main_title"> University</div>
                    </Typography>

                    {/* {filteredData?.form_data?.is_save === true && ( */}
                    <Button
                      className="mainbutton"
                      variant="contained"
                      component={NavLink}
                      to="add-University"
                    >
                      Add University
                    </Button>
                    {/* )}   */}
                  </div>
                  <Box marginTop="10px">
                    <MaterialReactTable
                      columns={columns}
                      // data={filteredData?.form_data?.is_search ? dataUniversity : []}
                      data={dataUniversity}
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
                            data-testid="edit_btn"
                              sx={{
                                width: "35px",
                                height: "35px",
                                color: tabletools(namecolor),
                              }}
                              onClick={() => {
                                handleEditFile(
                                  row?.row?.original?.university_id
                                );
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          {/* )}  */}

                          <Tooltip arrow placement="right" title="Delete">
                            <IconButton
                              sx={{
                                width: "35px",
                                height: "35px",
                                color: tabletools(namecolor),
                              }}
                              onClick={() => {
                                handleDeleteFiles(
                                  row?.row?.original?.university_id
                                );
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

export default University;
