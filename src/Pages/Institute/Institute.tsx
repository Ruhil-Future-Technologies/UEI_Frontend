import React, { useContext, useEffect, useState } from 'react'

import '../Institute/Institute.scss';
import useApi from "../../hooks/useAPI";
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import { INSITUTION_COLUMNS, InstituteRep0oDTO, MenuListinter } from '../../Components/Table/columns';
import { EditIcon, TrashIcon } from '../../assets';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
import { QUERY_KEYS } from '../../utils/const';
import { toast } from 'react-toastify';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { dataaccess, tabletools } from '../../utils/helpers';
import NameContext from '../Context/NameContext';

const Institute = () => {
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
    // console.log('Menulist', filteredData,)
    const InstituteURL = QUERY_KEYS.GET_INSTITUTES;
    const DeleteInstituteURL = QUERY_KEYS.INSTITUTE_DELETE;
    const columns11 = INSITUTION_COLUMNS;
    const navigate = useNavigate();
    const { getData, deleteData,loading } = useApi()
    const [dataInstitute, setDataInstitute] = useState<InstituteRep0oDTO[]>([])
    const [dataDelete, setDataDelete] = useState(false)
    const [dataDeleteId, setDataDeleteId] = useState<number>()

    const [columns, setColumns] = useState<MRT_ColumnDef<InstituteRep0oDTO>[]>(columns11);

    // Calculate and update column widths based on content length
    useEffect(() => {
        const updatedColumns = columns11.map(column => {
          if (column.accessorKey === 'email_id') {
            // Calculate the maximum width needed for 'email_id' column based on data
            const maxWidth = Math?.max(...dataInstitute?.map(item => (item?.email_id ? item?.email_id?.length * 10 : 0))); // Adjust multiplier as needed
            return { ...column, size: maxWidth };
          }
          if (column.accessorKey === 'website_url') {
            // Calculate the maximum width needed for 'email_id' column based on data
            const maxWidth = Math?.max(...dataInstitute?.map(item => (item?.website_url ? item?.website_url?.length * 7 : 0))); // Adjust multiplier as needed
            return { ...column, size: maxWidth };
          }
          return column;
        });
      
        setColumns(updatedColumns);
      }, [dataInstitute, columns11]);

    const callAPI = async () => {
        getData(`${InstituteURL}`).then((data: { data: InstituteRep0oDTO[] }) => {
            if (data.data) {
                setDataInstitute(data?.data)
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
        navigate(`edit-Institute/${id}`)
    };

    const handlecancel = () => {
        setDataDelete(false)
    };

    const handleDeleteFiles = (id: number) => {
        setDataDeleteId(id)
        setDataDelete(true)
    }

    const handleDelete = (id: number | undefined) => {
        deleteData(`${DeleteInstituteURL}/${id}`).then((data: { message: string }) => {
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
                                        <div className='main_title'> Institute</div>
                                    </Typography>
                                    { filteredData?.form_data?.is_save === true && (
                                            <Button
                                             className='mainbutton'
                                                variant="contained"
                                                component={NavLink}
                                                to="add-Institute"
                                            >
                                                Add Institute
                                            </Button>
                                          )} 

                                </div>
                                <Box marginTop="10px" >
                                    <MaterialReactTable
                                        columns={columns}
                                        // data={ dataInstitute }
                                        data={filteredData?.form_data?.is_search ? dataInstitute : []}
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
                                                        sx={{ width: "35px", height: "35px" ,color:tabletools(namecolor)}}
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

export default Institute