import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FullScreenLoader from '../Loader/FullScreenLoader';
import NameContext from '../Context/NameContext';
import { tabletools } from '../../utils/helpers';
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrashIcon } from '../../assets';
import useApi from '../../hooks/useAPI';
import {
  PDF_LIST_FOR_COLLAGE_COLUMNS,
  IPDFList,
  PDF_LIST_FOR_SCHOOL_COLUMNS,
} from '../../Components/Table/columns';
import '../Uploadpdf/Uploadpdf.scss';
import { QUERY_KEYS_CLASS } from '../../utils/const';

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
  const navigate = useNavigate();
  const usertype: any = localStorage.getItem('user_type');
  let AdminId: string | null = localStorage.getItem('user_uuid');
  if (AdminId) {
    AdminId = String(AdminId);
  }
  const [fileList, setFileList] = useState<FileList[]>([]);
  const [selectedFile, setSelectedFile] = useState<IPDFList>();
  const [dataDelete, setDataDelete] = useState(false);
  const [schoolOrcollFile, setSchoolOrcollFile] = useState('college');
  const [buttenView, setButtenView] = useState(true);
  const { getData, loading, deleteData } = useApi();
  const collageColumns = PDF_LIST_FOR_COLLAGE_COLUMNS;
  const schoolColumns = PDF_LIST_FOR_SCHOOL_COLUMNS;
  const ClassURL = QUERY_KEYS_CLASS.GET_CLASS;

  useEffect(() => {
    getData(`${ClassURL}`)
      .then((response: any) => {
        if (response.status) {
          const filteredData: any[] = [];
          response?.data?.classes_data.forEach((item: any) => {
            if (item?.is_active) {
              const updatedClassName = item.class_name.split('_').join(' ');
              item.new_class_name =
                updatedClassName.charAt(0).toUpperCase() +
                updatedClassName.slice(1);
              filteredData.push(item);
            }
          });
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      });
  }, []);

  useEffect(() => {
    if (schoolOrcollFile && !dataDelete) {
      const apiUrl = `https://dbllm.gyansetu.ai/display-files?admin_id=${AdminId}&school_college_selection=${schoolOrcollFile}`;
      getData(apiUrl)
        .then((response: any) => {
          if (response) {
            setFileList(response);
          }
        })
        .catch((error) => {
          toast.error(error?.message, {
            hideProgressBar: true,
            theme: 'colored',
          });
        });
    }
  }, [schoolOrcollFile, dataDelete]);

  if (usertype !== 'admin') {
    navigate('/main/*');
  }

  const handlecancel = () => {
    setDataDelete(false);
  };

  const handleDeleteFiles = (fileData: any) => {
    setSelectedFile(fileData);
    setDataDelete(true);
  };

  const handleDelete = () => {

    if (selectedFile?.pdf_id) {
      const payload: { file_id: string } = { file_id: selectedFile.pdf_id };
      deleteData(`https://dbllm.gyansetu.ai/delete-files`, payload)
        .then((data: any) => {
          if (data.message) {
            setDataDelete(false);
            toast.success(data?.message, {
              hideProgressBar: true,
              theme: 'colored',
            });
          }
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
    }
  };
  const handlefilter = (e: any) => {
    if (e == 'school') {
      setButtenView(false);
      setSchoolOrcollFile('school');
    } else {
      setButtenView(true);
      setSchoolOrcollFile('college');
    }
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
                  ></div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '20px',
                      marginBottom: '20px',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <button
                        name="college"
                        className="btn btn-primary m-2"
                        onClick={() => handlefilter('college')}
                        disabled={buttenView}
                      >
                        College
                      </button>
                      <button
                        name="school"
                        className="btn btn-primary"
                        disabled={!buttenView}
                        onClick={() => handlefilter('school')}
                      >
                        School
                      </button>
                    </div>
                  </div>
                  <Box marginTop="10px">
                    <MaterialReactTable
                      columns={
                        schoolOrcollFile == 'college'
                          ? collageColumns
                          : schoolColumns
                      }
                      data={fileList}
                      enableRowVirtualization
                      enableColumnResizing
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
                          <Tooltip arrow placement="bottom" title="View">
                            <a
                              href={`https://dbllm.gyansetu.ai/files/${row?.row?.original?.pdf_path}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <IconButton
                                sx={{
                                  width: '35px',
                                  height: '35px',
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
                                width: '35px',
                                height: '35px',
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
        title="PDF File"
      />
    </>
  );
};

export default PDFList;
