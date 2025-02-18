/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import './Teacher.scss';
import useApi from '../../hooks/useAPI';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  QUERY_KEYS_COURSE,
  QUERY_KEYS_SUBJECT,
  QUERY_KEYS_SUBJECT_SCHOOL,
  QUERY_KEYS_TEACHER,
} from '../../utils/const';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility,
} from '@mui/icons-material';

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
  const [dataCourses, setDataCourses] = useState<any[]>([]);
  const [dataClasses, setDataClasses] = useState<any[]>([]);
  const [collegeSubjects, setCollegeSubjects] = useState<any[]>([]);
  const [schoolSubjects, setSchoolSubjects] = useState<any[]>([]);
  // const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  // const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);
  // const [filteredInstitutes, setFilteredInstitutes] = useState<any[]>([]);
  const [schoolInstitutes, setSchoolInstitutes] = useState<any[]>([]);
  const [collegeInstitutes, setCollegeInstitutes] = useState<any[]>([]);
  const GET_COURSE = QUERY_KEYS_COURSE.GET_COURSE;
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
    getData('/entity/list').then((data) => {
      if(data.status){
        setEntity(data.data);
      }
      
    });
    getData(`${GET_COURSE}`).then((data) => setDataCourses(data.data));
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
    getData(`${QUERY_KEYS_COURSE.GET_COURSE}`).then((data) => {
      setDataCourses(data.data);
    });
    getData(`${QUERY_KEYS_SUBJECT.GET_SUBJECT}`).then((data) => {
      setCollegeSubjects(data.data);
    });
    getData(`${QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT}`).then((data) => {
      setSchoolSubjects(data.data);
    });
    getData(`${TeacherURL}`)
      .then((data: { data: any[] }) => {
        if (data.data) {
          setDataTeacher(data?.data);
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

      const college: any = entity.filter((ent) => ent.entity_type == 'College');
      const school: any = entity.filter((ent) => ent.entity_type == 'School');

      setFilteredTeachers([]);

      setTimeout(() => {
        if (activeSubTab === 0) {
          setColumnVisibility({
            university_id: true,
            course_id: true,
            class_id: false,
          });
          const updatedColumns = columns11.map((column) => {
            if (column.accessorKey === 'institution_id') {
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
            class_id: true,
          });
          const updatedColumns = columns11.map((column) => {
            if (column.accessorKey === 'institution_id') {
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
                course_id: null,
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
    const teacherDetail = dataTeacher?.find((teacher) => {
      if (teacher.teacher_id == id) {
        return teacher;
      }
    });
    const full_name = teacherDetail.first_name + ' ' + teacherDetail.last_name;
    teacherDetail.full_name = full_name;
    delete teacherDetail.first_name;
    delete teacherDetail.last_name;
    delete teacherDetail.is_active;
    delete teacherDetail.is_approve;
    delete teacherDetail.is_deleted;
    delete teacherDetail.is_kyc_verified;
    delete teacherDetail.role_id;
    delete teacherDetail.pic_path;

    const isSchool = isSchoolEntity(teacherDetail?.entity_id);
    const isCollege = isCollegeEntity(teacherDetail?.entity_id);

    if (isSchool) {
      const class_info = dataClasses.find(
        (cls) => cls.id == teacherDetail.class_id,
      );

      const school = schoolInstitutes.find(
        (school) => school.id == teacherDetail.institution_id,
      );
      const teacherSubjects = schoolSubjects.filter((subject) =>
        teacherDetail.subjects.includes(subject.subject_id),
      );

      const subjectNames = teacherSubjects.map(
        (subject) => subject.subject_name,
      );

      teacherDetail.entity_type = 'School';
      teacherDetail.school_name = school.institution_name;
      teacherDetail.class_name = class_info.class_name;
      teacherDetail.subjects = subjectNames;

      delete teacherDetail.entity_id;
      delete teacherDetail.class_id;
      delete teacherDetail.institution_id;
      delete teacherDetail.university_id;
      delete teacherDetail.course_id;
    } else if (isCollege) {
      const college = collegeInstitutes.find(
        (college) => college.id == teacherDetail.institution_id,
      );
      const course = dataCourses.find(
        (course) => course.id == teacherDetail.course_id,
      );
      const teacherSubjects = collegeSubjects.filter((subject) =>
        teacherDetail.subjects.includes(subject.subject_id),
      );
      const subjectNames = teacherSubjects.map(
        (subject) => subject.subject_name,
      );

      teacherDetail.entity_type = 'College';
      teacherDetail.college_name = college.institution_name;
      teacherDetail.university_name = college.university_name;
      teacherDetail.course_name = course.course_name;
      teacherDetail.subjects = subjectNames;

      delete teacherDetail.stream;
      delete teacherDetail.entity_id;
      delete teacherDetail.class_id;
      delete teacherDetail.institution_id;
      delete teacherDetail.university_id;
      delete teacherDetail.course_id;
    }
    delete teacherDetail.teacher_login_id;
    delete teacherDetail.teacher_id;
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
                    <Tab label="Total Teachers"></Tab>
                    <Tab label="Pending Teachers" />
                  </Tabs>

                  {activeTab === 0 && (
                    <Tabs value={activeSubTab} onChange={handleSubTabChange}>
                      <Tab label="College" />
                      <Tab label="School" />
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
                                  <Visibility />
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
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          <Dialog
                            open={open}
                            onClose={handleClose}
                            sx={{
                              '& .MuiBackdrop-root': {
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              },
                              '& .MuiPaper-root': {
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                              },
                            }}
                          >
                            <DialogTitle
                              sx={{
                                fontWeight: 600,
                              }}
                            >
                              Teacher Details
                            </DialogTitle>
                            <DialogContent>
                              <div className="teacher-details">
                                {[
                                  'full_name',
                                  'dob',
                                  'gender',
                                  'email_id',
                                  'phone',
                                  'qualification',
                                  'experience',

                                  'entity_type',
                                  'school_name',
                                  'class_name',
                                  'college_name',
                                  'university_name',
                                  'course_name',
                                  'stream',
                                  'subjects',

                                  'address',
                                  'city',
                                  'district',
                                  'state',
                                  'country',
                                  'pincode',
                                  'created_at',
                                  'updated_at',
                                  ...Object.keys(selectedTeacher).filter(
                                    (key) =>
                                      ![
                                        'full_name',
                                        'dob',
                                        'gender',
                                        'email_id',
                                        'phone',
                                        'qualification',
                                        'experience',

                                        'entity_type',
                                        'school_name',
                                        'class_name',
                                        'college_name',
                                        'university_name',
                                        'course_name',
                                        'stream',
                                        'subjects',

                                        'address',
                                        'city',
                                        'district',
                                        'state',
                                        'country',
                                        'pincode',
                                        'created_at',
                                        'updated_at',
                                      ].includes(key),
                                    'documents',
                                  ),
                                ].map((key) => {
                                  if (key in selectedTeacher) {
                                    return (
                                      <p key={key}>
                                        <strong
                                          style={{
                                            fontWeight: 500,
                                            fontSize: '14px',
                                          }}
                                        >
                                          {key.replace(/_/g, ' ').toUpperCase()}
                                        </strong>
                                        :{' '}
                                        {key === 'documents' ? (
                                          Array.isArray(selectedTeacher[key]) &&
                                          (selectedTeacher[key] as string[])
                                            .length > 0 ? (
                                            <div style={{ marginLeft: '20px' }}>
                                              {(
                                                selectedTeacher[key] as string[]
                                              ).map(
                                                (
                                                  doc: string,
                                                  index: number,
                                                ) => (
                                                  <div
                                                    key={index}
                                                    style={{
                                                      margin: '5px 0',
                                                    }}
                                                  >
                                                    <a
                                                      href={doc}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      style={{
                                                        textDecoration:
                                                          'underline ',
                                                      }}
                                                    >
                                                      {doc.split('/').pop()}
                                                    </a>
                                                    {index <
                                                    (
                                                      selectedTeacher[
                                                        key
                                                      ] as string[]
                                                    ).length -
                                                      1
                                                      ? ', '
                                                      : ''}
                                                  </div>
                                                ),
                                              )}
                                            </div>
                                          ) : (
                                            'No documents available'
                                          )
                                        ) : Array.isArray(
                                            selectedTeacher[key],
                                          ) ? (
                                          selectedTeacher[key].join(', ')
                                        ) : selectedTeacher[key] === null ? (
                                          'Not Available'
                                        ) : (
                                          selectedTeacher[key]?.toString()
                                        )}
                                      </p>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleClose} color="primary">
                                Close
                              </Button>
                            </DialogActions>
                          </Dialog>
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
