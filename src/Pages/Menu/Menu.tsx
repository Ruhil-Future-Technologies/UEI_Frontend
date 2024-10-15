import React, { useContext, useEffect, useState } from 'react'

import '../Menu/Menu.scss';
import useApi from "../../hooks/useAPI";
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { MENU_COLUMNS, MenuListinter, } from '../../Components/Table/columns';
import { EditIcon, TrashIcon } from '../../assets';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { QUERY_KEYS_MENU } from '../../utils/const';
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
import { toast } from 'react-toastify';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { dataaccess, tabletools } from '../../utils/helpers';
import NameContext from '../Context/NameContext';


const Menu = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
    const Menulist: any = localStorage.getItem('menulist1');
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);

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
       
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: ""},{ datatest: "" }));
    }, [Menulist, lastSegment]);
    const MenuURL = QUERY_KEYS_MENU.GET_MENU;
    const DeleteMenuURL = QUERY_KEYS_MENU.MENU_DELETE;
    const columns = MENU_COLUMNS;
    const navigate = useNavigate();
    const { getData, deleteData,loading } = useApi()
    const [dataMenu, setDataMenu] = useState([])
    const [dataDelete, setDataDelete] = useState(false)
    const [dataDeleteId, setDataDeleteId] = useState("")
    const callAPI = async () => {

        getData(`${MenuURL}`).then((data: any) => {
            // const linesInfo = data || [];
            // dispatch(setLine(linesInfo))
            if (data.data) {
                setDataMenu(data?.data)
            }
        }).catch(e => {
            toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
            });
        });

    }
    useEffect(() => {
        callAPI()
    }, [])

    const handleEditFile = (id: any) => {
        navigate(`edit-Menu/${id}`)
    };
    const handlecancel = () => {

        setDataDelete(false)
    };
    const handleDeleteFiles = (id: any) => {
        setDataDeleteId(id)
        setDataDelete(true)

    }

    // const handleDelete = async (id: any) => {
    //     try {
    // deleteData(`${DeleteMenuURL}/${id}`).then((data: any) => {
    //         toast.success(data?.message, {
    //             hideProgressBar: true,
    //             theme: "colored",
    //         });
    //     }).catch(e => {
    //         toast.error(e?.message, {
    //             hideProgressBar: true,
    //             theme: "colored",
    //         });
    //     });
    // }
    const handleDelete = async (id: any) => {
        try {
            const response = await deleteData(`${DeleteMenuURL}/${id}`);
            if (response.status === 200) {
                toast.success('Menu deleted successfully', {
                    hideProgressBar: true,
                    theme: 'colored',
                });
                // Refresh the data after successful deletion
                callAPI();
                setDataDelete(false);
            } else {
                throw new Error(response.message || 'Failed to delete');
            }
        } catch (e: any) {
            toast.error(e?.message || 'Request failed', {
                hideProgressBar: true,
                theme: 'colored',
            });
        }
    };

    return (

        <>
         {loading && <FullScreenLoader />}
            <div className='main-wrapper'>
                <div className="main-content">
                <div className='card'>
                    <div className='card-body'>
                        <div className='table_wrapper'>
                            <div className='table_inner'>
                            <div className='containerbutton' style={{display:"flex", flexDirection:"row",justifyContent:"space-between"}}>
                                    <Typography variant="h6"sx={{m:1}}>
                                        <div className='main_title'> Menu</div>
                                    </Typography>
                                    {filteredData?.form_data?.is_save === true && (
                                            <Button
                                             className='mainbutton'
                                                variant="contained"
                                                component={NavLink}
                                                to="add-Menu"
                                            >
                                                Add Menu
                                            </Button>
                                          )} 

                                </div>
                                <Box marginTop="10px" >
                                    <MaterialReactTable
                                        columns={columns}
                                        data={filteredData?.form_data?.is_search ? dataMenu : []}
                                        // data={ dataMenu}
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
                                                {filteredData?.form_data?.is_update === true && (
                                                    <Tooltip arrow placement="right" title="Edit">
                                                        <IconButton
                                                            sx={{ width: "35px", height: "35px" ,color:tabletools(namecolor)  }}
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
                                                        sx={{ width: "35px", height: "35px"  ,color:tabletools(namecolor)}}
                                                        onClick={() => {
                                                            handleDeleteFiles(row?.row?.original?.id)
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
            <DeleteDialog
                isOpen={dataDelete}
                onCancel={handlecancel}
                onDeleteClick={() => handleDelete(dataDeleteId)}
                title="Delete documents?"
            />
        </>
    )
}

export default Menu