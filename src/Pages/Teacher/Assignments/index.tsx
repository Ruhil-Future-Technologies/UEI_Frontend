import React from 'react';
import { Link } from 'react-router-dom';
//import BookIcon from '@mui/icons-material/Book';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Chip, IconButton, Box, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type Assignment = {
  assignment: string;
  subject: string;
  dueDate: string;
  status: string;
  submissions: string;
};

const assignments: Assignment[] = [
  {
    assignment: 'Mathematics Quiz - Chapter 3',
    subject: 'Mathematics',
    dueDate: 'Feb 15, 2024',
    status: 'Active',
    submissions: '18 / 25',
  },
  {
    assignment: 'English Essay - Creative Writing',
    subject: 'English',
    dueDate: 'Feb 18, 2024',
    status: 'Draft',
    submissions: '0 / 30',
  },
  {
    assignment: 'Science Project - Solar System',
    subject: 'Science',
    dueDate: 'Feb 10, 2024',
    status: 'Closed',
    submissions: '28 / 28',
  },
  {
    assignment: 'History Assignment - World War II',
    subject: 'History',
    dueDate: 'Feb 20, 2024',
    status: 'Active',
    submissions: '15 / 32',
  },
];

const getStatusChip = (status: string) => {
  switch (status) {
    case 'Active':
      return <Chip label="Active" color="success" />;
    case 'Draft':
      return <Chip label="Draft" color="default" />;
    case 'Closed':
      return <Chip label="Closed" color="error" />;
    default:
      return <Chip label={status} />;
  }
};

const columns: MRT_ColumnDef<Assignment>[] = [
  {
    accessorKey: 'assignment',
    header: 'Assignment',
  },
  {
    accessorKey: 'subject',
    header: 'Subject',
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    Cell: ({ cell }) => getStatusChip(cell.getValue<string>()),
  },
  {
    accessorKey: 'submissions',
    header: 'Submissions',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    Cell: () => (
      <Box>
        <IconButton color="primary">
          <VisibilityIcon />
        </IconButton>
        <IconButton color="secondary">
          <EditIcon />
        </IconButton>
        <IconButton color="error">
          <DeleteIcon />
        </IconButton>
      </Box>
    ),
    enableSorting: false,
    enableColumnFilter: false,
  },
];

export const Assignments = () => {
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
            <Link to='/teacher-dashboard/create-assignment' className='btn btn-primary m-0'>Create Assignments</Link>
          </div>

          <div className="col-lg-3">
            <div className="card rounded-4 w-100 mb-0">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <p className="mb-1">Total Assignments</p>
                    <h3 className="mb-0">986</h3>
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
          <div className="col-lg-3">
            <div className="card rounded-4 w-100 mb-0">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <p className="mb-1">Pending Submissions</p>
                    <h3 className="mb-0">986</h3>
                  </div>
                  <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-danger">
                    <AccessTimeFilledIcon className="svgwhite" />
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

          <div className="col-lg-3">
            <div className="card rounded-4 w-100 mb-0">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <p className="mb-1">Graded Assignments</p>
                    <h3 className="mb-0">986</h3>
                  </div>
                  <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-danger">
                    <AccessTimeFilledIcon className="svgwhite" />
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

          <div className="col-lg-3">
            <div className="card rounded-4 w-100 mb-0">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <p className="mb-1">Active Students</p>
                    <h3 className="mb-0">986</h3>
                  </div>
                  <div className="wh-42 d-flex align-items-center justify-content-center rounded-circle bg-grd-danger">
                    <AccessTimeFilledIcon className="svgwhite" />
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
              data={assignments}
              enablePagination
              enableSorting
              enableColumnFilters
              enableStickyHeader
              muiTableContainerProps={{ sx: { maxHeight: '500px' } }}
              renderTopToolbarCustomActions={() => (
                <Typography variant="h6" sx={{ fontWeight: "bold", ml: 1 }}>
                  Recent Assignments
                </Typography>
              )}
            />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};
