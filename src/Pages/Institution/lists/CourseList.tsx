/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import useApi from '../../../hooks/useAPI';
import Box from '@mui/material/Box';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';


interface Course {
  id: string;
  course_name: string;
  duration: string;
  semester_count:number;
  enrollment_status: string;
}
const CourseListingByInstitution = () => {
  const instituteId = localStorage.getItem("institute_id");
  const collmns: MRT_ColumnDef<Course>[] = [
    {

      accessorKey: 'course_name',
      header: 'Course Name',
      size: 150,
    },
    {

      accessorKey: 'duration',
      header: 'Duration(yr)',
      size: 150,
    },
    {
      accessorKey: 'semester_count',
      header: 'Semester Count',
      size: 150,
    },
    {
      accessorKey: 'enrollment_status',
      header: 'Enrollment Status',
      size: 150,
      Cell:({row})=>(
        row.original.enrollment_status?row.original.enrollment_status:"NA"
      )
    }
  ];
  const [dataCourses, setDataCourses] = useState<Course[]>([]);
  const { getData } = useApi();

  const getCoursesData = async () => {
    try {
      await getData(`/course/list/${instituteId}`).then((response) => {
        if (response?.status) {
          setDataCourses(response?.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCoursesData();
  }, []);
  return (
    <div className="main-wrapper">
      <div className="main-content">
        <div className="card">
          <div className="card-body">
            <div className="table_wrapper">
              <div className="table-inner">
                <Box>
                  <MaterialReactTable
                    columns={collmns}
                    data={dataCourses}
                    enableRowVirtualization
                    positionActionsColumn='first'
                    muiTablePaperProps={{
                      elevation: 0
                    }}


                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">Student Listing By Institute</div>
      </div>
    </div>
  );
};

export default CourseListingByInstitution;
