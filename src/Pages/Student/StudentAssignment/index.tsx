/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../../../hooks/useAPI";
import { Box, Chip, Typography } from "@mui/material";
import { MaterialReactTable, MRT_ColumnDef, MRT_Row } from "material-react-table";
import { Assignment } from "../../Teacher/Assignments/CreateAssignments";
import { toast } from "react-toastify";
import PreviewIcon from '@mui/icons-material/Preview';
import './St.scss';
import { QUERY_KEYS_ASSIGNMENT, QUERY_KEYS_ASSIGNMENT_SUBMISSION } from "../../../utils/const";

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
        const is_addtoereport = row?.original?.add_to_report
        console.log(is_addtoereport);
        return (
          <div className="box">
            {is_addtoereport == true &&
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
        if (response.status) {
          const filteredAssignment = response?.data.filter((assignment: any) => assignment?.assign_to_students.includes(studemtId) && !assignment?.save_draft)
          setAssignmentData(filteredAssignment)
        }else{
          setAssignmentData([
            {
                "add_to_report": false,
                "allow_late_submission": false,
                "assign_to_students": ["6b315e94-97e3-4e74-a717-9ad6aa4788e5","f8ef4dc8-7e36-4a9a-a9a3-5b722192353d","325ff321-8765-4c61-a6ca-c58ff78e0d1b","d302ec8a-e48f-4c5c-91b2-8486304f0327"],
                "available_from": "Fri, 28 Mar 2025 18:30:00 GMT",
                "class_stream_subjects": {
                    "8": {
                        "science": [
                            "Hindi"
                        ]
                    }
                },
                "contact_email": "atul@gmail.com",
                "course_semester_subjects": null,
                "created_at": "2025-03-28 03:28:26",
                "created_by": "863c7f0a-74cc-410c-a9aa-1ab3b2afee12",
                "created_by_name": "Test Ashish Test",
                "due_date_time": "Sun, 30 Mar 2025 18:30:00 GMT",
                "files": [
                    "https://qauploads.s3.ap-south-1.amazonaws.com/uploads/4c844aa1-368a-4b5f-a6c7-98f35e640c7b_sample_test_2_at.pdf"
                ],
                "id": "4c844aa1-368a-4b5f-a6c7-98f35e640c7b",
                "instructions": "testin",
                "is_active": true,
                "is_deleted": false,
                "notify": false,
                "points": "5",
                "questions": [],
                "save_draft": false,
                "title": "atul yadav",
                "type": "written",
                //"updated_at": "2025-03-28 03:28:26",
               // "updated_by": "863c7f0a-74cc-410c-a9aa-1ab3b2afee12"
            },
            {
                "add_to_report": true,
                "allow_late_submission": false,
                "assign_to_students": ["6b315e94-97e3-4e74-a717-9ad6aa4788e5","f8ef4dc8-7e36-4a9a-a9a3-5b722192353d","325ff321-8765-4c61-a6ca-c58ff78e0d1b","d302ec8a-e48f-4c5c-91b2-8486304f0327"],
                "available_from": "Wed, 26 Mar 2025 18:30:00 GMT",
                "class_stream_subjects": {
                    "8": {
                        "science": [
                            "Hindi"
                        ]
                    }
                },
                "contact_email": "atul@gmai.com",
                "course_semester_subjects": null,
                "created_at": "2025-03-28 03:28:26",
                "created_by": "863c7f0a-74cc-410c-a9aa-1ab3b2afee12",
                "created_by_name": "Test Ashish Test",
                "due_date_time": "Sun, 30 Mar 2025 20:30:00 GMT",
                "files": [
                    "https://qauploads.s3.ap-south-1.amazonaws.com/uploads/a9e536d8-00f8-43df-a028-0dabe54b9245_sample_test_2.pdf"
                ],
                "id": "a9e536d8-00f8-43df-a028-0dabe54b9245",
                "instructions": "testing",
                "is_active": true,
                "is_deleted": false,
                "notify": true,
                "points": "10",
                "questions": [],
                "save_draft": false,
                "title": "atul test 2",
                "type": "written",
               // "updated_at": "2025-03-28 03:28:26",
               // "updated_by": "863c7f0a-74cc-410c-a9aa-1ab3b2afee12"
            }])
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
    getData(`${QUERY_KEYS_ASSIGNMENT_SUBMISSION.GET_ASSIGNMENT_SUBMISSION_BY_STUDENT_ID}${student_uuid}`).then((response) => {
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

    const assign = assignmentsSubmited.filter((item) => item?.assignment_id == assignmentId)

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
          <Typography variant="body1">{assign[0].graded_points}/{points}</Typography>
        </Box>
      )


    } else {
      return (
        <Box display="flex" alignItems="center">
          <Typography variant="body1">NG/{points}</Typography>
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
