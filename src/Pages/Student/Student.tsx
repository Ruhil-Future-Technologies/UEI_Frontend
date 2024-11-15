// import React, { useEffect, useState } from 'react'

// import '../Institute/Institute.scss';
// import useApi from "../../hooks/useAPI";
// import { Box, Button, IconButton, Tooltip } from '@mui/material';
// import { MaterialReactTable } from 'material-react-table';
// import { STUDENT_COLUMNS } from '../../Components/Table/columns';
// import { EditIcon, TrashIcon } from '../../assets';
// import { NavLink, useNavigate } from "react-router-dom";
// import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
// import { QUERY_KEYS_STUDENT } from '../../utils/const';
// import { toast } from 'react-toastify';

// const Student = () => {
//     const StudentURL = QUERY_KEYS_STUDENT.GET_STUDENT;
//     const DeleteStudentURL = QUERY_KEYS_STUDENT.STUDENT_DELETE;
//     const columns = STUDENT_COLUMNS;
//     const navigate = useNavigate();
//     const { getData, deleteData } = useApi()
//     const [dataStudent, setDataStudent] = useState([])
//     const [dataDelete, setDataDelete] = useState(false)
//     const [dataDeleteId, setDataDeleteId] = useState("")
//     const callAPI = async () => {
//         getData(`${StudentURL}`).then((data: any) => {
//             // const linesInfo = data || [];
//             // dispatch(setLine(linesInfo))
//             if (data.data) {
//                 setDataStudent(data?.data)
//             }
//         }).catch(e => {
//             toast.error(e?.message, {
//                 hideProgressBar: true,
//                 theme: "colored",
//             });
//         });
//     }
//     useEffect(() => {
//         callAPI()
//     }, [])
//     const handleEditFile = (id: any) => {
//         navigate(`edit-Student/${id}`)
//     };
//     const handlecancel = () => {

//         setDataDelete(false)
//     };
//     const handleDeleteFiles = (id: any) => {
//         setDataDeleteId(id)
//         setDataDelete(true)

//     }
//     const handleDelete = (id: any) => {
//         deleteData(`${DeleteStudentURL}/${id}`).then((data: any) => {
//             toast.success(data?.message, {
//                 hideProgressBar: true,
//                 theme: "colored",
//             });
//             callAPI();
//             setDataDelete(false);
//         }).catch(e => {
//             toast.error(e?.message, {
//                 hideProgressBar: true,
//                 theme: "colored",
//             });
//         });
//     }
//     return (
//         <>
//             <div className='dashboard'>

//                 <div className='card'>
//                     <div className='card-body'>

//                         <div className='table_wrapper'>
//                             <div className='table_inner'>
//                                 {/* <div className='containerbutton'>
//                                     <Button
//                                         variant="contained"
//                                         component={NavLink}
//                                         to="add-Student"

//                                     >
//                                         Add Student
//                                     </Button>
//                                 </div> */}
//                                 <Box marginTop="10px" >
//                                     <MaterialReactTable
//                                         columns={columns}
//                                         data={dataStudent}
//                                         // enablePagination={false}
//                                         enableRowVirtualization
//                                         // enableFilters={false}
//                                         // enableHiding={false}
//                                         // enableDensityToggle={false}
//                                         // enableFullScreenToggle={false}
//                                         positionActionsColumn="last"
//                                         muiTablePaperProps={{
//                                             elevation: 0
//                                         }}
//                                         enableRowActions
//                                         displayColumnDefOptions={{
//                                             'mrt-row-actions': {
//                                                 header: 'Actions',
//                                                 size: 150,
//                                             },
//                                         }}
//                                         renderRowActions={(row) => (
//                                             <Box
//                                                 sx={{
//                                                     display: "flex",
//                                                     flexWrap: "nowrap",
//                                                     gap: "0.5",
//                                                     marginLeft: "-5px",
//                                                     width: "140px",
//                                                 }}
//                                             >
//                                                 {/* <Tooltip arrow placement="right" title="Edit">
//                                                     <IconButton
//                                                         sx={{ width: "35px", height: "35px" }}
//                                                         onClick={() => {
//                                                             handleEditFile(row?.row?.original?.id);
//                                                         }}
//                                                     >
//                                                         <EditIcon />
//                                                     </IconButton>
//                                                 </Tooltip> */}
//                                                 <Tooltip arrow placement="right" title="Delete">
//                                                     <IconButton
//                                                         sx={{ width: "35px", height: "35px" }}
//                                                         onClick={() => {
//                                                             handleDeleteFiles(row?.row?.original?.id)

//                                                         }}
//                                                     >
//                                                         <TrashIcon />
//                                                     </IconButton>
//                                                 </Tooltip>
//                                             </Box>
//                                         )}
//                                     />
//                                 </Box>
//                             </div>
//                         </div>

//                     </div>
//                 </div>

//             </div>
//             <DeleteDialog
//                 isOpen={dataDelete}
//                 onCancel={handlecancel}
//                 onDeleteClick={() => handleDelete(dataDeleteId)}
//                 title="Delete documents?"
//             />
//         </>
//     )
// }

