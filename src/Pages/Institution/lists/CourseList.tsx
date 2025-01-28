import React, { useEffect, useState } from 'react';
import useApi from '../../../hooks/useAPI';
import Box from '@mui/material/Box';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';


interface Course {
  id: string;
  course_Name: string;
  courseimage: string;
}
const CourseListingByInstitution = () => {
  const instituteId = localStorage.getItem("_id");
  const collmns: MRT_ColumnDef<Course>[] = [
    {

      accessorKey: 'course_Name',
      header: 'Course Name',
      size: 150,
    },
    {

      accessorKey: 'Duration(yr)',
      header: 'Duration(yr)',
      size: 150,
    },
    {
      accessorKey: 'course_Name',
      header: 'Course Name',
      size: 150,
    }
  ];
  const [dataCourses, setDataCourses] = useState<Course[]>([]);
  const { getData } = useApi();

  const getCoursesData = async () => {
    try {
      await getData(`/course/list/${instituteId}`).then((response) => {
        console.log(response);
        if (response?.status === 200) {
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
