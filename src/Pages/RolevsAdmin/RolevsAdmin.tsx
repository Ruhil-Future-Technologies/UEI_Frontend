import React, { useContext, useEffect, useState } from 'react'

import '../RolevsAdmin/RolevsAdmin.scss';
import useApi from "../../hooks/useAPI";
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { MenuListinter, ROLEVSADMIN_COLUMNS } from '../../Components/Table/columns';
import { EditIcon, TrashIcon } from '../../assets';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { QUERY_KEYS_ROLEVSADMIN } from '../../utils/const';
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
import { toast } from 'react-toastify';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { dataaccess, tabletools } from '../../utils/helpers';
import NameContext from '../Context/NameContext';


const RoleVsAdmin = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
    const roleset = lastSegment == "rolevsadmin" ? "RoleVsUser" : lastSegment
    const Menulist: any = localStorage.getItem('menulist1');;
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);
// console.log("Role",lastSegment,roleset)
    // useEffect(() => {
    //     JSON.parse(Menulist)?.map((data: any) => {
    //         const fistMach = data?.menu_name.toLowerCase() === roleset.toLowerCase() && data;
    //         if (fistMach.length > 0) {
    //             setFilteredData(fistMach)
    //         }
    //         const result = data?.submenus?.filter((menu: any) => menu.menu_name.toLowerCase() === roleset.toLowerCase())
    //         if (result.length > 0) {
    //             setFilteredData(result)
    //         }
    //     })
    // }, [Menulist])
    useEffect(() => {
       
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: "role vs user"},{ datatest: "rolevsuser" }));
    }, [Menulist, lastSegment]);
    const RolevsAdminURL = QUERY_KEYS_ROLEVSADMIN.GET_ROLEVSADMIN;
    const DeleteRolevsAdminURL = QUERY_KEYS_ROLEVSADMIN.ROLEVSADMIN_DELETE;
    const columns = ROLEVSADMIN_COLUMNS;
    const navigate = useNavigate();
    const { getData, deleteData,loading } = useApi()
    const [dataRolevsAdmin, setDataROleVsAdmin] = useState([])
    const [dataDelete, setDataDelete] = useState(false)
    const [dataDeleteId, setDataDeleteId] = useState("")
    const callAPI = async () => {
        getData(`${RolevsAdminURL}`).then((data: any) => {
            // const linesInfo = data || [];
            // dispatch(setLine(linesInfo))
            if (data?.data) {
                setDataROleVsAdmin(data?.data || [])
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
    const handleEditFile = (id: any) => {
        navigate(`edit-RolevsAdmin/${id}`)
    };
    const handlecancel = () => {

        setDataDelete(false)
    };
    const handleDeleteFiles = (id: any) => {
        setDataDeleteId(id)
        setDataDelete(true)

    }
    const handleDelete = (id: any) => {
        deleteData(`${DeleteRolevsAdminURL}/${id}`).then((data: any) => {
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
                <div className="main-content">
                <div className='card'>
                    <div className='card-body'>
                        <div className='table_wrapper'>
                            <div className='table_inner'>
                            <div className='containerbutton' style={{display:"flex", flexDirection:"row",justifyContent:"space-between"}}>
                                    <Typography variant="h6" sx={{m:1}}>
                                        <div className='main_title'> Role Vs User</div>
                                    </Typography>
                                    { filteredData?.form_data?.is_save === true && (
                                            <Button
                                             className='mainbutton'
                                                variant="contained"
                                                component={NavLink}
                                                to="add-RoleVsAdmin"
                                            >
                                                Add Role&nbsp;<span className='rolevsadminbtn'> vs</span>&nbsp;User
                                            </Button>
                                          )}  

                                </div>
                                <Box marginTop="10px" >
                                    <MaterialReactTable
                                        columns={columns}
                                        data={filteredData?.form_data?.is_search ? dataRolevsAdmin : []}
                                        // data={ dataRolevsAdmin }
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

export default RoleVsAdmin