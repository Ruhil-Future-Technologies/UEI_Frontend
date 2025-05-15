/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import './Style.scss';
import { MaterialReactTable, MRT_ColumnDef, MRT_Row } from 'material-react-table';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import useApi from '../../../hooks/useAPI';
import { toast } from 'react-toastify';
import Student from '../../Student/Student';
import { useLocation } from 'react-router-dom';
import { formatDate } from '../../../utils/helpers';
interface Student {
  class_id?: any
  class_name?: any
  course_id?: any
  name?: any
  sem_id?: any
  semester_number?: any
  stream?: any
  subject_id?: any
  dob?:any
  subject_name?: any
  profileImage?: any
}
export const StudentDetails = () => {
  const userId = localStorage.getItem('teacher_id');
  const { getData } = useApi();
  const [listOfStudent, setListOfStudent] = useState<Student[]>([]);
  const location = useLocation(); // ✅ This is from React Router
  const queryParams = new URLSearchParams(location.search);
  const classId = queryParams.get('class_id');
  const subject = queryParams.get('subject');
  const course = queryParams.get('course_id');
  const semester = queryParams.get('semester_number');
  const type = queryParams.get('type')
  console.log(type);
  useEffect(() => {
    getStudentsForTeacher()
  }, [])

  const getStudentsForTeacher = () => {
    try {


      getData(`/student_teacher/teacher/${userId}/students`)
        .then((response) => {
          if (response.status) {
            console.log(course, semester, subject, classId)
            if (type == "college") {
              setListOfStudent(response.data.filter((student: any) => student.course_id == course && student.semester_number == semester && student.subject_name == subject));
            } else {
              setListOfStudent(response.data.filter((student: any) => student.class_id == classId && student.subject_name == subject));
            }
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
  const columns: MRT_ColumnDef<Student>[] = [
    {
      accessorKey: 'profileImage',
      header: 'Profile',
      Cell: () => (
        <img
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt="Profile"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Full Name'
    },
    {
      accessorKey: 'gender',
      header: 'gender'
    },
    {
      accessorKey: 'dob',
      header: 'DOB',
      Cell:({row}:{row:MRT_Row<Student>})=>{
        
        return formatDate(row?.original?.dob,true);
      }
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'phone',
      header: 'Contact no.'
    },
  ];

  console.log(listOfStudent);
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
                  <MaterialReactTable columns={columns} data={listOfStudent} />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
