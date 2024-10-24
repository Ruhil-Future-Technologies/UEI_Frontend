import React, { useCallback, useContext, useEffect, useState } from 'react'

import '../Course/Course.scss';
import useApi from "../../hooks/useAPI";
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { MenuListinter, UNIVERSITY_COLUMNS, UniversityRep0oDTO } from '../../Components/Table/columns';
import { EditIcon, TrashIcon } from '../../assets';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { QUERY_KEYS_COURSE, QUERY_KEYS_UNIVERSITY } from '../../utils/const';
import { toast } from 'react-toastify';
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { dataaccess, tabletools } from '../../utils/helpers';
import NameContext from '../Context/NameContext';


const University = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
    const Menulist: any = localStorage.getItem('menulist1');;
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);

      const tableheader:any = {
        light:'',dark:'#1D2A35',default:''
      }
//FOR PAGINATION CODE  
    // const [loading, setLoading] = useState(false);
    // const [pagination, setPagination] = useState({
    //  pageIndex: 0,
    //  pageSize: 100, 
    // }); 

    // const callAPI = useCallback(() => {
    //     setLoading(true);
    //     getData(`${CourseURL}?pageIndex=${pagination.pageIndex}&pageSize=${pagination.pageSize}`)
    //         .then((data) => {
    //             setDataCourse(data?.data);
    //             console.log("data test",data);
    //             // setPagination({
    //             //     pageIndex: pagination.pageIndex,
    //             //     pageSize: pagination.pageSize, 
    //             //   })
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching data:", error);
    //             toast.error("Error fetching data", {
    //                 hideProgressBar: true,
    //                 theme: "colored",
    //             });
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // }, [ pagination.pageIndex, pagination.pageSize]);

    // useEffect(() => {
    //     callAPI();
    // }, [callAPI]);

//END CODE PAGINATION

    // useEffect(() => {
    //     JSON.parse(Menulist)?.map((data: any) => {
    //         const fistMach = data?.menu_name.toLowerCase() === lastSegment && data;
    //         if (fistMach.length > 0) {
    //             setFilteredData(fistMach)
    //         }
    //         const result = data?.submenus?.filter((menu: any) => menu.menu_name.toLowerCase() === lastSegment)
    //         if (result.length > 0) {
    //             setFilteredData(result)
    //         }
    //     })
    // }, [Menulist])
    useEffect(() => {
        // let filteredData = null;
    
        // JSON.parse(Menulist)?.forEach((data: any) => {
        //     if (data?.menu_name.toLowerCase() === lastSegment) {
        //         filteredData = data; // Found a match in the main menu
        //     } else {
        //         const result = data?.submenus?.find((menu: any) => menu.menu_name.toLowerCase() === lastSegment);
        //         if (result) {
        //             // Found a match in the submenu
        //             filteredData = {
        //                 ...data,
        //                 submenus: [result] // Include only the matched submenu
        //             };
        //         }
        //     }
        // });
    
        // if (filteredData) {
        //     setFilteredData(filteredData);
           
        // } else {
        //     // Handle case when no match is found
        //     setFilteredData(null);
         
        // }
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: ""},{ datatest: "" }));
    }, [Menulist, lastSegment])
//  console.log('Menulist',filteredData,lastSegment)
    const UniversityURL = QUERY_KEYS_UNIVERSITY.GET_UNIVERSITY;
    const DeleteUniversityURL = QUERY_KEYS_UNIVERSITY.UNIVERSITY_DELETE;
    const columns = UNIVERSITY_COLUMNS;
    const navigate = useNavigate();
    const { getData, deleteData,loading } = useApi()
    // const { getData, deleteData } = useApi()
    const [dataUniversity, setDataUniversity] = useState<UniversityRep0oDTO[]>([])
    const [dataDelete, setDataDelete] = useState(false)
    const [dataDeleteId, setDataDeleteId] = useState<number>()

    const callAPI = async () => {

        getData(`${UniversityURL}`).then((data: { data: UniversityRep0oDTO[] }) => {

            if (data.data) {
                setDataUniversity(data?.data)
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

    const handleEditFile = (id: number) => {
        navigate(`edit-University/${id}`)
    };

    const handlecancel = () => {
        setDataDelete(false)
    };

    const handleDeleteFiles = (id: number) => {
        setDataDeleteId(id)
        setDataDelete(true)
    }

    const handleDelete = (id: number | undefined) => {
        deleteData(`${DeleteUniversityURL}/${id}`).then((data: { message: string }) => {
            toast.success(data?.message, {
                hideProgressBar: true,
                theme: "colored",

            });
            callAPI();
            setDataDelete(false);
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
    return (
        <>
         {loading && <FullScreenLoader />}
            <div className='main-wrapper'>
                <div className="main-content"><div className='card'>
                    <div className='card-body'>
                        <div className='table_wrapper'>
                            <div className='table_inner'>
                            <div className='containerbutton' style={{display:"flex", flexDirection:"row",justifyContent:"space-between"}}>
                                    <Typography variant="h6" sx={{m:1}}>
                                        <div className='main_title'> University</div>
                                    </Typography>
                                   
                                    {/* {filteredData?.form_data?.is_save === true && ( */}
                                            <Button
                                            className='mainbutton'
                                                variant="contained"
                                                component={NavLink}
                                                to="add-University"
                                            >
                                                Add University
                                            </Button>
                                          {/* )}   */}
                                </div>
                                <Box marginTop="10px" >
                                    <MaterialReactTable
                                        columns={columns}
                                        // data={filteredData?.form_data?.is_search ? dataUniversity : []}
                                        data={dataUniversity }
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
                                                {/* {filteredData?.form_data?.is_update === true && ( */}
                                                    <Tooltip arrow placement="right" title="Edit">
                                                        <IconButton
                                                            sx={{ width: "35px", height: "35px",color:tabletools(namecolor) }}
                                                            onClick={() => {
                                                                handleEditFile(row?.row?.original?.university_id);
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                  {/* )}  */}
                                                
                                                <Tooltip arrow placement="right" title="Delete">
                                                    <IconButton
                                                        sx={{ width: "35px", height: "35px" ,color:tabletools(namecolor) }}
                                                        onClick={() => {
                                                            handleDeleteFiles(row?.row?.original?.university_id)
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
                </div></div>
                
            </div>
            <DeleteDialog
                isOpen={dataDelete}
                onCancel={handlecancel}
                onDeleteClick={() => handleDelete(dataDeleteId)}
                title="Delete documents?"
            />
        </>
    )
}

export default University