import React, { useContext, useEffect, useState } from 'react'

import '../Submenu/Submenu.scss';
import useApi from "../../hooks/useAPI";
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { MenuListinter, SUBMENU_COLUMNS } from '../../Components/Table/columns';
import { EditIcon, TrashIcon } from '../../assets';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
import { QUERY_KEYS_SUBMENU } from '../../utils/const';
import { toast } from 'react-toastify';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { dataaccess, tabletools } from '../../utils/helpers';
import NameContext from '../Context/NameContext';

const Submenu = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
    const Menulist: any = localStorage.getItem('menulist1');;
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);

    // useEffect(() => {
    //     JSON.parse(Menulist)?.map((data: any) => {
    //         const fistMach = data?.menu_name.toLowerCase() === lastSegment && data;
    //         // console.log('Menulist menu',fistMach)
    //         if (fistMach.length > 0) {
    //             setFilteredData(fistMach)
    //         }
    //         const result = data?.submenus?.filter((menu: any) => menu.menu_name.toLowerCase() === lastSegment)
    //         // console.log('Menulist submenu',data?.submenus,lastSegment)
    //         if (result.length > 0) {
    //             setFilteredData(result)
    //         }
    //     })
    // }, [Menulist])
    useEffect(() => {
     
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck:  "sub menu"},{ datatest: "submenu" }));
    }, [Menulist, lastSegment]);
    //  console.log('Menulist',filteredData)
    const SubmenuURL = QUERY_KEYS_SUBMENU.GET_SUBMENU;
    const DeleteSubmenuURL = QUERY_KEYS_SUBMENU.SUBMENU_DELETE;
    const columns = SUBMENU_COLUMNS;
    const navigate = useNavigate();
    const { getData, deleteData,loading } = useApi()
    const [dataSubmenu, setDataSubmenu] = useState([])
    const [dataDelete, setDataDelete] = useState(false)
    const [dataDeleteId, setDataDeleteId] = useState("")
    const callAPI = async () => {
        getData(`${SubmenuURL}`).then((data: any) => {
            // const linesInfo = data || [];
            // dispatch(setLine(linesInfo))
            if (data.data) {
                setDataSubmenu(data?.data)
            }
        }).catch((e) => {
            toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
            });

        })
    }
    useEffect(() => {
        callAPI()
    }, [])
    const handleEditFile = (id: any) => {
        navigate(`edit-Submenu/${id}`)
    };
    const handlecancel = () => {

        setDataDelete(false)
    };
    const handleDeleteFiles = (id: any) => {
        setDataDeleteId(id)
        setDataDelete(true)

    }
    const handleDelete = (id: any) => {
        deleteData(`${DeleteSubmenuURL}/${id}`).then((data: any) => {
            toast.success(data?.message, {
                hideProgressBar: true,
                theme: "colored",
            });

            callAPI();
            setDataDelete(false);
        }).catch(e => {
            toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
            });
        });

    }
    // console.log("-=======----=",filteredData)
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
                                        <div className='main_title'> Submenu</div>
                                    </Typography>
                                    { filteredData?.form_data?.is_save === true && (
                                            <Button
                                             className='mainbutton'
                                                variant="contained"
                                                component={NavLink}
                                                to="add-Submenu"

                                            >
                                                Add Submenu
                                            </Button>
                                          )} 
                                    

                                </div>
                                <Box marginTop="10px" >
                                    <MaterialReactTable
                                        columns={columns}
                                        data={filteredData?.form_data?.is_search ? dataSubmenu : []}
                                        // data={ dataSubmenu}
                                        // enablePagination={false}
                                        enableRowVirtualization
                                        // enableFilters={false}
                                        // enableHiding={false}
                                        // enableDensityToggle={false}
                                        // enableFullScreenToggle={false}
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

export default Submenu