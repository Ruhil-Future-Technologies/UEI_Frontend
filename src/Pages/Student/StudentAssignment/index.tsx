import React from 'react';
import { Link } from 'react-router-dom';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Chip } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
type Assignment = {
  action: string;
  topic: string;
  dueDate: string;
  endDate: string;
  status: string;
  grade: string;
  remarks: string;
};

const assignments: Assignment[] = [
  {
    action: '/main/student/view-and-submit',
    topic: 'Linear Algebra Assignment 3',
    dueDate: '2024-02-15',
    endDate: '2024-02-15',
    status: 'Pending',
    grade: '-',
    remarks: '------',
  },
  {
    action: '/main/student/view-and-submit',
    topic: 'Linear Algebra Assignment 3',
    dueDate: '2024-02-15',
    endDate: '2024-02-15',
    status: 'Submitted',
    grade: 'Checking...',
    remarks: '------',
  },
  {
    action: '/main/student/view-and-submit',
    topic: 'Linear Algebra Assignment 3',
    dueDate: '2024-02-15',
    endDate: '2024-02-15',
    status: 'Submitted',
    grade: '85/100',
    remarks: '------',
  },
];

const getStatusChip = (status: string) => {
  switch (status) {
    case 'Pending':
      return <Chip label="Pending" color="error" variant="outlined" />;
    case 'Submitted':
      return <Chip label="Submitted" color="success" variant="outlined" />;
    default:
      return <Chip label="Unknown" />;
  }
};

const columns: MRT_ColumnDef<Assignment>[] = [
  {
    accessorKey: 'action',
    header: 'Action',
    Cell: ({ row }) => (
      <Link to={row.original.action} className="btn btn-primary btn-sm rounded-pill">
        <PreviewIcon fontSize='small' /> Preview
      </Link>
    ),
  },

  {
    accessorKey: 'topic',
    header: 'Topic',
  },
  { accessorKey: 'dueDate', header: 'Due Date' },
  { accessorKey: 'endDate', header: 'End Date' },
  {
    accessorKey: 'status',
    header: 'Status',
    Cell: ({ cell }) => getStatusChip(cell.getValue<string>()),
  },
  { accessorKey: 'grade', header: 'Grade' },
  { accessorKey: 'remarks', header: 'Remarks' },
];

const StudentAssignments = () => {
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
            data={assignments}
            enableColumnOrdering
            enablePagination={false}
            enableSorting
            enableFullScreenToggle={false}
            enableColumnDragging={false}
            enableColumnActions={false}
          />
        </div>
      </div>
    </>
  );
};

export default StudentAssignments;
