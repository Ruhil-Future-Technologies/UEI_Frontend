/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useApi from '../../../hooks/useAPI';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table';
import { Assignment } from '../../Teacher/Assignments/CreateAssignments';
import { toast } from 'react-toastify';
import PreviewIcon from '@mui/icons-material/Preview';
import './St.scss';
import {
  QUERY_KEYS_ASSIGNMENT,
  QUERY_KEYS_ASSIGNMENT_SUBMISSION,
} from '../../../utils/const';
import { AccessTime, CheckCircle, Event, ListAlt } from '@mui/icons-material';
import { convertToISTT, toTitleCase } from '../../../utils/helpers';
import AssignmentIcon from '@mui/icons-material/Assignment';
const StudentAssignments = () => {
  const { getData } = useApi();
  const navigate = useNavigate();
  const studemtId = localStorage.getItem('student_id');
  const student_uuid = localStorage.getItem('user_uuid');
  const [assignmentData, setAssignmentData] = useState<Assignment[]>([]);

  const [activeAssignmentData, setActiveAssignmentData] = useState<
    Assignment[]
  >([]);
  const [upcomingAssignmentData, setUpcomingAssignmentData] = useState<
    Assignment[]
  >([]);
  //const [gradedAssignmentData, setGradedAssignmentData] = useState(0);

  const [assignmentsSubmited, setAssignmentsSubmited] = useState<any[]>([]);
  const columns: MRT_ColumnDef<Assignment>[] = [
    {
      accessorKey: 'action',
      header: 'Action',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const assignmentId = row?.original?.id;

        return (
          <Box>
            <Link
              to={`/main/student/view-and-submit/${assignmentId}`}
              className="btn btn-primary btn-sm rounded-pill"
            >
              <PreviewIcon fontSize="small" /> Preview
            </Link>
          </Box>
        );
      },
    },
    {
      accessorKey: 'title',
      header: 'Title',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const AsisgnmnetTitle = row?.original?.title;
        const is_addtoereport = row?.original?.add_to_report;
        return (
          <div className="box">
            {is_addtoereport == true && (
              <p className="ribbon">
                <span className="text"> Add to report</span>
              </p>
            )}

            <div>{AsisgnmnetTitle}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'due_date_time',
      header: 'Due Time & Date',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const gmtDate = row?.original?.due_date_time;
        return convertToISTT(gmtDate);
      },
    },
    {
      accessorKey: 'type',
      header: 'type',
    },
    {
      accessorKey: 'points',
      header: 'Points',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const AsisgnmnetId = row?.original?.id;
        return assignmentGreded(
          AsisgnmnetId as string,
          row?.original?.points as string,
        );
      },
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
            color={val ? 'success' : 'error'}
          />
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const AsisgnmnetId = row?.original?.id;
        const result = isAssignmentSubmited(AsisgnmnetId as string);
        return <Chip label={result.label} color={result.color} />;
      },
    },
    {
      accessorKey: 'created_by_name',
      header: 'Teacher',
    },
  ];
  useEffect(() => {
    getListOfAssignments();
    getAssignmentsSubmited();
  }, []);

  const getListOfAssignments = () => {
    try {
      getData(`${QUERY_KEYS_ASSIGNMENT.GET_ASSIGNMENTS_LIST}`).then(
        (response) => {
          if (response.data) {
            const filteredAssignment = response?.data.filter(
              (assignment: any) =>
                assignment?.assign_to_students.includes(studemtId) &&
                !assignment?.save_draft &&
                assignment?.is_active,
            );
            setAssignmentData(filteredAssignment);
            const datetime = new Date();
            setActiveAssignmentData(
              filteredAssignment.filter(
                (assignment: any) =>
                  new Date(assignment.due_date_time) > datetime,
              ),
            );
            setUpcomingAssignmentData(
              filteredAssignment.filter(
                (assignment: any) =>
                  new Date(assignment.available_from) > datetime,
              ),
            );
          }
        },
      );
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center',
      });
    }
  };

  const getAssignmentsSubmited = () => {
    getData(
      `${QUERY_KEYS_ASSIGNMENT_SUBMISSION.GET_ASSIGNMENT_SUBMISSION_BY_STUDENT_ID}${student_uuid}`,
    )
      .then((response) => {
        if (response?.status) {
          setAssignmentsSubmited(response?.data);
        }
      })
      .catch((error) => {
        toast.error(error?.message, {
          hideProgressBar: true,
          theme: 'colored',
          position: 'top-center',
        });
      });
  };

  const isAssignmentSubmited = (assignmentId: string) => {
    const assign = assignmentsSubmited.filter(
      (item) => item?.assignment_id == assignmentId,
    );

    if (assign.length > 0) {
      return assign[0]?.is_submitted
        ? { label: 'Submitted', color: 'primary' }
        : assign[0]?.is_graded && { label: 'Graded', color: 'success' };
    } else {
      return { label: 'Pending', color: 'error' };
    }
  };
  const assignmentGreded = (assignmentId: string, points: string) => {
    const assign = assignmentsSubmited.filter(
      (item) => item?.assignment_id == assignmentId,
    );
    if (assign.length > 0 && assign[0].graded_points) {
      return (
        <Box display="flex" alignItems="center">
          <Typography variant="body1">
            {assign[0].graded_points}/{points}
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box display="flex" alignItems="center">
          <Typography variant="body1">NG/{points}</Typography>
        </Box>
      );
    }
  };

  const getSubjectName = (data: any) => {
    const classKey = Object.keys(data)[0];

    const subjectKey = Object.keys(data[classKey])[0];

    const values = data[classKey][subjectKey];

    return values;
  };

  const openAssignment = (id: any) => {
    navigate(`/main/student/view-and-submit/${id}`);
  };
  const gradedCount = useMemo(() => {
    return assignmentData.filter(
      (assignment: any) =>
        isAssignmentSubmited(assignment?.id).label === 'Graded',
    ).length;
  }, [assignmentData]);
  const AssignmentsCounts = [
    {
      icon: <AssignmentIcon color="success" />,
      title: 'Total Assignments',
      value: assignmentData.length,
    },
    {
      icon: <CheckCircle color="success" />,
      title: 'Active Assignments',
      value: activeAssignmentData.length,
    },
    {
      icon: <Event color="warning" />,
      title: 'Upcoming Assignments',
      value: upcomingAssignmentData.length,
    },
    {
      icon: <ListAlt color="info" />,
      title: 'Completed Assignments',
      value: gradedCount,
    },
  ];
  return (
    <>
      <div className="main-wrapper">
        <div className="main-content">
          <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
            <div className="breadcrumb-title pe-3">
              {' '}
              <Link to={'/main/dashboard'} className="text-dark">
                Dashboard
              </Link>
            </div>
            <div className="ps-3">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 p-0">
                  <li className="breadcrumb-item active" aria-current="page">
                    My Assignments
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          <Box>
            <Grid container spacing={2}>
              {AssignmentsCounts.map((stat, index) => (
                <Grid item xs={12} sm={3} key={index}>
                  <div className="rounded-4 card">
                    <div className="card-body d-flex gap-3">
                      {stat.icon}
                      <Box>
                        <Typography
                          variant="subtitle2"
                          className="fs-6 fw-semibold text-"
                        >
                          {stat.title}
                        </Typography>
                        <Typography
                          variant="h6"
                          className="fs-3 fw-bold text-dark lh-1 mt-2 mb-0"
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
            <Typography
              variant="h6"
              sx={{ mt: 4 }}
              className="mb-2 fw-semibold"
            >
              Active Assignment
            </Typography>
            {activeAssignmentData.length > 0 ? (
              <Grid container spacing={2} className="active-assignment-flow">
                {activeAssignmentData
                  .reverse()
                  .map((assignment: any, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <div className="rounded-4 card">
                        <div className="card-body">
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={1}
                          >
                            {/* <Avatar>{quiz.icon}</Avatar> */}
                            <Typography
                              variant="subtitle1"
                              className="fw-semibold"
                            >
                              {getSubjectName(
                                assignment?.class_stream_subjects
                                  ? assignment?.class_stream_subjects
                                  : assignment?.course_semester_subjects,
                              )}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              className="fw-semibold"
                            >
                              <Chip
                                label={
                                  isAssignmentSubmited(assignment.id).label
                                }
                                color={
                                  isAssignmentSubmited(assignment.id).color
                                }
                              />
                            </Typography>
                          </Box>
                          <h6 className="mt-4 fw-semibold fs-5 text-dark">
                            {toTitleCase(assignment.title)}
                          </h6>
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            sx={{ mt: 1 }}
                          >
                            <div className="small">
                              <AccessTime fontSize="small" />
                              {/* {quiz.time} */}
                            </div>
                            <div className="small">
                              <Chip
                                label={`${assignment.points} ${assignment.points === 1 ? 'mark' : 'marks'}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </div>
                          </Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mt: 1 }}
                          >
                            Due:
                            {convertToISTT(assignment?.due_date_time as string)}
                          </Typography>
                          <Button
                            variant="contained"
                            className="rounded-3"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => openAssignment(assignment.id)}
                          >
                            {isAssignmentSubmited(assignment.id).label ==
                            'Pending'
                              ? 'Attempt Assignment'
                              : 'View Assignment'}
                          </Button>
                        </div>
                      </div>
                    </Grid>
                  ))}
              </Grid>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, mb: 4 }}
              >
                No active Assignments available at the moment.
              </Typography>
            )}

            <Typography
              variant="h6"
              sx={{ mt: 4 }}
              className="mb-2 fw-semibold"
            >
              Upcoming Assignment
            </Typography>
            {upcomingAssignmentData.length > 0 ? (
              <Grid container spacing={2}>
                {upcomingAssignmentData.map((assignment: any, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <div className="rounded-4 card">
                      <div className="card-body">
                        <Box display="flex" alignItems="center" gap={1}>
                          {/* <Avatar>{quiz.icon}</Avatar> */}
                          <Typography
                            variant="subtitle1"
                            className="fw-semibold"
                          >
                            {/* {quiz.subject} */}
                          </Typography>
                        </Box>
                        <h6 className="mt-4 fw-semibold fs-5 text-dark">
                          {assignment.title}
                        </h6>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          sx={{ mt: 1 }}
                        >
                          <div className="small">
                            {/* <AccessTime fontSize="small" /> {quiz.time} */}
                          </div>
                          <div className="small">
                            <ListAlt fontSize="small" />
                            {/* {quiz.questions}{' '} */}
                            Questions
                          </div>
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          sx={{ mt: 1 }}
                        >
                          Available from:
                          {/* {quiz.availableFrom.toLocaleString()} */}
                        </Typography>
                        <Button
                          variant="outlined"
                          className="rounded-3"
                          fullWidth
                          sx={{ mt: 2 }}
                          disabled
                        >
                          Not Yet Available
                        </Button>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, mb: 4 }}
              >
                No upcoming Assignments scheduled.
              </Typography>
            )}
          </Box>
          <MaterialReactTable
            columns={columns}
            data={[...assignmentData].reverse()}
            enableColumnOrdering
            muiTableContainerProps={{
              className: 'scrollable-table-container',
            }}
            enableSorting
            enableFullScreenToggle={false}
            enableColumnDragging={false}
            enableColumnActions={false}
            enableColumnFilters={false} // Hide column filters
            enableDensityToggle={false} // Hide density toggle
          />
        </div>
      </div>
    </>
  );
};

export default StudentAssignments;
