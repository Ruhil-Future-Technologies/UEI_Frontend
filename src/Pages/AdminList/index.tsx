/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import useApi from "../../hooks/useAPI";
import { Admin, ADMIN_LIST_COLUMNS } from "../../Components/Table/columns";
import { Typography, Box, IconButton, Tooltip } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { toast } from "react-toastify";
import { TrashIcon } from "../../assets";
import { tabletools } from "../../utils/helpers";
import NameContext from "../Context/NameContext";
import { QUERY_KEYS_ADMIN_BASIC_INFO } from "../../utils/const";


const AdminList = () => {
    const colunms = ADMIN_LIST_COLUMNS
    const context = useContext(NameContext);
    const { namecolor }: any = context;
    const adminAllDataURL = QUERY_KEYS_ADMIN_BASIC_INFO.ADMIN_GET_ALLDATA;
    const { getData, deleteData } = useApi();
    const [adminList, setAdminList] = useState<Admin[]>([{
        id: 0,
        department_id: 0,
        first_name: '',
        last_name: '',
        gender: '',
        mother_name: '',
        father_name: '',
        dob: new Date(),
        is_active: false,
    }]);


    useEffect(() => {
        getAdminList();
    }, [])

    const getAdminList = () => {
        try {
            getData(adminAllDataURL).then((response) => {
                if (response?.status) {
                    setAdminList(response.data?.admines_data)
                }
            })
        } catch (error: any) {
            toast.error(error.message, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center'
            })
        }
    }

    const isDelete = (assignmentId: any) => {
        try {
            deleteData(`/admindelete/${assignmentId}`).then((response) => {
                if (response?.status) {
                    
                    toast.success(response.message, {
                        hideProgressBar: true,
                        theme: 'colored',
                        position: 'top-center'
                    })
                    window.location.reload();
                }
            }).catch((error) => {
                toast.error(error?.message, {
                    hideProgressBar: true,
                    theme: 'colored',
                    position: 'top-center'
                });
            });

        } catch (error: any) {
            toast.error(error?.message, {
                hideProgressBar: true,
                theme: 'colored',
                position: 'top-center'
            })
        }
    }
    return (
        <>
            <div className="main-wrapper">
                <div className="main-content">
                    <div className="card">
                        <div className="card-body">
                            <div className="table_wrapper">
                                <div className="table_inner">
                                    <div
                                        className="containerbutton"
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ m: 1 }}>
                                            <div className="main_title"> Admin</div>
                                        </Typography>

                                    </div>
                                    <Box marginTop="10px">
                                        <MaterialReactTable
                                            columns={colunms}
                                            data={adminList}
                                            enableColumnOrdering
                                            enableSorting
                                            positionActionsColumn="first"
                                            enableFullScreenToggle={false}
                                            enableColumnDragging={false}
                                            enableColumnActions={false}
                                            enableColumnFilters={false} // Hide column filters
                                            enableDensityToggle={false} // Hide density toggle
                                            muiTablePaperProps={{
                                                elevation: 0,
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
                                                        display: 'flex',
                                                        flexWrap: 'nowrap',
                                                        gap: '0.5',
                                                        marginLeft: '-5px',
                                                        width: '140px',
                                                    }}
                                                >
                                                    <Tooltip arrow placement="right" title="Delete">
                                                        <IconButton
                                                            sx={{
                                                                width: '35px',
                                                                height: '35px',
                                                                color: tabletools(namecolor),
                                                            }}
                                                            onClick={() => {
                                                                isDelete(row?.row?.original?.user_uuid);
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
        </>
    )
}

export default AdminList;