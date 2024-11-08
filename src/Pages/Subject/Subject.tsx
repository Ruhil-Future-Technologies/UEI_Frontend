import React, { useContext, useEffect, useState } from 'react'

import '../Subject/Subject.scss';
import useApi from "../../hooks/useAPI";
import { Box, Button, IconButton, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { MaterialReactTable } from 'material-react-table';
import { MenuListinter, SUBJECT_COLUMNS, SUBJECT_COLUMNS_SCHOOL } from '../../Components/Table/columns';
import { EditIcon, TrashIcon } from '../../assets';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { QUERY_KEYS_SUBJECT, QUERY_KEYS_SUBJECT_SCHOOL } from '../../utils/const';
import { toast } from 'react-toastify';
import { DeleteDialog } from '../../Components/Dailog/DeleteDialog';
import FullScreenLoader from '../Loader/FullScreenLoader';
import { dataaccess, tabletools } from '../../utils/helpers';
import NameContext from '../Context/NameContext';

interface RowData {
    patientname: string;
    orderid: string;
    datetime: string;
    consultationtype: string;
    madeby: string;
    reasonforappt: string;
    fee: string;
    status: string;
    action: string;
}


const Subject = () => {
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
    // console.log('Menulist', filteredData, lastSegment)
    const SubjectURL = QUERY_KEYS_SUBJECT.GET_SUBJECT;
    const SubjectSchoolURL = QUERY_KEYS_SUBJECT_SCHOOL.GET_SUBJECT;
    const DeleteSubjectURL = QUERY_KEYS_SUBJECT.SUBJECT_DELETE;
    const DeleteSubjectSchoolURL = QUERY_KEYS_SUBJECT_SCHOOL.SUBJECT_DELETE;
    const columns = SUBJECT_COLUMNS;
    const columns_SCHOOL = SUBJECT_COLUMNS_SCHOOL;
    const navigate = useNavigate();
    const { getData, deleteData ,loading} = useApi()
    const [dataSubject, setDataSubject] = useState([])
    const [dataSubjectSchool, setDataSubjectSchool] = useState([])
    const [dataDelete, setDataDelete] = useState(false)
    const [dataDeleteId, setDataDeleteId] = useState("")
    const [tabValue, setTabValue] = useState(0);
    const callAPI = async () => {

        getData(`${SubjectURL}`).then((data: any) => {
            // const linesInfo = data || [];
            // dispatch(setLine(linesInfo))
            if (data.data) {
                setDataSubject(data?.data)
            }
        }).catch((e) => {
            toast.error(e?.message, {
                hideProgressBar: true,
                theme: "colored",
            });

        })
        getData(`${SubjectSchoolURL}`).then((data: any) => {
            // const linesInfo = data || [];
            // dispatch(setLine(linesInfo))
            if (data.data) {
                setDataSubjectSchool(data?.data)
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
        console.log("test lod id",id)
        navigate(tabValue === 0 ? `edit-Subject/${id}` : `edit-Subject-school/${id}`)
    };
    const handlecancel = () => {


        setDataDelete(false)
    };
    const handleDeleteFiles = (id: any) => {
        setDataDeleteId(id)
        setDataDelete(true)

    }
    const handleDelete = (id: any) => {
        deleteData(`${tabValue === 0 ? DeleteSubjectURL : DeleteSubjectSchoolURL}/${id}`).then((data: any) => {
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
    const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
        setTabValue(newValue);
      };
      console.log("test tabs",tabValue)
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
                                        <div className='main_title'> Subject</div>
                                    </Typography>
                                    { filteredData?.form_data?.is_save === true && (
                                            <Button
                                             className='mainbutton'
                                                variant="contained"
                                                component={NavLink}
                                                to={tabValue === 0 ? "add-Subject" : "add-Subject-school"}
                                            >
                                                Add Subject
                                            </Button>
                                          )} 

                                </div>
                                <Box>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="secondary tabs example"
              >
                <Tab value={0}  label="college" id="simple-tab-0" aria-controls="simple-tabpanel-0" />
                <Tab value={1}  label="School" id="simple-tab-1" aria-controls="simple-tabpanel-1" />
               
              </Tabs>
            </Box>
                                <Box marginTop="10px" >
                                {tabValue === 0 && (
                                    <MaterialReactTable
                                        columns={columns}
                                        data={filteredData?.form_data?.is_search ? dataSubject : []}
                                        // data={ dataSubject}
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
                                                                handleEditFile(row?.row?.original?.subject_id );
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
                                                            handleDeleteFiles(row?.row?.original?.subject_id )
                                                        }}
                                                    >
                                                        <TrashIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        )}
                                    />
                                )}
                                 {tabValue === 1 && (
                                     <MaterialReactTable
                                     columns={columns_SCHOOL}
                                     data={filteredData?.form_data?.is_search ? dataSubjectSchool : []}
                                     // data={ dataSubject}
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
                                                             handleEditFile(row?.row?.original?.subject_id);
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
                                                         handleDeleteFiles(row?.row?.original?.subject_id)
                                                     }}
                                                 >
                                                     <TrashIcon />
                                                 </IconButton>
                                             </Tooltip>
                                         </Box>
                                     )}
                                 />

                                 )}
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

export default Subject