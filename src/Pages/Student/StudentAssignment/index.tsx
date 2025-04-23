/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../../../hooks/useAPI";
import { Box, Checkbox, Chip, Typography } from "@mui/material";
import { MaterialReactTable, MRT_ColumnDef, MRT_Row } from "material-react-table";
import { Assignment } from "../../Teacher/Assignments/CreateAssignments";
import { toast } from "react-toastify";
import PreviewIcon from '@mui/icons-material/Preview';
import './St.scss';
import { QUERY_KEYS_ASSIGNMENT } from "../../../utils/const";

const StudentAssignments = () => {

  const { getData } = useApi();
  const studemtId = localStorage.getItem('student_id');
  const student_uuid = localStorage.getItem('user_uuid');
  const [assignmentData, setAssignmentData] = useState<Assignment[]>([])
  const [assignmentsSubmited, setAssignmentsSubmited] = useState<any[]>([])
  const columns: MRT_ColumnDef<Assignment>[] = [
    {
      accessorKey: 'action',
      header: 'Action',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const assignmentId = row?.original?.id;

        return (
          <Box>
            <Link to={`/main/student/view-and-submit/${assignmentId}`} className="btn btn-primary btn-sm rounded-pill">
              <PreviewIcon fontSize='small' /> Preview
            </Link>
          </Box>
        )
      }
    },
    {
      accessorKey: 'title',
      header: 'Title',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const AsisgnmnetTitle = row?.original?.title;
        const is_addtoereport=row?.original?.add_to_report
        console.log(is_addtoereport);
        return (
          <div className="box">
            {is_addtoereport==true &&
              <p className="ribbon">
              <span className="text"> Add to report</span>
            </p>
            }
            
            <div>{AsisgnmnetTitle}</div>
          </div>

        );
      }
    },
    {
      accessorKey: 'due_date_time',
      header: 'Due Time & Date',
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
        return assignmentGreded(AsisgnmnetId as string, row?.original?.points as string);
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


        if (!courseKeys || typeof courseKeys !== 'object') return <p>No subjects</p>;

        // Cast courseKeys to a known structure
        const subjects = Object.values(courseKeys as Record<string, Record<string, string[]>>)
          .flatMap((semesterObj) => Object.values(semesterObj))
          .flat();

        return <p>{subjects.join(', ')}</p>;
      }
    },
    {
      header: 'Late Submission',
      accessorKey: 'allow_late_submission',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {
        const val = row?.original?.allow_late_submission
        return <Chip label={val ? "Allowed" : 'Not Allowed'} color={val ? 'success' : 'error'} />
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      Cell: ({ row }: { row: MRT_Row<Assignment> }) => {

        const AsisgnmnetId = row?.original?.id;
        return isAssignmentSubmited(AsisgnmnetId as string);
      },
    },
    {
      accessorKey: 'created_by_name',
      header: 'Teacher',
    },

  ]

  useEffect(() => {
    getListOfAssignments();
    getAssignmentsSubmited();
  }, [])
  const getListOfAssignments = () => {
    try {
      getData(`${QUERY_KEYS_ASSIGNMENT.GET_ASSIGNMENTS_LIST}`).then((response) => {
        if (response.data) {
          const filteredAssignment = response?.data.filter((assignment: any) => assignment?.assign_to_students.includes(studemtId) && !assignment?.save_draft)
          setAssignmentData(filteredAssignment)
        }
      })
    } catch (error: any) {
      toast.error(error.message, {
        hideProgressBar: true,
        theme: "colored",
        position: 'top-center'
      })
    }
  }

  const getAssignmentsSubmited = () => {
    getData(`/assignment_submission/get/submissions/${student_uuid}`).then((response) => {
      if (response?.status) {
        setAssignmentsSubmited(response?.data);
      }
    }).catch((error) => {
      toast.error(error?.message, {
        hideProgressBar: true,
        theme: 'colored',
        position: 'top-center'
      })
    })
  }

  const isAssignmentSubmited = (assignmentId: string) => {
    console.log(assignmentsSubmited)
    const assign = assignmentsSubmited.filter((item) => item?.assignment_id == assignmentId)
    console.log(assign[0], assign.length, assign[0]?.is_graded)
    if (assign.length > 0) {
      return assign[0]?.is_submitted ? (
        <Chip label="Submitted" color="primary" />
      ) : assign[0]?.is_graded && (
        <Chip label="Graded" color="success" />
      );
    } else {
      return <Chip label="Pending" color="error" />
    }
  }
  const assignmentGreded = (assignmentId: string, points: string) => {
    const assign = assignmentsSubmited.filter((item) => item?.assignment_id == assignmentId)
    console.log(assign)
    if (assign.length > 0 && assign[0].graded_points) {
      return (
        <Box display="flex" alignItems="center">
          <Checkbox checked color="primary" />
          <Typography variant="body1">{assign[0].graded_points}/{points}</Typography>
        </Box>
      )


    } else {
      return (
        <Box display="flex" alignItems="center">
          <Checkbox color="primary" />
          <Typography variant="body1">NA/{points}</Typography>
        </Box>
      )
    }
  }
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
          <MaterialReactTable
            columns={columns}
            data={assignmentData}
            enableColumnOrdering
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
  )
}


export default StudentAssignments;