// export default Student
import React, { useContext, useEffect, useState } from 'react';
import '../Institute/Institute.scss';
import useApi from "../../hooks/useAPI";
import { Box, IconButton, Tooltip, Tabs, Tab } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { MenuListinter, STUDENT_COLUMNS } from '../../Components/Table/columns';
import { EditIcon, TrashIcon } from '../../assets';
import { useLocation, useNavigate } from "react-router-dom";
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
import { QUERY_KEYS_STUDENT } from '../../utils/const';
import { toast } from 'react-toastify';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { dataaccess, tabletools } from '../../utils/helpers';
import NameContext from '../Context/NameContext';

interface Student {
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
    is_active: boolean;  // Property to determine active/inactive status
}

const Student = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
    const Menulist: any = localStorage.getItem('menulist1');;
    const [filteredDataAcess, setFilteredDataAcess] = useState<MenuListinter | any>([]);

    // useEffect(() => {
    //     JSON.parse(Menulist)?.map((data: any) => {
    //         const fistMach = data?.menu_name.toLowerCase() === lastSegment && data;
    //         if (fistMach.length > 0) {
    //             setFilteredDataAcess(fistMach)
    //         }
    //         const result = data?.submenus?.filter((menu: any) => menu.menu_name.toLowerCase() === lastSegment)
    //         if (result.length > 0) {
    //             setFilteredDataAcess(result)
    //             console.log("filteredDataAcess =====",result)
    //         }
    //     })
    // }, [Menulist])
    useEffect(() => {
       
        setFilteredDataAcess(dataaccess(Menulist, lastSegment, { urlcheck: ""},{ datatest: "" }));
    }, [Menulist, lastSegment]);
    const StudentURL = QUERY_KEYS_STUDENT.GET_STUDENT;  // Assuming this is "/student/list"
    const DeleteStudentURL = QUERY_KEYS_STUDENT.STUDENT_DELETE;
    const columns = STUDENT_COLUMNS;
    const navigate = useNavigate();
    const { getData, deleteData,loading } = useApi();
    const [dataStudent, setDataStudent] = useState<Student[]>([]);
    const [dataDelete, setDataDelete] = useState(false);
    const [dataDeleteId, setDataDeleteId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    const callAPI = async () => {
        try {
            const response = await getData(StudentURL);
            if (response.data) {
                setDataStudent(response.data);
            }
        } catch (e: any) {
            toast.error(e.message, {
                hideProgressBar: true,
                theme: "colored",
            });
        }
    };

    useEffect(() => {
        callAPI();
    }, []);

    const handleEditFile = (id: number) => {
        navigate(`edit-Student/${id}`);
    };

    const handleCancel = () => {
        setDataDelete(false);
    };

    const handleDeleteFiles = (id: number) => {
        setDataDeleteId(id);
        setDataDelete(true);
    };

    const handleDelete = async (id: number) => {
        try {
            const response = await deleteData(`${DeleteStudentURL}/${id}`);
            toast.success(response.message, {
                hideProgressBar: true,
                theme: "colored",
            });
            callAPI();
            setDataDelete(false);
        } catch (e: any) {
            toast.error(e.message, {
                hideProgressBar: true,
                theme: "colored",
            });
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const filteredData = dataStudent.filter(student =>
        activeTab === 0 ? student.is_active : !student.is_active
    );
// console.log("filteredDataAcess",filteredDataAcess,filteredDataAcess?.form_data?.is_search)
    return (
        <>
         {loading && <FullScreenLoader />}
            <div className='dashboard'>
            <div className='main-wrapper'>
            <div className="main-content">
                <div className='card'>
                    <div className='card-body'>
                        <Tabs value={activeTab} onChange={handleTabChange}>
                            <Tab label="Active Students" />
                            <Tab label="Inactive Students" />
                        </Tabs>
                        <div className='table_wrapper'>
                            <div className='table_inner'>
                                <Box marginTop="10px">
                                    <MaterialReactTable
                                        columns={columns}
                                        data={filteredDataAcess?.form_data?.is_search ? filteredData : []}
                                        // data={filteredDataAcess?.[0]?.is_search ? filteredData : []}
                                        // data={ filteredData }
                                        enableRowVirtualization
                                        positionActionsColumn="first"
                                        muiTablePaperProps={{
                                            elevation: 0
                                        }}
                                        enableRowActions
                                        displayColumnDefOptions={{
                                            'mrt-row-actions': {
                                                header: 'Actions',
                                                size: 150,
                                            },
                                        }}
                                        renderRowActions={(row) => (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexWrap: "nowrap",
                                                    gap: "0.5",
                                                    marginLeft: "-5px",
                                                    width: "140px",
                                                }}
                                            >
                                                {filteredDataAcess?.form_data?.is_update === true && (
                                                <Tooltip arrow placement="right" title="Edit">
                                                    <IconButton
                                                        sx={{ width: "35px", height: "35px",color:tabletools(namecolor) }}
                                                        onClick={() => {
                                                            handleEditFile(row?.row?.original?.id);
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                  )}  
                                                <Tooltip arrow placement="right" title="Delete">
                                                    <IconButton
                                                        sx={{ width: "35px", height: "35px",color:tabletools(namecolor) }}
                                                        onClick={() => {
                                                            handleDeleteFiles(row.row.original.id);
                                                        }}
                                                    >
                                                        <TrashIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        )}
                                    />
                                </Box>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </div>
            <DeleteDialog
                isOpen={dataDelete}
                onCancel={handleCancel}
                onDeleteClick={() => dataDeleteId !== null && handleDelete(dataDeleteId)}
                title="Delete documents?"
            />
        </>
    );
};

export default Student;


