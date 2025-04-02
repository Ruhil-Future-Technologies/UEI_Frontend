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
import { QUERY_KEYS_CLASS, QUERY_KEYS_CONTENT } from '../../utils/const';
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
  const [, setDataClasses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [filteredContent, setFilteredContent] = useState<any[]>([]);
  const columns11 = CONTENT_COLUMNS;
  const [columns, setColumns] = useState<MRT_ColumnDef<any>[]>(columns11);
  const user_type = localStorage.getItem('user_type');
  const user_uuid = localStorage.getItem('user_uuid');

  const callAPI = async () => {
    getData('/entity/list').then((data) => {
      if (data.status) {
        setEntity(data.data?.entityes_data);
      }
    });

    getData(`${QUERY_KEYS_CLASS.GET_CLASS}`).then((data) => {
      if (data.status) {
        setDataClasses(data.data);
      }
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

  useEffect(() => {
    callAPI();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (user_type === 'admin') {
      if (activeTab === 0) {
        const college: any = entity.filter(
          (ent) => ent.entity_type == 'college',
        );

        setTimeout(() => {
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
        }, 0);

        const collegeContents = dataContent
          .filter((content) => content.entity_id == college[0]?.id)
          .map((teacher) => {
            return {
              ...teacher,
              class_id: null,
              className: '-',
              class_name: '-',
            };
          });

        setFilteredContent(
          collegeContents.filter((content) => content.created_by === user_uuid),
        );
      } else if (activeTab === 1) {
        const school: any = entity.filter((ent) => ent.entity_type == 'school');

        setColumnVisibility({
          university_id: false,
          course_id: false,
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
        const schoolContents = dataContent
          .filter((content) => content.entity_id == school[0]?.id)
          .map((content) => {
            return {
              ...content,
              course_semester_subjects: null,
              university_id: null,
              course_name: '-',
              university_name: '-',
            };
          });

        setFilteredContent(schoolContents);
      }
    } else if (user_type === 'institute' || user_type === 'teacher') {
      setFilteredContent(dataContent);
    }
  }, [activeTab, dataContent, entity]);

  const handleEditFile = (id: number) => {
    navigate(`edit-content/${id}`);
  };

  const handlecancel = () => {
    setDataDelete(false);
  };

  const handleDeleteFiles = (id: number) => {
    setDataDeleteId(id);
    setDataDelete(true);
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
