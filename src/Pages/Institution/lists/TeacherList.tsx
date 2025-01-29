import Box from '@mui/material/Box';
import { MaterialReactTable, MRT_ColumnDef,  } from 'material-react-table';
import React, { useEffect } from 'react';
import useApi from '../../../hooks/useAPI';
import studentimg from '../../../assets/img/ins-1.png';
interface Teahcer{
  id: number;
  first_name: string;
  last_name: string;
  pic_path: string;
  subject: string;
}

const TeacherListingByInstitution = () => {
  const instituteId=localStorage.getItem("institute_id");
  const collmns:MRT_ColumnDef<Teahcer>[]=[
    {
      accessorKey:"pic_path",
      header:"Profile pic",
      size:150,
      Cell: ({ row }) => (
        <img
          src={row.original.pic_path ? row.original.pic_path : studentimg}
          alt="Teacher"
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
      ),
    },
    {
      accessorKey: 'first_name', // Still keep the key for sorting/searching, if needed
      header: "Full Name",
      size: 150,
      Cell: ({ row }) => (
        // Combine first_name and last_name with a space
        `${row.original.first_name} ${row.original.last_name}`
      ),
    },
    {
      accessorKey:"subjects",
      header:"Subject",
      size:150
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
