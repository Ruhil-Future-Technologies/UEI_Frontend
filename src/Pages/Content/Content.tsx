/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import '../Course/Course.scss';
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
import { CONTENT_COLUMNS } from '../../Components/Table/columns';
import { EditIcon, TrashIcon } from '../../assets';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  QUERY_KEYS,
  QUERY_KEYS_CLASS,
  QUERY_KEYS_CONTENT,
  QUERY_KEYS_COURSE,
  QUERY_KEYS_TEACHER,
} from '../../utils/const';
import { toast } from 'react-toastify';
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { tabletools } from '../../utils/helpers';
import NameContext from '../Context/NameContext';

const Content = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;

  const ContentURL = QUERY_KEYS_CONTENT.GET_CONTENT;
  const DeleteContentURL = QUERY_KEYS_CONTENT.CONTENT_DELETE;
  const navigate = useNavigate();
  const { getData, deleteData, loading } = useApi();
  const [entity, setEntity] = useState<any[]>([]);
  const [dataContent, setDataContent] = useState<any[]>([]);
  const [dataDelete, setDataDelete] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState<number>();
  const [activeTab, setActiveTab] = useState(0);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [filteredContent, setFilteredContent] = useState<any[]>([]);
  const [schoolInstitutes, setSchoolInstitutes] = useState<any[]>([]);
  const [collegeInstitutes, setCollegeInstitutes] = useState<any[]>([]);
  const [dataClasses, setDataClasses] = useState<any>([]);
  const [dataCourses, setDataCourses] = useState<any>([]);
  const [teacherDetail, setTeacherDetail] = useState<any>([]);
  const [instituteDetails, setInstituteDetail] = useState<any>([]);

  const user_type = localStorage.getItem('user_type');
  const user_uuid = localStorage.getItem('user_uuid');

  const getInstituteName = (id: string, type: string) => {
    return type === 'college'
      ? collegeInstitutes?.find((inst) => inst.id == id)?.institute_name
      : schoolInstitutes?.find((inst) => inst.id == id)?.institute_name;
  };

  const getUniversityName = (id: string) => {
    return collegeInstitutes?.find((inst) => inst.university_id == id)
      ?.university_name;
  };

  const getCourseOrClassName = (ids: any, type: string): string => {
    if (type === 'school') {
      const classNames = dataClasses?.classes_data
        ?.filter((cls: any) => ids.includes(cls.id.toString()))
        ?.map((cls: any) => cls.class_name)
        ?.join(', ');

      return classNames || '-';
    }

    if (type === 'college') {
      const courseNames = dataCourses?.course_data
        ?.filter((course: any) => ids.includes(course.id.toString()))
        ?.map((course: any) => course.course_name)
        ?.join(', ');

      return courseNames || '-';
    }

    return '-';
  };

  const getSubjectsName = (subject: any, type: string): string => {
    let subjects: any[] = [];

    if (type == 'school') {
      subjects = Object.values(subject)
        .flatMap((category: any) => Object.values(category))
        .flat();
    } else if (type == 'college') {
      subjects = Object.values(subject)
        .flatMap((category: any) => Object.values(category))
        .flat();
    }

    return subjects.length > 0 ? subjects.join(', ') : '-';
  };

  const callAPI = async () => {
    if (user_type === 'teacher') {
      getData(`${QUERY_KEYS_TEACHER.GET_TECHER_BY_UUID}/${user_uuid}`).then(
        (response) => {
          setTeacherDetail(response?.data);
        },
      );
    } else if (user_type === 'institute') {
      getData(`${QUERY_KEYS.INSTITUTE_EDIT}/${user_uuid}`).then((response) => {
        setInstituteDetail(response?.data);
      });
    }
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
    getData(`${QUERY_KEYS_COURSE.GET_COURSE}`).then((data) => {
      setDataCourses(data.data);
    });
    getData(`${ContentURL}`)
      .then((data) => {
        if (data.status) {
          const contentData = data?.data?.contents_data
            ?.map((content: any) => {
              const createdDateTime = content?.created_at;
              const updatedDateTime = content?.updated_at;
              const created_time = new Date(createdDateTime);
              const updated_time = new Date(updatedDateTime);

              content.created_at = created_time.toLocaleString();
              content.updated_at = updated_time.toLocaleString();
              return content;
            })
            .filter((content: any) => content?.created_by == user_uuid);

          setDataContent(contentData);
        } else {
          setDataContent([]);
        }
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigate('/');
        } else {
          toast.error(e?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        }
      });
  };
  const columns11 = CONTENT_COLUMNS;
  const [columns, setColumns] = useState<MRT_ColumnDef<any>[]>(columns11);

  useEffect(() => {
    callAPI();
  }, [user_uuid, user_type]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const configureForSchool = () => {
      const school = entity.filter((ent) => ent.entity_type === 'school')[0];

      setColumnVisibility({
        university_name: false,
        course_name: false,
        course_semester_subjects: false,
      });

      const updatedColumns = columns11.map((column) => {
        return column.accessorKey === 'institute_name'
          ? { ...column, header: 'School Name' }
          : column;
      });
      setColumns(updatedColumns);

      return processSchoolContents(school?.id);
    };

    const configureForCollege = () => {
      const college = entity.filter((ent) => ent.entity_type === 'college')[0];

      setTimeout(() => {
        setColumnVisibility({
          university_name: true,
          course_name: true,
          class_name: false,
          class_stream_subjects: false,
        });

        const updatedColumns = columns11.map((column) => {
          return column.accessorKey === 'institute_name'
            ? { ...column, header: 'College Name' }
            : column;
        });
        setColumns(updatedColumns);
      }, 0);

      return processCollegeContents(college?.id);
    };

    const processSchoolContents = (entityId: any) => {
      return dataContent
        .filter((content) => content.entity_id == entityId)
        .map((content) => {
          let classStreamSubjects = content.class_stream_subjects;
          if (typeof classStreamSubjects === 'string') {
            classStreamSubjects = JSON.parse(classStreamSubjects);
          }
          const keys = Object.keys(classStreamSubjects);
          const sub_name = getSubjectsName(classStreamSubjects, 'school');

          return {
            ...content,
            institute_name: getInstituteName(content.institute_id, 'school'),
            class_name: getCourseOrClassName(keys, 'school'),
            course_semester_subjects: null,
            university_name: null,
            course_name: null,
            subjects: sub_name,
          };
        });
    };

    const processCollegeContents = (entityId: any) => {
      return dataContent
        .filter((content) => content.entity_id == entityId)
        .map((content) => {
          const parsed =
            typeof content?.course_semester_subjects === 'string'
              ? JSON.parse(content?.course_semester_subjects)
              : content?.course_semester_subjects;
          const keys = parsed ? Object.keys(parsed) : [];
          const sub_name = getSubjectsName(parsed, 'college');

          return {
            ...content,
            institute_name: getInstituteName(content.institute_id, 'college'),
            university_name: getUniversityName(content.university_id),
            course_name: getCourseOrClassName(keys, 'college'),
            class_name: null,
            className: '-',
            subjects: sub_name,
          };
        });
    };

    let filteredResults;

    if (user_type === 'admin') {
      filteredResults =
        activeTab === 0 ? configureForCollege() : configureForSchool();
    } else {
      const entityType =
        user_type === 'institute'
          ? instituteDetails?.entity_type
          : teacherDetail?.entity_type;

      filteredResults =
        entityType === 'school' ? configureForSchool() : configureForCollege();

      if (user_type === 'institute' || user_type === 'teacher') {
        filteredResults = filteredResults.filter(
          (content) => content.created_by === user_uuid,
        );
      }
    }

    setFilteredContent(filteredResults);
  }, [
    activeTab,
    dataContent,
    entity,
    columns11,
    instituteDetails,
    teacherDetail,
    user_type,
    user_uuid,
  ]);

  const handleEditFile = (id: number) => {
    const current_content = dataContent.find((content) => content.id == id);

    if (current_content.is_active) {
      navigate(`edit-content/${id}`);
    } else {
      toast.error('You cannot edit or delete Deactivated Content', {
        hideProgressBar: true,
        theme: 'colored',
      });
    }
  };

  const handlecancel = () => {
    setDataDelete(false);
  };

  const handleDeleteFiles = (id: number) => {
    const current_content = dataContent.find((content) => content.id == id);
    if (current_content.is_active) {
      setDataDeleteId(id);
      setDataDelete(true);
    } else {
      toast.error('You cannot edit or delete Deactivated Content', {
        hideProgressBar: true,
        theme: 'colored',
      });
    }
  };

  const handleDelete = (id: number | undefined) => {
    deleteData(`${DeleteContentURL}/${id}`)
      .then((data: { message: string }) => {
        toast.success(data?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
        callAPI();
        setDataDelete(false);
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
                      <div className="main_title"> Content Library</div>
                    </Typography>
                    <Button
                      className="mainbutton"
                      variant="contained"
                      component={NavLink}
                      to="add-content"
                    >
                      Add Content
                    </Button>
                  </div>
                  {user_type === 'admin' && (
                    <Tabs value={activeTab} onChange={handleTabChange}>
                      <Tab
                        label="College"
                        sx={{ color: namecolor === 'dark' ? 'white' : 'black' }}
                      ></Tab>
                      <Tab
                        label="School"
                        sx={{ color: namecolor === 'dark' ? 'white' : 'black' }}
                      />
                    </Tabs>
                  )}
                  <Box marginTop="10px">
                    <MaterialReactTable
                      columns={columns}
                      state={{
                        columnVisibility,
                      }}
                      data={filteredContent}
                      onColumnVisibilityChange={setColumnVisibility}
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
                          <Tooltip arrow placement="right" title="Edit">
                            <IconButton
                              data-testid="edit_btn"
                              sx={{
                                width: '35px',
                                height: '35px',
                                color: tabletools(namecolor),
                              }}
                              onClick={() => {
                                handleEditFile(row?.row?.original?.id);
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
        title="Content"
      />
    </>
  );
};

export default Content;
