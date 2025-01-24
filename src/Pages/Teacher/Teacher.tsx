/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import './Teacher.scss';
import useApi from '../../hooks/useAPI';
import {
  Box,
  Button,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { TEACHER_COLUMNS } from '../../Components/Table/columns';
import { EditIcon, TrashIcon } from '../../assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
import { toast } from 'react-toastify';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { tabletools } from '../../utils/helpers';
import NameContext from '../Context/NameContext';
import { QUERY_KEYS_TEACHER } from '../../utils/const';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

const Teacher = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;

  // const location = useLocation();
  // const pathSegments = location.pathname.split('/').filter(Boolean);
  // const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
  // const Menulist: any = localStorage.getItem('menulist1');
  // const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);

  // useEffect(() => {
  //   setFilteredData(
  //     dataaccess(Menulist, lastSegment, { urlcheck: '' }, { datatest: '' }),
  //   );
  // }, [Menulist, lastSegment]);

  const TeacherURL = QUERY_KEYS_TEACHER.GET_TEACHER;
  const DeleteTeacherURL = QUERY_KEYS_TEACHER.TEACHER_DELETE;
  const columns11 = TEACHER_COLUMNS;
  const navigate = useNavigate();
  const { getData, putData, loading } = useApi();
  const [dataTeacher, setDataTeacher] = useState<any[]>([]);
  const [dataDelete, setDataDelete] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState<number>();
  const [columns, setColumns] = useState<MRT_ColumnDef<any>[]>(columns11);
  const [activeTab, setActiveTab] = useState(0);
  const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);

  useEffect(() => {
    const updatedColumns = columns11.map((column: any) => {
      if (column.accessorKey === 'email') {
        const maxWidth = Math.max(
          ...dataTeacher.map((item) =>
            item?.email ? item?.email?.length * 10 : 0,
          ),
        );
        return { ...column, size: maxWidth };
      }

      if (column.accessorKey === 'phone') {
        const maxWidth = Math.max(
          ...dataTeacher.map((item) =>
            item?.phone ? item?.phone?.length * 7 : 0,
          ),
        );
        return { ...column, size: maxWidth };
      }
      return column;
    });

    setColumns(updatedColumns);
  }, [dataTeacher, columns11]);

  const callAPI = async () => {
    getData(`${TeacherURL}`)
      .then((data: { data: any[] }) => {
        if (data.data) {
          setDataTeacher(data?.data);
        }
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  useEffect(() => {
    callAPI();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (activeTab === 0) {
      setFilteredTeachers(
        dataTeacher.filter((teacher) => teacher.is_approve === true),
      );
    } else {
      setFilteredTeachers(dataTeacher.filter((teacher) => !teacher.is_approve));
    }
  }, [activeTab, dataTeacher]);

  const handleApproveTeacher = (id: number) => {
    putData(`${QUERY_KEYS_TEACHER.TEACHER_APPROVE}/${id}`)
      .then(() => {
        toast.success('Teacher approved successfully', {
          hideProgressBar: true,
          theme: 'colored',
        });
        callAPI();
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const handleRejectTeacher = (id: number) => {
    putData(`${QUERY_KEYS_TEACHER.TEACHER_DISAPPROVE}/${id}`)
      .then(() => {
        toast.success('Teacher rejected and removed', {
          hideProgressBar: true,
          theme: 'colored',
        });
        callAPI();
      })
      .catch((e) => {
        if (e?.response?.status === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const handleEditFile = (id: number) => {
    navigate(`edit-teacher/${id}`);
  };

  const handlecancel = () => {
    setDataDelete(false);
  };

  const handleDeleteFiles = (id: number) => {
    setDataDeleteId(id);
    setDataDelete(true);
  };

  const handleDelete = (id: number | undefined) => {
    putData(`${DeleteTeacherURL}/${id}`)
      .then((data: { message: string }) => {
        toast.success(data?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
        callAPI();
        setDataDelete(false);
      })
      .catch((e: any) => {
        if (e?.response?.status === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
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
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="h6" sx={{ m: 1 }}>
                      <div className="main_title">Teachers</div>
                    </Typography>

                    <Button
                      className="mainbutton"
                      variant="contained"
                      component={NavLink}
                      to="add-teacher"
                    >
                      Add Teacher
                    </Button>
                  </div>
                  <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Total Teachers" />
                    <Tab label="Pending Teachers" />
                  </Tabs>
                  <Box marginTop="10px">
                    <MaterialReactTable
                      columns={columns}
                      data={filteredTeachers}
                      enableRowVirtualization
                      positionActionsColumn="first"
                      muiTablePaperProps={{
                        elevation: 0,
                      }}
                      enableRowActions
                      displayColumnDefOptions={{
                        'mrt-row-actions': {
                          header: 'Actions',
                          size: 150,
                        },
                      }}
                      renderRowActions={(row) => (
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'nowrap',
                            gap: '0.5',
                            marginLeft: '-5px',
                            width: '140px',
                          }}
                        >
                          {/* {filteredData?.form_data?.is_update === true && (
                            <Tooltip arrow placement="right" title="Edit">
                              <IconButton
                                sx={{
                                  width: '35px',
                                  height: '35px',
                                  color: tabletools(namecolor),
                                }}
                                onClick={() => {
                                  //   handleEditFile(row?.row?.original?.id);
                                  console.log('handleEditFile');
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          )} */}
                          {row.row.original.is_approve ? (
                            <>
                              <Tooltip arrow placement="right" title="Edit">
                                <IconButton
                                  sx={{
                                    width: '35px',
                                    height: '35px',
                                    color: tabletools(namecolor),
                                  }}
                                  onClick={() =>
                                    handleEditFile(
                                      row?.row?.original?.teacher_id,
                                    )
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip arrow placement="right" title="Delete">
                                <IconButton
                                  sx={{
                                    width: '35px',
                                    height: '35px',
                                    color: tabletools(namecolor),
                                  }}
                                  onClick={() =>
                                    handleDeleteFiles(
                                      row?.row?.original?.teacher_id,
                                    )
                                  }
                                >
                                  <TrashIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <>
                              <Tooltip arrow placement="right" title="Approve">
                                <IconButton
                                  sx={{
                                    width: '35px',
                                    height: '35px',
                                    color: tabletools(namecolor),
                                  }}
                                  onClick={() =>
                                    handleApproveTeacher(
                                      row?.row?.original?.teacher_id,
                                    )
                                  }
                                >
                                  <CheckIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip arrow placement="right" title="Reject">
                                <IconButton
                                  sx={{
                                    width: '35px',
                                    height: '35px',
                                    color: tabletools(namecolor),
                                  }}
                                  onClick={() =>
                                    handleRejectTeacher(
                                      row?.row?.original?.teacher_id,
                                    )
                                  }
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}

                          {/* <Tooltip arrow placement="right" title="Edit">
                            <IconButton
                              sx={{
                                width: '35px',
                                height: '35px',
                                color: tabletools(namecolor),
                              }}
                              onClick={() => {
                                console.log({ row });

                                handleEditFile(row?.row?.original?.teacher_id);
                                console.log('handleEditFile');
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip arrow placement="right" title="Delete">
                            <IconButton
                              sx={{
                                width: '35px',
                                height: '35px',
                                color: tabletools(namecolor),
                              }}
                              onClick={() => {
                                console.log({ row });

                                handleDeleteFiles(
                                  row?.row?.original?.teacher_id,
                                );
                                console.log('handleDeleteFiles');
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
        title="Delete Teacher?"
      />
    </>
  );
};

export default Teacher;
