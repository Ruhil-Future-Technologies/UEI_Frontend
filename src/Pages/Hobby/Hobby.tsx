import React, { useContext, useEffect, useState } from 'react'

import '../Hobby/Hobby.scss';
import useApi from "../../hooks/useAPI";
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { HOBBY_COLUMNS, HobbyRep0oDTO, MenuListinter } from '../../Components/Table/columns';
import { EditIcon, TrashIcon } from '../../assets';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { QUERY_KEYS_HOBBY } from '../../utils/const';
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
import { toast } from 'react-toastify';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { dataaccess, tabletools } from '../../utils/helpers';
import NameContext from '../Context/NameContext';


const Hobby = () => {
    const context = useContext(NameContext);
    const {namecolor }:any = context;
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1].toLowerCase();
    const roleset = lastSegment == "hobby" ? "hobbies" : lastSegment
    const Menulist: any = localStorage.getItem('menulist1');;
    const [filteredData, setFilteredData] = useState<MenuListinter | any>([]);

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
       
        setFilteredData(dataaccess(Menulist, lastSegment, { urlcheck: ""},{ datatest: "" }));
    }, [Menulist, lastSegment])

    const HobbyURL = QUERY_KEYS_HOBBY.GET_HOBBY;
    const DeleteHobbyURL = QUERY_KEYS_HOBBY.HOBBY_DELETE;
    const columns = HOBBY_COLUMNS;
    const navigate = useNavigate();
    const { getData, deleteData ,loading} = useApi()
    const [dataHobby, setDataHobby] = useState<HobbyRep0oDTO[]>([])
    const [dataDelete, setDataDelete] = useState(false)
    const [dataDeleteId, setDataDeleteId] = useState<number>()

    const callAPI = async () => {
        getData(`${HobbyURL}`).then((data: { data: HobbyRep0oDTO[] }) => {
            if (data.data) {
                setDataHobby(data?.data)
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
        navigate(`edit-Hobby/${id}`)
    };

    const handlecancel = () => {
        setDataDelete(false)
    };

    const handleDeleteFiles = (id: number) => {
        setDataDeleteId(id)
        setDataDelete(true)
    }

    const handleDelete = (id: number | undefined) => {
        deleteData(`${DeleteHobbyURL}/${id}`).then((data: { message: string }) => {
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
                                    <Typography variant="h6"sx={{m:1}}>
                                        <div className='main_title'> Hobby</div>
                                    </Typography>
                                     {filteredData?.form_data?.is_save === true && ( 
                                            <Button
                                             className='mainbutton'
                                                variant="contained"
                                                component={NavLink}
                                                to="add-Hobby"
                                            >
                                                Add Hobbies
                                            </Button>
                                          )}  

                                </div>
                                <Box marginTop="10px" >
                                    <MaterialReactTable
                                        columns={columns}
                                        data={filteredData?.form_data?.is_search ? dataHobby : []}
                                        // data={ dataHobby}
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

export default Hobby