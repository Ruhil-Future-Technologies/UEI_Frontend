import Box from '@mui/material/Box';
import { MaterialReactTable, MRT_ColumnDef,  } from 'material-react-table';
import React, { useEffect } from 'react';
import useApi from '../../../hooks/useAPI';
interface Teahcer{
  id: number;
  name: string;
  image: number;
  subject: string;
}

const TeacherListingByInstitution = () => {
  const instituteId=localStorage.getItem("_id");
  const collmns:MRT_ColumnDef<Teahcer>[]=[
    {
      accessorKey:'name',
      header:"Name",
      size:150
    },
    {
      accessorKey:"subject",
      header:"Subject",
      size:150
    },
    {
      accessorKey:"image",
      header:"Image",
      size:150,
    }
  ];
  const [dataTeachers, setDataTeachers] = React.useState<Teahcer[]>([]);
  const {getData,}=useApi();

  const getTeahcersData = async () => {
    try {
      await getData(`/teacher/list/${instituteId}`).then((response) => {
        console.log(response);
        if (response?.status === 200) {
          setDataTeachers(response?.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(()=>{
    getTeahcersData();
  },[])
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
                  data={dataTeachers}
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
        <div className="text-center">Student Listing By Institute</div>
      </div>
    </div>
  );
};

export default TeacherListingByInstitution;
