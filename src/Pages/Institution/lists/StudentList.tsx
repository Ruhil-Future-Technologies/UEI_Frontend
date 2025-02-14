import React, { useEffect, useState } from 'react';
import useApi from '../../../hooks/useAPI';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import Box from '@mui/material/Box';


interface Student {
  id: string;
  name: string;
  image: string;
  class_name: string;
}
const StudentListingByInstitution = () => {
  const instituteId = localStorage.getItem("_id");
  const { getData } = useApi();
  const collumns:MRT_ColumnDef<Student>[]=[
    {
      accessorKey:"name",
      header:"Name",
      size: 150,
    },
    {
      accessorKey:"class_name",
      header:"Class Name",
      size: 150,
    },
    {
      accessorKey:"image",
      header:"Image",
      size:150
    }
  ]
  const [dataStudents, setDataStudents] = useState<Student[]>([]);
  const getStudentsData = async () => {
    try {
      await getData(`/student/list/${instituteId}`).then((response) => {
        console.log(response);
        if (response?.status === 200) {
          setDataStudents(response?.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStudentsData();
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
                  columns={collumns}
                  data={dataStudents}
                  enableRowVirtualization
                  positionActionsColumn='first'
                  muiTablePaperProps={{
                    elevation:0
                  }}
                 

                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentListingByInstitution;
