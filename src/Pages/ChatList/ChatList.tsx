import React, { useEffect, useState } from 'react'

import '../ChatList/ChatList.scss';
import useApi from "../../hooks/useAPI";
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { CHATLIST_COLUMNS, COURSE_COLUMNS, ChatListRep0oDTO, CourseRep0oDTO, MenuListinter } from '../../Components/Table/columns';
import { EditIcon, TrashIcon } from '../../assets';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { QUERY_KEYS, QUERY_KEYS_COURSE } from '../../utils/const';
import { toast } from 'react-toastify';
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { dataaccess } from '../../utils/helpers';


const ChatList = () => {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
    const Menulist: any = localStorage.getItem('menulist1');;
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);

    useEffect(() => {
        // JSON.parse(Menulist)?.map((data: any) => {
        //     const fistMach = data?.menu_name.toLowerCase() === lastSegment && data;
        //     if (fistMach.length > 0) {
        //         setFilteredData(fistMach)
        //     }
        //     const result = data?.submenus?.filter((menu: any) => menu.menu_name.toLowerCase() === lastSegment)
        //     if (result.length > 0) {
        //         setFilteredData(result)
        //     }
        // })
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: "chat list"},{ datatest: "chatlist" }));
    }, [Menulist])
// //  console.log('Menulist',filteredData,lastSegment)
    const ChatListURL = QUERY_KEYS.CHAT_LISTGETALL;
//     const DeleteCourseURL = QUERY_KEYS_COURSE.COURSE_DELETE;
    const columns = CHATLIST_COLUMNS;
    const navigate = useNavigate();
    const { getData,loading } = useApi()
    const [dataAll, setDataAll] = useState<ChatListRep0oDTO[]>([])
//     const [dataDelete, setDataDelete] = useState(false)
//     const [dataDeleteId, setDataDeleteId] = useState<number>()

    const callAPI = async () => {
        getData(`${ChatListURL}`).then((data: { data: ChatListRep0oDTO[] }) => {
            if (data?.data) {
                setDataAll(data?.data)
            }
        }).catch(e => {
            if (e?.response?.status === 401) {
                navigate("/")
            }
            toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
            });
        });
    }

    useEffect(() => {
        callAPI()
    }, [])

//     const handleEditFile = (id: number) => {
//         navigate(`edit-Course/${id}`)
//     };

//     const handlecancel = () => {
//         setDataDelete(false)
//     };

//     const handleDeleteFiles = (id: number) => {
//         setDataDeleteId(id)
//         setDataDelete(true)
//     }

//     const handleDelete = (id: number | undefined) => {
//         deleteData(`${DeleteCourseURL}/${id}`).then((data: { message: string }) => {
//             toast.success(data?.message, {
//                 hideProgressBar: true,
//                 theme: "colored",
//             });
//             callAPI();
//             setDataDelete(false);
//         }).catch(e => {
//             if (e?.response?.status === 401) {
//                 navigate("/")
//             }
//             toast.error(e?.message, {
//                 hideProgressBar: true,
//                 theme: "colored",
//             });
//         });
//     }
// console.log("testdat", dataAll)
    return (
        <>
         {loading && <FullScreenLoader />}
            <div className='dashboard'>
            <div className='main-wrapper'>
            <div className="main-content">
                <div className='card'>
                    <div className='card-body'>
                        <div className='table_wrapper'>
                            <div className='table_inner'>
                            <div className='containerbutton' style={{display:"flex", flexDirection:"row",justifyContent:"space-between"}}>
                                    <Typography variant="h6" sx={{m:1}}>
                                        <div className='main_title'> ChatList</div>
                                    </Typography>
                                   
                                   
                                </div>
                                <Box marginTop="10px" >
                                    <MaterialReactTable
                                        columns={columns}
                                        // data={filteredData?.[0]?.is_search ? dataCourse : []}
                                        data={dataAll !== undefined || null ? filteredData?.form_data?.is_search ? dataAll :[] :[]}
                                        enableRowVirtualization
                                        positionActionsColumn="first"
                                        muiTablePaperProps={{
                                            elevation: 0
                                        }}
                                        // enableRowActions
                                        // displayColumnDefOptions={{
                                        //     'mrt-row-actions': {
                                        //         header: 'Actions',
                                        //         size: 150,
                                        //     },
                                        // }}
                                        // renderRowActions={(row) => (
                                        //     <Box
                                        //         sx={{
                                        //             display: "flex",
                                        //             flexWrap: "nowrap",
                                        //             gap: "0.5",
                                        //             marginLeft: "-5px",
                                        //             width: "140px",
                                        //         }}
                                        //     >
                                        //         {/* {filteredData?.[0]?.is_update === true && ( */}
                                        //             <Tooltip arrow placement="right" title="Edit">
                                        //                 <IconButton
                                        //                     sx={{ width: "35px", height: "35px" }}
                                        //                     onClick={() => {
                                        //                         handleEditFile(row?.row?.original?.id);
                                        //                     }}
                                        //                 >
                                        //                     <EditIcon />
                                        //                 </IconButton>
                                        //             </Tooltip>
                                        //         {/* )} */}
                                                
                                        //         <Tooltip arrow placement="right" title="Delete">
                                        //             <IconButton
                                        //                 sx={{ width: "35px", height: "35px" }}
                                        //                 onClick={() => {
                                        //                     handleDeleteFiles(row?.row?.original?.id)
                                        //                 }}
                                        //             >
                                        //                 <TrashIcon />
                                        //             </IconButton>
                                        //         </Tooltip>
                                        //     </Box>
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
                onCancel={handlecancel}
                onDeleteClick={() => handleDelete(dataDeleteId)}
                title="Delete documents?"
            /> */}
        </>
    )
}

export default ChatList