/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from 'react';
import '../Institute/Institute.scss';
import useApi from '../../hooks/useAPI';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Tab,
  Tabs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import {
  INSITUTION_COLUMNS,
  InstituteRep0oDTO,
  MenuListinter,
} from '../../Components/Table/columns';
import { EditIcon, TrashIcon } from '../../assets';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
import { QUERY_KEYS } from '../../utils/const';
import { toast } from 'react-toastify';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { dataaccess, tabletools } from '../../utils/helpers';
import NameContext from '../Context/NameContext';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility,
} from '@mui/icons-material';

interface InstituteDetails {
  institution_name?: string;
  university_name?: string;
  email_id?: string;
  mobile_no?: string;
  entity_type?: string;
  is_active?: 0 | 1;
  is_approve?: boolean;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  pincode?: string;
  website_url?: string;
  documents?: string[];
  [key: string]: any;
}

const Institute = () => {
  const context = useContext(NameContext);
  const { namecolor }: any = context;
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
  const Menulist: any = localStorage.getItem('menulist1');
  const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);

  useEffect(() => {
    setFilteredData(
      dataaccess(Menulist, lastSegment, { urlcheck: '' }, { datatest: '' }),
    );
  }, [Menulist, lastSegment]);
  const InstituteURL = QUERY_KEYS.GET_INSTITUTES;
  const DeleteInstituteURL = QUERY_KEYS.INSTITUTE_DELETE;
  const columns11 = INSITUTION_COLUMNS;
  const navigate = useNavigate();
  const { getData, putData, deleteData, loading } = useApi();
  const [dataInstitute, setDataInstitute] = useState<any[]>([]);
  const [dataDelete, setDataDelete] = useState(false);
  const [dataDeleteId, setDataDeleteId] = useState<number>();
  const [activeTab, setActiveTab] = useState(0);
  const [filteredInstitutes, setFilteredInstitutes] = useState<any[]>([]);
  const [selectedInstitute, setSelectedInstitute] = useState<InstituteDetails>(
    [],
  );

  const [columns, setColumns] =
    useState<MRT_ColumnDef<InstituteRep0oDTO>[]>(columns11);
  const [open, setOpen] = useState(false);

  // Calculate and update column widths based on content length
  useEffect(() => {
    const updatedColumns = columns11.map((column) => {
      if (column.accessorKey === 'email_id') {
        // Calculate the maximum width needed for 'email_id' column based on data
        const maxWidth = Math.max(
          ...dataInstitute.map((item) =>
            item?.email_id ? item?.email_id?.length * 10 : 0,
          ),
        ); // Adjust multiplier as needed
        return { ...column, size: maxWidth };
      }
      if (column.accessorKey === 'website_url') {
        // Calculate the maximum width needed for 'email_id' column based on data
        const maxWidth = Math.max(
          ...dataInstitute.map((item) =>
            item?.website_url ? item?.website_url?.length * 7 : 0,
          ),
        ); // Adjust multiplier as needed
        return { ...column, size: maxWidth };
      }
      return column;
    });

    setColumns(updatedColumns);
  }, [dataInstitute, columns11]);

  const callAPI = async () => {
    getData(`${InstituteURL}`)
      .then((data: {status:boolean, data: InstituteRep0oDTO[] }) => {
        if (data.status) {
          setDataInstitute(data?.data);
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

  const handleEditFile = (id: number) => {
    navigate(`edit-Institute/${id}`);
  };

  const handlecancel = () => {
    setDataDelete(false);
  };

  const handleDeleteFiles = (id: number) => {
    setDataDeleteId(id);
    setDataDelete(true);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (activeTab === 0) {
      setFilteredInstitutes(
        dataInstitute.filter((insitute) => insitute.is_approve === true),
      );
    } else {
      setFilteredInstitutes(
        dataInstitute.filter((insitute) => !insitute.is_approve),
      );
    }
  }, [activeTab, dataInstitute]);

  const handleDelete = (id: number | undefined) => {
    deleteData(`${DeleteInstituteURL}/${id}`)
      .then((data: { message: string }) => {
        toast.success(data?.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
        callAPI();
        setDataDelete(false);
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

  const handleApproveInstitute = (id: number) => {
    putData(`${QUERY_KEYS.INSITUTE_APPROVE}/${id}`)
      .then((data) => {
        if(data.status){
          callAPI();
        }
        toast.success(data.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
        
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, { hideProgressBar: true, theme: 'colored' });
      });
  };
  const handleRejectInstitute = (id: number) => {
    putData(`${QUERY_KEYS.INSITUTE_DISAPPROVE}/${id}`)
      .then((data) => {
        if(data.status){
          callAPI();
        }
        toast.success(data.message, {
          hideProgressBar: true,
          theme: 'colored',
        });
      
      })
      .catch((e) => {
        if (e?.response?.code === 401) {
          navigate('/');
        }
        toast.error(e?.message, { hideProgressBar: true, theme: 'colored' });
      });
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedInstitute([]);
  };

  const handleInstituteDetails = (id: number) => {
    const instituteDetail = filteredInstitutes.find(
      (institute) => institute.id == id,
    );
    delete instituteDetail.is_active;
    delete instituteDetail.entity_id;
    delete instituteDetail.icon;
    delete instituteDetail.id;
    delete instituteDetail.university_id;
    delete instituteDetail.institution_login_id;

    setSelectedInstitute(instituteDetail);
    setOpen(true);
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
                      <div className="main_title"> Institute</div>
                    </Typography>
                    {filteredData?.form_data?.is_save === true && (
                      <Button
                        className="mainbutton"
                        variant="contained"
                        component={NavLink}
                        to="add-Institute"
                      >
                        Add Institute
                      </Button>
                    )}
                  </div>
                  <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Total Institute" />
                    <Tab label="Pending Institute" />
                  </Tabs>
                  <Box marginTop="10px">
                    <MaterialReactTable
                      columns={columns}
                      // data={ dataInstitute }
                      data={
                        filteredData?.form_data?.is_search
                          ? filteredInstitutes
                          : []
                      }
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
                          {row.row.original.is_approve ? (
                            <>
                              {filteredData?.form_data?.is_update === true && (
                                <Tooltip arrow placement="right" title="Edit">
                                  <IconButton
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
                              )}

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
                              <Tooltip arrow placement="right" title="Details">
                                <IconButton
                                  sx={{
                                    width: '35px',
                                    height: '35px',
                                    color: tabletools(namecolor),
                                  }}
                                  onClick={() =>
                                    handleInstituteDetails(
                                      row?.row?.original?.id,
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
                                  onClick={() => {
                                    handleApproveInstitute(
                                      row?.row?.original?.id,
                                    );
                                  }}
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
                                  onClick={() => {
                                    handleRejectInstitute(
                                      row?.row?.original?.id,
                                    );
                                  }}
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
                                    handleInstituteDetails(
                                      row?.row?.original?.id,
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
                              Institute Details
                            </DialogTitle>
                            <DialogContent>
                              <div className="insitute-details">
                                {[
                                  'institution_name',
                                  'university_name',
                                  'email_id',
                                  'mobile_no',
                                  'entity_type',

                                  'address',
                                  'city',
                                  'district',
                                  'state',
                                  'country',
                                  'pincode',
                                  'website_url',

                                  'created_at',
                                  'created_by',
                                  'updated_at',
                                  'updated_by',
                                  ...Object.keys(selectedInstitute).filter(
                                    (key) =>
                                      ![
                                        'institution_name',
                                        'university_name',
                                        'email_id',
                                        'mobile_no',
                                        'entity_type',

                                        'address',
                                        'city',
                                        'district',
                                        'state',
                                        'country',
                                        'pincode',
                                        'website_url',

                                        'created_at',
                                        'created_by',
                                        'updated_at',
                                        'updated_by',
                                      ].includes(key),
                                  ),
                                ].map((key) => {
                                  if (key in selectedInstitute) {
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
                                        {key === 'website_url' ? (
                                          selectedInstitute[key] ? (
                                            <a
                                              href={
                                                selectedInstitute[
                                                  key
                                                ]?.startsWith('http')
                                                  ? selectedInstitute[key]
                                                  : `http://${selectedInstitute[key]}`
                                              }
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              style={{
                                                textDecoration: 'underline',
                                              }}
                                            >
                                              {selectedInstitute[key]}
                                            </a>
                                          ) : (
                                            'Not Available'
                                          )
                                        ) : key === 'documents' ? (
                                          Array.isArray(
                                            selectedInstitute[key],
                                          ) &&
                                          (selectedInstitute[key] as string[])
                                            .length > 0 ? (
                                            <div style={{ marginLeft: '20px' }}>
                                              {selectedInstitute[key]?.map(
                                                (
                                                  doc: string,
                                                  index: number,
                                                ) => (
                                                  <div
                                                    key={index}
                                                    style={{ margin: '5px 0' }}
                                                  >
                                                    <a
                                                      href={doc}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                    >
                                                      {doc.split('/').pop()}
                                                    </a>
                                                    {index <
                                                    (
                                                      selectedInstitute[
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
                                            selectedInstitute[key],
                                          ) ? (
                                          selectedInstitute[key].join(', ')
                                        ) : selectedInstitute[key] === null ? (
                                          'Not Available'
                                        ) : (
                                          selectedInstitute[key]?.toString()
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

export default Institute;
