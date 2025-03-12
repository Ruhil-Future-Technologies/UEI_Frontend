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
import {
  QUERY_KEYS,
  QUERY_KEYS_CLASS,
  QUERY_KEYS_TEACHER,
} from '../../utils/const';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility,
} from '@mui/icons-material';
import { TeacherDetailsDialog } from './TeacherDetailsDialog';

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
  const [entity, setEntity] = useState<any[]>([]);
  const [dataTeacher, setDataTeacher] = useState<any[]>([]);
  const [dataDelete, setDataDelete] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState<number>();
  const [columns, setColumns] = useState<MRT_ColumnDef<any>[]>(columns11);
  const [activeTab, setActiveTab] = useState(0);
  const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>({});
  const [, setDataClasses] = useState<any[]>([]);
  // const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  // const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);
  // const [filteredInstitutes, setFilteredInstitutes] = useState<any[]>([]);
  const [schoolInstitutes, setSchoolInstitutes] = useState<any[]>([]);
  const [collegeInstitutes, setCollegeInstitutes] = useState<any[]>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  const isSchoolEntity = (entityId: string | string[]): boolean => {
    const selectedEntity = entity?.find((entity) => entity.id === entityId);
    return selectedEntity?.entity_type?.toLowerCase() === 'school';
  };

  const isCollegeEntity = (entityId: string | string[]): boolean => {
    const selectedEntity = entity?.find((entity) => entity.id === entityId);
    return selectedEntity?.entity_type?.toLowerCase() === 'college';
  };

  useEffect(() => {
    const updatedColumns = columns11?.map((column: any) => {
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
    getData('/entity/list').then((data) => {
      if (data.status) {
        setEntity(data.data?.entityes_data);
      }
    });
    getData(`${QUERY_KEYS.GET_INSTITUTES}`).then((data) => {
      const allInstitutes = data.data;
      const schoolInstitutes = allInstitutes?.filter(
        (institute: any) => institute.entity_type?.toLowerCase() === 'school',
      );
      const collegeInstitutes = allInstitutes?.filter(
        (institute: any) => institute.entity_type?.toLowerCase() === 'college',
      );
      setSchoolInstitutes(schoolInstitutes);
      setCollegeInstitutes(collegeInstitutes);
    });

    getData(`${QUERY_KEYS_CLASS.GET_CLASS}`).then((data) => {
      setDataClasses(data.data);
    });
    getData(`${TeacherURL}`)
      .then((data: { data: any[] }) => {
        if (data.data) {
          const teacherData = data.data.map((teacher: any) => {
            const createdDateTime = teacher?.created_at;
            const updatedDateTime = teacher?.updated_at;
            const created_time = new Date(createdDateTime);
            const updated_time = new Date(updatedDateTime);

            teacher.created_at = created_time.toLocaleString();
            teacher.updated_at = updated_time.toLocaleString();
            return teacher;
          });
          console.log(teacherData)
          setDataTeacher(teacherData);
        } else {
          setDataTeacher([]);
        }
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
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

  const handleSubTabChange = (
    _event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setActiveSubTab(newValue);
  };

  useEffect(() => {
    if (activeTab === 0) {
      const approvedTeachers = dataTeacher.filter(
        (teacher) => teacher.is_approve === true,
      );

      const college: any = entity.filter((ent) => (ent.entity_type).toLowerCase() == 'college');
      const school: any = entity.filter((ent) => (ent.entity_type).toLowerCase() == 'school');

      setFilteredTeachers([]);

      setTimeout(() => {
        if (activeSubTab === 0) {
          setColumnVisibility({
            university_id: true,
            course_id: true,
            class_id: false,
            class_stream_subjects: false,
          });
          const updatedColumns = columns11.map((column) => {
            if (column.accessorKey === 'institute_id') {
              return {
                ...column,
                header: 'College Name',
              };
            }
            return column;
          });
          setColumns(updatedColumns);

          const collegeTeachers = approvedTeachers
            .filter((teacher) => teacher.entity_id == college[0]?.id)
            .map((teacher) => {
              return {
                ...teacher,
                class_id: null,
                className: '-',
                class_name: '-',
              };
            });

          setFilteredTeachers(collegeTeachers);
        } else {
          setColumnVisibility({
            university_id: false,
            course_id: false,
            class_stream_subjects: true,
            course_semester_subjects: false,
          });
          const updatedColumns = columns11.map((column) => {
            if (column.accessorKey === 'institute_id') {
              return {
                ...column,
                header: 'School Name',
              };
            }
            return column;
          });
          setColumns(updatedColumns);

          const schoolTeachers = approvedTeachers
            .filter((teacher) => teacher.entity_id == school[0]?.id)
            .map((teacher) => {
              return {
                ...teacher,
                course_semester_subjects: null,
                university_id: null,
                course_name: '-',
                university_name: '-',
              };
            });
          setFilteredTeachers(schoolTeachers);
        }
      }, 0);
    } else if (activeTab === 1) {
      const pendingTeachers = dataTeacher.filter(
        (teacher) => teacher.is_approve === false,
      );

      const college: any = entity.filter((ent) => ent.entity_type == 'college');
      const school: any = entity.filter((ent) => ent.entity_type == 'school');

      setFilteredTeachers([]);

      setTimeout(() => {
        if (activeSubTab === 0) {
          setColumnVisibility({
            university_id: true,
            course_id: true,
            class_id: false,
            class_stream_subjects: false,
          });
          const updatedColumns = columns11.map((column) => {
            if (column.accessorKey === 'institute_id') {
              return {
                ...column,
                header: 'College Name',
              };
            }
            return column;
          });
          setColumns(updatedColumns);

          const collegeTeachers = pendingTeachers
            .filter((teacher) => teacher.entity_id == college[0]?.id)
            .map((teacher) => {
              return {
                ...teacher,
                class_id: null,
                className: '-',
                class_name: '-',
              };
            });

          setFilteredTeachers(collegeTeachers);
        } else {
          setColumnVisibility({
            university_id: false,
            course_id: false,
            class_stream_subjects: true,
            course_semester_subjects: false,
          });
          const updatedColumns = columns11.map((column) => {
            if (column.accessorKey === 'institute_id') {
              return {
                ...column,
                header: 'School Name',
              };
            }
            return column;
          });
          setColumns(updatedColumns);

          const schoolTeachers = pendingTeachers
            .filter((teacher) => teacher.entity_id == school[0]?.id)
            .map((teacher) => {
              return {
                ...teacher,
                course_semester_subjects: null,
                university_id: null,
                course_name: '-',
                university_name: '-',
              };
            });
          setFilteredTeachers(schoolTeachers);
        }
      }, 0);
    } else {
      setFilteredTeachers(dataTeacher.filter((teacher) => !teacher.is_approve));
    }
  }, [activeTab, activeSubTab, dataTeacher, entity]);

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
        if (e?.response?.code === 401) {
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
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTeacher([]);
  };

  const handleTeacherDetails = (id: number) => {
    const teacherDetail = JSON.parse(
      JSON.stringify(dataTeacher?.find((teacher) => teacher.teacher_id == id)),
    );

    const full_name =
      teacherDetail?.first_name + ' ' + teacherDetail?.last_name;
    if (teacherDetail) {
      teacherDetail.full_name = full_name;
      delete teacherDetail.first_name;
      delete teacherDetail.last_name;
      delete teacherDetail.is_active;
      delete teacherDetail.is_approve;
      delete teacherDetail.is_deleted;
      delete teacherDetail.is_kyc_verified;
      delete teacherDetail.role_id;
      delete teacherDetail.pic_path;
    }

    const isSchool = isSchoolEntity(teacherDetail?.entity_id);
    const isCollege = isCollegeEntity(teacherDetail?.entity_id);

    if (isSchool) {
      const school = schoolInstitutes.find(
        (school) => school.id == teacherDetail?.institution_id,
      );

      teacherDetail.entity_type = 'school';
      teacherDetail.school_name = school?.institution_name;
      teacherDetail.classes = Object.create(
        null,
        Object.getOwnPropertyDescriptors(
          JSON.parse(JSON.stringify(teacherDetail.class_stream_subjects)),
        ),
      );

      delete teacherDetail.class_stream_subjects;
      delete teacherDetail.entity_id;
      delete teacherDetail.course_semester_subjects;
      delete teacherDetail.institution_id;
      delete teacherDetail.university_id;
      delete teacherDetail.course_id;
    } else if (isCollege) {
      const college = collegeInstitutes.find(
        (college) => college.id == teacherDetail.institution_id,
      );

      teacherDetail.entity_type = 'college';
      teacherDetail.college_name = college?.institution_name;
      teacherDetail.university_name = college?.university_name;
      teacherDetail.courses = teacherDetail?.course_semester_subjects;

      delete teacherDetail.class_id;
      delete teacherDetail.stream;
      delete teacherDetail.entity_id;
      delete teacherDetail.class_stream_subjects;
      delete teacherDetail.institution_id;
      delete teacherDetail.university_id;
      delete teacherDetail.course_id;
      delete teacherDetail.course_semester_subjects;
    }
    delete teacherDetail?.teacher_login_id;
    delete teacherDetail?.teacher_id;

    setSelectedTeacher(teacherDetail);
    setOpen(true);
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
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  };
  console.log(filteredTeachers)
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
                    <Tab
                      label="Total Teachers"
                      sx={{ color: namecolor === 'dark' ? 'white' : 'black' }}
                    ></Tab>
                    <Tab
                      label="Pending Teachers"
                      sx={{ color: namecolor === 'dark' ? 'white' : 'black' }}
                    />
                  </Tabs>

                  {activeTab === 0 && (
                    <Tabs value={activeSubTab} onChange={handleSubTabChange}>
                      <Tab
                        label="College"
                        sx={{ color: namecolor === 'dark' ? 'white' : 'black' }}
                      />
                      <Tab
                        label="School"
                        sx={{ color: namecolor === 'dark' ? 'white' : 'black' }}
                      />
                    </Tabs>
                  )}
                  {activeTab === 1 && (
                    <Tabs value={activeSubTab} onChange={handleSubTabChange}>
                      <Tab
                        label="College"
                        sx={{ color: namecolor === 'dark' ? 'white' : 'black' }}
                      />
                      <Tab
                        label="School"
                        sx={{ color: namecolor === 'dark' ? 'white' : 'black' }}
                      />
                    </Tabs>
                  )}
                  <Box marginTop="10px">
                    <MaterialReactTable
                      columns={columns}
                      data={filteredTeachers}
                      state={{
                        columnVisibility,
                      }}
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
                                      row?.row?.original?.user_uuid,
                                    )
                                  }
                                >
                                  <EditIcon style={{ fill: '#547476' }} />
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
                                      row?.row?.original?.user_uuid,
                                    )
                                  }
                                >
                                  <TrashIcon style={{ fill: '#547476' }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip arrow placement="right" title="Details">
                                <IconButton
                                  sx={{
                                    width: '35px',
                                    height: '35px',
                                    color: tabletools(namecolor),
                                  }}
                                  onClick={() =>
                                    handleTeacherDetails(
                                      row?.row?.original?.teacher_id,
                                    )
                                  }
                                >
                                  <Visibility style={{ fill: '#547476' }} />
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
                                      row?.row?.original?.user_uuid,
                                    )
                                  }
                                >
                                  <CheckIcon style={{ fill: '#547476' }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip arrow placement="right" title="Reject">
                                <IconButton
                                  sx={{
                                    width: '35px',
                                    height: '35px',
                                    // color: tabletools(namecolor),
                                  }}
                                  onClick={() =>
                                    handleRejectTeacher(
                                      row?.row?.original?.user_uuid,
                                    )
                                  }
                                >
                                  <CloseIcon style={{ fill: '#547476' }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip arrow placement="right" title="Details">
                                <IconButton
                                  sx={{
                                    width: '35px',
                                    height: '35px',
                                    color: tabletools(namecolor),
                                  }}
                                  onClick={() =>
                                    handleTeacherDetails(
                                      row?.row?.original?.teacher_id,
                                    )
                                  }
                                >
                                  <Visibility style={{ fill: '#547476' }} />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <TeacherDetailsDialog
                            open={open}
                            selectedTeacher={selectedTeacher}
                            onClose={handleClose}
                          />
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
        title="Teacher"
      />
    </>
  );
};

export default Teacher;
