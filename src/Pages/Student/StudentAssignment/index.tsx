/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../../../hooks/useAPI";
import { Box, Chip } from "@mui/material";
import { MaterialReactTable, MRT_ColumnDef, MRT_Row } from "material-react-table";
import { Assignment } from "../../Teacher/Assignments/CreateAssignments";
import { toast } from "react-toastify";
import PreviewIcon from '@mui/icons-material/Preview';



const StudentAssignments = () => {

    const { getData } = useApi();
    const studemtId = localStorage.getItem('student_id');
    const [assignmentData, setAssignmentData] = useState<Assignment[]>([])
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
        },
        {
            accessorKey: 'due_date_time',
            header: 'Due Time & Date',
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
                const courseKeys = row?.original?.course_semester_subjects;

                if (!courseKeys || typeof courseKeys !== 'object') return <p>No subjects</p>;

                // Cast courseKeys to a known structure
                const subjects = Object.values(courseKeys as Record<string, Record<string, string[]>>)
                    .flatMap((semesterObj) => Object.values(semesterObj))
                    .flat();

                return <p>{subjects.join(', ')}</p>;
            }
        }
        ,
        {
            accessorKey: 'status',
            header: 'Status',
            Cell: ({ row }: { row: MRT_Row<Assignment> }) => {

                const is_draft = row?.original?.save_draft;
                return (

                    <>
                        {is_draft ?
                            <Chip label="Draft" color="default" /> : <Chip label="Created" color="success" />
                        }
                        {/* <Chip label={status} />; */}
                    </>

                )
            },
        },
        {
            accessorKey: 'created_by',
            header: 'Created By',
        },
        {
            accessorKey: 'created_at',
            header: 'Created at',
        },
        {
            accessorKey: 'updated_by',
            header: 'updated by',
        },
        {
            accessorKey: 'updated_at',
            header: 'updated at',
        },

    ]

    useEffect(() => {
        getListOfAssignments();
    }, [])
    const getListOfAssignments = () => {
        try {
            getData(`/assignment/list/`).then((response) => {
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
