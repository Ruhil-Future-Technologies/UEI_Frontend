/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import './Style.scss';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
interface Student {
  profileImage: string;
  fname: string;
  lname: string;
  email: string;
  mobile: number;
  gendar: string;
  dob: string;
}
export const StudentDetails = () => {
  const columns: MRT_ColumnDef<Student>[] = [
    {
      accessorKey: 'profileImage',
      header: 'Profile',
      Cell: ({ cell }: { cell: any }) => (
        <img
          src={cell.getValue()}
          alt="Profile"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
      ),
    },
    { accessorKey: 'fname', header: 'First Name' },
    { accessorKey: 'lname', header: 'Last Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'mobile', header: 'Email' },
    { accessorKey: 'gendar', header: 'Gendar' },
    { accessorKey: 'dob', header: 'DOB' },
  ];

  const data: Student[] = [
    {
      profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
      fname: 'Rahul',
      lname: 'Sharma',
      email: 'john@example.com',
      mobile: 9989658978,
      gendar: 'male',
      dob: '12-12-2020',
    },
  ];

  return (
    <>
      <div className="dashboard">
        <div className="main-wrapper">
          <div className="main-content">
            <h2 className="fs-5 fw-bold  mt-2">Student Details</h2>
            <Breadcrumbs aria-label="breadcrumb" className='small'>
              <Link color="inherit" href="/teacher-dashboard">
                Home
              </Link>              
              <Typography color="textPrimary">Student Details</Typography>
            </Breadcrumbs>
            <div className="table_wrapper mt-4">
              <div className="table_inner">
                <Box marginTop="10px" className="rounded-4 overflow-hidden">
                  <MaterialReactTable columns={columns} data={data} />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
