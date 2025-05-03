/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CreditScoreOutlinedIcon from '@mui/icons-material/CreditScoreOutlined';

import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table';
import {
  Chip,
  IconButton,
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Switch } from '../../../Components/Switch/switch';
import DeleteIcon from '@mui/icons-material/Delete';
import useApi from '../../../hooks/useAPI';
import { Assignment } from './CreateAssignments';
import { toast } from 'react-toastify';
import GroupsIcon from '@mui/icons-material/Groups';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { QUERY_KEYS_ASSIGNMENT } from '../../../utils/const';

export const Assignments = () => {
  const { getData, putData } = useApi();
  const navigate = useNavigate();
  const [openCard, setOpenCard] = useState(false);

  const [dataDeleteId, setDataDeleteId] = useState('');
  const [assignmentData, setAssignmentData] = useState<Assignment[]>([
    {
      title: '',
      type: 'written',
      contact_email: '',
      allow_late_submission: false,
      due_date_time: '', // Or new Date().toISOString() if using Date type
      available_from: '', // Or new Date().toISOString() if using Date type
      assign_to_students: [],
      instructions: '',
      points: '',
      save_draft: false,
      add_to_report: false,
      notify: false,
      files: [], // File should be null initially
    },
  ]);
  const [draftCount, setDreftCount] = useState(0);
  const teacher_uuid = localStorage.getItem('user_uuid');

  useEffect(() => {
    getListOfAssignments();
  }, []);

  const getListOfAssignments = () => {
    try {
      getData(`${QUERY_KEYS_ASSIGNMENT.GET_ASSIGNMENTS_LIST}`).then((response) => {
        if (response.data) {
          const filteredassignment = response?.data?.filter(
            (assignmnet: any) => assignmnet.created_by == teacher_uuid,
          );
          setAssignmentData(filteredassignment);
          const filteredassignmentcount = response?.data?.filter(
            (assignmnet: any) =>
              assignmnet.save_draft && assignmnet.created_by == teacher_uuid,
          );
          setDreftCount(filteredassignmentcount.length);
        }
      });
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
    }
  };
  // const getStatusChip = (status: string) => {
  //   switch (status) {
  //     case 'Active':
  //       return <Chip label="Active" color="success" />;
  //     case 'Draft':
  //       return <Chip label="Draft" color="default" />;
  //     case 'Closed':
  //       return <Chip label="Closed" color="error" />;
  //     default:
  //       return <Chip label={status} />;
  //   }
  // };
  const viewAssignmnet = (assignmentId: any) => {
    localStorage.setItem('assignment_id', assignmentId);
    navigate(`/teacher-dashboard/assignment-details/${assignmentId}`);
  };
  const editAssignmnet = (assignmentId: any) => {
    navigate(`/teacher-dashboard/edit-assignment/${assignmentId}`, {
      state: { type: 'written' },
    });
  };
  const deleteAssignment = () => {
    try {
      putData(`${QUERY_KEYS_ASSIGNMENT.DELETE_ASSIGNMENT}${dataDeleteId}`)
        .then((response) => {
          if (response.status) {
            toast.success(response.message, {
              hideProgressBar: true,
              theme: 'colored',
              position: 'top-center',
            });
            setOpenCard(false);
            window.location.reload();
          }
        })
        .catch((error) => {
          toast.error(error.message, {
            hideProgressBar: true,
            theme: 'colored',
            position: 'top-center',
          });
        });
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
    }
  };
  const isDelete = (assignmentId: any) => {
    setDataDeleteId(assignmentId);
    setOpenCard(true);
  };
  const columns: MRT_ColumnDef<Assignment>[] = [
    {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const assignmentId = row?.original?.id;
        return (
          <Box>
            <IconButton
              color="primary"
              onClick={() => viewAssignmnet(assignmentId)}
            >
              <VisibilityIcon />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => editAssignmnet(assignmentId)}
            >
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => isDelete(assignmentId)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'due_date_time',
      header: 'Due Time & Date',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const gmtDate = new Date(row?.original?.created_at);
        const istString = gmtDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        return  istString ;
      }
    },
    {
      accessorKey: 'contact_email',
      header: 'contact email',
    },
    {
      accessorKey: 'type',
      header: 'type',
    },
    {
      accessorKey: 'points',
      header: 'Points',
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        let courseKeys = '';
        if (row?.original?.course_semester_subjects) {
          courseKeys = row?.original?.course_semester_subjects;
        } else {
          courseKeys = row?.original?.class_stream_subjects;
        }

        if (!courseKeys || typeof courseKeys !== 'object')
          return <p>No subjects</p>;

        // Cast courseKeys to a known structure
        const subjects = Object.values(
          courseKeys as Record<string, Record<string, string[]>>,
        )
          .flatMap((semesterObj) => Object.values(semesterObj))
          .flat();

        return <p>{subjects.join(', ')}</p>;
      },
    },
    {
      header: 'Late Submission',
      accessorKey: 'allow_late_submission',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const val = row?.original?.allow_late_submission;
        return (
          <Chip
            label={val ? 'Allowed' : 'Not Allowed'}
            color={val ? 'primary' : 'error'}
          />
        );
      },
    },

    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const is_draft = row?.original?.save_draft;
        return (
          <>
            {is_draft ? (
              <Chip label="Draft" color="default" />
            ) : (
              <Chip label="Created" color="success" />
            )}
            {/* <Chip label={status} />; */}
          </>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created at',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const gmtDate = new Date(row?.original?.created_at);
        const istString = gmtDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        return  istString ;
      }
    },
    {
      accessorKey: 'updated_at',
      header: 'updated at',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const gmtDate = new Date(row?.original?.updated_at);
        const istString = gmtDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        return  istString ;
      }
    },
    {
      accessorKey: 'is_active',
      header: 'Active/DeActive',
      Cell: ({ cell, row }: any) => {
        const { putData } = useApi();
        const AssignmnetActive = QUERY_KEYS_ASSIGNMENT.ACTIVATE_ASSIGNMENT;
        const AssignmnetDeactive = QUERY_KEYS_ASSIGNMENT.DEACTIVATE_ASSIGNMENT;
        const value = cell?.getValue() ?? false;
        // if (!value) {
        //   return EMPTY_CELL_VALUE;
        // }
        const [Showvalue, setShowvalue] = useState(value);
        const active = (id: number, valueset: any) => {
          putData(
            `${valueset ? AssignmnetDeactive : AssignmnetActive}${id}`,
          )
            .then((data: any) => {
              if (data.status) {
                setShowvalue(Showvalue ? 0 : 1);
                toast.success(data?.message);
                window.location.reload();
              }
            })
            .catch((e) => {
              toast.error(e?.message, {
                hideProgressBar: true,
                theme: 'colored',
              });
            });
        };

        return (
          <Box>
            <Switch
              isChecked={value}
              label={value ? 'Active' : 'Deactive'}
              // onChange={() => setShow((prevState) => !prevState)}
              onChange={() => {
                active(row?.original?.id, value);
              }}
              // disabled={true}
              activeColor="#4CAF50"
              inactiveColor="#f44336"
            />
          </Box>
        );
      },
      size: 150,
    },
  ];

  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">
            {' '}
            <Link to={'/teacher-dashboard'} className="text-dark">
              Dashboard
            </Link>
          </div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item active" aria-current="page">
                  Assignments
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-12 text-end">
            <Link
              to="/teacher-dashboard/create-assignment"
              className="btn btn-primary m-0"
              state={{ type: 'written' }}
            >
              Create Assignments
            </Link>
          </div>

          <div className="col-lg-4 col-xl-3">
            <div className="card rounded-4 w-100 mb-0">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <p className="mb-1">Total Assignments</p>
                    <h3 className="mb-0">{assignmentData.length}</h3>
                  </div>
                  <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-danger">
                    <AssignmentIcon className="svgwhite" />
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3 gap-2">
                  <div className="card-lable bg-success bg-opacity-10">
                    <p className="text-success mb-0">+34.7%</p>
                  </div>
                  <p className="mb-0 font-13">from last month</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-xl-3">
            <div className="card rounded-4 w-100 mb-0">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <p className="mb-1">Draft Submissions</p>
                    <h3 className="mb-0">{draftCount}</h3>
                  </div>
                  <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-danger">
                    <SaveAsIcon className="svgwhite" />
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3 gap-2">
                  <div className="card-lable bg-success bg-opacity-10">
                    <p className="text-success mb-0">+34.7%</p>
                  </div>
                  <p className="mb-0 font-13">from last month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-xl-3">
            <div className="card rounded-4 w-100 mb-0">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <p className="mb-1">Graded Assignments</p>
                    <h3 className="mb-0">986</h3>
                  </div>
                  <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-danger">
                    <CreditScoreOutlinedIcon className="svgwhite" />
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3 gap-2">
                  <div className="card-lable bg-success bg-opacity-10">
                    <p className="text-success mb-0">+34.7%</p>
                  </div>
                  <p className="mb-0 font-13">from last month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-xl-3">
            <div className="card rounded-4 w-100 mb-0">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <p className="mb-1">Active Assignment</p>
                    <h3 className="mb-0">
                      {assignmentData.length - draftCount}
                    </h3>
                  </div>
                  <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-danger">
                    <GroupsIcon className="svgwhite" />
                  </div>
                </div>
                <div className="d-flex align-items-center mt-3 gap-2">
                  <div className="card-lable bg-success bg-opacity-10">
                    <p className="text-success mb-0">+34.7%</p>
                  </div>
                  <p className="mb-0 font-13">from last month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <Box className="rounded-4 overflow-hidden">
              <MaterialReactTable
                columns={columns}
                data={[...assignmentData].reverse()}
                enablePagination
                enableSorting
                enableColumnFilters
                enableStickyHeader
                muiTableContainerProps={{ sx: { maxHeight: '500px' } }}
                renderTopToolbarCustomActions={() => (
                  <Typography variant="h6" sx={{ fontWeight: 'bold', ml: 1 }}>
                    Recent Assignments
                  </Typography>
                )}
              />
            </Box>
          </div>
        </div>
      </div>
      <Dialog open={openCard} onClose={() => setOpenCard(false)}>
        <DialogTitle>Delete Assignment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this assignment? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenCard(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button onClick={deleteAssignment} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
