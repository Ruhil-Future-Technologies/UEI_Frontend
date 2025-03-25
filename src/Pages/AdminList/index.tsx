
import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useAPI";
import { Admin, ADMIN_LIST_COLUMNS } from "../../Components/Table/columns";
import { Typography, Box } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { toast } from "react-toastify";


const AdminList = () => {
    const colunms = ADMIN_LIST_COLUMNS
    const { getData } = useApi();
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
            getData(`https://qaapi.gyansetu.ai/admin/alldata`).then((response) => {
                if (response?.status) {
                    setAdminList(response.data?.admines_data)
                }
            })
        } catch (error:any) {
             toast.error(error.message,{
                hideProgressBar:true,
                theme:'colored',
                position:'top-center'
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