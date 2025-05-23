/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import '../../Institute/Institute.scss';
import useApi from '../../../hooks/useAPI';
import { Box,Tabs, Tab } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
// import { EditIcon } from '../../../assets';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { DeleteDialog } from '../../../Components/Dailog/DeleteDialog';
// import { QUERY_KEYS_STUDENT } from '../../../utils/const';
import { toast } from 'react-toastify';
import FullScreenLoader from '../../Loader/FullScreenLoader';
import { col_for_t } from '../../../Components/Table/columns';
// import { dataaccess, tabletools } from '../../../utils/helpers';
// import NameContext from '../../Context/NameContext';

interface Students {
  id: number; // Assuming id is a number based on the API
  aim: string;
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;
  father_name: string;
  mother_name: string;
  guardian_name: string;
  is_kyc_verified: boolean;
  pic_path: string;
  is_active: boolean; // Property to determine active/inactive status
}

const StudentsForTeacher = () => {
//   const context = useContext(NameContext);
//   const { namecolor }: any = context;
//   const location = useLocation();
//   const pathSegments = location.pathname.split('/').filter(Boolean);
//   const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
//   const Menulist: any = localStorage.getItem('menulist1');
//   const [filteredDataAcess, setFilteredDataAcess] = useState<
//     MenuListinter | any
//   >([]);

//   useEffect(() => {
//     setFilteredDataAcess(
//       dataaccess(Menulist, lastSegment, { urlcheck: '' }, { datatest: '' }),
//     );
//   }, [Menulist, lastSegment]);
  const teacher_id = localStorage.getItem('teacher_id');
//   const DeleteStudentURL = QUERY_KEYS_STUDENT.STUDENT_DELETE;
  const columns = col_for_t(localStorage.getItem("entity") as string);
//   const navigate = useNavigate();
  const { getData, loading } = useApi();
  const [dataStudent, setDataStudent] = useState<Students[]>([]);
//   const [dataDelete, setDataDelete] = useState(false);
//   const [dataDeleteId, setDataDeleteId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const callAPI = async () => {
    try {
        const StudentForTeahcer = `/student_teacher/teacher/${teacher_id}/students`;
        const response = await getData(StudentForTeahcer);
        if (response.data) {
          setDataStudent(response.data);
        }
    } catch (e: any) {
      toast.error(e.message, {
        hideProgressBar: true,
        theme: 'colored',
      });
    }
  };

  useEffect(() => {
    callAPI();
  }, []);

//   const handleEditFile = (id: number) => {
//     navigate(`edit-Student/${id}`);
//   };

//   const handleCancel = () => {
//     setDataDelete(false);
//   };

//   const handleDeleteFiles = (id: number) => {
//     setDataDeleteId(id);
//     setDataDelete(true);
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       const response = await deleteData(`${DeleteStudentURL}/${id}`);
//       toast.success(response.message, {
//         hideProgressBar: true,
//         theme: 'colored',
//       });
//       callAPI();
//       setDataDelete(false);
//     } catch (e: any) {
//       toast.error(e.message, {
//         hideProgressBar: true,
//         theme: 'colored',
//       });
//     }
//   };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
//   let filteredData: any = [];
//   if (user_type == 'teacher') {
//     filteredData = dataStudent.filter((student) =>
//       activeTab === 0 ? student.is_active : !student.is_active,
//     );
//   }
//   else {
//     filteredData = dataStudent.filter((student) =>
//       activeTab === 0 ? student.is_active : !student.is_active,
//     );
//   }


  return (
    <>
      {loading && <FullScreenLoader />}
      <div className="dashboard">
        <div className="main-wrapper">
          <div className="main-content">
            <div className="card">
              <div className="card-body">
                <Tabs value={activeTab} onChange={handleTabChange}>
                  <Tab label="Active Students" />
                  <Tab label="Inactive Students" />
                </Tabs>
                <div className="table_wrapper">
                  <div className="table_inner">
                    <Box marginTop="10px">
                      <MaterialReactTable
                        columns={columns}
                        data={dataStudent}
                        enableRowVirtualization
                        positionActionsColumn="first"
                        muiTablePaperProps={{
                          elevation: 0,
                        }}
                        displayColumnDefOptions={{
                          'mrt-row-actions': {
                            header: 'Actions',
                            size: 150,
                          },
                        }}
                        // renderRowActions={(row) => (
                        //   <Box
                        //     sx={{
                        //       display: 'flex',
                        //       flexWrap: 'nowrap',
                        //       gap: '0.5',
                        //       marginLeft: '-5px',
                        //       width: '140px',
                        //     }}
                        //   >
                        //     {filteredDataAcess?.form_data?.is_update ===
                        //       true && (
                        //         <Tooltip arrow placement="right" title="Edit">
                        //           <IconButton
                        //             sx={{
                        //               width: '35px',
                        //               height: '35px',
                        //               color: tabletools(namecolor),
                        //             }}
                        //             onClick={() => {
                        //               handleEditFile(
                        //                 row?.row?.original?.user_uuid,
                        //               );
                        //             }}
                        //           >
                        //             <EditIcon />
                        //           </IconButton>
                        //         </Tooltip>
                        //       )}
                        //     {/* <Tooltip arrow placement="right" title="Delete">
                        //       <IconButton
                        //         sx={{
                        //           width: '35px',
                        //           height: '35px',
                        //           color: tabletools(namecolor),
                        //         }}
                        //         onClick={() => {
                        //           handleDeleteFiles(
                        //             row?.row?.original?.user_uuid,
                        //           );
                        //         }}
                        //       >
                        //         <TrashIcon />
                        //       </IconButton>
                        //     </Tooltip> */}
                        //   </Box>
                        // )}
                      />
                    </Box>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <DeleteDialog
        isOpen={dataDelete}
        onCancel={handleCancel}
        onDeleteClick={() =>
          dataDeleteId !== null && handleDelete(dataDeleteId)
        }
        title="Student"
      /> */}
    </>
  );
};

export default StudentsForTeacher;
